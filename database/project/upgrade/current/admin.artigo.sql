drop function if exists tweeks.__generate_classe_code(
  brc uuid,
  user_brc uuid,
  space_brc uuid
);


create or replace function tweeks.__generate_classe_code(
  brc uuid,
  user_brc uuid,
  space_brc uuid
) returns character varying
  language plpgsql
as
$$
declare
  _cluster cluster.cluster;
  _code character varying;
  _len int default 3;
begin
  _cluster := cluster._get_cluster_local();
  brc := coalesce( brc, tweeks.__branch_uid( user_brc, space_brc ));

  while _code is null loop
    _code := cluster.next( 'artigo.code/seq', sub := brc::text, lpad := _len, lpad_char := '0' );
    if( exists(
      select *
        from tweeks.classe c
        where c.classe_codigo = _code
          and c._branch_uid = coalesce( brc, c._branch_uid )
    )) then
      _code := null;
    end if;
  end loop;

  return _code;
end;
$$;

create or replace function tweeks.__tg_before_update_classe()
returns trigger
language plpgsql as $$
declare
begin
  if new.classe_codigo is null then
    new.classe_codigo := tweeks.__generate_classe_code(
      new._branch_uid,
      new.classe_colaborador_id,
      new.classe_espaco_auth
    );
  end if;
  return new;
end;
$$;

drop trigger if exists __tg_before_update_classe on tweeks.classe;
create trigger  __tg_before_update_classe
  before insert or update on tweeks.classe
  for each row
  when ( not cluster.__is_replication() )
  execute procedure tweeks.__tg_before_update_classe();

drop function if exists rule.classe_generate_nextcodigo();


drop function if exists tweeks.artigo_generate_nextcodigo( arg_classe_id uuid );
create or replace function tweeks.__generate_artigo_code( arg_classe_id uuid )
returns character varying
  language plpgsql
as
$$
declare
  _classe tweeks.classe;
  _cluster cluster.cluster;
  code character varying;
begin
  _cluster := cluster._get_cluster_local();

  while code is null loop
    update tweeks.classe
      set classe_lastcodigo = classe.classe_lastcodigo +1
      where classe_id = arg_classe_id
      returning * into _classe
    ;

    code := lib.str_nospace( format( '%s%s%s',
      _cluster.cluster_code,
      "right"( _classe.classe_codigo, 2 ),
      greatest( _classe.classe_codigo::text, lpad( _classe.classe_codigo, 2, '0') )
    ));

    if( exists(
      select *
        from tweeks.artigo a
        where a.artigo_codigo = code
          and a._branch_uid = _classe._branch_uid
    )) then code := null; end if;
  end loop;

  return code;
end;
$$;


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
    elseif _args.artigo_codigo is null and _artigo.artigo_codigo is not null then
      _args.artigo_codigo := _artigo.artigo_codigo;
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

create or replace function tweeks.funct_load_artigo_base( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    arg_espaco_auth: UID
    arg_colaborador_id: UID
    arg_artigo_composto: UID

    arg_classe_id: ID
        arg_artigo_estado: ARTIGO_ESTADO
        query: {
          any?: CODE|NAME|DESCRICAO
          code?: CODE
          name?: NAME
          desc?: DESCRICAO
        }
   */
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_artigo_composto uuid default args->>'arg_artigo_composto';

  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _artigo tweeks.artigo;
  _result record;
begin
  _artigo := tweeks._get_artigo( arg_artigo_composto );


  with recursive __artigos as (
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_artigo_id,
        array[ art.artigo_id ]::uuid[] as path
      from tweeks.artigo art
      where _branch_uid = _branch_uid
        and art.artigo_artigo_id is null
    union all
      select
          es.artigo_id,
          es.artigo_nome,
          es.artigo_artigo_id,
          _e.path || es.artigo_id
        from __artigos _e
          inner join tweeks.artigo es on _e.artigo_id = es.artigo_artigo_id
        where es._branch_uid = ___branch
  ) select array_agg( _art.artigo_id ) as artigos into _result
      from __artigos _art
      where arg_artigo_composto != all( _art.path )
        and _art.artigo_id != coalesce( _artigo.artigo_artigo_id, _artigo.artigo_id )
        and _art.artigo_id != _artigo.artigo_id
  ;

  return query
    select e.document
      from tweeks.funct_load_artigo( args ) e( document )
      where (e.document->>'artigo_id')::uuid = any( _result.artigos )
  ;
end;
$$;

alter table tweeks.imposto alter imposto_id set default public.uuid_generate_v4();
alter table tweeks.imposto alter imposto_estado set default map.get('maguita_imposto_estado_ativo'::name)::int2;