"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functReportVendaPOS = exports.functReportFinanca = exports.functFilterReport = exports.functLoadReportSource = void 0;
const database_service_1 = require("../../../service/database.service");
const zoo_pg_1 = require("zoo.pg");
const args_1 = require("../../../global/args");
function functLoadReportSource(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'report.source_filter', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadReportSource = functLoadReportSource;
function functFilterReport(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from report.engine( ${paramn} ) with ordinality r( data )`);
}
exports.functFilterReport = functFilterReport;
function functReportFinanca(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from report.vreport_imposto_financas( ${paramn} )`);
}
exports.functReportFinanca = functReportFinanca;
function functReportVendaPOS(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_report_venda( ${paramn} ) as data`);
}
exports.functReportVendaPOS = functReportVendaPOS;
//# sourceMappingURL=call-function-report.js.map