insert into tweeks.toperacao( toperacao_id, toperacao_designacao )values ( 7, 'Retalho' );
select map.constant( 'toperacao_retalho', 'smallint', 7, 'Tipo de operação para retalho' ) ;
select map.constant( 'maguita_retalho_estado_ativo', 'smallint', 1, 'RETALHO ESTADO ATIVO' ) ;

create table tweeks.retalho(
    retalho_id uuid not null default public.uuid_generate_v4(),
    retalho_artigo_composto uuid not null,
    retalho_artigo_retalho uuid not null,
    retalho_espaco_auth uuid not null,
    retalho_colaborador_id uuid not null,
    retalho_colaborador_atualizacao uuid,
    retalho_sequence serial not null,
    retalho_compostomultiplo double precision,
    retalho_compostoquantidade int,
    retalho_retalhoquantidade double precision,
    retalho_estado int2 not null default ( map.get('maguita_retalho_estado_ativo') )::int2,
    retalho_dataregistro timestamptz not null default current_timestamp,
    retalho_dataatualizacao timestamptz default null,
    constraint pk_retalho_id primary key ( retalho_id ),
    constraint fk_retalho_to_artigo_composto foreign key ( retalho_artigo_composto ) references tweeks.artigo,
    constraint fk_retalho_to_artigo_retalho foreign key ( retalho_artigo_retalho ) references tweeks.artigo,
    constraint fk_retalho_to_espaco foreign key ( retalho_espaco_auth ) references tweeks.espaco
);

create or replace function tweeks.funct_reg_retalho(args jsonb) RETURNS lib.result
    LANGUAGE plpgsql
    AS $$
declare
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_artigo_composto uuid not null default args->>'arg_artigo_composto';
    arg_artigo_retalho uuid not null default args->>'arg_artigo_retalho';

    arg_retalho_compostoquantidade int not null default args->>'retalho_compostoquantidade';
    arg_retalho_retalhoquantidade double precision;
    _artigo_retalho tweeks.artigo;
    _artigo_composto tweeks.artigo;
    _retalho tweeks.retalho;

begin

    _artigo_retalho := tweeks._get_artigo( arg_artigo_retalho );
    _artigo_composto := tweeks._get_artigo( arg_artigo_composto );

    if _artigo_composto.artigo_artigo_id is null
        or _artigo_composto.artigo_compostomultiplo is null
    then
        return false ? 'O artigo selecionano para composto não é um artigo composto!';

    end if;

    arg_retalho_retalhoquantidade := arg_retalho_compostoquantidade * _artigo_composto.artigo_compostomultiplo;

    insert into tweeks.retalho(
        retalho_artigo_composto,
        retalho_artigo_retalho,
        retalho_espaco_auth,
        retalho_colaborador_id,
        retalho_compostomultiplo,
        retalho_compostoquantidade,
        retalho_retalhoquantidade
    ) values (
        arg_artigo_composto,
        arg_artigo_retalho,
        arg_espaco_auth,
        arg_colaborador_id,
        _artigo_composto.artigo_compostomultiplo,
        arg_retalho_compostoquantidade,
        arg_retalho_retalhoquantidade
    ) returning * into _retalho;

    return true ? jsonb_build_object(
        'retalho', _retalho
    );
end;
$$;

create or replace function tweeks.funct_load_artigo_composto(filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql
AS $$

declare

    /**

      Essa função serve para carregar os artigos registrado
      filter := {
        arg_espaco_auth: ID
        arg_classe_id: ID
        arg_artigo_estado: ARTIGO_ESTADO
      }
     */

    arg_artigo_retalho uuid default filter ->>'arg_artigo_retalho';
    arg_espaco_auth uuid not null default filter ->>'arg_espaco_auth';
    arg_espaco_child uuid[] not null default rule.espaco_get_childrens( arg_espaco_auth );
    _const map.constant;
begin
    _const := map.constant();

    return query
        with associacao as (
            select
                ls.link_referencia,
                sum( (st::tweeks.stock).stock_quantidade ) as associacao_stock_quantidade,
                jsonb_agg( lib.jsonb_values(
                        to_jsonb( esp ) || to_jsonb( st ),
                        'espaco_id',
                        'espaco_nome',
                        'stock_id',
                        'stock_quantidade'
                    )
                ) as links
            from tweeks.link ls
                     inner join tweeks.espaco esp on ls.link_espaco_destino = esp.espaco_id
                     inner join tweeks._get_stock( ( ls.link_referencia->>'artigo_id')::uuid, esp.espaco_id ) st on esp.espaco_id = (st::tweeks.stock).stock_espacao_id
            where ls.link_tlink_id = _const.tlink_associacao
              and ls.link_estado = _const.link_estado_associacao
              and ( ls.link_espaco_auth = any( arg_espaco_child ) or ls.link_espaco_destino = any( arg_espaco_child ) )
            group by ls.link_referencia
        ),  artigo_espaco as (
            select
                art.*,
                ass.associacao_stock_quantidade as artigo_stock,
                coalesce( ass.links, jsonb_build_array() ) as links
            from tweeks.artigo art
                     left join associacao ass on ass.link_referencia @> jsonb_build_object( 'artigo_id', art.artigo_id )
            where art.artigo_artigo_id = arg_artigo_retalho
              and ( art.artigo_espaco_auth = any( arg_espaco_child ) or ass.link_referencia is not null )
            order by
                art.artigo_nome
        ) select lib.jsonb_values(
                         ae,
                         'artigo_id',
                         'artigo_codigo',
                         'artigo_nome',
                         'artigo_foto',
                         'artigo_stock',
                         'artigo_descricao',
                         'artigo_estado',
                         'classe_id',
                         'classe_nome',
                         'links',
                         'artigo_compostomultiplo'
                     )
        from artigo_espaco ae;
end;
$$;

create or replace function rule.tg_retalho_after_insert_create_movimento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

declare

    /** Esse trigger deve decrementar o valor do stock depois que um nova venda for registrado
     **/

    _new tweeks.retalho;
    _stock_retalho tweeks.stock;
    _stock_composto tweeks.stock;
    _artigo_retalho tweeks.artigo;
    _artigo_composto tweeks.artigo;
    _const map.constant;

begin

    _const := map.constant();
    _new := new;
    _artigo_retalho := tweeks._get_artigo( _new.retalho_artigo_retalho );
    _artigo_composto := tweeks._get_artigo( _new.retalho_artigo_composto );
    _stock_retalho := tweeks._get_stock( _artigo_retalho.artigo_id, _new.retalho_espaco_auth );
    _stock_composto := tweeks._get_stock( _artigo_composto.artigo_id, _new.retalho_espaco_auth );


    -- Debitar a quantidade a retalhar do artigo composto\
    perform rule.movimento_create(
            _new.retalho_espaco_auth,
            _new.retalho_colaborador_id,
            _stock_composto.stock_id,
            _const.toperacao_retalho,
            jsonb_build_object( 'retalho_id', _new.retalho_id ),
            _new.retalho_compostoquantidade,
            _const.tmovimento_debito,
            null,
            null,
            replace( to_char( _new.retalho_sequence, 'RT-0000-0000-0000/"C"' ), ' ', '' )
        );

    -- Debitar a quantidade a retalhar do artigo composto\
    perform rule.movimento_create(
            _new.retalho_espaco_auth,
            _new.retalho_colaborador_id,
            _stock_retalho.stock_id,
            _const.toperacao_retalho,
            jsonb_build_object( 'retalho_id', _new.retalho_id ),
            _new.retalho_retalhoquantidade,
            _const.tmovimento_credito,
            null,
            null,
            replace( to_char( _new.retalho_sequence, 'RT-0000-0000-0000/"R"' ), ' ', '' )
        );

    return null;
end;
$$;

create trigger tg_retalho_after_insert_create_movimento after insert on tweeks.retalho
    for each row
    execute procedure rule.tg_retalho_after_insert_create_movimento();
