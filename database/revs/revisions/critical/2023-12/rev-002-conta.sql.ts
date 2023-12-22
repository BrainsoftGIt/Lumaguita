import {sql} from "kitres";


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
  _currency record;
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
    where cu.currency_id = _change.conta_currency_id
    into _currency
  ;
  
  select *
    from tweeks.funct_load_cambio_ativo( args ) c( doc )
      inner join jsonb_populate_record( null::tweeks.cambio, c.doc ) cb on true
      inner join jsonb_populate_record( null::geoinfo.currency, c.doc ) cur on true    
  where cur.currency_id = _change.conta_currency_id
    limit 1
    into _cambio
  ;
  
  if _change.conta_currency_id is not null and _cambio.cambio_id is null then
    return lib.res_false(format('Não existe cambio definido para %I!', _currency.currency_code ) );
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

export const funct_load_conta_data_v2 = sql`
create or replace function tweeks.funct_pos_load_conta_data(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**
      Essa função devolve uma mesa juntamente com as conta associada que ainda esta aberta
      filter := {
        with_client:boolean
        arg_posto_id: ID
        arg_espaco_auth: ID
        arg_colaborador_id: ID
        arg_conta_id: ID
      }
     */

--     arg_posto_id uuid  not null default filter->>'arg_posto_id';
    arg_espaco_auth uuid  not null default filter->>'arg_espaco_auth';
    arg_conta_id uuid not null default filter->>'arg_conta_id';
    arg_colaborador_id uuid default filter->>'arg_colaborador_id';
    _with_client boolean default filter->>'with_client';

    _const map.constant;
    _client jsonb;
    _conta tweeks.conta;
    ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin

  _const := map.constant();

  if _with_client then
    select to_jsonb( c ) into _client
      from cliente c
        inner join tweeks.conta ct on c.cliente_id = ct.conta_cliente_id
      where ct.conta_id = arg_conta_id
    ;
  end if;

  if _client is null then
    _client := jsonb_build_object();
  end if;

  select * into _conta
    from tweeks.conta ct
    where ct.conta_id = arg_conta_id
  ;

  return query with
    __venda as (
      select
        v.venda_id,
        v.venda_conta_id,
        v.venda_venda_id,
        v.venda_quantidade,
        v.venda_custoquantidade,
        v.venda_custounitario,
        v.venda_montante,
        v.venda_montantesemimposto,
        v.venda_montantecomimposto,
        v.venda_montantetotal,
        v.venda_imposto,
        v.venda_impostoadicionar,
        v.venda_impostoretirar,
        v.venda_montanteagregado,
        v.venda_isencao,
        v.venda_estado,
        v.venda_estadopreparacao,
        v.venda_metadata,
        v.venda_descricao,
        v.venda_validade,
        v.venda_editado,
        v.venda_taxas,
        v.venda_lote,
        a.artigo_id,
        a.artigo_nome,
        a.artigo_codigo,
        a.artigo_compostoquantidade,
        a.artigo_artigo_id,
        u.unit_id,
        u.unit_code,
        u.unit_name,
        tx.taxa_percentagem,
        tx.taxa_taxa,
        tip.tipoimposto_id,
        tip.tipoimposto_codigo,
        tip.tipoimposto_nome
      from tweeks.venda v
        inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
        left join tweeks.taxa tx on tx.taxa_id = any ( v.venda_taxas )
        left join tweeks.tipoimposto tip on tx.taxa_tipoimposto_id = tip.tipoimposto_id
        left join tweeks.unit u on a.artigo_unit_id = u.unit_id
      where v._branch_uid = ___branch
        and v.venda_estado in (
           _const.maguita_venda_estado_aberto,
           _const.maguita_venda_estado_fechado
        )
    ), __venda_group as (
      select
          v.venda_id as _venda_id,
          v.venda_conta_id as _venda_conta_id,
          coalesce( array_agg( vi order by vi.artigo_nome ) filter ( where vi.venda_id is not null ),
            array[]::record[]
          ) as venda_itens
        from  tweeks.venda v
          inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
          left join __venda vi on v.venda_id = vi.venda_venda_id
        where v.venda_estado in ( _const.maguita_venda_estado_aberto,  _const.maguita_venda_estado_fechado )
          and v.venda_venda_id is null
          and v.venda_conta_id = arg_conta_id
          and v.venda_estado in (
            _const.maguita_venda_estado_aberto,
            _const.maguita_venda_estado_fechado
          )
        group by v.venda_id, a.artigo_id
    ), __conta as (
      select
          c.conta_id,
          c.conta_numero,
          c.conta_numerofatura,
          c.conta_montante,
          c.conta_mesa,
          c.conta_estado,
          c.conta_serie,
          c.conta_observacao,
          c.conta_extension,
          c.conta_props,
          c.conta_serie_id,
          c._tgrupo_id,
          c.conta_data,
          c.conta_dataregistro,
          c.conta_conta_docorigin,
          c.conta_titular,
          c.conta_titularnif,
          eur.*,
          cb.cambio_id,
          cb.cambio_taxa,
          cb.cambio_data,
          se.serie_id,
          se.serie_designacao,
          se.serie_numero,
          ccl.cliente_id,
          ccl.cliente_code,
          ccl.cliente_nif,
          ccl.cliente_titular,
          ccl.cliente_metadata,
          de.deposito_montante,
          de.deposito_montantetroco,
          de.deposito_montantefinal,
          de.deposito_montantemoeda,
          de.deposito_tpaga_id,
          coalesce( corigen.conta_numerofatura, c.conta_docorigin ) as conta_documentoorigem,
          coalesce( corigen.conta_data, c.conta_datedocorigin ) as conta_datedocorigin,
          array_agg( to_jsonb( v )||to_jsonb( vg ) order by v.artigo_nome ) as conta_vendas,
          ts.tserie_id,
          ts.tserie_desc,
          ts.tserie_code,
          ts.tserie_financa
        from tweeks.conta c
          left join geoinfo.currency eur on c.conta_currency_id = eur.currency_id
          left join tweeks.cambio cb on c.conta_cambio_uid = cb.cambio_id
          left join tweeks.serie se on c.conta_serie_id = se.serie_id
          left join tweeks.tserie ts on se.serie_tserie_id = ts.tserie_id
          left join tweeks.cliente ccl on c.conta_cliente_id = ccl.cliente_id
          left join tweeks.conta corigen on c.conta_conta_docorigin = corigen.conta_id
          left join __venda_group vg on c.conta_id = vg._venda_conta_id
          left join __venda v on vg._venda_id = v.venda_id
          left join tweeks.deposito de on c.conta_id = (de.deposito_referencia->>'conta_id')::uuid
        where c.conta_id = arg_conta_id
          and c._branch_uid = ___branch
        group by c.conta_id, 
          de.deposito_id,
          ccl.cliente_id,
          corigen.conta_id,
          ts.tserie_id,
          se.serie_id,
          eur.currency_id,
          cb.cambio_id
     ) select to_jsonb( c ) || _client from __conta c
  ;

  if _conta._tgrupo_id = _const.maguita_tgrupo_cnormal then
    return query
      with __deposito as (
        select
            de.deposito_id,
            de.deposito_montante,
            de.deposito_montantemoeda,
            de.deposito_montantetroco,
            de.deposito_montantefinal,
            de.deposito_taxacambio,
            cu.currency_code,
            cu.currency_id,
            cu.currency_name,
            tp.tpaga_id,
            tp.tpaga_designacao,
            p.posto_designacao,
            p.posto_id,
            cx.caixa_id
          from tweeks.deposito de
            inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
            inner join tweeks.tpaga tp on de.deposito_tpaga_id = tp.tpaga_id
            left join tweeks.caixa cx on de.deposito_caixa_id = cx.caixa_id
            left join tweeks.posto p on cx.caixa_posto_id = p.posto_id
          where (de.deposito_referencia->>'conta_id')::uuid = _conta.conta_id
            and de._branch_uid = ___branch
      ) select to_jsonb( _de )
          from __deposito _de
    ;
  end if;
end
$$;
`

export const funct_load_conta_documento_v2 = sql`
create or replace function tweeks.funct_load_conta_documento( args jsonb ) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**doc
    args :={
      arg_colaborador_id: UUID
      arg_espaco_auth: UUID
      _tserie_id: *INT2
      _date_start: DATE
      _date_end: DATE
      _colaborator_id: UID
      _posto_id: UUID
      _artigo_id: UUID
      _client_id: UUID
      _client_nif: character varying
      _fornecedor_id: UUID
      _documento: character varying
    }
   doc*/
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _tserie_id int2 not null default args->>'_tserie_id';
  
  _date_start date default args->>'_date_start';
  _date_end date default args->>'_date_end';
  _colaborator_id uuid default args->>'_colaborator_id';
  _posto_id uuid default args->>'_posto_id';
  _artigo_id uuid default args->>'_artigo_id';
  _client_id uuid default args->>'_client_id';
  _fornecedor_id uuid default args->>'_fornecedor_id';
  _documento character varying default args->>'_documento';
  _docfilter character varying;
  _client_nif character varying default args->>'_client_nif';
  _client_nif_filter  character varying;
  _const map.constant;
begin
  _const := map.constant();
  if _documento is not null then
    _docfilter := format( '%%%s%%', trim( upper( _documento ) ) );
  end if;
  
  if _client_nif then
    _client_nif_filter := format( '%%%s%%', trim( lower( _client_nif ) ) );
  end if;
  
  if _tserie_id  = _const.maguita_tserie_guiaentrada then
      return query
        with __guia_entrada as (
          select
              g.guia_uid,
              g.guia_date,
              g.guia_dataoperacao,
              g.guia_numero,
              g.guia_observacao,
              g.guia_documentoperacao,
              f.fornecedor_id,
              f.fornecedor_nome,
              f.fornecedor_code,
              e.espaco_id,
              e.espaco_nome,
              col.colaborador_id,
              col.colaborador_nome,
              col.colaborador_apelido,
              _tserie_id as tserie_id,
              sum( entr.entrada_custounitario  * entr.entrada_quantidade ) as guia_montante
            from tweeks.guia g 
              inner join tweeks.fornecedor f on (g.guia_refs->'fornecedor'->>'fornecedor_id')::uuid = f.fornecedor_id
              inner join tweeks.espaco e on (g.guia_refs->'destino'->>'espaco_id')::uuid = e.espaco_id
              inner join auth.colaborador col on g.guia_colaborador_id = col.colaborador_id
              left join tweeks.entrada entr on entr.entrada_guia_id = g.guia_uid
            where g._branch_uid = ___branch
              and g.guia_tguia_id = _const.maguita_tguia_entrada
              and g.guia_dataoperacao >= coalesce( _date_start, g.guia_dataoperacao )
              and g.guia_dataoperacao <= coalesce( _date_end, g.guia_dataoperacao )
              and g.guia_colaborador_id = coalesce( _colaborator_id, g.guia_colaborador_id )
              and f.fornecedor_id = coalesce( _fornecedor_id, f.fornecedor_id )
              and (
                upper( guia_numero ) like coalesce( _docfilter, guia_numero )                
                or upper( guia_documentoperacao ) like coalesce( _docfilter, guia_documentoperacao )
              )
            group by
              g.guia_uid,
              f.fornecedor_id,
              e.espaco_id,
              col.colaborador_id
            having count( * ) filter ( where entr.entrada_artigo_id = coalesce( _artigo_id, entr.entrada_artigo_id ) ) > 0
        ) select to_jsonb( _gs )
            from __guia_entrada _gs
            order by _gs.guia_date desc
    ;
    return;
  end if;
      
  if _tserie_id in (
    _const.maguita_tserie_fatura, 
    _const.maguita_tserie_faturarecibo, 
    _const.maguita_tserie_faturasimplificada, 
    _const.maguita_tserie_notadebito, 
    _const.maguita_tserie_notacredito
  ) then
    return query 
      with __conta_documentos as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,
            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            cam.cambio_id,
            cam.cambio_data,
            cam.cambio_taxa,
            cam.cambio_estado,
            cur.currency_id,
            cur.currency_code,
            cur.currency_name,
            cur.currency_symbol
            
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
              and ve.venda_estado = _const.maguita_venda_estado_fechado
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
            left join geoinfo.currency cur on ct.conta_currency_id = cur.currency_id
            left join tweeks.cambio cam on ct.conta_cambio_uid = cam.cambio_id
              and cur.currency_id = cam.cambio_currency_id
            
          where ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_estado = _const.maguita_conta_estado_fechado
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id,
            cam.cambio_id,
            cur.currency_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __conta_documentos _cd
          order by _cd.conta_dataregistro desc
    ;
    
    return;
  end if;
  
  if _tserie_id in (
    _const.maguita_tserie_faturaproforma
  ) then
    return query 
      with __conta_documentos as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,
            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            ct.conta_proforma,
            ct.conta_proformaextras,
            ct.conta_proformavencimento
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
          where ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_proforma
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __conta_documentos _cd
        order by _cd.conta_dataregistro desc
    ;
    
    return;
  end if;
  
  if _tserie_id in (
    _const.maguita_tserie_guiasaida
  ) then
    return query 
      with __guia_saida as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,

            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            ct.conta_proforma,
            ct.conta_proformaextras,
            ct.conta_proformavencimento
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
              and ve.venda_estado in ( _const.maguita_venda_estado_fechado, _const.maguita_venda_estado_aberto )
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
          where
            ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_estado in ( _const.maguita_conta_estado_fechado, _const.maguita_conta_estado_aberto )
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __guia_saida _cd
          order by _cd.conta_dataregistro desc
        ;
    return;
  end if;
  
  if _tserie_id = _const.maguita_tserie_recibo then 
      return query 
        with __recibo as (
          select
              de.deposito_id,
              de.deposito_montante,
              de.deposito_data,
              de.deposito_montantefinal,
              de.deposito_montantetroco,
              de.deposito_montantemoeda,
              de.deposito_documento,
              de.deposito_docref,
              de.deposito_observacao,
              de.deposito_taxacambio,
              de.deposito_dataregistro,
              de.deposito_referencia,
              cu.currency_id,
              cu.currency_code,
              cu.currency_name,
              cli.cliente_id,
              cli.cliente_titular,
              cli.cliente_nif,
              cli.cliente_metadata,
              cli.cliente_mail,
              cli.cliente_contactos,
              cli.cliente_code,
              cli.cliente_documento,
              tdoc.tdocumento_id,
              tdoc.tdocumento_nome,
              col.colaborador_id,
              col.colaborador_nome,
              col.colaborador_apelido,
              cx.caixa_id,
              cx.caixa_code,
              po.posto_id,
              po.posto_designacao,
              tp.tpaga_id,
              tp.tpaga_designacao,
              ts.tserie_id,
              ts.tserie_code,
              ts.tserie_desc
            from tweeks.deposito de
              inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
              inner join tweeks.cliente cli on cli.cliente_id = de.deposito_cliente_id
              
              inner join auth.colaborador col on col.colaborador_id = de.deposito_colaborador_id
              inner join tweeks.tpaga tp on de.deposito_tpaga_id = tp.tpaga_id
              inner join tweeks.serie se on de.deposito_serie_id = se.serie_id
              inner join tweeks.tserie ts on se.serie_tserie_id = ts.tserie_id
              left join tweeks.tdocuemto tdoc on cli.cliente_tdocument_id = tdoc.tdocumento_id
              left join tweeks.caixa cx on de.deposito_caixa_id = cx.caixa_id
              left join tweeks.posto po on de.deposito_posto_id = po.posto_id

            where de._branch_uid = ___branch
              and de.deposito_data >= coalesce( _date_start, de.deposito_data )
              and de.deposito_data <= coalesce( _date_end, de.deposito_data )
              and de.deposito_colaborador_id = coalesce( _colaborator_id, de.deposito_colaborador_id )
              and coalesce( de.deposito_posto_id, '00000000-0000-0000-0000-000000000001') = coalesce( _posto_id, de.deposito_posto_id, '00000000-0000-0000-0000-000000000001' )
              and de.deposito_estado in ( _const.maguita_deposito_estado_ativo )
              and de.deposito_cliente_id = coalesce( _client_id, de.deposito_cliente_id )
              and ts.tserie_id in (
                _const.maguita_tserie_recibo,
                _const.maguita_tserie_faturarecibo
              )
              and (
                upper( de.deposito_documento ) like coalesce( _docfilter, de.deposito_documento )
                or upper( de.deposito_docref ) like coalesce( _docfilter, de.deposito_docref )
              )
              and lower( coalesce( cli.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( cli.cliente_nif, '999999999' )) )
        ) select 
              to_jsonb( _rc )
            from __recibo _rc
            order by _rc.deposito_dataregistro desc
      ;
      return;
  end if;
end;
$$;
`