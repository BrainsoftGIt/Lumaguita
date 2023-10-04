import {sql} from "kitres";

export const tweeksStock = sql`
drop view tweeks.stock;

create view tweeks.stock as
with __fluxo_in as (
  select
      fin.fluxo_artigo_in as artigo_id,
      fin.fluxo_espaco_in as espaco_id,
      fin._branch_uid,
      sum( fin.fluxo_quantidadein ) as entrada_quantidade,
      count( * ) as entrada_total
    from tweeks.fluxo fin
    where fin.fluxo_artigo_in is not null
      and fin.fluxo_espaco_in is not null
    group by
      fin.fluxo_artigo_in,
      fin.fluxo_espaco_in,
      fin._branch_uid
), __fluxo_out as (
  select
    fin.fluxo_artigo_out as artigo_id,
    fin.fluxo_espaco_out as espaco_id,
    fin._branch_uid,
    sum( fin.fluxo_quantidadeout ) as saida_quantidade,
    count( * ) as saida_total
  from tweeks.fluxo fin
  where fin.fluxo_artigo_out is not null
    and fin.fluxo_espaco_out is not null
  group by
    fin.fluxo_artigo_out,
    fin.fluxo_espaco_out,
    fin._branch_uid
), __fluxo as (
  select
      coalesce( fin._branch_uid, fout._branch_uid ) as _branch_uid,
      coalesce( fin.artigo_id, fout.artigo_id ) as artigo_id,
      coalesce( fin.espaco_id, fout.espaco_id ) as espaco_id,
      coalesce( fin.entrada_quantidade, 0.0 ) - coalesce( fout.saida_quantidade, 0.0 ) as stock_quantidade
    from __fluxo_in fin
      full join __fluxo_out fout on fin.artigo_id = fout.artigo_id
        and fin.espaco_id = fout.espaco_id
        and fin._branch_uid = fout._branch_uid
) select * from __fluxo;
`;


export const fluxoOnAcerto  = sql`
create or replace function tweeks.__tg_fluxo_on_acerto() returns trigger
  language plpgsql
as
$$
declare
  _new tweeks.acerto;
  _fluxo tweeks.fluxo;
  _const map.constant;
  _diferenca double precision;
  
begin

  if cluster.__is_replication() then
    return null;
  end if;

  _const := map.constant();
  _new := new::tweeks.acerto;


  _fluxo.fluxo_toperacao_id := _const.maguita_toperacao_acerto;
  -- AC#3049940
  _fluxo.fluxo_documento := _new.acerto_codigo;
  _fluxo.fluxo_data := null;
  _fluxo.fluxo_referencia := lib.sets_ref(new );
  _fluxo.fluxo_regclass := cluster.__format( pg_typeof( new )::text::regclass );
  _fluxo.fluxo_refuid := _new.acerto_id;
  
  _diferenca := _new.acerto_quantidade - _new.acerto_quantidadeinicial;
  
  if _diferenca > 0 then 
    _fluxo.fluxo_artigo_in := _new.acerto_artigo_id;
    _fluxo.fluxo_espaco_in := _new.acerto_espaco_id;
    _fluxo.fluxo_quantidadein := abs( _diferenca );
    _fluxo.fluxo_quantidadefinal := _new.acerto_quantidade;
  elseif _diferenca < 0 then
    _fluxo.fluxo_artigo_out := _new.acerto_artigo_id;
    _fluxo.fluxo_espaco_out := _new.acerto_espaco_id;
    _fluxo.fluxo_quantidadeout := abs( _diferenca );
    _fluxo.fluxo_quantidadefinal := _new.acerto_quantidade;
  else
    return null;
  end if;
  
  _fluxo.fluxo_espaco_auth := _new.acerto_espaco_auth;
  _fluxo.fluxo_colaborador_id := _new.acerto_colaborador_id;
  _fluxo.fluxo_checkpoint := 0;

  perform lib.sets_in( _fluxo );
  return null;
end;
$$;
`;