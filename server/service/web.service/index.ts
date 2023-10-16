import express, {  Express } from "express";
import { Server } from "http";
import { PageResolve } from "zoo.util/lib/page-resolve" ;

import { db } from "../../global/autogen/config/db";
import { folders } from '../../global/project';
import { args } from "../../global/args";
const multerConfig = require("../../lib/multer/config");

console.log( "[maguita] WebService>", `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }` );

export const app:Express = express();

//////////////////// MIDDLEWARES ////////////////////

// import "./middlewares/remote/route.remote";

import '../../modules/api/routes/check-static';
import {E_TAG_VERSION} from "./etag";
import {VERSION} from "../../version";
import {nanoid} from "nanoid";
import {scriptUtil} from "kitres";
//Static declarations

let localStaticResource = express.static( folders.public, {
    immutable:false,
    cacheControl:true,
    setHeaders( res ){
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
require( './middlewares/body-parser' );

// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );

app.use( (req, res, next) => {
    console.log(`[maguita] new request from ${req.headers.host} | ${req.method}${req.path}`)
    next();
});

app.on( "error", parent => {

})

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
let switchVersion = "/switch-version";

app.get( "/VERSION", (req, res, next) => {
    res.send( VERSION.NUMBER );
});

app.use( (req, res, next) => {
    let existingQueryParams = Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&');


    if( RESOLVE_REGEXP.test( req.headers.host ) ) {
        let domainsParts = req.headers.host.split( "." );
        // v1.client.luma.brainsoftstp.com
        //    client.luma.brainsoftstp.com
        let [ client, eTagVersion] = domainsParts.reverse().filter( (value, index) => index > 2 );

        if( !eTagVersion ){
            if( existingQueryParams.trim().length ) existingQueryParams = "?"+existingQueryParams
            const redirectUrl = `https://${versionCode}.${client}.${BASE_REMOTE}${req.path}${existingQueryParams}`;

            res.setHeader( "access-control-max-age", 0 );
            res.setHeader( "Etag", E_TAG_VERSION );
            return res.send(`
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Luma | Acesso remoto</title>
                        <style>
                            body, html {
                                margin: 0;
                                padding: 0;
                                height: 100%;
                                overflow: hidden;
                            }

                            #fullscreen-iframe {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                border: none; /* Remove a borda padrão do iframe */
                            }
                        </style>
                    </head>
                    <body>
                        <iframe id="fullscreen-iframe" src="${redirectUrl}" ></iframe>
                        <script>
                            var iframe = document.getElementById('fullscreen-iframe');

                        </script>
                    </body>
                </html>
            `);
        }

        if( !eTagVersion || eTagVersion !== versionCode ) {
            let redirectCode = nanoid(16 );
            const redirectUrl = `https://${versionCode}.${client}.${BASE_REMOTE}${switchVersion}?code=${redirectCode}`;

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
    let redirectUrl = `https://${req.headers.host}`;
    if( !status ) return next()
    delete redirect[ redirectCode ];

    Object.entries( status.session||{} ).forEach( ([key, value ], index) => {
        req.session[ key ] = value;
    });

    req.session.save( ()=>{
        redirectUrl+=`${status.path}`;
        if( status.query?.length ) redirectUrl += `?`+status.query;
        return res.redirect(  redirectUrl );
    });

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
    console.log( "[maguita] Service>", `Running webserver application ${ args.app } on`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "...values", ...values );
});

console.log( "[maguita] WebService>",  `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "ok..." );


//Statics files
export const { resolvers,  listen, acceptors } = PageResolve( {
    folders: folders,
    dirSlash: true,
    hiddenIndex: true
});

export const statics = { resolvers, acceptors };

app.use( "/", listen );
