create or replace function tweeks.funct_pos_reg_caixa(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /** Essa função serve para registar uma nova caixa
    args := {
      arg_espaco_auth: ID
      arg_posto_id: ID
      arg_colaborador_id: ID
      caixa_montanteinicial: MONTANTE
    }
  */

  arg_posto_id uuid not null default args->>'arg_posto_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_caixa_montanteinicial double precision not null default args->>'caixa_montanteinicial';

  _data record;
  _posto tweeks.posto;
  _caixa tweeks.caixa;
  _const map.constant;
begin

  select * into _posto
    from tweeks.posto
    where posto_id = arg_posto_id
  ;

  _const := map.constant();

  with __aloca as (
    select
        a.aloca_posto_id,
        sum( a.aloca_montante ) as aloca_montante
      from tweeks.aloca a
      where a.aloca_estado = _const.maguita_aloca_estado_ativo
        and a.aloca_posto_id = arg_posto_id
        and case
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_posto then true
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_espaco then a.aloca_espaco_destino = arg_espaco_auth
          when _posto.posto_caixamode = _const.maguita_posto_caixamodo_pessoal then a.aloca_espaco_destino = arg_espaco_auth
          else false
        end
      group by a.aloca_posto_id
  ), __caixa as (
    select
        cx.caixa_posto_id,
        mode() within group ( order by e.espaco_nome desc ) as espaco_nome,
        count( cx.caixa_id ) as posto_caixas
      from tweeks.caixa cx
        inner join tweeks.espaco e on cx.caixa_espaco_auth = e.espaco_id
      where cx.caixa_posto_id = arg_posto_id
        and cx.caixa_estado = _const.maguita_caixa_estado_ativo
      group by cx.caixa_posto_id
  ) select
        *,
        coalesce( aloca_montante, 0.0 ) as _aloca_montante
        into _data
      from tweeks.posto p
        left join __aloca al on p.posto_id = al.aloca_posto_id
        left join __caixa cx on p.posto_id = cx.caixa_posto_id
      where p.posto_id = arg_posto_id
  ;

  if  not _posto.posto_multiplecaixa and _data.posto_caixas > 0 then
    return lib.res_false(
      format( 'Esse posto só pode trabalhar com uma caixa a cada momento, por favor fechar primeiramente a caixa abertas atualmente!' )
    );
  end if;


  _caixa.caixa_colaborador_id := arg_colaborador_id;
  _caixa.caixa_posto_id := arg_posto_id;
  _caixa.caixa_montanteinicialposto := _data._aloca_montante;
  _caixa.caixa_montanteinicial := arg_caixa_montanteinicial;
  _caixa.caixa_espaco_auth := arg_espaco_auth;

  select ( "returning" ).* into _caixa
    from lib.sets_in(_caixa  )
  ;

  _posto.posto_estado := _const.maguita_posto_estado_aberto;
  select ( "returning" ).* into _posto from lib.sets_up( _posto );

  return lib.res_true( jsonb_build_object(
    'caixa', _caixa,
    'posto', _posto
  ));
end
$$;