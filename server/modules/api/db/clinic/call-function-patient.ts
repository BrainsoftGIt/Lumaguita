// import { catchAll, catchLast, Templates } from "zoo.pg";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql} from "kitres";
import {args} from "../../../../global/args";

export function functSetPatient(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query( sql `select * from clinic.sets_patient( ${ argument }) data` )
    );
}

export function functLoadPatient(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");

    return catchAll(
        clinicCore.query( sql `select * from clinic.funct_load_patient( ${ argument }) data` )
    );
}
