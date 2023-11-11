import {nanoid} from "nanoid";
import {app} from "../index";

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
    let existingQueryParams = Object.entries(
        Object.assign( req.query, {
            v: VERSION.TAG
        })
    ).map(([key, value]) => `${key}=${value}`).join('&');
    res.locals.REMOTE_REQUEST = false;

    if( RESOLVE_REGEXP.test( req.headers.host ) ) {
        let domainsParts = req.headers.host.split( "." );
        let [ client, eTagVersion] = domainsParts.reverse().filter( (value, index) => index > 2 );
        res.locals.REMOTE_REQUEST = true;

        if( !eTagVersion ){
            if( existingQueryParams.trim().length ) existingQueryParams = "?"+existingQueryParams
            const redirectUrl = `https://${versionCode}.${client}.${BASE_REMOTE}${req.path}${existingQueryParams}`;

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

                            #fullscreen-iframe {
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
                        <iframe id="fullscreen-iframe" src="${redirectUrl}" ></iframe>
                        <script>
                            var iframe = document.getElementById('fullscreen-iframe');

                        </script>
                    </body>
                </html>
            `);
        }

        if( !eTagVersion || eTagVersion !== versionCode ) {
            let redirectCode = nanoid(16 );
            const redirectUrl = `https://${versionCode}.${client}.${BASE_REMOTE}${switchVersion}?code=${redirectCode}`;

            redirect[ redirectCode ] = {
                query:existingQueryParams,
                session: req.session,
                path: req.path
            };
            return res.redirect( redirectUrl );
        }
    }
    return next();
});


app.use( switchVersion, (req, res, next) => {
    let redirectCode:string = req.query.code as string;
    let status = redirect[ redirectCode ];
    let redirectUrl = `https://${req.headers.host}`;
    if( !status ) return next()
    delete redirect[ redirectCode ];

    Object.entries( status.session||{} ).forEach( ([key, value ], index) => {
        req.session[ key ] = value;
    });

    req.session.save( ()=>{
        redirectUrl+=`${status.path}`;
        if( status.query?.length ) redirectUrl += `?`+status.query;
        return res.redirect(  redirectUrl );
    });
});
