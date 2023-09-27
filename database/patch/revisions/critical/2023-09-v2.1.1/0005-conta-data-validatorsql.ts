import {block} from "../../../core/updater";

block( module, { identifier: "conta-data-validator:conta_tserie_id", flags: [ "@unique"]}).sql`
with __source ( tserie_id, tserie_desc, tserie_code, tserie_seqlimit, tserie_numlimit ) as (
    VALUES (6, 'Fatura proforma', 'FP', 6, 7)
) select *
  from __source _s
    inner join lib.sets( _s::text::tweeks.tserie ) on true
;

select * from map.constant( 'maguita_tserie_faturaproforma', 'int2', 6, 'Serie para guia de saida!' );

alter table tweeks.conta add column if not exists conta_tserie_id int2 default null;
with __conta_fechada as (
  select *
    from tweeks.conta ct
      inner join tweeks.serie s on ct.conta_serie_id = s.serie_id
    where ct.conta_estado = ( map.constant()).maguita_conta_estado_fechado
) update tweeks.conta c
  set conta_tserie_id = cf.conta_tserie_id
    from __conta_fechada cf 
    where cf.conta_id = c.conta_id 
`;

block( module, { identifier: "check-conta-data"}).sql`
drop function if exists tweeks.__check_conta_data(
  _tserie_id int,
  _conta_data date,
  _raise boolean
);

create or replace function tweeks.__check_conta_data( 
  _tserie_id int,
  _conta_data date,
  _raise boolean
) returns text
language plpgsql as $$
declare 
  _data record;
  _tserie tweeks.tserie;
  _message text;
begin
    select max( ct.conta_data ) as conta_data
      from tweeks.conta ct 
        inner join tweeks.serie s on ct.conta_serie_id = s.serie_id
      where s.serie_tserie_id = _tserie_id 
        and ct.conta_data <= current_date
      into _data
    ;
    
    select *
      from tweeks.tserie ts 
      where ts.tserie_id = _tserie_id
      into _tserie
    ;
    
    if _conta_data > current_date and _message is null then 
      _message :=  format( 'Data de emissão invalida para a operação! A data para a %I não pode ser superior a data atual!', _tserie.tserie_desc );
    end if;
    
    if _conta_data < _data.conta_data and _message is null then
      _message := format( 'Data de emissão invalida para a operação! A última data de emissão para %I foi de %I!', _tserie.tserie_desc, _data.conta_data );
    end if;
    
    if _raise and _message is not null then
        raise exception '%', _message;
    end if;
    
    return _message;
end;
$$
`;

block( module, { identifier: "proforma-v2.1.1"}).sql`
create or replace function tweeks.funct_pos_change_conta_proforma(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /**
    args := {
      arg_colaborador_id: UUID,
      arg_espaco_auth: UUID,

      conta_id UUID,
      conta_cliente_id: UID,
      conta_proformavencimento: DATE
      conta_proformaextras
    }
   */
  arg_conta_id uuid default args->>'conta_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';

  _conta tweeks.conta;
  _const map.constant;
  _invalid_date_message text;
begin
  _const := map.constant();
  _conta := tweeks._get_conta( arg_conta_id );

  if _conta.conta_estado != _const.maguita_conta_estado_aberto then
    return lib.res_false( 'Não pode colocar uma conta em modo proforma para as conta já fechada!' );
  end if;

  _invalid_date_message :=  tweeks.__check_conta_data(
    _tserie_id := _const.maguita_tserie_fatura,
    _conta_data := _conta.conta_data,
    _raise := true
  );
  
  if _invalid_date_message is not null then 
    return lib.res_false( _invalid_date_message );
  end if;
  
  _conta.conta_proforma := true;

  select ( "returning" ).* into _conta
    from lib.sets( _conta, args  );
  
  update tweeks.venda
    set venda_proforma = true
    where venda_conta_id = _conta.conta_id
      and venda_estado not in (
        _const.maguita_venda_estado_anulado,  
        _const.maguita_venda_estado_canselado  
      )
      and not venda_proforma
  ;

  return lib.res_true( jsonb_build_object(
    'conta', _conta
  ));
end;
$$;
`;