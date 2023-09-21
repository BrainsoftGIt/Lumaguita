import {block} from "../../../core/updater";

block( module, { identifier: "parametized-reports-lidom", flags:[]}).sql`
create or replace function libdom.domset(_class character varying, _column character varying, _domain character varying, _comment character varying DEFAULT NULL::character varying) returns boolean
  language plpgsql
as
$$
declare
  /**doc

   doc*/
  _data record;
begin
    update libdom.domsync
      set domain = _domain,
          comment = _comment
    where classname = _class
      and columnname = _column
    returning * into _data
  ;

  if _data.classname is null then
    insert into libdom.domsync(
      classname,
      columnname,
      domain,
      comment
    ) values (
      _class,
      _column,
      _domain,
      _comment
    );
  end if;
  return true;
end;
$$;
`;

block( module, { identifier: "parametrized-reports-structure-force-02", flags:["@unique"]}).sql`
    create schema if not exists report;

    drop table if exists report.filter;
    drop table if exists report.parametrized;
    create table if not exists report.parametrized(
        parametrized_uid uuid primary key not null default gen_random_uuid(),
        parametrized_name character varying not null,
        parametrized_source character varying not null,
        parametrized_columns jsonb not null default jsonb_build_array(),
        parametrized_groups jsonb not null default jsonb_build_array(),
        parametrized_props jsonb not null default jsonb_build_object(),
        parametrized_grants character varying[] not null,
        parametrized_state int2 not null default libdom.get( 'report_filter_state_active' )::int2,
        parametrized_date timestamptz not null default clock_timestamp(),
        parametrized_update timestamptz,
        parametrized_user_id character varying not null,
        parametrized_espaco_auth character varying not null,
        parametrized_user_update character varying default null,
        _branch_uid  character varying not null
    );
    
    create table if not exists report.filter(
        filter_uid uuid not null primary key default gen_random_uuid(),
        filter_parametrized_uid uuid not null references report.parametrized,
        filter_name character varying not null,
        filter_props jsonb not null default jsonb_build_object(),
        filter_require boolean not null default false,
        filter_column character varying not null,
        filter_type character varying not null,
        filter_opr character varying not null,
        filter_mode character varying not null,
        filter_basevalue character varying default null,
        filter_valuemode int not null default libdom.get( 'report_filter_filter_valuemode_raw' )::int2,
        filter_increment character varying default null,
        filter_grants character varying[] not null,
        filter_state int2 not null default libdom.get( 'report_filter_state_active' )::int2,
        filter_date timestamptz not null default clock_timestamp(),
        filter_update timestamptz,
        filter_user_id character varying not null,
        filter_user_update character varying default null,
        filter_espaco_auth character varying not null,
        _branch_uid  character varying not null
    );
`;

block( module, { identifier: "parametrized-reports-structure-drop-mode", flags:["@unique"]}).sql`
alter table report.filter drop column if exists filter_mode;
`;

block( module, { identifier: "parametrized-reports-domains-001"}).sql`

    select libdom.entry( 'report_filter_state_active', 'int2', 1, 'report.parametrized.parametrized_state', 'Ativo');
    select libdom.entry( 'report_filter_state_fechado', 'int2', 0, 'report.parametrized.parametrized_state', 'Fechado');
    select libdom.entry( 'report_filter_state_active', 'int2', 1, 'report.filter.filter_state', 'Ativo');
    select libdom.entry( 'report_filter_state_fechado', 'int2', 0, 'report.filter.filter_state', 'Fechado');

    select libdom.domset('report.parametrized', 'parametrized_state', 'report.parametrized.parametrized_state' );
    select libdom.domset('report.filter', 'filter_state', 'report.filter.filter_state' );

    select libdom.entry_drop('report_filter_filter_valuemode_raw', true );
    select libdom.entry_drop('report_filter_filter_valuemode_eval', true );

    select libdom.entry( 'report_filter_filter_valuemode_samevalue', 'int2', 1, 'report.filter.filter_valuemode', 'Mesmo valor');
    select libdom.entry( 'report_filter_filter_valuemode_dateprocess', 'int2', 2, 'report.filter.filter_valuemode', 'Data do processamento');
    select libdom.entry( 'report_filter_filter_valuemode_daterelative', 'int2', 3, 'report.filter.filter_valuemode', 'Relativo a data atual');
    select libdom.entry( 'report_filter_filter_valuemode_ask', 'int2', 4, 'report.filter.filter_valuemode', 'Pedir');
    select libdom.entry( 'report_filter_filter_valuemode_askallways', 'int2', 5, 'report.filter.filter_valuemode', 'Pedir sempre');
`;


block( module, { identifier: "parametrized-reports-functions"}).sql`
create or replace function report.sets_parametrized_report(
  args jsonb
) returns setof jsonb
language plpgsql as $$
  declare
    /**doc
      args := {
        _user_id character varying not null,
        _espaco_auth character varying not null,
        _branch  character varying not null

        parametrized_uid uuid primary key not null default gen_random_uuid(),
        parametrized_name character varying not null,
        parametrized_source character varying not null,
        parametrized_columns jsonb not null default jsonb_build_array(),
        parametrized_groups jsonb not null default jsonb_build_array(),
        parametrized_props jsonb not null default jsonb_build_object(),
        parametrized_grants character varying[] not null,

        filters:[{
          filter_uid uuid not null primary key default gen_random_uuid(),
          filter_name character varying not null,
          filter_props jsonb not null default jsonb_build_object(),
          filter_require boolean not null default false,
          filter_column character varying not null,
          filter_type character varying not null,
          filter_opr character varying not null,
          filter_basevalue character varying default null,
          filter_valuemode int not null default libdom.get( 'report_filter_filter_valuemode_raw' )::int2,
          filter_increment character varying default null,
          filter_espaco_destino character varying[] not null
        }]
      }
     doc*/
    _filters_id uuid[] default array( select (e.doc->>'filter_uid')::uuid from jsonb_array_elements( args->'filters' ) e( doc ));
    _parametrized report.parametrized;
    _user_id character varying default args->>'_user_id';
    _branch character varying default args->>'_branch';
    _espaco_auth character varying default args->>'_espaco_auth';
    _const libdom.constant;
    _filter report.filter;
  begin
    _parametrized := jsonb_populate_record( _parametrized, args );
    _const := libdom.constant();
    
    -- Garantir que o nome do retatorio não se duplique
    if _parametrized.parametrized_uid is null and exists(
      select *
        from report.parametrized 
        where trim( lower( parametrized_name ) ) = lower( trim( _parametrized.parametrized_name ) )
          and _branch_uid = _branch
    ) then 
      return next jsonb_build_object(
        'result', false,
        'message', 'Já existe uma relatorio parametizado com o nome'
      );
      return;
    end if;
    
    if _parametrized.parametrized_uid is null then
      _parametrized.parametrized_user_id := _user_id;
      _parametrized._branch_uid := _branch;
      _parametrized.parametrized_espaco_auth := _espaco_auth;
    else
      _parametrized.parametrized_user_update := _user_id;
      _parametrized.parametrized_update := clock_timestamp();
    end if;
    
    if _user_id != all( _parametrized.parametrized_grants ) then 
        _parametrized.parametrized_grants := _parametrized.parametrized_grants || _user_id;
    end if;
    if _espaco_auth != all( _parametrized.parametrized_grants ) then 
        _parametrized.parametrized_grants := _parametrized.parametrized_grants || _espaco_auth;
    end if;

    select ( "returning" ).* into _parametrized
      from lib.sets( _parametrized )
    ;

    return next jsonb_build_object(
      'result', true
    )||jsonb_build_object( 'type', 'result');

    return next to_jsonb( _parametrized )
      ||jsonb_build_object( 'type', 'report.parametrized');


    update report.filter
      set filter_state = _const.report_filter_state_active,
          filter_update  = clock_timestamp()
      where filter_parametrized_uid = _parametrized.parametrized_uid
        and filter_state = _const.report_filter_state_active
        and filter_uid != all ( _filters_id )
    ;


    for _filter in
      select f.*
        from jsonb_array_elements( args->'filters' ) e( doc )
          inner join jsonb_populate_record( null::report.filter, e.doc ) f on true
    loop
      if _filter.filter_uid is null then
        _filter.filter_user_id := _user_id;
        _filter._branch_uid := _branch;
        _filter.filter_espaco_auth := _user_id;
        _filter.filter_parametrized_uid := _parametrized.parametrized_uid;
      else
        _filter.filter_user_update := _user_id;
        _filter.filter_update := clock_timestamp();
      end if;

      if _user_id != all( _filter.filter_grants ) then
          _filter.filter_grants := _filter.filter_grants || _user_id;
      end if;
      if _espaco_auth != all( _filter.filter_grants ) then
          _filter.filter_grants := _filter.filter_grants || _espaco_auth;
      end if;
      
      if _filter.filter_type::regtype in ( 
        'date'::regtype,
        'timestamp'::regtype,
        'timestamptz'::regtype
      ) and _filter.filter_valuemode = _const.report_filter_filter_valuemode_daterelative then
        _filter.filter_increment := clock_timestamp() - ( _filter.filter_basevalue::timestamptz );
      end if;
      
      select ("returning").* into _filter
        from lib.sets( _filter )
      ;
      return next to_jsonb( _filter )
          ||jsonb_build_object( 'type', 'filter');
    end loop;
    
  end
$$;


create or replace function report.funct_load_report_parametrized( args jsonb )
returns setof jsonb
language plpgsql as $$
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


create or replace function report.funct_load_report_parametrized_filter( args jsonb )
returns setof jsonb
language plpgsql as $$
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
        _use_value := _filter.filter_basevalue::timestamptz + (_filter.filter_increment)::interval;
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
$$
`;


