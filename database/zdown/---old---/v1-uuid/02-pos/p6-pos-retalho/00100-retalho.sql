
drop function tweeks.funct_reg_retalho(args jsonb);

drop table tweeks.retalho;

create table tweeks.retalho(
  retalho_id uuid not null default public.uuid_generate_v4(),
  retalho_artigo_composto uuid not null,
  retalho_artigo_base uuid not null,
  retalho_colaborador_id uuid not null,
  retalho_espaco_auth uuid not null,
  retalho_espaco_branch uuid not null generated always as ( coalesce( tweeks._space_branch(retalho_espaco_auth, 1 ), retalho_espaco_auth ) ) stored,
  retalho_composicao double precision not null,
  retalho_quantidade double precision not null,
  retalho_total double precision not null generated always as ( retalho_composicao * retalho_quantidade  ) stored,
  retalho_estado int2 not null default map.get('maguita_retalho_estado_ativo')::int2,
  retalho_dataregistro timestamptz not null default current_timestamp,
  retalho_dataatualizacao timestamptz default null,
  constraint pk_retalho_id primary key ( retalho_id ),
  constraint fk_retalho_to_artigo_base foreign key ( retalho_artigo_base ) references tweeks.artigo,
  constraint fk_retalho_to_artigo_composto foreign key ( retalho_artigo_composto ) references tweeks.artigo,
  constraint fk_retalho_to_espaco foreign key ( retalho_espaco_auth ) references tweeks.espaco,
  constraint fk_retalho_to_colaborador foreign key ( retalho_colaborador_id ) references auth.colaborador
);



create or replace function tweeks.funct_pos_reg_retalho(args jsonb)
  returns lib.res
  language plpgsql
as
$$
declare
  /*
   args := {
      arg_colaborador_id,
      arg_espaco_auth,

      retalho_artigo_composto
      retalho_artigo_base
      retalho_composicao
      retalho_quantidade
   }
   */
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

    _artigo_base tweeks.artigo;
    _artigo_composto tweeks.artigo;
    _retalho tweeks.retalho;

begin
    _retalho := jsonb_populate_record( _retalho, args );
    _artigo_base := tweeks._get_artigo( _retalho.retalho_artigo_base );
    _artigo_composto := tweeks._get_artigo( _retalho.retalho_artigo_composto );

    if _artigo_composto.artigo_artigo_id is null
        or _artigo_composto.artigo_compostoquantidade is null
    then
      return lib.res_false( 'O artigo selecionano para composto não é um artigo composto!' );
    end if;

    _retalho.retalho_colaborador_id := arg_colaborador_id;
    _retalho.retalho_espaco_auth := arg_espaco_auth;

    select ( "returning" ).* into _retalho
      from lib.sets( _retalho )
    ;

    return lib.res_true(jsonb_build_object(
      'retalho', _retalho
    ));
end;
$$;


create or replace function tweeks.funct_pos_load_artigo_composto( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  _const map.constant;
begin
  _const := map.constant();
  return query
    with recursive __artigo as (
      select
          art.artigo_id,
          art.artigo_nome,
          art.artigo_artigo_id as artigo_base,
          ab.artigo_nome as artigo_parent,
          art.artigo_compostoquantidade,
          1 as composicao_nivel
        from tweeks.artigo art
          inner join tweeks.artigo ab on art.artigo_artigo_id = ab.artigo_id
          inner join tweeks.link l on l.link_referencia @> lib.sets_ref( art )
            and l.link_espaco_destino = arg_espaco_auth
            and l.link_estado = _const.maguita_link_estado_ativo
          inner join tweeks.link l2 on l2.link_referencia @> lib.sets_ref( ab )
            and l2.link_espaco_destino = arg_espaco_auth
            and l2.link_estado = _const.maguita_link_estado_ativo
        where art.artigo_artigo_id is not null
      union all
        select
            _a.artigo_id,
            _a.artigo_nome,
            ip.artigo_id,
            ip.artigo_nome,
            _a.artigo_compostoquantidade * lk.artigo_compostoquantidade ,
            _a.composicao_nivel +1
          from __artigo _a
            inner join tweeks.artigo lk on _a.artigo_base = lk.artigo_id
            inner join tweeks.artigo ip on lk.artigo_artigo_id = ip.artigo_id
    ), __composto_group as (
      select
          _a.artigo_id,
          _a.artigo_nome,
          array_agg( to_jsonb( _a  ) ) as artigo_bases
        from __artigo _a
        group by
          _a.artigo_id,
          _a.artigo_nome
    ) select to_jsonb( _tg )
      from __composto_group _tg
    ;
end;
$$;

/**
  Embalagem -> Valendo  10  Cloroquina
  Artigo a retalhar:    3   Embalagem
  Artigo a obter:       30  Cloriquina
 */