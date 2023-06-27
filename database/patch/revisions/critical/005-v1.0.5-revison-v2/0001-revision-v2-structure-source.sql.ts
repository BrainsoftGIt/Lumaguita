import {block} from "../../../core/updater";

block( module, { identifier: "source", flags:["@unique"] }).sql`
drop table if exists cluster.source;
create table cluster.source (
  source_uid         uuid               not null
    constraint pk_source_id
      primary key,
  source_cluster_uid uuid
    constraint fk_spurce_to_cluster
      references cluster.cluster,
  source_branch_uid  uuid
    constraint fk_source_to_branch
      references cluster.branch,
  source_name        varchar,
  source_client          boolean,
  source_server         boolean,
  source_status      smallint default 1 not null,
  constraint uk_source_cluster_branch
    unique (source_cluster_uid, source_branch_uid)
);

alter table source
  owner to maguita_dev;


`;