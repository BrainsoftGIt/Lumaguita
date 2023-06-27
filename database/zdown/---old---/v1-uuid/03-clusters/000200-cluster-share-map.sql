-- truncate cluster.share cascade;

with __shares( share_regclass, share_insert, share_update,  share_checker ) as(

  --TODO declare all share table here

  values ( 'auth.colaborador'::regclass, true, true, null::regprocedure )
  union all values ( 'auth.acesso'::regclass, true, true, null::regprocedure )
  union all values ( 'auth.perfil'::regclass, true, true, null::regprocedure )
  union all values ( 'auth.privilegio'::regclass, true, true, null::regprocedure )



  union values ( 'tweeks.acerto'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.aloca'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.artigo'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.caixa'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.cambio'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.ccorrente'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.chave'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.classe'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.cliente'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.conta'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.deposito'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.dispoe'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.ean'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.entrada'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.espaco'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.fluxo'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.fornecedor'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.imposto'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.impostovenda'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.lancamento'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.link'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.movimento'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.posto'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.retalho'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.serie'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.stock'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.taplicar'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.taxa'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.tipoimposto'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.trabalha'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.transacao'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.transferencia'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.venda'::regclass, true, true, null::regprocedure )
  union all values ( 'tweeks.branch'::regclass, true, true, null::regprocedure )

), __distincts_share as (
  select
      _s.share_regclass,
      mode() within group ( order by _s.share_insert ) as share_insert,
      mode() within group ( order by _s.share_update ) as share_update,
      mode() within group ( order by _s.share_checker ) as share_checker
    from __shares _s
    group by _s.share_regclass
    having count( * ) = 1
), __new_share as(
  select _ds.*
    from __distincts_share _ds
      left join cluster.share s on _ds.share_regclass::regclass = s.share_regclass::regclass
    where s.share_regclass is null
), __create_share as (
  insert into cluster.share( share_regclass, share_insert, share_update, share_checker )
    select *
      from __new_share
    returning *
) select * from __create_share;








