"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functSearchCustomer = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functSearchCustomer(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_search_cliente', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functSearchCustomer = functSearchCustomer;
//# sourceMappingURL=call-function-customer.js.map