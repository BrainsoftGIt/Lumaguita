/*
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
*/

import { exec } from 'child_process';
export let print = (printerName: string, filePDF: string, paper = "POS") => {

// Replace the command with the appropriate command to print a PDF
    let command = `SumatraPDF.exe" -print-to "${filePDF}" "${printerName}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

