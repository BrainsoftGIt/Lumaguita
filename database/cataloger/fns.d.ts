import { db } from "kitres";
import tns from "./tns";
import dfns from "./dfns";

namespace fns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export interface FunctionRefsMap {}

  export interface FunctionMap {
    cluster: dfns.declare._Cluster.FunctionDefinition;
    auth: dfns.declare._Auth.FunctionDefinition;
    libdom: dfns.declare._Libdom.FunctionDefinition;
    tweeks: dfns.declare._Tweeks.FunctionDefinition;
  }

  export interface FunctionProps {
    cluster: dfns.declare._Cluster.FunctionProps;
    auth: dfns.declare._Auth.FunctionProps;
    libdom: dfns.declare._Libdom.FunctionProps;
    tweeks: dfns.declare._Tweeks.FunctionProps;
  }

  export interface FunctionsPropsRefs {
    "cluster.__user_map": Function._Cluster.__user_map.Properties;
    "cluster.__tg_share_guard_upgrade": Function._Cluster.__tg_share_guard_upgrade.Properties;
    "auth.funct_reg_privilegio": Function._Auth.funct_reg_privilegio.Properties;
    "auth.funct_change_perfil": Function._Auth.funct_change_perfil.Properties;
    "cluster.__pull": Function._Cluster.__pull.Properties;
    "libdom.domsync": Function._Libdom.domsync.Properties;
    "auth._menu_load_structure": Function._Auth._menu_load_structure.Properties;
    "cluster.object_filter": Function._Cluster.object_filter.Properties;
    "auth.funct_load_colaborador_all_menu": Function._Auth.funct_load_colaborador_all_menu.Properties;
    "auth._get_perfil": Function._Auth._get_perfil.Properties;
    "cluster.create_resource": Function._Cluster.create_resource.Properties;
    "cluster.__tg_share_truncate": Function._Cluster.__tg_share_truncate.Properties;
    "auth._colaborador_accesso_desc": Function._Auth._colaborador_accesso_desc.Properties;
    "cluster.reduce": Function._Cluster.reduce.Properties;
    "cluster.sets_resources_downloaded": Function._Cluster._Sets_Resources_Downloaded_16619.Properties &
      Function._Cluster._Sets_Resources_Downloaded_16620.Properties;
    "cluster.load_resources_pendents": Function._Cluster.load_resources_pendents.Properties;
    "cluster.load_clusters_configs_to_child": Function._Cluster.load_clusters_configs_to_child.Properties;
    "auth.funct_load_menu": Function._Auth.funct_load_menu.Properties;
    "libdom.entry_drop": Function._Libdom.entry_drop.Properties;
    "cluster.push": Function._Cluster.push.Properties;
    "libdom.sync_drop": Function._Libdom.sync_drop.Properties;
    "auth.funct_change_colaborador": Function._Auth.funct_change_colaborador.Properties;
    "auth.funct_autenticacao_logoff": Function._Auth.funct_autenticacao_logoff.Properties;
    "cluster.__tg_version_commit": Function._Cluster.__tg_version_commit.Properties;
    "cluster.__format": Function._Cluster.__format.Properties;
    "auth.funct_change_colaborador_token_ativate": Function._Auth.funct_change_colaborador_token_ativate.Properties;
    "cluster.__get": Function._Cluster.__get.Properties;
    "cluster.__tg_before_create_filter": Function._Cluster.__tg_before_create_filter.Properties;
    "auth.funct_load_colaborador": Function._Auth.funct_load_colaborador.Properties;
    "libdom.get": Function._Libdom._get.Properties;
    "cluster.__create_api": Function._Cluster.__create_api.Properties;
    "auth._get_colaborador": Function._Auth._get_colaborador.Properties;
    "libdom.domain_of": Function._Libdom._Domain_Of_16734.Properties &
      Function._Libdom._Domain_Of_16735.Properties;
    "cluster.__rows": Function._Cluster.__rows.Properties;
    "cluster.__tg_version_add_when_update": Function._Cluster.__tg_version_add_when_update.Properties;
    "cluster.load_clusters": Function._Cluster.load_clusters.Properties;
    "libdom.entry": Function._Libdom.entry.Properties;
    "libdom.trigger_sync_domsync": Function._Libdom.trigger_sync_domsync.Properties;
    "cluster.funct_load_configs": Function._Cluster.funct_load_configs.Properties;
    "cluster.__add": Function._Cluster.__add.Properties;
    "cluster.pull": Function._Cluster.pull.Properties;
    "auth._autenticacao_chave_generate": Function._Auth._autenticacao_chave_generate.Properties;
    "auth._colaborador_estado_desc": Function._Auth._colaborador_estado_desc.Properties;
    "cluster.__format_proc": Function._Cluster.__format_proc.Properties;
    "libdom.rebuild": Function._Libdom.rebuild.Properties;
    "cluster.__create_object_version": Function._Cluster.__create_object_version.Properties;
    "cluster.status": Function._Cluster.status.Properties;
    "auth.funct_change_colaborador_senha": Function._Auth.funct_change_colaborador_senha.Properties;
    "auth._menu_create": Function._Auth._menu_create.Properties;
    "auth.funct_load_grants": Function._Auth.funct_load_grants.Properties;
    "libdom.api_change_entryset": Function._Libdom.api_change_entryset.Properties;
    "auth.funct_change_colaborador_accesso_disable": Function._Auth.funct_change_colaborador_accesso_disable.Properties;
    "auth.funct_reg_trabalha": Function._Auth.funct_reg_trabalha.Properties;
    "cluster.load_clusters_local_as_remotes": Function._Cluster.load_clusters_local_as_remotes.Properties;
    "libdom.columns": Function._Libdom.columns.Properties;
    "libdom.api_load_entryset": Function._Libdom.api_load_entryset.Properties;
    "libdom.constant": Function._Libdom.constant.Properties;
    "cluster.declare_filter": Function._Cluster.declare_filter.Properties;
    "auth._menu_create_set_up": Function._Auth._menu_create_set_up.Properties;
    "cluster.__tg_version_add_when_insert": Function._Cluster.__tg_version_add_when_insert.Properties;
    "auth.funct_load_colaborador_simple": Function._Auth.funct_load_colaborador_simple.Properties;
    "cluster.__generate_cluster_code": Function._Cluster.__generate_cluster_code.Properties;
    "auth.funct_load_colaborador_any_menu": Function._Auth.funct_load_colaborador_any_menu.Properties;
    "cluster.unlink_cluster": Function._Cluster.unlink_cluster.Properties;
    "cluster.__collect_change": Function._Cluster.__collect_change.Properties;
    "cluster._get_cluster": Function._Cluster._get_cluster.Properties;
    "cluster.next": Function._Cluster.next.Properties;
    "libdom.trigger_sync_entry": Function._Libdom.trigger_sync_entry.Properties;
    "cluster._get_version_local": Function._Cluster._get_version_local.Properties;
    "auth.funct_load_menu_cascade": Function._Auth.funct_load_menu_cascade.Properties;
    "cluster._get_cluster_child": Function._Cluster._get_cluster_child.Properties;
    "cluster.accept_remote_cluster": Function._Cluster.accept_remote_cluster.Properties;
    "libdom.domain": Function._Libdom.domain.Properties;
    "libdom.domain_document": Function._Libdom.domain_document.Properties;
    "cluster.__is_replication": Function._Cluster.__is_replication.Properties;
    "cluster.sets_cluster_tree_position": Function._Cluster.sets_cluster_tree_position.Properties;
    "libdom.describe": Function._Libdom.describe.Properties;
    "libdom.exports": Function._Libdom.exports.Properties;
    "auth._colaborador_token_encrypt": Function._Auth._colaborador_token_encrypt.Properties;
    "auth.funct_load_colaborador_token_restore": Function._Auth.funct_load_colaborador_token_restore.Properties;
    "cluster.define_namespace": Function._Cluster.define_namespace.Properties;
    "libdom.entry_list": Function._Libdom.entry_list.Properties;
    "cluster.accept_revision": Function._Cluster.accept_revision.Properties;
    "cluster.__tg_share_check": Function._Cluster.__tg_share_check.Properties;
    "cluster.__create_identifier": Function._Cluster.__create_identifier.Properties;
    "cluster.funct_reg_acesso": Function._Cluster.funct_reg_acesso.Properties;
    "cluster.__transaction_uid": Function._Cluster.__transaction_uid.Properties;
    "libdom.sync_entry": Function._Libdom.sync_entry.Properties;
    "cluster.switch_remote_connection": Function._Cluster.switch_remote_connection.Properties;
    "cluster._cluster_accept_child": Function._Cluster._cluster_accept_child.Properties;
    "cluster._get_cluster_local": Function._Cluster._get_cluster_local.Properties;
    "cluster.load_cluster_by_namespace": Function._Cluster.load_cluster_by_namespace.Properties;
    "auth.funct_autenticacao": Function._Auth.funct_autenticacao.Properties;
    "auth._colaborador_generate_senha_token": Function._Auth._colaborador_generate_senha_token.Properties;
    "libdom.set": Function._Libdom._set.Properties;
    "auth.funct_reg_perfil": Function._Auth.funct_reg_perfil.Properties;
    "cluster.sets_clusters_admin": Function._Cluster.sets_clusters_admin.Properties;
    "auth.funct_change_colaborador_token_acesso": Function._Auth.funct_change_colaborador_token_acesso.Properties;
    "cluster.can_send_revision": Function._Cluster.can_send_revision.Properties;
    "cluster.can_send_object": Function._Cluster.can_send_object.Properties;
    "cluster.__user_default": Function._Cluster.__user_default.Properties;
    "auth.funct_change_colaborador_pin": Function._Auth.funct_change_colaborador_pin.Properties;
    "cluster.__is_sub_path": Function._Cluster.__is_sub_path.Properties;
    "auth.funct_change_colaborador_accesso_reativar": Function._Auth.funct_change_colaborador_accesso_reativar.Properties;
    "cluster.add": Function._Cluster.add.Properties;
    "auth.funct_change_colaborador_estado_disable": Function._Auth.funct_change_colaborador_estado_disable.Properties;
    "cluster.licence_status": Function._Cluster.licence_status.Properties;
    "cluster.__user_replication": Function._Cluster.__user_replication.Properties;
    "cluster.load_paths": Function._Cluster.load_paths.Properties;
    "auth._colaborador_generate_pin_token": Function._Auth._colaborador_generate_pin_token.Properties;
    "auth._encrypt": Function._Auth._encrypt.Properties;
    "libdom.domset": Function._Libdom.domset.Properties;
    "cluster.__pks": Function._Cluster.__pks.Properties;
    "auth.funct_reg_colaborador": Function._Auth.funct_reg_colaborador.Properties;
    "cluster.sets_cluster_machine_id": Function._Cluster.sets_cluster_machine_id.Properties;
    "cluster.change": Function._Cluster.change.Properties;
    "auth.funct_reg_acesso": Function._Auth.funct_reg_acesso.Properties;
    "cluster._get_cluster_master": Function._Cluster._get_cluster_master.Properties;
    "auth.funct_load_colaborador_by_token": Function._Auth.funct_load_colaborador_by_token.Properties;
    "libdom.prefix": Function._Libdom.prefix.Properties;
    "cluster.__tg_share_map": Function._Cluster.__tg_share_map.Properties;
    "libdom.constant_document": Function._Libdom.constant_document.Properties;
    "cluster.sets_cluster_remote": Function._Cluster.sets_cluster_remote.Properties;
    "cluster.sets_cluster_configs": Function._Cluster.sets_cluster_configs.Properties;
    "cluster.commit": Function._Cluster.commit.Properties;
    "cluster.sets_cluster_license": Function._Cluster.sets_cluster_license.Properties;
    "tweeks.funct_pos_load_posto": Function._Tweeks.funct_pos_load_posto.Properties;
    "tweeks.funct_pos_load_artigo_extras": Function._Tweeks.funct_pos_load_artigo_extras.Properties;
    "tweeks.funct_pos__sync_conta_amount": Function._Tweeks.funct_pos__sync_conta_amount.Properties;
    "tweeks.funct_change_colaborador": Function._Tweeks.funct_change_colaborador.Properties;
    "tweeks._get_caixa": Function._Tweeks._get_caixa.Properties;
    "tweeks.funct_load_caixa_by_colaborador": Function._Tweeks.funct_load_caixa_by_colaborador.Properties;
    "tweeks.funct_load_cluster_by_branch": Function._Tweeks.funct_load_cluster_by_branch.Properties;
    "tweeks.funct_load_serie": Function._Tweeks.funct_load_serie.Properties;
    "tweeks.funct_pos_load_conta_data": Function._Tweeks.funct_pos_load_conta_data.Properties;
    "tweeks.funct_reg_link_associacao": Function._Tweeks.funct_reg_link_associacao.Properties;
    "tweeks.__load_cambio_day": Function._Tweeks.__load_cambio_day.Properties;
    "tweeks.funct_sets_guia": Function._Tweeks.funct_sets_guia.Properties;
    "tweeks.funct_change_ordem_classe": Function._Tweeks.funct_change_ordem_classe.Properties;
    "tweeks._get_artigo": Function._Tweeks._get_artigo.Properties;
    "tweeks.funct_reg_classe": Function._Tweeks.funct_reg_classe.Properties;
    "tweeks.funct_report_transacao": Function._Tweeks.funct_report_transacao.Properties;
    "tweeks.viewargs_set": Function._Tweeks.viewargs_set.Properties;
    "tweeks.funct_change_mesa": Function._Tweeks.funct_change_mesa.Properties;
    "tweeks.funct_change_link_disable": Function._Tweeks.funct_change_link_disable.Properties;
    "tweeks.funct_load_entrada": Function._Tweeks.funct_load_entrada.Properties;
    "tweeks.funct_change_conta": Function._Tweeks.funct_change_conta.Properties;
    "tweeks.funct_sets_branch": Function._Tweeks.funct_sets_branch.Properties;
    "tweeks.__generate_acerto_code": Function._Tweeks.__generate_acerto_code.Properties;
    "tweeks.funct_reg_artigo": Function._Tweeks.funct_reg_artigo.Properties;
    "tweeks.sets_parametrizacao": Function._Tweeks.sets_parametrizacao.Properties;
    "tweeks.__sets_defaults_units": Function._Tweeks.__sets_defaults_units.Properties;
    "tweeks.funct_change_artigo_estado": Function._Tweeks.funct_change_artigo_estado.Properties;
    "tweeks.__tg_fluxo_on_venda": Function._Tweeks.__tg_fluxo_on_venda.Properties;
    "tweeks.__generate_posto_chave": Function._Tweeks.__generate_posto_chave.Properties;
    "tweeks.funct_pos_reg_conta": Function._Tweeks.funct_pos_reg_conta.Properties;
    "tweeks.funct_change_link_unlink": Function._Tweeks.funct_change_link_unlink.Properties;
    "tweeks.funct_load_tipoimposto": Function._Tweeks.funct_load_tipoimposto.Properties;
    "tweeks.funct_change_link_switch": Function._Tweeks.funct_change_link_switch.Properties;
    "tweeks.funct_reg_precario": Function._Tweeks.funct_reg_precario.Properties;
    "tweeks.funct_load_classe_simple_report": Function._Tweeks.funct_load_classe_simple_report.Properties;
    "tweeks.sets_lancamento": Function._Tweeks.sets_lancamento.Properties;
    "tweeks.funct_load_transferencia": Function._Tweeks.funct_load_transferencia.Properties;
    "tweeks.funct_load_espaco_simple": Function._Tweeks.funct_load_espaco_simple.Properties;
    "tweeks.funct_reg_item": Function._Tweeks.funct_reg_item.Properties;
    "tweeks.funct_change_item_estado": Function._Tweeks.funct_change_item_estado.Properties;
    "tweeks.___override_auth_funct_load_grants": Function._Tweeks.___override_auth_funct_load_grants.Properties;
    "tweeks.funct_load_conta_docs_financa": Function._Tweeks.funct_load_conta_docs_financa.Properties;
    "tweeks.funct_change_posto_open": Function._Tweeks.funct_change_posto_open.Properties;
    "tweeks.funct_load_items_simple": Function._Tweeks.funct_load_items_simple.Properties;
    "tweeks.funct_load_espaco_migrate": Function._Tweeks.funct_load_espaco_migrate.Properties;
    "tweeks.funct_pos_load_colaborador": Function._Tweeks.funct_pos_load_colaborador.Properties;
    "tweeks.funct_load_artigo_simple": Function._Tweeks.funct_load_artigo_simple.Properties;
    "tweeks._get_espaco": Function._Tweeks._get_espaco.Properties;
    "tweeks.__tg_conta_after_close": Function._Tweeks.__tg_conta_after_close.Properties;
    "tweeks.funct_change_posto_estado": Function._Tweeks.funct_change_posto_estado.Properties;
    "tweeks.funct_pos_load_cliente": Function._Tweeks.funct_pos_load_cliente.Properties;
    "tweeks.funct_pos_reg_deposito": Function._Tweeks.funct_pos_reg_deposito.Properties;
    "tweeks.funct_load_artigo": Function._Tweeks.funct_load_artigo.Properties;
    "tweeks.funct_load_report_parametrized": Function._Tweeks.funct_load_report_parametrized.Properties;
    "tweeks.funct_load_espaco_configuracao": Function._Tweeks.funct_load_espaco_configuracao.Properties;
    "tweeks.funct_pos_reg_vendaimposto": Function._Tweeks.funct_pos_reg_vendaimposto.Properties;
    "tweeks.__lancamento_regularizacao": Function._Tweeks.__lancamento_regularizacao.Properties;
    "tweeks.__artigo_has_stock": Function._Tweeks.__artigo_has_stock.Properties;
    "tweeks.funct_load_posto": Function._Tweeks.funct_load_posto.Properties;
    "tweeks.funct_load_espaco": Function._Tweeks.funct_load_espaco.Properties;
    "tweeks.__generate_fornecedor_code": Function._Tweeks.__generate_fornecedor_code.Properties;
    "tweeks.funct_load_conta_by_caixa": Function._Tweeks.funct_load_conta_by_caixa.Properties;
    "tweeks.funct_pos_report_venda": Function._Tweeks.funct_pos_report_venda.Properties;
    "tweeks.__tg_fluxo_on_transferencia": Function._Tweeks.__tg_fluxo_on_transferencia.Properties;
    "tweeks.funct_pos_load_artigo_composto": Function._Tweeks.funct_pos_load_artigo_composto.Properties;
    "tweeks.__branch_menu": Function._Tweeks.__branch_menu.Properties;
    "tweeks.funct_load_lancamento": Function._Tweeks.funct_load_lancamento.Properties;
    "tweeks.__tg_before_update_classe": Function._Tweeks.__tg_before_update_classe.Properties;
    "tweeks.funct_change_chave_restore": Function._Tweeks.funct_change_chave_restore.Properties;
    "tweeks.funct_load_artig_check_nome": Function._Tweeks.funct_load_artig_check_nome.Properties;
    "tweeks.funct_pos_change_conta_anular": Function._Tweeks.funct_pos_change_conta_anular.Properties;
    "tweeks.funct_load_device_unregistered": Function._Tweeks.funct_load_device_unregistered.Properties;
    "tweeks._get_tmovimento": Function._Tweeks._get_tmovimento.Properties;
    "tweeks.funct_load_posto_status": Function._Tweeks.funct_load_posto_status.Properties;
    "tweeks.funct_pos_reg_venda": Function._Tweeks.funct_pos_reg_venda.Properties;
    "tweeks._get_stock": Function._Tweeks._get_stock.Properties;
    "tweeks.funct_sets_fornecedor": Function._Tweeks.funct_sets_fornecedor.Properties;
    "tweeks._get_conta": Function._Tweeks._get_conta.Properties;
    "tweeks.funct_change_conta_preparar": Function._Tweeks.funct_change_conta_preparar.Properties;
    "tweeks.funct_load_autorizacao": Function._Tweeks.funct_load_autorizacao.Properties;
    "tweeks.funct_sets_serie": Function._Tweeks.funct_sets_serie.Properties;
    "tweeks.funct_pos_change_conta_fechar": Function._Tweeks.funct_pos_change_conta_fechar.Properties;
    "tweeks.funct_load_deposito_data": Function._Tweeks.funct_load_deposito_data.Properties;
    "tweeks.funct_report_caixa": Function._Tweeks.funct_report_caixa.Properties;
    "tweeks.funct_load_posto_closed": Function._Tweeks.funct_load_posto_closed.Properties;
    "tweeks.__generate_classe_code": Function._Tweeks.__generate_classe_code.Properties;
    "tweeks.funct_reg_dispoe": Function._Tweeks.funct_reg_dispoe.Properties;
    "tweeks.funct_reg_colaborador": Function._Tweeks.funct_reg_colaborador.Properties;
    "tweeks.funct_change_link_move": Function._Tweeks.funct_change_link_move.Properties;
    "tweeks.funct_reg_stock": Function._Tweeks.funct_reg_stock.Properties;
    "tweeks._get_classe": Function._Tweeks._get_classe.Properties;
    "tweeks.funct_change_espaco_configuracao": Function._Tweeks.funct_change_espaco_configuracao.Properties;
    "tweeks.funct_change_espaco": Function._Tweeks.funct_change_espaco.Properties;
    "tweeks.__tg_use_branch": Function._Tweeks.__tg_use_branch.Properties;
    "tweeks.funct_pos_load_conta_proforma": Function._Tweeks.funct_pos_load_conta_proforma.Properties;
    "tweeks.funct_pos_generate_key": Function._Tweeks.funct_pos_generate_key.Properties;
    "tweeks.funct_load_classe": Function._Tweeks.funct_load_classe.Properties;
    "tweeks.__get_serie_espaco": Function._Tweeks.__get_serie_espaco.Properties;
    "tweeks.funct_reg_transferencia": Function._Tweeks.funct_reg_transferencia.Properties;
    "tweeks.funct_change_fornecedor_estado": Function._Tweeks.funct_change_fornecedor_estado.Properties;
    "tweeks.funct_load_cambio_history": Function._Tweeks.funct_load_cambio_history.Properties;
    "tweeks.__space_branch_level": Function._Tweeks.__space_branch_level.Properties;
    "tweeks.funct_reg_trabalha": Function._Tweeks.funct_reg_trabalha.Properties;
    "tweeks.viewarg": Function._Tweeks.viewarg.Properties;
    "tweeks.funct_load_artigo_base": Function._Tweeks.funct_load_artigo_base.Properties;
    "tweeks.funct_load_trabalha": Function._Tweeks.funct_load_trabalha.Properties;
    "tweeks.funct_reg_mesa": Function._Tweeks.funct_reg_mesa.Properties;
    "tweeks._get_link": Function._Tweeks._get_link.Properties;
    "tweeks.funct_load_serie_available": Function._Tweeks.funct_load_serie_available.Properties;
    "tweeks.funct_load_artigo_data": Function._Tweeks.funct_load_artigo_data.Properties;
    "tweeks.funct_change_classe_estado": Function._Tweeks.funct_change_classe_estado.Properties;
    "tweeks.funct_reg_conta_nota_credito": Function._Tweeks.funct_reg_conta_nota_credito.Properties;
    "tweeks.funct_report_compra_entrada": Function._Tweeks.funct_report_compra_entrada.Properties;
    "tweeks.funct_pos_reg_cliente": Function._Tweeks.funct_pos_reg_cliente.Properties;
    "tweeks.load_clusters": Function._Tweeks.load_clusters.Properties;
    "tweeks.funct_sets_unit": Function._Tweeks.funct_sets_unit.Properties;
    "tweeks.funct_change_mesa_estado": Function._Tweeks.funct_change_mesa_estado.Properties;
    "tweeks.__check_stock_on_venda": Function._Tweeks.__check_stock_on_venda.Properties;
    "tweeks.funct_load_mesa_livre": Function._Tweeks.funct_load_mesa_livre.Properties;
    "tweeks.funct_change_conta_imprimir": Function._Tweeks.funct_change_conta_imprimir.Properties;
    "tweeks.funct_load_fornecedor_simple": Function._Tweeks.funct_load_fornecedor_simple.Properties;
    "tweeks.funct_change_espaco_estado": Function._Tweeks.funct_change_espaco_estado.Properties;
    "tweeks._get_item": Function._Tweeks._get_item.Properties;
    "tweeks.funct_pos_load_artigo_search": Function._Tweeks.funct_pos_load_artigo_search.Properties;
    "tweeks.funct_load_unit": Function._Tweeks.funct_load_unit.Properties;
    "tweeks.funct_reg_fornecedor": Function._Tweeks.funct_reg_fornecedor.Properties;
    "tweeks.funct_reg_conta_docs_financa": Function._Tweeks.funct_reg_conta_docs_financa.Properties;
    "tweeks._get_impostos_taxa": Function._Tweeks._get_impostos_taxa.Properties;
    "tweeks.funct_load_fornecedor": Function._Tweeks.funct_load_fornecedor.Properties;
    "tweeks.funct_load_chave": Function._Tweeks.funct_load_chave.Properties;
    "tweeks.funct_report_stock_movimentos": Function._Tweeks.funct_report_stock_movimentos.Properties;
    "tweeks.__infinity_loop": Function._Tweeks.__infinity_loop.Properties;
    "tweeks.funct_reg_entrada": Function._Tweeks.funct_reg_entrada.Properties;
    "tweeks.__get_autorizacao": Function._Tweeks.__get_autorizacao.Properties;
    "tweeks.__generate_caixa_code": Function._Tweeks.__generate_caixa_code.Properties;
    "tweeks.funct_load_tespaco": Function._Tweeks.funct_load_tespaco.Properties;
    "tweeks.funct_report_venda_artigo": Function._Tweeks.funct_report_venda_artigo.Properties;
    "tweeks.funct_load_parametrizacao": Function._Tweeks.funct_load_parametrizacao.Properties;
    "tweeks._get_branch_by_colaborador": Function._Tweeks._get_branch_by_colaborador.Properties;
    "tweeks.funct_sets_autorizacao_continue": Function._Tweeks.funct_sets_autorizacao_continue.Properties;
    "tweeks.__fluxo_stock": Function._Tweeks.__fluxo_stock.Properties;
    "tweeks.sets_atividade": Function._Tweeks.sets_atividade.Properties;
    "tweeks.funct_pos__calc_imposto": Function._Tweeks.funct_pos__calc_imposto.Properties;
    "tweeks.funct_load_guia_data": Function._Tweeks.funct_load_guia_data.Properties;
    "tweeks.funct_load_tpaga": Function._Tweeks.funct_load_tpaga.Properties;
    "tweeks._get_venda": Function._Tweeks._get_venda.Properties;
    "tweeks.__precario": Function._Tweeks.__precario.Properties;
    "tweeks.funct_load_serie_distribuicao": Function._Tweeks.funct_load_serie_distribuicao.Properties;
    "tweeks.funct_load_conta_documento": Function._Tweeks.funct_load_conta_documento.Properties;
    "tweeks.__generate_cliente_code": Function._Tweeks.__generate_cliente_code.Properties;
    "tweeks.__tg_fluxo_on_retalho": Function._Tweeks.__tg_fluxo_on_retalho.Properties;
    "tweeks.funct_change_autorizacao_closeyear": Function._Tweeks.funct_change_autorizacao_closeyear.Properties;
    "tweeks.___override_auth_funct_autenticacao": Function._Tweeks.___override_auth_funct_autenticacao.Properties;
    "tweeks.funct_load_artigo_exports": Function._Tweeks.funct_load_artigo_exports.Properties;
    "tweeks.__tg_venda_before_check": Function._Tweeks.__tg_venda_before_check.Properties;
    "tweeks.funct_change_venda_preparado": Function._Tweeks.funct_change_venda_preparado.Properties;
    "tweeks.funct_pos_load_conta_aberto": Function._Tweeks.funct_pos_load_conta_aberto.Properties;
    "tweeks.funct_change_venda": Function._Tweeks.funct_change_venda.Properties;
    "tweeks.viewargs_object": Function._Tweeks.viewargs_object.Properties;
    "tweeks.__cluster_filter_branch": Function._Tweeks.__cluster_filter_branch.Properties;
    "tweeks.viewargs_sets": Function._Tweeks.viewargs_sets.Properties;
    "tweeks.funct_load_posto_simple": Function._Tweeks.funct_load_posto_simple.Properties;
    "tweeks.funct_load_caixa": Function._Tweeks.funct_load_caixa.Properties;
    "tweeks.funct_reg_ean": Function._Tweeks.funct_reg_ean.Properties;
    "tweeks.__check_conta_data": Function._Tweeks.__check_conta_data.Properties;
    "tweeks.funct_reg_posto": Function._Tweeks.funct_reg_posto.Properties;
    "tweeks.funct_generate_chave": Function._Tweeks.funct_generate_chave.Properties;
    "tweeks.funct_pos_reg_caixa": Function._Tweeks.funct_pos_reg_caixa.Properties;
    "tweeks.main": Function._Tweeks.main.Properties;
    "tweeks.funct_pos_load_caixa_auth": Function._Tweeks.funct_pos_load_caixa_auth.Properties;
    "tweeks.__branch_uid": Function._Tweeks.__branch_uid.Properties;
    "tweeks.funct_report_estatistica_posto": Function._Tweeks.funct_report_estatistica_posto.Properties;
    "tweeks.funct_reg_taxa": Function._Tweeks.funct_reg_taxa.Properties;
    "tweeks.__get_branch": Function._Tweeks.__get_branch.Properties;
    "tweeks.funct_pos_load_conta_dia": Function._Tweeks.funct_pos_load_conta_dia.Properties;
    "tweeks.funct_load_colaborador": Function._Tweeks.funct_load_colaborador.Properties;
    "tweeks.__conta_adjust": Function._Tweeks.__conta_adjust.Properties;
    "tweeks.funct_reg_espaco": Function._Tweeks.funct_reg_espaco.Properties;
    "tweeks.funct_load_mesa": Function._Tweeks.funct_load_mesa.Properties;
    "tweeks.__generate_guia_code": Function._Tweeks.__generate_guia_code.Properties;
    "tweeks.___override_auth_funct_load_menu": Function._Tweeks.___override_auth_funct_load_menu.Properties;
    "tweeks.__generate_retalho_code": Function._Tweeks.__generate_retalho_code.Properties;
    "tweeks.__sets_generate_documento": Function._Tweeks.__sets_generate_documento.Properties;
    "tweeks._get_branch_by_espaco": Function._Tweeks._get_branch_by_espaco.Properties;
    "tweeks.funct_report_venda_conta": Function._Tweeks.funct_report_venda_conta.Properties;
    "tweeks.viewargs_show": Function._Tweeks.viewargs_show.Properties;
    "tweeks.funct_pos_reg_retalho": Function._Tweeks.funct_pos_reg_retalho.Properties;
    "tweeks.funct_reg_imposto": Function._Tweeks.funct_reg_imposto.Properties;
    "tweeks.__tg_fluxo_on_entrada": Function._Tweeks.__tg_fluxo_on_entrada.Properties;
    "tweeks.__tg_fluxo_on_acerto": Function._Tweeks.__tg_fluxo_on_acerto.Properties;
    "tweeks.funct_reg_transacao_movimentacao_posto": Function._Tweeks.funct_reg_transacao_movimentacao_posto.Properties;
    "tweeks.funct_sets_autorizacao": Function._Tweeks.funct_sets_autorizacao.Properties;
    "tweeks.funct_reg_cambio": Function._Tweeks.funct_reg_cambio.Properties;
    "tweeks._get_posto": Function._Tweeks._get_posto.Properties;
    "tweeks.funct_load_acerto": Function._Tweeks.funct_load_acerto.Properties;
    "tweeks.__tg_venda_before_sets": Function._Tweeks.__tg_venda_before_sets.Properties;
    "tweeks.__tg_create_lancamento": Function._Tweeks.__tg_create_lancamento.Properties;
    "tweeks.funct_load_report_parametrized_filter": Function._Tweeks.funct_load_report_parametrized_filter.Properties;
    "tweeks.funct_load_cliente": Function._Tweeks.funct_load_cliente.Properties;
    "tweeks.funct_load_cambio_ativo": Function._Tweeks.funct_load_cambio_ativo.Properties;
    "tweeks.__lote": Function._Tweeks.__lote.Properties;
    "tweeks.funct_pos_change_conta_proforma": Function._Tweeks.funct_pos_change_conta_proforma.Properties;
    "tweeks.funct_change_espaco_migrate": Function._Tweeks.funct_change_espaco_migrate.Properties;
    "tweeks.funct_load_conta_notacredito": Function._Tweeks.funct_load_conta_notacredito.Properties;
    "tweeks.funct_load_stoks": Function._Tweeks.funct_load_stoks.Properties;
    "tweeks.funct_load_branch": Function._Tweeks.funct_load_branch.Properties;
    "tweeks.funct_load_serie_distribuicao_pos": Function._Tweeks.funct_load_serie_distribuicao_pos.Properties;
    "tweeks.funct_pos_change_caixa_close": Function._Tweeks.funct_pos_change_caixa_close.Properties;
    "tweeks.sets_tipoimposto": Function._Tweeks.sets_tipoimposto.Properties;
    "tweeks.__sync_branch_map": Function._Tweeks.__sync_branch_map.Properties;
    "tweeks.__generate_artigo_code": Function._Tweeks.__generate_artigo_code.Properties;
    "tweeks.funct_report_estatistica_venda": Function._Tweeks.funct_report_estatistica_venda.Properties;
    "tweeks.funct_reg_link_tecla": Function._Tweeks.funct_reg_link_tecla.Properties;
    "tweeks.funct_reg_acerto": Function._Tweeks.funct_reg_acerto.Properties;
    "tweeks.funct_load_posto_by_endereco": Function._Tweeks.funct_load_posto_by_endereco.Properties;
    "tweeks.funct_load_conta_preparacao": Function._Tweeks.funct_load_conta_preparacao.Properties;
    "tweeks.funct_pos_load_artigo": Function._Tweeks.funct_pos_load_artigo.Properties;
    "tweeks.funct_pos_load_class": Function._Tweeks.funct_pos_load_class.Properties;
    "tweeks.funct_change_tipoimposto_estado": Function._Tweeks.funct_change_tipoimposto_estado.Properties;
    "tweeks.funct_load_artigo_associar": Function._Tweeks.funct_load_artigo_associar.Properties;
    "tweeks.__fluxo_scan": Function._Tweeks.__fluxo_scan.Properties;
    "tweeks.funct_load_conta_documento_limit": Function._Tweeks.funct_load_conta_documento_limit.Properties;
    "tweeks.funct_report_venda": Function._Tweeks.funct_report_venda.Properties;
  }

  export namespace Function {
    export namespace _Cluster {
      export namespace __user_map {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__user_map.Args;
          options: fns.Function._Cluster.__user_map.Options;
          returns: fns.Function._Cluster.__user_map.Returns;
          returnsType: fns.Function._Cluster.__user_map.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.users:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_share_guard_upgrade {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_share_guard_upgrade.Args;
          options: fns.Function._Cluster.__tg_share_guard_upgrade.Options;
          returns: fns.Function._Cluster.__tg_share_guard_upgrade.Returns;
          returnsType: fns.Function._Cluster.__tg_share_guard_upgrade.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"event_trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __pull {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.__pull.Args;
          options: fns.Function._Cluster.__pull.Options;
          returns: fns.Function._Cluster.__pull.Returns;
          returnsType: fns.Function._Cluster.__pull.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.object:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace object_filter {
        export namespace docs {}

        export interface Options {
          _collector: tns.TypeOf<"cluster.collector:Props">;
          _object: tns.TypeOf<"cluster.object:Props">;
          _origin: tns.TypeOf<"cluster.cluster:Props">;
          share: tns.TypeOf<"varchar">;
          _req: tns.TypeOf<"cluster.cluster:Props">;
        }

        export interface Properties {
          args: fns.Function._Cluster.object_filter.Args;
          options: fns.Function._Cluster.object_filter.Options;
          returns: fns.Function._Cluster.object_filter.Returns;
          returnsType: fns.Function._Cluster.object_filter.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace create_resource {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.create_resource.Args;
          options: fns.Function._Cluster.create_resource.Options;
          returns: fns.Function._Cluster.create_resource.Returns;
          returnsType: fns.Function._Cluster.create_resource.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.resource:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_share_truncate {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_share_truncate.Args;
          options: fns.Function._Cluster.__tg_share_truncate.Options;
          returns: fns.Function._Cluster.__tg_share_truncate.Returns;
          returnsType: fns.Function._Cluster.__tg_share_truncate.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace reduce {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.reduce.Args;
          options: fns.Function._Cluster.reduce.Options;
          returns: fns.Function._Cluster.reduce.Returns;
          returnsType: fns.Function._Cluster.reduce.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"jsonb">[]];
      }

      export namespace _Sets_Resources_Downloaded_16619 {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"json">;
        }

        export interface Properties {
          args: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Args;
          options: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Options;
          returns: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Returns;
          returnsType: fns.Function._Cluster._Sets_Resources_Downloaded_16619.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_resources_pendents {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_resources_pendents.Args;
          options: fns.Function._Cluster.load_resources_pendents.Options;
          returns: fns.Function._Cluster.load_resources_pendents.Returns;
          returnsType: fns.Function._Cluster.load_resources_pendents.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_clusters_configs_to_child {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_clusters_configs_to_child.Args;
          options: fns.Function._Cluster.load_clusters_configs_to_child.Options;
          returns: fns.Function._Cluster.load_clusters_configs_to_child.Returns;
          returnsType: fns.Function._Cluster.load_clusters_configs_to_child.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace push {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.push.Args;
          options: fns.Function._Cluster.push.Options;
          returns: fns.Function._Cluster.push.Returns;
          returnsType: fns.Function._Cluster.push.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_version_commit {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_version_commit.Args;
          options: fns.Function._Cluster.__tg_version_commit.Options;
          returns: fns.Function._Cluster.__tg_version_commit.Returns;
          returnsType: fns.Function._Cluster.__tg_version_commit.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __format {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__format.Args;
          options: fns.Function._Cluster.__format.Options;
          returns: fns.Function._Cluster.__format.Returns;
          returnsType: fns.Function._Cluster.__format.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace __get {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__get.Args;
          options: fns.Function._Cluster.__get.Options;
          returns: fns.Function._Cluster.__get.Returns;
          returnsType: fns.Function._Cluster.__get.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [
          args2: tns.TypeOf<"jsonb">,
          args1: tns.TypeOf<"regclass">,
        ];
      }

      export namespace __tg_before_create_filter {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_before_create_filter.Args;
          options: fns.Function._Cluster.__tg_before_create_filter.Options;
          returns: fns.Function._Cluster.__tg_before_create_filter.Returns;
          returnsType: fns.Function._Cluster.__tg_before_create_filter.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __create_api {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__create_api.Args;
          options: fns.Function._Cluster.__create_api.Options;
          returns: fns.Function._Cluster.__create_api.Returns;
          returnsType: fns.Function._Cluster.__create_api.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __rows {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          reference?: tns.TypedOf<"jsonb", Typed>;
          document?: tns.TypedOf<"jsonb", Typed>;
          classname?: tns.TypedOf<"regclass", Typed>;
        }

        export interface Properties {
          args: fns.Function._Cluster.__rows.Args;
          options: fns.Function._Cluster.__rows.Options;
          returns: fns.Function._Cluster.__rows.Returns;
          returnsType: fns.Function._Cluster.__rows.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">[]];
      }

      export namespace __tg_version_add_when_update {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_version_add_when_update.Args;
          options: fns.Function._Cluster.__tg_version_add_when_update.Options;
          returns: fns.Function._Cluster.__tg_version_add_when_update.Returns;
          returnsType: fns.Function._Cluster.__tg_version_add_when_update.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_clusters {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_clusters.Args;
          options: fns.Function._Cluster.load_clusters.Options;
          returns: fns.Function._Cluster.load_clusters.Returns;
          returnsType: fns.Function._Cluster.load_clusters.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_configs {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.funct_load_configs.Args;
          options: fns.Function._Cluster.funct_load_configs.Options;
          returns: fns.Function._Cluster.funct_load_configs.Returns;
          returnsType: fns.Function._Cluster.funct_load_configs.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __add {
        export namespace docs {}

        export interface Options {
          _regclass: tns.TypeOf<"regclass">;
        }

        export interface Properties {
          args: fns.Function._Cluster.__add.Args;
          options: fns.Function._Cluster.__add.Options;
          returns: fns.Function._Cluster.__add.Returns;
          returnsType: fns.Function._Cluster.__add.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.collector:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace pull {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.pull.Args;
          options: fns.Function._Cluster.pull.Options;
          returns: fns.Function._Cluster.pull.Returns;
          returnsType: fns.Function._Cluster.pull.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __format_proc {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__format_proc.Args;
          options: fns.Function._Cluster.__format_proc.Options;
          returns: fns.Function._Cluster.__format_proc.Returns;
          returnsType: fns.Function._Cluster.__format_proc.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regproc">];
      }

      export namespace __create_object_version {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__create_object_version.Args;
          options: fns.Function._Cluster.__create_object_version.Options;
          returns: fns.Function._Cluster.__create_object_version.Returns;
          returnsType: fns.Function._Cluster.__create_object_version.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.version:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace status {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.status.Args;
          options: fns.Function._Cluster.status.Options;
          returns: fns.Function._Cluster.status.Returns;
          returnsType: fns.Function._Cluster.status.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_clusters_local_as_remotes {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_clusters_local_as_remotes.Args;
          options: fns.Function._Cluster.load_clusters_local_as_remotes.Options;
          returns: fns.Function._Cluster.load_clusters_local_as_remotes.Returns;
          returnsType: fns.Function._Cluster.load_clusters_local_as_remotes.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace declare_filter {
        export namespace docs {}

        export interface Options {
          share?: tns.TypeOf<"regclass">;
          name: tns.TypeOf<"varchar">;
          describe?: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Cluster.declare_filter.Args;
          options: fns.Function._Cluster.declare_filter.Options;
          returns: fns.Function._Cluster.declare_filter.Returns;
          returnsType: fns.Function._Cluster.declare_filter.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"void", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regnamespace">];
      }

      export namespace __tg_version_add_when_insert {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_version_add_when_insert.Args;
          options: fns.Function._Cluster.__tg_version_add_when_insert.Options;
          returns: fns.Function._Cluster.__tg_version_add_when_insert.Returns;
          returnsType: fns.Function._Cluster.__tg_version_add_when_insert.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_cluster_code {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__generate_cluster_code.Args;
          options: fns.Function._Cluster.__generate_cluster_code.Options;
          returns: fns.Function._Cluster.__generate_cluster_code.Returns;
          returnsType: fns.Function._Cluster.__generate_cluster_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace unlink_cluster {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          result?: tns.TypedOf<"bool", Typed>;
          data?: tns.TypedOf<"jsonb", Typed>;
          error?: tns.TypedOf<"jsonb", Typed>;
          message?: tns.TypedOf<"text", Typed>;
        }

        export interface Properties {
          args: fns.Function._Cluster.unlink_cluster.Args;
          options: fns.Function._Cluster.unlink_cluster.Options;
          returns: fns.Function._Cluster.unlink_cluster.Returns;
          returnsType: fns.Function._Cluster.unlink_cluster.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __collect_change {
        export namespace docs {}

        export interface Options {
          _old?: tns.TypeOf<"jsonb">;
          _change: tns.TypeOf<"jsonb">;
          _force?: tns.TypeOf<"bool">;
          _ref?: tns.TypeOf<"jsonb">;
          _operation?: tns.TypeOf<"bpchar">;
        }

        export interface Properties {
          args: fns.Function._Cluster.__collect_change.Args;
          options: fns.Function._Cluster.__collect_change.Options;
          returns: fns.Function._Cluster.__collect_change.Returns;
          returnsType: fns.Function._Cluster.__collect_change.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.collector:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace _get_cluster {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster._get_cluster.Args;
          options: fns.Function._Cluster._get_cluster.Options;
          returns: fns.Function._Cluster._get_cluster.Returns;
          returnsType: fns.Function._Cluster._get_cluster.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.cluster:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"varchar">];
      }

      export namespace next {
        export namespace docs {}

        export interface Options {
          lpad?: tns.TypeOf<"int4">;
          lpad_char?: tns.TypeOf<"bpchar">;
          steep?: tns.TypeOf<"int4">;
          exist?: tns.TypeOf<"text">;
          zero_base?: tns.TypeOf<"bool">;
          exist_limit?: tns.TypeOf<"int4">;
          name: tns.TypeOf<"varchar">;
          sub?: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Cluster.next.Args;
          options: fns.Function._Cluster.next.Options;
          returns: fns.Function._Cluster.next.Returns;
          returnsType: fns.Function._Cluster.next.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_version_local {
        export namespace docs {}

        export interface Options {
          increment?: tns.TypeOf<"bool">;
        }

        export interface Properties {
          args: fns.Function._Cluster._get_version_local.Args;
          options: fns.Function._Cluster._get_version_local.Options;
          returns: fns.Function._Cluster._get_version_local.Returns;
          returnsType: fns.Function._Cluster._get_version_local.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.version:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace _get_cluster_child {
        export namespace docs {}

        export interface Options {
          identifier: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Cluster._get_cluster_child.Args;
          options: fns.Function._Cluster._get_cluster_child.Options;
          returns: fns.Function._Cluster._get_cluster_child.Returns;
          returnsType: fns.Function._Cluster._get_cluster_child.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.cluster:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace accept_remote_cluster {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.accept_remote_cluster.Args;
          options: fns.Function._Cluster.accept_remote_cluster.Options;
          returns: fns.Function._Cluster.accept_remote_cluster.Returns;
          returnsType: fns.Function._Cluster.accept_remote_cluster.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __is_replication {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__is_replication.Args;
          options: fns.Function._Cluster.__is_replication.Options;
          returns: fns.Function._Cluster.__is_replication.Returns;
          returnsType: fns.Function._Cluster.__is_replication.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_cluster_tree_position {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_cluster_tree_position.Args;
          options: fns.Function._Cluster.sets_cluster_tree_position.Options;
          returns: fns.Function._Cluster.sets_cluster_tree_position.Returns;
          returnsType: fns.Function._Cluster.sets_cluster_tree_position.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.cluster:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace define_namespace {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.define_namespace.Args;
          options: fns.Function._Cluster.define_namespace.Options;
          returns: fns.Function._Cluster.define_namespace.Returns;
          returnsType: fns.Function._Cluster.define_namespace.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _Sets_Resources_Downloaded_16620 {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Args;
          options: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Options;
          returns: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Returns;
          returnsType: fns.Function._Cluster._Sets_Resources_Downloaded_16620.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace accept_revision {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.accept_revision.Args;
          options: fns.Function._Cluster.accept_revision.Options;
          returns: fns.Function._Cluster.accept_revision.Returns;
          returnsType: fns.Function._Cluster.accept_revision.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_share_check {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_share_check.Args;
          options: fns.Function._Cluster.__tg_share_check.Options;
          returns: fns.Function._Cluster.__tg_share_check.Returns;
          returnsType: fns.Function._Cluster.__tg_share_check.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __create_identifier {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__create_identifier.Args;
          options: fns.Function._Cluster.__create_identifier.Options;
          returns: fns.Function._Cluster.__create_identifier.Returns;
          returnsType: fns.Function._Cluster.__create_identifier.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_acesso {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.funct_reg_acesso.Args;
          options: fns.Function._Cluster.funct_reg_acesso.Options;
          returns: fns.Function._Cluster.funct_reg_acesso.Returns;
          returnsType: fns.Function._Cluster.funct_reg_acesso.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __transaction_uid {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__transaction_uid.Args;
          options: fns.Function._Cluster.__transaction_uid.Options;
          returns: fns.Function._Cluster.__transaction_uid.Returns;
          returnsType: fns.Function._Cluster.__transaction_uid.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"uuid", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace switch_remote_connection {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.switch_remote_connection.Args;
          options: fns.Function._Cluster.switch_remote_connection.Options;
          returns: fns.Function._Cluster.switch_remote_connection.Returns;
          returnsType: fns.Function._Cluster.switch_remote_connection.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _cluster_accept_child {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster._cluster_accept_child.Args;
          options: fns.Function._Cluster._cluster_accept_child.Options;
          returns: fns.Function._Cluster._cluster_accept_child.Returns;
          returnsType: fns.Function._Cluster._cluster_accept_child.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_cluster_local {
        export namespace docs {}

        export interface Options {
          try?: tns.TypeOf<"int4">;
          increment?: tns.TypeOf<"bool">;
        }

        export interface Properties {
          args: fns.Function._Cluster._get_cluster_local.Args;
          options: fns.Function._Cluster._get_cluster_local.Options;
          returns: fns.Function._Cluster._get_cluster_local.Returns;
          returnsType: fns.Function._Cluster._get_cluster_local.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.cluster:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_cluster_by_namespace {
        export namespace docs {}

        export interface Options {
          namespace: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_cluster_by_namespace.Args;
          options: fns.Function._Cluster.load_cluster_by_namespace.Options;
          returns: fns.Function._Cluster.load_cluster_by_namespace.Returns;
          returnsType: fns.Function._Cluster.load_cluster_by_namespace.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_clusters_admin {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_clusters_admin.Args;
          options: fns.Function._Cluster.sets_clusters_admin.Options;
          returns: fns.Function._Cluster.sets_clusters_admin.Returns;
          returnsType: fns.Function._Cluster.sets_clusters_admin.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace can_send_revision {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.can_send_revision.Args;
          options: fns.Function._Cluster.can_send_revision.Options;
          returns: fns.Function._Cluster.can_send_revision.Returns;
          returnsType: fns.Function._Cluster.can_send_revision.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace can_send_object {
        export namespace docs {}

        export interface Options {
          _request: tns.TypeOf<"cluster.cluster:Props">;
          _master: tns.TypeOf<"cluster.cluster:Props">;
          _collector: tns.TypeOf<"cluster.collector:Props">;
          _const?: tns.TypeOf<"map.constant">;
          _local: tns.TypeOf<"cluster.cluster:Props">;
          _object: tns.TypeOf<"cluster.object:Props">;
          _origin: tns.TypeOf<"cluster.cluster:Props">;
          _child: tns.TypeOf<"cluster.cluster:Props">;
        }

        export interface Properties {
          args: fns.Function._Cluster.can_send_object.Args;
          options: fns.Function._Cluster.can_send_object.Options;
          returns: fns.Function._Cluster.can_send_object.Returns;
          returnsType: fns.Function._Cluster.can_send_object.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __user_default {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__user_default.Args;
          options: fns.Function._Cluster.__user_default.Options;
          returns: fns.Function._Cluster.__user_default.Returns;
          returnsType: fns.Function._Cluster.__user_default.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"regrole", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __is_sub_path {
        export namespace docs {}

        export interface Options {
          child_path: tns.TypeOf<"text">;
          base: tns.TypeOf<"text">;
        }

        export interface Properties {
          args: fns.Function._Cluster.__is_sub_path.Args;
          options: fns.Function._Cluster.__is_sub_path.Options;
          returns: fns.Function._Cluster.__is_sub_path.Returns;
          returnsType: fns.Function._Cluster.__is_sub_path.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace add {
        export namespace docs {}

        export interface Options {
          args?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.add.Args;
          options: fns.Function._Cluster.add.Options;
          returns: fns.Function._Cluster.add.Returns;
          returnsType: fns.Function._Cluster.add.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.collector:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace licence_status {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.licence_status.Args;
          options: fns.Function._Cluster.licence_status.Options;
          returns: fns.Function._Cluster.licence_status.Returns;
          returnsType: fns.Function._Cluster.licence_status.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __user_replication {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__user_replication.Args;
          options: fns.Function._Cluster.__user_replication.Options;
          returns: fns.Function._Cluster.__user_replication.Returns;
          returnsType: fns.Function._Cluster.__user_replication.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"regrole", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_paths {
        export namespace docs {}

        export interface Options {
          args?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.load_paths.Args;
          options: fns.Function._Cluster.load_paths.Options;
          returns: fns.Function._Cluster.load_paths.Returns;
          returnsType: fns.Function._Cluster.load_paths.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __pks {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__pks.Args;
          options: fns.Function._Cluster.__pks.Options;
          returns: fns.Function._Cluster.__pks.Returns;
          returnsType: fns.Function._Cluster.__pks.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"name", Typed>[];
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace sets_cluster_machine_id {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          result?: tns.TypedOf<"bool", Typed>;
          message?: tns.TypedOf<"text", Typed>;
          data?: tns.TypedOf<"jsonb", Typed>;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_cluster_machine_id.Args;
          options: fns.Function._Cluster.sets_cluster_machine_id.Options;
          returns: fns.Function._Cluster.sets_cluster_machine_id.Returns;
          returnsType: fns.Function._Cluster.sets_cluster_machine_id.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace change {
        export namespace docs {}

        export interface Options {
          keys: tns.TypeOf<"text">[];
        }

        export interface Properties {
          args: fns.Function._Cluster.change.Args;
          options: fns.Function._Cluster.change.Options;
          returns: fns.Function._Cluster.change.Returns;
          returnsType: fns.Function._Cluster.change.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"jsonb">];
      }

      export namespace _get_cluster_master {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster._get_cluster_master.Args;
          options: fns.Function._Cluster._get_cluster_master.Options;
          returns: fns.Function._Cluster._get_cluster_master.Returns;
          returnsType: fns.Function._Cluster._get_cluster_master.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.cluster:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_share_map {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Cluster.__tg_share_map.Args;
          options: fns.Function._Cluster.__tg_share_map.Options;
          returns: fns.Function._Cluster.__tg_share_map.Returns;
          returnsType: fns.Function._Cluster.__tg_share_map.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_cluster_remote {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_cluster_remote.Args;
          options: fns.Function._Cluster.sets_cluster_remote.Options;
          returns: fns.Function._Cluster.sets_cluster_remote.Returns;
          returnsType: fns.Function._Cluster.sets_cluster_remote.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_cluster_configs {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_cluster_configs.Args;
          options: fns.Function._Cluster.sets_cluster_configs.Options;
          returns: fns.Function._Cluster.sets_cluster_configs.Returns;
          returnsType: fns.Function._Cluster.sets_cluster_configs.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace commit {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.commit.Args;
          options: fns.Function._Cluster.commit.Options;
          returns: fns.Function._Cluster.commit.Returns;
          returnsType: fns.Function._Cluster.commit.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.version:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_cluster_license {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Cluster.sets_cluster_license.Args;
          options: fns.Function._Cluster.sets_cluster_license.Options;
          returns: fns.Function._Cluster.sets_cluster_license.Returns;
          returnsType: fns.Function._Cluster.sets_cluster_license.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }
    }

    export namespace _Auth {
      export namespace funct_reg_privilegio {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_reg_privilegio.Args;
          options: fns.Function._Auth.funct_reg_privilegio.Options;
          returns: fns.Function._Auth.funct_reg_privilegio.Returns;
          returnsType: fns.Function._Auth.funct_reg_privilegio.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_perfil {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_perfil.Args;
          options: fns.Function._Auth.funct_change_perfil.Options;
          returns: fns.Function._Auth.funct_change_perfil.Returns;
          returnsType: fns.Function._Auth.funct_change_perfil.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _menu_load_structure {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          menu_estado?: tns.TypedOf<"int2", Typed>;
          menu_menu_id?: tns.TypedOf<"int2", Typed>;
          menu_children?: tns.TypedOf<"int2", Typed>;
          menu_id?: tns.TypedOf<"int2", Typed>;
          menu_menu_nivel?: tns.TypedOf<"int2", Typed>;
          menu_codigo?: tns.TypedOf<"varchar", Typed>;
          menu_directchildern?: tns.TypedOf<"int2", Typed>;
          menu_icon?: tns.TypedOf<"varchar", Typed>;
          menu_menu_raiz?: tns.TypedOf<"varchar", Typed>;
          menu_maxnode?: tns.TypedOf<"int2", Typed>;
          menu_link?: tns.TypedOf<"varchar", Typed>;
          menu_menu_codigo?: tns.TypedOf<"varchar", Typed>;
          menu_nome?: tns.TypedOf<"varchar", Typed>;
          menu_nivel?: tns.TypedOf<"int2", Typed>;
          menu_menu_nome?: tns.TypedOf<"varchar", Typed>;
          menu_raiz?: tns.TypedOf<"varchar", Typed>;
          menu_menu_link?: tns.TypedOf<"varchar", Typed>;
          menu_position?: tns.TypedOf<"int2", Typed>;
          menu_menu_icon?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth._menu_load_structure.Args;
          options: fns.Function._Auth._menu_load_structure.Options;
          returns: fns.Function._Auth._menu_load_structure.Returns;
          returnsType: fns.Function._Auth._menu_load_structure.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador_all_menu {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_foto?: tns.TypedOf<"varchar", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador_all_menu.Args;
          options: fns.Function._Auth.funct_load_colaborador_all_menu.Options;
          returns: fns.Function._Auth.funct_load_colaborador_all_menu.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador_all_menu.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_perfil {
        export namespace docs {}

        export interface Options {
          arg_perfil_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Auth._get_perfil.Args;
          options: fns.Function._Auth._get_perfil.Options;
          returns: fns.Function._Auth._get_perfil.Returns;
          returnsType: fns.Function._Auth._get_perfil.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"auth.perfil:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _colaborador_accesso_desc {
        export namespace docs {}

        export interface Options {
          arg_colaborador_acesso: tns.TypeOf<"int2">;
        }

        export interface Properties {
          args: fns.Function._Auth._colaborador_accesso_desc.Args;
          options: fns.Function._Auth._colaborador_accesso_desc.Options;
          returns: fns.Function._Auth._colaborador_accesso_desc.Returns;
          returnsType: fns.Function._Auth._colaborador_accesso_desc.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_menu {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          menu_position?: tns.TypedOf<"int2", Typed>;
          menu_menu_codigo?: tns.TypedOf<"varchar", Typed>;
          menu_menu_estado?: tns.TypedOf<"int2", Typed>;
          menu_maxnode?: tns.TypedOf<"int2", Typed>;
          menu_sincronizado?: tns.TypedOf<"bool", Typed>;
          menu_menu_link?: tns.TypedOf<"varchar", Typed>;
          menu_children?: tns.TypedOf<"int2", Typed>;
          menu_nivel?: tns.TypedOf<"int2", Typed>;
          menu_menu_raiz?: tns.TypedOf<"varchar", Typed>;
          menu_falta?: tns.TypedOf<"bool", Typed>;
          menu_menu_directchildern?: tns.TypedOf<"int2", Typed>;
          menu_nome?: tns.TypedOf<"varchar", Typed>;
          menu_directchildern?: tns.TypedOf<"int2", Typed>;
          menu_link?: tns.TypedOf<"varchar", Typed>;
          acesso_id?: tns.TypedOf<"uuid", Typed>;
          menu_raiz?: tns.TypedOf<"varchar", Typed>;
          perfil_id?: tns.TypedOf<"uuid", Typed>;
          menu_menu_position?: tns.TypedOf<"int2", Typed>;
          menu_menu_icon?: tns.TypedOf<"varchar", Typed>;
          menu_menu_children?: tns.TypedOf<"int2", Typed>;
          menu_menu_id?: tns.TypedOf<"int2", Typed>;
          menu_icon?: tns.TypedOf<"varchar", Typed>;
          menu_mais?: tns.TypedOf<"bool", Typed>;
          menu_menu_nome?: tns.TypedOf<"varchar", Typed>;
          menu_id?: tns.TypedOf<"int2", Typed>;
          menu_menu_maxnode?: tns.TypedOf<"int2", Typed>;
          menu_codigo?: tns.TypedOf<"varchar", Typed>;
          menu_menu_nivel?: tns.TypedOf<"int2", Typed>;
          menu_estado?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_menu.Args;
          options: fns.Function._Auth.funct_load_menu.Options;
          returns: fns.Function._Auth.funct_load_menu.Returns;
          returnsType: fns.Function._Auth.funct_load_menu.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador.Args;
          options: fns.Function._Auth.funct_change_colaborador.Options;
          returns: fns.Function._Auth.funct_change_colaborador.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_autenticacao_logoff {
        export namespace docs {}

        export interface Options {
          arg: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_autenticacao_logoff.Args;
          options: fns.Function._Auth.funct_autenticacao_logoff.Options;
          returns: fns.Function._Auth.funct_autenticacao_logoff.Returns;
          returnsType: fns.Function._Auth.funct_autenticacao_logoff.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_token_ativate {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_token_ativate.Args;
          options: fns.Function._Auth.funct_change_colaborador_token_ativate.Options;
          returns: fns.Function._Auth.funct_change_colaborador_token_ativate.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_token_ativate.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          colaborador_nif?: tns.TypedOf<"varchar", Typed>;
          colaborador_mail?: tns.TypedOf<"varchar", Typed>;
          sexo_id?: tns.TypedOf<"int2", Typed>;
          colaborador_acessodesc?: tns.TypedOf<"varchar", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_foto?: tns.TypedOf<"varchar", Typed>;
          sexo_codigo?: tns.TypedOf<"bpchar", Typed>;
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
          colaborador_estadodesc?: tns.TypedOf<"varchar", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_estado?: tns.TypedOf<"int2", Typed>;
          colaborador_datanascimento?: tns.TypedOf<"date", Typed>;
          sexo_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_acesso?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador.Args;
          options: fns.Function._Auth.funct_load_colaborador.Options;
          returns: fns.Function._Auth.funct_load_colaborador.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_colaborador {
        export namespace docs {}

        export interface Options {
          arg_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Auth._get_colaborador.Args;
          options: fns.Function._Auth._get_colaborador.Options;
          returns: fns.Function._Auth._get_colaborador.Returns;
          returnsType: fns.Function._Auth._get_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"auth.colaborador:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _autenticacao_chave_generate {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Auth._autenticacao_chave_generate.Args;
          options: fns.Function._Auth._autenticacao_chave_generate.Options;
          returns: fns.Function._Auth._autenticacao_chave_generate.Returns;
          returnsType: fns.Function._Auth._autenticacao_chave_generate.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _colaborador_estado_desc {
        export namespace docs {}

        export interface Options {
          arg_colaborador_estado: tns.TypeOf<"int2">;
        }

        export interface Properties {
          args: fns.Function._Auth._colaborador_estado_desc.Args;
          options: fns.Function._Auth._colaborador_estado_desc.Options;
          returns: fns.Function._Auth._colaborador_estado_desc.Returns;
          returnsType: fns.Function._Auth._colaborador_estado_desc.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_senha {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_senha.Args;
          options: fns.Function._Auth.funct_change_colaborador_senha.Options;
          returns: fns.Function._Auth.funct_change_colaborador_senha.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_senha.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _menu_create {
        export namespace docs {}

        export interface Options {
          arg_menu_icon?: tns.TypeOf<"varchar">;
          arg_menu_nome: tns.TypeOf<"varchar">;
          arg_menu_menu_codigo?: tns.TypeOf<"varchar">;
          arg_menu_link?: tns.TypeOf<"varchar">;
          arg_menu_codigo: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Auth._menu_create.Args;
          options: fns.Function._Auth._menu_create.Options;
          returns: fns.Function._Auth._menu_create.Returns;
          returnsType: fns.Function._Auth._menu_create.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_grants {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_grants.Args;
          options: fns.Function._Auth.funct_load_grants.Options;
          returns: fns.Function._Auth.funct_load_grants.Returns;
          returnsType: fns.Function._Auth.funct_load_grants.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_accesso_disable {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_accesso_disable.Args;
          options: fns.Function._Auth.funct_change_colaborador_accesso_disable.Options;
          returns: fns.Function._Auth.funct_change_colaborador_accesso_disable.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_accesso_disable.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_trabalha {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_reg_trabalha.Args;
          options: fns.Function._Auth.funct_reg_trabalha.Options;
          returns: fns.Function._Auth.funct_reg_trabalha.Returns;
          returnsType: fns.Function._Auth.funct_reg_trabalha.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _menu_create_set_up {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Auth._menu_create_set_up.Args;
          options: fns.Function._Auth._menu_create_set_up.Options;
          returns: fns.Function._Auth._menu_create_set_up.Returns;
          returnsType: fns.Function._Auth._menu_create_set_up.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"void", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador_simple {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
          colaborador_nomecompleto?: tns.TypedOf<"varchar", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador_simple.Args;
          options: fns.Function._Auth.funct_load_colaborador_simple.Options;
          returns: fns.Function._Auth.funct_load_colaborador_simple.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador_simple.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador_any_menu {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_foto?: tns.TypedOf<"varchar", Typed>;
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador_any_menu.Args;
          options: fns.Function._Auth.funct_load_colaborador_any_menu.Options;
          returns: fns.Function._Auth.funct_load_colaborador_any_menu.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador_any_menu.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_menu_cascade {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          menu_directchildern?: tns.TypedOf<"int2", Typed>;
          menu_maxnode?: tns.TypedOf<"int2", Typed>;
          menu_falta?: tns.TypedOf<"bool", Typed>;
          menu_link?: tns.TypedOf<"varchar", Typed>;
          menu_position?: tns.TypedOf<"int2", Typed>;
          menu_icon?: tns.TypedOf<"varchar", Typed>;
          menu_codigo?: tns.TypedOf<"varchar", Typed>;
          menu_children?: tns.TypedOf<"int2", Typed>;
          menu_nivel?: tns.TypedOf<"int2", Typed>;
          menu_mais?: tns.TypedOf<"bool", Typed>;
          menu_menu_id?: tns.TypedOf<"int2", Typed>;
          acesso_id?: tns.TypedOf<"uuid", Typed>;
          perfil_id?: tns.TypedOf<"uuid", Typed>;
          menu_nome?: tns.TypedOf<"varchar", Typed>;
          menu_childrenlist?: tns.TypedOf<"jsonb", Typed>;
          menu_sincronizado?: tns.TypedOf<"bool", Typed>;
          menu_id?: tns.TypedOf<"int2", Typed>;
          menu_raiz?: tns.TypedOf<"varchar", Typed>;
          menu_estado?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_menu_cascade.Args;
          options: fns.Function._Auth.funct_load_menu_cascade.Options;
          returns: fns.Function._Auth.funct_load_menu_cascade.Returns;
          returnsType: fns.Function._Auth.funct_load_menu_cascade.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _colaborador_token_encrypt {
        export namespace docs {}

        export interface Options {
          _colaborador: tns.TypeOf<"auth.colaborador:Props">;
        }

        export interface Properties {
          args: fns.Function._Auth._colaborador_token_encrypt.Args;
          options: fns.Function._Auth._colaborador_token_encrypt.Options;
          returns: fns.Function._Auth._colaborador_token_encrypt.Returns;
          returnsType: fns.Function._Auth._colaborador_token_encrypt.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador_token_restore {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador_token_restore.Args;
          options: fns.Function._Auth.funct_load_colaborador_token_restore.Options;
          returns: fns.Function._Auth.funct_load_colaborador_token_restore.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador_token_restore.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_autenticacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          acesso?: tns.TypedOf<"jsonb", Typed>;
          tsexo_codigo?: tns.TypedOf<"bpchar", Typed>;
          colaborador_dataultimaatualizacasenha?: tns.TypedOf<
            "timestamptz",
            Typed
          >;
          tsexo_id?: tns.TypedOf<"int2", Typed>;
          autenticacao_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
          autenticacao_chave?: tns.TypedOf<"varchar", Typed>;
          colaborador_estado?: tns.TypedOf<"int2", Typed>;
          colaborador_estadodesc?: tns.TypedOf<"varchar", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_accesso?: tns.TypedOf<"int2", Typed>;
          tsexo_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_email?: tns.TypedOf<"varchar", Typed>;
          colaborador_accessodesc?: tns.TypedOf<"varchar", Typed>;
          autenticacao_dataregistro?: tns.TypedOf<"varchar", Typed>;
          colaborador_foto?: tns.TypedOf<"varchar", Typed>;
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_autenticacao.Args;
          options: fns.Function._Auth.funct_autenticacao.Options;
          returns: fns.Function._Auth.funct_autenticacao.Returns;
          returnsType: fns.Function._Auth.funct_autenticacao.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _colaborador_generate_senha_token {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Auth._colaborador_generate_senha_token.Args;
          options: fns.Function._Auth._colaborador_generate_senha_token.Options;
          returns: fns.Function._Auth._colaborador_generate_senha_token.Returns;
          returnsType: fns.Function._Auth._colaborador_generate_senha_token.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_perfil {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_reg_perfil.Args;
          options: fns.Function._Auth.funct_reg_perfil.Options;
          returns: fns.Function._Auth.funct_reg_perfil.Returns;
          returnsType: fns.Function._Auth.funct_reg_perfil.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_token_acesso {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_token_acesso.Args;
          options: fns.Function._Auth.funct_change_colaborador_token_acesso.Options;
          returns: fns.Function._Auth.funct_change_colaborador_token_acesso.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_token_acesso.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_pin {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_pin.Args;
          options: fns.Function._Auth.funct_change_colaborador_pin.Options;
          returns: fns.Function._Auth.funct_change_colaborador_pin.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_pin.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_accesso_reativar {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Args;
          options: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Options;
          returns: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_accesso_reativar.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador_estado_disable {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_change_colaborador_estado_disable.Args;
          options: fns.Function._Auth.funct_change_colaborador_estado_disable.Options;
          returns: fns.Function._Auth.funct_change_colaborador_estado_disable.Returns;
          returnsType: fns.Function._Auth.funct_change_colaborador_estado_disable.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _colaborador_generate_pin_token {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Auth._colaborador_generate_pin_token.Args;
          options: fns.Function._Auth._colaborador_generate_pin_token.Options;
          returns: fns.Function._Auth._colaborador_generate_pin_token.Returns;
          returnsType: fns.Function._Auth._colaborador_generate_pin_token.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _encrypt {
        export namespace docs {}

        export interface Options {
          word: tns.TypeOf<"text">;
        }

        export interface Properties {
          args: fns.Function._Auth._encrypt.Args;
          options: fns.Function._Auth._encrypt.Options;
          returns: fns.Function._Auth._encrypt.Returns;
          returnsType: fns.Function._Auth._encrypt.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_colaborador {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_reg_colaborador.Args;
          options: fns.Function._Auth.funct_reg_colaborador.Options;
          returns: fns.Function._Auth.funct_reg_colaborador.Returns;
          returnsType: fns.Function._Auth.funct_reg_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_acesso {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_reg_acesso.Args;
          options: fns.Function._Auth.funct_reg_acesso.Options;
          returns: fns.Function._Auth.funct_reg_acesso.Returns;
          returnsType: fns.Function._Auth.funct_reg_acesso.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador_by_token {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          colaborador_foto?: tns.TypedOf<"varchar", Typed>;
          tsexo_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_nif?: tns.TypedOf<"varchar", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
          colaborador_mail?: tns.TypedOf<"varchar", Typed>;
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
          tsexo_id?: tns.TypedOf<"int2", Typed>;
          tsexo_codigo?: tns.TypedOf<"bpchar", Typed>;
          colaborador_ficha?: tns.TypedOf<"jsonb", Typed>;
        }

        export interface Properties {
          args: fns.Function._Auth.funct_load_colaborador_by_token.Args;
          options: fns.Function._Auth.funct_load_colaborador_by_token.Options;
          returns: fns.Function._Auth.funct_load_colaborador_by_token.Returns;
          returnsType: fns.Function._Auth.funct_load_colaborador_by_token.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }
    }

    export namespace _Libdom {
      export namespace domsync {
        export namespace docs {}

        export interface Options {
          domain: tns.TypeOf<"varchar">;
          classname: tns.TypeOf<"varchar">;
          columnname: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Libdom.domsync.Args;
          options: fns.Function._Libdom.domsync.Options;
          returns: fns.Function._Libdom.domsync.Returns;
          returnsType: fns.Function._Libdom.domsync.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace entry_drop {
        export namespace docs {}

        export interface Options {
          arg_name: tns.TypeOf<"char">;
          arg_dropforce?: tns.TypeOf<"bool">;
        }

        export interface Properties {
          args: fns.Function._Libdom.entry_drop.Args;
          options: fns.Function._Libdom.entry_drop.Options;
          returns: fns.Function._Libdom.entry_drop.Returns;
          returnsType: fns.Function._Libdom.entry_drop.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sync_drop {
        export namespace docs {}

        export interface Options {
          classtype: tns.TypeOf<"regtype">;
          name: tns.TypeOf<"char">;
        }

        export interface Properties {
          args: fns.Function._Libdom.sync_drop.Args;
          options: fns.Function._Libdom.sync_drop.Options;
          returns: fns.Function._Libdom.sync_drop.Returns;
          returnsType: fns.Function._Libdom.sync_drop.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get {
        export namespace docs {}

        export interface Options {
          arg_name: tns.TypeOf<"char">;
        }

        export interface Properties {
          args: fns.Function._Libdom._get.Args;
          options: fns.Function._Libdom._get.Options;
          returns: fns.Function._Libdom._get.Returns;
          returnsType: fns.Function._Libdom._get.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _Domain_Of_16734 {
        export namespace docs {}

        export interface Options {
          name: tns.TypeOf<"char">;
        }

        export interface Properties {
          args: fns.Function._Libdom._Domain_Of_16734.Args;
          options: fns.Function._Libdom._Domain_Of_16734.Options;
          returns: fns.Function._Libdom._Domain_Of_16734.Returns;
          returnsType: fns.Function._Libdom._Domain_Of_16734.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace entry {
        export namespace docs {}

        export interface Options {
          val: tns.TypeOf<"anyelement">;
          comment?: tns.TypeOf<"varchar">;
          force?: tns.TypeOf<"bool">;
          label?: tns.TypeOf<"varchar">;
          domain?: tns.TypeOf<"varchar">;
          name: tns.TypeOf<"char">;
          editable?: tns.TypeOf<"bool">;
          type: tns.TypeOf<"regtype">;
        }

        export interface Properties {
          args: fns.Function._Libdom.entry.Args;
          options: fns.Function._Libdom.entry.Options;
          returns: fns.Function._Libdom.entry.Returns;
          returnsType: fns.Function._Libdom.entry.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace trigger_sync_domsync {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Libdom.trigger_sync_domsync.Args;
          options: fns.Function._Libdom.trigger_sync_domsync.Options;
          returns: fns.Function._Libdom.trigger_sync_domsync.Returns;
          returnsType: fns.Function._Libdom.trigger_sync_domsync.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace rebuild {
        export namespace docs {}

        export interface Options {
          clean: tns.TypeOf<"bool">;
        }

        export interface Properties {
          args: fns.Function._Libdom.rebuild.Args;
          options: fns.Function._Libdom.rebuild.Options;
          returns: fns.Function._Libdom.rebuild.Returns;
          returnsType: fns.Function._Libdom.rebuild.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace api_change_entryset {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Libdom.api_change_entryset.Args;
          options: fns.Function._Libdom.api_change_entryset.Options;
          returns: fns.Function._Libdom.api_change_entryset.Returns;
          returnsType: fns.Function._Libdom.api_change_entryset.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace columns {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          isarray?: tns.TypedOf<"bool", Typed>;
          isgenerated?: tns.TypedOf<"bool", Typed>;
          type?: tns.TypedOf<"varchar", Typed>;
          name?: tns.TypedOf<"varchar", Typed>;
          defaults?: tns.TypedOf<"text", Typed>;
        }

        export interface Properties {
          args: fns.Function._Libdom.columns.Args;
          options: fns.Function._Libdom.columns.Options;
          returns: fns.Function._Libdom.columns.Returns;
          returnsType: fns.Function._Libdom.columns.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"regclass">];
      }

      export namespace api_load_entryset {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Libdom.api_load_entryset.Args;
          options: fns.Function._Libdom.api_load_entryset.Options;
          returns: fns.Function._Libdom.api_load_entryset.Returns;
          returnsType: fns.Function._Libdom.api_load_entryset.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace constant {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface Properties {
          args: fns.Function._Libdom.constant.Args;
          options: fns.Function._Libdom.constant.Options;
          returns: fns.Function._Libdom.constant.Returns;
          returnsType: fns.Function._Libdom.constant.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"libdom.constant", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _Domain_Of_16735 {
        export namespace docs {}

        export interface Options {
          value: tns.TypeOf<"text">;
          domain: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Libdom._Domain_Of_16735.Args;
          options: fns.Function._Libdom._Domain_Of_16735.Options;
          returns: fns.Function._Libdom._Domain_Of_16735.Returns;
          returnsType: fns.Function._Libdom._Domain_Of_16735.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace trigger_sync_entry {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Libdom.trigger_sync_entry.Args;
          options: fns.Function._Libdom.trigger_sync_entry.Options;
          returns: fns.Function._Libdom.trigger_sync_entry.Returns;
          returnsType: fns.Function._Libdom.trigger_sync_entry.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace domain {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface Properties {
          args: fns.Function._Libdom.domain.Args;
          options: fns.Function._Libdom.domain.Options;
          returns: fns.Function._Libdom.domain.Returns;
          returnsType: fns.Function._Libdom.domain.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"libdom.domain", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace domain_document {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface Properties {
          args: fns.Function._Libdom.domain_document.Args;
          options: fns.Function._Libdom.domain_document.Options;
          returns: fns.Function._Libdom.domain_document.Returns;
          returnsType: fns.Function._Libdom.domain_document.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace describe {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface ReturnsType {
          editable?: tns.TypedOf<"bool", Typed>;
          default?: tns.TypedOf<"varchar", Typed>;
          type?: tns.TypedOf<"regtype", Typed>;
          domain?: tns.TypedOf<"varchar", Typed>;
          label?: tns.TypedOf<"varchar", Typed>;
          comment?: tns.TypedOf<"varchar", Typed>;
          declaration?: tns.TypedOf<"text", Typed>;
          value?: tns.TypedOf<"text", Typed>;
          name?: tns.TypedOf<"char", Typed>;
        }

        export interface Properties {
          args: fns.Function._Libdom.describe.Args;
          options: fns.Function._Libdom.describe.Options;
          returns: fns.Function._Libdom.describe.Returns;
          returnsType: fns.Function._Libdom.describe.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace exports {
        export namespace docs {}

        export interface Options {
          name?: tns.TypeOf<"varchar">[];
          schema_name?: tns.TypeOf<"varchar">;
        }

        export interface ReturnsType {
          type?: tns.TypedOf<"regtype", Typed>;
          name?: tns.TypedOf<"varchar", Typed>;
          value?: tns.TypedOf<"text", Typed>;
          declaration?: tns.TypedOf<"text", Typed>;
        }

        export interface Properties {
          args: fns.Function._Libdom.exports.Args;
          options: fns.Function._Libdom.exports.Options;
          returns: fns.Function._Libdom.exports.Returns;
          returnsType: fns.Function._Libdom.exports.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace entry_list {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Libdom.entry_list.Args;
          options: fns.Function._Libdom.entry_list.Options;
          returns: fns.Function._Libdom.entry_list.Returns;
          returnsType: fns.Function._Libdom.entry_list.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace sync_entry {
        export namespace docs {}

        export interface Options {
          classtype: tns.TypeOf<"regtype">;
          name: tns.TypeOf<"char">;
        }

        export interface Properties {
          args: fns.Function._Libdom.sync_entry.Args;
          options: fns.Function._Libdom.sync_entry.Options;
          returns: fns.Function._Libdom.sync_entry.Returns;
          returnsType: fns.Function._Libdom.sync_entry.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _set {
        export namespace docs {}

        export interface Options {
          force?: tns.TypeOf<"bool">;
          domain?: tns.TypeOf<"varchar">;
          label?: tns.TypeOf<"varchar">;
          value?: tns.TypeOf<"varchar">;
          name: tns.TypeOf<"char">;
        }

        export interface Properties {
          args: fns.Function._Libdom._set.Args;
          options: fns.Function._Libdom._set.Options;
          returns: fns.Function._Libdom._set.Returns;
          returnsType: fns.Function._Libdom._set.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace domset {
        export namespace docs {}

        export interface Options {
          _domain: tns.TypeOf<"varchar">;
          _column: tns.TypeOf<"varchar">;
          _class: tns.TypeOf<"varchar">;
          _comment?: tns.TypeOf<"varchar">;
        }

        export interface Properties {
          args: fns.Function._Libdom.domset.Args;
          options: fns.Function._Libdom.domset.Options;
          returns: fns.Function._Libdom.domset.Returns;
          returnsType: fns.Function._Libdom.domset.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace prefix {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface Properties {
          args: fns.Function._Libdom.prefix.Args;
          options: fns.Function._Libdom.prefix.Options;
          returns: fns.Function._Libdom.prefix.Returns;
          returnsType: fns.Function._Libdom.prefix.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"libdom.entryset:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace constant_document {
        export namespace docs {}

        export interface Options {
          prefix?: tns.TypeOf<"varchar">[];
        }

        export interface Properties {
          args: fns.Function._Libdom.constant_document.Args;
          options: fns.Function._Libdom.constant_document.Options;
          returns: fns.Function._Libdom.constant_document.Returns;
          returnsType: fns.Function._Libdom.constant_document.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }
    }

    export namespace _Tweeks {
      export namespace funct_pos_load_posto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_posto.Args;
          options: fns.Function._Tweeks.funct_pos_load_posto.Options;
          returns: fns.Function._Tweeks.funct_pos_load_posto.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_artigo_extras {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_artigo_extras.Args;
          options: fns.Function._Tweeks.funct_pos_load_artigo_extras.Options;
          returns: fns.Function._Tweeks.funct_pos_load_artigo_extras.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_artigo_extras.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos__sync_conta_amount {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos__sync_conta_amount.Args;
          options: fns.Function._Tweeks.funct_pos__sync_conta_amount.Options;
          returns: fns.Function._Tweeks.funct_pos__sync_conta_amount.Returns;
          returnsType: fns.Function._Tweeks.funct_pos__sync_conta_amount.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_colaborador {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_colaborador.Args;
          options: fns.Function._Tweeks.funct_change_colaborador.Options;
          returns: fns.Function._Tweeks.funct_change_colaborador.Returns;
          returnsType: fns.Function._Tweeks.funct_change_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_caixa {
        export namespace docs {}

        export interface Options {
          arg_caixa_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_caixa.Args;
          options: fns.Function._Tweeks._get_caixa.Options;
          returns: fns.Function._Tweeks._get_caixa.Returns;
          returnsType: fns.Function._Tweeks._get_caixa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.caixa:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_caixa_by_colaborador {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          caixa_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          caixa_estado?: tns.TypedOf<"int2", Typed>;
          posto_id?: tns.TypedOf<"uuid", Typed>;
          espaco_nome?: tns.TypedOf<"varchar", Typed>;
          caixa_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
          caixa_id?: tns.TypedOf<"uuid", Typed>;
          posto_designacao?: tns.TypedOf<"varchar", Typed>;
          posto_estado?: tns.TypedOf<"int2", Typed>;
          caixa_montanteinicial?: tns.TypedOf<"float8", Typed>;
          posto_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          posto_montante?: tns.TypedOf<"float8", Typed>;
          posto_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Args;
          options: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Options;
          returns: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Returns;
          returnsType: fns.Function._Tweeks.funct_load_caixa_by_colaborador.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_cluster_by_branch {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_cluster_by_branch.Args;
          options: fns.Function._Tweeks.funct_load_cluster_by_branch.Options;
          returns: fns.Function._Tweeks.funct_load_cluster_by_branch.Returns;
          returnsType: fns.Function._Tweeks.funct_load_cluster_by_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_serie {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_serie.Args;
          options: fns.Function._Tweeks.funct_load_serie.Options;
          returns: fns.Function._Tweeks.funct_load_serie.Returns;
          returnsType: fns.Function._Tweeks.funct_load_serie.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_conta_data {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_conta_data.Args;
          options: fns.Function._Tweeks.funct_pos_load_conta_data.Options;
          returns: fns.Function._Tweeks.funct_pos_load_conta_data.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_conta_data.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_link_associacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_link_associacao.Args;
          options: fns.Function._Tweeks.funct_reg_link_associacao.Options;
          returns: fns.Function._Tweeks.funct_reg_link_associacao.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_link_associacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __load_cambio_day {
        export namespace docs {}

        export interface Options {
          arg_espaco_auth: tns.TypeOf<"uuid">;
          _const?: tns.TypeOf<"map.constant">;
          arg_cambio_data: tns.TypeOf<"date">;
          arg_currency_id: tns.TypeOf<"int2">;
        }

        export interface ReturnsType {
          cambio_id?: tns.TypedOf<"uuid", Typed>;
          cambio_estado?: tns.TypedOf<"int2", Typed>;
          cambio_data?: tns.TypedOf<"date", Typed>;
          cambio_taxa?: tns.TypedOf<"numeric", Typed>;
          cambio_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__load_cambio_day.Args;
          options: fns.Function._Tweeks.__load_cambio_day.Options;
          returns: fns.Function._Tweeks.__load_cambio_day.Returns;
          returnsType: fns.Function._Tweeks.__load_cambio_day.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_guia {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_guia.Args;
          options: fns.Function._Tweeks.funct_sets_guia.Options;
          returns: fns.Function._Tweeks.funct_sets_guia.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_guia.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.guia:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_ordem_classe {
        export namespace docs {}

        export interface Options {
          parms: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_ordem_classe.Args;
          options: fns.Function._Tweeks.funct_change_ordem_classe.Options;
          returns: fns.Function._Tweeks.funct_change_ordem_classe.Returns;
          returnsType: fns.Function._Tweeks.funct_change_ordem_classe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_artigo {
        export namespace docs {}

        export interface Options {
          arg_atigo_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_artigo.Args;
          options: fns.Function._Tweeks._get_artigo.Options;
          returns: fns.Function._Tweeks._get_artigo.Returns;
          returnsType: fns.Function._Tweeks._get_artigo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.artigo:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_classe {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_classe.Args;
          options: fns.Function._Tweeks.funct_reg_classe.Options;
          returns: fns.Function._Tweeks.funct_reg_classe.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_classe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_transacao {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_transacao.Args;
          options: fns.Function._Tweeks.funct_report_transacao.Options;
          returns: fns.Function._Tweeks.funct_report_transacao.Returns;
          returnsType: fns.Function._Tweeks.funct_report_transacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace viewargs_set {
        export namespace docs {}

        export interface Options {
          key: tns.TypeOf<"text">;
          element: tns.TypeOf<"anyelement">;
        }

        export interface ReturnsType {
          param?: tns.TypedOf<"text", Typed>;
          text?: tns.TypedOf<"text", Typed>;
          value?: tns.TypedOf<"jsonb", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.viewargs_set.Args;
          options: fns.Function._Tweeks.viewargs_set.Options;
          returns: fns.Function._Tweeks.viewargs_set.Returns;
          returnsType: fns.Function._Tweeks.viewargs_set.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_mesa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_mesa.Args;
          options: fns.Function._Tweeks.funct_change_mesa.Options;
          returns: fns.Function._Tweeks.funct_change_mesa.Returns;
          returnsType: fns.Function._Tweeks.funct_change_mesa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_link_disable {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_link_disable.Args;
          options: fns.Function._Tweeks.funct_change_link_disable.Options;
          returns: fns.Function._Tweeks.funct_change_link_disable.Returns;
          returnsType: fns.Function._Tweeks.funct_change_link_disable.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_entrada {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          fornecedor_nome?: tns.TypedOf<"varchar", Typed>;
          fornecedor_nif?: tns.TypedOf<"varchar", Typed>;
          entrada_data?: tns.TypedOf<"date", Typed>;
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          entrada_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          artigo_codigo?: tns.TypedOf<"varchar", Typed>;
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          entrada_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
          entrada_codigofatura?: tns.TypedOf<"varchar", Typed>;
          entrada_descricao?: tns.TypedOf<"varchar", Typed>;
          entrada_quantidade?: tns.TypedOf<"float8", Typed>;
          artigo_nome?: tns.TypedOf<"varchar", Typed>;
          entrada_estado?: tns.TypedOf<"int2", Typed>;
          entrada_id?: tns.TypedOf<"uuid", Typed>;
          entrada_montante?: tns.TypedOf<"float8", Typed>;
          fornecedor_id?: tns.TypedOf<"uuid", Typed>;
          espaco_nome?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_entrada.Args;
          options: fns.Function._Tweeks.funct_load_entrada.Options;
          returns: fns.Function._Tweeks.funct_load_entrada.Returns;
          returnsType: fns.Function._Tweeks.funct_load_entrada.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_conta {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_conta.Args;
          options: fns.Function._Tweeks.funct_change_conta.Options;
          returns: fns.Function._Tweeks.funct_change_conta.Returns;
          returnsType: fns.Function._Tweeks.funct_change_conta.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_branch {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_branch.Args;
          options: fns.Function._Tweeks.funct_sets_branch.Options;
          returns: fns.Function._Tweeks.funct_sets_branch.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_acerto_code {
        export namespace docs {}

        export interface Options {
          brc: tns.TypeOf<"uuid">;
          space_brc?: tns.TypeOf<"uuid">;
          user_brc?: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_acerto_code.Args;
          options: fns.Function._Tweeks.__generate_acerto_code.Options;
          returns: fns.Function._Tweeks.__generate_acerto_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_acerto_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_artigo {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_artigo.Args;
          options: fns.Function._Tweeks.funct_reg_artigo.Options;
          returns: fns.Function._Tweeks.funct_reg_artigo.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_artigo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_parametrizacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.sets_parametrizacao.Args;
          options: fns.Function._Tweeks.sets_parametrizacao.Options;
          returns: fns.Function._Tweeks.sets_parametrizacao.Returns;
          returnsType: fns.Function._Tweeks.sets_parametrizacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __sets_defaults_units {
        export namespace docs {}

        export interface Options {
          ___branch: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__sets_defaults_units.Args;
          options: fns.Function._Tweeks.__sets_defaults_units.Options;
          returns: fns.Function._Tweeks.__sets_defaults_units.Returns;
          returnsType: fns.Function._Tweeks.__sets_defaults_units.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_artigo_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_artigo_estado.Args;
          options: fns.Function._Tweeks.funct_change_artigo_estado.Options;
          returns: fns.Function._Tweeks.funct_change_artigo_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_artigo_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_fluxo_on_venda {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_fluxo_on_venda.Args;
          options: fns.Function._Tweeks.__tg_fluxo_on_venda.Options;
          returns: fns.Function._Tweeks.__tg_fluxo_on_venda.Returns;
          returnsType: fns.Function._Tweeks.__tg_fluxo_on_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_posto_chave {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__generate_posto_chave.Args;
          options: fns.Function._Tweeks.__generate_posto_chave.Options;
          returns: fns.Function._Tweeks.__generate_posto_chave.Returns;
          returnsType: fns.Function._Tweeks.__generate_posto_chave.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_conta {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_conta.Args;
          options: fns.Function._Tweeks.funct_pos_reg_conta.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_conta.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_conta.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_link_unlink {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_link_unlink.Args;
          options: fns.Function._Tweeks.funct_change_link_unlink.Options;
          returns: fns.Function._Tweeks.funct_change_link_unlink.Returns;
          returnsType: fns.Function._Tweeks.funct_change_link_unlink.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_tipoimposto {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_tipoimposto.Args;
          options: fns.Function._Tweeks.funct_load_tipoimposto.Options;
          returns: fns.Function._Tweeks.funct_load_tipoimposto.Returns;
          returnsType: fns.Function._Tweeks.funct_load_tipoimposto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_link_switch {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_link_switch.Args;
          options: fns.Function._Tweeks.funct_change_link_switch.Options;
          returns: fns.Function._Tweeks.funct_change_link_switch.Returns;
          returnsType: fns.Function._Tweeks.funct_change_link_switch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_precario {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_precario.Args;
          options: fns.Function._Tweeks.funct_reg_precario.Options;
          returns: fns.Function._Tweeks.funct_reg_precario.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_precario.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_classe_simple_report {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          classe_nome?: tns.TypedOf<"varchar", Typed>;
          classe_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_classe_simple_report.Args;
          options: fns.Function._Tweeks.funct_load_classe_simple_report.Options;
          returns: fns.Function._Tweeks.funct_load_classe_simple_report.Returns;
          returnsType: fns.Function._Tweeks.funct_load_classe_simple_report.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_lancamento {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.sets_lancamento.Args;
          options: fns.Function._Tweeks.sets_lancamento.Options;
          returns: fns.Function._Tweeks.sets_lancamento.Returns;
          returnsType: fns.Function._Tweeks.sets_lancamento.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_transferencia {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          origem_espaco_nome?: tns.TypedOf<"varchar", Typed>;
          transferencia_documento?: tns.TypedOf<"varchar", Typed>;
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          origem_espaco_id?: tns.TypedOf<"uuid", Typed>;
          transferencia_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          artigo_nome?: tns.TypedOf<"varchar", Typed>;
          transferencia_data?: tns.TypedOf<"date", Typed>;
          transferencia_quantidade?: tns.TypedOf<"float8", Typed>;
          transferencia_observacao?: tns.TypedOf<"varchar", Typed>;
          destino_espaco_nome?: tns.TypedOf<"varchar", Typed>;
          transferencia_id?: tns.TypedOf<"uuid", Typed>;
          transferencia_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
          artigo_codigo?: tns.TypedOf<"varchar", Typed>;
          destino_espaco_id?: tns.TypedOf<"uuid", Typed>;
          transferencia_estado?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_transferencia.Args;
          options: fns.Function._Tweeks.funct_load_transferencia.Options;
          returns: fns.Function._Tweeks.funct_load_transferencia.Returns;
          returnsType: fns.Function._Tweeks.funct_load_transferencia.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_espaco_simple {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_espaco_simple.Args;
          options: fns.Function._Tweeks.funct_load_espaco_simple.Options;
          returns: fns.Function._Tweeks.funct_load_espaco_simple.Returns;
          returnsType: fns.Function._Tweeks.funct_load_espaco_simple.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_item {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_item.Args;
          options: fns.Function._Tweeks.funct_reg_item.Options;
          returns: fns.Function._Tweeks.funct_reg_item.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_item.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_item_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_item_estado.Args;
          options: fns.Function._Tweeks.funct_change_item_estado.Options;
          returns: fns.Function._Tweeks.funct_change_item_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_item_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace ___override_auth_funct_load_grants {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.___override_auth_funct_load_grants.Args;
          options: fns.Function._Tweeks.___override_auth_funct_load_grants.Options;
          returns: fns.Function._Tweeks.___override_auth_funct_load_grants.Returns;
          returnsType: fns.Function._Tweeks.___override_auth_funct_load_grants.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_docs_financa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_docs_financa.Args;
          options: fns.Function._Tweeks.funct_load_conta_docs_financa.Options;
          returns: fns.Function._Tweeks.funct_load_conta_docs_financa.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_docs_financa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_posto_open {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_posto_open.Args;
          options: fns.Function._Tweeks.funct_change_posto_open.Options;
          returns: fns.Function._Tweeks.funct_change_posto_open.Returns;
          returnsType: fns.Function._Tweeks.funct_change_posto_open.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_items_simple {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          artigo_nome?: tns.TypedOf<"varchar", Typed>;
          artigo_descricao?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_items_simple.Args;
          options: fns.Function._Tweeks.funct_load_items_simple.Options;
          returns: fns.Function._Tweeks.funct_load_items_simple.Returns;
          returnsType: fns.Function._Tweeks.funct_load_items_simple.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_espaco_migrate {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_espaco_migrate.Args;
          options: fns.Function._Tweeks.funct_load_espaco_migrate.Options;
          returns: fns.Function._Tweeks.funct_load_espaco_migrate.Returns;
          returnsType: fns.Function._Tweeks.funct_load_espaco_migrate.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_colaborador {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_colaborador.Args;
          options: fns.Function._Tweeks.funct_pos_load_colaborador.Options;
          returns: fns.Function._Tweeks.funct_pos_load_colaborador.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo_simple {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          artigo_nome?: tns.TypedOf<"varchar", Typed>;
          artigo_descricao?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo_simple.Args;
          options: fns.Function._Tweeks.funct_load_artigo_simple.Options;
          returns: fns.Function._Tweeks.funct_load_artigo_simple.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo_simple.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_espaco {
        export namespace docs {}

        export interface Options {
          arg_espaco_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_espaco.Args;
          options: fns.Function._Tweeks._get_espaco.Options;
          returns: fns.Function._Tweeks._get_espaco.Returns;
          returnsType: fns.Function._Tweeks._get_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.espaco:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_conta_after_close {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_conta_after_close.Args;
          options: fns.Function._Tweeks.__tg_conta_after_close.Options;
          returns: fns.Function._Tweeks.__tg_conta_after_close.Returns;
          returnsType: fns.Function._Tweeks.__tg_conta_after_close.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_posto_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_posto_estado.Args;
          options: fns.Function._Tweeks.funct_change_posto_estado.Options;
          returns: fns.Function._Tweeks.funct_change_posto_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_posto_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_cliente {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_cliente.Args;
          options: fns.Function._Tweeks.funct_pos_load_cliente.Options;
          returns: fns.Function._Tweeks.funct_pos_load_cliente.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_cliente.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_deposito {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_deposito.Args;
          options: fns.Function._Tweeks.funct_pos_reg_deposito.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_deposito.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_deposito.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo.Args;
          options: fns.Function._Tweeks.funct_load_artigo.Options;
          returns: fns.Function._Tweeks.funct_load_artigo.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_report_parametrized {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_report_parametrized.Args;
          options: fns.Function._Tweeks.funct_load_report_parametrized.Options;
          returns: fns.Function._Tweeks.funct_load_report_parametrized.Returns;
          returnsType: fns.Function._Tweeks.funct_load_report_parametrized.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_espaco_configuracao {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_espaco_configuracao.Args;
          options: fns.Function._Tweeks.funct_load_espaco_configuracao.Options;
          returns: fns.Function._Tweeks.funct_load_espaco_configuracao.Returns;
          returnsType: fns.Function._Tweeks.funct_load_espaco_configuracao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_vendaimposto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Args;
          options: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_vendaimposto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __lancamento_regularizacao {
        export namespace docs {}

        export interface Options {
          args?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          saldo?: tns.TypedOf<"float8", Typed>;
          ordem?: tns.TypedOf<"int8", Typed>;
          acomulacao?: tns.TypedOf<"float8", Typed>;
          ordem_grupo?: tns.TypedOf<"int8", Typed>;
          cd?: tns.TypedOf<"varchar", Typed>;
          debito?: tns.TypedOf<"float8", Typed>;
          regula_montante?: tns.TypedOf<"float8", Typed>;
          lancamento_id?: tns.TypedOf<"uuid", Typed>;
          valor?: tns.TypedOf<"float8", Typed>;
          lancamento_sequencia?: tns.TypedOf<"int8", Typed>;
          lancamento_doc?: tns.TypedOf<"varchar", Typed>;
          lancamento_time?: tns.TypedOf<"timestamptz", Typed>;
          resumo?: tns.TypedOf<"bool", Typed>;
          regula_id?: tns.TypedOf<"uuid", Typed>[];
          tgrupo_id?: tns.TypedOf<"int2", Typed>;
          cliente_id?: tns.TypedOf<"uuid", Typed>;
          regula_acumulacao?: tns.TypedOf<"float8", Typed>;
          lancamento_class?: tns.TypedOf<"varchar", Typed>;
          lancamento_ref?: tns.TypedOf<"jsonb", Typed>;
          regula_refid?: tns.TypedOf<"uuid", Typed>[];
          lancamento_refid?: tns.TypedOf<"uuid", Typed>;
          credito?: tns.TypedOf<"float8", Typed>;
          entrada?: tns.TypedOf<"float8", Typed>;
          regula?: tns.TypedOf<"numeric", Typed>[];
          lancamento_data?: tns.TypedOf<"date", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__lancamento_regularizacao.Args;
          options: fns.Function._Tweeks.__lancamento_regularizacao.Options;
          returns: fns.Function._Tweeks.__lancamento_regularizacao.Returns;
          returnsType: fns.Function._Tweeks.__lancamento_regularizacao.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __artigo_has_stock {
        export namespace docs {}

        export interface Options {
          arg_quantidadedebito: tns.TypeOf<"float8">;
          arg_espaco_id: tns.TypeOf<"uuid">;
          arg_artigo_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__artigo_has_stock.Args;
          options: fns.Function._Tweeks.__artigo_has_stock.Options;
          returns: fns.Function._Tweeks.__artigo_has_stock.Returns;
          returnsType: fns.Function._Tweeks.__artigo_has_stock.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_posto {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_posto.Args;
          options: fns.Function._Tweeks.funct_load_posto.Options;
          returns: fns.Function._Tweeks.funct_load_posto.Returns;
          returnsType: fns.Function._Tweeks.funct_load_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_espaco {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_espaco.Args;
          options: fns.Function._Tweeks.funct_load_espaco.Options;
          returns: fns.Function._Tweeks.funct_load_espaco.Returns;
          returnsType: fns.Function._Tweeks.funct_load_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_fornecedor_code {
        export namespace docs {}

        export interface Options {
          _branch: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_fornecedor_code.Args;
          options: fns.Function._Tweeks.__generate_fornecedor_code.Options;
          returns: fns.Function._Tweeks.__generate_fornecedor_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_fornecedor_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_by_caixa {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_by_caixa.Args;
          options: fns.Function._Tweeks.funct_load_conta_by_caixa.Options;
          returns: fns.Function._Tweeks.funct_load_conta_by_caixa.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_by_caixa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_report_venda {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_report_venda.Args;
          options: fns.Function._Tweeks.funct_pos_report_venda.Options;
          returns: fns.Function._Tweeks.funct_pos_report_venda.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_report_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_fluxo_on_transferencia {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Args;
          options: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Options;
          returns: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Returns;
          returnsType: fns.Function._Tweeks.__tg_fluxo_on_transferencia.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_artigo_composto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_artigo_composto.Args;
          options: fns.Function._Tweeks.funct_pos_load_artigo_composto.Options;
          returns: fns.Function._Tweeks.funct_pos_load_artigo_composto.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_artigo_composto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __branch_menu {
        export namespace docs {}

        export interface Options {
          _branch_uid?: tns.TypeOf<"uuid">;
          _user?: tns.TypeOf<"uuid">;
          _force?: tns.TypeOf<"bool">;
          _espaco?: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__branch_menu.Args;
          options: fns.Function._Tweeks.__branch_menu.Options;
          returns: fns.Function._Tweeks.__branch_menu.Returns;
          returnsType: fns.Function._Tweeks.__branch_menu.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"auth.menu:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_lancamento {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_lancamento.Args;
          options: fns.Function._Tweeks.funct_load_lancamento.Options;
          returns: fns.Function._Tweeks.funct_load_lancamento.Returns;
          returnsType: fns.Function._Tweeks.funct_load_lancamento.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_before_update_classe {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_before_update_classe.Args;
          options: fns.Function._Tweeks.__tg_before_update_classe.Options;
          returns: fns.Function._Tweeks.__tg_before_update_classe.Returns;
          returnsType: fns.Function._Tweeks.__tg_before_update_classe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_chave_restore {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_chave_restore.Args;
          options: fns.Function._Tweeks.funct_change_chave_restore.Options;
          returns: fns.Function._Tweeks.funct_change_chave_restore.Returns;
          returnsType: fns.Function._Tweeks.funct_change_chave_restore.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artig_check_nome {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artig_check_nome.Args;
          options: fns.Function._Tweeks.funct_load_artig_check_nome.Options;
          returns: fns.Function._Tweeks.funct_load_artig_check_nome.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artig_check_nome.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_change_conta_anular {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_change_conta_anular.Args;
          options: fns.Function._Tweeks.funct_pos_change_conta_anular.Options;
          returns: fns.Function._Tweeks.funct_pos_change_conta_anular.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_change_conta_anular.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_device_unregistered {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_device_unregistered.Args;
          options: fns.Function._Tweeks.funct_load_device_unregistered.Options;
          returns: fns.Function._Tweeks.funct_load_device_unregistered.Returns;
          returnsType: fns.Function._Tweeks.funct_load_device_unregistered.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_tmovimento {
        export namespace docs {}

        export interface Options {
          arg_tmovimento_id: tns.TypeOf<"int2">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_tmovimento.Args;
          options: fns.Function._Tweeks._get_tmovimento.Options;
          returns: fns.Function._Tweeks._get_tmovimento.Returns;
          returnsType: fns.Function._Tweeks._get_tmovimento.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.tmovimento:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_posto_status {
        export namespace docs {}

        export interface Options {
          filters: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_posto_status.Args;
          options: fns.Function._Tweeks.funct_load_posto_status.Options;
          returns: fns.Function._Tweeks.funct_load_posto_status.Returns;
          returnsType: fns.Function._Tweeks.funct_load_posto_status.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_venda {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_venda.Args;
          options: fns.Function._Tweeks.funct_pos_reg_venda.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_venda.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_stock {
        export namespace docs {}

        export interface Options {
          _artigo_id: tns.TypeOf<"uuid">;
          _espaco_id: tns.TypeOf<"uuid">;
        }

        export interface ReturnsType {
          stock_quantidade?: tns.TypedOf<"float8", Typed>;
          stock_espaco_id?: tns.TypedOf<"uuid", Typed>;
          stock_artigo_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_stock.Args;
          options: fns.Function._Tweeks._get_stock.Options;
          returns: fns.Function._Tweeks._get_stock.Returns;
          returnsType: fns.Function._Tweeks._get_stock.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_fornecedor {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_fornecedor.Args;
          options: fns.Function._Tweeks.funct_sets_fornecedor.Options;
          returns: fns.Function._Tweeks.funct_sets_fornecedor.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_fornecedor.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_conta {
        export namespace docs {}

        export interface Options {
          arg_conta_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_conta.Args;
          options: fns.Function._Tweeks._get_conta.Options;
          returns: fns.Function._Tweeks._get_conta.Returns;
          returnsType: fns.Function._Tweeks._get_conta.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.conta:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_conta_preparar {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"json">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_conta_preparar.Args;
          options: fns.Function._Tweeks.funct_change_conta_preparar.Options;
          returns: fns.Function._Tweeks.funct_change_conta_preparar.Returns;
          returnsType: fns.Function._Tweeks.funct_change_conta_preparar.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_autorizacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_autorizacao.Args;
          options: fns.Function._Tweeks.funct_load_autorizacao.Options;
          returns: fns.Function._Tweeks.funct_load_autorizacao.Returns;
          returnsType: fns.Function._Tweeks.funct_load_autorizacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_serie {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_serie.Args;
          options: fns.Function._Tweeks.funct_sets_serie.Options;
          returns: fns.Function._Tweeks.funct_sets_serie.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_serie.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_change_conta_fechar {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_change_conta_fechar.Args;
          options: fns.Function._Tweeks.funct_pos_change_conta_fechar.Options;
          returns: fns.Function._Tweeks.funct_pos_change_conta_fechar.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_change_conta_fechar.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_deposito_data {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_deposito_data.Args;
          options: fns.Function._Tweeks.funct_load_deposito_data.Options;
          returns: fns.Function._Tweeks.funct_load_deposito_data.Returns;
          returnsType: fns.Function._Tweeks.funct_load_deposito_data.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"json", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_caixa {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_caixa.Args;
          options: fns.Function._Tweeks.funct_report_caixa.Options;
          returns: fns.Function._Tweeks.funct_report_caixa.Returns;
          returnsType: fns.Function._Tweeks.funct_report_caixa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_posto_closed {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          posto_designacao?: tns.TypedOf<"varchar", Typed>;
          espaco_nome?: tns.TypedOf<"varchar", Typed>;
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          posto_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_posto_closed.Args;
          options: fns.Function._Tweeks.funct_load_posto_closed.Options;
          returns: fns.Function._Tweeks.funct_load_posto_closed.Returns;
          returnsType: fns.Function._Tweeks.funct_load_posto_closed.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_classe_code {
        export namespace docs {}

        export interface Options {
          brc: tns.TypeOf<"uuid">;
          space_brc: tns.TypeOf<"uuid">;
          user_brc: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_classe_code.Args;
          options: fns.Function._Tweeks.__generate_classe_code.Options;
          returns: fns.Function._Tweeks.__generate_classe_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_classe_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_dispoe {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_dispoe.Args;
          options: fns.Function._Tweeks.funct_reg_dispoe.Options;
          returns: fns.Function._Tweeks.funct_reg_dispoe.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_dispoe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_colaborador {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_colaborador.Args;
          options: fns.Function._Tweeks.funct_reg_colaborador.Options;
          returns: fns.Function._Tweeks.funct_reg_colaborador.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_link_move {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_link_move.Args;
          options: fns.Function._Tweeks.funct_change_link_move.Options;
          returns: fns.Function._Tweeks.funct_change_link_move.Returns;
          returnsType: fns.Function._Tweeks.funct_change_link_move.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_stock {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_stock.Args;
          options: fns.Function._Tweeks.funct_reg_stock.Options;
          returns: fns.Function._Tweeks.funct_reg_stock.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_stock.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_classe {
        export namespace docs {}

        export interface Options {
          arg_classe_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_classe.Args;
          options: fns.Function._Tweeks._get_classe.Options;
          returns: fns.Function._Tweeks._get_classe.Returns;
          returnsType: fns.Function._Tweeks._get_classe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.classe:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_espaco_configuracao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_espaco_configuracao.Args;
          options: fns.Function._Tweeks.funct_change_espaco_configuracao.Options;
          returns: fns.Function._Tweeks.funct_change_espaco_configuracao.Returns;
          returnsType: fns.Function._Tweeks.funct_change_espaco_configuracao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_espaco {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_espaco.Args;
          options: fns.Function._Tweeks.funct_change_espaco.Options;
          returns: fns.Function._Tweeks.funct_change_espaco.Returns;
          returnsType: fns.Function._Tweeks.funct_change_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_use_branch {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_use_branch.Args;
          options: fns.Function._Tweeks.__tg_use_branch.Options;
          returns: fns.Function._Tweeks.__tg_use_branch.Returns;
          returnsType: fns.Function._Tweeks.__tg_use_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_conta_proforma {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_conta_proforma.Args;
          options: fns.Function._Tweeks.funct_pos_load_conta_proforma.Options;
          returns: fns.Function._Tweeks.funct_pos_load_conta_proforma.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_conta_proforma.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_generate_key {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_generate_key.Args;
          options: fns.Function._Tweeks.funct_pos_generate_key.Options;
          returns: fns.Function._Tweeks.funct_pos_generate_key.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_generate_key.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_classe {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_classe.Args;
          options: fns.Function._Tweeks.funct_load_classe.Options;
          returns: fns.Function._Tweeks.funct_load_classe.Returns;
          returnsType: fns.Function._Tweeks.funct_load_classe.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __get_serie_espaco {
        export namespace docs {}

        export interface Options {
          arg_espaco_auth: tns.TypeOf<"uuid">;
          arg_tserie: tns.TypeOf<"int4">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__get_serie_espaco.Args;
          options: fns.Function._Tweeks.__get_serie_espaco.Options;
          returns: fns.Function._Tweeks.__get_serie_espaco.Returns;
          returnsType: fns.Function._Tweeks.__get_serie_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.serie:Props", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_transferencia {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_transferencia.Args;
          options: fns.Function._Tweeks.funct_reg_transferencia.Options;
          returns: fns.Function._Tweeks.funct_reg_transferencia.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_transferencia.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_fornecedor_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_fornecedor_estado.Args;
          options: fns.Function._Tweeks.funct_change_fornecedor_estado.Options;
          returns: fns.Function._Tweeks.funct_change_fornecedor_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_fornecedor_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_cambio_history {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          currency_code?: tns.TypedOf<"varchar", Typed>;
          currency_id?: tns.TypedOf<"int2", Typed>;
          cambio_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
          currency_symbol?: tns.TypedOf<"varchar", Typed>;
          cambio_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          cambio_data?: tns.TypedOf<"date", Typed>;
          cambio_taxa?: tns.TypedOf<"float8", Typed>;
          cambio_estado?: tns.TypedOf<"int2", Typed>;
          currency_name?: tns.TypedOf<"varchar", Typed>;
          cambio_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_cambio_history.Args;
          options: fns.Function._Tweeks.funct_load_cambio_history.Options;
          returns: fns.Function._Tweeks.funct_load_cambio_history.Returns;
          returnsType: fns.Function._Tweeks.funct_load_cambio_history.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __space_branch_level {
        export namespace docs {}

        export interface Options {
          _espaco_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__space_branch_level.Args;
          options: fns.Function._Tweeks.__space_branch_level.Options;
          returns: fns.Function._Tweeks.__space_branch_level.Returns;
          returnsType: fns.Function._Tweeks.__space_branch_level.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"int4", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_trabalha {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_trabalha.Args;
          options: fns.Function._Tweeks.funct_reg_trabalha.Options;
          returns: fns.Function._Tweeks.funct_reg_trabalha.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_trabalha.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace viewarg {
        export namespace docs {}

        export interface Options {
          argname: tns.TypeOf<"text">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.viewarg.Args;
          options: fns.Function._Tweeks.viewarg.Options;
          returns: fns.Function._Tweeks.viewarg.Returns;
          returnsType: fns.Function._Tweeks.viewarg.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo_base {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo_base.Args;
          options: fns.Function._Tweeks.funct_load_artigo_base.Options;
          returns: fns.Function._Tweeks.funct_load_artigo_base.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo_base.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_trabalha {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_trabalha.Args;
          options: fns.Function._Tweeks.funct_load_trabalha.Options;
          returns: fns.Function._Tweeks.funct_load_trabalha.Returns;
          returnsType: fns.Function._Tweeks.funct_load_trabalha.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_mesa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_mesa.Args;
          options: fns.Function._Tweeks.funct_reg_mesa.Options;
          returns: fns.Function._Tweeks.funct_reg_mesa.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_mesa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_link {
        export namespace docs {}

        export interface Options {
          arg_link_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_link.Args;
          options: fns.Function._Tweeks._get_link.Options;
          returns: fns.Function._Tweeks._get_link.Returns;
          returnsType: fns.Function._Tweeks._get_link.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.link:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_serie_available {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_serie_available.Args;
          options: fns.Function._Tweeks.funct_load_serie_available.Options;
          returns: fns.Function._Tweeks.funct_load_serie_available.Returns;
          returnsType: fns.Function._Tweeks.funct_load_serie_available.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo_data {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo_data.Args;
          options: fns.Function._Tweeks.funct_load_artigo_data.Options;
          returns: fns.Function._Tweeks.funct_load_artigo_data.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo_data.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_classe_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_classe_estado.Args;
          options: fns.Function._Tweeks.funct_change_classe_estado.Options;
          returns: fns.Function._Tweeks.funct_change_classe_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_classe_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_conta_nota_credito {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_conta_nota_credito.Args;
          options: fns.Function._Tweeks.funct_reg_conta_nota_credito.Options;
          returns: fns.Function._Tweeks.funct_reg_conta_nota_credito.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_conta_nota_credito.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_compra_entrada {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_compra_entrada.Args;
          options: fns.Function._Tweeks.funct_report_compra_entrada.Options;
          returns: fns.Function._Tweeks.funct_report_compra_entrada.Returns;
          returnsType: fns.Function._Tweeks.funct_report_compra_entrada.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_cliente {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_cliente.Args;
          options: fns.Function._Tweeks.funct_pos_reg_cliente.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_cliente.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_cliente.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace load_clusters {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.load_clusters.Args;
          options: fns.Function._Tweeks.load_clusters.Options;
          returns: fns.Function._Tweeks.load_clusters.Returns;
          returnsType: fns.Function._Tweeks.load_clusters.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_unit {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_unit.Args;
          options: fns.Function._Tweeks.funct_sets_unit.Options;
          returns: fns.Function._Tweeks.funct_sets_unit.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_unit.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_mesa_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_mesa_estado.Args;
          options: fns.Function._Tweeks.funct_change_mesa_estado.Options;
          returns: fns.Function._Tweeks.funct_change_mesa_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_mesa_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __check_stock_on_venda {
        export namespace docs {}

        export interface Options {
          _vendas: tns.TypeOf<"jsonb">;
          _espaco_auth: tns.TypeOf<"uuid">;
        }

        export interface ReturnsType {
          stocks?: tns.TypedOf<"bool", Typed>;
          items?: tns.TypedOf<"text", Typed>;
          message?: tns.TypedOf<"text", Typed>;
          counts?: tns.TypedOf<"text", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__check_stock_on_venda.Args;
          options: fns.Function._Tweeks.__check_stock_on_venda.Options;
          returns: fns.Function._Tweeks.__check_stock_on_venda.Returns;
          returnsType: fns.Function._Tweeks.__check_stock_on_venda.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_mesa_livre {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_mesa_livre.Args;
          options: fns.Function._Tweeks.funct_load_mesa_livre.Options;
          returns: fns.Function._Tweeks.funct_load_mesa_livre.Returns;
          returnsType: fns.Function._Tweeks.funct_load_mesa_livre.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_conta_imprimir {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_conta_imprimir.Args;
          options: fns.Function._Tweeks.funct_change_conta_imprimir.Options;
          returns: fns.Function._Tweeks.funct_change_conta_imprimir.Returns;
          returnsType: fns.Function._Tweeks.funct_change_conta_imprimir.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_fornecedor_simple {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          fornecedor_nome?: tns.TypedOf<"varchar", Typed>;
          fornecedor_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_fornecedor_simple.Args;
          options: fns.Function._Tweeks.funct_load_fornecedor_simple.Options;
          returns: fns.Function._Tweeks.funct_load_fornecedor_simple.Returns;
          returnsType: fns.Function._Tweeks.funct_load_fornecedor_simple.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_espaco_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_espaco_estado.Args;
          options: fns.Function._Tweeks.funct_change_espaco_estado.Options;
          returns: fns.Function._Tweeks.funct_change_espaco_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_espaco_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_item {
        export namespace docs {}

        export interface Options {
          arg_artigo_item: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_item.Args;
          options: fns.Function._Tweeks._get_item.Options;
          returns: fns.Function._Tweeks._get_item.Returns;
          returnsType: fns.Function._Tweeks._get_item.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.artigo:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_artigo_search {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_artigo_search.Args;
          options: fns.Function._Tweeks.funct_pos_load_artigo_search.Options;
          returns: fns.Function._Tweeks.funct_pos_load_artigo_search.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_artigo_search.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_unit {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_unit.Args;
          options: fns.Function._Tweeks.funct_load_unit.Options;
          returns: fns.Function._Tweeks.funct_load_unit.Returns;
          returnsType: fns.Function._Tweeks.funct_load_unit.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_fornecedor {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_fornecedor.Args;
          options: fns.Function._Tweeks.funct_reg_fornecedor.Options;
          returns: fns.Function._Tweeks.funct_reg_fornecedor.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_fornecedor.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_conta_docs_financa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_conta_docs_financa.Args;
          options: fns.Function._Tweeks.funct_reg_conta_docs_financa.Options;
          returns: fns.Function._Tweeks.funct_reg_conta_docs_financa.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_conta_docs_financa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_impostos_taxa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          percentagem_retirar?: tns.TypedOf<"float8", Typed>;
          taxa_adicionar?: tns.TypedOf<"float8", Typed>;
          taxa_retirar?: tns.TypedOf<"float8", Typed>;
          taxas?: tns.TypedOf<"uuid", Typed>[];
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          percentagem_adicionar?: tns.TypedOf<"float8", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_impostos_taxa.Args;
          options: fns.Function._Tweeks._get_impostos_taxa.Options;
          returns: fns.Function._Tweeks._get_impostos_taxa.Returns;
          returnsType: fns.Function._Tweeks._get_impostos_taxa.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_fornecedor {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_fornecedor.Args;
          options: fns.Function._Tweeks.funct_load_fornecedor.Options;
          returns: fns.Function._Tweeks.funct_load_fornecedor.Returns;
          returnsType: fns.Function._Tweeks.funct_load_fornecedor.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"json", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_chave {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_chave.Args;
          options: fns.Function._Tweeks.funct_load_chave.Options;
          returns: fns.Function._Tweeks.funct_load_chave.Returns;
          returnsType: fns.Function._Tweeks.funct_load_chave.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_stock_movimentos {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_stock_movimentos.Args;
          options: fns.Function._Tweeks.funct_report_stock_movimentos.Options;
          returns: fns.Function._Tweeks.funct_report_stock_movimentos.Returns;
          returnsType: fns.Function._Tweeks.funct_report_stock_movimentos.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __infinity_loop {
        export namespace docs {}

        export interface Options {
          _espaco: tns.TypeOf<"tweeks.espaco:Props">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__infinity_loop.Args;
          options: fns.Function._Tweeks.__infinity_loop.Options;
          returns: fns.Function._Tweeks.__infinity_loop.Returns;
          returnsType: fns.Function._Tweeks.__infinity_loop.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_entrada {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_entrada.Args;
          options: fns.Function._Tweeks.funct_reg_entrada.Options;
          returns: fns.Function._Tweeks.funct_reg_entrada.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_entrada.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __get_autorizacao {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__get_autorizacao.Args;
          options: fns.Function._Tweeks.__get_autorizacao.Options;
          returns: fns.Function._Tweeks.__get_autorizacao.Returns;
          returnsType: fns.Function._Tweeks.__get_autorizacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<
          "tweeks.autorizacao:Props",
          Typed
        >;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"uuid">];
      }

      export namespace __generate_caixa_code {
        export namespace docs {}

        export interface Options {
          user_brc?: tns.TypeOf<"uuid">;
          brc: tns.TypeOf<"uuid">;
          space_brc?: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_caixa_code.Args;
          options: fns.Function._Tweeks.__generate_caixa_code.Options;
          returns: fns.Function._Tweeks.__generate_caixa_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_caixa_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_tespaco {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          tespaco_designacao?: tns.TypedOf<"varchar", Typed>;
          tespaco_id?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_tespaco.Args;
          options: fns.Function._Tweeks.funct_load_tespaco.Options;
          returns: fns.Function._Tweeks.funct_load_tespaco.Returns;
          returnsType: fns.Function._Tweeks.funct_load_tespaco.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_venda_artigo {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_venda_artigo.Args;
          options: fns.Function._Tweeks.funct_report_venda_artigo.Options;
          returns: fns.Function._Tweeks.funct_report_venda_artigo.Returns;
          returnsType: fns.Function._Tweeks.funct_report_venda_artigo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_parametrizacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_parametrizacao.Args;
          options: fns.Function._Tweeks.funct_load_parametrizacao.Options;
          returns: fns.Function._Tweeks.funct_load_parametrizacao.Returns;
          returnsType: fns.Function._Tweeks.funct_load_parametrizacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_branch_by_colaborador {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks._get_branch_by_colaborador.Args;
          options: fns.Function._Tweeks._get_branch_by_colaborador.Options;
          returns: fns.Function._Tweeks._get_branch_by_colaborador.Returns;
          returnsType: fns.Function._Tweeks._get_branch_by_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.branch:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"uuid">];
      }

      export namespace funct_sets_autorizacao_continue {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_autorizacao_continue.Args;
          options: fns.Function._Tweeks.funct_sets_autorizacao_continue.Options;
          returns: fns.Function._Tweeks.funct_sets_autorizacao_continue.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_autorizacao_continue.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __fluxo_stock {
        export namespace docs {}

        export interface Options {
          _espaco_uid?: tns.TypeOf<"uuid">;
          _artigo_uid?: tns.TypeOf<"uuid">;
          _branch?: tns.TypeOf<"uuid">;
          _classe_uid?: tns.TypeOf<"uuid">;
        }

        export interface ReturnsType {
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          stock_quantidade?: tns.TypedOf<"float8", Typed>;
          artigo_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__fluxo_stock.Args;
          options: fns.Function._Tweeks.__fluxo_stock.Options;
          returns: fns.Function._Tweeks.__fluxo_stock.Returns;
          returnsType: fns.Function._Tweeks.__fluxo_stock.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_atividade {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.sets_atividade.Args;
          options: fns.Function._Tweeks.sets_atividade.Options;
          returns: fns.Function._Tweeks.sets_atividade.Returns;
          returnsType: fns.Function._Tweeks.sets_atividade.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos__calc_imposto {
        export namespace docs {}

        export interface Options {
          montante: tns.TypeOf<"float8">;
          args?: tns.TypeOf<"jsonb">;
          arg_artigo_id: tns.TypeOf<"uuid">;
        }

        export interface ReturnsType {
          impostos?: tns.TypedOf<"jsonb", Typed>;
          venda_montantecomimposto?: tns.TypedOf<"float8", Typed>;
          venda_impostoretirar?: tns.TypedOf<"float8", Typed>;
          venda_montantesemimposto?: tns.TypedOf<"float8", Typed>;
          venda_impostoadicionar?: tns.TypedOf<"float8", Typed>;
          venda_imposto?: tns.TypedOf<"float8", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos__calc_imposto.Args;
          options: fns.Function._Tweeks.funct_pos__calc_imposto.Options;
          returns: fns.Function._Tweeks.funct_pos__calc_imposto.Returns;
          returnsType: fns.Function._Tweeks.funct_pos__calc_imposto.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_guia_data {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_guia_data.Args;
          options: fns.Function._Tweeks.funct_load_guia_data.Options;
          returns: fns.Function._Tweeks.funct_load_guia_data.Returns;
          returnsType: fns.Function._Tweeks.funct_load_guia_data.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"json", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_tpaga {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          tpaga_designacao?: tns.TypedOf<"varchar", Typed>;
          tpaga_id?: tns.TypedOf<"int2", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_tpaga.Args;
          options: fns.Function._Tweeks.funct_load_tpaga.Options;
          returns: fns.Function._Tweeks.funct_load_tpaga.Returns;
          returnsType: fns.Function._Tweeks.funct_load_tpaga.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_venda {
        export namespace docs {}

        export interface Options {
          arg_venda_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_venda.Args;
          options: fns.Function._Tweeks._get_venda.Options;
          returns: fns.Function._Tweeks._get_venda.Returns;
          returnsType: fns.Function._Tweeks._get_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.venda:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __precario {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          precario_custo?: tns.TypedOf<"float8", Typed>;
          precario_quantidade?: tns.TypedOf<"float8", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__precario.Args;
          options: fns.Function._Tweeks.__precario.Options;
          returns: fns.Function._Tweeks.__precario.Returns;
          returnsType: fns.Function._Tweeks.__precario.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"jsonb">];
      }

      export namespace funct_load_serie_distribuicao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_serie_distribuicao.Args;
          options: fns.Function._Tweeks.funct_load_serie_distribuicao.Options;
          returns: fns.Function._Tweeks.funct_load_serie_distribuicao.Returns;
          returnsType: fns.Function._Tweeks.funct_load_serie_distribuicao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_documento {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_documento.Args;
          options: fns.Function._Tweeks.funct_load_conta_documento.Options;
          returns: fns.Function._Tweeks.funct_load_conta_documento.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_documento.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_cliente_code {
        export namespace docs {}

        export interface Options {
          espaco: tns.TypeOf<"uuid">;
          colaborador: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_cliente_code.Args;
          options: fns.Function._Tweeks.__generate_cliente_code.Options;
          returns: fns.Function._Tweeks.__generate_cliente_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_cliente_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_fluxo_on_retalho {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_fluxo_on_retalho.Args;
          options: fns.Function._Tweeks.__tg_fluxo_on_retalho.Options;
          returns: fns.Function._Tweeks.__tg_fluxo_on_retalho.Returns;
          returnsType: fns.Function._Tweeks.__tg_fluxo_on_retalho.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_autorizacao_closeyear {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Args;
          options: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Options;
          returns: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Returns;
          returnsType: fns.Function._Tweeks.funct_change_autorizacao_closeyear.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace ___override_auth_funct_autenticacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.___override_auth_funct_autenticacao.Args;
          options: fns.Function._Tweeks.___override_auth_funct_autenticacao.Options;
          returns: fns.Function._Tweeks.___override_auth_funct_autenticacao.Returns;
          returnsType: fns.Function._Tweeks.___override_auth_funct_autenticacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo_exports {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo_exports.Args;
          options: fns.Function._Tweeks.funct_load_artigo_exports.Options;
          returns: fns.Function._Tweeks.funct_load_artigo_exports.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo_exports.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_venda_before_check {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_venda_before_check.Args;
          options: fns.Function._Tweeks.__tg_venda_before_check.Options;
          returns: fns.Function._Tweeks.__tg_venda_before_check.Returns;
          returnsType: fns.Function._Tweeks.__tg_venda_before_check.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_venda_preparado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_venda_preparado.Args;
          options: fns.Function._Tweeks.funct_change_venda_preparado.Options;
          returns: fns.Function._Tweeks.funct_change_venda_preparado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_venda_preparado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_conta_aberto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_conta_aberto.Args;
          options: fns.Function._Tweeks.funct_pos_load_conta_aberto.Options;
          returns: fns.Function._Tweeks.funct_pos_load_conta_aberto.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_conta_aberto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_venda {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_venda.Args;
          options: fns.Function._Tweeks.funct_change_venda.Options;
          returns: fns.Function._Tweeks.funct_change_venda.Returns;
          returnsType: fns.Function._Tweeks.funct_change_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace viewargs_object {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.viewargs_object.Args;
          options: fns.Function._Tweeks.viewargs_object.Options;
          returns: fns.Function._Tweeks.viewargs_object.Returns;
          returnsType: fns.Function._Tweeks.viewargs_object.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __cluster_filter_branch {
        export namespace docs {}

        export interface Options {
          _origin: tns.TypeOf<"cluster.cluster:Props">;
          _object: tns.TypeOf<"cluster.object:Props">;
          share: tns.TypeOf<"varchar">;
          _cluster: tns.TypeOf<"cluster.cluster:Props">;
          _collector: tns.TypeOf<"cluster.collector:Props">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__cluster_filter_branch.Args;
          options: fns.Function._Tweeks.__cluster_filter_branch.Options;
          returns: fns.Function._Tweeks.__cluster_filter_branch.Returns;
          returnsType: fns.Function._Tweeks.__cluster_filter_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"bool", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace viewargs_sets {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          text?: tns.TypedOf<"text", Typed>;
          param?: tns.TypedOf<"text", Typed>;
          value?: tns.TypedOf<"jsonb", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.viewargs_sets.Args;
          options: fns.Function._Tweeks.viewargs_sets.Options;
          returns: fns.Function._Tweeks.viewargs_sets.Returns;
          returnsType: fns.Function._Tweeks.viewargs_sets.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"jsonb">];
      }

      export namespace funct_load_posto_simple {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          posto_id?: tns.TypedOf<"uuid", Typed>;
          posto_designacao?: tns.TypedOf<"varchar", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_posto_simple.Args;
          options: fns.Function._Tweeks.funct_load_posto_simple.Options;
          returns: fns.Function._Tweeks.funct_load_posto_simple.Returns;
          returnsType: fns.Function._Tweeks.funct_load_posto_simple.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_caixa {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_caixa.Args;
          options: fns.Function._Tweeks.funct_load_caixa.Options;
          returns: fns.Function._Tweeks.funct_load_caixa.Returns;
          returnsType: fns.Function._Tweeks.funct_load_caixa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_ean {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_ean.Args;
          options: fns.Function._Tweeks.funct_reg_ean.Options;
          returns: fns.Function._Tweeks.funct_reg_ean.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_ean.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __check_conta_data {
        export namespace docs {}

        export interface Options {
          _tserie_id: tns.TypeOf<"int4">;
          _conta_data: tns.TypeOf<"date">;
          _serie_id?: tns.TypeOf<"uuid">;
          _raise: tns.TypeOf<"bool">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__check_conta_data.Args;
          options: fns.Function._Tweeks.__check_conta_data.Options;
          returns: fns.Function._Tweeks.__check_conta_data.Returns;
          returnsType: fns.Function._Tweeks.__check_conta_data.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_posto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_posto.Args;
          options: fns.Function._Tweeks.funct_reg_posto.Options;
          returns: fns.Function._Tweeks.funct_reg_posto.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_generate_chave {
        export namespace docs {}

        export interface Options {
          args?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_generate_chave.Args;
          options: fns.Function._Tweeks.funct_generate_chave.Options;
          returns: fns.Function._Tweeks.funct_generate_chave.Returns;
          returnsType: fns.Function._Tweeks.funct_generate_chave.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_caixa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_caixa.Args;
          options: fns.Function._Tweeks.funct_pos_reg_caixa.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_caixa.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_caixa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace main {
        export namespace docs {}

        export interface Options {
          function: tns.TypeOf<"regproc">;
          args: tns.TypeOf<"jsonb">;
          mode?: tns.TypeOf<"text">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.main.Args;
          options: fns.Function._Tweeks.main.Options;
          returns: fns.Function._Tweeks.main.Returns;
          returnsType: fns.Function._Tweeks.main.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_caixa_auth {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_caixa_auth.Args;
          options: fns.Function._Tweeks.funct_pos_load_caixa_auth.Options;
          returns: fns.Function._Tweeks.funct_pos_load_caixa_auth.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_caixa_auth.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __branch_uid {
        export namespace docs {}

        export interface Options {
          _espaco_uid?: tns.TypeOf<"uuid">;
          _colaborador_uid?: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__branch_uid.Args;
          options: fns.Function._Tweeks.__branch_uid.Options;
          returns: fns.Function._Tweeks.__branch_uid.Returns;
          returnsType: fns.Function._Tweeks.__branch_uid.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"uuid", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_estatistica_posto {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_estatistica_posto.Args;
          options: fns.Function._Tweeks.funct_report_estatistica_posto.Options;
          returns: fns.Function._Tweeks.funct_report_estatistica_posto.Returns;
          returnsType: fns.Function._Tweeks.funct_report_estatistica_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_taxa {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_taxa.Args;
          options: fns.Function._Tweeks.funct_reg_taxa.Options;
          returns: fns.Function._Tweeks.funct_reg_taxa.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_taxa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __get_branch {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__get_branch.Args;
          options: fns.Function._Tweeks.__get_branch.Options;
          returns: fns.Function._Tweeks.__get_branch.Returns;
          returnsType: fns.Function._Tweeks.__get_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.branch:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"uuid">];
      }

      export namespace funct_pos_load_conta_dia {
        export namespace docs {}

        export interface Options {
          filter?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_conta_dia.Args;
          options: fns.Function._Tweeks.funct_pos_load_conta_dia.Options;
          returns: fns.Function._Tweeks.funct_pos_load_conta_dia.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_conta_dia.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_colaborador {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_colaborador.Args;
          options: fns.Function._Tweeks.funct_load_colaborador.Options;
          returns: fns.Function._Tweeks.funct_load_colaborador.Returns;
          returnsType: fns.Function._Tweeks.funct_load_colaborador.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __conta_adjust {
        export namespace docs {}

        export interface Options {
          arg_conta_id?: tns.TypeOf<"uuid">;
          arg_cliente_id: tns.TypeOf<"uuid">;
          _const?: tns.TypeOf<"map.constant">;
        }

        export interface ReturnsType {
          conta_montantependente?: tns.TypedOf<"float8", Typed>;
          conta_pago?: tns.TypedOf<"bool", Typed>;
          conta_id?: tns.TypedOf<"uuid", Typed>;
          conta_pagamento?: tns.TypedOf<"int2", Typed>;
          conta_montanteamortizado?: tns.TypedOf<"float8", Typed>;
          conta_montante?: tns.TypedOf<"float8", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__conta_adjust.Args;
          options: fns.Function._Tweeks.__conta_adjust.Options;
          returns: fns.Function._Tweeks.__conta_adjust.Returns;
          returnsType: fns.Function._Tweeks.__conta_adjust.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_espaco {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_espaco.Args;
          options: fns.Function._Tweeks.funct_reg_espaco.Options;
          returns: fns.Function._Tweeks.funct_reg_espaco.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_mesa {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_mesa.Args;
          options: fns.Function._Tweeks.funct_load_mesa.Options;
          returns: fns.Function._Tweeks.funct_load_mesa.Returns;
          returnsType: fns.Function._Tweeks.funct_load_mesa.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_guia_code {
        export namespace docs {}

        export interface Options {
          toperacao_id: tns.TypeOf<"int4">;
          _branch: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_guia_code.Args;
          options: fns.Function._Tweeks.__generate_guia_code.Options;
          returns: fns.Function._Tweeks.__generate_guia_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_guia_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace ___override_auth_funct_load_menu {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.___override_auth_funct_load_menu.Args;
          options: fns.Function._Tweeks.___override_auth_funct_load_menu.Options;
          returns: fns.Function._Tweeks.___override_auth_funct_load_menu.Returns;
          returnsType: fns.Function._Tweeks.___override_auth_funct_load_menu.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_retalho_code {
        export namespace docs {}

        export interface Options {
          brc: tns.TypeOf<"uuid">;
          space_brc?: tns.TypeOf<"uuid">;
          user_brc?: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_retalho_code.Args;
          options: fns.Function._Tweeks.__generate_retalho_code.Options;
          returns: fns.Function._Tweeks.__generate_retalho_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_retalho_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __sets_generate_documento {
        export namespace docs {}

        export interface Options {
          arg_espaco_auth: tns.TypeOf<"uuid">;
          arg_serie_id?: tns.TypeOf<"uuid">;
          arg_tserie: tns.TypeOf<"int4">;
        }

        export interface ReturnsType {
          serie_numcertificacao?: tns.TypedOf<"varchar", Typed>;
          document?: tns.TypedOf<"varchar", Typed>;
          serie_numero?: tns.TypedOf<"varchar", Typed>;
          autorizacao_uid?: tns.TypedOf<"uuid", Typed>;
          serie_numatorizacao?: tns.TypedOf<"varchar", Typed>;
          serie_id?: tns.TypedOf<"uuid", Typed>;
          autorizacao_numero?: tns.TypedOf<"varchar", Typed>;
          autorizacao_ano?: tns.TypedOf<"int4", Typed>;
          serie_quantidade?: tns.TypedOf<"int8", Typed>;
          serie_sequencia?: tns.TypedOf<"int8", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__sets_generate_documento.Args;
          options: fns.Function._Tweeks.__sets_generate_documento.Options;
          returns: fns.Function._Tweeks.__sets_generate_documento.Returns;
          returnsType: fns.Function._Tweeks.__sets_generate_documento.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_branch_by_espaco {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks._get_branch_by_espaco.Args;
          options: fns.Function._Tweeks._get_branch_by_espaco.Options;
          returns: fns.Function._Tweeks._get_branch_by_espaco.Returns;
          returnsType: fns.Function._Tweeks._get_branch_by_espaco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"cluster.branch:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [args1: tns.TypeOf<"uuid">];
      }

      export namespace funct_report_venda_conta {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_venda_conta.Args;
          options: fns.Function._Tweeks.funct_report_venda_conta.Options;
          returns: fns.Function._Tweeks.funct_report_venda_conta.Returns;
          returnsType: fns.Function._Tweeks.funct_report_venda_conta.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace viewargs_show {
        export namespace docs {}

        export interface Options {}

        export interface ReturnsType {
          key?: tns.TypedOf<"text", Typed>;
          param?: tns.TypedOf<"text", Typed>;
          text?: tns.TypedOf<"text", Typed>;
          value?: tns.TypedOf<"jsonb", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.viewargs_show.Args;
          options: fns.Function._Tweeks.viewargs_show.Options;
          returns: fns.Function._Tweeks.viewargs_show.Returns;
          returnsType: fns.Function._Tweeks.viewargs_show.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_reg_retalho {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_reg_retalho.Args;
          options: fns.Function._Tweeks.funct_pos_reg_retalho.Options;
          returns: fns.Function._Tweeks.funct_pos_reg_retalho.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_reg_retalho.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_imposto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_imposto.Args;
          options: fns.Function._Tweeks.funct_reg_imposto.Options;
          returns: fns.Function._Tweeks.funct_reg_imposto.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_imposto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_fluxo_on_entrada {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_fluxo_on_entrada.Args;
          options: fns.Function._Tweeks.__tg_fluxo_on_entrada.Options;
          returns: fns.Function._Tweeks.__tg_fluxo_on_entrada.Returns;
          returnsType: fns.Function._Tweeks.__tg_fluxo_on_entrada.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_fluxo_on_acerto {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_fluxo_on_acerto.Args;
          options: fns.Function._Tweeks.__tg_fluxo_on_acerto.Options;
          returns: fns.Function._Tweeks.__tg_fluxo_on_acerto.Returns;
          returnsType: fns.Function._Tweeks.__tg_fluxo_on_acerto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_transacao_movimentacao_posto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Args;
          options: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Options;
          returns: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_sets_autorizacao {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_sets_autorizacao.Args;
          options: fns.Function._Tweeks.funct_sets_autorizacao.Options;
          returns: fns.Function._Tweeks.funct_sets_autorizacao.Returns;
          returnsType: fns.Function._Tweeks.funct_sets_autorizacao.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_cambio {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_cambio.Args;
          options: fns.Function._Tweeks.funct_reg_cambio.Options;
          returns: fns.Function._Tweeks.funct_reg_cambio.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_cambio.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace _get_posto {
        export namespace docs {}

        export interface Options {
          arg_posto_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks._get_posto.Args;
          options: fns.Function._Tweeks._get_posto.Options;
          returns: fns.Function._Tweeks._get_posto.Returns;
          returnsType: fns.Function._Tweeks._get_posto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"tweeks.posto:Props", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_acerto {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          espaco_nome?: tns.TypedOf<"varchar", Typed>;
          acerto_diferenca?: tns.TypedOf<"float8", Typed>;
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          artigo_codigo?: tns.TypedOf<"varchar", Typed>;
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          acerto_quantidadeinicial?: tns.TypedOf<"float8", Typed>;
          acerto_id?: tns.TypedOf<"uuid", Typed>;
          acerto_observacao?: tns.TypedOf<"varchar", Typed>;
          acerto_quantidade?: tns.TypedOf<"float8", Typed>;
          acerto_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          artigo_nome?: tns.TypedOf<"varchar", Typed>;
          acerto_estado?: tns.TypedOf<"int2", Typed>;
          acerto_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_acerto.Args;
          options: fns.Function._Tweeks.funct_load_acerto.Options;
          returns: fns.Function._Tweeks.funct_load_acerto.Returns;
          returnsType: fns.Function._Tweeks.funct_load_acerto.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_venda_before_sets {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_venda_before_sets.Args;
          options: fns.Function._Tweeks.__tg_venda_before_sets.Options;
          returns: fns.Function._Tweeks.__tg_venda_before_sets.Returns;
          returnsType: fns.Function._Tweeks.__tg_venda_before_sets.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __tg_create_lancamento {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__tg_create_lancamento.Args;
          options: fns.Function._Tweeks.__tg_create_lancamento.Options;
          returns: fns.Function._Tweeks.__tg_create_lancamento.Returns;
          returnsType: fns.Function._Tweeks.__tg_create_lancamento.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"trigger", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_report_parametrized_filter {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_report_parametrized_filter.Args;
          options: fns.Function._Tweeks.funct_load_report_parametrized_filter.Options;
          returns: fns.Function._Tweeks.funct_load_report_parametrized_filter.Returns;
          returnsType: fns.Function._Tweeks.funct_load_report_parametrized_filter.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_cliente {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_cliente.Args;
          options: fns.Function._Tweeks.funct_load_cliente.Options;
          returns: fns.Function._Tweeks.funct_load_cliente.Returns;
          returnsType: fns.Function._Tweeks.funct_load_cliente.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"json", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_cambio_ativo {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_cambio_ativo.Args;
          options: fns.Function._Tweeks.funct_load_cambio_ativo.Options;
          returns: fns.Function._Tweeks.funct_load_cambio_ativo.Returns;
          returnsType: fns.Function._Tweeks.funct_load_cambio_ativo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __lote {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          espaco_id?: tns.TypedOf<"uuid", Typed>;
          lote_refuid?: tns.TypedOf<"uuid", Typed>;
          lote_entrada?: tns.TypedOf<"float8", Typed>;
          artigo_id?: tns.TypedOf<"uuid", Typed>;
          lote_numero?: tns.TypedOf<"varchar", Typed>;
          lote_refclass?: tns.TypedOf<"varchar", Typed>;
          lote_ref?: tns.TypedOf<"jsonb", Typed>;
          lote_saida?: tns.TypedOf<"float8", Typed>;
          lote_validade?: tns.TypedOf<"date", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__lote.Args;
          options: fns.Function._Tweeks.__lote.Options;
          returns: fns.Function._Tweeks.__lote.Returns;
          returnsType: fns.Function._Tweeks.__lote.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_change_conta_proforma {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_change_conta_proforma.Args;
          options: fns.Function._Tweeks.funct_pos_change_conta_proforma.Options;
          returns: fns.Function._Tweeks.funct_pos_change_conta_proforma.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_change_conta_proforma.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_espaco_migrate {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_espaco_migrate.Args;
          options: fns.Function._Tweeks.funct_change_espaco_migrate.Options;
          returns: fns.Function._Tweeks.funct_change_espaco_migrate.Returns;
          returnsType: fns.Function._Tweeks.funct_change_espaco_migrate.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_notacredito {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_notacredito.Args;
          options: fns.Function._Tweeks.funct_load_conta_notacredito.Options;
          returns: fns.Function._Tweeks.funct_load_conta_notacredito.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_notacredito.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_stoks {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_stoks.Args;
          options: fns.Function._Tweeks.funct_load_stoks.Options;
          returns: fns.Function._Tweeks.funct_load_stoks.Returns;
          returnsType: fns.Function._Tweeks.funct_load_stoks.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_branch {
        export namespace docs {}

        export interface Options {
          args?: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_branch.Args;
          options: fns.Function._Tweeks.funct_load_branch.Options;
          returns: fns.Function._Tweeks.funct_load_branch.Returns;
          returnsType: fns.Function._Tweeks.funct_load_branch.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_serie_distribuicao_pos {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Args;
          options: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Options;
          returns: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Returns;
          returnsType: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_change_caixa_close {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_change_caixa_close.Args;
          options: fns.Function._Tweeks.funct_pos_change_caixa_close.Options;
          returns: fns.Function._Tweeks.funct_pos_change_caixa_close.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_change_caixa_close.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.res", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace sets_tipoimposto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.sets_tipoimposto.Args;
          options: fns.Function._Tweeks.sets_tipoimposto.Options;
          returns: fns.Function._Tweeks.sets_tipoimposto.Returns;
          returnsType: fns.Function._Tweeks.sets_tipoimposto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace __sync_branch_map {
        export namespace docs {}

        export interface Options {}

        export interface Properties {
          args: fns.Function._Tweeks.__sync_branch_map.Args;
          options: fns.Function._Tweeks.__sync_branch_map.Options;
          returns: fns.Function._Tweeks.__sync_branch_map.Returns;
          returnsType: fns.Function._Tweeks.__sync_branch_map.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"text", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __generate_artigo_code {
        export namespace docs {}

        export interface Options {
          arg_classe_id: tns.TypeOf<"uuid">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__generate_artigo_code.Args;
          options: fns.Function._Tweeks.__generate_artigo_code.Options;
          returns: fns.Function._Tweeks.__generate_artigo_code.Returns;
          returnsType: fns.Function._Tweeks.__generate_artigo_code.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"varchar", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_estatistica_venda {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_estatistica_venda.Args;
          options: fns.Function._Tweeks.funct_report_estatistica_venda.Options;
          returns: fns.Function._Tweeks.funct_report_estatistica_venda.Returns;
          returnsType: fns.Function._Tweeks.funct_report_estatistica_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_link_tecla {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_link_tecla.Args;
          options: fns.Function._Tweeks.funct_reg_link_tecla.Options;
          returns: fns.Function._Tweeks.funct_reg_link_tecla.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_link_tecla.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_reg_acerto {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_reg_acerto.Args;
          options: fns.Function._Tweeks.funct_reg_acerto.Options;
          returns: fns.Function._Tweeks.funct_reg_acerto.Returns;
          returnsType: fns.Function._Tweeks.funct_reg_acerto.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_posto_by_endereco {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_posto_by_endereco.Args;
          options: fns.Function._Tweeks.funct_load_posto_by_endereco.Options;
          returns: fns.Function._Tweeks.funct_load_posto_by_endereco.Returns;
          returnsType: fns.Function._Tweeks.funct_load_posto_by_endereco.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_preparacao {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface ReturnsType {
          mesa_lotacao?: tns.TypedOf<"int2", Typed>;
          conta_data?: tns.TypedOf<"date", Typed>;
          currency_code?: tns.TypedOf<"varchar", Typed>;
          conta_dataatualizacao?: tns.TypedOf<"timestamptz", Typed>;
          conta_numero?: tns.TypedOf<"int4", Typed>;
          mesa_id?: tns.TypedOf<"uuid", Typed>;
          conta_estado?: tns.TypedOf<"int2", Typed>;
          colaborador_id?: tns.TypedOf<"uuid", Typed>;
          conta_imprensa?: tns.TypedOf<"int2", Typed>;
          conta_numerofatura?: tns.TypedOf<"varchar", Typed>;
          conta_titularnif?: tns.TypedOf<"varchar", Typed>;
          conta_montante?: tns.TypedOf<"float8", Typed>;
          tpaga_id?: tns.TypedOf<"int2", Typed>;
          conta_dataregistro?: tns.TypedOf<"timestamptz", Typed>;
          conta_titular?: tns.TypedOf<"varchar", Typed>;
          mesa_designacao?: tns.TypedOf<"varchar", Typed>;
          colaborador_nome?: tns.TypedOf<"varchar", Typed>;
          currency_id?: tns.TypedOf<"int2", Typed>;
          colaborador_apelido?: tns.TypedOf<"varchar", Typed>;
          mesa_numero?: tns.TypedOf<"varchar", Typed>;
          vendas?: tns.TypedOf<"jsonb", Typed>;
          currency_name?: tns.TypedOf<"varchar", Typed>;
          conta_montanteamortizado?: tns.TypedOf<"float8", Typed>;
          tpaga_designacao?: tns.TypedOf<"varchar", Typed>;
          conta_id?: tns.TypedOf<"uuid", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_preparacao.Args;
          options: fns.Function._Tweeks.funct_load_conta_preparacao.Options;
          returns: fns.Function._Tweeks.funct_load_conta_preparacao.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_preparacao.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_artigo {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_artigo.Args;
          options: fns.Function._Tweeks.funct_pos_load_artigo.Options;
          returns: fns.Function._Tweeks.funct_pos_load_artigo.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_artigo.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_pos_load_class {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_pos_load_class.Args;
          options: fns.Function._Tweeks.funct_pos_load_class.Options;
          returns: fns.Function._Tweeks.funct_pos_load_class.Returns;
          returnsType: fns.Function._Tweeks.funct_pos_load_class.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_change_tipoimposto_estado {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_change_tipoimposto_estado.Args;
          options: fns.Function._Tweeks.funct_change_tipoimposto_estado.Options;
          returns: fns.Function._Tweeks.funct_change_tipoimposto_estado.Returns;
          returnsType: fns.Function._Tweeks.funct_change_tipoimposto_estado.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"lib.result", Typed>;
        export type Returns = ReturnsType;
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_artigo_associar {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_artigo_associar.Args;
          options: fns.Function._Tweeks.funct_load_artigo_associar.Options;
          returns: fns.Function._Tweeks.funct_load_artigo_associar.Returns;
          returnsType: fns.Function._Tweeks.funct_load_artigo_associar.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace __fluxo_scan {
        export namespace docs {}

        export interface Options {
          _artigo_id?: tns.TypeOf<"uuid">;
          _resume?: tns.TypeOf<"bool">;
          _branch?: tns.TypeOf<"uuid">;
          _espaco_id?: tns.TypeOf<"uuid">;
        }

        export interface ReturnsType {
          fluxo_preview?: tns.TypedOf<"float8", Typed>;
          fluxo_checkmarks?: tns.TypedOf<"uuid", Typed>;
          fluxo_resultado?: tns.TypedOf<"float8", Typed>;
          fluxo_id?: tns.TypedOf<"uuid", Typed>;
          fluxo_end?: tns.TypedOf<"int8", Typed>;
          fluxo_calc?: tns.TypedOf<"float8", Typed>;
          fluxo_sequencia?: tns.TypedOf<"int8", Typed>;
          fluxo_artigo_id?: tns.TypedOf<"uuid", Typed>;
          fluxo_quantidade?: tns.TypedOf<"float8", Typed>;
          fluxo_debito?: tns.TypedOf<"float8", Typed>;
          fluxo_check?: tns.TypedOf<"float8", Typed>;
          fluxo_order?: tns.TypedOf<"int8", Typed>;
          fluxo_espaco_id?: tns.TypedOf<"uuid", Typed>;
          fluxo_credito?: tns.TypedOf<"float8", Typed>;
          fluxo_date?: tns.TypedOf<"timestamptz", Typed>;
          fluxo_resume?: tns.TypedOf<"bool", Typed>;
        }

        export interface Properties {
          args: fns.Function._Tweeks.__fluxo_scan.Args;
          options: fns.Function._Tweeks.__fluxo_scan.Options;
          returns: fns.Function._Tweeks.__fluxo_scan.Returns;
          returnsType: fns.Function._Tweeks.__fluxo_scan.ReturnsType;
        }

        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_load_conta_documento_limit {
        export namespace docs {}

        export interface Options {
          args: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_load_conta_documento_limit.Args;
          options: fns.Function._Tweeks.funct_load_conta_documento_limit.Options;
          returns: fns.Function._Tweeks.funct_load_conta_documento_limit.Returns;
          returnsType: fns.Function._Tweeks.funct_load_conta_documento_limit.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }

      export namespace funct_report_venda {
        export namespace docs {}

        export interface Options {
          filter: tns.TypeOf<"jsonb">;
        }

        export interface Properties {
          args: fns.Function._Tweeks.funct_report_venda.Args;
          options: fns.Function._Tweeks.funct_report_venda.Options;
          returns: fns.Function._Tweeks.funct_report_venda.Returns;
          returnsType: fns.Function._Tweeks.funct_report_venda.ReturnsType;
        }

        export type ReturnsType = tns.TypedOf<"jsonb", Typed>;
        export type Returns = ReturnsType[];
        export type Typed = any;
        export type Args = [];
      }
    }
  }
}

export default fns;
