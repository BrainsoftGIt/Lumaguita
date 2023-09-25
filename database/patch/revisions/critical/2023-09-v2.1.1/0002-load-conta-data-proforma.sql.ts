import {block} from "../../../core/updater";

block( module, { identifier: "funct_pos_load_conta_proforma" }).sql`
create or replace function tweeks.funct_pos_load_conta_proforma(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /** Essa função serve para devolver as compras do dia em uma data especifica
    filter := {
      arg_posto_id: DATE
      arg_espaco_id uuid
      arg_colaborador_id
    }
   */
  _const map.constant;
--   arg_posto_id uuid not null default filter->>'arg_posto_id';
  arg_colaborador_id uuid not null default filter->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default filter->>'arg_espaco_auth';

  _posto tweeks.posto;
  __branch_uid uuid not null default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
--   _posto := tweeks._get_posto( arg_posto_id );
  _const := map.constant();

  return query
    with __conta as (
      select
          ct.conta_id,
          ct.conta_data,
          ct.conta_dataregistro,
          ct.conta_titular,
          ct.conta_titularnif,
          ct.conta_montante,
          ct.conta_numerofatura,
          ct.conta_numero,
          ct.conta_proformavencimento,
          ct.conta_proformaextras,
          ct.conta_props,
          cli.cliente_id,
          cli.cliente_titular,
          cli.cliente_nif,
          cli.cliente_metadata,
          cli.cliente_documento,
          td.tdocumento_id,
          td.tdocumento_nome,
          co.colaborador_id,
          co.colaborador_nome,
          co.colaborador_apelido
        from tweeks.conta ct
          left join auth.colaborador co on coalesce( ct.conta_colaborador_fecho, ct.conta_colaborador_atualizacao, ct.conta_colaborador_id ) = co.colaborador_id
          left join tweeks.cliente cli on ct.conta_cliente_id = cli.cliente_id
          left join tweeks.tdocuemto td on cli.cliente_tdocument_id = td.tdocumento_id
        where ct._branch_uid = __branch_uid
          and ct.conta_estado = _const.maguita_conta_estado_aberto
          and ct.conta_proforma
    ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
$$;

alter function funct_pos_load_conta_proforma(jsonb) owner to maguita_dev;

grant execute on function funct_pos_load_conta_proforma(jsonb) to postgres;


`;