import {db} from "../autogen/config/db";
import {lineDefiner} from "./index";

declare module "./index" {
    interface DBEnvs {
        dbHost: string,
        dbHostClinic: string,
        dbPort: number,
        dbPortDatabaseApp: number,
        dbUser:string,
        dbUserClinic:string,
        dbName:string,
        dbNameClinic:string,
        dbUserClone: string,
        dbSupperUser:string
        dbServiceName:string
        dbMode: "app"|"system"
        dbForce: boolean
    }

    interface Envs extends DBEnvs{}

    interface DBHiddenEnvs {
        dbPassword:string
        dbPasswordClinic:string
        dbPasswordClone:string
        dbPasswordSuperUser:string,
    }

    interface HiddenEnvs extends DBHiddenEnvs{}

    interface Args { }
    export interface DBArgs extends DBHiddenEnvs, DBEnvs{}
}

const { define, hide } = lineDefiner( db.dbConfig );

// @ts-ignore
define("dbMode",  String, {}  );

define("dbHost", String,{  conf: "host", def: "DB_HOST" } );
define("dbPort", Number, { conf: "port", def: "DB_PORT" });

define("dbForce", Boolean, { val:false });
define("dbPortDatabaseApp", Number,{ conf: "portDatabaseApp", def: "DB_LOCAL_PORT" });

//Default
define("dbName", String, { conf: "database", def: "DB_NAME"} );
define("dbUser", String, { conf: "user", def: "DB_USERNAME" });
hide("dbPassword", String,  { conf: "password" } );


//Clinica
define("dbHostClinic", String,{  conf: "hostClinic", def: "DB_HOST" } );
define("dbNameClinic", String, { conf: "databaseClinic" } );
define("dbUserClinic", String, { conf: "userClinic" });
hide("dbPasswordClinic", String,  { conf: "passwordClinic" } );


//Clone
define("dbUserClone", String,{ conf: "userClone", def: "DB_USERNAME_CLONE" })
hide("dbPasswordClone", String, { conf:"passwordClone" });


//Supper
define("dbSupperUser",  String,{ conf: "superuser", def: "DB_SUPERUSER" } );
define("dbServiceName",  String,{ conf: "dbServiceName", def: "DB_SERVICE_NAME" } );
hide("dbPasswordSuperUser", String, { conf: "passwordSuperUser" } );