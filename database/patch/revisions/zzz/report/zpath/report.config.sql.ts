import {block} from "../../../../core/updater";

block( module, { identifier: "report-configs-v1.1", flags: []}).sql`
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
