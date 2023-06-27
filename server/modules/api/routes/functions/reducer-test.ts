// import { staticExpander, staticReducer } from "../../../../lib/redutor/staticReducer";
//
// const fs = require('fs');
// const path = require('path');
//
//
// //language=file-reference
// let objectList = JSON.parse( fs.readFileSync( path.join(__dirname, '../../../../lib/json/_db.json' ) ) );
// let objectResult = staticReducer( objectList, 1, [ "collector_metadata", "collector_old", "collector_ref", "object_ref" ]);
//
// console.log( [ "name", ["a", "b", "c" ] ].includes( [ "a", "b", "c"] ));
// //
// // fs.writeFileSync( path.join( __dirname, "res-reduce.json"),  JSON.stringify( objectResult ));
// // fs.writeFileSync( path.join( __dirname, "res-expand.json"),  JSON.stringify( expander( objectResult ) ));
