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
  __signal double precision;
  
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
  
  if _tserie_id = _const.maguita_tserie_notacredito then __signal := -1; 
  else __signal := 1;
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
  ), __vendas_existis as (
    select 
        ve.*,
        abs( ve.venda_quantidade ) as __venda_quantidade,
        ( abs( ve.venda_montantecomimposto ) - abs( ve.venda_montantesemimposto ) ) / abs( ve.venda_quantidade ) as __venda_montantecomimposto,
        abs( ve.venda_montantesemimposto ) / abs( ve.venda_quantidade ) as __venda_montantesemimposto,
        abs( ve.venda_montanteagregado ) / abs( ve.venda_quantidade ) as __venda_montanteagregado,
        abs( ve.venda_montantetotal ) / abs( ve.venda_quantidade ) as __venda_montantetotal,
        abs( ve.venda_imposto ) / abs( ve.venda_quantidade ) as __venda_imposto,
        abs( ve.venda_impostoadicionar ) / abs( ve.venda_quantidade ) as __venda_impostoadicionar,
        abs( ve.venda_impostoretirar ) / abs( ve.venda_quantidade ) as __venda_impostoretirar,
        abs( ve.venda_montante ) / abs( ve.venda_quantidade ) as __venda_montante
    
      from tweeks.venda ve 
      where ve.venda_id = any( _data.notacredito_aplicar ) and ve.venda_venda_id is null
  ), __vendas as (
    select
        case
          when arg_conta_id is not null then ve.venda_id
        end as venda_venda_docorign,
        case 
          when arg_conta_id is not null then ve.venda_artigo_id
          else  ed.venda_artigo_id
        end as venda_artigo_id,
        case
          when arg_conta_id is null then ed\.venda_quantidade * __signal
          else coalesce( ed.venda_quantidade, ve.venda_quantidade ) * __signal
        end as venda_quantidade,
        case
          when arg_conta_id is null then ed.venda_custounitario
          else ve.venda_custounitario
        end as venda_custounitario,
        case 
          when arg_conta_id is null then ed.venda_custoquantidade
          else ve.venda_custoquantidade
        end as venda_custoquantidade,
        case
          when arg_conta_id is null then ed.venda_editado
          else ve.venda_editado
        end as venda_editado,
        case 
          when arg_conta_id is null then ed.venda_isencao
          else ve.venda_isencao
        end as venda_isencao,
        case
          when arg_conta_id is null then ed.venda_taxas
          else ve.venda_taxas
        end as venda_taxas,
        case
          when arg_conta_id is null then ed.venda_validade
          else ve.venda_validade
        end as venda_validade,
        case
          when arg_conta_id is null then ed.venda_lote
          else ve.venda_lote
        end as venda_lote,
        case
          when arg_conta_id is null then ed.venda_montante * __signal
          else ve.__venda_montante * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_montante,
        case
          when arg_conta_id is null then ed.venda_montanteagregado * __signal
          else ve.__venda_montanteagregado * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_montanteagregado,
        case 
          when arg_conta_id is null then ed.venda_montantetotal * __signal
          else ve.__venda_montantetotal * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_montantetotal,
        case
          when arg_conta_id is null then ed.venda_imposto * __signal
          else ve.__venda_imposto * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_imposto,
        case
          when arg_conta_id is null then ed.venda_montantesemimposto * __signal
          else ve.__venda_montantesemimposto * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_montantesemimposto,
        case
          when arg_conta_id is null then ed.venda_montantecomimposto * __signal
          else ve.__venda_montantecomimposto * coalesce( ed.venda_quantidade, ve.__venda_quantidade ) * __signal
        end as venda_montantecomimposto,
        case
          when arg_conta_id is null then ed.venda_impostoadicionar * __signal
          else ve.__venda_impostoadicionar * coalesce( ed.venda_quantidade, ve.venda_quantidade ) * __signal 
        end as venda_impostoadicionar,
        case
          when arg_conta_id is null then ed.venda_impostoretirar * __signal
          else ve.__venda_impostoretirar * coalesce( ed.venda_quantidade, ve.venda_quantidade ) * __signal 
        end as venda_impostoretirar,
        case
          when arg_conta_id is null then ed.venda_descricao
          else coalesce( ed.venda_descricao, ve.venda_descricao )
        end as venda_descricao,
        case
          when arg_conta_id is null then ed.venda_metadata
          else coalesce( ed.venda_metadata, ve.venda_metadata )
        end as venda_metadata,
        case
          when arg_conta_id is null then ed.venda_codigoimposto
          else coalesce( ed.venda_codigoimposto, ve.venda_codigoimposto )
        end as venda_codigoimposto,
        jsonb_build_array() as arg_itens
      from __item_doc ed
        left join __vendas_existis ve on ed.venda_id = ve.venda_id

      where ( ve.venda_id is null and arg_conta_id is null ) 
        or ( ve.venda_id = any( _data.notacredito_aplicar ) and ve.venda_venda_id is null )
    
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
      'arg_espaco_auth', coalesce( _conta.conta_espaco_auth, arg_espaco_auth ),
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
      'conta_tserie_id', _tserie_id,
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
      'arg_espaco_auth', coalesce( _conta.conta_espaco_auth, arg_espaco_auth ),
      'arg_tserie_id', _tserie_id,
      '_serie_id', _serie_id,
      'conta_conta_docorigin', _conta.conta_id,
      'conta_id', _conta_res.data->>'conta_id',
      'conta_extension', jsonb_build_object(),
      'conta_posto_id',  _conta_args.conta_posto_id,
      'conta_posto_fecho',  _conta_args.conta_posto_id,
      'conta_desconto', ( _conta.conta_desconto ),
      'conta_titular', _conta.conta_titular,
      'conta_tserie_id', _tserie_id,
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
  /**doc
    args := {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      conta_fatura
      _tserie_id: UID
    }
   doc*/
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _tserie_id int2 not null default args->>'_tserie_id';
  _conta_fatura character varying := args->>'conta_fatura';
  _const map.constant;
  __docs_of int2[];
begin
  _const := map.constant();
  
  
  if _tserie_id = _const.maguita_tserie_notacredito then 
      __docs_of := array[
        _const.maguita_tserie_fatura,
        _const.maguita_tserie_faturarecibo,
        _const.maguita_tserie_faturasimplificada
      ]::int2[];
  elsif _tserie_id = _const.maguita_tserie_notadebito then 
    __docs_of := array[ 
      _const.maguita_tserie_notacredito
    ]::int2[];
  end if;
  
  
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
        having coalesce( sum( abs( ve2.venda_quantidade ) ), 0.0) < abs( ve.venda_quantidade )
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
          and ct.conta_tserie_id = any( __docs_of )
          and ct.conta_estado = _const.maguita_conta_estado_fechado
          and ct.conta_numerofatura = _conta_fatura
        group by ct.conta_id
    ) select to_jsonb( _ct )
        from __conta _ct
  ;
end;
$$;
`;


