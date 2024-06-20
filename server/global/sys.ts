
import {args } from "./args";

import op from "open";
import { SpawnOptions } from "child_process";
import * as path from "path";
import {execFilePain} from "../lib/utils/process/win32";
import {PostgresCluster} from "../lib/postgres/pg-ctl";
import {processListen} from "../lib/utils/process/listen";
import {launcherStatus} from "../launcher/status";


const { spawn }  = require('child_process')


export const sys = new (class Sys{
    openApp( opts?:{ browser?:string, app?:string, address?:string } ){
        if( !opts ) opts = {};
        let location = opts.browser;
        let address = opts.address || "127.0.0.1";
        let url = `http://${address}:${args.appPort}`;
        if( location ) url = `${url}/${location}`;
        console.log( "opening...app", url );
        op( url, {} ).catch( reason => { console.error( reason ) })


    } openUrl( url:string ){
        op( url, {})
            .then( value => {
                console.log( `[URL:opened] ${ url }` );
            })
            .catch( reason => {
                console.log( `[URL:failed] https://www.brainsoftstp.com/luma`)
                console.error( reason );
            })
    } install( module:string|"postgres" ){
        this.run( "install", "linked", {}, ...[  "--module", module ] );

    } play( mode?:"linked"|"silent" ){
        let args = process.argv.filter( ( (value, index) => index >= 2 ) );
        this.run( "play", mode, {}, ...args );

    } run( command:string, mode?:"linked"|"silent", opts?:SpawnOptions, ...argv:string[] ){
        if( !mode ) mode = "linked";
        let callback:number = Number( process.env[ "MAGUITA_APP_CALLBACK" ] );
        if( !callback || !Number.isSafeInteger( callback ) || Number.isNaN( callback )) callback = 0;
        if( callback > 3 ) return;

        opts = opts || {};
        opts.env = Object.assign( opts.env || {}, {
            [ "MAGUITA_APP_CALLBACK" ]: callback+1
        })

        if( mode === "silent" ){
            let launcher = this.launcher();
            let useArgs = [];
            useArgs.push( ...launcher.executableArgv );
            useArgs.push( command );
            useArgs.push( ...argv );
            opts.detached = true;
            opts.windowsHide = true;
            const child = execFilePain( process.argv[0], useArgs, Object.assign( {}, opts ), [ "background", "noWait" ]);
            console.log( "Execuntando em modo silencioso..." );
            child.on( "close", (code, signal) => {
               console.log( "Execusão em modo silencioso... [ATIVO]", { code, signal });
            });
        } else {
            const sp = spawn( process.argv[0], [
                process.argv[1],
                command,
                ...argv,
            ], Object.assign( {}, opts ));

            if( mode === "linked" ){
                sp.stdout.pipe( process.stdout );
                sp.stderr.pipe( process.stderr );
                // sp.stdin.pipe( process.stdin );
            } else {
                sp.unref();
            }
        }
    } shutdown( ...beforeWorks:(()=>Promise<any>)[] ) {
        this.exit( () => {
            const { pgCtl } = require("../service/pgcluster.service" );
            let stop = PostgresCluster.stopDatabaseCluster( pgCtl.dataDirname );
            return processListen( stop, { console: true } );
        },... beforeWorks );



    } launcher(){
        let executable = process.argv[ 0 ];
        let main = process.argv[ 1 ];
        let execName = path.basename( process.argv[0] );
        let argv = process.argv.filter( (value, index) => index > 1 );
        let executableArgv = [];
        if( [ "node", "node.exe", "node.cmd", "node.bat" ].includes( execName ) ){
            executableArgv.unshift( main );
        }

        return { executable, executableArgv, main, argv };

    } exit( ...beforeWorks:(()=>Promise<any>)[] ){
        console.log( "[EXIT] Iniciando o processo de termino correto..." );
        let next = ( )=>{
            let _next = beforeWorks.shift();
            if( !_next ){
                console.log( "[EXIT] Iniciando o processo de termino correto... [OK]" );
                console.log( "[EXIT] good bay!" );
                setTimeout( args1 =>  process.exit( 0 ), 1500 );
            } else {
                if( typeof _next !== "function" ) next();
                _next().then( value => {
                    next();
                }).catch( reason => {
                    console.error( reason );
                    next();
                })
            }
        }
        next();
    } restart( ...beforeWorks:(()=>Promise<any>)[] ){
        this.exit( ...beforeWorks, () => {

            return new Promise( resolve => {
                let _useArgs = process.argv.filter( ( (value, index) => index >= 2 ) );
                if( [ "node", "node.exe" ].includes( path.basename( process.argv[ 0 ] ) ) )
                    _useArgs.unshift( process.argv[ 1 ]);
                const _childProcess = execFilePain( process.argv[0], _useArgs, {
                    detached: true
                }, [ "noWait", launcherStatus.launcher === "exe.ts"? "background"  : "noWait" ] );
                _childProcess.unref();
                _childProcess.on( "close", code => {
                    resolve( true );
                })
            });
        });
    }
});

export function getSys(){
    return require("../global/sys").sys;
}
