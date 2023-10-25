import {app, storage} from '../../../service/storage.service';
import fs from "fs";
import path from "path";
import {clusterServer} from "../../../service/cluster.service";
import {getUserSession} from "./functions/get-session";
import {functLoadDataCluster} from "../db/call-function-settings";
app.post("/api/armazem", async (req, res) => {
    const {functRegArmazem} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;
    const response = await functRegArmazem(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        if(req.body.arg_espaco_posto_admin !== null)
            req.session.posto_admin = req.body.arg_espaco_posto_admin;

        clusterServer.notifyLocalChange({
            event: "ADD:SPACE",
            extras: null,
            message: "Armazém "+req.body.arg_espaco_nome+" foi registado."
        });
    }
});
app.post("/api/armazem/edit", async (req, res) => {
    const {functUpdateArmazem} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functUpdateArmazem(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        if(req.body.arg_espaco_posto_admin !== null)
            req.session.posto_admin = req.body.arg_espaco_posto_admin;

        clusterServer.notifyLocalChange({
            event: "UPDATE:SPACE",
            extras: null,
            message: "Armazém "+req.body.arg_espaco_nome+" foi editado."
        });
    }
});
app.post("/api/cambio", async (req, res) => {
    const {functRegCambio} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    let cambios = [];
    cambios.push({
        arg_colaborador_id: req?.session?.auth_data?.auth?.colaborador_id || null,
        arg_currency_id: req.body.euro_currency,
        arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null,
        arg_cambio_taxa: req.body.euro,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null
    });
    cambios.push({
        arg_colaborador_id: req?.session?.auth_data?.auth?.colaborador_id || null,
        arg_currency_id: req.body.usd_currency,
        arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null,
        arg_cambio_taxa: req.body.usd,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null
    });
    cambios.push({
        arg_colaborador_id: req?.session?.auth_data?.auth?.colaborador_id || null,
        arg_currency_id: req.body.xaf_currency,
        arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null,
        arg_cambio_taxa: req.body.xaf,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null
    });
    let response = null;
     for (const cam of cambios) {
        response = await functRegCambio(cam);
    }
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "COIN",
            extras: null,
            message: "Taxa de câmbio de moedas definido."
        });
    }
});

app.post("/api/cambio/load", async (req, res) => {
    const {functLoadCambio} = require("../db/call-function-settings");
    const fs = require("fs");
    //language=file-reference
    const currency = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../lib/json/currency.json")));
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadCambio(req.body);
    res.json({cab: response.rows, currency: currency});
});
app.post("/api/armazem/load", async (req, res) => {
    const {functLoadArmazens} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadArmazens(req.body);
    res.json({armazens: response.rows});
});

app.post("/api/space/migrate", async (req, res) => {
    const {functMigrarEspaco} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;

    let before =  await clusterServer.service.loadLocalCluster();
    const response = await functMigrarEspaco(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({event: "SPACE:MIGRATE", extras: null, message: "Espaço migrado"});
    }
});
app.post("/api/empresa/load/data", async (req, res) => {
    const {functLoadDadosEmpresa} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadDadosEmpresa(req.body);
    res.json({empresa: response.rows});
});
app.post("/api/empresa/change", async (req, res) =>{
    const {functAtualizarDadosEmpresa} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data)
    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    data.arg_espaco_configuracao = null;

    if(req.file){
        clusterServer.res.create({resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null }
        }).then(async value => {
            data.dados_empresa.logo_nome = req.file.originalname;
            data.dados_empresa.logo_referencia = value.resource_url;
            data.arg_espaco_configuracao = data.dados_empresa;

            const response = await functAtualizarDadosEmpresa(data);
            let after = await clusterServer.service.loadLocalCluster();
            res.json({result: response.row.result, message: response.row.message.text});
            if(response.row.result && before.cluster_version < after.cluster_version){
                clusterServer.notifyLocalChange({
                    event: "UDPATE_COMPANY",
                    extras: null,
                    message: "Dados da instituição atualizados."
                });
                fs.rename(req.file.path, value.resolve, function (err) {
                    if (err) console.error(err);
                    else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                });
            }
        });
    }
    else{
        data.arg_espaco_configuracao = data.dados_empresa;
        const response = await functAtualizarDadosEmpresa(data);
        let after = await clusterServer.service.loadLocalCluster();
        res.json({result: response.row.result, message: response.row.message.text});
        if(response.row.result && before.cluster_version < after.cluster_version){
            clusterServer.notifyLocalChange({
                event: "UDPATE_COMPANY",
                extras: null,
                message: "Dados da instituição atualizados."
            });
        }
    }
});

app.post("/api/empresa/impressora", async (req, res) =>{
    const {functAtualizarDadosEmpresa} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_configuracao = req.body.configPrinter;
    const response = await functAtualizarDadosEmpresa(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if(response.row.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "UDPATE_COMPANY:PRINTERS",
            extras: null,
            message: "Impressoras definidas."
        });
    }
});

app.post("/api/empresa/cabecalho", async (req, res) =>{
    const {functAtualizarDadosEmpresa} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data)
    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    data.arg_espaco_configuracao = null;

    if(req.file){
        clusterServer.res.create({resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null }
        }).then(async value => {
            data.dados_empresa.cabecalho_nome = req.file.originalname;
            data.dados_empresa.cabecalho_referencia = value.resource_url;
            data.arg_espaco_configuracao = data.dados_empresa;

            const response = await functAtualizarDadosEmpresa(data);
            let after = await clusterServer.service.loadLocalCluster();
            res.json({result: response.row.result, message: response.row.message.text});
            if(response.row.result && before.cluster_version < after.cluster_version){
                clusterServer.notifyLocalChange({
                    event: "UDPATE_COMPANY",
                    extras: null,
                    message: "Cabeçalho da instituição atualizado."
                });
                fs.rename(req.file.path, value.resolve, function (err) {
                    if (err) console.error(err);
                    else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                });
            }
        });
    }
    else res.json({result: false});
});
app.get("/api/clusters/branch", async (req, res) => {
    const {functLoadClustersBranch} = require("../db/call-function-settings");
    const response = await functLoadClustersBranch({arg_branch_uid:  req?.session?.auth_data?.auth?.branch_uuid || null});
    res.json({clusters: response.rows});
});
app.post("/api/spaces/migrate/load", async (req, res) => {
    const {functLoadSpaceMigrate} = require("../db/call-function-settings");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_id = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadSpaceMigrate(req.body);
    res.json({spaces: response.rows});
});


app.post("/api/empresa/load/parametizacao", async (req, res) => {
    let _session = getUserSession( req );
    const {functLoadSetting} = require("../db/call-function-settings");

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;
    // args.parametrizacao_tags = [ args.arg_espaco_auth ];

    res.json(await functLoadSetting(args))
});


app.post("/api/empresa/reg/parametizacao", async (req, res) => {
    let _session = getUserSession( req );
    const {functRegSetting} = require("../db/call-function-settings");

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;

    res.json(await functRegSetting(args))
});

app.get("/api/cluster/STATUS", async (req, res) => {
    const {functLoadDataCluster} = require("../db/call-function-settings");
    res.json(await functLoadDataCluster())
});



