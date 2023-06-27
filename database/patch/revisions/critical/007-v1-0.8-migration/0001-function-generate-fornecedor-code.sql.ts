import {block} from "../../../core/updater";

block( module, { identifier: "migration/fornecedor-code", flags:[]}).sql`
create or replace function tweeks.__generate_fornecedor_code( _branch uuid )
  returns text
  language plpgsql as $$
declare
  __fornecedor_code text;
begin
  while __fornecedor_code is null loop
      __fornecedor_code := cluster.next( 'fornecedor/seq', lpad := 2, lpad_char := '0', sub :=  _branch::text );
      if exists(
          select *
          from tweeks.fornecedor f
          where f.fornecedor_code = __fornecedor_code
        ) then
        __fornecedor_code := null;
      end if;
    end loop;

  return  __fornecedor_code;
end;
$$;


create or replace function tweeks.funct_reg_fornecedor(args jsonb) returns lib.result
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
  _branch uuid  default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

begin

  -- Garantir que tanto o email quanto o nif seja unico
  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_nif = arg_fornecedor_nif
  ) then
    return false? 'NIF já existe!';
  end if;

  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_email = arg_fornecedor_email
  ) then
    return false? 'Email já existe!';
  end if;
  
  _fornecedor.fornecedor_code := tweeks.__generate_fornecedor_code( _branch );

  insert into tweeks.fornecedor (
    fornecedor_colaborador_id,
    fornecedor_espaco_auth,
    fornecedor_nif,
    fornecedor_nome,
    fornecedor_email,
    fornecedor_contacto,
    fornecedor_endereco,
    fornecedor_code
  ) values (
    arg_colaborador_id,
    arg_espaco_auth,
    arg_fornecedor_nif,
    arg_fornecedor_nome,
    arg_fornecedor_email,
    arg_fornecedor_contacto,
    arg_fornecedor_endereco,
    _fornecedor.fornecedor_code
  ) returning * into _fornecedor;

  return true ? jsonb_build_object(
    'fornecedor', _fornecedor
  );
end;
$$;

`;