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

block( module, { identifier: "parametrized-reports-structure", flags:["@unique"]}).sql`
    with ___menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) as (
        VALUES (115, null, 'maguita.nota.credito', '', 0, e'<?xml version="1.0" encoding="iso-8859-1"?>
    <!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 100.25 100.25" style="enable-background:new 0 0 100.25 100.25;" xml:space="preserve">
    <path d="M79.567,29.924l-18.26-18.479C61.025,11.16,60.641,11,60.24,11H20.5c-0.828,0-1.5,0.672-1.5,1.5v75
    c0,0.828,0.672,1.5,1.5,1.5h58c0.828,0,1.5-0.672,1.5-1.5V30.979C80,30.585,79.845,30.206,79.567,29.924z M62,16.415L74.929,29.5H62
    V16.415z M22,86V14h37v17c0,0.828,0.672,1.5,1.5,1.5H77V86H22z"/>
    </svg>', 'Nota Credito', '../includes/notaCredito.html', 1, 0, 0, 0, 3)
    ) select lib.sets( jsonb_populate_record( null::auth.menu, to_jsonb( m ) ) )
    from ___menu m ;

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
        parametrized_espaco_destino character varying[] not null,
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
        filter_value character varying default null,
        filter_valuemode int not null default libdom.get( 'report_filter_filter_valuemode_raw' )::int2,
        filter_increment character varying default null,
        filter_espaco_destino character varying[] not null,
        filter_state int2 not null default libdom.get( 'report_filter_state_active' )::int2,
        filter_date timestamptz not null default clock_timestamp(),
        filter_update timestamptz,
        filter_user_id character varying not null,
        filter_user_update character varying default null,
        filter_espaco_auth character varying not null,
        _branch_uid  character varying not null
    );


    select libdom.entry( 'report_filter_state_active', 'int2', 1, 'report.parametrized.parametrized_state', 'Ativo');
    select libdom.entry( 'report_filter_state_fechado', 'int2', 0, 'report.parametrized.parametrized_state', 'Fechado');
    select libdom.entry( 'report_filter_state_active', 'int2', 1, 'report.filter.filter_state', 'Ativo');
    select libdom.entry( 'report_filter_state_fechado', 'int2', 0, 'report.filter.filter_state', 'Fechado');
    select libdom.entry( 'report_filter_filter_valuemode_raw', 'int2', 1) ;
    select libdom.entry( 'report_filter_filter_valuemode_eval', 'int2', 2 );
    select libdom.domset('report.parametrized', 'parametrized_state', 'report.parametrized.parametrized_state' );
    select libdom.domset('report.filter', 'filter_state', 'report.filter.filter_state' );
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
        parametrized_espaco_destino character varying[] not null,

        filters:[{
          filter_uid uuid not null primary key default gen_random_uuid(),
          filter_name character varying not null,
          filter_props jsonb not null default jsonb_build_object(),
          filter_require boolean not null default false,
          filter_column character varying not null,
          filter_type character varying not null,
          filter_opr character varying not null,
          filter_mode character varying not null,
          filter_value character varying default null,
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

    if _parametrized.parametrized_uid is null then
      _parametrized.parametrized_user_id := _user_id;
      _parametrized._branch_uid := _branch;
      _parametrized.parametrized_espaco_auth := _espaco_auth;
    else
      _parametrized.parametrized_user_update := _user_id;
      _parametrized.parametrized_update := clock_timestamp();
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

      select ("returning").* into _filter
        from lib.sets( _filter )
      ;
      return next to_jsonb( _filter )
          ||jsonb_build_object( 'type', 'filter');
    end loop;
  end
$$;
`;


