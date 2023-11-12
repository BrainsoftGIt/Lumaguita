//Load ejs files
import Path from "path";
import {folders} from "../../../global/project";
import fs from "fs";
import {app} from "../index";
import e from "express";
import {isRemote, remotePage} from "./remote";

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

export function resolveEjs( req:e.Request, res:e.Response){
    res.locals.page_engni = "EJS";
    let path:string = res.locals.page_path;
    let source:string = res.locals.page_source;
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

    if ( req.query.v  && req.query.v === VERSION.TAG ){
        res.setHeader( "ETag", VERSION.TAG );
        res.setHeader( "Cache-Control", `public, max-age=31536000, immutable` );
    }

    let remote = {
        VERSION:"",
        isRemote: false
    };

    if( res.locals.REMOTE_REQUEST ) {
        remote.isRemote = true
        remote.VERSION = `?v=${VERSION.TAG}`

    }

    res.render( path, {
        content,
        request: req,
        response: res,
        REMOTE: remote
    });
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

    res.locals.page_engni = "EJS";
    res.locals.page_path = path;
    res.locals.page_source = source;
    return next();
});


app.use( "/", (req, res, next) => {
    if( res.locals.page_engni !== "EJS" ) return next();
    if( !isRemote( res ) ) return next();
    return remotePage( req, res, next );
});

app.use( "/", (req, res, next) => {
    if( res.locals.page_engni !== "EJS" ) return next();
    return resolveEjs( req, res );
} );