import { catchAll, catchLast, Templates } from "zoo.pg";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";

export function functSetItens(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_item( ${ args }) data`
    );
}

export function functLoadItens(args) {
    if(!args.dbPasswordClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_item( ${ args }) data`
    );
}
