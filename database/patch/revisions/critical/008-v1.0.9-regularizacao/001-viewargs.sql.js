"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "viewargs-corre", flags: ["@unique"] }).sql `
drop function if exists tweeks.sets_viewargs( jsonb );
create or replace function tweeks.viewargs_sets( jsonb )
returns table ( param text, value jsonb, text text )
language plpgsql as $$
  declare
    _record record;
    _keys jsonb;
  begin

    _keys := coalesce( current_setting( 'viewargs.*', true )::jsonb, jsonb_build_array());
    select coalesce(jsonb_agg( k.param ), jsonb_build_array()) into _keys
      from jsonb_array_elements_text( _keys ) k( param)
      where k.param != all( array( select format('viewargs.%I',  e ) from jsonb_object_keys( $1) e))
    ;
    
    for _record in
      select *
        from jsonb_each( $1 )
    loop
      viewargs_sets.param := format('viewargs.%I', _record.key );
      viewargs_sets.text := _record.value;
      viewargs_sets.value := _record.value;
      _keys := _keys || to_jsonb( viewargs_sets.param );
      perform set_config( viewargs_sets.param, viewargs_sets.text, false );
      return next;
    end loop;

    viewargs_sets.param := 'viewargs.*';
    viewargs_sets.text := to_jsonb( _keys );
    viewargs_sets.value := to_jsonb( _keys );
    perform set_config( viewargs_sets.param, viewargs_sets.text, false );
    return next;
  end;
$$;

create or replace function tweeks.viewargs_set( key text, element anyelement )
returns table ( param text, value jsonb, text text )
language sql as $$
  select *
    from tweeks.viewargs_sets( jsonb_build_object( key, element ));
$$;

drop function if exists tweeks.viewarg( argname text );
create or replace function tweeks.viewarg( argname text )
returns text
immutable
strict
parallel safe
language sql as $$
  select jsonb_build_object( 'value', current_setting( format( 'viewargs.%I', argname ), true)::jsonb )->>'value'
$$;

drop function if exists tweeks.viewargs_show();
create or replace function tweeks.viewargs_show(out param text, out key text, out value jsonb, out text text )
returns setof record
immutable
parallel safe
language sql as $$
  select
      e.param,
      substr(e.param, length('viewargs.*'), length( e.param )),
      current_setting( e.param, true )::jsonb,
      jsonb_build_object( 'value', current_setting( e.param, true )::jsonb )->>'value'
    from jsonb_array_elements_text( current_setting( 'viewargs.*', true )::jsonb ) e( param)
$$;

drop function if exists tweeks.viewargs_object();
create or replace function tweeks.viewargs_object()
returns jsonb
immutable
parallel safe
language sql as $$
  select
      jsonb_object_agg(
        substr(e.param, length('viewargs.*'), length( e.param )),
        current_setting( e.param, true )::jsonb
      )
    from jsonb_array_elements_text( current_setting( 'viewargs.*', true )::jsonb )  e( param)
$$;
`;
//# sourceMappingURL=001-viewargs.sql.js.map