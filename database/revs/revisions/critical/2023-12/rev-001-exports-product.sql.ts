import {patchSQL, sql} from "kitres";

export const conta_add_columns = patchSQL({ unique: true } ).sql`
alter table tweeks.conta add column conta_currency_uid uuid default null;
alter table tweeks.conta add column conta_cambio_uid uuid default null;
alter table tweeks.venda alter column venda_metadata type jsonb using venda_metadata::jsonb;
`;


export const conta_add_conta_taxacambio = patchSQL({ unique: true } ).sql`
alter table tweeks.conta add column conta_taxacambio double precision default null;
`;
export const conta_currency_uid = patchSQL({ unique: true}).sql`
alter table tweeks.conta rename column conta_currency_uid to conta_currency_id;
alter table tweeks.conta alter conta_currency_id type int2 using null;
`;

export const Rev001ExportsProductSql = sql`
create or replace function tweeks.funct_load_artigo_exports( args jsonb )
returns setof jsonb language plpgsql as $$
declare
  /**doc
    arg_espaco_auth
    arg_colaborador_uid
    _espaco_id:[]
   doc*/
  
  _arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _arg_colaborador_uid uuid default args->>'arg_colaborador_uid';
  
  __branch uuid default tweeks.__branch_uid( _arg_colaborador_uid, _arg_espaco_auth );
  _child uuid[] default rule.espaco_get_childrens_static( _arg_espaco_auth );

  _espaco uuid[] default array( select e.text::uuid from jsonb_array_elements_text( args->'_espaco_id' ) e ( text ));
  _product record;
  _const map.constant;
begin
  _const := map.constant();
  for _product in
    with __imposto as (
      select 
          io.imposto_artigo_id as _artigo_uid,
          io.imposto_percentagem,
          io.imposto_valor,
          io.imposto_id,
          tp.tipoimposto_id,
          tp.tipoimposto_nome,
          tp.tipoimposto_percentagem,
          tp.tipoimposto_valor,
          tp.tipoimposto_codigo,
          ta.taxa_id,
          ta.taxa_percentagem,
          ta.taxa_taxa,
          ta.taxa_estado,
          tap.taplicar_id,
          tap.taplicar_descricao
        from tweeks.imposto io
          inner join tweeks.tipoimposto tp on io.imposto_tipoimposto_id = tp.tipoimposto_id
          inner join tweeks.taxa ta on tp.tipoimposto_id = ta.taxa_tipoimposto_id
          inner join tweeks.taplicar tap on io.imposto_taplicar_id = tap.taplicar_id
        where io.imposto_estado = 1
          and tp.tipoimposto_estado = 1
          and ta._branch_uid = __branch
          and tp._branch_uid = __branch
          and io._branch_uid = __branch
    ), __ean as (
      select
          ean_artigo_id as _artigo_uid, 
          e.ean_id,
          ean_code,
          ean_dateout,
          ean_datein,
          ean_estado,
          ean_date
        from tweeks.ean e
        where e._branch_uid = __branch
    ), __artigo_ean as (
      select 
        e._artigo_uid as _artigo_uid,
        array_agg(e) as eans
        from __ean e 
        group by e._artigo_uid
    ), __artigo_impostos as (
      select
          array_agg(e) as impostos,
          _artigo_uid
        from __imposto e
        group by e._artigo_uid
    ), __artigo as (
      select
          art.*,
          u.*,
          uorig.unit_id as unit_originid,
          uorig.unit_code as unit_origncode,
          uorig.unit_name as unit_origenname,
          art.artigo_espaco_auth = any( _child ) as artigo_owner,
          coalesce( s.stock_quantidade, 0 ) as stock_quantidade,
          origin.artigo_id as origin_id,
          origin.artigo_codigo as origin_codigo,
          origin.artigo_descricao as orign_descricao,
          origin.artigo_nome as origin_nome,
          origin.artigo_compostoquantidade as orign_compostoquantidade,
          origin.artigo_artigo_id as origin_origin_id,
    
          count( l.link_id ) as _counts,
          coalesce( array_agg( l.link_espaco_destino ) filter ( where l.link_id is not null ), array[]::uuid[] )  as links,
          coalesce( array_agg( l ) filter ( where l.link_id is not null ), '{}'::tweeks.link[] ) as armazems
        from tweeks.artigo art
          left join tweeks.unit u on art.artigo_unit_id = u.unit_id
          left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
          left join tweeks.unit uorig on origin.artigo_unit_id = uorig.unit_id

          
          left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
            and ( l.link_referencia->>'artigo_id' )::uuid = art.artigo_id
            and l.link_espaco_destino = any( _espaco )
            and l.link_tlink_id = _const.maguita_tlink_preco
            and l._branch_uid = __branch
          
          left join tweeks.stock s on art.artigo_id = s.artigo_id
            and s.espaco_id = any( _espaco )
            and s._branch_uid = __branch
        where art._branch_uid = __branch
        group by 
          art.artigo_id,
          u.unit_id,
          uorig.unit_id,
          origin.artigo_id,
          s.stock_quantidade
    ) select
          art.*,
          coalesce( ip.impostos, '{}' ) as impostos,
          coalesce( ea.eans, '{}' ) as eans
        from __artigo art
          left join __artigo_impostos ip on art.artigo_id = ip._artigo_uid
          left join __artigo_ean ea on art.artigo_id = ea._artigo_uid
        where art._counts > 0
  loop 
    return next to_jsonb( _product );
  end loop;
end;
$$
`;


export const funct_pos_reg_conta  = sql`
create or replace function tweeks.funct_pos_reg_conta(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    Essa função registra um nova conta
    arg = {
      -- obrigatorios
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,

      conta_posto_id: ID,
      _serie_id: UUID

      -- opcional
      conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM }
      conta_id: ID?
      conta_extension: {} | { reserva_id: UID }
      conta_chave: CHAVE

      conta_currency_id: ID,
      conta_tpaga_id: ID,

      conta_cliente_id:UID
      conta_titular: CLIENTE-NOME
      conta_titularnif: CLIENTE-NIF
      conta_data: DATA,
      conta_tserie_id

      -- requerido
      arg_vendas: [
        {
          venda_id?: UID,
          venda_artigo_id: UID,
          venda_quantidade: QUANT,
          venda_custounitario: COST
          venda_custoquantidade: COST

          + venda_editado
          + venda_isencao
          + venda_montante
          + venda_montanteagregado
          + venda_montantetotal
          + venda_imposto
          + venda_montantesemimposto
          + venda_montantecomimposto
          + venda_impostoadicionar
          + venda_impostoretirar

          + venda_descricao
          + venda_lote
          + venda_validade
          + venda_metadata

          arg_itens: [
              venda_id: UID
              venda_artigo_id: UID,
              venda_quantidade: QUANT,
              venda_custounitario: COST
              venda_custoquantidade: COST
              venda_descricao: DESCRICAO
              venda_lote: LOTE
              venda_validade: VALIDADE
              venda_metadata: {... any extras data}
            + venda_montantetotal
          ]
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_conta_id uuid default args->>'conta_id';
  arg_conta_chave character varying not null default args->>'conta_chave';
  arg_vendas jsonb not null default args->>'arg_vendas';

  _conta tweeks.conta;
  _const map.constant;
  _unsets jsonb[];
  _vendas uuid[] default array( select ( e.doc->>'venda_id' )::uuid from jsonb_array_elements( args->'arg_vendas' ) e ( doc ) where e.doc->>'venda_id' is not null);
  _sync jsonb;
  _reg_venda record;
  _change tweeks.conta;
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _message text;
  _new jsonb;
  _old jsonb;
  _serie_id uuid default args->>'_serie_id';
  _cambio record;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );
  
  if _conta.conta_id is null and exists(
    select *
      from tweeks.conta ct 
      where ct.conta_chave = arg_conta_chave
        and ct._branch_uid = _branch
  ) then
    return lib.res_false( 'Já existe uma conta com a mesma chave (atualize a pagina e tente novamente)!' );
  end if;
  
  _old := coalesce( to_jsonb( _conta ), jsonb_build_object() );
  _change := jsonb_populate_record( _conta, args );
  _change.conta_data := coalesce( _change.conta_data, current_date );
  _new := to_jsonb( _change );

  if _change.conta_tserie_id is null then
      return lib.res_false(format('O tipo de serie é não foi especificada, contactar o suporte!' ) );
  end if;
  
  select *
    from geoinfo.currency cu 
      left join tweeks.cambio ca on ca.cambio_currency_id = cu.currency_id
    where ca.cambio_estado = 1 
      and ca.cambio_currency_id = _change.conta_currency_id
    order by ca.cambio_dataregistro desc 
    limit 1
    into _cambio;
  
  if _change.conta_currency_id is not null and _cambio.cambio_id is null then
    return lib.res_false(format('Não existe cambio definido para %I!', _cambio.currency_name ) );
  end if;
  
  if _change.conta_currency_id is not null then
    _change.conta_cambio_uid := _cambio.cambio_id;
    _change.conta_taxacambio := _cambio.cambio_taxa;
  end if;
  

  if _change.conta_id is null then
    _change.conta_colaborador_id := arg_colaborador_id;
    _change.conta_espaco_auth := arg_espaco_auth;
    _change.conta_numero := cluster.next( 'conta.conta_numero/seq',
      sub := _branch::text,
      lpad_char := '0',
      lpad := 5
    );
    _new := to_jsonb( _change );
  else
    _change.conta_colaborador_atualizacao := arg_colaborador_id;
    _new := to_jsonb( _change );
    _change.conta_dataatualizacao := current_timestamp;
  end if;
  
  _message := tweeks.__check_conta_data(
    _tserie_id := _change.conta_tserie_id,
    _conta_data := _change.conta_data,
    _raise := false,
    _serie_id := _serie_id
  );
  
  if _message is not  null then
    return lib.res_false( _message );
  end if;
  
  if _new != _old then 
    select ( "returning" ).* into _conta
      from lib.sets( _change, replacer := args )  sets
    ;
  end if;
  
  -- Canselar as vendas que não fazem mais parte de conta
  with recursive __venda as (
    select
        ve.venda_id,
        ve.venda_estado
      from tweeks.venda ve
      where ve.venda_conta_id = _conta.conta_id
        and ve.venda_venda_id is null
        and ve.venda_id != all( _vendas )
        and ve.venda_estado in (
          _const.maguita_venda_estado_aberto,
          _const.maguita_venda_estado_fechado
        )
    union all
      select
          ve.venda_id,
          ve.venda_estado
        from __venda vs
          inner join tweeks.venda ve on vs.venda_id = ve.venda_venda_id
        where vs.venda_estado in (
          _const.maguita_venda_estado_aberto,
          _const.maguita_venda_estado_fechado
        )
  ), __disable as(
    update tweeks.venda up
      set venda_estado = _const.maguita_venda_estado_canselado
      from __venda _v
      where up.venda_id = _v.venda_id
      returning *
  ) select array_agg( to_jsonb( d ) ) into _unsets
      from __disable d;


  _reg_venda :=  tweeks.funct_pos_reg_venda(
    jsonb_build_object(
      'arg_vendas', arg_vendas,
      'arg_message_error', true,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_conta_id', _conta.conta_id
    )
  );

  _sync := tweeks.funct_pos__sync_conta_amount(
    jsonb_build_object(
      'arg_conta_id', _conta.conta_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth
    )
  );

  return lib.res_true( tweeks.funct_pos_load_conta_data( jsonb_build_object(
    'arg_posto_id', args->'conta_posto_id',
    'arg_espaco_auth', arg_espaco_auth,
    'arg_colaborador_id', arg_colaborador_id,
    'arg_conta_id', _conta.conta_id
  )) || jsonb_build_object(
    'sync', _sync,
    'sets', _reg_venda.data->'vendas',
    'unsets', coalesce( _unsets, array[]::jsonb[])
  ));

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;
`;



export const funct_pos_change_conta_fechar = sql`
create or replace function tweeks.funct_pos_change_conta_fechar(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
    /**
      Essa função fecha uma nova conta
      arg = {
        arg_espaco_auth: ID,
        arg_colaborador_id: ID,
        arg_tserie_id: ID,
        _serie_id:UID
        deposito:{
          deposito_cliente_id
          deposito_caixa_id
          deposito_tpaga_id
          deposito_currency_id
          deposito_posto_id
          deposito_montantemoeda
          deposito_montantetroco
          deposito_data
          deposito_docref: DOCUMENTO-REF?
          deposito_observacao: OBSERVACAO?
        }

        conta_id: ID,
        conta_extension: {} | { reserva_id: UID }
        conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM },

        conta_posto_id: ID,
        conta_desconto

        conta_titular: NOME-CLIENTE
        conta_titularnif: VARCHAR,
        conta_data: DATA,
        conta_cliente_id,

        //Relativos a GUIA
        guia_documentoperacao: CODIGO,
        guia_dataopeacao: DATA,
        guia_observacao: DESCRICAO
        guia_metadata: { ... any extras data }

        custos:[{
          custoguia_montante: MONTANTE,
          custoguia_descricao: DESCRICAO PARA O CUSTO
          custoguia_tcusto_id: 1 - DESPESA | 2 - RECEITA
        }]
      }
     */

    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_tserie_id int2 default args->>'arg_tserie_id';

    arg_conta_id uuid default args->>'conta_id';
    arg_caixa_id uuid default args->>'de_caixa_id';
    _deposito_montantetroco double precision;
    _serie_id uuid default args->>'_serie_id';


    _conta tweeks.conta;
    _const map.constant;
    _caixa tweeks.caixa;
    _res lib.res;
    _cambio record;
    _montante_amortizacao double precision;
    _deposito tweeks.deposito;
    _rec record;
    _guia tweeks.guia;
    _message text;
    _tserie tweeks.tserie;
  begin
    _const := map.constant();
    _caixa := tweeks._get_caixa( arg_caixa_id );
    _conta := tweeks._get_conta( arg_conta_id );
    _conta := jsonb_populate_record( _conta, args );
    _conta.conta_data := coalesce( _conta.conta_data, current_date );
    _deposito := jsonb_populate_record( _deposito, args->'deposito' );

    _message := tweeks.__check_conta_data(
      _tserie_id := arg_tserie_id,
      _conta_data := _conta.conta_data,
      _raise := false,
      _serie_id := _serie_id
    );

    if _message is not null then
        return lib.res_false( _message );
    end if;

    if _conta.conta_id is null then
      raise exception '%', 'Identificador da conta a ser fechada não foi informado!';
    end if;

    if _conta.conta_estado = _const.maguita_conta_estado_fechado then
      return lib.res_false( 'Essa conta já se encontra fechada!' );
    end if;
    
    if arg_tserie_id not in (
        _const.maguita_tserie_fatura,
        _const.maguita_tserie_faturarecibo,
        _const.maguita_tserie_faturasimplificada,
        _const.maguita_tserie_guiasaida,
        _const.maguita_tserie_notacredito,
        _const.maguita_tserie_notadebito
    ) then
      return lib.res_false( 'Não pode fechar a conta o com tipo de serie selecionada!' );
    end if;

    if _conta.conta_posto_fecho is null then
      return lib.res_false( 'Necessario indicar o posto de fecho!' );
    end if;

    -- Na fatura recibo não pode haver conta corrente
    if arg_tserie_id in ( _const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) and _deposito.deposito_montantemoeda is null then
      return lib.res_false( 'O pagamento para as faturas/recibo é obrigatorio!' );
    end if;

    -- Os cliente finais só podem receber fatura/recibo ou nota de credito
    if true in (
        _conta.conta_cliente_id is null,
        _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    ) and arg_tserie_id not in (
      _const.maguita_tserie_faturarecibo,
      _const.maguita_tserie_faturasimplificada
    ) then
      return lib.res_false( 'Só pode lançar nos cliente finais as futuras/recibos!');
    end if;


    -- Quando hover necessidade de efetuar o deposito então, deve-se obter a taxa de cambio para o dia
    if arg_tserie_id in (_const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada )
      or _deposito.deposito_montantemoeda is not null
    then
      if _deposito.deposito_tpaga_id = _const.maguita_tpaga_contacorrente then
        return lib.res_false( 'Tipo de pagamento invalido' );
      end if;

      -- Obter o cambio para a moeda selecionada
      select * into _cambio from tweeks.__load_cambio_day(
        arg_espaco_auth,
        _deposito.deposito_currency_id,
        _conta.conta_data,
        _const
      );

      if _cambio.cambio_id is null then
        return lib.res_false( 'Câmbio não foi encontrado!' );
      end if;
    end if;

    -- O valor do deposito nas conta de fatura/recibo deve ser o suficiente para cobrir o montante da fatura
    if arg_tserie_id in ( _const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) then
      if round( ( _cambio.cambio_taxa * _deposito.deposito_montantemoeda)::numeric, _const.money_round )  < round( _conta.conta_montante::numeric, _const.money_round ) then
        return lib.res_false( 'Montante para pagamento insuficiente' );
      end if;

      -- Se for para amortizar a conta a caixa tem que estar aberta
      if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
        return lib.res_false( 'Pagamento rejeitado!' );
      end if;
    end if;

    -- Definir em aqual conta a fatura deve ser enviado
    _conta._tgrupo_id := case
      when arg_tserie_id in (_const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) then _const.maguita_tgrupo_cnormal
      when arg_tserie_id = _const.maguita_tserie_fatura then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_guiasaida then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notacredito then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notadebito then _const.maguita_tgrupo_ccorrente
    end;

    -- Gerar a serie para a conta dependento do tipo do documento (fatura, faturarecibo, notacredito, guiasaida)
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, arg_tserie_id, _serie_id );
    _conta.conta_numerofatura := _rec.document;
    _conta.conta_serie := to_json( _rec );
    _conta.conta_serie_id = _rec.serie_id;

    _conta.conta_estado := _const.maguita_conta_estado_fechado;
    _conta.conta_imprensa := 1;
    _conta.conta_colaborador_fecho := arg_colaborador_id;
    _conta.conta_datafecho := current_timestamp;
    _conta.conta_cliente_id := coalesce( _conta.conta_cliente_id, lib.to_uuid( 1 ) );

    -- Gerar a Guia de saida
    _guia := jsonb_populate_record( _guia, args );
    _guia.guia_tguia_id := _const.maguita_tguia_saida;
    _guia.guia_espaco_saida := arg_espaco_auth;
    _guia.guia_toperacao_id := _const.maguita_toperacao_venda;
    _guia.guia_refclass := cluster.__format( 'tweeks.conta'::regclass );
    _guia.guia_refuid := _conta.conta_id;
    _guia.guia_refs := jsonb_build_object(
      'cliente', jsonb_build_object( 'cliente_id', _conta.conta_cliente_id ),
      'saida', jsonb_build_object( 'espaco_id', _conta.conta_espaco_auth )
    );

    _guia := tweeks.funct_sets_guia( jsonb_build_object(
      'guia', _guia,
      'custoguia', args->'custos',
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth
    ));

    -- Vicular a informaçao de guia na conta extension com a tag guia_id
    _conta.conta_extension := coalesce( _conta.conta_extension, jsonb_build_object() )
      || jsonb_build_object( 'guia_id', _guia.guia_uid );

    select ( "returning" ).* into _conta
      from lib.sets_up( _conta )
    ;


    -- Caso necessairio lançar o deposito viculado a conta
    if coalesce( _deposito.deposito_montantemoeda, 0.0 ) > 0 then

      _montante_amortizacao  := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;
      if _montante_amortizacao > _conta.conta_montante and _conta._tgrupo_id != _const.maguita_tgrupo_ccorrente then
        _deposito_montantetroco := _montante_amortizacao - _conta.conta_montante;
      end if;

      _deposito_montantetroco := coalesce( _deposito_montantetroco, _deposito.deposito_montantetroco, 0.0 );

      _res := tweeks.funct_pos_reg_deposito(( args->'deposito' ) || jsonb_build_object(
          'arg_espaco_auth', arg_espaco_auth,
          'arg_colaborador_id', arg_colaborador_id,
          'arg_balance_accounts', false,
          'deposito_cliente_id', _conta.conta_cliente_id,
          'deposito_montantetroco', _deposito_montantetroco,
          '_tgrupo_id', _conta._tgrupo_id,
          'deposito_referencia', jsonb_build_object( 'conta_id', _conta.conta_id ), -- Vincula o deposito a conta
          'deposito_documento', _conta.conta_numerofatura,
          'deposito_serie', _conta.conta_serie,
          'deposito_serie_id', _conta.conta_serie_id,
          '_raise', true -- Criar exception para comportamentos indesejados
        ));

      if not _res.result then
        perform lib.result_exception(
            _res.message,
            detail := _res.data::text,
            hint := _res.error::text
          );
      else
        _deposito := jsonb_populate_record( null::tweeks.deposito, _res.data->'deposito' );
      end if;
    end if;

    return lib.res_true(
      message := '@tweeks.conta.invoice-closed-success',
      data := jsonb_build_object(
        'guia', _guia,
        'conta', tweeks._get_conta( _conta.conta_id ),
        'fatura', _conta.conta_numerofatura,
        'recibo', _deposito.deposito_documento
      )
    );
  end;
$$;
`;