 import {app } from "../index";
import {Folders} from "../../../global/project";
import {srv} from "../../../global/autogen/config/srv";
import {Request, Response} from "express";
import {args} from "../../../global/args";

 import session from "express-session";
 import SessionFileStore from "session-file-store";

 export const FileSession = SessionFileStore( session );
 export const sessionStore = new FileSession({
     path: Folders.sessions
 });

 app.use(session({
     store: sessionStore,
     secret: srv.SERVER.SESSION.SECRETE,
     resave: true,
     saveUninitialized: true,
     cookie: { maxAge: Number( args.webMaxCookieAge ) },
 }))


 app.use(( req:Request, res:Response, next)=>{
     //If not has session
     if( req.session && Object.keys( req.session ).length <= 1 ){
         req.session.save( ()=> next() );
     } else next();
 });


 app.get( "/session", (req, res) => {
     res.json( req.session )
 })
