import {sql} from "kitres";

export const licenseUntil = sql`
create or replace function cluster.licence_status()
returns setof jsonb
language plpgsql as $$
declare
  /**doc
   doc*/
  _data record;
  _const map.constant;
  _class character varying;
begin
  _const := map.constant();
  select
      c.*,
      tp.*,
      extract( epoch from ( format( '%s %s', c.cluster_licenselife, tp.tperiod_code ) )::interval ) / 86400 as dias_total,
      cluster_license::date - now()::date as dias_restantes
  from cluster.cluster c
      left join cluster.tperiod tp on c.cluster_tperiod_id = tp.tperiod_id
    where c.cluster_type = _const.cluster_tcluster_local
    into _data
  ;
  
  if _data.dias_restantes < 0 then _data.dias_restantes := 0; end if;

  _class := 'licenceNearOut';
  if _data.dias_restantes >= 30 then _class := 'licenceFull'; 
  elsif _data.dias_restantes > ( 0.17 * _data.dias_total ) then _class := 'licenceFull';
  end if;
  
  return next to_jsonb( _data )||jsonb_build_object(
    'class', _class
  );
end;
$$
`;