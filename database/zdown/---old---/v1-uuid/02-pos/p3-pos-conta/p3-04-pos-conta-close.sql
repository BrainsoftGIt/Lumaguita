
drop function tweeks.funct_change_conta_fechar( args jsonb );

create or replace function tweeks.__load_cambio_day(
  arg_espaco_auth uuid,
  arg_currency_id int2,
  arg_cambio_data date,
  _const map.constant default map.constant()

) returns TABLE(
  cambio_id uuid,
  cambio_taxa numeric,
  cambio_data date,
  cambio_estado smallint,
  cambio_dataregistro timestamptz
) language sql
as $$
  select
      cb.cambio_id,
      cb.cambio_taxa,
      cb.cambio_data,
      cb.cambio_estado,
      cb.cambio_dataatualizacao
    from tweeks.cambio cb
    where cb.cambio_currency_id = arg_currency_id
      and cb.cambio_data <= coalesce( arg_cambio_data, current_date )
      and cb.cambio_estado != _const.maguita_cambio_estado_anulado
      and cb.cambio_espaco_auth = arg_espaco_auth
    order by cb.cambio_dataregistro desc
    limit 1;
$$;

select * from tweeks.tpaga;


create table tweeks.tconta(
  tconta_id int2 not null,
  tconta_desc character varying not null,
  constraint pk_tmodalidade_id primary key ( tconta_id )
);

insert into tweeks.tconta( tconta_id, tconta_desc ) values ( 1, 'Conta normal' );
insert into tweeks.tconta( tconta_id, tconta_desc ) values ( 2, 'Conta corrente' );

select map.constant( 'maguita_tconta_cnormal', 'int2', 1, 'Conta normal' );
select map.constant( 'maguita_tconta_ccorrente', 'int2', 2, 'Conta correte' );

alter table tweeks.conta drop conta_montantemoeda;
alter table tweeks.conta drop conta_currency_id;
alter table tweeks.conta drop conta_tmodalidade_id;
alter table tweeks.conta drop conta_taxacambio;

alter table tweeks.conta add conta_tconta_id int2;
alter table tweeks.conta alter conta_tconta_id set not null;
alter table tweeks.conta add constraint fk_conta_to_tconta foreign key ( conta_tconta_id ) references tweeks.tconta;


create or replace function tweeks.funct_pos_change_conta_fechar(args jsonb)
returns lib.res
    language plpgsql
as
$$
declare
  /**
    Essa função fecha uma nova conta
    arg = {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,

      deposito:{
        deposito_cliente_id
        deposito_caixa_id
        deposito_tpaga_id
        deposito_currency_id
        deposito_posto_id
        deposito_montantemoeda
        deposito_montantetroco
        deposito_data
        deposito_docref: DOCUMENTO-REF?
        deposito_observacao: OBSERVACAO?
      }

      conta_id: ID,
      conta_extension: {} | { reserva_id: UID }
      conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM },

      conta_posto_id: ID,
      conta_desconto

      conta_titular: NOME-CLIENTE
      conta_titularnif: VARCHAR,
      conta_data: DATA,
      conta_cliente_id
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';

  arg_conta_id uuid default args->>'conta_id';
  arg_caixa_id uuid default args->>'de_caixa_id';
  _deposito_montantetroco double precision;
  _deposito_modalidade int2;


  _conta tweeks.conta;
  _const map.constant;
  _caixa tweeks.caixa;
  _res lib.res;
  _cambio record;
  _montante_amortizacao double precision;
  _deposito tweeks.deposito;
begin

  _const := map.constant();
  _caixa := tweeks._get_caixa( arg_caixa_id );

  _conta := tweeks._get_conta( arg_conta_id );
  _conta := jsonb_populate_record( _conta, args );
  _conta.conta_data := coalesce( _conta.conta_data, current_date );

  _deposito := jsonb_populate_record( _deposito, args->'deposito' );

  _conta.conta_tconta_id := case
    when _deposito.deposito_montantemoeda is null then _const.maguita_tconta_ccorrente
    else _const.maguita_tconta_cnormal
  end;

  if _conta.conta_posto_fecho is null then
    return lib.res_false( 'Necessario indicar o posto de fecho!' );
  end if;

  -- Quando for conta corrente
  if _deposito.deposito_montantemoeda is null
    and true in (
      _conta.conta_cliente_id is null,
      _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    )
  then
    return lib.res_false( 'Não pode abrir uma conta corrente para o cliente final' );

  -- Quando for conta normal
  elseif _conta.conta_tconta_id = _const.maguita_tconta_cnormal then
    if _deposito.deposito_tpaga_id = _const.maguita_tpaga_contacorrente then
      return lib.res_false( 'Tipo de pagamento invalido' );
    end if;

    select * into _cambio from tweeks.__load_cambio_day(
      arg_espaco_auth,
      _deposito.deposito_currency_id,
      _conta.conta_data,
      _const
    );

    if _cambio.cambio_id is null then
      return lib.res_false('@tweeks.conta.cambio-not-found' );
    end if;

    -- Se for para amortizar a conta a caixa tem que estar aberta
    if _deposito.deposito_montantemoeda > 0 and _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
      return lib.res_false(
          '@tweeks.conta.payment-rejected-on-closed-station'
        );
    end if;
  end if;

  _conta.conta_estado := _const.maguita_conta_estado_fechado;
  _conta.conta_imprensa := _conta.conta_imprensa +1;
  _conta.conta_colaborador_fecho := arg_colaborador_id;
  _conta.conta_datafecho := current_timestamp;
  _conta.conta_cliente_id := coalesce( _conta.conta_cliente_id, lib.to_uuid( 1 ) );

  select ( "returning" ).* into _conta
    from lib.sets_up( _conta )
  ;

  if coalesce( _deposito.deposito_montantemoeda, 0.0 ) > 0 then

    _montante_amortizacao  := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;

    if _montante_amortizacao > _conta.conta_montante and _conta.conta_tconta_id != _const.maguita_tconta_ccorrente then
      _deposito_montantetroco := _montante_amortizacao - _conta.conta_montante;
    end if;

    _deposito_montantetroco := coalesce( _deposito_montantetroco, _deposito.deposito_montantetroco, 0.0 );

    _deposito_modalidade := _conta.conta_tconta_id;
    _res := tweeks.funct_pos_reg_deposito(( args->'deposito' ) || jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_balance_accounts', false,
      'deposito_cliente_id', _conta.conta_cliente_id,
      'deposito_montantetroco', _deposito_montantetroco,
      'deposito_modalidade', _deposito_modalidade,
      'deposito_referencia', lib.sets_ref( _conta ),
      '_raise', true
    ));

    if not _res.result then
      perform lib.result_exception(
        _res.message,
        detail := _res.data::text,
        hint := _res.error::text
      );
    else
      _deposito := jsonb_populate_record( null::tweeks.deposito, _res.data->'deposito' );
    end if;
  end if;

  return lib.res_true(
    message := '@tweeks.conta.invoice-closed-success',
    data := jsonb_build_object(
      'conta', tweeks._get_conta( _conta.conta_id ),
      'fatura', _conta.conta_numerofatura,
      'recibo', _deposito.deposito_documento
    )
  );
end;
$$;

create or replace function tweeks.__tg_conta_after_close()
returns trigger
language plpgsql as $$
declare

  _new tweeks.conta;
  _old tweeks.conta;
  _const map.constant;
begin
  if cluster.__is_replication() then
    return null;
  end if;

  _new := new;
  _old := old;
  _const := map.constant();

  if _new.conta_estado != _old.conta_estado and _new.conta_estado in (
    _const.maguita_conta_estado_fechado,
    _const.maguita_conta_estado_anulado
  ) then
    update tweeks.venda
      set venda_estado = case
            when _new.conta_estado = _const.maguita_conta_estado_fechado then _const.maguita_venda_estado_fechado
            when _new.conta_estado = _const.maguita_conta_estado_anulado then _const.maguita_venda_estado_anulado
        end
      where venda_estado = _const.maguita_venda_estado_aberto
        and venda_conta_id = _old.conta_id;
  end if;

  return null;
end;
$$;

create trigger tg_conta_after_close
  after update on tweeks.conta
  for each row
  when(
    new.conta_estado != old.conta_estado
      and map.any_equal( new.conta_estado, 'maguita_conta_estado_fechado', 'maguita_conta_estado_anulado' )
      and not cluster.__is_replication()
  )
  execute procedure tweeks.__tg_conta_after_close();

drop function rule.tg_movimento_after_update_adjust_stock() cascade;
drop function rule.tg_movimento_after_insert_adjust_stock() cascade;



alter table tweeks.amortizacao add amortizacao_posto_id uuid;
drop trigger tg_amortizacao_afeter_insert_syncronize_montante on tweeks.amortizacao;
alter table tweeks.amortizacao add amortizacao_cliente_id uuid;

update tweeks.amortizacao aa
 set amortizacao_cliente_id = lib.to_uuid( 1 ),
     amortizacao_posto_id = cx.caixa_posto_id
  from tweeks.amortizacao a
    inner join tweeks.caixa cx on a.amortizacao_caixa_id = cx.caixa_id
  where a.amortizacao_id = aa.amortizacao_id
;

alter table tweeks.amortizacao alter amortizacao_posto_id set not null ;
alter table tweeks.amortizacao alter amortizacao_cliente_id set not null ;


alter table tweeks.amortizacao rename to deposito;


alter table tweeks.deposito rename amortizacao_id                      to deposito_id;
alter table tweeks.deposito rename amortizacao_caixa_id                to deposito_caixa_id;
alter table tweeks.deposito rename amortizacao_tpaga_id                to deposito_tpaga_id;
alter table tweeks.deposito rename amortizacao_currency_id             to deposito_currency_id;
alter table tweeks.deposito rename amortizacao_espaco_auth             to deposito_espaco_auth;
alter table tweeks.deposito rename amortizacao_colaborador_id          to deposito_colaborador_id;
alter table tweeks.deposito rename amortizacao_colaborador_atualizacao to deposito_colaborador_atualizacao;
alter table tweeks.deposito rename amortizacao_referencia              to deposito_referencia;
alter table tweeks.deposito rename amortizacao_documento               to deposito_documento;
alter table tweeks.deposito rename amortizacao_data                    to deposito_data;
alter table tweeks.deposito rename amortizacao_montante                to deposito_montante;
alter table tweeks.deposito rename amortizacao_montantetroco           to deposito_montantetroco;
alter table tweeks.deposito rename amortizacao_montantemoeda           to deposito_montantemoeda;
alter table tweeks.deposito rename amortizacao_taxacambio              to deposito_taxacambio;
alter table tweeks.deposito rename amortizacao_estado                  to deposito_estado;
alter table tweeks.deposito rename amortizacao_dataregistro            to deposito_dataregistro;
alter table tweeks.deposito rename amortizacao_dataatualizacao         to deposito_dataatualizacao;
alter table tweeks.deposito rename amortizacao_posto_id                to deposito_posto_id;
alter table tweeks.deposito rename amortizacao_cliente_id              to deposito_cliente_id;

alter table tweeks.deposito drop deposito_montantetroco;

alter table tweeks.espaco add espaco_seriedeposito int8 not null default 0;



alter table tweeks.deposito alter deposito_estado set default map.get( 'maguita_deposito_estado_ativo' )::int2;

alter table tweeks.deposito add deposito_modalidade int2;
select map.constant( 'maguita_deposito_modalidade_normal', 'int2', 1, 'Deposito normal sem conta corrente'  );
select map.constant( 'maguita_deposito_modalidade_ccorrente', 'int2', 2, 'Deposito de conta corrente' );

alter table tweeks.deposito alter deposito_modalidade set not null;


create or replace function tweeks.__generate_deposito_serie( arg_espaco_auth uuid )
returns character varying
strict
language plpgsql as $$
declare
  _data record;
begin
  with __espaco_serie as(
    update tweeks.espaco
      set espaco_seriedeposito = espaco_seriedeposito +1
      where espaco_id = arg_espaco_auth
      returning espaco_seriedeposito
  )
    select
        format( 'PAG/%s', trim( to_char( 939, '0000-0000-0000' ) ) ) as deposito_serie
        into _data
      from __espaco_serie e
    limit 1
  ;

  return _data.deposito_serie;
end;
$$;

drop function tweeks.funct_reg_amortizacao( args jsonb );

alter table tweeks.conta add conta_datafecho timestamptz default null;
alter table tweeks.conta add conta_datapagamento timestamptz default null;

select * from tweeks.__balance_accounts( '00000000-0000-0000-0000-000000000001', null::uuid, null::uuid );



delete from tweeks.venda where true;
delete from tweeks.conta where true;
delete from tweeks.deposito where true;


select array[1, 2, 3, 4 ] @> array [1, 2 ]::int[];


alter table tweeks.deposito add deposito_montantetroco double precision not null  default 0.0;
alter table tweeks.deposito add deposito_montantefinal double precision generated always as ( deposito_montante - deposito_montantetroco ) stored;
alter table tweeks.deposito add deposito_docref character varying default null;
alter table tweeks.deposito add deposito_observacao character varying default null;

comment on column tweeks.deposito.deposito_docref is 'Corresponde ao numero de documento usado externamente para o deposito';
comment on column tweeks.deposito.deposito_observacao is 'Corresponde a observação do deposito';
comment on column tweeks.deposito.deposito_referencia is 'Corresponde a referencia interna/externa no qual o deposito se associa (conta_id)';

create or replace function tweeks.funct_pos_reg_deposito(
  args jsonb
) returns lib.res
  language plpgsql
as
$$
declare
  /** Essa função serve para registar uma nova amortizacao
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,

      deposito_montantetroco: TROCO*
      deposito_caixa_id: UID,
      deposito_tpaga_id: ID,
      deposito_currency_id: UID,
      deposito_posto_id: UID,
      deposito_cliente_id: UID,
      deposito_referencia: {conta_id}
      deposito_montantemoeda: MONTANTE,
      deposito_data: DATA,
      deposito_observacao: OBS?
      deposito_docref: NUMERO DOC?,
      deposito_modalidade
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';

  _deposito tweeks.deposito;
  _posto tweeks.posto;
  _const map.constant;
  _cambio record;
  _caixa tweeks.caixa;
  _raise bool;

begin

  _raise := args->>'_raise';

  _const := map.constant();
  _deposito := jsonb_populate_record( _deposito, args );


  if _deposito.deposito_posto_id is not null then
    _posto := tweeks._get_posto( _deposito.deposito_posto_id );
  end if;

  if _deposito.deposito_caixa_id is not null then
    _caixa := tweeks._get_caixa( _deposito.deposito_caixa_id );
    if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo and _raise then
      raise exception 'Não pode registar um deposito numa caixa fechado!';
    elseif _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
      return lib.res_false( 'Não pode registar um deposito numa caixa fechado!' );
    end if;
  end if;
  _deposito.deposito_data := coalesce( _deposito.deposito_data, current_date );
  _deposito.deposito_colaborador_id := arg_colaborador_id;
  _deposito.deposito_espaco_auth := arg_espaco_auth;

  select * into _cambio from tweeks.__load_cambio_day(
    arg_espaco_auth,
    _deposito.deposito_currency_id,
    current_date,
    _const
  );

  if _cambio.cambio_id is null and _raise then
    raise exception '@tweeks.conta.cambio-not-found';
  elseif _cambio.cambio_id is null then
    return lib.res_false( '@tweeks.conta.cambio-not-found' );
  end if;

  _deposito.deposito_montante := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;

  if coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante and _raise then
    raise exception 'O montante de troco tem que ser inferior a montante cambiado!';
  elsif coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante then
    return lib.res_false( 'O montante de troco tem que ser inferior a montante cambiado!' );
  end if;

  _deposito.deposito_documento := tweeks.__generate_deposito_serie( arg_espaco_auth );

  select ( "returning" ).* into _deposito
    from lib.sets( _deposito )
  ;

  return lib.res_true(
    jsonb_build_object(
      'deposito', _deposito
    )
  );
end;
$$;


select
  l.lancamento_credito - l.lancamento_debito as valor,
  sum( l.lancamento_credito - l.lancamento_debito ) over (partition by 1 order by lancamento_sequencia )
from tweeks.lancamento l ;


