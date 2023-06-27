import { block } from "../../core/updater";

export const name = "simple-path";
export const before = [ ];
export const after = [ ];

block( module, { identifier: "simpleForce", flags:[ "@force" ] } ).sql`
  select 'executed forced block'
`;