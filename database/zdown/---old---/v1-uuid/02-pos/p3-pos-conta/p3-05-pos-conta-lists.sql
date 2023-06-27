
drop function tweeks.funct_pos_load_conta_aberto(args jsonb);
create or replace function tweeks.funct_pos_load_conta_aberto( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_colaborador_id: UID*,
      arg_espaco_auth: UID?,
      arg_posto_id: UID*
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __conta as(
      select
          ct.conta_id,
          ct.conta_numero,
          ct.conta_montante,
          ct.conta_mesa,
          c.colaborador_id,
          c.colaborador_nome,
          c.colaborador_apelido,
          e.espaco_id,
          e.espaco_nome,
          count( ve.venda_id ) as conta_vendas
        from tweeks.conta ct
          inner join auth.colaborador c on ct.conta_colaborador_id = c.colaborador_id
          inner join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
          left join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
            and ve.venda_estado = _const.maguita_venda_estado_aberto
            and ve.venda_venda_id is null
        where ct.conta_posto_id = arg_posto_id
          and ct.conta_estado = _const.maguita_conta_estado_aberto
          and ct.conta_espaco_auth = coalesce( arg_espaco_auth, ct.conta_espaco_auth )
          and not ct.conta_proforma
        group by
          c.colaborador_id,
          ct.conta_id,
          e.espaco_id
    ) select to_jsonb( ct ) from __conta ct;
end;
$$;

alter table tweeks.conta rename conta_caixa_fechopagamento to conta_posto_fecho;
alter table tweeks.conta drop constraint fk_conta_to_caixa_fechopagamento;

update tweeks.conta c1
  set conta_posto_fecho = c2.caixa_posto_id
  from tweeks.caixa c2
  where c2.caixa_id = c1.conta_posto_fecho
;

alter table tweeks.conta add constraint fk_conta_to_posto_fecho
  foreign key ( conta_posto_fecho ) references tweeks.posto;

select * from tweeks.posto;

select * from tweeks.funct_pos_load_conta_dia('{"arg_posto_id": "46cec488-fa69-491e-a335-396ffbb1b1d5"}');

select * from tweeks.conta;

create or replace function tweeks.funct_pos_load_conta_dia(filter jsonb DEFAULT NULL::jsonb)
 returns SETOF jsonb
    language plpgsql
as
$$
declare
  /** Essa função serve para devolver as compras do dia em uma data especifica
    filter := {
      arg_conta_data: DATE
      arg_posto_id: DATE
    }
   */
  _const map.constant;
  arg_conta_data date default filter->>'arg_conta_data';
  arg_posto_id uuid not null default filter->>'arg_posto_id';
begin

  _const := map.constant();
  arg_conta_data := coalesce( arg_conta_data, current_date );

  if arg_conta_data < current_date - make_interval( days := 7 ) then return; end if;

  return query
    with __conta as (
      select
          ct.conta_id,
          ct.conta_data,
          ct.conta_dataregistro,
          ct.conta_titular,
          ct.conta_titularnif,
          ct.conta_montante,
          ct.conta_numerofatura,
          ct.conta_numero,
          p.posto_designacao,
          p.posto_matricula,
          de.deposito_montante,
          de.deposito_montantemoeda,
          de.deposito_montantetroco,
          de.deposito_montantefinal,
          de.deposito_taxacambio,
          cu.currency_id,
          cu.currency_code,
          cu.currency_name,
          co.colaborador_id,
          co.colaborador_nome
        from tweeks.conta ct
          inner join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
          inner join tweeks.deposito de on de.deposito_referencia @> lib.sets_ref( ct )
          inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
          inner join auth.colaborador co on ct.conta_colaborador_fecho = co.colaborador_id
        where ct.conta_posto_fecho = arg_posto_id
          and ct.conta_estado = _const.maguita_conta_estado_fechado
          and ct.conta_tconta_id = _const.maguita_tconta_cnormal
          and ct.conta_data = arg_conta_data
    ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
$$;


create or replace function tweeks.funct_pos_load_conta_proforma(filter jsonb DEFAULT NULL::jsonb)
 returns SETOF jsonb
    language plpgsql
as
$$
declare
  /** Essa função serve para devolver as compras do dia em uma data especifica
    filter := {
      arg_posto_id: DATE
    }
   */
  _const map.constant;
  arg_posto_id uuid not null default filter->>'arg_posto_id';
  arg_colaborador_id uuid not null default filter->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';

  _posto tweeks.posto;
  _espaco_branch uuid;
begin
  _posto := tweeks._get_posto( arg_posto_id );
  _espaco_branch := tweeks.__space_branch_main( arg_espaco_auth );

  _const := map.constant();

  return query
    with __conta as (
      select
          ct.conta_id,
          ct.conta_data,
          ct.conta_dataregistro,
          ct.conta_titular,
          ct.conta_titularnif,
          ct.conta_montante,
          ct.conta_numerofatura,
          ct.conta_numero,
          ct.conta_proformavencimento,
          ct.conta_proformaextras,
          cli.cliente_id,
          cli.cliente_titular,
          cli.cliente_nif,
          cli.cliente_documento,
          td.tdocumento_id,
          td.tdocumento_nome,
          co.colaborador_id,
          co.colaborador_nome,
          co.colaborador_apelido
        from tweeks.conta ct
          left join auth.colaborador co on coalesce( ct.conta_colaborador_fecho, ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = co.colaborador_id
          left join tweeks.cliente cli on ct.conta_cliente_id = cli.cliente_id
          left join tweeks.tdocuemto td on cli.cliente_tdocument_id = td.tdocumento_id
        where ct.conta_espaco_branch = arg_espaco_auth
          and ct.conta_estado = _const.maguita_conta_estado_aberto
          and ct.conta_proforma
    ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
$$;



select *
  from tweeks.funct_pos_load_conta_proforma('{
    "arg_posto_id":
  }');

select * from tweeks.posto;