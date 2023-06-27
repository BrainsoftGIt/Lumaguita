drop function if exists tweeks.funct_load_cambio_dia(filter jsonb) ;

select map.constant( format('maguita_%s', name ), type, value, descrision, editable, comment ) from map.describe( 'espaco', 'cambio' );


create or replace function tweeks.funct_pos_load_posto( args jsonb )
  returns setof jsonb
  language plpgsql
as
$$
declare
  /**
    Essa função serve para devolver o cambio do dia de uma moeda
    filter := {
      arg_chave_temporaria: CHAVE;
    }
  */

  _const map.constant;
  _chave_doc jsonb;
  _posto tweeks.posto;
  _posto_disponivel boolean;
begin
  _const := map.constant();

  select * into _chave_doc
    from tweeks.funct_load_chave( args );

  _posto := jsonb_populate_record( _posto, _chave_doc );
  _posto_disponivel := _chave_doc->>'posto_disponivel';

  if _chave_doc is not null and not _posto_disponivel or _posto.posto_id is null then
    return next _chave_doc;
    return;
  elseif _chave_doc is null then
    return;
  end if;

  return next _chave_doc;

  return query
    with __cambio as (
      select
        c.currency_id,
        c.currency_name,
        c.currency_code,
        cb.cambio_id,
        cb.cambio_taxa,
        cb.cambio_data,
        cb.cambio_estado,
        cb.cambio_dataatualizacao,
        cb.cambio_espaco_auth,
        rank( ) over ( partition by cb.cambio_currency_id, cb.cambio_espaco_auth order by cb.cambio_dataregistro desc ) as cambio_rank
      from tweeks.cambio cb
        inner join geoinfo.currency c on cb.cambio_currency_id = c.currency_id
      where cb.cambio_data <= current_timestamp::date
        and cb.cambio_estado != _const.maguita_cambio_estado_anulado
      order by cb.cambio_dataregistro desc
    ), __space_cambio as (
      select
          e.espaco_id,
          e.espaco_nome,
          e.espaco_nivel,
          array_agg( c ) as espaco_cambios
        from __cambio c
          inner join tweeks.espaco e on c.cambio_espaco_auth = e.espaco_id
            and e.espaco_estado = _const.maguita_espaco_estado_ativo
          inner join tweeks.aloca al on e.espaco_id = al.aloca_espaco_destino
            and al.aloca_posto_id = _posto.posto_id
            and al.aloca_estado = _const.maguita_aloca_estado_ativo
        where c.cambio_rank = 1
          and e.espaco_vender
        group by al.aloca_id,
          e.espaco_id
    ) select to_jsonb( sc )
      from __space_cambio sc
  ;
end;
$$;