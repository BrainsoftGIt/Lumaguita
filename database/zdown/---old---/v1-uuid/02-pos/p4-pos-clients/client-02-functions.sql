
select * from map.describe( 'maguita_cliente' );

select map.constant( 'maguita_cliente_estado_desativo', 'int2', 0 );

select cliente_id, cliente_titular, cliente_nif, cliente_estado from tweeks.cliente;

select * from tweeks.funct_pos_reg_cliente(
  '{
    "arg_colaborador_id":"00000000-0000-0000-0000-000000000004",
    "arg_espaco_auth": "00000000-0000-0000-0000-000000000002",
    "cliente_id": "fccc43c1-ff15-45de-ab95-7e22a170dd70",
    "cliente_estado": 1
  }'
);

create or replace function tweeks.funct_pos_reg_cliente(
  args jsonb
) returns lib.res
language plpgsql as $$
  declare
    /**
      args := {
        arg_colaborador_id:UUID*
        arg_espaco_auth:UUID*

        cliente_id:UUID?
        cliente_estado:ESTADO?

        cliente_titular:NAME*
        cliente_tdocument_id:TDOC?
        cliente_nif: NIF?
        cliente_mail: MAIL?
        cliente_documento: DOC-NUMBER?

      }
     */
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    _client tweeks.cliente;
    _data record;
    _branch uuid default tweeks.__space_branch( arg_espaco_auth, 1 );
  begin
    _client := jsonb_populate_record( _client, args );

    if _client.cliente_nif is not null then
      -- Garantir que não tenha outro cliente com o mesmo NIF
      select * into _client
        from tweeks.cliente c
        where coalesce( _client.cliente_id::text, format('%s!?', c.cliente_id ) ) != c.cliente_id::text
          and c.cliente_nif = _client.cliente_nif
          and c.cliente_espaco_branch = _branch
      ;

      if _client.cliente_id is not null then
        return lib.res_false( format( 'O cliente %I está associado com esse NIF', _client.cliente_titular ) );
      end if;
    end if;

    if true in ( _client.cliente_tdocument_id is not null, _client.cliente_documento is null ) then
      -- Garantir que não tenha outro cliente com os mesmo documentos
      select * into _client
        from tweeks.cliente c
        where coalesce( _client.cliente_id::text, format('%s!?', c.cliente_id ) ) != c.cliente_id::text
          and _client.cliente_tdocument_id = c.cliente_tdocument_id
          and _client.cliente_documento = c.cliente_documento
      ;

      if _client.cliente_id is not null then
        return lib.res_false( format( 'O cliente %I está associado com o mesmo documento', _client.cliente_titular ) );
      end if;
    end if;

    select * into _client
      from tweeks.cliente c
      where c.cliente_id = _client.cliente_id
    ;

    if _client.cliente_id is null then
      _client.cliente_colaborador_id := arg_colaborador_id;
      _client.cliente_espaco_auth := arg_espaco_auth;
    else
      _client.cliente_colaborador_atualizacao := arg_colaborador_id;
      _client.cliente_dataatualizacao := current_timestamp;
    end if;

    select * into _data
      from lib.sets( _client, replacer := args );
    _client := _data."returning";

    return lib.res_true( jsonb_build_object(
      'cliente', _client,
      'opr', _data.operation
    ));
  end
$$;

create or replace function tweeks.funct_pos_load_cliente( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_posto_id uuid default args->>'arg_posto_id';
  arg_espaco_branch uuid default tweeks.__space_branch( arg_espaco_auth, 1 );
  _const map.constant;
begin
  _const := map.constant();

  --language=PostgreSQL
  return query
    with __cliente as (
      select
          c.cliente_id,
          c.cliente_titular,
          c.cliente_nif
        from tweeks.cliente c
        where c.cliente_espaco_branch = arg_espaco_branch
          and c.cliente_estado = _const.maguita_cliente_estado_ativo
        order by
          case
            when c.cliente_id = lib.to_uuid( 1 ) then 1
            else 2
          end,
          c.cliente_titular
    ) select to_jsonb( _c ) from __cliente _c;
end
$$;


/* conta_montante     -- corresponde ao montante de conta
   balanco_saldo      -- corresponde ao saldo atual do cliente (pode ser credor ou devedor);
   deposito_montante  -- corresponde ao montante que o cliente esta a pagar já cambiado

   use_saldo := 0.0;
   if balanco_saldo > 0 then
     use_saldo := balanco_saldo;
   end if;

   credito_aplicar := (deposito_montante + use_saldo);
   troco := credito_aplicar - conta_montante;

   if troco < 0 then
      troco := null; -- montante depositado não cobre a venda
   end if;
 */

