
drop function if exists tweeks.funct_change_conta_anular(args jsonb);

create or replace function tweeks.funct_pos_change_conta_anular(args jsonb)
  returns lib.res
  language plpgsql
as
$$
declare
  /** Essa função serve para atualar as contas
    args := {
      arg_conta_id: ID,
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_conta_observacao: OBSERVACAO
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_conta_id uuid default args->>'arg_conta_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_conta_observacao varchar default args->>'arg_conta_observacao';

  _conta tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  arg_conta_observacao := lib.str_nospace( arg_conta_observacao );

  if _conta.conta_estado  = _const.maguita_conta_estado_anulado then
    return lib.res_false( 'Essa conta já está anulado' );
  end if;

  if _conta.conta_estado != _const.maguita_conta_estado_aberto and arg_conta_observacao is null then
    return lib.res_false( 'É necessario informar uma obseravção para anular as contas fechadas e pagas' );
  end if;

  _conta.conta_estado                   := _const.maguita_conta_estado_anulado;
  _conta.conta_colaborador_atualizacao  := arg_colaborador_id;
  _conta.conta_dataatualizacao          := current_timestamp;
  _conta.conta_observacao               := arg_conta_observacao;

  select ( "returning" ).* into _conta
    from lib.sets_up( _conta )
  ;

  return lib.res_true( jsonb_build_object( 'conta', _conta ) );
end;
$$;

