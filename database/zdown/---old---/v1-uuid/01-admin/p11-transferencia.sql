drop trigger functg_transferencia_after_insert_adjust_stock on transferencia;
alter table tweeks.transferencia alter transferencia_id set default public.uuid_generate_v4();

alter table tweeks.transferencia drop transferencia_stock_destino;
alter table tweeks.transferencia drop transferencia_stock_origem;

drop function rule.tg_transferencia_after_insert_creante_movimento() cascade;

create or replace function tweeks.funct_reg_transferencia(args jsonb) returns lib.result
    language plpgsql
as
$$
declare
  /**
    Essa função serve para registar uma transferencia de stock
    args := {
      arg_espaco_auth: *ID
      arg_colaborador_id: *ID,
      arg_espaco_origem: *ID,
      arg_espaco_destino: *ID,

      arg_transferencia_data: DATA,
      arg_transferencia_documento: DOC,
      arg_transferencia_observacao: OBS,
      arg_transferencias:[ {
        artigo_id: *ID,
        transferencia_quantidade: *QUANT
      }]
    }
  */

  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_espaco_origem uuid not null default args->>'arg_espaco_origem';
  arg_espaco_destino uuid not null default args->>'arg_espaco_destino';


  arg_transferencia_data date default args->>'arg_transferencia_data';
  arg_transferencia_documento character varying default lib.str_normalize( args->>'arg_transferencia_documento' );
  arg_transferencia_observacao character varying default lib.str_nospace( args->>'arg_transferencia_observacao' );
  arg_transferencias jsonb default args->'arg_transferencias';

  _espaco_origem tweeks.espaco;
  _espaco_destino tweeks.espaco;
  _const map.constant;
  _data record;

begin

  _const := map.constant();

  arg_transferencia_documento := coalesce( arg_transferencia_documento, upper( lib.dset_random_name( 2, 9 ) ) );
  _espaco_origem := tweeks._get_espaco( arg_espaco_origem );
  _espaco_destino := tweeks._get_espaco( arg_espaco_destino );

  if _espaco_origem.espaco_estado = _const.maguita_espaco_estado_fechado then
    return false ? '@tranferencia.espaco.origem.estatado-fechado';
  end if;

  if _espaco_destino.espaco_estado = _const.maguita_espaco_estado_fechado then
    return false ? '@tranferencia.espaco.destino.estatado-fechado';
  end if;

  with __transferencia as (
    select
        ( e.doc->>'artigo_id' )::uuid as artigo_id,
        ( e.doc->>'transferencia_quantidade' )::double precision as transferencia_quantidade
      from jsonb_array_elements( arg_transferencias ) e( doc )
  ), __esgotado as (
      select *
        from __transferencia tr
          inner join tweeks.artigo art on tr.artigo_id = art.artigo_id
          inner join tweeks._get_stock( art.artigo_id, arg_espaco_origem ) s on art.artigo_id = s.stock_artigo_id
            and s.stock_espaco_id = arg_espaco_origem
        where s.stock_quantidade < tr.transferencia_quantidade
  ) select
      count( * ) as esgotado_total,
      string_agg( format( '%s disponivel: %s, em falta: %s', artigo_nome, e.stock_quantidade, e.transferencia_quantidade - e.stock_quantidade ), ', ' ) as esgotado_message
      into _data
    from __esgotado e
  ;

--   if _data.esgotado_total > 0 then
--     return lib.result_false( format( 'Quantidade dos artigos disponivel insuficiente para a transferencia.<br/> Artigos: %s', _data.esgotado_message ));
--   end if;

  with  __args as (
    select
        ( e.doc->>'artigo_id' )::uuid as artigo_id,
        ( e.doc->>'transferencia_quantidade' )::double precision as transferencia_quantidade
      from jsonb_array_elements( arg_transferencias ) e( doc )
  ), __transferencia as (
      select a.*
      from __args a
  ), __register as (
    insert into tweeks.transferencia (
        transferencia_espaco_auth,
        transferencia_artigo_id,
        transferencia_espaco_origem,
        transferencia_espaco_destino,
        transferencia_colaborador_id,
        transferencia_quantidade,
        transferencia_data,
        transferencia_documento,
        transferencia_observacao
  ) select
       arg_espaco_auth,
       artigo_id,
       arg_espaco_origem,
       arg_espaco_destino,
       arg_colaborador_id,
       t.transferencia_quantidade,
       arg_transferencia_data,
       arg_transferencia_documento,
       arg_transferencia_observacao
      from __transferencia t
    returning *
  ) select
      array_agg( r ) as transferencias
      into _data
    from __register r
  ;

  return true?jsonb_build_object(
    'transferencia', _data.transferencias
  );

end;
$$;
