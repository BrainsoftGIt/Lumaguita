import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import {functLoadSeriesAvailable} from "../db/call-function-efatura";
import excel from "exceljs";
import fs from "fs";
import path from "path";
import {folders} from "../../../global/project";
import moment from "moment/moment";

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
    req.body.arg_colaborador_id = req.body.place === "admin" ? req.session.auth_data.auth.colaborador_id : req.session.user_pos.auth.colaborador_id;

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
    let response = await functRegEfacturaAuthorization(req.body);
    console.log( response.row );
    const { row : { main : { result, message } } } = response;
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


app.post("/api/efatura/report/excel/data", async (req, res) =>{
    let random = (Math.random() + 1).toString(36).substring(7);
    let data = new Date();
    let file = `${random}-${data.getSeconds()}.json`
    fs.writeFile(path.join(folders.temp, file), JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        res.json(file)
    });
});

app.get("/api/efatura/report/excel/:data", async (req, res) => {

    let data = JSON.parse(req.params.data);
    let fileData = fs.readFileSync(path.join(folders.temp, data.file));
    let args = JSON.parse(fileData.toString());
    fs.unlinkSync(path.join(folders.temp, data.file))

    const {functReportFinanca} = require("../db/call-function-report");
    args.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    let { rows : list } = await functReportFinanca(args);

    let {year, month} = args;
    const excel = require("exceljs");
    const filename = `${month} ${year} IVA.xlsx`;
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet("emitted_document");
    workSheet.columns = [
        {header: "tax_aplicavel_itens", width: 30},
        {header: "codigo_isento", width: 30},
        {header: "quant_itens", width: 30},
        {header: "desc_itens", width: 30},
        {header: "numero_documento_origem", width: 30},
        {header: "data_documento_origem", width: 30},
        {header: "tipo_documento", width: 30}
    ];

    list.forEach(({vreport_imposto_financas: {...artigo}}) => {
        let { tipo_documento_origem, data_documento_origem, codigo_isento, desc_itens, total_valor_itens, taxa_aplicavel_itens, quant_itens, numero_documento_origem } = artigo;
        workSheet.addRow([taxa_aplicavel_itens, codigo_isento, quant_itens, desc_itens, numero_documento_origem, data_documento_origem, tipo_documento_origem]);
    });

    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    await workBook.xlsx.writeFile(path.join(folders.temp, 'multer/' + filename)).then(() => {
        res.download(path.join(folders.temp, 'multer') + "/" + filename, filename, function () {
            fs.unlinkSync(path.join(folders.temp, 'multer') + "/" + filename);
        });
    });
});
