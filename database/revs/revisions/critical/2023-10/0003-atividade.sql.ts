import {patchSQL, sql} from "kitres";

export const activityReportStructure = patchSQL<any,any>({ unique: true }).sql`
create table if not exists tweeks.tatividade(
  tatividade_id int not null primary key,
  tatividade_code character varying not null,
  tatividade_desc character varying not null,
  tatividade_operation character varying not null
);

insert into tweeks.tatividade( tatividade_id, tatividade_code, tatividade_desc, tatividade_operation ) 
  values 
         ( 1, 'ACCESS', 'Acesso/Visualização', 'SELECT' )
        ,( 2, 'CREATE', 'Insersão', 'INSERT' )
        ,( 3, 'CHANGE', 'Atualização', 'UPDATE' )
        ,( 4, 'DISABLE', 'Desativação', 'UPDATE' )
        ,( 5, 'REACTIVATE', 'Re-Ativação', 'UPDATE' )
        ,( 6, 'DELETE', 'Eliminação', 'UPDATE' )
        ,( 7, 'DESTROY', 'Eliminação permanente', 'DELETE' )
;

select map.constant( 'maguita_tatividade_access', 'int2', 1 );
select map.constant( 'maguita_tatividade_create', 'int2', 2 );
select map.constant( 'maguita_tatividade_change', 'int2', 3 );
select map.constant( 'maguita_tatividade_disable', 'int2', 4 );
select map.constant( 'maguita_tatividade_reativate', 'int2', 5 );
select map.constant( 'maguita_tatividade_delete', 'int2', 6 );
select map.constant( 'maguita_tatividade_destroy', 'int2', 7 );

select map.constant( 'maguita_atividadeoperacao_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_atividadeoperacao_estado_fechado', 'int2', 0 );
create table if not exists tweeks.atividadeoperacao(
  atividadeoperacao_uid uuid not null primary key default gen_random_uuid(),
  atividadeoperacao_description character varying,
  atividadeoperacao_estado int2 not null default map.get('maguita_atividadegroup_state_active')::int2,
  atividadeoperacao_date timestamptz not null default clock_timestamp(),
  atividadeoperacao_dateupdate timestamptz default null,
  atividadeoperacao_user_id uuid not null,
  atividadeoperacao_user_update uuid default null,
  _branch_uid uuid
);


select map.constant( 'maguita_atividade_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_atividade_estado_fechado', 'int2', 0 );
create table if not exists tweeks.atividade(
  atividade_uid uuid not null primary key default gen_random_uuid(),
  atividade_title character varying not null,
  atividade_description character varying default null null,
  atividade_referer jsonb default null,
  atividade_props jsonb not null default jsonb_build_object(),
  atividate_date timestamptz not null default clock_timestamp(),
  atividade_estado int2 not null default map.get('maguita_atividade_estado_ativo')::int2,
  atividade_tatividade_id int not null,
  atividade_atividadeoperacao_id uuid not null,
  atividade_user_uid uuid not null,
  _branch_uid uuid not null ,
  constraint fk_atividade_to_tatividade foreign key ( atividade_tatividade_id ) references tweeks.tatividade,
  constraint fk_atividade_to_atividadegroup foreign key ( atividade_atividadeoperacao_id ) references tweeks.atividadeoperacao
);
`;

export const createTrunkBranch = sql`
do $$
declare 
  sets jsonb default '{
    "branch_uid": "00000000-0000-0000-0000-000000000001",
    "branch_tbranch_id": 1,
    "branch_name": "Trunk",
    "branch_path": "/trunk",
    "branch_user": {"creator": {"arg_espaco": [], "arg_tsexo_id": null, "arg_menu_list": [], "arg_espaco_auth": "00000000-0000-0000-0000-000000000001", "arg_colaborador_id": "00000000-0000-0000-0000-000000000002", "arg_colaborador_nif": null, "arg_colaborador_pin": "lumaguita#2023", "arg_colaborador_foto": null, "arg_colaborador_nome": "jasmin", "arg_colaborador_email": "trunk@luma.brainsoftstp.com", "arg_colaborador_ficha": null, "arg_colaborador_senha": "lumaguita#2023", "arg_colaborador_apelido": null, "arg_colaborador_datanascimento": null}},
    "branch_workspace": {"creator": {"arg_espaco_auth": "00000000-0000-0000-0000-000000000001", "arg_espaco_nome": "Trunk", "arg_espaco_vender": null, "arg_colaborador_id": "00000000-0000-0000-0000-000000000002", "arg_espaco_descricao": null, "arg_espaco_configurar": true, "arg_espaco_gerarfatura": true}},
    "branch_licence": null,
    "branch_grants": {"menu": []},
    "branch_main_user": "00000000-0000-0000-0000-000000000002",
    "branch_main_workspace": "00000000-0000-0000-0000-000000000001",
    "branch_clusters": [],
    "branch_date": "2022-10-11 09:59:29.793980 +00:00",
    "branch_update": null,
    "branch_state": 0,
    "_branch_uid": "00000000-0000-0000-0000-000000000001"
  }'::jsonb;
  _branch cluster.branch;
begin
  _branch := jsonb_populate_record( _branch, sets );
  perform lib.sets( _branch );
end;
$$
`;

export const setsActivity = sql`
create or replace function tweeks.sets_atividade( args jsonb )
returns lib.res
language plpgsql as $$ 
declare
  /**doc
    args := {
      _user_uid uuid,
      _workspace_uid uuid,
      _operacao_description
      atividade_title character varying not null,
      atividade_description character varying default null null,
      atividade_referer jsonb default null,
      atividade_props jsonb not null default jsonb_build_object(),
      atividade_tatividade_id int not null,
    }
   doc*/

  _user_uid uuid default args->>'_user_uid';
  _workspace_uid uuid default args->>'_workspace_uid';
  _branch uuid default tweeks.__branch_uid( _user_uid, _workspace_uid );
  _operacao_description text default lib.str_normalize(upper(args->>'_operacao_description'));
  _atividadeoperacao tweeks.atividadeoperacao;
  _const map.constant;
  _trunk uuid default '00000000-0000-0000-0000-000000000001'::uuid;
  _atividade tweeks.atividade;
begin
  _const := map.constant();
  if _branch is null and _workspace_uid = _trunk then 
    _branch := _trunk;
  end if;
  
  if _branch is null then
    return lib.res_false( 'Não pode criar a ativadade, branch não foi definido' );
  end if;

  _atividade := jsonb_populate_record( _atividade, args );
  
  select *
    from tweeks.atividadeoperacao at 
    where at.atividadeoperacao_description = _operacao_description
      and at._branch_uid  = _branch
    into _atividadeoperacao
  ;
  
  -- Criar o grupo de atividade se não existir
  if _atividadeoperacao.atividadeoperacao_uid is null then
    insert into tweeks.atividadeoperacao(
      atividadeoperacao_description,
      atividadeoperacao_user_id,
      _branch_uid        
    ) values (
      _operacao_description,
      _user_uid,
      _branch
    ) returning * into _atividadeoperacao;
  end if;

  -- Criar atividade
  _atividade.atividade_atividadeoperacao_id := _atividadeoperacao.atividadeoperacao_uid;
  select ( "returning" ).* into _atividade
    from lib.sets( _atividade )
  ;
  
  return lib.res_true(
    jsonb_build_object(
      'atividade', _atividade  
    )
  );
end;
$$
`;