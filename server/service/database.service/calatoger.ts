

export function catalog( ){
    const { dbCataloger} = require( "./core" );
    dbCataloger.catalog( {
        language: "ts"
    }, (error, response) => {
        if( error ){
            console.log( error );
            return;
        }
        console.log( `Database catalogada com sucesso!`, response.all().length )
    });
}

