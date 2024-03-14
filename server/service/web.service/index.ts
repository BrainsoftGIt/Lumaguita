import express, {  Express } from "express";
import { Server } from "http";

import { db } from "../../global/autogen/config/db";
import { args } from "../../global/args";
const multerConfig = require("../../lib/multer/config");

console.log( "[maguita] WebService>", `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }` );

export const app:Express = express();


import '../../modules/api/routes/check-static';

//////////////////// MIDDLEWARES ////////////////////
require( './middlewares/head' );


// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );

//Body Parser
require( './middlewares/body-parser' );

//Remote
require( "./middlewares/remote" );

//Cors
require( './middlewares/cors' );

//Resources
require( "./middlewares/ejs.page.js" );
require( "./middlewares/static.page.js" );
require( "./middlewares/static.file" );


app.use(multerConfig());


//On Listener
console.log( `using connection host: ${ db.dbConfig.host }, port: ${ db.dbConfig.port }, user: ${ db.dbConfig.user }, database: ${ db.dbConfig.database }`)

export const server:Server = require( args.webProtocol ).createServer( {}, app );

server.listen( args.appPort, (...values )=>{
    console.log( "[maguita] Service>", `Running webserver application ${ args.app } on`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "...values", ...values );
});

console.log( "[maguita] WebService>",  `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }`, "ok..." );
