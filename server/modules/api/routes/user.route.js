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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = require("../../../service/storage.service");
//User files acceptor
storage_service_1.storage.accept({
    path: "user/attaches",
    method: ["POST", "GET"],
    check: (request) => true
});
storage_service_1.app.post("/api/change/pwd", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionChangePassword } = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    const response = yield callFunctionChangePassword(req.body);
    res.json({ result: response.row.result, message: response.row.message.text });
}));
storage_service_1.app.post("/api/exit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.auth_data = undefined;
    res.json({ result: true });
}));
storage_service_1.app.post("/api/login/menu", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionLoadMenu } = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    req.body.arg_menu_super = req.session.auth_data.collaborator_group === 1 ? "ccias.admin" : "ccias.association";
    req.body.arg_allmenu = true;
    const response = yield callFunctionLoadMenu(req.body);
    res.json({ menus: response.rows });
}));
storage_service_1.app.post("/api/user/menus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionLoadUserMenus } = require("../database/ts.call-user-functions");
    const response = yield callFunctionLoadUserMenus(req.body);
    res.json({ menus: response.rows });
}));
storage_service_1.app.get("/api/all/menu", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionLoadMenu } = require("../database/ts.call-user-functions");
    req.body.arg_menu_super = req.session.auth_data.collaborator_group === 1 ? "ccias.admin" : "ccias.association";
    req.body.arg_allmenu = true;
    const response = yield callFunctionLoadMenu(req.body);
    res.json({ menus: response.rows });
}));
storage_service_1.app.post("/api/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionRegUser } = require("../database/ts.call-user-functions");
    let user_data = JSON.parse(req.body.user);
    user_data.arg_colaborador_foto = null;
    user_data.arg_colaborador_id = req.session.auth_data.colaborador_id;
    if (parseInt(req.body.has_photo) == 1) {
        const saveFilesResponse = yield storage_service_1.storage.saveRequest(req, "user/attaches", { storageRoute: "storage" });
        if (saveFilesResponse.status)
            user_data.arg_colaborador_foto = saveFilesResponse.files[0].resolve.reference;
        else
            res.json({ result: false, message: "Houve algum problema a carregar foto. Por favor, tente novamente" });
    }
    const response = yield callFunctionRegUser(user_data);
    res.json({ result: response.row.result, message: (response.row.result ? "success" : response.row.message.text) });
}));
storage_service_1.app.get("/api/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionLoadUser } = require("../database/ts.call-user-functions");
    const response = yield callFunctionLoadUser({ arg_colaborador_email: null, arg_colaborador_nif: null });
    res.json({ users: response.rows });
}));
storage_service_1.app.post("/api/user/access", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionRegAccess } = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    const response = yield callFunctionRegAccess(req.body);
    res.json({ result: response.row.result, message: (response.row.result ? "success" : "Houve algum erro a atualizar privilégios!") });
}));
storage_service_1.app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionAuthenticate } = require("../database/ts.call-user-functions");
    const response = yield callFunctionAuthenticate(req.body);
    req.session.auth_data = [];
    if (response.rows.length > 0) {
        if (response.rows[0].colaborador_accesso === 2)
            res.json({ result: true, data: response.rows[0] });
        else {
            req.session.auth_data = response.rows[0];
            req.session.save(() => {
                res.json({ result: true, data: req.session.auth_data });
            });
        }
    }
    else
        res.json({ result: false });
}));
storage_service_1.app.post("/api/user/activate/account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionActivateAccount } = require("../database/ts.call-user-functions");
    const response = yield callFunctionActivateAccount(req.body);
    res.json({ result: response.row.result, message: (response.row.result ? "success" : response.row.message.text) });
}));
storage_service_1.app.post("/api/user/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callFunctionResetPassword } = require("../database/ts.call-user-functions");
    const response = yield callFunctionResetPassword(req.body);
    res.json({ result: response.row.result, message: (response.row.result ? "success" : "Houve algum erro a redefinir palavra-passe!") });
}));
storage_service_1.app.get("/test/session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ result: (req.session.auth_data !== undefined) });
}));
//# sourceMappingURL=user.route.js.map