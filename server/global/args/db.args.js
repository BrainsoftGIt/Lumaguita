"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../autogen/config/db");
const index_1 = require("./index");
const { define, hide } = (0, index_1.lineDefiner)(db_1.db.dbConfig);
// @ts-ignore
define("dbMode", String, {});
define("dbHost", String, { conf: "host", def: "DB_HOST" });
define("dbPort", Number, { conf: "port", def: "DB_PORT" });
define("dbForce", Boolean, { val: false });
define("dbPortDatabaseApp", Number, { conf: "portDatabaseApp", def: "DB_LOCAL_PORT" });
//Default
define("dbName", String, { conf: "database", def: "DB_NAME" });
define("dbUser", String, { conf: "user", def: "DB_USERNAME" });
hide("dbPassword", String, { conf: "password" });
//Clinica
define("dbHostClinic", String, { conf: "hostClinic", def: "DB_HOST" });
define("dbNameClinic", String, { conf: "databaseClinic" });
define("dbUserClinic", String, { conf: "userClinic" });
hide("dbPasswordClinic", String, { conf: "passwordClinic" });
//Clone
define("dbUserClone", String, { conf: "userClone", def: "DB_USERNAME_CLONE" });
hide("dbPasswordClone", String, { conf: "passwordClone" });
//Supper
define("dbSupperUser", String, { conf: "superuser", def: "DB_SUPERUSER" });
hide("dbPasswordSuperUser", String, { conf: "passwordSuperUser" });
//# sourceMappingURL=db.args.js.map