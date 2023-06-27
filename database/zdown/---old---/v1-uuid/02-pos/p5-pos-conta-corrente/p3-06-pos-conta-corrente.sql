drop table tweeks.tlancamento;
create table tweeks.tlancamento(
  tlancamento_id int2 not null,
  tlancamento_desc character varying not null,
  tlancamento_operacao int2 not null,
  constraint pk_ttransacao_id primary key ( tlancamento_id )
);

insert into tweeks.tlancamento ( tlancamento_id, tlancamento_desc, tlancamento_operacao ) values ( 1, 'Deposito', 1 );
insert into tweeks.tlancamento ( tlancamento_id, tlancamento_desc, tlancamento_operacao ) values ( 2, 'Conta', -1 );

select map.constant( 'maguita_tlancamento_deposito', 'int2', 1, '');
select map.constant( 'maguita_tlancamento_conta', 'int2', 2, '');

select map.constant( 'maguita_lancamento_estado_ativo', 21, 1 );

update tweeks.espaco
  set espaco_nivel = default
  where true;


with recursive __values as (
  select
      g.num,
      g.num * 100 as value
    from generate_series( 1, 100 ) g( num )
), __increment as (
  select v.*, v.value as increment from __values v where v.num =1
  union all
    select v.*, i.increment + v.value
      from __increment i
        inner join __values v on i.num +1 = v.num
) select *  from __increment;

drop table tweeks.lancamento;

select * from tweeks.deposito;


create table tweeks.lancamento(
  lancamento_id uuid not null default public.uuid_generate_v4(),
  lancamento_cliente_id uuid not null,
  lancamento_tlancamento_id int2 not null,
  lancamento_colaborador_id uuid not null,
  lancamento_tmodalidade_conta int2 not null,
  lancamento_colaborador_atualizacao uuid default null,
  lancamento_espaco_auth uuid not null,
  lancamento_espaco_branch uuid not null generated always as ( coalesce( tweeks.__space_branch( lancamento_espaco_auth, 1 ), lancamento_espaco_auth ) ) stored,
  lancamento_sequencia bigserial not null,
  lancamento_referencia jsonb not null,
  lancamento_regclass regclass,
  lancamento_refid uuid,
  lancamento_documento character varying,
  lancamento_data date not null default current_date,
  lancamento_descricao character varying not null,
  lancamento_valor double precision,
  lancamento_operacao int2 not null,
  lancamento_montante double precision generated always as ( ( lancamento_valor::double precision * lancamento_operacao::double precision )::double precision ) stored,
  lancamento_credito double precision not null generated always as ( case when lancamento_operacao = 1 then lancamento_valor else 0 end ) stored,
  lancamento_debito  double precision not null generated always as ( case when lancamento_operacao = -1 then lancamento_valor else 0 end ) stored,
  lancamento_estado int2 not null default map.get( 'maguita_transacao_estado_ativo')::int2,
  lancamento_dataregistro timestamptz not null default current_timestamp,
  lancamento_dataatualizacao timestamptz default null,
  constraint pk_lancamento_id primary key ( lancamento_id ),
  constraint fk_lancamento_to_ttrasacao foreign key ( lancamento_tlancamento_id ) references tweeks.tlancamento,
  constraint fk_lancamento_to_cliente foreign key ( lancamento_cliente_id ) references tweeks.cliente,
  constraint fk_lancamento_to_colaborador foreign key ( lancamento_colaborador_id ) references auth.colaborador,
  constraint fk_lancamento_to_colaborador_atualizacao foreign key ( lancamento_colaborador_atualizacao ) references auth.colaborador,
  constraint fk_lancamento_to_espaco_auth foreign key ( lancamento_espaco_auth ) references tweeks.espaco,
  constraint fk_lancamento_to_espaco_branch foreign key ( lancamento_espaco_branch ) references tweeks.espaco,
  constraint ck_lancamento_operacao check ( lancamento_operacao in ( -1, 1 ) )
);

select map.constantdrop( name ) from map.describe( 'maguita_conta_estado_pago' );
alter table tweeks.conta drop conta_montanteamortizado;
alter table tweeks.conta drop conta_montantetroco;
alter table tweeks.conta drop conta_datapagamento;



select * from map.describe('maguita_conta_estado');

select (map.constant()).maguita_conta_estado_aberto;
select (map.constant()).maguita_conta_estado_anulado;
select (map.constant()).maguita_conta_estado_fechado;

update tweeks.conta
  set conta_estado = conta_estado -1
  where conta_estado >= 0;

truncate tweeks.conta  cascade;


select * from tweeks.__conta_adjust('466ad71c-f555-40cc-843d-2f83ae856f79' );


select * , map.constant(name, type, 0, descrision, editable, comment ) from map.describe( 'maguita_conta_estado_fechado' );
select * , map.constant(name, type, 1, descrision, editable, comment ) from map.describe( 'maguita_conta_estado_aberto' );



create or replace function tweeks.__conta_adjust(
  arg_cliente_id uuid,
  arg_conta_id uuid default null,
  _const map.constant default map.constant()
)
returns table(
  conta_id uuid,
  conta_montante double precision,
  conta_montanteamortizado double precision,
  conta_montantependente double precision,
  conta_pago boolean,
  conta_pagamento int2
) language plpgsql as $$
declare
  _balanco record;
begin
  select
      coalesce( sum( d.deposito_montantefinal ), 0.0 ) as deposito_montantefinal
      into _balanco
    from tweeks.deposito d
    where d.deposito_cliente_id = arg_cliente_id
      and d.deposito_estado = _const.maguita_deposito_estado_ativo
  ;

  return query
  with recursive __conta as (
    select
        row_number() over () as conta_posicao,
        ct.conta_id,
        ct.conta_montante,
        ct.conta_datafecho,
        ct.conta_dataregistro
      from tweeks.conta ct
      where ct.conta_cliente_id = arg_cliente_id
        and ct.conta_estado in (
          _const.maguita_conta_estado_fechado
        )
      order by ct.conta_datafecho,
        ct.conta_numero,
        ct.conta_dataregistro
  ), __ajuste as (
    select
      _ct.*,
        _balanco.deposito_montantefinal as deposito_montante,
        arg_conta_id is not null and _ct.conta_id = arg_conta_id as conta_find,
        case
          when _balanco.deposito_montantefinal >= _ct.conta_montante then _ct.conta_montante
          when _balanco.deposito_montantefinal > 0 then _balanco.deposito_montantefinal
          else 0
        end as conta_montanteamortizado,
        case
          when _balanco.deposito_montantefinal >= _ct.conta_montante then _balanco.deposito_montantefinal - _ct.conta_montante
          else 0
        end as deposito_restante
      from __conta _ct
      where _ct.conta_posicao = 1
    union all
      select
          _ct.*,
          _balanco.deposito_montantefinal as deposito_montante,
          arg_conta_id is not null and _ct.conta_id = arg_conta_id as conta_find,
          case
            when _aj.deposito_restante >= _ct.conta_montante then _ct.conta_montante
            when _aj.deposito_restante > 0 then _aj.deposito_restante
            else 0
          end as conta_montanteamortizado,
          case
            when _aj.deposito_restante >= _ct.conta_montante then _aj.deposito_restante - _ct.conta_montante
            else 0
          end as deposito_restante
        from __conta _ct
          inner join __ajuste _aj on _ct.conta_posicao + 1 = _aj.conta_posicao
        where not _aj.conta_find
  ) select
        _aj.conta_id,
        _aj.conta_montante,
        _aj.conta_montanteamortizado,
        _aj.conta_montante - _aj.conta_montanteamortizado,
        _aj.conta_montante = _aj.conta_montanteamortizado,
        case
          when _aj.conta_montanteamortizado = 0 then 2
          when _aj.conta_montanteamortizado > 0 and _aj.conta_montanteamortizado < _aj.conta_montante then 1
          else 0
        end::int2 as conta_pagamento
      from __ajuste _aj
      where _aj.conta_id = coalesce( arg_conta_id, _aj.conta_id )
  ;
end;
$$;



create or replace function tweeks.__tg_create_lancamento()
returns trigger
language plpgsql as $$
declare
  _deposito tweeks.deposito;
  _conta tweeks.conta;
  _conta_old tweeks.conta;
  _const map.constant;
  _lancamento tweeks.lancamento;
  _data record;
  _users cluster.users;
begin

  --Abortar o trigger quando for conexão com utilizador de replicação
  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();

  if pg_typeof( new ) = pg_typeof( _deposito ) and tg_op = 'INSERT' then
    _deposito :=  new;
    select * into _data from tweeks.tpaga where tpaga_id = _deposito.deposito_tpaga_id;

    _lancamento.lancamento_tlancamento_id := _const.maguita_tlancamento_deposito;
    _lancamento.lancamento_tmodalidade_conta := _deposito.deposito_modalidade;
    _lancamento.lancamento_refid := _deposito.deposito_id;
    _lancamento.lancamento_regclass := cluster.__format( pg_typeof( _deposito )::text::regclass );
    _lancamento.lancamento_valor := _deposito.deposito_montantefinal;
    _lancamento.lancamento_operacao := 1;
    _lancamento.lancamento_cliente_id := _deposito.deposito_cliente_id;
    _lancamento.lancamento_espaco_auth := _deposito.deposito_espaco_auth;
    _lancamento.lancamento_colaborador_id := _deposito.deposito_colaborador_id;
    _lancamento.lancamento_data := _deposito.deposito_data;
    _lancamento.lancamento_descricao := case
      when _deposito.deposito_docref is not null then format( 'Amortização da conta em modalidade %I usando documento nº %I em %I', _data.tpaga_designacao, _deposito.deposito_docref, _deposito.deposito_data )
      else format( 'Amortização da conta em modalidade %I em %I', _data.tpaga_designacao, _deposito.deposito_data )
    end;
    _lancamento.lancamento_documento := _deposito.deposito_documento;
    _lancamento.lancamento_referencia := lib.sets_ref( _deposito );

  elseif pg_typeof( new ) = pg_typeof( _conta ) and tg_op = 'UPDATE' then
    _conta := new;
    _conta_old := old;

    if _conta_old.conta_estado != _conta.conta_estado and _conta.conta_estado = _const.maguita_conta_estado_fechado and not exists(
      select *
        from tweeks.lancamento l
        where l.lancamento_regclass = pg_typeof(_conta)::text::regclass
          and l.lancamento_refid = _conta.conta_id
    ) then
      _lancamento.lancamento_tlancamento_id := _const.maguita_tlancamento_conta;
      _lancamento.lancamento_tmodalidade_conta := _conta.conta_tconta_id;
      _lancamento.lancamento_refid := _conta.conta_id;
      _lancamento.lancamento_regclass := pg_typeof( _conta )::text::regclass;
      _lancamento.lancamento_valor := _conta.conta_montante;
      _lancamento.lancamento_operacao := -1;
      _lancamento.lancamento_cliente_id := _conta.conta_cliente_id;
      _lancamento.lancamento_espaco_auth := _conta.conta_espaco_auth;
      _lancamento.lancamento_colaborador_id := coalesce( _conta.conta_colaborador_fecho, _conta.conta_colaborador_atualizacao, _conta.conta_colaborador_id );
      _lancamento.lancamento_data := _conta.conta_data;
      _lancamento.lancamento_descricao := format( 'Lançamento de conta com fatuara nº %s', _conta.conta_numerofatura );
      _lancamento.lancamento_documento := _conta.conta_numerofatura;
      _lancamento.lancamento_referencia := lib.sets_ref( _conta );
    end if;
  end if;

  if _lancamento.lancamento_tlancamento_id is not null then
    _lancamento.lancamento_estado := _const.maguita_lancamento_estado_ativo;
    perform lib.sets( _lancamento );
  end if;

  return null;
end;
$$;

select * from tweeks.lancamento;
create trigger __tg_create_lancamento
  after insert on tweeks.deposito
  for each row
  execute procedure tweeks.__tg_create_lancamento();

create trigger __tg_create_lancamento
  after update on tweeks.conta
  for each row
  when (  new.conta_estado != old.conta_estado and new.conta_estado = (map.constant()).maguita_conta_estado_fechado )
  execute procedure tweeks.__tg_create_lancamento();


select pg_typeof( null::tweeks.deposito );


drop table temp_test;
create table old_tweeks.temp_test(
  ttest_id serial primary key
);

create table temp_collect(
  tcolect_id serial not null primary key,
  tcolect_collection jsonb
);



create or replace function temp_tg()
returns trigger
language plpgsql as $$
  declare
  begin
    insert into temp_collect ( tcolect_collection )
    values ( jsonb_build_object(
      'tg_op', tg_op,
      'typeof', pg_typeof(new),
      'tg_relid', tg_relid,
      'tg_relid_regtype', tg_relid::regtype,
      'tg_relid_regclass', tg_relid::regtype,
      'tg_argv', tg_argv,
      -- 'tg_event', tg_event,
      'tg_name', tg_name,
      'tg_nargs', tg_nargs,
      'tg_level', tg_level,
      'tg_relname', tg_relname,
      'tg_table_name', tg_table_name,
      'tg_table_schema', tg_table_schema,
      -- 'tg_tag', tg_tag,
      'tg_when', tg_when
    ));
    return null;
  end;
$$;

select format_type(310464::regtype::oid, 3);

create trigger temp_tg after insert or update
  on temp_test
  for each row
  execute procedure temp_tg();

create trigger temp_tg after insert or update
  on old_tweeks.temp_test
  for each row
  execute procedure temp_tg();

select * from temp_test;
select * from temp_test2;
select * from old_tweeks.temp_test;
select * from temp_collect;

create table temp_saveclass(
  class regclass
);

alter table tweeks.temp_test2 rename to temp_test2;
insert into tweeks.temp_saveclass values ( 'tweeks.temp_test2');

select * from tweeks.temp_saveclass;

select __space_branch( '00000000-0000-0000-0000-000000000003', 1 );