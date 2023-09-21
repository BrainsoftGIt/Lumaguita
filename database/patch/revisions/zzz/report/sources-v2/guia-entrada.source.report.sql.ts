import {block} from "../../../../core/updater";

block( module, { identifier: "report.vreport_guiaentrada|v2.0.6" }).sql`
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

select *
from report.vcolumn
where source = 'report.vreport_guiaentrada'
order by position desc nulls last,
         show desc nulls last,
         init desc nulls last,
         jsonb_array_length( agg ) desc,
         jsonb_array_length( filter ) desc,
         s2ource,
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