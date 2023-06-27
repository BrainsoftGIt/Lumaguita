"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functRegSerie = exports.functLoadSeriesAvailable = exports.functLoadSeries = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functLoadSeries(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_serie(${args}) data`);
}
exports.functLoadSeries = functLoadSeries;
function functLoadSeriesAvailable(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_serie_available(${args}) data`);
}
exports.functLoadSeriesAvailable = functLoadSeriesAvailable;
function functRegSerie(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_sets_serie', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegSerie = functRegSerie;
//# sourceMappingURL=call-function-efatura.js.map