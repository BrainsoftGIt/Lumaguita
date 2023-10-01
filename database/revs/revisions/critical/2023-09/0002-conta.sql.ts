import {patchSQL, sql} from "kitres";

export const funct_pos_reg_conta = sql`
create or replace function tweeks.funct_pos_reg_conta(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    Essa função registra um nova conta
    arg = {
      -- obrigatorios
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,

      conta_posto_id: ID,

      -- opcional
      conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM }
      conta_id: ID?
      conta_extension: {} | { reserva_id: UID }
      conta_chave: CHAVE

      conta_currency_id: ID,
      conta_tpaga_id: ID,

      conta_cliente_id:UID
      conta_titular: CLIENTE-NOME
      conta_titularnif: CLIENTE-NIF
      conta_data: DATA,
      conta_tserie_id

      -- requerido
      arg_vendas: [
        {
          venda_id?: UID,
          venda_artigo_id: UID,
          venda_quantidade: QUANT,
          venda_custounitario: COST
          venda_custoquantidade: COST

          + venda_editado
          + venda_isencao
          + venda_montante
          + venda_montanteagregado
          + venda_montantetotal
          + venda_imposto
          + venda_montantesemimposto
          + venda_montantecomimposto
          + venda_impostoadicionar
          + venda_impostoretirar

          + venda_descricao
          + venda_lote
          + venda_validade
          + venda_metadata

          arg_itens: [
              venda_id: UID
              venda_artigo_id: UID,
              venda_quantidade: QUANT,
              venda_custounitario: COST
              venda_custoquantidade: COST
              venda_descricao: DESCRICAO
              venda_lote: LOTE
              venda_validade: VALIDADE
              venda_metadata: {... any extras data}
            + venda_montantetotal
          ]
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_conta_id uuid default args->>'conta_id';
  arg_conta_chave character varying not null default args->>'conta_chave';
  arg_vendas jsonb not null default args->>'arg_vendas';

  _conta tweeks.conta;
  _const map.constant;
  _unsets jsonb[];
  _vendas uuid[] default array( select ( e.doc->>'venda_id' )::uuid from jsonb_array_elements( args->'arg_vendas' ) e ( doc ) where e.doc->>'venda_id' is not null);
  _sync jsonb;
  _reg_venda record;
  _change tweeks.conta;
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _message text;
  _new jsonb;
  _old jsonb;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );
  
  if _conta.conta_id is null and exists(
    select *
      from tweeks.conta ct 
      where ct.conta_chave = arg_conta_chave
        and ct._branch_uid = _branch
  ) then
    return lib.res_false( 'Já existe uma conta com a mesma chave (atualize a pagina e tente novamente)!' );
  end if;
  
  _old := coalesce( to_jsonb( _conta ), jsonb_build_object() );
  _change := jsonb_populate_record( _conta, args );
  _change.conta_data := coalesce( _change.conta_data, current_date );
  _new := to_jsonb( _change );

  if _change.conta_tserie_id is null then
      return lib.res_false(format('O tipo de serie é não foi especificada, contactar o suporte!' ) );
  end if;

  if _change.conta_id is null then
    _change.conta_colaborador_id := arg_colaborador_id;
    _change.conta_espaco_auth := arg_espaco_auth;
    _change.conta_numero := cluster.next( 'conta.conta_numero/seq',
      sub := _branch::text,
      lpad_char := '0',
      lpad := 5
    );
    _new := to_jsonb( _change );
  else
    _change.conta_colaborador_atualizacao := arg_colaborador_id;
    _new := to_jsonb( _change );
    _change.conta_dataatualizacao := current_timestamp;
  end if;
  
  _message := tweeks.__check_conta_data(
    _change.conta_tserie_id,
    _change.conta_data,
    false
  );
  
  if _message is not  null then
    return lib.res_false( _message );
  end if;
  
  if _new != _old then 
    select ( "returning" ).* into _conta
      from lib.sets( _change, replacer := args )  sets
    ;
  end if;
  
  -- Canselar as vendas que não fazem mais parte de conta
  with recursive __venda as (
      select
          ve.venda_id,
          ve.venda_estado
        from tweeks.venda ve
        where ve.venda_conta_id = _conta.conta_id
          and ve.venda_venda_id is null
          and ve.venda_id != all( _vendas )
          and ve.venda_estado in (
            _const.maguita_venda_estado_aberto,
            _const.maguita_venda_estado_fechado
          )
      union all
        select
            ve.venda_id,
            ve.venda_estado
          from __venda vs
            inner join tweeks.venda ve on vs.venda_id = ve.venda_venda_id
          where vs.venda_estado in (
            _const.maguita_venda_estado_aberto,
            _const.maguita_venda_estado_fechado
          )
  ), __disable as(
    update tweeks.venda up
      set venda_estado = _const.maguita_venda_estado_canselado
      from __venda _v
      where up.venda_id = _v.venda_id
      returning *
  ) select array_agg( to_jsonb( d ) ) into _unsets
      from __disable d;


  _reg_venda :=  tweeks.funct_pos_reg_venda(
    jsonb_build_object(
      'arg_vendas', arg_vendas,
      'arg_message_error', true,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_conta_id', _conta.conta_id
    )
  );

  _sync := tweeks.funct_pos__sync_conta_amount(
    jsonb_build_object(
      'arg_conta_id', _conta.conta_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth
    )
  );

  return lib.res_true( tweeks.funct_pos_load_conta_data( jsonb_build_object(
    'arg_posto_id', args->'conta_posto_id',
    'arg_espaco_auth', arg_espaco_auth,
    'arg_colaborador_id', arg_colaborador_id,
    'arg_conta_id', _conta.conta_id
  )) || jsonb_build_object(
    'sync', _sync,
    'sets', _reg_venda.data->'vendas',
    'unsets', coalesce( _unsets, array[]::jsonb[])
  ));

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;
`;


export const fauraSimplificada = patchSQL({ unique: true }).sql`
select * from lib.sets( jsonb_populate_record( 
  null::tweeks.tserie,
  '{
    "tserie_id": 7,
    "tserie_desc": "Fatura simplificada",
    "tserie_code": "FS",
    "tserie_seqlimit": 6,
    "tserie_numlimit": 7
  }'::jsonb
));
select map.constant('maguita_tserie_faturasimplificada', 'int2', 7, 'Fatura simplificada' );
`;
