import {patchSQL, sql} from "kitres";

export const funct_load_artigo = sql`
create or replace function tweeks.funct_load_artigo( args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**doc
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
   doc*/
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
                  and ( l.link_referencia->>'artigo_id' )::uuid = art.artigo_id
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
            select *,
              format( '%s %s %s', f.artigo_codigo, f.artigo_nome, f.artigo_descricao ) as _search_term
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


export const funct_reg_artigo = sql`
create or replace function tweeks.funct_reg_artigo(args jsonb)
  returns lib.result
  language plpgsql
as
$$
declare
    /**
      Essa funçao serve para registar os artigos associado aos seus item extras
      {
        ///PARA-QUANDO-FOR-COMPOSTO
            artigo_artigo_id: ID
            artigo_compostoquantidade:DOUBLE
        PARA-QUANDO-FOR-COMPOSTO//

        artigo_classe_id: ID,
        artigo_codigo: CODIGO,
        artigo_nome: NOME,
        artigo_preparacao: TRUE|FALSE,
        artigo_stocknegativo: TRUE|FALSE,
        artigo_foto: FOTO,
        artigo_descricao: DESCRICAO,

        --
        artigo_id: ID

        arg_colaborador_id: ID,
        arg_espaco_auth: ID

        arg_items: [
          @id/item_id,
          @id/item_id,
          @id/item_id
        ],

        arg_links: [
          { espaco_id: ID, precario_custo: CUSTO, precario_quantidade: QUANT_CUSTO, stock_minimo:QUANT }
        ],

        arg_imposto: [ {
            arg_tipoimposto_id: ID,
            arg_taplicar_id: ID,
            arg_imposto_valor: VALOR, # Por equanto envie null
            arg_imposto_percentagem: PERCENTAGEM, # Por enquanto envie null
        }],

        arg_ean_codes: [ { ean_code:*CODE, ean_dateout:DATE|NULL, ean_datein:DATE|NULL } ]
        arg_ean_disable: [ CODES ]
      }
     */

    arg_artigo_id uuid default args->>'artigo_id';
    arg_artigo_compostoid uuid default args->>'artigo_artigo_id';
    arg_artigo_compostoquantidade double precision default args->>'artigo_compostoquantidade';
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_classe_id uuid not null default args->>'artigo_classe_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

    arg_artigo_codigo varchar not null  default lib.str_normalize( args->>'artigo_codigo' );

    _artigo tweeks.artigo;
    _const map.constant;
    _res_precario lib.result;
    _result lib.result;
    _branch uuid := tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
    _args tweeks.artigo;
begin
  
    if jsonb_typeof(args->'artigo_codigoimposto' ) != 'object' then
        args := args || jsonb_build_object( 'artigo_codigoimposto', args->'artigo_codigoimposto' );
    end if;

    _const := map.constant();
    _args := jsonb_populate_record( _args, args );
    _artigo := tweeks._get_artigo( _args.artigo_id );

    if _args.artigo_classe_id = _const.classe_itemextra then
        return false ? 'Não pode registar um item extra!';
    end if;

    -- Nome não pode ser duplicado
    if (
        select count( * ) > 0
        from tweeks.artigo art
        where lib.str_normalize( public.unaccent( lower ( art.artigo_nome ) ) ) = lib.str_normalize( public.unaccent( lower ( _args.artigo_nome ) ) )
          and art._branch_uid = _branch
          and art.artigo_id::text != coalesce( arg_artigo_id::text, art.artigo_id||'!?' )
    ) then
        return false ? 'Nome do artigo já existe!';
    end if;

    -- Quando o artigo for novo
    if _artigo.artigo_id is null then
      -- Avaliar a composição do artigo
      if arg_artigo_compostoid is not null and ( arg_artigo_compostoquantidade is null or arg_artigo_compostoquantidade = 0 ) then
        return false ? 'Para artigos composto, é necessario expecificar a quantidade do itens a compor';
      end if;

      _args.artigo_colaborador_id := arg_colaborador_id;
      _args.artigo_espaco_auth := arg_espaco_auth;
      _args.artigo_dataregistro := clock_timestamp();
    else
      _args.artigo_colaborador_id := _artigo.artigo_colaborador_id;
      _args.artigo_espaco_auth := _artigo.artigo_espaco_auth;
      _args.artigo_dataregistro := _artigo.artigo_dataregistro;
      _args.artigo_colaborador_atualizacao := arg_colaborador_id;
      _args.artigo_dataatualizacao := clock_timestamp();
    end if;

    -- Garantir que o codigo do artigo não seja duplicado
    if _args.artigo_codigo is not null and (
      select count( * ) > 0
      from tweeks.artigo art
      where lib.str_normalize( lower( art.artigo_codigo ) ) = lib.str_normalize( lower( _args.artigo_codigo ) )
        and art.artigo_id::text != coalesce( arg_artigo_id::text, art.artigo_id||'!?' )
        and art.artigo_espaco_auth = any( arg_espaco_child )
    ) then
      return false ? 'Código do artigo já existe!';
    end if;

    if _args.artigo_codigo is null then
      _args.artigo_codigo := tweeks.__generate_artigo_code( _args.artigo_classe_id );
    end if;

    select ( "returning" ).* into _artigo
      from lib.sets( _args, jsonb_build_object(
        'artigo_artigo_id', _args.artigo_artigo_id,
        'artigo_compostoquantidade', _args.artigo_compostoquantidade
      ))
    ;

    _result := tweeks.funct_reg_dispoe(
      jsonb_build_object(
        'arg_atrigo_id', _artigo.artigo_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_items', args->'arg_items'
      )
    );

    _res_precario := tweeks.funct_reg_precario(
        jsonb_build_object(
        'arg_espaco_auth', arg_espaco_auth,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_forced', true,
        'arg_precario_referencia', lib.sets_ref( _artigo ),
        'arg_links', args->'arg_links'
      )
    );

    perform tweeks.funct_reg_imposto(
    jsonb_build_object(
        'arg_artigo_id', _artigo.artigo_id,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_imposto', args->'arg_imposto'
      )
    );

    perform tweeks.funct_reg_ean( jsonb_build_object(
      'arg_artigo_id', _artigo.artigo_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_ean_codes', coalesce( args->'arg_ean_codes', jsonb_build_array() ),
      'arg_ean_disable', coalesce( args->'arg_ean_disable', jsonb_build_array() )
    ));

    _result.message := _result.message || _res_precario.message || jsonb_build_object(
        'artigo', _artigo
    );

    return _result;

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end
$$;
`;