create or replace function tweeks.funct_load_cambio_ativo(args jsonb) returns SETOF jsonb
  strict
  language plpgsql
as
$$
declare
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __cambio as (
      select
          cb.cambio_id,
          cb.cambio_data,
          cb.cambio_taxa,
          cb.cambio_dataregistro,
          cu.currency_id,
          cu.currency_name,
          cu.currency_code,
          cu.currency_symbol,
          rank() over ( partition by cb.cambio_currency_id order by
            case when cambio_espaco_auth = arg_espaco_auth then 1 else 2 end,
            cb.cambio_dataregistro desc )  as cambio_rank
        from tweeks.cambio cb
          inner join geoinfo.currency cu on cb.cambio_currency_id = cu.currency_id
        where cb.cambio_estado = _const.cambio_estado_ativo
          and cb.cambio_espaco_auth = arg_espaco_auth
          and cb._branch_uid = ___branch
    ) select
        to_jsonb( cb )
      from __cambio cb
      where cb.cambio_rank = 1
  ;
end;
$$;

create or replace function tweeks.funct_reg_cambio(args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa função serve para registar o valor cambio
    args := {
      arg_branch_uid: UID
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_currency_id
      arg_cambio_taxa: VALOR_TAXA,
      arg_cambio_data: DATE
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_branch_uid uuid not null default args->>'arg_branch_uid';
  arg_currency_id int2 not null default args->>'arg_currency_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_cambio_taxa double precision not null default args->>'arg_cambio_taxa';
  arg_cambio_data date not null default args->>'arg_cambio_data';

  _const map.constant;
  _cambio tweeks.cambio;
  arg_cambio_estado int2;
  _data record;
begin

  if arg_branch_uid is null then arg_branch_uid := tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth ); end if;
  if arg_branch_uid is null then arg_branch_uid := tweeks.__branch_uid( null, arg_espaco_auth ); end if;
  if arg_branch_uid is null then arg_branch_uid := tweeks.__branch_uid( arg_colaborador_id, null ); end if;

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
    return false ? 'Câmbio de STN não pode ser atualizado!';
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


