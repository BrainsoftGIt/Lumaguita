"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
const web_service_1 = require("../../../service/web.service");
web_service_1.app.get("/", validator_1.checkLicenseValida);
web_service_1.app.get("/admin", validator_1.checkLicenseValida);
web_service_1.app.get("/pos", validator_1.checkLicenseValida);
//# sourceMappingURL=check-static.js.map