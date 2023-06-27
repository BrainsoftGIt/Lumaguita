"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return __awaiter(this, void 0, void 0, function* () {
        if (os_1.default.platform() === "win32") {
            snotify_1.serverNotify.loadingBlock("Abrindo portas");
            snotify_1.serverNotify.loadingBlockItem("Liberando acesso remoto para a aplicação...");
            let entry, entryName;
            entryName = `lumaguita_application_port_${args_1.args.appPort}`;
            entry = yield manager_1.netshRuleManage.get({ name: entryName, dir: "in" });
            console.log("[MAGUITA] FirewallRule>", `Application inbound rule ${entryName} ${!!entry ? "OK" : "NO"}`);
            if (!entry) {
                yield manager_1.netshRuleManage.sets({
                    name: `lumaguita_application_port_${args_1.args.appPort}`,
                    description: "Porta de entrada remota para o aplicativo de lumaguita",
                    dir: 'in',
                    action: 'allow',
                    protocol: 'tcp',
                    localport: args_1.args.appPort
                });
            }
            snotify_1.serverNotify.loadingBlockItem("Liberando acesso remoto para o banco de dados...");
            entryName = `lumaguita_database_port_${(args_1.args).dbPort}`;
            entry = yield manager_1.netshRuleManage.get({ name: entryName, dir: "in" });
            if (args_1.args.dbMode === "app" && !entry) {
                entry = yield manager_1.netshRuleManage.sets({
                    name: `lumaguita_database_port_${(args_1.args).dbPort}`,
                    description: "Porta de entrada para o cluster do banco de dados do aplicativo lumaguita",
                    dir: 'in',
                    action: 'allow',
                    protocol: 'tcp',
                    localport: args_1.args.dbPort
                });
            }
            console.log("[MAGUITA] FirewallRule>", `Database inbound rule ${entryName} ${!!entry ? "OK" : "NO"}`);
        }
    });
}
exports.openPorts = openPorts;
//# sourceMappingURL=open-ports.js.map