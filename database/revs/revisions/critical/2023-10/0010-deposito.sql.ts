import {sql} from "kitres";

export const funct_pos_reg_deposito = sql`
create or replace function tweeks.funct_pos_reg_deposito( args jsonb) returns lib.res
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
      deposito_documento: DOC?
      deposito_docref: NUMERO DOC?,
      _tgrupo_id: UID
      _serie_id: UID
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  _serie_id uuid default args->>'_serie_id';

  _deposito tweeks.deposito;
  _posto tweeks.posto;
  _const map.constant;
  _cambio record;
  _caixa tweeks.caixa;
  _raise bool;
  _rec record;

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
    return lib.res_false( 'Câmbio não foi encontrado!' );
  end if;

  _deposito.deposito_montante := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;

  if coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante and _raise then
    raise exception 'O montante de troco tem que ser inferior a montante cambiado!';
  elsif coalesce( _deposito.deposito_montantetroco, 0.0 ) >= _deposito.deposito_montante then
    return lib.res_false( 'O montante de troco tem que ser inferior a montante cambiado!' );
  end if;

  if _deposito.deposito_referencia is null or _deposito.deposito_documento is null then
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, (_const.maguita_tserie_recibo) /* Recibo*/, _serie_id );
    _deposito.deposito_documento := _rec.document;
    _deposito.deposito_serie := to_json( _rec );
    _deposito.deposito_serie_id := _rec.serie_id;
  end if;

--     if _deposito.deposito_referencia is null then
--         _deposito.deposito_documento := tweeks.__sets_generate_documento( arg_espaco_auth, 2 /*Fatura Recibo */  );
--     else
--         _deposito.deposito_documento := tweeks.__sets_generate_documento( arg_espaco_auth, 3 /* Recibo*/ );
--     end if;
--   --_deposito.deposito_documento := tweeks.__generate_deposito_serie( arg_espaco_auth );

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
`;