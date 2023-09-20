import {block} from "../../../core/updater";

block( module, { "identifier": "stock-calculator"}).sql`
create or replace function tweeks.__fluxo_stock( _artigo_uid uuid default null, _espaco_uid uuid default null, _classe_uid uuid default null, _branch uuid default null)
  returns table(
    espaco_id uuid,
    artigo_id uuid,
    stock_quantidade double precision
)
  language sql as $$
    with  __artigo as (
      select a.artigo_id
        from tweeks.artigo a
      where a.artigo_id = coalesce( _artigo_uid, a.artigo_id )
        and a.artigo_classe_id = coalesce( _classe_uid, a.artigo_classe_id )
        and a._branch_uid = coalesce( _branch, a._branch_uid )
        and not a.artigo_stocknegativo
    ), __espaco as (
      select e.espaco_id
        from tweeks.espaco e
        where e.espaco_id = coalesce( _espaco_uid, e.espaco_id )
          and e._branch_uid = coalesce( _branch, e._branch_uid )
    ), __fluxo as (
      select
          a.artigo_id,
          e.espaco_id,
          f.fluxo_id,
          f.fluxo_sequencia,
          f.fluxo_dataregistro,
          f.fluxo_quantidadefinal,
          f.fluxo_quantidadein,
          f.fluxo_quantidadeout,
          f.fluxo_artigo_in as artigo_in,
          f.fluxo_artigo_out as artigo_out,
          f.fluxo_espaco_out as espaco_out,
          f.fluxo_espaco_in as espaco_in,
          f.fluxo_checkpoint
        from tweeks.fluxo f
          inner join __espaco e on e.espaco_id  in ( f.fluxo_espaco_in, f.fluxo_espaco_out)
          inner join __artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
        where f._branch_uid = coalesce( _branch, f._branch_uid )
    ), __check_point as (
      select
          f.artigo_id,
          f.espaco_id,
          f.fluxo_id,
          f.fluxo_dataregistro,
          f.fluxo_quantidadefinal,
          rank() over ( partition by f.artigo_id, f.espaco_id order by f.fluxo_dataregistro desc , f.fluxo_sequencia desc ) as fluxo_rank
        from __fluxo f
        where f.fluxo_checkpoint = 0
    ), __sumary as (
      select
        f.artigo_id,
        f.espaco_id,
        coalesce(
            sum( f.fluxo_quantidadein ) filter ( where f.artigo_id = f.artigo_in and f.espaco_id = f.espaco_in ),
            0
        ) + coalesce( cp.fluxo_quantidadefinal, 0.0 ) as credito,
        coalesce(
            sum( f.fluxo_quantidadeout ) filter ( where f.artigo_id = f.artigo_out and f.espaco_id = f.espaco_out ),
            0
        ) + coalesce( cp.fluxo_quantidadefinal, 0.0 ) as debigo
      from __fluxo f
        left join __check_point cp on  f.artigo_id = cp.artigo_id
          and f.espaco_id = cp.espaco_id
          and cp.fluxo_rank = 1
        where (f.fluxo_dataregistro > cp.fluxo_dataregistro)
           or cp.fluxo_id is null
        group by
          f.artigo_id,
          f.espaco_id,
          cp.fluxo_quantidadefinal
    ) select
          s.espaco_id,
          s.artigo_id,
          s.credito - s.debigo as stock
        from __sumary s
    ;
  $$;
`;


block( module, { "identifier": "stock-admin"}).sql`
create function tweeks.funct_load_artigo(args jsonb) returns SETOF jsonb
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
          __stock as (
            select
                artigo_id as stock_artigo_id,
                espaco_id as stock_espaco_id,
                stock_quantidade as stock_quantidade
              from tweeks.__fluxo_stock(
                _branch := _branch,
                _espaco_uid := arg_espaco_auth,
                _classe_uid := arg_classe_id
              )
          ), __artigo as (
            select
                art.artigo_id,
                art.artigo_codigo,
                art.artigo_descricao,
                art.artigo_nome,
                art.artigo_compostoquantidade,
                art.artigo_artigo_id,

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
                left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
                left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
                  and l.link_referencia = rule.artigo_referencia( art.artigo_id )
                  and l.link_espaco_destino = any( arg_espaco_childs )
                  and l.link_tlink_id = _const.maguita_tlink_preco
                  and l._branch_uid = _branch
                left join __stock s on art.artigo_id = s.stock_artigo_id and s.stock_espaco_id = arg_espaco_auth
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

`;


block( module, { "identifier": "stock-pos"}).sql`
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
    
    with __stock as (
      select *
        from tweeks.__fluxo_stock(
          _classe_uid := arg_classe_id,
          _branch := _branch
        )
    ), __artigo as (
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
        inner join tweeks.link l on art.artigo_id =(  l.link_referencia->>'artigo_id' )::uuid
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_preco
          and l.link_espaco_destino = arg_espaco_auth
        left join __stock s on art.artigo_id = s.artigo_id and s.espaco_id = arg_espaco_auth
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
`;


block( module, { identifier: "stock-class"}).sql`
create or replace function tweeks.funct_pos_load_class(args jsonb) returns SETOF jsonb
    language plpgsql
as
$$
declare
  /**
    args := {
      arg_espaco_auth: UID,
      arg_colaborador_id: UID
    }
   */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  _branch uuid not null default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
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
          inner join tweeks.link lcla on c.classe_id = (lcla.link_referencia->>'classe_id')::uuid
            and lcla.link_estado = _const.maguita_link_estado_ativo
          inner join tweeks.artigo art on c.classe_id = art.artigo_classe_id
            and art.artigo_estado = _const.artigo_estado_ativo
          inner join tweeks.link lart on art.artigo_id = ( lart.link_referencia->>'artigo_id' )::uuid
            and lart.link_estado = _const.maguita_link_estado_ativo
--             and lart.link_espaco_destino = artigo_espaco_auth
        where lcla.link_espaco_destino = arg_espaco_auth
          and lcla.link_tlink_id = _const.maguita_tlink_classe
          and c._branch_uid = _branch
          and art._branch_uid = _branch
          and lcla._branch_uid = c._branch_uid
          and lart._branch_uid = c._branch_uid
        group by c.classe_id
    ) select  to_jsonb( c )
      from __classe c;
end;
$$;
`;



block( module, {  identifier: "funct-load-class"} ).sql`
create or replace function tweeks.funct_load_classe(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função serve para carregar as listas de classes ativas
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    with
      __espaco as ( select e.espaco_id, e.espaco_nome from tweeks.espaco e),
      __links as (
        select
            l.link_referencia,
            l.link_espaco_destino,
            array_agg( to_jsonb( e ) ) as espacos
          from  __espaco e
            inner join tweeks.link l on e.espaco_id = l.link_espaco_destino
          where l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_classe
          group by l.link_referencia,
            l.link_espaco_destino

        ),
      __classe as (
        select
            cla.classe_id,
            cla.classe_classe_id,
            cla.classe_nome,
            cla.classe_foto,
            cla.classe_position,
            jsonb_build_object(
              'total', count( distinct atr.artigo_id ),
              'ativos', count( distinct atr.artigo_id ) filter ( where atr.artigo_estado = _const.artigo_estado_ativo )
            ) as artigos,
            coalesce( l.espacos, array[]::jsonb[] ) as classe_espacos

        from tweeks.classe cla
          left join __links l on ( l.link_referencia->>'classe_id' )::uuid = cla.classe_id
          left join tweeks.artigo atr on cla.classe_id = atr.artigo_classe_id
        where cla.classe_estado = _const.classe_estado_ativo
          and ( 
            cla.classe_espaco_auth = any( arg_espaco_child )
              or l.link_espaco_destino = any( arg_espaco_child )
              or cla.classe_id = _const.classe_itemextra
          )
        group by cla.classe_id, cla.classe_nome, l.espacos
        order by
          case
            when cla.classe_id != _const.classe_itemextra then 1
            else 2
          end,
          cla.classe_nome
      ) select to_jsonb( c )
          from __classe c
    ;
end;
$$;
`;


block( module, { "identifier":"funct_pos_load_artigo_search" } ).sql`
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
  
  _search_text := lib.str_nospace( lower( public.unaccent( _search_text ) ) );
  _search_text_like := format( '%s%s%s', '%', _search_text, '%' );

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
      where
        lower( public.unaccent( a.artigo_nome ) )  like _search_text_like
          or lower( public.unaccent( a.artigo_codigo ) )  like _search_text_like
          or  _search_text = any ( a.ean_code )
  ;
end
$$;
`;



block( module, { "identifier": "funct_load_conta_dia"}).sql`
create or replace function tweeks.funct_pos_load_conta_dia(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /** Essa função serve para devolver as compras do dia em uma data especifica
      filter := {
        arg_conta_data: DATE
        arg_posto_id: DATE
      }
     */
    _const map.constant;
    arg_conta_data date default filter->>'arg_conta_data';
    arg_posto_id uuid not null default filter->>'arg_posto_id';
begin

    _const := map.constant();
    arg_conta_data := coalesce( arg_conta_data, current_date );

    if arg_conta_data < current_date - make_interval( days := 7 ) then return; end if;

    return query
        with __conta as (
            select
                ct.conta_id,
                ct.conta_data,
                ct.conta_dataregistro,
                ct.conta_titular,
                ct.conta_titularnif,
                ct.conta_montante,
                ct.conta_numerofatura,
                ct.conta_numero,
                p.posto_designacao,
                p.posto_matricula,
                de.deposito_montante,
                de.deposito_montantemoeda,
                de.deposito_montantetroco,
                de.deposito_montantefinal,
                de.deposito_taxacambio,
                cu.currency_id,
                cu.currency_code,
                cu.currency_name,
                co.colaborador_id,
                co.colaborador_nome
            from tweeks.conta ct
                     inner join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
                     inner join tweeks.deposito de on ( de.deposito_referencia->>'conta_id' )::uuid = ct.conta_id
                     inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
                     inner join auth.colaborador co on ct.conta_colaborador_fecho = co.colaborador_id
            where ct.conta_posto_fecho = arg_posto_id
              and ct.conta_estado = _const.maguita_conta_estado_fechado
              and ct._tgrupo_id = _const.maguita_tgrupo_cnormal
              and ct.conta_datafecho::date = arg_conta_data
        ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
$$;
`;

block( module, { identifier: "tweeks.__artigo_has_stock" }).sql`
create or replace function tweeks.__artigo_has_stock(
    arg_artigo_id uuid,
    arg_espaco_id uuid,
    arg_quantidadedebito double precision
) returns boolean
    language plpgsql
as
$$
declare
    /** Essa função serve para verificar se existe diponibilidade de um artig em um stock para cobrir uma quantidade de debito
     */
    _artigo tweeks.artigo;
    _stock record;
begin
    _artigo := tweeks._get_artigo( arg_artigo_id );

    -- Aceitar sempre que o artigo for do tipo staock negativo
    if _artigo.artigo_stocknegativo then return true; end if;

    select *
      from tweeks._get_stock( arg_artigo_id, arg_espaco_id )
      into _stock
    ;
    
    return _stock.stock_quantidade >= arg_quantidadedebito;
end;
$$;

`;