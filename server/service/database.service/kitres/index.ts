import {args} from "../../../global/args";
import {PgCore, scriptUtil} from "kitres";
import {ClientConfig, Pool} from "pg"

let configs:ClientConfig = {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUser,
    password: args.dbPassword,
}
export const pgCore:PgCore = new PgCore( () => new Pool( configs ) );
pgCore.on("error", (error, line) => {
    console.log( `Error ao executar a query Line: ${ scriptUtil.urlOf( line ) }`);
    console.error( error );
})


pgCore.sync( args.dbPassword );


let replicateConfigs:ClientConfig = { ...configs, user: args.dbUserClone, password:  args.dbPasswordClone }
export const replicatePgCore = new PgCore( () => new Pool( replicateConfigs ));
replicatePgCore.sync( args.dbPasswordClone );
