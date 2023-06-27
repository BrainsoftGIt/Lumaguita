
create or replace function tweeks.funct_sets_branch( args jsonb )
returns lib.res
language plpgsql as $$
declare
 /**
   args: {
      branch_uid?
      arg_colaborador_id : UID,
      arg_espaco_id : UID
      branch_tbranch_id
      branch_name
      branch_path
      branch_user := { ESTRUTURA DE CRIAÇÃO DO COLABORADOR | ESTRUTURA DE ATUALIZACAO DE COLABORADOR  }
      branch_workspace := { ESTRUTURA DE CRIAÇÃO DO ESPACO | ESTRUTURA DE ATUALIZACAO DE ESPACO  }
      branch_licence
      branch_clusters
      branch_grants : { menu: [ MENU-ID-1, MENU-ID-2, MENU-ID-3, MENU-ID-4 ] }
   }
  */
  _result record;
  _branch tweeks.branch;
  OPERATION_INSERT char default 'I';
  OPERATION_UPDATE char default 'U';
  _colaborator lib.result;
  _espaco lib.result;
  _args tweeks.branch;
  _const map.constant;
  _all_space record;

  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_id uuid default args->>'arg_espaco_id';
begin
  _const := map.constant();
  _args := jsonb_populate_record( _args, args );

  if _args.branch_uid is null then
    _args.branch_user := jsonb_build_object( 'creator', _args.branch_user );
    _args.branch_workspace := jsonb_build_object( 'creator', _args.branch_workspace );
  else
    select * into _branch
      from tweeks.branch b
      where b.branch_uid = _args.branch_uid
    ;
    _args.branch_user := _branch.branch_user || jsonb_build_object( 'updater', _args.branch_user );
    _args.branch_workspace := _branch.branch_workspace || jsonb_build_object( 'updater', _args.branch_workspace );
  end if;

  select
      s.*,
      ( s."returning"::tweeks.branch).*
      into _result
    from lib.sets( _args ) s
  ;

  _branch := _result."returning";

  -- Quando um novo branch for criado
  if (regexp_split_to_array( upper( _result.operation ), '' ))[1] = OPERATION_INSERT then
    _colaborator := tweeks.funct_reg_colaborador( _branch.branch_user->'creator' );
    if not _colaborator.result then
      raise exception '%', _colaborator;
    end if;

    _espaco := tweeks.funct_reg_espaco( _branch.branch_workspace->'creator' );
    if not _espaco.result then
      raise exception '%', _espaco;
    end if;

    _branch.branch_main_workspace := ( _espaco.message->'espaco'->>'espaco_id');
    _branch.branch_main_user :=  ( _colaborator.message->'colaborador'->>'colaborador_id');

    -- Ligar o colaborador ao seu branch
    update auth.colaborador
      set colaborador_branch_uid = _result.branch_uid,
          colaborador_tipo = _const.colaborador_tipo_user_master
      where colaborador_id = _branch.branch_main_user
    ;

    -- Ligar o espaco ao seu branch
    update tweeks.espaco
      set espaco_branch_uid = _result.branch_uid
      where espaco_id = _branch.branch_main_workspace
    ;

    select array_agg( jsonb_build_object( 'arg_espaco_id', e.espaco_id ) ) as branc_space into _all_space
      from tweeks.espaco e
      where e.espaco_nivel <= 1
    ;

    perform tweeks.funct_reg_trabalha( jsonb_build_object(
      'arg_espaco_auth', arg_espaco_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', lib.to_uuid( 2 ),
      'arg_espaco', _all_space.branc_space
    ));

    perform tweeks.funct_reg_trabalha( jsonb_build_object(
      'arg_espaco_auth', arg_espaco_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', _branch.branch_main_user,
      'arg_espaco', jsonb_build_array(
        jsonb_build_object( 'arg_espaco_id', _branch.branch_main_workspace )
      )
    ));

    -- Mapear o colaborador e o espaco principal no branch
    select (  "returning" ).* into _branch
      from lib.sets_up( _branch, ref := lib.sets_ref( _branch) )
    ;
  else
    _colaborator := tweeks.funct_change_colaborador( _branch.branch_user->'updater' );
    _espaco      := tweeks.funct_change_espaco( _branch.branch_workspace->'updater' );
  end if;

  return lib.res_true( jsonb_build_object(
    'branch', _branch
  ) || coalesce( _colaborator.message, jsonb_build_object()) || coalesce( _espaco.message, jsonb_build_object() ) );
end
$$;

create or replace function tweeks.funct_load_branch( args jsonb default null )
returns setof jsonb
language plpgsql as $$
declare
begin
  return query with
    __branh as (
      select
          b.branch_uid,
          b.branch_name,
          b.branch_path,
          b.branch_licence,
          b.branch_grants,
          b.branch_main_user,
          b.branch_main_workspace,
          b.branch_clusters,
          b.branch_date,
          b.branch_update,
          b.branch_state,
          tb.*,
          e.espaco_id,
          e.espaco_nome,
          e.espaco_nivel,
          e.espaco_estado,
          e.espaco_codigo,
          c.colaborador_id,
          c.colaborador_nome,
          c.colaborador_email,
          c.colaborador_apelido,
          c.colaborador_tipo
        from tweeks.branch b
          inner join tweeks.tbranch tb on  b.branch_tbranch_id = tb.tbranch_id
          left join tweeks.espaco e on b.branch_uid = e.espaco_branch_uid
            and e.espaco_id = b.branch_main_workspace
          left join auth.colaborador c on b.branch_uid = c.colaborador_branch_uid
            and c.colaborador_id = b.branch_main_user
    ) select to_jsonb( _b )
      from __branh _b
  ;
end;
$$;

create or replace function tweeks.__get_branch( uuid )
returns tweeks.branch
language sql as 'select * from tweeks.branch b where b.branch_uid = $1 ';


create or replace function tweeks.funct_load_cluster_by_branch( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_branch_uid: UID
    }
   */
  arg_branch_uid uuid default args->>'arg_branch_uid';
  _branch tweeks.branch;
begin
  _branch := tweeks.__get_branch( arg_branch_uid );

  return query with
    __clusters as (
      select
          c.cluster_identifier,
          c.cluster_name,
          c.cluster_configs,
          c.cluster_type,
          c.cluster_path,
          c.cluster_grants,
          c.cluster_version,
          c.cluster_sequence
        from cluster.cluster c
        where c.cluster_identifier = any( _branch.branch_clusters )
    ) select to_jsonb( c )
      from __clusters c;
end;
$$;


