import {CompileDatabaseOpts} from "./db/install";
import { DBArgs } from "../server/global/args";

export function envStatus  ( args:DBArgs, status?:CompileDatabaseOpts ){
    console.log( `dbHost              := ${ args.dbHost }` );
    console.log( `dbPort              := ${ args.dbPort }` );
    console.log( `dbPortLocal         := ${ args.dbPortDatabaseApp }` );
    console.log( `dbUser              := ${ args.dbUser }` );
    console.log( `dbName              := ${ args.dbName }` );
    console.log( `dbMode              := ${ args.dbMode }` );
    console.log( `dbUserClone         := ${ args.dbUserClone }` );
    console.log( `dbSupperUser        := ${ args.dbSupperUser }` );
    console.log( `dbPassword          := ${ !!args.dbPassword }` );
    console.log( `dbPasswordClone     := ${ !!args.dbPasswordClone }` );
    console.log( `dbPasswordSuperUser := ${ !!args.dbPasswordSuperUser }` );
    if( !status ) return;

    console.log( `force               := ${ status.force }` );
    console.log( `create              := ${ status.create }` );
    console.log( `clean               := ${ status.clean }` );
    console.log( `grants              := ${ status.grants }` );
    console.log( `connection          := ${ status.connection }` );
}
