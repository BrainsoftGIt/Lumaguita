import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";


export function functLoadClients(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_cliente', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadLaunchs(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_lancamento', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadCambio(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_cambio_ativo', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadDepositoData(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_deposito_data', ${paramn}, ${  args.appMode}) data`
    );
}
export function functRegistarDeposito(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_pos_reg_deposito', ${paramn}, ${  args.appMode})`
    );
}
export function functRegistarLancamento(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.sets_lancamento', ${paramn}, ${  args.appMode})`
    );
}