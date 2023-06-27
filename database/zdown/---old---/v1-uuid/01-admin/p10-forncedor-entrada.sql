drop function tweeks.funct_load_fornecedor(filter jsonb);
select map.constant( 'maguita_fornecedor_estado_ativo', 'int2',1 );
select map.constant( 'maguita_fornecedor_estado_fechado', 'int2', 0 );

select map.constantdrop( 'fornecedor_estado_ativo' );
select map.constantdrop( 'fornecedor_estado_fechado' );

alter table tweeks.fornecedor alter fornecedor_id set default public.uuid_generate_v4();

create or replace function tweeks.funct_load_fornecedor(filter jsonb)
    returns setof jsonb
    language plpgsql
as
$$
declare
  /** Essa função serve para listar os fornecedores da base de dados
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin
  _const := map.constant();

  return query
    with __fornecedor as  (
      select
        fo.fornecedor_id,
        fo.fornecedor_nif,
        fo.fornecedor_nome,
        fo.fornecedor_email,
        fo.fornecedor_contacto,
        fo.fornecedor_endereco,
        fo.fornecedor_estado,
        fo.fornecedor_dataregistro,
        fo.fornecedor_dataatualizacao
      from tweeks.fornecedor fo
      where fo.fornecedor_espaco_auth = any( arg_espaco_child )
        and fo.fornecedor_estado = _const.maguita_fornecedor_estado_ativo
      order by fo.fornecedor_nome
    )
    select to_jsonb( f )
      from __fornecedor f
  ;
end;
$$;

alter table tweeks.fornecedor alter fornecedor_estado set default (map.get( 'maguita_fornecedor_estado_ativo'))::int2;


create or replace function tweeks.funct_change_fornecedor_estado( args jsonb ) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função atualiza o estado do fornecedor (ativa/desativa)
    args := {
      arg_colaborador_id: ID,
      arg_fornecedor_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_fornecedor_id uuid not null default args->>'arg_fornecedor_id';

  _const map.constant;
  _fornecedor tweeks.fornecedor;

begin
  _const := map.constant();

  update tweeks.fornecedor
    set
      fornecedor_estado = lib.swith( fornecedor_estado,
          _const.maguita_fornecedor_estado_ativo,
          _const.maguita_fornecedor_estado_fechado
      ),
      fornecedor_dataatualizacao = current_timestamp,
      fornecedor_colaborador_atualizacao = arg_colaborador_id
    where fornecedor_id = arg_fornecedor_id
    returning * into _fornecedor;

  return true ? jsonb_build_object(
    'fornecedor', _fornecedor
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

alter table tweeks.entrada add entrada_group uuid not null;
alter table tweeks.entrada alter entrada_montante drop not null;
alter table tweeks.entrada alter entrada_data drop not null;
alter table tweeks.movimento alter movimento_id set default public.uuid_generate_v4();
select stock_quantidade from tweeks.stock where stock_quantidade > 0;

create or replace function tweeks.funct_reg_entrada( args jsonb ) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa funcao serve para registar as entradas de produto
    args = {
      arg_colaborador_id: *ID,
      arg_espaco_destino: *ID,
      arg_espaco_auth: *ID,
      arg_fornecedor_id: *ID,
      arg_entrada_codigofatura: CODIGO,
      arg_entrada_data: DATA,
      arg_entrada_descricao: DESCRICAO

      arg_entradas: [
        artigo_id: *ID,
        entrada_quantidade: *QT,
        entrada_montante: AMOUNT
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_fornecedor_id uuid not null default args->>'arg_fornecedor_id';
  arg_entrada_codigofatura character varying default args->>'arg_entrada_codigofatura';
  arg_entrada_data date default args->>'arg_entrada_data';
  arg_entrada_descricao character varying default args->>'arg_entrada_descricao';

  arg_entrada_next int ;

  _entreda tweeks.entrada;
  _new tweeks.entrada;
  __entreda tweeks.entrada[] default array[]::tweeks.entrada[];
  _espaco tweeks.espaco;
  _entrada_group uuid;
  _const map.constant;
  _data record;
begin

  _const := map.constant();

  _espaco := tweeks._get_espaco( arg_espaco_destino );

  if arg_entrada_codigofatura is null then
    arg_entrada_codigofatura := lib.str_nospace( to_char( arg_entrada_next, '"EN#"000-000' ) );
  end if;

  _entrada_group := public.uuid_generate_v4();


  for _data in
    select
        ( e.doc->>'artigo_id' )::uuid as artigo_id,
        ( e.doc->>'entrada_quantidade' )::double precision as entrada_quantidade,
        ( e.doc->>'entrada_montante' )::double precision entrada_montante
      from jsonb_array_elements( args->'arg_entradas' ) e( doc )
  loop
    _new.entrada_espaco_destino :=  arg_espaco_destino;
    _new.entrada_espaco_auth :=     arg_espaco_auth;
    _new.entrada_fornecedor_id :=   arg_fornecedor_id;
    _new.entrada_artigo_id :=       _data.artigo_id;
    _new.entrada_colaborador_id :=  arg_colaborador_id;
    _new.entrada_codigofatura :=    arg_entrada_codigofatura;
    _new.entrada_data :=            arg_entrada_data;
    _new.entrada_quantidade :=      _data.entrada_quantidade;
    _new.entrada_montante :=        _data.entrada_montante;
    _new.entrada_descricao :=       arg_entrada_descricao;
    _new.entrada_group :=           _entrada_group;

    select ( "returning" ).* into _entreda
      from lib.sets_in( _new )
    ;

  end loop;

  return true? jsonb_build_object(
    'entreda', __entreda
  );
end;
$$;

alter table tweeks.fornecedor alter fornecedor_nif drop not null;
alter table tweeks.fornecedor alter fornecedor_email drop not null;

drop function rule.tg_entrada_after_insert_create_movimento() cascade;

create or replace function tweeks.funct_reg_fornecedor( args jsonb )
returns lib.result
language plpgsql
as
$$
declare
  /**
    Essa função serve para registar um novo fornecedor no sistema
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_fornecedor_nif: ID,
      arg_fornecedor_nome: NOME,
      arg_fornecedor_email: EMAIL,
      arg_fornecedor_contacto: CONTACTO,
      arg_fornecedor_endereco: ENDERECO
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_fornecedor_nif character varying default lib.str_normalize( lib.str_nospace( args->>'arg_fornecedor_nif') );
  arg_fornecedor_email character varying default lib.str_nospace( lower( args->>'arg_fornecedor_email' ) );
  arg_fornecedor_nome character varying not null default  lib.str_normalize( args->>'arg_fornecedor_nome' );
  arg_fornecedor_contacto character varying not null default lib.str_normalize( lib.str_nospace( args->>'arg_fornecedor_contacto' ) );
  arg_fornecedor_endereco character varying not null default lib.str_nospace( args->>'arg_fornecedor_endereco' );

  _fornecedor tweeks.fornecedor;

begin

  -- Garantir que tanto o email quanto o nif seja unico
  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_nif = arg_fornecedor_nif
  ) then
    return false? '@tweeks.fornecedor.nif-already-exist';
  end if;

  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_email = arg_fornecedor_email
  ) then
    return false? '@tweeks.fornecedor.email-already-exist';
  end if;

  insert into tweeks.fornecedor (
    fornecedor_colaborador_id,
    fornecedor_espaco_auth,
    fornecedor_nif,
    fornecedor_nome,
    fornecedor_email,
    fornecedor_contacto,
    fornecedor_endereco
  ) values (
    arg_colaborador_id,
    arg_espaco_auth,
    arg_fornecedor_nif,
    arg_fornecedor_nome,
    arg_fornecedor_email,
    arg_fornecedor_contacto,
    arg_fornecedor_endereco
  ) returning * into _fornecedor;

  return true ? jsonb_build_object(
    'fornecedor', _fornecedor
  );
end;
$$;

