drop function tweeks.funct_load_colaborador_by_posto( filter jsonb );

create or replace function tweeks.funct_pos_load_colaborador( args jsonb )
 returns SETOF jsonb
    language plpgsql
as
$$
declare
  /** Essa função serve para devolver os colaboradores que tenha pelo menos um menu especificado
    filter := {
      posto_id: UUID,
      menus:[ CODE, CODE, CODE ]
    }
  **/
  arg_posto_id uuid default args->>'posto_id';
  arg_menus character varying[] default array(select e.text from jsonb_array_elements_text( args->'menus' ) e ( text ));
  _const map.constant;
begin
  _const := map.constant();
  return query with
    __espacos as ( select e.espaco_id, e.espaco_nome, e.espaco_estado from tweeks.espaco e ),
    __colaborador as (
        select
            co.colaborador_id,
            co.colaborador_nome,
            co.colaborador_email,
            co.colaborador_accesso,
            co.colaborador_foto,
            co.colaborador_estado
          from auth.colaborador co
            inner join auth.acesso ac on co.colaborador_id = ac.acesso_colaborador_propetario
            inner join auth.menu me on ac.acesso_menu_id = me.menu_id
          where me.menu_codigo = any( arg_menus )
            and ac.acesso_estado = _const.acesso_estado_ativo
            and co.colaborador_estado = _const.colaborador_estado_ativo
            and co.colaborador_accesso in (
              _const.colaborador_accesso_ativo,
              _const.colaborador_accesso_pendente
            )
    ),
    __posto as (
      select
          po.posto_id,
          array_agg( al.aloca_espaco_destino ) as posto_alocacao
        from tweeks.posto po
          inner join tweeks.aloca al on po.posto_id = al.aloca_posto_id
            and al.aloca_estado = _const.maguita_aloca_estado_ativo
        where po.posto_id = arg_posto_id
        group by po.posto_id
    ), __local as (
      select
          tr.trabalha_colaborador_proprietario,
          array_agg( to_jsonb( e ) ) as colaborador_workspace
        from tweeks.trabalha tr
          inner join __posto p on tr.trabalha_espaco_destino = any( p.posto_alocacao )
          inner join __espacos e on tr.trabalha_espaco_destino = e.espaco_id
        where tr.trabalha_estado = _const.maguita_trabalha_estado_ativo
        group by tr.trabalha_colaborador_proprietario
    ), __trabalhador as (
      select *
        from __local lo
          inner join __colaborador co on lo.trabalha_colaborador_proprietario = co.colaborador_id
    ) select to_jsonb( tr ) from __trabalhador tr;
end;
$$;

