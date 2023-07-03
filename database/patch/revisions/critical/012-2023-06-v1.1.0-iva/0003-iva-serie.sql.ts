import {block} from "../../../core/updater";

block( module, { identifier: "iva-structure", flags:[ "@unique" ]} ).sql`
select map.constant( 'maguita_autorizacao_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_autorizacao_estado_fechado', 'int2', 0 );

create table if not exists tweeks.autorizacao(
  autorizacao_uid uuid not null default gen_random_uuid(),
  autorizacao_colaborador_uid uuid not null,
  autorizacao_colaborador_atualizacao uuid,
  autorizacao_espaco_auth uuid not null,
  autorizacao_espaco_uid uuid not null,
  autorizacao_designacao character varying not null,
  autorizacao_ano integer not null,
  autorizacao_numero character varying,
  autorizacao_estado int2 not null default map.get('maguita_autorizacao_estado_ativo')::int2,
  autorizacao_dataregistro timestamp not null default now(),
  autorizacao_dataatualizacao timestamp default null,
  _branch_uid uuid not null,
  constraint pk_autorizacao_uid primary key ( autorizacao_uid ),
  constraint fk_autorizacao_to_espaco foreign key ( autorizacao_espaco_uid )
    references tweeks.espaco
);

alter table tweeks.serie add if not exists serie_autorizacao_uid uuid default null;
alter table tweeks.serie drop constraint if exists fk_serie_to_autorizacao;
alter table tweeks.serie add constraint fk_serie_to_autorizacao
  foreign key ( serie_autorizacao_uid )
  references tweeks.autorizacao
;
`;


block( module, { identifier: "iva-structure-serie_fechoautorizacao", flags:[ "@unique" ]} ).sql`
  alter table tweeks.serie add if not exists serie_fechoautorizacao boolean not null default false;
`;



block( module, { identifier: "iva-serie-functions", flags:[]}).sql
`
create or replace function tweeks.funct_sets_autorizacao(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID

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
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _res_serie jsonb default jsonb_build_array();
  _next record;
  _data record;

begin
  _autorizacao := jsonb_populate_record( _autorizacao, args );
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

  select ( "returning" ).* into _autorizacao
    from lib.sets( _autorizacao );

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
end;
$$;


create or replace function tweeks.__get_autorizacao( uuid )
  returns tweeks.autorizacao
  immutable
  strict
  language sql as $$
    select * from tweeks.autorizacao where autorizacao_uid = $1;
$$;


create or replace function tweeks.funct_change_autorizacao_closeyear(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      autorizacao_uid: UID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _autorizacao tweeks.autorizacao;
  _const map.constant;
begin
  _const := map.constant();
  _autorizacao := jsonb_populate_record( _autorizacao, args );
  _autorizacao := tweeks.__get_autorizacao( _autorizacao._branch_uid );

  if _autorizacao.autorizacao_estado != _const.maguita_autorizacao_estado_ativo then
    return lib.res_false( 'A autorizacao selecionada para fecho já esta encerada!' );
  end if;

  update tweeks.autorizacao
    set autorizacao_colaborador_atualizacao = arg_colaborador_id,
        autorizacao_dataatualizacao = now(),
        autorizacao_estado = _const.autenticacao_estado_fechado
    where autorizacao_uid = _autorizacao.autorizacao_uid
    returning * into _autorizacao
  ;

  update tweeks.serie
    set serie_dataatualizacao = now(),
        serie_colaborador_atualizacao = arg_colaborador_id,
        serie_estado = _const.maguita_serie_estado_fechado,
        serie_fechoautorizacao = true
    where serie_estado = _const.maguita_serie_estado_ativo
      and serie_autorizacao_uid = _autorizacao.autorizacao_uid
  ;

  return lib.res_true( jsonb_build_object(
    'autorizacao', _autorizacao
  ));
end;
$$;


create or replace function tweeks.funct_load_autorizacao( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
  {
    arg_colaborador_id: UID
    arg_espaco_auth: UID
  }
 */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );

begin
  return query
    with __autorizacao as (
      select *
        from tweeks.autorizacao a
          inner join tweeks.espaco e on a.autorizacao_espaco_uid = e.espaco_id
        where a._branch_uid = _branch_uid
        and true in (
          a.autorizacao_espaco_auth = any( _espaco_child ),
          a.autorizacao_espaco_uid = any( _espaco_child )
        )
    ) select to_jsonb( _a )
        from __autorizacao _a
        order by _a.autorizacao_ano desc,
          _a.autorizacao_dataregistro desc
  ;
end;
$$;


create or replace function tweeks.funct_load_serie(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    arg_espaco_auth
    arg_colaborador_id
    arg_autorizacao_id
   */
  _const map.constant;
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_autorizacao_id uuid default args->>'arg_autorizacao_id';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  ___branch_uid uuid;
  _espaco_child uuid[] default rule.espaco_get_childrens_static( arg_espaco_auth );
begin
  _const := map.constant();
  ___branch_uid := tweeks.__branch_uid( null, arg_espaco_auth );
  return query
    with
      __serie as (
        select _vs.*,
            e.espaco_id,
            e.espaco_nome
          from tweeks.serie _vs
            inner join tweeks.espaco e on _vs.serie_espaco_id = e.espaco_id
          where _vs._branch_uid = ___branch_uid
            and coalesce( _vs.serie_autorizacao_uid ) = coalesce( arg_autorizacao_id, _vs.serie_autorizacao_uid )
            and true in (
              _vs.serie_espaco_auth = any( _espaco_child ),
              _vs.serie_espaco_id = any( _espaco_child )
            )
      )
    select to_jsonb( _s )
      from __serie _s;
end;
$$;

drop function if exists tweeks.funct_load_autorizacao_continue(args jsonb);

create or replace function tweeks.funct_sets_autorizacao_continue(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID
      autorizacao_uid: UID
    }
   */
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

  _autorizacao tweeks.autorizacao;
  _const map.constant;
  _data record;
begin
  _autorizacao := tweeks.__get_autorizacao( args->>'autorizacao_uid' );
  _const := map.constant();
  with __serie as (
    select
        serie_tserie_id,
        serie_espaco_id,
        serie_designacao,
        serie_numero,
        serie_quantidade,
        serie_numcertificacao,
        serie_numatorizacao
      from tweeks.serie se
      where se.serie_autorizacao_uid = _autorizacao.autorizacao_uid
        and se.serie_estado = _const.maguita_serie_estado_fechado
        and se.serie_fechoautorizacao
        and se._branch_uid = arg_branch_uid
  ) select
        jsonb_agg( to_jsonb( _s ) ) as series
        into _data
      from __serie _s;

  return tweeks.funct_sets_autorizacao( jsonb_build_object(
    'arg_colaborador_id', arg_colaborador_id,
    'arg_espaco_auth', arg_espaco_auth,
    'autorizacao_uid', null,
    'autorizacao_espaco_uid', _autorizacao.autorizacao_espaco_uid,
    'autorizacao_designacao', _autorizacao.autorizacao_designacao,
    'autorizacao_numero', _autorizacao.autorizacao_numero,
    'series', _data.series
  ));
end;
$$;


drop function if exists tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer);
create or replace function tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer)
  returns TABLE(
    document character varying,
     serie_id uuid,
       serie_numero character varying,
         serie_numatorizacao character varying,
           serie_numcertificacao character varying,
             serie_sequencia bigint,
               serie_quantidade bigint,
                 autorizacao_uid uuid,
                   autorizacao_ano int,
                     autorizacao_numero character varying
        )
  strict
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
        returning * into _serie
      ;

      if _serie.serie_id is null then
        raise exception 'Nenhuma serie disponivel para gerar a sequencia!';
      end if;

      if length( _serie.serie_sequencia::text ) > _tserie.tserie_seqlimit::int then
        raise exception 'O numero de sequencia excede o tamanho maximo definido para e seire';
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
end;
$$;
`;
