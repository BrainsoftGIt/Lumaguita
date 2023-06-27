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
begin
  _const := map.constant();
  _serie := jsonb_populate_record( _serie, args );

  if _serie.serie_id is null then
    _serie.serie_colaborador_id := arg_colaborador_id;
    _serie.serie_espaco_auth := arg_espaco_auth;

    -- Desativar as serie ativa para o espaçoa
    update tweeks.serie
      set serie_estado = _const.maguita_serie_estado_fechado,
          serie_colaborador_atualizacao = arg_colaborador_id,
          serie_dataatualizacao = current_timestamp
      where serie_tserie_id = _serie.serie_tserie_id
        and serie_espaco_id = _serie.serie_espaco_id
        and _branch_uid = ___branch
        and serie_estado = _const.maguita_serie_estado_ativo
    ;
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
drop function if exists __generate_deposito_serie(uuid);;

drop function if exists tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer);
create or replace function tweeks.__sets_generate_documento(arg_espaco_auth uuid, arg_tserie integer)
 returns table(
   document character varying,
   serie_id uuid,
   serie_numero character varying,
   serie_numatorizacao character varying,
   serie_numcertificacao character varying,
   serie_sequencia int8,
   serie_quantidade int8

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
        where s._branch_uid = ___branch
          and s.serie_espaco_id = _espaco.espaco_id
          and s.serie_tserie_id = arg_tserie
          and s.serie_estado = _const.maguita_serie_estado_ativo
        returning * into _serie
      ;

      if _serie.serie_id is null then
        raise exception 'Nenhuma serie disponivel para gerar a sequencia!';
      end if;

      -- ex: FT0000119000001
      _numero_documento := format(
        '%s%s%s',
        _tserie.tserie_code,
        lpad( "right"( _serie.serie_numero, _tserie.tserie_numlimit ), _tserie.tserie_numlimit, '0'),
        lpad( _serie.serie_sequencia::text, greatest( _tserie.tserie_seqlimit::int, length( _serie.serie_sequencia::text ) ),  '0' )
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

    return next;
end;
$$;
