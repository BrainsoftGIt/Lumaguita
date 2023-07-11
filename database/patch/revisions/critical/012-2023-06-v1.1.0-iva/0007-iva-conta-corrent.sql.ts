import {block} from "../../../core/updater";

block( module, { identifier: "ivaContaCorrent", flags:["@unique"]}).sql`
alter table tweeks.conta add column if not exists conta_conta_docorigin uuid default null;
alter table tweeks.venda add column if not exists venda_venda_docorign uuid default null;

alter table tweeks.conta drop constraint if exists fk_conta_to_conta_docorigin;
alter table tweeks.venda drop constraint if exists fk_venda_to_venda_docorigin;

alter table tweeks.conta add constraint fk_conta_to_conta_docorigin foreign key ( conta_conta_docorigin )
  references tweeks.conta;

alter table tweeks.venda add constraint fk_venda_to_venda_docorigin foreign key ( venda_venda_docorign )
  references tweeks.venda
`;
