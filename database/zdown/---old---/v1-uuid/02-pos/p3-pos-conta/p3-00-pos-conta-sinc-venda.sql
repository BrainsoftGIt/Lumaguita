drop function tweeks.funct_pos__sync_conta_amount(arg_conta_id uuid);
create or replace function tweeks.funct_pos__sync_conta_amount(
  args jsonb
)
returns jsonb
language plpgsql as $$
declare
  arg_conta_id uuid default args->>'arg_conta_id';
  _const map.constant;
  _data record;
  _conta tweeks.conta;
begin
  _const := map.constant();
  with __vendas  as(
    select
        ve.*,
        coalesce( sum( vi.venda_montantetotal ), 0.0 ) as _venda_montanteagregado
      from tweeks.venda ve
        left join tweeks.venda vi on ve.venda_id = vi.venda_venda_id
          and vi.venda_conta_id = arg_conta_id
          and vi.venda_estado in ( _const.maguita_venda_estado_aberto, _const.maguita_venda_estado_fechado )

      where ve.venda_conta_id  = arg_conta_id
        and ve.venda_estado = _const.maguita_venda_estado_aberto
        and ve.venda_venda_id is null

      group by ve.venda_id
  ), __venda_calcs as (
    select
        _ve._venda_montanteagregado,
        _ve.venda_id,
        _ve.venda_montante + _ve._venda_montanteagregado as _venda_montantetotal,
        _vi.*
      from __vendas _ve
        inner join tweeks.funct_pos__calc_imposto( _ve.venda_artigo_id, _ve.venda_montante + _ve._venda_montanteagregado, args || jsonb_build_object(
          'arg_venda_id', _ve.venda_id
        )) _vi on true
      where _ve.venda_id = _ve.venda_id
        and _ve.venda_conta_id = arg_conta_id
        and true in (
          _ve.venda_montantetotal != _ve.venda_montante + _ve._venda_montanteagregado,
          _ve.venda_montanteagregado != _ve._venda_montanteagregado,
          _ve.venda_imposto != _vi.venda_imposto,
          _ve.venda_impostoadicionar != _vi.venda_impostoadicionar,
          _ve.venda_impostoretirar != _vi.venda_impostoretirar,
          _ve.venda_montantesemimposto != _vi.venda_montantesemimposto,
          _ve.venda_montantecomimposto != _vi.venda_montantecomimposto
        )
    ), __sync_calc as (
    update tweeks.venda _up
      set
          venda_montantetotal = _vc._venda_montantetotal,
          venda_montanteagregado = _vc._venda_montanteagregado,
          venda_imposto = _vc.venda_imposto,
          venda_impostoadicionar = _vc.venda_impostoadicionar,
          venda_impostoretirar = _vc.venda_impostoretirar,
          venda_montantesemimposto = _vc.venda_montantesemimposto,
          venda_montantecomimposto = _vc.venda_montantecomimposto
      from __venda_calcs _vc
      where _vc.venda_id = _up.venda_id
      returning _up.*, _vc.impostos
  ) select count( * ) as changes, jsonb_agg( to_jsonb( s )) as syncs into _data from __sync_calc s;

  with __final_amount as (
    select sum( ve.venda_montantecomimposto ) as conta_montante
      from tweeks.venda ve
      where ve.venda_conta_id = arg_conta_id
        and ve.venda_venda_id is null
        and ve.venda_estado in (
          _const.maguita_venda_estado_aberto,
          _const.maguita_venda_estado_fechado
        )
  ), __sync_conta as (
    update tweeks.conta _c set
        conta_montante = _ve.conta_montante
      from __final_amount _ve
      where _c.conta_id = arg_conta_id
        and _c.conta_montante != _ve.conta_montante
      returning *
  ) select * into _conta from __sync_conta;

  return jsonb_build_object(
    'conta', _conta,
    'syncs', _data.syncs
  );
end;
$$;

drop function if exists tweeks.funct_reg_vendaimposto(args jsonb);
drop function if exists tweeks.funct_pos_reg_vendaimposto(args jsonb);

-- RENAME imposto_estado  enuns
select *,
       map.constant_rename( name, format( 'maguita_%s', name ) )
  from map.describe( 'imposto_estado', 'taplicar' )
;

alter table tweeks.tipoimposto
  add tipoimposto_percentagem double precision,
  add tipoimposto_valor double precision
;

drop function if exists tweeks.funct_pos__calc_imposto(arg_artigo_id uuid, montante double precision, arg_venda_id uuid);
create or replace function tweeks.funct_pos__calc_imposto( arg_artigo_id uuid, montante double precision, args jsonb default null)
returns table (
  venda_imposto double precision,
  venda_impostoadicionar double precision,
  venda_impostoretirar double precision,
  venda_montantesemimposto double precision,
  venda_montantecomimposto double precision,
  impostos jsonb
) language plpgsql as $$
declare
  _const map.constant;
  _simple tweeks.impostovenda;
  _changes record;
  _data record;
begin
  /*_const := map.constant();
  _simple.impostovenda_espaco_auth := args->>'arg_espaco_auth';
  _simple.impostovenda_colaborador_id := args->>'arg_colaborador_id';
  _simple.impostovenda_venda_id := args->>'arg_venda_id';
  with __imposto as (
    select
        i.imposto_percentagem,
        i.imposto_valor,
        ti.tipoimposto_valor,
        ti.tipoimposto_percentagem,
        i.imposto_taplicar_id as aplicar_id,
        i.imposto_taplicar_id = _const.maguita_taplicar_retirar as retirar,
        i.imposto_taplicar_id = _const.maguita_taplicar_adicionar as adicionar,
        iv.impostovenda_id,
        iv.impostovenda_valor,
        iv.impostovenda_percentagem,
        iv,
        coalesce( i.imposto_percentagem, ti.tipoimposto_percentagem ) as percentagem,
        coalesce( i.imposto_valor, ti.tipoimposto_valor ) as valor
      from tweeks.imposto i
        inner join tweeks.tipoimposto ti on i.imposto_tipoimposto_id = ti.tipoimposto_id
        left join tweeks.impostovenda iv on ti.tipoimposto_id = iv.impostovenda_tipoimposto_id
          and iv.impostovenda_venda_id = _simple.impostovenda_venda_id
          and iv.impostovenda_estado = _const.maguita_venda_estado_aberto
      where i.imposto_artigo_id = arg_artigo_id
        and i.imposto_estado = _const.maguita_imposto_estado_ativo
  ), __calc_value as (
    select
        ip.*,
        case
          when ip.valor and ip.valor > 0 then ip.valor
          when ip.percentagem and ip.percentagem > 0  then ( ip.percentagem / 100 ) * montante
        end as value_apply
      from __imposto ip
  ), __calc_percent as (
    select
        cv.*,
        case
          when cv.percentagem is not null and cv.percentagem > 0  then cv.percentagem
          when cv.value_apply is not null and cv.value_apply > 0 then cv.value_apply / montante * 100
        end as percent_apply
      from __calc_value cv
  ), __sync as (
    select
        c.*, "returning"
      from __calc_percent c
        inner join lib.sets( c.iv, replacer := jsonb_build_object(
          'impostovenda_colaborador_id', _simple.impostovenda_colaborador_id,
          'impostovenda_espaco_auth', _simple.impostovenda_espaco_auth,
          'impostovenda_venda_id', _simple.impostovenda_venda_id,
          'impostovenda_valor', c.impostovenda_valor,
          'impostovenda_percentagem', c.impostovenda_percentagem,
        ) || to_jsonb( _simple ) ) on true
      where true in (
        c.impostovenda_valor != c.value_apply,
        c.impostovenda_percentagem != c.percent_apply
      )
  ) select count( * ) as changes, array_agg( "returning" ) into _changes from __sync;
  */

  funct_pos__calc_imposto.venda_imposto := 0;
  funct_pos__calc_imposto.venda_impostoadicionar := 0;
  funct_pos__calc_imposto.venda_impostoretirar := 0;
  funct_pos__calc_imposto.venda_montantesemimposto := montante;
  funct_pos__calc_imposto.venda_montantecomimposto := montante;
  funct_pos__calc_imposto.impostos := jsonb_build_array();
  return next;
end;
$$;

