import {args} from "../../global/args";
import {PostgresFactory} from "zoo.pg";

export const factoryClinic = new PostgresFactory( {
    host: args.dbHostClinic,
    port: args.dbPort,
    database: args.dbNameClinic,
    user: args.dbUserClinic,
    password: args.dbPasswordClinic,
});
