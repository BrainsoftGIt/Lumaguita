import os from "os";
import {serverNotify} from "../snotify";
import {netshRuleManage} from "../lib/utils/win32/netsh/manager";
import {args} from "../global/args";

export async function openPorts(){
    if( os.platform() === "win32" ) {
        serverNotify.loadingBlock("Abrindo portas");
        serverNotify.loadingBlockItem("Liberando acesso remoto para a aplicação...");

        let entry, entryName;
        entryName =  `lumaguita_application_port_${args.appPort}`;
        entry = await netshRuleManage.get({name: entryName, dir: "in"});
        console.log( "[MAGUITA] FirewallRule>", `Application inbound rule ${ entryName } ${ !!entry? "OK": "NO" }`);

        if (!entry) {
            await netshRuleManage.sets({
                name: `lumaguita_application_port_${args.appPort}`,
                description: "Porta de entrada remota para o aplicativo de lumaguita",
                dir: 'in',
                action: 'allow',
                protocol: 'tcp',
                localport: args.appPort
            });
        }


        serverNotify.loadingBlockItem("Liberando acesso remoto para o banco de dados...");
        entryName = `lumaguita_database_port_${(args).dbPort}`;
        entry = await netshRuleManage.get({name: entryName, dir: "in"});

        if (args.dbMode === "app" && !entry) {
            entry = await netshRuleManage.sets({
                name: `lumaguita_database_port_${(args).dbPort}`,
                description: "Porta de entrada para o cluster do banco de dados do aplicativo lumaguita",
                dir: 'in',
                action: 'allow',
                protocol: 'tcp',
                localport: args.dbPort
            })
        }
        console.log( "[MAGUITA] FirewallRule>", `Database inbound rule ${ entryName } ${ !!entry? "OK": "NO" }`);

    }
}