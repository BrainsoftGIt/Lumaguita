"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer = require("multer");
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const project_1 = require("../../global/project");
function uploadFile() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
            cb(null, path_1.default.join(project_1.folders.temp, 'multer'));
        },
        filename: (req, file, cb) => {
            crypto_1.default.randomBytes(20, (err, hash) => {
                if (err)
                    cb(err);
                file.key = `${hash.toString("hex")}.${path_1.default.extname(file.originalname)}`;
                cb(null, file.key);
            });
        }
    });
    return multer({ storage: storage }).single("file");
}
module.exports = uploadFile;
//# sourceMappingURL=config.js.map