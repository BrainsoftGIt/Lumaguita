import {patchSQL, sql} from "kitres";
import {VERSION} from "../../../../../server/version";

export const vreport_balanco = patchSQL( { force: VERSION.VERSION_CODE }).sql`
drop view if exists report.vreport_balanco;

create or replace view report.vreport_balanco as
with
  _const ( maguita_conta_estado_fechado, maguita_venda_estado_fechado ) as ( 
    select 
      map.get('maguita_conta_estado_fechado')::int2,
      map.get('maguita_venda_estado_fechado')::int2
  ),
  __lancamento as ( select * from tweeks.__lancamento_regularizacao() l ),
  __receitas as (
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,
        cla.classe_id,
        cla.classe_nome,
        es.espaco_id,
        es.espaco_nome,
        ve.venda_montantecomimposto,
        ve.venda_quantidade,
        l.regula_montante as conta_montanteefetivo,

        -- Obter a percentagem da conta que foi paga
        l.regula_montante/ct.conta_montante as conta_percentageefetiva,

        -- Obter o equivalente percentual pago nos item da fatura
        ((l.regula_montante/ct.conta_montante ) * ve.venda_montantecomimposto)::double precision as venda_montanteefetivo,


        ct.conta_data,
        ct._branch_uid
      from _const, tweeks.conta ct
        inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve.venda_venda_id is null
        inner join tweeks.espaco es on ct.conta_espaco_auth = es.espaco_id
        inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
        inner join tweeks.classe cla on art.artigo_classe_id = cla.classe_id
        inner join __lancamento l on ct.conta_id = l.lancamento_refid
      where ct.conta_estado = _const.maguita_conta_estado_fechado
        and ve.venda_estado = _const.maguita_venda_estado_fechado
  ), ___despesas as (
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,
        cla.classe_id,
        cla.classe_nome,
        es.espaco_id,
        es.espaco_nome,
        g.guia_date as entrada_data,
        g.guia_documentoperacao as entrada_codigofatura,
        en.entrada_quantidade,
        en.entrada_custounitario as quantidade_custounidade,
        en.entrada_custounitario * en.entrada_quantidade as entrada_montanteefetivo,
        0.0::double precision  as entrada_montanteprevisto,
        en._branch_uid
      from tweeks.entrada en
        inner join tweeks.guia g on en.entrada_guia_id = g.guia_uid
        inner join tweeks.espaco es on en.entrada_espaco_destino = es.espaco_id
        inner join tweeks.artigo art on en.entrada_artigo_id = art.artigo_id
        inner join tweeks.classe cla on art.artigo_classe_id = cla.classe_id
), __union as (
  select
      coalesce( __rec.artigo_id, _desps.artigo_id ) as artigo_id,
      coalesce( __rec.artigo_nome, _desps.artigo_nome ) as artigo_nome,
      coalesce( __rec.artigo_codigo, _desps.artigo_codigo ) as artigo_codigo,
      coalesce( __rec.classe_id, _desps.classe_id ) as classe_id,
      coalesce( __rec.classe_nome, _desps.classe_nome ) as classe_nome,
      coalesce( __rec.espaco_id, _desps.espaco_id ) as espaco_id,
      coalesce( __rec.espaco_nome, _desps.espaco_nome ) as espaco_nome,
      coalesce( __rec._branch_uid, _desps._branch_uid ) as _branch_uid,

      coalesce( __rec.conta_data, _desps.entrada_data ) as data,

      coalesce( _desps.entrada_quantidade, 0.0 ) as despesa_quantidade,
      coalesce( _desps.entrada_montanteefetivo, 0.0 ) as despesa_montanteefetivo,
      coalesce( _desps.entrada_montanteprevisto, 0.0 ) as despesa_montanteprevisto,

      coalesce( __rec.venda_quantidade, 0.0 ) as receita_quantidade,
      coalesce( __rec.venda_montanteefetivo, 0.0::double precision) as receita_montanteefetivo,
      coalesce( __rec.venda_montantecomimposto - __rec.venda_montanteefetivo, 0.0::double precision ) as receita_montanteprevisto

    from __receitas __rec
      full join ___despesas _desps on __rec.conta_data = _desps.entrada_data
        and __rec.artigo_id = _desps.artigo_id
        and __rec.classe_id = _desps.classe_id
        and __rec.espaco_id = _desps.espaco_id

), __resultado as (
  select
      _un.artigo_id,
      _un.artigo_nome as "ARTIGO",
      _un.artigo_codigo as "CÓDIGO",
      _un.classe_id,
      _un.espaco_id,
      _un.espaco_nome as "ARMAZÉM",
      _un._branch_uid,
      _un.classe_nome as "CATEGORIA",
      _un.data as "DATA",
      
      sum( _un.despesa_quantidade ) as "QT. ENTRADA",
      sum( _un.receita_montanteefetivo ) as "$ RECEITA EFET.",
      sum( _un.receita_montanteprevisto ) as "$ RECEITA PREV.",
      sum( _un.receita_montanteefetivo + _un.receita_montanteprevisto ) as "$ RECEITA ESTI.",

      sum( _un.receita_quantidade ) as "QT. SAÍDA",
      sum( _un.despesa_montanteefetivo ) as "$ DESPESA EFET.",
      sum( _un.despesa_montanteprevisto ) as "$ DESPESA PREV.",
      sum( _un.despesa_montanteefetivo + _un.despesa_montanteprevisto ) as "$ DESPESA ESTI.",

      sum( _un.receita_montanteprevisto - _un.despesa_montanteprevisto ) as "$ REST. PREV.",

      sum( _un.receita_montanteefetivo - _un.despesa_montanteefetivo ) as "$ REST. EFET.",
      sum( ( ( _un.receita_montanteefetivo + _un.receita_montanteprevisto ) ) - ( _un.despesa_montanteefetivo + _un.despesa_montanteprevisto ) ) as "$ REST. ESTI.",
      sum( _un.despesa_quantidade - _un.receita_quantidade ) as "REST. QT."
    from __union _un
    group by
      _un.artigo_id,
      _un.espaco_id,
      _un.espaco_nome,
      _un.artigo_nome,
      _un.artigo_codigo,
      _un.classe_id,
      _un.classe_nome,
      _un._branch_uid,
      _un.data

) select * from __resultado
order by "CATEGORIA", "ARTIGO", "DATA"
;

-- select to_char( acesso_dataregisto, 'DD-MM-YYYY HH:MI' ), count(*)
--   from auth.acesso
--   group by --to_char( acesso_dataregisto, 'DD-MM-YYYY HH:MI' )
--           to_char( acesso_dataregisto, 'YYYY-MM-DD HH:MI' )
--   order by  to_char( acesso_dataregisto, 'YYYY-MM-DD HH:MI' ) desc;


select * from report.sync( 'report.vreport_balanco', 'RELATÓRIO DE BALANÇO', 1 );

UPDATE report.vcolumn SET position = 1996, show = true, init = true, format = 'name', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_balanco' AND name = 'ARTIGO';
UPDATE report.vcolumn SET position = 1995, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_balanco' AND name = 'CÓDIGO';
UPDATE report.vcolumn SET position = 1994, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_balanco' AND name = 'CATEGORIA';
UPDATE report.vcolumn SET position = 1895, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_balanco' AND name = 'ARMAZÉM';
UPDATE report.vcolumn SET position = 89, show = true, init = true, format = 'int', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = 'QT. ENTRADA';
UPDATE report.vcolumn SET position = 88, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ DESPESA PREV.';
UPDATE report.vcolumn SET position = 87, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ DESPESA EFET.';
UPDATE report.vcolumn SET position = 86, show = false, init = false, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ DESPESA ESTI.';
UPDATE report.vcolumn SET position = 79, show = true, init = true, format = 'int', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = 'QT. SAÍDA';
UPDATE report.vcolumn SET position = 78, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ RECEITA PREV.';
UPDATE report.vcolumn SET position = 77, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ RECEITA EFET.';
UPDATE report.vcolumn SET position = 76, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ RECEITA ESTI.';
UPDATE report.vcolumn SET position = 50, show = true, init = true, format = 'int', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = 'REST. QT.';
UPDATE report.vcolumn SET position = 49, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ REST. PREV.';
UPDATE report.vcolumn SET position = 48, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ REST. EFET.';
UPDATE report.vcolumn SET position = 47, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_balanco' AND name = '$ REST. ESTI.';
UPDATE report.vcolumn SET position = 0, show = true, init = true, format = 'date', filter = '["query.date|start", "query.date|end"]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_balanco' AND name = 'DATA';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '["query.source|tweeks.artigo"]', agg = '[{"func": "count::distinct", "name": "TOTAL DE ARTIGO", "rename": "??COUNT::DISTINCT TOTAL ARTIGO"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_balanco' AND name = 'artigo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '["query.source|tweeks.classe"]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_balanco' AND name = 'classe_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '["query.source|tweeks.espaco"]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_balanco' AND name = 'espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_balanco' AND name = '_branch_uid';


select * from report.vcolumn
where source = 'report.vreport_balanco'
order by position desc nulls last,
         show desc nulls last,
         init desc nulls last,
         jsonb_array_length( agg ) desc,
         jsonb_array_length( filter ) desc,
         source, name;
`;
