import {block} from "../../../core/updater";

block( module, {
    identifier: "unit|v2.0.6-04",
    flags: [ "@unique" ]
}).sql`
select map.constant('maguita_unit_state_active', 'int2', 1 );
select map.constant('maguita_unit_state_fechado', 'int2', 0 );
create table if not exists tweeks.unit(
  unit_id uuid not null default gen_random_uuid() primary key ,
  unit_code character varying not null,
  unit_name character varying not null,
  unit_state int2 not null default map.get('maguita_unit_state_active')::int2,
  unit_date timestamptz not null default clock_timestamp(),
  unit_update timestamptz default null,
  unit_espaco_auth uuid not null references tweeks.espaco,
  unit_user_id uuid not null references auth.colaborador,
  unit_user_update uuid,
  _branch_uid uuid not null,
  constraint uk_unit_code unique ( unit_code, _branch_uid )
);

alter table tweeks.artigo add if not exists artigo_unit_id uuid default null;
do $$
  declare
    _record record;
    _unit tweeks.unit;
  begin
    for _record in 
      select * from tweeks.branch e
        left join tweeks.unit u on e.branch_uid  = u._branch_uid
          and lower( u.unit_code ) = lower( 'Unit')
        where u.unit_id is null
    loop
        insert into tweeks.unit ( 
            unit_code,
            unit_name,
            unit_espaco_auth,
            unit_user_id,
            _branch_uid
        ) values (
            'Unit',
            'Unidades',
            _record.branch_main_workspace,
            _record.branch_main_user,
            _record.branch_uid
      ) returning * into _unit;
        update tweeks.artigo
          set artigo_unit_id = _unit.unit_id
          where artigo_unit_id is null 
            and _branch_uid = _record.branch_uid
      ;
  end loop;
  end;
$$;
`;

block( module, {
    identifier: "unit:(sets,load)|v2.0.6-04",
}).sql`
create or replace function tweeks.funct_sets_unit( args jsonb )
  returns lib.res
language plpgsql as $$ 
declare
  /**doc
    Sets unit
    args := {
        _espaco_auth
        _user_id
        unit_id? ,
        unit_code,
        unit_name,
        unit_state?
    }
  doc*/
  _espaco_auth uuid not null default args->>'_espaco_auth';
  _user_id uuid not null default args->>'_user_id';
  _branch uuid default tweeks.__branch_uid( _user_id, _espaco_auth );
  _args tweeks.unit;
  _unit tweeks.unit;
begin
  
  _args := jsonb_populate_record( _args, args );
  if _args.unit_id is null then 
    _args.unit_user_id := _user_id;
    _args.unit_espaco_auth := _espaco_auth;
    _args._branch_uid := _branch;
  else
    _args.unit_update := clock_timestamp();
    _args.unit_user_update := _user_id;
  end if;
  
  -- Garantir que o codigo da unidade não se repita
  if _args.unit_id is null and exists(
    select *
      from tweeks.unit u 
      where u._branch_uid = _args._branch_uid
        and lower( trim( u.unit_code ) )  = lower( trim( _args.unit_code ) )
  ) then
    return lib.res_false( 'Já existe uma unidade com o código selecionado!' );
  end if;
  
  select ( "returning").* into _unit
    from lib.sets( _args )
  ;
  
  return lib.res_true( jsonb_build_object(
    'unit', _unit
  ));
end;
$$;

create or replace function tweeks.funct_load_unit( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
    /**doc
        Carregar os documentos 
        args := {
          _espaco_auth
          _user_id
        }
  doc*/
    _espaco_auth uuid not null default args->>'_espaco_auth';
    _user_id uuid not null default args->>'_user_id';
    _branch uuid default tweeks.__branch_uid( _user_id, _espaco_auth );
begin
  return query
    with _unit as (
      select *
        from tweeks.unit u
        where u._branch_uid = _branch
    ) select to_jsonb( _u ) from _unit _u;
end;
$$;
`;
