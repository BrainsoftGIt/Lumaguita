alter table tweeks.transferencia add if not exists transferencia_descricao character varying;
alter table tweeks.transferencia add if not exists transferencia_lote character varying;
alter table tweeks.transferencia add if not exists transferencia_validade date;
alter table tweeks.transferencia add if not exists transferencia_metadata json;
