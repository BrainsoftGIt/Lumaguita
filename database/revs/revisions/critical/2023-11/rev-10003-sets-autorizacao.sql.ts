import {patchSQL, sql} from "kitres";


export const add_autorizacao_autorizacao_uid = patchSQL({ unique: true }).sql`
alter table tweeks.autorizacao add if not exists autorizacao_autorizacao_continuer uuid;
`;

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
  lock table tweeks.autorizacao;
  _autorizacao := tweeks.__get_autorizacao( ( args->>'autorizacao_uid' )::uuid );
  _const := map.constant();
  
  if exists( 
    select 
      from tweeks.autorizacao a
      where autorizacao_autorizacao_continuer = _autorizacao.autorizacao_uid
  ) then 
    return lib.res_false('Já existe uma continuação para essa autorização definida!');
  end if;
  
  with __serie as (
    select
        serie_tserie_id,
        serie_espaco_id,
        serie_designacao,
        format('%s%s', substr( serie_numero, 1, length( serie_numero ) -2 ), to_char( current_date, 'yy')) as serie_numero,
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
    'autorizacao_autorizacao_continuer', _autorizacao.autorizacao_uid,
    'autorizacao_espaco_uid', _autorizacao.autorizacao_espaco_uid,
    'autorizacao_designacao', _autorizacao.autorizacao_designacao,
    'autorizacao_numero', _autorizacao.autorizacao_numero,
    'series', _data.series
  ));
end;
$$;
`;

export const funct_load_autorizacao = sql`
create or replace function tweeks.funct_load_autorizacao(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
  {
    arg_colaborador_id: UID
    arg_espaco_auth: UID
  }
 */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );

  _const map.constant;

begin
  _const := map.constant();
  return query
    with __autorizacao as (
      select
          a.autorizacao_uid,
          a.autorizacao_numero,
          a.autorizacao_ano,
          a.autorizacao_estado,
          a.autorizacao_designacao,
          a.autorizacao_dataregistro,
          e.espaco_id,
          e.espaco_nome,
          count( at.* ) filter ( where at.autorizacao_ano > a.autorizacao_ano) as autorizacao_postone,
          count( at.* ) filter ( where a.autorizacao_uid = at.autorizacao_autorizacao_continuer ) as autorizacao_childrem,
          count( at.* ) filter ( where at.autorizacao_ano < a.autorizacao_ano ) as autorizacao_previews
        from tweeks.autorizacao a
          inner join tweeks.espaco e on a.autorizacao_espaco_uid = e.espaco_id
          left join tweeks.autorizacao at on at.autorizacao_espaco_uid = a.autorizacao_espaco_uid
            and at._branch_uid = a._branch_uid
        where a._branch_uid = arg_branch_uid
          and true in (
            a.autorizacao_espaco_auth = any( _espaco_child ),
            a.autorizacao_espaco_uid = any( _espaco_child )
          )
        group by
          a.autorizacao_uid,
          e.espaco_id
    ), __continue as (
       select
            at.*,
            case
              when at.autorizacao_childrem > 0 then false
              when at.autorizacao_estado = _const.maguita_autorizacao_estado_fechado and at.autorizacao_postone = 0 then true
              else false
            end as autorizacao_continue
          from __autorizacao at
    ) select to_jsonb( _a )
        from __continue _a
        order by _a.autorizacao_ano desc,
          _a.autorizacao_dataregistro desc
  ;
end;
$$;
`;