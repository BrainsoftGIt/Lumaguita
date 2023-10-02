import {clusterServer} from "../../../service/cluster.service";
import {Ignore, Preparation} from "../../../lib/cluster/agents/RevisionAgent";
import {Cluster, ObjectRevision, RevisionRequest} from "../../../lib/cluster/types";
import {branchIgnore} from "../db/branch.ignore";

export type Branch = {
    branch_uid
    branch_tbranch_id
    branch_name
    branch_path:string
    branch_user
    branch_workspace
    branch_licence
    branch_grants
    branch_main_user
    branch_main_workspace
    branch_clusters:string[]
    branch_date
    branch_update
    branch_state
}

let conditionalIgnores = [
    'tweeks.branch',
    'auth.colaborador',
    'auth.acesso',
    'tweeks.espaco',
    'tweeks.cambio',
    'tweeks.trabalha'
];

type BranchPreparation = Preparation & {
    branchList: Branch[],
    clusters:Cluster[],
    local:Cluster,
    master:Cluster,
    child:Cluster,
    clusterPath:string[],
    clusterPathName:string,
    req: RevisionRequest
}

function prepareBranch ( req:RevisionRequest, local:Cluster, master:Cluster ){
    const clusterPath = req.request.cluster_path.split( "/" ).filter( value => value && value.length > 0 );
    // const result = await
    return branchIgnore( req ).then( result => {

        return Promise.resolve({
            local,
            master,
            req,
            clusterPath,
            clusterPathName: clusterPath.join( "/" ),
            ...result
        });
    }).catch( reason => console.error( reason ));
}

clusterServer.revision.registerRevisionIgnore( {
    evaluates: null,//conditionalIgnores,

    async prepare( rclass: string[], req: RevisionRequest, local: Cluster, master: Cluster, revs ): Promise<BranchPreparation> {
        return  prepareBranch( req, local, master );

    }, reject( prepared: BranchPreparation, rclass: string, obj: ObjectRevision): Ignore | false | void | null {

        let ignore:Ignore = { name: "@ignore/branch" }
        let _branch:Branch;
        if ( rclass === "tweeks.branch" )  _branch = obj.collector_metadata;
        else if( !obj.collector_metadata[ "_branch_uid" ] ) return;
        else _branch = prepared.branchList.find( value => value.branch_uid === obj.collector_metadata[ "_branch_uid" ] )

        if( !_branch ) return ignore;
        ignore.text = _branch.branch_name;
        ignore[ "cluster" ] = prepared.req.request.cluster_identifier;
        ignore[ "cluster-in" ] = _branch.branch_clusters.join( ", " );

        let branchPath = _branch.branch_path.split( "/" ).filter( value => value && value.length > 0 );
        let minPath = (prepared.clusterPath.length <= branchPath.length ? prepared.clusterPath.length: branchPath.length)-1;
        let branchBasePath = branchPath.filter( (value, index) => index <= minPath ).join( "/" )
        let branchPathName = branchPath.join( "/" )
        let clusterBasePath = prepared.clusterPath.filter( (value, index) => index <= minPath ).join( "/" );

        //TODO por agora vou ignorar todas as regras de caminho e avaliar pela igualdade
        if( !_branch.branch_clusters.includes( prepared.req.request.cluster_identifier ) ) return ignore;

    }, onRejected(rejection: Ignore, prepared: Preparation, rclass: string, obj: ObjectRevision) {

    }
});

clusterServer.revision.registerRevisionIgnore( {
    evaluates: [ "cluster.resource" ],

    async prepare( rclass: string[], req: RevisionRequest, local: Cluster, master: Cluster, revs ): Promise<BranchPreparation> {
        return  prepareBranch( req, local, master );

    }, reject( prepared: BranchPreparation, rclass: string, obj: ObjectRevision): Ignore | false | void | null {
        if( !this.evaluates.includes( obj._regclass ) ) return;
        if( !obj.collector_metadata?.resource_metadata?._branch_uid ) return;

        let ignore:Ignore = { name: "@ignore/branch/resource" }
        let _branch:Branch = prepared.branchList?.find( value => value?.branch_uid === obj.collector_metadata?.resource_metadata?._branch_uid  );

        if( !_branch ) return ignore;
        if( !_branch.branch_clusters.includes( prepared.req.request.cluster_identifier ) ) return ignore;

    }, onRejected(rejection: Ignore, prepared: Preparation, rclass: string, obj: ObjectRevision) {

    }
});