import {block} from "../../../../core/updater";

block( module, { identifier: "report:source|imposto"}).sql`

drop view if exists report.vreport_imposto;

create or replace view report.vreport_imposto as
with __imposto_report as (
  select
      tip.tipoimposto_id,
      tip.tipoimposto_codigo "CODIGO",
      tip.tipoimposto_nome "IMPOSTO",
      art.artigo_codigo as "CÓD. ART.",
      art.artigo_nome as "ARTIGO",
      cla.classe_nome as "CATEGORIA",
      cla.classe_codigo as "CÓD. CATEGORIA",
      ct.conta_titular as "CLIENTE",
      ct.conta_titularnif as "NIF",
      ct.conta_numerofatura as "FATURA",
      case
        when tx.taxa_percentagem is not null then format( '%s %s', tx.taxa_percentagem, '%' )
        else format( '%s %s', tx.taxa_taxa, 'STN' )
      end as "TAXA",
      ve.venda_impostoadicionar as "+$ IMPOSTO",
      ve.venda_impostoretirar as "-$ IMPOSTO",
      ve.venda_imposto as "$ IMPOSTO",
      case
        when ve.venda_isencao then 'SIM'
        else 'NÃO'
      end as "ISENÇÃO",
      ve.venda_montantesemimposto as "$ SUBTOTAL",
      ve.venda_montantecomimposto as "$ TOTAL",
      s.serie_id,
      s.serie_numero as "NUM. SERIE",
      s.serie_designacao as "SERIE",
      s.serie_numatorizacao as "CERT. SERIE",
      ts.tserie_desc as "TIPO SERIE",
      col.colaborador_nome as "COLABORADOR",
      ct.conta_datafecho as "DATA",
      ct.conta_datafecho::date as _date,
      ve.venda_isencao,
      ve._branch_uid,
      col.colaborador_id,
      ts.tserie_id,
      art.artigo_id,
      ve.venda_id,
      cla.classe_id

    from tweeks.tipoimposto tip
      inner join tweeks.taxa tx on tip.tipoimposto_id = tx.taxa_tipoimposto_id
      inner join tweeks.venda ve on tx.taxa_id = any( ve.venda_taxas )
      inner join tweeks.artigo art on venda_artigo_id = art.artigo_id
      inner join tweeks.classe cla on art.artigo_classe_id = cla.classe_id
      inner join tweeks.conta ct on ve.venda_conta_id = ct.conta_id
      inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
      inner join tweeks.serie s on  (ct.conta_serie->>'serie_id')::uuid = s.serie_id
      inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
) select * from __imposto_report
;

select * from report.sync( 'report.vreport_imposto', 'RELATÓRIO DE IMPOSTO', 1 );

UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'classe_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|auth.colaborador", {"name": "COLABORADOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'colaborador_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|tweeks.serie", {"name": "SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'serie_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|tweeks.tipoimposto", {"name": "TIPO IMPOSTO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'tipoimposto_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.source|tweeks.tserie", {"name": "TIPO DE SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_imposto' AND name = 'tserie_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[["query.boolean|Y/N", {"name": "ISENÇÃO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'boolean' WHERE source = 'report.vreport_imposto' AND name = 'venda_isencao';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = 995, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CODIGO';
UPDATE report.vcolumn SET position = 976, show = true, init = true, format = 'code', filter = '[["query.like", {"mode": "right", "name": "CÓDIGO DE ARTIGO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CÓD. ART.';
UPDATE report.vcolumn SET position = 973, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CÓD. CATEGORIA';
UPDATE report.vcolumn SET position = 955, show = true, init = true, format = 'code', filter = '[["query.like", {"mode": "right", "name": "NIF"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'NIF';
UPDATE report.vcolumn SET position = 795, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_imposto' AND name = 'TAXA';
UPDATE report.vcolumn SET position = 755, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_imposto' AND name = 'ISENÇÃO';
UPDATE report.vcolumn SET position = 596, show = true, init = true, format = 'code', filter = '[["query.like", {"mode": "right", "name": "NUMERO DE SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'NUM. SERIE';
UPDATE report.vcolumn SET position = 575, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'TIPO SERIE';
UPDATE report.vcolumn SET position = 945, show = true, init = true, format = 'code:long', filter = '[["query.like", {"mode": "right", "name": "FATURA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'FATURA';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'date', filter = '[["query.range|start", {"name": "DATA INICIO"}], ["query.range|end", {"name": "DATA FIM"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_imposto' AND name = '_date';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.artigo", {"name": "ARTIGO"}]]', agg = '[{"func": "count::distinct", "name": "TOTAL DE ARTIGOS", "rename": "??COUNT::DISTINCT TOTAL DE ARTIGOS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'artigo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE VENDAS", "rename": "??COUNT::DISTINCT TOTAL DE VENDAS"}]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_imposto' AND name = 'venda_id';
UPDATE report.vcolumn SET position = 785, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_imposto' AND name = '+$ IMPOSTO';
UPDATE report.vcolumn SET position = 775, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_imposto' AND name = '-$ IMPOSTO';
UPDATE report.vcolumn SET position = 765, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_imposto' AND name = '$ IMPOSTO';
UPDATE report.vcolumn SET position = 745, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_imposto' AND name = '$ SUBTOTAL';
UPDATE report.vcolumn SET position = 735, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_imposto' AND name = '$ TOTAL';
UPDATE report.vcolumn SET position = 965, show = true, init = false, format = 'name', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CLIENTE';
UPDATE report.vcolumn SET position = 975, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'ARTIGO';
UPDATE report.vcolumn SET position = 95, show = true, init = true, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'COLABORADOR';
UPDATE report.vcolumn SET position = 985, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'IMPOSTO';
UPDATE report.vcolumn SET position = 974, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CATEGORIA';
UPDATE report.vcolumn SET position = 595, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'SERIE';
UPDATE report.vcolumn SET position = 584, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_imposto' AND name = 'CERT. SERIE';
UPDATE report.vcolumn SET position = 85, show = true, init = true, format = 'timestamp', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_imposto' AND name = 'DATA';


select *
  from report.vcolumn
  where source = 'report.vreport_imposto'
  order by position desc nulls last,
    show desc nulls last,
    init desc nulls last,
    jsonb_array_length( agg ) desc,
    jsonb_array_length( filter ) desc,
    source,
    name
;

`;
