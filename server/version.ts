import fs from "fs"
import * as Path from "path";
let incremented = false;
//language=file-reference
export let VERSION = {
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
        if(  VERSION.looked() ) return false;
        fs.writeFileSync( VERSION.LOOK, "" );
        let versionsParts = VERSION.NUMBER.split("." ).map( value => Number(value ) );
        versionsParts[2]++;
        VERSION.NUMBER = versionsParts.join(".");
        fs.writeFileSync( Path.join( __dirname, "../VERSION"), VERSION.NUMBER );
        fs.writeFileSync( Path.join( __dirname, "../client/public/VERSION"), VERSION.NUMBER );
        return  VERSION;
    }
};

console.log( "VERSION-NUMBER", VERSION.NUMBER )
