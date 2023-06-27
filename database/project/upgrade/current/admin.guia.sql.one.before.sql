select map.constant( 'maguita_guia_estado_ativo', 'int2', 1, 'Estado ativo de guia' );

drop table if exists tweeks.custoguia;
drop table if exists tweeks.guia cascade;

select map.constant( 'maguita_tguia_entrada', 'int2', 1, 'Identificador para as guias de entrada' );
select map.constant( 'maguita_tguia_saida', 'int2', 2, 'Identificador para as guias de saida' );

create table tweeks.guia(
  guia_uid uuid not null default gen_random_uuid(),
  guia_toperacao_id int2 not null,
  guia_tguia_id int2 not null,
  guia_espaco_auth uuid not null,
  guia_colaborador_id uuid not null,
  guia_colaborador_atualizacao uuid not null,

  guia_documentoperacao character varying,
  guia_numero character varying not null,
  guia_metadata json,

  guia_dataoperacao date not null default current_date,
  guia_observacao character varying default null,

  guia_refs jsonb default null,
  guia_refuid uuid default null,
  guia_refclass character varying default null,
  guia_estado int2 not null default (map.get('maguita_guia_estado_ativo'))::int2,
  guia_date timestamptz not null default clock_timestamp(),
  guia_dateupdate timestamptz default null,
  _braunc_uid uuid,

  constraint pk_guia_id primary key ( guia_uid ),
  constraint fk_guia_to_colaborador foreign key ( guia_colaborador_id ) references auth.colaborador,
  constraint fk_guia_to_espaco foreign key ( guia_espaco_auth ) references tweeks.espaco,
  constraint fk_guia_to_colaborador_atualizacao foreign key ( guia_colaborador_atualizacao ) references auth.colaborador
);

select map.constant( 'maguita_custoguia_estado_ativo', 'int2', 1, 'Estado ativo para custo de guia' );
select map.constant( 'maguita_custoguia_estado_canselado', 'int2', -1, 'Estado ativo para custo de guia canselado' );

create table tweeks.custoguia (
  custoguia_uid uuid not null default gen_random_uuid(),
  custoguia_guia_uid uuid not null,
  custoguia_colaborador_id uuid not null,
  custoguia_espaco_auth uuid not null,
  custoguia_colaborador_atualizacao uuid not null,
  custoguia_descricao character varying not null,
  custoguia_montante double precision not null,
  custoguia_tcusto_id int2 not null,
  custoguia_estado int2 not null default map.get('maguita_custoguia_estado_ativo')::int2,
  custoguia_date timestamptz not null,
  custoguia_dateupdate timestamptz default null,
  _braunc_uid uuid,

  constraint pk_custo_id primary key ( custoguia_uid ),
  constraint fk_custo_to_guia foreign key ( custoguia_guia_uid ) references tweeks.guia,
  constraint fk_custo_to_colaborador foreign key ( custoguia_colaborador_id ) references auth.colaborador,
  constraint fk_custo_to_colaborador_atualizacao foreign key ( custoguia_colaborador_atualizacao ) references auth.colaborador
);
