import {block} from "../../../../core/updater";

block( module, { identifier: "libdom", flags:[ ]}).sql`
--
-- PostgreSQL database dump
--

-- Dumped from database version 13.7 (Ubuntu 13.7-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.2

-- Started on 2023-01-05 19:40:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP TRIGGER IF EXISTS trigger_sync_domsync ON libdom.domsync;
DROP TRIGGER IF EXISTS sync_trigger ON libdom.entryset;
ALTER TABLE IF EXISTS ONLY libdom.entryset DROP CONSTRAINT IF EXISTS pk_name;
ALTER TABLE IF EXISTS ONLY libdom.domsync DROP CONSTRAINT IF EXISTS domsync_pkey;
DROP TABLE IF EXISTS libdom.domsync;
DROP FUNCTION IF EXISTS libdom.trigger_sync_entry();
DROP FUNCTION IF EXISTS libdom.trigger_sync_domsync();
DROP FUNCTION IF EXISTS libdom.sync_entry(name name, classtype regtype);
DROP FUNCTION IF EXISTS libdom.sync_drop(name name, classtype regtype);
DROP FUNCTION IF EXISTS libdom.set(name name, value character varying, label character varying, domain character varying, force boolean);
DROP FUNCTION IF EXISTS libdom.rebuild(clean boolean);
DROP FUNCTION IF EXISTS libdom.prefix(VARIADIC prefix character varying[]);
DROP TABLE IF EXISTS libdom.entryset;
DROP FUNCTION IF EXISTS libdom.get(arg_name name);
DROP FUNCTION IF EXISTS libdom.exports(schema_name character varying, VARIADIC name character varying[]);
DROP FUNCTION IF EXISTS libdom.entry_list(args jsonb);
DROP FUNCTION IF EXISTS libdom.entry_drop(arg_name name, arg_dropforce boolean);
DROP FUNCTION IF EXISTS libdom.entry(name name, type regtype, val anyelement, domain character varying, label character varying, editable boolean, comment character varying, force boolean);
DROP FUNCTION IF EXISTS libdom.domsync(classname character varying, columnname character varying, domain character varying);
DROP FUNCTION IF EXISTS libdom.domain_of(domain character varying, value text);
DROP FUNCTION IF EXISTS libdom.domain_of(name name);
DROP FUNCTION IF EXISTS libdom.domain_document(VARIADIC prefix character varying[]);
DROP FUNCTION IF EXISTS libdom.domain(VARIADIC prefix character varying[]);
DROP FUNCTION IF EXISTS libdom.describe(VARIADIC prefix character varying[]);
DROP FUNCTION IF EXISTS libdom.constant_document(VARIADIC prefix character varying[]);
DROP FUNCTION IF EXISTS libdom.constant(VARIADIC prefix character varying[]);
DROP FUNCTION IF EXISTS libdom.columns(regclass);
DROP FUNCTION IF EXISTS libdom.api_load_entryset(args jsonb);
DROP FUNCTION IF EXISTS libdom.api_change_entryset(args jsonb);
DROP TYPE IF EXISTS libdom.domain;
DROP TYPE IF EXISTS libdom.constant;
DROP SCHEMA IF EXISTS libdom;
--
-- TOC entry 9 (class 2615 OID 295045)
-- Name: libdom; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA libdom;


--
-- TOC entry 783 (class 1247 OID 295048)
-- Name: constant; Type: TYPE; Schema: libdom; Owner: -
--

CREATE TYPE libdom.constant AS ( );




--
-- TOC entry 786 (class 1247 OID 295051)
-- Name: domain; Type: TYPE; Schema: libdom; Owner: -
--

CREATE TYPE libdom.domain AS ( );



--
-- TOC entry 272 (class 1255 OID 295052)
-- Name: api_change_entryset(jsonb); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.api_change_entryset(args jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    essa funcao server para editar uma entrada editavel
   */
  name name default args->>'name';
  value varchar default args->>'value';
  label varchar default args->>'label';
  domain varchar default args->>'domain';
begin
  return libdom.set( name, value, label, domain, false );
end;
$$;


--
-- TOC entry 273 (class 1255 OID 295053)
-- Name: api_load_entryset(jsonb); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.api_load_entryset(args jsonb) RETURNS SETOF jsonb
    LANGUAGE sql
    AS $$
  select to_jsonb( e )
    from libdom.entryset e
    where e.editable
    order by e.domain nulls last,
      e.label,
      e.name,
      e.value

$$;


--
-- TOC entry 326 (class 1255 OID 295718)
-- Name: columns(regclass); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.columns(regclass) RETURNS TABLE(name character varying, type character varying, defaults text, isarray boolean, isgenerated boolean)
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $_$
with __columns as (
  select
    col.column_name,
    format_type( pt.oid, atttypmod )::varchar column_type,
    col.column_default,
    col.data_type = 'ARRAY' as is_array,
    col.is_generated = 'ALWAYS' as is_generated
  from information_schema.columns col
         inner join pg_class c on c.relname = col.table_name
    and col.table_schema::regnamespace = c.relnamespace
         inner join pg_attribute att on col.column_name = att.attname
    and att.attrelid = format( '%s.%s', col.table_schema, col.table_name )::regclass::oid
         inner join pg_type pt on att.atttypid = pt.oid
  where c.oid = $1
) select *
from __columns _c
$_$;


--
-- TOC entry 270 (class 1255 OID 295054)
-- Name: constant(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.constant(VARIADIC prefix character varying[] DEFAULT '{}'::character varying[]) RETURNS libdom.constant
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$
  /**
    Essa função serve para carregar os valores das constante e inicia-la
   */
  select jsonb_populate_record( null::libdom.constant, libdom.constant_document( variadic prefix ));
$$;


--
-- TOC entry 271 (class 1255 OID 295055)
-- Name: constant_document(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.constant_document(VARIADIC prefix character varying[] DEFAULT '{}'::character varying[]) RETURNS jsonb
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$
  -- Devolver o mapeamento dos estados
   select
      jsonb_object_agg( cv.name, cv.value )
    from libdom.prefix( variadic prefix ) cv
;
$$;


--
-- TOC entry 295 (class 1255 OID 295085)
-- Name: describe(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.describe(VARIADIC prefix character varying[] DEFAULT NULL::character varying[]) RETURNS TABLE(declaration text, name name, type regtype, value text, domain character varying, label character varying, editable boolean, comment character varying)
    LANGUAGE sql IMMUTABLE
    AS $$
-- Devolver o mapeamento dos estados
  select
      format( '%I %s default %L::%s;', cv.name, cv.type, cv.value, cv.type ),
      cv.*
    from libdom.prefix(  variadic prefix ) cv
$$;


--
-- TOC entry 274 (class 1255 OID 295057)
-- Name: domain(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.domain(VARIADIC prefix character varying[] DEFAULT '{}'::character varying[]) RETURNS libdom.domain
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$
      /**
        Essa função serve para carregar os valores das constante e inicia-la
       */
  select jsonb_populate_record( null::libdom.domain, libdom.domain_document( variadic prefix ));
$$;


--
-- TOC entry 275 (class 1255 OID 295058)
-- Name: domain_document(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.domain_document(VARIADIC prefix character varying[] DEFAULT '{}'::character varying[]) RETURNS jsonb
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$
  -- Devolver o mapeamento dos estados
  select
      jsonb_object_agg( cv.name, cv.label )
    from libdom.prefix( variadic prefix ) cv
  ;
$$;


--
-- TOC entry 276 (class 1255 OID 295059)
-- Name: domain_of(name); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.domain_of(name name) RETURNS text
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$

  /**
      Essa função serve para devolver o valor especifico de uma constante
   */
  select cv.label
    from libdom.entryset cv
    where cv.name = domain_of.name;
$$;


--
-- TOC entry 277 (class 1255 OID 295060)
-- Name: domain_of(character varying, text); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.domain_of(domain character varying, value text) RETURNS text
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$

  /**
      Essa função serve para devolver o valor especifico de uma constante
   */
  select cv.label
    from libdom.entryset cv
    where cv.name = domain_of.domain
      and cv.value = domain_of.value;
$$;


--
-- TOC entry 330 (class 1255 OID 295719)
-- Name: domsync(character varying, character varying, character varying); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.domsync(classname character varying, columnname character varying, domain character varying) RETURNS SETOF text
    LANGUAGE plpgsql
    AS $_$
declare
  _comment record;
  _domsync record;
  _command text;
begin
  for _domsync in
    with __column_comment as (
      select
          ds.classname,
          ds.columnname,
          array_agg( ds.domain ) as _domain,
          format( '<ul>%s</ul>',
            string_agg( format( '<li>%s ->> %s</li>', ds.domain, ds.comment ), e'\\n' ) filter ( where ds.comment is not null )
          ) as comment
        from libdom.domsync ds
          inner join libdom.columns( ds.classname::regclass ) c on ds.columnname = c.name
        where ds.classname = coalesce ( $1, ds.classname )
          and ds.columnname = coalesce( $2, ds.columnname )
          and ds.domain = coalesce( $3, ds.domain )
        group by ds.classname, ds.columnname
    ) select *
        from __column_comment cc
        where domsync.domain = any ( cc._domain ) or domsync.domain is null
  loop
      select
          format( '<table><tr><th>lable</th><th>value</th><th>domain</th><th>name</th></tr>%s</table>', string_agg( format( '<tr>%s %s %s %s </tr>',
            format( '<td>%s</td>', es.label ),
            format( '<td>%s</td>', es.value ),
            format( '<td>%s</td>', es.domain ),
            format( '<td>%s</td>', es.name )
          ), e'\\n' ) ) as comment
          into _comment
        from libdom.entryset es
        where es.domain = any ( _domsync._domain );

      _command := format( 'comment on column %s.%I is $comment$ %s $comment$;', _domsync.classname, _domsync.columnname, format( e'<html><style>
table, th, td {
  border:1px solid black;
}
</style><body><div>%s\\n%s</div></body></html>', _domsync.comment, _comment.comment ) );
      execute _command;
      return next _command;
  end loop;
end
$_$;


--
-- TOC entry 278 (class 1255 OID 295061)
-- Name: entry(name, regtype, anyelement, character varying, character varying, boolean, character varying, boolean); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.entry(name name, type regtype, val anyelement, domain character varying DEFAULT NULL::character varying, label character varying DEFAULT NULL::character varying, editable boolean DEFAULT false, comment character varying DEFAULT NULL::character varying, force boolean DEFAULT false) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  /**
    * Essa função serve para registrar o valor de uma constante na base de dados
    * Se a constante já tiver o valor definido esse valor pode ser subistituido
      pelo novo desde que o parametro arg_entryset_replace estiver verdadeiro
    * Caso existir sem o parametro arg_entryset_replace verdadeiro uma excessão sera lançada
   */
  _entryset libdom.entryset;

begin

  editable := coalesce( editable, false );

  if domain is null and exists(
    select *
      from libdom.entryset e
      where e.domain = entry.domain
        and e.name != entry.name
        and e.value = val::text
  ) and not force then
    raise exception 'Já existe um dominio com o mesmo valor para este grupo!';
  end if;

  select * into _entryset
    from libdom.entryset const
    where const.name = entry.name
  ;


  -- Deletar o valor de constante
  delete from libdom.entryset e where e.name = entry.name;

  -- Recriar o valor de constante
  insert into libdom.entryset(
    name,
    type,
    value,
    editable,
    label,
    comment,
    domain
  ) values (
     entry.name,
     entry.type,
     entry.val,
     entry.editable,
     entry.label,
     entry.comment,
     entry.domain
   ) returning * into _entryset;
  return true;
end;
$$;


--
-- TOC entry 289 (class 1255 OID 295062)
-- Name: entry_drop(name, boolean); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.entry_drop(arg_name name, arg_dropforce boolean DEFAULT false) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  /**
    * Essa função serve para registrar o valor de uma constante na base de dados
    * Se a constante já tiver o valor definido esse valor pode ser subistituido
      pelo novo desde que o parametro arg_entryset_replace estiver verdadeiro
    * Caso existir sem o parametro arg_entryset_replace verdadeiro uma excessão sera lançada
   */
  _entryset libdom.entryset;
  command text;
  arg_entryset_continer regtype := 'libdom.constant'::regtype;
begin
  arg_dropforce := coalesce( arg_dropforce, false );
  select * into _entryset
    from libdom.entryset const
    where const.name = arg_name
  ;

  -- Destruir a constante casao existir
  if arg_dropforce then
    command := format( 'alter type %s drop attribute if exists %I cascade;', arg_entryset_continer, arg_name );
  else
    command := format( 'alter type %s drop attribute if exists %I;', arg_entryset_continer, arg_name );
  end if;
  execute command;

  -- Deletar o valor de constante
  delete from libdom.entryset where name = arg_name;

  return true;
end;
$$;


--
-- TOC entry 331 (class 1255 OID 315924)
-- Name: entry_list(jsonb); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.entry_list(args jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  _name character varying default args->>'name';
  _value character varying default args->>'value';
  _domain character varying default args->>'domain';
  _label character varying default args->>'label';
begin
  return query
    with __entry as (
      select
          es.name,
          es.type,
          es.value,
          es.domain,
          es.label
        from libdom.entryset es
        where es.name = coalesce( _name, es.name )
          and es.value = coalesce( _value, es.value )
          and coalesce( es.domain, '' ) = coalesce( _domain, es.domain, '' )
          and coalesce( es.label, '' ) = coalesce( _label, es.label, '' )
      ) select to_jsonb( _e )
          from __entry _e
          order by _e.domain,
            _e.label,
            _e.name,
            _e.value
  ;
end;
$$;


--
-- TOC entry 290 (class 1255 OID 295063)
-- Name: exports(character varying, character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.exports(schema_name character varying DEFAULT 'libdom'::character varying, VARIADIC name character varying[] DEFAULT ARRAY[]::character varying[]) RETURNS TABLE(name character varying, type regtype, value text, declaration text)
    LANGUAGE sql
    AS $_$
with names as (
  select array_agg( distinct coalesce( un, '')||'%' ) as list
  from unnest( $2 ) un
)
  select
    cv.name,
    cv.type,
    cv.value,
    format( 'select %I.entry(name := %L, type := %L::regtype, val := %L::text, domain := %L::varchar, label := %L, editable := %L, comment := %L );',
            schema_name,
            cv.name,
            cv.type,
            cv.value,
            cv.domain,
            cv.label,
            cv.editable,
            cv.comment
      )
  from libdom.entryset cv inner join names na on true
  where cv.name like any( na.list )
$_$;


--
-- TOC entry 291 (class 1255 OID 295064)
-- Name: get(name); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.get(arg_name name) RETURNS text
    LANGUAGE sql IMMUTABLE PARALLEL SAFE
    AS $$

  /**
      Essa função serve para devolver o valor especifico de uma constante
   */
  select cv.value
    from libdom.entryset cv
    where cv.name = arg_name;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 295065)
-- Name: entryset; Type: TABLE; Schema: libdom; Owner: -
--

CREATE TABLE libdom.entryset (
    name name NOT NULL,
    type regtype NOT NULL,
    value text NOT NULL,
    domain character varying,
    label character varying,
    editable boolean DEFAULT false NOT NULL,
    comment character varying
);


--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE entryset; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON TABLE libdom.entryset IS 'Essa entidade serve para armazenar os valores das constantes';


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.name; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.name IS 'Corresponde ao nome da constante';


--
-- TOC entry 3156 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.type; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.type IS 'Corresponde ao tipo da constante';


--
-- TOC entry 3157 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.value; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.value IS 'Corresponde ao valor da constante';


--
-- TOC entry 3158 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.label; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.label IS 'Corresponde a descrição da constante';


--
-- TOC entry 3159 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.editable; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.editable IS 'Esse atributo indica se a constante pode ser editavel';


--
-- TOC entry 3160 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN entryset.comment; Type: COMMENT; Schema: libdom; Owner: -
--

COMMENT ON COLUMN libdom.entryset.comment IS 'Commentario para a constante';


--
-- TOC entry 292 (class 1255 OID 295072)
-- Name: prefix(character varying[]); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.prefix(VARIADIC prefix character varying[] DEFAULT '{}'::character varying[]) RETURNS SETOF libdom.entryset
    LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE
    AS $$
declare
  _prefix varchar[];
  _length int default coalesce( array_length( prefix, 1), 0 );
begin
  select array_agg( format( '%s%%', e.element ) ) into _prefix
  from unnest( coalesce( prefix, '{}'::text[] ) ) e ( element );

  return query
    select e.*
    from libdom.entryset e
    where e.name like any( _prefix )
       or _length = 0
  ;
end;
$$;


--
-- TOC entry 327 (class 1255 OID 295073)
-- Name: rebuild(boolean); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.rebuild(clean boolean) RETURNS SETOF text
    LANGUAGE plpgsql
    AS $$
declare
  _data record;
  _const libdom.constant;
  _dom libdom.domain;
  command text;
  constant_class regtype default 'libdom.constant'::regtype;
  domain_class regtype default 'libdom.domain'::regtype;
begin

  -- Lipar todos os atributos atual nas classe de dominio e de constant
  if clean then
    for _data in
      select *
        from jsonb_each (to_jsonb( _const ))
    loop
      command := format( 'alter type %s drop attribute if exists %I', _data.key, constant_class );
      execute command;
    end loop;

    for _data in
      select *
        from jsonb_each (to_jsonb( _dom ))
    loop
      command := format( 'alter type %s drop attribute if exists %I', _data.key, domain_class);
      execute command;
    end loop;

  end if;

  -- Recriar todos os atributos para a classe de dominio e de constant
  for _data in
    select *
      from libdom.entryset e
  loop
    return next to_jsonb( _data )::text;
    return query select * from libdom.sync_entry( _data.name, 'libdom.constant' );
    return query select * from libdom.sync_entry( _data.name, 'libdom.domain' );
  end loop;
  
  return query select * from libdom.domsync( null, null, null );
end;
$$;


--
-- TOC entry 293 (class 1255 OID 295074)
-- Name: set(name, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.set(name name, value character varying DEFAULT NULL::character varying, label character varying DEFAULT NULL::character varying, domain character varying DEFAULT NULL::character varying, force boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
      Essa função serve para atualizar o valor de uma constante
   */
  _entryset libdom.entryset;
begin

  if domain is null and exists(
      select *
      from libdom.entryset e
      where e.domain = set.domain
        and e.name != set.name
        and e.value = set.value::text
    ) and not force then
    return jsonb_build_object(
      'result', false,
      'message', 'Já existe um dominio com o mesmo valor para este grupo!'
    );
  end if;

  if !exists(
    select *
      from libdom.entryset e
      where e.name = set.name
        and e.editable
  ) then
    return jsonb_build_object(
        'result', false,
        'message', 'Não existe uma entrada editavel com este nome!'
      );
  end if;

  update libdom.entryset
    set ( value, label, domain ) = ( value, label, domain )
    where name = name
    returning * into _entryset
  ;

  return jsonb_build_object(
    'result', true,
    'data', jsonb_build_object(
      'entryset', _entryset
    )
  );
end;
$$;


--
-- TOC entry 294 (class 1255 OID 295075)
-- Name: sync_drop(name, regtype); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.sync_drop(name name, classtype regtype) RETURNS SETOF text
    LANGUAGE plpgsql
    AS $$
declare
  command text;
begin
  command := format( 'alter type %s drop attribute if exists %I', classtype, name );
  execute command;
end;
$$;


--
-- TOC entry 328 (class 1255 OID 295076)
-- Name: sync_entry(name, regtype); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.sync_entry(name name, classtype regtype) RETURNS SETOF text
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Syncronizar uma entry em na calsse expecificada
   */
  command text;
  _entry libdom.entryset;
  _type regtype default 'text'::regtype;
begin

  select * into _entry
    from libdom.entryset e
    where e.name = sync_entry.name;

  if classtype = 'libdom.constant'::regtype then
    _type := _entry.type;
  end if;

  -- Destruir a constante casao existir
  command := format( 'alter type %s drop attribute if exists %I;', classtype, name );
  execute command;
  return next command;

  -- Recriar a constante novamente
  command := format( 'alter type %s add attribute %I %s;', classtype, name, _type );
  execute command;
  return next command;

  if _entry.comment is not null then
    command := format( 'comment on column %s.%I is %L;', classtype, name, _entry.comment );
    execute command;
    return next command;
  end if;
end;
$$;


--
-- TOC entry 329 (class 1255 OID 295734)
-- Name: trigger_sync_domsync(); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.trigger_sync_domsync() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new libdom.domsync;
  _old libdom.domsync;
begin
  if tg_op in ( 'UPDATE', 'INSERT' ) then
    perform libdom.domsync( _new.classname, _new.columnname, _new.domain );
  end if;
end;
$$;


--
-- TOC entry 296 (class 1255 OID 295077)
-- Name: trigger_sync_entry(); Type: FUNCTION; Schema: libdom; Owner: -
--

CREATE FUNCTION libdom.trigger_sync_entry() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new libdom.entryset;
  _old libdom.entryset;
begin
  _new := new;
  _old := old;


  if tg_op = 'UPDATE' and _new.name != _old.name then
    perform libdom.sync_drop( _old.name, 'libdom.constant' );
    perform libdom.sync_drop( _old.name, 'libdom.domain' );
  end if;

  if tg_op in ( 'INSERT', 'UPDATE' ) and (
    coalesce( _new.name::text, '' ) != coalesce( _old.name::text, '' )
    or coalesce( _new.type::text, '' ) != coalesce( _old.type::text, '' )
    or coalesce( _new.comment::text, '' ) != coalesce( _old.comment::text, '' )
  ) then
    perform libdom.sync_entry( _new.name, 'libdom.constant' );
    perform libdom.sync_entry( _new.name, 'libdom.domain' );
    perform libdom.domsync( null, null, _new.domain );
  end if;

  if tg_op in ( 'DELETE'  ) then
    perform libdom.sync_drop( _old.name, 'libdom.constant' );
    perform libdom.sync_drop( _old.name, 'libdom.domain' );
    return null;
  end if;


  if tg_op in ( 'INSERT', 'UPDATE' ) then
    return _new;
  end if;
end;
$$;


--
-- TOC entry 227 (class 1259 OID 295708)
-- Name: domsync; Type: TABLE; Schema: libdom; Owner: -
--

CREATE TABLE libdom.domsync (
    classname character varying NOT NULL,
    columnname character varying NOT NULL,
    domain character varying NOT NULL,
    comment text,
    CONSTRAINT domsync_classname_check CHECK (((classname)::regclass IS NOT NULL))
);

--
-- TOC entry 2998 (class 2606 OID 295716)
-- Name: domsync domsync_pkey; Type: CONSTRAINT; Schema: libdom; Owner: -
--

ALTER TABLE ONLY libdom.domsync
    ADD CONSTRAINT domsync_pkey PRIMARY KEY (classname, columnname);


--
-- TOC entry 2996 (class 2606 OID 295079)
-- Name: entryset pk_name; Type: CONSTRAINT; Schema: libdom; Owner: -
--

ALTER TABLE ONLY libdom.entryset
    ADD CONSTRAINT pk_name PRIMARY KEY (name);


--
-- TOC entry 2999 (class 2620 OID 295080)
-- Name: entryset sync_trigger; Type: TRIGGER; Schema: libdom; Owner: -
--

CREATE TRIGGER sync_trigger AFTER INSERT OR DELETE OR UPDATE ON libdom.entryset FOR EACH ROW EXECUTE FUNCTION libdom.trigger_sync_entry();


--
-- TOC entry 3000 (class 2620 OID 295735)
-- Name: domsync trigger_sync_domsync; Type: TRIGGER; Schema: libdom; Owner: -
--

CREATE TRIGGER trigger_sync_domsync AFTER INSERT OR UPDATE ON libdom.domsync FOR EACH ROW EXECUTE FUNCTION libdom.trigger_sync_domsync();


-- Completed on 2023-01-05 19:41:10

--
-- PostgreSQL database dump complete
--

`;


block( module, { identifier:"libdom_describle", flags:[ ]} ).sql`

drop function if exists libdom.describe(prefix character varying[]);

create or replace function libdom.describe(VARIADIC prefix character varying[] DEFAULT NULL::character varying[])
  returns TABLE(
    declaration text,
    name name,
    type regtype,
    value text,
    domain character varying,
    label character varying,
    editable boolean,
    comment character varying,
    "default" character varying
  ) immutable
  language sql
as
$$
-- Devolver o mapeamento dos estados
  select
      format( '%I %s default %L::%s;', cv.name, cv.type, cv.value, cv.type ),
      cv.*,
      format( 'libdom.get(%L::name)::%s', cv.name, cv.type )
    from libdom.prefix(  variadic prefix ) cv
$$;
`;

block( module, { identifier: "tg_dom_sync"}).sql`
create or replace function libdom.trigger_sync_domsync() returns trigger
  language plpgsql
as
$$
declare
  _new libdom.domsync;
  _old libdom.domsync;
begin
  if tg_op in ( 'UPDATE', 'INSERT' ) then
    perform libdom.domsync( _new.classname, _new.columnname, _new.domain );
  end if;
  return null;
end;
$$;
`;