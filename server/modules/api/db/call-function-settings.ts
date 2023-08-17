import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


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
export function functAtualizarDadosEmpresa(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_espaco_configuracao( ${ args })`
    );
}
export function functMigrarEspaco(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_change_espaco_migrate', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadDadosEmpresa(args) {
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
        sql `select * from tweeks.main( 'tweeks.sets_tipoimposto', ${paramn}, ${  args.appMode})`
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
        sql `select * from tweeks.main( 'tweeks._get_impostos_taxa', ${paramn}, ${  args.appMode})`
    );
}