import {Arguments} from "zoo.util/lib/arguments";

require( 'source-map-support' ).install();
import {WriteStream} from "fs";

import JSON5 from "json5";
import fs from "fs";
import * as path from "path";
import {spawn} from "child_process";
export type DbUpgradeOpts = {
    main:string
}


export type MainStructure = {
    dist:string,
    oneShot:string[],
    order:string[]
}

export function dbUpgrade ( opts:DbUpgradeOpts ){
    const base = path.dirname( opts.main );

    const line = new Arguments<{upgrade:boolean}>( true );
    line.define( { name: "upgrade", type: Boolean, value: false } );

    const upgradeArgs = line.values;


    let main = JSON5.parse<MainStructure>( fs.readFileSync(opts.main ).toString("utf-8" ) );
    const dist = path.join( base, main.dist );

    fs.mkdirSync( dist, { recursive: true } );

    let upgrade:{applied?:string[], version?:number};
    if( fs.existsSync( path.join( dist, 'upgrade.json5' )) ){
        upgrade = JSON5.parse( fs.readFileSync( path.join( dist, 'upgrade.json5' )).toString("utf-8") ) ;
    }
    if( !upgrade ) upgrade = {};
    if (!upgrade.version ) upgrade.version = 0;
    if( !upgrade.applied ) upgrade.applied = [];

    upgrade.version++;


    const src = path.join( dist, `v${ upgrade.version }`, "src" );
    const srcFull = path.join( dist, `v${ upgrade.version }`, "full" );

    fs.mkdirSync( path.join( src ),{ recursive: true });
    fs.mkdirSync( path.join( srcFull ), { recursive: true } );

    const streams = {
        version: fs.createWriteStream( path.join( dist, `v${ upgrade.version }`,  `up.full.sql` ), { encoding: "utf-8" } ),
        fullVer: fs.createWriteStream( path.join( dist, `v${ upgrade.version }`, "up.sql" ), { encoding: "utf-8" } )
    }


    const map = main.order.map( ref => {
        return {
            path: path.join( base, ref ),
            name: path.basename( ref ),
            ref: ref,
            verRef: `${ref.split( path.sep ).join( "/" ).split("/" ).join( "_-_" )}.sql`,
            dir: path.dirname( ref )
        }
    });

    const includes = ( sqlFile:typeof map[any], iterator, saveStream:WriteStream, dist ) => {
        if( !fs.existsSync( sqlFile.path ) ) {
            return console.log( "File Not Founds", sqlFile.ref )
        }
        const fileName = `sql-v${ upgrade.version }-${ iterator }-${ sqlFile.verRef }`;
        fs.copyFileSync( sqlFile.path, path.join( dist, fileName ) );

        saveStream.write( `-- includes ${ path.join(`v${ upgrade.version }`, fileName  )}\n` );
        saveStream.write( `select $$====================[ includes @ref ${ path.join(`v${ upgrade.version }`, fileName  )} ]====================$$;\n` );
        saveStream.write( fs.readFileSync( sqlFile.path ) );
        saveStream.write( "\n;\n" );
    }


    console.log( "================= [FULL INCLUDES FILES ] =================")
    map.forEach( (sqlFile, index) => {
        includes( sqlFile, index+1,  streams.fullVer, srcFull )
    });

    console.log( "================= [NEED INCLUDES FILES ] =================")
    let next = 1;
    let includesFile = [];
    map.forEach( (sqlFile, index) => {
        let __included = upgrade.applied.includes( sqlFile.ref ) && main.oneShot.includes( sqlFile.ref ) && fs.existsSync( sqlFile.ref );
        includesFile.push( { ref: sqlFile.verRef, includes: !__included, exists: fs.existsSync( sqlFile.ref )  } ) ;
        if( __included ) return;
        includes( sqlFile, next++, streams.version, src );
    });

    map.forEach( sqlFile => {
        if( !upgrade.applied.includes( sqlFile.ref ) ) upgrade.applied.push( sqlFile.ref );
    });

    fs.writeFileSync( path.join( dist, "upgrade.json5" ), JSON5.stringify( upgrade, null, 2 ) );
    streams.version.close();
    streams.fullVer.close();


    streams.version.on( "close", () => {

        fs.copyFileSync( streams.version.path, path.join( dist, 'upgrade.sql' ) );
        fs.writeFileSync( path.join( dist, `v${ upgrade.version }`,  `up.json5` ), JSON5.stringify( Object.assign({
            includes: includesFile
        }, upgrade ), null, 2 ));

        console.log( "=============================================== [ RESUME ] ===============================================")
        console.log( "new upgrade version", streams.version.path );
        console.log( "new upgrade fullVer", streams.fullVer.path  );
        console.log( "new upgrade source", src );
        console.log( "new upgrade sqlFile", path.join( dist, 'upgrade.sql' ) );

        console.log( upgradeArgs )
        if( upgradeArgs.upgrade ){
            const dbConfig = require('../../server/global/autogen/config/db').db.dbConfig;
            const child = spawn( "psql", [
                "-h", "127.0.0.1",
                "-U", dbConfig.user,
                "-p", dbConfig.port,
                "-d", dbConfig.database,
                "-f", path.join( dist, 'upgrade.sql' ),
                "-t"
            ], { env: {
                PGPASSWORD: dbConfig.password
            }});

            child.on( "error", err => console.log( err ) );
            child.stderr.on( "error", err => console.error( err ))
            child.stdout.on( "error", err => console.error( err ))
            child.stdout.on( "data", chunk => console.log( chunk.toString("utf-8") ) );
            child.stderr.on( "data", chunk => console.log( chunk.toString("utf-8") ) );
        }
    });
}

//database/project/upgrade/dists/release-v3/upgrade.sql