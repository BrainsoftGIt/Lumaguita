import {sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";

export const __sets_generate_documento = sql`
drop function if exists tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer);
drop function if exists tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer, arg_serie_id int );
drop function if exists tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer, arg_serie_id uuid );
create or replace function tweeks.__sets_generate_documento(
  arg_espaco_auth uuid,
  arg_tserie integer,
  arg_serie_id uuid default null
)
  returns TABLE(document character varying, serie_id uuid, serie_numero character varying, serie_numatorizacao character varying, serie_numcertificacao character varying, serie_sequencia bigint, serie_quantidade bigint, autorizacao_uid uuid, autorizacao_ano integer, autorizacao_numero character varying)
  language plpgsql
as
$$
declare
  _serie tweeks.serie;
  _numero_documento varchar;
  ___branch uuid default tweeks.__branch_uid( null, arg_espaco_auth );
  _const map.constant;
  _espaco tweeks.espaco;
  _tserie tweeks.tserie;
  _iterate int default 0;
  _autorizacao tweeks.autorizacao;
  _data record;
begin
    _const := map.constant();
    
    select * into _tserie
      from tweeks.tserie ts
      where ts.tserie_id = arg_tserie
    ;

    -- Obter o espaço superior que pode gerar numero de seire
    with recursive __espaco as (
      select e.*, e.espaco_gerarfatura as __generate_serie
      from tweeks.espaco e
      where e.espaco_id =arg_espaco_auth
      union all
      select w.*, w.espaco_gerarfatura
        from __espaco _e
          inner join tweeks.espaco w on _e.espaco_espaco_id = w.espaco_id
        and not _e.__generate_serie
    ) select * into _espaco from __espaco __e
      where __e.__generate_serie
    ;
    
    select
        count( * ) as total_serie
      from tweeks.serie s
        inner join tweeks.autorizacao a on s.serie_autorizacao_uid = a.autorizacao_uid
      where s.serie_autorizacao_uid = a.autorizacao_uid
        and s._branch_uid = ___branch
        and a._branch_uid = ___branch
        and s.serie_espaco_id = _espaco.espaco_id
        and s.serie_tserie_id = arg_tserie
        and s.serie_estado = _const.maguita_serie_estado_ativo
        and a.autorizacao_estado = _const.maguita_autorizacao_estado_ativo
        and a.autorizacao_ano = extract( years from now() )::int
        and s.serie_id = coalesce( arg_serie_id, s.serie_id )
      into _data
    ;
    
    if _data.total_serie > 1 then
      raise exception '%', format( 'Existe varias series do tipo %I! É necessario especificar qual delas devem ser utilizadas!' );
    end if;

    while _numero_documento is null loop
      update tweeks.serie s
        set serie_sequencia = s.serie_sequencia +1
        from tweeks.autorizacao a
        where s.serie_autorizacao_uid = a.autorizacao_uid
          and s._branch_uid = ___branch
          and a._branch_uid = ___branch
          and s.serie_espaco_id = _espaco.espaco_id
          and s.serie_tserie_id = arg_tserie
          and s.serie_estado = _const.maguita_serie_estado_ativo
          and a.autorizacao_estado = _const.maguita_autorizacao_estado_ativo
          and a.autorizacao_ano = extract( years from now() )::int
          and s.serie_id = coalesce( arg_serie_id, s.serie_id )
      returning * into _serie;

      if _serie.serie_id is null then
        raise exception '%', format( 'Nenhuma serie disponivel para gerar a sequencia para %I!', _tserie.tserie_desc );
      end if;

      if length( _serie.serie_sequencia::text ) > _tserie.tserie_seqlimit::int then
        raise exception '%', format( 'O numero de sequencia excede o tamanho maximo definido para e seire' );
      end if;

      if _serie.serie_sequencia > _serie.serie_quantidade then
        raise exception '%', format( 'Esgotaram todas as series emetidas para a %I! Total de series é de %I.', _tserie.tserie_desc, _serie.serie_quantidade );
      end if;

      _autorizacao := tweeks.__get_autorizacao( _serie.serie_autorizacao_uid );

      -- ex: FT0000119000001
      -- TIPO|FIXA|ANO|SEQUENCIA
      _numero_documento := format(
        '%s%s%s%s',
        _tserie.tserie_code, --TYPE
        lpad( "left"( _serie.serie_numero, _tserie.tserie_numlimit-2), _tserie.tserie_numlimit-2, '0'), --FIXA
        to_char( make_date( _autorizacao.autorizacao_ano, 1, 1 ), 'yy' ), --YEAR
        lpad( _serie.serie_sequencia::text, _tserie.tserie_seqlimit::int,  '0' ) --SEQUENCE
      );

      if _tserie.tserie_id in ( _const.maguita_tserie_fatura, _const.maguita_tserie_faturarecibo )
        and exists(
          select *
            from tweeks.conta c
            where c.conta_numerofatura = _numero_documento
              and c._branch_uid = ___branch
      ) then
        _numero_documento := null;
      end if;

      if _numero_documento is not null
        and _tserie.tserie_id in ( _const.maguita_tserie_recibo, _const.maguita_tserie_faturarecibo )
        and exists(
          select *
            from tweeks.deposito de
            where de.deposito_documento = _numero_documento
              and de._branch_uid = ___branch
      ) then
        _numero_documento := null;
      end if;
      _iterate := _iterate +1;

      if _iterate = 1000 then
        raise exception 'Exedeu o limite de tentativa para geração de numero de serie, por favor proucure pelo suporte.';
      end if;
    end loop;

    __sets_generate_documento.document := _numero_documento;
    __sets_generate_documento.serie_id := _serie.serie_id;
    __sets_generate_documento.serie_sequencia := _serie.serie_sequencia;
    __sets_generate_documento.serie_numero := _serie.serie_numero;
    __sets_generate_documento.serie_quantidade := _serie.serie_quantidade;
    __sets_generate_documento.serie_numatorizacao := _serie.serie_numatorizacao;
    __sets_generate_documento.serie_numcertificacao := _serie.serie_numcertificacao;
    __sets_generate_documento.autorizacao_uid := _autorizacao.autorizacao_uid;
    __sets_generate_documento.autorizacao_ano := _autorizacao.autorizacao_ano;
    __sets_generate_documento.autorizacao_numero := _autorizacao.autorizacao_numero;

    return next;
end
$$
`;

export const setSeries = sql`
create or replace function tweeks.funct_sets_serie(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    args := {
      arg_colaborador_id uuid not null,
      arg_espaco_auth uuid not null,

      serie_id uuid not null,
      serie_tserie_id int2 not null,
      serie_espaco_id uuid not null,
      serie_designacao character varying not null,
      serie_numero character varying not null,
      serie_quantidade int not null,
      serie_numcertificacao,
      serie_numatorizacao
    }
   */

  _serie tweeks.serie;
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
  _tserie tweeks.tserie;
begin
  _const := map.constant();
  _serie := jsonb_populate_record( _serie, args );
  
  select *
    from tweeks.tserie ts
    where ts.tserie_id = _serie.serie_tserie_id
    into _tserie
  ;
  
  if length(_serie.serie_quantidade::text) > _tserie.tserie_seqlimit then
    raise exception '%', format( 'A quantidade definida para a serie para %I ultrapassa o limite previsto de %I!', _tserie.tserie_desc, lpad(''::text,  _tserie.tserie_seqlimit::int, '9'::text) );
  end if;

  if _serie.serie_id is null then
    _serie.serie_colaborador_id := arg_colaborador_id;
    _serie.serie_espaco_auth := arg_espaco_auth;

--     -- Desativar as serie ativa para o espaçoa
--     update tweeks.serie
--       set serie_estado = _const.maguita_serie_estado_fechado,
--           serie_colaborador_atualizacao = arg_colaborador_id,
--           serie_dataatualizacao = current_timestamp
--       where serie_tserie_id = _serie.serie_tserie_id
--         and serie_espaco_id = _serie.serie_espaco_id
--         and _branch_uid = ___branch
--         and serie_estado = _const.maguita_serie_estado_ativo
--     ;
  else
    _serie.serie_colaborador_atualizacao := arg_colaborador_id;
    _serie.serie_dataatualizacao := current_timestamp;
  end if;


  -- Quando for registrar nova serie
  select ( "returning" ).* into _serie
    from lib.sets( _serie );

  return lib.res_true(jsonb_build_object(
    'serie', _serie
  ));
end;
$$;
`;

export const const_serie_estado_anulado = sql`
select map.constant('maguita_serie_estado_anulado', 'int2', -1 );
`;

export const setsAutorizacao = sql `
create or replace function tweeks.funct_sets_autorizacao(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      arg_autorizacao_continue: AUTORIZACAO

      autorizacao_uid: UID
      autorizacao_espaco_uid: UID
      autorizacao_designacao:DESIG
      autorizacao_numero:NUMERO,
      series: [
        {
          serie_id uuid not null,
          serie_tserie_id int2 not null,
          serie_espaco_id uuid not null,
          serie_designacao character varying not null,
          serie_numero character varying not null,
          serie_quantidade int not null,
          serie_numcertificacao,
          serie_numatorizacao
        }
      ]
    }
   */
  _autorizacao tweeks.autorizacao;
  _autorizacao_continue tweeks.autorizacao;
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _res_serie jsonb default jsonb_build_array();
  _next record;
  _data record;
  _const map.constant;
  __serie_aturizacao uuid[] default array(select (e.doc->>'serie_id' )::uuid from jsonb_array_elements( args->'series') e ( doc ));
begin
  _autorizacao := jsonb_populate_record( _autorizacao, args );
  _autorizacao_continue := jsonb_populate_record( _autorizacao_continue, args->'_autorizacao_continue' );
  _const := map.constant();
  
  if _autorizacao.autorizacao_uid is null then
    _autorizacao.autorizacao_colaborador_uid := arg_colaborador_id;
    _autorizacao.autorizacao_espaco_auth := arg_espaco_auth;
    _autorizacao._branch_uid := arg_branch_uid;
    _autorizacao.autorizacao_dataregistro := now();
    _autorizacao.autorizacao_ano := extract( years from now() );
  else
    _autorizacao.autorizacao_colaborador_atualizacao := arg_colaborador_id;
    _autorizacao.autorizacao_dataatualizacao := now();
  end if;
  
  if _autorizacao_continue.autorizacao_uid is null and exists(
    select *
      from jsonb_array_elements( args->'series' ) e ( doc )
        inner join jsonb_populate_record( null::tweeks.serie, e.doc ) sdoc on true
        inner join tweeks.serie s on sdoc.serie_numero = s.serie_numero
          and s.serie_tserie_id = sdoc.serie_tserie_id
          and s._branch_uid = arg_branch_uid
          and s.serie_espaco_auth = arg_espaco_auth
        inner join tweeks.autorizacao a on s.serie_autorizacao_uid = a.autorizacao_uid
          and a._branch_uid = arg_branch_uid
          and a.autorizacao_ano = _autorizacao.autorizacao_ano
          and a.autorizacao_espaco_auth = arg_espaco_auth
      where a.autorizacao_uid != _autorizacao_continue.autorizacao_uid
  ) then
    return lib.res_false( 'Já existe serie com essa numeração registrada' );
  end if;
  
  select ( "returning" ).* into _autorizacao
    from lib.sets( _autorizacao )
  ;
  
  -- Desativar todas as series que não fazem mais parte de autorizacao
  update tweeks.serie
    set serie_estado = _const.maguita_serie_estado_anulado
    where serie_id != all( __serie_aturizacao )
      and serie_autorizacao_uid = _autorizacao.autorizacao_uid
      and serie_estado = _const.maguita_serie_estado_ativo
  ;
  
  for _data in (
    select
        e.document || jsonb_build_object(
          'arg_colaborador_id', arg_colaborador_id,
          'arg_espaco_auth', arg_espaco_auth,
          'serie_autorizacao_uid', _autorizacao.autorizacao_uid
        ) as document_serie
      from jsonb_array_elements( args->'series' ) e ( document )
  ) loop
    select * into _next
      from tweeks.funct_sets_serie( _data.document_serie ) e;
  
    _res_serie := _res_serie || jsonb_build_object(
      'serie', _data.document_serie,
      'result', _next
    );
  end loop;
  
  return lib.res_true( jsonb_build_object(
    'autorizacao', _autorizacao,
    'series', _res_serie
  ));

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end;
$$;
`;
