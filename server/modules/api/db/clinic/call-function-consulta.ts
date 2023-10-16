import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql} from "kitres";

export function functSetConsulta(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query( sql `select * from clinic.sets_consulta( ${ args }) data`)
    );
}

export function functLoadConsulta(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql`select * from clinic.funct_load_consulta( ${ args }) data` )
    );
}

export function functLoadConsultaData(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql`select * from clinic.funct_load_consulta_data( ${ args }) data` )
    );
}
