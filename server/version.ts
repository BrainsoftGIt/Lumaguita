import fs from "fs"
import * as Path from "path";
import {spawnSync} from "child_process";
import {nanoid} from "nanoid";


let response = spawnSync( "git", [ "rev-list", "--count", "--all" ]);
let GIT_REVISION:string;

if( response.status === 0 ) GIT_REVISION = response.stdout.toString().trim();
if( !GIT_REVISION ) GIT_REVISION = null;
else GIT_REVISION = `R${GIT_REVISION}`;
let TAG_REVISION = GIT_REVISION;

let LAUNCHE_CODE = nanoid(6 ).toUpperCase();

if( GIT_REVISION ){
    /*language=file-reference*/
    fs.writeFileSync( Path.join(__dirname, "../REVISION" ), GIT_REVISION );
} else if( fs.existsSync( Path.join(__dirname, "../REVISION" ) )) {
    /*language=file-reference*/
    TAG_REVISION = fs.readFileSync( Path.join(__dirname, "../REVISION" ) ).toString().trim();
}

let _TAG:string;
/*language=file-reference*/
if( fs.existsSync( Path.join(__dirname, "../TAG"))){
    _TAG = fs.readFileSync( Path.join(__dirname, "../TAG" ) ).toString().trim();
}



export let VERSION = {
    //language=file-reference
    NUMBER :fs.readFileSync( Path.join( __dirname, "../VERSION")).toString("utf-8")
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
        return GIT_REVISION
    },
    unlock(){
        if( fs.existsSync( VERSION.LOOK ) ) fs.unlinkSync( VERSION.LOOK );
    },

    increment(){
        let currentBranch = spawnSync( "git", ["branch", "--show-current"], {
            //language=file-reference
            cwd: Path.join( __dirname, "../" )
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
        if( !GIT_REVISION ) return VERSION.TAG_REV;
        return `${VERSION.TAG_REV}-${LAUNCHE_CODE}`
        // else return `v${VERSION.NUMBER}-${TAG_REVISION}-${TAG_CODE}`
    },
    get TAG_REV(){
        if( !!TAG_REVISION && !!_TAG ) return `v${VERSION.NUMBER}-${TAG_REVISION}-${_TAG}`;
        else if(!!_TAG ) return `v${VERSION.NUMBER}-${_TAG}`;
        else  return `v${VERSION.NUMBER}`;
    },
    get TAG_NAME(){
        if( !GIT_REVISION ) return `v${VERSION.NUMBER}`
        else return `v${VERSION.NUMBER}-${GIT_REVISION}`
    }, get isGit(){
        return !!GIT_REVISION;
    }
};

declare global {
    const VERSION: SystemVersion;
}

export type SystemVersion = typeof VERSION;
// @ts-ignore
global.VERSION = VERSION;


console.log( "VERSION-NUMBER", VERSION.NUMBER )


