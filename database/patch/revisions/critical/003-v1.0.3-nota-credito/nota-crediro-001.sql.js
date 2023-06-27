"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "maguita_lancamento_estado_anulado", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  select map.constant( 'maguita_lancamento_estado_anulado', 'int2', -1, 'Lançamento anulado' );
`;
// let blockInstance = block( module, { identifier: "nota-credito-changes-001", flags:[ "@unique" ],
// // language=PostgreSQL
// } ).sql`
//   insert into tweeks.tserie( tserie_id, tserie_desc, tserie_code ) values ( 4, 'Nota de credito', 'NC' );
//   alter table tweeks.venda add venda_venda_refid uuid default null;
//   alter table tweeks.venda add constraint fk_venda_to_venda_refencia foreign key ( venda_venda_refid )
//     references tweeks.venda;
//   comment on column tweeks.venda.venda_venda_refid is 'Referencia de qual venda deu origem a venda atual';
//   alter table tweeks.venda add venda_notacredito boolean default false not null;
//   comment on column tweeks.venda.venda_notacredito is 'true - indica se a venda é uma nota de credito ou não';
//
//   alter table tweeks.conta add conta_conta_refid uuid default null;
//   alter table tweeks.conta add constraint fk_conta_to_conta_referencia foreign key ( conta_conta_refid )
//     references tweeks.conta;
//
//   comment on column tweeks.conta.conta_conta_refid is 'Referenia da conta original a criar a nota de credito';
// `;
//# sourceMappingURL=nota-crediro-001.sql.js.map