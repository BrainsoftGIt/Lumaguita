 import {app } from "../index";
import {folders} from "../../../global/project";
import {srv} from "../../../global/autogen/config/srv";
import {Pool} from "pg";
import { factory } from "../../database.service";
import {Request, Response} from "express";
import {args} from "../../../global/args";


function postgresSession(sessionConfig: { name?, secret?:string, resave?:boolean, saveUninitialized?:boolean, storeConfig?:{ pool:Pool, tableName?:string, schemaName?:string }, cookie?:{ maxAge } }){
    let { name, secret, resave, saveUninitialized, storeConfig, cookie } = ( sessionConfig || { } );
    const session = require('express-session');
    if( !name ) name = "connect.sid";
    name = `${ name }:${ args.appPort }`;
    const pgSession = require( 'connect-pg-simple' )( session );
    app.use( session({
        name,
        secret,
        resave,
        saveUninitialized,
        cookie,
        store: new pgSession( storeConfig ),
    }));
}

export const sessionsType = {
    [ "pg-session" ]:()=>{
        console.log( "session://pg-session" );
        postgresSession({
            secret: srv.SERVER.SESSION.SECRETE,
            resave: true,
            saveUninitialized: true,
            storeConfig: {
                pool: factory.createPool( ),
                tableName: "session",
                schemaName: "auth"
            } ,
            cookie: { maxAge: args.webMaxCookieAge }
        });
    },

    [ "file-session" ]:()=>{
        console.log( "session://file-session" );
        const session = require('express-session');
        const FileStore = require('session-file-store')(session);

        app.use( session({
            store: new FileStore( { path: folders.sessions } ),
            secret: srv.SERVER.SESSION.SECRETE,
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: args.webMaxCookieAge },
        }));
    }
};

let useSession = sessionsType[ args.webSession ];
if( !useSession ) useSession = sessionsType[ "file-session" ];
useSession();


app.use(( req:Request, res:Response, next)=>{
    //If not has session
    if( req.session && Object.keys( req.session ).length <= 1 ){
        req.session.save( ()=> next() );
    } else next();
});