import {patchSQL, sql} from "kitres";
import {SQL} from "kitres/src/core/pg-core/scape";


export const alter_conta_add_origem = patchSQL({ unique: true }).sql`
alter table tweeks.conta add column conta_docorigin character varying default null,
  add column conta_datedocorigin date default null
;
`;


export const aleter_tweeks_artigo_alter_codigoimposto = patchSQL({ unique: true }).sql`
alter table tweeks.artigo drop column if exists artigo_codigoimposto_notacredito;
alter table tweeks.artigo drop column if exists artigo_codigoimposto_notadebito;
alter table tweeks.artigo alter column artigo_codigoimposto type jsonb using jsonb_build_object(
  'FATURACAO', artigo_codigoimposto,
  'NOTACREDITO', NULL,
  'NOTADEBITO', NULL
);
`;



export const alter_venda_add_venda_codigo_imposto = patchSQL({ unique: true }).sql`
alter table tweeks.venda add column if not exists venda_codigoimposto character varying default null;
`;


export const __check_conta_data_v2 = sql`
drop function if exists tweeks.__check_conta_data(
  _tserie_id integer,
  _conta_data date,
  _raise boolean
);

drop function if exists tweeks.__check_conta_data(
  _tserie_id integer,
  _conta_data date,
  _raise boolean,
  _serie_id uuid
);


create or replace function tweeks.__check_conta_data(
  _tserie_id integer,
  _conta_data date,
  _raise boolean,
  _serie_id uuid default null
) returns text
  language plpgsql
as
$$
declare 
  _data record;
  __serie record;
  _message text;
  _uuid_base uuid default lib.to_uuid(1);
begin
    select max( ct.conta_data ) as conta_data
      from tweeks.conta ct 
      where ct.conta_tserie_id = _tserie_id 
        and ct.conta_data <= current_date
        and coalesce( ct.conta_serie_id, _uuid_base ) = coalesce( _serie_id, ct.conta_serie_id,  _uuid_base )
      into _data
    ;
    
    _data.conta_data := coalesce( _data.conta_data, _conta_data, current_date );
    
    select *
      from tweeks.tserie ts
        left join tweeks.serie s on ts.tserie_id = s.serie_tserie_id
          and s.serie_id = _serie_id
      where ts.tserie_id = _tserie_id
      into __serie
    ;
    
--     if _conta_data > current_date and _message is null then 
--       _message :=  format( 'Data de emissão invalida para a operação! A data para a %I%s não pode ser superior a data atual!', __serie.tserie_desc, case
--         when __serie.serie_designacao is null then ''
--         else format( ' com designação %I', __serie.serie_designacao)
--       end);
--     end if;
    
    if _conta_data < _data.conta_data and _message is null then
      _message := format( 'Data de emissão invalida para a operação! A última data de emissão para %I%s foi de %I!', __serie.tserie_desc, case 
        when __serie.serie_designacao is null then ''
        else format( ' com designação %I', __serie.serie_designacao)
      end, _data.conta_data );
    end if;
    
    if _raise and _message is not null then
        raise exception '%', _message;
    end if;
    
    return _message;
end;
$$;
`;



export const correct_serie_v2 = patchSQL({ unique: true } ).sql`
update tweeks.conta
  set conta_serie_id = (conta_serie->>'serie_id')::uuid
  where conta_serie_id is null 
    and ( conta_serie->>'serie_id')::uuid is not null
    and conta_estado = (map.constant() ).maguita_conta_estado_fechado
`;