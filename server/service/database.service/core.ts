import cluster from "cluster";
import {ClientConfig, Pool} from "pg";
import {args} from "../../global/args";
import {context} from "../../global/context";
import {db, PgCore, RevisionCore} from "kitres";
import {folders} from "../../global/project";
import {VERSION} from "../../version";
import Path from "path";

let configs:ClientConfig = {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUser,
    password: args.dbPassword,
}

if( cluster.isPrimary ){
    console.log( context.tag, `using database connection (
        host: ${ args.dbHost },
        port: ${ args.dbPort },
        user: ${ args.dbUser },
        database: ${ args.dbName }
     )`
    )
}

export const pgCore:PgCore = new PgCore( () => new Pool( configs ), {
    schema: "kitres"
});

console.log(configs)
pgCore.sync( args.dbPassword );


let replicateConfigs:ClientConfig = { ...configs, user: args.dbUserClone, password:  args.dbPasswordClone }
export const replicatePgCore = new PgCore( () => new Pool( replicateConfigs ));
replicatePgCore.sync( args.dbPasswordClone );


export const dbCataloger = new db.Cataloger( pgCore );
export const dbRes = new db.OIDResourceManager( dbCataloger );

export const pgRevision = new RevisionCore( connection => {
    return pgCore
});

pgRevision.setsOptions({
    schema: "kitres",
    dirname: folders.databaseRevision,
    VERSION: VERSION,
    resolvedDirectory: folders.databaseRevisionResolved,
    history: false,
    props: {
        DATA_VERSION: VERSION.TAG
    }
});

dbCataloger.setsOptions({
    suffix: "Maguita",
    //language=file-reference
    dirname: Path.join( __dirname, "../../../database/cataloger" ),
    private: {
        includes: {
            schema: {
                items:["auth", "cluster", "tweeks", "libdom"]
            }
        }
    },
    namespace: "maguita"
})

require( "./sets/core.sets" );
require( "./sets/cataloger.sets" );
require( "./sets/revisions.sets" );
