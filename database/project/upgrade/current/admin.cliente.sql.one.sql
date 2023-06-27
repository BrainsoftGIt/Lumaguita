alter table tweeks.cliente add if not exists cliente_code character varying;
alter table tweeks.cliente alter cliente_code set default null;

update tweeks.cliente
  set cliente_code = tweeks.__generate_cliente_code( cliente_colaborador_id, cliente_espaco_auth )
  where cliente_id != lib.to_uuid( 1 );

update tweeks.cliente set cliente_code = '0000000' where cliente_id = lib.to_uuid( 1 );

alter table tweeks.cliente add if not exists cliente_metadata jsonb default jsonb_build_object() not null;