drop function if exists tweeks.funct_reg_conta(args jsonb) ;
drop function if exists tweeks.funct_pos_reg_conta(args jsonb);
alter table tweeks.conta drop conta_reserva_id;

alter table tweeks.conta add conta_extension jsonb not null default '{}'::jsonb;
alter table tweeks.conta rename conta_ccorrente_id to conte_cliente_id;
alter table tweeks.venda rename venda_montente to venda_montante;

alter table tweeks.conta  add conta_mesa json;

select *, map.constant_rename( name, format( 'maguita_%s', name ) ) from map.describe('venda', 'conta_estado' );
alter table tweeks.conta alter conta_estado set default map.get('maguita_conta_estado_aberto' )::int2;


update tweeks.conta c
  set conta_mesa = jsonb_build_object(
    'numero', m.mesa_numero,
    'lotacao', m.mesa_lotacao,
    'descricao', m.mesa_numero
  )
   -- where c.conta_id = cc.conta_id
   from tweeks.conta cc
     inner join tweeks.mesa m on cc.conta_mesa_id = m.mesa_id
   where c.conta_id = cc.conta_id;

alter table tweeks.conta enable trigger tg_conta_after_update_adjust_venda_estado;
alter table tweeks.conta enable trigger tg_conta_after_update_change_mesa_esatdo;
alter table tweeks.conta enable trigger tg_conta_after_insert_close_mesa;

drop function tweeks._get_mesa(arg_colaborador_id uuid, arg_espaco_auth uuid, arg_mesa_designacao varchar);
drop function tweeks._get_mesa(arg_colaborador_id uuid, arg_mesa_designacao varchar);
drop function tweeks._get_mesa(arg_mesa_id uuid);
alter table tweeks.conta drop conta_mesa_id;
drop table tweeks.mesa;

drop function if exists tweeks.funct_reg_venda(args jsonb);
drop function if exists tweeks.funct_pos_reg_venda(args jsonb);

alter table tweeks.venda add venda_custoquantidade double precision not null default 1;

drop function if exists tweeks.funct_reg_vendaimposto(args jsonb);
drop function if exists tweeks.funct_pos_reg_vendaimposto(args jsonb);

drop function rule.tg_conta_after_insert_close_mesa() cascade;
drop function rule.tg_conta_after_update_change_mesa_esatdo() cascade;

drop trigger if exists tg_venda_after_update_adjust_conta_montante  on tweeks.venda;
drop trigger if exists tg_venda_after_update_adjust_agrega_estado on tweeks.venda;
drop trigger if exists tg_venda_after_insert_create_movimento on tweeks.venda;
drop trigger if exists tg_venda_after_update_create_or_cansel_movimento on tweeks.venda;

drop trigger if exists tg_conta_after_update_adjust_venda_estado on tweeks.conta;


alter table tweeks.venda
  alter venda_estado set default (map.get('maguita_venda_estado_aberto'::name))::smallint,
  alter venda_montanteagregado set not null,
  alter venda_montanteagregado set default 0.0,
  alter venda_montanteagregado type double precision using coalesce( venda_montanteagregado, 0.0 )
;

update tweeks.venda
   set venda_montante = coalesce( venda_montante, 0.0 ),
        venda_montantecomimposto = coalesce( venda_montante, 0.0 ),
     venda_montantesemimposto = coalesce( venda_montante, 0.0 )
  where true in (
    venda_montante is null,
    venda_montantesemimposto is null,
    venda_montantecomimposto is null
  );

alter table tweeks.venda
  alter venda_montantecomimposto set not null,
  alter venda_montantecomimposto set default 0.0,
  alter venda_montantesemimposto set not null,
  alter venda_montantesemimposto set default 0.0,
  alter venda_montante set not null,
  alter venda_montante set default 0.0
;


create or replace function tweeks.funct_pos_reg_vendaimposto(args jsonb)
returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para aplicar os imposto numa venda
    args := {
      arg_colaborador_id: ID,
      arg_venda_id: ID,
      arg_artigo_id: ID,
      arg_espaco_auth: ID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_venda_id uuid not null default args->>'arg_venda_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  _data record;
  _const map.constant;
  _venda tweeks.venda;

  arg_taxa_taxa double precision;
  arg_taxa_percentagem double precision;
  _taxa_agregada record;

  arg_venda_montantesemimposto double precision;
  arg_valor_retirar_bruto double precision;
  arg_valor_retirar_percentagem double precision;
  arg_imposto_multiplicador double precision;

  arg_venda_impostoadicionar double precision default 0.0;
  arg_venda_impostoretirar double precision default 0.0;
  icount int2 default 0;

begin

  _const := map.constant();
  _venda := tweeks._get_venda( arg_venda_id );

  _taxa_agregada := tweeks._get_impostos_taxa( arg_artigo_id, arg_espaco_auth );


  -- Retivar o valor bruto em seguida retivar o valor da percentagem
  arg_valor_retirar_bruto := _taxa_agregada.taxa_retirar;
  arg_valor_retirar_percentagem := rule.taxa_retirar_percentagem_adicionada(
    _venda.venda_montantetotal - arg_valor_retirar_bruto,
    _taxa_agregada.percentagem_retirar
  );

  arg_venda_montantesemimposto := _venda.venda_montantetotal - ( arg_valor_retirar_bruto + arg_valor_retirar_percentagem );

  -- Desativar todos os impostos que não vão mais ser aplicados
  update tweeks.impostovenda
    set impostovenda_estado = _const.impostovenda_estado_fechado,
        impostovenda_colaborador_atualizacao = arg_colaborador_id,
        impostovenda_dataatualizacao = current_timestamp
    where impostovenda_venda_id = _venda.venda_id
      and impostovenda_estado = _const.impostovenda_estado_ativo
  ;

  for _data in
    select
      ip.*,
      (txass::tweeks.taxa).*,
      tap.*
    from tweeks.imposto ip
      inner join tweeks.taplicar tap on ip.imposto_taplicar_id = tap.taplicar_id
      inner join tweeks.taxa txass on ip.imposto_tipoimposto_id = txass.taxa_tipoimposto_id
    where txass.taxa_id = any( _taxa_agregada.taxas )
      and ip.imposto_artigo_id = arg_artigo_id
      and ip.imposto_estado = _const.maguita_imposto_estado_ativo
  loop

    arg_taxa_taxa := 0;
    arg_taxa_percentagem := 0;
    arg_imposto_multiplicador := 1.0;
    arg_venda_impostoadicionar := 0;
    arg_venda_impostoretirar := 0;

    -- Quando a taxa a aplicar for
    if _data.taxa_percentagem is not null and _data.taxa_percentagem > 0.0 then
      arg_taxa_taxa :=  coalesce( arg_venda_montantesemimposto * ( _data.taxa_percentagem / 100.0 ), 0 );
      arg_taxa_percentagem := _data.taxa_percentagem;

    elsif _data.taxa_taxa is not null and _data.taxa_taxa > 0 then
      arg_taxa_taxa := _data.taxa_taxa;
      arg_taxa_percentagem := ( _data.taxa_taxa  * 100.0 ) / arg_venda_montantesemimposto;

    end if;

    -- Se o valor for zero então saltar a taxa
    if arg_taxa_taxa = 0 then continue; end if;

    if _data.taplicar_id = _const.taplicar_adicionar then
      arg_venda_impostoadicionar := arg_venda_impostoadicionar + arg_taxa_taxa;
    else
      arg_venda_impostoretirar := arg_venda_impostoretirar + arg_taxa_taxa;
    end if;

    if _data.taplicar_id = _const.taplicar_retirar then
      arg_imposto_multiplicador := -1.0;
    end if;

    insert into tweeks.impostovenda(
      impostovenda_venda_id,
      impostovenda_tipoimposto_id,
      impostovenda_espaco_auth,
      impostovenda_colaborador_id,
      impostovenda_valor,
      impostovenda_percentagem
    ) values (
      arg_venda_id,
      _data.taxa_tipoimposto_id,
      arg_espaco_auth,
      arg_colaborador_id,
      ( arg_taxa_taxa * arg_imposto_multiplicador ),
      arg_taxa_percentagem
    );
    icount := icount +1;
  end loop;

  update tweeks.venda
    set venda_montantesemimposto = arg_venda_montantesemimposto,
        venda_montantecomimposto = arg_venda_montantesemimposto + arg_venda_impostoadicionar + arg_venda_impostoretirar,
        venda_imposto = arg_venda_impostoadicionar + arg_venda_impostoretirar,
        venda_impostoadicionar = arg_venda_impostoretirar,
        venda_impostoretirar = arg_venda_impostoretirar
    where venda_id = arg_venda_id
    returning * into _venda
  ;

  return true ? jsonb_build_object(
    'venda', _venda
  );
end;
$$;

create or replace function tweeks.__check_stock_on_venda( _espaco_auth uuid, _vendas jsonb )
returns table(
  stocks boolean,
  message text,
  items text,
  counts text
)
language plpgsql as $$
declare
  _data record;
begin
  -- Garrantir que tenha o stock disponivel para os artigos
  with recursive __venda as (
    select
      ( e.document->>'venda_artigo_id' )::uuid as venda_artigo_id,
      ( e.document->>'venda_quantidade' )::double precision as venda_quantidade,
      ( e.document->>'venda_custounitario' )::double precision as venda_custounitario,
      ( e.document->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
      ( e.document->'arg_itens' ) as itens
    from jsonb_array_elements( _vendas ) e( document )
    union all
      select
         ( e.document->>'venda_artigo_id' )::uuid as venda_artigo_id,
         ( e.document->>'venda_quantidade' )::double precision as venda_quantidade,
         ( e.document->>'venda_custounitario' )::double precision as venda_custounitario,
         ( e.document->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
         ( null )::jsonb as itens
        from __venda v
          inner join jsonb_array_elements( v.itens ) e( document ) on true
        where jsonb_array_length( coalesce( v.itens, jsonb_build_array() ) ) > 0
  ), __venda_group as (
      select
          v.venda_artigo_id,
          sum( v.venda_quantidade ) as venda_quantidade
        from __venda v
        group by v.venda_artigo_id
  ) select
      count( art.artigo_id ) as items_count,
      string_agg( art.artigo_nome, ', ' ) as items
      into _data
    from __venda_group vds
       inner join tweeks.artigo art on  vds.venda_artigo_id = art.artigo_id
       inner join tweeks.stock st on art.artigo_id = st.stock_artigo_id
    where st.stock_espacao_id = _espaco_auth
      and not  art.artigo_stocknegativo
      and not tweeks.__artigo_has_stock( art.artigo_id, _espaco_auth, vds.venda_quantidade )
  ;
  __check_stock_on_venda.stocks := _data.items_count = 0;
  __check_stock_on_venda.counts := _data.items_count;
  __check_stock_on_venda.items := _data.items;
  if _data.items_count > 1 then
    __check_stock_on_venda.message := format( 'Os stock dos produtos (%s) não cobrem a venda para essa conta', _data.items );
  elseif _data.items_count = 1 then
    __check_stock_on_venda.message := format( 'Os stock de %s não cobre a venda para essa conta', _data.items );
  end if;
  return next;
end;
$$;

drop function if exists tweeks.funct_pos_reg_venda(args jsonb);
create or replace function tweeks.funct_pos_reg_venda(args jsonb)
returns lib.res
language plpgsql
as
$$
declare
  /** Essa função serve para associar mais vendas a conta
    args := {
      arg_colaborador_id: ID,
      arg_conta_id: ID,
      arg_espaco_auth: ID,
      arg_message_error: TRUE|FALSE,
      arg_venda_id: ID
      arg_vendas: [
        {
          venda_id: UID,
          venda_artigo_id: UID,
          venda_quantidade: QUANT,
          venda_custounitario: COST
          venda_custoquantidade: COST

          arg_itens: [
            venda_id: UID
            venda_artigo_id: UID,
            venda_quantidade: QUANT,
            venda_custounitario: COST
            venda_custoquantidade: COST
          ]
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid not null default args->>'arg_conta_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_vendas jsonb not null default args->>'arg_vendas';
  arg_message_error boolean default args->>'arg_message_error';

  _const map.constant;
  _conta tweeks.conta;
  _data record;
  _stocks record;
  _simple tweeks.venda;
  __vendas tweeks.venda[];

begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  -- Quando a conta não esta aberta
  if _conta.conta_estado != _const.maguita_conta_estado_aberto and arg_message_error then
    raise exception '@conta.estado.not-closed';
  elseif  _conta.conta_estado != _const.maguita_conta_estado_aberto then
    return false ? '@conta.estado.not-closed';
  end if;

  _stocks := tweeks.__check_stock_on_venda( arg_espaco_auth, arg_vendas );

  if not _stocks.stocks  and arg_message_error then
    raise exception '%', _stocks.message;

  elsif not _stocks.stocks  then
    return lib.res_false(
      _stocks.message
    );
  end if;

  with recursive __element as (
    select
        row_number() over () as row,
        ( e.doc->>'venda_artigo_id' )::uuid  as venda_artigo_id,
        ( e.doc->>'venda_quantidade' )::double precision as venda_quantidade,
        ( e.doc->>'venda_custounitario' )::double precision as venda_custounitario,
        ( e.doc->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
        ( e.doc )::jsonb  as document,
        coalesce( e.doc->'arg_itens', '[]'::jsonb )::jsonb as itens,
        false as _is_extension
      from jsonb_array_elements( arg_vendas ) e ( doc )
    union all
      select
          row,
          ( e.doc->>'venda_artigo_id' )::uuid  as venda_artigo_id,
          ( e.doc->>'venda_quantidade' )::double precision as venda_quantidade,
          ( e.doc->>'venda_custounitario' )::double precision as venda_custounitario,
          ( e.doc->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
          ( e.doc )::jsonb  as document,
          coalesce( e.doc->'arg_itens', '[]'::jsonb )::jsonb as itens,
          true as _is_extension
        from __element ep
          inner join jsonb_array_elements( ep.itens ) e( doc ) on jsonb_array_length( ep.itens ) > 0
        where jsonb_array_length( ep.itens ) > 0
          and ep.itens is not null
  ), __calcs as (
    select
        e.*,
        e.document as docreplacer,
        ve.venda_id as _venda_id,
        coalesce( ve.venda_colaborador_id, arg_colaborador_id ) as venda_colaborador_id,
        coalesce( ve.venda_conta_id, arg_conta_id ) as venda_conta_id,
        coalesce( ve.venda_espaco_auth, arg_espaco_auth ) as venda_espaco_auth,
        rule.calculate_cost(
        e.venda_custoquantidade,
        e.venda_custounitario,
        e.venda_quantidade
        ) as venda_montante,
        case
          when art.artigo_preparacao then _const.maguita_venda_estadopreparacao_pendente
          else _const.maguita_venda_estadopreparacao_preparado
        end as venda_estadopreparacao
      from __element e
        inner join tweeks.artigo art on e.venda_artigo_id = art.artigo_id
        left join tweeks.venda ve on ve.venda_id = ( e.document->>'venda_id' )::uuid
      where ve.venda_id is null
        or( ve.venda_id is not null and true in (
          ve.venda_quantidade != e.venda_quantidade,
          ve.venda_custounitario != e.venda_custounitario,
          ve.venda_custoquantidade != e.venda_custoquantidade,
          ve.venda_artigo_id != e.venda_artigo_id
        ))
  ), __sets as (
    select "returning"::tweeks.venda, row, c._is_extension
      from __calcs c
        inner join lib.sets( _simple, replacer := c.docreplacer || to_jsonb( c ) || jsonb_build_object(
          'venda_montantetotal', venda_montante,
          'venda_colaborador_atualizacao', case
            when c._venda_id is null then null
            else arg_colaborador_id
          end,
          'venda_dataatualizacao', case
            when c._venda_id is null then null
            else current_timestamp
          end
        )) on true
      where not c._is_extension
    union all
      select _s."returning"::tweeks.venda, c.row, true
        from __sets sui
          inner join __calcs c on sui.row = c.row and c._is_extension
          inner join lib.sets( _simple, replacer := c.docreplacer || to_jsonb( c ) || jsonb_build_object(
            'venda_venda_id', (sui."returning").venda_id,
            'venda_montantetotal', venda_montante,
            'venda_colaborador_atualizacao', case
              when c._venda_id is null then null
              else arg_colaborador_id
              end,
            'venda_dataatualizacao', case
              when c._venda_id is null then null
              else current_timestamp
            end
          )) _s on true
        where not sui._is_extension
  ) select array_agg( "returning" ) into __vendas from __sets;

  return lib.res_true( jsonb_build_object(
    'vendas', __vendas
  ));
end
$$;

create or replace function tweeks.funct_pos_reg_conta( args jsonb )
returns lib.res
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

      conta_currency_id: ID,
      conta_tpaga_id: ID,

      conta_cliente_id:UID
      conta_titular: CLIENTE-NOME
      conta_titularnif: CLIENTE-NIF
      conta_data: DATA,

      -- requerido
      arg_vendas: [
        {
          venda_id:ID?
          venda_artigo_id:
          venda_quantidade
          venda_custounitario
          venda_custoquantidade
          venda_custoquantidade

          arg_itens: [
            {
              venda_id:ID?
              venda_artigo_id: ID,
              venda_quantidade: QUANT,
              venda_custounitario: CUSTO,
              venda_custoquantidade: CUSTO,
            }
          ]
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid default args->>'conta_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_vendas jsonb not null default args->>'arg_vendas';

  _conta tweeks.conta;
  _const map.constant;
  _series record;
  _unsets jsonb[];
  _vendas uuid[] default array( select ( e.doc->>'venda_id' )::uuid from jsonb_array_elements( args->'arg_vendas' ) e ( doc ) where e.doc->>'venda_id' is not null);
  _sync jsonb;
  _reg_venda record;
  _change tweeks.conta;
begin

  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  if _conta.conta_id is null then
    _series := rule.conta_generata_series( arg_espaco_auth );
    _conta.conta_colaborador_id := arg_colaborador_id;
    _conta.conta_espaco_auth := arg_espaco_auth;
    _conta.conta_numero := _series.serial_numero;
    _conta.conta_numerofatura := _series.serial_fatura;
  else
    _conta.conta_colaborador_atualizacao := arg_colaborador_id;
    _conta.conta_dataatualizacao := current_timestamp;
  end if;

  _change := json_populate_record( _conta, args::json );

  select ( "returning" ).* into _change
    from lib.sets( _conta, replacer := args )  sets
    where _conta::text != _change::text
  ;

  if _change.conta_id is not null then _conta := _change; end if;

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

--
select map.constantdrop( name )
from map.describe( 'agrega_estado' );

create or replace function rule.tg_venda_after_update_adjust_agrega_estado() returns trigger
    language plpgsql
as
$$
declare
  /** Essa função serve para ajustar os estados dos item extras agregado a venda depois que a venda for atualizado
  */
  _old tweeks.venda;
  _new tweeks.venda;
  _const map.constant;
  arg_agrega_estado int2;
begin
  _const := map.constant();
  _new:=new;
  _old:=old;

  -- Quando houver mudancas no estado de venda atualizar o estados nos itens agregado
  if _new.venda_estado != _old.venda_estado and _old.venda_estado in (
    _const.maguita_venda_estado_aberto,
    _const.maguita_venda_estado_fechado
  )  and _new.venda_estado in (
    _const.maguita_venda_estado_fechado,
    _const.maguita_venda_estado_anulado,
    _const.maguita_venda_estado_canselado
  ) then

    arg_agrega_estado := case
      when _new.venda_estado = _const.maguita_venda_estado_fechado then _const.maguita_venda_estado_fechado
      when _new.venda_estado = _const.maguita_venda_estado_canselado then _const.maguita_venda_estado_anulado
      when _new.venda_estado = _const.maguita_venda_estado_anulado then _const.maguita_venda_estado_anulado
    end;

    -- Todos os itens agregados a
    update tweeks.venda
      set venda_estado = arg_agrega_estado
      where venda_venda_id = _old.venda_id
        and venda_estado in (
          _const.maguita_venda_estado_fechado,
          _const.maguita_venda_estado_aberto
        );
  end if;

  return null;
end;
$$;

create or replace function rule.tg_venda_after_update_adjust_conta_montante() returns trigger
    language plpgsql
as
$$
declare
  /** Esse trigger serve para atualizar o montante de conta */
  _new tweeks.venda;
  _old tweeks.venda;
  _const map.constant;
begin

  _const := map.constant();
  _new := new;
  _old := old;


  -- Quando o estada da venda for desativadao decrementar o valor
  if _old.venda_estado != _new.venda_estado and _new.venda_estado = _const.maguita_venda_estado_canselado then

    update tweeks.conta
      set conta_montante = conta_montante - coalesce( _old.venda_montantecomimposto, 0 )
      where conta_id  = _old.venda_conta_id
    ;

  -- Quando o valor do imposto para a venda for determinado então
  elseif _old.venda_montantecomimposto is null and _new.venda_montantecomimposto is not null then

    update tweeks.conta
      set conta_montante = conta_montante + _new.venda_montantecomimposto
      where conta_id = _old.venda_conta_id
    ;

  -- Quando o montante total da venda for atualizado
  elseif _old.venda_montantecomimposto != _new.venda_montantecomimposto then

    update tweeks.conta
      set conta_montante = conta_montante - coalesce( _old.venda_montantecomimposto, 0 ) + coalesce( _new.venda_montantecomimposto, 0 )
      where conta_id = _old.venda_conta_id
    ;
  end if;

  return null;
end;
$$;

create or replace function rule.tg_venda_after_update_create_or_cansel_movimento() returns trigger
    language plpgsql
as
$$
declare
  /** Essa função serve para ajustar o stock do artigo depois que uma nova venda for inserida
  **/
  _new tweeks.venda;
  _old tweeks.venda;
  _conta tweeks.conta;
  _stock_old tweeks.stock;
  _stock_new tweeks.stock;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _old := old;
  _conta := tweeks._get_conta( _old.venda_conta_id );
  _stock_old := tweeks._get_stock( _old.venda_artigo_id, _old.venda_espaco_auth );
  _stock_new := tweeks._get_stock( _old.venda_artigo_id, _new.venda_espaco_auth );

  -- Se a quantidade de venda for atualizado ou a venda mover do espaço
    -- reverver o movemento do stock anterior e criar um novo movimento do stock
  if _old.venda_quantidade != _new.venda_quantidade
    or _old.venda_espaco_auth != _new.venda_espaco_auth
  then
    perform rule.movimento_revert(
      _old.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _const.toperacao_venda,
      _const.tmovimento_debito,
      'venda_id',
      _old.venda_id::text,
      _const.movimento_estado_canselado,
      'Arigo removido da venda'
    );

    perform rule.movimento_create(
      _new.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _stock_new.stock_id,
      _const.toperacao_venda,
      jsonb_build_object( 'venda_id', _new.venda_id ),
      _new.venda_quantidade,
      _const.tmovimento_debito,
      null,
      null,
      _conta.conta_numerofatura
    );
  end if;


  -- Se a venda for canselado da conta então repor o stock do produto inicial
  if _old.venda_estado in ( _const.maguita_venda_estado_fechado, _const.maguita_venda_estado_aberto )
    and _new.venda_estado in ( _const.maguita_venda_estado_canselado, _const.maguita_venda_estado_anulado )
  then
    perform rule.movimento_revert(
      _old.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _const.toperacao_venda,
      _const.tmovimento_debito,
      'venda_id',
      _old.venda_id::text,
      _const.movimento_estado_canselado,
      'Arigo removido da venda'
    );

  -- Quando a quantidade do produto for atualizado na venda
  -- Canselar o movimento anterior e criar um novo movimento
  end if;

  return null;
end;
$$;


create or replace function tweeks.funct_pos_change_conta_proforma(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    args := {
      arg_colaborador_id: UUID,
      arg_espaco_auth: UUID,

      conta_id UUID,
      conta_cliente_id: UID,
      conta_proformavencimento: DATE
      conta_proformaextras
    }
   */
  arg_conta_id uuid default args->>'conta_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';

  _conta tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  if _conta.conta_estado != _const.maguita_conta_estado_aberto then
    return lib.res_false( 'Não pode colocar uma conta em modo proforma para as cotas já fechada!' );
  end if;

  _conta.conta_proforma := true;

  select ( "returning" ).* into _conta
    from lib.sets( _conta, args  );

  return lib.res_true( jsonb_build_object(
    'conta', _conta
  ));
end;
$$;


drop function rule.artigo_has_stock(arg_artigo_id uuid, arg_espaco_id uuid, arg_quantidadedebito double precision);

create or replace function tweeks.__artigo_has_stock(arg_artigo_id uuid, arg_espaco_id uuid, arg_quantidadedebito double precision) returns boolean
  language plpgsql
as
$$
declare
  /** Essa função serve para verificar se existe diponibilidade de um artig em um stock para cobrir uma quantidade de debito
   */
  _artigo tweeks.artigo;
  _stock record;
begin
  _artigo := tweeks._get_artigo( arg_artigo_id );

  -- Aceitar sempre que o artigo for do tipo staock negativo
  if _artigo.artigo_stocknegativo then return true; end if;

  _stock := tweeks._get_stock( arg_artigo_id, arg_espaco_id );
  return _stock.stock_quantidade >= arg_quantidadedebito;
end;
$$;


