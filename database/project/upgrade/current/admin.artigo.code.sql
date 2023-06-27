drop function if exists tweeks.funct_load_artigo_by_code( args jsonb );

drop function if exists tweeks.funct_load_artigo(args jsonb );
create or replace function tweeks.funct_load_artigo(args jsonb)
returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**
        Essa função serve para carregar os artigos registrado
        args := {
          arg_espaco_auth: ID
          arg_colaborador_id: ID
          arg_classe_id: ID
          arg_artigo_estado: ARTIGO_ESTADO
          query: {
            any?: CODE|NAME|DESCRICAO
            code?: CODE
            name?: NAME
            desc?: DESCRICAO
          }
        }
   */
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_childs uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
    arg_classe_id uuid default args->>'arg_classe_id';
    arg_artigo_estado int2 default args->>'arg_artigo_estado';

    _query_any text default lower( args->'query'->>'any' );
    _query_code text default lower( args->'query'->>'code' );
    _query_name text default lower( args->'query'->>'name' );
    _query_desc text default lower( args->'query'->>'desc' );
    _const map.constant;
    _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
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
                art.artigo_codigo,
                art.artigo_descricao,
                art.artigo_nome,
                art.artigo_compostoquantidade,
                art.artigo_artigo_id,

                art.artigo_espaco_auth = any( arg_espaco_childs ) as artigo_owner,
                s.stock_quantidade,
                art.artigo_foto,
                art.artigo_espaco_auth,
                art.artigo_classe_id,
                art.artigo_estado,
                art.artigo_stocknegativo,
                origin.artigo_id as origin_id,
                origin.artigo_codigo as origin_codigo,
                origin.artigo_descricao as orign_descricao,
                origin.artigo_nome as origin_nome,
                origin.artigo_compostoquantidade as orign_compostoquantidade,
                origin.artigo_artigo_id as origin_origin_id,

                coalesce( array_agg( l.link_espaco_destino ) filter ( where l.link_id is not null ), array[]::uuid[] )  as links,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_custo' as precario_custo,
                ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'precario_quantidade' as precario_quantidade,
                ( ( lib.first( l.link_metadata ) filter ( where l.link_espaco_destino = arg_espaco_auth ) )->>'stock_minimo' )::double precision as link_stockminimo
              from tweeks.artigo art
                left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
                left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
                  and l.link_referencia = rule.artigo_referencia( art.artigo_id )
                  and l.link_espaco_destino = any( arg_espaco_childs )
                  and l.link_tlink_id = _const.maguita_tlink_preco
                  and l._branch_uid = _branch
                left join lateral tweeks._get_stock( art.artigo_id, arg_espaco_auth ) s on s.stock_artigo_id = art.artigo_id
              where art._branch_uid = _branch
              group by art.artigo_id,
                 origin.artigo_id,
                s.stock_quantidade
          ), __filter as (
            select *,
                coalesce( art.link_stockminimo ) as stock_minimo
              from __artigo art
              where ( coalesce( art.links, array[]::uuid[] )||art.artigo_espaco_auth ) && arg_espaco_childs
                and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
                and art.artigo_estado = coalesce( arg_artigo_estado, art.artigo_estado )
         ), __filter_query as (
            select *
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
           ), __query as (
             select *
                from __filter_query _f
                where true
                  and lower( _f.artigo_codigo ) = lower( coalesce( _query_code, _f.artigo_codigo ) )
                  and lower( _f.artigo_nome ) like lower( format( '%%%s%%', coalesce( _query_name, _f.artigo_nome ) ) )
                  and lower( coalesce( _f.artigo_descricao, '' ) ) like lower( format( '%%%s%%', coalesce( _query_desc, _f.artigo_descricao ) ) )
                  and (
                    lower( _f.artigo_codigo ) = lower( coalesce( _query_any, _f.artigo_codigo ) )
                    or lower( _f.artigo_nome) like lower( format( '%%%s%%', coalesce( _query_any, _f.artigo_nome ) ) )
                    or lower( coalesce( _f.artigo_descricao, '' ) ) like lower( format( '%%%s%%', coalesce( _query_any, _f.artigo_descricao, '' ) ))
                  )
          ) select to_jsonb( _q ) - 'links'
              from __query _q
    ;
end
$$;