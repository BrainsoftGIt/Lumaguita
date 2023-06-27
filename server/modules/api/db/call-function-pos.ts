import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


export function functLoadPosClasse(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_pos_load_class(${args}) data`
    );
}
export function functLoadArtigosCategoria(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_pos_load_artigo(${args}) data`
    );
}
export function functLoadItemsArtigo(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_pos_load_artigo_extras(${args}) data`
    );
}
export function functRegConta(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_pos_reg_conta(${args})`
    );
}
export function functRegCliente(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_reg_cliente', ${paramn}, ${  args.appMode})`
    );
}
export function functAnularConta(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_anular', ${paramn}, ${  args.appMode})`
    );
}
export function functRegistarPagamento(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_fechar', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadContaData(params) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_data', ${params}, ${  args.appMode})`
    );
}
export function functLoadClients(params) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_cliente', ${params}, ${  args.appMode}) data`
    );
}
export function functLoadArtigoComposto(params) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_artigo_composto', ${params}, ${  args.appMode}) data`
    );
}
export function functSearchArtigoPOS(params) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_artigo_search', ${params}, ${  args.appMode}) data`
    );
}
export function functRegRetalho(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_reg_retalho', ${paramn}, ${  args.appMode})`
    );
}
export function functChangeContaProforma(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_change_conta_proforma', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadArticlesKitchen(params) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_conta_preparacao', ${params}, ${  args.appMode}) data`
    );
}
export function functChangeVendaPreparado(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_change_venda_preparado', ${paramn}, ${  args.appMode})`
    );
}
