"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadSales = exports.functFecharCaixa = exports.functAbrirCaixa = exports.functLoadCaixa = exports.functLoadPostoEspaco = exports.functLoadColaboradorPosto = exports.functAssociarPosto = exports.functChangeStatusPosto = exports.functRegPosto = exports.functloadPosto = exports.functloadKey = exports.functGenerateKey = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functGenerateKey() {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_generate_chave( )`);
}
exports.functGenerateKey = functGenerateKey;
function functloadKey(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_chave(${args} )`);
}
exports.functloadKey = functloadKey;
function functloadPosto(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_posto(${args} )`);
}
exports.functloadPosto = functloadPosto;
function functRegPosto(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_posto(${args} )`);
}
exports.functRegPosto = functRegPosto;
function functChangeStatusPosto(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_posto_estado(${args} )`);
}
exports.functChangeStatusPosto = functChangeStatusPosto;
function functAssociarPosto(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_chave_restore(${args} )`);
}
exports.functAssociarPosto = functAssociarPosto;
function functLoadColaboradorPosto(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_load_colaborador(${args} )`);
}
exports.functLoadColaboradorPosto = functLoadColaboradorPosto;
function functLoadPostoEspaco(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_posto', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadPostoEspaco = functLoadPostoEspaco;
function functLoadCaixa(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_caixa_auth', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadCaixa = functLoadCaixa;
function functAbrirCaixa(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_reg_caixa', ${paramn}, ${args_1.args.appMode})`);
}
exports.functAbrirCaixa = functAbrirCaixa;
function functFecharCaixa(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_change_caixa_close', ${paramn}, ${args_1.args.appMode})`);
}
exports.functFecharCaixa = functFecharCaixa;
function functLoadSales(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_dia', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadSales = functLoadSales;
//# sourceMappingURL=call-function-posto.js.map