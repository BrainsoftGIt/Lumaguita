
alter table tweeks.venda disable trigger tg_venda_after_insert_create_movimento          ;
alter table tweeks.venda disable trigger tg_venda_after_update_adjust_agrega_estado      ;
alter table tweeks.venda disable trigger tg_venda_after_update_adjust_conta_montante     ;
alter table tweeks.venda disable trigger tg_venda_after_update_create_or_cansel_movimento;

alter table tweeks.venda add venda_venda_id uuid default null;

insert into tweeks.venda(
    venda_venda_id,
    venda_conta_id,
    venda_artigo_id,
    venda_espaco_auth,
    venda_colaborador_id,
    venda_colaborador_atualizacao,
    venda_quantidade,
    venda_custounitario,
    venda_montente,
    venda_montanteagregado,
    venda_montantetotal,
    venda_imposto,
    venda_montantesemimposto,
    venda_montantecomimposto,
    venda_impostoadicionar,
    venda_impostoretirar,
    venda_estadopreparacao,
    venda_estado,
    venda_dataregistro,
    venda_dataatualizacao
) select
    a.agrega_venda_id,
    v.venda_conta_id,
    a.agrega_artigo_item,
    a.agrega_espaco_auth,
    a.agrega_colaborador_id,
    a.agrega_colaborador_atualizacao,
    a.agrega_quantidade,
    a.agrega_custounitario,
    a.agrega_montante,
    0.0,
    a.agrega_montante,
    0.0,
    a.agrega_montante,
    a.agrega_montante,
    0.0,
    0.0,
    0,
    a.agrega_estado,
    a.agrega_dataregistro,
    a.agrega_dataatualizacao
  from tweeks.agrega a
    inner join tweeks.venda v on a.agrega_venda_id = v.venda_id;
;

drop table tweeks.agrega;

alter table tweeks.venda enable trigger tg_venda_after_insert_create_movimento           ;
alter table tweeks.venda enable trigger tg_venda_after_update_adjust_agrega_estado       ;
alter table tweeks.venda enable trigger tg_venda_after_update_adjust_conta_montante      ;
alter table tweeks.venda enable trigger tg_venda_after_update_create_or_cansel_movimento ;

