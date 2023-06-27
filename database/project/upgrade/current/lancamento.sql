create or replace function tweeks.sets_lancamento( args jsonb )
returns lib.res
  language plpgsql
as
$$
declare
  /*
    arg_espaco_auth?:UUID
    arg_colaborador_id?:UUID

    lancamento_id?: UID
    arg_lancamento_incrementevia:BOOLEAN

    lancamento_tlancamento_id: SELECT*
    _tgrupo_id [{ maguita_tgrupo_ccorrente | maguita_tgrupo_cnormal }] default maguita_tgrupo_ccorrente
    lancamento_operacao := CREDITO => 1 | DEBITO => -1;
    lancamento_valor := _deposito.deposito_montantefinal;
    lancamento_cliente_id*
    lancamento_data := DATE;
    lancamento_documento?: DOCUMENTO;
    lancamento_descricao: DESCRICAO
   */
  _const map.constant;
  _lancamento tweeks.lancamento;

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_lancamento_incrementevia uuid default args->>'arg_lancamento_incrementevia';
begin

  _const := map.constant();
  _lancamento := jsonb_populate_record( _lancamento, args );
  _lancamento._tgrupo_id := coalesce( _lancamento._tgrupo_id, _const.maguita_tgrupo_ccorrente );

  if _lancamento.lancamento_id is null then
    _lancamento.lancamento_mode := _const.maguita_lancamento_mode_manual;
    _lancamento.lancamento_espaco_auth := coalesce( _lancamento.lancamento_espaco_auth, arg_espaco_auth );
    _lancamento.lancamento_colaborador_id := coalesce( _lancamento.lancamento_colaborador_id, arg_colaborador_id );
    _lancamento.lancamento_referencia := jsonb_build_object();
    _lancamento._branch_uid := coalesce( _lancamento._branch_uid, tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth ) );
  else
    _lancamento.lancamento_colaborador_atualizacao := arg_colaborador_id;
    _lancamento.lancamento_dataatualizacao := now();
    if arg_lancamento_incrementevia then
      _lancamento.lancamento_via := coalesce( _lancamento.lancamento_via, 1)+1;
    end if;
  end if;

  select ( "returning" ).* into _lancamento
    from lib.sets( _lancamento )
  ;

  return lib.res_true(jsonb_build_object(
    '_lancamento', _lancamento
  ));
end;
$$;

create or replace function tweeks.funct_load_lancamento( args jsonb ) returns SETOF jsonb
  language plpgsql
as
$$
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
  arg_tgrupo_id int2 default args->>'arg_tgrupo_id';
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
          la.lancamento_dataregistro,
          la.lancamento_refid,
          la.lancamento_regclass,
          la.lancamento_referencia,
          la.lancamento_documento,
          la.lancamento_montante,
          la.lancamento_operacao,
          la.lancamento_sequencia,
          la.lancamento_via,
          la.lancamento_valor
        from tweeks.lancamento la
        where la.lancamento_cliente_id = arg_cliente_id
          and la.lancamento_estado = _const.maguita_lancamento_estado_ativo
          and la._tgrupo_id = arg_tgrupo_id
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
