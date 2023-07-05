import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


export function functLoadSeries(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_serie(${args}) data`
    );
}

export function functLoadSeriesAvailable(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_load_serie_available(${args}) data`
    );
}
export function functRegSerie(paramn) {
    const { sql } = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_sets_serie', ${paramn}, ${  args.appMode})`
    );
}

export function functRegEfacturaAuthorization(paramn) {
    const { sql } = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_sets_autorizacao', ${paramn}, ${  args.appMode})`
    );
}

export function functLoadEfacturaAuthorization(paramn) {
    const { sql } = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_autorizacao', ${paramn}, ${args.appMode})`
    );
}
export function functChangeAuthorizationCloseYear(paramn) {
    const { sql } = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_change_autorizacao_closeyear', ${paramn}, ${args.appMode})`
    );
}

export function functSetsAuthorizatioContinue(paramn) {
    const { sql } = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_sets_autorizacao_continue', ${paramn}, ${args.appMode})`
    );
}