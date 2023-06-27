import { block } from "../../core/updater";
import {exclusion} from "../../core/exclusion";
import {args} from "../../../../server/global/args";

export const name = "simple-path";
export const before = [ ];
export const after = [ ];


block( module, { identifier: "simpleExclusionMode", exclude: exclusion( {mode: [ "dev" ]})}).sql`
  select format( 'Exclude in dev mode | exclude %s', ${ args.appMode } = 'dev' )
`;

block( module, { identifier: "simpleCustomExclusionMode", exclude: ()=>{
    return  true;
}}).sql`
  select 'Custom Exclude for all condition'

`;


block( module, {
    identifier: "expiredBlock", life: { end : "2022-01-01" }
}).sql`
  select 'Expired block'

`;

