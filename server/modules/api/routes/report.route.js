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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
const database_service_1 = require("../../../service/database.service");
const zoo_pg_1 = require("zoo.pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const project_1 = require("../../../global/project");
const moment_1 = __importDefault(require("moment"));
web_service_1.app.get("/api/report/type/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let args = {};
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    let _data = [];
    sql `
          select * from report.configs( ${zoo_pg_1.Types.jsonb(args)}) r ( report );
       `.stream((data) => {
        _data.push(data["report"]);
    }).catch(err => {
    }).finally(function () {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ configs: _data });
        });
    });
}));
web_service_1.app.post("/api/report/source/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadReportSource } = require("../db/call-function-report");
    req.body.branch = req.session.auth_data.auth.branch_uuid;
    req.body.space = req.session.auth_data.auth.armazem_atual;
    req.body.user = req.session.auth_data.auth.colaborador_id;
    const response = yield functLoadReportSource(req.body);
    res.json({ filterData: response.rows });
}));
web_service_1.app.post("/api/report/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functFilterReport } = require("../db/call-function-report");
    req.body._branch_uid = req.session.auth_data.auth.branch_uuid;
    const response = yield functFilterReport(req.body);
    // response.notices.forEach( value => console.log( value.message ) );
    res.json({ reportData: response.rows });
}));
web_service_1.app.get("/api/date/representation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    let _data = [];
    sql `
        select *
            from report.mask 
            order by priority desc  nulls last 
       `.stream((data) => {
        _data.push(data);
    }).catch(err => {
    }).finally(function () {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ repres: _data });
        });
    });
}));
web_service_1.app.post("/api/report/export", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functFilterReport } = require("../db/call-function-report");
    req.body.obj._branch_uid = req.session.auth_data.auth.branch_uuid;
    let listReport = yield functFilterReport(req.body.obj);
    const excel = require("exceljs");
    const filename = "Luma - " + req.body.report_name + "_" + (0, moment_1.default)(new Date()).format("DD-MM-YYYY h_mm_ss") + ".xlsx";
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet(req.body.report_name);
    const headers = req.body.headers;
    workSheet.getRow(1).font = { family: 2, size: 13, bold: true };
    workSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    workBook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ];
    workSheet.columns = [
        ...(() => {
            return headers.map((header) => {
                if (header.format === "name")
                    return { header: header.name, width: 40, key: formatKey(header.rename) };
                else
                    return { header: header.name, width: 25, key: formatKey(header.rename) };
            });
        })()
    ];
    let object;
    listReport.rows.forEach((report) => {
        object = {};
        Object.entries(report.data).forEach(([key, value]) => {
            if (value)
                object[formatKey(key)] = typeof value === "string" ? value : Number(value).toFixed(2);
            else
                object[formatKey(key)] = "";
        });
        workSheet.addRow(object);
    });
    formatColumn(headers, workSheet);
    fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
    let reportPath = path_1.default.join(project_1.folders.temp, 'multer', filename);
    yield workBook.xlsx.writeFile(reportPath).then(() => {
        res.json({ file: filename });
    });
}));
web_service_1.app.post("/api/report/export/imposto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functReportFinanca } = require("../db/call-function-report");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    let { rows: list } = yield functReportFinanca(req.body);
    const filename = "Luma - report - financa - " + (0, moment_1.default)(new Date()).format("DD-MM-YYYY h_mm_ss") + ".json";
    fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
    let reportPath = path_1.default.join(project_1.folders.temp, 'multer', filename);
    let ordenList = {};
    list.forEach((_a) => {
        var artigo = __rest(_a.vreport_imposto_financas, []);
        console.log(artigo);
        if (!ordenList[artigo.conta_id]) {
            ordenList[artigo.conta_id] = [];
        }
        ordenList[artigo.conta_id].push(artigo);
    });
    res.json(ordenList);
}));
web_service_1.app.get("/api/report/download/:report_name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = req.params.report_name;
    let reportPath = path_1.default.join(project_1.folders.temp, 'multer', filename);
    res.download(reportPath, function () {
        fs_1.default.unlinkSync(path_1.default.join(project_1.folders.temp, 'multer', req.params.report_name));
    });
}));
function formatKey(key) {
    return key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
}
function formatColumn(headers, worksheet) {
    worksheet.eachRow((row, rowNumber) => {
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        if (rowNumber !== 1)
            row.font = { family: 2, size: 12, bold: false };
        row.height = 25.5;
    });
    worksheet.eachColumnKey((col, index) => {
        if (index) {
            col.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
    });
    headers.forEach((header) => {
        let column = worksheet.getColumn(formatKey(header.rename));
        column.eachCell(function (cell, rowNumber) {
            if (rowNumber > 1) {
                if (header.format === "money") {
                    cell.numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';
                }
            }
        });
    });
}
//# sourceMappingURL=report.route.js.map