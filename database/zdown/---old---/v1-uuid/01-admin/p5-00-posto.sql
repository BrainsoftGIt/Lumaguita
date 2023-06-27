select map.constant( 'maguita_aloca_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_aloca_estado_fechado', 'int2', 0 );


drop table if exists tweeks.chave;
create table tweeks.chave(
    chave_temporarai character varying not null,
    chave_definitiva character varying,
    chave_descricao character varying,
    chave_date timestamptz not null default current_timestamp,
    constraint pk_chave_temp primary key ( chave_temporarai )
);

create or replace function tweeks.funct_generate_chave( args jsonb default null )
returns setof jsonb
language plpgsql as $$
declare
  _chave tweeks.chave;
  arg_chave_descricao character varying default args->>'arg_chave_descricao';
  letters character varying default 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  numbers character varying default '0123456789';
begin
  _chave.chave_temporarai := format( '%s-%s-%s',
      lib.dset_random_text( letters, 3 ),
      lib.dset_random_text( numbers||letters||numbers, 3 ),
      lib.dset_random_text( numbers, 3 )
  );
  insert into tweeks.chave(
    chave_temporarai,
    chave_descricao
  ) values (
    _chave.chave_temporarai,
    arg_chave_descricao
  ) returning * into _chave;
  return next  to_jsonb( _chave );
end;
$$;

create or replace function tweeks.funct_load_chave( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    arg_chave_temporaria: CHAVE-TEMP
   */
    arg_chave_temporaria character varying default args->>'arg_chave_temporaria';
    _const map.constant;
begin
  _const := map.constant();
  if arg_chave_temporaria is null then
      return query
          select to_jsonb( ch )
            from tweeks.chave ch
            where (ch.chave_date + interval '24' hour )  > now()
              and ch.chave_definitiva is null;
  else
      return query
          select to_jsonb( ch ) || coalesce( to_jsonb( p ), jsonb_build_object()) || jsonb_build_object(
                'posto_disponivel', coalesce( p.posto_estado != _const.maguita_posto_estado_encerado, false )
            )
          from tweeks.chave ch
            left join tweeks.posto p on ch.chave_definitiva = p.posto_chave
          where ch.chave_temporarai = arg_chave_temporaria
      ;
  end if;
end;
$$;

create or replace function tweeks.funct_change_chave_restore( args jsonb )
returns lib.result
language plpgsql as $$
declare
  /**
     arg_chave_temporaria: CHAVE
     arg_chave_definitiva: CHAVE
   */
    arg_chave_temporaria character varying default args->>'arg_chave_temporaria';
    arg_chave_definitiva character varying default args->>'arg_chave_definitiva';
    _chave tweeks.chave;
begin
  select * into _chave
    from tweeks.chave ch
    where ch.chave_temporarai = arg_chave_temporaria;

  if _chave.chave_definitiva is not null then
      return lib.result_false( 'Chave temporaria já aplicada' );
  else
     update tweeks.chave
        set chave_definitiva = arg_chave_definitiva
        where chave_temporarai = arg_chave_temporaria
        returning * into _chave
      ;
     return lib.result_true( to_jsonb( _chave ) );
  end if;
end
$$;


create table tweeks.aloca(
    aloca_id uuid not null default public.uuid_generate_v4(),
    aloca_posto_id uuid not null,
    aloca_espaco_destino uuid not null,
    aloca_espaco_auth uuid not null,
    aloca_colaborador_id uuid not null,
    aloca_colaborador_atualizacao uuid default null,
    aloca_montante double precision not null default 0,
    aloca_estado int2 not null default map.get('maguita_aloca_estado_fechado' )::int2,
    aloca_dataregistro timestamptz not null default current_timestamp,
    aloca_dataatualizacao timestamptz default null,
    constraint pk_aloca_id primary key ( aloca_id ),
    constraint fk_aloca_to_posto foreign key ( aloca_posto_id )
      references tweeks.posto,
    constraint fk_aloca_to_espaco_destino foreign key ( aloca_espaco_destino )
      references tweeks.espaco,
    constraint fk_aloca_to_espaco foreign key ( aloca_espaco_auth )
      references tweeks.espaco
);

insert into tweeks.aloca(
    aloca_posto_id,
    aloca_espaco_destino,
    aloca_espaco_auth,
    aloca_colaborador_id,
    aloca_colaborador_atualizacao,
    aloca_montante,
    aloca_estado,
    aloca_dataregistro,
    aloca_dataatualizacao
) select posto_id,
         posto_espaco_destino,
         posto_espaco_auth,
         posto_colaborador_id,
         posto_colaborador_atualizacao,
         posto_montante,
         posto_estado,
         posto_dataregistro,
         posto_dataatualizacao
   from tweeks.posto;

-- Drop unnecessary attrs
alter table tweeks.posto drop posto_espaco_destino;
alter table tweeks.posto drop posto_montante;
alter table tweeks.posto drop posto_ip;
alter table tweeks.posto drop posto_hostname;
alter table tweeks.posto drop posto_ipv6;
alter table tweeks.posto drop posto_ipv4;
alter table tweeks.posto drop posto_vendor;
alter table tweeks.posto drop posto_user;
alter table tweeks.posto drop posto_platform;
alter table tweeks.posto drop posto_distro;

-- rename attrs
alter table tweeks.posto rename posto_endereco to posto_chave;
alter table tweeks.posto rename posto_mac to posto_matricula;


drop function tweeks.funct_change_posto(args jsonb);

alter table aloca alter aloca_estado set default (map.get('maguita_aloca_estado_ativo'::name))::smallint;

alter table tweeks.posto add posto_authmode int2;
alter table tweeks.posto add posto_caixamode int2;

select map.constant( 'maguita_posto_caixamodo_pessoal', 'int2', 1, 'Cada pessoa em cada espaço com sua propria caixa' );
select map.constant( 'maguita_posto_caixamodo_espaco', 'int2', 2, 'Cada espaço com sua propria caixa' );
select map.constant( 'maguita_posto_caixamodo_posto', 'int2', 3, 'Uma caixa para todo o posto' );

alter table tweeks.posto alter posto_estado set default map.get('maguita_posto_estado_fechado')::int2;

create or replace function tweeks.funct_reg_posto( args jsonb ) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para criar uma posto para o colaborador
    args := {
      arg_posto_id: UUID
      arg_espaco_auth: ID,
      arg_espaco_destino: [ID, ID, ID],
      arg_colaborador_id: ID
      arg_posto_multiplecaixa: BOOLEAN

      arg_posto_matricula:  MATRICULA (CHAVE TEMPORARIA),
      arg_posto_designacao: DESIGNACAO,
      arg_tposto_id: ID,
      arg_posto_multipleuser: BOOLEAN,
      arg_posto_designcao: ID,
      arg_posto_montanteinicial: MONTANTE_INICIAL,
      posto_authmode: AUTH-MODE,
      posto_caixamode: CAIXA-MODE,
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_posto_id uuid default args->>'arg_posto_id';
  arg_espaco_destino uuid[] not null default array( select e.text from jsonb_array_elements_text( args->'arg_espaco_destino') e( text ));
  arg_posto_designacao character varying not null default args->>'arg_posto_designacao';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_tposto_id int2 not null default args->>'arg_tposto_id';
  arg_posto_multiplecaixa boolean default args->>'arg_posto_multiplecaixa';
  arg_posto_matricula character varying default   args->>'arg_posto_matricula';
  arg_posto_montanteinicial float default         args->>'arg_posto_montanteinicial';
  arg_posto_authmode int2 not null default        args->>'posto_authmode';
  arg_posto_caixamode int2 not null default       args->>'posto_caixamode';

  _const map.constant;
  _posto tweeks.posto;
  _posto_chave character varying;
  chars character varying default 'abcdefghijklmnopqrstuvwxyz'||upper('abcdefghijklmnopqrstuvwxyz')||'0123456789'||'$#%';

begin

  _const := map.constant();

  if arg_posto_id is null then
      if (
          select count( * ) > 0
          from tweeks.posto p
          where p.posto_matricula = arg_posto_matricula
      ) then
          return false ? '@tweeks.posto.endereco-already-exist';
      end if;

    _posto_chave := lib.dset_random_text( chars, (2^8)::int )::character varying;
    _posto.posto_espaco_auth := arg_espaco_auth;
    _posto.posto_tposto_id := arg_tposto_id;
    _posto.posto_colaborador_id := arg_colaborador_id;
    _posto.posto_designacao := arg_posto_designacao;
    _posto.posto_multiplecaixa := coalesce( arg_posto_multiplecaixa, true );
    _posto.posto_matricula := arg_posto_matricula;
    _posto.posto_chave := _posto_chave;
    _posto.posto_authmode := arg_posto_authmode;
    _posto.posto_caixamode  := arg_posto_caixamode;

     select ( "returning" ).* into _posto from lib.sets_in( _posto );

      update tweeks.chave
        set chave_definitiva = _posto.posto_chave
        where chave_temporarai = _posto.posto_matricula
      ;
  else
      select ( "returning" ).* into _posto
        from tweeks.posto p
          inner join lib.sets_up( p, replacer := args||jsonb_build_object(
            'posto_tposto_id', arg_tposto_id,
            'posto_designacao', arg_posto_designacao,
            'posto_multiplecaixa', coalesce( arg_posto_multiplecaixa, true ),
            'posto_authmode', arg_posto_authmode,
            'posto_caixamode', arg_posto_caixamode
          )) up on true
        where p.posto_id = arg_posto_id
      ;
  end if;

  -- Desativar os antigos espaços alocados ao posto
  update tweeks.aloca
    set aloca_estado = _const.maguita_aloca_estado_fechado,
        aloca_colaborador_atualizacao = arg_colaborador_id,
        aloca_dataatualizacao = current_timestamp
    where aloca_posto_id = _posto.posto_id
      and aloca_espaco_destino != all( arg_espaco_destino )
  ;

  -- Criar nova alocaçoes
  insert into tweeks.aloca(
    aloca_posto_id,
    aloca_espaco_destino,
    aloca_espaco_auth,
    aloca_colaborador_id,
    aloca_montante
) select
       _posto.posto_id,
       n.next,
       arg_espaco_auth,
       arg_colaborador_id,
       coalesce( arg_posto_montanteinicial, 0 )
      from unnest( arg_espaco_destino ) n( next )
        left join tweeks.aloca al on n.next = al.aloca_espaco_destino
          and al.aloca_posto_id = _posto.posto_id
          and al.aloca_estado = _const.maguita_aloca_estado_ativo
      where al.aloca_id is null
  ;

  return true ? jsonb_build_object(
        'posto', _posto,
        'aloca', array(
          select to_jsonb( a )
            from tweeks.aloca a
            where a.aloca_posto_id = _posto.posto_id
              and a.aloca_estado = _const.maguita_aloca_estado_ativo
        )
  );
end;
$$;





