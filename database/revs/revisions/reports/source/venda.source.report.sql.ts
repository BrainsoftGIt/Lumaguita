import {patchSQL, sql} from "kitres";
import {VERSION} from "../../../../../server/version";

export const vreport_venda = patchSQL( { force: VERSION.VERSION_NAME }).sql`
drop view if exists report.vreport_venda;

create view report.vreport_venda as
with _const ( maguita_venda_estado_fechado, maguita_conta_estado_fechado, maguita_tserie_faturarecibo, maguita_tserie_fatura ) as (
  select 
    map.get( 'maguita_venda_estado_fechado' )::int2
    , map.get( 'maguita_conta_estado_fechado' )::int2
    , map.get( 'maguita_tserie_faturarecibo' )::int2
    , map.get( 'maguita_tserie_fatura' )::int2
)
  select
      v.venda_id,
      ct.conta_numerofatura as "FATURA",
      a.artigo_nome as "ARTIGO",
      cat.classe_nome as "CATEGORIA",
      cat.classe_codigo as "CÓD. CAT.",
      e.espaco_nome as "ARMAZÉM",
      p.posto_designacao as "POSTO",
      ct.conta_titularnif as "NIF",
      ct.conta_titular as "CLIENTE",
      v.venda_custounitario as "$ PREÇO",
      v.venda_quantidade as "QT",
      v.venda_montante as "$ MONT.",
      v.venda_montanteagregado as "$ EXTRAS",
      v.venda_montantetotal as "$ MONT+EXT",
      v.venda_imposto as "$ IMPOSTO",
      v.venda_montantesemimposto as "$ SUBTOTAL",
      v.venda_montantecomimposto as "$ TOTAL",
      ct.conta_montante as "$ MONTANTE FINAL",
      v.venda_isencao,
      case
        when venda_isencao then 'SIM' else 'NÃO'
      end as "ISEN.",
      string_agg( tip.tipoimposto_codigo, ', ' ) as "IMPOSTOS",
      string_agg( format( '%s %s', coalesce( tx.taxa_percentagem, tx.taxa_taxa ),  case when tx.taxa_percentagem is not null then '%' else 'STN' end ), ', ' )
        filter ( where tx.taxa_id is not null )
        as "TAXAS",
      array_agg( tip.tipoimposto_id ) as _tipoimposto_ids,
      a.artigo_id,
      ct.conta_datafecho::date as "DATA",
      ts.tserie_id,
      ts.tserie_desc as "SERIE",
      ct._tgrupo_id,
      ct.conta_cliente_id,
      p.posto_id,
      e.espaco_id,
      lib.str_normalize( format( '%s %s', aut.colaborador_nome, aut.colaborador_apelido ) ) as "COLABORADOR",
      v._branch_uid,
      ct.conta_colaborador_fecho as colaborador_fecho,
      cat.classe_id,
      de.deposito_id,
      de.deposito_caixa_id as _caixa_id,
      cx.caixa_code as "CAIXA",
      a.artigo_codigo as "CÓD ARTIGO"
    from _const, tweeks.venda v
      inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
      inner join tweeks.classe cat on a.artigo_classe_id = cat.classe_id
      inner join tweeks.conta ct on v.venda_conta_id = ct.conta_id
      inner join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
      inner join tweeks.espaco e on p.posto_espaco_auth = e.espaco_id
      inner join auth.colaborador aut on ct.conta_colaborador_fecho = aut.colaborador_id
      inner join tweeks.serie se on ct.conta_serie_id =  se.serie_id
      inner join tweeks.tserie ts on se.serie_tserie_id = ts.tserie_id
      left join tweeks.deposito de on ( de.deposito_referencia->>'conta_id' )::uuid = ct.conta_id
        and de.deposito_posto_id = p.posto_id
        and de.deposito_documento = ct.conta_numerofatura
      left join tweeks.caixa cx on de.deposito_caixa_id = cx.caixa_id
      
      left join tweeks.taxa tx on tx.taxa_id = any( v.venda_taxas )
      left join tweeks.tipoimposto tip on tx.taxa_tipoimposto_id = tip.tipoimposto_id

    where v.venda_estado = _const.maguita_venda_estado_fechado
      and ct.conta_estado = _const.maguita_conta_estado_fechado
      and se.serie_tserie_id in (
        _const.maguita_tserie_faturarecibo,
        _const.maguita_tserie_fatura
      )
      

    group by v.venda_id,
      a.artigo_id,
      ct.conta_id,
      p.posto_id,
      de.deposito_id,
      e.espaco_id,
      cat.classe_id,
      aut.colaborador_id,
      ts.tserie_id,
      cx.caixa_id
;

select * from report.sync( 'report.vreport_venda', 'RELATÓRIO DE VENDAS', 2000 );

UPDATE report.vcolumn SET position = 2000, show = true, init = false, format = 'code:long', filter = '[{"opr": "like", "mode": "right", "name": "FATURA", "format": "simple"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'FATURA';
UPDATE report.vcolumn SET position = 1995, show = true, init = true, format = 'name', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'ARTIGO';
UPDATE report.vcolumn SET position = 1994, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'CÓD ARTIGO';
UPDATE report.vcolumn SET position = 1895, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'CÓD. CAT.';
UPDATE report.vcolumn SET position = 1894, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'CATEGORIA';
UPDATE report.vcolumn SET position = 980, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'ARMAZÉM';
UPDATE report.vcolumn SET position = 970, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'POSTO';
UPDATE report.vcolumn SET position = 960, show = true, init = false, format = 'name', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'CLIENTE';
UPDATE report.vcolumn SET position = 115, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ PREÇO';
UPDATE report.vcolumn SET position = 114, show = true, init = true, format = 'int', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = 'QT';
UPDATE report.vcolumn SET position = 113, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ MONT.';
UPDATE report.vcolumn SET position = 112, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ EXTRAS';
UPDATE report.vcolumn SET position = 111, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ MONT+EXT';
UPDATE report.vcolumn SET position = 110, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_venda' AND name = 'IMPOSTOS';
UPDATE report.vcolumn SET position = 109, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_venda' AND name = 'TAXAS';
UPDATE report.vcolumn SET position = 108, show = false, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_venda' AND name = 'ISEN.';
UPDATE report.vcolumn SET position = 107, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ IMPOSTO';
UPDATE report.vcolumn SET position = 106, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ SUBTOTAL';
UPDATE report.vcolumn SET position = 105, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ TOTAL';
UPDATE report.vcolumn SET position = null, show = true, init = true, format = 'date', filter = '[{"opr": ">=", "name": "DATA INICO", "format": "date"}, {"opr": "<=", "name": "DATA FIM", "format": "date"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_venda' AND name = 'DATA';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[["query.like", {"mode": "right", "name": "NIF"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'NIF';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_venda' AND name = '$ MONTANTE FINAL';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'CAIXA';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_venda' AND name = 'COLABORADOR';
UPDATE report.vcolumn SET position = null, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_venda' AND name = 'SERIE';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[{"opr": "=", "src": "db", "name": "Artigo", "format": "select", "source": "tweeks.artigo"}]', agg = '[{"func": "count::distinct", "name": "TOTAL DE ARTIGOS", "rename": "??COUNT::DISTINCT TOTAL DE ARTIGOS"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'artigo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[{"func": "count::distinct", "name": "TOTAL DE VENDAS", "rename": "??COUNT::DISTINCT TOTAL DE VENDAS"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'venda_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.caixa", {"name": "CAIXA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = '_caixa_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tgroup", {"name": "TIPO DE CONTA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_venda' AND name = '_tgrupo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.classe", {"name": "CATEGORIA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'classe_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '["query.source|auth.colaborador"]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'colaborador_fecho';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.cliente", {"name": "CLIENTE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'conta_cliente_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[{"opr": "=", "src": "db", "name": "ARMAZÉM", "format": "select", "source": "tweeks.espaco"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[{"opr": "=", "src": "db", "name": "Posto", "format": "select", "source": "tweeks.posto"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'posto_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tserie::venda", {"name": "SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_venda' AND name = 'tserie_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.boolean|Y/N", {"name": "ISENÇÃO"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'boolean' WHERE source = 'report.vreport_venda' AND name = 'venda_isencao';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid[]' WHERE source = 'report.vreport_venda' AND name = '_tipoimposto_ids';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_venda' AND name = 'deposito_id';


select *
  from report.vcolumn
  where source = 'report.vreport_venda'
  order by position desc nulls last,
           show desc nulls last,
           init desc nulls last,
           jsonb_array_length( agg ) desc,
           jsonb_array_length( filter ) desc,
           source,
           name
;
`;
