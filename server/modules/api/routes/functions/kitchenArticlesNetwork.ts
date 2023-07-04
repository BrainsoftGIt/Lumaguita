import moment from "moment";

export async function printNetwork({articles, table, idPrinter}){
    const ThermalPrinter = require("node-thermal-printer").printer;
    const PrinterTypes = require("node-thermal-printer").types;

   let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: 'tcp://'+idPrinter,
        characterSet: 'SLOVENIA',
        removeSpecialCharacters: false,
        lineCharacter: "=",
        options:{
            timeout: 5000
        }
    });

    await printer.isPrinterConnected();
    // await printer.execute();
    printer.bold(true);
    printer.setTypeFontB();
    printer.alignCenter();
    printer.newLine();
    printer.println("MESA: "+table);
    printer.alignLeft();
    printer.println("Data: "+moment().format("DD-MM-YYYY HH:MM:SS"));
    printer.bold(false);
    articles.forEach(art =>{
        printer.println(art.artigo_nome+" - "+art.venda_quantidade);
    });

    printer.beep();
    printer.cut();
    try {
        await printer.execute();
        console.log('Print success.');
    } catch (error) {
        console.error('Print error:', error);
    }
}