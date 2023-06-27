drop table if exists tweeks.tbranch;
create table tweeks.tbranch(
  tbranch_id int2 not null,
  tbranch_name character varying not null,
  tbranch_configs jsonb default jsonb_build_object(),
  constraint pk_tbranch_id primary key ( tbranch_id )
);

insert into tweeks.tbranch( tbranch_id, tbranch_name, tbranch_configs ) values
  ( 1, 'Restaurante',   $${ "base": [ "pos", "stock", "cozinha", "", "", "", "", "", "", "" ] }$$ ),
  ( 2, 'Framacia',      $${ "base": [ "pos", "stock", "", "", "", "", "", "", "", "" ] }$$ ),
  ( 3, 'Supermeca',     $${ "base": [ "pos", "stock", "", "", "", "", "", "", "", "" ] }$$ ),
  ( 4, 'Loja',          $${ "base": [ "pos", "stock", "", "", "", "", "", "", "", "" ] }$$ ),
  ( 5, 'Fabrica',       $${ "base": [ "pos", "stock", "criacao", "", "", "", "", "", "", "" ] }$$ ),
  ( 6, 'Salão',         $${ "base": [ "pos", "stock", "", "", "", "", "", "", "", "" ] }$$ ),
  ( 7, 'Hotél',         $${ "base": [ "pos", "stock", "cozinha", "", "", "", "", "", "", "" ] }$$ )
;


alter table tweeks.branch alter branch_clusters set not null;

drop table if exists tweeks.branch;
create table tweeks.branch(
  branch_uid uuid not null default gen_random_uuid(),
  branch_tbranch_id int2 not null,
  branch_name character varying not null,
  branch_path character varying not null,
  branch_user jsonb,
  branch_workspace jsonb,
  branch_licence jsonb,
  branch_grants jsonb,
  branch_main_user uuid,
  branch_main_workspace uuid,
  branch_clusters character varying[] default null,
  branch_date timestamptz not null default current_timestamp,
  branch_update timestamptz default null,
  branch_state int2,
  constraint pk_branch_uid primary key ( branch_uid )
);

alter table auth.colaborador add if not exists colaborador_branch_uid uuid ;
alter table tweeks.espaco drop if exists espaco_branch;
alter table tweeks.espaco add if not exists espaco_branch_uid uuid;
alter table auth.colaborador alter colaborador_espaco_auth drop not null;
alter table tweeks.espaco drop if exists espaco_trazao_id;

alter table tweeks.espaco add if not exists espaco_espaco_auth uuid;
update tweeks.espaco set espaco_espaco_auth = espaco_espaco_id where true;