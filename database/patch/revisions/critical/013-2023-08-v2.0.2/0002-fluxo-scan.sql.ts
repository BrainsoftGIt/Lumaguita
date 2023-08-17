import {block} from "../../../core/updater";

block( module, { identifier: "fluxo-scan", flags:[ ] }).sql`
create or replace function tweeks.__fluxo_scan( _artigo_id uuid DEFAULT NULL::uuid, _espaco_id uuid DEFAULT NULL::uuid, _resume boolean DEFAULT true, _branch uuid DEFAULT NULL::uuid)
  returns TABLE(fluxo_artigo_id uuid, fluxo_espaco_id uuid, fluxo_preview double precision, fluxo_resultado double precision, fluxo_checkmarks uuid, fluxo_check double precision, fluxo_order bigint, fluxo_end bigint, fluxo_resume boolean, fluxo_credito double precision, fluxo_debito double precision, fluxo_calc double precision, fluxo_quantidade double precision, fluxo_id uuid, fluxo_date timestamp with time zone, fluxo_sequencia bigint)
  language sql
as
$$
with recursive
  __map as ( select maguita_fluxo_estado_ativo, maguita_fluxo_estado_fechado, maguita_fluxo_estado_anulado from map.constant()

  ), __espaco as (
    select a.espaco_id
      from tweeks.espaco a
      where a.espaco_id = coalesce( _espaco_id, a.espaco_id )
      and a._branch_uid = coalesce( _branch, a._branch_uid )
  ), __artigo as (
    select a.artigo_id
      from tweeks.artigo a
      where a.artigo_id = coalesce( _artigo_id, a.artigo_id )
      and a._branch_uid = coalesce( _branch, a._branch_uid )
 ), __stock_point as(
    select
      a.artigo_id,
      e.espaco_id,
      mode() within group ( order by f.fluxo_dataregistro desc ) as point
    from tweeks.fluxo f
      inner join __map _const on f.fluxo_estado = _const.maguita_fluxo_estado_ativo
      inner join __artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
      inner join __espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
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
      f.fluxo_id,
      f.fluxo_dataregistro,
      f.fluxo_sequencia,
      f.fluxo_checkpoint,
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
      inner join __artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
      inner join __espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
      left join __stock_point _sp on _sp.artigo_id = a.artigo_id and _sp.espaco_id = e.espaco_id
    where  f.fluxo_dataregistro >= coalesce( _sp.point, f.fluxo_dataregistro )
      and f._branch_uid = coalesce( _branch, f._branch_uid )
    order by a.artigo_id,
      e.espaco_id,
      f.fluxo_dataregistro,
      f.fluxo_sequencia
  ), __fluxo_stock as (
  select
    _f.artigo_id,
    _f.espaco_id,
    _f.fluxo_order,
    _f.fluxo_end,
    _f.fluxo_credito,
    _f.fluxo_debito,
    _f.fluxo_quantidade,
    _f.fluxo_id,
--     _f.fluxo_dataregistro,
--     _f.fluxo_sequencia,

    _f.fluxo_quantidade as fluxo_resultado,
    0.0::double precision as fluxo_preview,
--     _f.fluxo_id as fluxo_checkmarks,
--     _f.fluxo_quantidade as fluxo_checkquant,
    _f.fluxo_order = _f.fluxo_end as fluxo_resume
  from __fluxo _f
    inner join __map _const on true
  where _f.fluxo_order = 1
  union all
  select
    _f.artigo_id,
    _f.espaco_id,
    _f.fluxo_order,
    _f.fluxo_end,
    _f.fluxo_credito,
    _f.fluxo_debito,
    _f.fluxo_quantidade,
    _f.fluxo_id,
--     _f.fluxo_dataregistro,
--     _f.fluxo_sequencia,
    
    ( _fs.fluxo_resultado * _f.fluxo_checkpoint ) + ( _f.fluxo_quantidade ),
    _fs.fluxo_resultado as fluxo_priview,
--     case
--       when _f.fluxo_checkpoint = 0 then _f.fluxo_id
--       else _fs.fluxo_checkmarks
--       end,
--     case
--       when _f.fluxo_checkpoint = 0 then _f.fluxo_quantidade
--       else _fs.fluxo_checkquant
--       end,
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

    null::uuid as fluxo_checkmarks,--     _fs.fluxo_checkmarks,
    null::double precision as fluxo_checkquant, --     _fs.fluxo_checkquant,
    _fs.fluxo_order,
    _fs.fluxo_end,
    _fs.fluxo_resume,

    _fs.fluxo_credito,
    _fs.fluxo_debito,
    _fs.fluxo_credito - _fs.fluxo_debito,
    _fs.fluxo_quantidade,
    _fs.fluxo_id,
    null::timestamptz, ---_fs.fluxo_dataregistro,
    null::int8 -- _fs.fluxo_sequencia
from __fluxo_stock _fs
where true in (
    coalesce( _resume, true ) = _fs.fluxo_resume,
    not _resume
  )
$$;

`;