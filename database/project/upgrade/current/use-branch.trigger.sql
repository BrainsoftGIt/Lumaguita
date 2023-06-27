create or replace function tweeks.__tg_use_branch() returns trigger
  language plpgsql
as
$$
  declare
    _class text default cluster.__format( format('%I.%I', tg_table_schema, tg_table_name ) );
    _map record;
    __branch_uid uuid;
    __colaborador_uid uuid;
    __espaco_uid uuid;
  begin

    -- Quando houver branch previeamente definido
    if new._branch_uid is not null then
      return new;
    end if;

    select * into _map
      from tweeks.branchmap b
      where b.class = _class;

    if _map.class is null then return new; end if;
    if _map.map_spc is null and _map.map_usr is null then return new; end if;
    if _map.map_brc is not null then
      new._branch_uid := to_jsonb( new )->>( _map.map_brc );
      return new;
    end if;

    __colaborador_uid := to_jsonb( new )->>( _map.map_usr );
    __espaco_uid := to_jsonb( new )->>( _map.map_spc );

    __branch_uid := tweeks.__branch_uid(__colaborador_uid, __espaco_uid );
    if __branch_uid is not null then
  --       raise exception 'Não pode determinar o branch para o registro, verificar o mapeamento dos branch!';
  --     else
      new._branch_uid := __branch_uid;
    else
  --       raise exception 'USR: % = %, SPC: % = %', _map.map_usr, __colaborador_uid, _map.map_spc, __espaco_uid;
    end if;

    return new;
  end;
$$;

