import escape from "pg-escape";
import { DBArgs } from "../../server/global/args";
import {CompileDatabaseOpts} from "./install";

export function usersSql( args:DBArgs, opts:CompileDatabaseOpts ){
    let _default = escape.literal( args.dbUser );
    let _clone = escape.literal( args.dbUserClone );
    //language=PostgreSQL
    return [
        `truncate cluster.users`,
        `insert into cluster.users( user_default, user_replication ) values ( ${_default}::text::regrole, ${ _clone }::text::regrole)`,
    ]
}

