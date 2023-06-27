"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../server/patches/global/child_process_patches");
const terminal_kit_1 = require("terminal-kit");
const install_1 = require("./install");
const conn_1 = require("./conn");
const arguments_1 = require("zoo.util/lib/arguments");
const os_1 = __importDefault(require("os"));
const pg_recoginizer_1 = require("../../server/lib/postgres/pg-recoginizer");
const defaults_1 = require("../../server/global/defaults");
const status_1 = require("../status");
const term = terminal_kit_1.terminal;
const steppes = [];
let nav;
const start = () => {
    nav = [...steppes];
    const next = () => {
        if (steppes.length) {
            let _next = steppes.shift();
            _next(next);
        }
        else
            process.exit();
    };
    next();
};
const compileOpts = {
    force: false,
    create: false,
    clean: false,
    grants: false
};
let args = require("../../server/global/args").args;
function terminate() {
    term.grabInput(false);
    setTimeout(function () { process.exit(); }, 100);
}
term.on('key', function (name, matches, data) {
    // console.log( "'key' event:" , name ) ;
    if (name === 'CTRL_C') {
        terminate();
    }
});
let tOpts = {
    cancelable: true
};
let cliArgs = new arguments_1.Arguments(true);
cliArgs.define({ name: "cliNew", alias: "N", type: Boolean, value: false });
cliArgs.define({ name: "cliLocal", alias: "L", type: Boolean, value: false });
cliArgs.define({ name: "cliForce", alias: "f", type: Boolean, value: false });
cliArgs.define({ name: "cliCreate", alias: "d", type: Boolean, value: false });
cliArgs.define({ name: "cliClean", alias: "c", type: Boolean, value: false });
cliArgs.define({ name: "cliMenu", alias: "m", type: Boolean, value: false });
cliArgs.define({ name: "cliGrants", alias: "g", type: Boolean, value: false });
cliArgs.define({ name: "cliConnection", type: String });
cliArgs.define({ name: "cliYes", alias: "y", type: Boolean, value: false });
cliArgs.define({ name: "cliConfirm", alias: "Y", type: Boolean, value: false });
cliArgs.define({ name: "info", alias: "I", type: Boolean, value: false });
cliArgs.define({ name: "showCommandOnly", alias: "C", type: Boolean, value: false });
let cliValues = cliArgs.values;
compileOpts.showCommandOnly = cliValues.showCommandOnly;
if (cliValues.cliNew) {
    Object.assign(cliValues, {
        cliForce: true,
        cliCreate: true,
        cliClean: true,
        cliGrants: true,
        cliMenu: true
    });
}
if (cliValues.cliLocal && (!cliValues.cliConnection || cliValues.cliConnection === "local"))
    cliValues.cliConnection = "local";
else if (cliValues.cliLocal && cliValues.cliConnection)
    cliValues.cliConnection = null;
steppes.push((next) => {
    compileOpts.force = cliValues.cliForce;
    if (compileOpts.force) {
        return next();
    }
    (0, terminal_kit_1.terminal)("Limpar e reconfigurar a base de dados?").singleRowMenu(["Não", "Sim"], tOpts, (err, arg) => {
        compileOpts.force = arg.selectedIndex === 1;
        next();
    });
});
steppes.push((next) => {
    compileOpts.create = compileOpts.force || cliValues.cliCreate;
    if (compileOpts.create) {
        return next();
    }
    (0, terminal_kit_1.terminal)("Criar banco de dados e utilizador?").singleRowMenu(["Sim", "Não"], tOpts, (err, arg) => {
        compileOpts.create = arg.selectedIndex === 0;
        next();
    });
});
steppes.push((next) => {
    compileOpts.clean = cliValues.cliClean || compileOpts.create;
    if (compileOpts.clean)
        return next();
    (0, terminal_kit_1.terminal)("Reiniciar o estado dos dados?").singleRowMenu(["Não", "Sim"], tOpts, (err, arg) => {
        compileOpts.clean = arg.selectedIndex === 1;
        next();
    });
});
steppes.push((next) => {
    compileOpts.menu = cliValues.cliClean || compileOpts.create || cliValues.cliClean;
    if (compileOpts.menu)
        return next();
    (0, terminal_kit_1.terminal)("Reconfigurar menus?").singleRowMenu(["Não", "Sim"], tOpts, (err, arg) => {
        compileOpts.menu = arg.selectedIndex === 1;
        next();
    });
});
steppes.push((next) => {
    compileOpts.grants = cliValues.cliGrants || compileOpts.create;
    if (compileOpts.grants)
        return next();
    (0, terminal_kit_1.terminal)("Reconfigurar os grants?").singleRowMenu(["Sim", "Não"], tOpts, (err, arg) => {
        compileOpts.grants = arg.selectedIndex === 0;
        next();
    });
});
steppes.push((next) => {
    let _conn = cliValues.cliConnection;
    if (_conn && conn_1.connectionsName.includes(_conn)) {
        compileOpts.connection = _conn;
        return next();
    }
    (0, terminal_kit_1.terminal)("Especifica o tipo de conexão?" + conn_1.connectionsName.join(" | ")).singleRowMenu(conn_1.connectionsName, tOpts, (err, arg) => {
        compileOpts.connection = arg.selectedText;
        next();
    });
});
steppes.push((next) => {
    (0, status_1.envStatus)(args, compileOpts);
    if (cliValues.cliYes && cliValues.cliConfirm) {
        return next();
    }
    (0, terminal_kit_1.terminal)("Continuar com a compilação?").singleRowMenu(["Sim", "Restart", "Cancel"], tOpts, (err, arg) => {
        if (arg.selectedIndex === 2)
            return process.exit(0);
        else if (arg.selectedIndex === 1)
            return start();
        else if (arg.selectedIndex === 0)
            return next();
        else
            return process.exit(-1);
    });
});
const compile = (next) => {
    (0, install_1.compileDatabase)(args, compileOpts).then(value => {
        console.log(value);
        next();
    }).catch(reason => {
        console.error(reason);
        next();
    });
};
steppes.push((next) => {
    //Final steps
    console.log("====================== Final steeps ====================");
    if (os_1.default.platform() === "win32") {
        pg_recoginizer_1.pgServer.recognizePath(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then(value => {
            compile(next);
        });
    }
    else
        compile(next);
});
if (cliValues.info) {
    (0, status_1.envStatus)(args, compileOpts);
}
else {
    start();
}
//# sourceMappingURL=cli.js.map