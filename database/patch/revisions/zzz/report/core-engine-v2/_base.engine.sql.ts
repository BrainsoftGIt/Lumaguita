/**
 * @author Zoads
 */
import {block} from "../../../../core/updater"

block(module, { identifier: "report:engine|base"} )
//language=PostgreSQL
    .sql`

create schema if not exists report;
drop function if exists report.sync(regclass, name text);
drop function if exists report.sync(regclass, name text, priority integer);
drop function if exists report.sync(regclass, name text, priority integer, boolean );

create table if not exists report.report ();
drop table if exists report.____temp_report;
create table report.____temp_report as select * from report.report;
drop table if exists report.report;

create table if not exists report.report ();
alter table report.report add if not exists report_name     varchar;
alter table report.report add if not exists report_source   varchar;
alter table report.report add if not exists report_columns  text[];
alter table report.report add if not exists report_priority integer;
alter table report.report add if not exists report_active   boolean default true not null;
alter table report.report add constraint pk_report_source primary key (report_source);

insert into report.report
select (jsonb_populate_record( null::report.report, to_jsonb( tr ))).*
from report.____temp_report tr;
drop table report.____temp_report;

create table if not exists report.template();
drop  table if exists report.____temp_template;
create table report.____temp_template as select * from report.template;
drop table if exists report.template;

create table if not exists report.template();
alter table report.template add type character varying;
alter table report.template add name character varying;
alter table report.template add  configs jsonb;

insert into report.template
select (jsonb_populate_record( null::report.template, to_jsonb( trp ))).*
from report.____temp_template trp;
drop table report.____temp_template;



create table if not exists report.vcolumn();
drop  table if exists report.____temp_vcolumn;
create table report.____temp_vcolumn as select * from report.vcolumn;
drop table if exists report.vcolumn;

create table if not exists report.vcolumn();
alter table report.vcolumn add if not exists  source   varchar;
alter table report.vcolumn add if not exists  name     varchar;
alter table report.vcolumn add if not exists  position smallint;
alter table report.vcolumn add if not exists  show     boolean default false;
alter table report.vcolumn add if not exists  init     boolean default false;
alter table report.vcolumn add if not exists  format   varchar;
alter table report.vcolumn add if not exists  filter   jsonb   default jsonb_build_array();
alter table report.vcolumn add if not exists  agg      jsonb   default jsonb_build_array();
alter table report.vcolumn add if not exists  noagg    boolean default false;
alter table report.vcolumn add if not exists  gen      jsonb   default jsonb_build_array();
alter table report.vcolumn add if not exists  rename   varchar;
alter table report.vcolumn add if not exists  type     varchar;
alter table report.vcolumn add constraint pk_vcolumn_source primary key (source, name );

insert into report.vcolumn
select (jsonb_populate_record( null::report.vcolumn, to_jsonb( trp ))).*
from report.____temp_vcolumn trp;

drop table report.____temp_vcolumn;
drop table if exists report.agg;
create table report.agg(
  key text,
  priority int,
  function text,
  types text[],
  format text,
  label text,
  name text,
  rename text,
  description text,
  simple text,
  expression text,
  over text,
  constraint pk_agg_key primary key ( key )
);

insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('sum', 1, 'sum', '{int,double,money}', null, 'SOMAR', '∑SOM. %s', '#SUMOF %s', 'SOMATORIO DOS VALORES NA COLUNA %s', 'sum( %s )', 'sum( %s ) as %I', 'sum( %s ) over ()');
insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('count', 2, 'count', '{int,double,money,date,timestamp,time,timestamptz,name,code,text,id,*}', 'int', 'CONTAR TUDO', '∑QTD. %s', '#COUNTOF %s', 'CONTAGEM DOS VALORES NA COLUNA %s (INCLUIDO DUPLICADOS)', 'count( %s )', 'count( %s ) as %I', 'count( %s ) over ()');
insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('count::distinct', 3, 'count', '{int,double,money,date,timestamp,time,timestamptz,name,code,text,id}', 'int', 'CONTAR DISTINTO', '∑QTD. DIST. %s', '#COUNTOF:DISTINCT %s', 'CONTAGEM DOS VALORES NA COLUNA %s (EXCLUINDO DUPLICADOS)', 'count( distinct %s ) ', 'count(  distinct %s ) as %I ', 'count( %s ) filter( where %I = 1) over ()');
insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('max', 4, 'max', '{int,double,money,date,timestamp,time,timestamptz,name,code,text,id}', null, 'MÁXIMO', '∑MAX. %s', '#MAXOF %s', 'MAXIMO VALOR NA COLUNA %s', 'max( %s )', 'max( %s ) as %I', 'max( %s ) over ()');
insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('min', 5, 'min', '{int,double,money,date,timestamp,time,timestamptz,name,code,text,id}', null, 'MÍNIMO', '∑MIN. %s', '#MINOF %s', 'MINIMO VALOR NA COLUNA %s', 'min( %s )', 'min( %s ) as %I', 'min( %s ) over ()');
insert into report.agg ( key, priority, function, types, format, label, name, rename, description, simple, expression, over) VALUES ('avg', 6, 'avg', '{int,double,money}', null, 'MEDIA', '∑MED. %s', '#AVGOF %s', 'MEDIA DE VALORES NA COLUNA %s', 'avg( %s )', 'avg( %s ) as %I', 'avg( %s ) over ()');

select * from report.agg;


drop table if exists report.talias;
create table if not exists report.talias(
  type text,
  alias text[],
  constraint pk_talias_type primary key ( type )
);

select format_type( 'numeric'::regtype, null );

insert into report.talias ( type, alias ) values ( 'date', '{date}');
insert into report.talias ( type, alias ) values ( 'int', '{int,int4,integer}');
insert into report.talias ( type, alias ) values ( 'smallint', '{int2,smallint}');
insert into report.talias ( type, alias ) values ( 'bigint', '{bigint,int8}');
insert into report.talias ( type, alias ) values ( 'varchar', '{varchar,character varying}');
insert into report.talias ( type, alias ) values ( 'double', '{double,double precision,float8}');
insert into report.talias ( type, alias ) values ( 'char', '{char,character}');
insert into report.talias ( type, alias ) values ( 'bool', '{bool,boolean}');
insert into report.talias ( type, alias ) values ( 'timestamp', '{timestamp,timestamp without time zone}');
insert into report.talias ( type, alias ) values ( 'time', '{time,time without time zone}');
insert into report.talias ( type, alias ) values ( 'timestamptz', '{timestamptz,timestamp with time zone}');
insert into report.talias ( type, alias ) values ( 'timetz', '{timetz,time with time zone}');


drop table if exists report.mask;
create table if not exists report.mask(
  type text[] default array[]::text[],
  mask text,
  name text,
  description character varying,
  representation text,
  function text,
  priority int2,
  constraint pk_reportformats primary key ( type, mask )
);

INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY-MM-DD', 'DIARIO', 'APRESENTAÇÃO DIÁRIA', 'DD-MM-YYYY', 'to_char', 100);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY-MM', 'MENSAL', 'APRESENTAÇÃO MENSAL', 'MON "DE" YYYY', 'to_char', 90);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY', 'ANUAL', 'APESENTAÇÃO ANUAL', 'YYYY', 'to_char', 80);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY "T"Q', 'TRIMESTRAL', 'APRESENTAÇÃO TRIMESTRAL', 'YYYY "T"Q', 'to_char', 70);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', '2', 'SIMESTRAL', 'APRESENTAÇÃO SEMESTRAL', 'S', 'mouth_group', 60);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY-WW', 'SEMANAL', 'APRESENTAÇÃO SEMANAL', 'WW"ª SEM" "DE" YYYY', 'to_char', 50);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY-MM-W', 'SEMANAL MENSAL', 'APRESENTAÇÃO SEMANAL MENSAL', 'W"ª SEM" "DE" MON YYYY', 'to_char', 49);
INSERT INTO report.mask (type, mask, name, description, representation, function, priority) VALUES ('{date,timestamp,timestamptz}', 'YYYY-MM-DD HH:MI', 'MOMENTANIO', 'APRESENTACÃO DIÁRIO INCLUINDO HORA E MINUTO', 'DD-MM-YYYY HH:MI', 'to_char', null);


create or replace function report.____tg_report_format() returns trigger
  language plpgsql
as
$$
declare
  _source record;
  _repcoll report.vcolumn;
  _report report.report;
begin
  if pg_typeof( new )::text::regclass = 'report.report'::regclass then
    _report := new;
    select * into _source
    from report.source_map( _report.report_source::regclass );
    _report.report_source := _source.source_format;
    return _report;
  elsif pg_typeof( new )::text::regclass = 'report.vcolumn'::regclass then
    _repcoll := new;
    select * into _source
    from report.source_map( _repcoll.source::regclass );
    _repcoll.source := _source.source_format;
    return _repcoll;
  end if;
  return new;
end;
$$;

create trigger tg_report_format before insert or update on report.report for each row
execute procedure report.____tg_report_format();


drop function if exists report.eval;
create or replace function report.eval( expression text, args anyelement ) returns jsonb
  language plpgsql
as
$$
declare
  result text;
  statement text;
begin
  statement := format( 'select to_jsonb((%s))', expression );
  raise notice 'eval: %', statement;
  execute statement using args into result;
  return result;
end
$$;


drop table if exists report.var;
create table report.var();
alter table report.var add var_key text;
alter table report.var add var_description text;
alter table report.var add var_type text;
alter table report.var add var_expression text;


alter table report.var add constraint pk_value_key primary key ( var_key );


INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_timestamp', 'Timestamp Atual', 'timestamp', 'select current_timestamp');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_user', 'Current Database User', 'text', 'select "current_user"()');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_collaborator', 'Collaborador atual', 'uuid', 'select $1->>''arg_colaborador_id''');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_branch', 'Branch Atual', 'uuid', 'select coalesce( ($1->>''branch_uid'')::uuid, ( $1->>''arg_branch_id'')::uuid, ( $1->>''_branch_uid'')::uuid, ( $1->>''arg_branch_uid'')::uuid, tweeks.__branch_uid( ($1->>''arg_colaborador_id'')::uuid, ($1->>''arg_espaco_auth'' )::uuid))');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_space', 'Espaço atual (Armazem Atual)', 'uuid', 'select $1->>''arg_espaco_auth''');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('today', 'Hoje', 'date', 'select current_date');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('yesterday', 'Ontem', 'date', 'select current_date - interval ''1'' day');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('end_of_month', 'Fim do mês', 'date', 'select to_date(to_char(current_date + interval ''1'' month, ''yyyy-mm''), ''yyyy-mm'')-interval ''1'' day');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('current_time', 'Hora atual', 'time', 'select current_time');
INSERT INTO report.var ( var_key, var_description, var_type, var_expression ) VALUES ('now', 'Momento atual', 'timestamptz', 'select now()');

create or replace function report.vars( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      var_key: [key, key, key],
      arg_colaborador_id::UID
      arg_espaco_id::UID
      source::(report-source)
    }
   */
  _var_key text[] default array( select e.text from jsonb_array_elements_text( args->'var_key') e ( text ) );
begin
  if coalesce( array_length(_var_key, 1), 0 ) = 0 then
    select array_agg( var_key ) into  _var_key
      from report.var v;
  end if;

  return query
    with __vars as (
      select vk.*,
        report.eval( format( 'select (%s)::%s', vk.var_expression, vk.var_type ), '{}'::jsonb ) as value
      from report.var vk
      where vk.var_key = any( _var_key )
    ) select to_jsonb( _vk )
    from __vars _vk
  ;
end;
$$;

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
                 'over', format( f.agg_over, f.agg_usecolumn, format( '\\\\\\\\:%s:#ROW_NUMBER', f.name  ) )
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
                 'over', format( f.agg_over, f.agg_usecolumn, format( '\\\\\\\\:%s:#ROW_NUMBER', f.name  ) )
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


CREATE or replace FUNCTION report.sync(regclass, name text DEFAULT NULL::text, priority integer DEFAULT NULL::integer, active boolean DEFAULT true) RETURNS SETOF json
  LANGUAGE plpgsql
AS $_$
declare
  _rec record;
  _report report.report;
  _source record;
begin
  select * into _source
  from report.source_map( $1 );

  active := coalesce( active, true );

  with __columns as (
    select
      col.column_name,
      format_type( pt.oid, atttypmod ) column_type,
      col.data_type = 'ARRAY' as is_array,
      col.column_default,
      col.is_generated = 'ALWAYS' as is_generated
    from information_schema.columns col
           inner join report.source_map( _source.source_class ) c on c.source_name = col.table_name
      and col.table_schema::regnamespace = c.source_schema::regnamespace
           inner join pg_attribute att on col.column_name = att.attname
      and att.attrelid = format( '%s.%s', col.table_schema, col.table_name )::regclass::oid
           inner join pg_type pt on att.atttypid = pt.oid
    where format('%s.%s', c.source_schema, c.source_name)::regclass = _source.source_class
  )

  select array_agg( to_jsonb( c ) ) as configs,
         array_agg(c.column_name ) as columns
  into _rec
  from __columns c
  ;

  select * into _report
  from report.report r
  where r.report_source = cluster.__format( $1 )
  ;
  _report.report_name := coalesce( name, _report.report_name, cluster.__format( $1 ) );
  _report.report_source := _source.source_format;
  _report.report_columns := _rec.columns;
  _report.report_priority := priority;
  _report.report_active := active;

  select  ("returning").* into _report
  from lib.sets( _report );

  return next to_json( _report );


  delete from report.vcolumn r
    where r.name != all ( _rec.columns )
      and source = _source.source_format
  ;


  with __news as (
    select
      n.doc->>'column_name' as name,
      n.doc->>'column_type' as type
    from unnest( _rec.configs ) n ( doc )
      left join report.vcolumn rc on n.doc->>'column_name' = rc.name
        and rc.source = _source.source_format
    where rc.name is null
  )
  insert into report.vcolumn (
    source,
    name,
    filter,
    agg,
    type
  ) select
      _report.report_source,
      _n.name,
      jsonb_build_array(),
      jsonb_build_array(),
      _n.type
  from __news _n;

  with __updates as  (
    select
      n.doc->>'column_name' as name,
      n.doc->>'column_type' as type
    from unnest( _rec.configs ) n ( doc )
  ) update report.vcolumn c
  set
    type = _up.type
  from __updates _up
  where c.name = _up.name
    and c.source = _source.source_format
  ;

  return query
    select  to_json( rc )
      from report.vcolumn rc
      where rc.source = _report.report_source
  ;
end;
$_$;


create or replace function report.source_map(regclass)
  returns TABLE(source_name character varying, source_schema character varying, source_class regclass, source_format character varying, type text)
  language sql
as
$$
with __class as (
  select
         pc.tablename::text,
         pc.schemaname::text,
         format( '%s.%s', pc.schemaname::regnamespace::text, pc.tablename )::regclass,
         format( '%s.%s', pc.schemaname::regnamespace::text, pc.tablename ),
         'table'
  from pg_tables pc
  where (format( '%s.%s', pc.schemaname::regnamespace::text, pc.tablename )::regclass = $1)
  union all
  select pv.viewname::text,
         pv.schemaname::text,
         format( '%s.%s', pv.schemaname::regnamespace::text, pv.viewname )::regclass,
         format( '%s.%s', pv.schemaname::regnamespace::text, pv.viewname ),
         'view'
  from pg_views pv
  where (format( '%s.%s', pv.schemaname::regnamespace::text, pv.viewname )::regclass = $1)
) select *
from __class
$$;


create or replace function report.source_filter(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    _source text default args->>'source';
    _user uuid default args->>'user';
    _space uuid default args->>'space';
    _branch uuid default args->>'branch';
    _const map.constant;
  begin
    _const := map.constant();

    if _source = 'tweeks.posto' then
      return query
        with __posto as (
          select
              s.posto_id as id,
              s.posto_designacao as label
            from tweeks.posto s
            where s._branch_uid = _branch
        ) select to_jsonb( _p )
          from __posto _p;
    end if;

    if _source = 'auth.colaborador' then
      return query
        with __posto as (
          select
            s.colaborador_id as id,
            s.colaborador_nome as label
          from auth.colaborador s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.espaco' then
      return query
        with __posto as (
          select
            s.espaco_id as id,
            s.espaco_nome as label
          from tweeks.espaco s
          where s.espaco_branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'geoinfo.currency' then
      return query
        with __posto as (
          select
            s.currency_id as id,
            s.currency_code as label
          from geoinfo.currency s
          where currency_code in ( 'STN', 'EUR', 'USD' )
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.artigo' then
      return query
        with __posto as (
          select
            s.artigo_id as id,
            s.artigo_nome as label
          from tweeks.artigo s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'boolean|Y/N' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'SIM' )
          union all values ( false, 'NÃO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'boolean|ON/OFF' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'ATIVO' )
          union all values ( false, 'DESATIVO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'STATUS' then
      return query
        with __yes_no ( id, label ) as (
          values ( 0, 'DESATIVO' )
          union all values ( 1, 'ATIVO' )
          union all values ( 2, 'PENDENTE' )
          union all values ( -1, 'ANULADO' )
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'tweeks.toperacao' then
      return query
        with __posto as (
          select
            s.toperacao_id as id,
            s.toperacao_designacao as label
          from tweeks.toperacao s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;


    if _source = 'tweeks.tgroup' then
      return query
        with __tgroup as (
          select
            s.tgrupo_id as id,
            s.tgrupo_desc as label
          from tweeks.tgrupo s
        ) select to_jsonb( _p )
        from __tgroup _p;
    end if;

    if _source = 'tweeks.tpaga' then
      return query
        with __posto as (
          select
            s.tpaga_id as id,
            s.tpaga_designacao as label
          from tweeks.tpaga s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.cliente' then
      return query
        with __posto as (
          select
            s.cliente_id as id,
            s.cliente_titular as label
          from tweeks.cliente s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.fornecedor' then
      return query
        with __posto as (
          select
            s.fornecedor_id as id,
            s.fornecedor_nome as label
          from tweeks.fornecedor s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.tipoimposto' then
      return query
        with __source as (
          select
            s.tipoimposto_id as id,
            s.tipoimposto_codigo as label
          from tweeks.tipoimposto s
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.serie' then
      return query
        with __source as (
          select
            s.serie_id as id,
            format( '%s (%s)', ts.tserie_desc,  s.serie_numero) as label
          from tweeks.serie s
            inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tserie' then
      return query
        with __source as (
          select
            s.tserie_id as id,
            s.tserie_desc as label
          from tweeks.tserie s
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.caixa::estado' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_caixa_estado_ativo, 'ABERTA' )
          union all values ( _const.maguita_caixa_estado_fechado, 'FECHADA' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.lancamento::mode' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_lancamento_mode_automatic, 'AUTOMATICO' )
          union all values ( _const.maguita_lancamento_mode_manual, 'MANUAL' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tlancamento' then
      return query
        with __source( id, label ) as (
          select tlancamento_id, tlancamento_desc
            from tweeks.tlancamento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tmovimento' then
      return query
        with __source( id, label ) as (
          select tmovimento_multiplo, tmovimento_designacao
            from tweeks.tmovimento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

  end;
$$;


create or replace function report.__template_of(ref jsonb, colconfigs jsonb) returns jsonb
  language plpgsql
as
$$
declare
  refname text;
  args jsonb;
  _name text;
  _type text;
begin
  if ref is null then return null; end if;
  if jsonb_typeof( ref ) = 'object' then return ref; end if;
  if jsonb_typeof( ref ) = 'string' then refname = ref->>0;
  elseif jsonb_typeof( ref ) = 'array' then
    refname := ref->>0;
    args := ref->1;
  end if;

  if args is not null and jsonb_typeof( args ) != 'object' then raise exception 'args is not object, %', args ; end if;
  _type := (regexp_split_to_array( refname, '\\.' ))[1];
  _name := (
    select string_agg( u.text, '.' )
    from  unnest( ( regexp_split_to_array( refname, '\\.' ))[2:] ) u( text)
  );

--  raise exception 'type: %, _name: %, LENGTH: %', _type, _name, array_length (regexp_split_to_array( refname, '\\.' ), 1);

  if _type is null or _name is null or array_length(regexp_split_to_array( refname, '\\.' ), 1)  < 2 then
    raise exception 'Type or name indeterminated %: ', ref;
  end if;

  declare
    _template record;
    _i record;
    _j record;
    _obj jsonb default jsonb_build_object();
    _conversion text;
    _value jsonb;
  begin
    select * into _template
    from report.template t
    where type = _type
      and t.name = _name;

    if _template.name is null then raise exception 'Template not found with ref: %', ref; end if;
    for _i in
      select
        e.key,
        e.value,
        jsonb_typeof( e.value ) as type,
        case
          when jsonb_typeof( e.value ) in ( 'object', 'array' ) then e.value::text
          else e.value->>0
          end as text
      from jsonb_each( _template.configs ) e
      loop
        if _i.type in ( 'string', 'boolean', 'null', 'number' ) then _value := _i.value;
        elsif _i.type = 'object' and (_i.value->>'$template')::boolean then
          _conversion := _i.value->>'$structure';
          if _conversion is null then raise exception 'Null AQUI 452739'; end if;
          for _j in
            select
              e.key,
              e.value,
              jsonb_typeof( e.value ) as type,
              case
                when jsonb_typeof( e.value ) in ( 'object', 'array' ) then e.value::text
                else e.value->>0
                end as text
            from jsonb_each( colConfigs ) e
            loop
              _conversion := replace( _conversion, format( '${"${%s}"}', _j.key ), coalesce( _j.text, '' ) );
              if _conversion is null then raise exception 'Null AQUI 77736'; end if;
            end loop;

          for _j in
            select
              e.key,
              e.value,
              jsonb_typeof( e.value ) as type,
              case
                when jsonb_typeof( e.value ) in ( 'object', 'array' ) then e.value::text
                else e.value->>0
                end as text
            from jsonb_each( args ) e
            loop
              _conversion := replace( _conversion, format( '${"${args.%s}"}', _j.key ), coalesce( _j.text, '' ) );
              if _conversion is null then raise exception 'Null AQUI kjskdhs'; end if;
            end loop;

          _conversion := coalesce( _conversion, _i.value->>'$default', _i.value->>'$defaults' );
          if _conversion is null then raise exception '#C001 Conversion is null template: %; key: %; value %; args <= %', _template.name , _j.key, _j.value, args; end if;
          if _conversion = _i.value->>'$structure' then _conversion := coalesce(  _i.value->>'$default', _i.value->>'$defaults' ); end if;
          if _conversion is null then raise exception '#C002 Conversion is null template: %; key: %; value %; args <= %', _template.name , _j.key, _j.value, args;  end if;

          if _i.value->>'$type' in ( 'string', 'text', 'varchar', 'character varying' ) then
            _value := to_jsonb( _conversion );
          elseif _i.value->>'$type' in ( 'number', 'numeric', 'int', 'integer', 'double', 'double precision' ) then
            _value := to_jsonb( _conversion::numeric );

          elseif _i.value->>'$type' in ( 'bool', 'boolean' ) then
            _value := to_jsonb( _conversion::boolean );
          else
            _value := to_jsonb( _conversion );
          end if;
        else _value := _i.value;
        end if;

        _obj := _obj || jsonb_build_object(
          _i.key,
          _value
          );

        if _obj is null then raise exception 'Object is null in {%:%} args: % base: %', _i.key, _i.value, args, colConfigs; end if;
        if _value is null then raise exception 'Object.value is null in {%:%} args: % base: %', _i.key, _i.value, args, colConfigs; end if;
        if jsonb_typeof(_value) = 'null' then raise exception 'Type Object.value is null in {%:%} args: % base: %', _i.key, _i.value, args, colConfigs; end if;
      end loop;
    return _obj;
  end;
end
$$;


create or replace function report.source_filter(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    _source text default args->>'source';
    _user uuid default args->>'user';
    _space uuid default args->>'space';
    _branch uuid default args->>'branch';
    _const map.constant;
  begin
    _const := map.constant();

    if _source = 'tweeks.posto' then
      return query
        with __posto as (
          select
              s.posto_id as id,
              s.posto_designacao as label
            from tweeks.posto s
            where s._branch_uid = _branch
        ) select to_jsonb( _p )
          from __posto _p;
    end if;

    if _source = 'auth.colaborador' then
      return query
        with __posto as (
          select
            s.colaborador_id as id,
            s.colaborador_nome as label
          from auth.colaborador s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.espaco' then
      return query
        with __posto as (
          select
            s.espaco_id as id,
            s.espaco_nome as label
          from tweeks.espaco s
          where s.espaco_branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'geoinfo.currency' then
      return query
        with __posto as (
          select
            s.currency_id as id,
            s.currency_code as label
          from geoinfo.currency s
          where currency_code in ( 'STN', 'EUR', 'USD' )
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.artigo' then
      return query
        with __posto as (
          select
            s.artigo_id as id,
            s.artigo_nome as label
          from tweeks.artigo s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'boolean|Y/N' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'SIM' )
          union all values ( false, 'NÃO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'boolean|ON/OFF' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'ATIVO' )
          union all values ( false, 'DESATIVO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'STATUS' then
      return query
        with __yes_no ( id, label ) as (
          values ( 0, 'DESATIVO' )
          union all values ( 1, 'ATIVO' )
          union all values ( 2, 'PENDENTE' )
          union all values ( -1, 'ANULADO' )
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'tweeks.toperacao' then
      return query
        with __posto as (
          select
            s.toperacao_id as id,
            s.toperacao_designacao as label
          from tweeks.toperacao s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;


    if _source = 'tweeks.tgroup' then
      return query
        with __tgroup as (
          select
            s.tgrupo_id as id,
            s.tgrupo_desc as label
          from tweeks.tgrupo s
        ) select to_jsonb( _p )
        from __tgroup _p;
    end if;

    if _source = 'tweeks.tpaga' then
      return query
        with __posto as (
          select
            s.tpaga_id as id,
            s.tpaga_designacao as label
          from tweeks.tpaga s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.cliente' then
      return query
        with __posto as (
          select
            s.cliente_id as id,
            s.cliente_titular as label
          from tweeks.cliente s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.fornecedor' then
      return query
        with __posto as (
          select
            s.fornecedor_id as id,
            s.fornecedor_nome as label
          from tweeks.fornecedor s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.tipoimposto' then
      return query
        with __source as (
          select
            s.tipoimposto_id as id,
            s.tipoimposto_codigo as label
          from tweeks.tipoimposto s
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.serie' then
      return query
        with __source as (
          select
            s.serie_id as id,
            format( '%s (%s)', ts.tserie_desc,  s.serie_numero) as label
          from tweeks.serie s
            inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tserie' then
      return query
        with __source as (
          select
            s.tserie_id as id,
            s.tserie_desc as label
          from tweeks.tserie s
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.caixa::estado' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_caixa_estado_ativo, 'ABERTA' )
          union all values ( _const.maguita_caixa_estado_fechado, 'FECHADA' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.lancamento::mode' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_lancamento_mode_automatic, 'AUTOMATICO' )
          union all values ( _const.maguita_lancamento_mode_manual, 'MANUAL' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tlancamento' then
      return query
        with __source( id, label ) as (
          select tlancamento_id, tlancamento_desc
            from tweeks.tlancamento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tmovimento' then
      return query
        with __source( id, label ) as (
          select tmovimento_multiplo, tmovimento_designacao
            from tweeks.tmovimento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

  end;
$$;

create or replace function report.columns(regclass)
  returns TABLE(column_name text, column_type text, column_basetype text, column_default text, is_array boolean, is_generated boolean)
  strict
  language sql
as
$$
select
    col.column_name::text,
    format_type( pt.oid, atttypmod )::text column_type,
    case
      when col.data_type = 'ARRAY' then format_type( pt.typelem, atttypmod )
      else format_type( pt.oid, atttypmod )
    end as column_basetype,
    col.column_default::text,
    col.data_type = 'ARRAY' as is_array,
    col.is_generated = 'ALWAYS' as is_generated
  from information_schema.columns col
         inner join report.source_map( $1 ) c on c.source_name = col.table_name
    and col.table_schema::regnamespace = c.source_schema::regnamespace
         inner join pg_attribute att on col.column_name = att.attname
    and att.attrelid = format( '%s.%s', col.table_schema, col.table_name )::regclass::oid
         inner join pg_type pt on att.atttypid = pt.oid
  where format('%s.%s', c.source_schema, c.source_name)::regclass = $1
$$;

`;