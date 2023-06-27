drop function if exists auth.funct_load_grants( jsonb );
create or replace function auth.funct_load_grants( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    menus: [ID, ID] || null
    colaborador_id: UID
   */
  _menu int[];
  _const map.constant;
  useMenu jsonb default args->'menus';
  _colaborador_id uuid default args->>'colaborador_id';

begin
  _const := map.constant();

  if jsonb_typeof( useMenu ) != 'array' then useMenu := null; end if;

  if useMenu is null or jsonb_array_length( useMenu ) = 0 then
    _menu := array(
        select me.menu_id
        from auth.menu me
      );
  else
    _menu := array(
        select e.text::int
        from jsonb_array_elements_text( useMenu ) e( text )
      );
  end if;

  return query
    select  to_jsonb( ac ) || to_jsonb( me )
      from auth.menu me
        inner join auth.acesso ac on me.menu_id = ac.acesso_menu_id
      where ac.acesso_estado = _const.acesso_estado_ativo
        and ac.acesso_colaborador_propetario = _colaborador_id
        and me.menu_id = any( _menu )
      order by me.menu_position
  ;
end;
$$;


drop function auth.funct_autenticacao(args jsonb);
create function auth.funct_autenticacao( args jsonb )
    returns TABLE(autenticacao_id uuid, autenticacao_chave character varying, autenticacao_dataregistro character varying, colaborador_id uuid, colaborador_email character varying, colaborador_nome character varying, colaborador_apelido character varying, colaborador_foto character varying, colaborador_accesso smallint, colaborador_estado smallint, colaborador_dataultimaatualizacasenha timestamp with time zone, colaborador_accessodesc character varying, colaborador_estadodesc character varying, tsexo_id smallint, tsexo_codigo character, tsexo_nome character varying, acesso jsonb)
    language plpgsql
as
$$
declare
/**
  Essa funcao serve para autenticar um colaborador
  no final da autenticacao sera devolvido as informacoes basica do colaborador
  args :{
    arg_auth_name: id | nif | email
    arg_auth_value: VALUE_OF_AUTH_NAME,
    arg_auth_method: senha | pin,
    arg_auth_key: VALUE_OF_AUTH_METHOD
    menus:[]
  }
*/

    arg_auth_name varchar := lib.str_normalize( lower( args->>'arg_auth_name' ) );
    arg_auth_value varchar := args->>'arg_auth_value';
    arg_auth_method varchar := lib.str_normalize( lower( args->>'arg_auth_method' ) );
    arg_auth_key varchar := args->>'arg_auth_key';


    _data record;
    _autenticacao auth.autenticacao;
    _const map.constant := map.constant();
    arg_autenticacao_chave character varying;
    arg_acessos jsonb;

begin
    if arg_auth_name is null then return; end if;
    if arg_auth_value is null then return; end if;
    if arg_auth_method is null then return; end if;
    if arg_auth_key is null then return; end if;

    if arg_auth_name not in ( 'id', 'nif', 'email' ) then return; end if;
    if arg_auth_method not in ( 'pin', 'senha' ) then return; end if;


    arg_auth_name := lower( lib.str_normalize( arg_auth_name ) );

    select * into _data
    from auth.colaborador co
             left join auth.tsexo sex on co.colaborador_tsexo_id = sex.tsexo_id
    where to_jsonb( co )->>format( 'colaborador_%s', arg_auth_name )  = arg_auth_value
      and to_jsonb( co )->>format( 'colaborador_%s', arg_auth_method )  = auth._encrypt( arg_auth_key )
      and co.colaborador_estado = _const.colaborador_estado_ativo
      and co.colaborador_accesso in ( _const.colaborador_accesso_ativo, _const.colaborador_accesso_pendente )
      and co.colaborador_tipo in ( _const.colaborador_tipo_user, _const.colaborador_tipo_user_master )
    ;



-- Quando as credenciais nao se conicedem
    if _data.colaborador_id is null then
        return;
    end if;

    -- Criar a chave única de autenticação
    arg_autenticacao_chave := auth._autenticacao_chave_generate();

    -- Criar a instancia de autenticação
    insert into auth.autenticacao(
        autenticacao_colaborador_id,
        autenticacao_chave
    ) values (
                 _data.colaborador_id,
                 arg_autenticacao_chave
             ) returning * into _autenticacao;

-- Carregar todos os menus do colaborador
  select jsonb_agg( e._grants ) into arg_acessos
    from auth.funct_load_grants( jsonb_build_object(
      'menus', args->'menus',
      'colaborador_id', _data.colaborador_id
    )) e ( _grants );

-- Devolver as informações do colaborador autenticado
    funct_autenticacao.autenticacao_id                        := _autenticacao.autenticacao_id;
    funct_autenticacao.autenticacao_chave                     := _autenticacao.autenticacao_chave;
    funct_autenticacao.autenticacao_dataregistro              := _autenticacao.autenticacao_dataregisto;

    funct_autenticacao.colaborador_id                         := _data.colaborador_id;
    funct_autenticacao.colaborador_email                      := _data.colaborador_email;
    funct_autenticacao.colaborador_nome                       := _data.colaborador_nome;
    funct_autenticacao.colaborador_apelido                    := _data.colaborador_apelido;
    funct_autenticacao.colaborador_foto                       := _data.colaborador_foto;
    funct_autenticacao.colaborador_estado                     := _data.colaborador_estado;
    funct_autenticacao.colaborador_accesso                    := _data.colaborador_accesso;
    funct_autenticacao.colaborador_dataultimaatualizacasenha  := _data.colaborador_dataultimaatualizacasenha;
    funct_autenticacao.colaborador_estadodesc                 := auth._colaborador_estado_desc( _data.colaborador_estado );
    funct_autenticacao.colaborador_accessodesc                := auth._colaborador_accesso_desc( _data.colaborador_accesso );

    funct_autenticacao.tsexo_id                               := _data.tsexo_id;
    funct_autenticacao.tsexo_nome                             := _data.tsexo_nome;
    funct_autenticacao.tsexo_codigo                           := _data.tsexo_codigo;
    funct_autenticacao.acesso                                 := arg_acessos;
    return next ;
end;
$$;

create or replace function tweeks.___override_auth_funct_autenticacao(args jsonb)
    returns setof jsonb
    language plpgsql
as
$$
declare
  /**
    Essa funcao serve para autenticar um colaborador
    no final da autenticacao sera devolvido as informacoes basica do colaborador
    args :{
      arg_auth_name: id | nif | email
      arg_auth_value: VALUE_OF_AUTH_NAME,
      arg_auth_method: senha | pin,
      arg_auth_key: VALUE_OF_AUTH_METHOD
    }
 */
  _auth record;
  espacos jsonb;
  ___branch tweeks.branch;
  _const map.constant;
begin
  _const := map.constant();

  select * into _auth
    from auth.funct_autenticacao( args );

  -- Quando o colaborador tiver accesso
  if _auth.colaborador_id is not null then
    ___branch := tweeks.__get_branch( tweeks.__branch_uid(
      _auth.colaborador_id
    ));

    if ___branch.branch_uid is not null then
      _auth.acesso := to_jsonb(array(
        select e.grants
          from auth.funct_load_grants(jsonb_build_object(
            'menus', ___branch.branch_grants->'menu',
            'colaborador_id', _auth.colaborador_id
          )) e( grants )
      ));
    end if;

    return query
      with __trabaha as (
          select array_agg( to_jsonb( tr ) || to_jsonb( es ) ) as espaco_trabalha
            from tweeks.trabalha tr
              inner join tweeks.espaco es on tr.trabalha_espaco_destino = es.espaco_id
                and tr.trabalha_colaborador_proprietario = _auth.colaborador_id
            where tr.trabalha_estado = _const.maguita_trabalha_estado_ativo
              and es.espaco_estado = _const.maguita_espaco_estado_ativo
      ) select jsonb_build_object(
            'auth', _auth,
            'espaco_trabalha', tr.espaco_trabalha
          )
        from __trabaha tr
      ;

    return query with
      __clusters as ( select c.cluster_uid, c.cluster_identifier, c.cluster_name, c.cluster_path  from cluster.cluster c ),
      __branch as (
        select
              b.branch_uid,
              b.branch_path,
              b.branch_clusters,
              b.branch_main_user,
              b.branch_main_workspace,
              b.branch_grants,
              b.branch_name,
              b.branch_licence,
              b.branch_state,
              b.branch_date,
              tb.tbranch_id,
              tb.tbranch_configs,
              tb.tbranch_name,
              e.espaco_id,
              e.espaco_nome,
              e.espaco_nivel,
              e.espaco_codigo,
              cmain.colaborador_id,
              cmain.colaborador_nome,
              cmain.colaborador_apelido,
              cmain.colaborador_email,
              cmain.colaborador_estado,
              cmain.colaborador_accesso,
              cmain.colaborador_tipo,
              array_agg( _clus ) as clusters

          from auth.colaborador cauth
            inner join tweeks.branch b on cauth.colaborador_branch_uid = b.branch_uid
            inner join tweeks.tbranch tb on b.branch_tbranch_id = tb.tbranch_id
            inner join tweeks.espaco e on b.branch_uid = e.espaco_branch_uid
              and e.espaco_id = b.branch_main_workspace
            inner join auth.colaborador cmain on b.branch_uid = cmain.colaborador_branch_uid
              and cmain.colaborador_id = b.branch_main_user
            left join __clusters _clus on _clus.cluster_path = b.branch_path
              and ( b.branch_clusters is null or _clus.cluster_identifier = any( b.branch_clusters ) )
          where cauth.colaborador_id = _auth.colaborador_id
          group by
            cauth.colaborador_id,
            b.branch_uid,
            e.espaco_id,
            cmain.colaborador_id,
            tb.tbranch_id
      ) select to_jsonb( _b )
        from __branch _b;

  end if;
end;
$$;

create or replace function tweeks.___override_auth_funct_load_grants( args jsonb )
returns setof jsonb language plpgsql as $$
declare
  /**
    arg_colaborador_id: UID,
    arg_espaco_auth?: UID
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  _branch tweeks.branch;
  _adminMenus jsonb;
begin
  _branch := tweeks.__get_branch( tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth ));

  _adminMenus := _branch.branch_grants->'menu';

  if _branch.branch_uid is null then
    _adminMenus := to_jsonb(array(
      select me.menu_id
        from auth.menu me
        where me.menu_codigo in ( 'maguita.colaboradores', 'maguita.definicao' )
    ));
  end if;

  return query select *
    from auth.funct_load_grants( jsonb_build_object(
      'colaborador_id', arg_colaborador_id,
      'menus', _adminMenus
    ));
end;
$$;

