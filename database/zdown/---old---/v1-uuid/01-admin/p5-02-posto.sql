
create or replace function tweeks.funct_load_posto( filter jsonb DEFAULT NULL::jsonb )
 returns SETOF jsonb
    language plpgsql
as
$$
declare
  /** Essa função serve para devolver os postos
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
    with __alocacao as (
        select
            a.aloca_posto_id as posto_id,
            sum( a.aloca_montante ) as posto_montante,
            coalesce( array_agg( e.espaco_id ), array[]::uuid[] )||a.aloca_posto_id as posto_espacos,
            jsonb_agg( to_jsonb( a )||to_jsonb( e ) ) as posto_alocacao
          from tweeks.aloca a
            inner join tweeks.espaco e on a.aloca_espaco_destino = e.espaco_id
          where a.aloca_estado = _const.maguita_aloca_estado_ativo
            and e.espaco_estado = _const.maguita_espaco_estado_ativo
          group by a.aloca_posto_id
    ), postos as (
      select
            pos.posto_id,
            pos.posto_designacao,
            pos.posto_estado != _const.maguita_posto_estado_encerado as posto_ativo,
            a.posto_montante as posto_montante,
            coalesce( a.posto_alocacao, jsonb_build_array() ) as posto_alocacao,
            pos.posto_estado,
            pos.posto_caixamode,
            pos.posto_authmode,
            pos.posto_chave,
            pos.posto_multiplecaixa,
            tpos.tposto_id,
            tpos.tposto_designacao
        from tweeks.posto pos
          inner join tweeks.tposto tpos on pos.posto_tposto_id = tpos.tposto_id
          left join __alocacao a on pos.posto_id = a.posto_id
        order by
          case
            when pos.posto_estado = _const.maguita_posto_estado_aberto then 1
            when pos.posto_estado = _const.maguita_posto_estado_fechado then 2
            when pos.posto_estado = _const.maguita_posto_estado_encerado then 3
          end,
          pos.posto_designacao
    ), __treat_posto as ( select ps.*,
             coalesce( ps.posto_alocacao, jsonb_build_array() ) as posto_alocacao
      from postos ps
    ) select to_jsonb( t )
      from __treat_posto t
  ;
end;
$$;

