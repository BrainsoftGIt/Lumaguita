drop type lib.res cascade ;
create type lib.res as(
  result boolean,
  message text,
  data jsonb,
  error jsonb,
  level int
);

create or replace function lib.res(
  result boolean,
  message text,
  data jsonb,
  error jsonb,
  level int default 0
) returns lib.res
immutable
language sql
as' select row ($1, $2, $3, $4, $5)'
;

create or replace function lib.res_true(
  data jsonb default '{}'::jsonb,
  message text default 'success',
  level int default 1
) returns lib.res
language sql as 'select lib.res( true, $2, $1, null, level )'
immutable;

create or replace function lib.res_false(
  message text default 'error',
  error jsonb default '{}'::jsonb,
  level int default 0
) returns lib.res
language sql as 'select lib.res( false, $1, null, $2, level )'
immutable;


create or replace function lib.res_exception( errocode character varying DEFAULT NULL::character varying, message text DEFAULT NULL::text, hint text DEFAULT NULL::text, detail text DEFAULT NULL::text, context text DEFAULT NULL::text, user_message text default null, level int default -1 )
returns lib.res
language plpgsql as $$
declare
  /** Essa função serve para criar uma instancia exception*/
  _ex lib.exception;
  _res lib.res;
begin
  _ex.errcode :=  errocode;
  _ex.message := coalesce( user_message, message );
  _ex.hint := hint;
  _ex.detail := detail;
  _ex.context := context;
  _ex.exception := true;

  _res.result := false;
  _res.message := message;
  _res.error := to_jsonb( _ex );
  _res.level := level;
  return _res;
end;
$$;
