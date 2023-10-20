import fs from "fs"
import * as Path from "path";
import {execSync, spawnSync} from "child_process";
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
        return `v${VERSION.NUMBER}`
    }
};

console.log( "VERSION-NUMBER", VERSION.NUMBER )
