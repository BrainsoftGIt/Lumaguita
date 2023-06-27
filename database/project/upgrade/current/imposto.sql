drop function if exists tweeks.funct_reg_tipoimposto(args jsonb);

create or replace function tweeks.sets_tipoimposto( args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa função serve para registar os tipos de imposto
    args := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_links :[ { arg_espaco_destino: ID  } ]

      tipoimposto_id
      tipoimposto_nome: NOME,
      tipoimposto_codigo: CODIGO,
      taxa_taxa: VALOR,
      taxa_percentagem: PERCENTAGEM,

    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';


  arg_tipoimposto_codigo character varying not null default args->>'tipoimposto_codigo';
  arg_taxa_percentagem double precision default args->>'taxa_percentagem';
  arg_taxa_taxa double precision default args->>'taxa_taxa';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _tipoimposto tweeks.tipoimposto;
begin
  arg_tipoimposto_codigo := lib.str_normalize( upper( public.unaccent( arg_tipoimposto_codigo ) ) );

  _tipoimposto := jsonb_populate_record( _tipoimposto, args );

  if (
    select count( * ) > 0
      from tweeks.tipoimposto tip
      where tip.tipoimposto_espaco_auth = any( arg_espaco_child )
        and tip.tipoimposto_id != coalesce( _tipoimposto.tipoimposto_id, lib.to_uuid( 0 ) )
        and lib.str_normalize( upper( public.unaccent( tip.tipoimposto_codigo ) ) ) = arg_tipoimposto_codigo
  ) then
    return false ? '@tweeks.tipoimposto.codigo-already-exist';
  end if;

  if _tipoimposto.tipoimposto_id is null then
    _tipoimposto.tipoimposto_colaborador_id := arg_colaborador_id;
    _tipoimposto.tipoimposto_espaco_auth := arg_espaco_auth;
  else
    _tipoimposto.tipoimposto_colaborador_atualizacao := arg_colaborador_id;
    _tipoimposto.tipoimposto_dataatuzaliacao := now();
  end if;

  select ( "returning" ).* into _tipoimposto
    from lib.sets( _tipoimposto, args );

  perform tweeks.funct_reg_taxa(
    jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_tipoimposto_id', _tipoimposto.tipoimposto_id,
      'arg_taxa_percentagem', arg_taxa_percentagem,
      'arg_taxa_taxa', arg_taxa_taxa
    )
  );

  perform tweeks.funct_reg_link_associacao(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_link_nome', _tipoimposto.tipoimposto_nome,
      'arg_link_referencia', jsonb_build_object( 'tipoimposto_id', _tipoimposto.tipoimposto_id ),
      'arg_links', args->'arg_links'
    )
  );

  return true ? jsonb_build_object(
    'tipoimposto', _tipoimposto
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

alter table tweeks.taxa alter taxa_id set default public.uuid_generate_v4();

create or replace function tweeks.funct_reg_taxa(args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_tipoimposto_id: ID,
      arg_taxa_percentagem: ID,
      arg_taxa_taxa: VALOR
    }
   */

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_tipoimposto_id uuid default args->>'arg_tipoimposto_id';
  arg_taxa_percentagem double precision default args->>'arg_taxa_percentagem';
  arg_taxa_taxa double precision default args->>'arg_taxa_taxa';

  _const map.constant;
  _taxa tweeks.taxa;
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin

  _const := map.constant();

  -- Desativar todas as taxas atual
  update tweeks.taxa
    set taxa_estado = _const.taxa_estado_fechado,
        taxa_dataatualizacao = current_timestamp,
        taxa_colaborador_atualizacao = arg_colaborador_id
    where taxa_espaco_auth = arg_espaco_auth
      and taxa_tipoimposto_id = arg_tipoimposto_id
      and taxa_estado = _const.taxa_estado_ativo
      and _branch_uid = ___branch
  ;

  -- Criar o novo imposto
  insert into tweeks.taxa (
    taxa_tipoimposto_id,
    taxa_colaborador_id,
    taxa_percentagem,
    taxa_taxa,
    taxa_espaco_auth
  ) values (
    arg_tipoimposto_id,
    arg_colaborador_id,
    arg_taxa_percentagem,
    arg_taxa_taxa,
    arg_espaco_auth
  ) returning * into _taxa;

  return true ? jsonb_build_object(
    'taxa', _taxa
  );

end;
$$;

select map.constant( 'maguita_tlink_associacao', 'int2', 3);
select map.constantdrop( 'maguita_link_estado_associacao' );

CREATE or replace FUNCTION tweeks.funct_reg_link_associacao(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
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
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
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
        and link_estado = _const.maguita_link_estado_ativo
        and link_tlink_id = _const.maguita_tlink_associacao
        and link_espaco_destino != all ( arg_espacos )
        and link_espaco_auth = any( arg_espaco_child )
        and _branch_uid = ___branch
        and arg_link_referenciareplace
  )
  update tweeks.link
    set link_estado = _const.maguita_link_estado_fechado,
        link_dataatualizacao = current_timestamp,
        link_colaborador_atualizacao = arg_colaborador_id
    where link_id in ( select link_id from aux )
      or link_link_associacao in ( select link_id from aux )
  ;

  for _data in
    select
        ( it.doc->>'arg_espaco_destino' )::uuid as arg_espaco_destino,
        ( it.doc->>'arg_link_custo' )::numeric as arg_link_custo,
        ( it.doc->>'arg_link_quantidadecusto' )::numeric arg_link_quantidadecusto
      from jsonb_array_elements( arg_links ) it ( doc )
        left join tweeks.link l on it.doc @> jsonb_build_object( 'arg_espaco_destino', l.link_espaco_destino )
          and l.link_referencia @> arg_link_referencia
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_associacao
          and l._branch_uid = ___branch
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
      _const.maguita_tlink_associacao,
      arg_link_referencia,
      arg_espaco_auth,
      _data.arg_espaco_destino,
      arg_colaborador_id,
      -1,
      arg_link_nome,
      _const.maguita_link_estado_ativo
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
          and lk.link_tlink_id = _const.maguita_tlink_associacao
          and lk.link_estado = _const.maguita_link_estado_ativo
          and lk._branch_uid = ___branch
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
            and lk.link_estado = _const.maguita_link_estado_ativo
            and lk.link_espaco_destino = _data.arg_espaco_destino
            and lk.link_tlink_id = _const.maguita_tlink_associacao
        where _artigo.artigo_id is not null
          and ip._branch_uid = ___branch
          and lk._branch_uid = ___branch
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
          and l.link_estado = _const.maguita_link_estado_ativo
          and l.link_tlink_id = _const.maguita_tlink_associacao
          and l._branch_uid = ___branch
    )
  );
end;
$$;


create or replace function tweeks.funct_load_tipoimposto(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    Essa função serve para carregar os tipos de impostos registrados
    filter := {
      arg_espaco_auth: ID
      arg_colaborador_id UID
    }
   */

  arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;

  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();

  return query
    with associacao as (
      select
        ls.link_referencia,

        jsonb_agg(
          lib.jsonb_values(
            to_jsonb( esp ),
              'espaco_id',
              'espaco_nome'
          )) as link

      from tweeks.link ls
        inner join tweeks.espaco esp on ls.link_espaco_destino = esp.espaco_id
          and esp._branch_uid = ___branch
      where ls.link_tlink_id = _const.maguita_tlink_associacao
        and ls.link_estado = _const.maguita_link_estado_ativo
        and ( ls.link_espaco_auth = any( arg_espaco_child ) or ls.link_espaco_destino = any( arg_espaco_child ) )
        and ls._branch_uid = ___branch
      group by ls.link_referencia
    ), imposto_taxa as (
      select
        tip.*,
        txow.*,
        coalesce( ass.link, jsonb_build_array() ) as link,
        coalesce( tx.taxa_percentagem, (txow::tweeks.taxa).taxa_percentagem ) as taxa_percentagem,
        coalesce( tx.taxa_taxa, (txow::tweeks.taxa).taxa_taxa ) as taxa_taxa,
        arg_espaco_auth = tip.tipoimposto_espaco_auth as tipoimposto_editinfo,
        true as tipoimposto_editespaco,
        true as tipoimposto_edittaxa
      from tweeks.tipoimposto tip
        left join associacao ass on ass.link_referencia @> jsonb_build_object( 'tipoimposto_id', tip.tipoimposto_id )
        left join tweeks.taxa tx on tip.tipoimposto_id = tx.taxa_tipoimposto_id
          and tx.taxa_estado = _const.taxa_estado_ativo
          and tx.taxa_espaco_auth = arg_espaco_auth
          and tx._branch_uid = ___branch
        left join rule.taxa_espaco( tx, _const, arg_espaco_auth ) txow on true
          and tx.taxa_estado = _const.taxa_estado_ativo
          and tx.taxa_espaco_auth = tip.tipoimposto_espaco_auth
      where
          tip._branch_uid = ___branch
        and ( tip.tipoimposto_espaco_auth = any( arg_espaco_child ) or ass.link_referencia is not null )
      order by
        tip.tipoimposto_nome
    ) select
      lib.jsonb_values(
        it,
        'tipoimposto_id',
        'tipoimposto_nome',
        'tipoimposto_codigo',
        'tipoimposto_dataatuzaliacao',
        'tipoimposto_estado',
        'tipoimposto_dataregistro',
        'link',
        'taxa_percentagem',
        'taxa_taxa',
        'tipoimposto_edittaxa',
        'tipoimposto_editespaco',
        'tipoimposto_editinfo'
      )
      from imposto_taxa it
      ;
end;
$$;

drop function if exists tweeks.funct_load_tipoimposto_simple(filter jsonb);

/*
create or replace function tweeks.funct_load_tipoimposto_simple(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    Essa função serve para devolver a lista de tipo de imposto de forma simples
    filter := {
      arg_espaco_auth: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select lib.jsonb_values(
      tp,
      'tipoimposto_id',
      'tipoimposto_nome',
      'tipoimposto_codigo'
    )
    from tweeks.tipoimposto tp
      left join tweeks.link lk on lk.link_referencia @> rule.tipoimposto_referencia( tp.tipoimposto_id )
        and lk.link_espaco_destino = arg_espaco_auth
        and lk.link_estado = _const.maguita_link_estado_ativo
        and lk.link_tlink_id = _const.maguita_tlink_associacao
    where tp.tipoimposto_estado = _const.tipoimposto_estado_ativo
      and tp.tipoimposto_espaco_auth = any( arg_espaco_child )
    group by tp.tipoimposto_id
    having count( lk.link_id ) > 0 or tp.tipoimposto_espaco_auth = arg_espaco_auth
  ;
end;
$$;
*/
