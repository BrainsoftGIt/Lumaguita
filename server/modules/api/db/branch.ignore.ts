import {factory} from "../../../service/database.service";
import {catchAll, Templates} from "zoo.pg";
import {Cluster, RevisionRequest} from "../../../lib/cluster/types";
import {Branch} from "../socket/cluster.socket.listener";
import {ClusterType} from "../../../lib/cluster/enuns";

export async function branchIgnore( req: RevisionRequest ) {
    let { sql } = factory.create(Templates.PARAMETERIZED);
    let branchList:Branch[] = (await catchAll(
        sql `select * from tweeks.branch`
    )).rows;

    sql = factory.create(Templates.PARAMETERIZED).sql;
    let clusters:Cluster[] =  (await catchAll(
        sql `select * from cluster.cluster`
    )).rows;


    sql = factory.create(Templates.PARAMETERIZED).sql;
    let child:Cluster =  (await catchAll(
        sql `
          select c.*
            from cluster.cluster c
            where c.cluster_identifier = ${ req.request.cluster_identifier }
              and c.cluster_type = ${ ClusterType.CHILD }
        ;`
    )).rows.find( (value, index) => index === 0 );

    return { branchList, clusters, child }
}