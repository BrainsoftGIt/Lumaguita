import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import {functLoadSeriesAvailable} from "../db/call-function-efatura";
import fs from "fs";
import path from "path";
import {folders} from "../../../global/project";


app.post("/api/efatura", async (req, res) => {
    const {functRegSerie} = require("../db/call-function-efatura");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functRegSerie(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});
app.post("/api/efatura/load", async (req, res) => {
    req.body.arg_espaco_auth = req.body.place === "admin" ? req?.session?.auth_data?.auth?.armazem_atual || null : req?.session?.user_pos?.auth?.armazem_atual;
    req.body.arg_colaborador_id = req.body.place === "admin" ? req?.session?.auth_data?.auth?.colaborador_id || null : req?.session?.user_pos?.auth?.colaborador_id;

    if (req.body.list_type_series === undefined) {
        const {functLoadSeries} = require("../db/call-function-efatura");
        let response = await functLoadSeries(req.body);
        res.json({series: response.rows});
    } else {
        let missing_serie = [];
        let response = await functLoadSeriesAvailable(req.body);
        req.body.list_type_series.forEach(tipo => {
            if (response.rows.find(value => parseInt(value.data.tserie_id) === tipo) === undefined) {
                missing_serie.push(tipo);
            }
        });
        res.json({series: missing_serie});
    }
});

app.post("/api/efatura/authorization/reg", async (req, res) => {
    const {functRegEfacturaAuthorization} = require("../db/call-function-efatura");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let response = await functRegEfacturaAuthorization(req.body);
    console.log(response.row);
    const {row: {main: {result, message}}} = response;
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if (result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});

app.post("/api/efatura/authorization/load", async (req, res) => {
    const {functLoadEfacturaAuthorization} = require("../db/call-function-efatura");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const {rows} = await functLoadEfacturaAuthorization(req.body);
    res.json({datas: rows.map(({main}) => main)});
});


app.post("/api/efatura/authorization/closeyear", async (req, res) => {
    const {functChangeAuthorizationCloseYear} = require("../db/call-function-efatura");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const {row: {main: {result, message}}} = await functChangeAuthorizationCloseYear(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if (result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});

app.post("/api/efatura/authorization/continue", async (req, res) => {
    const {functSetsAuthorizatioContinue} = require("../db/call-function-efatura");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const {row: {main: {result, message}}} = await functSetsAuthorizatioContinue(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: result, data: message});
    if (result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
});


app.post("/api/efatura/report/excel/data", async (req, res) => {
    let random = (Math.random() + 1).toString(36).substring(7);
    let data = new Date();
    let file = `${random}-${data.getSeconds()}.json`
    fs.writeFile(path.join(folders.temp, file), JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        res.json(file)
    });
});

app.get("/api/efatura/report/excel/:data", async (req, res) => {

    const moment = require('moment');
    let data = JSON.parse(req.params.data);
    let fileData = fs.readFileSync(path.join(folders.temp, data.file));
    let args = JSON.parse(fileData.toString());
    fs.unlinkSync(path.join(folders.temp, data.file))

    const {functReportFinanca} = require("../db/call-function-report");
    args.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    let {rows: list} = await functReportFinanca(args);

    let {year, month} = args;
    const excel = require("exceljs");
    const filename = `${month} ${year} IVA.xlsx`;
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet("emitted_document");

    let letras = "A B C D E F G H I J K L".split(" ");

    workSheet.columns = [
        {header: "documento_numero", width: 30},
        {header: "documento_serie", width: 30},
        {header: "documento_data", width: 30},
        {header: "nif_consumidor", width: 30},
        {header: "total_valor_itens", width: 30},
        {header: "tax_aplicavel_itens", width: 30},
        {header: "codigo_isento", width: 30},
        {header: "quant_itens", width: 30},
        {header: "desc_itens", width: 30},
        {header: "numero_documento_origem", width: 30},
        {header: "data_documento_origem", width: 30},
        {header: "tipo_documento", width: 30}
    ];

    let color = {
        A: "ffcc99",
        B: "ffcc99",
        C: "ffcc99",
        D: "ccffcc",
        E: "ffcc99",
        F: "ffcc99",
        G: "ffcc99",
        H: "ccffcc",
        I: "ccffcc",
        J: "daeef3",
        K: "daeef3",
        L: "daeef3"
    };

    let colorFont = {
        A: "333399",
        B: "333399",
        C: "333399",
        D: "008000",
        E: "333399",
        F: "333399",
        G: "333399",
        H: "008000",
        I: "008000",
        J: "000000",
        K: "000000",
        L: "000000"
    }

    let linha = 1;
    letras.forEach((letra) => {
        workSheet.getCell(`${letra}${linha}`).font = {
            color: {argb: colorFont[letra]}
        };
        workSheet.getCell(`${letra}${linha}`).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        };
        workSheet.getCell(`${letra}${linha}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: color[letra]},
        };
    })

    list.forEach(({vreport_imposto_financas: {...artigo}}, index) => {
        let {tserie_code, documento_numero, documento_serie, documento_data, nif_consumidor, total_valor_itens, tipo_documento_origem, data_documento_origem, codigo_isento, desc_itens, taxa_aplicavel_itens, quant_itens, numero_documento_origem} = artigo;
        if(!!documento_data){
            documento_data = new Date(documento_data);
        }

        if(!!data_documento_origem){
            data_documento_origem = new Date(data_documento_origem);
        }

        if(!!codigo_isento){
            codigo_isento = +codigo_isento;
        }

        if(codigo_isento){
            codigo_isento = +codigo_isento;
        }

        documento_serie = `${tserie_code || "N/A"}${documento_serie ?? ""}`
        workSheet.addRow([documento_numero, documento_serie, documento_data, nif_consumidor, total_valor_itens, taxa_aplicavel_itens, codigo_isento, quant_itens, desc_itens, numero_documento_origem, data_documento_origem, tipo_documento_origem]);

        workSheet.getCell(`C${index + 2}`).numFmt = 'dd/mm/yyyy';
        workSheet.getCell(`K${index + 2}`).numFmt = 'dd/mm/yyyy';

        letras.forEach((letra) => {
            workSheet.getCell(`E${index + 2}`).numFmt = "#,###.######";
            workSheet.getCell(`${letra}${index + 2}`).font = {
                color: {argb: colorFont[letra]}
            };
            workSheet.getCell(`${letra}${index + 2}`).border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
            workSheet.getCell(`${letra}${index + 2}`).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: color[letra]},
            };
        })
    });

    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    await workBook.xlsx.writeFile(path.join(folders.temp, 'multer/' + filename)).then(() => {
        res.download(path.join(folders.temp, 'multer') + "/" + filename, filename, function () {
            fs.unlinkSync(path.join(folders.temp, 'multer') + "/" + filename);
        });
    });
});
