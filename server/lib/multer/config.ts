import fs from "fs";

const multer = require("multer");
import path from "path";
import crypto from "crypto";
import { folders} from "../../global/project";

function uploadFile(){
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
            cb(null, path.join(folders.temp, 'multer'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(20, (err, hash) => {
                if (err) cb(err);
                file.key = `${hash.toString("hex")}.${path.extname(file.originalname)}`;
                cb(null, file.key);
            });
        }
    });
    return  multer({storage: storage}).single("file");
}


module.exports = uploadFile;


