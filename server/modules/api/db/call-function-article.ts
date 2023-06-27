import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


export function functLoadCategories(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_classe( ${ args }) data`
    );
}
export function functRegCategory(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_classe( ${ args })`
    );
}
export function functRegItem(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_item( ${ args })`
    );
}
export function functRegArticle(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_artigo( ${ args })`
    );
}

export function functSetProvider(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_sets_fornecedor( ${ args })`
    );
}
export function functLoadProviders(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_fornecedor( ${ args })`
    );
}
export function functLoadArticles(args) {
    console.log( args );
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_artigo( ${ args })`
    );
}
export function functChangeAmountInStock(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_acerto( ${ args })`
    );
}
export function functDisableArticle(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_artigo_estado( ${ args })`
    );
}
export function functDisableCategory(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_classe_estado( ${ args })`
    );
}
export function functRemoveFornecedor(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_fornecedor_estado( ${ args })`
    );
}
export function functRegEntrada(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_entrada( ${ args })`
    );
}
export function functRegTransferencia(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_transferencia( ${ args })`
    );
}
export function functLoadArticleData(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_artigo_data( ${ args })`
    );
}
export function functLoadArticleStock(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_stoks( ${ args }) data`
    );
}
export function functSearchProvider(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_fornecedor_code', ${paramn}, ${  args.appMode}) data`
    );
}
export function functSearchArticleByCode(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_artigo_by_code', ${paramn}, ${  args.appMode}) data`
    );
}
export function funct_load_guia_data(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_guia_data', ${paramn}, ${  args.appMode}) data`
    );
}
export function funct_load_base_article(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_artigo_base', ${paramn}, ${  args.appMode}) data`
    );
}
export function funct_load_imposto_simple(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_tipoimposto_simple', ${paramn}, ${  args.appMode}) data`
    );
}



