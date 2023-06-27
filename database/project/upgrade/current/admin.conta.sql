select map.constant( 'money_round', 'int', 2 );
alter table tweeks.venda add if not exists venta_taxas uuid[] not null default array[]::uuid[];



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
begin
  _const := map.constant();
  _caixa := tweeks._get_caixa( arg_caixa_id );

  _conta := tweeks._get_conta( arg_conta_id );
  _conta := jsonb_populate_record( _conta, args );
  _conta.conta_data := coalesce( _conta.conta_data, current_date );

  _deposito := jsonb_populate_record( _deposito, args->'deposito' );

  _conta._tgrupo_id := case
    when _deposito.deposito_montantemoeda is null then _const.maguita_tgrupo_ccorrente
    else _const.maguita_tgrupo_cnormal
  end;

  if _conta.conta_posto_fecho is null then
    return lib.res_false( 'Necessario indicar o posto de fecho!' );
  end if;

  -- Quando for conta corrente
  if _deposito.deposito_montantemoeda is null
    and true in (
      _conta.conta_cliente_id is null,
      _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    )
  then
    return lib.res_false( 'Não pode abrir uma conta corrente para o cliente final' );

  -- Quando for conta normal
  elseif _conta._tgrupo_id = _const.maguita_tgrupo_cnormal then
    if _deposito.deposito_tpaga_id = _const.maguita_tpaga_contacorrente then
      return lib.res_false( 'Tipo de pagamento invalido' );
    end if;

    select * into _cambio from tweeks.__load_cambio_day(
      arg_espaco_auth,
      _deposito.deposito_currency_id,
      _conta.conta_data,
      _const
    );

    if _cambio.cambio_id is null then
      return lib.res_false('Câmbio não foi encontrado!' );
    end if;

    if round( (_cambio.cambio_taxa * _deposito.deposito_montantemoeda)::numeric, _const.money_round )  < round( _conta.conta_montante::numeric, _const.money_round ) then
      return lib.res_false('Montante para pagamento insuficiente' );
    end if;

    -- Se for para amortizar a conta a caixa tem que estar aberta
    if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
      return lib.res_false( 'Pagamento rejeitado!' );
    end if;
  end if;


  if _conta._tgrupo_id = _const.maguita_tgrupo_cnormal then
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, _const.maguita_tserie_faturarecibo );
    _conta.conta_numerofatura := _rec.document;
    _conta.conta_serie := to_json( _rec );
  elsif _conta._tgrupo_id = _const.maguita_tgrupo_ccorrente then
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, _const.maguita_tserie_fatura );
    _conta.conta_numerofatura := _rec.document;
    _conta.conta_serie := to_json( _rec );
  end if;

  _conta.conta_estado := _const.maguita_conta_estado_fechado;
  _conta.conta_imprensa := _conta.conta_imprensa +1;
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

  _conta.conta_extension := coalesce( _conta.conta_extension, jsonb_build_object() )
    || jsonb_build_object( 'guia_id', _guia.guia_uid );

  select ( "returning" ).* into _conta
    from lib.sets_up( _conta )
  ;

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
      'deposito_referencia', lib.sets_ref( _conta ),
      'deposito_documento', _conta.conta_numerofatura,
      'deposito_serie', _conta.conta_serie,
      '_raise', true
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

drop function if exists rule.conta_generata_series(arg_espaco_id uuid);

create or replace function tweeks.funct_pos_reg_conta( args jsonb ) returns lib.res
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

      -- opcional
      conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM }
      conta_id: ID?
      conta_extension: {} | { reserva_id: UID }

      conta_currency_id: ID,
      conta_tpaga_id: ID,

      conta_cliente_id:UID
      conta_titular: CLIENTE-NOME
      conta_titularnif: CLIENTE-NIF
      conta_data: DATA,

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
  arg_conta_id uuid default args->>'conta_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_vendas jsonb not null default args->>'arg_vendas';

  _conta tweeks.conta;
  _const map.constant;
  _unsets jsonb[];
  _vendas uuid[] default array( select ( e.doc->>'venda_id' )::uuid from jsonb_array_elements( args->'arg_vendas' ) e ( doc ) where e.doc->>'venda_id' is not null);
  _sync jsonb;
  _reg_venda record;
  _change tweeks.conta;
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin

  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );


  if _conta.conta_id is null then
    _conta.conta_colaborador_id := arg_colaborador_id;
    _conta.conta_espaco_auth := arg_espaco_auth;
    _conta.conta_numero := cluster.next( 'conta.conta_numero/seq',
      sub := _branch::text,
      lpad_char := '0',
      lpad := 5
    );
  else
    _conta.conta_colaborador_atualizacao := arg_colaborador_id;
    _conta.conta_dataatualizacao := current_timestamp;
  end if;

  _change := json_populate_record( _conta, args::json );

  select ( "returning" ).* into _change
    from lib.sets( _conta, replacer := args )  sets
    where _conta::text != _change::text
  ;

  if _change.conta_id is not null then _conta := _change; end if;

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



create or replace function tweeks.funct_pos_load_conta_proforma(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função serve para devolver as compras do dia em uma data especifica
    filter := {
      arg_posto_id: DATE
      arg_espaco_id uuid
      arg_colaborador_id
    }
   */
  _const map.constant;
--   arg_posto_id uuid not null default filter->>'arg_posto_id';
  arg_colaborador_id uuid not null default filter->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';

  _posto tweeks.posto;
  __branch_uid uuid not null default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
--   _posto := tweeks._get_posto( arg_posto_id );
  _const := map.constant();

  return query
    with __conta as (
      select
          ct.conta_id,
          ct.conta_data,
          ct.conta_dataregistro,
          ct.conta_titular,
          ct.conta_titularnif,
          ct.conta_montante,
          ct.conta_numerofatura,
          ct.conta_numero,
          ct.conta_proformavencimento,
          ct.conta_proformaextras,
          cli.cliente_id,
          cli.cliente_titular,
          cli.cliente_nif,
          cli.cliente_documento,
          td.tdocumento_id,
          td.tdocumento_nome,
          co.colaborador_id,
          co.colaborador_nome,
          co.colaborador_apelido
        from tweeks.conta ct
          left join auth.colaborador co on coalesce( ct.conta_colaborador_fecho, ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = co.colaborador_id
          left join tweeks.cliente cli on ct.conta_cliente_id = cli.cliente_id
          left join tweeks.tdocuemto td on cli.cliente_tdocument_id = td.tdocumento_id
        where ct._branch_uid = __branch_uid
          and ct.conta_estado = _const.maguita_conta_estado_aberto
          and ct.conta_proforma
    ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
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
        a.artigo_artigo_id
      from tweeks.venda v
        inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
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
          c.conta_serie_id,
          c._tgrupo_id,
          c.conta_data,
          c.conta_dataregistro,
          de.deposito_montante,
          de.deposito_montantetroco,
          de.deposito_montantefinal,
          de.deposito_montantemoeda,
          de.deposito_tpaga_id,
          array_agg( to_jsonb( v )||to_jsonb( vg ) order by v.artigo_nome ) as conta_vendas
        from tweeks.conta c
          left join __venda_group vg on c.conta_id = vg._venda_conta_id
          left join __venda v on vg._venda_id = v.venda_id
          left join tweeks.deposito de on lib.sets_ref( c ) = de.deposito_referencia
        where c.conta_id = arg_conta_id
          and c._branch_uid = ___branch
        group by c.conta_id, de.deposito_id
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
          where de.deposito_referencia @> lib.sets_ref( _conta )
            and de._branch_uid = ___branch
      ) select to_jsonb( _de )
          from __deposito _de
    ;
  end if;
end
$$;

