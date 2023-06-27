"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadScheduler = exports.getPatient = exports.functSetScheduler = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../../service/database.service");
function functSetScheduler(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from clinic.sets_scheduler( ${args}) data`);
}
exports.functSetScheduler = functSetScheduler;
function getPatient(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from clinic.get_patient( ${args}) data`);
}
exports.getPatient = getPatient;
function functLoadScheduler(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from clinic.funct_load_scheduler( ${args}) data`);
}
exports.functLoadScheduler = functLoadScheduler;
//# sourceMappingURL=call-function-schedule.js.map