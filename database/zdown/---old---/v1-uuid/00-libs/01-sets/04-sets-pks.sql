drop function lib.sets_pks( regclass );
create or replace function lib.sets_pks( regclass )
returns table( column_name name, column_type regtype )
strict
immutable
language sql as $$
  select
      pg_attribute.attname,
      format_type(pg_attribute.atttypid, pg_attribute.atttypmod)::regtype
    from pg_index, pg_class, pg_attribute, pg_namespace
    where pg_class.oid = $1
      and indrelid = pg_class.oid
      and pg_class.relnamespace = pg_namespace.oid
      and pg_attribute.attrelid = pg_class.oid
      and pg_attribute.attnum = any( pg_index.indkey )
      and indisprimary
$$;


create or replace function lib.sets_pks_array( regclass )
returns name[]
strict
immutable
language sql as $$
  select array(
    select
        pg_attribute.attname
      from pg_index, pg_class, pg_attribute, pg_namespace
      where pg_class.oid = $1
        and indrelid = pg_class.oid
        and pg_class.relnamespace = pg_namespace.oid
        and pg_attribute.attrelid = pg_class.oid
        and pg_attribute.attnum = any( pg_index.indkey )
        and indisprimary
  )
$$;
