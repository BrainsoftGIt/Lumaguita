import fs from "fs"
import * as Path from "path";
import {spawnSync} from "child_process";
import {nanoid} from "nanoid";


let response = spawnSync( "git", [ "rev-list", "--count", "--all" ]);
const __VERSION = {
    GIT_REVISION:"",
    GIT_TAG: "",
    LAUNCHER_CODE: nanoid(6 ).toUpperCase(),
    IS_GIT: false
}

if( response.status === 0 && !!response.stdout.toString().trim() ){
    __VERSION.IS_GIT = true;
    __VERSION.GIT_REVISION = `R${response.stdout.toString().trim()}`;
    /*language=file-reference*/
    fs.writeFileSync( Path.join(__dirname, "../REVISION" ), __VERSION.GIT_REVISION );

    let tag = spawnSync( "git", [ "rev-parse", "origin/main" ]);
    __VERSION.GIT_TAG = `T${tag.stdout.toString().trim()}`;
    fs.writeFileSync( Path.join(__dirname, "../TAG" ), __VERSION.GIT_TAG );
}

/*language=file-reference*/
if( !__VERSION.GIT_TAG && fs.existsSync( Path.join(__dirname, "../TAG" ) ) ){
    /*language=file-reference*/
    __VERSION.GIT_TAG = fs.readFileSync( Path.join(__dirname, "../TAG" ) ).toString().trim();
}

/*language=file-reference*/
if( !__VERSION.GIT_REVISION && fs.existsSync( Path.join(__dirname, "../REVISION" ) ) ){
    /*language=file-reference*/
    __VERSION.GIT_REVISION = fs.readFileSync( Path.join(__dirname, "../REVISION" ) ).toString().trim();
}


export let VERSION = {
    NUMBER :fs.readFileSync( Path.join( __dirname, /*language=file-reference*/ "../VERSION")).toString("utf-8")
        .trim()
        .split("\n")
        .map( value => value.trim() )
        .filter( value => value.length )
        [ 0 ],

    LOOK: Path.join( __dirname, "../VERSION.look" ),

    looked(){
        return fs.existsSync( VERSION.LOOK );
    },

    get REVISION(){
        return __VERSION.GIT_REVISION
    },
    unlock(){
        if( fs.existsSync( VERSION.LOOK ) ) fs.unlinkSync( VERSION.LOOK );
    },

    increment(){
        let currentBranch = spawnSync( "git", ["branch", "--show-current"], {
            //language=file-reference
            cwd: Path.join( __dirname, ".." )
        })

        if( currentBranch.error ){
            console.error( currentBranch.error );
            return  false;
        }
        if( currentBranch.status !== 0 ) return false;
        let branch = currentBranch.stdout.toString().trim();

        console.log( `[maguita] current branch is ${ branch }` );
        // if( currentBranch.stdout.toString().trim() !== "main" ) return false;
        if(  VERSION.looked() ) return false;
        fs.writeFileSync( VERSION.LOOK, "" );
        let versionsParts = VERSION.NUMBER.split("." ).map( value => Number(value ) );
        versionsParts[2]++;
        VERSION.NUMBER = versionsParts.join(".");
        fs.writeFileSync( Path.join( __dirname, "../VERSION"), VERSION.NUMBER );
        return  VERSION;
    },
    get TAG(){
        if( !VERSION.isGit ) return VERSION.TAG_REV;
        return `${VERSION.TAG_REV}-${__VERSION.LAUNCHER_CODE}`
        // else return `v${VERSION.NUMBER}-${TAG_REVISION}-${TAG_CODE}`
    },
    get TAG_REV(){
        if( !!__VERSION.GIT_REVISION && !!__VERSION.GIT_TAG ) return `v${ VERSION.NUMBER }-${ __VERSION.GIT_REVISION }-${ __VERSION.GIT_TAG }`;
        else if(!!__VERSION.GIT_TAG ) return `v${ VERSION.NUMBER }-${ __VERSION.GIT_TAG }`;
        else if(!!__VERSION.GIT_REVISION ) return `v${ VERSION.NUMBER }-${ __VERSION.GIT_REVISION }`;
        else  return `v${VERSION.NUMBER}`;
    },
    get VERSION_NAME(){
        if( !__VERSION.GIT_REVISION ) return `v${VERSION.NUMBER}`
        else return `v${VERSION.NUMBER}-${__VERSION.GIT_REVISION}`
    }, get isGit(){
        return !!__VERSION.IS_GIT;
    }, get GIT_TAG(){
        return __VERSION.GIT_TAG;
    }
};

declare global {
    let VERSION: AppVersion;
}

export type AppVersion = typeof VERSION;
// @ts-ignore
global.VERSION = VERSION;


console.log( "VERSION-NUMBER", VERSION.NUMBER )


