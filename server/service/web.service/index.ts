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

//Body Parser
require( './middlewares/body-parser' );


// Cookie Parser
require( './middlewares/cookie' );

// Session Express
require( './middlewares/session' );

//Remote
require( "./middlewares/remote" );

//Cors
require( './middlewares/cors' );

//Resources
require( "./middlewares/ejs.page.js" );
require( "./middlewares/static.page.js" );
require( "./middlewares/static.file" );


app.use( multerConfig() );

function generateLocalIP(port) {
    // Definimos o IP base como 127.0.0.0
    const baseIP = [127, 0, 0, 0];

    // Limitamos a porta a um intervalo específico para evitar números muito grandes.
    const maxPorts = 255 * 255; // Máximo para os dois últimos octetos (0-255)
    if ( port > maxPorts ) {
        throw new Error('Número de porta muito grande');
    }

    // Dividimos o número da porta para obter os dois últimos octetos do IP
    const octet3 = Math.floor(port / 255);
    const octet4 = port % 255;

    // Montamos o IP resultante
    const ip = `${baseIP[0]}.${baseIP[1]}.${octet3}.${octet4}`;
    return ip;
}

let address = generateLocalIP( args.appPort );


//On Listener
console.log( `using connection host: ${ db.dbConfig.host }, port: ${ db.dbConfig.port }, user: ${ db.dbConfig.user }, database: ${ db.dbConfig.database }`)

export const server:Server = require( args.webProtocol ).createServer( {}, app );

server.listen( args.appPort, (...values )=>{
    console.log( "[maguita] Service>", `chaRunning webserver application ${ args.app } on`, `${ args.webProtocol }://${ address }:${ args.appPort }`, "...values", ...values );
});

console.log( "[maguita] WebService>",  `building service ${ args.app }`, `${ args.webProtocol }://${ address }:${ args.appPort }`, "ok..." );
