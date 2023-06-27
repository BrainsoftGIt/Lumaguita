alter table tweeks.tserie add if not exists tserie_seqlimit smallint default 6 not null;
alter table tweeks.tserie add if not exists tserie_numlimit smallint default 7 not null;