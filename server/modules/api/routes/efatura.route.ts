import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import {
    functLoadEfacturaAuthorization,
    functLoadSeries,
    functLoadSeriesAvailable,
    functRegEfacturaAuthorization,
    functRegSerie
} from "../db/call-function-efatura";

app.post("/api/efatura", async (req, res) =>{
    const {functRegSerie} = require("../db/call-function-efatura");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functRegSerie(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});
app.post("/api/efatura/load", async (req, res) =>{
    req.body.arg_espaco_auth = req.body.place === "admin" ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;

    if(req.body.list_type_series === undefined) {
        const {functLoadSeries} = require("../db/call-function-efatura");
        let response = await functLoadSeries(req.body);
        res.json({series: response.rows});
    }
    else{
        let missing_serie = [];
        let response = await functLoadSeriesAvailable(req.body);
        req.body.list_type_series.forEach(tipo => {
            if(response.rows.find(value => parseInt(value.data.tserie_id) === tipo) === undefined){
                missing_serie.push(tipo);
            }
        });
        res.json({series: missing_serie});
    }
});

app.post("/api/efatura/authorization/reg", async (req, res) =>{
    const {functRegEfacturaAuthorization} = require("../db/call-function-efatura");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const { row : { main : { result, message } } } = await functRegEfacturaAuthorization(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if(result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});

app.post("/api/efatura/authorization/load", async (req, res) =>{
    const {functLoadEfacturaAuthorization} = require("../db/call-function-efatura");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const { rows } = await functLoadEfacturaAuthorization(req.body);
    res.json({datas: rows.map(({main}) => main)});
});


app.post("/api/efatura/authorization/closeyear", async (req, res) =>{
    const {functChangeAuthorizationCloseYear} = require("../db/call-function-efatura");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const { row : { main : { result, message } } } = await functChangeAuthorizationCloseYear(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if(result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});


app.post("/api/efatura/authorization/continue", async (req, res) =>{
    const {functSetsAuthorizatioContinue} = require("../db/call-function-efatura");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const { row : { main : { result, message } } } = await functSetsAuthorizatioContinue(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if(result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});