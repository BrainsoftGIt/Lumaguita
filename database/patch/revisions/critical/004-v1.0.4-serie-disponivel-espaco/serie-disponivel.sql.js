"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "tweeks.funct_load_serie_available", flags: [],
    // language=PostgreSQL
}).sql `
  create or replace function tweeks.funct_load_serie_available( args jsonb )
  returns setof jsonb
  language plpgsql as $$
    declare
      /**
        args := {
          arg_espaco_auth:UUID
          arg_colaborado_id:UUID
        }
       */
        arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
        arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
        ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
        _const map.constant;
    begin

      _const := map.constant();

      -- Obter o espaço superior que pode gerar numero de seire
      return query
        with recursive __recursive_espaco as (
          select e.espaco_id as _espaco,
               e.*,
               ts.tserie_id, ts.tserie_desc, ts.tserie_code,
               s.serie_id, s.serie_numero, s.serie_numatorizacao, s.serie_numcertificacao
            from tweeks.espaco e
               full join tweeks.tserie ts on true
               left join tweeks.serie s on e.espaco_id = s.serie_espaco_id
                and s.serie_tserie_id = ts.tserie_id
                and s.serie_estado = _const.maguita_serie_estado_ativo
                and s._branch_uid = ___branch
            where e.espaco_id = arg_espaco_auth
              and e._branch_uid = ___branch
            
            union all
            select _re._espaco, e.*,
                   _re.tserie_id, _re.tserie_desc, _re.tserie_code,
                   s.serie_id, s.serie_numero, s.serie_numatorizacao, s.serie_numcertificacao
            from __recursive_espaco _re
              inner join tweeks.espaco e on _re.espaco_espaco_id = e.espaco_id
                and not _re.espaco_gerarfatura
              inner join tweeks.serie s on e.espaco_id = s.serie_espaco_id
                and _re.tserie_id = s.serie_tserie_id
              and s.serie_tserie_id = _re.tserie_id
              and s.serie_estado = _const.maguita_serie_estado_ativo
              and s._branch_uid = ___branch
            where e._branch_uid = ___branch
        ), __serie_espaco as (
          select
                _re._espaco as espaco_id,
                _re.espaco_id as espaco_serie,
                _re.espaco_nivel,
                _re.espaco_codigo,
                _re.espaco_nome,
                _re.tserie_id,
                _re.tserie_desc,
                _re.tserie_code,
                _re.serie_id,
                _re.serie_numcertificacao,
                _re.serie_numatorizacao,
                _re.serie_numero
            from __recursive_espaco  _re
            where _re.serie_id is not null
      ) select to_jsonb( _se )
          from __serie_espaco _se
      ;
      
    end;
  $$;
`;
//# sourceMappingURL=serie-disponivel.sql.js.map