import {block} from "../../../core/updater";

block( module, {
    identifier: "correction",
    flags:[ "@unique" ]
}).sql`
select * from map.constant('maguita_fluxo_estado_ativo', 'int2', 1 );
select * from map.constant('maguita_fluxo_estado_fechado', 'int2', 0 );

update tweeks.fluxo
  set fluxo_estado = (map.constant()).maguita_fluxo_estado_ativo
  where fluxo_estado is null
;

alter table tweeks.fluxo alter fluxo_estado set not null;

drop function if exists tweeks.__fluxo_scan(_artigo_id uuid, _espaco_id uuid, _resume boolean);
create or replace function tweeks.__fluxo_scan(_artigo_id uuid DEFAULT NULL::uuid, _espaco_id uuid DEFAULT NULL::uuid, _resume boolean DEFAULT true, _branch uuid default null)
  returns TABLE(fluxo_artigo_id uuid, fluxo_espaco_id uuid, fluxo_preview double precision, fluxo_resultado double precision, fluxo_checkmarks uuid, fluxo_check double precision, fluxo_order bigint, fluxo_end bigint, fluxo_resume boolean, fluxo_credito double precision, fluxo_debito double precision, fluxo_calc double precision, fluxo_quantidade double precision, fluxo_id uuid, fluxo_date timestamp with time zone, fluxo_sequencia bigint)
  language sql
as
$$
with recursive
  __map as ( select maguita_fluxo_estado_ativo, maguita_fluxo_estado_fechado, maguita_fluxo_estado_anulado from map.constant() ),
  __stock_point as(
    select
      a.artigo_id,
      e.espaco_id,
      mode() within group ( order by f.fluxo_dataregistro desc ) as point
    from tweeks.fluxo f
      inner join __map _const on f.fluxo_estado = _const.maguita_fluxo_estado_ativo
      inner join tweeks.artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
        and a.artigo_id = coalesce( _artigo_id, a.artigo_id )
        and a._branch_uid = coalesce( _branch, a._branch_uid )
      inner join tweeks.espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
        and e.espaco_id = coalesce( _espaco_id, e.espaco_id )
        and e._branch_uid = coalesce( _branch, e._branch_uid )
    where f.fluxo_checkpoint = 0
      and f._branch_uid = coalesce( _branch, f._branch_uid )
      and f.fluxo_estado = _const.maguita_fluxo_estado_ativo
    group by a.artigo_id,
      e.espaco_id
  ),
  __fluxo as (
    select
      a.artigo_id,
      e.espaco_id,
      f.*,
      case
        when e.espaco_id = f.fluxo_espaco_in and a.artigo_id = f.fluxo_artigo_in then f.fluxo_quantidadein
        else 0
        end as fluxo_credito,
      case
        when e.espaco_id = f.fluxo_espaco_out and a.artigo_id = f.fluxo_artigo_out then f.fluxo_quantidadeout
        else 0
        end as fluxo_debito,
      case
        when f.fluxo_quantidadefinal is not null then f.fluxo_quantidadefinal
        when e.espaco_id = f.fluxo_espaco_in and a.artigo_id = f.fluxo_artigo_in then f.fluxo_quantidadein * 1
        when e.espaco_id = f.fluxo_espaco_out and a.artigo_id = f.fluxo_artigo_out then f.fluxo_quantidadeout * -1
        end as fluxo_quantidade,
      row_number() over ( partition by a.artigo_id, e.espaco_id ) as fluxo_order,
      count( f.fluxo_id ) over ( partition by a.artigo_id, e.espaco_id ) as fluxo_end

    from tweeks.fluxo f
      inner join __map _const on f.fluxo_estado = _const.maguita_fluxo_estado_ativo
      inner join tweeks.artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
        and a.artigo_id = coalesce( _artigo_id, a.artigo_id )
        and a._branch_uid = coalesce( _branch, a._branch_uid )
      inner join tweeks.espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
        and e.espaco_id = coalesce( _espaco_id, e.espaco_id )
        and e._branch_uid = coalesce( _branch, e._branch_uid )
      left join __stock_point _sp on _sp.artigo_id = a.artigo_id and _sp.espaco_id = e.espaco_id
    where  f.fluxo_dataregistro >= coalesce( _sp.point, f.fluxo_dataregistro )
      and f._branch_uid = coalesce( _branch, f._branch_uid )
    order by a.artigo_id,
      e.espaco_id,
      f.fluxo_dataregistro,
      f.fluxo_sequencia
  ), __fluxo_stock as (
  select
    _f.*,
    _f.fluxo_quantidade as fluxo_resultado,
    0.0::double precision as fluxo_preview,
    _f.fluxo_id as fluxo_checkmarks,
    _f.fluxo_quantidade as fluxo_checkquant,
    _f.fluxo_order = _f.fluxo_end as fluxo_resume
  from __fluxo _f
    inner join __map _const on true
  where _f.fluxo_order = 1
  union all
  select
    _f.*,
    ( _fs.fluxo_resultado * _f.fluxo_checkpoint ) + ( _f.fluxo_quantidade ),
    _fs.fluxo_resultado as fluxo_priview,
    case
      when _f.fluxo_checkpoint = 0 then _f.fluxo_id
      else _fs.fluxo_checkmarks
      end,
    case
      when _f.fluxo_checkpoint = 0 then _f.fluxo_quantidade
      else _fs.fluxo_checkquant
      end,
    _f.fluxo_order = _f.fluxo_end as fluxo_resume

  from __fluxo_stock _fs
         inner join __fluxo _f on _fs.espaco_id = _f.espaco_id
    and _fs.artigo_id = _f.artigo_id
    and _fs.fluxo_order +1 = _f.fluxo_order
) select
    _fs.artigo_id as stock_artigo_id,
    _fs.espaco_id as stock_espaco_id,
    _fs.fluxo_preview,
    _fs.fluxo_resultado,

    _fs.fluxo_checkmarks,
    _fs.fluxo_checkquant,

    _fs.fluxo_order,
    _fs.fluxo_end,
    _fs.fluxo_resume,

    _fs.fluxo_credito,
    _fs.fluxo_debito,
    _fs.fluxo_credito - _fs.fluxo_debito,
    _fs.fluxo_quantidade,
    _fs.fluxo_id,
    _fs.fluxo_dataregistro,
    _fs.fluxo_sequencia
from __fluxo_stock _fs
where true in (
    coalesce( _resume, true ) = _fs.fluxo_resume,
    not _resume
  )
$$;


drop view if exists tweeks.stock;
create or replace view tweeks.stock as
  select
      fluxo_espaco_id as espaco_id,
      fluxo_artigo_id as artigo_id,
      null::uuid as fluxo_espaco_in,
      null::uuid as fluxo_artigo_in,
      null::int8 as entrada_quantidade,
      null::int8 entradas,
      null::uuid as fluxo_artigo_out,
      null::uuid as fluxo_espaco_out,
      null::int8 as saida_quantidade,
      null::int8 as saidas,
      fluxo_resultado as stock_quantidade
    from tweeks.__fluxo_scan(
      null,
      null,
      true,
      null
    );
`;


block( module, { identifier: "loadPosto" } ).sql`
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
`;
