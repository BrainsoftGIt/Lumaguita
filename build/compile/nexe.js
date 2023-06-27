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
exports.nexeStart = void 0;
const nexe_1 = require("nexe");
const res_1 = require("./res");
const Path = __importStar(require("path"));
function nexeStart() {
    //TODO NEXE uncomment this [RETURN] for skip exe builder
    //return  Promise.resolve(true)
    const _res = (0, res_1.res)();
    return (0, nexe_1.compile)(Object.assign({
        name: "MAGUITA",
        cwd: _res.cwd,
        input: _res.entry,
        output: _res.output,
        verbose: true,
        //language=file-reference
        ico: Path.join(__dirname, "../../server/resources/fav/fav.ico"),
        rc: {
            CompanyName: "BrainsoftSTP",
            PRODUCTVERSION: "17,3,0,0",
            FILEVERSION: "1,2,3,4"
        },
        build: true,
        enableNodeCli: false,
        enableStdIn: false,
        // fakeArgv:[ ],
    })).then(value => {
        console.log(value);
        return Promise.resolve({
            out: _res.output
        });
    });
}
exports.nexeStart = nexeStart;
//# sourceMappingURL=nexe.js.map