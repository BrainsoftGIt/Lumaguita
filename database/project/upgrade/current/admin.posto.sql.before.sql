alter table tweeks.espaco add espaco_posto_admin uuid default null;
alter table tweeks.espaco add constraint fk_espaco_to_posto_admin foreign key ( espaco_posto_admin )
  references tweeks.posto;