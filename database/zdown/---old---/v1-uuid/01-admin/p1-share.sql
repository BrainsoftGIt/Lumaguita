create table tweeks.share(
    share_id uuid not null default public.uuid_generate_v4(),
    share_table regclass not null,
    share_reference uuid not null,
    share_cluster character varying[],
    share_receiver character varying[]
);

create table test_33k(
  id_part_1 serial2,
  id_part_2 text,
  id_part_3 uuid,
  id_part_4 uuid,
  text text,
  constraint pk_test_33k_id primary key ( id_part_1, id_part_2, id_part_3 ),
  constraint uk_773hs unique ( id_part_4 )
);

insert into test_4k (text)
values ( 'Ola mundo' );
