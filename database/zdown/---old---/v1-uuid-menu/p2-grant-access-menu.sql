delete from auth.acesso where true;
with __users_with_all_access as (
    select c.colaborador_id
      from auth.colaborador c
      where  c.colaborador_email in (
        'support@brainsoft.st',
        'master@admin',
        'juliarocha@hotmail.com'
      )
), ___grants as (
    select m.menu_id, us.colaborador_id, lib.to_uuid( 1 )
      from __users_with_all_access us
        inner join auth.menu m on true
) insert into auth.acesso (
  acesso_menu_id,
  acesso_colaborador_propetario,
  acesso_colaborador_id
) select *
   from ___grants;
;