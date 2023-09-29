import {block} from "../../../core/updater";

block( module, { identifier: "funct_pos_load_conta_proforma" }).sql`
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
          ct.conta_props,
          cli.cliente_id,
          cli.cliente_titular,
          cli.cliente_nif,
          cli.cliente_metadata,
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
`;


block( module, { identifier: "tweeks.funct_load_guia_data"}).sql`
create or replace function tweeks.funct_load_guia_data(args jsonb) returns SETOF json
  language plpgsql
as
$$
declare
  /**
    args := {
      guia_id UUID,
      arg_colaborador_id UUID
      arg_espaco_auth UUID
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';

  _guia tweeks.guia;
  _const map.constant;
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();
  _guia := jsonb_populate_record( _guia, args );
  select * into _guia
    from tweeks.guia
    where guia_uid = _guia.guia_uid
      and _branch_uid = ___branch
  ;

  return next json_build_object( 'type', cluster.__format( pg_typeof( _guia )::text::regclass ), 'data', _guia );

  return query with __custoguia as (
    select ent as data, cluster.__format( ent.tableoid ) as type
      from tweeks.custoguia ent
      where ent.custoguia_guia_uid = _guia.guia_uid
        and ent.custoguia_estado = _const.maguita_custoguia_estado_ativo
        and ent._branch_uid = ___branch
  ) select to_json( _e ) from __custoguia _e;

  if _guia.guia_toperacao_id = _const.maguita_toperacao_entrada then
    return query with __raw as (
      select ent.*,
             art.artigo_id,
             art.artigo_nome,
             art.artigo_codigo,
             un.unit_id,
             un.unit_code,
             un.unit_name,
             cluster.__format( ent.tableoid ) as type
        from tweeks.entrada ent
          inner join tweeks.artigo art on ent.entrada_artigo_id = art.artigo_id
          left join tweeks.unit un on art.artigo_unit_id = un.unit_id
        where ent.entrada_guia_id = _guia.guia_uid
          and ent.entrada_estado = _const.entrada_estado_ativo
          and ent._branch_uid = ___branch
    ), __entrada as (
      select to_json( r ) as data, r.type
        from __raw r
    ) select to_json( _e ) from __entrada _e;

    return query with __fornecedor as (
      select ent as data, cluster.__format( ent.tableoid ) as type
        from tweeks.fornecedor ent
      where ent._branch_uid = ___branch
        and ent.fornecedor_id = _guia.guia_refuid
        and _guia.guia_refclass::regclass = ent.TABLEOID::regclass
    ) select to_json( _f ) from __fornecedor _f;

  elseif _guia.guia_toperacao_id = _const.maguita_toperacao_venda then
    return query with __venda as (
      select ent as data, cluster.__format( 'tweeks.conta'::regclass ) as type
      from tweeks.funct_pos_load_conta_data( args ) ent
    ) select to_json( _e ) from __venda _e;

  end if;
end
$$;
`;