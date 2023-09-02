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


//Static declarations
app.use( express.static( folders.public ) );


//Body Parser
require( './middlewares/vhost' );

require( './middlewares/body-parser' );

// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );



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



// app.use( "/cluster/resource/:cluster", ( req, res)=>{
//     res.send( {
//         url:req.url,
//         path: req.path,
//         baseUrl: req.baseUrl,
//     } );
// })