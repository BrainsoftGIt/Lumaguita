create or replace function auth.funct_load_menu(filter jsonb DEFAULT NULL::jsonb)
    returns TABLE(menu_id smallint, menu_codigo character varying, menu_raiz character varying, menu_nivel smallint, menu_icon character varying, menu_nome character varying, menu_link character varying, menu_estado smallint, menu_children smallint, menu_maxnode smallint, menu_directchildern smallint, menu_position smallint, menu_falta boolean, menu_mais boolean, menu_sincronizado boolean, acesso_id uuid, perfil_id uuid, menu_menu_id smallint, menu_menu_codigo character varying, menu_menu_raiz character varying, menu_menu_nivel smallint, menu_menu_icon character varying, menu_menu_nome character varying, menu_menu_link character varying, menu_menu_estado smallint, menu_menu_children smallint, menu_menu_maxnode smallint, menu_menu_directchildern smallint, menu_menu_position smallint)
    immutable
    language plpgsql
as
$$
declare
  /**
    Essa função carrega os menus e faz um mach entre e perfil e o colaborador
    -- argumentos
      -- arg_colaborador_id identificador do colaborador o qual pretende-se obter os menus (opcional)
      -- arg_perfil_id identificador do perfil o qual pretende-se obter os menus (opcional)
      -- arg_allmenu boolean | quando true significa carregar todos os menus independete mente se o colaborador
        ou menu estiver associado ao mesmo
   */
  arg_colaborador_id uuid := filter->>'arg_colaborador_id';
  arg_perfil_id uuid := filter->>'arg_perfil_id';
  arg_allmenu boolean := filter->>'arg_allmenu';

  _const map.constant;
begin
    _const := map.constant();
  arg_allmenu := coalesce( arg_allmenu, false );

  -- Quando o filtro não for expecificado carregar todos os menus
  if filter is null then arg_allmenu := true; end if;

  return query
    select
        me.menu_id                ,
        me.menu_codigo            ,
        me.menu_raiz              ,
        me.menu_nivel             ,
        me.menu_icon              ,
        me.menu_nome              ,
        me.menu_link              ,
        me.menu_estado            ,
        me.menu_children          ,
        me.menu_maxnode           ,
        me.menu_directchildern    ,
        me.menu_position          ,

        ac.acesso_id is null and perf.perfil_id is not null,
        ac.acesso_id is not null and perf.perfil_id is null,
        ac.acesso_id is not null and perf.perfil_id is not null,

        ac.acesso_id              ,
        perf.perfil_id,

        super.menu_id             ,
        super.menu_codigo         ,
        super.menu_raiz           ,
        super.menu_nivel          ,
        super.menu_icon           ,
        super.menu_nome           ,
        super.menu_link           ,
        super.menu_estado         ,
        super.menu_children       ,
        super.menu_maxnode        ,
        super.menu_directchildern ,
        super.menu_position

      from auth.menu me
        left join auth.menu super on me.menu_menu_id = super.menu_id
        left join auth.acesso ac on me.menu_id = ac.acesso_menu_id
          and ac.acesso_estado = _const.acesso_estado_ativo
          and ac.acesso_colaborador_propetario = arg_colaborador_id
        left join auth.colaborador col on ac.acesso_colaborador_propetario = col.colaborador_id
        left join auth.privilegio pri on me.menu_id = pri.privilegio_menu_id
          and pri.privilegio_estado = _const.privilegio_estado_ativo
        left join auth.perfil perf on pri.previlegio_perfil_id = perf.perfil_id
          and perf.perfil_estado = _const.perfil_estado_ativo
          and perf.perfil_id = arg_perfil_id
      where me.menu_estado = _const.menu_estado_ativo
        and (
          ac.acesso_id is not null
            or perf.perfil_id is not null
            or col.colaborador_tipo = _const.colaborador_tipo_user_master -- para os colaboradores master carregar dodos os menus disponiveis
            or arg_allmenu
        )
      order by me.menu_position asc
  ;
end;
$$;

alter function funct_load_menu(jsonb) owner to maguita;

