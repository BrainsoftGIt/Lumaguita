import {patchSQL, sql} from "kitres";

export const conta_add_columns = patchSQL({ unique: true } ).sql`
alter table tweeks.conta add column conta_currency_uid uuid default null;
alter table tweeks.conta add column conta_cambio_uid uuid default null;
alter table tweeks.venda alter column venda_metadata type jsonb using venda_metadata::jsonb;
`;


export const conta_add_conta_taxacambio = patchSQL({ unique: true } ).sql`
alter table tweeks.conta add column conta_taxacambio double precision default null;
`;
export const conta_currency_uid = patchSQL({ unique: true}).sql`
alter table tweeks.conta rename column conta_currency_uid to conta_currency_id;
alter table tweeks.conta alter conta_currency_id type int2 using null;
`;

export const Rev001ExportsProductSql = sql`
create or replace function tweeks.funct_load_artigo_exports( args jsonb )
returns setof jsonb language plpgsql as $$
declare
  /**doc
    arg_espaco_auth
    arg_colaborador_uid
    _espaco_id:[]
   doc*/
  
  _arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _arg_colaborador_uid uuid default args->>'arg_colaborador_uid';
  
  __branch uuid default tweeks.__branch_uid( _arg_colaborador_uid, _arg_espaco_auth );
  _child uuid[] default rule.espaco_get_childrens_static( _arg_espaco_auth );

  _espaco uuid[] default array( select e.text::uuid from jsonb_array_elements_text( args->'_espaco_id' ) e ( text ));
  _product record;
  _const map.constant;
begin
  _const := map.constant();
  for _product in
    with __imposto as (
      select 
          io.imposto_artigo_id as _artigo_uid,
          io.imposto_percentagem,
          io.imposto_valor,
          io.imposto_id,
          tp.tipoimposto_id,
          tp.tipoimposto_nome,
          tp.tipoimposto_percentagem,
          tp.tipoimposto_valor,
          tp.tipoimposto_codigo,
          ta.taxa_id,
          ta.taxa_percentagem,
          ta.taxa_taxa,
          ta.taxa_estado,
          tap.taplicar_id,
          tap.taplicar_descricao
        from tweeks.imposto io
          inner join tweeks.tipoimposto tp on io.imposto_tipoimposto_id = tp.tipoimposto_id
          inner join tweeks.taxa ta on tp.tipoimposto_id = ta.taxa_tipoimposto_id
          inner join tweeks.taplicar tap on io.imposto_taplicar_id = tap.taplicar_id
        where io.imposto_estado = 1
          and tp.tipoimposto_estado = 1
          and ta._branch_uid = __branch
          and tp._branch_uid = __branch
          and io._branch_uid = __branch
    ), __ean as (
      select
          ean_artigo_id as _artigo_uid, 
          e.ean_id,
          ean_code,
          ean_dateout,
          ean_datein,
          ean_estado,
          ean_date
        from tweeks.ean e
        where e._branch_uid = __branch
    ), __artigo_ean as (
      select 
        e._artigo_uid as _artigo_uid,
        array_agg(e) as eans
        from __ean e 
        group by e._artigo_uid
    ), __artigo_impostos as (
      select
          array_agg(e) as impostos,
          _artigo_uid
        from __imposto e
        group by e._artigo_uid
    ), __artigo as (
      select
          art.*,
          u.*,
          uorig.unit_id as unit_originid,
          uorig.unit_code as unit_origncode,
          uorig.unit_name as unit_origenname,
          art.artigo_espaco_auth = any( _child ) as artigo_owner,
          coalesce( s.stock_quantidade, 0 ) as stock_quantidade,
          origin.artigo_id as origin_id,
          origin.artigo_codigo as origin_codigo,
          origin.artigo_descricao as orign_descricao,
          origin.artigo_nome as origin_nome,
          origin.artigo_compostoquantidade as orign_compostoquantidade,
          origin.artigo_artigo_id as origin_origin_id,
    
          count( l.link_id ) as _counts,
          coalesce( array_agg( l.link_espaco_destino ) filter ( where l.link_id is not null ), array[]::uuid[] )  as links,
          coalesce( array_agg( l ) filter ( where l.link_id is not null ), '{}'::tweeks.link[] ) as armazems
        from tweeks.artigo art
          left join tweeks.unit u on art.artigo_unit_id = u.unit_id
          left join tweeks.artigo origin on art.artigo_artigo_id = origin.artigo_id
          left join tweeks.unit uorig on origin.artigo_unit_id = uorig.unit_id

          
          left join tweeks.link l on l.link_estado = _const.maguita_link_estado_ativo
            and ( l.link_referencia->>'artigo_id' )::uuid = art.artigo_id
            and l.link_espaco_destino = any( _espaco )
            and l.link_tlink_id = _const.maguita_tlink_preco
            and l._branch_uid = __branch
          
          left join tweeks.stock s on art.artigo_id = s.artigo_id
            and s.espaco_id = any( _espaco )
            and s._branch_uid = __branch
        where art._branch_uid = __branch
        group by 
          art.artigo_id,
          u.unit_id,
          uorig.unit_id,
          origin.artigo_id,
          s.stock_quantidade
    ) select
          art.*,
          coalesce( ip.impostos, '{}' ) as impostos,
          coalesce( ea.eans, '{}' ) as eans
        from __artigo art
          left join __artigo_impostos ip on art.artigo_id = ip._artigo_uid
          left join __artigo_ean ea on art.artigo_id = ea._artigo_uid
        where art._counts > 0
  loop 
    return next to_jsonb( _product );
  end loop;
end;
$$
`;

