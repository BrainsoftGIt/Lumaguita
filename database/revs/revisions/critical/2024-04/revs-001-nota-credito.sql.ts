import {sql} from "kitres";

export const Revs001NotaCreditoSql = sql`
create or replace function tweeks.__tg_venda_before_check() returns trigger
  language plpgsql
as
$$
declare
  _conta record;
  _artigo record;
  _new tweeks.venda;
begin
  if upper( tg_op ) in ( 'INSERT', 'UPDATE' ) then
    _new := new;
    select *
      from tweeks.conta ct
      where ct.conta_id = _new.venda_conta_id
      into _conta
    ;

    select *
      from tweeks.artigo a
      where a.artigo_id = _new.venda_artigo_id
      into _artigo
    ;
    
    -- Garantir que a quantidade vendida nunca seja de zero
    if new.venda_quantidade = 0 then
      raise exception '%', format('A quantidade de artigo para %I %s não pode ser zero', _artigo.artigo_nome, case
        when _new.venda_descricao != _artigo.artigo_nome then format( 'com descrição %I', _new.venda_descricao )
        else ''
      end) ;
    end if;

    -- Garantir que a quantidade vendida só seja negativa para o caso de conta corrente
    if _new.venda_quantidade < 0 and _conta.conta_docorigin is null then
      raise exception '%', format( 'Não vender o artigo %I %s com quantidade negativa!', _artigo.artigo_nome, case
        when _new.venda_descricao != _artigo.artigo_nome then format( 'com descrição %I', _new.venda_descricao )
        else ''
      end);
    end if;

    return new;
  end if;
end;
$$;

`;