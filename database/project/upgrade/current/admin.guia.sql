alter table tweeks.guia alter guia_colaborador_atualizacao drop not null;
alter table tweeks.custoguia alter custoguia_colaborador_atualizacao drop not null;
alter table tweeks.custoguia alter custoguia_date set default clock_timestamp();

create or replace function tweeks.funct_sets_guia( args jsonb )
returns tweeks.guia
language plpgsql as $$
  declare
    /**
      args := {
        guia: tweeks.guia {
          guia_toperacao_id: TOPERACAO,
          guia_espaco_entrada: UID
          guia_espaco_saida: UID
          guia_tguia_id: TGUIA
          guia_numero: NUMERO,
          guia_metadata: { ... any data },
          guia_dataoperacao: DATE,
          guia_observacao: OBS,
          guia_refs: { },
          guia_refuid: UID
          guia_refclass: string( regclass )

        },

        //Relativos a Guia
        custoguia: tweeks.custoguia[
          custoguia_montante: MONTANTE,
          custoguia_descricao: DESCRICAO PARA O CUSTO
          custoguia_tcusto_id: 1 - DESPESA | 2 - RECEITA
        ],
        arg_colaborador_id uuid,
        arg_espaco_auth uuid
      }
     */
    _args tweeks.guia;
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    _iNext tweeks.custoguia;
    _custoguia tweeks.custoguia;
    _const map.constant;
    _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  begin
    _const := map.constant();
    _args := jsonb_populate_record( _args, args->'guia' );

    if _args.guia_uid is null then
      while _args.guia_numero is null loop
        _args.guia_numero := cluster.next( format( 'guia|%s', _args.guia_toperacao_id ), sub := _branch::text, lpad := 4, lpad_char := '0' );
        if exists(
          select *
            from tweeks.guia g
            where g.guia_numero = _args.guia_numero
              and g.guia_toperacao_id = _args.guia_toperacao_id
              and g._braunc_uid = _branch
        ) then
          _args.guia_numero := null;
        end if;
      end loop;
      _args._braunc_uid := _branch;
      _args.guia_espaco_auth := arg_espaco_auth;
      _args.guia_colaborador_id := arg_colaborador_id;

      select ( "returning" ).* into _args
        from lib.sets_in( _args )
      ;
      for _iNext in
        select cg.*
          from jsonb_array_elements( args->'custoguia' ) e( doc )
            inner join jsonb_populate_record( null::tweeks.custoguia, e.doc ) cg on true
      loop
        _iNext.custoguia_colaborador_id := arg_colaborador_id;
        _iNext.custoguia_espaco_auth := arg_espaco_auth;
        _iNext.custoguia_guia_uid := _args.guia_uid;
        _iNext._branch_uid := _branch;
        select ( "returning" ).* into _custoguia
          from lib.sets_in( _iNext );
      end loop;
    else
      _args._braunc_uid := _branch;
      _args.guia_colaborador_atualizacao := arg_colaborador_id;
      _args.guia_dateupdate := arg_colaborador_id;

      select ( "returning" ).* into _args
        from lib.sets_up( _args )
      ;
      update tweeks.custoguia
        set custoguia_estado = _const.maguita_custoguia_estado_canselado,
            custoguia_dateupdate = clock_timestamp(),
            custoguia_colaborador_atualizacao = arg_colaborador_id
        where custoguia_guia_uid = _args.guia_uid
          and custoguia_estado = _const.maguita_custoguia_estado_ativo
      ;

      for _iNext in
        select cg.*
          from jsonb_array_elements( args->'custoguia' ) e( doc )
            inner join jsonb_populate_record( null::tweeks.custoguia, e.doc ) cg on true
        loop
          _iNext.custoguia_guia_uid := _args.guia_uid;
          _iNext.custoguia_colaborador_id := arg_colaborador_id;
          _iNext.custoguia_dateupdate := clock_timestamp();
          select ( "returning" ).* into _custoguia
          from lib.sets_in( _iNext );
        end loop;
    end if;

    return _args;
  end;
$$;


create or replace function tweeks.funct_load_guia_data( args jsonb )
returns setof json
language plpgsql as $$
declare
  /**
    args := {
      guia_id UUID,
      arg_colaborador_id UUID
      arg_espaco_auth UUID
    }
   */
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_espaco_auth uuid default args->>'arg_espaco_auth';

  _guia tweeks.guia;
  _const map.constant;
  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
begin
  _const := map.constant();
  _guia := jsonb_populate_record( _guia, args );
  select * into _guia
    from tweeks.guia
    where guia_uid = _guia.guia_uid
      and _branch_uid = ___branch
  ;

  return next json_build_object( 'type', cluster.__format( pg_typeof( _guia )::text::regclass ), 'data', _guia );

  return query with __custoguia as (
    select ent as data, cluster.__format( ent.tableoid ) as type
      from tweeks.custoguia ent
      where ent.custoguia_guia_uid = _guia.guia_uid
        and ent.custoguia_estado = _const.maguita_custoguia_estado_ativo
        and ent._branch_uid = ___branch
  ) select to_json( _e ) from __custoguia _e;

  if _guia.guia_toperacao_id = _const.maguita_toperacao_entrada then
    return query with __raw as (
      select ent.*,
             art.artigo_id,
             art.artigo_nome,
             art.artigo_codigo,
          cluster.__format( ent.tableoid ) as type
        from tweeks.entrada ent
          inner join tweeks.artigo art on ent.entrada_artigo_id = art.artigo_id
        where ent.entrada_guia_id = _guia.guia_uid
          and ent.entrada_estado = _const.entrada_estado_ativo
          and ent._branch_uid = ___branch
    ), __entrada as (
      select to_json( r ) as data, r.type
        from __raw r
    ) select to_json( _e ) from __entrada _e;

    return query with __fornecedor as (
      select ent as data, cluster.__format( ent.tableoid ) as type
        from tweeks.fornecedor ent
      where ent._branch_uid = ___branch
        and ent.fornecedor_id = _guia.guia_refuid
        and _guia.guia_refclass::regclass = ent.TABLEOID::regclass
    ) select to_json( _f ) from __fornecedor _f;

  elseif _guia.guia_toperacao_id = _const.maguita_toperacao_venda then
    return query with __venda as (
      select ent as data, cluster.__format( 'tweeks.conta'::regclass ) as type
      from tweeks.funct_pos_load_conta_data( args ) ent
    ) select to_json( _e ) from __venda _e;

  end if;
end
$$;
