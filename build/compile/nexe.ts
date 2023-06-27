import {compile} from "nexe";
import {res} from "./res";
import * as Path from "path";

export function nexeStart(){
    //TODO NEXE uncomment this [RETURN] for skip exe builder
    //return  Promise.resolve(true)
    const _res = res();

    return compile(Object.assign({
        name: "MAGUITA",
        cwd: _res.cwd ,
        input: _res.entry,
        output: _res.output,
        verbose: true,
        //language=file-reference
        ico: Path.join( __dirname, "../../server/resources/fav/fav.ico"),

        rc:{
            CompanyName: "BrainsoftSTP",
            PRODUCTVERSION: "17,3,0,0",
            FILEVERSION: "1,2,3,4"
        },
        build: true, //required to use patches
        enableNodeCli: false,
        enableStdIn: false,
        // fakeArgv:[ ],
    })).then( value => {
        console.log( value )
        return Promise.resolve({
            out: _res.output
        })
    })
}
