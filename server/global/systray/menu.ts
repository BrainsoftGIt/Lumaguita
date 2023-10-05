import os from "os";
import { sys } from "../sys";
import {launch} from "../../service/log.service/logview";
import {appVersion} from "../version/app";
import path from "path";
import {GENERIC_SEPARATOR, GenericMenuItem, GenericMenuMaps, GenericTray, prepare} from "./engine";
import {appToaster} from "../../lib/toaster";
import notifier from "node-notifier";
import NotificationCenter from "node-notifier/notifiers/notificationcenter";
import op from "open";
import fs from "fs";
import {nw} from "../../../client/app/nw";
import {nwAppStatus} from "../../../client/app/status";

const nets: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();

const results:GenericMenuItem<GenericMenuMaps>[] = [];

Object.entries( nets ).forEach( (next)=>{
    const [ name, value ]  =next;
    value.forEach( (address)=>{
        if( address.family !== "IPv4" || address.internal ) return;
        console.log( `[maguita] Detected interface ${ name } ${ address.address }/${ address.netmask }` );
        results.push( { title: `Endereço ${ name }`, tooltip: `Abrir com endereço de ${name} | ${ address.address }`, enabled: true ,click(): any {
                sys.openApp( { address: address.address })
            }})
    })
});

export const trayMenuConfigs = {
    title: 'LUMA POS',
    tooltip: 'LUMA POS',
    //language=file-reference
    favFolder: "/server/resources/fav"
}

function onChangeRemoteAccessResult( result:{ result:boolean, old:boolean }, opt:string){
    let notification:NotificationCenter.Notification = {
        //language=file-reference
        icon: path.join( __dirname, "../../../server/resources/fav/fav.ico" ),
        title: "MAGUITA",
        subtitle: `${ opt } acesso remoto`,
    };

    if( result.result && !result.old ) notification.message = "Acesso remoto reativo!" ;
    else if( result.result && result.old ) notification.message = "Acesso remoto ativado!";
    else notification.message =  "Acesso remoto desativo";
    appToaster( notification );
}

function openBackgroundDevTools(){
    if( nwAppStatus.runningIntoNW ){
        nwAppStatus.notify("open-background-dev-tools")
    }
}

export const menuItemsMap:GenericMenuMaps = {
    home: { title: "Abrir", tooltip: "Abrir pÁgina inicial", click() { sys.openApp( { /*language=file-reference*/ app: "/client/app/page/index.html"}) } },
    pos:  { title: "POS", tooltip: "PÁgina de POS", click() { sys.openApp( { browser: "pos", /*language=file-reference*/ app: "/client/app/page/pos.html" } ) } },
    web:  { title: "WEB", tooltip: "Abrir no navagador", click() { sys.openApp( ) }, itemList:[
            { title: "Local", tooltip: "Abrir no navegador | endereço local", click: ()=> sys.openApp({} ), enabled: true },
            ... results
        ]},

    [ Math.random() ]: GENERIC_SEPARATOR,
    [ "remote" ]: { title: "Acesso remoto", tooltip: "Ativar/Desativar acesso remoto ao aplicativo",
        itemList: {
            ["enable"]:{ title: "Ativar", tooltip: "Ativar acesso remoto ao aplicativo!", click(tray: GenericTray<any, any>, GenericMenuItem): any {
                require( "../../service/cluster.service").clusterServer.service.switchRemoteConnection( true ).then( value => onChangeRemoteAccessResult( value, "Ativar"))
            }}, ["disable"]:{title: "Dasativar", tooltip: "Desativar acesso remoto ao aplicativo!", click(tray: GenericTray<any, any>, GenericMenuItem): any {
                require( "../../service/cluster.service").clusterServer.service.switchRemoteConnection( false ).then( value => onChangeRemoteAccessResult( value, "Desativar") )
            }}
    }
    }, [ Math.random() ]: GENERIC_SEPARATOR,
    [" sync" ]: { title: 'Syncs', tooltip: "Ferramentas de sincronização", itemList: {
        ["state"]: { title: "Estado", tooltip: "Estado atual da sinc.", click() {  } },
        ["send"]: { title: "Enviar", tooltip: "Enviar modificações local", click() {} },
        ["receiver"]: { title: "Receber", tooltip: "Proucurar por modificações remotas", click() {  } },
        ["fullCheck"]: { title: "Verificação completa", tooltip: "Verificar completamente modificações remotas", click() {  } },
        ["restore"]: { title: "Restaurar", tooltip: "Receber todas as modificações", click() {  } }
    }
    }, ["tools"]: { title: "Avancado", tooltip: "Ferramentas avançadas", itemList:[
        { title: "Luma terminal", tooltip: "Maguita command line interface", click(tray ): any {
            require("../../extension/ext/terminal").openAppShell();
        }},
        { title: "BACKUP", tooltip: "Gerar backup do banco de dados agora" },
        { title: "Snapshot log", tooltip: "Visualizar a copia do log atual",
            enabled: true,
            click(): any {
            const { launch } = require( "../../service/log.service/logview" );
            launch({ logSnapshot: true })
        }},
            { title: "DEV Tools", tooltip: "Open background dev tools", click(tray: GenericTray<any, any>, GenericMenuItem): any {
                openBackgroundDevTools();
            }}
        ]
    }, [ Math.random() ]: GENERIC_SEPARATOR,

    about:{ title: "Sobre", tooltip: "Sobre o sistema", click(): any {
        sys.openUrl( "https://www.brainsoftstp.com/luma" );
    }},

    update:{ title: "Atualizações", tooltip: "Proucurar por novas atualizações!", click(): any {
            appVersion.checkVersionUpdate().then( newVersionUrl => {
                if( newVersionUrl ) appToaster({
                    //language=file-reference
                    icon: path.join( __dirname, "../../resources/fav/fav.ico" ),
                    message: "Nova versão disponivel para transferência",
                    title: "Luma",
                    timeout: 1000,
                    actions: [ "BAIXAR", "PASSAR" ]
                }, (err, response, metadata) => {
                    if( response.toLowerCase() === "baixar" ) sys.openUrl( newVersionUrl )
                }); else appToaster({
                    //language=file-reference
                    icon: path.join( __dirname, "../../resources/fav/fav.ico" ),
                    title: "Luma",
                    message: "Nenhuma atualização encontrada",
                    timeout: 1000,
                    actions: [ "OK" ]
                })
            });
        }},

    [ Math.random() ]: GENERIC_SEPARATOR,
    // restart:{ title: "Reiniciar", tooltip: "Restart app", click() { sys.restart( exit )}},
    shutdown:{ title: "Encerrar", tooltip: "Parar todos os serviços e encerrar o sistema", click( tray) {
            sys.shutdown( () => {
                return tray.close();
            })
        }},
    // exit: { title: "Sair", tooltip: "Encerrar o sistema", click( tray) { sys.exit( () => {
    //         return tray.close()
    //     })}}
};

prepare( menuItemsMap );
