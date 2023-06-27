import { block } from "../../core/updater";

export const name = "simple-path";
export const before = [ ];
export const after = [ ];

block( module, { identifier: "simpleUnique", flags:[ "@unique" ] } ).sql`
  select 'executed unique block'
`;