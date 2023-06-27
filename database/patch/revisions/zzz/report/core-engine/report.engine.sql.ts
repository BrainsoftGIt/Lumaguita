import {block} from "../../../../core/updater";

block( module, { identifier: "report:function|core"}).sql`

drop function if exists report.report(report jsonb );
drop function if exists report.engine(report jsonb );
create or replace function report.engine(report jsonb )
returns SETOF json
  language plpgsql
as
$$
declare
  /**
    report := {
      _branch_uid: BRANCH
      limit?: int
      offset?: int
      source: view|table
      columns: [ COL1, COL2, COL3 ]
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
  _limit int8 default report->>'limit';
  _offset int8 default report->>'offset';
  ___branch uuid default report->>'_branch_uid';
  _next record;
begin
  for _next in select * from report.__prepare( report ) n( statement ) loop
      raise notice 'REPORT %', report;
      raise notice e'REPORT:STATEMENT \n%', _next.statement;
      return query execute _next.statement using ___branch, _limit, _offset;
  end loop;
end;
$$;



drop function if exists report.report_formats(anyelement, type text, format text, representation boolean);
drop function if exists report.__mask(anyelement, type text, format text, representation boolean);

create or replace function report.__mask( anyelement, type text, format text, representation boolean default false )
returns text
immutable strict
language plpgsql as $body$
<<func>>
declare
  _format report.mask;
  mouth_group double precision;
  base int;
begin
  representation := coalesce( representation, false );
  select * into _format
    from report.mask rf
    where rf.mask = __mask.format
      and __mask.type = any( rf.type );

  if _format.mask is null then return null; end if;

  -- to_char
  if lower( _format.function ) = 'to_char' then
    return to_char( $1, case
      when representation then _format.representation
      else _format.mask
    end);
  end if;

  if lower( _format.function ) = 'mouth_group' then
    mouth_group := extract( months from $1 ) / ( 12.0 / _format.mask::double precision);
    base := case
      when mouth_group::int < mouth_group then  mouth_group::int+1
      else mouth_group::int
    end;
    return to_char( $1,
      case when representation then format( '%I%I"º" YYYY', _format.representation, base )
           else format( 'YYYY %I%I', _format.representation, base )
      end);
  end if;
end;
$body$;



create or replace function report.__mask_reduce( anyelement, type text, format text )
returns anyelement
immutable strict
language plpgsql as $body$
<<func>>
declare
  _format report.mask;
  _types record;
  mouth_group double precision;
  base int;
  _month int;
  _year int;
begin
  select * into _format
    from report.mask rf
    where rf.mask = __mask_reduce.format
      and __mask_reduce.type = any( rf.type );

  select * into _types
    from report.talias ta
    where __mask_reduce.type = any( ta.alias )
  ;

  if _format.mask is null then return null; end if;

  -- to_char
  if lower( _format.function ) = 'to_char' then
    case
      when 'date' = any( _types.alias ) then return to_date( to_char( $1, _format.mask ), _format.mask );
      when 'timestamp' = any( _types.alias ) then return to_timestamp( to_char( $1, _format.mask ), _format.mask );
      when 'timestamptz' = any( _types.alias ) then return to_timestamp( to_char( $1, _format.mask ), _format.mask )::timestamptz;
      else return $1;
    end case;
  end if;

  if lower( _format.function ) = 'mouth_group' then
    mouth_group := extract( months from $1 ) / ( 12.0 / _format.mask::double precision);
    base := case
      when mouth_group::int < mouth_group then  mouth_group::int+1
      else mouth_group::int
    end;
    _month := base * ( 12.0 / _format.mask::double precision )-( 12.0 / _format.mask::double precision)+1;
    _year := extract( year from $1 );
    case
      when 'date' = any( _types.alias ) then return make_date( _year, _month, 1 );
      when 'timestamp' = any( _types.alias ) then return make_timestamp( _year, _month, 1, 0, 0, 0 );
      when 'timestamptz' = any( _types.alias ) then return make_timestamptz( _year, _month, 1, 0, 0, 0, to_char( $1, 'tz' ) );
    end case;
  end if;
end;
$body$;

drop table if exists tweeks.repconf;
drop function if exists tweeks.report_formats_of(args jsonb);
drop view if exists tweeks.vreport_balanco;
drop view if exists tweeks.vreport_caixa;
drop view if exists tweeks.vreport_conta;
drop view if exists tweeks.vreport_fatura;
drop view if exists tweeks.vreport_fluxo;
drop view if exists tweeks.vreport_imposto;
drop view if exists tweeks.vreport_venda;

drop table if exists report;
drop table if exists reportagg;
drop table if exists reportmask;
drop table if exists reporttypealias;
drop table if exists reptemplate;


drop function if exists tweeks.__tg_report_format;

drop function if exists repcolumns;
drop function if exists report;
drop function if exists report_configs;
drop function if exists report_mask;
drop function if exists report_prepare;
drop function if exists report_reduce;
drop function if exists report_register_sync;
drop function if exists report_source;
drop function if exists report_temporal;
drop function if exists reptemplateof;
`;
