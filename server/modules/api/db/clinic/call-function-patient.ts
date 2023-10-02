import { catchAll, catchLast, Templates } from "zoo.pg";

export function functSetPatient(args) {
    const {factoryClinic} = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_patient( ${ args }) data`
    );
}

export function functLoadPatient(args) {
    const {factoryClinic} = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_patient( ${ args }) data`
    );
}
