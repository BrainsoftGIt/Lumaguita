import {JavaCaller} from "java-caller";
import path from "path";

export let print = (printerName, filePDF, paper = "POS") => {

    //language=file-reference
    const java = new JavaCaller({
        jar: path.relative(process.cwd(), path.join(__dirname, "../../../../../libs/PrinterPDF.jar"))
    });

    java.run([ "-printer", printerName, "-file", filePDF, "-paper", paper]).then( ({status, stdout, stderr}) => {
        console.log( stdout, stderr, status )
    });
}
