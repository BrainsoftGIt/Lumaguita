import {block} from "../../../core/updater";

block( module, { identifier: ""}).sql`
create or replace function tweeks.funct_pos_reg_venda(args jsonb) returns lib.res
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
      arg_vendas: [{
          venda_id?: UID,
          venda_artigo_id: UID,
          venda_quantidade: QUANT,
          venda_custounitario: COST
          venda_custoquantidade: COST

          + venda_editado BOOLEAN
          + venda_isencao BOOLEAN
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
          + venda_taxas

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
           ( jsonb_populate_record( null::tweeks.venda, e.doc || jsonb_build_object(
              'venda_proforma', _conta.conta_proforma
          ) )).*,
--         ( e.doc->>'venda_artigo_id' )::uuid  as venda_artigo_id,
--         ( e.doc->>'venda_quantidade' )::double precision as venda_quantidade,
--         ( e.doc->>'venda_custounitario' )::double precision as venda_custounitario,
--         ( e.doc->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
        ( e.doc || jsonb_build_object(
          'venda_proforma', _conta.conta_proforma
        ) )::jsonb  as document,
        coalesce( e.doc->'arg_itens', '[ ]'::jsonb )::jsonb as itens,
        false as _is_extension
      from jsonb_array_elements( arg_vendas ) e ( doc )
    union all
      select
          row,
          ( jsonb_populate_record( null::tweeks.venda, e.doc || jsonb_build_object(
              'venda_montanteagregado', 0,
              'venda_imposto', 0,
              'venda_montantesemimposto', 0,
              'venda_montantecomimposto', 0,
              'venda_imposto', 0,
              'venda_editado', false,
              'venda_taxas', jsonb_build_array(),
              'venda_proforma', _conta.conta_proforma
            
            ))).*,
--           ( e.doc->>'venda_artigo_id' )::uuid  as venda_artigo_id,
--           ( e.doc->>'venda_quantidade' )::double precision as venda_quantidade,
--           ( e.doc->>'venda_custounitario' )::double precision as venda_custounitario,
--           ( e.doc->>'venda_custoquantidade' )::double precision as venda_custoquantidade,
          ( e.doc || jsonb_build_object(
            'venda_proforma', _conta.conta_proforma
          ))::jsonb  as document,
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
        coalesce( ve.venda_dataregistro, now() ) as venda_dataregistro,
        coalesce( ve.venda_colaborador_id, arg_colaborador_id ) as venda_colaborador_id,
        coalesce( ve.venda_conta_id, arg_conta_id ) as venda_conta_id,
        coalesce( ve.venda_espaco_auth, arg_espaco_auth ) as venda_espaco_auth,
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
          ve.venda_montante != e.venda_montante,
          ve.venda_montanteagregado != e.venda_montanteagregado,
          coalesce( ve.venda_proforma, false ) != coalesce( e.venda_proforma, false ),
          ve.venda_montantetotal != e.venda_montantetotal,
          ve.venda_imposto != e.venda_imposto,
          ve.venda_montantesemimposto != e.venda_montantesemimposto,
          ve.venda_montantecomimposto != e.venda_montantecomimposto,
          ve.venda_impostoadicionar != e.venda_impostoadicionar,
          ve.venda_impostoretirar != e.venda_impostoretirar,
          ve.venda_descricao != e.venda_descricao,
          ve.venda_lote != e.venda_lote,
          ve.venda_validade != e.venda_validade,
          ve.venda_artigo_id != e.venda_artigo_id,
          ve.venda_metadata::text != e.venda_metadata::text
        ))
  ), __sets as (
    select "returning"::tweeks.venda, row, c._is_extension
      from __calcs c
        inner join lib.sets( _simple, replacer := (to_jsonb( c ) - 'venda_estado' - 'venda_id' - 'venda_taxas')
          || c.docreplacer
          ||  jsonb_build_object(
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
          inner join lib.sets( _simple, replacer := ( to_jsonb( c ) - 'venda_estado' - 'venda_id' - 'venda_taxas' )
              || c.docreplacer
              || jsonb_build_object(
            'venda_venda_id', (sui."returning"::tweeks.venda).venda_id,
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
`;


block( module, { identifier: ""}).sql`
create or replace function tweeks.funct_pos_change_conta_proforma(args jsonb) returns lib.res
  language plpgsql
as
$$
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
  
  update tweeks.venda
    set venda_proforma = true
    where venda_conta_id = _conta.conta_id
      and venda_estado not in (
        _const.maguita_venda_estado_anulado,  
        _const.maguita_venda_estado_canselado  
      )
      and not venda_proforma
  ;

  return lib.res_true( jsonb_build_object(
    'conta', _conta
  ));
end;
$$;
`;