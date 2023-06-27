
drop function if exists lib.duplicates( list jsonb, maps jsonb );
create or replace function lib.duplicates( list jsonb, maps jsonb, aggregate boolean default false )
returns setof text language plpgsql as $$
declare
  _keys text[] default array(
    select key
      from jsonb_each( maps )
  );
begin
  return query
    with __keys as (
      select distinct kv.key
        from jsonb_array_elements( list ) e( document )
          inner join jsonb_each( e.document ) kv ( key, value ) on kv.key = any( _keys )
        where kv.value = maps->( kv.key )
          and jsonb_typeof( kv.value ) != 'null'
    ) select distinct
        case
          when aggregate then  string_agg( _k.key, ', ') over ()
          else _k.key
        end
      from __keys _k
  ;
end
$$;

drop function if exists tweeks.funct_reg_fornecedor(args jsonb);
create or replace function tweeks.funct_sets_fornecedor( args jsonb )
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

      fornecedor_id: UID | NULL
      fornecedor_nif: ID,
      fornecedor_nome: NOME,
      fornecedor_email: EMAIL,
      fornecedor_contacto: CONTACTO,
      fornecedor_endereco: ENDERECO
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  __fornecedor tweeks.fornecedor;
  _exists record;
  ___branch uuid  default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

begin
  __fornecedor := jsonb_populate_record( __fornecedor, args );

  if __fornecedor.fornecedor_id is null then
    __fornecedor.fornecedor_espaco_auth := arg_espaco_auth;
    __fornecedor.fornecedor_colaborador_id := arg_colaborador_id;
    while __fornecedor.fornecedor_code is null loop
        __fornecedor.fornecedor_code := cluster.next( 'fornecedor/seq', lpad := 2, lpad_char := '0', sub :=  ___branch::text );
      if exists(
        select *
          from tweeks.fornecedor f
          where f.fornecedor_code = __fornecedor.fornecedor_code
            and f._branch_uid = ___branch
      ) then
        __fornecedor.fornecedor_code := null;
      end if;
    end loop;
  else
    __fornecedor.fornecedor_colaborador_atualizacao := arg_colaborador_id;
    __fornecedor.fornecedor_dataatualizacao := current_timestamp;
  end if;

  with __uniques as (
    select
        f.fornecedor_code as "CODIGO",
        f.fornecedor_nif as "NIF",
        f.fornecedor_email as "EMAIL",
        jsonb_build_object(
          'CODIGO', __fornecedor.fornecedor_code,
          'NIF', __fornecedor.fornecedor_nif,
          'EMAIL', __fornecedor.fornecedor_email
        ) as _math
      from tweeks.fornecedor f
      where f._branch_uid = ___branch
        and ( __fornecedor.fornecedor_id is null or __fornecedor.fornecedor_id != f.fornecedor_id )
  ) select lib.duplicates( jsonb_agg( _uf ), _uf._math , true ) as dulicates  into _exists
      from __uniques _uf
      group by _uf._math
  ;

  if _exists.dulicates is not null then
    return false ? format( '(%s) estão duplicados!', _exists.dulicates );
  end if;


  select ( "returning" ).* into __fornecedor
    from lib.sets( __fornecedor );

  return true ? jsonb_build_object(
    'fornecedor', __fornecedor
  );
end;
$$;

drop function  if exists tweeks.funct_load_fornecedor_code( args jsonb );

drop function if exists tweeks.funct_load_fornecedor( filter jsonb );

create or replace function tweeks.funct_load_fornecedor( filter jsonb ) returns SETOF json
  language plpgsql
as
$$
declare
  /** Essa função serve para listar os fornecedores da base de dados
    filter := {
      arg_espaco_auth: ID,
      arg_colaborador_id: UID,
      query: {
        any:,
        code: CODE,
        name: NAME,
        mail: MAIL,
        tel: CONTACTO,
        nif: NIF,
        address: ENDERECO
      }
    }
  */
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
  _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

  _query_any text default lower( filter->'query'->>'any' );
  _query_code text default lower( filter->'query'->>'code' );
  _query_name text default lower( filter->'query'->>'name' );
  _query_mail text default lower( filter->'query'->>'mail' );
  _query_tel text default lower( filter->'query'->>'tel' );
  _query_nif text default lower( filter->'query'->>'nif' );
  _query_address text default lower( filter->'query'->>'address' );
begin
  _const := map.constant();

  return query
    with __fornecedor as  (
      select
        fo.fornecedor_id,
        fo.fornecedor_code,
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
        and fo._branch_uid = _branch
      order by fo.fornecedor_nome
    ), __query as  (
        select _f.*
          from __fornecedor _f
          where true
            and coalesce( _f.fornecedor_code, '' ) = coalesce( _query_code, _f.fornecedor_code, '' )
            and coalesce( _f.fornecedor_nif, '' ) = coalesce( _query_nif, _f.fornecedor_nif, '' )
            and coalesce( _f.fornecedor_contacto, '' ) = coalesce( _query_tel, _f.fornecedor_contacto, '' )
            and lower( coalesce( _f.fornecedor_nome, '' ) ) like lower( format( '%%%s%%', coalesce( _query_name, _f.fornecedor_nome, '' ) ) )
            and lower( coalesce( _f.fornecedor_email, '' ) ) like lower( format( '%%%s%%', coalesce( _query_mail, _f.fornecedor_email, '' ) ) )
            and lower( coalesce( _f.fornecedor_endereco, '' ) ) like lower( format( '%%%s%%', coalesce( _query_address, _f.fornecedor_endereco, '' ) ) )
            and ( false
              or coalesce( _f.fornecedor_code, '' ) = coalesce( _query_any, _f.fornecedor_code, ''  )
              or coalesce( _f.fornecedor_nif, '') = coalesce( _query_any, _f.fornecedor_nif, ''  )
              or coalesce( _f.fornecedor_contacto, '' ) = coalesce( _query_any, _f.fornecedor_contacto, '' )
              or lower( coalesce( _f.fornecedor_nome, '' ) ) like lower( format( '%%%s%%', coalesce( _query_name, _f.fornecedor_nome, '' ) ) )
              or lower( coalesce( _f.fornecedor_email, '' ) ) like lower( format( '%%%s%%', coalesce( _query_mail, _f.fornecedor_email, '' ) ) )
              or lower( coalesce( _f.fornecedor_endereco, '' ) ) like lower( format( '%%%s%%', coalesce( _query_address, _f.fornecedor_endereco, '' ) ) )
            )
    )
    select to_json( f )
      from __query f
  ;
end;
$$;




