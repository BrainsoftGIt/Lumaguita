drop schema if exists api cascade;
create schema if not exists api;


create table api.permission(
  permission_id smallserial not null,
  permission_code character varying,
  permission_name character varying not null,
  permission_description text,
  permission_icon character varying,
  permission_ jsonb default null,
  constraint pk_permission_id primary key ( permission_id )
);


create table api.token(
  token_uid uuid not null,
  token_user_uid uuid not null,
  token_user_update uuid,
  token_espaco_auth uuid not null,
  token_espaco_work uuid not null,
  token_user_work uuid not null,
  token_app character varying not null,
  token_key character varying not null,
  token_permissions int[] not null,
  token_status int2 not null default libdom.get('maguita_token_status_active'::name)::smallint,
  token_dataregistro timestamptz not null default clock_timestamp(),
  token_dataupdate timestamptz default null,
  _branch_uid uuid not null,
  constraint pk_token_uid primary key ( token_uid )
);

drop table if exists api.request cascade ;
create table api.request(
  request_uid uuid default gen_random_uuid(),
  request_document jsonb not null,
  request_response jsonb default null,
  request_token character varying,
  request_operation character varying,
  request_token_uid uuid,
  request_date timestamptz not null default clock_timestamp(),
  request_instanteresponse timestamptz default null,
  constraint pk_request_uid primary key ( request_uid ),
  constraint fk_request_to_token foreign key ( request_token_uid )
    references api.token( token_uid )
);

delete from libdom.entryset where domain = 'TOKEN_STATUS';
delete from libdom.domsync where domain = 'TOKEN_STATUS';

INSERT INTO libdom.entryset (name, type, value, domain, label) VALUES ('maguita_token_status_active', 'smallint', '1', 'TOKEN_STATUS', 'Ativo');
INSERT INTO libdom.entryset (name, type, value, domain, label) VALUES ('maguita_token_status_disable', 'smallint', '0', 'TOKEN_STATUS', 'Disable');
INSERT INTO libdom.domsync (classname, columnname, domain, comment) VALUES ('tweeks.token', 'token_status', 'TOKEN_STATUS', 'Estados do token');


create or replace function api.funct_reg_token( args jsonb )
returns lib.res
language plpgsql as $$
declare
  /**
    args := {
      arg_espaco_auth: uuid
      arg_colaborador_id: uuid
      token_uid
      token_app: APP
      token_permissions: [ID, ID, ID]
    }
   */
  _collaborador_id uuid default args->>'arg_colaborador_id';
  _espaco_auth uuid default args->>'arg_espaco_auth';

  _branch_uid uuid default tweeks.__branch_uid(_collaborador_id, _espaco_auth );
  _token tweeks.token;
begin
  _token := jsonb_populate_record( _token, args );

  if _token.token_uid is null then
    _token._branch_uid := _branch_uid;
    _token.token_user_uid := _collaborador_id;
    _token.token_espaco_auth := _espaco_auth;
  else

  end if;


  while _token.token_key is null loop
    _token.token_key := lib.dset_random_text(64 );
    if exists( select token_key from tweeks.token where token_key = _token.token_key ) then
      _token.token_key := null;
    end if;
  end loop;

  select ( "returning".* ) into _token
    from lib.sets( _token );

  return lib.res_true(jsonb_build_object(
    'token', _token
  ));
end;
$$;


create or replace function api.funct_load_token( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    arg_espaco_auth: UUID
    arg_colaborador_id: UUID
   */
  _colaborator_uid uuid default args->>'arg_colaborador_id';
  _espaco_uid uuid default args->>'arg_colaborador_id';
  _branch uuid default tweeks.__branch_uid( _colaborator_uid, _espaco_uid );
  _domconst libdom.constant;
begin
  _domconst := libdom.constant('maguita_token' );
  return query
    with __token as (
      select *
        from tweeks.token tk
          left join libdom.entryset e on tk.token_status
        where tk._branch_uid = _branch
    ) select to_jsonb( tk2 )
        from __token tk2
        order by case
            when tk2.token_status = _domconst.maguita_token_status_active then 1
            else 2
          end,
          tk2.token_app
  ;
end;
$$;


create or replace function api.__create_request( document jsonb )
returns api.request
language sql as $$
insert into api.request(
  request_document
) values (
  document
) returning *
$$;


create or replace function api.__create_response(
  _request_uid uuid,
  _request_response jsonb,
  _request_token character varying,
  _request_token_uid uuid,
  _request_operation character varying
) returns api.request
language sql as $$
update api.request
  set request_response = _request_response,
      request_token = _request_token,
      request_token_uid = _request_token_uid,
      request_operation = _request_operation
  where request_uid = _request_uid
  returning *
$$;