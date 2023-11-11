import express, {  Express } from "express";
import { Server } from "http";
import { PageResolve } from "zoo.util/lib/page-resolve" ;

import { db } from "../../global/autogen/config/db";
import { folders } from '../../global/project';
import { args } from "../../global/args";
const multerConfig = require("../../lib/multer/config");

import * as ejs from "ejs";

console.log( "[maguita] WebService>", `building service ${ args.app }`, `${ args.webProtocol }://127.0.0.1:${ args.appPort }` );

export const app:Express = express();

//////////////////// MIDDLEWARES ////////////////////

// import "./middlewares/remote/route.remote";

import '../../modules/api/routes/check-static';
import {nanoid} from "nanoid";
import {scriptUtil} from "kitres";
import fs from "fs";
import Path from "path";
import path from "path";
import {res} from "../../../build/compile/res";
import e from "express";
// Static declarations


app.use( (req, res, next) => {
    console.log(`[maguita] new request from ${req.headers.host} | ${req.method}${req.path}`);
    // res.setHeader("ETag", VERSION.TAG )
    next();
});

app.get( "/VERSION", (req, res, next) => {
    res.send( VERSION.NUMBER );
});

app.get( "/TAG", (req, res, next) => {
    res.send( VERSION.TAG );
});

app.get( "/TAG_NAME", (req, res, next) => {
    res.send( VERSION.TAG_NAME );
});

app.get( "/TAG_REVS", (req, res, next) => {
    res.send( VERSION.revs );
});


//Body Parser
require( './middlewares/body-parser' );

// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );

require( "./middlewares/remote" );
require( "./middlewares/ejs.page.js" );
require( "./middlewares/static.page.js" );
require( "./middlewares/static.file" );

//////////////////// GLOBAL CONFs ////////////////////
// app.use("/storage", express.static(folders.files));


app.use(multerConfig());

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


// Statics files
export const { resolvers,  listen, acceptors } = PageResolve( {
    folders: folders,
    dirSlash: true,
    hiddenIndex: true
});

// export const statics = { resolvers, acceptors };

// app.use( "/", listen );
