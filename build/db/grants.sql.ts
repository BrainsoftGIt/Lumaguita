// -- grant USAGE ON SCHEMA auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_clone ;
// -- grant all ON database maguita_uuid to maguita_clone; -- auth, cluster, lib, geoinfo, map, public, rule, tweeks to maguita_clone ;
// --
// -- grant all privileges ON all tables in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all functions in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all sequences in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all routines in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON all procedures in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO maguita_clone;
// -- grant all privileges ON database maguita_uuid to maguita_clone;


import {ident} from "pg-escape";
import { DBArgs } from "../../server/global/args";
import {CompileDatabaseOpts} from "./install";

export function grantsSql( args:DBArgs, opts:CompileDatabaseOpts ){
    let _clone = ident( args.dbUserClone );
    let _dbname = ident( args.dbName );
    return [

        //language=PostgreSQL
        `grant USAGE ON SCHEMA auth, cluster, lib, geoinfo, map, public, rule, tweeks to ${ _clone }`,
        //language=PostgreSQL
        `grant all ON database ${ _dbname } to ${ _clone };`,
        //language=PostgreSQL
        `grant all privileges ON all tables in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${ _clone }`,
        //language=PostgreSQL
        `grant all privileges ON all functions in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${ _clone }`,
        //language=PostgreSQL
        `grant all privileges ON all sequences in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${ _clone }`,
        //language=PostgreSQL
        `grant all privileges ON all routines in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${ _clone }`,
        //language=PostgreSQL
        `grant all privileges ON all procedures in schema auth, cluster, lib, geoinfo, map, public, rule, tweeks TO ${ _clone }`,
        //language=PostgreSQL
        `grant all privileges ON database ${ _dbname } to ${ _clone }`
    ]
}

