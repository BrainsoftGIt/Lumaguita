import {block} from "../../../core/updater";

block( module, { identifier: "table-comment", flags: [ "@unique" ]  } ).sql`
  comment on column espaco.espaco_vender is 'Esse campo indica em qual dos nucleo o espaço deve permitir a venda';
`;