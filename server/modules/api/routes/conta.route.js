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
storage_service_1.app.post("/api/users/post/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadUserPOS } = require("../db/call-function-conta");
    let usersNotShowed = ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002", "00000000-0000-0000-0000-000000000003",
        "00000000-0000-0000-0000-000000000004", "00000000-0000-0000-0000-000000000005", "00000000-0000-0000-0000-000000000006", "00000000-0000-0000-0000-000000000007",
        "00000000-0000-0000-0000-000000000008", "00000000-0000-0000-0000-000000000009", "00000000-0000-0000-0000-000000000010"];
    req.body.posto_id = req.session.posto.posto_id;
    const response = yield functLoadUserPOS(req.body);
    res.json({ usrs: response.rows.filter(value => !usersNotShowed.includes(value.data.colaborador_id)) });
}));
storage_service_1.app.post("/api/post/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLogin } = require("../db/call-function-colaborador");
    const { validate_user_space, getDefaultSpace } = require("./functions/userDefaultSpace");
    const response = yield functLogin({ arg_auth_name: "id", arg_auth_value: req.body.colaborador_id, arg_auth_method: "pin", arg_auth_key: req.body.pin });
    req.session.user_pos = undefined;
    if (response.rows.length === 0) {
        res.json({ result: false, message: "PIN incorreto." });
    }
    else {
        let acesso = response.rows[0].data.auth.colaborador_accesso;
        if (acesso === 2)
            res.json({ result: true, acesso: acesso });
        else {
            let userSpace = validate_user_space(response.rows[0].data.espaco_trabalha.filter(esp => esp.espaco_vender !== null), req.session.posto.spaces);
            if (!userSpace.result)
                res.json({ result: false, message: userSpace.message });
            else {
                req.session.user_pos = response.rows[0].data;
                if (userSpace.spaces.length === 1)
                    req.session.user_pos.auth.armazem_atual = userSpace.spaces[0].data.espaco_id;
                else
                    req.session.user_pos.auth.armazem_atual = getDefaultSpace(req, req.session.user_pos.auth.colaborador_id, userSpace.spaces);
                req.session.save(() => {
                    res.json({ result: true, acesso: acesso, armazens: userSpace.spaces,
                        defaultSpace: req.session.user_pos.auth.armazem_atual,
                        user_uuid: req.session.user_pos.auth.colaborador_id });
                });
            }
        }
    }
}));
storage_service_1.app.get("/api/session-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.session);
}));
storage_service_1.app.post("/api/user/post/armazem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.user_pos.auth.armazem_atual = req.body.space_id;
    if (req.session.default_space === undefined) {
        req.session.default_space = [{ colaborador_id: req.session.user_pos.auth.colaborador_id, space_id: req.body.space_id }];
    }
    else {
        let index = req.session.default_space.findIndex(sp => sp.colaborador_id === req.session.user_pos.auth.colaborador_id);
        if (index === -1)
            req.session.default_space.push({ colaborador_id: req.session.user_pos.auth.colaborador_id, space_id: req.body.space_id });
        else
            req.session.default_space[index].space_id = req.body.space_id;
    }
    req.session.save(() => {
        res.json({ result: true });
    });
}));
storage_service_1.app.post("/api/user/post/current/space", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ space_id: req.session.user_pos.auth.armazem_atual });
}));
storage_service_1.app.post("/api/post/view/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.dark_mode = req.body.dark;
    req.session.save(() => {
        res.json({ result: true });
    });
}));
storage_service_1.app.post("/api/open/accounts/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadContasAbertas } = require("../db/call-function-conta");
    req.body.arg_colaborador_id = null;
    req.body.arg_posto_id = req.session.posto.posto_id;
    req.body.arg_espaco_auth = null;
    const response = yield functLoadContasAbertas(req.body);
    res.json({ contas: response.rows });
}));
storage_service_1.app.post("/api/proformas/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadProformas } = require("../db/call-function-conta");
    req.body.arg_posto_id = req.session.posto_admin;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadProformas(req.body);
    res.json({ proformas: response.rows });
}));
storage_service_1.app.post("/api/account/key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadAccountkey } = require("../db/call-function-conta");
    const response = yield functLoadAccountkey({ arg_espaco_auth: (req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual
            : req.session.auth_data.auth.armazem_atual) });
    res.json({ accountKey: (response.rows.length === 1 ? response.rows[0].data : null) });
}));
//# sourceMappingURL=conta.route.js.map