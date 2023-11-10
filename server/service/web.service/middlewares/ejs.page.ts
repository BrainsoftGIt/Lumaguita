//Load ejs files
import Path from "path";
import {folders} from "../../../global/project";
import fs from "fs";
import {app} from "../index";
import e from "express";

app.locals.VERSION = VERSION;
app.set( 'views', [ folders.public, folders.views ] );
app.set( 'view engine', 'ejs' );



const contentLoad = {
    json( filename:string ) {
        return JSON.parse( fs.readFileSync( filename ) .toString() )
    }, json5(filename:string){
        return JSON.parse( fs.readFileSync( filename ) .toString() )
    }, js(filename:string){
        return require(filename);
    }
}

export function resolveEjs( req:e.Request, res:e.Response, path:string, source:string ){
    let contentType:{ type:keyof typeof contentLoad, file:string };
    if( fs.existsSync( Path.join( folders.contents, `${source}.json`)) ) contentType  = {
        type: "json",
        file: Path.join( folders.contents, `${source}.json`)
    }; else if( fs.existsSync( Path.join( folders.contents, `${source}.json5` ) ) ) contentType = {
        type:"json",
        file: Path.join( folders.contents, `${source}.json5`)
    }; else if( fs.existsSync( Path.join( folders.contents, `${source}.js` ) ) ) contentType = {
        type:"js",
        file: Path.join( folders.contents, `${source}.js`)
    };
    let content = {};
    if( contentType ) {
        content = contentLoad[ contentType.type ]( contentType.file );
    }


    res.render( path, {
        content,
        request: req,
        response: res
    })
}



app.use( "/", (req, res, next)=>{
    if( req.method !== "GET" ) return next();
    let path = (()=>{
        let _part = req.path.split("/");
        _part.shift();
        return _part.join( "/" )
    })();

    let paths = [
        Path.join( folders.views, `${path}.ejs` ),
        Path.join( folders.public, `${path}.ejs` ),
        Path.join( folders.views, path, "index.ejs" ),
        Path.join( folders.public, path, "index.ejs" ),
    ];

    let source = paths.find( value => {
        return fs.existsSync( value );
    });

    if( !source ) return next();
    return resolveEjs( req, res, path, source )
})