alter table tweeks.venda add if not exists venda_descricao character varying default null;
alter table tweeks.venda add if not exists venda_lote character varying default null;
alter table tweeks.venda add if not exists venda_validade date default null;
alter table tweeks.venda add if not exists venda_metadata json default null;