import {PostgresContext} from "kitres";
import {args} from "../../../global/args";
import Path from "path";
import {folders} from "../../../global/project";
import {serverNotify} from "../../../snotify";
import {System} from "kitres/src/core/system";

process.env[ System.pathName()] = [
    //language=file-reference
    Path.join(__dirname,"../../../../bin"),
    ... process.env[ System.pathName() ].split( Path.delimiter )
].join( Path.delimiter );

export const pgContext = new PostgresContext({
    service: args.dbServiceName,
    configs:{
        port: args.dbPort,
        listenAddress: "*",
        users: [
            { username: args.dbUser, superuser: false, search: ["tweeks", "public"], password: args.dbPassword,
                tests: [{ database: args.dbName, host: "127.0.0.1" }]
            },
            {
                username: args.dbUserClone, password: args.dbPasswordClone, search: [ "tweeks", "public" ], superuser: true, replication: true,
                tests: [{ database: args.dbName, host: "127.0.0.1" }]
            }
        ], database: [{
            dbname: args.dbName,
            owner: args.dbUser,
            //language=file-reference
            base:Path.join( __dirname, "../../../../database/bases/maguita.base"),
            setups:[{
                user: args.dbUser,
                filename: Path.join( __dirname, "../../../../database/bases/clean.sql")
            }],
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
    }, cluster: folders.pgHome,
    init: {
        auth: "md5",
        encoding: "utf8",
        noLocale: true
    }
});

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
    serverNotify.log( `database setup flow resolved > Resolved database preparation flow ${ flow.identifier } in steep ${ flow.steep } with action ${ flow.flow } | ${ flow?.response?.message } `);
    if( flow.error ){
        console.error( flow.error );
    }
});

pgContext.on( "flowSkip", (steep, flow) => {
    serverNotify.log( `database setup flow skipped> Skipped database preparation flow ${ flow.identifier } in steep ${ steep }`)
});