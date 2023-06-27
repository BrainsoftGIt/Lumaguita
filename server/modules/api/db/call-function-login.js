"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadWorkSpaces = exports.functLoadSimpleSpace = exports.functChangePassword = exports.functLoadConstants = exports.functLoadUsersByWorkSpace = exports.functLoadMenus = exports.functChangePin = exports.functAuthenticate = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
function functAuthenticate(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from auth.funct_autenticacao( ${args})`);
}
exports.functAuthenticate = functAuthenticate;
function functChangePin(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_pin( ${args})`);
}
exports.functChangePin = functChangePin;
function functLoadMenus(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from auth.funct_load_menu( ${args})`);
}
exports.functLoadMenus = functLoadMenus;
function functLoadUsersByWorkSpace(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_colaborador_by_posto( ${args})`);
}
exports.functLoadUsersByWorkSpace = functLoadUsersByWorkSpace;
function functLoadConstants(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from map.constant_list( ${args})`);
}
exports.functLoadConstants = functLoadConstants;
function functChangePassword(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from auth.funct_change_colaborador_senha( ${args})`);
}
exports.functChangePassword = functChangePassword;
function functLoadSimpleSpace(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_espaco_simple( ${args})`);
}
exports.functLoadSimpleSpace = functLoadSimpleSpace;
function functLoadWorkSpaces(args) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.funct_load_trabalha( ${args})`);
}
exports.functLoadWorkSpaces = functLoadWorkSpaces;
//# sourceMappingURL=call-function-login.js.map