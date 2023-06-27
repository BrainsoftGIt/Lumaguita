alter table tweeks.classe alter classe_id set default public.uuid_generate_v4();
alter table tweeks.link alter link_id set default public.uuid_generate_v4();
insert into tweeks.tlink( tlink_id, tlink_designacao )values ( 5, 'Categoria' );
select map.constant( 'maguita_tlink_classe', 'int2', 5 );


drop function tweeks.funct_change_classe(args jsonb);
alter table tweeks.link alter link_posicao drop not null;



create or replace function rule.classe_generate_nextcodigo() returns character varying
    language plpgsql
as
$$
declare
    min int default 100000000;
    max int default 999999999;
begin
    return ( random()* ( max - min ) + min )::int::text;
end;
$$;


create or replace function tweeks.funct_reg_classe(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função cria uma nova classe
    args {
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_espacos:[{
        espaco_id: UID
      }]

      classe_id:UID     --Apenas para quando for editar
      classe_nome: NOME
      classe_foto: FOTO
      classe_classe_id: ID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_classe_nome character varying not null default lib.str_normalize( args->>'classe_nome' );
  arg_classe_id uuid default args->>'classe_id';
  _arg_espacos jsonb[] default array( select e.doc from jsonb_array_elements( args->'arg_espacos' ) e( doc ) );
  arg_espacos_id uuid[] default array( select (e.doc->>'espaco_id')::uuid from jsonb_array_elements( args->'arg_espacos' ) e( doc ) );

  arg_espaco_child uuid[];

  _const map.constant;
  _classe tweeks.classe;
  _link tweeks.link;
  _links jsonb;

begin

  _const := map.constant();
  arg_espaco_child := rule.espaco_get_childrens_static( arg_espaco_auth );

  -- Verificar se existe a instancia da classe
  select * into _classe
    from tweeks.classe cla
    where public.unaccent( lower( lib.str_normalize( cla.classe_nome ) ) ) = public.unaccent( lower( lib.str_normalize( arg_classe_nome ) ))
  ;

  if _classe.classe_id = _const.classe_itemextra then
    return false ? 'Esse nome de categoria esta reservado!';
  end if;

  if arg_classe_id is not null then
    select * into _classe
      from tweeks.classe c
      where c.classe_id = arg_classe_id;
  end if;

  _classe.classe_colaborador_id := arg_colaborador_id;
  _classe.classe_espaco_auth := arg_espaco_auth;

  select * into _classe from tweeks.classe;
  select ( "returning" ).* into _classe
    from lib.sets( _classe, replacer :=  args )
  ;


  update tweeks.link
    set link_estado = _const.maguita_link_estado_fechado,
        link_colaborador_atualizacao = arg_colaborador_id,
        link_dataatualizacao = current_timestamp
    where link_estado = _const.maguita_link_estado_ativo
      and link_tlink_id = _const.maguita_tlink_classe
      and link_referencia @> lib.sets_ref( _classe )
      and link_espaco_destino = any( arg_espaco_child )
--       and link_espaco_destino != all( arg_espacos_id )
  ;

  -- Criar ligação com as classes
  select jsonb_agg( to_jsonb( e ) ) into _links
    from unnest( _arg_espacos ) e( doc )
      inner join tweeks.espaco esp on  e.doc @> lib.sets_ref( esp )
      inner join lib.sets( _row := null::tweeks.link, replacer := e.doc|| jsonb_build_object(
        'link_tlink_id', _const.maguita_tlink_classe,
        'link_espaco_destino', esp.espaco_id,
        'link_espaco_auth', arg_espaco_auth,
        'link_colaborador_id', arg_colaborador_id,
        'link_referencia', lib.sets_ref( _classe ),
        'link_nome', format( 'Ligação da categoria %I com %I', _classe.classe_nome, esp.espaco_nome ),
        'link_metadata', jsonb_build_object()
      ) ) on true
  ;

  return lib.result_true(jsonb_build_object(
    'classe', _classe,
    'links', _links
  ));
end;
$$;



drop function tweeks.funct_load_classe_simple(filter jsonb);
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
            array_agg( to_jsonb( e ) ) as espacos
          from  __espaco e
            inner join tweeks.link l on e.espaco_id = l.link_espaco_destino
          where l.link_estado = _const.maguita_link_estado_ativo
            and l.link_tlink_id = _const.maguita_tlink_classe
          group by l.link_referencia

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
          left join __links l on l.link_referencia @> lib.sets_ref( cla )
          left join tweeks.artigo atr on cla.classe_id = atr.artigo_classe_id
        where cla.classe_estado = _const.classe_estado_ativo
          and ( cla.classe_espaco_auth = any( arg_espaco_child )
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

drop function tweeks.funct_update_classe( jsonb );
