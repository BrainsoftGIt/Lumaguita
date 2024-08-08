import {patchSQL, sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";


export const alter_serie_add_numlimin_v2 = patchSQL({ unique: true }).sql`
alter table tweeks.tserie add column if not exists tserie_numlimitmin int default null;
`

export const setSeries =  patchSQL({ force:"v1.0.1" }).sql`
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
  
  _serie.serie_numero := lib.str_normalize( _serie.serie_numero );
  
  if _serie.serie_numero is null then 
      raise exception '%', format( 'Numero de serie invalida!' );
  end if;
  
  if length( _serie.serie_numero ) < _tserie.tserie_numlimitmin or length( _serie.serie_numero ) > _tserie.tserie_numlimit then
      raise exception '%', format( 'Numero de serie invalido para %I com designação %I limit [de: %s, até: %s] degitos!', _tserie.tserie_desc, _serie.serie_designacao, _tserie.tserie_numlimitmin, _tserie.tserie_numlimit );
  end if;
  
  if length(_serie.serie_quantidade::text) > _tserie.tserie_seqlimit then
    raise exception '%', format( 'A quantidade definida para a serie para %I ultrapassa o limite previsto de %I!', _tserie.tserie_desc, lpad(''::text,  _tserie.tserie_seqlimit::int, '9'::text) );
  end if;
  
  if substring( _serie.serie_numero from length( _serie.serie_numero )-1 ) != to_char( current_date, 'yy' ) then
    raise exception '%', format( 'O numero de serie introduzido para %I com descrição %I não valido para o ano em curso!', _tserie.tserie_desc, _serie.serie_designacao  );
  end if;
  
  if _serie.serie_id is null then
    _serie.serie_colaborador_id := arg_colaborador_id;
    _serie.serie_espaco_auth := arg_espaco_auth;
  else
    _serie.serie_colaborador_atualizacao := arg_colaborador_id;
    _serie.serie_dataatualizacao := current_timestamp;
  end if;
  
  _serie.serie_estado := null;
  
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

  if exists(
    select *
      from jsonb_array_elements( args->'serie' ) e( doc )
        inner join jsonb_populate_record( null::tweeks.serie, e.doc ) s on true
      where right( s.serie_numero, 2 ) = to_char( current_date, 'yy' )
  ) then
    return lib.res_false('Numero de serie invalido para o ano em curso!' );
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

    if not _next.result then
      raise exception '%', _next.message;
    end if;

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
