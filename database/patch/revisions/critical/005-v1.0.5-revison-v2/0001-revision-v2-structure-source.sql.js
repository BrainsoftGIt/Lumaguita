"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "source", flags: ["@unique"] }).sql `
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
//# sourceMappingURL=0001-revision-v2-structure-source.sql.js.map