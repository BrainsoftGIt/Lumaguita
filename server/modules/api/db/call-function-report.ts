import {factory} from "../../../service/database.service";
import {catchAll, catchLast, Templates} from "zoo.pg";
import {args} from "../../../global/args";

export function functLoadReportSource(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'report.source_filter', ${paramn}, ${  args.appMode}) data`
    );
}
export function functFilterReport(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from report.engine( ${ paramn } ) with ordinality r( data )`
    );
}

export function functReportFinanca(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from report.vreport_imposto_financas( ${ paramn } )`
    );
}
