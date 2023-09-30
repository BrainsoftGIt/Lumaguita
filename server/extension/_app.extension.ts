import {args, describeArgs, lineArgs} from "../global/args";
import path from "path";
import {sys} from "../global/sys";
import {serverNotify} from "../snotify";
import {createCTRL, detectServer, ServerCtl} from "./ctrl";
import detectPort from "detect-port";
import {openPorts} from "./open-ports";
import fs from "fs";
import {folders} from "../global/project";
import {autoDumpService, dumpNow} from "../service/database.service/dumps";
import {pgRevision} from "../service/database.service/kitres/revison";

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
            if( error ){
                console.error( error )
                serverNotify.loading( "FAILED!" );
                serverNotify.loadingBlock( "Database upgrade patches... [FAILED]" );
                serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados." );
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
        serverNotify.loadingBlockItem( "Criando copia de segurança preventiva..." );
        dumpNow(null, { suffix: "before-upgrade" }).then( value => {
            dbPatch().then( pathResult => {
                resolve( pathResult );
            })
        }).catch( reason => {
            serverNotify.loading( "FAILED!" );
            serverNotify.loadingBlock( "Database upgrade patches... [FAILED]" );
            serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados." );
            resolve( false );
        })
    });
}

const startServer = ( onReady:()=>void )=>{
    serverNotify.loadingBlock( "A iniciar o servidor..." );
    const { appModules } = require( "../modules" );
    module.exports = {
        appModules
    }

    if( typeof onReady === "function" ){
        onReady();
    }
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
    const { autoDumpService } = require( "../service/database.service/dumps" );
    const { startApplicationDatabase } = require( "./database.extension" );
    createCTRL();
    detectPort( args.appPort ).then( async port => {

        args.appPort = port;
        serverNotify.loading( "A configurar ambiente..." );

        openPorts().then()

        serverNotify.loading( "A carregar módulos..." );

        serverNotify.loadingBlock( "A iniciar o tray..." );
        const { systrayStart } = require( "../global/systray" );
        systrayStart();

        fs.writeFileSync( path.join( folders.home, "current.pid" ), String( process.pid ) );

        console.log( args.dbMode );
        if( args.dbMode === "app" ){
            args.dbPort = args.dbPortDatabaseApp;
            serverNotify.loadingBlock( "A Recuperar base de dados..." );
            startApplicationDatabase()
                .then( value => {
                    prepareDatabase().then( value1 => {
                        if( !value ){
                            return process.exit(-1 );
                        }
                        serverNotify.loadingBlock( "A iniciar o servidor..." );
                        startServer( serverNotify.ready );
                    })

                });
        } else if( args.dbMode === "system" ){
            serverNotify.loadingBlock( "A iniciar o servidor..." );
            prepareDatabase().then( value1 => {
                if( !value1 ){
                    return process.exit(-1 );
                }
                serverNotify.loadingBlock( "A iniciar o servidor..." );
                startServer( serverNotify.ready );
            })

            return;
        } else{
            console.log( { prepareDb:true })
            prepareDatabase().then( value1 => {
                if( !value1 ){
                    return process.exit( -1 );
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
