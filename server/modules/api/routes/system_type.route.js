"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = require("../../../service/storage.service");
const path_1 = __importDefault(require("path"));
storage_service_1.app.get("/api/system/type", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fs = require("fs");
    //language=file-reference
    let system = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, "../../../lib/json/typeSystem.json")));
    res.json({ system: system });
}));
storage_service_1.app.post("/api/array/set", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fs = require("fs");
    //language=file-reference
    let listData = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, "../../../lib/json/_db.json")));
    let listResult = { map: [], rows: [] };
    listData.forEach((object, index) => {
        let keyValue = Object.keys(object);
        if (index === 0) {
            listResult.map = keyValue;
        }
    });
}));
//# sourceMappingURL=system_type.route.js.map