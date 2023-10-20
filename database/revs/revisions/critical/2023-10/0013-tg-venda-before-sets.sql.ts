import {sql} from "kitres";

export const tweeks__tg_venda_before_sets = sql`
create or replace function tweeks.__tg_venda_before_sets()
  returns trigger
  language plpgsql
as
$$
declare
  _sets record;
  _new tweeks.venda;
begin
  _new := new;
  if _new.venda_proforma is null then
      select * 
        from tweeks.conta ct 
        where ct.conta_id = _new.venda_conta_id
        into _sets
      ;
      _new.venda_proforma := _sets.conta_proforma;
  end if;
  _new.venda_codigoimposto := lib.str_normalize( _new.venda_codigoimposto );
  return _new;
end;
$$;
`;