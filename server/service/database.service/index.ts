import { PostgresFactory, Types, Result, Templates } from "zoo.pg";
export { PostgresFactory, Types, Result, Templates } from "zoo.pg";



export { DBK } from "../../global/autogen/DBK";

import {args} from "../../global/args";

const proxyFinder = ()=>{
    return new Proxy({}, {
        get(target, p, receiver) {
            if( target[ p ] === undefined ) target[ p ] = proxyFinder();
            return target[ p ];
        }
    });
}

export function debugResponse( response ){
    if( response?.row?.main?.error ) console.error( response, response?.row?.main?.error )
    if( response?.error?.context ) console.error( response );
    else if( response?.row?.error?.context ) console.error( response, response?.row?.error?.context );
    else if( response?.rows?.[ response?.rows?.length-1 ]?.error?.context ) console.error( response );
    else if( response?.rows?.[ 0 ]?.error?.context ) console.error( response );
    else if( response?.message?.context ) console.error( response );
}

export const factory = new PostgresFactory( {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUser,
    password: args.dbPassword,
} );

export const factoryClinic = new PostgresFactory( {
    host: args.dbHostClinic,
    port: args.dbPort,
    database: args.dbNameClinic,
    user: args.dbUserClinic,
    password: args.dbPasswordClinic,
} );

export const replicateFactory = new PostgresFactory( {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUserClone,
    password: args.dbPasswordClone,
} );
