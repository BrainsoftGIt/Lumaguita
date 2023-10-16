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

export const funct_load_units = sql`
create or replace function tweeks.funct_load_unit(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**doc
      Carregar os documentos 
      args := {
        _espaco_auth
        _user_id
    }
    doc*/
    _espaco_auth uuid not null default args->>'_espaco_auth';
    _user_id uuid not null default args->>'_user_id';
    _branch uuid default tweeks.__branch_uid( _user_id, _espaco_auth );
begin
  perform tweeks.__sets_defaults_units( _branch );
  return query
    with _unit as (
      select *
        from tweeks.unit u
        where u._branch_uid = _branch
    ) select to_jsonb( _u ) from _unit _u;
end;
$$;
`;


export const resolve_units = sql`
do $$
declare
  document jsonb default ${ SQL.jsonb( document ) };
  _data record;
begin
  for _data in
    with __unit as (
      select
          (d.doc->>'unit_base')::uuid as unit_base,
          d.doc->>'unit_code' as unit_code,
          d.doc->>'unit_name' as unit_name
        from jsonb_array_elements( document ) d ( doc )
    ) select
          u.unit_id,
          u._branch_uid,
          _u.unit_base
        from tweeks.unit u
          inner join __unit _u on u.unit_code = _u.unit_code
            and u.unit_base is null
  loop
    update tweeks.unit u
      set unit_base = _data.unit_base
      where u.unit_id = _data.unit_id
    ;
  end loop;
end;
$$
`;