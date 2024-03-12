import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";

export function functRegUser(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_reg_colaborador( ${ args })`
    );
}
export function functRegAccess(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_reg_acesso( ${ args })`
    );
}
export function functLoadMenu(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.___override_auth_funct_load_menu( ${ args }) as funct_load_menu`
    );
}
export function functLoadMenusBranch(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.___override_auth_funct_load_menu( ${ args }) data`
    );
}
export function functDisableUser(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_accesso_disable( ${ args })`
    );
}
export function functEnableUser(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_accesso_reativar( ${ args })`
    );
}
export function functLoadUsers(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_colaborador( ${ args }) data`
    );
}
export function functUpdateUser(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.funct_change_colaborador( ${ args })`
    );
}
export function functChangePassword(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_senha( ${ args })`
    );
}
export function functChangePIN(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from auth.funct_change_colaborador_pin( ${ args })`
    );
}
export function functLoadArmazensColaboradorAlocar(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_espaco_simple( ${ args })`
    );
}
export function functLogin(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.___override_auth_funct_autenticacao( ${ args }) data`
    );
}
export function functLoadMenuGrants(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.___override_auth_funct_load_grants( ${ args }) data`
    );
}

