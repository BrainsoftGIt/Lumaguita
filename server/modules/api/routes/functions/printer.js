"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const java_caller_1 = require("java-caller");
const path_1 = __importDefault(require("path"));
let print = (printerName, filePDF, paper = "POS") => {
    //language=file-reference
    const java = new java_caller_1.JavaCaller({
        jar: path_1.default.relative(process.cwd(), path_1.default.join(__dirname, "../../../../../libs/PrinterPDF.jar"))
    });
    java.run(["-printer", printerName, "-file", filePDF, "-paper", paper]).then(({ status, stdout, stderr }) => {
        console.log(stdout, stderr, status);
    });
};
exports.print = print;
//# sourceMappingURL=printer.js.map