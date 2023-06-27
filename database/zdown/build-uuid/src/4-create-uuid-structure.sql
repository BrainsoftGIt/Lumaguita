--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-05-30 12:55:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--

--
-- TOC entry 12 (class 2615 OID 22791)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;



--
-- TOC entry 7 (class 2615 OID 22793)
-- Name: lib; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA lib;


--
-- TOC entry 11 (class 2615 OID 22794)
-- Name: map; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA map;


--
-- TOC entry 6 (class 2615 OID 22795)
-- Name: rule; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA rule;


--
-- TOC entry 5 (class 2615 OID 22796)
-- Name: tweeks; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA tweeks;


--
-- TOC entry 2 (class 3079 OID 22797)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4417 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 1063 (class 1247 OID 22806)
-- Name: exception; Type: TYPE; Schema: lib; Owner: -
--

CREATE TYPE lib.exception AS (
	errcode character varying,
	message text,
	hint text,
	detail text,
	context text,
	exception boolean
);


--
-- TOC entry 1066 (class 1247 OID 22809)
-- Name: result; Type: TYPE; Schema: lib; Owner: -
--

CREATE TYPE lib.result AS (
	result boolean,
	message jsonb
);


--
-- TOC entry 1069 (class 1247 OID 22812)
-- Name: constant; Type: TYPE; Schema: map; Owner: -
--

CREATE TYPE map.constant AS (
	acesso_estado_fechado smallint,
	trabalha_estado_ativo smallint,
	colaborador_tipo_system smallint,
	colaborador_estado_ativo smallint,
	perfil_estado_fechado smallint,
	menu_estado_ativo smallint,
	perfil_estado_ativo smallint,
	privilegio_estado_ativo smallint,
	privilegio_estado_fechado smallint,
	colaborador_tipo_user_master smallint,
	trabalha_estado_fechado smallint,
	acesso_estado_ativo smallint,
	colaborador_estado_fechado smallint,
	colaborador_accesso_ativo smallint,
	autenticacao_estado_ativo smallint,
	autenticacao_estado_fechado smallint,
	colaborador_accesso_fechado smallint,
	menu_maxchildren smallint,
	menu_estado_fechado smallint,
	colaborador_tipo_user smallint,
	colaborador_token_limit interval,
	colaborador_token_length smallint,
	colaborador_accesso_pendente smallint,
	autenticacao_chave_length smallint,
	colaborador_system_data uuid,
	colaborador_system_support uuid,
	tespaco_venda smallint,
	tespaco_armazem smallint,
	classe_estado_ativo smallint,
	classe_estado_fechado smallint,
	fornecedor_estado_ativo smallint,
	fornecedor_estado_fechado smallint,
	espaco_estado_ativo smallint,
	espaco_estado_fechado smallint,
	artigo_estado_ativo smallint,
	artigo_estado_fechado smallint,
	item_estado_ativo smallint,
	dispoe_estado_ativo smallint,
	dispoe_estado_fechado smallint,
	agrega_estado_aberto smallint,
	agrega_estado_fechado smallint,
	agrega_estado_anulado smallint,
	agrega_estado_canselado smallint,
	stock_estado_ativo smallint,
	stock_estado_fechado smallint,
	entrada_estado_ativo smallint,
	entrada_estado_anulado smallint,
	transferencia_estado_ativo smallint,
	transferencia_estado_aanulado smallint,
	acerto_estado_ativo smallint,
	acerto_estado_anulado smallint,
	precario_estado_ativo smallint,
	precario_estado_fechado smallint,
	cambio_estado_ativo smallint,
	cambio_estado_fechado smallint,
	caixa_estado_ativo smallint,
	caixa_estado_fechado smallint,
	posto_estado_aberto smallint,
	posto_estado_fechado smallint,
	posto_estado_encerado smallint,
	conta_estado_aberto smallint,
	conta_estado_fechado smallint,
	conta_estado_anulado smallint,
	conta_estado_pago smallint,
	venda_estado_aberto smallint,
	venda_estado_fechado smallint,
	venda_estado_anulado smallint,
	venda_estado_canselado smallint,
	espaco_default smallint,
	amortizacao_estado_ativo smallint,
	item_estado_fechado smallint,
	tpaga_cash smallint,
	tpaga_deposito smallint,
	tpaga_transferencia smallint,
	tpaga_cheque smallint,
	movimento_estado_ativo smallint,
	movimento_estado_anulado smallint,
	movimento_estado_canselado smallint,
	toperacao_acerto smallint,
	toperacao_venda smallint,
	toperacao_transferencia smallint,
	toperacao_entrada smallint,
	classe_itemextra uuid,
	colaborador_chavemodo_padrao smallint,
	colaborador_chavemodo_gerado smallint,
	colaborador_chavemodo_utilizador smallint,
	cambio_estado_anulado smallint,
	currency_std smallint,
	tmovimento_credito smallint,
	tmovimento_debito smallint,
	transacao_estado_ativo smallint,
	toperacao_movimento smallint,
	toperacao_pagamento smallint,
	toperacao_classe_stock smallint,
	toperacao_classe_montante smallint,
	menu_raizcomplete character varying,
	venda_estadopreparacao_pendente smallint,
	venda_estadopreparacao_preparado smallint,
	mesa_estado_disponivel smallint,
	mesa_estado_ocupado smallint,
	mesa_estado_desativado smallint,
	tlink_artigo smallint,
	tlink_paguina smallint,
	tlink_associacao smallint,
	link_estado_fechado smallint,
	link_estado_ativo smallint,
	link_estado_associacao smallint,
	tposto_venda smallint,
	tposto_cobranca smallint,
	tposto_tudo smallint,
	taplicar_adicionar smallint,
	taplicar_retirar smallint,
	imposto_estado_ativo smallint,
	imposto_estado_fechado smallint,
	taxa_estado_ativo smallint,
	taxa_estado_fechado smallint,
	impostovenda_estado_ativo smallint,
	impostovenda_estado_fechado smallint,
	tipoimposto_estado_ativo smallint,
	tipoimposto_estado_fechado smallint
);


--
-- TOC entry 349 (class 1255 OID 22813)
-- Name: _autenticacao_chave_generate(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._autenticacao_chave_generate() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para gerar a chave de atutenticação para uma autenticação
   */
  arg_autenticacao_chave character varying;
  _const map.constant;
begin
  _const := map.constant();

  <<random_key>> -- gerar uma chave unica para a proxima autenticação
  while arg_autenticacao_chave is null loop
    arg_autenticacao_chave := lib.dset_random_text( _const.autenticacao_chave_length );
    if (
      select count( * ) > 0
        from auth.autenticacao au
        where au.autenticacao_chave = arg_autenticacao_chave
    ) then
      arg_autenticacao_chave := null;
    end if;
  end loop;

  return arg_autenticacao_chave;
end;
$$;


--
-- TOC entry 350 (class 1255 OID 22814)
-- Name: _colaborador_accesso_desc(smallint); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._colaborador_accesso_desc( arg_colaborador_acesso smallint )
RETURNS character varying
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para obter a descrição do accesso colaborador
   */
  _const map.constant := map.constant();
begin

  if arg_colaborador_acesso = _const.colaborador_accesso_ativo then return 'Ativo';
  elseif arg_colaborador_acesso = _const.colaborador_accesso_pendente then return 'Pendente';
  elseif arg_colaborador_acesso = _const.colaborador_accesso_fechado then return 'Desativo';
  end if;
end;

$$;


--
-- TOC entry 351 (class 1255 OID 22815)
-- Name: _colaborador_estado_desc(smallint); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._colaborador_estado_desc(arg_colaborador_estado smallint) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para devolver os estados do colaborador
   */
  _const map.constant;
begin
  _const := map.constant();
  if arg_colaborador_estado = _const.colaborador_estado_ativo then return 'Ativo'   ; end if;
  if arg_colaborador_estado = _const.colaborador_estado_fechado then return 'Desativo'; end if;

end;
$$;


--
-- TOC entry 352 (class 1255 OID 22816)
-- Name: _colaborador_generate_pin_token(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._colaborador_generate_pin_token() RETURNS character varying
    LANGUAGE sql
    AS $$
  -- gerar um pin automatico
  select to_char( ( random() * 9999 ), '0000' )
$$;


--
-- TOC entry 353 (class 1255 OID 22817)
-- Name: _colaborador_generate_senha_token(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._colaborador_generate_senha_token() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
      /**
        Essa função serve para criar um token novo
       */
      token character varying;
    begin
      loop
        token := lib.dset_random_text( 16 );
        if (
          select count( * )
            from auth.colaborador co
            where co.colaborador_token = token
        ) = 0 then
          return token;
        end if;
      end loop;
    end;
$$;


--
-- TOC entry 354 (class 1255 OID 22818)
-- Name: get(name); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.get(arg_constant_name name) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
      Essa função serve para devolver o valor especifico de uma constante
   */
begin
  return (
    select cv.constvalue_value
      from map.constvalue cv
      where cv.constvalue_name = arg_constant_name
  );
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 22819)
-- Name: colaborador; Type: TABLE; Schema: auth; Owner: -
--
CREATE or replace FUNCTION lib.to_uuid(anyelement) RETURNS uuid
    LANGUAGE sql IMMUTABLE STRICT
AS $_$
    select cast(lpad(to_hex( $1::int8 ), 32, '0') as uuid )
$_$;

CREATE TABLE auth.colaborador (
    colaborador_id uuid NOT NULL default gen_random_uuid(),
    colaborador_tsexo_id smallint,
    colaborador_colaborador_id uuid NOT NULL,
    colaborador_colaborador_atualizacao uuid DEFAULT NULL,
    colaborador_espaco_auth uuid NOT NULL,
    colaborador_nome character varying NOT NULL,
    colaborador_apelido character varying,
    colaborador_email character varying NOT NULL,
    colaborador_nif character varying NOT NULL,
    colaborador_datanascimento date,
    colaborador_senha character varying,
    colaborador_pin character varying,
    colaborador_pinmodo smallint,
    colaborador_senhamodo smallint,
    colaborador_accesso smallint DEFAULT (map.get('colaborador_accesso_pendente'::name))::smallint NOT NULL,
    colaborador_tipo smallint DEFAULT (map.get('colaborador_tipo_user'::name))::smallint NOT NULL,
    colaborador_foto character varying,
    colaborador_token character varying,
    colaborador_tokenlimit timestamptz,
    colaborador_dataultimaatualizacasenha timestamptz,
    colaborador_dataultimologin timestamptz,
    colaborador_ficha jsonb,
    colaborador_estado smallint DEFAULT (map.get('colaborador_estado_ativo'::name))::smallint NOT NULL,
    colaborador_dataregisto timestamptz DEFAULT current_timestamp NOT NULL,
    colaborador_dataatualizacao timestamptz,
    CONSTRAINT ck_colaborador_unique_super_master CHECK ((((colaborador_id) <> (colaborador_colaborador_id)) OR ((colaborador_id) = lib.to_uuid( 1 ))))
);


--
-- TOC entry 4418 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE colaborador; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.colaborador IS 'Entidade para armazenar os colaboradores';


--
-- TOC entry 4419 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_id IS 'Identificacao do colaborador';


--
-- TOC entry 4420 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_colaborador_id IS 'Identificacao do colaborador master';


--
-- TOC entry 4421 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_colaborador_atualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_colaborador_atualizacao IS 'Identificação do ultimo colaborador que modificou o registo';


--
-- TOC entry 4422 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_tsexo_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_tsexo_id IS 'Identificador do sexo do colaborador';


--
-- TOC entry 4423 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_nome; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_nome IS 'Corresponde ao nome do colaborador';


--
-- TOC entry 4424 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_apelido; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_apelido IS 'Corresponde ao apelido do colaborador';


--
-- TOC entry 4425 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_email IS 'Corresponde ao email único do colaborador';


--
-- TOC entry 4426 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_nif; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_nif IS 'Corresponde ao nif único do colaborador';


--
-- TOC entry 4427 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_datanascimento; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_datanascimento IS 'Corresponde a data do nascimento do colaborador';


--
-- TOC entry 4428 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_senha; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_senha IS 'Corresponde a senha do colaborador - É utilizado a função auth.encrypt( $passWord );';


--
-- TOC entry 4429 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_accesso; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_accesso IS 'Esse atributo indica o estado do acesso do colaborador ao sistema
<ul>
  <li> 2 - Pendente | O prochimo acesso ao sistema devera ser por meio do token e o colaborador sera obrigatorio a mudar de senha</li>
  <li> 1 - Ativo | O colaborador pode entrar e sair do sistema livrimente</li>
  <li> 0 - Fechado | O colaborador não pode mais entrar no sistema </li>
</ul>';


--
-- TOC entry 4430 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_tipo; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_tipo IS 'Indica o tipo do colaborador
<ul>
  <li> 0 - Sistema </li>
  <li> 1 - Utilizador normal </li>
  <li> 2 - Super utilizador </li>
</ul>';


--
-- TOC entry 4431 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_foto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_foto IS 'Corresponde a fotografia do colaborador';


--
-- TOC entry 4432 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_token; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_token IS 'Corresponde ao token gerado para a primeira autenticação do colaborador no sistema ou a recuperação da senha do mesmo.';


--
-- TOC entry 4433 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_tokenlimit; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_tokenlimit IS 'A data limite do token (indica o tempo de validade to token de ativação)';


--
-- TOC entry 4434 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_dataultimaatualizacasenha; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_dataultimaatualizacasenha IS 'Indica a última data em que o a senha do colaborador foi atualizada';


--
-- TOC entry 4435 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_ficha; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_ficha IS 'A ficha do colaborador, serve para registar as informações do colaborador não planeada no momento do planejamento sem ter que mudar a estrutura da base de dados';


--
-- TOC entry 4436 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_estado IS 'Corresponde ao estado do colaborador na base de dados, diferente do acesso esse indica se o colaborador esta valido ou invalido no sistama
<br/> Os colaboradores invalidos (Desativos) não podem mais entrar no sistema muito menos aparecer nas listagem (excepto uma listagem expecifica para ver os colaboradores nessa situação)
<ul>
  <li> 1 - Ativo | O colaborador pode comportar livrimente no sistema</li>
  <li> 0 - Destivo | É como se o registro fosse eliminado do sistam</li>
</ul>';


--
-- TOC entry 4437 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_dataregisto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_dataregisto IS 'Corresponde a data em que o colaborador foi registrado no sistema';


--
-- TOC entry 4438 (class 0 OID 0)
-- Dependencies: 210
-- Name: COLUMN colaborador.colaborador_dataatualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.colaborador.colaborador_dataatualizacao IS 'Corresponde a última data em que o colaborador foi atualizado no sistema';


--
-- TOC entry 355 (class 1255 OID 22831)
-- Name: _colaborador_token_encrypt(auth.colaborador); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE or replace FUNCTION auth._colaborador_token_encrypt(_colaborador auth.colaborador) RETURNS character varying
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
    /**
      Essa função serve para criar o token de ativação para um colaborador
     */
  begin
    return auth._encrypt( coalesce( _colaborador.colaborador_token, '' ) )
      || auth._encrypt( coalesce( _colaborador.colaborador_email, '' ) )
      || auth._encrypt( _colaborador.colaborador_id::text )
      || auth._encrypt( _colaborador.colaborador_senha::text );
  end;

$$;


--
-- TOC entry 359 (class 1255 OID 22832)
-- Name: _encrypt(text); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._encrypt(word text) RETURNS character varying
    LANGUAGE plpgsql
    AS $_$
declare
  wordMd5 character varying default md5( word );
begin
  return md5(
      md5(
          wordMd5
          ||substring( wordMd5, 1, 20 )
          ||md5(
              md5( $$%#*//-+@$£€{}[]()?!&|\\:;,.^~ºª«»<>çáèíÒú$$ )
              || word
              || substring( wordMd5, 15, 28 )
              || substring( wordMd5, 13, 11 )
              || substring( wordMd5, 17, 20 )
              || substring( wordMd5, 7,  21 )
          )
      )
  );
end;
$_$;


--
-- TOC entry 360 (class 1255 OID 22833)
-- Name: _get_colaborador(integer); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE or replace FUNCTION auth._get_colaborador( arg_colaborador_id uuid ) RETURNS auth.colaborador
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para obter a instancia de um colaborador a partir do seu identificador único
   */
  _colaborador auth.colaborador;
begin

  select * into _colaborador
    from auth.colaborador co
    where co.colaborador_id = arg_colaborador_id
  ;
  return _colaborador;
end;
$$;


--
-- TOC entry 361 (class 1255 OID 22834)
-- Name: str_is_normalized(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE or replace FUNCTION lib.str_is_normalized(text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
declare
  /**
    Essa função serve para vefificar se um texto esta normalizado
   */
  arg_normalized text := lib.str_normalize( $1 );
begin
  if arg_normalized is null and $1 is not null then return false; end if;
  if arg_normalized != $1 then return false; end if;
  return true;
end;
$_$;


--
-- TOC entry 362 (class 1255 OID 22835)
-- Name: str_normalize(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.str_normalize(text text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para verificar se uma string esta normalizada (sem espacos desnecessarios)
   */
  new_text text;
begin
  new_text := trim( regexp_replace( text, '\s+', ' ', 'g') );
  if length( new_text ) = 0 then return null; end if;
  return new_text;
end;
$$;


--
-- TOC entry 211 (class 1259 OID 22836)
-- Name: perfil; Type: TABLE; Schema: auth; Owner: -
--

CREATE  TABLE auth.perfil (
    perfil_id uuid NOT NULL default public.uuid_generate_v4(),
    perfil_perfil_id uuid,
    perfil_colaborador_id uuid NOT NULL,
    perfil_colaborador_atualizacao uuid,
    perfil_nome character varying NOT NULL,
    perfil_codigo character varying  DEFAULT NULL::character varying,
    perfil_estado smallint DEFAULT (map.get('perfil_estado_ativo'::name))::smallint NOT NULL,
    perfil_dataregisto timestamptz DEFAULT now() NOT NULL,
    perfil_dataatualizacao timestamptz,
    CONSTRAINT ck_perfil_codigo CHECK ((lib.str_is_normalized((perfil_codigo)::text) AND ((perfil_codigo)::text = lib.str_normalize((perfil_codigo)::text)))),
    CONSTRAINT ck_perfil_nome_is_normalizedo CHECK (lib.str_is_normalized((perfil_nome)::text)),
    CONSTRAINT ck_perfil_nome_normalized CHECK (lib.str_is_normalized((perfil_nome)::text))
);


--
-- TOC entry 4439 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE perfil; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.perfil IS 'Essa entidade serve para armazenar os prefis para os colaboradores (um perfil indiga um agrupamento de menus)';


--
-- TOC entry 4440 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_id IS 'Identificador único do perfil';


--
-- TOC entry 4441 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_perfil_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_perfil_id IS 'Identificador do perfil parente';


--
-- TOC entry 4442 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_colaborador_id IS 'Identificador do colaborador responsável pela criação do prefil.';


--
-- TOC entry 4443 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_colaborador_atualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_colaborador_atualizacao IS 'Identificador do último colaborador responsavel pela atualização do perfil';


--
-- TOC entry 4444 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_nome; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_nome IS 'Corresponde ao nome do perfil';


--
-- TOC entry 4445 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_codigo; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_codigo IS 'Corresponde ao código do perfil (perfil com codigos são perfis padrão e não podem ser modificados nem atualizados)';


--
-- TOC entry 4446 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_estado IS 'Corresponde ao estado do perfil
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Desativo </li>
</ul>';


--
-- TOC entry 4447 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_dataregisto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_dataregisto IS 'Corresponde ao instante em que a inscrição foi cadastrado';


--
-- TOC entry 4448 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN perfil.perfil_dataatualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.perfil.perfil_dataatualizacao IS 'Corresponde ao último instante em que o perfil foi atualizado';


--
-- TOC entry 364 (class 1255 OID 22845)
-- Name: _get_perfil(smallint); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._get_perfil( arg_perfil_id uuid ) RETURNS auth.perfil
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para obter a instancia do perfil a partir do seu identificador único
   */
  _perfil auth.perfil;
begin

  select * into _perfil
    from auth.perfil pe
    where pe.perfil_id = arg_perfil_id
  ;

  return _perfil;

end;
$$;


--
-- TOC entry 378 (class 1255 OID 22846)
-- Name: _menu_create(character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._menu_create( arg_menu_codigo character varying, arg_menu_nome character varying, arg_menu_menu_codigo character varying DEFAULT NULL::character varying, arg_menu_link character varying DEFAULT NULL::character varying, arg_menu_icon character varying DEFAULT NULL::character varying) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
DECLARE
  /**
    Essa função serve para criar um novo menu
   */
  arg_menu_nivel int default 0;
  arg_menu_raiz character varying;
  arg_total_raiz int;
  _menu auth.menu;
  _menu_menu auth.menu;
  _const constant map.constant := map.constant();
BEGIN
  -- O codigo do menu deve ser unico
  if (
       select count(*)
       from  auth.menu m
       where lower(m.menu_codigo) = lower( arg_menu_codigo )
     ) > 0 then
    raise exception 'Já existe um menu com esse codigo';
  end if;

  -- O codigo do menu super tem de existir
  if arg_menu_menu_codigo is not null and (
    select count(*)
    from  auth.menu m
    where lower(m.menu_codigo) =  lower( arg_menu_menu_codigo )
  ) = 0 then
    raise exception 'Identificador do menu super não foi encontrado!';
  end if;

  if arg_menu_menu_codigo is not null then
    select * into _menu_menu
      from  auth.menu m
      where upper( m.menu_codigo ) = upper( arg_menu_menu_codigo )
    ;

    select count (*) into arg_total_raiz
      from  auth.menu me
      where me.menu_menu_id = _menu_menu.menu_id
    ;

    arg_menu_raiz := _menu_menu.menu_raiz||'.'||trim(to_char( arg_total_raiz, _const.menu_raizcomplete ));
    arg_menu_nivel := _menu_menu.menu_nivel +1;
  else
    select count (*) into arg_total_raiz
      from auth.menu me
      where me.menu_menu_id is null;

    -- Quando exeder a quantidade de sub menu maximo em um menu entao abortar a operacao emitindo uma message de eroo
    if arg_total_raiz > _const.menu_maxchildren then
      return lib.result_false(
          lib.message('max-submenu-exceeded')
      );
    END IF;
    arg_menu_raiz := trim(to_char(arg_total_raiz, _const.menu_raizcomplete));
  end if;

  insert into auth.menu(
    menu_menu_id,
    menu_nome,
    menu_link,
    menu_codigo,
    menu_nivel,
    menu_raiz
  ) values (
    _menu_menu.menu_id,
    arg_menu_nome,
    arg_menu_link,
    arg_menu_codigo,
    arg_menu_nivel,
    arg_menu_raiz
  ) returning * into _menu;

  perform  auth._menu_create_set_up();

  return lib.result_false(
      jsonb_build_object(
          'data', to_jsonb( _menu ),
          'text', 'success'
      )
  );

END;
$$;


--
-- TOC entry 379 (class 1255 OID 22847)
-- Name: _menu_create_set_up(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._menu_create_set_up() RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para estruturar os  eus depois que o novo menu é registrado
   */
  _menu record;
  icount int default 0;
begin
  for _menu in (
    select *
    from auth._menu_load_structure( )
  ) loop
    update auth.menu cur
    set menu_children = (
      select count( * )
      from auth.menu mm
      where mm.menu_raiz like cur.menu_raiz||'.%'
    ),
      menu_directchildern = (
        select count( * )
        from auth.menu mm
        where mm.menu_menu_id = cur.menu_id
      ),
      menu_maxnode = (
        select length( replace( substr( mm.menu_raiz, length( cur.menu_raiz )+1, length( mm.menu_raiz ) ), '.', '') ) /2
        from auth.menu mm
        where mm.menu_raiz like cur.menu_raiz||'%'
        order by mm.menu_nivel desc
        limit 1
      ),
      menu_position = icount
    where cur.menu_id = _menu.menu_id;

    icount := icount  + 1 ;
  end loop;
end;
$$;


--
-- TOC entry 382 (class 1255 OID 22848)
-- Name: _menu_load_structure(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth._menu_load_structure(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    menu_id smallint, menu_codigo character varying,
    menu_nome character varying, menu_raiz character varying,
    menu_nivel smallint, menu_link character varying, menu_icon character varying,
     menu_estado smallint, menu_children smallint, menu_directchildern smallint,
      menu_maxnode smallint, menu_position smallint, menu_menu_id smallint,
       menu_menu_codigo character varying, menu_menu_nome character varying, menu_menu_raiz character varying,
        menu_menu_nivel smallint, menu_menu_link character varying, menu_menu_icon character varying
                                                                                         )
    LANGUAGE plpgsql
    AS $$
declare
  _menu record;
  menu_super_id int2 default filter->>'menu_id';
begin
  for _menu in (
    select
      me.menu_id,
      me.menu_codigo,
      me.menu_nome,
      me.menu_raiz,
      me.menu_nivel,
      me.menu_link,
      me.menu_icon,
      me.menu_estado,
      me.menu_children,
      me.menu_directchildern,
      me.menu_maxnode,
      me.menu_position,
      super.menu_id as menu_menu_id,
      super.menu_codigo as menu_menu_codigo,
      super.menu_nome as menu_menu_nome,
      super.menu_raiz as menu_menu_raiz,
      super.menu_nivel as menu_menu_nivel,
      super.menu_link as menu_menu_link,
      super.menu_icon as menu_menu_icon
    from auth.menu me
      left join auth.menu super on  me.menu_menu_id = super.menu_id
    where me.menu_menu_id = menu_super_id or (
      menu_super_id is null and me.menu_menu_id is null
    )
    order by
      me.menu_position,
      me.menu_nome
  ) loop -- proximo concorente



    -- Quando um menu tem filhos emtao motra todos os filhos desse menu antes de passa para o proximo meno
    return query
      select
        _menu.menu_id,
        _menu.menu_codigo,
        _menu.menu_nome,
        _menu.menu_raiz,
        _menu.menu_nivel,
        _menu.menu_link,
        _menu.menu_icon,
        _menu.menu_estado,
        _menu.menu_children,
        _menu.menu_directchildern,
        _menu.menu_maxnode,
        _menu.menu_position,
        _menu.menu_menu_id,
        _menu.menu_menu_codigo,
        _menu.menu_menu_nome,
        _menu.menu_menu_raiz,
        _menu.menu_menu_nivel,
        _menu.menu_menu_link,
        _menu.menu_menu_icon
    ;

    if _menu.menu_children > 0 then
      return query select *
        from auth._menu_load_structure(
          jsonb_build_object(
            'menu_id', _menu.menu_id
          )
        );
    end if;

  end loop;
end;
$$;


--
-- TOC entry 383 (class 1255 OID 22849)
-- Name: funct_autenticacao(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_autenticacao(args jsonb) RETURNS TABLE(
    autenticacao_id uuid,
     autenticacao_chave character varying,
      autenticacao_dataregistro character varying,
       colaborador_id uuid,
        colaborador_email character varying,
         colaborador_nome character varying,
          colaborador_apelido character varying,
            colaborador_accesso smallint,
             colaborador_estado smallint,
              colaborador_dataultimaatualizacasenha timestamptz,
               colaborador_accessodesc character varying,
                colaborador_estadodesc character varying,
                 tsexo_id smallint,
                  tsexo_codigo character,
                   tsexo_nome character varying,
                    acesso jsonb)
    LANGUAGE plpgsql
    AS $$
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


--
-- TOC entry 384 (class 1255 OID 22851)
-- Name: funct_autenticacao_logoff(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_autenticacao_logoff(arg jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
    /**
      Essa funçãos serve para terminar a seção de um colaborador
     */

  arg_autenticacao_chave character varying := arg->>'arg_autenticacao_chave';

  _autenticacao auth.autenticacao;
  _const constant map.constant := map.constant();
begin
  select * into _autenticacao
    from auth.autenticacao au
    where  au.autenticacao_chave = arg_autenticacao_chave
  ;

  if _autenticacao.autenticacao_estado != _const.autenticacao_estado_ativo then
    return lib.result_true();
  end if;

  update auth.autenticacao
    set autenticacao_estado = _const.autenticacao_estado_fechado,
        autenticacao_dataatualizacao = now()
    where autenticacao_id = _autenticacao.autenticacao_id;

  return lib.result_true( 'sucesso' );

end;
$$;


--
-- TOC entry 385 (class 1255 OID 22852)
-- Name: funct_change_colaborador(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para aatualizar as informações do colaborador
    args := {
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

  arg_colaborador_email character varying   := args->>'arg_colaborador_email';
  arg_colaborador_nome character varying    := args->>'arg_colaborador_nome';
  arg_colaborador_apelido character varying := args->>'arg_colaborador_apelido';
  arg_colaborador_datanascimento date       := args->>'arg_colaborador_datanascimento';
  arg_colaborador_nif character varying     := args->>'arg_colaborador_nif';
  arg_colaborador_ficha jsonb               := args->>'arg_colaborador_ficha';
  arg_colaborador_foto varchar               := args->>'arg_colaborador_foto';
  arg_tsexo_id int2                         := args->>'arg_tsexo_id';

  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_editar );
  _const map.constant;
begin
    _const := map.constant();

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
    ;

    return lib.result_true();
  end;
$$;


--
-- TOC entry 386 (class 1255 OID 22853)
-- Name: funct_change_colaborador_accesso_disable(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador_accesso_disable(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
    /**
      Essa função serve para disativar o accesso de um dado colaborador no sistema
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
  _const := map.constant();

  -- Um colaborador master não pode ser desabilitado do sistema
  if _colaborador.colaborador_tipo = _const.colaborador_tipo_user_master then
    return lib.result_false( 'auth.colaborador.disable-master' );
  end if;

  update auth.colaborador
    set colaborador_accesso = 0,
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


--
-- TOC entry 387 (class 1255 OID 22854)
-- Name: funct_change_colaborador_accesso_reativar(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador_accesso_reativar(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para reativar um colaborador
      * Na reativação do colaborador sera gerado um token de ativação

    args := {
      arg_colaborador_id: ID,
      arg_colaborador_reative: ID,
      arg_colaborador_senha: SENHA,
      arg_colaborador_pin: PIN
    }
    -- argumentos
      -- arg_colaborador_id corresponde ao colaborador logado no sistema que esta efetuar a operação de ativação
      -- arg_colaborador_reative corresponde ao colaborador que tera o acesso reativo no sistema.
   */

  arg_colaborador_id uuid := args->>'arg_colaborador_id';
  arg_colaborador_reative uuid := args->>'arg_colaborador_reative';
  arg_colaborador_senha varchar default args->>'arg_colaborador_senha';
  arg_colaborador_pin varchar default args->>'arg_colaborador_pin';

  arg_token_senha boolean default false;
  arg_token_pin boolean default false;
  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_reative );
  _const map.constant;
begin
  _const := map.constant();
  _colaborador.colaborador_pinmodo := _const.colaborador_chavemodo_padrao;
  _colaborador.colaborador_senhamodo := _const.colaborador_chavemodo_padrao;
  _colaborador.colaborador_accesso = _const.colaborador_accesso_pendente;

  -- Um colaborador já ativo não pode ser novamente reativado
  if _colaborador.colaborador_estado != _const.colaborador_estado_ativo then
    return lib.result_false( '@auth.colaborador.active-active' );
  end if;

  -- Gerar a senha para o acesso
  if arg_colaborador_senha is null then
    arg_token_senha := true;
    _colaborador.colaborador_senhamodo := _const.colaborador_chavemodo_gerado;
    arg_colaborador_senha := auth._colaborador_generate_senha_token();
  else
    _colaborador.colaborador_accesso = _const.colaborador_accesso_ativo;
  end if;

  -- Gerar o pin para o accesso
  if arg_colaborador_pin is null then
    _colaborador.colaborador_pinmodo := _const.colaborador_chavemodo_gerado;
    arg_token_pin := true;
    arg_colaborador_pin := auth._colaborador_generate_pin_token();
  else
    _colaborador.colaborador_accesso = _const.colaborador_accesso_ativo;
  end if;

  update auth.colaborador
    set colaborador_accesso = _colaborador.colaborador_accesso,
        colaborador_senha = auth._encrypt( arg_colaborador_senha ),
        colaborador_pin = auth._encrypt( arg_colaborador_pin ),
        colaborador_dataultimaatualizacasenha = now(),
        colaborador_token = arg_token_senha,
        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_dataatualizacao = current_timestamp,
        colaborador_senhamodo = _colaborador.colaborador_senhamodo,
        colaborador_pinmodo = _colaborador.colaborador_pinmodo
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


--
-- TOC entry 389 (class 1255 OID 22855)
-- Name: funct_change_colaborador_pin(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador_pin(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa funcao serve para alterar a senha de um colaborador autenticado

    -- argumentos
      args := {
        arg_colaborador_id: ID,
        arg_colaborador_senha: OLD-PIN,
        arg_colaborador_pin: PIN
      }
      arg_colaborador_id corresponde ao identificador do colaborador que esta a alterar a sua propia senha
      arg_colaborador_senha corresponde a antiga senha do colaborador
      arg_colaborador_pin corresponde a nova senha do colaboarador
  */
  arg_colaborador_id uuid                      := args->>'arg_colaborador_id';
  arg_colaborador_senha character varying  := args->>'arg_colaborador_senha';
  arg_colaborador_pin character varying  := args->>'arg_colaborador_pin';
  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_id );
  _const map.constant;

begin

  _const := map.constant();

  -- A antiga senha do colaborador tem que bater igual senha atual cadastrada na base de dados
  if auth._encrypt( arg_colaborador_senha ) not in ( _colaborador.colaborador_pin ) then
    return lib.result_false( '@auth.colaborador.password-not-match' );
  end if;

  -- A nova senha tem que ser uma senha diferente da senha antiga
  if _colaborador.colaborador_pin = auth._encrypt( arg_colaborador_pin ) then
    return lib.result_false( '@auth.colaborador.password-equal-old' );
  end if;

  update auth.colaborador
    set colaborador_pin = auth._encrypt( arg_colaborador_pin ),
        colaborador_dataultimaatualizacasenha = now(),
        colaborador_dataatualizacao = now(),
        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_pinmodo = _const.colaborador_chavemodo_utilizador
    where colaborador_id = arg_colaborador_id
  ;

  return lib.result_true( 'success' );
end;
$$;


--
-- TOC entry 390 (class 1255 OID 22856)
-- Name: funct_change_colaborador_senha(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador_senha(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa funcao serve para alterar a senha de um colaborador autenticado

      args := {
        arg_colaborador_id: ID,
        arg_colaborador_senhaold: SENHA,
        arg_colaborador_senhanew: SENHA
      }
    -- argumentos
      arg_colaborador_id corresponde ao identificador do colaborador que esta a alterar a sua propia senha
      arg_colaborador_senhaold corresponde a antiga senha do colaborador
      arg_colaborador_senhanew corresponde a nova senha do colaboarador
  */
  arg_colaborador_id uuid                      := args->>'arg_colaborador_id';
  arg_colaborador_senhaold character varying  := args->>'arg_colaborador_senhaold';
  arg_colaborador_senhanew character varying  := args->>'arg_colaborador_senhanew';
  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_id );
  _const map.constant;

begin
  _const := map.constant();

  -- A antiga senha do colaborador tem que bater igual senha atual cadastrada na base de dados
  if _colaborador.colaborador_senha != auth._encrypt( arg_colaborador_senhaold ) then
    return lib.result_false( '@auth.colaborador.password-not-match' );
  end if;

  -- A nova senha tem que ser uma senha diferente da senha antiga
  if _colaborador.colaborador_senha = auth._encrypt( arg_colaborador_senhanew ) then
    return lib.result_false( '@auth.colaborador.password-equal-old' );
  end if;

  update auth.colaborador
    set colaborador_senha = auth._encrypt( arg_colaborador_senhanew ),
        colaborador_dataultimaatualizacasenha = now(),
        colaborador_dataatualizacao = now(),
        colaborador_colaborador_atualizacao = arg_colaborador_id,
        colaborador_senhamodo = _const.colaborador_chavemodo_utilizador
    where colaborador_id = arg_colaborador_id
  ;

  return lib.result_true( 'success' );
end;
$$;



--
-- TOC entry 240 (class 1259 OID 23340)
-- Name: tsexo; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.tsexo (
                            tsexo_id smallint NOT NULL,
                            tsexo_nome character varying(10) NOT NULL,
                            tsexo_codigo character(1) NOT NULL,
                            CONSTRAINT ck_tsexo_codigo_valid CHECK (((tsexo_codigo)::text = upper((tsexo_codigo)::text)))
);


--
-- TOC entry 4681 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE tsexo; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.tsexo IS 'Essa entidade serve para armazenar os sexos do colaboradores';


--
-- TOC entry 4682 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN tsexo.tsexo_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.tsexo.tsexo_id IS 'Identificador único do sexo do colaborador';


--
-- TOC entry 4683 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN tsexo.tsexo_nome; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.tsexo.tsexo_nome IS 'Corresponde ao nome do sexo';


--
-- TOC entry 4684 (class 0 OID 0)
-- Dependencies: 240
-- Name: COLUMN tsexo.tsexo_codigo; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.tsexo.tsexo_codigo IS 'Corresponde ao codigo do sexo do colaboarador';



--
-- TOC entry 391 (class 1255 OID 22857)
-- Name: funct_change_colaborador_token_acesso(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_colaborador_token_acesso(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa funcao serve para recria o token de ativacao de conta de um colaborador
    -- Quando um utilizador perder a senha dever ser usada essa função para a recupereção da sua senha.

    -- argumentos
      -- arg_colaborador_email corresponde ao email do colaborador que pretende recuperar a senha
  */

  arg_colaborador_email character varying := args->>'arg_colaborador_email';

  arg_colaborador_token character varying;

  _const constant map.constant := map.constant();
  _colaborador auth.colaborador;
  _tsexo auth.tsexo;

begin
    arg_colaborador_email := lower( lib.str_normalize( arg_colaborador_email  ) );
    select  * into _colaborador
      from auth.colaborador co
      where co.colaborador_email = arg_colaborador_email
    ;

    if _colaborador.colaborador_estado != _const.colaborador_estado_ativo
      or  _colaborador.colaborador_accesso not in ( _const.colaborador_accesso_ativo, _const.colaborador_accesso_pendente )
    then
      return lib.result_false( '@auth.colaborador.acesso-can-not-active' );
    end if;

    if _colaborador.colaborador_id is null then
      return lib.result_false( '@auth.colaborador.mail-not-found' );
    end if;

    arg_colaborador_token := auth._colaborador_generate_senha_token()
                                 ||auth._colaborador_generate_pin_token();

    update auth.colaborador
      set colaborador_token = arg_colaborador_token,
          colaborador_tokenlimit = current_timestamp + _const.colaborador_token_limit,
          colaborador_dataatualizacao = current_timestamp
      where colaborador_id = _colaborador.colaborador_id
      returning * into _colaborador;

    select * into _tsexo
        from auth.tsexo sx
        where sx.tsexo_id = _colaborador.colaborador_tsexo_id;

    return lib.result_true(
      jsonb_build_object(
        'colaborador', jsonb_build_object(
          'colaborador_nome', _colaborador.colaborador_nome,
          'colaborador_apelido', _colaborador.colaborador_apelido,
          'tsexo_id', _tsexo.tsexo_id,
          'tsexo_nome', _tsexo.tsexo_nome,
          'colaborador_email', _colaborador.colaborador_email
        ),
        'colaborador_token', auth._colaborador_token_encrypt( _colaborador )
      )
    );
  end;
$$;


--
-- TOC entry 392 (class 1255 OID 22858)
-- Name: funct_change_colaborador_token_ativate(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE or replace FUNCTION auth.funct_change_colaborador_token_ativate(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa funcao serve para ativar um colaborador quando tem token ativo
    Na ativação a senha ser definida, o acesso passara a ser ativo e o token deixara de existir

   */

  arg_colaborador_id integer              := args->>'arg_colaborador_id';
  arg_colaborador_token character varying := args->>'arg_colaborador_token';
  arg_colaborador_senha character varying  := args->>'arg_colaborador_senha';
  arg_colaborador_pin character varying  := args->>'arg_colaborador_pin';


  _const map.constant := map.constant();
  _colaborador auth.colaborador := auth._get_colaborador( arg_colaborador_id := arg_colaborador_id );
begin
  if _colaborador.colaborador_token is null then
    return lib.result_false( '@auth.colaborador.token-not-found' );
  end if;

  if _colaborador.colaborador_estado != _const.colaborador_estado_ativo
    or  _colaborador.colaborador_accesso not in ( _const.colaborador_accesso_ativo, _const.colaborador_accesso_pendente )
  then
    return lib.result_false( 'auth.colaborador.acesso-can-not-active' );
  end if;

  if auth._colaborador_token_encrypt( _colaborador ) != arg_colaborador_token then
    return lib.result_false( '@auth.colaborador.token-invalid' );
  end if;

  -- Ativar o colaborador
  update auth.colaborador
    set
      colaborador_accesso = _const.colaborador_accesso_ativo,
      colaborador_token = null,
      colaborador_tokenlimit = null,
      colaborador_senha = auth._encrypt( arg_colaborador_senha ),
      colaborador_pin = auth._encrypt( arg_colaborador_pin ),
      colaborador_pinmodo = _const.colaborador_chavemodo_utilizador,
      colaborador_senhamodo = _const.colaborador_chavemodo_utilizador,
      colaborador_dataultimaatualizacasenha = now(),
      colaborador_dataatualizacao = now(),
      colaborador_colaborador_atualizacao = arg_colaborador_id
    where colaborador_id = arg_colaborador_id
  ;

  return lib.result_true( 'sucesso' );

end;
$$;


--
-- TOC entry 393 (class 1255 OID 22859)
-- Name: funct_change_perfil(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_change_perfil(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para modificar dos dados do perfil como o nome
    --args
      -- arg_colaborador_id corresponde ao identificador do colaborador responsavel pelo atualização do perfil
      -- arg_perfil_id corresponed ao identificador do perfil que tera as informações alterada
      -- arg_perfil_nome corresponde ao novo nome para o perfil
   */

  arg_colaborador_id uuid           := args ->>'arg_colaborador_id';
  arg_perfil_id uuid                := args ->>'arg_perfil_id';
  arg_menu jsonb                    := args ->>'arg_menus';
  arg_perfil_nome character varying := args ->>'arg_perfil_nome';

  _const map.constant;
  _perfil auth.perfil;
  _res lib.result;
begin
  _const := map.constant();
  _perfil := auth._get_perfil( arg_perfil_id );

  arg_perfil_nome := lib.str_normalize( arg_perfil_nome );

  -- para os perfil com código não pode ter as informações alteradas
  if _perfil.perfil_codigo is not null then
    return lib.result_false( '@auth.perfil.codigo.locked' );
  end if;

  update auth.perfil
    set perfil_nome = arg_perfil_nome,
        perfil_colaborador_atualizacao = arg_colaborador_id,
        perfil_dataatualizacao = current_timestamp
    where perfil_id = arg_perfil_id
  ;

  _res := auth.funct_reg_privilegio( args );
  _res.message := _res.message || jsonb_build_object(
    'perfil', _perfil
  );

  return _res;

end;
$$;


--
-- TOC entry 394 (class 1255 OID 22860)
-- Name: funct_load_colaborador(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE or replace FUNCTION auth.funct_load_colaborador(filter jsonb) RETURNS TABLE(
    colaborador_id uuid,
    colaborador_nome character varying,
    colaborador_apelido character varying,
    colaborador_mail character varying,
    colaborador_estado smallint,
    colaborador_estadodesc character varying,
    colaborador_acesso smallint,
    colaborador_acessodesc character varying,
    colaborador_foto character varying,
    sexo_id smallint,
    sexo_nome character varying,
    sexo_codigo character,
    colaborador_datanascimento date,
    colaborador_nif character varying
)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função sere para carregar os colaborador apartir dos filtros expecificados
   */
  arg_colaborador_email character varying default filter->>'arg_colaborador_email';
  arg_colaborador_nif character varying default filter->>'arg_colaborador_nif';
  _const map.constant;
begin
  _const :=  map.constant();

  return query
    select co.colaborador_id,
        co.colaborador_nome,
        co.colaborador_apelido,
        co.colaborador_email,
        co.colaborador_estado,
        auth._colaborador_estado_desc( co.colaborador_estado ),
        co.colaborador_accesso,
        auth._colaborador_accesso_desc( co.colaborador_accesso ),
        co.colaborador_foto,
        s2.tsexo_id,
        s2.tsexo_nome,
        s2.tsexo_codigo,
        co.colaborador_datanascimento,
        co.colaborador_nif
      from auth.colaborador co
        left join auth.tsexo s2 ON co.colaborador_tsexo_id = s2.tsexo_id
      where co.colaborador_tipo in ( _const.colaborador_tipo_user, _const.colaborador_tipo_user_master )
        and co.colaborador_email = coalesce( arg_colaborador_email, co.colaborador_email )
        and co.colaborador_nif = coalesce( arg_colaborador_nif, co.colaborador_nif )
      order by
        case
          when co.colaborador_accesso = _const.colaborador_accesso_ativo then 1
          when co.colaborador_accesso = _const.colaborador_accesso_pendente then 2
          when co.colaborador_accesso = _const.colaborador_accesso_fechado then 3
        end asc,
        co.colaborador_nome,
        co.colaborador_apelido
      ;
end;
$$;


--
-- TOC entry 395 (class 1255 OID 22861)
-- Name: funct_load_colaborador_all_menu(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_load_colaborador_all_menu(filter jsonb) RETURNS TABLE(
    colaborador_id uuid,
     colaborador_nome character varying,
     colaborador_apelido character varying,
     colaborador_foto character varying
                                                                                )
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver os colaboradores que tenham o conjunto de menu especificado
    filter := {
      arg_colaborador_id: ID
      arg_menus: [
        menu_codigo,
        menu_codigo,
        menu_codigo
      ]
    }
  **/
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  args_menus varchar[ ] := array( select distinct doc.menu_codigo from jsonb_array_elements_text( filter->'arg_menus' ) doc( menu_codigo ) );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        co.colaborador_id,
        co.colaborador_nome,
        co.colaborador_apelido,
        co.colaborador_foto
      from auth.colaborador co
        inner join auth.acesso acc on co.colaborador_id = acc.acesso_colaborador_propetario
        inner join auth.menu men on acc.acesso_menu_id = men.menu_id
      where acc.acesso_estado = _const.acesso_estado_ativo
        and co.colaborador_estado = _const.colaborador_estado_ativo
        and co.colaborador_id = coalesce( arg_colaborador_id, co.colaborador_id )
      group by co.colaborador_id
      having array_agg( men.menu_codigo ) @> args_menus
      order by co.colaborador_dataultimologin desc nulls last,
        co.colaborador_nome,
        co.colaborador_apelido
  ;
end;
$$;


--
-- TOC entry 396 (class 1255 OID 22862)
-- Name: funct_load_colaborador_any_menu(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_load_colaborador_any_menu(filter jsonb) RETURNS TABLE(
    colaborador_id uuid,
     colaborador_nome character varying,
      colaborador_apelido character varying,
       colaborador_foto character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver os colaboradores que tenha pelo menos um menu especificado
    filter := {
      arg_colaborador_id: ID,
      arg_menus: [
        menu_codigo,
        menu_codigo,
        menu_codigo
      ]
    }
  **/
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  args_menus varchar[ ] := array( select distinct doc.menu_codigo from jsonb_array_elements_text( filter->'arg_menus' ) doc( menu_codigo ) );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        co.colaborador_id,
        co.colaborador_nome,
        co.colaborador_apelido,
        co.colaborador_foto
      from auth.colaborador co
        inner join auth.acesso acc on co.colaborador_id = acc.acesso_colaborador_propetario
        inner join auth.menu men on acc.acesso_menu_id = men.menu_id
      where acc.acesso_estado = _const.acesso_estado_ativo
        and co.colaborador_estado = _const.colaborador_estado_ativo
        and men.menu_codigo = any( args_menus )
        and co.colaborador_id = coalesce( arg_colaborador_id, co.colaborador_id )
      group by co.colaborador_id
      having count( men.menu_id ) > 0
      order by
       co.colaborador_dataultimologin  desc nulls last,
       co.colaborador_nome,
       co.colaborador_apelido
  ;
end;
$$;


--
-- TOC entry 397 (class 1255 OID 22863)
-- Name: funct_load_colaborador_by_token(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_load_colaborador_by_token(args jsonb) RETURNS TABLE(
    colaborador_id uuid,
     colaborador_nome character varying,
      colaborador_apelido character varying,
       colaborador_mail character varying,
        colaborador_nif character varying,
         colaborador_foto character varying,
          colaborador_ficha jsonb,
           tsexo_id smallint,
            tsexo_nome character varying,
             tsexo_codigo character)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para devolver as informações de um colaborador apartir do seu token de acesso
    O tokem a ser devolvido tem que estar no prazo

    -- argumentos
      -- arg_colaborador_token corresponde ao token encripitado do colaborador
   */

  arg_colaborador_token character varying := args->>'arg_colaborador_token';
begin
  return query
    select
      co.colaborador_id,
      co.colaborador_nome,
      co.colaborador_apelido,
      co.colaborador_email,
      co.colaborador_foto,
      co.colaborador_nif,
      co.colaborador_ficha,
      sx.tsexo_id,
      sx.tsexo_nome,
      sx.tsexo_codigo
    from auth.colaborador co
      left join auth.tsexo sx on co.colaborador_tsexo_id = sx.tsexo_id
    where auth._colaborador_token_encrypt( co ) = arg_colaborador_token
      and co.colaborador_tokenlimit >= current_timestamp
  ;
end;
$$;


--
-- TOC entry 398 (class 1255 OID 22864)
-- Name: funct_load_colaborador_simple(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_load_colaborador_simple(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    colaborador_id uuid,
     colaborador_nome character varying,
      colaborador_apelido character varying,
       colaborador_nomecompleto character varying
                                                                                                  )
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carregar os colaboradores
   */
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        co.colaborador_id,
        co.colaborador_nome,
        co.colaborador_apelido,
        format( '%s %s',co. colaborador_nome, co.colaborador_apelido )::character varying
      from auth.colaborador co
      where co.colaborador_estado != _const.colaborador_estado_fechado
        and co.colaborador_tipo != _const.colaborador_tipo_system
  ;
end;
$$;


--
-- TOC entry 399 (class 1255 OID 22865)
-- Name: funct_load_colaborador_token_restore(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_load_colaborador_token_restore(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para recuperar o token do acesso do colaborador ao sistema.
    -- argumentos
      -- arg_colaborador_restore identificador do colaborador a qual pretente restaurar o token de ativação
   */

  arg_colaborador_restore uuid := args->>'arg_colaborador_id';

  _const map.constant;
  _colaborador auth.colaborador;
begin
    _const := map.constant();
    _colaborador := auth._get_colaborador( arg_colaborador_restore );

  if _colaborador.colaborador_token is null
    or _colaborador.colaborador_tokenlimit is null
    or _colaborador.colaborador_tokenlimit < current_timestamp
  then
    return lib.result_false( 'auth.colaborador.token-not-restore' );
  end if;

  return lib.result_true(
    jsonb_build_object(
      'colaborador_token', auth._colaborador_token_encrypt( _colaborador )
    )
  );
end;
$$;


--
-- TOC entry 402 (class 1255 OID 22866)
-- Name: funct_load_menu(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--
CREATE FUNCTION auth.funct_load_menu(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    menu_id smallint,
     menu_codigo character varying,
      menu_raiz character varying,
       menu_nivel smallint,
        menu_icon character varying,
         menu_nome character varying,
          menu_link character varying,
           menu_estado smallint,
            menu_children smallint,
             menu_maxnode smallint,
              menu_directchildern smallint,
               menu_position smallint,
                menu_falta boolean,
                 menu_mais boolean,
                  menu_sincronizado boolean,
                   acesso_id uuid,
                    perfil_id uuid,
                     menu_menu_id smallint,
                      menu_menu_codigo character varying,
                       menu_menu_raiz character varying,
                        menu_menu_nivel smallint,
                         menu_menu_icon character varying,
                          menu_menu_nome character varying,
                           menu_menu_link character varying,
                            menu_menu_estado smallint,
                             menu_menu_children smallint,
                              menu_menu_maxnode smallint,
                               menu_menu_directchildern smallint,
                                menu_menu_position smallint)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
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

  _const constant map.constant;
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


--
-- TOC entry 403 (class 1255 OID 22867)
-- Name: funct_load_menu_cascade(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE or replace FUNCTION auth.funct_load_menu_cascade(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    menu_id smallint,
     menu_menu_id smallint,
      menu_codigo character varying,
      menu_raiz character varying,
       menu_nivel smallint,
        menu_icon character varying,
        menu_nome character varying,
         menu_link character varying,
          menu_estado smallint,
          menu_children smallint,
          menu_maxnode smallint,
          menu_directchildern smallint,
          menu_position smallint,
           menu_falta boolean,
           menu_mais boolean,
            menu_sincronizado boolean,
             acesso_id uuid,
              perfil_id uuid,
               menu_childrenlist jsonb
                                                                                            )
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função carrega os menus e faz um mach entre e perfil e o colaborador
    args := {
      arg_colaborador_id: ID,
      arg_perfil_id: ID,
      arg_allmenu: TRUE | FALSE
    }
    -- argumentos
      -- arg_colaborador_id identificador do colaborador o qual pretende-se obter os menus (opcional)
      -- arg_perfil_id identificador do perfil o qual pretende-se obter os menus (opcional)
      -- arg_allmenu boolean | quando true significa carregar todos os menus independete mente se o colaborador
        ou menu estiver associado ao mesmo
   */
  arg_colaborador_id uuid := filter->>'arg_colaborador_id';
  arg_perfil_id uuid := filter->>'arg_perfil_id';
  arg_allmenu boolean := filter->>'arg_allmenu';

  _const constant map.constant := map.constant();
begin
  arg_allmenu := coalesce( arg_allmenu, false );

  -- Quando o filtro não for expecificado carregar todos os menus
  if filter is null then arg_allmenu := true; end if;

  return query
    with menu_colaborador as (
      select
        me.menu_id                ,
        me.menu_menu_id           ,
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

        ac.acesso_id is null and perf.perfil_id is not null as menu_falta,
        ac.acesso_id is not null and perf.perfil_id is null as menu_mais,
        ac.acesso_id is not null and perf.perfil_id is not null as menu_sincronizado,
        ac.acesso_id              ,
        perf.perfil_id

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
    ) select mc.*,
        jsonb_agg( to_jsonb( child ) ) filter ( where child.menu_id is not null ) menu_childrenlist
      from menu_colaborador mc
        left join menu_colaborador child on mc.menu_id = child.menu_menu_id
      where mc.menu_menu_id is null
      group by
        mc.menu_id,
        mc.menu_menu_id,
        mc.menu_codigo,
        mc.menu_raiz,
        mc.menu_nivel,
        mc.menu_icon,
        mc.menu_nome,
        mc.menu_link ,
        mc.menu_estado,
        mc.menu_children,
        mc.menu_maxnode,
        mc.menu_directchildern,
        mc.menu_position,
        mc.menu_falta,
        mc.menu_mais ,
        mc.menu_sincronizado,
        mc.acesso_id,
        mc.perfil_id
      order by mc.menu_position asc
  ;
end;
$$;


--
-- TOC entry 404 (class 1255 OID 22868)
-- Name: funct_reg_acesso(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_reg_acesso(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
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

  _const constant map.constant;
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


--
-- TOC entry 405 (class 1255 OID 22869)
-- Name: funct_reg_colaborador(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_reg_colaborador(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para cadastra novos colaboradores
    Ao cadastar o colaborador a senha é atribuida automaticamente em um random
    E gerado tambem um token que devera ser enviado pela aplicao ao email do colaborador cadastrado
    O email e o NIF tem que ser unico
    args := {
      arg_colaborador_id: ID,
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
    }

   */
  arg_colaborador_id uuid                := args->>'arg_colaborador_id';
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


  _const map.constant := map.constant();
  _colaborador auth.colaborador;
  _res lib.result;

begin
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
    colaborador_tsexo_id
  ) values (
    arg_colaborador_id,
    arg_colaborador_email,
    arg_colaborador_nome,
    arg_colaborador_apelido,
    arg_colaborador_nif,
    arg_colaborador_datanascimento,
    arg_colaborador_foto,
    arg_tsexo_id
  ) returning * into _colaborador;

  perform auth.funct_reg_acesso(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_colaborador_propetario', _colaborador.colaborador_id,
      'arg_menu_list', arg_menu_list
    )
  );

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
      'colaborador',
        lib.jsonb_values(
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
end;
$$;


--
-- TOC entry 407 (class 1255 OID 22870)
-- Name: funct_reg_perfil(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_reg_perfil(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar um novo tipo de perfil dos colaboradores
    -- paramentros
      -- arg_colaborador_id corresponde ao colaborador responsavél pelo regustro do perfil «
      -- arg_perfil_perfil_id corresponde ao identificador do perfil parente
      -- arg_perfil_nome corresponde ao nome do perfil a ser criado
      -- arg_menus corresponde aos identificadores dos menus que esse perfil deve ter por padrão
        [ ID, ID, ID ... ]
   */

  arg_colaborador_id uuid                := args ->>'arg_colaborador_id';
  arg_perfil_perfil_id uuid             := args ->>'arg_perfil_perfil_id';
  arg_perfil_nome character varying     := args ->>'arg_perfil_nome';
  arg_menus jsonb                       := args ->'arg_menus';

  _perfil auth.perfil;
  _res lib.result;
begin

  -- Não pode existir mais de um perfil com o mesmo nome
  if(
    select count( * ) > 0
      from auth.perfil pef
      where pef.perfil_nome = arg_perfil_nome
  ) then
    return lib.result_false( 'auth.perfil.nome.already-exist' );
  end if;

  insert into auth.perfil (
    perfil_perfil_id,
    perfil_colaborador_id,
    perfil_nome
  ) values (
    arg_perfil_perfil_id,
    arg_colaborador_id,
    arg_perfil_nome
  ) returning * into _perfil;

  _res := auth.funct_reg_privilegio(
    args || jsonb_build_object(
      'arg_perfil_id', _perfil.perfil_id
    )
  );

  _res.message := _res.message || jsonb_build_object(
    'perfil', _perfil
  );

  return _res;
end;
$$;


--
-- TOC entry 408 (class 1255 OID 22871)
-- Name: funct_reg_privilegio(jsonb); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.funct_reg_privilegio(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registrar os menus que um perfil tem privilegiso por padrão
    -- argumentos
      -- arg_colaborador_id corresponde ao identificador do colabrador responsavel por privilegiar o menu ao perfil
      -- arg_menus corresponde aos identificadores dos menus em que serão associados ao perfil
      -- arg_perfil_id corresponde ao identificador do perfil que ira ter acesso aos menus
   */

  arg_colaborador_id uuid  := args ->>'arg_colaborador_id';
  arg_perfil_id uuid       := args ->>'arg_perfil_id';
  arg_menus         jsonb := args ->>'arg_menus';

  arg_menu_list int[ ] := array( select jsonb_array_elements_text( arg_menus )::int );

  _const map.constant;
  arg_privilegios auth.privilegio[];
begin

  _const := map.constant();
  -- Desativar todos os menus que não farão parte desse perfil
  update auth.privilegio
    set privilegio_estado = _const.privilegio_estado_fechado,
        privilegio_dataatualuzacao = current_timestamp,
        privilegio_colaborador_atualizacao = arg_colaborador_id
    where previlegio_perfil_id = arg_perfil_id
      and privilegio_estado = _const.perfil_estado_ativo
      and privilegio_menu_id != all( arg_menu_list )
  ;

  -- Associar os novos menus ao perfil
  insert into auth.privilegio(
    previlegio_perfil_id,
    privilegio_menu_id,
    privilegio_colaborador_id
  ) select
      arg_perfil_id,
      me.menu_id,
      arg_colaborador_id
    from unnest( arg_menu_list ) m( id )
      inner join auth.menu me on m.id = me.menu_id
      left join auth.privilegio pri on me.menu_id = pri.privilegio_menu_id
        and pri.privilegio_estado = _const.privilegio_estado_ativo
    where pri.privilegio_id is null
  ;

  -- Obter todos os privilegios associados ao perfil
  select array_agg( pri ) into arg_privilegios
    from auth.privilegio pri
    where pri.previlegio_perfil_id = arg_perfil_id
      and pri.privilegio_estado = _const.privilegio_estado_ativo
  ;

  return lib.result_true(
    jsonb_build_object(
      'privilegios', arg_privilegios
    )
  );
end;
$$;




--
-- TOC entry 415 (class 1255 OID 22887)
-- Name: age(timestamptz); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.age(timestamptz) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
/**
  Essa função serve para calcular a idade apartir de um timestamptz estabelecido
 */
select cast(to_char(age( $1 ), 'yyyy') as integer);
$_$;


--
-- TOC entry 416 (class 1255 OID 22888)
-- Name: agg_first(anyelement, anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.agg_first(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
/**
  Essa função serve de base para obter o primeiro elemento aggregado na função de agregação first
 */
select $1;
$_$;


--
-- TOC entry 417 (class 1255 OID 22889)
-- Name: agg_last(anyelement, anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.agg_last(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
/**
  Essa função serve de base para obter o último elemento agregado na função de agregação last
  */
select $2;
$_$;


--
-- TOC entry 418 (class 1255 OID 22890)
-- Name: array_delete(anyarray, integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.array_delete(list anyarray, element integer) RETURNS anyarray
    LANGUAGE sql
    AS $$
/**
  Essa função serve para remover um elemento em uma dada posição do array
  list corresponde ao array com elementos
  element corresponde ao elemento que devera ser removido
*/
select lib.array_delete( list, element, 1 );
$$;


--
-- TOC entry 419 (class 1255 OID 22891)
-- Name: array_delete(anyarray, integer, integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.array_delete(list anyarray, start integer, elements integer) RETURNS anyarray
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para remover um range de elementos em um array e devolver um novo array com elementos que não foram eliminados
   */
begin
  return list[ :start -1 ] || list[ ( start + elements ): ];
end;
$$;


--
-- TOC entry 388 (class 1255 OID 22892)
-- Name: array_max_element(anyarray, anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.array_max_element(arr anyarray, element anyelement DEFAULT NULL::unknown) RETURNS anyelement
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para obeter o maior elemento em um array
  */
begin
  element := null;
  for iterator in 1.. array_length( arr, 1 ) loop
    if arr[ iterator ]  is not null and element is null or element < arr[ iterator ] then
      element := arr [ iterator ];
    end if;
  end loop;

  return element;
end;
$$;


--
-- TOC entry 400 (class 1255 OID 22893)
-- Name: array_min_element(anyarray, anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.array_min_element(arr anyarray, element anyelement DEFAULT NULL::unknown) RETURNS anyelement
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para obter o menor elemento em um array
   */
begin
  element := null;
  for iterator in 1 .. lib.array_length( arr ) loop
    if arr[ iterator ]  is not null and element is null or element > arr[ iterator ] then
      element := arr [ iterator ];
    end if;
  end loop;

  return element;
end;
$$;


--
-- TOC entry 406 (class 1255 OID 22894)
-- Name: coincidences(anyarray, anyarray, jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.coincidences(arguments_left anyarray, arguments_right anyarray, option jsonb DEFAULT NULL::jsonb) RETURNS numeric
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare

  --     iterator_left numeric default 1;

  -- text_left text;
  -- text_iterator text;
  coincidences_match_found numeric default 0;
  coincidences_total numeric;
begin
  coincidences_total := array_length( arguments_right, 1 );

  if arguments_left is null
     or coincidences_total = 0
     or arguments_right is null
     or array_length( arguments_right, 1 ) = 0
  then
    return 0;
  end if;


  for iterator_left in 1 .. array_length( arguments_left, 1 ) loop
    if  arguments_left[ iterator_left ] = any ( arguments_right ) then
      coincidences_match_found := coincidences_match_found + 1;
    end if;
  end loop;
  return ( 100 * coincidences_match_found ) / coincidences_total;
end;
$$;


--
-- TOC entry 380 (class 1255 OID 22895)
-- Name: coincidences_likes(text[], text[], jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.coincidences_likes(arguments_left text[], arguments_right text[], option jsonb DEFAULT NULL::jsonb) RETURNS numeric
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare

  --     iterator_left numeric default 1;

  -- text_left text;
  -- text_iterator text;
  coincidences_match_found numeric default 0;
  coincidences_total numeric;
begin
  coincidences_total := array_length( arguments_right, 1 );

  if arguments_left is null
     or coincidences_total = 0
     or arguments_right is null
     or array_length( arguments_right, 1 ) = 0
  then
    return 0;
  end if;


  for iterator_left in 1 .. array_length( arguments_left, 1 ) loop
    if  arguments_left[ iterator_left ] like any ( arguments_right ) then
      coincidences_match_found := coincidences_match_found + 1;
    end if;
  end loop;

  return ( 100 * coincidences_match_found ) / coincidences_total;
end;
$$;


--
-- TOC entry 420 (class 1255 OID 22896)
-- Name: combinator(text[], integer, text[], integer[], integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.combinator(items text[], start integer DEFAULT 1, parent text[] DEFAULT NULL::text[], indexs integer[] DEFAULT NULL::integer[], size integer DEFAULT NULL::integer) RETURNS TABLE(combination_items text[], combination_elements integer, combination_indexs integer[])
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare

    /**
      Essa função serve para combinar de uma forma unica os elementos de uma lista
      items corresponde aos elementos que devem ser combinados ( arg_element_items )
      start corresponde a possição a qual a combinação devera iniciar (arg_element_start)
      parent cooresponde aos elementos já combinado que as novas combinações deverão conter na raiz (arg_element_parent)
      indexs corresponde ao index de todos os elementos já combinados no parrente (arg_element_index)
      size corresponde ao tamanho do array dos elementos que deverão ser combinadoos (arg_element_sizes)
     */

    arg_complete text[];
    arg_index int[];
    arg_items_count int default array_length( parent, 1 );
  begin

    -- Quando a lista dos itens a se combinar for nulo ou vazia então deve-se sair das tentativas de combinação
    if items is null or array_length( items, 1 ) = 0 then
      return;
    end if;

    -- Obter o tamanho total da lista dos elementos
    if size is null then
      size := array_length( items, 1 );
    end if;

    arg_items_count := coalesce( arg_items_count, 0 );
    start := coalesce( start, 1 );

    -- Combinar o parrente com todos os item apartir da posição atual do array
    for i in start .. size loop

      if parent is null then
        arg_complete := array [ items[ i ] ];
        arg_index := array [ i ];
      else
        arg_complete := parent || items[ i ];
        arg_index := indexs || i;
      end if;

      -- Para a nova combinação encontrada, combitar com os proximos item da lista caso tiver mais item na lista
      if i < size then
        return query
          select *
            from lib.combinator( items, i+1, arg_complete, arg_index, size )
        ;
      end if;

      return query select arg_complete, arg_items_count +1, arg_index;

    end loop;
  end;
$$;


--
-- TOC entry 421 (class 1255 OID 22897)
-- Name: dset_random_element(anyarray); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_element(elements anyarray) RETURNS anyelement
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver um elemento aleatoriamente de uma lista
   */
begin
  return elements[ lib.dset_random_next( 1, array_length( elements, 1 ) ) ];
end;
$$;


--
-- TOC entry 422 (class 1255 OID 22898)
-- Name: dset_random_name(integer, integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_name(min integer, max integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para gerar um termo composto apebas por letras com um minimo de sentido de leitura
   */
  vogais text[] default regexp_split_to_array( 'aeiyou', '' );
  consuant text[] default regexp_split_to_array( 'bcdfghjklmnprstvwxz', '' );
  consuant_composid text[] default array[ 'ch', 'qu' ];
  sufix text[] default regexp_split_to_array( 'lmnrsxz', '' );
  sufix_compused text[] default array [ 'ch' ];

  silabaQuant int := lib.dset_random_next( min, max );
  silabaFinal boolean;

  numConsuant int;
  numVogais int;
  numSufixo int;

  name text default '';
begin


  -- Unir todas as consoantes & sufixo
  consuant := consuant || consuant_composid;
  sufix := sufix || sufix_compused;

    numConsuant := array_length( consuant, 1 );
  numVogais := array_length( vogais, 1 );
  numSufixo := array_length( sufix, 1 );

  for i in 1 .. silabaQuant loop
    silabaFinal := i = silabaQuant;

    if not silabaFinal then
      name := name || consuant[ lib.dset_random_next( 1, numConsuant ) ];
      name := name || vogais [ lib.dset_random_next( 1, numVogais ) ];

    -- ? Opcao para colocar sufixo (10% de chance para colocar o sufixo)
    elseif lib.dset_random_next( 1, 100 ) <= 10 then
      -- SUFIXO: consoante, vogal, sufixo
      name := name || consuant[ lib.dset_random_next( 1, numConsuant ) ];
      name := name || vogais [ lib.dset_random_next( 1, numVogais ) ];
      name := name || sufix [ lib.dset_random_next( 1, numSufixo ) ];

    -- ? Adicionar consuante e vogal (90% de chanse de colocar consuante e vogal)
    elseif lib.dset_random_next( 1, 100 ) <= 90 then
      name := name || consuant[ lib.dset_random_next( 1, numConsuant ) ];
      name := name || vogais [ lib.dset_random_next( 1, numVogais ) ];

    else
      name := name || consuant[ lib.dset_random_next( 1, numConsuant ) ];

    end if;

  end loop;

  return name;
end;
$$;


--
-- TOC entry 423 (class 1255 OID 22899)
-- Name: dset_random_next(anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_next(anyelement) RETURNS anyelement
    LANGUAGE plpgsql STRICT
    AS $_$
declare
  arg_next numeric default ( random() * $1 );
begin
  if arg_next < 0 then return lib.dset_random_next( $1 );
  elseif arg_next > $1 then return lib.dset_random_next( $1 );
  end if;
  return arg_next;
end;
$_$;


--
-- TOC entry 424 (class 1255 OID 22900)
-- Name: dset_random_next(anyelement, anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_next(min anyelement, max anyelement) RETURNS anyelement
    LANGUAGE plpgsql
    AS $$
declare
    arg_max_abs numeric default case when abs( max ) > abs( min ) then abs( max ) else abs( min ) end;

    -- definir o sinal para o numero que sera gerado
    arg_sigal int default case
                              when min < 0 and max < 0 then -1
                              when min >= 0 and max >= 0 then 1
                              when lib.dset_random_next( 100 ) <= 50 then -1
                              else 1
        end;

    random numeric default random() * arg_max_abs * arg_sigal;
begin

    if min > max then return null; end if;

    if min = max then return min; end if;

    if random between min  and max then
        return random;
    else
        return lib.dset_random_next( min, max );
    end if;
end;
$$;


--
-- TOC entry 425 (class 1255 OID 22901)
-- Name: dset_random_nextdate(date, date); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_nextdate(arg_datainicio date, arg_datafim date) RETURNS date
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
    diferenca int;
begin
    if arg_datainicio > arg_datafim then return null; end if;
    diferenca := arg_datafim - arg_datainicio;

    return arg_datainicio + make_interval(
            0,
            0,
            0,
            lib.dset_random_next( 0, diferenca )
        );
end;
$$;


--
-- TOC entry 426 (class 1255 OID 22902)
-- Name: dset_random_nexttimestamptz(timestamptz, timestamptz); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_nexttimestamptz(min timestamptz, max timestamptz) RETURNS timestamptz
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
    diferenca interval;
begin
    if min > max then return null; end if;
    diferenca := max - min;

    return min + make_interval(
            0,
            0,
            0,
            lib.dset_random_next( 0, extract( days from diferenca )::int ),
            lib.dset_random_next( 0, extract( hours from diferenca )::int ),
            lib.dset_random_next( 0, extract( minutes from diferenca )::int ),
            lib.dset_random_next( 0.0::double precision, extract( seconds from diferenca ) )
        );
end;
$$;


--
-- TOC entry 427 (class 1255 OID 22903)
-- Name: dset_random_serial(integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_serial(length integer) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para gerar uma combinação eleatoria dos elementos em uma string
   */
  arg_elements constant character varying default 'AaBbC0cDdEe1FfGgH2hIiJj3KkLlM4mNnOo5PpQqR6rSsTt7UuVvW8wXxYy9Zz';

begin
    return lib.dset_random_text( arg_elements, length );
end;
$$;


--
-- TOC entry 428 (class 1255 OID 22904)
-- Name: dset_random_text(integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_text(length integer) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para gerar uma combinação eleatoria dos elementos em uma string
   */
  arg_elements constant character varying default 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

begin
    return lib.dset_random_text( arg_elements, length );
end;
$$;


--
-- TOC entry 429 (class 1255 OID 22905)
-- Name: dset_random_text(character varying, integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dset_random_text(elements character varying, length integer) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para gerar uma combinação eleatoria dos elementos em uma string
   */
  K constant character [] default regexp_split_to_array( elements, '' );
  gen text default '';
  max int default array_length( K, 1 );
begin
  for iterator in 1 .. length loop
    gen := gen || K[ lib.dset_random_next( 1, max ) ];
  end loop;
  return gen;
end;
$$;


--
-- TOC entry 401 (class 1255 OID 22906)
-- Name: dump_functions(text[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.dump_functions(VARIADIC schemas text[]) RETURNS SETOF text
    LANGUAGE sql
    AS $$

  select pg_get_functiondef(f.oid) || e';\n\n'
    from unnest( schemas ) with ordinality s ( schema_name, schema_index)
      inner join pg_catalog.pg_namespace n on n.nspname = s.schema_name
      inner join pg_catalog.pg_proc f on f.pronamespace = n.oid
    where f.oid not in (
      select aggfnoid from pg_catalog.pg_aggregate
    )
    order by s.schema_index
  ;
$$;


--
-- TOC entry 431 (class 1255 OID 22907)
-- Name: exception(character varying, text, text, text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.exception(errocode character varying DEFAULT NULL::character varying, text text DEFAULT NULL::text, hint text DEFAULT NULL::text, detail text DEFAULT NULL::text) RETURNS lib.exception
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para criar uma instancia exception
   */
  _ex lib.exception;
begin
  _ex.errcode :=  errocode;
  _ex.text := text;
  _ex.hint := hint;
  _ex.detail := detail;

  return _ex;
end;
$$;


--
-- TOC entry 432 (class 1255 OID 22908)
-- Name: in_day(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_day(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/( 60.0 * 60.0 * 24.0 );
end;
$_$;


--
-- TOC entry 433 (class 1255 OID 22909)
-- Name: in_hour(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_hour(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/( 60.0 * 60.0 );
end;
$_$;


--
-- TOC entry 434 (class 1255 OID 22910)
-- Name: in_minute(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_minute(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/60.0;
end;
$_$;


--
-- TOC entry 435 (class 1255 OID 22911)
-- Name: in_month(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_month(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/( 60.0 * 60.0 * 24.0 * 30 );
end;
$_$;


--
-- TOC entry 436 (class 1255 OID 22912)
-- Name: in_second(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_second(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 );
end;
$_$;


--
-- TOC entry 437 (class 1255 OID 22913)
-- Name: in_week(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_week(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/( 60.0 * 60.0 * 24.0 * 7 );
end;
$_$;


--
-- TOC entry 438 (class 1255 OID 22914)
-- Name: in_year(interval); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.in_year(interval) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
declare
  /**
    Devolver o intervalo em termos de segundos
   */
begin
  return extract( epoch from $1 )/ extract( epoch from make_interval( 1 ));
end;
$_$;


--
-- TOC entry 439 (class 1255 OID 22915)
-- Name: initials(character varying); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.initials(name character varying) RETURNS character varying
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  parts character varying [] default regexp_split_to_array(name, ' ');
  part character varying;
  initials character varying default '';
begin
  FOREACH part in ARRAY parts LOOP
    part := upper(trim(part));
    if part is not null and length(part)> 0 then
      initials := initials || substr(part, 1, 1);
    END IF;
  END LOOP;
  return initials;
end;
$$;


--
-- TOC entry 440 (class 1255 OID 22916)
-- Name: is_bigint(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.is_bigint(argment text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  num numeric;
begin
  num := argment::BIGINT;
  return true;
  exception when OTHERS  then return false;
end;

$$;


--
-- TOC entry 441 (class 1255 OID 22917)
-- Name: is_integer(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.is_integer(argment text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  num numeric;
begin
  num := argment::integer;
  return true;
  exception when OTHERS  then return false;
end;

$$;


--
-- TOC entry 442 (class 1255 OID 22918)
-- Name: is_numeric(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.is_numeric(argment text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  num numeric;
begin
  num := argment::numeric;
  return true;
  exception when OTHERS  then return false;
end;

$$;


--
-- TOC entry 443 (class 1255 OID 22919)
-- Name: jsonb_concat(jsonb[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_concat(VARIADIC jsonb[]) RETURNS jsonb
    LANGUAGE plpgsql
    AS $_$
  declare
    doc jsonb;
  begin
    for i in 1 .. array_length( $1, 1 ) loop
      if $1[ i ] is null then continue; end if;

      if doc is null then doc := $1[ i ];
      else doc := doc || $1 [ i ];
      end if;
    end loop;
    return doc;
  end;
$_$;


--
-- TOC entry 444 (class 1255 OID 22920)
-- Name: jsonb_iterate(jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_iterate(document jsonb) RETURNS TABLE(key text, key_type regtype, value jsonb, value_type text)
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para iterar qualquer tipo de jsonb composta (array ou object )
      e devolver os valores disponiveis no mesmo
   */
begin
  -- para documento null não efetuar nehuma operção
  if document is null then return; end if;

  -- Quando o documento for objecto então iterar as key
  if jsonb_typeof( document ) in ( 'object' ) then
    return query
      select
          doc.key,
          'text'::regtype,
          doc.value,
          jsonb_typeof( doc.value )
        from jsonb_each( document ) doc
    ;
  end if;

  -- Quando o documento for array então iterar os index
  if jsonb_typeof( document ) in ( 'array' ) then
    return query
      select
          doc.index::text,
          'integer'::regtype,
          doc.value,
          jsonb_typeof( doc.value )
        from jsonb_array_elements( document ) with ordinality doc ( value, index )
    ;
  end if;

end;
$$;


--
-- TOC entry 445 (class 1255 OID 22921)
-- Name: jsonb_iterate_cascade(jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_iterate_cascade(document jsonb) RETURNS TABLE(path text[], level integer, key text, key_type regtype, value jsonb, value_type text)
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para iterar em cascada qualquer tipo de jsonb composto (array ou object )
      e devolver os valores disponiveis no mesmo
   */
begin
  return query
    with recursive cascade as (
          select
              array[ i.key ] as path,
              0 as level,
              i.*
            from lib.jsonb_iterate ( document ) i
        union all
          select
            ca.path|| i.key,
              ca.level +1,
              i.*
              from cascade ca
            inner join lib.jsonb_iterate( ca.value ) i on true
          where ca.value_type in ( 'object', 'array' )
      )
    select *
      from cascade
      order by path
  ;

end;
$$;


--
-- TOC entry 356 (class 1255 OID 22922)
-- Name: jsonb_object_length(jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_object_length(object jsonb) RETURNS integer
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para obtter o tamanho de um objecto json ( a quantidade de par chave valor que o objecto possui )
   */
  iCount int;
  objType text default jsonb_typeof( object );
begin
  if objType is null or objType != 'object' then return null; end if;
  select count(*)  into iCount
  from jsonb_object_keys(object);
  return iCount;
end;
$$;


--
-- TOC entry 365 (class 1255 OID 22923)
-- Name: jsonb_values(anyelement, integer[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_values(element anyelement, VARIADIC indexes integer[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver varios valores de um documento em um sub-documento jsonb
   */
  sub jsonb := jsonb_build_object();
  doc jsonb;
begin
  doc := to_jsonb( element );
  if array_length( indexes, 1 ) = 0 then return jsonb_build_array(); end if;

  select
    jsonb_agg(
        doc->( key.index )
      ) into sub
  from unnest( indexes ) key( index )
  ;

  return coalesce( sub, jsonb_build_object() );
end;
$$;


--
-- TOC entry 446 (class 1255 OID 22924)
-- Name: jsonb_values(anyelement, text[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_values(element anyelement, VARIADIC keys text[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver varios valores de um documento em um sub-documento jsonb
   */
  doc jsonb;
  sub jsonb := jsonb_build_object();
begin
  doc := to_jsonb( element );
  if array_length( keys, 1 ) = 0 then return jsonb_build_object(); end if;

  select
    jsonb_object_agg(
        key.name, doc->( key.name )
      ) into sub
  from unnest( keys ) key( name )
  ;

  return coalesce( sub, jsonb_build_object() );
end;
$$;


--
-- TOC entry 447 (class 1255 OID 22925)
-- Name: jsonb_values(jsonb, integer[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_values(document jsonb, VARIADIC indexes integer[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver varios valores de um documento em um sub-documento jsonb
   */
  sub jsonb := jsonb_build_object();
begin
  if array_length( indexes, 1 ) = 0 then return jsonb_build_object(); end if;

  select
    jsonb_agg(
        document->( key.index )
      ) into sub
  from unnest( indexes ) key( index )
  ;

  return coalesce( sub, jsonb_build_object() );
end;
$$;


--
-- TOC entry 448 (class 1255 OID 22926)
-- Name: jsonb_values(jsonb, text[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_values(document jsonb, VARIADIC keys text[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver varios valores de um documento em um sub-documento jsonb
   */
  sub jsonb := jsonb_build_object();
begin
  if array_length( keys, 1 ) = 0 then return jsonb_build_object(); end if;

  select
      jsonb_object_agg(
        key.name, document->( key.name )
      ) into sub
    from unnest( keys ) key( name )
  ;

  return coalesce( sub, jsonb_build_object() );
end;
$$;


--
-- TOC entry 449 (class 1255 OID 22927)
-- Name: jsonb_values_as(jsonb, text[]); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.jsonb_values_as(document jsonb, VARIADIC keys text[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função devolve um sub-docomento com os valores renomeados
    urgent: o numero de chave passada tem que ser par
   */
  sub jsonb := jsonb_build_object();
  length int;
begin

  length := array_length( keys, 1 );

  if length = 0 then return jsonb_build_object(); end if;

  -- A lista de chaves a ser renomeadas tem que ser par
  if ( length % 2 ) != 0 then
    raise exception 'lib.jsonb_values_as: lista de chaves impar';
  end if;

  select
      jsonb_object_agg(
        keys[ next.index +1 ], document-> keys[ next.index ]
      ) into sub
    from generate_series( 1, length, 2 ) next( index )
  ;

  return coalesce( sub, jsonb_build_object() );
end;
$$;


--
-- TOC entry 450 (class 1255 OID 22928)
-- Name: money(anyelement); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.money(moneyvalue anyelement) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
  vMoney character varying;
  positive boolean default moneyvalue >= 0;
begin
  if moneyvalue is null then return null; end if;
  moneyvalue := abs( moneyvalue );
  vMoney := to_char(moneyValue, 'FM999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999G999D90');
  vMoney := replace( vMoney, ',', ' ' );
  vMoney := replace( vMoney, '.', ',' );

  if not positive then
    vMoney := '-'||vMoney;
  end if;

  return lib.normalize( vMoney );
END;

$$;


--
-- TOC entry 451 (class 1255 OID 22929)
-- Name: result(boolean); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result(result boolean) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para devolver um resultado
   */
  _res lib.result;
begin
  _res.result := result;
  return _res;
end;
$$;


--
-- TOC entry 452 (class 1255 OID 22930)
-- Name: result(boolean, jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result(result boolean, message jsonb) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para devolver um resultado contumizado a medido do programador que fara uso
   */
  _res lib.result;
begin
  _res.result = result ;
  _res.message = message;
  return _res;
end;
$$;


--
-- TOC entry 453 (class 1255 OID 22931)
-- Name: result(boolean, text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result(result boolean, text text DEFAULT NULL::text) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  _res lib.result;
begin
  _res.result := result;
  _res.message := jsonb_build_object( 'text', text );
  return _res;
end;
$$;


--
-- TOC entry 454 (class 1255 OID 22932)
-- Name: result_catch(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_catch(message text) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** converter a caputra do SQLERRM em um result
  */
  _res lib.result;
begin
  _res := message::lib.result;
  return _res;

  exception when others then
    _res := lib.result_false( message::text );
    return _res;
end;
$$;


--
-- TOC entry 455 (class 1255 OID 22933)
-- Name: result_catch(character varying, text, text, text, text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_catch(errocode character varying DEFAULT NULL::character varying, message text DEFAULT NULL::text, hint text DEFAULT NULL::text, detail text DEFAULT NULL::text, context text DEFAULT NULL::text) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para criar uma instancia exception
   */
  _ex lib.exception;
  _res lib.result;
begin
  _ex.errcode :=  errocode;
  _ex.message := message;
  _ex.hint := hint;
  _ex.detail := detail;
  _ex.context := context;
  _ex.exception := true;

  _res.result := false;
  _res.message := to_jsonb( _ex ) || jsonb_build_object( 'text', _ex.message );
  return _res;
end;
$$;


--
-- TOC entry 456 (class 1255 OID 22934)
-- Name: result_concat(lib.result, lib.result); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_concat(lib.result, lib.result) RETURNS lib.result
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- This function concat the result message with other result message value
  select $1.result, $1.message||$2.message ;
$_$;


--
-- TOC entry 457 (class 1255 OID 22935)
-- Name: result_concat(lib.result, jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_concat(lib.result, jsonb) RETURNS lib.result
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- This function concat the result message with any jsonb value
  select $1.result, $1.message||$2 ;
$_$;


--
-- TOC entry 458 (class 1255 OID 22936)
-- Name: result_exception(text, character varying, text, text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_exception(text text, errcode character varying DEFAULT NULL::character varying, hint text DEFAULT NULL::text, detail text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
  -- base comment here
declare
  /** Essa função serve para criar uma exception
    errcode = R9999
  */
  DEFAULT_ERRCODE varchar default 'R9999';
  _res lib.result;
  _ex lib.exception;
begin
    _res := lib.result_false(
      to_jsonb( lib.exception(
          coalesce( errcode, DEFAULT_ERRCODE ),
          text,
          hint,
          detail
        )
      )
    );

  raise exception using
    errcode = coalesce( errcode, DEFAULT_ERRCODE ),
    message = coalesce( _res::text, '' )
  ;
end;
$$;


--
-- TOC entry 459 (class 1255 OID 22937)
-- Name: result_false(jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_false(content jsonb) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  _res lib.result;
begin
  _res.result = false ;
  _res.message = content;
  return _res;
end;
$$;


--
-- TOC entry 460 (class 1255 OID 22938)
-- Name: result_false(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_false(message text) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare

begin
  return lib.result_false(
      jsonb_build_object( 'text', message::text)
  );
end;
$$;


--
-- TOC entry 461 (class 1255 OID 22939)
-- Name: result_remove(lib.result, integer); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_remove(lib.result, integer) RETURNS lib.result
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- This function remove a key in result message
  select $1.result, $1.message - $2 ;
$_$;


--
-- TOC entry 462 (class 1255 OID 22940)
-- Name: result_remove(lib.result, text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_remove(lib.result, text) RETURNS lib.result
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- This function remove a key in result message
  select $1.result, $1.message - $2 ;
$_$;


--
-- TOC entry 463 (class 1255 OID 22941)
-- Name: result_true(); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_true() RETURNS lib.result
    LANGUAGE sql IMMUTABLE
    AS $$
-- result_true
select lib.result_true( 'true'  );
$$;


--
-- TOC entry 464 (class 1255 OID 22942)
-- Name: result_true(jsonb); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_true(content jsonb) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
begin
  return lib.result(
      true,
      content
  );
end;
$$;


--
-- TOC entry 465 (class 1255 OID 22943)
-- Name: result_true(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.result_true(message text) RETURNS lib.result
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para devolver um resultado verdadeiro acompanhado com a sua mensagem de texto
   */
begin
  return lib.result_true( jsonb_build_object( 'text', message::text) );
end;
$$;


--
-- TOC entry 466 (class 1255 OID 22944)
-- Name: str_is_numeric_sequence(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.str_is_numeric_sequence(argment text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para verificar se uma string é uma sequencia numerica inteira
   */
  list character [] default regexp_split_to_array( argment, '');
  nums character [] default regexp_split_to_array( '0123456789', '');
  c character;

begin
  foreach c in array list loop
    -- quando do carracter for diferente de todos os algarismos expressos no array
    if  c != all ( nums ) then
      return false;
    end if;
  end loop;

  return true;
end;

$$;


--
-- TOC entry 467 (class 1255 OID 22945)
-- Name: str_nospace(text); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.str_nospace(text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
/**
  Essa função serve para remover todos os espaçõs em uma string
 */
select lib.str_normalize( replace( $1, ' ', '' ) )
$_$;


--
-- TOC entry 468 (class 1255 OID 22946)
-- Name: swith(anyarray); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.swith(VARIADIC list anyarray) RETURNS anyelement
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  _element record;
begin

  -- List na posição 1 é o valor atual por isso não pode ser nulo
  if list[ 1 ] is null then return null; end if;

  -- distinct elements and clean null
  for _element in
    select *
      from unnest( list ) with ordinality li( element, index )
      where li.element is not null
  loop
    if _element.element = any ( list ) then continue;
    else list := list || _element.element;
    end if;
  end loop;

  -- Quando a lista tiver apenas um unico elemento
  if array_length( list, 1 ) = 2 and list[ 1 ] = list[ 2 ] then
    return list[ 1 ];
  elseif array_length( list, 1 ) = 2 then
    return null;
  end if;

  -- Para lista de mais de um elemento
  for i in 2 .. array_length( list, 1 ) loop

    if list[ i ] = list[ 1 ] and i = array_length( list, 1 ) then
      return list[ 2 ];
    elseif list[ i ] = list[ 1 ] then
      return list [ i+1 ];
    end if;
  end loop;

  return null;
end;
$$;


--
-- TOC entry 469 (class 1255 OID 22947)
-- Name: to_uuid(anyelement); Type: FUNCTION; Schema: lib; Owner: -
--



--
-- TOC entry 470 (class 1255 OID 22948)
-- Name: version(); Type: FUNCTION; Schema: lib; Owner: -
--

CREATE FUNCTION lib.version() RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
select 'v1-uuid.3.7::0 - 2019.04.09'
$$;


--
-- TOC entry 471 (class 1255 OID 22949)
-- Name: as_json(); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.as_json() RETURNS jsonb
    LANGUAGE sql
    AS $$
  --
  select to_jsonb( map.constant() );
$$;


--
-- TOC entry 472 (class 1255 OID 22950)
-- Name: constant(); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constant() RETURNS map.constant
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  /**
        Essa função serve para carregar os valores das constante e inicia-la
       */
select
  jsonb_populate_record(
      null::map.constant,
      jsonb_object_agg( cv.constvalue_name, cv.constvalue_value )
    )
from map.constvalue cv;
$$;


--
-- TOC entry 473 (class 1255 OID 22951)
-- Name: constant(name, regtype, anyelement, character varying, boolean, character varying); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constant(name name, type regtype, val anyelement, description character varying DEFAULT NULL::character varying, editable boolean DEFAULT false, comment character varying DEFAULT NULL::character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  /**
    * Essa função serve para registrar o valor de uma constante na base de dados
    * Se a constante já tiver o valor definido esse valor pode ser subistituido
      pelo novo desde que o parametro arg_constant_replace estiver verdadeiro
    * Caso existir sem o parametro arg_constant_replace verdadeiro uma excessão sera lançada
   */
  _constvalue map.constvalue;
  command text;
  arg_constant_continer regtype := 'map.constant'::regtype;
begin

  editable := coalesce( editable, false );

  select * into _constvalue
  from map.constvalue const
  where const.constvalue_name = name
  ;

  -- Destruir a constante casao existir
  command := format( 'alter type %s drop attribute if exists %I;', arg_constant_continer, name );
  execute command;

  -- Recriar a constante novamente
  command := format( 'alter type %s add attribute %I %s;', arg_constant_continer, name, type );
  execute command;

  if comment is not null then
    command := format( 'comment on column %s.%I is %L;', arg_constant_continer, name, comment );
  end if;

  -- Deletar o valor de constante
  delete from map.constvalue where constvalue_name = name;

  -- Recriar o valor de constante
  insert into map.constvalue(
    constvalue_name,
    constvalue_type,
    constvalue_value,
    constvalue_editable,
    constvalue_descrision,
    constvalue_comment
  ) values (
     name,
     type,
     val,
     editable,
     description,
     comment
   ) returning * into _constvalue;

  return false;
end;
$$;


--
-- TOC entry 474 (class 1255 OID 22952)
-- Name: constant_list(character varying[]); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constant_list(VARIADIC name character varying[] DEFAULT NULL::character varying[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
declare
begin
  $1 := coalesce( $1, array[ '' ]::text[] );
  -- Devolver o mapeamento dos estados
  return (
    with names as (
      select array_agg( distinct coalesce( un, '')||'%' ) as list
        from unnest( $1 ) un
    )
    select jsonb_object_agg( cv.constvalue_name, cv.constvalue_value )
      from map.constvalue cv
        inner join names na on true
      where cv.constvalue_name like any( na.list )
  );
end;
$_$;


--
-- TOC entry 475 (class 1255 OID 22953)
-- Name: constant_list(character varying); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constant_list(name character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- Devolver o mapeamento dos estados
  select jsonb_object_agg( cv.constvalue_name, cv.constvalue_value )
    from map.constvalue cv
    where cv.constvalue_name like coalesce( $1, '')||'%';
$_$;


--
-- TOC entry 476 (class 1255 OID 22954)
-- Name: constantdrop(name, boolean); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constantdrop(arg_constant_name name, arg_dropforce boolean DEFAULT false) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  /**
    * Essa função serve para registrar o valor de uma constante na base de dados
    * Se a constante já tiver o valor definido esse valor pode ser subistituido
      pelo novo desde que o parametro arg_constant_replace estiver verdadeiro
    * Caso existir sem o parametro arg_constant_replace verdadeiro uma excessão sera lançada
   */
  _constvalue map.constvalue;
  command text;
  arg_constant_continer regtype := 'map.constant'::regtype;
begin
  arg_dropforce := coalesce( arg_dropforce, false );
  select * into _constvalue
    from map.constvalue const
    where const.constvalue_name = arg_constant_name
  ;

  -- Destruir a constante casao existir
  if arg_dropforce then
    command := format( 'alter type %s drop attribute if exists %I cascade;', arg_constant_continer, arg_constant_name );
  else
    command := format( 'alter type %s drop attribute if exists %I;', arg_constant_continer, arg_constant_name );
  end if;
  execute command;

  -- Deletar o valor de constante
  delete from map.constvalue where constvalue_name = arg_constant_name;

  return true;
end;
$$;


--
-- TOC entry 477 (class 1255 OID 22955)
-- Name: constants(character varying); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.constants(name character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- Devolver o mapeamento dos estados
  select jsonb_object_agg( cv.constvalue_name, cv.constvalue_value )
    from map.constvalue cv
    where cv.constvalue_name like coalesce( $1, '')||'%';
$_$;


--
-- TOC entry 478 (class 1255 OID 22956)
-- Name: describe(character varying[]); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.describe(VARIADIC name character varying[] DEFAULT NULL::character varying[]) RETURNS TABLE(name name, type regtype, value text, editable boolean, descrision character varying, comment character varying)
    LANGUAGE sql IMMUTABLE
    AS $_$
  -- Devolver o mapeamento dos estados
  with names as (
    select array_agg( distinct coalesce( un, '')||'%' ) as list
      from unnest( $1 ) un
  )
  select cv.*
    from map.constvalue cv
      inner join names na on true
    where cv.constvalue_name like any( na.list ) ;
$_$;


--
-- TOC entry 479 (class 1255 OID 22957)
-- Name: funct_change_constvalue(jsonb); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.funct_change_constvalue(arg jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
      Essa função serve para atualizar o valor de uma constante
   */
  arg_constvalue_name name default arg->>'constvalue_name';
  arg_constvalue_value name default arg->>'constvalue_value';
  _constvalue map.constvalue;
begin
  select * into _constvalue
  from map.constvalue const
  where const.constvalue_name = arg_constvalue_name
  ;

  if not _constvalue.constvalue_editable then
    return lib.result_false( 'map.constvalue.editable-false' );
  end if;

  update map.constvalue
  set constvalue_value = arg_constvalue_value
  where constvalue_name = arg_constvalue_name
        returning * into _constvalue
  ;

  return lib.result_true(
    jsonb_build_object(
      'constvalue', _constvalue
    )
  );
end;
$$;


--
-- TOC entry 480 (class 1255 OID 22958)
-- Name: funct_load_constvalue(jsonb); Type: FUNCTION; Schema: map; Owner: -
--

CREATE FUNCTION map.funct_load_constvalue(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(constvalue_name name, constvalue_type regtype, constvalue_value text, constvalue_editable boolean, constvalue_descrision character varying, constvalue_comment character varying)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função serve para listar todas as constante que o valor poder ser atualizada
      == Listagem dos parametros
   */
begin
  return query
    select *
    from map.constvalue cons
    where cons.constvalue_editable;
end;
$$;


--
-- TOC entry 481 (class 1255 OID 22959)
-- Name: artigo_generate_nextcodigo(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE or replace FUNCTION rule.artigo_generate_nextcodigo( arg_classe_id uuid ) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
  _classe tweeks.classe;
begin
  update tweeks.classe
    set classe_lastcodigo = classe.classe_lastcodigo +1
    where classe_id = arg_classe_id
    returning * into _classe
  ;

  return lib.str_nospace( format('%s%s', _classe.classe_codigo, to_char( _classe.classe_lastcodigo, '0000' ) ) );
end;
$$;


--
-- TOC entry 482 (class 1255 OID 22960)
-- Name: artigo_has_open_account(integer); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE or replace FUNCTION rule.artigo_has_open_account( arg_artigo_id uuid ) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  -- Essa função serve para verificar se existe contas aberta com um artigo
  _const map.constant;
begin
  _const := map.constant();
  return (
    select count( * ) > 0
      from tweeks.venda vd
      where vd.venda_estado = _const.venda_estado_aberto
        and vd.venda_artigo_id = arg_artigo_id
  );
end
$$;


--
-- TOC entry 483 (class 1255 OID 22961)
-- Name: artigo_has_stock(integer, smallint, double precision); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.artigo_has_stock(
    arg_artigo_id uuid,
     arg_espaco_id uuid,
     arg_quantidadedebito double precision ) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para verificar se existe diponibilidade de um artig em um stock para cobrir uma quantidade de debito
   */
  _artigo tweeks.artigo;
  _stock tweeks.stock;
begin
  _artigo := tweeks._get_artigo( arg_artigo_id );

  -- Aceitar sempre que o artigo for do tipo staock negativo
  if _artigo.artigo_stocknegativo then return true; end if;

  _stock := tweeks._get_stock( arg_artigo_id, arg_espaco_id );
  return _stock.stock_quantidade >= arg_quantidadedebito;
end;
$$;


--
-- TOC entry 371 (class 1255 OID 22962)
-- Name: artigo_referencia(integer); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.artigo_referencia(arg_artigo_id uuid ) RETURNS jsonb
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  select jsonb_build_object( 'artigo_id', arg_artigo_id );
$$;


--
-- TOC entry 357 (class 1255 OID 22963)
-- Name: calculate_cost(float8, float8, float8); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE or replace FUNCTION rule.calculate_cost(
    arg_precario_quantidade double precision,
     arg_precario_custo double precision,
      arg_quantidade double precision )
      RETURNS double precision
    LANGUAGE sql
    AS $_$
  /** Essa função calcula o custo x quantidade de uma compra
    arg_precario_quantidade ----> arg_precario_custo
    arg_quantidade  ------------> $x
    $x = arg_quantidade * arg_precario_custo / arg_precario_quantidade
    */
  select arg_quantidade * arg_precario_custo / arg_precario_quantidade
$_$;


--
-- TOC entry 358 (class 1255 OID 22964)
-- Name: classe_generate_nextcodigo(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.classe_generate_nextcodigo() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare
  last_generated int;
begin
  select max( cla.classe_codigo::int ) into last_generated
    from tweeks.classe cla
  ;
  last_generated := coalesce( last_generated, 0 ) +1;
  return lib.str_nospace( to_char( last_generated, '000' ) );
end;
$$;


--
-- TOC entry 363 (class 1255 OID 22965)
-- Name: classe_referencia(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.classe_referencia(arg_classe_id uuid ) RETURNS jsonb
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
select jsonb_build_object( 'classe_id', arg_classe_id );
$$;


--
-- TOC entry 381 (class 1255 OID 22966)
-- Name: constant(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.constant() RETURNS map.constant
    LANGUAGE sql IMMUTABLE
    AS $$ select map.constant()$$;


--
-- TOC entry 484 (class 1255 OID 22967)
-- Name: conta_generata_series(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.conta_generata_series(arg_espaco_id uuid)
    RETURNS TABLE(serial_numero integer, serial_fatura character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para processar o numero da conta e o numero da fatura
   */
  _espaco tweeks.espaco;
begin

  _espaco := rule.espaco_get_serializer( arg_espaco_id );
  if _espaco.espaco_id is null then
    raise exception 'Não foi encontrado nenhum espaço de geração de fatura';
  end if;
  _espaco.espaco_serieconta := _espaco.espaco_serieconta +1;
  _espaco.espaco_seriefatura := _espaco.espaco_seriefatura +1;

  serial_numero := _espaco.espaco_serieconta;
  serial_fatura := format( 'FN-%s-%s%s', replace( _espaco.espaco_codigo, ' ', ''), to_char( current_date, 'yy' ), trim( to_char( _espaco.espaco_seriefatura, '00-0000' ) ) );

  update tweeks.espaco
    set espaco_serieconta = _espaco.espaco_serieconta,
        espaco_seriefatura = _espaco.espaco_seriefatura
    where espaco_id = _espaco.espaco_id
  ;
  return next;
end;
$$;


--
-- TOC entry 485 (class 1255 OID 22968)
-- Name: espaco_get_childrens(smallint, smallint); Type: FUNCTION; Schema: rule; Owner: -
--
drop function if exists rule.espaco_get_childrens(arg_espaco_id uuid, arg_tespaco_id smallint);
CREATE or replace FUNCTION rule.espaco_get_childrens(
    arg_espaco_id uuid DEFAULT null,
    arg_tespaco_id smallint DEFAULT NULL
    ) RETURNS uuid[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  /**
    Essa função devolve os espaços afilhado a um espaco
    arg_espaco_id := id do espaço
    arg_tespaco_id := o tipo do espaço
   */
begin
  if arg_espaco_id is null then
    return array( select esp.espaco_id from tweeks.espaco esp where esp.espaco_tespaco_id = coalesce( arg_tespaco_id, esp.espaco_tespaco_id ));
  else
    return array(
      with recursive list as (
        select e.espaco_id, e.espaco_tespaco_id from tweeks.espaco e where e.espaco_id = arg_espaco_id
        union all
        select e.espaco_id, e.espaco_tespaco_id
          from list l
            inner join tweeks.espaco e on l.espaco_id = e.espaco_espaco_id
      ) select l.espaco_id
        from list l
        where l.espaco_tespaco_id = coalesce( arg_tespaco_id, l.espaco_tespaco_id )
    );
  end if;
end;
$$;


--
-- TOC entry 486 (class 1255 OID 22969)
-- Name: espaco_get_parent(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.espaco_get_parent(arg_espaco_id uuid) RETURNS smallint[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função devolve os espaços afilhado a um espaco
    arg_espaco_id := id do espaço
    arg_tespaco_id := o tipo do espaço
   */
begin
    return array(
      with recursive list as (
        select e.espaco_id, e.espaco_espaco_id from tweeks.espaco e where e.espaco_id = arg_espaco_id
        union all
        select e.espaco_id, e.espaco_espaco_id
          from list l
            inner join tweeks.espaco e on l.espaco_espaco_id = e.espaco_id
      ) select l.espaco_id
        from list l
    );
end;
$$;


--
-- TOC entry 213 (class 1259 OID 22970)
-- Name: espaco; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.espaco (
    espaco_id uuid NOT NULL,
    espaco_tespaco_id smallint NOT NULL,
    espaco_trazao_id int2 default null,
    espaco_espaco_id uuid,
    espaco_colaborador_id uuid NOT NULL,
    espaco_colaborador_atualizaco uuid,
    espaco_nome character varying,
    espaco_descricao character varying,
    espaco_estado smallint DEFAULT (map.get('espaco_estado_ativo'::name))::smallint NOT NULL,
    espaco_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    espaco_dataatualizacao timestamptz,

    espaco_nivel smallint DEFAULT 0 NOT NULL,
    espaco_gerarfatura boolean DEFAULT true NOT NULL,
    espaco_configurar boolean DEFAULT true NOT NULL,
    espaco_codigo character varying NOT NULL,
    espaco_faturaano smallint DEFAULT date_part('year'::text, CURRENT_DATE) NOT NULL,
    espaco_seriefatura integer DEFAULT 0 NOT NULL,
    espaco_serieconta integer DEFAULT 0 NOT NULL,
    espaco_configuracao jsonb,
    CONSTRAINT ck_esoaco_descricao_normalized CHECK (lib.str_is_normalized((espaco_descricao)::text)),
    CONSTRAINT ck_esoaco_nome_normalized CHECK (lib.str_is_normalized((espaco_nome)::text))
);


--
-- TOC entry 4449 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE espaco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.espaco IS '#Espaço - Essa entidade serve para armazenar os espaços do stock';

comment on column tweeks.espaco.espaco_trazao_id is  $$Correnponde ao tipo de negocio a qual o espaço destina
    <ul>
        <li> 1 - Restaurante </li>
        <li> 2 - Venda </li>
        <li> 3 - Farmacia </li>
    </ul>
    $$;

--
-- TOC entry 4450 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_id IS 'Identificador único do espaço';


--
-- TOC entry 4451 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_tespaco_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_tespaco_id IS 'Identificador do tipo do espaço';


--
-- TOC entry 4452 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_colaborador_id IS 'Identificador do colaborador responsável pelo registro do espaço';


--
-- TOC entry 4453 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_colaborador_atualizaco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_colaborador_atualizaco IS 'Identificador do último colaborador responsavél pela atualização do espaço';


--
-- TOC entry 4454 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_nome IS 'Corresponde ao nome do espaço';


--
-- TOC entry 4455 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_descricao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_descricao IS 'Corresponde a descrição do espaço';


--
-- TOC entry 4456 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_estado IS '
  Estado do espaco
  <ul>
    <li> 1 - Ativo </li>
    <li> 0 - Fechado </li>
  </ul>
';


--
-- TOC entry 4457 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_dataregistro IS 'Corresponde ao instante em que o espaço foi registrado no sistema';


--
-- TOC entry 4458 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN espaco.espaco_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.espaco.espaco_dataatualizacao IS 'Corresponde ao instante em que o espaço foi atualizado pelo última vez';


--
-- TOC entry 487 (class 1255 OID 22986)
-- Name: espaco_get_serializer(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.espaco_get_serializer(arg_espaco_id uuid) RETURNS tweeks.espaco
    LANGUAGE plpgsql STRICT
    AS $$
declare
  /**
    Essa função serve para devolver o espaço onde deve ser processado a fatura
    arg_espaco_id := id do espaço
   */
  _espaco tweeks.espaco;
begin

  with recursive parent as (
      select e.* from tweeks.espaco e where e.espaco_id = arg_espaco_id
    union all
      select e.*
        from parent p
          inner join tweeks.espaco e on p.espaco_espaco_id = e.espaco_id
        where not p.espaco_gerarfatura
  ) select l.* into _espaco
    from parent l
    where l.espaco_gerarfatura
  ;

  -- Quando saltar do ano reiniciar a contagem das faturas
  if _espaco.espaco_id is not null and _espaco.espaco_faturaano < extract( year from current_date ) then
    update tweeks.espaco
      set espaco_faturaano = extract( year from current_date ),
          espaco_seriefatura  = 0
      where espaco_id = _espaco.espaco_id
      returning  * into _espaco;
  end if;

  return _espaco;
end;
$$;


--
-- TOC entry 214 (class 1259 OID 22987)
-- Name: movimento; Type: TABLE; Schema: tweeks; Owner: -
--

create table tweeks.movimento (
    movimento_id uuid NOT NULL,
    movimento_stock_id uuid NOT NULL,
    movimento_movimento_reference uuid default null,
    movimento_toperacao_id smallint NOT NULL,
    movimento_tmovimento_id smallint NOT NULL,
    movimento_espaco_auth uuid NOT NULL,
    movimento_colaborador_id uuid NOT NULL,
    movimento_colaborador_atualizacao uuid,
    movimento_referencia jsonb,
    movimento_data date,
    movimento_documento character varying,
    movimento_quantidade double precision,
    movimento_quantidadeinicia double precision,
    movimento_quantidadefinal double precision,
    movimento_observacao character varying,
    movimento_estado smallint DEFAULT (map.get('movimento_estado_ativo'::name))::smallint NOT NULL,
    movimento_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    movimento_dataatualizacao timestamptz
);


--
-- TOC entry 4459 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE movimento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.movimento IS 'Essa entidade serve para armazenar as movimentações dos artigos feito nos stocks';


--
-- TOC entry 4460 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_id IS 'Corresponde ao identificador único da movimentação';


--
-- TOC entry 4461 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_stock_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_stock_id IS 'Identificador do stock a qual foi moviemntado o artigo';


--
-- TOC entry 4462 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_toperacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_toperacao_id IS 'Identificador do timo de movimentação';


--
-- TOC entry 4463 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_tmovimento_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_tmovimento_id IS 'O tipo de operação da movimentação
<ul>
  <li> credito: 1 </li>
  <li> debito: -1 </li>
</ul>
';


--
-- TOC entry 4464 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_colaborador_id IS 'Identificador do colaborador responsável pelo registro da movimentação';


--
-- TOC entry 4465 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização';


--
-- TOC entry 4466 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_referencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_referencia IS 'Referencia da operação que criou a movimentação
<ul>
  <li> acreto_id: ID </li>
  <li> entrada_id: ID </li>
  <li> venda_id: ID </li>
  <li> transferencia_id: ID </li>
</ul>';


--
-- TOC entry 4467 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_data IS 'A data em que a movimentação foi feita';


--
-- TOC entry 4468 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_documento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_documento IS 'O documento da movimentação';


--
-- TOC entry 4469 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_quantidade IS 'A quantidade do artigo movimentado';


--
-- TOC entry 4470 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_quantidadeinicia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_quantidadeinicia IS 'A quantidade inicial do artigo antes da movimentação';


--
-- TOC entry 4471 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_quantidadefinal; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_quantidadefinal IS 'A quantidade final do artigo após a movimentação';


--
-- TOC entry 4472 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_observacao IS 'Corresponde a observação da movimentação';


--
-- TOC entry 4473 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_estado IS 'Corresponde ao estado da movimentação
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Anulado | siginifica que a operação foi anulada (uma operação já confirmada que é anulado) </li>
  <li> -1 - Canselado | significa que a operação foi canselado (o caso de venda quado o produto é removido do carinho) </li>
</ul>';


--
-- TOC entry 4474 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_dataregistro IS 'Corresponde ao instante em que a movimentação foi criada';


--
-- TOC entry 4475 (class 0 OID 0)
-- Dependencies: 214
-- Name: COLUMN movimento.movimento_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.movimento.movimento_dataatualizacao IS 'Corresponde ao instante em que a movimentação foi atualiza pela sua última vez';


--
-- TOC entry 488 (class 1255 OID 22996)
-- Name: movimento_create(smallint, integer, smallint, smallint, jsonb, float8, smallint, float, date, character varying); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.movimento_create(
    arg_espaco_auth uuid,
     arg_colaborador_id uuid,
      arg_stock_id uuid,
       arg_toperacao_id smallint,
        arg_movimento_referencia jsonb,
         arg_movimento_quantidade float,
          arg_tmovimento_id smallint,
           arg_movimento_quantidadefinal double precision DEFAULT NULL::double precision,
            arg_movimento_data date DEFAULT CURRENT_DATE,
             arg_movimento_documento character varying DEFAULT NULL::character varying
             ) RETURNS tweeks.movimento
    LANGUAGE plpgsql
    AS $$
declare
  /** Registar um novo movimento no stock*/
  arg_operacao_nome varchar;

  _stock tweeks.stock;
  _artigo tweeks.artigo;
  _espaco tweeks.espaco;
  _const map.constant;
  _movimento tweeks.movimento;
  _tmovimento tweeks.tmovimento;
begin

  _const := map.constant();
  if arg_tmovimento_id not in ( _const.tmovimento_credito, _const.tmovimento_debito ) then
    raise exception 'Movimento rejeitado (tipo de movimento desconhecido)';
  end if;

  if arg_movimento_quantidade < 0 then
    raise exception 'Movimento rejeitado (Quantidade negativa)';
  end if;

  _tmovimento := tweeks._get_tmovimento( arg_tmovimento_id );
  _stock := tweeks._get_stock( arg_stock_id );
  _artigo := tweeks._get_artigo( _stock.stock_artigo_id );
  _espaco := tweeks._get_espaco( _stock.stock_espacao_id );


  arg_movimento_quantidadefinal := coalesce( arg_movimento_quantidadefinal, _stock.stock_quantidade + ( arg_movimento_quantidade * _tmovimento.tmovimento_multiplo ) );
  arg_movimento_data := coalesce( arg_movimento_data, current_date );

  if arg_movimento_quantidadefinal < 0  and not _artigo.artigo_stocknegativo then

    arg_operacao_nome := case
      when _tmovimento.tmovimento_id = _const.tmovimento_debito then 'Debito'
      when _tmovimento.tmovimento_id = _const.tmovimento_credito then 'Credito'
    end;
    --                             OPR    ART   ESP
    raise exception '%', format( 'O %s de %s %s em %s não pode ser concluido! Stock disponivél não soficiente para a operação (artigo não aceita stock negativo).',
      arg_operacao_nome,
      arg_movimento_quantidade,
      _artigo.artigo_nome,
      _espaco.espaco_nome
    );
  end if;

  insert into tweeks.movimento(
    movimento_espaco_auth,
    movimento_colaborador_id,
    movimento_stock_id,
    movimento_toperacao_id,
    movimento_referencia,
    movimento_data,
    movimento_quantidade,
    movimento_quantidadeinicia,
    movimento_quantidadefinal,
    movimento_tmovimento_id,
    movimento_documento
  ) values (
    arg_espaco_auth,
    arg_colaborador_id,
    _stock.stock_id,
    arg_toperacao_id,
    arg_movimento_referencia,
    arg_movimento_data,
    arg_movimento_quantidade,
    _stock.stock_quantidade,
    arg_movimento_quantidadefinal,
    arg_tmovimento_id,
    arg_movimento_documento
  ) returning * into _movimento;

  return _movimento;
end;
$$;


--
-- TOC entry 490 (class 1255 OID 22998)
-- Name: movimento_revert(smallint, integer, smallint, smallint, character varying, text, smallint, character varying); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.movimento_revert(
arg_espaco_auth uuid,
arg_colaborador_id uuid,
 arg_toperacao_id smallint,
  arg_movimento_tmovimento_id smallint,
  arg_referencia_key character varying,
   arg_referencia_value text,
    arg_movimento_estado smallint,
     arg_movimento_observacao character varying) RETURNS tweeks.movimento
    LANGUAGE plpgsql
    AS $$
declare
  _movimento tweeks.movimento;
  _const map.constant;
begin
  _const := map.constant();

  if arg_movimento_estado not in ( _const.movimento_estado_canselado, _const.movimento_estado_canselado ) then
    raise exception 'Não pode reverter o movimento! estado invalido, code:{key: %, value: %, opr: %, tmv: %, usr: %, rev-mod: % }',
      arg_referencia_key, arg_referencia_value, arg_movimento_tmovimento_id, arg_toperacao_id, arg_colaborador_id, arg_movimento_estado;
  end if;

  select * into _movimento
    from tweeks.movimento mv
    where mv.movimento_referencia ->> ( arg_referencia_key ) = arg_referencia_value
      and mv.movimento_estado = _const.movimento_estado_ativo
      and mv.movimento_toperacao_id = arg_toperacao_id
      and mv.movimento_tmovimento_id = arg_movimento_tmovimento_id
      and mv.movimento_espaco_auth = arg_espaco_auth
    order by mv.movimento_dataregistro desc
  ;

  -- Se encontar alguma movimento que possa ser revertito então reverte
  if _movimento.movimento_id is not null then
    update tweeks.movimento
      set movimento_colaborador_atualizacao = arg_colaborador_id,
        movimento_dataatualizacao = current_timestamp,
        movimento_estado = arg_movimento_estado
      where movimento_id = _movimento.movimento_id
      returning * into _movimento
    ;
  end if;

  return _movimento;
end;
$$;


--
-- TOC entry 215 (class 1259 OID 22999)
-- Name: precario; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.precario (
    precario_id uuid NOT NULL,
    precario_espaco_auth uuid NOT NULL,
    precario_colaborador_id uuid NOT NULL,
    precario_colaborador_atualizacao uuid,
    precario_referencia jsonb NOT NULL,
    precario_custo double precision,
    precario_quantidade double precision,
    precario_estado smallint DEFAULT (map.get('precario_estado_ativo'::name))::smallint NOT NULL,
    precario_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    precario_dataatualizacao timestamptz
);


--
-- TOC entry 4476 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE precario; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.precario IS 'Essa entidade serve para armazenar os preços dos artigos de venda';


--
-- TOC entry 4477 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_id IS 'Identificador único do precario';


--
-- TOC entry 4478 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_colaborador_id IS 'Identificador do colaborador responsável pela atualização do preco';


--
-- TOC entry 4479 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização do preco (colaborador que encerou o preco)';


--
-- TOC entry 4480 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_referencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_referencia IS 'Ojecto referencial do preco
<ul>
  <li> artigo_id: ID </li>
</ul>';


--
-- TOC entry 4481 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_custo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_custo IS 'Corresponde ao custo da quantidade';


--
-- TOC entry 4482 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_quantidade IS 'Correspode a quantidade do artigo que vale o custo';


--
-- TOC entry 4483 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_estado IS 'Corresponde ao estado do precario
<ul>
  <li> ativo </li>
  <li> fechado </li>
</ul>';


--
-- TOC entry 4484 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_dataregistro IS 'Corresponde ao instante em que o precario foi cadastrado';


--
-- TOC entry 4485 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN precario.precario_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.precario.precario_dataatualizacao IS 'Corresponde ao instante em que o precario foi atualizado';


--
-- TOC entry 491 (class 1255 OID 23007)
-- Name: precario_espaco(tweeks.precario, map.constant, smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.precario_espaco(
_precario tweeks.precario,
 _const map.constant,
  arg_espaco_auth uuid) RETURNS tweeks.precario
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para devolver o precario subscrita em um espaco
   */
  _precario_over tweeks.precario;
begin
  -- Quando o espaço que pediu for espaço da taxa então devolver a propria taxa
  if _precario.precario_espaco_auth = arg_espaco_auth then return _precario; end if;

  with recursive parent as (
      select
        e.*,
        pr                         over_taxa,
        pr.precario_id is not null self_taxa

      from tweeks.espaco e
        left join tweeks.precario pr on pr.precario_espaco_auth = e.espaco_id
          and pr.precario_referencia @> _precario.precario_referencia
          and pr.precario_estado = _const.precario_estado_ativo
      where e.espaco_id = arg_espaco_auth
    union all
      select
        e.*,
        pr as over_taxa,
        pr.precario_id is not null as self_taxa
      from parent p
             inner join tweeks.espaco e on p.espaco_espaco_id = e.espaco_id
             left join tweeks.precario pr on e.espaco_id = pr.precario_espaco_auth
        and pr.precario_estado = _const.precario_estado_ativo
        and pr.precario_referencia @> _precario.precario_referencia
      where not p.self_taxa --quando o parente não gerar fatura || quando o parente não ter taxa
  ) select (l.over_taxa).* into _precario_over
  from parent l
  where l.self_taxa
  ;

  if _precario_over.precario_id is null then
    _precario_over := _precario;
  end if;
  return _precario_over;
end;
$$;


--
-- TOC entry 216 (class 1259 OID 23008)
-- Name: taxa; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.taxa (
    taxa_id uuid NOT NULL,
    taxa_tipoimposto_id uuid NOT NULL,
    taxa_espaco_auth uuid NOT NULL,
    taxa_colaborador_id uuid NOT NULL,
    taxa_colaborador_atualizacao uuid,
    taxa_percentagem double precision,
    taxa_taxa double precision,
    taxa_estado smallint DEFAULT (map.get('taxa_estado_ativo'::name))::smallint NOT NULL,
    taxa_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    taxa_dataatualizacao timestamptz,
    CONSTRAINT ck_taxa_percentagem_or_value_isnull CHECK (((taxa_percentagem IS NULL) OR (taxa_taxa IS NULL))),
    CONSTRAINT ck_taxa_percentagem_or_value_notnull CHECK (((taxa_percentagem IS NOT NULL) OR (taxa_taxa IS NOT NULL)))
);


--
-- TOC entry 4486 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE taxa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.taxa IS 'Essa entidade serve para registar as taxa de impostos';


--
-- TOC entry 4487 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_id IS 'Identificador único da taxa do imposto';


--
-- TOC entry 4488 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_tipoimposto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_tipoimposto_id IS 'O imposto o qual a taxa pertence';


--
-- TOC entry 4489 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_colaborador_id IS 'Identificador do colaborador responsável pelo registro da taxa';


--
-- TOC entry 4490 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização dat taxa (colaborador que fechou a taxa)';


--
-- TOC entry 4491 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_percentagem; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_percentagem IS 'Corresponde a percentagem da taxa a ser aplicado nos atrigos';


--
-- TOC entry 4492 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_taxa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_taxa IS 'Corresponde ao valor da taxa (para o caso de imposto em que o valor da taxa não varia)';


--
-- TOC entry 4493 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_estado IS 'Corresponde ao estado da taxa';


--
-- TOC entry 4494 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_dataregistro IS 'Corresponde ao instante em que a taxa foi registrado';


--
-- TOC entry 4495 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN taxa.taxa_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.taxa.taxa_dataatualizacao IS 'Corresponde ao instante em que a taxa foi atualizado';


--
-- TOC entry 492 (class 1255 OID 23018)
-- Name: taxa_espaco(tweeks.taxa, map.constant, smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.taxa_espaco(
_taxa tweeks.taxa,
 _const map.constant,
  arg_espaco_auth uuid) RETURNS tweeks.taxa
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para devolver a taxa subscrita em um espaco
   */
  _taxa_over tweeks.taxa;
begin
  -- Quando o espaço que pediu for espaço da taxa então devolver a propria taxa
  if _taxa.taxa_espaco_auth = arg_espaco_auth then return _taxa; end if;

  with recursive parent as (
      select
        e.*,
        tx over_taxa,
        tx.taxa_id is not null self_taxa

      from tweeks.espaco e
        left join tweeks.taxa tx on tx.taxa_espaco_auth = e.espaco_id
          and tx.taxa_tipoimposto_id = _taxa.taxa_tipoimposto_id
          and tx.taxa_estado = _const.taxa_estado_ativo
      where e.espaco_id = arg_espaco_auth

    union all
      select
          e.*,
          tx as over_taxa,
          tx.taxa_id is not null as self_taxa
        from parent p
          inner join tweeks.espaco e on p.espaco_espaco_id = e.espaco_id
          left join tweeks.taxa tx on e.espaco_id = tx.taxa_espaco_auth
            and tx.taxa_estado = _const.taxa_estado_ativo
            and tx.taxa_tipoimposto_id = _taxa.taxa_tipoimposto_id
        where not p.self_taxa --quando o parente não gerar fatura || quando o parente não ter taxa
  ) select (l.over_taxa).* into _taxa_over
  from parent l
    where l.self_taxa
  ;

  raise notice '% %', _taxa_over.taxa_id, _taxa.taxa_id ;
  if _taxa_over.taxa_id is null then
    _taxa_over := _taxa;
  end if;
  return _taxa_over;
end;
$$;


--
-- TOC entry 493 (class 1255 OID 23019)
-- Name: taxa_retirar_percentagem_adicionada(float, float); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.taxa_retirar_percentagem_adicionada(
arg_value double precision,
 arg_percentagem double precision) RETURNS float
    LANGUAGE sql
    AS $$
    select ( arg_value * arg_percentagem ) / ( 100.0 + arg_percentagem );
  $$;


--
-- TOC entry 494 (class 1255 OID 23020)
-- Name: tg_acerto_after_insert_create_movimento(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_acerto_after_insert_create_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger server para acertar o valor do stock depois que for registrado o acerto*/
  _new tweeks.acerto;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;

  -- registra o movimento para efetuar o acerto ao stock
  perform rule.movimento_create(
    _new.acerto_espaco_auth,
    _new.acerto_colaborador_id,
    _new.acerto_stock_id,
    _const.toperacao_acerto,
    jsonb_build_object( 'acerto_id', _new.acerto_id ),
    _new.acerto_quantidade,
    _const.tmovimento_credito,
    _new.acerto_quantidade,
    _new.acerto_dataregistro::date,
    trim( lib.str_nospace( to_char( _new.acerto_id, '"AC#"000-000') ) )
  );
  return null;
end;
$$;


--
-- TOC entry 495 (class 1255 OID 23021)
-- Name: tg_agrega_after_insert_incremente_venda_montante(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_agrega_after_insert_incremente_venda_montante() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger incremento o montante de venda depois que for agregado um novo item extra **/
  _new tweeks.agrega;
begin
  _new := new;
  update tweeks.venda
    set
        venda_montanteagregado = venda_montanteagregado + _new.agrega_montante,
        venda_montantetotal = venda_montantetotal + _new.agrega_montante
    where venda_id = _new.agrega_venda_id
  ;

  return null;
end;
$$;


--
-- TOC entry 496 (class 1255 OID 23022)
-- Name: tg_agrega_after_update_adjust_venda_montante(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_agrega_after_update_adjust_venda_montante() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new tweeks.agrega;
  _old tweeks.agrega;
  _const map.constant;
begin
  _const := rule.constant();
  _new:=new;
  _old:=old;

  -- Quando canselar o item da venda decrementar o valor da venda
  if _new.agrega_estado != _old.agrega_estado and _new.agrega_estado = _const.agrega_estado_canselado then
    update tweeks.venda
      set venda_montanteagregado = venda_montanteagregado - _old.agrega_montante,
          venda_montantetotal =  venda_montantetotal - _old.agrega_montante
      where venda_id = _old.agrega_venda_id
    ;

  -- Quando o montante do item for atualizado
  elseif _new.agrega_montante != _old.agrega_montante then
    update tweeks.venda
      set venda_montanteagregado = venda_montanteagregado - _old.agrega_montante + _new.agrega_montante,
          venda_montantetotal = venda_montantetotal - _old.agrega_montante + _new.agrega_montante
      where  venda_id = _old.agrega_venda_id
    ;
  end if;

  return null;
end;
$$;


--
-- TOC entry 497 (class 1255 OID 23023)
-- Name: tg_amortizacao_afeter_insert_syncronize_montante(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_amortizacao_afeter_insert_syncronize_montante() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualizar o valor do montante em (posto, conta, ... )
   */
  arg_conta_id uuid;

  _new tweeks.amortizacao;
  _conta tweeks.conta;
  _const map.constant;
  _caixa tweeks.caixa;
begin
  _const := map.constant();
  _new := new;
  arg_conta_id := _new.amortizacao_referencia->>'conta_id';
  _caixa := tweeks._get_caixa( _new.amortizacao_caixa_id );

  -- Se o movimentação for de uma conta
  if arg_conta_id is not null then
    _conta := tweeks._get_conta( arg_conta_id );
    _conta.conta_montanteamortizado := _conta.conta_montanteamortizado + _new.amortizacao_montante + _new.amortizacao_montantetroco;
    _conta.conta_montantemoeda := _conta.conta_montantemoeda + _new.amortizacao_montantemoeda;
    _conta.conta_taxacambio := _new.amortizacao_taxacambio;

    -- Calcular o valor do troco
    if _conta.conta_montanteamortizado > ( _conta.conta_montante - _conta.conta_desconto ) then
      _conta.conta_montantetroco := _conta.conta_montanteamortizado - ( _conta.conta_montante - _conta.conta_desconto );
      _conta.conta_montanteamortizado := ( _conta.conta_montante - _conta.conta_desconto );
    end if;

    -- Fechar a conta se o novo montante amortizado pagar o valor da conta
    if _conta.conta_montanteamortizado >= ( _conta.conta_montante - _conta.conta_desconto ) and _conta.conta_estado != _const.conta_estado_pago then
      _conta.conta_estado := _const.conta_estado_pago;
    end if;

    update tweeks.conta
      set conta_montanteamortizado = _conta.conta_montanteamortizado,
          conta_montantemoeda = _conta.conta_montantemoeda,
          conta_taxacambio = _conta.conta_taxacambio,
          conta_caixa_fechopagamento = _caixa.caixa_id,
          conta_montantetroco = _conta.conta_montantetroco,
          conta_estado = _conta.conta_estado,
          conta_dataatualizacao = current_timestamp,
          conta_colaborador_atualizacao = _new.amortizacao_colaborador_id
      where conta_id = _conta.conta_id
    ;
  end if;

  perform rule.transacao_create(
    _new.amortizacao_espaco_auth,
    _caixa.caixa_posto_id,
    _const.toperacao_pagamento,
    _const.tmovimento_credito,
    _new.amortizacao_colaborador_id,
    _new.amortizacao_montante,
    _new.amortizacao_documento,
    jsonb_build_object( 'amortizacao_id', _new.amortizacao_id ),
    false,
    null
  );

  return null;
end;
$$;


--
-- TOC entry 498 (class 1255 OID 23024)
-- Name: tg_artigo_after_update_sync_name(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_artigo_after_update_sync_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new tweeks.artigo;
  _old tweeks.artigo;
begin
  _new := new;
  _old := old;

  -- Quando o nome do artigo for atualizado     atualizar os nome da link em que o artiga esta associado
  if _old.artigo_nome != _new.artigo_nome then
    update tweeks.link
      set link_nome = _new.artigo_nome
      where link_artigo_id = _old.artigo_id
    ;
  end if;

  return null;
end;
$$;


--
-- TOC entry 499 (class 1255 OID 23025)
-- Name: tg_caixa_after_insert_abrir_posto(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_caixa_after_insert_abrir_posto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função deve abrir uma posto depois que for inserido uma nova caixa de posto
   */
  _new tweeks.caixa;
  _const map.constant;
begin
  _new := new;
  _const := map.constant();

  update tweeks.posto cx
    set posto_estado = _const.posto_estado_aberto
    where posto_id = _new.caixa_posto_id
  ;

  return null;
end;
$$;


--
-- TOC entry 500 (class 1255 OID 23026)
-- Name: tg_caixa_after_updade_fechar_posto(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_caixa_after_updade_fechar_posto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função deve fechar uma posto depois que a sua caixa tiver fechada
   */
  _new tweeks.caixa;
  _old tweeks.caixa;
  _const map.constant;
begin
  _new := new;
  _old := old;
  _const := map.constant();

  -- Quando o estado da caixa for fechado
  if _new.caixa_estado = _const.caixa_estado_fechado
    and _new.caixa_estado != _old.caixa_estado
  then
    update tweeks.posto cx
      set posto_estado = _const.posto_estado_fechado
      where posto_id = _new.caixa_posto_id
    ;
  end if;

  return null;
end;
$$;


--
-- TOC entry 501 (class 1255 OID 23027)
-- Name: tg_conta_after_insert_close_mesa(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_conta_after_insert_close_mesa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /**Esse trigger fecha o estado da mesa depois que uma nova conta é registrado
  */
  _new tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;

  -- Colocar a mesa como ocupado depois que uma conta é registrado
  if _new.conta_mesa_id is not null then
    update tweeks.mesa
      set mesa_estado = _const.mesa_estado_ocupado
      where mesa_id = _new.conta_mesa_id
    ;
  end if;

  return null;
end;
$$;


--
-- TOC entry 502 (class 1255 OID 23028)
-- Name: tg_conta_after_update_adjust_venda_estado(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_conta_after_update_adjust_venda_estado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger serve para ajustar o montante da caixa depois que uma conta for atualizada
  */
  _new tweeks.conta;
  _old tweeks.conta;
  _const map.constant;

  arg_venda_estado int2;
begin
  _const := map.constant();
  _new := new;
  _old := old;

  /**
    Atualizar o estado das vendas depois que a conta for atualizado
    O montante da caixa sera atualizado no momento que for feito o registro de amortizacao
    É nesse momento que um trigger de amortizacão atualizara tambem a conta{
      +> amortizacao
        => posto
        => conta
    }
   */

  -- prepar o novo estado para avenda
  if _old.conta_estado != _new.conta_estado and _old.conta_estado in (
    _const.conta_estado_aberto,
    _const.conta_estado_fechado
  ) and _new.conta_estado in (
    _const.conta_estado_fechado,
    _const.conta_estado_pago,
    _const.conta_estado_anulado
  ) then
    arg_venda_estado := case
      when _new.conta_estado = _const.conta_estado_fechado then _const.venda_estado_fechado
      when _new.conta_estado = _const.conta_estado_pago    then _const.venda_estado_fechado
      when _new.conta_estado = _const.conta_estado_anulado then _const.venda_estado_anulado
    end;

    -- fechar ou anular a venda da conta
    update tweeks.venda
      set venda_estado = arg_venda_estado
      where venda_conta_id = _old.conta_id
        and venda_estado != arg_venda_estado
        and venda_estado in (
          _const.venda_estado_aberto,
          _const.venda_estado_fechado
        );
  end if;

  return null;
end;
$$;


--
-- TOC entry 503 (class 1255 OID 23029)
-- Name: tg_conta_after_update_change_mesa_esatdo(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_conta_after_update_change_mesa_esatdo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger alter o estado da mesa de acordo com o estado da conta
  */
  _new tweeks.conta;
  _old tweeks.conta;
  _const map.constant;

begin
  _const := map.constant();
  _new := new;
  _old := old;


  -- Liberar todoas as mesas ocupadas sem contas abertas associados a ela
  update tweeks.mesa
    set mesa_estado = _const.mesa_estado_disponivel
    where mesa_id in (
      select  m.mesa_id
      from tweeks.conta ct
             inner join tweeks.mesa m on ct.conta_mesa_id = m.mesa_id
      where ct.conta_mesa_id in ( _new.conta_mesa_id, _old.conta_mesa_id )
        and m.mesa_estado = _const.mesa_estado_ocupado
        and ct.conta_estado != _const.conta_estado_aberto
    )
  ;

  -- Fechar as mesas disponivel com conta aberta
  update tweeks.mesa
    set mesa_estado = _const.mesa_estado_ocupado
    where mesa_id in (
      select  m.mesa_id
      from tweeks.conta ct
             inner join tweeks.mesa m on ct.conta_mesa_id = m.mesa_id
      where ct.conta_mesa_id in ( _new.conta_mesa_id, _old.conta_mesa_id )
        and m.mesa_estado = _const.mesa_estado_disponivel
        and ct.conta_estado = _const.conta_estado_aberto
    )
  ;

  return null;
end;
$$;


--
-- TOC entry 504 (class 1255 OID 23030)
-- Name: tg_entrada_after_insert_create_movimento(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_entrada_after_insert_create_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para ajustar o stock depois que for registrado uma noma entrada */
  _new tweeks.entrada;
  _stock tweeks.stock;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _stock := tweeks._get_stock( _new.entrada_artigo_id, _new.entrada_espaco_destino );

  perform rule.movimento_create(
    _new.entrada_espaco_auth,
    _new.entrada_colaborador_id,
    _stock.stock_id,
    _const.toperacao_entrada,
    jsonb_build_object( 'entrada_id', _new.entrada_id ),
    _new.entrada_quantidade,
    _const.tmovimento_credito,
    null,
    coalesce( _new.entrada_data, current_date ),
    _new.entrada_codigofatura
  );

  return null;
end;
$$;


--
-- TOC entry 505 (class 1255 OID 23031)
-- Name: tg_link_after_update_syncronize_sublinks(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_link_after_update_syncronize_sublinks() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para sicronizar o custo dos links associados ao link de associação */
  _new tweeks.link;
  _old tweeks.link;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _old := old;

  if _old.link_tlink_id = _const.tlink_associacao then

    -- Atualização do custo nas teclas
    if _old.link_quantidadecusto != _new.link_quantidadecusto
      or _old.link_custo != _new.link_custo
    then
      update tweeks.link
      set link_custo = _new.link_custo,
          link_quantidadecusto = _new.link_quantidadecusto
      where link_link_associacao = _old.link_link_associacao
      ;
    end if;

    -- Desativação das teclas pela desativação dos links associados que ainda estão ativas
    if _old.link_estado != _new.link_estado
      and _new.link_estado = _const.link_estado_fechado
      and _old.link_estado = _const.link_estado_associacao
    then
      update tweeks.link
        set link_estado = _const.link_estado_fechado
        where link_link_associacao = _old.link_id
          and link_estado != _const.link_estado_fechado
      ;
    end if;
  end if;

  return null;
end;
$$;


--
-- TOC entry 506 (class 1255 OID 23032)
-- Name: tg_movimento_after_insert_adjust_stock(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_movimento_after_insert_adjust_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Depois que o novo movimento for registrado atualizar o valor do stock
   */
  _new tweeks.movimento;
begin

  _new := new;
  update tweeks.stock
    set stock_quantidade = _new.movimento_quantidadefinal
    where stock_id = _new.movimento_stock_id
  ;

  return null;
end;
$$;


--
-- TOC entry 507 (class 1255 OID 23033)
-- Name: tg_movimento_after_update_adjust_stock(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_movimento_after_update_adjust_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Depois que o novo movimento for registrado atualizar o valor do stock
   */
  _new tweeks.movimento;
  _old tweeks.movimento;
  _const map.constant;
begin
  _new := new;
  _old := _old;

  if _new.movimento_estado != _old.movimento_estado and _old.movimento_estado in (
    _const.movimento_estado_ativo
  ) and _new.movimento_estado in (
    _const.movimento_estado_anulado,
    _const.movimento_estado_canselado
  ) then
    update tweeks.stock
      set stock_quantidade = stock_quantidade - _old.movimento_quantidadefinal + _old.movimento_quantidadeinicia
      where stock_id = _old.movimento_stock_id
    ;
  end if;

  return null;

end;
$$;


--
-- TOC entry 508 (class 1255 OID 23034)
-- Name: tg_precario_after_insert_update_custo(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE or replace FUNCTION rule.tg_precario_after_insert_update_custo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Esse triger serve para atualizar o preco no item ou no artigo depois que o novo precario for registrado
   */
  _new tweeks.precario;
  arg_item_id uuid;
  arg_artigo_id uuid;
  arg_link_id uuid;
begin
  _new := new;
  arg_item_id := _new.precario_referencia->>'item_id';
  arg_artigo_id := _new.precario_referencia->>'artigo_id';
  arg_link_id := _new.precario_referencia->>'link_id';


  -- Quando for um precario para aplicar no artigo então definir valor no artigo
  if arg_artigo_id is not null then
    update tweeks.artigo
    set artigo_custo = _new.precario_custo,
        artigo_quantidadecusto = _new.precario_quantidade
    where artigo_id = arg_artigo_id;
  end if;

  -- Se o preço for especifico para um link
  if arg_link_id is not null then
    update tweeks.link
      set link_custo = _new.precario_custo,
        link_quantidadecusto = _new.precario_quantidade
      where link_id = arg_link_id
    ;
  end if;

  return null;
end;
$$;





--
-- TOC entry 509 (class 1255 OID 23035)
-- Name: tg_stock_after_update(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_stock_after_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Esse trigger atualiza o valor do stok total do artigo
   */
  _new tweeks.stock;
  _old tweeks.stock;
  arg_artigo_stock double precision;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _old := old;

  if _new.stock_quantidade != _old.stock_quantidade then
    arg_artigo_stock := (
      select sum( stt.stock_quantidade )
      from tweeks.stock stt
      where stt.stock_artigo_id = _old.stock_artigo_id
        and stt.stock_estado = _const.stock_estado_ativo
    );

    update tweeks.artigo
      set artigo_stock = coalesce( arg_artigo_stock, 0.0 )
      where artigo_id = _old.stock_artigo_id
    ;
  end if;


  return null;
end;
$$;


--
-- TOC entry 510 (class 1255 OID 23036)
-- Name: tg_stock_before_insert_or_update_check_quantidade(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_stock_before_insert_or_update_check_quantidade() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Validadar a nova quantidade do artigo em stock*/
  _new tweeks.stock;
  _artigo tweeks.artigo;
  _espaco tweeks.espaco;
begin

  _new := new;
  _artigo := tweeks._get_artigo( _new.stock_artigo_id );
  _espaco := tweeks._get_espaco( _new.stock_espacao_id );



  if _new.stock_quantidade < 0 and not _artigo.artigo_stocknegativo then
    raise exception 'Operção rejeitada! A nova quantidade em stock do % em % inferior é de %s. Esse artigo não aceita stock negativo!',
      _artigo.artigo_nome,
      _espaco.espaco_nome,
      _new.stock_quantidade
    ;
  end if;

  return _new;
end;
$$;


--
-- TOC entry 430 (class 1255 OID 23037)
-- Name: tg_transacao_after_insert_adjust_posto_montante(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_transacao_after_insert_adjust_posto_montante() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new tweeks.transacao;
begin
  _new := new;

  -- Atualizar o valor no posto
  update tweeks.posto
    set posto_montante = _new.transacao_montantefinal
    where posto_id = _new.transacao_posto_id
  ;

  return null;
end;
$$;


--
-- TOC entry 511 (class 1255 OID 23038)
-- Name: tg_transferencia_after_insert_creante_movimento(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_transferencia_after_insert_creante_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new tweeks.transferencia;
  _const map.constant;
begin

  _const := map.constant();
  _new := new;

  -- Debitar o stock orrigem e creditar o destino
  perform rule.movimento_create(
    _new.transferencia_espaco_auth,
    _new.transferencia_colaborador_id,
    _new.transferencia_stock_origem,
    _const.toperacao_transferencia,
    jsonb_build_object( 'transferencia_id', _new.transferencia_id ),
    _new.transferencia_quantidade,
    _const.tmovimento_debito,
     null,
    coalesce( _new.transferencia_data, current_date ),
    _new.transferencia_documento
  );

  return null;
end;
$$;


--
-- TOC entry 512 (class 1255 OID 23039)
-- Name: tg_venda_after_insert_create_movimento(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_venda_after_insert_create_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger deve decrementar o valor do stock depois que um nova venda for registrado
   **/
  _new tweeks.venda;
  _stock tweeks.stock;
  _data record;
  _conta tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _data := tweeks._get_conta( _new.venda_conta_id );
  _stock := tweeks._get_stock( _new.venda_artigo_id, _new.venda_espaco_auth );
  _conta := tweeks._get_conta( _new.venda_conta_id );

  perform rule.movimento_create(
    _new.venda_espaco_auth,
    _new.venda_colaborador_id,
    _stock.stock_id,
    _const.toperacao_venda,
    jsonb_build_object( 'venda_id', _new.venda_id ),
    _new.venda_quantidade,
    _const.tmovimento_debito,
    null,
    null,
    _conta.conta_numerofatura
  );

  return null;
end;
$$;


--
-- TOC entry 513 (class 1255 OID 23040)
-- Name: tg_venda_after_update_adjust_agrega_estado(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_venda_after_update_adjust_agrega_estado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para ajustar os estados dos item extras agregado a venda depois que a venda for atualizado
  */
  _old tweeks.venda;
  _new tweeks.venda;
  _const map.constant;
  arg_agrega_estado int2;
begin
  _const := map.constant();
  _new:=new;
  _old:=old;

  -- Quando houver mudancas no estado de venda atualizar o estados nos itens agregado
  if _new.venda_estado != _old.venda_estado and _old.venda_estado in (
    _const.venda_estado_aberto,
    _const.venda_estado_fechado
  )  and _new.venda_estado in (
    _const.venda_estado_fechado,
    _const.venda_estado_anulado,
    _const.venda_estado_canselado
  ) then

    arg_agrega_estado := case
      when _new.venda_estado = _const.venda_estado_fechado then _const.agrega_estado_fechado
      when _new.venda_estado = _const.venda_estado_canselado then _const.agrega_estado_anulado
      when _new.venda_estado = _const.venda_estado_anulado then _const.agrega_estado_anulado
    end;

    -- Todos os itens agregados a
    update tweeks.agrega
      set agrega_estado = arg_agrega_estado
      where agrega_venda_id = _old.venda_id
        and agrega_estado in (
          _const.agrega_estado_fechado,
          _const.agrega_estado_aberto
        );
  end if;

  return null;
end;
$$;


--
-- TOC entry 514 (class 1255 OID 23041)
-- Name: tg_venda_after_update_adjust_conta_montante(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_venda_after_update_adjust_conta_montante() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse trigger serve para atualizar o montante de conta */
  _new tweeks.venda;
  _old tweeks.venda;
  _const map.constant;
begin

  _const := map.constant();
  _new := new;
  _old := old;

  -- raise exception 'ola works --11111';

  -- Quando o estada da venda for desativadao decrementar o valor
  if _old.venda_estado != _new.venda_estado and _new.venda_estado = _const.venda_estado_canselado then

    update tweeks.conta
      set conta_montante = conta_montante - coalesce( _old.venda_montantecomimposto, 0 )
      where conta_id  = _old.venda_conta_id
    ;

  -- Quando o valor do imposto para a venda for determinado então
  elseif _old.venda_montantecomimposto is null and _new.venda_montantecomimposto is not null then

    update tweeks.conta
      set conta_montante = conta_montante + _new.venda_montantecomimposto
      where conta_id = _old.venda_conta_id
    ;

  -- Quando o montante total da venda for atualizado
  elseif _old.venda_montantecomimposto != _new.venda_montantecomimposto then

    update tweeks.conta
      set conta_montante = conta_montante - coalesce( _old.venda_montantecomimposto, 0 ) + coalesce( _new.venda_montantecomimposto, 0 )
      where conta_id = _old.venda_conta_id
    ;
  end if;

  return null;
end;
$$;


--
-- TOC entry 515 (class 1255 OID 23042)
-- Name: tg_venda_after_update_create_or_cansel_movimento(); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tg_venda_after_update_create_or_cansel_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para ajustar o stock do artigo depois que uma nova venda for inserida
  **/
  _new tweeks.venda;
  _old tweeks.venda;
  _conta tweeks.conta;
  _stock_old tweeks.stock;
  _stock_new tweeks.stock;
  _const map.constant;
begin
  _const := map.constant();
  _new := new;
  _old := old;
  _conta := tweeks._get_conta( _old.venda_conta_id );
  _stock_old := tweeks._get_stock( _old.venda_artigo_id, _old.venda_espaco_auth );
  _stock_new := tweeks._get_stock( _old.venda_artigo_id, _new.venda_espaco_auth );

  -- Se a quantidade de venda for atualizado ou a venda mover do espaço
    -- reverver o movemento do stock anterior e criar um novo movimento do stock
  if _old.venda_quantidade != _new.venda_quantidade
    or _old.venda_espaco_auth != _new.venda_espaco_auth
  then
    perform rule.movimento_revert(
      _old.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _const.toperacao_venda,
      _const.tmovimento_debito,
      'venda_id',
      _old.venda_id::text,
      _const.movimento_estado_canselado,
      'Arigo removido da venda'
    );

    perform rule.movimento_create(
      _new.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _stock_new.stock_id,
      _const.toperacao_venda,
      jsonb_build_object( 'venda_id', _new.venda_id ),
      _new.venda_quantidade,
      _const.tmovimento_debito,
      null,
      null,
      _conta.conta_numerofatura
    );
  end if;


  -- Se a venda for canselado da conta então repor o stock do produto inicial
  if _old.venda_estado in ( _const.venda_estado_fechado, _const.venda_estado_aberto )
    and _new.venda_estado in ( _const.venda_estado_canselado, _const.venda_estado_anulado )
  then
    perform rule.movimento_revert(
      _old.venda_espaco_auth,
      coalesce( _new.venda_colaborador_atualizacao, _new.venda_colaborador_id ),
      _const.toperacao_venda,
      _const.tmovimento_debito,
      'venda_id',
      _old.venda_id::text,
      _const.movimento_estado_canselado,
      'Arigo removido da venda'
    );

  -- Quando a quantidade do produto for atualizado na venda
  -- Canselar o movimento anterior e criar um novo movimento
  end if;

  return null;
end;
$$;


--
-- TOC entry 516 (class 1255 OID 23043)
-- Name: tipoimposto_referencia(smallint); Type: FUNCTION; Schema: rule; Owner: -
--

CREATE FUNCTION rule.tipoimposto_referencia(arg_tipoimposto_id smallint) RETURNS jsonb
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
select jsonb_build_object( 'tipoimposto_id', arg_tipoimposto_id );
$$;


--
-- TOC entry 217 (class 1259 OID 23044)
-- Name: transacao; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.transacao (
    transacao_id uuid NOT NULL,
    transacao_posto_id uuid NOT NULL,
    transacao_toperacao_id smallint NOT NULL,
    transacao_tmovimento_id smallint NOT NULL,
    transacao_espaco_auth uuid NOT NULL,
    transacao_colaborador_id uuid NOT NULL,
    transacao_colaborador_atualizacao uuid,
    transacao_referencia jsonb,
    transacao_documento character varying,
    transacao_zerar boolean NOT NULL,
    transacao_montante double precision NOT NULL,
    transacao_montanteinicial double precision NOT NULL,
    transacao_montantefinal double precision NOT NULL,
    transacao_observacao character varying,
    transacao_estado smallint DEFAULT (map.get('transacao_estado_ativo'::name))::smallint NOT NULL,
    transacao_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    transacao_dataatualizacao timestamptz
);


--
-- TOC entry 4496 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE transacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.transacao IS 'Essa entidade serve para registar todas as transações em um posto';


--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_id IS 'Identificador único da transação';


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_posto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_posto_id IS 'Identificador do posto o qual foi transacionado';


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_toperacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_toperacao_id IS 'Identificador do tipo de operação';


--
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_tmovimento_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_tmovimento_id IS 'Identificador do tipo de movimento o qual foi feito na transação';


--
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_colaborador_id IS 'Identificador do colaborador responsável pelo registro do transacionamento';


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_colaborador_atualizacao IS 'Identificador do colaborador responsável pela última atualização da transação';


--
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_referencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_referencia IS 'Esse atribuito indica a referência da transação
<ul>
  <li> amortizacao_id: ID </li>
</ul>';


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_documento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_documento IS 'Corresponde ao documento usado para atranzação';


--
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_zerar; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_zerar IS 'Esse atributo indica se a tranzação foi com intuito de zerar ou não';


--
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_montante IS 'Corresponde ao montante que foi transacionado';


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_montanteinicial; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_montanteinicial IS 'Corresponde ao montente inicial antes da transação';


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_montantefinal; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_montantefinal IS 'Corresponde ao montante final depois da transação';


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_observacao IS 'Corresponde a uma observação para a transação';


--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_estado IS 'Corresponde ao estado da transação';


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_dataregistro IS 'Corresponde ao instante em que a transação foi resgistrada no sistema';


--
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN transacao.transacao_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transacao.transacao_dataatualizacao IS 'Corresponde ao instante em qua atransação foi atualizado pela última vez no sistema';


--
-- TOC entry 517 (class 1255 OID 23052)
-- Name: transacao_create(smallint, smallint, smallint, integer, float, character varying, jsonb, boolean, character varying); Type: FUNCTION; Schema: rule; Owner: -
--



CREATE FUNCTION rule.transacao_create(
    arg_espaco_auth uuid,
    arg_posto_id uuid,
     arg_toperacao_id smallint,
      arg_tmovimento_id smallint,
       arg_colaborador_id integer,
        arg_transacao_montante double precision,
         arg_transacao_documento character varying,
         arg_transacao_referencia jsonb DEFAULT NULL::jsonb,
          arg_transacao_zera boolean DEFAULT false,
           arg_transacao_observacao character varying DEFAULT NULL::character varying) RETURNS tweeks.transacao
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para registar as transações*/
  arg_transacao_montanteinicial double precision;
  arg_transacao_montantefinal double precision;
  _posto tweeks.posto;
  _const map.constant;
  _tmovimento tweeks.tmovimento;
  _transacao tweeks.transacao;

begin
  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );
  _tmovimento := tweeks._get_tmovimento( arg_tmovimento_id );


  -- Quando for para zerar o posto então o montante a debitar tem que ser o montante do posto
  arg_transacao_zera := coalesce( arg_transacao_zera, false );
  if arg_transacao_zera then
    arg_transacao_montante := _posto.posto_montante;
  end if;

  arg_transacao_montanteinicial := _posto.posto_montante;
  arg_transacao_montantefinal := _posto.posto_montante + ( _tmovimento.tmovimento_multiplo * arg_transacao_montante );

  insert into tweeks.transacao(
    transacao_posto_id,
    transacao_espaco_auth,
    transacao_toperacao_id,
    transacao_tmovimento_id,
    transacao_colaborador_id,
    transacao_referencia,
    transacao_documento,
    transacao_zerar,
    transacao_montante,
    transacao_montanteinicial,
    transacao_montantefinal,
    transacao_observacao
  ) values (
    arg_posto_id,
    arg_espaco_auth,
    arg_toperacao_id,
    arg_tmovimento_id,
    arg_colaborador_id,
    arg_transacao_referencia,
    arg_transacao_documento,
    arg_transacao_zera,
    arg_transacao_montante,
    arg_transacao_montanteinicial,
    arg_transacao_montantefinal,
    arg_transacao_observacao
  ) returning * into _transacao;

  return _transacao;
end;
$$;



--
-- TOC entry 218 (class 1259 OID 23055)
-- Name: artigo; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.artigo (
    artigo_id uuid NOT NULL,
    artigo_artigo_id uuid default null,
    artigo_classe_id uuid NOT NULL,
    artigo_espaco_auth uuid NOT NULL,
    artigo_colaborador_id uuid NOT NULL,
    artigo_colaborador_atualizacao uuid,
    artigo_codigo character varying NOT NULL,
    artigo_nome character varying NOT NULL,
    artigo_custo double precision,
    artigo_quantidadecusto double precision,
    artigo_preparacao boolean DEFAULT false NOT NULL,
    artigo_foto character varying,
    artigo_descricao character varying,
    artigo_stock double precision DEFAULT 0.0 NOT NULL,
    artigo_stocknegativo boolean DEFAULT false NOT NULL,
    artigo_stockminimo double precision,
    artigo_compostomultiplo double precision,
    artigo_estado smallint DEFAULT (map.get('artigo_estado_ativo'::name))::smallint NOT NULL,
    artigo_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    artigo_dataatualizacao timestamptz,
    CONSTRAINT ck_artigo_nome CHECK (lib.str_is_normalized((artigo_nome)::text))
);


--
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE artigo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.artigo IS '#Artigo - Essa entidade serve para registrar o astigos que serão vendidos';


--
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_id IS 'Identificador único do artigo';


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_classe_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_classe_id IS 'Identificador da classe a qual pertence o artigo';


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_colaborador_id IS 'Identificador do colaborador responsavel pelo resistro do artigo';


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_codigo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_codigo IS 'Corresponde ao codigo do artigo';


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_nome IS 'Corresponde ao nome do artigo';


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_custo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_custo IS 'Corresponde ao custo do artigo';


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_quantidadecusto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_quantidadecusto IS 'Corresponde a quantidade do artigo que vale o custo especificado';


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_preparacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_preparacao IS 'Indica se o artigo tem que ser preparado antes da sua venda';


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_foto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_foto IS 'Referencia da foto do artigo';


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_descricao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_descricao IS 'Descrição do artigo';


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_stocknegativo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_stocknegativo IS 'Esse atributo indica se o produto pode aceitar stock negativo ou não';


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_stockminimo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_stockminimo IS 'Esse atributo indica a quanitidade minima em stock para apresentar a alerta';


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_estado IS '
Estado do artigo
<ul>
  <li> 1 - Ativo | O artigo pode ser comercializado </li>
  <li> 0 - Fechado | O artigo não poder ser comercializado nesse estado </li>
</ul>
';


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_dataregistro IS 'Corresponde ao instante em que o artigo foi registrado do sistema';


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN artigo.artigo_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.artigo.artigo_dataatualizacao IS 'Corresponde ao instante em que o artigo foi atualizado pela última vez';


--
-- TOC entry 520 (class 1255 OID 23067)
-- Name: _get_artigo(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_artigo(arg_atigo_id uuid) RETURNS tweeks.artigo
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Ess funcao serve para obter uma instancia de artigo
  select * from tweeks.artigo art where art.artigo_id = arg_atigo_id;
$$;


--
-- TOC entry 219 (class 1259 OID 23068)
-- Name: caixa; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.caixa (
    caixa_id uuid NOT NULL,
    caixa_posto_id uuid NOT NULL,
    caixa_espaco_auth uuid NOT NULL,
    caixa_colaborador_id uuid NOT NULL,
    caixa_colaborador_atualizacao uuid,
    caixa_montanteinicial double precision NOT NULL,
    caixa_montanteinicialposto double precision,
    caixa_montantefecho double precision,
    caixa_montantefechoposto double precision,
    caixa_quantidadecheque smallint,
    caixa_quantidadechequeposto smallint,
    caixa_observacao character varying,
    caixa_estado smallint DEFAULT (map.get('caixa_estado_ativo'::name))::smallint NOT NULL,
    caixa_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    caixa_dataatualizacao timestamptz
);


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE caixa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.caixa IS 'Essa entidade serve para registar as caixas abertas pelos colaboradores';


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_id IS 'Identificador único da caixa';


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_posto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_posto_id IS 'Identificador do posto o qual emcontra-se a caixa';


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_colaborador_id IS 'Identificador do colaborador responsável pelo registro da caixa';


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização da caixa';


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_montanteinicial; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_montanteinicial IS 'Corresponde ao montante inicial em que a caixa foi aberta com ele';


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_montantefecho; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_montantefecho IS 'Corresponde ao montante em que a caixa foi fechado com ele';


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_quantidadecheque; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_quantidadecheque IS 'Corresponde a quantidade de pagamentos feitos em cheques na caixa';


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_observacao IS 'Observação deixada no fecho da caixa';


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_estado IS 'Estado da caixa
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>';


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_dataregistro IS 'Corresponde ao instante em que a caixa foi registrada';


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN caixa.caixa_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.caixa.caixa_dataatualizacao IS 'Corresponde ao instante em que a caixa foi atualizado pela última vez (instante em que a caixa foi fechada)';


--
-- TOC entry 521 (class 1255 OID 23076)
-- Name: _get_caixa(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_caixa(arg_caixa_id uuid) RETURNS tweeks.caixa
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função serve para obter uma instancia da caixa
select * from tweeks.caixa cx where cx.caixa_id = arg_caixa_id;
$$;


--
-- TOC entry 220 (class 1259 OID 23077)
-- Name: classe; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.classe (
    classe_id uuid NOT NULL,
    classe_classe_id uuid,
    classe_espaco_auth uuid NOT NULL,
    classe_colaborador_id uuid NOT NULL,
    classe_colaborador_atualizacao uuid,
    classe_nome character varying  NOT NULL,
    classe_codigo character varying DEFAULT rule.classe_generate_nextcodigo() NOT NULL,
    classe_foto character varying,
    classe_position smallint DEFAULT 0 NOT NULL,
    classe_lastcodigo smallint DEFAULT 0 NOT NULL,
    classe_estado smallint DEFAULT (map.get('classe_estado_ativo'::name))::smallint NOT NULL,
    classe_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    classe_dataatualizacao timestamptz DEFAULT current_timestamp,
    CONSTRAINT ck_classe_nome_normalized CHECK (lib.str_is_normalized((classe_nome)::text))
);


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE classe; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.classe IS '#Classe - Essa entidade serve para armazenar as classes do produto (categoria do porduto)';


--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_id IS 'Identificador único da classe';


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_colaborador_id IS 'Identificador do colaborador responsável pela última atualização';


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_nome IS 'Corresponde ao nome da classe';


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_estado IS ' Estado da classe
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>
';


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_dataregistro IS 'Corresponde ao instante em que a classe for registrada no sistema';


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN classe.classe_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.classe.classe_dataatualizacao IS 'Corresponde ao instnate em que a classe for atualizado pela sua última vez';


--
-- TOC entry 522 (class 1255 OID 23087)
-- Name: _get_classe(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_classe(arg_classe_id uuid) RETURNS tweeks.classe
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função devolve uma instancia da classe do artigo
select * from tweeks.classe clas where clas.classe_id = arg_classe_id;
$$;




--
-- TOC entry 222 (class 1259 OID 23090)
-- Name: conta; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.conta (
    conta_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conta_reserva_id uuid,
    conta_ccorrente_id uuid default null,
    conta_posto_id uuid,
    conta_caixa_fechopagamento uuid,
    conta_currency_id smallint,
    conta_tpaga_id smallint,
    conta_espaco_auth uuid NOT NULL,
    conta_colaborador_id uuid NOT NULL,
    conta_colaborador_atualizacao uuid,
    conta_mesa_id uuid,
    conta_numero integer NOT NULL,
    conta_titularnif character varying,
    conta_titular character varying,
    conta_data date,
    conta_numerofatura character varying DEFAULT NULL::character varying,
    conta_montante double precision DEFAULT 0.0 NOT NULL,
    conta_montanteamortizado double precision DEFAULT 0.0 NOT NULL,
    conta_montantetroco double precision DEFAULT 0 NOT NULL,
    conta_montantemoeda double precision DEFAULT 0.0 NOT NULL,
    conta_taxacambio double precision,
    conta_imprensa smallint DEFAULT 0 NOT NULL,
    conta_observacao character varying,
    conta_desconto double precision DEFAULT 0 NOT NULL,
    conta_estado smallint DEFAULT (map.get('conta_estado_aberto'::name))::smallint NOT NULL,
    conta_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    conta_dataatualizacao timestamptz,
    CONSTRAINT ck_conto_titular CHECK (lib.str_is_normalized((conta_titular)::text))
);


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE conta; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.conta IS 'Essa entidade serve para armazenar as contas das vendas feitas';


--
-- TOC entry 4549 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_id IS 'Identificador único da conta';


--
-- TOC entry 4550 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_reserva_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_reserva_id IS 'Identificador da reserva a qual a conta foi associada';


--
-- TOC entry 4551 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_posto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_posto_id IS 'Identificador da caixa a qual a conta foi aberta';


--
-- TOC entry 4552 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_caixa_fechopagamento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_caixa_fechopagamento IS 'Corresponde a caixa em que a conta teve o seu pagamento de fecho (apenas a última que conta, mas pode-se ver todas anterior na entidade amortização)';


--
-- TOC entry 4553 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_mesa_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_mesa_id IS 'Identificador da mesa a qual a conta foi registrada';


--
-- TOC entry 4554 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_currency_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_currency_id IS 'Identificador da moeda usada para o pagamento da conta';


--
-- TOC entry 4555 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_tpaga_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_tpaga_id IS 'Identificador do tipo de pagamento da conta';


--
-- TOC entry 4556 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_colaborador_id IS 'Identificador do colaborador responsável pelo registro da conta';


--
-- TOC entry 4557 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_colaborador_atualizacao IS 'Identificador do último colaborador responsavél pela atualização da conta (colaborador quem finalizou a conta)';


--
-- TOC entry 4558 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_titularnif; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_titularnif IS 'O nif do titular da conta';


--
-- TOC entry 4559 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_titular; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_titular IS 'Corresponde ao titular da conta (o nome do cliente)';


--
-- TOC entry 4560 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_data IS 'Corresponde a data da conta';


--
-- TOC entry 4561 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_numerofatura; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_numerofatura IS 'Corresponde ao numero de fatura gerado para a conta';


--
-- TOC entry 4562 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_montante IS 'Corresponde ao montante total da conta';


--
-- TOC entry 4563 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_montanteamortizado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_montanteamortizado IS 'Corresponde ao montante total amortizado na conta';


--
-- TOC entry 4564 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_montantetroco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_montantetroco IS 'Corresponde ao montante do troco da conta (já esta cluido do montante amortizado)';


--
-- TOC entry 4565 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_montantemoeda; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_montantemoeda IS 'Montante em moeda do conta';


--
-- TOC entry 4566 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_taxacambio; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_taxacambio IS 'Taxa de cambio';


--
-- TOC entry 4567 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_imprensa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_imprensa IS 'Corresponde ao numeros de impressão que a conta já teve';


--
-- TOC entry 4568 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_estado IS 'Corresponde ao estado atuala da conta
<ul>
  <li> 2 - Aberto  | pode efetuar quaisquer alteração na conta</li>
  <li> 1 - Fechado | não se pode alterar mais nada na conta (só anulação)</li>
  <li> 0 - Pago    | conta paga não se pode efetuar mais nenhuma alteração (só anulaçõa)</li>
  <li> -1 Anulado </li>
</ul>';


--
-- TOC entry 4569 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_dataregistro IS 'Corresponde ao instante em que a conta foi registrada';


--
-- TOC entry 4570 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_dataatualizacao IS 'Corresponde ao instante em que a conta foi atualizada pela última vez';


--
-- TOC entry 4571 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_observacao IS 'Corresponde a observação da conta, normalmente setado na anulação da conta';


--
-- TOC entry 4572 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN conta.conta_desconto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.conta.conta_desconto IS 'Esse atributo indica o montante em desconto da conta';


--
-- TOC entry 523 (class 1255 OID 23107)
-- Name: _get_conta(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_conta(arg_conta_id uuid) RETURNS tweeks.conta
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função devolve a instancia de uma conta
select * from tweeks.conta ct where ct.conta_id = arg_conta_id;
$$;


--
-- TOC entry 524 (class 1255 OID 23108)
-- Name: _get_espaco(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_espaco(arg_espaco_id uuid) RETURNS tweeks.espaco
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- essa função serve para devolver uma intancia do espaco
select * from tweeks.espaco esp where esp.espaco_id = arg_espaco_id;
$$;


--
-- TOC entry 525 (class 1255 OID 23109)
-- Name: _get_impostos_taxa(integer, smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_impostos_taxa(arg_artigo_id uuid, arg_espaco_auth uuid) RETURNS TABLE(
    percentagem_adicionar double precision,
    percentagem_retirar double precision,
     taxa_adicionar double precision,
      taxa_retirar double precision,
       taxas uuid[])
    LANGUAGE plpgsql
    AS $$
declare
  _const map.constant;
  _data record;
begin
  _const := map.constant();
  select
    sum( ( txass::tweeks.taxa ).taxa_percentagem ) filter ( where tap.taplicar_id = _const.taplicar_adicionar ) as percentagem_adicionar,
    sum( ( txass::tweeks.taxa ).taxa_percentagem ) filter ( where tap.taplicar_id = _const.taplicar_retirar ) as percentagem_retivar,
    sum( ( txass::tweeks.taxa ).taxa_taxa ) filter ( where tap.taplicar_id = _const.taplicar_adicionar ) as taxa_adicionar,
    sum( ( txass::tweeks.taxa ).taxa_taxa ) filter ( where tap.taplicar_id = _const.taplicar_retirar ) as taxa_retivar,
    array_agg( distinct (txass::tweeks.taxa).taxa_id ) as taxas
    into _data
  from tweeks.imposto ip
    inner join tweeks.taplicar tap on ip.imposto_taplicar_id = tap.taplicar_id
    inner join tweeks.taxa tx on ip.imposto_tipoimposto_id = tx.taxa_tipoimposto_id
      and tx.taxa_estado = _const.taxa_estado_ativo
      and tx.taxa_espaco_auth = ip.imposto_espaco_auth
    inner join rule.taxa_espaco( tx, _const, arg_espaco_auth ) txass on true
  where ip.imposto_artigo_id = arg_artigo_id
    and ip.imposto_estado = _const.imposto_estado_ativo;

  _get_impostos_taxa.percentagem_adicionar := coalesce( _data.percentagem_adicionar, 0 );
  _get_impostos_taxa.percentagem_retirar := coalesce( _data.percentagem_retivar, 0 );
  _get_impostos_taxa.taxa_adicionar := coalesce( _data.taxa_adicionar, 0 );
  _get_impostos_taxa.taxa_retirar := coalesce( _data.taxa_retivar, 0 );
  _get_impostos_taxa.taxas := coalesce( _data.taxas, array[]::uuid[] );
  return next;
end;
$$;


--
-- TOC entry 526 (class 1255 OID 23110)
-- Name: _get_item(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_item(arg_artigo_item uuid) RETURNS tweeks.artigo
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função devolve uma instancia da item do artigo
select * from tweeks.artigo itt where itt.artigo_id = arg_artigo_item
  and itt.artigo_classe_id = lib.to_uuid( 1 ) ; -- classe dos items
$$;


--
-- TOC entry 223 (class 1259 OID 23111)
-- Name: link; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.link (
    link_id uuid NOT NULL,
    link_link_id uuid,
    link_link_associacao uuid,
    link_tlink_id smallint NOT NULL,
    link_espaco_destino uuid NOT NULL,
    link_espaco_auth uuid NOT NULL,
    link_colaborador_id uuid NOT NULL,
    link_colaborador_atualizacao uuid,
    link_referencia jsonb,
    link_posicao smallint NOT NULL,
    link_nome character varying NOT NULL,
    link_extras jsonb,
    link_config jsonb,
    link_estado smallint DEFAULT (map.get('link_estado_ativo'::name))::smallint NOT NULL,
    link_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    link_dataatualizacao timestamptz
)
PARTITION BY LIST (link_estado);


--
-- TOC entry 4573 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE link; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.link IS 'Essa entidade serve para registar o item que deve ocupar uma tecla';


--
-- TOC entry 4574 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_id IS 'Identificador único do link';


--
-- TOC entry 4575 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_link_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_link_id IS 'Identificador da link parent';


--
-- TOC entry 4576 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_referencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_referencia IS 'Corresponde a referencia a que o link se aponta (artigo, link, classe ...)';


--
-- TOC entry 4577 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_espaco_destino; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_espaco_destino IS 'Identificador do espaço o qual a link pertence';


--
-- TOC entry 4578 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_colaborador_id IS 'Identificador do colaborador responsavél pelo registro do link';


--
-- TOC entry 4579 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização da link';


--
-- TOC entry 4580 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_posicao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_posicao IS 'Corresponde a posição em que a link deve ocupar';


--
-- TOC entry 4581 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_nome IS 'Corresponde ao nome da link';


--
-- TOC entry 4582 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_config; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_config IS 'Corresponde a cofifuração da link';


--
-- TOC entry 4583 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_estado IS 'Corresponde ao estado da link
<ul>
  <li> 2 - Ligação </ul>
  <li> 1 - Ativo </ul>
  <li> 0 - Fechado </ul>
</ul>
';


--
-- TOC entry 4584 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_dataregistro IS 'Corresponde ao instante em que a link foi registrada';


--
-- TOC entry 4585 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN link.link_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.link.link_dataatualizacao IS 'Corresponde ao instante em que a link foi atualizado pela última vez';


--
-- TOC entry 527 (class 1255 OID 23116)
-- Name: _get_link(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_link(arg_link_id uuid) RETURNS tweeks.link
    LANGUAGE sql
    AS $$
  -- Essa função serve para devolver a instancia de uma link
  select * from tweeks.link where link_id = arg_link_id;
$$;


--
-- TOC entry 224 (class 1259 OID 23117)
-- Name: mesa; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.mesa (
    mesa_id uuid NOT NULL,
    mesa_espaco_auth uuid NOT NULL,
    mesa_colaborador_id uuid NOT NULL,
    mesa_colaborador_atualizacao uuid,
    mesa_numero character varying NOT NULL,
    mesa_designacao character varying,
    mesa_lotacao smallint,
    mesa_estado smallint DEFAULT (map.get('mesa_estado_disponivel'::name))::smallint NOT NULL,
    mesa_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    mesa_dataatualizacao timestamptz
);


--
-- TOC entry 4586 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE mesa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.mesa IS 'Essa entidade serve para armazenar as mesas';


--
-- TOC entry 4587 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_id IS 'Identificador único da mesa';


--
-- TOC entry 4588 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_colaborador_id IS 'Identificador do colaborador responsavél pelo registro da mesa';


--
-- TOC entry 4589 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_colaborador_atualizacao IS 'Identificador do último colaborador responsável pela atualização da mesa';


--
-- TOC entry 4590 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_numero; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_numero IS 'Corresponde ao identificador da mesa';


--
-- TOC entry 4591 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_designacao IS 'Corresponde a designaçõa da mesa';


--
-- TOC entry 4592 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_lotacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_lotacao IS 'Corresponde ao numero de lotação maxima da mesa';


--
-- TOC entry 4593 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_estado IS 'Corresponde ao estado da mesa';


--
-- TOC entry 4594 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_dataregistro IS 'Corresponde a data em que a mesa foi registrado';


--
-- TOC entry 4595 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN mesa.mesa_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.mesa.mesa_dataatualizacao IS 'Corresponde a data em que a mesa foi registrado';


--
-- TOC entry 528 (class 1255 OID 23125)
-- Name: _get_mesa(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_mesa(arg_mesa_id uuid) RETURNS tweeks.mesa
    LANGUAGE sql
    AS $$
  -- Essa função serve para devolver uma instancia de uma mesa
  select *  from tweeks.mesa where mesa_id = arg_mesa_id;
$$;

--------- TODO PAREI A PARTIR DA LINHA ACIMA ------------------------
--------- TODO RECOMEÇAR A PARTIR DA LINHA DE BAIXO -----------------


--
-- TOC entry 529 (class 1255 OID 23126)
-- Name: _get_mesa(integer, character varying); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_mesa(
    arg_colaborador_id uuid, arg_mesa_designacao character varying) RETURNS tweeks.mesa
    LANGUAGE plpgsql
    AS $$
declare
  _mesa tweeks.mesa;
begin
  select * into _mesa
    from tweeks.mesa m
    where m.mesa_designacao = arg_mesa_designacao
  ;

  if _mesa.mesa_id is null and arg_mesa_designacao is not null then
    insert into tweeks.mesa (
      mesa_colaborador_id,
      mesa_designacao,
      mesa_numero
    ) values(
      arg_colaborador_id,
      arg_mesa_designacao,
      arg_mesa_designacao
    ) returning * into _mesa
    ;
  end if;

  return _mesa;
end;
$$;


--
-- TOC entry 530 (class 1255 OID 23127)
-- Name: _get_mesa(integer, smallint, character varying); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_mesa(arg_colaborador_id uuid, arg_espaco_auth uuid, arg_mesa_designacao character varying) RETURNS tweeks.mesa
    LANGUAGE plpgsql
    AS $$
declare
  _mesa tweeks.mesa;
begin
  select * into _mesa
  from tweeks.mesa m
  where m.mesa_designacao = arg_mesa_designacao
  ;

  if _mesa.mesa_id is null and arg_mesa_designacao is not null then
    insert into tweeks.mesa (
      mesa_colaborador_id,
      mesa_designacao,
      mesa_numero,
      mesa_espaco_auth
    ) values(
      arg_colaborador_id,
      arg_mesa_designacao,
      arg_mesa_designacao,
      arg_espaco_auth
    ) returning * into _mesa
    ;
  end if;

  return _mesa;
end;
$$;


--
-- TOC entry 225 (class 1259 OID 23128)
-- Name: posto; Type: TABLE; Schema: tweeks; Owner: -
--
CREATE TABLE tweeks.posto (
    posto_id uuid NOT NULL default public.uuid_generate_v4(),
    posto_tposto_id smallint NOT NULL,
    posto_espaco_auth uuid NOT NULL,
    posto_espaco_destino uuid NOT NULL,
    posto_colaborador_id uuid NOT NULL,
    posto_colaborador_atualizacao uuid,

    posto_designacao character varying,
    posto_montante double precision NOT NULL,
    posto_endereco character varying NOT NULL,
    posto_multipleuser boolean DEFAULT true NOT NULL,
    posto_ip character varying,
    posto_mac character varying,
    posto_hostname character varying,
    posto_ipv4 character varying,
    posto_ipv6 character varying,
    posto_distro character varying,
    posto_platform character varying,
    posto_vendor character varying,
    posto_user character varying,

    posto_estado smallint DEFAULT (map.get('posto_estado_fechado'::name))::smallint NOT NULL,
    posto_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    posto_dataatualizacao timestamptz
);


--
-- TOC entry 4596 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE posto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.posto IS 'Essa entidade serve para armazenar os postos de venda';


--
-- TOC entry 4597 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_id IS 'Identificador do posto';


--
-- TOC entry 4598 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_espaco_auth; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_espaco_auth IS 'Identificador do espaço o qual o posto está ancorado';


--
-- TOC entry 4599 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_colaborador_id IS 'Identificador do colaborador responsável pelo registro do posto';


--
-- TOC entry 4600 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_colaborador_atualizacao IS 'Identificador do último colaborador responsável pela atualização do posnto';


--
-- TOC entry 4601 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_designacao IS 'Corresponde a designação do posto';


--
-- TOC entry 4602 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_montante IS 'Corresponde ao montante atual da venda no posto';


--
-- TOC entry 4603 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_estado IS 'Corresponde ao estado do posto
<ul>
  <li> fechado | significa que o posto pode ser encerado ou aberto </li>
  <li> aberto | sigififica que o posto está atualmente com uma caixa aberta (não pode ser encerado nesse estado) </li>
  <li> encerado | significa que nenhuma caixa pode ser mais aberta nesse posto </li>
</ul>';


--
-- TOC entry 4604 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_dataregistro IS 'Corresponde ao instante que o posto foi registrado no sistema';


--
-- TOC entry 4605 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN posto.posto_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.posto.posto_dataatualizacao IS 'Corresponde ao instante em que o posto teve a sua última atualização';


--
-- TOC entry 531 (class 1255 OID 23137)
-- Name: _get_posto(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_posto(arg_posto_id uuid) RETURNS tweeks.posto
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função retorna uma instancia da posto
select * from tweeks.posto cx where cx.posto_id = arg_posto_id;
$$;





--
-- TOC entry 227 (class 1259 OID 23140)
-- Name: stock; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.stock (
    stock_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    stock_artigo_id uuid NOT NULL,
    stock_espacao_id uuid NOT NULL,
    stock_colaborador_id uuid NOT NULL,
    stock_colaborador_atualizacao uuid,
    stock_quantidade double precision DEFAULT 0.0 NOT NULL,
    stock_estado smallint DEFAULT (map.get('stock_estado_ativo'::name))::smallint NOT NULL,
    stock_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    stock_dataatualizacao timestamptz
);


--
-- TOC entry 4606 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE stock; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.stock IS 'Essa entidade serve para controlar os stock dos artigos em cada espaço';


--
-- TOC entry 4607 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_id IS 'Identificador único do stock';


--
-- TOC entry 4608 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_artigo_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_artigo_id IS 'Identificador do artigo o qual o stock gerencia';


--
-- TOC entry 4609 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_espacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_espacao_id IS 'Identificador do espaço o qual o produto esta armazenado';


--
-- TOC entry 4610 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_colaborador_id IS 'Identificador do colaborador responsável pelo registro do stock';


--
-- TOC entry 4611 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_colaborador_atualizacao IS 'Identificador do colaborador responsável pela última atualização do stock';


--
-- TOC entry 4612 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_quantidade IS 'Corresponde a quantidade atual do artigo em stock';


--
-- TOC entry 4613 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_estado IS 'O estado atual do stock';


--
-- TOC entry 4614 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_dataregistro IS 'Instante em que o stock foi registrado';


--
-- TOC entry 4615 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN stock.stock_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.stock.stock_dataatualizacao IS 'Instante em que stock foi atualizado pela última vez';


--
-- TOC entry 532 (class 1255 OID 23150)
-- Name: _get_stock(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_stock( arg_stock_id uuid ) RETURNS tweeks.stock
    LANGUAGE sql
    AS $$
  -- Get stock instance
  select  * from tweeks.stock s where s.stock_id = arg_stock_id;
$$;


--
-- TOC entry 533 (class 1255 OID 23151)
-- Name: _get_stock(integer, smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_stock( arg_artigo_id uuid, arg_espaco_id uuid ) RETURNS tweeks.stock
    LANGUAGE plpgsql STRICT
    AS $$
declare
  /**
    Essa funcao serve para obter a instanci de um stock
   */
  _const map.constant;
  _stock tweeks.stock;
begin

  _const := map.constant();

  select * into _stock
  from tweeks.stock sto
  where sto.stock_artigo_id = arg_artigo_id
    and sto.stock_espacao_id = arg_espaco_id
  ;

  if _stock.stock_id is null then
    insert into tweeks.stock(
      stock_artigo_id,
      stock_espacao_id,
      stock_colaborador_id
    ) values (
      arg_artigo_id,
      arg_espaco_id,
      _const.colaborador_system_data
    ) returning * into _stock ;
  end if;

  return _stock;
end;
$$;


--
-- TOC entry 228 (class 1259 OID 23152)
-- Name: tmovimento; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tmovimento (
    tmovimento_id smallint NOT NULL,
    tmovimento_multiplo smallint NOT NULL,
    tmovimento_designacao character varying NOT NULL
);


--
-- TOC entry 4616 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE tmovimento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.tmovimento IS 'Essa entidade serve para armazenar os tipos de movimento (credito, debito)';


--
-- TOC entry 4617 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN tmovimento.tmovimento_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tmovimento.tmovimento_id IS 'Identificador único do tipo de movimento';


--
-- TOC entry 4618 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN tmovimento.tmovimento_multiplo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tmovimento.tmovimento_multiplo IS 'Corresponde ao valor mutiplicavel do tipo de movimento';


--
-- TOC entry 4619 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN tmovimento.tmovimento_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tmovimento.tmovimento_designacao IS 'Corresponde a designação do tipo de movimento';


--
-- TOC entry 534 (class 1255 OID 23158)
-- Name: _get_tmovimento(smallint); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_tmovimento(arg_tmovimento_id smallint) RETURNS tweeks.tmovimento
    LANGUAGE sql
    AS $$
  -- Essa função serve para devolver os tipos de movimento do posto
  select * from tweeks.tmovimento tm where tm.tmovimento_id = arg_tmovimento_id;
$$;


--
-- TOC entry 229 (class 1259 OID 23159)
-- Name: venda; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.venda (
    venda_id uuid NOT NULL default public.uuid_generate_v4(),
    venda_conta_id uuid NOT NULL,
    venda_artigo_id uuid NOT NULL,
    venda_espaco_auth uuid NOT NULL,
    venda_colaborador_id uuid NOT NULL,
    venda_colaborador_atualizacao uuid,
    venda_quantidade double precision NOT NULL,
    venda_custounitario double precision NOT NULL,

    venda_montente double precision NOT NULL,
    venda_montanteagregado double precision NOT NULL,
    venda_montantetotal double precision NOT NULL,

    venda_imposto double precision DEFAULT 0 NOT NULL,
    venda_montantesemimposto double precision,
    venda_montantecomimposto double precision,
    venda_impostoadicionar double precision,
    venda_impostoretirar double precision,

    venda_estadopreparacao smallint DEFAULT (map.get('venda_estadopreparacao_preparado'::name))::smallint NOT NULL,

    venda_estado smallint DEFAULT (map.get('venda_estado_aberto'::name))::smallint NOT NULL,
    venda_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    venda_dataatualizacao timestamptz
);


--
-- TOC entry 4620 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE venda; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.venda IS 'Essa entidade serve para registar as vendas do artigo ';


--
-- TOC entry 4621 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_id IS 'Identificador único da venda';


--
-- TOC entry 4622 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_conta_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_conta_id IS 'Identificador da conta o qual a venda esta associado';


--
-- TOC entry 4623 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_artigo_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_artigo_id IS 'Identificador do artigo o qual foi vendido';


--
-- TOC entry 4624 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_espaco_auth; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_espaco_auth IS 'Identificador do espaço onde saiu o artigo';


--
-- TOC entry 4625 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_colaborador_id IS 'Identificador do colaborador responsável pelo registro da venda';


--
-- TOC entry 4626 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_colaborador_atualizacao IS 'Identificador do colaborador responsável pela última atualização da venda';


--
-- TOC entry 4627 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_quantidade IS 'Quantidade do artigo vendido';


--
-- TOC entry 4628 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_custounitario; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_custounitario IS 'Custo únitario do artigo';


--
-- TOC entry 4629 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_montente; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_montente IS 'Montente do artigo preco X quantidade';


--
-- TOC entry 4630 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_montanteagregado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_montanteagregado IS 'Corresponde ao montante total de todos os itens agregados';


--
-- TOC entry 4631 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_montantetotal; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_montantetotal IS 'Coresponde ao montante total da venda = (montante + montanteAgregado )';


--
-- TOC entry 4632 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_estado IS 'Corresponde ao estado da venda
<ul>
  <li> aberto <li>
  <li> fechado </li>
  <li> anulado </li>
  <li> canselado </li>
</ul>';


--
-- TOC entry 4633 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_dataregistro IS 'Corresponde ao instanre em que a venda foi registrado no sistema';


--
-- TOC entry 4634 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_dataatualizacao IS 'Corresponde ao instante em que a venda foi atualizado pela última vez no sistema.';


--
-- TOC entry 4635 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN venda.venda_imposto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.venda.venda_imposto IS 'Esse atributo indica o valor de imposto sobre a venda';


--
-- TOC entry 535 (class 1255 OID 23169)
-- Name: _get_venda(integer); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks._get_venda(arg_venda_id uuid) RETURNS tweeks.venda
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Essa função devolve uma instancia de venda
select * from tweeks.venda ve where ve.venda_id = arg_venda_id;
$$;




--
-- TOC entry 537 (class 1255 OID 23171)
-- Name: funct_change_artigo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_artigo(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função atualiza as informações do artigo
    args := {
      arg_colaborador_id: ID,
      arg_artigo_id: ID,
      arg_espaco_auth: ID,
      arg_classe_id: ID,
      arg_artigo_nome: NOME,
      arg_artigo_preparacao: BOOLEAN,
      arg_artigo_foto: REFERENCE,
      arg_artigo_descricao: DESCRICAO,
      arg_precario_custo: CUSTO,
      arg_artigo_stocknegativo: TRUE | FALSE
      arg_items: [
        @+id/item,
        @+id/item,
        @+id/item,
        @+id/item
      ],

      arg_links: [
        { arg_espaco_id: ID, arg_link_custo: CUSTO, arg_link_quantidadecusto: QUANT_CUSTO  }
      ]

      arg_imposto: [
        {
          arg_tipoimposto_id: ID,
          arg_taplicar_id: ID,
          arg_imposto_valor: VALOR, # Por equanto envie null
          arg_imposto_percentagem: PERCENTAGEM, # Por enquanto envie null
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_classe_id uuid not null default args->>'arg_classe_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  arg_artigo_nome varchar not null default args->>'arg_artigo_nome';
  arg_artigo_preparacao boolean not null default args->>'arg_artigo_preparacao';
  arg_artigo_stocknegativo boolean not null default args->>'arg_artigo_stocknegativo';
  arg_artigo_stockminimo double precision default args->>'arg_artigo_stockminimo';
  arg_artigo_foto varchar default args->>'arg_artigo_foto';
  arg_artigo_descricao varchar default args->>'arg_artigo_descricao';
  arg_precario_custo double precision not null default args->>'arg_precario_custo';
  arg_items jsonb not null default args->'arg_items';

  _artigo tweeks.artigo;
  _const map.constant;


  arg_precario_quantidade double precision := args->>'arg_precario_quantidade';

begin

  _const := map.constant();
  _artigo := tweeks._get_artigo( arg_artigo_id );

  -- Garantir que a atualização do preco só ocora quando não tiver nenhuma conta aberta
  if arg_precario_custo != _artigo.artigo_custo and  (
    select count( * ) > 0
    from tweeks.venda ve
    where ve.venda_artigo_id = arg_artigo_id
      and ve.venda_estado = _const.venda_estado_aberto
  ) then
    return false ? '@tweeks.artigo.price-can-not-update-open-account';
  end if;

  -- Garantir que não existe nehum artigo com o mesmo nome já registrado na base de dados
  if (
    select count( * ) > 0
    from tweeks.artigo art
    where art.artigo_id != _artigo.artigo_id
      and lib.str_normalize( lower( public.unaccent( art.artigo_nome ) ) ) = lib.str_normalize( lower( public.unaccent( arg_artigo_nome ) ) )
  ) then
    return false ? '@tweeks.artigo.name-already-exist';
  end if;

  if _artigo.artigo_classe_id = _const.classe_itemextra and arg_classe_id != _const.classe_itemextra then
    return false ? '@tweeks.artigo.can-not-move-to-item-extra';
  elseif _artigo.artigo_classe_id != _const.classe_itemextra and arg_classe_id = _const.classe_itemextra then
    return false ? '@tweeks.artigo.can-not-move-from-item-extra';
  end if;

  update tweeks.artigo
    set artigo_nome = coalesce( arg_artigo_nome, artigo_nome ),
        artigo_classe_id = coalesce( arg_classe_id, artigo_classe_id ),
        artigo_preparacao = coalesce( arg_artigo_preparacao, artigo_preparacao ),
        artigo_foto = coalesce( arg_artigo_foto, artigo_foto ),
        artigo_descricao = coalesce( arg_artigo_descricao, artigo_descricao ),
        artigo_stocknegativo = coalesce( arg_artigo_stocknegativo, artigo_stocknegativo ),
        artigo_stockminimo = coalesce( arg_artigo_stockminimo, artigo_stockminimo ),
        artigo_colaborador_atualizacao = arg_colaborador_id,
        artigo_dataatualizacao = current_timestamp
    where artigo_id = arg_artigo_id
    returning * into _artigo
  ;

  perform tweeks.funct_reg_dispoe(
    jsonb_build_object (
      'arg_colaborador_id', arg_colaborador_id,
      'arg_atrigo_id', _artigo.artigo_id,
      'arg_items', arg_items,
      'arg_espaco_auth', arg_espaco_auth
    )
  );

  perform tweeks.funct_reg_link_associacao(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_link_referencia', jsonb_build_object( 'artigo_id', arg_artigo_id ),
      'arg_link_nome', _artigo.artigo_nome,
      'arg_links', args->'arg_links'
    )
  );

  arg_precario_quantidade := coalesce( arg_precario_quantidade, 1 );

  if arg_precario_custo != _artigo.artigo_custo then
    perform tweeks.funct_reg_precario(
      jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_precario_referencia', jsonb_build_object( 'artigo_id', _artigo.artigo_id ),
      'arg_precario_custo', arg_precario_custo,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_precario_quantidade', arg_precario_quantidade
      )
    );

  end if;

  perform tweeks.funct_reg_imposto(
    jsonb_build_object(
      'arg_artigo_id', _artigo.artigo_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_imposto', args->'arg_imposto'
    )
  );

  return true ? jsonb_build_array(
    'artigo', _artigo,
    'item', array(
      select to_jsonb( di ) || to_jsonb( art )
        from tweeks.dispoe di
        inner join tweeks.artigo art on di.dispoe_artigo_item = art.artigo_id
        where di.dispoe_artigo_id = _artigo.artigo_id
          and di.dispoe_estado = _const.dispoe_estado_ativo
          and art.artigo_estado = _const.artigo_estado_ativo
    ),
    'link', array(
      select l
        from tweeks.link l
        where l.link_referencia @> jsonb_build_object( 'artigo_id', arg_artigo_id )
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
    )
  );



exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 538 (class 1255 OID 23173)
-- Name: funct_change_artigo_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_artigo_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_artigo_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
  _artigo tweeks.artigo;
begin

  _const := map.constant();
  _artigo := tweeks._get_artigo( arg_artigo_id );

  -- Se o espaço for o proprietario do artigo então desativar/reativar o artigo na boa
  if _artigo.artigo_espaco_auth = any( arg_espaco_child ) then
    update tweeks.artigo
      set
        artigo_estado = lib.swith( artigo_estado, _const.artigo_estado_ativo, _const.artigo_estado_fechado  ),
        artigo_colaborador_atualizacao = arg_colaborador_id,
        artigo_dataatualizacao = current_timestamp
      where artigo_id = arg_artigo_id
      returning * into _artigo
    ;

    return true ? jsonb_build_object(
      'artigo', _artigo,
      'text', case
        when _artigo.artigo_estado = _const.artigo_estado_ativo   then format( 'O artigo "%s" foi ativado!', _artigo.artigo_nome )
        when _artigo.artigo_estado = _const.artigo_estado_fechado then format( 'O artigo "%s" foi desativo!', _artigo.artigo_nome )
      end
    );

  -- os outros só podem desativar apenas os links do artigos associados a ele
  else
    return tweeks.funct_change_link_unlink(
        jsonb_build_object(
          'arg_espaco_auth', arg_espaco_auth,
          'arg_colaborador_id', arg_colaborador_id,
          'arg_link_referencia', rule.artigo_referencia( arg_artigo_id )
        )
      );
  end if;




exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 539 (class 1255 OID 23174)
-- Name: funct_change_caixa_close(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_caixa_close(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para fechar uma posto
    args := {
      arg_caixa_id: ID
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_caixa_montantefecho: MONTANTE,
      arg_caixa_quantidadecheque: QUANT,
      arg_caixa_observacao: OBS,
    }
  */

  arg_caixa_id uuid not null default args->>'arg_caixa_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_caixa_montantefecho  double precision not null default args->>'arg_caixa_montantefecho';
  arg_caixa_quantidadecheque int2 not null default args->>'arg_caixa_quantidadecheque';
  arg_caixa_observacao varchar not null default args->>'arg_caixa_observacao';
  arg_caixa_quantidadechequeposto int2;

  _posto record;
  _caixa tweeks.caixa;
  _const map.constant;

begin

  _const := map.constant();

  select * into _posto
    from tweeks.posto cx
      inner join tweeks.caixa ab on cx.posto_id = ab.caixa_posto_id
    where ab.caixa_id = arg_caixa_id
      and ab.caixa_estado = _const.caixa_estado_ativo
      and cx.posto_estado = _const.posto_estado_aberto
  ;

--   -- Garantir que o posto para o colaborador exista
--   if _posto.posto_id is null then
--     return false ? '@posto.colaborador.not-found';
--   end if;

--   -- Garantir que o montante do fecho seja igual ao montante recolhido
--   if _posto.posto_montante != arg_caixa_montantefecho then
--     return false ? '@posto.montante-close.not-coincide';
--   end if;

  -- Obter a quantidade de cheque de venda
  select count( * ) into arg_caixa_quantidadecheque
    from tweeks.conta ct
    where ct.conta_caixa_fechopagamento = _caixa.caixa_id
      and ct.conta_tpaga_id = _const.tpaga_cheque
      and ct.conta_estado = _const.conta_estado_pago
  ;


  update tweeks.caixa
    set caixa_estado = _const.caixa_estado_fechado,
        caixa_dataatualizacao = current_timestamp,
        caixa_colaborador_atualizacao = arg_colaborador_id,
        caixa_quantidadecheque = arg_caixa_quantidadecheque,
        caixa_quantidadechequeposto = arg_caixa_quantidadechequeposto,
        caixa_montantefecho = arg_caixa_montantefecho,
        caixa_montantefechoposto = _posto.posto_montante,
        caixa_observacao = arg_caixa_observacao
    where caixa_id = _posto.caixa_id
    returning * into _caixa
  ;

  return true ? '@posto.close.success' || jsonb_build_object(
    'posto', tweeks._get_posto( _posto.posto_id ),
    'caixa', _caixa
    );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 540 (class 1255 OID 23175)
-- Name: funct_change_classe_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_classe_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_classe_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  arg_classe_id uuid not null default args->>'arg_classe_id';
  _const map.constant;
  _classe tweeks.classe;
begin
  _const := map.constant();

  if arg_classe_id = _const.classe_itemextra then
    return false ? '@tweeks.classe.can-not-disable-item-extra';
  end if;

  _classe := tweeks._get_classe( arg_classe_id );

  if _classe.classe_espaco_auth = any( arg_espaco_child ) then
    update tweeks.classe
      set
        classe_estado = case
          when classe_estado = _const.classe_estado_ativo then   _const.classe_estado_fechado
          when classe_estado = _const.classe_estado_fechado then _const.classe_estado_ativo
          else classe_estado
        end::int2,
        classe_colaborador_atualizacao = arg_colaborador_id,
        classe_dataatualizacao = current_timestamp
      where classe_id = arg_classe_id
      returning * into _classe
    ;

    return true ? jsonb_build_object(
      'classe', _classe,
      'classe_old', _classe,
      'message', case
        when _classe.classe_estado = _const.classe_estado_ativo   then format( 'O item "%s" foi ativado!',   _classe.classe_nome )
        when _classe.classe_estado =   _const.classe_estado_fechado then format( 'O item "%s" foi desativo!',  _classe.classe_nome )
      end
    );

  -- Se não for proprietario deslinkar apenas a classe ao espaço
  else
    return tweeks.funct_change_link_unlink(
      jsonb_build_object(
        'arg_espaco_auth', arg_espaco_auth,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_link_referencia', rule.classe_referencia( arg_classe_id )
      )
    );
  end if;

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 541 (class 1255 OID 23176)
-- Name: funct_change_colaborador(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_colaborador(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
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

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 542 (class 1255 OID 23177)
-- Name: funct_change_conta(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_conta(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    /**
      Essa função registra um nova conta
      arg = {

        -- obrigatorios
        arg_colaborador_id: ID,
        arg_conta_id: ID,
        arg_espaco_auth: ID,
        arg_posto_id: ID,
        arg_mesa_numero: NUMERO,


        -- requerido
        arg_vendas: [
          {
            arg_venda_id: ID,
            arg_artigo_id: ID,
            arg_venda_quantidade: QUANT,
            arg_venda_custounitario: CUSTO,

            arg_agregas: [
              {
                arg_agrega_id: ID,
                arg_item_id: ID,
                arg_item_quantidadecusto: QUANT/CUSTO
                arg_item_custo: CUSTO,
                arg_agrega_quantidade: QUANT,
                arg_agrega_montante: MONTANTE
              }
            ]
          }
        ]
      }
     */
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid not null default args->>'arg_conta_id';
  arg_posto_id uuid not null default args->>'arg_posto_id';

  arg_mesa_numero varchar default args->>'arg_mesa_numero';
  arg_vendas jsonb not null default args->>'arg_vendas';

  arg_reserva_id uuid  default args->>'arg_reserva_id';
  arg_currency_id int2 default args->>'arg_currency_id';
  arg_tpaga_id int2 default args->>'arg_tpaga_id';
  arg_conta_titular varchar default args->>'arg_conta_titular';
  arg_conta_data date default args->>'arg_conta_data';

  arg_vendas_id uuid [] not null default array( select ( ele.doc->>'arg_venda_id' )::uuid from jsonb_array_elements( arg_vendas ) ele( doc ) where ele.doc->>'arg_venda_id' is not null );

  _conta tweeks.conta;
  _const map.constant;
  _mesa tweeks.mesa;
  _res lib.result;
  _data record;
  _data_item record;
  _stock tweeks.stock;

  arg_venda_add jsonb;
  arg_venda_change jsonb;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );
  _mesa := tweeks._get_mesa( arg_colaborador_id, arg_espaco_auth, arg_mesa_numero );
  _mesa.mesa_estado := coalesce( _mesa.mesa_estado, _const.mesa_estado_disponivel );
  _mesa.mesa_id := coalesce( _mesa.mesa_id, -1 );

--   -- A mesa tem de estar disponivel para associa-la a conta
--   if _conta.conta_mesa_id != _mesa.mesa_id and _mesa.mesa_estado != _const.mesa_estado_disponivel then
--     return false ? '@tweeks.conta.mesa.estado.not-open';
--   end if;


  -- Validar as vendas e distirgir quais vão ser atualizado, e quais vão ser registrados e quais não vão ter acão
  for _data in
    select *
    from jsonb_array_elements( arg_vendas ) v( venda_document )
     inner join jsonb_to_record( v.venda_document ) as venl(
        arg_venda_id int,
        arg_artigo_id int,
        arg_venda_quantidade float,
        arg_venda_custounitario float,
        arg_agregas jsonb
      ) on true
           inner join tweeks.artigo art on venl.arg_artigo_id = art.artigo_id
           left join tweeks.venda ve on art.artigo_id = ve.venda_artigo_id
      and ve.venda_id = venl.arg_venda_id
      and ve.venda_estado = _const.venda_estado_aberto
    loop

      if _data.venda_id is not null then
        arg_venda_change := coalesce( arg_venda_change, jsonb_build_array());
        arg_venda_change := arg_venda_change || (_data.venda_document );
      else
        arg_venda_add := coalesce( arg_venda_add, jsonb_build_array() );
        arg_venda_add := arg_venda_add || _data.venda_document;
      end if;
    end loop;

  -- canselar todas as vendas não removidas da conta
  update tweeks.venda
  set venda_estado = _const.venda_estado_canselado,
      venda_colaborador_atualizacao = arg_colaborador_id,
      venda_dataatualizacao = current_timestamp
  where venda_id != all ( arg_vendas_id )
    and venda_conta_id = arg_conta_id
    and venda_estado = _const.venda_estado_aberto
  ;

  -- Alterar as vendas antigas
  if arg_venda_change is not null then

    perform tweeks.funct_change_venda(
      jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_message_error', true,
        'arg_conta_id', arg_conta_id,
        'arg_vendas', arg_venda_change
      )
    );
  end if;

  if arg_venda_add is not null then
    perform tweeks.funct_reg_venda(
      jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_message_error', true,
        'arg_conta_id', arg_conta_id,
        'arg_vendas', arg_venda_add
      )
    );
  end if;

  -- Quando houver alteração da mesa então mover a conta para outra mesa
  if _conta.conta_mesa_id != _mesa.mesa_id then
    update tweeks.conta
      set conta_mesa_id = _mesa.mesa_id
      where conta_id = _conta.conta_id
          returning * into _conta;
  end if;

  return true ? _res.message || jsonb_build_object(
    'conta', _conta,
    'venda', ( with asVend as (
      select to_jsonb( ve ) || jsonb_build_object( 'agrega', jsonb_agg( a ) )
        from tweeks.venda ve
            left join  agrega a on ve.venda_id = a.agrega_venda_id
          and a.agrega_estado = _const.agrega_estado_aberto
        where ve.venda_conta_id = _conta.conta_id
          and ve.venda_estado = _const.venda_estado_aberto
        group by ve.venda_id
      ) select
        array_agg( to_jsonb( av ) ) from asVend aV
    )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 543 (class 1255 OID 23179)
-- Name: funct_change_conta_anular(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_conta_anular(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualar as contas
    args := {
      arg_conta_id: ID,
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_conta_observacao: OBSERVACAO
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_conta_id uuid default args->>'arg_conta_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_conta_observacao varchar default args->>'arg_conta_observacao';

  _conta tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  arg_conta_observacao := lib.str_nospace( arg_conta_observacao );

  if _conta.conta_estado  = _const.conta_estado_anulado then
    return false ? 'Essa conta já está anulado';
  end if;


  if _conta.conta_estado in ( _const.conta_estado_pago, _const.fornecedor_estado_fechado ) and arg_conta_observacao is null then
    return false ? 'É necessario informar uma obseravção para anular as contas fechadas e pagas';
  end if;

  update tweeks.conta
    set conta_estado = _const.conta_estado_anulado,
        conta_colaborador_atualizacao = arg_colaborador_id,
        conta_dataatualizacao = current_timestamp,
        conta_observacao = arg_conta_observacao
    where conta_id = arg_conta_id
    returning  * into _conta;

  return  true ? jsonb_build_object(
    'conta', _conta
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 544 (class 1255 OID 23180)
-- Name: funct_change_conta_fechar(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_conta_fechar(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função fecha uma nova conta
    arg = {
      arg_espaco_auth: ID,
      arg_mesa_numero:  NUMERIO,
      arg_colaborador_id: ID,
      arg_conta_id: ID,
      arg_reserva_id: ID,
      arg_caixa_id: ID,
      arg_posto_id: ID,
      arg_mesa_id: ID,
      arg_currency_id: ID,
      arg_tpaga_id: ID,
      arg_conta_titular: NOME-CLIENTE
      arg_conta_data: DATA,
      arg_conta_titularnif: VARCHAR,
      arg_conta_montantemoeda: float
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid not null default args->>'arg_conta_id';
  arg_reserva_id uuid default args->>'arg_reserva_id';
  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_caixa_id uuid not null default args->>'arg_caixa_id';
  arg_currency_id int2 not null default args->>'arg_currency_id';
  arg_tpaga_id int2 not null default args->>'arg_tpaga_id';
  arg_mesa_numero varchar default args->>'arg_mesa_numero';
  arg_conta_desconto float not null default args->>'arg_conta_desconto';
  arg_conta_titular varchar not null default args->>'arg_conta_titular';
  arg_conta_data timestamptz default args->>'arg_conta_data';

  arg_conta_titularnif varchar default args->>'arg_conta_titularnif';
  arg_conta_montantemoeda double precision default args->>'arg_conta_montantemoeda';
  arg_conta_taxacambio double precision;

  _conta tweeks.conta;
  _mesa tweeks.mesa;
  _const map.constant;
  _caixa tweeks.caixa;
  _res lib.result;
  _cambio record;

begin

  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );
  _caixa := tweeks._get_caixa( arg_caixa_id );

  arg_conta_data := coalesce( arg_conta_data, current_date );
  arg_conta_data := coalesce( current_date );

  select * into _cambio from tweeks.funct_load_cambio_dia(
                                 jsonb_build_object(
                                     'arg_espaco_auth', arg_espaco_auth,
                                     'arg_currency_id', arg_currency_id,
                                     'arg_cambio_data', arg_conta_data
                                   )) tx;

  if _cambio.cambio_id is null then
    return false ? '@tweeks.conta.cambio-not-found';
  end if;

  -- Se for para amortizar a conta a caixa tem que estar aberta
  if arg_conta_montantemoeda > 0 and _caixa.caixa_estado != _const.caixa_estado_ativo then
    return false ? '@tweeks.conta.payment-rejected-on-closed-station';
  end if;

  _mesa := tweeks._get_mesa( arg_colaborador_id, arg_espaco_auth, arg_mesa_numero );


  -- fechar a conta
  update tweeks.conta
  set
    conta_estado = _const.conta_estado_fechado,
    conta_imprensa = conta_imprensa +1,
    conta_mesa_id = coalesce( _mesa.mesa_id, conta_mesa_id ),
    conta_colaborador_atualizacao = arg_colaborador_id,
    conta_dataatualizacao = current_timestamp,
    conta_reserva_id = arg_reserva_id,
    conta_posto_id = arg_posto_id,
    conta_currency_id = arg_currency_id,
    conta_tpaga_id = arg_tpaga_id,
    conta_titular = arg_conta_titular,
    conta_data = coalesce( arg_conta_data, current_date ),
    conta_titularnif = coalesce( arg_conta_titularnif, conta_titularnif ),
    conta_desconto = arg_conta_desconto
  where conta_id = arg_conta_id
  returning * into _conta
  ;

  _res.message := jsonb_build_object();

  if arg_conta_montantemoeda > 0 then
    _res := tweeks.funct_reg_amortizacao(
        jsonb_build_object(
            'arg_colaborador_id', arg_colaborador_id,
            'arg_caixa_id', _caixa.caixa_id,
            'arg_espaco_auth', arg_espaco_auth,
            'arg_tpaga_id', arg_tpaga_id,
            'arg_currency_id', arg_currency_id,
            'arg_amortizacao_referencia', jsonb_build_object( 'conta_id', _conta.conta_id ),
            'arg_amortizacao_montantemoeda', arg_conta_montantemoeda,
            'arg_amortizacao_data', _conta.conta_data,
            'arg_amortizacao_documento', _conta.conta_numerofatura
          )
      );

    if not _res.result then return _res; end if;
  end if;

  return true ? '@tweeks.conta.invoice-closed-success' || ( _res.message ) || jsonb_build_object(
      'conta', tweeks._get_conta( _conta.conta_id )
    );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 545 (class 1255 OID 23181)
-- Name: funct_change_conta_imprimir(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_conta_imprimir(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Alterar o estado da conta para imprensa
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_conta_id: ID,
    }
  */

  arg_espaco_auth uuid not null  default args->>'arg_espaco_auth';
  arg_conta_id uuid not null default args->>'arg_conta_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';

  _conta tweeks.conta;
  _const map.constant;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  if _conta.conta_imprensa then
    return  true ? jsonb_build_object(
      'conta', _conta
    );
  end if;

  update tweeks.conta
    set conta_imprensa = conta_imprensa +1,
        conta_colaborador_atualizacao = arg_colaborador_id,
        conta_dataatualizacao = current_timestamp
    where conta_id = arg_conta_id
    returning * into _conta
  ;

  return true ? jsonb_build_object(
    'conta', _conta
  );

exception when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 546 (class 1255 OID 23182)
-- Name: funct_change_conta_preparar(json); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_conta_preparar(args json) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para marcar os pedidos de cosinha como preparados
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_conta_id: ID,
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid not null default args->>'arg_conta_id';

  _const map.constant;
  _conta tweeks.conta;

begin

  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );


  if _conta.conta_estado != _const.conta_estado_aberto then
    return false ? 'Não pode marcar mais pedidos dessa conta como preparado!';
  end if;

  update tweeks.venda
    set venda_estadopreparacao = _const.venda_estadopreparacao_preparado
    where venda_estadopreparacao = _const.venda_estadopreparacao_pendente
      and venda_conta_id = arg_conta_id
      and venda_estado = _const.venda_estado_aberto
  ;

  return true ? 'success';

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 547 (class 1255 OID 23183)
-- Name: funct_change_espaco(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_espaco(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualizar as informações do espaco
    args := {
      arg_espaco_change: ID -- id do espao que ser atualizado
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_espaco_nome: NOME
      arg_espaco_descricao: DESCRICAO
      arg_espaco_gerarfatura: BOOLEAN
      arg_espaco_configurar: BOOLEAN
    }
  */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_change uuid not null default args->>'arg_espaco_change';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_nome character varying not null default args->>'arg_espaco_nome';
  arg_espaco_descricao character varying default args->>'arg_espaco_descricao';
  arg_espaco_gerarfatura boolean not null default args->>'arg_espaco_gerarfatura';
  arg_espaco_configurar boolean not null default args->>'arg_espaco_configurar';
begin

  update tweeks.espaco
    set
        espaco_nome = arg_espaco_nome,
        espaco_descricao = arg_espaco_descricao,
        espaco_gerarfatura = arg_espaco_gerarfatura,
        espaco_configurar = arg_espaco_configurar,
        espaco_colaborador_atualizaco = arg_colaborador_id,
        espaco_dataatualizacao = current_timestamp
    where espaco_id = arg_espaco_change
  ;

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 548 (class 1255 OID 23184)
-- Name: funct_change_espaco_configuracao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_espaco_configuracao(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualizar as informações do espaco
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_espaco_configuracao: JSON
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_configuracao jsonb not null default args->'arg_espaco_configuracao';
  _espaco tweeks.espaco;
begin

  update tweeks.espaco
    set
        espaco_configuracao = arg_espaco_configuracao,
        espaco_colaborador_atualizaco = arg_colaborador_id,
        espaco_dataatualizacao = current_timestamp
    where espaco_id = arg_espaco_auth
    returning * into _espaco
  ;

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


--
-- TOC entry 549 (class 1255 OID 23185)
-- Name: funct_change_espaco_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

create or replace function tweeks.funct_change_espaco_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_espaco_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_id uuid not null default args->>'arg_espaco_id';
  _const map.constant;
  _espaco tweeks.espaco;
begin

  _const := map.constant();
  _espaco := tweeks._get_espaco( arg_espaco_id );

  update tweeks.espaco
    set
      espaco_estado = lib.swith( espaco_estado, _const.espaco_estado_ativo, _const.espaco_estado_fechado  ),
      espaco_colaborador_atualizaco = arg_colaborador_id,
      espaco_dataatualizacao = current_timestamp
    where espaco_id = arg_espaco_id
    returning * into _espaco
  ;

  return true ? jsonb_build_object(
    'espaco', _espaco,
    'text', case
      when _espaco.espaco_estado = _const.espaco_estado_ativo   then format( 'O espaco "%s" foi ativado!', _espaco.espaco_nome )
      when _espaco.espaco_estado = _const.espaco_estado_fechado then format( 'O espaco "%s" foi desativo!', _espaco.espaco_nome )
    end
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 550 (class 1255 OID 23186)
-- Name: funct_change_fornecedor_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_fornecedor_estado( args jsonb ) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função atualiza o estado do fornecedor (ativa/desativa)
    args := {
      arg_colaborador_id: ID,
      arg_fornecedor_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_fornecedor_id uuid not null default args->>'arg_fornecedor_id';

  _const map.constant;
  _fornecedor tweeks.fornecedor;

begin
  _const := map.constant();

  update tweeks.fornecedor
    set
      fornecedor_estado = lib.swith( fornecedor_estado, _const.fornecedor_estado_ativo, _const.fornecedor_estado_fechado ),
      fornecedor_dataatualizacao = current_timestamp,
      fornecedor_colaborador_atualizacao = arg_colaborador_id
    where fornecedor_id = arg_fornecedor_id
    returning * into _fornecedor;

  return true ? jsonb_build_object(
    'fornecedor', _fornecedor
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 551 (class 1255 OID 23187)
-- Name: funct_change_item_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_item_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_item_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_item_id uuid not null default args->>'arg_item_id';
  _const map.constant;
  _artigo tweeks.artigo;
begin

  _artigo :=  tweeks._get_item( arg_item_id );
  _const := map.constant();

  if _artigo.artigo_classe_id != _const.classe_itemextra then
    return false ? '@artigo-is-not-item-extra';
  end if;


  -- Abrir ou fechar o item
  update tweeks.artigo
    set
      artigo_estado = lib.swith( artigo_estado, _const.item_estado_ativo, _const.item_estado_fechado ),
      artigo_colaborador_atualizacao = arg_colaborador_id,
      artigo_dataatualizacao = current_timestamp
    where artigo_id = arg_item_id
    returning * into _artigo
  ;

  return true ? jsonb_build_object(
    'artigo', _artigo
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 552 (class 1255 OID 23188)
-- Name: funct_change_link_disable(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_link_disable(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para desativar uma link
    args := {
      arg_link_id: ID,
      arg_colaborador_id: ID
    }
   */

  arg_link_id uuid not null default args->>'arg_link_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';

  _const map.constant;
  _link tweeks.link;

begin

  lock tweeks.link in share mode;

  _const := map.constant();
  _link := tweeks._get_link( arg_link_id );

  if _link.link_estado != _const.link_estado_ativo then
    return false ? '@tweeks.link.is-closed';
  end if;

  -- Fechar os links e os sublink associados a esse
  update tweeks.link
    set link_estado = _const.link_estado_fechado,
        link_colaborador_atualizacao = arg_colaborador_id,
        link_dataatualizacao = current_timestamp
    where link_id in (
      with recursive aux as (
          select a.link_id
            from tweeks.link a
            where a.link_id = arg_link_id
        union all
          select a2.link_id
            from tweeks.link a2
              inner join aux on a2.link_link_id = aux.link_id
            where a2.link_estado = _const.link_estado_ativo
      )
      select link_id
        from aux
    );

  return true ? jsonb_build_object(
    'link', _link
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 553 (class 1255 OID 23189)
-- Name: funct_change_link_move(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_link_move(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para trocar duas link de posição
    arg_link_id: ID,
    arg_colaborador_id: ID,
    arg_move_incremento: ID,
   */
  _link tweeks.link;
  _const map.constant;

  arg_link_id uuid default args->>'arg_link_id';
  arg_move_incremento int2 default args->>'arg_move_incremento';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_link_start int2;
  arg_link_end int2;
  arg_incremento int2;
begin

  lock tweeks.link in share mode;

  _link := tweeks._get_link( arg_link_id );
  _const := map.constant();

  if arg_move_incremento = 0 then
    return false ? '@tweeks.link.move-none';
  end if;

  if _link.link_posicao + arg_move_incremento < 0 then
    return false ? '@move-position-invalid';
  end if;

  if _link.link_estado != _const.link_estado_ativo then
    return false ? '@tweeks.link.is-closed';
  end if;

  if arg_move_incremento > 0 then
    arg_link_start := _link.link_posicao;
    arg_link_end := _link.link_posicao + arg_move_incremento;
    arg_incremento := -1;
  else
    arg_link_start := _link.link_posicao + arg_move_incremento;
    arg_link_end := _link.link_posicao;
    arg_incremento := 1;
  end if ;

  -- Mover as links todas
  update tweeks.link
    set link_posicao = case
        when link_id = _link.link_id then link_posicao + arg_move_incremento
        else link_posicao + arg_incremento
      end,
      link_colaborador_atualizacao = arg_colaborador_id,
      link_dataatualizacao = current_timestamp
    where link_posicao between arg_link_start and arg_link_end
      and link_espaco_destino = _link.link_espaco_destino
      and coalesce( link_link_id, -1 ) = coalesce( _link.link_link_id, -1 )
      and link_estado = _const.link_estado_ativo
  ;

  return true ? jsonb_build_object(
    'link', array(
      select a
        from tweeks.link a
        where link_posicao between arg_link_start and arg_link_end
          and link_espaco_destino = _link.link_espaco_destino
          and coalesce( link_link_id, -1 ) = coalesce( _link.link_link_id, -1 )
          and link_estado = _const.link_estado_ativo
        order by a.link_posicao
    )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 554 (class 1255 OID 23190)
-- Name: funct_change_link_switch(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_link_switch(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para trocar duas link de posição
    arg_link_id: ID_LINK_PARENT,
    arg_espaco_destino: ID,
    arg_espaco_auth: ID,
    arg_colaborador_id: ID
    arg_link_posicao_1: POSICAO
    arg_link_posicao_2: POSICAO,
   */
  _link tweeks.link;
  _const map.constant;

  arg_link_id uuid default args->>'arg_link_id';
  arg_espaco_destino uuid default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_link_posicao_1 int not null default args->>'arg_link_posicao_1';
  arg_link_posicao_2 int not null default args->>'arg_link_posicao_2';
begin

  lock tweeks.link in share mode;
  _const := map.constant();

  arg_espaco_destino := coalesce( arg_espaco_destino, arg_espaco_auth );

  update tweeks.link
    set link_posicao = lib.swith( link_posicao, arg_link_posicao_1, arg_link_posicao_2 ),
        link_colaborador_atualizacao = arg_colaborador_id,
        link_dataatualizacao = current_timestamp
    where link_posicao in ( arg_link_posicao_1, arg_link_posicao_2 )
      and link_estado = _const.link_estado_ativo
      and link_espaco_destino = arg_posto_id
      and coalesce( link_link_id, -1 ) = coalesce( arg_link_id, -1 )
  ;

  return true ? jsonb_build_object(
    'link', array(
      select a
        from tweeks.link a
        where link_posicao in ( arg_link_posicao_1, arg_link_posicao_2 )
          and link_estado = _const.link_estado_ativo
          and link_espaco_destino = arg_espaco_destino
          and coalesce( link_link_id, -1 ) = coalesce( arg_link_id, -1 )
        order by a.link_posicao
    )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 556 (class 1255 OID 23191)
-- Name: funct_change_link_unlink(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_link_unlink(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_link_referencia: REF
    }
   */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_link_referencia jsonb not null default args->'arg_link_referencia';
  _const map.constant;
begin
  _const := map.constant();

  update tweeks.link
    set link_estado = _const.link_estado_fechado,
        link_colaborador_atualizacao = arg_colaborador_id,
        link_dataatualizacao = current_timestamp
    where link_referencia @> arg_link_referencia
      and link_espaco_destino = any( arg_espaco_child )
      and link_estado = _const.link_estado_associacao
      and link_tlink_id = _const.tlink_associacao
  ;

  return true ? jsonb_build_object(
    'text', 'A associação ao espaço foi desativado com sucesso'
  );
end;
$$;


--
-- TOC entry 557 (class 1255 OID 23192)
-- Name: funct_change_mesa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_mesa(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualizar informação da mesa
    args := {
      arg_mesa_id: ID,
      arg_colaborador_id: ID,
      arg_mesa_designacao: DESIGNACAO,
      arg_mesa_numero: DESIGNACAO,
      arg_mesa_lotacao: DESIGNACAO
    }
   */
  arg_mesa_designacao character varying default args->>'arg_mesa_designacao';
  arg_mesa_numero character varying default args->>'arg_mesa_numero';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_mesa_id uuid not null default args->>'arg_mesa_id';
  _mesa tweeks.mesa;
begin

  -- Garantir que o numero de mesa seja unico
  if (
    select count( * ) > 0
      from tweeks.mesa m
      where m.mesa_numero =  arg_mesa_numero
        and m.mesa_id != arg_mesa_id
  ) then
    return false ? '@mesa.numero.already-exist';
  end if;

  update tweeks.mesa
    set mesa_designacao = coalesce( arg_mesa_designacao, mesa_designacao ),
        mesa_numero = coalesce( arg_mesa_numero, mesa_numero ),
        mesa_colaborador_atualizacao = arg_colaborador_id,
        mesa_dataatualizacao = current_timestamp
    where mesa_id = arg_mesa_id
    returning * into _mesa
  ;

  return true ? jsonb_build_object(
    'mesa', _mesa
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 558 (class 1255 OID 23193)
-- Name: funct_change_mesa_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_mesa_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função atualiza o estado da mesa
    args = {
      arg_colaborador_id: ID,
      arg_mesa_id: ID,
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_mesa_id uuid default args->>'arg_mesa_id';

  _const map.constant;
  _mesa tweeks.mesa;
begin

  _mesa := tweeks._get_mesa( arg_mesa_id );
  _const := map.constant();

  if _mesa.mesa_estado  not in ( _const.mesa_estado_disponivel, _const.mesa_estado_desativado ) then
    return false ? '@tweeks.mesa.estado.no-accept';
  end if;

  update tweeks.mesa
    set
      mesa_estado = lib.swith( _mesa.mesa_estado, _const.mesa_estado_disponivel, _const.mesa_estado_desativado ),
      mesa_dataatualizacao = current_timestamp,
      mesa_colaborador_atualizacao = arg_colaborador_id
    where mesa_id = arg_mesa_id
    returning * into _mesa
  ;

  return true ? jsonb_build_object(
      'mesa', _mesa
    );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 559 (class 1255 OID 23194)
-- Name: funct_change_ordem_classe(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_ordem_classe(parms jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
    /** Essa função serve para caregar os artigos pelas sua categoria
      parms := [{
        parms_classe_id: ID
        parms_classe_position: SMALLINT
      }]
    */
    i jsonb;
begin
    for i in select * from jsonb_array_elements(parms)
    loop
        update tweeks.classe
            set
                classe_position = (i::jsonb ->>'parms_classe_position')::smallint
        where classe_id = (i::jsonb ->>'parms_classe_id')::uuid;
    end loop;
    return true;
end;
$$;


--
-- TOC entry 560 (class 1255 OID 23195)
-- Name: funct_change_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_posto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para atualizar as informações de um posto
    args := {
      arg_espaco_destino: ID,
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_posto_id: ID,
      arg_posto_endereco: MAC,
      arg_posto_designacao: ID,
      arg_posto_multipleuser: BOOLEAN,
      arg_tposto_id: ID,
      arg_device: JSON
    }
   */
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_posto_designacao character varying default args->>'arg_posto_designacao';
  arg_posto_endereco character varying default args->>'arg_posto_endereco';
  arg_posto_multipleuser boolean default args->>'arg_posto_multipleuser';
  arg_tposto_id int2 default args->>'arg_tposto_id';
  arg_device jsonb not null default args->'arg_device';
  _posto tweeks.posto;
begin
  if(
    select count( * ) > 0
      from tweeks.posto pos
      where pos.posto_id != arg_posto_id
        and pos.posto_endereco = arg_posto_endereco
  ) then
    return false ? '@tweeks.posto.endereco-already-exist';
  end if;
  update tweeks.posto
    set posto_tposto_id = coalesce( arg_tposto_id, posto_tposto_id ),
        posto_espaco_destino = coalesce( arg_espaco_destino, posto_espaco_destino ),
        posto_multipleuser = coalesce( arg_posto_multipleuser, posto_multipleuser, true ),
        posto_designacao = coalesce( arg_posto_designacao, posto_designacao ),
        posto_endereco = coalesce( arg_posto_endereco, posto_endereco ),
        posto_colaborador_atualizacao = arg_colaborador_id,
        posto_dataatualizacao = current_timestamp
    where posto_id = arg_posto_id
    returning * into _posto
  ;

  return true ? jsonb_build_object(
    'posto', _posto
  );


exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 561 (class 1255 OID 23196)
-- Name: funct_change_posto_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_posto_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para ativar ou desativar o estado do um artigo
    args = {
      arg_colaborador_id: ID,
      arg_posto_id: ID
    }
  */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_posto_id uuid not null default args->>'arg_posto_id';
  _const map.constant;
  _posto tweeks.posto;
begin

  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );

  if _posto.posto_estado = _const.posto_estado_aberto then
    return false ? '@posto.estado.aberto.no-pode-encerar';
  end if;

  update tweeks.posto
    set
      posto_estado = lib.swith( posto_estado, _const.posto_estado_encerado, _const.posto_estado_fechado  ),
      posto_colaborador_atualizacao = arg_colaborador_id,
      posto_dataatualizacao = current_timestamp
    where posto_id = arg_posto_id
    returning * into _posto
  ;

  return true ? jsonb_build_object(
    'artigo', _posto,
    'artigo_old', _posto,
    'text', case
      when _posto.posto_estado = _const.posto_estado_fechado   then format( 'O posto "%s" foi ativado!', _posto.posto_designacao )
      when _posto.posto_estado = _const.posto_estado_encerado then format( 'O posto "%s" foi desativo!', _posto.posto_designacao )
    end
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 562 (class 1255 OID 23197)
-- Name: funct_change_posto_open(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_posto_open(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para que um colaborador abra a posto
    args := {
      arg_colaborador_id: ID,
      arg_colaborador_proprietario: ID,
      arg_posto_montante: MONTANTE
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_colaborador_proprietario uuid not null default args->>'arg_colaborador_proprietario';
  arg_posto_montanteinicial double precision not null default args->>'arg_posto_montanteinicial';

  _const map.constant;
  _posto record;

begin
  _const := map.constant();

  select * into _posto
    from tweeks.posto cx
    where cx.posto_colaborador_proprietario = arg_colaborador_proprietario
      and cx.posto_estado in ( _const.posto_estado_ativo, _const.posto_estado_pendete )
  ;

  if _posto.posto_id is null then
    return false ? '@posto.colaborador.not-found';
  end if;

  if _posto.posto_montanteinicial != arg_posto_montanteinicial then
    return false ? '@posto.montante-inicial.not-coincide';
  end if;

  update tweeks.posto
    set posto_estado = _const.posto_estado_ativo,
        posto_colaborador_atualizacao = arg_colaborador_id,
        posto_dataatualizacao = current_timestamp
    where posto_id = _posto.posto_id
    returning * into _posto
  ;

  return true ? jsonb_build_object(
    'posto', _posto
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 563 (class 1255 OID 23198)
-- Name: funct_change_tipoimposto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_tipoimposto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar os tipos de imposto
    args := {
      arg_tipoimposto_id: ID,
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_tipoimposto_id: ID,
      arg_tipoimposto_nome: NOME,
      arg_tipoimposto_codigo: CODIGO,
      arg_taxa_taxa: VALOR,
      arg_taxa_percentagem: PERCENTAGEM,
      arg_links :[
        { arg_espaco_id: ID  }
      ]
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_tipoimposto_id int2 not null default args->>'arg_tipoimposto_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_tipoimposto_nome character varying not null default args->>'arg_tipoimposto_nome';
  arg_tipoimposto_codigo character varying not null default args->>'arg_tipoimposto_codigo';
  arg_taxa_percentagem double precision default args->>'arg_taxa_percentagem';
  arg_taxa_taxa double precision default args->>'arg_taxa_taxa';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _tipoimposto tweeks.tipoimposto;

begin
  arg_tipoimposto_codigo := lib.str_normalize( upper( public.unaccent( arg_tipoimposto_codigo ) ) );
  if (
    select count( * ) > 0
      from tweeks.tipoimposto tip
      where tip.tipoimposto_espaco_auth = any( arg_espaco_child )
        and lib.str_normalize( upper( public.unaccent( tip.tipoimposto_codigo ) ) ) = arg_tipoimposto_codigo
        and tip.tipoimposto_id != arg_tipoimposto_id
  ) then
    return false ? '@tweeks.tipoimposto.codigo-already-exist';
  end if;

  update tweeks.tipoimposto
    set tipoimposto_nome = arg_tipoimposto_nome,
        tipoimposto_codigo = arg_tipoimposto_codigo,
        tipoimposto_colaborador_atualizacao = arg_colaborador_id,
        tipoimposto_dataatuzaliacao = current_timestamp
    where tipoimposto_id = arg_tipoimposto_id
    returning * into _tipoimposto;

  perform tweeks.funct_reg_taxa(
    jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_tipoimposto_id', _tipoimposto.tipoimposto_id,
      'arg_taxa_percentagem', arg_taxa_percentagem,
      'arg_taxa_taxa', arg_taxa_taxa
    )
  );

  perform tweeks.funct_reg_link_associacao(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_link_nome', _tipoimposto.tipoimposto_nome,
      'arg_link_referencia', jsonb_build_object( 'tipoimposto_id', _tipoimposto.tipoimposto_id ),
      'arg_links', args->'arg_links'
    )
  );

  return true ? jsonb_build_object(
    'tipoimposto', _tipoimposto
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 564 (class 1255 OID 23199)
-- Name: funct_change_tipoimposto_estado(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_tipoimposto_estado(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_tipoimposto_id: ID,
      arg_colaborador_id: ID,
    }
   */
  arg_tipoimposto_id int2 not null default args->>'arg_tipoimposto_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  _tipoimposto tweeks.tipoimposto;
  _const map.constant;
begin
  _const := map.constant();
  update tweeks.tipoimposto
    set tipoimposto_estado = lib.swith( tipoimposto_estado, _const.tipoimposto_estado_ativo, _const.tipoimposto_estado_fechado ),
        tipoimposto_colaborador_atualizacao = arg_colaborador_id,
        tipoimposto_dataatuzaliacao = current_timestamp
    where tipoimposto_id = arg_tipoimposto_id
    returning * into _tipoimposto
  ;

  return true ? jsonb_build_object(
    'tipoimposto', _tipoimposto
  );

end;
$$;


--
-- TOC entry 565 (class 1255 OID 23200)
-- Name: funct_change_venda(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_change_venda(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para associar mais vendas a conta
    args := {
      arg_colaborador_id: ID,
      arg_conta_id: ID,
      arg_message_error: TRUE|FALSE,
      arg_espaco_auth: ID,
      arg_vendas: [
        {
          arg_venda_id: ID,
          arg_venda_quantidade: QUANT,
          arg_venda_custounitario: CUSTO,

          arg_agregas: [
            {
              arg_item_id: ID,
              arg_item_quantidadecusto: QUANT/CUSTO
              arg_agrega_quantidade: QUANT,
              arg_item_custo: CUSTO,
              arg_agrega_montante: MONTANTE
            }
          ]
        }
      ]
    }*/

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_conta_id uuid not null default args->>'arg_conta_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_vendas jsonb not null default args->>'arg_vendas';
  arg_message_error boolean not null default args->>'arg_message_error';

  -- colocar todos os id dos artigos em uma lista
  arg_artigos_id uuid [ ] default array( select ( doc.venda->>'arg_artigo_id' )::uuid  from jsonb_array_elements( arg_vendas ) doc( venda ) );

  arg_items_id uuid [ ];

  _const map.constant;
  _conta tweeks.conta;
  _data record;
  _venda tweeks.venda;

begin
  arg_message_error := coalesce( arg_message_error, true );

  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );


  -- Garrantir que tenha o stock disponivel para os artigos
  with novas_vendas as (
    select
        ( dos.venda->>'arg_venda_id' )::uuid as arg_venda_id,
        ( dos.venda->>'arg_artigo_id' )::uuid as arg_artigo_id,
        ( dos.venda->>'arg_venda_quantidade' )::double precision as arg_venda_quantidade,
        ( dos.venda->>'arg_venda_custounitario' )::double precision as arg_venda_custounitario,
        dos.venda->'arg_agregas' as arg_agregas
    from jsonb_array_elements( arg_vendas ) dos( venda )
  )
  select
      count( art.artigo_id ) as artigo_total,
      string_agg( art.artigo_nome, ', ' ) as artigo_nomes
      into _data
    from novas_vendas vds
      inner join tweeks.venda ve on vds.arg_venda_id = ve.venda_id
      inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
      inner join tweeks.stock st on art.artigo_id = st.stock_artigo_id
    where st.stock_espacao_id = arg_espaco_auth
      and not rule.artigo_has_stock( art.artigo_id, arg_espaco_auth, vds.arg_venda_quantidade -  ve.venda_quantidade )
  ;

  if _data.artigo_total > 0 and arg_message_error then
    raise exception '%', format( 'Os stock dos produtos "%s" não cobrem a venda para essa conta', _data.artigo_nomes );

  elsif _data.artigo_total > 0 then
    return false ? format( 'Os stock dos produtos "%s" não cobrem a venda para essa conta', _data.artigo_nomes );
  end if;


  -- Registar as novas vendas a conta
  for _data in
    with novas_vendas as (
      select
          ( dos.venda->>'arg_venda_id' )::uuid as arg_venda_id,
          ( dos.venda->>'arg_artigo_id' )::uuid as arg_artigo_id,
          ( dos.venda->>'arg_venda_quantidade' )::double precision as arg_venda_quantidade,
          ( dos.venda->>'arg_venda_custounitario' )::double precision as arg_venda_custounitario,
          dos.venda -> 'arg_agregas' as arg_agregas
        from jsonb_array_elements( arg_vendas ) dos( venda )
    )
    select *
      from novas_vendas nv
        inner join tweeks.venda ve on nv.arg_venda_id = ve.venda_id
  loop
    _data.venda_custounitario := _data.arg_venda_custounitario;
    _data.venda_quantidade := _data.arg_venda_quantidade;

    -- Anular o valor do montante anterior em campo montante
    _data.venda_montantetotal := _data.venda_montantetotal - _data.venda_montente;

    -- Atualizar o valor de novo montante
    _data.venda_montente := _data.arg_venda_quantidade * _data.arg_venda_custounitario;

    -- Atualizar o valor de montante total
    _data.venda_montantetotal := _data.venda_montantetotal + _data.venda_montente;

    update tweeks.venda
      set venda_quantidade = _data.venda_quantidade,
          venda_custounitario = _data.venda_custounitario,
          venda_montente = _data.venda_montente,
          venda_montantetotal = _data.venda_montantetotal,
          venda_espaco_auth = arg_espaco_auth
      where venda_id = _data.venda_id
      returning * into _venda
    ;

    arg_items_id := array( select ( doc.agrega->>'arg_item_id' )::uuid  from jsonb_array_elements( _data.arg_agregas ) doc( agrega ) );
    -- desagregar o item da venda
    update tweeks.agrega
      set agrega_estado = _const.agrega_estado_canselado,
          agrega_colaborador_atualizacao = arg_colaborador_id,
          agrega_dataatualizacao = current_timestamp
      where agrega_venda_id = _data.venda_id
        and agrega_artigo_item != all( arg_items_id )
        and agrega_estado = _const.agrega_estado_aberto
    ;

    -- aggregar os novos item a venda
    with item_preco as (
      select
        ( doc.agrega->>'arg_agrega_quantidade' )::double precision as arg_agrega_quantidade,
        ( doc.agrega->>'arg_item_quantidadecusto' )::double precision as arg_item_quantidadecusto,
        ( doc.agrega->>'arg_item_custo' )::double precision as arg_item_custo,
        ( doc.agrega->>'arg_item_id' )::uuid as arg_item_id
      from jsonb_array_elements( _data.arg_agregas ) doc( agrega )
    )
    insert into tweeks.agrega (
      agrega_venda_id,
      agrega_artigo_item,
      agrega_colaborador_id,
      agrega_quantidade,
      agrega_custounitario,
      agrega_montante,
      agrega_espaco_auth
    )
    select
        _data.venda_id,
        it.artigo_id,
        arg_colaborador_id,
        ip.arg_agrega_quantidade,
        ip.arg_item_custo,
        rule.calculate_cost( ip.arg_item_quantidadecusto, ip.arg_item_custo, ip.arg_agrega_quantidade ),
        arg_espaco_auth
      from tweeks.artigo it
        inner join item_preco ip on it.artigo_id = ip.arg_item_id
        left join agrega a on it.artigo_id = a.agrega_artigo_item
          and a.agrega_estado = _const.agrega_estado_aberto
      where it.artigo_id = any ( arg_items_id )
        and a.agrega_id is null
    ;

    -- Aplicar o calculo do imposto
    perform tweeks.funct_reg_vendaimposto(
      jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_venda_id', _venda.venda_id,
        'arg_artigo_id', _venda.venda_artigo_id,
        'arg_espaco_auth', arg_espaco_auth
      )
    );

  end loop;

  return true ? jsonb_build_object(
    'venda', array (
      select to_jsonb( ve ) || jsonb_build_object(
          'venda_item', jsonb_agg( to_jsonb( agg ) || to_jsonb( it) )
        )
        from tweeks.venda ve
          left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
            and agg.agrega_estado = _const.agrega_estado_aberto
          left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id
        where ve.venda_conta_id = arg_conta_id
          and ve.venda_artigo_id = any( arg_artigos_id )
          and ve.venda_estado = _const.venda_estado_aberto
        group by ve.venda_id
    ),

    'venda_all', array (
      select to_jsonb( ve ) || jsonb_build_object(
          'venda_item', jsonb_agg( to_jsonb( agg ) || to_jsonb( it) )
        )
        from tweeks.venda ve
          left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
            and agg.agrega_estado >= _const.agrega_estado_aberto
          left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id
        where ve.venda_conta_id = arg_conta_id
          and ve.venda_estado >= _const.venda_estado_aberto
        group by ve.venda_id
    )
  );
end;
$$;


--
-- TOC entry 566 (class 1255 OID 23202)
-- Name: funct_load_acerto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_acerto(filter jsonb) RETURNS TABLE(
    acerto_id uuid,
    acerto_quantidade float,
     acerto_diferenca float,
      acerto_quantidadeinicial float,
       acerto_observacao character varying,
        acerto_estado smallint,
        acerto_dataregistro timestamptz,
         acerto_dataatualizacao timestamptz,
          artigo_id uuid,
          artigo_nome character varying,
           artigo_codigo character varying,
            espaco_id uuid,
             espaco_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver a listagem dos acertos

  filter := {
    arg_artigo_id: ID,
    arg_espaco_id: ID
    arg_espaco_auth: ID
  }
  */

  arg_artigo_id uuid default filter ->>'arg_artigo_id';
  arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
  arg_espaco_id uuid default filter ->>'arg_espaco_id';
  arg_espaco_loads uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
begin

  return query
    select
        acc.acerto_id,
        acc.acerto_quantidade,
        acc.acerto_diferenca,
        acc.acerto_quantidadeinicial,
        acc.acerto_observacao,
        acc.acerto_estado,
        acc.acerto_dataregistro,
        acc.acerto_dataatualizacao,

        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,

        esp.espaco_id,
        esp.espaco_nome
      from tweeks.acerto acc
        inner join tweeks.stock sto on acc.acerto_stock_id = sto.stock_id
        inner join tweeks.artigo art on sto.stock_artigo_id = art.artigo_id
        inner join tweeks.espaco esp on sto.stock_espacao_id = esp.espaco_id
      where art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and esp.espaco_id = coalesce( arg_espaco_id, esp.espaco_id )
        and esp.espaco_id = any( arg_espaco_loads )
    ;
end;
$$;


--
-- TOC entry 567 (class 1255 OID 23203)
-- Name: funct_load_artig_check_nome(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artig_check_nome(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função devolve todos os artigos com os nomes expecificados
    filter := {
      arg_espaco_auth: ID
      arg_artigo_nome: [
        @+nome/artigo,
        @+nome/artigo,
        @+nome/artigo,
        @+nome/artigo
      ]
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_artigo_nome character varying [] default array( select lib.str_normalize( public.unaccent( lower( names ) ) ) from jsonb_array_elements_text( filter->'arg_artigo_nome' ) names );
  arg_espaco_child uuid[] := rule.espaco_get_childrens( arg_espaco_auth );
begin
  return query
    select lib.jsonb_values(
          to_jsonb( art ),
          'artigo_id',
          'artigo_nome',
          'artigo_custo',
          'artigo_descricao',
          'artigo_dataregistro'
        )
      from tweeks.artigo art
      where lower( lib.str_normalize( lower( public.unaccent( art.artigo_nome ) ) ) ) = any ( arg_artigo_nome )
        and art.artigo_espaco_auth = any( arg_espaco_child )
    ;
end;
$$;


--
-- TOC entry 568 (class 1255 OID 23204)
-- Name: funct_load_artigo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_load_artigo(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para carregar os artigos registrado
    filter := {
      arg_espaco_auth: ID
      arg_classe_id: ID
      arg_artigo_estado: ARTIGO_ESTADO
    }
   */

  arg_classe_id uuid default filter ->>'arg_classe_id';
  arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    with associacao as (
      select
        ls.link_referencia,
        sum( st.stock_quantidade ) as associacao_stock_quantidade,
        jsonb_agg( lib.jsonb_values(
            to_jsonb( esp ) || to_jsonb( st ),
            'espaco_id',
            'espaco_nome',
            'stock_id',
            'stock_quantidade'
          )
        ) as links

      from tweeks.link ls
         inner join tweeks.espaco esp on ls.link_espaco_destino = esp.espaco_id
         inner join tweeks._get_stock( ( ls.link_referencia->>'artigo_id')::uuid, esp.espaco_id ) st on esp.espaco_id = st.stock_espacao_id
      where ls.link_tlink_id = _const.tlink_associacao
        and ls.link_estado = _const.link_estado_associacao
        and ( ls.link_espaco_auth = any( arg_espaco_child ) or ls.link_espaco_destino = any( arg_espaco_child ) )
      group by ls.link_referencia
    ), items as (
      select
        di.dispoe_artigo_id,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( art ) || to_jsonb( prauth ),
            'artigo_id', 'item_id',
            'artigo_nome', 'item_nome',
            'precario_quantidade', 'item_quantidadecusto',
            'precario_custo', 'item_custo',
            'artigo_descricao', 'item_descricao',
            'artigo_stock', 'item_stock'
          )
        ) items
      from tweeks.dispoe di
        inner join tweeks.artigo art on di.dispoe_artigo_item = art.artigo_id
        inner join tweeks.precario pr on pr.precario_referencia @> jsonb_build_object( 'artigo_id', art.artigo_id )
           and pr.precario_estado = _const.precario_estado_ativo
           and pr.precario_espaco_auth = art.artigo_espaco_auth
        inner join rule.precario_espaco( pr, _const, arg_espaco_auth ) prauth on true
      where di.dispoe_estado = _const.dispoe_estado_ativo
        and art.artigo_estado = _const.artigo_estado_ativo
      group by di.dispoe_artigo_id

    ), artigo_imposto as (
      select
          ip.imposto_artigo_id,
          jsonb_agg(
          lib.jsonb_values(
            to_jsonb( ip ) || to_jsonb( tap )|| to_jsonb( tip ) || to_jsonb( txass ),
            'tipoimposto_id',
            'tipoimposto_nome',
            'tipoimposto_codigo',
            'taxa_percentagem',
            'taplicar_id',
            'taplicar_descricao',
            'taxa_valor'
          )
        ) as impostos
        from tweeks.imposto ip
          inner join tweeks.tipoimposto tip on ip.imposto_tipoimposto_id = tip.tipoimposto_id
          inner join tweeks.taplicar tap on ip.imposto_taplicar_id = tap.taplicar_id
          inner join tweeks.taxa tx on tip.tipoimposto_id = tx.taxa_tipoimposto_id
            and tx.taxa_estado = _const.taxa_estado_ativo
            and tx.taxa_espaco_auth = tip.tipoimposto_espaco_auth
          inner join rule.taxa_espaco( tx, _const, arg_espaco_auth ) txass on true
        where ip.imposto_estado = _const.imposto_estado_ativo
          and tip.tipoimposto_estado = _const.tipoimposto_estado_ativo
        group by ip.imposto_artigo_id
    ), artigo_espaco as (
        select
            art.*,
            clas.*,
            ass.associacao_stock_quantidade as artigo_stock,
            ( prauth::tweeks.precario ).precario_custo as artigo_custo,
            ( prauth::tweeks.precario ).precario_quantidade as artigo_quantidadecusto,
            coalesce( ai.impostos, jsonb_build_array() ) as impostos,
            coalesce( its.items, jsonb_build_array() ) as items,
            coalesce( ass.links, jsonb_build_array() ) as links,
            art.artigo_espaco_auth = arg_espaco_auth as artigo_editinfo,
            true as artigo_editpreco,
            true as artigo_editespaco,
            art.artigo_espaco_auth = arg_espaco_auth as artigo_editimposto
          from tweeks.artigo art
            inner join tweeks.classe clas on art.artigo_classe_id = clas.classe_id
            inner join tweeks.precario pr on pr.precario_referencia @> jsonb_build_object( 'artigo_id', art.artigo_id )
              and pr.precario_estado = _const.precario_estado_ativo
              and pr.precario_espaco_auth = art.artigo_espaco_auth
            inner join rule.precario_espaco( pr, _const, arg_espaco_auth ) prauth on true
            left join associacao ass on ass.link_referencia @> jsonb_build_object( 'artigo_id', art.artigo_id )
            left join items its on art.artigo_id = its.dispoe_artigo_id
            left join artigo_imposto ai on art.artigo_id = ai.imposto_artigo_id
          where
            ( art.artigo_espaco_auth = any( arg_espaco_child ) or ass.link_referencia is not null )
            and case
                when arg_classe_id is null and art.artigo_classe_id != _const.classe_itemextra and art.artigo_estado != _const.artigo_estado_fechado then true
                when art.artigo_classe_id = arg_classe_id then true
                when arg_classe_id is null and art.artigo_estado = _const.artigo_estado_fechado then true
                else false
            end
          order by
            art.artigo_nome
    ) select lib.jsonb_values(
      ae,
      'artigo_id',
      'artigo_codigo',
      'artigo_nome',
      'artigo_custo',
      'artigo_quantidadecusto',
      'artigo_preparacao',
      'artigo_stocknegativo',
      'artigo_foto',
      'artigo_stock',
      'artigo_descricao',
      'artigo_estado',
      'artigo_dataregistro',
      'artigo_dataatualizacao',
      'classe_id',
      'classe_nome',
      'items',
      'impostos',
      'links',
      'artigo_editinfo',
      'artigo_editpreco',
      'artigo_editespaco',
      'artigo_editimposto'
    )
    from artigo_espaco ae;
end;
$$;


--
-- TOC entry 555 (class 1255 OID 23206)
-- Name: funct_load_artigo_associar(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artigo_associar(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carregar os artigos associados
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();

  return query
    with aux as (
      select *
        from tweeks.link l
          inner join tweeks.artigo art on l.link_artigo_id = art.artigo_id
        where l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
          and l.link_espaco_destino = arg_espaco_auth
          and art.artigo_estado = _const.artigo_estado_ativo
    ) select lib.jsonb_values(
      aux,
      'link_id',
      'artigo_id',
      'artigo_nome'
    )
    from aux;
end;
$$;


--
-- TOC entry 569 (class 1255 OID 23207)
-- Name: funct_load_artigo_classe(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artigo_classe(filter jsonb) RETURNS TABLE(
    classe_id uuid,
     classe_classe_id uuid,
      classe_foto character varying,
       classe_position smallint,
        classe_nome character varying,
         classe_estado smallint,
         classe_dataregistro timestamptz,
          classe_dataatualizacao timestamptz,
           classe_ordem smallint, calsse_artigos jsonb)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para caregar os artigos pelas sua categoria
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  _const  map.constant;
begin
  _const := map.constant();
  return query
    with items as (
      select
        di.dispoe_artigo_id,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( art ),
              'artigo_id', 'item_id',
              'artigo_nome', 'item_nome',
              'artigo_quantidadecusto', 'item_quantidadecusto',
              'artigo_custo', 'item_custo',
              'artigo_descricao', 'item_descricao',
              'artigo_stock', 'item_stock'
            )
          ) artigo_items
      from tweeks.dispoe di
        inner join tweeks.artigo art on di.dispoe_artigo_item = art.artigo_id
      where di.dispoe_estado = _const.dispoe_estado_ativo
        and art.artigo_estado = _const.artigo_estado_ativo
      group by di.dispoe_artigo_id

    ), artigo_item as (
      select
        art.*,
        st.stock_id,
        st.stock_quantidade,
        imp as imposto,
        coalesce( its.artigo_items, jsonb_build_array() ) as artigo_items
      from tweeks.artigo art
        inner join tweeks._get_impostos_taxa( art.artigo_id, arg_espaco_auth ) imp on true
        inner join tweeks.link ls on ls.link_referencia @> rule.artigo_referencia( art.artigo_id )
          and ls.link_espaco_destino = arg_espaco_auth
          and ls.link_estado = _const.link_estado_associacao
          and ls.link_tlink_id = _const.tlink_associacao
        inner join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) st on art.artigo_id = st.stock_artigo_id
          and st.stock_estado = _const.stock_estado_ativo
        left join items its on art.artigo_id = its.dispoe_artigo_id

      where art.artigo_estado = _const.artigo_estado_ativo
        and ( st.stock_quantidade > 0 or art.artigo_stocknegativo )
        and st.stock_espacao_id = arg_espaco_auth
    )
    select
      cla.classe_id,
      cla.classe_classe_id,
      cla.classe_foto,
      cla.classe_position,
      cla.classe_nome,
      cla.classe_estado,
      cla.classe_dataregistro,
      cla.classe_dataatualizacao,
      cla.classe_position,
      jsonb_agg( to_jsonb( ai ) order by ai.artigo_nome )
    from tweeks.classe cla
    full outer join artigo_item ai on cla.classe_id = ai.artigo_classe_id
    where cla.classe_estado = _const.classe_estado_ativo
      and cla.classe_id != _const.classe_itemextra
    group by cla.classe_id, cla.classe_nome, cla.classe_position
    order by cla.classe_position
  ;
end;
$$;


--
-- TOC entry 620 (class 1255 OID 27012)
-- Name: funct_load_artigo_composto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--



--
-- TOC entry 570 (class 1255 OID 23208)
-- Name: funct_load_artigo_data(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE  FUNCTION tweeks.funct_load_artigo_data(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    filter := {
      arg_espaco_auth : ID,
      arg_artigos: [
        { arg_artigo_id: ID },
        { arg_artigo_id: ID },
        { arg_artigo_id: ID },
      ]
    }
   */
  arg_artigos jsonb not null default filter->'arg_artigos';
  arg_espaco_auth uuid not null default filter->'arg_espaco_auth';
  arg_artigos_id uuid[] not null default array ( select (el.doc->>'arg_artigo_id')::uuid from jsonb_array_elements( arg_artigos ) el( doc ) );
  _const map.constant;
begin
  _const := map.constant();

  return query

    with arg_artigos as (
      select
          ( el.document->>'arg_artigo_id' )::uuid as arg_atigo_id,
          jsonb_build_object( 'artigo_id', ( el.document->>'arg_artigo_id' )::uuid ) arg_artigo_referencia
        from jsonb_array_elements( arg_artigos ) el ( document )
    ), prepare_artigo as(
      select
          art as artigo,
          prauth as precario,
          ipx as taxas
        from arg_artigos arg
          inner join tweeks.artigo art on arg.arg_atigo_id = art.artigo_id
          inner join tweeks.precario pr on pr.precario_referencia @> arg.arg_artigo_referencia
            and pr.precario_estado = _const.precario_estado_ativo
            and pr.precario_espaco_auth = art.artigo_espaco_auth
          inner join rule.precario_espaco( pr, _const, arg_espaco_auth ) prauth on true
          inner join tweeks._get_impostos_taxa( arg.arg_atigo_id, arg_espaco_auth ) ipx on true
        where art.artigo_id = any( arg_artigos_id )
    ) select
      lib.jsonb_values(
        part,
        'artigo',
        'precario',
        'taxas'
      )
    from prepare_artigo part
  ;
end;
$$;


--
-- TOC entry 571 (class 1255 OID 23209)
-- Name: funct_load_artigo_link(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artigo_link(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver a lista dos artigos na link
    args := {
      arg_link_id: ID,
      arg_espaco_auth: ID,
      arg_colaborador_id: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_link_id uuid not null default filter->>'arg_link_id';

  _const map.constant;

begin
  _const := map.constant();

  return query
    with artigo_item as (
      select
        a.*,
        art.*,
        st.stock_id,
        st.stock_quantidade,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( it ),
            'artigo_id', 'item_id',
            'artigo_nome', 'item_nome',
            'artigo_quantidadecusto', 'item_quantidadecusto',
            'artigo_custo', 'item_custo',
            'artigo_descricao', 'item_descricao',
            'artigo_stock', 'item_stock'
          )
          order by  it.artigo_nome
        ) filter ( where it.artigo_id is not null ) as artigo_items

      from tweeks.link a
        left join tweeks.artigo art on a.link_artigo_id = art.artigo_id
          and art.artigo_estado = _const.artigo_estado_ativo
        left join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) st on art.artigo_id = st.stock_artigo_id
          and st.stock_estado = _const.stock_estado_ativo
          and ( st.stock_quantidade > 0 or art.artigo_stocknegativo )
          and st.stock_espacao_id = arg_espaco_auth
        left join tweeks.dispoe disp on art.artigo_id = disp.dispoe_artigo_id
          and disp.dispoe_estado = _const.dispoe_estado_ativo
        left join tweeks.artigo it on disp.dispoe_artigo_item = it.artigo_id
          and it.artigo_estado = _const.artigo_estado_ativo

      where a.link_espaco_destino = arg_espaco_auth
        and coalesce( a.link_link_id, -1 ) = coalesce( arg_link_id, -1 )
        and a.link_estado = _const.link_estado_ativo

      group by
        art.artigo_id,
        st.stock_id,
        st.stock_quantidade

      order by a.link_posicao
    ), class as (
      select
        cla.*,
        jsonb_agg( to_jsonb( ai ) order by ai.link_posicao, ai.artigo_nome ) as calsse_artigos
      from tweeks.classe cla
        inner join artigo_item ai on cla.classe_id = ai.artigo_classe_id
      where cla.classe_estado = _const.classe_estado_ativo
        and cla.classe_id != _const.classe_itemextra
      group by cla.classe_id
      order by cla.classe_nome
    )
    select lib.jsonb_values(
      cl,
      'classe_id',
      'classe_nome',
      'classe_estado',
      'classe_dataregistro',
      'classe_dataatualizacao',
      'calsse_artigos'
    )
      from class cl
  ;
end;
$$;


--
-- TOC entry 572 (class 1255 OID 23210)
-- Name: funct_load_artigo_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artigo_simple(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    artigo_id uuid, artigo_nome character varying, artigo_descricao character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Devolver uma lista simples de artigos
    filter :{
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;

begin
  _const := map.constant();
  return query
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_descricao
      from tweeks.artigo art
      where art.artigo_estado = _const.artigo_estado_ativo
        and art.artigo_classe_id != _const.classe_itemextra
        and art.artigo_espaco_auth = any( arg_espaco_child )
  ;
end;
$$;


--
-- TOC entry 573 (class 1255 OID 23211)
-- Name: funct_load_artigo_tecla(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_artigo_tecla(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para caregar os artigos pelas sua categoria
    filter := {
      arg_espaco_auth: ID,
      arg_link_id: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_link_id uuid not null default filter->>'arg_link_id';
  _const  map.constant;
begin
  _const := map.constant();
  return query
    with items as (
      select
        di.dispoe_artigo_id,
        jsonb_agg(
          lib.jsonb_values_as(
            to_jsonb( art ),
              'artigo_id', 'item_id',
              'artigo_nome', 'item_nome',
              'artigo_quantidadecusto', 'item_quantidadecusto',
              'artigo_custo', 'item_custo',
              'artigo_descricao', 'item_descricao',
              'artigo_stock', 'item_stock'
            )
          ) artigo_items
      from tweeks.dispoe di
             inner join tweeks.artigo art on di.dispoe_artigo_item = art.artigo_id
      where di.dispoe_estado = _const.dispoe_estado_ativo
        and art.artigo_estado = _const.artigo_estado_ativo
      group by di.dispoe_artigo_id

    ), artigo_item as (
      select
        art.*,
        st.stock_id,
        st.stock_quantidade,
        coalesce( its.artigo_items, jsonb_build_array() ) as artigo_items
      from tweeks.artigo art
        inner join tweeks.link ls on art.artigo_id = ls.link_artigo_id
          and ls.link_espaco_destino = arg_espaco_auth
          and ls.link_estado = _const.link_estado_associacao
          and ls.link_tlink_id = _const.tlink_associacao
        inner join tweeks._get_stock( art.artigo_id, arg_espaco_auth ) st on art.artigo_id = st.stock_artigo_id
          and st.stock_estado = _const.stock_estado_ativo
        left join items its on art.artigo_id = its.dispoe_artigo_id

      where art.artigo_estado = _const.artigo_estado_ativo
        and ( st.stock_quantidade > 0 or art.artigo_stocknegativo )
        and st.stock_espacao_id = arg_espaco_auth
    ), teclas as (
      select
          l.*,
          tl.*,
          case
            when tl.tlink_id = _const.tlink_artigo then lib.jsonb_values(
              ai,
              'artigo_id',
              'artigo_codigo',
              'artigo_nome',
              'artigo_custo',
              'artigo_quantidadecusto',
              'artigo_preparacao',
              'artigo_foto',
              'artigo_descricao',
              'artigo_stock',
              'artigo_stocknegativo',
              'artigo_stockminimo',
              'artigo_items'
            )
          end as artigo
        from tweeks.link l
          inner join tweeks.tlink tl on l.link_tlink_id = tl.tlink_id
          left join artigo_item ai on l.link_artigo_id = ai.artigo_id
        where l.link_estado = _const.link_estado_ativo
          and coalesce( l.link_link_id, -1 ) = coalesce( arg_link_id, -1 )
          and l.link_espaco_destino = arg_espaco_auth
    )
    select lib.jsonb_values(
      tc,
      'link_id',
      'link_posicao',
      'link_nome',
      'link_custo',
      'link_config',
      'link_quantidadecusto',
      'link_estado',
      'tlink_id',
      'tlink_designacao',
      'artigo'
      )
      from teclas tc
  ;
end;
$$;


--
-- TOC entry 575 (class 1255 OID 23212)
-- Name: funct_load_caixa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_caixa(filter jsonb DEFAULT NULL::jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
    /** Essa função serve para devolver todas as caixas
      arg_espaco_auth: ID,
      arg_caixa_estado: [ ],
      arg_posto_showmontante: boolean,

     */
    arg_espaco_auth uuid default filter->>'arg_espaco_auth';
    arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
    arg_caixa_estado int2[] default array( select jsonb_array_elements_text( filter->'arg_caixa_estado' )::int2 );
    arg_posto_showmontante boolean default filter->>'arg_posto_showmontante';
    arg_show  text[];
    _const map.constant;
begin
    _const := map.constant();

    if filter->'arg_caixa_estado' is null then
        arg_caixa_estado := array[ _const.caixa_estado_ativo ];
    end if;

    arg_show := array[
        'caixa_id',
        'caixa_montanteinicial',
        'caixa_montantefecho',
        'caixa_montanteinicialposto',
        'caixa_montantefechoposto',
        'caixa_quantidadecheque',
        'caixa_observacao',
        'posto_id',
        'posto_designacao',
        'colaborador_id',
        'colaborador_nome',
        'colaborador_apelido'
        ];

    if arg_posto_showmontante then
        arg_show := arg_show || array[
            'posto_montante',
            'conta_cheques',
            'conta_montantevenda',
            'caixa_montante'
            ];
    end if;

    return query
        with loads as (
            select
                cx.*,
                pos.*,
                col.*,
                count( distinct ct.conta_id ) conta_cheques,
                sum( ct.conta_montante ) as conta_montantevenda,
                cx.caixa_montanteinicial + sum( ct.conta_montante ) as caixa_montante
            from tweeks.caixa cx
                     inner join tweeks.posto pos on cx.caixa_posto_id = pos.posto_id
                     inner join auth.colaborador col on cx.caixa_colaborador_id = col.colaborador_id
                     left join tweeks.conta ct on cx.caixa_id = ct.conta_caixa_fechopagamento
                and ct.conta_estado = _const.conta_estado_pago
            where cx.caixa_estado = any( arg_caixa_estado )
              and cx.caixa_espaco_auth = any( arg_espaco_child )
            group by cx.caixa_id,
                     pos.posto_id,
                     col.colaborador_id
            order by
                case
                    when cx.caixa_estado = _const.caixa_estado_ativo then 1
                    when cx.caixa_estado = _const.cambio_estado_fechado then 3
                    else 2
                    end asc,
                cx.caixa_dataregistro desc
        ) select lib.jsonb_values( to_jsonb( l ), variadic arg_show )
        from loads l
    ;
end;
$$;


--
-- TOC entry 576 (class 1255 OID 23213)
-- Name: funct_load_caixa_by_colaborador(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_caixa_by_colaborador(filter jsonb) RETURNS TABLE(
    caixa_id uuid,
     caixa_montanteinicial float,
      caixa_estado smallint,
      caixa_dataregistro timestamptz, caixa_dataatualizacao timestamptz,
       posto_id uuid,
        posto_designacao character varying,
        posto_montante float,
         posto_estado smallint,
         posto_dataregistro timestamptz,
          posto_dataatualizacao timestamptz,
           espaco_id uuid, espaco_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carragar a posto do colaborador
    filter := {
      arg_colaborador_id: ID,
    }
   */
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
      ab.caixa_id,
      ab.caixa_montanteinicial,
      ab.caixa_estado,
      ab.caixa_dataregistro,
      ab.caixa_dataatualizacao,
      cx.posto_id,
      cx.posto_designacao,
      cx.posto_montante,
      cx.posto_estado,
      cx.posto_dataregistro,
      cx.posto_dataatualizacao,
      esp.espaco_id,
      esp.espaco_nome
    from tweeks.caixa ab
      inner join tweeks.posto cx on ab.caixa_posto_id = cx.posto_id
      inner join tweeks.espaco esp on cx.posto_espaco_id = esp.espaco_id
    where ab.caixa_colaborador_id = arg_colaborador_id
      and ab.caixa_estado = _const.caixa_estado_ativo
      and cx.posto_estado = _const.posto_estado_aberto
  ;
end;
$$;


--
-- TOC entry 577 (class 1255 OID 23214)
-- Name: funct_load_cambio_ativo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_cambio_ativo(filter jsonb) RETURNS TABLE(
    cambio_id uuid, cambio_taxa float,
     cambio_data date, currency_id smallint,
      currency_name character varying,
       currency_symbol character varying,
        currency_code character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função carrega os cambios ativo
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  return query
    select
        cb.cambio_id,
        cb.cambio_taxa,
        cb.cambio_data,
        cur.currency_id,
        cur.currency_name,
        cur.currency_code,
        cur.currency_symbol
      from tweeks.cambio cb
        inner join geoinfo.currency cur on cb.cambio_currency_id = cur.currency_id
      where cb.cambio_estado = _const.cambio_estado_ativo
        and cb.cambio_espaco_auth = arg_espaco_auth
      order by cb.cambio_data desc
  ;
end;
$$;


--
-- TOC entry 578 (class 1255 OID 23215)
-- Name: funct_load_cambio_dia(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--
CREATE or replace FUNCTION tweeks.funct_load_cambio_dia(filter jsonb) RETURNS TABLE(
    cambio_id uuid,
     cambio_taxa double precision,
      cambio_data date,
       cambio_estado smallint,
        cambio_dataregistro timestamptz)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para devolver o cambio do dia de uma moeda
    filter := {
      arg_espaco_auth: ID
      arg_currency_id: ID
      arg_cambio_data: DATE
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_currency_id int2 default filter->>'arg_currency_id';
  arg_cambio_data date default filter->>'arg_cambio_data';
  _const map.constant;
begin
  _const := map.constant();

  arg_cambio_data := coalesce( arg_cambio_data, current_date );
  arg_cambio_data := coalesce( current_date );

  return query
    select
      cb.cambio_id,
      cb.cambio_taxa,
      cb.cambio_data,
      cb.cambio_estado,
      cb.cambio_dataatualizacao
    from tweeks.cambio cb
    where cb.cambio_currency_id = arg_currency_id
      and cb.cambio_data <= arg_cambio_data
      and cb.cambio_estado != _const.cambio_estado_anulado
      and cb.cambio_espaco_auth = arg_espaco_auth
    order by cb.cambio_dataregistro desc
    limit 1
  ;
end;
$$;


--
-- TOC entry 579 (class 1255 OID 23216)
-- Name: funct_load_cambio_history(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_load_cambio_history(filter jsonb) RETURNS TABLE(
    cambio_id uuid,
    cambio_taxa double precision,
    cambio_data date,
     cambio_estado smallint,
      cambio_dataregistro timestamptz,
       cambio_dataatualizacao timestamptz,
        currency_id smallint,
         currency_name character varying, currency_symbol character varying, currency_code character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função carrega os cambios ativo
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  _const map.constant;
begin
  _const := map.constant();
  return query
    select
        cb.cambio_id,
        cb.cambio_taxa,
        cb.cambio_data,
        cb.cambio_estado,
        cb.cambio_dataregistro,
        cb.cambio_dataatualizacao,

        cur.currency_id,
        cur.currency_name,
        cur.currency_code,
        cur.currency_symbol

      from tweeks.cambio cb
        inner join geoinfo.currency cur on cb.cambio_currency_id = cur.currency_id
      where cb.cambio_espaco_auth = arg_espaco_auth
      order by cb.cambio_data desc,
        cb.cambio_dataregistro desc
  ;
end;
$$;


--
-- TOC entry 581 (class 1255 OID 23217)
-- Name: funct_load_classe_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_classe_simple(filter jsonb DEFAULT NULL::jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carregar as listas de classes ativas
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        jsonb_build_object(
            'classe_id', cla.classe_id,
            'classe_classe_id', cla.classe_classe_id,
            'classe_nome', cla.classe_nome,
            'classe_foto', cla.classe_foto,
            'classe_position', cla.classe_position
        )
      from tweeks.classe cla
        left join tweeks.link l on l.link_referencia @> jsonb_build_object( 'classe_id', cla.classe_id )
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
      where cla.classe_estado = _const.classe_estado_ativo
        and ( cla.classe_espaco_auth = any( arg_espaco_child ) or l.link_espaco_auth = any( arg_espaco_child ) or l.link_espaco_destino = any( arg_espaco_child ) )
      group by cla.classe_id, cla.classe_nome
      order by
        case
          when cla.classe_id != _const.classe_itemextra then 1
          else 2
        end asc,
        cla.classe_nome asc
    ;

  return query select jsonb_build_object(
      'null', -1::int2, 'Estado', 'Desativados'::varchar
  );
end;
$$;


--
-- TOC entry 582 (class 1255 OID 23218)
-- Name: funct_load_classe_simple_report(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_classe_simple_report(filter jsonb DEFAULT NULL::jsonb) RETURNS TABLE(
    classe_id uuid,
    classe_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carregar as listas de classes ativas
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        cla.classe_id,
        cla.classe_nome
      from tweeks.classe cla
        left join tweeks.link l on l.link_referencia @> jsonb_build_object( 'classe_id', cla.classe_id )
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
      where cla.classe_estado = _const.classe_estado_ativo
        and ( cla.classe_espaco_auth = any( arg_espaco_child ) or l.link_espaco_auth = any( arg_espaco_child ) or l.link_espaco_destino = any( arg_espaco_child ) )
      group by cla.classe_id
      order by
        case
          when cla.classe_id != _const.classe_itemextra then 1
          else 2
        end asc,
        cla.classe_nome asc
    ;

  return query select null::int2, 'Desativados'::varchar;
end;
$$;
--
-- TOC entry 583 (class 1255 OID 23219)
-- Name: funct_load_colaborador(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_colaborador(filter jsonb) RETURNS TABLE(
    colaborador_id uuid,
     colaborador_nome character varying,
      colaborador_apelido character varying,
       colaborador_mail character varying,
        colaborador_estado smallint,
         colaborador_estadodesc character varying,
          colaborador_acesso smallint,
           colaborador_acessodesc character varying,
            colaborador_foto character varying,
             sexo_id smallint,
              sexo_nome character varying,
               sexo_codigo character,
                colaborador_datanascimento date, colaborador_nif character varying, espacos jsonb)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função sere para carregar os colaborador apartir dos filtros expecificados
    filetr := {
      arg_espaco_auth: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  arg_colaborador_email character varying default filter->>'arg_colaborador_email';
  arg_colaborador_nif character varying default filter->>'arg_colaborador_nif';
  _const map.constant;
begin
  _const :=  map.constant();

  return query
    select
        co.colaborador_id,
        co.colaborador_nome,
        co.colaborador_apelido,
        co.colaborador_email,
        co.colaborador_estado,
        auth._colaborador_estado_desc( co.colaborador_estado ),
        co.colaborador_accesso,
        auth._colaborador_accesso_desc( co.colaborador_accesso ),
        co.colaborador_foto,
        s2.tsexo_id,
        s2.tsexo_nome,
        s2.tsexo_codigo,
        co.colaborador_datanascimento,
        co.colaborador_nif,
        jsonb_agg( lib.jsonb_values(
            to_jsonb( tr ) || to_jsonb( esp ),
            'trabalha_id',
            'espaco_id',
            'espaco_nome'
          ) order by tr.trabalha_posicao,
            esp.espaco_nivel,
            esp.espaco_id
        ) filter ( where tr.trabalha_id is not null and esp.espaco_id is not null )
      from auth.colaborador co
        left join tweeks.trabalha tr on co.colaborador_id = tr.trabalha_colaborador_proprietario
          and tr.trabalha_estado = _const.trabalha_estado_ativo
          and ( tr.trabalha_espaco_auth = any( arg_espaco_child ) or tr.trabalha_espaco_destino = any( arg_espaco_child ))
        left join tweeks.espaco esp on tr.trabalha_espaco_destino = esp.espaco_id
          and esp.espaco_estado = _const.espaco_estado_ativo
        left join auth.tsexo s2 ON co.colaborador_tsexo_id = s2.tsexo_id
      where co.colaborador_tipo in ( _const.colaborador_tipo_user, _const.colaborador_tipo_user_master )
        and co.colaborador_email = coalesce( arg_colaborador_email, co.colaborador_email )
        and co.colaborador_nif = coalesce( arg_colaborador_nif, co.colaborador_nif )
        and (
          co.colaborador_espaco_auth = any( arg_espaco_child )
          or tr.trabalha_espaco_destino = any( arg_espaco_child )
        )
      group by co.colaborador_id,
        s2.tsexo_id
      order by
        case
          when co.colaborador_accesso = _const.colaborador_accesso_ativo then 1
          when co.colaborador_accesso = _const.colaborador_accesso_pendente then 2
          when co.colaborador_accesso = _const.colaborador_accesso_fechado then 3
        end asc,
        co.colaborador_nome,
        co.colaborador_apelido
      ;
end;
$$;


--
-- TOC entry 584 (class 1255 OID 23220)
-- Name: funct_load_colaborador_by_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_colaborador_by_posto(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver os colaboradores que tenha pelo menos um menu especificado
    filter := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_posto_id: ID,
      arg_menus: [
        menu_codigo,
        menu_codigo,
        menu_codigo
      ]
    }
  **/
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  -- arg_posto_id int2 default filter->>'arg_posto_id';
  args_menus varchar[ ] := array( select distinct doc.menu_codigo from jsonb_array_elements_text( filter->'arg_menus' ) doc( menu_codigo ) );
  _const map.constant;
begin
  _const := map.constant();

  return query
    with users as (
      select co.*
      from auth.colaborador co
        inner join tweeks.trabalha tr on co.colaborador_id = tr.trabalha_colaborador_proprietario
        inner join tweeks.espaco esp on tr.trabalha_espaco_destino = esp.espaco_id
        inner join tweeks.posto pos on esp.espaco_id = pos.posto_espaco_destino
        inner join auth.acesso acc on co.colaborador_id = acc.acesso_colaborador_propetario
        inner join auth.menu men on acc.acesso_menu_id = men.menu_id
      where
            -- pos.posto_id = arg_posto_id
        /*and*/ tr.trabalha_estado = _const.trabalha_estado_ativo
        and tr.trabalha_espaco_destino = arg_espaco_auth
        and pos.posto_estado != _const.posto_estado_encerado
        and esp.espaco_estado = _const.espaco_estado_ativo
        and acc.acesso_estado = _const.acesso_estado_ativo
        and co.colaborador_estado = _const.colaborador_estado_ativo
        and men.menu_codigo = any( args_menus )
        and co.colaborador_id = coalesce( arg_colaborador_id, co.colaborador_id )
      group by co.colaborador_id
      having count( men.menu_id ) > 0
      order by
        co.colaborador_dataultimologin  desc nulls last,
        co.colaborador_nome,
        co.colaborador_apelido
    ) select
        lib.jsonb_values(
          us,
          'colaborador_id',
          'colaborador_nome',
          'colaborador_apelido',
          'colaborador_foto'
        )
      from users us
  ;
end;
$$;


--
-- TOC entry 585 (class 1255 OID 23221)
-- Name: funct_load_conta(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

create or replace function tweeks.funct_load_conta(filter jsonb) RETURNS TABLE(
    conta_id uuid,
     conta_numero integer,
      conta_titular character varying,
       conta_titularnif character varying,
       conta_data date,
        conta_numerofatura character varying,
         conta_montante double precision,
          conta_montanteamortizado double precision,
           conta_estado smallint,
            conta_dataregistro timestamptz,
             conta_dataatualizacao timestamptz,
              conta_artigos bigint,
               mesa_id uuid,
                mesa_numero character varying,
                 mesa_designacao character varying,
                  colaborador_id uuid,
                   colaborador_nome character varying,
                    colaborador_apelido character varying )
    LANGUAGE plpgsql
    AS $$
declare
    /** Essa função serve para listar as mesas registradas
      args := {
        arg_espaco_auth: ID,
        arg_colaborador_id: ID,
      }
     */
    _const map.constant;
    arg_colaborador_id uuid default filter->>'arg_colaborador_id';
    arg_espaco_auth uuid default filter->>'arg_espaco_auth';
begin
    _const := map.constant();

    return query
        select
            cont.conta_id,
            cont.conta_numero,
            cont.conta_titular,
            cont.conta_titularnif,
            cont.conta_data,
            cont.conta_numerofatura,
            cont.conta_montante,
            cont.conta_montanteamortizado,
            cont.conta_estado,
            cont.conta_dataregistro,
            cont.conta_dataatualizacao,
            count( distinct ve.venda_id ),
            m.mesa_id,
            m.mesa_numero,
            m.mesa_designacao,
            c.colaborador_id,
            c.colaborador_nome,
            c.colaborador_apelido

        from conta cont
                 inner join tweeks.venda ve on cont.conta_id = ve.venda_conta_id
            and ve.venda_estado in ( _const.venda_estado_aberto, _const.venda_estado_fechado )
                 inner join auth.colaborador c on cont.conta_colaborador_id = c.colaborador_id
                 left join tweeks.mesa m on cont.conta_mesa_id = m.mesa_id
        where cont.conta_estado in ( _const.conta_estado_aberto )
          and cont.conta_espaco_auth = arg_espaco_auth
        group by
            cont.conta_id,
            m.mesa_id,
            c.colaborador_id
        order by
            case
                when cont.conta_estado = _const.conta_estado_aberto then 1
                end asc,

            case
                when cont.conta_colaborador_id = arg_colaborador_id then 1
                else 2
                end asc,
            cont.conta_dataregistro desc
    ;
end;
$$;


--
-- TOC entry 574 (class 1255 OID 23222)
-- Name: funct_load_conta_by_caixa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_conta_by_caixa(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função server para devolver a lista de todas as contas pagas em uma caixa
    filter := {
      arg_caixa_id: ID
    }
   */
  arg_caixa_id uuid default filter->>'arg_caixa_id';
  _const map.constant;
begin
  _const := map.constant();

  return query
    select to_jsonb( tweeks.funct_load_conta_data( jsonb_build_object( 'arg_conta_id', ct.conta_id ) ) )
      from tweeks.conta ct
      where ct.conta_caixa_fechopagamento = arg_caixa_id
        and ct.conta_estado = _const.conta_estado_pago
  ;
end;
$$;


--
-- TOC entry 586 (class 1255 OID 23223)
-- Name: funct_load_conta_data(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_conta_data(filter jsonb) RETURNS TABLE(
    conta_id uuid,
     conta_numero integer,
     conta_titular character varying,
      conta_titularnif character varying,
       conta_data date,
        conta_numerofatura character varying,
         conta_montante double precision,
         conta_montanteamortizado float,
          conta_estado smallint,
           conta_imprensa smallint,
            conta_dataregistro timestamptz,
             conta_dataatualizacao timestamptz,
              mesa_id uuid,
               mesa_numero character varying,
                mesa_lotacao smallint,
                 mesa_designacao character varying,
                  currency_id smallint,
                   currency_code character varying,
                    currency_name character varying,
                     tpaga_id smallint,
                      tpaga_designacao character varying,
                       colaborador_id uuid,
                        colaborador_nome character varying,
                         colaborador_apelido character varying, vendas jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    /**
      Essa função devolve uma mesa juntamente com as conta associada que ainda esta aberta
      filter := {
        arg_espaco_auth: ID
      }
     */

    arg_espaco_auth uuid  not null default filter->>'arg_espaco_auth';
    arg_conta_id uuid default filter->>'arg_conta_id';

    _const map.constant;
begin

    _const := map.constant();

    return query
        with conta_venda as (
            select
                art.*,
                ve.*,
                coalesce(
                                jsonb_agg(
                                lib.jsonb_values_as(
                                            to_jsonb( agg ) || to_jsonb( it ),
                                            'artigo_id', 'item_id',
                                            'artigo_nome', 'item_nome',
                                            'artigo_custo', 'item_custo',
                                            'agrega_id', 'agrega_id',
                                            'agrega_quantidade', 'agrega_quantidade',
                                            'agrega_custounitario', 'agrega_custounitario',
                                            'agrega_montante', 'agrega_montante'
                                    ) order by it.artigo_nome asc ) filter (
                                    where it.artigo_id is not null
                                    ),
                                jsonb_build_array()
                    ) as items
            from tweeks.venda ve
                     inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
                     left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
                and agg.agrega_estado in ( _const.agrega_estado_aberto, _const.agrega_estado_fechado )
                     left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id
            where ve.venda_estado in ( _const.venda_estado_aberto, _const.venda_estado_fechado )
            group by art.artigo_id,
                     ve.venda_id
        )
        select
            ct.conta_id,
            ct.conta_numero,
            ct.conta_titular,
            ct.conta_titularnif,
            ct.conta_data,
            ct.conta_numerofatura,
            ct.conta_montante,
            ct.conta_montanteamortizado,
            ct.conta_estado,
            ct.conta_imprensa,
            ct.conta_dataregistro,
            ct.conta_dataatualizacao,

            m.mesa_id,
            m.mesa_numero,
            m.mesa_lotacao,
            m.mesa_designacao,

            cur.currency_id,
            cur.currency_code,
            cur.currency_name,

            tpag.tpaga_id,
            tpag.tpaga_designacao,

            col.colaborador_id,
            col.colaborador_nome,
            col.colaborador_apelido,
            jsonb_agg(
                    lib.jsonb_values(
                            to_jsonb( vd ),
                            'artigo_id',
                            'artigo_codigo',
                            'artigo_nome',
                            'artigo_custo',
                            'artigo_stocknegativo',
                            'artigo_foto',
                            'venda_id',
                            'venda_quantidade',
                            'venda_custounitario',
                            'venda_montente',
                            'venda_montanteagregado',
                            'venda_montantetotal',
                            'venda_estado',
                            'items'
                        )
                    order by vd.artigo_nome asc
                )
        from tweeks.conta ct
                 inner join auth.colaborador col on ct.conta_colaborador_id = col.colaborador_id
                 left join tweeks.mesa m on ct.conta_mesa_id = m.mesa_id
                 left join geoinfo.currency cur on ct.conta_currency_id = cur.currency_id
                 left join tweeks.tpaga tpag on ct.conta_tpaga_id = tpag.tpaga_id
                 left join conta_venda vd on ct.conta_id = vd.venda_conta_id

        where ct.conta_id = arg_conta_id
        group by
            ct.conta_id,
            m.mesa_id,
            col.colaborador_id,
            tpag.tpaga_id,
            cur.currency_id
    ;
end;
$$;


--
-- TOC entry 587 (class 1255 OID 23224)
-- Name: funct_load_conta_dia(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_conta_dia(filter jsonb DEFAULT NULL::jsonb)
RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver as compras do dia em uma data especifica
    filter := {
      arg_conta_data: DATE
      arg_espaco_auth: DATE
    }
   */
  _const map.constant;
  arg_conta_data date default filter->>'arg_conta_data';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );
begin

  _const := map.constant();

  arg_conta_data := coalesce( arg_conta_data, current_date );

  return query
    select lib.jsonb_values(
        lib.jsonb_concat( to_jsonb( ct ), to_jsonb( pos ), to_jsonb( cur ), to_jsonb( tp ) ) ,
        'conta_id',
        'conta_titular',
        'conta_data',
        'conta_numero',
        'conta_numerofatura',
        'conta_montante',
        'conta_montanteamortizado',
        'conta_montantetroco',
        'conta_montantemoeda',
        'conta_imprensa',
        'conta_estado',
        'conta_dataregistro',
        'conta_titularnif',
        'conta_taxacambio',
        'posto_designacao',
        'tpaga_designacao',
        'currency_code'
      ) || jsonb_build_object(
        'conta_estadodesc', case
          when ct.conta_estado = _const.conta_estado_aberto then 'Aberto'
          when ct.conta_estado = _const.conta_estado_fechado then 'Fechado'
          when ct.conta_estado = _const.conta_estado_pago then 'Pago'
          when ct.conta_estado = _const.conta_estado_aberto then 'Anulado'
        end,
        'colaborador', jsonb_build_object(
          'colaborador_id', col.colaborador_id,
          'colaborador_nome', col.colaborador_nome,
          'colaborador_apelido', col.colaborador_apelido
        ),
        'colaborador_pay', jsonb_build_object(
          'colaborador_id', colpay.colaborador_id,
          'colaborador_nome', colpay.colaborador_nome,
          'colaborador_apelido', colpay.colaborador_apelido
        )
      )
      from tweeks.conta ct
        inner join tweeks.posto pos on ct.conta_posto_id = pos.posto_id
        inner join auth.colaborador col on ct.conta_colaborador_id = col.colaborador_id
        left join geoinfo.currency cur on ct.conta_currency_id = cur.currency_id
        left join tweeks.tpaga tp on ct.conta_tpaga_id = tp.tpaga_id
        left join tweeks.caixa cxclose on ct.conta_caixa_fechopagamento = cxclose.caixa_id
        left join auth.colaborador colpay on ct.conta_colaborador_atualizacao = colpay.colaborador_id
          and ct.conta_estado = _const.conta_estado_pago

      where ct.conta_estado in (
        _const.conta_estado_pago,
        _const.conta_estado_fechado,
        _const.conta_estado_aberto
      )
      and ct.conta_espaco_auth = any( arg_espaco_child )
      and coalesce( ct.conta_data, ct.conta_dataregistro::date ) = arg_conta_data
      order by ct.conta_dataregistro desc
    ;
end
$$;


--
-- TOC entry 588 (class 1255 OID 23225)
-- Name: funct_load_conta_preparacao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_conta_preparacao(filter jsonb)
 RETURNS TABLE(
     conta_id uuid,
 conta_numero integer,
  conta_titular character varying,
   conta_titularnif character varying,
    conta_data date,
     conta_numerofatura character varying,
      conta_montante float,
       conta_montanteamortizado float,
        conta_estado smallint,
         conta_imprensa smallint,
          conta_dataregistro timestamptz,
           conta_dataatualizacao timestamptz,
            mesa_id uuid,
             mesa_numero character varying,
              mesa_lotacao smallint,
               mesa_designacao character varying,
                currency_id smallint,
                 currency_code character varying,
                  currency_name character varying,
                   tpaga_id smallint,
                    tpaga_designacao character varying,
                     colaborador_id uuid,
                      colaborador_nome character varying,
                       colaborador_apelido character varying,
                        vendas jsonb
              )
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função devolve uma mesa juntamente com as conta associada que ainda esta aberta
    filter := {
      arg_conta_id
    }
   */
  arg_conta_id uuid default filter->>'arg_conta_id';

  _const map.constant;
begin

  _const := map.constant();

  return query
    with conta_venda as (
      select
          art.*,
          ve.*,
          coalesce(
            jsonb_agg(
            lib.jsonb_values_as(
              to_jsonb( agg ) || to_jsonb( it ),
              'artigo_id', 'item_id',
              'artigo_nome', 'item_nome',
              'artigo_custo', 'item_custo',
              'agrega_id', 'agrega_id',
              'agrega_quantidade', 'agrega_quantidade',
              'agrega_custounitario', 'agrega_custounitario',
              'agrega_montante', 'agrega_montante'
            ) order by it.artigo_nome asc ) filter ( where it.artigo_id is not null ),
            jsonb_build_array()
          ) as items
        from tweeks.venda ve
          inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
          left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
            and agg.agrega_estado in ( _const.agrega_estado_aberto, _const.agrega_estado_fechado )
          left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id
        where ve.venda_estado in ( _const.venda_estado_aberto )
          and ve.venda_estadopreparacao = _const.venda_estadopreparacao_pendente
        group by art.artigo_id,
        ve.venda_id
    )
    select
      ct.conta_id,
      ct.conta_numero,
      ct.conta_titular,
      ct.conta_titularnif,
      ct.conta_data,
      ct.conta_numerofatura,
      ct.conta_montante,
      ct.conta_montanteamortizado,
      ct.conta_estado,
      ct.conta_imprensa,
      ct.conta_dataregistro,
      ct.conta_dataatualizacao,

      m.mesa_id,
      m.mesa_numero,
      m.mesa_lotacao,
      m.mesa_designacao,

      cur.currency_id,
      cur.currency_code,
      cur.currency_name,

      tpag.tpaga_id,
      tpag.tpaga_designacao,

      col.colaborador_id,
      col.colaborador_nome,
      col.colaborador_apelido,
      jsonb_agg(
          lib.jsonb_values(
            to_jsonb( vd ),
            'artigo_id',
            'artigo_codigo',
            'artigo_nome',
            'artigo_custo',
            'artigo_stocknegativo',
            'venda_id',
            'venda_quantidade',
            'venda_custounitario',
            'venda_montente',
            'venda_montanteagregado',
            'venda_montantetotal',
            'venda_estado',
            'items'
            )
          order by vd.artigo_nome asc
        )
    from tweeks.conta ct
      inner join auth.colaborador col on ct.conta_colaborador_id = col.colaborador_id
      left join tweeks.mesa m on ct.conta_mesa_id = m.mesa_id
      left join geoinfo.currency cur on ct.conta_currency_id = cur.currency_id
      left join tweeks.tpaga tpag on ct.conta_tpaga_id = tpag.tpaga_id
      left join conta_venda vd on ct.conta_id = vd.venda_conta_id

    where ct.conta_id = arg_conta_id
    group by
      ct.conta_id,
      m.mesa_id,
      col.colaborador_id,
      tpag.tpaga_id,
      cur.currency_id
  ;
end;
$$;


--
-- TOC entry 589 (class 1255 OID 23226)
-- Name: funct_load_device_unregistered(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_device_unregistered(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_dispositivos: [
        {
          client_ip: IP
          client_mac: IP
          client_hostname: HOSTNAME
          client_ipv4: IPV4
          client_ipv6: IPV6
          client_distro: DISTRO
          client_platform: PLATFORM
          client_vendor: VENDOR
          client_user: USER
        }
      ]
    }
   */
  arg_dispositivos jsonb default filter->'arg_dispositivos';
begin
  return query
  with devices_found as (
    select
        el.document->>'client_ip' as posto_ip,
        el.document->>'client_mac' as posto_mac,
        el.document->>'client_hostname' as posto_hostname,
        el.document->>'client_ipv6' as posto_ipv6,
        el.document->>'client_distro' as posto_distro,
        el.document->>'client_vendor' as posto_vendor,
        el.document->>'client_user' as posto_user,
        coalesce( el.document->>'client_user', el.document->>'client_hostname' ) as client_label
      from jsonb_array_elements( arg_dispositivos ) el( document )
  ), no_registred as (
    select dvf.*,
           case
             when dvf.client_label is not null then format( '%s (%s)', dvf.posto_mac, dvf.client_label )
             else  dvf.posto_mac
          end as client_label
      from devices_found dvf
        left join tweeks.posto pt on dvf.posto_mac = pt.posto_mac
      where pt.posto_id is null
  )  select lib.jsonb_values(
        nr,
        'posto_ip',
        'posto_mac',
        'posto_hostname',
        'posto_ipv4',
        'posto_ipv6',
        'posto_distro',
        'posto_platform',
        'posto_vendor',
        'posto_user',
        'client_label'
      )
    from no_registred nr
  ;
end;
$$;


--
-- TOC entry 580 (class 1255 OID 23227)
-- Name: funct_load_entrada(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_load_entrada(filter jsonb) RETURNS TABLE(
    entrada_id uuid,
     entrada_data date,
      entrada_codigofatura character varying,
       entrada_quantidade double precision,
        entrada_montante double precision,
         entrada_descricao character varying,
          entrada_estado smallint,
           entrada_dataregistro timestamptz,
            entrada_dataatualizacao timestamptz,
             artigo_id uuid,
              artigo_nome character varying,
               artigo_codigo character varying,
                espaco_id uuid,
                 espaco_nome character varying,
                  fornecedor_id uuid,
                   fornecedor_nome character varying,
                    fornecedor_nif character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /**
      Essa função serve para listar as entradas de artigos no stock
      filter := {
        arg_fornecedor_id: ID,
        arg_artigo_id: ID,
        arg_local_id: ID,
      }
   */

  arg_fornecedor_id uuid default filter ->>'arg_fornecedor_id';
  arg_artigo_id uuid default filter ->> 'arg_artigo_id';
  arg_espaco_id uuid default filter->>'arg_espaco_id';
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );

begin
  return query
    select
        ent.entrada_id ,
        ent.entrada_data,
        ent.entrada_codigofatura,
        ent.entrada_quantidade,
        ent.entrada_montante,
        ent.entrada_descricao,
        ent.entrada_estado,
        ent.entrada_dataregistro,
        ent.entrada_dataatualizacao,

        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,

        esp.espaco_id,
        esp.espaco_nome,

        forn.fornecedor_id,
        forn.fornecedor_nome,
        forn.fornecedor_nif
      from tweeks.entrada ent
        inner join tweeks.artigo art on ent.entrada_artigo_id = art.artigo_id
        inner join tweeks.espaco esp on ent.entrada_espaco_id = esp.espaco_id
        inner join tweeks.fornecedor forn on ent.entrada_fornecedor_id = forn.fornecedor_id
      where forn.fornecedor_id = coalesce( arg_fornecedor_id, forn.fornecedor_id )
        and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and esp.espaco_id = coalesce( arg_espaco_id, esp.espaco_id )
        and forn.fornecedor_espaco_auth = any( arg_espaco_child )
      order by ent.entrada_data desc,
        ent.entrada_dataregistro desc
    ;
end;
$$;


--
-- TOC entry 591 (class 1255 OID 23228)
-- Name: funct_load_espaco(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_espaco(filter jsonb) RETURNS TABLE(
    espaco_id uuid,
     espaco_nome character varying,
     espaco_descricao character varying,
      espaco_estado smallint,
       espaco_dataregistro timestamptz,
        espaco_dataatualizacao timestamptz,
         tespaco_id smallint,
         tespaco_designacao character varying,
          stock_total bigint,
           stock_artigos jsonb)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função lista todos os espacos registrado no sistema
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin

  _const := map.constant();
  return query
    select
        esp.espaco_id,
        esp.espaco_nome,
        esp.espaco_descricao,
        esp.espaco_estado,
        esp.espaco_dataregistro,
        esp.espaco_dataatualizacao,
        tesp.tespaco_id,
        tesp.tespaco_designacao,
        count( art.artigo_id ) filter ( where art.artigo_id is not null  ),
        jsonb_agg( lib.jsonb_values(
          to_jsonb( art ) || to_jsonb( st ),
          'artigo_id',
          'artigo_nome',
          'stock_id',
          'stock_quantidade',
          'stock_estado'
        ) order by
            case
              when st.stock_estado = _const.stock_estado_ativo then 1
              else 2
            end,
            case
              when st.stock_quantidade > 0 then 1
              else 2
            end,
            art.artigo_nome
      ) filter ( where art.artigo_id is not null )
      from tweeks.espaco esp
        inner join tweeks.tespaco tesp on esp.espaco_tespaco_id = tesp.tespaco_id
        left join tweeks.stock st on esp.espaco_id = st.stock_espacao_id
          and st.stock_quantidade > 0 and st.stock_estado = _const.stock_estado_ativo
        left join tweeks.artigo art on st.stock_artigo_id = art.artigo_id
          and art.artigo_estado = _const.artigo_estado_ativo
      where esp.espaco_espaco_id = any( arg_espaco_child )
        or esp.espaco_id = arg_espaco_auth
      group by esp.espaco_id,
        tesp.tespaco_id
      order by
        tesp.tespaco_id asc,
        esp.espaco_nivel asc,
        case
          when esp.espaco_estado = _const.espaco_estado_ativo then 1
          else 2
        end,
        esp.espaco_nome
  ;
end;
$$;


--
-- TOC entry 592 (class 1255 OID 23229)
-- Name: funct_load_espaco_configuracao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_espaco_configuracao(filter jsonb) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
declare
  /**
    Essa função serve para devolver o espaço onde deve ser processado a fatura
    arg_espaco_auth := ID
   */
  arg_espaco_id uuid not null default filter->>'arg_espaco_auth';
  _espaco tweeks.espaco;
begin

  with recursive parent as (
      select e.* from tweeks.espaco e where e.espaco_id = arg_espaco_id
    union all
      select e.*
        from parent p
          inner join tweeks.espaco e on p.espaco_espaco_id = e.espaco_id
        where not p.espaco_configurar
  ) select l.* into _espaco
  from parent l
    where l.espaco_configurar
  ;

  _espaco.espaco_configurar := arg_espaco_id = _espaco.espaco_id and _espaco.espaco_configurar;

  return jsonb_build_object(
    'espaco', lib.jsonb_values( _espaco, 'espaco_configurar', 'espaco_configuracao', 'espaco_id', 'espaco_nome' )
  );
end;
$$;


--
-- TOC entry 593 (class 1255 OID 23230)
-- Name: funct_load_espaco_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_espaco_simple(filter jsonb)
 RETURNS TABLE(
     espaco_id uuid,
     espaco_nome character varying,
      tespacao_id smallint)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função lista os espacos ativos
    filter := {
      arg_espaco_auth: ID
      arg_tespaco_id: [
        @+id/tespco_id,
        @+id/tespco_id,
        @+id/tespco_id
      ]
    }
  */
  arg_arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_arg_espaco_auth );

  arg_tespaco_id int2[] not null default array( select ele.text::int2 from jsonb_array_elements_text( filter->'arg_tespaco_id' ) ele( text ) );
  _const map.constant;
begin

  if filter->'arg_tespaco_id' is null then
    arg_tespaco_id := array( select tespaco_id from tweeks.tespaco );
  end if;

  _const := map.constant();
  return query
    select
      esp.espaco_id,
      esp.espaco_nome,
      esp.espaco_tespaco_id
    from tweeks.espaco esp
    where esp.espaco_estado = _const.espaco_estado_ativo
      and esp.espaco_tespaco_id = any( arg_tespaco_id )
      and ( esp.espaco_espaco_id = any( arg_arg_espaco_child ) or esp.espaco_id = arg_arg_espaco_auth )
    order by esp.espaco_nome
  ;
end;
$$;


--
-- TOC entry 594 (class 1255 OID 23231)
-- Name: funct_load_fornecedor(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_fornecedor(filter jsonb)
RETURNS TABLE(
    fornecedor_id uuid,
 fornecedor_nif character varying,
  fornecedor_nome character varying,
   fornecedor_email character varying,
    fornecedor_contacto character varying,
     fornecedor_endereco character varying,
      fornecedor_estado smallint,
       fornecedor_dataregistro timestamptz,
        fornecedor_dataatualizacao timestamptz,
         fornecedor_entragas bigint,
          fornecedor_faturas bigint,
           fornecddor_montantetotal double precision,
            fornecedor_ultimaentrega date)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para listar os fornecedores da base de dados
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        fo.fornecedor_id,
        fo.fornecedor_nif,
        fo.fornecedor_nome,
        fo.fornecedor_email,
        fo.fornecedor_contacto,
        fo.fornecedor_endereco,
        fo.fornecedor_estado,
        fo.fornecedor_dataregistro,
        fo.fornecedor_dataatualizacao,
        count( ent.entrada_id ) fornecedor_entragas,
        count( distinct ent.entrada_codigofatura ) fornecedor_faturas,
        sum( ent.entrada_montante ) fornecedor_faturas,
        max( ent.entrada_data ) as fornecedor_ultimaentrega
      from tweeks.fornecedor fo
        left join tweeks.entrada ent on fo.fornecedor_id = ent.entrada_fornecedor_id
          and ent.entrada_estado = _const.entrada_estado_ativo
      where fo.fornecedor_espaco_auth = any( arg_espaco_child )
      group by fo.fornecedor_id
      order by fo.fornecedor_nome asc
  ;
end;
$$;


--
-- TOC entry 595 (class 1255 OID 23232)
-- Name: funct_load_fornecedor_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_fornecedor_simple(filter jsonb DEFAULT NULL::jsonb)
RETURNS TABLE(fornecedor_id uuid, fornecedor_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para listar todos os fornecedores ativaos (lista para as selects do form)
    filter := {
      arg_espaco_auth: ID
    }
    */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[]not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        fo.fornecedor_id,
        fo.fornecedor_nome
      from tweeks.fornecedor fo
      where fo.fornecedor_estado = _const.fornecedor_estado_ativo
        and fo.fornecedor_espaco_auth = any( arg_espaco_child )
      order by fo.fornecedor_nome
  ;
end;
$$;


--
-- TOC entry 597 (class 1255 OID 23233)
-- Name: funct_load_item_for_artigo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_item_for_artigo(filter jsonb) RETURNS TABLE(
    item_id uuid,
     item_nome character varying,
      item_custo double precision,
       item_quantidadecusto double precision,
        item_descricao character varying,
         item_dispoeartigo boolean,
          classe_id uuid,
           classe_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para listar todos os item ativo de uma forma simples
    filter := {
      arg_artigo_id: ID
      arg_espaco_auth: ID
    }
  */
  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[ ] default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin

  _const := map.constant();

  return query
    select
      itt.artigo_id,
      itt.artigo_nome,
      itt.artigo_custo,
      itt.artigo_quantidadecusto,
      itt.artigo_descricao,
      disp.dispoe_id is not null,
      cla.classe_id,
      cla.classe_nome
    from tweeks.artigo itt
      inner join tweeks.classe cla on itt.artigo_classe_id = cla.classe_id
      left join tweeks.dispoe disp on itt.artigo_id = disp.dispoe_artigo_item
        and disp.dispoe_estado = _const.dispoe_estado_ativo
        and disp.dispoe_artigo_id = arg_artigo_id
    where itt.artigo_estado = _const.artigo_estado_ativo
      and itt.artigo_classe_id = _const.classe_itemextra
      -- and ( itt.artigo_espaco_auth = any( arg_espaco_child ) or disp.dispoe_artigo_id = arg_artigo_id )
    order by
      case
        when cla.classe_id = _const.classe_itemextra then 1
        else 2
      end asc,
    itt.artigo_nome asc
  ;
end;
$$;


--
-- TOC entry 598 (class 1255 OID 23234)
-- Name: funct_load_items_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_items_simple(filter jsonb DEFAULT NULL::jsonb)
 RETURNS TABLE(
     artigo_id uuid,
      artigo_nome character varying,
       artigo_descricao character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /** Devolver uma lista simples de items
    arg_espaco_auth: ID
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin
  _const := map.constant();
  return query
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_descricao
      from tweeks.artigo art
      where art.artigo_estado = _const.artigo_estado_ativo
        and art.artigo_classe_id = _const.classe_itemextra
        and art.artigo_espaco_auth = any( arg_espaco_child )
  ;
end;
$$;


--
-- TOC entry 599 (class 1255 OID 23235)
-- Name: funct_load_mesa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_mesa(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
  declare
    /** Essa função serve para deveolver todas as mesas registradas na base de dados*/
  begin
    return query
      select lib.jsonb_values( m,
          'mesa_id',
          'mesa_numero',
          'mesa_designacao',
          'mesa_lotacao',
          'mesa_estado',
          'mesa_dataregistro',
          'mesa_dataatualizacao'
        )
        from tweeks.mesa m
        order by m.mesa_numero asc;
  end;
$$;


--
-- TOC entry 600 (class 1255 OID 23236)
-- Name: funct_load_mesa_livre(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_mesa_livre(filter jsonb DEFAULT NULL::jsonb)
RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver as mesas disponiveis
  */
  _const map.constant;
begin
  _const := map.constant();

  return query
    select lib.jsonb_values( m,
        'mesa_id',
        'mesa_numero',
        'mesa_designacao',
        'mesa_lotacao',
        'mesa_estado',
        'mesa_dataregistro'
      )
      from tweeks.mesa m
      where m.mesa_estado = _const.mesa_estado_disponivel
    ;
end;
$$;


--
-- TOC entry 601 (class 1255 OID 23237)
-- Name: funct_load_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_posto(filter jsonb DEFAULT NULL::jsonb)
 RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver os postos
    filter := {
      arg_espaco_auth: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    with postos as (
      select pos.*, esp.*, tpos.*
        from tweeks.posto pos
          inner join tweeks.espaco esp on pos.posto_espaco_destino = esp.espaco_id
          inner join tweeks.tposto tpos on pos.posto_tposto_id = tpos.tposto_id
        where esp.espaco_estado = _const.espaco_estado_ativo
          and pos.posto_espaco_auth = any( arg_espaco_child )
        order by
          case
            when pos.posto_estado = _const.posto_estado_aberto then 1
            when pos.posto_estado = _const.posto_estado_fechado then 2
            when pos.posto_estado = _const.posto_estado_encerado then 3
          end,
          pos.posto_designacao asc
    ) select
        lib.jsonb_values( ps,
          'posto_id', 'posto_designacao', 'posto_montante', 'posto_estado', 'posto_endereco', 'posto_multipleuser',
          'espaco_id', 'espaco_nome', 'espaco_descricao',
          'tposto_id', 'tposto_designacao'
        )
      from postos ps
  ;
end;
$$;


--
-- TOC entry 602 (class 1255 OID 23238)
-- Name: funct_load_posto_by_endereco(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_posto_by_endereco(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver um posto a partir do seu endereço IP
    filter := {
      arg_posto_endereco: IP
    }
  */
  arg_posto_endereco character varying not null default filter->>'arg_posto_endereco';
  _const map.constant;
begin
  _const := map.constant();

    return query
      with aux as (
        select
          post.*,
          tp.*,
          esp.*,
          cx.*
        from tweeks.posto post
          inner join tweeks.tposto tp on post.posto_tposto_id = tp.tposto_id
          inner join tweeks.espaco esp on post.posto_espaco_destino = esp.espaco_id
          left join tweeks.caixa cx on post.posto_id = cx.caixa_posto_id
            and cx.caixa_estado = _const.caixa_estado_ativo
        where post.posto_endereco = arg_posto_endereco
        limit 1

      ) select
          jsonb_build_object(
            'posto', lib.jsonb_values( a, 'posto_id', 'posto_montante', 'posto_endereco', 'posto_multipleuser', 'posto_estado', 'posto_designacao' ),
            'caixa', lib.jsonb_values( a, 'caixa_id', 'caixa_montanteinicial', 'caixa_montanteinicialposto' ),
            'espaco', lib.jsonb_values( a, 'espaco_id', 'espaco_nome' ),
            'tposto', lib.jsonb_values( a, 'tposto_id', 'tposto_designacao' )
          )
        from aux a;
end;
$$;


--
-- TOC entry 590 (class 1255 OID 23239)
-- Name: funct_load_posto_closed(); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_load_posto_closed()
RETURNS TABLE(posto_id uuid,
 posto_designacao character varying,
  espaco_id uuid,
   espaco_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  _const map.constant;
begin
  _const := map.constant();

  return query
    select
        pos.posto_id,
        pos.posto_designacao,
        esp.espaco_id,
        esp.espaco_nome
      from tweeks.posto pos
        inner join tweeks.espaco esp on pos.posto_espaco_destino = esp.espaco_id
      where pos.posto_estado != _const.posto_estado_encerado
        and esp.espaco_estado = _const.espaco_estado_ativo
  ;
end;
$$;


--
-- TOC entry 596 (class 1255 OID 23240)
-- Name: funct_load_posto_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_posto_simple(filter jsonb DEFAULT NULL::jsonb)
RETURNS TABLE(posto_id uuid, posto_designacao character varying)
    LANGUAGE plpgsql
    AS $$
declare

  /** Carregar a lista de posto simples
    filter := {
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;

begin
  _const := map.constant();

  return query
    select
        pt.posto_id,
        pt.posto_designacao
      from tweeks.posto pt
      where pt.posto_estado != _const.posto_estado_encerado
        and pt.posto_espaco_auth = any( arg_espaco_child )
      order by pt.posto_designacao asc
  ;
end;
$$;


--
-- TOC entry 603 (class 1255 OID 23241)
-- Name: funct_load_posto_status(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_posto_status(filters jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver o status atual do posto
    filter := {
      arg_posto_id: ID,
      arg_espaco_auth: ID
    }
  */
  arg_espaco_auth uuid not null default filters->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  arg_posto_id uuid not null default filters->>'arg_posto_id';
  _data record;
  _const map.constant;
begin

  _const := map.constant();

  with posto_cheques as (
    select
        cx.caixa_posto_id,
        count( ct.conta_id ) filter( where ct.conta_tpaga_id = _const.tpaga_cheque ) as conta_cheque
      from tweeks.conta ct
        inner join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id
      where ct.conta_espaco_auth = any ( arg_espaco_child )
        and ct.conta_estado = _const.conta_estado_pago
        and cx.caixa_posto_id = arg_posto_id
      group by cx.caixa_posto_id

  ), conta_moedas as (
    select
        cx.caixa_posto_id,
        cu.*,
        sum( ct.conta_montantemoeda ) as conta_montantemoeda
      from tweeks.conta ct
        inner join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id
        inner join geoinfo.currency cu on ct.conta_currency_id = cu.currency_id
      where ct.conta_espaco_auth = any ( arg_espaco_child )
        and ct.conta_estado = _const.conta_estado_pago
        and cx.caixa_posto_id = arg_posto_id
      group by cx.caixa_posto_id,
        cu.currency_id

  ), posto_moeda as (
    select
        ct.caixa_posto_id,
        jsonb_agg (
          lib.jsonb_values( ct, 'currency_id', 'currency_code', 'currency_name' )
        ) as posto_moedas
      from conta_moedas ct
      group by ct.caixa_posto_id
  )
    select * into _data
      from tweeks.posto pos
        inner join tweeks.espaco esp on pos.posto_espaco_destino = esp.espaco_id
        left join posto_moeda pm on pos.posto_id = pm.caixa_posto_id
        left join posto_cheques pc on pos.posto_id = pc.caixa_posto_id
      where pos.posto_id = arg_posto_id
        and pos.posto_espaco_destino = any( arg_espaco_child )
  ;

  return  true ? lib.jsonb_values(
    _data,
    'posto_id',
    'posto_designacao',
    'posto_montante',
    'posto_estado',
    'posto_dataregistro',
    'posto_endereco',
    'espaco_id',
    'espaco_nome',
    'conta_cheque',
    'posto_moedas'
  );

end;
$$;


--
-- TOC entry 604 (class 1255 OID 23242)
-- Name: funct_load_stock(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_stock(filter jsonb) RETURNS TABLE(
    stock_id uuid,
     stock_quantidade double precision,
      stock_estado smallint,
       stock_dataregistro timestamptz,
        stock_dataatualizacao timestamptz,
         artigo_id uuid,
          artigo_nome character varying,
           artigo_codigo character varying,
            artigo_stock double precision,
             espaco_id uuid,
              espaco_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para listar os stock definido no sistema
    filter := {
      arg_artigo_id: ID,
      arg_espaco_auth: ID
    }
   */

  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
begin
  return query
    select
        sto.stock_id,
        sto.stock_quantidade,
        sto.stock_estado,
        sto.stock_dataregistro,
        sto.stock_dataatualizacao,

        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,
        art.artigo_stock,

        esp.espaco_id,
        esp.espaco_nome
      from tweeks._get_stock( arg_artigo_id, arg_espaco_auth ) sto
        inner join tweeks.artigo art on sto.stock_artigo_id = art.artigo_id
        inner join tweeks.espaco esp on sto.stock_espacao_id = esp.espaco_id

      where art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and esp.espaco_id = coalesce( arg_espaco_auth, esp.espaco_id )
      ;
end;
$$;


--
-- TOC entry 605 (class 1255 OID 23243)
-- Name: funct_load_tespaco(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_tespaco(filter jsonb DEFAULT NULL::jsonb)
 RETURNS TABLE(tespaco_id smallint, tespaco_designacao character varying)
    LANGUAGE sql
    AS $$
  -- Essa função lista os tipos de espaco
  select * from tweeks.tespaco t order by t.tespaco_designacao asc
$$;


--
-- TOC entry 606 (class 1255 OID 23244)
-- Name: funct_load_tipoimposto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_tipoimposto(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para carregar os tipos de impostos registrados
    filter := {
      arg_espaco_auth: ID
    }
   */

  arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    with associacao as (
      select
        ls.link_referencia,

        jsonb_agg(
          lib.jsonb_values(
            to_jsonb( esp ),
              'espaco_id',
              'espaco_nome'
          )) as link

      from tweeks.link ls
        inner join tweeks.espaco esp on ls.link_espaco_destino = esp.espaco_id
      where ls.link_tlink_id = _const.tlink_associacao
        and ls.link_estado = _const.link_estado_associacao
        and ( ls.link_espaco_auth = any( arg_espaco_child ) or ls.link_espaco_destino = any( arg_espaco_child ) )
      group by ls.link_referencia
    ), imposto_taxa as (
      select
        tip.*,
        txow.*,
        coalesce( ass.link, jsonb_build_array() ) as link,
        coalesce( tx.taxa_percentagem, (txow::tweeks.taxa).taxa_percentagem ) as taxa_percentagem,
        coalesce( tx.taxa_taxa, (txow::tweeks.taxa).taxa_taxa ) as taxa_taxa,
        arg_espaco_auth = tip.tipoimposto_espaco_auth as tipoimposto_editinfo,
        true as tipoimposto_editespaco,
        true as tipoimposto_edittaxa
      from tweeks.tipoimposto tip
        left join associacao ass on ass.link_referencia @> jsonb_build_object( 'tipoimposto_id', tip.tipoimposto_id )
        left join tweeks.taxa tx on tip.tipoimposto_id = tx.taxa_tipoimposto_id
          and tx.taxa_estado = _const.taxa_estado_ativo
          and tx.taxa_espaco_auth = arg_espaco_auth
        left join rule.taxa_espaco( tx, _const, arg_espaco_auth ) txow on true
          and tx.taxa_estado = _const.taxa_estado_ativo
          and tx.taxa_espaco_auth = tip.tipoimposto_espaco_auth
      where
        ( tip.tipoimposto_espaco_auth = any( arg_espaco_child ) or ass.link_referencia is not null )
      order by
        tip.tipoimposto_nome
    ) select
      lib.jsonb_values(
        it,
        'tipoimposto_id',
        'tipoimposto_nome',
        'tipoimposto_codigo',
        'tipoimposto_dataatuzaliacao',
        'tipoimposto_estado',
        'tipoimposto_dataregistro',
        'link',
        'taxa_percentagem',
        'taxa_taxa',
        'tipoimposto_edittaxa',
        'tipoimposto_editespaco',
        'tipoimposto_editinfo'
      )
      from imposto_taxa it
      ;
end;
$$;


--
-- TOC entry 607 (class 1255 OID 23245)
-- Name: funct_load_tipoimposto_simple(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_tipoimposto_simple(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para devolver a lista de tipo de imposto de forma simples
    filter := {
      arg_espaco_auth: ID
    }
   */
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();

  return query
    select lib.jsonb_values(
      tp,
      'tipoimposto_id',
      'tipoimposto_nome',
      'tipoimposto_codigo'
    )
    from tweeks.tipoimposto tp
      left join tweeks.link lk on lk.link_referencia @> rule.tipoimposto_referencia( tp.tipoimposto_id )
        and lk.link_espaco_destino = arg_espaco_auth
        and lk.link_estado = _const.link_estado_associacao
        and lk.link_tlink_id = _const.tlink_associacao
    where tp.tipoimposto_estado = _const.tipoimposto_estado_ativo
      and tp.tipoimposto_espaco_auth = any( arg_espaco_child )
    group by tp.tipoimposto_id
    having count( lk.link_id ) > 0 or tp.tipoimposto_espaco_auth = arg_espaco_auth
  ;
end;
$$;


--
-- TOC entry 608 (class 1255 OID 23246)
-- Name: funct_load_tpaga(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_tpaga(filter jsonb DEFAULT NULL::jsonb)
 RETURNS TABLE(tpaga_id smallint, tpaga_designacao character varying)
    LANGUAGE sql
    AS $$
  -- Essa função lista os tipos de pagamento
  select * from tweeks.tpaga t order by t.tpaga_designacao asc
$$;


--
-- TOC entry 609 (class 1255 OID 23247)
-- Name: funct_load_trabalha(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_trabalha(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para carragar os espaços onde um colaborador trabalha
    filter := {
      arg_colaborador_id: ID
    }
  */
  arg_colaborador_id  uuid not null default filter->>'arg_colaborador_id';
  _const map.constant;
begin
  _const := map.constant();

  return query
    with aux as (
      select tr.*, esp.*
        from tweeks.trabalha tr
          inner join tweeks.espaco esp on tr.trabalha_espaco_destino = esp.espaco_id
        where tr.trabalha_colaborador_proprietario = arg_colaborador_id
          and tr.trabalha_estado = _const.trabalha_estado_ativo
          and esp.espaco_estado = _const.espaco_estado_ativo
    ) select lib.jsonb_values(
        a,
        'espaco_id',
        'espaco_nome',
        'espaco_descricao',
        'espaco_estado',
        'espaco_dataregistro',
        'espaco_dataatualizacao',
        'espaco_gerarfatura',
        'espaco_codigo',
        'espaco_configurar',
        'trabalha_id',
        'trabalha_estado'
      )
      from aux a
      order by a.trabalha_posicao,
        a.espaco_nivel,
        a.espaco_id
    ;
end;
$$;


--
-- TOC entry 610 (class 1255 OID 23248)
-- Name: funct_load_transferencia(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_load_transferencia(filter jsonb)
RETURNS TABLE(
    transferencia_id uuid,
 transferencia_quantidade double precision,
  transferencia_data date,
   transferencia_documento character varying,
    transferencia_observacao character varying,
     transferencia_estado smallint,
      transferencia_dataregistro timestamptz,
       transferencia_dataatualizacao timestamptz,
        artigo_id uuid,
         artigo_nome character varying,
          artigo_codigo character varying,
           origem_espaco_id uuid,
            origem_espaco_nome character varying,
             destino_espaco_id uuid,
             destino_espaco_nome character varying)
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para listar as transferencias dos artigos
    filter := {
      arg_artigo_id: ID,
      arg_espaco_origem: ID,
      arg_espaco_destino: ID,
      arg_espaco_auth: ID,
    }
  */

  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  arg_espaco_origem uuid default filter->>'arg_espaco_origem';
  arg_espaco_destino uuid default filter->>'arg_espaco_destino';

  _const map.constant;

begin
  _const := map.constant();

  return query
    select
        trans.transferencia_id,
        trans.transferencia_quantidade,
        trans.transferencia_data,
        trans.transferencia_documento,
        trans.transferencia_observacao,
        trans.transferencia_estado,
        trans.transferencia_dataregistro,
        trans.transferencia_dataatualizacao,

        art.artigo_id,
        art.artigo_nome,
        art.artigo_codigo,

        esporg.espaco_id,
        esporg.espaco_nome,

        espdest.espaco_id,
        espdest.espaco_nome
      from tweeks.transferencia trans
        inner join tweeks.stock origen on trans.transferencia_stock_origem = origen.stock_id
        inner join tweeks.stock dest on trans.transferencia_stock_destino = dest.stock_id
        inner join tweeks.artigo art on origen.stock_artigo_id = art.artigo_id
        inner join tweeks.espaco esporg on origen.stock_espacao_id = esporg.espaco_id
        inner join tweeks.espaco espdest on dest.stock_espacao_id = espdest.espaco_id
      where art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and esporg.espaco_id = coalesce( arg_espaco_origem, esporg.espaco_id )
        and espdest.espaco_id = coalesce( arg_espaco_destino, espdest.espaco_id )
        and trans.transferencia_espaco_auth = any( arg_espaco_child )
  ;
end;
$$;


--
-- TOC entry 611 (class 1255 OID 23249)
-- Name: funct_reg_acerto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_acerto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare

  /**
    Essa função serve para efetuar o acerto do stock
    args = {
      arg_espaco_auth: ID
      arg_colaborador_id := ID,
      arg_artigo_id: ID,
      arg_espaco_id: ID,
      arg_acerto_quantidade: QUANT,
      arg_acerto_observacao: OBS
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_id uuid not null default args->>'arg_espaco_id';
  arg_acerto_quantidade int not null default args->>'arg_acerto_quantidade';
  arg_acerto_observacao varchar default args->>'arg_acerto_observacao';

  arg_acerto_diferenca double precision;

  _const map.constant;
  _stock tweeks.stock;
  _acerto tweeks.acerto;

begin
  _const := map.constant();

  _stock := tweeks._get_stock( arg_artigo_id, arg_espaco_id );

  arg_acerto_diferenca := _stock.stock_quantidade - arg_acerto_quantidade;

  insert into tweeks.acerto (
    acerto_stock_id,
    acerto_colaborador_id,
    acerto_quantidade,
    acerto_quantidadeinicial,
    acerto_diferenca,
    acerto_observacao,
    acerto_espaco_auth
  ) values (
    _stock.stock_id,
    arg_colaborador_id,
    arg_acerto_quantidade,
    _stock.stock_quantidade,
    arg_acerto_diferenca,
    arg_acerto_observacao,
    arg_espaco_auth
  ) returning * into _acerto;


  _stock := tweeks._get_stock( arg_artigo_id, arg_espaco_id );

  return  true ? jsonb_build_object(
    'acerto', _acerto,
    'stock', _stock,
    'artigo', tweeks._get_artigo( _stock.stock_artigo_id )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 612 (class 1255 OID 23250)
-- Name: funct_reg_amortizacao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_amortizacao(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para registar uma nova amortizacao
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_posto_id: ID,
      arg_tpaga_id: ID,
      arg_currency_id: ID,
      arg_amortizacao_referencia: {conta_id: id},
      arg_amortizacao_montantemoeda: MONTANTE,
      arg_amortizacao_data: DATA,
      arg_amortizacao_documento: DOCUMENTO,
    }
  */
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_caixa_id uuid not null default args->>'arg_caixa_id';
  arg_tpaga_id int2 not null default args->>'arg_tpaga_id';
  arg_currency_id uuid not null default args->>'arg_currency_id';
  arg_amortizacao_referencia jsonb not null default args->>'arg_amortizacao_referencia';
  arg_amortizacao_montantemoeda double precision not null default args->>'arg_amortizacao_montantemoeda';
  arg_amortizacao_montante double precision;
  arg_amortizacao_data date not null default args->>'arg_amortizacao_data';
  arg_amortizacao_documento varchar not null default args->>'arg_amortizacao_documento';

  arg_conta_id uuid default arg_amortizacao_referencia->>'conta_id';
  arg_amortizacao_montantetroco float not null default 0;

  _amortizacao tweeks.amortizacao;
  _posto tweeks.posto;
  _const map.constant;
  _conta tweeks.conta;
  _cambio record;

  arg_montantepagofinal double precision;

begin

  _const := map.constant();
  _posto := tweeks._get_posto( arg_caixa_id );

  if _posto.posto_estado != _const.posto_estado_aberto then
    return false ? '@amortizacao.posto.estado-fechado';
  end if;

  _conta := tweeks._get_conta( arg_conta_id );


  select * into _cambio from tweeks.funct_load_cambio_dia( jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_currency_id', arg_currency_id,
      'arg_cambio_data', arg_amortizacao_data
    )) tx;

  if _cambio.cambio_id is null then
    return false ? '@tweeks.conta.cambio-not-found';
  end if;

  arg_amortizacao_montante := arg_amortizacao_montantemoeda * _cambio.cambio_taxa;

  if _conta.conta_id is not null then

    -- Quando a conta já estiver sido pago
    if _conta.conta_estado = _const.conta_estado_pago then
      return false ? '@tweeks.conta.estado.not-accept-payment';
    end if;

    if _conta.conta_currency_id != arg_currency_id then
      return false ? '@tweeks.conta.currency-of-register-not-equal-payment';
    end if;

    --     -- Se for para amortizar uma conta por completo então obter o valor pendete ao pagamento
    --     if arg_amortizacao_completo then
    --       arg_amortizacao_montante := _conta.conta_montante - _conta.conta_montanteamortizado;
    --     end if;

    arg_montantepagofinal := _conta.conta_montanteamortizado + arg_amortizacao_montante;

    if _conta.conta_montanteamortizado + arg_amortizacao_montante >= _conta.conta_montante then
      arg_amortizacao_montantetroco := _conta.conta_montanteamortizado + arg_amortizacao_montante - _conta.conta_montante;
      arg_amortizacao_montante := _conta.conta_montante - _conta.conta_montanteamortizado;
    end if;

  end if;

  -- Quando o valor do monte negativo converter o montante em troco
  if arg_amortizacao_montante < 0 then
    arg_amortizacao_montantetroco := arg_amortizacao_montantetroco + abs( arg_amortizacao_montante );
    arg_amortizacao_montante := 0;
  end if;

  insert into tweeks.amortizacao (
    amortizacao_caixa_id,
    amortizacao_tpaga_id,
    amortizacao_currency_id,
    amortizacao_colaborador_id,
    amortizacao_referencia,
    amortizacao_montante,
    amortizacao_montantemoeda,
    amortizacao_montantetroco,
    amortizacao_taxacambio,
    amortizacao_data,
    amortizacao_documento,
    amortizacao_espaco_auth
  ) values (
    arg_caixa_id,
    arg_tpaga_id,
    arg_currency_id,
    arg_colaborador_id,
    arg_amortizacao_referencia,
    arg_amortizacao_montante,
    arg_amortizacao_montantemoeda,
    arg_amortizacao_montantetroco,
    _cambio.cambio_taxa,
    arg_amortizacao_data,
    arg_amortizacao_documento,
    arg_espaco_auth
  ) returning * into _amortizacao;

  return true ? jsonb_build_object( 'amortizacao', _amortizacao );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 615 (class 1255 OID 23251)
-- Name: funct_reg_artigo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_artigo(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$

declare

    /**
      Essa funçao serve para registar os artigos associado aos seus item extras
      {
        arg_artoigo_id: ID
        arg_colaborador_id: ID,
        arg_espaco_auth: ID
        arg_classe_id: ID,
        arg_artigo_codigo: CODIGO,
        arg_artigo_nome: NOME,
        arg_artigo_custo: CUSTO,
        arg_artigo_quantidadecusto: QUANTIDADE | 1,
        arg_atrigo_preparacao: TRUE|FALSE,
        arg_artigo_foto: FOTO,
        arg_artigo_descricao: DESCRICAO,
        arg_artigo_stocknegativo: TRUE|FALSE,

        arg_items: [
          @id/item_id,
          @id/item_id,
          @id/item_id
        ],

        arg_links: [
          { arg_espaco_id: ID  }
        ],

        arg_imposto: [
          {
            arg_tipoimposto_id: ID,
            arg_taplicar_id: ID,
            arg_imposto_valor: VALOR, # Por equanto envie null
            arg_imposto_percentagem: PERCENTAGEM, # Por enquanto envie null
          }
        ]
      }
     */

    arg_artoigo_id uuid not null default args->'arg_artoigo_id';
    arg_artigo_compostoquantidade double precision not null default args->'arg_artigo_compostoquantidade';
    arg_colaborador_id uuid not null default args->'arg_colaborador_id';
    arg_classe_id uuid not null default args->>'arg_classe_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

    arg_artigo_codigo varchar not null  default lib.str_normalize( args->>'arg_artigo_codigo' );
    arg_artigo_nome varchar not null  default lib.str_normalize( args->>'arg_artigo_nome' );
    arg_artigo_custo double precision not null default args->>'arg_artigo_custo';
    arg_artigo_quantidadecusto double precision not null default args->>'arg_artigo_quantidadecusto';
    arg_artigo_preparacao boolean not null default args->>'arg_atrigo_preparacao';
    arg_artigo_stocknegativo boolean not null default args->>'arg_artigo_stocknegativo';
    arg_artigo_stockminimo double precision default args->>'arg_artigo_stockminimo';
    arg_artigo_foto varchar default args->>'arg_artigo_foto';
    arg_artigo_descricao character varying default lib.str_normalize( args->>'arg_artigo_descricao' );

    _artigo tweeks.artigo;
    _const map.constant;
    _res_precario lib.result;
    _res_link_associacao lib.result;
    _result lib.result;
begin

    _const := map.constant();

    if arg_classe_id = _const.classe_itemextra then
        return false ? '@tweeks.artigo.can-not-reg-in-item-extra';
    end if;

    if (
        select count( * ) > 0
        from tweeks.artigo art
        where lib.str_normalize( public.unaccent( lower ( art.artigo_nome ) ) ) = lib.str_normalize( public.unaccent( lower ( arg_artigo_nome ) ) )
          and art.artigo_espaco_auth = any( arg_espaco_child )
    ) then
        return false ? '@tweeks.artigo.name-already-exist';
    end if;

    if arg_artoigo_id is not null and ( arg_artigo_compostoquantidade is null or arg_artigo_compostoquantidade = 0 ) then
        return false ? 'Para artigos composto, é necessario expecificar a quantidade do itens a compor';
    end if;

    arg_artigo_quantidadecusto := coalesce( arg_artigo_quantidadecusto, 1 );

    -- Garantir que o codigo do artigo não seja duplicado
    if (
        select count( * ) > 0
        from tweeks.artigo art
        where lib.str_normalize( lower( art.artigo_codigo ) ) = lib.str_normalize( lower( arg_artigo_codigo ) )
          and art.artigo_espaco_auth = any( arg_espaco_child )
    ) then
        return false ? '@tweeks.artigo.codigo-already-exist';
    end if;

    -- Obter o codigo para o proximo produto
    arg_artigo_codigo := rule.artigo_generate_nextcodigo( arg_classe_id );

    insert into tweeks.artigo (
        artigo_artigo_id,
        artigo_classe_id,
        artigo_colaborador_id,
        artigo_codigo,
        artigo_nome,
        artigo_custo,
        artigo_quantidadecusto,
        artigo_preparacao,
        artigo_foto,
        artigo_stocknegativo,
        artigo_stockminimo,
        artigo_descricao,
        artigo_espaco_auth
    ) values (
         arg_artoigo_id,
         arg_classe_id,
         arg_colaborador_id,
         arg_artigo_codigo,
         arg_artigo_nome,
         arg_artigo_custo,
         arg_artigo_quantidadecusto,
         arg_artigo_preparacao,
         arg_artigo_foto,
         arg_artigo_stocknegativo,
         arg_artigo_stockminimo,
         arg_artigo_descricao,
         arg_espaco_auth
     ) returning * into _artigo;

    _result := tweeks.funct_reg_dispoe(
            jsonb_build_object(
                    'arg_atrigo_id', _artigo.artigo_id,
                    'arg_espaco_auth', arg_espaco_auth,
                    'arg_colaborador_id', arg_colaborador_id,
                    'arg_items', args->'arg_items'
                )
        );

    _res_precario := tweeks.funct_reg_precario(
            jsonb_build_object(
                    'arg_colaborador_id', arg_colaborador_id,
                    'arg_espaco_auth', arg_espaco_auth,
                    'arg_precario_referencia', jsonb_build_object( 'artigo_id', _artigo.artigo_id ),
                    'arg_precario_custo', _artigo.artigo_custo,
                    'arg_precario_quantidade', _artigo.artigo_quantidadecusto
                )
        );

    _res_link_associacao := tweeks.funct_reg_link_associacao(
    jsonb_build_object(
            'arg_espaco_auth', arg_espaco_auth,
            'arg_colaborador_id', arg_colaborador_id,
            'arg_link_nome', _artigo.artigo_nome,
            'arg_link_referencia', jsonb_build_object( 'artigo_id', _artigo.artigo_id ),
            'arg_links', args->'arg_links'
        )
    );

    perform tweeks.funct_reg_imposto(
    jsonb_build_object(
            'arg_artigo_id', _artigo.artigo_id,
            'arg_colaborador_id', arg_colaborador_id,
            'arg_espaco_auth', arg_espaco_auth,
            'arg_imposto', args->'arg_imposto'
        )
    );

    _result.message := _result.message || _res_precario.message || _res_link_associacao.message || jsonb_build_object(
        'artigo', _artigo
    );

    return _result;

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end;
$$;


--
-- TOC entry 613 (class 1255 OID 23253)
-- Name: funct_reg_caixa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_caixa(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para registar uma nova caixa
    args := {
      arg_espaco_auth: ID
      arg_posto_id: ID,
      arg_colaborador_id: ID,
      arg_caixa_montanteinicial: MONTANTE,
    }
  */

  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_caixa_montanteinicial double precision not null default args->>'arg_caixa_montanteinicial';

  _posto tweeks.posto;
  _caixa tweeks.caixa;
  _const map.constant;

begin

  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );

  if _posto.posto_estado != _const.posto_estado_fechado then
    return false ? '@posto.estado.no-closed';
  end if;

/*
  -- Para o caso da diferenças em lmilezimas
  if abs( _posto.posto_montante - arg_caixa_montanteinicial ) between 0 and 0.01 then
    arg_caixa_montanteinicial := _posto.posto_montante;
  end if;

  if arg_caixa_montanteinicial != _posto.posto_montante then
    return false ? '@posto.montante-open.not-coincide';
  end if;
*/

  insert into tweeks.caixa (
    caixa_posto_id,
    caixa_colaborador_id,
    caixa_montanteinicial,
    caixa_montanteinicialposto,
    caixa_espaco_auth
  ) values (
    arg_posto_id,
    arg_colaborador_id,
    arg_caixa_montanteinicial,
    _posto.posto_montante,
    arg_espaco_auth
  ) returning * into _caixa;

  return true ? '@posto.open.success' || jsonb_build_object(
    'posto', _posto,
    'espaco', tweeks._get_espaco( _posto.posto_espaco_destino ),
    'caixa', _caixa
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 614 (class 1255 OID 23254)
-- Name: funct_reg_cambio(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_cambio(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar o valor cambio
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_currency_id
      arg_cambio_valor: VALOR,
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


--
-- TOC entry 651 (class 1255 OID 36879)
-- Name: funct_reg_ccorrente(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_ccorrente(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare

    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_colaborador_manager uuid not null default args->>'arg_colaborador_manager';
    arg_ccorrente_titular character varying not null default args->>'arg_ccorrente_titular';
    arg_ccorrente_nif character varying not null default args->>'arg_ccorrente_nif';
    arg_tdocument_id int2 not null default args->>'arg_tdocument_id';
    arg_ccorrente_document character varying not null default args->>'arg_ccorrente_document';

    _ccorrente tweeks.ccorrente;
begin

    if ( select count( * ) from tweeks.ccorrente c
        where c.ccorrente_nif = arg_ccorrente_nif ) then
        return false ? 'Já existe um cliente com esse NIF!';
    end if;

    if ( select count( * ) from tweeks.ccorrente c
        where c.ccorrente_document = arg_ccorrente_nif
                and  c.ccorrente_tdocument_id = arg_tdocument_id
    ) then
        return false ? 'Já existe um cliente com essa documenteação!';
    end if;

    insert into tweeks.ccorrente (
        ccorrente_colaborador_id,
        ccorrente_colaborador_manage,
        ccorrente_espaco_auth,
        ccorrente_tdocument_id,
        ccorrente_titular,
        ccorrente_nif,
        ccorrente_document
    ) values (
        arg_colaborador_id,
        arg_colaborador_manager,
        arg_espaco_auth,
        arg_tdocument_id,
        arg_ccorrente_titular,
        arg_ccorrente_document
    ) returning * into _ccorrente;

    return true ? jsonb_build_object(
        'ccorrente', _ccorrente
    );
end;
$$;


--
-- TOC entry 616 (class 1255 OID 23255)
-- Name: funct_reg_classe(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_classe(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função cria uma nova classe
    args {
      arg_classe_id: ID
      arg_espaco_auth: ID
      arg_colaborador_id: ID
      arg_classe_nome: NOME
      arg_classe_foto: FOTO
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_classe_nome character varying not null default lib.str_normalize( args->>'arg_classe_nome' );
  arg_classe_foto varchar default lib.str_normalize( args->>'arg_classe_foto' );
  arg_classe_id uuid default args->>'arg_classe_id';

  arg_espaco_child uuid[ ];

  _const map.constant;
  _classe tweeks.classe;
  _link tweeks.link;

begin

  _const := map.constant();
  arg_espaco_child := rule.espaco_get_childrens( arg_espaco_auth );

  -- Verificar se existe a instancia da classe
  select * into _classe
    from tweeks.classe cla
    where public.unaccent( lower( lib.str_normalize( cla.classe_nome ) ) ) = public.unaccent( lower( lib.str_normalize( arg_classe_nome ) ))
  ;

  if _classe.classe_id = _const.classe_itemextra then
    return false ? 'Esse nome de categoria esta reservado!';
  end if;

  select * into _link
    from tweeks.link l
    where l.link_referencia @> jsonb_build_object( 'classe_id', _classe.classe_id )
      and l.link_espaco_auth = any( arg_espaco_child )
      and l.link_tlink_id = _const.tlink_associacao
  ;

  if _classe.classe_id is not null
    and _classe.classe_espaco_auth != all( rule.espaco_get_childrens( arg_espaco_auth ) )
    and ( _link.link_id is null )
  then
    insert into tweeks.link(
      link_tlink_id,
      link_referencia,
      link_espaco_auth,
      link_espaco_destino,
      link_colaborador_id,
      link_posicao,
      link_nome,
      link_estado
    ) values (
      _const.tlink_associacao,
      jsonb_build_object( 'classe_id', _classe.classe_id ),
      arg_espaco_auth,
      arg_espaco_auth,
      arg_colaborador_id,
      -1,
      arg_classe_nome,
      _const.link_estado_associacao
    );

  elseif _classe.classe_id is not null
    and _classe.classe_espaco_auth != all( rule.espaco_get_childrens( arg_espaco_auth ) )
    and ( _link.link_id is not null )
  then
    update tweeks.link
      set link_estado = _const.link_estado_associacao,
          link_dataatualizacao = current_timestamp,
          link_colaborador_atualizacao =arg_colaborador_id,
          link_nome = arg_classe_nome
      where link_id = _link.link_id
    ;

  elseif _classe.classe_id is not null
    and _classe.classe_espaco_auth = all( rule.espaco_get_childrens( arg_espaco_auth ) )
  then
    update tweeks.classe
      set classe_nome = arg_classe_nome,
          classe_colaborador_atualizacao = arg_colaborador_id,
          classe_dataatualizacao = current_timestamp,
          classe_estado = _const.classe_estado_ativo
      where classe_id = _classe.classe_id
    ;
  elseif _classe.classe_id is null then

    insert into tweeks.classe (
      classe_classe_id,
      classe_colaborador_id,
      classe_nome,
      classe_codigo,
      classe_espaco_auth,
      classe_foto
    ) values (
      arg_classe_id,
      arg_colaborador_id,
      arg_classe_nome,
      rule.classe_generate_nextcodigo(),
      arg_espaco_auth,
      arg_classe_foto
    ) returning * into _classe;

    insert into tweeks.link (
      link_tlink_id,
      link_referencia,
      link_espaco_auth,
      link_espaco_destino,
      link_colaborador_id,
      link_posicao,
      link_nome,
      link_estado
    ) values (
      _const.tlink_associacao,
      jsonb_build_object( 'classe_id', _classe.classe_id ),
      arg_espaco_auth,
      arg_espaco_auth,
      arg_colaborador_id,
      -1,
      _classe.classe_nome,
      _const.link_estado_associacao
    ) returning * into _link;
  end if;

  return true ? jsonb_build_object(
    'classe', _classe,
    'link', _link
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 617 (class 1255 OID 23256)
-- Name: funct_reg_colaborador(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_colaborador(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
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
    }

   */
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


  _const map.constant := map.constant();
  _colaborador auth.colaborador;
  _res lib.result;

begin

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
    colaborador_espaco_auth
  ) values (
    arg_colaborador_id,
    arg_colaborador_email,
    arg_colaborador_nome,
    arg_colaborador_apelido,
    arg_colaborador_nif,
    arg_colaborador_datanascimento,
    arg_colaborador_foto,
    arg_tsexo_id,
    arg_espaco_auth
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


--
-- TOC entry 618 (class 1255 OID 23257)
-- Name: funct_reg_conta(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_conta(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função registra um nova conta
    arg = {

      -- obrigatorios
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_posto_id: ID,
      arg_mesa_numero: NUMERO,

      -- opcional
      arg_reserva_id: ID,
      arg_currency_id: ID,
      arg_tpaga_id: ID,
      arg_conta_titular: NOME-CLIENTE
      arg_conta_data: DATA,

      -- requerido
      arg_vendas: [
        {
          arg_artigo_id:
          arg_venda_quantidade
          arg_venda_custounitario

          arg_agregas: [
            {
              arg_item_id: ID,
              arg_item_quantidadecusto: QUANT/CUSTO
              arg_agrega_quantidade: QUANT,
              arg_item_custo: CUSTO,
              arg_agrega_montante: MONTANTE
            }
          ]
        }
      ]
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_mesa_numero text default args->>'arg_mesa_numero';
  arg_vendas jsonb not null default args->>'arg_vendas';

  arg_reserva_id uuid  default args->>'arg_reserva_id';
  arg_currency_id int2 default args->>'arg_currency_id';
  arg_tpaga_id int2 default args->>'arg_tpaga_id';
  arg_conta_titular varchar default args->>'arg_conta_titular';
  arg_conta_data date default args->>'arg_conta_data';

  _conta tweeks.conta;
  _mesa tweeks.mesa;
  _const map.constant;
  _posto tweeks.posto;
  _res lib.result;
  _series record;
begin

  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );

  if arg_mesa_numero is not null then
    _mesa := tweeks._get_mesa( arg_colaborador_id, arg_espaco_auth, arg_mesa_numero::varchar );
  end if;

  -- Só aceitar registra a mesa em um espaço disponivel
--   _mesa.mesa_estado := coalesce( _mesa.mesa_estado, _const.mesa_estado_disponivel );
--   if _mesa.mesa_estado != _const.mesa_estado_disponivel then
--     return false ? '@tweeks.conta.mesa.estado.not-open';
--   end if;

  _series := rule.conta_generata_series( arg_espaco_auth );

  insert into tweeks.conta(
    conta_reserva_id,
    conta_posto_id,
    conta_currency_id,
    conta_tpaga_id,
    conta_colaborador_id,
    conta_espaco_auth,
    conta_titular,
    conta_data,
    conta_mesa_id,
    conta_numero,
    conta_numerofatura
  ) values (
    arg_reserva_id,
    arg_posto_id,
    arg_currency_id,
    arg_tpaga_id,
    arg_colaborador_id,
    arg_espaco_auth,
    arg_conta_titular,
    arg_conta_data,
    _mesa.mesa_id,
    _series.serial_numero,
    _series.serial_fatura
  ) returning * into _conta;

  _res := tweeks.funct_reg_venda(
    jsonb_build_object(
      'arg_vendas', arg_vendas,
      'arg_message_error', true,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_conta_id', _conta.conta_id
    )
  );

  -- Quando
  if not _res.result then  return _res; end if;

  return true ? _res.message || jsonb_build_object(
          'conta', _conta,
          'venda', (
            with list as (
              select
                  to_jsonb( ve ) || jsonb_build_object(
                    'agrega', jsonb_agg( a )
                  )
              from tweeks.venda ve
                     left join  agrega a on ve.venda_id = a.agrega_venda_id
                and a.agrega_estado = _const.agrega_estado_aberto
              where ve.venda_conta_id = _conta.conta_id
                and ve.venda_estado = _const.venda_estado_aberto
              group by ve.venda_id
            ) select jsonb_agg( to_jsonb( l ) )
            from list l
          )
    );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 619 (class 1255 OID 23258)
-- Name: funct_reg_dispoe(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_dispoe(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para efetuar o registro da disposicao
    args = {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID
      arg_atrigo_id: ID,
      arg_items: [
        @+id/item_id,
        @+id/item_id,
        @+id/item_id
      ]
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  arg_artigo_id uuid not null default args->>'arg_atrigo_id';
  arg_items jsonb not null default args->'arg_items';

  arg_items_id uuid [] default array( select item_id::uuid from jsonb_array_elements_text( arg_items ) doc ( item_id ) );
  ativated_dispoe tweeks.dispoe[];
  desativated_dispoe tweeks.dispoe[];
  _const map.constant;
begin
  _const := map.constant();



  -- Desativar todos os item atualmente associado ao produto que não faz para da nova disposicao
  with desativateds as (
    update tweeks.dispoe
      set dispoe_estado = _const.dispoe_estado_fechado,
          dispoe_dataatualizacao =   current_timestamp,
          dispoe_colaborador_atualizacao = arg_colaborador_id
      where dispoe_artigo_id = arg_artigo_id
        and dispoe_estado = _const.dispoe_estado_ativo
        and dispoe_artigo_item != all( arg_items_id )
        and dispoe_espaco_auth = any( arg_espaco_child )
      returning *
  ) select array_agg( desa ) into desativated_dispoe
    from desativateds  desa
  ;

  -- Registar os novos itens
  with ativated as (
    insert into tweeks.dispoe (
      dispoe_artigo_id,
      dispoe_artigo_item,
      dispoe_colaborador_id,
      dispoe_espaco_auth
    ) select
        arg_artigo_id,
        it.artigo_id,
        arg_colaborador_id,
        arg_espaco_auth
      from tweeks.artigo it
        left join tweeks.dispoe d on it.artigo_id = d.dispoe_artigo_item
          and d.dispoe_estado = _const.dispoe_estado_ativo
          and d.dispoe_artigo_id = arg_artigo_id
      where it.artigo_id = any ( arg_items_id )
      group by it.artigo_id
      having count( d.dispoe_id ) = 0
      returning *
  ) select array_agg( ins ) into ativated_dispoe
    from ativated ins
  ;

  return true? jsonb_build_object(
    'dispoe_desativated', desativated_dispoe,
    'dispoe_ativated',  ativated_dispoe,
    'dispoe', array (
      select disp
        from tweeks.dispoe disp
        where disp.dispoe_artigo_id = arg_artigo_id
          and disp.dispoe_estado = _const.dispoe_estado_ativo
    )
  );
end;
$$;



--
-- TOC entry 621 (class 1255 OID 23259)
-- Name: funct_reg_entrada(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_entrada(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa funcao serve para registar as entradas de produto
    args = {
      arg_colaborador_id: ID,
      arg_artigo_id: ID,
      arg_espaco_destino: ID,
      arg_espaco_auth: ID,
      arg_fornecedor_id: ID,
      arg_entrada_codigofatura: CODIGO,
      arg_entrada_data: DATA,
      arg_entrada_quantidade: QUANT,
      arg_entrada_montante: MONTANTE,
      arg_entrada_descricao: DESCRICAO
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_fornecedor_id uuid not null default args->>'arg_fornecedor_id';
  arg_entrada_codigofatura character varying default args->>'arg_entrada_codigofatura';
  arg_entrada_data date not null default args->>'arg_entrada_data';
  arg_entrada_quantidade double precision not null default args->>'arg_entrada_quantidade';
  arg_entrada_montante double precision not null default args->>'arg_entrada_montante';
  arg_entrada_descricao character varying default args->>'arg_entrada_descricao';

  arg_entrada_next int ;

  _entreda tweeks.entrada;
  _espaco tweeks.espaco;
  _artigo tweeks.artigo;
  _const map.constant;

begin

  _const := map.constant();

  _espaco := tweeks._get_espaco( arg_espaco_destino );
  _artigo := tweeks._get_artigo( arg_artigo_id );

  if _espaco.espaco_estado = _const.espaco_estado_fechado then
    return false? '@entreda.espacao.estado-fechado';
  end if;

  if _artigo.artigo_estado = _const.artigo_estado_fechado then
    return false? '@entreda.artigo.estado-fechado';
  end if;

  arg_entrada_next := nextval( 'tweeks.seq_entrada' );

  if arg_entrada_codigofatura is null then
    arg_entrada_codigofatura := lib.str_nospace( to_char( arg_entrada_next, '"EN#"000-000' ) );
  end if;

  insert into tweeks.entrada (
    entrada_espaco_destino,
    entrada_espaco_auth,
    entrada_fornecedor_id,
    entrada_artigo_id,
    entrada_colaborador_id,
    entrada_codigofatura,
    entrada_data,
    entrada_quantidade,
    entrada_montante,
    entrada_descricao
  ) values (
    arg_espaco_destino,
    arg_espaco_auth,
    arg_fornecedor_id,
    arg_artigo_id,
    arg_colaborador_id,
    arg_entrada_codigofatura,
    arg_entrada_data,
    arg_entrada_quantidade,
    arg_entrada_montante,
    arg_entrada_descricao
  ) returning * into _entreda;

  return true? jsonb_build_object(
    'entreda', _entreda,
    'stock', tweeks._get_stock( arg_artigo_id, arg_espaco_destino ),
    'artigo', tweeks._get_artigo( arg_artigo_id )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 622 (class 1255 OID 23260)
-- Name: funct_reg_espaco(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_espaco(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar os espaços
    args = {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_tespaco_id: ID,
      arg_espaco_nome: NOME,
      arg_espaco_descricao: NOME,
      arg_espaco_gerarfatura: BOOLEAN,
      arg_espaco_configurar: BOOLEAN,
      arg_espaco_codigo: CODIGO,
    }
   */

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_tespaco_id int default args->>'arg_tespaco_id';
  arg_espaco_nome character varying default lib.str_normalize( args->>'arg_espaco_nome' );
  arg_espaco_gerarfatura boolean default lib.str_normalize( args->>'arg_espaco_gerarfatura' );
  arg_espaco_configurar boolean default lib.str_normalize( args->>'arg_espaco_configurar' );
  arg_espaco_codigo character varying default lib.str_normalize( args->>'arg_espaco_codigo' );
  arg_espaco_descricao character varying default lib.str_normalize( args->>'arg_espaco_descricao' );

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
    espaco_tespaco_id,
    espaco_espaco_id,
    espaco_colaborador_id,
    espaco_nome,
    espaco_descricao,
    espaco_gerarfatura,
    espaco_configurar,
    espaco_codigo
  ) values (
    arg_tespaco_id,
    arg_espaco_auth,
    arg_colaborador_id,
    arg_espaco_nome,
    arg_espaco_descricao,
    arg_espaco_gerarfatura,
    arg_espaco_configurar,
    arg_espaco_codigo
  ) returning * into _espaco;

  perform tweeks.funct_reg_cambio(
    jsonb_build_object(
      'arg_espaco_auth', _espaco.espaco_id,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_currency_id', _const.currency_std,
      'arg_cambio_valor', 1,
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


--
-- TOC entry 623 (class 1255 OID 23261)
-- Name: funct_reg_fornecedor(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_fornecedor(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar um novo fornecedor no sistema
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_fornecedor_nif: ID,
      arg_fornecedor_nome: NOME,
      arg_fornecedor_email: EMAIL,
      arg_fornecedor_contacto: CONTACTO,
      arg_fornecedor_endereco: ENDERECO
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_fornecedor_nif character varying not null default lib.str_normalize( lib.str_nospace( args->>'arg_fornecedor_nif') );
  arg_fornecedor_email character varying not null default lib.str_nospace( lower( args->>'arg_fornecedor_email' ) );
  arg_fornecedor_nome character varying not null default  lib.str_normalize( args->>'arg_fornecedor_nome' );
  arg_fornecedor_contacto character varying not null default lib.str_normalize( lib.str_nospace( args->>'arg_fornecedor_contacto' ) );
  arg_fornecedor_endereco character varying not null default lib.str_nospace( args->>'arg_fornecedor_endereco' );

  _fornecedor tweeks.fornecedor;

begin

  -- Garantir que tanto o email quanto o nif seja unico
  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_nif = arg_fornecedor_nif
  ) then
    return false? '@tweeks.fornecedor.nif-already-exist';
  end if;

  if(
    select count( * ) > 0
      from tweeks.fornecedor fo
      where fo.fornecedor_email = arg_fornecedor_email
  ) then
    return false? '@tweeks.fornecedor.email-already-exist';
  end if;

  insert into tweeks.fornecedor (
    fornecedor_colaborador_id,
    fornecedor_espaco_auth,
    fornecedor_nif,
    fornecedor_nome,
    fornecedor_email,
    fornecedor_contacto,
    fornecedor_endereco
  ) values (
    arg_colaborador_id,
    arg_espaco_auth,
    arg_fornecedor_nif,
    arg_fornecedor_nome,
    arg_fornecedor_email,
    arg_fornecedor_contacto,
    arg_fornecedor_endereco
  ) returning * into _fornecedor;

  return true? jsonb_build_object(
    'fornecedor', _fornecedor
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 624 (class 1255 OID 23262)
-- Name: funct_reg_imposto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_imposto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_artigo_id: ID,
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_imposto: [
        { arg_tipoimposto_id: ID,
          arg_taplicar_id: ID,
          arg_imposto_valor: VALOR, # Por equanto envie null
          arg_imposto_percentagem: PERCENTAGEM, # Por enquanto envie null
        }
      ]
    }
   */
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_imposto jsonb not null default args->>'arg_imposto';
  arg_tipoimposto_id int2[] default array( select ( ele.doc->>'arg_tipoimposto_id')::int2 from jsonb_array_elements( arg_imposto ) ele( doc ) );
  _const map.constant;
begin

  _const := map.constant();

  -- Primeiro desativar as associação dos impostos atual
  update tweeks.imposto
    set imposto_estado = _const.imposto_estado_fechado,
        imposto_dataregistro = current_timestamp,
        imposto_colaborador_atualizacao = arg_colaborador_id
    where imposto_artigo_id = arg_artigo_id
      and imposto_estado = _const.imposto_estado_ativo
  ;

  insert into tweeks.imposto(
    imposto_tipoimposto_id,
    imposto_artigo_id,
    imposto_taplicar_id,
    imposto_espaco_auth,
    imposto_colaborador_id,
    imposto_percentagem,
    imposto_valor
  ) select
      ( el.doc->>'arg_tipoimposto_id' )::int2,
      arg_artigo_id,
      ( el.doc->>'arg_taplicar_id' )::int2,
      arg_espaco_auth,
      arg_colaborador_id,
      ( el.doc->>'arg_imposto_percentagem' )::double precision,
      ( el.doc->>'arg_imposto_valor' )::double precision
    from jsonb_array_elements( arg_imposto ) el( doc )
  ;

  return true ? jsonb_build_object(
    'imposto', array(
      select ip
        from tweeks.imposto ip
        where ip.imposto_artigo_id = arg_artigo_id
          and ip.imposto_estado = _const.imposto_estado_ativo
    )
  );
end;
$$;


--
-- TOC entry 625 (class 1255 OID 23263)
-- Name: funct_reg_item(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_item(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
    /**
      Essa funçao serve para registar um item
      {
        arg_espaco_auth: ID
      }
     */
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_item_nome character varying default args->>'arg_item_nome';
    arg_item_custo arg_entrada_next not null default args->>'arg_item_custo';
    arg_item_quantidadecusto arg_entrada_next default args->>'arg_item_quantidadecusto';
    arg_item_descricao character varying default args->>'arg_item_descricao';

    _artigo tweeks.artigo;
    _result lib.result;
    _const map.constant;
    arg_artigo_codigo varchar;

begin
    _const := map.constant();

    arg_item_quantidadecusto := coalesce( arg_item_quantidadecusto, 1 );
    if (
        select count( * ) > 0
        from tweeks.artigo it
        where lib.str_normalize( lower( it.artigo_nome ) ) = lib.str_normalize( lower( arg_item_nome ) )
          and it.artigo_classe_id = _const.classe_itemextra
    ) then
        return false? '@item.nome.already.exist';
    end if;

    while arg_artigo_codigo is null loop
            arg_artigo_codigo :=  format( 'item#%s', (random() * 999999 )::int );
            if( select count( * ) > 0 from tweeks.artigo where artigo_codigo = arg_artigo_codigo ) then
                arg_artigo_codigo := null;
            end if;
        end loop;


    insert into tweeks.artigo (
        artigo_classe_id,
        artigo_espaco_auth,
        artigo_colaborador_id,
        artigo_codigo,
        artigo_nome,
        artigo_custo,
        artigo_quantidadecusto,
        artigo_descricao
    )  values (
                  _const.classe_itemextra,
                  arg_espaco_auth,
                  arg_colaborador_id,
                  arg_artigo_codigo,
                  arg_item_nome,
                  arg_item_custo,
                  arg_item_quantidadecusto,
                  arg_item_descricao
              ) returning * into _artigo;

    _result := tweeks.funct_reg_precario(
            jsonb_build_object(
                    'arg_espaco_auth', arg_espaco_auth,
                    'arg_colaborador_id', arg_colaborador_id,
                    'arg_precario_referencia', jsonb_build_object( 'artigo_id', _artigo.artigo_id ),
                    'arg_precario_custo', _artigo.artigo_custo,
                    'arg_precario_quantidade', _artigo.artigo_quantidadecusto
                )
        );

    _result.message := _result.message || jsonb_build_object(
            'artigo', _artigo
        );

    return _result;

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end;
$$;


--
-- TOC entry 626 (class 1255 OID 23264)
-- Name: funct_reg_link_associacao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_link_associacao(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para
    args := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID
      arg_link_nome: NOME,
      arg_link_referencia: REF,
      arg_link_referenciareplace: boolean | default true, -- indica se todos os links apara esse referencia atual vão deixar de existir
      arg_links: [
        { arg_espaco_destino: ID  }
      ]
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
  arg_links jsonb not null default  args->'arg_links';
  arg_espacos uuid[] not null default array( select ( el.doc->>'arg_espaco_destino' )::uuid from jsonb_array_elements( arg_links ) el( doc ));
  arg_link_referenciareplace boolean default args->>'arg_link_referenciareplace';

  arg_link_referencia jsonb not null default args->>'arg_link_referencia';
  arg_link_nome character varying not null default args->>'arg_link_nome';

  _const map.constant;
  _link tweeks.link;
  _data record;
  arg_artigo_id uuid default arg_link_referencia->>'artigo_id';
  _artigo tweeks.artigo;
  _classe tweeks.classe;
  _aux record;
begin
  arg_link_referenciareplace := coalesce( arg_link_referenciareplace, true );
  _const := map.constant();

  if arg_artigo_id is not null then
    _artigo := tweeks._get_artigo( arg_artigo_id );
    _classe := tweeks._get_classe( _artigo.artigo_classe_id );
  end if;

  -- Desativar desacociar todos dos espaços filhos que não estao na lista
  with aux as (
    -- listar todos os links que devem ser mortos
    select *
      from tweeks.link
      where link_referencia @> arg_link_referencia
        and link_estado = _const.link_estado_associacao
        and link_tlink_id = _const.tlink_associacao
        and link_espaco_destino != all ( arg_espacos )
        and link_espaco_auth = any( arg_espaco_child )
        and arg_link_referenciareplace
  )
  update tweeks.link
    set link_estado = _const.link_estado_fechado,
        link_dataatualizacao = current_timestamp,
        link_colaborador_atualizacao = arg_colaborador_id
    where link_id in ( select link_id from aux )
      or link_link_associacao in ( select link_id from aux )
  ;

  for _data in
    select
        ( it.doc->>'arg_espaco_destino' )::uuid as arg_espaco_destino,
        ( it.doc->>'arg_link_custo' )::double precision as arg_link_custo,
        ( it.doc->>'arg_link_quantidadecusto' )::double precision arg_link_quantidadecusto
      from jsonb_array_elements( arg_links ) it ( doc )
        left join tweeks.link l on it.doc @> jsonb_build_object( 'arg_espaco_destino', l.link_espaco_destino )
          and l.link_referencia @> arg_link_referencia
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
      where l.link_id is null
  loop

    -- Lincar os protudos ao espaço
    insert into tweeks.link (
      link_tlink_id,
      link_referencia,
      link_espaco_auth,
      link_espaco_destino,
      link_colaborador_id,
      link_posicao,
      link_nome,
      link_estado
    ) values (
      _const.tlink_associacao,
      arg_link_referencia,
      arg_espaco_auth,
      _data.arg_espaco_destino,
      arg_colaborador_id,
      -1,
      arg_link_nome,
      _const.link_estado_associacao
    ) returning * into _link ;

    if coalesce( _data.arg_link_quantidadecusto, 0 ) = 0 or coalesce( _data.arg_link_custo, 0 ) = 0 then
      _data.arg_link_quantidadecusto := null;
      _data.arg_link_custo := null;
    end if;

    -- Linkar tambem a classe quando for linkar o produto (adicionar o link da classe ao espaco se ainda não houver)
    if _artigo.artigo_id is not null and (
      select count( * ) = 0
        from tweeks.link lk
        where lk.link_espaco_destino = _data.arg_espaco_destino
          and lk.link_referencia @> rule.classe_referencia( _classe.classe_id )
          and lk.link_tlink_id = _const.tlink_associacao
          and lk.link_estado = _const.link_estado_associacao
    ) then
      -- Criar o link para o destino
      perform tweeks.funct_reg_link_associacao( jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_espaco_auth', arg_espaco_auth,
        'arg_link_nome', _classe.classe_nome,
        'arg_link_referencia', rule.classe_referencia( _classe.classe_id ),
        'arg_link_referenciareplace', false,
        'arg_links', json_build_array( json_build_object(
          'arg_espaco_destino', _data.arg_espaco_destino
        ))
      ));
    end if;

    -- Quando for artigo linkar também os tipos de imposto ao espaco
    for _aux in
      select *
        from tweeks.imposto ip
          inner join tweeks.tipoimposto tip on ip.imposto_tipoimposto_id = tip.tipoimposto_id
          left join tweeks.link lk on lk.link_referencia @> rule.tipoimposto_referencia( tip.tipoimposto_id )
            and lk.link_estado = _const.link_estado_associacao
            and lk.link_espaco_destino = _data.arg_espaco_destino
            and lk.link_tlink_id = _const.tlink_associacao
        where _artigo.artigo_id is not null
          and ip.imposto_artigo_id = _artigo.artigo_id
          and ip.imposto_estado = _const.imposto_estado_ativo
          and lk.link_id is null
    loop
      perform tweeks.funct_reg_link_associacao( jsonb_build_object(
          'arg_colaborador_id', arg_colaborador_id,
          'arg_espaco_auth', arg_espaco_auth,
          'arg_link_nome', _aux.tipoimposto_nome,
          'arg_link_referencia', rule.tipoimposto_referencia( _aux.tipoimposto_id ),
          'arg_link_referenciareplace', false,
          'arg_links', json_build_array( json_build_object(
            'arg_espaco_destino', _data.arg_espaco_destino
          ))
        ));
    end loop;



  end loop;

  return  true ? jsonb_build_object(
    'link', array(
      select l
        from tweeks.link l
        where l.link_referencia @> arg_link_referencia
          and l.link_estado = _const.link_estado_associacao
          and l.link_tlink_id = _const.tlink_associacao
    )
  );

end;
$$;


--
-- TOC entry 627 (class 1255 OID 23266)
-- Name: funct_reg_link_tecla(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_link_tecla(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para registar as link
    args := {
      arg_link_id: ID,
      arg_link_associacao: ID,
      arg_tlink_id: ID,
      arg_artigo_id: ID,
      arg_espaco_auth: ID,
      arg_espaco_destino: ID,
      arg_colaborador_id: ID,
      arg_link_posicao: POSICAO,
      arg_link_nome: NOME,
      arg_link_config: JSON,
    }
  */

  arg_link_id uuid default args->>'arg_link_id';
  arg_link_associacao uuid not null default args->>'arg_link_associacao';
  arg_artigo_id uuid default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id' ;

  arg_tlink_id int2 default args->>'arg_tlink_id';
  arg_link_posicao int2 not null default args->>'arg_link_posicao';
  arg_link_nome character varying not null default args->>'arg_link_nome';
  arg_link_config jsonb not null default args->'arg_link_config';

  arg_link_estado int2;

  _const map.constant;
  _link tweeks.link;
  _link_associacao tweeks.link;
  _artigo tweeks.artigo;

begin

  lock table tweeks.link in share mode;
  lock table tweeks.artigo in share mode;

  _const := map.constant();
  _link := tweeks._get_link( arg_link_id );
  _link_associacao := tweeks._get_link( arg_link_associacao );
  _artigo := tweeks._get_artigo( arg_artigo_id );

  -- Garantir que a link estejá livre
  if (
    select count( * ) > 0
      from tweeks.link a
      where a.link_espaco_destino = arg_espaco_destino
        and coalesce( a.link_link_id, -1 ) = coalesce( arg_link_id, -1 )
        and a.link_posicao = arg_link_posicao
        and a.link_estado = _const.acerto_estado_ativo
  ) then
    return false ? '@tweeks.link.position-is-occupied';
  end if;

  -- Garantir que link do produto não entra nenhuma sub-link
  if _link.link_referencia->>'artigo_id' is not null then
    return false ? '@tweeks.link.is-a-article';
  end if;

  if _link.link_estado != _const.link_estado_ativo then
    return false ? '@tweeks.link.is-closed';
  end if;

  if _artigo.artigo_id is not null then
    arg_link_nome := _artigo.artigo_nome;
  end if;

  insert into tweeks.link (
    link_link_id,
    link_link_associacao,
    link_tlink_id,
    link_referencia,
    link_espaco_destino,
    link_espaco_auth,
    link_colaborador_id,
    link_posicao,
    link_nome,
    link_config,
    link_extras
  ) values (
    arg_link_id,
    arg_link_associacao,
    arg_tlink_id,
    jsonb_build_object( 'artigo_id', arg_artigo_id ),
    arg_espaco_destino,
    arg_espaco_auth,
    arg_colaborador_id,
    arg_link_posicao,
    arg_link_nome,
    arg_link_config,
    _link_associacao.link_extras
  ) returning * into _link;

  return true ? jsonb_build_object(
    'link', _link
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 628 (class 1255 OID 23267)
-- Name: funct_reg_mesa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_mesa(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para cadastrar uma nova mesa
    args := {
      arg_colaborador_id: ID,
      arg_mesa_numero: NUMERO,
      arg_mesa_lotacao: NUMERO,
      arg_mesa_descricao: DESCRICAO,
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_mesa_numero varchar not null default lib.str_normalize( args->>'arg_mesa_numero' );
  arg_mesa_descricao varchar default lib.str_normalize( args->>'arg_mesa_descricao' );
  arg_mesa_lotacao int2 default args->>'arg_mesa_lotacao';

  _mesa tweeks.mesa;

begin

  -- Garantir que o numero de mesa seja unico
  if (
    select count( * ) > 0
    from tweeks.mesa m
    where m.mesa_numero =  arg_mesa_numero
  ) then
    return false ? '@mesa.numero.already-exist';
  end if;

  insert into tweeks.mesa (
    mesa_colaborador_id,
    mesa_lotacao,
    mesa_numero,
    mesa_designacao
  ) values (
    arg_colaborador_id,
    arg_mesa_lotacao,
    arg_mesa_numero,
    arg_mesa_descricao
  ) returning * into _mesa;

  return true ? jsonb_build_object(
    'mesa', _mesa
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 629 (class 1255 OID 23268)
-- Name: funct_reg_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_posto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para criar uma posto para o colaborador
    args := {
      arg_espaco_auth: ID,
      arg_espaco_destino: ID,
      arg_colaborador_id: ID,
      arg_posto_endereco: MAC,
      arg_tposto_id: ID,
      arg_posto_multipleuser: BOOLEAN,
      arg_posto_designcao: ID,
      arg_posto_montanteinicial: MONTANTE_INICIAL,
      arg_device: JSON
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_tposto_id int2 not null default args->>'arg_tposto_id';
  arg_posto_multipleuser boolean default args->>'arg_posto_multipleuser';
  arg_posto_endereco character varying not null default args->>'arg_posto_endereco';
  arg_posto_montanteinicial float not null default args->>'arg_posto_montanteinicial';
  arg_posto_designcao varchar not null default args->>'arg_posto_designcao';
  arg_device jsonb not null default args->'arg_device';

  _const map.constant;
  _posto tweeks.posto;

begin

  if (
    select count( * ) > 0
      from tweeks.posto p
      where p.posto_endereco = arg_posto_endereco
  ) then
    return false ? '@tweeks.posto.endereco-already-exist';
  end if;
  _const := map.constant();

  insert into tweeks.posto (
    posto_espaco_destino,
    posto_espaco_auth,
    posto_tposto_id,
    posto_colaborador_id,
    posto_designacao,
    posto_montante,
    posto_multipleuser,
    posto_endereco
  ) values (
    arg_espaco_destino,
    arg_espaco_auth,
    arg_tposto_id,
    arg_colaborador_id,
    arg_posto_designcao,
    arg_posto_montanteinicial,
    coalesce( arg_posto_multipleuser, true ),
    arg_posto_endereco
  ) returning * into _posto;

  return true ? jsonb_build_object(
        'posto', _posto
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 630 (class 1255 OID 23269)
-- Name: funct_reg_precario(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_precario(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registrar e atualizar os preços dos itens
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_forced: boolean,
      arg_precario_referencia: {
        artigo_id: ID,
      },
      arg_precario_custo: CUSTO,
      arg_precario_quantidade: QUANT
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_precario_referencia jsonb not null default args->>'arg_precario_referencia';
  arg_precario_custo double precision not null default args->>'arg_precario_custo';
  arg_precario_quantidade double precision not null default args->>'arg_precario_quantidade';
  arg_forced boolean default args->>'arg_forced';
  arg_artigo_id uuid;

  _const map.constant;
  _precario tweeks.precario;
  _artigo tweeks.artigo;

begin
  _const := map.constant();
  arg_forced := coalesce( arg_forced, false );

  arg_artigo_id := arg_precario_referencia->>'artigo_id';


  if not arg_forced and arg_artigo_id is not null then
    _artigo := tweeks._get_artigo( arg_artigo_id );

    -- Alterar o preço apenas quando o artigo não estiver em nenhuma conta aberta
    if  _artigo.artigo_classe_id = _const.classe_itemextra
      and (
         select count( * ) > 0
         from tweeks.agrega ag
         where ag.agrega_artigo_item = arg_artigo_id
           and ag.agrega_estado in ( _const.agrega_estado_aberto )
       ) then
      return false ? '@tweeks.artigo.price-can-not-update-open-account';
    end if;

    if _artigo.artigo_id is not null
      and (
         select count( * ) > 0
         from tweeks.venda ag
         where ag.venda_artigo_id = arg_artigo_id
           and ag.venda_estado in ( _const.venda_estado_aberto )
       ) then
      return false ? '@tweeks.artigo.price-can-not-update-open-account';
    end if;
  end if;

  -- Desativar o precario atual
  update tweeks.precario
    set precario_estado = _const.precario_estado_fechado,
        precario_dataatualizacao = current_timestamp,
        precario_colaborador_atualizacao = arg_colaborador_id
    where precario_referencia @> arg_precario_referencia
      and precario_estado = _const.precario_estado_ativo
      and precario_espaco_auth = arg_espaco_auth
  ;

  insert into tweeks.precario(
    precario_colaborador_id,
    precario_referencia,
    precario_custo,
    precario_quantidade,
    precario_espaco_auth
  ) values (
    arg_colaborador_id,
    arg_precario_referencia,
    arg_precario_custo,
    arg_precario_quantidade,
    arg_espaco_auth
  ) returning * into _precario;

  return true? jsonb_build_object(
    'precario', _precario
  );
end;
$$;




--
-- TOC entry 631 (class 1255 OID 23270)
-- Name: funct_reg_stock(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_stock(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_colaborador_id: ID,
      arg_artigo_id: ID,
      arg_espacao_id: ID,
      arg_stock_quantidade: QUANT,
    }
   */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espacao_id uuid not null default args->>'arg_espacao_id';
  arg_stock_quantidade double precision default args->>'arg_stock_quantidade';

  _stock tweeks.stock;

begin

  -- Garantir que não existe um estock desse produto para o local já definico
  if (
    select count( * ) > 0
      from tweeks.stock st
      where st.stock_espacao_id = arg_espacao_id
        and st.stock_artigo_id = arg_artigo_id
  ) then
    return false ? '@stock.already-exist';
  end if;

  -- Criar o novo stock
  insert into tweeks.stock(
    stock_artigo_id,
    stock_espacao_id,
    stock_colaborador_id
  )  values (
    arg_artigo_id,
    arg_espacao_id,
    arg_colaborador_id
  ) returning * into _stock;


  -- Atualizar o stock se a quantidade de stock for diferente que zero
  if arg_stock_quantidade then
    perform tweeks.funct_reg_acerto(
      jsonb_build_object(
        'arg_colaborador_id', arg_colaborador_id,
        'arg_artigo_id', arg_artigo_id,
        'arg_espaco_id', arg_espacao_id,
        'arg_acerto_quantidade', arg_stock_quantidade,
        'arg_acerto_observacao', 'Acerto inicial para começar o stock com uma quantidade expeficica dos produto.'
      )
    );
  end if;

  return true ? jsonb_build_object(
    'stock', _stock
  );
end;
$$;


--
-- TOC entry 632 (class 1255 OID 23271)
-- Name: funct_reg_taxa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_taxa(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    args := {
      arg_espaco_auth: ID,
      arg_colaborador_id: ID,
      arg_tipoimposto_id: ID,
      arg_taxa_percentagem: ID,
      arg_taxa_taxa: VALOR
    }
   */

  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_tipoimposto_id int2 default args->>'arg_tipoimposto_id';
  arg_taxa_percentagem double precision default args->>'arg_taxa_percentagem';
  arg_taxa_taxa double precision default args->>'arg_taxa_taxa';

  _const map.constant;
  _taxa tweeks.taxa;
begin

  _const := map.constant();

  -- Desativar todas as taxas atual
  update tweeks.taxa
    set taxa_estado = _const.taxa_estado_fechado,
        taxa_dataatualizacao = current_timestamp,
        taxa_colaborador_atualizacao = arg_colaborador_id
    where taxa_espaco_auth = arg_espaco_auth
      and taxa_tipoimposto_id = arg_tipoimposto_id
      and taxa_estado = _const.taxa_estado_ativo
  ;

  -- Criar o novo imposto
  insert into tweeks.taxa (
    taxa_tipoimposto_id,
    taxa_colaborador_id,
    taxa_percentagem,
    taxa_taxa,
    taxa_espaco_auth
  ) values (
    arg_tipoimposto_id,
    arg_colaborador_id,
    arg_taxa_percentagem,
    arg_taxa_taxa,
    arg_espaco_auth
  ) returning * into _taxa;

  return true ? jsonb_build_object(
    'taxa', _taxa
  );

end;
$$;


--
-- TOC entry 633 (class 1255 OID 23272)
-- Name: funct_reg_tipoimposto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_tipoimposto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar os tipos de imposto
    args := {
      arg_colaborador_id: ID,
      arg_espaco_auth: ID,
      arg_tipoimposto_nome: NOME,
      arg_tipoimposto_codigo: CODIGO,
      arg_taxa_taxa: VALOR,
      arg_taxa_percentagem: PERCENTAGEM,
      arg_links :[
        { arg_espaco_destino: ID  }
      ]
    }
   */

  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_tipoimposto_nome character varying not null default args->>'arg_tipoimposto_nome';
  arg_tipoimposto_codigo character varying not null default args->>'arg_tipoimposto_codigo';
  arg_taxa_percentagem double precision default args->>'arg_taxa_percentagem';
  arg_taxa_taxa double precision default args->>'arg_taxa_taxa';
  arg_espaco_child uuid[] default rule.espaco_get_childrens( arg_espaco_auth );
  _tipoimposto tweeks.tipoimposto;
begin
  arg_tipoimposto_codigo := lib.str_normalize( upper( public.unaccent( arg_tipoimposto_codigo ) ) );
  if (
    select count( * ) > 0
      from tweeks.tipoimposto tip
      where tip.tipoimposto_espaco_auth = any( arg_espaco_child )
        and lib.str_normalize( upper( public.unaccent( tip.tipoimposto_codigo ) ) ) = arg_tipoimposto_codigo
  ) then
    return false ? '@tweeks.tipoimposto.codigo-already-exist';
  end if;

  insert into tweeks.tipoimposto (
    tipoimposto_espaco_auth,
    tipoimposto_colaborador_id,
    tipoimposto_nome,
    tipoimposto_codigo
  ) values (
    arg_espaco_auth,
    arg_colaborador_id,
    arg_tipoimposto_nome,
    arg_tipoimposto_codigo
  ) returning * into _tipoimposto;

  perform tweeks.funct_reg_taxa(
    jsonb_build_object(
      'arg_espaco_auth', arg_espaco_auth,
      'arg_colaborador_id', arg_colaborador_id,
      'arg_tipoimposto_id', _tipoimposto.tipoimposto_id,
      'arg_taxa_percentagem', arg_taxa_percentagem,
      'arg_taxa_taxa', arg_taxa_taxa
    )
  );

  perform tweeks.funct_reg_link_associacao(
    jsonb_build_object(
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth,
      'arg_link_nome', _tipoimposto.tipoimposto_nome,
      'arg_link_referencia', jsonb_build_object( 'tipoimposto_id', _tipoimposto.tipoimposto_id ),
      'arg_links', args->'arg_links'
    )
  );

  return true ? jsonb_build_object(
    'tipoimposto', _tipoimposto
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 634 (class 1255 OID 23273)
-- Name: funct_reg_trabalha(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_trabalha(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
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
    set trabalha_estado = _const.trabalha_estado_fechado,
        trabalha_colaborador_atualizacao = arg_colaborador_id,
        trabalha_dataatualizacao = current_timestamp
    where trabalha_estado = _const.trabalha_estado_ativo
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
        where tr.trabalha_estado = _const.trabalha_estado_ativo
          and tr.trabalha_colaborador_proprietario = arg_colaborador_propetario
    )
  );
end;
$$;


--
-- TOC entry 635 (class 1255 OID 23274)
-- Name: funct_reg_transacao_movimentacao_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_reg_transacao_movimentacao_posto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para transacionar o valor de um posto
    args := {
      arg_espaco_auth: ID
      arg_posto_id: ID,
      arg_tmovimento_id: ID,
      arg_colaborador_id: ID,
      arg_transacao_zerar: BOOLEAN,
      arg_transacao_montante: float,

      arg_transacao_documento: NULL,
      arg_transacao_observacao: NULL
    }
   */
  arg_posto_id uuid := args->>'arg_posto_id';
  arg_espaco_auth uuid not null := args->>'arg_espaco_auth';
  arg_tmovimento_id int2 := args->>'arg_tmovimento_id';
  arg_colaborador_id uuid := args->>'arg_colaborador_id';
  arg_transacao_zerar boolean := args->>'arg_transacao_zerar';
  arg_transacao_montante double precision := args->>'arg_transacao_montante';
  arg_transacao_documento varchar := args->>'arg_transacao_documento';
  arg_transacao_observacao varchar := args->>'arg_transacao_observacao';

  _const map.constant;
  _posto tweeks.posto;
  _transacao tweeks.transacao;
  _caixa tweeks.caixa;

begin
  _const := map.constant();
  _posto := tweeks._get_posto( arg_posto_id );

  select * into _caixa
    from tweeks.caixa cx
    where cx.caixa_posto_id = _posto.posto_id
      and cx.caixa_estado = _const.caixa_estado_ativo
  ;

  arg_transacao_zerar := coalesce( arg_transacao_zerar, false );

  -- Quando for para zerar a conta então montate aqui sera de zero
  if arg_transacao_zerar then
    arg_transacao_montante := 0;
  end if;

  -- Quando houver documentos
  if arg_transacao_documento is null and _caixa.caixa_id is not null then
    arg_transacao_documento := lib.str_nospace( to_char( _caixa.caixa_id, '"CX#"000-000' ) );

  elseif arg_transacao_documento is null then
    arg_transacao_documento := lib.str_nospace( to_char( nextval( 'tweeks.seq_transacao_movimento' ), '"MV#"000-000' ) );
  end if;

  -- Garantir que quando for deito o montante a debitar menor igaul ao montante no posto
  if arg_tmovimento_id = _const.tmovimento_debito and arg_transacao_montante > _posto.posto_montante then
    return false ? '@tweeks.transacao.montante-insuficient';
  end if;

  _transacao := rule.transacao_create(
      arg_espaco_auth,
      arg_posto_id,
      _const.toperacao_movimento,
      arg_tmovimento_id,
      arg_colaborador_id,
      arg_transacao_montante,
      arg_transacao_documento,
      null,
      arg_transacao_zerar,
      arg_transacao_observacao
    );

  return true ? jsonb_build_object(
    'transacao', _transacao
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 636 (class 1255 OID 23275)
-- Name: funct_reg_transferencia(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_transferencia(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para registar uma transferencia de stock
    args := {
      arg_espaco_auth: ID
      arg_colaborador_id: ID,
      arg_artigo_id: ID,
      arg_espaco_origem: ID,
      arg_espaco_destino: ID,
      arg_transferencia_quantidade: QUANT,
      arg_transferencia_data: DATA,
      arg_transferencia_documento: DOC,
      arg_transferencia_observacao: OBS
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_origem uuid not null default args->>'arg_espaco_origem';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';
  arg_transferencia_quantidade double precision not null default args->>'arg_transferencia_quantidade';
  arg_transferencia_data date default args->>'arg_transferencia_data';
  arg_transferencia_documento character varying default lib.str_normalize( args->>'arg_transferencia_documento' );
  arg_transferencia_observacao character varying default lib.str_nospace( args->>'arg_transferencia_observacao' );

  _espaco_origem tweeks.espaco;
  _espaco_destino tweeks.espaco;
  _transferencia tweeks.transferencia;
  _const map.constant;

begin

  _const := map.constant();

  arg_transferencia_documento := coalesce( arg_transferencia_documento, upper( lib.dset_random_name( 2, 9 ) ) );
  _espaco_origem := tweeks._get_espaco( arg_espaco_origem );
  _espaco_destino := tweeks._get_espaco( arg_espaco_destino );

  if _espaco_origem.espaco_estado = _const.espaco_estado_fechado then
    return false ? '@tranferencia.espaco.origem.estatado-fechado';
  end if;

  if _espaco_destino.espaco_estado = _const.espaco_estado_fechado then
    return false ? '@tranferencia.espaco.destino.estatado-fechado';
  end if;

  insert into tweeks.transferencia (
    transferencia_espaco_auth,
    transferencia_stock_origem,
    transferencia_stock_destino,
    transferencia_colaborador_id,
    transferencia_quantidade,
    transferencia_data,
    transferencia_documento,
    transferencia_observacao
  ) values (
     arg_espaco_auth,
    (tweeks._get_stock( arg_artigo_id, arg_espaco_origem ) ).stock_id,
    (tweeks._get_stock( arg_artigo_id, arg_espaco_destino ) ).stock_id,
    arg_colaborador_id,
    arg_transferencia_quantidade,
    arg_transferencia_data,
    arg_transferencia_documento,
    arg_transferencia_observacao
  ) returning * into _transferencia;

  return true?jsonb_build_object(
    'transferencia', _transferencia,
    'stock_origem', tweeks._get_stock( arg_artigo_id, arg_espaco_origem ),
    'stock_destino', tweeks._get_stock( arg_artigo_id, arg_espaco_destino ),
    'artigo', tweeks._get_artigo( arg_artigo_id )
  );

exception  when others then
  <<_ex>> declare e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
  end;
end;
$$;


--
-- TOC entry 637 (class 1255 OID 23276)
-- Name: funct_reg_venda(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_venda(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para associar mais vendas a conta
    args := {
      arg_colaborador_id: ID,
      arg_conta_id: ID,
      arg_espaco_auth: ID,
      arg_message_error: TRUE|FALSE,
      arg_vendas: [
        {
          arg_artigo_id:
          arg_venda_quantidade
          arg_venda_custounitario

          arg_agregas: [
            {
              arg_item_id: ID,
              arg_item_quantidadecusto: QUANT/CUSTO
              arg_agrega_quantidade: QUANT,
              arg_item_custo: CUSTO,
              arg_agrega_montante: MONTANTE
            }
          ]
        }
      ]
    }
   */
  arg_colaborador_id int not null default args->>'arg_colaborador_id';
  arg_conta_id int not null default args->>'arg_conta_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_vendas jsonb not null default args->>'arg_vendas';
  arg_message_error boolean default args->>'arg_message_error';

  -- colocar todos os id dos artigos em uma lista
  arg_artigos_id uuid [ ] default array( select ( doc.venda->>'arg_artigo_id' )::uuid  from jsonb_array_elements( arg_vendas ) doc( venda ) );
  arg_items_id uuid[ ];
  _const map.constant;
  _conta tweeks.conta;
  _data record;
  _venda tweeks.venda;

begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  -- Quando a conta não esta aberta
  if _conta.conta_estado != _const.conta_estado_aberto and arg_message_error then
    raise exception '@conta.estado.not-closed';
  elseif  _conta.conta_estado != _const.conta_estado_aberto then
    return false ? '@conta.estado.not-closed';
  end if;

  --   -- Contar quantas vendas de novos artigos já estão agregado a conta
  --   select
  --       string_agg( art.artigo_nome, ', ' order by  artigo_nome asc ) as artigo_nomes,
  --       count( art.artigo_id ) as artigo_total
  --       into _data
  --     from tweeks.artigo art
  --       inner join tweeks.venda ve on art.artigo_id = ve.venda_artigo_id
  --     where ve.venda_conta_id = arg_conta_id
  --       and ve.venda_estado >= _const.venda_estado_fechado
  --       and art.artigo_id = any ( arg_artigos_id )
  --   ;
  --   -- Garantir que as novas vendas não esteva em artigo
  --   if _data.artigo_total > 0 then
  --     return false ? format( 'Os atrigos "%s" já estão agregados a conta!', _data.artigo_nomes );
  --   end if;

  -- Garrantir que tenha o stock disponivel para os artigos
  with novas_vendas as (
    select
      ( dos.venda->>'arg_artigo_id' )::uuid as arg_artigo_id,
      ( dos.venda->>'arg_venda_quantidade' )::double precision as arg_venda_quantidade,
      ( dos.venda->>'arg_venda_custounitario' )::double precision as arg_venda_custounitario,
      dos.venda->'arg_agregas' as arg_agregas
    from jsonb_array_elements( arg_vendas ) dos( venda )
  )
  select
    count( art.artigo_id ) as artigo_total,
    string_agg( art.artigo_nome, ', ' ) as artigo_nomes
    into _data
  from novas_vendas vds
         inner join tweeks.artigo art on  vds.arg_artigo_id = art.artigo_id
         inner join tweeks.stock st on art.artigo_id = st.stock_artigo_id
  where st.stock_espacao_id = arg_espaco_auth
    and not rule.artigo_has_stock( art.artigo_id, arg_espaco_auth, vds.arg_venda_quantidade )
  ;


  if _data.artigo_total > 0 and arg_message_error then
    raise exception '%', format( 'Os stock dos produtos "%s" não cobrem a venda para essa conta', _data.artigo_nomes );

  elsif _data.artigo_total > 0 then
    return false ? format( 'Os stock dos produtos "%s" não cobrem a venda para essa conta', _data.artigo_nomes );
  end if;


  -- Registar as novas vendas a conta
  for _data in
    with novas_vendas as (
      select
        ( dos.venda->>'arg_artigo_id' )::uuid  as arg_artigo_id,
        ( dos.venda->>'arg_venda_quantidade' )::double precision as arg_venda_quantidade,
        ( dos.venda->>'arg_venda_custounitario' )::double precision as arg_venda_custounitario,
        dos.venda->'arg_agregas' as arg_agregas
      from jsonb_array_elements( arg_vendas ) dos( venda )
    ) select *
    from novas_vendas vds
      inner join tweeks.artigo art on vds.arg_artigo_id = art.artigo_id
    loop

      arg_items_id := array( select ( doc.agrega->>'arg_item_id' )::uuid  from jsonb_array_elements( _data.arg_agregas ) doc( agrega ) );

      insert into tweeks.venda(
        venda_conta_id,
        venda_artigo_id,
        venda_espaco_auth,
        venda_colaborador_id,
        venda_quantidade,
        venda_custounitario,
        venda_montente,
        venda_montanteagregado,
        venda_montantetotal,
        venda_estadopreparacao
      ) values (
        arg_conta_id,
        _data.arg_artigo_id,
        arg_espaco_auth,
        arg_colaborador_id,
        _data.arg_venda_quantidade,
        _data.arg_venda_custounitario,
        _data.arg_venda_quantidade * _data.arg_venda_custounitario,
        0.0,
        _data.arg_venda_quantidade * _data.arg_venda_custounitario,
        case when _data.artigo_preparacao  then _const.venda_estadopreparacao_pendente else _const.venda_estadopreparacao_preparado end
      ) returning * into _venda;

      -- aggregar os novos item a venda
      with item_preco as (
        select
          ( doc.agrega->>'arg_agrega_quantidade' )::double precision as arg_agrega_quantidade,
          ( doc.agrega->>'arg_item_quantidadecusto' )::double precision as arg_item_quantidadecusto,
          ( doc.agrega->>'arg_item_custo' )::double precision as arg_item_custo,
          ( doc.agrega->>'arg_item_id' )::uuid as arg_item_id
        from jsonb_array_elements( _data.arg_agregas ) doc( agrega )
      )
      insert into tweeks.agrega (
        agrega_venda_id,
        agrega_artigo_item,
        agrega_colaborador_id,
        agrega_quantidade,
        agrega_custounitario,
        agrega_montante,
        agrega_espaco_auth
      ) select
            _venda.venda_id,
            it.artigo_id,
            arg_colaborador_id,
            ip.arg_agrega_quantidade,
            ip.arg_item_custo,
            rule.calculate_cost( ip.arg_item_quantidadecusto, ip.arg_item_custo, ip.arg_agrega_quantidade ),
            arg_espaco_auth
          from tweeks.artigo it
            inner join item_preco ip on it.artigo_id = ip.arg_item_id
          where it.artigo_id = any ( arg_items_id )
      ;

      perform tweeks.funct_reg_vendaimposto(
        jsonb_build_object(
          'arg_colaborador_id', arg_colaborador_id,
          'arg_venda_id', _venda.venda_id,
          'arg_artigo_id', _venda.venda_artigo_id,
          'arg_espaco_auth', arg_espaco_auth
        )
      );

    end loop;

  return true ? jsonb_build_object(
    'venda', array (
      select to_jsonb( ve ) || jsonb_build_object(
        'venda_item', jsonb_agg( to_jsonb( agg ) || to_jsonb( it) ),
        'added', ve.venda_artigo_id = any( arg_artigos_id )
      )
      from tweeks.venda ve
        left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
          and agg.agrega_estado >= _const.agrega_estado_fechado
        left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id
      where ve.venda_conta_id = arg_conta_id
        and ve.venda_estado = _const.venda_estado_aberto
      group by ve.venda_id
    )
  );
end;
$$;


--
-- TOC entry 638 (class 1255 OID 23278)
-- Name: funct_reg_vendaimposto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_reg_vendaimposto(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
  /**
    Essa função serve para aplicar os imposto numa venda
    args := {
      arg_colaborador_id: ID,
      arg_venda_id: ID,
      arg_artigo_id: ID,
      arg_espaco_auth: ID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_venda_id uuid not null default args->>'arg_venda_id';
  arg_artigo_id uuid not null default args->>'arg_artigo_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  _data record;
  _const map.constant;
  _venda tweeks.venda;

  arg_taxa_taxa double precision;
  arg_taxa_percentagem double precision;
  _taxa_agregada record;

  arg_venda_montantesemimposto double precision;
  arg_valor_retirar_bruto double precision;
  arg_valor_retirar_percentagem double precision;
  arg_imposto_multiplicador double precision;

  arg_venda_impostoadicionar double precision default 0.0;
  arg_venda_impostoretirar double precision default 0.0;
  icount int2 default 0;

begin

  _const := map.constant();
  _venda := tweeks._get_venda( arg_venda_id );

  _taxa_agregada := tweeks._get_impostos_taxa( arg_artigo_id, arg_espaco_auth );


  -- Retivar o valor bruto em seguida retivar o valor da percentagem
  arg_valor_retirar_bruto := _taxa_agregada.taxa_retirar;
  arg_valor_retirar_percentagem := rule.taxa_retirar_percentagem_adicionada(
    _venda.venda_montantetotal - arg_valor_retirar_bruto,
    _taxa_agregada.percentagem_retirar
  );

  arg_venda_montantesemimposto := _venda.venda_montantetotal - ( arg_valor_retirar_bruto + arg_valor_retirar_percentagem );

  -- Desativar todos os impostos que não vão mais ser aplicados
  update tweeks.impostovenda
    set impostovenda_estado = _const.impostovenda_estado_fechado,
        impostovenda_colaborador_atualizacao = arg_colaborador_id,
        impostovenda_dataatualizacao = current_timestamp
    where impostovenda_venda_id = _venda.venda_id
      and impostovenda_estado = _const.impostovenda_estado_ativo
  ;

  for _data in
    select
      ip.*,
      (txass::tweeks.taxa).*,
      tap.*
    from tweeks.imposto ip
      inner join tweeks.taplicar tap on ip.imposto_taplicar_id = tap.taplicar_id
      inner join tweeks.taxa txass on ip.imposto_tipoimposto_id = txass.taxa_tipoimposto_id
    where txass.taxa_id = any( _taxa_agregada.taxas )
      and ip.imposto_artigo_id = arg_artigo_id
      and ip.imposto_estado = _const.imposto_estado_ativo
  loop

    arg_taxa_taxa := 0;
    arg_taxa_percentagem := 0;
    arg_imposto_multiplicador := 1.0;

    -- Quando a taxa a aplicar for
    if _data.taxa_percentagem is not null and _data.taxa_percentagem > 0.0 then
      arg_taxa_taxa :=  coalesce( arg_venda_montantesemimposto * ( _data.taxa_percentagem / 100.0 ), 0 );
      arg_taxa_percentagem := _data.taxa_percentagem;

    elsif _data.taxa_taxa is not null and _data.taxa_taxa > 0 then
      arg_taxa_taxa := _data.taxa_taxa;
      arg_taxa_percentagem := ( _data.taxa_taxa  * 100.0 ) / arg_venda_montantesemimposto;

    end if;

    -- Se o valor for zero então saltar a taxa
    if arg_taxa_taxa = 0 then continue; end if;

    if _data.taplicar_id = _const.taplicar_adicionar then
      arg_venda_impostoadicionar := arg_venda_impostoadicionar + arg_taxa_taxa;
    else
      arg_venda_impostoretirar := arg_venda_impostoretirar + arg_taxa_taxa;
    end if;

    if _data.taplicar_id = _const.taplicar_retirar then
      arg_imposto_multiplicador := -1.0;
    end if;

    insert into tweeks.impostovenda(
      impostovenda_venda_id,
      impostovenda_tipoimposto_id,
      impostovenda_espaco_auth,
      impostovenda_colaborador_id,
      impostovenda_valor,
      impostovenda_percentagem
    ) values (
      arg_venda_id,
      _data.taxa_tipoimposto_id,
      arg_espaco_auth,
      arg_colaborador_id,
      ( arg_taxa_taxa * arg_imposto_multiplicador ),
      arg_taxa_percentagem
    );
    icount := icount +1;
  end loop;

  update tweeks.venda
    set venda_montantesemimposto = arg_venda_montantesemimposto,
        venda_montantecomimposto = arg_venda_montantesemimposto + arg_venda_impostoadicionar + arg_venda_impostoretirar,
        venda_imposto = arg_venda_impostoadicionar + arg_venda_impostoretirar,
        venda_impostoadicionar = arg_venda_impostoretirar,
        venda_impostoretirar = arg_venda_impostoretirar
    where venda_id = arg_venda_id
    returning * into _venda
  ;

--   raise exception '%', jsonb_build_object(
--     'venda_montantesemimposto',  _venda.venda_montantesemimposto,
--     'venda_montantecomimposto', _venda.venda_montantecomimposto,
--     'venda_imposto', _venda.venda_imposto,
--     'venda_impostoadicionar', _venda.venda_impostoadicionar,
--     'venda_impostoretirar', _venda.venda_impostoretirar
--   );


  return true ? jsonb_build_object(
    'venda', _venda
  );

end;
$$;


--
-- TOC entry 639 (class 1255 OID 23279)
-- Name: funct_report_caixa(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_caixa(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Relatorio sobre as caixa e posto de venda
    filter := {
      arg_data_registro: { start: DATE, end: DATE }
      arg_posto_id: ID,
      arg_colaborador_vendedor: ID,
      arg_espaco_venda: ID,
      arg_espaco_auth: ID

    }
  */

  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';

  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_espaco_venda uuid default filter->>'arg_espaco_venda';
  arg_caixa_estado uuid default filter->>'arg_caixa_estado';
  arg_colaborador_vendedor uuid default filter->>'arg_colaborador_vendedor';

  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin
  _const := map.constant();

  return query
    with report as (
      with caixa_amortizacao as (
        select
            am.amortizacao_caixa_id,
            count( am.amortizacao_id ) as caixa_totalcobrado,
            sum( am.amortizacao_montante ) as caixa_montantefaturado
          from tweeks.amortizacao am
          where am.amortizacao_estado = _const.amortizacao_estado_ativo
            and am.amortizacao_espaco_auth = any( arg_espaco_child )
          group by am.amortizacao_caixa_id

      ), caixa_conta as (
        select
            ct.conta_caixa_fechopagamento,
            count( ct.conta_id ) as caixa_contasaberta
          from tweeks.conta ct
          where ct.conta_estado in ( _const.conta_estado_pago, _const.conta_estado_fechado )
            and ct.conta_espaco_auth = any( arg_espaco_child )
          group by ct.conta_caixa_fechopagamento

      ), caixa_conta_fecho as (
        select ct.conta_caixa_fechopagamento,
            count( ct.conta_id ) as caixa_contafechada
          from tweeks.conta ct
          where ct.conta_estado in ( _const.conta_estado_pago, _const.conta_estado_fechado )
            and ct.conta_espaco_auth = any( arg_espaco_child )
          group by ct.conta_caixa_fechopagamento
      ) select
            cx.*,
            co.*,
            pos.*,
            esp.*,
            lib.str_nospace( to_char( cx.caixa_id, '"CX#"000-000' ) ) as caixa_codigo,

            format( '%s %s', co.colaborador_nome, co.colaborador_apelido ) as colaborador_nomecompleto,
            case when cx.caixa_estado = _const.caixa_estado_fechado then cx.caixa_dataatualizacao end as caixa_datafecho,
            cxa.caixa_totalcobrado as caixa_totalcobrado,
            coalesce( cxa.caixa_montantefaturado, 0 ) as caixa_montantefaturado,
            coalesce( cxc.caixa_contasaberta, 0 ) as caixa_contasaberta,
            coalesce( cxcf.caixa_contafechada, 0 ) as caixa_contafechada,
            case
              when cx.caixa_estado = _const.cambio_estado_ativo then 'Ativo'
              when cx.caixa_estado = _const.cambio_estado_fechado then 'Fechado'
            end as caixa_estadodesc
        from tweeks.caixa cx
          inner join auth.colaborador co on cx.caixa_colaborador_id = co.colaborador_id
          inner join tweeks.posto pos on cx.caixa_posto_id = pos.posto_id
          inner join tweeks.espaco esp on pos.posto_espaco_destino = esp.espaco_id
          left join caixa_amortizacao cxa on cx.caixa_id = cxa.amortizacao_caixa_id
          left join caixa_conta cxc on cx.caixa_id = cxc.conta_caixa_fechopagamento
          left join caixa_conta_fecho cxcf on cx.caixa_id = cxcf.conta_caixa_fechopagamento
        where cx.caixa_dataregistro::date between coalesce( arg_data_registro_start, cx.caixa_dataregistro::date ) and coalesce( arg_data_registro_end, cx.caixa_dataregistro::date )
          and cx.caixa_estado = coalesce( arg_caixa_estado, cx.caixa_estado )
          and pos.posto_id = coalesce( arg_posto_id, pos.posto_id )
          and esp.espaco_id = coalesce( arg_espaco_venda, esp.espaco_id )
          and cx.caixa_colaborador_id = coalesce( arg_colaborador_vendedor, cx.caixa_colaborador_id )
          and cx.caixa_espaco_auth = any( arg_espaco_child )
        order by cx.caixa_estado desc,
          cx.caixa_dataregistro desc
    ) select
          lib.jsonb_values( to_jsonb( r ),
            'caixa_id',
            'caixa_codigo',
            'caixa_montanteinicial',
            'caixa_montantefecho',
            'caixa_quantidadecheque',
            'caixa_observacao',
            'caixa_dataregistro',
            'posto_designacao',
            'espaco_nome',
            'posto_designacao',
            'espaco_descricao',
            'colaborador_nomecompleto',
            'caixa_datafecho',
            'caixa_totalcobrado',
            'caixa_montantefaturado',
            'caixa_contasaberta',
            'caixa_contafechada',
            'caixa_estadodesc',
            'colaborador_nome'
          )
      from report r;
end;
$$;


--
-- TOC entry 640 (class 1255 OID 23280)
-- Name: funct_report_compra_entrada(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_compra_entrada(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para processar o relatório de compras (entradas)
    arg_data_operacao :{ start: date, end :date },
    arg_data_registro :{ start: date, end :date },
    arg_espaco_id: ID,
    arg_classe_id: ID,
    arg_fornecedor_id: ID,
    arg_artigo_id: ID,
   */
  arg_data_operacao_start date default filter ->'arg_data_operacao'->>'start';
  arg_data_operacao_end date default filter ->'arg_data_operacao'->>'end';

  arg_data_registro_start date default filter ->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter ->'arg_data_registro'->>'end';

  arg_espaco_id uuid default filter ->>'arg_espaco_id';
  arg_classe_id uuid default filter ->>'arg_classe_id';
  arg_fornecedor_id uuid default filter ->>'arg_fornecedor_id';
  arg_artigo_id uuid default filter ->>'arg_artigo_id';

  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

begin
  return query
    with report as (

    select
          art.*,
          ent.*,
          fo.*,
          esp.*,
          col.*
        from tweeks.entrada ent
          inner join tweeks.artigo art on ent.entrada_artigo_id = art.artigo_id
          inner join tweeks.fornecedor fo on ent.entrada_fornecedor_id = fo.fornecedor_id
          inner join tweeks.espaco esp on ent.entrada_espaco_destino = esp.espaco_id
          inner join auth.colaborador col on ent.entrada_colaborador_id = col.colaborador_id
        where ent.entrada_data between coalesce( arg_data_operacao_start, ent.entrada_data ) and coalesce( arg_data_operacao_end, ent.entrada_data )
          and ent.entrada_dataregistro between coalesce( arg_data_registro_start, ent.entrada_dataregistro ) and coalesce( arg_data_registro_end, ent.entrada_dataregistro )
          and esp.espaco_id = coalesce( arg_espaco_id, esp.espaco_id )
          and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
          and fo.fornecedor_id = coalesce( arg_fornecedor_id, fo.fornecedor_id )
          and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
          and ent.entrada_espaco_auth = any( arg_espaco_child )
    )
    select
      lib.jsonb_values(
        to_jsonb( r ),
          'artigo_id',
          'artigo_codigo',
          'artigo_nome',
          'artigo_custo',
          'artigo_stock',
          'artigo_preparacao',

          'entrada_id',
          'entrada_codigofatura',
          'entrada_data',
          'entrada_quantidade',
          'entrada_montante',
          'entrada_descricao',
          'entrada_estado',
          'entrada_dataregistro',

          'colaborador_nome',
          'colaborador_apelido',

          'fornecedor_id',
          'fornecedor_nif',
          'fornecedor_nome',

          'espaco_nome'
        )
      from report r
  ;
end;
$$;


--
-- TOC entry 641 (class 1255 OID 23281)
-- Name: funct_report_estatistica_posto(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_estatistica_posto(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função devolve os relatorio do posto todos
    -- columns
      Data,
      Posta,
      Espaço,
      Caixa,
      Montante, -- Montante geradao
      Pagos,    -- Montante pago
      Contas    -- Total de contas abertas


    filter := {
      arg_data_registro: { start: DATE, end: DATE }
      arg_posto_id: ID,
      arg_colaborador_vendedor: ID,
      arg_espaco_venda: ID,
      arg_periodo_required:  { "key": "dd-mm-yyyy", "label": "dd", "title": "dia dd 'de' Mon 'de' YYYY", "interval": INTERVAL }



    }
  */

  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';

  arg_periodo_required_key character varying := filter->'arg_periodo_required'->>'key';
  arg_periodo_required_label character varying := filter->'arg_periodo_required'->>'label';
  arg_periodo_required_title character varying := filter->'arg_periodo_required'->>'title';
  arg_periodo_required_interval interval not null := filter->'arg_periodo_required'->>'interval';


  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_espaco_venda uuid default filter->>'arg_espaco_venda';
  arg_colaborador_vendedor uuid default filter->>'arg_colaborador_vendedor';

  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  _data record;
  _const map.constant;

begin

  select min( cx.caixa_dataregistro::date ) as absolut_start, max( cx.caixa_dataregistro::date) as max_date    into _data
    from tweeks.caixa cx
  ;

  if arg_data_registro_start is not null and arg_data_registro_start > _data.absolut_start then
    _data.absolut_start := arg_data_registro_start;
  end if;

  if _data.absolut_start > current_date then
    _data.absolut_start := current_date;
  end if;

  _data.max_date := current_date;
  if arg_data_registro_end is not null and arg_data_registro_end < current_date and arg_data_registro_end >= _data.absolut_start then
    _data.max_date := arg_data_registro_end;
  end if;


  _const := map.constant();
  return query
      with recursive dates( data ) as (
          values ( _data.absolut_start )
        union all
          select d.data + arg_periodo_required_interval
            from dates d
            where d.data + arg_periodo_required_interval <= _data.max_date
      )
      select lib.jsonb_values( to_jsonb( pos ) || to_jsonb( cx )|| to_jsonb( co ) || to_jsonb( pos ),
        'caixa_id',
        'caixa_montanteinicial',
        'caixa_montantefecho',
        'caixa_quantidadecheque',
        'caixa_observacao',
        'caixa_dataregistro',
        'posto_designacao',
        'espaco_nome',
        'posto_designacao',
        'espaco_descricao',
        'colaborador_nome'
      ) || jsonb_build_object(
        'colaborador_nomecompleto', format( '%s %s', co.colaborador_nome, co.colaborador_apelido ),
        'caixa_datafecho', case when cx.caixa_estado = _const.caixa_estado_fechado then cx.caixa_dataatualizacao end,
        'caixa_totalcobrado', cxa.caixa_totalcobrado,
        'caixa_montantepagamento', coalesce( cxa.caixa_montantepagamento, 0 ),
        'caixa_contasaberta', coalesce( cxc.caixa_contasaberta, 0 ),
        'caixa_contafechada', coalesce( cxcf.caixa_contafechada, 0 ),
        'caixa_estado', case
            when cx.caixa_estado = _const.cambio_estado_ativo then 'Ativo'
            when cx.caixa_estado = _const.cambio_estado_fechado then 'Fechado'
          end
      )
      from dates dt
        inner join tweeks.posto post on true
          and post.posto_espaco_destino = any( arg_espaco_child )
        left join tweeks.caixa cx on post.posto_id = cx.caixa_posto_id
          and cx.caixa_espaco_auth = any( arg_espaco_child )
        left join tweeks.amortizacao amort on cx.caixa_id = amort.amortizacao_caixa_id
          and amort.amortizacao_espaco_auth = any( arg_espaco_child )
        left join tweeks.conta ct on cx.caixa_id = ct.conta_caixa_id
          and ct.conta_espaco_auth = any( arg_espaco_child )
        left join tweeks.conta ctclose on cx.caixa_id = ct.conta_caixa_fechopagamento
          and ct.conta_espaco_auth = any( arg_espaco_child )
    ;
end;
$$;


--
-- TOC entry 642 (class 1255 OID 23282)
-- Name: funct_report_estatistica_venda(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_estatistica_venda(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse relatório gera a estatistica de venda
    filter := {
      arg_periodo_required: { "key": KEY, "label": NAME, "title": TITLE },
      arg_estatistica_tipo: { "key": KEY, "title": TITLE, "class": CLASSE }
      arg_data_operacao: { start: DATE, end: DATE },
      arg_data_registro: { start: DATE, end: DATE },
      arg_artigo_id: ID,
      arg_classe_id: ID,
      arg_show_empty: 1 | 0
      arg_periodos: PERIODO
   */

  arg_periodo_requiere_key character varying not null default filter ->'arg_periodo_required'->>'key';
  arg_periodo_requiere_label character varying not null default filter ->'arg_periodo_required'->>'label';
  arg_periodo_requiere_title character varying not null default filter ->'arg_periodo_required'->>'title';
  arg_periodo_requiere_interval interval not null default filter ->'arg_periodo_required'->>'interval';
  arg_periodo_requiere_increment interval not null default filter ->'arg_periodo_required'->>'increment';
  arg_periodo_requiere_length text not null default filter ->'arg_periodo_required'->>'length';
  arg_periodo_requiere_loop integer not null default filter ->'arg_periodo_required'->>'loop';
  arg_periodo_requiere_type text not null default filter ->'arg_periodo_required'->>'type';

  arg_estatistica_tipo_key character varying not null default filter ->'arg_estatistica_tipo'->>'key';
  arg_estatistica_tipo_title character varying not null default filter ->'arg_estatistica_tipo'->>'title';
  arg_estatistica_tipo_class character varying not null default filter ->'arg_estatistica_tipo'->>'class';

  arg_data_registro_start date default filter ->'arg_data_registro'->>'start';
  arg_data_registro_end date default   filter ->'arg_data_registro'->>'end';

  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_classe_id uuid default filter->>'arg_classe_id';
  arg_periodos int2 default filter->>'arg_periodos';
  arg_show_empty boolean default filter->>'arg_show_empty';

  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  _const map.constant;
begin
  _const := map.constant();

  -- Garantir que a data não ultrapassa o limite de tempo para o periodo
  -- Pirodo Diario 30 dias = 1 mes

  if  arg_estatistica_tipo_class = 'Money' then
    arg_periodo_requiere_loop := 8;
  end if;

  -- Periodo Mensal 365 dias = 12 meses = 1 ano
  if arg_data_registro_end::timestamptz - arg_data_registro_start::timestamptz >= arg_periodo_requiere_interval then
    return;
  end if;


  arg_show_empty := coalesce( arg_show_empty, true );
  arg_periodos := coalesce( arg_periodos, arg_periodo_requiere_loop );

  -- Determinar a data limite inferior
  if arg_data_registro_start is null and arg_data_registro_end is null then
    arg_data_registro_start := current_date - ( arg_periodo_requiere_increment * arg_periodos );
  elseif  arg_data_registro_start is null then
    arg_data_registro_start := arg_data_registro_end - ( arg_periodo_requiere_increment * ( arg_periodos ) );
  end if;

  -- Determinar a data limit superior
  if arg_data_registro_end is null then
    arg_data_registro_end := arg_data_registro_start + ( arg_periodo_requiere_increment * ( arg_periodos ) );
  end if;

  --   raise exception 'start: %, end: %', arg_data_registro_start, arg_data_registro_end;



  return query
    with recursive periode ( date, loop ) as (
      values ( arg_data_registro_start, 1 )
      union all
      select ( p.date + arg_periodo_requiere_increment )::date, p.loop +1
      from periode p
      where p.date < arg_data_registro_end
    ), reporte as (
      select
        to_char( p2.date, arg_periodo_requiere_key ) as key,
        to_char( p2.date, arg_periodo_requiere_label ) as label,
        to_char( p2.date, arg_periodo_requiere_title ) as period_title,
        art.*,
        coalesce( count( distinct ct.conta_id ), 0 ) as conta_quantidade,
        coalesce( count( distinct ve.venda_id ), 0 ) as venda_totalvenda,
        coalesce( sum( ve.venda_quantidade ), 0 ) as venda_quantidade,
        coalesce( sum( ve.venda_montantetotal ), 0 ) as venda_montante
      from periode p2
        left join tweeks.conta ct on to_char( p2.date, arg_periodo_requiere_key ) = to_char( ct.conta_dataregistro, arg_periodo_requiere_key )
          and ct.conta_estado =  _const.conta_estado_pago
          and ct.conta_espaco_auth = any( arg_espaco_child )
        left join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve.venda_estado =  _const.venda_estado_fechado
          and ve.venda_espaco_auth = any( arg_espaco_child )
        left join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
          and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
          and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
        left join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id
          and cx.caixa_posto_id = coalesce( arg_posto_id, cx.caixa_posto_id )
          and cx.caixa_espaco_auth = any( arg_espaco_child )
      group by art.artigo_id,
        p2.date
      having arg_show_empty or count( ve.venda_id ) > 0
    )
      select
        jsonb_build_object(
        'header', array(
          select
            jsonb_build_object(
              'key', p.key,
              'label', p.label,
              'class', arg_estatistica_tipo_class,
              'length', arg_periodo_requiere_length,
              'title', format( '%s em %s', arg_estatistica_tipo_title, p.period_title ),
              'sumRow', true
            )
            from reporte p
            group by p.key, p.label, p.period_title
            order by p.key asc
        ) || array [
          jsonb_build_object( 'key', 'sum', 'label', 'SUN', 'class', arg_estatistica_tipo_class, 'title', 'Somatorio', 'sumRow', true, 'length', 'normal' )
        ]
      )
    union all
      select jsonb_build_object(
          'artigo_id', p.artigo_id,
          'artigo_nome', p.artigo_nome,
          'artigo_codigo', p.artigo_codigo,
          'artigo_montantetotalvendido', sum( p.venda_montante ),
          'artigo_quantidadetotalvendida', sum( p.venda_quantidade ),
          'sum', sum( ( to_jsonb( p ) ->> ( arg_estatistica_tipo_key ) ) ::double precision ),
          'avg', avg( ( to_jsonb( p ) ->> ( arg_estatistica_tipo_key ) ) ::double precision )
        ) || jsonb_object_agg( p.key, to_jsonb( p ) ->> ( arg_estatistica_tipo_key ) )
        from reporte p
        where p.artigo_id is not null
        group by
          p.artigo_id,
          p.artigo_codigo,
          p.artigo_nome
  ;
end;
$$;


--
-- TOC entry 643 (class 1255 OID 23284)
-- Name: funct_report_stock_movimentos(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE or replace FUNCTION tweeks.funct_report_stock_movimentos(filter jsonb DEFAULT NULL::jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Esse relatorio apresenta as movimentações em stock
    filters := {
      arg_data_operacao: {start: date, end: date }
      arg_data_registro: {start: date, end: date }
      arg_tmovimento_id: ID,
      arg_toperacao_stock: ID
      arg_artigo_id: ID
    }
  */

  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';
  arg_data_operacao_start date default filter->'arg_data_registro'->>'start';
  arg_data_operacao_end date default filter->'arg_data_registro'->>'end';

  arg_tmovimento_id int2 default filter->>'arg_tmovimento_id';
  arg_toperacao_stock int2 default filter->>'arg_toperacao_stock';
  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_classe_id uuid default filter->>'arg_classe_id';

  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  arg_columns text[] default array[
      'movimento_id',
      'movimento_data',
      'movimento_documento',
      'movimento_quantidade',
      'movimento_quantidadeinicia',
      'movimento_quantidadefinal',
      'movimento_dataregistro',
      'artigo_nome',
      'artigo_codigo',
      'espaco_nome',
      'colaborador_nome',
      'stock_quantidade',
      'artigo_stock',
      'tmovimento_designacao',
      'toperacao_designacao'
    ];

  _const map.constant;
begin
  _const := map.constant();
  return query
    with report as (
      select
        mv.*,
        tm.*,
        a.*,
        e.*,
        col.*,
        top.*,
        format( '%s %s', col.colaborador_nome, col.colaborador_apelido ) as colaborador_nomecompleto
      from tweeks.movimento mv
        inner join tweeks.stock s on mv.movimento_stock_id = s.stock_id
        inner join tweeks.artigo a on s.stock_artigo_id = a.artigo_id
        inner join tweeks.espaco e on s.stock_espacao_id = e.espaco_id
        inner join auth.colaborador col on mv.movimento_colaborador_id = col.colaborador_id
        inner join tweeks.toperacao top on mv.movimento_toperacao_id = top.toperacao_id
        inner join tweeks.tmovimento tm on mv.movimento_tmovimento_id = tm.tmovimento_id
      where mv.movimento_estado != _const.movimento_estado_canselado
        and tm.tmovimento_id = coalesce( arg_tmovimento_id, tm.tmovimento_id )
        and mv.movimento_toperacao_id = coalesce( arg_toperacao_stock, mv.movimento_toperacao_id )
        and mv.movimento_data between coalesce( arg_data_operacao_start, mv.movimento_data ) and coalesce( arg_data_operacao_end, mv.movimento_data )
        and mv.movimento_dataregistro::date between coalesce( arg_data_registro_start, mv.movimento_dataregistro::date ) and coalesce( arg_data_registro_end, mv.movimento_dataregistro::date )
        and a.artigo_id = coalesce( arg_artigo_id, a.artigo_id )
        and a.artigo_classe_id = coalesce( arg_classe_id, a.artigo_classe_id )
        and mv.movimento_espaco_auth = any( arg_espaco_child )
      order by mv.movimento_dataregistro desc
    )
    select lib.jsonb_values( rp , variadic arg_columns )
    from report rp
  ;
end;
$$;


--
-- TOC entry 644 (class 1255 OID 23285)
-- Name: funct_report_transacao(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_transacao( filter jsonb ) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Essa função serve para devolver dados para relatório de transação
    filter := {
      arg_data_registro: { start: DATE, end: DATE },
      arg_posto_id: ID,
      arg_tmovimento_id: ID,
      arg_toperacao_montante: ID,
      arg_colaborador_id: ID,
      arg_transacao_zerar: ID,
    }
   */
  _const map.constant;
  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';

  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_colaborador_id uuid default filter->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  arg_tmovimento_id int2 default filter->>'arg_tmovimento_id';
  arg_toperacao_montante int2 default filter->>'arg_toperacao_montante';
  arg_transacao_zerar boolean default filter->>'arg_transacao_zerar';
  arg_documento character varying default filter->>'arg_documento';


begin

  _const := map.constant();

  return query
    with report as (
      select *,
        case
          when trans.transacao_zerar then 'Zerado'
          else 'Lançado'
          end as transacao_zerardesignacao,
        lib.str_normalize( format( '%s %s', col.colaborador_nome, col.colaborador_apelido ) ) as colaborador_nomecompleto,
        case when t.tmovimento_id = _const.tmovimento_credito then trans.transacao_montante end as transacao_montantecredito,
        case when t.tmovimento_id = _const.tmovimento_debito then trans.transacao_montante end as transacao_montantedebito
      from tweeks.transacao trans
             inner join tweeks.posto pos on trans.transacao_posto_id = pos.posto_id
             inner join tweeks.tmovimento t on trans.transacao_tmovimento_id = t.tmovimento_id
             inner join tweeks.toperacao top on trans.transacao_toperacao_id = top.toperacao_id
             inner join auth.colaborador col on trans.transacao_colaborador_id = col.colaborador_id
      where trans.transacao_dataregistro::date between coalesce( arg_data_registro_start,  trans.transacao_dataregistro::date ) and coalesce( arg_data_registro_end,  trans.transacao_dataregistro::date )
        and pos.posto_id = coalesce( arg_posto_id, pos.posto_id )
        and t.tmovimento_id = coalesce( arg_tmovimento_id, t.tmovimento_id )
        and top.toperacao_id = coalesce( arg_toperacao_montante, top.toperacao_id )
        and trans.transacao_zerar = coalesce( arg_transacao_zerar, trans.transacao_zerar )
        and col.colaborador_id = coalesce( arg_colaborador_id, col.colaborador_id )
        and lower( public.unaccent( trans.transacao_documento ) ) like '%'||lower( public.unaccent( coalesce( arg_documento, trans.transacao_documento) ) )||'%'
        and trans.transacao_espaco_auth = any( arg_espaco_child )
      order by trans.transacao_dataregistro asc
    ) select
      lib.jsonb_values( to_jsonb( r ) ,
        'transacao_documento',
        'transacao_zerardesignacao',
        'transacao_montante',
        'transacao_montantecredito',
        'transacao_montantedebito',
        'transacao_montanteinicial',
        'transacao_montantefinal',
        'transacao_observacao',
        'transacao_dataregistro',
        'posto_designacao',
        'tmovimento_designacao',
        'toperacao_designacao',
        'colaborador_nome',
        'colaborador_apelido',
        'colaborador_nomecompleto'
      ) from report r;
end;
$$;


--
-- TOC entry 645 (class 1255 OID 23286)
-- Name: funct_report_venda(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_venda(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
    /** Relatorio de vendas
      filter := {
        arg_data_operacao:{ start: DATE, end: DATE },
        arg_data_registro:{ start: DATE, end: DATE },
        arg_artigo_id: ID
        arg_posto_id: ID,
        arg_colaborador_vendedor: ID,
        arg_currency_pagamento: ID,
        arg_colaborador_vendedor: ID,
        arg_tpaga_id: ID,
        arg_classe_id: ID,
        arg _conta_fatura: FATURA,
      }
     */

    arg_data_operacao_start date default filter->'arg_data_operacao'->>'start';
    arg_data_operacao_end date default filter->'arg_data_operacao'->>'end';

    arg_data_registro_start date default filter->'arg_data_registro'->>'start';
    arg_data_registro_end date default filter->'arg_data_registro'->>'end';

    arg_artigo_id uuid default filter->>'arg_artigo_id';
    arg_posto_id uuid default filter->>'arg_posto_id';
    arg_colaborador_vendedor uuid default filter->>'arg_colaborador_vendedor';
    arg_classe_id uuid default filter->>'arg_classe_id';

    arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
    arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

    arg_currency_pagamento int2 default filter->>'arg_currency_pagamento';
    arg_tpaga_id int2 default filter->>'arg_tpaga_id';
    arg_conta_montante_start double precision default filter->'arg_conta_montante'->>'start';
    arg_conta_montante_end double precision default filter->'arg_conta_montante'->>'end';
    arg_conta_fatura character varying default filter->>'arg_conta_fatura';

    _const map.constant;

begin
    _const := map.constant();

    return query
        with report as (
            select ve.*,
                   art.*,
                   ct.*,
                   col.*,
                   trim( format( '%s %s', col.colaborador_nome, col.colaborador_apelido ) ) as colaborador_nomecompleto,
                   string_agg( it.artigo_nome, ', ' ) as venda_itens
            from tweeks.venda ve
                     inner join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id
                     inner join tweeks.conta ct on ve.venda_conta_id = ct.conta_id
                     inner join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id
                     inner join auth.colaborador col on coalesce ( ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = col.colaborador_id
                     left join tweeks.agrega agg on ve.venda_id = agg.agrega_venda_id
                      and agg.agrega_estado = _const.agrega_estado_fechado
                    left join tweeks.artigo it on agg.agrega_artigo_item = it.artigo_id

            where ct.conta_estado = _const.conta_estado_pago
              and ve.venda_estado = _const.venda_estado_fechado
              and ct.conta_data between coalesce( arg_data_operacao_start, ct.conta_data ) and coalesce( arg_data_operacao_end, ct.conta_data )
              and ct.conta_dataregistro::date between coalesce( arg_data_registro_start, ct.conta_dataregistro::date ) and coalesce( arg_data_registro_end, ct.conta_dataregistro::date )
              and cx.caixa_posto_id = coalesce( arg_posto_id, cx.caixa_posto_id )
              and coalesce( ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = coalesce( arg_colaborador_vendedor, ct.conta_colaborador_atualizacao, ct.conta_colaborador_id )
              and ct.conta_currency_id = coalesce( arg_currency_pagamento, ct.conta_currency_id )
              and ct.conta_tpaga_id = coalesce( arg_tpaga_id, ct.conta_tpaga_id )
              and ct.conta_montante between  coalesce( arg_conta_montante_start, ct.conta_montante ) and coalesce( arg_conta_montante_end, ct.conta_montante )
              and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
              and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
              and lower( ct.conta_numerofatura ) like '%' ||lower( coalesce( arg_conta_fatura, ct.conta_numerofatura ) ) ||'%'
              and ct.conta_espaco_auth = any( arg_espaco_child )
            group by
                art.artigo_id,
                ct.conta_id,
                ve.venda_id,
                col.colaborador_id
        ) select lib.jsonb_values( r,
            'venda_id',
            'venda_quantidade',
            'venda_montente',
            'venda_montanteagregado',
            'venda_montantetotal',
            'venda_custounitario',
            'venda_imposto',
            'venda_montantecomimposto',

            'artigo_nome',
            'artigo_codigo',

            'conta_numerofatura',
            'conta_titular',
            'conta_montante',
            'conta_data',

            'conta_dataregistro',
            'colaborador_nome',
            'colaborador_nomecompleto',
            'venda_itens'
         )
        from report r
    ;
end;
$$;


--
-- TOC entry 646 (class 1255 OID 23287)
-- Name: funct_report_venda_artigo(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_venda_artigo(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Relatorio de vendas
    filter := {
      arg_data_operacao:{ start: DATE, end: DATE },
      arg_data_registro:{ start: DATE, end: DATE },
      arg_artigo_id: ID
      arg_posto_id: ID,
      arg_colaborador_vendedor: ID,
      arg_currency_pagamento: ID,
      arg_colaborador_vendedor: ID,
      arg_tpaga_id: ID,
      arg_classe_id: ID,
      arg _conta_fatura: FATURA,
    }
   */

  arg_data_operacao_start date default filter->'arg_data_operacao'->>'start';
  arg_data_operacao_end date default filter->'arg_data_operacao'->>'end';

  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';

  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_colaborador_vendedor uuid default filter->>'arg_colaborador_vendedor';
  arg_classe_id uuid default filter->>'arg_classe_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  arg_currency_pagamento int2 default filter->>'arg_currency_pagamento';
  arg_tpaga_id int2 default filter->>'arg_tpaga_id';
  arg_conta_montante_start double precision default filter->'arg_conta_montante'->>'start';
  arg_conta_montante_end double precision default filter->'arg_conta_montante'->>'end';
  arg_conta_fatura character varying default filter->>'arg_conta_fatura';


  _const map.constant;

begin
  _const := map.constant();

  return query
    with __vendas ( venda_id, venda_conta_id, venda_artigo_id, venda_quantidade, venda_custounitario, venda_montente, venda_dataregistro, venda_modalidade, venda_tmodalidade, venda_gmodalidade  ) as (
      select v.venda_id, v.venda_conta_id, v.venda_artigo_id, v.venda_quantidade, v.venda_custounitario, v.venda_montente, v.venda_dataregistro, 'Venda directa'::text, 1, 1
        from tweeks.venda v
        where v.venda_estado = _const.venda_estado_fechado
    union all
      select ag.agrega_id, ve.venda_conta_id, ag.agrega_artigo_item, ag.agrega_quantidade, ag.agrega_custounitario, ag.agrega_montante, ag.agrega_dataregistro, 'Item Extras'::text, case when ag.agrega_montante > 0 then 2 else  3 end, 2
        from tweeks.agrega ag
          inner join tweeks.venda ve on ag.agrega_venda_id = ve.venda_id
        where ag.agrega_estado = _const.agrega_estado_fechado
          and ve.venda_estado = _const.venda_estado_fechado
    ), report as (
      select art.*,
         _v.venda_custounitario as venda_custounitario,
         sum( _v.venda_quantidade ) as venda_quantidade,
         sum( _v.venda_montente ) as venda_montente,
        _v.venda_modalidade as  venda_modalidade
      from tweeks.artigo art
        inner join __vendas _v on art.artigo_id = _v.venda_artigo_id
        inner join tweeks.conta ct on _v.venda_conta_id = ct.conta_id
        inner join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id

      where ct.conta_estado = _const.conta_estado_pago
        and ct.conta_data between coalesce( arg_data_operacao_start, ct.conta_data ) and coalesce( arg_data_operacao_end, ct.conta_data )
        and ct.conta_dataregistro::date between coalesce( arg_data_registro_start, ct.conta_dataregistro::date ) and coalesce( arg_data_registro_end, ct.conta_dataregistro::date )
        and cx.caixa_posto_id = coalesce( arg_posto_id, cx.caixa_posto_id )
        and coalesce( ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = coalesce( arg_colaborador_vendedor, ct.conta_colaborador_atualizacao, ct.conta_colaborador_id )
        and ct.conta_currency_id = coalesce( arg_currency_pagamento, ct.conta_currency_id )
        and ct.conta_tpaga_id = coalesce( arg_tpaga_id, ct.conta_tpaga_id )
        and ct.conta_montante between  coalesce( arg_conta_montante_start, ct.conta_montante ) and coalesce( arg_conta_montante_end, ct.conta_montante )
        and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
        and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and lower( ct.conta_numerofatura ) like '%' ||lower( coalesce( arg_conta_fatura, ct.conta_numerofatura ) ) ||'%'
        and ct.conta_espaco_auth = any( arg_espaco_child )
      group by
        art.artigo_id,
        _v.venda_custounitario,
        _v.venda_modalidade,
        _v.venda_tmodalidade,
        _v.venda_gmodalidade
      order by art.artigo_nome asc,
         _v.venda_modalidade
    ) select lib.jsonb_values( r,
        'artigo_codigo',
        'artigo_nome',
        'venda_quantidade',
        'venda_custounitario',
        'venda_montente',
        'venda_modalidade',
        'venda_tmodalidade',
        'venda_gmodalidade'
      )
    from report r
  ;
end;
$$;


--
-- TOC entry 647 (class 1255 OID 23288)
-- Name: funct_report_venda_conta(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_report_venda_conta(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
    AS $$
declare
  /** Relatorio de vendas
    filter := {
      arg_data_operacao:{ start: DATE, end: DATE },
      arg_data_registro:{ start: DATE, end: DATE },
      arg_artigo_id: ID
      arg_posto_id: ID,
      arg_colaborador_vendedor: ID,
      arg_currency_pagamento: ID,
      arg_colaborador_vendedor: ID,
      arg_tpaga_id: ID,
      arg_classe_id: ID,
      arg_conta_montante: {start: START, end: END },
      arg_conta_fatura: FATURA
    }
   */

  arg_data_operacao_start date default filter->'arg_data_operacao'->>'start';
  arg_data_operacao_end date default filter->'arg_data_operacao'->>'end';

  arg_data_registro_start date default filter->'arg_data_registro'->>'start';
  arg_data_registro_end date default filter->'arg_data_registro'->>'end';

  arg_artigo_id uuid default filter->>'arg_artigo_id';
  arg_posto_id uuid default filter->>'arg_posto_id';
  arg_colaborador_vendedor uuid default filter->>'arg_colaborador_vendedor';
  arg_classe_id uuid default filter->>'arg_classe_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';
  arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );

  arg_currency_pagamento int2 default filter->>'arg_currency_pagamento';
  arg_tpaga_id int2 default filter->>'arg_tpaga_id';

  arg_conta_montante_start double precision default filter->'arg_conta_montante'->>'start';
  arg_conta_montante_end double precision default filter->'arg_conta_montante'->>'end';
  arg_conta_fatura character varying default filter->>'arg_conta_fatura';


  _const map.constant;

begin
  _const := map.constant();

  return query
    with report as (
      select
        ct.*,
        cx.*,
        pos.*,
        col.*,
        cu.*,
        tp.*,
        trim( format( '%s %s', col.colaborador_nome, col.colaborador_apelido ) ) as colaborador_nomecompleto,
        sum( ve.venda_montanteagregado ) as venda_montanteagregado,
        sum( ve.venda_montente ) as venda_montente,
        sum( ve.venda_montantetotal ) as venda_montantetotal,
        string_agg( distinct art.artigo_nome, ', ' ) as venta_artigos

      from tweeks.conta ct
        inner join tweeks.caixa cx on ct.conta_caixa_fechopagamento = cx.caixa_id
        inner join tweeks.posto pos on cx.caixa_posto_id = pos.posto_id
        inner join auth.colaborador col on ct.conta_colaborador_id = col.colaborador_id
        left join tweeks.tpaga tp on ct.conta_tpaga_id = tp.tpaga_id
        left join geoinfo.currency cu on ct.conta_currency_id = cu.currency_id
        left join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve.venda_estado in ( _const.venda_estado_fechado )
        left join tweeks.artigo art on ve.venda_artigo_id = art.artigo_id

      where ct.conta_estado in ( _const.conta_estado_pago, _const.conta_estado_fechado )
        and art.artigo_id = coalesce( arg_artigo_id, art.artigo_id )
        and art.artigo_classe_id = coalesce( arg_classe_id, art.artigo_classe_id )
        and ct.conta_data between coalesce( arg_data_operacao_start, ct.conta_data ) and coalesce( arg_data_operacao_end, ct.conta_data )
        and ct.conta_dataregistro::date between coalesce( arg_data_registro_start, ct.conta_dataregistro::date ) and coalesce( arg_data_registro_end, ct.conta_dataregistro::date )
        and cx.caixa_posto_id = coalesce( arg_posto_id, cx.caixa_posto_id )
        and cx.caixa_colaborador_id = coalesce( arg_colaborador_vendedor, cx.caixa_colaborador_id )
        and ct.conta_currency_id = coalesce( arg_currency_pagamento, ct.conta_currency_id )
        and ct.conta_tpaga_id = coalesce( arg_tpaga_id, ct.conta_tpaga_id )
        and ve.venda_montente between coalesce( arg_conta_montante_start, ve.venda_montente ) and coalesce( arg_conta_montante_end, ve.venda_montente )
        and lower( ct.conta_numerofatura ) like '%' || lower( coalesce( arg_conta_fatura, ct.conta_numerofatura ) ) || '%'
        and ct.conta_espaco_auth = any( arg_espaco_child )
      group by
        ct.conta_id,
        cx.caixa_id,
        pos.posto_id,
        col.colaborador_id,
        cu.currency_id,
        tp.tpaga_id
    )
    select jsonb_build_object(
               'header', array(
            select jsonb_build_object(
                       'key', r.currency_code,
                       'label', r.currency_code,
                       'class', 'Money',
                       'key', r.currency_code,
                       'sumRow', true
                     )
            from report r
            group by r.currency_code,
                     r.currency_name
          )
             )
    union all
    select
        lib.jsonb_values(
            to_jsonb( rp ),
            'conta_id',
            'conta_numerofatura',
            'conta_titular',
            'conta_data',
            'conta_montante',
            'conta_montanteamortizado',
            'conta_montantetroco',
            'conta_imprensa',
            'conta_dataregistro',
            'posto_id',
            'posto_designacao',
            'colaborador_nome',
            'caixa_id',
            'currency_code',
            'currency_code',
            'tpaga_designacao',
            'colaborador_nomecompleto',
            'venda_montanteagregado',
            'venda_montente',
            'venda_montantetotal',
            'venta_artigos'
          ) || jsonb_build_object (
            rp.currency_code, rp.conta_montantemoeda
          )
    from report rp
  ;
end;
$$;


--
-- TOC entry 648 (class 1255 OID 23289)
-- Name: funct_update_classe(jsonb); Type: FUNCTION; Schema: tweeks; Owner: -
--

CREATE FUNCTION tweeks.funct_update_classe(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
    /**
      Essa função cria uma nova classe
      args {
        arg_classe_id: ID
        arg_colaborador_id: ID
        arg_classe_nome: NOME
        arg_classe_foto: FOTO
      }
     */
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_classe_id uuid not null default args->>'arg_classe_id';

    arg_classe_nome character varying not null default lib.str_normalize( args->>'arg_classe_nome' );
    arg_classe_foto varchar default lib.str_normalize( args->>'arg_classe_foto' );

    _classe tweeks.classe;

begin
    if arg_colaborador_id isnull then
        return lib.result_false( '@Colaborador is null' );
    end if;
    if arg_classe_id isnull then
        return lib.result_false( '@Classe is null' );
    end if;

    if exists(select 1 from tweeks.classe cla
                where public.unaccent( lower( lib.str_normalize( cla.classe_nome ) ) ) = public.unaccent( lower( lib.str_normalize( arg_classe_nome ) ) )
                and cla.classe_id != arg_classe_id) then
        return lib.result_false( '@Categoria exists' );
    end if;

    update tweeks.classe
    set
        classe_nome = upper( coalesce( arg_classe_nome, classe_nome ) ),
        classe_foto =
            case
                when arg_classe_foto isnull then classe_foto
                else coalesce( arg_classe_foto, classe_foto )
            end,
        classe_colaborador_atualizacao = coalesce( arg_colaborador_id, classe_colaborador_atualizacao ),
        classe_dataatualizacao = current_timestamp
    where classe_id = arg_classe_id
    returning * into _classe;

    return true ? jsonb_build_object(
        'classe', _classe
        );

    exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end;
$$;



--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-05-30 12:55:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- TOC entry 1401 (class 1255 OID 23290)
-- Name: first(anyelement); Type: AGGREGATE; Schema: lib; Owner: -
--

CREATE AGGREGATE lib.first(anyelement) (
    SFUNC = lib.agg_first,
    STYPE = anyelement
);


--
-- TOC entry 1402 (class 1255 OID 23291)
-- Name: last(anyelement); Type: AGGREGATE; Schema: lib; Owner: -
--

CREATE AGGREGATE lib.last(anyelement) (
    SFUNC = lib.agg_last,
    STYPE = anyelement
);


--
-- TOC entry 230 (class 1259 OID 23302)
-- Name: acesso; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.acesso (
    acesso_id uuid NOT NULL default public.uuid_generate_v4(),
    acesso_menu_id smallint NOT NULL,
    acesso_colaborador_propetario uuid NOT NULL,
    acesso_colaborador_id uuid NOT NULL,
    acesso_colaborador_atualizacao uuid DEFAULT NULL,
    acesso_estado smallint DEFAULT (map.get('acesso_estado_ativo'::name))::smallint NOT NULL,
    acesso_dataregisto timestamptz DEFAULT now() NOT NULL,
    acesso_dataatualizacao timestamptz
);


--
-- TOC entry 4636 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE acesso; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.acesso IS 'Essa entidade serve para armazenar os acessos dos colaboradores a um dado menu';


--
-- TOC entry 4637 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_id IS 'Identificador do acesso do colaborador';


--
-- TOC entry 4638 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_menu_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_menu_id IS 'Identificacão do menu a qual o acesso remete';


--
-- TOC entry 4639 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_colaborador_propetario; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_colaborador_propetario IS 'Indenticação do colaborador a quel é o propetario do refererido acesso';


--
-- TOC entry 4640 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_colaborador_id IS 'Identificação do colaborador a qual cadastrou o acesso';


--
-- TOC entry 4641 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_colaborador_atualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_colaborador_atualizacao IS 'Identificador do último colaborador atualizando a informação do acesso';


--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_estado IS 'O atual estado do acesso | estado = { 1 - Acesso pemitido, 0 - Acesso revigado }';


--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_dataregisto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_dataregisto IS 'A data em que o acesso ao menu foi ao colaborador propetario dado';


--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN acesso.acesso_dataatualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.acesso.acesso_dataatualizacao IS 'A data em que o menu foi revogado do colaborador!';


--
-- TOC entry 231 (class 1259 OID 23308)
-- Name: autenticacao; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.autenticacao (
    autenticacao_id uuid NOT NULL default public.uuid_generate_v4(),
    autenticacao_colaborador_id uuid NOT NULL,
    autenticacao_chave character varying NOT NULL,
    autenticacao_estado smallint DEFAULT (map.get('autenticacao_estado_ativo'::name))::smallint,
    autenticacao_dataregisto timestamptz DEFAULT current_timestamp NOT NULL,
    autenticacao_dataatualizacao timestamptz
);


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE autenticacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.autenticacao IS 'Essa entidade serve para armazenar as autenticacoes que um colaborador vai passadno';


--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_id IS 'Identificador da autenticacao';


--
-- TOC entry 4647 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_colaborador_id IS 'Identificacao do colaborador que autenticou';


--
-- TOC entry 4648 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_estado IS 'Corresponde ao estado da autenticação
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechadao </li>
</ul>
  ';


--
-- TOC entry 4649 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_dataregisto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_dataregisto IS 'Corresponde a data em que a autenticação foi efetuada';


--
-- TOC entry 4650 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_dataatualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_dataatualizacao IS 'Corresponde a data da última atualização da autenticação ( data de logoff )';


--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN autenticacao.autenticacao_chave; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.autenticacao.autenticacao_chave IS 'Corresponde a chave da autenticação';


--
-- TOC entry 232 (class 1259 OID 23313)
-- Name: menu; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.menu (
    menu_id smallint NOT NULL,
    menu_menu_id smallint,
    menu_codigo character varying NOT NULL,
    menu_raiz character varying NOT NULL,
    menu_nivel smallint NOT NULL,
    menu_icon character varying DEFAULT NULL::character varying,
    menu_nome character varying NOT NULL,
    menu_link character varying DEFAULT NULL::character varying,
    menu_estado smallint DEFAULT (map.get('menu_estado_ativo'::name))::smallint NOT NULL,
    menu_children smallint DEFAULT 0 NOT NULL,
    menu_maxnode smallint DEFAULT 0 NOT NULL,
    menu_directchildern smallint DEFAULT 0 NOT NULL,
    menu_position smallint DEFAULT 0 NOT NULL
);


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE menu; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.menu IS 'Essa entidade serve para armazenar os menus de acesso';


--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_id IS 'Identificador único do menu do acesso';


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_menu_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_menu_id IS 'Identificador do menu parente';


--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_codigo; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_codigo IS 'Código único do menu';


--
-- TOC entry 4656 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_raiz; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_raiz IS 'Indica a raiz do menu';


--
-- TOC entry 4657 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_nivel; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_nivel IS 'Corresponde ao nível do menu';


--
-- TOC entry 4658 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_icon; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_icon IS 'Indica o nível do menu (quanto parrente esse menu possui)';


--
-- TOC entry 4659 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_nome; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_nome IS 'Corresponde ao nome do menu';


--
-- TOC entry 4660 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_link; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_link IS 'Corresponde ao link do menu';


--
-- TOC entry 4661 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_estado IS 'Corresponde ao estado do menu
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Desativo </li>
</ul>';


--
-- TOC entry 4662 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_children; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_children IS 'Indica a quantidade de submenus esse menu possui';


--
-- TOC entry 4663 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_maxnode; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_maxnode IS 'Indica a quantidade de node (entradas) maximas que se conseguira a partir desse menu
<br>Indica a distacncia dos filhos mais longe';


--
-- TOC entry 4664 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_directchildern; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_directchildern IS 'Indica a quantidade de filhos diretamente ligado a esse menu';


--
-- TOC entry 4665 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN menu.menu_position; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.menu.menu_position IS 'Indica a possição da ordem do menu';


--
-- TOC entry 233 (class 1259 OID 23323)
-- Name: privilegio; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.privilegio (
    privilegio_id uuid NOT NULL default public.uuid_generate_v4(),
    previlegio_perfil_id uuid NOT NULL,
    privilegio_menu_id smallint NOT NULL,
    privilegio_colaborador_id uuid NOT NULL,
    privilegio_colaborador_atualizacao uuid,
    privilegio_estado smallint DEFAULT (map.get('privilegio_estado_ativo'::name))::smallint NOT NULL,
    privilegio_dataregisto timestamptz DEFAULT now() NOT NULL,
    privilegio_dataatualuzacao timestamptz
);


--
-- TOC entry 4666 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE privilegio; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.privilegio IS 'Esse entidade mapeia os menus a que um perfil tem previlegio de aceder';


--
-- TOC entry 4667 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_id IS 'Identificador único do privilegio';


--
-- TOC entry 4668 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.previlegio_perfil_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.previlegio_perfil_id IS 'Identificador do perfil com o privilégio';


--
-- TOC entry 4669 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_menu_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_menu_id IS 'Identificador do menu ao qual o perfil tem o privilégio de aceder';


--
-- TOC entry 4670 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_colaborador_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_colaborador_id IS 'Identificador do colaborador responsável pela atribuição do privelégio';


--
-- TOC entry 4671 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_colaborador_atualizacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização do privilégio | colaborador que revogou o privelégio do menu ao perfil';


--
-- TOC entry 4672 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_estado; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_estado IS 'Corresponde ao estado do privilégio
<ul>
  <li> 1 - Ativo | Siginifica que o perfil ainda possui privelegio ao menu </li>
  <li> 0 - Fechado | Significa que o perfil perdeu o privilégio ao menu </li>
</ul>';


--
-- TOC entry 4673 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_dataregisto; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_dataregisto IS 'Corresponde ao instante exato em que o privilégio foi definido no sistema';


--
-- TOC entry 4674 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN privilegio.privilegio_dataatualuzacao; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.privilegio.privilegio_dataatualuzacao IS 'Corresponde ao último instante em que o privilegio foi atualizado no sistema | momento em que foi desativo';





--
-- TOC entry 295 (class 1259 OID 23511)
-- Name: constvalue; Type: TABLE; Schema: map; Owner: -
--

CREATE TABLE map.constvalue (
    constvalue_name name NOT NULL,
    constvalue_type regtype NOT NULL,
    constvalue_value text NOT NULL,
    constvalue_editable boolean DEFAULT false NOT NULL,
    constvalue_descrision character varying,
    constvalue_comment character varying
);


--
-- TOC entry 4706 (class 0 OID 0)
-- Dependencies: 295
-- Name: TABLE constvalue; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON TABLE map.constvalue IS 'Essa entidade serve para armazenar os valores das constantes';


--
-- TOC entry 4707 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_name; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_name IS 'Corresponde ao nome da constante';


--
-- TOC entry 4708 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_type; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_type IS 'Corresponde ao tipo da constante';


--
-- TOC entry 4709 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_value; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_value IS 'Corresponde ao valor da constante';


--
-- TOC entry 4710 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_editable; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_editable IS 'Esse atributo indica se a constante pode ser editavel';


--
-- TOC entry 4711 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_descrision; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_descrision IS 'Corresponde a descrição da constante';


--
-- TOC entry 4712 (class 0 OID 0)
-- Dependencies: 295
-- Name: COLUMN constvalue.constvalue_comment; Type: COMMENT; Schema: map; Owner: -
--

COMMENT ON COLUMN map.constvalue.constvalue_comment IS 'Commentario para a constante';


--
-- TOC entry 296 (class 1259 OID 23518)
-- Name: acerto; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.acerto (
    acerto_id uuid NOT NULL default public.uuid_generate_v4(),
    acerto_stock_id uuid,
    acerto_espaco_auth uuid NOT NULL,
    acerto_colaborador_id uuid NOT NULL,
    acerto_colaborador_atualizacao uuid,
    acerto_quantidade double precision NOT NULL,
    acerto_diferenca double precision NOT NULL,
    acerto_quantidadeinicial double precision NOT NULL,
    acerto_observacao character varying,
    acerto_estado smallint DEFAULT (map.get('acerto_estado_ativo'::name))::smallint NOT NULL,
    acerto_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    acerto_dataatualizacao timestamptz
);


--
-- TOC entry 4713 (class 0 OID 0)
-- Dependencies: 296
-- Name: TABLE acerto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.acerto IS 'Essa entidade serve para registar os acertos feitos no stock dos produtos';


--
-- TOC entry 4714 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_id IS 'Identificador único do acerto';


--
-- TOC entry 4715 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_stock_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_stock_id IS 'Identificador do stock o qual foi acertado';


--
-- TOC entry 4716 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_colaborador_id IS 'Identificador do colaborador responsavel pelo registro do acerto';


--
-- TOC entry 4717 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_colaborador_atualizacao IS 'Identificador do colaborador que atualizou o acerto pela últma vez';


--
-- TOC entry 4718 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_quantidade IS 'A quantidade do acerto (quantidade do produto declarado presente no stock)';


--
-- TOC entry 4719 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_diferenca; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_diferenca IS 'A diferença da quantidade declarada em relação a quantidade inicial (quantidade - inicial)';


--
-- TOC entry 4720 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_quantidadeinicial; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_quantidadeinicial IS 'Quantidade de produto que estava no stock antes do acerto';


--
-- TOC entry 4721 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_observacao IS 'Observação deixada no stock';


--
-- TOC entry 4722 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_estado IS 'Corresponde ao estado de acerto
<ul>
  <li> 1 - Ativo </li>
  <li> -1 - Anulado </li>
</ul>';


--
-- TOC entry 4723 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_dataregistro IS 'Corresponde a data em que o acerto foi registrado no sistema';


--
-- TOC entry 4724 (class 0 OID 0)
-- Dependencies: 296
-- Name: COLUMN acerto.acerto_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.acerto.acerto_dataatualizacao IS 'Corresponde a data em que o acerto foi atualizado pela sua última vez';


--
-- TOC entry 297 (class 1259 OID 23526)
-- Name: agrega; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.agrega (
    agrega_id uuid NOT NULL default public.uuid_generate_v4(),
    agrega_venda_id uuid NOT NULL,
    agrega_artigo_item uuid NOT NULL,
    agrega_espaco_auth uuid NOT NULL,
    agrega_colaborador_id uuid NOT NULL,
    agrega_colaborador_atualizacao uuid,
    agrega_quantidade double precision NOT NULL,
    agrega_custounitario double precision NOT NULL,
    agrega_montante double precision,
    agrega_estado smallint DEFAULT (map.get('agrega_estado_aberto'::name))::smallint NOT NULL,
    agrega_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    agrega_dataatualizacao timestamptz
);


--
-- TOC entry 4725 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE agrega; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.agrega IS 'Essa entidade serve para agregar um artigo (item extra) a uma venda';


--
-- TOC entry 4726 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_id IS 'Identificador único de agregação';


--
-- TOC entry 4727 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_venda_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_venda_id IS 'Identificador de venda a qual o item está agregado';


--
-- TOC entry 4728 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_artigo_item; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_artigo_item IS 'Identificador do artigo (item) agregado';


--
-- TOC entry 4729 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_colaborador_id IS 'Identificador do colaborador responsavel pela agregação';


--
-- TOC entry 4730 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_colaborador_atualizacao IS 'Identificador do colaborador responsável pelo atualização de agregação';


--
-- TOC entry 4731 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_quantidade IS 'Quantidade dos item agregado';


--
-- TOC entry 4732 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_custounitario; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_custounitario IS 'O custo unitario de agregação';


--
-- TOC entry 4733 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_montante IS 'Montante final da agregação quantidade * custo';


--
-- TOC entry 4734 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_estado IS '
Estado do agrega
<ul>
  <li> 2 - Pendente - Siginifica que pode-se efetuar qualquer modificação no agregacao </li>
  <li> 1 - Aberto   - Não se pode mais modificar a agregação, mas a mesma  encontra-se numa conta aberta  </li>
  <li> 0 - Fechado  - Não se pode modificar nem canselar mais a agregacao (unica coisa é anular tudo)  </li>
  <li> -1 - Anulado - A agregação faz parte de uma conta anulada </li>
  <li> -2 - Canselar - Significa que a agregação dexou de fazer parte da venda</li>
</ul>
';


--
-- TOC entry 4735 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_dataregistro IS 'O instante em que a agregação foi registrada pela sua última vez';


--
-- TOC entry 4736 (class 0 OID 0)
-- Dependencies: 297
-- Name: COLUMN agrega.agrega_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.agrega.agrega_dataatualizacao IS 'O instante em que a agregeção foi atualizado pela sua última vez';


--
-- TOC entry 298 (class 1259 OID 23534)
-- Name: amortizacao; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.amortizacao (
    amortizacao_id uuid NOT NULL default public.uuid_generate_v4(),
    amortizacao_caixa_id uuid NOT NULL,
    amortizacao_tpaga_id smallint NOT NULL,
    amortizacao_currency_id smallint NOT NULL,
    amortizacao_espaco_auth uuid NOT NULL,
    amortizacao_colaborador_id uuid NOT NULL,
    amortizacao_colaborador_atualizacao uuid,
    amortizacao_referencia jsonb NOT NULL,
    amortizacao_documento character varying NOT NULL,
    amortizacao_data date NOT NULL,
    amortizacao_montante double precision NOT NULL,
    amortizacao_montantetroco double precision DEFAULT 0 NOT NULL,
    amortizacao_montantemoeda double precision,
    amortizacao_taxacambio double precision,
    amortizacao_estado smallint DEFAULT (map.get('amortizacao_estado_ativo'::name))::smallint NOT NULL,
    amortizacao_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    amortizacao_dataatualizacao timestamptz
);


--
-- TOC entry 4737 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE amortizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.amortizacao IS 'Essa entidade serve para registar as amortizações feitas nas contas';


--
-- TOC entry 4738 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_id IS 'Identificador de amortização';


--
-- TOC entry 4739 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_caixa_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_caixa_id IS 'Identificador da caixa que a amortização foi feita';


--
-- TOC entry 4740 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_tpaga_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_tpaga_id IS 'Identificador da forma usada para efetuar a amortizcao';


--
-- TOC entry 4741 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_currency_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_currency_id IS 'Identificador da moeda usada para a amortização';


--
-- TOC entry 4742 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_colaborador_id IS 'Identificador do colaborador responsavél pela amortização';


--
-- TOC entry 4743 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização da amortização';


--
-- TOC entry 4744 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_referencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_referencia IS 'Corresponde a referencia da amortização (o objecto amortizaco)
<ul>
  <li> conta_id: ID | amortização para a conta </li>
</ul>';


--
-- TOC entry 4745 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_documento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_documento IS 'O documento da amortização';


--
-- TOC entry 4746 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_data IS 'A data em que a amortização foi feita';


--
-- TOC entry 4747 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_montante IS 'O montante amortizado';


--
-- TOC entry 4748 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_montantetroco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_montantetroco IS 'O montante em troco da amortização (esse valor esta excluido do montante de amortização)';


--
-- TOC entry 4749 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_montantemoeda; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_montantemoeda IS 'O montante em moeda em moeda da amortizacao';


--
-- TOC entry 4750 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_taxacambio; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_taxacambio IS 'A taxa de cambio usado no momento da operação';


--
-- TOC entry 4751 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_estado IS 'Corresponde ao estado de amortização
<ul>
  <li> 1 - Ativo </li>
</ul>';


--
-- TOC entry 4752 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_dataregistro IS 'O instante em que a amortização foi registrada no sistema';


--
-- TOC entry 4753 (class 0 OID 0)
-- Dependencies: 298
-- Name: COLUMN amortizacao.amortizacao_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.amortizacao.amortizacao_dataatualizacao IS 'O isntante em que a atualização foi atalizada pela últma vez';


--
-- TOC entry 299 (class 1259 OID 23543)
-- Name: cambio; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.cambio (
    cambio_id uuid NOT NULL default public.uuid_generate_v4(),
    cambio_currency_id smallint NOT NULL,
    cambio_espaco_auth uuid NOT NULL,
    cambio_colaborador_id uuid NOT NULL,
    cambio_colaborador_atualizacao uuid,
    cambio_taxa double precision,
    cambio_data date DEFAULT CURRENT_DATE NOT NULL,
    cambio_estado smallint DEFAULT (map.get('cambio_estado_ativo'::name))::smallint NOT NULL,
    cambio_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    cambio_dataatualizacao timestamptz
);


--
-- TOC entry 4754 (class 0 OID 0)
-- Dependencies: 299
-- Name: TABLE cambio; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.cambio IS 'Essa entidade serve para armazenar os cambios registrados';


--
-- TOC entry 4755 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_id IS 'Identificador único do cambio';


--
-- TOC entry 4756 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_currency_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_currency_id IS 'Identificador da moeda do cambio';


--
-- TOC entry 4757 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_colaborador_id IS 'Identificador do colaborador responsável pelo registro do cambio';


--
-- TOC entry 4758 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização do cambio';


--
-- TOC entry 4759 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_taxa; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_taxa IS 'O valor do cambio (a taxa do cambio)';


--
-- TOC entry 4760 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_data IS 'A data na qual o cambio pertence (o cambio pode ser registrado com atrazo)';


--
-- TOC entry 4761 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_estado IS 'Corresponde ao estado do cambio
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>';


--
-- TOC entry 4762 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_dataregistro IS 'O instante em que o cambio foi registrado';


--
-- TOC entry 4763 (class 0 OID 0)
-- Dependencies: 299
-- Name: COLUMN cambio.cambio_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.cambio.cambio_dataatualizacao IS 'O instante em que o cambio foi atualizado (fechado)';


--
-- TOC entry 344 (class 1259 OID 36860)
-- Name: ccorrente; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.ccorrente (
    ccorrente_id uuid NOT NULL default public.uuid_generate_v4(),
    ccorrente_tdocument_id smallint,
    ccorrente_espaco_auth uuid NOT NULL,
    ccorrente_colaborador_manage uuid NOT NULL,
    ccorrente_colaborador_id uuid NOT NULL,
    ccorrente_colaborador_updade uuid,
    ccorrente_titular character varying NOT NULL,
    ccorrente_nif character varying,
    ccorrente_document character varying,
    ccorrente_credito double precision DEFAULT 0 NOT NULL,
    ccorrente_debito double precision DEFAULT 0 NOT NULL,
    ccorrente_saldo double precision DEFAULT 0 NOT NULL,
    ccorrente_state smallint DEFAULT 1 NOT NULL,
    ccorrente_date timestamptz  DEFAULT current_timestamp NOT NULL,
    ccorrente_dateupdate timestamptz
);


--
-- TOC entry 300 (class 1259 OID 23552)
-- Name: dispoe; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.dispoe (
    dispoe_id uuid NOT NULL default public.uuid_generate_v4(),
    dispoe_artigo_id uuid NOT NULL,
    dispoe_artigo_item uuid NOT NULL,
    dispoe_espaco_auth uuid NOT NULL,
    dispoe_colaborador_id uuid NOT NULL,
    dispoe_colaborador_atualizacao uuid,
    dispoe_estado smallint DEFAULT (map.get('dispoe_estado_ativo'::name))::smallint NOT NULL,
    dispoe_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    dispoe_dataatualizacao timestamptz
);


--
-- TOC entry 4765 (class 0 OID 0)
-- Dependencies: 300
-- Name: TABLE dispoe; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.dispoe IS 'Dispoe - Essa entidade serve para mapear os artigos (item extras) que fazem parte do artigo de venda';


--
-- TOC entry 4766 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_id IS 'Identificador único do dispoe';


--
-- TOC entry 4767 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_artigo_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_artigo_id IS 'Identificador do artigo de venda';


--
-- TOC entry 4768 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_artigo_item; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_artigo_item IS 'Identificador do artigo (item extra) associado ao artigo de venda';


--
-- TOC entry 4769 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_colaborador_id IS 'Identificador do colaborador responsável pelo registro do dispor';


--
-- TOC entry 4770 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_colaborador_atualizacao IS 'Identificador do último colaborador a atualiazar o dispoe (colaborador que desagregou o artigo item extra ao artigo)';


--
-- TOC entry 4771 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_estado IS 'Estado do dispor
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>';


--
-- TOC entry 4772 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_dataregistro IS 'Corresponde ao isntante em que o dispoe foi registrado';


--
-- TOC entry 4773 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN dispoe.dispoe_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.dispoe.dispoe_dataatualizacao IS 'Corresponde ao instante em que o item foi atualizado pela última vez';


--
-- TOC entry 301 (class 1259 OID 23557)
-- Name: entrada; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.entrada (
    entrada_id uuid NOT NULL default public.uuid_generate_v4(),
    entrada_fornecedor_id uuid NOT NULL,
    entrada_artigo_id uuid NOT NULL,
    entrada_espaco_destino uuid NOT NULL,
    entrada_espaco_auth uuid NOT NULL,
    entrada_colaborador_id uuid NOT NULL,
    entrada_colaborador_atualizacao uuid,
    entrada_codigofatura character varying(32),
    entrada_data date NOT NULL,
    entrada_montante double precision NOT NULL,
    entrada_quantidade double precision NOT NULL,
    entrada_quantidadeinicial double precision DEFAULT 0 NOT NULL,
    entrada_quantidadefinal double precision DEFAULT 0,
    entrada_descricao character varying,
    entrada_estado smallint DEFAULT (map.get('entrada_estado_ativo'::name))::smallint NOT NULL,
    entrada_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    entrada_dataatualizacao timestamptz
);


--
-- TOC entry 4774 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE entrada; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.entrada IS 'Entrada - Registra todas as entradas (compras) feito sobre um artigo para um determinado stock';


--
-- TOC entry 4775 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_id IS 'Identificador único da entrada';


--
-- TOC entry 4776 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_espaco_auth; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_espaco_auth IS 'Identificador do espaço a qual o artigo entrou';


--
-- TOC entry 4777 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_fornecedor_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_fornecedor_id IS 'Identificador do fornecedor responsável pela entrada do artigo.';


--
-- TOC entry 4778 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_artigo_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_artigo_id IS 'Identificador do artigo o qual está se entregado';


--
-- TOC entry 4779 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_colaborador_id IS 'Identificador do colaborador responsavel pela entrega do artigo';


--
-- TOC entry 4780 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_colaborador_atualizacao IS 'Identificador do colaborador responsável pela atualização da entrega';


--
-- TOC entry 4781 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_codigofatura; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_codigofatura IS 'Corresponde ao código de fatura';


--
-- TOC entry 4782 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_data IS 'Corresponde a data da entrada do artigo no stock';


--
-- TOC entry 4783 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_montante; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_montante IS 'Corresponde ao montante do custo da entrada (montante de custo da compra)';


--
-- TOC entry 4784 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_quantidade IS 'Corresponde a quantidade do artigo entrado em stock';


--
-- TOC entry 4785 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_quantidadeinicial; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_quantidadeinicial IS 'Corresponde a quantidade de artigo inicialmente no stock antes da entrada';


--
-- TOC entry 4786 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_quantidadefinal; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_quantidadefinal IS 'Corresponde a quantidade de artigo disponivél no stock depois da entrada';


--
-- TOC entry 4787 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_descricao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_descricao IS 'Corresponde a observação da entrada';


--
-- TOC entry 4788 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_estado IS 'Corresponde ao estado da entrada
<ul>
  <li> 1  - Ativo </li>
  <li> -1 - Anulado </li>
</ul>';


--
-- TOC entry 4789 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_dataregistro IS 'Corresponde ao isntante em que a entrada foi registrada';


--
-- TOC entry 4790 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN entrada.entrada_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.entrada.entrada_dataatualizacao IS 'Corresponde ao instante em que a entrada foi atualizada';


--
-- TOC entry 302 (class 1259 OID 23567)
-- Name: fornecedor; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.fornecedor (
    fornecedor_id uuid NOT NULL default public.uuid_generate_v4(),
    fornecedor_espaco_auth uuid NOT NULL,
    fornecedor_colaborador_id uuid NOT NULL,
    fornecedor_colaborador_atualizacao uuid,
    fornecedor_nif character varying NOT NULL,
    fornecedor_nome character varying,
    fornecedor_email character varying,
    fornecedor_contacto character varying,
    fornecedor_endereco character varying,
    fornecedor_estado smallint DEFAULT (map.get('fornecedor_estado_ativo'::name))::smallint NOT NULL,
    fornecedor_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    fornecedor_dataatualizacao timestamptz,
    CONSTRAINT ck_fornecedor_contacto CHECK ((lower(lib.str_nospace((fornecedor_contacto)::text)) = (fornecedor_contacto)::text)),
    CONSTRAINT ck_fornecedor_email_normalized CHECK ((lower(lib.str_nospace((fornecedor_email)::text)) = (fornecedor_email)::text)),
    CONSTRAINT ck_fornecedor_endereco_normalized CHECK (lib.str_is_normalized((fornecedor_endereco)::text)),
    CONSTRAINT ck_fornecedor_nome_normalized CHECK (lib.str_is_normalized((fornecedor_nome)::text))
);


--
-- TOC entry 4791 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE fornecedor; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.fornecedor IS '#Fornecedor - Essa entidade armazena os fornecedores dos produtos em contacto';


--
-- TOC entry 4792 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_id IS 'Identificador único do fornecedor';


--
-- TOC entry 4793 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_colaborador_id IS 'Identificador do colaborador responsável pelo registro';


--
-- TOC entry 4794 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_colaborador_atualizacao IS 'Identificador do colaborador responsável pela última atualização';


--
-- TOC entry 4795 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_nif; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_nif IS 'NIF único do fornecedor';


--
-- TOC entry 4796 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_nome IS 'O nome do fornecedor';


--
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_email; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_email IS 'Email único do fornecedor';


--
-- TOC entry 4798 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_contacto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_contacto IS 'Corresponde ao contacto do fornecedor';


--
-- TOC entry 4799 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_endereco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_endereco IS 'Corresponde ao endereço do fornecedor';


--
-- TOC entry 4800 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_estado IS 'Estado do fornecedor no sistema
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>
';


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_dataregistro IS 'Corresponde ao instante em que o fornecedor foi registrado no sistema';


--
-- TOC entry 4802 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN fornecedor.fornecedor_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.fornecedor.fornecedor_dataatualizacao IS 'Corresponde ao instante em que o fornecedor foi atualizado pela última no sistema';


--
-- TOC entry 303 (class 1259 OID 23579)
-- Name: imposto; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.imposto (
    imposto_id uuid NOT NULL,
    imposto_tipoimposto_id uuid NOT NULL,
    imposto_artigo_id uuid NOT NULL,
    imposto_taplicar_id smallint NOT NULL,
    imposto_espaco_auth uuid NOT NULL,
    imposto_colaborador_id uuid NOT NULL,
    imposto_colaborador_atualizacao uuid,
    imposto_percentagem float,
    imposto_valor float,
    imposto_estado smallint DEFAULT (map.get('imposto_estado_ativo'::name))::smallint NOT NULL,
    imposto_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    imposto_dataatualizacao smallint
);




--
-- TOC entry 305 (class 1259 OID 23589)
-- Name: impostovenda; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.impostovenda (
    impostovenda_id uuid NOT NULL default public.uuid_generate_v4(),
    impostovenda_venda_id uuid NOT NULL,
    impostovenda_tipoimposto_id uuid NOT NULL,
    impostovenda_espaco_auth uuid NOT NULL,
    impostovenda_colaborador_id uuid NOT NULL,
    impostovenda_colaborador_atualizacao uuid,
    impostovenda_valor float,
    impostovenda_percentagem double precision,
    impostovenda_estado smallint DEFAULT (map.get('impostovenda_estado_ativo'::name))::smallint NOT NULL,
    impostovenda_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    impostovenda_dataatualizacao timestamptz
);




--
-- TOC entry 329 (class 1259 OID 23665)
-- Name: trabalha; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.trabalha (
    trabalha_id uuid NOT NULL default public.uuid_generate_v4(),
    trabalha_perfil_id uuid,
    trabalha_espaco_destino uuid NOT NULL,
    trabalha_espaco_auth uuid NOT NULL,
    trabalha_colaborador_proprietario uuid NOT NULL,
    trabalha_colaborador_id uuid NOT NULL,
    trabalha_colaborador_atualizacao uuid,
    trabalha_estado smallint DEFAULT (map.get('trabalha_estado_ativo'::name))::smallint NOT NULL,
    trabalha_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    trabalha_dataatualizacao timestamptz,
    trabalha_posicao smallint
);


--
-- TOC entry 4822 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE trabalha; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.trabalha IS 'Essa entidade serve para indicar os perfil com qual um colaborador trabalha, e tambem em qual departamento ou setor o colaborador trabalha';


--
-- TOC entry 4823 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_id IS 'Identificador único da instancia trabalha';


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_colaborador_id IS 'Identificador do colaborador responsável pelo registro do trabalha';


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_colaborador_proprietario; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_colaborador_proprietario IS 'Identificador do colaborador proprietario ao trabalho (colaborador com direito de trabalhar)';


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_colaborador_atualizacao IS 'Identificador do último colaborador responsável pela atualização do trabalha';


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_perfil_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_perfil_id IS 'Identificador do perfil com qual o colaborador esta a trabalhar';


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_espaco_auth; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_espaco_auth IS 'Identificaodor do local onde o colaborador trabalha (departamento, setor, direção, local, agencia, ...)';


--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_estado IS 'Corresponde ao estado do trabalha do colaborador
<ul>
  <li> 1 - Ativo | O colaborador atualmente trabalha nesse local </li>
  <li> 0 - Desativo | O colaborador deixou de trabalhar com o perfil</li>
</ul>
';


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_dataregistro IS 'Corresponde a data em que foi atribuido ao colaborador o direito de trabalhar com o perfil';


--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 329
-- Name: COLUMN trabalha.trabalha_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.trabalha.trabalha_dataatualizacao IS 'Corresponde ao último instante';


--
-- TOC entry 333 (class 1259 OID 23676)
-- Name: transferencia; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.transferencia (
    transferencia_id uuid NOT NULL default public.uuid_generate_v4(),
    transferencia_stock_origem uuid NOT NULL,
    transferencia_stock_destino uuid NOT NULL,
    transferencia_espaco_auth uuid,
    transferencia_colaborador_id uuid NOT NULL,
    transferencia_colaborador_atualizacao uuid,
    transferencia_quantidade double precision NOT NULL,
    transferencia_data date,
    transferencia_documento character varying NOT NULL,
    transferencia_observacao character varying,
    transferencia_estado smallint DEFAULT (map.get('transferencia_estado_ativo'::name))::smallint NOT NULL,
    transferencia_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    transferencia_dataatualizacao timestamptz
);


--
-- TOC entry 4834 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE transferencia; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.transferencia IS 'Essa entidade serve para armazenar as transferência dos artigos entre os stock ';


--
-- TOC entry 4835 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_stock_origem; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_stock_origem IS 'Identificador do stock o qual o produto saiu';


--
-- TOC entry 4836 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_stock_destino; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_stock_destino IS 'Identificador do stock o qual o produto se destina';


--
-- TOC entry 4837 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_colaborador_id IS 'Identificador do colaborador responsável pelo registro de transferência do artigo entre os stocks';


--
-- TOC entry 4838 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_colaborador_atualizacao IS 'Identificador do colaborador responsável pela última atualização da transferencia.';


--
-- TOC entry 4839 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_quantidade; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_quantidade IS 'Corresponde a quantidade do artigo tranferido';


--
-- TOC entry 4840 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_data; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_data IS 'Corresponde a data efetiva da transferencia dos produtos';


--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_documento; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_documento IS 'Corresponde ao documento da transferência';


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_observacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_observacao IS 'Corresponde a observação para a transferencia';


--
-- TOC entry 4843 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_estado IS 'Corresponde ao estado da transferencia';


--
-- TOC entry 4844 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_dataregistro IS 'Corresponde ao isntante em que a tranferência foi registrada no sistema';


--
-- TOC entry 4845 (class 0 OID 0)
-- Dependencies: 333
-- Name: COLUMN transferencia.transferencia_dataatualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.transferencia.transferencia_dataatualizacao IS 'Corresponde a data em que a transferência foi atualizada pela última vez no sistema';


--
-- TOC entry 336 (class 1259 OID 23688)
-- Name: taplicar; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.taplicar (
    taplicar_id smallint NOT NULL,
    taplicar_descricao character varying NOT NULL
);


--
-- TOC entry 337 (class 1259 OID 23694)
-- Name: tespaco; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tespaco (
    tespaco_id smallint NOT NULL,
    tespaco_designacao character varying(32) NOT NULL,
    CONSTRAINT ck_tespaco_designacao_normalized CHECK (lib.str_is_normalized((tespaco_designacao)::text))
);


--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 337
-- Name: TABLE tespaco; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.tespaco IS '#Tipo Espaço - Essa entidade armazena os tipos do espaco';


--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 337
-- Name: COLUMN tespaco.tespaco_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tespaco.tespaco_id IS 'Identificador único tipo do espaço';


--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 337
-- Name: COLUMN tespaco.tespaco_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tespaco.tespaco_designacao IS 'Designação do tipo do espaço';


--
-- TOC entry 338 (class 1259 OID 23698)
-- Name: tipoimposto; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tipoimposto (
    tipoimposto_id uuid NOT NULL default public.uuid_generate_v4(),
    tipoimposto_espaco_auth uuid NOT NULL,
    tipoimposto_colaborador_id uuid NOT NULL,
    tipoimposto_colaborador_atualizacao uuid,
    tipoimposto_nome character varying NOT NULL,
    tipoimposto_codigo character varying NOT NULL,
    tipoimposto_estado smallint DEFAULT (map.get('tipoimposto_estado_ativo'::name))::smallint NOT NULL,
    tipoimposto_dataregistro timestamptz DEFAULT current_timestamp NOT NULL,
    tipoimposto_dataatuzaliacao timestamptz
);


--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE tipoimposto; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.tipoimposto IS 'Essa entidade serve para armazenar os impostos que devem ser aplicado aos artigos';


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_id IS 'Identificador único do artigo';


--
-- TOC entry 4853 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_colaborador_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_colaborador_id IS 'Identificador do colaborador responsável pelo registro do imposto';


--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_colaborador_atualizacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_colaborador_atualizacao IS 'Identificador do último colaborador responsável pela atualização do imposto';


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_nome; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_nome IS 'Corresponde ao nome do imposto';


--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_codigo; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_codigo IS 'Corresponde ao código do imposto';


--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_estado; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_estado IS 'Corresponde ao estado do imposto
<ul>
  <li> 1 - Ativo </li>
  <li> 0 - Fechado </li>
</ul>';


--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_dataregistro; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_dataregistro IS 'Corresponde ao instante em que o impoto foi registrado';


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 338
-- Name: COLUMN tipoimposto.tipoimposto_dataatuzaliacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tipoimposto.tipoimposto_dataatuzaliacao IS 'Corresponde ao último instante em que o imposto foi atualizado';


--
-- TOC entry 339 (class 1259 OID 23707)
-- Name: tlink; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tlink (
    tlink_id smallint NOT NULL,
    tlink_designacao character varying
);


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 339
-- Name: TABLE tlink; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.tlink IS 'Essa entidade serve para registar os tipos de links';


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 339
-- Name: COLUMN tlink.tlink_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tlink.tlink_id IS 'Identificador do tipo de link';


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 339
-- Name: COLUMN tlink.tlink_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tlink.tlink_designacao IS 'Corresponde a designação dos tipos de link';


--
-- TOC entry 340 (class 1259 OID 23713)
-- Name: toperacao; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.toperacao (
    toperacao_id smallint NOT NULL,
    toperacao_designacao character varying,
    toperacao_classe smallint DEFAULT 1 NOT NULL
);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 340
-- Name: TABLE toperacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.toperacao IS 'Essa entidade serve para armazenar os tipos de movimentos que pode ocorrer em um stock';


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 340
-- Name: COLUMN toperacao.toperacao_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.toperacao.toperacao_id IS 'Identificador único do tipo de movimento';


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 340
-- Name: COLUMN toperacao.toperacao_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.toperacao.toperacao_designacao IS 'Designação do tipo de movimento';


--
-- TOC entry 341 (class 1259 OID 23720)
-- Name: tpaga; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tpaga (
    tpaga_id smallint NOT NULL,
    tpaga_designacao character varying(32) NOT NULL,
    CONSTRAINT ck_tpaga_designacao_normalized CHECK (lib.str_is_normalized((tpaga_designacao)::text))
);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE tpaga; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON TABLE tweeks.tpaga IS '#Tipo Pagamento - Essa entidade serve para registar as diferentes formas que o pagamento pode ser feito';


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 341
-- Name: COLUMN tpaga.tpaga_id; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tpaga.tpaga_id IS 'Identificador único do tipo de pagamento';


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 341
-- Name: COLUMN tpaga.tpaga_designacao; Type: COMMENT; Schema: tweeks; Owner: -
--

COMMENT ON COLUMN tweeks.tpaga.tpaga_designacao IS 'Corresponde a designação do tipo de pagamento';


--
-- TOC entry 342 (class 1259 OID 23724)
-- Name: tposto; Type: TABLE; Schema: tweeks; Owner: -
--

CREATE TABLE tweeks.tposto (
    tposto_id smallint NOT NULL,
    tposto_designacao character varying
);




ALTER TABLE ONLY auth.acesso  ADD CONSTRAINT pk_acesso_id PRIMARY KEY (acesso_id);


--
-- TOC entry 3910 (class 2606 OID 23783)
-- Name: autenticacao pk_autenticacao_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.autenticacao
    ADD CONSTRAINT pk_autenticacao_id PRIMARY KEY (autenticacao_id);


--
-- TOC entry 3832 (class 2606 OID 23785)
-- Name: colaborador pk_colaborador_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT pk_colaborador_id PRIMARY KEY (colaborador_id);


--
-- TOC entry 3912 (class 2606 OID 23787)
-- Name: menu pk_menu_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.menu
    ADD CONSTRAINT pk_menu_id PRIMARY KEY (menu_id);


--
-- TOC entry 3841 (class 2606 OID 23789)
-- Name: perfil pk_perfil_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.perfil
    ADD CONSTRAINT pk_perfil_id PRIMARY KEY (perfil_id);


--
-- TOC entry 3920 (class 2606 OID 23791)
-- Name: privilegio pk_privilegio_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.privilegio
    ADD CONSTRAINT pk_privilegio_id PRIMARY KEY (privilegio_id);


--
-- TOC entry 3922 (class 2606 OID 23793)
-- Name: tsexo pk_tsexo_id; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.tsexo
    ADD CONSTRAINT pk_tsexo_id PRIMARY KEY (tsexo_id);


--
-- TOC entry 3834 (class 2606 OID 23795)
-- Name: colaborador uk_colaborador_email; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT uk_colaborador_email UNIQUE (colaborador_email);


--
-- TOC entry 3836 (class 2606 OID 23797)
-- Name: colaborador uk_colaborador_nif; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT uk_colaborador_nif UNIQUE (colaborador_nif);


--
-- TOC entry 3843 (class 2606 OID 23799)
-- Name: perfil uk_perfil_nome; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.perfil
    ADD CONSTRAINT uk_perfil_nome UNIQUE (perfil_nome);


--
-- TOC entry 3924 (class 2606 OID 23801)
-- Name: tsexo uk_tsexo_codigo; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.tsexo
    ADD CONSTRAINT uk_tsexo_codigo UNIQUE (tsexo_codigo);


--
-- TOC entry 3926 (class 2606 OID 23803)
-- Name: tsexo uk_tsexo_nome; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.tsexo
    ADD CONSTRAINT uk_tsexo_nome UNIQUE (tsexo_nome);


--
-- TOC entry 3914 (class 2606 OID 23805)
-- Name: menu uq_menu_codigo; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.menu
    ADD CONSTRAINT uq_menu_codigo UNIQUE (menu_codigo);











--
-- TOC entry 4028 (class 2606 OID 23899)
-- Name: constvalue pk_constvalue_name; Type: CONSTRAINT; Schema: map; Owner: -
--

ALTER TABLE ONLY map.constvalue
    ADD CONSTRAINT pk_constvalue_name PRIMARY KEY (constvalue_name);


--
-- TOC entry 3884 (class 2606 OID 23901)
-- Name: link pk_link_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.link
    ADD CONSTRAINT pk_link_id UNIQUE (link_id, link_estado);


--
-- TOC entry 4030 (class 2606 OID 23909)
-- Name: acerto pk_acerto_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.acerto
    ADD CONSTRAINT pk_acerto_id PRIMARY KEY (acerto_id);


--
-- TOC entry 4032 (class 2606 OID 23911)
-- Name: agrega pk_agrega_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT pk_agrega_id PRIMARY KEY (agrega_id);


--
-- TOC entry 4034 (class 2606 OID 23913)
-- Name: amortizacao pk_amortizacao_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT pk_amortizacao_id PRIMARY KEY (amortizacao_id);


--
-- TOC entry 3867 (class 2606 OID 23915)
-- Name: artigo pk_artigo_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT pk_artigo_id PRIMARY KEY (artigo_id);


--
-- TOC entry 3871 (class 2606 OID 23917)
-- Name: caixa pk_caixa_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.caixa
    ADD CONSTRAINT pk_caixa_id PRIMARY KEY (caixa_id);


--
-- TOC entry 4036 (class 2606 OID 23919)
-- Name: cambio pk_cambio_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.cambio
    ADD CONSTRAINT pk_cambio_id PRIMARY KEY (cambio_id);


--
-- TOC entry 4082 (class 2606 OID 36873)
-- Name: ccorrente pk_ccorrente_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.ccorrente
    ADD CONSTRAINT pk_ccorrente_id PRIMARY KEY (ccorrente_id);


--
-- TOC entry 3873 (class 2606 OID 23921)
-- Name: classe pk_classe_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT pk_classe_id PRIMARY KEY (classe_id);


--
-- TOC entry 3878 (class 2606 OID 23923)
-- Name: conta pk_conta_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT pk_conta_id PRIMARY KEY (conta_id);


--
-- TOC entry 4038 (class 2606 OID 23925)
-- Name: dispoe pk_dispoe_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT pk_dispoe_id PRIMARY KEY (dispoe_id);


--
-- TOC entry 4040 (class 2606 OID 23927)
-- Name: entrada pk_entrada_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT pk_entrada_id PRIMARY KEY (entrada_id);


--
-- TOC entry 3849 (class 2606 OID 23929)
-- Name: espaco pk_espaco_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT pk_espaco_id PRIMARY KEY (espaco_id);


--
-- TOC entry 4042 (class 2606 OID 23931)
-- Name: fornecedor pk_fornecedor_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT pk_fornecedor_id PRIMARY KEY (fornecedor_id);


--
-- TOC entry 4048 (class 2606 OID 23933)
-- Name: imposto pk_imposto_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT pk_imposto_id PRIMARY KEY (imposto_id);


--
-- TOC entry 4050 (class 2606 OID 23935)
-- Name: impostovenda pk_impostovenda_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT pk_impostovenda_id PRIMARY KEY (impostovenda_id);


--
-- TOC entry 3886 (class 2606 OID 23937)
-- Name: mesa pk_mesa_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.mesa
    ADD CONSTRAINT pk_mesa_id PRIMARY KEY (mesa_id);


--
-- TOC entry 3858 (class 2606 OID 23939)
-- Name: movimento pk_movimento_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT pk_movimento_id PRIMARY KEY (movimento_id);


--
-- TOC entry 3889 (class 2606 OID 23941)
-- Name: posto pk_posto_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT pk_posto_id PRIMARY KEY (posto_id);


--
-- TOC entry 3861 (class 2606 OID 23943)
-- Name: precario pk_precario_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.precario
    ADD CONSTRAINT pk_precario_id PRIMARY KEY (precario_id);


--
-- TOC entry 3897 (class 2606 OID 23945)
-- Name: stock pk_stock_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.stock
    ADD CONSTRAINT pk_stock_id PRIMARY KEY (stock_id);


--
-- TOC entry 4062 (class 2606 OID 23947)
-- Name: taplicar pk_taplicar_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taplicar
    ADD CONSTRAINT pk_taplicar_id PRIMARY KEY (taplicar_id);


--
-- TOC entry 3863 (class 2606 OID 23949)
-- Name: taxa pk_taxa_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taxa
    ADD CONSTRAINT pk_taxa_id PRIMARY KEY (taxa_id);


--
-- TOC entry 4064 (class 2606 OID 23951)
-- Name: tespaco pk_tespaco_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tespaco
    ADD CONSTRAINT pk_tespaco_id PRIMARY KEY (tespaco_id);


--
-- TOC entry 4068 (class 2606 OID 23953)
-- Name: tipoimposto pk_tipoimposto_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tipoimposto
    ADD CONSTRAINT pk_tipoimposto_id PRIMARY KEY (tipoimposto_id);


--
-- TOC entry 4072 (class 2606 OID 23955)
-- Name: tlink pk_tlink_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tlink
    ADD CONSTRAINT pk_tlink_id PRIMARY KEY (tlink_id);


--
-- TOC entry 3899 (class 2606 OID 23957)
-- Name: tmovimento pk_tmovimento_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tmovimento
    ADD CONSTRAINT pk_tmovimento_id PRIMARY KEY (tmovimento_id);


--
-- TOC entry 4074 (class 2606 OID 23959)
-- Name: toperacao pk_toperacao_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.toperacao
    ADD CONSTRAINT pk_toperacao_id PRIMARY KEY (toperacao_id);


--
-- TOC entry 4076 (class 2606 OID 23961)
-- Name: tpaga pk_tpaga_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tpaga
    ADD CONSTRAINT pk_tpaga_id PRIMARY KEY (tpaga_id);


--
-- TOC entry 4080 (class 2606 OID 23963)
-- Name: tposto pk_tposto_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tposto
    ADD CONSTRAINT pk_tposto_id PRIMARY KEY (tposto_id);


--
-- TOC entry 4058 (class 2606 OID 23965)
-- Name: trabalha pk_trabalha_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT pk_trabalha_id PRIMARY KEY (trabalha_id);


--
-- TOC entry 3865 (class 2606 OID 23967)
-- Name: transacao pk_transacao_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT pk_transacao_id PRIMARY KEY (transacao_id);


--
-- TOC entry 4060 (class 2606 OID 23969)
-- Name: transferencia pk_transferencia_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT pk_transferencia_id PRIMARY KEY (transferencia_id);


--
-- TOC entry 3903 (class 2606 OID 23971)
-- Name: venda pk_venda_id; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT pk_venda_id PRIMARY KEY (venda_id);


--
-- TOC entry 3869 (class 2606 OID 23973)
-- Name: artigo uk_artigo_codigo; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT uk_artigo_codigo UNIQUE (artigo_codigo);


--
-- TOC entry 3876 (class 2606 OID 23975)
-- Name: classe uk_classe_nome; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT uk_classe_nome UNIQUE (classe_nome);


--
-- TOC entry 3880 (class 2606 OID 23977)
-- Name: conta uk_conta_fatura; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT uk_conta_fatura UNIQUE (conta_numerofatura);


--
-- TOC entry 3882 (class 2606 OID 23979)
-- Name: conta uk_conta_numero; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT uk_conta_numero UNIQUE (conta_espaco_auth, conta_numero);


--
-- TOC entry 3851 (class 2606 OID 23981)
-- Name: espaco uk_espaco_faturaletra; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT uk_espaco_faturaletra UNIQUE (espaco_codigo);


--
-- TOC entry 3853 (class 2606 OID 23983)
-- Name: espaco uk_espaco_nome; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT uk_espaco_nome UNIQUE (espaco_nome);


--
-- TOC entry 4044 (class 2606 OID 23985)
-- Name: fornecedor uk_fornecedor_nif; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT uk_fornecedor_nif UNIQUE (fornecedor_nif);


--
-- TOC entry 3891 (class 2606 OID 23987)
-- Name: posto uk_posnto_endereco; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT uk_posnto_endereco UNIQUE (posto_endereco);


--
-- TOC entry 3893 (class 2606 OID 23989)
-- Name: posto uk_posnto_ip; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT uk_posnto_ip UNIQUE (posto_endereco);


--
-- TOC entry 3895 (class 2606 OID 23991)
-- Name: posto uk_posnto_mac; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT uk_posnto_mac UNIQUE (posto_mac);


--
-- TOC entry 4066 (class 2606 OID 23993)
-- Name: tespaco uk_tespaco_designacao; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tespaco
    ADD CONSTRAINT uk_tespaco_designacao UNIQUE (tespaco_designacao);


--
-- TOC entry 4070 (class 2606 OID 23995)
-- Name: tipoimposto uk_tipoimposto; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tipoimposto
    ADD CONSTRAINT uk_tipoimposto UNIQUE (tipoimposto_codigo, tipoimposto_espaco_auth);


--
-- TOC entry 3901 (class 2606 OID 23997)
-- Name: tmovimento uk_tmovimento_designacao; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tmovimento
    ADD CONSTRAINT uk_tmovimento_designacao UNIQUE (tmovimento_designacao);


--
-- TOC entry 4078 (class 2606 OID 23999)
-- Name: tpaga uk_tpaga_designacao; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tpaga
    ADD CONSTRAINT uk_tpaga_designacao UNIQUE (tpaga_designacao);


--
-- TOC entry 4046 (class 2606 OID 24001)
-- Name: fornecedor ul_fornecedor_email; Type: CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT ul_fornecedor_email UNIQUE (fornecedor_email);


--
-- TOC entry 3904 (class 1259 OID 24002)
-- Name: idx_acesso_colaborador_propetario; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_acesso_colaborador_propetario ON auth.acesso USING btree (acesso_colaborador_propetario);


--
-- TOC entry 3905 (class 1259 OID 24003)
-- Name: idx_acesso_estado; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_acesso_estado ON auth.acesso USING btree (acesso_estado);


--
-- TOC entry 3906 (class 1259 OID 24004)
-- Name: idx_acesso_menu_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_acesso_menu_id ON auth.acesso USING btree (acesso_menu_id);


--
-- TOC entry 3828 (class 1259 OID 24005)
-- Name: idx_agenda_colaborador_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_agenda_colaborador_id ON auth.colaborador USING btree (colaborador_id);


--
-- TOC entry 3829 (class 1259 OID 24006)
-- Name: idx_autenticacao_colaborador_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_autenticacao_colaborador_id ON auth.colaborador USING btree (colaborador_id);


--
-- TOC entry 3830 (class 1259 OID 24007)
-- Name: idx_colaborador_colaborador_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_colaborador_colaborador_id ON auth.colaborador USING btree (colaborador_colaborador_id);


--
-- TOC entry 3837 (class 1259 OID 24008)
-- Name: idx_perfil_colaborador_atualizacao; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_perfil_colaborador_atualizacao ON auth.perfil USING btree (perfil_colaborador_atualizacao);


--
-- TOC entry 3838 (class 1259 OID 24009)
-- Name: idx_perfil_colaborador_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_perfil_colaborador_id ON auth.perfil USING btree (perfil_colaborador_id);


--
-- TOC entry 3839 (class 1259 OID 24010)
-- Name: idx_perfil_perfil_perfil_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_perfil_perfil_perfil_id ON auth.perfil USING btree (perfil_perfil_id);


--
-- TOC entry 3915 (class 1259 OID 24011)
-- Name: idx_previlegio_menu_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_previlegio_menu_id ON auth.privilegio USING btree (privilegio_menu_id);


--
-- TOC entry 3916 (class 1259 OID 24012)
-- Name: idx_privilegio_colaboirador_atualizacao; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_privilegio_colaboirador_atualizacao ON auth.privilegio USING btree (privilegio_colaborador_atualizacao);


--
-- TOC entry 3917 (class 1259 OID 24013)
-- Name: idx_privilegio_colaboirador_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_privilegio_colaboirador_id ON auth.privilegio USING btree (privilegio_colaborador_id);


--
-- TOC entry 3918 (class 1259 OID 24014)
-- Name: idx_privilegio_perfil_id; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_privilegio_perfil_id ON auth.privilegio USING btree (previlegio_perfil_id);







--
-- TOC entry 3854 (class 1259 OID 24027)
-- Name: idx_movimento_referencia_entrada_hash; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE INDEX idx_movimento_referencia_entrada_hash ON tweeks.movimento USING hash ((((movimento_referencia ->> 'entrada_id'::text))::uuid));


--
-- TOC entry 3855 (class 1259 OID 24028)
-- Name: idx_movimento_referencia_venda_gin; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE INDEX idx_movimento_referencia_venda_gin ON tweeks.movimento USING gin (movimento_referencia);


--
-- TOC entry 3856 (class 1259 OID 24029)
-- Name: idx_movimento_referencia_venda_hash; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE INDEX idx_movimento_referencia_venda_hash ON tweeks.movimento USING hash ((((movimento_referencia ->> 'venda_id'::text))::uuid));


--
-- TOC entry 3859 (class 1259 OID 24030)
-- Name: idx_precario_referencia; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE INDEX idx_precario_referencia ON tweeks.precario USING btree (precario_referencia);


--
-- TOC entry 3874 (class 1259 OID 24031)
-- Name: uk_classe_codigo; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE UNIQUE INDEX uk_classe_codigo ON tweeks.classe USING btree (classe_codigo);


--
-- TOC entry 3887 (class 1259 OID 24032)
-- Name: uk_mesa_numero; Type: INDEX; Schema: tweeks; Owner: -
--

CREATE INDEX uk_mesa_numero ON tweeks.mesa USING btree (mesa_numero);


-- TOC entry 4267 (class 2620 OID 24033)
-- Name: transferencia functg_transferencia_after_insert_adjust_stock; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER functg_transferencia_after_insert_adjust_stock AFTER INSERT ON tweeks.transferencia FOR EACH ROW EXECUTE FUNCTION rule.tg_transferencia_after_insert_creante_movimento();


--
-- TOC entry 4262 (class 2620 OID 24034)
-- Name: acerto tg_acerto_after_insert_adjust_stock; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_acerto_after_insert_adjust_stock AFTER INSERT ON tweeks.acerto FOR EACH ROW EXECUTE FUNCTION rule.tg_acerto_after_insert_create_movimento();


--
-- TOC entry 4263 (class 2620 OID 24035)
-- Name: agrega tg_agrega_after_insert_incremente_venda_montante; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_agrega_after_insert_incremente_venda_montante AFTER INSERT ON tweeks.agrega FOR EACH ROW EXECUTE FUNCTION rule.tg_agrega_after_insert_incremente_venda_montante();


--
-- TOC entry 4264 (class 2620 OID 24036)
-- Name: agrega tg_agrega_after_update_adjust_venda_montante; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_agrega_after_update_adjust_venda_montante AFTER UPDATE ON tweeks.agrega FOR EACH ROW EXECUTE FUNCTION rule.tg_agrega_after_update_adjust_venda_montante();


--
-- TOC entry 4265 (class 2620 OID 24037)
-- Name: amortizacao tg_amortizacao_afeter_insert_syncronize_montante; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_amortizacao_afeter_insert_syncronize_montante AFTER INSERT ON tweeks.amortizacao FOR EACH ROW EXECUTE FUNCTION rule.tg_amortizacao_afeter_insert_syncronize_montante();


--
-- TOC entry 4249 (class 2620 OID 24038)
-- Name: artigo tg_artigo_after_update_sync_name; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_artigo_after_update_sync_name AFTER UPDATE ON tweeks.artigo FOR EACH ROW EXECUTE FUNCTION rule.tg_artigo_after_update_sync_name();


--
-- TOC entry 4250 (class 2620 OID 24039)
-- Name: caixa tg_caixa_after_insert_abrir_posto; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_caixa_after_insert_abrir_posto AFTER INSERT ON tweeks.caixa FOR EACH ROW EXECUTE FUNCTION rule.tg_caixa_after_insert_abrir_posto();


--
-- TOC entry 4251 (class 2620 OID 24040)
-- Name: caixa tg_caixa_after_updade_fechar_posto; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_caixa_after_updade_fechar_posto AFTER UPDATE ON tweeks.caixa FOR EACH ROW EXECUTE FUNCTION rule.tg_caixa_after_updade_fechar_posto();


--
-- TOC entry 4252 (class 2620 OID 24041)
-- Name: conta tg_conta_after_insert_close_mesa; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_conta_after_insert_close_mesa AFTER INSERT ON tweeks.conta FOR EACH ROW EXECUTE FUNCTION rule.tg_conta_after_insert_close_mesa();


--
-- TOC entry 4253 (class 2620 OID 24042)
-- Name: conta tg_conta_after_update_adjust_venda_estado; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_conta_after_update_adjust_venda_estado AFTER UPDATE ON tweeks.conta FOR EACH ROW EXECUTE FUNCTION rule.tg_conta_after_update_adjust_venda_estado();


--
-- TOC entry 4254 (class 2620 OID 24043)
-- Name: conta tg_conta_after_update_change_mesa_esatdo; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_conta_after_update_change_mesa_esatdo AFTER UPDATE ON tweeks.conta FOR EACH ROW EXECUTE FUNCTION rule.tg_conta_after_update_change_mesa_esatdo();


--
-- TOC entry 4266 (class 2620 OID 24044)
-- Name: entrada tg_entrada_after_insert_create_movimento; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_entrada_after_insert_create_movimento AFTER INSERT ON tweeks.entrada FOR EACH ROW EXECUTE FUNCTION rule.tg_entrada_after_insert_create_movimento();


--
-- TOC entry 4255 (class 2620 OID 24045)
-- Name: link tg_link_after_update_syncronize_sublinks; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_link_after_update_syncronize_sublinks AFTER UPDATE ON tweeks.link FOR EACH ROW EXECUTE FUNCTION rule.tg_link_after_update_syncronize_sublinks();


--
-- TOC entry 4245 (class 2620 OID 24049)
-- Name: movimento tg_movimento_after_insert_adjust_stock; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_movimento_after_insert_adjust_stock AFTER INSERT ON tweeks.movimento FOR EACH ROW EXECUTE FUNCTION rule.tg_movimento_after_insert_adjust_stock();


--
-- TOC entry 4246 (class 2620 OID 24050)
-- Name: movimento tg_movimento_after_update_adjust_stock; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_movimento_after_update_adjust_stock AFTER UPDATE ON tweeks.movimento FOR EACH ROW EXECUTE FUNCTION rule.tg_movimento_after_update_adjust_stock();


--
-- TOC entry 4247 (class 2620 OID 24051)
-- Name: precario tg_precario_after_insert_updade_custo; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_precario_after_insert_updade_custo AFTER INSERT ON tweeks.precario FOR EACH ROW EXECUTE FUNCTION rule.tg_precario_after_insert_update_custo();


--
-- TOC entry 4256 (class 2620 OID 24052)
-- Name: stock tg_stock_afetr_update; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_stock_afetr_update AFTER UPDATE ON tweeks.stock FOR EACH ROW EXECUTE FUNCTION rule.tg_stock_after_update();


--
-- TOC entry 4257 (class 2620 OID 24053)
-- Name: stock tg_stock_before_insert_or_update_check_quantidade; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_stock_before_insert_or_update_check_quantidade BEFORE INSERT OR UPDATE ON tweeks.stock FOR EACH ROW EXECUTE FUNCTION rule.tg_stock_before_insert_or_update_check_quantidade();


--
-- TOC entry 4248 (class 2620 OID 24054)
-- Name: transacao tg_transacao_after_insert_adjust_posto_montante; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_transacao_after_insert_adjust_posto_montante AFTER INSERT ON tweeks.transacao FOR EACH ROW EXECUTE FUNCTION rule.tg_transacao_after_insert_adjust_posto_montante();


--
-- TOC entry 4268 (class 2620 OID 24055)
-- Name: transferencia tg_transferencia_after_insert_creante_movimento; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_transferencia_after_insert_creante_movimento AFTER INSERT ON tweeks.transferencia FOR EACH ROW EXECUTE FUNCTION rule.tg_transferencia_after_insert_creante_movimento();


--
-- TOC entry 4258 (class 2620 OID 24056)
-- Name: venda tg_venda_after_insert_create_movimento; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_venda_after_insert_create_movimento AFTER INSERT ON tweeks.venda FOR EACH ROW EXECUTE FUNCTION rule.tg_venda_after_insert_create_movimento();


--
-- TOC entry 4259 (class 2620 OID 24057)
-- Name: venda tg_venda_after_update_adjust_agrega_estado; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_venda_after_update_adjust_agrega_estado AFTER UPDATE ON tweeks.venda FOR EACH ROW EXECUTE FUNCTION rule.tg_venda_after_update_adjust_agrega_estado();


--
-- TOC entry 4260 (class 2620 OID 24058)
-- Name: venda tg_venda_after_update_adjust_conta_montante; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_venda_after_update_adjust_conta_montante AFTER UPDATE ON tweeks.venda FOR EACH ROW EXECUTE FUNCTION rule.tg_venda_after_update_adjust_conta_montante();


--
-- TOC entry 4261 (class 2620 OID 24059)
-- Name: venda tg_venda_after_update_create_or_cansel_movimento; Type: TRIGGER; Schema: tweeks; Owner: -
--

CREATE TRIGGER tg_venda_after_update_create_or_cansel_movimento AFTER UPDATE ON tweeks.venda FOR EACH ROW EXECUTE FUNCTION rule.tg_venda_after_update_create_or_cansel_movimento();


--
-- TOC entry 4159 (class 2606 OID 24060)
-- Name: acesso fk_acesso_to_colaborador; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.acesso
    ADD CONSTRAINT fk_acesso_to_colaborador FOREIGN KEY (acesso_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4160 (class 2606 OID 24065)
-- Name: acesso fk_acesso_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.acesso
    ADD CONSTRAINT fk_acesso_to_colaborador_atualizacao FOREIGN KEY (acesso_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4161 (class 2606 OID 24070)
-- Name: acesso fk_acesso_to_colaborador_propetario; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.acesso
    ADD CONSTRAINT fk_acesso_to_colaborador_propetario FOREIGN KEY (acesso_colaborador_propetario) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4162 (class 2606 OID 24075)
-- Name: acesso fk_acesso_to_menu; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.acesso
    ADD CONSTRAINT fk_acesso_to_menu FOREIGN KEY (acesso_menu_id) REFERENCES auth.menu(menu_id);


--
-- TOC entry 4163 (class 2606 OID 24080)
-- Name: autenticacao fk_autenticacao_to_colaborador; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.autenticacao
    ADD CONSTRAINT fk_autenticacao_to_colaborador FOREIGN KEY (autenticacao_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4086 (class 2606 OID 24085)
-- Name: colaborador fk_colaborador_to_colaborador; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT fk_colaborador_to_colaborador FOREIGN KEY (colaborador_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4087 (class 2606 OID 24090)
-- Name: colaborador fk_colaborador_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT fk_colaborador_to_colaborador_atualizacao FOREIGN KEY (colaborador_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4088 (class 2606 OID 24095)
-- Name: colaborador fk_colaborador_to_espaco_auth; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT fk_colaborador_to_espaco_auth FOREIGN KEY (colaborador_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4089 (class 2606 OID 24100)
-- Name: colaborador fk_colaborador_to_tsexo; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.colaborador
    ADD CONSTRAINT fk_colaborador_to_tsexo FOREIGN KEY (colaborador_tsexo_id) REFERENCES auth.tsexo(tsexo_id);


--
-- TOC entry 4164 (class 2606 OID 24105)
-- Name: menu fk_menu_to_menu; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.menu
    ADD CONSTRAINT fk_menu_to_menu FOREIGN KEY (menu_menu_id) REFERENCES auth.menu(menu_id);


--
-- TOC entry 4090 (class 2606 OID 24110)
-- Name: perfil fk_perfil_to_colaborador; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.perfil
    ADD CONSTRAINT fk_perfil_to_colaborador FOREIGN KEY (perfil_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4091 (class 2606 OID 24115)
-- Name: perfil fk_perfil_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.perfil
    ADD CONSTRAINT fk_perfil_to_colaborador_atualizacao FOREIGN KEY (perfil_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4092 (class 2606 OID 24120)
-- Name: perfil fk_perfil_to_perfil; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.perfil
    ADD CONSTRAINT fk_perfil_to_perfil FOREIGN KEY (perfil_perfil_id) REFERENCES auth.perfil(perfil_id);


--
-- TOC entry 4165 (class 2606 OID 24125)
-- Name: privilegio fk_privilegio_to_colaborador; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.privilegio
    ADD CONSTRAINT fk_privilegio_to_colaborador FOREIGN KEY (privilegio_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4166 (class 2606 OID 24130)
-- Name: privilegio fk_privilegio_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.privilegio
    ADD CONSTRAINT fk_privilegio_to_colaborador_atualizacao FOREIGN KEY (privilegio_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4167 (class 2606 OID 24135)
-- Name: privilegio fk_privilegio_to_menu; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.privilegio
    ADD CONSTRAINT fk_privilegio_to_menu FOREIGN KEY (privilegio_menu_id) REFERENCES auth.menu(menu_id);


--
-- TOC entry 4168 (class 2606 OID 24140)
-- Name: privilegio fk_privilegio_to_perfil; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.privilegio
    ADD CONSTRAINT fk_privilegio_to_perfil FOREIGN KEY (previlegio_perfil_id) REFERENCES auth.perfil(perfil_id);



--
-- TOC entry 4125 (class 2606 OID 24250)
-- Name: classe classe_classe_classe_id_fk; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT classe_classe_classe_id_fk FOREIGN KEY (classe_classe_id) REFERENCES tweeks.classe(classe_id);


--
-- TOC entry 4190 (class 2606 OID 24255)
-- Name: acerto fk_acerto_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.acerto
    ADD CONSTRAINT fk_acerto_to_colaborador FOREIGN KEY (acerto_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4191 (class 2606 OID 24260)
-- Name: acerto fk_acerto_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.acerto
    ADD CONSTRAINT fk_acerto_to_espaco_auth FOREIGN KEY (acerto_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4192 (class 2606 OID 24265)
-- Name: acerto fk_acerto_to_stock; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.acerto
    ADD CONSTRAINT fk_acerto_to_stock FOREIGN KEY (acerto_stock_id) REFERENCES tweeks.stock(stock_id);


--
-- TOC entry 4193 (class 2606 OID 24270)
-- Name: agrega fk_agrega_to_artigo_item; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT fk_agrega_to_artigo_item FOREIGN KEY (agrega_artigo_item) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4194 (class 2606 OID 24275)
-- Name: agrega fk_agrega_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT fk_agrega_to_colaborador FOREIGN KEY (agrega_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4195 (class 2606 OID 24280)
-- Name: agrega fk_agrega_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT fk_agrega_to_colaborador_atualizacao FOREIGN KEY (agrega_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4196 (class 2606 OID 24285)
-- Name: agrega fk_agrega_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--
;
ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT fk_agrega_to_espaco_auth FOREIGN KEY (agrega_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4197 (class 2606 OID 24290)
-- Name: agrega fk_agrega_to_venda; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.agrega
    ADD CONSTRAINT fk_agrega_to_venda FOREIGN KEY (agrega_venda_id) REFERENCES tweeks.venda(venda_id);


--
-- TOC entry 4198 (class 2606 OID 24295)
-- Name: amortizacao fk_amortizacao_to_caixa; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_caixa FOREIGN KEY (amortizacao_caixa_id) REFERENCES tweeks.caixa(caixa_id);


--
-- TOC entry 4199 (class 2606 OID 24300)
-- Name: amortizacao fk_amortizacao_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_colaborador FOREIGN KEY (amortizacao_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4200 (class 2606 OID 24305)
-- Name: amortizacao fk_amortizacao_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_colaborador_atualizacao FOREIGN KEY (amortizacao_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4201 (class 2606 OID 24310)
-- Name: amortizacao fk_amortizacao_to_currency; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_currency FOREIGN KEY (amortizacao_currency_id) REFERENCES geoinfo.currency(currency_id);


--
-- TOC entry 4202 (class 2606 OID 24315)
-- Name: amortizacao fk_amortizacao_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_espaco_auth FOREIGN KEY (amortizacao_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4203 (class 2606 OID 24320)
-- Name: amortizacao fk_amortizacao_to_tpaga; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.amortizacao
    ADD CONSTRAINT fk_amortizacao_to_tpaga FOREIGN KEY (amortizacao_tpaga_id) REFERENCES tweeks.tpaga(tpaga_id);


--
-- TOC entry 4120 (class 2606 OID 26977)
-- Name: artigo fk_artigo_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT fk_artigo_to_artigo FOREIGN KEY (artigo_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4116 (class 2606 OID 24325)
-- Name: artigo fk_artigo_to_classe; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT fk_artigo_to_classe FOREIGN KEY (artigo_classe_id) REFERENCES tweeks.classe(classe_id);


--
-- TOC entry 4117 (class 2606 OID 24330)
-- Name: artigo fk_artigo_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT fk_artigo_to_colaborador FOREIGN KEY (artigo_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4118 (class 2606 OID 24335)
-- Name: artigo fk_artigo_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT fk_artigo_to_colaborador_atualizacao FOREIGN KEY (artigo_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4119 (class 2606 OID 24340)
-- Name: artigo fk_artigo_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.artigo
    ADD CONSTRAINT fk_artigo_to_espaco_auth FOREIGN KEY (artigo_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4121 (class 2606 OID 24345)
-- Name: caixa fk_caixa_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.caixa
    ADD CONSTRAINT fk_caixa_to_colaborador FOREIGN KEY (caixa_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4122 (class 2606 OID 24350)
-- Name: caixa fk_caixa_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.caixa
    ADD CONSTRAINT fk_caixa_to_colaborador_atualizacao FOREIGN KEY (caixa_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4123 (class 2606 OID 24355)
-- Name: caixa fk_caixa_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.caixa
    ADD CONSTRAINT fk_caixa_to_espaco_auth FOREIGN KEY (caixa_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4124 (class 2606 OID 24360)
-- Name: caixa fk_caixa_to_posto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.caixa
    ADD CONSTRAINT fk_caixa_to_posto FOREIGN KEY (caixa_posto_id) REFERENCES tweeks.posto(posto_id);


--
-- TOC entry 4204 (class 2606 OID 24365)
-- Name: cambio fk_cambio_to_currency; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.cambio
    ADD CONSTRAINT fk_cambio_to_currency FOREIGN KEY (cambio_currency_id) REFERENCES geoinfo.currency(currency_id);


--
-- TOC entry 4205 (class 2606 OID 24370)
-- Name: cambio fk_cambio_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.cambio
    ADD CONSTRAINT fk_cambio_to_espaco_auth FOREIGN KEY (cambio_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4244 (class 2606 OID 36874)
-- Name: ccorrente fk_ccorrente_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.ccorrente
    ADD CONSTRAINT fk_ccorrente_to_espaco FOREIGN KEY (ccorrente_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4126 (class 2606 OID 24375)
-- Name: classe fk_classe_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT fk_classe_to_colaborador FOREIGN KEY (classe_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4127 (class 2606 OID 24380)
-- Name: classe fk_classe_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT fk_classe_to_colaborador_atualizacao FOREIGN KEY (classe_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4128 (class 2606 OID 24385)
-- Name: classe fk_classe_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.classe
    ADD CONSTRAINT fk_classe_to_espaco_auth FOREIGN KEY (classe_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4129 (class 2606 OID 24390)
-- Name: conta fk_conta_to_caixa_fechopagamento; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_caixa_fechopagamento FOREIGN KEY (conta_caixa_fechopagamento) REFERENCES tweeks.caixa(caixa_id);


--
-- TOC entry 4130 (class 2606 OID 24395)
-- Name: conta fk_conta_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_colaborador FOREIGN KEY (conta_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4131 (class 2606 OID 24400)
-- Name: conta fk_conta_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_colaborador_atualizacao FOREIGN KEY (conta_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4132 (class 2606 OID 24405)
-- Name: conta fk_conta_to_currency; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_currency FOREIGN KEY (conta_currency_id) REFERENCES geoinfo.currency(currency_id);


--
-- TOC entry 4133 (class 2606 OID 24410)
-- Name: conta fk_conta_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_espaco_auth FOREIGN KEY (conta_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4134 (class 2606 OID 24415)
-- Name: conta fk_conta_to_mesa; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_mesa FOREIGN KEY (conta_mesa_id) REFERENCES tweeks.mesa(mesa_id);


--
-- TOC entry 4135 (class 2606 OID 24420)
-- Name: conta fk_conta_to_posto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_posto FOREIGN KEY (conta_posto_id) REFERENCES tweeks.posto(posto_id);


--
-- TOC entry 4136 (class 2606 OID 24425)
-- Name: conta fk_conta_to_tpaga; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.conta
    ADD CONSTRAINT fk_conta_to_tpaga FOREIGN KEY (conta_tpaga_id) REFERENCES tweeks.tpaga(tpaga_id);


--
-- TOC entry 4206 (class 2606 OID 24430)
-- Name: dispoe fk_dispoe_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT fk_dispoe_to_artigo FOREIGN KEY (dispoe_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4207 (class 2606 OID 24435)
-- Name: dispoe fk_dispoe_to_artigo_item; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT fk_dispoe_to_artigo_item FOREIGN KEY (dispoe_artigo_item) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4208 (class 2606 OID 24440)
-- Name: dispoe fk_dispoe_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT fk_dispoe_to_colaborador FOREIGN KEY (dispoe_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4209 (class 2606 OID 24445)
-- Name: dispoe fk_dispoe_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT fk_dispoe_to_colaborador_atualizacao FOREIGN KEY (dispoe_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4210 (class 2606 OID 24450)
-- Name: dispoe fk_dispoe_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.dispoe
    ADD CONSTRAINT fk_dispoe_to_espaco_auth FOREIGN KEY (dispoe_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4211 (class 2606 OID 24455)
-- Name: entrada fk_entrada_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_artigo FOREIGN KEY (entrada_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4212 (class 2606 OID 24460)
-- Name: entrada fk_entrada_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_colaborador FOREIGN KEY (entrada_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4213 (class 2606 OID 24465)
-- Name: entrada fk_entrada_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_colaborador_atualizacao FOREIGN KEY (entrada_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4214 (class 2606 OID 24470)
-- Name: entrada fk_entrada_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_espaco FOREIGN KEY (entrada_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4215 (class 2606 OID 24475)
-- Name: entrada fk_entrada_to_espaco_destito; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_espaco_destito FOREIGN KEY (entrada_espaco_destino) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4216 (class 2606 OID 24480)
-- Name: entrada fk_entrada_to_fornecedor; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.entrada
    ADD CONSTRAINT fk_entrada_to_fornecedor FOREIGN KEY (entrada_fornecedor_id) REFERENCES tweeks.fornecedor(fornecedor_id);


--
-- TOC entry 4093 (class 2606 OID 24485)
-- Name: espaco fk_espaco_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT fk_espaco_to_colaborador FOREIGN KEY (espaco_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4094 (class 2606 OID 24490)
-- Name: espaco fk_espaco_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT fk_espaco_to_colaborador_atualizacao FOREIGN KEY (espaco_colaborador_atualizaco) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4095 (class 2606 OID 24495)
-- Name: espaco fk_espaco_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT fk_espaco_to_espaco FOREIGN KEY (espaco_espaco_id) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4096 (class 2606 OID 24500)
-- Name: espaco fk_espaco_to_tespaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.espaco
    ADD CONSTRAINT fk_espaco_to_tespaco FOREIGN KEY (espaco_tespaco_id) REFERENCES tweeks.tespaco(tespaco_id);


--
-- TOC entry 4217 (class 2606 OID 24505)
-- Name: fornecedor fk_fornecedor_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT fk_fornecedor_to_colaborador FOREIGN KEY (fornecedor_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4218 (class 2606 OID 24510)
-- Name: fornecedor fk_fornecedor_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT fk_fornecedor_to_colaborador_atualizacao FOREIGN KEY (fornecedor_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4219 (class 2606 OID 24515)
-- Name: fornecedor fk_fornecedor_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.fornecedor
    ADD CONSTRAINT fk_fornecedor_to_espaco_auth FOREIGN KEY (fornecedor_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4220 (class 2606 OID 24520)
-- Name: imposto fk_imposto_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_artigo FOREIGN KEY (imposto_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4221 (class 2606 OID 24525)
-- Name: imposto fk_imposto_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_colaborador FOREIGN KEY (imposto_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4222 (class 2606 OID 24530)
-- Name: imposto fk_imposto_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_colaborador_atualizacao FOREIGN KEY (imposto_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4223 (class 2606 OID 24535)
-- Name: imposto fk_imposto_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_espaco_auth FOREIGN KEY (imposto_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4224 (class 2606 OID 24540)
-- Name: imposto fk_imposto_to_taplicar; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_taplicar FOREIGN KEY (imposto_taplicar_id) REFERENCES tweeks.taplicar(taplicar_id);


--
-- TOC entry 4225 (class 2606 OID 24545)
-- Name: imposto fk_imposto_to_tipoimposto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.imposto
    ADD CONSTRAINT fk_imposto_to_tipoimposto FOREIGN KEY ( imposto_tipoimposto_id) REFERENCES tweeks.tipoimposto(tipoimposto_id);


--
-- TOC entry 4226 (class 2606 OID 24550)
-- Name: impostovenda fk_impostovenda_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT fk_impostovenda_to_colaborador FOREIGN KEY (impostovenda_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4227 (class 2606 OID 24555)
-- Name: impostovenda fk_impostovenda_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT fk_impostovenda_to_colaborador_atualizacao FOREIGN KEY (impostovenda_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4228 (class 2606 OID 24560)
-- Name: impostovenda fk_impostovenda_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT fk_impostovenda_to_espaco_auth FOREIGN KEY (impostovenda_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4229 (class 2606 OID 24565)
-- Name: impostovenda fk_impostovenda_to_tipovenda; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT fk_impostovenda_to_tipovenda FOREIGN KEY (impostovenda_tipoimposto_id) REFERENCES tweeks.tipoimposto(tipoimposto_id);


--
-- TOC entry 4230 (class 2606 OID 24570)
-- Name: impostovenda fk_impostovenda_to_venda; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.impostovenda
    ADD CONSTRAINT fk_impostovenda_to_venda FOREIGN KEY (impostovenda_venda_id) REFERENCES tweeks.venda(venda_id);


--
-- TOC entry 4137 (class 2606 OID 24575)
-- Name: link fk_link_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE tweeks.link
    ADD CONSTRAINT fk_link_to_colaborador FOREIGN KEY (link_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4138 (class 2606 OID 24587)
-- Name: link fk_link_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE tweeks.link
    ADD CONSTRAINT fk_link_to_colaborador_atualizacao FOREIGN KEY (link_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4139 (class 2606 OID 24599)
-- Name: link fk_link_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE tweeks.link
    ADD CONSTRAINT fk_link_to_espaco_auth FOREIGN KEY (link_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4140 (class 2606 OID 24611)
-- Name: link fk_link_to_espaco_destino; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE tweeks.link
    ADD CONSTRAINT fk_link_to_espaco_destino FOREIGN KEY (link_espaco_destino) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4141 (class 2606 OID 24623)
-- Name: link fk_link_to_tlink; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE tweeks.link
    ADD CONSTRAINT fk_link_to_tlink FOREIGN KEY (link_tlink_id) REFERENCES tweeks.tlink(tlink_id);


--
-- TOC entry 4142 (class 2606 OID 24635)
-- Name: mesa fk_mesa_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.mesa
    ADD CONSTRAINT fk_mesa_to_colaborador FOREIGN KEY (mesa_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4143 (class 2606 OID 24640)
-- Name: mesa fk_mesa_to_colaborador_atualizao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.mesa
    ADD CONSTRAINT fk_mesa_to_colaborador_atualizao FOREIGN KEY (mesa_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4144 (class 2606 OID 24645)
-- Name: mesa fk_mesa_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.mesa
    ADD CONSTRAINT fk_mesa_to_espaco_auth FOREIGN KEY (mesa_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4097 (class 2606 OID 24650)
-- Name: movimento fk_movimento_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_colaborador FOREIGN KEY (movimento_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4098 (class 2606 OID 24655)
-- Name: movimento fk_movimento_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_colaborador_atualizacao FOREIGN KEY (movimento_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4099 (class 2606 OID 24660)
-- Name: movimento fk_movimento_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_espaco_auth FOREIGN KEY (movimento_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4100 (class 2606 OID 24665)
-- Name: movimento fk_movimento_to_stock; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_stock FOREIGN KEY (movimento_stock_id) REFERENCES tweeks.stock(stock_id);


--
-- TOC entry 4101 (class 2606 OID 24670)
-- Name: movimento fk_movimento_to_tmovimento; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_tmovimento FOREIGN KEY (movimento_tmovimento_id) REFERENCES tweeks.tmovimento(tmovimento_id);


--
-- TOC entry 4102 (class 2606 OID 24675)
-- Name: movimento fk_movimento_to_toperacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.movimento
    ADD CONSTRAINT fk_movimento_to_toperacao FOREIGN KEY (movimento_toperacao_id) REFERENCES tweeks.toperacao(toperacao_id);


--
-- TOC entry 4145 (class 2606 OID 24680)
-- Name: posto fk_posto_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT fk_posto_to_colaborador FOREIGN KEY (posto_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4146 (class 2606 OID 24685)
-- Name: posto fk_posto_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT fk_posto_to_colaborador_atualizacao FOREIGN KEY (posto_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4147 (class 2606 OID 24690)
-- Name: posto fk_posto_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT fk_posto_to_espaco FOREIGN KEY (posto_espaco_auth) REFERENCES tweeks.espaco(espaco_id) ON UPDATE CASCADE;


--
-- TOC entry 4148 (class 2606 OID 24695)
-- Name: posto fk_posto_to_espaco_destino; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT fk_posto_to_espaco_destino FOREIGN KEY (posto_espaco_destino) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4149 (class 2606 OID 24700)
-- Name: posto fk_posto_to_tposto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.posto
    ADD CONSTRAINT fk_posto_to_tposto FOREIGN KEY (posto_tposto_id) REFERENCES tweeks.tposto(tposto_id);


--
-- TOC entry 4103 (class 2606 OID 24705)
-- Name: precario fk_precario_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.precario
    ADD CONSTRAINT fk_precario_to_colaborador FOREIGN KEY (precario_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4104 (class 2606 OID 24710)
-- Name: precario fk_precario_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.precario
    ADD CONSTRAINT fk_precario_to_colaborador_atualizacao FOREIGN KEY (precario_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4105 (class 2606 OID 24715)
-- Name: precario fk_precario_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.precario
    ADD CONSTRAINT fk_precario_to_espaco_auth FOREIGN KEY (precario_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4150 (class 2606 OID 24720)
-- Name: stock fk_stock_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.stock
    ADD CONSTRAINT fk_stock_colaborador FOREIGN KEY (stock_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4151 (class 2606 OID 24725)
-- Name: stock fk_stock_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.stock
    ADD CONSTRAINT fk_stock_colaborador_atualizacao FOREIGN KEY (stock_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4152 (class 2606 OID 24730)
-- Name: stock fk_stock_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.stock
    ADD CONSTRAINT fk_stock_to_artigo FOREIGN KEY (stock_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4153 (class 2606 OID 24735)
-- Name: stock fk_stock_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.stock
    ADD CONSTRAINT fk_stock_to_espaco FOREIGN KEY (stock_espacao_id) REFERENCES tweeks.espaco(espaco_id) ON UPDATE CASCADE;


--
-- TOC entry 4106 (class 2606 OID 24740)
-- Name: taxa fk_taxa_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taxa
    ADD CONSTRAINT fk_taxa_to_colaborador FOREIGN KEY (taxa_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4107 (class 2606 OID 24745)
-- Name: taxa fk_taxa_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taxa
    ADD CONSTRAINT fk_taxa_to_colaborador_atualizacao FOREIGN KEY (taxa_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4108 (class 2606 OID 24750)
-- Name: taxa fk_taxa_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taxa
    ADD CONSTRAINT fk_taxa_to_espaco_auth FOREIGN KEY (taxa_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4109 (class 2606 OID 24755)
-- Name: taxa fk_taxa_to_tipoimposto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.taxa
    ADD CONSTRAINT fk_taxa_to_tipoimposto FOREIGN KEY (taxa_tipoimposto_id) REFERENCES tweeks.tipoimposto(tipoimposto_id);


--
-- TOC entry 4242 (class 2606 OID 24760)
-- Name: tipoimposto fk_tipoimposto_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tipoimposto
    ADD CONSTRAINT fk_tipoimposto_to_colaborador FOREIGN KEY (tipoimposto_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4243 (class 2606 OID 24765)
-- Name: tipoimposto fk_tipoimposto_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.tipoimposto
    ADD CONSTRAINT fk_tipoimposto_to_colaborador_atualizacao FOREIGN KEY (tipoimposto_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4231 (class 2606 OID 24770)
-- Name: trabalha fk_trabalha_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_colaborador FOREIGN KEY (trabalha_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4232 (class 2606 OID 24775)
-- Name: trabalha fk_trabalha_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_colaborador_atualizacao FOREIGN KEY (trabalha_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4233 (class 2606 OID 24780)
-- Name: trabalha fk_trabalha_to_colaborador_proprietario; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_colaborador_proprietario FOREIGN KEY (trabalha_colaborador_proprietario) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4234 (class 2606 OID 24785)
-- Name: trabalha fk_trabalha_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_espaco_auth FOREIGN KEY (trabalha_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4235 (class 2606 OID 24790)
-- Name: trabalha fk_trabalha_to_espaco_detino; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_espaco_detino FOREIGN KEY (trabalha_espaco_destino) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4236 (class 2606 OID 24795)
-- Name: trabalha fk_trabalha_to_perfil; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.trabalha
    ADD CONSTRAINT fk_trabalha_to_perfil FOREIGN KEY (trabalha_perfil_id) REFERENCES auth.perfil(perfil_id);


--
-- TOC entry 4110 (class 2606 OID 24800)
-- Name: transacao fk_transacao_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_colaborador FOREIGN KEY (transacao_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4111 (class 2606 OID 24805)
-- Name: transacao fk_transacao_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_colaborador_atualizacao FOREIGN KEY (transacao_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4112 (class 2606 OID 24810)
-- Name: transacao fk_transacao_to_espaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_espaco_auth FOREIGN KEY (transacao_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4113 (class 2606 OID 24815)
-- Name: transacao fk_transacao_to_posto; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_posto FOREIGN KEY (transacao_posto_id) REFERENCES tweeks.posto(posto_id);


--
-- TOC entry 4114 (class 2606 OID 24820)
-- Name: transacao fk_transacao_to_tmovimento; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_tmovimento FOREIGN KEY (transacao_tmovimento_id) REFERENCES tweeks.tmovimento(tmovimento_id);


--
-- TOC entry 4115 (class 2606 OID 24825)
-- Name: transacao fk_transacao_to_toperacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transacao
    ADD CONSTRAINT fk_transacao_to_toperacao FOREIGN KEY (transacao_toperacao_id) REFERENCES tweeks.toperacao(toperacao_id);


--
-- TOC entry 4237 (class 2606 OID 24830)
-- Name: transferencia fk_transferencia_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT fk_transferencia_to_colaborador FOREIGN KEY (transferencia_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4238 (class 2606 OID 24835)
-- Name: transferencia fk_transferencia_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT fk_transferencia_to_colaborador_atualizacao FOREIGN KEY (transferencia_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4239 (class 2606 OID 24840)
-- Name: transferencia fk_transferencia_to_estaco_auth; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT fk_transferencia_to_estaco_auth FOREIGN KEY (transferencia_espaco_auth) REFERENCES tweeks.espaco(espaco_id);


--
-- TOC entry 4240 (class 2606 OID 24845)
-- Name: transferencia fk_transferencia_to_stock_destino; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT fk_transferencia_to_stock_destino FOREIGN KEY (transferencia_stock_destino) REFERENCES tweeks.stock(stock_id);


--
-- TOC entry 4241 (class 2606 OID 24850)
-- Name: transferencia fk_transferencia_to_stock_origem; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.transferencia
    ADD CONSTRAINT fk_transferencia_to_stock_origem FOREIGN KEY (transferencia_stock_origem) REFERENCES tweeks.stock(stock_id);


--
-- TOC entry 4154 (class 2606 OID 24855)
-- Name: venda fk_venda_to_artigo; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT fk_venda_to_artigo FOREIGN KEY (venda_artigo_id) REFERENCES tweeks.artigo(artigo_id);


--
-- TOC entry 4155 (class 2606 OID 24860)
-- Name: venda fk_venda_to_colaborador; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT fk_venda_to_colaborador FOREIGN KEY (venda_colaborador_id) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4156 (class 2606 OID 24865)
-- Name: venda fk_venda_to_colaborador_atualizacao; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT fk_venda_to_colaborador_atualizacao FOREIGN KEY (venda_colaborador_atualizacao) REFERENCES auth.colaborador(colaborador_id);


--
-- TOC entry 4157 (class 2606 OID 24870)
-- Name: venda fk_venda_to_conta; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT fk_venda_to_conta FOREIGN KEY (venda_conta_id) REFERENCES tweeks.conta(conta_id);


--
-- TOC entry 4158 (class 2606 OID 24875)
-- Name: venda fk_venda_to_espaco; Type: FK CONSTRAINT; Schema: tweeks; Owner: -
--

ALTER TABLE ONLY tweeks.venda
    ADD CONSTRAINT fk_venda_to_espaco FOREIGN KEY (venda_espaco_auth) REFERENCES tweeks.espaco(espaco_id) ON UPDATE CASCADE;


-- Completed on 2021-05-30 12:55:07

--
-- PostgreSQL database dump complete
--

