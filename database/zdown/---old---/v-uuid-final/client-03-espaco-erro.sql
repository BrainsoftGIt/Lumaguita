
alter table tweeks.espaco drop espaco_nivel;
alter table tweeks.espaco add column espaco_nivel int2 not null generated always as ((COALESCE(__space_branch_level(espaco_espaco_id), '-1'::integer) + 1)) stored;

alter table tweeks.espaco drop espaco_branch;
alter table tweeks.espaco add column espaco_branch uuid not null generated always as ( tweeks.__space_branch_main( espaco_id )) stored;


update tweeks.espaco
  set espaco_nivel = default
  where true;

update tweeks.espaco
  set espaco_branch = default
  where true;


update tweeks.conta
set conta_espaco_branch = default
where true;

update tweeks.deposito
set deposito_espaco_branch = default
where true;

