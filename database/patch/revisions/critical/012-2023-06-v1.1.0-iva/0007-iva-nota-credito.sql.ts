import {block} from "../../../core/updater";

block( module, { identifier: "ivaNotaCredito", flags:["@unique"]}).sql`
alter table tweeks.conta add column if not exists conta_conta_docorigin uuid default null;
alter table tweeks.venda add column if not exists venda_venda_docorign uuid default null;

alter table tweeks.conta drop constraint if exists fk_conta_to_conta_docorigin;
alter table tweeks.venda drop constraint if exists fk_venda_to_venda_docorigin;

alter table tweeks.conta add constraint fk_conta_to_conta_docorigin foreign key ( conta_conta_docorigin )
  references tweeks.conta;

alter table tweeks.venda add constraint fk_venda_to_venda_docorigin foreign key ( venda_venda_docorign )
  references tweeks.venda
`;


block( module, { identifier: "funct_reg_conta_nota_credito", flags:[]}).sql`
create or replace function tweeks.funct_reg_conta_nota_credito(args jsonb) returns lib.res
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
      conta_posto_id: UID
      conta_observacao
      itens: [
        { venda_id:ID },
        { venda_id:ID },
        { venda_id:ID }...
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
  itens uuid[] default array( select (e.doc->>'venda_id')::uuid from jsonb_array_elements( args->'itens' ) e ( doc ) );
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
        count( * ) filter (
          where not ct.venda_ncexists
            and ct.venda_id = any ( itens )
            and ct.venda_venda_id is null
        ) as notacredito_aplicartotal,

        array_agg( ct.venda_id ) filter (
          where not ct.venda_ncexists
            and ct.venda_id = any ( itens )
            and ct.venda_venda_id is null
        ) as notacredito_aplicar,

        count( * ) filter (
          where ct.venda_id = any ( itens )
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
           and ct.venda_id = any ( itens )
           and ct.venda_venda_id is null
       ) as notacredito_exists
      from conta_origin ct
  ) select * into _data
     from notacareito_usar
  ;

  if _data.notacredito_aplicartotal = 0 then
    return lib.res_false( 'Nenhum dos iten selecionado pode-se aplicar nota de credito sobre ele' );
  end if;

  if _data.notacredito_aplicartotal < _data.notacredito_usartotal then
    return lib.res_false( 'Alguns dos itens selecionados já têm notas de creditos aplicado sobre ele',
      jsonb_build_object(
          'notacredito_exists', _data.notacredito_exists
        )
    );
  end if;


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
  with __iten as (
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
        ve.venda_artigo_id,
        ve.venda_quantidade * -1 as venda_quantidade,
        ve.venda_custounitario,
        ve.venda_custoquantidade,
        ve.venda_editado,
        ve.venda_isencao,
        ve.venda_montante * -1 as venda_montante,
        ve.venda_montanteagregado * -1 as venda_montanteagregado,
        ve.venda_montantetotal * -1 as venda_montantetotal,
        ve.venda_imposto * -1 as venda_imposto,
        ve.venda_montantesemimposto * -1 as venda_montantesemimposto,
        ve.venda_montantecomimposto * -1 as venda_montantecomimposto,
        ve.venda_impostoadicionar * -1 as venda_impostoadicionar,
        ve.venda_impostoretirar * -1 as venda_impostoretirar,
        ve.venda_descricao,
        ve.venda_lote,
        ve.venda_validade,
        ve.venda_metadata,
        ve.venda_taxas,
        coalesce( jsonb_agg( to_jsonb( iten ) ) filter ( where iten.venda_venda_docorign is not null ), jsonb_build_array()) as arg_itens
      from tweeks.venda ve
        left join __iten iten on ve.venda_id = iten.___iten_venda_super

      where ve.venda_id = any( _data.notacredito_aplicar )
        and ve.venda_venda_id is null
      group by ve.venda_id
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
           'CONTA DE NOTA DE CREDITO',
           __branch._branch_uid,
           'NC100010'
       );
  end if;
  
  _conta_args.conta_cliente_id := _conta.conta_cliente_id;
  if _conta_args.conta_cliente_id is null or _conta_args.conta_cliente_id = _const.maguita_cliente_final then
      _conta_args.conta_cliente_id := _const.maguita_cliente_finalnotacredito;
  end if;


  _conta_res := tweeks.funct_pos_reg_conta(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
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
      'conta_data', current_date,
      'arg_vendas', _vendas.arg_vendas,
      'conta_conta_docorigin', _conta.conta_id,
      'conta_observacao', _conta_args.conta_observacao,
      'conta_espaco_notacredito', arg_espaco_auth
    )
  );

  raise notice '%', to_jsonb(_conta_res);
  
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
      'conta_conta_docorigin', _conta.conta_id,
      'conta_id', _conta_res.data->>'conta_id',
      'conta_extension', jsonb_build_object(),
      'conta_posto_id',  _conta_args.conta_posto_id,
      'conta_posto_fecho',  _conta_args.conta_posto_id,
      'conta_desconto', ( _conta.conta_desconto ),
      'conta_titular', _conta.conta_titular,
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
end
$$;


create or replace function tweeks.funct_load_conta_notacredito( args jsonb )
returns setof jsonb
language plpgsql as $$
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
    with __venda as (
      select
          ve.*,
          art.*,
          sum( tx.taxa_taxa ) as taxa_taxa,
          sum( tx.taxa_percentagem ) as taxa_percentagem
        from tweeks.venda ve
          inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
          left join tweeks.taxa tx on tx.taxa_id = any( venda_taxas )
        where ve._branch_uid  = arg_branch
          and ve.venda_venda_id is null
          and ve.venda_estado = _const.maguita_venda_estado_fechado
        group by ve.venda_id,
          art.artigo_id
    ), __venda_group as (
      select
          _ve.venda_id,
          _ve.venda_conta_id,
          array_agg( to_jsonb( _vei ) ) as venda_itens
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
