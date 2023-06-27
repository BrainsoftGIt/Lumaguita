"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functRegistarLancamento = exports.functRegistarDeposito = exports.functLoadDepositoData = exports.functLoadCambio = exports.functLoadLaunchs = exports.functLoadClients = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functLoadClients(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_cliente', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadClients = functLoadClients;
function functLoadLaunchs(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_lancamento', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadLaunchs = functLoadLaunchs;
function functLoadCambio(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_cambio_ativo', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadCambio = functLoadCambio;
function functLoadDepositoData(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_deposito_data', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadDepositoData = functLoadDepositoData;
function functRegistarDeposito(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_pos_reg_deposito', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegistarDeposito = functRegistarDeposito;
function functRegistarLancamento(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.sets_lancamento', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegistarLancamento = functRegistarLancamento;
//# sourceMappingURL=call-function-contacorrrente.js.map