import {block} from "../../../../core/updater";

block( module, { identifier: "report:engine|prepare"}).sql `
drop function if exists report.__formattable();
create or replace function report.__formattable()
returns text[] immutable language sql as $$
  select array_agg( distinct te.name )
    from report.talias ta
      inner join unnest(( ta.alias|| ta.type) ) te( name ) on true
    where ( ta.alias|| ta.type) && array[ 'date', 'timestamp', 'timestamptz' ]::text[];
$$;


drop function if exists  report.__prepare_order( report jsonb );
create or replace function  report.__prepare_order( report jsonb,
  columns jsonb[],
  aggregates jsonb[]
)
returns table( counts int8, expression text, selected jsonb[] )
immutable
language plpgsql as $$
declare
  _orders record;
  _source record;
  _selected jsonb[];
  _formattable record;
begin
  select * into _source from report.source_map( (report->>'source' )::regclass );
  select * into _formattable from report.__formattable() f( types );

  with __orders as (
    select
      e.element,
      ( e.element->>'priority' )::int as priority,
      e.ordinality as ordinality
    from jsonb_array_elements( report->'orders' ) with ordinality e( element )
  ) select array_agg( e.element order by e.priority desc nulls last, e.ordinality ) as orders into _selected
      from __orders e
  ;

  if( coalesce( array_length( _selected, 1 ), 0 ) ) = 0 then
    with __columns as (
    select
        e.element->>'column' as "column",
        e.element->>'rename' as rename,
        e.element->>'type' as "type",
        e.ordinality,
        -- Prioridade igual a ordem reverva, quanto maoir for a ordem posicional menor a prioridade
        e.ordinality * -1 as priority
      from unnest( columns || aggregates ) with ordinality e ( element )
    ), __orders as (
      select
          case
            when cc.type = 'group' then cc.rename
            when cc.type = 'column' then cc.column
          end as "column",
          'asc' as "orientation",
          'last' as "nulls",
          cc.ordinality,
          cc.priority
        from __columns cc
        order by cc.ordinality
    ) select array_agg( to_jsonb( o ) order by o.priority desc nulls last, o.ordinality) as orders into _selected
        from __orders o
        where o."column" is not null
    ;
  end if;

  with __orders as (
    select
        case
          when ( sc."column"->>'mask' ) is not null and c.column_type = any( _formattable.types ) then format( '\\:%s', c.column_name )
          else c.column_name
        end as "column",
        (o."order"->>'priority')::int as "priority",
        coalesce( lib.str_normalize( o."order"->>'orientation' ), 'asc' ) as "orientation",
        coalesce( lib.str_normalize( o."order"->>'nulls' ), 'last' ) as "nulls",
        o.ordinality
      from report.columns( _source.source_class ) c
        inner join unnest( _selected ) with ordinality o( "order" ) on c.column_name = o."order"->>'column'
        inner join unnest( columns ) sc( "column" ) on o."order"->>'column' = sc."column"->>'column' and sc."column"->>'column' = c.column_name
  ) select
        string_agg( format( '%I %s nulls %s', o."column", o.orientation, o.nulls ), e',\n            '
          order by o.priority desc nulls last, o.ordinality
        ) as expression,
        count( * ) as counts
        into _orders
      from __orders o
      where o.orientation in ( 'asc', 'desc')
        and o.nulls in ( 'last', 'first' )
  ;

  __prepare_order.counts := _orders.counts;
  __prepare_order.expression := _orders.expression;
  __prepare_order.selected := _selected;
  return next;
end;
$$;

drop function if exists  report.__prepare_aggregate( report jsonb );
create or replace function report.__prepare_aggregate( report jsonb )
returns table(
  counts int8,
  expression text,
  selected jsonb[],
  exports_expression text,
  exports_rename text[]
)
immutable
language plpgsql as $$
declare
  _source record;
  _aggregate record;
  _selected jsonb[];
begin
  select * into _source from report.source_map( (report->>'source' )::regclass );

  select array_agg( coalesce( rc.element, jsonb_build_object() ) || e.doc ) into _selected
    from jsonb_array_elements( report->'groups' ) with ordinality e( doc )
      left join report.vcolumns( report ) rc( element ) on rc.element->>'column' = e.doc->>'column'
        and rc.element->>'key' = e.doc->>'key'
        and rc.element->>'type' = 'group'
  ;

  with  __group as (
    select
        e.doc->>'column' as group_column,
        e.doc->>'mode' as group_mode,
        e.doc->>'func' as group_func,
        e.doc->>'rename' as group_rename,
        e.doc->>'expression' as group_expression,
        e.doc->>'column_position' as column_position,
        e.doc->>'priority' as group_priority
      from unnest( _selected ) e( doc )
  ), __prepare_group as (
    select
      g.*
      from __group g
      where g.group_func is not null
  ), __prepare_group_by as (
    select
        _sc.*,
        _g.*
      from report.columns( _source.source_class ) _sc
        inner join __prepare_group _g on _sc.column_name = _g.group_column
  ) select
        count( * ) as counts,
        string_agg( agg.group_expression, e',\n          ' order by agg.column_position desc nulls last, agg.group_priority ) as expression,
        string_agg( format( '%I', agg.group_rename ), ', ' ) as exports_expression,
        array_agg( agg.group_rename ) as exports_rename

        into _aggregate
      from __prepare_group_by agg
  ;

  __prepare_aggregate.counts := _aggregate.counts;
  __prepare_aggregate.expression := _aggregate.expression;
  __prepare_aggregate.selected := _selected;
  __prepare_aggregate.exports_rename := _aggregate.exports_rename;
  __prepare_aggregate.exports_expression := _aggregate.exports_expression;
  return next;
end;
$$;

drop function if exists  report.__prepare_where( report jsonb );
create or replace function report.__prepare_where( report jsonb )
returns table( counts int8, expression text, selected jsonb[] )
immutable
language plpgsql as $$
declare
  _source record;
  _where record;
  _selected jsonb[];
begin
  select * into _source from report.source_map( (report->>'source' )::regclass );

  select array_agg( coalesce( rc.element, jsonb_build_object() ) || e.doc ) into _selected
    from jsonb_array_elements( report->'filters' ) with ordinality e( doc )
      left join report.vcolumns( report ) rc( element ) on rc.element->>'column' = e.doc->>'column'
        and rc.element->>'key' = e.doc->>'key'
        and rc.element->>'type' = 'filter'
  ;


  -- FILTERS
  with __filters as (
    select
        e.doc->>'column' as filter_column,
        coalesce( e.doc->>'opr', '=' ) as filter_opr,
        coalesce( e.doc->>'mode', 'default' ) as filter_oprmode,
        e.doc->>'value' as filter_value,
        e.doc->>'key' as filter_key
      from unnest( _selected ) e( doc )
  ), __prepare_filter as (
    select
        _f.filter_column,
        _f.filter_opr,
        _f.filter_oprmode,
        _f.filter_key,
        case
          when lower( _f.filter_opr ) = 'like' and _f.filter_oprmode = 'default' then format( '%s%s%s', '%', lower( _f.filter_value ), '%' )
          when lower( _f.filter_opr ) = 'like' and _f.filter_oprmode = 'right' then format( '%s%s', lower( _f.filter_value ), '%')
          else filter_value
        end as filter_value
      from __filters _f
  ), __prepare_where as (
    select
        case
          when _sc.is_array then format( 'any( %I )', _sc.column_name)
          when _f.filter_opr = 'like' then format( 'lower( %I )::text', _sc.column_name )
          else format( '%I', _sc.column_name )
        end as column_exp,

        case
          when _sc.is_array then format( '(%L)::%s', _f.filter_value, _sc.column_basetype )
          when _f.filter_opr = 'like' then format( '(%L)::text', _f.filter_value )
          else format( '(%L)::%s', _f.filter_value, _sc.column_type )
        end as args,
        _sc.*,
        _f.*

      from report.columns( _source.source_class ) _sc
        inner join __prepare_filter _f on _sc.column_name = _f.filter_column
  ), __group_where as (
    select
        _pr.filter_key,
        string_agg(
            case
              when  _pr.is_array then format( '%s %s %s', args, filter_opr, column_exp )
              else format( '%s %s %s', column_exp, filter_opr, args )
              end, e',\n            '
          ) as expression
      from __prepare_where _pr
      group by _pr.filter_key
  ) select
        count( * ) as counts,
        string_agg(
          format( e'true in ( \n%s )', _pr.expression )
          , e'\n          and '

        ) as expression
        into _where
      from __group_where _pr
  ;

  __prepare_where.selected := _selected;
  __prepare_where.expression := _where.expression;
  __prepare_where.counts := _where.counts;
  return next;
end;
$$;

drop function if exists report.__rownumber_of( text );
create or replace function report.__rownumber_of( text )
returns text
immutable
language sql as $$ select format('\\:$( %s ):#ROW_NUMBER', $1 ) $$;

drop function if exists  report.__prepare_wf( report jsonb );
create or replace function report.__prepare_wf( report jsonb )
returns table( counts int8, expression text )
immutable
language plpgsql as $$
declare
  _columns record;
  _aggregates record;
  _wfunction record;
  _wf_keys text[] default array( select e.text from jsonb_array_elements_text( report->'windows_function_key' )e( text));
begin

  if coalesce( array_length( _wf_keys, 1 ), 0 ) = 0  then
    _wf_keys := array [ 'sum' ]::text[];
  end if;
  select * into _columns from report.__prepare_column( report );
  select * into _aggregates from report.__prepare_aggregate( report );

  -- WINDOWS FUNCTIONS
  with  __columns as (
      select
        e.element->>'format' as format,
        coalesce( e.element->>'rename', e.element->>'_reduce_name' ) as "rename"
      from unnest( _columns.selected || _aggregates.selected || jsonb_build_object(
        'rename', '*',
        'format', '*'
      )) e( element )
  ), __expression as (
      select
        format( '%s:%s', _c.rename, _wf.key ) as name,
        format( _wf.over, case when _c.rename = '*' then '*' else format( '%I', _c.rename ) end, report.__rownumber_of( _c.rename ) ) as expression
        from __columns _c
          inner join report.agg _wf on _c.format = any( _wf.types )
            and true in ( _wf.key = any( _wf_keys ), _c.rename = '*' )
            and _wf.over is not null
  )  select
        string_agg( format( '%L, %s', _exp.name, _exp.expression ), e',\n            ' ) as expression,
        count( * ) as counts
        into _wfunction
      from __expression _exp
  ;

  __prepare_wf.counts := _wfunction.counts;
  __prepare_wf.expression := _wfunction.expression;
  return next ;
end;
$$;

drop function if exists report.reduce_name(  text );
create or replace function report.reduce_name(  text )
returns text immutable language sql as $$
  select format( '\\:%s', $1 )
$$;


drop function if exists  report.__prepare_column( report jsonb );
create or replace function report.__prepare_column( report jsonb )
returns table(
  expression text,
  expression_map jsonb,
  counts int8,
  selected jsonb[],
  reduces text[],
  reduces_counts int8,
  reduces_map jsonb,
  reduces_expression text,
  groupby_expression text,
  exports text[],
  exports_reduce text[],
  exports_representation text[],
  exports_expression text
)
immutable
language plpgsql as $$
declare
  __selected jsonb[];
  _formattable record;
  _columns record;
  _source record;
begin
  select * into _source from report.source_map( (report->>'source' )::regclass );

  select * into _formattable from report.__formattable() f( types );

  select array_agg( coalesce( rc.element, jsonb_build_object() ) || e.doc || jsonb_build_object(
      '_reduce_name',  report.reduce_name( rc.element->>'column' )
    )) into __selected
    from jsonb_array_elements( report->'columns' ) with ordinality e( doc )
      inner join report.vcolumns( report ) rc( element ) on rc.element->>'column' = e.doc->>'column'
        and rc.element->>'key' = e.doc->>'key'
        and rc.element->>'type' = 'column'
  ;

  -- COLUMNS
  with __representation as (
    select *,
        true as representation,
        false as reduce
       from report.columns( _source.source_class )
    union all
      select *,
          false as representation,
          true as reduce
         from report.columns( _source.source_class )
  ), __columns as (
    select
        e.doc->>'column' as column_name,
        e.doc->>'order' as column_order,
        e.doc->>'mask' as column_mask,
        e.doc->>'format' as column_formattype,
        e.doc->>'_reduce_name' as _reduce_name,
        e.ordinality
      from unnest( __selected ) with ordinality e( doc )
  ), __prepare_columns as (
    select
        _rp.column_name as _original_column_name,
        format( '%I', _rp.column_name ) as column_name,
         format( '%I', _c._reduce_name ) as column_reduce,
        _c._reduce_name,
        _rp.reduce,
        _rp.representation,
        case
          when _rp.reduce then 2
          else 1
        end as ___priority,
        case
          when _rp.column_type = any( _formattable.types ) and _c.column_mask is not null and _rp.reduce then format( 'report.__mask_reduce( %I::%s, %L, %L )',  _rp.column_name, _rp.column_type, column_formattype, _c.column_mask )
          when _rp.column_type = any( _formattable.types ) and _c.column_mask is not null and _rp.representation then format( 'report.__mask( %I::%s, %L, %L, %L )', _rp.column_name, _rp.column_type, column_formattype, _c.column_mask, _rp.representation )
          else format( '%I', _rp.column_name )
        end as expression,
        _c.ordinality
      from __representation _rp
        inner join __columns _c on _rp.column_name = _c.column_name
  ) select
      count( pc.column_name ) as counts,
      string_agg( format( '%s', pc.expression ), e',\n          'order by pc.___priority, pc.ordinality ) as columns,
      string_agg( pc.column_reduce, ', '  ) filter ( where pc.reduce ) reduces_expression,
      array_agg( pc._original_column_name ) filter ( where pc.reduce ) reduces,
      jsonb_object_agg( pc._original_column_name, pc._reduce_name  ) filter ( where pc.reduce ) reduces_map,

      count( * )  filter ( where pc.reduce ) reduces_counts,
      string_agg( format( '%s as %s', pc.expression,
        case
          when pc.reduce then pc.column_reduce
          else pc.column_name
        end ), e',\n          ' order by pc.___priority, pc.ordinality ) as expression,
      jsonb_object_agg( case when pc.reduce then pc._reduce_name else pc._original_column_name end, jsonb_build_object(
        'expression', pc.expression,
        'reduce', pc.reduce,
        'representation', pc.representation,
        'reduce_name', pc._reduce_name,
        'column_name', pc._original_column_name
      )) as expression_map,
      array_agg( case when pc.reduce then pc._reduce_name else pc._original_column_name end ) as exports,
      array_agg( pc._reduce_name ) filter ( where pc.reduce )as exports_reduce,
      array_agg( pc._original_column_name ) filter ( where pc.representation )as exports_representation,
      string_agg( case when pc.reduce then pc.column_reduce else pc.column_name end, ', ') as exports_expresssion,
      string_agg( format( '%s', pc.expression ), e',\n          ' order by pc.___priority, pc.ordinality ) filter ( where true in ( pc.reduce, pc.representation) ) as groupby_expression
      into _columns
    from __prepare_columns pc
  ;

  __prepare_column.selected := __selected;
  __prepare_column.counts := _columns.counts;
  __prepare_column.expression := _columns.expression;
  __prepare_column.expression_map := _columns.expression_map;
  __prepare_column.reduces := _columns.reduces;
  __prepare_column.reduces_map := _columns.reduces_map;
  __prepare_column.reduces_counts := _columns.reduces_counts;
  __prepare_column.reduces_expression := _columns.reduces_expression;
  __prepare_column.groupby_expression := _columns.groupby_expression;
  __prepare_column.exports := _columns.exports;
  __prepare_column.exports_reduce := _columns.exports_reduce;
  __prepare_column.exports_representation := _columns.exports_representation;
  __prepare_column.exports_expression := _columns.exports_expresssion;
  return next;
end;
$$;


create or replace function report.__prepare_row_number( report jsonb )
returns table( counts int8, expression text, exports_expression text, exports_rownumber text[] )
immutable
language plpgsql as $$
declare
  _columns record;
  _aggregate record;
  _rn record;
begin
  select * into _aggregate
    from report.__prepare_aggregate( report );

  select * into _columns
    from report.__prepare_column( report );

  with __exports as (
    select
        e.export,
        report.__rownumber_of( e.export ) as row_numbername,
        format( 'row_number() over ( partition by %I )', e.export ) as row_expression
      from unnest( _columns.exports_reduce || _aggregate.exports_rename ) e( export )
  ) select
        count( * ) as counts,
        string_agg( format( '%s as %I', row_expression, row_numbername), e',\n            ' ) as expression,
        array_agg( row_numbername ) as exports_rownumber,
        string_agg( format('%I', row_numbername ), ', ') as exports_expression
        into _rn
      from __exports;

  __prepare_row_number.expression := _rn.expression;
  __prepare_row_number.counts := _rn.counts;
  __prepare_row_number.exports_rownumber := _rn.exports_rownumber;
  __prepare_row_number.exports_expression := _rn.exports_expression;
  return next;
end;
$$;


drop function if exists report.__prepare( report jsonb );
create or replace function report.__prepare( report jsonb )
returns setof text
  immutable
  language plpgsql
as
$body_report_prepare$
declare
  /**
    report := {
      source: view|table
      _branch_uid: BRANCH-UID
      windows_function_key: [sum | avg | max | min | count | count::distinct],
      with_reduce?:boolean
      with_column_row_number?:boolean
      orders: [{
        *column: "COLUMN" value para coluna | "RENAME" value para o grupo,
        orientation?: "asc" | "desc" (default "first",
        nulls?: "last" | "first" (default "last" ),
        priority? number-level
      }],

      columns: [{
        column:COLUMN,
        format?: YYYY | YYYY-MM | YYYY-MM-DD | YYYY-MM-DD HH:MI
      }]
      filters: [{
        column: src.COL-NAME,
        opr: =|<|>|<=|>=|like
        mode?: default|right
        value: VALUE-FILTER
      }],
      groups:[{
        column: src.COL-NAME
        func: count|sum|max|min|avg
        rename: NEW-NAME
      }]
    }
   */
  _orders record;
  _columns record;
  _rownumber record;
  _aggregate record;
  _windows record;
  _statement text;
  _where record;
  _source record;
  _formattable record;
begin
  select * into _source from report.source_map( (report->>'source' )::regclass );
  select * into _formattable from report.__formattable() f( types );
  select * into _columns from report.__prepare_column( report );
  select * into _aggregate from report.__prepare_aggregate( report );
  select * into _rownumber from report.__prepare_row_number( report );
  select * into _where from report.__prepare_where( report );
  select * into _windows from report.__prepare_wf( report );
  select * into _orders from report.__prepare_order( report, _columns.selected, _aggregate.selected );

  --language=PostgreSQL
  _statement := $sql$
    with 
    __report_fixe ( "$_*_fixed") as (
      values(1)
    ), __report_engine as (
      select
          '(__$report__columns_expression)'
          '(__$report_aggregate_expression)'
        from '(select * from __$report_source)'
        where _branch_uid = $1
          and '(__$report_where)'
        group by '(__$report_group_by)'
    ), __distinct as (
      select pr.*, '(__$report_row_number_expression)' as "$ROW-NUMBER"
        from __report_engine pr
    ), __windows as (
        select _re.*,
          jsonb_build_object(
            '(__$report_windows_functions)'
          ) as "*_$"
          from __report_fixe _rf
            left join __distinct _re on true
          order by '(__$report_order_by)'
          limit $2
          offset $3
    ) select to_json( _w )
        from __windows _w
  $sql$;


  _statement := replace( _statement, $$'(select * from __$report_source)'$$, _source.source_format );
  if _columns.counts > 0 then
    _statement := replace( _statement, $$'(__$report__columns_expression)'$$, format( '%s', _columns.expression ) );
  else
    _statement := replace( _statement, $$'(__$report__columns_expression)'$$, '' );
  end if;

  if _columns.counts > 0 and _aggregate.counts >0 then
    _statement := replace( _statement, $$'(__$report_aggregate_expression)'$$, format( ', %s', _aggregate.expression ) );
  elsif _aggregate.counts > 0 then
    _statement := replace( _statement, $$'(__$report_aggregate_expression)'$$, format( '%s', _aggregate.expression ) );
  else
    _statement := replace( _statement, $$'(__$report_aggregate_expression)'$$, format( '%s', '' ) );
  end if;


  if _where.counts > 0 then
    _statement := replace( _statement, $$'(__$report_where)'$$, _where.expression );
  else
    _statement := replace( _statement, $$and '(__$report_where)'$$, '' );
  end if;

  if _rownumber.expression is null then
    raise exception 'Row Number Is NUll';
  end if;

  if _rownumber.counts > 0 then
    _statement := replace( _statement, $$'(__$report_row_number_expression)' as "$ROW-NUMBER"$$, _rownumber.expression );
  else
    _statement := replace( _statement, $$, '(__$report_row_number_expression)' as "$ROW-NUMBER"$$, '' );
  end if;

  if _columns.counts > 0 and _aggregate.counts > 0 then
    _statement := replace( _statement, $$'(__$report_group_by)'$$, _columns.groupby_expression );
  else
    _statement := replace( _statement, $$group by '(__$report_group_by)'$$, '' );
  end if;

  if _orders.counts > 0 then
    _statement := replace( _statement, $$'(__$report_order_by)'$$, _orders.expression );
  else
    _statement := replace( _statement, $$order by '(__$report_order_by)'$$, '' );
  end if;

  if _windows.counts > 0 then
    _statement := replace( _statement, $s$'(__$report_windows_functions)'$s$, _windows.expression );
  else
    _statement := replace( _statement, $s$'(__$report_windows_functions)'$s$, '' );
  end if;

  select string_agg( e.line, e'\n' ) into _statement
    from regexp_split_to_table( _statement, e'\n' ) e( line )
    where length( trim( e.line ) ) > 0
  ;
  _statement := trim( _statement );
  return next _statement;
end;
$body_report_prepare$;

`;
