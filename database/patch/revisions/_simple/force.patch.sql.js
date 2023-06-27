"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.after = exports.before = exports.name = void 0;
const updater_1 = require("../../core/updater");
exports.name = "simple-path";
exports.before = [];
exports.after = [];
(0, updater_1.block)(module, { identifier: "simpleForce", flags: ["@force"] }).sql `
  select 'executed forced block'
`;
//# sourceMappingURL=force.patch.sql.js.map