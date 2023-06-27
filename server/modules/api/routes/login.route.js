"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
web_service_1.app.get("/backup.sql", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //language=file-reference
    let min = 1000000;
    let max = 9999999;
    let code = Math.trunc((Math.random() * (max - min)) + min);
    let local = path.join(__dirname, `../../../../build/database/compile/prepare/dump-${code}-downloads.sql`);
    child_process.exec(`pg_dump -U maguita -d maguita_uuid -cOv --if-exists -f ${local} -h localhost`, {
        env: { PGPASSWORD: "1234" }
    }).on("exit", code => {
        res.sendFile(local);
        setTimeout(() => {
            fs.unlinkSync(local);
        }, 1000 * 60 * 2);
    }).on("error", err => console.error(err));
}));
web_service_1.app.post("/api/login/pin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAuthenticate } = require("../db/call-function-login");
    const response = yield functAuthenticate({ arg_auth_name: "id", arg_auth_value: req.body.colaborador_id,
        arg_auth_method: "pin", arg_auth_key: req.body.pin });
}));
web_service_1.app.post("/api/login/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAuthenticate } = require("../db/call-function-login");
    const response = yield functAuthenticate({ arg_auth_name: "email", arg_auth_value: req.body.email,
        arg_auth_method: "senha", arg_auth_key: req.body.pwd });
    if (response.rows.length > 0) {
        let acessos = response.rows[0].acesso.filter(function (menu) {
            return menu.menu_codigo.includes("maguita.pos");
        });
        if (acessos.length > 0) {
            req.session.auth_data = response.rows[0];
            req.session.save(() => {
                res.json({ result: true, user_name: response.rows[0].colaborador_nome, adminAccess: true, acessos: response.rows[0].acesso });
            });
        }
        else
            res.json({ result: true, adminAccess: false });
    }
    else
        res.json({ result: false });
}));
web_service_1.app.get("/api/workspace", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadWorkSpaces } = require("../db/call-function-login");
    console.log(req.session.auth_data.colaborador_id);
    const response = yield functLoadWorkSpaces({ arg_colaborador_id: req.session.auth_data.colaborador_id });
    if (response.rows.length > 0) {
        req.session.auth_space = response.rows[0].funct_load_trabalha;
        req.session.save(() => {
            res.json({ spaceWork: response.rows });
        });
    }
    else
        res.json({ spaceWork: response.rows });
}));
web_service_1.app.get("/api/simplespace", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadSimpleSpace } = require("../db/call-function-login");
    const response = yield functLoadSimpleSpace({ arg_espaco_auth: req.session.auth_space.espaco_id });
    res.json({ space: response.rows });
}));
web_service_1.app.post("/api/load/constants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadConstants } = require("../db/call-function-login");
    const response = yield functLoadConstants(req.body);
    res.json({ constants: response.rows });
}));
//# sourceMappingURL=login.route.js.map