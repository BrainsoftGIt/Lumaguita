create or replace function tweeks.main(
  function regproc,
  args jsonb,
  mode text DEFAULT 'dev'::text
) returns SETOF jsonb
  language plpgsql
as
$$
declare
  MODE_PROD constant text default 'prod';
  MODE_TEST constant text default 'test';
  MODE_DEV constant text default 'dev';
  MODE_PUB constant text default 'public';
  _statement text;
begin

  --language=PostgreSQL
  _statement := format( $sql$
      select to_jsonb( t )
        from %s ( $1 ) t;
  $sql$, function );

  -- Mode DEV don't try-catch error
  if mode = MODE_DEV then
    return query execute _statement using args;


  -- Mode PROD and TEST try-catch error
  else
    begin
      return query execute _statement using args;

    exception when others then
      <<_ex>>
      declare
        e text; m text; d text; h text; c text;
        _catch lib.res;
      begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        _catch :=  lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c,
        case
          when mode in( MODE_PROD, MODE_PUB ) then format( 'Algo deu mal, tente novamente mais tarde ou proucure pelo suporte! Error Code: (%s)', _ex.e )
          when mode = MODE_TEST then _ex.m
          else _ex.m
          end
        );
        return next to_jsonb( _catch );
      end;
    end;
  end if;
end;
$$;
