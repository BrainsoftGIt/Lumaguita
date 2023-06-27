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
  -- Quando o filtro não for expecificado carregar todos os menus
  arg_allmenu := coalesce( arg_allmenu, true );


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
      order by me.menu_position
  ;
end;
$$;

create or replace function auth.funct_reg_acesso(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa funcao serve para dar acesse de um menu ao um colaborador
    -- Para dar acess o colaborador não pode ter previamente o acesso ao menu
    args := {
      arg_colaborador_id: ID,
      arg_colaborador_propetario: ID,
      arg_menu_list: [
        ID, ID, ID
      ]
    }
      -- arg_colaborador_id corresponde ao colaborador que esta a definir os previlegio de acesso
      -- arg_colaborador_propetario corresponde ao colaborador que tera o acesso definido
      -- arg_menu_ids corresponde a lista de identificadores do menus que o colaborador tera acesso
   */

  arg_colaborador_id uuid          := args->>'arg_colaborador_id';
  arg_colaborador_propetario uuid  := args->>'arg_colaborador_propetario';
  arg_menu_list int2[]                := array( select jsonb_array_elements_text( args->'arg_menu_list' )::int2 );

  arg_acesso_lista auth.acesso[];

  _const map.constant;
begin

    _const := map.constant();

  -- Revogar os menus que o colaborador tinha acesso anteriormente mas atualmente já nao os têm
  -- São menus que aperecem no acesso ativo mas nao aperencem na nova lista de menus a ser dado ao colaborador
  update auth.acesso
    set acesso_estado = _const.acesso_estado_fechado,
        acesso_dataatualizacao = current_timestamp,
        acesso_colaborador_atualizacao = arg_colaborador_id
    where acesso_estado = _const.acesso_estado_ativo
      and acesso_colaborador_propetario = arg_colaborador_propetario
      and acesso_menu_id != all( arg_menu_list )
  ;

  -- Registrar para o colaborador apenas menus listado na lista que estão em faltas
  insert into auth.acesso(
    acesso_menu_id,
    acesso_colaborador_propetario,
    acesso_colaborador_id
  ) select
      me.menu_id,
      arg_colaborador_propetario,
      arg_colaborador_id
    from unnest( arg_menu_list ) un ( menu_id )
      inner join auth.menu me on un.menu_id = me.menu_id
      left join auth.acesso ac on me.menu_id = ac.acesso_menu_id
        and ac.acesso_estado = _const.acesso_estado_ativo
        and ac.acesso_colaborador_propetario = arg_colaborador_propetario
    where ac.acesso_id is null
  ;

  -- Obter todos os acessos ativos para esse colaborador
  select array_agg( ac ) into arg_acesso_lista
    from auth.acesso ac
    where ac.acesso_colaborador_propetario = arg_colaborador_propetario
      and ac.acesso_estado = _const.acesso_estado_ativo
  ;

  return lib.result_true(
    jsonb_build_object(
      'acesso', arg_acesso_lista
    )
  );

end;
$$;

alter table auth.colaborador alter colaborador_nif drop not null;

create or replace function tweeks.funct_reg_colaborador(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para cadastra novos colaboradores
    Ao cadastar o colaborador a senha é atribuida automaticamente em um random
    E gerado tambem um token que devera ser enviado pela aplicao ao email do colaborador cadastrado
    O email e o NIF tem que ser unico
    args := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_espaco : [
        { arg_espaco_id: ID }
      ]
      arg_colaborador_email: EMAIL,
      arg_colaborador_nome: NOME,
      arg_colaborador_apelido: APELIDO,
      arg_colaborador_nif: NIF,
      arg_colaborador_datanascimento: DATA,
      arg_colaborador_ficha: FICHA,
      arg_colaborador_foto: FICHA,
      arg_tsexo_id: ID,
      arg_colaborador_senha: DEFAULT_SENHA_IF_EXIST,
      arg_colaborador_pin: DEFAULT_PIN_IF_SET,
      arg_branch_uid: UUID
    }

   */
  arg_branch_uid uuid                       := args->>'arg_branch_uid';
  arg_colaborador_id uuid                   := args->>'arg_colaborador_id';
  arg_espaco_auth uuid                      := args->>'arg_espaco_auth';
  arg_colaborador_email character varying   := args->>'arg_colaborador_email';
  arg_colaborador_nome character varying    := args->>'arg_colaborador_nome';
  arg_colaborador_apelido character varying := args->>'arg_colaborador_apelido';
  arg_colaborador_nif character varying     := args->>'arg_colaborador_nif';
  arg_colaborador_datanascimento date       := args->>'arg_colaborador_datanascimento';
  arg_colaborador_ficha jsonb               := args->>'arg_colaborador_ficha';
  arg_colaborador_foto varchar               := args->>'arg_colaborador_foto';
  arg_tsexo_id int2                         := args->>'arg_tsexo_id';
  arg_colaborador_token text;
  arg_menu_list jsonb                       := args->>'arg_menu_list';
  arg_colaborador_pin varchar               := args->>'arg_colaborador_pin';
  arg_colaborador_senha varchar             := args->>'arg_colaborador_senha';


  _const map.constant;
  _colaborador auth.colaborador;
  _res lib.result;

begin
    _const := map.constant();
  -- normalizar os dados do colaborador
  arg_colaborador_email := lower( lib.str_normalize( arg_colaborador_email ) );
  arg_colaborador_nif := lower( lib.str_normalize( arg_colaborador_nif ) );
  arg_colaborador_nome := lib.str_normalize( arg_colaborador_nome );
  arg_colaborador_apelido := lib.str_normalize( arg_colaborador_apelido );

  -- As informacoes do tipo texto tem que estar normalizados
  if arg_colaborador_email is null then
    return lib.result_false( '@auth.colaborador.invalid-mail' );
  end if;

  if arg_colaborador_nome is null then
    return lib.result_false( '@auth.colaborador.invalid-name' );
  end if;

  -- Garantir que nao exista o  NIF
  if (
    select count( * )
      from auth.colaborador co
      where co.colaborador_email =  arg_colaborador_email
  ) > 0 then
    return lib.result_false( '@auth.colaborador.email-exist' );
  end if;

  -- Garantir que o nif seja unico
  if (
    select count( * )
      from auth.colaborador co
      where co.colaborador_nif = arg_colaborador_nif
  ) > 0 then
    return lib.result_false( '@auth.colaborador.nif-exist' );
  end if;

  insert into auth.colaborador(
    colaborador_colaborador_id,
    colaborador_email,
    colaborador_nome,
    colaborador_apelido,
    colaborador_nif,
    colaborador_datanascimento,
    colaborador_foto,
    colaborador_tsexo_id,
    colaborador_espaco_auth,
    colaborador_branch_uid
  ) values (
    arg_colaborador_id,
    arg_colaborador_email,
    arg_colaborador_nome,
    arg_colaborador_apelido,
    arg_colaborador_nif,
    arg_colaborador_datanascimento,
    arg_colaborador_foto,
    arg_tsexo_id,
    arg_espaco_auth,
    arg_branch_uid
  ) returning * into _colaborador;

  perform auth.funct_reg_acesso(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', _colaborador.colaborador_id,
      'arg_menu_list', arg_menu_list
    )
  );

  perform tweeks.funct_reg_trabalha(
    jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', _colaborador.colaborador_id,
      'arg_espaco', args->'arg_espaco'
  ));

  _res := auth.funct_change_colaborador_accesso_reativar(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_reative', _colaborador.colaborador_id,
      'arg_colaborador_senha', arg_colaborador_senha,
      'arg_colaborador_pin', arg_colaborador_pin
    )
  );

  return lib.result_true(
    jsonb_build_object(
      'colaborador', lib.jsonb_values(
          to_jsonb( _colaborador ),
          'colaborador_id',
          'colaborador_tsexo_id',
          'colaborador_email',
          'colaborador_nif',
          'colaborador_nome',
          'colaborador_apelido',
          'colaborador_datanascimento',
          'colaborador_ficha',
          'colaborador_dataultimaatualizacasenha',
          'colaborador_accesso',
          'colaborador_estado',
          'colaborador_dataregisto'
        )
    ) || _res.message
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;

drop function if exists tweeks.funct_load_colaborador(filter jsonb);
create or replace function tweeks.funct_load_colaborador(filter jsonb)
    returns setof jsonb
    language plpgsql
as
$$
declare
    /**
      Essa função sere para carregar os colaborador apartir dos filtros expecificados
      filetr := {
        arg_espaco_auth: ID
      }
     */
    arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
    arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
    _const map.constant;
begin
    _const :=  map.constant();

    return query with
        __espacos as (
            select
                   e.espaco_id,
                   e.espaco_nivel,
                   e.espaco_nome,
                   tr.trabalha_colaborador_proprietario
               from tweeks.espaco e
                  inner join tweeks.trabalha tr on e.espaco_id = tr.trabalha_espaco_destino
                    and tr.trabalha_estado = _const.maguita_trabalha_estado_ativo
                where e.espaco_estado = _const.maguita_espaco_estado_ativo
        ), __colaborador as(
            select
                co.colaborador_id,
                co.colaborador_nome,
                co.colaborador_apelido,
                co.colaborador_email,
                co.colaborador_estado,
                co.colaborador_tipo,
                auth._colaborador_estado_desc( co.colaborador_estado ) as colaborador_estado_desc,
                co.colaborador_accesso,
                auth._colaborador_accesso_desc( co.colaborador_accesso ) as colaborador_accesso_desc,
                co.colaborador_foto,
                s2.tsexo_id,
                s2.tsexo_nome,
                s2.tsexo_codigo,
                co.colaborador_datanascimento,
                co.colaborador_nif,
                co.colaborador_dataregisto,
                co.colaborador_espaco_auth,
                min( e.espaco_nivel ) as espaco_minnivel,
                max( e.espaco_nivel ) as espaco_maxnivel,
                jsonb_agg( to_jsonb( e ) ) as colaborador_espacotrabalha,
                array_agg( e.espaco_id )||co.colaborador_espaco_auth as espacos
              from auth.colaborador co
                left join auth.tsexo s2 ON co.colaborador_tsexo_id = s2.tsexo_id
                left join __espacos e on co.colaborador_id = e.trabalha_colaborador_proprietario
              where co.colaborador_tipo in ( _const.colaborador_tipo_user, _const.colaborador_tipo_user_master )
                and ( co.colaborador_estado = _const.colaborador_estado_ativo or co.colaborador_tipo = _const.colaborador_tipo_user_master )
              group by co.colaborador_id,
                s2.tsexo_id
        )  select to_jsonb( co )
          from __colaborador co
          where arg_espaco_auth = any ( co.espacos )
        order by
            case
              when co.colaborador_espaco_auth = arg_espaco_auth then 1
              else 2
            end,
            espaco_minnivel,
            case
                when co.colaborador_accesso = _const.colaborador_accesso_ativo then 1
                when co.colaborador_accesso = _const.colaborador_accesso_pendente then 2
                when co.colaborador_accesso = _const.colaborador_accesso_fechado then 3
            end,
            co.colaborador_nome,
            co.colaborador_apelido

    ;
end;
$$;


drop function auth.funct_change_colaborador_accesso_reativar(args jsonb);
create or replace function auth.funct_change_colaborador_accesso_reativar(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
    /**
      Essa função serve para reativar um colaborador
        * Na reativação do colaborador sera gerado um token de ativação

      args := {
        arg_colaborador_id: ID,
        arg_colaborador_reative: ID,
        arg_colaborador_senha: SENHA,
        arg_colaborador_pin: PIN,
        arg_start:BOOLEAN
      }
      -- argumentos
        -- arg_colaborador_id corresponde ao colaborador logado no sistema que esta efetuar a operação de ativação
        -- arg_colaborador_reative corresponde ao colaborador que tera o acesso reativo no sistema.
     */

    arg_colaborador_id uuid := args->>'arg_colaborador_id';
    arg_colaborador_reative uuid := args->>'arg_colaborador_reative';
    arg_colaborador_senha varchar default args->>'arg_colaborador_senha';
    arg_colaborador_pin varchar default args->>'arg_colaborador_pin';
    arg_start boolean := args->>'arg_start';

    arg_token_senha boolean default false;
    arg_token_pin boolean default false;
    _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_reative );
    _const map.constant;
begin
    _const := map.constant();
    arg_start := coalesce( arg_start, false );

    -- Um colaborador já ativo não pode ser novamente reativado
    if _colaborador.colaborador_estado != _const.colaborador_estado_ativo then
        return lib.result_false( '@auth.colaborador.active-active' );
    end if;

    if arg_start and arg_colaborador_senha is not null then
      _colaborador.colaborador_senhamodo := _const.colaborador_chavemodo_utilizador;

    elsif arg_start and arg_colaborador_pin is not null then
      _colaborador.colaborador_pinmodo := _const.colaborador_chavemodo_utilizador;

    elseif not arg_start then
      _colaborador.colaborador_senhamodo := _const.colaborador_chavemodo_padrao;
      if arg_colaborador_senha is null then
          arg_token_senha := true;
          _colaborador.colaborador_senhamodo := _const.colaborador_chavemodo_gerado;
          arg_colaborador_senha := auth._colaborador_generate_senha_token();
      end if;

      _colaborador.colaborador_pinmodo := _const.colaborador_chavemodo_padrao;
      if arg_colaborador_pin is null then
        _colaborador.colaborador_pinmodo := _const.colaborador_chavemodo_gerado;
        arg_token_pin := true;
        arg_colaborador_pin := auth._colaborador_generate_pin_token();
      end if;
    end if;

    if arg_start then
      _colaborador.colaborador_token := null;
      _colaborador.colaborador_tokenlimit := null;
      _colaborador.colaborador_accesso := _const.colaborador_accesso_ativo;
    else
      _colaborador.colaborador_accesso := _const.colaborador_accesso_pendente;
    end if;

    update auth.colaborador
      set colaborador_accesso = _colaborador.colaborador_accesso,
        colaborador_estado = _const.colaborador_estado_ativo,

        colaborador_senhamodo = _colaborador.colaborador_senhamodo,
        colaborador_senha = case
            when arg_colaborador_senha is not null then auth._encrypt( arg_colaborador_senha )
            else colaborador_senha
          end,

        colaborador_pinmodo = _colaborador.colaborador_pinmodo,
        colaborador_pin = case
            when arg_colaborador_pin is not null then auth._encrypt( arg_colaborador_pin )
            else colaborador_pin
          end,

        colaborador_dataultimaatualizacasenha = now(),
        colaborador_token = _colaborador.colaborador_token,
        colaborador_tokenlimit = _colaborador.colaborador_tokenlimit,

        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_dataatualizacao = now()
      where colaborador_id = arg_colaborador_reative
      returning * into _colaborador
    ;

    return lib.result_true(
      jsonb_build_object(
        'colaborador_token', case
          when arg_token_senha then auth._colaborador_token_encrypt( _colaborador )
        end,

        'colaborador_pin', case
          when arg_token_pin then arg_colaborador_pin
        end
      )
    );
end;
$$;

update auth.menu set menu_link = null where menu_id = 71;

create or replace function auth.funct_change_colaborador_estado_disable( args jsonb )
returns lib.result
language plpgsql as $$
declare
    /**
    Essa função serve para disativar o estaod de um dado colaborador no sistema
    args := {
      arg_colaborador_id: ID,
      arg_colaborador_disable: ID
    }
    -- argumentos
      arg_colaborador_id corresponde ao colaborador logado no sistema que esta a efetuar a operação de desativação
      arg_colaborador_disable corresponde ao colaborador que tera o acesso desabilitado do sistema
   */

    arg_colaborador_id uuid := args->>'arg_colaborador_id';
    arg_colaborador_disable uuid := args->>'arg_colaborador_disable';
    _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_disable );
    _const map.constant;
begin

   -- Um colaborador master não pode ser desabilitado do sistema
  if _colaborador.colaborador_tipo = _const.colaborador_tipo_user_master then
    return lib.result_false( 'auth.colaborador.disable-master' );
  end if;

  update auth.colaborador
    set colaborador_accesso = _const.colaborador_accesso_fechado,
        colaborador_estado = _const.colaborador_estado_fechado,
        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_dataatualizacao = current_timestamp
    where colaborador_id = arg_colaborador_disable
    returning * into _colaborador;

  return lib.result_true(
    jsonb_build_object(
      'colaborador', _colaborador
    )
  );
end;
$$;

drop function auth.funct_autenticacao(args jsonb);
create function auth.funct_autenticacao(args jsonb)
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
    select  jsonb_agg( to_jsonb( ac ) || to_jsonb( me ) order by me.menu_position asc ) into arg_acessos
    from auth.acesso ac

             inner join auth.menu me on ac.acesso_menu_id = me.menu_id
    where ac.acesso_estado = _const.acesso_estado_ativo
      and ac.acesso_colaborador_propetario = _data.colaborador_id
    ;

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
  _const map.constant;
begin
  _const := map.constant();

  select * into _auth
    from auth.funct_autenticacao( args );

  -- Quando o colaborador tiver accesso
  if _auth.colaborador_id is not null then
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

select * from tweeks.___override_auth_funct_autenticacao('{
  "arg_auth_name":"email",
  "arg_auth_value":"juliarocha@hotmail.com",
  "arg_auth_method":"senha",
  "arg_auth_key": "1234"
}');


create or replace function tweeks.funct_change_colaborador(
  args jsonb
) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para aatualizar as informações do colaborador
    args := {
      arg_espaco_auth: ID
      arg_espaco: [ ]
      arg_colaborador_id: ID,
      arg_colaborador_editar: ID,
      arg_colaborador_email: MAIL,
      arg_colaborador_nome: NOME,
      arg_colaborador_apelido: APELIDO,
      arg_colaborador_datanascimento: DATA,
      arg_colaborador_nif: NIF,
      arg_colaborador_ficha: FICHA,
      arg_colaborador_foto: FICHA,
      arg_tsexo_id: SEXO
    }
    arg_colaborador_editar corresponde ao id do colaborador que sera atualizado
    arg_colaborador_id corresponde ao id do colaborador que esata efetuar a atualização
  */

  arg_colaborador_id uuid not null       := args->>'arg_colaborador_id';
  arg_colaborador_editar uuid not null   := args->>'arg_colaborador_editar';
  arg_espaco_auth uuid not null             := args->>'arg_espaco_auth';

  arg_colaborador_email character varying   := args->>'arg_colaborador_email';
  arg_colaborador_nome character varying    := args->>'arg_colaborador_nome';
  arg_colaborador_apelido character varying := args->>'arg_colaborador_apelido';
  arg_colaborador_datanascimento date       := args->>'arg_colaborador_datanascimento';
  arg_colaborador_nif character varying     := args->>'arg_colaborador_nif';
  arg_colaborador_ficha jsonb               := args->>'arg_colaborador_ficha';
  arg_colaborador_foto varchar               := args->>'arg_colaborador_foto';
  arg_tsexo_id int2                         := args->>'arg_tsexo_id';
  arg_espaco jsonb                      := args->'arg_espaco';

  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_editar );
  _const map.constant := map.constant();
begin

  -- Tanto o nif, quanto o email deve ser único na base de dados
  arg_colaborador_email := lib.str_normalize( lower( arg_colaborador_email ) );
  arg_colaborador_nif := lib.str_normalize( lower( arg_colaborador_nif ) );

  -- Quando existir email e estiver associado ao utro colaborador então
  if arg_colaborador_email is not null  and (
    select count( * )
      from auth.colaborador
      where colaborador_email = arg_colaborador_email
        and colaborador_id != _colaborador.colaborador_id
  ) > 0 then
    return lib.result_false( '@auth.colaborador.email-exist' );
  end if;

  -- Quando existir um colaborador o nif expecificado
  if arg_colaborador_nif is not null is not null and  (
    select count( * ) > 0
      from auth.colaborador co
      where co.colaborador_nif = arg_colaborador_nif
        and co.colaborador_id != _colaborador.colaborador_id
  ) then
    return lib.result_false( '@auth.colaborador.nif-exist' );
  end if;

  -- A atualização deve ser feita apenas quando o novo valor vier nulo
  update auth.colaborador
    set colaborador_email = coalesce( arg_colaborador_email, colaborador_email ),
        colaborador_nome = coalesce( lib.str_normalize( arg_colaborador_nome ), colaborador_nome ),
        colaborador_apelido = coalesce( lib.str_normalize( arg_colaborador_apelido ), colaborador_apelido ),
        colaborador_tsexo_id = coalesce( arg_tsexo_id, colaborador_tsexo_id ),
        colaborador_datanascimento = coalesce( arg_colaborador_datanascimento, colaborador_datanascimento ),
        colaborador_nif = coalesce( arg_colaborador_nif, colaborador_nif ),
        colaborador_foto = coalesce( arg_colaborador_foto, colaborador_foto ),
        colaborador_ficha = coalesce( arg_colaborador_ficha, colaborador_ficha ),
        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_dataatualizacao = now()
    where colaborador_id = _colaborador.colaborador_id
    returning * into _colaborador
  ;

  perform tweeks.funct_reg_trabalha(
    jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', _colaborador.colaborador_id,
      'arg_espaco', arg_espaco
    )
  );

  return lib.result_true();
end;
$$;


create or replace function tweeks.funct_reg_trabalha(args jsonb)
returns lib.result
    language plpgsql
as
$$
declare
  /** Essa função serve para registar os locas que um colaborador pode trabalhar
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_colaborador_propetario: ID,
      arg_espaco : [
        { arg_espaco_id: ID }
      ]
    }
  */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid  not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );
  arg_colaborador_propetario uuid default args->>'arg_colaborador_propetario';
  arg_espaco uuid[ ] not null default array ( select ( el.doc->>'arg_espaco_id' )::uuid from jsonb_array_elements( args->'arg_espaco' ) el ( doc ) );
  _const map.constant;

begin
  _const := map.constant();

  -- Fechar todos os espaços em que o colaborador não vai mais trabalhar
  update tweeks.trabalha
    set trabalha_estado = _const.maguita_trabalha_estado_fechado,
        trabalha_colaborador_atualizacao = arg_colaborador_id,
        trabalha_dataatualizacao = current_timestamp
    where trabalha_estado = _const.maguita_trabalha_estado_ativo
      and trabalha_colaborador_proprietario = arg_colaborador_propetario
      and trabalha_espaco_auth = any( arg_espaco_child )

  ;

  insert into tweeks.trabalha (
    trabalha_colaborador_id,
    trabalha_colaborador_proprietario,
    trabalha_perfil_id,
    trabalha_espaco_destino,
    trabalha_espaco_auth
  ) select arg_colaborador_id,
      arg_colaborador_propetario,
      null,
      es.arg_espaco_id,
      arg_espaco_auth
    from unnest( arg_espaco ) es ( arg_espaco_id )
  ;

  return true ? jsonb_build_object(
    'trabalha', array(
      select tr
        from tweeks.trabalha tr
        where tr.trabalha_estado = _const.maguita_trabalha_estado_ativo
          and tr.trabalha_colaborador_proprietario = arg_colaborador_propetario
    )
  );
end;
$$;



create or replace function tweeks.___override_auth_funct_load_menu( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      arg_branch_uid: UID
    }
   */
  arg_branch_uid uuid default args->>'arg_branch_uid';
  _branch tweeks.branch;
  _menus int2[];
begin
  _branch := tweeks.__get_branch( arg_branch_uid );
  _menus := array( select e.text from jsonb_array_elements_text( _branch.branch_grants->'menu') e( text ) );
--   raise exception '%', _menus;

  return query with
    __menu as (
      select *
        from auth.funct_load_menu( args )
        where menu_id = any( _menus )
          or _branch is null
    ) select to_jsonb( _m )
      from __menu _m;
end;
$$;

with
__menu as (
      select *
        from auth.funct_load_menu( '{}' )
        where menu_id = any( array ( select e.text::int2 from jsonb_array_elements_text( (tweeks.__get_branch('cd84b50b-0626-4979-a089-2abfa72f9b68')).branch_grants->'menu' ) e ( text) )  )
    ) select to_jsonb( _m )
      from __menu _m;

select *
from auth.funct_load_menu( null );


select *
  from tweeks.___override_auth_funct_load_menu('{"arg_branch_uid":"cd84b50b-0626-4979-a089-2abfa72f9b68"}')




