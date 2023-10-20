import {dbRes} from "../../server/service/database.service/kitres/res";
import JSON5 from "json5";
import fs from "fs";
import Path from "path";
import {spawnSync} from "child_process";

//language=file-reference
let menu_filename =Path.join( __dirname, "../revs/revisions/sets/menu.sets.json5" );

export function exportsMenus(){
    return new Promise( resolve => {
        dbRes.with.auth.menu.select( {
            menu_estado: 1
        }, (error, result) => {
            if( error ){
                return console.error( error );
            }

            let menus = result.rows.map( value => {
                value["date"] = new Date().toISOString();
                return value;
            })

            let content  = JSON5.stringify( menus, {
                space: 2
            } );

            if( !fs.existsSync( Path.dirname( menu_filename ) ) ){
                fs.mkdirSync( Path.dirname( menu_filename ), {  recursive: true } );
            }

            fs.writeFileSync( menu_filename, content );
            spawnSync("git", [ "add", menu_filename ], {
                cwd: __dirname
            });

            spawnSync("git", [ "commit", menu_filename, "-m", `"Exports menu file"` ], {
                cwd: __dirname
            });
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