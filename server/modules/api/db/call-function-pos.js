"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functChangeVendaPreparado = exports.functLoadArticlesKitchen = exports.functChangeContaProforma = exports.functRegRetalho = exports.functSearchArtigoPOS = exports.functLoadArtigoComposto = exports.functLoadClients = exports.functLoadContaData = exports.functRegistarPagamento = exports.functAnularConta = exports.functRegCliente = exports.functRegConta = exports.functLoadItemsArtigo = exports.functLoadArtigosCategoria = exports.functLoadPosClasse = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functLoadPosClasse(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_load_class(${args}) data`);
}
exports.functLoadPosClasse = functLoadPosClasse;
function functLoadArtigosCategoria(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_load_artigo(${args}) data`);
}
exports.functLoadArtigosCategoria = functLoadArtigosCategoria;
function functLoadItemsArtigo(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_pos_load_artigo_extras(${args}) data`);
}
exports.functLoadItemsArtigo = functLoadItemsArtigo;
function functRegConta(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_pos_reg_conta(${args})`);
}
exports.functRegConta = functRegConta;
function functRegCliente(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_reg_cliente', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegCliente = functRegCliente;
function functAnularConta(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_anular', ${paramn}, ${args_1.args.appMode})`);
}
exports.functAnularConta = functAnularConta;
function functRegistarPagamento(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_fechar', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegistarPagamento = functRegistarPagamento;
function functLoadContaData(params) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_data', ${params}, ${args_1.args.appMode})`);
}
exports.functLoadContaData = functLoadContaData;
function functLoadClients(params) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_cliente', ${params}, ${args_1.args.appMode}) data`);
}
exports.functLoadClients = functLoadClients;
function functLoadArtigoComposto(params) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_artigo_composto', ${params}, ${args_1.args.appMode}) data`);
}
exports.functLoadArtigoComposto = functLoadArtigoComposto;
function functSearchArtigoPOS(params) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_pos_load_artigo_search', ${params}, ${args_1.args.appMode}) data`);
}
exports.functSearchArtigoPOS = functSearchArtigoPOS;
function functRegRetalho(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_reg_retalho', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegRetalho = functRegRetalho;
function functChangeContaProforma(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_proforma', ${paramn}, ${args_1.args.appMode})`);
}
exports.functChangeContaProforma = functChangeContaProforma;
function functLoadArticlesKitchen(params) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_conta_preparacao', ${params}, ${args_1.args.appMode}) data`);
}
exports.functLoadArticlesKitchen = functLoadArticlesKitchen;
function functChangeVendaPreparado(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_change_venda_preparado', ${paramn}, ${args_1.args.appMode})`);
}
exports.functChangeVendaPreparado = functChangeVendaPreparado;
//# sourceMappingURL=call-function-pos.js.map