import {sql} from "kitres";

export const funct_load_posto = sql`
create or replace function tweeks.funct_load_posto(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
  declare
    /** Essa função serve para devolver os postos
      filter := {
        arg_colaborador_id UUID
        arg_espaco_auth UUID
        arg_aloca_espaco:UUID
      }
     */
    arg_colaborador_id uuid not null default filter->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
    __branch uuid;
    arg_espaco_child uuid[];
    arg_aloca_espaco uuid default filter->>'arg_aloca_espaco';
    _const map.constant;
  begin
    arg_espaco_child :=  rule.espaco_get_childrens( arg_espaco_auth );
    __branch := tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
    
    if __branch then
        return;
    end if;
    
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
    ), __posto_filter as (
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
        pos.posto_vermontatefaturado,
        pos.posto_multiplecaixa,
        pos.posto_definirmontanteautomaticamente,
        tpos.tposto_id,
        tpos.tposto_designacao
      from tweeks.posto pos
        inner join tweeks.tposto tpos on pos.posto_tposto_id = tpos.tposto_id
        left join __alocacao a on pos.posto_id = a.posto_id
      where pos._branch_uid = __branch
        and ( arg_aloca_espaco = any ( a.posto_espacos ) or arg_aloca_espaco is null )
      order by
        case
          when pos.posto_estado = _const.maguita_posto_estado_aberto then 1
          when pos.posto_estado = _const.maguita_posto_estado_fechado then 2
          when pos.posto_estado = _const.maguita_posto_estado_encerado then 3
        end,
        pos.posto_designacao
    ), __treat_posto as (
      select ps.*,
        coalesce( ps.posto_alocacao, jsonb_build_array() ) as posto_alocacao
        from __posto_filter ps
    ) select to_jsonb( t )
      from __treat_posto t
  ;
  end;
$$;
`;