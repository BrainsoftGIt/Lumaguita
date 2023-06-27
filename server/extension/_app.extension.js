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
exports.requireAppUpdated = exports.prepareDatabase = exports.getSys = void 0;
const args_1 = require("../global/args");
const path_1 = __importDefault(require("path"));
const sys_1 = require("../global/sys");
const snotify_1 = require("../snotify");
const ctrl_1 = require("./ctrl");
const detect_port_1 = __importDefault(require("detect-port"));
const open_ports_1 = require("./open-ports");
const fs_1 = __importDefault(require("fs"));
const project_1 = require("../global/project");
const patch_1 = require("../../database/patch");
const promise_1 = require("../lib/utils/promise");
const dumps_1 = require("../service/database.service/dumps");
function getSys() {
    return require("../global/sys").sys;
}
exports.getSys = getSys;
function prepareDatabase() {
    snotify_1.serverNotify.loadingBlock("Manutenção de banco de dados");
    snotify_1.serverNotify.loadingBlockItem("Criando copia de segurança preventiva...");
    return (0, dumps_1.dumpNow)(null, { suffix: "before-upgrade" }).then(value => {
        return (0, promise_1.promiseResolve)((0, patch_1.applyDatabasePatches)()).then(value => {
            if (value.success) {
                snotify_1.serverNotify.loadingBlockItem("Criando copia de segurança final...");
                (0, dumps_1.dumpNow)(null, { suffix: "before-upgrade" }).then(value1 => {
                    (0, dumps_1.autoDumpService)().then();
                });
                return Promise.resolve("ok");
            }
            else {
                snotify_1.serverNotify.loading("FAILED!");
                snotify_1.serverNotify.loadingBlock("Database upgrade patches... [FAILED]");
                snotify_1.serverNotify.loadingBlockItem("Falha ao aplicar atualização criticas de banco de dados.");
            }
        });
    });
}
exports.prepareDatabase = prepareDatabase;
const startServer = (onReady) => {
    snotify_1.serverNotify.loadingBlock("A iniciar o servidor...");
    const { appModules } = require("../modules");
    module.exports = {
        appModules
    };
    if (typeof onReady === "function") {
        onReady();
    }
};
function requireAppUpdated(next) {
    /*appVersion.checkVersionUpdate().then( newVersionUrl => {
        if( newVersionUrl ) appToaster({
            //language=file-reference
            icon: path.join( __dirname, "../resources/fav/fav.ico" ),
            message: "Nova versão disponivel para transferência",
            title: "Luma",
            timeout: 1000,
            actions: [ "BAIXAR", "PASSAR" ]
        }, (err, response, metadata) => {
            if( response.toLowerCase() === "baixar" ) sys.openUrl( newVersionUrl );
            else appToaster({
                //language=file-reference
                icon: path.join( __dirname, "../resources/fav/fav.ico" ),
                title: "Luma",
                message: "Atualização critica!\nNão pode continuar antes de baixar e instalar essa nova versão!\nEstamos encerrando...",
                timeout: 1000,
            }, (err1, response1, metadata1) => {
                sys.shutdown()
            })
        });
        else next();
    });*/
    next();
}
exports.requireAppUpdated = requireAppUpdated;
function proceedPlay() {
    const { autoDumpService } = require("../service/database.service/dumps");
    const { startApplicationDatabase } = require("./database.extension");
    (0, ctrl_1.createCTRL)();
    (0, detect_port_1.default)(args_1.args.appPort).then((port) => __awaiter(this, void 0, void 0, function* () {
        args_1.args.appPort = port;
        snotify_1.serverNotify.loading("A configurar ambiente...");
        (0, open_ports_1.openPorts)().then();
        snotify_1.serverNotify.loading("A carregar módulos...");
        snotify_1.serverNotify.loadingBlock("A iniciar o tray...");
        const { systrayStart } = require("../global/systray");
        systrayStart();
        fs_1.default.writeFileSync(path_1.default.join(project_1.folders.home, "current.pid"), String(process.pid));
        if (args_1.args.dbMode === "app") {
            args_1.args.dbPort = args_1.args.dbPortDatabaseApp;
            snotify_1.serverNotify.loadingBlock("A Recuperar base de dados...");
            startApplicationDatabase()
                .then(value => {
                prepareDatabase().then(value1 => {
                    snotify_1.serverNotify.loadingBlock("A iniciar o servidor...");
                    startServer(snotify_1.serverNotify.ready);
                });
            });
        }
        else if (args_1.args.dbMode === "system") {
            snotify_1.serverNotify.loadingBlock("A iniciar o servidor...");
            prepareDatabase().then(value1 => {
                snotify_1.serverNotify.loadingBlock("A iniciar o servidor...");
                startServer(snotify_1.serverNotify.ready);
            });
            return;
        }
        else {
            prepareDatabase().then(value1 => {
                snotify_1.serverNotify.loadingBlock("A iniciar o servidor...");
                startServer(snotify_1.serverNotify.ready);
            });
        }
    }));
}
const play = () => {
    snotify_1.serverNotify.loading("Verificando o servidor...");
    function next() {
        (0, args_1.describeArgs)();
        (0, ctrl_1.detectServer)().then(value => {
            if (value) {
                value.write(ctrl_1.ServerCtl.OPEN);
                snotify_1.serverNotify.loading("Abrindo o sistema");
                setTimeout(() => {
                    sys_1.sys.exit();
                }, 1000 * 2);
            }
            else
                proceedPlay();
        });
    }
    requireAppUpdated(next);
};
args_1.lineArgs.defineCommand({ name: "play", callback: play });
args_1.lineArgs.defineCommand({ name: "start", callback: play });
args_1.lineArgs.defineCommand(receiver => {
    if (args_1.lineArgs.command.command && args_1.lineArgs.command.command.length > 0)
        return;
    play();
});
//# sourceMappingURL=_app.extension.js.map