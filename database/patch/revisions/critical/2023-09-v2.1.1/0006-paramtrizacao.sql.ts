import {block} from "../../../core/updater";

block( module, {
    identifier: "tweeks.parametrizacao-structure",
    flags:[ "@unique" ]
}).sql`
select map.constant('maguita_parametrizacao_estado_ativo', 'int2', 1);
select map.constant('maguita_parametrizacao_estado_fechado', 'int2', 1);
-- drop table if  exists tweeks.parametrizacao;
create table if not exists tweeks.parametrizacao(
  parametrizacao_uid uuid not null primary key default gen_random_uuid(),
  parametrizacao_props jsonb not null default jsonb_build_object(),
  parametrizacao_tags character varying[] not null default array[]::text[],
  parametrizacao_estado int2 not null default map.get('maguita_parametrizacao_estado_ativo')::int2,
  parametrizacao_user_uid uuid not null,
  parametrizacao_user_update uuid default null,
  parametrizacao_espaco_auth uuid not null default null,
  parametrizacao_date timestamptz not null default clock_timestamp(),
  parametrizacao_dateupdate timestamptz default null,
  _branch_uid uuid not null
);
`;


block( module, {
    identifier: "parametrizacao-functions",
    flags:[ ]
}).sql`
create or replace function tweeks.sets_parametrizacao( args jsonb )
  returns lib.res
language plpgsql as $$
declare
  /**doc
    args := {
      arg_colaborador_id:UID
      arg_espaco_auth: UID,
      parametrizacao_uid?
      parametrizacao_props
      parametrizacao_tags* varchar[],
      parametrizacao_estado?
    }
   doc*/
  _user_id uuid not null default args->>'arg_colaborador_id';
  _espaco_auth uuid not null default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( _user_id, _espaco_auth );
  _const map.constant;
  _parametrizacao tweeks.parametrizacao;
begin
  _const := map.constant();
  _parametrizacao := jsonb_populate_record( _parametrizacao, args );
  
  if _parametrizacao.parametrizacao_uid is null then
    _parametrizacao.parametrizacao_user_uid := _user_id;
    _parametrizacao.parametrizacao_espaco_auth := _espaco_auth;
    _parametrizacao._branch_uid := ___branch;
  else 
    _parametrizacao.parametrizacao_user_update := _user_id;
    _parametrizacao.parametrizacao_dateupdate := clock_timestamp();
  end if;
  
  select ( "returning" ).* 
    from lib.sets( _parametrizacao )
    into _parametrizacao
  ;
  
  return lib.res_true( jsonb_build_object(
    'parametrizacao', _parametrizacao
  ));
end;
$$;


create or replace function tweeks.funct_load_parametrizacao( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**doc
    args := {
      arg_colaborador_id:UID
      arg_espaco_auth: UID,
      parametrizacao_tags: []
    
    }
  doc*/
  
  _user_id uuid not null default args->>'arg_colaborador_id';
  _espaco_auth uuid not null default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( _user_id, _espaco_auth );
  _const map.constant;
  _parametrizacao tweeks.parametrizacao;
begin
  _const := map.constant();
  _parametrizacao := jsonb_populate_record( _parametrizacao, args );
  if coalesce( array_length( _parametrizacao.parametrizacao_tags, 1 ),  0 ) = 0 then 
      _parametrizacao.parametrizacao_tags := null;
  end if;
  return query 
    with __parametrizacao as (
      select *
        from tweeks.parametrizacao p 
        where p.parametrizacao_estado = _const.maguita_parametrizacao_estado_ativo
          and p.parametrizacao_tags @> coalesce( _parametrizacao.parametrizacao_tags, p.parametrizacao_tags )
          and p._branch_uid = ___branch
    ) select to_jsonb( _p )
       from __parametrizacao _p
  ;
end;
$$
`;



