import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";

export function functLoadUserPOS(args) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.funct_pos_load_colaborador( ${ args }) data`
    );
}
export function functLoadContasAbertas(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_aberto', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadProformas(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_load_conta_proforma', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadAccountkey(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_pos_generate_key', ${paramn}, ${  args.appMode}) data`
    );
}