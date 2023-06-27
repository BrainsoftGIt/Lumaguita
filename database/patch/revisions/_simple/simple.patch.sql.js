"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.after = exports.before = exports.name = void 0;
const updater_1 = require("../../core/updater");
exports.name = "simple-path";
exports.before = [];
exports.after = [];
let blockInstance = (0, updater_1.block)(module, { identifier: "simplePathSQL", flags: [],
}).sql `
create table tweeks._temp_forece_table( name text, time timestamptz not null default current_timestamp );
`;
//# sourceMappingURL=simple.patch.sql.js.map