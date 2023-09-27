import {block} from "../../../core/updater";


block( module, {  identifier: "SERIE-GUIA-SAIDA" }).sql`
do $$
BEGIN 
  if not exists(
    select *
      from tweeks.tserie
      where tserie_id = 5
  ) then 
    INSERT INTO tweeks.tserie (tserie_id, tserie_desc, tserie_code, tserie_seqlimit, tserie_numlimit) VALUES (5, 'Guia Saida', 'GS', 6, 7);
  end if;
  
  perform map.constant('maguita_tserie_guiasaida', 'int2', 5, 'Guia de saida', false, 'Guia de saida' );
end;
$$
`;


block( module, {  identifier: "TPAGA-CONTA_CORRENT" }).sql`
do $$
BEGIN 
  if not exists(
    select *
      from tweeks.tpaga
      where tpaga_id = 6
  ) then
      INSERT INTO tweeks.tpaga (tpaga_id, tpaga_designacao) VALUES (6, 'POS');
  end if;
  
end;
$$
`;

block( module, { identifier: "maguita_cliente_final_maguita_cliente_finalnotacredito"}).sql`
    select map.constant( 'maguita_cliente_final', 'uuid', lib.to_uuid( 1 ) );
    select map.constant( 'maguita_cliente_finalnotacredito', 'uuid', lib.to_uuid( 2 ) );
`;

block( module, { identifier: "correct-conta", flags:[]}).sql`
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
      _raise := false
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
        _const.maguita_tserie_guiasaida,
        _const.maguita_tserie_notacredito
    ) then
      return lib.res_false( 'Não pode fechar a conta o com tipo de serie selecionada!' );
    end if;
    
    if _conta.conta_posto_fecho is null then
      return lib.res_false( 'Necessario indicar o posto de fecho!' );
    end if;
    
    -- Na fatura recibo não pode haver conta corrente
    if arg_tserie_id = _const.maguita_tserie_faturarecibo and _deposito.deposito_montantemoeda is null then 
      return lib.res_false( 'O pagamento para as faturas/recibo é obrigatorio!' );
    end if;
    
    -- Os cliente finais só podem receber fatura/recibo ou nota de credito
    if true in (
        _conta.conta_cliente_id is null,
        _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    ) and arg_tserie_id not in (
      _const.maguita_tserie_faturarecibo
    ) then
      return lib.res_false( 'Só pode lançar nos cliente finais as futuras/recibos!');
    end if;
    
    
    -- Quando hover necessidade de efetuar o deposito então, deve-se obter a taxa de cambio para o dia
    if arg_tserie_id = _const.maguita_tserie_faturarecibo 
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
    if arg_tserie_id = _const.maguita_tserie_faturarecibo then 
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
      when arg_tserie_id = _const.maguita_tserie_faturarecibo then _const.maguita_tgrupo_cnormal
      when arg_tserie_id = _const.maguita_tserie_fatura then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_guiasaida then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notacredito then _const.maguita_tgrupo_ccorrente
    end;
    
    -- Gerar a serie para a conta dependento do tipo do documento (fatura, faturarecibo, notacredito, guiasaida)
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, arg_tserie_id );
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

create or replace function tweeks.funct_pos_reg_deposito(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /** Essa função serve para registar uma nova amortizacao
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,

      deposito_montantetroco: TROCO*
      deposito_caixa_id: UID,
      deposito_tpaga_id: ID,
      deposito_currency_id: UID,
      deposito_posto_id: UID,
      deposito_cliente_id: UID,
      deposito_referencia: {conta_id}
      deposito_montantemoeda: MONTANTE,
      deposito_data: DATA,
      deposito_observacao: OBS?
      deposito_documento: DOC?
      deposito_docref: NUMERO DOC?,
      _tgrupo_id
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';

  _deposito tweeks.deposito;
  _posto tweeks.posto;
  _const map.constant;
  _cambio record;
  _caixa tweeks.caixa;
  _raise bool;
  _rec record;

begin

  _raise := args->>'_raise';

  _const := map.constant();
  _deposito := jsonb_populate_record( _deposito, args );


  if _deposito.deposito_posto_id is not null then
    _posto := tweeks._get_posto( _deposito.deposito_posto_id );
  end if;

  if _deposito.deposito_caixa_id is not null then
    _caixa := tweeks._get_caixa( _deposito.deposito_caixa_id );
    if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo and _raise then
      raise exception 'Não pode registar um deposito numa caixa fechado!';
    elseif _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
      return lib.res_false( 'Não pode registar um deposito numa caixa fechado!' );
    end if;
  end if;
  _deposito.deposito_data := coalesce( _deposito.deposito_data, current_date );
  _deposito.deposito_colaborador_id := arg_colaborador_id;
  _deposito.deposito_espaco_auth := arg_espaco_auth;

  select * into _cambio from tweeks.__load_cambio_day(
    arg_espaco_auth,
    _deposito.deposito_currency_id,
    current_date,
    _const
  );

  if _cambio.cambio_id is null and _raise then
    raise exception '@tweeks.conta.cambio-not-found';
  elseif _cambio.cambio_id is null then
    return lib.res_false( 'Câmbio não foi encontrado!' );
  end if;

  _deposito.deposito_montante := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;

  if coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante and _raise then
    raise exception 'O montante de troco tem que ser inferior a montante cambiado!';
  elsif coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante then
    return lib.res_false( 'O montante de troco tem que ser inferior a montante cambiado!' );
  end if;

  if _deposito.deposito_referencia is null or _deposito.deposito_documento is null then
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, 3 /* Recibo*/ );
    _deposito.deposito_documento := _rec.document;
    _deposito.deposito_serie := to_json( _rec );
    _deposito.deposito_serie_id := _rec.serie_id;
  end if;

--     if _deposito.deposito_referencia is null then
--         _deposito.deposito_documento := tweeks.__sets_generate_documento( arg_espaco_auth, 2 /*Fatura Recibo */  );
--     else
--         _deposito.deposito_documento := tweeks.__sets_generate_documento( arg_espaco_auth, 3 /* Recibo*/ );
--     end if;
--   --_deposito.deposito_documento := tweeks.__generate_deposito_serie( arg_espaco_auth );

  select ( "returning" ).* into _deposito
    from lib.sets( _deposito )
  ;

  return lib.res_true(
    jsonb_build_object(
      'deposito', _deposito
    )
  );
end;
$$;

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
          corigen.conta_numerofatura as conta_documentoorigem,
          array_agg( to_jsonb( v )||to_jsonb( vg ) order by v.artigo_nome ) as conta_vendas
        from tweeks.conta c
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
          corigen.conta_id
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


create or replace function tweeks.funct_load_artigo(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**
        Essa função serve para carregar os artigos registrado
        args := {
          arg_espaco_auth: ID
          arg_colaborador_id: ID
          arg_classe_id: ID
          arg_artigo_estado: ARTIGO_ESTADO
          query: {
            any?: CODE|NAME|DESCRICAO
            code?: CODE
            name?: NAME
            desc?: DESCRICAO
          }
        }
   */
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_childs uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
    arg_classe_id uuid default args->>'arg_classe_id';
    arg_artigo_estado int2 default args->>'arg_artigo_estado';

    _query_any text  default lower( args->'query'->>'any' );
    _query_code text default lower( args->'query'->>'code' );
    _query_name text default lower( args->'query'->>'name' );
    _query_desc text default lower( args->'query'->>'desc' );
    _const map.constant;
    _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
    _const := map.constant();

    /**
      ID, NOME, STOCK, PRECO, [STOK-MINIMO], FOTO
     */
    return query
        with
          __stock as (
            select
                fluxo_artigo_id as stock_artigo_id,
                fluxo_espaco_id as stock_espaco_id,
                fluxo_resultado as stock_quantidade
              from tweeks.__fluxo_scan(
                _branch := _branch,
                _espaco_id := arg_espaco_auth,
                _resume := true
              )
          ), __artigo as (
            select
                art.artigo_id,
                art.artigo_codigo,
                art.artigo_descricao,
                art.artigo_nome,
                art.artigo_compostoquantidade,
                art.artigo_artigo_id,

                art.artigo_espaco_auth = any( arg_espaco_childs ) as artigo_owner,
                coalesce( s.stock_quantidade, 0 ) as stock_quantidade,
                art.artigo_foto,
                art.artigo_espaco_auth,
                art.artigo_classe_id,
                art.artigo_estado,
                art.artigo_stocknegativo,
                art.artigo_codigoimposto,
                origin.artigo_id as origin_id,
                origin.artigo_codigo as origin_codigo,
                origin.artigo_descricao as orign_descricao,
                origin.artigo_nome as origin_nome,
                origin.artigo_compostoquantidade as orign_compostoquantidade,
                origin.artigo_artigo_id as origin_origin_id,

                coalesce( array_agg( l.link_espaco_destino ) filter ( where l.link_id is not null ), array[]::uuid[] )  as links,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_custo' as precario_custo,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_quantidade' as precario_quantidade,
                ( ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'stock_minimo' )::double precision as link_stockminimo
              from tweeks.artigo art
                left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
                left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
                  and l.link_referencia = rule.artigo_referencia( art.artigo_id )
                  and l.link_espaco_destino = any( arg_espaco_childs )
                  and l.link_tlink_id = _const.maguita_tlink_preco
                  and l._branch_uid = _branch
                left join __stock s on art.artigo_id = s.stock_artigo_id and s.stock_espaco_id = arg_espaco_auth
              where art._branch_uid = _branch
              group by art.artigo_id,
                 origin.artigo_id,
                s.stock_quantidade
          ), __filter as (
            select *,
                coalesce( art.link_stockminimo ) as stock_minimo
              from __artigo art
              where ( coalesce( art.links, array[]::uuid[] )||art.artigo_espaco_auth ) && arg_espaco_childs
                and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
                and art.artigo_estado = coalesce( arg_artigo_estado, art.artigo_estado )
         ), __filter_query as (
            select *
            from __filter f
            where arg_classe_id is not null or f.artigo_classe_id != _const.classe_itemextra
            order by
              case
                when f.artigo_estado = _const.artigo_estado_ativo then 1
                else 2
              end,
              case
                when f.artigo_espaco_auth = arg_espaco_auth then 1
                when f.artigo_espaco_auth = any( arg_espaco_childs ) then 2
                else 3
              end,
              case
                when stock_quantidade < f.stock_minimo then 1
                when stock_quantidade = f.stock_minimo then 2
                else 3
               end,
               f.artigo_nome
           ), __query as (
             select *
                from __filter_query _f
                where true
                  and lower( _f.artigo_codigo ) = lower( coalesce( _query_code, _f.artigo_codigo ) )
                  and lower( _f.artigo_nome ) like lower( format( '%%%s%%', coalesce( _query_name, _f.artigo_nome ) ) )
                  and lower( coalesce( _f.artigo_descricao, '' ) ) like lower( format( '%%%s%%', coalesce( _query_desc, _f.artigo_descricao ) ) )
                  and (
                    lower( _f.artigo_codigo ) = lower( coalesce( _query_any, _f.artigo_codigo ) )
                    or lower( _f.artigo_nome) like lower( format( '%%%s%%', coalesce( _query_any, _f.artigo_nome ) ) )
                    or lower( coalesce( _f.artigo_descricao, '' ) ) like lower( format( '%%%s%%', coalesce( _query_any, _f.artigo_descricao, '' ) ))
                  )
          ) select to_jsonb( _q ) - 'links'
              from __query _q
    ;
end
$$;
`;

block( module, { identifier: "correct-conta", flags:[ "@unique" ]}).sql`
update tweeks.conta
  set conta_serie_id = ( conta_serie->>'serie_id' )::uuid
  where conta_serie_id is null
    and conta_estado = (map.constant()).maguita_conta_estado_fechado
    and ( conta_serie->>'serie_id' )::uuid is null
    and ( conta_serie->>'serie_id' )::uuid in (
      select se.serie_id
        from tweeks.serie se
    )
;

update tweeks.deposito
  set deposito_serie_id = ( deposito_serie->>'serie_id' )::uuid
  where deposito_serie_id is null
    and ( deposito_serie->>'serie_id' )::uuid is not null
    and ( deposito_serie->>'serie_id' )::uuid in (
      select serie_id
        from tweeks.serie
    )
;
`;
