import path from "path";
import {compileArgs, CompileArgs} from "./compile";
import fs from "fs";
import * as Path from "path";
import {spawnSync} from "child_process";
import chalk from "chalk";
import {System} from "kitres/src/core/system";
export type ResourceItem =  { base: string,                    dist: string,                  filter: string|RegExp };
export type CompileRes = {
    entry:string,
    output:string,
    cwd:string
    package:string,
    root:string,
    distRoot:string,
    temps:ResourceItem[],
    raws:ResourceItem[]
}


const  raws:ResourceItem[] = [
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "package.json" },
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "tsconfig.json" },
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "VERSION" },
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "TAG" },
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "REVISION" },
    /*language=file-reference*/  { base: "/",                    dist: "/",                  filter: "kitres-*.tgz" },
    /*language=file-reference*/  { base: "/etc",                 dist: "/etc",                  filter: "anchorio.conf" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.exe" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.vbs" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.bat" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.cmd" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.exe.ts" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.exe.js" },
    /*language=file-reference*/  { base: "/bin",                 dist: "/bin",               filter: "**/*.exe.js.map" },
    /*language=file-reference*/  { base: "/client/app",          dist: "/app",               filter: "**/*.ts" },
    /*language=file-reference*/  { base: "/client/app",          dist: "/app",               filter: "**/*.js" },
    /*language=file-reference*/  { base: "/client/app",          dist: "/app",               filter: "**/*.js.map" },
    /*language=file-reference*/  { base: "/client/app",          dist: "/app",               filter: "**/*.css" },
    /*language=file-reference*/  { base: "/client/app",          dist: "/app",               filter: "**/*.html" },
    /*language=file-reference*/  { base: "/client",              dist: "/client",            filter: "**" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "status.ts" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "status.js" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "status.js.map" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "index.ts" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "index.js" },
    /*language=file-reference*/  { base: "/build/",              dist: "/build/",            filter: "index.js.map" },
    /*language=file-reference*/  { base: "/build/kconst",        dist: "/build/kconst",      filter: "**/*.ts" },
    /*language=file-reference*/  { base: "/build/kconst",        dist: "/build/kconst",      filter: "**/*.js" },
    /*language=file-reference*/  { base: "/build/kconst",        dist: "/build/kconst",      filter: "**/*.js.map" },
    /*language=file-reference*/  { base: "/build/db",            dist: "/build/db",          filter: "**/*.sql" },
    /*language=file-reference*/  { base: "/build/db",            dist: "/build/db",          filter: "**/*.db" },
    /*language=file-reference*/  { base: "/build/db",            dist: "/build/db",          filter: "**/*.ts" },
    /*language=file-reference*/  { base: "/build/db",            dist: "/build/db",          filter: "**/*.js" },
    /*language=file-reference*/  { base: "/build/db",            dist: "/build/db",          filter: "**/*.js.map" },
    // /*language=file-reference*/  { base: "/build/installers",    dist: "/build/installers",  filter: "**" },
    /*language=file-reference*/  { base: "/server",              dist: "/server",            filter: "**/*.ts" },
    /*language=file-reference*/  { base: "/server",              dist: "/server",            filter: "**/*.js" },
    /*language=file-reference*/  { base: "/server",              dist: "/server",            filter: "**/*.js.map" },
    /*language=file-reference*/  { base: "/server",              dist: "/server",            filter: "**/*.json" },
    /*language=file-reference*/  { base: "/server",              dist: "/server",            filter: "**/*.json5" },
    /*language=file-reference*/  { base: "/server/lib/json",     dist: "/server/lib/json",            filter: "**" },
    /*language=file-reference*/  { base: "/server/resources",    dist: "/server/resources",  filter: "**" },
    /*language=file-reference*/  { base: "/libs",                dist: "/libs",  filter: "**" },

    // /*language=file-reference*/  { base: "/database/patch",      dist: "/database/patch",            filter: "**/*.js" },
    // /*language=file-reference*/  { base: "/database/patch",      dist: "/database/patch",            filter: "**/*.js.map" },
    // /*language=file-reference*/  { base: "/database/patch",      dist: "/database/patch",            filter: "**/*.json" },
    // /*language=file-reference*/  { base: "/database/patch",      dist: "/database/patch",            filter: "**/*.json5" },
    // /*language=file-reference*/  { base: "/database/patch",      dist: "/database/patch",            filter: "**/*.sql" },

    //Revs folder
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.ts" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.js" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.js.map" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.json" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.json5" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.sql" },
    /*language=file-reference*/  { base: "/database/",      dist: "/database/",            filter: "**/*.base" },
];


let getNodeJs = ()=>{

//language=file-reference
    if( !fs.existsSync( Path.join(__dirname, "../bin/node.exe")) ){
        let node = System.node();
        raws.push({base: Path.relative( Path.join(__dirname, "../"), Path.dirname( node )), dist: "/bin", filter: "node.exe"})
    }
}

getNodeJs();


let result = spawnSync("where", ["nw"]);

if( result.status === 0 ){
    let res = result.stdout.toString().trim();
    let dir = Path.dirname( res );
    //language=file-reference
    let base = Path.relative(Path.join(__dirname, "../../"), dir );
    console.log( { res, dir, base })
    raws.push( { base:base, dist:"/nw", filter: "**" } );
} else {
    console.error( chalk.redBright.bold( "NW not founds" ) );
    process.exit(0);
}

const temps:ResourceItem[] = [
    { base: "/",                    dist: "/",                  filter: "tsconfig.json" },
    { base: "/build/kconst",        dist: "/build/kconst",      filter: "**/*.js" },
]

export function res():CompileRes{
    //language=file-reference
    const _package = path.join( __dirname, '../../package.json' );
    const root = path.dirname( _package );
    const distRoot = path.join( root, `../maguita_${ compileArgs.platform }` );
    fs.mkdirSync( distRoot, { recursive: true } );

    //language=file-reference
    const entry = path.join( root, "/bin/maguita.exe.js" );
    const output = path.join(  root, "bin/maguita.exe" );
    const cwd = path.join( root, "bin" );

    //language=file-reference
    return {
        entry,
        output,
        cwd,
        package: _package,
        root,
        distRoot,
        temps,
        raws
    }
}


export function resDescribe(){

}
