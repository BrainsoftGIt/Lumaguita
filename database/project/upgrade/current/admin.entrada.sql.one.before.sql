alter table tweeks.entrada rename entrada_group to entrada_guia_id;
alter table tweeks.entrada add if not exists entrada_lote character varying;
alter table tweeks.entrada add if not exists entrada_valiade  date;
alter table tweeks.entrada add if not exists entrada_metadata json default null;
alter table tweeks.entrada alter entrada_metadata type json using to_json( entrada_metadata );
alter table tweeks.entrada drop if exists entrada_codigofatura cascade;
alter table tweeks.entrada drop if exists entrada_data;
alter table tweeks.entrada drop if exists entrada_fornecedor_id;