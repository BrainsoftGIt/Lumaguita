
drop function lib.eval(expression text, return anyelement);
create or replace function lib.eval( expression text )
returns text
language plpgsql as $$
declare
  result text;
begin
   execute( format( 'select (%s)::text', expression ) ) into result;
   return result;
end
$$;

drop function if exists lib.sets_defaults(regclass);
select lib.sets_defaults( 'tweeks.nextable'::regclass );

create or replace function lib.sets_defaults( regclass, replacer jsonb default null )
returns jsonb
language plpgsql as $$
declare
  _doc jsonb;
begin
  select jsonb_object_agg(
      col.column_name,
      lib.eval( col.column_default::text )
    ) into _doc
  from information_schema.columns col
           inner join pg_class c on c.relname = col.table_name
      and col.table_schema::regnamespace = c.relnamespace
  where col.column_default is not null
    and c.oid = $1;

  if replacer is not null then
    _doc := _doc || replacer;
  end if;
  return _doc;
end;
$$;


drop function if exists lib.sets_defaults(anyelement, replacer jsonb );

create or replace function lib.sets_defaults( anyelement, replacer jsonb default null )
returns anyelement language plpgsql  as $$
declare
  _doc jsonb;
begin
  _doc := (
      select coalesce( jsonb_object_agg(e.key, e.value ), jsonb_build_object())
      from jsonb_each( to_jsonb($1) )e
      where jsonb_typeof( e.value ) != 'null'
  );
  _doc := _doc || coalesce( $2, '{}' );

  return jsonb_populate_record( $1, lib.sets_defaults( pg_typeof( $1 )::text::regclass, _doc) );
end
$$;

