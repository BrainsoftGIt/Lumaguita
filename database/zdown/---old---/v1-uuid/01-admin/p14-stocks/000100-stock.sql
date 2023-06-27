drop function rule.tg_agrega_after_insert_incremente_venda_montante();
drop function rule.tg_agrega_after_update_adjust_venda_montante();
drop function rule.tg_venda_after_update_adjust_agrega_estado();


alter table tweeks.movimento add movimento_artigo_in uuid default null;
alter table tweeks.movimento add movimento_artigo_out uuid default null;
alter table tweeks.movimento add movimento_espaco_in uuid default null;
alter table tweeks.movimento add movimento_espaco_out uuid default null;

alter table tweeks.movimento add movimento_valorin double precision;
alter table tweeks.movimento add movimento_valorout double precision;
alter table tweeks.movimento add movimento_valorstock double precision;
alter table tweeks.movimento add movimento_regclass regclass;
alter table tweeks.movimento add movimento_refuid uuid;

select * from tweeks.tmovimento;
select * from tweeks.toperacao;
/*
  1,  1,  Credito
  2,  -1, Debito
  

  2,  Acerto, 1
  3,  Venda, 1
  4,  Transferência, 1
  1,  Compra, 1
  6,  Pagamento, 2
  5,  Movimento, 2
  7,  Retalho, 1

 */

 select movimento_referencia from tweeks.movimento;

select (map.constant()).toperacao_pagamento;



select map.constant_rename( name, format( 'maguita_%s', name ) ) from map.describe('tmovimento' );

select * from old_tweeks.toperacao;
with _map as (
  select *
    from map.constant()
), _tmovimento as (
  select tm.*,
    case toperacao_id
      when 1 then 'tweeks.entrada'::regclass
      when 2 then 'tweeks.acerto'::regclass
      when 3 then 'tweeks.venda'::regclass
      when 4 then 'tweeks.transferencia'::regclass
      when 5 then 'tweeks.transacao'::regclass
      when 6 then 'tweeks.deposito'::regclass
      when 7 then 'tweeks.retalho'::regclass
    end::regclass
    from tweeks.toperacao tm
)
update tweeks.movimento m
    set
    movimento_artigo_in = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_credito then art.artigo_id
    end,
    movimento_artigo_out = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_debito then art.artigo_id
    end,
    movimento_valorin = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_credito then _m.movimento_quantidade
    end,
    movimento_valorout = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_debito then  _m.movimento_quantidade
    end,
    movimento_espaco_in = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_credito then st.stock_espacao_id
    end,
    movimento_espaco_out = case
      when _m.movimento_tmovimento_id = _map.maguita_tmovimento_debito then st.stock_espacao_id
    end,
    movimento_valorstock = case
      when m.movimento_toperacao_id = _map.toperacao_acerto then _m.movimento_quantidadefinal
    end
  from tweeks.movimento _m
    inner join _map on true
    inner join tweeks.stock st on _m.movimento_stock_id = st.stock_id
    inner join tweeks.artigo art on st.stock_artigo_id = art.artigo_id
  where _m.movimento_id = m.movimento_id;





select map.constant( 'maguita_fluxo_estado_ativo', 'int2', 1, 'Fluxo ativo' );
select map.constant( 'maguita_fluxo_estado_anulado', 'int2', -1, 'Fluxo anulado' );

select * from tweeks.fluxo;
drop table tweeks.fluxo;
create table tweeks.fluxo(
  fluxo_id uuid not null default public.uuid_generate_v4(),
  fluxo_toperacao_id int2 not null,

  fluxo_artigo_in uuid default null,
  fluxo_artigo_out uuid default null,
  fluxo_espaco_in uuid default null,
  fluxo_espaco_out uuid default null,

  fluxo_espaco_auth uuid not null,
  fluxo_colaborador_id uuid,
  fluxo_colaborador_atualizacao uuid,
  fluxo_sequencia serial8 not null,

  fluxo_quantidadein double precision,
  fluxo_quantidadeout double precision,
  fluxo_quantidadefinal double precision,

  fluxo_checkpoint int2 not null default 1,

  fluxo_data date,
  fluxo_documento character varying,
  fluxo_observacao character varying,

  fluxo_referencia jsonb,
  fluxo_regclass character varying,
  fluxo_refuid uuid,

  fluxo_estado int2 default (map.get('maguita_fluxo_estado_ativo' ) )::int2,
  fluxo_dataregistro timestamptz not null default current_timestamp,
  fluxo_dataatualizacao timestamptz default null,

  constraint pk_fluxo_id primary key ( fluxo_id ),
  constraint fk_fluxo_to_toperacao foreign key ( fluxo_toperacao_id ) references tweeks.toperacao,
  constraint fk_fluxo_to_artigo_in foreign key ( fluxo_artigo_in ) references tweeks.artigo,
  constraint fk_fluxo_to_artigo_out foreign key ( fluxo_artigo_out ) references tweeks.artigo,
  constraint fk_fluxo_to_espaco_in foreign key ( fluxo_espaco_in ) references tweeks.espaco,
  constraint fk_fluxo_to_espaco_out foreign key ( fluxo_espaco_out ) references tweeks.espaco,
  constraint fk_fluxo_to_espaco_auth foreign key ( fluxo_espaco_auth ) references tweeks.espaco,
  constraint fk_fluxo_to_colaborador foreign key ( fluxo_colaborador_id ) references auth.colaborador,
  constraint fk_fluxo_to_colaborador_atualizacao foreign key ( fluxo_colaborador_atualizacao ) references auth.colaborador,

  constraint ck_fluxo_has_artigo check ( true in ( fluxo_artigo_in is not null, fluxo_artigo_out is not null ) ),
  constraint ck_fluxo_has_espaco check ( true in ( fluxo_espaco_in is not null, fluxo_espaco_out is not null ) ),
  constraint ck_fluxo_has_quantidade check ( true in ( fluxo.fluxo_quantidadein is not null, fluxo.fluxo_quantidadeout is not null, fluxo_quantidadefinal is not null ) ),
  constraint ck_fluxo_checkpointo check ( fluxo_checkpoint in ( 1, 0 ) )
);

comment on column tweeks.fluxo.fluxo_checkpoint is 'Esse atributo indica se o fluxo começa nesse ponto se o valor for de 0 e 1 continuar com o valor acomulado até a hora.';

alter table tweeks.acerto add acerto_artigo_id uuid;
alter table tweeks.acerto add acerto_espaco_id uuid;

select * , map.constant_rename( name, format( 'maguita_%s', name ) ) from map.describe( 'toperacao' )
where name not in ( 'toperacao_classe_stock',  'toperacao_classe_montante' );


create or replace function tweeks.__tg_fluxo_on_acerto()
returns trigger
language plpgsql as $$
declare
  _new tweeks.acerto;
  _fluxo tweeks.fluxo;
  _const map.constant;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new::tweeks.acerto;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_acerto;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );
  _fluxo.fluxo_refuid := _new.acerto_id;

  _fluxo.fluxo_quantidadefinal := _new.acerto_quantidade;
  _fluxo.fluxo_artigo_in := _new.acerto_artigo_id;
  _fluxo.fluxo_espaco_in := _new.acerto_espaco_id;

  _fluxo.fluxo_espaco_auth := _new.acerto_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.acerto_colaborador_id;
  _fluxo.fluxo_checkpoint := 0;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;

create trigger tg_fluxo_on_acerto after
  insert on tweeks.acerto
  for each row
  when (
    not cluster.__is_replication()
  ) execute procedure tweeks.__tg_fluxo_on_acerto();

create or replace function tweeks.__tg_fluxo_on_transferencia()
returns trigger
language plpgsql as $$
declare
  _new tweeks.transferencia;
  _fluxo tweeks.fluxo;
  _const map.constant;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_transferencia;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := pg_typeof( new )::text::regclass;

  _fluxo.fluxo_refuid := _new.transferencia_id;
  _fluxo.fluxo_quantidadein := _new.transferencia_quantidade;
  _fluxo.fluxo_quantidadeout := _new.transferencia_quantidade;

  _fluxo.fluxo_artigo_in := _new.transferencia_artigo_id;
  _fluxo.fluxo_artigo_out := _new.transferencia_artigo_id;

  _fluxo.fluxo_espaco_out := _new.transferencia_espaco_origem;
  _fluxo.fluxo_espaco_in := _new.transferencia_espaco_destino;

  _fluxo.fluxo_espaco_auth := _new.transferencia_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.transferencia_colaborador_id;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;

create trigger tg_fluxo_on_transferencia
  after insert on tweeks.transferencia
  for each row
  when (
    not cluster.__is_replication()
  ) execute procedure tweeks.__tg_fluxo_on_transferencia();


create or replace function tweeks.__tg_fluxo_on_entrada()
returns trigger
language plpgsql as $$
declare
  _new tweeks.entrada;
  _fluxo tweeks.fluxo;
  _const map.constant;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_entrada;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := pg_typeof( new )::text::regclass;

  _fluxo.fluxo_refuid := _new.entrada_id;
  _fluxo.fluxo_quantidadein := _new.entrada_quantidade;
--   _fluxo.fluxo_quantidadeout :=;

  _fluxo.fluxo_artigo_in := _new.entrada_artigo_id;
--   _fluxo.fluxo_artigo_out :=;

--   _fluxo.fluxo_espaco_out :=;
  _fluxo.fluxo_espaco_in := _new.entrada_espaco_destino;

  _fluxo.fluxo_espaco_auth := _new.entrada_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.entrada_colaborador_id;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;
create trigger tg_fluxo_on_entrada
  after insert on tweeks.entrada
  for each row
  when (
    not cluster.__is_replication()
  ) execute procedure tweeks.__tg_fluxo_on_entrada();

create or replace function tweeks.__tg_fluxo_on_retalho()
returns trigger
language plpgsql as $$
declare
  _new tweeks.retalho;
  _fluxo tweeks.fluxo;
  _const map.constant;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_retalho;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := pg_typeof( new )::text::regclass;

  _fluxo.fluxo_refuid := _new.retalho_id;
  _fluxo.fluxo_quantidadeout := _new.retalho_quantidade;
  _fluxo.fluxo_quantidadein := _new.retalho_total;

  _fluxo.fluxo_artigo_out := _new.retalho_artigo_composto;
  _fluxo.fluxo_artigo_in := _new.retalho_artigo_base;

  _fluxo.fluxo_espaco_out := _new.retalho_espaco_auth;
  _fluxo.fluxo_espaco_in  := _new.retalho_espaco_auth;

  _fluxo.fluxo_espaco_auth := _new.retalho_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.retalho_colaborador_id;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;
create trigger tg_fluxo_on_retalho
  after insert on tweeks.retalho
  for each row
  when ( not cluster.__is_replication() )
  execute procedure tweeks.__tg_fluxo_on_retalho();

create or replace function tweeks.__tg_fluxo_on_venda()
returns trigger
language plpgsql as $$
declare
  _new tweeks.venda;
  _old tweeks.venda;
  _fluxo tweeks.fluxo;
  _const map.constant;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_venda;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := pg_typeof( new )::text::regclass;

  _fluxo.fluxo_refuid := _new.venda_id;
  _fluxo.fluxo_quantidadeout := _new.venda_quantidade;

  _fluxo.fluxo_artigo_out := _new.venda_artigo_id;

  _fluxo.fluxo_espaco_out := _new.venda_espaco_auth;

  _fluxo.fluxo_espaco_auth := _new.venda_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.venda_colaborador_id;

  if tg_op = 'INSERT' then
    perform lib.sets_in( _fluxo );

  elseif tg_op = 'UPDATE' then
    _old := old;

  -- Ao atualizar quantidade do produto no carrinho
    if _new.venda_quantidade != _old.venda_quantidade then
      perform lib.sets_in( _fluxo );
      _fluxo.fluxo_quantidadeout := null;
      _fluxo.fluxo_artigo_out := null;
      _fluxo.fluxo_espaco_out := null;

      _fluxo.fluxo_quantidadein := _old.venda_quantidade;
      _fluxo.fluxo_artigo_in := _old.venda_artigo_id;
      _fluxo.fluxo_espaco_in := _old.venda_espaco_auth;
      _fluxo.fluxo_observacao := format( 'Reposição do artigo no stock por atualização da quantidade na conta' );
      perform lib.sets_in( _fluxo );

    -- Ao canselar um produto do carrinho ou ao anular uma conta
    elseif _old.venda_estado != _new.venda_estado and _new.venda_estado in(
      _const.maguita_venda_estado_anulado,
      _const.maguita_venda_estado_canselado
    )  then
      _fluxo.fluxo_quantidadeout := null;
      _fluxo.fluxo_artigo_out := null;
      _fluxo.fluxo_espaco_out := null;

      _fluxo.fluxo_quantidadein := _old.venda_quantidade;
      _fluxo.fluxo_artigo_in := _old.venda_artigo_id;
      _fluxo.fluxo_espaco_in := _old.venda_espaco_auth;
      _fluxo.fluxo_observacao := format( 'Reposição do artigo no stock por Anulação/Canselamento da conta');
      perform lib.sets_in( _fluxo );
    end if;
  end if;

  return null;
end;
$$;

create trigger tg_fluxo_on_venda_create
  after insert
  on tweeks.venda
  for each row
  when ( not cluster.__is_replication() )
  execute procedure __tg_fluxo_on_venda();


create trigger tg_fluxo_on_venda_update
  after update
  on tweeks.venda
  for each row
  when ( not cluster.__is_replication()
    and (
      new.venda_quantidade != old.venda_quantidade
        or (new.venda_estado != old.venda_estado and map.any_equal( new.venda_estado, 'maguita_venda_estado_anulado', 'maguita_venda_estado_canselado' ))
  ))
  execute procedure __tg_fluxo_on_venda();

drop function tweeks.__fluxo_scan(
  _artigo_id uuid,
  _espaco_id uuid,
  _resume boolean
);

create or replace function tweeks.__fluxo_scan(
  _artigo_id uuid default null,
  _espaco_id uuid default null,
   _resume boolean default true
) returns table(
  fluxo_artigo_id uuid,
  fluxo_espaco_id uuid,
  fluxo_preview double precision,
  fluxo_resultado double precision,
  fluxo_checkmarks uuid,
  fluxo_check double precision,
  fluxo_order int8,
  fluxo_end int8,
  fluxo_resume boolean,
  fluxo_credito double precision,
  fluxo_debito double precision,
  fluxo_calc double precision,
  fluxo_quantidade double precision,
  fluxo_id uuid,
  fluxo_date timestamptz,
  fluxo_sequencia int8
) language sql as $$
  with recursive
    __map as ( select * from map.constant() ),
    __stock_point as(
      select
          a.artigo_id,
          e.espaco_id,
          mode() within group ( order by f.fluxo_dataregistro desc ) as point
        from tweeks.fluxo f
          inner join __map _const on true
          inner join tweeks.artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
            and a.artigo_id = coalesce( _artigo_id, a.artigo_id )
          inner join tweeks.espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
            and e.espaco_id = coalesce( _espaco_id, e.espaco_id )
        where f.fluxo_checkpoint = 0
        group by a.artigo_id,
          e.espaco_id
    ),
    __fluxo as (
      select
          a.artigo_id,
          e.espaco_id,
          f.*,
          case
            when e.espaco_id = f.fluxo_espaco_in and a.artigo_id = f.fluxo_artigo_in then f.fluxo_quantidadein
            else 0
          end as fluxo_credito,
          case
            when e.espaco_id = f.fluxo_espaco_out and a.artigo_id = f.fluxo_artigo_out then f.fluxo_quantidadeout
            else 0
          end as fluxo_debito,
          case
            when f.fluxo_quantidadefinal is not null then f.fluxo_quantidadefinal
            when e.espaco_id = f.fluxo_espaco_in and a.artigo_id = f.fluxo_artigo_in then f.fluxo_quantidadein * 1
            when e.espaco_id = f.fluxo_espaco_out and a.artigo_id = f.fluxo_artigo_out then f.fluxo_quantidadeout * -1
          end as fluxo_quantidade,
          row_number() over ( partition by a.artigo_id, e.espaco_id ) as fluxo_order,
          count( f.fluxo_id ) over ( partition by a.artigo_id, e.espaco_id ) as fluxo_end

        from tweeks.fluxo f
          inner join tweeks.artigo a on a.artigo_id in ( f.fluxo_artigo_in, f.fluxo_artigo_out )
            and a.artigo_id = coalesce( _artigo_id, a.artigo_id )
          inner join tweeks.espaco e on e.espaco_id in ( f.fluxo_espaco_in, f.fluxo_espaco_out )
            and e.espaco_id = coalesce( _espaco_id, e.espaco_id )
          left join __stock_point _sp on _sp.artigo_id = a.artigo_id and _sp.espaco_id = e.espaco_id
        where  f.fluxo_dataregistro >= coalesce( _sp.point, f.fluxo_dataregistro )
        order by a.artigo_id,
          e.espaco_id,
          f.fluxo_dataregistro,
          f.fluxo_sequencia
    ), __fluxo_stock as (
      select
           _f.*,
           _f.fluxo_quantidade as fluxo_resultado,
           0.0::double precision as fluxo_preview,
           _f.fluxo_id as fluxo_checkmarks,
           _f.fluxo_quantidade as fluxo_checkquant,
           _f.fluxo_order = _f.fluxo_end as fluxo_resume
        from __fluxo _f
          inner join __map _const on true
          where _f.fluxo_order = 1
      union all
        select
            _f.*,
            ( _fs.fluxo_resultado * _f.fluxo_checkpoint ) + ( _f.fluxo_quantidade ),
            _fs.fluxo_resultado as fluxo_priview,
            case
              when _f.fluxo_checkpoint = 0 then _f.fluxo_id
              else _fs.fluxo_checkmarks
            end,
            case
              when _f.fluxo_checkpoint = 0 then _f.fluxo_quantidade
              else _fs.fluxo_checkquant
            end,
            _f.fluxo_order = _f.fluxo_end as fluxo_resume

      from __fluxo_stock _fs
            inner join __fluxo _f on _fs.espaco_id = _f.espaco_id
              and _fs.artigo_id = _f.artigo_id
              and _fs.fluxo_order +1 = _f.fluxo_order
    ) select
        _fs.artigo_id as stock_artigo_id,
        _fs.espaco_id as stock_espaco_id,
        _fs.fluxo_preview,
        _fs.fluxo_resultado,

        _fs.fluxo_checkmarks,
        _fs.fluxo_checkquant,

        _fs.fluxo_order,
        _fs.fluxo_end,
        _fs.fluxo_resume,

        _fs.fluxo_credito,
        _fs.fluxo_debito,
        _fs.fluxo_credito - _fs.fluxo_debito,
        _fs.fluxo_quantidade,
        _fs.fluxo_id,
        _fs.fluxo_dataregistro,
        _fs.fluxo_sequencia
      from __fluxo_stock _fs
      where true in (
        coalesce( _resume, true ) = _fs.fluxo_resume,
        not _resume
      )
$$;

drop function tweeks._get_stock(arg_stock_id uuid);


drop function tweeks._get_stock(_artigo_id uuid, _espaco_id uuid);
create or replace function tweeks._get_stock( _artigo_id uuid, _espaco_id uuid)
returns table (
  stock_artigo_id uuid,
  stock_espaco_id uuid,
  stock_quantidade double precision
)
  strict
  language plpgsql
as
$$
declare
  _fluxo_scan record;
begin
  select * into _fluxo_scan
    from tweeks.__fluxo_scan( _artigo_id, _espaco_id, true );

  _get_stock.stock_espaco_id := coalesce( _fluxo_scan.fluxo_espaco_id, _espaco_id );
  _get_stock.stock_artigo_id:= coalesce( _fluxo_scan.fluxo_artigo_id, _artigo_id );
  _get_stock.stock_quantidade := coalesce( _fluxo_scan.fluxo_resultado, 0.0 );
  return next;
end;
$$;

select * from tweeks.__fluxo_scan( _resume := false);
select * from tweeks.fluxo;

truncate tweeks.fluxo;
truncate tweeks.conta cascade ;
truncate tweeks.entrada;
truncate tweeks.transferencia;
truncate tweeks.acerto;
truncate tweeks.retalho;


select retalho_artigo_composto, retalho_artigo_base,retalho_composicao, retalho_quantidade, retalho_total
  from tweeks.retalho;

/**

  Check point do stock

  Check point do stock sera equivalente a um registro de acerto feito de forma automatizada

  ( QUANDO )
    1 - Tem que ser no momento em que todos os servidores estão connectados
 */





