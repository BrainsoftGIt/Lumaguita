import {block} from "../../../core/updater";

block( module, { identifier: "iva-serie", flags:[ "@unique" ]} ).sql`
select map.constant( 'maguita_autorizacao_estado_ativo', 'int2', 1 );
select map.constant( 'maguita_autorizacao_estado_fechado', 'int2', 0 );

create table if not exists tweeks.autorizacao(
  autorizacao_uid uuid not null default gen_random_uuid(),
  autorizacao_colaborador_uid uuid not null,
  autorizacao_colaborador_atualizacao uuid,
  autorizacao_espaco_auth uuid not null,
  autorizacao_espaco_uid uuid not null,
  autorizacao_designacao character varying not null,
  autorizacao_ano integer not null,
  autorizacao_numero character varying,
  autorizacao_estado int2 not null default map.get('maguita_autorizacao_estado_ativo')::int2,
  autorizacao_dataregistro timestamp not null default now(),
  autorizacao_dataatualizacao timestamp default null,
  _branch_uid uuid not null,
  constraint pk_autorizacao_uid primary key ( autorizacao_uid ),
  constraint fk_autorizacao_to_espaco foreign key ( autorizacao_espaco_uid )
    references tweeks.espaco
);

alter table tweeks.serie add if not exists serie_autorizacao_uid uuid default null;
alter table tweeks.serie drop constraint if exists fk_serie_to_autorizacao;
alter table tweeks.serie add constraint fk_serie_to_autorizacao
  foreign key ( serie_autorizacao_uid )
  references tweeks.autorizacao
;


create or replace function tweeks.funct_sets_autorizacao(
  args jsonb
) returns lib.res
language plpgsql as $$
declare
  /**
    {
      arg_colaborador_id: UID
      arg_espaco_auth: UID

      autorizacao_uid: UID
      autorizacao_espaco_uid: UID
      autorizacao_designacao:DESIG
      autorizacao_numero:NUMERO,
      series: [
        {
          serie_id uuid not null,
          serie_tserie_id int2 not null,
          serie_espaco_id uuid not null,
          serie_designacao character varying not null,
          serie_numero character varying not null,
          serie_quantidade int not null,
          serie_numcertificacao,
          serie_numatorizacao
        }
      ]
    }
   */
  _autorizacao tweeks.autorizacao;
  arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
  arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
  arg_branch_uid uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _res_serie jsonb default jsonb_build_array();
  _next record;
  _data record;

begin
  _autorizacao := jsonb_populate_record( _autorizacao, args );
  if _autorizacao.autorizacao_uid is null then
    _autorizacao.autorizacao_colaborador_uid := arg_colaborador_id;
    _autorizacao.autorizacao_espaco_auth := arg_espaco_auth;
    _autorizacao._branch_uid := arg_branch_uid;
    _autorizacao.autorizacao_dataregistro := now();
    _autorizacao.autorizacao_ano := extract( years from now() );
  else
    _autorizacao.autorizacao_colaborador_atualizacao := arg_colaborador_id;
    _autorizacao.autorizacao_dataatualizacao := now();
  end if;

  select ( "returning" ).* into _autorizacao
    from lib.sets( _autorizacao );

  for _data in (
    select
        e.document || jsonb_build_object(
          'arg_colaborador_id', arg_colaborador_id,
          'arg_espaco_auth', arg_espaco_auth,
          'serie_autorizacao_uid', _autorizacao.autorizacao_uid
        ) as document_serie
      from jsonb_array_elements( args->'series' ) e ( document )
  ) loop
    select * into _next
      from tweeks.funct_sets_serie( _data.document_serie ) e;

    _res_serie := _res_serie || jsonb_build_object(
      'serie', _data.document_serie,
      'result', _next
    );
  end loop;

  return lib.result_true( jsonb_build_object(
    'autorizacao', _autorizacao,
    'series', _res_serie
  ));
end;
$$;
`;
