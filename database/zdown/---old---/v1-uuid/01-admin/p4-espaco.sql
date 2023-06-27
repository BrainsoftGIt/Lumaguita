alter table tweeks.espaco rename espaco_tespaco_id to espaco_vender;
alter table tweeks.espaco drop constraint fk_espaco_to_tespaco;
alter table tweeks.espaco alter espaco_vender type boolean using case
    when espaco_vender = (map.constant()::map.constant).tespaco_venda then true
    else false
end;
drop table tweeks.tespaco;

alter table tweeks.espaco alter espaco_id set default public.uuid_generate_v4();

alter table tweeks.espaco alter espaco_vender drop not null;
alter table tweeks.espaco alter espaco_vender type character varying using null;

select * from tweeks.espaco;

create or replace function tweeks.funct_reg_espaco( args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para registar os espaços
    args = {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_espaco_vender: BOOLEAN,
      arg_espaco_nome: NOME,
      arg_espaco_descricao: NOME,
      arg_espaco_gerarfatura: BOOLEAN,
      arg_espaco_configurar: BOOLEAN,
      arg_espaco_codigo: CODIGO,
      arg_branch_uid: UID
    }
   */

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_vender character varying default args->>'arg_espaco_vender';
  arg_espaco_nome character varying default lib.str_normalize( args->>'arg_espaco_nome' );
  arg_espaco_gerarfatura boolean default lib.str_normalize( args->>'arg_espaco_gerarfatura' );
  arg_espaco_configurar boolean default lib.str_normalize( args->>'arg_espaco_configurar' );
  arg_espaco_codigo character varying default lib.str_normalize( args->>'arg_espaco_codigo' );
  arg_espaco_descricao character varying default lib.str_normalize( args->>'arg_espaco_descricao' );
  arg_branch_uid uuid default args->>'arg_branch_uid';

  _espaco tweeks.espaco;
  _const map.constant;

begin
  _const := map.constant();
  arg_espaco_codigo := upper( arg_espaco_codigo );
  -- Gerar o codigo para o espaço
  while arg_espaco_codigo is null loop

    arg_espaco_codigo := replace( upper( to_char( lib.dset_random_next(1, 9999 ), '0000' ) ), ' ', '' );
    if( select count( * ) > 0
        from tweeks.espaco esp
        where esp.espaco_codigo = arg_espaco_codigo
    ) then
      arg_espaco_codigo := null;
    end if;

  end loop;

  if (
    select count( * ) > 0
      from tweeks.espaco esp
      where lib.str_normalize( lower( esp.espaco_nome ) ) = lib.str_normalize( lower( arg_espaco_nome ) )
  ) then
    return false ? '@espaco.nome.already-exist';
  end if;

  insert into tweeks.espaco (
    espaco_branch_uid,
    espaco_espaco_id,
    espaco_espaco_auth,
    espaco_colaborador_id,
    espaco_nome,
    espaco_descricao,
    espaco_gerarfatura,
    espaco_configurar,
    espaco_codigo,
    espaco_vender
  ) values (
    arg_branch_uid,
    arg_espaco_auth,
    arg_espaco_auth,
    arg_colaborador_id,
    arg_espaco_nome,
    arg_espaco_descricao,
    arg_espaco_gerarfatura,
    arg_espaco_configurar,
    arg_espaco_codigo,
    arg_espaco_vender
  ) returning * into _espaco;

  perform tweeks.funct_reg_cambio(
    jsonb_build_object(
      'arg_espaco_auth', _espaco.espaco_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_currency_id', _const.currency_std,
      'arg_cambio_taxa', 1,
      'arg_cambio_data', make_date( 2000, 01, 01 )
  ));

  return true ? jsonb_build_object(
    'espaco', _espaco
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


create or replace function tweeks.funct_reg_cambio(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para registar o valor cambio
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_currency_id
      arg_cambio_taxa: VALOR_TAXA,
      arg_cambio_data: DATE
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_currency_id int2 not null default args->>'arg_currency_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_cambio_taxa double precision not null default args->>'arg_cambio_taxa';
  arg_cambio_data date not null default args->>'arg_cambio_data';

  _const map.constant;
  _cambio tweeks.cambio;

  arg_cambio_estado int2;
begin

  _const := map.constant();
  arg_cambio_data := current_date;
  lock table tweeks.cambio in share mode;

  if arg_currency_id = _const.currency_std then
    return false ? '@tweeks.cambio.can-not-update-cambio-std';
  end if;

  update tweeks.cambio
    set cambio_estado = _const.cambio_estado_fechado,
        cambio_dataatualizacao = current_timestamp,
        cambio_colaborador_atualizacao = arg_colaborador_id
    where cambio_estado = _const.cambio_estado_ativo
      and cambio_currency_id = arg_currency_id
  ;

  insert into tweeks.cambio (
    cambio_colaborador_id,
    cambio_currency_id,
    cambio_taxa,
    cambio_espaco_auth
  ) values (
    arg_colaborador_id,
    arg_currency_id,
    arg_cambio_taxa,
    arg_espaco_auth
  ) returning * into _cambio;



  return true ? jsonb_build_object( 'cambio', _cambio  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

drop function rule.espaco_get_childrens(arg_espaco_id uuid, arg_tespaco_id smallint);


create or replace function rule.espaco_get_childrens(arg_espaco_id uuid DEFAULT NULL::uuid)
 returns uuid[]
    volatile
    language plpgsql
as
$$
declare
  /**
    Essa função devolve os espaços afilhado a um espaco
    arg_espaco_id := id do espaço
   */
begin
  if arg_espaco_id is null then
    return array( select esp.espaco_id from tweeks.espaco esp );
  else
    return array(
      with recursive __parent as (
        select e.espaco_id from tweeks.espaco e where e.espaco_id = arg_espaco_id
        union all
        select e.espaco_id
          from __parent l
            inner join tweeks.espaco e on l.espaco_id = e.espaco_espaco_id
      ) select l.espaco_id
        from __parent l
    );
  end if;
end;
$$;

create or replace function rule.espaco_get_childrens_static(arg_espaco_id uuid DEFAULT NULL::uuid)
    returns uuid[] immutable language sql as 'select * from rule.espaco_get_childrens( arg_espaco_id );';

select * from tweeks.branch;
select * from tweeks.espaco;

drop function tweeks.funct_load_espaco(filter jsonb);

select * from tweeks.espaco;

select clu.cluster_name, esp.espaco_vender, esp.espaco_branch_uid--, br.branch_uid
from tweeks.espaco esp
--        left join  tweeks.branch br on esp.espaco_branch_uid = br.branch_uid
       left join cluster.cluster clu on clu.cluster_identifier = esp.espaco_vender

select * from tweeks.funct_load_espaco('{"arg_espaco_auth":"4f665a6c-3ef6-4b53-8b43-e9d02555a674"}')

create or replace function tweeks.funct_load_espaco( filter jsonb )
    returns setof jsonb language plpgsql
as
$$
declare
  /** Essa função lista todos os espacos registrado no sistema
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );

  _const map.constant;
begin

  _const := map.constant();
  return query
    with __espaco as (

    select
        esp.espaco_id,
        esp.espaco_nome,
        esp.espaco_vender,
        esp.espaco_descricao,
        esp.espaco_estado,
        esp.espaco_dataregistro,
        esp.espaco_dataatualizacao,
        esp.espaco_gerarfatura,
        esp.espaco_configurar,
        esp.espaco_configuracao,
        esp.espaco_nivel,
        clu.cluster_identifier,
        clu.cluster_name

      from tweeks.espaco esp
        inner join tweeks.branch br on esp.espaco_branch_uid = br.branch_uid
        left join cluster.cluster clu on clu.cluster_identifier = esp.espaco_vender
--           and clu.cluster_identifier = any( br.branch_clusters )
      where esp.espaco_espaco_id = any( arg_espaco_child )
        or esp.espaco_id = arg_espaco_auth
      order by
        esp.espaco_nome
    ) select to_jsonb( e  )
      from __espaco e
  ;
end;
$$;


create or replace function tweeks.funct_change_espaco(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /** Essa função serve para atualizar as informações do espaco
    args := {
      arg_espaco_change: ID -- id do espao que ser atualizado
      arg_espaco_vender: BOOLEAN
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_espaco_nome: NOME
      arg_espaco_descricao: DESCRICAO
      arg_espaco_gerarfatura: BOOLEAN
      arg_espaco_configurar: BOOLEAN
    }
  */

  arg_espaco_vender character varying not null default args->>'arg_espaco_vender';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_change uuid not null default args->>'arg_espaco_change';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_nome character varying not null default args->>'arg_espaco_nome';
  arg_espaco_descricao character varying default args->>'arg_espaco_descricao';
  arg_espaco_gerarfatura boolean not null default args->>'arg_espaco_gerarfatura';
  arg_espaco_configurar boolean not null default args->>'arg_espaco_configurar';
  _espaco tweeks.espaco;
begin

  update tweeks.espaco
    set espaco_nome = arg_espaco_nome,
        espaco_descricao = arg_espaco_descricao,
        espaco_vender = arg_espaco_vender,
        espaco_gerarfatura = arg_espaco_gerarfatura,
        espaco_configurar = arg_espaco_configurar,
        espaco_colaborador_atualizaco = arg_colaborador_id,
        espaco_dataatualizacao = current_timestamp
    where espaco_id = arg_espaco_change
    returning * into _espaco
  ;

  return true ? jsonb_build_object(
    'espaco', _espaco
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text; ll jsonb;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

drop function if exists tweeks.funct_load_espaco_simple(filter jsonb);
create or replace function tweeks.funct_load_espaco_simple(filter jsonb)
    returns setof jsonb
    language plpgsql
as
$$
declare
  /** Essa função lista os espacos ativos
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin


  _const := map.constant();
  return query
    with __espaco as (
        select
          esp.espaco_id,
          esp.espaco_nome
        from tweeks.espaco esp
        where esp.espaco_estado = _const.maguita_espaco_estado_ativo
          and ( esp.espaco_espaco_id = any( arg_arg_espaco_child ) or esp.espaco_id = arg_espaco_auth )
        order by esp.espaco_nome
    ) select to_jsonb( e )
        from __espaco e
  ;
end;
$$;





