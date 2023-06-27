

create or replace function tweeks.funct_reg_cambio(args jsonb)
 returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para registar o valor cambio
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_currency_id
      arg_cambio_taxa: VALOR_TAXA,
      arg_cambio_data: DATE
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_currency_id int2 not null default args->>'arg_currency_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_cambio_taxa double precision not null default args->>'arg_cambio_taxa';
  arg_cambio_data date not null default args->>'arg_cambio_data';

  _const map.constant;
  _cambio tweeks.cambio;
  arg_cambio_estado int2;
  _data record;
begin

  _const := map.constant();
  arg_cambio_data := current_date;

  select * into _data
    from  tweeks.cambio cb
    where cb.cambio_currency_id = arg_currency_id
        and cb.cambio_estado = _const.cambio_estado_ativo
        and cb.cambio_espaco_auth = arg_espaco_auth
    order by cb.cambio_dataregistro desc
  ;

  raise notice '%', to_jsonb( _data );



  if arg_currency_id = _const.currency_std
    and ( _data.cambio_id is not null or arg_cambio_taxa != 1 )
  then
    return false ? '@tweeks.cambio.can-not-update-cambio-std';
  end if;

  update tweeks.cambio
    set cambio_estado = _const.cambio_estado_fechado,
        cambio_dataatualizacao = current_timestamp,
        cambio_colaborador_atualizacao = arg_colaborador_id
    where cambio_estado = _const.cambio_estado_ativo
      and cambio_currency_id = arg_currency_id
      and cambio_espaco_auth = arg_espaco_auth
  ;

  insert into tweeks.cambio (
    cambio_colaborador_id,
    cambio_currency_id,
    cambio_taxa,
    cambio_espaco_auth
  ) values (
    arg_colaborador_id,
    arg_currency_id,
    arg_cambio_taxa,
    arg_espaco_auth
  ) returning * into _cambio;

  return true ? jsonb_build_object( 'cambio', _cambio  );

end;
$$;
