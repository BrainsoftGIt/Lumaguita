import {sql} from "kitres";

export const vreport_fluxo = sql`
drop view if exists report.vreport_fluxo;

create or replace view report.vreport_fluxo as
  select
      top.toperacao_designacao as "OPERAÇÃO",
      case
        when ain.artigo_id is null then aou.artigo_nome
        when aou.artigo_id is null then ain.artigo_nome
        when ain.artigo_id = aou.artigo_id then ain.artigo_nome
        else format( '%s ==> %s', aou.artigo_nome, ain.artigo_nome)
      end as "ARTIGO",

      case
        when ein.espaco_id is null then eou.espaco_nome
        when eou.espaco_id is null then ein.espaco_nome
        when ein.espaco_id = eou.espaco_id then ein.espaco_nome
        else format( '%s ==> %s', eou.espaco_nome, ein.espaco_nome )
      end as "ARMAZÉM",

      case
        when ain.artigo_id is null then f.fluxo_quantidadeout::text
        when aou.artigo_id is null then f.fluxo_quantidadein::text
        when ain.artigo_id = aou.artigo_id then f.fluxo_quantidadein::text
        else format( '%s ==> %s', f.fluxo_quantidadeout, f.fluxo_quantidadein )
      end as "QT",
    
      f.fluxo_documento as "DOCUMENTO",
      coalesce( f.fluxo_data, f.fluxo_dataregistro::date ) as "DATA",
      c.colaborador_nome as "COLABORADOR",
      fluxo_sequencia as "SEQUENCIA",

      ain.artigo_nome as "ART. ENTRADA",
      aou.artigo_nome as "ART. SAÍDA",
      eou.espaco_nome as "ARM. ORIGEM",
      ein.espaco_nome as "ARM. DESTINO",
      coalesce( f.fluxo_quantidadein, 0 ) as "QT+",
      coalesce( f.fluxo_quantidadeout, 0 ) as "QT-",
      f.fluxo_dataregistro as "REGISTO",
      f.fluxo_observacao as "OBSERVAÇÃO",
      case
        when ain.artigo_id is null then array[ aou.artigo_id ]::uuid[]
        when aou.artigo_id is null then array[ ain.artigo_id ]::uuid[]
        when ain.artigo_id = aou.artigo_id then array [ ain.artigo_id ]::uuid[]
        else array [ ain.artigo_id, aou.artigo_id ]::uuid[]
      end __artigo_id,

      case
        when ein.espaco_id is null then array[ eou.espaco_id ]::uuid[]
        when eou.espaco_id is null then array[ ein.espaco_id ]::uuid[]
        when ein.espaco_id = eou.espaco_id then array [ ein.espaco_id ]::uuid[]
        else array [ ein.espaco_id, eou.espaco_id ]::uuid[]
      end __espaco_id,

      case
        when clain.classe_id is null then array[ claout.classe_id ]::uuid[]
        when claout.classe_id is null then array[ clain.classe_id ]::uuid[]
        when clain.classe_id = claout.classe_id then array [ clain.classe_id ]::uuid[]
        else array [ clain.classe_id, claout.classe_id ]::uuid[]
      end __classe_id,

      f.fluxo_referencia,
      f.fluxo_id,
      top.toperacao_id,
      ain.artigo_id as __artigo_in,
      aou.artigo_id as __artigo_out,
      ein.espaco_id as __espaco_in,
      eou.espaco_id as __espaco_out,
      clain.classe_id as __classe_in,
      claout.classe_id as __classe_out,
      c.colaborador_id,
      f._branch_uid
    from tweeks.fluxo f
      inner join tweeks.toperacao top on f.fluxo_toperacao_id = top.toperacao_id
      left join tweeks.artigo ain on f.fluxo_artigo_in = ain.artigo_id
      left join tweeks.classe clain on ain.artigo_classe_id = clain.classe_id
      left join tweeks.artigo aou on f.fluxo_artigo_out = aou.artigo_id
      left join tweeks.classe claout on aou.artigo_classe_id = claout.classe_id
      left join tweeks.espaco ein on f.fluxo_espaco_in = ein.espaco_id
      left join tweeks.espaco eou on f.fluxo_espaco_out = eou.espaco_id
      left join auth.colaborador c on f.fluxo_colaborador_id = c.colaborador_id
  ;

select * from report.sync('report.vreport_fluxo', 'RELATÓRIO DE FLUXO', 1300 );

UPDATE report.vcolumn SET position = 4000, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'bigint' WHERE source = 'report.vreport_fluxo' AND name = 'SEQUENCIA';
UPDATE report.vcolumn SET position = 3000, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'OPERAÇÃO';
UPDATE report.vcolumn SET position = 1117, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'ARM. ORIGEM';
UPDATE report.vcolumn SET position = 1116, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'ARM. DESTINO';
UPDATE report.vcolumn SET position = 1115, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_fluxo' AND name = 'ARMAZÉM';
UPDATE report.vcolumn SET position = 997, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'ART. SAÍDA';
UPDATE report.vcolumn SET position = 996, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'ART. ENTRADA';
UPDATE report.vcolumn SET position = 995, show = true, init = true, format = 'name', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_fluxo' AND name = 'ARTIGO';
UPDATE report.vcolumn SET position = 985, show = true, init = true, format = 'code:long', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'DOCUMENTO';
UPDATE report.vcolumn SET position = 977, show = true, init = true, format = 'int', filter = '[["query.range|start", {"name": "QT- MÍNIMA"}], ["query.range|end", {"name": "QT- MÁXIMA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_fluxo' AND name = 'QT-';
UPDATE report.vcolumn SET position = 976, show = true, init = true, format = 'int', filter = '[["query.range|start", {"name": "QT+ MÍNIMA"}], ["query.range|end", {"name": "QT+ MÁXIMA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_fluxo' AND name = 'QT+';
UPDATE report.vcolumn SET position = 975, show = true, init = true, format = 'code:right', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_fluxo' AND name = 'QT';
UPDATE report.vcolumn SET position = 195, show = true, init = true, format = 'name', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'COLABORADOR';
UPDATE report.vcolumn SET position = 186, show = true, init = false, format = 'date', filter = '["query.date|start", "query.date|end"]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_fluxo' AND name = 'DATA';
UPDATE report.vcolumn SET position = 185, show = true, init = true, format = 'timestamp', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_fluxo' AND name = 'REGISTO';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'text', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fluxo' AND name = 'OBSERVAÇÃO';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE FLUXOS", "rename": "??COUNT::DISTINCT TOTAL DE FLUXOS"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = 'fluxo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.artigo", {"name": "ARTIGO"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid[]' WHERE source = 'report.vreport_fluxo' AND name = '__artigo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.artigo", {"name": "ARTIGO ENTRADA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__artigo_in';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.artigo", {"name": "ARTIGO SAÍDA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__artigo_out';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid[]' WHERE source = 'report.vreport_fluxo' AND name = '__classe_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA DA ENTRADA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__classe_in';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA DA SAÍDA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__classe_out';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZÉM"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid[]' WHERE source = 'report.vreport_fluxo' AND name = '__espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZÉM ENTRADA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__espaco_in';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZÉM SAÍDA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '__espaco_out';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "COLABORADOR"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = 'colaborador_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '["query.source|tweeks.toperacao"]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_fluxo' AND name = 'toperacao_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fluxo' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'jsonb' WHERE source = 'report.vreport_fluxo' AND name = 'fluxo_referencia';


select * from report.vcolumn
where source = 'report.vreport_fluxo'
order by position desc nulls last,
  show desc nulls last,
  init desc nulls last,
  jsonb_array_length( agg ) desc,
  jsonb_array_length( filter ) desc,
  source, name;
`;
