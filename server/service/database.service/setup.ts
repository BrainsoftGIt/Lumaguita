import {db} from "kitres";
import {args} from "../../global/args";
import Path from "path";
import {folders} from "../../global/project";
import {serverNotify} from "../../snotify";
import {System} from "kitres/src/core/system";
import fs from "fs";
import os from "os";
import {manifest} from "../../global/context";

process.env[ System.pathName()] = [
    //language=file-reference
    Path.join(__dirname,"../../../bin"),
    ... process.env[ System.pathName() ].split( Path.delimiter )
].join( Path.delimiter );

let isNewCluster = !fs.existsSync( folders.base_dump );

let baseDump:string;
let setups:({user:string,filename:string})[]=[];
if( isNewCluster ){
    //language=file-reference
    baseDump = baseDump = Path.join( __dirname, "../../../database/bases/maguita.base" );
    setups.push({
        user: args.dbUser,
        //language=file-reference
        filename: Path.join( __dirname, "../../../database/bases/clean.sql")
    })
} else {
    baseDump = folders.base_dump
}

let locale:db.InstallationLocation = db.InstallationLocation.REMOTE;
if( os.platform() === "win32" && args.dbMode === "app" && args.appMode === "public" ){
    locale = db.InstallationLocation.LOCAL;
}

let opts:db.PostgresInstanceOptions = {
    clusterLocation: locale,
    installerLocation: locale,
    serverHost: args.dbHost,
    service: manifest.properties.databaseService,
    configs:{
        port: args.dbPort,
        listenAddress: "*",
        users: [
            { username: args.dbUser, superuser: false, search: ["tweeks", "public"], password: args.dbPassword,
                tests: [{ database: args.dbName }]
            },
            {
                username: args.dbUserClone, password: args.dbPasswordClone, search: [ "tweeks", "public" ], superuser: true, replication: true,
                tests: [{ database: args.dbName }]
            }
        ], database: [{
            dbname: args.dbName,
            owner: args.dbUser,
            base: baseDump,
            setups: setups,
            search: [ "tweeks", "public" ],
            extensions: [ "unaccent", "uuid-ossp" ],
            grants:[],
        }], hba: [
            { database: args.dbName, address: "*", method: "md5", type: "host", user: args.dbUser },
            { database: args.dbName, address: null, method: "md5", type: "local", user: args.dbUserClone },
        ]
    },
    superuser: {
        username: args.dbSupperUser,
        password: args.dbPasswordSuperUser,
        superuser: true,
    },
    cluster: folders.cluster,
    init: {
        auth: "md5",
        encoding: "utf8",
        noLocale: true
    },
    minVersion: manifest.properties.databaseTarget
};

console.log( opts.configs.users )
export const pgContext = new db.PostgresContext( opts );

pgContext.on( "log", (level, message) => {
    serverNotify.log( `database setup log ${level} > ${ message.trim() }`);
});
pgContext.on("message", (message, action) => {
    serverNotify.log( `database setup message > ${ message.trim() }` );
});

pgContext.on(  "setup",(error, result) => {
    if( error ) return serverNotify.log( `Database preparation Error | ${ error.message }` );
    else if( !result.status) return serverNotify.log( "Database preparation failed!" )
    else return  serverNotify.log( "database setup > Database prepared successfully!" )
});

pgContext.on("flowResolved", (flow, preview) => {
    serverNotify.log( `database setup flow resolved > Resolved database preparation flow ${ flow.identifier } in steep ${ flow.steep } out with ${ flow.out } | ${ flow?.response?.message } `);
    if( flow.error ){
        console.error( flow.error );
    }
});

pgContext.on( "flowSkip", (steep, flow) => {
    serverNotify.log( `database setup flow skipped> Skipped database preparation flow ${ flow.identifier } in steep ${ steep }`)
});