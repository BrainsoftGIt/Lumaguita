"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funct_load_imposto_simple = exports.funct_load_base_article = exports.funct_load_guia_data = exports.functSearchArticleByCode = exports.functSearchProvider = exports.functLoadArticleStock = exports.functLoadArticleData = exports.functRegTransferencia = exports.functRegEntrada = exports.functRemoveFornecedor = exports.functDisableCategory = exports.functDisableArticle = exports.functChangeAmountInStock = exports.functLoadArticles = exports.functLoadProviders = exports.functSetProvider = exports.functRegArticle = exports.functRegItem = exports.functRegCategory = exports.functLoadCategories = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functLoadCategories(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_classe( ${args}) data`);
}
exports.functLoadCategories = functLoadCategories;
function functRegCategory(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_classe( ${args})`);
}
exports.functRegCategory = functRegCategory;
function functRegItem(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_item( ${args})`);
}
exports.functRegItem = functRegItem;
function functRegArticle(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_artigo( ${args})`);
}
exports.functRegArticle = functRegArticle;
function functSetProvider(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_sets_fornecedor( ${args})`);
}
exports.functSetProvider = functSetProvider;
function functLoadProviders(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_fornecedor( ${args})`);
}
exports.functLoadProviders = functLoadProviders;
function functLoadArticles(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_artigo( ${args})`);
}
exports.functLoadArticles = functLoadArticles;
function functChangeAmountInStock(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_acerto( ${args})`);
}
exports.functChangeAmountInStock = functChangeAmountInStock;
function functDisableArticle(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_artigo_estado( ${args})`);
}
exports.functDisableArticle = functDisableArticle;
function functDisableCategory(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_classe_estado( ${args})`);
}
exports.functDisableCategory = functDisableCategory;
function functRemoveFornecedor(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_fornecedor_estado( ${args})`);
}
exports.functRemoveFornecedor = functRemoveFornecedor;
function functRegEntrada(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_entrada( ${args})`);
}
exports.functRegEntrada = functRegEntrada;
function functRegTransferencia(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_transferencia( ${args})`);
}
exports.functRegTransferencia = functRegTransferencia;
function functLoadArticleData(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_artigo_data( ${args})`);
}
exports.functLoadArticleData = functLoadArticleData;
function functLoadArticleStock(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_stoks( ${args}) data`);
}
exports.functLoadArticleStock = functLoadArticleStock;
function functSearchProvider(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_fornecedor_code', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functSearchProvider = functSearchProvider;
function functSearchArticleByCode(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_artigo_by_code', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functSearchArticleByCode = functSearchArticleByCode;
function funct_load_guia_data(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_guia_data', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.funct_load_guia_data = funct_load_guia_data;
function funct_load_base_article(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_artigo_base', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.funct_load_base_article = funct_load_base_article;
function funct_load_imposto_simple(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_tipoimposto_simple', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.funct_load_imposto_simple = funct_load_imposto_simple;
//# sourceMappingURL=call-function-article.js.map