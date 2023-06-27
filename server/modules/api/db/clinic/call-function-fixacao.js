"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadItens = exports.functSetItens = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../../service/database.service");
function functSetItens(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from clinic.sets_item( ${args}) data`);
}
exports.functSetItens = functSetItens;
function functLoadItens(args) {
    const { sql } = database_service_1.factoryClinic.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from clinic.funct_load_item( ${args}) data`);
}
exports.functLoadItens = functLoadItens;
//# sourceMappingURL=call-function-fixacao.js.map