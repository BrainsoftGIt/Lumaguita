create or replace function map.constant_rename(name name, newname name, force boolean default false ) returns boolean
    language plpgsql
as
$$
declare
  /**
    * Essa função serve para registrar o valor de uma constante na base de dados
    * Se a constante já tiver o valor definido esse valor pode ser subistituido
      pelo novo desde que o parametro arg_constant_replace estiver verdadeiro
    * Caso existir sem o parametro arg_constant_replace verdadeiro uma excessão sera lançada
   */
  _constvalue map.constvalue;

begin


  select * into _constvalue
    from map.constvalue const
    where const.constvalue_name = name
  ;

  if _constvalue.constvalue_name is null then return false; end if;
  perform map.constantdrop(name, force );
  return map.constant(
    newname,
    _constvalue.constvalue_type,
    _constvalue.constvalue_value,
    _constvalue.constvalue_descrision,
    _constvalue.constvalue_editable,
    _constvalue.constvalue_comment
  );
end;
$$;