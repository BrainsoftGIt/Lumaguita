import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";

export function functAuthenticate(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from auth.funct_autenticacao( ${ args })`
    );
}
export function functChangePin(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_pin( ${ args })`
    );
}
export function functLoadMenus(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from auth.funct_load_menu( ${ args })`
    );
}
export function functLoadUsersByWorkSpace(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_colaborador_by_posto( ${ args })`
    );
}
export function functLoadConstants(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from map.constant_list( ${ args })`
    );
}
export function functChangePassword(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_senha( ${ args })`
    );
}
export function functLoadSimpleSpace(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_espaco_simple( ${ args })`
    );
}
export function functLoadWorkSpaces(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_trabalha( ${ args })`
    );
}
