import {block} from "../../../core/updater";

block( module, { identifier: "migration/fornecedor-code", flags:[]}).sql`
create or replace function tweeks.__generate_guia_code( _branch uuid, toperacao_id int )
  returns text
  language plpgsql as $$
declare
  __guia_code text;
begin
    while __guia_code is null loop
        __guia_code := cluster.next( format( 'guia|%s', toperacao_id ), sub := _branch::text, lpad := 4, lpad_char := '0' );
        if exists(
            select *
            from tweeks.guia g
            where g.guia_numero = __guia_code
              and g.guia_toperacao_id = toperacao_id
              and g._braunc_uid = _branch
          ) then
          __guia_code := null;
        end if;
      end loop;
    return  __guia_code;
  end;
$$;

create or replace function tweeks.funct_sets_guia(args jsonb) returns guia
  language plpgsql
as
$$
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
      
      _args.guia_numero := tweeks.__generate_guia_code( _branch, _args.guia_toperacao_id );
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


`;