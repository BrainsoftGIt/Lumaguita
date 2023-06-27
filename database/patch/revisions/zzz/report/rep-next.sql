select
    art.artigo_id as _artigo_id,
    art.artigo_nome as ATIGO,
    art.artigo_codigo as "COD. ART.",
    ct.conta_id as _conta_id
  from tweeks.venda ve
    inner join tweeks.conta ct on ve.venda_conta_id = ct.conta_id
    inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id