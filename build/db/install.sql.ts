import * as escape from 'pg-escape';
import { DBArgs} from "../../server/global/args";
import {CompileDatabaseOpts} from "./install";

export function createUserDatabase( args:DBArgs, opts?:CompileDatabaseOpts ){
    if( !opts ) opts = {
        create: true,
        force: false
    }

    let dbUser = escape.ident( args.dbUser );
    let dbUserClone = escape.ident( args.dbUserClone );
    let dbName = escape.ident( args.dbName );
    let lName = escape.literal( args.dbName );
    let _w = escape.literal( args.dbPasswordClone );

    let commands = [];
    if( opts.force ){
        //language=PostgreSQL
        commands.push(
            `select pg_terminate_backend( pg_stat_activity.pid ) from pg_stat_activity where pg_stat_activity.datname = ${ lName } and pid != pg_backend_pid()`,
            `drop database if exists ${ dbName }`,
            `drop user if exists ${ dbUser }`,
            `drop user if exists ${ dbUserClone }`,
        )
    }

    //language=PostgreSQL
    commands.push(
        `create user ${ dbUser } with password ${ escape.literal( args.dbPassword ) }`,
        `create user ${ dbUserClone} with superuser password ${ _w }`,
        `create database ${ dbName } with owner ${ dbUser }`,
        `alter user ${ dbUser } set search_path to tweeks, public, opr`,
        `alter user ${ dbUserClone } set search_path to tweeks, public, opr`,
        `alter user ${ dbUser } set timezone to 'Africa/Sao_Tome'`,
        `alter user ${ dbUserClone } set timezone to 'Africa/Sao_Tome'`
    );
    return commands;
}
