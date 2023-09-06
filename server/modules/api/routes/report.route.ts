import {app} from '../../../service/web.service';
import {factory} from "../../../service/database.service";
import { Templates, Types} from "zoo.pg";
import {functFilterReport} from "../db/call-function-report";
import fs from "fs";
import path from "path";
import {folders} from "../../../global/project";
import moment from "moment";
import {dbRes} from "../../../service/database.service/kitres/res";
import {getUserSession} from "./functions/get-session";
import {SQL} from "kitres/src/core/pg-core/scape";
import { Result } from 'kitres';

app.get("/api/report/type/data", async (req, res) => {
    let args = {};

    const { sql } = factory.create( Templates.PARAMETERIZED );
    let _data = [];
    sql`
          select * from report.configs( ${ Types.jsonb( args ) }) r ( report );
       `.stream((data) => {
        _data.push(data[ "report" ]);
    }).catch(err => {
    }).finally(async function () {
        res.json({configs: _data});
    });
});

app.post("/api/report/source/filter", async (req, res) => {
    const {functLoadReportSource} = require("../db/call-function-report");
    req.body.branch = req.session.auth_data.auth.branch_uuid;
    req.body.space = req.session.auth_data.auth.armazem_atual;
    req.body.user = req.session.auth_data.auth.colaborador_id;
    const response = await functLoadReportSource(req.body);
    res.json({filterData: response.rows});
});
app.post("/api/report/filter", async (req, res) => {
    const {functFilterReport} = require("../db/call-function-report");
    req.body._branch_uid = req.session.auth_data.auth.branch_uuid;
    const response = await functFilterReport(req.body);
    // response.notices.forEach( value => console.log( value.message ) );
    res.json({reportData: response.rows});
});
app.get("/api/date/representation", async (req, res) => {
    const { sql } = factory.create( Templates.PARAMETERIZED );
    let _data = [];
    sql`
        select *
            from report.mask 
            order by priority desc  nulls last 
       `.stream((data) => {
        _data.push(data);
    }).catch(err => {
    }).finally(async function () {
        res.json({repres: _data});
    });
});
app.post("/api/report/export", async (req, res) =>{
    const {functFilterReport} = require("../db/call-function-report");
    req.body.obj._branch_uid = req.session.auth_data.auth.branch_uuid;
    let listReport = await functFilterReport(req.body.obj);

    const excel = require("exceljs");
    const filename = "Luma - "+req.body.report_name+"_"+moment(new Date()).format( "DD-MM-YYYY h_mm_ss" )+".xlsx";
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet(req.body.report_name);
    const headers = req.body.headers;
    workSheet.getRow(1).font = {family: 2, size: 13, bold: true };
    workSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    workBook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ]
    workSheet.columns = [
        ...(()=>{
            return headers.map((header) =>{
                if(header.format === "name") return  {header: header.name, width: 40, key: formatKey(header.rename)};
                else return  {header: header.name, width: 25, key: formatKey(header.rename)};
            });
        })()
    ];
    let object;
    listReport.rows.forEach((report) =>{
        object = {};
        Object.entries(report.data).forEach(([key, value]) => {
            if(value) object[formatKey(key)] = typeof value === "string" ? value : Number(value).toFixed(2);
            else object[formatKey(key)] = "";
        });
        workSheet.addRow(object);
    });
    formatColumn(headers, workSheet);
    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    let reportPath = path.join( folders.temp, 'multer', filename );
    await workBook.xlsx.writeFile(reportPath).then(() =>{
        res.json({file: filename})
    });
});
app.post("/api/report/export/imposto", async (req, res) =>{
    const {functReportFinanca} = require("../db/call-function-report");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    let { rows : list } = await functReportFinanca(req.body);

    const filename = "Luma - report - financa - "+moment(new Date()).format( "DD-MM-YYYY h_mm_ss" )+".json";
    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    let reportPath = path.join( folders.temp, 'multer', filename );

    let ordenList = {};
    list.forEach(({vreport_imposto_financas: {...artigo}}) => {
        console.log(artigo);
        if(!ordenList[artigo.conta_id]){
            ordenList[artigo.conta_id] = []
        }

        ordenList[artigo.conta_id].push(artigo);
    })

    res.json(ordenList);
});
app.get("/api/report/download/:report_name", async (req, res) =>{
    let filename = req.params.report_name;
    let reportPath = path.join(folders.temp, 'multer', filename );
    res.download( reportPath, function () {
        fs.unlinkSync(path.join(folders.temp, 'multer', req.params.report_name ));
    });
});

function formatKey(key) {
    return key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
}
function formatColumn(headers, worksheet){
    worksheet.eachRow((row, rowNumber) =>{
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        if(rowNumber !== 1)
            row.font = {family: 2, size: 12, bold: false };
        row.height = 25.5;
    });
    worksheet.eachColumnKey( (col, index) => {
        if(index) {
            col.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
        }
    });
    headers.forEach((header) =>{
        let column = worksheet.getColumn(formatKey(header.rename));
        column.eachCell(function(cell, rowNumber) {
            if(rowNumber > 1){
                if(header.format === "money"){
                    cell.numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';
                }
            }
        });
    });
}

app.post( "/api/report/parametrized/sets", (req, res, next) => {
    let _session = getUserSession( req );
    let args = req.body;
    args._user_id = _session.user_id;
    args._espaco_auth = _session.workspace;
    args._branch = _session.branch_uid;
    dbRes.call.report.sets_parametrized_report({
        args: SQL.jsonb( args )
    }, {
        onResult(error: Error, result?: Result<any, any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: error.message
                })
                console.error( error );
                return;
            }

            return res.json({
                result:result.rows[0]["result"],
                message:result.rows[0]["message"],
                data:result.rows.filter( (value, index) => index > 0 )
            })
        }
    })
})
