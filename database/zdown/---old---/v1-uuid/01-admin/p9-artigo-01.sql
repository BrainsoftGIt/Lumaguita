select map.constant( 'maguita_ean_estado_ativo', 'int2', 1, 'Estado de ean ATIVO' );
select map.constant( 'maguita_ean_estado_fechado', 'int2', 0, 'Estado de ean FECHADO' );

select map.constantdrop( unnest ) from  unnest(array[
                  'tlink_artigo',
              'tlink_paguina',
              'tlink_associacao'

           ]);


drop function if exists  rule.tg_artigo_after_update_sync_name() cascade;

drop table if exists tweeks.ean;
create table tweeks.ean(
  ean_id uuid not null default public.uuid_generate_v4(),
  ean_artigo_id uuid not null,
  ean_espaco_auth uuid not null,
  ean_colaborador_id uuid not null,
  ean_colaborador_atualizacao uuid default null,
  ean_code character varying not null,
  ean_dateout date default null,
  ean_datein date default null,
  ean_estado int2 not null default map.get( 'maguita_ean_estado_ativo' )::int2,
  ean_date timestamptz not null default current_timestamp,
  ena_dateupdate timestamptz default null,
  constraint pk_ena_id primary key ( ean_id ),
  constraint fk_ean_to_artigo foreign key ( ean_artigo_id ) references tweeks.artigo,
  constraint fk_ean_to_espaco_auth foreign key ( ean_espaco_auth ) references tweeks.espaco,
  constraint uk_ean_id unique ( ean_code )
);

create or replace function tweeks.funct_reg_ean ( args jsonb )
returns lib.result
language plpgsql as $$
declare
  /**

    Essa função serve para registar varios ean de uma vez
    args := {
      arg_artigo_id: UUID,
      arg_espaco_auth: UUID,
      arg_colaborador_id: UUID,
      arg_ean_codes: [
        { ean_code:CODE, ean_dateout:DATE, ean_datein:DATE }
      ]
      arg_ean_disable: [ CODES ]
    }
   */
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_ean_codes jsonb not null default args->'arg_ean_codes';
  arg_ean_disable character varying[] not null default array( select jsonb_array_elements_text(args->'arg_ean_disable') );
  _const map.constant;
  _data record;
  _ean tweeks.ean;
  __eans tweeks.ean[] default array[]::tweeks.ean[];
begin
  _const := map.constant();

  for _data in
    with ___ean as (
      select eandoc.*, ea.ean_id as persitent_ean_id
        from jsonb_array_elements( arg_ean_codes ) e( document )
          left join jsonb_populate_record( null::tweeks.ean, e.document ) eandoc on true
          left join tweeks.ean ea on ea.ean_code = eandoc.ean_code
    ) select *
      from ___ean
  loop
    if _data.persitent_ean_id is not null then
      update tweeks.ean
        set ean_datein = _data.ean_datein,
            ean_dateout = _data.ean_dateout,
            ean_artigo_id = arg_artigo_id
        where ean_id = _data.persitent_ean_id
        returning * into _ean
      ;
      __eans := __eans || _ean;
    else
      insert into tweeks.ean(
        ean_artigo_id,
        ean_espaco_auth,
        ean_colaborador_id,
        ean_code,
        ean_dateout,
        ean_datein
      ) values (
        arg_artigo_id,
        arg_espaco_auth,
        arg_colaborador_id,
        _data.ean_code,
        _data.ean_dateout,
        _data.ean_datein
      ) returning * into _ean;
      __eans := __eans || _ean;
    end if;
  end loop;


  if jsonb_array_length( args->'arg_ean_disable' ) > 0 then
    update tweeks.ean
      set ean_estado = _const.maguita_ean_estado_ativo,
          ena_dateupdate = current_timestamp,
          ean_colaborador_atualizacao = arg_colaborador_id
      where ean_code = any( arg_ean_disable );
  end if;

  return lib.result_true( jsonb_build_object(
      'eans', __eans,
      'disable', array( select e from tweeks.ean e where e.ean_code = any ( arg_ean_disable ))
  ));
end;
$$;

alter table tweeks.artigo alter artigo_id set default public.uuid_generate_v4();
alter table tweeks.artigo rename  artigo_compostomultiplo to artigo_compostoquantidade;
alter table tweeks.artigo drop column artigo_custo;
alter table tweeks.artigo drop column artigo_quantidadecusto;
alter table tweeks.artigo drop column artigo_stockminimo;


alter table tweeks.artigo drop constraint uk_artigo_codigo;


drop function if exists tweeks.funct_change_artigo(args jsonb);
create or replace function tweeks.funct_reg_artigo(args jsonb) returns lib.result
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
    arg_artigo_nome varchar not null  default lib.str_normalize( args->>'artigo_nome' );

    _artigo tweeks.artigo;
    _const map.constant;
    _res_precario lib.result;
    _result lib.result;
begin

    _const := map.constant();

    if arg_classe_id = _const.classe_itemextra then
        return false ? '@tweeks.artigo.can-not-reg-in-item-extra';
    end if;

    if (
        select count( * ) > 0
        from tweeks.artigo art
        where lib.str_normalize( public.unaccent( lower ( art.artigo_nome ) ) ) = lib.str_normalize( public.unaccent( lower ( arg_artigo_nome ) ) )
          and art.artigo_espaco_auth = any( arg_espaco_child )
          and art.artigo_id::text != coalesce( arg_artigo_id::text, art.artigo_id||'!?' )
    ) then
        return false ? '@tweeks.artigo.name-already-exist';
    end if;

    if arg_artigo_compostoid is not null and ( arg_artigo_compostoquantidade is null or arg_artigo_compostoquantidade = 0 ) then
        return false ? 'Para artigos composto, é necessario expecificar a quantidade do itens a compor';
    end if;

    -- Garantir que o codigo do artigo não seja duplicado
    if (
        select count( * ) > 0
        from tweeks.artigo art
        where lib.str_normalize( lower( art.artigo_codigo ) ) = lib.str_normalize( lower( arg_artigo_codigo ) )
          and art.artigo_id::text != coalesce( arg_artigo_id::text, art.artigo_id||'!?' )
          and art.artigo_espaco_auth = any( arg_espaco_child )
    ) then
        return false ? '@tweeks.artigo.codigo-already-exist';
    end if;


    -- Criar novo artigo
    if arg_artigo_id is null then
        _artigo.artigo_codigo := rule.artigo_generate_nextcodigo( arg_classe_id );
        _artigo.artigo_colaborador_id := arg_colaborador_id;
        _artigo.artigo_espaco_auth := arg_espaco_auth;
        args := args - 'artigo_codigo' - 'artigo_id';

        select ("returning").* into _artigo
          from lib.sets( _artigo, replacer := args )
        ;

    elseif arg_artigo_id is not null then
        _artigo := tweeks._get_artigo( arg_artigo_id );
        _artigo.artigo_colaborador_atualizacao := arg_colaborador_id;
        _artigo.artigo_dataatualizacao := current_timestamp;

        select ("returning").* into _artigo
          from lib.sets( null::tweeks.artigo, replacer := ( args - 'artigo_codigo' - 'artigo_artigo_id' || jsonb_build_object(
              'artigo_colaborador_atualizacao', arg_colaborador_id,
              'artigo_dataatualizacao', current_timestamp
          ) ), ref := lib.sets_ref( _artigo ) )

        ;
    end if;

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

drop function rule.tg_precario_after_insert_update_custo() cascade;
alter table tweeks.precario add precario_espaco_destino uuid default null;
update tweeks.precario set precario_espaco_destino = precario_espaco_auth where true;
alter table tweeks.precario alter precario_espaco_destino set not null;
alter table tweeks.precario alter precario_id set default public.uuid_generate_v4();

create or replace function tweeks.funct_reg_precario(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para registrar e atualizar os preços dos itens
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_forced: boolean,
      arg_precario_referencia: {
        artigo_id: ID,
      },
      arg_links :[
        {  espaco_id: *ID,
           stock_minimo: QUNT
           precario_custo: CUSTO,
           precario_quantidade: QUANT_CUSTO }
      ]
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  arg_precario_referencia jsonb not null default args->>'arg_precario_referencia';
  arg_forced boolean default args->>'arg_forced';
  arg_artigo_id uuid;

  arg_espacos_destino uuid[] default array ( select ( e.doc->>'espaco_id' )::uuid from jsonb_array_elements( args->'arg_links') e( doc ) );
  arg_espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );

  _const map.constant;
  _artigo tweeks.artigo;

begin
  _const := map.constant();
  arg_forced := coalesce( arg_forced, false );

  arg_artigo_id := arg_precario_referencia->>'artigo_id';


  if not arg_forced and arg_artigo_id is not null then
    _artigo := tweeks._get_artigo( arg_artigo_id );

    -- Alterar o preço apenas quando o artigo não estiver em nenhuma conta aberta
    if (
         select count( * ) > 0
         from tweeks.venda ag
         where ag.venda_artigo_id = arg_artigo_id
           and ag.venda_estado in ( _const.maguita_venda_estado_aberto )
       ) then
      return false ? '@tweeks.artigo.price-can-not-update-open-account';
    end if;
  end if;

  -- Desativar o precario atual
  update tweeks.link
    set link_estado = _const.maguita_link_estado_fechado,
        link_dataatualizacao = now(),
        link_colaborador_atualizacao = arg_colaborador_id
     where link_referencia @> arg_precario_referencia
       and link_estado = _const.maguita_link_estado_ativo
       and link_espaco_destino = any( arg_espaco_child )
  ;

   -- Criar os novos precarios
   insert into tweeks.link(
       link_tlink_id,
       link_espaco_destino,
       link_espaco_auth,
       link_colaborador_id,
       link_referencia,
       link_posicao,
       link_nome,
       link_metadata
    ) select
        (map.constant()).maguita_tlink_preco,
        ( lp.doc->>'espaco_id' )::uuid,
        arg_espaco_auth,
        arg_colaborador_id,
        arg_precario_referencia,
        0,
        format( 'Preço de %s para %s', _artigo.artigo_nome, e.espaco_nome ),
        jsonb_build_object(
            'precario_custo', (lp.doc->>'precario_custo')::double precision,
            'stock_minimo', ( lp.doc->>'stock_minimo' )::double precision,
            'precario_quantidade', (lp.doc->>'precario_quantidade')::double precision
        )
      from jsonb_array_elements( args->'arg_links' ) lp( doc )
        inner join tweeks.espaco e on (lp.doc->>'espaco_id')::uuid = e.espaco_id
    ;

  return true? jsonb_build_object(
    'precario', array(
        select to_jsonb( l )
          from tweeks.link l
          where l.link_espaco_destino = any( arg_espacos_destino )
            and l.link_referencia @> arg_precario_referencia
            and l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_preco
    )
  );
end;
$$;


drop function rule.tipoimposto_referencia(arg_tipoimposto_id smallint);
create or replace function rule.tipoimposto_referencia( arg_tipoimposto_id uuid ) returns jsonb
    immutable
    strict
    language sql
as
$$
select jsonb_build_object( 'tipoimposto_id', arg_tipoimposto_id );
$$;

create or replace function tweeks.funct_reg_imposto(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    args := {
      arg_artigo_id: ID,
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_imposto: [
        { arg_tipoimposto_id: ID,
          arg_taplicar_id: ID,
          arg_imposto_valor: VALOR, # Por equanto envie null
          arg_imposto_percentagem: PERCENTAGEM, # Por enquanto envie null
        }
      ]
    }
   */
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_imposto jsonb not null default args->>'arg_imposto';
  arg_tipoimposto_id uuid[] default array( select ( ele.doc->>'arg_tipoimposto_id')::uuid from jsonb_array_elements( arg_imposto ) ele( doc ) );
  _const map.constant;
begin

  _const := map.constant();

  -- Primeiro desativar as associação dos impostos atual
  update tweeks.imposto
    set imposto_estado = _const.maguita_imposto_estado_fechado,
        imposto_dataregistro = current_timestamp,
        imposto_colaborador_atualizacao = arg_colaborador_id
    where imposto_artigo_id = arg_artigo_id
      and imposto_estado = _const.maguita_imposto_estado_ativo
  ;

  insert into tweeks.imposto(
    imposto_tipoimposto_id,
    imposto_artigo_id,
    imposto_taplicar_id,
    imposto_espaco_auth,
    imposto_colaborador_id,
    imposto_percentagem,
    imposto_valor
  ) select
      ( el.doc->>'arg_tipoimposto_id' )::uuid,
      arg_artigo_id,
      ( el.doc->>'arg_taplicar_id' )::int2,
      arg_espaco_auth,
      arg_colaborador_id,
      ( el.doc->>'arg_imposto_percentagem' )::double precision,
      ( el.doc->>'arg_imposto_valor' )::double precision
    from jsonb_array_elements( arg_imposto ) el( doc )
  ;

  return true ? jsonb_build_object(
    'imposto', array(
      select ip
        from tweeks.imposto ip
        where ip.imposto_artigo_id = arg_artigo_id
          and ip.imposto_estado = _const.maguita_imposto_estado_ativo
    )
  );
end;
$$;

insert into tweeks.tlink( tlink_id, tlink_designacao ) values ( 4, 'Preço' );
select map.constant( 'maguita_tlink_preco', 'int2', 4, 'Tipo de link' );
drop trigger tg_link_after_update_syncronize_sublinks on tweeks.link;
drop function rule.tg_link_after_update_syncronize_sublinks();
alter table tweeks.link rename link_extras to link_metadata;


with __precario_source as (
  select
      (map.constant()).maguita_tlink_preco,
      p.precario_espaco_destino,
      p.precario_espaco_auth,
      p.precario_colaborador_id,
      p.precario_colaborador_atualizacao,
      p.precario_referencia,
      0,
      art.artigo_nome,
      jsonb_build_object(
              'precario_custo', p.precario_custo,
               'stock_minimo', null,
              'precario_quantidade', p.precario_quantidade
          ),
      p.precario_dataregistro,
      p.precario_dataatualizacao,
      p.precario_estado
  from tweeks.precario p
    inner join tweeks.artigo art on p.precario_referencia @> rule.artigo_referencia( art.artigo_id )
) insert into tweeks.link(
    link_tlink_id,
    link_espaco_destino,
    link_espaco_auth,
    link_colaborador_id,
    link_colaborador_atualizacao,
    link_referencia,
    link_posicao,
    link_nome,
    link_metadata,
    link_dataregistro,
    link_dataatualizacao,
    link_estado
) select * from __precario_source;




drop function rule.precario_espaco(_precario precario, _const map.constant, arg_espaco_auth uuid);
drop table tweeks.precario;


create or replace function tweeks.__precario( jsonb )
returns table( precario_custo double precision, precario_quantidade double precision )
immutable language sql as $$
  select ($1->>'precario_custo')::double precision,
         ($1->>'precario_quantidade')::double precision
$$;

drop function tweeks.funct_reg_link_associacao(args jsonb);
/*
create or replace function tweeks.funct_reg_link_associacao(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /** Essa função serve para
    args := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID
      arg_link_nome: NOME,
      arg_link_referencia: REF,
      arg_link_referenciareplace: boolean | default true, -- indica se todos os links apara esse referencia atual vão deixar de existir
      arg_links: [
        { arg_espaco_destino: ID  }
      ]
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  arg_links jsonb not null default  args->'arg_links';
  arg_espacos uuid[] not null default array( select ( el.doc->>'arg_espaco_destino' )::uuid from jsonb_array_elements( arg_links ) el( doc ));
  arg_link_referenciareplace boolean default args->>'arg_link_referenciareplace';

  arg_link_referencia jsonb not null default args->>'arg_link_referencia';
  arg_link_nome character varying not null default args->>'arg_link_nome';

  _const map.constant;
  _link tweeks.link;
  _data record;
  arg_artigo_id uuid default arg_link_referencia->>'artigo_id';
  _artigo tweeks.artigo;
  _classe tweeks.classe;
  _aux record;
begin
  arg_link_referenciareplace := coalesce( arg_link_referenciareplace, true );
  _const := map.constant();

  if arg_artigo_id is not null then
    _artigo := tweeks._get_artigo( arg_artigo_id );
    _classe := tweeks._get_classe( _artigo.artigo_classe_id );
  end if;

  -- Desativar desacociar todos dos espaços filhos que não estao na lista
  with aux as (
    -- listar todos os links que devem ser mortos
    select *
      from tweeks.link
      where link_referencia @> arg_link_referencia
        and link_estado = _const.link_estado_associacao
        and link_tlink_id = _const.tlink_associacao
        and link_espaco_destino != all ( arg_espacos )
        and link_espaco_auth = any( arg_espaco_child )
        and arg_link_referenciareplace
  )
  update tweeks.link
    set link_estado = _const.link_estado_fechado,
        link_dataatualizacao = current_timestamp,
        link_colaborador_atualizacao = arg_colaborador_id
    where link_id in ( select link_id from aux )
      or link_link_associacao in ( select link_id from aux )
  ;

  for _data in
    select
        ( it.doc->>'arg_espaco_destino' )::uuid as arg_espaco_destino,
        ( it.doc->>'arg_link_custo' )::double precision as arg_link_custo,
        ( it.doc->>'arg_link_quantidadecusto' )::double precision arg_link_quantidadecusto
      from jsonb_array_elements( arg_links ) it ( doc )
        left join tweeks.link l on it.doc @> jsonb_build_object( 'arg_espaco_destino', l.link_espaco_destino )
          and l.link_referencia @> arg_link_referencia
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
      where l.link_id is null
  loop

    -- Lincar os protudos ao espaço
    insert into tweeks.link (
      link_tlink_id,
      link_referencia,
      link_espaco_auth,
      link_espaco_destino,
      link_colaborador_id,
      link_posicao,
      link_nome,
      link_estado
    ) values (
      _const.tlink_associacao,
      arg_link_referencia,
      arg_espaco_auth,
      _data.arg_espaco_destino,
      arg_colaborador_id,
      -1,
      arg_link_nome,
      _const.link_estado_associacao
    ) returning * into _link ;

    if coalesce( _data.arg_link_quantidadecusto, 0 ) = 0 or coalesce( _data.arg_link_custo, 0 ) = 0 then
      _data.arg_link_quantidadecusto := null;
      _data.arg_link_custo := null;
    end if;

    -- Linkar tambem a classe quando for linkar o produto (adicionar o link da classe ao espaco se ainda não houver)
    if _artigo.artigo_id is not null and (
      select count( * ) = 0
        from tweeks.link lk
        where lk.link_espaco_destino = _data.arg_espaco_destino
          and lk.link_referencia @> rule.classe_referencia( _classe.classe_id )
          and lk.link_tlink_id = _const.tlink_associacao
          and lk.link_estado = _const.link_estado_associacao
    ) then
      -- Criar o link para o destino
      perform tweeks.funct_reg_link_associacao( jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_link_nome', _classe.classe_nome,
        'arg_link_referencia', rule.classe_referencia( _classe.classe_id ),
        'arg_link_referenciareplace', false,
        'arg_links', json_build_array( json_build_object(
          'arg_espaco_destino', _data.arg_espaco_destino
        ))
      ));
    end if;

    -- Quando for artigo linkar também os tipos de imposto ao espaco
    for _aux in
      select *
        from tweeks.imposto ip
          inner join tweeks.tipoimposto tip on ip.imposto_tipoimposto_id = tip.tipoimposto_id
          left join tweeks.link lk on lk.link_referencia @> rule.tipoimposto_referencia( tip.tipoimposto_id )
            and lk.link_estado = _const.link_estado_associacao
            and lk.link_espaco_destino = _data.arg_espaco_destino
            and lk.link_tlink_id = _const.tlink_associacao
        where _artigo.artigo_id is not null
          and ip.imposto_artigo_id = _artigo.artigo_id
          and ip.imposto_estado = _const.maguita_imposto_estado_ativo
          and lk.link_id is null
    loop
      perform tweeks.funct_reg_link_associacao( jsonb_build_object(
          'arg_colaborador_id', arg_colaborador_id,
          'arg_espaco_auth', arg_espaco_auth,
          'arg_link_nome', _aux.tipoimposto_nome,
          'arg_link_referencia', rule.tipoimposto_referencia( _aux.tipoimposto_id ),
          'arg_link_referenciareplace', false,
          'arg_links', json_build_array( json_build_object(
            'arg_espaco_destino', _data.arg_espaco_destino
          ))
        ));
    end loop;



  end loop;

  return  true ? jsonb_build_object(
    'link', array(
      select l
        from tweeks.link l
        where l.link_referencia @> arg_link_referencia
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
    )
  );

end;
$$;
*/



