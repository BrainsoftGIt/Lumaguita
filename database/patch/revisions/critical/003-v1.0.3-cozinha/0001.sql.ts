import {block} from "../../../core/updater";

block( module, { identifier: "maguita_lancamento_estado_anulado", flags:[ "@unique" ],
// language=PostgreSQL
} ).sql`
  create or replace function tweeks.funct_change_venda_preparado( args jsonb )
  returns lib.res
  language plpgsql as $$
    declare
      /**
          args := {
            arg_colaborador_id: UID
            arg_espaco_auth: UID
            arg_conta_id: UID
            arg_vendas: [UID, UID, ..., UID]
          }
       */
      arg_colaborador_id uuid default args->>'arg_colaborador_id';
      arg_espaco_auth uuid default args->>'arg_espaco_auth';
      
      ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
      vendas uuid[] default array( select e.text from jsonb_array_elements_text( args->'arg_vendas' ) e( text) );
      _const map.constant;
      updates tweeks.venda[];
    begin
      _const := map.constant();
      with __update as (
          update tweeks.venda
            set venda_estadopreparacao = _const.maguita_venda_estadopreparacao_preparado,
                venda_colaborador_atualizacao = arg_colaborador_id
            where venda_id = any( vendas )
              and _branch_uid = ___branch
              and venda_estado = _const.maguita_venda_estadopreparacao_pendente
            returning *
      ) select array_agg( u ) into updates
          from __update u 
      ;
      
      
      return lib.res_true( jsonb_build_object(
        'venda', updates
      ));
    end;
  $$
`;

