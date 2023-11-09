// import { catchAll, catchLast, Templates } from "zoo.pg";
import {args} from "../../../../global/args";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql,CatchAll} from "kitres";
// import {CatchAll} from "zoo.pg/lib/result";

export function functSetScheduler(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query( sql `select * from clinic.sets_scheduler( ${ argument }) data` )
    );
}

export function getPatient(argument:any) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query(sql`select * from clinic.get_patient( ${ argument }) data`)
    );
}

export function functLoadScheduler(argument:any):Promise<CatchAll<any,any>> {
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    if(!args.dbPasswordClinic){
       return resolveClinicAllIfNoDatabase();
    }
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll<any,any>(
        clinicCore.query(sql `select * from clinic.funct_load_scheduler( ${ argument }) data` )
    )
}
