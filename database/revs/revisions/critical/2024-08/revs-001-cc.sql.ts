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


export const funct_pos_change_conta_fechar = sql`
create or replace function tweeks.funct_pos_change_conta_fechar(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
    /**
      Essa função fecha uma nova conta
      arg = {
        arg_espaco_auth: ID,
        arg_colaborador_id: ID,
        arg_tserie_id: ID,
        _serie_id:UID
        deposito:{
          deposito_cliente_id
          deposito_caixa_id
          deposito_tpaga_id
          deposito_currency_id
          deposito_posto_id
          deposito_montantemoeda
          deposito_montantetroco
          deposito_data
          deposito_docref: DOCUMENTO-REF?
          deposito_observacao: OBSERVACAO?
        }

        conta_id: ID,
        conta_extension: {} | { reserva_id: UID }
        conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM },

        conta_posto_id: ID,
        conta_desconto

        conta_titular: NOME-CLIENTE
        conta_titularnif: VARCHAR,
        conta_data: DATA,
        conta_cliente_id,

        //Relativos a GUIA
        guia_documentoperacao: CODIGO,
        guia_dataopeacao: DATA,
        guia_observacao: DESCRICAO
        guia_metadata: { ... any extras data }

        custos:[{
          custoguia_montante: MONTANTE,
          custoguia_descricao: DESCRICAO PARA O CUSTO
          custoguia_tcusto_id: 1 - DESPESA | 2 - RECEITA
        }]
      }
     */

    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_tserie_id int2 default args->>'arg_tserie_id';

    arg_conta_id uuid default args->>'conta_id';
    arg_caixa_id uuid default args->>'de_caixa_id';
    _deposito_montantetroco double precision;
    _serie_id uuid default args->>'_serie_id';


    _conta tweeks.conta;
    _const map.constant;
    _caixa tweeks.caixa;
    _res lib.res;
    _cambio record;
    _montante_amortizacao double precision;
    _deposito tweeks.deposito;
    _rec record;
    _guia tweeks.guia;
    _message text;
    _tserie tweeks.tserie;
  begin
    _const := map.constant();
    _caixa := tweeks._get_caixa( arg_caixa_id );
    _conta := tweeks._get_conta( arg_conta_id );
    _conta := jsonb_populate_record( _conta, args );
    _conta.conta_data := coalesce( _conta.conta_data, current_date );
    _conta.conta_desconto := coalesce( _conta.conta_desconto, 0.0 );
    _deposito := jsonb_populate_record( _deposito, args->'deposito' );

    _message := tweeks.__check_conta_data(
      _tserie_id := arg_tserie_id,
      _conta_data := _conta.conta_data,
      _raise := false,
      _serie_id := _serie_id
    );

    if _message is not null then
        return lib.res_false( _message );
    end if;

    if _conta.conta_id is null then
      raise exception '%', 'Identificador da conta a ser fechada não foi informado!';
    end if;

    if _conta.conta_estado = _const.maguita_conta_estado_fechado then
      return lib.res_false( 'Essa conta já se encontra fechada!' );
    end if;
    
    if arg_tserie_id not in (
        _const.maguita_tserie_fatura,
        _const.maguita_tserie_faturarecibo,
        _const.maguita_tserie_faturasimplificada,
        _const.maguita_tserie_guiasaida,
        _const.maguita_tserie_notacredito,
        _const.maguita_tserie_notadebito
    ) then
      return lib.res_false( 'Não pode fechar a conta o com tipo de serie selecionada!' );
    end if;

    if _conta.conta_posto_fecho is null then
      return lib.res_false( 'Necessario indicar o posto de fecho!' );
    end if;

    -- Na fatura recibo não pode haver conta corrente
    if arg_tserie_id in ( _const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) and _deposito.deposito_montantemoeda is null then
      return lib.res_false( 'O pagamento para as faturas/recibo é obrigatorio!' );
    end if;

    -- Os cliente finais só podem receber fatura/recibo ou nota de credito
    if true in (
        _conta.conta_cliente_id is null,
        _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    ) and arg_tserie_id not in (
      _const.maguita_tserie_faturarecibo,
      _const.maguita_tserie_faturasimplificada
    ) then
      return lib.res_false( 'Só pode lançar nos cliente finais as futuras/recibos!');
    end if;


    -- Quando hover necessidade de efetuar o deposito então, deve-se obter a taxa de cambio para o dia
    if arg_tserie_id in (_const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada )
      or _deposito.deposito_montantemoeda is not null
    then
      if _deposito.deposito_tpaga_id = _const.maguita_tpaga_contacorrente then
        return lib.res_false( 'Tipo de pagamento invalido' );
      end if;

      -- Obter o cambio para a moeda selecionada
      select * into _cambio from tweeks.__load_cambio_day(
        arg_espaco_auth,
        _deposito.deposito_currency_id,
        _conta.conta_data,
        _const
      );

      if _cambio.cambio_id is null then
        return lib.res_false( 'Câmbio não foi encontrado!' );
      end if;
    end if;
    
    

    -- O valor do deposito nas conta de fatura/recibo deve ser o suficiente para cobrir o montante da fatura
    if arg_tserie_id in ( _const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) then
      if round( ( _cambio.cambio_taxa * _deposito.deposito_montantemoeda)::numeric, _const.money_round )  < round( _conta.conta_montante::numeric, _const.money_round ) then
        return lib.res_false( 'Montante para pagamento insuficiente' );
      end if;

      -- Se for para amortizar a conta a caixa tem que estar aberta
      if _caixa.caixa_estado != _const.maguita_caixa_estado_ativo then
        return lib.res_false( 'Pagamento rejeitado!' );
      end if;
    end if;

    -- Definir em aqual conta a fatura deve ser enviado
    _conta._tgrupo_id := case
      when arg_tserie_id in (_const.maguita_tserie_faturarecibo, _const.maguita_tserie_faturasimplificada ) then _const.maguita_tgrupo_cnormal
      when arg_tserie_id = _const.maguita_tserie_fatura then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_guiasaida then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notacredito then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notadebito then _const.maguita_tgrupo_ccorrente
    end;

    -- Gerar a serie para a conta dependento do tipo do documento (fatura, faturarecibo, notacredito, guiasaida)
    _rec := tweeks.__sets_generate_documento( arg_espaco_auth, arg_tserie_id, _serie_id );
    _conta.conta_numerofatura := _rec.document;
    _conta.conta_serie := to_json( _rec );
    _conta.conta_serie_id = _rec.serie_id;

    _conta.conta_estado := _const.maguita_conta_estado_fechado;
    _conta.conta_imprensa := 1;
    _conta.conta_colaborador_fecho := arg_colaborador_id;
    _conta.conta_datafecho := current_timestamp;
    _conta.conta_cliente_id := coalesce( _conta.conta_cliente_id, lib.to_uuid( 1 ) );

    -- Gerar a Guia de saida
    _guia := jsonb_populate_record( _guia, args );
    _guia.guia_tguia_id := _const.maguita_tguia_saida;
    _guia.guia_espaco_saida := arg_espaco_auth;
    _guia.guia_toperacao_id := _const.maguita_toperacao_venda;
    _guia.guia_refclass := cluster.__format( 'tweeks.conta'::regclass );
    _guia.guia_refuid := _conta.conta_id;
    _guia.guia_refs := jsonb_build_object(
      'cliente', jsonb_build_object( 'cliente_id', _conta.conta_cliente_id ),
      'saida', jsonb_build_object( 'espaco_id', _conta.conta_espaco_auth )
    );

    _guia := tweeks.funct_sets_guia( jsonb_build_object(
      'guia', _guia,
      'custoguia', args->'custos',
      'arg_colaborador_id', arg_colaborador_id,
      'arg_espaco_auth', arg_espaco_auth
    ));

    -- Vicular a informaçao de guia na conta extension com a tag guia_id
    _conta.conta_extension := coalesce( _conta.conta_extension, jsonb_build_object() )
      || jsonb_build_object( 'guia_id', _guia.guia_uid );

    select ( "returning" ).* into _conta
      from lib.sets_up( _conta )
    ;


    -- Caso necessairio lançar o deposito viculado a conta
    if coalesce( _deposito.deposito_montantemoeda, 0.0 ) > 0 then

      _montante_amortizacao  := _deposito.deposito_montantemoeda * _cambio.cambio_taxa;
      if _montante_amortizacao > _conta.conta_montante and _conta._tgrupo_id != _const.maguita_tgrupo_ccorrente then
        _deposito_montantetroco := _montante_amortizacao - _conta.conta_montante;
      end if;

      _deposito_montantetroco := coalesce( _deposito_montantetroco, _deposito.deposito_montantetroco, 0.0 );

      _res := tweeks.funct_pos_reg_deposito(( args->'deposito' ) || jsonb_build_object(
          'arg_espaco_auth', arg_espaco_auth,
          'arg_colaborador_id', arg_colaborador_id,
          'arg_balance_accounts', false,
          'deposito_cliente_id', _conta.conta_cliente_id,
          'deposito_montantetroco', _deposito_montantetroco,
          '_tgrupo_id', _conta._tgrupo_id,
          'deposito_referencia', jsonb_build_object( 'conta_id', _conta.conta_id ), -- Vincula o deposito a conta
          'deposito_documento', _conta.conta_numerofatura,
          'deposito_serie', _conta.conta_serie,
          'deposito_serie_id', _conta.conta_serie_id,
          '_raise', true -- Criar exception para comportamentos indesejados
        ));

      if not _res.result then
        perform lib.result_exception(
            _res.message,
            detail := _res.data::text,
            hint := _res.error::text
          );
      else
        _deposito := jsonb_populate_record( null::tweeks.deposito, _res.data->'deposito' );
      end if;
    end if;

    return lib.res_true(
      message := '@tweeks.conta.invoice-closed-success',
      data := jsonb_build_object(
        'guia', _guia,
        'conta', tweeks._get_conta( _conta.conta_id ),
        'fatura', _conta.conta_numerofatura,
        'recibo', _deposito.deposito_documento
      )
    );
  end;
$$;
`;

export const sds = sql`
create or replace function tweeks.funct_pos__sync_conta_amount(args jsonb) returns jsonb
  language plpgsql
as
$$
declare
  arg_conta_id uuid default args->>'arg_conta_id';
  _const map.constant;
  _conta tweeks.conta;
begin
  _const := map.constant();
--   with __vendas  as(
--     select
--         ve.*,
--         coalesce( sum( vi.venda_montantetotal ), 0.0 ) as _venda_montanteagregado
--       from tweeks.venda ve
--         left join tweeks.venda vi on ve.venda_id = vi.venda_venda_id
--           and vi.venda_conta_id = arg_conta_id
--           and vi.venda_estado in ( _const.maguita_venda_estado_aberto, _const.maguita_venda_estado_fechado )
--
--       where ve.venda_conta_id  = arg_conta_id
--         and ve.venda_estado = _const.maguita_venda_estado_aberto
--         and ve.venda_venda_id is null
--
--       group by ve.venda_id
--   ), __venda_calcs as (
--     select
--         _ve._venda_montanteagregado,
--         _ve.venda_id,
--         _ve.venda_montante + _ve._venda_montanteagregado as _venda_montantetotal,
--         _vi.*
--       from __vendas _ve
--         inner join tweeks.funct_pos__calc_imposto( _ve.venda_artigo_id, _ve.venda_montante + _ve._venda_montanteagregado, args || jsonb_build_object(
--           'arg_venda_id', _ve.venda_id
--         )) _vi on true
--       where _ve.venda_id = _ve.venda_id
--         and _ve.venda_conta_id = arg_conta_id
--         and true in (
--           _ve.venda_montantetotal != _ve.venda_montante + _ve._venda_montanteagregado,
--           _ve.venda_montanteagregado != _ve._venda_montanteagregado,
--           _ve.venda_imposto != _vi.venda_imposto,
--           _ve.venda_impostoadicionar != _vi.venda_impostoadicionar,
--           _ve.venda_impostoretirar != _vi.venda_impostoretirar,
--           _ve.venda_montantesemimposto != _vi.venda_montantesemimposto,
--           _ve.venda_montantecomimposto != _vi.venda_montantecomimposto
--         )
--     ), __sync_calc as (
--     update tweeks.venda _up
--       set
--           venda_montantetotal = _vc._venda_montantetotal,
--           venda_montanteagregado = _vc._venda_montanteagregado,
--           venda_imposto = _vc.venda_imposto,
--           venda_impostoadicionar = _vc.venda_impostoadicionar,
--           venda_impostoretirar = _vc.venda_impostoretirar,
--           venda_montantesemimposto = _vc.venda_montantesemimposto,
--           venda_montantecomimposto = _vc.venda_montantecomimposto
--       from __venda_calcs _vc
--       where _vc.venda_id = _up.venda_id
--       returning _up.*, _vc.impostos
--   ) select count( * ) as changes, jsonb_agg( to_jsonb( s )) as syncs into _data from __sync_calc s;


  with __final_amount as (
    select sum( ve.venda_montantecomimposto ) as conta_montantepagar
      from tweeks.venda ve
      where ve.venda_conta_id = arg_conta_id
        and ve.venda_venda_id is null
        and ve.venda_estado in (
          _const.maguita_venda_estado_aberto,
          _const.maguita_venda_estado_fechado
        )
  ), __sync_conta as (
    update tweeks.conta _c set
        conta_montantepagar = _ve.conta_montantepagar
      from __final_amount _ve
      where _c.conta_id = arg_conta_id
        and ( _c.conta_montantepagar is null or _c.conta_montantepagar != _ve.conta_montantepagar)
      returning *
  ) select * into _conta from __sync_conta;

  if _conta.conta_montantepagar is null then 
    raise exception 'Não pode determinar o montante a ser pago!';
  end if;

  return jsonb_build_object(
    'conta', _conta
  );
end;
$$;
`;