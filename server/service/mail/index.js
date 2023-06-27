"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const K_1 = require("./K");
exports.mailSender = nodemailer_1.default.createTransport({
    host: K_1.K.MAIL.host,
    port: K_1.K.MAIL.port,
    secure: K_1.K.MAIL.secure,
    auth: {
        user: K_1.K.MAIL.email,
        pass: K_1.K.MAIL.pwd, // generated ethereal password
    },
});
//# sourceMappingURL=index.js.map