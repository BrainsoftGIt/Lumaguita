"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
web_service_1.acceptors.push((args, req, res) => {
    return true;
});
web_service_1.resolvers.push((args, req, res) => {
    return false;
});
//# sourceMappingURL=static.route.js.map