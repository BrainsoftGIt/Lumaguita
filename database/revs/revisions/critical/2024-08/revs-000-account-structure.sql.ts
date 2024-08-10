import {patchSQL} from "kitres";

export const desconto_pagar = patchSQL({unique:true}).sql`
alter table tweeks.conta disable trigger __tg_create_lancamento;
alter table tweeks.conta disable trigger sync_branch_map_before_insert_on_tweeks_conta_738120;
alter table tweeks.conta disable trigger sync_branch_map_before_update_on_tweeks_conta_797518;
alter table tweeks.conta disable trigger tg_conta_after_close;

alter table tweeks.conta add conta_montantepagar double precision;
update tweeks.conta set conta_montantepagar = conta_montante where true;
alter table tweeks.conta drop conta_montante cascade;
alter table tweeks.conta add conta_montante double precision generated always as ( conta_montantepagar - conta.conta_desconto ) stored;
alter table tweeks.conta enable trigger  __tg_create_lancamento;
alter table tweeks.conta enable trigger  sync_branch_map_before_insert_on_tweeks_conta_738120;
alter table tweeks.conta enable trigger  sync_branch_map_before_update_on_tweeks_conta_797518;
alter table tweeks.conta enable trigger  tg_conta_after_close;
`;

export const conta_descotopercent = patchSQL({ unique: true }).sql`
alter table tweeks.conta add if not exists conta_descontopercent double precision not null default 0.0;
`;