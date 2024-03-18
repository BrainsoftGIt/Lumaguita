//Load ejs files
import Path from "path";
import fs from "fs";
import {app} from "../index";
import e from "express";
import {isRemote, remotePage} from "./remote";
import ejs from "ejs";


import jsdom from "jsdom";
import {flocoto} from "kitres";
import {Folders} from "../../../global/project";

const { JSDOM } = jsdom;


app.locals.VERSION = VERSION;
app.set( 'views', [ Folders.public, Folders.views ] );
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

const isUrl = ( url:string) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

export function resolveEjs( req:e.Request, res:e.Response){
    let xFlocoto = req.headers["x-flocoto"];
    let xFlocotoViewport = req.headers["x-flocoto-viewport"];
    let xFlocotoSession = req.headers["x-flocoto-session"];

    res.locals.page_engni = "EJS";
    let path:string = res.locals.page_path;
    let source:string = res.locals.page_source;
    let dirRef:boolean = res.locals.page_source_dirRef;
    let contentType:{ type:keyof typeof contentLoad, file:string };
    if( fs.existsSync( Path.join( Folders.contents, `${source}.json`)) ) contentType  = {
        type: "json",
        file: Path.join( Folders.contents, `${source}.json`)
    }; else if( fs.existsSync( Path.join( Folders.contents, `${source}.json5` ) ) ) contentType = {
        type:"json",
        file: Path.join( Folders.contents, `${source}.json5`)
    }; else if( fs.existsSync( Path.join( Folders.contents, `${source}.js` ) ) ) contentType = {
        type:"js",
        file: Path.join( Folders.contents, `${source}.js`)
    };
    let content = {};
    if( contentType ) {
        content = contentLoad[ contentType.type ]( contentType.file );
    }

    let remote = {
        VERSION:"",
        isRemote: false
    };

    if( res.locals.REMOTE_REQUEST ) {
        remote.isRemote = true
        remote.VERSION = `?v=${VERSION.TAG}`
    }

    ejs.renderFile( source, {
        content,
        request: req,
        response: res,
        REMOTE: remote,
        VERSION: VERSION
    }, (err, html) => {
        if ( err ) {
            console.error( err );
            return res.send( err.message );
        }
        if ( req.query.v  && req.query.v === VERSION.TAG ){
            res.setHeader( "ETag", VERSION.TAG );
            res.setHeader( "Cache-Control", `public, max-age=31536000, immutable` );
        }


        const dom = new JSDOM( html );

        [
            {tag:"script", attrSource:"src"},
            {tag:"link", attrSource:"href"},
            {tag:"a", attrSource:"href"},
            {tag:"iframe", attrSource:"src"},
        ].forEach( value => {
            let elements = dom.window.document.getElementsByTagName( value.tag );
            Array.from( elements).forEach( element => {
                let src = element[value.attrSource];
                if( !src ) return;
                if( Path.isAbsolute( src ) ) return;
                if( isUrl( src ) ) return;

                if( dirRef ) src = Path.posix.join( path, src );
                else src = Path.posix.join( Path.dirname(path), src );

                if( flocoto.isFlocotoModule ){
                    src = Path.posix.join( flocoto.flocotoInfo.referer( xFlocotoViewport as string ), src );
                }
                element[ value.attrSource ] = [src];
            })
        });
        res.send( dom.window.document.documentElement.outerHTML );
    });
}

app.use( "/", (req, res, next)=>{
    if( req.method !== "GET" ) return next();
    let path = (()=>{
        let _part = req.path.split("/");
        // _part.shift();
        return _part.join( "/" )
    })();

    let paths = [
        { source: Path.join( Folders.views, `${path}.ejs` ), dirRef: false },
        { source: Path.join( Folders.public, `${path}.ejs` ), dirRef: false },
        { source: Path.join( Folders.views, path, "index.ejs" ), dirRef:true},
        { source: Path.join( Folders.public, path, "index.ejs" ), dirRef:true},
    ];

    let source = paths.find( value => {
        return fs.existsSync( value.source );
    });

    if( !source ) return next();

    res.locals.page_engni = "EJS";
    res.locals.page_path = path;
    res.locals.page_source = source.source;
    res.locals.page_source_dirRef = source.dirRef;
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