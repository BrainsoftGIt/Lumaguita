import { catchAll, catchLast, Templates } from "zoo.pg";
import {  factory } from "../../../service/database.service";
import {args} from "../../../global/args";

export function functSetBranch(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchLast(
        sql `select * from tweeks.main( 'tweeks.funct_sets_branch', ${paramn}, ${  args.appMode})`
    );
}
export function functLoadBranch(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'tweeks.funct_load_branch', ${paramn}, ${ args.appMode }) data`
    );
}
export function functLoadPaths(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'cluster.load_paths', ${paramn}, ${  args.appMode}) data`
    );
}
export function functLoadAllMenus(paramn) {
    const {sql} = factory.create(Templates.PARAMETERIZED);
    return catchAll(
        sql `select * from tweeks.main( 'auth.funct_load_menu', ${paramn}, ${  args.appMode}) data`
    );
}


