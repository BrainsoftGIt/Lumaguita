import {block} from "../../../core/updater";

block( module, { identifier: "tweeks.__tg_fluxo_on_venda" }).sql`
create or replace function tweeks.__tg_venda_before_sets() returns trigger
  language plpgsql
as
$$
declare
  _sets record;
  _new tweeks.venda;
begin
  _new := new;
  if _new.venda_proforma is null then
      select * into _sets
        from tweeks.conta ct 
        where ct.conta_id = _new.venda_conta_id
      ;
      
      _new.venda_proforma := _sets.conta_proforma;
  end if;
  return _new;
end;
$$;

create or replace function tweeks.__tg_fluxo_on_venda() returns trigger
  language plpgsql
as
$$
declare
  _new tweeks.venda;
  _old tweeks.venda;
  _fluxo tweeks.fluxo;
  _const map.constant;
  _conta tweeks.conta;
  ___restaurar boolean default true;
  __debitar boolean default true;
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new;
  if tg_op = 'UPDATE' then
      _old := old;
  end if;
  
  if _new.venda_proforma is null then
    raise exception 'O campo venda_proforma não foi definido!';
  end if;

  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_venda;
  _fluxo.fluxo_documento := null;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := jsonb_build_object( 'venda_id', _new.venda_id );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );
  _fluxo.fluxo_refuid := _new.venda_id;
  _fluxo.fluxo_colaborador_id := _new.venda_colaborador_id;
  _fluxo.fluxo_espaco_auth := _new.venda_espaco_auth;
  
  
  -- Report o stock quando mudar a conta de normal para proforma
  if tg_op = 'UPDATE' 
    and ___restaurar
    and not _old.venda_proforma 
    and _new.venda_proforma 
  then
    _fluxo.fluxo_quantidadein := _old.venda_quantidade;
    _fluxo.fluxo_artigo_in := _old.venda_artigo_id;
    _fluxo.fluxo_espaco_in := _old.venda_espaco_auth;
    _fluxo.fluxo_observacao := format( 'Reposição do artigo no stock por transformação de conta normal em proforma' );
    perform lib.sets_in( _fluxo );
    ___restaurar := false;
  end if;
  
  
  -- Report o stock quando atualizar a  quantidade na venda normal ou o venda for anulada
  if tg_op = 'UPDATE'
    and ___restaurar
    and not _old.venda_proforma 
    and _old.venda_quantidade != _new.venda_quantidade
  then
    _fluxo.fluxo_quantidadein := _old.venda_quantidade;
    _fluxo.fluxo_artigo_in := _old.venda_artigo_id;
    _fluxo.fluxo_espaco_in := _old.venda_espaco_auth;
    _fluxo.fluxo_observacao := format( 'Reposição do artigo no stock por atualização da quantidade na conta' );
    perform lib.sets_in( _fluxo );
    ___restaurar := false;
  end if;
  
  -- Report o stock quando a venda for anulada
  if tg_op = 'UPDATE'
    and ___restaurar
    and not _old.venda_proforma 
    and _old.venda_estado != _new.venda_estado
    and _new.venda_estado in (
      _const.maguita_venda_estado_anulado,
      _const.maguita_venda_estado_canselado
    )
  then
    _fluxo.fluxo_quantidadein := _old.venda_quantidade;
    _fluxo.fluxo_artigo_in := _old.venda_artigo_id;
    _fluxo.fluxo_espaco_in := _old.venda_espaco_auth;
    _fluxo.fluxo_observacao := format( 'Reposição do artigo no stock por Anulação/Canselamento da conta');
    perform lib.sets_in( _fluxo );
    ___restaurar := false;
  end if;

  _fluxo.fluxo_quantidadein := null;
  _fluxo.fluxo_artigo_in := null;
  _fluxo.fluxo_espaco_in := null;
  _fluxo.fluxo_quantidadeout := _new.venda_quantidade;
  _fluxo.fluxo_artigo_out := _new.venda_artigo_id;
  _fluxo.fluxo_espaco_out := _new.venda_espaco_auth;
  
  if tg_op = 'INSERT' 
    and not _new.venda_proforma 
    and __debitar 
  then
    _fluxo.fluxo_observacao := format( 'Debito no stock atravez de uma venda' );
    perform lib.sets_in( _fluxo );
    __debitar := false;
  end if;
  
  if tg_op = 'UPDATE'
    and __debitar
    and not _new.venda_proforma
    and _new.venda_quantidade != _old.venda_quantidade
    and _new.venda_estado not in (
      _const.maguita_venda_estado_anulado,
      _const.maguita_venda_estado_canselado
    )
  then
    _fluxo.fluxo_observacao := format( 'Debito no stock atravez de uma venda' );
    perform lib.sets_in( _fluxo );
    __debitar := false;
  end if;


  if _old.venda_estado != _new.venda_estado and _new.venda_estado = _const.maguita_venda_estado_fechado then
    _conta := tweeks._get_conta( _old.venda_conta_id );
    update tweeks.fluxo
      set fluxo_documento = _conta.conta_numerofatura
      where fluxo_regclass = cluster.__format( pg_typeof( _new )::text::regclass )
      and ( fluxo_referencia->>'venda_id')::uuid = _old.venda_id
    ;
  end if;
  return null;
end
$$;
`;


block( module, { identifier: "tg_fluxo_on_venda_update", flags: ["@unique" ]}).sql`
  drop trigger if exists tg_fluxo_on_venda_update on tweeks.venda;
  drop trigger if exists tg_fluxo_on_venda_create on tweeks.venda;
  drop trigger if exists tg_fluxo_on_venda_sets on tweeks.venda;

  create trigger tg_fluxo_on_venda_sets
      after insert or update 
      on tweeks.venda
      for each row
      when (NOT cluster.__is_replication())
  execute procedure tweeks.__tg_fluxo_on_venda();

  create trigger tg_venda_before_sets
      after insert or update 
      on tweeks.venda
      for each row
      when (NOT cluster.__is_replication())
  execute procedure tweeks.__tg_venda_before_sets();
`;