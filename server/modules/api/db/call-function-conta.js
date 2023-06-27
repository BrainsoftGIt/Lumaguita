"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadAccountkey = exports.functLoadProformas = exports.functLoadContasAbertas = exports.functLoadUserPOS = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functLoadUserPOS(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_load_colaborador( ${args}) data`);
}
exports.functLoadUserPOS = functLoadUserPOS;
function functLoadContasAbertas(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_aberto', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadContasAbertas = functLoadContasAbertas;
function functLoadProformas(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_proforma', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadProformas = functLoadProformas;
function functLoadAccountkey(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_generate_key', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadAccountkey = functLoadAccountkey;
//# sourceMappingURL=call-function-conta.js.map