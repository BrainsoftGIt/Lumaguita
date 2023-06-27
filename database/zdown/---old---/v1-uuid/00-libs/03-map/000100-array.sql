drop function map.any(anyelement, name name[]);


create or replace function map.array( anyelement, variadic name name[] )
returns anyarray
language plpgsql as $$
declare
begin
  return array(
    select kv.constvalue_value
      from map.constvalue kv
      where kv.constvalue_name = any( $2 )
  );
end
$$;

create or replace function map.any_equal(anyelement, variadic name name[] )
returns boolean
language sql as $$
select $1 = any( map.array( $1, variadic $2 ) );
$$;