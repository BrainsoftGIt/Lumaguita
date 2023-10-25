import {app, storage} from '../../../service/storage.service';
import path from "path";
import {clusterServer} from "../../../service/cluster.service";

app.post("/api/pos/categorias", async (req, res) =>{
    const {functLoadPosClasse} = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = await functLoadPosClasse(req.body);
    const sexo_colaborador = req.session.user_pos.auth.tsexo_id || 1;
    const user = (sexo_colaborador === 1 ? "Operador: " : "Operadora: ")+(req.session.user_pos.auth.colaborador_nome.split(" ").shift())+" "+
        (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    res.json({classes: response.rows, acessos: req.session.user_pos.auth.acesso, user: user});
});
app.post("/api/artigos/categoria", async (req, res) =>{
    const {functLoadArtigosCategoria} = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = await functLoadArtigosCategoria(req.body);
    res.json({artigos: response.rows});
});
app.post("/api/items/artigo", async (req, res) =>{
    const {functLoadItemsArtigo} = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = await functLoadItemsArtigo(req.body);
    res.json({items: response.rows});
});

app.post("/api/pos/conta", async (req, res) =>{
    const {functRegConta} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.conta_posto_id = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
    const response = await functRegConta(req.body );
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, data: response.row});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "CREATE/UPDATE:ACCOUNT", extras: null,
            message: (req.body.conta_id ? "Conta "+response.row.data.conta_numero+" foi atualizada."
                : "Conta "+response.row.data.conta_numero+" foi criada.")
        });
    }
});

app.post("/api/pos/account/data", async (req, res) =>{
    const {functLoadContaData} = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadContaData(req.body);
    res.json({accountData: response.rows});
});
app.post("/api/cliente", async (req, res) =>{
    const {functRegCliente} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = await functRegCliente(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "CREATE:CLIENT", extras: null, message: "Novo cliente registado."});
    }
});
app.post("/api/cliente/load", async (req, res) =>{
    const {functLoadClients} = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = await functLoadClients(req.body);
    res.json({clients: response.rows});
});

app.post("/api/pos/conta/anular", async (req, res) =>{
    const {functAnularConta} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.body.place === undefined ? req.session.user_pos.auth.armazem_atual : req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req.body.place === undefined ? req.session.user_pos.auth.colaborador_id : req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functAnularConta(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "CANCEL:ACCOUNT", extras: null, message: "Conta "+req.body.conta_numero+" foi anulada."});
    }
});
app.post("/api/pos/pay", async (req, res) =>{
    const {functRegistarPagamento} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    const fs = require("fs");
    //language=file-reference
    let currency = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../lib/json/currency.json")));
    if(req.body.coin !== null){
        currency = currency.find(cu => cu.currency_code === req.body.coin);
        req.body.deposito.deposito_currency_id = currency.currency_id;
        req.body.deposito.deposito_posto_id = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
        req.body.deposito.deposito_docref = req.body.documento_referencia;
        req.body.deposito.deposito_cliente_id = req.body.deposito.deposito_cliente_id === null ? "00000000-0000-0000-0000-000000000001" : req.body.deposito.deposito_cliente_id;
    }
    req.body.conta_cliente_id = req.body.conta_cliente_id === null ? "00000000-0000-0000-0000-000000000001" : req.body.conta_cliente_id;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.conta_posto_fecho = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
    const response = await functRegistarPagamento(req.body);
    if( !response.row?.main?.result ){
        console.log( response?.row?.main );
    }
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: (response.row.main.result ? response.row.main.data.guia.guia_uid : response.row.main.message)});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "PAYMENT:ACCOUNT", extras: null,
            message: (req.body.coin !== null ? "Payment done" : "Foi enviado para conta corrente")
        });
    }
});
app.post("/api/pos/artigo/composto/load", async (req, res) =>{
    const {functLoadArtigoComposto} = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const response = await functLoadArtigoComposto(req.body);
    res.json({artigos: response.rows});
});
app.post("/api/pos/artigo/retalho", async (req, res) =>{
    const {functRegRetalho} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const response = await functRegRetalho(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "ARTICLE:RETAIL", extras: null, message: "Foi efetuado o retalho de artigo."});
    }
});
app.post("/api/pos/conta/proforma", async (req, res) =>{
    const {functChangeContaProforma} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functChangeContaProforma(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "PROFORMA:ACCOUNT", extras: null, message: "Proforma criada."});
    }
});
app.post("/api/search/articles", async (req, res) =>{
    const {functSearchArtigoPOS} = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const response = await functSearchArtigoPOS(req.body);
    res.json({artigos: response.rows});
});
app.post("/api/change/sale/status", async (req, res) =>{
    const {functChangeVendaPreparado} = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    let before =  await clusterServer.service.loadLocalCluster();
    const response = await functChangeVendaPreparado(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "SALE:STATUS", extras: null, message: "Estado de preparação atualizado."});
    }
});






