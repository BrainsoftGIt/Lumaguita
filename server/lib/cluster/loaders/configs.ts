import {ClusterContext} from "../server";
import {Cluster} from "../types";


type ChangeConfigs = { new:Cluster, old:Cluster };

export class ClusterConfigsLoader {
    _server:ClusterContext;
    constructor(server: ClusterContext) {
        this._server = server;
    }

    async hasLocalChange( ): Promise<ChangeConfigs> {
        const newConfigs:Cluster = await this._server.service.loadLocalCluster();
        return this._hasChange( newConfigs, this._server.localCluster );
    }

    _hasChange( newConfigs:Cluster, oldConfigs:Cluster ):ChangeConfigs{
        const configs = { new: newConfigs, old: oldConfigs };
        const dif = ( !configs.old && configs.new ) || ( configs.old && !configs.new )
            || ( JSON.stringify( configs.old ) !== JSON.stringify( configs.new ) );

        if( !dif ) return { new: null, old: null };
        else return configs;
    }


    async loadChange(){
        return Promise.all([
            this.hasLocalChange(),
            this.hasMasterChange(),
            this._server.service.loadLocalCluster(),
            this._server.service.loadMasterCluster()
        ]).then( value => {
            let local = value[ 0 ];
            let master = value[ 1 ];
            let loadLocal = value[ 2 ];
            let loadMaster = value[ 3 ];



            if( !!local || !!master ){
                local = { new: local?.new || this._server.service.currentLocalCluster, old: local?.old };
                master = { new: master?.new || this._server.service.currentMasterCluster, old: master?.old };

               return  Promise.resolve({
                    master: master?.new,
                    local: local?.new,
                    connect:
                        master && master?.new
                        && local && local?.new
                        && master.new?.cluster_domain
                        && master?.new?.cluster_port
                        && master?.new?.cluster_api
                        && master?.new?.cluster_api?.length === 128,

                    changeConnect: master && master?.new
                        && local && local?.new && (
                            master.new?.cluster_domain !== master.old?.cluster_domain
                            || master?.new?.cluster_port !== master?.old?.cluster_port
                            || master?.new?.cluster_api !== master?.old?.cluster_api
                            || master?.new?.cluster_api?.length != master?.old?.cluster_api?.length
                        )
                })
            } else Promise.resolve( null );
        });
    }

    async hasMasterChange(){
        const newConfigs:Cluster = await this._server.service.loadMasterCluster()
        return this._hasChange( newConfigs, this._server.masterCluster );
    }
}