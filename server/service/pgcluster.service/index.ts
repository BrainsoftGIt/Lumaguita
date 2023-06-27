import {folders, project } from "../../global/project";
import {args} from "../../global/args";
import {compileDatabase } from "../../../build/db/install";
import {ListenerEvent, PostgresCluster, DebugCallback, PGStatus} from "../../lib/postgres/pg-ctl";
import {DEFAULTS} from "../../global/defaults";
import fs from "fs";
import path from "path";
import JSON5 from "json5";
import {CLIDetection} from "../../lib/postgres/tools/version";
import {includeAll} from "../../lib/utils/array";
import {appToaster} from "../../lib/toaster";


type CurrentConfigs = {
    dataDirname: string,
    versionName: string,
    versionDetection: CLIDetection
};

export const pgCtl = new (class Service {
    private __instance:PostgresCluster;
    private _currentDataDirname:string;
    debug:DebugCallback

    get dataDirname():string {
        let currentDirname = this._currentDataDirname;
        if( !currentDirname && fs.existsSync( path.join( folders.pgHome, "current.json5" ) ) ) {
            let current:CurrentConfigs = JSON5.parse(  fs.readFileSync( path.join( folders.pgHome, "current.json5" ) ).toString( "utf-8" ) );
            currentDirname = current?.dataDirname;
        }

        if( !currentDirname && fs.existsSync( path.join( folders.pgHome, "base" ) ) ){
            currentDirname = path.join( folders.pgHome, "base" );
        }
        return  currentDirname;
    }

    private start (){
        const selfPgCtl = this;
        console.log( "check database server app support status... ")
        if( !this.__instance ) this.__instance = new PostgresCluster( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP, folders.pgHome, "base", {
            superuserPassword: args.dbPasswordSuperUser,
            detached: true,
            configs: {
                listen: "*",
                port: { number: args.dbPortDatabaseApp }
            }, superuser: args.dbSupperUser,
            database: "postgres"
        }, {
            debug: this.debug,
            ready( instance, ready ){
                selfPgCtl._currentDataDirname = instance.dataDir;
                //Save current data dirname
                let version = instance.version;
                let currentConfigs:CurrentConfigs = {
                    dataDirname: instance.dataDir,
                    versionName: version.versionName,
                    versionDetection: version
                }
                fs.writeFileSync( path.join( folders.pgHome, "current.json5" ), JSON5.stringify( currentConfigs, null, 2 ));

                console.log( "check database server app support status... [ok]" );

                instance.on( ListenerEvent.INIT_DB, async (EVENT) => {
                    let __notifyApplicationReady = ready;
                    console.log( "ListenerEvent.INIT_DB callback called")
                    console.log( "compile database structure..." );
                    return compileDatabase( args ).then( value => {
                        console.log( "compile database structure... [OK]" );
                        __notifyApplicationReady();
                    })
                });

                instance.on( ListenerEvent.START, EVENT => {
                    console.log( "STARTING...[OK]" );
                    args.dbPort = instance.port;
                    ready();
                })

                console.log( "start app database cluster ..." );
                instance.start().then( value => {
                    if( includeAll( [PGStatus.TEST_SUCCESS, PGStatus.START_SUCCESS ], ...value ) ) console.log( "start app database cluster... [SUCCESS]" );
                    else console.log( "start app database cluster... [FAILED]" );
                    console.log( `[database] start result ${ value.join("|") }`)


                    if( value.includes( PGStatus.START_NEED_CONFIGURATION ) ){
                        instance.pushAuth( {
                            TYPE: "host",
                            ADDRESS: "*",
                            METHOD:"md5",
                            DATABASE:"sameuser",
                            USER: "all"
                        });

                       instance.pushAuth( {
                            TYPE: "host",
                            ADDRESS: "*",
                            METHOD:"md5",
                            DATABASE: args.dbName,
                            USER: args.dbUser
                        });

                       instance.pushAuth( {
                            TYPE: "host",
                            ADDRESS: "*",
                            METHOD:"md5",
                            DATABASE: args.dbName,
                            USER: args.dbUserClone
                        });
                        console.log( "initializing cluster app database server ...")
                        instance.initDatabaseCluster("RANDOM-IF-CLUSTER-CANNOT-CONNECT" )
                            .then( initdbResult => {
                                console.log( `initializing cluster app database server ... [${ initdbResult.result? "INITIALIZED": "FAILED" }]`)
                            }).catch( reason => {
                                console.error( reason );
                        })
                    }
                }).catch( reason => {

                    appToaster( {
                        icon: project.icon.png,
                        title: "MAGUITA",
                        subtitle: "SERVIÇE FAILED!",
                        message: "Falha ao iniciar o serviço de banco de dados...! Proucupe pelo suporte caso o problema persistir!\n",
                    }, (err, response, metadata) => {
                        // process.exit( -1 );
                    });

                    console.error( reason );
                })

            }
        })

        return this.__instance;
    }
    get instance():PostgresCluster{
        return this.start();
    }

    get hasInstance(){ return !!this.__instance; }

    get isServiceOwner(){
        if( !this.hasInstance ) return false;
        else return this.instance.isServiceOwner;
    }
})