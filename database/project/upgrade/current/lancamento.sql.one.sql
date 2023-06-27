update tweeks.tlancamento set tlancamento_desc = 'Fatura'
  where tlancamento_id = (map.constant()::map.constant).maguita_tlancamento_conta
;

insert into tweeks.tlancamento( tlancamento_id, tlancamento_desc, tlancamento_operacao )
values ( 3, 'Outros lancamento', 0 );

select map.constant( 'maguita_tlancamento_outros', 'int2', 3 );


select map.constant( 'maguita_lancamento_mode_automatic', 'int2', 1 );
select map.constant( 'maguita_lancamento_mode_manual', 'int2', 2 );
alter table tweeks.lancamento add lancamento_via int2 not null default 1;
alter table tweeks.lancamento add lancamento_mode int2 not null default map.get('maguita_lancamento_mode_automatic' )::int2;
