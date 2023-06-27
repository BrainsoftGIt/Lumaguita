alter table tweeks.acerto alter acerto_id set default public.uuid_generate_v4();
alter table tweeks.acerto add acerto_oprgroup uuid not null default public.uuid_generate_v4();

drop function tweeks.funct_load_stock(filter jsonb);



with t as ( SELECT generate_series(1,20) AS val )


SELECT unnest(percentile_disc(array[0.25,0.5,0.75,1]) )
                -- WITHIN GROUP (ORDER BY val))
  FROM t;

create or replace function tweeks.funct_load_stoks(
  args jsonb
) returns setof jsonb language plpgsql as $$
declare
  /**
    Essa função serve para carragar a quantidade em stock dos diferentes espaços
    args := {
      arg_colaborador_id: UUID
      arg_espaco_auth: UUID
      espaco_destino: UUID,
      artigos:[ UUID, UUID, UUID ]
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  arg_espaco_destino uuid default args->>'espaco_destino';
  arg_artigos uuid[] default array( select jsonb_array_elements_text( args->'artigos' )::uuid);
begin
  if jsonb_array_length( args->'artigos' )  = 0 then
    arg_artigos := null;
  end if;

  return query
    with __stoks as (
        select
            art.artigo_id,
            art.artigo_nome,
            e.espaco_id,
            e.espaco_nome,
            s.stock_quantidade,
            n.index
          from tweeks.artigo art
            inner join tweeks.espaco e on e.espaco_id = coalesce( arg_espaco_destino, e.espaco_id )
            inner join tweeks._get_stock(art.artigo_id, arg_espaco_destino ) s on art.artigo_id = s.stock_artigo_id
            left join unnest( arg_artigos ) with ordinality n( id, index ) on art.artigo_id = n.id
          where art.artigo_id = any( coalesce( arg_artigos, array[]::uuid[] ) )

    ) select to_jsonb( s )
      from __stoks s
      order by s.index
      ;
end;
$$;

alter table tweeks.acerto rename acerto_diferenca to acerto_correcao;

alter table tweeks.acerto drop acerto_stock_id;

drop function rule.tg_acerto_after_insert_create_movimento() cascade;

create or replace function tweeks.funct_reg_acerto( args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para efetuar o acerto do stock
    args = {
      arg_espaco_auth: ID
      arg_espaco_id: ID,
      arg_colaborador_id := ID,

      acerto_observacao: OBS
      arg_acerto: [{
        artigo_id:UUID,
        acerto_quantidade: QUANTIDADE
      }]
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_id uuid not null default args->>'arg_espaco_id';
  arg_acerto_observacao varchar default args->>'acerto_observacao';

  arg_acerto_corecao double precision;

  _const map.constant;
  _stock record;
  _acerto tweeks.acerto;
  _new tweeks.acerto;

  _acerto_group uuid;
  _data record;
  acertos jsonb default jsonb_build_array();
begin
  _const := map.constant();

  for _data in
    select
        (e.doc->>'artigo_id')::uuid as artigo_id,
        (e.doc->>'acerto_quantidade')::double precision as acerto_quantidade
      from jsonb_array_elements( args->'arg_acerto' ) e( doc )
  loop

    _stock := tweeks._get_stock( _data.artigo_id, arg_espaco_id );
    arg_acerto_corecao := _stock.stock_quantidade - _data.acerto_quantidade;
    _acerto_group := public.uuid_generate_v4();

    _new.acerto_colaborador_id :=    arg_colaborador_id;
    _new.acerto_quantidade :=        _data.acerto_quantidade;
    _new.acerto_quantidadeinicial := _stock.stock_quantidade;
    _new.acerto_correcao :=          arg_acerto_corecao;
    _new.acerto_observacao :=        arg_acerto_observacao;
    _new.acerto_espaco_auth :=       arg_espaco_auth;
    _new.acerto_oprgroup :=          _acerto_group;
    _new.acerto_artigo_id :=         _data.artigo_id;
    _new.acerto_espaco_id :=         arg_espaco_id;

    -- Save acerto
    select ( "returning" ).* into _acerto
      from lib.sets_in( _new )
    ;

    _stock := tweeks._get_stock( _data.artigo_id, arg_espaco_id );
    acertos := acertos || jsonb_build_object(
      'acerto', _acerto,
      'stock', _stock,
      'artigo', tweeks._get_artigo( _stock.stock_artigo_id )
    );
  end loop;

  return  true ? acertos;
end;
$$;

create or replace function rule.tg_acerto_after_insert_create_movimento() returns trigger
    language plpgsql
as
$$
declare
  /** Esse trigger server para acertar o valor do stock depois que for registrado o acerto*/
  _new tweeks.acerto;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;

  -- registra o movimento para efetuar o acerto ao stock
  perform rule.movimento_create(
    _new.acerto_espaco_auth,
    _new.acerto_colaborador_id,
    _new.acerto_stock_id,
    _const.toperacao_acerto,
    jsonb_build_object( 'acerto_id', _new.acerto_id ),
    _new.acerto_quantidade,
    _const.tmovimento_credito,
    _new.acerto_quantidade,
    _new.acerto_dataregistro::date,
     format(  'AC#%s',  _new.acerto_id)
  );
  return null;
end;
$$;

select * from tweeks.acerto;


drop function if exists tweeks._get_stock(arg_artigo_id uuid, arg_espaco_id uuid);
drop function if exists tweeks._get_stock(arg_artigo_id uuid, arg_espaco_id uuid, uuid );
create or replace function tweeks._get_stock(arg_artigo_id uuid, arg_espaco_id uuid ) returns stock
    strict
    language plpgsql
as
$$
declare
  /**
    Essa funcao serve para obter a instanci de um stock
   */
  _const map.constant;
  _stock tweeks.stock;
  _data record;
begin

  _const := map.constant();

  select * into _stock
  from tweeks.stock sto
  where sto.stock_artigo_id = arg_artigo_id
    and sto.stock_espacao_id = arg_espaco_id
    order by
      case
        when sto.stock_estado = _const.stock_estado_ativo then 1
        else 2
      end,
      sto.stock_dataregistro desc
  ;

  if _stock.stock_id is null then
    insert into tweeks.stock(
      stock_artigo_id,
      stock_espacao_id,
      stock_colaborador_id
    ) values (
      arg_artigo_id,
      arg_espaco_id,
      _const.colaborador_system_data
    ) returning * into _stock ;
  end if;

  select sum( s.stock_quantidade ) as stock_quantidade
      into _data
    from tweeks.stock s
    where s.stock_espacao_id = arg_espaco_id
      and s.stock_artigo_id = arg_artigo_id
  ;

  _stock.stock_quantidade := _data.stock_quantidade;
  return _stock;
end;
$$;
