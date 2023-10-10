import { catchAll, catchLast, Templates } from "zoo.pg";
import {args} from "../../../../global/args";
import {CatchAll} from "zoo.pg/lib/result";

export function functSetScheduler(args) {
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.sets_scheduler( ${ args }) data`
    );
}

export function getPatient(args) {
    const factoryClinic = require("../../../../service/database.service/clinica.factory");
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from clinic.get_patient( ${ args }) data`
    );
}

export function functLoadScheduler(argss) {
    const {factoryClinic} = require("../../../../service/database.service/clinica.factory");
    if(!args.dbPasswordClinic){
        return new Promise<CatchAll>(
            (resolve, reject) => {
               resolve(null);
            }
        )
    }
    const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from clinic.funct_load_scheduler( ${ argss }) data`
    );
}
