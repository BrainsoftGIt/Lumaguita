create or replace function tweeks.__lote( args jsonb )
returns table (
  espaco_id uuid,
  artigo_id uuid,
  lote_numero character varying,
  lote_validade date,
  lote_ref jsonb,
  lote_refuid uuid,
  lote_refclass character varying,
  lote_entrada double precision,
  lote_saida double precision
) language plpgsql as $$
declare
  arg_colaborador_id uuid default args->>'colaborador_id';
  arg_espaco_auth uuid default args->>'espaco_auth';
  arg_espaco_armazem uuid default args->>'espaco_armazem';
  arg_artigo_id uuid default args->>'artigo_id';
  arg_with_reference boolean default args->>'withRef';
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
begin
  arg_with_reference := coalesce( arg_with_reference, false );
  _const := map.constant();
  return query with __lote_entrada as (
    select
        e.entrada_espaco_destino as espaco_id,
        e.entrada_artigo_id as artigo_id,
        e.entrada_lote as lote_numero,
        e.entrada_validade as lote_validade,
        e.entrada_quantidade as lote_entrada,
        0::double precision as lote_saida,
        case when arg_with_reference then lib.sets_ref( e ) end as lote_ref,
        case when arg_with_reference then e.entrada_id end as lote_refuid,
        case when arg_with_reference then cluster.__format( e.TABLEOID ) end as lote_refclass
      from tweeks.entrada e
      where true
--         and e.entrada_lote is not null
--         and e.entrada_validade is not null
        and e._branch_uid = _branch

        and e.entrada_estado = _const.entrada_estado_ativo
        and e.entrada_espaco_destino = coalesce( arg_espaco_armazem, e.entrada_espaco_destino )
        and e.entrada_artigo_id = coalesce( arg_artigo_id, e.entrada_artigo_id )
    union all
      select
          e.transferencia_espaco_destino,
          e.transferencia_artigo_id,
          e.transferencia_lote,
          e.transferencia_validade,
          0::double precision lote_entrada,
          e.transferencia_quantidade as lote_saida,
          case when arg_with_reference then lib.sets_ref( e ) end as lote_ref,
          case when arg_with_reference then e.transferencia_id end as lote_refuid,
          case when arg_with_reference then cluster.__format( e.TABLEOID ) end as lote_refclass
        from tweeks.transferencia e
        where true
--           and e.transferencia_lote is not null
--           and e.transferencia_validade is not null
          and e._branch_uid = _branch

          and e.transferencia_estado = _const.transferencia_estado_ativo
          and e.transferencia_espaco_destino = coalesce( arg_espaco_armazem, e.transferencia_espaco_destino )
          and e.transferencia_artigo_id = coalesce( arg_artigo_id, e.transferencia_artigo_id )

  ), __lote_saida as (
    select
        e.venda_espaco_auth as espaco_id,
        e.venda_artigo_id as artigo_id,
        e.venda_lote as lote_numero,
        e.venda_validade as lote_validade,
        e.venda_quantidade as lote_entrada,
        0::double precision as lote_saida,
        case when arg_with_reference then lib.sets_ref( e ) end as lote_ref,
        case when arg_with_reference then e.venda_id end as lote_refuid,
        case when arg_with_reference then cluster.__format( e.TABLEOID ) end as lote_refclass
      from tweeks.venda e
      where true
--         and e.venda_lote is not null
--         and e.venda_validade is not null
        and e._branch_uid = _branch

        and e.venda_estado not in ( _const.maguita_venda_estado_anulado, _const.maguita_venda_estado_canselado )
        and e.venda_espaco_auth = coalesce( arg_espaco_armazem, e.venda_artigo_id )
        and e.venda_artigo_id = coalesce( arg_artigo_id, e.venda_artigo_id )
    union all
      select
          e.transferencia_espaco_origem,
          e.transferencia_artigo_id,
          e.transferencia_lote,
          e.transferencia_validade,
          0::double precision lote_entrada,
          e.transferencia_quantidade as lote_saida,
          case when arg_with_reference then lib.sets_ref( e ) end as lote_ref,
          case when arg_with_reference then e.transferencia_id end as lote_refuid,
          case when arg_with_reference then cluster.__format( e.TABLEOID ) end as lote_refclass
        from tweeks.transferencia e
        where true
--           and e.transferencia_lote is not null
--           and e.transferencia_validade is not null
          and e._branch_uid = _branch

          and e.transferencia_estado = _const.transferencia_estado_ativo
          and e.transferencia_espaco_origem = coalesce( arg_espaco_armazem, e.transferencia_espaco_origem )
          and e.transferencia_artigo_id = coalesce( arg_artigo_id, e.transferencia_artigo_id )
  ), __lote as (
    select
        coalesce( le.espaco_id, ls.espaco_id ) as espaco_id,
        coalesce( le.artigo_id, ls.artigo_id ) as atrigo_id,
        coalesce( le.lote_numero, ls.lote_numero ) as lote_numero,
        coalesce( le.lote_validade, ls.lote_validade ) as lote_validade,
        coalesce( le.lote_entrada, ls.lote_entrada, 0.0 ) as lote_entrada,
        coalesce( le.lote_saida, ls.lote_saida, 0.0 ) as lote_saida,
        coalesce( le.lote_ref, ls.lote_ref ) as lote_ref,
        coalesce( le.lote_refuid, ls.lote_refuid ) as lote_refuid,
        coalesce( le.lote_refclass, ls.lote_refclass ) as lote_refclass
      from __lote_entrada le
        full join __lote_saida ls on le.artigo_id = ls.artigo_id
          and le.espaco_id = ls.espaco_id
          and le.lote_numero = ls.lote_numero
          and le.lote_validade = ls.lote_validade
  ), __filter as (
    select
        _l.espaco_id,
        _l.atrigo_id,
        _l.lote_numero,
        _l.lote_validade,
        _l.lote_ref,
        _l.lote_refuid,
        _l.lote_refclass,
        sum( _l.lote_entrada ) lote_entrada,
        sum( _l.lote_saida ) lote_saida
      from __lote _l
      group by _l.espaco_id,
        _l.atrigo_id,
        _l.lote_numero,
        _l.lote_validade,
        _l.lote_ref,
        _l.lote_refuid,
        _l.lote_refclass
  ) select _l.*
      from __filter _l;
end;
$$;
