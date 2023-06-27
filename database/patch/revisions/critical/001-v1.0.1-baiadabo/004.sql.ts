import {block} from "../../../core/updater";
import {exclusion} from "../../../core/exclusion";

export const name = "simple-path";
export const before = [ ];
export const after = [ ];


block( module, { identifier: "001-v1.0.1-baiadabo:generate-key", flags:[ "@unique" ],
    exclude: exclusion( {
        mode: [ "test", "prod" ]
    })
}).sql`
  alter table tweeks.conta add conta_chave character varying;
  create or replace function tweeks.funct_pos_generate_key( args jsonb )
    returns character varying
    language plpgsql as $$
  declare
    /**
      arg_colaborador_id uuid
      arg_espaco_auth uuid
     */
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
    _key character varying;
  begin
    while _key is null loop
        _key :=  cluster.next( 'artigo.key/seq', ___branch::text, lpad := 9, lpad_char := '0' );
        _key := format( 'CTK-%s-%s', _key, lib.dset_random_text(32 ) );
        if exists( select from tweeks.conta ct where ct.conta_chave = _key ) then
          _key := null;
        end if;
      end loop;
    return _key;
  end;
  $$;

  select *
  from tweeks.funct_pos_generate_key('{"arg_espaco_auth":"45e058a5-4271-4d05-83b5-ca8145cc5091"}');
  select * from tweeks.espaco;

  alter table tweeks.conta add constraint uk_conta_chave unique ( conta_chave );
  update tweeks.conta
  set conta_chave = tweeks.funct_pos_generate_key( jsonb_build_object(
      'arg_colaborador_id', conta_colaborador_id,
      'arg_espaco_auth', conta_espaco_auth
    ))
  where conta.conta_chave is null;



  create or replace function tweeks.funct_pos_reg_conta( args jsonb ) returns lib.res
    language plpgsql
  as
  $$
  declare
    /**
      Essa função registra um nova conta
      arg = {
  
        -- obrigatorios
        arg_colaborador_id: ID,
        arg_espaco_auth: ID,
  
        conta_posto_id: ID,
  
        -- opcional
        conta_mesa: { numero:NUM, descricao:TEXT, lotacao:NUM }
        conta_id: ID?
        conta_extension: {} | { reserva_id: UID }
        conta_chave: CHAVE
  
        conta_currency_id: ID,
        conta_tpaga_id: ID,
  
        conta_cliente_id:UID
        conta_titular: CLIENTE-NOME
        conta_titularnif: CLIENTE-NIF
        conta_data: DATA,
  
        -- requerido
        arg_vendas: [
          {
            venda_id?: UID,
            venda_artigo_id: UID,
            venda_quantidade: QUANT,
            venda_custounitario: COST
            venda_custoquantidade: COST
  
            + venda_editado
            + venda_isencao
            + venda_montante
            + venda_montanteagregado
            + venda_montantetotal
            + venda_imposto
            + venda_montantesemimposto
            + venda_montantecomimposto
            + venda_impostoadicionar
            + venda_impostoretirar
  
            + venda_descricao
            + venda_lote
            + venda_validade
            + venda_metadata
  
            arg_itens: [
                venda_id: UID
                venda_artigo_id: UID,
                venda_quantidade: QUANT,
                venda_custounitario: COST
                venda_custoquantidade: COST
                venda_descricao: DESCRICAO
                venda_lote: LOTE
                venda_validade: VALIDADE
                venda_metadata: {... any extras data}
              + venda_montantetotal
            ]
          }
        ]
      }
     */

    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    arg_conta_id uuid default args->>'conta_id';
    arg_conta_chave character varying not null default args->>'conta_chave';
    arg_vendas jsonb not null default args->>'arg_vendas';

    _conta tweeks.conta;
    _const map.constant;
    _unsets jsonb[];
    _vendas uuid[] default array( select ( e.doc->>'venda_id' )::uuid from jsonb_array_elements( args->'arg_vendas' ) e ( doc ) where e.doc->>'venda_id' is not null);
    _sync jsonb;
    _reg_venda record;
    _change tweeks.conta;
    _branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );

    __conta_of_chave tweeks.conta;
  begin

    _const := map.constant();
    _conta := tweeks._get_conta( arg_conta_id );

    -- Carregar a conta com a chave correspondente
    if _conta.conta_id is null and _conta.conta_chave is null then
      select * into __conta_of_chave
      from tweeks.conta ct
      where ct.conta_chave = arg_conta_chave
      ;
    end if;

    -- Tentitiva de criar uma segunda conta com a mensa chave (normalmente tentativa de duplo click na criação de uma nova conta)
    if __conta_of_chave.conta_id is not null and _conta.conta_id is null then
      args := args || lib.sets_ref( __conta_of_chave );
      _conta := jsonb_populate_record( __conta_of_chave, args );
    end if;


    if _conta.conta_id is null then
      _conta.conta_colaborador_id := arg_colaborador_id;
      _conta.conta_espaco_auth := arg_espaco_auth;
      _conta.conta_numero := cluster.next( 'conta.conta_numero/seq',
                                           sub := _branch::text,
                                           lpad_char := '0',
                                           lpad := 5
        );
    else
      _conta.conta_colaborador_atualizacao := arg_colaborador_id;
      _conta.conta_dataatualizacao := current_timestamp;
    end if;

    _change := json_populate_record( _conta, args::json );

    select ( "returning" ).* into _change
    from lib.sets( _conta, replacer := args )  sets
    where _conta::text != _change::text
    ;

    if _change.conta_id is not null then _conta := _change; end if;

    -- Canselar as vendas que não fazem mais parte de conta
    with recursive __venda as (
      select
        ve.venda_id,
        ve.venda_estado
      from tweeks.venda ve
      where ve.venda_conta_id = _conta.conta_id
        and ve.venda_venda_id is null
        and ve.venda_id != all( _vendas )
        and ve.venda_estado in (
                                _const.maguita_venda_estado_aberto,
                                _const.maguita_venda_estado_fechado
        )
      union all
      select
        ve.venda_id,
        ve.venda_estado
      from __venda vs
             inner join tweeks.venda ve on vs.venda_id = ve.venda_venda_id
      where vs.venda_estado in (
                                _const.maguita_venda_estado_aberto,
                                _const.maguita_venda_estado_fechado
        )
    ), __disable as(
      update tweeks.venda up
        set venda_estado = _const.maguita_venda_estado_canselado
        from __venda _v
        where up.venda_id = _v.venda_id
        returning *
    ) select array_agg( to_jsonb( d ) ) into _unsets
    from __disable d;


    _reg_venda :=  tweeks.funct_pos_reg_venda(
        jsonb_build_object(
            'arg_vendas', arg_vendas,
            'arg_message_error', true,
            'arg_espaco_auth', arg_espaco_auth,
            'arg_colaborador_id', arg_colaborador_id,
            'arg_conta_id', _conta.conta_id
          )
      );

    _sync := tweeks.funct_pos__sync_conta_amount(
        jsonb_build_object(
            'arg_conta_id', _conta.conta_id,
            'arg_colaborador_id', arg_colaborador_id,
            'arg_espaco_auth', arg_espaco_auth
          )
      );

    return lib.res_true( tweeks.funct_pos_load_conta_data( jsonb_build_object(
        'arg_posto_id', args->'conta_posto_id',
        'arg_espaco_auth', arg_espaco_auth,
        'arg_colaborador_id', arg_colaborador_id,
        'arg_conta_id', _conta.conta_id
      )) || jsonb_build_object(
                             'sync', _sync,
                             'sets', _reg_venda.data->'vendas',
                             'unsets', coalesce( _unsets, array[]::jsonb[])
                           ));


  exception  when others then
    <<_ex>> declare e text; m text; d text; h text; c text;
    begin
      get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
      return lib.res_exception( _ex.e, _ex.m, _ex.h, _ex.d, _ex.c );
    end;
  end;
  $$;

  create or replace function tweeks.funct_pos_load_conta_aberto(args jsonb) returns SETOF jsonb
    language plpgsql
  as
  $$
  declare
    /**
      args := {
        arg_colaborador_id: UID*,
        arg_espaco_auth: UID?,
        arg_posto_id: UID*
      }
     */
    arg_colaborador_id uuid default args->>'arg_colaborador_id';
    arg_posto_id uuid not null default args->>'arg_posto_id';
    arg_espaco_auth uuid default args->>'arg_espaco_auth';
    _const map.constant;
  begin
    _const := map.constant();
    return query
      with __conta as(
        select
          ct.conta_id,
          ct.conta_numero,
          ct.conta_montante,
          ct.conta_mesa,
          ct.conta_chave,
          c.colaborador_id,
          c.colaborador_nome,
          c.colaborador_apelido,
          e.espaco_id,
          e.espaco_nome,
          count( ve.venda_id ) as conta_vendas
        from tweeks.conta ct
               inner join auth.colaborador c on ct.conta_colaborador_id = c.colaborador_id
               inner join tweeks.espaco e on ct.conta_espaco_auth = e.espaco_id
               left join tweeks.venda ve on ct.conta_id = ve.venda_conta_id
          and ve.venda_estado = _const.maguita_venda_estado_aberto
          and ve.venda_venda_id is null
        where ct.conta_posto_id = arg_posto_id
          and ct.conta_estado = _const.maguita_conta_estado_aberto
          and ct.conta_espaco_auth = coalesce( arg_espaco_auth, ct.conta_espaco_auth )
          and not ct.conta_proforma
        group by
          c.colaborador_id,
          ct.conta_id,
          e.espaco_id
      ) select to_jsonb( ct ) from __conta ct;
  end;
  $$;


  drop table if exists cluster.tperiod cascade ;
  create table if not exists cluster.tperiod(
                                              tperiod_id int2,
                                              tperiod_desc character varying,
                                              tperiod_label character varying,
                                              tperiod_code character varying,
                                              constraint pk_trepeat_id primary key ( tperiod_id )
  );

  INSERT INTO cluster.tperiod ( tperiod_id, tperiod_desc, tperiod_label, tperiod_code ) VALUES (1, 'Diario', 'Dia', 'day');
  INSERT INTO cluster.tperiod ( tperiod_id, tperiod_desc, tperiod_label, tperiod_code ) VALUES (2, 'Semanal', 'Semana', 'week');
  INSERT INTO cluster.tperiod ( tperiod_id, tperiod_desc, tperiod_label, tperiod_code ) VALUES (3, 'Mensal', 'Mês', 'month');
  INSERT INTO cluster.tperiod ( tperiod_id, tperiod_desc, tperiod_label, tperiod_code ) VALUES (4, 'Anual', 'Ano', 'year');

  alter table cluster.cluster drop if exists cluster_licenserepeate;
  alter table cluster.cluster add cluster_tperiod_id int2;
  alter table cluster.cluster add constraint fk_cluster_to_tperiod foreign key ( cluster_tperiod_id ) references cluster.tperiod;

  select * from cluster.tperiod order by tperiod_id;


  create or replace function cluster.sets_clusters_admin(args jsonb) returns lib.res
    language plpgsql
  as
  $$
  declare
    /**
      args := {
        cluster_license?: ( no carragamento de license )
        cluster_licenselife: QT
        cluster_tperiod_id: PERIODO (select * from cluster.tperiod order by tperiod_id)
      }
     */
    _cluster cluster.cluster;
    _result cluster.cluster;
    _res lib.res;
    _const map.constant;
    _master cluster.cluster;
    _local cluster.cluster;
    _tperiod cluster.tperiod;

    _doc jsonb default jsonb_build_object();
  begin
    _const := map.constant();
    _cluster := jsonb_populate_record( _cluster, args );

    select * into _tperiod
    from cluster.tperiod tp
    where tp.tperiod_id = _cluster.cluster_tperiod_id
    ;


    -- Quando for o cluster master
    if _cluster.cluster_type = _const.cluster_tcluster_master then
      --       raise exception 'Master:%', args;

      -- Aplicar as confifurações de cluster master
      _master := cluster._get_cluster_master();
      _master.cluster_domain := _cluster.cluster_domain;
      _master.cluster_api := _cluster.cluster_api;
      _master.cluster_port := _cluster.cluster_port;
      _master.cluster_type := _const.cluster_tcluster_master;
      _master.cluster_name := coalesce( _master.cluster_name, 'Master' );
      select ( "returning" ).* into _result from lib.sets( _master );
      _doc := _doc || jsonb_build_object( 'master', _result );


      -- Aplicar as configuraçõa do cluster local
      _local := cluster._get_cluster_local();
      _local.cluster_name := coalesce( _local.cluster_name, 'Local' );
      _local.cluster_identifier := _cluster.cluster_identifier;
      _local.cluster_license := _cluster.cluster_license;
      _local.cluster_licenselife := _cluster.cluster_licenselife;
      _local.cluster_tperiod_id := _cluster.cluster_tperiod_id;
      select ( "returning" ).* into _result from  lib.sets( _local );
      _doc := _doc || jsonb_build_object( 'local', _result );

    elseif _cluster.cluster_type = _const.cluster_tcluster_child then

      _cluster.cluster_identifier := cluster.__create_identifier();
      _cluster.cluster_api := cluster.__create_api();
      _cluster.cluster_key := format( '%s-%s', cluster.__create_api(), cluster.__create_api() );

      select ( "returning" ).* into _result
      from lib.sets( _cluster );

      if _cluster.cluster_uid is null then
        select * into _res
        from cluster.sets_cluster_license( to_jsonb( _cluster ) || lib.sets_ref( _result ) );
      end if;

      _doc := _doc || jsonb_build_object( 'child', _res );
    end if;

    return lib.res_true( _doc );
  end;
  $$;

  create or replace function cluster.load_clusters( args jsonb )
    returns SETOF jsonb
    language plpgsql
  as
  $$
  declare
    _const map.constant;
  begin
    _const := map.constant();
    return query with
                   __cluster as (
                     select
                       c.cluster_uid,
                       c.cluster_identifier,
                       c.cluster_type,
                       c.cluster_code,
                       c.cluster_path,
                       c.cluster_domain,
                       c.cluster_licenselife,
                       c.cluster_license,
                       case
                         when c.cluster_name is null and c.cluster_type = _const.cluster_tcluster_local then 'Local server'
                         else c.cluster_name
                         end as cluster_name,
                       c.cluster_port,
                       c.cluster_api,
                       c.cluster_version,
                       c.cluster_grants,
                       c.cluster_configs,
                       c.cluster_sequence,
                       tp.*
                     from cluster.cluster c
                            left join cluster.tperiod tp on c.cluster_tperiod_id = tp.tperiod_id
                   ) select to_jsonb( _c )
                 from __cluster _c
                 order by case
                            when _c.cluster_type = _const.cluster_tcluster_local then 1
                            when _c.cluster_type = _const.cluster_tcluster_master then 2
                            when _c.cluster_type = _const.cluster_tcluster_child then 3
                            when _c.cluster_type = _const.cluster_tcluster_remote then 4
                            end,
                          _c.cluster_name
    ;
  end;
  $$;

  create or replace function cluster.sets_cluster_configs(args jsonb) returns lib.res
    language plpgsql
  as
  $$
  declare
    /**
      args := {
        clusters: [{
          cluster_uid
          cluster_identifier
          cluster_path
          cluster_name
          cluster_domain
          cluster_port
          cluster_key,
          cluster_license,
          cluster_licenselife,
          cluster_tperiod_id
        }]
      }
     */
    _const map.constant;
    _data record;
  begin
    _const := map.constant();

    with __clusters as (
      select c as _cluster, e.doc as cluster_replace
      from jsonb_array_elements( args->'clusters' ) e( doc )
             inner join jsonb_populate_record( null::cluster.cluster, e.doc ) _clu on true
             inner join cluster.cluster c on  _clu.cluster_type = c.cluster_type
        and _clu.cluster_type in ( _const.cluster_tcluster_master, _const.cluster_tcluster_local )
    ), __sets as (
      select s."returning" as cluster
      from __clusters _c
             inner join lib.sets( _c._cluster, _c.cluster_replace ) s on true
    ) select array_agg( s.cluster ) as clusters into _data
    from __sets s
    ;

    return lib.res_true(  to_jsonb( _data ) );
  end;
  $$;

  create or replace function cluster.load_clusters_configs_to_child(args jsonb) returns SETOF jsonb
    language plpgsql
  as
  $$
  declare
    /**
      args := {
        cluster_identifier: PATH
        cluster_api: PATH
        cluster_key
      }
     */
    _const map.constant;
    _cluster cluster.cluster;
  begin
    _const := map.constant();
    _cluster := jsonb_populate_record( _cluster, args );

    if not exists(
        select *
        from cluster.cluster c
        where c.cluster_api = _cluster.cluster_api
          and c.cluster_identifier = _cluster.cluster_identifier
          and c.cluster_type = _const.cluster_tcluster_child
      ) then
      return;
    end if;

    return query with
                   __cluster as (
                     select
                       c.cluster_identifier,
                       case
                         when c.cluster_type = _const.cluster_tcluster_child then _const.cluster_tcluster_local
                         when c.cluster_type = _const.cluster_tcluster_local then _const.cluster_tcluster_master
                         end as cluster_type,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_key
                         end as cluster_key,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_configs
                         else jsonb_build_object()
                         end as cluster_configs,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_grants
                         else array[ ]::text[ ]
                         end as cluster_grants,

                       coalesce( c.cluster_path, '/' ) as cluster_path,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_license
                         end as cluster_license,
                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_code
                         end as cluster_code,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_licenselife
                         end as cluster_licenselife,

                       case
                         when c.cluster_type = _const.cluster_tcluster_child then c.cluster_tperiod_id
                         end as cluster_tperiod_id,

                       c.cluster_name
                     from cluster.cluster c
                     where c.cluster_type = _const.cluster_tcluster_local
                        or ( c.cluster_identifier = _cluster.cluster_identifier and c.cluster_type = _const.cluster_tcluster_child )
                   ) select
                   case
                     when _c.cluster_type = _const.cluster_tcluster_master and _c.cluster_name is null then to_jsonb( _c )
                                                                                                              - 'cluster_key'
                       || jsonb_build_object( 'cluster_name', 'Main Master (trunc)' )
                     else to_jsonb( _c )
                     end
                 from __cluster _c
    ;
  end
  $$;

  drop function cluster.sets_cluster_license(args jsonb);
  create or replace function cluster.sets_cluster_license(args jsonb) returns lib.res
    language plpgsql
  as
  $$
  declare
    /**
      args := {
        cluster_uid:UID
        cluster_tperiod_id
        cluster_licenselife: NUMBER >> REPITICAO DO PERIODO
      }
     */
    _cluster cluster.cluster;
    _interval interval;
    _tperid cluster.tperiod;
    _result cluster.cluster;
  begin
    _cluster := jsonb_populate_record( _cluster, args );
    select * into _tperid from cluster.tperiod where tperiod_id = _cluster.cluster_tperiod_id;

    if _cluster.cluster_licenselife > 0
      and _cluster.cluster_tperiod_id is not null
    then
      _interval := format( '%L %s',  _cluster.cluster_licenselife, _tperid.tperiod_code )::interval;
      _cluster.cluster_license := current_timestamp + _interval;

      select ( "returning" ).* into _result
      from lib.sets( _cluster );

      return lib.res_true( jsonb_build_object( '_cluster', _result ) );
    end if;

    return lib.res_false( 'Licensa invalida!' );
  end;
  $$;
`;

