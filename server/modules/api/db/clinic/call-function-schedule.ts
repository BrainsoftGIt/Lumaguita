import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factoryClinic } from "../../../../service/database.service";

export function functSetScheduler(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_scheduler( ${ args }) data`
    );
}

export function getPatient(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.get_patient( ${ args }) data`
    );
}

export function functLoadScheduler(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_scheduler( ${ args }) data`
    );
}
