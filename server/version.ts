import fs from "fs"
import * as Path from "path";
import {execSync, spawnSync} from "child_process";
import {nanoid} from "nanoid";


let response = spawnSync( "git", [ "rev-list", "--count", "--all" ]);
let GIT_COMMIT:string;

if( response.status === 0 ) GIT_COMMIT = response.stdout.toString().trim();
if( !GIT_COMMIT ) GIT_COMMIT = null;
else GIT_COMMIT = `R${GIT_COMMIT}`;

let TAG_CODE = nanoid(6 ).toUpperCase();
GIT_COMMIT = null;

console.log( { GIT_COMMIT })


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

    get revs(){
        return GIT_COMMIT
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
        if( !GIT_COMMIT ) return `v${VERSION.NUMBER}`
        else return `v${VERSION.NUMBER}-${GIT_COMMIT}-${TAG_CODE}`
    },
    get TAG_NAME(){
        if( !GIT_COMMIT ) return `v${VERSION.NUMBER}`
        else return `v${VERSION.NUMBER}-${GIT_COMMIT}`
    }
};

declare global {
    const VERSION: SystemVersion;
}

export type SystemVersion = typeof VERSION;
// @ts-ignore
global.VERSION = VERSION;


console.log( "VERSION-NUMBER", VERSION.NUMBER )


