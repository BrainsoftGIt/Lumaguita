import { DBArgs } from "../../server/global/args";
import {PostgresPsqlArgs} from "../../server/lib/postgres/tools/psql";
import {PostgresOptions} from "../../server/lib/postgres/tools";

export type Connection = {
    args: PostgresPsqlArgs,
    options:PostgresOptions
}

export type ConnectionsLevel = {
    /**
     * Postgres database connection with superuser postgres
     */
    superMode: Connection,

    /**
     * App database connection with superuser postgres
     */
    superModeApp:Connection

    /**
     * App database connection with user app
     */
    app:Connection,
}

export const connFactory = {
    local(args:DBArgs ):ConnectionsLevel{
        return {
            //Postgres database connection with superuser postgres
            superMode:{
                args: {
                    username: args.dbSupperUser,
                    dbname: "postgres",
                    host: "127.0.0.1",
                    port: args.dbPort,
                }, options: {  env:{ PGPASSWORD: args.dbPasswordSuperUser } }
               ,

                //App database connection with superuser postgres
            }, superModeApp: {
                args:{
                    username: args.dbSupperUser,
                    dbname: args.dbName,
                    port: args.dbPort,
                    host: "127.0.0.1",
                }, options: { env: { PGPASSWORD: args.dbPasswordSuperUser } }
                //App database connection with user app
            }, app: {
                args: {
                    username: args.dbUser,
                    port: args.dbPort,
                    dbname: args.dbName,
                    host: "127.0.0.1"
                }, options: {
                    env:{ PGPASSWORD: args.dbPassword },
                }
            }
        }
    },
    remote( args:DBArgs ):ConnectionsLevel{
        return {
            //Postgres database connection with superuser postgres
            superMode:{
                args: {
                    username: args.dbSupperUser,
                    dbname: "postgres",
                    host: args.dbHost,
                    port: args.dbPort,
                }, options:{ env:{ PGPASSWORD: args.dbPasswordSuperUser }}
                ,

                //App database connection with superuser postgres
            }, superModeApp: {
               args:{
                   username: args.dbSupperUser,
                   dbname: args.dbName,
                   host: args.dbHost,
                   port: args.dbPort,
               }, options: { env: { PGPASSWORD: args.dbPasswordSuperUser } }
                ,

                //App database connection with user app
            }, app: {
                args: {
                    username: args.dbUser,
                    dbname: args.dbName,
                    port: args.dbPort,
                    host: args.dbHost
                }, options: { env:{ PGPASSWORD: args.dbPassword } }
            }
        }
    }
} as const;

let any:any[] = Object.keys( connFactory );
export const connectionsName:(keyof typeof connFactory)[] = any;