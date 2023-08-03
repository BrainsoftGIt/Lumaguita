import * as Path from "path";
import fs from "fs";


//language=file-reference
let msbuildPath = "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319";

let paths = process.env["Path"].split( Path.delimiter );
paths.unshift( msbuildPath );
process.env[ "Path" ] = paths.join( Path.delimiter );

require("./launcherCompiler" ).checkCscInPath( true ).then( value => {

    let math = /(^)*.csproj$/
    fs.readdirSync( Path.join( __dirname, "csproj")).filter( value1 => math.test( value1 ) )
        .forEach( file => {
            let csproj = `csproj/${file}`;
            require("./launcherCompiler").compileLauncher( csproj ).then( value1 => {
                console.log( value1 );
            }).catch( reason => {
            })
        })
})

//C:/var/workspace/perguntas-resposta/audios/Q%26A/Q%26A%20-%20theoretic/Q%26A%20-%20111%20-%20Qual%20e%20o%20papel%20do%20homem%20na%20circulacao%20rodoviaria.mp

