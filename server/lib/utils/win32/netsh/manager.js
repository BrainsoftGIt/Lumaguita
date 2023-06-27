"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.netshRuleManage = void 0;
require("source-map-support").install();
const child_process_1 = __importStar(require("child_process"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const tempscript_1 = require("../../tempscript");
const win32_engine_1 = require("../../tempscript/engines/win32.engine");
const NETSH_FIREWALL = 'NETSH ADVFIREWALL FIREWALL';
const CREATE = 'ADD RULE';
const READ = 'SHOW RULE';
const UPDATE = 'SET RULE';
const DELETE = 'DELETE RULE';
const netshEngine = {
    parse(rule, stdout) {
        let lines = stdout.split("\n");
        let bloks = [];
        let nextLot = "";
        lines.forEach(line => {
            if (!line.trim().length || line.trim() === "Ok.") {
                if (nextLot.length)
                    bloks.push(nextLot);
                nextLot = "";
                return;
            }
            nextLot += "\n";
            nextLot += line;
        });
        let results = [];
        bloks.forEach(block => {
            // block = block;
            let _rule = {};
            if (rule != READ)
                return undefined;
            let rows = block.split('\n');
            rows.forEach(function (item, index) {
                if (index == 0 || index == 2 || index > rows.length - 4)
                    return;
                let row = item.split(':');
                _rule[row[0]] = row[1].replace('\r', '').trim();
            });
            results.push(_rule);
        });
        if (results.length === 1)
            return results[0];
        else
            return results;
    }, stringify(object) {
        return JSON.stringify(object).replace('{', '').replace('}', '').replace(/,/gi, ' ').replace(/:/gi, '=');
    }, command(rule, opts, update) {
        return NETSH_FIREWALL + " " + rule + " " + this.stringify(opts) + " " + (update ? "new " + this.stringify(update) : '');
    }, queryOf(entry) {
        let keys = Object.keys(entry);
        let query = {};
        if (keys.includes("name"))
            query["name"] = entry.name;
        if (keys.includes("dir"))
            query["dir"] = entry.dir;
        return query;
    }, execute(rule, opts, update) {
        const self = this;
        let query = self.queryOf(update || opts);
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function* () {
                if ([READ].includes(rule)) {
                    let command = self.command(rule, query);
                    child_process_1.default.exec(command, { encoding: 'buffer' }, function (err, stdout, stderr) {
                        if (err)
                            reject(err);
                        else {
                            var out = iconv_lite_1.default.decode(stdout, 'euc-kr');
                            resolve(self.parse(rule, out));
                        }
                    });
                }
                else {
                    let command = self.command(rule, opts, update);
                    console.log(command);
                    const script = new tempscript_1.TempScript(win32_engine_1.win32TempScriptEngine)
                        .command(command)
                        .script;
                    const elevate = "elevate.exe";
                    let process = (0, child_process_1.spawn)(elevate, [script.filename]);
                    process.on("exit", code => {
                        setTimeout(() => {
                            self.execute(READ, query).then(resolve).catch(reject);
                        }, 1000);
                    });
                }
            });
        });
    }
};
exports.netshRuleManage = {
    get(rule) {
        return new Promise((resolve) => {
            netshEngine.execute(READ, rule).then(resolve)
                .catch(reason => { resolve(null); });
        });
    }, add(rule) {
        return netshEngine.execute(CREATE, rule);
    }, delete(rule) {
        return netshEngine.execute(DELETE, rule);
    }, update(query, update) {
        return netshEngine.execute(UPDATE, query, update);
    }, sets(rule) {
        let self = this;
        return self.get(rule).then(value => {
            if (Array.isArray(value))
                return Promise.resolve(null);
            else if (value && typeof value === "object")
                return self.update(netshEngine.queryOf(rule), rule);
            else
                return self.add(rule);
        }).catch(reason => {
            console.error(reason);
            return self.add(rule);
        });
    }
};
//# sourceMappingURL=manager.js.map