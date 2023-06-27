"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadConsultaData = exports.functLoadConsulta = exports.functSetConsulta = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../../service/database.service");
function functSetConsulta(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from clinic.sets_consulta( ${args}) data`);
}
exports.functSetConsulta = functSetConsulta;
function functLoadConsulta(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from clinic.funct_load_consulta( ${args}) data`);
}
exports.functLoadConsulta = functLoadConsulta;
function functLoadConsultaData(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from clinic.funct_load_consulta_data( ${args}) data`);
}
exports.functLoadConsultaData = functLoadConsultaData;
//# sourceMappingURL=call-function-consulta.js.map