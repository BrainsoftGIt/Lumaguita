import { storage, app, storageAccess } from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";

declare module 'express-session' {
    export interface SessionData {
        auth_data: any;
        auth_space: any;
        post_key: any;
        posto: any;
        user_pos: any;
        dark_mode: any;
        default_space:any;
        space_configuration:any;
        posto_admin:any
        transference_data:any;
    }
}

//User files acceptor
storage.accept( {
    path: "user/attaches",
    method: [ "POST", "GET" ],
    check: (request) => true
});



app.post("/api/change/pwd", async (req, res) =>{
    const {callFunctionChangePassword} = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    const response = await callFunctionChangePassword(req.body);
    res.json({result: response.row.result, message: response.row.message.text});
});

app.post("/api/exit", async (req, res) =>{
    req.session.auth_data = undefined;
    res.json({result: true});
});

app.post("/api/login/menu", async (req, res)=>{
    const {callFunctionLoadMenu} = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    req.body.arg_menu_super = req.session.auth_data.collaborator_group === 1 ? "ccias.admin" : "ccias.association";
    req.body.arg_allmenu = true;
    const response = await callFunctionLoadMenu(req.body);
    res.json({menus: response.rows});
});

app.post("/api/user/menus", async (req,res) =>{
    const {callFunctionLoadUserMenus} = require("../database/ts.call-user-functions");
    const response = await callFunctionLoadUserMenus(req.body);
    res.json({menus: response.rows});
});
app.get("/api/all/menu", async (req, res) =>{
    const {callFunctionLoadMenu} = require("../database/ts.call-user-functions");
    req.body.arg_menu_super = req.session.auth_data.collaborator_group === 1 ? "ccias.admin" : "ccias.association";
    req.body.arg_allmenu = true;
    const response = await callFunctionLoadMenu(req.body);
    res.json({menus: response.rows});
});
app.post("/api/user", async (req, res) =>{
    const {callFunctionRegUser} = require("../database/ts.call-user-functions");

    let user_data = JSON.parse(req.body.user);
    user_data.arg_colaborador_foto = null;
    user_data.arg_colaborador_id = req.session.auth_data.colaborador_id;
    if(parseInt(req.body.has_photo) == 1){
        const saveFilesResponse = await storage.saveRequest( req, "user/attaches",  { storageRoute: "storage" } );
        if(saveFilesResponse.status) user_data.arg_colaborador_foto = saveFilesResponse.files[0].resolve.reference;
        else res.json({result: false, message: "Houve algum problema a carregar foto. Por favor, tente novamente"});
    }
    const response = await callFunctionRegUser(user_data);
   res.json({result: response.row.result, message: (response.row.result ? "success" : response.row.message.text)});
});
app.get("/api/user", async (req, res) =>{
    const {callFunctionLoadUser} = require("../database/ts.call-user-functions");
    const response = await callFunctionLoadUser({arg_colaborador_email: null, arg_colaborador_nif: null});
    res.json({users: response.rows});
});
app.post("/api/user/access", async (req, res) =>{
    const {callFunctionRegAccess} = require("../database/ts.call-user-functions");
    req.body.arg_colaborador_id = req.session.auth_data.colaborador_id;
    const response = await callFunctionRegAccess(req.body);
    res.json({result: response.row.result, message: (response.row.result ? "success" : "Houve algum erro a atualizar privilégios!")});
});
app.post("/api/login", async (req, res) =>{
    const {callFunctionAuthenticate} = require("../database/ts.call-user-functions");
    const response = await callFunctionAuthenticate(req.body);
    req.session.auth_data = [];
    if(response.rows.length > 0){
        if(response.rows[0].colaborador_accesso === 2)
            res.json({result: true, data: response.rows[0]});
        else{
            req.session.auth_data = response.rows[0];
            req.session.save(() =>{
                res.json({result: true, data: req.session.auth_data});
            });
        }
    }
    else res.json({result: false});
});
app.post("/api/user/activate/account", async (req, res) =>{
    const {callFunctionActivateAccount} = require("../database/ts.call-user-functions");
    const response = await callFunctionActivateAccount(req.body);
    res.json({result: response.row.result, message: (response.row.result ? "success" : response.row.message.text)});
});
app.post("/api/user/reset", async (req, res) =>{
    const {callFunctionResetPassword} = require("../database/ts.call-user-functions");
    const response = await callFunctionResetPassword(req.body);
    res.json({result: response.row.result, message: (response.row.result ? "success" : "Houve algum erro a redefinir palavra-passe!")});
});
app.get("/test/session", async (req, res) =>{
    res.json({result: (req.session.auth_data !== undefined)});
});

