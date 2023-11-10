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
    maxAge: 1000 * 60 * 60 * 24 * 30,
    etag: true,
    setHeaders( res, filename ){
        if( !eTags[ filename ] ) {
            let stat = fs.statSync( filename );
            eTags[ filename ] = `${VERSION.TAG }_${ stat.mtimeMs }`
        }
        res.setHeader("ETag", eTags[ filename ] )
    }
});










//
//
//
// let remoteStaticResource = express.static( folders.public, {
//     cacheControl:true,
//     maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
//     etag: true,
//     setHeaders( res , filename, s){
//         // if(!eTags[filename] ){
//             let stat = fs.statSync( filename );
//             console.log( filename, stat )
//         // }
//         console.log( "console.log( req )", filename )
//         // res.setHeader("ETag",  );
//     }
// });

app.use( (req, res, next) => {
    localStaticResource( req, res, next );
    // if( res.locals.REMOTE_REQUEST ) {
    //     return remoteStaticResource( req, res, next );
    // } else return localStaticResource( req, res, next );
});