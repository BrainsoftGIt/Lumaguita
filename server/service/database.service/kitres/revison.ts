import {RevisionCore, tsutil} from "kitres";
import {pgCore} from "./index";
import {folders} from "../../../global/project";
import {VERSION} from "../../../version";

export const pgRevision = new RevisionCore( pgCore, {
    schema: "kitres",
    dirname: folders.databaseRevision,
    DATA_VERSION: VERSION.TAG
});

pgRevision.on( "register", block => {
    console.log( `MAGUITA> collecting database path ${ new URL(`file:\\\\${ tsutil.tsof( block.filename )}`).href } identifier = "${ block.identifier }"` );
});

pgRevision.on( "applierNotice", notice => {
    console.log( `MAGUITA> apply database path ${ new URL(`file:\\\\${ tsutil.tsof( notice.filename )}`).href } identifier = "${ notice.identifier }" ${ notice.status }`);
});


