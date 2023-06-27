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
const index_1 = require("../index");
const path = __importStar(require("path"));
index_1.kconst.target(target => {
    //language=file-reference
    index_1.targets.KNode = target.nodeJs({ className: "K", typescript: true, dir: path.join(__dirname, "../../../server/global/autogen"), });
    //language=file-reference
    // @ts-ignore
    index_1.targets.dbConnection = target.nodeJs({ className: "db", dir: path.join(__dirname, "../../../server/global/autogen/config") });
    //language=file-reference
    // @ts-ignore
    index_1.targets.srvConfig = target.nodeJs({ className: "srv", dir: path.join(__dirname, "../../../server/global/autogen/config") });
    //language=file-reference
    // @ts-ignore
    index_1.targets.srvDBK = target.nodeJs({ className: "DBK", dir: path.join(__dirname, "../../../server/global/autogen") }); //language=file-reference
    //language=file-reference
    index_1.targets.webDBK = target.js({ className: "DBK", dir: path.join(__dirname, "../../../client/public/assets/js/admin") });
    //language=file-reference
    index_1.targets.java = target.java({ className: "JavaClass", dir: path.join(__dirname, "../../../server/global/autogen/java"), packageName: "com.brainsoft.piripiri" });
    //language=file-reference
    index_1.targets.web = target.js({ className: "Config", dir: path.join(__dirname, "../../../client/public/assets/js/socket") });
});
//# sourceMappingURL=default.target.js.map