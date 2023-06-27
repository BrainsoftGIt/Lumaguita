import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factoryClinic } from "../../../../service/database.service";

export function functSetConsulta(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_consulta( ${ args }) data`
    );
}

export function functLoadConsulta(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_consulta( ${ args }) data`
    );
}

export function functLoadConsultaData(args) {
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_consulta_data( ${ args }) data`
    );
}