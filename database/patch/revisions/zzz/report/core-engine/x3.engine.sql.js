"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../../core/updater");
(0, updater_1.block)(module, { identifier: "report:function|3x" }).sql `

drop function report."3x"( report jsonb );
drop function if exists report."xxx"( report jsonb );
create or replace function report."3x"( report jsonb )
returns setof json
language plpgsql as $$
declare
  /**
    args := {
      row_column: column
      row_order: asc|desc (default asc)
      column_column: column
      column_order asc|desc (default asc)
      aggregation:RENAME
    }
   */
  statement text;
  _columns record;
  _row_column text default report->>'row_column';
  _row_order text default report->>'row_order';
  _column_column text default report->>'column_column';
  _column_order text default report->>'column_order';
  _aggregation text default report->>'aggregation';
  _row_reduce text;
  _column_reduce text;
  _sources record;
  _limit int8 default report->>'limit';
  _offset int8 default report->>'offset';
begin
  report := report - 'limit' - 'offset';

  select * into _columns
    from report.__prepare_column( report );

  raise notice '%', to_jsonb( _columns );

  if _row_column = any( _columns.reduces ) then _row_reduce := _columns.reduces_map->>( _row_column ); end if;
  if _column_column = any( _columns.reduces ) then _column_reduce := _columns.reduces_map->>( _column_column ); end if;

  _row_reduce := coalesce( _row_reduce, _row_column );
  _column_reduce := coalesce( _column_reduce, _column_column );

  raise notice '_row_reduce: %', _row_reduce;
  raise notice '_column_reduce: %', _column_reduce;

  select jsonb_object_agg( c.column_name, jsonb_build_object(
      'type', c.column_type,
      'basetype', c.column_basetype,
      'default', c.column_default,
      'is_array', c.is_array,
      'is_generated', c.is_generated
    )) as maps into _sources
    from report.columns( (report->>'source')::text::regclass ) c;

-- $1 => report
-- $2 => row_column
-- $3 => row_reduce
-- $4 => column_column
-- $5 => column_reduce
-- $6 => aggregation

--language=sql
statement := $sql$
  with __source as (
    select e.data::text::jsonb as data
      from report.engine( $1 ) e( data )
  ), __xxx as (
    select
        _s.data->>$2 as "($rowColumnName)",
        json_object_agg( _s.data ->> $4, (_s.data-> $6) order by (_s.data ->> $5)::"($columnColumnType)" "($columnOrder)" nulls last ) as "($columnColumnName)"
      from __source _s
      group by
        _s.data->>$2,
        _s.data->>$3
      order by (_s.data->>$3)::"($rowColumnType)" "($rowOrder)" nulls last
  ), __xxx_header as (
    select
        distinct _s.data ->> $4 as header_representation,
        ( _s.data ->> $5)::"($columnColumnType)" as header_reduce
      from __source _s
  ), __result as  (
    select json_agg( _xh.header_representation order by _xh.header_reduce "($columnOrder)" nulls last )  as data
      from __xxx_header _xh
    union all
      select to_json( _x )
        from __xxx _x
  ) select data
      from __result
      limit $7
      offset $8

$sql$;

  statement := replace( statement, '"($rowColumnName)"', format( '%I', _row_column ) );
  statement := replace( statement, '"($columnColumnType)"', _sources.maps->( _column_column )->>'type' );
  statement := replace( statement, '"($columnColumnName)"', format( '%I', _column_column ) );
  statement := replace( statement, '"($columnOrder)"', coalesce( _column_order, 'asc' ) );
  statement := replace( statement, '"($rowColumnType)"', _sources.maps->( _row_column )->>'type' );
  statement := replace( statement, '"($rowOrder)"', coalesce( _row_order, 'asc' ) );

  raise notice  '%', statement;

  return query execute statement using
    report,
    _row_column,
    _row_reduce,
    _column_column,
    _column_reduce,
    _aggregation,
    _limit,
    _offset
  ;
end;
$$;


select * from report."3x"('{
    "groups": [
      {
        "key": "aggregation|report.vreport_venda.$ TOTAL::#sum",
        "func": "sum",
        "column": "$ TOTAL",
        "rename": "#SUMOF $ TOTAL"
      }
    ],
    "offset": 0,
    "orders": [
      {
        "column": "ARTIGO",
        "priority": "100",
        "orientation": "asc"
      },
      {
        "column": "DATA",
        "priority": "100",
        "orientation": "asc"
      }
    ],
    "source": "report.vreport_venda",
    "columns": [
      {
        "key": "column|report.vreport_venda.ARTIGO",
        "init": "true",
        "name": "ARTIGO",
        "type": "column",
        "column": "ARTIGO"
      },
      {
        "key"   : "column|report.vreport_venda.DATA",
        "init"  : "true",
        "mask"  : "YYYY-MM-DD",
        "name"  : "DATA",
        "type"  : "column",
        "column": "DATA"
      }
    ],
    "filters": [],
    "_branch_uid": "4ec28576-0fd6-436e-b2e3-d1ac7c2e1d49",
    "windows_function_key": [
      "count::distinct"
    ],
    "row_column": "ARTIGO",
    "row_order": "asc",
    "column_column": "DATA",
    "column_order": "asc",
    "aggregation": "#SUMOF $ TOTAL"
  }');
`;
//# sourceMappingURL=x3.engine.sql.js.map