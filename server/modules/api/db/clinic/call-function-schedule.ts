import { catchAll, catchLast, Templates } from "zoo.pg";

export function functSetScheduler(args) {
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_scheduler( ${ args }) data`
    );
}

export function getPatient(args) {
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.get_patient( ${ args }) data`
    );
}

export function functLoadScheduler(args) {
    const {factoryClinic} = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_scheduler( ${ args }) data`
    );
}
