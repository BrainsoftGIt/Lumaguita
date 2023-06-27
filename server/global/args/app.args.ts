import {onPrepareArgs, lineDefiner} from "./index";
import {srv} from "../autogen/config/srv";
import {DEFAULTS} from "../defaults";
import {launcherStatus} from "../../launcher/status";

declare module "./index" {
    export interface Envs {
        //Configs app args
        app:"MAGUITA"|"LUMA"|string,
        appPort:number

        appUser: string
        appDebug: boolean
        appMode: "dev" | "prod" | "public" | "exe" | "test",
        appWithNodeWebKit: boolean,
        appRoot: boolean,
        appLocation:string
        appNoCli:boolean
        appSelfMaster:boolean,
        appMasterDomain:string,
        appRevisionsLimit:number | 100
    }
}

const { define, hide } = lineDefiner( Object.assign({}, srv.SERVER.SESSION, { PORT:srv.SERVER.PORT } ))

//Run args configs
define( "app", String, { def: "APP" } );
define( "appPort", Number, { conf: "PORT", def: "APP_PORT", alias: "p" } );

define( "appDebug", Boolean, { val: false } );
define( "appUser", String,{ def: "APP_USER", val: "@brainsoft" } );
//@ts-ignore
define( "appMode", String, { def: "APP_MODE", alias: "m" } );
define( "appLocation", String,{ def: "APP_RUN_LOCATION" } );
define( "appNoCli", Boolean, { val: false } );

define( "appSelfMaster", Boolean );
define( "appMasterDomain", String );
define( "appRevisionsLimit", Number, { def: "APP_REVISION_LIMIT" } );
define( "appRoot", Boolean, {  val: false } );
define( "appWithNodeWebKit", Boolean, {  val: false } );

onPrepareArgs( ( args ) => {

    launcherStatus.launcher = launcherStatus.launcher || "index.ts";

    if( args.appMode === "prod" ){
        args.appSelfMaster = true;
        args.appNoCli = true;

        if( !args.app ) args.app = DEFAULTS.APP_PROD;
        if( !args.webDomain ) args.webDomain = DEFAULTS.WEB_DOMAINS_LUMA;

    } else if ( args.appMode === "test" ){
        args.appSelfMaster = true;
        args.appNoCli = true;

        if( !args.webDomain ) args.webDomain = DEFAULTS.WEB_DOMAINS_MAGUITA;
        if( !args.app ) args.app = DEFAULTS.APP_TEST;
    } else if ( [ "public", "exe" ].includes( args.appMode ) ){
        args.appNoCli = true;
    }

    if( args.webDomain ) args.webDomain = args.webDomain.toLowerCase();
})