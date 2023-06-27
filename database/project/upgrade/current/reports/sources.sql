drop function if exists tweeks.report_source_filter( args jsonb );
drop function if exists report.source_filter( args jsonb );
create or replace function report.source_filter( args jsonb )
returns setof jsonb
language plpgsql as $$
  declare
    _source text default args->>'source';
    _user uuid default args->>'user';
    _space uuid default args->>'space';
    _branch uuid default args->>'branch';
    _const map.constant;
  begin
    _const := map.constant();

    if _source = 'tweeks.posto' then
      return query
        with __posto as (
          select
              s.posto_id as id,
              s.posto_designacao as label
            from tweeks.posto s
            where s._branch_uid = _branch
        ) select to_jsonb( _p )
          from __posto _p;
    end if;

    if _source = 'auth.colaborador' then
      return query
        with __posto as (
          select
            s.colaborador_id as id,
            s.colaborador_nome as label
          from auth.colaborador s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.espaco' then
      return query
        with __posto as (
          select
            s.espaco_id as id,
            s.espaco_nome as label
          from tweeks.espaco s
          where s.espaco_branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'geoinfo.currency' then
      return query
        with __posto as (
          select
            s.currency_id as id,
            s.currency_code as label
          from geoinfo.currency s
          where currency_code in ( 'STN', 'EUR', 'USD' )
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.artigo' then
      return query
        with __posto as (
          select
            s.artigo_id as id,
            s.artigo_nome as label
          from tweeks.artigo s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'boolean|Y/N' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'SIM' )
          union all values ( false, 'NÃO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'boolean|ON/OFF' then
      return query
        with __yes_no ( id, label ) as (
          values ( true, 'ATIVO' )
          union all values ( false, 'DESATIVO')
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'STATUS' then
      return query
        with __yes_no ( id, label ) as (
          values ( 0, 'DESATIVO' )
          union all values ( 1, 'ATIVO' )
          union all values ( 2, 'PENDENTE' )
          union all values ( -1, 'ANULADO' )
        ) select to_jsonb( _p )
        from __yes_no _p;
    end if;

    if _source = 'tweeks.toperacao' then
      return query
        with __posto as (
          select
            s.toperacao_id as id,
            s.toperacao_designacao as label
          from tweeks.toperacao s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;


    if _source = 'tweeks.tgroup' then
      return query
        with __tgroup as (
          select
            s.tgrupo_id as id,
            s.tgrupo_desc as label
          from tweeks.tgrupo s
        ) select to_jsonb( _p )
        from __tgroup _p;
    end if;

    if _source = 'tweeks.tpaga' then
      return query
        with __posto as (
          select
            s.tpaga_id as id,
            s.tpaga_designacao as label
          from tweeks.tpaga s
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.cliente' then
      return query
        with __posto as (
          select
            s.cliente_id as id,
            s.cliente_titular as label
          from tweeks.cliente s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.fornecedor' then
      return query
        with __posto as (
          select
            s.fornecedor_id as id,
            s.fornecedor_nome as label
          from tweeks.fornecedor s
          where s._branch_uid = _branch
        ) select to_jsonb( _p )
        from __posto _p;
    end if;

    if _source = 'tweeks.tipoimposto' then
      return query
        with __source as (
          select
            s.tipoimposto_id as id,
            s.tipoimposto_codigo as label
          from tweeks.tipoimposto s
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.serie' then
      return query
        with __source as (
          select
            s.serie_id as id,
            format( '%s (%s)', ts.tserie_desc,  s.serie_numero) as label
          from tweeks.serie s
            inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
          where s._branch_uid = _branch
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tserie' then
      return query
        with __source as (
          select
            s.tserie_id as id,
            s.tserie_desc as label
          from tweeks.tserie s
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.caixa::estado' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_caixa_estado_ativo, 'ABERTA' )
          union all values ( _const.maguita_caixa_estado_fechado, 'FECHADA' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.lancamento::mode' then
      return query
        with __source( id, label ) as (
          values ( _const.maguita_lancamento_mode_automatic, 'AUTOMATICO' )
          union all values ( _const.maguita_lancamento_mode_manual, 'MANUAL' )
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tlancamento' then
      return query
        with __source( id, label ) as (
          select tlancamento_id, tlancamento_desc
            from tweeks.tlancamento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

    if _source = 'tweeks.tmovimento' then
      return query
        with __source( id, label ) as (
          select tmovimento_multiplo, tmovimento_designacao
            from tweeks.tmovimento
        ) select to_jsonb( _s )
        from __source _s;
    end if;

  end;
$$;
