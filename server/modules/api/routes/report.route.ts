import {app} from '../../../service/web.service';
import {factory} from "../../../service/database.service";
import { Templates, Types} from "zoo.pg";
import fs from "fs";
import path from "path";
import {folders} from "../../../global/project";
import moment from "moment";
import {dbRes} from "../../../service/database.service/core";
import {getUserSession, getUserSessionPOS} from "./functions/get-session";
import {SQL} from "kitres";
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
        console.log({err})
    }).finally(async function () {
        res.json({configs: _data});
    });
});

app.post("/api/report/source/filter", async (req, res) => {
    const {functLoadReportSource} = require("../db/call-function-report");

    let args = req.body;
    let _session = (!args._grants) ? getUserSession( req ) : getUserSessionPOS( req );

    args.user = _session.user_id;
    args.space = _session.workspace;
    args.branch = _session.branch_uid;

    const response = await functLoadReportSource(args);

    res.json({filterData: response.rows});
});
app.post("/api/report/filter", async (req, res) => {
    const {functFilterReport} = require("../db/call-function-report");
    req.body._branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;
    const response = await functFilterReport(req.body);
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
    req.body.obj._branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;
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
            if(value !== null && value !== "") object[formatKey(key)] = !isStringInteger(value) ? value : +value;
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


function isStringInteger(str) {
    // Use parseInt to check if the string represents an integer
    // Check if parseInt returns a number and the conversion from string to number is equal
    return /^\d+$/.test(str) && parseInt(str, 10).toString() === str;
}


app.post("/api/report/export/imposto", async (req, res) =>{
    const {functReportFinanca} = require("../db/call-function-report");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    let { rows : list } = await functReportFinanca(req.body);


    let ordenList = {};
    list.forEach(({vreport_imposto_financas: {...artigo}}) => {
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
                    cell.numFmt = '#,###.######';
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
    dbRes.call({ returnVersion: "v1"}).report.sets_parametrized_report({
        args: SQL.jsonb( args )
    }, {
        onResult(error: Error, result?: Result<any, any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: 'Error ao salar  o relatorio parametizados',
                    hint: error.message
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
});


app.post( "/api/report/parametrized/load", (req, res, next) => {
    let args = req.body;
    let _session = (!args._grants) ? getUserSession( req ) : getUserSessionPOS( req );
    args._user_id = _session.user_id;
    args._workspace = _session.workspace;
    args._branch = _session.branch_uid;

    if(!args._user_id){
        return res.json({
            result:true,
            message:"success",
            data: []
        })
    }

    dbRes.call({ returnVersion: "v1"}).report.funct_load_report_parametrized( {
        args : args
    }, {
        onResult(error: Error, result?: Result<any,any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: 'Error ao carregar a lista dos relatorios parametizados',
                    hint: error.message
                })
                console.error( error );
                return;
            }
            return res.json({
                result:true,
                message:"success",
                data:result.rows
            })
        }
    }).doc()
})

app.post( "/api/report/parametrized/load/filter", (req, res, next) => {
    let _session = (!req.body._grants) ? getUserSession( req ) : getUserSessionPOS( req );
    dbRes.call({ returnVersion: "v1"}).report.funct_load_report_parametrized_filter( {
        args :{
            _branch: _session.branch_uid,
            _user_id: _session.user_id,
            _workspace: _session.workspace,
            _parametrized_uid: req.body["_parametrized_uid"]
        }
    }, {
        onResult(error: Error, result?: Result<any,any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: 'Error ao carregar os filtros de um relatorio parametizado',
                    hint: error.message
                })
                console.error( error );
                return;
            }
            return res.json({
                result: true,
                message:'success',
                data:result.rows
            })
        }
    }).doc()
});
