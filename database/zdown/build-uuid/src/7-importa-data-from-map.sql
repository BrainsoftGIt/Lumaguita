insert into map.constvalue
  select *
    from old_map.constvalue;


/*
colaborador_system_data to uuid
colaborador_system_support to uuid
 */

update map.constvalue
  set
    constvalue_value = lib.to_uuid( 1 ),
    constvalue_type = 'uuid'::regtype
  where constvalue_name = 'colaborador_system_data'
;

update map.constvalue
  set
    constvalue_value = lib.to_uuid( 2 ),
    constvalue_type = 'uuid'::regtype
  where constvalue_name = 'colaborador_system_support'
;

update map.constvalue
  set
    constvalue_value = lib.to_uuid( constvalue_value::int ),
    constvalue_type = 'uuid'::regtype
  where constvalue_name = 'classe_itemextra'
;
