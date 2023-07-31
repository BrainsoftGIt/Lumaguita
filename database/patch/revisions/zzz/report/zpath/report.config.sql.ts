import {block} from "../../../../core/updater";

block( module, { identifier: "report-configs-v1.1", flags: []}).sql`
create or replace function report.vcolumns(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    args: {
      "source":"REPORT_SOURCE"
    },
   */
  _src character varying default args->>'source';
  _source record;
begin
  select * into _source
  from report.source_map( _src );

  -- COLUMNS
  return query
    select
      jsonb_build_object(
          'key', format( 'column|%s.%s', _src, rc.name ),
          'column', rc.name,
          'name', coalesce( rc.rename, rc.name ),
          'type', 'column',
          'format', rc.format,
          'init', rc.init
        )
    from report.vcolumn rc
    where rc.source = _source.source_format
      and rc.show
    order by rc.position desc
      nulls last,
             coalesce( rc.rename, rc.name )
  ;

  -- FILTER
  return query
    with __filters as (
      select rc.*, f.ordinality, report.__template_of( f.doc, to_jsonb( rc ) || to_jsonb( _source ) || to_jsonb( r ) ) as doc
      from report.vcolumn rc
             inner join report.report r on rc.source = r.report_source
             inner join jsonb_array_elements( rc.filter ) with ordinality f( doc ) on true
      where rc.source = _source.source_format
        and jsonb_array_length( rc.filter ) > 0
    ) select f.doc || jsonb_build_object(
        'key', format( 'filter|%s.%s::#%s', _src, f.name, f.ordinality ),
        'opr', f.doc->'opr',
        'column', f.name,
        'name', f.doc->'name',
        'mode', f.doc->'mode',
        'source', f.doc->'source',
        'src', f.doc->'src',
        'format', f.doc->'format',
        'type', 'filter'
      ) from __filters  f
    order by
      coalesce( ( f.doc->>'position')::int2, f.position ) desc
      nulls last,
      coalesce( f.doc->>'name', f.name )
  ;

  -- GROUP
  return query
    with __filters as (
      select rc.*,
             agg.function as agg_function,
             agg.label as agg_label,
             agg.key as agg_key,
             agg.priority as agg_priority,
             lib.str_normalize( format( agg.name, rc.name ) ) as agg_name,
             agg.format as agg_format,
             lib.str_normalize( format( agg.rename, rc.name ) ) as agg_rename,
             agg.simple as agg_simple,
             agg.expression as agg_expresion,
             agg.over as agg_over,
             agg.types as agg_types,
             format( '%I', rc.name ) as agg_usecolumn,
             lib.str_normalize( format( agg.rename, rc.name ) ) as agg_userename
      from report.vcolumn rc
             inner join report.report r on rc.source = r.report_source
             inner join report.agg agg on rc.format = any( agg.types )

      where rc.source = _source.source_format
        and rc.show
    ) select jsonb_build_object(
                 'key', format( 'aggregation|%s.%s::#%s', _src, f.name, f.agg_key ),
                 'column', f.name,
                 'name',  f.agg_name,
                 'func', f.agg_function,  -- f.doc -> 'func',
                 'format', coalesce( f.agg_format, f.format ), -- f.doc -> 'format',
                 'rename', f.agg_rename,
                 'type', 'group',
                 'label', f.agg_label,
                 'init', false,
                 'simple', format( f.agg_simple,  f.agg_usecolumn ),
                 'expression', format( f.agg_expresion, f.agg_usecolumn, f.agg_rename ),
                 'priority', f.agg_priority,
                 'column_position', f.position,
                 'over', format( f.agg_over, f.agg_usecolumn, format( '\\\\:%s:#ROW_NUMBER', f.name  ) )
               ) from __filters  f
    order by
      f.position desc nulls last,
      f.name,
      f.agg_priority nulls last;

  -- INDEPENDENT AGGREGATION
  return query
    with __vcolumn as (
      select
        rc.*,
        agg.function,
        agg.label,
        agg.key,
        agg.priority,
        agg.simple,
        agg.expression,
        agg.over,
        agg.types,
        agg.format _agg_format,
        lib.str_normalize( format( agg.name, rc.name ) ) as _agg_name,
        lib.str_normalize( format( agg.rename, rc.name ) ) as _agg_rename

        from report.vcolumn rc
          inner join report.report r on rc.source = r.report_source
          inner join report.agg agg on rc.format = any( agg.types )



    ),  __filters as (
      select rc.*,
             rc.function as agg_function,
             rc.label as agg_label,
             rc.key as agg_key,
             rc.priority as agg_priority,
             coalesce( e.doc->>'name', rc._agg_name ) as agg_name,
             coalesce( e.doc->>'format', rc._agg_format, rc.format ) as agg_format,
             coalesce( e.doc->>'rename', rc._agg_rename, e.doc->>'name', rc._agg_name ) as agg_rename,
             rc.simple as agg_simple,
             rc.expression as agg_expresion,
             rc.over as agg_over,
             rc.types as agg_types,
             format( '%I', rc.name )  as agg_usecolumn,
             format( '%I', coalesce( e.doc->>'rename', rc._agg_rename, e.doc->>'name', rc._agg_name, rc.name ) ) as agg_userename
      from __vcolumn rc
             inner join jsonb_array_elements( rc.agg ) with ordinality e( doc ) on true
               and ( e.doc->>'func' ) = rc.key
      where rc.source = _source.source_format
        and jsonb_array_length( rc.agg ) > 0
    ) select jsonb_build_object(
                 'key', format( 'aggregation|%s.%s::#%s', _src, f.name, f.agg_key ),
                 'column', f.name,
                 'name',  f.agg_name,
                 'func', f.agg_function,
                 'format', agg_format,
                 'rename', f.agg_rename,
                 'type', 'group',
                 'label', f.agg_label,
                 'init', false,
                 'simple', format( f.agg_simple,  f.agg_usecolumn ),
                 'expression', format( f.agg_expresion, f.agg_usecolumn, f.agg_rename ),
                 'priority', f.agg_priority,
                 'column_position', f.position,
                 'over', format( f.agg_over, f.agg_usecolumn, format( '\\\\:%s:#ROW_NUMBER', f.name  ) )
               ) from __filters  f
    order by
      f.position desc nulls last,
      f.name,
      f.agg_priority nulls last;
end
$$;

create or replace function report.configs(args jsonb) returns SETOF jsonb
  language sql
as
$$
with __report as (
      select
        r.*,
        jsonb_agg( conf.doc  ) as configs
      from report.report r
        inner join report.vcolumns( jsonb_build_object('source', r.report_source ) ) conf ( doc ) on true
      where r.report_active
      group by r.report_source
    ) select to_jsonb( _r )
        from __report _r
        order by _r.report_priority desc nulls last,
          _r.report_name nulls last
$$;
`;
