alter table cluster.cluster add cluster_code character varying default cluster.__generate_cluster_code();
update cluster.cluster set cluster_code = default where true;
update cluster.cluster set cluster_code = '000' where cluster_path = '/' and cluster_name = 'ROOT';


drop table if exists cluster.sequence;
create table cluster.sequence(
  name character varying not null,
  sub character varying default null,
  sequence int8 not null default 0,
  steep int not null,
  lpad int not null default 0,
  lpad_char char not null default '',
  zerobase boolean not null default false,
  constraint pk_cluster_sequence_id primary key ( name, sub )
);

