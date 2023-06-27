"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "retalho/function/tweeks.funct_pos_reg_retalho", flags: [] }).sql `
create or replace function tweeks.funct_pos_reg_retalho(args jsonb) returns lib.res
  language plpgsql
as
$$
declare
  /*
   args := {
      arg_colaborador_id,
      arg_espaco_auth,

      retalho_artigo_composto
      retalho_artigo_base
      retalho_composicao
      retalho_quantidade
   }
   */
    arg_colaborador_id uuid not null default args->>'arg_colaborador_id';
    arg_espaco_auth uuid not null default args->>'arg_espaco_auth';
    
    _artigo_base tweeks.artigo;
    _artigo_composto tweeks.artigo;
    _retalho tweeks.retalho;
    ___branch uuid default tweeks.__branch_uid( arg_colaborador_id, arg_espaco_auth );
    __stock record;
begin
    _retalho := jsonb_populate_record( _retalho, args );
    _artigo_base := tweeks._get_artigo( _retalho.retalho_artigo_base );
    _artigo_composto := tweeks._get_artigo( _retalho.retalho_artigo_composto );
    
    if _artigo_composto.artigo_artigo_id is null or _artigo_composto.artigo_compostoquantidade is null then
      return lib.res_false( 'O artigo selecionano para retalhar não é um artigo composto!' );
    end if;
    
    __stock := tweeks._get_stock( _retalho.retalho_artigo_composto, arg_espaco_auth );
    
    if __stock.stock_quantidade < _retalho.retalho_quantidade
        and not _artigo_composto.artigo_stocknegativo
    then
      return lib.res_false( 'Quantidade do artigo composto no armazem atual não é suficiente para retalhar!');
    end if;
    
    _retalho.retalho_codigo = tweeks.__generate_retalho_code( ___branch );
    _retalho.retalho_colaborador_id := arg_colaborador_id;
    _retalho.retalho_espaco_auth := arg_espaco_auth;
    
    select ( "returning" ).* into _retalho
      from lib.sets( _retalho );
    
    return lib.res_true(jsonb_build_object(
        'retalho', _retalho
    ));
end;
$$;  
`;
//# sourceMappingURL=0002-function-reg-retalho.sql.js.map