import {sql} from "kitres";

export const Rev003FunctLoadSerieDistribuicaoSql = sql`
create or replace function tweeks.funct_load_serie_distribuicao(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_tserie_id int2 default args->>'tserie_id';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
  _espaco tweeks.espaco;
  _tserie tweeks.tserie;
begin
  _const := map.constant();

  select * into _tserie
    from tweeks.tserie ts
    where ts.tserie_id = arg_tserie_id
  ;

  -- Obter o espaço superior que pode gerar numero de seire
  with recursive __espaco as (
    select e.*, e.espaco_gerarfatura as __generate_serie
    from tweeks.espaco e
    where e.espaco_id =arg_espaco_auth
    union all
    select w.*, w.espaco_gerarfatura
    from __espaco _e
           inner join tweeks.espaco w on _e.espaco_espaco_id = w.espaco_id
      and not _e.__generate_serie
  ) select * into _espaco from __espaco __e
    where __e.__generate_serie
  ;

  return query
    with __autorizacao as (
      select
          s.serie_id,
          s.serie_numero,
          s.serie_designacao,
          s.serie_sequencia,
          s.serie_numcertificacao,
          s.serie_quantidade,
          a.autorizacao_uid,
          a.autorizacao_ano,
          ts.tserie_id,
          ts.tserie_financa,
          ts.tserie_desc,
          ts.tserie_numlimit,
          ts.tserie_seqlimit
        from tweeks.serie s
          
          inner join tweeks.autorizacao a on s.serie_autorizacao_uid = a.autorizacao_uid
          inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
      where s.serie_autorizacao_uid = a.autorizacao_uid
        and s._branch_uid = ___branch
        and a._branch_uid = ___branch
        and s.serie_espaco_id = _espaco.espaco_id
        and s.serie_tserie_id = arg_tserie_id
        and s.serie_estado = _const.maguita_serie_estado_ativo
        and a.autorizacao_estado = _const.maguita_autorizacao_estado_ativo
        and a.autorizacao_ano = extract( years from now() )::int
    ) select to_jsonb( _a )
        from __autorizacao _a
  ;
end;
$$;
`;