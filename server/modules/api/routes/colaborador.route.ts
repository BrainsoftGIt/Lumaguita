import {app} from '../../../service/web.service';
import {clusterServer} from "../../../service/cluster.service";
import fs from "fs";
import {functLoadMenuGrants} from "../db/call-function-colaborador";

app.post("/api/users/load", async (req, res) =>{
    const {functLoadUsers} = require("../db/call-function-colaborador");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let usersNotShowed = [ "00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002" ];
    const response = await functLoadUsers(req.body);
    res.json({users: response.rows.filter(value => parseInt(value.data.colaborador_tipo) !== 0 && !usersNotShowed.includes(value.data.colaborador_id))});
});
app.post("/api/user/main/workspace/load", async (req, res) =>{
    res.json({mainWorkspace: req.session.auth_data.auth.branch_main_workspace});
});
app.post("/api/user", async (req, res) =>{
    const {functRegUser} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);

    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    data.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    if(req.file){
        clusterServer.res.create({resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null }
        }).then(async value => {
            data.arg_colaborador_foto = value.resource_url+";"+req.file.originalname;
            const response = await functRegUser(data);
            let after = await clusterServer.service.loadLocalCluster();
            res.json({result: response.row.result, message: response.row.message.text});

            if(response.row.result){
                if(before.cluster_version < after.cluster_version){
                    clusterServer.notifyLocalChange({event: "ADD:USER", extras: null, message: "Novo colaborador foi registado."});
                }
                fs.rename(req.file.path, value.resolve, function (err) {
                        if (err) console.log(err);
                        else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                    });
            }
        });
    }
    else{
        const response = await functRegUser(data);
        let after = await clusterServer.service.loadLocalCluster();
        res.json({result: response.row.result, message: response.row.message.text});
        if(response.row.result && before.cluster_version < after.cluster_version){
            clusterServer.notifyLocalChange({event: "ADD:USER", extras: null, message: "Novo colaborador foi registado."});
        }
    }
});
app.post("/api/user/change", async (req, res) =>{
    const {functUpdateUser, functRegAccess} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);

    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    if(req.file){
        clusterServer.res.create({resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null }
        }).then(async value => {
            data.arg_colaborador_foto = value.resource_url+";"+req.file.originalname;
            let response = await functUpdateUser(data);
            let after = await clusterServer.service.loadLocalCluster();

            if(response.row.result){
                response = await functRegAccess({arg_colaborador_id: data.arg_colaborador_id, arg_colaborador_propetario: data.arg_colaborador_editar, arg_menu_list: data.arg_menu_list});
                res.json({result: response.row.result, message: response.row.message.text});
                if(before.cluster_version < after.cluster_version)
                    clusterServer.notifyLocalChange({event: "UPDATE:USER", extras: null, message: "Colaborador foi atualizado."});

                fs.rename(req.file.path, value.resolve, function (err) {
                        if (err) console.log(err);
                        else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                    });
            }
            else res.json({result: response.row.result, message: response.row.message.text});
        });
    }
    else{
        let response = await functUpdateUser(data);
        let after = await clusterServer.service.loadLocalCluster();
        res.json({result: response.row.result, message: response.row.message.text});
        if(response.row.result){
             await functRegAccess({arg_colaborador_id: data.arg_colaborador_id,
                 arg_colaborador_propetario: data.arg_colaborador_editar,
                 arg_menu_list: data.arg_menu_list,
                 _branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null});
            if(before.cluster_version < after.cluster_version)
                clusterServer.notifyLocalChange({event: "UPDATE:USER", extras: null, message: "Colaborador foi atualizado."});
        }
        else res.json({result: response.row.result, message: response.row.message.text});
    }
});
app.post("/api/user/disable", async (req, res) =>{
    const {functDisableUser} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id =  req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functDisableUser(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "disable:USER",
            extras: null,
            message: "Colaborador foi desativado."
        });
    }
});
app.post("/api/user/enable", async (req, res) =>{
    const {functEnableUser} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id =  req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functEnableUser(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "PRE_ACTIVATE:USER",
            extras: null,
            message: "Colaborador foi pré-ativado."
        });
    }
});
app.post("/api/user/logged/menus", async (req, res) =>{
    const espacoDefault = "00000000-0000-0000-0000-000000000001";
    const supportUser = "00000000-0000-0000-0000-000000000002";
    const {functLoadMenuGrants} = require("../db/call-function-colaborador");
    let response = null;
    let showConfigMenu = true;
    if(req?.session?.auth_data?.auth?.branch_uuid){
        showConfigMenu = false;
    }
    if(req?.session?.auth_data?.auth?.armazem_atual !== espacoDefault){
        showConfigMenu = false;
    }
    if(req?.session?.auth_data?.auth?.colaborador_id !== supportUser){
        showConfigMenu = false;
    }
    if(!showConfigMenu){
        req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id;
        req.body.arg_espaco_auth = req.session?.auth_data?.auth?.armazem_atual;
         response = await functLoadMenuGrants(req.body);
         response = response.rows;
    }
    res.json({dados: req.session?.auth_data, showConfigMenu: showConfigMenu, grants: response });
});
app.post("/api/menus/load", async (req, res) =>{
    const {functLoadMenusBranch} = require("../db/call-function-colaborador");
    let response;
    let menus;
    if(req.body.arg_colaborador_id !== undefined) {
        response = await functLoadMenusBranch({arg_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null,
            arg_espaco_id:  req?.session?.auth_data?.auth?.armazem_atual || null, arg_colaborador_id: req.body.arg_colaborador_id});
        menus = response.rows.filter(value => value.data.acesso_id !== null);
    }
    else{
        response = await functLoadMenusBranch({arg_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null, arg_espaco_id: req?.session?.auth_data?.auth?.armazem_atual || null});
        menus = response.rows;
    }
    res.json({menus: menus});
});
app.post("/api/armazens/colaborador/load", async (req, res) =>{
    const {functLoadArmazensColaboradorAlocar} = require("../db/call-function-colaborador");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadArmazensColaboradorAlocar(req.body);
    res.json({armazens: response.rows});
});

app.post("/api/login/admin", async (req, res) =>{
    const {functLogin} = require("../db/call-function-colaborador");
    const response = await functLogin(req.body);
    req.session.auth_data = undefined;
    if(response.rows.length === 0)
        res.json({result: false, message: "Email e/ou palavra-passe inválida!"});
    else{
        if(response.rows[0].data.auth.colaborador_accesso === 2){
            if(response.rows[0].data.auth.acesso.filter((ac => ac.menu_link !== null)).length > 0){
                res.json({result: true, colaborador_id: response.rows[0].data.auth.colaborador_id,
                    colaborador_nome: response.rows[0].data.auth.colaborador_nome});
            }
            else res.json({result: false, message: "Acesso negado à administração!"});
        }
        else{
            if(response.rows[0].data.auth.acesso.filter((ac => ac.menu_link !== null)).length > 0){
                req.session.auth_data = response.rows[0].data;
                req.session.auth_data.auth.armazem_atual = response.rows[0].data.espaco_trabalha[0].espaco_id;
                req.session.auth_data.auth.branch_uuid = response?.rows[1]?.data?.branch_uid || null;
                req.session.posto_admin = response.rows[0].data.espaco_trabalha[0].espaco_posto_admin;
                req.session.auth_data.auth.branch_main_workspace = response.rows[1]?.data?.branch_main_workspace || null;
                clusterServer.notifyLocalChange({event: "LOGIN:ADMIN", extras: null, message: "Login admin"});
                req.session.save(() =>{
                    res.json({
                        result: true,
                        ...(req.body.remote) ? response.rows[0].data : {}
                    });
                });
            }
            else res.json({result: false, message: "Acesso negado à administração!"});
        }
    }
});
app.post("/api/account/activate", async (req, res) =>{
    const {functEnableUser} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    const response = await functEnableUser(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "ACTIVATE:USER",
            extras: null,
            message: "Colaborador foi ativado."
        });
    }
});
app.post("/api/current/space/change", async (req, res) =>{
    req.session.auth_data.auth.armazem_atual = req.body.space_id;
    req.session.posto_admin = req.body.posto_admin;
    res.json({result: true});
});
app.post("/api/exit", async (req, res) =>{
    req.session.auth_data = undefined;
    res.json({result: true});
});
app.get("/api/session", async (req, res) =>{
    res.json({result: ( req.session.auth_data !== undefined)});
});
app.post("/api/colaborador/senha", async (req, res) =>{
    const {functChangePassword} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functChangePassword(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "CHANGE_USER:PASSWORD",
            extras: null,
            message: "Palavra-paase de colaborador foi alterada."
        });
    }
});
app.post("/api/colaborador/pin", async (req, res) =>{
    const {functChangePIN} = require("../db/call-function-colaborador");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.colaborador_id;
    const response = await functChangePIN(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "CHANGE_USER:PIN",
            extras: null,
            message: "PIN de colaborador foi alterado."
        });
    }
    res.json({result: response.row.result, message: response.row.message.text});
});
app.post("/api/colaborador/menus/grants", async (req, res) =>{
    const {functLoadMenuGrants} = require("../db/call-function-colaborador");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadMenuGrants(req.body);
    res.json({grants: response.rows});
});
