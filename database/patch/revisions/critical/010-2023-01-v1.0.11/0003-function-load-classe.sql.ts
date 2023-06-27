import {block} from "../../../core/updater";

block( module, { identifier: "funct_load_class", flags:[]}).sql`
create or replace function tweeks.funct_load_classe( filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
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
          left join __links l on ( l.link_referencia->>'classe_id' )::uuid = cla.classe_id
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

`;