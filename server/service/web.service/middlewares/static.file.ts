import {app} from "../index";
import express from "express";
import {folders} from "../../../global/project";
import fs from "fs";
import Path from "path";

let eTags:{[p:string]:string} = {};
fs.watch( folders.public, { recursive: true }, (event, source) => {
    delete eTags[ Path.join( folders.public, source ) ];
});

let localStaticResource = express.static( folders.public, {
    cacheControl:true,
    immutable: true,
    maxAge: 1000 * 60 /*segundos*/ * 60 /*minitos*/ * 24 /*horas*/ * 30 /*dias*/ * 12 /*meses*/ * 10 /*anos*/,
    etag: true,
    setHeaders( res, filename ){
        if( !eTags[ filename ] ) {
            let stat = fs.statSync( filename );
            eTags[ filename ] = `${VERSION.TAG }_${ stat.mtimeMs }`
        }
        res.setHeader("ETag", eTags[ filename ] )
    }
});

app.use( (req, res, next) => {
    localStaticResource( req, res, next );
});