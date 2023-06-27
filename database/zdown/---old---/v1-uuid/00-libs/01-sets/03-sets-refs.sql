drop function if exists lib.sets_ref(regclass,jsonb);

create or replace function lib.sets_ref( "table" regclass, document jsonb )
returns jsonb
strict
immutable
language sql as $$
  select jsonb_object_agg( column_name, $2->column_name )
  from lib.sets_pks( $1 );
$$;

create or replace function lib.sets_ref( _record anyelement )
  returns jsonb
  strict
  immutable
  language sql as $$
select jsonb_object_agg( column_name, to_jsonb( $1 )->column_name )
from lib.sets_pks( pg_typeof( $1 )::text::regclass );
$$;

create or replace function lib.sets_ref( jsonb, name[] )
  returns jsonb
  strict
  immutable
  language sql as $$
  select jsonb_object_agg( r.name, to_jsonb( $1 )->( r.name ) )
    from unnest( $2 ) r( name );
$$;



create or replace function lib.sets_ref_clean( "table" regclass, document jsonb )
returns jsonb
language plpgsql as $$
declare
  _data record;
begin
  with __doc_each as (
    select
        edoc.key,
        edoc.value,
        edoc.text,
        edoc.type
      from lib.each( document ) edoc
  )
  select
      jsonb_object_agg( pk.column_name , lib.eval( format('to_jsonb((%L)::%s)', e.text, pk.column_type ) )::jsonb ) as reference,
      count( * ) filter ( where e.value is null or e.type = 'null') as invalids
      into _data
    from lib.sets_pks( $1 ) pk
      left join __doc_each e on pk.column_name = e.key
  ;

  if _data.invalids = 0 then
    return _data.reference;
  end if;
  return null;
end;
$$;

drop function if exists lib.sets_ref( _record anyelement );




select lib.sets_ref( 'old_tweeks.venda', to_jsonb( v ) ) from old_tweeks.venda v;
select lib.sets_ref( v ) from old_tweeks.venda v;
