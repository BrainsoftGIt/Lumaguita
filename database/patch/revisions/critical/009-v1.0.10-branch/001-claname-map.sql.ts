import {block} from "../../../core/updater";

block( module, { identifier: "classname-map", flags:[ "@unique" ] }).sql`
create table cluster.classmap(
  classname varchar not null, 
  classnameref varchar not null,
  status int default 1 not null,
  constraint pk_classname primary key ( classname )
);

insert into cluster.classmap( classname, classnameref ) values ( 'tweeks.branch', 'cluster.branch' );
`;


block( module, { identifier: "classname-map-pull", flags:[ "@unique" ] }).sql`

create or replace function cluster.__format(regclass) returns character varying
  stable
  strict
  language sql
as
$$
  select format( '%I.%I', schemaname, tablename )
    from pg_tables
    where format( '%I.%I', schemaname, tablename )::regclass = $1
$$;
    
create or replace function cluster.__rows( variadic regclass[])
  returns table( document jsonb, reference jsonb, classname regclass )
  language plpgsql as $$
declare
  _next record;
  _regclass regclass;
begin

  for _next in
    select *
    from unnest( $1 ) n( tname )
    loop
      _regclass := _next.tname::regclass;

      return query execute format( $sql$
        select
          to_jsonb( _t ),
          lib.sets_ref( _t ),
          %L::regclass
          from %s _t
        $sql$, _regclass, _regclass ) using $2;
    end loop;
end;
$$;
    
  create table cluster.pull (
    pull_uid uuid default gen_random_uuid() not null,
    pull_server jsonb not null ,
    pull_objects jsonb not null ,
    pull_ignores jsonb,
    pull_result jsonb,
    pull_total int8,
    pull_limit int8,
    pull_revcode character varying,
    pull_rejected int,
    pull_sequence bigserial not null,
    pull_instant timestamptz default clock_timestamp(),
    pull_status int2 default 2,
    pull_pulled jsonb default null,
    pull_finalize timestamp default null,
    constraint pk_pull_uid primary key ( pull_uid )
  );


create or replace function cluster.pull(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
    /**
      PROPOSE: Descaregar para o cluster local todas as modificações vinda dos outros cluster
      args := {
        server:ClusterSource,
        objects:( ObjectRevision[] )| DynamicReducer|any,
        ignores:cluster.ignore[]
        result:ClusterResult[]
        total:number
        limit:number,
        revCode:number,
        rejected:number,
      }
    */
    _limit int default args->>'limit';
    _server cluster.cluster;
    _cluster cluster.cluster;
    _local cluster.cluster;
    _data record;
    _i record;
    _obj jsonb default args->'objects';
    _objests cluster.object[] default array[]::cluster.object[];
    _next cluster.object;
    _pull cluster.pull;
  begin
    _pull.pull_server     :=  args->'server';
    _pull.pull_objects    :=  args->'objects';
    _pull.pull_ignores    :=  args->'ignores';
    _pull.pull_result     :=  args->'result';
    _pull.pull_total      :=  args->>'total';
    _pull.pull_limit      :=  args->>'limit';
    _pull.pull_revcode    :=  args->>'revCode';
    _pull.pull_rejected   :=  args->>'rejected';
    
    select ( "returning" ).* into _pull
      from lib.sets_in( _pull )
    ;
    
    _server := jsonb_populate_record( _server, args->'server');
    _cluster := cluster._get_cluster( _server.cluster_identifier );
    _local := cluster._get_cluster_local(  );

    with __object as (
      select o.*
        from jsonb_array_elements( _obj ) e( document )
          inner join jsonb_populate_record( null::cluster.object, e.document ) o on true
    ) select max( _o.object_seq ) as _cluster_sequence
      into _data
        from __object _o
    ;

    set session_replication_role to replica;

    for _i in
      with __map as (
        select
            obj as _object,
            col as _collector,
            ( e.document->>'_origin_identifier' ) as _origin_identifier,
            coalesce( cmp.classnameref, e.document->>'_regclass' ) as _classname,
            e.document->'_change' as _change,
            e.document->>'_result' as _result,
            ( e.document->>'_regclass' )::regclass as _regclass,
            col.collector_uid as current_collector_uid,
            col.collector_transuid as current_transuid
          from jsonb_array_elements( args->'objects' ) e ( document )
            inner join jsonb_populate_record( null::cluster.object, e.document ) as obj on true
            inner join jsonb_populate_record( null::cluster.collector, e.document ) as col on true
            left join cluster.classmap cmp on e.document->>'_regclass' = cmp.classname
      ), __objects as (
        select
            v.*,
            co.cluster_uid as _origin,
            _cluster.cluster_uid as _receiver,
            ( v._object ).object_ref,
            ( v._object ).object_date,
            ( v._object ).object_uid,
            ( v._collector ).collector_uid,
            ( v._collector ).collector_transuid
          from __map v
            inner join cluster.cluster co on co.cluster_identifier =  v._origin_identifier

    ), __classnames as (
        select array_agg( distinct  mp._classname) as allclass
        from __map mp
    
      ), __row as (
        select _r.*
          from __classnames
          inner join cluster.__rows( variadic allclass ) _r on true

      ), __current as (
        select
            _up.object_ref,
            _up._classname,
            e.document as _current,
            max( ob.object_date ) as date
          from __objects _up
            left join __row e  on e.classname = _up._regclass
              and e.reference = _up.object_ref 
            left join cluster.object ob on ob.object_share_regclass = _up._classname
              and ob.object_ref = _up.object_ref
          group by
            _up.object_ref,
            _up._classname,
            e.document
          
      ), __new as (
        select
            _ob.*,
            _cur.*,
            _created_object.object_uid is not null as _exists_object,
            _create_collector.collector_uid is not null _exists_collector,
            _cur._current is null as _exists_ref,
            (
                _cur._current is not null -- Desatualiazado: Quando já existir previamente a instancia do objecto na tabela
                and _cur.date is not null -- Desatualiazado: & Quando ja existir pelo menus algum objecto para essa referencia
                and _cur.date > _ob.object_date -- Desatualizado: & Quando a data a instancia atual for superior a data do objecto recebido

--               not all: _cur._current is null -- Quando ainda não existir a instancia do dado na tabela
--               or  _cur.date is null -- Ainda não existir nenhuma revisão para a referencia do objecto
--               or _cur.date < _ob.object_date -- Data da ultima revisão registrada for inferior a data da reisão recebida
            ) as _outdate
          from __objects _ob
            inner join __current _cur on _ob.object_ref = _cur.object_ref and _ob._classname = _cur._classname

            -- object_uid, object_share_regclass, object_cluster_origin
            left join cluster.object _created_object on
              ( _ob ).object_uid = _created_object.object_uid
              and ( _ob ).collector_transuid = _created_object.object_transuid
              and _cur._classname = _created_object.object_share_regclass
              and ( _ob )._origin = _created_object.object_cluster_origin

            -- collector_uid, collector_transuid, collector_share_regclass, collector_cluster_origin
            left join cluster.collector _create_collector on
              ( _ob ).collector_uid = _create_collector.collector_uid
              and ( _ob ).collector_transuid = _create_collector.collector_transuid
              and _cur._classname  = _create_collector.collector_share_regclass
              and ( _ob )._origin = _create_collector.collector_cluster_origin
        ) select  *
      from __new
    loop
      _next := cluster.__pull( to_jsonb( _i ) );
      if _next.object_uid is not null then
        _objests := _objests || _next;
      end if;

    end loop;
    set session_replication_role to default;

    return query
      with __object as (
        select (o::cluster.object).*
          from unnest( _objests ) o
      ), __collector as (
        select
            _o.*,
            c.*,
            _o.object_share_regclass as _regclass,
            cc.cluster_identifier as _origin_identifier
          from __object _o
          inner join cluster.collector c on _o.object_collector_uid = c.collector_uid
            and _o.object_transuid = c.collector_transuid
            and _o.object_cluster_origin = c.collector_cluster_origin
          inner join cluster.cluster cc on _o.object_cluster_origin = cc.cluster_uid
      )select to_jsonb( _c )
        from __collector _c
    ;

    -- Atualizar a versão do cluster
    with
    __result as (
      select
          pc.cluster_identifier,
          coalesce( pc.cluster_version, 0 ) as cluster_version,
          coalesce( pc.cluster_sequence, 0 ) as cluster_sequence
        from jsonb_array_elements( args->'result') e( doc )
          inner join jsonb_populate_record( null::cluster.cluster, e.doc ) pc on true
    ), __clusters as (
      select
          c.cluster_identifier,
          c.cluster_sequence,
          max( o.object_origincver ) as object_origincver,
          max( o.object_seq ) as object_seq
        from cluster.object o
          inner join cluster.cluster c on c.cluster_uid = o.object_cluster_origin
        where o.object_cluster_origin != _local.cluster_uid
        group by c.cluster_uid

    ), __status as (
      select
          _r.cluster_identifier,
          case
            when _c.cluster_identifier = _server.cluster_identifier then _r.cluster_version
            when _c.object_origincver >= _r.cluster_version then _c.object_origincver
            else _r.cluster_version
          end as cluster_version,
          case
            when _c.cluster_identifier = _server.cluster_identifier then _r.cluster_sequence
            when _c.cluster_sequence >= _r.cluster_sequence then _c.cluster_sequence
            else _r.cluster_sequence
          end as cluster_sequence
        from __clusters _c
          inner join __result _r on _c.cluster_identifier = _r.cluster_identifier

    ) update cluster.cluster c
        set
          cluster_version = _s.cluster_version,
          cluster_sequence = _s.cluster_sequence,
          cluster_verbose = case
            when _s.cluster_identifier = _cluster.cluster_identifier
              and _limit is not null
              and _limit > jsonb_array_length( _obj ) then false
            else c.cluster_verbose
          end
        from __status _s
        where c.cluster_identifier = _s.cluster_identifier
    ;

    with __ignore as (
      select _pi.*
        from jsonb_array_elements( args->'ignores' ) e( doc )
          inner join jsonb_populate_record( null::cluster.ignore, e.doc ) _pi on true
    ) insert into cluster.ignore
        select _ignor.*
        from __ignore _ignor
    ;
    
    update cluster.pull
      set pull_status = 1,
          pull_pulled = to_jsonb( _objests )
      where pull_uid = _pull.pull_uid;

    return query
      with __clusters as (
        select
            c.cluster_identifier,
            c.cluster_name,
            c.cluster_path,
            c.cluster_version,
            c.cluster_sequence
          from cluster.cluster c
      ) select jsonb_agg( _c )
        from __clusters _c;
  end;
$$;
`;


block( module, { identifier: "___override_auth_funct_autenticacao:classmap", flags:[]}).sql`
create or replace function tweeks.___override_auth_funct_autenticacao(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    Essa funcao serve para autenticar um colaborador
    no final da autenticacao sera devolvido as informacoes basica do colaborador
    args :{
      arg_auth_name: id | nif | email
      arg_auth_value: VALUE_OF_AUTH_NAME,
      arg_auth_method: senha | pin,
      arg_auth_key: VALUE_OF_AUTH_METHOD
    }
 */
  _auth record;
  espacos jsonb;
  ___branch tweeks.branch;
  _const map.constant;
begin
  _const := map.constant();

  select * into _auth
    from auth.funct_autenticacao( args );

  -- Quando o colaborador tiver accesso
  if _auth.colaborador_id is not null then
    ___branch := tweeks.__get_branch( tweeks.__branch_uid(
      _auth.colaborador_id
    ));

    if ___branch.branch_uid is not null then
      _auth.acesso := to_jsonb(array(
        select e.grants
          from auth.funct_load_grants(jsonb_build_object(
            'menus', ___branch.branch_grants->'menu',
            'colaborador_id', _auth.colaborador_id
          )) e( grants )
      ));
    end if;

    return query
      with __trabaha as (
          select array_agg( to_jsonb( tr ) || to_jsonb( es ) ) as espaco_trabalha
            from tweeks.trabalha tr
              inner join tweeks.espaco es on tr.trabalha_espaco_destino = es.espaco_id
                and tr.trabalha_colaborador_proprietario = _auth.colaborador_id
            where tr.trabalha_estado = _const.maguita_trabalha_estado_ativo
              and es.espaco_estado = _const.maguita_espaco_estado_ativo
      ) select jsonb_build_object(
            'auth', _auth,
            'espaco_trabalha', tr.espaco_trabalha
          )
        from __trabaha tr
      ;

    return query with
      __clusters as ( select c.cluster_uid, c.cluster_identifier, c.cluster_name, c.cluster_path  from cluster.cluster c ),
      __branch as (
        select
              b.branch_uid,
              b.branch_path,
              b.branch_clusters,
              b.branch_main_user,
              b.branch_main_workspace,
              b.branch_grants,
              b.branch_name,
              b.branch_licence,
              b.branch_state,
              b.branch_date,
              tb.tbranch_id,
              tb.tbranch_configs,
              tb.tbranch_name,
              e.espaco_id,
              e.espaco_nome,
              e.espaco_nivel,
              e.espaco_codigo,
              cmain.colaborador_id,
              cmain.colaborador_nome,
              cmain.colaborador_apelido,
              cmain.colaborador_email,
              cmain.colaborador_estado,
              cmain.colaborador_accesso,
              cmain.colaborador_tipo,
              array_agg( _clus ) as clusters

          from auth.colaborador cauth
            inner join cluster.branch b on cauth.colaborador_branch_uid = b.branch_uid
            inner join tweeks.tbranch tb on b.branch_tbranch_id = tb.tbranch_id
            inner join tweeks.espaco e on b.branch_uid = e.espaco_branch_uid
              and e.espaco_id = b.branch_main_workspace
            inner join auth.colaborador cmain on b.branch_uid = cmain.colaborador_branch_uid
              and cmain.colaborador_id = b.branch_main_user
            left join __clusters _clus on _clus.cluster_path = b.branch_path
              and ( b.branch_clusters is null or _clus.cluster_identifier = any( b.branch_clusters ) )
          where cauth.colaborador_id = _auth.colaborador_id
          group by
            cauth.colaborador_id,
            b.branch_uid,
            e.espaco_id,
            cmain.colaborador_id,
            tb.tbranch_id
      ) select to_jsonb( _b )
        from __branch _b;
  end if;
end;
$$;
`;