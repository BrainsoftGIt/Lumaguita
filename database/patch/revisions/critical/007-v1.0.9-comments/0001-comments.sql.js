"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "table-comment", flags: ["@unique"] }).sql `
  comment on column espaco.espaco_vender is 'Esse campo indica em qual dos nucleo o espaço deve permitir a venda';
`;
//# sourceMappingURL=0001-comments.sql.js.map