import {VERSION} from "../../../../../server/version";
import {sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";
import fs from "fs";
import JSON5 from "json5";
import Path from "path";

const document = fs.readFileSync( Path.join(__dirname, "./units.base.json5" ) ).toString();
let _unit = JSON5.parse( document );


//Definir o identificado base da unidade para o branch
export const __units_base_identifier = sql`
  alter table tweeks.unit add column if not exists unit_base uuid default gen_random_uuid();
`;

export const tweeks___sync_unit = sql`
create or replace function tweeks.__sets_defaults_units( ___branch uuid )
returns setof jsonb
language plpgsql as $$ 
  declare
    document jsonb default ${ SQL.jsonb( document )};
    _unit tweeks.unit;
    _next record;
    _data record;
  begin
    select *
      from cluster.branch b 
      where b._branch_uid = ___branch
      into  _data
    ;
    
    for _next in
      with __unit as (
        select
          (u.doc->>'unit_base')::uuid as unit_base,
          u.doc->>'unit_code' as unit_code,
          u.doc->>'unit_name' as unit_name
        from jsonb_array_elements( document ) u( doc )
      ) select _u.*
        from __unit _u
          left join tweeks.unit u on u.unit_base = _u.unit_base
            and u._branch_uid = _data._branch_uid
        where u.unit_id is null
    loop
      _unit := jsonb_populate_record( _unit, to_jsonb( _next ));
      _unit._branch_uid := _data._branch_uid;
      _unit.unit_user_id := _data.branch_main_user;
      _unit.unit_espaco_auth := _data.branch_main_workspace;
      return query 
        select to_jsonb( "returning"::tweeks.unit )
          from  lib.sets( _unit );
    end loop;
  end;
$$
`;


export const setsUnits = {
    [VERSION.TAG]:sql`
do 
$$
  declare
    _data record;
  begin
      for _data in
        select 
            b.*
          from cluster.branch b
      loop
          perform tweeks.__sets_defaults_units( _data._branch_uid );
      end loop;
  end;
$$`
}
;
