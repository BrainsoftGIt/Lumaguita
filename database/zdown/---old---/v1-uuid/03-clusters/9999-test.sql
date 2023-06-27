
truncate cluster.cluster cascade;
truncate cluster.version cascade;
truncate cluster.collector cascade;
truncate cluster.object cascade;



vacuum verbose analyze;

select cluster.__collect_change( ve.TABLEOID, to_jsonb( ve), null, 'I' )
  from old_tweeks.venda ve;

truncate cluster.share cascade;

select c.collector_reference,
       o.object_transuid,
        c.collector_transuid,
       o.object_originver as ver,
       o.object_origincver as cver,
       o.object_originsseq as sseq,
       o.object_originsver as sver,
       o.object_originrev as rev,
       o.object_date::time as time
from cluster.object o
       inner join cluster.collector c on o.object_collector_uid = c.collector_uid
where c.collector_reference? 'venda_id'
order by c.collector_reference, o.object_date;


--// create version in old venda
alter table old_tweeks.venda disable trigger tg_venda_after_insert_create_movimento;
alter table old_tweeks.venda disable trigger tg_venda_after_update_adjust_agrega_estado;
alter table old_tweeks.venda disable trigger tg_venda_after_update_adjust_conta_montante;
alter table old_tweeks.venda disable trigger tg_venda_after_update_create_or_cansel_movimento;


insert into cluster.share ( share_regclass, share_insert, share_update )
select 'old_tweeks.venda', true, true
  where not exists(
    select *
      from cluster.share
      where share_regclass ='old_tweeks.venda'::regclass
    )
returning *;

select * from cluster.collector;
select * from cluster.object;

select setval('cluster.object_object_seq_seq', 1, false );
select setval('cluster.collector_collector_sequence_seq', 1, false );
truncate cluster.cluster cascade;
truncate cluster.version cascade;
truncate cluster.collector cascade;
truncate cluster.object cascade;

update old_tweeks.venda set venda_id = venda_id
where true;

-- e403f284-421a-4a9d-b425-90d56e12a273, clusteruid: 00000000-0000-0000-0000-000000000000;

-- 42875;
select * from cluster.collector;
select * from cluster.object;

select * from __obj;

do $$
declare
begin
  raise notice 'ctime:% sttime:% now: %', clock_timestamp(), statement_timestamp(), now();
  perform pg_sleep( 1 );
  raise notice 'ctime:% sttime:% now: %', clock_timestamp(), statement_timestamp(), now();
  perform pg_sleep( 1 );
  raise notice 'ctime:% sttime:% now: %', clock_timestamp(), statement_timestamp(), now();
end;
$$;

select pg_size_pretty( pg_table_size( '__obj') ),
       pg_size_pretty( pg_relation_size( '__obj') ),
       pg_size_pretty( pg_relation_size( '__obj') ),
       pg_size_pretty( pg_table_size( '__obj') );

create table __obj as
with __object as (
  select
      o.object_share_regclass as _table,
      o.object_ref as ref,
      o.object_seq as seq,
      o.object_originrev as orev,
      o.object_originsseq as oseq,
      o.object_origincver as ocver,
      o.object_originver as over,
      o.object_originsver as osver,
      rank() over ( partition by o.object_ref order by o.object_seq desc ) as rank,
      min( o.object_seq ) over ( partition by o.object_ref ) as minseq
    from cluster.object o
) select
    array[
      o._table,
      o.ref,
      o.seq,
      o.orev,
      o.oseq,
      o.ocver,
      o.over,
      o.osver,
      o.minseq
    ]::text[]
    from __object o
    where o.rank = 1
      and o.seq >= 0
;



update tweeks.conta set conta_id = conta_id
where true;
update tweeks.venda set venda_id = venda_id
where true;
update tweeks.conta set conta_id = conta_id
where true;


with
  __collector as(
    select
      c.*,
--             min( c.collector_sequence ) over () as _collector_minseq,
--             max( c.collector_sequence ) over () as _collector_maxseq,
      row_number() over ( order by c.collector_sequence ) as _collector_order --,
--             lib.sets_ref( coalesce( c.collector_old, c.collector_metadata ), _share.share_pks ) as _collector_ref
    from cluster.collector c
    where not c.collector_version
      and c.collector_share_regclass = _regclass
--             and c.collector_cluster_origin = _origin
--             and c.collector_pid = _pid
      and c.collector_reference is null
  )
    ,
  __use_collector as (
    update cluster.collector c
      set
        collector_version = true /*,
              collector_cluster_origin = _cluster.cluster_id,
              collector_reference = c1._collector_ref,
              collector_order = c1._collector_order,
              collector_minseq = c1._collector_minseq,
              collector_maxseq = c1._collector_maxseq*/
      from __collector _c1
      where /*not c.collector_version
          and c.collector_share_regclass = _regclass
          and c.collector_reference is null
          and */
          c.collector_uid = _c1.collector_uid
      --           and c.collector_pid = _pid
--           and c.collector_cluster_origin = _origin
      returning
        c.collector_uid --,
--           c.collector_sequence,
--           c.collector_minseque,
--           c.collector_maxseque,
--           c.collector_share_regclass,
--           c.collector_reference,
--           c.collector_metadata,
--           c.collector_date,
--           c.collector_uid,
--           _data.object_localsharesequence + ( c.collector_sequence - c.collector_minseque +1 ) as _object_originsseq
  )
--       ,__creat_object as (
--         insert into cluster.object (
--           object_share_regclass,
--           object_cluster_origin,
--           object_cluster_receiver,
--           object_originver,
--           object_originsver,
--           object_origincver,
--           object_originsseq,
--           object_originrev,
--           object_collector_uid
--         ) select
--               _regclass,
--               _object.object_cluster_origin,
--               _object.object_cluster_receiver,
--               _dc.collector_sequence,
--               _version.version_number,
--               _cluster.cluster_version,
--               _dc._object_originsseq,
--               count( col.collector_uid )+1,
--               _dc.collector_uid
--             from __delete_collector  _dc
--               left join cluster.collector col on  _dc.collector_reference = col.collector_reference
--                 and _dc.collector_uid != col.collector_uid
--             group by
--               _regclass,
--               _object.object_cluster_origin,
--               _object.object_cluster_receiver,
--               _version.version_number,
--               _dc._object_originsseq,
--               _dc.collector_sequence,
--               _dc.collector_reference,
--               _dc.collector_metadata,
--               _dc.collector_uid
--             order by _dc.collector_sequence
--       )

select * into _discard
from __use_collector
;





