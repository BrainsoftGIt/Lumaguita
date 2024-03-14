import {args, describeArgs, lineArgs} from "../global/args";
import path from "path";
import {sys} from "../global/sys";
import {serverNotify} from "../snotify";
import {createCTRL, detectServer, ServerCtl} from "./ctrl";
import detectPort from "detect-port";
import {openPorts} from "./open-ports";
import fs from "fs";
import {Folders} from "../global/project";
import {autoDumpService} from "../service/database.service/dumps";
import {pgRevision} from "../service/database.service/kitres/revison";
import chalk from "chalk";
import os from "os";
import {spawn} from "child_process";
import Path from "path";
import { FlocotoListener } from "kitres/src/core/util/flocoto";

export function getSys(){
    return require("../global/sys").sys;
}

let dbPatch = ():Promise<boolean>=>{
    return new Promise( resolve => {
        serverNotify.loadingBlock( "Database upgrade patches..." );
        serverNotify.loadingBlock( "Database upgrade patches... collecting patch" );
        let collectResult = pgRevision.collect();
        serverNotify.loadingBlock( "Database upgrade patches... applying patch" );
        if( collectResult?.error ){
            console.error( `Erro ao collectar os patches!` );
            console.error( collectResult.error );
            serverNotify.loading( "FAILED!" );
            serverNotify.loadingBlock( "Database upgrade patches... [FAILED]" );
            serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados | erro ao collectar os paths" );
            return resolve( false );
        }


        pgRevision.setup( (error, block) => {
            //Quando a nova versão de revisão do banco de dados for menor que a atual versão então abortart
            if( error && error.message.startsWith( "The current database version is higher than the new database version!") ){
                serverNotify.loading( "WARING!" );
                serverNotify.loadingBlock( "Database patches applies skipped[dbPatch|WARING]" );
                serverNotify.loadingBlockItem( "Não aplicou a revisão no banco de dados, porque a versão do novo core é inferior a versão do utimo core aplicado no banco de dados[dbPatch|WARING]." );
                console.warn( chalk.yellowBright.bold.italic.underline( "SALTOU O PROCESSO DE APLICAÇÃO DE REVISÃO...! A REVISIÃO ATUAL É INFERIRO A ULTIMA REVISÃO APLICADA" ) );
                return resolve( true );
            }

            if( error ){
                console.error( error )
                serverNotify.loading( "FAILED!" );
                serverNotify.loadingBlock( "Database upgrade patches... [dbPatch|FAILED]" );
                serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados [dbPatch|FAILED]." );
                return resolve( false );
            }
            autoDumpService().then()
            serverNotify.loadingBlock( "Database upgrade patches... [SUCCESS]" );
            resolve( true );
        });
    })
}

export function prepareDatabase():Promise<boolean>{
    return new Promise( (resolve, reject) => {
        serverNotify.loadingBlock( "Manutenção de banco de dados" );
        dbPatch().then( pathResult => {
            resolve( pathResult );
        }).catch( reason => {
            resolve( false );
        });

    });
}

const startServer = ( onReady:()=>void )=>{
    let { loadNamespaceConfigs } = require( "../nsp/index" );

    loadNamespaceConfigs( (error, nsp) => {
        serverNotify.loadingBlock( "A iniciar o servidor..." );
        const { appModules } = require( "../modules" );
        module.exports = {
            appModules
        }

        if( typeof onReady === "function" ){
            const flocotoListener = new FlocotoListener( process );
            flocotoListener.emmiter.notify( "ready",
                require("../../package.json").name,
                true, {
                    port: args.appPort,
                    protocol: args.webProtocol as "http"
                });
            onReady();
        }

        /*language=file-reference*/
        let aio = Path.join( Folders.snapshot, "../AnchorAIOConnect/package.nw/bin/aio.exe"  );
        if( os.platform() !== "win32" ) return;
        if( !fs.existsSync( aio ) ) return;
        setTimeout(()=>{
            let child = spawn( aio, [], {});
            child.on( "error", err => {
                console.log( `AnchorAioConnect error = "${ err.message }"`)
            })
        }, 1000 * 5 );

    });
}

export function requireAppUpdated ( next:()=>void ){

    /*appVersion.checkVersionUpdate().then( newVersionUrl => {
        if( newVersionUrl ) appToaster({
            //language=file-reference
            icon: path.join( __dirname, "../resources/fav/fav.ico" ),
            message: "Nova versão disponivel para transferência",
            title: "Luma",
            timeout: 1000,
            actions: [ "BAIXAR", "PASSAR" ]
        }, (err, response, metadata) => {
            if( response.toLowerCase() === "baixar" ) sys.openUrl( newVersionUrl );
            else appToaster({
                //language=file-reference
                icon: path.join( __dirname, "../resources/fav/fav.ico" ),
                title: "Luma",
                message: "Atualização critica!\nNão pode continuar antes de baixar e instalar essa nova versão!\nEstamos encerrando...",
                timeout: 1000,
            }, (err1, response1, metadata1) => {
                sys.shutdown()
            })
        });
        else next();
    });*/
    next();
}


function proceedPlay(){
    // const { startApplicationDatabase } = require( "./database.extension" );
    createCTRL();
    detectPort( args.appPort ).then( async port => {
        if( args.appPort !== port ) {
            serverNotify.log(chalk.redBright.bold( `A porta padrão do sistema esta sendo ocupado por outro software. O sistema estara funcionando na porta alternativa de ${ port }` ) )
        }

        args.appPort = port;
        serverNotify.loading( "A configurar ambiente..." );

        openPorts()

        serverNotify.loading( "A carregar módulos..." );

        serverNotify.loadingBlock( "A iniciar o tray..." );
        const { systrayStart } = require( "../global/systray" );
        systrayStart();

        fs.writeFileSync( path.join( Folders.home, "current.pid" ), String( process.pid ) );

        serverNotify.log( `Lumaguina application runnning in mode = "${ args.dbMode }"` );
        if( args.dbMode === "app" ){
            args.dbPort = args.dbPortDatabaseApp;
            serverNotify.loadingBlock( "A Recuperar base de dados..." );
            const { pgContext } =  require("../service/database.service/kitres/setup");
            pgContext.setup( (error, result) => {
                if( error || !result.status ){
                    return;
                }
                prepareDatabase().then( prepareResult => {
                    if( !prepareResult ){
                        return;
                    }
                    serverNotify.loadingBlock( "startApplicationDatabase A iniciar o servidor..." );
                    startServer( serverNotify.ready );
                })
            });
        } else if( args.dbMode === "system" ){
            serverNotify.loadingBlock( "A iniciar o servidor..." );
            prepareDatabase().then( prepareResult => {
                if( !prepareResult ){
                    return;
                }
                serverNotify.loadingBlock( "A iniciar o servidor..." );
                startServer( serverNotify.ready );
            })

            return;
        } else{
            prepareDatabase().then( prepareResult => {
                if( !prepareResult ){
                    return;
                }
                serverNotify.loadingBlock( "A iniciar o servidor..." );
                startServer( serverNotify.ready );
            })
        }
    })
}


const play = ()=>{

    serverNotify.loading( "Verificando o servidor..." );

    function next (){

        describeArgs();

        detectServer().then( value => {
            if( value ){
                value.write( ServerCtl.OPEN );
                serverNotify.loading( "Abrindo o sistema" );
                setTimeout( ()=>{
                    sys.exit()
                }, 1000*2 );
            } else proceedPlay()
        })
    }

    requireAppUpdated( next );
}
lineArgs.defineCommand( { name: "play",  callback:play } );
lineArgs.defineCommand( { name: "start",  callback: play } );

lineArgs.defineCommand( receiver => {
    if( lineArgs.command.command && lineArgs.command.command.length > 0  ) return;
    play();
});


