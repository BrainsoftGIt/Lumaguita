create or replace function tweeks.__tg_fluxo_on_venda() returns trigger
  language plpgsql
as
$$
declare
  _new tweeks.venda;
  _old tweeks.venda;
  _fluxo tweeks.fluxo;
  _const map.constant;
  _conta tweeks.conta;
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
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );

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

    -- Quando tiver que fechar as vendas definir o documento do fluxo para essa venda
    elseif _old.venda_estado != _new.venda_estado and _new.venda_estado = _const.maguita_venda_estado_fechado then
      _conta := tweeks._get_conta( _old.venda_conta_id );
      update tweeks.fluxo
        set fluxo_documento = _conta.conta_numerofatura
        where fluxo_regclass = cluster.__format( pg_typeof( _new )::text::regclass )
          and (fluxo_referencia->>'venda_id')::uuid = _old.venda_id
      ;
    end if;

  end if;
  return null;
end
$$;
with __fluxo_venda as (
  select f.*, ve.*, ct.*
  from tweeks.fluxo f
         inner join tweeks.venda ve on ( f.fluxo_referencia->>'venda_id')::uuid  = ve.venda_id
         inner join tweeks.conta ct on ve.venda_conta_id = ct.conta_id
  where f.fluxo_regclass in ( 'venda', 'tweeks.venda' )
    and (f.fluxo_documento is null or f.fluxo_regclass = 'venda' )
) update tweeks.fluxo f
set fluxo_documento = fv.conta_numerofatura,
    fluxo_regclass = cluster.__format( 'tweeks.venda'::regclass )
from __fluxo_venda fv
where fv.fluxo_id = f.fluxo_id;


create or replace function tweeks.__tg_fluxo_on_entrada() returns trigger
  language plpgsql
as
$$
declare
  _new tweeks.entrada;
  _fluxo tweeks.fluxo;
  _const map.constant;
  _guia record;

begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;

  select * into _guia
    from tweeks.guia g
    where g.guia_uid = _new.entrada_guia_id
  ;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_entrada;
  _fluxo.fluxo_documento := _guia.guia_documentoperacao ;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );

  _fluxo.fluxo_refuid := _new.entrada_id;
  _fluxo.fluxo_quantidadein := _new.entrada_quantidade;
--   _fluxo.fluxo_quantidadeout :=;

  _fluxo.fluxo_artigo_in := _new.entrada_artigo_id;
--   _fluxo.fluxo_artigo_out := ;

--   _fluxo.fluxo_espaco_out := ;
  _fluxo.fluxo_espaco_in := _new.entrada_espaco_destino;

  _fluxo.fluxo_espaco_auth := _new.entrada_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.entrada_colaborador_id;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;
with __fluxo_entrada as (
  select f.*, ct.*
  from tweeks.fluxo f
         inner join tweeks.entrada fe on ( f.fluxo_referencia->>'entrada_id')::uuid  = fe.entrada_id
         inner join tweeks.guia ct on fe.entrada_guia_id = ct.guia_uid
  where f.fluxo_regclass in ( 'entrada', 'tweeks.entrada' )
    and (f.fluxo_documento is null or f.fluxo_regclass = 'entrada' )
) update tweeks.fluxo f
set fluxo_documento = fv.guia_documentoperacao,
    fluxo_regclass = cluster.__format( 'tweeks.entrada'::regclass )
from __fluxo_entrada fv
where fv.fluxo_id = f.fluxo_id;

alter table tweeks.retalho add retalho_codigo character varying;
create or replace function tweeks.__generate_retalho_code(
  brc uuid,
  user_brc uuid default null,
  space_brc uuid default null
) returns character varying
  language plpgsql
as
$$
declare
  _cluster cluster.cluster;
  _code character varying;
  _len int default 6;
begin
  _cluster := cluster._get_cluster_local();
  brc := coalesce( brc, tweeks.__branch_uid( user_brc, space_brc ));

  while _code is null loop
      _code := cluster.next( 'retalho.code/seq', sub := brc::text, lpad := _len, lpad_char := '0' );
      if( exists(
          select *
          from tweeks.retalho c
          where c.retalho_codigo = _code
            and c._branch_uid = coalesce( brc, c._branch_uid )
        )) then
        _code := null;
      end if;
    end loop;
  return _code;
end;
$$;
create or replace function tweeks.funct_pos_reg_retalho(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /*
   args := {
      arg_colaborador_id,
      arg_espaco_auth,

      retalho_artigo_composto
      retalho_artigo_base
      retalho_composicao
      retalho_quantidade
   }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  _artigo_base tweeks.artigo;
  _artigo_composto tweeks.artigo;
  _retalho tweeks.retalho;
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

begin
  _retalho := jsonb_populate_record( _retalho, args );
  _artigo_base := tweeks._get_artigo( _retalho.retalho_artigo_base );
  _artigo_composto := tweeks._get_artigo( _retalho.retalho_artigo_composto );

  if _artigo_composto.artigo_artigo_id is null
    or _artigo_composto.artigo_compostoquantidade is null
  then
    return lib.res_false( 'O artigo selecionano para composto não é um artigo composto!' );
  end if;

  _retalho.retalho_codigo = tweeks.__generate_retalho_code( ___branch );
  _retalho.retalho_colaborador_id := arg_colaborador_id;
  _retalho.retalho_espaco_auth := arg_espaco_auth;

  select ( "returning" ).* into _retalho
    from lib.sets( _retalho )
  ;

  return lib.res_true(jsonb_build_object(
      'retalho', _retalho
    ));
end;
$$;
update tweeks.retalho
  set retalho_codigo = tweeks.__generate_retalho_code( _branch_uid )
  where retalho_codigo is null;
with __fluxo_retalho as (
  select f.*, fe.*
  from tweeks.fluxo f
       inner join tweeks.retalho fe on ( f.fluxo_referencia->>'retalho_id')::uuid  = fe.retalho_id
  where f.fluxo_regclass in ( 'retalho', 'tweeks.retalho' )
    and (f.fluxo_documento is null or f.fluxo_regclass = 'retalho' )
) update tweeks.fluxo f
set fluxo_documento =  fv.retalho_codigo ,
    fluxo_regclass = cluster.__format( 'tweeks.retalho'::regclass )
from __fluxo_retalho fv
where fv.fluxo_id = f.fluxo_id;
create or replace function tweeks.__tg_fluxo_on_retalho() returns trigger
  language plpgsql
as
$$
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
  _fluxo.fluxo_documento := _new.retalho_codigo;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );

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


alter table tweeks.acerto add acerto_codigo character varying;
create or replace function tweeks.__generate_acerto_code(
  brc uuid,
  user_brc uuid default null,
  space_brc uuid default null
) returns character varying
  language plpgsql
as
$$
declare
  _cluster cluster.cluster;
  _code character varying;
  _len int default 6;
begin
  _cluster := cluster._get_cluster_local();
  brc := coalesce( brc, tweeks.__branch_uid( user_brc, space_brc ));

  while _code is null loop
      _code := cluster.next( 'acerto.code/seq', sub := brc::text, lpad := _len, lpad_char := '0' );
      if( exists(
          select *
          from tweeks.acerto c
          where c.acerto_codigo = _code
            and c._branch_uid = coalesce( brc, c._branch_uid )
        )) then
        _code := null;
      end if;
    end loop;
  return _code;
end;
$$;
create or replace function tweeks.funct_reg_acerto(args jsonb) returns lib.result
  language plpgsql
as
$$
declare
  /**
    Essa função serve para efetuar o acerto do stock
    args = {
      arg_espaco_auth: ID
      arg_espaco_id: ID,
      arg_colaborador_id := ID,

      acerto_observacao: OBS
      arg_acerto: [{
        artigo_id:UUID,
        acerto_quantidade: QUANTIDADE
      }]
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_id uuid not null default args->>'arg_espaco_id';
  arg_acerto_observacao varchar default args->>'acerto_observacao';

  arg_acerto_corecao double precision;

  _const map.constant;
  _stock record;
  _acerto tweeks.acerto;
  _new tweeks.acerto;

  _acerto_group uuid;
  _data record;
  acertos jsonb default jsonb_build_array();
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();

  for _data in
    select
        (e.doc->>'artigo_id')::uuid as artigo_id,
        (e.doc->>'acerto_quantidade')::double precision as acerto_quantidade
      from jsonb_array_elements( args->'arg_acerto' ) e( doc )
  loop

    _stock := tweeks._get_stock( _data.artigo_id, arg_espaco_id );
    arg_acerto_corecao := _stock.stock_quantidade - _data.acerto_quantidade;
    _acerto_group := public.uuid_generate_v4();
    _new.acerto_codigo := tweeks.__generate_acerto_code( ___branch );
    _new.acerto_colaborador_id :=    arg_colaborador_id;
    _new.acerto_quantidade :=        _data.acerto_quantidade;
    _new.acerto_quantidadeinicial := _stock.stock_quantidade;
    _new.acerto_correcao :=          arg_acerto_corecao;
    _new.acerto_observacao :=        arg_acerto_observacao;
    _new.acerto_espaco_auth :=       arg_espaco_auth;
    _new.acerto_oprgroup :=          _acerto_group;
    _new.acerto_artigo_id :=         _data.artigo_id;
    _new.acerto_espaco_id :=         arg_espaco_id;

    -- Save acerto
    select ( "returning" ).* into _acerto
      from lib.sets_in( _new )
    ;

    _stock := tweeks._get_stock( _data.artigo_id, arg_espaco_id );
    acertos := acertos || jsonb_build_object(
      'acerto', _acerto,
      'stock', _stock,
      'artigo', tweeks._get_artigo( _stock.stock_artigo_id )
    );
  end loop;

  return  true ? acertos;
end;
$$;
update tweeks.acerto
  set acerto_codigo = tweeks.__generate_acerto_code( _branch_uid )
  where acerto_codigo is null;
with __fluxo_acerto as (
  select f.*, fe.*
  from tweeks.fluxo f
         inner join tweeks.acerto fe on ( f.fluxo_referencia->>'acerto_id')::uuid  = fe.acerto_id
  where f.fluxo_regclass in ( 'retalho', 'tweeks.retalho' )
    and (f.fluxo_documento is null or f.fluxo_regclass = 'retalho' )
) update tweeks.fluxo f
set fluxo_documento = fv.acerto_codigo,
    fluxo_regclass = cluster.__format( 'tweeks.acerto'::regclass )
from __fluxo_acerto fv
where fv.fluxo_id = f.fluxo_id;
create or replace function tweeks.__tg_fluxo_on_acerto() returns trigger
  language plpgsql
as
$$
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
  -- AC#3049940
  _fluxo.fluxo_documento := _new.acerto_codigo;
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


create or replace function tweeks.__tg_fluxo_on_transferencia() returns trigger
  language plpgsql
as
$$
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
  _fluxo.fluxo_documento := _new.transferencia_documento;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );

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
with __fluxo_transferencia as (
  select f.*, ve.*
  from tweeks.fluxo f
         inner join tweeks.transferencia ve on ( f.fluxo_referencia->>'transferencia_id')::uuid  = ve.transferencia_id
  where f.fluxo_regclass in ( 'transferencia', 'tweeks.transferencia' )
    and (f.fluxo_documento is null or f.fluxo_regclass = 'transferencia' )
) update tweeks.fluxo f
set fluxo_documento = fv.transferencia_documento,
    fluxo_regclass = cluster.__format( 'tweeks.transferencia'::regclass )
from __fluxo_transferencia fv
where fv.fluxo_id = f.fluxo_id;


alter table tweeks.toperacao add toperacao_code character varying;
update tweeks.toperacao set toperacao_code = 'ENTR' where toperacao_id = (map.constant()).maguita_toperacao_entrada;
update tweeks.toperacao set toperacao_code = 'ACER' where toperacao_id = (map.constant()).maguita_toperacao_acerto;
update tweeks.toperacao set toperacao_code = 'VEND' where toperacao_id = (map.constant()).maguita_toperacao_venda;
update tweeks.toperacao set toperacao_code = 'TRAN' where toperacao_id = (map.constant()).maguita_toperacao_transferencia;
update tweeks.toperacao set toperacao_code = 'PAGM' where toperacao_id = (map.constant()).maguita_toperacao_pagamento;
update tweeks.toperacao set toperacao_code = 'MOVM' where toperacao_id = (map.constant()).maguita_toperacao_movimento;
update tweeks.toperacao set toperacao_code = 'RETL' where toperacao_id = (map.constant()).maguita_toperacao_retalho;
