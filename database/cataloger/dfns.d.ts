import { db } from "kitres";
import tns from "./tns";
import fns from "./fns";

namespace dfns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export namespace declare {
    export namespace _Cluster {
      export interface FunctionDefinition {
        __user_map(
          opts?: fns.Function._Cluster.__user_map.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__user_map.Returns,
          fns.Function._Cluster.__user_map.ReturnsType,
          void
        >;
        __user_map(
          opts?: fns.Function._Cluster.__user_map.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__user_map.Returns,
            fns.Function._Cluster.__user_map.ReturnsType
          >,
        ): void;
        __tg_share_guard_upgrade(
          opts?: fns.Function._Cluster.__tg_share_guard_upgrade.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_share_guard_upgrade.Returns,
          fns.Function._Cluster.__tg_share_guard_upgrade.ReturnsType,
          void
        >;
        __tg_share_guard_upgrade(
          opts?: fns.Function._Cluster.__tg_share_guard_upgrade.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_share_guard_upgrade.Returns,
            fns.Function._Cluster.__tg_share_guard_upgrade.ReturnsType
          >,
        ): void;
        __pull(
          opts?: fns.Function._Cluster.__pull.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__pull.Returns,
          fns.Function._Cluster.__pull.ReturnsType,
          void
        >;
        __pull(
          opts?: fns.Function._Cluster.__pull.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__pull.Returns,
            fns.Function._Cluster.__pull.ReturnsType
          >,
        ): void;
        object_filter(
          opts?: fns.Function._Cluster.object_filter.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.object_filter.Returns,
          fns.Function._Cluster.object_filter.ReturnsType,
          void
        >;
        object_filter(
          opts?: fns.Function._Cluster.object_filter.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.object_filter.Returns,
            fns.Function._Cluster.object_filter.ReturnsType
          >,
        ): void;
        create_resource(
          opts?: fns.Function._Cluster.create_resource.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.create_resource.Returns,
          fns.Function._Cluster.create_resource.ReturnsType,
          void
        >;
        create_resource(
          opts?: fns.Function._Cluster.create_resource.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.create_resource.Returns,
            fns.Function._Cluster.create_resource.ReturnsType
          >,
        ): void;
        __tg_share_truncate(
          opts?: fns.Function._Cluster.__tg_share_truncate.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_share_truncate.Returns,
          fns.Function._Cluster.__tg_share_truncate.ReturnsType,
          void
        >;
        __tg_share_truncate(
          opts?: fns.Function._Cluster.__tg_share_truncate.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_share_truncate.Returns,
            fns.Function._Cluster.__tg_share_truncate.ReturnsType
          >,
        ): void;
        reduce(
          args: Function._Cluster.reduce.Args,
          opts?: fns.Function._Cluster.reduce.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.reduce.Returns,
          fns.Function._Cluster.reduce.ReturnsType,
          void
        >;
        reduce(
          args: Function._Cluster.reduce.Args,
          opts?: fns.Function._Cluster.reduce.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.reduce.Returns,
            fns.Function._Cluster.reduce.ReturnsType
          >,
        ): void;
        sets_resources_downloaded(
          opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._Sets_Resources_Downloaded_16619.Returns,
          fns.Function._Cluster._Sets_Resources_Downloaded_16619.ReturnsType,
          void
        >;
        sets_resources_downloaded(
          opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16619.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._Sets_Resources_Downloaded_16619.Returns,
            fns.Function._Cluster._Sets_Resources_Downloaded_16619.ReturnsType
          >,
        ): void;
        load_resources_pendents(
          opts?: fns.Function._Cluster.load_resources_pendents.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_resources_pendents.Returns,
          fns.Function._Cluster.load_resources_pendents.ReturnsType,
          void
        >;
        load_resources_pendents(
          opts?: fns.Function._Cluster.load_resources_pendents.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_resources_pendents.Returns,
            fns.Function._Cluster.load_resources_pendents.ReturnsType
          >,
        ): void;
        load_clusters_configs_to_child(
          opts?: fns.Function._Cluster.load_clusters_configs_to_child.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_clusters_configs_to_child.Returns,
          fns.Function._Cluster.load_clusters_configs_to_child.ReturnsType,
          void
        >;
        load_clusters_configs_to_child(
          opts?: fns.Function._Cluster.load_clusters_configs_to_child.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_clusters_configs_to_child.Returns,
            fns.Function._Cluster.load_clusters_configs_to_child.ReturnsType
          >,
        ): void;
        push(
          opts?: fns.Function._Cluster.push.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.push.Returns,
          fns.Function._Cluster.push.ReturnsType,
          void
        >;
        push(
          opts?: fns.Function._Cluster.push.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.push.Returns,
            fns.Function._Cluster.push.ReturnsType
          >,
        ): void;
        __tg_version_commit(
          opts?: fns.Function._Cluster.__tg_version_commit.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_version_commit.Returns,
          fns.Function._Cluster.__tg_version_commit.ReturnsType,
          void
        >;
        __tg_version_commit(
          opts?: fns.Function._Cluster.__tg_version_commit.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_version_commit.Returns,
            fns.Function._Cluster.__tg_version_commit.ReturnsType
          >,
        ): void;
        __format(
          args: Function._Cluster.__format.Args,
          opts?: fns.Function._Cluster.__format.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__format.Returns,
          fns.Function._Cluster.__format.ReturnsType,
          void
        >;
        __format(
          args: Function._Cluster.__format.Args,
          opts?: fns.Function._Cluster.__format.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__format.Returns,
            fns.Function._Cluster.__format.ReturnsType
          >,
        ): void;
        __get(
          args: Function._Cluster.__get.Args,
          opts?: fns.Function._Cluster.__get.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__get.Returns,
          fns.Function._Cluster.__get.ReturnsType,
          void
        >;
        __get(
          args: Function._Cluster.__get.Args,
          opts?: fns.Function._Cluster.__get.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__get.Returns,
            fns.Function._Cluster.__get.ReturnsType
          >,
        ): void;
        __tg_before_create_filter(
          opts?: fns.Function._Cluster.__tg_before_create_filter.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_before_create_filter.Returns,
          fns.Function._Cluster.__tg_before_create_filter.ReturnsType,
          void
        >;
        __tg_before_create_filter(
          opts?: fns.Function._Cluster.__tg_before_create_filter.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_before_create_filter.Returns,
            fns.Function._Cluster.__tg_before_create_filter.ReturnsType
          >,
        ): void;
        __create_api(
          opts?: fns.Function._Cluster.__create_api.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__create_api.Returns,
          fns.Function._Cluster.__create_api.ReturnsType,
          void
        >;
        __create_api(
          opts?: fns.Function._Cluster.__create_api.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__create_api.Returns,
            fns.Function._Cluster.__create_api.ReturnsType
          >,
        ): void;
        __rows(
          args: Function._Cluster.__rows.Args,
          opts?: fns.Function._Cluster.__rows.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__rows.Returns,
          fns.Function._Cluster.__rows.ReturnsType,
          void
        >;
        __rows(
          args: Function._Cluster.__rows.Args,
          opts?: fns.Function._Cluster.__rows.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__rows.Returns,
            fns.Function._Cluster.__rows.ReturnsType
          >,
        ): void;
        __tg_version_add_when_update(
          opts?: fns.Function._Cluster.__tg_version_add_when_update.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_version_add_when_update.Returns,
          fns.Function._Cluster.__tg_version_add_when_update.ReturnsType,
          void
        >;
        __tg_version_add_when_update(
          opts?: fns.Function._Cluster.__tg_version_add_when_update.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_version_add_when_update.Returns,
            fns.Function._Cluster.__tg_version_add_when_update.ReturnsType
          >,
        ): void;
        load_clusters(
          opts?: fns.Function._Cluster.load_clusters.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_clusters.Returns,
          fns.Function._Cluster.load_clusters.ReturnsType,
          void
        >;
        load_clusters(
          opts?: fns.Function._Cluster.load_clusters.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_clusters.Returns,
            fns.Function._Cluster.load_clusters.ReturnsType
          >,
        ): void;
        funct_load_configs(
          opts?: fns.Function._Cluster.funct_load_configs.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.funct_load_configs.Returns,
          fns.Function._Cluster.funct_load_configs.ReturnsType,
          void
        >;
        funct_load_configs(
          opts?: fns.Function._Cluster.funct_load_configs.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.funct_load_configs.Returns,
            fns.Function._Cluster.funct_load_configs.ReturnsType
          >,
        ): void;
        __add(
          opts?: fns.Function._Cluster.__add.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__add.Returns,
          fns.Function._Cluster.__add.ReturnsType,
          void
        >;
        __add(
          opts?: fns.Function._Cluster.__add.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__add.Returns,
            fns.Function._Cluster.__add.ReturnsType
          >,
        ): void;
        pull(
          opts?: fns.Function._Cluster.pull.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.pull.Returns,
          fns.Function._Cluster.pull.ReturnsType,
          void
        >;
        pull(
          opts?: fns.Function._Cluster.pull.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.pull.Returns,
            fns.Function._Cluster.pull.ReturnsType
          >,
        ): void;
        __format_proc(
          args: Function._Cluster.__format_proc.Args,
          opts?: fns.Function._Cluster.__format_proc.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__format_proc.Returns,
          fns.Function._Cluster.__format_proc.ReturnsType,
          void
        >;
        __format_proc(
          args: Function._Cluster.__format_proc.Args,
          opts?: fns.Function._Cluster.__format_proc.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__format_proc.Returns,
            fns.Function._Cluster.__format_proc.ReturnsType
          >,
        ): void;
        __create_object_version(
          args: Function._Cluster.__create_object_version.Args,
          opts?: fns.Function._Cluster.__create_object_version.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__create_object_version.Returns,
          fns.Function._Cluster.__create_object_version.ReturnsType,
          void
        >;
        __create_object_version(
          args: Function._Cluster.__create_object_version.Args,
          opts?: fns.Function._Cluster.__create_object_version.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__create_object_version.Returns,
            fns.Function._Cluster.__create_object_version.ReturnsType
          >,
        ): void;
        status(
          opts?: fns.Function._Cluster.status.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.status.Returns,
          fns.Function._Cluster.status.ReturnsType,
          void
        >;
        status(
          opts?: fns.Function._Cluster.status.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.status.Returns,
            fns.Function._Cluster.status.ReturnsType
          >,
        ): void;
        load_clusters_local_as_remotes(
          opts?: fns.Function._Cluster.load_clusters_local_as_remotes.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_clusters_local_as_remotes.Returns,
          fns.Function._Cluster.load_clusters_local_as_remotes.ReturnsType,
          void
        >;
        load_clusters_local_as_remotes(
          opts?: fns.Function._Cluster.load_clusters_local_as_remotes.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_clusters_local_as_remotes.Returns,
            fns.Function._Cluster.load_clusters_local_as_remotes.ReturnsType
          >,
        ): void;
        declare_filter(
          args: Function._Cluster.declare_filter.Args,
          opts?: fns.Function._Cluster.declare_filter.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.declare_filter.Returns,
          fns.Function._Cluster.declare_filter.ReturnsType,
          void
        >;
        declare_filter(
          args: Function._Cluster.declare_filter.Args,
          opts?: fns.Function._Cluster.declare_filter.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.declare_filter.Returns,
            fns.Function._Cluster.declare_filter.ReturnsType
          >,
        ): void;
        __tg_version_add_when_insert(
          opts?: fns.Function._Cluster.__tg_version_add_when_insert.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_version_add_when_insert.Returns,
          fns.Function._Cluster.__tg_version_add_when_insert.ReturnsType,
          void
        >;
        __tg_version_add_when_insert(
          opts?: fns.Function._Cluster.__tg_version_add_when_insert.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_version_add_when_insert.Returns,
            fns.Function._Cluster.__tg_version_add_when_insert.ReturnsType
          >,
        ): void;
        __generate_cluster_code(
          opts?: fns.Function._Cluster.__generate_cluster_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__generate_cluster_code.Returns,
          fns.Function._Cluster.__generate_cluster_code.ReturnsType,
          void
        >;
        __generate_cluster_code(
          opts?: fns.Function._Cluster.__generate_cluster_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__generate_cluster_code.Returns,
            fns.Function._Cluster.__generate_cluster_code.ReturnsType
          >,
        ): void;
        unlink_cluster(
          opts?: fns.Function._Cluster.unlink_cluster.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.unlink_cluster.Returns,
          fns.Function._Cluster.unlink_cluster.ReturnsType,
          void
        >;
        unlink_cluster(
          opts?: fns.Function._Cluster.unlink_cluster.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.unlink_cluster.Returns,
            fns.Function._Cluster.unlink_cluster.ReturnsType
          >,
        ): void;
        __collect_change(
          args: Function._Cluster.__collect_change.Args,
          opts?: fns.Function._Cluster.__collect_change.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__collect_change.Returns,
          fns.Function._Cluster.__collect_change.ReturnsType,
          void
        >;
        __collect_change(
          args: Function._Cluster.__collect_change.Args,
          opts?: fns.Function._Cluster.__collect_change.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__collect_change.Returns,
            fns.Function._Cluster.__collect_change.ReturnsType
          >,
        ): void;
        _get_cluster(
          args: Function._Cluster._get_cluster.Args,
          opts?: fns.Function._Cluster._get_cluster.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._get_cluster.Returns,
          fns.Function._Cluster._get_cluster.ReturnsType,
          void
        >;
        _get_cluster(
          args: Function._Cluster._get_cluster.Args,
          opts?: fns.Function._Cluster._get_cluster.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._get_cluster.Returns,
            fns.Function._Cluster._get_cluster.ReturnsType
          >,
        ): void;
        next(
          opts?: fns.Function._Cluster.next.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.next.Returns,
          fns.Function._Cluster.next.ReturnsType,
          void
        >;
        next(
          opts?: fns.Function._Cluster.next.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.next.Returns,
            fns.Function._Cluster.next.ReturnsType
          >,
        ): void;
        _get_version_local(
          args: Function._Cluster._get_version_local.Args,
          opts?: fns.Function._Cluster._get_version_local.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._get_version_local.Returns,
          fns.Function._Cluster._get_version_local.ReturnsType,
          void
        >;
        _get_version_local(
          args: Function._Cluster._get_version_local.Args,
          opts?: fns.Function._Cluster._get_version_local.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._get_version_local.Returns,
            fns.Function._Cluster._get_version_local.ReturnsType
          >,
        ): void;
        _get_cluster_child(
          opts?: fns.Function._Cluster._get_cluster_child.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._get_cluster_child.Returns,
          fns.Function._Cluster._get_cluster_child.ReturnsType,
          void
        >;
        _get_cluster_child(
          opts?: fns.Function._Cluster._get_cluster_child.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._get_cluster_child.Returns,
            fns.Function._Cluster._get_cluster_child.ReturnsType
          >,
        ): void;
        accept_remote_cluster(
          opts?: fns.Function._Cluster.accept_remote_cluster.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.accept_remote_cluster.Returns,
          fns.Function._Cluster.accept_remote_cluster.ReturnsType,
          void
        >;
        accept_remote_cluster(
          opts?: fns.Function._Cluster.accept_remote_cluster.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.accept_remote_cluster.Returns,
            fns.Function._Cluster.accept_remote_cluster.ReturnsType
          >,
        ): void;
        __is_replication(
          opts?: fns.Function._Cluster.__is_replication.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__is_replication.Returns,
          fns.Function._Cluster.__is_replication.ReturnsType,
          void
        >;
        __is_replication(
          opts?: fns.Function._Cluster.__is_replication.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__is_replication.Returns,
            fns.Function._Cluster.__is_replication.ReturnsType
          >,
        ): void;
        sets_cluster_tree_position(
          opts?: fns.Function._Cluster.sets_cluster_tree_position.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_cluster_tree_position.Returns,
          fns.Function._Cluster.sets_cluster_tree_position.ReturnsType,
          void
        >;
        sets_cluster_tree_position(
          opts?: fns.Function._Cluster.sets_cluster_tree_position.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_cluster_tree_position.Returns,
            fns.Function._Cluster.sets_cluster_tree_position.ReturnsType
          >,
        ): void;
        define_namespace(
          opts?: fns.Function._Cluster.define_namespace.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.define_namespace.Returns,
          fns.Function._Cluster.define_namespace.ReturnsType,
          void
        >;
        define_namespace(
          opts?: fns.Function._Cluster.define_namespace.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.define_namespace.Returns,
            fns.Function._Cluster.define_namespace.ReturnsType
          >,
        ): void;
        sets_resources_downloaded(
          opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._Sets_Resources_Downloaded_16620.Returns,
          fns.Function._Cluster._Sets_Resources_Downloaded_16620.ReturnsType,
          void
        >;
        sets_resources_downloaded(
          opts?: fns.Function._Cluster._Sets_Resources_Downloaded_16620.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._Sets_Resources_Downloaded_16620.Returns,
            fns.Function._Cluster._Sets_Resources_Downloaded_16620.ReturnsType
          >,
        ): void;
        accept_revision(
          opts?: fns.Function._Cluster.accept_revision.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.accept_revision.Returns,
          fns.Function._Cluster.accept_revision.ReturnsType,
          void
        >;
        accept_revision(
          opts?: fns.Function._Cluster.accept_revision.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.accept_revision.Returns,
            fns.Function._Cluster.accept_revision.ReturnsType
          >,
        ): void;
        __tg_share_check(
          opts?: fns.Function._Cluster.__tg_share_check.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_share_check.Returns,
          fns.Function._Cluster.__tg_share_check.ReturnsType,
          void
        >;
        __tg_share_check(
          opts?: fns.Function._Cluster.__tg_share_check.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_share_check.Returns,
            fns.Function._Cluster.__tg_share_check.ReturnsType
          >,
        ): void;
        __create_identifier(
          opts?: fns.Function._Cluster.__create_identifier.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__create_identifier.Returns,
          fns.Function._Cluster.__create_identifier.ReturnsType,
          void
        >;
        __create_identifier(
          opts?: fns.Function._Cluster.__create_identifier.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__create_identifier.Returns,
            fns.Function._Cluster.__create_identifier.ReturnsType
          >,
        ): void;
        funct_reg_acesso(
          opts?: fns.Function._Cluster.funct_reg_acesso.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.funct_reg_acesso.Returns,
          fns.Function._Cluster.funct_reg_acesso.ReturnsType,
          void
        >;
        funct_reg_acesso(
          opts?: fns.Function._Cluster.funct_reg_acesso.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.funct_reg_acesso.Returns,
            fns.Function._Cluster.funct_reg_acesso.ReturnsType
          >,
        ): void;
        __transaction_uid(
          opts?: fns.Function._Cluster.__transaction_uid.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__transaction_uid.Returns,
          fns.Function._Cluster.__transaction_uid.ReturnsType,
          void
        >;
        __transaction_uid(
          opts?: fns.Function._Cluster.__transaction_uid.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__transaction_uid.Returns,
            fns.Function._Cluster.__transaction_uid.ReturnsType
          >,
        ): void;
        switch_remote_connection(
          opts?: fns.Function._Cluster.switch_remote_connection.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.switch_remote_connection.Returns,
          fns.Function._Cluster.switch_remote_connection.ReturnsType,
          void
        >;
        switch_remote_connection(
          opts?: fns.Function._Cluster.switch_remote_connection.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.switch_remote_connection.Returns,
            fns.Function._Cluster.switch_remote_connection.ReturnsType
          >,
        ): void;
        _cluster_accept_child(
          opts?: fns.Function._Cluster._cluster_accept_child.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._cluster_accept_child.Returns,
          fns.Function._Cluster._cluster_accept_child.ReturnsType,
          void
        >;
        _cluster_accept_child(
          opts?: fns.Function._Cluster._cluster_accept_child.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._cluster_accept_child.Returns,
            fns.Function._Cluster._cluster_accept_child.ReturnsType
          >,
        ): void;
        _get_cluster_local(
          opts?: fns.Function._Cluster._get_cluster_local.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._get_cluster_local.Returns,
          fns.Function._Cluster._get_cluster_local.ReturnsType,
          void
        >;
        _get_cluster_local(
          opts?: fns.Function._Cluster._get_cluster_local.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._get_cluster_local.Returns,
            fns.Function._Cluster._get_cluster_local.ReturnsType
          >,
        ): void;
        load_cluster_by_namespace(
          opts?: fns.Function._Cluster.load_cluster_by_namespace.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_cluster_by_namespace.Returns,
          fns.Function._Cluster.load_cluster_by_namespace.ReturnsType,
          void
        >;
        load_cluster_by_namespace(
          opts?: fns.Function._Cluster.load_cluster_by_namespace.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_cluster_by_namespace.Returns,
            fns.Function._Cluster.load_cluster_by_namespace.ReturnsType
          >,
        ): void;
        sets_clusters_admin(
          opts?: fns.Function._Cluster.sets_clusters_admin.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_clusters_admin.Returns,
          fns.Function._Cluster.sets_clusters_admin.ReturnsType,
          void
        >;
        sets_clusters_admin(
          opts?: fns.Function._Cluster.sets_clusters_admin.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_clusters_admin.Returns,
            fns.Function._Cluster.sets_clusters_admin.ReturnsType
          >,
        ): void;
        can_send_revision(
          opts?: fns.Function._Cluster.can_send_revision.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.can_send_revision.Returns,
          fns.Function._Cluster.can_send_revision.ReturnsType,
          void
        >;
        can_send_revision(
          opts?: fns.Function._Cluster.can_send_revision.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.can_send_revision.Returns,
            fns.Function._Cluster.can_send_revision.ReturnsType
          >,
        ): void;
        can_send_object(
          opts?: fns.Function._Cluster.can_send_object.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.can_send_object.Returns,
          fns.Function._Cluster.can_send_object.ReturnsType,
          void
        >;
        can_send_object(
          opts?: fns.Function._Cluster.can_send_object.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.can_send_object.Returns,
            fns.Function._Cluster.can_send_object.ReturnsType
          >,
        ): void;
        __user_default(
          opts?: fns.Function._Cluster.__user_default.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__user_default.Returns,
          fns.Function._Cluster.__user_default.ReturnsType,
          void
        >;
        __user_default(
          opts?: fns.Function._Cluster.__user_default.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__user_default.Returns,
            fns.Function._Cluster.__user_default.ReturnsType
          >,
        ): void;
        __is_sub_path(
          opts?: fns.Function._Cluster.__is_sub_path.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__is_sub_path.Returns,
          fns.Function._Cluster.__is_sub_path.ReturnsType,
          void
        >;
        __is_sub_path(
          opts?: fns.Function._Cluster.__is_sub_path.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__is_sub_path.Returns,
            fns.Function._Cluster.__is_sub_path.ReturnsType
          >,
        ): void;
        add(
          opts?: fns.Function._Cluster.add.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.add.Returns,
          fns.Function._Cluster.add.ReturnsType,
          void
        >;
        add(
          opts?: fns.Function._Cluster.add.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.add.Returns,
            fns.Function._Cluster.add.ReturnsType
          >,
        ): void;
        licence_status(
          opts?: fns.Function._Cluster.licence_status.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.licence_status.Returns,
          fns.Function._Cluster.licence_status.ReturnsType,
          void
        >;
        licence_status(
          opts?: fns.Function._Cluster.licence_status.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.licence_status.Returns,
            fns.Function._Cluster.licence_status.ReturnsType
          >,
        ): void;
        __user_replication(
          opts?: fns.Function._Cluster.__user_replication.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__user_replication.Returns,
          fns.Function._Cluster.__user_replication.ReturnsType,
          void
        >;
        __user_replication(
          opts?: fns.Function._Cluster.__user_replication.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__user_replication.Returns,
            fns.Function._Cluster.__user_replication.ReturnsType
          >,
        ): void;
        load_paths(
          opts?: fns.Function._Cluster.load_paths.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.load_paths.Returns,
          fns.Function._Cluster.load_paths.ReturnsType,
          void
        >;
        load_paths(
          opts?: fns.Function._Cluster.load_paths.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.load_paths.Returns,
            fns.Function._Cluster.load_paths.ReturnsType
          >,
        ): void;
        __pks(
          args: Function._Cluster.__pks.Args,
          opts?: fns.Function._Cluster.__pks.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__pks.Returns,
          fns.Function._Cluster.__pks.ReturnsType,
          void
        >;
        __pks(
          args: Function._Cluster.__pks.Args,
          opts?: fns.Function._Cluster.__pks.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__pks.Returns,
            fns.Function._Cluster.__pks.ReturnsType
          >,
        ): void;
        sets_cluster_machine_id(
          opts?: fns.Function._Cluster.sets_cluster_machine_id.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_cluster_machine_id.Returns,
          fns.Function._Cluster.sets_cluster_machine_id.ReturnsType,
          void
        >;
        sets_cluster_machine_id(
          opts?: fns.Function._Cluster.sets_cluster_machine_id.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_cluster_machine_id.Returns,
            fns.Function._Cluster.sets_cluster_machine_id.ReturnsType
          >,
        ): void;
        change(
          args: Function._Cluster.change.Args,
          opts?: fns.Function._Cluster.change.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.change.Returns,
          fns.Function._Cluster.change.ReturnsType,
          void
        >;
        change(
          args: Function._Cluster.change.Args,
          opts?: fns.Function._Cluster.change.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.change.Returns,
            fns.Function._Cluster.change.ReturnsType
          >,
        ): void;
        _get_cluster_master(
          opts?: fns.Function._Cluster._get_cluster_master.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster._get_cluster_master.Returns,
          fns.Function._Cluster._get_cluster_master.ReturnsType,
          void
        >;
        _get_cluster_master(
          opts?: fns.Function._Cluster._get_cluster_master.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster._get_cluster_master.Returns,
            fns.Function._Cluster._get_cluster_master.ReturnsType
          >,
        ): void;
        __tg_share_map(
          opts?: fns.Function._Cluster.__tg_share_map.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.__tg_share_map.Returns,
          fns.Function._Cluster.__tg_share_map.ReturnsType,
          void
        >;
        __tg_share_map(
          opts?: fns.Function._Cluster.__tg_share_map.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.__tg_share_map.Returns,
            fns.Function._Cluster.__tg_share_map.ReturnsType
          >,
        ): void;
        sets_cluster_remote(
          opts?: fns.Function._Cluster.sets_cluster_remote.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_cluster_remote.Returns,
          fns.Function._Cluster.sets_cluster_remote.ReturnsType,
          void
        >;
        sets_cluster_remote(
          opts?: fns.Function._Cluster.sets_cluster_remote.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_cluster_remote.Returns,
            fns.Function._Cluster.sets_cluster_remote.ReturnsType
          >,
        ): void;
        sets_cluster_configs(
          opts?: fns.Function._Cluster.sets_cluster_configs.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_cluster_configs.Returns,
          fns.Function._Cluster.sets_cluster_configs.ReturnsType,
          void
        >;
        sets_cluster_configs(
          opts?: fns.Function._Cluster.sets_cluster_configs.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_cluster_configs.Returns,
            fns.Function._Cluster.sets_cluster_configs.ReturnsType
          >,
        ): void;
        commit(
          opts?: fns.Function._Cluster.commit.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.commit.Returns,
          fns.Function._Cluster.commit.ReturnsType,
          void
        >;
        commit(
          opts?: fns.Function._Cluster.commit.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.commit.Returns,
            fns.Function._Cluster.commit.ReturnsType
          >,
        ): void;
        sets_cluster_license(
          opts?: fns.Function._Cluster.sets_cluster_license.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Cluster.sets_cluster_license.Returns,
          fns.Function._Cluster.sets_cluster_license.ReturnsType,
          void
        >;
        sets_cluster_license(
          opts?: fns.Function._Cluster.sets_cluster_license.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Cluster.sets_cluster_license.Returns,
            fns.Function._Cluster.sets_cluster_license.ReturnsType
          >,
        ): void;
      }

      export interface FunctionProps {
        __user_map: fns.Function._Cluster.__user_map.Properties;
        __tg_share_guard_upgrade: fns.Function._Cluster.__tg_share_guard_upgrade.Properties;
        __pull: fns.Function._Cluster.__pull.Properties;
        object_filter: fns.Function._Cluster.object_filter.Properties;
        create_resource: fns.Function._Cluster.create_resource.Properties;
        __tg_share_truncate: fns.Function._Cluster.__tg_share_truncate.Properties;
        reduce: fns.Function._Cluster.reduce.Properties;
        sets_resources_downloaded: fns.fns.Function._Cluster._Sets_Resources_Downloaded_16619.Properties &
          Function._Cluster._Sets_Resources_Downloaded_16620.Properties;
        load_resources_pendents: fns.Function._Cluster.load_resources_pendents.Properties;
        load_clusters_configs_to_child: fns.Function._Cluster.load_clusters_configs_to_child.Properties;
        push: fns.Function._Cluster.push.Properties;
        __tg_version_commit: fns.Function._Cluster.__tg_version_commit.Properties;
        __format: fns.Function._Cluster.__format.Properties;
        __get: fns.Function._Cluster.__get.Properties;
        __tg_before_create_filter: fns.Function._Cluster.__tg_before_create_filter.Properties;
        __create_api: fns.Function._Cluster.__create_api.Properties;
        __rows: fns.Function._Cluster.__rows.Properties;
        __tg_version_add_when_update: fns.Function._Cluster.__tg_version_add_when_update.Properties;
        load_clusters: fns.Function._Cluster.load_clusters.Properties;
        funct_load_configs: fns.Function._Cluster.funct_load_configs.Properties;
        __add: fns.Function._Cluster.__add.Properties;
        pull: fns.Function._Cluster.pull.Properties;
        __format_proc: fns.Function._Cluster.__format_proc.Properties;
        __create_object_version: fns.Function._Cluster.__create_object_version.Properties;
        status: fns.Function._Cluster.status.Properties;
        load_clusters_local_as_remotes: fns.Function._Cluster.load_clusters_local_as_remotes.Properties;
        declare_filter: fns.Function._Cluster.declare_filter.Properties;
        __tg_version_add_when_insert: fns.Function._Cluster.__tg_version_add_when_insert.Properties;
        __generate_cluster_code: fns.Function._Cluster.__generate_cluster_code.Properties;
        unlink_cluster: fns.Function._Cluster.unlink_cluster.Properties;
        __collect_change: fns.Function._Cluster.__collect_change.Properties;
        _get_cluster: fns.Function._Cluster._get_cluster.Properties;
        next: fns.Function._Cluster.next.Properties;
        _get_version_local: fns.Function._Cluster._get_version_local.Properties;
        _get_cluster_child: fns.Function._Cluster._get_cluster_child.Properties;
        accept_remote_cluster: fns.Function._Cluster.accept_remote_cluster.Properties;
        __is_replication: fns.Function._Cluster.__is_replication.Properties;
        sets_cluster_tree_position: fns.Function._Cluster.sets_cluster_tree_position.Properties;
        define_namespace: fns.Function._Cluster.define_namespace.Properties;
        accept_revision: fns.Function._Cluster.accept_revision.Properties;
        __tg_share_check: fns.Function._Cluster.__tg_share_check.Properties;
        __create_identifier: fns.Function._Cluster.__create_identifier.Properties;
        funct_reg_acesso: fns.Function._Cluster.funct_reg_acesso.Properties;
        __transaction_uid: fns.Function._Cluster.__transaction_uid.Properties;
        switch_remote_connection: fns.Function._Cluster.switch_remote_connection.Properties;
        _cluster_accept_child: fns.Function._Cluster._cluster_accept_child.Properties;
        _get_cluster_local: fns.Function._Cluster._get_cluster_local.Properties;
        load_cluster_by_namespace: fns.Function._Cluster.load_cluster_by_namespace.Properties;
        sets_clusters_admin: fns.Function._Cluster.sets_clusters_admin.Properties;
        can_send_revision: fns.Function._Cluster.can_send_revision.Properties;
        can_send_object: fns.Function._Cluster.can_send_object.Properties;
        __user_default: fns.Function._Cluster.__user_default.Properties;
        __is_sub_path: fns.Function._Cluster.__is_sub_path.Properties;
        add: fns.Function._Cluster.add.Properties;
        licence_status: fns.Function._Cluster.licence_status.Properties;
        __user_replication: fns.Function._Cluster.__user_replication.Properties;
        load_paths: fns.Function._Cluster.load_paths.Properties;
        __pks: fns.Function._Cluster.__pks.Properties;
        sets_cluster_machine_id: fns.Function._Cluster.sets_cluster_machine_id.Properties;
        change: fns.Function._Cluster.change.Properties;
        _get_cluster_master: fns.Function._Cluster._get_cluster_master.Properties;
        __tg_share_map: fns.Function._Cluster.__tg_share_map.Properties;
        sets_cluster_remote: fns.Function._Cluster.sets_cluster_remote.Properties;
        sets_cluster_configs: fns.Function._Cluster.sets_cluster_configs.Properties;
        commit: fns.Function._Cluster.commit.Properties;
        sets_cluster_license: fns.Function._Cluster.sets_cluster_license.Properties;
      }
    }

    export namespace _Auth {
      export interface FunctionDefinition {
        funct_reg_privilegio(
          opts?: fns.Function._Auth.funct_reg_privilegio.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_reg_privilegio.Returns,
          fns.Function._Auth.funct_reg_privilegio.ReturnsType,
          void
        >;
        funct_reg_privilegio(
          opts?: fns.Function._Auth.funct_reg_privilegio.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_reg_privilegio.Returns,
            fns.Function._Auth.funct_reg_privilegio.ReturnsType
          >,
        ): void;
        funct_change_perfil(
          opts?: fns.Function._Auth.funct_change_perfil.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_perfil.Returns,
          fns.Function._Auth.funct_change_perfil.ReturnsType,
          void
        >;
        funct_change_perfil(
          opts?: fns.Function._Auth.funct_change_perfil.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_perfil.Returns,
            fns.Function._Auth.funct_change_perfil.ReturnsType
          >,
        ): void;
        _menu_load_structure(
          opts?: fns.Function._Auth._menu_load_structure.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._menu_load_structure.Returns,
          fns.Function._Auth._menu_load_structure.ReturnsType,
          void
        >;
        _menu_load_structure(
          opts?: fns.Function._Auth._menu_load_structure.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._menu_load_structure.Returns,
            fns.Function._Auth._menu_load_structure.ReturnsType
          >,
        ): void;
        funct_load_colaborador_all_menu(
          opts?: fns.Function._Auth.funct_load_colaborador_all_menu.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador_all_menu.Returns,
          fns.Function._Auth.funct_load_colaborador_all_menu.ReturnsType,
          void
        >;
        funct_load_colaborador_all_menu(
          opts?: fns.Function._Auth.funct_load_colaborador_all_menu.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador_all_menu.Returns,
            fns.Function._Auth.funct_load_colaborador_all_menu.ReturnsType
          >,
        ): void;
        _get_perfil(
          opts?: fns.Function._Auth._get_perfil.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._get_perfil.Returns,
          fns.Function._Auth._get_perfil.ReturnsType,
          void
        >;
        _get_perfil(
          opts?: fns.Function._Auth._get_perfil.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._get_perfil.Returns,
            fns.Function._Auth._get_perfil.ReturnsType
          >,
        ): void;
        _colaborador_accesso_desc(
          opts?: fns.Function._Auth._colaborador_accesso_desc.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._colaborador_accesso_desc.Returns,
          fns.Function._Auth._colaborador_accesso_desc.ReturnsType,
          void
        >;
        _colaborador_accesso_desc(
          opts?: fns.Function._Auth._colaborador_accesso_desc.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._colaborador_accesso_desc.Returns,
            fns.Function._Auth._colaborador_accesso_desc.ReturnsType
          >,
        ): void;
        funct_load_menu(
          opts?: fns.Function._Auth.funct_load_menu.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_menu.Returns,
          fns.Function._Auth.funct_load_menu.ReturnsType,
          void
        >;
        funct_load_menu(
          opts?: fns.Function._Auth.funct_load_menu.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_menu.Returns,
            fns.Function._Auth.funct_load_menu.ReturnsType
          >,
        ): void;
        funct_change_colaborador(
          opts?: fns.Function._Auth.funct_change_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador.Returns,
          fns.Function._Auth.funct_change_colaborador.ReturnsType,
          void
        >;
        funct_change_colaborador(
          opts?: fns.Function._Auth.funct_change_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador.Returns,
            fns.Function._Auth.funct_change_colaborador.ReturnsType
          >,
        ): void;
        funct_autenticacao_logoff(
          opts?: fns.Function._Auth.funct_autenticacao_logoff.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_autenticacao_logoff.Returns,
          fns.Function._Auth.funct_autenticacao_logoff.ReturnsType,
          void
        >;
        funct_autenticacao_logoff(
          opts?: fns.Function._Auth.funct_autenticacao_logoff.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_autenticacao_logoff.Returns,
            fns.Function._Auth.funct_autenticacao_logoff.ReturnsType
          >,
        ): void;
        funct_change_colaborador_token_ativate(
          opts?: fns.Function._Auth.funct_change_colaborador_token_ativate.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_token_ativate.Returns,
          fns.Function._Auth.funct_change_colaborador_token_ativate.ReturnsType,
          void
        >;
        funct_change_colaborador_token_ativate(
          opts?: fns.Function._Auth.funct_change_colaborador_token_ativate.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_token_ativate.Returns,
            fns.Function._Auth.funct_change_colaborador_token_ativate.ReturnsType
          >,
        ): void;
        funct_load_colaborador(
          opts?: fns.Function._Auth.funct_load_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador.Returns,
          fns.Function._Auth.funct_load_colaborador.ReturnsType,
          void
        >;
        funct_load_colaborador(
          opts?: fns.Function._Auth.funct_load_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador.Returns,
            fns.Function._Auth.funct_load_colaborador.ReturnsType
          >,
        ): void;
        _get_colaborador(
          opts?: fns.Function._Auth._get_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._get_colaborador.Returns,
          fns.Function._Auth._get_colaborador.ReturnsType,
          void
        >;
        _get_colaborador(
          opts?: fns.Function._Auth._get_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._get_colaborador.Returns,
            fns.Function._Auth._get_colaborador.ReturnsType
          >,
        ): void;
        _autenticacao_chave_generate(
          opts?: fns.Function._Auth._autenticacao_chave_generate.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._autenticacao_chave_generate.Returns,
          fns.Function._Auth._autenticacao_chave_generate.ReturnsType,
          void
        >;
        _autenticacao_chave_generate(
          opts?: fns.Function._Auth._autenticacao_chave_generate.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._autenticacao_chave_generate.Returns,
            fns.Function._Auth._autenticacao_chave_generate.ReturnsType
          >,
        ): void;
        _colaborador_estado_desc(
          opts?: fns.Function._Auth._colaborador_estado_desc.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._colaborador_estado_desc.Returns,
          fns.Function._Auth._colaborador_estado_desc.ReturnsType,
          void
        >;
        _colaborador_estado_desc(
          opts?: fns.Function._Auth._colaborador_estado_desc.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._colaborador_estado_desc.Returns,
            fns.Function._Auth._colaborador_estado_desc.ReturnsType
          >,
        ): void;
        funct_change_colaborador_senha(
          opts?: fns.Function._Auth.funct_change_colaborador_senha.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_senha.Returns,
          fns.Function._Auth.funct_change_colaborador_senha.ReturnsType,
          void
        >;
        funct_change_colaborador_senha(
          opts?: fns.Function._Auth.funct_change_colaborador_senha.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_senha.Returns,
            fns.Function._Auth.funct_change_colaborador_senha.ReturnsType
          >,
        ): void;
        _menu_create(
          opts?: fns.Function._Auth._menu_create.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._menu_create.Returns,
          fns.Function._Auth._menu_create.ReturnsType,
          void
        >;
        _menu_create(
          opts?: fns.Function._Auth._menu_create.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._menu_create.Returns,
            fns.Function._Auth._menu_create.ReturnsType
          >,
        ): void;
        funct_load_grants(
          opts?: fns.Function._Auth.funct_load_grants.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_grants.Returns,
          fns.Function._Auth.funct_load_grants.ReturnsType,
          void
        >;
        funct_load_grants(
          opts?: fns.Function._Auth.funct_load_grants.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_grants.Returns,
            fns.Function._Auth.funct_load_grants.ReturnsType
          >,
        ): void;
        funct_change_colaborador_accesso_disable(
          opts?: fns.Function._Auth.funct_change_colaborador_accesso_disable.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_accesso_disable.Returns,
          fns.Function._Auth.funct_change_colaborador_accesso_disable.ReturnsType,
          void
        >;
        funct_change_colaborador_accesso_disable(
          opts?: fns.Function._Auth.funct_change_colaborador_accesso_disable.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_accesso_disable.Returns,
            fns.Function._Auth.funct_change_colaborador_accesso_disable.ReturnsType
          >,
        ): void;
        funct_reg_trabalha(
          opts?: fns.Function._Auth.funct_reg_trabalha.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_reg_trabalha.Returns,
          fns.Function._Auth.funct_reg_trabalha.ReturnsType,
          void
        >;
        funct_reg_trabalha(
          opts?: fns.Function._Auth.funct_reg_trabalha.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_reg_trabalha.Returns,
            fns.Function._Auth.funct_reg_trabalha.ReturnsType
          >,
        ): void;
        _menu_create_set_up(
          opts?: fns.Function._Auth._menu_create_set_up.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._menu_create_set_up.Returns,
          fns.Function._Auth._menu_create_set_up.ReturnsType,
          void
        >;
        _menu_create_set_up(
          opts?: fns.Function._Auth._menu_create_set_up.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._menu_create_set_up.Returns,
            fns.Function._Auth._menu_create_set_up.ReturnsType
          >,
        ): void;
        funct_load_colaborador_simple(
          opts?: fns.Function._Auth.funct_load_colaborador_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador_simple.Returns,
          fns.Function._Auth.funct_load_colaborador_simple.ReturnsType,
          void
        >;
        funct_load_colaborador_simple(
          opts?: fns.Function._Auth.funct_load_colaborador_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador_simple.Returns,
            fns.Function._Auth.funct_load_colaborador_simple.ReturnsType
          >,
        ): void;
        funct_load_colaborador_any_menu(
          opts?: fns.Function._Auth.funct_load_colaborador_any_menu.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador_any_menu.Returns,
          fns.Function._Auth.funct_load_colaborador_any_menu.ReturnsType,
          void
        >;
        funct_load_colaborador_any_menu(
          opts?: fns.Function._Auth.funct_load_colaborador_any_menu.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador_any_menu.Returns,
            fns.Function._Auth.funct_load_colaborador_any_menu.ReturnsType
          >,
        ): void;
        funct_load_menu_cascade(
          opts?: fns.Function._Auth.funct_load_menu_cascade.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_menu_cascade.Returns,
          fns.Function._Auth.funct_load_menu_cascade.ReturnsType,
          void
        >;
        funct_load_menu_cascade(
          opts?: fns.Function._Auth.funct_load_menu_cascade.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_menu_cascade.Returns,
            fns.Function._Auth.funct_load_menu_cascade.ReturnsType
          >,
        ): void;
        _colaborador_token_encrypt(
          opts?: fns.Function._Auth._colaborador_token_encrypt.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._colaborador_token_encrypt.Returns,
          fns.Function._Auth._colaborador_token_encrypt.ReturnsType,
          void
        >;
        _colaborador_token_encrypt(
          opts?: fns.Function._Auth._colaborador_token_encrypt.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._colaborador_token_encrypt.Returns,
            fns.Function._Auth._colaborador_token_encrypt.ReturnsType
          >,
        ): void;
        funct_load_colaborador_token_restore(
          opts?: fns.Function._Auth.funct_load_colaborador_token_restore.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador_token_restore.Returns,
          fns.Function._Auth.funct_load_colaborador_token_restore.ReturnsType,
          void
        >;
        funct_load_colaborador_token_restore(
          opts?: fns.Function._Auth.funct_load_colaborador_token_restore.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador_token_restore.Returns,
            fns.Function._Auth.funct_load_colaborador_token_restore.ReturnsType
          >,
        ): void;
        funct_autenticacao(
          opts?: fns.Function._Auth.funct_autenticacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_autenticacao.Returns,
          fns.Function._Auth.funct_autenticacao.ReturnsType,
          void
        >;
        funct_autenticacao(
          opts?: fns.Function._Auth.funct_autenticacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_autenticacao.Returns,
            fns.Function._Auth.funct_autenticacao.ReturnsType
          >,
        ): void;
        _colaborador_generate_senha_token(
          opts?: fns.Function._Auth._colaborador_generate_senha_token.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._colaborador_generate_senha_token.Returns,
          fns.Function._Auth._colaborador_generate_senha_token.ReturnsType,
          void
        >;
        _colaborador_generate_senha_token(
          opts?: fns.Function._Auth._colaborador_generate_senha_token.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._colaborador_generate_senha_token.Returns,
            fns.Function._Auth._colaborador_generate_senha_token.ReturnsType
          >,
        ): void;
        funct_reg_perfil(
          opts?: fns.Function._Auth.funct_reg_perfil.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_reg_perfil.Returns,
          fns.Function._Auth.funct_reg_perfil.ReturnsType,
          void
        >;
        funct_reg_perfil(
          opts?: fns.Function._Auth.funct_reg_perfil.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_reg_perfil.Returns,
            fns.Function._Auth.funct_reg_perfil.ReturnsType
          >,
        ): void;
        funct_change_colaborador_token_acesso(
          opts?: fns.Function._Auth.funct_change_colaborador_token_acesso.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_token_acesso.Returns,
          fns.Function._Auth.funct_change_colaborador_token_acesso.ReturnsType,
          void
        >;
        funct_change_colaborador_token_acesso(
          opts?: fns.Function._Auth.funct_change_colaborador_token_acesso.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_token_acesso.Returns,
            fns.Function._Auth.funct_change_colaborador_token_acesso.ReturnsType
          >,
        ): void;
        funct_change_colaborador_pin(
          opts?: fns.Function._Auth.funct_change_colaborador_pin.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_pin.Returns,
          fns.Function._Auth.funct_change_colaborador_pin.ReturnsType,
          void
        >;
        funct_change_colaborador_pin(
          opts?: fns.Function._Auth.funct_change_colaborador_pin.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_pin.Returns,
            fns.Function._Auth.funct_change_colaborador_pin.ReturnsType
          >,
        ): void;
        funct_change_colaborador_accesso_reativar(
          opts?: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_accesso_reativar.Returns,
          fns.Function._Auth.funct_change_colaborador_accesso_reativar.ReturnsType,
          void
        >;
        funct_change_colaborador_accesso_reativar(
          opts?: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_accesso_reativar.Returns,
            fns.Function._Auth.funct_change_colaborador_accesso_reativar.ReturnsType
          >,
        ): void;
        funct_change_colaborador_estado_disable(
          opts?: fns.Function._Auth.funct_change_colaborador_estado_disable.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_change_colaborador_estado_disable.Returns,
          fns.Function._Auth.funct_change_colaborador_estado_disable.ReturnsType,
          void
        >;
        funct_change_colaborador_estado_disable(
          opts?: fns.Function._Auth.funct_change_colaborador_estado_disable.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_change_colaborador_estado_disable.Returns,
            fns.Function._Auth.funct_change_colaborador_estado_disable.ReturnsType
          >,
        ): void;
        _colaborador_generate_pin_token(
          opts?: fns.Function._Auth._colaborador_generate_pin_token.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._colaborador_generate_pin_token.Returns,
          fns.Function._Auth._colaborador_generate_pin_token.ReturnsType,
          void
        >;
        _colaborador_generate_pin_token(
          opts?: fns.Function._Auth._colaborador_generate_pin_token.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._colaborador_generate_pin_token.Returns,
            fns.Function._Auth._colaborador_generate_pin_token.ReturnsType
          >,
        ): void;
        _encrypt(
          opts?: fns.Function._Auth._encrypt.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth._encrypt.Returns,
          fns.Function._Auth._encrypt.ReturnsType,
          void
        >;
        _encrypt(
          opts?: fns.Function._Auth._encrypt.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth._encrypt.Returns,
            fns.Function._Auth._encrypt.ReturnsType
          >,
        ): void;
        funct_reg_colaborador(
          opts?: fns.Function._Auth.funct_reg_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_reg_colaborador.Returns,
          fns.Function._Auth.funct_reg_colaborador.ReturnsType,
          void
        >;
        funct_reg_colaborador(
          opts?: fns.Function._Auth.funct_reg_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_reg_colaborador.Returns,
            fns.Function._Auth.funct_reg_colaborador.ReturnsType
          >,
        ): void;
        funct_reg_acesso(
          opts?: fns.Function._Auth.funct_reg_acesso.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_reg_acesso.Returns,
          fns.Function._Auth.funct_reg_acesso.ReturnsType,
          void
        >;
        funct_reg_acesso(
          opts?: fns.Function._Auth.funct_reg_acesso.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_reg_acesso.Returns,
            fns.Function._Auth.funct_reg_acesso.ReturnsType
          >,
        ): void;
        funct_load_colaborador_by_token(
          opts?: fns.Function._Auth.funct_load_colaborador_by_token.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Auth.funct_load_colaborador_by_token.Returns,
          fns.Function._Auth.funct_load_colaborador_by_token.ReturnsType,
          void
        >;
        funct_load_colaborador_by_token(
          opts?: fns.Function._Auth.funct_load_colaborador_by_token.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Auth.funct_load_colaborador_by_token.Returns,
            fns.Function._Auth.funct_load_colaborador_by_token.ReturnsType
          >,
        ): void;
      }

      export interface FunctionProps {
        funct_reg_privilegio: fns.Function._Auth.funct_reg_privilegio.Properties;
        funct_change_perfil: fns.Function._Auth.funct_change_perfil.Properties;
        _menu_load_structure: fns.Function._Auth._menu_load_structure.Properties;
        funct_load_colaborador_all_menu: fns.Function._Auth.funct_load_colaborador_all_menu.Properties;
        _get_perfil: fns.Function._Auth._get_perfil.Properties;
        _colaborador_accesso_desc: fns.Function._Auth._colaborador_accesso_desc.Properties;
        funct_load_menu: fns.Function._Auth.funct_load_menu.Properties;
        funct_change_colaborador: fns.Function._Auth.funct_change_colaborador.Properties;
        funct_autenticacao_logoff: fns.Function._Auth.funct_autenticacao_logoff.Properties;
        funct_change_colaborador_token_ativate: fns.Function._Auth.funct_change_colaborador_token_ativate.Properties;
        funct_load_colaborador: fns.Function._Auth.funct_load_colaborador.Properties;
        _get_colaborador: fns.Function._Auth._get_colaborador.Properties;
        _autenticacao_chave_generate: fns.Function._Auth._autenticacao_chave_generate.Properties;
        _colaborador_estado_desc: fns.Function._Auth._colaborador_estado_desc.Properties;
        funct_change_colaborador_senha: fns.Function._Auth.funct_change_colaborador_senha.Properties;
        _menu_create: fns.Function._Auth._menu_create.Properties;
        funct_load_grants: fns.Function._Auth.funct_load_grants.Properties;
        funct_change_colaborador_accesso_disable: fns.Function._Auth.funct_change_colaborador_accesso_disable.Properties;
        funct_reg_trabalha: fns.Function._Auth.funct_reg_trabalha.Properties;
        _menu_create_set_up: fns.Function._Auth._menu_create_set_up.Properties;
        funct_load_colaborador_simple: fns.Function._Auth.funct_load_colaborador_simple.Properties;
        funct_load_colaborador_any_menu: fns.Function._Auth.funct_load_colaborador_any_menu.Properties;
        funct_load_menu_cascade: fns.Function._Auth.funct_load_menu_cascade.Properties;
        _colaborador_token_encrypt: fns.Function._Auth._colaborador_token_encrypt.Properties;
        funct_load_colaborador_token_restore: fns.Function._Auth.funct_load_colaborador_token_restore.Properties;
        funct_autenticacao: fns.Function._Auth.funct_autenticacao.Properties;
        _colaborador_generate_senha_token: fns.Function._Auth._colaborador_generate_senha_token.Properties;
        funct_reg_perfil: fns.Function._Auth.funct_reg_perfil.Properties;
        funct_change_colaborador_token_acesso: fns.Function._Auth.funct_change_colaborador_token_acesso.Properties;
        funct_change_colaborador_pin: fns.Function._Auth.funct_change_colaborador_pin.Properties;
        funct_change_colaborador_accesso_reativar: fns.Function._Auth.funct_change_colaborador_accesso_reativar.Properties;
        funct_change_colaborador_estado_disable: fns.Function._Auth.funct_change_colaborador_estado_disable.Properties;
        _colaborador_generate_pin_token: fns.Function._Auth._colaborador_generate_pin_token.Properties;
        _encrypt: fns.Function._Auth._encrypt.Properties;
        funct_reg_colaborador: fns.Function._Auth.funct_reg_colaborador.Properties;
        funct_reg_acesso: fns.Function._Auth.funct_reg_acesso.Properties;
        funct_load_colaborador_by_token: fns.Function._Auth.funct_load_colaborador_by_token.Properties;
      }
    }

    export namespace _Libdom {
      export interface FunctionDefinition {
        domsync(
          opts?: fns.Function._Libdom.domsync.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.domsync.Returns,
          fns.Function._Libdom.domsync.ReturnsType,
          void
        >;
        domsync(
          opts?: fns.Function._Libdom.domsync.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.domsync.Returns,
            fns.Function._Libdom.domsync.ReturnsType
          >,
        ): void;
        entry_drop(
          opts?: fns.Function._Libdom.entry_drop.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.entry_drop.Returns,
          fns.Function._Libdom.entry_drop.ReturnsType,
          void
        >;
        entry_drop(
          opts?: fns.Function._Libdom.entry_drop.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.entry_drop.Returns,
            fns.Function._Libdom.entry_drop.ReturnsType
          >,
        ): void;
        sync_drop(
          opts?: fns.Function._Libdom.sync_drop.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.sync_drop.Returns,
          fns.Function._Libdom.sync_drop.ReturnsType,
          void
        >;
        sync_drop(
          opts?: fns.Function._Libdom.sync_drop.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.sync_drop.Returns,
            fns.Function._Libdom.sync_drop.ReturnsType
          >,
        ): void;
        get(
          opts?: fns.Function._Libdom._get.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom._get.Returns,
          fns.Function._Libdom._get.ReturnsType,
          void
        >;
        get(
          opts?: fns.Function._Libdom._get.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom._get.Returns,
            fns.Function._Libdom._get.ReturnsType
          >,
        ): void;
        domain_of(
          opts?: fns.Function._Libdom._Domain_Of_16734.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom._Domain_Of_16734.Returns,
          fns.Function._Libdom._Domain_Of_16734.ReturnsType,
          void
        >;
        domain_of(
          opts?: fns.Function._Libdom._Domain_Of_16734.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom._Domain_Of_16734.Returns,
            fns.Function._Libdom._Domain_Of_16734.ReturnsType
          >,
        ): void;
        entry(
          opts?: fns.Function._Libdom.entry.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.entry.Returns,
          fns.Function._Libdom.entry.ReturnsType,
          void
        >;
        entry(
          opts?: fns.Function._Libdom.entry.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.entry.Returns,
            fns.Function._Libdom.entry.ReturnsType
          >,
        ): void;
        trigger_sync_domsync(
          opts?: fns.Function._Libdom.trigger_sync_domsync.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.trigger_sync_domsync.Returns,
          fns.Function._Libdom.trigger_sync_domsync.ReturnsType,
          void
        >;
        trigger_sync_domsync(
          opts?: fns.Function._Libdom.trigger_sync_domsync.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.trigger_sync_domsync.Returns,
            fns.Function._Libdom.trigger_sync_domsync.ReturnsType
          >,
        ): void;
        rebuild(
          opts?: fns.Function._Libdom.rebuild.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.rebuild.Returns,
          fns.Function._Libdom.rebuild.ReturnsType,
          void
        >;
        rebuild(
          opts?: fns.Function._Libdom.rebuild.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.rebuild.Returns,
            fns.Function._Libdom.rebuild.ReturnsType
          >,
        ): void;
        api_change_entryset(
          opts?: fns.Function._Libdom.api_change_entryset.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.api_change_entryset.Returns,
          fns.Function._Libdom.api_change_entryset.ReturnsType,
          void
        >;
        api_change_entryset(
          opts?: fns.Function._Libdom.api_change_entryset.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.api_change_entryset.Returns,
            fns.Function._Libdom.api_change_entryset.ReturnsType
          >,
        ): void;
        columns(
          args: Function._Libdom.columns.Args,
          opts?: fns.Function._Libdom.columns.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.columns.Returns,
          fns.Function._Libdom.columns.ReturnsType,
          void
        >;
        columns(
          args: Function._Libdom.columns.Args,
          opts?: fns.Function._Libdom.columns.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.columns.Returns,
            fns.Function._Libdom.columns.ReturnsType
          >,
        ): void;
        api_load_entryset(
          opts?: fns.Function._Libdom.api_load_entryset.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.api_load_entryset.Returns,
          fns.Function._Libdom.api_load_entryset.ReturnsType,
          void
        >;
        api_load_entryset(
          opts?: fns.Function._Libdom.api_load_entryset.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.api_load_entryset.Returns,
            fns.Function._Libdom.api_load_entryset.ReturnsType
          >,
        ): void;
        constant(
          opts?: fns.Function._Libdom.constant.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.constant.Returns,
          fns.Function._Libdom.constant.ReturnsType,
          void
        >;
        constant(
          opts?: fns.Function._Libdom.constant.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.constant.Returns,
            fns.Function._Libdom.constant.ReturnsType
          >,
        ): void;
        domain_of(
          opts?: fns.Function._Libdom._Domain_Of_16735.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom._Domain_Of_16735.Returns,
          fns.Function._Libdom._Domain_Of_16735.ReturnsType,
          void
        >;
        domain_of(
          opts?: fns.Function._Libdom._Domain_Of_16735.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom._Domain_Of_16735.Returns,
            fns.Function._Libdom._Domain_Of_16735.ReturnsType
          >,
        ): void;
        trigger_sync_entry(
          opts?: fns.Function._Libdom.trigger_sync_entry.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.trigger_sync_entry.Returns,
          fns.Function._Libdom.trigger_sync_entry.ReturnsType,
          void
        >;
        trigger_sync_entry(
          opts?: fns.Function._Libdom.trigger_sync_entry.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.trigger_sync_entry.Returns,
            fns.Function._Libdom.trigger_sync_entry.ReturnsType
          >,
        ): void;
        domain(
          opts?: fns.Function._Libdom.domain.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.domain.Returns,
          fns.Function._Libdom.domain.ReturnsType,
          void
        >;
        domain(
          opts?: fns.Function._Libdom.domain.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.domain.Returns,
            fns.Function._Libdom.domain.ReturnsType
          >,
        ): void;
        domain_document(
          opts?: fns.Function._Libdom.domain_document.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.domain_document.Returns,
          fns.Function._Libdom.domain_document.ReturnsType,
          void
        >;
        domain_document(
          opts?: fns.Function._Libdom.domain_document.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.domain_document.Returns,
            fns.Function._Libdom.domain_document.ReturnsType
          >,
        ): void;
        describe(
          opts?: fns.Function._Libdom.describe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.describe.Returns,
          fns.Function._Libdom.describe.ReturnsType,
          void
        >;
        describe(
          opts?: fns.Function._Libdom.describe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.describe.Returns,
            fns.Function._Libdom.describe.ReturnsType
          >,
        ): void;
        exports(
          opts?: fns.Function._Libdom.exports.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.exports.Returns,
          fns.Function._Libdom.exports.ReturnsType,
          void
        >;
        exports(
          opts?: fns.Function._Libdom.exports.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.exports.Returns,
            fns.Function._Libdom.exports.ReturnsType
          >,
        ): void;
        entry_list(
          opts?: fns.Function._Libdom.entry_list.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.entry_list.Returns,
          fns.Function._Libdom.entry_list.ReturnsType,
          void
        >;
        entry_list(
          opts?: fns.Function._Libdom.entry_list.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.entry_list.Returns,
            fns.Function._Libdom.entry_list.ReturnsType
          >,
        ): void;
        sync_entry(
          opts?: fns.Function._Libdom.sync_entry.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.sync_entry.Returns,
          fns.Function._Libdom.sync_entry.ReturnsType,
          void
        >;
        sync_entry(
          opts?: fns.Function._Libdom.sync_entry.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.sync_entry.Returns,
            fns.Function._Libdom.sync_entry.ReturnsType
          >,
        ): void;
        set(
          opts?: fns.Function._Libdom._set.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom._set.Returns,
          fns.Function._Libdom._set.ReturnsType,
          void
        >;
        set(
          opts?: fns.Function._Libdom._set.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom._set.Returns,
            fns.Function._Libdom._set.ReturnsType
          >,
        ): void;
        domset(
          opts?: fns.Function._Libdom.domset.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.domset.Returns,
          fns.Function._Libdom.domset.ReturnsType,
          void
        >;
        domset(
          opts?: fns.Function._Libdom.domset.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.domset.Returns,
            fns.Function._Libdom.domset.ReturnsType
          >,
        ): void;
        prefix(
          opts?: fns.Function._Libdom.prefix.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.prefix.Returns,
          fns.Function._Libdom.prefix.ReturnsType,
          void
        >;
        prefix(
          opts?: fns.Function._Libdom.prefix.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.prefix.Returns,
            fns.Function._Libdom.prefix.ReturnsType
          >,
        ): void;
        constant_document(
          opts?: fns.Function._Libdom.constant_document.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Libdom.constant_document.Returns,
          fns.Function._Libdom.constant_document.ReturnsType,
          void
        >;
        constant_document(
          opts?: fns.Function._Libdom.constant_document.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Libdom.constant_document.Returns,
            fns.Function._Libdom.constant_document.ReturnsType
          >,
        ): void;
      }

      export interface FunctionProps {
        domsync: fns.Function._Libdom.domsync.Properties;
        entry_drop: fns.Function._Libdom.entry_drop.Properties;
        sync_drop: fns.Function._Libdom.sync_drop.Properties;
        get: fns.Function._Libdom._get.Properties;
        domain_of: fns.fns.Function._Libdom._Domain_Of_16734.Properties &
          Function._Libdom._Domain_Of_16735.Properties;
        entry: fns.Function._Libdom.entry.Properties;
        trigger_sync_domsync: fns.Function._Libdom.trigger_sync_domsync.Properties;
        rebuild: fns.Function._Libdom.rebuild.Properties;
        api_change_entryset: fns.Function._Libdom.api_change_entryset.Properties;
        columns: fns.Function._Libdom.columns.Properties;
        api_load_entryset: fns.Function._Libdom.api_load_entryset.Properties;
        constant: fns.Function._Libdom.constant.Properties;
        trigger_sync_entry: fns.Function._Libdom.trigger_sync_entry.Properties;
        domain: fns.Function._Libdom.domain.Properties;
        domain_document: fns.Function._Libdom.domain_document.Properties;
        describe: fns.Function._Libdom.describe.Properties;
        exports: fns.Function._Libdom.exports.Properties;
        entry_list: fns.Function._Libdom.entry_list.Properties;
        sync_entry: fns.Function._Libdom.sync_entry.Properties;
        set: fns.Function._Libdom._set.Properties;
        domset: fns.Function._Libdom.domset.Properties;
        prefix: fns.Function._Libdom.prefix.Properties;
        constant_document: fns.Function._Libdom.constant_document.Properties;
      }
    }

    export namespace _Tweeks {
      export interface FunctionDefinition {
        funct_pos_load_posto(
          opts?: fns.Function._Tweeks.funct_pos_load_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_posto.Returns,
          fns.Function._Tweeks.funct_pos_load_posto.ReturnsType,
          void
        >;
        funct_pos_load_posto(
          opts?: fns.Function._Tweeks.funct_pos_load_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_posto.Returns,
            fns.Function._Tweeks.funct_pos_load_posto.ReturnsType
          >,
        ): void;
        funct_pos_load_artigo_extras(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_extras.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_artigo_extras.Returns,
          fns.Function._Tweeks.funct_pos_load_artigo_extras.ReturnsType,
          void
        >;
        funct_pos_load_artigo_extras(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_extras.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_artigo_extras.Returns,
            fns.Function._Tweeks.funct_pos_load_artigo_extras.ReturnsType
          >,
        ): void;
        funct_pos__sync_conta_amount(
          opts?: fns.Function._Tweeks.funct_pos__sync_conta_amount.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos__sync_conta_amount.Returns,
          fns.Function._Tweeks.funct_pos__sync_conta_amount.ReturnsType,
          void
        >;
        funct_pos__sync_conta_amount(
          opts?: fns.Function._Tweeks.funct_pos__sync_conta_amount.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos__sync_conta_amount.Returns,
            fns.Function._Tweeks.funct_pos__sync_conta_amount.ReturnsType
          >,
        ): void;
        funct_change_colaborador(
          opts?: fns.Function._Tweeks.funct_change_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_colaborador.Returns,
          fns.Function._Tweeks.funct_change_colaborador.ReturnsType,
          void
        >;
        funct_change_colaborador(
          opts?: fns.Function._Tweeks.funct_change_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_colaborador.Returns,
            fns.Function._Tweeks.funct_change_colaborador.ReturnsType
          >,
        ): void;
        _get_caixa(
          opts?: fns.Function._Tweeks._get_caixa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_caixa.Returns,
          fns.Function._Tweeks._get_caixa.ReturnsType,
          void
        >;
        _get_caixa(
          opts?: fns.Function._Tweeks._get_caixa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_caixa.Returns,
            fns.Function._Tweeks._get_caixa.ReturnsType
          >,
        ): void;
        funct_load_caixa_by_colaborador(
          opts?: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_caixa_by_colaborador.Returns,
          fns.Function._Tweeks.funct_load_caixa_by_colaborador.ReturnsType,
          void
        >;
        funct_load_caixa_by_colaborador(
          opts?: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_caixa_by_colaborador.Returns,
            fns.Function._Tweeks.funct_load_caixa_by_colaborador.ReturnsType
          >,
        ): void;
        funct_load_cluster_by_branch(
          opts?: fns.Function._Tweeks.funct_load_cluster_by_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_cluster_by_branch.Returns,
          fns.Function._Tweeks.funct_load_cluster_by_branch.ReturnsType,
          void
        >;
        funct_load_cluster_by_branch(
          opts?: fns.Function._Tweeks.funct_load_cluster_by_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_cluster_by_branch.Returns,
            fns.Function._Tweeks.funct_load_cluster_by_branch.ReturnsType
          >,
        ): void;
        funct_load_serie(
          opts?: fns.Function._Tweeks.funct_load_serie.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_serie.Returns,
          fns.Function._Tweeks.funct_load_serie.ReturnsType,
          void
        >;
        funct_load_serie(
          opts?: fns.Function._Tweeks.funct_load_serie.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_serie.Returns,
            fns.Function._Tweeks.funct_load_serie.ReturnsType
          >,
        ): void;
        funct_pos_load_conta_data(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_data.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_conta_data.Returns,
          fns.Function._Tweeks.funct_pos_load_conta_data.ReturnsType,
          void
        >;
        funct_pos_load_conta_data(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_data.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_conta_data.Returns,
            fns.Function._Tweeks.funct_pos_load_conta_data.ReturnsType
          >,
        ): void;
        funct_reg_link_associacao(
          opts?: fns.Function._Tweeks.funct_reg_link_associacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_link_associacao.Returns,
          fns.Function._Tweeks.funct_reg_link_associacao.ReturnsType,
          void
        >;
        funct_reg_link_associacao(
          opts?: fns.Function._Tweeks.funct_reg_link_associacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_link_associacao.Returns,
            fns.Function._Tweeks.funct_reg_link_associacao.ReturnsType
          >,
        ): void;
        __load_cambio_day(
          opts?: fns.Function._Tweeks.__load_cambio_day.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__load_cambio_day.Returns,
          fns.Function._Tweeks.__load_cambio_day.ReturnsType,
          void
        >;
        __load_cambio_day(
          opts?: fns.Function._Tweeks.__load_cambio_day.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__load_cambio_day.Returns,
            fns.Function._Tweeks.__load_cambio_day.ReturnsType
          >,
        ): void;
        funct_sets_guia(
          opts?: fns.Function._Tweeks.funct_sets_guia.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_guia.Returns,
          fns.Function._Tweeks.funct_sets_guia.ReturnsType,
          void
        >;
        funct_sets_guia(
          opts?: fns.Function._Tweeks.funct_sets_guia.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_guia.Returns,
            fns.Function._Tweeks.funct_sets_guia.ReturnsType
          >,
        ): void;
        funct_change_ordem_classe(
          opts?: fns.Function._Tweeks.funct_change_ordem_classe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_ordem_classe.Returns,
          fns.Function._Tweeks.funct_change_ordem_classe.ReturnsType,
          void
        >;
        funct_change_ordem_classe(
          opts?: fns.Function._Tweeks.funct_change_ordem_classe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_ordem_classe.Returns,
            fns.Function._Tweeks.funct_change_ordem_classe.ReturnsType
          >,
        ): void;
        _get_artigo(
          opts?: fns.Function._Tweeks._get_artigo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_artigo.Returns,
          fns.Function._Tweeks._get_artigo.ReturnsType,
          void
        >;
        _get_artigo(
          opts?: fns.Function._Tweeks._get_artigo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_artigo.Returns,
            fns.Function._Tweeks._get_artigo.ReturnsType
          >,
        ): void;
        funct_reg_classe(
          opts?: fns.Function._Tweeks.funct_reg_classe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_classe.Returns,
          fns.Function._Tweeks.funct_reg_classe.ReturnsType,
          void
        >;
        funct_reg_classe(
          opts?: fns.Function._Tweeks.funct_reg_classe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_classe.Returns,
            fns.Function._Tweeks.funct_reg_classe.ReturnsType
          >,
        ): void;
        funct_report_transacao(
          opts?: fns.Function._Tweeks.funct_report_transacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_transacao.Returns,
          fns.Function._Tweeks.funct_report_transacao.ReturnsType,
          void
        >;
        funct_report_transacao(
          opts?: fns.Function._Tweeks.funct_report_transacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_transacao.Returns,
            fns.Function._Tweeks.funct_report_transacao.ReturnsType
          >,
        ): void;
        viewargs_set(
          opts?: fns.Function._Tweeks.viewargs_set.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.viewargs_set.Returns,
          fns.Function._Tweeks.viewargs_set.ReturnsType,
          void
        >;
        viewargs_set(
          opts?: fns.Function._Tweeks.viewargs_set.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.viewargs_set.Returns,
            fns.Function._Tweeks.viewargs_set.ReturnsType
          >,
        ): void;
        funct_change_mesa(
          opts?: fns.Function._Tweeks.funct_change_mesa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_mesa.Returns,
          fns.Function._Tweeks.funct_change_mesa.ReturnsType,
          void
        >;
        funct_change_mesa(
          opts?: fns.Function._Tweeks.funct_change_mesa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_mesa.Returns,
            fns.Function._Tweeks.funct_change_mesa.ReturnsType
          >,
        ): void;
        funct_change_link_disable(
          opts?: fns.Function._Tweeks.funct_change_link_disable.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_link_disable.Returns,
          fns.Function._Tweeks.funct_change_link_disable.ReturnsType,
          void
        >;
        funct_change_link_disable(
          opts?: fns.Function._Tweeks.funct_change_link_disable.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_link_disable.Returns,
            fns.Function._Tweeks.funct_change_link_disable.ReturnsType
          >,
        ): void;
        funct_load_entrada(
          opts?: fns.Function._Tweeks.funct_load_entrada.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_entrada.Returns,
          fns.Function._Tweeks.funct_load_entrada.ReturnsType,
          void
        >;
        funct_load_entrada(
          opts?: fns.Function._Tweeks.funct_load_entrada.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_entrada.Returns,
            fns.Function._Tweeks.funct_load_entrada.ReturnsType
          >,
        ): void;
        funct_change_conta(
          opts?: fns.Function._Tweeks.funct_change_conta.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_conta.Returns,
          fns.Function._Tweeks.funct_change_conta.ReturnsType,
          void
        >;
        funct_change_conta(
          opts?: fns.Function._Tweeks.funct_change_conta.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_conta.Returns,
            fns.Function._Tweeks.funct_change_conta.ReturnsType
          >,
        ): void;
        funct_sets_branch(
          opts?: fns.Function._Tweeks.funct_sets_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_branch.Returns,
          fns.Function._Tweeks.funct_sets_branch.ReturnsType,
          void
        >;
        funct_sets_branch(
          opts?: fns.Function._Tweeks.funct_sets_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_branch.Returns,
            fns.Function._Tweeks.funct_sets_branch.ReturnsType
          >,
        ): void;
        __generate_acerto_code(
          opts?: fns.Function._Tweeks.__generate_acerto_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_acerto_code.Returns,
          fns.Function._Tweeks.__generate_acerto_code.ReturnsType,
          void
        >;
        __generate_acerto_code(
          opts?: fns.Function._Tweeks.__generate_acerto_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_acerto_code.Returns,
            fns.Function._Tweeks.__generate_acerto_code.ReturnsType
          >,
        ): void;
        funct_reg_artigo(
          opts?: fns.Function._Tweeks.funct_reg_artigo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_artigo.Returns,
          fns.Function._Tweeks.funct_reg_artigo.ReturnsType,
          void
        >;
        funct_reg_artigo(
          opts?: fns.Function._Tweeks.funct_reg_artigo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_artigo.Returns,
            fns.Function._Tweeks.funct_reg_artigo.ReturnsType
          >,
        ): void;
        sets_parametrizacao(
          opts?: fns.Function._Tweeks.sets_parametrizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.sets_parametrizacao.Returns,
          fns.Function._Tweeks.sets_parametrizacao.ReturnsType,
          void
        >;
        sets_parametrizacao(
          opts?: fns.Function._Tweeks.sets_parametrizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.sets_parametrizacao.Returns,
            fns.Function._Tweeks.sets_parametrizacao.ReturnsType
          >,
        ): void;
        __sets_defaults_units(
          opts?: fns.Function._Tweeks.__sets_defaults_units.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__sets_defaults_units.Returns,
          fns.Function._Tweeks.__sets_defaults_units.ReturnsType,
          void
        >;
        __sets_defaults_units(
          opts?: fns.Function._Tweeks.__sets_defaults_units.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__sets_defaults_units.Returns,
            fns.Function._Tweeks.__sets_defaults_units.ReturnsType
          >,
        ): void;
        funct_change_artigo_estado(
          opts?: fns.Function._Tweeks.funct_change_artigo_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_artigo_estado.Returns,
          fns.Function._Tweeks.funct_change_artigo_estado.ReturnsType,
          void
        >;
        funct_change_artigo_estado(
          opts?: fns.Function._Tweeks.funct_change_artigo_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_artigo_estado.Returns,
            fns.Function._Tweeks.funct_change_artigo_estado.ReturnsType
          >,
        ): void;
        __tg_fluxo_on_venda(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_fluxo_on_venda.Returns,
          fns.Function._Tweeks.__tg_fluxo_on_venda.ReturnsType,
          void
        >;
        __tg_fluxo_on_venda(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_fluxo_on_venda.Returns,
            fns.Function._Tweeks.__tg_fluxo_on_venda.ReturnsType
          >,
        ): void;
        __generate_posto_chave(
          opts?: fns.Function._Tweeks.__generate_posto_chave.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_posto_chave.Returns,
          fns.Function._Tweeks.__generate_posto_chave.ReturnsType,
          void
        >;
        __generate_posto_chave(
          opts?: fns.Function._Tweeks.__generate_posto_chave.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_posto_chave.Returns,
            fns.Function._Tweeks.__generate_posto_chave.ReturnsType
          >,
        ): void;
        funct_pos_reg_conta(
          opts?: fns.Function._Tweeks.funct_pos_reg_conta.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_conta.Returns,
          fns.Function._Tweeks.funct_pos_reg_conta.ReturnsType,
          void
        >;
        funct_pos_reg_conta(
          opts?: fns.Function._Tweeks.funct_pos_reg_conta.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_conta.Returns,
            fns.Function._Tweeks.funct_pos_reg_conta.ReturnsType
          >,
        ): void;
        funct_change_link_unlink(
          opts?: fns.Function._Tweeks.funct_change_link_unlink.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_link_unlink.Returns,
          fns.Function._Tweeks.funct_change_link_unlink.ReturnsType,
          void
        >;
        funct_change_link_unlink(
          opts?: fns.Function._Tweeks.funct_change_link_unlink.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_link_unlink.Returns,
            fns.Function._Tweeks.funct_change_link_unlink.ReturnsType
          >,
        ): void;
        funct_load_tipoimposto(
          opts?: fns.Function._Tweeks.funct_load_tipoimposto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_tipoimposto.Returns,
          fns.Function._Tweeks.funct_load_tipoimposto.ReturnsType,
          void
        >;
        funct_load_tipoimposto(
          opts?: fns.Function._Tweeks.funct_load_tipoimposto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_tipoimposto.Returns,
            fns.Function._Tweeks.funct_load_tipoimposto.ReturnsType
          >,
        ): void;
        funct_change_link_switch(
          opts?: fns.Function._Tweeks.funct_change_link_switch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_link_switch.Returns,
          fns.Function._Tweeks.funct_change_link_switch.ReturnsType,
          void
        >;
        funct_change_link_switch(
          opts?: fns.Function._Tweeks.funct_change_link_switch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_link_switch.Returns,
            fns.Function._Tweeks.funct_change_link_switch.ReturnsType
          >,
        ): void;
        funct_reg_precario(
          opts?: fns.Function._Tweeks.funct_reg_precario.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_precario.Returns,
          fns.Function._Tweeks.funct_reg_precario.ReturnsType,
          void
        >;
        funct_reg_precario(
          opts?: fns.Function._Tweeks.funct_reg_precario.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_precario.Returns,
            fns.Function._Tweeks.funct_reg_precario.ReturnsType
          >,
        ): void;
        funct_load_classe_simple_report(
          opts?: fns.Function._Tweeks.funct_load_classe_simple_report.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_classe_simple_report.Returns,
          fns.Function._Tweeks.funct_load_classe_simple_report.ReturnsType,
          void
        >;
        funct_load_classe_simple_report(
          opts?: fns.Function._Tweeks.funct_load_classe_simple_report.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_classe_simple_report.Returns,
            fns.Function._Tweeks.funct_load_classe_simple_report.ReturnsType
          >,
        ): void;
        sets_lancamento(
          opts?: fns.Function._Tweeks.sets_lancamento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.sets_lancamento.Returns,
          fns.Function._Tweeks.sets_lancamento.ReturnsType,
          void
        >;
        sets_lancamento(
          opts?: fns.Function._Tweeks.sets_lancamento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.sets_lancamento.Returns,
            fns.Function._Tweeks.sets_lancamento.ReturnsType
          >,
        ): void;
        funct_load_transferencia(
          opts?: fns.Function._Tweeks.funct_load_transferencia.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_transferencia.Returns,
          fns.Function._Tweeks.funct_load_transferencia.ReturnsType,
          void
        >;
        funct_load_transferencia(
          opts?: fns.Function._Tweeks.funct_load_transferencia.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_transferencia.Returns,
            fns.Function._Tweeks.funct_load_transferencia.ReturnsType
          >,
        ): void;
        funct_load_espaco_simple(
          opts?: fns.Function._Tweeks.funct_load_espaco_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_espaco_simple.Returns,
          fns.Function._Tweeks.funct_load_espaco_simple.ReturnsType,
          void
        >;
        funct_load_espaco_simple(
          opts?: fns.Function._Tweeks.funct_load_espaco_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_espaco_simple.Returns,
            fns.Function._Tweeks.funct_load_espaco_simple.ReturnsType
          >,
        ): void;
        funct_reg_item(
          opts?: fns.Function._Tweeks.funct_reg_item.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_item.Returns,
          fns.Function._Tweeks.funct_reg_item.ReturnsType,
          void
        >;
        funct_reg_item(
          opts?: fns.Function._Tweeks.funct_reg_item.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_item.Returns,
            fns.Function._Tweeks.funct_reg_item.ReturnsType
          >,
        ): void;
        funct_change_item_estado(
          opts?: fns.Function._Tweeks.funct_change_item_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_item_estado.Returns,
          fns.Function._Tweeks.funct_change_item_estado.ReturnsType,
          void
        >;
        funct_change_item_estado(
          opts?: fns.Function._Tweeks.funct_change_item_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_item_estado.Returns,
            fns.Function._Tweeks.funct_change_item_estado.ReturnsType
          >,
        ): void;
        ___override_auth_funct_load_grants(
          opts?: fns.Function._Tweeks.___override_auth_funct_load_grants.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.___override_auth_funct_load_grants.Returns,
          fns.Function._Tweeks.___override_auth_funct_load_grants.ReturnsType,
          void
        >;
        ___override_auth_funct_load_grants(
          opts?: fns.Function._Tweeks.___override_auth_funct_load_grants.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.___override_auth_funct_load_grants.Returns,
            fns.Function._Tweeks.___override_auth_funct_load_grants.ReturnsType
          >,
        ): void;
        funct_load_conta_docs_financa(
          opts?: fns.Function._Tweeks.funct_load_conta_docs_financa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_docs_financa.Returns,
          fns.Function._Tweeks.funct_load_conta_docs_financa.ReturnsType,
          void
        >;
        funct_load_conta_docs_financa(
          opts?: fns.Function._Tweeks.funct_load_conta_docs_financa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_docs_financa.Returns,
            fns.Function._Tweeks.funct_load_conta_docs_financa.ReturnsType
          >,
        ): void;
        funct_change_posto_open(
          opts?: fns.Function._Tweeks.funct_change_posto_open.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_posto_open.Returns,
          fns.Function._Tweeks.funct_change_posto_open.ReturnsType,
          void
        >;
        funct_change_posto_open(
          opts?: fns.Function._Tweeks.funct_change_posto_open.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_posto_open.Returns,
            fns.Function._Tweeks.funct_change_posto_open.ReturnsType
          >,
        ): void;
        funct_load_items_simple(
          opts?: fns.Function._Tweeks.funct_load_items_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_items_simple.Returns,
          fns.Function._Tweeks.funct_load_items_simple.ReturnsType,
          void
        >;
        funct_load_items_simple(
          opts?: fns.Function._Tweeks.funct_load_items_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_items_simple.Returns,
            fns.Function._Tweeks.funct_load_items_simple.ReturnsType
          >,
        ): void;
        funct_load_espaco_migrate(
          opts?: fns.Function._Tweeks.funct_load_espaco_migrate.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_espaco_migrate.Returns,
          fns.Function._Tweeks.funct_load_espaco_migrate.ReturnsType,
          void
        >;
        funct_load_espaco_migrate(
          opts?: fns.Function._Tweeks.funct_load_espaco_migrate.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_espaco_migrate.Returns,
            fns.Function._Tweeks.funct_load_espaco_migrate.ReturnsType
          >,
        ): void;
        funct_pos_load_colaborador(
          opts?: fns.Function._Tweeks.funct_pos_load_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_colaborador.Returns,
          fns.Function._Tweeks.funct_pos_load_colaborador.ReturnsType,
          void
        >;
        funct_pos_load_colaborador(
          opts?: fns.Function._Tweeks.funct_pos_load_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_colaborador.Returns,
            fns.Function._Tweeks.funct_pos_load_colaborador.ReturnsType
          >,
        ): void;
        funct_load_artigo_simple(
          opts?: fns.Function._Tweeks.funct_load_artigo_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo_simple.Returns,
          fns.Function._Tweeks.funct_load_artigo_simple.ReturnsType,
          void
        >;
        funct_load_artigo_simple(
          opts?: fns.Function._Tweeks.funct_load_artigo_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo_simple.Returns,
            fns.Function._Tweeks.funct_load_artigo_simple.ReturnsType
          >,
        ): void;
        _get_espaco(
          opts?: fns.Function._Tweeks._get_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_espaco.Returns,
          fns.Function._Tweeks._get_espaco.ReturnsType,
          void
        >;
        _get_espaco(
          opts?: fns.Function._Tweeks._get_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_espaco.Returns,
            fns.Function._Tweeks._get_espaco.ReturnsType
          >,
        ): void;
        __tg_conta_after_close(
          opts?: fns.Function._Tweeks.__tg_conta_after_close.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_conta_after_close.Returns,
          fns.Function._Tweeks.__tg_conta_after_close.ReturnsType,
          void
        >;
        __tg_conta_after_close(
          opts?: fns.Function._Tweeks.__tg_conta_after_close.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_conta_after_close.Returns,
            fns.Function._Tweeks.__tg_conta_after_close.ReturnsType
          >,
        ): void;
        funct_change_posto_estado(
          opts?: fns.Function._Tweeks.funct_change_posto_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_posto_estado.Returns,
          fns.Function._Tweeks.funct_change_posto_estado.ReturnsType,
          void
        >;
        funct_change_posto_estado(
          opts?: fns.Function._Tweeks.funct_change_posto_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_posto_estado.Returns,
            fns.Function._Tweeks.funct_change_posto_estado.ReturnsType
          >,
        ): void;
        funct_pos_load_cliente(
          opts?: fns.Function._Tweeks.funct_pos_load_cliente.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_cliente.Returns,
          fns.Function._Tweeks.funct_pos_load_cliente.ReturnsType,
          void
        >;
        funct_pos_load_cliente(
          opts?: fns.Function._Tweeks.funct_pos_load_cliente.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_cliente.Returns,
            fns.Function._Tweeks.funct_pos_load_cliente.ReturnsType
          >,
        ): void;
        funct_pos_reg_deposito(
          opts?: fns.Function._Tweeks.funct_pos_reg_deposito.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_deposito.Returns,
          fns.Function._Tweeks.funct_pos_reg_deposito.ReturnsType,
          void
        >;
        funct_pos_reg_deposito(
          opts?: fns.Function._Tweeks.funct_pos_reg_deposito.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_deposito.Returns,
            fns.Function._Tweeks.funct_pos_reg_deposito.ReturnsType
          >,
        ): void;
        funct_load_artigo(
          opts?: fns.Function._Tweeks.funct_load_artigo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo.Returns,
          fns.Function._Tweeks.funct_load_artigo.ReturnsType,
          void
        >;
        funct_load_artigo(
          opts?: fns.Function._Tweeks.funct_load_artigo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo.Returns,
            fns.Function._Tweeks.funct_load_artigo.ReturnsType
          >,
        ): void;
        funct_load_report_parametrized(
          opts?: fns.Function._Tweeks.funct_load_report_parametrized.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_report_parametrized.Returns,
          fns.Function._Tweeks.funct_load_report_parametrized.ReturnsType,
          void
        >;
        funct_load_report_parametrized(
          opts?: fns.Function._Tweeks.funct_load_report_parametrized.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_report_parametrized.Returns,
            fns.Function._Tweeks.funct_load_report_parametrized.ReturnsType
          >,
        ): void;
        funct_load_espaco_configuracao(
          opts?: fns.Function._Tweeks.funct_load_espaco_configuracao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_espaco_configuracao.Returns,
          fns.Function._Tweeks.funct_load_espaco_configuracao.ReturnsType,
          void
        >;
        funct_load_espaco_configuracao(
          opts?: fns.Function._Tweeks.funct_load_espaco_configuracao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_espaco_configuracao.Returns,
            fns.Function._Tweeks.funct_load_espaco_configuracao.ReturnsType
          >,
        ): void;
        funct_pos_reg_vendaimposto(
          opts?: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_vendaimposto.Returns,
          fns.Function._Tweeks.funct_pos_reg_vendaimposto.ReturnsType,
          void
        >;
        funct_pos_reg_vendaimposto(
          opts?: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_vendaimposto.Returns,
            fns.Function._Tweeks.funct_pos_reg_vendaimposto.ReturnsType
          >,
        ): void;
        __lancamento_regularizacao(
          opts?: fns.Function._Tweeks.__lancamento_regularizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__lancamento_regularizacao.Returns,
          fns.Function._Tweeks.__lancamento_regularizacao.ReturnsType,
          void
        >;
        __lancamento_regularizacao(
          opts?: fns.Function._Tweeks.__lancamento_regularizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__lancamento_regularizacao.Returns,
            fns.Function._Tweeks.__lancamento_regularizacao.ReturnsType
          >,
        ): void;
        __artigo_has_stock(
          opts?: fns.Function._Tweeks.__artigo_has_stock.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__artigo_has_stock.Returns,
          fns.Function._Tweeks.__artigo_has_stock.ReturnsType,
          void
        >;
        __artigo_has_stock(
          opts?: fns.Function._Tweeks.__artigo_has_stock.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__artigo_has_stock.Returns,
            fns.Function._Tweeks.__artigo_has_stock.ReturnsType
          >,
        ): void;
        funct_load_posto(
          opts?: fns.Function._Tweeks.funct_load_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_posto.Returns,
          fns.Function._Tweeks.funct_load_posto.ReturnsType,
          void
        >;
        funct_load_posto(
          opts?: fns.Function._Tweeks.funct_load_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_posto.Returns,
            fns.Function._Tweeks.funct_load_posto.ReturnsType
          >,
        ): void;
        funct_load_espaco(
          opts?: fns.Function._Tweeks.funct_load_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_espaco.Returns,
          fns.Function._Tweeks.funct_load_espaco.ReturnsType,
          void
        >;
        funct_load_espaco(
          opts?: fns.Function._Tweeks.funct_load_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_espaco.Returns,
            fns.Function._Tweeks.funct_load_espaco.ReturnsType
          >,
        ): void;
        __generate_fornecedor_code(
          opts?: fns.Function._Tweeks.__generate_fornecedor_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_fornecedor_code.Returns,
          fns.Function._Tweeks.__generate_fornecedor_code.ReturnsType,
          void
        >;
        __generate_fornecedor_code(
          opts?: fns.Function._Tweeks.__generate_fornecedor_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_fornecedor_code.Returns,
            fns.Function._Tweeks.__generate_fornecedor_code.ReturnsType
          >,
        ): void;
        funct_load_conta_by_caixa(
          opts?: fns.Function._Tweeks.funct_load_conta_by_caixa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_by_caixa.Returns,
          fns.Function._Tweeks.funct_load_conta_by_caixa.ReturnsType,
          void
        >;
        funct_load_conta_by_caixa(
          opts?: fns.Function._Tweeks.funct_load_conta_by_caixa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_by_caixa.Returns,
            fns.Function._Tweeks.funct_load_conta_by_caixa.ReturnsType
          >,
        ): void;
        funct_pos_report_venda(
          opts?: fns.Function._Tweeks.funct_pos_report_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_report_venda.Returns,
          fns.Function._Tweeks.funct_pos_report_venda.ReturnsType,
          void
        >;
        funct_pos_report_venda(
          opts?: fns.Function._Tweeks.funct_pos_report_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_report_venda.Returns,
            fns.Function._Tweeks.funct_pos_report_venda.ReturnsType
          >,
        ): void;
        __tg_fluxo_on_transferencia(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_fluxo_on_transferencia.Returns,
          fns.Function._Tweeks.__tg_fluxo_on_transferencia.ReturnsType,
          void
        >;
        __tg_fluxo_on_transferencia(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_fluxo_on_transferencia.Returns,
            fns.Function._Tweeks.__tg_fluxo_on_transferencia.ReturnsType
          >,
        ): void;
        funct_pos_load_artigo_composto(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_composto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_artigo_composto.Returns,
          fns.Function._Tweeks.funct_pos_load_artigo_composto.ReturnsType,
          void
        >;
        funct_pos_load_artigo_composto(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_composto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_artigo_composto.Returns,
            fns.Function._Tweeks.funct_pos_load_artigo_composto.ReturnsType
          >,
        ): void;
        __branch_menu(
          opts?: fns.Function._Tweeks.__branch_menu.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__branch_menu.Returns,
          fns.Function._Tweeks.__branch_menu.ReturnsType,
          void
        >;
        __branch_menu(
          opts?: fns.Function._Tweeks.__branch_menu.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__branch_menu.Returns,
            fns.Function._Tweeks.__branch_menu.ReturnsType
          >,
        ): void;
        funct_load_lancamento(
          opts?: fns.Function._Tweeks.funct_load_lancamento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_lancamento.Returns,
          fns.Function._Tweeks.funct_load_lancamento.ReturnsType,
          void
        >;
        funct_load_lancamento(
          opts?: fns.Function._Tweeks.funct_load_lancamento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_lancamento.Returns,
            fns.Function._Tweeks.funct_load_lancamento.ReturnsType
          >,
        ): void;
        __tg_before_update_classe(
          opts?: fns.Function._Tweeks.__tg_before_update_classe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_before_update_classe.Returns,
          fns.Function._Tweeks.__tg_before_update_classe.ReturnsType,
          void
        >;
        __tg_before_update_classe(
          opts?: fns.Function._Tweeks.__tg_before_update_classe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_before_update_classe.Returns,
            fns.Function._Tweeks.__tg_before_update_classe.ReturnsType
          >,
        ): void;
        funct_change_chave_restore(
          opts?: fns.Function._Tweeks.funct_change_chave_restore.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_chave_restore.Returns,
          fns.Function._Tweeks.funct_change_chave_restore.ReturnsType,
          void
        >;
        funct_change_chave_restore(
          opts?: fns.Function._Tweeks.funct_change_chave_restore.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_chave_restore.Returns,
            fns.Function._Tweeks.funct_change_chave_restore.ReturnsType
          >,
        ): void;
        funct_load_artig_check_nome(
          opts?: fns.Function._Tweeks.funct_load_artig_check_nome.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artig_check_nome.Returns,
          fns.Function._Tweeks.funct_load_artig_check_nome.ReturnsType,
          void
        >;
        funct_load_artig_check_nome(
          opts?: fns.Function._Tweeks.funct_load_artig_check_nome.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artig_check_nome.Returns,
            fns.Function._Tweeks.funct_load_artig_check_nome.ReturnsType
          >,
        ): void;
        funct_pos_change_conta_anular(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_anular.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_change_conta_anular.Returns,
          fns.Function._Tweeks.funct_pos_change_conta_anular.ReturnsType,
          void
        >;
        funct_pos_change_conta_anular(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_anular.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_change_conta_anular.Returns,
            fns.Function._Tweeks.funct_pos_change_conta_anular.ReturnsType
          >,
        ): void;
        funct_load_device_unregistered(
          opts?: fns.Function._Tweeks.funct_load_device_unregistered.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_device_unregistered.Returns,
          fns.Function._Tweeks.funct_load_device_unregistered.ReturnsType,
          void
        >;
        funct_load_device_unregistered(
          opts?: fns.Function._Tweeks.funct_load_device_unregistered.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_device_unregistered.Returns,
            fns.Function._Tweeks.funct_load_device_unregistered.ReturnsType
          >,
        ): void;
        _get_tmovimento(
          opts?: fns.Function._Tweeks._get_tmovimento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_tmovimento.Returns,
          fns.Function._Tweeks._get_tmovimento.ReturnsType,
          void
        >;
        _get_tmovimento(
          opts?: fns.Function._Tweeks._get_tmovimento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_tmovimento.Returns,
            fns.Function._Tweeks._get_tmovimento.ReturnsType
          >,
        ): void;
        funct_load_posto_status(
          opts?: fns.Function._Tweeks.funct_load_posto_status.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_posto_status.Returns,
          fns.Function._Tweeks.funct_load_posto_status.ReturnsType,
          void
        >;
        funct_load_posto_status(
          opts?: fns.Function._Tweeks.funct_load_posto_status.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_posto_status.Returns,
            fns.Function._Tweeks.funct_load_posto_status.ReturnsType
          >,
        ): void;
        funct_pos_reg_venda(
          opts?: fns.Function._Tweeks.funct_pos_reg_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_venda.Returns,
          fns.Function._Tweeks.funct_pos_reg_venda.ReturnsType,
          void
        >;
        funct_pos_reg_venda(
          opts?: fns.Function._Tweeks.funct_pos_reg_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_venda.Returns,
            fns.Function._Tweeks.funct_pos_reg_venda.ReturnsType
          >,
        ): void;
        _get_stock(
          opts?: fns.Function._Tweeks._get_stock.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_stock.Returns,
          fns.Function._Tweeks._get_stock.ReturnsType,
          void
        >;
        _get_stock(
          opts?: fns.Function._Tweeks._get_stock.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_stock.Returns,
            fns.Function._Tweeks._get_stock.ReturnsType
          >,
        ): void;
        funct_sets_fornecedor(
          opts?: fns.Function._Tweeks.funct_sets_fornecedor.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_fornecedor.Returns,
          fns.Function._Tweeks.funct_sets_fornecedor.ReturnsType,
          void
        >;
        funct_sets_fornecedor(
          opts?: fns.Function._Tweeks.funct_sets_fornecedor.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_fornecedor.Returns,
            fns.Function._Tweeks.funct_sets_fornecedor.ReturnsType
          >,
        ): void;
        _get_conta(
          opts?: fns.Function._Tweeks._get_conta.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_conta.Returns,
          fns.Function._Tweeks._get_conta.ReturnsType,
          void
        >;
        _get_conta(
          opts?: fns.Function._Tweeks._get_conta.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_conta.Returns,
            fns.Function._Tweeks._get_conta.ReturnsType
          >,
        ): void;
        funct_change_conta_preparar(
          opts?: fns.Function._Tweeks.funct_change_conta_preparar.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_conta_preparar.Returns,
          fns.Function._Tweeks.funct_change_conta_preparar.ReturnsType,
          void
        >;
        funct_change_conta_preparar(
          opts?: fns.Function._Tweeks.funct_change_conta_preparar.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_conta_preparar.Returns,
            fns.Function._Tweeks.funct_change_conta_preparar.ReturnsType
          >,
        ): void;
        funct_load_autorizacao(
          opts?: fns.Function._Tweeks.funct_load_autorizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_autorizacao.Returns,
          fns.Function._Tweeks.funct_load_autorizacao.ReturnsType,
          void
        >;
        funct_load_autorizacao(
          opts?: fns.Function._Tweeks.funct_load_autorizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_autorizacao.Returns,
            fns.Function._Tweeks.funct_load_autorizacao.ReturnsType
          >,
        ): void;
        funct_sets_serie(
          opts?: fns.Function._Tweeks.funct_sets_serie.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_serie.Returns,
          fns.Function._Tweeks.funct_sets_serie.ReturnsType,
          void
        >;
        funct_sets_serie(
          opts?: fns.Function._Tweeks.funct_sets_serie.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_serie.Returns,
            fns.Function._Tweeks.funct_sets_serie.ReturnsType
          >,
        ): void;
        funct_pos_change_conta_fechar(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_fechar.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_change_conta_fechar.Returns,
          fns.Function._Tweeks.funct_pos_change_conta_fechar.ReturnsType,
          void
        >;
        funct_pos_change_conta_fechar(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_fechar.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_change_conta_fechar.Returns,
            fns.Function._Tweeks.funct_pos_change_conta_fechar.ReturnsType
          >,
        ): void;
        funct_load_deposito_data(
          opts?: fns.Function._Tweeks.funct_load_deposito_data.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_deposito_data.Returns,
          fns.Function._Tweeks.funct_load_deposito_data.ReturnsType,
          void
        >;
        funct_load_deposito_data(
          opts?: fns.Function._Tweeks.funct_load_deposito_data.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_deposito_data.Returns,
            fns.Function._Tweeks.funct_load_deposito_data.ReturnsType
          >,
        ): void;
        funct_report_caixa(
          opts?: fns.Function._Tweeks.funct_report_caixa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_caixa.Returns,
          fns.Function._Tweeks.funct_report_caixa.ReturnsType,
          void
        >;
        funct_report_caixa(
          opts?: fns.Function._Tweeks.funct_report_caixa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_caixa.Returns,
            fns.Function._Tweeks.funct_report_caixa.ReturnsType
          >,
        ): void;
        funct_load_posto_closed(
          opts?: fns.Function._Tweeks.funct_load_posto_closed.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_posto_closed.Returns,
          fns.Function._Tweeks.funct_load_posto_closed.ReturnsType,
          void
        >;
        funct_load_posto_closed(
          opts?: fns.Function._Tweeks.funct_load_posto_closed.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_posto_closed.Returns,
            fns.Function._Tweeks.funct_load_posto_closed.ReturnsType
          >,
        ): void;
        __generate_classe_code(
          opts?: fns.Function._Tweeks.__generate_classe_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_classe_code.Returns,
          fns.Function._Tweeks.__generate_classe_code.ReturnsType,
          void
        >;
        __generate_classe_code(
          opts?: fns.Function._Tweeks.__generate_classe_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_classe_code.Returns,
            fns.Function._Tweeks.__generate_classe_code.ReturnsType
          >,
        ): void;
        funct_reg_dispoe(
          opts?: fns.Function._Tweeks.funct_reg_dispoe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_dispoe.Returns,
          fns.Function._Tweeks.funct_reg_dispoe.ReturnsType,
          void
        >;
        funct_reg_dispoe(
          opts?: fns.Function._Tweeks.funct_reg_dispoe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_dispoe.Returns,
            fns.Function._Tweeks.funct_reg_dispoe.ReturnsType
          >,
        ): void;
        funct_reg_colaborador(
          opts?: fns.Function._Tweeks.funct_reg_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_colaborador.Returns,
          fns.Function._Tweeks.funct_reg_colaborador.ReturnsType,
          void
        >;
        funct_reg_colaborador(
          opts?: fns.Function._Tweeks.funct_reg_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_colaborador.Returns,
            fns.Function._Tweeks.funct_reg_colaborador.ReturnsType
          >,
        ): void;
        funct_change_link_move(
          opts?: fns.Function._Tweeks.funct_change_link_move.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_link_move.Returns,
          fns.Function._Tweeks.funct_change_link_move.ReturnsType,
          void
        >;
        funct_change_link_move(
          opts?: fns.Function._Tweeks.funct_change_link_move.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_link_move.Returns,
            fns.Function._Tweeks.funct_change_link_move.ReturnsType
          >,
        ): void;
        funct_reg_stock(
          opts?: fns.Function._Tweeks.funct_reg_stock.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_stock.Returns,
          fns.Function._Tweeks.funct_reg_stock.ReturnsType,
          void
        >;
        funct_reg_stock(
          opts?: fns.Function._Tweeks.funct_reg_stock.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_stock.Returns,
            fns.Function._Tweeks.funct_reg_stock.ReturnsType
          >,
        ): void;
        _get_classe(
          opts?: fns.Function._Tweeks._get_classe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_classe.Returns,
          fns.Function._Tweeks._get_classe.ReturnsType,
          void
        >;
        _get_classe(
          opts?: fns.Function._Tweeks._get_classe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_classe.Returns,
            fns.Function._Tweeks._get_classe.ReturnsType
          >,
        ): void;
        funct_change_espaco_configuracao(
          opts?: fns.Function._Tweeks.funct_change_espaco_configuracao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_espaco_configuracao.Returns,
          fns.Function._Tweeks.funct_change_espaco_configuracao.ReturnsType,
          void
        >;
        funct_change_espaco_configuracao(
          opts?: fns.Function._Tweeks.funct_change_espaco_configuracao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_espaco_configuracao.Returns,
            fns.Function._Tweeks.funct_change_espaco_configuracao.ReturnsType
          >,
        ): void;
        funct_change_espaco(
          opts?: fns.Function._Tweeks.funct_change_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_espaco.Returns,
          fns.Function._Tweeks.funct_change_espaco.ReturnsType,
          void
        >;
        funct_change_espaco(
          opts?: fns.Function._Tweeks.funct_change_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_espaco.Returns,
            fns.Function._Tweeks.funct_change_espaco.ReturnsType
          >,
        ): void;
        __tg_use_branch(
          opts?: fns.Function._Tweeks.__tg_use_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_use_branch.Returns,
          fns.Function._Tweeks.__tg_use_branch.ReturnsType,
          void
        >;
        __tg_use_branch(
          opts?: fns.Function._Tweeks.__tg_use_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_use_branch.Returns,
            fns.Function._Tweeks.__tg_use_branch.ReturnsType
          >,
        ): void;
        funct_pos_load_conta_proforma(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_proforma.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_conta_proforma.Returns,
          fns.Function._Tweeks.funct_pos_load_conta_proforma.ReturnsType,
          void
        >;
        funct_pos_load_conta_proforma(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_proforma.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_conta_proforma.Returns,
            fns.Function._Tweeks.funct_pos_load_conta_proforma.ReturnsType
          >,
        ): void;
        funct_pos_generate_key(
          opts?: fns.Function._Tweeks.funct_pos_generate_key.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_generate_key.Returns,
          fns.Function._Tweeks.funct_pos_generate_key.ReturnsType,
          void
        >;
        funct_pos_generate_key(
          opts?: fns.Function._Tweeks.funct_pos_generate_key.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_generate_key.Returns,
            fns.Function._Tweeks.funct_pos_generate_key.ReturnsType
          >,
        ): void;
        funct_load_classe(
          opts?: fns.Function._Tweeks.funct_load_classe.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_classe.Returns,
          fns.Function._Tweeks.funct_load_classe.ReturnsType,
          void
        >;
        funct_load_classe(
          opts?: fns.Function._Tweeks.funct_load_classe.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_classe.Returns,
            fns.Function._Tweeks.funct_load_classe.ReturnsType
          >,
        ): void;
        __get_serie_espaco(
          opts?: fns.Function._Tweeks.__get_serie_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__get_serie_espaco.Returns,
          fns.Function._Tweeks.__get_serie_espaco.ReturnsType,
          void
        >;
        __get_serie_espaco(
          opts?: fns.Function._Tweeks.__get_serie_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__get_serie_espaco.Returns,
            fns.Function._Tweeks.__get_serie_espaco.ReturnsType
          >,
        ): void;
        funct_reg_transferencia(
          opts?: fns.Function._Tweeks.funct_reg_transferencia.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_transferencia.Returns,
          fns.Function._Tweeks.funct_reg_transferencia.ReturnsType,
          void
        >;
        funct_reg_transferencia(
          opts?: fns.Function._Tweeks.funct_reg_transferencia.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_transferencia.Returns,
            fns.Function._Tweeks.funct_reg_transferencia.ReturnsType
          >,
        ): void;
        funct_change_fornecedor_estado(
          opts?: fns.Function._Tweeks.funct_change_fornecedor_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_fornecedor_estado.Returns,
          fns.Function._Tweeks.funct_change_fornecedor_estado.ReturnsType,
          void
        >;
        funct_change_fornecedor_estado(
          opts?: fns.Function._Tweeks.funct_change_fornecedor_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_fornecedor_estado.Returns,
            fns.Function._Tweeks.funct_change_fornecedor_estado.ReturnsType
          >,
        ): void;
        funct_load_cambio_history(
          opts?: fns.Function._Tweeks.funct_load_cambio_history.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_cambio_history.Returns,
          fns.Function._Tweeks.funct_load_cambio_history.ReturnsType,
          void
        >;
        funct_load_cambio_history(
          opts?: fns.Function._Tweeks.funct_load_cambio_history.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_cambio_history.Returns,
            fns.Function._Tweeks.funct_load_cambio_history.ReturnsType
          >,
        ): void;
        __space_branch_level(
          opts?: fns.Function._Tweeks.__space_branch_level.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__space_branch_level.Returns,
          fns.Function._Tweeks.__space_branch_level.ReturnsType,
          void
        >;
        __space_branch_level(
          opts?: fns.Function._Tweeks.__space_branch_level.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__space_branch_level.Returns,
            fns.Function._Tweeks.__space_branch_level.ReturnsType
          >,
        ): void;
        funct_reg_trabalha(
          opts?: fns.Function._Tweeks.funct_reg_trabalha.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_trabalha.Returns,
          fns.Function._Tweeks.funct_reg_trabalha.ReturnsType,
          void
        >;
        funct_reg_trabalha(
          opts?: fns.Function._Tweeks.funct_reg_trabalha.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_trabalha.Returns,
            fns.Function._Tweeks.funct_reg_trabalha.ReturnsType
          >,
        ): void;
        viewarg(
          opts?: fns.Function._Tweeks.viewarg.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.viewarg.Returns,
          fns.Function._Tweeks.viewarg.ReturnsType,
          void
        >;
        viewarg(
          opts?: fns.Function._Tweeks.viewarg.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.viewarg.Returns,
            fns.Function._Tweeks.viewarg.ReturnsType
          >,
        ): void;
        funct_load_artigo_base(
          opts?: fns.Function._Tweeks.funct_load_artigo_base.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo_base.Returns,
          fns.Function._Tweeks.funct_load_artigo_base.ReturnsType,
          void
        >;
        funct_load_artigo_base(
          opts?: fns.Function._Tweeks.funct_load_artigo_base.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo_base.Returns,
            fns.Function._Tweeks.funct_load_artigo_base.ReturnsType
          >,
        ): void;
        funct_load_trabalha(
          opts?: fns.Function._Tweeks.funct_load_trabalha.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_trabalha.Returns,
          fns.Function._Tweeks.funct_load_trabalha.ReturnsType,
          void
        >;
        funct_load_trabalha(
          opts?: fns.Function._Tweeks.funct_load_trabalha.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_trabalha.Returns,
            fns.Function._Tweeks.funct_load_trabalha.ReturnsType
          >,
        ): void;
        funct_reg_mesa(
          opts?: fns.Function._Tweeks.funct_reg_mesa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_mesa.Returns,
          fns.Function._Tweeks.funct_reg_mesa.ReturnsType,
          void
        >;
        funct_reg_mesa(
          opts?: fns.Function._Tweeks.funct_reg_mesa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_mesa.Returns,
            fns.Function._Tweeks.funct_reg_mesa.ReturnsType
          >,
        ): void;
        _get_link(
          opts?: fns.Function._Tweeks._get_link.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_link.Returns,
          fns.Function._Tweeks._get_link.ReturnsType,
          void
        >;
        _get_link(
          opts?: fns.Function._Tweeks._get_link.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_link.Returns,
            fns.Function._Tweeks._get_link.ReturnsType
          >,
        ): void;
        funct_load_serie_available(
          opts?: fns.Function._Tweeks.funct_load_serie_available.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_serie_available.Returns,
          fns.Function._Tweeks.funct_load_serie_available.ReturnsType,
          void
        >;
        funct_load_serie_available(
          opts?: fns.Function._Tweeks.funct_load_serie_available.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_serie_available.Returns,
            fns.Function._Tweeks.funct_load_serie_available.ReturnsType
          >,
        ): void;
        funct_load_artigo_data(
          opts?: fns.Function._Tweeks.funct_load_artigo_data.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo_data.Returns,
          fns.Function._Tweeks.funct_load_artigo_data.ReturnsType,
          void
        >;
        funct_load_artigo_data(
          opts?: fns.Function._Tweeks.funct_load_artigo_data.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo_data.Returns,
            fns.Function._Tweeks.funct_load_artigo_data.ReturnsType
          >,
        ): void;
        funct_change_classe_estado(
          opts?: fns.Function._Tweeks.funct_change_classe_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_classe_estado.Returns,
          fns.Function._Tweeks.funct_change_classe_estado.ReturnsType,
          void
        >;
        funct_change_classe_estado(
          opts?: fns.Function._Tweeks.funct_change_classe_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_classe_estado.Returns,
            fns.Function._Tweeks.funct_change_classe_estado.ReturnsType
          >,
        ): void;
        funct_reg_conta_nota_credito(
          opts?: fns.Function._Tweeks.funct_reg_conta_nota_credito.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_conta_nota_credito.Returns,
          fns.Function._Tweeks.funct_reg_conta_nota_credito.ReturnsType,
          void
        >;
        funct_reg_conta_nota_credito(
          opts?: fns.Function._Tweeks.funct_reg_conta_nota_credito.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_conta_nota_credito.Returns,
            fns.Function._Tweeks.funct_reg_conta_nota_credito.ReturnsType
          >,
        ): void;
        funct_report_compra_entrada(
          opts?: fns.Function._Tweeks.funct_report_compra_entrada.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_compra_entrada.Returns,
          fns.Function._Tweeks.funct_report_compra_entrada.ReturnsType,
          void
        >;
        funct_report_compra_entrada(
          opts?: fns.Function._Tweeks.funct_report_compra_entrada.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_compra_entrada.Returns,
            fns.Function._Tweeks.funct_report_compra_entrada.ReturnsType
          >,
        ): void;
        funct_pos_reg_cliente(
          opts?: fns.Function._Tweeks.funct_pos_reg_cliente.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_cliente.Returns,
          fns.Function._Tweeks.funct_pos_reg_cliente.ReturnsType,
          void
        >;
        funct_pos_reg_cliente(
          opts?: fns.Function._Tweeks.funct_pos_reg_cliente.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_cliente.Returns,
            fns.Function._Tweeks.funct_pos_reg_cliente.ReturnsType
          >,
        ): void;
        load_clusters(
          opts?: fns.Function._Tweeks.load_clusters.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.load_clusters.Returns,
          fns.Function._Tweeks.load_clusters.ReturnsType,
          void
        >;
        load_clusters(
          opts?: fns.Function._Tweeks.load_clusters.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.load_clusters.Returns,
            fns.Function._Tweeks.load_clusters.ReturnsType
          >,
        ): void;
        funct_sets_unit(
          opts?: fns.Function._Tweeks.funct_sets_unit.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_unit.Returns,
          fns.Function._Tweeks.funct_sets_unit.ReturnsType,
          void
        >;
        funct_sets_unit(
          opts?: fns.Function._Tweeks.funct_sets_unit.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_unit.Returns,
            fns.Function._Tweeks.funct_sets_unit.ReturnsType
          >,
        ): void;
        funct_change_mesa_estado(
          opts?: fns.Function._Tweeks.funct_change_mesa_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_mesa_estado.Returns,
          fns.Function._Tweeks.funct_change_mesa_estado.ReturnsType,
          void
        >;
        funct_change_mesa_estado(
          opts?: fns.Function._Tweeks.funct_change_mesa_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_mesa_estado.Returns,
            fns.Function._Tweeks.funct_change_mesa_estado.ReturnsType
          >,
        ): void;
        __check_stock_on_venda(
          opts?: fns.Function._Tweeks.__check_stock_on_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__check_stock_on_venda.Returns,
          fns.Function._Tweeks.__check_stock_on_venda.ReturnsType,
          void
        >;
        __check_stock_on_venda(
          opts?: fns.Function._Tweeks.__check_stock_on_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__check_stock_on_venda.Returns,
            fns.Function._Tweeks.__check_stock_on_venda.ReturnsType
          >,
        ): void;
        funct_load_mesa_livre(
          opts?: fns.Function._Tweeks.funct_load_mesa_livre.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_mesa_livre.Returns,
          fns.Function._Tweeks.funct_load_mesa_livre.ReturnsType,
          void
        >;
        funct_load_mesa_livre(
          opts?: fns.Function._Tweeks.funct_load_mesa_livre.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_mesa_livre.Returns,
            fns.Function._Tweeks.funct_load_mesa_livre.ReturnsType
          >,
        ): void;
        funct_change_conta_imprimir(
          opts?: fns.Function._Tweeks.funct_change_conta_imprimir.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_conta_imprimir.Returns,
          fns.Function._Tweeks.funct_change_conta_imprimir.ReturnsType,
          void
        >;
        funct_change_conta_imprimir(
          opts?: fns.Function._Tweeks.funct_change_conta_imprimir.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_conta_imprimir.Returns,
            fns.Function._Tweeks.funct_change_conta_imprimir.ReturnsType
          >,
        ): void;
        funct_load_fornecedor_simple(
          opts?: fns.Function._Tweeks.funct_load_fornecedor_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_fornecedor_simple.Returns,
          fns.Function._Tweeks.funct_load_fornecedor_simple.ReturnsType,
          void
        >;
        funct_load_fornecedor_simple(
          opts?: fns.Function._Tweeks.funct_load_fornecedor_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_fornecedor_simple.Returns,
            fns.Function._Tweeks.funct_load_fornecedor_simple.ReturnsType
          >,
        ): void;
        funct_change_espaco_estado(
          opts?: fns.Function._Tweeks.funct_change_espaco_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_espaco_estado.Returns,
          fns.Function._Tweeks.funct_change_espaco_estado.ReturnsType,
          void
        >;
        funct_change_espaco_estado(
          opts?: fns.Function._Tweeks.funct_change_espaco_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_espaco_estado.Returns,
            fns.Function._Tweeks.funct_change_espaco_estado.ReturnsType
          >,
        ): void;
        _get_item(
          opts?: fns.Function._Tweeks._get_item.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_item.Returns,
          fns.Function._Tweeks._get_item.ReturnsType,
          void
        >;
        _get_item(
          opts?: fns.Function._Tweeks._get_item.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_item.Returns,
            fns.Function._Tweeks._get_item.ReturnsType
          >,
        ): void;
        funct_pos_load_artigo_search(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_search.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_artigo_search.Returns,
          fns.Function._Tweeks.funct_pos_load_artigo_search.ReturnsType,
          void
        >;
        funct_pos_load_artigo_search(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo_search.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_artigo_search.Returns,
            fns.Function._Tweeks.funct_pos_load_artigo_search.ReturnsType
          >,
        ): void;
        funct_load_unit(
          opts?: fns.Function._Tweeks.funct_load_unit.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_unit.Returns,
          fns.Function._Tweeks.funct_load_unit.ReturnsType,
          void
        >;
        funct_load_unit(
          opts?: fns.Function._Tweeks.funct_load_unit.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_unit.Returns,
            fns.Function._Tweeks.funct_load_unit.ReturnsType
          >,
        ): void;
        funct_reg_fornecedor(
          opts?: fns.Function._Tweeks.funct_reg_fornecedor.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_fornecedor.Returns,
          fns.Function._Tweeks.funct_reg_fornecedor.ReturnsType,
          void
        >;
        funct_reg_fornecedor(
          opts?: fns.Function._Tweeks.funct_reg_fornecedor.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_fornecedor.Returns,
            fns.Function._Tweeks.funct_reg_fornecedor.ReturnsType
          >,
        ): void;
        funct_reg_conta_docs_financa(
          opts?: fns.Function._Tweeks.funct_reg_conta_docs_financa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_conta_docs_financa.Returns,
          fns.Function._Tweeks.funct_reg_conta_docs_financa.ReturnsType,
          void
        >;
        funct_reg_conta_docs_financa(
          opts?: fns.Function._Tweeks.funct_reg_conta_docs_financa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_conta_docs_financa.Returns,
            fns.Function._Tweeks.funct_reg_conta_docs_financa.ReturnsType
          >,
        ): void;
        _get_impostos_taxa(
          opts?: fns.Function._Tweeks._get_impostos_taxa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_impostos_taxa.Returns,
          fns.Function._Tweeks._get_impostos_taxa.ReturnsType,
          void
        >;
        _get_impostos_taxa(
          opts?: fns.Function._Tweeks._get_impostos_taxa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_impostos_taxa.Returns,
            fns.Function._Tweeks._get_impostos_taxa.ReturnsType
          >,
        ): void;
        funct_load_fornecedor(
          opts?: fns.Function._Tweeks.funct_load_fornecedor.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_fornecedor.Returns,
          fns.Function._Tweeks.funct_load_fornecedor.ReturnsType,
          void
        >;
        funct_load_fornecedor(
          opts?: fns.Function._Tweeks.funct_load_fornecedor.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_fornecedor.Returns,
            fns.Function._Tweeks.funct_load_fornecedor.ReturnsType
          >,
        ): void;
        funct_load_chave(
          opts?: fns.Function._Tweeks.funct_load_chave.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_chave.Returns,
          fns.Function._Tweeks.funct_load_chave.ReturnsType,
          void
        >;
        funct_load_chave(
          opts?: fns.Function._Tweeks.funct_load_chave.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_chave.Returns,
            fns.Function._Tweeks.funct_load_chave.ReturnsType
          >,
        ): void;
        funct_report_stock_movimentos(
          opts?: fns.Function._Tweeks.funct_report_stock_movimentos.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_stock_movimentos.Returns,
          fns.Function._Tweeks.funct_report_stock_movimentos.ReturnsType,
          void
        >;
        funct_report_stock_movimentos(
          opts?: fns.Function._Tweeks.funct_report_stock_movimentos.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_stock_movimentos.Returns,
            fns.Function._Tweeks.funct_report_stock_movimentos.ReturnsType
          >,
        ): void;
        __infinity_loop(
          opts?: fns.Function._Tweeks.__infinity_loop.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__infinity_loop.Returns,
          fns.Function._Tweeks.__infinity_loop.ReturnsType,
          void
        >;
        __infinity_loop(
          opts?: fns.Function._Tweeks.__infinity_loop.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__infinity_loop.Returns,
            fns.Function._Tweeks.__infinity_loop.ReturnsType
          >,
        ): void;
        funct_reg_entrada(
          opts?: fns.Function._Tweeks.funct_reg_entrada.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_entrada.Returns,
          fns.Function._Tweeks.funct_reg_entrada.ReturnsType,
          void
        >;
        funct_reg_entrada(
          opts?: fns.Function._Tweeks.funct_reg_entrada.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_entrada.Returns,
            fns.Function._Tweeks.funct_reg_entrada.ReturnsType
          >,
        ): void;
        __get_autorizacao(
          args: Function._Tweeks.__get_autorizacao.Args,
          opts?: fns.Function._Tweeks.__get_autorizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__get_autorizacao.Returns,
          fns.Function._Tweeks.__get_autorizacao.ReturnsType,
          void
        >;
        __get_autorizacao(
          args: Function._Tweeks.__get_autorizacao.Args,
          opts?: fns.Function._Tweeks.__get_autorizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__get_autorizacao.Returns,
            fns.Function._Tweeks.__get_autorizacao.ReturnsType
          >,
        ): void;
        __generate_caixa_code(
          opts?: fns.Function._Tweeks.__generate_caixa_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_caixa_code.Returns,
          fns.Function._Tweeks.__generate_caixa_code.ReturnsType,
          void
        >;
        __generate_caixa_code(
          opts?: fns.Function._Tweeks.__generate_caixa_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_caixa_code.Returns,
            fns.Function._Tweeks.__generate_caixa_code.ReturnsType
          >,
        ): void;
        funct_load_tespaco(
          opts?: fns.Function._Tweeks.funct_load_tespaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_tespaco.Returns,
          fns.Function._Tweeks.funct_load_tespaco.ReturnsType,
          void
        >;
        funct_load_tespaco(
          opts?: fns.Function._Tweeks.funct_load_tespaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_tespaco.Returns,
            fns.Function._Tweeks.funct_load_tespaco.ReturnsType
          >,
        ): void;
        funct_report_venda_artigo(
          opts?: fns.Function._Tweeks.funct_report_venda_artigo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_venda_artigo.Returns,
          fns.Function._Tweeks.funct_report_venda_artigo.ReturnsType,
          void
        >;
        funct_report_venda_artigo(
          opts?: fns.Function._Tweeks.funct_report_venda_artigo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_venda_artigo.Returns,
            fns.Function._Tweeks.funct_report_venda_artigo.ReturnsType
          >,
        ): void;
        funct_load_parametrizacao(
          opts?: fns.Function._Tweeks.funct_load_parametrizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_parametrizacao.Returns,
          fns.Function._Tweeks.funct_load_parametrizacao.ReturnsType,
          void
        >;
        funct_load_parametrizacao(
          opts?: fns.Function._Tweeks.funct_load_parametrizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_parametrizacao.Returns,
            fns.Function._Tweeks.funct_load_parametrizacao.ReturnsType
          >,
        ): void;
        _get_branch_by_colaborador(
          args: Function._Tweeks._get_branch_by_colaborador.Args,
          opts?: fns.Function._Tweeks._get_branch_by_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_branch_by_colaborador.Returns,
          fns.Function._Tweeks._get_branch_by_colaborador.ReturnsType,
          void
        >;
        _get_branch_by_colaborador(
          args: Function._Tweeks._get_branch_by_colaborador.Args,
          opts?: fns.Function._Tweeks._get_branch_by_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_branch_by_colaborador.Returns,
            fns.Function._Tweeks._get_branch_by_colaborador.ReturnsType
          >,
        ): void;
        funct_sets_autorizacao_continue(
          opts?: fns.Function._Tweeks.funct_sets_autorizacao_continue.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_autorizacao_continue.Returns,
          fns.Function._Tweeks.funct_sets_autorizacao_continue.ReturnsType,
          void
        >;
        funct_sets_autorizacao_continue(
          opts?: fns.Function._Tweeks.funct_sets_autorizacao_continue.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_autorizacao_continue.Returns,
            fns.Function._Tweeks.funct_sets_autorizacao_continue.ReturnsType
          >,
        ): void;
        __fluxo_stock(
          opts?: fns.Function._Tweeks.__fluxo_stock.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__fluxo_stock.Returns,
          fns.Function._Tweeks.__fluxo_stock.ReturnsType,
          void
        >;
        __fluxo_stock(
          opts?: fns.Function._Tweeks.__fluxo_stock.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__fluxo_stock.Returns,
            fns.Function._Tweeks.__fluxo_stock.ReturnsType
          >,
        ): void;
        sets_atividade(
          opts?: fns.Function._Tweeks.sets_atividade.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.sets_atividade.Returns,
          fns.Function._Tweeks.sets_atividade.ReturnsType,
          void
        >;
        sets_atividade(
          opts?: fns.Function._Tweeks.sets_atividade.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.sets_atividade.Returns,
            fns.Function._Tweeks.sets_atividade.ReturnsType
          >,
        ): void;
        funct_pos__calc_imposto(
          opts?: fns.Function._Tweeks.funct_pos__calc_imposto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos__calc_imposto.Returns,
          fns.Function._Tweeks.funct_pos__calc_imposto.ReturnsType,
          void
        >;
        funct_pos__calc_imposto(
          opts?: fns.Function._Tweeks.funct_pos__calc_imposto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos__calc_imposto.Returns,
            fns.Function._Tweeks.funct_pos__calc_imposto.ReturnsType
          >,
        ): void;
        funct_load_guia_data(
          opts?: fns.Function._Tweeks.funct_load_guia_data.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_guia_data.Returns,
          fns.Function._Tweeks.funct_load_guia_data.ReturnsType,
          void
        >;
        funct_load_guia_data(
          opts?: fns.Function._Tweeks.funct_load_guia_data.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_guia_data.Returns,
            fns.Function._Tweeks.funct_load_guia_data.ReturnsType
          >,
        ): void;
        funct_load_tpaga(
          opts?: fns.Function._Tweeks.funct_load_tpaga.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_tpaga.Returns,
          fns.Function._Tweeks.funct_load_tpaga.ReturnsType,
          void
        >;
        funct_load_tpaga(
          opts?: fns.Function._Tweeks.funct_load_tpaga.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_tpaga.Returns,
            fns.Function._Tweeks.funct_load_tpaga.ReturnsType
          >,
        ): void;
        _get_venda(
          opts?: fns.Function._Tweeks._get_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_venda.Returns,
          fns.Function._Tweeks._get_venda.ReturnsType,
          void
        >;
        _get_venda(
          opts?: fns.Function._Tweeks._get_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_venda.Returns,
            fns.Function._Tweeks._get_venda.ReturnsType
          >,
        ): void;
        __precario(
          args: Function._Tweeks.__precario.Args,
          opts?: fns.Function._Tweeks.__precario.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__precario.Returns,
          fns.Function._Tweeks.__precario.ReturnsType,
          void
        >;
        __precario(
          args: Function._Tweeks.__precario.Args,
          opts?: fns.Function._Tweeks.__precario.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__precario.Returns,
            fns.Function._Tweeks.__precario.ReturnsType
          >,
        ): void;
        funct_load_serie_distribuicao(
          opts?: fns.Function._Tweeks.funct_load_serie_distribuicao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_serie_distribuicao.Returns,
          fns.Function._Tweeks.funct_load_serie_distribuicao.ReturnsType,
          void
        >;
        funct_load_serie_distribuicao(
          opts?: fns.Function._Tweeks.funct_load_serie_distribuicao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_serie_distribuicao.Returns,
            fns.Function._Tweeks.funct_load_serie_distribuicao.ReturnsType
          >,
        ): void;
        funct_load_conta_documento(
          opts?: fns.Function._Tweeks.funct_load_conta_documento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_documento.Returns,
          fns.Function._Tweeks.funct_load_conta_documento.ReturnsType,
          void
        >;
        funct_load_conta_documento(
          opts?: fns.Function._Tweeks.funct_load_conta_documento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_documento.Returns,
            fns.Function._Tweeks.funct_load_conta_documento.ReturnsType
          >,
        ): void;
        __generate_cliente_code(
          opts?: fns.Function._Tweeks.__generate_cliente_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_cliente_code.Returns,
          fns.Function._Tweeks.__generate_cliente_code.ReturnsType,
          void
        >;
        __generate_cliente_code(
          opts?: fns.Function._Tweeks.__generate_cliente_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_cliente_code.Returns,
            fns.Function._Tweeks.__generate_cliente_code.ReturnsType
          >,
        ): void;
        __tg_fluxo_on_retalho(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_retalho.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_fluxo_on_retalho.Returns,
          fns.Function._Tweeks.__tg_fluxo_on_retalho.ReturnsType,
          void
        >;
        __tg_fluxo_on_retalho(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_retalho.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_fluxo_on_retalho.Returns,
            fns.Function._Tweeks.__tg_fluxo_on_retalho.ReturnsType
          >,
        ): void;
        funct_change_autorizacao_closeyear(
          opts?: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_autorizacao_closeyear.Returns,
          fns.Function._Tweeks.funct_change_autorizacao_closeyear.ReturnsType,
          void
        >;
        funct_change_autorizacao_closeyear(
          opts?: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_autorizacao_closeyear.Returns,
            fns.Function._Tweeks.funct_change_autorizacao_closeyear.ReturnsType
          >,
        ): void;
        ___override_auth_funct_autenticacao(
          opts?: fns.Function._Tweeks.___override_auth_funct_autenticacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.___override_auth_funct_autenticacao.Returns,
          fns.Function._Tweeks.___override_auth_funct_autenticacao.ReturnsType,
          void
        >;
        ___override_auth_funct_autenticacao(
          opts?: fns.Function._Tweeks.___override_auth_funct_autenticacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.___override_auth_funct_autenticacao.Returns,
            fns.Function._Tweeks.___override_auth_funct_autenticacao.ReturnsType
          >,
        ): void;
        funct_load_artigo_exports(
          opts?: fns.Function._Tweeks.funct_load_artigo_exports.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo_exports.Returns,
          fns.Function._Tweeks.funct_load_artigo_exports.ReturnsType,
          void
        >;
        funct_load_artigo_exports(
          opts?: fns.Function._Tweeks.funct_load_artigo_exports.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo_exports.Returns,
            fns.Function._Tweeks.funct_load_artigo_exports.ReturnsType
          >,
        ): void;
        __tg_venda_before_check(
          opts?: fns.Function._Tweeks.__tg_venda_before_check.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_venda_before_check.Returns,
          fns.Function._Tweeks.__tg_venda_before_check.ReturnsType,
          void
        >;
        __tg_venda_before_check(
          opts?: fns.Function._Tweeks.__tg_venda_before_check.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_venda_before_check.Returns,
            fns.Function._Tweeks.__tg_venda_before_check.ReturnsType
          >,
        ): void;
        funct_change_venda_preparado(
          opts?: fns.Function._Tweeks.funct_change_venda_preparado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_venda_preparado.Returns,
          fns.Function._Tweeks.funct_change_venda_preparado.ReturnsType,
          void
        >;
        funct_change_venda_preparado(
          opts?: fns.Function._Tweeks.funct_change_venda_preparado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_venda_preparado.Returns,
            fns.Function._Tweeks.funct_change_venda_preparado.ReturnsType
          >,
        ): void;
        funct_pos_load_conta_aberto(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_aberto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_conta_aberto.Returns,
          fns.Function._Tweeks.funct_pos_load_conta_aberto.ReturnsType,
          void
        >;
        funct_pos_load_conta_aberto(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_aberto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_conta_aberto.Returns,
            fns.Function._Tweeks.funct_pos_load_conta_aberto.ReturnsType
          >,
        ): void;
        funct_change_venda(
          opts?: fns.Function._Tweeks.funct_change_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_venda.Returns,
          fns.Function._Tweeks.funct_change_venda.ReturnsType,
          void
        >;
        funct_change_venda(
          opts?: fns.Function._Tweeks.funct_change_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_venda.Returns,
            fns.Function._Tweeks.funct_change_venda.ReturnsType
          >,
        ): void;
        viewargs_object(
          opts?: fns.Function._Tweeks.viewargs_object.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.viewargs_object.Returns,
          fns.Function._Tweeks.viewargs_object.ReturnsType,
          void
        >;
        viewargs_object(
          opts?: fns.Function._Tweeks.viewargs_object.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.viewargs_object.Returns,
            fns.Function._Tweeks.viewargs_object.ReturnsType
          >,
        ): void;
        __cluster_filter_branch(
          opts?: fns.Function._Tweeks.__cluster_filter_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__cluster_filter_branch.Returns,
          fns.Function._Tweeks.__cluster_filter_branch.ReturnsType,
          void
        >;
        __cluster_filter_branch(
          opts?: fns.Function._Tweeks.__cluster_filter_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__cluster_filter_branch.Returns,
            fns.Function._Tweeks.__cluster_filter_branch.ReturnsType
          >,
        ): void;
        viewargs_sets(
          args: Function._Tweeks.viewargs_sets.Args,
          opts?: fns.Function._Tweeks.viewargs_sets.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.viewargs_sets.Returns,
          fns.Function._Tweeks.viewargs_sets.ReturnsType,
          void
        >;
        viewargs_sets(
          args: Function._Tweeks.viewargs_sets.Args,
          opts?: fns.Function._Tweeks.viewargs_sets.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.viewargs_sets.Returns,
            fns.Function._Tweeks.viewargs_sets.ReturnsType
          >,
        ): void;
        funct_load_posto_simple(
          opts?: fns.Function._Tweeks.funct_load_posto_simple.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_posto_simple.Returns,
          fns.Function._Tweeks.funct_load_posto_simple.ReturnsType,
          void
        >;
        funct_load_posto_simple(
          opts?: fns.Function._Tweeks.funct_load_posto_simple.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_posto_simple.Returns,
            fns.Function._Tweeks.funct_load_posto_simple.ReturnsType
          >,
        ): void;
        funct_load_caixa(
          opts?: fns.Function._Tweeks.funct_load_caixa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_caixa.Returns,
          fns.Function._Tweeks.funct_load_caixa.ReturnsType,
          void
        >;
        funct_load_caixa(
          opts?: fns.Function._Tweeks.funct_load_caixa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_caixa.Returns,
            fns.Function._Tweeks.funct_load_caixa.ReturnsType
          >,
        ): void;
        funct_reg_ean(
          opts?: fns.Function._Tweeks.funct_reg_ean.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_ean.Returns,
          fns.Function._Tweeks.funct_reg_ean.ReturnsType,
          void
        >;
        funct_reg_ean(
          opts?: fns.Function._Tweeks.funct_reg_ean.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_ean.Returns,
            fns.Function._Tweeks.funct_reg_ean.ReturnsType
          >,
        ): void;
        __check_conta_data(
          opts?: fns.Function._Tweeks.__check_conta_data.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__check_conta_data.Returns,
          fns.Function._Tweeks.__check_conta_data.ReturnsType,
          void
        >;
        __check_conta_data(
          opts?: fns.Function._Tweeks.__check_conta_data.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__check_conta_data.Returns,
            fns.Function._Tweeks.__check_conta_data.ReturnsType
          >,
        ): void;
        funct_reg_posto(
          opts?: fns.Function._Tweeks.funct_reg_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_posto.Returns,
          fns.Function._Tweeks.funct_reg_posto.ReturnsType,
          void
        >;
        funct_reg_posto(
          opts?: fns.Function._Tweeks.funct_reg_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_posto.Returns,
            fns.Function._Tweeks.funct_reg_posto.ReturnsType
          >,
        ): void;
        funct_generate_chave(
          opts?: fns.Function._Tweeks.funct_generate_chave.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_generate_chave.Returns,
          fns.Function._Tweeks.funct_generate_chave.ReturnsType,
          void
        >;
        funct_generate_chave(
          opts?: fns.Function._Tweeks.funct_generate_chave.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_generate_chave.Returns,
            fns.Function._Tweeks.funct_generate_chave.ReturnsType
          >,
        ): void;
        funct_pos_reg_caixa(
          opts?: fns.Function._Tweeks.funct_pos_reg_caixa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_caixa.Returns,
          fns.Function._Tweeks.funct_pos_reg_caixa.ReturnsType,
          void
        >;
        funct_pos_reg_caixa(
          opts?: fns.Function._Tweeks.funct_pos_reg_caixa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_caixa.Returns,
            fns.Function._Tweeks.funct_pos_reg_caixa.ReturnsType
          >,
        ): void;
        main(
          opts?: fns.Function._Tweeks.main.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.main.Returns,
          fns.Function._Tweeks.main.ReturnsType,
          void
        >;
        main(
          opts?: fns.Function._Tweeks.main.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.main.Returns,
            fns.Function._Tweeks.main.ReturnsType
          >,
        ): void;
        funct_pos_load_caixa_auth(
          opts?: fns.Function._Tweeks.funct_pos_load_caixa_auth.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_caixa_auth.Returns,
          fns.Function._Tweeks.funct_pos_load_caixa_auth.ReturnsType,
          void
        >;
        funct_pos_load_caixa_auth(
          opts?: fns.Function._Tweeks.funct_pos_load_caixa_auth.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_caixa_auth.Returns,
            fns.Function._Tweeks.funct_pos_load_caixa_auth.ReturnsType
          >,
        ): void;
        __branch_uid(
          opts?: fns.Function._Tweeks.__branch_uid.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__branch_uid.Returns,
          fns.Function._Tweeks.__branch_uid.ReturnsType,
          void
        >;
        __branch_uid(
          opts?: fns.Function._Tweeks.__branch_uid.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__branch_uid.Returns,
            fns.Function._Tweeks.__branch_uid.ReturnsType
          >,
        ): void;
        funct_report_estatistica_posto(
          opts?: fns.Function._Tweeks.funct_report_estatistica_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_estatistica_posto.Returns,
          fns.Function._Tweeks.funct_report_estatistica_posto.ReturnsType,
          void
        >;
        funct_report_estatistica_posto(
          opts?: fns.Function._Tweeks.funct_report_estatistica_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_estatistica_posto.Returns,
            fns.Function._Tweeks.funct_report_estatistica_posto.ReturnsType
          >,
        ): void;
        funct_reg_taxa(
          opts?: fns.Function._Tweeks.funct_reg_taxa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_taxa.Returns,
          fns.Function._Tweeks.funct_reg_taxa.ReturnsType,
          void
        >;
        funct_reg_taxa(
          opts?: fns.Function._Tweeks.funct_reg_taxa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_taxa.Returns,
            fns.Function._Tweeks.funct_reg_taxa.ReturnsType
          >,
        ): void;
        __get_branch(
          args: Function._Tweeks.__get_branch.Args,
          opts?: fns.Function._Tweeks.__get_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__get_branch.Returns,
          fns.Function._Tweeks.__get_branch.ReturnsType,
          void
        >;
        __get_branch(
          args: Function._Tweeks.__get_branch.Args,
          opts?: fns.Function._Tweeks.__get_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__get_branch.Returns,
            fns.Function._Tweeks.__get_branch.ReturnsType
          >,
        ): void;
        funct_pos_load_conta_dia(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_dia.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_conta_dia.Returns,
          fns.Function._Tweeks.funct_pos_load_conta_dia.ReturnsType,
          void
        >;
        funct_pos_load_conta_dia(
          opts?: fns.Function._Tweeks.funct_pos_load_conta_dia.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_conta_dia.Returns,
            fns.Function._Tweeks.funct_pos_load_conta_dia.ReturnsType
          >,
        ): void;
        funct_load_colaborador(
          opts?: fns.Function._Tweeks.funct_load_colaborador.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_colaborador.Returns,
          fns.Function._Tweeks.funct_load_colaborador.ReturnsType,
          void
        >;
        funct_load_colaborador(
          opts?: fns.Function._Tweeks.funct_load_colaborador.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_colaborador.Returns,
            fns.Function._Tweeks.funct_load_colaborador.ReturnsType
          >,
        ): void;
        __conta_adjust(
          opts?: fns.Function._Tweeks.__conta_adjust.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__conta_adjust.Returns,
          fns.Function._Tweeks.__conta_adjust.ReturnsType,
          void
        >;
        __conta_adjust(
          opts?: fns.Function._Tweeks.__conta_adjust.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__conta_adjust.Returns,
            fns.Function._Tweeks.__conta_adjust.ReturnsType
          >,
        ): void;
        funct_reg_espaco(
          opts?: fns.Function._Tweeks.funct_reg_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_espaco.Returns,
          fns.Function._Tweeks.funct_reg_espaco.ReturnsType,
          void
        >;
        funct_reg_espaco(
          opts?: fns.Function._Tweeks.funct_reg_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_espaco.Returns,
            fns.Function._Tweeks.funct_reg_espaco.ReturnsType
          >,
        ): void;
        funct_load_mesa(
          opts?: fns.Function._Tweeks.funct_load_mesa.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_mesa.Returns,
          fns.Function._Tweeks.funct_load_mesa.ReturnsType,
          void
        >;
        funct_load_mesa(
          opts?: fns.Function._Tweeks.funct_load_mesa.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_mesa.Returns,
            fns.Function._Tweeks.funct_load_mesa.ReturnsType
          >,
        ): void;
        __generate_guia_code(
          opts?: fns.Function._Tweeks.__generate_guia_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_guia_code.Returns,
          fns.Function._Tweeks.__generate_guia_code.ReturnsType,
          void
        >;
        __generate_guia_code(
          opts?: fns.Function._Tweeks.__generate_guia_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_guia_code.Returns,
            fns.Function._Tweeks.__generate_guia_code.ReturnsType
          >,
        ): void;
        ___override_auth_funct_load_menu(
          opts?: fns.Function._Tweeks.___override_auth_funct_load_menu.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.___override_auth_funct_load_menu.Returns,
          fns.Function._Tweeks.___override_auth_funct_load_menu.ReturnsType,
          void
        >;
        ___override_auth_funct_load_menu(
          opts?: fns.Function._Tweeks.___override_auth_funct_load_menu.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.___override_auth_funct_load_menu.Returns,
            fns.Function._Tweeks.___override_auth_funct_load_menu.ReturnsType
          >,
        ): void;
        __generate_retalho_code(
          opts?: fns.Function._Tweeks.__generate_retalho_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_retalho_code.Returns,
          fns.Function._Tweeks.__generate_retalho_code.ReturnsType,
          void
        >;
        __generate_retalho_code(
          opts?: fns.Function._Tweeks.__generate_retalho_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_retalho_code.Returns,
            fns.Function._Tweeks.__generate_retalho_code.ReturnsType
          >,
        ): void;
        __sets_generate_documento(
          opts?: fns.Function._Tweeks.__sets_generate_documento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__sets_generate_documento.Returns,
          fns.Function._Tweeks.__sets_generate_documento.ReturnsType,
          void
        >;
        __sets_generate_documento(
          opts?: fns.Function._Tweeks.__sets_generate_documento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__sets_generate_documento.Returns,
            fns.Function._Tweeks.__sets_generate_documento.ReturnsType
          >,
        ): void;
        _get_branch_by_espaco(
          args: Function._Tweeks._get_branch_by_espaco.Args,
          opts?: fns.Function._Tweeks._get_branch_by_espaco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_branch_by_espaco.Returns,
          fns.Function._Tweeks._get_branch_by_espaco.ReturnsType,
          void
        >;
        _get_branch_by_espaco(
          args: Function._Tweeks._get_branch_by_espaco.Args,
          opts?: fns.Function._Tweeks._get_branch_by_espaco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_branch_by_espaco.Returns,
            fns.Function._Tweeks._get_branch_by_espaco.ReturnsType
          >,
        ): void;
        funct_report_venda_conta(
          opts?: fns.Function._Tweeks.funct_report_venda_conta.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_venda_conta.Returns,
          fns.Function._Tweeks.funct_report_venda_conta.ReturnsType,
          void
        >;
        funct_report_venda_conta(
          opts?: fns.Function._Tweeks.funct_report_venda_conta.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_venda_conta.Returns,
            fns.Function._Tweeks.funct_report_venda_conta.ReturnsType
          >,
        ): void;
        viewargs_show(
          opts?: fns.Function._Tweeks.viewargs_show.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.viewargs_show.Returns,
          fns.Function._Tweeks.viewargs_show.ReturnsType,
          void
        >;
        viewargs_show(
          opts?: fns.Function._Tweeks.viewargs_show.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.viewargs_show.Returns,
            fns.Function._Tweeks.viewargs_show.ReturnsType
          >,
        ): void;
        funct_pos_reg_retalho(
          opts?: fns.Function._Tweeks.funct_pos_reg_retalho.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_reg_retalho.Returns,
          fns.Function._Tweeks.funct_pos_reg_retalho.ReturnsType,
          void
        >;
        funct_pos_reg_retalho(
          opts?: fns.Function._Tweeks.funct_pos_reg_retalho.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_reg_retalho.Returns,
            fns.Function._Tweeks.funct_pos_reg_retalho.ReturnsType
          >,
        ): void;
        funct_reg_imposto(
          opts?: fns.Function._Tweeks.funct_reg_imposto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_imposto.Returns,
          fns.Function._Tweeks.funct_reg_imposto.ReturnsType,
          void
        >;
        funct_reg_imposto(
          opts?: fns.Function._Tweeks.funct_reg_imposto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_imposto.Returns,
            fns.Function._Tweeks.funct_reg_imposto.ReturnsType
          >,
        ): void;
        __tg_fluxo_on_entrada(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_entrada.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_fluxo_on_entrada.Returns,
          fns.Function._Tweeks.__tg_fluxo_on_entrada.ReturnsType,
          void
        >;
        __tg_fluxo_on_entrada(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_entrada.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_fluxo_on_entrada.Returns,
            fns.Function._Tweeks.__tg_fluxo_on_entrada.ReturnsType
          >,
        ): void;
        __tg_fluxo_on_acerto(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_acerto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_fluxo_on_acerto.Returns,
          fns.Function._Tweeks.__tg_fluxo_on_acerto.ReturnsType,
          void
        >;
        __tg_fluxo_on_acerto(
          opts?: fns.Function._Tweeks.__tg_fluxo_on_acerto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_fluxo_on_acerto.Returns,
            fns.Function._Tweeks.__tg_fluxo_on_acerto.ReturnsType
          >,
        ): void;
        funct_reg_transacao_movimentacao_posto(
          opts?: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Returns,
          fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.ReturnsType,
          void
        >;
        funct_reg_transacao_movimentacao_posto(
          opts?: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Returns,
            fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.ReturnsType
          >,
        ): void;
        funct_sets_autorizacao(
          opts?: fns.Function._Tweeks.funct_sets_autorizacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_sets_autorizacao.Returns,
          fns.Function._Tweeks.funct_sets_autorizacao.ReturnsType,
          void
        >;
        funct_sets_autorizacao(
          opts?: fns.Function._Tweeks.funct_sets_autorizacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_sets_autorizacao.Returns,
            fns.Function._Tweeks.funct_sets_autorizacao.ReturnsType
          >,
        ): void;
        funct_reg_cambio(
          opts?: fns.Function._Tweeks.funct_reg_cambio.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_cambio.Returns,
          fns.Function._Tweeks.funct_reg_cambio.ReturnsType,
          void
        >;
        funct_reg_cambio(
          opts?: fns.Function._Tweeks.funct_reg_cambio.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_cambio.Returns,
            fns.Function._Tweeks.funct_reg_cambio.ReturnsType
          >,
        ): void;
        _get_posto(
          opts?: fns.Function._Tweeks._get_posto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks._get_posto.Returns,
          fns.Function._Tweeks._get_posto.ReturnsType,
          void
        >;
        _get_posto(
          opts?: fns.Function._Tweeks._get_posto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks._get_posto.Returns,
            fns.Function._Tweeks._get_posto.ReturnsType
          >,
        ): void;
        funct_load_acerto(
          opts?: fns.Function._Tweeks.funct_load_acerto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_acerto.Returns,
          fns.Function._Tweeks.funct_load_acerto.ReturnsType,
          void
        >;
        funct_load_acerto(
          opts?: fns.Function._Tweeks.funct_load_acerto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_acerto.Returns,
            fns.Function._Tweeks.funct_load_acerto.ReturnsType
          >,
        ): void;
        __tg_venda_before_sets(
          opts?: fns.Function._Tweeks.__tg_venda_before_sets.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_venda_before_sets.Returns,
          fns.Function._Tweeks.__tg_venda_before_sets.ReturnsType,
          void
        >;
        __tg_venda_before_sets(
          opts?: fns.Function._Tweeks.__tg_venda_before_sets.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_venda_before_sets.Returns,
            fns.Function._Tweeks.__tg_venda_before_sets.ReturnsType
          >,
        ): void;
        __tg_create_lancamento(
          opts?: fns.Function._Tweeks.__tg_create_lancamento.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__tg_create_lancamento.Returns,
          fns.Function._Tweeks.__tg_create_lancamento.ReturnsType,
          void
        >;
        __tg_create_lancamento(
          opts?: fns.Function._Tweeks.__tg_create_lancamento.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__tg_create_lancamento.Returns,
            fns.Function._Tweeks.__tg_create_lancamento.ReturnsType
          >,
        ): void;
        funct_load_report_parametrized_filter(
          opts?: fns.Function._Tweeks.funct_load_report_parametrized_filter.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_report_parametrized_filter.Returns,
          fns.Function._Tweeks.funct_load_report_parametrized_filter.ReturnsType,
          void
        >;
        funct_load_report_parametrized_filter(
          opts?: fns.Function._Tweeks.funct_load_report_parametrized_filter.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_report_parametrized_filter.Returns,
            fns.Function._Tweeks.funct_load_report_parametrized_filter.ReturnsType
          >,
        ): void;
        funct_load_cliente(
          opts?: fns.Function._Tweeks.funct_load_cliente.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_cliente.Returns,
          fns.Function._Tweeks.funct_load_cliente.ReturnsType,
          void
        >;
        funct_load_cliente(
          opts?: fns.Function._Tweeks.funct_load_cliente.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_cliente.Returns,
            fns.Function._Tweeks.funct_load_cliente.ReturnsType
          >,
        ): void;
        funct_load_cambio_ativo(
          opts?: fns.Function._Tweeks.funct_load_cambio_ativo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_cambio_ativo.Returns,
          fns.Function._Tweeks.funct_load_cambio_ativo.ReturnsType,
          void
        >;
        funct_load_cambio_ativo(
          opts?: fns.Function._Tweeks.funct_load_cambio_ativo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_cambio_ativo.Returns,
            fns.Function._Tweeks.funct_load_cambio_ativo.ReturnsType
          >,
        ): void;
        __lote(
          opts?: fns.Function._Tweeks.__lote.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__lote.Returns,
          fns.Function._Tweeks.__lote.ReturnsType,
          void
        >;
        __lote(
          opts?: fns.Function._Tweeks.__lote.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__lote.Returns,
            fns.Function._Tweeks.__lote.ReturnsType
          >,
        ): void;
        funct_pos_change_conta_proforma(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_proforma.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_change_conta_proforma.Returns,
          fns.Function._Tweeks.funct_pos_change_conta_proforma.ReturnsType,
          void
        >;
        funct_pos_change_conta_proforma(
          opts?: fns.Function._Tweeks.funct_pos_change_conta_proforma.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_change_conta_proforma.Returns,
            fns.Function._Tweeks.funct_pos_change_conta_proforma.ReturnsType
          >,
        ): void;
        funct_change_espaco_migrate(
          opts?: fns.Function._Tweeks.funct_change_espaco_migrate.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_espaco_migrate.Returns,
          fns.Function._Tweeks.funct_change_espaco_migrate.ReturnsType,
          void
        >;
        funct_change_espaco_migrate(
          opts?: fns.Function._Tweeks.funct_change_espaco_migrate.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_espaco_migrate.Returns,
            fns.Function._Tweeks.funct_change_espaco_migrate.ReturnsType
          >,
        ): void;
        funct_load_conta_notacredito(
          opts?: fns.Function._Tweeks.funct_load_conta_notacredito.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_notacredito.Returns,
          fns.Function._Tweeks.funct_load_conta_notacredito.ReturnsType,
          void
        >;
        funct_load_conta_notacredito(
          opts?: fns.Function._Tweeks.funct_load_conta_notacredito.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_notacredito.Returns,
            fns.Function._Tweeks.funct_load_conta_notacredito.ReturnsType
          >,
        ): void;
        funct_load_stoks(
          opts?: fns.Function._Tweeks.funct_load_stoks.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_stoks.Returns,
          fns.Function._Tweeks.funct_load_stoks.ReturnsType,
          void
        >;
        funct_load_stoks(
          opts?: fns.Function._Tweeks.funct_load_stoks.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_stoks.Returns,
            fns.Function._Tweeks.funct_load_stoks.ReturnsType
          >,
        ): void;
        funct_load_branch(
          opts?: fns.Function._Tweeks.funct_load_branch.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_branch.Returns,
          fns.Function._Tweeks.funct_load_branch.ReturnsType,
          void
        >;
        funct_load_branch(
          opts?: fns.Function._Tweeks.funct_load_branch.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_branch.Returns,
            fns.Function._Tweeks.funct_load_branch.ReturnsType
          >,
        ): void;
        funct_load_serie_distribuicao_pos(
          opts?: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Returns,
          fns.Function._Tweeks.funct_load_serie_distribuicao_pos.ReturnsType,
          void
        >;
        funct_load_serie_distribuicao_pos(
          opts?: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Returns,
            fns.Function._Tweeks.funct_load_serie_distribuicao_pos.ReturnsType
          >,
        ): void;
        funct_pos_change_caixa_close(
          opts?: fns.Function._Tweeks.funct_pos_change_caixa_close.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_change_caixa_close.Returns,
          fns.Function._Tweeks.funct_pos_change_caixa_close.ReturnsType,
          void
        >;
        funct_pos_change_caixa_close(
          opts?: fns.Function._Tweeks.funct_pos_change_caixa_close.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_change_caixa_close.Returns,
            fns.Function._Tweeks.funct_pos_change_caixa_close.ReturnsType
          >,
        ): void;
        sets_tipoimposto(
          opts?: fns.Function._Tweeks.sets_tipoimposto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.sets_tipoimposto.Returns,
          fns.Function._Tweeks.sets_tipoimposto.ReturnsType,
          void
        >;
        sets_tipoimposto(
          opts?: fns.Function._Tweeks.sets_tipoimposto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.sets_tipoimposto.Returns,
            fns.Function._Tweeks.sets_tipoimposto.ReturnsType
          >,
        ): void;
        __sync_branch_map(
          opts?: fns.Function._Tweeks.__sync_branch_map.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__sync_branch_map.Returns,
          fns.Function._Tweeks.__sync_branch_map.ReturnsType,
          void
        >;
        __sync_branch_map(
          opts?: fns.Function._Tweeks.__sync_branch_map.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__sync_branch_map.Returns,
            fns.Function._Tweeks.__sync_branch_map.ReturnsType
          >,
        ): void;
        __generate_artigo_code(
          opts?: fns.Function._Tweeks.__generate_artigo_code.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__generate_artigo_code.Returns,
          fns.Function._Tweeks.__generate_artigo_code.ReturnsType,
          void
        >;
        __generate_artigo_code(
          opts?: fns.Function._Tweeks.__generate_artigo_code.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__generate_artigo_code.Returns,
            fns.Function._Tweeks.__generate_artigo_code.ReturnsType
          >,
        ): void;
        funct_report_estatistica_venda(
          opts?: fns.Function._Tweeks.funct_report_estatistica_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_estatistica_venda.Returns,
          fns.Function._Tweeks.funct_report_estatistica_venda.ReturnsType,
          void
        >;
        funct_report_estatistica_venda(
          opts?: fns.Function._Tweeks.funct_report_estatistica_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_estatistica_venda.Returns,
            fns.Function._Tweeks.funct_report_estatistica_venda.ReturnsType
          >,
        ): void;
        funct_reg_link_tecla(
          opts?: fns.Function._Tweeks.funct_reg_link_tecla.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_link_tecla.Returns,
          fns.Function._Tweeks.funct_reg_link_tecla.ReturnsType,
          void
        >;
        funct_reg_link_tecla(
          opts?: fns.Function._Tweeks.funct_reg_link_tecla.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_link_tecla.Returns,
            fns.Function._Tweeks.funct_reg_link_tecla.ReturnsType
          >,
        ): void;
        funct_reg_acerto(
          opts?: fns.Function._Tweeks.funct_reg_acerto.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_reg_acerto.Returns,
          fns.Function._Tweeks.funct_reg_acerto.ReturnsType,
          void
        >;
        funct_reg_acerto(
          opts?: fns.Function._Tweeks.funct_reg_acerto.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_reg_acerto.Returns,
            fns.Function._Tweeks.funct_reg_acerto.ReturnsType
          >,
        ): void;
        funct_load_posto_by_endereco(
          opts?: fns.Function._Tweeks.funct_load_posto_by_endereco.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_posto_by_endereco.Returns,
          fns.Function._Tweeks.funct_load_posto_by_endereco.ReturnsType,
          void
        >;
        funct_load_posto_by_endereco(
          opts?: fns.Function._Tweeks.funct_load_posto_by_endereco.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_posto_by_endereco.Returns,
            fns.Function._Tweeks.funct_load_posto_by_endereco.ReturnsType
          >,
        ): void;
        funct_load_conta_preparacao(
          opts?: fns.Function._Tweeks.funct_load_conta_preparacao.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_preparacao.Returns,
          fns.Function._Tweeks.funct_load_conta_preparacao.ReturnsType,
          void
        >;
        funct_load_conta_preparacao(
          opts?: fns.Function._Tweeks.funct_load_conta_preparacao.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_preparacao.Returns,
            fns.Function._Tweeks.funct_load_conta_preparacao.ReturnsType
          >,
        ): void;
        funct_pos_load_artigo(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_artigo.Returns,
          fns.Function._Tweeks.funct_pos_load_artigo.ReturnsType,
          void
        >;
        funct_pos_load_artigo(
          opts?: fns.Function._Tweeks.funct_pos_load_artigo.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_artigo.Returns,
            fns.Function._Tweeks.funct_pos_load_artigo.ReturnsType
          >,
        ): void;
        funct_pos_load_class(
          opts?: fns.Function._Tweeks.funct_pos_load_class.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_pos_load_class.Returns,
          fns.Function._Tweeks.funct_pos_load_class.ReturnsType,
          void
        >;
        funct_pos_load_class(
          opts?: fns.Function._Tweeks.funct_pos_load_class.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_pos_load_class.Returns,
            fns.Function._Tweeks.funct_pos_load_class.ReturnsType
          >,
        ): void;
        funct_change_tipoimposto_estado(
          opts?: fns.Function._Tweeks.funct_change_tipoimposto_estado.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_change_tipoimposto_estado.Returns,
          fns.Function._Tweeks.funct_change_tipoimposto_estado.ReturnsType,
          void
        >;
        funct_change_tipoimposto_estado(
          opts?: fns.Function._Tweeks.funct_change_tipoimposto_estado.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_change_tipoimposto_estado.Returns,
            fns.Function._Tweeks.funct_change_tipoimposto_estado.ReturnsType
          >,
        ): void;
        funct_load_artigo_associar(
          opts?: fns.Function._Tweeks.funct_load_artigo_associar.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_artigo_associar.Returns,
          fns.Function._Tweeks.funct_load_artigo_associar.ReturnsType,
          void
        >;
        funct_load_artigo_associar(
          opts?: fns.Function._Tweeks.funct_load_artigo_associar.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_artigo_associar.Returns,
            fns.Function._Tweeks.funct_load_artigo_associar.ReturnsType
          >,
        ): void;
        __fluxo_scan(
          opts?: fns.Function._Tweeks.__fluxo_scan.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.__fluxo_scan.Returns,
          fns.Function._Tweeks.__fluxo_scan.ReturnsType,
          void
        >;
        __fluxo_scan(
          opts?: fns.Function._Tweeks.__fluxo_scan.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.__fluxo_scan.Returns,
            fns.Function._Tweeks.__fluxo_scan.ReturnsType
          >,
        ): void;
        funct_load_conta_documento_limit(
          opts?: fns.Function._Tweeks.funct_load_conta_documento_limit.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_load_conta_documento_limit.Returns,
          fns.Function._Tweeks.funct_load_conta_documento_limit.ReturnsType,
          void
        >;
        funct_load_conta_documento_limit(
          opts?: fns.Function._Tweeks.funct_load_conta_documento_limit.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_load_conta_documento_limit.Returns,
            fns.Function._Tweeks.funct_load_conta_documento_limit.ReturnsType
          >,
        ): void;
        funct_report_venda(
          opts?: fns.Function._Tweeks.funct_report_venda.Options,
        ): db.ResponseOfResource<
          "PRIVATE",
          fns.Function._Tweeks.funct_report_venda.Returns,
          fns.Function._Tweeks.funct_report_venda.ReturnsType,
          void
        >;
        funct_report_venda(
          opts?: fns.Function._Tweeks.funct_report_venda.Options,
          onResult?: db.OnResourceResponse<
            "PRIVATE",
            fns.Function._Tweeks.funct_report_venda.Returns,
            fns.Function._Tweeks.funct_report_venda.ReturnsType
          >,
        ): void;
      }

      export interface FunctionProps {
        funct_pos_load_posto: fns.Function._Tweeks.funct_pos_load_posto.Properties;
        funct_pos_load_artigo_extras: fns.Function._Tweeks.funct_pos_load_artigo_extras.Properties;
        funct_pos__sync_conta_amount: fns.Function._Tweeks.funct_pos__sync_conta_amount.Properties;
        funct_change_colaborador: fns.Function._Tweeks.funct_change_colaborador.Properties;
        _get_caixa: fns.Function._Tweeks._get_caixa.Properties;
        funct_load_caixa_by_colaborador: fns.Function._Tweeks.funct_load_caixa_by_colaborador.Properties;
        funct_load_cluster_by_branch: fns.Function._Tweeks.funct_load_cluster_by_branch.Properties;
        funct_load_serie: fns.Function._Tweeks.funct_load_serie.Properties;
        funct_pos_load_conta_data: fns.Function._Tweeks.funct_pos_load_conta_data.Properties;
        funct_reg_link_associacao: fns.Function._Tweeks.funct_reg_link_associacao.Properties;
        __load_cambio_day: fns.Function._Tweeks.__load_cambio_day.Properties;
        funct_sets_guia: fns.Function._Tweeks.funct_sets_guia.Properties;
        funct_change_ordem_classe: fns.Function._Tweeks.funct_change_ordem_classe.Properties;
        _get_artigo: fns.Function._Tweeks._get_artigo.Properties;
        funct_reg_classe: fns.Function._Tweeks.funct_reg_classe.Properties;
        funct_report_transacao: fns.Function._Tweeks.funct_report_transacao.Properties;
        viewargs_set: fns.Function._Tweeks.viewargs_set.Properties;
        funct_change_mesa: fns.Function._Tweeks.funct_change_mesa.Properties;
        funct_change_link_disable: fns.Function._Tweeks.funct_change_link_disable.Properties;
        funct_load_entrada: fns.Function._Tweeks.funct_load_entrada.Properties;
        funct_change_conta: fns.Function._Tweeks.funct_change_conta.Properties;
        funct_sets_branch: fns.Function._Tweeks.funct_sets_branch.Properties;
        __generate_acerto_code: fns.Function._Tweeks.__generate_acerto_code.Properties;
        funct_reg_artigo: fns.Function._Tweeks.funct_reg_artigo.Properties;
        sets_parametrizacao: fns.Function._Tweeks.sets_parametrizacao.Properties;
        __sets_defaults_units: fns.Function._Tweeks.__sets_defaults_units.Properties;
        funct_change_artigo_estado: fns.Function._Tweeks.funct_change_artigo_estado.Properties;
        __tg_fluxo_on_venda: fns.Function._Tweeks.__tg_fluxo_on_venda.Properties;
        __generate_posto_chave: fns.Function._Tweeks.__generate_posto_chave.Properties;
        funct_pos_reg_conta: fns.Function._Tweeks.funct_pos_reg_conta.Properties;
        funct_change_link_unlink: fns.Function._Tweeks.funct_change_link_unlink.Properties;
        funct_load_tipoimposto: fns.Function._Tweeks.funct_load_tipoimposto.Properties;
        funct_change_link_switch: fns.Function._Tweeks.funct_change_link_switch.Properties;
        funct_reg_precario: fns.Function._Tweeks.funct_reg_precario.Properties;
        funct_load_classe_simple_report: fns.Function._Tweeks.funct_load_classe_simple_report.Properties;
        sets_lancamento: fns.Function._Tweeks.sets_lancamento.Properties;
        funct_load_transferencia: fns.Function._Tweeks.funct_load_transferencia.Properties;
        funct_load_espaco_simple: fns.Function._Tweeks.funct_load_espaco_simple.Properties;
        funct_reg_item: fns.Function._Tweeks.funct_reg_item.Properties;
        funct_change_item_estado: fns.Function._Tweeks.funct_change_item_estado.Properties;
        ___override_auth_funct_load_grants: fns.Function._Tweeks.___override_auth_funct_load_grants.Properties;
        funct_load_conta_docs_financa: fns.Function._Tweeks.funct_load_conta_docs_financa.Properties;
        funct_change_posto_open: fns.Function._Tweeks.funct_change_posto_open.Properties;
        funct_load_items_simple: fns.Function._Tweeks.funct_load_items_simple.Properties;
        funct_load_espaco_migrate: fns.Function._Tweeks.funct_load_espaco_migrate.Properties;
        funct_pos_load_colaborador: fns.Function._Tweeks.funct_pos_load_colaborador.Properties;
        funct_load_artigo_simple: fns.Function._Tweeks.funct_load_artigo_simple.Properties;
        _get_espaco: fns.Function._Tweeks._get_espaco.Properties;
        __tg_conta_after_close: fns.Function._Tweeks.__tg_conta_after_close.Properties;
        funct_change_posto_estado: fns.Function._Tweeks.funct_change_posto_estado.Properties;
        funct_pos_load_cliente: fns.Function._Tweeks.funct_pos_load_cliente.Properties;
        funct_pos_reg_deposito: fns.Function._Tweeks.funct_pos_reg_deposito.Properties;
        funct_load_artigo: fns.Function._Tweeks.funct_load_artigo.Properties;
        funct_load_report_parametrized: fns.Function._Tweeks.funct_load_report_parametrized.Properties;
        funct_load_espaco_configuracao: fns.Function._Tweeks.funct_load_espaco_configuracao.Properties;
        funct_pos_reg_vendaimposto: fns.Function._Tweeks.funct_pos_reg_vendaimposto.Properties;
        __lancamento_regularizacao: fns.Function._Tweeks.__lancamento_regularizacao.Properties;
        __artigo_has_stock: fns.Function._Tweeks.__artigo_has_stock.Properties;
        funct_load_posto: fns.Function._Tweeks.funct_load_posto.Properties;
        funct_load_espaco: fns.Function._Tweeks.funct_load_espaco.Properties;
        __generate_fornecedor_code: fns.Function._Tweeks.__generate_fornecedor_code.Properties;
        funct_load_conta_by_caixa: fns.Function._Tweeks.funct_load_conta_by_caixa.Properties;
        funct_pos_report_venda: fns.Function._Tweeks.funct_pos_report_venda.Properties;
        __tg_fluxo_on_transferencia: fns.Function._Tweeks.__tg_fluxo_on_transferencia.Properties;
        funct_pos_load_artigo_composto: fns.Function._Tweeks.funct_pos_load_artigo_composto.Properties;
        __branch_menu: fns.Function._Tweeks.__branch_menu.Properties;
        funct_load_lancamento: fns.Function._Tweeks.funct_load_lancamento.Properties;
        __tg_before_update_classe: fns.Function._Tweeks.__tg_before_update_classe.Properties;
        funct_change_chave_restore: fns.Function._Tweeks.funct_change_chave_restore.Properties;
        funct_load_artig_check_nome: fns.Function._Tweeks.funct_load_artig_check_nome.Properties;
        funct_pos_change_conta_anular: fns.Function._Tweeks.funct_pos_change_conta_anular.Properties;
        funct_load_device_unregistered: fns.Function._Tweeks.funct_load_device_unregistered.Properties;
        _get_tmovimento: fns.Function._Tweeks._get_tmovimento.Properties;
        funct_load_posto_status: fns.Function._Tweeks.funct_load_posto_status.Properties;
        funct_pos_reg_venda: fns.Function._Tweeks.funct_pos_reg_venda.Properties;
        _get_stock: fns.Function._Tweeks._get_stock.Properties;
        funct_sets_fornecedor: fns.Function._Tweeks.funct_sets_fornecedor.Properties;
        _get_conta: fns.Function._Tweeks._get_conta.Properties;
        funct_change_conta_preparar: fns.Function._Tweeks.funct_change_conta_preparar.Properties;
        funct_load_autorizacao: fns.Function._Tweeks.funct_load_autorizacao.Properties;
        funct_sets_serie: fns.Function._Tweeks.funct_sets_serie.Properties;
        funct_pos_change_conta_fechar: fns.Function._Tweeks.funct_pos_change_conta_fechar.Properties;
        funct_load_deposito_data: fns.Function._Tweeks.funct_load_deposito_data.Properties;
        funct_report_caixa: fns.Function._Tweeks.funct_report_caixa.Properties;
        funct_load_posto_closed: fns.Function._Tweeks.funct_load_posto_closed.Properties;
        __generate_classe_code: fns.Function._Tweeks.__generate_classe_code.Properties;
        funct_reg_dispoe: fns.Function._Tweeks.funct_reg_dispoe.Properties;
        funct_reg_colaborador: fns.Function._Tweeks.funct_reg_colaborador.Properties;
        funct_change_link_move: fns.Function._Tweeks.funct_change_link_move.Properties;
        funct_reg_stock: fns.Function._Tweeks.funct_reg_stock.Properties;
        _get_classe: fns.Function._Tweeks._get_classe.Properties;
        funct_change_espaco_configuracao: fns.Function._Tweeks.funct_change_espaco_configuracao.Properties;
        funct_change_espaco: fns.Function._Tweeks.funct_change_espaco.Properties;
        __tg_use_branch: fns.Function._Tweeks.__tg_use_branch.Properties;
        funct_pos_load_conta_proforma: fns.Function._Tweeks.funct_pos_load_conta_proforma.Properties;
        funct_pos_generate_key: fns.Function._Tweeks.funct_pos_generate_key.Properties;
        funct_load_classe: fns.Function._Tweeks.funct_load_classe.Properties;
        __get_serie_espaco: fns.Function._Tweeks.__get_serie_espaco.Properties;
        funct_reg_transferencia: fns.Function._Tweeks.funct_reg_transferencia.Properties;
        funct_change_fornecedor_estado: fns.Function._Tweeks.funct_change_fornecedor_estado.Properties;
        funct_load_cambio_history: fns.Function._Tweeks.funct_load_cambio_history.Properties;
        __space_branch_level: fns.Function._Tweeks.__space_branch_level.Properties;
        funct_reg_trabalha: fns.Function._Tweeks.funct_reg_trabalha.Properties;
        viewarg: fns.Function._Tweeks.viewarg.Properties;
        funct_load_artigo_base: fns.Function._Tweeks.funct_load_artigo_base.Properties;
        funct_load_trabalha: fns.Function._Tweeks.funct_load_trabalha.Properties;
        funct_reg_mesa: fns.Function._Tweeks.funct_reg_mesa.Properties;
        _get_link: fns.Function._Tweeks._get_link.Properties;
        funct_load_serie_available: fns.Function._Tweeks.funct_load_serie_available.Properties;
        funct_load_artigo_data: fns.Function._Tweeks.funct_load_artigo_data.Properties;
        funct_change_classe_estado: fns.Function._Tweeks.funct_change_classe_estado.Properties;
        funct_reg_conta_nota_credito: fns.Function._Tweeks.funct_reg_conta_nota_credito.Properties;
        funct_report_compra_entrada: fns.Function._Tweeks.funct_report_compra_entrada.Properties;
        funct_pos_reg_cliente: fns.Function._Tweeks.funct_pos_reg_cliente.Properties;
        load_clusters: fns.Function._Tweeks.load_clusters.Properties;
        funct_sets_unit: fns.Function._Tweeks.funct_sets_unit.Properties;
        funct_change_mesa_estado: fns.Function._Tweeks.funct_change_mesa_estado.Properties;
        __check_stock_on_venda: fns.Function._Tweeks.__check_stock_on_venda.Properties;
        funct_load_mesa_livre: fns.Function._Tweeks.funct_load_mesa_livre.Properties;
        funct_change_conta_imprimir: fns.Function._Tweeks.funct_change_conta_imprimir.Properties;
        funct_load_fornecedor_simple: fns.Function._Tweeks.funct_load_fornecedor_simple.Properties;
        funct_change_espaco_estado: fns.Function._Tweeks.funct_change_espaco_estado.Properties;
        _get_item: fns.Function._Tweeks._get_item.Properties;
        funct_pos_load_artigo_search: fns.Function._Tweeks.funct_pos_load_artigo_search.Properties;
        funct_load_unit: fns.Function._Tweeks.funct_load_unit.Properties;
        funct_reg_fornecedor: fns.Function._Tweeks.funct_reg_fornecedor.Properties;
        funct_reg_conta_docs_financa: fns.Function._Tweeks.funct_reg_conta_docs_financa.Properties;
        _get_impostos_taxa: fns.Function._Tweeks._get_impostos_taxa.Properties;
        funct_load_fornecedor: fns.Function._Tweeks.funct_load_fornecedor.Properties;
        funct_load_chave: fns.Function._Tweeks.funct_load_chave.Properties;
        funct_report_stock_movimentos: fns.Function._Tweeks.funct_report_stock_movimentos.Properties;
        __infinity_loop: fns.Function._Tweeks.__infinity_loop.Properties;
        funct_reg_entrada: fns.Function._Tweeks.funct_reg_entrada.Properties;
        __get_autorizacao: fns.Function._Tweeks.__get_autorizacao.Properties;
        __generate_caixa_code: fns.Function._Tweeks.__generate_caixa_code.Properties;
        funct_load_tespaco: fns.Function._Tweeks.funct_load_tespaco.Properties;
        funct_report_venda_artigo: fns.Function._Tweeks.funct_report_venda_artigo.Properties;
        funct_load_parametrizacao: fns.Function._Tweeks.funct_load_parametrizacao.Properties;
        _get_branch_by_colaborador: fns.Function._Tweeks._get_branch_by_colaborador.Properties;
        funct_sets_autorizacao_continue: fns.Function._Tweeks.funct_sets_autorizacao_continue.Properties;
        __fluxo_stock: fns.Function._Tweeks.__fluxo_stock.Properties;
        sets_atividade: fns.Function._Tweeks.sets_atividade.Properties;
        funct_pos__calc_imposto: fns.Function._Tweeks.funct_pos__calc_imposto.Properties;
        funct_load_guia_data: fns.Function._Tweeks.funct_load_guia_data.Properties;
        funct_load_tpaga: fns.Function._Tweeks.funct_load_tpaga.Properties;
        _get_venda: fns.Function._Tweeks._get_venda.Properties;
        __precario: fns.Function._Tweeks.__precario.Properties;
        funct_load_serie_distribuicao: fns.Function._Tweeks.funct_load_serie_distribuicao.Properties;
        funct_load_conta_documento: fns.Function._Tweeks.funct_load_conta_documento.Properties;
        __generate_cliente_code: fns.Function._Tweeks.__generate_cliente_code.Properties;
        __tg_fluxo_on_retalho: fns.Function._Tweeks.__tg_fluxo_on_retalho.Properties;
        funct_change_autorizacao_closeyear: fns.Function._Tweeks.funct_change_autorizacao_closeyear.Properties;
        ___override_auth_funct_autenticacao: fns.Function._Tweeks.___override_auth_funct_autenticacao.Properties;
        funct_load_artigo_exports: fns.Function._Tweeks.funct_load_artigo_exports.Properties;
        __tg_venda_before_check: fns.Function._Tweeks.__tg_venda_before_check.Properties;
        funct_change_venda_preparado: fns.Function._Tweeks.funct_change_venda_preparado.Properties;
        funct_pos_load_conta_aberto: fns.Function._Tweeks.funct_pos_load_conta_aberto.Properties;
        funct_change_venda: fns.Function._Tweeks.funct_change_venda.Properties;
        viewargs_object: fns.Function._Tweeks.viewargs_object.Properties;
        __cluster_filter_branch: fns.Function._Tweeks.__cluster_filter_branch.Properties;
        viewargs_sets: fns.Function._Tweeks.viewargs_sets.Properties;
        funct_load_posto_simple: fns.Function._Tweeks.funct_load_posto_simple.Properties;
        funct_load_caixa: fns.Function._Tweeks.funct_load_caixa.Properties;
        funct_reg_ean: fns.Function._Tweeks.funct_reg_ean.Properties;
        __check_conta_data: fns.Function._Tweeks.__check_conta_data.Properties;
        funct_reg_posto: fns.Function._Tweeks.funct_reg_posto.Properties;
        funct_generate_chave: fns.Function._Tweeks.funct_generate_chave.Properties;
        funct_pos_reg_caixa: fns.Function._Tweeks.funct_pos_reg_caixa.Properties;
        main: fns.Function._Tweeks.main.Properties;
        funct_pos_load_caixa_auth: fns.Function._Tweeks.funct_pos_load_caixa_auth.Properties;
        __branch_uid: fns.Function._Tweeks.__branch_uid.Properties;
        funct_report_estatistica_posto: fns.Function._Tweeks.funct_report_estatistica_posto.Properties;
        funct_reg_taxa: fns.Function._Tweeks.funct_reg_taxa.Properties;
        __get_branch: fns.Function._Tweeks.__get_branch.Properties;
        funct_pos_load_conta_dia: fns.Function._Tweeks.funct_pos_load_conta_dia.Properties;
        funct_load_colaborador: fns.Function._Tweeks.funct_load_colaborador.Properties;
        __conta_adjust: fns.Function._Tweeks.__conta_adjust.Properties;
        funct_reg_espaco: fns.Function._Tweeks.funct_reg_espaco.Properties;
        funct_load_mesa: fns.Function._Tweeks.funct_load_mesa.Properties;
        __generate_guia_code: fns.Function._Tweeks.__generate_guia_code.Properties;
        ___override_auth_funct_load_menu: fns.Function._Tweeks.___override_auth_funct_load_menu.Properties;
        __generate_retalho_code: fns.Function._Tweeks.__generate_retalho_code.Properties;
        __sets_generate_documento: fns.Function._Tweeks.__sets_generate_documento.Properties;
        _get_branch_by_espaco: fns.Function._Tweeks._get_branch_by_espaco.Properties;
        funct_report_venda_conta: fns.Function._Tweeks.funct_report_venda_conta.Properties;
        viewargs_show: fns.Function._Tweeks.viewargs_show.Properties;
        funct_pos_reg_retalho: fns.Function._Tweeks.funct_pos_reg_retalho.Properties;
        funct_reg_imposto: fns.Function._Tweeks.funct_reg_imposto.Properties;
        __tg_fluxo_on_entrada: fns.Function._Tweeks.__tg_fluxo_on_entrada.Properties;
        __tg_fluxo_on_acerto: fns.Function._Tweeks.__tg_fluxo_on_acerto.Properties;
        funct_reg_transacao_movimentacao_posto: fns.Function._Tweeks.funct_reg_transacao_movimentacao_posto.Properties;
        funct_sets_autorizacao: fns.Function._Tweeks.funct_sets_autorizacao.Properties;
        funct_reg_cambio: fns.Function._Tweeks.funct_reg_cambio.Properties;
        _get_posto: fns.Function._Tweeks._get_posto.Properties;
        funct_load_acerto: fns.Function._Tweeks.funct_load_acerto.Properties;
        __tg_venda_before_sets: fns.Function._Tweeks.__tg_venda_before_sets.Properties;
        __tg_create_lancamento: fns.Function._Tweeks.__tg_create_lancamento.Properties;
        funct_load_report_parametrized_filter: fns.Function._Tweeks.funct_load_report_parametrized_filter.Properties;
        funct_load_cliente: fns.Function._Tweeks.funct_load_cliente.Properties;
        funct_load_cambio_ativo: fns.Function._Tweeks.funct_load_cambio_ativo.Properties;
        __lote: fns.Function._Tweeks.__lote.Properties;
        funct_pos_change_conta_proforma: fns.Function._Tweeks.funct_pos_change_conta_proforma.Properties;
        funct_change_espaco_migrate: fns.Function._Tweeks.funct_change_espaco_migrate.Properties;
        funct_load_conta_notacredito: fns.Function._Tweeks.funct_load_conta_notacredito.Properties;
        funct_load_stoks: fns.Function._Tweeks.funct_load_stoks.Properties;
        funct_load_branch: fns.Function._Tweeks.funct_load_branch.Properties;
        funct_load_serie_distribuicao_pos: fns.Function._Tweeks.funct_load_serie_distribuicao_pos.Properties;
        funct_pos_change_caixa_close: fns.Function._Tweeks.funct_pos_change_caixa_close.Properties;
        sets_tipoimposto: fns.Function._Tweeks.sets_tipoimposto.Properties;
        __sync_branch_map: fns.Function._Tweeks.__sync_branch_map.Properties;
        __generate_artigo_code: fns.Function._Tweeks.__generate_artigo_code.Properties;
        funct_report_estatistica_venda: fns.Function._Tweeks.funct_report_estatistica_venda.Properties;
        funct_reg_link_tecla: fns.Function._Tweeks.funct_reg_link_tecla.Properties;
        funct_reg_acerto: fns.Function._Tweeks.funct_reg_acerto.Properties;
        funct_load_posto_by_endereco: fns.Function._Tweeks.funct_load_posto_by_endereco.Properties;
        funct_load_conta_preparacao: fns.Function._Tweeks.funct_load_conta_preparacao.Properties;
        funct_pos_load_artigo: fns.Function._Tweeks.funct_pos_load_artigo.Properties;
        funct_pos_load_class: fns.Function._Tweeks.funct_pos_load_class.Properties;
        funct_change_tipoimposto_estado: fns.Function._Tweeks.funct_change_tipoimposto_estado.Properties;
        funct_load_artigo_associar: fns.Function._Tweeks.funct_load_artigo_associar.Properties;
        __fluxo_scan: fns.Function._Tweeks.__fluxo_scan.Properties;
        funct_load_conta_documento_limit: fns.Function._Tweeks.funct_load_conta_documento_limit.Properties;
        funct_report_venda: fns.Function._Tweeks.funct_report_venda.Properties;
      }
    }
  }
}

export default dfns;
