import {dbRes} from "../../server/service/database.service/kitres/res";
import JSON5 from "json5";
import fs from "fs";
import Path from "path";

//language=file-reference
let menu_filename =Path.join( __dirname, "../revs/revisions/menu/menu.json5" );

export function exportsMenus(){
    return new Promise( resolve => {
        dbRes.with.auth.menu.select( [{
            menu_estado: 1
        }],{
            onResult(error, result) {
                if( error ){
                    return console.error( error );
                }

                let content  = JSON5.stringify( result.rows, {
                    space: 2
                } );
                fs.writeFileSync( menu_filename, content );
            }
        })
    })
}

export function importsMenus(){
    let menuContent = fs.readFileSync( menu_filename ).toString();
    return JSON5.parse(menuContent);
}

if( require.main.filename === __filename ){
    exportsMenus()
}