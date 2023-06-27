import crypto from "crypto";

let key = 'MyScretekey74326dsdsd23232';
const generateEncryptionKey = () => {
    key = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    // return key;
    return "884343466776644446666455445566asasasasw";
};


module.exports = {
    generateEncryptionKey
};
