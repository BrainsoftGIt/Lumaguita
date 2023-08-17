import {FileUtil} from "zoo.util/lib/file-util";
import path from "path";
import fs from "fs";

export function cleanJs( dirname ){
    //language=file-reference
    if( !dirname ) dirname = path.join( __dirname, "../" );
    [
        { basename: /*language=file-reference*/ "/client/app",  math: /.*.js$/, },
        { basename: /*language=file-reference*/ "/client/app",  math: /.*.js.map$/, },
        { basename: /*language=file-reference*/ "/server",      math: /.*.js$/, },
        { basename: /*language=file-reference*/ "/server",      math: /.*.js.map$/, },
        { basename: /*language=file-reference*/ "/build",       math: /.*.js$/, },
        { basename: /*language=file-reference*/ "/database",    math: /.*.js$/, },
        { basename: /*language=file-reference*/ "/database",    math: /.*.js.map$/ },
    ].forEach( (value, index) => {
        FileUtil.scanFiles( path.join( dirname, value.basename ), value.math, path1 => {
            if( path1.path === __filename ) return;
            console.log( "[unlink]", path1.url.href, "..." );
            fs.unlinkSync( path1.path );
        }, { recursive: true });
    })
}

if( require.main.filename === __filename ){
    //language=file-reference
    cleanJs( path.join(__dirname, "../"))
}
