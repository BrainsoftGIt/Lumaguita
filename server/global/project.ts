import * as os from "os";
import fs  from "fs";
import {args} from "./args";
import {DEFAULTS} from "./defaults";
import Path from "path";
import {manifest} from "./context";
const path = require( 'path' );


//language=file-reference


export const project = {
    icon:{
        //language=file-reference
        png: path.join( __dirname, '../resources/fav/fav.png' ),
        //language=file-reference
        ico: path.join( __dirname, '../resources/fav/fav.ico' ),
    }
}

export function folder( ...pathParts:string[] ){
    let _path = path.join( ...pathParts );
    if( !fs.existsSync( _path ) ) fs.mkdirSync( _path, { recursive: true });
    return _path
}

export const folders = {
    get root () {
        if( args.appRoot ) return path.join( DEFAULTS.APP_HOME, args.appMode??"default" );

        let _home = DEFAULTS.APP_HOME;
         if( os.platform() === "win32" && !!process.env[ "ProgramData"] ) {
            _home = process.env[ "ProgramData" ];

         } else  if( os.platform() === "win32" && !!process.env[ "LOCALAPPDATA" ] ){
            _home = process.env[ "LOCALAPPDATA" ];

        } else if( os.platform() === "win32" && !!process.env[ "APPDATA"] ){
            _home = process.env[ "APPDATA"];

        } else if( os.platform() === "win32" && !!process.env[ "USERPROFILE"] ){
            _home = process.env[ "USERPROFILE"];

        } else if( !!os.homedir() ) {
            _home = os.homedir();

        } else if ( !!process.env[ "HOME"]) {
            _home =process.env["HOME"];
        }

        return folder( _home, "/BrainsoftSTP.com");

    }, get home():string {
        let home = path.join( this.root, "apps", manifest.properties.package, args.appMode||"dev" );
        if( !fs.existsSync( home) ) fs.mkdirSync( home, { recursive: true });
        return folder( home );

    }, get bin():string{
        //language=file-reference
        return path.normalize( path.join(__dirname, "../../bin" ) )
    }, get pid():string{
        return  folder( this.volatile, "pid" )

    }, get pidDir():string{
        return  folder( this.pid, `process-${process.pid}` )

    }, get volatile(){
        if( args.appRoot ) return path.join( this.root, `var/temp` )

        if( os.platform() === "win32" && process.env[ "TEMP" ] )
            return process.env[ "TEMP" ];

        return this.root;
    },

    //language=file-reference
    get snapshot () { return folder( __dirname, '../..' ); },

    //language=file-reference
    get client () { return folder( this.snapshot, '/client' ); },

    //language=file-reference
    get server () { return folder( this.snapshot, '/server' ); },

    //language=file-reference
    get public () { return folder( this.snapshot, '/client/public' ); },

    //language=file-reference
    get www () { return folder( this.snapshot, '/client/www' ); },

    //language=file-reference
    get views () { return folder( this.snapshot, '/client/views' ); },

    //language=file-reference
    get contents () { return folder( this.snapshot, '/client/contents' ); },

    //Dynamics resources [resource,temps,volatiles,files,persistent]

    //Destined only for resources available on the current server [LocalServer]
    get storage () { return folder( path.join( this.home , '/storage' ) ); },
    get cloud () { return folder( path.join( this.home , '/storage/cloud' ) ); },
    get share () { return folder( path.join( this.home, '/storage/share' ) ); },
    get files () { return  folder( this.home,  '/storage/files' ); },

    //Destined for resource of user sessions
    get sessions () { return folder( path.join( this.home, '/sessions' ) ); },

    //Destined for resources shared between servers

    //Destined for private local resources
    get private () { return folder( path.join( this.home, '/storage/private' ) ); },

    //Destined for temporary and volatile resources
    get temp () { return folder( this.volatile, manifest.properties.package, args.appMode||"dev" ); },

    //Destined for resource mount point [ChunksResources]
    get mnt () { return folder( path.join( this.home, '/storage/mnt' ) ); },

    //...(avaliando se vai prevalecer)

    get logs () { return  folder( this.home,  '/logs' ) ; },

    //Database
    get database(){ return folder( this.root, "databases", manifest.properties.databaseService, args.appMode||"dev" ) },
    get cluster(){ return folder( this.database, "home" ) },

    //language=file-reference
    get databaseRevision () { return folder( __dirname, "../../database/revs" ); },

    get databaseRevisionResolved () { return folder( this.database, "/revisions/resolved" ); },

    get base_dump(){
        return Path.join( this.database, "lumaguita.base.db" );
    },
    //Destined for postgres mount point [PostgresCluster|PG_HOME's]
    get dumps () { return folder( this.database,  '/dumps' ); },
    get backups () { return folder( this.database,  '/backups' ); },
};
