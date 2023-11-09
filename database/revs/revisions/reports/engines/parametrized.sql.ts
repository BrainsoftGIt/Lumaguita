import {sql} from "kitres";

export const funcLoadReportParametrized = sql`
create or replace function tweeks.funct_load_report_parametrized(args jsonb) returns SETOF jsonb
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
      order by p.parametrized_name
    )  select to_jsonb( _pr )
          from __parametrized_report _pr;
end;
$$;
`;

export const funct_load_report_parametrized_filter = sql`
create or replace function funct_load_report_parametrized_filter(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**doc
    args := {
      _branch:text
      _user_id: text
      _workspace: text
      _parametrized_uid
    }
   doc*/
  _branch text default args->>'_branch';
  _user_id text default args->>'_user_id';
  _workspace text default args->>'_workspace';
  _parametrized_uid uuid default args->>'_parametrized_uid';

  _filter record;
  _const libdom.constant;
  _is_date boolean;
  _is_timestamp boolean;
  _use_value text;
begin
  _const := libdom.constant();
  for _filter in 
    select *
      from report.filter f
      where f._branch_uid = _branch
        and f.filter_parametrized_uid = _parametrized_uid
  loop
    _use_value := null;
      _is_date := _filter.filter_type::regtype in (
        'date'::regtype
      );
    
      _is_timestamp := _filter.filter_type::regtype in (
        'timestamp'::regtype,
        'timestamptz'::regtype
      );
      
      if (_is_date or _is_timestamp) and  _filter.filter_valuemode = _const.report_filter_filter_valuemode_daterelative  then
        _use_value := now() - (_filter.filter_increment)::interval;
      elsif ( _is_date or _is_timestamp ) and _filter.filter_valuemode = _const.report_filter_filter_valuemode_dateprocess then
        _use_value := now();
      elsif _filter.filter_valuemode = _const.report_filter_filter_valuemode_samevalue then 
        _use_value := _filter.filter_basevalue;
      end if;
    
      if _use_value is not null and _is_date then 
          _use_value := _use_value::date;
      end if;
    
      return next to_jsonb( _filter )|| jsonb_build_object(
        'filter_value', _use_value
      );
    
  end loop;
end;
$$;
`;

