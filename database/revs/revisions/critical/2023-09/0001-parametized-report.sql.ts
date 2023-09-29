import {sql} from "kitres";

export const functLoadReportParametrized = sql`
create or replace function report.funct_load_report_parametrized(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**doc
    args := {
      _branch:text
      _user_id: text
      _workspace: text,
      _grants: text
    }
   doc*/
    _branch text default args->>'_branch';
    _user_id text default args->>'_user_id';
    _workspace text default args->>'_workspace';
    _grants text default args->>'_grants';
begin
  return query 
    with __parametrized_report as (
      select *
        from report.parametrized p
        where p._branch_uid = _branch
          and _workspace = any ( p.parametrized_grants )
          and ( _grants is null or _grants = any ( p.parametrized_grants ) )  
    )  select to_jsonb( _pr )
          from __parametrized_report _pr;
end;
$$;
`;