import {args} from "../../global/args";

const { server } = require( '../web.service' );
const { K } = require( '../../global/autogen/K' );

import { Server } from "socket.io";

export const io = new Server( server, {
    path : "/MGT",
});


({
    [ K.RUN_LOCATION_LOCAL ] : ()=>{
        console.log( "K.RUN_LOCATION_LOCAL" );
        // io.set( 'origins', '*:*' );
    },
    [ K.RUN_LOCATION_SERVER ] : ()=>{
        console.log( "K.RUN_LOCATION_SERVER" );

    }
})[ args.appLocation ]( );

({
    http: ()=>{
        console.log( "SOCKET http" );
    },
    https: ()=>{
        console.log( "SOCKET https" );
    }
})[ args.webProtocol ]( );

