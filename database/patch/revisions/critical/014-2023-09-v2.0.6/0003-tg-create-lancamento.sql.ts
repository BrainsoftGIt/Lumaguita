import {block} from "../../../core/updater";

block( module, { identifier: "create-lancamento", flags: []}).sql`
create or replace function tweeks.__tg_create_lancamento() returns trigger
  language plpgsql
as
$$
declare
  _deposito tweeks.deposito;
  _conta tweeks.conta;
  _conta_old tweeks.conta;
  _const map.constant;
  _lancamento tweeks.lancamento;
  _data record;
  _conta_data record;
begin

  --Abortar o trigger quando for conexão com utilizador de replicação
  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();

  if pg_typeof( new ) = pg_typeof( _deposito ) and tg_op = 'INSERT' then
    _deposito :=  new;
    select * into _data from tweeks.tpaga where tpaga_id = _deposito.deposito_tpaga_id;

    _lancamento.lancamento_tlancamento_id := _const.maguita_tlancamento_deposito;
    _lancamento._tgrupo_id := _deposito._tgrupo_id;
    _lancamento.lancamento_refid := _deposito.deposito_id;
    _lancamento.lancamento_regclass := cluster.__format( pg_typeof( _deposito )::text::regclass );
    _lancamento.lancamento_valor := _deposito.deposito_montantefinal;
    _lancamento.lancamento_operacao := 1;
    _lancamento.lancamento_cliente_id := _deposito.deposito_cliente_id;
    _lancamento.lancamento_espaco_auth := _deposito.deposito_espaco_auth;
    _lancamento.lancamento_colaborador_id := _deposito.deposito_colaborador_id;
    _lancamento.lancamento_data := _deposito.deposito_data;
    _lancamento.lancamento_descricao := case
      when _deposito.deposito_docref is not null then format( 'Lançamente de deposito na conta em modalidade %I usando documento nº %I em %I', _data.tpaga_designacao, _deposito.deposito_docref, _deposito.deposito_data )
      else format( 'Lançamente de deposito na conta em modalidade %I em %I', _data.tpaga_designacao, _deposito.deposito_data )
    end;
    _lancamento.lancamento_documento := _deposito.deposito_documento;
    _lancamento.lancamento_referencia := lib.sets_ref( _deposito );

  elseif pg_typeof( new ) = pg_typeof( _conta ) and tg_op = 'UPDATE' then
    _conta := new;
    _conta_old := old;
    
    select * 
      from tweeks.conta ct 
        inner join tweeks.serie s on ct.conta_serie_id = s.serie_id
        inner join tweeks.tserie ts on s.serie_tserie_id = ts.tserie_id
      where ct.conta_id = _conta.conta_id
      into _conta_data
    ;

    if _conta_old.conta_estado != _conta.conta_estado and _conta.conta_estado = _const.maguita_conta_estado_fechado and not exists(
      select *
        from tweeks.lancamento l
        where l.lancamento_regclass = cluster.__format( pg_typeof(_conta)::text::regclass )
          and l.lancamento_refid = _conta.conta_id
    ) then
      _lancamento.lancamento_tlancamento_id := _const.maguita_tlancamento_conta;
      _lancamento._tgrupo_id := _conta._tgrupo_id;
      _lancamento.lancamento_refid := _conta.conta_id;
      _lancamento.lancamento_regclass := cluster.__format( pg_typeof( _conta )::text::regclass );
      _lancamento.lancamento_valor := _conta.conta_montante;
      _lancamento.lancamento_cliente_id := _conta.conta_cliente_id;
      _lancamento.lancamento_espaco_auth := _conta.conta_espaco_auth;
      _lancamento.lancamento_colaborador_id := coalesce( _conta.conta_colaborador_fecho, _conta.conta_colaborador_atualizacao, _conta.conta_colaborador_id );
      _lancamento.lancamento_data := _conta.conta_data;
      _lancamento.lancamento_descricao := format( 'Lançamento de divida na conta com fatura nº %s', _conta.conta_numerofatura );
      _lancamento.lancamento_operacao := -1;
      
      if _conta_data.tserie_id = _const.maguita_tserie_notacredito then
        _lancamento.lancamento_descricao := format( 'Lançamento de nota de credito na conta com fatura nº %s', _conta.conta_numerofatura );
        _lancamento.lancamento_operacao := 1;
      elsif _conta_data.tserie_id in(  _const.maguita_tserie_faturarecibo, _const.maguita_tserie_fatura ) then 
        _lancamento.lancamento_descricao := format( 'Lançamento de divida na conta com fatura nº %s', _conta.conta_numerofatura );
      elsif _conta_data.tserie_id = _const.maguita_tserie_guiasaida then 
        _lancamento.lancamento_descricao := format( 'Lançamento de guia de saida com fatura nº %s', _conta.conta_numerofatura );
      end if;
      
      _lancamento.lancamento_documento := _conta.conta_numerofatura;
      _lancamento.lancamento_referencia := lib.sets_ref( _conta );
    end if;
  end if;

  if _lancamento.lancamento_tlancamento_id is not null then
    _lancamento.lancamento_estado := _const.maguita_lancamento_estado_ativo;
    perform lib.sets( _lancamento );
  end if;

  return null;
end;
$$;
`;