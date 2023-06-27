
create or replace function lib.represent( number int8, base text default '', length int default 0, lpad char default '' )
returns text
returns null on null input
immutable
language plpgsql as
$$
declare

  _base_chars char[] default case
    when base is null or base = '' then '{0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}'::char[]
    else regexp_split_to_array( base, '' )::char[]
  end;
  _base_length int default array_length( _base_chars, 1 );

  result int8;
  rest int8;
  _rest_char char;
  _code text default '';

begin
  if _base_length < 2 then return null; end if;
  if number is null then return null; end if;
  if number < 0 then return null; end if;

  if exists(
    select c
      from unnest( _base_chars ) c
      group by c
      having count( c ) > 1
  ) then raise exception 'Invalid base representation'; end if;

  result := number;

  while result > 0 loop
    rest := result%_base_length;
    result := result/_base_length;
    _rest_char := _base_chars[ rest+1 ];
    _code := format( '%s%s', _rest_char, _code );
  end loop;

  if( length( _code ) < 1 and number >= 0 ) then _code := _base_chars[ 1 ]; end if;
  if lpad is not null and length is not null and length > length( _code ) then
    _code := lpad( _code, length, lpad );
  end if;

  return  _code;
end
$$;


with recursive
  __values ( number, base ) as ( values ( 5445645, 16 ) ),
  __calc( number, rest, "order" ) as (
    select v.number/base, v.number%v.base, 0
      from __values v
  union all
  select
      c.number/ v.base,
      c.number% v.base,
      c.order+1
  from __calc c
    inner join __values v on true
  where c.number > 0
) select
    string_agg( rest::text, '' order by "order" desc )
  from __calc;
