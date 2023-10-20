import {sql} from "kitres";

export const funct_pos_load_conta_data = sql`
create or replace function tweeks.funct_pos_load_conta_data(filter jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**
      Essa função devolve uma mesa juntamente com as conta associada que ainda esta aberta
      filter := {
        with_client:boolean
        arg_posto_id: ID
        arg_espaco_auth: ID
        arg_colaborador_id: ID
        arg_conta_id: ID
      }
     */

--     arg_posto_id uuid  not null default filter->>'arg_posto_id';
    arg_espaco_auth uuid  not null default filter->>'arg_espaco_auth';
    arg_conta_id uuid not null default filter->>'arg_conta_id';
    arg_colaborador_id uuid default filter->>'arg_colaborador_id';
    _with_client boolean default filter->>'with_client';

    _const map.constant;
    _client jsonb;
    _conta tweeks.conta;
    ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin

  _const := map.constant();

  if _with_client then
    select to_jsonb( c ) into _client
      from cliente c
        inner join tweeks.conta ct on c.cliente_id = ct.conta_cliente_id
      where ct.conta_id = arg_conta_id
    ;
  end if;

  if _client is null then
    _client := jsonb_build_object();
  end if;

  select * into _conta
    from tweeks.conta ct
    where ct.conta_id = arg_conta_id
  ;

  return query with
    __venda as (
      select
        v.venda_id,
        v.venda_conta_id,
        v.venda_venda_id,
        v.venda_quantidade,
        v.venda_custoquantidade,
        v.venda_custounitario,
        v.venda_montante,
        v.venda_montantesemimposto,
        v.venda_montantecomimposto,
        v.venda_montantetotal,
        v.venda_imposto,
        v.venda_impostoadicionar,
        v.venda_impostoretirar,
        v.venda_montanteagregado,
        v.venda_isencao,
        v.venda_estado,
        v.venda_estadopreparacao,
        v.venda_metadata,
        v.venda_descricao,
        v.venda_validade,
        v.venda_editado,
        v.venda_taxas,
        v.venda_lote,
        a.artigo_id,
        a.artigo_nome,
        a.artigo_codigo,
        a.artigo_compostoquantidade,
        a.artigo_artigo_id,
        u.unit_id,
        u.unit_code,
        u.unit_name,
        tx.taxa_percentagem,
        tx.taxa_taxa,
        tip.tipoimposto_id,
        tip.tipoimposto_codigo,
        tip.tipoimposto_nome
      from tweeks.venda v
        inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
        left join tweeks.taxa tx on tx.taxa_id = any ( v.venda_taxas )
        left join tweeks.tipoimposto tip on tx.taxa_tipoimposto_id = tip.tipoimposto_id
        left join tweeks.unit u on a.artigo_unit_id = u.unit_id
      where v._branch_uid = ___branch
        and v.venda_estado in (
           _const.maguita_venda_estado_aberto,
           _const.maguita_venda_estado_fechado
        )
    ), __venda_group as (
      select
          v.venda_id as _venda_id,
          v.venda_conta_id as _venda_conta_id,
          coalesce( array_agg( vi order by vi.artigo_nome ) filter ( where vi.venda_id is not null ),
            array[]::record[]
          ) as venda_itens
        from  tweeks.venda v
          inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
          left join __venda vi on v.venda_id = vi.venda_venda_id
        where v.venda_estado in ( _const.maguita_venda_estado_aberto,  _const.maguita_venda_estado_fechado )
          and v.venda_venda_id is null
          and v.venda_conta_id = arg_conta_id
          and v.venda_estado in (
            _const.maguita_venda_estado_aberto,
            _const.maguita_venda_estado_fechado
          )
        group by v.venda_id, a.artigo_id
    ), __conta as (
      select
          c.conta_id,
          c.conta_numero,
          c.conta_numerofatura,
          c.conta_montante,
          c.conta_mesa,
          c.conta_estado,
          c.conta_serie,
          c.conta_observacao,
          c.conta_extension,
          c.conta_props,
          c.conta_serie_id,
          c._tgrupo_id,
          c.conta_data,
          c.conta_dataregistro,
          c.conta_conta_docorigin,
          c.conta_titular,
          c.conta_titularnif,
          se.serie_id,
          se.serie_designacao,
          se.serie_numero,
          ccl.cliente_id,
          ccl.cliente_code,
          ccl.cliente_nif,
          ccl.cliente_titular,
          ccl.cliente_metadata,
          de.deposito_montante,
          de.deposito_montantetroco,
          de.deposito_montantefinal,
          de.deposito_montantemoeda,
          de.deposito_tpaga_id,
          coalesce( corigen.conta_numerofatura, c.conta_docorigin ) as conta_documentoorigem,
          coalesce( corigen.conta_data, c.conta_datedocorigin ) as conta_datedocorigin,
          array_agg( to_jsonb( v )||to_jsonb( vg ) order by v.artigo_nome ) as conta_vendas
        from tweeks.conta c
          left join tweeks.serie se on c.conta_serie_id = se.serie_id
          left join tweeks.cliente ccl on c.conta_cliente_id = ccl.cliente_id
          left join tweeks.conta corigen on c.conta_conta_docorigin = corigen.conta_id
          left join __venda_group vg on c.conta_id = vg._venda_conta_id
          left join __venda v on vg._venda_id = v.venda_id
          left join tweeks.deposito de on c.conta_id = (de.deposito_referencia->>'conta_id')::uuid
        where c.conta_id = arg_conta_id
          and c._branch_uid = ___branch
        group by c.conta_id, 
          de.deposito_id,
          ccl.cliente_id,
          corigen.conta_id,
          se.serie_id
     ) select to_jsonb( c ) || _client from __conta c
  ;

  if _conta._tgrupo_id = _const.maguita_tgrupo_cnormal then
    return query
      with __deposito as (
        select
            de.deposito_id,
            de.deposito_montante,
            de.deposito_montantemoeda,
            de.deposito_montantetroco,
            de.deposito_montantefinal,
            de.deposito_taxacambio,
            cu.currency_code,
            cu.currency_id,
            cu.currency_name,
            tp.tpaga_id,
            tp.tpaga_designacao,
            p.posto_designacao,
            p.posto_id,
            cx.caixa_id
          from tweeks.deposito de
            inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
            inner join tweeks.tpaga tp on de.deposito_tpaga_id = tp.tpaga_id
            left join tweeks.caixa cx on de.deposito_caixa_id = cx.caixa_id
            left join tweeks.posto p on cx.caixa_posto_id = p.posto_id
          where (de.deposito_referencia->>'conta_id')::uuid = _conta.conta_id
            and de._branch_uid = ___branch
      ) select to_jsonb( _de )
          from __deposito _de
    ;
  end if;
end
$$;
`;