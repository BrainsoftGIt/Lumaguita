"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functGetArticleTax = exports.functLoadImpostos = exports.functRegistarImposto = exports.functLoadSpaceMigrate = exports.functLoadClustersBranch = exports.functLoadTaxCodes = exports.functLoadDadosEmpresa = exports.functMigrarEspaco = exports.functAtualizarDadosEmpresa = exports.functLoadArmazens = exports.functLoadCambio = exports.functRegCambio = exports.functUpdateArmazem = exports.functRegArmazem = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functRegArmazem(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_espaco( ${args})`);
}
exports.functRegArmazem = functRegArmazem;
function functUpdateArmazem(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_espaco( ${args})`);
}
exports.functUpdateArmazem = functUpdateArmazem;
function functRegCambio(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_cambio( ${args})`);
}
exports.functRegCambio = functRegCambio;
function functLoadCambio(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_cambio_ativo( ${args}) data`);
}
exports.functLoadCambio = functLoadCambio;
function functLoadArmazens(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_espaco( ${args})`);
}
exports.functLoadArmazens = functLoadArmazens;
function functAtualizarDadosEmpresa(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_espaco_configuracao( ${args})`);
}
exports.functAtualizarDadosEmpresa = functAtualizarDadosEmpresa;
function functMigrarEspaco(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_change_espaco_migrate', ${paramn}, ${args_1.args.appMode})`);
}
exports.functMigrarEspaco = functMigrarEspaco;
function functLoadDadosEmpresa(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_espaco_configuracao( ${args})`);
}
exports.functLoadDadosEmpresa = functLoadDadosEmpresa;
function functLoadTaxCodes() {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from codigoimposto`);
}
exports.functLoadTaxCodes = functLoadTaxCodes;
function functLoadClustersBranch(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_cluster_by_branch( ${args}) data`);
}
exports.functLoadClustersBranch = functLoadClustersBranch;
function functLoadSpaceMigrate(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_espaco_migrate( ${args}) data`);
}
exports.functLoadSpaceMigrate = functLoadSpaceMigrate;
function functRegistarImposto(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.sets_tipoimposto', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegistarImposto = functRegistarImposto;
function functLoadImpostos(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_tipoimposto( ${args}) data`);
}
exports.functLoadImpostos = functLoadImpostos;
function functGetArticleTax(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks._get_impostos_taxa', ${paramn}, ${args_1.args.appMode})`);
}
exports.functGetArticleTax = functGetArticleTax;
//# sourceMappingURL=call-function-settings.js.map