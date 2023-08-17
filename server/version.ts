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

    incrementor(){
        if( incremented ) return false;
        let versionsParts = VERSION.NUMBER.split("." ).map( value => Number(value ) );
        versionsParts[2]++;
        VERSION.NUMBER = versionsParts.join(".");
        fs.writeFileSync( Path.join( __dirname, "../VERSION"), VERSION.NUMBER );
        return  VERSION;
    }
};
