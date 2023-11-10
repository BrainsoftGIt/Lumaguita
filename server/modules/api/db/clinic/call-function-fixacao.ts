// import { catchAll, catchLast, Templates } from "zoo.pg";
import {resolveClinicAllIfNoDatabase, resolveClinicLastIfNoDatabase} from "./CallNoErro";
import {catchAll, catchLast, sql} from "kitres";
import {args} from "../../../../global/args";

export function functSetItens(argument:any) {
    console.log({dbUserClinic : args.dbUserClinic})
    if(!args.dbUserClinic){
        return resolveClinicLastIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory");
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        clinicCore.query(sql `select * from clinic.sets_item( ${ argument }) data`)
    );
}

export function functLoadItens(argument:any) {
    console.log({dbUserClinic : args.dbUserClinic})
    if(!args.dbUserClinic){
        return resolveClinicAllIfNoDatabase();
    }
    const {clinicCore} = require("../../../../service/database.service/clinica.factory")
    // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        clinicCore.query( sql `select * from clinic.funct_load_item( ${ argument }) data` )
    );
}
