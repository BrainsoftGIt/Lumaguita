"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsName = exports.connFactory = void 0;
exports.connFactory = {
    local(args) {
        return {
            //Postgres database connection with superuser postgres
            superMode: {
                args: {
                    username: args.dbSupperUser,
                    dbname: "postgres",
                    host: "127.0.0.1",
                    port: args.dbPort,
                }, options: { env: { PGPASSWORD: args.dbPasswordSuperUser } },
                //App database connection with superuser postgres
            }, superModeApp: {
                args: {
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
                    env: { PGPASSWORD: args.dbPassword },
                }
            }
        };
    },
    remote(args) {
        return {
            //Postgres database connection with superuser postgres
            superMode: {
                args: {
                    username: args.dbSupperUser,
                    dbname: "postgres",
                    host: args.dbHost,
                    port: args.dbPort,
                }, options: { env: { PGPASSWORD: args.dbPasswordSuperUser } },
                //App database connection with superuser postgres
            }, superModeApp: {
                args: {
                    username: args.dbSupperUser,
                    dbname: args.dbName,
                    host: args.dbHost,
                    port: args.dbPort,
                }, options: { env: { PGPASSWORD: args.dbPasswordSuperUser } },
                //App database connection with user app
            }, app: {
                args: {
                    username: args.dbUser,
                    dbname: args.dbName,
                    port: args.dbPort,
                    host: args.dbHost
                }, options: { env: { PGPASSWORD: args.dbPassword } }
            }
        };
    }
};
let any = Object.keys(exports.connFactory);
exports.connectionsName = any;
//# sourceMappingURL=conn.js.map