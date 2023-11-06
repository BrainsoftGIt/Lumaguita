import {patchSQL, sql} from "kitres";

export const sets_conta_tserie_id = patchSQL({ unique: true, force: "v1.0.0" }).sql`
with __conta as (
    select *
    from tweeks.conta ct
             inner join tweeks.serie s on ct.conta_serie_id = s.serie_id
    where ct.conta_tserie_id is null
      and ct.conta_serie_id is not  null
      and ct.conta_estado = (map.constant()).maguita_conta_estado_fechado
)
update tweeks.conta c
set conta_tserie_id = _ct.serie_tserie_id
from __conta _ct
where c.conta_id = _ct.conta_id
`;