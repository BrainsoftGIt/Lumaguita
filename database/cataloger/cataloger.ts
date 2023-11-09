import {dbCataloger} from "../../server/service/database.service/kitres/calatoger";
dbCataloger.generateCatalog().then( value => {
    if( value?.error ) {
        console.error( value.error );
        return;
    }
    console.log( "Database cataloged successfully!" )
});