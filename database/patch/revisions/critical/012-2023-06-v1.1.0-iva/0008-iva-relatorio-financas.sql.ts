import {block} from "../../../core/updater";

block( module, { identifier: "financas-report", flags:[]}).sql`
create or replace function report.vreport_imposto_financas( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /*
    args := {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      arg_datainicio
      arg_datafim
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_datainicio date default args->>'arg_datainicio';
  arg_datafim date default args->>'arg_datafim';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;

begin
  _const := map.constant();
  return query
    with __declaracao as (
      select
         se.serie_sequencia as documento_numero,
         se.serie_numero as documento_serie,
         ct.conta_data as documento_data,
         coalesce( ct.conta_titularnif, cli.cliente_nif) as nif_consumidor,
         ve.venda_montantesemimposto::numeric(100,6) as total_valor_itens,
         tx.taxa_percentagem as taxa_aplicavel_itens,
         coalesce( ve.venda_codigoimposto, ar.artigo_codigoimposto) as codigo_isento,
         ve.venda_quantidade quant_itens,
         coalesce( ve.venda_descricao, ar.artigo_nome ) desc_itens,
         ctorigin.conta_numerofatura numero_documento_origem,
         ctorigin.conta_data data_documento_origem,
         ct.conta_id,
         ve.venda_id,
         cli.cliente_id,
         tx.taxa_id,
         se.serie_id,
         ar.artigo_id,
         ct.conta_conta_docorigin,
         ct._branch_uid
      from tweeks.conta ct
        left join tweeks.cliente cli on ct.conta_cliente_id = cli.cliente_id
        inner join json_populate_record( null::tweeks.serie, ct.conta_serie ) se on true
        inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve.venda_estado = _const.maguita_venda_estado_fechado
        inner join tweeks.taxa tx on tx.taxa_id = any( ve.venda_taxas )
        inner join tweeks.artigo ar on ve.venda_artigo_id = ar.artigo_id
        left join tweeks.conta ctorigin on ct.conta_conta_docorigin = ctorigin.conta_id
      where ve._branch_uid = arg_branch_uid
        and ct._branch_uid = arg_branch_uid
        and ct.conta_estado = _const.maguita_conta_estado_fechado
        and ve.venda_estado = _const.maguita_venda_estado_fechado
        and ct.conta_data >= coalesce( arg_datainicio, ct.conta_data )
        and ct.conta_data <= coalesce( arg_datafim, ct.conta_data )
    ) select to_jsonb( _de ) from __declaracao _de
  ;
end;
$$;
`;