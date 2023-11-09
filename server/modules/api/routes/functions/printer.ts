import { exec } from 'child_process';
export let print = (printerName: string, filePDF: string, paper = "POS") => {

// Replace the command with the appropriate command to print a PDF
    let command = `SumatraPDF.exe -print-to "${printerName}" "${filePDF}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`, "stderr", stderr);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

