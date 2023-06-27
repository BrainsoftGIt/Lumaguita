create or replace function lib.when( boolean, _then anyelement, _else anyelement default null )
returns anyelement
strict
immutable
language sql as $$ select case when $1 then $2 else $3 end $$;