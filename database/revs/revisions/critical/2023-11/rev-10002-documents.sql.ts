import {sql} from "kitres";



export const funct_load_conta_documents = sql`
create or replace function tweeks.funct_load_conta_documento( args jsonb )
returns setof jsonb language plpgsql as $$
declare
  /**doc
    args :={
      arg_colaborador_id: UUID
      arg_espaco_auth: UUID
      _tserie_id: *INT2
      _date_start: DATE
      _date_end: DATE
      _colaborator_id: UID
      _posto_id: UUID
      _artigo_id: UUID
      _client_id: UUID
      _client_nif: character varying
      _fornecedor_id: UUID
      _documento: character varying
    }
   doc*/
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _tserie_id int2 not null default args->>'_tserie_id';
  
  _date_start date default args->>'_date_start';
  _date_end date default args->>'_date_end';
  _colaborator_id uuid default args->>'_colaborator_id';
  _posto_id uuid default args->>'_posto_id';
  _artigo_id uuid default args->>'_artigo_id';
  _client_id uuid default args->>'_client_id';
  _fornecedor_id uuid default args->>'_fornecedor_id';
  _documento character varying default args->>'_documento';
  _docfilter character varying;
  _client_nif character varying default args->>'_client_nif';
  _client_nif_filter  character varying;
  _const map.constant;
begin
  _const := map.constant();
  if _documento is not null then
    _docfilter := format('%%%s%%', trim( upper( _documento ) ) );
  end if;
  
  if _client_nif then
    _client_nif_filter := format( '%%%s%%', trim( lower( _client_nif ) ) );
  end if;
  
  if _tserie_id  = _const.maguita_tserie_guiaentrada then
      return query
        with __guia_entrada as (
          select
              g.guia_uid,
              g.guia_date,
              g.guia_dataoperacao,
              g.guia_numero,
              g.guia_observacao,
              g.guia_documentoperacao,
              f.fornecedor_id,
              f.fornecedor_nome,
              f.fornecedor_code,
              e.espaco_id,
              e.espaco_nome,
              col.colaborador_id,
              col.colaborador_nome,
              col.colaborador_apelido,
              _tserie_id as tserie_id,
              sum( entr.entrada_custounitario  * entr.entrada_quantidade ) as guia_montante
            from tweeks.guia g 
              inner join tweeks.fornecedor f on (g.guia_refs->'fornecedor'->>'fornecedor_id')::uuid = f.fornecedor_id
              inner join tweeks.espaco e on (g.guia_refs->'destino'->>'espaco_id')::uuid = e.espaco_id
              inner join auth.colaborador col on g.guia_colaborador_id = col.colaborador_id
              left join tweeks.entrada entr on entr.entrada_guia_id = g.guia_uid
            where g._branch_uid = ___branch
              and g.guia_tguia_id = _const.maguita_tguia_entrada
              and g.guia_dataoperacao >= coalesce( _date_start, g.guia_dataoperacao )
              and g.guia_dataoperacao <= coalesce( _date_end, g.guia_dataoperacao )
              and g.guia_colaborador_id = coalesce( _colaborator_id, g.guia_colaborador_id )
              and f.fornecedor_id = coalesce( _fornecedor_id, f.fornecedor_id )
              and (
                upper( guia_numero ) like coalesce( _docfilter, guia_numero )                
                or upper( guia_documentoperacao ) like coalesce( _docfilter, guia_documentoperacao )
              )
            group by
              g.guia_uid,
              f.fornecedor_id,
              e.espaco_id,
              col.colaborador_id
            having count( * ) filter ( where entr.entrada_artigo_id = coalesce( _artigo_id, entr.entrada_artigo_id ) ) > 0
        ) select to_jsonb( _gs )
            from __guia_entrada _gs
            order by _gs.guia_date desc
    ;
    return;
  end if;
      
  if _tserie_id in (
    _const.maguita_tserie_fatura, 
    _const.maguita_tserie_faturarecibo, 
    _const.maguita_tserie_faturasimplificada, 
    _const.maguita_tserie_notadebito, 
    _const.maguita_tserie_notacredito
  ) then
    return query 
      with __conta_documentos as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,
            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            cur.currency_id,
            cur.currency_name,
            cur.currency_code,
            cur.currency_symbol
            
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
              and ve.venda_estado = _const.maguita_venda_estado_fechado
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
            left join geoinfo.currency cur on ct.conta_currency_id = cur.currency_id
          where ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_estado = _const.maguita_conta_estado_fechado
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id,
            cur.currency_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __conta_documentos _cd
          order by _cd.conta_dataregistro desc
    ;
    
    return;
  end if;
  
  if _tserie_id in (
    _const.maguita_tserie_faturaproforma
  ) then
    return query 
      with __conta_documentos as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,
            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            ct.conta_proforma,
            ct.conta_proformaextras,
            ct.conta_proformavencimento
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
          where ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_proforma
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __conta_documentos _cd
        order by _cd.conta_dataregistro desc
    ;
    
    return;
  end if;
  
  if _tserie_id in (
    _const.maguita_tserie_guiasaida
  ) then
    return query 
      with __guia_saida as (
        select
            ct.conta_id,
            ct.conta_numerofatura,
            ct.conta_data,
            ct.conta_montante,
            ct.conta_numero,
            ct.conta_dataregistro,
            ct.conta_observacao,
            coalesce( ctorg.conta_numerofatura, ct.conta_docorigin ) as conta_docorigin,
            coalesce( ctorg.conta_data, ct.conta_datedocorigin ) as conta_datedocorigin,
            coalesce( c.cliente_titular, ct.conta_titular ) as conta_titular,
            coalesce( c.cliente_nif, ct.conta_titularnif) as conta_titularnif,

            c.cliente_id,
            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            p.posto_id,
            p.posto_designacao,
            e.espaco_id,
            e.espaco_nome,
            ct.conta_tserie_id as tserie_id,
            ct.conta_proforma,
            ct.conta_proformaextras,
            ct.conta_proformavencimento
          from tweeks.conta ct
            inner join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
              and ve.venda_estado in ( _const.maguita_venda_estado_fechado, _const.maguita_venda_estado_aberto )
            inner join auth.colaborador col on ct.conta_colaborador_fecho = col.colaborador_id
            left join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
            left join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
            left join tweeks.cliente c on ct.conta_cliente_id = c.cliente_id
            left join tweeks.conta ctorg on ct.conta_conta_docorigin = ctorg.conta_id
          where
            ct._branch_uid = ___branch
            and ct.conta_tserie_id = _tserie_id
            and ct.conta_data >= coalesce( _date_start, ct.conta_data )
            and ct.conta_data <= coalesce( _date_end, ct.conta_data )
            and ct.conta_colaborador_fecho = coalesce( _colaborator_id, ct.conta_colaborador_fecho )
            and ct.conta_posto_fecho = coalesce( _posto_id, ct.conta_posto_fecho )
            and ct.conta_estado in ( _const.maguita_conta_estado_fechado, _const.maguita_conta_estado_aberto )
            and ct.conta_cliente_id = coalesce( _client_id, ct.conta_cliente_id )
            and upper( ct.conta_numerofatura ) like coalesce( _docfilter, ct.conta_numerofatura )
            and lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( ct.conta_titularnif, c.cliente_nif, '999999999' )) )
          group by ct.conta_id,
            col.colaborador_id,
            c.cliente_id,
            ctorg.conta_id,
            p.posto_id,
            e.espaco_id
          having count( * ) filter ( where ve.venda_artigo_id = coalesce( _artigo_id, ve.venda_artigo_id ) ) > 0
      ) select  to_jsonb( _cd )
          from __guia_saida _cd
          order by _cd.conta_dataregistro desc
        ;
    return;
  end if;
  
  if _tserie_id = _const.maguita_tserie_recibo then 
      return query 
        with __recibo as (
          select
              de.deposito_id,
              de.deposito_montante,
              de.deposito_data,
              de.deposito_montantefinal,
              de.deposito_montantetroco,
              de.deposito_montantemoeda,
              de.deposito_documento,
              de.deposito_docref,
              de.deposito_observacao,
              de.deposito_taxacambio,
              de.deposito_dataregistro,
              de.deposito_referencia,
              cu.currency_id,
              cu.currency_code,
              cu.currency_name,
              cu.currency_symbol,
              cli.cliente_id,
              cli.cliente_titular,
              cli.cliente_nif,
              col.colaborador_id,
              col.colaborador_nome,
              col.colaborador_apelido,
              cx.caixa_id,
              cx.caixa_code,
              po.posto_id,
              po.posto_designacao,
              tp.tpaga_id,
              tp.tpaga_designacao,
              ts.tserie_id,
              ts.tserie_code,
              ts.tserie_desc
            from tweeks.deposito de
              inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
              inner join tweeks.cliente cli on cli.cliente_id = de.deposito_cliente_id
              inner join auth.colaborador col on col.colaborador_id = de.deposito_colaborador_id
              inner join tweeks.tpaga tp on de.deposito_tpaga_id = tp.tpaga_id
              inner join tweeks.serie se on de.deposito_serie_id = se.serie_id
              inner join tweeks.tserie ts on se.serie_tserie_id = ts.tserie_id
              left join tweeks.caixa cx on de.deposito_caixa_id = cx.caixa_id
              left join tweeks.posto po on de.deposito_posto_id = po.posto_id

            where de._branch_uid = ___branch
              and de.deposito_data >= coalesce( _date_start, de.deposito_data )
              and de.deposito_data <= coalesce( _date_end, de.deposito_data )
              and de.deposito_colaborador_id = coalesce( _colaborator_id, de.deposito_colaborador_id )
              and coalesce( de.deposito_posto_id, '00000000-0000-0000-0000-000000000001') = coalesce( _posto_id, de.deposito_posto_id, '00000000-0000-0000-0000-000000000001' )
              and de.deposito_estado in ( _const.maguita_deposito_estado_ativo )
              and de.deposito_cliente_id = coalesce( _client_id, de.deposito_cliente_id )
              and ts.tserie_id in (
                _const.maguita_tserie_recibo,
                _const.maguita_tserie_faturarecibo
              )
              and (
                upper( de.deposito_documento ) like coalesce( _docfilter, de.deposito_documento )
                or upper( de.deposito_docref ) like coalesce( _docfilter, de.deposito_docref )
              )
              and lower( coalesce( cli.cliente_nif, '999999999' ) ) like coalesce( _client_nif_filter, lower( coalesce( cli.cliente_nif, '999999999' )) )
        ) select 
              to_jsonb( _rc )
            from __recibo _rc
            order by _rc.deposito_dataregistro desc
      ;
      return;
  end if;
end;
$$
`;