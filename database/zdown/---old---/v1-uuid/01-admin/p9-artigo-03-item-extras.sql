create or replace function tweeks.funct_reg_item( args jsonb ) returns lib.result
    language plpgsql
as
$$
declare
    /**
      Essa funçao serve para registar um item
      {
        arg_espaco_auth: ID
        arg_colaborador_id: ID

        artigo_id: ID
        artigo_nome: *NOME
        artigo_descricao: DESCRICAO
        precario_custo: *CUSTO
        precario_quantida: *QUANT
      }
     */

    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';

    arg_artigo_id uuid default args->>'artigo_id';
    arg_artigo_nome character varying default args->>'artigo_nome';
    arg_artigo_descricao character varying default args->>'artigo_descricao';

    arg_precario_custo double precision default args->>'precario_custo';
    arg_precario_quantidade double precision default args->>'precario_quantidade';

    _result lib.result;
    _const map.constant;
    arg_artigo_codigo varchar;
    _artigo tweeks.artigo;
begin
    _const := map.constant();

    arg_precario_quantidade := coalesce( arg_precario_quantidade, 1 );
    if (
        select count( * ) > 0
        from tweeks.artigo it
        where lib.str_normalize( lower( it.artigo_nome ) ) = lib.str_normalize( lower( arg_artigo_nome ) )
          and it.artigo_classe_id = _const.classe_itemextra
          and it.artigo_id::text != coalesce( arg_artigo_id::text, it.artigo_id::text||'!?')
    ) then
        return false? '@item.nome.already.exist';
    end if;

    -- Durante o registro
    if arg_artigo_id is null then
        while arg_artigo_codigo is null loop
            arg_artigo_codigo :=  format( 'item#%s', (random() * 999999 )::int );
            if( select count( * ) > 0 from tweeks.artigo where artigo_codigo = arg_artigo_codigo ) then
                arg_artigo_codigo := null;
            end if;
        end loop;

        _artigo := jsonb_populate_record( _artigo, args );
        _artigo.artigo_espaco_auth := arg_espaco_auth;
        _artigo.artigo_colaborador_id := arg_colaborador_id;
        _artigo.artigo_codigo := arg_artigo_codigo;
        _artigo.artigo_classe_id := _const.classe_itemextra;

        select ("returning").* into _artigo from lib.sets(_artigo );

    elsif arg_artigo_id is not null then
      _artigo := tweeks._get_artigo( arg_artigo_id );
      _artigo := jsonb_populate_record( _artigo, to_jsonb( _artigo )|| args );
      _artigo.artigo_colaborador_atualizacao := arg_colaborador_id;
      _artigo.artigo_dataatualizacao := now();

      -- Update artigos infos
      select ("returning").* into _artigo
        from lib.sets(_artigo )
        ;
    end if;

    _result := tweeks.funct_reg_precario(
      jsonb_build_object(
        'arg_espaco_auth', arg_espaco_auth,
        'arg_forced', false,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_precario_referencia', jsonb_build_object( 'artigo_id', _artigo.artigo_id ),
        'arg_links', json_build_array( jsonb_build_object(
           'espaco_id', arg_espaco_auth,
           'stock_minimo', null,
           'precario_custo', arg_precario_custo,
           'precario_quantidade', arg_precario_quantidade
         ))
      )
    );

    _result.message := _result.message || jsonb_build_object(
      'artigo', _artigo
    );

    return _result;

exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
        get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
        return lib.result_catch( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
end;
$$;
