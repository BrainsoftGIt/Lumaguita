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
exports.compileDatabase = exports.toSQLTempFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const listen_1 = require("../../server/lib/utils/process/listen");
const psql_1 = require("../../server/lib/postgres/tools/psql");
const conn_1 = require("./conn");
const tmp_1 = __importDefault(require("tmp"));
const tools_1 = require("../../server/lib/postgres/tools");
const status_1 = require("../status");
function toSQLTempFile(str, opts) {
    let _default = path_1.default.join(process.cwd(), `${Math.trunc(Math.random() * 898965)}`);
    if (!opts)
        opts = { base: _default };
    if (!opts.base)
        opts.base = _default;
    if (!fs_1.default.existsSync(opts.base))
        fs_1.default.mkdirSync(opts.base, { recursive: true });
    let fName;
    if (!opts.extension)
        opts.extension = "";
    else if (opts.extension.charAt(0) !== ".")
        opts.extension = `.${opts.extension}`;
    let _path;
    while (!fName) {
        fName = `${Math.trunc(Math.random() * 998874)}`;
        fName = `${fName}${opts.extension}`;
        _path = path_1.default.join(opts.base, fName);
        if (fs_1.default.existsSync(_path)) {
            fName = null;
            _path = null;
        }
    }
    str = str.map(value => {
        value = value.trim();
        if (value.charAt(value.length - 1) !== ";")
            value += ";";
        return value;
    });
    let text = str.join("\n");
    fs_1.default.writeFileSync(_path, text);
    return {
        file: _path,
        base: opts.base,
        name: fName,
        extension: opts.extension
    };
}
exports.toSQLTempFile = toSQLTempFile;
function compileDatabase(args, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, status_1.envStatus)(args, opts);
        if (!opts)
            opts = {
                create: true,
                force: false,
                clean: true,
                menu: true,
                grants: true,
                connection: "local"
            };
        if (!args)
            args = require("../../server/global/args").args;
        let connection;
        connection = conn_1.connFactory[opts.connection || "local"](args);
        let { app, superMode, superModeApp } = connection;
        const pexec = (file, connection, _console = true) => __awaiter(this, void 0, void 0, function* () {
            let next = Object.assign({}, connection.args);
            next.file = file;
            if (opts.showCommandOnly) {
                const prepare = (0, tools_1.postgresqlPrepare)(next, connection.options);
                console.log("psql ", prepare.args.join(" "));
                return;
            }
            next.file = file;
            return (0, listen_1.processListen)((0, psql_1.psql)(next, connection.options), {
                console: _console,
            });
        });
        let tempDir = tmp_1.default.dirSync({
            prefix: "compile-", postfix: "-sql",
            keep: true
        });
        let _dirOpts = {
            base: tempDir.name,
            extension: ".sql"
        };
        if (opts.create) {
            let compile = toSQLTempFile(require("./install.sql").createUserDatabase(args, opts), _dirOpts);
            yield pexec(compile.file, superMode);
            //language=file-reference
            yield pexec(path_1.default.join(__dirname, "extension.sql"), superModeApp);
            //language=file-reference
            yield pexec(path_1.default.join(__dirname, "base.db"), app);
        }
        //language=file-reference
        if (opts.clean)
            yield pexec(path_1.default.join(__dirname, "clean.sql"), app, false);
        //language=file-reference
        if (opts.menu)
            yield pexec(path_1.default.join(__dirname, "menu.sql"), app, false);
        if (opts.grants) {
            let compile = toSQLTempFile(require("./grants.sql").grantsSql(args, opts), _dirOpts);
            yield pexec(compile.file, superModeApp);
        }
        let compile = toSQLTempFile(require("./users.sql").usersSql(args, opts), _dirOpts);
        yield pexec(compile.file, superModeApp);
        // //language=file-reference
        // await pexec( path.join(__dirname, "patches/currency.sql" ), app,  false );
        console.log("#REMOVE: ", tempDir.name);
        if (opts.showCommandOnly) {
            console.log("rm -rf ", tempDir.name);
            return;
        }
        fs_1.default.rmSync(tempDir.name, {
            recursive: true
        });
    });
}
exports.compileDatabase = compileDatabase;
//# sourceMappingURL=install.js.map