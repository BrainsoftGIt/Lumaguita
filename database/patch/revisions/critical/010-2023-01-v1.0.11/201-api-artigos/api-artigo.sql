delete from libdom.entryset where domain = 'TOKEN_GRANT';
INSERT INTO libdom.entryset (name, type, value, domain, label, editable, comment) VALUES ('maguita_token_grant_syncproduct', 'character varying', 'grant:sync-product', 'TOKEN_GRANT', 'Sincronizar', false, null);
INSERT INTO libdom.entryset (name, type, value, domain, label, editable, comment) VALUES ('maguita_token_grant_invoice', 'character varying', 'grant:invoice', 'TOKEN_GRANT', 'Vender', false, null);


insert into api.permission(   permission_code, permission_name, permission_description )
  values ( 'grant:sync-product', 'Sincronizar artigos', 'Permitir que o tokem possa sincronizar os artigos, as categorias, os item extras' );

insert into api.permission(   permission_code, permission_name, permission_description )
  values ( 'grant:sell', 'Faturar', 'Permitir que o tokem possa emitir faturas' );


create or replace function api.funct_token_synchronise( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      token_key:*TOKEN,
      products:*[{
        //Information about category
        category_name:*string                                 // categoria
        category_code:*string                                 // categoria [ item-extras-> 000000 ]

        //Information about product
        product_name:*string                                  // Nome do produto
        product_code:*string                                  // Codio do produto (Unico)
        product_prepare:*boolean                              // Produto deve ser preparado
        product_photo:?string                                 // Foto do produto
        product_description:?string                           // Descrição do produto
        product_nostockcontroll:*boolean                      // Se o produto aceita stock negativo ou não
        product_minstock:?numeric                             // Valor de stock minimo para o artigo
        product_price:?numeric                                // Preço
        product_increments:?[REF#PRODUCT_CODE...]             // Codigos dos itens extras do produto
        product_eans:?[REF#PRODUCT_CODE...]                // Codigos EAN dos productos
        product_stock:?numeric                                // Valor para o acerto do stock na sincronização

        //Information about composition
        product_product_compositioncode:?[REF#PRODUCT_CODE]   // Codigo do produto abase usado para composição
        product_compositionquantity:?numeric                  // Quantidade de produto abase para compor um item do composto

        //Information about impost
        impost_name:?string                                   // Nome do imposto
        impost_code:?string                                   // Codigo do imposto
        impost_amount:?numeric                                // Valor monetario do imposto
        impost_percent?:numeric                               // Valor percentagem do imposto
        impost_modality:?INCLUDE|EXCLUDE                      // A modalidade que o imposto sera aplicado [RETIRAR|ADCIONAR]
      }],
    }
   */
  _token record;
  _domconst libdom.constant;
  _categories record;
  _request api.request;
  _const map.constant;
  _data record;
begin
  _const := map.constant();
  _request := api.__create_request( args );
  _domconst := libdom.constant('maguita_token' );
  _token := jsonb_populate_record( _token, args );
  select *, array_agg( permission_code ) as grants
         into _token
    from tweeks.token
      inner join tweeks.permission p  on p.permission_id = any( token_permissions )
    where token_key = _token.token_key
    group by token_uid
  ;


  -- Falta de permisão no token
  if _token.token_uid is null or _domconst.maguita_token_grant_syncproduct != all( _token.grants ) then
    return next to_jsonb( lib.res_false('Permisão negada para o token' ));
    return;
  end if;

  -- Verificar se existe alguma venda aberta
  select
      count( * ) as total,
      string_agg( distinct a.artigo_nome, ', ' ) as artigos,
      string_agg( distinct ct.conta_numero, ', ') as contas
      into _data
    from tweeks.venda ve
      inner join tweeks.artigo a on ve.venda_artigo_id = a.artigo_id
      inner join tweeks.conta ct on ve.venda_conta_id = ct.conta_id
    where ve.venda_espaco_auth = _token.token_espaco_work
      and ve.venda_estado = _const.maguita_venda_estado_aberto
  ;

  if _data.total > 0 then
    return next to_jsonb( lib.res_false('Não pode sincronizar porque existe contas abetro no armazem em que sera sincronizado!' , jsonb_build_object(
      'hint', 'fechar todas as contas antes de sincronizar com este armazem',
      'artigos', _data.artigos,
      'contas', _data.contas
    )));
    return;
  end if;

  with __categories as (
    select distinct
        e.document->>'category_name' as category_name,
        e.document->>'category_code' as category_code
      from jsonb_array_elements(args->>'products') e ( document )
  ), __check_cagetories as (
   select
        _c.category_code,
        _c.category_name,
        count(*) over ( partition by _c.category_code ) as counts
      from __categories _c
  ) select
        jsonb_agg( cc ) as categories,
        count(*) filter ( where  cc.counts > 1 ) as duplications,
        string_agg( cc.category_name, ', ' ) as duplications_name
        into _categories
      from __check_cagetories cc
  ;

  -- Quando houve categorias duplicada
  if _categories.duplications > 0 then
    return next to_jsonb( lib.res_false('Existes categorias diferentes com mesmo codigo: '||_categories.duplications_name));
    return;
  end if;

  with __product as  (
    select
        e.product->>'product_code' as codigo,
        e.product->>'product_name' as nome,
        ordinality
      from jsonb_array_elements( args->'products' ) with ordinality e( product )
  ), __duplicado as (
    select
        p.codigo,
        string_agg( p.nome, ', ' ) as nomes,
        array_agg( jsonb_build_object( 'nome', p.nome, 'index', p.ordinality ) ) as produtos
      from __product p
      group by p.codigo
      having count(*) > 1
  ) select count( * ) as duplicados,
           string_agg( format( '%s (%s)',  d.codigo, d.nomes ), ', ' ) as artigos,
           array_agg( jsonb_build_object(
              'codigo', d.codigo,
              'produtos', d.produtos
          ))
      from __duplicado d
  ;


  -- Quando tudo var for validade com sucesso
  return next to_jsonb(lib.res_true());

  return query
    select
      from api.__token_synchronize_category( jsonb_build_object(
        'token_user_uid', _token.token_user_work,
        'token_workspace_uid', _token.token_espaco_work,
        'token_branch_uid', _token._branch_uid,
        'categories', _categories.categories
      ));

  return query
    select
      from api.__token_synchronize_product( jsonb_build_object(
        'token_user_uid', _token.token_user_work,
        'token_workspace_uid', _token.token_espaco_work,
        'token_branch_uid', _token._branch_uid,
        'products', args->'products'
      ));

end
$$;

create or replace function api.__token_synchronize_category( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      token_user_uid
      token_workspace_uid
      token_branch_uid

      categories:[
        //Information about category
        category_name:*string                                 // categoria
        category_code:*string                                 // categoria [ item-extras-> 000000 ]
        category_category_supercode                           //
        category_photo                                        //
        category_position                                     //
      ]
    }
   */
  _token_user_uid uuid default args->>'token_user_uid';
  _token_workspace_uid uuid default args->>'token_workspace_uid';
  _token_branch_uid uuid default args->>'token_branch_uid';
  _category record;
  _instance tweeks.classe;
begin
  for _category in
    select
        cla.*,
        e.document->>'category_name' as category_name,
        e.document->>'category_code' as category_code,
        e.document->>'category_photo' as category_photo,
        coalesce( (e.document->>'category_position')::int, 0 ) as category_position
      from jsonb_array_elements( args->'categories' ) e ( document )
        left join tweeks.classe cla on e.document->>'category_code' = cla.classe_codigo
  loop
    if _category.classe_id is null then
      insert into tweeks.classe(
        classe_espaco_auth,
        classe_colaborador_id,
        classe_nome,
        classe_codigo,
        classe_foto,
        classe_position,
        _branch_uid
      ) values (
        _token_workspace_uid,
        _token_user_uid,
        _category.category_name,
        _category.category_code,
        _category.category_photo,
        _category.category_position,
        _token_branch_uid
      ) returning * into _instance;
    else
      update tweeks.classe
        set classe_nome = _category.category_name,
            classe_foto = _category.category_photo,
            classe_position = _category.classe_position,
            classe_dataatualizacao = now(),
            classe_colaborador_id = _token_user_uid
        returning * into _instance;
    end if;
  end loop;

  return query
    with __child_class as (
      select
          cla.classe_id,
          super.classe_id as classe_classe_id
        from jsonb_array_elements( args->'categories' ) e( document )
          inner join tweeks.classe cla on e.document->>'category_code' = cla.classe_codigo
          left join tweeks.classe super on e.document->>'category_category_supercode' = super.classe_codigo
    ), __update as(
      update tweeks.classe c
        set classe_classe_id = _cc.classe_classe_id,
            classe_dataatualizacao = case
              when coalesce( classe_classe_id, lib.to_uuid( 0) ) != coalesce( _cc.classe_classe_id, lib.to_uuid( 0 ) ) then now()
              else classe_dataatualizacao
            end,
            classe_colaborador_atualizacao = case
              when coalesce( classe_classe_id, lib.to_uuid( 0) ) != coalesce( _cc.classe_classe_id, lib.to_uuid( 0 ) ) then _token_user_uid
              else classe_colaborador_atualizacao
            end
        from __child_class _cc
        where c.classe_id = _cc.classe_id
        returning *
    ) select to_jsonb( _up )
        from __update _up
  ;
end;
$$;


create or replace function api.__token_synchronize_product( args jsonb )
returns setof jsonb
language plpgsql as $$
  declare
    /*
     args:= {
      token_user_uid
      token_workspace_uid
      token_branch_uid
      products:[{
        category_code:*string                                 // categoria [ item-extras-> 000000 ]

        //Information about product
        product_name:*string                                  // Nome do produto
        product_code:*string                                  // Codio do produto (Unico)
        product_prepare:*boolean                              // Produto deve ser preparado
        product_photo:?string                                 // Foto do produto
        product_description:?string                           // Descrição do produto
        product_nostockcontroll:*boolean                      // Se o produto aceita stock negativo ou não

        //Information about composition
        product_product_compositioncode:?[REF#PRODUCT_CODE]   // Codigo do produto abase usado para composição
        product_compositionquantity:?numeric                  // Quantidade de produto abase para compor um item do composto

      }]
     }
     */
    _token_user_uid uuid default args->>'token_user_uid';
    _token_workspace_uid uuid default args->>'token_workspace_uid';
    _token_branch_uid uuid default args->>'token_branch_uid';
    _product record;
    _instance tweeks.artigo;
  begin
    for _product in
      select art.*,
             cla.*,
             e.document->>'product_name' as product_name,
             e.document->>'product_code' as product_code,
             coalesce( (e.document->>'product_prepare')::boolean, false ) as product_prepare,
             e.document->>'product_photo' as product_photo,
             e.document->>'product_description' as product_description,
             coalesce( (e.document->>'product_nostockcontroll')::boolean, false ) as product_nostockcontroll
        from jsonb_array_elements( args->'products' ) e ( document )
          left join tweeks.classe cla on cla.classe_codigo = e.document->>'category_code'
          left join tweeks.artigo art on art.artigo_codigo = e.document->>'product_code'
    loop
      if _product.artigo_id is null then
        insert into tweeks.artigo (
          artigo_classe_id,
          artigo_espaco_auth,
          artigo_colaborador_id,
          artigo_codigo,
          artigo_nome,
          artigo_preparacao,
          artigo_foto,
          artigo_descricao,
          artigo_stocknegativo,
          _branch_uid
        ) values (
          _product.classe_id,
          _token_workspace_uid,
          _token_user_uid,
          _product.product_code,
          _product.product_name,
          _product.product_prepare,
          _product.product_description,
          _product.product_nostockcontroll,
          _token_branch_uid
        ) returning * into _instance;
      else
        update tweeks.artigo
          set artigo_classe_id = _product.classe_id,
              artigo_colaborador_atualizacao = _token_user_uid,
              artigo_codigo = _product.product_code,
              artigo_nome = _product.product_name,
              artigo_preparacao = _product.product_prepare,
              artigo_foto = _product.product_photo,
              artigo_descricao = _product.product_description,
              artigo_stocknegativo = _product.product_nostockcontroll
          where artigo_id = _product.artigo_id
          returning * into _instance;
      end if;
    end loop;

    -- Atualizar as informações do artigo composto
    return query
      with __artigo_composto as (
        select
            art.artigo_id as _artigo_id,
            super.artigo_id as _artigo_artigo_id,
            e.document->>'product_product_compositioncode' as product_product_compositioncode,
            ( e.document->>'product_compositionquantity')::double precision as product_compositionquantity
          from jsonb_array_elements( args->'products' ) e( document )
            inner join tweeks.artigo art on e.document->>'product_code' = art.artigo_codigo
              and art._branch_uid = _token_branch_uid
            left join tweeks.artigo super on e.document->>'product_product_compositioncode' = super.artigo_codigo
      ), __update as (  update tweeks.artigo
          set artigo_artigo_id = _ac._artigo_artigo_id,
              artigo_compostoquantidade = _ac.product_compositionquantity,
              artigo_dataatualizacao = case
                when coalesce( artigo_artigo_id, lib.to_uuid(0)) != _ac._artigo_artigo_id then now()
                when coalesce( artigo_compostoquantidade, -1 ) != coalesce( _ac.product_compositionquantity, -1 ) then now()
                else artigo_dataatualizacao
              end,
              artigo_colaborador_atualizacao = case
                when coalesce( artigo_artigo_id, lib.to_uuid(0)) then _token_user_uid
                when coalesce(artigo_compostoquantidade, -1) != coalesce( _ac.product_compositionquantity, -1
              ) then _token_user_uid
                else artigo_colaborador_atualizacao
              end
          from __artigo_composto _ac
          returning *
     ) select to_jsonb(_up )
        from __update _up
    ;
  end;
$$;


create or replace function api.__token_synchronise_product_links( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /*
   args:= {
    token_user_uid
    token_workspace_uid
    token_branch_uid,
    products:[{
        //Information about product
        product_code:*string                                  // Codio do produto (Unico)
        product_price:?numeric                                // Preço
        product_stock:?numeric                                // Valor para o acerto do stock na sincronização
        product_minstock:?numeric                                // Valor para o acerto do stock na sincronização

    }]
  }

  // Sincronizar os links do preço
  */
  _token_user_uid uuid default args->>'token_user_uid';
  _token_workspace_uid uuid default args->>'token_workspace_uid';
  _token_branch_uid uuid default args->>'token_branch_uid';
  _const map.constant;
  _data record;
  _workspace tweeks.espaco;
begin
  _const := map.constant();

  /*
               'precario_custo', (lp.doc->>'precario_custo')::double precision,
            'stock_minimo', ( lp.doc->>'stock_minimo' )::double precision,
            'precario_quantidade', (lp.doc->>'precario_quantidade')::double precision

   */

  _workspace := tweeks._get_espaco( _token_workspace_uid );

  with __current_link as (
    select
        art.artigo_id,
        l.link_id,
        (l.link_metadata->>'precario_custo')::numeric as link_precario_custo,
        (l.link_metadata->>'stock_minimo')::numeric as link_stock_minimo,
        (l.link_metadata->>'precario_quantidade')::numeric as link_precario_quantidade,

        (e.doc->>'product_minstock')::numeric as _product_minstock,
        (e.doc->>'product_price')::numeric as _product_price
      from jsonb_array_elements( args->'products' ) with ordinality e ( doc, idx )
        inner join tweeks.artigo art on e.doc->>'product_code' = art.artigo_codigo
          and art._branch_uid = _token_branch_uid
        left join tweeks.link l on art.artigo_id = (l.link_referencia->>'artigo_id')::uuid
          and l.link_estado = _const.maguita_link_estado_ativo
          and l._branch_uid = _token_branch_uid
          and l.link_espaco_destino = _token_workspace_uid
  ) select
        array_agg( distinct artigo_id ) as _artigos,
        coalesce( array_agg( distinct link_id ) filter ( where link_id is not null ), array[]::uuid[] ) as _link_id,
        array_agg( link_id ) filter (
          where link_precario_custo != _product_price
            or link_stock_minimo != _product_minstock
        ) as __link_changes,
        array_agg( distinct artigo_id ) filter (
          where link_precario_custo != _product_price
            or link_stock_minimo != _product_minstock
            or link_id is null
        ) as __artigo_change
        into _data
      from __current_link
  ;

  -- Desativar todas as ligações do produto para esse espaço que não vem na lista ou que foram modificado
  update tweeks.link
    set link_estado = _const.maguita_link_estado_fechado,
        link_colaborador_atualizacao = _token_user_uid,
        link_dataatualizacao = now()
    where ( link_id = any( _data.__link_changes ) and _branch_uid = _token_branch_uid )
      or (
        ( link_referencia->>'artigo_id' )::uuid != all( _data._artigos )
        and link_espaco_destino = _token_workspace_uid
        and link_estado = _const.maguita_link_estado_ativo
        and _branch_uid = _token_branch_uid
    )
  ;

  -- Cria novas ligações de produtos com espaço
  with __news as (
    select
        art.artigo_id,
        art.artigo_nome,
        ( e.doc->>'product_minstock')::numeric as _product_minstock,
        ( e.doc->>'product_price')::numeric as _product_price
      from jsonb_array_elements( args->'products' ) e ( doc )
        inner join tweeks.artigo art on e.doc->>'product_code' = art.artigo_codigo
          and art._branch_uid = _token_branch_uid
        left join tweeks.link l on art.artigo_id = (l.link_referencia->>'artigo_id')::uuid
          and l.link_estado = _const.maguita_link_estado_ativo
          and l._branch_uid = _token_branch_uid
          and l.link_espaco_destino = _token_workspace_uid
          and l.link_tlink_id = _const.maguita_tlink_preco
      where art.artigo_id = any( _data.__artigo_change )
  ) insert into tweeks.link(
      link_tlink_id,
      link_espaco_destino,
      link_espaco_auth,
      link_colaborador_id,
      link_referencia,
      link_posicao,
      link_nome,
      link_metadata,
      _branch_uid
    ) select
          _const.maguita_tlink_preco,
          _token_workspace_uid,
          _token_workspace_uid,
          _token_user_uid,
          jsonb_build_object(
            'artigo_id', n.artigo_id
          ),
          0,
          format( 'Preço de %s para %s', n.artigo_nome, _workspace.espaco_nome ),
          jsonb_build_object(
              'precario_custo', n._product_price,
              'stock_minimo', n._product_minstock,
              'precario_quantidade', 1.0
            ),
            _token_branch_uid
        from __news n;

  return query
    with __link as (
      select *
        from tweeks.link l
        where l.link_tlink_id = _const.maguita_tlink_preco
          and l.link_estado = _const.maguita_link_estado_ativo
          and l._branch_uid = _token_branch_uid
          and l.link_espaco_destino = _token_workspace_uid
    ) select to_jsonb( _l )
        from __link _l
  ;
end;
$$;

create or replace function api.__token_synchronise_product_acerto( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    Essa função server para sincronizar os stoks dos artigos
    args:= {
    token_user_uid
    token_workspace_uid
    token_branch_uid,
    products:[{
        //Information about product
        product_stock:?numeric                                // Valor para o acerto do stock na sincronização
        product_code:*string                                  // Codio do produto (Unico)
    }]
   */
  _token_user_uid uuid default args->>'token_user_uid';
  _token_workspace_uid uuid default args->>'token_workspace_uid';
  _token_branch_uid uuid default args->>'token_branch_uid';
  _acerto_group uuid default gen_random_uuid();
begin
  return query
    with __acerto as (
      select
          ( e.doc->>'product_stock' )::double precision as product_stock,
          art.artigo_id,
          s.*
        from jsonb_array_elements( args->'products' ) with ordinality e ( doc )
          inner join tweeks.artigo art on (e.doc->>'product_code')::uuid = art.artigo_id
          inner join tweeks._get_stock( art.artigo_id, _token_workspace_uid ) s
            on s.stock_artigo_id = art.artigo_id
              and s.stock_espaco_id = _token_workspace_uid
        where  e.doc->>'product_stock' is not null
    ), __create_acerto as (
      insert into tweeks.acerto (
          acerto_espaco_auth,
          acerto_colaborador_id,
          acerto_quantidade,
          acerto_correcao,
          acerto_quantidadeinicial,
          acerto_observacao,
          acerto_oprgroup,
          acerto_artigo_id,
          acerto_espaco_id,
          _branch_uid,
          acerto_codigo
      ) select
            _token_workspace_uid,
            _token_user_uid,
            ac.product_stock,
            ac.stock_quantidade - ac.product_stock,
            ac.product_stock,
            'Acerto do stock a partir de syncronização dos produtos',
            _acerto_group,
            ac.artigo_id,
            _token_workspace_uid,
            _token_branch_uid,
            tweeks.__generate_acerto_code( _token_branch_uid )
          from __acerto ac
        returning *
    ) select to_jsonb( _cac )
        from __create_acerto _cac
  ;
end;
$$;

select map.constant( 'maguita_dispoe_estado_ativo', 'int2', map.get('dispoe_estado_ativo'));
select map.constant( 'maguita_dispoe_estado_fechado', 'int2', map.get('dispoe_estado_fechado'));


create or replace function api.__token_synchronise_product_increments( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /*
    args := {
      token_user_uid
      token_workspace_uid
      token_branch_uid
      products:*[{
        //Information about product
        product_code:*string                                  // Codio do produto (Unico)
        product_increments:?[REF#PRODUCT_CODE...]             // Codigos dos itens extras do produto
      }],
    }
   */
  _token_user_uid uuid default args->>'token_user_uid';
  _token_workspace_uid uuid default args->>'token_workspace_uid';
  _token_branch_uid uuid default args->>'token_branch_uid';
  _const map.constant;
begin
  _const := map.constant();
  -- Os incrementos atuais que não fazem parte dos produtos

  update tweeks.dispoe
    set
      dispoe_estado = _const.maguita_dispoe_estado_fechado,
      dispoe_colaborador_atualizacao = _token_user_uid,
      dispoe_dataatualizacao = now()
    where dispoe_estado = _const.maguita_dispoe_estado_ativo
      and _branch_uid = _token_branch_uid
      and dispoe_artigo_id in (
        select a.artigo_id
          from jsonb_array_elements( args->'products' ) e ( doc )
            inner join tweeks.artigo a on a.artigo_codigo = e.doc->>'product_code'
              and a._branch_uid = _token_branch_uid
        union all
          select a.artigo_id
            from tweeks.artigo a
            where a.artigo_espaco_auth = _token_workspace_uid
              and a._branch_uid = _token_branch_uid
      );

  return query
    with __dispoe as (
      select
        art.artigo_id,
        iten.artigo_id,
        _token_workspace_uid,
        _token_user_uid,
        _token_user_uid,
        _token_branch_uid
      from jsonb_array_elements( args->'products' ) e ( doc )
             inner join tweeks.artigo art on e.doc->>'product_code' = art.artigo_codigo
        and art._branch_uid = _token_branch_uid
             inner join jsonb_array_elements_text( e.doc->'product_increments' ) i( code ) on true
             inner join tweeks.artigo iten on i.code = iten.artigo_codigo
        and iten._branch_uid = _token_branch_uid
    ), __create as (
      insert into tweeks.dispoe (
          dispoe_artigo_id,
          dispoe_artigo_item,
          dispoe_espaco_auth,
          dispoe_colaborador_id,
          dispoe_colaborador_atualizacao,
          _branch_uid
        ) select * from __dispoe
          returning *
    ) select to_jsonb( _c )
        from __create _c
  ;
end;
$$;


create or replace function api.__token_synchronise_product_ean( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      products:*[{
        token_user_uid
        token_workspace_uid
        token_branch_uid

        //Information about product
        product_code:*string                                  // Codio do produto (Unico)

        product_eans:?[REF#PRODUCT_CODE...]                // Codigos EAN dos productos
      }]
    }
   */
  _token_user_uid uuid default args->>'token_user_uid';
  _token_workspace_uid uuid default args->>'token_workspace_uid';
  _token_branch_uid uuid default args->>'token_branch_uid';
  _const map.constant;
begin
  _const := map.constant();

  update tweeks.ean
    set
      ean_estado = _const.maguita_ean_estado_fechado,
      ean_colaborador_atualizacao = _token_user_uid,
      ena_dateupdate = now()
    where ean_estado = _const.maguita_ean_estado_ativo
      and _branch_uid = _token_branch_uid
      and ean_artigo_id in (
        select a.artigo_id
          from jsonb_array_elements( args->'products' ) e ( doc )
            inner join tweeks.artigo a on e.doc->>'product_code' = a.artigo_codigo
              and a._branch_uid = _token_branch_uid
        union all
          select a.artigo_id
            from tweeks.artigo a
            where a._branch_uid = _token_branch_uid
              and a.artigo_espaco_auth = _token_user_uid
      );

  return query
    with __dispoe as (
      select
          art.artigo_id,
          t.code
        from jsonb_array_elements( args->'products' ) e ( doc )
          inner join tweeks.artigo art on e.doc->>'product_code' = art.artigo_codigo
            and art._branch_uid = _token_branch_uid
          inner join jsonb_array_elements_text( e.doc->'product_eans' ) t( code ) on true
    ), __create as (
      insert into tweeks.ean (
        ean_artigo_id,
        ean_espaco_auth,
        ean_colaborador_id,
        ean_code,
        ean_dateout,
        ean_datein,
        _branch_uid
      )  select
            _d.artigo_id,
            _token_workspace_uid,
            _token_user_uid,
            _d.code,
            null,
            null,
            _token_branch_uid
          from __dispoe _d
       returning *
    ) select
          to_jsonb( _c )
        from __create _c
  ;
end;
$$;

create or replace function api.__token_synchronise_product_impost( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
begin
  -- criar os impostos
  -- deslincar os impostos nos artigos
  -- linkar os novos imposto nos artigos
end;
$$


