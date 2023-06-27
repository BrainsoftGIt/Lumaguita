create table tweeks.tdocuemto (
  tdocumento_id int2 not null,
  tdocumento_nome character varying not null,
  constraint pk_tdocumento_id primary key ( tdocumento_id )
);



select map.constant( 'maguita_cliente_estado_ativo', 'int2', 1 );

drop table if exists tweeks.ccorrente;
drop table if exists tweeks.cliente;

create table tweeks.cliente(
  cliente_id uuid not null default public.uuid_generate_v4(),

  cliente_colaborador_id uuid not null,
  cliente_colaborador_gerente uuid,
  cliente_colaborador_atualizacao uuid default null,
  cliente_espaco_auth uuid not null,
  cliente_espaco_branch uuid not null generated always as ( coalesce( tweeks._space_branch( cliente_espaco_auth, 1 ), cliente_espaco_auth ) ) stored,

  cliente_tdocument_id int2,
  cliente_titular character varying not null,
  cliente_nif character varying,
  cliente_documento character varying,
  cliente_mail character varying,

  cliente_credito double precision not null default 0.0,
  cliente_debito double precision not null default 0.0,
  cliente_balanco double precision not null generated always as ( cliente_credito - cliente_debito ) stored,

  cliente_contactos jsonb not null default jsonb_build_array(),
  cliente_estado int2 not null default map.get('maguita_cliente_estado_ativo' )::int2,
  cliente_dataregistro timestamptz not null default current_timestamp,
  cliente_dataatualizacao timestamptz default null,

  constraint pk_cliente_id primary key ( cliente_id ),
  constraint uk_cliente_nif unique ( cliente_espaco_auth, cliente_nif ),
  constraint uk_cliente_document unique ( cliente_espaco_branch, cliente_tdocument_id, cliente_documento ),
  constraint fk_cliente_to_tdocumento foreign key ( cliente_tdocument_id ) references tweeks.tdocuemto
);

alter table tweeks.conta rename conte_cliente_id to conta_cliente_id;

alter table tweeks.conta add constraint fk_conto_to_cliente
  foreign key ( conta_cliente_id ) references tweeks.cliente
;


insert into tweeks.tpaga( tpaga_id, tpaga_designacao ) values ( 5, 'Conta corrente' );

select map.constant( format('maguita_%s', name ), type, value, descrision, editable, comment ) from  map.describe( 'tpaga');
select * from  map.describe( 'maguita_tpaga');

select map.constant('maguita_tpaga_contacorrente', 'int2', 5 );

insert into tweeks.cliente( cliente_id, cliente_colaborador_id, cliente_colaborador_gerente, cliente_colaborador_atualizacao, cliente_espaco_auth, cliente_tdocument_id, cliente_titular, cliente_nif, cliente_documento, cliente_mail )
values ( lib.to_uuid( 1 ), lib.to_uuid( 1), lib.to_uuid( 1), null, lib.to_uuid( 1), null, 'Cliente final', null, null, null );



select * from tweeks.cliente;