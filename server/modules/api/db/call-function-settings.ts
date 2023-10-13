import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";
import {dbRes} from "../../../service/database.service/kitres/res";
import {Result} from "kitres";
import moment from "moment-timezone";


export function functRegArmazem(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_espaco( ${ args })`
    );
}
export function functUpdateArmazem(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_espaco( ${ args })`
    );
}
export function functRegCambio(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_cambio( ${ args })`
    );
}
export function functLoadCambio(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_cambio_ativo( ${ args }) data`
    );
}
export function functLoadArmazens(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_espaco( ${ args })`
    );
}
export async function functAtualizarDadosEmpresa(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);

    let {configuracao_impressoras, impressoras_cozinha, ...empresa_data} = args?.configPrinter || args?.dados_empresa;

    if(empresa_data) {
        args = {...args};
        args.parametrizacao_uid = empresa_data["empresa_data_id"] || null;
        args.parametrizacao_props = empresa_data;
        args.parametrizacao_tags = ["empresa_data", args.arg_espaco_auth];
        await functRegSetting(args);
    }

    if (configuracao_impressoras) {
        console.log(empresa_data?.["configuracao_impressoras_id"], "configuracao_impressoras_id")
        args = {...args};
        args.parametrizacao_uid = empresa_data["configuracao_impressoras_id"] || null;
        args.parametrizacao_props = {configuracao_impressoras};
        args.parametrizacao_tags = ["configuracao_impressoras", args.arg_espaco_auth];
        await functRegSetting(args);
    }

    if (impressoras_cozinha) {
        console.log(empresa_data?.["impressoras_cozinha_id"], "impressoras_cozinha_id")
        args = {...args};
        args.parametrizacao_uid = empresa_data["impressoras_cozinha_id"] || null;
        args.parametrizacao_props = {impressoras_cozinha} || {};
        args.parametrizacao_tags = ["impressoras_cozinha", args.arg_espaco_auth];
        await functRegSetting(args);
    }

    return catchLast(
        sql`select *
            from tweeks.funct_change_espaco_configuracao(${args})`
    );
}
export function functMigrarEspaco(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_change_espaco_migrate', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadDadosEmpresa(args) {
    return new Promise((resolve) => {
        const {sql} = factory.create(Templates.PARAMETERIZED);
        catchAll(
            sql `select * from tweeks.funct_load_espaco_configuracao( ${ args })`
        ).then((dados) => {
            if(dados.rows[0]){
                args = {...args};
                // args.parametrizacao_tags = [args.arg_espaco_auth];
                functLoadSetting(args).then((result) => {
                    // @ts-ignore
                    let {data} = result || [];
                    let obj = {};
                    data.forEach(({parametrizacao_props, parametrizacao_tags, parametrizacao_uid}) => {
                        obj = {...obj, ...parametrizacao_props, [`${parametrizacao_tags[0]}_id`]: parametrizacao_uid };
                    })
                    dados.rows[0].funct_load_espaco_configuracao.espaco.espaco_configuracao = obj
                    resolve(dados);
                })
            }
        })
    })
}

export function functLoadDadosEmpresaOld(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_espaco_configuracao( ${ args })`
    );
}

export function functLoadTaxCodes() {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.codigoimposto`
    );
}
export function functLoadClustersBranch(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_cluster_by_branch( ${ args }) data`
    );
}
export function functLoadSpaceMigrate(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_espaco_migrate( ${ args }) data`
    );
}
export function functRegistarImposto(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.sets_tipoimposto', ${paramn}, ${args.appMode})`
    );
}

export function functLoadImpostos(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_tipoimposto( ${ args }) data`
    );
}
export function functGetArticleTax(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks._get_impostos_taxa', ${paramn}, ${args.appMode})`
    );
}

export function functUnits(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_unit', ${paramn}, ${args.appMode})`
    );
}

export function functRegSetting(args) {
    return new Promise((resolve) => {
        dbRes.call.tweeks.sets_parametrizacao({ args }, {
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

export function functLoadSetting(args) {
    return new Promise((resolve) => {
        dbRes.call.tweeks.funct_load_parametrizacao({ args }, {
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

export function functLoadDataCluster() {
    moment.locale('pt-br');
    return new Promise((resolve) => {
        dbRes.call.cluster.licence_status({}, {
            onResult(error: Error, result?: Result<any, any>): any {
                if( error ){
                    resolve({
                        result:false,
                        message: error.message,
                        hint: error
                    })
                    return;
                }

                let {cluster_license, class: cluster_class} = result?.rows?.[0] || {};
                const dataAtual = moment().tz("Africa/Sao_Tome");
                const dataDesejada = moment(cluster_license).tz("Africa/Sao_Tome");
                const diasRestantes = dataDesejada.diff(dataAtual, 'days');
                const dataDesejadaFormatada = dataDesejada.format("LLLL");

                resolve({
                    diasRestantes,
                    dataDesejadaFormatada,
                    cluster_class
                })
            }
        })
    })
}
