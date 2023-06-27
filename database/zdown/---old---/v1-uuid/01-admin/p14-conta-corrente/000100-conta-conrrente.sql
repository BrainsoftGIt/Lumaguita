

create or replace function tweeks.funct_load_cliente( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_espaco_auth: UUID,
      arg_colaborador_id: UUID
    }
   */
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_branch uuid default tweeks.__space_branch_main( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();
  return query
    with
      __deposito as (
        select
            de.deposito_cliente_id,
            sum( de.deposito_montantefinal ) as balanco_credito,
            sum( de.deposito_montantefinal ) filter ( where de.deposito_modalidade = _const.maguita_tconta_cnormal ) as   balanco_creditonormal,
            sum( de.deposito_montantefinal ) filter ( where de.deposito_modalidade = _const.maguita_tconta_ccorrente ) as balanco_creditocorrente,
            count( de.deposito_id ) as depositos
          from tweeks.deposito de
          where de.deposito_espaco_branch = arg_espaco_branch
          group by de.deposito_cliente_id

      ), __conta as (
        select
            ct.conta_cliente_id,
            count( ct.conta_id ) as conta_total,
            count( ct.conta_id ) filter ( where ct.conta_tconta_id = _const.maguita_tconta_ccorrente ) as conta_corrente,
            count( ct.conta_id ) filter ( where ct.conta_tconta_id = _const.maguita_tconta_cnormal ) as conta_normal,
            sum( ct.conta_montante ) as balanco_debito,
            sum( ct.conta_montante ) filter ( where ct.conta_tconta_id = _const.maguita_tconta_cnormal ) as   balanco_debitonormal,
            sum( ct.conta_montante ) filter ( where ct.conta_tconta_id = _const.maguita_tconta_ccorrente ) as balanco_debitocorrente
          from tweeks.conta ct
          where ct.conta_espaco_branch = arg_espaco_branch
            and ct.conta_estado = _const.maguita_conta_estado_fechado
          group by ct.conta_cliente_id

      ), __cliente as (
        select
            c.cliente_id,
            c.cliente_titular,
            c.cliente_nif,
            c.cliente_contactos,
            c.cliente_mail,
            c.cliente_estado,
            coalesce( _de.balanco_credito, 0.0 ) as balanco_credito,
            coalesce( _de.balanco_creditonormal, 0.0 ) as balanco_creditonormal,
            coalesce( _de.balanco_creditocorrente, 0.0 ) as balanco_creditocorrente,
            coalesce( _de.depositos, 0 ) as depositos,
            coalesce( _ct.conta_total, 0 ) as conta_total,
            coalesce( _ct.conta_corrente, 0 ) as conta_corrente,
            coalesce( _ct.conta_normal, 0 ) as conta_normal,
            coalesce( _ct.balanco_debito, 0.0 ) as balanco_debito,
            coalesce( _ct.balanco_debitocorrente, 0.0 ) as balanco_debitocorrente,
            coalesce( _ct.balanco_debitonormal, 0.0 ) as balanco_debitonormal
          from tweeks.cliente c
            left join __deposito _de on c.cliente_id = _de.deposito_cliente_id
            left join __conta _ct on c.cliente_id = _ct.conta_cliente_id
          where cliente_espaco_branch = arg_espaco_branch
      ), __cliente_saldo as (
        select
            _c.*,
            _c.balanco_creditonormal - _c.balanco_debitonormal as balanco_normal,
            _c.balanco_creditocorrente - _c.balanco_debitocorrente as balanco_corrente,
            _c.balanco_credito - _c.balanco_debito as balanco_final
          from __cliente _c
      ) select to_jsonb( _cl )
        from __cliente_saldo _cl;
end;
$$;

create or replace function tweeks.funct_load_lancamento(
  args jsonb
) returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_colaborador_id: UID,
      arg_espaco_auth: UID,
      arg_cliente_id: UID,
      arg_lancamento_tmodalidade_conta
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_lancamento_tmodalidade_conta int2 default args->>'arg_lancamento_tmodalidade_conta';
  arg_cliente_id uuid default args->>'arg_cliente_id';
  _const map.constant;
begin
  _const := map.constant();
  return query
    with recursive __lancamento as (
      select
          row_number() over () as lancamento_posicao,
          la.lancamento_id,
          la.lancamento_descricao,
          la.lancamento_credito,
          la.lancamento_debito,
          la.lancamento_data,
          la.lancamento_dataregistro
        from tweeks.lancamento la
        where la.lancamento_cliente_id = arg_cliente_id
          and la.lancamento_estado = _const.maguita_lancamento_estado_ativo
          and la.lancamento_tmodalidade_conta = arg_lancamento_tmodalidade_conta
        order by la.lancamento_dataregistro,
          la.lancamento_sequencia
    ), __lancamento_saldo as (
      select
          _la.*,
          _la.lancamento_credito - _la.lancamento_debito as lancamento_valor,
          _la.lancamento_credito - _la.lancamento_debito as lancamento_saldo
        from __lancamento _la
        where _la.lancamento_posicao = 1
        union all
          select
              _la.*,
              _la.lancamento_credito - _la.lancamento_debito as lancamento_valor,
              _ls.lancamento_saldo + ( _la.lancamento_credito - _la.lancamento_debito ) as lancamento_saldo
      from __lancamento_saldo _ls
        inner join __lancamento _la on _ls.lancamento_posicao + 1 = _la.lancamento_posicao
    ) select to_jsonb( _ls )
        from __lancamento_saldo _ls;
end;
$$;

/*
  if SALDO_ATUAL < 0 and TROCO_CALCULADO > 0 then
    ->> PODE MOSTAR O TROCO_CALCULADO
    ->> PODE EDITAR O TROCO_CALCULADO
    ->> TROCO_EDITADO TEM QUE ESTAR NO INTERVALO DE 0 Á TROCO_CALCULAOD
  else
    ->> NÂO APRESENTAR O TROCO_CALCULAOD
    ->> NÃO PERMITIR EDITAR TROCO (TROCO_EDITADO := 0)
  end if;
 */

select * from map.describe( 'maguita_tconta');

alter table tweeks.deposito alter deposito_posto_id drop not null;
alter table tweeks.deposito alter deposito_caixa_id drop not null;

truncate tweeks.deposito;
truncate tweeks.conta cascade;
truncate tweeks.lancamento;


select * from tweeks.funct_load_cambio_ativo(jsonb_build_object(
  'arg_espaco_auth', lib.to_uuid( 2 )
));

with __cambio as (
  select
    cb.cambio_id,
    cb.cambio_data,
    cb.cambio_taxa,
    cb.cambio_dataregistro,
    cu.currency_id,
    cu.currency_name,
    cu.currency_code,
    cu.currency_symbol,
    rank() over ( partition by cb.cambio_currency_id order by
      case when cambio_espaco_auth = lib.to_uuid( 2 ) then 1 else 2 end,
      cb.cambio_dataregistro desc )  as cambio_rank
  from tweeks.cambio cb
    inner join geoinfo.currency cu on cb.cambio_currency_id = cu.currency_id
  where cb.cambio_estado = (map.constant()).cambio_estado_ativo
    and cb.cambio_espaco_auth = lib.to_uuid( 2 )
) select *
from __cambio cb;
-- where cb.cambio_rank = 1;

create or replace function tweeks.funct_load_cambio_ativo(
  args jsonb
) returns setof jsonb
strict
language plpgsql as $$
declare
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __cambio as (
      select
          cb.cambio_id,
          cb.cambio_data,
          cb.cambio_taxa,
          cb.cambio_dataregistro,
          cu.currency_id,
          cu.currency_name,
          cu.currency_code,
          cu.currency_symbol,
          rank() over ( partition by cb.cambio_currency_id order by
            case when cambio_espaco_auth = arg_espaco_auth then 1 else 2 end,
            cb.cambio_dataregistro desc )  as cambio_rank
        from tweeks.cambio cb
          inner join geoinfo.currency cu on cb.cambio_currency_id = cu.currency_id
        where cb.cambio_estado = _const.cambio_estado_ativo
          and cb.cambio_espaco_auth = arg_espaco_auth
    ) select
        to_jsonb( cb )
      from __cambio cb
      where cb.cambio_rank = 1
  ;
end;
$$;
select -230 + 250;

/**
  SALDO: -230 STN
  DEPOS: +250 STN
  TROCO: +20
 */