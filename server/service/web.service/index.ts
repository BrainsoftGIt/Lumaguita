import express, {  Express } from "express";
import { Server } from "http";
import { PageResolve } from "zoo.util/lib/page-resolve" ;

import { db } from "../../global/autogen/config/db";
import { folders } from '../../global/project';
import { args } from "../../global/args";
const multerConfig = require("../../lib/multer/config");

console.log( "[MAGUITA] WebService>", `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }` );

export const app:Express = express();

//////////////////// MIDDLEWARES ////////////////////

// import "./middlewares/remote/route.remote";

import '../../modules/api/routes/check-static';
import {E_TAG_VERSION} from "./etag";
import {VERSION} from "../../version";

console.log({E_TAG_VERSION} );
//Static declarations

let localStaticResource = express.static( folders.public, {
    immutable:false,
    cacheControl:true,
    setHeaders( res ){
        console.log( res.getHeaders() );
        res.setHeader("ETag", E_TAG_VERSION )
    }
})

let remoteStaticResource = express.static( folders.public, {
    cacheControl:true,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
    setHeaders( res ){
        res.setHeader("ETag", E_TAG_VERSION )
    }
})


//Body Parser
// require( './middlewares/vhost' );

require( './middlewares/body-parser' );

// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );


//http://zootakuxy6.luma.brainsoftstp.com/
//http://v207.pirata.luma.brainsoftstp.com/

const BASE_REMOTE = "luma.brainsoftstp.com";
const RESOLVE_REGEXP = new RegExp(`(^[a-zA-Z0-9]+\\.${ BASE_REMOTE })$|^v[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.${ BASE_REMOTE }$`);


let redirect :{
    [ code:string ]: {
        query:string,
        session: any,
        path:string
    }
} = { };

let versionCode = `v${VERSION.NUMBER.split(".").join("")}`;
let switchVersion = "/switch-version"
app.use( (req, res, next) => {
    if( RESOLVE_REGEXP.test( req.headers.host ) ) {
        let domainsParts = req.headers.host.split( "." );
        // v1.client.luma.brainsoftstp.com
        //    client.luma.brainsoftstp.com
        let [ client, eTagVersion] = domainsParts.reverse().filter( (value, index) => index > 2 );

        if( !eTagVersion || eTagVersion !== versionCode ) {
            const existingQueryParams = Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&');
            let redirectCode = Math.trunc( (Math.random() * ( 999999999 - 100000000 )) +100000000);
            const redirectUrl = `${req.protocol}://${versionCode}.${client}.${BASE_REMOTE}${switchVersion}?code=${redirectCode}`;

            redirect[ redirectCode ] = {
                query:existingQueryParams,
                session: req.session,
                path: req.path
            };
            return res.redirect( redirectUrl );
        }

        return remoteStaticResource( req, res, next );
    }
    return localStaticResource( req, res, next );
});

app.use( switchVersion, (req, res, next) => {
    let redirectCode:string = req.query.code as string;
    let status = redirect[ redirectCode ];
    let redirectUrl = `${req.protocol}://${req.headers.host}`;
    if( !status ) return next()
    delete redirect[ redirectCode ];

    Object.entries( status.session||{} ).forEach( ([key, value ], index) => {
        req.session[ key ] = value;
    });

    redirectUrl+=`${status.path}`;
    if( status.query?.length ) redirectUrl += `?`+status.query;
    return res.redirect(  redirectUrl );
});




//////////////////// GLOBAL CONFs ////////////////////
// app.use("/storage", express.static(folders.files));

app.use(multerConfig());
//View engine setup
app.set( 'views', [ folders.views, folders.public ] );
app.set( 'view engine', 'ejs' );

//Cors
const cors = require('cors');
app.use( cors() );


//On Listener
console.log( `using connection host: ${ db.dbConfig.host }, port: ${ db.dbConfig.port }, user: ${ db.dbConfig.user }, database: ${ db.dbConfig.database }`)

export const server:Server = require( args.webProtocol ).createServer( {}, app );

server.listen( args.appPort, (...values )=>{
    console.log( "[MAGUITA] Service>", `Running webserver application ${ args.app } on`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "...values", ...values );
});

console.log( "[MAGUITA] WebService>",  `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "ok..." );


//Statics files
export const { resolvers,  listen, acceptors } = PageResolve( {
    folders: folders,
    dirSlash: true,
    hiddenIndex: true
});

export const statics = { resolvers, acceptors };

app.use( "/", listen );
