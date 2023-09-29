import {patchSQL} from "kitres";

export const cleanTestClients = patchSQL({
}).sql`
update tweeks.cliente
  set cliente_estado = (map.constant()).maguita_cliente_estado_desativo
  where cliente_estado = (map.constant()).maguita_cliente_estado_desativo
    and _branch_uid is null
    and cliente_id not in (
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002'
      )
`