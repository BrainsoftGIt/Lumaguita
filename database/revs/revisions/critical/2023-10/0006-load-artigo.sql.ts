import {sql} from "kitres";

export const funct_pos_load_artigo_search = sql`
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
  _search_text_like character varying;
  _const map.constant;
  ___branch uuid;
begin
  ___branch := tweeks.__branch_uid( null, arg_espaco_auth );
  
  _search_text := lib.str_normalize( lower( public.unaccent( _search_text ) ) );
  _search_text_like := format( '%s%s%s', '%', _search_text, '%' );

  _const := map.constant();
  return query with
    __ean as( select e.ean_artigo_id, array_agg( e.ean_code ) as ean_code from tweeks.ean e where e.ean_estado = _const.maguita_ean_estado_ativo group by e.ean_artigo_id ),
    __artigo as (
    select
        c.classe_id,
        c.classe_nome,
        u.unit_id,
        u.unit_code,
        u.unit_name,
        art.artigo_id,
        art.artigo_classe_id,
        art.artigo_nome,
        art.artigo_codigo,
        art.artigo_stocknegativo,
        art.artigo_estado,
        s.stock_quantidade,
        l.link_metadata,
        e.ean_code,
        count( di.dispoe_id ) as artigos_extras
      from tweeks.artigo art
        inner join tweeks.classe c on art.artigo_classe_id = c.classe_id
        inner join tweeks.link l on art.artigo_id =  ( l.link_referencia->>'artigo_id' )::uuid
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_preco
          and l.link_espaco_destino = arg_espaco_auth
        left join tweeks.stock s on s.artigo_id = art.artigo_id
          and s.espaco_id = arg_espaco_auth
          and s._branch_uid = ___branch
        left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
        left join __ean e on e.ean_artigo_id = art.artigo_id
        left join tweeks.unit u on art.artigo_unit_id = u.unit_id

    where art._branch_uid = ___branch
      group by art.artigo_id,
        c.classe_id,
        
        u.unit_id,
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
      where
        lower( public.unaccent( a.artigo_nome ) )  like _search_text_like
          or lower( public.unaccent( a.artigo_codigo ) )  like _search_text_like
          or  _search_text = any ( a.ean_code )
  ;
end

$$;
`;


export const funct_pos_load_artigo = sql`
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
  _branch uuid not null default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();
  return query
    with __artigo as (
      select
          art.artigo_id,
          art.artigo_classe_id,
          art.artigo_nome,
          art.artigo_foto,
          art.artigo_stocknegativo,
          art.artigo_estado,
          s.stock_quantidade,
          l.link_metadata,
          u.unit_id,
          u.unit_code,
          u.unit_name,
          count( di.dispoe_id ) as artigos_extras
        from tweeks.artigo art
          inner join tweeks.link l on art.artigo_id =(  l.link_referencia->>'artigo_id' )::uuid
            and l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_preco
            and l.link_espaco_destino = arg_espaco_auth
          left join tweeks.stock s on art.artigo_id = s.artigo_id 
            and s.espaco_id = arg_espaco_auth
            and s._branch_uid = _branch
          left join tweeks.dispoe di on art.artigo_id = di.dispoe_artigo_id
            and di.dispoe_estado = _const.dispoe_estado_ativo
          left join tweeks.unit u on art.artigo_unit_id = u.unit_id
      
      where art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
        group by art.artigo_id,
          s.stock_quantidade,
          l.link_metadata,
          art.artigo_stocknegativo,
          art.artigo_nome,
          art.artigo_foto,
          u.unit_id
        order by case
            when s.stock_quantidade > 0 or art.artigo_stocknegativo then 1
            else 2
          end,
          art.artigo_nome
  ) select to_jsonb( a ) from __artigo a;
end;
$$;
`;

export const funct_load_artigo_admim = sql`
create or replace function tweeks.funct_load_artigo( args jsonb ) returns SETOF jsonb
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
                u.unit_id,
                u.unit_code,
                u.unit_name,
                
                uorig.unit_id as unit_originid,
                uorig.unit_code as unit_origncode,
                uorig.unit_name as unit_origenname,

                art.artigo_espaco_auth = any( arg_espaco_childs ) as artigo_owner,
                coalesce( s.stock_quantidade, 0 ) as stock_quantidade,
                art.artigo_foto,
                art.artigo_espaco_auth,
                art.artigo_classe_id,
                art.artigo_estado,
                art.artigo_stocknegativo,
                art.artigo_codigoimposto,
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
                left join tweeks.unit u on art.artigo_unit_id = u.unit_id
                left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
                left join tweeks.unit uorig on origin.artigo_unit_id = uorig.unit_id
                left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
                  and l.link_referencia = rule.artigo_referencia( art.artigo_id )
                  and l.link_espaco_destino = any( arg_espaco_childs )
                  and l.link_tlink_id = _const.maguita_tlink_preco
                  and l._branch_uid = _branch
                left join tweeks.stock s on art.artigo_id = s.artigo_id
                  and s.espaco_id = arg_espaco_auth
                  and s._branch_uid = _branch
              where art._branch_uid = _branch
              group by 
                art.artigo_id,
                u.unit_id,
                uorig.unit_id,
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
`;


export const funct_load_stoks = sql`
create or replace function tweeks.funct_load_stoks(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
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
            coalesce( s.stock_quantidade, 0 ),
            n.index
          from tweeks.artigo art
            inner join tweeks.espaco e on e.espaco_id = coalesce( arg_espaco_destino, e.espaco_id )
            left join tweeks._get_stock( art.artigo_id, arg_espaco_destino ) s on art.artigo_id = s.stock_artigo_id
            left join unnest( arg_artigos ) with ordinality n( id, index ) on art.artigo_id = n.id
          where art.artigo_id = any( coalesce( arg_artigos, array[]::uuid[] ) )

    ) select to_jsonb( s )
      from __stoks s
      order by s.index
      ;
end;
$$;
`;


export const _get_stock = sql`
create or replace function tweeks._get_stock(_artigo_id uuid, _espaco_id uuid)
  returns TABLE(stock_artigo_id uuid, stock_espaco_id uuid, stock_quantidade double precision)
  strict
  language sql
as
$$
  with __value ( one) as (
    values ( 1 )
  )
  select
      coalesce( s.artigo_id, _artigo_id ) as artigo_id,
      coalesce( s.espaco_id, _espaco_id ) as espaco_id,
      coalesce( sum( s.stock_quantidade )::double precision, 0 )
    from __value 
      left join tweeks.stock s on s.artigo_id = coalesce( _artigo_id, s.artigo_id )
        and s.espaco_id = coalesce( _espaco_id, s.espaco_id)
    group by s.artigo_id, s.espaco_id;
$$;
`;


export const funct_reg_acerto = sql`
create or replace function tweeks.funct_reg_acerto(args jsonb) returns lib.result
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
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();

  for _data in
    select
        (e.doc->>'artigo_id')::uuid as artigo_id,
        (e.doc->>'acerto_quantidade')::double precision as acerto_quantidade
      from jsonb_array_elements( args->'arg_acerto' ) e( doc )
  loop

    select 
        stock_quantidade,
        stock_artigo_id,
        stock_espaco_id
      from tweeks._get_stock( _data.artigo_id, arg_espaco_id )
      into _stock;
    arg_acerto_corecao := _stock.stock_quantidade - _data.acerto_quantidade;
    _acerto_group := public.uuid_generate_v4();
    _new.acerto_codigo := tweeks.__generate_acerto_code( ___branch );
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

  return  lib.result_true( acertos );
end;
$$;
`;