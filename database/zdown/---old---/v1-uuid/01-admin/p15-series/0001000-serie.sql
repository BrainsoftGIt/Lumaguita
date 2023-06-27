drop table tweeks.tserie;
create table tweeks.tserie(
  tserie_id int2 not null,
  tserie_desc character varying not null,
  constraint pk_tserie_id primary key ( tserie_id )
);

select map.constant( 'maguita_tserie_fatura', 'int2', 1, 'Serie para fatura' );
select map.constant( 'maguita_tserie_recibo', 'int2', 2, 'Serie para recibo' );
select map.constant( 'maguita_serie_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_serie_estado_fechado', 'int2', 2 );

insert into tweeks.tserie( tserie_id, tserie_desc ) values ( 1, 'Fatura' );
insert into tweeks.tserie( tserie_id, tserie_desc ) values ( 2, 'Recibo' );

alter table tweeks.deposito add deposito_serie_id uuid;
alter table tweeks.conta add conta_serie_id uuid;

drop table tweeks.serie cascade;
create table tweeks.serie(
  serie_id uuid not null default public.uuid_generate_v4(),
  serie_sequencia serial not null,
  serie_tserie_id int2 not null,
  serie_espaco_id uuid not null,
  serie_espaco_auth uuid not null,
  serie_espaco_branch uuid not null generated always as ( tweeks.__space_branch_main( serie_espaco_auth ) ) stored,
  serie_colaborador_id uuid not null,
  serie_colaborador_atualizacao uuid default null,
  serie_designacao character varying not null,
  serie_numero character varying not null,
  serie_quantidade int not null,
  serie_estado int2 not null default map.get( 'maguita_serie_estado_ativo' )::int2,
  serie_dataregistro timestamptz not null default current_timestamp,
  serie_dataatualizacao timestamptz default null,
  constraint pk_serie_id primary key ( serie_id ),
  constraint fk_serie_to_tserie foreign key ( serie_tserie_id ) references tweeks.tserie,
  constraint fk_serie_to_espaco foreign key ( serie_espaco_id ) references tweeks.espaco,
  constraint fk_serie_to_espaco_branch foreign key ( serie_espaco_branch ) references tweeks.espaco
);


alter table tweeks.deposito add constraint fk_deposito_to_serie foreign key ( deposito_serie_id ) references tweeks.serie;
alter table tweeks.conta add constraint fk_conta_to_serie foreign key ( conta_serie_id ) references tweeks.serie;

create or replace function tweeks.funct_sets_serie(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    args := {
      arg_colaborador_id uuid not null,
      arg_espaco_auth uuid not null,

      serie_id uuid not null,
      serie_tserie_id int2 not null,
      serie_espaco_id uuid not null,
      serie_designacao character varying not null,
      serie_numero character varying not null,
      serie_quantidade int not null,
    }
   */

  _serie tweeks.serie;
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  _serie := jsonb_populate_record( _serie, args );

  if _serie.serie_id is null then
    _serie.serie_colaborador_id := arg_colaborador_id;
    _serie.serie_espaco_auth := arg_espaco_auth;
  else
    _serie.serie_colaborador_atualizacao := arg_colaborador_id;
    _serie.serie_dataatualizacao := current_timestamp;
  end if;

  -- Quando for registrar nova serie
  select ( "returning" ).* into _serie
    from lib.sets( _serie );

  return lib.res_true(jsonb_build_object(
    'serie', _serie
  ));
end;
$$;

create or replace function tweeks.funct_load_serie( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  _const map.constant;
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _espaco_branch uuid default tweeks.__space_branch_main( arg_espaco_auth );
  _espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
begin
  _const := map.constant();
  return query
    with
      __serie as (
        select _vs.*,
            e.espaco_id,
            e.espaco_nome
          from _vserie _vs
            inner join tweeks.espaco e on _vs.serie_espaco_id = e.espaco_id
          where _vs.serie_espaco_branch = _espaco_branch
            and ( _vs.serie_espaco_auth = any( _espaco_child )
              or _vs.serie_espaco_id = any( _espaco_child )
            )
      )
    select to_jsonb( _s )
      from __serie _s;
end;
$$;

create or replace view tweeks._vserie as
 with
  _const as ( select * from map.constant() ),
  __serie as (
    select s.*,
        case
          when count( sn.serie_id ) > 0 then _const.maguita_serie_estado_fechado
          else _const.maguita_serie_estado_ativo
        end as _serie_estado
      from tweeks.serie s
        inner join _const on true
        left join tweeks.serie sn on s.serie_espaco_id = sn.serie_espaco_id
          and s.serie_tserie_id = sn.serie_tserie_id
          and ( s.serie_dataregistro < sn.serie_dataregistro or s.serie_sequencia < sn.serie_sequencia )
      group by s.serie_id,
        _const.maguita_serie_estado_fechado,
        _const.maguita_serie_estado_ativo
  ) select * from __serie

