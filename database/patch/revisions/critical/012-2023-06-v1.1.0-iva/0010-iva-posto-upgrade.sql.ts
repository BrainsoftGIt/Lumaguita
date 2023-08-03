import {block} from "../../../core/updater";

block( module, { identifier: "ViewPostAmountInvoice"}).sql`
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

  __branch uuid not null default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  arg_aloca_espaco uuid default filter->>'arg_aloca_espaco';
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


create or replace function tweeks.funct_pos_load_caixa_auth(args jsonb) returns SETOF jsonb
    language plpgsql
as
$$
declare
  /**
    args := {
      arg_colaborador_id: UUID,
      arg_espaco_auth: UUID,
      arg_posto_id:UUID
      auth: BOOLEAN
    }
   */
  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
  _posto tweeks.posto;

begin
  _const := map.constant();

  select * into _posto from tweeks.posto;

  return query with
  __deposito as (
    select
        dep.deposito_caixa_id,
        dep.deposito_currency_id,
        cur.currency_id,
        cur.currency_name,
        cur.currency_code,
        sum( dep.deposito_montantefinal ) deposito_montantefinal,
        sum( dep.deposito_montante ) deposito_montante,
        sum( dep.deposito_montantemoeda ) deposito_montantemoeda,
        sum( dep.deposito_montantetroco ) deposito_montantetroco
      from tweeks.deposito dep
        inner join geoinfo.currency cur on dep.deposito_currency_id = cur.currency_id
      where dep.deposito_estado = _const.maguita_deposito_estado_ativo
        and dep._branch_uid = branch
      group by dep.deposito_caixa_id,
        dep.deposito_currency_id,
        cur.currency_id,
        cur.currency_name,
        cur.currency_code
  ),__deposito_caixa as (
      select
          dep.deposito_caixa_id,
          dep.currency_id,
          dep.currency_name,
          dep.currency_code,
          sum( dep.deposito_montantefinal ) as deposito_montantefinal,
          jsonb_object_agg(
              dep.currency_code, jsonb_build_object(
                  'deposito_montantemoeda', deposito_montantemoeda,
                  'deposito_montantefinal', deposito_montantefinal,
                  'deposito_montante', deposito_montante,
                  'deposito_montantetroco', deposito_montantetroco
              )
          ) as deposito_montantemoeda,
          sum( dep.deposito_montante ) as deposito_montante,
          sum( dep.deposito_montantemoeda ) as deposito_montantemoeda,
          sum( dep.deposito_montantetroco ) as deposito_montantetroco
        from __deposito dep
        group by
          dep.deposito_caixa_id,
          dep.currency_id,
          dep.currency_name,
          dep.currency_code
  ),__posto as (
    select
        c.caixa_id,
        c.caixa_estado,
        c.caixa_montanteinicial,
        c.caixa_montanteinicialposto,
        p.posto_caixamode,
        dep.*
      from tweeks.posto p
        inner join tweeks.caixa c on p.posto_id = c.caixa_posto_id
          and c.caixa_estado = _const.maguita_caixa_estado_ativo
          and case
            when p.posto_caixamode = _const.maguita_posto_caixamodo_pessoal then c.caixa_colaborador_id = arg_colaborador_id
            when p.posto_caixamode = _const.maguita_posto_caixamodo_espaco  then c.caixa_espaco_auth    = arg_espaco_auth
            when p.posto_caixamode = _const.maguita_posto_caixamodo_posto   then c.caixa_posto_id       = arg_posto_id
            else false
          end
        left join __deposito_caixa dep on c.caixa_id = dep.deposito_caixa_id
      where p.posto_id = arg_posto_id
        and p._branch_uid = branch
        and c._branch_uid = branch
  ) select to_jsonb( p )
    from __posto p;
end;
$$;
`;