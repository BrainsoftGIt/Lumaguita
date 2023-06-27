
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