import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factoryClinic } from "../../../../service/database.service";

export function functSetItens(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_item( ${ args }) data`
    );
}

export function functLoadItens(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_item( ${ args }) data`
    );
}