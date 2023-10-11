import {sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";
import {importsMenus} from "../../../exports/exports-menus";
import {VERSION} from "../../../../server/version";




export const menuPatch = {
    [VERSION.TAG] :sql`
do $block$
  declare
    _data record;
    _menu auth.menu;
  begin
    for _data in
      select *
        from jsonb_array_elements( ${SQL.jsonb( importsMenus() )}) d ( document )
    loop
      _menu := jsonb_populate_record( _menu, _data.document );
      perform lib.sets( _menu );
    end loop;
  end;
$block$;
`
}
