import {sql} from "kitres";

export const funct_sets_autorizacao_continue = sql`
create or replace function tweeks.funct_sets_autorizacao_continue(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      autorizacao_uid: UID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

  _autorizacao tweeks.autorizacao;
  _const map.constant;
  _data record;
begin
  _autorizacao := tweeks.__get_autorizacao( ( args->>'autorizacao_uid' )::uuid );
  _const := map.constant();
  with __serie as (
    select
        serie_tserie_id,
        serie_espaco_id,
        serie_designacao,
        format('%s%s', substr( serie_numero, 1, length( serie_numero )-2 ), to_char( current_date, 'yy')) as serie_numero,
        serie_quantidade,
        serie_numcertificacao,
        serie_numatorizacao,
        case 
          when _autorizacao.autorizacao_ano = extract( years from current_date)::int then serie_sequencia
          else 0
        end as serie_sequencia
      from tweeks.serie se
      where se.serie_autorizacao_uid = _autorizacao.autorizacao_uid
        and se.serie_estado = _const.maguita_serie_estado_fechado
        and se.serie_fechoautorizacao
        and se._branch_uid = arg_branch_uid
  ) select
        jsonb_agg( to_jsonb( _s ) ) as series
        into _data
      from __serie _s;

  return tweeks.funct_sets_autorizacao( jsonb_build_object(
    'arg_colaborador_id', arg_colaborador_id,
    'arg_espaco_auth', arg_espaco_auth,
    '_autorizacao_continue', _autorizacao,
    'autorizacao_uid', null,
    'autorizacao_espaco_uid', _autorizacao.autorizacao_espaco_uid,
    'autorizacao_designacao', _autorizacao.autorizacao_designacao,
    'autorizacao_numero', _autorizacao.autorizacao_numero,
    'series', _data.series
  ));
end;
$$;
`;