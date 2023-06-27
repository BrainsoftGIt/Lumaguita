import chalk from "chalk";
import path from "path";
import os from "os";
import {appPatches} from "../index";
import {ChildProcess, spawn} from "child_process";
import {execFileElevate} from "../../lib/utils/process/win32";
import {appToaster} from "../../lib/toaster";

export function installWin32DatabaseServer():ChildProcess{
    console.log( "INSTALLING POSTGRESQL SERVER...", process.argv )
    //language=file-reference
    const installer= path.join( __dirname, "../../../build/installers/database.exe" );
    const args = [
        "--mode", "unattended",
        "--enable-components", "server,commandlinetools"
    ];
    return execFileElevate( installer, args );
}


if( os.platform() === "win32" ){
    appPatches.installDatabaseServer = ()=>{
        return new Promise((resolve, reject) => {
            if( os.platform() !== "win32" ) return reject( new Error( "Current platform is not windows!") );

            console.log( chalk.redBright( "Check database server app support status... [NEED-INSTALL]" ) );
            //language=file-reference
            const icon = path.join( __dirname, "../../resources/fav/fav.png" );
            appToaster( {
                title: "MAGUITA",
                icon: icon,
                message: "O sistema não detectou o banco de dados PostgreSQL instalado neste dispositivo!\n",
                actions:[ "Instalar", "Agora não!"]
            }, (err, response, metadata) => {
                let installNow = response === "Instalar".toLowerCase() || response === "timeout";
                if( !installNow ) return process.exit( -1 );
                if( installNow ) {
                    appToaster( {
                        icon: icon,
                        title: "MAGUITA",
                        message: "O processo de instalação de banco de dados foi inicializado!\nDê permisão e espere até que sejá concluido",
                    });
                    const _process =  installWin32DatabaseServer();

                    const failed = ( error? )=>{
                        if( error ) console.error( error );
                        appToaster( {
                            icon: icon,
                            title: "MAGUITA",
                            message: `Opss! Algo deu mal tente mais tarde!\n${ error?.message||"" }`,
                        });
                        reject( new Error( "installDatabaseServer: Opss! Algo deu mal tente mais tarde! :: " + error?.message ));
                        process.exit( -1 );
                    }

                    const success = () =>{
                        appToaster( {
                            title: "MAGUITA",
                            message: "Parabéns! O banco de dados foi instalado com sucesso!\nTudo estara pronto em breve!",
                        });
                        resolve( true )
                    }

                    _process.on( "exit", code => {
                        appToaster( {
                            title: "MAGUITA",
                            icon: icon,
                            message: "A instalação terminou!\nInicialize novamente o sistema para continuar!"
                        }, (err1, response1, metadata1) => {
                        });
                    });

                    _process.on( "error", err1 => {
                        failed( err1 );
                    });

                    _process.on( "close", (code, signal) => {
                        if( code === 0 ) success();
                        else failed();
                    });
                }
            })
        })
    }
}
