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

select * from report.mask;


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

select * from report.var;


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

`;
