// import { catchAll, catchLast, Templates } from "zoo.pg";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql} from "kitres";

export function functSetItens(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query(sql `select * from clinic.sets_item( ${ args }) data`)
    );
}

export function functLoadItens(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory")
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql `select * from clinic.funct_load_item( ${ args }) data` )
    );
}
