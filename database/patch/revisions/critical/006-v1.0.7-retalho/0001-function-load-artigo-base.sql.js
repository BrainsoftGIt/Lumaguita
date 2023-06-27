"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "retalho/function/tweeks.funct_load_artigo_base", flags: [] }).sql /*language=PostgreSQL*/ `
create or replace function tweeks.funct_load_artigo_base(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    arg_espaco_auth: UID
    arg_colaborador_id: UID
    arg_artigo_composto: UID

    arg_classe_id: ID
        arg_artigo_estado: ARTIGO_ESTADO
        query: {
          any?: CODE|NAME|DESCRICAO
          code?: CODE
          name?: NAME
          desc?: DESCRICAO
        }
   */
  arg_espaco_auth uuid default args->>'arg_espaco_auth';
  arg_colaborador_id uuid default args->>'arg_colaborador_id';
  arg_artigo_composto uuid default args->>'arg_artigo_composto';

  ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
  _artigo tweeks.artigo;
  _result record;
begin
  _artigo := tweeks._get_artigo( arg_artigo_composto );

  with recursive __artigos as (
    select
        art.artigo_id,
        art.artigo_nome,
        art.artigo_artigo_id,
        array[ art.artigo_id ]::uuid[] as path
      from tweeks.artigo art
      where art._branch_uid = ___branch
        and art.artigo_artigo_id is null
    union all
      select
          es.artigo_id,
          es.artigo_nome,
          es.artigo_artigo_id,
          _e.path || es.artigo_id
        from __artigos _e
          inner join tweeks.artigo es on _e.artigo_id = es.artigo_artigo_id
        where es._branch_uid = ___branch
  ) select array_agg( _art.artigo_id ) as artigos into _result
      from __artigos _art
      where  arg_artigo_composto is null or (
          arg_artigo_composto != all( _art.path )
        and _art.artigo_id != coalesce( _artigo.artigo_artigo_id, _artigo.artigo_id )
        and _art.artigo_id != _artigo.artigo_id
      )
  ;
  
  return query
    select e.document
      from tweeks.funct_load_artigo( args ) e( document )
      where (e.document->>'artigo_id')::uuid = any( _result.artigos )
  ;
end;
$$;
`;
//# sourceMappingURL=0001-function-load-artigo-base.sql.js.map