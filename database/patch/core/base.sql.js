"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
function base({ schema, _schema, sql }) {
    return sql `

create schema if not exists  ${schema};
create or replace function ${schema}.ref( file character varying, identifier character varying )
returns character varying
immutable
language sql as $$
  select 'ref:'||file||'//'||identifier
$$;

create table if not exists ${schema}.raw();
drop table if exists ${schema}._temp_raw_78564;
create table ${schema}._temp_raw_78564 as select * from ${schema}.raw;

create table if not exists ${schema}.revision();
drop table if exists ${schema}._temp_revision_78564;
create table ${schema}._temp_revision_78564 as select * from ${schema}.revision;


drop table if exists ${schema}.raw cascade;
drop table if exists ${schema}.revision cascade;

create table ${schema}.raw ( 
  raw_uid uuid default gen_random_uuid(),
  raw_text text not null,
  raw_match text not null,
  constraint pk_raw_id primary key ( raw_uid )
);

create table ${schema}.revision(
  file character varying,
  identifier character varying,
  ref character varying generated always as ( ${schema}.ref( file, identifier) ) stored,
  _raw_uid uuid,
  force int2 not null default 0,
  flags text[] not null default array[]::text[],
  configs jsonb not null default jsonb_build_object(),
  status int2 not null default 2,
  connection character varying,
  seq serial not null ,
  version int not null default 0,
  date timestamptz not null default current_timestamp,
  constraint fk_revision_to_raw foreign key ( _raw_uid ) references ${schema}.raw,
  constraint uk_ref_math primary key ( ref, _raw_uid, force )
);

select *
  from ${schema}._temp_raw_78564 rev
    inner join lib.sets_doc_in( '${schema}.raw'::regclass, to_jsonb( rev ) ) on true
    where (to_jsonb( rev )->>'raw_text') is not null
    and (to_jsonb( rev )->>'raw_match') is not null
;

select *
  from ${schema}._temp_revision_78564 rev
    inner join lib.sets_doc_in( '${schema}.revision'::regclass, to_jsonb( rev ) ) on true
  where (to_jsonb( rev )->>'_raw_uid') is not null
;

drop table if exists ${schema}._temp_revision_78564; 
drop table if exists ${schema}._temp_raw_78564;

select setval( '${schema}.revision_seq_seq', coalesce( max( seq )+1, 1), false )
    from ${schema}.revision;

drop function if exists  /*${_schema}*/ raw_of( text text ) cascade;
create or replace function /*${_schema}*/ raw_of( text text )
returns table( raw_uid uuid, raw_math text, raw_text text )
language plpgsql as $$
  declare
    _data ${schema}.raw;
  begin
    raw_of.raw_math :=  lib.str_normalize( text );
    raw_of.raw_text := text;
    select * into _data
      from ${schema}.raw r
      where r.raw_match = raw_of.raw_math;
    
    raw_of.raw_uid := _data.raw_uid;
    return next;
  end;
$$;

drop function if exists /*${_schema}*/ create_raw( text ) cascade;
create or replace function /*${_schema}*/ create_raw( text text )
returns table( raw_uid uuid, raw_math text, raw_text text )
language plpgsql as $$
  declare
    _data record;
    _raw ${schema}.raw;
  begin
    select * into _data from /*${_schema}*/ raw_of( text );
    create_raw.raw_text := _data.raw_text;
    create_raw.raw_math := _data.raw_math;
    create_raw.raw_uid := _data.raw_uid;
    
    if create_raw.raw_uid is null then
      insert into ${schema}.raw ( raw_text, raw_match ) values ( _data.raw_text, _data.raw_math )
      returning * into _raw;
      create_raw.raw_uid := _raw.raw_uid;
    end if;
    
    return next;
  end;
$$;


create or replace function /*${_schema}*/ revision( args jsonb )
returns lib.res
language plpgsql
as $$
  <<sys>>
  declare
    _file character varying default args->>'file';
    _identifier character varying default args->>'identifier';
    _ref character varying default ${schema}.ref(  _file, _identifier );
    _raw text not null default args->>'raw';
    _flags text[] default array( select lower( e.text ) from jsonb_array_elements_text( args->'flags' ) e( text ) );
    _configs jsonb default coalesce( args->'configs', jsonb_build_object() );
    _connection character varying default "current_user"();
    _patches ${schema}.revision;
    _error jsonb;
    _force boolean default '@force' = any( _flags );
    _force_number int default 0;
    _last record;
    _raw_instance record;
  begin
    raise notice '%', args;
    select * into _patches
      from ${schema}.revision p
      where p.ref = sys._ref
    order by
      p.seq desc
    limit 1;

    if _patches.ref is not null and '@unique' = any( _patches.flags ) and not _force then return lib.res_false('unique applied' ); end if;
    
    select * into _raw_instance from /* ${_schema} */ raw_of( _raw);
    
    select * into _last
        from ${schema}.revision p
        where p.ref = _ref
          order by p.version desc,  p.seq desc
        ;

    if _last.ref is not null and _raw_instance.raw_uid is not null and _last._raw_uid = _raw_instance.raw_uid and not _force then return lib.res_false('no changes' );
    elseif _last.ref is not null and _raw_instance.raw_uid is not null and _last._raw_uid = _raw_instance.raw_uid then
      _force_number := _last.force +1;

    end if;
    
    select * into _raw_instance
      from /* ${_schema} */ create_raw( _raw );

    
    insert into ${schema}.revision(
      file,
      identifier,
      _raw_uid,
      flags,
      configs,
      status,
      connection,
      version,
      force
    ) values (
     _file,
     _identifier,
     _raw_instance.raw_uid,
     _flags,
     _configs,
     1,
     _connection,
     coalesce( _patches.version, 0 ) +1,
     _force_number
   ) returning * into _patches;

    begin
      execute _raw_instance.raw_text;
    exception when others then
      <<_ex>>
      declare
        e text; m text; d text; h text; c text;
      begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        _error := jsonb_build_object(
          'state', e,
          'message', m
        );
      end;
    end;

    return lib.res_true( jsonb_build_object(
      'patches', _patches,
      'error', _error
    ));
  end;
$$;`;
}
exports.base = base;
//# sourceMappingURL=base.sql.js.map