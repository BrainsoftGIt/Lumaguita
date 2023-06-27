truncate cluster.collector cascade;
truncate cluster.object cascade;
truncate cluster.break cascade ;
select *
from cluster.cluster;
update cluster.cluster
set cluster_version = 0,
    cluster_sequence = 0
where cluster_type != 1;
