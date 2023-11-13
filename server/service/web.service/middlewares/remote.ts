import {app} from "../index";
import e from "express";

let redirect :{
    [ code:string ]: {
        query:string,
        session: any,
        path:string
    }
} = { };

const BASE_REMOTE = "luma.brainsoftstp.com";
const RESOLVE_REGEXP = new RegExp(`(^[a-zA-Z0-9]+\\.${ BASE_REMOTE })$|^v[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.${ BASE_REMOTE }$`);
let versionCode = `v${VERSION.NUMBER.split(".").join("")}`;
let switchVersion = "/switch-version";

//http://zootakuxy6.luma.brainsoftstp.com/
//http://v207.pirata.luma.brainsoftstp.com/

app.use( (req, res, next) => {

    res.locals.REMOTE_REQUEST = false;

    if( RESOLVE_REGEXP.test( req.headers.host ) ) {
        res.locals.REMOTE_REQUEST = true;
    }
    return next();
});

export function isRemote( res:e.Response ){
    return res.locals.REMOTE_REQUEST;
}

export function remotePage( req:e.Request, res:e.Response, next:e.NextFunction ){
    let record:Record<string, string> = {};
    Object.entries( req.query ).forEach( ([key, value]) => {
        record[ key ] = value?.toString?.();
    });

    let query = new URLSearchParams( {
        ...record,
        v: VERSION.TAG
    });

    let domainsParts = req.headers.host.split( "." );
    let [ client] = domainsParts.reverse().filter( (value, index) => index > 2 );
    const redirectUrl = `${req.protocol}://${ client }.${ BASE_REMOTE }${req.path}?${ query.toString() }`;
    let eTagVersion = req.query.v;

    if( !eTagVersion ){
        res.setHeader( "access-control-max-age", 0 );
        res.setHeader( "Etag", VERSION.TAG );
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

                            #remote {
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
                        <iframe id="remote" src="${redirectUrl}" ></iframe>
                        <script src="/assets/js/remote-access.js?v=${VERSION.TAG}"></script>
                    </body>
                </html>
            `);
    } else if( eTagVersion !== VERSION.TAG ){
        return res.redirect( redirectUrl );
    }

    return next();
}
