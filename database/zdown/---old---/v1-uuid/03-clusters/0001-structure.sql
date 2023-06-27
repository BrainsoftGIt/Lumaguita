select map.constantdrop( name) from map.describe('cluster_tree_location')

select map.constant( 'cluster_tree_position_trunc', 'int2', 1 );
select map.constant( 'cluster_tree_position_branch', 'int2', 2 );
select map.constant( 'cluster_grant_revision_child', 'character varying', 'revision_child'::text );
select map.constant( 'cluster_grant_revision_sub_path', 'character varying', 'revision_sub_path'::text );


drop table if exists cluster.cluster cascade ;
create table cluster.cluster(
  cluster_uid uuid not null default public.uuid_generate_v4(),
  cluster_identifier character varying default null,
  cluster_type int2,
  cluster_path character varying,
  cluster_name character varying not null,
  cluster_domain character varying,
  cluster_port character varying,
  cluster_key character varying,
  cluster_api character varying,
  cluster_pid int,
  cluster_version int8 not null default 0,
  cluster_sequence int8 not null default 0,
  constraint pk_cluster_id primary key ( cluster_uid )
);
alter table cluster.cluster drop if exists cluster_send;
alter table cluster.cluster drop if exists cluster_receive;
alter table cluster.cluster add  if not exists cluster_grants character varying[ ] not null default array[ ]::text[];
alter table cluster.cluster add  if not exists cluster_configs jsonb not null default jsonb_build_object();
alter table cluster.cluster add cluster_tree  int2 not null default map.get('cluster_tree_position_branch' )::int2;


alter table cluster.cluster drop cluster_remote;
select cluster_remote from cluster.cluster;


create table cluster.users(
                            user_default regrole not null,
                            user_replication regrole default null
);

alter table cluster.share add share_pks name[] generated always as ( lib.sets_pks_array( share_regclass ) ) stored;
drop table cluster.share;
create table cluster.share(
                            share_regclass character varying not null,
                            share_insert boolean not null default true,
                            share_update boolean not null default true,
                            share_checker regprocedure,
                            share_triggers name [],
                            share_pks name[],
                            constraint pk_share_regclass primary key ( share_regclass ),
                            constraint ck_share_as_primary_key check ( coalesce( array_length( share_pks, 1 ), 0) > 0  )
);

drop table cluster.version cascade;
create table cluster.version(
                              version_uid uuid not null default public.uuid_generate_v4(),
                              version_share_regclass character varying not null,
                              version_cluster_id uuid not null,
                              version_number int8 not null default 0,
                              constraint pk_version_uid primary key ( version_uid ),
                              constraint fk_version_to_share foreign key ( version_share_regclass ) references cluster.share,
                              constraint fk_version_to_cluster foreign key ( version_cluster_id ) references cluster.cluster,
                              constraint uk_version_share_cluster unique ( version_share_regclass, version_cluster_id )
);


drop table cluster.collector cascade;
create table cluster.collector(
                                collector_transuid uuid not null default cluster.__transaction_uid(),
                                collector_uid uuid not null default gen_random_uuid(),

                                collector_share_regclass character varying,
                                collector_cluster_origin uuid,
                                collector_sequence serial8,
                                collector_order int8,
                                collector_minseq int8,
                                collector_maxseq int8,
                                collector_ref jsonb,
                                collector_metadata jsonb,
                                collector_old jsonb,
                                collector_date timestamptz default current_timestamp not null,
                                collector_version boolean default false not null,
                                collector_pid int8 default pg_backend_pid(),
                                collector_operation character,
                                constraint pk_collector_uid primary key ( collector_uid, collector_transuid, collector_share_regclass, collector_cluster_origin ),
                                constraint fk_collector_to_share foreign key ( collector_share_regclass ) references cluster.share
);



comment on column cluster.collector.collector_ref  is 'Correspondem as chaves de acesso ao objecto real';
comment on column cluster.collector.collector_metadata is 'São os dados do proprio objecto real';

drop table cluster.object cascade ;
create table cluster.object(
                             object_transuid uuid not null default cluster.__transaction_uid(),
                             object_uid uuid not null default gen_random_uuid(),
                             object_share_regclass character varying,
                             object_cluster_origin uuid,
                             object_cluster_receiver uuid,
                             object_collector_uid uuid,
                             object_ref jsonb not null,
                             object_seq serial8 not null,
                             object_sseq serial8 not null,
                             object_originver int8 not null,
                             object_originsver int8 not null,
                             object_origincver int8 not null,
                             object_originsseq int8 not null ,
                             object_originrev int8 not null,
                             object_date timestamptz default current_timestamp not null,
                             object_instant timestamptz not null default clock_timestamp(),
                             object_receiver timestamptz not null default clock_timestamp(),
                             object_sync boolean not null default true,
                             constraint pk_object_id primary key ( object_uid, object_share_regclass, object_cluster_origin ),
                             constraint fk_objecto_to_share foreign key ( object_share_regclass ) references cluster.share
);

comment on column cluster.object.object_seq is 'Corresponde a sequencia da ordem de entrada do objecto independente da origem e da regclass';
comment on column cluster.object.object_sseq is 'Corresponde a sequencia de entrada do objecto na tabela independentemente da origem';
comment on column cluster.object.object_uid is 'Identificador unico do objecto';
comment on column cluster.object.object_share_regclass  is 'Correspone a tabela na qual o objecto pertense';
comment on column cluster.object.object_cluster_origin  is 'Corresponde ao cluster/maquina/pc na qual foi responsavel pela criação do objecto';
comment on column cluster.object.object_cluster_receiver  is 'Corresponde ao cluster/maquina/pc na qual recebeu-se o objecto';
comment on column cluster.object.object_originver is 'Versão global do objecto';
comment on column cluster.object.object_originsver  is 'Versão do share (table/regclss) as criar o objecto';
comment on column cluster.object.object_origincver  is 'Versão em que o cluster que criou o objecto';
comment on column cluster.object.object_originsseq  is 'Numero de sequencia dentro do share';
comment on column cluster.object.object_originrev is 'Reivisao, ordem de mofificação ocorrida no objecto original';
comment on column cluster.object.object_date is 'Corresponde ao instante em que foi criado a versão do objecto';

--// Constant tcluster
select map.constant( 'cluster_tcluster_local', 'int2', 1, 'Is current cluster' );
select map.constant( 'cluster_tcluster_master', 'int2', 2, 'Is master cluster of this current cluster' );
select map.constant( 'cluster_tcluster_remote', 'int2', 3, 'Is another cluster without direct link' );
select map.constant( 'cluster_tcluster_child', 'int2', 4, 'Is child cluster of current cluster' );


--// Constant treplication
select map.constant( 'cluster_treplication_replicate', 'int2', 1 );
select map.constant( 'cluster_treplication_readonly', 'int2', 2 );


