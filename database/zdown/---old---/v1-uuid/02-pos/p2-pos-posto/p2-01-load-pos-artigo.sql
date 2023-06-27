drop function tweeks.funct_load_artigo_classe(filter jsonb);


drop index uk_classe_codigo;

create or replace function tweeks.funct_pos_load_class(
  args jsonb
) returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_espaco_auth: UID,
      arg_colaborador_id: UID
    }
   */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  _const map.constant;
begin
  _const := map.constant();

  return query with
    __classe as (
      select
          c.classe_id,
          c.classe_classe_id,
          c.classe_nome,
          c.classe_codigo,
          c.classe_foto,
          count( distinct lart.link_id ) filter ( where lart.link_id is not null ) as classe_artigos
        from tweeks.classe c
          inner join tweeks.link lcla on to_jsonb( c ) @> lcla.link_referencia
            and lcla.link_estado = _const.maguita_link_estado_ativo
          inner join tweeks.artigo art on c.classe_id = art.artigo_classe_id
            and art.artigo_estado = _const.artigo_estado_ativo
          inner join tweeks.link lart on to_jsonb( art ) @> lart.link_referencia
            and lart.link_estado = _const.maguita_link_estado_ativo
            and lart.link_espaco_destino = artigo_espaco_auth
        where lcla.link_espaco_destino = arg_espaco_auth
          and lcla.link_tlink_id = _const.maguita_tlink_classe
        group by c.classe_id
    ) select  to_jsonb( c )
      from __classe c;
end;
$$;


create or replace function tweeks.funct_pos_load_artigo( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_colaborador_id: UID,
      arg_espaco_auth: UID
      arg_classe_id: UID
      arg_artigo_nome:TXT
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_classe_id uuid default args->>'arg_classe_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  return query with __artigo as (
    select
        art.artigo_id,
        art.artigo_classe_id,
        art.artigo_nome,
        art.artigo_stocknegativo,
        art.artigo_estado,
        s.stock_quantidade,
        l.link_metadata,
        count( di.dispoe_id ) as artigos_extras
      from tweeks.artigo art
        inner join tweeks.link l on to_jsonb( art ) @> l.link_referencia
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_preco
          and l.link_espaco_destino = arg_espaco_auth
        inner join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) s on true
        left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
      where art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
      group by art.artigo_id,
        s.stock_quantidade,
        l.link_metadata,
        art.artigo_stocknegativo,
        art.artigo_nome
      order by case
          when s.stock_quantidade > 0 or art.artigo_stocknegativo then 1
          else 2
        end,
        art.artigo_nome
  ) select to_jsonb( a )
      from __artigo a;
end;
$$;

select format( '%%%s%%', 'Ola mundo' );


create or replace function tweeks.funct_pos_load_artigo_search( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      search_text:TXT,
      arg_espaco_auth
    }
   */
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _search_text character varying default args->>'search_text';
  _const map.constant;
begin
  _const := map.constant();
  return query with
    __ean as( select e.ean_artigo_id, array_agg( lower( e.ean_code ) ) as ean_code from tweeks.ean e where e.ean_estado = _const.maguita_ean_estado_ativo group by e.ean_artigo_id ),
    __artigo as (
    select
        c.classe_id,
        c.classe_nome,
        art.artigo_id,
        art.artigo_classe_id,
        art.artigo_nome,
        art.artigo_stocknegativo,
        art.artigo_estado,
        s.stock_quantidade,
        l.link_metadata,
        e.ean_code,
        count( di.dispoe_id ) as artigos_extras
      from tweeks.artigo art
        inner join tweeks.classe c on art.artigo_classe_id = c.classe_id
        inner join tweeks.link l on to_jsonb( art ) @> l.link_referencia
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_preco
          and l.link_espaco_destino = arg_espaco_auth
        inner join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) s on true
        left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
        left join __ean e on e.ean_artigo_id = art.artigo_id
      group by art.artigo_id,
        c.classe_id,
        s.stock_quantidade,
        l.link_metadata,
        art.artigo_stocknegativo,
        art.artigo_nome
      order by case
          when s.stock_quantidade > 0 or art.artigo_stocknegativo then 1
          else 2
        end,
        art.artigo_nome
  ) select to_jsonb( a )
      from __artigo a
      where lower( a.artigo_nome ) like lower( format( '%%%s%%', _search_text ) )
        or lower( a.ean_code ) like lower( format( '%%%s%%', _search_text ) )
  ;
end;
$$;


select a.artigo_stocknegativo
  from tweeks.artigo a
  where a.artigo_classe_id = (map.constant()).classe_itemextra;

update tweeks.artigo
  set artigo_stocknegativo = true
  where artigo_classe_id = (map.constant()).classe_itemextra
;


create or replace function tweeks.funct_pos_load_artigo_extras( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_artigo_id: UID,
      arg_espaco_auth: UID,
      arg_colaborador_id: UID
    }
   */
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
--   arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
--   arg_colaborador_id uuid not null default args->>'arg_colaborador_id';

    _const map.constant;

begin
  _const := map.constant();
  return query with __item as(
      select
          art.artigo_id,
          art.artigo_nome,
          l.link_metadata
        from tweeks.artigo art
          inner join tweeks.link l on to_jsonb( art ) @> l.link_referencia
            and l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_preco
        where art.artigo_classe_id = _const.classe_itemextra
          and art.artigo_estado = _const.artigo_estado_ativo
    ), __extras as(
      select it.*
        from tweeks.dispoe d
          inner join __item it on d.dispoe_artigo_item = it.artigo_id
        where d.dispoe_artigo_id = arg_artigo_id
    ) select to_jsonb( e ) from __extras e;
end;
$$;

select * from tweeks.funct_pos_load_artigo_extras('{"arg_artigo_id":"00000000-0000-0000-0000-000000000053"}');

select it.artigo_nome
  from tweeks.dispoe d
    inner join tweeks.artigo it on d.dispoe_artigo_item = it.artigo_id
    inner join tweeks.link l on to_jsonb( it ) @> l.link_referencia
      and l.link_estado = (map.constant()).maguita_link_estado_ativo
      and l.link_tlink_id = (map.constant()).maguita_tlink_preco
  where d.dispoe_artigo_id = '00000000-0000-0000-0000-000000000053'
  and d.dispoe_estado = (map.constant()).dispoe_estado_ativo
    and it.artigo_classe_id = (map.constant()).classe_itemextra
    and it.artigo_estado = (map.constant()).artigo_estado_ativo
;

