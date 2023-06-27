import {catchAll, catchLast, Templates, Types} from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";

export function functSearchCustomer(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_search_cliente', ${paramn}, ${  args.appMode}) data`
    );
}