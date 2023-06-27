select map.constant_rename('posto_estado_fechado', 'maguita_posto_estado_fechado');
select map.constant_rename('posto_estado_encerado', 'maguita_posto_estado_encerado' );
select map.constant_rename('posto_estado_aberto', 'maguita_posto_estado_aberto' );

create or replace function tweeks.funct_change_posto_estado( args jsonb ) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_posto_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_posto_id uuid not null default args->>'arg_posto_id';
  _const map.constant;
  _posto tweeks.posto;
begin

  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );

  if _posto.posto_estado = _const.maguita_posto_estado_aberto then
    return false ? '@posto.estado.aberto.no-pode-encerar';
  end if;

  update tweeks.posto
    set
      posto_estado = lib.swith( posto_estado, _const.maguita_posto_estado_encerado, _const.maguita_posto_estado_fechado  ),
      posto_colaborador_atualizacao = arg_colaborador_id,
      posto_dataatualizacao = current_timestamp
    where posto_id = arg_posto_id
    returning * into _posto
  ;

  return true ? jsonb_build_object(
    'artigo', _posto,
    'artigo_old', _posto,
    'text', case
      when _posto.posto_estado = _const.maguita_posto_estado_fechado   then format( 'O posto "%s" foi ativado!', _posto.posto_designacao )
      when _posto.posto_estado = _const.maguita_posto_estado_encerado then format( 'O posto "%s" foi desativo!', _posto.posto_designacao )
    end
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


