import {sql} from "kitres";

export const funct_reg_conta_docs_financa = sql`
create or replace function tweeks.funct_reg_conta_docs_financa(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    args := {
      conta_chave: CHAVE
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      conta_id: UID,
      conta_data: DATE,
      conta_posto_id: UID
      conta_observacao
      conta_docorigin
      conta_datedocorigin
      _serie_id:UID
      _tserie_id: TSERIE_ID
      
      itens: [
        { venda_id?:ID, venda_quantidade?: NUMBER, venda_codigoimposto?:CODE, ... },
        { venda_id?:ID, venda_quantidade?: NUMBER, venda_codigoimposto?:CODE, ...},
        { venda_id?:ID, venda_quantidade?: NUMBER, venda_codigoimposto?:CODE, ... }...
      ]
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_conta_id uuid default args->>'conta_id';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  __branch cluster.branch;
  _data record;
  _vendas record;
  _conta tweeks.conta;
  _conta_args tweeks.conta;
  _const map.constant;
  _conta_res lib.res;
  _conta_close_res lib.res;
  __iten_venda jsonb default args->'itens';
  
  __itens uuid[] default array(
    select (e.doc->>'venda_id')::uuid 
      from jsonb_array_elements( args->'itens' ) e ( doc ) 
--       where e.doc->>'venda_id' is not null and e.doc->'venda_id' != null
  );
  _serie_id uuid default args->>'_serie_id';
  _tserie_id int2 default args->>'_tserie_id';
begin
  _const := map.constant();
  _conta_args := jsonb_populate_record( _conta_args, args );
  _conta_args.conta_posto_fecho := _conta_args.conta_posto_id;
  _conta := tweeks._get_conta( arg_conta_id );

  if _conta.conta_estado != _const.maguita_conta_estado_fechado then
    return  lib.res_false( 'Essa conta não se encontra fechada' );
  end if;


  with conta_origin as (
    select
        ct.*,
        ve.*,
        art.*,
        count( venc.venda_id ) > 0 as venda_ncexists
      from tweeks.conta ct
        inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve._branch_uid = arg_branch_uid
          and ve.venda_estado = _const.maguita_venda_estado_fechado
        left join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
          and art._branch_uid = arg_branch_uid
        left join tweeks.conta ctnc on ct.conta_id = ctnc.conta_conta_docorigin
          and ctnc.conta_estado = _const.maguita_conta_estado_fechado
          and ctnc._branch_uid = arg_branch_uid
        left join tweeks.venda venc on ctnc.conta_id = ve.venda_conta_id
          and venc.venda_venda_docorign = ve.venda_id
          and venc.venda_estado = _const.maguita_venda_estado_fechado
          and venc._branch_uid = arg_branch_uid
      where ct.conta_id = arg_conta_id
      group by ct.conta_id,
        art.artigo_id,
        ve.venda_id
  ), notacareito_usar as (
    select
        count( ct.venda_id ) filter (
          where not ct.venda_ncexists
            and ct.venda_id = any ( __itens )
            and ct.venda_venda_id is null
        ) as notacredito_aplicartotal,

        array_agg( ct.venda_id ) filter (
          where not ct.venda_ncexists
            and ct.venda_id = any ( __itens )
            and ct.venda_venda_id is null
        ) as notacredito_aplicar,

        count( * ) filter (
          where ct.venda_id = any ( __itens )
            and ct.venda_venda_id is null
        ) as notacredito_usartotal,
       array_agg(
         jsonb_build_object(
           'artigo_id', ct.artigo_id,
           'artigo_codigo', ct.artigo_codigo,
           'artigo_nome', ct.artigo_nome,
           'venda_id', ct.venda_id,
           'venda_quantidade', ct.venda_quantidade,
           'venda_custounitario', ct.venda_custounitario
         )
       ) filter (
         where ct.venda_ncexists
           and ct.venda_id = any ( __itens )
           and ct.venda_venda_id is null
       ) as notacredito_exists
      from conta_origin ct
  ) select * into _data
     from notacareito_usar
  ;

--   if _data.notacredito_aplicartotal = 0 then
--     return lib.res_false( 'Nenhum dos iten selecionado pode-se aplicar nota de credito sobre ele' );
--   end if;
-- 
--   if _data.notacredito_aplicartotal < _data.notacredito_usartotal then
--     return lib.res_false( 'Alguns dos itens selecionados já têm notas de creditos aplicado sobre ele',
--       jsonb_build_object(
--           'notacredito_exists', _data.notacredito_exists
--         )
--     );
--   end if;


  /*
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
          + venda_codigoimposto

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
   */
  with __item_doc as (
    select *
      from jsonb_array_elements( __iten_venda ) ed( doc )
      inner join jsonb_populate_record( null::tweeks.venda, ed.doc ) on true
  ), __iten as (
    select
        iten.venda_artigo_id,
        iten.venda_quantidade * -1 as venda_quantidade,
        iten.venda_custounitario,
        iten.venda_custoquantidade,
        iten.venda_descricao,
        iten.venda_lote,
        iten.venda_validade,
        iten.venda_metadata,
        iten.venda_taxas,
        iten.venda_montantetotal * -1 as venda_montantetotal,
        iten.venda_id as venda_venda_docorign,
        iten.venda_venda_id as ___iten_venda_super
      from tweeks.venda iten
        inner join tweeks.artigo at on iten.venda_artigo_id = at.artigo_id
          and at._branch_uid = arg_branch_uid
      where iten.venda_venda_id = any( _data.notacredito_aplicar )
        and iten.venda_estado = _const.maguita_venda_estado_fechado
        and iten._branch_uid = arg_branch_uid

  ), __vendas as (
    select
        ve.venda_id as venda_venda_docorign,
        coalesce( ve.venda_artigo_id, ed.venda_artigo_id ) as venda_artigo_id,
        coalesce( ve.venda_quantidade * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_quantidade * -1
            else ed.venda_quantidade
          end
        ) as venda_quantidade,
        coalesce( ve.venda_custounitario, ed.venda_custounitario ) as venda_custounitario,
        coalesce( ve.venda_custoquantidade, ed.venda_custoquantidade ) as venda_custoquantidade,
        coalesce( ve.venda_editado, ed.venda_editado ) as venda_editado,
        coalesce( ve.venda_isencao, ed.venda_isencao ) as venda_isencao,
        coalesce( ve.venda_montante * -1, 
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montante * -1
            else ed.venda_montante
          end 
        ) as venda_montante,
        coalesce(ve.venda_montanteagregado * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montanteagregado * -1
            else ed.venda_montanteagregado
          end 
        ) as venda_montanteagregado,
        coalesce(ve.venda_montantetotal * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montantetotal
            else ed.venda_montantetotal
          end  
        ) as venda_montantetotal,
        coalesce(ve.venda_imposto * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montantetotal * -1
            else ed.venda_montantetotal
          end  
        ) as venda_imposto,
        coalesce( ve.venda_montantesemimposto * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montantesemimposto * -1 
            else ed.venda_montantesemimposto
          end  
        ) as venda_montantesemimposto,
        coalesce( ve.venda_montantecomimposto * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_montantecomimposto * -1
            else ed.venda_montantecomimposto
          end
        ) as venda_montantecomimposto,
        coalesce(ve.venda_impostoadicionar * -1, 
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_impostoadicionar * -1
            else ed.venda_impostoadicionar
          end  
        ) as venda_impostoadicionar,
        coalesce( ve.venda_impostoretirar * -1,
          case
            when _tserie_id = _const.maguita_tserie_notacredito then ed.venda_impostoretirar * -1
            else ed.venda_impostoretirar
          end
        ) as venda_impostoretirar,
        coalesce(ve.venda_descricao, ed.venda_descricao ) as venda_descricao,
        coalesce(ve.venda_lote,ed.venda_lote) as venda_lote,
        coalesce(ve.venda_validade, ed.venda_validade) as venda_validade,
        coalesce(ve.venda_metadata, ed.venda_metadata) as venda_metadata,
        coalesce( ve.venda_taxas, ed.venda_taxas ) as venda_taxas,
        coalesce( ed.venda_codigoimposto, ed.venda_codigoimposto ) as venda_codigoimposto,
        coalesce( jsonb_agg( to_jsonb( iten ) ) filter ( where iten.venda_venda_docorign is not null ),
          ed.doc->'arg_itens',
          jsonb_build_array()
        ) as arg_itens
      from __item_doc ed
        left join tweeks.venda ve on ed.venda_id = ve.venda_id
        left join __iten iten on ve.venda_id = iten.___iten_venda_super

      where ve.venda_id = any( _data.notacredito_aplicar )
        and ve.venda_venda_id is null
      group by 
        ve.venda_id,
        ed.venda_id,
        ed.venda_codigoimposto
  ) select
        jsonb_agg( to_jsonb( ve ) ) as arg_vendas
        into _vendas
      from __vendas ve
  ;

  /*
   -- obrigatorios
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,

      conta_posto_id: ID,

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

      -- requerido
      arg_vendas
   */


  if _conta.conta_cliente_id is null or _conta.conta_cliente_id = _const.maguita_cliente_final and not exists(
      select *
      from tweeks.cliente c
      where c.cliente_id = _const.maguita_cliente_finalnotacredito
  ) then
      select * into __branch from cluster.branch where _branch_uid = arg_branch_uid;
      insert into tweeks.cliente(
          cliente_id,
          cliente_colaborador_id,
          cliente_colaborador_gerente,
          cliente_espaco_auth,
          cliente_titular,
          _branch_uid,
          cliente_code
      ) values (
           _const.maguita_cliente_finalnotacredito,
           _const.colaborador_system_data,
           __branch.branch_main_user,
           __branch.branch_main_workspace,
           'CONTA DE NOTA DE CREDITO/DEBITO'
            ,
           __branch._branch_uid,
           'NDC100010'
       );
  end if;
  
  _conta_args.conta_cliente_id := _conta.conta_cliente_id;
  _conta_args.conta_data := coalesce( _conta_args.conta_data, current_date );
  if _conta_args.conta_cliente_id is null or _conta_args.conta_cliente_id = _const.maguita_cliente_final then
      _conta_args.conta_cliente_id := _const.maguita_cliente_finalnotacredito;
  end if;
  


  _conta_res := tweeks.funct_pos_reg_conta(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      '_serie_id', _serie_id,
      'arg_espaco_auth', _conta.conta_espaco_auth,
      'conta_posto_id', _conta_args.conta_posto_id,
      'conta_mesa', _conta_args.conta_mesa,
      'conta_extension', coalesce( _conta_args.conta_extension, jsonb_build_object()),
      'conta_chave', _conta_args.conta_chave,
      'conta_currency_id', null,
      'conta_tpaga_id', null,
      'conta_cliente_id', _conta_args.conta_cliente_id,
      'conta_titular', _conta.conta_titular,
      'conta_titularnif', _conta.conta_titularnif,
      'conta_data', _conta_args.conta_data,
      'arg_vendas', _vendas.arg_vendas,
      'conta_conta_docorigin', _conta.conta_id,
      'conta_observacao', _conta_args.conta_observacao,
      'conta_tserie_id', _const.maguita_tserie_notacredito,
      'conta_espaco_notacredito', arg_espaco_auth,
      'conta_docorigin', args->>'conta_docorigin',
      'conta_datedocorigin', args->>'conta_datedocorigin'
    )
  );
  
  if not _conta_res.result then
    return _conta_res;
  end if;

  /*
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
   */
  
  _conta_close_res := tweeks.funct_pos_change_conta_fechar(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', _conta.conta_espaco_auth,
      'arg_tserie_id', _const.maguita_tserie_notacredito,
      '_serie_id', _serie_id,
      'conta_conta_docorigin', _conta.conta_id,
      'conta_id', _conta_res.data->>'conta_id',
      'conta_extension', jsonb_build_object(),
      'conta_posto_id',  _conta_args.conta_posto_id,
      'conta_posto_fecho',  _conta_args.conta_posto_id,
      'conta_desconto', ( _conta.conta_desconto ),
      'conta_titular', _conta.conta_titular,
      'conta_tserie_id', _const.maguita_tserie_notacredito,
      'conta_titularnif', _conta.conta_titularnif,
      'conta_data', coalesce( _conta_args.conta_data, now()::date),
      'conta_cliente_id', _conta_args.conta_cliente_id,
      'guia_documentoperacao', format('NC-%s',  to_char( clock_timestamp(), 'YYYYMMDDHHMISS-US')),
      'guia_observacao', 'Guia de devolução ao stock ao efeturar uma nota de credito',
      'guia_metadata', coalesce( _conta_res.data, jsonb_build_object() ),
      'custos', jsonb_build_array(),
      'conta_chave', _conta_args.conta_chave,
      'arg_group_id', _conta._tgrupo_id
    )
  );

  return _conta_close_res;

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end
$$;
`;


export const funct_load_conta_docs_financa = sql`
-- create or replace function tweeks.funct_load_conta_notacredito(args jsonb)
create or replace function tweeks.funct_load_conta_docs_financa(args jsonb)
  returns setof jsonb
  language plpgsql
as
$$
declare
  /**
    args := {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      conta_fatura
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _conta_fatura character varying := args->>'conta_fatura';
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __venda_remanescete as (
      select 
          ve.venda_id,
          abs( ve.venda_quantidade ) - coalesce( sum( abs( ve2.venda_quantidade ) ), 0.0 ) as venda_quantidaderemanescente
        from tweeks.venda ve
          left join tweeks.venda ve2 on ve.venda_id  = ve2.venda_venda_docorign
            and ve2.venda_estado = _const.maguita_venda_estado_fechado
        where ve.venda_estado = _const.maguita_venda_estado_fechado
        group by ve.venda_id
        having sum( abs( ve2.venda_quantidade ) ) < abs( ve.venda_quantidade )
    ), __venda as (
      select
          ve.*,
          art.*,
          _ver.venda_quantidaderemanescente,
          sum( tx.taxa_taxa ) as taxa_taxa,
          sum( tx.taxa_percentagem ) as taxa_percentagem
        from tweeks.venda ve
          inner join __venda_remanescete _ver on ve.venda_id = _ver.venda_id
          inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
          left join tweeks.taxa tx on tx.taxa_id = any( venda_taxas )
        where ve._branch_uid  = arg_branch
          and ve.venda_venda_id is null
          and ve.venda_estado = _const.maguita_venda_estado_fechado
        group by ve.venda_id,
          art.artigo_id,
         _ver.venda_quantidaderemanescente
    ), __venda_group as (
      select
          _ve.venda_id,
          _ve.venda_conta_id,
          coalesce( jsonb_agg( to_jsonb( _vei ) ) filter ( where _vei.venda_id is not null), jsonb_build_array() ) as venda_itens
        from __venda _ve
          left join __venda _vei on _ve.venda_id = _vei.venda_venda_id
        where _ve.venda_venda_id is null
        group by _ve.venda_id,
          _ve.venda_conta_id

    ), __conta as (
      select
        ct.*,
        array_agg( to_jsonb( _veg ) || to_jsonb( _ved ) ) as conta_vendas
        from tweeks.conta ct
          inner join __venda_group _veg on ct.conta_id = _veg.venda_conta_id
          inner join __venda _ved on _veg.venda_id = _ved.venda_id
          left join tweeks.venda venda_ncred on _veg.venda_id = venda_ncred.venda_venda_docorign
            and venda_ncred.venda_estado = _const.maguita_venda_estado_fechado
        where ct._branch_uid = arg_branch
          and ct.conta_estado = _const.maguita_conta_estado_fechado
          and venda_ncred.venda_id is null
          and ct.conta_numerofatura = _conta_fatura
        group by ct.conta_id
    ) select to_jsonb( _ct )
        from __conta _ct
  ;
end;
$$;
`;