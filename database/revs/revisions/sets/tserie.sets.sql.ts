import fs from "fs";
import Path from "path";
import JSON5 from "json5";
import {VERSION} from "../../../../server/version";
import {sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";

/*language=file-reference*/
let content = fs.readFileSync( Path.join( __dirname, "tserie.sets.json" ) ).toString();
let __tserie = JSON5.parse( content );

export const sets_series_update = {
    [VERSION.TAG] : sql`
do $$ 
declare
  _content jsonb default ${ SQL.jsonb( __tserie ) };
  _next record;
  _tserie tweeks.tserie;
begin
  for _next in  
    select e.doc
      from jsonb_array_elements( _content ) e( doc )
  loop 
    _tserie := jsonb_populate_record( _tserie, _next.doc );
    perform lib.sets( _tserie );
  end loop;
end;
$$
`
}