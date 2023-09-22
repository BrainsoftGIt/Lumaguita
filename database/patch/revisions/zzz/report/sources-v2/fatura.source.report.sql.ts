import {block} from "../../../../core/updater";

block( module, { identifier: "report:source|fatura-v2.0.6", flags:[] })
    //language=PostgreSQL
    .sql`
drop view if exists report.vreport_fatura;

create or replace view report.vreport_fatura as
with _const ( maguita_conta_estado_fechado, maguita_conta_estado_aberto, maguita_conta_estado_anulado) as (
  select 
    map.get('maguita_conta_estado_fechado')::int2,
    map.get('maguita_conta_estado_aberto')::int2,
    map.get('maguita_conta_estado_anulado')::int2
)
select
    ct.conta_id,
    ct.conta_data as "DATA",
    ct.conta_dataregistro::date as "REGISTO",
    ct.conta_datafecho as "FECHO",
    ct.conta_numerofatura as "FATURA",
    case
      when ct.conta_proforma then 'SIM'
      else 'NÃO'
    end as "PROFOMA",
  
    ct.conta_proforma,
    case
      when ct.conta_estado = _const.maguita_conta_estado_fechado then 'FECHADO'
      when ct.conta_estado = _const.maguita_conta_estado_aberto then 'ABERTO'
    end as "ESTADO",
    ct.conta_numero as "Nº CONTA",
    ct.conta_imprensa as "INPRESSÕES",
    ct.conta_proformavencimento as "PROF. VENCIMENTO",
    ct.conta_estado,
    tc.tgrupo_id,
    ct._branch_uid,
    tc.tgrupo_desc as "TIPO CONTA",
    ct.conta_montante as "$ MONTANTE",
    ct.conta_desconto as "$ DESCONTO",
    ct.conta_montante - ct.conta_desconto as "$ PAGAR",
    c.cliente_id,
    c.cliente_titular as "CLIENTE",
    c.cliente_nif as "NIF",
    p.posto_id,
    p.posto_designacao as "POSTO",
    e.espaco_id,
    e.espaco_nome as "ARMAZÉM",
    e.espaco_codigo as "CÓDIGO AR.",
    col_vend.colaborador_nome  as "VENDEDOR",
    col_open.colaborador_nome as "ABERTURA",
    s.serie_numero as "Nº SERIE",
    s.serie_designacao as "SERIE",
    ts.tserie_desc as "TIPO SERIE",
    col_open.colaborador_id as colaborador_abertura,
    col_vend.colaborador_id as colaborador_vendor,
    ts.tserie_id,
    s.serie_id

  from _const, tweeks.conta ct
    inner join tweeks.tgrupo tc on ct._tgrupo_id = tc.tgrupo_id
    inner join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
    inner join tweeks.espaco e on p.posto_espaco_auth = e.espaco_id
    inner join auth.colaborador col_open on ct.conta_colaborador_id = col_open.colaborador_id
    left join auth.colaborador col_vend on ct.conta_colaborador_fecho = col_vend.colaborador_id
    left join tweeks.serie s on ct.conta_serie_id = s.serie_id
    left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
    left join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
  where ct.conta_estado != _const.maguita_conta_estado_anulado
;

select * from report.sync( 'report.vreport_fatura', 'RELATÓRIO DE FATURA', 250 );

UPDATE report.vcolumn SET position = 10000, show = true, init = true, format = 'code:long', filter = '[{"opr": "like", "mode": "right", "name": "FATURA", "format": "simple"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'FATURA';
UPDATE report.vcolumn SET position = 1900, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'integer' WHERE source = 'report.vreport_fatura' AND name = 'Nº CONTA';
UPDATE report.vcolumn SET position = 1885, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'POSTO';
UPDATE report.vcolumn SET position = 995, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'CÓDIGO AR.';
UPDATE report.vcolumn SET position = 994, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'ARMAZÉM';
UPDATE report.vcolumn SET position = 986, show = true, init = true, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'NIF';
UPDATE report.vcolumn SET position = 985, show = true, init = false, format = 'name', filter = '[{"opr": "like", "mode": "right", "name": "NOME DO CLIENTE", "format": "simple"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'CLIENTE';
UPDATE report.vcolumn SET position = 555, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_fatura' AND name = '$ MONTANTE';
UPDATE report.vcolumn SET position = 554, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_fatura' AND name = '$ DESCONTO';
UPDATE report.vcolumn SET position = 553, show = true, init = true, format = 'money', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'double precision' WHERE source = 'report.vreport_fatura' AND name = '$ PAGAR';
UPDATE report.vcolumn SET position = 545, show = true, init = true, format = 'name:short', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'TIPO CONTA';
UPDATE report.vcolumn SET position = 544, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_fatura' AND name = 'PROFOMA';
UPDATE report.vcolumn SET position = 543, show = true, init = false, format = 'date', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_fatura' AND name = 'PROF. VENCIMENTO';
UPDATE report.vcolumn SET position = 396, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'TIPO SERIE';
UPDATE report.vcolumn SET position = 395, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'Nº SERIE';
UPDATE report.vcolumn SET position = 394, show = true, init = false, format = 'name:short', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'SERIE';
UPDATE report.vcolumn SET position = 295, show = true, init = false, format = 'int', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_fatura' AND name = 'INPRESSÕES';
UPDATE report.vcolumn SET position = 95, show = true, init = true, format = 'name:mid', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'VENDEDOR';
UPDATE report.vcolumn SET position = 94, show = true, init = false, format = 'name:mid', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'character varying' WHERE source = 'report.vreport_fatura' AND name = 'ABERTURA';
UPDATE report.vcolumn SET position = 86, show = true, init = false, format = 'timestamp', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'timestamp with time zone' WHERE source = 'report.vreport_fatura' AND name = 'FECHO';
UPDATE report.vcolumn SET position = 85, show = true, init = true, format = 'date', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_fatura' AND name = 'DATA';
UPDATE report.vcolumn SET position = 84, show = true, init = false, format = 'date', filter = '[{"opr": ">=", "name": "Data inicio", "format": "date"}, {"opr": "<=", "name": "Data fim", "format": "date"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'date' WHERE source = 'report.vreport_fatura' AND name = 'REGISTO';
UPDATE report.vcolumn SET position = 70, show = true, init = false, format = 'code', filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'text' WHERE source = 'report.vreport_fatura' AND name = 'ESTADO';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.cliente", {"name": "CLIENTE"}]]', agg = '[{"func": "count::distinct", "name": "TOTAL DE CLIENTES", "rename": "??COUNT::DISTINCT TOTAL DE CLIENTES"}]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'cliente_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "COLABORADOR ABERTURA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'colaborador_abertura';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|auth.colaborador", {"name": "COLABORADOR VENDEDOR"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'colaborador_vendor';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.boolean|Y/N", {"name": "PROFORMA"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'boolean' WHERE source = 'report.vreport_fatura' AND name = 'conta_proforma';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.espaco", {"name": "ARMAZÉM"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'espaco_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[{"opr": "=", "src": "db", "name": "Posto", "format": "select", "source": "tweeks.posto"}]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'posto_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.serie", {"name": "SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'serie_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tgroup", {"name": "TIPO DE CONTA"}]]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_fatura' AND name = 'tgrupo_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[["query.source|tweeks.tserie", {"name": "TIPO DE SERIE"}]]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_fatura' AND name = 'tserie_id';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = '_branch_uid';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = null, filter = '[]', agg = '[]', noagg = false, gen = '[]', rename = null, type = 'smallint' WHERE source = 'report.vreport_fatura' AND name = 'conta_estado';
UPDATE report.vcolumn SET position = null, show = false, init = false, format = 'id', filter = '[]', agg = '[]', noagg = null, gen = '[]', rename = null, type = 'uuid' WHERE source = 'report.vreport_fatura' AND name = 'conta_id';


select * from report.vcolumn
  where source = 'report.vreport_fatura'
  order by position desc nulls last,
    show desc nulls last,
    init desc nulls last,
    jsonb_array_length( agg ) desc,
    jsonb_array_length( filter ) desc,
    source, name;
`;
