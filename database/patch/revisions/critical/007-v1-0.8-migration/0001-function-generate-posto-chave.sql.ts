import {block} from "../../../core/updater";

block( module, { identifier:"posto_chave", flags:[]}).sql `
    create or replace function tweeks.__generate_posto_chave()
    returns text
    language plpgsql as  $$
    declare
      chars character varying default 'abcdefghijklmnopqrstuvwxyz'||upper('abcdefghijklmnopqrstuvwxyz')||'0123456789'||'$#%';
      _posto_chave varchar;
    begin
      _posto_chave := lib.dset_random_text( chars, (2^8)::int )::character varying;
      return _posto_chave;
    end;
    $$;
    
    create or replace function tweeks.funct_reg_posto(args jsonb) returns lib.result
    language plpgsql
    as
    $$
    declare
      /**
        Essa função serve para criar uma posto para o colaborador
        args := {
          arg_posto_id: UUID
          arg_espaco_auth: ID,
          arg_espaco_destino: [ID, ID, ID],
          arg_colaborador_id: ID
          arg_posto_multiplecaixa: BOOLEAN
    
          arg_posto_matricula:  MATRICULA (CHAVE TEMPORARIA),
          arg_posto_designacao: DESIGNACAO,
          arg_tposto_id: ID,
          arg_posto_multipleuser: BOOLEAN,
          arg_posto_designcao: ID,
          arg_posto_montanteinicial: MONTANTE_INICIAL,
          posto_authmode: AUTH-MODE,
          posto_caixamode: CAIXA-MODE,
        }
      */
    
      arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
      arg_posto_id uuid default args->>'arg_posto_id';
      arg_espaco_destino uuid[] not null default array( select e.text from jsonb_array_elements_text( args->'arg_espaco_destino') e( text ));
      arg_posto_designacao character varying not null default args->>'arg_posto_designacao';
      arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
      arg_tposto_id int2 not null default args->>'arg_tposto_id';
      arg_posto_multiplecaixa boolean default args->>'arg_posto_multiplecaixa';
      arg_posto_matricula character varying default   args->>'arg_posto_matricula';
      arg_posto_montanteinicial float default         args->>'arg_posto_montanteinicial';
      arg_posto_authmode int2 not null default        args->>'posto_authmode';
      arg_posto_caixamode int2 not null default       args->>'posto_caixamode';
    
      _const map.constant;
      _posto tweeks.posto;
    
    begin
    
      _const := map.constant();
    
      if arg_posto_id is null then
        if (
          select count( * ) > 0
          from tweeks.posto p
          where p.posto_matricula = arg_posto_matricula
        ) then
          return false ? 'Código do posto já existe!';
        end if;
    
        _posto.posto_espaco_auth := arg_espaco_auth;
        _posto.posto_tposto_id := arg_tposto_id;
        _posto.posto_colaborador_id := arg_colaborador_id;
        _posto.posto_designacao := arg_posto_designacao;
        _posto.posto_multiplecaixa := coalesce( arg_posto_multiplecaixa, true );
        _posto.posto_matricula := arg_posto_matricula;
        _posto.posto_chave := tweeks.__generate_posto_chave();
        _posto.posto_authmode := arg_posto_authmode;
        _posto.posto_caixamode := arg_posto_caixamode;
    
        select ( "returning" ).* into _posto from lib.sets_in( _posto );
    
        update tweeks.chave
        set chave_definitiva = _posto.posto_chave
        where chave_temporarai = _posto.posto_matricula
        ;
      else
        select ( "returning" ).* into _posto
        from tweeks.posto p
          inner join lib.sets_up( p, replacer := args||jsonb_build_object(
            'posto_tposto_id', arg_tposto_id,
            'posto_designacao', arg_posto_designacao,
            'posto_multiplecaixa', coalesce( arg_posto_multiplecaixa, true ),
            'posto_authmode', arg_posto_authmode,
            'posto_caixamode', arg_posto_caixamode
          )) up on true
        where p.posto_id = arg_posto_id
        ;
      end if;
    
      -- Desativar os antigos espaços alocados ao posto
      update tweeks.aloca
      set aloca_estado = _const.maguita_aloca_estado_fechado,
          aloca_colaborador_atualizacao = arg_colaborador_id,
          aloca_dataatualizacao = current_timestamp
      where aloca_posto_id = _posto.posto_id
        and aloca_espaco_destino != all( arg_espaco_destino )
      ;
    
      -- Criar nova alocaçoes
      insert into tweeks.aloca(
        aloca_posto_id,
        aloca_espaco_destino,
        aloca_espaco_auth,
        aloca_colaborador_id,
        aloca_montante
      ) select
          _posto.posto_id,
          n.next,
          arg_espaco_auth,
          arg_colaborador_id,
          coalesce( arg_posto_montanteinicial, 0 )
      from unnest( arg_espaco_destino ) n( next )
             left join tweeks.aloca al on n.next = al.aloca_espaco_destino
        and al.aloca_posto_id = _posto.posto_id
        and al.aloca_estado = _const.maguita_aloca_estado_ativo
      where al.aloca_id is null
      ;
    
      return true ? jsonb_build_object(
          'posto', _posto,
          'aloca', array(
              select to_jsonb( a )
              from tweeks.aloca a
              where a.aloca_posto_id = _posto.posto_id
                and a.aloca_estado = _const.maguita_aloca_estado_ativo
            )
        );
    end;
    $$;
`;