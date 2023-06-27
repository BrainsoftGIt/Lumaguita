import fs from "fs";
import * as Path from "path";
import axios from "axios";
import os from "os";
import * as https from "https";

export const releaseServer = "https://release.brainsoftstp.com";

export const appVersion = {
    currentVersion(){
        //language=file-reference
        let versionFile = Path.join( __dirname, "../../../VERSION" );
        if( !fs.existsSync( versionFile ) ) return false;
        let lines = fs.readFileSync( versionFile ).toString("utf-8" ).trim().split("\n" );
        let appName = lines[ 0 ].trim().toLowerCase();
        let currentVersion = lines[1].trim();

        let versionCode = currentVersion.split(".").join( "" );
        let versionNumber = Number( versionCode );
        return  { currentVersion, versionCode, versionNumber, appIdentifier: appName }
    }, checkVersionUpdate():Promise<string>{


        let current = this.currentVersion();
        if( !current ) return Promise.resolve( null );
        let { currentVersion, versionCode, versionNumber, appIdentifier } = current;
        let url = `${releaseServer}/release/${ appIdentifier }`;
        return new Promise<string>((resolve, reject) => {
            axios.get( url, {
                httpsAgent: new https.Agent({rejectUnauthorized: false})
            }).then(value => {
                if( !currentVersion ) return Promise.resolve( null );
                if( value.status !== 200 ) return resolve( null );
                if( !value.data ) return resolve ( null );
                let data = value.data;
                if( typeof data === "string" ) try {
                    data = JSON.parse( data );
                } catch( e ) { data = null }
                if( !data ) return resolve( null );
                console.table( data );
                let lasted = data[ "lasted" ];
                if( !lasted ) return resolve( null );
                let lastedVersionCode = Number( lasted?.[ "versionCode" ] );
                if( !Number.isSafeInteger( lastedVersionCode ) ) return resolve( null );
                if( lastedVersionCode <= versionNumber ) return resolve( null );
                return resolve( `${releaseServer}/${ lasted?.[ "distPath" ]?.[ os.platform() ] }` );
            }).catch( reason => {
                console.error( url, reason.message );
                resolve( null );
            });
        })
    }
}