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
exports.printNetwork = void 0;
const moment_1 = __importDefault(require("moment"));
function printNetwork({ articles, table, idPrinter }) {
    return __awaiter(this, void 0, void 0, function* () {
        const ThermalPrinter = require("node-thermal-printer").printer;
        const PrinterTypes = require("node-thermal-printer").types;
        let printer = new ThermalPrinter({
            type: PrinterTypes.STAR,
            interface: 'tcp://' + idPrinter,
            characterSet: 'SLOVENIA',
            removeSpecialCharacters: false,
            lineCharacter: "=",
            options: {
                timeout: 5000
            }
        });
        yield printer.isPrinterConnected();
        yield printer.execute();
        printer.bold(true);
        printer.setTypeFontB();
        printer.alignCenter();
        printer.newLine();
        printer.println("MESA: " + table);
        printer.alignLeft();
        printer.println("Data: " + (0, moment_1.default)().format("DD-MM-YYYY HH:MM:SS"));
        printer.bold(false);
        articles.forEach(art => {
            printer.println(art.artigo_nome + " - " + art.venda_quantidade);
        });
        printer.beep();
        printer.cut();
        try {
            yield printer.execute();
            console.log('Print success.');
        }
        catch (error) {
            console.error('Print error:', error);
        }
    });
}
exports.printNetwork = printNetwork;
//# sourceMappingURL=kitchenArticlesNetwork.js.map