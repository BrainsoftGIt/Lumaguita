import {ChildProcess, spawn, SpawnSyncReturns} from "child_process";
import {
    ArgsConfigs,
    PostgresArgs,
    PostgresConnectionOptions, PostgresExecuteOptions,
    PostgresOptions,
    postgresqlExecute,
    postgresqlExecuteSync
} from "./index";

export type PostgresPsqlArgs = PostgresArgs & PostgresConnectionOptions & {
    command?:string|string[]
    "tuples-only"?:boolean
    file?:string
}

export function psql( args:PostgresPsqlArgs,  opts?:PostgresOptions, pgexeOpts?:PostgresExecuteOptions ):ChildProcess{
    return postgresqlExecute( "psql", args, opts, pgexeOpts );
}

export function psql_sync( args:PostgresPsqlArgs,  opts?:PostgresOptions, pgexeOpts?:PostgresExecuteOptions):SpawnSyncReturns<Buffer>{
    return postgresqlExecuteSync( "psql", args, opts, pgexeOpts );
}