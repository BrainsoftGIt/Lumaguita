create or replace function tweeks.__branch_map()
  returns TABLE(class text, map_usr text, map_spc text, map_sch text, map_tbl text, map_brc text)
  language plpgsql
as
$$
declare
  __map jsonb default $doc${
      "auth.colaborador": {
        "brc": "colaborador_branch_uid"
      },
      "tweeks.espaco": {
        "brc": "espaco_branch_uid"
      },
      "auth.acesso":{
        "usr": "acesso_colaborador_propetario",
        "spc": null
      }, "tweeks.acerto":{
        "usr": "acerto_colaborador_id",
        "spc": "acerto_espaco_id"
      }, "tweeks.aloca": {
        "usr":  "aloca_colaborador_id",
        "spc": "aloca_espaco_destino"
      }, "tweeks.artigo":{
        "usr": "artigo_colaborador_id",
        "spc": "artigo_espaco_auth"
      }, "tweeks.caixa":{
        "usr": "caixa_colaborador_id",
        "spc": "caixa_espaco_auth"
      }, "tweeks.cambio":{
        "usr": "cambio_colaborador_id",
        "spc": "cambio_espaco_auth"
      }, "tweeks.classe":{
        "usr": "classe_colaborador_id",
        "spc": "classe_espaco_auth"
      }, "tweeks.cliente":{
        "usr":"cliente_colaborador_id",
        "spc": "cliente_espaco_auth"
      },  "tweeks.conta":{
        "usr": "conta_colaborador_id",
        "spc": "conta_espaco_auth"
      }, "tweeks.deposito":{
        "usr": "deposito_colaborador_id",
        "spc": "deposito_espaco_auth"
      }, "tweeks.dispoe":{
        "usr": "dispoe_colaborador_id",
        "spc": "dispoe_espaco_auth"
      }, "tweeks.ean":{
        "usr": "ean_colaborador_id",
        "spc": "ean_espaco_auth"
      }, "tweeks.entrada":{
        "usr": "entrada_colaborador_id",
        "spc": "entrada_espaco_destino"
      }, "tweeks.fluxo": {
        "usr": "fluxo_colaborador_id",
        "spc": "venda_espaco_auth"
      }, "tweeks.fornecedor":{
        "usr": "fornecedor_colaborador_id",
        "spc": "fornecedor_espaco_auth"
      }, "tweeks.imposto":{
        "usr": "imposto_colaborador_id",
        "spc": "imposto_espaco_auth"
      }, "tweeks.impostovenda":{
        "usr": "impostovenda_colaborador_id",
        "spc": "impostovenda_espaco_auth"
      }, "tweeks.lancamento":{
        "usr": "lancamento_colaborador_id",
        "spc": "lancamento_espaco_auth"
      }, "tweeks.link":{
        "usr": "link_colaborador_id",
        "spc": "link_espaco_destino"
      }, "tweeks.movimento":{
        "usr": "movimento_colaborador_id",
        "spc": "movimento_espaco_auth"
      }, "tweeks.posto":{
        "usr": "posto_colaborador_id",
        "spc": "posto_espaco_auth"
      }, "tweeks.retalho":{
        "usr": "retalho_colaborador_id",
        "spc": "retalho_espaco_auth"
      }, "tweeks.serie":{
        "usr": "serie_colaborador_id",
        "spc": "serie_espaco_id"
      }, "tweeks.taxa": {
        "usr": "taxa_colaborador_id",
        "spc": "taxa_espaco_auth"
      }, "tweeks.tipoimposto":{
        "usr": "tipoimposto_colaborador_id",
        "spc": "tipoimposto_espaco_auth"
      }, "tweeks.trabalha":{
        "usr": "trabalha_colaborador_proprietario",
        "spc": "trabalha_espaco_destino"
      },
      "tweeks.transacao":{
        "usr": "transacao_colaborador_id",
        "spc": "transacao_espaco_auth"
      }, "tweeks.transferencia":{
        "usr": "transferencia_colaborador_id",
        "spc": "transferencia_espaco_destino"
      }, "tweeks.venda":{
        "usr": "venda_colaborador_id",
        "spc": "venda_espaco_auth"
      }, "tweeks.guia":{
        "usr": "guia_colaborador_id",
        "spc": "guia_espaco_auth"
      }, "tweeks.custoguia":{
        "usr": "custoguia_colaborador_id",
        "spc": "custoguia_espaco_auth"
      }

    }$doc$::jsonb;
begin
  return query
    with __map as (
      select
          k.key,
          k.value as map,
          k.value->>'usr' as usr,
          k.value->>'spc' as spc,
          k.value->>'brc' as brc
        from jsonb_each( __map ) k
    ) select
          _fk.key,
          _fk.usr,
          _fk.spc,
          tb.schemaname::text,
          tb.tablename::text,
          _fk.brc
        from __map _fk
          inner join pg_tables tb on format( '%I.%I', tb.schemaname, tb.tablename )::regclass = _fk.key::regclass
  ;
end;
$$;