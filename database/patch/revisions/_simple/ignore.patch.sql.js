"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.after = exports.before = exports.name = void 0;
const updater_1 = require("../../core/updater");
const exclusion_1 = require("../../core/exclusion");
const args_1 = require("../../../../server/global/args");
exports.name = "simple-path";
exports.before = [];
exports.after = [];
(0, updater_1.block)(module, { identifier: "simpleExclusionMode", exclude: (0, exclusion_1.exclusion)({ mode: ["dev"] }) }).sql `
  select format( 'Exclude in dev mode | exclude %s', ${args_1.args.appMode} = 'dev' )
`;
(0, updater_1.block)(module, { identifier: "simpleCustomExclusionMode", exclude: () => {
        return true;
    } }).sql `
  select 'Custom Exclude for all condition'

`;
(0, updater_1.block)(module, {
    identifier: "expiredBlock", life: { end: "2022-01-01" }
}).sql `
  select 'Expired block'

`;
//# sourceMappingURL=ignore.patch.sql.js.map