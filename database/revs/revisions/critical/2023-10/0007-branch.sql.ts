import {sql} from "kitres";

export const funct_sets_branch = sql`
create or replace function tweeks.funct_sets_branch( args jsonb) returns lib.res
  language plpgsql
as
$$
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
  _branch cluster.branch;
  OPERATION_INSERT char default 'I';
  OPERATION_UPDATE char default 'U';
  _colaborator lib.result;
  _espaco lib.result;
  _args cluster.branch;
  _const map.constant;
  _all_space record;
  _arg_menu_list jsonb;

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
    from cluster.branch b
    where b.branch_uid = _args.branch_uid
    ;
    _args.branch_user := _branch.branch_user || jsonb_build_object( 'updater', _args.branch_user );
    _args.branch_workspace := _branch.branch_workspace || jsonb_build_object( 'updater', _args.branch_workspace );
  end if;

  select
    s.*,
    ( s."returning"::cluster.branch).*
  into _result
  from lib.sets( _args ) s
  ;

  _branch := _result."returning";

  -- Quando um novo branch for criado
  if ( regexp_split_to_array( upper( _result.operation ), '' ) )[1] = OPERATION_INSERT then

    _espaco := tweeks.funct_reg_espaco( (_branch.branch_workspace->'creator')||jsonb_build_object(
        'arg_branch_uid', _branch.branch_uid
      ));

    if not _espaco.result then
      raise exception '%', _espaco;
    end if;

    _branch.branch_main_workspace := ( _espaco.message->'espaco'->>'espaco_id');

    _colaborator := tweeks.funct_reg_colaborador(  ( _branch.branch_user->'creator' )|| jsonb_build_object(
        'arg_branch_uid', _branch.branch_uid,
        'arg_colaborador_tipo', _const.colaborador_tipo_user_master,
        'arg_espaco', jsonb_build_array(
            jsonb_build_object( 'arg_espaco_id', _branch.branch_main_workspace )
          )
      ));

    if not _colaborator.result then
      raise exception '%', _colaborator;
    end if;

    _branch.branch_main_user :=  ( _colaborator.message->'colaborador'->>'colaborador_id');

    with __news_space as (
      select *
        from tweeks.espaco e
          left join tweeks.trabalha tr on e.espaco_id = tr.trabalha_espaco_destino
            and tr.trabalha_estado = _const.transferencia_estado_ativo
            and tr.trabalha_colaborador_proprietario = lib.to_uuid( 2 )
        where tr.trabalha_id is null
          and e.espaco_nivel <= 1
    ) insert into tweeks.trabalha(
      trabalha_espaco_destino,
      trabalha_espaco_auth,
      trabalha_colaborador_proprietario,
      trabalha_colaborador_id
    ) select
        n.espaco_id,
        lib.to_uuid( 1 ),
        lib.to_uuid( 2 ),
        lib.to_uuid( 1 )
      from __news_space n
    ;

    -- Mapear o colaborador e o espaco principal no branch
    select (  "returning" ).* into _branch
    from lib.sets_up( _branch, ref := lib.sets_ref( _branch) )
    ;
  else
    _arg_menu_list := _branch.branch_user->'updater'->'arg_menu_list';

    _colaborator := tweeks.funct_change_colaborador(  ( _branch.branch_user->'updater' )|| jsonb_build_object(
        'arg_colaborador_tipo', _const.colaborador_tipo_user_master,
        'arg_espaco', jsonb_build_array(
            jsonb_build_object( 'arg_espaco_id', _branch.branch_main_workspace )
          )
      ));

    perform auth.funct_reg_acesso(
        jsonb_build_object(
            'arg_colaborador_id', arg_colaborador_id,
            'arg_colaborador_propetario', _branch.branch_main_user,
            'arg_menu_list', _arg_menu_list,
            '_branch_uid', _branch.branch_uid
          )
      );
    _espaco  := tweeks.funct_change_espaco( _branch.branch_workspace->'updater' || jsonb_build_object(
      'xBranch', true
    ));
  end if;

  return lib.res_true( jsonb_build_object(
    'branch', _branch
    ) || coalesce( _colaborator.message, jsonb_build_object() ) || coalesce( _espaco.message, jsonb_build_object() ) );
end
$$;
`;