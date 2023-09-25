import {args} from "../../../global/args";
import {PgCore} from "kitres";
import {Client, ClientConfig, Pool} from "pg"

let configs:ClientConfig = {
    host: args.dbHost,
    port: args.dbPort,
    database: args.dbName,
    user: args.dbUser,
    password: args.dbPassword,
}
export const pgCore:PgCore = new PgCore( {
    poolFactory:() => new Pool( configs ),
    clientFactory:() => new Client( configs )
});

let replicateConfigs:ClientConfig = { ...configs, user: args.dbUserClone, password:  args.dbPasswordClone }
export const replicatePgCore = new PgCore( {
    poolFactory:() => new Pool( replicateConfigs ),
    clientFactory: () => new Client( replicateConfigs)
});
