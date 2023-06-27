

create or replace function lib.sets_doc_in( regclass, doc jsonb default '{}'::jsonb, "with" jsonb default null )
returns setof text language plpgsql as $$
declare
  alias text default "with"->>'alias';
begin
  doc := coalesce( doc, '{}'::jsonb );
  alias := coalesce( nullif( trim( alias), '' ), 't' );

  return query execute(
    with __columns as (
        select
          col.column_name,
          format_type( pt.oid, atttypmod ) column_type,
          col.data_type = 'ARRAY' as is_array,
          col.column_default,
          col.is_generated = 'ALWAYS' as is_generated
        from information_schema.columns col
          inner join pg_class c on c.relname = col.table_name
            and col.table_schema::regnamespace = c.relnamespace
          inner join pg_attribute att on col.column_name = att.attname
            and att.attrelid = format( '%s.%s', col.table_schema, col.table_name )::regclass::oid
          inner join pg_type pt on att.atttypid = pt.oid
        where c.oid = $1

    ), __values as (
      select
          c.*,
          case
            when e.key is null and c.column_default is not null then 'default'
            when e.key is not null and jsonb_typeof( e.value ) = 'null' then format( 'null::%s', c.column_type )
            when e.key is not null then format( '%s::%s', case
              when c.column_type in ( 'json', 'jsonb' ) then e.literal_json
              else e.literal_text
            end, c.column_type )
            else 'null'
          end as value
        from __columns c
          left join lib.each( doc ) e on c.column_name = e.name
    ), __prepare as (
        select
            string_agg( quote_ident( v.column_name ), ', ' ) filter ( where not  v.is_generated ) as prepare_columns,
            string_agg( v.value, ', ' ) filter ( where not  v.is_generated ) as prepare_values
          from __values v
          where v.value is not null
    ) select
        case
          when p.prepare_columns is not null then
            --language=PostgreSQL
            format('insert into %s as %I ( %s ) values( %s ) returning ( %I.* )::text', $1, alias, p.prepare_columns, p.prepare_values, alias )
            --language=PostgreSQL
          else format( 'insert into %s as %I default values returning ( %I.* )::text', alias, alias )
        end
      from __prepare p
  );
end;
$$;


select array[ 'text'::text, 'ola', 'mundo', 'ola mundo' ] & 'ola'::text;

create table temp_simple(
  id serial,
  state int2 default 1
);

insert into temp_simple default values ;
select * from temp_simple;

select * from temp_simple;

select doc from lib.sets(null::temp_simple, '{ "id": 2, "state":[ 2, 3, 4, 5, 6, 1, 8, 9, 10 ]}', ref := '{"id":1}', "with" := '{ "lib.switch" : ["state"] }') doc;




create or replace function lib.sets_doc_up(
  regclass,
  doc jsonb default '{}'::jsonb,
  defaults text[] default array[]::name[],
  ref jsonb default null::jsonb,
  t_where text default null,
  "with" jsonb default null
)
returns setof text language plpgsql as $$
declare
  /**
    extension:[
      switch = lib.switch
    ]
   */
  _ref jsonb;
  statement text;
  _data record;
  _use_where text default '';
  "security" boolean default "with"->>'security';
  alias text default "with"->>'alias';
  lib_switch boolean default false;
  lib_switch_column text[] default array[]::text[];

begin
  "security" := coalesce( security, true );
  _ref := lib.sets_ref( $1, doc );
  _ref := coalesce( ref, _ref );

  if jsonb_typeof( "with"->'lib.switch' ) = 'boolean' then
    lib_switch := "with"->>'lib.switch';
  elseif jsonb_typeof( "with"->'lib.switch' ) = 'array' then
    lib_switch_column :=  array( select text from  lib.each( "with"->'lib.switch' ) where text is not null );
  end if;
  lib_switch := coalesce( lib_switch, false );

  if security and ( _ref is null or lib.jsonb_object_length( _ref ) = 0 ) then
    return;
  end if;

  defaults := coalesce( defaults, array[]::name[] );
  alias := coalesce( nullif( trim( alias ), '' ), 't' );
  doc := coalesce( doc, '{}'::jsonb );

  with __columns as (
      select
        col.column_name,
        format_type( pt.oid, atttypmod ) column_type,
        col.data_type = 'ARRAY' as is_array,
        col.column_default,
        col.is_generated = 'ALWAYS' as is_generated

      from information_schema.columns col
             inner join pg_class c on c.relname = col.table_name
        and col.table_schema::regnamespace = c.relnamespace
             inner join pg_attribute att on col.column_name = att.attname
        and att.attrelid = format( '%s.%s', col.table_schema, col.table_name )::regclass::oid
             inner join pg_type pt on att.atttypid = pt.oid
      where c.oid = $1
  ), __values as (
    select
        c.column_name,
        c.column_type,
        c.is_generated,
        r.name is not null as _in_ref,
        case
          when c.column_default is not null and d.name is not null then 'default'
          when e.key is not null and jsonb_typeof( e.value ) = 'null' then 'null'
          when e.key is not null and c.column_type in ( 'json', 'jsonb' ) then e.literal_json
          else e.literal_text
        end as value,
        jsonb_typeof( e.value ) = 'array' and not c.is_array and
          true in ( lib_switch, c.column_name = any( lib_switch_column ) )
        as use_swith,
        case
          when r.name is not null and c.column_type in ( 'json', 'jsonb' ) then r.literal_json::text
          when r.name is not null then r.literal_text
        end as ref_value
      from __columns c
        left join lib.each( doc ) e on c.column_name = e.name
        left join lib.each( _ref ) r on c.column_name = r.name
        left join unnest( defaults ) d( name ) on c.column_name = d.name
  ), __sets as (
    select
        v.*,
        v.value is not null as _in_value,
        case
          when not use_swith then format( '%I = %s::%s', v.column_name, v.value, v.column_type )
          else format( '%I = %s::%s', v.column_name, format( 'lib.switch( %I, variadic %s::%s[] )', v.column_name, v.value, v.column_type ), v.column_type )
        end as set
      from __values v
  )
  select
      count( * ) filter ( where s._in_ref ) as _keys,
      string_agg( format( e'   %I = %s::%s\n', s.column_name, s.ref_value, s.column_type ),  e' and ' ) filter ( where s._in_ref ) as _where,

      count( * ) filter ( where s._in_value and not s.is_generated ) as _changes,
      string_agg( format( '    %s', s.set ),          e',\n' ) filter ( where s._in_value and not s.is_generated ) as prepare_sets
      into _data
    from __sets s
    where true in ( s._in_ref, s._in_value )
  ;
  if _data._changes > 0 and ( _data._keys > 0 or not security ) then
    _use_where := case
      when _data._keys > 0 and t_where is null   then  format( e'  where\n %s', _data._where )
      when t_where is not null and  not security then  format( e'  where %s', t_where )
      else                                              format( e'  where false' ) -- don't update anything
    end;

    statement := format( e'update %s as %I set\n %s\n  %s\n  returning ( %I.* )::text', $1, alias, _data.prepare_sets, _use_where, alias );
    return query execute statement;
  end if;
end
$$;



create or replace function lib.sets_doc(
  regclass,
  doc jsonb default null,
  defaults name[] default null,
  ref jsonb default null,
  t_where text default null,
  "with" jsonb default null
)
returns table( sets text, action int, rows int8, operation text )
language plpgsql
as $$
declare
  _result record;
begin
  -- Try update first
  select array_agg( up.sets ) as sets, count( * ) as rows into _result
    from lib.sets_doc_up( $1, doc, defaults, ref, t_where, "with" ) up( sets )
  ;

  if _result.rows > 0 then
    return query
      select
          n.doc,
          0::int,
          _result.rows,
          'update'
        from unnest( _result.sets ) n( doc );
  else
    return query
      select
          ins.sets,
          1::int,
          _result.rows,
          'insert'
        from lib.sets_doc_in( $1, doc, "with" ) ins ( sets );
  end if;
end
$$;


create or replace function lib.sets(
  _row anyelement,
  replacer jsonb default null,
  defaults text[] default null,
  ref jsonb default null,
  t_where text default null,
  "with" jsonb default null
)
returns table( "returning" anyelement, action int, operation text )
language plpgsql
as $$
declare
  _regclass regclass default pg_typeof( _row )::text::regclass;
  _document jsonb;
begin
  select
      coalesce( jsonb_object_agg( e.key, e.value ), jsonb_build_object() ) into _document
    from jsonb_each( to_jsonb( _row ) ) e
    where jsonb_typeof( e.value ) != 'null'
  ;

  _document := _document || coalesce( replacer, jsonb_build_object() );

  --language=PostgreSQL
  return query execute format('
    select
        cast( iu.sets as %s ),
        iu.action,
        iu.operation
      from lib.sets_doc( $1, $2, $3, $4, $5, $6 ) iu
    ', _regclass) using _regclass, _document, defaults, ref, t_where, "with";
end
$$;

create or replace function lib.sets_up( _row anyelement,
  replacer jsonb default null,
  defaults text[] default null,
  ref jsonb default null,
  t_where text default null,
  "with" jsonb default null
)
returns table( "returning" anyelement, action int, operation text )
language plpgsql
as $$
declare
  _regclass regclass default pg_typeof( _row )::text::regclass;
  _document jsonb;
begin
  select
      coalesce( jsonb_object_agg( e.key, e.value ), jsonb_build_object() ) into _document
    from jsonb_each( to_jsonb( _row ) ) e
    where jsonb_typeof( e.value ) != 'null'
  ;

  _document := _document || coalesce( replacer, jsonb_build_object() );

  --language=PostgreSQL
  return query execute format($sql$
    select
        iu.sets::%s ,
        0,
        'update'
      from lib.sets_doc_up( $1, $2, $3, $4, $5, $6 ) iu( sets )
    $sql$, _regclass ) using _regclass, _document, defaults, ref, t_where, "with";
end
$$;


create or replace function lib.sets_in(
  _row anyelement,
  replacer jsonb default null,
  "with" jsonb default null
)
returns table( "returning" anyelement, action int, operation text )
language plpgsql
as $$
declare
  _regclass regclass default pg_typeof( _row )::text::regclass;
  _document jsonb;
begin
  select
      coalesce( jsonb_object_agg( e.key, e.value ), jsonb_build_object() ) into _document
    from jsonb_each( to_jsonb( _row ) ) e
    where jsonb_typeof( e.value ) != 'null'
  ;

  _document := _document || coalesce( replacer, jsonb_build_object() );

  --language=PostgreSQL
  return query execute format( $sql$
    select
        cast( iu.sets as %s ),
        1,
        'insert'
      from lib.sets_doc_in( $1,  $2, $3 ) iu ( sets )
    ;$sql$, _regclass ) using _regclass, _document, "with";
end
$$;

