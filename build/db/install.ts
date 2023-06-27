import path from "path";
import fs from "fs";
import {processListen} from "../../server/lib/utils/process/listen";
import {psql} from "../../server/lib/postgres/tools/psql";
import {DBArgs} from "../../server/global/args";
import {Connection, ConnectionsLevel, connFactory} from "./conn";
import tmp from "tmp";


import {postgresqlPrepare} from "../../server/lib/postgres/tools";
import {envStatus} from "../status";

export type ToTempFileOpt = {
    base:string,
    extension?:string
}
export function toSQLTempFile(str:string[], opts?:ToTempFileOpt ){
    let _default = path.join( process.cwd(), `${Math.trunc( Math.random() * 898965 )}` );
    if( !opts ) opts = { base: _default };
    if( !opts.base ) opts.base = _default;
    if( !fs.existsSync( opts.base ) )  fs.mkdirSync( opts.base, { recursive: true } );
    let fName;
    if( !opts.extension ) opts.extension = "";
    else if( opts.extension.charAt(0) !== "." ) opts.extension = `.${opts.extension}`;
    let _path;

    while ( !fName ){
        fName = `${Math.trunc( Math.random() * 998874 )}`;
        fName = `${fName}${opts.extension}`;
        _path = path.join( opts.base, fName );
        if( fs.existsSync( _path ) ){
            fName = null;
            _path = null
        }
    }
    str = str.map( value => {
        value = value.trim();
        if( value.charAt( value.length-1 ) !== ";" ) value+=";";
        return value;
    })

    let text = str.join( "\n" );
    fs.writeFileSync( _path, text );

    return {
        file: _path,
        base: opts.base,
        name: fName,
        extension: opts.extension
    }
}

export type CompileDatabaseOpts = {
    force?:boolean,
    create?:boolean,
    clean?:boolean,
    menu?:boolean,
    grants?:boolean,
    showCommandOnly?:boolean
    connection?:keyof typeof connFactory|string
}
export async function compileDatabase( args:DBArgs, opts?:CompileDatabaseOpts ){
    envStatus( args, opts );

    if( !opts ) opts = {
        create: true,
        force: false,
        clean: true,
        menu: true,
        grants: true,
        connection: "local"
    }
    if( !args ) args = require("../../server/global/args").args;

    let connection:ConnectionsLevel;

    connection = connFactory[ opts.connection||"local" ]( args );
    let { app, superMode, superModeApp } = connection;

    const pexec = async ( file, connection:Connection, _console= true ) =>{
        let next = { ...connection.args };
        next.file = file;
        if( opts.showCommandOnly ){
            const prepare = postgresqlPrepare( next, connection.options );
            console.log( "psql ", prepare.args.join( " " ) );
            return;
        }
        next.file = file;
        return processListen( psql( next, connection.options ),{
            console:_console,
        });
    }

    let tempDir = tmp.dirSync({
        prefix: "compile-", postfix: "-sql",
        keep: true
    });


    let _dirOpts:ToTempFileOpt = {
        base: tempDir.name,
        extension: ".sql"
    };


    if( opts.create ){
        let compile = toSQLTempFile( require( "./install.sql" ).createUserDatabase( args, opts ), _dirOpts );
        await pexec( compile.file, superMode);

        //language=file-reference
        await pexec( path.join(__dirname, "extension.sql" ), superModeApp );

        //language=file-reference
        await pexec( path.join(__dirname, "base.db" ), app );
    }

    //language=file-reference
    if( opts.clean ) await pexec( path.join(__dirname, "clean.sql" ), app,  false );

    //language=file-reference
    if( opts.menu ) await pexec( path.join(__dirname, "menu.sql" ), app,  false );

    if( opts.grants ){
        let compile = toSQLTempFile( require( "./grants.sql" ).grantsSql( args, opts ), _dirOpts );
        await pexec( compile.file, superModeApp  );
    }

    let compile = toSQLTempFile( require( "./users.sql" ).usersSql( args, opts ), _dirOpts );
    await pexec( compile.file, superModeApp  );

    // //language=file-reference
    // await pexec( path.join(__dirname, "patches/currency.sql" ), app,  false );

    console.log( "#REMOVE: ", tempDir.name)
    if( opts.showCommandOnly ){
        console.log( "rm -rf ", tempDir.name );
        return;
    }
    fs.rmSync( tempDir.name, {
        recursive: true
    })
}
