import {args} from "../../../global/args";
import {PgCore} from "kitres";
import {ClientConfig, Pool} from "pg"

let configs:ClientConfig = {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUser,
    password: args.dbPassword,
}
export const pgCore:PgCore = new PgCore( () => new Pool( configs ) );
pgCore.sync( args.dbPassword );


let replicateConfigs:ClientConfig = { ...configs, user: args.dbUserClone, password:  args.dbPasswordClone }
export const replicatePgCore = new PgCore( () => new Pool( replicateConfigs ));
replicatePgCore.sync( args.dbPasswordClone );
