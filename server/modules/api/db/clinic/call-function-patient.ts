import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factoryClinic } from "../../../../service/database.service";

export function functSetPatient(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_patient( ${ args }) data`
    );
}

export function functLoadPatient(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_patient( ${ args }) data`
    );
}