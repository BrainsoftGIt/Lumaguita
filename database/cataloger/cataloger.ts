import {Cataloger} from "kitres";
import {pgCore} from "../../server/service/database.service/kitres";
import * as Path from "path";

export const dbCataloger = new Cataloger( pgCore, {
    prefix: "Maguita",
    //language=file-reference
    location: Path.join( __dirname, "./lumaguita.ts" ),
    schemas: [
        "auth",
        "cluster",
        "geoinfo",
        "lib",
        "libdom",
        "map",
        "patch",
        "report",
        "rule",
        "tweeks"
    ]
});

dbCataloger.generateCatalog().then( value => {
    if( value?.error ) {
        console.error( value.error );
        return;
    }
    console.log( "Database cataloged successfully!")

});