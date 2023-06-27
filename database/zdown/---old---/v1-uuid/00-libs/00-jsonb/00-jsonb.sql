select *
  from lib.each('{"name":"Daniel", "surname":"Costa", "ids":[1, 3, "Name", { "counts":"293", "numbers":43 }]}');


create or replace function lib.format( jsonb ) returns text
immutable
returns null on null input
language sql as $$
  select case jsonb_typeof( $1 )
      when 'array' then $1::text
      when 'object' then $1::text
      else to_jsonb( $1 )::text
    end;
$$;

create or replace function lib.extract( jsonb ) returns text
immutable
returns null on null input
language sql as $body$
select case jsonb_typeof( $1 )
    when 'array' then $1::text
    when 'object' then $1::text
    else $1->>0
  end;
$body$;

select * from lib.each( '[1, 2, 3, "Ola Mudno"]');

drop function lib.each(jsonb, force boolean);
create or replace function lib.each( jsonb, force boolean default false )
returns table(
  name text,
  index int8,
  key text,
  value jsonb,
  text text,
  literal_text text,
  literal_json text,
  type text,
  source text
) language plpgsql
immutable
returns null on null input
as $$
declare
  _dd numeric;
begin
  each.source := jsonb_typeof( $1 );
  if each.source = 'object' then
    return query
      select
          e.key,
          null::int8,
          e.key,
          e.value,
          lib.extract( e.value ),
          format( '%L', case
            when jsonb_typeof( e.value ) = 'array' then array( select jsonb_array_elements_text( e.value) )::text
            else lib.extract( e.value )
          end) as literal_text,
          format( '%L', e.value::text ),
          jsonb_typeof( e.value ),
          each.source
        from jsonb_each( $1 )e( key, value );
  elseif each.source = 'array' then
    return query
      select
          e.index::text,
          e.index,
          null,
          e.value,
          lib.extract( e.value ),
          format( '%L', case
            when jsonb_typeof( e.value ) = 'array' then array( select jsonb_array_elements_text( e.value) )::text
            else lib.extract( e.value )
          end) as literal_text,
          format( '%L', e.value::text ) as literal_json,
          jsonb_typeof( e.value ),
          each.source
        from  jsonb_array_elements( $1 ) with ordinality e( value, index );
  elseif force then
    each.name := null;
    each.index := null;
    each.key := null;
    each.value := $1;
    each.text := lib.extract( $1 );
    each.literal_text := format( '%L', lib.extract( $1 ));
    each.literal_json := format( '%L', $1::text);
    each.type := jsonb_typeof( $1 );
    return next;
  else
    raise exception 'cannot call each on a non-object or a non-array';
  end if;
end;
$$;


