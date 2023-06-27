"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadMenuGrants = exports.functLogin = exports.functLoadArmazensColaboradorAlocar = exports.functRestorePassword = exports.functChangePIN = exports.functChangePassword = exports.functUpdateUser = exports.functLoadUsers = exports.functEnableUser = exports.functDisableUser = exports.functLoadMenusBranch = exports.functLoadMenu = exports.functRegAccess = exports.functRegUser = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
function functRegUser(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_reg_colaborador( ${args})`);
}
exports.functRegUser = functRegUser;
function functRegAccess(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_reg_acesso( ${args})`);
}
exports.functRegAccess = functRegAccess;
function functLoadMenu(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.___override_auth_funct_load_menu( ${args}) as funct_load_menu`);
}
exports.functLoadMenu = functLoadMenu;
function functLoadMenusBranch(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.___override_auth_funct_load_menu( ${args}) data`);
}
exports.functLoadMenusBranch = functLoadMenusBranch;
function functDisableUser(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_accesso_disable( ${args})`);
}
exports.functDisableUser = functDisableUser;
function functEnableUser(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_accesso_reativar( ${args})`);
}
exports.functEnableUser = functEnableUser;
function functLoadUsers(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_colaborador( ${args}) data`);
}
exports.functLoadUsers = functLoadUsers;
function functUpdateUser(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.funct_change_colaborador( ${args})`);
}
exports.functUpdateUser = functUpdateUser;
function functChangePassword(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_senha( ${args})`);
}
exports.functChangePassword = functChangePassword;
function functChangePIN(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_pin( ${args})`);
}
exports.functChangePIN = functChangePIN;
function functRestorePassword(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.func_restore_user_password( ${args})`);
}
exports.functRestorePassword = functRestorePassword;
function functLoadArmazensColaboradorAlocar(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_espaco_simple( ${args})`);
}
exports.functLoadArmazensColaboradorAlocar = functLoadArmazensColaboradorAlocar;
function functLogin(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.___override_auth_funct_autenticacao( ${args}) data`);
}
exports.functLogin = functLogin;
function functLoadMenuGrants(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.___override_auth_funct_load_grants( ${args}) data`);
}
exports.functLoadMenuGrants = functLoadMenuGrants;
//# sourceMappingURL=call-function-colaborador.js.map