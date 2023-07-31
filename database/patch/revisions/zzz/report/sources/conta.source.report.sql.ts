import {block} from "../../../../core/updater";

block( module, { identifier: "report:source|conta"}).sql`
drop view if exists report.vreport_conta;

create view report.vreport_conta as
with _const as (
  select
      m.*,
      cluster.__format( 'tweeks.conta' ) as ___conta_regclass,
      cluster.__format( 'tweeks.deposito' ) as ___deposito_regclass
    from map.constant() m ),
     _lancamento as ( select *  from tweeks.__lancamento_regularizacao()
), __conta_report as (
  select
      l.lancamento_sequencia as "SEQUÊNCIA",
      cli.cliente_titular as "CLIENTE",
      cli.cliente_nif as "NIF",
      l.lancamento_doc as "DOCUMENTO",
      l.credito as "$ CREDITO",
      l.debito as "$ DEBITO",
      l.valor as "$ MONTANTE",
      l.entrada as "$ RESULTADO",
      l.regula_montante as "$ REGULARIZADO",
      tlanc.tlancamento_desc as "TIPO",
      tg.tgrupo_desc as "CONTA",
      case
        when lanc.lancamento_operacao =  1 then 'CREDITO'
        when lanc.lancamento_operacao = -1 then 'DEBITO'
      end as "OPERAÇÃO",
      case
        when lanc.lancamento_mode = _const.maguita_lancamento_mode_manual then 'MANUAL'
        when lanc.lancamento_mode = _const.maguita_lancamento_mode_automatic then 'AUTOMATICO'
        end as "MODO",
      col.colaborador_nome as "COLABORADOR",
      l.lancamento_data as "DATA",
      l.lancamento_time as "REGISTRO",
      lanc.lancamento_descricao as "OBSERVAÇÃO",
      lanc.lancamento_id,
      cli.cliente_id,
      case when lanc.lancamento_regclass = _const.___conta_regclass then lanc.lancamento_refid end as _conta_id,
      case when lanc.lancamento_regclass = _const.___deposito_regclass then lanc.lancamento_refid end as _deposito_id,
      tg.tgrupo_id,
      tlanc.tlancamento_id,
      col.colaborador_id,
      lanc.lancamento_mode,
      lanc._branch_uid,
      lanc.lancamento_operacao
    from  _const
      inner join _lancamento l on true
      inner join tweeks.lancamento lanc on l.lancamento_id = lanc.lancamento_id
      inner join tweeks.tlancamento tlanc on lanc.lancamento_tlancamento_id = tlanc.tlancamento_id
      inner join tweeks.cliente cli on l.cliente_id = cli.cliente_id
      inner join tweeks.tgrupo tg on lanc._tgrupo_id = tg.tgrupo_id
      inner join auth.colaborador col on lanc.lancamento_colaborador_id = col.colaborador_id
  order by l.lancamento_sequencia
) select *
    from __conta_report;

select * from report.sync( 'report.vreport_conta', 'RELATÓRIO DE CONTA/LANÇAMENTO', 1 );

UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = 1894, show = true, init = false, format = 'code', filter = '[["query.like", {"name": "NIF"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'NIF';
UPDATE report.vcolumn SET position = 1695, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'TIPO';
UPDATE report.vcolumn SET position = 1685, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'CONTA';
UPDATE report.vcolumn SET position = 1684, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_conta' AND name = 'OPERAÇÃO';
UPDATE report.vcolumn SET position = 1675, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_conta' AND name = 'MODO';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'code', filter = '[["query.source|tweeks.lancamento::mode", {"name": "MODO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_conta' AND name = 'lancamento_mode';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'code', filter = '[["query.source|tweeks.toperacao", {"name": "TIPO DE OPERAÇÃO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_conta' AND name = 'lancamento_operacao';
UPDATE report.vcolumn SET position = 1795, show = true, init = true, format = 'code:long', filter = '[["query.like", {"name": "DOCUMENTO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'DOCUMENTO';
UPDATE report.vcolumn SET position = 95, show = true, init = true, format = 'date', filter = '[["query.range|start", {"name": "DATA INICIO"}], ["query.range|end", {"name": "DATA FIM"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_conta' AND name = 'DATA';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.cliente", {"name": "CLIENTE"}]]', agg = '[{"func": "count::distinct", "name": "TOTAL CLIENTES", "format": "int", "rename": "??COUNT::DISTINCT TOTAL DE CLIENTES"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = 'cliente_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE FATURA", "format": "int", "rename": "??COUNT::DISTINCT TOTAL DE FATURAS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = '_conta_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE DEPOSITOS", "format": "int", "rename": "??COUNT::DISTINCT TOTAL DE DEPOSITOS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = '_deposito_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE LANÇAMENTO", "format": "int", "rename": "??COUNT::DISTINCT TOTAL DE  LANCAMENTO"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = 'lancamento_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "COLABORADOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_conta' AND name = 'colaborador_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tgroup", {"name": "TIPO DE CONTA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_conta' AND name = 'tgrupo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tlancamento", {"name": "TIPO DE LANÇAMENTO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_conta' AND name = 'tlancamento_id';
UPDATE report.vcolumn SET position = 1995, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'bigint' WHERE source = 'report.vreport_conta' AND name = 'SEQUÊNCIA';
UPDATE report.vcolumn SET position = 1785, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_conta' AND name = '$ CREDITO';
UPDATE report.vcolumn SET position = 1775, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_conta' AND name = '$ DEBITO';
UPDATE report.vcolumn SET position = 1775, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_conta' AND name = '$ MONTANTE';
UPDATE report.vcolumn SET position = 1765, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_conta' AND name = '$ RESULTADO';
UPDATE report.vcolumn SET position = 1755, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_conta' AND name = '$ REGULARIZADO';
UPDATE report.vcolumn SET position = 1895, show = true, init = true, format = 'name', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'CLIENTE';
UPDATE report.vcolumn SET position = 100, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'COLABORADOR';
UPDATE report.vcolumn SET position = 0, show = true, init = false, format = 'text', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_conta' AND name = 'OBSERVAÇÃO';
UPDATE report.vcolumn SET position = 85, show = true, init = true, format = 'timestamp', filter = '[["query.range|end", {"name": "REGISTRO INICIO"}], ["query.range|end", {"name": "REGISTRO FIM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_conta' AND name = 'REGISTRO';


select * from report.vcolumn
  where source = 'report.vreport_conta'
  order by position desc nulls last,
    show desc nulls last,
    init desc nulls last,
    jsonb_array_length( agg ) desc,
    jsonb_array_length( filter ) desc,
    source, name;
`;
