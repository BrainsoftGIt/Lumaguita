import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


export function functGenerateKey() {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_generate_chave( )`
    );
}
export function functloadKey(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_chave(${args} )`
    );
}
export function functloadPosto(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_posto(${args} )`
    );
}
export function functRegPosto(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_posto(${args} )`
    );
}
export function functChangeStatusPosto(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_posto_estado(${args} )`
    );
}
export function functAssociarPosto(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_chave_restore(${args} )`
    );
}
export function functLoadColaboradorPosto(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_pos_load_colaborador(${args} )`
    );
}
export function functLoadPostoEspaco(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_posto', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadCaixa(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_caixa_auth', ${paramn}, ${  args.appMode}) data`
    );
}
export function functAbrirCaixa(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_reg_caixa', ${paramn}, ${  args.appMode})`
    );
}
export function functFecharCaixa(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_change_caixa_close', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadSales(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_dia', ${paramn}, ${  args.appMode}) data`
    );
}