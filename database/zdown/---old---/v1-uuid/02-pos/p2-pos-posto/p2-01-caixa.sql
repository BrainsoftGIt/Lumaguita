select map.constant_rename( 'caixa_estado_ativo', 'maguita_caixa_estado_ativo' );
select map.constant_rename( 'caixa_estado_fechado', 'maguita_caixa_estado_fechado' );


--
alter table tweeks.posto rename posto_multipleuser to posto_multiplecaixa;
alter table tweeks.posto add posto_caixalimite int default null;

create or replace function tweeks.funct_pos_load_caixa_auth( args jsonb )
returns setof jsonb
language plpgsql as $$
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
  _const map.constant;
  _posto tweeks.posto;

begin
  _const := map.constant();

  select * into _posto from tweeks.posto;

  return query with
  __posto as (
    select
        c.caixa_id,
        c.caixa_estado,
        c.caixa_montanteinicial,
        c.caixa_montanteinicialposto,
        p.posto_caixamode
      from tweeks.posto p
        inner join tweeks.caixa c on p.posto_id = c.caixa_posto_id
          and c.caixa_estado = _const.maguita_caixa_estado_ativo
          and case
            when p.posto_caixamode = _const.maguita_posto_caixamodo_pessoal then c.caixa_colaborador_id = arg_colaborador_id
            when p.posto_caixamode = _const.maguita_posto_caixamodo_espaco  then c.caixa_espaco_auth    = arg_espaco_auth
            when p.posto_caixamode = _const.maguita_posto_caixamodo_posto   then c.caixa_posto_id       = arg_posto_id
            else false
          end
      where p.posto_id = arg_posto_id
  ) select to_jsonb( p )
    from __posto p;
end;
$$;


drop function tweeks.funct_reg_caixa(args jsonb);
drop function if exists tweeks.funct_pos_reg_caixa(args jsonb);

alter table tweeks.caixa alter caixa_id set default public.uuid_generate_v4();
alter table tweeks.caixa alter caixa_estado set default map.get('maguita_caixa_estado_ativo')::int2;

drop trigger tg_caixa_after_insert_abrir_posto on tweeks.caixa;
drop trigger tg_caixa_after_updade_fechar_posto on tweeks.caixa;


create or replace function tweeks.funct_pos_reg_caixa(  args jsonb )
returns lib.res
  language plpgsql
as
$$
declare
  /** Essa função serve para registar uma nova caixa
    args := {
      arg_espaco_auth: ID
      arg_posto_id: ID
      arg_colaborador_id: ID
      caixa_montanteinicial: MONTANTE
    }
  */

  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_caixa_montanteinicial double precision not null default args->>'caixa_montanteinicial';

  _data record;
  _posto tweeks.posto;
  _caixa tweeks.caixa;
  _const map.constant;
begin

  select * into _posto
    from tweeks.posto
    where posto_id = arg_posto_id
  ;

  _const := map.constant();

  with __aloca as (
    select
        a.aloca_posto_id,
        sum( a.aloca_montante ) as aloca_montante
      from tweeks.aloca a
      where a.aloca_estado = _const.maguita_aloca_estado_ativo
        and a.aloca_posto_id = arg_posto_id
        and case
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_posto then true
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_espaco then a.aloca_espaco_destino = arg_espaco_auth
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_pessoal then a.aloca_espaco_destino = arg_espaco_auth
          else false
        end
      group by a.aloca_posto_id
  ), __caixa as (
    select
        cx.caixa_posto_id,
        mode() within group ( order by e.espaco_nome desc ) as espaco_nome,
        count( cx.caixa_id ) as posto_caixas
      from tweeks.caixa cx
        inner join tweeks.espaco e on cx.caixa_espaco_auth = e.espaco_id
      where cx.caixa_posto_id = arg_posto_id
        and cx.caixa_estado = _const.maguita_caixa_estado_ativo
      group by cx.caixa_posto_id
  ) select
        *,
        coalesce( aloca_montante, 0.0 ) as _aloca_montante
        into _data
      from tweeks.posto p
        left join __aloca al on p.posto_id = al.aloca_posto_id
        left join __caixa cx on p.posto_id = cx.caixa_posto_id
      where p.posto_id = arg_posto_id
  ;

  if  not _posto.posto_multiplecaixa and _data.posto_caixas > 0 then
    return lib.res_false(
      format( 'Esse posto só pode trabalhar com uma caixa a cada momento, por favor fechar primeiramente a caixa de %I!', _posto.espaco_nome )
    );
  end if;


  _caixa.caixa_colaborador_id := arg_colaborador_id;
  _caixa.caixa_posto_id := arg_posto_id;
  _caixa.caixa_montanteinicialposto := _data._aloca_montante;
  _caixa.caixa_montanteinicial := arg_caixa_montanteinicial;
  _caixa.caixa_espaco_auth := arg_espaco_auth;

  select ( "returning" ).* into _caixa
    from lib.sets_in(_caixa  )
  ;

  _posto.posto_estado := _const.maguita_posto_estado_aberto;
  select ( "returning" ).* into _posto from lib.sets_up( _posto );

  return lib.res_true( jsonb_build_object(
    'caixa', _caixa,
    'posto', _posto
  ));
end
$$;

drop function tweeks.funct_change_caixa_close( args jsonb );

select map.constant_rename( name, format( 'maguita_%s', name ) ) from map.describe( 'transacao_estado_ativo' );

create or replace function tweeks.funct_pos_change_caixa_close(args jsonb)
returns lib.res
language plpgsql
as
$$
declare
  /** Essa função serve para fechar uma posto
    args := {
      arg_caixa_id: ID,
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_caixa_montantefecho: MONTANTE,
      arg_caixa_quantidadecheque: QUANT,
      arg_caixa_observacao: OBS,
    }
  */

  arg_caixa_id uuid not null default args->>'arg_caixa_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_caixa_montantefecho  double precision not null default args->>'arg_caixa_montantefecho';
  arg_caixa_quantidadecheque int2 not null default args->>'arg_caixa_quantidadecheque';
  arg_caixa_observacao varchar default args->>'arg_caixa_observacao';

  _posto record;
  _caixa tweeks.caixa;
  _const map.constant;
  _movimentos record;

begin

  _const := map.constant();
  _caixa := tweeks._get_caixa( arg_caixa_id );

  if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
    return lib.res_false( 'Essa caixa não se encontra mais aberta!' );
  end if;

  select * into _posto
    from tweeks.posto cx
      inner join tweeks.caixa ab on cx.posto_id = ab.caixa_posto_id
    where ab.caixa_id = arg_caixa_id
      and ab.caixa_estado = _const.maguita_caixa_estado_ativo
      and cx.posto_estado = _const.maguita_posto_estado_aberto
  ;

  -- Obter a quantidade de cheque de venda
  select count( * ) into arg_caixa_quantidadecheque
    from tweeks.deposito de
    where de.deposito_caixa_id = _caixa.caixa_id
      and de.deposito_tpaga_id = _const.maguita_tpaga_cheque
      and de.deposito_modalidade = _const.maguita_tconta_cnormal
  ;

  with __deposito as  (
    select
        sum( de.deposito_montantefinal ) as deposito_montantefinal,
        count( de.deposito_id ) as depositos,
        count( de.deposito_id ) filter ( where de.deposito_tpaga_id = _const.maguita_tpaga_cheque ) as depositos_cheques
      from tweeks.deposito de
      where de.deposito_posto_id = _caixa.caixa_posto_id
        and de.deposito_modalidade = _const.maguita_tconta_cnormal
        and de.deposito_estado = _const.maguita_deposito_estado_ativo
  ), __transacao as (
    select
        sum( tr.transacao_montante ) as transacao_montante,
        sum( tr.transacao_montante ) filter ( where tr.transacao_montante >= 0 ) as transacao_montantecredito,
        sum( abs( tr.transacao_montante ) ) filter ( where tr.transacao_montante < 0 )  as transacao_montantedebito
      from tweeks.transacao tr
      where tr.transacao_posto_id = _caixa.caixa_posto_id
        and tr.transacao_estado = _const.maguita_transacao_estado_ativo
  ), __coa as (
    select
        _de.depositos,
        _de.depositos_cheques,
        coalesce( _de.deposito_montantefinal, 0.0 ) as deposito_montantefinal,
        coalesce( _tr.transacao_montante, 0.0 ) as transacao_montante,
        coalesce( _tr.transacao_montantecredito, 0.0 ) as transacao_montantecredito,
        coalesce( _tr.transacao_montantedebito, 0.0 ) as transacao_montantedebito
      from __deposito _de, __transacao _tr
  ) select
      _c.*,
      _c.transacao_montante + _c.deposito_montantefinal as posto_montantefinal
      into _movimentos
    from __coa _c
    ;

  _caixa.caixa_estado                   := _const.maguita_caixa_estado_fechado;
  _caixa.caixa_dataatualizacao          := current_timestamp;
  _caixa.caixa_colaborador_atualizacao  := arg_colaborador_id;
  _caixa.caixa_quantidadecheque         := arg_caixa_quantidadecheque;
  _caixa.caixa_quantidadechequeposto    := arg_caixa_quantidadecheque;
  _caixa.caixa_montantefecho            := arg_caixa_montantefecho;
  _caixa.caixa_montantefechoposto       := _movimentos.posto_montantefinal;
  _caixa.caixa_observacao               := arg_caixa_observacao;

  select ( "returning" ).* into _caixa
    from lib.sets_up( _caixa );

  return lib.res_true(jsonb_build_object(
    'caixa', _caixa
  ));
end;
$$;





