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
const web_service_1 = require("../../../service/web.service");
const cluster_service_1 = require("../../../service/cluster.service");
const fs_1 = __importDefault(require("fs"));
web_service_1.app.post("/api/users/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadUsers } = require("../db/call-function-colaborador");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let usersNotShowed = ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002"];
    const response = yield functLoadUsers(req.body);
    res.json({ users: response.rows.filter(value => parseInt(value.data.colaborador_tipo) !== 0 && !usersNotShowed.includes(value.data.colaborador_id)) });
}));
web_service_1.app.post("/api/user/main/workspace/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ mainWorkspace: req.session.auth_data.auth.branch_main_workspace });
}));
web_service_1.app.post("/api/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegUser } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    7;
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    data.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.arg_colaborador_foto = value.resource_url + ";" + req.file.originalname;
            const response = yield functRegUser(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            res.json({ result: response.row.result, message: response.row.message.text });
            if (response.row.result) {
                if (before.cluster_version < after.cluster_version) {
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD:USER", extras: null, message: "Novo colaborador foi registado." });
                }
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.log(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
        }));
    }
    else {
        const response = yield functRegUser(data);
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        res.json({ result: response.row.result, message: response.row.message.text });
        if (response.row.result && before.cluster_version < after.cluster_version) {
            cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD:USER", extras: null, message: "Novo colaborador foi registado." });
        }
    }
}));
web_service_1.app.post("/api/user/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functUpdateUser, functRegAccess } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.arg_colaborador_foto = value.resource_url + ";" + req.file.originalname;
            let response = yield functUpdateUser(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            if (response.row.result) {
                response = yield functRegAccess({ arg_colaborador_id: data.arg_colaborador_id, arg_colaborador_propetario: data.arg_colaborador_editar, arg_menu_list: data.arg_menu_list });
                res.json({ result: response.row.result, message: response.row.message.text });
                if (before.cluster_version < after.cluster_version)
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "UPDATE:USER", extras: null, message: "Colaborador foi atualizado." });
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.log(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
            else
                res.json({ result: response.row.result, message: response.row.message.text });
        }));
    }
    else {
        let response = yield functUpdateUser(data);
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        res.json({ result: response.row.result, message: response.row.message.text });
        if (response.row.result) {
            yield functRegAccess({ arg_colaborador_id: data.arg_colaborador_id,
                arg_colaborador_propetario: data.arg_colaborador_editar,
                arg_menu_list: data.arg_menu_list,
                _branch_uid: req.session.auth_data.auth.branch_uuid });
            if (before.cluster_version < after.cluster_version)
                cluster_service_1.clusterServer.notifyLocalChange({ event: "UPDATE:USER", extras: null, message: "Colaborador foi atualizado." });
        }
        else
            res.json({ result: response.row.result, message: response.row.message.text });
    }
}));
web_service_1.app.post("/api/user/disable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functDisableUser } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functDisableUser(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "disable:USER",
            extras: null,
            message: "Colaborador foi desativado."
        });
    }
}));
web_service_1.app.post("/api/user/enable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functEnableUser } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functEnableUser(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "PRE_ACTIVATE:USER",
            extras: null,
            message: "Colaborador foi pré-ativado."
        });
    }
}));
web_service_1.app.post("/api/user/logged/menus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const espacoDefault = "00000000-0000-0000-0000-000000000001";
    const supportUser = "00000000-0000-0000-0000-000000000002";
    const { functLoadMenuGrants } = require("../db/call-function-colaborador");
    let response = null;
    let showConfigMenu = true;
    if ((_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.auth_data) === null || _b === void 0 ? void 0 : _b.auth) === null || _c === void 0 ? void 0 : _c.branch_uuid) {
        showConfigMenu = false;
    }
    if (((_f = (_e = (_d = req === null || req === void 0 ? void 0 : req.session) === null || _d === void 0 ? void 0 : _d.auth_data) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.armazem_atual) !== espacoDefault) {
        showConfigMenu = false;
    }
    if (((_j = (_h = (_g = req === null || req === void 0 ? void 0 : req.session) === null || _g === void 0 ? void 0 : _g.auth_data) === null || _h === void 0 ? void 0 : _h.auth) === null || _j === void 0 ? void 0 : _j.colaborador_id) !== supportUser) {
        showConfigMenu = false;
    }
    if (!showConfigMenu) {
        req.body.arg_colaborador_id = (_m = (_l = (_k = req === null || req === void 0 ? void 0 : req.session) === null || _k === void 0 ? void 0 : _k.auth_data) === null || _l === void 0 ? void 0 : _l.auth) === null || _m === void 0 ? void 0 : _m.colaborador_id;
        req.body.arg_espaco_auth = (_q = (_p = (_o = req.session) === null || _o === void 0 ? void 0 : _o.auth_data) === null || _p === void 0 ? void 0 : _p.auth) === null || _q === void 0 ? void 0 : _q.armazem_atual;
        response = yield functLoadMenuGrants(req.body);
        response = response.rows;
    }
    res.json({ dados: (_r = req.session) === null || _r === void 0 ? void 0 : _r.auth_data, showConfigMenu: showConfigMenu, grants: response });
}));
web_service_1.app.post("/api/menus/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadMenusBranch } = require("../db/call-function-colaborador");
    let response;
    let menus;
    if (req.body.arg_colaborador_id !== undefined) {
        response = yield functLoadMenusBranch({ arg_branch_uid: req.session.auth_data.auth.branch_uuid,
            arg_espaco_id: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.body.arg_colaborador_id });
        menus = response.rows.filter(value => value.data.acesso_id !== null);
    }
    else {
        response = yield functLoadMenusBranch({ arg_branch_uid: req.session.auth_data.auth.branch_uuid, arg_espaco_id: req.session.auth_data.auth.armazem_atual });
        menus = response.rows;
    }
    res.json({ menus: menus });
}));
web_service_1.app.post("/api/armazens/colaborador/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArmazensColaboradorAlocar } = require("../db/call-function-colaborador");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadArmazensColaboradorAlocar(req.body);
    res.json({ armazens: response.rows });
}));
web_service_1.app.post("/api/login/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s, _t, _u, _v;
    const { functLogin } = require("../db/call-function-colaborador");
    const response = yield functLogin(req.body);
    req.session.auth_data = undefined;
    if (response.rows.length === 0)
        res.json({ result: false, message: "Email e/ou palavra-passe inválida!" });
    else {
        if (response.rows[0].data.auth.colaborador_accesso === 2) {
            if (response.rows[0].data.auth.acesso.filter((ac => ac.menu_link !== null)).length > 0) {
                res.json({ result: true, colaborador_id: response.rows[0].data.auth.colaborador_id,
                    colaborador_nome: response.rows[0].data.auth.colaborador_nome });
            }
            else
                res.json({ result: false, message: "Acesso negado à administração!" });
        }
        else {
            if (response.rows[0].data.auth.acesso.filter((ac => ac.menu_link !== null)).length > 0) {
                req.session.auth_data = response.rows[0].data;
                req.session.auth_data.auth.armazem_atual = response.rows[0].data.espaco_trabalha[0].espaco_id;
                req.session.auth_data.auth.branch_uuid = ((_t = (_s = response === null || response === void 0 ? void 0 : response.rows[1]) === null || _s === void 0 ? void 0 : _s.data) === null || _t === void 0 ? void 0 : _t.branch_uid) || null;
                req.session.posto_admin = response.rows[0].data.espaco_trabalha[0].espaco_posto_admin;
                req.session.auth_data.auth.branch_main_workspace = ((_v = (_u = response.rows[1]) === null || _u === void 0 ? void 0 : _u.data) === null || _v === void 0 ? void 0 : _v.branch_main_workspace) || null;
                cluster_service_1.clusterServer.notifyLocalChange({ event: "LOGIN:ADMIN", extras: null, message: "Login admin" });
                req.session.save(() => {
                    res.json(Object.assign({ result: true }, (req.body.remote) ? response.rows[0].data : {}));
                });
            }
            else
                res.json({ result: false, message: "Acesso negado à administração!" });
        }
    }
}));
web_service_1.app.post("/api/account/activate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functEnableUser } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functEnableUser(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ACTIVATE:USER",
            extras: null,
            message: "Colaborador foi ativado."
        });
    }
}));
web_service_1.app.post("/api/current/space/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.auth_data.auth.armazem_atual = req.body.space_id;
    req.session.posto_admin = req.body.posto_admin;
    res.json({ result: true });
}));
web_service_1.app.post("/api/exit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.auth_data = undefined;
    res.json({ result: true });
}));
web_service_1.app.get("/api/session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ result: (req.session.auth_data !== undefined) });
}));
web_service_1.app.post("/api/colaborador/senha", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangePassword } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functChangePassword(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "CHANGE_USER:PASSWORD",
            extras: null,
            message: "Palavra-paase de colaborador foi alterada."
        });
    }
}));
web_service_1.app.post("/api/colaborador/pin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangePIN } = require("../db/call-function-colaborador");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.colaborador_id;
    const response = yield functChangePIN(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "CHANGE_USER:PIN",
            extras: null,
            message: "PIN de colaborador foi alterado."
        });
    }
    res.json({ result: response.row.result, message: response.row.message.text });
}));
web_service_1.app.post("/api/colaborador/menus/grants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadMenuGrants } = require("../db/call-function-colaborador");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadMenuGrants(req.body);
    res.json({ grants: response.rows });
}));
//# sourceMappingURL=colaborador.route.js.map