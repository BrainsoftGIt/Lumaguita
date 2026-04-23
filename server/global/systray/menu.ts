import os from "os";
import {sys} from "../sys";
import path from "path";
import {GENERIC_SEPARATOR, GenericMenuItem, GenericMenuMaps, GenericTray, prepare} from "./engine";
import {appToaster} from "../../lib/toaster";
import NotificationCenter from "node-notifier/notifiers/notificationcenter";
import {nwAppStatus} from "../../../client/app/status";
import {nanoid} from "nanoid";

const nets: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();

const results: GenericMenuItem<GenericMenuMaps>[] = [];

const adapters = [ "Wi-Fi", "Ethernet" ];
Object.entries(nets).forEach((next) => {
    const [name, value] = next;
    console.log(`[maguita] Detected interface ${name}`);

    if( !adapters.includes( name ) ) return;
    value.forEach((address) => {
        if (address.family !== "IPv4" || address.internal) return;
        console.log(`[maguita] Detected interface ${name} ${address.address}/${address.netmask}`);
        results.push({
            // @ts-ignore
            ["adapter"]:name,
            title: `${name} (${address.address})`,
            tooltip: `Abrir com endereço de ${name} | ${address.address}`,
            enabled: true,
            click(): any {
                sys.openApp({ address: address.address })
            }
        })
    })
});

let last = 1;
let weight = {
    "Wi-Fi": last++,
    "Ethernet":last++
}

results.sort( (a, b) => {
    let _a:number = weight[a["adapter"]]||last;
    let _b:number = weight[b["adapter"]]||last;
    return _a - _b;
});

export const trayMenuConfigs = {
    title: 'LUMA POS',
    tooltip: 'LUMA POS',
    //language=file-reference
    favFolder: "/server/resources/fav"
}

function onChangeRemoteAccessResult(result: { result: boolean, old: boolean }, opt: string) {
    let notification: NotificationCenter.Notification = {
        //language=file-reference
        icon: path.join(__dirname, "../../../server/resources/fav/fav.ico"),
        title: "MAGUITA",
        subtitle: `${opt} acesso remoto`,
    };

    if (result.result && !result.old) notification.message = "Acesso remoto reativo!";
    else if (result.result && result.old) notification.message = "Acesso remoto ativado!";
    else notification.message = "Acesso remoto desativo";
    appToaster(notification);
}

function openBackgroundDevTools() {
    if (nwAppStatus.runningIntoNW) {
        nwAppStatus.notify("open-background-dev-tools")
    }
}


export const menuItemsMap: GenericMenuMaps = {
    home: {
        title: "Abrir Luma", tooltip: "Abrir página inicial", click() {
            sys.openApp({ /*language=file-reference*/ app: "/client/app/page/index.html"})
        }
    },
    pos: {
        title: "POS", tooltip: "Página de POS", click() {
            sys.openApp({browser: "pos", /*language=file-reference*/ app: "/client/app/page/pos.html"})
        }
    },
    web: {
        title: "WEB", tooltip: "Abrir no navagador", click() {
            sys.openApp()
        }, itemList: [
            // {
            //     title: "Local",
            //     tooltip: "Abrir no navegador | endereço local",
            //     click: () => sys.openApp({}),
            //     enabled: true
            // },
            ...results
        ],
    },

    [nanoid(6)]: GENERIC_SEPARATOR,
    // ["remote"]: {
    //     title: "Acesso remoto", tooltip: "Ativar/Desativar acesso remoto ao aplicativo",
    //     itemList: {
    //         ["enable"]: {
    //             title: "Ativar",
    //             tooltip: "Ativar acesso remoto ao aplicativo!",
    //             click(tray: GenericTray<any, any>, GenericMenuItem): any {
    //                 require("../../service/cluster.service").clusterServer.service.switchRemoteConnection(true).then(value => onChangeRemoteAccessResult(value, "Ativar"))
    //             }
    //         }, ["disable"]: {
    //             title: "Dasativar",
    //             tooltip: "Desativar acesso remoto ao aplicativo!",
    //             click(tray: GenericTray<any, any>, GenericMenuItem): any {
    //                 require("../../service/cluster.service").clusterServer.service.switchRemoteConnection(false).then(value => onChangeRemoteAccessResult(value, "Desativar"))
    //             }
    //         }
    //     }
    // }, [ nanoid(6) ]: GENERIC_SEPARATOR,
    // ["sync"]: {
    //     title: 'Syncs', tooltip: "Ferramentas de sincronização", itemList: {
    //         ["state"]: {
    //             title: "Estado", tooltip: "Estado atual da sinc.", click() {
    //             }
    //         },
    //         ["send"]: {
    //             title: "Enviar", tooltip: "Enviar modificações local", click() {
    //             }
    //         },
    //         ["receiver"]: {
    //             title: "Receber", tooltip: "Proucurar por modificações remotas", click() {
    //             }
    //         },
    //         ["fullCheck"]: {
    //             title: "Verificação completa",
    //             tooltip: "Verificar completamente modificações remotas",
    //             click() {
    //             }
    //         },
    //         ["restore"]: {
    //             title: "Restaurar", tooltip: "Receber todas as modificações", click() {
    //             }
    //         }
    //     }
    // },
    ["tools"]: {
        title: "Avancado", tooltip: "Ferramentas avançadas", itemList: [
            // {
            //     title: "Luma terminal", tooltip: "Maguita command line interface", click(tray): any {
            //         require("../../extension/ext/terminal").openAppShell();
            //     }
            // },

            // {
            //     title: "Snapshot log", tooltip: "Visualizar a copia do log atual",
            //     enabled: true,
            //     click(): any {
            //         const {launch} = require("../../service/log.service/logview");
            //         launch({logSnapshot: true})
            //     }
            // },
            {
                title: "DEV Tools",
                tooltip: "Open background dev tools",
                click(tray: GenericTray<any, any>, GenericMenuItem): any {
                    openBackgroundDevTools();
                }
            }
        ]
    }, [nanoid(6)]: GENERIC_SEPARATOR,

    about: {
        title: "Sobre", tooltip: "Sobre o sistema", click(): any {
            sys.openUrl("https://www.brainsoftstp.com/luma");
        }
    },

    // update: {
    //     title: "Atualizações", tooltip: "Proucurar por novas atualizações!", click(): any {
    //         appVersion.checkVersionUpdate().then(newVersionUrl => {
    //             if (newVersionUrl) appToaster({
    //                 //language=file-reference
    //                 icon: path.join(__dirname, "../../resources/fav/fav.ico"),
    //                 message: "Nova versão disponivel para transferência",
    //                 title: "Luma",
    //                 timeout: 1000,
    //                 actions: ["BAIXAR", "PASSAR"]
    //             }, (err, response, metadata) => {
    //                 if (response.toLowerCase() === "baixar") sys.openUrl(newVersionUrl)
    //             }); else appToaster({
    //                 //language=file-reference
    //                 icon: path.join(__dirname, "../../resources/fav/fav.ico"),
    //                 title: "Luma",
    //                 message: "Nenhuma atualização encontrada",
    //                 timeout: 1000,
    //                 actions: ["OK"]
    //             })
    //         });
    //     }
    // },

    [ nanoid(6) ]: GENERIC_SEPARATOR,
    // restart:{ title: "Reiniciar", tooltip: "Restart app", click() { sys.restart( exit )}},
    // shutdown:{ title: "Encerrar", tooltip: "Parar todos os serviços e encerrar o sistema", click( tray) {
    //         sys.shutdown( () => {
    //             return tray.close();
    //         })
    //     }},
    exit: {
        title: "Encerrar", tooltip: "Encerrar o sistema", click(tray) {
            sys.exit(() => {
                return tray.close()
            })
        }
    }
};


if( !results.length ){
    delete menuItemsMap["web"];
}

prepare(menuItemsMap);
