import { ChildProcess, SpawnSyncReturns } from "child_process";
import {
    ArgsConfigs,
    PostgresArgs,
    PostgresConnectionOptions, PostgresExecuteOptions,
    PostgresOptions,
    postgresqlExecute,
    postgresqlExecuteSync
} from "./index";

export type PostgresDumpArgs = PostgresArgs & PostgresConnectionOptions & {
    verbose?:boolean,
    "clean"?:boolean,
    "no-owner"?:boolean,
    "if-exists"?:boolean,
    file?:string,
}

export function pg_dump( args:PostgresDumpArgs,  opts?:PostgresOptions, pgexeOpts?:PostgresExecuteOptions ):ChildProcess{
    return postgresqlExecute( "pg_dump", args, opts, pgexeOpts );
}

export function pg_dump_sync( args:PostgresDumpArgs,  opts?:PostgresOptions, pgexeOpts?:PostgresExecuteOptions ):SpawnSyncReturns<Buffer>{
    return postgresqlExecuteSync( "pg_dump", args, opts, pgexeOpts );
}
