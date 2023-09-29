import {Cataloger} from "kitres";
import {pgCore} from "./index";
import Path from "path";

export const dbCataloger = new Cataloger( pgCore, {
    prefix: "Maguita",
    //language=file-reference
    location: Path.join( __dirname, "../../../../database/cataloger/lumaguita.ts" ),
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
