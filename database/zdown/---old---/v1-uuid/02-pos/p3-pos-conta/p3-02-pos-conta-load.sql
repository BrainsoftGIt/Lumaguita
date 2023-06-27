drop function if exists tweeks.funct_load_conta_data(filter jsonb);
drop function if exists tweeks.funct_pos_load_conta_data(filter jsonb );

create or replace function tweeks.funct_pos_load_conta_data(filter jsonb)
returns setof jsonb
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
--     arg_espaco_auth uuid  not null default filter->>'arg_espaco_auth';
    arg_conta_id uuid not null default filter->>'arg_conta_id';
--     arg_colaborador_id uuid default filter->>'arg_colaborador_id';
    _with_client boolean default filter->>'with_client';

    _const map.constant;
    _client jsonb;
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

  return query with
    __venda_iten as (
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
        v.venda_estado,
        v.venda_estadopreparacao,
        a.artigo_id,
        a.artigo_nome
      from tweeks.venda v
        inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
        where v.venda_venda_id is not null and v.venda_conta_id = arg_conta_id
          and v.venda_estado in (
             _const.maguita_venda_estado_aberto,
             _const.maguita_venda_estado_fechado
          )
    ), __venda as (
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
          v.venda_estado,
          v.venda_estadopreparacao,
          a.artigo_id,
          a.artigo_nome,
          coalesce( array_agg( vi order by vi.artigo_nome ) filter ( where vi.venda_id is not null ),
            array[]::record[]
          ) as venda_itens
        from  tweeks.venda v
          inner join tweeks.artigo a on v.venda_artigo_id = a.artigo_id
          left join __venda_iten vi on v.venda_id = vi.venda_venda_id
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
          c.conta_tconta_id,
          c.conta_data,
          c.conta_dataregistro,
          de.deposito_montante,
          de.deposito_montantetroco,
          de.deposito_montantefinal,
          de.deposito_montantemoeda,
          de.deposito_tpaga_id,
          array_agg( v order by v.artigo_nome ) as conta_vendas
        from tweeks.conta c
          left join __venda v on c.conta_id = v.venda_conta_id
          left join tweeks.deposito de on lib.sets_ref( c ) = de.deposito_referencia
        where c.conta_id = arg_conta_id
        group by c.conta_id, de.deposito_id
     ) select to_jsonb( c ) || _client from __conta c
  ;
end;
$$;

select * from map.describe( 'maguita_tconta');