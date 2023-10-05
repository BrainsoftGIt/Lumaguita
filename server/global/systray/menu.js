"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemsMap = exports.trayMenuConfigs = void 0;
const os_1 = __importDefault(require("os"));
const sys_1 = require("../sys");
const app_1 = require("../version/app");
const path_1 = __importDefault(require("path"));
const engine_1 = require("./engine");
const toaster_1 = require("../../lib/toaster");
const status_1 = require("../../../client/app/status");
const nets = os_1.default.networkInterfaces();
const results = [];
Object.entries(nets).forEach((next) => {
    const [name, value] = next;
    value.forEach((address) => {
        if (address.family !== "IPv4" || address.internal)
            return;
        console.log(`[maguita] Detected interface ${name} ${address.address}/${address.netmask}`);
        results.push({ title: `Endereço ${name}`, tooltip: `Abrir com endereço de ${name} | ${address.address}`, enabled: true, click() {
                sys_1.sys.openApp({ address: address.address });
            } });
    });
});
exports.trayMenuConfigs = {
    title: 'LUMA POS',
    tooltip: 'LUMA POS',
    //language=file-reference
    favFolder: "/server/resources/fav"
};
function onChangeRemoteAccessResult(result, opt) {
    let notification = {
        //language=file-reference
        icon: path_1.default.join(__dirname, "../../../server/resources/fav/fav.ico"),
        title: "MAGUITA",
        subtitle: `${opt} acesso remoto`,
    };
    if (result.result && !result.old)
        notification.message = "Acesso remoto reativo!";
    else if (result.result && result.old)
        notification.message = "Acesso remoto ativado!";
    else
        notification.message = "Acesso remoto desativo";
    (0, toaster_1.appToaster)(notification);
}
function openBackgroundDevTools() {
    if (status_1.nwAppStatus.runningIntoNW) {
        status_1.nwAppStatus.notify("open-background-dev-tools");
    }
}
exports.menuItemsMap = {
    home: { title: "Abrir", tooltip: "Abrir pÁgina inicial", click() { sys_1.sys.openApp({ /*language=file-reference*/ app: "/client/app/page/index.html" }); } },
    pos: { title: "POS", tooltip: "PÁgina de POS", click() { sys_1.sys.openApp({ browser: "pos", /*language=file-reference*/ app: "/client/app/page/pos.html" }); } },
    web: { title: "WEB", tooltip: "Abrir no navagador", click() { sys_1.sys.openApp(); }, itemList: [
            { title: "Local", tooltip: "Abrir no navegador | endereço local", click: () => sys_1.sys.openApp({}), enabled: true },
            ...results
        ] },
    [Math.random()]: engine_1.GENERIC_SEPARATOR,
    ["remote"]: { title: "Acesso remoto", tooltip: "Ativar/Desativar acesso remoto ao aplicativo",
        itemList: {
            ["enable"]: { title: "Ativar", tooltip: "Ativar acesso remoto ao aplicativo!", click(tray, GenericMenuItem) {
                    require("../../service/cluster.service").clusterServer.service.switchRemoteConnection(true).then(value => onChangeRemoteAccessResult(value, "Ativar"));
                } }, ["disable"]: { title: "Dasativar", tooltip: "Desativar acesso remoto ao aplicativo!", click(tray, GenericMenuItem) {
                    require("../../service/cluster.service").clusterServer.service.switchRemoteConnection(false).then(value => onChangeRemoteAccessResult(value, "Desativar"));
                } }
        }
    }, [Math.random()]: engine_1.GENERIC_SEPARATOR,
    [" sync"]: { title: 'Syncs', tooltip: "Ferramentas de sincronização", itemList: {
            ["state"]: { title: "Estado", tooltip: "Estado atual da sinc.", click() { } },
            ["send"]: { title: "Enviar", tooltip: "Enviar modificações local", click() { } },
            ["receiver"]: { title: "Receber", tooltip: "Proucurar por modificações remotas", click() { } },
            ["fullCheck"]: { title: "Verificação completa", tooltip: "Verificar completamente modificações remotas", click() { } },
            ["restore"]: { title: "Restaurar", tooltip: "Receber todas as modificações", click() { } }
        }
    }, ["tools"]: { title: "Avancado", tooltip: "Ferramentas avançadas", itemList: [
            { title: "Luma terminal", tooltip: "Maguita command line interface", click(tray) {
                    require("../../extension/ext/terminal").openAppShell();
                } },
            { title: "BACKUP", tooltip: "Gerar backup do banco de dados agora" },
            { title: "Snapshot log", tooltip: "Visualizar a copia do log atual",
                enabled: true,
                click() {
                    const { launch } = require("../../service/log.service/logview");
                    launch({ logSnapshot: true });
                } },
            { title: "DEV Tools", tooltip: "Open background dev tools", click(tray, GenericMenuItem) {
                    openBackgroundDevTools();
                } }
        ]
    }, [Math.random()]: engine_1.GENERIC_SEPARATOR,
    about: { title: "Sobre", tooltip: "Sobre o sistema", click() {
            sys_1.sys.openUrl("https://www.brainsoftstp.com/luma");
        } },
    update: { title: "Atualizações", tooltip: "Proucurar por novas atualizações!", click() {
            app_1.appVersion.checkVersionUpdate().then(newVersionUrl => {
                if (newVersionUrl)
                    (0, toaster_1.appToaster)({
                        //language=file-reference
                        icon: path_1.default.join(__dirname, "../../resources/fav/fav.ico"),
                        message: "Nova versão disponivel para transferência",
                        title: "Luma",
                        timeout: 1000,
                        actions: ["BAIXAR", "PASSAR"]
                    }, (err, response, metadata) => {
                        if (response.toLowerCase() === "baixar")
                            sys_1.sys.openUrl(newVersionUrl);
                    });
                else
                    (0, toaster_1.appToaster)({
                        //language=file-reference
                        icon: path_1.default.join(__dirname, "../../resources/fav/fav.ico"),
                        title: "Luma",
                        message: "Nenhuma atualização encontrada",
                        timeout: 1000,
                        actions: ["OK"]
                    });
            });
        } },
    [Math.random()]: engine_1.GENERIC_SEPARATOR,
    // restart:{ title: "Reiniciar", tooltip: "Restart app", click() { sys.restart( exit )}},
    shutdown: { title: "Encerrar", tooltip: "Parar todos os serviços e encerrar o sistema", click(tray) {
            sys_1.sys.shutdown(() => {
                return tray.close();
            });
        } },
    // exit: { title: "Sair", tooltip: "Encerrar o sistema", click( tray) { sys.exit( () => {
    //         return tray.close()
    //     })}}
};
(0, engine_1.prepare)(exports.menuItemsMap);
//# sourceMappingURL=menu.js.map