drop function if exists cluster.__collect_change(regclass, _change jsonb, _old jsonb, _operation character, _ref jsonb);
drop function if exists cluster.__collect_change(regclass, _change jsonb, _old jsonb, _operation character, _ref jsonb, boolean );

create or replace function cluster.__collect_change(
    regclass,
    _change jsonb, _old jsonb DEFAULT NULL::jsonb, _operation character DEFAULT 'I'::bpchar,
    _ref jsonb DEFAULT NULL::jsonb,
    _force boolean default  false
) returns setof cluster.collector
  language plpgsql
as
$$
declare
  _collector cluster.collector;
  _origin uuid default '00000000-0000-0000-0000-000000000000'::uuid;
begin
  if not _force and _change is null then return; end if;
  if not _force and _old is not null and _change = _old then return; end if;

  _collector.collector_share_regclass := cluster.__format( $1 );
  _collector.collector_metadata := _change;
  _collector.collector_changes := array(
    select e.key
      from jsonb_each( _change||coalesce( _old, jsonb_build_object() ) ) e( key, value )
      where _old isnull
        or _change -> ( e.key ) != _old ->( e.key )
  );

  _collector.collector_changevalue = (
    select jsonb_object_agg( e.key, e.value )
    from jsonb_each( _change||coalesce( _old, jsonb_build_object() ) ) e( key, value )
    where _old isnull
       or _change -> ( e.key ) != _old ->( e.key )
  );

  insert into cluster.collector(
    collector_share_regclass,
    collector_metadata,
    collector_metaapply,
    collector_changevalue,
    collector_changes,
    collector_cluster_origin,
    collector_old,
    collector_originold,
    collector_operation,
    collector_ref
  ) values (
    _collector.collector_share_regclass,
    _collector.collector_metadata,
    _collector.collector_metadata,
    _collector.collector_changevalue,
    _collector.collector_changes,
    _origin,
    _old,
    _old,
    coalesce( _operation, case
      when _old is null then 'I'
      else 'U'
    end),
    _ref
  ) returning * into _collector;

  return next _collector;
end;
$$;