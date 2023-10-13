import { catchAll, catchLast, Templates } from "zoo.pg";
import {args} from "../../../../global/args";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";

export function functSetScheduler(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_scheduler( ${ args }) data`
    );
}

export function getPatient(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.get_patient( ${ args }) data`
    );
}

export function functLoadScheduler(argss) {
    const {factoryClinic} = require("../../../../service/database.service/clinica.factory");
    if(!args.dbPasswordClinic){
       return resolveClinicAllIfNoDatabase();
    }
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_scheduler( ${ argss }) data`
    );
}
