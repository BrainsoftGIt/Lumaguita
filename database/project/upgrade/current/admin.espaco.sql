create or replace function tweeks.funct_load_espaco(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função lista todos os espacos registrado no sistema
    filter := {
      arg_espaco_auth: ID,
      arg_colaborador_id: UID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default filter->>'arg_colaborador_id';
  arg_espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
begin

  _const := map.constant();
  return query
    with __espaco as (

    select
        esp.espaco_id,
        esp.espaco_nome,
        esp.espaco_vender,
        esp.espaco_descricao,
        esp.espaco_codigo,
        esp.espaco_estado,
        esp.espaco_dataregistro,
        esp.espaco_dataatualizacao,
        esp.espaco_gerarfatura,
        esp.espaco_configurar,
        esp.espaco_configuracao,
        esp.espaco_nivel,
        esp.espaco_posto_admin,
        clu.cluster_identifier,
        clu.cluster_name,
        po.posto_id,
        po.posto_designacao,
        po.posto_chave,
        po.posto_matricula

      from tweeks.espaco esp
        inner join tweeks.branch br on esp.espaco_branch_uid = br.branch_uid
          and br.branch_uid = ___branch
        left join tweeks.posto po on esp.espaco_posto_admin = po.posto_id
        left join cluster.cluster clu on clu.cluster_identifier = esp.espaco_vender
--           and clu.cluster_identifier = any( br.branch_clusters )
      where esp.espaco_espaco_id = any( arg_espaco_child )
        or esp.espaco_id = arg_espaco_auth
      order by esp.espaco_nivel,
        esp.espaco_nome
    ) select to_jsonb( e  )
      from __espaco e
  ;
end;
$$;

create or replace function tweeks.funct_load_espaco_configuracao(filter jsonb) returns jsonb
  immutable
  strict
  language plpgsql
as
$$
declare
  /**
    Essa função serve para devolver o espaço onde deve ser processado a fatura
    arg_espaco_auth := ID
   */
  arg_espaco_id uuid not null default filter->>'arg_espaco_auth';
  _espaco record;
begin

--   Obter o espaço superior que pode gerar numero de seire
    with recursive __espaco as (
      select e.*, e.espaco_gerarfatura as __generate_serie
      from tweeks.espaco e
      where e.espaco_id = arg_espaco_id
      union all
      select w.*, w.espaco_configurar
        from __espaco _e
          inner join tweeks.espaco w on _e.espaco_espaco_id = w.espaco_id
        and not _e.__generate_serie
    ) select * into _espaco from __espaco __e
      where __e.__generate_serie
    ;

--   with recursive parent as (
--       select e.* from tweeks.espaco e where e.espaco_id = arg_espaco_id
--     union all
--       select e.*
--         from parent p
--           inner join tweeks.espaco e on p.espaco_espaco_id = e.espaco_id
--         where not p.espaco_configurar
--   ) select l.* into _espaco
--   from parent l
--     where l.espaco_configurar
--   ;

  _espaco.espaco_configurar := arg_espaco_id = _espaco.espaco_id and _espaco.espaco_configurar;

  return jsonb_build_object(
    'espaco', lib.jsonb_values( _espaco, 'espaco_configurar', 'espaco_configuracao', 'espaco_id', 'espaco_nome' )
  );
end;
$$;


create or replace function tweeks.funct_load_espaco_simple( filter jsonb )
returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função lista os espacos ativos
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __espaco as (
        select
          esp.espaco_id,
          esp.espaco_nome,
          esp.espaco_codigo,
          esp._branch_uid
        from tweeks.espaco esp
        where esp.espaco_estado = _const.maguita_espaco_estado_ativo
          and ( esp.espaco_espaco_id = any( arg_arg_espaco_child ) or esp.espaco_id = arg_espaco_auth )
        order by esp.espaco_nome
    ) select to_jsonb( e )
        from __espaco e
  ;
end;
$$;

alter table if exists tweeks.espaco alter espaco_codigo drop default;

drop function if exists tweeks.__generate_space_code();


create or replace function tweeks.funct_load_espaco_migrate( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    arg_espaco_migracao: UID
    arg_espaco_id: UID
    arg_colaborador_id: UID
   */
  arg_espaco_id uuid default args->>'arg_espaco_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_migracao uuid default args->>'arg_espaco_migracao';

  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_id );
  _espaco tweeks.espaco;
begin
  _espaco := tweeks._get_espaco( arg_espaco_migracao );

  return query
    with recursive __espaco as (
      select
          e.espaco_id,
          e.espaco_nome,
          e.espaco_nivel,
          e.espaco_espaco_id,
          array[ e.espaco_id ]::uuid[] as path
        from tweeks.espaco e
        where e.espaco_nivel = 1
          and _branch_uid = _branch_uid
      union all
        select
            es.espaco_id,
            es.espaco_nome,
            es.espaco_nivel,
            es.espaco_espaco_id,
            _e.path || es.espaco_id
          from __espaco _e
            inner join tweeks.espaco es on _e.espaco_id = es.espaco_espaco_id
          where es._branch_uid = ___branch
    ) select to_jsonb( _es )
        from __espaco _es
        where arg_espaco_migracao != all( _es.path )
          and _es.espaco_id != _espaco.espaco_espaco_id
  ;
end;
$$;

create or replace function tweeks.funct_reg_espaco(args jsonb)
 returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa função serve para registar os espaços
    args = {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_espaco_vender: BOOLEAN,
      arg_espaco_posto_admin: UUID
      arg_espaco_nome: NOME,
      arg_espaco_descricao: NOME,
      arg_espaco_gerarfatura: BOOLEAN,
      arg_espaco_configurar: BOOLEAN,
      arg_branch_uid: UID
    }
   */

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_vender character varying default args->>'arg_espaco_vender';
  arg_espaco_nome character varying default lib.str_normalize( args->>'arg_espaco_nome' );
  arg_espaco_gerarfatura boolean default lib.str_normalize( args->>'arg_espaco_gerarfatura' );
  arg_espaco_configurar boolean default lib.str_normalize( args->>'arg_espaco_configurar' );
  arg_espaco_descricao character varying default lib.str_normalize( args->>'arg_espaco_descricao' );
  arg_branch_uid uuid default args->>'arg_branch_uid';
  arg_espaco_posto_admin uuid default args->>'arg_espaco_posto_admin';

  _espaco tweeks.espaco;
  _const map.constant;

begin
  _const := map.constant();

  if (
    select count( * ) > 0
      from tweeks.espaco esp
      where lib.str_normalize( lower( esp.espaco_nome ) ) = lib.str_normalize( lower( arg_espaco_nome ) )
  ) then
    return false ? '@espaco.nome.already-exist';
  end if;

  _espaco.espaco_codigo := cluster.next( 'espaco.codigo/seq',
      sub := arg_branch_uid::text,
      lpad := 2,
      lpad_char := '0',
      --language=PostgreSQL
      exist := format( 'select * from tweeks.espaco where espaco_codigo = $1 and coalesce( _branch_uid, espaco_branch_uid ) = (%L)::uuid', arg_branch_uid ),
      exist_limit := 1000
    );

  insert into tweeks.espaco (
    espaco_branch_uid,
    espaco_espaco_id,
    espaco_espaco_auth,
    espaco_colaborador_id,
    espaco_nome,
    espaco_descricao,
    espaco_gerarfatura,
    espaco_configurar,
    espaco_vender,
    espaco_codigo,
    espaco_posto_admin
  ) values (
    arg_branch_uid,
    arg_espaco_auth,
    arg_espaco_auth,
    arg_colaborador_id,
    arg_espaco_nome,
    arg_espaco_descricao,
    arg_espaco_gerarfatura,
    arg_espaco_configurar,
    arg_espaco_vender,
    _espaco.espaco_codigo,
    arg_espaco_posto_admin
  ) returning * into _espaco;

  perform tweeks.funct_reg_cambio(
    jsonb_build_object(
      'arg_espaco_auth', _espaco.espaco_id,
      'arg_branch_uid', arg_branch_uid,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_currency_id', _const.currency_std,
      'arg_cambio_taxa', 1,
      'arg_cambio_data', make_date( 2000, 01, 01 )
  ));

  return true ? jsonb_build_object(
    'espaco', _espaco
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

create or replace function tweeks.funct_change_espaco(args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /** Essa função serve para atualizar as informações do espaco
    args := {
      arg_espaco_change: ID -- id do espao que ser atualizado
      arg_espaco_vender: BOOLEAN
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_espaco_nome: NOME
      arg_espaco_descricao: DESCRICAO
      arg_espaco_gerarfatura: BOOLEAN
      arg_espaco_configurar: BOOLEAN
      arg_espaco_posto_admin: UUID,
      xBranch:boolean
    }
  */

  arg_espaco_vender character varying not null default args->>'arg_espaco_vender';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_change uuid not null default args->>'arg_espaco_change';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_nome character varying not null default args->>'arg_espaco_nome';
  arg_espaco_descricao character varying default args->>'arg_espaco_descricao';
  arg_espaco_gerarfatura boolean not null default args->>'arg_espaco_gerarfatura';
  arg_espaco_configurar boolean not null default args->>'arg_espaco_configurar';
  arg_espaco_posto_admin uuid default args->>'arg_espaco_posto_admin';
  xBranch boolean default args->>'xBranch';
  _espaco tweeks.espaco;
begin
  xBranch := coalesce( xBranch, false );

  --Quando for uma atualização do propietario
  if not xBranch then
    update tweeks.espaco
      set espaco_nome = arg_espaco_nome,
          espaco_descricao = arg_espaco_descricao,
          espaco_vender = arg_espaco_vender,
          espaco_gerarfatura = arg_espaco_gerarfatura,
          espaco_configurar = arg_espaco_configurar,
          espaco_posto_admin = coalesce( arg_espaco_posto_admin, espaco_posto_admin ),

          espaco_colaborador_atualizaco = arg_colaborador_id,
          espaco_dataatualizacao = current_timestamp
      where espaco_id = arg_espaco_change
      returning * into _espaco
    ;
  else
    update tweeks.espaco
      set espaco_nome = arg_espaco_nome,
          espaco_colaborador_atualizaco = arg_colaborador_id,
          espaco_dataatualizacao = current_timestamp
      where espaco_id = arg_espaco_change
      returning * into _espaco;
  end if;

  return true ? jsonb_build_object(
    'espaco', _espaco
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text; ll jsonb;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;
