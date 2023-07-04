import {JavaCaller} from "java-caller";
import path from "path";

export let print = (printerName, filePDF) => {

    //language=file-reference
    const java = new JavaCaller({
        jar: path.relative(process.cwd(), path.join(__dirname, "../../../../../libs/PrinterPDF.jar"))
    });

    java.run([ "-printer", printerName, "-file", filePDF]).then( ({status, stdout, stderr}) => {
        console.log( stdout, stderr, status )
    });
}


export let printIp = (printerName, filePDF, ip, port) => {

    //language=file-reference
    const java = new JavaCaller({
        jar: path.relative(process.cwd(), path.join(__dirname, "../../../../../libs/PrinterPDF.jar"))
    });

    java.run([ "-printer", printerName, "-file", filePDF, "-ip", ip, "-port", port]).then( ({status, stdout, stderr}) => {
        console.log( stdout, stderr, status )
    });
}
