import {catchAll, catchLast, Templates, Types} from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";

export function functRegCluster(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'cluster.sets_clusters_admin', ${paramn}, ${  args.appMode})`
    );
}
export function functUnlinkAndLiknk(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'cluster.unlink_cluster', ${Types.jsonb(paramn)}, ${  args.appMode})`
    );
}
export function functChangeClusterLicense(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'cluster.sets_cluster_license', ${Types.jsonb(paramn)}, ${  args.appMode})`
    );
}
export function functLoadClusters(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'cluster.load_clusters', ${paramn}, ${  args.appMode}) data`
    );
}