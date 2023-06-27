import { block } from "../../core/updater";

export const name = "simple-path";
export const before = [ ];
export const after = [ ];


let blockInstance = block( module, { identifier: "simplePathSQL", flags:[ ],
} ).sql`
create table tweeks._temp_forece_table( name text, time timestamptz not null default current_timestamp );
`;

