import {srv} from "../autogen/config/srv";
import {lineDefiner, lineArgs} from "./index";

declare module "./index" {
    interface Args {
        //Web server args
        webDomain:"maguita.test.brainsoftstp.com "|"luma.app.brainsoftstp.com"|string
        webProtocol:string | "http" | "https"
        webSession:string | "file-session"
        webWithCache:boolean,
        webMaxCookieAge:number
    }
}

const { define, hide } = lineDefiner( Object.assign({}, srv.SERVER.SESSION, { PORT: srv.SERVER.PORT } ) );

//Express args configs
define( "webProtocol", String, { def: "WEB_PROTOCOL" } );
define( "webSession",String, { def: "WEB_SESSION" } );
define( "webWithCache", Boolean, { val: false } );
define( "webMaxCookieAge", Number,{ conf: "COOKIE_MAX_AGE", def: "WEB_COOKIE_MAX_AGE" } );

let webDomain = process.env["MAGUITA_WEB_DOMAIN" ];
define( "webDomain", String,{ val: webDomain } );