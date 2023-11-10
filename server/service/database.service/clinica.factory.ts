import {args} from "../../global/args";
import {PostgresFactory} from "zoo.pg";
import {PgCore, scriptUtil} from "kitres";
import {Pool} from "pg";

// export const factoryClinic = new PostgresFactory( {
//     host: args.dbHostClinic,
//     port: args.dbPort,
//     database: args.dbNameClinic,
//     user: args.dbUserClinic,
//     password: args.dbPasswordClinic,
// });

export const clinicCore = new PgCore( () => new Pool({
    host: args.dbHostClinic,
    port: args.dbPort,
    database: args.dbNameClinic,
    user: args.dbUserClinic,
    password: args.dbPasswordClinic,
}));

clinicCore.on("error", (error, line) => {
    console.log( `Error ao executar a query Line: ${ scriptUtil.urlOf( line ) }`);
    console.error( error );
})

