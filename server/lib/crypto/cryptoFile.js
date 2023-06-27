"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
let key = 'MyScretekey74326dsdsd23232';
const generateEncryptionKey = () => {
    key = crypto_1.default.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    // return key;
    return "884343466776644446666455445566asasasasw";
};
module.exports = {
    generateEncryptionKey
};
//# sourceMappingURL=cryptoFile.js.map