drop function tweeks.funct_load_artigo( jsonb );
drop function tweeks.funct_load_item_for_artigo(filter jsonb);

create or replace function tweeks.funct_load_artigo( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
    /**
        Essa função serve para carregar os artigos registrado
        filter := {
          arg_espaco_auth: ID
          arg_classe_id: ID
          arg_artigo_estado: ARTIGO_ESTADO
        }
   */
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    arg_espaco_childs uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
    arg_classe_id uuid default args->>'arg_classe_id';
    arg_artigo_estado int2 default args->>'arg_artigo_estado';
    _const map.constant;
begin
    _const := map.constant();

    /**
      ID, NOME, STOCK, PRECO, [STOK-MINIMO], FOTO
     */
    return query
        with
          __artigo as (
            select
                art.artigo_id,
                art.artigo_nome,
                art.artigo_espaco_auth = any( arg_espaco_childs ) as artigo_owner,
                s.stock_quantidade,
                art.artigo_foto,
                art.artigo_espaco_auth,
                art.artigo_classe_id,
                art.artigo_estado,
                coalesce( array_agg( l.link_espaco_destino ) filter ( where l.link_id is not null ), array[]::uuid[] )  as links,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_custo' as precario_custo,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_quantidade' as precario_quantidade,
                ( ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'stock_minimo' )::double precision as link_stockminimo
              from tweeks.artigo art
                left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
                  and l.link_referencia = rule.artigo_referencia( art.artigo_id )
                  and l.link_espaco_destino = any( arg_espaco_childs )
                  and l.link_tlink_id = _const.maguita_tlink_preco
                left join lateral tweeks._get_stock( art.artigo_id, arg_espaco_auth ) s on s.stock_artigo_id = art.artigo_id
              group by art.artigo_id,
                s.stock_quantidade
          ), __filter as (
            select *,
                coalesce( art.link_stockminimo ) as stock_minimo
              from __artigo art
              where ( coalesce( art.links, array[]::uuid[] )||art.artigo_espaco_auth ) && arg_espaco_childs
                and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
                and art.artigo_estado = coalesce( arg_artigo_estado, art.artigo_estado )
         ) select to_jsonb( f ) - 'links'
            from __filter f
            where arg_classe_id is not null or f.artigo_classe_id != _const.classe_itemextra
            order by
              case
                when f.artigo_estado = _const.artigo_estado_ativo then 1
                else 2
              end,
              case
                when f.artigo_espaco_auth = arg_espaco_auth then 1
                when f.artigo_espaco_auth = any( arg_espaco_childs ) then 2
                else 3
              end,
              case
                when stock_quantidade < f.stock_minimo then 1
                when stock_quantidade = f.stock_minimo then 2
                else 3
               end,
               f.artigo_nome
    ;
end
$$;


drop function if exists tweeks.funct_load_artigo_data(filter jsonb);
create or replace function tweeks.funct_load_artigo_data( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_espaco_auth: UUDI,
      arg_colaborador_id: UUID,
      artigos:[
        UUID, UUID, UUID
      ]
    }
   */
  arg_espaco_auth uuid not null default args ->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args ->>'arg_colaborador_id';
  artigos uuid[] default array( select e.text::uuid from jsonb_array_elements_text( args->'artigos' ) e( text ));
  _const map.constant;
begin
  _const := map.constant();

  return query
    with
      __extras as (
        select
            d.dispoe_artigo_id,
            array_agg( to_jsonb( d ) || jsonb_build_object( 'artigo_nome', art.artigo_nome) ) as extras
          from tweeks.dispoe d
            inner join tweeks.artigo art on d.dispoe_artigo_item = art.artigo_id
          where d.dispoe_artigo_id = any( artigos )
            and d.dispoe_estado = _const.dispoe_estado_ativo
          group by d.dispoe_artigo_id
      ), __eans as (
        select
            e.ean_artigo_id,
            array_agg( to_jsonb( e ) ) as eans
          from tweeks.ean e
          where e.ean_artigo_id = any( artigos )
            and e.ean_estado = _const.maguita_ean_estado_ativo
          group by e.ean_artigo_id
    ), __links as (
      select
          art.artigo_id,
          array_agg( to_jsonb( l ) )  as links
        from tweeks.link l
          inner join tweeks.artigo art on  l.link_referencia @> lib.sets_ref( art )
        where l.link_tlink_id = _const.maguita_tlink_preco
          and art.artigo_id = any( artigos )
          and l.link_estado = _const.maguita_link_estado_ativo
        group by art.artigo_id
    ), __impostos as (
      select
          ip.imposto_artigo_id,
          array_agg( to_jsonb( ip ) ) as impostos
        from tweeks.imposto ip
        where ip.imposto_artigo_id = any( artigos )
          and ip.imposto_estado = _const.maguita_imposto_estado_ativo
        group by ip.imposto_artigo_id
    ), __artigos as (
        select art.*, cla.*, to_jsonb( a ) as artigo_base
          from tweeks.artigo art
            left join tweeks.artigo a on art.artigo_artigo_id = a.artigo_id
            left join tweeks.classe cla on art.artigo_classe_id = cla.classe_id
          where art.artigo_id = any( artigos )
    ), __exports as (
      select
          e.extras,
          ea.eans,
          l.links,
          ip.impostos,
          a.*
        from __artigos a
          left join __extras e on a.artigo_id = e.dispoe_artigo_id
          left join __eans ea on a.artigo_id = ea.ean_artigo_id
          left join __links l on a.artigo_id = l.artigo_id
          left join __impostos ip on a.artigo_id = ip.imposto_artigo_id
    ) select to_jsonb( exp )
      from __exports exp
    ;
end
$$;