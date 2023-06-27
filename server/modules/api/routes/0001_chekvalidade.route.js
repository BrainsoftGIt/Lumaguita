"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
const validator_1 = require("./validator");
web_service_1.app.use("/api", validator_1.checkLicenseValida);
//# sourceMappingURL=0001_chekvalidade.route.js.map