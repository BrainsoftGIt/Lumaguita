import {app} from "../index";
import Path from "path";
import {folders} from "../../../global/project";
import fs from "fs";
app.use( "/", (req, res, next)=>{
    if( req.method !== "GET" ) return next();
    let path = (()=>{
        let _part = req.path.split("/");
        _part.shift();
        return _part.join( "/" )
    })();

    let paths = [
        Path.join( folders.public, `${path}.html` ),
        Path.join( folders.public, path, "index.html" ),
    ]
    let source = paths.find( value => {
        return fs.existsSync( value );
    });

    if( !source ) return next();
    return res.sendFile( source, {

    });
})