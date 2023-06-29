import {block} from "../../../core/updater";

block(module, { identifier: "iva-correcao-revison-manager", flags: ["@unique"]}).sql`
    alter table cluster.share add if not exists share_pksfrom character varying default null;
    

create or replace function cluster.__format(regclass) returns character varying
  stable
  strict
  language sql
as
$$
  with __source as (
    select schemaname, tablename
      from pg_tables 
    union all 
      select schemaname, viewname
        from pg_views
  )
    select format( '%I.%I', schemaname, tablename )
      from __source
      where format( '%s.%s', schemaname, tablename )::regclass = $1
$$;


create or replace function cluster.__tg_share_check() returns trigger
  language plpgsql
as
$$
declare
begin
  if( to_regclass( new.share_regclass ) is null ) then
    raise exception '% is not a table', new.share_regclass;
  end if;
  new.share_regclass := cluster.__format( new.share_regclass );
  new.share_pksfrom := cluster.__format( new.share_pksfrom );
  new.share_pks := lib.sets_pks_array( coalesce( new.share_pksfrom, new.share_regclass ) );
  return new;
end;
$$;

INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('cluster.branch', true, true);
delete from cluster.share where share_regclass::regclass = 'tweeks.branch'::regclass;
INSERT INTO cluster.share (share_regclass, share_insert, share_update, share_pksfrom) values ( 'tweeks.branch', true, true, 'cluster.branch' );
`;
