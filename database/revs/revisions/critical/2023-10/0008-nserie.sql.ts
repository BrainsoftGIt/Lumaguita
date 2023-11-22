import {patchSQL, sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";

export const createTserieNotaDebito =  patchSQL({ unique: true }).sql`
    insert into tweeks.tserie( tserie_id, tserie_desc, tserie_code, tserie_seqlimit, tserie_numlimit ) values ( 8, 'Nota de debito', 'ND', 6, 7 );
    select map.constant( 'maguita_tserie_notadebito', 'int2', 8, 'Nota de debito' );
`;

export const alter_tserie_add_financa = patchSQL({ unique: true, force: "1.0.1" }).sql`
alter table tweeks.tserie drop column if exists tserie_finaca;
alter table tweeks.tserie drop column if exists tserie_financa;
alter table tweeks.tserie drop column if exists tserie_tags;
alter table tweeks.tserie add column tserie_financa character varying default null;
`;

export const alter_tserie_add_financa_order = patchSQL( { unique: true } ).sql`
alter table tweeks.tserie add if not exists tserie_order int default null;
`;

export const funct_load_serie_distribuicao = sql`
create or replace function tweeks.funct_load_serie_distribuicao( args jsonb
) returns setof jsonb
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
          inner join tserie ts on s.serie_tserie_id = ts.tserie_id
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

export const funct_load_serie_distribuicao_pos = sql`
create or replace function tweeks.funct_load_serie_distribuicao_pos( args jsonb
) returns setof jsonb
  language plpgsql
as
$$
declare
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  __series int2[] default args->>'tseries';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
  _espaco tweeks.espaco;
  __next record;
begin
  _const := map.constant();

  
  for __next in 
    select *
      from rule.espaco_get_childrens( arg_espaco_auth ) c ( childrens )
        inner join unnest( c.childrens ) e ( espaco_id )  on true
  loop
    
    -- Obter o espaço superior que pode gerar numero de seire
    with recursive __espaco as (
      select
        e.*,
        e.espaco_gerarfatura as __generate_serie
      from tweeks.espaco e
      where e.espaco_id = __next.espaco_id
      union all
        select 
          w.*,
          w.espaco_gerarfatura
      from __espaco _e
        inner join tweeks.espaco w on _e.espaco_espaco_id = w.espaco_id
          and not _e.__generate_serie
    ) select *
      into _espaco 
        from __espaco __e
        where __e.__generate_serie
    ;
    
    return query
      with __autorizacao as (
        select
            __next.espaco_id,
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
            inner join tserie ts on s.serie_tserie_id = ts.tserie_id
        where s.serie_autorizacao_uid = a.autorizacao_uid
          and s._branch_uid = ___branch
          and a._branch_uid = ___branch
          and s.serie_espaco_id = _espaco.espaco_id
          and s.serie_tserie_id = any( __series )
          and s.serie_estado = _const.maguita_serie_estado_ativo
          and a.autorizacao_estado = _const.maguita_autorizacao_estado_ativo
          and a.autorizacao_ano = extract( years from now() )::int
      )  select 
            __next.espaco_id,
            array_agg( to_jsonb( _a ) ) as series
          from __autorizacao _a
          group by __next.espaco_id
    ;
  end loop;
end;
$$;
`;


export const funct_load_serie = sql`
create or replace function tweeks.funct_load_serie(args jsonb)
  returns setof jsonb
  language plpgsql
as
$$
declare
  /**
    arg_espaco_auth
    arg_colaborador_id
    arg_autorizacao_id
   */
  _const map.constant;
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_autorizacao_id uuid default args->>'arg_autorizacao_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  ___branch_uid uuid;
  _espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
begin
  _const := map.constant();
  ___branch_uid := tweeks.__branch_uid( null, arg_espaco_auth );
  return query
    with
      __serie as (
        select _vs.*,
            e.espaco_id,
            e.espaco_nome
          from tweeks.serie _vs
            inner join tweeks.espaco e on _vs.serie_espaco_id = e.espaco_id
          where _vs._branch_uid = ___branch_uid
            and coalesce( _vs.serie_autorizacao_uid ) = coalesce( arg_autorizacao_id, _vs.serie_autorizacao_uid )
            and true in (
              _vs.serie_espaco_auth = any( _espaco_child ),
              _vs.serie_espaco_id = any( _espaco_child )
            ) and _vs.serie_estado != _const.maguita_serie_estado_anulado
      )
    select to_jsonb( _s )
      from __serie _s;
end;
$$;
`;




