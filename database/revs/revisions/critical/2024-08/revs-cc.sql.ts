import {sql} from "kitres";

export const __sets_generate_documento = sql`
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
    lock table tweeks.serie;
    
    _const := map.constant();
    
    select * into _tserie
      from tweeks.tserie ts
      where ts.tserie_id = arg_tserie
    ;
    
    if _tserie.tserie_id is null then 
      raise exception 'O tipo de serie para a operação não foi especificado, reveja as configurações de serie ou do posto';
    end if;

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
      raise exception '%', format( 'Existe varias series do tipo %I! É necessario especificar qual delas devem ser utilizadas!', _tserie.tserie_desc );
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
        raise exception '%', format( 'Nenhuma serie de %I disponivel para o ano %I!', _tserie.tserie_desc, to_char( current_date, 'yyyy') );
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