import {PostgresClusterService} from "../../lib/cluster/services/psql-service";
import {factory, replicateFactory} from "../database.service";

export const pgClusterService = new PostgresClusterService(  replicateFactory,  factory);

export function currentCluster(){
    return pgClusterService.localCluster();
}