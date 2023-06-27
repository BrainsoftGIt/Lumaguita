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
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCore = void 0;
const updater_1 = require("./updater");
const escape = __importStar(require("pg-escape"));
const escaped_1 = require("./escaped");
const base_sql_1 = require("./base.sql");
function installCore(connection) {
    let schema = (0, escaped_1.escapedParameter)(escape.ident(updater_1.status.configs.schema));
    let _schema = (0, escaped_1.escapedParameter)(`*/ ${escape.ident(updater_1.status.configs.schema)} . /*`);
    let sql = (str, ...values) => {
        let text = "";
        let counter = 0;
        str.forEach((value, index) => {
            if (index > 0) {
                let label = `<< EXPRESSION $${++counter}>>`;
                if (values[index - 1].literal)
                    label = values[index - 1].literal;
                text += label;
            }
            text += value;
        });
        if (updater_1.status.debugRaw)
            console.log(text);
        return connection.sql(str, ...values);
    };
    return (0, base_sql_1.base)({ schema, _schema, sql });
}
exports.installCore = installCore;
//# sourceMappingURL=install.js.map