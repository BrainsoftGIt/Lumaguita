"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPorts = void 0;
const os_1 = __importDefault(require("os"));
const snotify_1 = require("../snotify");
const manager_1 = require("../lib/utils/win32/netsh/manager");
const args_1 = require("../global/args");
function openPorts() {
    if (os_1.default.platform() === "win32") {
        snotify_1.serverNotify.loadingBlock("Abrindo portas");
        snotify_1.serverNotify.loadingBlockItem("Liberando acesso remoto para a aplicação...");
        let entries = [{
                port: args_1.args.appPort,
                prefix: `lumaguita_application_port`,
                description: `Porta de entrada remota para o aplicativo de lumaguita`,
                label: "Application"
            }, {
                port: args_1.args.dbPort,
                prefix: "lumaguita_database_port",
                description: "Porta de entrada remota para o aplicativo de lumaguita",
                label: "Database"
            }];
        let waits = entries.map((value, index) => {
            return new Promise(resolve => {
                let entryName = `${value.prefix}_${value.port}`;
                manager_1.netshRuleManage.get({ name: entryName, dir: "in" })
                    .then(entry => {
                    snotify_1.serverNotify.log(`${value.label} FirewallRule inbound rule ${entryName} ${!!entry ? "OK" : "NO"}`);
                    if (entry)
                        return resolve(true);
                    if (!entry) {
                        manager_1.netshRuleManage.sets({
                            name: entryName,
                            description: value.description,
                            dir: 'in',
                            action: 'allow',
                            protocol: 'tcp',
                            localport: args_1.args.appPort
                        }).then(value1 => {
                            resolve(true);
                        }).catch(reason => {
                            resolve(false);
                        });
                    }
                }).catch(reason => {
                    resolve(false);
                });
            });
        });
        Promise.all(waits).then(value => {
            snotify_1.serverNotify.log(`Todas as portas necessarias foram abertas`);
        }).catch(reason => {
        });
    }
}
exports.openPorts = openPorts;
//# sourceMappingURL=open-ports.js.map