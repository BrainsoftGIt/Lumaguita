import fs from "fs";

export function moveFile(source: string, destination: string, callback: (err?: NodeJS.ErrnoException | null) => void) {
    fs.rename(source, destination, (renameError) => {
        if (!renameError) return callback(null);
        if (renameError.code !== "EXDEV") return callback(renameError);

        fs.copyFile(source, destination, (copyError) => {
            if (copyError) return callback(copyError);
            fs.unlink(source, callback);
        });
    });
}

export function moveFileSync(source: string, destination: string) {
    try {
        fs.renameSync(source, destination);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EXDEV") throw error;
        fs.copyFileSync(source, destination);
        fs.unlinkSync(source);
    }
}
