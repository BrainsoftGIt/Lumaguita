import {block} from "../../../core/updater";



block( module, { identifier: "iva-ajuste-load-client", flags:["@unique"]}).sql;
//language=PostgreSQL
`
    create or replace function tweeks.funct_load_cliente(args jsonb) returns SETOF json
  language plpgsql
as
$$
declare
  /**
    args := {
      arg_espaco_auth: UUID,
      arg_colaborador_id: UUID,
      query: {
        any?: any
        code?: CODE,
        name?: NAME
        mail?: MAIL
        tel?: TEL
        nif?: NIF
      }
    }
   */
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  __branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id );
  _const map.constant;

  _query_any  text default lower( args->'query'->>'any' );
  _query_code text default lower( args->'query'->>'code' );
  _query_name text default lower( args->'query'->>'name' );
  _query_mail text default lower( args->'query'->>'mail' );
  _query_tel  text default lower( args->'query'->>'tel' );
  _query_nif  text default lower( args->'query'->>'nif' );
begin
  _const := map.constant();
  return query
    with
      __deposito as (
        select
            la.lancamento_cliente_id,
            sum( la.lancamento_valor ) as balanco_credito,
            sum( la.lancamento_valor ) filter ( where la._tgrupo_id = _const.maguita_tgrupo_cnormal ) as   balanco_creditonormal,
            sum( la.lancamento_valor ) filter ( where la._tgrupo_id = _const.maguita_tgrupo_ccorrente ) as balanco_creditocorrente,
            count( la.lancamento_id ) as depositos
          from tweeks.lancamento la
          where la._branch_uid = __branch_uid
            and la.lancamento_operacao = 1
            and la.lancamento_estado =  _const.maguita_lancamento_estado_ativo
          group by la.lancamento_cliente_id

      ), __conta as (
        select
            la.lancamento_cliente_id,
            sum( la.lancamento_valor ) as balanco_debito,
            sum( la.lancamento_valor ) filter ( where la._tgrupo_id = _const.maguita_tgrupo_cnormal ) as   balanco_debitonormal,
            sum( la.lancamento_valor ) filter ( where la._tgrupo_id = _const.maguita_tgrupo_ccorrente ) as balanco_debitocorrente
          from tweeks.lancamento la
          where la._branch_uid = __branch_uid
            and la.lancamento_estado = _const.maguita_lancamento_estado_ativo
            and la.lancamento_operacao = -1
          group by la.lancamento_cliente_id

      ), __cliente as (
        select
            c.cliente_id,
            c.cliente_code,
            c.cliente_titular,
            c.cliente_nif,
            c.cliente_contactos,
            c.cliente_mail,
            c.cliente_estado,
            c.cliente_metadata,
            c.cliente_dataregistro,
            coalesce( _de.balanco_credito, 0.0 ) as balanco_credito,
            coalesce( _de.balanco_creditonormal, 0.0 ) as balanco_creditonormal,
            coalesce( _de.balanco_creditocorrente, 0.0 ) as balanco_creditocorrente,
            coalesce( _de.depositos, 0 ) as depositos,
            coalesce( _ct.balanco_debito, 0.0 ) as balanco_debito,
            coalesce( _ct.balanco_debitocorrente, 0.0 ) as balanco_debitocorrente,
            coalesce( _ct.balanco_debitonormal, 0.0 ) as balanco_debitonormal
          from tweeks.cliente c
            left join __deposito _de on c.cliente_id = _de.lancamento_cliente_id
            left join __conta _ct on c.cliente_id = _ct.lancamento_cliente_id
          where c._branch_uid = __branch_uid
      ), __cliente_saldo as (
        select
            _c.*,
            _c.balanco_creditonormal - _c.balanco_debitonormal as balanco_normal,
            _c.balanco_creditocorrente - _c.balanco_debitocorrente as balanco_corrente,
            _c.balanco_credito - _c.balanco_debito as balanco_final
          from __cliente _c
      ), __query as (
        select *
          from __cliente_saldo _cl
          where true
            and _cl.cliente_code = coalesce( _query_code, _cl.cliente_code )
            and coalesce( _cl.cliente_nif, '') = coalesce( _query_nif, _cl.cliente_nif, '' )
            and lower( _cl.cliente_titular ) like lower( format( '%%%s%%', coalesce( _query_name, _cl.cliente_titular ) ) )
            and lower( coalesce( _cl.cliente_mail, '' ) ) like lower( format( '%%%s%%', coalesce( _query_mail, _cl.cliente_mail, '' ) ) )
            and ( coalesce( _cl.cliente_contactos, jsonb_build_array()) || to_jsonb(''::text) ) @> to_jsonb(coalesce( _query_tel, '' ) )
            and ( false
                or _cl.cliente_code = coalesce( _query_any, _cl.cliente_code )
                or coalesce( _cl.cliente_nif, '') = coalesce( _query_any, _cl.cliente_nif, '' )
                or lower( _cl.cliente_titular ) like lower( format( '%%%s%%', coalesce( _query_any, _cl.cliente_titular ) ) )
                or lower( coalesce( _cl.cliente_mail, '' ) ) like lower( format( '%%%s%%', coalesce( _query_any, _cl.cliente_mail, '' ) ) )
                or (_cl.cliente_contactos || to_jsonb(''::text) ) @> to_jsonb(coalesce( _query_any, '' ) )
            )
      ) select 
            to_json( _q )
          from __query _q
          order by 
            _q.cliente_titular,
            _q.cliente_dataregistro desc
  ;                
end
$$;
`;
