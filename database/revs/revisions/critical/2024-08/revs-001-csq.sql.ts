import {sql} from "kitres";

export const funct_pos_report_venda = sql`
create or replace function tweeks.funct_pos_report_venda(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_posto_id uuid default args->>'arg_posto_id';
  arg_date_start date default args->>'arg_date_start';
  arg_date_end date default args->>'arg_date_end';
  branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _const map.constant;
begin
  _const := map.constant();
  return query
    with __venda as (
      select
          art.artigo_id,
          art.artigo_nome,
          v.venda_custounitario,
          sum( v.venda_quantidade ) as venda_quantidade,
          sum( v.venda_montantecomimposto ) as venda_montantecomimposto,
          sum( v.venda_montantesemimposto ) as venda_montantesemimposto
        from tweeks.venda v
          inner join tweeks.artigo art on v.venda_artigo_id = art.artigo_id
          inner join tweeks.conta ct on v.venda_conta_id = ct.conta_id
        where v._branch_uid = branch
          and v.venda_estado = _const.maguita_venda_estado_fechado
          and ct.conta_estado = _const.maguita_conta_estado_fechado
          and ct.conta_datafecho::date >= coalesce( arg_date_start, ct.conta_datafecho::date )
          and ct.conta_datafecho::date <= coalesce( arg_date_end, ct.conta_datafecho::date )
          and ct.conta_posto_fecho = arg_posto_id
        group by art.artigo_id,
          v.venda_custounitario
    ) select to_jsonb( v2 )
        from __venda v2
        order by v2.artigo_nome
    ;
end;
$$;
`;