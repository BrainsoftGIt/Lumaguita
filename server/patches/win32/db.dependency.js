"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installWin32DatabaseServer = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const index_1 = require("../index");
const win32_1 = require("../../lib/utils/process/win32");
const toaster_1 = require("../../lib/toaster");
function installWin32DatabaseServer() {
    console.log("INSTALLING POSTGRESQL SERVER...", process.argv);
    //language=file-reference
    const installer = path_1.default.join(__dirname, "../../../build/installers/database.exe");
    const args = [
        "--mode", "unattended",
        "--enable-components", "server,commandlinetools"
    ];
    return (0, win32_1.execFileElevate)(installer, args);
}
exports.installWin32DatabaseServer = installWin32DatabaseServer;
if (os_1.default.platform() === "win32") {
    index_1.appPatches.installDatabaseServer = () => {
        return new Promise((resolve, reject) => {
            if (os_1.default.platform() !== "win32")
                return reject(new Error("Current platform is not windows!"));
            console.log(chalk_1.default.redBright("Check database server app support status... [NEED-INSTALL]"));
            //language=file-reference
            const icon = path_1.default.join(__dirname, "../../resources/fav/fav.png");
            (0, toaster_1.appToaster)({
                title: "MAGUITA",
                icon: icon,
                message: "O sistema não detectou o banco de dados PostgreSQL instalado neste dispositivo!\n",
                actions: ["Instalar", "Agora não!"]
            }, (err, response, metadata) => {
                let installNow = response === "Instalar".toLowerCase() || response === "timeout";
                if (!installNow)
                    return process.exit(-1);
                if (installNow) {
                    (0, toaster_1.appToaster)({
                        icon: icon,
                        title: "MAGUITA",
                        message: "O processo de instalação de banco de dados foi inicializado!\nDê permisão e espere até que sejá concluido",
                    });
                    const _process = installWin32DatabaseServer();
                    const failed = (error) => {
                        if (error)
                            console.error(error);
                        (0, toaster_1.appToaster)({
                            icon: icon,
                            title: "MAGUITA",
                            message: `Opss! Algo deu mal tente mais tarde!\n${(error === null || error === void 0 ? void 0 : error.message) || ""}`,
                        });
                        reject(new Error("installDatabaseServer: Opss! Algo deu mal tente mais tarde! :: " + (error === null || error === void 0 ? void 0 : error.message)));
                        process.exit(-1);
                    };
                    const success = () => {
                        (0, toaster_1.appToaster)({
                            title: "MAGUITA",
                            message: "Parabéns! O banco de dados foi instalado com sucesso!\nTudo estara pronto em breve!",
                        });
                        resolve(true);
                    };
                    _process.on("exit", code => {
                        (0, toaster_1.appToaster)({
                            title: "MAGUITA",
                            icon: icon,
                            message: "A instalação terminou!\nInicialize novamente o sistema para continuar!"
                        }, (err1, response1, metadata1) => {
                        });
                    });
                    _process.on("error", err1 => {
                        failed(err1);
                    });
                    _process.on("close", (code, signal) => {
                        if (code === 0)
                            success();
                        else
                            failed();
                    });
                }
            });
        });
    };
}
//# sourceMappingURL=db.dependency.js.map