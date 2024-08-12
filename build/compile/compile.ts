import {args} from "../../server/global/args";

require( 'source-map-support' ).install();

import {Arguments} from "zoo.util/lib/arguments";

import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import {linkedSpawn} from "../../server/lib/utils/process/linked-spawn";
import copy, { default as rcp } from "recursive-copy";

import {fork, spawn, spawnSync,} from "child_process";
import {res} from "./res";
import {processListen} from "../../server/lib/utils/process/listen";
import {promiseResolve } from "../../server/lib/utils/promise";
import {appToaster} from "../../server/lib/toaster";
import * as Path from "path";
import {installerDirective} from "./installer.iss.js";
import {VERSION} from "../../server/version";
import {tsc} from "./index";

export type CompileArgs = {
    full:boolean
    fast:boolean,
    clean:boolean,
    platform:"win32"|string
}

const line = new Arguments< CompileArgs >(  true );

//Run args configs
line.define( { name: "full", type: Boolean, alias: "A" } );
line.define( { name: "fast", type: Boolean, alias: "f" } );
line.define( { name: "clean", type: Boolean, alias: "c" } );
line.define( { name: "platform", type: String, alias: "p", value: os.platform() } );

export const compileArgs = line.values;


export function clean( args:CompileArgs ){
    const _res  = res();
    if( args.clean && args.full ){
        fs.rmSync( _res.distRoot, { recursive: true }  )
    } else  {
        fs.readdirSync( _res.distRoot ).forEach( fileName =>  {
            try {
                if (fileName === "node_modules") return;
                let state = fs.statSync(path.join(_res.distRoot, fileName));
                if (state.isDirectory()) fs.rmSync(path.join(_res.distRoot, fileName), {recursive: true});
                else if (state.isFile()) fs.unlinkSync(path.join(_res.distRoot, fileName));
                console.log("[clean:file] ", fileName, "...[OK]")
            } catch ( ex ){
                console.error( ex )
                appToaster( {
                    title: "Error",
                    message: ex["message"]
                } )
                throw ex;
            }
        })
    }
}


async function raw(){
    const _res  = res();
    let filters = [ ..._res.raws, ..._res.temps ];
    for (let i = 0; i < filters.length; i++) {
        let next = filters[ i ];
        // let dist = path.join( );
        await rcp( path.join( _res.root, next.base ), path.join( _res.distRoot, next.dist ), {
            filter: next.filter,
            overwrite: true,
            junk: true,
            dot: true,
        }).on(copy.events.COPY_FILE_START, function(copyOperation) {
            console.info( `[${next.base}]`, 'Copying file ' + copyOperation.src + '...');
        }).on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
            console.info(`[${next.base}]`,'Copied to ' + copyOperation.dest);
        }).on(copy.events.ERROR, function(error, copyOperation) {
                console.error( `[${next.base}] `+'Unable to copy ' + copyOperation.dest);
        })
    }
}



function installDependency(){
    const _res  = res();
    let npm = "npm";
    if( os.platform() === "win32" ){
        npm = "npm.cmd";
    }

    let nexttable = [
        ()=>{
            console.log( "building kconst configs... DEV" )
            return processListen( fork( path.join( _res.root, "build/kconst" ), [ "--mode", "dev" ], {
                cwd: _res.root,
                stdio: "inherit"
            }), {
                stdout( chunk ) { console.log( `[install:build] ${ chunk.toString() }` ) },
                stderr( chunk ) { console.log( `[install:build] ${ chunk.toString() }` ) },
            });
        }, ()=> {
            console.log( "DESTINATION", _res.distRoot, fs.existsSync( _res.distRoot ))
            console.log( npm, "install", "--only", "production")

            return processListen( spawn(npm, ["install", "--only", "production"], {
                cwd: _res.distRoot,
                stdio: "inherit",
                shell: true
            }), {
                stdout(chunk) {console.log(`[dependency:install|prod] ${chunk.toString()}`)},
                stderr(chunk) {console.log(`[dependency:install|prod] ${chunk.toString()}`)}
            });
        }, ()=> {
            console.log( "Installing kitres file")
            let kitres = require("../../package.json" );
            let parts = kitres.dependencies["kitres"].split(":");
            let kitResPack = "kitres";
            if( parts.length === 2 ){
                kitResPack = Path.join( _res.distRoot, parts[1] )
            }
            return processListen( spawn(npm, ["install", kitResPack ], {
                cwd: _res.distRoot,
                stdio: "inherit",
                shell: true
            }), {
                stdout(chunk) {console.log(`[dependency:install|prod] ${chunk.toString()}`)},
                stderr(chunk) {console.log(`[dependency:install|prod] ${chunk.toString()}`)}
            })
        }, ()=> {
            return processListen(spawn(npm, ["audit", "fix", "--force"], {
                cwd: _res.distRoot,
                stdio: "inherit",
                shell: true

            }), {
                stdout(chunk) {
                    console.log(`[dependency:install|fix-prod] ${chunk.toString()}`)
                },
                stderr(chunk) {
                    console.log(`[dependency:install|fix-prod] ${chunk.toString()}`)
                }
            })
        }, ()=> {
            return processListen(spawn(npm, ["install", "kconst", "terminal-kit", "--dev"], {
                cwd: _res.distRoot,
                stdio: "inherit",
                shell: true

            }), {
                stdout(chunk) {
                    console.log(`[dependency:install|dev] ${chunk.toString()}`)
                },
                stderr(chunk) {
                    console.log(`[dependency:install|dev] ${chunk.toString()}`)
                }
            })
        }, ()=>{
            return new Promise( (resolve, reject) => {
                console.log( "building kconst configs..." )
                require( path.join( _res.distRoot, "build/kconst" ) )
                    //.kconstBulder( path.join( _res.distRoot, "build/kconst" ), "public", "public" );
                fs.rmSync( path.join( _res.distRoot, "build/kconst" ), { recursive : true } );
                resolve( true );
            });
        }
    ]

    let next = ()=>{
        if( !nexttable.length ) return;
        let _next = nexttable.shift();
        if( !_next ) return next();
        console.log(`[dependency:next]`);
        let process = _next();
        promiseResolve( process ).then( value => {
            console.log( `[dependency:next|resolved]` )
            next();
        })
    }
    next();
}

function release( args:CompileArgs  ){

    //language=file-reference
    fs.writeFileSync( Path.join( __dirname, "../../build/compile/installer.iss"), installerDirective );
    linkedSpawn( "iscc", [
        //language=file-reference
        path.join( __dirname, "./installer.iss" )
    ], { pipeConsole: true }).linkSpawn( (code, signal, error, errs) => {
        if( error ) console.log( error );
        console.log( "RELEASE END WITH CODE", code );
        if( code === 0 ){
            VERSION.unlock();
            VERSION.increment();
        }
    });
}

function patches( args:CompileArgs  ){
    linkedSpawn( "iscc", [
        //language=file-reference
        path.join( __dirname, "./patches.iss" )
    ], { pipeConsole: true })
}

function deps( args:CompileArgs  ){
    linkedSpawn( "iscc", [

        //language=file-reference
        path.join( __dirname, "./deps.iss" )
    ], { pipeConsole: true })
}

async function build( args:CompileArgs  ){
    const _res  = res();
    console.log( "ROOT", _res.root );
    console.log( "DIST", _res.distRoot );
    console.log( "VERSION", VERSION.TAG );
    console.log( "GIT-REVISION", VERSION.REVISION );
    console.log( "GIT-TAG", VERSION.GIT_TAG );

    require("../clean").cleanJs( path.join(__dirname, "../../"))
    //language=file-reference
    tsc( path.join( __dirname, "../.." ) );

    clean( args );

    fs.mkdirSync( _res.distRoot, { recursive: true }  )
    if( !args.fast ) await raw();


    if( args.fast ) return;
    if( !args.fast ) installDependency()

}

line.defineCommand( { name: "destroy", callback: receiver => {
    compileArgs.clean = true;
    compileArgs.full = true;
    clean( compileArgs );
}});

line.defineCommand( { name: "start", callback: receiver => {
    VERSION.increment();
    build( receiver.options ).then()
}})

line.defineCommand( { name: "release", callback: receiver => {
    release( receiver.options );
}})

line.defineCommand( { name: "release:patches", callback: receiver => {
    patches( receiver.options );
}})

line.defineCommand( { name: "release:deps", callback: receiver => {
    deps( receiver.options );
}});

console.log( args );

line.execute();
