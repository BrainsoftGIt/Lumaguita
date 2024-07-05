import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";
import {dbRes} from "../../../service/database.service/kitres/res";
import {Result} from "kitres";


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
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_artigo( ${ args })`
    );
}

export function functLoadArticlesExport(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_artigo_exports( ${ args })`
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

export function functLoadSerieDistribuicao(args) {
    return new Promise((resolve) => {
        dbRes.call.tweeks.funct_load_serie_distribuicao({ args }, {
            onResult(error: Error, result?: Result<any, any>): any {
                if( error ){
                    resolve({
                        result:false,
                        message: error.message,
                        hint: error
                    })
                    return;
                }

                resolve({
                    result: !!result?.rows?.[0]?.["result"],
                    message: result?.rows?.[0]?.["message"] || "",
                    data:result?.rows
                })
            }
        })
    })
}
export function functLoadSeriesDistribuicao(args) {
    return new Promise((resolve) => {
        dbRes.call.tweeks.funct_load_serie_distribuicao_pos({ args }, {
            onResult(error: Error, result?: Result<any, any>): any {
                if( error ){
                    resolve({
                        result:false,
                        message: error.message,
                        hint: error
                    })
                    return;
                }

                resolve({
                    result: !!result?.rows?.[0]?.["result"],
                    message: result?.rows?.[0]?.["message"] || "",
                    data:result?.rows
                })
            }
        })
    })
}



