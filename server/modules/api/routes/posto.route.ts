import {app, storage} from '../../../service/storage.service';
import {debugResponse, factory} from "../../../service/database.service";
import {Templates} from "zoo.pg";
import {clusterServer} from "../../../service/cluster.service";
import {functloadKey} from "../db/call-function-posto";

app.post("/api/post/key", async (req, res) =>{
    const {functGenerateKey} = require("../db/call-function-posto");
    const {  factory }  = require( "../../../service/database.service");
    const {Templates } = require("zoo.pg");
    let _data = [];
    let response = null;
    let before =  await clusterServer.service.loadLocalCluster();
     const cluster_status = await clusterServer.status();


    if(req.session.post_key === undefined){
         response = await functGenerateKey();
        let after = await clusterServer.service.loadLocalCluster();
        if(before.cluster_version < after.cluster_version){
            clusterServer.notifyLocalChange({event: "kEY:POST", extras: null, message: "Chave de posto gerada."});
        }
        req.session.post_key = response.rows[0].funct_generate_chave.chave_temporarai;
        req.session.save(() =>{
            res.json({key: response.rows[0].funct_generate_chave.chave_temporarai,
                statusCluster: clusterServer.online,
                cluster_status:  cluster_status});
        });
    }
    else{
        req.body.arg_chave_temporaria = req.session.post_key;
        const { sql } = factory.create( Templates.PARAMETERIZED );
        sql`
        select * from tweeks.funct_load_chave(${req.body}) as row
       `.stream((data) => {
            _data.push(data);
        }).catch(err => {
        }).finally(async function () {
            let after = await clusterServer.service.loadLocalCluster();
            if(before.cluster_version < after.cluster_version){
                clusterServer.notifyLocalChange({event: "kEY:POST", extras: null, message: "Chave de posto gerada."});
            }
            if(_data[0].row.chave_definitiva !== null)
                res.json({key: _data[0].row.posto_designacao, statusCluster: clusterServer.online, cluster_status:  cluster_status});
            else
                res.json({key: _data[0].row.chave_temporarai, statusCluster: clusterServer.online, cluster_status:  cluster_status});
        });
    }
});
app.post("/api/remove/post/session", async (req, res) =>{
    req.session.user_pos = undefined;
    res.json({result: true});
});
app.post("/api/chave/load", async (req, res) =>{
    const {functloadKey} = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functloadKey(req.body);
    res.json({keys: response.rows});
});
app.post("/api/posto/data", async (req, res) =>{
    if(req.session.post_key !== undefined){
        const {functLoadPostoEspaco} = require("../db/call-function-posto");
        const response = await functLoadPostoEspaco({arg_chave_temporaria: req.session.post_key});
        req.session.posto = undefined;
        if(response.rows[0].data.chave_definitiva){
            req.session.posto = response.rows[0].data;
            req.session.posto.spaces = response.rows.filter(value => value?.data?.espaco_id);
        }
        setTimeout(()=>{
            req.session.save(()=>{
                res.json({post: response.rows[0].data, modeView: (req.session.dark_mode === undefined ? false : req.session.dark_mode),
                    hasSession: ( req.session.user_pos !== undefined),
                    pos_user_session_uuid: ( req.session.user_pos !== undefined ? req.session.user_pos.auth.colaborador_id: ""),
                    pos_user_name: ( req.session.user_pos !== undefined ? req.session.user_pos.auth.colaborador_nome: "")});
            });
        }, 1000);
   }
    else{
        res.json({not_registrated: true});
    }
});

app.post("/api/verify/user/space", async (req, res) =>{
    const {validate_user_space, getDefaultSpace} = require("./functions/userDefaultSpace");
    if(req.session.user_pos !== undefined){
        let response = await validate_user_space(req.session.user_pos.espaco_trabalha, req.session.posto.spaces);
        if(response.result){
            const userSpaces = response.spaces;
            response = await getDefaultSpace(req, req.session.user_pos.auth.colaborador_id, userSpaces);
            res.json({result: true, space_id: response, user_spaces: userSpaces });
        }
        else res.json({result: false, message: response.message});
    }
    else res.json({result: false, message: "Sessão de colaborador não foi encontrada!"});
});
app.post("/api/posto/load", async (req, res) =>{
    const {functloadPosto} = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = await functloadPosto(req.body);
    req.body.arg_aloca_espaco = req.session.auth_data.auth.armazem_atual;
    const postosEspaco = await functloadPosto(req.body);
    res.json({postos: response.rows, postosEspaco: postosEspaco.rows});
});
app.post("/api/posto", async (req, res) =>{
    const {functRegPosto} = require("../db/call-function-posto");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functRegPosto(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "ADD:POST",
            extras: null,
            message: "Posto "+req.body.arg_posto_designacao+" foi registado."
        });
    }
});
app.post("/api/posto/status", async (req, res) =>{
    const {functChangeStatusPosto} = require("../db/call-function-posto");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = await functChangeStatusPosto(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "CHANGE_STATUS:POST", extras: null, message: "Estado de posto foi alterado."});
    }
});

app.post("/api/posto/associar", async (req, res) =>{
    const {functAssociarPosto} = require("../db/call-function-posto");
    let before =  await clusterServer.service.loadLocalCluster();
    const response = await functAssociarPosto(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "ASSOCIATE:POST",
            extras: null,
            message: "Posto foi associado."
        });
    }
});
app.post("/api/posto/caixa/load", async (req, res) =>{
    const {functLoadCaixa} = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = await functLoadCaixa(req.body);
    res.json({caixas: response.rows});
});
app.post("/api/post/box/open", async (req, res) =>{
    const {functAbrirCaixa} = require("../db/call-function-posto");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = await functAbrirCaixa(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "OPEN:BOX",
            extras: null,
            message: "Caixa foi aberta."
        });
    }
});
app.post("/api/post/box/close", async (req, res) =>{
    const {functFecharCaixa} = require("../db/call-function-posto");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = await functFecharCaixa(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "CLOSE:BOX",
            extras: null,
            message: "Caixa foi fechada."
        });
    }
});
app.post("/api/post/sales", async (req, res) =>{
    const {functLoadSales} = require("../db/call-function-posto");
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = await functLoadSales(req.body);
    res.json({vendas: response.rows});
});


