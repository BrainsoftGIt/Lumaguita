import {block} from "../../../core/updater";

block( module, { identifier: "lumaguita_path_01", flags: ["@unique" ]}).sql`
    drop table if exists tweeks.stock;
    drop view if exists tweeks.stock;
`


block( module, { identifier: "lumaguita_path_02", flags: ["@unique" ]}).sql`
create or replace view tweeks.stock as
  with __stock_in as (
    select f.fluxo_espaco_in, f.fluxo_artigo_in, coalesce( sum( f.fluxo_quantidadein ), 0 ) as entrada_quantidade, count(*) as entradas
      from tweeks.fluxo f
      group by f.fluxo_artigo_in,
        f.fluxo_espaco_in
  ), __stock_out as(
    select f.fluxo_artigo_out, f.fluxo_espaco_out, coalesce( sum( f.fluxo_quantidadeout ), 0 ) saida_quantidade, count(*) as saidas
      from tweeks.fluxo f
      group by f.fluxo_artigo_out,
        f.fluxo_espaco_out
  ), __armazems as (
    select distinct
        e.espaco_id,
        a.artigo_id
      from tweeks.espaco e
        inner join tweeks.artigo a on e._branch_uid = a._branch_uid
  ),  __stock as (
    select _a.*,
           si.*,
           so.*,
           coalesce( coalesce( si.entrada_quantidade, 0 ) - coalesce( so.saida_quantidade,  0 ), 0 ) as stock_quantidade
      from __armazems _a
        left join __stock_in si on _a.espaco_id = si.fluxo_espaco_in
          and _a.artigo_id = si.fluxo_artigo_in
        left join __stock_out so on _a.espaco_id = so.fluxo_espaco_out
          and _a.artigo_id = so.fluxo_artigo_out
  )
  select * from __stock; `

block( module, { identifier: "lumaguita_path_03", flags: []}).sql`
create or replace function tweeks._get_stock( _artigo_id uuid, _espaco_id uuid)
  returns TABLE(stock_artigo_id uuid, stock_espaco_id uuid, stock_quantidade double precision)
  strict
  language sql
as
$$
  select s.artigo_id, s.espaco_id, sum( s.stock_quantidade )::double precision
    from tweeks.stock s
    where s.artigo_id = coalesce( _artigo_id, s.artigo_id )
      and s.espaco_id = coalesce( _espaco_id, s.espaco_id)
    group by s.artigo_id, s.espaco_id;
$$;
`;

block( module, { identifier: "lumaguita_path_04", flags: []}).sql`
create or replace function tweeks.funct_load_artigo(args jsonb) returns SETOF jsonb
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

    _query_any text  default lower( args->'query'->>'any' );
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
                left join tweeks.stock s on art.artigo_id = s.artigo_id and s.espaco_id = arg_espaco_auth
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

create or replace function tweeks.funct_pos_load_artigo(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
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
        art.artigo_foto,
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
        inner join tweeks.stock s on art.artigo_id = s.artigo_id and s.espaco_id = arg_espaco_auth
        left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
      where art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
      group by art.artigo_id,
        s.stock_quantidade,
        l.link_metadata,
        art.artigo_stocknegativo,
        art.artigo_nome,
        art.artigo_foto
      order by case
          when s.stock_quantidade > 0 or art.artigo_stocknegativo then 1
          else 2
        end,
        art.artigo_nome
  ) select to_jsonb( a ) from __artigo a;
end;
$$;


create or replace function tweeks.funct_pos_load_artigo_search(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
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
  ___branch uuid;
begin
  ___branch := tweeks.__branch_uid( null, arg_espaco_auth );

  _const := map.constant();
  return query with
    __ean as( select e.ean_artigo_id, array_agg( e.ean_code ) as ean_code from tweeks.ean e where e.ean_estado = _const.maguita_ean_estado_ativo group by e.ean_artigo_id ),
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
        inner join tweeks.stock s on s.artigo_id = art.artigo_id
          and s.espaco_id = arg_espaco_auth
        left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
        left join __ean e on e.ean_artigo_id = art.artigo_id
      where art._branch_uid = ___branch
      group by art.artigo_id,
        c.classe_id,
        s.stock_quantidade,
        l.link_metadata,
        art.artigo_stocknegativo,
        art.artigo_nome,
        e.ean_code
      order by case
          when s.stock_quantidade > 0 or art.artigo_stocknegativo then 1
          else 2
        end,
        art.artigo_nome
  ) select to_jsonb( a )
      from __artigo a
      where lower( a.artigo_nome ) like lower( format( '%%%s%%', _search_text ) )
        or  _search_text = any ( a.ean_code )
  ;
end;
$$;


drop function if exists funct_pos_load_caixa_auaaath(args jsonb);
drop function if exists tweeks.funct_load_artigo_composto(filter jsonb);

-- create or replace function tweeks.funct_load_artigo_composto(filter jsonb) returns SETOF jsonb
--   language plpgsql
-- as
-- $$
--
-- declare
--
--     /**
--       Essa função serve para carregar os artigos registrado
--       filter := {
--         arg_espaco_auth: ID
--         arg_classe_id: ID
--         arg_artigo_estado: ARTIGO_ESTADO
--       }
--      */
--
--     arg_artigo_retalho uuid default filter ->>'arg_artigo_retalho';
--     arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
--     arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
--     _const map.constant;
-- begin
--     _const := map.constant();
--
--     return query
--         with associacao as (
--             select
--                 ls.link_referencia,
--                 sum( (st::tweeks.stock).stock_quantidade ) as associacao_stock_quantidade,
--                 jsonb_agg( lib.jsonb_values(
--                         to_jsonb( esp ) || to_jsonb( st ),
--                         'espaco_id',
--                         'espaco_nome',
--                         'stock_id',
--                         'stock_quantidade'
--                     )
--                 ) as links
--             from tweeks.link ls
--                      inner join tweeks.espaco esp on ls.link_espaco_destino = esp.espaco_id
--                      inner join tweeks._get_stock( ( ls.link_referencia->>'artigo_id')::uuid, esp.espaco_id ) st on esp.espaco_id = (st::tweeks.stock).stock_espacao_id
--             where ls.link_tlink_id = _const.tlink_associacao
--               and ls.link_estado = _const.link_estado_associacao
--               and ( ls.link_espaco_auth = any( arg_espaco_child ) or ls.link_espaco_destino = any( arg_espaco_child ) )
--             group by ls.link_referencia
--         ),  artigo_espaco as (
--             select
--                 art.*,
--                 ass.associacao_stock_quantidade as artigo_stock,
--                 coalesce( ass.links, jsonb_build_array() ) as links
--             from tweeks.artigo art
--                      left join associacao ass on ass.link_referencia @> jsonb_build_object( 'artigo_id', art.artigo_id )
--             where art.artigo_artigo_id = arg_artigo_retalho
--               and ( art.artigo_espaco_auth = any( arg_espaco_child ) or ass.link_referencia is not null )
--             order by
--                 art.artigo_nome
--         ) select lib.jsonb_values(
--                          ae,
--                          'artigo_id',
--                          'artigo_codigo',
--                          'artigo_nome',
--                          'artigo_foto',
--                          'artigo_stock',
--                          'artigo_descricao',
--                          'artigo_estado',
--                          'classe_id',
--                          'classe_nome',
--                          'links',
--                          'artigo_compostomultiplo'
--                      )
--         from artigo_espaco ae;
-- end;
-- $$;


drop function if exists tweeks.funct_load_artigo_link(filter jsonb);
/*
 create or replace function tweeks.funct_load_artigo_link(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função serve para devolver a lista dos artigos na link
    args := {
      arg_link_id: ID,
      arg_espaco_auth: ID,
      arg_colaborador_id: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_link_id uuid not null default filter->>'arg_link_id';

  _const map.constant;

begin
  _const := map.constant();

  return query
    with artigo_item as (
      select
        a.*,
        art.*,
        st.stock_id,
        st.stock_quantidade,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( it ),
            'artigo_id', 'item_id',
            'artigo_nome', 'item_nome',
            'artigo_quantidadecusto', 'item_quantidadecusto',
            'artigo_custo', 'item_custo',
            'artigo_descricao', 'item_descricao',
            'artigo_stock', 'item_stock'
          )
          order by  it.artigo_nome
        ) filter ( where it.artigo_id is not null ) as artigo_items

      from tweeks.link a
        left join tweeks.artigo art on a.link_artigo_id = art.artigo_id
          and art.artigo_estado = _const.artigo_estado_ativo
        left join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) st on art.artigo_id = st.stock_artigo_id
          and st.stock_estado = _const.stock_estado_ativo
          and ( st.stock_quantidade > 0 or art.artigo_stocknegativo )
          and st.stock_espacao_id = arg_espaco_auth
        left join tweeks.dispoe disp on art.artigo_id = disp.dispoe_artigo_id
          and disp.dispoe_estado = _const.dispoe_estado_ativo
        left join tweeks.artigo it on disp.dispoe_artigo_item = it.artigo_id
          and it.artigo_estado = _const.artigo_estado_ativo

      where a.link_espaco_destino = arg_espaco_auth
        and coalesce( a.link_link_id, -1 ) = coalesce( arg_link_id, -1 )
        and a.link_estado = _const.link_estado_ativo

      group by
        art.artigo_id,
        st.stock_id,
        st.stock_quantidade

      order by a.link_posicao
    ), class as (
      select
        cla.*,
        jsonb_agg( to_jsonb( ai ) order by ai.link_posicao, ai.artigo_nome ) as calsse_artigos
      from tweeks.classe cla
        inner join artigo_item ai on cla.classe_id = ai.artigo_classe_id
      where cla.classe_estado = _const.classe_estado_ativo
        and cla.classe_id != _const.classe_itemextra
      group by cla.classe_id
      order by cla.classe_nome
    )
    select lib.jsonb_values(
      cl,
      'classe_id',
      'classe_nome',
      'classe_estado',
      'classe_dataregistro',
      'classe_dataatualizacao',
      'calsse_artigos'
    )
      from class cl
  ;
end;
$$;
 */


drop function if exists tweeks.funct_load_artigo_tecla(filter jsonb);

 /*
  create or replace function tweeks.funct_load_artigo_tecla(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função serve para caregar os artigos pelas sua categoria
    filter := {
      arg_espaco_auth: ID,
      arg_link_id: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_link_id uuid not null default filter->>'arg_link_id';
  _const  map.constant;
begin
  _const := map.constant();
  return query
    with items as (
      select
        di.dispoe_artigo_id,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( art ),
              'artigo_id', 'item_id',
              'artigo_nome', 'item_nome',
              'artigo_quantidadecusto', 'item_quantidadecusto',
              'artigo_custo', 'item_custo',
              'artigo_descricao', 'item_descricao',
              'artigo_stock', 'item_stock'
            )
          ) artigo_items
      from tweeks.dispoe di
             inner join tweeks.artigo art on di.dispoe_artigo_item = art.artigo_id
      where di.dispoe_estado = _const.dispoe_estado_ativo
        and art.artigo_estado = _const.artigo_estado_ativo
      group by di.dispoe_artigo_id

    ), artigo_item as (
      select
        art.*,
        st.stock_id,
        st.stock_quantidade,
        coalesce( its.artigo_items, jsonb_build_array() ) as artigo_items
      from tweeks.artigo art
        inner join tweeks.link ls on art.artigo_id = ls.link_artigo_id
          and ls.link_espaco_destino = arg_espaco_auth
          and ls.link_estado = _const.link_estado_associacao
          and ls.link_tlink_id = _const.tlink_associacao
        inner join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) st on art.artigo_id = st.stock_artigo_id
          and st.stock_estado = _const.stock_estado_ativo
        left join items its on art.artigo_id = its.dispoe_artigo_id

      where art.artigo_estado = _const.artigo_estado_ativo
        and ( st.stock_quantidade > 0 or art.artigo_stocknegativo )
        and st.stock_espacao_id = arg_espaco_auth
    ), teclas as (
      select
          l.*,
          tl.*,
          case
            when tl.tlink_id = _const.tlink_artigo then lib.jsonb_values(
              ai,
              'artigo_id',
              'artigo_codigo',
              'artigo_nome',
              'artigo_custo',
              'artigo_quantidadecusto',
              'artigo_preparacao',
              'artigo_foto',
              'artigo_descricao',
              'artigo_stock',
              'artigo_stocknegativo',
              'artigo_stockminimo',
              'artigo_items'
            )
          end as artigo
        from tweeks.link l
          inner join tweeks.tlink tl on l.link_tlink_id = tl.tlink_id
          left join artigo_item ai on l.link_artigo_id = ai.artigo_id
        where l.link_estado = _const.link_estado_ativo
          and coalesce( l.link_link_id, -1 ) = coalesce( arg_link_id, -1 )
          and l.link_espaco_destino = arg_espaco_auth
    )
    select lib.jsonb_values(
      tc,
      'link_id',
      'link_posicao',
      'link_nome',
      'link_custo',
      'link_config',
      'link_quantidadecusto',
      'link_estado',
      'tlink_id',
      'tlink_designacao',
      'artigo'
      )
      from teclas tc
  ;
end;
$$;
  */

`;