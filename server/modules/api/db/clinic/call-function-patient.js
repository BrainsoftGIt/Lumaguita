"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadPatient = exports.functSetPatient = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../../service/database.service");
function functSetPatient(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from clinic.sets_patient( ${args}) data`);
}
exports.functSetPatient = functSetPatient;
function functLoadPatient(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from clinic.funct_load_patient( ${args}) data`);
}
exports.functLoadPatient = functLoadPatient;
//# sourceMappingURL=call-function-patient.js.map