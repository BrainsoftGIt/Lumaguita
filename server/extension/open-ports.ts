import os from "os";
import {serverNotify} from "../snotify";
import {netshRuleManage} from "../lib/utils/win32/netsh/manager";
import {args} from "../global/args";

export function openPorts(){
    if( os.platform() === "win32" ) {
        serverNotify.loadingBlock("Abrindo portas");
        serverNotify.loadingBlockItem("Liberando acesso remoto para a aplicação...");

        let entries = [{
            port:args.appPort,
            prefix:`lumaguita_application_port`,
            description: `Porta de entrada remota para o aplicativo de lumaguita`,
            label:"Application"
        }, {
            port: args.dbPort,
            prefix: "lumaguita_database_port",
            description: "Porta de entrada remota para o aplicativo de lumaguita",
            label:"Database"
        }];

        let waits = entries.map( (value, index) => {
            return new Promise( resolve => {
                let entryName = `${value.prefix}_${value.port}`;
                netshRuleManage.get({name: entryName, dir: "in"})
                    .then( entry => {
                        serverNotify.log( `${ value.label } FirewallRule inbound rule ${ entryName } ${ !!entry? "OK": "NO" }`);

                        if( !entry) {
                            netshRuleManage.sets({
                                name: entryName,
                                description: value.description,
                                dir: 'in',
                                action: 'allow',
                                protocol: 'tcp',
                                localport: args.appPort
                            }).then( value1 => {
                                resolve( true )
                            }).catch( reason => {
                                resolve( false )
                            })
                        }
                    }).catch( reason => {
                        resolve( false );
                });
            })
        });

        Promise.all( waits ).then( value => {

        }).catch( reason => {

        });

    }
}