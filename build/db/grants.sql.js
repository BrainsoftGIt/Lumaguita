"use strict";
// -- grant USAGE ON SCHEMA auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_clone ;
// -- grant all ON database maguita_uuid to maguita_clone; -- auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_clone ;
// --
// -- grant all privileges ON all tables in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all functions in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all sequences in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all routines in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all procedures in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON database maguita_uuid to maguita_clone;
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantsSql = void 0;
const pg_escape_1 = require("pg-escape");
function grantsSql(args, opts) {
    let _clone = (0, pg_escape_1.ident)(args.dbUserClone);
    let _dbname = (0, pg_escape_1.ident)(args.dbName);
    return [
        //language=PostgreSQL
        `grant USAGE ON SCHEMA auth, cluster, lib, geoinfo, map, public, rule, tweeks to ${_clone}`,
        //language=PostgreSQL
        `grant all ON database ${_dbname} to ${_clone};`,
        //language=PostgreSQL
        `grant all privileges ON all tables in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${_clone}`,
        //language=PostgreSQL
        `grant all privileges ON all functions in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${_clone}`,
        //language=PostgreSQL
        `grant all privileges ON all sequences in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${_clone}`,
        //language=PostgreSQL
        `grant all privileges ON all routines in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${_clone}`,
        //language=PostgreSQL
        `grant all privileges ON all procedures in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${_clone}`,
        //language=PostgreSQL
        `grant all privileges ON database ${_dbname} to ${_clone}`
    ];
}
exports.grantsSql = grantsSql;
//# sourceMappingURL=grants.sql.js.map