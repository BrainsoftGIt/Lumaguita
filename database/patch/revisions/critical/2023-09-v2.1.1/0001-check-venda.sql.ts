import {block} from "../../../core/updater";

block( module,  {identifier:"__tg_venda_before_check"}).sql`
create or replace function tweeks.__tg_venda_before_check()
returns trigger
language plpgsql as $$
declare
  _conta record;
  _artigo record;
  _new tweeks.venda;
begin
  if upper( tg_op ) in ( 'INSERT', 'UPDATE' ) then
    _new := new;
    select *
      from tweeks.conta ct
      where ct.conta_id = _new.venda_conta_id
      into _conta
    ;

    select *
      from tweeks.artigo a
      where a.artigo_id = _new.venda_artigo_id
      into _artigo
    ;
    
    -- Garantir que a quantidade vendida nunca seja de zero
    if new.venda_quantidade = 0 then
      raise exception '%', format('A quantidade de artigo para %I %s não pode ser zero', _artigo.artigo_nome, case
        when _new.venda_descricao != _artigo.artigo_nome then format( 'com descrição %I', _new.venda_descricao )
        else ''
      end) ;
    end if;

    -- Garantir que a quantidade vendida só seja negativa para o caso de conta corrente
    if _new.venda_quantidade < 0 and _conta.conta_conta_docorigin is null then
      raise exception '%', format( 'Não vender o artigo %I %s com quantidade negativa!', _artigo.artigo_nome, case
        when _new.venda_descricao != _artigo.artigo_nome then format( 'com descrição %I', _new.venda_descricao )
        else ''
      end);
    end if;

    return new;
  end if;
end;
$$;
`

block( module, { identifier: "trigger:tg_venda_before_check" }).sql`
create trigger tg_venda_before_check
  after insert or update
  on tweeks.venda
  for each row
  execute procedure tweeks.__tg_venda_before_check();
`;

block( module, { identifier: "tweeks.check-conta", flags: [ "@unique" ]}).sql`
alter table tweeks.conta drop constraint if exists uk_conta_chave;
alter table tweeks.conta add constraint uk_conta_chave unique ( conta_chave, _branch_uid );
`;



block( module, { identifier: "tweeks.funct_pos_generate_key"}).sql`
create or replace function tweeks.funct_pos_generate_key( args jsonb )
    returns character varying
    language plpgsql as $$
  declare
    /**
      arg_colaborador_id uuid
      arg_espaco_auth uuid
     */
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
    _key character varying;
  begin
    while _key is null loop
        _key :=  cluster.next( 'artigo.key/seq', ___branch::text, lpad := 9, lpad_char := '0' );
        _key := format( 'CTK-%s-%s', _key, lib.dset_random_text(32 ) );
        if exists(
            select *
              from tweeks.conta ct
              where ct.conta_chave = _key
                and ct._branch_uid = ___branch
        ) then
          _key := null;
        end if;
      end loop;
    return _key;
  end;
  $$;
`

block( module, { identifier: "tweeks.funct_pos_reg_conta|-v2.0.1"}).sql`
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
      raise exception '%', format('O tipo de serie é obrigatorio na criação de uma nova conta!');
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
  
  select ( "returning" ).* into _conta
    from lib.sets( _change, replacer := args )  sets
    where _new != _old
  ;
  
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




block( module, { identifier: "conta_props", flags:[ "@unique" ]} ).sql`
  alter table tweeks.conta add column if not exists conta_props jsonb default null;
`;


block( module, { identifier: "venda_proforma", flags:[ "@unique" ] } ).sql`
alter table tweeks.venda add column if not exists venda_proforma boolean default false;
`;