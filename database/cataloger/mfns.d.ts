import { db } from "kitres";
import tns from "./tns";
import fns from "./fns";

namespace mfns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export interface FunctionRefsMap {
    "cluster.__user_map"(
      opts?: fns.Function._Cluster.__user_map.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__user_map.Returns,
      fns.Function._Cluster.__user_map.ReturnsType,
      void
    >;
    "cluster.__user_map"(
      opts?: fns.Function._Cluster.__user_map.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__user_map.Returns,
        fns.Function._Cluster.__user_map.ReturnsType
      >,
    ): void;
    "cluster.__tg_share_guard_upgrade"(
      opts?: fns.Function._Cluster.__tg_share_guard_upgrade.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_share_guard_upgrade.Returns,
      fns.Function._Cluster.__tg_share_guard_upgrade.ReturnsType,
      void
    >;
    "cluster.__tg_share_guard_upgrade"(
      opts?: fns.Function._Cluster.__tg_share_guard_upgrade.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_share_guard_upgrade.Returns,
        fns.Function._Cluster.__tg_share_guard_upgrade.ReturnsType
      >,
    ): void;
    "auth.funct_reg_privilegio"(
      opts?: fns.Function._Auth.funct_reg_privilegio.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_reg_privilegio.Returns,
      fns.Function._Auth.funct_reg_privilegio.ReturnsType,
      void
    >;
    "auth.funct_reg_privilegio"(
      opts?: fns.Function._Auth.funct_reg_privilegio.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_reg_privilegio.Returns,
        fns.Function._Auth.funct_reg_privilegio.ReturnsType
      >,
    ): void;
    "auth.funct_change_perfil"(
      opts?: fns.Function._Auth.funct_change_perfil.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_perfil.Returns,
      fns.Function._Auth.funct_change_perfil.ReturnsType,
      void
    >;
    "auth.funct_change_perfil"(
      opts?: fns.Function._Auth.funct_change_perfil.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_perfil.Returns,
        fns.Function._Auth.funct_change_perfil.ReturnsType
      >,
    ): void;
    "cluster.__pull"(
      opts?: fns.Function._Cluster.__pull.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__pull.Returns,
      fns.Function._Cluster.__pull.ReturnsType,
      void
    >;
    "cluster.__pull"(
      opts?: fns.Function._Cluster.__pull.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__pull.Returns,
        fns.Function._Cluster.__pull.ReturnsType
      >,
    ): void;
    "libdom.domsync"(
      opts?: fns.Function._Libdom.domsync.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.domsync.Returns,
      fns.Function._Libdom.domsync.ReturnsType,
      void
    >;
    "libdom.domsync"(
      opts?: fns.Function._Libdom.domsync.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.domsync.Returns,
        fns.Function._Libdom.domsync.ReturnsType
      >,
    ): void;
    "auth._menu_load_structure"(
      opts?: fns.Function._Auth._menu_load_structure.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._menu_load_structure.Returns,
      fns.Function._Auth._menu_load_structure.ReturnsType,
      void
    >;
    "auth._menu_load_structure"(
      opts?: fns.Function._Auth._menu_load_structure.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._menu_load_structure.Returns,
        fns.Function._Auth._menu_load_structure.ReturnsType
      >,
    ): void;
    "cluster.object_filter"(
      opts?: fns.Function._Cluster.object_filter.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.object_filter.Returns,
      fns.Function._Cluster.object_filter.ReturnsType,
      void
    >;
    "cluster.object_filter"(
      opts?: fns.Function._Cluster.object_filter.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.object_filter.Returns,
        fns.Function._Cluster.object_filter.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador_all_menu"(
      opts?: fns.Function._Auth.funct_load_colaborador_all_menu.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador_all_menu.Returns,
      fns.Function._Auth.funct_load_colaborador_all_menu.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador_all_menu"(
      opts?: fns.Function._Auth.funct_load_colaborador_all_menu.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador_all_menu.Returns,
        fns.Function._Auth.funct_load_colaborador_all_menu.ReturnsType
      >,
    ): void;
    "auth._get_perfil"(
      opts?: fns.Function._Auth._get_perfil.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._get_perfil.Returns,
      fns.Function._Auth._get_perfil.ReturnsType,
      void
    >;
    "auth._get_perfil"(
      opts?: fns.Function._Auth._get_perfil.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._get_perfil.Returns,
        fns.Function._Auth._get_perfil.ReturnsType
      >,
    ): void;
    "cluster.create_resource"(
      opts?: fns.Function._Cluster.create_resource.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.create_resource.Returns,
      fns.Function._Cluster.create_resource.ReturnsType,
      void
    >;
    "cluster.create_resource"(
      opts?: fns.Function._Cluster.create_resource.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.create_resource.Returns,
        fns.Function._Cluster.create_resource.ReturnsType
      >,
    ): void;
    "cluster.__tg_share_truncate"(
      opts?: fns.Function._Cluster.__tg_share_truncate.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_share_truncate.Returns,
      fns.Function._Cluster.__tg_share_truncate.ReturnsType,
      void
    >;
    "cluster.__tg_share_truncate"(
      opts?: fns.Function._Cluster.__tg_share_truncate.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_share_truncate.Returns,
        fns.Function._Cluster.__tg_share_truncate.ReturnsType
      >,
    ): void;
    "auth._colaborador_accesso_desc"(
      opts?: fns.Function._Auth._colaborador_accesso_desc.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._colaborador_accesso_desc.Returns,
      fns.Function._Auth._colaborador_accesso_desc.ReturnsType,
      void
    >;
    "auth._colaborador_accesso_desc"(
      opts?: fns.Function._Auth._colaborador_accesso_desc.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._colaborador_accesso_desc.Returns,
        fns.Function._Auth._colaborador_accesso_desc.ReturnsType
      >,
    ): void;
    "cluster.reduce"(
      args: Function._Cluster.reduce.Args,
      opts?: fns.Function._Cluster.reduce.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.reduce.Returns,
      fns.Function._Cluster.reduce.ReturnsType,
      void
    >;
    "cluster.reduce"(
      args: Function._Cluster.reduce.Args,
      opts?: fns.Function._Cluster.reduce.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.reduce.Returns,
        fns.Function._Cluster.reduce.ReturnsType
      >,
    ): void;
    "cluster.sets_resources_downloaded"(
      opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._Sets_Resources_Downloaded_16619.Returns,
      fns.Function._Cluster._Sets_Resources_Downloaded_16619.ReturnsType,
      void
    >;
    "cluster.sets_resources_downloaded"(
      opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._Sets_Resources_Downloaded_16619.Returns,
        fns.Function._Cluster._Sets_Resources_Downloaded_16619.ReturnsType
      >,
    ): void;
    "cluster.load_resources_pendents"(
      opts?: fns.Function._Cluster.load_resources_pendents.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_resources_pendents.Returns,
      fns.Function._Cluster.load_resources_pendents.ReturnsType,
      void
    >;
    "cluster.load_resources_pendents"(
      opts?: fns.Function._Cluster.load_resources_pendents.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_resources_pendents.Returns,
        fns.Function._Cluster.load_resources_pendents.ReturnsType
      >,
    ): void;
    "cluster.load_clusters_configs_to_child"(
      opts?: fns.Function._Cluster.load_clusters_configs_to_child.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_clusters_configs_to_child.Returns,
      fns.Function._Cluster.load_clusters_configs_to_child.ReturnsType,
      void
    >;
    "cluster.load_clusters_configs_to_child"(
      opts?: fns.Function._Cluster.load_clusters_configs_to_child.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_clusters_configs_to_child.Returns,
        fns.Function._Cluster.load_clusters_configs_to_child.ReturnsType
      >,
    ): void;
    "auth.funct_load_menu"(
      opts?: fns.Function._Auth.funct_load_menu.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_menu.Returns,
      fns.Function._Auth.funct_load_menu.ReturnsType,
      void
    >;
    "auth.funct_load_menu"(
      opts?: fns.Function._Auth.funct_load_menu.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_menu.Returns,
        fns.Function._Auth.funct_load_menu.ReturnsType
      >,
    ): void;
    "libdom.entry_drop"(
      opts?: fns.Function._Libdom.entry_drop.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.entry_drop.Returns,
      fns.Function._Libdom.entry_drop.ReturnsType,
      void
    >;
    "libdom.entry_drop"(
      opts?: fns.Function._Libdom.entry_drop.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.entry_drop.Returns,
        fns.Function._Libdom.entry_drop.ReturnsType
      >,
    ): void;
    "cluster.push"(
      opts?: fns.Function._Cluster.push.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.push.Returns,
      fns.Function._Cluster.push.ReturnsType,
      void
    >;
    "cluster.push"(
      opts?: fns.Function._Cluster.push.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.push.Returns,
        fns.Function._Cluster.push.ReturnsType
      >,
    ): void;
    "libdom.sync_drop"(
      opts?: fns.Function._Libdom.sync_drop.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.sync_drop.Returns,
      fns.Function._Libdom.sync_drop.ReturnsType,
      void
    >;
    "libdom.sync_drop"(
      opts?: fns.Function._Libdom.sync_drop.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.sync_drop.Returns,
        fns.Function._Libdom.sync_drop.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador"(
      opts?: fns.Function._Auth.funct_change_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador.Returns,
      fns.Function._Auth.funct_change_colaborador.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador"(
      opts?: fns.Function._Auth.funct_change_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador.Returns,
        fns.Function._Auth.funct_change_colaborador.ReturnsType
      >,
    ): void;
    "auth.funct_autenticacao_logoff"(
      opts?: fns.Function._Auth.funct_autenticacao_logoff.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_autenticacao_logoff.Returns,
      fns.Function._Auth.funct_autenticacao_logoff.ReturnsType,
      void
    >;
    "auth.funct_autenticacao_logoff"(
      opts?: fns.Function._Auth.funct_autenticacao_logoff.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_autenticacao_logoff.Returns,
        fns.Function._Auth.funct_autenticacao_logoff.ReturnsType
      >,
    ): void;
    "cluster.__tg_version_commit"(
      opts?: fns.Function._Cluster.__tg_version_commit.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_version_commit.Returns,
      fns.Function._Cluster.__tg_version_commit.ReturnsType,
      void
    >;
    "cluster.__tg_version_commit"(
      opts?: fns.Function._Cluster.__tg_version_commit.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_version_commit.Returns,
        fns.Function._Cluster.__tg_version_commit.ReturnsType
      >,
    ): void;
    "cluster.__format"(
      args: Function._Cluster.__format.Args,
      opts?: fns.Function._Cluster.__format.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__format.Returns,
      fns.Function._Cluster.__format.ReturnsType,
      void
    >;
    "cluster.__format"(
      args: Function._Cluster.__format.Args,
      opts?: fns.Function._Cluster.__format.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__format.Returns,
        fns.Function._Cluster.__format.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_token_ativate"(
      opts?: fns.Function._Auth.funct_change_colaborador_token_ativate.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_token_ativate.Returns,
      fns.Function._Auth.funct_change_colaborador_token_ativate.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_token_ativate"(
      opts?: fns.Function._Auth.funct_change_colaborador_token_ativate.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_token_ativate.Returns,
        fns.Function._Auth.funct_change_colaborador_token_ativate.ReturnsType
      >,
    ): void;
    "cluster.__get"(
      args: Function._Cluster.__get.Args,
      opts?: fns.Function._Cluster.__get.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__get.Returns,
      fns.Function._Cluster.__get.ReturnsType,
      void
    >;
    "cluster.__get"(
      args: Function._Cluster.__get.Args,
      opts?: fns.Function._Cluster.__get.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__get.Returns,
        fns.Function._Cluster.__get.ReturnsType
      >,
    ): void;
    "cluster.__tg_before_create_filter"(
      opts?: fns.Function._Cluster.__tg_before_create_filter.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_before_create_filter.Returns,
      fns.Function._Cluster.__tg_before_create_filter.ReturnsType,
      void
    >;
    "cluster.__tg_before_create_filter"(
      opts?: fns.Function._Cluster.__tg_before_create_filter.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_before_create_filter.Returns,
        fns.Function._Cluster.__tg_before_create_filter.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador"(
      opts?: fns.Function._Auth.funct_load_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador.Returns,
      fns.Function._Auth.funct_load_colaborador.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador"(
      opts?: fns.Function._Auth.funct_load_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador.Returns,
        fns.Function._Auth.funct_load_colaborador.ReturnsType
      >,
    ): void;
    "libdom.get"(
      opts?: fns.Function._Libdom._get.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom._get.Returns,
      fns.Function._Libdom._get.ReturnsType,
      void
    >;
    "libdom.get"(
      opts?: fns.Function._Libdom._get.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom._get.Returns,
        fns.Function._Libdom._get.ReturnsType
      >,
    ): void;
    "cluster.__create_api"(
      opts?: fns.Function._Cluster.__create_api.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__create_api.Returns,
      fns.Function._Cluster.__create_api.ReturnsType,
      void
    >;
    "cluster.__create_api"(
      opts?: fns.Function._Cluster.__create_api.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__create_api.Returns,
        fns.Function._Cluster.__create_api.ReturnsType
      >,
    ): void;
    "auth._get_colaborador"(
      opts?: fns.Function._Auth._get_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._get_colaborador.Returns,
      fns.Function._Auth._get_colaborador.ReturnsType,
      void
    >;
    "auth._get_colaborador"(
      opts?: fns.Function._Auth._get_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._get_colaborador.Returns,
        fns.Function._Auth._get_colaborador.ReturnsType
      >,
    ): void;
    "libdom.domain_of"(
      opts?: fns.Function._Libdom._Domain_Of_16734.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom._Domain_Of_16734.Returns,
      fns.Function._Libdom._Domain_Of_16734.ReturnsType,
      void
    >;
    "libdom.domain_of"(
      opts?: fns.Function._Libdom._Domain_Of_16734.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom._Domain_Of_16734.Returns,
        fns.Function._Libdom._Domain_Of_16734.ReturnsType
      >,
    ): void;
    "cluster.__rows"(
      args: Function._Cluster.__rows.Args,
      opts?: fns.Function._Cluster.__rows.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__rows.Returns,
      fns.Function._Cluster.__rows.ReturnsType,
      void
    >;
    "cluster.__rows"(
      args: Function._Cluster.__rows.Args,
      opts?: fns.Function._Cluster.__rows.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__rows.Returns,
        fns.Function._Cluster.__rows.ReturnsType
      >,
    ): void;
    "cluster.__tg_version_add_when_update"(
      opts?: fns.Function._Cluster.__tg_version_add_when_update.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_version_add_when_update.Returns,
      fns.Function._Cluster.__tg_version_add_when_update.ReturnsType,
      void
    >;
    "cluster.__tg_version_add_when_update"(
      opts?: fns.Function._Cluster.__tg_version_add_when_update.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_version_add_when_update.Returns,
        fns.Function._Cluster.__tg_version_add_when_update.ReturnsType
      >,
    ): void;
    "cluster.load_clusters"(
      opts?: fns.Function._Cluster.load_clusters.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_clusters.Returns,
      fns.Function._Cluster.load_clusters.ReturnsType,
      void
    >;
    "cluster.load_clusters"(
      opts?: fns.Function._Cluster.load_clusters.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_clusters.Returns,
        fns.Function._Cluster.load_clusters.ReturnsType
      >,
    ): void;
    "libdom.entry"(
      opts?: fns.Function._Libdom.entry.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.entry.Returns,
      fns.Function._Libdom.entry.ReturnsType,
      void
    >;
    "libdom.entry"(
      opts?: fns.Function._Libdom.entry.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.entry.Returns,
        fns.Function._Libdom.entry.ReturnsType
      >,
    ): void;
    "libdom.trigger_sync_domsync"(
      opts?: fns.Function._Libdom.trigger_sync_domsync.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.trigger_sync_domsync.Returns,
      fns.Function._Libdom.trigger_sync_domsync.ReturnsType,
      void
    >;
    "libdom.trigger_sync_domsync"(
      opts?: fns.Function._Libdom.trigger_sync_domsync.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.trigger_sync_domsync.Returns,
        fns.Function._Libdom.trigger_sync_domsync.ReturnsType
      >,
    ): void;
    "cluster.funct_load_configs"(
      opts?: fns.Function._Cluster.funct_load_configs.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.funct_load_configs.Returns,
      fns.Function._Cluster.funct_load_configs.ReturnsType,
      void
    >;
    "cluster.funct_load_configs"(
      opts?: fns.Function._Cluster.funct_load_configs.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.funct_load_configs.Returns,
        fns.Function._Cluster.funct_load_configs.ReturnsType
      >,
    ): void;
    "cluster.__add"(
      opts?: fns.Function._Cluster.__add.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__add.Returns,
      fns.Function._Cluster.__add.ReturnsType,
      void
    >;
    "cluster.__add"(
      opts?: fns.Function._Cluster.__add.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__add.Returns,
        fns.Function._Cluster.__add.ReturnsType
      >,
    ): void;
    "cluster.pull"(
      opts?: fns.Function._Cluster.pull.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.pull.Returns,
      fns.Function._Cluster.pull.ReturnsType,
      void
    >;
    "cluster.pull"(
      opts?: fns.Function._Cluster.pull.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.pull.Returns,
        fns.Function._Cluster.pull.ReturnsType
      >,
    ): void;
    "auth._autenticacao_chave_generate"(
      opts?: fns.Function._Auth._autenticacao_chave_generate.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._autenticacao_chave_generate.Returns,
      fns.Function._Auth._autenticacao_chave_generate.ReturnsType,
      void
    >;
    "auth._autenticacao_chave_generate"(
      opts?: fns.Function._Auth._autenticacao_chave_generate.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._autenticacao_chave_generate.Returns,
        fns.Function._Auth._autenticacao_chave_generate.ReturnsType
      >,
    ): void;
    "auth._colaborador_estado_desc"(
      opts?: fns.Function._Auth._colaborador_estado_desc.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._colaborador_estado_desc.Returns,
      fns.Function._Auth._colaborador_estado_desc.ReturnsType,
      void
    >;
    "auth._colaborador_estado_desc"(
      opts?: fns.Function._Auth._colaborador_estado_desc.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._colaborador_estado_desc.Returns,
        fns.Function._Auth._colaborador_estado_desc.ReturnsType
      >,
    ): void;
    "cluster.__format_proc"(
      args: Function._Cluster.__format_proc.Args,
      opts?: fns.Function._Cluster.__format_proc.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__format_proc.Returns,
      fns.Function._Cluster.__format_proc.ReturnsType,
      void
    >;
    "cluster.__format_proc"(
      args: Function._Cluster.__format_proc.Args,
      opts?: fns.Function._Cluster.__format_proc.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__format_proc.Returns,
        fns.Function._Cluster.__format_proc.ReturnsType
      >,
    ): void;
    "libdom.rebuild"(
      opts?: fns.Function._Libdom.rebuild.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.rebuild.Returns,
      fns.Function._Libdom.rebuild.ReturnsType,
      void
    >;
    "libdom.rebuild"(
      opts?: fns.Function._Libdom.rebuild.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.rebuild.Returns,
        fns.Function._Libdom.rebuild.ReturnsType
      >,
    ): void;
    "cluster.__create_object_version"(
      args: Function._Cluster.__create_object_version.Args,
      opts?: fns.Function._Cluster.__create_object_version.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__create_object_version.Returns,
      fns.Function._Cluster.__create_object_version.ReturnsType,
      void
    >;
    "cluster.__create_object_version"(
      args: Function._Cluster.__create_object_version.Args,
      opts?: fns.Function._Cluster.__create_object_version.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__create_object_version.Returns,
        fns.Function._Cluster.__create_object_version.ReturnsType
      >,
    ): void;
    "cluster.status"(
      opts?: fns.Function._Cluster.status.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.status.Returns,
      fns.Function._Cluster.status.ReturnsType,
      void
    >;
    "cluster.status"(
      opts?: fns.Function._Cluster.status.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.status.Returns,
        fns.Function._Cluster.status.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_senha"(
      opts?: fns.Function._Auth.funct_change_colaborador_senha.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_senha.Returns,
      fns.Function._Auth.funct_change_colaborador_senha.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_senha"(
      opts?: fns.Function._Auth.funct_change_colaborador_senha.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_senha.Returns,
        fns.Function._Auth.funct_change_colaborador_senha.ReturnsType
      >,
    ): void;
    "auth._menu_create"(
      opts?: fns.Function._Auth._menu_create.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._menu_create.Returns,
      fns.Function._Auth._menu_create.ReturnsType,
      void
    >;
    "auth._menu_create"(
      opts?: fns.Function._Auth._menu_create.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._menu_create.Returns,
        fns.Function._Auth._menu_create.ReturnsType
      >,
    ): void;
    "auth.funct_load_grants"(
      opts?: fns.Function._Auth.funct_load_grants.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_grants.Returns,
      fns.Function._Auth.funct_load_grants.ReturnsType,
      void
    >;
    "auth.funct_load_grants"(
      opts?: fns.Function._Auth.funct_load_grants.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_grants.Returns,
        fns.Function._Auth.funct_load_grants.ReturnsType
      >,
    ): void;
    "libdom.api_change_entryset"(
      opts?: fns.Function._Libdom.api_change_entryset.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.api_change_entryset.Returns,
      fns.Function._Libdom.api_change_entryset.ReturnsType,
      void
    >;
    "libdom.api_change_entryset"(
      opts?: fns.Function._Libdom.api_change_entryset.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.api_change_entryset.Returns,
        fns.Function._Libdom.api_change_entryset.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_accesso_disable"(
      opts?: fns.Function._Auth.funct_change_colaborador_accesso_disable.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_accesso_disable.Returns,
      fns.Function._Auth.funct_change_colaborador_accesso_disable.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_accesso_disable"(
      opts?: fns.Function._Auth.funct_change_colaborador_accesso_disable.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_accesso_disable.Returns,
        fns.Function._Auth.funct_change_colaborador_accesso_disable.ReturnsType
      >,
    ): void;
    "auth.funct_reg_trabalha"(
      opts?: fns.Function._Auth.funct_reg_trabalha.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_reg_trabalha.Returns,
      fns.Function._Auth.funct_reg_trabalha.ReturnsType,
      void
    >;
    "auth.funct_reg_trabalha"(
      opts?: fns.Function._Auth.funct_reg_trabalha.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_reg_trabalha.Returns,
        fns.Function._Auth.funct_reg_trabalha.ReturnsType
      >,
    ): void;
    "cluster.load_clusters_local_as_remotes"(
      opts?: fns.Function._Cluster.load_clusters_local_as_remotes.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_clusters_local_as_remotes.Returns,
      fns.Function._Cluster.load_clusters_local_as_remotes.ReturnsType,
      void
    >;
    "cluster.load_clusters_local_as_remotes"(
      opts?: fns.Function._Cluster.load_clusters_local_as_remotes.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_clusters_local_as_remotes.Returns,
        fns.Function._Cluster.load_clusters_local_as_remotes.ReturnsType
      >,
    ): void;
    "libdom.columns"(
      args: Function._Libdom.columns.Args,
      opts?: fns.Function._Libdom.columns.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.columns.Returns,
      fns.Function._Libdom.columns.ReturnsType,
      void
    >;
    "libdom.columns"(
      args: Function._Libdom.columns.Args,
      opts?: fns.Function._Libdom.columns.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.columns.Returns,
        fns.Function._Libdom.columns.ReturnsType
      >,
    ): void;
    "libdom.api_load_entryset"(
      opts?: fns.Function._Libdom.api_load_entryset.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.api_load_entryset.Returns,
      fns.Function._Libdom.api_load_entryset.ReturnsType,
      void
    >;
    "libdom.api_load_entryset"(
      opts?: fns.Function._Libdom.api_load_entryset.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.api_load_entryset.Returns,
        fns.Function._Libdom.api_load_entryset.ReturnsType
      >,
    ): void;
    "libdom.constant"(
      opts?: fns.Function._Libdom.constant.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.constant.Returns,
      fns.Function._Libdom.constant.ReturnsType,
      void
    >;
    "libdom.constant"(
      opts?: fns.Function._Libdom.constant.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.constant.Returns,
        fns.Function._Libdom.constant.ReturnsType
      >,
    ): void;
    "cluster.declare_filter"(
      args: Function._Cluster.declare_filter.Args,
      opts?: fns.Function._Cluster.declare_filter.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.declare_filter.Returns,
      fns.Function._Cluster.declare_filter.ReturnsType,
      void
    >;
    "cluster.declare_filter"(
      args: Function._Cluster.declare_filter.Args,
      opts?: fns.Function._Cluster.declare_filter.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.declare_filter.Returns,
        fns.Function._Cluster.declare_filter.ReturnsType
      >,
    ): void;
    "auth._menu_create_set_up"(
      opts?: fns.Function._Auth._menu_create_set_up.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._menu_create_set_up.Returns,
      fns.Function._Auth._menu_create_set_up.ReturnsType,
      void
    >;
    "auth._menu_create_set_up"(
      opts?: fns.Function._Auth._menu_create_set_up.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._menu_create_set_up.Returns,
        fns.Function._Auth._menu_create_set_up.ReturnsType
      >,
    ): void;
    "cluster.__tg_version_add_when_insert"(
      opts?: fns.Function._Cluster.__tg_version_add_when_insert.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_version_add_when_insert.Returns,
      fns.Function._Cluster.__tg_version_add_when_insert.ReturnsType,
      void
    >;
    "cluster.__tg_version_add_when_insert"(
      opts?: fns.Function._Cluster.__tg_version_add_when_insert.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_version_add_when_insert.Returns,
        fns.Function._Cluster.__tg_version_add_when_insert.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador_simple"(
      opts?: fns.Function._Auth.funct_load_colaborador_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador_simple.Returns,
      fns.Function._Auth.funct_load_colaborador_simple.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador_simple"(
      opts?: fns.Function._Auth.funct_load_colaborador_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador_simple.Returns,
        fns.Function._Auth.funct_load_colaborador_simple.ReturnsType
      >,
    ): void;
    "libdom.domain_of"(
      opts?: fns.Function._Libdom._Domain_Of_16735.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom._Domain_Of_16735.Returns,
      fns.Function._Libdom._Domain_Of_16735.ReturnsType,
      void
    >;
    "libdom.domain_of"(
      opts?: fns.Function._Libdom._Domain_Of_16735.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom._Domain_Of_16735.Returns,
        fns.Function._Libdom._Domain_Of_16735.ReturnsType
      >,
    ): void;
    "cluster.__generate_cluster_code"(
      opts?: fns.Function._Cluster.__generate_cluster_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__generate_cluster_code.Returns,
      fns.Function._Cluster.__generate_cluster_code.ReturnsType,
      void
    >;
    "cluster.__generate_cluster_code"(
      opts?: fns.Function._Cluster.__generate_cluster_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__generate_cluster_code.Returns,
        fns.Function._Cluster.__generate_cluster_code.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador_any_menu"(
      opts?: fns.Function._Auth.funct_load_colaborador_any_menu.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador_any_menu.Returns,
      fns.Function._Auth.funct_load_colaborador_any_menu.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador_any_menu"(
      opts?: fns.Function._Auth.funct_load_colaborador_any_menu.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador_any_menu.Returns,
        fns.Function._Auth.funct_load_colaborador_any_menu.ReturnsType
      >,
    ): void;
    "cluster.unlink_cluster"(
      opts?: fns.Function._Cluster.unlink_cluster.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.unlink_cluster.Returns,
      fns.Function._Cluster.unlink_cluster.ReturnsType,
      void
    >;
    "cluster.unlink_cluster"(
      opts?: fns.Function._Cluster.unlink_cluster.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.unlink_cluster.Returns,
        fns.Function._Cluster.unlink_cluster.ReturnsType
      >,
    ): void;
    "cluster.__collect_change"(
      args: Function._Cluster.__collect_change.Args,
      opts?: fns.Function._Cluster.__collect_change.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__collect_change.Returns,
      fns.Function._Cluster.__collect_change.ReturnsType,
      void
    >;
    "cluster.__collect_change"(
      args: Function._Cluster.__collect_change.Args,
      opts?: fns.Function._Cluster.__collect_change.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__collect_change.Returns,
        fns.Function._Cluster.__collect_change.ReturnsType
      >,
    ): void;
    "cluster._get_cluster"(
      args: Function._Cluster._get_cluster.Args,
      opts?: fns.Function._Cluster._get_cluster.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._get_cluster.Returns,
      fns.Function._Cluster._get_cluster.ReturnsType,
      void
    >;
    "cluster._get_cluster"(
      args: Function._Cluster._get_cluster.Args,
      opts?: fns.Function._Cluster._get_cluster.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._get_cluster.Returns,
        fns.Function._Cluster._get_cluster.ReturnsType
      >,
    ): void;
    "cluster.next"(
      opts?: fns.Function._Cluster.next.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.next.Returns,
      fns.Function._Cluster.next.ReturnsType,
      void
    >;
    "cluster.next"(
      opts?: fns.Function._Cluster.next.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.next.Returns,
        fns.Function._Cluster.next.ReturnsType
      >,
    ): void;
    "libdom.trigger_sync_entry"(
      opts?: fns.Function._Libdom.trigger_sync_entry.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.trigger_sync_entry.Returns,
      fns.Function._Libdom.trigger_sync_entry.ReturnsType,
      void
    >;
    "libdom.trigger_sync_entry"(
      opts?: fns.Function._Libdom.trigger_sync_entry.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.trigger_sync_entry.Returns,
        fns.Function._Libdom.trigger_sync_entry.ReturnsType
      >,
    ): void;
    "cluster._get_version_local"(
      args: Function._Cluster._get_version_local.Args,
      opts?: fns.Function._Cluster._get_version_local.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._get_version_local.Returns,
      fns.Function._Cluster._get_version_local.ReturnsType,
      void
    >;
    "cluster._get_version_local"(
      args: Function._Cluster._get_version_local.Args,
      opts?: fns.Function._Cluster._get_version_local.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._get_version_local.Returns,
        fns.Function._Cluster._get_version_local.ReturnsType
      >,
    ): void;
    "auth.funct_load_menu_cascade"(
      opts?: fns.Function._Auth.funct_load_menu_cascade.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_menu_cascade.Returns,
      fns.Function._Auth.funct_load_menu_cascade.ReturnsType,
      void
    >;
    "auth.funct_load_menu_cascade"(
      opts?: fns.Function._Auth.funct_load_menu_cascade.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_menu_cascade.Returns,
        fns.Function._Auth.funct_load_menu_cascade.ReturnsType
      >,
    ): void;
    "cluster._get_cluster_child"(
      opts?: fns.Function._Cluster._get_cluster_child.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._get_cluster_child.Returns,
      fns.Function._Cluster._get_cluster_child.ReturnsType,
      void
    >;
    "cluster._get_cluster_child"(
      opts?: fns.Function._Cluster._get_cluster_child.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._get_cluster_child.Returns,
        fns.Function._Cluster._get_cluster_child.ReturnsType
      >,
    ): void;
    "cluster.accept_remote_cluster"(
      opts?: fns.Function._Cluster.accept_remote_cluster.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.accept_remote_cluster.Returns,
      fns.Function._Cluster.accept_remote_cluster.ReturnsType,
      void
    >;
    "cluster.accept_remote_cluster"(
      opts?: fns.Function._Cluster.accept_remote_cluster.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.accept_remote_cluster.Returns,
        fns.Function._Cluster.accept_remote_cluster.ReturnsType
      >,
    ): void;
    "libdom.domain"(
      opts?: fns.Function._Libdom.domain.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.domain.Returns,
      fns.Function._Libdom.domain.ReturnsType,
      void
    >;
    "libdom.domain"(
      opts?: fns.Function._Libdom.domain.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.domain.Returns,
        fns.Function._Libdom.domain.ReturnsType
      >,
    ): void;
    "libdom.domain_document"(
      opts?: fns.Function._Libdom.domain_document.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.domain_document.Returns,
      fns.Function._Libdom.domain_document.ReturnsType,
      void
    >;
    "libdom.domain_document"(
      opts?: fns.Function._Libdom.domain_document.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.domain_document.Returns,
        fns.Function._Libdom.domain_document.ReturnsType
      >,
    ): void;
    "cluster.__is_replication"(
      opts?: fns.Function._Cluster.__is_replication.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__is_replication.Returns,
      fns.Function._Cluster.__is_replication.ReturnsType,
      void
    >;
    "cluster.__is_replication"(
      opts?: fns.Function._Cluster.__is_replication.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__is_replication.Returns,
        fns.Function._Cluster.__is_replication.ReturnsType
      >,
    ): void;
    "cluster.sets_cluster_tree_position"(
      opts?: fns.Function._Cluster.sets_cluster_tree_position.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_cluster_tree_position.Returns,
      fns.Function._Cluster.sets_cluster_tree_position.ReturnsType,
      void
    >;
    "cluster.sets_cluster_tree_position"(
      opts?: fns.Function._Cluster.sets_cluster_tree_position.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_cluster_tree_position.Returns,
        fns.Function._Cluster.sets_cluster_tree_position.ReturnsType
      >,
    ): void;
    "libdom.describe"(
      opts?: fns.Function._Libdom.describe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.describe.Returns,
      fns.Function._Libdom.describe.ReturnsType,
      void
    >;
    "libdom.describe"(
      opts?: fns.Function._Libdom.describe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.describe.Returns,
        fns.Function._Libdom.describe.ReturnsType
      >,
    ): void;
    "libdom.exports"(
      opts?: fns.Function._Libdom.exports.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.exports.Returns,
      fns.Function._Libdom.exports.ReturnsType,
      void
    >;
    "libdom.exports"(
      opts?: fns.Function._Libdom.exports.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.exports.Returns,
        fns.Function._Libdom.exports.ReturnsType
      >,
    ): void;
    "auth._colaborador_token_encrypt"(
      opts?: fns.Function._Auth._colaborador_token_encrypt.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._colaborador_token_encrypt.Returns,
      fns.Function._Auth._colaborador_token_encrypt.ReturnsType,
      void
    >;
    "auth._colaborador_token_encrypt"(
      opts?: fns.Function._Auth._colaborador_token_encrypt.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._colaborador_token_encrypt.Returns,
        fns.Function._Auth._colaborador_token_encrypt.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador_token_restore"(
      opts?: fns.Function._Auth.funct_load_colaborador_token_restore.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador_token_restore.Returns,
      fns.Function._Auth.funct_load_colaborador_token_restore.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador_token_restore"(
      opts?: fns.Function._Auth.funct_load_colaborador_token_restore.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador_token_restore.Returns,
        fns.Function._Auth.funct_load_colaborador_token_restore.ReturnsType
      >,
    ): void;
    "cluster.define_namespace"(
      opts?: fns.Function._Cluster.define_namespace.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.define_namespace.Returns,
      fns.Function._Cluster.define_namespace.ReturnsType,
      void
    >;
    "cluster.define_namespace"(
      opts?: fns.Function._Cluster.define_namespace.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.define_namespace.Returns,
        fns.Function._Cluster.define_namespace.ReturnsType
      >,
    ): void;
    "cluster.sets_resources_downloaded"(
      opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._Sets_Resources_Downloaded_16620.Returns,
      fns.Function._Cluster._Sets_Resources_Downloaded_16620.ReturnsType,
      void
    >;
    "cluster.sets_resources_downloaded"(
      opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._Sets_Resources_Downloaded_16620.Returns,
        fns.Function._Cluster._Sets_Resources_Downloaded_16620.ReturnsType
      >,
    ): void;
    "libdom.entry_list"(
      opts?: fns.Function._Libdom.entry_list.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.entry_list.Returns,
      fns.Function._Libdom.entry_list.ReturnsType,
      void
    >;
    "libdom.entry_list"(
      opts?: fns.Function._Libdom.entry_list.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.entry_list.Returns,
        fns.Function._Libdom.entry_list.ReturnsType
      >,
    ): void;
    "cluster.accept_revision"(
      opts?: fns.Function._Cluster.accept_revision.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.accept_revision.Returns,
      fns.Function._Cluster.accept_revision.ReturnsType,
      void
    >;
    "cluster.accept_revision"(
      opts?: fns.Function._Cluster.accept_revision.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.accept_revision.Returns,
        fns.Function._Cluster.accept_revision.ReturnsType
      >,
    ): void;
    "cluster.__tg_share_check"(
      opts?: fns.Function._Cluster.__tg_share_check.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_share_check.Returns,
      fns.Function._Cluster.__tg_share_check.ReturnsType,
      void
    >;
    "cluster.__tg_share_check"(
      opts?: fns.Function._Cluster.__tg_share_check.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_share_check.Returns,
        fns.Function._Cluster.__tg_share_check.ReturnsType
      >,
    ): void;
    "cluster.__create_identifier"(
      opts?: fns.Function._Cluster.__create_identifier.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__create_identifier.Returns,
      fns.Function._Cluster.__create_identifier.ReturnsType,
      void
    >;
    "cluster.__create_identifier"(
      opts?: fns.Function._Cluster.__create_identifier.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__create_identifier.Returns,
        fns.Function._Cluster.__create_identifier.ReturnsType
      >,
    ): void;
    "cluster.funct_reg_acesso"(
      opts?: fns.Function._Cluster.funct_reg_acesso.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.funct_reg_acesso.Returns,
      fns.Function._Cluster.funct_reg_acesso.ReturnsType,
      void
    >;
    "cluster.funct_reg_acesso"(
      opts?: fns.Function._Cluster.funct_reg_acesso.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.funct_reg_acesso.Returns,
        fns.Function._Cluster.funct_reg_acesso.ReturnsType
      >,
    ): void;
    "cluster.__transaction_uid"(
      opts?: fns.Function._Cluster.__transaction_uid.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__transaction_uid.Returns,
      fns.Function._Cluster.__transaction_uid.ReturnsType,
      void
    >;
    "cluster.__transaction_uid"(
      opts?: fns.Function._Cluster.__transaction_uid.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__transaction_uid.Returns,
        fns.Function._Cluster.__transaction_uid.ReturnsType
      >,
    ): void;
    "libdom.sync_entry"(
      opts?: fns.Function._Libdom.sync_entry.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.sync_entry.Returns,
      fns.Function._Libdom.sync_entry.ReturnsType,
      void
    >;
    "libdom.sync_entry"(
      opts?: fns.Function._Libdom.sync_entry.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.sync_entry.Returns,
        fns.Function._Libdom.sync_entry.ReturnsType
      >,
    ): void;
    "cluster.switch_remote_connection"(
      opts?: fns.Function._Cluster.switch_remote_connection.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.switch_remote_connection.Returns,
      fns.Function._Cluster.switch_remote_connection.ReturnsType,
      void
    >;
    "cluster.switch_remote_connection"(
      opts?: fns.Function._Cluster.switch_remote_connection.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.switch_remote_connection.Returns,
        fns.Function._Cluster.switch_remote_connection.ReturnsType
      >,
    ): void;
    "cluster._cluster_accept_child"(
      opts?: fns.Function._Cluster._cluster_accept_child.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._cluster_accept_child.Returns,
      fns.Function._Cluster._cluster_accept_child.ReturnsType,
      void
    >;
    "cluster._cluster_accept_child"(
      opts?: fns.Function._Cluster._cluster_accept_child.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._cluster_accept_child.Returns,
        fns.Function._Cluster._cluster_accept_child.ReturnsType
      >,
    ): void;
    "cluster._get_cluster_local"(
      opts?: fns.Function._Cluster._get_cluster_local.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._get_cluster_local.Returns,
      fns.Function._Cluster._get_cluster_local.ReturnsType,
      void
    >;
    "cluster._get_cluster_local"(
      opts?: fns.Function._Cluster._get_cluster_local.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._get_cluster_local.Returns,
        fns.Function._Cluster._get_cluster_local.ReturnsType
      >,
    ): void;
    "cluster.load_cluster_by_namespace"(
      opts?: fns.Function._Cluster.load_cluster_by_namespace.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_cluster_by_namespace.Returns,
      fns.Function._Cluster.load_cluster_by_namespace.ReturnsType,
      void
    >;
    "cluster.load_cluster_by_namespace"(
      opts?: fns.Function._Cluster.load_cluster_by_namespace.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_cluster_by_namespace.Returns,
        fns.Function._Cluster.load_cluster_by_namespace.ReturnsType
      >,
    ): void;
    "auth.funct_autenticacao"(
      opts?: fns.Function._Auth.funct_autenticacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_autenticacao.Returns,
      fns.Function._Auth.funct_autenticacao.ReturnsType,
      void
    >;
    "auth.funct_autenticacao"(
      opts?: fns.Function._Auth.funct_autenticacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_autenticacao.Returns,
        fns.Function._Auth.funct_autenticacao.ReturnsType
      >,
    ): void;
    "auth._colaborador_generate_senha_token"(
      opts?: fns.Function._Auth._colaborador_generate_senha_token.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._colaborador_generate_senha_token.Returns,
      fns.Function._Auth._colaborador_generate_senha_token.ReturnsType,
      void
    >;
    "auth._colaborador_generate_senha_token"(
      opts?: fns.Function._Auth._colaborador_generate_senha_token.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._colaborador_generate_senha_token.Returns,
        fns.Function._Auth._colaborador_generate_senha_token.ReturnsType
      >,
    ): void;
    "libdom.set"(
      opts?: fns.Function._Libdom._set.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom._set.Returns,
      fns.Function._Libdom._set.ReturnsType,
      void
    >;
    "libdom.set"(
      opts?: fns.Function._Libdom._set.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom._set.Returns,
        fns.Function._Libdom._set.ReturnsType
      >,
    ): void;
    "auth.funct_reg_perfil"(
      opts?: fns.Function._Auth.funct_reg_perfil.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_reg_perfil.Returns,
      fns.Function._Auth.funct_reg_perfil.ReturnsType,
      void
    >;
    "auth.funct_reg_perfil"(
      opts?: fns.Function._Auth.funct_reg_perfil.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_reg_perfil.Returns,
        fns.Function._Auth.funct_reg_perfil.ReturnsType
      >,
    ): void;
    "cluster.sets_clusters_admin"(
      opts?: fns.Function._Cluster.sets_clusters_admin.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_clusters_admin.Returns,
      fns.Function._Cluster.sets_clusters_admin.ReturnsType,
      void
    >;
    "cluster.sets_clusters_admin"(
      opts?: fns.Function._Cluster.sets_clusters_admin.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_clusters_admin.Returns,
        fns.Function._Cluster.sets_clusters_admin.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_token_acesso"(
      opts?: fns.Function._Auth.funct_change_colaborador_token_acesso.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_token_acesso.Returns,
      fns.Function._Auth.funct_change_colaborador_token_acesso.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_token_acesso"(
      opts?: fns.Function._Auth.funct_change_colaborador_token_acesso.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_token_acesso.Returns,
        fns.Function._Auth.funct_change_colaborador_token_acesso.ReturnsType
      >,
    ): void;
    "cluster.can_send_revision"(
      opts?: fns.Function._Cluster.can_send_revision.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.can_send_revision.Returns,
      fns.Function._Cluster.can_send_revision.ReturnsType,
      void
    >;
    "cluster.can_send_revision"(
      opts?: fns.Function._Cluster.can_send_revision.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.can_send_revision.Returns,
        fns.Function._Cluster.can_send_revision.ReturnsType
      >,
    ): void;
    "cluster.can_send_object"(
      opts?: fns.Function._Cluster.can_send_object.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.can_send_object.Returns,
      fns.Function._Cluster.can_send_object.ReturnsType,
      void
    >;
    "cluster.can_send_object"(
      opts?: fns.Function._Cluster.can_send_object.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.can_send_object.Returns,
        fns.Function._Cluster.can_send_object.ReturnsType
      >,
    ): void;
    "cluster.__user_default"(
      opts?: fns.Function._Cluster.__user_default.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__user_default.Returns,
      fns.Function._Cluster.__user_default.ReturnsType,
      void
    >;
    "cluster.__user_default"(
      opts?: fns.Function._Cluster.__user_default.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__user_default.Returns,
        fns.Function._Cluster.__user_default.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_pin"(
      opts?: fns.Function._Auth.funct_change_colaborador_pin.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_pin.Returns,
      fns.Function._Auth.funct_change_colaborador_pin.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_pin"(
      opts?: fns.Function._Auth.funct_change_colaborador_pin.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_pin.Returns,
        fns.Function._Auth.funct_change_colaborador_pin.ReturnsType
      >,
    ): void;
    "cluster.__is_sub_path"(
      opts?: fns.Function._Cluster.__is_sub_path.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__is_sub_path.Returns,
      fns.Function._Cluster.__is_sub_path.ReturnsType,
      void
    >;
    "cluster.__is_sub_path"(
      opts?: fns.Function._Cluster.__is_sub_path.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__is_sub_path.Returns,
        fns.Function._Cluster.__is_sub_path.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_accesso_reativar"(
      opts?: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_accesso_reativar.Returns,
      fns.Function._Auth.funct_change_colaborador_accesso_reativar.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_accesso_reativar"(
      opts?: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_accesso_reativar.Returns,
        fns.Function._Auth.funct_change_colaborador_accesso_reativar.ReturnsType
      >,
    ): void;
    "cluster.add"(
      opts?: fns.Function._Cluster.add.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.add.Returns,
      fns.Function._Cluster.add.ReturnsType,
      void
    >;
    "cluster.add"(
      opts?: fns.Function._Cluster.add.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.add.Returns,
        fns.Function._Cluster.add.ReturnsType
      >,
    ): void;
    "auth.funct_change_colaborador_estado_disable"(
      opts?: fns.Function._Auth.funct_change_colaborador_estado_disable.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_change_colaborador_estado_disable.Returns,
      fns.Function._Auth.funct_change_colaborador_estado_disable.ReturnsType,
      void
    >;
    "auth.funct_change_colaborador_estado_disable"(
      opts?: fns.Function._Auth.funct_change_colaborador_estado_disable.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_change_colaborador_estado_disable.Returns,
        fns.Function._Auth.funct_change_colaborador_estado_disable.ReturnsType
      >,
    ): void;
    "cluster.licence_status"(
      opts?: fns.Function._Cluster.licence_status.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.licence_status.Returns,
      fns.Function._Cluster.licence_status.ReturnsType,
      void
    >;
    "cluster.licence_status"(
      opts?: fns.Function._Cluster.licence_status.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.licence_status.Returns,
        fns.Function._Cluster.licence_status.ReturnsType
      >,
    ): void;
    "cluster.__user_replication"(
      opts?: fns.Function._Cluster.__user_replication.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__user_replication.Returns,
      fns.Function._Cluster.__user_replication.ReturnsType,
      void
    >;
    "cluster.__user_replication"(
      opts?: fns.Function._Cluster.__user_replication.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__user_replication.Returns,
        fns.Function._Cluster.__user_replication.ReturnsType
      >,
    ): void;
    "cluster.load_paths"(
      opts?: fns.Function._Cluster.load_paths.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.load_paths.Returns,
      fns.Function._Cluster.load_paths.ReturnsType,
      void
    >;
    "cluster.load_paths"(
      opts?: fns.Function._Cluster.load_paths.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.load_paths.Returns,
        fns.Function._Cluster.load_paths.ReturnsType
      >,
    ): void;
    "auth._colaborador_generate_pin_token"(
      opts?: fns.Function._Auth._colaborador_generate_pin_token.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._colaborador_generate_pin_token.Returns,
      fns.Function._Auth._colaborador_generate_pin_token.ReturnsType,
      void
    >;
    "auth._colaborador_generate_pin_token"(
      opts?: fns.Function._Auth._colaborador_generate_pin_token.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._colaborador_generate_pin_token.Returns,
        fns.Function._Auth._colaborador_generate_pin_token.ReturnsType
      >,
    ): void;
    "auth._encrypt"(
      opts?: fns.Function._Auth._encrypt.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth._encrypt.Returns,
      fns.Function._Auth._encrypt.ReturnsType,
      void
    >;
    "auth._encrypt"(
      opts?: fns.Function._Auth._encrypt.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth._encrypt.Returns,
        fns.Function._Auth._encrypt.ReturnsType
      >,
    ): void;
    "libdom.domset"(
      opts?: fns.Function._Libdom.domset.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.domset.Returns,
      fns.Function._Libdom.domset.ReturnsType,
      void
    >;
    "libdom.domset"(
      opts?: fns.Function._Libdom.domset.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.domset.Returns,
        fns.Function._Libdom.domset.ReturnsType
      >,
    ): void;
    "cluster.__pks"(
      args: Function._Cluster.__pks.Args,
      opts?: fns.Function._Cluster.__pks.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__pks.Returns,
      fns.Function._Cluster.__pks.ReturnsType,
      void
    >;
    "cluster.__pks"(
      args: Function._Cluster.__pks.Args,
      opts?: fns.Function._Cluster.__pks.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__pks.Returns,
        fns.Function._Cluster.__pks.ReturnsType
      >,
    ): void;
    "auth.funct_reg_colaborador"(
      opts?: fns.Function._Auth.funct_reg_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_reg_colaborador.Returns,
      fns.Function._Auth.funct_reg_colaborador.ReturnsType,
      void
    >;
    "auth.funct_reg_colaborador"(
      opts?: fns.Function._Auth.funct_reg_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_reg_colaborador.Returns,
        fns.Function._Auth.funct_reg_colaborador.ReturnsType
      >,
    ): void;
    "cluster.sets_cluster_machine_id"(
      opts?: fns.Function._Cluster.sets_cluster_machine_id.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_cluster_machine_id.Returns,
      fns.Function._Cluster.sets_cluster_machine_id.ReturnsType,
      void
    >;
    "cluster.sets_cluster_machine_id"(
      opts?: fns.Function._Cluster.sets_cluster_machine_id.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_cluster_machine_id.Returns,
        fns.Function._Cluster.sets_cluster_machine_id.ReturnsType
      >,
    ): void;
    "cluster.change"(
      args: Function._Cluster.change.Args,
      opts?: fns.Function._Cluster.change.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.change.Returns,
      fns.Function._Cluster.change.ReturnsType,
      void
    >;
    "cluster.change"(
      args: Function._Cluster.change.Args,
      opts?: fns.Function._Cluster.change.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.change.Returns,
        fns.Function._Cluster.change.ReturnsType
      >,
    ): void;
    "auth.funct_reg_acesso"(
      opts?: fns.Function._Auth.funct_reg_acesso.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_reg_acesso.Returns,
      fns.Function._Auth.funct_reg_acesso.ReturnsType,
      void
    >;
    "auth.funct_reg_acesso"(
      opts?: fns.Function._Auth.funct_reg_acesso.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_reg_acesso.Returns,
        fns.Function._Auth.funct_reg_acesso.ReturnsType
      >,
    ): void;
    "cluster._get_cluster_master"(
      opts?: fns.Function._Cluster._get_cluster_master.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster._get_cluster_master.Returns,
      fns.Function._Cluster._get_cluster_master.ReturnsType,
      void
    >;
    "cluster._get_cluster_master"(
      opts?: fns.Function._Cluster._get_cluster_master.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster._get_cluster_master.Returns,
        fns.Function._Cluster._get_cluster_master.ReturnsType
      >,
    ): void;
    "auth.funct_load_colaborador_by_token"(
      opts?: fns.Function._Auth.funct_load_colaborador_by_token.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Auth.funct_load_colaborador_by_token.Returns,
      fns.Function._Auth.funct_load_colaborador_by_token.ReturnsType,
      void
    >;
    "auth.funct_load_colaborador_by_token"(
      opts?: fns.Function._Auth.funct_load_colaborador_by_token.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Auth.funct_load_colaborador_by_token.Returns,
        fns.Function._Auth.funct_load_colaborador_by_token.ReturnsType
      >,
    ): void;
    "libdom.prefix"(
      opts?: fns.Function._Libdom.prefix.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.prefix.Returns,
      fns.Function._Libdom.prefix.ReturnsType,
      void
    >;
    "libdom.prefix"(
      opts?: fns.Function._Libdom.prefix.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.prefix.Returns,
        fns.Function._Libdom.prefix.ReturnsType
      >,
    ): void;
    "cluster.__tg_share_map"(
      opts?: fns.Function._Cluster.__tg_share_map.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.__tg_share_map.Returns,
      fns.Function._Cluster.__tg_share_map.ReturnsType,
      void
    >;
    "cluster.__tg_share_map"(
      opts?: fns.Function._Cluster.__tg_share_map.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.__tg_share_map.Returns,
        fns.Function._Cluster.__tg_share_map.ReturnsType
      >,
    ): void;
    "libdom.constant_document"(
      opts?: fns.Function._Libdom.constant_document.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Libdom.constant_document.Returns,
      fns.Function._Libdom.constant_document.ReturnsType,
      void
    >;
    "libdom.constant_document"(
      opts?: fns.Function._Libdom.constant_document.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Libdom.constant_document.Returns,
        fns.Function._Libdom.constant_document.ReturnsType
      >,
    ): void;
    "cluster.sets_cluster_remote"(
      opts?: fns.Function._Cluster.sets_cluster_remote.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_cluster_remote.Returns,
      fns.Function._Cluster.sets_cluster_remote.ReturnsType,
      void
    >;
    "cluster.sets_cluster_remote"(
      opts?: fns.Function._Cluster.sets_cluster_remote.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_cluster_remote.Returns,
        fns.Function._Cluster.sets_cluster_remote.ReturnsType
      >,
    ): void;
    "cluster.sets_cluster_configs"(
      opts?: fns.Function._Cluster.sets_cluster_configs.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_cluster_configs.Returns,
      fns.Function._Cluster.sets_cluster_configs.ReturnsType,
      void
    >;
    "cluster.sets_cluster_configs"(
      opts?: fns.Function._Cluster.sets_cluster_configs.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_cluster_configs.Returns,
        fns.Function._Cluster.sets_cluster_configs.ReturnsType
      >,
    ): void;
    "cluster.commit"(
      opts?: fns.Function._Cluster.commit.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.commit.Returns,
      fns.Function._Cluster.commit.ReturnsType,
      void
    >;
    "cluster.commit"(
      opts?: fns.Function._Cluster.commit.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.commit.Returns,
        fns.Function._Cluster.commit.ReturnsType
      >,
    ): void;
    "cluster.sets_cluster_license"(
      opts?: fns.Function._Cluster.sets_cluster_license.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Cluster.sets_cluster_license.Returns,
      fns.Function._Cluster.sets_cluster_license.ReturnsType,
      void
    >;
    "cluster.sets_cluster_license"(
      opts?: fns.Function._Cluster.sets_cluster_license.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Cluster.sets_cluster_license.Returns,
        fns.Function._Cluster.sets_cluster_license.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_posto"(
      opts?: fns.Function._Tweeks.funct_pos_load_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_posto.Returns,
      fns.Function._Tweeks.funct_pos_load_posto.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_posto"(
      opts?: fns.Function._Tweeks.funct_pos_load_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_posto.Returns,
        fns.Function._Tweeks.funct_pos_load_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_artigo_extras"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_extras.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_artigo_extras.Returns,
      fns.Function._Tweeks.funct_pos_load_artigo_extras.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_artigo_extras"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_extras.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_artigo_extras.Returns,
        fns.Function._Tweeks.funct_pos_load_artigo_extras.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos__sync_conta_amount"(
      opts?: fns.Function._Tweeks.funct_pos__sync_conta_amount.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos__sync_conta_amount.Returns,
      fns.Function._Tweeks.funct_pos__sync_conta_amount.ReturnsType,
      void
    >;
    "tweeks.funct_pos__sync_conta_amount"(
      opts?: fns.Function._Tweeks.funct_pos__sync_conta_amount.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos__sync_conta_amount.Returns,
        fns.Function._Tweeks.funct_pos__sync_conta_amount.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_colaborador"(
      opts?: fns.Function._Tweeks.funct_change_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_colaborador.Returns,
      fns.Function._Tweeks.funct_change_colaborador.ReturnsType,
      void
    >;
    "tweeks.funct_change_colaborador"(
      opts?: fns.Function._Tweeks.funct_change_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_colaborador.Returns,
        fns.Function._Tweeks.funct_change_colaborador.ReturnsType
      >,
    ): void;
    "tweeks._get_caixa"(
      opts?: fns.Function._Tweeks._get_caixa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_caixa.Returns,
      fns.Function._Tweeks._get_caixa.ReturnsType,
      void
    >;
    "tweeks._get_caixa"(
      opts?: fns.Function._Tweeks._get_caixa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_caixa.Returns,
        fns.Function._Tweeks._get_caixa.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_caixa_by_colaborador"(
      opts?: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_caixa_by_colaborador.Returns,
      fns.Function._Tweeks.funct_load_caixa_by_colaborador.ReturnsType,
      void
    >;
    "tweeks.funct_load_caixa_by_colaborador"(
      opts?: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_caixa_by_colaborador.Returns,
        fns.Function._Tweeks.funct_load_caixa_by_colaborador.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_cluster_by_branch"(
      opts?: fns.Function._Tweeks.funct_load_cluster_by_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_cluster_by_branch.Returns,
      fns.Function._Tweeks.funct_load_cluster_by_branch.ReturnsType,
      void
    >;
    "tweeks.funct_load_cluster_by_branch"(
      opts?: fns.Function._Tweeks.funct_load_cluster_by_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_cluster_by_branch.Returns,
        fns.Function._Tweeks.funct_load_cluster_by_branch.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_serie"(
      opts?: fns.Function._Tweeks.funct_load_serie.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_serie.Returns,
      fns.Function._Tweeks.funct_load_serie.ReturnsType,
      void
    >;
    "tweeks.funct_load_serie"(
      opts?: fns.Function._Tweeks.funct_load_serie.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_serie.Returns,
        fns.Function._Tweeks.funct_load_serie.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_conta_data"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_data.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_conta_data.Returns,
      fns.Function._Tweeks.funct_pos_load_conta_data.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_conta_data"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_data.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_conta_data.Returns,
        fns.Function._Tweeks.funct_pos_load_conta_data.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_link_associacao"(
      opts?: fns.Function._Tweeks.funct_reg_link_associacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_link_associacao.Returns,
      fns.Function._Tweeks.funct_reg_link_associacao.ReturnsType,
      void
    >;
    "tweeks.funct_reg_link_associacao"(
      opts?: fns.Function._Tweeks.funct_reg_link_associacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_link_associacao.Returns,
        fns.Function._Tweeks.funct_reg_link_associacao.ReturnsType
      >,
    ): void;
    "tweeks.__load_cambio_day"(
      opts?: fns.Function._Tweeks.__load_cambio_day.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__load_cambio_day.Returns,
      fns.Function._Tweeks.__load_cambio_day.ReturnsType,
      void
    >;
    "tweeks.__load_cambio_day"(
      opts?: fns.Function._Tweeks.__load_cambio_day.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__load_cambio_day.Returns,
        fns.Function._Tweeks.__load_cambio_day.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_guia"(
      opts?: fns.Function._Tweeks.funct_sets_guia.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_guia.Returns,
      fns.Function._Tweeks.funct_sets_guia.ReturnsType,
      void
    >;
    "tweeks.funct_sets_guia"(
      opts?: fns.Function._Tweeks.funct_sets_guia.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_guia.Returns,
        fns.Function._Tweeks.funct_sets_guia.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_ordem_classe"(
      opts?: fns.Function._Tweeks.funct_change_ordem_classe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_ordem_classe.Returns,
      fns.Function._Tweeks.funct_change_ordem_classe.ReturnsType,
      void
    >;
    "tweeks.funct_change_ordem_classe"(
      opts?: fns.Function._Tweeks.funct_change_ordem_classe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_ordem_classe.Returns,
        fns.Function._Tweeks.funct_change_ordem_classe.ReturnsType
      >,
    ): void;
    "tweeks._get_artigo"(
      opts?: fns.Function._Tweeks._get_artigo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_artigo.Returns,
      fns.Function._Tweeks._get_artigo.ReturnsType,
      void
    >;
    "tweeks._get_artigo"(
      opts?: fns.Function._Tweeks._get_artigo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_artigo.Returns,
        fns.Function._Tweeks._get_artigo.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_classe"(
      opts?: fns.Function._Tweeks.funct_reg_classe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_classe.Returns,
      fns.Function._Tweeks.funct_reg_classe.ReturnsType,
      void
    >;
    "tweeks.funct_reg_classe"(
      opts?: fns.Function._Tweeks.funct_reg_classe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_classe.Returns,
        fns.Function._Tweeks.funct_reg_classe.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_transacao"(
      opts?: fns.Function._Tweeks.funct_report_transacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_transacao.Returns,
      fns.Function._Tweeks.funct_report_transacao.ReturnsType,
      void
    >;
    "tweeks.funct_report_transacao"(
      opts?: fns.Function._Tweeks.funct_report_transacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_transacao.Returns,
        fns.Function._Tweeks.funct_report_transacao.ReturnsType
      >,
    ): void;
    "tweeks.viewargs_set"(
      opts?: fns.Function._Tweeks.viewargs_set.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.viewargs_set.Returns,
      fns.Function._Tweeks.viewargs_set.ReturnsType,
      void
    >;
    "tweeks.viewargs_set"(
      opts?: fns.Function._Tweeks.viewargs_set.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.viewargs_set.Returns,
        fns.Function._Tweeks.viewargs_set.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_mesa"(
      opts?: fns.Function._Tweeks.funct_change_mesa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_mesa.Returns,
      fns.Function._Tweeks.funct_change_mesa.ReturnsType,
      void
    >;
    "tweeks.funct_change_mesa"(
      opts?: fns.Function._Tweeks.funct_change_mesa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_mesa.Returns,
        fns.Function._Tweeks.funct_change_mesa.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_link_disable"(
      opts?: fns.Function._Tweeks.funct_change_link_disable.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_link_disable.Returns,
      fns.Function._Tweeks.funct_change_link_disable.ReturnsType,
      void
    >;
    "tweeks.funct_change_link_disable"(
      opts?: fns.Function._Tweeks.funct_change_link_disable.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_link_disable.Returns,
        fns.Function._Tweeks.funct_change_link_disable.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_entrada"(
      opts?: fns.Function._Tweeks.funct_load_entrada.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_entrada.Returns,
      fns.Function._Tweeks.funct_load_entrada.ReturnsType,
      void
    >;
    "tweeks.funct_load_entrada"(
      opts?: fns.Function._Tweeks.funct_load_entrada.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_entrada.Returns,
        fns.Function._Tweeks.funct_load_entrada.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_conta"(
      opts?: fns.Function._Tweeks.funct_change_conta.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_conta.Returns,
      fns.Function._Tweeks.funct_change_conta.ReturnsType,
      void
    >;
    "tweeks.funct_change_conta"(
      opts?: fns.Function._Tweeks.funct_change_conta.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_conta.Returns,
        fns.Function._Tweeks.funct_change_conta.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_branch"(
      opts?: fns.Function._Tweeks.funct_sets_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_branch.Returns,
      fns.Function._Tweeks.funct_sets_branch.ReturnsType,
      void
    >;
    "tweeks.funct_sets_branch"(
      opts?: fns.Function._Tweeks.funct_sets_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_branch.Returns,
        fns.Function._Tweeks.funct_sets_branch.ReturnsType
      >,
    ): void;
    "tweeks.__generate_acerto_code"(
      opts?: fns.Function._Tweeks.__generate_acerto_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_acerto_code.Returns,
      fns.Function._Tweeks.__generate_acerto_code.ReturnsType,
      void
    >;
    "tweeks.__generate_acerto_code"(
      opts?: fns.Function._Tweeks.__generate_acerto_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_acerto_code.Returns,
        fns.Function._Tweeks.__generate_acerto_code.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_artigo"(
      opts?: fns.Function._Tweeks.funct_reg_artigo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_artigo.Returns,
      fns.Function._Tweeks.funct_reg_artigo.ReturnsType,
      void
    >;
    "tweeks.funct_reg_artigo"(
      opts?: fns.Function._Tweeks.funct_reg_artigo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_artigo.Returns,
        fns.Function._Tweeks.funct_reg_artigo.ReturnsType
      >,
    ): void;
    "tweeks.sets_parametrizacao"(
      opts?: fns.Function._Tweeks.sets_parametrizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.sets_parametrizacao.Returns,
      fns.Function._Tweeks.sets_parametrizacao.ReturnsType,
      void
    >;
    "tweeks.sets_parametrizacao"(
      opts?: fns.Function._Tweeks.sets_parametrizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.sets_parametrizacao.Returns,
        fns.Function._Tweeks.sets_parametrizacao.ReturnsType
      >,
    ): void;
    "tweeks.__sets_defaults_units"(
      opts?: fns.Function._Tweeks.__sets_defaults_units.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__sets_defaults_units.Returns,
      fns.Function._Tweeks.__sets_defaults_units.ReturnsType,
      void
    >;
    "tweeks.__sets_defaults_units"(
      opts?: fns.Function._Tweeks.__sets_defaults_units.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__sets_defaults_units.Returns,
        fns.Function._Tweeks.__sets_defaults_units.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_artigo_estado"(
      opts?: fns.Function._Tweeks.funct_change_artigo_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_artigo_estado.Returns,
      fns.Function._Tweeks.funct_change_artigo_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_artigo_estado"(
      opts?: fns.Function._Tweeks.funct_change_artigo_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_artigo_estado.Returns,
        fns.Function._Tweeks.funct_change_artigo_estado.ReturnsType
      >,
    ): void;
    "tweeks.__tg_fluxo_on_venda"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_fluxo_on_venda.Returns,
      fns.Function._Tweeks.__tg_fluxo_on_venda.ReturnsType,
      void
    >;
    "tweeks.__tg_fluxo_on_venda"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_fluxo_on_venda.Returns,
        fns.Function._Tweeks.__tg_fluxo_on_venda.ReturnsType
      >,
    ): void;
    "tweeks.__generate_posto_chave"(
      opts?: fns.Function._Tweeks.__generate_posto_chave.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_posto_chave.Returns,
      fns.Function._Tweeks.__generate_posto_chave.ReturnsType,
      void
    >;
    "tweeks.__generate_posto_chave"(
      opts?: fns.Function._Tweeks.__generate_posto_chave.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_posto_chave.Returns,
        fns.Function._Tweeks.__generate_posto_chave.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_conta"(
      opts?: fns.Function._Tweeks.funct_pos_reg_conta.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_conta.Returns,
      fns.Function._Tweeks.funct_pos_reg_conta.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_conta"(
      opts?: fns.Function._Tweeks.funct_pos_reg_conta.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_conta.Returns,
        fns.Function._Tweeks.funct_pos_reg_conta.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_link_unlink"(
      opts?: fns.Function._Tweeks.funct_change_link_unlink.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_link_unlink.Returns,
      fns.Function._Tweeks.funct_change_link_unlink.ReturnsType,
      void
    >;
    "tweeks.funct_change_link_unlink"(
      opts?: fns.Function._Tweeks.funct_change_link_unlink.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_link_unlink.Returns,
        fns.Function._Tweeks.funct_change_link_unlink.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_tipoimposto"(
      opts?: fns.Function._Tweeks.funct_load_tipoimposto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_tipoimposto.Returns,
      fns.Function._Tweeks.funct_load_tipoimposto.ReturnsType,
      void
    >;
    "tweeks.funct_load_tipoimposto"(
      opts?: fns.Function._Tweeks.funct_load_tipoimposto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_tipoimposto.Returns,
        fns.Function._Tweeks.funct_load_tipoimposto.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_link_switch"(
      opts?: fns.Function._Tweeks.funct_change_link_switch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_link_switch.Returns,
      fns.Function._Tweeks.funct_change_link_switch.ReturnsType,
      void
    >;
    "tweeks.funct_change_link_switch"(
      opts?: fns.Function._Tweeks.funct_change_link_switch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_link_switch.Returns,
        fns.Function._Tweeks.funct_change_link_switch.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_precario"(
      opts?: fns.Function._Tweeks.funct_reg_precario.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_precario.Returns,
      fns.Function._Tweeks.funct_reg_precario.ReturnsType,
      void
    >;
    "tweeks.funct_reg_precario"(
      opts?: fns.Function._Tweeks.funct_reg_precario.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_precario.Returns,
        fns.Function._Tweeks.funct_reg_precario.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_classe_simple_report"(
      opts?: fns.Function._Tweeks.funct_load_classe_simple_report.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_classe_simple_report.Returns,
      fns.Function._Tweeks.funct_load_classe_simple_report.ReturnsType,
      void
    >;
    "tweeks.funct_load_classe_simple_report"(
      opts?: fns.Function._Tweeks.funct_load_classe_simple_report.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_classe_simple_report.Returns,
        fns.Function._Tweeks.funct_load_classe_simple_report.ReturnsType
      >,
    ): void;
    "tweeks.sets_lancamento"(
      opts?: fns.Function._Tweeks.sets_lancamento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.sets_lancamento.Returns,
      fns.Function._Tweeks.sets_lancamento.ReturnsType,
      void
    >;
    "tweeks.sets_lancamento"(
      opts?: fns.Function._Tweeks.sets_lancamento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.sets_lancamento.Returns,
        fns.Function._Tweeks.sets_lancamento.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_transferencia"(
      opts?: fns.Function._Tweeks.funct_load_transferencia.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_transferencia.Returns,
      fns.Function._Tweeks.funct_load_transferencia.ReturnsType,
      void
    >;
    "tweeks.funct_load_transferencia"(
      opts?: fns.Function._Tweeks.funct_load_transferencia.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_transferencia.Returns,
        fns.Function._Tweeks.funct_load_transferencia.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_espaco_simple"(
      opts?: fns.Function._Tweeks.funct_load_espaco_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_espaco_simple.Returns,
      fns.Function._Tweeks.funct_load_espaco_simple.ReturnsType,
      void
    >;
    "tweeks.funct_load_espaco_simple"(
      opts?: fns.Function._Tweeks.funct_load_espaco_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_espaco_simple.Returns,
        fns.Function._Tweeks.funct_load_espaco_simple.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_item"(
      opts?: fns.Function._Tweeks.funct_reg_item.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_item.Returns,
      fns.Function._Tweeks.funct_reg_item.ReturnsType,
      void
    >;
    "tweeks.funct_reg_item"(
      opts?: fns.Function._Tweeks.funct_reg_item.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_item.Returns,
        fns.Function._Tweeks.funct_reg_item.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_item_estado"(
      opts?: fns.Function._Tweeks.funct_change_item_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_item_estado.Returns,
      fns.Function._Tweeks.funct_change_item_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_item_estado"(
      opts?: fns.Function._Tweeks.funct_change_item_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_item_estado.Returns,
        fns.Function._Tweeks.funct_change_item_estado.ReturnsType
      >,
    ): void;
    "tweeks.___override_auth_funct_load_grants"(
      opts?: fns.Function._Tweeks.___override_auth_funct_load_grants.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.___override_auth_funct_load_grants.Returns,
      fns.Function._Tweeks.___override_auth_funct_load_grants.ReturnsType,
      void
    >;
    "tweeks.___override_auth_funct_load_grants"(
      opts?: fns.Function._Tweeks.___override_auth_funct_load_grants.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.___override_auth_funct_load_grants.Returns,
        fns.Function._Tweeks.___override_auth_funct_load_grants.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_docs_financa"(
      opts?: fns.Function._Tweeks.funct_load_conta_docs_financa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_docs_financa.Returns,
      fns.Function._Tweeks.funct_load_conta_docs_financa.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_docs_financa"(
      opts?: fns.Function._Tweeks.funct_load_conta_docs_financa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_docs_financa.Returns,
        fns.Function._Tweeks.funct_load_conta_docs_financa.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_posto_open"(
      opts?: fns.Function._Tweeks.funct_change_posto_open.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_posto_open.Returns,
      fns.Function._Tweeks.funct_change_posto_open.ReturnsType,
      void
    >;
    "tweeks.funct_change_posto_open"(
      opts?: fns.Function._Tweeks.funct_change_posto_open.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_posto_open.Returns,
        fns.Function._Tweeks.funct_change_posto_open.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_items_simple"(
      opts?: fns.Function._Tweeks.funct_load_items_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_items_simple.Returns,
      fns.Function._Tweeks.funct_load_items_simple.ReturnsType,
      void
    >;
    "tweeks.funct_load_items_simple"(
      opts?: fns.Function._Tweeks.funct_load_items_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_items_simple.Returns,
        fns.Function._Tweeks.funct_load_items_simple.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_espaco_migrate"(
      opts?: fns.Function._Tweeks.funct_load_espaco_migrate.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_espaco_migrate.Returns,
      fns.Function._Tweeks.funct_load_espaco_migrate.ReturnsType,
      void
    >;
    "tweeks.funct_load_espaco_migrate"(
      opts?: fns.Function._Tweeks.funct_load_espaco_migrate.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_espaco_migrate.Returns,
        fns.Function._Tweeks.funct_load_espaco_migrate.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_colaborador"(
      opts?: fns.Function._Tweeks.funct_pos_load_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_colaborador.Returns,
      fns.Function._Tweeks.funct_pos_load_colaborador.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_colaborador"(
      opts?: fns.Function._Tweeks.funct_pos_load_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_colaborador.Returns,
        fns.Function._Tweeks.funct_pos_load_colaborador.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo_simple"(
      opts?: fns.Function._Tweeks.funct_load_artigo_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo_simple.Returns,
      fns.Function._Tweeks.funct_load_artigo_simple.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo_simple"(
      opts?: fns.Function._Tweeks.funct_load_artigo_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo_simple.Returns,
        fns.Function._Tweeks.funct_load_artigo_simple.ReturnsType
      >,
    ): void;
    "tweeks._get_espaco"(
      opts?: fns.Function._Tweeks._get_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_espaco.Returns,
      fns.Function._Tweeks._get_espaco.ReturnsType,
      void
    >;
    "tweeks._get_espaco"(
      opts?: fns.Function._Tweeks._get_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_espaco.Returns,
        fns.Function._Tweeks._get_espaco.ReturnsType
      >,
    ): void;
    "tweeks.__tg_conta_after_close"(
      opts?: fns.Function._Tweeks.__tg_conta_after_close.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_conta_after_close.Returns,
      fns.Function._Tweeks.__tg_conta_after_close.ReturnsType,
      void
    >;
    "tweeks.__tg_conta_after_close"(
      opts?: fns.Function._Tweeks.__tg_conta_after_close.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_conta_after_close.Returns,
        fns.Function._Tweeks.__tg_conta_after_close.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_posto_estado"(
      opts?: fns.Function._Tweeks.funct_change_posto_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_posto_estado.Returns,
      fns.Function._Tweeks.funct_change_posto_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_posto_estado"(
      opts?: fns.Function._Tweeks.funct_change_posto_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_posto_estado.Returns,
        fns.Function._Tweeks.funct_change_posto_estado.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_cliente"(
      opts?: fns.Function._Tweeks.funct_pos_load_cliente.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_cliente.Returns,
      fns.Function._Tweeks.funct_pos_load_cliente.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_cliente"(
      opts?: fns.Function._Tweeks.funct_pos_load_cliente.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_cliente.Returns,
        fns.Function._Tweeks.funct_pos_load_cliente.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_deposito"(
      opts?: fns.Function._Tweeks.funct_pos_reg_deposito.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_deposito.Returns,
      fns.Function._Tweeks.funct_pos_reg_deposito.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_deposito"(
      opts?: fns.Function._Tweeks.funct_pos_reg_deposito.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_deposito.Returns,
        fns.Function._Tweeks.funct_pos_reg_deposito.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo"(
      opts?: fns.Function._Tweeks.funct_load_artigo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo.Returns,
      fns.Function._Tweeks.funct_load_artigo.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo"(
      opts?: fns.Function._Tweeks.funct_load_artigo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo.Returns,
        fns.Function._Tweeks.funct_load_artigo.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_report_parametrized"(
      opts?: fns.Function._Tweeks.funct_load_report_parametrized.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_report_parametrized.Returns,
      fns.Function._Tweeks.funct_load_report_parametrized.ReturnsType,
      void
    >;
    "tweeks.funct_load_report_parametrized"(
      opts?: fns.Function._Tweeks.funct_load_report_parametrized.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_report_parametrized.Returns,
        fns.Function._Tweeks.funct_load_report_parametrized.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_espaco_configuracao"(
      opts?: fns.Function._Tweeks.funct_load_espaco_configuracao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_espaco_configuracao.Returns,
      fns.Function._Tweeks.funct_load_espaco_configuracao.ReturnsType,
      void
    >;
    "tweeks.funct_load_espaco_configuracao"(
      opts?: fns.Function._Tweeks.funct_load_espaco_configuracao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_espaco_configuracao.Returns,
        fns.Function._Tweeks.funct_load_espaco_configuracao.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_vendaimposto"(
      opts?: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_vendaimposto.Returns,
      fns.Function._Tweeks.funct_pos_reg_vendaimposto.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_vendaimposto"(
      opts?: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_vendaimposto.Returns,
        fns.Function._Tweeks.funct_pos_reg_vendaimposto.ReturnsType
      >,
    ): void;
    "tweeks.__lancamento_regularizacao"(
      opts?: fns.Function._Tweeks.__lancamento_regularizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__lancamento_regularizacao.Returns,
      fns.Function._Tweeks.__lancamento_regularizacao.ReturnsType,
      void
    >;
    "tweeks.__lancamento_regularizacao"(
      opts?: fns.Function._Tweeks.__lancamento_regularizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__lancamento_regularizacao.Returns,
        fns.Function._Tweeks.__lancamento_regularizacao.ReturnsType
      >,
    ): void;
    "tweeks.__artigo_has_stock"(
      opts?: fns.Function._Tweeks.__artigo_has_stock.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__artigo_has_stock.Returns,
      fns.Function._Tweeks.__artigo_has_stock.ReturnsType,
      void
    >;
    "tweeks.__artigo_has_stock"(
      opts?: fns.Function._Tweeks.__artigo_has_stock.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__artigo_has_stock.Returns,
        fns.Function._Tweeks.__artigo_has_stock.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_posto"(
      opts?: fns.Function._Tweeks.funct_load_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_posto.Returns,
      fns.Function._Tweeks.funct_load_posto.ReturnsType,
      void
    >;
    "tweeks.funct_load_posto"(
      opts?: fns.Function._Tweeks.funct_load_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_posto.Returns,
        fns.Function._Tweeks.funct_load_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_espaco"(
      opts?: fns.Function._Tweeks.funct_load_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_espaco.Returns,
      fns.Function._Tweeks.funct_load_espaco.ReturnsType,
      void
    >;
    "tweeks.funct_load_espaco"(
      opts?: fns.Function._Tweeks.funct_load_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_espaco.Returns,
        fns.Function._Tweeks.funct_load_espaco.ReturnsType
      >,
    ): void;
    "tweeks.__generate_fornecedor_code"(
      opts?: fns.Function._Tweeks.__generate_fornecedor_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_fornecedor_code.Returns,
      fns.Function._Tweeks.__generate_fornecedor_code.ReturnsType,
      void
    >;
    "tweeks.__generate_fornecedor_code"(
      opts?: fns.Function._Tweeks.__generate_fornecedor_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_fornecedor_code.Returns,
        fns.Function._Tweeks.__generate_fornecedor_code.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_by_caixa"(
      opts?: fns.Function._Tweeks.funct_load_conta_by_caixa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_by_caixa.Returns,
      fns.Function._Tweeks.funct_load_conta_by_caixa.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_by_caixa"(
      opts?: fns.Function._Tweeks.funct_load_conta_by_caixa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_by_caixa.Returns,
        fns.Function._Tweeks.funct_load_conta_by_caixa.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_report_venda"(
      opts?: fns.Function._Tweeks.funct_pos_report_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_report_venda.Returns,
      fns.Function._Tweeks.funct_pos_report_venda.ReturnsType,
      void
    >;
    "tweeks.funct_pos_report_venda"(
      opts?: fns.Function._Tweeks.funct_pos_report_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_report_venda.Returns,
        fns.Function._Tweeks.funct_pos_report_venda.ReturnsType
      >,
    ): void;
    "tweeks.__tg_fluxo_on_transferencia"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_fluxo_on_transferencia.Returns,
      fns.Function._Tweeks.__tg_fluxo_on_transferencia.ReturnsType,
      void
    >;
    "tweeks.__tg_fluxo_on_transferencia"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_fluxo_on_transferencia.Returns,
        fns.Function._Tweeks.__tg_fluxo_on_transferencia.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_artigo_composto"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_composto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_artigo_composto.Returns,
      fns.Function._Tweeks.funct_pos_load_artigo_composto.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_artigo_composto"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_composto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_artigo_composto.Returns,
        fns.Function._Tweeks.funct_pos_load_artigo_composto.ReturnsType
      >,
    ): void;
    "tweeks.__branch_menu"(
      opts?: fns.Function._Tweeks.__branch_menu.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__branch_menu.Returns,
      fns.Function._Tweeks.__branch_menu.ReturnsType,
      void
    >;
    "tweeks.__branch_menu"(
      opts?: fns.Function._Tweeks.__branch_menu.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__branch_menu.Returns,
        fns.Function._Tweeks.__branch_menu.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_lancamento"(
      opts?: fns.Function._Tweeks.funct_load_lancamento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_lancamento.Returns,
      fns.Function._Tweeks.funct_load_lancamento.ReturnsType,
      void
    >;
    "tweeks.funct_load_lancamento"(
      opts?: fns.Function._Tweeks.funct_load_lancamento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_lancamento.Returns,
        fns.Function._Tweeks.funct_load_lancamento.ReturnsType
      >,
    ): void;
    "tweeks.__tg_before_update_classe"(
      opts?: fns.Function._Tweeks.__tg_before_update_classe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_before_update_classe.Returns,
      fns.Function._Tweeks.__tg_before_update_classe.ReturnsType,
      void
    >;
    "tweeks.__tg_before_update_classe"(
      opts?: fns.Function._Tweeks.__tg_before_update_classe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_before_update_classe.Returns,
        fns.Function._Tweeks.__tg_before_update_classe.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_chave_restore"(
      opts?: fns.Function._Tweeks.funct_change_chave_restore.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_chave_restore.Returns,
      fns.Function._Tweeks.funct_change_chave_restore.ReturnsType,
      void
    >;
    "tweeks.funct_change_chave_restore"(
      opts?: fns.Function._Tweeks.funct_change_chave_restore.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_chave_restore.Returns,
        fns.Function._Tweeks.funct_change_chave_restore.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artig_check_nome"(
      opts?: fns.Function._Tweeks.funct_load_artig_check_nome.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artig_check_nome.Returns,
      fns.Function._Tweeks.funct_load_artig_check_nome.ReturnsType,
      void
    >;
    "tweeks.funct_load_artig_check_nome"(
      opts?: fns.Function._Tweeks.funct_load_artig_check_nome.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artig_check_nome.Returns,
        fns.Function._Tweeks.funct_load_artig_check_nome.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_change_conta_anular"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_anular.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_change_conta_anular.Returns,
      fns.Function._Tweeks.funct_pos_change_conta_anular.ReturnsType,
      void
    >;
    "tweeks.funct_pos_change_conta_anular"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_anular.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_change_conta_anular.Returns,
        fns.Function._Tweeks.funct_pos_change_conta_anular.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_device_unregistered"(
      opts?: fns.Function._Tweeks.funct_load_device_unregistered.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_device_unregistered.Returns,
      fns.Function._Tweeks.funct_load_device_unregistered.ReturnsType,
      void
    >;
    "tweeks.funct_load_device_unregistered"(
      opts?: fns.Function._Tweeks.funct_load_device_unregistered.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_device_unregistered.Returns,
        fns.Function._Tweeks.funct_load_device_unregistered.ReturnsType
      >,
    ): void;
    "tweeks._get_tmovimento"(
      opts?: fns.Function._Tweeks._get_tmovimento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_tmovimento.Returns,
      fns.Function._Tweeks._get_tmovimento.ReturnsType,
      void
    >;
    "tweeks._get_tmovimento"(
      opts?: fns.Function._Tweeks._get_tmovimento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_tmovimento.Returns,
        fns.Function._Tweeks._get_tmovimento.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_posto_status"(
      opts?: fns.Function._Tweeks.funct_load_posto_status.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_posto_status.Returns,
      fns.Function._Tweeks.funct_load_posto_status.ReturnsType,
      void
    >;
    "tweeks.funct_load_posto_status"(
      opts?: fns.Function._Tweeks.funct_load_posto_status.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_posto_status.Returns,
        fns.Function._Tweeks.funct_load_posto_status.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_venda"(
      opts?: fns.Function._Tweeks.funct_pos_reg_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_venda.Returns,
      fns.Function._Tweeks.funct_pos_reg_venda.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_venda"(
      opts?: fns.Function._Tweeks.funct_pos_reg_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_venda.Returns,
        fns.Function._Tweeks.funct_pos_reg_venda.ReturnsType
      >,
    ): void;
    "tweeks._get_stock"(
      opts?: fns.Function._Tweeks._get_stock.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_stock.Returns,
      fns.Function._Tweeks._get_stock.ReturnsType,
      void
    >;
    "tweeks._get_stock"(
      opts?: fns.Function._Tweeks._get_stock.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_stock.Returns,
        fns.Function._Tweeks._get_stock.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_fornecedor"(
      opts?: fns.Function._Tweeks.funct_sets_fornecedor.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_fornecedor.Returns,
      fns.Function._Tweeks.funct_sets_fornecedor.ReturnsType,
      void
    >;
    "tweeks.funct_sets_fornecedor"(
      opts?: fns.Function._Tweeks.funct_sets_fornecedor.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_fornecedor.Returns,
        fns.Function._Tweeks.funct_sets_fornecedor.ReturnsType
      >,
    ): void;
    "tweeks._get_conta"(
      opts?: fns.Function._Tweeks._get_conta.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_conta.Returns,
      fns.Function._Tweeks._get_conta.ReturnsType,
      void
    >;
    "tweeks._get_conta"(
      opts?: fns.Function._Tweeks._get_conta.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_conta.Returns,
        fns.Function._Tweeks._get_conta.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_conta_preparar"(
      opts?: fns.Function._Tweeks.funct_change_conta_preparar.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_conta_preparar.Returns,
      fns.Function._Tweeks.funct_change_conta_preparar.ReturnsType,
      void
    >;
    "tweeks.funct_change_conta_preparar"(
      opts?: fns.Function._Tweeks.funct_change_conta_preparar.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_conta_preparar.Returns,
        fns.Function._Tweeks.funct_change_conta_preparar.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_autorizacao"(
      opts?: fns.Function._Tweeks.funct_load_autorizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_autorizacao.Returns,
      fns.Function._Tweeks.funct_load_autorizacao.ReturnsType,
      void
    >;
    "tweeks.funct_load_autorizacao"(
      opts?: fns.Function._Tweeks.funct_load_autorizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_autorizacao.Returns,
        fns.Function._Tweeks.funct_load_autorizacao.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_serie"(
      opts?: fns.Function._Tweeks.funct_sets_serie.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_serie.Returns,
      fns.Function._Tweeks.funct_sets_serie.ReturnsType,
      void
    >;
    "tweeks.funct_sets_serie"(
      opts?: fns.Function._Tweeks.funct_sets_serie.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_serie.Returns,
        fns.Function._Tweeks.funct_sets_serie.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_change_conta_fechar"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_fechar.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_change_conta_fechar.Returns,
      fns.Function._Tweeks.funct_pos_change_conta_fechar.ReturnsType,
      void
    >;
    "tweeks.funct_pos_change_conta_fechar"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_fechar.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_change_conta_fechar.Returns,
        fns.Function._Tweeks.funct_pos_change_conta_fechar.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_deposito_data"(
      opts?: fns.Function._Tweeks.funct_load_deposito_data.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_deposito_data.Returns,
      fns.Function._Tweeks.funct_load_deposito_data.ReturnsType,
      void
    >;
    "tweeks.funct_load_deposito_data"(
      opts?: fns.Function._Tweeks.funct_load_deposito_data.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_deposito_data.Returns,
        fns.Function._Tweeks.funct_load_deposito_data.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_caixa"(
      opts?: fns.Function._Tweeks.funct_report_caixa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_caixa.Returns,
      fns.Function._Tweeks.funct_report_caixa.ReturnsType,
      void
    >;
    "tweeks.funct_report_caixa"(
      opts?: fns.Function._Tweeks.funct_report_caixa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_caixa.Returns,
        fns.Function._Tweeks.funct_report_caixa.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_posto_closed"(
      opts?: fns.Function._Tweeks.funct_load_posto_closed.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_posto_closed.Returns,
      fns.Function._Tweeks.funct_load_posto_closed.ReturnsType,
      void
    >;
    "tweeks.funct_load_posto_closed"(
      opts?: fns.Function._Tweeks.funct_load_posto_closed.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_posto_closed.Returns,
        fns.Function._Tweeks.funct_load_posto_closed.ReturnsType
      >,
    ): void;
    "tweeks.__generate_classe_code"(
      opts?: fns.Function._Tweeks.__generate_classe_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_classe_code.Returns,
      fns.Function._Tweeks.__generate_classe_code.ReturnsType,
      void
    >;
    "tweeks.__generate_classe_code"(
      opts?: fns.Function._Tweeks.__generate_classe_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_classe_code.Returns,
        fns.Function._Tweeks.__generate_classe_code.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_dispoe"(
      opts?: fns.Function._Tweeks.funct_reg_dispoe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_dispoe.Returns,
      fns.Function._Tweeks.funct_reg_dispoe.ReturnsType,
      void
    >;
    "tweeks.funct_reg_dispoe"(
      opts?: fns.Function._Tweeks.funct_reg_dispoe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_dispoe.Returns,
        fns.Function._Tweeks.funct_reg_dispoe.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_colaborador"(
      opts?: fns.Function._Tweeks.funct_reg_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_colaborador.Returns,
      fns.Function._Tweeks.funct_reg_colaborador.ReturnsType,
      void
    >;
    "tweeks.funct_reg_colaborador"(
      opts?: fns.Function._Tweeks.funct_reg_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_colaborador.Returns,
        fns.Function._Tweeks.funct_reg_colaborador.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_link_move"(
      opts?: fns.Function._Tweeks.funct_change_link_move.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_link_move.Returns,
      fns.Function._Tweeks.funct_change_link_move.ReturnsType,
      void
    >;
    "tweeks.funct_change_link_move"(
      opts?: fns.Function._Tweeks.funct_change_link_move.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_link_move.Returns,
        fns.Function._Tweeks.funct_change_link_move.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_stock"(
      opts?: fns.Function._Tweeks.funct_reg_stock.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_stock.Returns,
      fns.Function._Tweeks.funct_reg_stock.ReturnsType,
      void
    >;
    "tweeks.funct_reg_stock"(
      opts?: fns.Function._Tweeks.funct_reg_stock.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_stock.Returns,
        fns.Function._Tweeks.funct_reg_stock.ReturnsType
      >,
    ): void;
    "tweeks._get_classe"(
      opts?: fns.Function._Tweeks._get_classe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_classe.Returns,
      fns.Function._Tweeks._get_classe.ReturnsType,
      void
    >;
    "tweeks._get_classe"(
      opts?: fns.Function._Tweeks._get_classe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_classe.Returns,
        fns.Function._Tweeks._get_classe.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_espaco_configuracao"(
      opts?: fns.Function._Tweeks.funct_change_espaco_configuracao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_espaco_configuracao.Returns,
      fns.Function._Tweeks.funct_change_espaco_configuracao.ReturnsType,
      void
    >;
    "tweeks.funct_change_espaco_configuracao"(
      opts?: fns.Function._Tweeks.funct_change_espaco_configuracao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_espaco_configuracao.Returns,
        fns.Function._Tweeks.funct_change_espaco_configuracao.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_espaco"(
      opts?: fns.Function._Tweeks.funct_change_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_espaco.Returns,
      fns.Function._Tweeks.funct_change_espaco.ReturnsType,
      void
    >;
    "tweeks.funct_change_espaco"(
      opts?: fns.Function._Tweeks.funct_change_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_espaco.Returns,
        fns.Function._Tweeks.funct_change_espaco.ReturnsType
      >,
    ): void;
    "tweeks.__tg_use_branch"(
      opts?: fns.Function._Tweeks.__tg_use_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_use_branch.Returns,
      fns.Function._Tweeks.__tg_use_branch.ReturnsType,
      void
    >;
    "tweeks.__tg_use_branch"(
      opts?: fns.Function._Tweeks.__tg_use_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_use_branch.Returns,
        fns.Function._Tweeks.__tg_use_branch.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_conta_proforma"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_proforma.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_conta_proforma.Returns,
      fns.Function._Tweeks.funct_pos_load_conta_proforma.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_conta_proforma"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_proforma.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_conta_proforma.Returns,
        fns.Function._Tweeks.funct_pos_load_conta_proforma.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_generate_key"(
      opts?: fns.Function._Tweeks.funct_pos_generate_key.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_generate_key.Returns,
      fns.Function._Tweeks.funct_pos_generate_key.ReturnsType,
      void
    >;
    "tweeks.funct_pos_generate_key"(
      opts?: fns.Function._Tweeks.funct_pos_generate_key.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_generate_key.Returns,
        fns.Function._Tweeks.funct_pos_generate_key.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_classe"(
      opts?: fns.Function._Tweeks.funct_load_classe.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_classe.Returns,
      fns.Function._Tweeks.funct_load_classe.ReturnsType,
      void
    >;
    "tweeks.funct_load_classe"(
      opts?: fns.Function._Tweeks.funct_load_classe.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_classe.Returns,
        fns.Function._Tweeks.funct_load_classe.ReturnsType
      >,
    ): void;
    "tweeks.__get_serie_espaco"(
      opts?: fns.Function._Tweeks.__get_serie_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__get_serie_espaco.Returns,
      fns.Function._Tweeks.__get_serie_espaco.ReturnsType,
      void
    >;
    "tweeks.__get_serie_espaco"(
      opts?: fns.Function._Tweeks.__get_serie_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__get_serie_espaco.Returns,
        fns.Function._Tweeks.__get_serie_espaco.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_transferencia"(
      opts?: fns.Function._Tweeks.funct_reg_transferencia.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_transferencia.Returns,
      fns.Function._Tweeks.funct_reg_transferencia.ReturnsType,
      void
    >;
    "tweeks.funct_reg_transferencia"(
      opts?: fns.Function._Tweeks.funct_reg_transferencia.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_transferencia.Returns,
        fns.Function._Tweeks.funct_reg_transferencia.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_fornecedor_estado"(
      opts?: fns.Function._Tweeks.funct_change_fornecedor_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_fornecedor_estado.Returns,
      fns.Function._Tweeks.funct_change_fornecedor_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_fornecedor_estado"(
      opts?: fns.Function._Tweeks.funct_change_fornecedor_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_fornecedor_estado.Returns,
        fns.Function._Tweeks.funct_change_fornecedor_estado.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_cambio_history"(
      opts?: fns.Function._Tweeks.funct_load_cambio_history.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_cambio_history.Returns,
      fns.Function._Tweeks.funct_load_cambio_history.ReturnsType,
      void
    >;
    "tweeks.funct_load_cambio_history"(
      opts?: fns.Function._Tweeks.funct_load_cambio_history.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_cambio_history.Returns,
        fns.Function._Tweeks.funct_load_cambio_history.ReturnsType
      >,
    ): void;
    "tweeks.__space_branch_level"(
      opts?: fns.Function._Tweeks.__space_branch_level.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__space_branch_level.Returns,
      fns.Function._Tweeks.__space_branch_level.ReturnsType,
      void
    >;
    "tweeks.__space_branch_level"(
      opts?: fns.Function._Tweeks.__space_branch_level.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__space_branch_level.Returns,
        fns.Function._Tweeks.__space_branch_level.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_trabalha"(
      opts?: fns.Function._Tweeks.funct_reg_trabalha.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_trabalha.Returns,
      fns.Function._Tweeks.funct_reg_trabalha.ReturnsType,
      void
    >;
    "tweeks.funct_reg_trabalha"(
      opts?: fns.Function._Tweeks.funct_reg_trabalha.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_trabalha.Returns,
        fns.Function._Tweeks.funct_reg_trabalha.ReturnsType
      >,
    ): void;
    "tweeks.viewarg"(
      opts?: fns.Function._Tweeks.viewarg.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.viewarg.Returns,
      fns.Function._Tweeks.viewarg.ReturnsType,
      void
    >;
    "tweeks.viewarg"(
      opts?: fns.Function._Tweeks.viewarg.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.viewarg.Returns,
        fns.Function._Tweeks.viewarg.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo_base"(
      opts?: fns.Function._Tweeks.funct_load_artigo_base.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo_base.Returns,
      fns.Function._Tweeks.funct_load_artigo_base.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo_base"(
      opts?: fns.Function._Tweeks.funct_load_artigo_base.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo_base.Returns,
        fns.Function._Tweeks.funct_load_artigo_base.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_trabalha"(
      opts?: fns.Function._Tweeks.funct_load_trabalha.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_trabalha.Returns,
      fns.Function._Tweeks.funct_load_trabalha.ReturnsType,
      void
    >;
    "tweeks.funct_load_trabalha"(
      opts?: fns.Function._Tweeks.funct_load_trabalha.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_trabalha.Returns,
        fns.Function._Tweeks.funct_load_trabalha.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_mesa"(
      opts?: fns.Function._Tweeks.funct_reg_mesa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_mesa.Returns,
      fns.Function._Tweeks.funct_reg_mesa.ReturnsType,
      void
    >;
    "tweeks.funct_reg_mesa"(
      opts?: fns.Function._Tweeks.funct_reg_mesa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_mesa.Returns,
        fns.Function._Tweeks.funct_reg_mesa.ReturnsType
      >,
    ): void;
    "tweeks._get_link"(
      opts?: fns.Function._Tweeks._get_link.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_link.Returns,
      fns.Function._Tweeks._get_link.ReturnsType,
      void
    >;
    "tweeks._get_link"(
      opts?: fns.Function._Tweeks._get_link.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_link.Returns,
        fns.Function._Tweeks._get_link.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_serie_available"(
      opts?: fns.Function._Tweeks.funct_load_serie_available.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_serie_available.Returns,
      fns.Function._Tweeks.funct_load_serie_available.ReturnsType,
      void
    >;
    "tweeks.funct_load_serie_available"(
      opts?: fns.Function._Tweeks.funct_load_serie_available.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_serie_available.Returns,
        fns.Function._Tweeks.funct_load_serie_available.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo_data"(
      opts?: fns.Function._Tweeks.funct_load_artigo_data.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo_data.Returns,
      fns.Function._Tweeks.funct_load_artigo_data.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo_data"(
      opts?: fns.Function._Tweeks.funct_load_artigo_data.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo_data.Returns,
        fns.Function._Tweeks.funct_load_artigo_data.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_classe_estado"(
      opts?: fns.Function._Tweeks.funct_change_classe_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_classe_estado.Returns,
      fns.Function._Tweeks.funct_change_classe_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_classe_estado"(
      opts?: fns.Function._Tweeks.funct_change_classe_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_classe_estado.Returns,
        fns.Function._Tweeks.funct_change_classe_estado.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_conta_nota_credito"(
      opts?: fns.Function._Tweeks.funct_reg_conta_nota_credito.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_conta_nota_credito.Returns,
      fns.Function._Tweeks.funct_reg_conta_nota_credito.ReturnsType,
      void
    >;
    "tweeks.funct_reg_conta_nota_credito"(
      opts?: fns.Function._Tweeks.funct_reg_conta_nota_credito.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_conta_nota_credito.Returns,
        fns.Function._Tweeks.funct_reg_conta_nota_credito.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_compra_entrada"(
      opts?: fns.Function._Tweeks.funct_report_compra_entrada.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_compra_entrada.Returns,
      fns.Function._Tweeks.funct_report_compra_entrada.ReturnsType,
      void
    >;
    "tweeks.funct_report_compra_entrada"(
      opts?: fns.Function._Tweeks.funct_report_compra_entrada.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_compra_entrada.Returns,
        fns.Function._Tweeks.funct_report_compra_entrada.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_cliente"(
      opts?: fns.Function._Tweeks.funct_pos_reg_cliente.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_cliente.Returns,
      fns.Function._Tweeks.funct_pos_reg_cliente.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_cliente"(
      opts?: fns.Function._Tweeks.funct_pos_reg_cliente.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_cliente.Returns,
        fns.Function._Tweeks.funct_pos_reg_cliente.ReturnsType
      >,
    ): void;
    "tweeks.load_clusters"(
      opts?: fns.Function._Tweeks.load_clusters.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.load_clusters.Returns,
      fns.Function._Tweeks.load_clusters.ReturnsType,
      void
    >;
    "tweeks.load_clusters"(
      opts?: fns.Function._Tweeks.load_clusters.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.load_clusters.Returns,
        fns.Function._Tweeks.load_clusters.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_unit"(
      opts?: fns.Function._Tweeks.funct_sets_unit.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_unit.Returns,
      fns.Function._Tweeks.funct_sets_unit.ReturnsType,
      void
    >;
    "tweeks.funct_sets_unit"(
      opts?: fns.Function._Tweeks.funct_sets_unit.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_unit.Returns,
        fns.Function._Tweeks.funct_sets_unit.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_mesa_estado"(
      opts?: fns.Function._Tweeks.funct_change_mesa_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_mesa_estado.Returns,
      fns.Function._Tweeks.funct_change_mesa_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_mesa_estado"(
      opts?: fns.Function._Tweeks.funct_change_mesa_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_mesa_estado.Returns,
        fns.Function._Tweeks.funct_change_mesa_estado.ReturnsType
      >,
    ): void;
    "tweeks.__check_stock_on_venda"(
      opts?: fns.Function._Tweeks.__check_stock_on_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__check_stock_on_venda.Returns,
      fns.Function._Tweeks.__check_stock_on_venda.ReturnsType,
      void
    >;
    "tweeks.__check_stock_on_venda"(
      opts?: fns.Function._Tweeks.__check_stock_on_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__check_stock_on_venda.Returns,
        fns.Function._Tweeks.__check_stock_on_venda.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_mesa_livre"(
      opts?: fns.Function._Tweeks.funct_load_mesa_livre.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_mesa_livre.Returns,
      fns.Function._Tweeks.funct_load_mesa_livre.ReturnsType,
      void
    >;
    "tweeks.funct_load_mesa_livre"(
      opts?: fns.Function._Tweeks.funct_load_mesa_livre.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_mesa_livre.Returns,
        fns.Function._Tweeks.funct_load_mesa_livre.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_conta_imprimir"(
      opts?: fns.Function._Tweeks.funct_change_conta_imprimir.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_conta_imprimir.Returns,
      fns.Function._Tweeks.funct_change_conta_imprimir.ReturnsType,
      void
    >;
    "tweeks.funct_change_conta_imprimir"(
      opts?: fns.Function._Tweeks.funct_change_conta_imprimir.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_conta_imprimir.Returns,
        fns.Function._Tweeks.funct_change_conta_imprimir.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_fornecedor_simple"(
      opts?: fns.Function._Tweeks.funct_load_fornecedor_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_fornecedor_simple.Returns,
      fns.Function._Tweeks.funct_load_fornecedor_simple.ReturnsType,
      void
    >;
    "tweeks.funct_load_fornecedor_simple"(
      opts?: fns.Function._Tweeks.funct_load_fornecedor_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_fornecedor_simple.Returns,
        fns.Function._Tweeks.funct_load_fornecedor_simple.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_espaco_estado"(
      opts?: fns.Function._Tweeks.funct_change_espaco_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_espaco_estado.Returns,
      fns.Function._Tweeks.funct_change_espaco_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_espaco_estado"(
      opts?: fns.Function._Tweeks.funct_change_espaco_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_espaco_estado.Returns,
        fns.Function._Tweeks.funct_change_espaco_estado.ReturnsType
      >,
    ): void;
    "tweeks._get_item"(
      opts?: fns.Function._Tweeks._get_item.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_item.Returns,
      fns.Function._Tweeks._get_item.ReturnsType,
      void
    >;
    "tweeks._get_item"(
      opts?: fns.Function._Tweeks._get_item.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_item.Returns,
        fns.Function._Tweeks._get_item.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_artigo_search"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_search.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_artigo_search.Returns,
      fns.Function._Tweeks.funct_pos_load_artigo_search.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_artigo_search"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo_search.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_artigo_search.Returns,
        fns.Function._Tweeks.funct_pos_load_artigo_search.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_unit"(
      opts?: fns.Function._Tweeks.funct_load_unit.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_unit.Returns,
      fns.Function._Tweeks.funct_load_unit.ReturnsType,
      void
    >;
    "tweeks.funct_load_unit"(
      opts?: fns.Function._Tweeks.funct_load_unit.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_unit.Returns,
        fns.Function._Tweeks.funct_load_unit.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_fornecedor"(
      opts?: fns.Function._Tweeks.funct_reg_fornecedor.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_fornecedor.Returns,
      fns.Function._Tweeks.funct_reg_fornecedor.ReturnsType,
      void
    >;
    "tweeks.funct_reg_fornecedor"(
      opts?: fns.Function._Tweeks.funct_reg_fornecedor.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_fornecedor.Returns,
        fns.Function._Tweeks.funct_reg_fornecedor.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_conta_docs_financa"(
      opts?: fns.Function._Tweeks.funct_reg_conta_docs_financa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_conta_docs_financa.Returns,
      fns.Function._Tweeks.funct_reg_conta_docs_financa.ReturnsType,
      void
    >;
    "tweeks.funct_reg_conta_docs_financa"(
      opts?: fns.Function._Tweeks.funct_reg_conta_docs_financa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_conta_docs_financa.Returns,
        fns.Function._Tweeks.funct_reg_conta_docs_financa.ReturnsType
      >,
    ): void;
    "tweeks._get_impostos_taxa"(
      opts?: fns.Function._Tweeks._get_impostos_taxa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_impostos_taxa.Returns,
      fns.Function._Tweeks._get_impostos_taxa.ReturnsType,
      void
    >;
    "tweeks._get_impostos_taxa"(
      opts?: fns.Function._Tweeks._get_impostos_taxa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_impostos_taxa.Returns,
        fns.Function._Tweeks._get_impostos_taxa.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_fornecedor"(
      opts?: fns.Function._Tweeks.funct_load_fornecedor.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_fornecedor.Returns,
      fns.Function._Tweeks.funct_load_fornecedor.ReturnsType,
      void
    >;
    "tweeks.funct_load_fornecedor"(
      opts?: fns.Function._Tweeks.funct_load_fornecedor.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_fornecedor.Returns,
        fns.Function._Tweeks.funct_load_fornecedor.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_chave"(
      opts?: fns.Function._Tweeks.funct_load_chave.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_chave.Returns,
      fns.Function._Tweeks.funct_load_chave.ReturnsType,
      void
    >;
    "tweeks.funct_load_chave"(
      opts?: fns.Function._Tweeks.funct_load_chave.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_chave.Returns,
        fns.Function._Tweeks.funct_load_chave.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_stock_movimentos"(
      opts?: fns.Function._Tweeks.funct_report_stock_movimentos.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_stock_movimentos.Returns,
      fns.Function._Tweeks.funct_report_stock_movimentos.ReturnsType,
      void
    >;
    "tweeks.funct_report_stock_movimentos"(
      opts?: fns.Function._Tweeks.funct_report_stock_movimentos.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_stock_movimentos.Returns,
        fns.Function._Tweeks.funct_report_stock_movimentos.ReturnsType
      >,
    ): void;
    "tweeks.__infinity_loop"(
      opts?: fns.Function._Tweeks.__infinity_loop.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__infinity_loop.Returns,
      fns.Function._Tweeks.__infinity_loop.ReturnsType,
      void
    >;
    "tweeks.__infinity_loop"(
      opts?: fns.Function._Tweeks.__infinity_loop.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__infinity_loop.Returns,
        fns.Function._Tweeks.__infinity_loop.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_entrada"(
      opts?: fns.Function._Tweeks.funct_reg_entrada.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_entrada.Returns,
      fns.Function._Tweeks.funct_reg_entrada.ReturnsType,
      void
    >;
    "tweeks.funct_reg_entrada"(
      opts?: fns.Function._Tweeks.funct_reg_entrada.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_entrada.Returns,
        fns.Function._Tweeks.funct_reg_entrada.ReturnsType
      >,
    ): void;
    "tweeks.__get_autorizacao"(
      args: Function._Tweeks.__get_autorizacao.Args,
      opts?: fns.Function._Tweeks.__get_autorizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__get_autorizacao.Returns,
      fns.Function._Tweeks.__get_autorizacao.ReturnsType,
      void
    >;
    "tweeks.__get_autorizacao"(
      args: Function._Tweeks.__get_autorizacao.Args,
      opts?: fns.Function._Tweeks.__get_autorizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__get_autorizacao.Returns,
        fns.Function._Tweeks.__get_autorizacao.ReturnsType
      >,
    ): void;
    "tweeks.__generate_caixa_code"(
      opts?: fns.Function._Tweeks.__generate_caixa_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_caixa_code.Returns,
      fns.Function._Tweeks.__generate_caixa_code.ReturnsType,
      void
    >;
    "tweeks.__generate_caixa_code"(
      opts?: fns.Function._Tweeks.__generate_caixa_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_caixa_code.Returns,
        fns.Function._Tweeks.__generate_caixa_code.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_tespaco"(
      opts?: fns.Function._Tweeks.funct_load_tespaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_tespaco.Returns,
      fns.Function._Tweeks.funct_load_tespaco.ReturnsType,
      void
    >;
    "tweeks.funct_load_tespaco"(
      opts?: fns.Function._Tweeks.funct_load_tespaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_tespaco.Returns,
        fns.Function._Tweeks.funct_load_tespaco.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_venda_artigo"(
      opts?: fns.Function._Tweeks.funct_report_venda_artigo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_venda_artigo.Returns,
      fns.Function._Tweeks.funct_report_venda_artigo.ReturnsType,
      void
    >;
    "tweeks.funct_report_venda_artigo"(
      opts?: fns.Function._Tweeks.funct_report_venda_artigo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_venda_artigo.Returns,
        fns.Function._Tweeks.funct_report_venda_artigo.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_parametrizacao"(
      opts?: fns.Function._Tweeks.funct_load_parametrizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_parametrizacao.Returns,
      fns.Function._Tweeks.funct_load_parametrizacao.ReturnsType,
      void
    >;
    "tweeks.funct_load_parametrizacao"(
      opts?: fns.Function._Tweeks.funct_load_parametrizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_parametrizacao.Returns,
        fns.Function._Tweeks.funct_load_parametrizacao.ReturnsType
      >,
    ): void;
    "tweeks._get_branch_by_colaborador"(
      args: Function._Tweeks._get_branch_by_colaborador.Args,
      opts?: fns.Function._Tweeks._get_branch_by_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_branch_by_colaborador.Returns,
      fns.Function._Tweeks._get_branch_by_colaborador.ReturnsType,
      void
    >;
    "tweeks._get_branch_by_colaborador"(
      args: Function._Tweeks._get_branch_by_colaborador.Args,
      opts?: fns.Function._Tweeks._get_branch_by_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_branch_by_colaborador.Returns,
        fns.Function._Tweeks._get_branch_by_colaborador.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_autorizacao_continue"(
      opts?: fns.Function._Tweeks.funct_sets_autorizacao_continue.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_autorizacao_continue.Returns,
      fns.Function._Tweeks.funct_sets_autorizacao_continue.ReturnsType,
      void
    >;
    "tweeks.funct_sets_autorizacao_continue"(
      opts?: fns.Function._Tweeks.funct_sets_autorizacao_continue.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_autorizacao_continue.Returns,
        fns.Function._Tweeks.funct_sets_autorizacao_continue.ReturnsType
      >,
    ): void;
    "tweeks.__fluxo_stock"(
      opts?: fns.Function._Tweeks.__fluxo_stock.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__fluxo_stock.Returns,
      fns.Function._Tweeks.__fluxo_stock.ReturnsType,
      void
    >;
    "tweeks.__fluxo_stock"(
      opts?: fns.Function._Tweeks.__fluxo_stock.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__fluxo_stock.Returns,
        fns.Function._Tweeks.__fluxo_stock.ReturnsType
      >,
    ): void;
    "tweeks.sets_atividade"(
      opts?: fns.Function._Tweeks.sets_atividade.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.sets_atividade.Returns,
      fns.Function._Tweeks.sets_atividade.ReturnsType,
      void
    >;
    "tweeks.sets_atividade"(
      opts?: fns.Function._Tweeks.sets_atividade.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.sets_atividade.Returns,
        fns.Function._Tweeks.sets_atividade.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos__calc_imposto"(
      opts?: fns.Function._Tweeks.funct_pos__calc_imposto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos__calc_imposto.Returns,
      fns.Function._Tweeks.funct_pos__calc_imposto.ReturnsType,
      void
    >;
    "tweeks.funct_pos__calc_imposto"(
      opts?: fns.Function._Tweeks.funct_pos__calc_imposto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos__calc_imposto.Returns,
        fns.Function._Tweeks.funct_pos__calc_imposto.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_guia_data"(
      opts?: fns.Function._Tweeks.funct_load_guia_data.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_guia_data.Returns,
      fns.Function._Tweeks.funct_load_guia_data.ReturnsType,
      void
    >;
    "tweeks.funct_load_guia_data"(
      opts?: fns.Function._Tweeks.funct_load_guia_data.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_guia_data.Returns,
        fns.Function._Tweeks.funct_load_guia_data.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_tpaga"(
      opts?: fns.Function._Tweeks.funct_load_tpaga.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_tpaga.Returns,
      fns.Function._Tweeks.funct_load_tpaga.ReturnsType,
      void
    >;
    "tweeks.funct_load_tpaga"(
      opts?: fns.Function._Tweeks.funct_load_tpaga.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_tpaga.Returns,
        fns.Function._Tweeks.funct_load_tpaga.ReturnsType
      >,
    ): void;
    "tweeks._get_venda"(
      opts?: fns.Function._Tweeks._get_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_venda.Returns,
      fns.Function._Tweeks._get_venda.ReturnsType,
      void
    >;
    "tweeks._get_venda"(
      opts?: fns.Function._Tweeks._get_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_venda.Returns,
        fns.Function._Tweeks._get_venda.ReturnsType
      >,
    ): void;
    "tweeks.__precario"(
      args: Function._Tweeks.__precario.Args,
      opts?: fns.Function._Tweeks.__precario.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__precario.Returns,
      fns.Function._Tweeks.__precario.ReturnsType,
      void
    >;
    "tweeks.__precario"(
      args: Function._Tweeks.__precario.Args,
      opts?: fns.Function._Tweeks.__precario.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__precario.Returns,
        fns.Function._Tweeks.__precario.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_serie_distribuicao"(
      opts?: fns.Function._Tweeks.funct_load_serie_distribuicao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_serie_distribuicao.Returns,
      fns.Function._Tweeks.funct_load_serie_distribuicao.ReturnsType,
      void
    >;
    "tweeks.funct_load_serie_distribuicao"(
      opts?: fns.Function._Tweeks.funct_load_serie_distribuicao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_serie_distribuicao.Returns,
        fns.Function._Tweeks.funct_load_serie_distribuicao.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_documento"(
      opts?: fns.Function._Tweeks.funct_load_conta_documento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_documento.Returns,
      fns.Function._Tweeks.funct_load_conta_documento.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_documento"(
      opts?: fns.Function._Tweeks.funct_load_conta_documento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_documento.Returns,
        fns.Function._Tweeks.funct_load_conta_documento.ReturnsType
      >,
    ): void;
    "tweeks.__generate_cliente_code"(
      opts?: fns.Function._Tweeks.__generate_cliente_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_cliente_code.Returns,
      fns.Function._Tweeks.__generate_cliente_code.ReturnsType,
      void
    >;
    "tweeks.__generate_cliente_code"(
      opts?: fns.Function._Tweeks.__generate_cliente_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_cliente_code.Returns,
        fns.Function._Tweeks.__generate_cliente_code.ReturnsType
      >,
    ): void;
    "tweeks.__tg_fluxo_on_retalho"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_retalho.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_fluxo_on_retalho.Returns,
      fns.Function._Tweeks.__tg_fluxo_on_retalho.ReturnsType,
      void
    >;
    "tweeks.__tg_fluxo_on_retalho"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_retalho.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_fluxo_on_retalho.Returns,
        fns.Function._Tweeks.__tg_fluxo_on_retalho.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_autorizacao_closeyear"(
      opts?: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_autorizacao_closeyear.Returns,
      fns.Function._Tweeks.funct_change_autorizacao_closeyear.ReturnsType,
      void
    >;
    "tweeks.funct_change_autorizacao_closeyear"(
      opts?: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_autorizacao_closeyear.Returns,
        fns.Function._Tweeks.funct_change_autorizacao_closeyear.ReturnsType
      >,
    ): void;
    "tweeks.___override_auth_funct_autenticacao"(
      opts?: fns.Function._Tweeks.___override_auth_funct_autenticacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.___override_auth_funct_autenticacao.Returns,
      fns.Function._Tweeks.___override_auth_funct_autenticacao.ReturnsType,
      void
    >;
    "tweeks.___override_auth_funct_autenticacao"(
      opts?: fns.Function._Tweeks.___override_auth_funct_autenticacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.___override_auth_funct_autenticacao.Returns,
        fns.Function._Tweeks.___override_auth_funct_autenticacao.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo_exports"(
      opts?: fns.Function._Tweeks.funct_load_artigo_exports.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo_exports.Returns,
      fns.Function._Tweeks.funct_load_artigo_exports.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo_exports"(
      opts?: fns.Function._Tweeks.funct_load_artigo_exports.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo_exports.Returns,
        fns.Function._Tweeks.funct_load_artigo_exports.ReturnsType
      >,
    ): void;
    "tweeks.__tg_venda_before_check"(
      opts?: fns.Function._Tweeks.__tg_venda_before_check.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_venda_before_check.Returns,
      fns.Function._Tweeks.__tg_venda_before_check.ReturnsType,
      void
    >;
    "tweeks.__tg_venda_before_check"(
      opts?: fns.Function._Tweeks.__tg_venda_before_check.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_venda_before_check.Returns,
        fns.Function._Tweeks.__tg_venda_before_check.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_venda_preparado"(
      opts?: fns.Function._Tweeks.funct_change_venda_preparado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_venda_preparado.Returns,
      fns.Function._Tweeks.funct_change_venda_preparado.ReturnsType,
      void
    >;
    "tweeks.funct_change_venda_preparado"(
      opts?: fns.Function._Tweeks.funct_change_venda_preparado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_venda_preparado.Returns,
        fns.Function._Tweeks.funct_change_venda_preparado.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_conta_aberto"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_aberto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_conta_aberto.Returns,
      fns.Function._Tweeks.funct_pos_load_conta_aberto.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_conta_aberto"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_aberto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_conta_aberto.Returns,
        fns.Function._Tweeks.funct_pos_load_conta_aberto.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_venda"(
      opts?: fns.Function._Tweeks.funct_change_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_venda.Returns,
      fns.Function._Tweeks.funct_change_venda.ReturnsType,
      void
    >;
    "tweeks.funct_change_venda"(
      opts?: fns.Function._Tweeks.funct_change_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_venda.Returns,
        fns.Function._Tweeks.funct_change_venda.ReturnsType
      >,
    ): void;
    "tweeks.viewargs_object"(
      opts?: fns.Function._Tweeks.viewargs_object.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.viewargs_object.Returns,
      fns.Function._Tweeks.viewargs_object.ReturnsType,
      void
    >;
    "tweeks.viewargs_object"(
      opts?: fns.Function._Tweeks.viewargs_object.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.viewargs_object.Returns,
        fns.Function._Tweeks.viewargs_object.ReturnsType
      >,
    ): void;
    "tweeks.__cluster_filter_branch"(
      opts?: fns.Function._Tweeks.__cluster_filter_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__cluster_filter_branch.Returns,
      fns.Function._Tweeks.__cluster_filter_branch.ReturnsType,
      void
    >;
    "tweeks.__cluster_filter_branch"(
      opts?: fns.Function._Tweeks.__cluster_filter_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__cluster_filter_branch.Returns,
        fns.Function._Tweeks.__cluster_filter_branch.ReturnsType
      >,
    ): void;
    "tweeks.viewargs_sets"(
      args: Function._Tweeks.viewargs_sets.Args,
      opts?: fns.Function._Tweeks.viewargs_sets.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.viewargs_sets.Returns,
      fns.Function._Tweeks.viewargs_sets.ReturnsType,
      void
    >;
    "tweeks.viewargs_sets"(
      args: Function._Tweeks.viewargs_sets.Args,
      opts?: fns.Function._Tweeks.viewargs_sets.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.viewargs_sets.Returns,
        fns.Function._Tweeks.viewargs_sets.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_posto_simple"(
      opts?: fns.Function._Tweeks.funct_load_posto_simple.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_posto_simple.Returns,
      fns.Function._Tweeks.funct_load_posto_simple.ReturnsType,
      void
    >;
    "tweeks.funct_load_posto_simple"(
      opts?: fns.Function._Tweeks.funct_load_posto_simple.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_posto_simple.Returns,
        fns.Function._Tweeks.funct_load_posto_simple.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_caixa"(
      opts?: fns.Function._Tweeks.funct_load_caixa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_caixa.Returns,
      fns.Function._Tweeks.funct_load_caixa.ReturnsType,
      void
    >;
    "tweeks.funct_load_caixa"(
      opts?: fns.Function._Tweeks.funct_load_caixa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_caixa.Returns,
        fns.Function._Tweeks.funct_load_caixa.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_ean"(
      opts?: fns.Function._Tweeks.funct_reg_ean.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_ean.Returns,
      fns.Function._Tweeks.funct_reg_ean.ReturnsType,
      void
    >;
    "tweeks.funct_reg_ean"(
      opts?: fns.Function._Tweeks.funct_reg_ean.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_ean.Returns,
        fns.Function._Tweeks.funct_reg_ean.ReturnsType
      >,
    ): void;
    "tweeks.__check_conta_data"(
      opts?: fns.Function._Tweeks.__check_conta_data.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__check_conta_data.Returns,
      fns.Function._Tweeks.__check_conta_data.ReturnsType,
      void
    >;
    "tweeks.__check_conta_data"(
      opts?: fns.Function._Tweeks.__check_conta_data.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__check_conta_data.Returns,
        fns.Function._Tweeks.__check_conta_data.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_posto"(
      opts?: fns.Function._Tweeks.funct_reg_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_posto.Returns,
      fns.Function._Tweeks.funct_reg_posto.ReturnsType,
      void
    >;
    "tweeks.funct_reg_posto"(
      opts?: fns.Function._Tweeks.funct_reg_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_posto.Returns,
        fns.Function._Tweeks.funct_reg_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_generate_chave"(
      opts?: fns.Function._Tweeks.funct_generate_chave.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_generate_chave.Returns,
      fns.Function._Tweeks.funct_generate_chave.ReturnsType,
      void
    >;
    "tweeks.funct_generate_chave"(
      opts?: fns.Function._Tweeks.funct_generate_chave.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_generate_chave.Returns,
        fns.Function._Tweeks.funct_generate_chave.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_caixa"(
      opts?: fns.Function._Tweeks.funct_pos_reg_caixa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_caixa.Returns,
      fns.Function._Tweeks.funct_pos_reg_caixa.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_caixa"(
      opts?: fns.Function._Tweeks.funct_pos_reg_caixa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_caixa.Returns,
        fns.Function._Tweeks.funct_pos_reg_caixa.ReturnsType
      >,
    ): void;
    "tweeks.main"(
      opts?: fns.Function._Tweeks.main.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.main.Returns,
      fns.Function._Tweeks.main.ReturnsType,
      void
    >;
    "tweeks.main"(
      opts?: fns.Function._Tweeks.main.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.main.Returns,
        fns.Function._Tweeks.main.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_caixa_auth"(
      opts?: fns.Function._Tweeks.funct_pos_load_caixa_auth.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_caixa_auth.Returns,
      fns.Function._Tweeks.funct_pos_load_caixa_auth.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_caixa_auth"(
      opts?: fns.Function._Tweeks.funct_pos_load_caixa_auth.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_caixa_auth.Returns,
        fns.Function._Tweeks.funct_pos_load_caixa_auth.ReturnsType
      >,
    ): void;
    "tweeks.__branch_uid"(
      opts?: fns.Function._Tweeks.__branch_uid.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__branch_uid.Returns,
      fns.Function._Tweeks.__branch_uid.ReturnsType,
      void
    >;
    "tweeks.__branch_uid"(
      opts?: fns.Function._Tweeks.__branch_uid.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__branch_uid.Returns,
        fns.Function._Tweeks.__branch_uid.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_estatistica_posto"(
      opts?: fns.Function._Tweeks.funct_report_estatistica_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_estatistica_posto.Returns,
      fns.Function._Tweeks.funct_report_estatistica_posto.ReturnsType,
      void
    >;
    "tweeks.funct_report_estatistica_posto"(
      opts?: fns.Function._Tweeks.funct_report_estatistica_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_estatistica_posto.Returns,
        fns.Function._Tweeks.funct_report_estatistica_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_taxa"(
      opts?: fns.Function._Tweeks.funct_reg_taxa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_taxa.Returns,
      fns.Function._Tweeks.funct_reg_taxa.ReturnsType,
      void
    >;
    "tweeks.funct_reg_taxa"(
      opts?: fns.Function._Tweeks.funct_reg_taxa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_taxa.Returns,
        fns.Function._Tweeks.funct_reg_taxa.ReturnsType
      >,
    ): void;
    "tweeks.__get_branch"(
      args: Function._Tweeks.__get_branch.Args,
      opts?: fns.Function._Tweeks.__get_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__get_branch.Returns,
      fns.Function._Tweeks.__get_branch.ReturnsType,
      void
    >;
    "tweeks.__get_branch"(
      args: Function._Tweeks.__get_branch.Args,
      opts?: fns.Function._Tweeks.__get_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__get_branch.Returns,
        fns.Function._Tweeks.__get_branch.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_conta_dia"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_dia.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_conta_dia.Returns,
      fns.Function._Tweeks.funct_pos_load_conta_dia.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_conta_dia"(
      opts?: fns.Function._Tweeks.funct_pos_load_conta_dia.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_conta_dia.Returns,
        fns.Function._Tweeks.funct_pos_load_conta_dia.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_colaborador"(
      opts?: fns.Function._Tweeks.funct_load_colaborador.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_colaborador.Returns,
      fns.Function._Tweeks.funct_load_colaborador.ReturnsType,
      void
    >;
    "tweeks.funct_load_colaborador"(
      opts?: fns.Function._Tweeks.funct_load_colaborador.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_colaborador.Returns,
        fns.Function._Tweeks.funct_load_colaborador.ReturnsType
      >,
    ): void;
    "tweeks.__conta_adjust"(
      opts?: fns.Function._Tweeks.__conta_adjust.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__conta_adjust.Returns,
      fns.Function._Tweeks.__conta_adjust.ReturnsType,
      void
    >;
    "tweeks.__conta_adjust"(
      opts?: fns.Function._Tweeks.__conta_adjust.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__conta_adjust.Returns,
        fns.Function._Tweeks.__conta_adjust.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_espaco"(
      opts?: fns.Function._Tweeks.funct_reg_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_espaco.Returns,
      fns.Function._Tweeks.funct_reg_espaco.ReturnsType,
      void
    >;
    "tweeks.funct_reg_espaco"(
      opts?: fns.Function._Tweeks.funct_reg_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_espaco.Returns,
        fns.Function._Tweeks.funct_reg_espaco.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_mesa"(
      opts?: fns.Function._Tweeks.funct_load_mesa.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_mesa.Returns,
      fns.Function._Tweeks.funct_load_mesa.ReturnsType,
      void
    >;
    "tweeks.funct_load_mesa"(
      opts?: fns.Function._Tweeks.funct_load_mesa.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_mesa.Returns,
        fns.Function._Tweeks.funct_load_mesa.ReturnsType
      >,
    ): void;
    "tweeks.__generate_guia_code"(
      opts?: fns.Function._Tweeks.__generate_guia_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_guia_code.Returns,
      fns.Function._Tweeks.__generate_guia_code.ReturnsType,
      void
    >;
    "tweeks.__generate_guia_code"(
      opts?: fns.Function._Tweeks.__generate_guia_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_guia_code.Returns,
        fns.Function._Tweeks.__generate_guia_code.ReturnsType
      >,
    ): void;
    "tweeks.___override_auth_funct_load_menu"(
      opts?: fns.Function._Tweeks.___override_auth_funct_load_menu.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.___override_auth_funct_load_menu.Returns,
      fns.Function._Tweeks.___override_auth_funct_load_menu.ReturnsType,
      void
    >;
    "tweeks.___override_auth_funct_load_menu"(
      opts?: fns.Function._Tweeks.___override_auth_funct_load_menu.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.___override_auth_funct_load_menu.Returns,
        fns.Function._Tweeks.___override_auth_funct_load_menu.ReturnsType
      >,
    ): void;
    "tweeks.__generate_retalho_code"(
      opts?: fns.Function._Tweeks.__generate_retalho_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_retalho_code.Returns,
      fns.Function._Tweeks.__generate_retalho_code.ReturnsType,
      void
    >;
    "tweeks.__generate_retalho_code"(
      opts?: fns.Function._Tweeks.__generate_retalho_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_retalho_code.Returns,
        fns.Function._Tweeks.__generate_retalho_code.ReturnsType
      >,
    ): void;
    "tweeks.__sets_generate_documento"(
      opts?: fns.Function._Tweeks.__sets_generate_documento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__sets_generate_documento.Returns,
      fns.Function._Tweeks.__sets_generate_documento.ReturnsType,
      void
    >;
    "tweeks.__sets_generate_documento"(
      opts?: fns.Function._Tweeks.__sets_generate_documento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__sets_generate_documento.Returns,
        fns.Function._Tweeks.__sets_generate_documento.ReturnsType
      >,
    ): void;
    "tweeks._get_branch_by_espaco"(
      args: Function._Tweeks._get_branch_by_espaco.Args,
      opts?: fns.Function._Tweeks._get_branch_by_espaco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_branch_by_espaco.Returns,
      fns.Function._Tweeks._get_branch_by_espaco.ReturnsType,
      void
    >;
    "tweeks._get_branch_by_espaco"(
      args: Function._Tweeks._get_branch_by_espaco.Args,
      opts?: fns.Function._Tweeks._get_branch_by_espaco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_branch_by_espaco.Returns,
        fns.Function._Tweeks._get_branch_by_espaco.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_venda_conta"(
      opts?: fns.Function._Tweeks.funct_report_venda_conta.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_venda_conta.Returns,
      fns.Function._Tweeks.funct_report_venda_conta.ReturnsType,
      void
    >;
    "tweeks.funct_report_venda_conta"(
      opts?: fns.Function._Tweeks.funct_report_venda_conta.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_venda_conta.Returns,
        fns.Function._Tweeks.funct_report_venda_conta.ReturnsType
      >,
    ): void;
    "tweeks.viewargs_show"(
      opts?: fns.Function._Tweeks.viewargs_show.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.viewargs_show.Returns,
      fns.Function._Tweeks.viewargs_show.ReturnsType,
      void
    >;
    "tweeks.viewargs_show"(
      opts?: fns.Function._Tweeks.viewargs_show.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.viewargs_show.Returns,
        fns.Function._Tweeks.viewargs_show.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_reg_retalho"(
      opts?: fns.Function._Tweeks.funct_pos_reg_retalho.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_reg_retalho.Returns,
      fns.Function._Tweeks.funct_pos_reg_retalho.ReturnsType,
      void
    >;
    "tweeks.funct_pos_reg_retalho"(
      opts?: fns.Function._Tweeks.funct_pos_reg_retalho.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_reg_retalho.Returns,
        fns.Function._Tweeks.funct_pos_reg_retalho.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_imposto"(
      opts?: fns.Function._Tweeks.funct_reg_imposto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_imposto.Returns,
      fns.Function._Tweeks.funct_reg_imposto.ReturnsType,
      void
    >;
    "tweeks.funct_reg_imposto"(
      opts?: fns.Function._Tweeks.funct_reg_imposto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_imposto.Returns,
        fns.Function._Tweeks.funct_reg_imposto.ReturnsType
      >,
    ): void;
    "tweeks.__tg_fluxo_on_entrada"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_entrada.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_fluxo_on_entrada.Returns,
      fns.Function._Tweeks.__tg_fluxo_on_entrada.ReturnsType,
      void
    >;
    "tweeks.__tg_fluxo_on_entrada"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_entrada.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_fluxo_on_entrada.Returns,
        fns.Function._Tweeks.__tg_fluxo_on_entrada.ReturnsType
      >,
    ): void;
    "tweeks.__tg_fluxo_on_acerto"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_acerto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_fluxo_on_acerto.Returns,
      fns.Function._Tweeks.__tg_fluxo_on_acerto.ReturnsType,
      void
    >;
    "tweeks.__tg_fluxo_on_acerto"(
      opts?: fns.Function._Tweeks.__tg_fluxo_on_acerto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_fluxo_on_acerto.Returns,
        fns.Function._Tweeks.__tg_fluxo_on_acerto.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_transacao_movimentacao_posto"(
      opts?: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Returns,
      fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.ReturnsType,
      void
    >;
    "tweeks.funct_reg_transacao_movimentacao_posto"(
      opts?: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Returns,
        fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_sets_autorizacao"(
      opts?: fns.Function._Tweeks.funct_sets_autorizacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_sets_autorizacao.Returns,
      fns.Function._Tweeks.funct_sets_autorizacao.ReturnsType,
      void
    >;
    "tweeks.funct_sets_autorizacao"(
      opts?: fns.Function._Tweeks.funct_sets_autorizacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_sets_autorizacao.Returns,
        fns.Function._Tweeks.funct_sets_autorizacao.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_cambio"(
      opts?: fns.Function._Tweeks.funct_reg_cambio.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_cambio.Returns,
      fns.Function._Tweeks.funct_reg_cambio.ReturnsType,
      void
    >;
    "tweeks.funct_reg_cambio"(
      opts?: fns.Function._Tweeks.funct_reg_cambio.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_cambio.Returns,
        fns.Function._Tweeks.funct_reg_cambio.ReturnsType
      >,
    ): void;
    "tweeks._get_posto"(
      opts?: fns.Function._Tweeks._get_posto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks._get_posto.Returns,
      fns.Function._Tweeks._get_posto.ReturnsType,
      void
    >;
    "tweeks._get_posto"(
      opts?: fns.Function._Tweeks._get_posto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks._get_posto.Returns,
        fns.Function._Tweeks._get_posto.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_acerto"(
      opts?: fns.Function._Tweeks.funct_load_acerto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_acerto.Returns,
      fns.Function._Tweeks.funct_load_acerto.ReturnsType,
      void
    >;
    "tweeks.funct_load_acerto"(
      opts?: fns.Function._Tweeks.funct_load_acerto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_acerto.Returns,
        fns.Function._Tweeks.funct_load_acerto.ReturnsType
      >,
    ): void;
    "tweeks.__tg_venda_before_sets"(
      opts?: fns.Function._Tweeks.__tg_venda_before_sets.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_venda_before_sets.Returns,
      fns.Function._Tweeks.__tg_venda_before_sets.ReturnsType,
      void
    >;
    "tweeks.__tg_venda_before_sets"(
      opts?: fns.Function._Tweeks.__tg_venda_before_sets.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_venda_before_sets.Returns,
        fns.Function._Tweeks.__tg_venda_before_sets.ReturnsType
      >,
    ): void;
    "tweeks.__tg_create_lancamento"(
      opts?: fns.Function._Tweeks.__tg_create_lancamento.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__tg_create_lancamento.Returns,
      fns.Function._Tweeks.__tg_create_lancamento.ReturnsType,
      void
    >;
    "tweeks.__tg_create_lancamento"(
      opts?: fns.Function._Tweeks.__tg_create_lancamento.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__tg_create_lancamento.Returns,
        fns.Function._Tweeks.__tg_create_lancamento.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_report_parametrized_filter"(
      opts?: fns.Function._Tweeks.funct_load_report_parametrized_filter.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_report_parametrized_filter.Returns,
      fns.Function._Tweeks.funct_load_report_parametrized_filter.ReturnsType,
      void
    >;
    "tweeks.funct_load_report_parametrized_filter"(
      opts?: fns.Function._Tweeks.funct_load_report_parametrized_filter.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_report_parametrized_filter.Returns,
        fns.Function._Tweeks.funct_load_report_parametrized_filter.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_cliente"(
      opts?: fns.Function._Tweeks.funct_load_cliente.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_cliente.Returns,
      fns.Function._Tweeks.funct_load_cliente.ReturnsType,
      void
    >;
    "tweeks.funct_load_cliente"(
      opts?: fns.Function._Tweeks.funct_load_cliente.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_cliente.Returns,
        fns.Function._Tweeks.funct_load_cliente.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_cambio_ativo"(
      opts?: fns.Function._Tweeks.funct_load_cambio_ativo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_cambio_ativo.Returns,
      fns.Function._Tweeks.funct_load_cambio_ativo.ReturnsType,
      void
    >;
    "tweeks.funct_load_cambio_ativo"(
      opts?: fns.Function._Tweeks.funct_load_cambio_ativo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_cambio_ativo.Returns,
        fns.Function._Tweeks.funct_load_cambio_ativo.ReturnsType
      >,
    ): void;
    "tweeks.__lote"(
      opts?: fns.Function._Tweeks.__lote.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__lote.Returns,
      fns.Function._Tweeks.__lote.ReturnsType,
      void
    >;
    "tweeks.__lote"(
      opts?: fns.Function._Tweeks.__lote.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__lote.Returns,
        fns.Function._Tweeks.__lote.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_change_conta_proforma"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_proforma.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_change_conta_proforma.Returns,
      fns.Function._Tweeks.funct_pos_change_conta_proforma.ReturnsType,
      void
    >;
    "tweeks.funct_pos_change_conta_proforma"(
      opts?: fns.Function._Tweeks.funct_pos_change_conta_proforma.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_change_conta_proforma.Returns,
        fns.Function._Tweeks.funct_pos_change_conta_proforma.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_espaco_migrate"(
      opts?: fns.Function._Tweeks.funct_change_espaco_migrate.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_espaco_migrate.Returns,
      fns.Function._Tweeks.funct_change_espaco_migrate.ReturnsType,
      void
    >;
    "tweeks.funct_change_espaco_migrate"(
      opts?: fns.Function._Tweeks.funct_change_espaco_migrate.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_espaco_migrate.Returns,
        fns.Function._Tweeks.funct_change_espaco_migrate.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_notacredito"(
      opts?: fns.Function._Tweeks.funct_load_conta_notacredito.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_notacredito.Returns,
      fns.Function._Tweeks.funct_load_conta_notacredito.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_notacredito"(
      opts?: fns.Function._Tweeks.funct_load_conta_notacredito.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_notacredito.Returns,
        fns.Function._Tweeks.funct_load_conta_notacredito.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_stoks"(
      opts?: fns.Function._Tweeks.funct_load_stoks.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_stoks.Returns,
      fns.Function._Tweeks.funct_load_stoks.ReturnsType,
      void
    >;
    "tweeks.funct_load_stoks"(
      opts?: fns.Function._Tweeks.funct_load_stoks.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_stoks.Returns,
        fns.Function._Tweeks.funct_load_stoks.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_branch"(
      opts?: fns.Function._Tweeks.funct_load_branch.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_branch.Returns,
      fns.Function._Tweeks.funct_load_branch.ReturnsType,
      void
    >;
    "tweeks.funct_load_branch"(
      opts?: fns.Function._Tweeks.funct_load_branch.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_branch.Returns,
        fns.Function._Tweeks.funct_load_branch.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_serie_distribuicao_pos"(
      opts?: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Returns,
      fns.Function._Tweeks.funct_load_serie_distribuicao_pos.ReturnsType,
      void
    >;
    "tweeks.funct_load_serie_distribuicao_pos"(
      opts?: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Returns,
        fns.Function._Tweeks.funct_load_serie_distribuicao_pos.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_change_caixa_close"(
      opts?: fns.Function._Tweeks.funct_pos_change_caixa_close.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_change_caixa_close.Returns,
      fns.Function._Tweeks.funct_pos_change_caixa_close.ReturnsType,
      void
    >;
    "tweeks.funct_pos_change_caixa_close"(
      opts?: fns.Function._Tweeks.funct_pos_change_caixa_close.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_change_caixa_close.Returns,
        fns.Function._Tweeks.funct_pos_change_caixa_close.ReturnsType
      >,
    ): void;
    "tweeks.sets_tipoimposto"(
      opts?: fns.Function._Tweeks.sets_tipoimposto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.sets_tipoimposto.Returns,
      fns.Function._Tweeks.sets_tipoimposto.ReturnsType,
      void
    >;
    "tweeks.sets_tipoimposto"(
      opts?: fns.Function._Tweeks.sets_tipoimposto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.sets_tipoimposto.Returns,
        fns.Function._Tweeks.sets_tipoimposto.ReturnsType
      >,
    ): void;
    "tweeks.__sync_branch_map"(
      opts?: fns.Function._Tweeks.__sync_branch_map.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__sync_branch_map.Returns,
      fns.Function._Tweeks.__sync_branch_map.ReturnsType,
      void
    >;
    "tweeks.__sync_branch_map"(
      opts?: fns.Function._Tweeks.__sync_branch_map.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__sync_branch_map.Returns,
        fns.Function._Tweeks.__sync_branch_map.ReturnsType
      >,
    ): void;
    "tweeks.__generate_artigo_code"(
      opts?: fns.Function._Tweeks.__generate_artigo_code.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__generate_artigo_code.Returns,
      fns.Function._Tweeks.__generate_artigo_code.ReturnsType,
      void
    >;
    "tweeks.__generate_artigo_code"(
      opts?: fns.Function._Tweeks.__generate_artigo_code.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__generate_artigo_code.Returns,
        fns.Function._Tweeks.__generate_artigo_code.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_estatistica_venda"(
      opts?: fns.Function._Tweeks.funct_report_estatistica_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_estatistica_venda.Returns,
      fns.Function._Tweeks.funct_report_estatistica_venda.ReturnsType,
      void
    >;
    "tweeks.funct_report_estatistica_venda"(
      opts?: fns.Function._Tweeks.funct_report_estatistica_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_estatistica_venda.Returns,
        fns.Function._Tweeks.funct_report_estatistica_venda.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_link_tecla"(
      opts?: fns.Function._Tweeks.funct_reg_link_tecla.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_link_tecla.Returns,
      fns.Function._Tweeks.funct_reg_link_tecla.ReturnsType,
      void
    >;
    "tweeks.funct_reg_link_tecla"(
      opts?: fns.Function._Tweeks.funct_reg_link_tecla.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_link_tecla.Returns,
        fns.Function._Tweeks.funct_reg_link_tecla.ReturnsType
      >,
    ): void;
    "tweeks.funct_reg_acerto"(
      opts?: fns.Function._Tweeks.funct_reg_acerto.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_reg_acerto.Returns,
      fns.Function._Tweeks.funct_reg_acerto.ReturnsType,
      void
    >;
    "tweeks.funct_reg_acerto"(
      opts?: fns.Function._Tweeks.funct_reg_acerto.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_reg_acerto.Returns,
        fns.Function._Tweeks.funct_reg_acerto.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_posto_by_endereco"(
      opts?: fns.Function._Tweeks.funct_load_posto_by_endereco.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_posto_by_endereco.Returns,
      fns.Function._Tweeks.funct_load_posto_by_endereco.ReturnsType,
      void
    >;
    "tweeks.funct_load_posto_by_endereco"(
      opts?: fns.Function._Tweeks.funct_load_posto_by_endereco.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_posto_by_endereco.Returns,
        fns.Function._Tweeks.funct_load_posto_by_endereco.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_preparacao"(
      opts?: fns.Function._Tweeks.funct_load_conta_preparacao.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_preparacao.Returns,
      fns.Function._Tweeks.funct_load_conta_preparacao.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_preparacao"(
      opts?: fns.Function._Tweeks.funct_load_conta_preparacao.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_preparacao.Returns,
        fns.Function._Tweeks.funct_load_conta_preparacao.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_artigo"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_artigo.Returns,
      fns.Function._Tweeks.funct_pos_load_artigo.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_artigo"(
      opts?: fns.Function._Tweeks.funct_pos_load_artigo.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_artigo.Returns,
        fns.Function._Tweeks.funct_pos_load_artigo.ReturnsType
      >,
    ): void;
    "tweeks.funct_pos_load_class"(
      opts?: fns.Function._Tweeks.funct_pos_load_class.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_pos_load_class.Returns,
      fns.Function._Tweeks.funct_pos_load_class.ReturnsType,
      void
    >;
    "tweeks.funct_pos_load_class"(
      opts?: fns.Function._Tweeks.funct_pos_load_class.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_pos_load_class.Returns,
        fns.Function._Tweeks.funct_pos_load_class.ReturnsType
      >,
    ): void;
    "tweeks.funct_change_tipoimposto_estado"(
      opts?: fns.Function._Tweeks.funct_change_tipoimposto_estado.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_change_tipoimposto_estado.Returns,
      fns.Function._Tweeks.funct_change_tipoimposto_estado.ReturnsType,
      void
    >;
    "tweeks.funct_change_tipoimposto_estado"(
      opts?: fns.Function._Tweeks.funct_change_tipoimposto_estado.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_change_tipoimposto_estado.Returns,
        fns.Function._Tweeks.funct_change_tipoimposto_estado.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_artigo_associar"(
      opts?: fns.Function._Tweeks.funct_load_artigo_associar.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_artigo_associar.Returns,
      fns.Function._Tweeks.funct_load_artigo_associar.ReturnsType,
      void
    >;
    "tweeks.funct_load_artigo_associar"(
      opts?: fns.Function._Tweeks.funct_load_artigo_associar.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_artigo_associar.Returns,
        fns.Function._Tweeks.funct_load_artigo_associar.ReturnsType
      >,
    ): void;
    "tweeks.__fluxo_scan"(
      opts?: fns.Function._Tweeks.__fluxo_scan.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.__fluxo_scan.Returns,
      fns.Function._Tweeks.__fluxo_scan.ReturnsType,
      void
    >;
    "tweeks.__fluxo_scan"(
      opts?: fns.Function._Tweeks.__fluxo_scan.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.__fluxo_scan.Returns,
        fns.Function._Tweeks.__fluxo_scan.ReturnsType
      >,
    ): void;
    "tweeks.funct_load_conta_documento_limit"(
      opts?: fns.Function._Tweeks.funct_load_conta_documento_limit.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_load_conta_documento_limit.Returns,
      fns.Function._Tweeks.funct_load_conta_documento_limit.ReturnsType,
      void
    >;
    "tweeks.funct_load_conta_documento_limit"(
      opts?: fns.Function._Tweeks.funct_load_conta_documento_limit.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_load_conta_documento_limit.Returns,
        fns.Function._Tweeks.funct_load_conta_documento_limit.ReturnsType
      >,
    ): void;
    "tweeks.funct_report_venda"(
      opts?: fns.Function._Tweeks.funct_report_venda.Options,
    ): db.ResponseOfResource<
      "PRIVATE",
      fns.Function._Tweeks.funct_report_venda.Returns,
      fns.Function._Tweeks.funct_report_venda.ReturnsType,
      void
    >;
    "tweeks.funct_report_venda"(
      opts?: fns.Function._Tweeks.funct_report_venda.Options,
      onResult?: db.OnResourceResponse<
        "PRIVATE",
        fns.Function._Tweeks.funct_report_venda.Returns,
        fns.Function._Tweeks.funct_report_venda.ReturnsType
      >,
    ): void;
  }
}

export default mfns;
