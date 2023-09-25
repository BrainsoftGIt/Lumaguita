import {sql} from "kitres";

export const vreport_caixa = sql`
drop view if exists report.vreport_caixa;

create view report.vreport_caixa as
with  _const ( maguita_caixa_estado_fechado, maguita_caixa_estado_ativo ) as (
  select 
    map.get('maguita_caixa_estado_fechado')::int2,
    map.get('maguita_caixa_estado_ativo')::int2
), __report_caixa as (
  select
      cx.caixa_id,
      cx.caixa_code as "CAIXA",
      cx.caixa_montantefecho as "$ CAP. FEC.",
      cx.caixa_montantefechoposto "$ CAP. FEC. POS",

      cx.caixa_montanteinicial "$ CAP. INI.",
      cx.caixa_montanteinicialposto as "$ CAP. INI. POS",


      cx.caixa_quantidadecheque as "CHEQUES",
      cx.caixa_quantidadechequeposto as "CHEQUES POS",
      cx.caixa_observacao as "OBSERVAÇÃO",
      cx.caixa_dataregistro as "ABERTURA",

      case
        when coclose.colaborador_id is not null then cx.caixa_dataatualizacao
      end as "FECHO",
    
      case
        when cx.caixa_estado = _const.maguita_caixa_estado_fechado then 'FECHADO'
        when cx.caixa_estado = _const.maguita_caixa_estado_ativo then 'ABERTA'
      end as "ESTADO CAIXA",
      pos.posto_designacao as "POSTO",
      e.espaco_nome as "ARMAZÉM",
      owner.colaborador_id as colaborador_owner,
      owner.colaborador_nome as "PROPRIETARIO",
      coclose.colaborador_id as colaborador_close,
      coclose.colaborador_nome as "ENCERADOR",
      opr.colaborador_id as colaborador_operador,
      opr.colaborador_nome as "OPERADOR",
      coalesce( ct.conta_titularnif, cli.cliente_titular ) as "TITULAR",
      coalesce( ct.conta_titularnif, cli.cliente_nif ) as "NIF",
      de.deposito_documento as "P. RECIBO",
      tp.tpaga_designacao "P. MODALIDADE",
      de.deposito_docref "P. DOCUMENTO",
      cur.currency_code as "P. MOEDA",
      de.deposito_montantemoeda as "P. $RECEBIDO",
      de.deposito_taxacambio as "P. $CÂMBIO",
      de.deposito_montante as "P. $REC. x $CÂM.",
      de.deposito_montantetroco as "P. $TROCO",
      de.deposito_montantefinal as "P. $M. FINAL",
      de.deposito_data as "P. DATA",
      de.deposito_dataregistro as "ENTRADA",

      cli.cliente_id,
      pos.posto_id,
      e.espaco_id,
      de.deposito_id,
      cur.currency_id,
      cx.caixa_estado,
      tp.tpaga_id,
      cx._branch_uid
    from _const
      inner join tweeks.caixa cx on true
      inner join tweeks.posto pos on cx.caixa_posto_id = pos.posto_id
      inner join tweeks.espaco e on pos.posto_espaco_auth = e.espaco_id
      inner join auth.colaborador owner on cx.caixa_colaborador_id = owner.colaborador_id
      left join auth.colaborador coclose on cx.caixa_colaborador_atualizacao = coclose.colaborador_id
        and cx.caixa_estado = _const.maguita_caixa_estado_fechado
      left join tweeks.deposito de on cx.caixa_id = de.deposito_caixa_id
      left join tweeks.cliente cli on cli.cliente_id = de.deposito_cliente_id
      left join tweeks.conta ct on cli.cliente_id = ct.conta_cliente_id
        and ct.conta_id = (de.deposito_referencia->>'conta_id')::uuid
        and ct.conta_numerofatura = de.deposito_documento
      left join auth.colaborador opr on de.deposito_colaborador_id = opr.colaborador_id
      left join geoinfo.currency cur on de.deposito_currency_id = cur.currency_id
      left join tweeks.tpaga tp on de.deposito_tpaga_id = tp.tpaga_id
) select *
   from __report_caixa;

select * from report.sync( 'report.vreport_caixa', 'RELATÓRIO DE CAIXA', 1600 );

UPDATE report.vcolumn SET position = 3000, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'CAIXA';
UPDATE report.vcolumn SET position = 990, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'ARMAZÉM';
UPDATE report.vcolumn SET position = 980, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'POSTO';
UPDATE report.vcolumn SET position = 960, show = true, init = false, format = 'timestamp', filter = '[["query.range|start", {"name": "ABERTURA INICIO"}], ["query.range|end", {"name": "ABERTURA FIM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_caixa' AND name = 'ABERTURA';
UPDATE report.vcolumn SET position = 599, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = '$ CAP. INI.';
UPDATE report.vcolumn SET position = 598, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = '$ CAP. INI. POS';
UPDATE report.vcolumn SET position = 589, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = '$ CAP. FEC.';
UPDATE report.vcolumn SET position = 588, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = '$ CAP. FEC. POS';
UPDATE report.vcolumn SET position = 579, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_caixa' AND name = 'CHEQUES';
UPDATE report.vcolumn SET position = 578, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_caixa' AND name = 'CHEQUES POS';
UPDATE report.vcolumn SET position = 309, show = true, init = false, format = 'name', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'TITULAR';
UPDATE report.vcolumn SET position = 308, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'NIF';
UPDATE report.vcolumn SET position = 299, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'P. MODALIDADE';
UPDATE report.vcolumn SET position = 299, show = true, init = true, format = 'code:long', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'P. RECIBO';
UPDATE report.vcolumn SET position = 299, show = true, init = false, format = 'date', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_caixa' AND name = 'P. DATA';
UPDATE report.vcolumn SET position = 299, show = true, init = false, format = 'code:long', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'P. DOCUMENTO';
UPDATE report.vcolumn SET position = 258, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = 'P. $RECEBIDO';
UPDATE report.vcolumn SET position = 257, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'P. MOEDA';
UPDATE report.vcolumn SET position = 256, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = 'P. $CÂMBIO';
UPDATE report.vcolumn SET position = 255, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = 'P. $REC. x $CÂM.';
UPDATE report.vcolumn SET position = 254, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = 'P. $TROCO';
UPDATE report.vcolumn SET position = 253, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_caixa' AND name = 'P. $M. FINAL';
UPDATE report.vcolumn SET position = 197, show = true, init = true, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'OPERADOR';
UPDATE report.vcolumn SET position = 196, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'PROPRIETARIO';
UPDATE report.vcolumn SET position = 195, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'ENCERADOR';
UPDATE report.vcolumn SET position = 194, show = true, init = true, format = 'timestamp', filter = '[["query.range|start", {"name": "ENTRADA INICIO"}], ["query.range|end", {"name": "ENTRADA FIM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_caixa' AND name = 'ENTRADA';
UPDATE report.vcolumn SET position = 193, show = true, init = false, format = 'timestamp', filter = '[["query.range|start", {"name": "FECHO INICIO"}], ["query.range|end", {"name": "FECHO FIM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_caixa' AND name = 'FECHO';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_caixa' AND name = 'ESTADO CAIXA';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'text', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_caixa' AND name = 'OBSERVAÇÃO';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL PAGAMENTOS", "rename": "??COUNT::DISTINCT TOTAL PAGAMENTOS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'deposito_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|tweeks.caixa::estado", {"name": "ESTADO DA CAIXA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_caixa' AND name = 'caixa_estado';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "ENCERADOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'colaborador_close';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "OPERADOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'colaborador_operador';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "PROPRIETARIO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'colaborador_owner';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|geoinfo.currency", {"name": "MOEDA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_caixa' AND name = 'currency_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZÉM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.posto", {"name": "POSTO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'posto_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tpaga", {"name": "MODALIDADE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_caixa' AND name = 'tpaga_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'caixa_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_caixa' AND name = 'cliente_id';



select *
  from report.vcolumn
  where source = 'report.vreport_caixa'
  order by position desc nulls last,
  show desc nulls last,
  init desc nulls last,
  jsonb_array_length( agg ) desc,
  jsonb_array_length( filter ) desc,
  source,
  name
;

`;
