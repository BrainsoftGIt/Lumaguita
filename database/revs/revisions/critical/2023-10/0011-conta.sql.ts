import {patchSQL, sql} from "kitres";


export const alter_conta_add_origem = patchSQL({ unique: true }).sql`
alter table tweeks.conta add column conta_docorigin character varying default null,
  add column conta_datedocorigin date default null
;
`;


export const aleter_tweeks_artigo_alter_codigoimposto = patchSQL({ unique: true }).sql`
alter table tweeks.artigo drop column if exists artigo_codigoimposto_notacredito;
alter table tweeks.artigo drop column if exists artigo_codigoimposto_notadebito;
alter table tweeks.artigo alter column artigo_codigoimposto type jsonb using jsonb_build_object(
  'FATURACAO', artigo_codigoimposto,
  'NOTACREDITO', NULL,
  'NOTADEBITO', NULL
);
`;



export const alter_venda_add_venda_codigo_imposto = patchSQL({ unique: true }).sql`
alter table tweeks.venda add column if not exists venda_codigoimposto character varying default null;
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
  begin
    _const := map.constant();
    _caixa := tweeks._get_caixa( arg_caixa_id );
    _conta := tweeks._get_conta( arg_conta_id );
    _conta := jsonb_populate_record( _conta, args );
    _conta.conta_data := coalesce( _conta.conta_data, current_date );
    _deposito := jsonb_populate_record( _deposito, args->'deposito' );

    _message := tweeks.__check_conta_data(
      _tserie_id := arg_tserie_id,
      _conta_data := _conta.conta_data,
      _raise := false
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
    if arg_tserie_id = _const.maguita_tserie_faturarecibo and _deposito.deposito_montantemoeda is null then
      return lib.res_false( 'O pagamento para as faturas/recibo é obrigatorio!' );
    end if;

    -- Os cliente finais só podem receber fatura/recibo ou nota de credito
    if true in (
        _conta.conta_cliente_id is null,
        _conta.conta_cliente_id = lib.to_uuid( 1 ) -- cliente final
    ) and arg_tserie_id not in (
      _const.maguita_tserie_faturarecibo
    ) then
      return lib.res_false( 'Só pode lançar nos cliente finais as futuras/recibos!');
    end if;


    -- Quando hover necessidade de efetuar o deposito então, deve-se obter a taxa de cambio para o dia
    if arg_tserie_id = _const.maguita_tserie_faturarecibo
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
    if arg_tserie_id = _const.maguita_tserie_faturarecibo then
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
      when arg_tserie_id = _const.maguita_tserie_faturarecibo then _const.maguita_tgrupo_cnormal
      when arg_tserie_id = _const.maguita_tserie_fatura then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_guiasaida then _const.maguita_tgrupo_ccorrente
      when arg_tserie_id = _const.maguita_tserie_notacredito then _const.maguita_tgrupo_ccorrente
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