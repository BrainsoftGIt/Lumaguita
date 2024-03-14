import {io} from "../socket.service";

import {ClusterContext} from "../../lib/cluster";
import {registerLine} from "../ioline.service";

import {ClusterEvent} from "../../lib/cluster/enuns";
import {Jump} from "../../lib/cluster/listeners/route.listener";
import {colors} from "../../lib/cluster/colors";
import * as path from "path";
import {app} from "../web.service";
import * as fs from "fs";
import {Folders} from "../../global/project";
import {args} from "../../global/args";
import {pgClusterService} from "./pg-cluster-service";


// const masterDomain = args.appSelfMaster? `http://127.0.0.1:${ args.appPort }`
//     : args.appMasterDomain? args.appMasterDomain
//     : `http://${ args.webDomain }:80`;

export const clusterServer = new ClusterContext( pgClusterService, io, {
    namespace: "/cluster",
    namespaceChecker: "/cluster/checker",
    masterDomain: args.appSelfMaster,
    resource: Folders.share,
    revisionsLimit: 1000,
    //language=file-reference
    resource_404: path.join( __dirname, "../../resources/000-404.png" ),
    resourceMountPoint: Folders.mnt,
    path: "/MGT"
});



app.use( "/storage", clusterServer.res.listen() );

(async ()=>{ await clusterServer.create(); })()








registerLine( "cluster:/?", ()=> clusterServer.navigator.describe( "all" ) );
registerLine( "cluster:/", ()=> clusterServer.navigator.describe( "all" ) );
registerLine( "cluster:/clients", ()=> clusterServer.navigator.describe( "client" ) );
registerLine( "cluster:/servers", ()=> clusterServer.navigator.describe( "server" ) );
registerLine( "cluster:/configs", ()=> {
    const _local = clusterServer.localCluster;
    const _master = clusterServer.masterCluster;
    console.table([
        { type: "Master", id :  _master.cluster_identifier, name: _master.cluster_name, path: _master.cluster_path, grants: _master.cluster_grants },
        { type: "Local", id :   _local.cluster_identifier, name: _local.cluster_name, path: _local.cluster_path, grants: _local.cluster_grants },
    ])
});

const table = ( title:string, data:any)=>{
    console.log( colors.title( title ) );
    console.table( data );
}

const generate = () => {
    const min = 1000;
    const max = 9999;
    return Math.trunc( (Math.random() * (max - min)) + min );
}


registerLine( "cluster:/broadcast", ( line )=>{
    clusterServer.navigator.route.jumps.forEach( (receiver:Jump) => {
        let code = generate()
        clusterServer.navigator.start( ClusterEvent.BROADCAST, {
            cluster_identifier: receiver.id,
            cluster_name: receiver.name
        }, code );
        console.log( `EMIT BROADCAST TO ${colors.identifier( receiver.id )} WITH CODE ${ code }`);
    });
});

const findCandidate = ( idx ) => {
    return clusterServer.navigator.route.jumps.find( (value, index) => {
        return idx && (
            idx === value.id || index === Number( idx )
        )
    });
}

registerLine( "cluster:/ping", ( command, line, ...args )=>{
    const code = generate();
    const receiver = findCandidate( args.shift() )

    if( !receiver ){
        console.log( "NO PING CANDIDATE DISCOVER" );
        return;
    }
    clusterServer.navigator.start( ClusterEvent.PING, {
        cluster_identifier: receiver.id,
        cluster_name: receiver.name
    }, code );
    console.log( `EMIT PING TO ${colors.identifier( receiver.id )} WITH CODE ${ code }`);
});

registerLine( "cluster:/message", ( command, line, ...args )=>{
    const code = generate();
    const receiver = findCandidate( args.shift() );

    if( !receiver ){
        console.log( "NO MESSAGE CANDIDATE DISCOVER" );
        return;
    }
    let message = args.join( " " );
    clusterServer.navigator.start( ClusterEvent.MESSAGE, {
        cluster_identifier: receiver.id,
        cluster_name: receiver.name
    }, code, message );
    console.log( `EMIT MESSAGE TO ${colors.identifier( receiver.id )} WITH CODE ${ code }`);
});


registerLine( "cluster:/routes", ( )=> clusterServer.navigator.route.describe() );
registerLine( "cluster:/direct", ( )=> table( `DIRECT JUMP OF ${ clusterServer.id }`, clusterServer.navigator.route.jumps.filter(value => value.linkType === "DIRECT")));
registerLine( "cluster:/remote", ( )=> table( `REMOTES JUMP OF ${ clusterServer.id }`, clusterServer.navigator.route.jumps.filter(value => value.linkType === "REMOTE")));


registerLine( "cluster:/test-file", ( command, line, ...args )=>{

    let _file = args.join( " " );
    _file = _file.trim();

    let basename = path.basename( _file );
    let fileData = fs.readFileSync( _file );

    clusterServer.res.create( {
        resource_subpath: "simple-test/image",
        resource_name: `tatakae-${basename}`,
        resource_metadata: {
            _branch_uid: "e99f4d1d-53e8-4652-83b1-c754b75406cf"
        },
    }).then( value => {
        fs.writeFileSync( value.resolve , fileData );
        clusterServer.notifyLocalChange( {event: "NEW RESOURCE FILES" })
        // console.log( `EMIT AVAILABLE RESOURCE ${colors.identifier( receiver.id )} WITH CODE ${ code }`);
    });

});