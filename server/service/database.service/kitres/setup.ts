import {PostgresContext} from "kitres";
import {args} from "../../../global/args";
import Path from "path";
import {folders} from "../../../global/project";
import {serverNotify} from "../../../snotify";

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
    serverNotify.log( `log ${level} > ${ message }`);
});
pgContext.on("message", (message, action) => {
    serverNotify.log( message );
});

pgContext.on(  "setup",(error, result) => {
    if( error ) return serverNotify.log( `Database preparation Error | ${ error.message }` );
    else if( !result.status) return serverNotify.log( "Database preparation failed!" )
    else return  serverNotify.log( "database setup> Database prepared successfully!" )
});

pgContext.on("flowResolved", (flow, preview) => {
    serverNotify.log( `database setup> Resolved database preparation flow ${ flow.identifier } in steep ${ flow.steep } with action ${ flow.flow } | ${ flow?.response?.message } `);
    if( flow.error ){
        console.error( flow.error );
    }
});

pgContext.on("flowResolved", (flow, preview) => {
    if( flow.steep === "PostgresContextSteep.FLOW_CHECK_PRE" ){
        console.log( flow.response )
    }});

pgContext.on( "flowSkip", (steep, flow) => {
    serverNotify.log( `Skipped database preparation flow ${ flow.identifier } in steep ${ steep }`)
});