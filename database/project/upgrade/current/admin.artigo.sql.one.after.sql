alter table tweeks.classe alter classe_codigo drop default;
alter table tweeks.classe alter classe_codigo drop not null;

update tweeks.classe set classe_codigo = '000000' where classe_id = lib.to_uuid( 1 );
update tweeks.classe set classe_codigo = null where classe_id != lib.to_uuid( 1 );