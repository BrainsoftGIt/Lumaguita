import {spawn, SpawnOptions, spawnSync, SpawnSyncOptions} from "child_process";

export type PostgresConnectionOptions = {
    host?: string
    port?: number
    username: string,
    dbname: string,
    "no-password"?: boolean,
    password?: boolean
}

export type PostgresArgs = { [ p:string]:boolean|string|number|(string|number)[] }

export function postgresOptsPrepare( opts: SpawnOptions ){
    if( !opts ) opts = {};
    const __opts = { };
    if( opts?.env && typeof opts.env ==="object" && Object.keys( opts.env ).length > 0 )
        __opts[ "env" ] = opts.env;
    return __opts
}
const typePrefix = {
    alias: "-",
    name: "--"
};

export function postgresArgsPrepare( args:{ [ p:string ]:any }, argsConfigs?:ArgsConfigs, ... _args:string[] ):string[]{
    if( !args )  args = {};
    if( !argsConfigs )  argsConfigs = {};
    Object.keys( args ).forEach( key => {
        let name;
        let type = argsConfigs[ key ]?.prefix;
        if( !type && key && key.length === 1 ) type = 'alias';
        else if( !type && key && key.length > 1 ) type = 'name';
        else if( !type || !key ) throw new Error( `Invalid key options key-name ${ key }, type: ${ type }` );
        name = `${typePrefix[type]}${key}`;

        let value = args[ key ];
        if( value === undefined ) throw new Error( `Invalid arguments ${ key } is undefined!` );
        if( value === null ) throw new Error( `Invalid arguments ${ key } is null!` );
        if( typeof value === "string" ) _args.push( name, value );
        else if( typeof value === "number" ) _args.push( name, String( value ) );
        else if( typeof value === "boolean" ) _args.push( name );
        else if( typeof value === "object" && Array.isArray( value ) ){
            value.forEach( ( next )=>{
                if( next === undefined || next === null ) throw new Error( `Invalid arguments ${ key } is undefined!` );
                if( typeof next === "string" ) _args.push( name, next );
                if( typeof next === "number" ) _args.push( name, String( next ) );
                else if( typeof value === "boolean" ) _args.push( name );
                else throw new Error( `invalid value for multiple ${ key }: ${ typeof next } ${ next } `);
            })
        }
        else throw new Error( `invalid value for ${ key }: ${ typeof value } ${ value } `);
    });
    return _args;
}

export type PostgresOptions = SpawnOptions &{
    env?:{ PGPASSWORD?:string }
}

export function postgresqlPrepare( args:{ [ p:string]:any }, opts:PostgresOptions, argsConfigs?:ArgsConfigs ){
    const _opts = postgresOptsPrepare( opts );
    const _args = postgresArgsPrepare( args, argsConfigs );
    return { opts: _opts, args: _args };
}


export type ArgsConfigs = {
    [p:string]: {
        prefix: keyof typeof typePrefix
    }
}

export type PostgresExecuteOptions = {
    debug?:boolean,
    args?:ArgsConfigs
};


export function postgresqlExecuteSync( command:string, args:{ [ p:string]:any }, opts:SpawnSyncOptions, pgexeOpts?:PostgresExecuteOptions ){
    if( !pgexeOpts ) pgexeOpts = {};
    const prepare = postgresqlPrepare( args, opts, pgexeOpts.args );
    if( pgexeOpts.debug )  console.log( command, prepare.args.join( " " ) );
    return spawnSync( command, prepare.args, prepare.opts );
}

export function postgresqlExecute( command:string, args:{ [ p:string]:any }, opts:PostgresOptions, pgexeOpts?:PostgresExecuteOptions ){
    if( !pgexeOpts ) pgexeOpts = {};
    const prepare = postgresqlPrepare( args, opts, pgexeOpts.args  );
    if( pgexeOpts.debug ) console.log( command, prepare.args.join( " " ) );
    return spawn( command, prepare.args, prepare.opts );
}

