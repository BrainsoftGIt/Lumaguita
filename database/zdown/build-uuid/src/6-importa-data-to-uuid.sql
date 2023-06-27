
SET session_replication_role = replica;


alter table auth.colaborador drop constraint fk_colaborador_to_espaco_auth;

insert into auth.tsexo select * from old_auth.tsexo;


insert into auth.colaborador(
    colaborador_id,
    colaborador_colaborador_id,
    colaborador_colaborador_atualizacao,
    colaborador_tsexo_id,
    colaborador_nome,
    colaborador_apelido,
    colaborador_email,
    colaborador_nif,
    colaborador_datanascimento,
    colaborador_senha,
    colaborador_pinmodo,
    colaborador_senhamodo,
    colaborador_accesso,
    colaborador_tipo,
    colaborador_foto,
    colaborador_token,
    colaborador_tokenlimit,
    colaborador_dataultimaatualizacasenha,
    colaborador_dataultimologin,
    colaborador_ficha,
    colaborador_estado,
    colaborador_dataatualizacao,
    colaborador_espaco_auth
) select
        lib.to_uuid( colaborador_id ),
        lib.to_uuid( colaborador_colaborador_id ),
        lib.to_uuid( colaborador_colaborador_atualizacao ),
        colaborador_tsexo_id,
        colaborador_nome,
        colaborador_apelido,
        colaborador_email,
        colaborador_nif,
        colaborador_datanascimento,
        colaborador_senha,
        colaborador_pinmodo,
        colaborador_senhamodo,
        colaborador_accesso,
        colaborador_tipo,
        colaborador_foto,
        colaborador_token,
        colaborador_tokenlimit,
        colaborador_dataultimaatualizacasenha,
        colaborador_dataultimologin,
        colaborador_ficha,
        colaborador_estado,
        colaborador_dataatualizacao,
        lib.to_uuid( colaborador_espaco_auth )
    from old_auth.colaborador;

insert into auth.menu select * from old_auth.menu;

insert into auth.acesso (
    acesso_id,
    acesso_menu_id,
    acesso_colaborador_propetario,
    acesso_colaborador_id,
    acesso_colaborador_atualizacao,
    acesso_estado,
    acesso_dataregisto,
    acesso_dataatualizacao
) select
    lib.to_uuid( acesso_id ),
    acesso_menu_id,
    lib.to_uuid( acesso_colaborador_propetario ),
    lib.to_uuid( acesso_colaborador_id ),
    lib.to_uuid( acesso_colaborador_atualizacao ),
    acesso_estado,
    acesso_dataregisto,
    acesso_dataatualizacao
from old_auth.acesso;

set search_path to tweeks, public, opr, lib;

insert into auth.autenticacao (
    autenticacao_id,
    autenticacao_colaborador_id,
    autenticacao_estado,
    autenticacao_dataregisto,
    autenticacao_dataatualizacao,
    autenticacao_chave
) select
        (autenticacao_id).to_uuid,
        (autenticacao_colaborador_id).to_uuid,
        autenticacao_estado,
        autenticacao_dataregisto,
        autenticacao_dataatualizacao,
        autenticacao_chave
    from old_auth.autenticacao;


insert into tweeks.acerto(
    acerto_id,
    acerto_stock_id,
    acerto_colaborador_id,
    acerto_colaborador_atualizacao,
    acerto_quantidade,
    acerto_diferenca,
    acerto_quantidadeinicial,
    acerto_observacao,
    acerto_estado,
    acerto_dataregistro,
    acerto_dataatualizacao,
    acerto_espaco_auth
) select
    lib.to_uuid( acerto_id ),
    lib.to_uuid( acerto_stock_id ),
    lib.to_uuid( acerto_colaborador_id ),
    lib.to_uuid( acerto_colaborador_atualizacao ),
    acerto_quantidade,
    acerto_diferenca,
    acerto_quantidadeinicial,
    acerto_observacao,
    acerto_estado,
    acerto_dataregistro,
    acerto_dataatualizacao,
    lib.to_uuid( acerto_espaco_auth )
from old_tweeks.acerto;


insert into tweeks.tespaco select * from old_tweeks.tespaco;


insert into tweeks.espaco(
    espaco_codigo,
    espaco_id,
    espaco_tespaco_id,
    espaco_colaborador_id,
    espaco_colaborador_atualizaco,
    espaco_nome,
    espaco_descricao,
    espaco_estado,
    espaco_dataregistro,
    espaco_dataatualizacao,
    espaco_espaco_id,
    espaco_gerarfatura,
    espaco_configurar,
    espaco_faturaano,
    espaco_seriefatura,
    espaco_serieconta,
    espaco_configuracao
) select
    espaco_codigo,
    lib.to_uuid( espaco_id ),
    espaco_tespaco_id,
    lib.to_uuid( espaco_colaborador_id ),
    lib.to_uuid( espaco_colaborador_atualizaco ),
    espaco_nome,
    espaco_descricao,
    espaco_estado,
    espaco_dataregistro,
    espaco_dataatualizacao,
    lib.to_uuid( espaco_espaco_id ),
    espaco_gerarfatura,
    espaco_configurar,
    espaco_faturaano,
    espaco_seriefatura,
    espaco_serieconta,
    espaco_configuracao
from old_tweeks.espaco;



insert into tweeks.classe(
    classe_id,
    classe_colaborador_id,
    classe_colaborador_atualizacao,
    classe_nome,
    classe_estado,
    classe_dataregistro,
    classe_dataatualizacao,
    classe_codigo,
    classe_lastcodigo,
    classe_espaco_auth,
    classe_classe_id,
    classe_foto,
    classe_position
) select
        lib.to_uuid( classe_id ),
        lib.to_uuid( classe_colaborador_id ),
        lib.to_uuid( classe_colaborador_atualizacao ),
        classe_nome,
        classe_estado,
        classe_dataregistro,
        classe_dataatualizacao,
        classe_codigo,
        classe_lastcodigo,
        lib.to_uuid( classe_espaco_auth ),
        lib.to_uuid( classe_classe_id ),
        classe_foto,
        classe_position
    from old_tweeks.classe;

insert into tweeks.artigo(
    artigo_id,
    artigo_classe_id,
    artigo_colaborador_id,
    artigo_colaborador_atualizacao,
    artigo_codigo,
    artigo_nome,
    artigo_custo,
    artigo_quantidadecusto,
    artigo_preparacao,
    artigo_foto,
    artigo_descricao,
    artigo_stock,
    artigo_stocknegativo,
    artigo_stockminimo,
    artigo_estado,
    artigo_dataregistro,
    artigo_dataatualizacao,
    artigo_espaco_auth
) select
    lib.to_uuid( artigo_id ),
    lib.to_uuid( artigo_classe_id),
    lib.to_uuid( artigo_colaborador_id ),
    lib.to_uuid( artigo_colaborador_atualizacao ),
    artigo_codigo,
    artigo_nome,
    artigo_custo,
    artigo_quantidadecusto,
    artigo_preparacao,
    artigo_foto,
    artigo_descricao,
    artigo_stock,
    artigo_stocknegativo,
    artigo_stockminimo,
    artigo_estado,
    artigo_dataregistro,
    artigo_dataatualizacao,
    lib.to_uuid( artigo_espaco_auth )
from old_tweeks.artigo;


insert into tweeks.tposto select * from old_tweeks.tposto;

insert into tweeks.posto (
    posto_id,
    posto_espaco_auth,
    posto_colaborador_id,
    posto_colaborador_atualizacao,
    posto_designacao,
    posto_montante,
    posto_estado,
    posto_dataregistro,
    posto_dataatualizacao,
    posto_tposto_id,
    posto_endereco,
    posto_multipleuser,
    posto_espaco_destino,
    posto_ip,
    posto_mac,
    posto_hostname,
    posto_ipv4,
    posto_ipv6,
    posto_distro,
    posto_platform,
    posto_vendor,
    posto_user
) select
   lib.to_uuid( posto_id ),
   lib.to_uuid( posto_espaco_auth ),
   lib.to_uuid( posto_colaborador_id ),
   lib.to_uuid( posto_colaborador_atualizacao ),
   posto_designacao,
   posto_montante,
   posto_estado,
   posto_dataregistro,
   posto_dataatualizacao,
   posto_tposto_id,
   posto_endereco,
   posto_multipleuser,
   lib.to_uuid( posto_espaco_destino ),
   posto_ip,
   posto_mac,
   posto_hostname,
   posto_ipv4,
   posto_ipv6,
   posto_distro,
   posto_platform,
   posto_vendor,
   posto_user
  from old_tweeks.posto;


insert into tweeks.caixa(
    caixa_id,
    caixa_posto_id,
    caixa_espaco_auth,
    caixa_colaborador_id,
    caixa_colaborador_atualizacao,
    caixa_montanteinicial,
    caixa_montantefecho,
    caixa_quantidadecheque,
    caixa_observacao,
    caixa_estado,
    caixa_dataregistro,
    caixa_dataatualizacao,
    caixa_montanteinicialposto,
    caixa_montantefechoposto,
    caixa_quantidadechequeposto
) select
        lib.to_uuid( caixa_id ),
        lib.to_uuid( caixa_posto_id ),
        lib.to_uuid( caixa_espaco_auth ),
        lib.to_uuid( caixa_colaborador_id ),
        lib.to_uuid( caixa_colaborador_atualizacao ),
        caixa_montanteinicial,
        caixa_montantefecho,
        caixa_quantidadecheque,
        caixa_observacao,
        caixa_estado,
        caixa_dataregistro,
        caixa_dataatualizacao,
        caixa_montanteinicialposto,
        caixa_montantefechoposto,
        caixa_quantidadechequeposto

  from old_tweeks.caixa;




insert into tweeks.conta (
    conta_id,
    conta_reserva_id,
    conta_posto_id,
    conta_caixa_fechopagamento,
    conta_mesa_id,
    conta_currency_id,
    conta_tpaga_id,
    conta_colaborador_id,
    conta_colaborador_atualizacao,
    conta_numero,
    conta_titularnif,
    conta_data,
    conta_numerofatura,
    conta_montante,
    conta_montanteamortizado,
    conta_montantetroco,
    conta_montantemoeda,
    conta_taxacambio,
    conta_imprensa,
    conta_estado,
    conta_dataregistro,
    conta_dataatualizacao,
    conta_observacao,
    conta_espaco_auth,
    conta_desconto
) select
    lib.to_uuid( conta_id ),
    lib.to_uuid( conta_reserva_id ),
    lib.to_uuid( conta_posto_id ),
    lib.to_uuid( conta_caixa_fechopagamento ),
    lib.to_uuid( conta_mesa_id ),
    conta_currency_id,
    conta_tpaga_id,
    lib.to_uuid( conta_colaborador_id  ),
    lib.to_uuid( conta_colaborador_atualizacao ),
    conta_numero,
    conta_titularnif,
    conta_data,
    conta_numerofatura,
    conta_montante,
    conta_montanteamortizado,
    conta_montantetroco,
    conta_montantemoeda,
    conta_taxacambio,
    conta_imprensa,
    conta_estado,
    conta_dataregistro,
    conta_dataatualizacao,
    conta_observacao,
    lib.to_uuid( conta_espaco_auth ),
    conta_desconto
  from old_tweeks.conta
;



insert into tweeks.venda(
    venda_id,
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
    venda_estado,
    venda_dataregistro,
    venda_dataatualizacao,
    venda_estadopreparacao,
    venda_imposto,
    venda_montantesemimposto,
    venda_montantecomimposto,
    venda_impostoretirar,
    venda_impostoadicionar
) select
   lib.to_uuid( venda_id ),
   lib.to_uuid( venda_conta_id ),
   lib.to_uuid( venda_artigo_id ),
   lib.to_uuid( venda_espaco_auth ),
   lib.to_uuid( venda_colaborador_id ),
   lib.to_uuid( venda_colaborador_atualizacao ),
   venda_quantidade,
   venda_custounitario,
   venda_montente,
   venda_montanteagregado,
   venda_montantetotal,
   venda_estado,
   venda_dataregistro,
   venda_dataatualizacao,
   venda_estadopreparacao,
   venda_imposto,
   venda_montantesemimposto,
   venda_montantecomimposto,
   venda_impostoretirar,
   venda_impostoadicionar
 from old_tweeks.venda;

insert into tweeks.agrega (
    agrega_id,
    agrega_venda_id,
    agrega_artigo_item,
    agrega_colaborador_id,
    agrega_colaborador_atualizacao,
    agrega_quantidade,
    agrega_custounitario,
    agrega_montante,
    agrega_estado,
    agrega_dataregistro,
    agrega_dataatualizacao,
    agrega_espaco_auth
) select
        lib.to_uuid( agrega_id),
        lib.to_uuid( agrega_venda_id ),
        lib.to_uuid( agrega_artigo_item ),
        lib.to_uuid( agrega_colaborador_id ),
        lib.to_uuid( agrega_colaborador_atualizacao),
        agrega_quantidade,
        ( agrega_custounitario )::float8,
        agrega_montante,
        agrega_estado,
        agrega_dataregistro,
        agrega_dataatualizacao,
        lib.to_uuid( agrega_espaco_auth)
    from old_tweeks.agrega;


insert into tweeks.amortizacao(
    amortizacao_id,
    amortizacao_caixa_id,
    amortizacao_espaco_auth,
    amortizacao_tpaga_id,
    amortizacao_currency_id,
    amortizacao_colaborador_id,
    amortizacao_colaborador_atualizacao,
    amortizacao_referencia,
    amortizacao_documento,
    amortizacao_data,
    amortizacao_montante,
    amortizacao_montantetroco,
    amortizacao_montantemoeda,
    amortizacao_taxacambio,
    amortizacao_estado,
    amortizacao_dataregistro,
    amortizacao_dataatualizacao
) select
    lib.to_uuid( amortizacao_id ),
    lib.to_uuid( amortizacao_caixa_id ),
    lib.to_uuid( amortizacao_espaco_auth ),
    amortizacao_tpaga_id,
    amortizacao_currency_id,
    lib.to_uuid( amortizacao_colaborador_id ),
    lib.to_uuid( amortizacao_colaborador_atualizacao ),
    amortizacao_referencia,
    amortizacao_documento,
    amortizacao_data,
    amortizacao_montante,
    amortizacao_montantetroco,
    amortizacao_montantemoeda,
    amortizacao_taxacambio,
    amortizacao_estado,
    amortizacao_dataregistro,
    amortizacao_dataatualizacao
from old_tweeks.amortizacao
;


insert into tweeks.cambio(
    cambio_id,
    cambio_currency_id,
    cambio_colaborador_id,
    cambio_colaborador_atualizacao,
    cambio_taxa,
    cambio_data,
    cambio_estado,
    cambio_dataregistro,
    cambio_espaco_auth
) select
    lib.to_uuid( cambio_id ),
    cambio_currency_id,
    lib.to_uuid( cambio_colaborador_id ),
    lib.to_uuid( cambio_colaborador_atualizacao ),
    cambio_taxa,
    cambio_data,
    cambio_estado,
    cambio_dataregistro,
    lib.to_uuid( cambio_espaco_auth )
from old_tweeks.cambio;


insert into tweeks.dispoe(
    dispoe_id,
    dispoe_artigo_id,
    dispoe_artigo_item,
    dispoe_colaborador_id,
    dispoe_colaborador_atualizacao,
    dispoe_estado,
    dispoe_dataregistro,
    dispoe_dataatualizacao,
    dispoe_espaco_auth
) select
    lib.to_uuid( dispoe_id ),
    lib.to_uuid( dispoe_artigo_id ),
    lib.to_uuid( dispoe_artigo_item ),
    lib.to_uuid( dispoe_colaborador_id ),
    lib.to_uuid( dispoe_colaborador_atualizacao ),
    dispoe_estado,
    dispoe_dataregistro,
    dispoe_dataatualizacao,
    lib.to_uuid( dispoe_espaco_auth )
from old_tweeks.dispoe;





insert into tweeks.entrada (
    entrada_id,
    entrada_espaco_auth,
    entrada_fornecedor_id,
    entrada_artigo_id,
    entrada_colaborador_id,
    entrada_colaborador_atualizacao,
    entrada_codigofatura,
    entrada_data,
    entrada_montante,
    entrada_quantidade,
    entrada_quantidadeinicial,
    entrada_quantidadefinal,
    entrada_descricao,
    entrada_estado,
    entrada_dataregistro,
    entrada_dataatualizacao,
    entrada_espaco_destino
) select
    lib.to_uuid( entrada_id ),
    lib.to_uuid( entrada_espaco_auth ),
    lib.to_uuid( entrada_fornecedor_id ),
    lib.to_uuid( entrada_artigo_id ),
    lib.to_uuid( entrada_colaborador_id ),
    lib.to_uuid( entrada_colaborador_atualizacao ),
    entrada_codigofatura,
    entrada_data,
    entrada_montante,
    entrada_quantidade,
    entrada_quantidadeinicial,
    entrada_quantidadefinal,
    entrada_descricao,
    entrada_estado,
    entrada_dataregistro,
    entrada_dataatualizacao,
    lib.to_uuid( entrada_espaco_destino )
from old_tweeks.entrada;


insert into tweeks.fornecedor (
    fornecedor_id,
    fornecedor_colaborador_id,
    fornecedor_colaborador_atualizacao,
    fornecedor_nif,
    fornecedor_nome,
    fornecedor_email,
    fornecedor_contacto,
    fornecedor_endereco,
    fornecedor_estado,
    fornecedor_dataregistro,
    fornecedor_dataatualizacao,
    fornecedor_espaco_auth
) select
  lib.to_uuid( fornecedor_id ),
  lib.to_uuid( fornecedor_colaborador_id ),
  lib.to_uuid( fornecedor_colaborador_atualizacao ),
  fornecedor_nif,
  fornecedor_nome,
  fornecedor_email,
  fornecedor_contacto,
  fornecedor_endereco,
  fornecedor_estado,
  fornecedor_dataregistro,
  fornecedor_dataatualizacao,
  lib.to_uuid( fornecedor_espaco_auth )
from old_tweeks.fornecedor;





insert into tweeks.trabalha(
    trabalha_id,
    trabalha_colaborador_id,
    trabalha_colaborador_proprietario,
    trabalha_colaborador_atualizacao,
    trabalha_perfil_id,
    trabalha_espaco_auth,
    trabalha_estado,
    trabalha_dataregistro,
    trabalha_dataatualizacao,
    trabalha_posicao,
    trabalha_espaco_destino
) select
    lib.to_uuid( trabalha_id ),
    lib.to_uuid( trabalha_colaborador_id ),
    lib.to_uuid( trabalha_colaborador_proprietario ),
    lib.to_uuid( trabalha_colaborador_atualizacao ),
    lib.to_uuid( trabalha_perfil_id ),
    lib.to_uuid( trabalha_espaco_auth ),
    trabalha_estado,
    trabalha_dataregistro,
    trabalha_dataatualizacao,
    trabalha_posicao,
    lib.to_uuid( trabalha_espaco_destino )
  from old_tweeks.trabalha;


insert into tweeks.imposto(
    imposto_id,
    imposto_tipoimposto_id,
    imposto_artigo_id,
    imposto_taplicar_id,
    imposto_espaco_auth,
    imposto_colaborador_id,
    imposto_colaborador_atualizacao,
    imposto_percentagem,
    imposto_valor,
    imposto_estado,
    imposto_dataregistro,
    imposto_dataatualizacao
)
select
    lib.to_uuid( imposto_id ),
    lib.to_uuid( imposto_tipoimposto_id ),
    lib.to_uuid( imposto_artigo_id ),
    imposto_taplicar_id,
    lib.to_uuid( imposto_espaco_auth ),
    lib.to_uuid( imposto_colaborador_id ),
    lib.to_uuid( imposto_colaborador_atualizacao ),
    imposto_percentagem,
    imposto_valor,
    imposto_estado,
    imposto_dataregistro,
    imposto_dataatualizacao
  from old_tweeks.imposto;


insert into tweeks.impostovenda(
    impostovenda_id,
    impostovenda_venda_id,
    impostovenda_tipoimposto_id,
    impostovenda_espaco_auth,
    impostovenda_colaborador_id,
    impostovenda_colaborador_atualizacao,
    impostovenda_valor,
    impostovenda_percentagem,
    impostovenda_estado,
    impostovenda_dataregistro,
    impostovenda_dataatualizacao
) select
    lib.to_uuid( impostovenda_id ),
    lib.to_uuid( impostovenda_venda_id ),
    lib.to_uuid( impostovenda_tipoimposto_id ),
    lib.to_uuid( impostovenda_espaco_auth ),
    lib.to_uuid( impostovenda_colaborador_id ),
    lib.to_uuid( impostovenda_colaborador_atualizacao ),
    impostovenda_valor,
    impostovenda_percentagem,
    impostovenda_estado,
    impostovenda_dataregistro,
    impostovenda_dataatualizacao
 from old_tweeks.impostovenda;



insert into tweeks.tlink select * from old_tweeks.tlink;

create table tweeks.link_associacao partition of tweeks.link for values in( 2 );
create table tweeks.link_ativo partition of tweeks.link for values in( 1 );
create table tweeks.link_default partition of tweeks.link default;

insert into tweeks.link (
    link_referencia,
    link_id,
    link_tlink_id,
    link_link_id,
    link_link_associacao,
    link_espaco_auth,
    link_espaco_destino,
    link_colaborador_id,
    link_colaborador_atualizacao,
    link_posicao,
    link_nome,
    link_config,
    link_estado,
    link_dataregistro,
    link_dataatualizacao
) select
    jsonb_object_agg(
        e.key,
        case
            when lib.is_bigint( e.value ) then lib.to_uuid( e.value::int8 )::text
            else e.value
        end
    ) ,
    lib.to_uuid( link_id ),
    link_tlink_id,
    lib.to_uuid( link_link_id ),
    lib.to_uuid( link_link_associacao ),
    lib.to_uuid( link_espaco_auth ),
    lib.to_uuid( link_espaco_destino ),
    lib.to_uuid( link_colaborador_id ),
    lib.to_uuid( link_colaborador_atualizacao ),
    link_posicao,
    link_nome,
    link_config,
    link_estado,
    link_dataregistro,
    link_dataatualizacao
  from old_tweeks.link
    inner join jsonb_each_text( link_referencia ) e on true
group by
    link_id,
    link_referencia,
    link_tlink_id,
    link_link_id,
    link_link_associacao,
    link_referencia,
    link_espaco_auth,
    link_espaco_destino,
    link_colaborador_id,
    link_colaborador_atualizacao,
    link_posicao,
    link_nome,
    link_config,
    link_estado,
    link_dataregistro,
    link_dataatualizacao
;

insert into tweeks.mesa(
    mesa_id,
    mesa_colaborador_id,
    mesa_colaborador_atualizacao,
    mesa_numero,
    mesa_designacao,
    mesa_lotacao,
    mesa_estado,
    mesa_dataregistro,
    mesa_dataatualizacao,
    mesa_espaco_auth
) select
    lib.to_uuid( mesa_id  ),
    lib.to_uuid( mesa_colaborador_id ),
    lib.to_uuid( mesa_colaborador_atualizacao ),
    mesa_numero,
    mesa_designacao,
    mesa_lotacao,
    mesa_estado,
    mesa_dataregistro,
    mesa_dataatualizacao,
    lib.to_uuid( mesa_espaco_auth )
  from old_tweeks.mesa;



insert into tweeks.stock (
    stock_id,
    stock_artigo_id,
    stock_espacao_id,
    stock_colaborador_id,
    stock_colaborador_atualizacao,
    stock_quantidade,
    stock_estado,
    stock_dataregistro,
    stock_dataatualizacao
) select
    lib.to_uuid( stock_id ),
    lib.to_uuid( stock_artigo_id ),
    lib.to_uuid( stock_espacao_id ),
    lib.to_uuid( stock_colaborador_id ),
    lib.to_uuid( stock_colaborador_atualizacao ),
    stock_quantidade,
    stock_estado,
    stock_dataregistro,
    stock_dataatualizacao
  from old_tweeks.stock;

insert into tweeks.tmovimento select * from old_tweeks.tmovimento;
insert into tweeks.toperacao select * from old_tweeks.toperacao;


insert into tweeks.movimento(
    movimento_referencia,
    movimento_id,
    movimento_stock_id,
    movimento_toperacao_id,
    movimento_tmovimento_id,
    movimento_colaborador_id,
    movimento_colaborador_atualizacao,
    movimento_data,
    movimento_documento,
    movimento_quantidade,
    movimento_quantidadeinicia,
    movimento_quantidadefinal,
    movimento_observacao,
    movimento_estado,
    movimento_dataregistro,
    movimento_dataatualizacao,
    movimento_espaco_auth
) select
    jsonb_object_agg(
      e.key,
      case
          when lib.is_bigint( e.value ) then lib.to_uuid( e.value::int8 )::text
          else e.value
          end
    ),
    lib.to_uuid( movimento_id ),
    lib.to_uuid( movimento_stock_id ),
    movimento_toperacao_id,
    movimento_tmovimento_id,
    lib.to_uuid( movimento_colaborador_id ),
    lib.to_uuid( movimento_colaborador_atualizacao ),
    movimento_data,
    movimento_documento,
    movimento_quantidade,
    movimento_quantidadeinicia,
    movimento_quantidadefinal,
    movimento_observacao,
    movimento_estado,
    movimento_dataregistro,
    movimento_dataatualizacao,
    lib.to_uuid( movimento_espaco_auth )
  from old_tweeks.movimento
    inner join jsonb_each_text( movimento_referencia ) e on true
group by
    movimento_id,
    movimento_referencia,
    movimento_stock_id,
    movimento_toperacao_id,
    movimento_tmovimento_id,
    movimento_colaborador_id,
    movimento_colaborador_atualizacao,
    movimento_data,
    movimento_documento,
    movimento_quantidade,
    movimento_quantidadeinicia,
    movimento_quantidadefinal,
    movimento_observacao,
    movimento_estado,
    movimento_dataregistro,
    movimento_dataatualizacao,
    movimento_espaco_auth
;


insert into tweeks.precario(
    precario_referencia,
    precario_id,
    precario_colaborador_id,
    precario_colaborador_atualizacao,
    precario_custo,
    precario_quantidade,
    precario_estado,
    precario_dataregistro,
    precario_dataatualizacao,
    precario_espaco_auth
) select
    jsonb_object_agg(
        e.key,
        case
            when lib.is_bigint( e.value ) then lib.to_uuid( e.value::int8 )::text
            else e.value
            end
    ),
    lib.to_uuid( precario_id ),
    lib.to_uuid( precario_colaborador_id ),
    lib.to_uuid( precario_colaborador_atualizacao ),
    precario_custo,
    precario_quantidade,
    precario_estado,
    precario_dataregistro,
    precario_dataatualizacao,
    lib.to_uuid( precario_espaco_auth )
  from old_tweeks.precario
    inner join jsonb_each_text( precario_referencia ) e on true
  group by
      precario_id,
      precario_referencia,
      precario_colaborador_id,
      precario_colaborador_atualizacao,
      precario_referencia,
      precario_custo,
      precario_quantidade,
      precario_estado,
      precario_dataregistro,
      precario_dataatualizacao,
      precario_espaco_auth
;

insert into tweeks.taplicar select * from old_tweeks.taplicar;

insert into tweeks.tipoimposto(
    tipoimposto_id,
    tipoimposto_colaborador_id,
    tipoimposto_colaborador_atualizacao,
    tipoimposto_nome,
    tipoimposto_codigo,
    tipoimposto_estado,
    tipoimposto_dataregistro,
    tipoimposto_dataatuzaliacao,
    tipoimposto_espaco_auth
) select
    lib.to_uuid( tipoimposto_id ),
    lib.to_uuid( tipoimposto_colaborador_id ),
    lib.to_uuid( tipoimposto_colaborador_atualizacao ),
    tipoimposto_nome,
    tipoimposto_codigo,
    tipoimposto_estado,
    tipoimposto_dataregistro,
    tipoimposto_dataatuzaliacao,
    lib.to_uuid( tipoimposto_espaco_auth )
from old_tweeks.tipoimposto;



insert into tweeks.taxa(
    taxa_id,
    taxa_tipoimposto_id,
    taxa_colaborador_id,
    taxa_colaborador_atualizacao,
    taxa_percentagem,
    taxa_taxa,
    taxa_estado,
    taxa_dataregistro,
    taxa_dataatualizacao,
    taxa_espaco_auth
)
select
    lib.to_uuid( taxa_id ),
    lib.to_uuid( taxa_tipoimposto_id ),
    lib.to_uuid( taxa_colaborador_id ),
    lib.to_uuid( taxa_colaborador_atualizacao ),
    taxa_percentagem,
    taxa_taxa,
    taxa_estado,
    taxa_dataregistro,
    taxa_dataatualizacao,
    lib.to_uuid( taxa_espaco_auth )
  from old_tweeks.taxa;

insert into tweeks.tpaga select * from old_tweeks.tpaga;

insert into tweeks.transacao(
    transacao_referencia,
    transacao_id,
    transacao_posto_id,
    transacao_toperacao_id,
    transacao_tmovimento_id,
    transacao_espaco_auth,
    transacao_colaborador_id,
    transacao_colaborador_atualizacao,
    transacao_documento,
    transacao_zerar,
    transacao_montante,
    transacao_montanteinicial,
    transacao_montantefinal,
    transacao_observacao,
    transacao_dataregistro,
    transacao_dataatualizacao,
    transacao_estado
) select
    jsonb_object_agg(
        e.key,
        case
          when lib.is_bigint( e.value ) then lib.to_uuid( e.value::int8 )::text
          else e.value
          end
    ),
    lib.to_uuid( transacao_id ),
    lib.to_uuid( transacao_posto_id ),
    transacao_toperacao_id,
    transacao_tmovimento_id,
    lib.to_uuid( transacao_espaco_auth ),
    lib.to_uuid( transacao_colaborador_id),
    lib.to_uuid( transacao_colaborador_atualizacao),
    transacao_documento,
    transacao_zerar,
    transacao_montante,
    transacao_montanteinicial,
    transacao_montantefinal,
    transacao_observacao,
    transacao_dataregistro,
    transacao_dataatualizacao,
    transacao_estado
  from old_tweeks.transacao
    inner join jsonb_each_text( transacao_referencia ) e on true
  group by
    transacao_referencia,
    transacao_id,
    transacao_posto_id,
    transacao_toperacao_id,
    transacao_tmovimento_id,
    transacao_espaco_auth,
    transacao_colaborador_id,
    transacao_colaborador_atualizacao,
    transacao_documento,
    transacao_zerar,
    transacao_montante,
    transacao_montanteinicial,
    transacao_montantefinal,
    transacao_observacao,
    transacao_dataregistro,
    transacao_dataatualizacao
;


insert into tweeks.transferencia(
    transferencia_id,
    transferencia_stock_origem,
    transferencia_stock_destino,
    transferencia_colaborador_id,
    transferencia_colaborador_atualizacao,
    transferencia_quantidade,
    transferencia_data,
    transferencia_documento,
    transferencia_observacao,
    transferencia_estado,
    transferencia_dataregistro,
    transferencia_dataatualizacao,
    transferencia_espaco_auth
)
select
    lib.to_uuid( transferencia_id ),
    lib.to_uuid( transferencia_stock_origem ),
    lib.to_uuid( transferencia_stock_destino ),
    lib.to_uuid( transferencia_colaborador_id ),
    lib.to_uuid( transferencia_colaborador_atualizacao ),
    transferencia_quantidade,
    transferencia_data,
    transferencia_documento,
    transferencia_observacao,
    transferencia_estado,
    transferencia_dataregistro,
    transferencia_dataatualizacao,
    lib.to_uuid( transferencia_espaco_auth )
  from old_tweeks.transferencia;





