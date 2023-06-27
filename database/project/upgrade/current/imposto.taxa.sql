drop function if exists tweeks._get_impostos_taxa( arg_artigo_id uuid, arg_espaco_auth uuid);
drop function if exists tweeks._get_impostos_taxa( arg_artigo_id uuid, arg_espaco_auth uuid, arg_colaborador_id uuid);
drop function if exists tweeks._get_impostos_taxa( args jsonb );

create or replace function tweeks._get_impostos_taxa( args jsonb )
  returns TABLE(
    artigo_id uuid,
    percentagem_adicionar double precision,
    percentagem_retirar double precision,
    taxa_adicionar double precision,
    taxa_retirar double precision,
    taxas uuid[])
  language plpgsql
as
$$
declare
  /**
    arg_artigo_id [ ID, ... ]
    arg_espaco_auth UID
    arg_colaborador_id UID
   */


  arg_artigo_id uuid[] default array(
    select e.text::uuid
      from jsonb_array_elements_text( args-> 'arg_artigo_id' ) e(  text )
  );
  arg_espaco_auth uuid default  args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';

  _const map.constant;
  _data record;
  __knext record;
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();

  for __knext in
    select *
     from unnest( arg_artigo_id ) u( _argito_id )
  loop
    select
      sum( ( txass::tweeks.taxa ).taxa_percentagem ) filter ( where tap.taplicar_id = _const.maguita_taplicar_adicionar ) as percentagem_adicionar,
      sum( ( txass::tweeks.taxa ).taxa_percentagem ) filter ( where tap.taplicar_id = _const.maguita_taplicar_retirar ) as percentagem_retivar,
      sum( ( txass::tweeks.taxa ).taxa_taxa ) filter ( where tap.taplicar_id = _const.maguita_taplicar_adicionar ) as taxa_adicionar,
      sum( ( txass::tweeks.taxa ).taxa_taxa ) filter ( where tap.taplicar_id = _const.maguita_taplicar_retirar ) as taxa_retivar,
      array_agg( distinct (txass::tweeks.taxa).taxa_id ) as taxas
      into _data
    from tweeks.imposto ip
      inner join tweeks.taplicar tap on ip.imposto_taplicar_id = tap.taplicar_id
      inner join tweeks.taxa tx on ip.imposto_tipoimposto_id = tx.taxa_tipoimposto_id
        and tx.taxa_estado = _const.taxa_estado_ativo
        and tx.taxa_espaco_auth = ip.imposto_espaco_auth
      inner join rule.taxa_espaco( tx, _const, arg_espaco_auth ) txass on true
    where ip.imposto_artigo_id = __knext._argito_id
      and ip._branch_uid = ___branch
      and tx._branch_uid = ___branch
      and ip.imposto_estado = _const.maguita_imposto_estado_ativo;

    _get_impostos_taxa.artigo_id := __knext._argito_id;
    _get_impostos_taxa.percentagem_adicionar := coalesce( _data.percentagem_adicionar, 0 );
    _get_impostos_taxa.percentagem_retirar := coalesce( _data.percentagem_retivar, 0 );
    _get_impostos_taxa.taxa_adicionar := coalesce( _data.taxa_adicionar, 0 );
    _get_impostos_taxa.taxa_retirar := coalesce( _data.taxa_retivar, 0 );
    _get_impostos_taxa.taxas := coalesce( _data.taxas, array[]::uuid[] );
    return next;
  end loop;
end;
$$;

