import {block} from "../../../core/updater";

block( module, { "identifier":"guia-reg-conta"}).sql`
create or replace function tweeks.funct_pos_load_conta_dia(filter jsonb DEFAULT NULL::jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /** Essa função serve para devolver as compras do dia em uma data especifica
      filter := {
        arg_conta_data: DATE
        arg_posto_id: DATE
      }
     */
    _const map.constant;
    arg_conta_data date default filter->>'arg_conta_data';
    arg_posto_id uuid not null default filter->>'arg_posto_id';
begin

    _const := map.constant();
    arg_conta_data := coalesce( arg_conta_data, current_date );

    if arg_conta_data < current_date - make_interval( days := 7 ) then return; end if;

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
                p.posto_designacao,
                p.posto_matricula,
                de.deposito_montante,
                de.deposito_montantemoeda,
                de.deposito_montantetroco,
                de.deposito_montantefinal,
                de.deposito_taxacambio,
                cu.currency_id,
                cu.currency_code,
                cu.currency_name,
                co.colaborador_id,
                co.colaborador_nome
            from tweeks.conta ct
                inner join tweeks.posto p on ct.conta_posto_fecho = p.posto_id
                inner join tweeks.deposito de on ( de.deposito_referencia->>'conta_id' )::uuid = ct.conta_id
                inner join geoinfo.currency cu on de.deposito_currency_id = cu.currency_id
                inner join auth.colaborador co on ct.conta_colaborador_fecho = co.colaborador_id
            where ct.conta_posto_fecho = arg_posto_id
              and ct.conta_estado = _const.maguita_conta_estado_fechado
              and ct._tgrupo_id = _const.maguita_tgrupo_cnormal
              and ct.conta_datafecho::date = arg_conta_data
        ) select to_jsonb( _ct )
        from __conta _ct
    ;
end
$$;
`;