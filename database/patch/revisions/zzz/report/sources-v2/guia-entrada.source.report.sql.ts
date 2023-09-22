import {block} from "../../../../core/updater";

block( module, { identifier: `report.vreport_guiaentrada|v2.0.6-${Math.random()}` }).sql`
drop view if exists report.vreport_guiaentrada;
create view report.vreport_guiaentrada as 
  select 
      em.entrada_lote as "LOTE",
      em.entrada_quantidade as "QT",
      em.entrada_descricao as "DESCRICAO",
      em.entrada_quantidadeinicial as "QT ANTES",
      em.entrada_validade as "VALIDADE",
      em.entrada_custounitario as "$ UNIT",
      (em.entrada_quantidade * em.entrada_custounitario) as "$ TOTAL",
      g.guia_date as "DATA",
      g.guia_documentoperacao as "DOCUMENTO",
      g.guia_numero as "NUMERO",
      g.guia_observacao as "OBS",
      f.fornecedor_nome as "FORNECEDOR",
      f.fornecedor_nif as "F. NIF",
      f.fornecedor_code as "CÓD. FOR.",
      e.espaco_nome as "ARMAZEM",
      e.espaco_codigo as "CÓD. ARM.",
      a.artigo_nome as "ARTIGO",
      a.artigo_codigo as "CÓD. ART.",
      cla.classe_nome as "CATEGORIA",
      cla.classe_codigo as "CÓD. CAT.",
      em.entrada_id,
      g.guia_uid,
      f.fornecedor_id,
      e.espaco_id,
      a.artigo_id,
      cla.classe_id,
      em._branch_uid
    from tweeks.entrada em
      inner join tweeks.guia g on em.entrada_guia_id = g.guia_uid
      inner join tweeks.artigo a on em.entrada_artigo_id = a.artigo_id
      inner join tweeks.classe cla on a.artigo_classe_id = cla.classe_id
      left join tweeks.fornecedor f on f.fornecedor_id = (g.guia_refs->'fornecedor'->>'fornecedor_id')::uuid
      left join tweeks.espaco e on e.espaco_id = (g.guia_refs->'destino'->>'espaco_id')::uuid
;

select * from report.sync( 'report.vreport_guiaentrada', 'RELATÓRIO DE GUIA ENTRADA' );

UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'date', filter = '[{"opr": ">=", "name": "ENTRADA DE", "format": "date"}, {"opr": "<=", "name": "ENTRADA ATÉ", "format": "date"}]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_guiaentrada' AND name = 'DATA';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'code', filter = '[["query.like", {"mode": "right", "name": "DOCUMENTO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'DOCUMENTO';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_guiaentrada' AND name = '$ TOTAL';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_guiaentrada' AND name = '$ UNIT';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'ARMAZEM';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'ARTIGO';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'FORNECEDOR';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'date', filter = '[{"opr": ">=", "name": "VALIDO DE", "format": "date"}, {"opr": "<=", "name": "VALIDO ATÉ", "format": "date"}]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_guiaentrada' AND name = 'VALIDADE';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[["query.like", {"mode": "right", "name": "NUMERO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'NUMERO';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'CATEGORIA';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'CÓD. ARM.';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'CÓD. ART.';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'CÓD. CAT.';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'name', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'DESCRICAO';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'F. NIF';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'LOTE';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'name', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'OBS';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_guiaentrada' AND name = 'QT';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_guiaentrada' AND name = 'QT ANTES';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.artigo", {"name": "ARTIGO"}]]', agg = '[{"func": "count::distinct", "name": "TOTAL DE ARTIGOS", "rename": "??COUNT::DISTINCT TOTAL DE ARTIGOS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'artigo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA"}]]', agg = '[{"func": "count::distinct", "name": "TOTAL DE CLASSE", "rename": "??COUNT::DISTINCT TOTAL DE CLASSE"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'classe_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE ENTRADAS", "rename": "??COUNT::DISTINCT TOTAL DE ENTRADAS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'entrada_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZEM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.fornecedor", {"name": "FORNECEDOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'fornecedor_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_guiaentrada' AND name = 'CÓD. FOR.';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_guiaentrada' AND name = 'guia_uid';


select *
from report.vcolumn
where source = 'report.vreport_guiaentrada'
order by position desc nulls last,
         show desc nulls last,
         init desc nulls last,
         jsonb_array_length( agg ) desc,
         jsonb_array_length( filter ) desc,
         source,
         name
;

/*
 name:short
name
code
code
name:short
name:short
name:short
name
money
int
money
money
money
code
code
money
money
money
date
code
money
name:mid
id
id
id
id
id
id
id
id
id
id
id

 */

`