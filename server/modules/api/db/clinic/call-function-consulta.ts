import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql} from "kitres";
import {args} from "../../../../global/args";

export function functSetConsulta(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query( sql `select * from clinic.sets_consulta( ${ argument }) data`)
    );
}

export function functLoadConsulta(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql`select * from clinic.funct_load_consulta( ${ argument }) data` )
    );
}

export function functLoadConsultaData(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql`select * from clinic.funct_load_consulta_data( ${ argument }) data` )
    );
}
