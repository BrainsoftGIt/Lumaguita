import {pgctlStatus} from "./tools/pgctl-status";

require( 'source-map-support' ).install();

import fs  from "fs";
import * as path from "path";
import {ChildProcess, spawn, SpawnOptions, spawnSync} from "child_process";
import * as readline from "readline";
import { processListen } from "../utils/process/listen";
import {psql} from "./tools/psql";
import {string} from "pg-escape";
import chalk from "chalk";
import {pgServer} from "./pg-recoginizer";
import {postgresToolVersion} from "./tools/version";
import os from "os";
import {promiseResolveAny} from "../utils/promise";

let SILENT_COMMAND = os.platform() === "win32"? "silent.exe" : "silent";

const VALUES = {
    get BREAK_LINE(){ return '\n' },
    TABS( number?:number ){
        if( !number ) number = 1;
        return '\t'
    },
    PG_PASSWORD_ENV: "PGPASSWORD",
    PG_AUTH_CONFIGS: "pg_hba.conf",
    PG_CONFIG: "postgresql.conf",
    get DEFAULT_PG_CONFIG(){ return `defaults.${ this.PG_CONFIG}` },
    get PG_TEMP_PG_CONFIGS(){ return `temp.${ this.PG_CONFIG }` },
    get DEFAULT_AUTH_CONFIG(){ return `defaults.${ this.PG_AUTH_CONFIGS}`},
    get PG_TEMP_AUTH_CONFIGS(){ return `temp.${ this.PG_AUTH_CONFIGS }` }
};

export const DEFINES = new Proxy(VALUES,{
    set(target, p: PropertyKey, value: any, receiver: any): boolean {
        throw new Error( "PROTECTED VARS READY ONLY!")
    }
})


export enum DefaultsNotices {
    NOTICE_PASSWORDS_SETS = "DefaultsNotices.NOTICE_PASSWORDS_SETS"
}
export type PGCltArgs = {
    superuser?:string | "postgres";
    superuserPassword?:string ;
    database?:string | "postgres";
    detached?:boolean,
    configs?:{
        port?:{ number:number, random?:boolean },
        listen?:string
    }
}

export type AUTH_DATABASE ="all"|"sameuser"|"samerole"|"replication"|string;
export type AUTH_USER ="all"|string;
export type AUTH_METHOD = "trust"|"reject"|"md5"|"password"|"scram-sha-256"|"gss"|"sspi"|"ident"|"peer"|"pam"|"ldap"|"radius"|"cert"
export type AUTH_TYPE = "local"|"host"|"hostssl"|"hostnossl"|"hostgssenc"|"hostnogssenc"
export type AuthMethods = {
    [p:string]:string,
    TYPE:AUTH_TYPE
    DATABASE:AUTH_DATABASE
    USER:AUTH_USER
    ADDRESS?:string|"*"
    METHOD:AUTH_METHOD
}

// export enum PGCtlStartResult {
//     OK = "PGCtlStartResult.OK",
//     ALREADY_STARTED = "PGCtlStartResult.ALREADY_STARTED",
//     NEED_CONFIGURATION = "PGCtlStartResult.NEED_CONFIGURATION",
//     NEED_SERVER_INSTALL = "PGCtlStartResult.NEED_SERVER_INSTALL",
//     REJECTED="PGCtlStartResult.REJECTED"
// }


export enum PGStatus {
    OK = "PGStatus.OK",
    FAILED = "PGStatus.FAILED",
    REJECTED = "PGStatus.REJECTED",
    ERROR= "PGStatus.ERROR",

    TEST_FAILED = "PGStatus.TEST_FAILED",
    TEST_SUCCESS = "PGStatus.TEST_SUCCESS",
    TEST_ERROR = "PGStatus.TEST_SUCCESS",
    /** FATAL:  the database system is starting up */
    TEST_WAIT = "PGStatus.TEST_WAIT",
    START_SUCCESS = "PGStatus.START_SUCCESS",
    START_SUCCESS_ANOTHER = "PGStatus.START_SUCCESS_ANOTHER",
    START_RETRY_EXCEEDED = "PGStatus.START_RETRY_EXCEDED",
    START_REJECTED = "PGStatus.START_REJECTED",
    START_NEED_CONFIGURATION = "PGStatus.START_NEED_CONFIGURATION",
    START_NEED_INSTALLATION = "PGStatus.START_NEED_INSTALLATION",

    CONFIG_ERROR = "PGStatus.CONFIGS_ERROR"
}

export type ExtendsAuthMethods = ({
    DATABASE:AUTH_DATABASE|AUTH_DATABASE[],
    USER:AUTH_USER|AUTH_USER[],
    TYPE:AUTH_TYPE
    ADDRESS?:string|"*"
    METHOD:AUTH_METHOD
});


export type PGCtlInstallResult = {
    result:boolean,
    message:string
    dataDir:string,
    code:string,
    status:PGClusterStatus
}

export enum PGClusterStatus {
    DIR_NOT_EXISTS = "PGClusterStatus.DIR_NOT_EXISTS",
    DIR_NOT_DATABASE_CLUSTER = "PGClusterStatus.DIR_NOT_PG_CLUSTER",
    CLUSTER_STOPPED = "PGClusterStatus.CLUSTER_STOPPED",
    CLUSTER_RUNNING = "PGClusterStatus.CLUSTER_RUNNING"
}

type DirStatus = { root:string, dirname: string, dataDir:string, name:string, exists:boolean, empty:boolean };
type DirCreate = DirStatus & { code:string, status:PGClusterStatus};

export type PGCtlWhenExists = "RANDOM"|"RANDOM-IF-NOT-EMPTY"|"RANDOM-IF-NOT-CLUSTER"|"RANDOM-IF-CLUSTER-RUNNING"|"RANDOM-IF-CLUSTER-CANNOT-CONNECT";

export enum ListenerEvent {
    INIT_DB = "ListenerEvent.INIT_DB",
    START = "ListenerEvent.START",
    READY = "ListenerEvent.READY"
}

export type OnListenerCallback = ( EVENT:ListenerEvent, ...any)=>Promise<void>|void;



export function commandExists( command:string ){
    const isWin = require('os').platform().indexOf('win') > -1;
    const where = isWin ? 'where' : 'whereis';
    const spawnSync = require('child_process').spawnSync;
    const out = spawnSync(where, [  command ], {encoding: 'utf8'});
    return out.status === 0;
}

export type DebugDetails = {
    levelCode?: 0|1|2|3
    level?:"error"|"warn"|"info"|"log"
    [ p:string ]: any
};

export const DEBUG_ERROR:DebugDetails = { level: "error", levelCode: 0 }as const;
export const DEBUG_WARN:DebugDetails = { level: "warn", levelCode: 1 }as const;
export const DEBUG_INFO:DebugDetails = { level: "info", levelCode: 2 }as const;
export const DEBUG_LOG:DebugDetails = { level: "log", levelCode: 3 }as const;

export type DebugCallback = ( details:DebugDetails, message:string, ...extras )=>void;
export type PGCtlCallbacks = {
    ready?:(self:PostgresCluster, ready:()=>void)=>void
    debug?:DebugCallback
}

export type PostgresConfigs = {
    value:string|number,
    type:"value"|"text"
}
export class PostgresCluster {

    private readonly _configs:PGCltArgs;
    private readonly root:string;
    private readonly PG_VERSION:number;
    private readonly upVersion:boolean;
    private readonly dirname:string;
    private code:string;
    private _port:number;
    private _countStarts:number = 0;
    private _startPidNumber:number;
    private _authMethods:AuthMethods[] = [];
    private _listener:  {
        [p:string]: OnListenerCallback[]
    } = new Proxy({}, {
        get(target: {}, p: PropertyKey): any {
            if( !target[p] ) target[p] = [];
            return target[ p ];
        }
    });

    private debug?:(  detail:DebugDetails, message:string, ...extras )=> void;

    constructor( PG_VERSION:number, upVersion:boolean, root:string, dirname:string, args:PGCltArgs,  callbacks:PGCtlCallbacks) {
        this.root = root;
        this.PG_VERSION = PG_VERSION;
        this.upVersion = upVersion;
        this.dirname = dirname;

        this.debug = ( details, message, ...extras )=>{
            if( typeof callbacks.debug === "function" ){
                try { callbacks.debug(  details, message, ...extras ) }catch (e) {}
            }
        }

        if( !args.configs?.port?.number ){
            this.debug( DEBUG_ERROR, "Missing arg port" )
            throw new Error( "Missing arg port" );
        }
        if( !args.superuser ) {
            this.debug( DEBUG_ERROR, "Missing supper user name" )
            throw new Error("Missing supper user name")
        }
        if( !args.database ) {
            this.debug( DEBUG_ERROR,"Missing default database name" )
            throw new Error("Missing default database name")
        }

        this._configs = args;
        const _ready = () => {
            this.prepare().then( () => {
                if( callbacks?.ready ) callbacks?.ready( this, ()=>{
                    this.debug( DEBUG_INFO,"CALLBACK READY" );
                    this._listener[ ListenerEvent.READY ].forEach( ready => {
                        this.debug( DEBUG_INFO, "CALL READY NEXT" )
                        ready( ListenerEvent.READY )
                    })
                });
            })
        }

        const _reject = ()=>{
            let message = "PG_CTL canceled - NO DATABASE INSTALLER CALLBACK DETECTED. PLEASE SET A INSTALLER CALLBACK";
            let error = new Error( message );
            this.debug( DEBUG_WARN, message, error );
            this.testConnection = ()=>{  throw error };
            this.__start = ()=>{  throw error };
            this.start = ()=>{  throw error };
            this.stop = ()=>{  throw error };
            this.stop = ()=>{  throw error };
            this.reload = ()=>{  throw error };
            this.initDatabaseCluster = ()=>{  throw error };
            this.restart = ()=>{ throw error };
        }

        pgServer.detect( PG_VERSION, upVersion ).then(databaseServer => {
            if( !databaseServer || !databaseServer.isValid || !databaseServer.isSupported ){
                return _reject()
            } else return  _ready();
        })

    }

    get pid(){
        return this._startPidNumber;
    }

    get configs(){
        return this._configs;
    }

    private async prepare(){
        if( fs.existsSync( this.configFile ) ){
            this.loadStatus();
        } else {
            let portRandom = !Object.keys( this._configs?.configs?.port ).includes( "random" ) || this._configs.configs.port.random;
            let port:number = this._configs?.configs?.port?.number || 5432;
            if( portRandom ) this._port = port;
            else this._port = port;
        }
    }

    get dataDir(){  return this.dirStatus().dataDir; }
    get version(){
        return postgresToolVersion( "pg_ctl" );
    }
    get isServiceOwner(){ return !!this._startPidNumber; }
    get configFile(){
        fs.mkdirSync( this.root, { recursive: true });
        return path.join( this.root, `${ this.dirname }.pgctl.config.json` );
    } get pwfile(){
        if( !fs.existsSync( path.join( this.root, 'pwfile.secret' ) ) ){
            fs.writeFileSync( path.join( this.root, "pwfile.secret" ), String( this.configs.superuserPassword ) );
        }
        return path.join( this.root, "pwfile.secret" );
    }

    get port(){ return this._port; }

    status():Promise<PGClusterStatus>{
        return pgctlStatus( this.dataDir );
    }

    get isConfigured(){
        return this._countStarts||0 > 0;
    }

    on( EVENT:ListenerEvent, callback:OnListenerCallback ){
        this._listener[ EVENT ].push( callback );
    }

    initDatabaseCluster(whenExists?:PGCtlWhenExists ):Promise<PGCtlInstallResult>{
        return new Promise( async (resolve, reject) => {
            this.debug( DEBUG_INFO,"create cluster database dir..." );
            let clusterDir = await this.createDir( whenExists );
            if( clusterDir.empty ){

                this.debug( DEBUG_INFO, "working on initdb...");
                let initdb = spawn( "initdb", [
                    "-A", "md5",
                    `--pwfile=${ this.pwfile }`,
                    "--no-locale",
                    "--username", this._configs.superuser,
                    "-D", clusterDir.dataDir,
                ]);

                processListen( initdb, { console: true })
                    .then( async ( result) => {
                        let status:PGClusterStatus = await pgctlStatus( clusterDir.dataDir );
                        if( result.code === 0 ){
                            this._countStarts = 0;
                            this.code = clusterDir.code;
                            this.applyConfigs().then( async () => {
                                this.saveStatus();

                                let i = 0;
                                for (const callback of this._listener[ ListenerEvent.INIT_DB ]) {
                                    this.debug( DEBUG_INFO, "NEXT INIT DB CALLBACK", i++ );
                                    await callback( ListenerEvent.INIT_DB );
                                }
                                this.notifyStartListener( [ PGStatus.START_SUCCESS, PGStatus.OK, PGStatus.TEST_SUCCESS ]).then( value => {
                                    resolve({
                                        result: true,
                                        message: result.stdout,
                                        dataDir: clusterDir.dataDir,
                                        code: clusterDir.code,
                                        status
                                    });
                                }).catch( reason => {
                                    resolve({
                                        result: true,
                                        message: result.stdout,
                                        dataDir: clusterDir.dataDir,
                                        code: clusterDir.code,
                                        status
                                    });
                                })

                            }).catch( reason => {
                                console.error( reason );
                            })
                        } else {
                            resolve( {
                                result: false,
                                message: result.stdout,
                                dataDir: clusterDir.dataDir,
                                code: clusterDir.code,
                                status
                            });
                        }
                    }).catch( reason => {
                        console.error( reason )
                })
            } else {
                resolve({
                   result: clusterDir.status === PGClusterStatus.CLUSTER_RUNNING
                    || clusterDir.status === PGClusterStatus.CLUSTER_STOPPED,
                    code: clusterDir.code,
                    message: "",
                    dataDir: clusterDir.dataDir,
                    status: clusterDir.status
                });
            }
        });
    }

    private async applyConfigs():Promise<PGStatus[]>{
        return new Promise(resolve => {
            this.debug( DEBUG_INFO, "applying cluster configs..." )
            return this.configsClusters().then( value => {
                this.debug( DEBUG_INFO, "applying cluster configs... [OK]" )

                return this.__start(  "APPLY CONFIGS" ).then( startResult => {
                    if( startResult.includes( PGStatus.TEST_SUCCESS ) ){
                        this.applyAuthMethodConfig().then( value1 => {
                            resolve( startResult )
                        }).catch( reason => resolve( [ PGStatus.ERROR, PGStatus.CONFIG_ERROR ] ) );
                    } else resolve( startResult );
                }).catch( reason => {
                    console.error( reason );
                    resolve( [ PGStatus.ERROR ])
                }).finally( ()=>{
                })
            })
        });
    }

    private async applyAuthMethodConfig(){
        const defaultAuthConf = path.join( this.dataDir, DEFINES.DEFAULT_AUTH_CONFIG );
        const authConf = path.join( this.dataDir, DEFINES.PG_AUTH_CONFIGS );
        if( !fs.existsSync( defaultAuthConf ) ) fs.renameSync( authConf, defaultAuthConf );

        if( this._authMethods.length == 0 ){
            fs.copyFileSync( defaultAuthConf, authConf );
            return Promise.resolve( false );
        }

        return new Promise( (resolve, reject) => {
            const out = fs.createWriteStream( authConf, "utf-8"  );
            const rl = readline.createInterface({
                input: fs.createReadStream( defaultAuthConf, "utf-8"  ),
                crlfDelay: Infinity
            });

            rl.on( "line", line =>{
                if( line.trim().charAt( 0 ) !== "#" ) line = "#" + line;
                line = line + DEFINES.BREAK_LINE;
                out.write( line );
            });

            rl.on( "close", () => {
                if( !this._authMethods.find( value => {
                    return value.USER === this._configs.superuser
                        && value.METHOD === "trust"
                        && value.TYPE === "local"
                        && value.DATABASE === "all"
                    ;
                })) {
                    this._authMethods.unshift({
                       METHOD: "md5",
                       DATABASE: "all",
                       TYPE: "local",
                       USER: this._configs.superuser
                    });
                    this._authMethods.unshift({
                        METHOD: "md5",
                        DATABASE: "all",
                        TYPE: "host",
                        ADDRESS: "127.0.0.1/32",
                        USER: this._configs.superuser
                    });
                    this._authMethods.unshift({
                        METHOD: "md5",
                        DATABASE: "all",
                        TYPE: "host",
                        ADDRESS: "localhost",
                        USER: this._configs.superuser
                    });
                }

                const maxLengths:{[p:string]:number} = {METHOD:0,DATABASE:0,TYPE:0,ADDRESS:0,USER:0};
                const keys = ["TYPE", "DATABASE", "USER", "ADDRESS", "METHOD" ];
                const methods:AuthMethods[] = JSON.parse( JSON.stringify( this._authMethods ) );

                methods.forEach( method => {
                    if( method.ADDRESS === "*" ) method.ADDRESS = "0.0.0.0/0";
                    method.TYPE = method.TYPE||"local";
                    method.DATABASE = method.DATABASE||"all";
                    method.USER = method.USER||"all";
                    method.ADDRESS = method.ADDRESS||"";
                    method.METHOD = method.METHOD||"peer";
                   keys.forEach( key =>{
                        if( method[key].length > maxLengths[key] ) maxLengths[key] = method[key].length;
                    })
                });

                methods.forEach( method => {
                    keys.forEach( key =>{ method[key] = `${method[key]}`.padEnd( maxLengths[key], " ") });
                });

                methods.forEach( method => {
                    //template
                    //TYPE  DATABASE        USER            ADDRESS                 METHOD
                    let _t = DEFINES.TABS( 1 );
                    let auth =
                        `${ method.TYPE } ${_t} ${ method.DATABASE } ${_t} ${ method.USER  } ${_t} ${ method.ADDRESS  } ${_t} ${ method.METHOD }`;
                    auth = auth+DEFINES.BREAK_LINE;
                    out.write( auth );
                });
                out.close();
                this.reload().then( value => {
                    resolve( true );
                })
            });
        });
    }

    pushAuth( ...methods:ExtendsAuthMethods[] ){
        let newMethod:boolean = false;
        methods.forEach( method => {

            if( Array.isArray( method.DATABASE ) ) method.DATABASE = method.DATABASE.join( "," );
            if( Array.isArray( method.USER ) ) method.USER = method.USER.join( "," );
            let find = this._authMethods.find( value => {
               return value.TYPE === method.TYPE
                    && value.DATABASE === method.DATABASE
                    && value.USER === method.USER
                    && value.METHOD === method.METHOD
                    && value.ADDRESS === method.ADDRESS
            });
            if( find ) return;
            newMethod = true;
            this._authMethods.push( {
                ...method,
                DATABASE:method.DATABASE,
                USER:method.USER
            });
        });
        this.saveStatus();
        return newMethod;
    }

    async reload():Promise<PGClusterStatus>{
        return this.status().then( value => {
            if( value === PGClusterStatus.CLUSTER_RUNNING ){
                const child = spawn( "pg_ctl", [
                    "-D", this.dataDir,
                    "reload"
                ]);

                processListen( child, {
                }).then( value1 => {
                    console.log( "RELOAD - RESULT", value1 );
                    // process.exit( 0 );
                })
            } else return Promise.resolve( value );
        });
    }

    private async configsClusters(){

        const defCfg = path.join( this.dataDir,  DEFINES.DEFAULT_PG_CONFIG );
        const cfg = path.join( this.dataDir, DEFINES.PG_CONFIG );
        fs.renameSync( cfg , defCfg )

        const rl = readline.createInterface({
            input: fs.createReadStream( defCfg, "latin1"),
            crlfDelay: Infinity
        });
        const out = fs.createWriteStream( cfg, "latin1" );
        let configs = {
            port : { value: this._port, type: "simple"},
            listen_addresses: { value: this._configs.configs.listen, type: "string" }
        }
        // const wr = fs.createWriteStream( path.join( this.dataDir, PG_CONFIG ), "latin1" )
        rl.on( "line",(line) => {
            const parts = line.split("=")
            if( Object.keys(configs).includes( parts[0].trim( ) ) ){
                line = "#"+line;
            }
            line = line + DEFINES.BREAK_LINE;
            out.write( line );
        });
        return new Promise( (resolve, reject) => {
            rl.on( "close", () => {
                Object.keys( configs ).forEach( key => {
                    let config = configs[ key ];
                    let line = ({
                        [ 'simple' ]:()=> `${ key } = ${ config.value }`,
                        [ 'string' ]:()=> `${ key } = '${ config.value }'`
                    })[ config.type ]();
                    if( line ){
                        line = line + DEFINES.BREAK_LINE;
                        out.write( line);
                    }
                });
                resolve( configs );
            })
        })
    }

    private saveStatus(){
        fs.writeFileSync( this.configFile, JSON.stringify({
            code: this.code,
            root: this.root,
            dataDir: this.dataDir,
            dirname: this.dirname,
            port: this._port,
            countStarts: this._countStarts,
            methods: this._authMethods
        }));
    }

    private loadStatus(){
        let configs = require( this.configFile );
        if( !configs ) return;
        this.code = configs.code;
        this._port = Number( configs.port );
        this._countStarts = Number( configs.countStarts );
        this._authMethods = configs.methods
    }

    private async notifyStartListener( startStatus:PGStatus[] ){
        if( !startStatus.includes( PGStatus.START_SUCCESS_ANOTHER ) ){
            this._countStarts++;
            this.saveStatus();
        }

        for (const callback of this._listener[ ListenerEvent.START ]) {
            await callback(ListenerEvent.START, {countStarts: this._countStarts});
        }
    }

    async start():Promise<PGStatus[]>{
        return new Promise( resolve => {
            this.__start( "PUBLIC START" ).then( value => {
                if( value.includes( PGStatus.OK ) ) this.notifyStartListener( value  ).then( () => {
                    resolve( value )
                }); else resolve( value )
            })
        })
    }

    private async __start( req?:string ):Promise<PGStatus[]>{
        this.debug( DEBUG_INFO, `START CLUSTER FOR ${ req }`, req  );
        return new Promise( async (resolve, reject) => {
            const status = await this.status();
            const dirStatus = this.dirStatus();

            this.debug( DEBUG_INFO, `DATABASE DATA DIR:  `, this.dataDir );

            if( !pgServer.isRecognized( this.PG_VERSION, this.upVersion) ){
                return  resolve( [PGStatus.START_NEED_INSTALLATION ] );
            } else if( status === PGClusterStatus.DIR_NOT_EXISTS ) return resolve( [ PGStatus.START_NEED_CONFIGURATION ] )
            else if( status === PGClusterStatus.DIR_NOT_DATABASE_CLUSTER ) return resolve([ PGStatus.START_NEED_CONFIGURATION ]);
            else if( status === PGClusterStatus.CLUSTER_STOPPED ){


                const start:ChildProcess = spawn( SILENT_COMMAND, [ "pg_ctl",
                    "-D", dirStatus.dataDir,
                    "-l", path.join( dirStatus.dataDir, "logfile.log" ),
                    "start"
                ]);
                this._startPidNumber = start.pid;

                let error;
                start.on( "error", ( reasson )=>{
                    error = reasson;
                });
                start.stdout.on( "data", chunk=> this.debug(  DEBUG_LOG, chunk.toString() ));
                start.stderr.on( "data", chunk=> this.debug( DEBUG_LOG, chunk.toString() ));
                start.on( "exit", (code, m) =>{
                    if( code === 0 ){
                        this.debug( DEBUG_INFO, chalk.greenBright( "[PG-CTP:START|OK] database cluster started with current process!" ) );
                        let __test = ( retry?:number )=>{
                            retry = ( retry||0 )+1;
                            if( retry > 1 ) this.debug( DEBUG_WARN, "RETRY TEST SUPER USER CONNECTION "+retry+" TIME" )
                            this.testConnection( "START-CLUSTER-PROCESS:OWNER" ).then( testResult => {
                                if ( testResult.includes( PGStatus.TEST_SUCCESS ) ) resolve( [ ...testResult,  PGStatus.OK, PGStatus.TEST_SUCCESS ] )
                                else if( testResult.includes( PGStatus.TEST_WAIT ) ){
                                    setTimeout( ()=>{
                                        __test( retry );
                                    }, 1500 );
                                }
                                else promiseResolveAny( this.stop() ).then( value => {
                                        resolve( [ PGStatus.CONFIG_ERROR ])
                                    })
                            })
                        };
                        __test();

                    }
                    else if( error ) return reject( error );
                    else{
                        let message = "Algo deu mal ao iniciar o banco de dados";
                        let error =  new Error( message );
                        this.debug( DEBUG_ERROR, message, error );
                        reject( error )
                    }
                });
            } else if( status === PGClusterStatus.CLUSTER_RUNNING ){
                this.debug( DEBUG_WARN, chalk.yellowBright( "[PG-CTP:START|SKIP] database cluster is already started by other external process!" ) );
                this.testConnection( "START-CLUSTER-OTHER:GUEST" ).then( testResult => {
                    if ( testResult.includes( PGStatus.TEST_SUCCESS) ) resolve( [ ...testResult, PGStatus.OK, PGStatus.START_SUCCESS_ANOTHER, PGStatus.START_SUCCESS ] );
                })
            } else {
                this.debug( DEBUG_ERROR, chalk.redBright( "[PG-CTP:START|SKIP] NOT DETERMINED START!" ) );
                resolve( [ PGStatus.START_REJECTED ] )
            }
        });
    }
    async testConnection( debug?:string ):Promise<PGStatus[]>{
        this.debug( DEBUG_INFO, `TESTING SUPERUSER ${ this.configs.superuser} CONNECTION WITH ${debug}...`, debug );
        //EXIT 0 | error: '', message: *any
        let connect = psql({
            dbname: "postgres",
            command: "select now();",
            username: this.configs.superuser,
            host: "127.0.0.1",
            "tuples-only": true,
            port: this._port
        }, { env:{ PGPASSWORD: this.configs.superuserPassword }} );

        const promise:Promise<PGStatus[]> =  new Promise((resolve, reject) => {
            processListen( connect, {} ).then( result => {
                if( result.code === 0 ){
                    this.debug( DEBUG_INFO, `TESTING SUPERUSER ${ this.configs.superuser} CONNECTION WITH ${debug}... [SUCCESS]`, debug );
                    return resolve( [ PGStatus.OK, PGStatus.TEST_SUCCESS ] );
                } else if ( result.code === 2 && result.stderr.includes( "starting up" ) ){
                    return resolve( [PGStatus.TEST_WAIT] )
                }


                this.debug( DEBUG_INFO, `TESTING SUPERUSER ${ this.configs.superuser} CONNECTION WITH ${debug}... [FAILED]`, debug, result );
                this.debug( DEBUG_ERROR, "value.outError", result.stderr )
                return resolve( [ PGStatus.FAILED, PGStatus.TEST_FAILED ] );
            }).catch( reason => {
                this.debug( DEBUG_INFO, `TESTING SUPERUSER ${ this.configs.superuser} CONNECTION WITH ${debug}... [ERROR]`, debug );
                this.debug( DEBUG_ERROR, reason );
                return resolve( [ PGStatus.FAILED, PGStatus.TEST_ERROR, PGStatus.TEST_FAILED ] );
            })
        });
        promise.catch( reason => {
            this.debug( DEBUG_ERROR, reason );
            return Promise.resolve( false );
        });
        return  promise;
    }

    static stopDatabaseClusterSync( dataDirname:string ){
        return spawnSync( "pg_ctl", [ "-D", dataDirname,  "stop" ] );
    }

    static stopDatabaseListen( dataDirname:string ){
        return processListen( this.stopDatabaseCluster( dataDirname ))
    }
    static stopDatabaseCluster( dataDirname:string ){
        return spawn( "pg_ctl", [
            "-D", dataDirname,
            "stop"
        ])
    } stop() {
        return PostgresCluster.stopDatabaseListen( this.dataDir );

    } restart():Promise<PGStatus[]> {
        return this.status().then( status => {
            if( status === PGClusterStatus.CLUSTER_RUNNING ){
                return this.stop().then( stop => {
                    return this.__start( "RESTART:WHEN RUNNING");
                })
            } else return  this.__start( "RESTART:WHEN STOPPED");
        })
    } dirStatus( args?:{root:string, dirname:string, code:string}):DirStatus{
        if( !args ) args = {
            dirname: this.dirname,
            root: this.root,
            code: this.code
        }


        if( !args.dirname || !args.root ) return;
        let code = args.code;
        let name =(code)? `${args.dirname}-${code}`: args.dirname;
        let dataDir = path.join( this.root, name );
        let exists = fs.existsSync( dataDir );
        let empty;
        if( exists) empty = fs.readdirSync(dataDir ).length === 0;
        else empty = true;

        return { dirname:args.dirname, name, exists, empty, root: args.root,
            dataDir,
        };
    }

    async createDir( whenExists?:PGCtlWhenExists ):Promise<DirCreate>{

        let min = 1000000;
        let max = 9999999;

        let status:PGClusterStatus;
        let dirStatus:DirStatus;
        let code = this.code;

        const checkDir = async () =>{

            dirStatus = this.dirStatus( {
                code: code,
                dirname: this.dirname,
                root: this.root
            });
            status = await pgctlStatus( dirStatus.dataDir );
            const test = await this.testConnection( "CREATE-DIR" );


            if( dirStatus.exists && whenExists === "RANDOM" ) return true;
            else if( dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-NOT-EMPTY" ) return true;
            else if( dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-NOT-CLUSTER" && status === "PGClusterStatus.DIR_NOT_PG_CLUSTER" ) return true;
            else if( dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-CLUSTER-RUNNING" && status === "PGClusterStatus.CLUSTER_RUNNING" ) return true;
            else if( dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-CLUSTER-CANNOT-CONNECT" && status === "PGClusterStatus.CLUSTER_RUNNING" && !test) return true;

            return false;
        }

        while ( await checkDir() ){
            code = `${Math.trunc( Math.random()* (max-min)+min )}`;
        }

        return {
            ...dirStatus,
            code,
            status
        }
    }
}

export type Connection = { username: string, password?: string, database: string, host: string };



