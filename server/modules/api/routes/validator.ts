import { NextFunction, Response, Request } from "express";
import moment from "moment";
import fs from "fs";
import path from "path";
import {Folders} from "../../../global/project";
import {args} from "../../../global/args";
const licenseFile = "License.txt";
const { generateEncryptionKey } = require("../../../lib/crypto/cryptoFile");
const encryptor = require('simple-encryptor')(generateEncryptionKey());

function getClusterServer(){
    return require( "../../../service/cluster.service" ).clusterServer
}

let checker = {
    get isRoot(){
        return getClusterServer().isRoot();
    },
    get license(){
        return getClusterServer()?.localCluster?.cluster_license;
    },

    get hasClusterServer(){
        return !!getClusterServer();
    },

    get hasLicense():boolean{
        return !!this.license;

    }, get isValidLicense(){
        const currentDate = moment().format("YYYY-MM-DD");
        const license = moment( this.license ).format("YYYY-MM-DD" );
        return moment(currentDate).isSameOrBefore(moment(license).format("YYYY-MM-DD"));

    },
    get isValidClock():boolean{
        // Pela primeira vez
        if( !fs.existsSync( path.join( Folders.files, 'license', licenseFile ) ) ) {
            fs.mkdirSync( path.join( Folders.files, 'license' ), {recursive: true} );
            saveDateTimeLicense({ data:  new Date().getTime() } );
        }
        let data = fs.readFileSync(path.join(Folders.files, 'license', licenseFile), 'utf8');
        const lastCheckTime = encryptor.decrypt( data );
        let _isValidClock =  ( new Date().getTime()) >= lastCheckTime;
        if( _isValidClock )  saveDateTimeLicense({ data:  new Date().getTime() } );
        return  _isValidClock;
    }
};

let checkHasLicense =  ( req:Request, res:Response, next:NextFunction ) =>{
    if( args.appMode === "dev" ) return next();
    let _next =()=>{
        if ( !checker.hasClusterServer ){
            return setTimeout( _next, 1000 * 5 );
        }

        if( checker.isRoot ){
            next();
        } else if( checker.hasLicense ) {
            next()
        } else {
            res.status( 403 );
            res.setHeader("Content-Type", "text/html");
            res.redirect( "/license");
        }
    };
    _next();
}

export function checkLicenseValida( req:Request, res:Response, next:NextFunction ){
    if( args.appMode === "dev" ) return next();
   checkHasLicense( req, res, ()=>{
       if( checker.isRoot ){
           return next();

       } else if ( !checker.isValidClock ) {
           res.status(403);
           res.setHeader("Content-Type", "text/html");
           return  res.redirect("/changeDate");

       } else if( !checker.isValidLicense ){
           res.status(403);
           res.setHeader("Content-Type", "text/html");
           return  res.redirect("/renovar");

       } else {
           next();
       }
    });

}

function saveDateTimeLicense({data}){
     fs.writeFileSync( path.join(Folders.files, "license", licenseFile), encryptor.encrypt(data) );
}
