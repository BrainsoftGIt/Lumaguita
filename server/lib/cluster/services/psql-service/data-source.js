"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGClusterSource = void 0;
const result_1 = require("zoo.pg/lib/result");
const zoo_pg_1 = require("zoo.pg");
function resolveRow(promise) {
    return new Promise(((resolve) => {
        promise.then(value => {
            resolve(value);
        }).catch(reason => {
            console.log(reason);
            resolve(null);
        });
    }));
}
function resolveAll(promise) {
    return promise.then(value => {
        return Promise.resolve(value);
    }).catch(reason => {
        console.error(reason);
        return Promise.resolve();
    });
}
class PGClusterSource {
    constructor(factoryCluster) {
        this.factory = factoryCluster;
    }
    _get_cluster_local() {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster._get_cluster_local()
        `));
    }
    load_resource_pendent(source) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
            select * from cluster.load_resources_pendents( ${zoo_pg_1.Types.jsonb(source)} ) data;
        `.stream(row => {
                rows.push(row["data"]);
            }).finally(() => {
                resolve(rows);
            });
        });
    }
    sets_resources_downloaded(resObj) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.sets_resources_downloaded( ${zoo_pg_1.Types.jsonb(resObj)})
        `));
    }
    switch_remote_connection(active) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.switch_remote_connection( ${zoo_pg_1.Types.jsonb({
            cluster_remote: active
        })})
        `));
    }
    sets_cluster_machine_id(machineConfigs) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.sets_cluster_machine_id( ${zoo_pg_1.Types.jsonb(machineConfigs)})
        `));
    }
    _get_cluster(source) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster._get_cluster( ${zoo_pg_1.Types.varchar(source.cluster_identifier)} )
        `));
    }
    ;
    _get_cluster_master() {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster._get_cluster_master()
        `));
    }
    ;
    _cluster_accept_child(arg) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster._cluster_accept_child( ${zoo_pg_1.Types.jsonb(arg)} ) result
        `));
    }
    ;
    sets_cluster_configs(clustersList) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.sets_cluster_configs( ${zoo_pg_1.Types.jsonb({ "clusters": clustersList })} ) status
        `));
    }
    ;
    create_resource(arg) {
        return resolveAll((0, zoo_pg_1.catchAll)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.create_resource( ${zoo_pg_1.Types.jsonb(arg)} )
        `)).then(value => Promise.resolve(value.rows))
            .catch(reason => {
            console.error(reason);
            return Promise.reject(null);
        });
    }
    ;
    sets_cluster_remote(clustersList) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.sets_cluster_remote( ${zoo_pg_1.Types.jsonb({ "clusters": clustersList })} ) status
        `));
    }
    ;
    sets_cluster_tree_position(clusterPosition) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.sets_cluster_tree_position( ${zoo_pg_1.Types.jsonb(clusterPosition)})
              `)).then(value => Promise.resolve(value.row));
    }
    ;
    status() {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.status( ${zoo_pg_1.Types.jsonb({})} ) status
        `));
    }
    accept_revision(arg) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.accept_revision( ${zoo_pg_1.Types.jsonb(arg)} ) status
        `));
    }
    can_send_revision(arg) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.can_send_revision( ${zoo_pg_1.Types.jsonb(arg)} ) can_send
        `));
    }
    accept_remote_cluster(arg) {
        return resolveRow((0, result_1.catchFirst)(this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
          select * from cluster.accept_remote_cluster( ${zoo_pg_1.Types.jsonb(arg)} ) status
        `));
    }
    ;
    cluster_push(args) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
            select * from cluster.push( ${zoo_pg_1.Types.jsonb(args)} ) data;
        `.stream(row => {
                rows.push(row["data"]);
            }).finally(() => {
                resolve(rows);
            });
        });
    }
    ;
    load_clusters_configs_to_child(clusterChild) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
            select * from cluster.load_clusters_configs_to_child( ${zoo_pg_1.Types.jsonb(clusterChild)} ) data;
        `.stream(row => {
                rows.push(row["data"]);
            }).finally(() => {
                resolve(rows);
            });
        });
    }
    ;
    clusterPullFrom(args) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.pull( ${zoo_pg_1.Types.jsonb(args)} ) data;
            `.stream(row => {
                rows.push(row["data"]);
            }).finally(() => {
                const status = rows.pop();
                const revisions = rows;
                const res = {
                    status,
                    revisions
                };
                resolve(res);
            });
        });
    }
    ;
    load_clusters_local_as_remotes(source) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.load_clusters_local_as_remotes( ${zoo_pg_1.Types.jsonb(source)} ) data;
            `.stream(row => {
                rows.push(row["data"]);
            }).finally(() => {
                resolve(rows);
            });
        });
    }
    load_cluster_by_namespace(namespace) {
        return new Promise(resolve => {
            const rows = [];
            this.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql `
              select * from cluster.load_cluster_by_namespace( ${zoo_pg_1.Types.varchar(namespace)} ) data;
            `.stream(row => {
                resolve(row);
            }).finally(() => {
                resolve(null);
            });
        });
    }
}
exports.PGClusterSource = PGClusterSource;
//# sourceMappingURL=data-source.js.map