create or replace function cluster.add( args jsonb default null )
returns setof cluster.collector
language plpgsql as $$
declare
  /**
    PROPOSE: Efetuar uma varedura completa nas tabelas verificação por modificações
      diferente das últimas que foram versionadas e colletalas para que sejas versionadas

    args := {
      regclass:[]
    }
   */
  _regclass regclass[] default array( select e.text::regclass from jsonb_array_elements_text( args->'regclass')e ( text ) );
begin
  if array_length( _regclass, 1 )  = 0 then _regclass := null; end if;

  return query
    with __foregin_key as (
      select
        tc.constraint_name,
        format( '%s.%s', tc.table_schema, tc.table_name )::regclass as local_table,
        kcu.column_name as local_column,
        format( '%s.%s',  ccu.table_schema, ccu.table_name )::regclass as foreign_table,
        ccu.column_name AS foreign_column_name
      from
        information_schema.table_constraints tc
          join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
          and  tc.table_schema = kcu.table_schema
          join information_schema.constraint_column_usage ccu on ccu.constraint_name = tc.constraint_name
          and ccu.table_schema = tc.table_schema
      where tc.constraint_type = 'FOREIGN KEY'
    ), __share as (
      select
        local_table,
        s.share_regclass,
        array_agg( foreign_table ),
        count( * ) as depencies,
        count( * ) filter ( where foreign_table = local_table ) as self
      from __foregin_key fk
        inner join cluster.share s on fk.local_table = s.share_regclass
      where s.share_regclass = any ( coalesce(_regclass, array[ s.share_regclass ]))
      group by local_table,
        s.share_regclass
    )
    select (cluster.__add( s.share_regclass )).*
      from __share s
      order by
        case
          when s.depencies = 0 then 1
          when s.depencies = s.self then 2
          else 3
        end,
        s.depencies,
        s.self
  ;
end;
$$;

drop function if exists cluster.commit( args jsonb );
create or replace function cluster.commit( args jsonb )
returns setof cluster.version
language plpgsql as $$
declare
  /**
    PROPOSE: Versionar tadas as modificações ocoridas na tabala já coletada
   */
begin

  return query
    with __foregin_key as (
      select
        tc.constraint_name,
        format( '%s.%s', tc.table_schema, tc.table_name )::regclass as local_table,
        kcu.column_name as local_column,
        format( '%s.%s',  ccu.table_schema, ccu.table_name )::regclass as foreign_table,
        ccu.column_name AS foreign_column_name
      from
        information_schema.table_constraints tc
          join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
          and  tc.table_schema = kcu.table_schema
          join information_schema.constraint_column_usage ccu on ccu.constraint_name = tc.constraint_name
          and ccu.table_schema = tc.table_schema
      where tc.constraint_type = 'FOREIGN KEY'
    ), __share as (
      select
        local_table,
        s.share_regclass,
        array_agg( foreign_table ),
        count( * ) as depencies,
        count( * ) filter ( where foreign_table = local_table ) as self
      from __foregin_key fk
        inner join cluster.share s on fk.local_table = s.share_regclass
      group by local_table,
        s.share_regclass
    )
    select (cluster.__create_object_version( s.share_regclass )).*
      from __share s
      order by
        case
          when s.depencies = 0 then 1
          when s.depencies = s.self then 2
          else 3
        end,
        s.depencies,
        s.self
  ;
end;
$$;

drop function if exists cluster.__add( _regclass regclass );
create or replace function cluster.__add( _regclass regclass )
returns setof cluster.collector
language plpgsql as $$
declare
  /**
    PROPOSE: Coletar nova modificação ocoridas numa tabela que ainda não foram versionadas,
      coletadas ou que a versão esteje ultrapassadas
   */
  _share cluster.share;
  _statement text;
begin
  select s.* into _share
    from cluster.share s
    where s.share_regclass = _regclass
  ;

  -- language=PostgreSQL
  _statement :=  $sql$
    with
      __unvercollector as (
        select
          uvcol.*,
          rank() over ( partition by uvcol.collector_ref order by uvcol.collector_sequence desc ) as rank
        from cluster.collector uvcol
        where not uvcol.collector_version
          and uvcol.collector_share_regclass = ($1::cluster.share).share_regclass
      ), __object as (
        select
            o.*,
            rank() over ( partition by o.object_ref order by o.object_seq desc ) as rank
          from cluster.object o
          where o.object_share_regclass = ($1::cluster.share).share_regclass
      ), __change as (
        select
            to_jsonb( _t ) as change,
            lib.sets_ref( to_jsonb( _t ), ($1::cluster.share).share_pks ) as ref
          from _$table as _t
      ), __news as (
        select _c.*, coalesce( uvcol.collector_metadata, vcol.collector_metadata ) as collector_metadata
          from __change _c
            left join  __object _ol on _ol.object_ref = _c.ref
              and _ol.rank = 1
            left join cluster.collector vcol on vcol.collector_uid = _ol.object_collector_uid
            left join __unvercollector uvcol on not uvcol.collector_version
              and uvcol.rank = 1
              and uvcol.collector_share_regclass = ( $1::cluster.share ).share_regclass
              and uvcol.collector_ref = _c.ref
        where (vcol.collector_uid is null or vcol.collector_metadata != _c.change)
          and ( uvcol.collector_uid is null or uvcol.collector_metadata != _c.change )
      ) select col.*
          from __news _n
            inner join cluster.__collect_change(
              ( $1::cluster.share ).share_regclass,
              _n.change,
              _n.collector_metadata,
              case when _n.collector_metadata is null then 'I' else 'U' end,
              ref
            ) col on true
  $sql$;

  _statement := replace( _statement, '_$table'::text, _regclass::text );
  return query execute _statement using _share;
end;
$$;
