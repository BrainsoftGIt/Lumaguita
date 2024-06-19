import { db } from "kitres";
import tns from "./tns";

namespace rns {
  export type TypeProperties =
    | "*"
    | "cluster.branch.branch_workspace"
    | "cluster.branch.branch_licence"
    | "cluster.branch.branch_user"
    | "cluster.branch.branch_grants"
    | "auth.session.sess"
    | "lib.res.error"
    | "lib.res.data"
    | "lib.result.message"
    | "cluster.resource.resource_metadata"
    | "cluster.pull.pull_result"
    | "cluster.pull.pull_pulled"
    | "cluster.pull.pull_ignores"
    | "cluster.pull.pull_server"
    | "cluster.pull.pull_objects"
    | "cluster.object.object_ref"
    | "cluster.cluster.cluster_configs"
    | "cluster.break.break_current"
    | "cluster.break.break_metadata"
    | "cluster.break.break_change"
    | "cluster.break.break_document"
    | "cluster.break.break_object"
    | "cluster.break.break_ref"
    | "cluster.break.break_old"
    | "cluster.break.break_collector"
    | "cluster.collector.collector_metaapply"
    | "cluster.collector.collector_remoteold"
    | "cluster.collector.collector_old"
    | "cluster.collector.collector_usechage"
    | "cluster.collector.collector_originold"
    | "cluster.collector.collector_metadata"
    | "cluster.collector.collector_changevalue"
    | "cluster.collector.collector_ref"
    | "auth.colaborador.colaborador_ficha"
    | "tweeks.movimento.movimento_referencia"
    | "tweeks.transacao.transacao_referencia"
    | "tweeks.cliente.cliente_contactos"
    | "tweeks.cliente.cliente_metadata"
    | "tweeks.espaco.espaco_configuracao"
    | "tweeks.atividade.atividade_props"
    | "tweeks.atividade.atividade_referer"
    | "tweeks.deposito.deposito_serie"
    | "tweeks.deposito.deposito_referencia"
    | "tweeks.conta.conta_proformaextras"
    | "tweeks.conta.conta_mesa"
    | "tweeks.conta.conta_extension"
    | "tweeks.conta.conta_serie"
    | "tweeks.conta.conta_props"
    | "tweeks.venda.venda_metadata"
    | "tweeks.artigo.artigo_codigoimposto"
    | "tweeks.lancamento.lancamento_referencia"
    | "tweeks.branch.branch_grants"
    | "tweeks.branch.branch_workspace"
    | "tweeks.branch.branch_user"
    | "tweeks.branch.branch_licence"
    | "tweeks.guia.guia_metadata"
    | "tweeks.guia.guia_refs"
    | "tweeks.link.link_config"
    | "tweeks.link.link_metadata"
    | "tweeks.link.link_referencia"
    | "tweeks.parametrizacao.parametrizacao_props"
    | "tweeks.tbranch.tbranch_configs"
    | "tweeks.repcolumn.gen"
    | "tweeks.repcolumn.agg"
    | "tweeks.repcolumn.filter"
    | "tweeks.transferencia.transferencia_metadata"
    | "tweeks.fluxo.fluxo_referencia"
    | "tweeks.entrada.entrada_metadata";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {
    "cluster.branch": Table._Cluster.branch.PropsTyped<T>;
    "cluster.branch:Props": Table._Cluster.branch.PropsTyped<T>;
    "cluster.branch:Refs": Table._Cluster.branch.RefsTyped<T>;
    "cluster.branch:NOTNULL": Table._Cluster.branch.NOTNULLTyped<T>;
    "cluster.branch:Entry": Table._Cluster.branch.EntryTyped<T>;
    "auth.session": Table._Auth.session.PropsTyped<T>;
    "auth.session:Props": Table._Auth.session.PropsTyped<T>;
    "auth.session:Refs": Table._Auth.session.RefsTyped<T>;
    "auth.session:NOTNULL": Table._Auth.session.NOTNULLTyped<T>;
    "auth.session:Entry": Table._Auth.session.EntryTyped<T>;
    "libdom.domsync": Table._Libdom.domsync.PropsTyped<T>;
    "libdom.domsync:Props": Table._Libdom.domsync.PropsTyped<T>;
    "libdom.domsync:Refs": Table._Libdom.domsync.RefsTyped<T>;
    "libdom.domsync:NOTNULL": Table._Libdom.domsync.NOTNULLTyped<T>;
    "libdom.domsync:Entry": Table._Libdom.domsync.EntryTyped<T>;
    "lib.res": CompositeType._Lib.res.PropsTyped<T>;
    "auth.acesso": Table._Auth.acesso.PropsTyped<T>;
    "auth.acesso:Props": Table._Auth.acesso.PropsTyped<T>;
    "auth.acesso:Refs": Table._Auth.acesso.RefsTyped<T>;
    "auth.acesso:NOTNULL": Table._Auth.acesso.NOTNULLTyped<T>;
    "auth.acesso:Entry": Table._Auth.acesso.EntryTyped<T>;
    "auth.tsexo": Table._Auth.tsexo.PropsTyped<T>;
    "auth.tsexo:Props": Table._Auth.tsexo.PropsTyped<T>;
    "auth.tsexo:Refs": Table._Auth.tsexo.RefsTyped<T>;
    "auth.tsexo:NOTNULL": Table._Auth.tsexo.NOTNULLTyped<T>;
    "auth.tsexo:Entry": Table._Auth.tsexo.EntryTyped<T>;
    "lib.result": CompositeType._Lib.result.PropsTyped<T>;
    "cluster.resource": Table._Cluster.resource.PropsTyped<T>;
    "cluster.resource:Props": Table._Cluster.resource.PropsTyped<T>;
    "cluster.resource:Refs": Table._Cluster.resource.RefsTyped<T>;
    "cluster.resource:NOTNULL": Table._Cluster.resource.NOTNULLTyped<T>;
    "cluster.resource:Entry": Table._Cluster.resource.EntryTyped<T>;
    "cluster.users": Table._Cluster.users.PropsTyped<T>;
    "cluster.users:Props": Table._Cluster.users.PropsTyped<T>;
    "cluster.users:Refs": Table._Cluster.users.RefsTyped<T>;
    "cluster.users:NOTNULL": Table._Cluster.users.NOTNULLTyped<T>;
    "cluster.users:Entry": Table._Cluster.users.EntryTyped<T>;
    "libdom.constant": CompositeType._Libdom.constant.PropsTyped<T>;
    "cluster.ignore": Table._Cluster.ignore.PropsTyped<T>;
    "cluster.ignore:Props": Table._Cluster.ignore.PropsTyped<T>;
    "cluster.ignore:Refs": Table._Cluster.ignore.RefsTyped<T>;
    "cluster.ignore:NOTNULL": Table._Cluster.ignore.NOTNULLTyped<T>;
    "cluster.ignore:Entry": Table._Cluster.ignore.EntryTyped<T>;
    "cluster.pull": Table._Cluster.pull.PropsTyped<T>;
    "cluster.pull:Props": Table._Cluster.pull.PropsTyped<T>;
    "cluster.pull:Refs": Table._Cluster.pull.RefsTyped<T>;
    "cluster.pull:NOTNULL": Table._Cluster.pull.NOTNULLTyped<T>;
    "cluster.pull:Entry": Table._Cluster.pull.EntryTyped<T>;
    "cluster.share": Table._Cluster.share.PropsTyped<T>;
    "cluster.share:Props": Table._Cluster.share.PropsTyped<T>;
    "cluster.share:Refs": Table._Cluster.share.RefsTyped<T>;
    "cluster.share:NOTNULL": Table._Cluster.share.NOTNULLTyped<T>;
    "cluster.share:Entry": Table._Cluster.share.EntryTyped<T>;
    "cluster.object": Table._Cluster._object.PropsTyped<T>;
    "cluster.object:Props": Table._Cluster._object.PropsTyped<T>;
    "cluster.object:Refs": Table._Cluster._object.RefsTyped<T>;
    "cluster.object:NOTNULL": Table._Cluster._object.NOTNULLTyped<T>;
    "cluster.object:Entry": Table._Cluster._object.EntryTyped<T>;
    "cluster.cluster": Table._Cluster.cluster.PropsTyped<T>;
    "cluster.cluster:Props": Table._Cluster.cluster.PropsTyped<T>;
    "cluster.cluster:Refs": Table._Cluster.cluster.RefsTyped<T>;
    "cluster.cluster:NOTNULL": Table._Cluster.cluster.NOTNULLTyped<T>;
    "cluster.cluster:Entry": Table._Cluster.cluster.EntryTyped<T>;
    "cluster.filter": Table._Cluster.filter.PropsTyped<T>;
    "cluster.filter:Props": Table._Cluster.filter.PropsTyped<T>;
    "cluster.filter:Refs": Table._Cluster.filter.RefsTyped<T>;
    "cluster.filter:NOTNULL": Table._Cluster.filter.NOTNULLTyped<T>;
    "cluster.filter:Entry": Table._Cluster.filter.EntryTyped<T>;
    "auth.privilegio": Table._Auth.privilegio.PropsTyped<T>;
    "auth.privilegio:Props": Table._Auth.privilegio.PropsTyped<T>;
    "auth.privilegio:Refs": Table._Auth.privilegio.RefsTyped<T>;
    "auth.privilegio:NOTNULL": Table._Auth.privilegio.NOTNULLTyped<T>;
    "auth.privilegio:Entry": Table._Auth.privilegio.EntryTyped<T>;
    "cluster.break": Table._Cluster._break.PropsTyped<T>;
    "cluster.break:Props": Table._Cluster._break.PropsTyped<T>;
    "cluster.break:Refs": Table._Cluster._break.RefsTyped<T>;
    "cluster.break:NOTNULL": Table._Cluster._break.NOTNULLTyped<T>;
    "cluster.break:Entry": Table._Cluster._break.EntryTyped<T>;
    "map.constant": CompositeType._Map.constant.PropsTyped<T>;
    "cluster.collector": Table._Cluster.collector.PropsTyped<T>;
    "cluster.collector:Props": Table._Cluster.collector.PropsTyped<T>;
    "cluster.collector:Refs": Table._Cluster.collector.RefsTyped<T>;
    "cluster.collector:NOTNULL": Table._Cluster.collector.NOTNULLTyped<T>;
    "cluster.collector:Entry": Table._Cluster.collector.EntryTyped<T>;
    "cluster.version": Table._Cluster.version.PropsTyped<T>;
    "cluster.version:Props": Table._Cluster.version.PropsTyped<T>;
    "cluster.version:Refs": Table._Cluster.version.RefsTyped<T>;
    "cluster.version:NOTNULL": Table._Cluster.version.NOTNULLTyped<T>;
    "cluster.version:Entry": Table._Cluster.version.EntryTyped<T>;
    "cluster.classmap": Table._Cluster.classmap.PropsTyped<T>;
    "cluster.classmap:Props": Table._Cluster.classmap.PropsTyped<T>;
    "cluster.classmap:Refs": Table._Cluster.classmap.RefsTyped<T>;
    "cluster.classmap:NOTNULL": Table._Cluster.classmap.NOTNULLTyped<T>;
    "cluster.classmap:Entry": Table._Cluster.classmap.EntryTyped<T>;
    "cluster.sequence": Table._Cluster.sequence.PropsTyped<T>;
    "cluster.sequence:Props": Table._Cluster.sequence.PropsTyped<T>;
    "cluster.sequence:Refs": Table._Cluster.sequence.RefsTyped<T>;
    "cluster.sequence:NOTNULL": Table._Cluster.sequence.NOTNULLTyped<T>;
    "cluster.sequence:Entry": Table._Cluster.sequence.EntryTyped<T>;
    "cluster.tperiod": Table._Cluster.tperiod.PropsTyped<T>;
    "cluster.tperiod:Props": Table._Cluster.tperiod.PropsTyped<T>;
    "cluster.tperiod:Refs": Table._Cluster.tperiod.RefsTyped<T>;
    "cluster.tperiod:NOTNULL": Table._Cluster.tperiod.NOTNULLTyped<T>;
    "cluster.tperiod:Entry": Table._Cluster.tperiod.EntryTyped<T>;
    "auth.menu": Table._Auth.menu.PropsTyped<T>;
    "auth.menu:Props": Table._Auth.menu.PropsTyped<T>;
    "auth.menu:Refs": Table._Auth.menu.RefsTyped<T>;
    "auth.menu:NOTNULL": Table._Auth.menu.NOTNULLTyped<T>;
    "auth.menu:Entry": Table._Auth.menu.EntryTyped<T>;
    "libdom.entryset": Table._Libdom.entryset.PropsTyped<T>;
    "libdom.entryset:Props": Table._Libdom.entryset.PropsTyped<T>;
    "libdom.entryset:Refs": Table._Libdom.entryset.RefsTyped<T>;
    "libdom.entryset:NOTNULL": Table._Libdom.entryset.NOTNULLTyped<T>;
    "libdom.entryset:Entry": Table._Libdom.entryset.EntryTyped<T>;
    "auth.colaborador": Table._Auth.colaborador.PropsTyped<T>;
    "auth.colaborador:Props": Table._Auth.colaborador.PropsTyped<T>;
    "auth.colaborador:Refs": Table._Auth.colaborador.RefsTyped<T>;
    "auth.colaborador:NOTNULL": Table._Auth.colaborador.NOTNULLTyped<T>;
    "auth.colaborador:Entry": Table._Auth.colaborador.EntryTyped<T>;
    "libdom.domain": CompositeType._Libdom.domain.PropsTyped<T>;
    "cluster.auth": Table._Cluster.auth.PropsTyped<T>;
    "cluster.auth:Props": Table._Cluster.auth.PropsTyped<T>;
    "cluster.auth:Refs": Table._Cluster.auth.RefsTyped<T>;
    "cluster.auth:NOTNULL": Table._Cluster.auth.NOTNULLTyped<T>;
    "cluster.auth:Entry": Table._Cluster.auth.EntryTyped<T>;
    "auth.perfil": Table._Auth.perfil.PropsTyped<T>;
    "auth.perfil:Props": Table._Auth.perfil.PropsTyped<T>;
    "auth.perfil:Refs": Table._Auth.perfil.RefsTyped<T>;
    "auth.perfil:NOTNULL": Table._Auth.perfil.NOTNULLTyped<T>;
    "auth.perfil:Entry": Table._Auth.perfil.EntryTyped<T>;
    "auth.autenticacao": Table._Auth.autenticacao.PropsTyped<T>;
    "auth.autenticacao:Props": Table._Auth.autenticacao.PropsTyped<T>;
    "auth.autenticacao:Refs": Table._Auth.autenticacao.RefsTyped<T>;
    "auth.autenticacao:NOTNULL": Table._Auth.autenticacao.NOTNULLTyped<T>;
    "auth.autenticacao:Entry": Table._Auth.autenticacao.EntryTyped<T>;
    "tweeks.movimento": Table._Tweeks.movimento.PropsTyped<T>;
    "tweeks.movimento:Props": Table._Tweeks.movimento.PropsTyped<T>;
    "tweeks.movimento:Refs": Table._Tweeks.movimento.RefsTyped<T>;
    "tweeks.movimento:NOTNULL": Table._Tweeks.movimento.NOTNULLTyped<T>;
    "tweeks.movimento:Entry": Table._Tweeks.movimento.EntryTyped<T>;
    "tweeks._vserie": View._Tweeks._vserie.PropsTyped<T>;
    "tweeks.transacao": Table._Tweeks.transacao.PropsTyped<T>;
    "tweeks.transacao:Props": Table._Tweeks.transacao.PropsTyped<T>;
    "tweeks.transacao:Refs": Table._Tweeks.transacao.RefsTyped<T>;
    "tweeks.transacao:NOTNULL": Table._Tweeks.transacao.NOTNULLTyped<T>;
    "tweeks.transacao:Entry": Table._Tweeks.transacao.EntryTyped<T>;
    "tweeks.caixa": Table._Tweeks.caixa.PropsTyped<T>;
    "tweeks.caixa:Props": Table._Tweeks.caixa.PropsTyped<T>;
    "tweeks.caixa:Refs": Table._Tweeks.caixa.RefsTyped<T>;
    "tweeks.caixa:NOTNULL": Table._Tweeks.caixa.NOTNULLTyped<T>;
    "tweeks.caixa:Entry": Table._Tweeks.caixa.EntryTyped<T>;
    "tweeks.stock": View._Tweeks.stock.PropsTyped<T>;
    "tweeks.trabalha": Table._Tweeks.trabalha.PropsTyped<T>;
    "tweeks.trabalha:Props": Table._Tweeks.trabalha.PropsTyped<T>;
    "tweeks.trabalha:Refs": Table._Tweeks.trabalha.RefsTyped<T>;
    "tweeks.trabalha:NOTNULL": Table._Tweeks.trabalha.NOTNULLTyped<T>;
    "tweeks.trabalha:Entry": Table._Tweeks.trabalha.EntryTyped<T>;
    "tweeks.tserie": Table._Tweeks.tserie.PropsTyped<T>;
    "tweeks.tserie:Props": Table._Tweeks.tserie.PropsTyped<T>;
    "tweeks.tserie:Refs": Table._Tweeks.tserie.RefsTyped<T>;
    "tweeks.tserie:NOTNULL": Table._Tweeks.tserie.NOTNULLTyped<T>;
    "tweeks.tserie:Entry": Table._Tweeks.tserie.EntryTyped<T>;
    "tweeks.acerto": Table._Tweeks.acerto.PropsTyped<T>;
    "tweeks.acerto:Props": Table._Tweeks.acerto.PropsTyped<T>;
    "tweeks.acerto:Refs": Table._Tweeks.acerto.RefsTyped<T>;
    "tweeks.acerto:NOTNULL": Table._Tweeks.acerto.NOTNULLTyped<T>;
    "tweeks.acerto:Entry": Table._Tweeks.acerto.EntryTyped<T>;
    "tweeks.taplicar": Table._Tweeks.taplicar.PropsTyped<T>;
    "tweeks.taplicar:Props": Table._Tweeks.taplicar.PropsTyped<T>;
    "tweeks.taplicar:Refs": Table._Tweeks.taplicar.RefsTyped<T>;
    "tweeks.taplicar:NOTNULL": Table._Tweeks.taplicar.NOTNULLTyped<T>;
    "tweeks.taplicar:Entry": Table._Tweeks.taplicar.EntryTyped<T>;
    "tweeks.toperacao": Table._Tweeks.toperacao.PropsTyped<T>;
    "tweeks.toperacao:Props": Table._Tweeks.toperacao.PropsTyped<T>;
    "tweeks.toperacao:Refs": Table._Tweeks.toperacao.RefsTyped<T>;
    "tweeks.toperacao:NOTNULL": Table._Tweeks.toperacao.NOTNULLTyped<T>;
    "tweeks.toperacao:Entry": Table._Tweeks.toperacao.EntryTyped<T>;
    "tweeks.tlancamento": Table._Tweeks.tlancamento.PropsTyped<T>;
    "tweeks.tlancamento:Props": Table._Tweeks.tlancamento.PropsTyped<T>;
    "tweeks.tlancamento:Refs": Table._Tweeks.tlancamento.RefsTyped<T>;
    "tweeks.tlancamento:NOTNULL": Table._Tweeks.tlancamento.NOTNULLTyped<T>;
    "tweeks.tlancamento:Entry": Table._Tweeks.tlancamento.EntryTyped<T>;
    "tweeks.tipoimposto": Table._Tweeks.tipoimposto.PropsTyped<T>;
    "tweeks.tipoimposto:Props": Table._Tweeks.tipoimposto.PropsTyped<T>;
    "tweeks.tipoimposto:Refs": Table._Tweeks.tipoimposto.RefsTyped<T>;
    "tweeks.tipoimposto:NOTNULL": Table._Tweeks.tipoimposto.NOTNULLTyped<T>;
    "tweeks.tipoimposto:Entry": Table._Tweeks.tipoimposto.EntryTyped<T>;
    "tweeks.dispoe": Table._Tweeks.dispoe.PropsTyped<T>;
    "tweeks.dispoe:Props": Table._Tweeks.dispoe.PropsTyped<T>;
    "tweeks.dispoe:Refs": Table._Tweeks.dispoe.RefsTyped<T>;
    "tweeks.dispoe:NOTNULL": Table._Tweeks.dispoe.NOTNULLTyped<T>;
    "tweeks.dispoe:Entry": Table._Tweeks.dispoe.EntryTyped<T>;
    "tweeks.tatividade": Table._Tweeks.tatividade.PropsTyped<T>;
    "tweeks.tatividade:Props": Table._Tweeks.tatividade.PropsTyped<T>;
    "tweeks.tatividade:Refs": Table._Tweeks.tatividade.RefsTyped<T>;
    "tweeks.tatividade:NOTNULL": Table._Tweeks.tatividade.NOTNULLTyped<T>;
    "tweeks.tatividade:Entry": Table._Tweeks.tatividade.EntryTyped<T>;
    "tweeks.retalho": Table._Tweeks.retalho.PropsTyped<T>;
    "tweeks.retalho:Props": Table._Tweeks.retalho.PropsTyped<T>;
    "tweeks.retalho:Refs": Table._Tweeks.retalho.RefsTyped<T>;
    "tweeks.retalho:NOTNULL": Table._Tweeks.retalho.NOTNULLTyped<T>;
    "tweeks.retalho:Entry": Table._Tweeks.retalho.EntryTyped<T>;
    "tweeks.cliente": Table._Tweeks.cliente.PropsTyped<T>;
    "tweeks.cliente:Props": Table._Tweeks.cliente.PropsTyped<T>;
    "tweeks.cliente:Refs": Table._Tweeks.cliente.RefsTyped<T>;
    "tweeks.cliente:NOTNULL": Table._Tweeks.cliente.NOTNULLTyped<T>;
    "tweeks.cliente:Entry": Table._Tweeks.cliente.EntryTyped<T>;
    "tweeks.unit": Table._Tweeks.unit.PropsTyped<T>;
    "tweeks.unit:Props": Table._Tweeks.unit.PropsTyped<T>;
    "tweeks.unit:Refs": Table._Tweeks.unit.RefsTyped<T>;
    "tweeks.unit:NOTNULL": Table._Tweeks.unit.NOTNULLTyped<T>;
    "tweeks.unit:Entry": Table._Tweeks.unit.EntryTyped<T>;
    "tweeks.tgrupo": Table._Tweeks.tgrupo.PropsTyped<T>;
    "tweeks.tgrupo:Props": Table._Tweeks.tgrupo.PropsTyped<T>;
    "tweeks.tgrupo:Refs": Table._Tweeks.tgrupo.RefsTyped<T>;
    "tweeks.tgrupo:NOTNULL": Table._Tweeks.tgrupo.NOTNULLTyped<T>;
    "tweeks.tgrupo:Entry": Table._Tweeks.tgrupo.EntryTyped<T>;
    "tweeks.chave": Table._Tweeks.chave.PropsTyped<T>;
    "tweeks.chave:Props": Table._Tweeks.chave.PropsTyped<T>;
    "tweeks.chave:Refs": Table._Tweeks.chave.RefsTyped<T>;
    "tweeks.chave:NOTNULL": Table._Tweeks.chave.NOTNULLTyped<T>;
    "tweeks.chave:Entry": Table._Tweeks.chave.EntryTyped<T>;
    "tweeks.espaco": Table._Tweeks.espaco.PropsTyped<T>;
    "tweeks.espaco:Props": Table._Tweeks.espaco.PropsTyped<T>;
    "tweeks.espaco:Refs": Table._Tweeks.espaco.RefsTyped<T>;
    "tweeks.espaco:NOTNULL": Table._Tweeks.espaco.NOTNULLTyped<T>;
    "tweeks.espaco:Entry": Table._Tweeks.espaco.EntryTyped<T>;
    "tweeks.atividade": Table._Tweeks.atividade.PropsTyped<T>;
    "tweeks.atividade:Props": Table._Tweeks.atividade.PropsTyped<T>;
    "tweeks.atividade:Refs": Table._Tweeks.atividade.RefsTyped<T>;
    "tweeks.atividade:NOTNULL": Table._Tweeks.atividade.NOTNULLTyped<T>;
    "tweeks.atividade:Entry": Table._Tweeks.atividade.EntryTyped<T>;
    "tweeks.deposito": Table._Tweeks.deposito.PropsTyped<T>;
    "tweeks.deposito:Props": Table._Tweeks.deposito.PropsTyped<T>;
    "tweeks.deposito:Refs": Table._Tweeks.deposito.RefsTyped<T>;
    "tweeks.deposito:NOTNULL": Table._Tweeks.deposito.NOTNULLTyped<T>;
    "tweeks.deposito:Entry": Table._Tweeks.deposito.EntryTyped<T>;
    "tweeks.conta": Table._Tweeks.conta.PropsTyped<T>;
    "tweeks.conta:Props": Table._Tweeks.conta.PropsTyped<T>;
    "tweeks.conta:Refs": Table._Tweeks.conta.RefsTyped<T>;
    "tweeks.conta:NOTNULL": Table._Tweeks.conta.NOTNULLTyped<T>;
    "tweeks.conta:Entry": Table._Tweeks.conta.EntryTyped<T>;
    "tweeks.tmovimento": Table._Tweeks.tmovimento.PropsTyped<T>;
    "tweeks.tmovimento:Props": Table._Tweeks.tmovimento.PropsTyped<T>;
    "tweeks.tmovimento:Refs": Table._Tweeks.tmovimento.RefsTyped<T>;
    "tweeks.tmovimento:NOTNULL": Table._Tweeks.tmovimento.NOTNULLTyped<T>;
    "tweeks.tmovimento:Entry": Table._Tweeks.tmovimento.EntryTyped<T>;
    "tweeks.branchmap": Table._Tweeks.branchmap.PropsTyped<T>;
    "tweeks.branchmap:Props": Table._Tweeks.branchmap.PropsTyped<T>;
    "tweeks.branchmap:Refs": Table._Tweeks.branchmap.RefsTyped<T>;
    "tweeks.branchmap:NOTNULL": Table._Tweeks.branchmap.NOTNULLTyped<T>;
    "tweeks.branchmap:Entry": Table._Tweeks.branchmap.EntryTyped<T>;
    "tweeks._temp_forece_table": Table._Tweeks._temp_forece_table.PropsTyped<T>;
    "tweeks._temp_forece_table:Props": Table._Tweeks._temp_forece_table.PropsTyped<T>;
    "tweeks._temp_forece_table:Refs": Table._Tweeks._temp_forece_table.RefsTyped<T>;
    "tweeks._temp_forece_table:NOTNULL": Table._Tweeks._temp_forece_table.NOTNULLTyped<T>;
    "tweeks._temp_forece_table:Entry": Table._Tweeks._temp_forece_table.EntryTyped<T>;
    "tweeks.ean": Table._Tweeks.ean.PropsTyped<T>;
    "tweeks.ean:Props": Table._Tweeks.ean.PropsTyped<T>;
    "tweeks.ean:Refs": Table._Tweeks.ean.RefsTyped<T>;
    "tweeks.ean:NOTNULL": Table._Tweeks.ean.NOTNULLTyped<T>;
    "tweeks.ean:Entry": Table._Tweeks.ean.EntryTyped<T>;
    "tweeks.cambio": Table._Tweeks.cambio.PropsTyped<T>;
    "tweeks.cambio:Props": Table._Tweeks.cambio.PropsTyped<T>;
    "tweeks.cambio:Refs": Table._Tweeks.cambio.RefsTyped<T>;
    "tweeks.cambio:NOTNULL": Table._Tweeks.cambio.NOTNULLTyped<T>;
    "tweeks.cambio:Entry": Table._Tweeks.cambio.EntryTyped<T>;
    "tweeks.autorizacao": Table._Tweeks.autorizacao.PropsTyped<T>;
    "tweeks.autorizacao:Props": Table._Tweeks.autorizacao.PropsTyped<T>;
    "tweeks.autorizacao:Refs": Table._Tweeks.autorizacao.RefsTyped<T>;
    "tweeks.autorizacao:NOTNULL": Table._Tweeks.autorizacao.NOTNULLTyped<T>;
    "tweeks.autorizacao:Entry": Table._Tweeks.autorizacao.EntryTyped<T>;
    "tweeks.tpaga": Table._Tweeks.tpaga.PropsTyped<T>;
    "tweeks.tpaga:Props": Table._Tweeks.tpaga.PropsTyped<T>;
    "tweeks.tpaga:Refs": Table._Tweeks.tpaga.RefsTyped<T>;
    "tweeks.tpaga:NOTNULL": Table._Tweeks.tpaga.NOTNULLTyped<T>;
    "tweeks.tpaga:Entry": Table._Tweeks.tpaga.EntryTyped<T>;
    "tweeks.atividadeoperacao": Table._Tweeks.atividadeoperacao.PropsTyped<T>;
    "tweeks.atividadeoperacao:Props": Table._Tweeks.atividadeoperacao.PropsTyped<T>;
    "tweeks.atividadeoperacao:Refs": Table._Tweeks.atividadeoperacao.RefsTyped<T>;
    "tweeks.atividadeoperacao:NOTNULL": Table._Tweeks.atividadeoperacao.NOTNULLTyped<T>;
    "tweeks.atividadeoperacao:Entry": Table._Tweeks.atividadeoperacao.EntryTyped<T>;
    "tweeks.venda": Table._Tweeks.venda.PropsTyped<T>;
    "tweeks.venda:Props": Table._Tweeks.venda.PropsTyped<T>;
    "tweeks.venda:Refs": Table._Tweeks.venda.RefsTyped<T>;
    "tweeks.venda:NOTNULL": Table._Tweeks.venda.NOTNULLTyped<T>;
    "tweeks.venda:Entry": Table._Tweeks.venda.EntryTyped<T>;
    "tweeks.classe": Table._Tweeks.classe.PropsTyped<T>;
    "tweeks.classe:Props": Table._Tweeks.classe.PropsTyped<T>;
    "tweeks.classe:Refs": Table._Tweeks.classe.RefsTyped<T>;
    "tweeks.classe:NOTNULL": Table._Tweeks.classe.NOTNULLTyped<T>;
    "tweeks.classe:Entry": Table._Tweeks.classe.EntryTyped<T>;
    "tweeks.artigo": Table._Tweeks.artigo.PropsTyped<T>;
    "tweeks.artigo:Props": Table._Tweeks.artigo.PropsTyped<T>;
    "tweeks.artigo:Refs": Table._Tweeks.artigo.RefsTyped<T>;
    "tweeks.artigo:NOTNULL": Table._Tweeks.artigo.NOTNULLTyped<T>;
    "tweeks.artigo:Entry": Table._Tweeks.artigo.EntryTyped<T>;
    "tweeks.lancamento": Table._Tweeks.lancamento.PropsTyped<T>;
    "tweeks.lancamento:Props": Table._Tweeks.lancamento.PropsTyped<T>;
    "tweeks.lancamento:Refs": Table._Tweeks.lancamento.RefsTyped<T>;
    "tweeks.lancamento:NOTNULL": Table._Tweeks.lancamento.NOTNULLTyped<T>;
    "tweeks.lancamento:Entry": Table._Tweeks.lancamento.EntryTyped<T>;
    "tweeks.imposto": Table._Tweeks.imposto.PropsTyped<T>;
    "tweeks.imposto:Props": Table._Tweeks.imposto.PropsTyped<T>;
    "tweeks.imposto:Refs": Table._Tweeks.imposto.RefsTyped<T>;
    "tweeks.imposto:NOTNULL": Table._Tweeks.imposto.NOTNULLTyped<T>;
    "tweeks.imposto:Entry": Table._Tweeks.imposto.EntryTyped<T>;
    "tweeks.branch": View._Tweeks.branch.PropsTyped<T>;
    "tweeks.guia": Table._Tweeks.guia.PropsTyped<T>;
    "tweeks.guia:Props": Table._Tweeks.guia.PropsTyped<T>;
    "tweeks.guia:Refs": Table._Tweeks.guia.RefsTyped<T>;
    "tweeks.guia:NOTNULL": Table._Tweeks.guia.NOTNULLTyped<T>;
    "tweeks.guia:Entry": Table._Tweeks.guia.EntryTyped<T>;
    "tweeks.link": Table._Tweeks.link.PropsTyped<T>;
    "tweeks.link:Props": Table._Tweeks.link.PropsTyped<T>;
    "tweeks.link:Refs": Table._Tweeks.link.RefsTyped<T>;
    "tweeks.link:NOTNULL": Table._Tweeks.link.NOTNULLTyped<T>;
    "tweeks.link:Entry": Table._Tweeks.link.EntryTyped<T>;
    "tweeks.serie": Table._Tweeks.serie.PropsTyped<T>;
    "tweeks.serie:Props": Table._Tweeks.serie.PropsTyped<T>;
    "tweeks.serie:Refs": Table._Tweeks.serie.RefsTyped<T>;
    "tweeks.serie:NOTNULL": Table._Tweeks.serie.NOTNULLTyped<T>;
    "tweeks.serie:Entry": Table._Tweeks.serie.EntryTyped<T>;
    "tweeks.impostovenda": Table._Tweeks.impostovenda.PropsTyped<T>;
    "tweeks.impostovenda:Props": Table._Tweeks.impostovenda.PropsTyped<T>;
    "tweeks.impostovenda:Refs": Table._Tweeks.impostovenda.RefsTyped<T>;
    "tweeks.impostovenda:NOTNULL": Table._Tweeks.impostovenda.NOTNULLTyped<T>;
    "tweeks.impostovenda:Entry": Table._Tweeks.impostovenda.EntryTyped<T>;
    "tweeks.parametrizacao": Table._Tweeks.parametrizacao.PropsTyped<T>;
    "tweeks.parametrizacao:Props": Table._Tweeks.parametrizacao.PropsTyped<T>;
    "tweeks.parametrizacao:Refs": Table._Tweeks.parametrizacao.RefsTyped<T>;
    "tweeks.parametrizacao:NOTNULL": Table._Tweeks.parametrizacao.NOTNULLTyped<T>;
    "tweeks.parametrizacao:Entry": Table._Tweeks.parametrizacao.EntryTyped<T>;
    "tweeks.custoguia": Table._Tweeks.custoguia.PropsTyped<T>;
    "tweeks.custoguia:Props": Table._Tweeks.custoguia.PropsTyped<T>;
    "tweeks.custoguia:Refs": Table._Tweeks.custoguia.RefsTyped<T>;
    "tweeks.custoguia:NOTNULL": Table._Tweeks.custoguia.NOTNULLTyped<T>;
    "tweeks.custoguia:Entry": Table._Tweeks.custoguia.EntryTyped<T>;
    "tweeks.tdocuemto": Table._Tweeks.tdocuemto.PropsTyped<T>;
    "tweeks.tdocuemto:Props": Table._Tweeks.tdocuemto.PropsTyped<T>;
    "tweeks.tdocuemto:Refs": Table._Tweeks.tdocuemto.RefsTyped<T>;
    "tweeks.tdocuemto:NOTNULL": Table._Tweeks.tdocuemto.NOTNULLTyped<T>;
    "tweeks.tdocuemto:Entry": Table._Tweeks.tdocuemto.EntryTyped<T>;
    "tweeks.taxa": Table._Tweeks.taxa.PropsTyped<T>;
    "tweeks.taxa:Props": Table._Tweeks.taxa.PropsTyped<T>;
    "tweeks.taxa:Refs": Table._Tweeks.taxa.RefsTyped<T>;
    "tweeks.taxa:NOTNULL": Table._Tweeks.taxa.NOTNULLTyped<T>;
    "tweeks.taxa:Entry": Table._Tweeks.taxa.EntryTyped<T>;
    "tweeks.codigoimposto": Table._Tweeks.codigoimposto.PropsTyped<T>;
    "tweeks.codigoimposto:Props": Table._Tweeks.codigoimposto.PropsTyped<T>;
    "tweeks.codigoimposto:Refs": Table._Tweeks.codigoimposto.RefsTyped<T>;
    "tweeks.codigoimposto:NOTNULL": Table._Tweeks.codigoimposto.NOTNULLTyped<T>;
    "tweeks.codigoimposto:Entry": Table._Tweeks.codigoimposto.EntryTyped<T>;
    "tweeks.tbranch": Table._Tweeks.tbranch.PropsTyped<T>;
    "tweeks.tbranch:Props": Table._Tweeks.tbranch.PropsTyped<T>;
    "tweeks.tbranch:Refs": Table._Tweeks.tbranch.RefsTyped<T>;
    "tweeks.tbranch:NOTNULL": Table._Tweeks.tbranch.NOTNULLTyped<T>;
    "tweeks.tbranch:Entry": Table._Tweeks.tbranch.EntryTyped<T>;
    "tweeks.tposto": Table._Tweeks.tposto.PropsTyped<T>;
    "tweeks.tposto:Props": Table._Tweeks.tposto.PropsTyped<T>;
    "tweeks.tposto:Refs": Table._Tweeks.tposto.RefsTyped<T>;
    "tweeks.tposto:NOTNULL": Table._Tweeks.tposto.NOTNULLTyped<T>;
    "tweeks.tposto:Entry": Table._Tweeks.tposto.EntryTyped<T>;
    "tweeks.posto": Table._Tweeks.posto.PropsTyped<T>;
    "tweeks.posto:Props": Table._Tweeks.posto.PropsTyped<T>;
    "tweeks.posto:Refs": Table._Tweeks.posto.RefsTyped<T>;
    "tweeks.posto:NOTNULL": Table._Tweeks.posto.NOTNULLTyped<T>;
    "tweeks.posto:Entry": Table._Tweeks.posto.EntryTyped<T>;
    "tweeks.repcolumn": Table._Tweeks.repcolumn.PropsTyped<T>;
    "tweeks.repcolumn:Props": Table._Tweeks.repcolumn.PropsTyped<T>;
    "tweeks.repcolumn:Refs": Table._Tweeks.repcolumn.RefsTyped<T>;
    "tweeks.repcolumn:NOTNULL": Table._Tweeks.repcolumn.NOTNULLTyped<T>;
    "tweeks.repcolumn:Entry": Table._Tweeks.repcolumn.EntryTyped<T>;
    "tweeks.transferencia": Table._Tweeks.transferencia.PropsTyped<T>;
    "tweeks.transferencia:Props": Table._Tweeks.transferencia.PropsTyped<T>;
    "tweeks.transferencia:Refs": Table._Tweeks.transferencia.RefsTyped<T>;
    "tweeks.transferencia:NOTNULL": Table._Tweeks.transferencia.NOTNULLTyped<T>;
    "tweeks.transferencia:Entry": Table._Tweeks.transferencia.EntryTyped<T>;
    "tweeks.fluxo": Table._Tweeks.fluxo.PropsTyped<T>;
    "tweeks.fluxo:Props": Table._Tweeks.fluxo.PropsTyped<T>;
    "tweeks.fluxo:Refs": Table._Tweeks.fluxo.RefsTyped<T>;
    "tweeks.fluxo:NOTNULL": Table._Tweeks.fluxo.NOTNULLTyped<T>;
    "tweeks.fluxo:Entry": Table._Tweeks.fluxo.EntryTyped<T>;
    "tweeks.tlink": Table._Tweeks.tlink.PropsTyped<T>;
    "tweeks.tlink:Props": Table._Tweeks.tlink.PropsTyped<T>;
    "tweeks.tlink:Refs": Table._Tweeks.tlink.RefsTyped<T>;
    "tweeks.tlink:NOTNULL": Table._Tweeks.tlink.NOTNULLTyped<T>;
    "tweeks.tlink:Entry": Table._Tweeks.tlink.EntryTyped<T>;
    "tweeks.aloca": Table._Tweeks.aloca.PropsTyped<T>;
    "tweeks.aloca:Props": Table._Tweeks.aloca.PropsTyped<T>;
    "tweeks.aloca:Refs": Table._Tweeks.aloca.RefsTyped<T>;
    "tweeks.aloca:NOTNULL": Table._Tweeks.aloca.NOTNULLTyped<T>;
    "tweeks.aloca:Entry": Table._Tweeks.aloca.EntryTyped<T>;
    "tweeks.entrada": Table._Tweeks.entrada.PropsTyped<T>;
    "tweeks.entrada:Props": Table._Tweeks.entrada.PropsTyped<T>;
    "tweeks.entrada:Refs": Table._Tweeks.entrada.RefsTyped<T>;
    "tweeks.entrada:NOTNULL": Table._Tweeks.entrada.NOTNULLTyped<T>;
    "tweeks.entrada:Entry": Table._Tweeks.entrada.EntryTyped<T>;
    "tweeks.fornecedor": Table._Tweeks.fornecedor.PropsTyped<T>;
    "tweeks.fornecedor:Props": Table._Tweeks.fornecedor.PropsTyped<T>;
    "tweeks.fornecedor:Refs": Table._Tweeks.fornecedor.RefsTyped<T>;
    "tweeks.fornecedor:NOTNULL": Table._Tweeks.fornecedor.NOTNULLTyped<T>;
    "tweeks.fornecedor:Entry": Table._Tweeks.fornecedor.EntryTyped<T>;
  }

  export interface TableMaps<T extends { [K in TypeProperties]?: T[K] }> {
    cluster: maps._Cluster.TableMaps<T>;
    auth: maps._Auth.TableMaps<T>;
    libdom: maps._Libdom.TableMaps<T>;
    tweeks: maps._Tweeks.TableMaps<T>;
  }

  export interface TableRefsMaps<T extends { [K in TypeProperties]?: T[K] }> {
    "cluster.branch": Table._Cluster.branch.PropsTyped<T>;
    "auth.session": Table._Auth.session.PropsTyped<T>;
    "libdom.domsync": Table._Libdom.domsync.PropsTyped<T>;
    "auth.acesso": Table._Auth.acesso.PropsTyped<T>;
    "auth.tsexo": Table._Auth.tsexo.PropsTyped<T>;
    "cluster.resource": Table._Cluster.resource.PropsTyped<T>;
    "cluster.users": Table._Cluster.users.PropsTyped<T>;
    "cluster.ignore": Table._Cluster.ignore.PropsTyped<T>;
    "cluster.pull": Table._Cluster.pull.PropsTyped<T>;
    "cluster.share": Table._Cluster.share.PropsTyped<T>;
    "cluster.object": Table._Cluster._object.PropsTyped<T>;
    "cluster.cluster": Table._Cluster.cluster.PropsTyped<T>;
    "cluster.filter": Table._Cluster.filter.PropsTyped<T>;
    "auth.privilegio": Table._Auth.privilegio.PropsTyped<T>;
    "cluster.break": Table._Cluster._break.PropsTyped<T>;
    "cluster.collector": Table._Cluster.collector.PropsTyped<T>;
    "cluster.version": Table._Cluster.version.PropsTyped<T>;
    "cluster.classmap": Table._Cluster.classmap.PropsTyped<T>;
    "cluster.sequence": Table._Cluster.sequence.PropsTyped<T>;
    "cluster.tperiod": Table._Cluster.tperiod.PropsTyped<T>;
    "auth.menu": Table._Auth.menu.PropsTyped<T>;
    "libdom.entryset": Table._Libdom.entryset.PropsTyped<T>;
    "auth.colaborador": Table._Auth.colaborador.PropsTyped<T>;
    "cluster.auth": Table._Cluster.auth.PropsTyped<T>;
    "auth.perfil": Table._Auth.perfil.PropsTyped<T>;
    "auth.autenticacao": Table._Auth.autenticacao.PropsTyped<T>;
    "tweeks.movimento": Table._Tweeks.movimento.PropsTyped<T>;
    "tweeks.transacao": Table._Tweeks.transacao.PropsTyped<T>;
    "tweeks.caixa": Table._Tweeks.caixa.PropsTyped<T>;
    "tweeks.trabalha": Table._Tweeks.trabalha.PropsTyped<T>;
    "tweeks.tserie": Table._Tweeks.tserie.PropsTyped<T>;
    "tweeks.acerto": Table._Tweeks.acerto.PropsTyped<T>;
    "tweeks.taplicar": Table._Tweeks.taplicar.PropsTyped<T>;
    "tweeks.toperacao": Table._Tweeks.toperacao.PropsTyped<T>;
    "tweeks.tlancamento": Table._Tweeks.tlancamento.PropsTyped<T>;
    "tweeks.tipoimposto": Table._Tweeks.tipoimposto.PropsTyped<T>;
    "tweeks.dispoe": Table._Tweeks.dispoe.PropsTyped<T>;
    "tweeks.tatividade": Table._Tweeks.tatividade.PropsTyped<T>;
    "tweeks.retalho": Table._Tweeks.retalho.PropsTyped<T>;
    "tweeks.cliente": Table._Tweeks.cliente.PropsTyped<T>;
    "tweeks.unit": Table._Tweeks.unit.PropsTyped<T>;
    "tweeks.tgrupo": Table._Tweeks.tgrupo.PropsTyped<T>;
    "tweeks.chave": Table._Tweeks.chave.PropsTyped<T>;
    "tweeks.espaco": Table._Tweeks.espaco.PropsTyped<T>;
    "tweeks.atividade": Table._Tweeks.atividade.PropsTyped<T>;
    "tweeks.deposito": Table._Tweeks.deposito.PropsTyped<T>;
    "tweeks.conta": Table._Tweeks.conta.PropsTyped<T>;
    "tweeks.tmovimento": Table._Tweeks.tmovimento.PropsTyped<T>;
    "tweeks.branchmap": Table._Tweeks.branchmap.PropsTyped<T>;
    "tweeks._temp_forece_table": Table._Tweeks._temp_forece_table.PropsTyped<T>;
    "tweeks.ean": Table._Tweeks.ean.PropsTyped<T>;
    "tweeks.cambio": Table._Tweeks.cambio.PropsTyped<T>;
    "tweeks.autorizacao": Table._Tweeks.autorizacao.PropsTyped<T>;
    "tweeks.tpaga": Table._Tweeks.tpaga.PropsTyped<T>;
    "tweeks.atividadeoperacao": Table._Tweeks.atividadeoperacao.PropsTyped<T>;
    "tweeks.venda": Table._Tweeks.venda.PropsTyped<T>;
    "tweeks.classe": Table._Tweeks.classe.PropsTyped<T>;
    "tweeks.artigo": Table._Tweeks.artigo.PropsTyped<T>;
    "tweeks.lancamento": Table._Tweeks.lancamento.PropsTyped<T>;
    "tweeks.imposto": Table._Tweeks.imposto.PropsTyped<T>;
    "tweeks.guia": Table._Tweeks.guia.PropsTyped<T>;
    "tweeks.link": Table._Tweeks.link.PropsTyped<T>;
    "tweeks.serie": Table._Tweeks.serie.PropsTyped<T>;
    "tweeks.impostovenda": Table._Tweeks.impostovenda.PropsTyped<T>;
    "tweeks.parametrizacao": Table._Tweeks.parametrizacao.PropsTyped<T>;
    "tweeks.custoguia": Table._Tweeks.custoguia.PropsTyped<T>;
    "tweeks.tdocuemto": Table._Tweeks.tdocuemto.PropsTyped<T>;
    "tweeks.taxa": Table._Tweeks.taxa.PropsTyped<T>;
    "tweeks.codigoimposto": Table._Tweeks.codigoimposto.PropsTyped<T>;
    "tweeks.tbranch": Table._Tweeks.tbranch.PropsTyped<T>;
    "tweeks.tposto": Table._Tweeks.tposto.PropsTyped<T>;
    "tweeks.posto": Table._Tweeks.posto.PropsTyped<T>;
    "tweeks.repcolumn": Table._Tweeks.repcolumn.PropsTyped<T>;
    "tweeks.transferencia": Table._Tweeks.transferencia.PropsTyped<T>;
    "tweeks.fluxo": Table._Tweeks.fluxo.PropsTyped<T>;
    "tweeks.tlink": Table._Tweeks.tlink.PropsTyped<T>;
    "tweeks.aloca": Table._Tweeks.aloca.PropsTyped<T>;
    "tweeks.entrada": Table._Tweeks.entrada.PropsTyped<T>;
    "tweeks.fornecedor": Table._Tweeks.fornecedor.PropsTyped<T>;
  }

  export interface ViewMaps<T extends { [K in TypeProperties]?: T[K] }> {
    tweeks: maps._Tweeks.ViewMaps<T>;
  }

  export interface ViewRefsMaps<T extends { [K in TypeProperties]?: T[K] }> {
    "tweeks._vserie": View._Tweeks._vserie.PropsTyped<T>;
    "tweeks.stock": View._Tweeks.stock.PropsTyped<T>;
    "tweeks.branch": View._Tweeks.branch.PropsTyped<T>;
  }

  export interface CompositeMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export interface CompositeRefsMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {}

  export interface MaterializeMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {}

  export interface MaterializeRefsMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {}

  export interface RelationMaps<T extends { [K in TypeProperties]?: T[K] }> {
    cluster: maps._Cluster.RelationMaps<T>;
    auth: maps._Auth.RelationMaps<T>;
    libdom: maps._Libdom.RelationMaps<T>;
    tweeks: maps._Tweeks.RelationMaps<T>;
  }

  export interface RelationRefsMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {
    "cluster.branch": Table._Cluster.branch.PropsTyped<T>;
    "auth.session": Table._Auth.session.PropsTyped<T>;
    "libdom.domsync": Table._Libdom.domsync.PropsTyped<T>;
    "auth.acesso": Table._Auth.acesso.PropsTyped<T>;
    "auth.tsexo": Table._Auth.tsexo.PropsTyped<T>;
    "cluster.resource": Table._Cluster.resource.PropsTyped<T>;
    "cluster.users": Table._Cluster.users.PropsTyped<T>;
    "cluster.ignore": Table._Cluster.ignore.PropsTyped<T>;
    "cluster.pull": Table._Cluster.pull.PropsTyped<T>;
    "cluster.share": Table._Cluster.share.PropsTyped<T>;
    "cluster.object": Table._Cluster._object.PropsTyped<T>;
    "cluster.cluster": Table._Cluster.cluster.PropsTyped<T>;
    "cluster.filter": Table._Cluster.filter.PropsTyped<T>;
    "auth.privilegio": Table._Auth.privilegio.PropsTyped<T>;
    "cluster.break": Table._Cluster._break.PropsTyped<T>;
    "cluster.collector": Table._Cluster.collector.PropsTyped<T>;
    "cluster.version": Table._Cluster.version.PropsTyped<T>;
    "cluster.classmap": Table._Cluster.classmap.PropsTyped<T>;
    "cluster.sequence": Table._Cluster.sequence.PropsTyped<T>;
    "cluster.tperiod": Table._Cluster.tperiod.PropsTyped<T>;
    "auth.menu": Table._Auth.menu.PropsTyped<T>;
    "libdom.entryset": Table._Libdom.entryset.PropsTyped<T>;
    "auth.colaborador": Table._Auth.colaborador.PropsTyped<T>;
    "cluster.auth": Table._Cluster.auth.PropsTyped<T>;
    "auth.perfil": Table._Auth.perfil.PropsTyped<T>;
    "auth.autenticacao": Table._Auth.autenticacao.PropsTyped<T>;
    "tweeks.movimento": Table._Tweeks.movimento.PropsTyped<T>;
    "tweeks._vserie": View._Tweeks._vserie.PropsTyped<T>;
    "tweeks.transacao": Table._Tweeks.transacao.PropsTyped<T>;
    "tweeks.caixa": Table._Tweeks.caixa.PropsTyped<T>;
    "tweeks.stock": View._Tweeks.stock.PropsTyped<T>;
    "tweeks.trabalha": Table._Tweeks.trabalha.PropsTyped<T>;
    "tweeks.tserie": Table._Tweeks.tserie.PropsTyped<T>;
    "tweeks.acerto": Table._Tweeks.acerto.PropsTyped<T>;
    "tweeks.taplicar": Table._Tweeks.taplicar.PropsTyped<T>;
    "tweeks.toperacao": Table._Tweeks.toperacao.PropsTyped<T>;
    "tweeks.tlancamento": Table._Tweeks.tlancamento.PropsTyped<T>;
    "tweeks.tipoimposto": Table._Tweeks.tipoimposto.PropsTyped<T>;
    "tweeks.dispoe": Table._Tweeks.dispoe.PropsTyped<T>;
    "tweeks.tatividade": Table._Tweeks.tatividade.PropsTyped<T>;
    "tweeks.retalho": Table._Tweeks.retalho.PropsTyped<T>;
    "tweeks.cliente": Table._Tweeks.cliente.PropsTyped<T>;
    "tweeks.unit": Table._Tweeks.unit.PropsTyped<T>;
    "tweeks.tgrupo": Table._Tweeks.tgrupo.PropsTyped<T>;
    "tweeks.chave": Table._Tweeks.chave.PropsTyped<T>;
    "tweeks.espaco": Table._Tweeks.espaco.PropsTyped<T>;
    "tweeks.atividade": Table._Tweeks.atividade.PropsTyped<T>;
    "tweeks.deposito": Table._Tweeks.deposito.PropsTyped<T>;
    "tweeks.conta": Table._Tweeks.conta.PropsTyped<T>;
    "tweeks.tmovimento": Table._Tweeks.tmovimento.PropsTyped<T>;
    "tweeks.branchmap": Table._Tweeks.branchmap.PropsTyped<T>;
    "tweeks._temp_forece_table": Table._Tweeks._temp_forece_table.PropsTyped<T>;
    "tweeks.ean": Table._Tweeks.ean.PropsTyped<T>;
    "tweeks.cambio": Table._Tweeks.cambio.PropsTyped<T>;
    "tweeks.autorizacao": Table._Tweeks.autorizacao.PropsTyped<T>;
    "tweeks.tpaga": Table._Tweeks.tpaga.PropsTyped<T>;
    "tweeks.atividadeoperacao": Table._Tweeks.atividadeoperacao.PropsTyped<T>;
    "tweeks.venda": Table._Tweeks.venda.PropsTyped<T>;
    "tweeks.classe": Table._Tweeks.classe.PropsTyped<T>;
    "tweeks.artigo": Table._Tweeks.artigo.PropsTyped<T>;
    "tweeks.lancamento": Table._Tweeks.lancamento.PropsTyped<T>;
    "tweeks.imposto": Table._Tweeks.imposto.PropsTyped<T>;
    "tweeks.branch": View._Tweeks.branch.PropsTyped<T>;
    "tweeks.guia": Table._Tweeks.guia.PropsTyped<T>;
    "tweeks.link": Table._Tweeks.link.PropsTyped<T>;
    "tweeks.serie": Table._Tweeks.serie.PropsTyped<T>;
    "tweeks.impostovenda": Table._Tweeks.impostovenda.PropsTyped<T>;
    "tweeks.parametrizacao": Table._Tweeks.parametrizacao.PropsTyped<T>;
    "tweeks.custoguia": Table._Tweeks.custoguia.PropsTyped<T>;
    "tweeks.tdocuemto": Table._Tweeks.tdocuemto.PropsTyped<T>;
    "tweeks.taxa": Table._Tweeks.taxa.PropsTyped<T>;
    "tweeks.codigoimposto": Table._Tweeks.codigoimposto.PropsTyped<T>;
    "tweeks.tbranch": Table._Tweeks.tbranch.PropsTyped<T>;
    "tweeks.tposto": Table._Tweeks.tposto.PropsTyped<T>;
    "tweeks.posto": Table._Tweeks.posto.PropsTyped<T>;
    "tweeks.repcolumn": Table._Tweeks.repcolumn.PropsTyped<T>;
    "tweeks.transferencia": Table._Tweeks.transferencia.PropsTyped<T>;
    "tweeks.fluxo": Table._Tweeks.fluxo.PropsTyped<T>;
    "tweeks.tlink": Table._Tweeks.tlink.PropsTyped<T>;
    "tweeks.aloca": Table._Tweeks.aloca.PropsTyped<T>;
    "tweeks.entrada": Table._Tweeks.entrada.PropsTyped<T>;
    "tweeks.fornecedor": Table._Tweeks.fornecedor.PropsTyped<T>;
  }

  export interface EnumMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export interface EnumRefsMaps<T extends { [K in TypeProperties]?: T[K] }> {}

  export interface CompositeTypeMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {
    lib: maps._Lib.CompositeTypeMaps<T>;
    libdom: maps._Libdom.CompositeTypeMaps<T>;
    map: maps._Map.CompositeTypeMaps<T>;
  }

  export interface CompositeTypeRefsMaps<
    T extends { [K in TypeProperties]?: T[K] },
  > {
    "lib.res": CompositeType._Lib.res.PropsTyped<T>;
    "lib.result": CompositeType._Lib.result.PropsTyped<T>;
    "libdom.constant": CompositeType._Libdom.constant.PropsTyped<T>;
    "map.constant": CompositeType._Map.constant.PropsTyped<T>;
    "libdom.domain": CompositeType._Libdom.domain.PropsTyped<T>;
  }

  export namespace Table {
    export namespace _Cluster {
      export namespace branch {
        export interface PropsTyped<
          T extends {
            [K in
              | "cluster.branch.branch_workspace"
              | "cluster.branch.branch_licence"
              | "cluster.branch.branch_user"
              | "cluster.branch.branch_grants"]?: T[K];
          },
        > {
          branch_path?: tns.TypeOf<"varchar">;
          branch_update?: tns.TypeOf<"timestamptz">;
          branch_uid?: tns.TypeOf<"uuid">;
          branch_main_user?: tns.TypeOf<"uuid">;
          branch_name?: tns.TypeOf<"varchar">;
          branch_main_workspace?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          branch_clusters?: tns.TypeOf<"varchar">[];
          branch_workspace?: T["cluster.branch.branch_workspace"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_workspace"];
          branch_date?: tns.TypeOf<"timestamptz">;
          branch_licence?: T["cluster.branch.branch_licence"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_licence"];
          branch_tbranch_id?: tns.TypeOf<"int2">;
          branch_user?: T["cluster.branch.branch_user"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_user"];
          branch_grants?: T["cluster.branch.branch_grants"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_grants"];
          branch_state?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          branch_path: tns.TypeOf<"varchar">;
          branch_uid: tns.TypeOf<"uuid">;
          branch_name: tns.TypeOf<"varchar">;
          branch_clusters: tns.TypeOf<"varchar">[];
          branch_date: tns.TypeOf<"timestamptz">;
          branch_tbranch_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "cluster.branch.branch_workspace"
              | "cluster.branch.branch_licence"
              | "cluster.branch.branch_user"
              | "cluster.branch.branch_grants"]?: T[K];
          },
        > {
          branch_path: tns.TypeOf<"varchar">;
          branch_update?: tns.TypeOf<"timestamptz">;
          branch_uid: tns.TypeOf<"uuid">;
          branch_main_user?: tns.TypeOf<"uuid">;
          branch_name: tns.TypeOf<"varchar">;
          branch_main_workspace?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          branch_clusters: tns.TypeOf<"varchar">[];
          branch_workspace?: T["cluster.branch.branch_workspace"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_workspace"];
          branch_date: tns.TypeOf<"timestamptz">;
          branch_licence?: T["cluster.branch.branch_licence"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_licence"];
          branch_tbranch_id: tns.TypeOf<"int2">;
          branch_user?: T["cluster.branch.branch_user"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_user"];
          branch_grants?: T["cluster.branch.branch_grants"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.branch.branch_grants"];
          branch_state?: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace resource {
        export interface PropsTyped<
          T extends { [K in "cluster.resource.resource_metadata"]?: T[K] },
        > {
          resource_reference?: tns.TypeOf<"varchar">;
          resource_metadata?: T["cluster.resource.resource_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.resource.resource_metadata"];
          resource_url?: tns.TypeOf<"varchar">;
          resource_update?: tns.TypeOf<"timestamptz">;
          resource_name?: tns.TypeOf<"varchar">;
          resource_version?: tns.TypeOf<"int2">;
          resource_subpath?: tns.TypeOf<"varchar">;
          resource_cluster?: tns.TypeOf<"varchar">;
          resource_date?: tns.TypeOf<"timestamptz">;
          resource_extension?: tns.TypeOf<"varchar">;
          resource_identifier?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "cluster.resource.resource_metadata"]?: T[K] },
        > {
          resource_reference: tns.TypeOf<"varchar">;
          resource_metadata: T["cluster.resource.resource_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.resource.resource_metadata"];
          resource_url: tns.TypeOf<"varchar">;
          resource_name: tns.TypeOf<"varchar">;
          resource_version: tns.TypeOf<"int2">;
          resource_cluster: tns.TypeOf<"varchar">;
          resource_date: tns.TypeOf<"timestamptz">;
          resource_identifier: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<
          T extends { [K in "cluster.resource.resource_metadata"]?: T[K] },
        > {
          resource_reference: tns.TypeOf<"varchar">;
          resource_metadata: T["cluster.resource.resource_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.resource.resource_metadata"];
          resource_url: tns.TypeOf<"varchar">;
          resource_update?: tns.TypeOf<"timestamptz">;
          resource_name: tns.TypeOf<"varchar">;
          resource_version: tns.TypeOf<"int2">;
          resource_subpath?: tns.TypeOf<"varchar">;
          resource_cluster: tns.TypeOf<"varchar">;
          resource_date: tns.TypeOf<"timestamptz">;
          resource_extension?: tns.TypeOf<"varchar">;
          resource_identifier: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace users {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          user_default?: tns.TypeOf<"regrole">;
          user_replication?: tns.TypeOf<"regrole">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          user_default: tns.TypeOf<"regrole">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          user_default: tns.TypeOf<"regrole">;
          user_replication?: tns.TypeOf<"regrole">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace ignore {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          collector?: tns.TypeOf<"uuid">;
          origin?: tns.TypeOf<"varchar">;
          object?: tns.TypeOf<"uuid">;
          transaction?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          collector: tns.TypeOf<"uuid">;
          origin: tns.TypeOf<"varchar">;
          object: tns.TypeOf<"uuid">;
          transaction: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          collector: tns.TypeOf<"uuid">;
          origin: tns.TypeOf<"varchar">;
          object: tns.TypeOf<"uuid">;
          transaction: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace pull {
        export interface PropsTyped<
          T extends {
            [K in
              | "cluster.pull.pull_result"
              | "cluster.pull.pull_pulled"
              | "cluster.pull.pull_ignores"
              | "cluster.pull.pull_server"
              | "cluster.pull.pull_objects"]?: T[K];
          },
        > {
          pull_uid?: tns.TypeOf<"uuid">;
          pull_sequence?: tns.TypeOf<"int8">;
          pull_result?: T["cluster.pull.pull_result"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_result"];
          pull_rejected?: tns.TypeOf<"int4">;
          pull_pulled?: T["cluster.pull.pull_pulled"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_pulled"];
          pull_limit?: tns.TypeOf<"int8">;
          pull_finalize?: tns.TypeOf<"timestamp">;
          pull_ignores?: T["cluster.pull.pull_ignores"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_ignores"];
          pull_total?: tns.TypeOf<"int8">;
          pull_server?: T["cluster.pull.pull_server"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_server"];
          pull_objects?: T["cluster.pull.pull_objects"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_objects"];
          pull_status?: tns.TypeOf<"int2">;
          pull_revcode?: tns.TypeOf<"varchar">;
          pull_instant?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends {
            [K in
              | "cluster.pull.pull_server"
              | "cluster.pull.pull_objects"]?: T[K];
          },
        > {
          pull_uid: tns.TypeOf<"uuid">;
          pull_sequence: tns.TypeOf<"int8">;
          pull_server: T["cluster.pull.pull_server"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_server"];
          pull_objects: T["cluster.pull.pull_objects"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_objects"];
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "cluster.pull.pull_result"
              | "cluster.pull.pull_pulled"
              | "cluster.pull.pull_ignores"
              | "cluster.pull.pull_server"
              | "cluster.pull.pull_objects"]?: T[K];
          },
        > {
          pull_uid: tns.TypeOf<"uuid">;
          pull_sequence: tns.TypeOf<"int8">;
          pull_result?: T["cluster.pull.pull_result"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_result"];
          pull_rejected?: tns.TypeOf<"int4">;
          pull_pulled?: T["cluster.pull.pull_pulled"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_pulled"];
          pull_limit?: tns.TypeOf<"int8">;
          pull_finalize?: tns.TypeOf<"timestamp">;
          pull_ignores?: T["cluster.pull.pull_ignores"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_ignores"];
          pull_total?: tns.TypeOf<"int8">;
          pull_server: T["cluster.pull.pull_server"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_server"];
          pull_objects: T["cluster.pull.pull_objects"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.pull.pull_objects"];
          pull_status?: tns.TypeOf<"int2">;
          pull_revcode?: tns.TypeOf<"varchar">;
          pull_instant?: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace share {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          share_checker?: tns.TypeOf<"regprocedure">;
          share_update?: tns.TypeOf<"bool">;
          share_pks?: tns.TypeOf<"name">[];
          share_pksfrom?: tns.TypeOf<"varchar">;
          share_regclass?: tns.TypeOf<"varchar">;
          share_triggers?: tns.TypeOf<"name">[];
          share_insert?: tns.TypeOf<"bool">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          share_update: tns.TypeOf<"bool">;
          share_regclass: tns.TypeOf<"varchar">;
          share_insert: tns.TypeOf<"bool">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          share_checker?: tns.TypeOf<"regprocedure">;
          share_update: tns.TypeOf<"bool">;
          share_pks?: tns.TypeOf<"name">[];
          share_pksfrom?: tns.TypeOf<"varchar">;
          share_regclass: tns.TypeOf<"varchar">;
          share_triggers?: tns.TypeOf<"name">[];
          share_insert: tns.TypeOf<"bool">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace _object {
        export interface PropsTyped<
          T extends { [K in "cluster.object.object_ref"]?: T[K] },
        > {
          object_originrev?: tns.TypeOf<"int8">;
          object_sync?: tns.TypeOf<"bool">;
          object_date?: tns.TypeOf<"timestamptz">;
          object_seq?: tns.TypeOf<"int8">;
          object_receiver?: tns.TypeOf<"timestamptz">;
          object_collector_uid?: tns.TypeOf<"uuid">;
          object_transuid?: tns.TypeOf<"uuid">;
          object_origincver?: tns.TypeOf<"int8">;
          object_instant?: tns.TypeOf<"timestamptz">;
          object_share_regclass?: tns.TypeOf<"varchar">;
          object_sseq?: tns.TypeOf<"int8">;
          object_status?: tns.TypeOf<"int2">;
          object_uid?: tns.TypeOf<"uuid">;
          object_outdate?: tns.TypeOf<"bool">;
          object_cluster_receiver?: tns.TypeOf<"uuid">;
          object_originsseq?: tns.TypeOf<"int8">;
          object_originver?: tns.TypeOf<"int8">;
          object_ref?: T["cluster.object.object_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.object.object_ref"];
          object_originsver?: tns.TypeOf<"int8">;
          object_cluster_origin?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "cluster.object.object_ref"]?: T[K] },
        > {
          object_originrev: tns.TypeOf<"int8">;
          object_sync: tns.TypeOf<"bool">;
          object_date: tns.TypeOf<"timestamptz">;
          object_seq: tns.TypeOf<"int8">;
          object_receiver: tns.TypeOf<"timestamptz">;
          object_transuid: tns.TypeOf<"uuid">;
          object_origincver: tns.TypeOf<"int8">;
          object_instant: tns.TypeOf<"timestamptz">;
          object_share_regclass: tns.TypeOf<"varchar">;
          object_sseq: tns.TypeOf<"int8">;
          object_status: tns.TypeOf<"int2">;
          object_uid: tns.TypeOf<"uuid">;
          object_outdate: tns.TypeOf<"bool">;
          object_originsseq: tns.TypeOf<"int8">;
          object_originver: tns.TypeOf<"int8">;
          object_ref: T["cluster.object.object_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.object.object_ref"];
          object_originsver: tns.TypeOf<"int8">;
          object_cluster_origin: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends { [K in "cluster.object.object_ref"]?: T[K] },
        > {
          object_originrev: tns.TypeOf<"int8">;
          object_sync: tns.TypeOf<"bool">;
          object_date: tns.TypeOf<"timestamptz">;
          object_seq: tns.TypeOf<"int8">;
          object_receiver: tns.TypeOf<"timestamptz">;
          object_collector_uid?: tns.TypeOf<"uuid">;
          object_transuid: tns.TypeOf<"uuid">;
          object_origincver: tns.TypeOf<"int8">;
          object_instant: tns.TypeOf<"timestamptz">;
          object_share_regclass: tns.TypeOf<"varchar">;
          object_sseq: tns.TypeOf<"int8">;
          object_status: tns.TypeOf<"int2">;
          object_uid: tns.TypeOf<"uuid">;
          object_outdate: tns.TypeOf<"bool">;
          object_cluster_receiver?: tns.TypeOf<"uuid">;
          object_originsseq: tns.TypeOf<"int8">;
          object_originver: tns.TypeOf<"int8">;
          object_ref: T["cluster.object.object_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.object.object_ref"];
          object_originsver: tns.TypeOf<"int8">;
          object_cluster_origin: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace cluster {
        export interface PropsTyped<
          T extends { [K in "cluster.cluster.cluster_configs"]?: T[K] },
        > {
          cluster_licenselife?: tns.TypeOf<"int2">;
          cluster_remote?: tns.TypeOf<"bool">;
          cluster_key?: tns.TypeOf<"text">;
          cluster_tperiod_id?: tns.TypeOf<"int2">;
          cluster_identifier?: tns.TypeOf<"varchar">;
          cluster_uid?: tns.TypeOf<"uuid">;
          cluster_license?: tns.TypeOf<"timestamp">;
          cluster_verbose?: tns.TypeOf<"bool">;
          cluster_configs?: T["cluster.cluster.cluster_configs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.cluster.cluster_configs"];
          cluster_sequence?: tns.TypeOf<"int8">;
          cluster_version?: tns.TypeOf<"int8">;
          cluster_type?: tns.TypeOf<"int2">;
          cluster_pid?: tns.TypeOf<"int4">;
          cluster_namespace?: tns.TypeOf<"varchar">;
          cluster_private?: tns.TypeOf<"text">;
          cluster_machineid?: tns.TypeOf<"text">;
          cluster_path?: tns.TypeOf<"varchar">;
          cluster_port?: tns.TypeOf<"varchar">;
          cluster_code?: tns.TypeOf<"varchar">;
          cluster_grants?: tns.TypeOf<"varchar">[];
          cluster_api?: tns.TypeOf<"varchar">;
          cluster_name?: tns.TypeOf<"varchar">;
          cluster_objectver?: tns.TypeOf<"int8">;
          cluster_tree?: tns.TypeOf<"int2">;
          cluster_domain?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "cluster.cluster.cluster_configs"]?: T[K] },
        > {
          cluster_remote: tns.TypeOf<"bool">;
          cluster_uid: tns.TypeOf<"uuid">;
          cluster_verbose: tns.TypeOf<"bool">;
          cluster_configs: T["cluster.cluster.cluster_configs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.cluster.cluster_configs"];
          cluster_sequence: tns.TypeOf<"int8">;
          cluster_version: tns.TypeOf<"int8">;
          cluster_grants: tns.TypeOf<"varchar">[];
          cluster_objectver: tns.TypeOf<"int8">;
          cluster_tree: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends { [K in "cluster.cluster.cluster_configs"]?: T[K] },
        > {
          cluster_licenselife?: tns.TypeOf<"int2">;
          cluster_remote: tns.TypeOf<"bool">;
          cluster_key?: tns.TypeOf<"text">;
          cluster_tperiod_id?: tns.TypeOf<"int2">;
          cluster_identifier?: tns.TypeOf<"varchar">;
          cluster_uid: tns.TypeOf<"uuid">;
          cluster_license?: tns.TypeOf<"timestamp">;
          cluster_verbose: tns.TypeOf<"bool">;
          cluster_configs: T["cluster.cluster.cluster_configs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.cluster.cluster_configs"];
          cluster_sequence: tns.TypeOf<"int8">;
          cluster_version: tns.TypeOf<"int8">;
          cluster_type?: tns.TypeOf<"int2">;
          cluster_pid?: tns.TypeOf<"int4">;
          cluster_namespace?: tns.TypeOf<"varchar">;
          cluster_private?: tns.TypeOf<"text">;
          cluster_machineid?: tns.TypeOf<"text">;
          cluster_path?: tns.TypeOf<"varchar">;
          cluster_port?: tns.TypeOf<"varchar">;
          cluster_code?: tns.TypeOf<"varchar">;
          cluster_grants: tns.TypeOf<"varchar">[];
          cluster_api?: tns.TypeOf<"varchar">;
          cluster_name?: tns.TypeOf<"varchar">;
          cluster_objectver: tns.TypeOf<"int8">;
          cluster_tree: tns.TypeOf<"int2">;
          cluster_domain?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace filter {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          filter_sequence?: tns.TypeOf<"int4">;
          filter_describe?: tns.TypeOf<"text">;
          filter_regclass?: tns.TypeOf<"varchar">;
          filter_regproc?: tns.TypeOf<"varchar">;
          filter_name?: tns.TypeOf<"varchar">;
          filter_id?: tns.TypeOf<"int4">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          filter_sequence: tns.TypeOf<"int4">;
          filter_regproc: tns.TypeOf<"varchar">;
          filter_id: tns.TypeOf<"int4">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          filter_sequence: tns.TypeOf<"int4">;
          filter_describe?: tns.TypeOf<"text">;
          filter_regclass?: tns.TypeOf<"varchar">;
          filter_regproc: tns.TypeOf<"varchar">;
          filter_name?: tns.TypeOf<"varchar">;
          filter_id: tns.TypeOf<"int4">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace _break {
        export interface PropsTyped<
          T extends {
            [K in
              | "cluster.break.break_current"
              | "cluster.break.break_metadata"
              | "cluster.break.break_change"
              | "cluster.break.break_document"
              | "cluster.break.break_object"
              | "cluster.break.break_ref"
              | "cluster.break.break_old"
              | "cluster.break.break_collector"]?: T[K];
          },
        > {
          break_current?: T["cluster.break.break_current"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_current"];
          break_message?: tns.TypeOf<"text">;
          break_uid?: tns.TypeOf<"uuid">;
          break_origin?: tns.TypeOf<"uuid">;
          break_context?: tns.TypeOf<"text">;
          break_detail?: tns.TypeOf<"text">;
          break_date?: tns.TypeOf<"timestamptz">;
          break_metadata?: T["cluster.break.break_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_metadata"];
          break_instant?: tns.TypeOf<"timestamptz">;
          break_receiver?: tns.TypeOf<"uuid">;
          break_change?: T["cluster.break.break_change"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_change"];
          break_document?: T["cluster.break.break_document"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_document"];
          break_object?: T["cluster.break.break_object"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_object"];
          break_regclass?: tns.TypeOf<"varchar">;
          break_ref?: T["cluster.break.break_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_ref"];
          break_sqlstate?: tns.TypeOf<"text">;
          break_hint?: tns.TypeOf<"text">;
          break_old?: T["cluster.break.break_old"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_old"];
          break_status?: tns.TypeOf<"int2">;
          break_collector?: T["cluster.break.break_collector"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_collector"];
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          break_uid: tns.TypeOf<"uuid">;
          break_date: tns.TypeOf<"timestamptz">;
          break_instant: tns.TypeOf<"timestamptz">;
          break_status: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "cluster.break.break_current"
              | "cluster.break.break_metadata"
              | "cluster.break.break_change"
              | "cluster.break.break_document"
              | "cluster.break.break_object"
              | "cluster.break.break_ref"
              | "cluster.break.break_old"
              | "cluster.break.break_collector"]?: T[K];
          },
        > {
          break_current?: T["cluster.break.break_current"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_current"];
          break_message?: tns.TypeOf<"text">;
          break_uid: tns.TypeOf<"uuid">;
          break_origin?: tns.TypeOf<"uuid">;
          break_context?: tns.TypeOf<"text">;
          break_detail?: tns.TypeOf<"text">;
          break_date: tns.TypeOf<"timestamptz">;
          break_metadata?: T["cluster.break.break_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_metadata"];
          break_instant: tns.TypeOf<"timestamptz">;
          break_receiver?: tns.TypeOf<"uuid">;
          break_change?: T["cluster.break.break_change"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_change"];
          break_document?: T["cluster.break.break_document"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_document"];
          break_object?: T["cluster.break.break_object"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_object"];
          break_regclass?: tns.TypeOf<"varchar">;
          break_ref?: T["cluster.break.break_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_ref"];
          break_sqlstate?: tns.TypeOf<"text">;
          break_hint?: tns.TypeOf<"text">;
          break_old?: T["cluster.break.break_old"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_old"];
          break_status: tns.TypeOf<"int2">;
          break_collector?: T["cluster.break.break_collector"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.break.break_collector"];
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace collector {
        export interface PropsTyped<
          T extends {
            [K in
              | "cluster.collector.collector_metaapply"
              | "cluster.collector.collector_remoteold"
              | "cluster.collector.collector_old"
              | "cluster.collector.collector_usechage"
              | "cluster.collector.collector_originold"
              | "cluster.collector.collector_metadata"
              | "cluster.collector.collector_changevalue"
              | "cluster.collector.collector_ref"]?: T[K];
          },
        > {
          collector_changes?: tns.TypeOf<"varchar">[];
          collector_order?: tns.TypeOf<"int8">;
          collector_metaapply?: T["cluster.collector.collector_metaapply"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_metaapply"];
          collector_sequence?: tns.TypeOf<"int8">;
          collector_pid?: tns.TypeOf<"int8">;
          collector_share_regclass?: tns.TypeOf<"varchar">;
          collector_date?: tns.TypeOf<"timestamptz">;
          collector_remoteold?: T["cluster.collector.collector_remoteold"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_remoteold"];
          collector_maxseq?: tns.TypeOf<"int8">;
          collector_old?: T["cluster.collector.collector_old"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_old"];
          collector_operation?: tns.TypeOf<"bpchar">;
          collector_transuid?: tns.TypeOf<"uuid">;
          collector_minseq?: tns.TypeOf<"int8">;
          collector_usechage?: T["cluster.collector.collector_usechage"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_usechage"];
          collector_originold?: T["cluster.collector.collector_originold"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_originold"];
          collector_version?: tns.TypeOf<"bool">;
          collector_metadata?: T["cluster.collector.collector_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_metadata"];
          collector_uid?: tns.TypeOf<"uuid">;
          collector_cluster_origin?: tns.TypeOf<"uuid">;
          collector_changevalue?: T["cluster.collector.collector_changevalue"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_changevalue"];
          collector_ref?: T["cluster.collector.collector_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_ref"];
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          collector_changes: tns.TypeOf<"varchar">[];
          collector_sequence: tns.TypeOf<"int8">;
          collector_share_regclass: tns.TypeOf<"varchar">;
          collector_date: tns.TypeOf<"timestamptz">;
          collector_transuid: tns.TypeOf<"uuid">;
          collector_version: tns.TypeOf<"bool">;
          collector_uid: tns.TypeOf<"uuid">;
          collector_cluster_origin: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "cluster.collector.collector_metaapply"
              | "cluster.collector.collector_remoteold"
              | "cluster.collector.collector_old"
              | "cluster.collector.collector_usechage"
              | "cluster.collector.collector_originold"
              | "cluster.collector.collector_metadata"
              | "cluster.collector.collector_changevalue"
              | "cluster.collector.collector_ref"]?: T[K];
          },
        > {
          collector_changes: tns.TypeOf<"varchar">[];
          collector_order?: tns.TypeOf<"int8">;
          collector_metaapply?: T["cluster.collector.collector_metaapply"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_metaapply"];
          collector_sequence: tns.TypeOf<"int8">;
          collector_pid?: tns.TypeOf<"int8">;
          collector_share_regclass: tns.TypeOf<"varchar">;
          collector_date: tns.TypeOf<"timestamptz">;
          collector_remoteold?: T["cluster.collector.collector_remoteold"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_remoteold"];
          collector_maxseq?: tns.TypeOf<"int8">;
          collector_old?: T["cluster.collector.collector_old"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_old"];
          collector_operation?: tns.TypeOf<"bpchar">;
          collector_transuid: tns.TypeOf<"uuid">;
          collector_minseq?: tns.TypeOf<"int8">;
          collector_usechage?: T["cluster.collector.collector_usechage"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_usechage"];
          collector_originold?: T["cluster.collector.collector_originold"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_originold"];
          collector_version: tns.TypeOf<"bool">;
          collector_metadata?: T["cluster.collector.collector_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_metadata"];
          collector_uid: tns.TypeOf<"uuid">;
          collector_cluster_origin: tns.TypeOf<"uuid">;
          collector_changevalue?: T["cluster.collector.collector_changevalue"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_changevalue"];
          collector_ref?: T["cluster.collector.collector_ref"] extends never
            ? tns.TypeOf<"jsonb">
            : T["cluster.collector.collector_ref"];
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace version {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          version_number?: tns.TypeOf<"int8">;
          version_uid?: tns.TypeOf<"uuid">;
          version_cluster_id?: tns.TypeOf<"uuid">;
          version_share_regclass?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          version_number: tns.TypeOf<"int8">;
          version_uid: tns.TypeOf<"uuid">;
          version_cluster_id: tns.TypeOf<"uuid">;
          version_share_regclass: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          version_number: tns.TypeOf<"int8">;
          version_uid: tns.TypeOf<"uuid">;
          version_cluster_id: tns.TypeOf<"uuid">;
          version_share_regclass: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace classmap {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          classname?: tns.TypeOf<"varchar">;
          classnameref?: tns.TypeOf<"varchar">;
          status?: tns.TypeOf<"int4">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          classname: tns.TypeOf<"varchar">;
          classnameref: tns.TypeOf<"varchar">;
          status: tns.TypeOf<"int4">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          classname: tns.TypeOf<"varchar">;
          classnameref: tns.TypeOf<"varchar">;
          status: tns.TypeOf<"int4">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace sequence {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          sub?: tns.TypeOf<"varchar">;
          sequence?: tns.TypeOf<"int8">;
          zerobase?: tns.TypeOf<"bool">;
          lpad_char?: tns.TypeOf<"bpchar">;
          name?: tns.TypeOf<"varchar">;
          lpad?: tns.TypeOf<"int4">;
          steep?: tns.TypeOf<"int4">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          sub: tns.TypeOf<"varchar">;
          sequence: tns.TypeOf<"int8">;
          zerobase: tns.TypeOf<"bool">;
          lpad_char: tns.TypeOf<"bpchar">;
          name: tns.TypeOf<"varchar">;
          lpad: tns.TypeOf<"int4">;
          steep: tns.TypeOf<"int4">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          sub: tns.TypeOf<"varchar">;
          sequence: tns.TypeOf<"int8">;
          zerobase: tns.TypeOf<"bool">;
          lpad_char: tns.TypeOf<"bpchar">;
          name: tns.TypeOf<"varchar">;
          lpad: tns.TypeOf<"int4">;
          steep: tns.TypeOf<"int4">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tperiod {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tperiod_id?: tns.TypeOf<"int2">;
          tperiod_label?: tns.TypeOf<"varchar">;
          tperiod_desc?: tns.TypeOf<"varchar">;
          tperiod_code?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tperiod_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tperiod_id: tns.TypeOf<"int2">;
          tperiod_label?: tns.TypeOf<"varchar">;
          tperiod_desc?: tns.TypeOf<"varchar">;
          tperiod_code?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace auth {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          auth_status?: tns.TypeOf<"int2">;
          auth_cluster_uid?: tns.TypeOf<"uuid">;
          auth_seq?: tns.TypeOf<"int8">;
          auth_key?: tns.TypeOf<"varchar">;
          auth_date?: tns.TypeOf<"timestamptz">;
          auth_close?: tns.TypeOf<"timestamptz">;
          auth_uid?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          auth_status: tns.TypeOf<"int2">;
          auth_seq: tns.TypeOf<"int8">;
          auth_date: tns.TypeOf<"timestamptz">;
          auth_uid: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          auth_status: tns.TypeOf<"int2">;
          auth_cluster_uid?: tns.TypeOf<"uuid">;
          auth_seq: tns.TypeOf<"int8">;
          auth_key?: tns.TypeOf<"varchar">;
          auth_date: tns.TypeOf<"timestamptz">;
          auth_close?: tns.TypeOf<"timestamptz">;
          auth_uid: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }
    }

    export namespace _Auth {
      export namespace session {
        export interface PropsTyped<
          T extends { [K in "auth.session.sess"]?: T[K] },
        > {
          sid?: tns.TypeOf<"varchar">;
          expire?: tns.TypeOf<"timestamp">;
          sess?: T["auth.session.sess"] extends never
            ? tns.TypeOf<"json">
            : T["auth.session.sess"];
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "auth.session.sess"]?: T[K] },
        > {
          sid: tns.TypeOf<"varchar">;
          expire: tns.TypeOf<"timestamp">;
          sess: T["auth.session.sess"] extends never
            ? tns.TypeOf<"json">
            : T["auth.session.sess"];
        }

        export interface EntryTyped<
          T extends { [K in "auth.session.sess"]?: T[K] },
        > {
          sid: tns.TypeOf<"varchar">;
          expire: tns.TypeOf<"timestamp">;
          sess: T["auth.session.sess"] extends never
            ? tns.TypeOf<"json">
            : T["auth.session.sess"];
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace acesso {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          acesso_colaborador_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          acesso_id?: tns.TypeOf<"uuid">;
          acesso_dataatualizacao?: tns.TypeOf<"timestamptz">;
          acesso_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          acesso_dataregisto?: tns.TypeOf<"timestamptz">;
          acesso_menu_id?: tns.TypeOf<"int2">;
          acesso_colaborador_propetario?: tns.TypeOf<"uuid">;
          acesso_estado?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          acesso_colaborador_id: tns.TypeOf<"uuid">;
          acesso_id: tns.TypeOf<"uuid">;
          acesso_dataregisto: tns.TypeOf<"timestamptz">;
          acesso_menu_id: tns.TypeOf<"int2">;
          acesso_colaborador_propetario: tns.TypeOf<"uuid">;
          acesso_estado: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          acesso_colaborador_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          acesso_id: tns.TypeOf<"uuid">;
          acesso_dataatualizacao?: tns.TypeOf<"timestamptz">;
          acesso_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          acesso_dataregisto: tns.TypeOf<"timestamptz">;
          acesso_menu_id: tns.TypeOf<"int2">;
          acesso_colaborador_propetario: tns.TypeOf<"uuid">;
          acesso_estado: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tsexo {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tsexo_codigo?: tns.TypeOf<"bpchar">;
          tsexo_nome?: tns.TypeOf<"varchar">;
          tsexo_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tsexo_codigo: tns.TypeOf<"bpchar">;
          tsexo_nome: tns.TypeOf<"varchar">;
          tsexo_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tsexo_codigo: tns.TypeOf<"bpchar">;
          tsexo_nome: tns.TypeOf<"varchar">;
          tsexo_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace privilegio {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          privilegio_id?: tns.TypeOf<"uuid">;
          privilegio_colaborador_id?: tns.TypeOf<"uuid">;
          privilegio_dataregisto?: tns.TypeOf<"timestamptz">;
          privilegio_dataatualuzacao?: tns.TypeOf<"timestamptz">;
          privilegio_estado?: tns.TypeOf<"int2">;
          previlegio_perfil_id?: tns.TypeOf<"uuid">;
          privilegio_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          privilegio_menu_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          privilegio_id: tns.TypeOf<"uuid">;
          privilegio_colaborador_id: tns.TypeOf<"uuid">;
          privilegio_dataregisto: tns.TypeOf<"timestamptz">;
          privilegio_estado: tns.TypeOf<"int2">;
          previlegio_perfil_id: tns.TypeOf<"uuid">;
          privilegio_menu_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          privilegio_id: tns.TypeOf<"uuid">;
          privilegio_colaborador_id: tns.TypeOf<"uuid">;
          privilegio_dataregisto: tns.TypeOf<"timestamptz">;
          privilegio_dataatualuzacao?: tns.TypeOf<"timestamptz">;
          privilegio_estado: tns.TypeOf<"int2">;
          previlegio_perfil_id: tns.TypeOf<"uuid">;
          privilegio_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          privilegio_menu_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace menu {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          menu_link?: tns.TypeOf<"varchar">;
          menu_nome?: tns.TypeOf<"varchar">;
          menu_menu_id?: tns.TypeOf<"int2">;
          menu_maxnode?: tns.TypeOf<"int2">;
          menu_icon?: tns.TypeOf<"varchar">;
          menu_codigo?: tns.TypeOf<"varchar">;
          menu_position?: tns.TypeOf<"int2">;
          menu_id?: tns.TypeOf<"int2">;
          menu_raiz?: tns.TypeOf<"varchar">;
          menu_directchildern?: tns.TypeOf<"int2">;
          menu_children?: tns.TypeOf<"int2">;
          menu_nivel?: tns.TypeOf<"int2">;
          menu_estado?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          menu_nome: tns.TypeOf<"varchar">;
          menu_maxnode: tns.TypeOf<"int2">;
          menu_codigo: tns.TypeOf<"varchar">;
          menu_position: tns.TypeOf<"int2">;
          menu_id: tns.TypeOf<"int2">;
          menu_raiz: tns.TypeOf<"varchar">;
          menu_directchildern: tns.TypeOf<"int2">;
          menu_children: tns.TypeOf<"int2">;
          menu_nivel: tns.TypeOf<"int2">;
          menu_estado: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          menu_link?: tns.TypeOf<"varchar">;
          menu_nome: tns.TypeOf<"varchar">;
          menu_menu_id?: tns.TypeOf<"int2">;
          menu_maxnode: tns.TypeOf<"int2">;
          menu_icon?: tns.TypeOf<"varchar">;
          menu_codigo: tns.TypeOf<"varchar">;
          menu_position: tns.TypeOf<"int2">;
          menu_id: tns.TypeOf<"int2">;
          menu_raiz: tns.TypeOf<"varchar">;
          menu_directchildern: tns.TypeOf<"int2">;
          menu_children: tns.TypeOf<"int2">;
          menu_nivel: tns.TypeOf<"int2">;
          menu_estado: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace colaborador {
        export interface PropsTyped<
          T extends { [K in "auth.colaborador.colaborador_ficha"]?: T[K] },
        > {
          colaborador_dataultimologin?: tns.TypeOf<"timestamptz">;
          colaborador_tokenlimit?: tns.TypeOf<"timestamptz">;
          colaborador_pinmodo?: tns.TypeOf<"int2">;
          colaborador_ficha?: T["auth.colaborador.colaborador_ficha"] extends never
            ? tns.TypeOf<"jsonb">
            : T["auth.colaborador.colaborador_ficha"];
          colaborador_estado?: tns.TypeOf<"int2">;
          colaborador_nif?: tns.TypeOf<"varchar">;
          colaborador_datanascimento?: tns.TypeOf<"date">;
          colaborador_tipo?: tns.TypeOf<"int2">;
          colaborador_accesso?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          colaborador_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          colaborador_senhamodo?: tns.TypeOf<"int2">;
          colaborador_pin?: tns.TypeOf<"varchar">;
          colaborador_foto?: tns.TypeOf<"varchar">;
          colaborador_dataregisto?: tns.TypeOf<"timestamptz">;
          colaborador_branch_uid?: tns.TypeOf<"uuid">;
          colaborador_id?: tns.TypeOf<"uuid">;
          colaborador_token?: tns.TypeOf<"varchar">;
          colaborador_colaborador_id?: tns.TypeOf<"uuid">;
          colaborador_nome?: tns.TypeOf<"varchar">;
          colaborador_espaco_auth?: tns.TypeOf<"uuid">;
          colaborador_dataatualizacao?: tns.TypeOf<"timestamptz">;
          colaborador_apelido?: tns.TypeOf<"varchar">;
          colaborador_dataultimaatualizacasenha?: tns.TypeOf<"timestamptz">;
          colaborador_tsexo_id?: tns.TypeOf<"int2">;
          colaborador_senha?: tns.TypeOf<"varchar">;
          colaborador_email?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          colaborador_estado: tns.TypeOf<"int2">;
          colaborador_tipo: tns.TypeOf<"int2">;
          colaborador_accesso: tns.TypeOf<"int2">;
          colaborador_dataregisto: tns.TypeOf<"timestamptz">;
          colaborador_id: tns.TypeOf<"uuid">;
          colaborador_colaborador_id: tns.TypeOf<"uuid">;
          colaborador_nome: tns.TypeOf<"varchar">;
          colaborador_email: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<
          T extends { [K in "auth.colaborador.colaborador_ficha"]?: T[K] },
        > {
          colaborador_dataultimologin?: tns.TypeOf<"timestamptz">;
          colaborador_tokenlimit?: tns.TypeOf<"timestamptz">;
          colaborador_pinmodo?: tns.TypeOf<"int2">;
          colaborador_ficha?: T["auth.colaborador.colaborador_ficha"] extends never
            ? tns.TypeOf<"jsonb">
            : T["auth.colaborador.colaborador_ficha"];
          colaborador_estado: tns.TypeOf<"int2">;
          colaborador_nif?: tns.TypeOf<"varchar">;
          colaborador_datanascimento?: tns.TypeOf<"date">;
          colaborador_tipo: tns.TypeOf<"int2">;
          colaborador_accesso: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          colaborador_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          colaborador_senhamodo?: tns.TypeOf<"int2">;
          colaborador_pin?: tns.TypeOf<"varchar">;
          colaborador_foto?: tns.TypeOf<"varchar">;
          colaborador_dataregisto: tns.TypeOf<"timestamptz">;
          colaborador_branch_uid?: tns.TypeOf<"uuid">;
          colaborador_id: tns.TypeOf<"uuid">;
          colaborador_token?: tns.TypeOf<"varchar">;
          colaborador_colaborador_id: tns.TypeOf<"uuid">;
          colaborador_nome: tns.TypeOf<"varchar">;
          colaborador_espaco_auth?: tns.TypeOf<"uuid">;
          colaborador_dataatualizacao?: tns.TypeOf<"timestamptz">;
          colaborador_apelido?: tns.TypeOf<"varchar">;
          colaborador_dataultimaatualizacasenha?: tns.TypeOf<"timestamptz">;
          colaborador_tsexo_id?: tns.TypeOf<"int2">;
          colaborador_senha?: tns.TypeOf<"varchar">;
          colaborador_email: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace perfil {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          perfil_dataatualizacao?: tns.TypeOf<"timestamptz">;
          perfil_perfil_id?: tns.TypeOf<"uuid">;
          perfil_colaborador_id?: tns.TypeOf<"uuid">;
          perfil_dataregisto?: tns.TypeOf<"timestamptz">;
          perfil_estado?: tns.TypeOf<"int2">;
          perfil_id?: tns.TypeOf<"uuid">;
          perfil_codigo?: tns.TypeOf<"varchar">;
          perfil_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          perfil_nome?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          perfil_colaborador_id: tns.TypeOf<"uuid">;
          perfil_dataregisto: tns.TypeOf<"timestamptz">;
          perfil_estado: tns.TypeOf<"int2">;
          perfil_id: tns.TypeOf<"uuid">;
          perfil_nome: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          perfil_dataatualizacao?: tns.TypeOf<"timestamptz">;
          perfil_perfil_id?: tns.TypeOf<"uuid">;
          perfil_colaborador_id: tns.TypeOf<"uuid">;
          perfil_dataregisto: tns.TypeOf<"timestamptz">;
          perfil_estado: tns.TypeOf<"int2">;
          perfil_id: tns.TypeOf<"uuid">;
          perfil_codigo?: tns.TypeOf<"varchar">;
          perfil_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          perfil_nome: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace autenticacao {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          autenticacao_dataregisto?: tns.TypeOf<"timestamptz">;
          autenticacao_estado?: tns.TypeOf<"int2">;
          autenticacao_dataatualizacao?: tns.TypeOf<"timestamptz">;
          autenticacao_id?: tns.TypeOf<"uuid">;
          autenticacao_colaborador_id?: tns.TypeOf<"uuid">;
          autenticacao_chave?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          autenticacao_dataregisto: tns.TypeOf<"timestamptz">;
          autenticacao_id: tns.TypeOf<"uuid">;
          autenticacao_colaborador_id: tns.TypeOf<"uuid">;
          autenticacao_chave: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          autenticacao_dataregisto: tns.TypeOf<"timestamptz">;
          autenticacao_estado?: tns.TypeOf<"int2">;
          autenticacao_dataatualizacao?: tns.TypeOf<"timestamptz">;
          autenticacao_id: tns.TypeOf<"uuid">;
          autenticacao_colaborador_id: tns.TypeOf<"uuid">;
          autenticacao_chave: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }
    }

    export namespace _Libdom {
      export namespace domsync {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          columnname?: tns.TypeOf<"varchar">;
          comment?: tns.TypeOf<"text">;
          classname?: tns.TypeOf<"varchar">;
          domain?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          columnname: tns.TypeOf<"varchar">;
          classname: tns.TypeOf<"varchar">;
          domain: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          columnname: tns.TypeOf<"varchar">;
          comment?: tns.TypeOf<"text">;
          classname: tns.TypeOf<"varchar">;
          domain: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace entryset {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          domain?: tns.TypeOf<"varchar">;
          value?: tns.TypeOf<"text">;
          editable?: tns.TypeOf<"bool">;
          comment?: tns.TypeOf<"varchar">;
          label?: tns.TypeOf<"varchar">;
          type?: tns.TypeOf<"regtype">;
          name?: tns.TypeOf<"char">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          value: tns.TypeOf<"text">;
          editable: tns.TypeOf<"bool">;
          type: tns.TypeOf<"regtype">;
          name: tns.TypeOf<"char">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          domain?: tns.TypeOf<"varchar">;
          value: tns.TypeOf<"text">;
          editable: tns.TypeOf<"bool">;
          comment?: tns.TypeOf<"varchar">;
          label?: tns.TypeOf<"varchar">;
          type: tns.TypeOf<"regtype">;
          name: tns.TypeOf<"char">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }
    }

    export namespace _Tweeks {
      export namespace movimento {
        export interface PropsTyped<
          T extends { [K in "tweeks.movimento.movimento_referencia"]?: T[K] },
        > {
          movimento_estado?: tns.TypeOf<"int2">;
          movimento_quantidadeinicia?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          movimento_valorstock?: tns.TypeOf<"float8">;
          movimento_valorout?: tns.TypeOf<"float8">;
          movimento_movimento_reference?: tns.TypeOf<"uuid">;
          movimento_documento?: tns.TypeOf<"varchar">;
          movimento_tmovimento_id?: tns.TypeOf<"int2">;
          movimento_espaco_auth?: tns.TypeOf<"uuid">;
          movimento_valorin?: tns.TypeOf<"float8">;
          movimento_artigo_in?: tns.TypeOf<"uuid">;
          movimento_espaco_in?: tns.TypeOf<"uuid">;
          movimento_quantidade?: tns.TypeOf<"float8">;
          movimento_artigo_out?: tns.TypeOf<"uuid">;
          movimento_dataatualizacao?: tns.TypeOf<"timestamptz">;
          movimento_refuid?: tns.TypeOf<"uuid">;
          movimento_observacao?: tns.TypeOf<"varchar">;
          movimento_data?: tns.TypeOf<"date">;
          movimento_toperacao_id?: tns.TypeOf<"int2">;
          movimento_colaborador_id?: tns.TypeOf<"uuid">;
          movimento_quantidadefinal?: tns.TypeOf<"float8">;
          movimento_referencia?: T["tweeks.movimento.movimento_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.movimento.movimento_referencia"];
          movimento_id?: tns.TypeOf<"uuid">;
          movimento_dataregistro?: tns.TypeOf<"timestamptz">;
          movimento_espaco_out?: tns.TypeOf<"uuid">;
          movimento_regclass?: tns.TypeOf<"regclass">;
          movimento_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          movimento_stock_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          movimento_estado: tns.TypeOf<"int2">;
          movimento_tmovimento_id: tns.TypeOf<"int2">;
          movimento_espaco_auth: tns.TypeOf<"uuid">;
          movimento_toperacao_id: tns.TypeOf<"int2">;
          movimento_colaborador_id: tns.TypeOf<"uuid">;
          movimento_id: tns.TypeOf<"uuid">;
          movimento_dataregistro: tns.TypeOf<"timestamptz">;
          movimento_stock_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.movimento.movimento_referencia"]?: T[K] },
        > {
          movimento_estado: tns.TypeOf<"int2">;
          movimento_quantidadeinicia?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          movimento_valorstock?: tns.TypeOf<"float8">;
          movimento_valorout?: tns.TypeOf<"float8">;
          movimento_movimento_reference?: tns.TypeOf<"uuid">;
          movimento_documento?: tns.TypeOf<"varchar">;
          movimento_tmovimento_id: tns.TypeOf<"int2">;
          movimento_espaco_auth: tns.TypeOf<"uuid">;
          movimento_valorin?: tns.TypeOf<"float8">;
          movimento_artigo_in?: tns.TypeOf<"uuid">;
          movimento_espaco_in?: tns.TypeOf<"uuid">;
          movimento_quantidade?: tns.TypeOf<"float8">;
          movimento_artigo_out?: tns.TypeOf<"uuid">;
          movimento_dataatualizacao?: tns.TypeOf<"timestamptz">;
          movimento_refuid?: tns.TypeOf<"uuid">;
          movimento_observacao?: tns.TypeOf<"varchar">;
          movimento_data?: tns.TypeOf<"date">;
          movimento_toperacao_id: tns.TypeOf<"int2">;
          movimento_colaborador_id: tns.TypeOf<"uuid">;
          movimento_quantidadefinal?: tns.TypeOf<"float8">;
          movimento_referencia?: T["tweeks.movimento.movimento_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.movimento.movimento_referencia"];
          movimento_id: tns.TypeOf<"uuid">;
          movimento_dataregistro: tns.TypeOf<"timestamptz">;
          movimento_espaco_out?: tns.TypeOf<"uuid">;
          movimento_regclass?: tns.TypeOf<"regclass">;
          movimento_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          movimento_stock_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace transacao {
        export interface PropsTyped<
          T extends { [K in "tweeks.transacao.transacao_referencia"]?: T[K] },
        > {
          transacao_colaborador_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          transacao_tmovimento_id?: tns.TypeOf<"int2">;
          transacao_zerar?: tns.TypeOf<"bool">;
          transacao_posto_id?: tns.TypeOf<"uuid">;
          transacao_referencia?: T["tweeks.transacao.transacao_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.transacao.transacao_referencia"];
          transacao_id?: tns.TypeOf<"uuid">;
          transacao_espaco_auth?: tns.TypeOf<"uuid">;
          transacao_documento?: tns.TypeOf<"varchar">;
          transacao_observacao?: tns.TypeOf<"varchar">;
          transacao_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          transacao_toperacao_id?: tns.TypeOf<"int2">;
          transacao_montantefinal?: tns.TypeOf<"float8">;
          transacao_estado?: tns.TypeOf<"int2">;
          transacao_dataatualizacao?: tns.TypeOf<"timestamptz">;
          transacao_montante?: tns.TypeOf<"float8">;
          transacao_montanteinicial?: tns.TypeOf<"float8">;
          transacao_dataregistro?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          transacao_colaborador_id: tns.TypeOf<"uuid">;
          transacao_tmovimento_id: tns.TypeOf<"int2">;
          transacao_zerar: tns.TypeOf<"bool">;
          transacao_posto_id: tns.TypeOf<"uuid">;
          transacao_id: tns.TypeOf<"uuid">;
          transacao_espaco_auth: tns.TypeOf<"uuid">;
          transacao_toperacao_id: tns.TypeOf<"int2">;
          transacao_montantefinal: tns.TypeOf<"float8">;
          transacao_estado: tns.TypeOf<"int2">;
          transacao_montante: tns.TypeOf<"float8">;
          transacao_montanteinicial: tns.TypeOf<"float8">;
          transacao_dataregistro: tns.TypeOf<"timestamptz">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.transacao.transacao_referencia"]?: T[K] },
        > {
          transacao_colaborador_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          transacao_tmovimento_id: tns.TypeOf<"int2">;
          transacao_zerar: tns.TypeOf<"bool">;
          transacao_posto_id: tns.TypeOf<"uuid">;
          transacao_referencia?: T["tweeks.transacao.transacao_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.transacao.transacao_referencia"];
          transacao_id: tns.TypeOf<"uuid">;
          transacao_espaco_auth: tns.TypeOf<"uuid">;
          transacao_documento?: tns.TypeOf<"varchar">;
          transacao_observacao?: tns.TypeOf<"varchar">;
          transacao_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          transacao_toperacao_id: tns.TypeOf<"int2">;
          transacao_montantefinal: tns.TypeOf<"float8">;
          transacao_estado: tns.TypeOf<"int2">;
          transacao_dataatualizacao?: tns.TypeOf<"timestamptz">;
          transacao_montante: tns.TypeOf<"float8">;
          transacao_montanteinicial: tns.TypeOf<"float8">;
          transacao_dataregistro: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace caixa {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          caixa_dataregistro?: tns.TypeOf<"timestamptz">;
          caixa_montantefechoposto?: tns.TypeOf<"float8">;
          caixa_quantidadecheque?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          caixa_montanteinicialposto?: tns.TypeOf<"float8">;
          caixa_montanteinicial?: tns.TypeOf<"float8">;
          caixa_dataatualizacao?: tns.TypeOf<"timestamptz">;
          caixa_espaco_auth?: tns.TypeOf<"uuid">;
          caixa_observacao?: tns.TypeOf<"varchar">;
          caixa_code?: tns.TypeOf<"varchar">;
          caixa_quantidadechequeposto?: tns.TypeOf<"int2">;
          caixa_estado?: tns.TypeOf<"int2">;
          caixa_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          caixa_montantefecho?: tns.TypeOf<"float8">;
          caixa_id?: tns.TypeOf<"uuid">;
          caixa_colaborador_id?: tns.TypeOf<"uuid">;
          caixa_posto_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          caixa_dataregistro: tns.TypeOf<"timestamptz">;
          caixa_montanteinicial: tns.TypeOf<"float8">;
          caixa_espaco_auth: tns.TypeOf<"uuid">;
          caixa_estado: tns.TypeOf<"int2">;
          caixa_id: tns.TypeOf<"uuid">;
          caixa_colaborador_id: tns.TypeOf<"uuid">;
          caixa_posto_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          caixa_dataregistro: tns.TypeOf<"timestamptz">;
          caixa_montantefechoposto?: tns.TypeOf<"float8">;
          caixa_quantidadecheque?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          caixa_montanteinicialposto?: tns.TypeOf<"float8">;
          caixa_montanteinicial: tns.TypeOf<"float8">;
          caixa_dataatualizacao?: tns.TypeOf<"timestamptz">;
          caixa_espaco_auth: tns.TypeOf<"uuid">;
          caixa_observacao?: tns.TypeOf<"varchar">;
          caixa_code?: tns.TypeOf<"varchar">;
          caixa_quantidadechequeposto?: tns.TypeOf<"int2">;
          caixa_estado: tns.TypeOf<"int2">;
          caixa_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          caixa_montantefecho?: tns.TypeOf<"float8">;
          caixa_id: tns.TypeOf<"uuid">;
          caixa_colaborador_id: tns.TypeOf<"uuid">;
          caixa_posto_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace trabalha {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          trabalha_dataregistro?: tns.TypeOf<"timestamptz">;
          trabalha_espaco_destino?: tns.TypeOf<"uuid">;
          trabalha_estado?: tns.TypeOf<"int2">;
          trabalha_espaco_auth?: tns.TypeOf<"uuid">;
          trabalha_id?: tns.TypeOf<"uuid">;
          trabalha_dataatualizacao?: tns.TypeOf<"timestamptz">;
          trabalha_colaborador_proprietario?: tns.TypeOf<"uuid">;
          trabalha_colaborador_id?: tns.TypeOf<"uuid">;
          trabalha_perfil_id?: tns.TypeOf<"uuid">;
          trabalha_posicao?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          trabalha_colaborador_atualizacao?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          trabalha_dataregistro: tns.TypeOf<"timestamptz">;
          trabalha_espaco_destino: tns.TypeOf<"uuid">;
          trabalha_estado: tns.TypeOf<"int2">;
          trabalha_espaco_auth: tns.TypeOf<"uuid">;
          trabalha_id: tns.TypeOf<"uuid">;
          trabalha_colaborador_proprietario: tns.TypeOf<"uuid">;
          trabalha_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          trabalha_dataregistro: tns.TypeOf<"timestamptz">;
          trabalha_espaco_destino: tns.TypeOf<"uuid">;
          trabalha_estado: tns.TypeOf<"int2">;
          trabalha_espaco_auth: tns.TypeOf<"uuid">;
          trabalha_id: tns.TypeOf<"uuid">;
          trabalha_dataatualizacao?: tns.TypeOf<"timestamptz">;
          trabalha_colaborador_proprietario: tns.TypeOf<"uuid">;
          trabalha_colaborador_id: tns.TypeOf<"uuid">;
          trabalha_perfil_id?: tns.TypeOf<"uuid">;
          trabalha_posicao?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          trabalha_colaborador_atualizacao?: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tserie {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tserie_code?: tns.TypeOf<"varchar">;
          tserie_desc?: tns.TypeOf<"varchar">;
          tserie_id?: tns.TypeOf<"int2">;
          tserie_financa?: tns.TypeOf<"varchar">;
          tserie_numlimit?: tns.TypeOf<"int2">;
          tserie_numlimitmin?: tns.TypeOf<"int4">;
          tserie_seqlimit?: tns.TypeOf<"int2">;
          tserie_order?: tns.TypeOf<"int4">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tserie_desc: tns.TypeOf<"varchar">;
          tserie_id: tns.TypeOf<"int2">;
          tserie_numlimit: tns.TypeOf<"int2">;
          tserie_seqlimit: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tserie_code?: tns.TypeOf<"varchar">;
          tserie_desc: tns.TypeOf<"varchar">;
          tserie_id: tns.TypeOf<"int2">;
          tserie_financa?: tns.TypeOf<"varchar">;
          tserie_numlimit: tns.TypeOf<"int2">;
          tserie_numlimitmin?: tns.TypeOf<"int4">;
          tserie_seqlimit: tns.TypeOf<"int2">;
          tserie_order?: tns.TypeOf<"int4">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace acerto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          acerto_colaborador_id?: tns.TypeOf<"uuid">;
          acerto_correcao?: tns.TypeOf<"float8">;
          acerto_quantidadeinicial?: tns.TypeOf<"float8">;
          acerto_estado?: tns.TypeOf<"int2">;
          acerto_espaco_id?: tns.TypeOf<"uuid">;
          acerto_oprgroup?: tns.TypeOf<"uuid">;
          acerto_observacao?: tns.TypeOf<"varchar">;
          acerto_codigo?: tns.TypeOf<"varchar">;
          acerto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          acerto_id?: tns.TypeOf<"uuid">;
          acerto_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          acerto_dataatualizacao?: tns.TypeOf<"timestamptz">;
          acerto_artigo_id?: tns.TypeOf<"uuid">;
          acerto_espaco_auth?: tns.TypeOf<"uuid">;
          acerto_quantidade?: tns.TypeOf<"float8">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          acerto_colaborador_id: tns.TypeOf<"uuid">;
          acerto_correcao: tns.TypeOf<"float8">;
          acerto_quantidadeinicial: tns.TypeOf<"float8">;
          acerto_estado: tns.TypeOf<"int2">;
          acerto_espaco_id: tns.TypeOf<"uuid">;
          acerto_oprgroup: tns.TypeOf<"uuid">;
          acerto_id: tns.TypeOf<"uuid">;
          acerto_dataregistro: tns.TypeOf<"timestamptz">;
          acerto_espaco_auth: tns.TypeOf<"uuid">;
          acerto_quantidade: tns.TypeOf<"float8">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          acerto_colaborador_id: tns.TypeOf<"uuid">;
          acerto_correcao: tns.TypeOf<"float8">;
          acerto_quantidadeinicial: tns.TypeOf<"float8">;
          acerto_estado: tns.TypeOf<"int2">;
          acerto_espaco_id: tns.TypeOf<"uuid">;
          acerto_oprgroup: tns.TypeOf<"uuid">;
          acerto_observacao?: tns.TypeOf<"varchar">;
          acerto_codigo?: tns.TypeOf<"varchar">;
          acerto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          acerto_id: tns.TypeOf<"uuid">;
          acerto_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          acerto_dataatualizacao?: tns.TypeOf<"timestamptz">;
          acerto_artigo_id?: tns.TypeOf<"uuid">;
          acerto_espaco_auth: tns.TypeOf<"uuid">;
          acerto_quantidade: tns.TypeOf<"float8">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace taplicar {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          taplicar_descricao?: tns.TypeOf<"varchar">;
          taplicar_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          taplicar_descricao: tns.TypeOf<"varchar">;
          taplicar_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          taplicar_descricao: tns.TypeOf<"varchar">;
          taplicar_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace toperacao {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          toperacao_code?: tns.TypeOf<"varchar">;
          toperacao_designacao?: tns.TypeOf<"varchar">;
          toperacao_classe?: tns.TypeOf<"int2">;
          toperacao_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          toperacao_classe: tns.TypeOf<"int2">;
          toperacao_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          toperacao_code?: tns.TypeOf<"varchar">;
          toperacao_designacao?: tns.TypeOf<"varchar">;
          toperacao_classe: tns.TypeOf<"int2">;
          toperacao_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tlancamento {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tlancamento_id?: tns.TypeOf<"int2">;
          tlancamento_desc?: tns.TypeOf<"varchar">;
          tlancamento_operacao?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tlancamento_id: tns.TypeOf<"int2">;
          tlancamento_desc: tns.TypeOf<"varchar">;
          tlancamento_operacao: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tlancamento_id: tns.TypeOf<"int2">;
          tlancamento_desc: tns.TypeOf<"varchar">;
          tlancamento_operacao: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tipoimposto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tipoimposto_dataregistro?: tns.TypeOf<"timestamptz">;
          tipoimposto_dataatuzaliacao?: tns.TypeOf<"timestamptz">;
          tipoimposto_colaborador_id?: tns.TypeOf<"uuid">;
          tipoimposto_codigo?: tns.TypeOf<"varchar">;
          tipoimposto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          tipoimposto_id?: tns.TypeOf<"uuid">;
          tipoimposto_percentagem?: tns.TypeOf<"float8">;
          tipoimposto_estado?: tns.TypeOf<"int2">;
          tipoimposto_nome?: tns.TypeOf<"varchar">;
          tipoimposto_valor?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          tipoimposto_espaco_auth?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tipoimposto_dataregistro: tns.TypeOf<"timestamptz">;
          tipoimposto_colaborador_id: tns.TypeOf<"uuid">;
          tipoimposto_codigo: tns.TypeOf<"varchar">;
          tipoimposto_id: tns.TypeOf<"uuid">;
          tipoimposto_estado: tns.TypeOf<"int2">;
          tipoimposto_nome: tns.TypeOf<"varchar">;
          tipoimposto_espaco_auth: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tipoimposto_dataregistro: tns.TypeOf<"timestamptz">;
          tipoimposto_dataatuzaliacao?: tns.TypeOf<"timestamptz">;
          tipoimposto_colaborador_id: tns.TypeOf<"uuid">;
          tipoimposto_codigo: tns.TypeOf<"varchar">;
          tipoimposto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          tipoimposto_id: tns.TypeOf<"uuid">;
          tipoimposto_percentagem?: tns.TypeOf<"float8">;
          tipoimposto_estado: tns.TypeOf<"int2">;
          tipoimposto_nome: tns.TypeOf<"varchar">;
          tipoimposto_valor?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          tipoimposto_espaco_auth: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace dispoe {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          dispoe_dataatualizacao?: tns.TypeOf<"timestamptz">;
          dispoe_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          dispoe_colaborador_id?: tns.TypeOf<"uuid">;
          dispoe_dataregistro?: tns.TypeOf<"timestamptz">;
          dispoe_estado?: tns.TypeOf<"int2">;
          dispoe_artigo_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          dispoe_espaco_auth?: tns.TypeOf<"uuid">;
          dispoe_id?: tns.TypeOf<"uuid">;
          dispoe_artigo_item?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          dispoe_colaborador_id: tns.TypeOf<"uuid">;
          dispoe_dataregistro: tns.TypeOf<"timestamptz">;
          dispoe_estado: tns.TypeOf<"int2">;
          dispoe_artigo_id: tns.TypeOf<"uuid">;
          dispoe_espaco_auth: tns.TypeOf<"uuid">;
          dispoe_id: tns.TypeOf<"uuid">;
          dispoe_artigo_item: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          dispoe_dataatualizacao?: tns.TypeOf<"timestamptz">;
          dispoe_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          dispoe_colaborador_id: tns.TypeOf<"uuid">;
          dispoe_dataregistro: tns.TypeOf<"timestamptz">;
          dispoe_estado: tns.TypeOf<"int2">;
          dispoe_artigo_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          dispoe_espaco_auth: tns.TypeOf<"uuid">;
          dispoe_id: tns.TypeOf<"uuid">;
          dispoe_artigo_item: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tatividade {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tatividade_id?: tns.TypeOf<"int4">;
          tatividade_operation?: tns.TypeOf<"varchar">;
          tatividade_desc?: tns.TypeOf<"varchar">;
          tatividade_code?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tatividade_id: tns.TypeOf<"int4">;
          tatividade_operation: tns.TypeOf<"varchar">;
          tatividade_desc: tns.TypeOf<"varchar">;
          tatividade_code: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tatividade_id: tns.TypeOf<"int4">;
          tatividade_operation: tns.TypeOf<"varchar">;
          tatividade_desc: tns.TypeOf<"varchar">;
          tatividade_code: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace retalho {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          retalho_composicao?: tns.TypeOf<"float8">;
          retalho_artigo_composto?: tns.TypeOf<"uuid">;
          retalho_quantidade?: tns.TypeOf<"float8">;
          retalho_dataatualizacao?: tns.TypeOf<"timestamptz">;
          retalho_id?: tns.TypeOf<"uuid">;
          retalho_total?: tns.TypeOf<"float8">;
          retalho_estado?: tns.TypeOf<"int2">;
          retalho_espaco_auth?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          retalho_artigo_base?: tns.TypeOf<"uuid">;
          retalho_dataregistro?: tns.TypeOf<"timestamptz">;
          retalho_colaborador_id?: tns.TypeOf<"uuid">;
          retalho_codigo?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          retalho_composicao: tns.TypeOf<"float8">;
          retalho_artigo_composto: tns.TypeOf<"uuid">;
          retalho_quantidade: tns.TypeOf<"float8">;
          retalho_id: tns.TypeOf<"uuid">;
          retalho_total: tns.TypeOf<"float8">;
          retalho_estado: tns.TypeOf<"int2">;
          retalho_espaco_auth: tns.TypeOf<"uuid">;
          retalho_artigo_base: tns.TypeOf<"uuid">;
          retalho_dataregistro: tns.TypeOf<"timestamptz">;
          retalho_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          retalho_composicao: tns.TypeOf<"float8">;
          retalho_artigo_composto: tns.TypeOf<"uuid">;
          retalho_quantidade: tns.TypeOf<"float8">;
          retalho_dataatualizacao?: tns.TypeOf<"timestamptz">;
          retalho_id: tns.TypeOf<"uuid">;
          retalho_total: tns.TypeOf<"float8">;
          retalho_estado: tns.TypeOf<"int2">;
          retalho_espaco_auth: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          retalho_artigo_base: tns.TypeOf<"uuid">;
          retalho_dataregistro: tns.TypeOf<"timestamptz">;
          retalho_colaborador_id: tns.TypeOf<"uuid">;
          retalho_codigo?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace cliente {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.cliente.cliente_contactos"
              | "tweeks.cliente.cliente_metadata"]?: T[K];
          },
        > {
          cliente_estado?: tns.TypeOf<"int2">;
          cliente_documento?: tns.TypeOf<"varchar">;
          cliente_titular?: tns.TypeOf<"varchar">;
          cliente_contactos?: T["tweeks.cliente.cliente_contactos"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_contactos"];
          cliente_mail?: tns.TypeOf<"varchar">;
          cliente_colaborador_id?: tns.TypeOf<"uuid">;
          cliente_nif?: tns.TypeOf<"varchar">;
          cliente_dataregistro?: tns.TypeOf<"timestamptz">;
          cliente_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          cliente_tdocument_id?: tns.TypeOf<"int2">;
          cliente_espaco_auth?: tns.TypeOf<"uuid">;
          cliente_dataatualizacao?: tns.TypeOf<"timestamptz">;
          cliente_metadata?: T["tweeks.cliente.cliente_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_metadata"];
          cliente_colaborador_gerente?: tns.TypeOf<"uuid">;
          cliente_code?: tns.TypeOf<"varchar">;
          cliente_colaborador_atualizacao?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends {
            [K in
              | "tweeks.cliente.cliente_contactos"
              | "tweeks.cliente.cliente_metadata"]?: T[K];
          },
        > {
          cliente_estado: tns.TypeOf<"int2">;
          cliente_titular: tns.TypeOf<"varchar">;
          cliente_contactos: T["tweeks.cliente.cliente_contactos"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_contactos"];
          cliente_colaborador_id: tns.TypeOf<"uuid">;
          cliente_dataregistro: tns.TypeOf<"timestamptz">;
          cliente_id: tns.TypeOf<"uuid">;
          cliente_espaco_auth: tns.TypeOf<"uuid">;
          cliente_metadata: T["tweeks.cliente.cliente_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_metadata"];
          cliente_code: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.cliente.cliente_contactos"
              | "tweeks.cliente.cliente_metadata"]?: T[K];
          },
        > {
          cliente_estado: tns.TypeOf<"int2">;
          cliente_documento?: tns.TypeOf<"varchar">;
          cliente_titular: tns.TypeOf<"varchar">;
          cliente_contactos: T["tweeks.cliente.cliente_contactos"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_contactos"];
          cliente_mail?: tns.TypeOf<"varchar">;
          cliente_colaborador_id: tns.TypeOf<"uuid">;
          cliente_nif?: tns.TypeOf<"varchar">;
          cliente_dataregistro: tns.TypeOf<"timestamptz">;
          cliente_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          cliente_tdocument_id?: tns.TypeOf<"int2">;
          cliente_espaco_auth: tns.TypeOf<"uuid">;
          cliente_dataatualizacao?: tns.TypeOf<"timestamptz">;
          cliente_metadata: T["tweeks.cliente.cliente_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.cliente.cliente_metadata"];
          cliente_colaborador_gerente?: tns.TypeOf<"uuid">;
          cliente_code: tns.TypeOf<"varchar">;
          cliente_colaborador_atualizacao?: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace unit {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          unit_date?: tns.TypeOf<"timestamptz">;
          unit_code?: tns.TypeOf<"varchar">;
          unit_state?: tns.TypeOf<"int2">;
          _branch_uid?: tns.TypeOf<"uuid">;
          unit_update?: tns.TypeOf<"timestamptz">;
          unit_user_update?: tns.TypeOf<"uuid">;
          unit_user_id?: tns.TypeOf<"uuid">;
          unit_base?: tns.TypeOf<"uuid">;
          unit_id?: tns.TypeOf<"uuid">;
          unit_name?: tns.TypeOf<"varchar">;
          unit_espaco_auth?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          unit_date: tns.TypeOf<"timestamptz">;
          unit_code: tns.TypeOf<"varchar">;
          unit_state: tns.TypeOf<"int2">;
          _branch_uid: tns.TypeOf<"uuid">;
          unit_user_id: tns.TypeOf<"uuid">;
          unit_id: tns.TypeOf<"uuid">;
          unit_name: tns.TypeOf<"varchar">;
          unit_espaco_auth: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          unit_date: tns.TypeOf<"timestamptz">;
          unit_code: tns.TypeOf<"varchar">;
          unit_state: tns.TypeOf<"int2">;
          _branch_uid: tns.TypeOf<"uuid">;
          unit_update?: tns.TypeOf<"timestamptz">;
          unit_user_update?: tns.TypeOf<"uuid">;
          unit_user_id: tns.TypeOf<"uuid">;
          unit_base?: tns.TypeOf<"uuid">;
          unit_id: tns.TypeOf<"uuid">;
          unit_name: tns.TypeOf<"varchar">;
          unit_espaco_auth: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tgrupo {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tgrupo_desc?: tns.TypeOf<"varchar">;
          tgrupo_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tgrupo_desc: tns.TypeOf<"varchar">;
          tgrupo_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tgrupo_desc: tns.TypeOf<"varchar">;
          tgrupo_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace chave {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          chave_definitiva?: tns.TypeOf<"varchar">;
          chave_descricao?: tns.TypeOf<"varchar">;
          chave_date?: tns.TypeOf<"timestamptz">;
          chave_temporarai?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          chave_date: tns.TypeOf<"timestamptz">;
          chave_temporarai: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          chave_definitiva?: tns.TypeOf<"varchar">;
          chave_descricao?: tns.TypeOf<"varchar">;
          chave_date: tns.TypeOf<"timestamptz">;
          chave_temporarai: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace espaco {
        export interface PropsTyped<
          T extends { [K in "tweeks.espaco.espaco_configuracao"]?: T[K] },
        > {
          espaco_dataatualizacao?: tns.TypeOf<"timestamptz">;
          espaco_vender?: tns.TypeOf<"varchar">;
          espaco_descricao?: tns.TypeOf<"varchar">;
          espaco_codigo?: tns.TypeOf<"varchar">;
          espaco_serieconta?: tns.TypeOf<"int4">;
          espaco_colaborador_id?: tns.TypeOf<"uuid">;
          espaco_nome?: tns.TypeOf<"varchar">;
          espaco_branch_uid?: tns.TypeOf<"uuid">;
          espaco_espaco_auth?: tns.TypeOf<"uuid">;
          espaco_estado?: tns.TypeOf<"int2">;
          espaco_colaborador_atualizaco?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          espaco_seriedeposito?: tns.TypeOf<"int8">;
          espaco_espaco_id?: tns.TypeOf<"uuid">;
          espaco_configuracao?: T["tweeks.espaco.espaco_configuracao"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.espaco.espaco_configuracao"];
          espaco_gerarfatura?: tns.TypeOf<"bool">;
          espaco_configurar?: tns.TypeOf<"bool">;
          espaco_seriefatura?: tns.TypeOf<"int4">;
          espaco_posto_admin?: tns.TypeOf<"uuid">;
          espaco_dataregistro?: tns.TypeOf<"timestamptz">;
          espaco_id?: tns.TypeOf<"uuid">;
          espaco_faturaano?: tns.TypeOf<"int2">;
          espaco_nivel?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          espaco_codigo: tns.TypeOf<"varchar">;
          espaco_serieconta: tns.TypeOf<"int4">;
          espaco_colaborador_id: tns.TypeOf<"uuid">;
          espaco_estado: tns.TypeOf<"int2">;
          espaco_seriedeposito: tns.TypeOf<"int8">;
          espaco_gerarfatura: tns.TypeOf<"bool">;
          espaco_configurar: tns.TypeOf<"bool">;
          espaco_seriefatura: tns.TypeOf<"int4">;
          espaco_dataregistro: tns.TypeOf<"timestamptz">;
          espaco_id: tns.TypeOf<"uuid">;
          espaco_faturaano: tns.TypeOf<"int2">;
          espaco_nivel: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.espaco.espaco_configuracao"]?: T[K] },
        > {
          espaco_dataatualizacao?: tns.TypeOf<"timestamptz">;
          espaco_vender?: tns.TypeOf<"varchar">;
          espaco_descricao?: tns.TypeOf<"varchar">;
          espaco_codigo: tns.TypeOf<"varchar">;
          espaco_serieconta: tns.TypeOf<"int4">;
          espaco_colaborador_id: tns.TypeOf<"uuid">;
          espaco_nome?: tns.TypeOf<"varchar">;
          espaco_branch_uid?: tns.TypeOf<"uuid">;
          espaco_espaco_auth?: tns.TypeOf<"uuid">;
          espaco_estado: tns.TypeOf<"int2">;
          espaco_colaborador_atualizaco?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          espaco_seriedeposito: tns.TypeOf<"int8">;
          espaco_espaco_id?: tns.TypeOf<"uuid">;
          espaco_configuracao?: T["tweeks.espaco.espaco_configuracao"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.espaco.espaco_configuracao"];
          espaco_gerarfatura: tns.TypeOf<"bool">;
          espaco_configurar: tns.TypeOf<"bool">;
          espaco_seriefatura: tns.TypeOf<"int4">;
          espaco_posto_admin?: tns.TypeOf<"uuid">;
          espaco_dataregistro: tns.TypeOf<"timestamptz">;
          espaco_id: tns.TypeOf<"uuid">;
          espaco_faturaano: tns.TypeOf<"int2">;
          espaco_nivel: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace atividade {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.atividade.atividade_props"
              | "tweeks.atividade.atividade_referer"]?: T[K];
          },
        > {
          atividade_uid?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          atividade_estado?: tns.TypeOf<"int2">;
          atividade_props?: T["tweeks.atividade.atividade_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.atividade.atividade_props"];
          atividade_title?: tns.TypeOf<"varchar">;
          atividade_referer?: T["tweeks.atividade.atividade_referer"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.atividade.atividade_referer"];
          atividade_tatividade_id?: tns.TypeOf<"int4">;
          atividade_description?: tns.TypeOf<"varchar">;
          atividate_date?: tns.TypeOf<"timestamptz">;
          atividade_atividadeoperacao_id?: tns.TypeOf<"uuid">;
          atividade_user_uid?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "tweeks.atividade.atividade_props"]?: T[K] },
        > {
          atividade_uid: tns.TypeOf<"uuid">;
          _branch_uid: tns.TypeOf<"uuid">;
          atividade_estado: tns.TypeOf<"int2">;
          atividade_props: T["tweeks.atividade.atividade_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.atividade.atividade_props"];
          atividade_title: tns.TypeOf<"varchar">;
          atividade_tatividade_id: tns.TypeOf<"int4">;
          atividate_date: tns.TypeOf<"timestamptz">;
          atividade_atividadeoperacao_id: tns.TypeOf<"uuid">;
          atividade_user_uid: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.atividade.atividade_props"
              | "tweeks.atividade.atividade_referer"]?: T[K];
          },
        > {
          atividade_uid: tns.TypeOf<"uuid">;
          _branch_uid: tns.TypeOf<"uuid">;
          atividade_estado: tns.TypeOf<"int2">;
          atividade_props: T["tweeks.atividade.atividade_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.atividade.atividade_props"];
          atividade_title: tns.TypeOf<"varchar">;
          atividade_referer?: T["tweeks.atividade.atividade_referer"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.atividade.atividade_referer"];
          atividade_tatividade_id: tns.TypeOf<"int4">;
          atividade_description?: tns.TypeOf<"varchar">;
          atividate_date: tns.TypeOf<"timestamptz">;
          atividade_atividadeoperacao_id: tns.TypeOf<"uuid">;
          atividade_user_uid: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace deposito {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.deposito.deposito_serie"
              | "tweeks.deposito.deposito_referencia"]?: T[K];
          },
        > {
          deposito_estado?: tns.TypeOf<"int2">;
          deposito_tpaga_id?: tns.TypeOf<"int2">;
          deposito_taxacambio?: tns.TypeOf<"float8">;
          deposito_montantetroco?: tns.TypeOf<"float8">;
          deposito_espaco_auth?: tns.TypeOf<"uuid">;
          deposito_dataatualizacao?: tns.TypeOf<"timestamptz">;
          deposito_montante?: tns.TypeOf<"float8">;
          deposito_serie?: T["tweeks.deposito.deposito_serie"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.deposito.deposito_serie"];
          deposito_colaborador_id?: tns.TypeOf<"uuid">;
          deposito_currency_id?: tns.TypeOf<"int2">;
          deposito_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          deposito_caixa_id?: tns.TypeOf<"uuid">;
          _tgrupo_id?: tns.TypeOf<"int2">;
          deposito_id?: tns.TypeOf<"uuid">;
          deposito_montantefinal?: tns.TypeOf<"float8">;
          deposito_montantemoeda?: tns.TypeOf<"float8">;
          deposito_observacao?: tns.TypeOf<"varchar">;
          deposito_cliente_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          deposito_documento?: tns.TypeOf<"varchar">;
          deposito_data?: tns.TypeOf<"date">;
          deposito_posto_id?: tns.TypeOf<"uuid">;
          deposito_docref?: tns.TypeOf<"varchar">;
          deposito_dataregistro?: tns.TypeOf<"timestamptz">;
          deposito_serie_id?: tns.TypeOf<"uuid">;
          deposito_referencia?: T["tweeks.deposito.deposito_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.deposito.deposito_referencia"];
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          deposito_estado: tns.TypeOf<"int2">;
          deposito_tpaga_id: tns.TypeOf<"int2">;
          deposito_montantetroco: tns.TypeOf<"float8">;
          deposito_espaco_auth: tns.TypeOf<"uuid">;
          deposito_montante: tns.TypeOf<"float8">;
          deposito_colaborador_id: tns.TypeOf<"uuid">;
          deposito_currency_id: tns.TypeOf<"int2">;
          _tgrupo_id: tns.TypeOf<"int2">;
          deposito_id: tns.TypeOf<"uuid">;
          deposito_cliente_id: tns.TypeOf<"uuid">;
          deposito_documento: tns.TypeOf<"varchar">;
          deposito_data: tns.TypeOf<"date">;
          deposito_dataregistro: tns.TypeOf<"timestamptz">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.deposito.deposito_serie"
              | "tweeks.deposito.deposito_referencia"]?: T[K];
          },
        > {
          deposito_estado: tns.TypeOf<"int2">;
          deposito_tpaga_id: tns.TypeOf<"int2">;
          deposito_taxacambio?: tns.TypeOf<"float8">;
          deposito_montantetroco: tns.TypeOf<"float8">;
          deposito_espaco_auth: tns.TypeOf<"uuid">;
          deposito_dataatualizacao?: tns.TypeOf<"timestamptz">;
          deposito_montante: tns.TypeOf<"float8">;
          deposito_serie?: T["tweeks.deposito.deposito_serie"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.deposito.deposito_serie"];
          deposito_colaborador_id: tns.TypeOf<"uuid">;
          deposito_currency_id: tns.TypeOf<"int2">;
          deposito_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          deposito_caixa_id?: tns.TypeOf<"uuid">;
          _tgrupo_id: tns.TypeOf<"int2">;
          deposito_id: tns.TypeOf<"uuid">;
          deposito_montantefinal?: tns.TypeOf<"float8">;
          deposito_montantemoeda?: tns.TypeOf<"float8">;
          deposito_observacao?: tns.TypeOf<"varchar">;
          deposito_cliente_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          deposito_documento: tns.TypeOf<"varchar">;
          deposito_data: tns.TypeOf<"date">;
          deposito_posto_id?: tns.TypeOf<"uuid">;
          deposito_docref?: tns.TypeOf<"varchar">;
          deposito_dataregistro: tns.TypeOf<"timestamptz">;
          deposito_serie_id?: tns.TypeOf<"uuid">;
          deposito_referencia?: T["tweeks.deposito.deposito_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.deposito.deposito_referencia"];
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace conta {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.conta.conta_proformaextras"
              | "tweeks.conta.conta_mesa"
              | "tweeks.conta.conta_extension"
              | "tweeks.conta.conta_serie"
              | "tweeks.conta.conta_props"]?: T[K];
          },
        > {
          conta_serie_id?: tns.TypeOf<"uuid">;
          conta_titularnif?: tns.TypeOf<"varchar">;
          conta_observacao?: tns.TypeOf<"varchar">;
          conta_titular?: tns.TypeOf<"varchar">;
          conta_estado?: tns.TypeOf<"int2">;
          conta_currency_id?: tns.TypeOf<"int2">;
          conta_numero?: tns.TypeOf<"int4">;
          conta_desconto?: tns.TypeOf<"float8">;
          conta_datedocorigin?: tns.TypeOf<"date">;
          conta_montante?: tns.TypeOf<"float8">;
          conta_cambio_uid?: tns.TypeOf<"uuid">;
          conta_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          conta_posto_fecho?: tns.TypeOf<"uuid">;
          conta_dataregistro?: tns.TypeOf<"timestamptz">;
          conta_cliente_id?: tns.TypeOf<"uuid">;
          conta_datafecho?: tns.TypeOf<"timestamptz">;
          conta_espaco_auth?: tns.TypeOf<"uuid">;
          conta_proformaextras?: T["tweeks.conta.conta_proformaextras"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_proformaextras"];
          conta_numerofatura?: tns.TypeOf<"varchar">;
          conta_chave?: tns.TypeOf<"varchar">;
          conta_posto_id?: tns.TypeOf<"uuid">;
          conta_colaborador_fecho?: tns.TypeOf<"uuid">;
          conta_taxacambio?: tns.TypeOf<"float8">;
          conta_mesa?: T["tweeks.conta.conta_mesa"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.conta.conta_mesa"];
          conta_extension?: T["tweeks.conta.conta_extension"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_extension"];
          _tgrupo_id?: tns.TypeOf<"int2">;
          conta_conta_docorigin?: tns.TypeOf<"uuid">;
          conta_serie?: T["tweeks.conta.conta_serie"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.conta.conta_serie"];
          conta_proforma?: tns.TypeOf<"bool">;
          conta_colaborador_id?: tns.TypeOf<"uuid">;
          conta_imprensa?: tns.TypeOf<"int2">;
          conta_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          conta_id?: tns.TypeOf<"uuid">;
          conta_props?: T["tweeks.conta.conta_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_props"];
          conta_proformavencimento?: tns.TypeOf<"date">;
          conta_docorigin?: tns.TypeOf<"varchar">;
          conta_tserie_id?: tns.TypeOf<"int2">;
          conta_data?: tns.TypeOf<"date">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "tweeks.conta.conta_extension"]?: T[K] },
        > {
          conta_estado: tns.TypeOf<"int2">;
          conta_numero: tns.TypeOf<"int4">;
          conta_desconto: tns.TypeOf<"float8">;
          conta_montante: tns.TypeOf<"float8">;
          conta_dataregistro: tns.TypeOf<"timestamptz">;
          conta_espaco_auth: tns.TypeOf<"uuid">;
          conta_extension: T["tweeks.conta.conta_extension"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_extension"];
          conta_colaborador_id: tns.TypeOf<"uuid">;
          conta_imprensa: tns.TypeOf<"int2">;
          conta_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.conta.conta_proformaextras"
              | "tweeks.conta.conta_mesa"
              | "tweeks.conta.conta_extension"
              | "tweeks.conta.conta_serie"
              | "tweeks.conta.conta_props"]?: T[K];
          },
        > {
          conta_serie_id?: tns.TypeOf<"uuid">;
          conta_titularnif?: tns.TypeOf<"varchar">;
          conta_observacao?: tns.TypeOf<"varchar">;
          conta_titular?: tns.TypeOf<"varchar">;
          conta_estado: tns.TypeOf<"int2">;
          conta_currency_id?: tns.TypeOf<"int2">;
          conta_numero: tns.TypeOf<"int4">;
          conta_desconto: tns.TypeOf<"float8">;
          conta_datedocorigin?: tns.TypeOf<"date">;
          conta_montante: tns.TypeOf<"float8">;
          conta_cambio_uid?: tns.TypeOf<"uuid">;
          conta_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          conta_posto_fecho?: tns.TypeOf<"uuid">;
          conta_dataregistro: tns.TypeOf<"timestamptz">;
          conta_cliente_id?: tns.TypeOf<"uuid">;
          conta_datafecho?: tns.TypeOf<"timestamptz">;
          conta_espaco_auth: tns.TypeOf<"uuid">;
          conta_proformaextras?: T["tweeks.conta.conta_proformaextras"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_proformaextras"];
          conta_numerofatura?: tns.TypeOf<"varchar">;
          conta_chave?: tns.TypeOf<"varchar">;
          conta_posto_id?: tns.TypeOf<"uuid">;
          conta_colaborador_fecho?: tns.TypeOf<"uuid">;
          conta_taxacambio?: tns.TypeOf<"float8">;
          conta_mesa?: T["tweeks.conta.conta_mesa"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.conta.conta_mesa"];
          conta_extension: T["tweeks.conta.conta_extension"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_extension"];
          _tgrupo_id?: tns.TypeOf<"int2">;
          conta_conta_docorigin?: tns.TypeOf<"uuid">;
          conta_serie?: T["tweeks.conta.conta_serie"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.conta.conta_serie"];
          conta_proforma?: tns.TypeOf<"bool">;
          conta_colaborador_id: tns.TypeOf<"uuid">;
          conta_imprensa: tns.TypeOf<"int2">;
          conta_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          conta_id: tns.TypeOf<"uuid">;
          conta_props?: T["tweeks.conta.conta_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.conta.conta_props"];
          conta_proformavencimento?: tns.TypeOf<"date">;
          conta_docorigin?: tns.TypeOf<"varchar">;
          conta_tserie_id?: tns.TypeOf<"int2">;
          conta_data?: tns.TypeOf<"date">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tmovimento {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tmovimento_id?: tns.TypeOf<"int2">;
          tmovimento_designacao?: tns.TypeOf<"varchar">;
          tmovimento_multiplo?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tmovimento_id: tns.TypeOf<"int2">;
          tmovimento_designacao: tns.TypeOf<"varchar">;
          tmovimento_multiplo: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tmovimento_id: tns.TypeOf<"int2">;
          tmovimento_designacao: tns.TypeOf<"varchar">;
          tmovimento_multiplo: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace branchmap {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          class?: tns.TypeOf<"text">;
          map_tbl?: tns.TypeOf<"text">;
          map_usr?: tns.TypeOf<"text">;
          map_spc?: tns.TypeOf<"text">;
          map_sch?: tns.TypeOf<"text">;
          map_brc?: tns.TypeOf<"text">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          class: tns.TypeOf<"text">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          class: tns.TypeOf<"text">;
          map_tbl?: tns.TypeOf<"text">;
          map_usr?: tns.TypeOf<"text">;
          map_spc?: tns.TypeOf<"text">;
          map_sch?: tns.TypeOf<"text">;
          map_brc?: tns.TypeOf<"text">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace _temp_forece_table {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          time?: tns.TypeOf<"timestamptz">;
          name?: tns.TypeOf<"text">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          time: tns.TypeOf<"timestamptz">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          time: tns.TypeOf<"timestamptz">;
          name?: tns.TypeOf<"text">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace ean {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          ean_dateout?: tns.TypeOf<"date">;
          ean_espaco_auth?: tns.TypeOf<"uuid">;
          ean_artigo_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          ean_code?: tns.TypeOf<"varchar">;
          ean_date?: tns.TypeOf<"timestamptz">;
          ean_datein?: tns.TypeOf<"date">;
          ean_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          ean_id?: tns.TypeOf<"uuid">;
          ean_colaborador_id?: tns.TypeOf<"uuid">;
          ena_dateupdate?: tns.TypeOf<"timestamptz">;
          ean_estado?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          ean_espaco_auth: tns.TypeOf<"uuid">;
          ean_artigo_id: tns.TypeOf<"uuid">;
          ean_code: tns.TypeOf<"varchar">;
          ean_date: tns.TypeOf<"timestamptz">;
          ean_id: tns.TypeOf<"uuid">;
          ean_colaborador_id: tns.TypeOf<"uuid">;
          ean_estado: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          ean_dateout?: tns.TypeOf<"date">;
          ean_espaco_auth: tns.TypeOf<"uuid">;
          ean_artigo_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          ean_code: tns.TypeOf<"varchar">;
          ean_date: tns.TypeOf<"timestamptz">;
          ean_datein?: tns.TypeOf<"date">;
          ean_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          ean_id: tns.TypeOf<"uuid">;
          ean_colaborador_id: tns.TypeOf<"uuid">;
          ena_dateupdate?: tns.TypeOf<"timestamptz">;
          ean_estado: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace cambio {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          cambio_id?: tns.TypeOf<"uuid">;
          cambio_colaborador_id?: tns.TypeOf<"uuid">;
          cambio_data?: tns.TypeOf<"date">;
          cambio_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          cambio_currency_id?: tns.TypeOf<"int2">;
          cambio_estado?: tns.TypeOf<"int2">;
          cambio_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          cambio_taxa?: tns.TypeOf<"float8">;
          cambio_espaco_auth?: tns.TypeOf<"uuid">;
          cambio_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          cambio_id: tns.TypeOf<"uuid">;
          cambio_colaborador_id: tns.TypeOf<"uuid">;
          cambio_data: tns.TypeOf<"date">;
          cambio_dataregistro: tns.TypeOf<"timestamptz">;
          cambio_currency_id: tns.TypeOf<"int2">;
          cambio_estado: tns.TypeOf<"int2">;
          cambio_espaco_auth: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          cambio_id: tns.TypeOf<"uuid">;
          cambio_colaborador_id: tns.TypeOf<"uuid">;
          cambio_data: tns.TypeOf<"date">;
          cambio_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          cambio_currency_id: tns.TypeOf<"int2">;
          cambio_estado: tns.TypeOf<"int2">;
          cambio_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          cambio_taxa?: tns.TypeOf<"float8">;
          cambio_espaco_auth: tns.TypeOf<"uuid">;
          cambio_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace autorizacao {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          _branch_uid?: tns.TypeOf<"uuid">;
          autorizacao_estado?: tns.TypeOf<"int2">;
          autorizacao_espaco_auth?: tns.TypeOf<"uuid">;
          autorizacao_colaborador_uid?: tns.TypeOf<"uuid">;
          autorizacao_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          autorizacao_designacao?: tns.TypeOf<"varchar">;
          autorizacao_dataregistro?: tns.TypeOf<"timestamp">;
          autorizacao_espaco_uid?: tns.TypeOf<"uuid">;
          autorizacao_dataatualizacao?: tns.TypeOf<"timestamp">;
          autorizacao_ano?: tns.TypeOf<"int4">;
          autorizacao_numero?: tns.TypeOf<"varchar">;
          autorizacao_autorizacao_continuer?: tns.TypeOf<"uuid">;
          autorizacao_uid?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          _branch_uid: tns.TypeOf<"uuid">;
          autorizacao_estado: tns.TypeOf<"int2">;
          autorizacao_espaco_auth: tns.TypeOf<"uuid">;
          autorizacao_colaborador_uid: tns.TypeOf<"uuid">;
          autorizacao_designacao: tns.TypeOf<"varchar">;
          autorizacao_dataregistro: tns.TypeOf<"timestamp">;
          autorizacao_espaco_uid: tns.TypeOf<"uuid">;
          autorizacao_ano: tns.TypeOf<"int4">;
          autorizacao_uid: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          _branch_uid: tns.TypeOf<"uuid">;
          autorizacao_estado: tns.TypeOf<"int2">;
          autorizacao_espaco_auth: tns.TypeOf<"uuid">;
          autorizacao_colaborador_uid: tns.TypeOf<"uuid">;
          autorizacao_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          autorizacao_designacao: tns.TypeOf<"varchar">;
          autorizacao_dataregistro: tns.TypeOf<"timestamp">;
          autorizacao_espaco_uid: tns.TypeOf<"uuid">;
          autorizacao_dataatualizacao?: tns.TypeOf<"timestamp">;
          autorizacao_ano: tns.TypeOf<"int4">;
          autorizacao_numero?: tns.TypeOf<"varchar">;
          autorizacao_autorizacao_continuer?: tns.TypeOf<"uuid">;
          autorizacao_uid: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tpaga {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tpaga_designacao?: tns.TypeOf<"varchar">;
          tpaga_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tpaga_designacao: tns.TypeOf<"varchar">;
          tpaga_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tpaga_designacao: tns.TypeOf<"varchar">;
          tpaga_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace atividadeoperacao {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          atividadeoperacao_dateupdate?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          atividadeoperacao_date?: tns.TypeOf<"timestamptz">;
          atividadeoperacao_uid?: tns.TypeOf<"uuid">;
          atividadeoperacao_user_update?: tns.TypeOf<"uuid">;
          atividadeoperacao_description?: tns.TypeOf<"varchar">;
          atividadeoperacao_estado?: tns.TypeOf<"int2">;
          atividadeoperacao_user_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          atividadeoperacao_date: tns.TypeOf<"timestamptz">;
          atividadeoperacao_uid: tns.TypeOf<"uuid">;
          atividadeoperacao_estado: tns.TypeOf<"int2">;
          atividadeoperacao_user_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          atividadeoperacao_dateupdate?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          atividadeoperacao_date: tns.TypeOf<"timestamptz">;
          atividadeoperacao_uid: tns.TypeOf<"uuid">;
          atividadeoperacao_user_update?: tns.TypeOf<"uuid">;
          atividadeoperacao_description?: tns.TypeOf<"varchar">;
          atividadeoperacao_estado: tns.TypeOf<"int2">;
          atividadeoperacao_user_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace venda {
        export interface PropsTyped<
          T extends { [K in "tweeks.venda.venda_metadata"]?: T[K] },
        > {
          venda_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          venda_editado?: tns.TypeOf<"bool">;
          venda_montantecomimposto?: tns.TypeOf<"float8">;
          venda_montanteagregado?: tns.TypeOf<"float8">;
          venda_dataregistro?: tns.TypeOf<"timestamptz">;
          venda_codigoimposto?: tns.TypeOf<"varchar">;
          venda_artigo_id?: tns.TypeOf<"uuid">;
          venda_validade?: tns.TypeOf<"date">;
          venda_custounitario?: tns.TypeOf<"float8">;
          venda_proforma?: tns.TypeOf<"bool">;
          venda_dataatualizacao?: tns.TypeOf<"timestamptz">;
          venda_impostoretirar?: tns.TypeOf<"float8">;
          venda_conta_id?: tns.TypeOf<"uuid">;
          venda_estadopreparacao?: tns.TypeOf<"int2">;
          venda_descricao?: tns.TypeOf<"varchar">;
          venda_montantetotal?: tns.TypeOf<"float8">;
          venda_montantesemimposto?: tns.TypeOf<"float8">;
          venda_espaco_auth?: tns.TypeOf<"uuid">;
          venda_taxas?: tns.TypeOf<"uuid">[];
          venda_impostoadicionar?: tns.TypeOf<"float8">;
          venda_imposto?: tns.TypeOf<"float8">;
          venda_id?: tns.TypeOf<"uuid">;
          venda_isencao?: tns.TypeOf<"bool">;
          venda_lote?: tns.TypeOf<"varchar">;
          _branch_uid?: tns.TypeOf<"uuid">;
          venda_quantidade?: tns.TypeOf<"float8">;
          venda_venda_id?: tns.TypeOf<"uuid">;
          venda_estado?: tns.TypeOf<"int2">;
          venda_colaborador_id?: tns.TypeOf<"uuid">;
          venda_custoquantidade?: tns.TypeOf<"float8">;
          venda_montante?: tns.TypeOf<"float8">;
          venda_venda_docorign?: tns.TypeOf<"uuid">;
          venda_metadata?: T["tweeks.venda.venda_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.venda.venda_metadata"];
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          venda_editado: tns.TypeOf<"bool">;
          venda_montantecomimposto: tns.TypeOf<"float8">;
          venda_montanteagregado: tns.TypeOf<"float8">;
          venda_dataregistro: tns.TypeOf<"timestamptz">;
          venda_artigo_id: tns.TypeOf<"uuid">;
          venda_custounitario: tns.TypeOf<"float8">;
          venda_conta_id: tns.TypeOf<"uuid">;
          venda_estadopreparacao: tns.TypeOf<"int2">;
          venda_montantetotal: tns.TypeOf<"float8">;
          venda_montantesemimposto: tns.TypeOf<"float8">;
          venda_espaco_auth: tns.TypeOf<"uuid">;
          venda_taxas: tns.TypeOf<"uuid">[];
          venda_imposto: tns.TypeOf<"float8">;
          venda_id: tns.TypeOf<"uuid">;
          venda_isencao: tns.TypeOf<"bool">;
          venda_quantidade: tns.TypeOf<"float8">;
          venda_estado: tns.TypeOf<"int2">;
          venda_colaborador_id: tns.TypeOf<"uuid">;
          venda_custoquantidade: tns.TypeOf<"float8">;
          venda_montante: tns.TypeOf<"float8">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.venda.venda_metadata"]?: T[K] },
        > {
          venda_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          venda_editado: tns.TypeOf<"bool">;
          venda_montantecomimposto: tns.TypeOf<"float8">;
          venda_montanteagregado: tns.TypeOf<"float8">;
          venda_dataregistro: tns.TypeOf<"timestamptz">;
          venda_codigoimposto?: tns.TypeOf<"varchar">;
          venda_artigo_id: tns.TypeOf<"uuid">;
          venda_validade?: tns.TypeOf<"date">;
          venda_custounitario: tns.TypeOf<"float8">;
          venda_proforma?: tns.TypeOf<"bool">;
          venda_dataatualizacao?: tns.TypeOf<"timestamptz">;
          venda_impostoretirar?: tns.TypeOf<"float8">;
          venda_conta_id: tns.TypeOf<"uuid">;
          venda_estadopreparacao: tns.TypeOf<"int2">;
          venda_descricao?: tns.TypeOf<"varchar">;
          venda_montantetotal: tns.TypeOf<"float8">;
          venda_montantesemimposto: tns.TypeOf<"float8">;
          venda_espaco_auth: tns.TypeOf<"uuid">;
          venda_taxas: tns.TypeOf<"uuid">[];
          venda_impostoadicionar?: tns.TypeOf<"float8">;
          venda_imposto: tns.TypeOf<"float8">;
          venda_id: tns.TypeOf<"uuid">;
          venda_isencao: tns.TypeOf<"bool">;
          venda_lote?: tns.TypeOf<"varchar">;
          _branch_uid?: tns.TypeOf<"uuid">;
          venda_quantidade: tns.TypeOf<"float8">;
          venda_venda_id?: tns.TypeOf<"uuid">;
          venda_estado: tns.TypeOf<"int2">;
          venda_colaborador_id: tns.TypeOf<"uuid">;
          venda_custoquantidade: tns.TypeOf<"float8">;
          venda_montante: tns.TypeOf<"float8">;
          venda_venda_docorign?: tns.TypeOf<"uuid">;
          venda_metadata?: T["tweeks.venda.venda_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.venda.venda_metadata"];
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace classe {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          classe_estado?: tns.TypeOf<"int2">;
          classe_codigo?: tns.TypeOf<"varchar">;
          classe_dataregistro?: tns.TypeOf<"timestamptz">;
          classe_position?: tns.TypeOf<"int2">;
          classe_espaco_auth?: tns.TypeOf<"uuid">;
          classe_lastcodigo?: tns.TypeOf<"int4">;
          classe_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          classe_classe_id?: tns.TypeOf<"uuid">;
          classe_colaborador_id?: tns.TypeOf<"uuid">;
          classe_nome?: tns.TypeOf<"varchar">;
          classe_id?: tns.TypeOf<"uuid">;
          classe_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          classe_foto?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          classe_estado: tns.TypeOf<"int2">;
          classe_dataregistro: tns.TypeOf<"timestamptz">;
          classe_position: tns.TypeOf<"int2">;
          classe_espaco_auth: tns.TypeOf<"uuid">;
          classe_lastcodigo: tns.TypeOf<"int4">;
          classe_colaborador_id: tns.TypeOf<"uuid">;
          classe_nome: tns.TypeOf<"varchar">;
          classe_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          classe_estado: tns.TypeOf<"int2">;
          classe_codigo?: tns.TypeOf<"varchar">;
          classe_dataregistro: tns.TypeOf<"timestamptz">;
          classe_position: tns.TypeOf<"int2">;
          classe_espaco_auth: tns.TypeOf<"uuid">;
          classe_lastcodigo: tns.TypeOf<"int4">;
          classe_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          classe_classe_id?: tns.TypeOf<"uuid">;
          classe_colaborador_id: tns.TypeOf<"uuid">;
          classe_nome: tns.TypeOf<"varchar">;
          classe_id: tns.TypeOf<"uuid">;
          classe_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          classe_foto?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace artigo {
        export interface PropsTyped<
          T extends { [K in "tweeks.artigo.artigo_codigoimposto"]?: T[K] },
        > {
          artigo_id?: tns.TypeOf<"uuid">;
          artigo_descricao?: tns.TypeOf<"varchar">;
          artigo_codigo?: tns.TypeOf<"varchar">;
          artigo_preparacao?: tns.TypeOf<"bool">;
          artigo_codigoimposto?: T["tweeks.artigo.artigo_codigoimposto"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.artigo.artigo_codigoimposto"];
          artigo_espaco_auth?: tns.TypeOf<"uuid">;
          artigo_colaborador_id?: tns.TypeOf<"uuid">;
          artigo_estado?: tns.TypeOf<"int2">;
          artigo_foto?: tns.TypeOf<"varchar">;
          artigo_dataatualizacao?: tns.TypeOf<"timestamptz">;
          artigo_unit_id?: tns.TypeOf<"uuid">;
          artigo_dataregistro?: tns.TypeOf<"timestamptz">;
          artigo_nome?: tns.TypeOf<"varchar">;
          artigo_artigo_id?: tns.TypeOf<"uuid">;
          artigo_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          artigo_compostoquantidade?: tns.TypeOf<"float8">;
          artigo_classe_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          artigo_stocknegativo?: tns.TypeOf<"bool">;
          artigo_stock?: tns.TypeOf<"float8">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          artigo_id: tns.TypeOf<"uuid">;
          artigo_codigo: tns.TypeOf<"varchar">;
          artigo_preparacao: tns.TypeOf<"bool">;
          artigo_espaco_auth: tns.TypeOf<"uuid">;
          artigo_colaborador_id: tns.TypeOf<"uuid">;
          artigo_estado: tns.TypeOf<"int2">;
          artigo_dataregistro: tns.TypeOf<"timestamptz">;
          artigo_nome: tns.TypeOf<"varchar">;
          artigo_classe_id: tns.TypeOf<"uuid">;
          artigo_stocknegativo: tns.TypeOf<"bool">;
          artigo_stock: tns.TypeOf<"float8">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.artigo.artigo_codigoimposto"]?: T[K] },
        > {
          artigo_id: tns.TypeOf<"uuid">;
          artigo_descricao?: tns.TypeOf<"varchar">;
          artigo_codigo: tns.TypeOf<"varchar">;
          artigo_preparacao: tns.TypeOf<"bool">;
          artigo_codigoimposto?: T["tweeks.artigo.artigo_codigoimposto"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.artigo.artigo_codigoimposto"];
          artigo_espaco_auth: tns.TypeOf<"uuid">;
          artigo_colaborador_id: tns.TypeOf<"uuid">;
          artigo_estado: tns.TypeOf<"int2">;
          artigo_foto?: tns.TypeOf<"varchar">;
          artigo_dataatualizacao?: tns.TypeOf<"timestamptz">;
          artigo_unit_id?: tns.TypeOf<"uuid">;
          artigo_dataregistro: tns.TypeOf<"timestamptz">;
          artigo_nome: tns.TypeOf<"varchar">;
          artigo_artigo_id?: tns.TypeOf<"uuid">;
          artigo_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          artigo_compostoquantidade?: tns.TypeOf<"float8">;
          artigo_classe_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          artigo_stocknegativo: tns.TypeOf<"bool">;
          artigo_stock: tns.TypeOf<"float8">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace lancamento {
        export interface PropsTyped<
          T extends { [K in "tweeks.lancamento.lancamento_referencia"]?: T[K] },
        > {
          lancamento_referencia?: T["tweeks.lancamento.lancamento_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.lancamento.lancamento_referencia"];
          lancamento_estado?: tns.TypeOf<"int2">;
          lancamento_credito?: tns.TypeOf<"float8">;
          lancamento_valor?: tns.TypeOf<"float8">;
          lancamento_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          lancamento_descricao?: tns.TypeOf<"varchar">;
          lancamento_documento?: tns.TypeOf<"varchar">;
          lancamento_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _tgrupo_id?: tns.TypeOf<"int2">;
          lancamento_sequencia?: tns.TypeOf<"int8">;
          lancamento_via?: tns.TypeOf<"int2">;
          lancamento_montante?: tns.TypeOf<"float8">;
          lancamento_regclass?: tns.TypeOf<"varchar">;
          lancamento_data?: tns.TypeOf<"date">;
          lancamento_espaco_auth?: tns.TypeOf<"uuid">;
          lancamento_refid?: tns.TypeOf<"uuid">;
          lancamento_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          lancamento_debito?: tns.TypeOf<"float8">;
          lancamento_colaborador_id?: tns.TypeOf<"uuid">;
          lancamento_cliente_id?: tns.TypeOf<"uuid">;
          lancamento_mode?: tns.TypeOf<"int2">;
          lancamento_tlancamento_id?: tns.TypeOf<"int2">;
          lancamento_operacao?: tns.TypeOf<"int2">;
          lancamento_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends { [K in "tweeks.lancamento.lancamento_referencia"]?: T[K] },
        > {
          lancamento_referencia: T["tweeks.lancamento.lancamento_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.lancamento.lancamento_referencia"];
          lancamento_estado: tns.TypeOf<"int2">;
          lancamento_credito: tns.TypeOf<"float8">;
          lancamento_descricao: tns.TypeOf<"varchar">;
          _tgrupo_id: tns.TypeOf<"int2">;
          lancamento_sequencia: tns.TypeOf<"int8">;
          lancamento_via: tns.TypeOf<"int2">;
          lancamento_data: tns.TypeOf<"date">;
          lancamento_espaco_auth: tns.TypeOf<"uuid">;
          lancamento_dataregistro: tns.TypeOf<"timestamptz">;
          lancamento_debito: tns.TypeOf<"float8">;
          lancamento_colaborador_id: tns.TypeOf<"uuid">;
          lancamento_cliente_id: tns.TypeOf<"uuid">;
          lancamento_mode: tns.TypeOf<"int2">;
          lancamento_tlancamento_id: tns.TypeOf<"int2">;
          lancamento_operacao: tns.TypeOf<"int2">;
          lancamento_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.lancamento.lancamento_referencia"]?: T[K] },
        > {
          lancamento_referencia: T["tweeks.lancamento.lancamento_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.lancamento.lancamento_referencia"];
          lancamento_estado: tns.TypeOf<"int2">;
          lancamento_credito: tns.TypeOf<"float8">;
          lancamento_valor?: tns.TypeOf<"float8">;
          lancamento_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          lancamento_descricao: tns.TypeOf<"varchar">;
          lancamento_documento?: tns.TypeOf<"varchar">;
          lancamento_dataatualizacao?: tns.TypeOf<"timestamptz">;
          _tgrupo_id: tns.TypeOf<"int2">;
          lancamento_sequencia: tns.TypeOf<"int8">;
          lancamento_via: tns.TypeOf<"int2">;
          lancamento_montante?: tns.TypeOf<"float8">;
          lancamento_regclass?: tns.TypeOf<"varchar">;
          lancamento_data: tns.TypeOf<"date">;
          lancamento_espaco_auth: tns.TypeOf<"uuid">;
          lancamento_refid?: tns.TypeOf<"uuid">;
          lancamento_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          lancamento_debito: tns.TypeOf<"float8">;
          lancamento_colaborador_id: tns.TypeOf<"uuid">;
          lancamento_cliente_id: tns.TypeOf<"uuid">;
          lancamento_mode: tns.TypeOf<"int2">;
          lancamento_tlancamento_id: tns.TypeOf<"int2">;
          lancamento_operacao: tns.TypeOf<"int2">;
          lancamento_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace imposto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          imposto_dataatualizacao?: tns.TypeOf<"int2">;
          imposto_valor?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          imposto_tipoimposto_id?: tns.TypeOf<"uuid">;
          imposto_estado?: tns.TypeOf<"int2">;
          imposto_percentagem?: tns.TypeOf<"float8">;
          imposto_taplicar_id?: tns.TypeOf<"int2">;
          imposto_id?: tns.TypeOf<"uuid">;
          imposto_espaco_auth?: tns.TypeOf<"uuid">;
          imposto_colaborador_id?: tns.TypeOf<"uuid">;
          imposto_dataregistro?: tns.TypeOf<"timestamptz">;
          imposto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          imposto_artigo_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          imposto_tipoimposto_id: tns.TypeOf<"uuid">;
          imposto_estado: tns.TypeOf<"int2">;
          imposto_taplicar_id: tns.TypeOf<"int2">;
          imposto_id: tns.TypeOf<"uuid">;
          imposto_espaco_auth: tns.TypeOf<"uuid">;
          imposto_colaborador_id: tns.TypeOf<"uuid">;
          imposto_dataregistro: tns.TypeOf<"timestamptz">;
          imposto_artigo_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          imposto_dataatualizacao?: tns.TypeOf<"int2">;
          imposto_valor?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          imposto_tipoimposto_id: tns.TypeOf<"uuid">;
          imposto_estado: tns.TypeOf<"int2">;
          imposto_percentagem?: tns.TypeOf<"float8">;
          imposto_taplicar_id: tns.TypeOf<"int2">;
          imposto_id: tns.TypeOf<"uuid">;
          imposto_espaco_auth: tns.TypeOf<"uuid">;
          imposto_colaborador_id: tns.TypeOf<"uuid">;
          imposto_dataregistro: tns.TypeOf<"timestamptz">;
          imposto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          imposto_artigo_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace guia {
        export interface PropsTyped<
          T extends {
            [K in "tweeks.guia.guia_metadata" | "tweeks.guia.guia_refs"]?: T[K];
          },
        > {
          guia_espaco_saida?: tns.TypeOf<"uuid">;
          guia_metadata?: T["tweeks.guia.guia_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.guia.guia_metadata"];
          guia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          guia_espaco_auth?: tns.TypeOf<"uuid">;
          guia_toperacao_id?: tns.TypeOf<"int2">;
          guia_dataoperacao?: tns.TypeOf<"date">;
          guia_espaco_entrada?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          guia_refuid?: tns.TypeOf<"uuid">;
          guia_colaborador_id?: tns.TypeOf<"uuid">;
          guia_refclass?: tns.TypeOf<"varchar">;
          guia_numero?: tns.TypeOf<"varchar">;
          guia_refs?: T["tweeks.guia.guia_refs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.guia.guia_refs"];
          guia_estado?: tns.TypeOf<"int2">;
          guia_documentoperacao?: tns.TypeOf<"varchar">;
          guia_observacao?: tns.TypeOf<"varchar">;
          guia_date?: tns.TypeOf<"timestamptz">;
          _braunc_uid?: tns.TypeOf<"uuid">;
          guia_dateupdate?: tns.TypeOf<"timestamptz">;
          guia_tguia_id?: tns.TypeOf<"int2">;
          guia_uid?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          guia_espaco_auth: tns.TypeOf<"uuid">;
          guia_toperacao_id: tns.TypeOf<"int2">;
          guia_dataoperacao: tns.TypeOf<"date">;
          guia_colaborador_id: tns.TypeOf<"uuid">;
          guia_numero: tns.TypeOf<"varchar">;
          guia_estado: tns.TypeOf<"int2">;
          guia_date: tns.TypeOf<"timestamptz">;
          guia_tguia_id: tns.TypeOf<"int2">;
          guia_uid: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in "tweeks.guia.guia_metadata" | "tweeks.guia.guia_refs"]?: T[K];
          },
        > {
          guia_espaco_saida?: tns.TypeOf<"uuid">;
          guia_metadata?: T["tweeks.guia.guia_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.guia.guia_metadata"];
          guia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          guia_espaco_auth: tns.TypeOf<"uuid">;
          guia_toperacao_id: tns.TypeOf<"int2">;
          guia_dataoperacao: tns.TypeOf<"date">;
          guia_espaco_entrada?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          guia_refuid?: tns.TypeOf<"uuid">;
          guia_colaborador_id: tns.TypeOf<"uuid">;
          guia_refclass?: tns.TypeOf<"varchar">;
          guia_numero: tns.TypeOf<"varchar">;
          guia_refs?: T["tweeks.guia.guia_refs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.guia.guia_refs"];
          guia_estado: tns.TypeOf<"int2">;
          guia_documentoperacao?: tns.TypeOf<"varchar">;
          guia_observacao?: tns.TypeOf<"varchar">;
          guia_date: tns.TypeOf<"timestamptz">;
          _braunc_uid?: tns.TypeOf<"uuid">;
          guia_dateupdate?: tns.TypeOf<"timestamptz">;
          guia_tguia_id: tns.TypeOf<"int2">;
          guia_uid: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace link {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.link.link_config"
              | "tweeks.link.link_metadata"
              | "tweeks.link.link_referencia"]?: T[K];
          },
        > {
          link_posicao?: tns.TypeOf<"int2">;
          link_link_id?: tns.TypeOf<"uuid">;
          link_nome?: tns.TypeOf<"varchar">;
          link_tlink_id?: tns.TypeOf<"int2">;
          link_config?: T["tweeks.link.link_config"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_config"];
          link_metadata?: T["tweeks.link.link_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_metadata"];
          link_espaco_destino?: tns.TypeOf<"uuid">;
          link_dataatualizacao?: tns.TypeOf<"timestamptz">;
          link_link_associacao?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          link_estado?: tns.TypeOf<"int2">;
          link_colaborador_id?: tns.TypeOf<"uuid">;
          link_referencia?: T["tweeks.link.link_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_referencia"];
          link_espaco_auth?: tns.TypeOf<"uuid">;
          link_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          link_dataregistro?: tns.TypeOf<"timestamptz">;
          link_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          link_nome: tns.TypeOf<"varchar">;
          link_tlink_id: tns.TypeOf<"int2">;
          link_espaco_destino: tns.TypeOf<"uuid">;
          link_estado: tns.TypeOf<"int2">;
          link_colaborador_id: tns.TypeOf<"uuid">;
          link_espaco_auth: tns.TypeOf<"uuid">;
          link_dataregistro: tns.TypeOf<"timestamptz">;
          link_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.link.link_config"
              | "tweeks.link.link_metadata"
              | "tweeks.link.link_referencia"]?: T[K];
          },
        > {
          link_posicao?: tns.TypeOf<"int2">;
          link_link_id?: tns.TypeOf<"uuid">;
          link_nome: tns.TypeOf<"varchar">;
          link_tlink_id: tns.TypeOf<"int2">;
          link_config?: T["tweeks.link.link_config"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_config"];
          link_metadata?: T["tweeks.link.link_metadata"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_metadata"];
          link_espaco_destino: tns.TypeOf<"uuid">;
          link_dataatualizacao?: tns.TypeOf<"timestamptz">;
          link_link_associacao?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          link_estado: tns.TypeOf<"int2">;
          link_colaborador_id: tns.TypeOf<"uuid">;
          link_referencia?: T["tweeks.link.link_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.link.link_referencia"];
          link_espaco_auth: tns.TypeOf<"uuid">;
          link_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          link_dataregistro: tns.TypeOf<"timestamptz">;
          link_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace serie {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          serie_espaco_id?: tns.TypeOf<"uuid">;
          serie_espaco_auth?: tns.TypeOf<"uuid">;
          serie_numcertificacao?: tns.TypeOf<"varchar">;
          serie_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          serie_id?: tns.TypeOf<"uuid">;
          serie_dataatualizacao?: tns.TypeOf<"timestamptz">;
          serie_numatorizacao?: tns.TypeOf<"varchar">;
          serie_autorizacao_uid?: tns.TypeOf<"uuid">;
          serie_sequencia?: tns.TypeOf<"int8">;
          serie_designacao?: tns.TypeOf<"varchar">;
          serie_fechoautorizacao?: tns.TypeOf<"bool">;
          serie_colaborador_id?: tns.TypeOf<"uuid">;
          serie_serie_id?: tns.TypeOf<"uuid">;
          serie_numero?: tns.TypeOf<"varchar">;
          serie_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          serie_estado?: tns.TypeOf<"int2">;
          serie_quantidade?: tns.TypeOf<"int4">;
          serie_tserie_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          serie_espaco_id: tns.TypeOf<"uuid">;
          serie_espaco_auth: tns.TypeOf<"uuid">;
          serie_dataregistro: tns.TypeOf<"timestamptz">;
          serie_id: tns.TypeOf<"uuid">;
          serie_sequencia: tns.TypeOf<"int8">;
          serie_designacao: tns.TypeOf<"varchar">;
          serie_fechoautorizacao: tns.TypeOf<"bool">;
          serie_colaborador_id: tns.TypeOf<"uuid">;
          serie_numero: tns.TypeOf<"varchar">;
          serie_estado: tns.TypeOf<"int2">;
          serie_quantidade: tns.TypeOf<"int4">;
          serie_tserie_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          serie_espaco_id: tns.TypeOf<"uuid">;
          serie_espaco_auth: tns.TypeOf<"uuid">;
          serie_numcertificacao?: tns.TypeOf<"varchar">;
          serie_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          serie_id: tns.TypeOf<"uuid">;
          serie_dataatualizacao?: tns.TypeOf<"timestamptz">;
          serie_numatorizacao?: tns.TypeOf<"varchar">;
          serie_autorizacao_uid?: tns.TypeOf<"uuid">;
          serie_sequencia: tns.TypeOf<"int8">;
          serie_designacao: tns.TypeOf<"varchar">;
          serie_fechoautorizacao: tns.TypeOf<"bool">;
          serie_colaborador_id: tns.TypeOf<"uuid">;
          serie_serie_id?: tns.TypeOf<"uuid">;
          serie_numero: tns.TypeOf<"varchar">;
          serie_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          serie_estado: tns.TypeOf<"int2">;
          serie_quantidade: tns.TypeOf<"int4">;
          serie_tserie_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace impostovenda {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          impostovenda_dataregistro?: tns.TypeOf<"timestamptz">;
          impostovenda_estado?: tns.TypeOf<"int2">;
          impostovenda_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          impostovenda_tipoimposto_id?: tns.TypeOf<"uuid">;
          impostovenda_venda_id?: tns.TypeOf<"uuid">;
          impostovenda_espaco_auth?: tns.TypeOf<"uuid">;
          impostovenda_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          impostovenda_colaborador_id?: tns.TypeOf<"uuid">;
          impostovenda_percentagem?: tns.TypeOf<"float8">;
          impostovenda_valor?: tns.TypeOf<"float8">;
          impostovenda_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          impostovenda_dataregistro: tns.TypeOf<"timestamptz">;
          impostovenda_estado: tns.TypeOf<"int2">;
          impostovenda_id: tns.TypeOf<"uuid">;
          impostovenda_tipoimposto_id: tns.TypeOf<"uuid">;
          impostovenda_venda_id: tns.TypeOf<"uuid">;
          impostovenda_espaco_auth: tns.TypeOf<"uuid">;
          impostovenda_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          impostovenda_dataregistro: tns.TypeOf<"timestamptz">;
          impostovenda_estado: tns.TypeOf<"int2">;
          impostovenda_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          impostovenda_tipoimposto_id: tns.TypeOf<"uuid">;
          impostovenda_venda_id: tns.TypeOf<"uuid">;
          impostovenda_espaco_auth: tns.TypeOf<"uuid">;
          impostovenda_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          impostovenda_colaborador_id: tns.TypeOf<"uuid">;
          impostovenda_percentagem?: tns.TypeOf<"float8">;
          impostovenda_valor?: tns.TypeOf<"float8">;
          impostovenda_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace parametrizacao {
        export interface PropsTyped<
          T extends {
            [K in "tweeks.parametrizacao.parametrizacao_props"]?: T[K];
          },
        > {
          parametrizacao_props?: T["tweeks.parametrizacao.parametrizacao_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.parametrizacao.parametrizacao_props"];
          parametrizacao_tags?: tns.TypeOf<"varchar">[];
          parametrizacao_espaco_auth?: tns.TypeOf<"uuid">;
          parametrizacao_user_update?: tns.TypeOf<"uuid">;
          parametrizacao_date?: tns.TypeOf<"timestamptz">;
          parametrizacao_uid?: tns.TypeOf<"uuid">;
          parametrizacao_user_uid?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          parametrizacao_estado?: tns.TypeOf<"int2">;
          parametrizacao_dateupdate?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends {
            [K in "tweeks.parametrizacao.parametrizacao_props"]?: T[K];
          },
        > {
          parametrizacao_props: T["tweeks.parametrizacao.parametrizacao_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.parametrizacao.parametrizacao_props"];
          parametrizacao_tags: tns.TypeOf<"varchar">[];
          parametrizacao_espaco_auth: tns.TypeOf<"uuid">;
          parametrizacao_date: tns.TypeOf<"timestamptz">;
          parametrizacao_uid: tns.TypeOf<"uuid">;
          parametrizacao_user_uid: tns.TypeOf<"uuid">;
          _branch_uid: tns.TypeOf<"uuid">;
          parametrizacao_estado: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends {
            [K in "tweeks.parametrizacao.parametrizacao_props"]?: T[K];
          },
        > {
          parametrizacao_props: T["tweeks.parametrizacao.parametrizacao_props"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.parametrizacao.parametrizacao_props"];
          parametrizacao_tags: tns.TypeOf<"varchar">[];
          parametrizacao_espaco_auth: tns.TypeOf<"uuid">;
          parametrizacao_user_update?: tns.TypeOf<"uuid">;
          parametrizacao_date: tns.TypeOf<"timestamptz">;
          parametrizacao_uid: tns.TypeOf<"uuid">;
          parametrizacao_user_uid: tns.TypeOf<"uuid">;
          _branch_uid: tns.TypeOf<"uuid">;
          parametrizacao_estado: tns.TypeOf<"int2">;
          parametrizacao_dateupdate?: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace custoguia {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          custoguia_dateupdate?: tns.TypeOf<"timestamptz">;
          custoguia_date?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          custoguia_colaborador_id?: tns.TypeOf<"uuid">;
          custoguia_estado?: tns.TypeOf<"int2">;
          custoguia_uid?: tns.TypeOf<"uuid">;
          custoguia_guia_uid?: tns.TypeOf<"uuid">;
          custoguia_espaco_auth?: tns.TypeOf<"uuid">;
          custoguia_descricao?: tns.TypeOf<"varchar">;
          custoguia_montante?: tns.TypeOf<"float8">;
          custoguia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          custoguia_tcusto_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          custoguia_date: tns.TypeOf<"timestamptz">;
          custoguia_colaborador_id: tns.TypeOf<"uuid">;
          custoguia_estado: tns.TypeOf<"int2">;
          custoguia_uid: tns.TypeOf<"uuid">;
          custoguia_guia_uid: tns.TypeOf<"uuid">;
          custoguia_espaco_auth: tns.TypeOf<"uuid">;
          custoguia_descricao: tns.TypeOf<"varchar">;
          custoguia_montante: tns.TypeOf<"float8">;
          custoguia_tcusto_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          custoguia_dateupdate?: tns.TypeOf<"timestamptz">;
          custoguia_date: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          custoguia_colaborador_id: tns.TypeOf<"uuid">;
          custoguia_estado: tns.TypeOf<"int2">;
          custoguia_uid: tns.TypeOf<"uuid">;
          custoguia_guia_uid: tns.TypeOf<"uuid">;
          custoguia_espaco_auth: tns.TypeOf<"uuid">;
          custoguia_descricao: tns.TypeOf<"varchar">;
          custoguia_montante: tns.TypeOf<"float8">;
          custoguia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          custoguia_tcusto_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tdocuemto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tdocumento_nome?: tns.TypeOf<"varchar">;
          tdocumento_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tdocumento_nome: tns.TypeOf<"varchar">;
          tdocumento_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tdocumento_nome: tns.TypeOf<"varchar">;
          tdocumento_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace taxa {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          taxa_espaco_auth?: tns.TypeOf<"uuid">;
          taxa_percentagem?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          taxa_colaborador_id?: tns.TypeOf<"uuid">;
          taxa_dataregistro?: tns.TypeOf<"timestamptz">;
          taxa_id?: tns.TypeOf<"uuid">;
          taxa_tipoimposto_id?: tns.TypeOf<"uuid">;
          taxa_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          taxa_taxa?: tns.TypeOf<"float8">;
          taxa_dataatualizacao?: tns.TypeOf<"timestamptz">;
          taxa_estado?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          taxa_espaco_auth: tns.TypeOf<"uuid">;
          taxa_colaborador_id: tns.TypeOf<"uuid">;
          taxa_dataregistro: tns.TypeOf<"timestamptz">;
          taxa_id: tns.TypeOf<"uuid">;
          taxa_tipoimposto_id: tns.TypeOf<"uuid">;
          taxa_estado: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          taxa_espaco_auth: tns.TypeOf<"uuid">;
          taxa_percentagem?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          taxa_colaborador_id: tns.TypeOf<"uuid">;
          taxa_dataregistro: tns.TypeOf<"timestamptz">;
          taxa_id: tns.TypeOf<"uuid">;
          taxa_tipoimposto_id: tns.TypeOf<"uuid">;
          taxa_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          taxa_taxa?: tns.TypeOf<"float8">;
          taxa_dataatualizacao?: tns.TypeOf<"timestamptz">;
          taxa_estado: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace codigoimposto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          codigoimposto_codigo?: tns.TypeOf<"varchar">;
          codigoimposto_descricao?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          codigoimposto_codigo: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          codigoimposto_codigo: tns.TypeOf<"varchar">;
          codigoimposto_descricao?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tbranch {
        export interface PropsTyped<
          T extends { [K in "tweeks.tbranch.tbranch_configs"]?: T[K] },
        > {
          tbranch_id?: tns.TypeOf<"int2">;
          tbranch_configs?: T["tweeks.tbranch.tbranch_configs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.tbranch.tbranch_configs"];
          tbranch_name?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tbranch_id: tns.TypeOf<"int2">;
          tbranch_name: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.tbranch.tbranch_configs"]?: T[K] },
        > {
          tbranch_id: tns.TypeOf<"int2">;
          tbranch_configs?: T["tweeks.tbranch.tbranch_configs"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.tbranch.tbranch_configs"];
          tbranch_name: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tposto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tposto_id?: tns.TypeOf<"int2">;
          tposto_designacao?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tposto_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tposto_id: tns.TypeOf<"int2">;
          tposto_designacao?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace posto {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          posto_designacao?: tns.TypeOf<"varchar">;
          _branch_uid?: tns.TypeOf<"uuid">;
          posto_espaco_auth?: tns.TypeOf<"uuid">;
          posto_estado?: tns.TypeOf<"int2">;
          posto_id?: tns.TypeOf<"uuid">;
          posto_dataatualizacao?: tns.TypeOf<"timestamptz">;
          posto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          posto_definirmontanteautomaticamente?: tns.TypeOf<"bool">;
          posto_dataregistro?: tns.TypeOf<"timestamptz">;
          posto_vermontatefaturado?: tns.TypeOf<"bool">;
          posto_multiplecaixa?: tns.TypeOf<"bool">;
          posto_authmode?: tns.TypeOf<"int2">;
          posto_tposto_id?: tns.TypeOf<"int2">;
          posto_caixamode?: tns.TypeOf<"int2">;
          posto_matricula?: tns.TypeOf<"varchar">;
          posto_colaborador_id?: tns.TypeOf<"uuid">;
          posto_chave?: tns.TypeOf<"varchar">;
          posto_caixalimite?: tns.TypeOf<"int4">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          posto_espaco_auth: tns.TypeOf<"uuid">;
          posto_estado: tns.TypeOf<"int2">;
          posto_id: tns.TypeOf<"uuid">;
          posto_dataregistro: tns.TypeOf<"timestamptz">;
          posto_vermontatefaturado: tns.TypeOf<"bool">;
          posto_multiplecaixa: tns.TypeOf<"bool">;
          posto_tposto_id: tns.TypeOf<"int2">;
          posto_colaborador_id: tns.TypeOf<"uuid">;
          posto_chave: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          posto_designacao?: tns.TypeOf<"varchar">;
          _branch_uid?: tns.TypeOf<"uuid">;
          posto_espaco_auth: tns.TypeOf<"uuid">;
          posto_estado: tns.TypeOf<"int2">;
          posto_id: tns.TypeOf<"uuid">;
          posto_dataatualizacao?: tns.TypeOf<"timestamptz">;
          posto_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          posto_definirmontanteautomaticamente?: tns.TypeOf<"bool">;
          posto_dataregistro: tns.TypeOf<"timestamptz">;
          posto_vermontatefaturado: tns.TypeOf<"bool">;
          posto_multiplecaixa: tns.TypeOf<"bool">;
          posto_authmode?: tns.TypeOf<"int2">;
          posto_tposto_id: tns.TypeOf<"int2">;
          posto_caixamode?: tns.TypeOf<"int2">;
          posto_matricula?: tns.TypeOf<"varchar">;
          posto_colaborador_id: tns.TypeOf<"uuid">;
          posto_chave: tns.TypeOf<"varchar">;
          posto_caixalimite?: tns.TypeOf<"int4">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace repcolumn {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.repcolumn.gen"
              | "tweeks.repcolumn.agg"
              | "tweeks.repcolumn.filter"]?: T[K];
          },
        > {
          rename?: tns.TypeOf<"varchar">;
          show?: tns.TypeOf<"bool">;
          gen?: T["tweeks.repcolumn.gen"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.gen"];
          init?: tns.TypeOf<"bool">;
          format?: tns.TypeOf<"varchar">;
          name?: tns.TypeOf<"varchar">;
          agg?: T["tweeks.repcolumn.agg"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.agg"];
          position?: tns.TypeOf<"int2">;
          type?: tns.TypeOf<"varchar">;
          filter?: T["tweeks.repcolumn.filter"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.filter"];
          source?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<
          T extends {
            [K in
              | "tweeks.repcolumn.gen"
              | "tweeks.repcolumn.agg"
              | "tweeks.repcolumn.filter"]?: T[K];
          },
        > {
          show: tns.TypeOf<"bool">;
          gen: T["tweeks.repcolumn.gen"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.gen"];
          init: tns.TypeOf<"bool">;
          name: tns.TypeOf<"varchar">;
          agg: T["tweeks.repcolumn.agg"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.agg"];
          type: tns.TypeOf<"varchar">;
          filter: T["tweeks.repcolumn.filter"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.filter"];
          source: tns.TypeOf<"varchar">;
        }

        export interface EntryTyped<
          T extends {
            [K in
              | "tweeks.repcolumn.gen"
              | "tweeks.repcolumn.agg"
              | "tweeks.repcolumn.filter"]?: T[K];
          },
        > {
          rename?: tns.TypeOf<"varchar">;
          show: tns.TypeOf<"bool">;
          gen: T["tweeks.repcolumn.gen"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.gen"];
          init: tns.TypeOf<"bool">;
          format?: tns.TypeOf<"varchar">;
          name: tns.TypeOf<"varchar">;
          agg: T["tweeks.repcolumn.agg"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.agg"];
          position?: tns.TypeOf<"int2">;
          type: tns.TypeOf<"varchar">;
          filter: T["tweeks.repcolumn.filter"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.repcolumn.filter"];
          source: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace transferencia {
        export interface PropsTyped<
          T extends {
            [K in "tweeks.transferencia.transferencia_metadata"]?: T[K];
          },
        > {
          transferencia_espaco_origem?: tns.TypeOf<"uuid">;
          transferencia_validade?: tns.TypeOf<"date">;
          transferencia_estado?: tns.TypeOf<"int2">;
          transferencia_espaco_destino?: tns.TypeOf<"uuid">;
          transferencia_quantidade?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          transferencia_documento?: tns.TypeOf<"varchar">;
          transferencia_metadata?: T["tweeks.transferencia.transferencia_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.transferencia.transferencia_metadata"];
          transferencia_descricao?: tns.TypeOf<"varchar">;
          transferencia_lote?: tns.TypeOf<"varchar">;
          transferencia_dataatualizacao?: tns.TypeOf<"timestamptz">;
          transferencia_espaco_auth?: tns.TypeOf<"uuid">;
          transferencia_dataregistro?: tns.TypeOf<"timestamptz">;
          transferencia_artigo_id?: tns.TypeOf<"uuid">;
          transferencia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          transferencia_data?: tns.TypeOf<"date">;
          transferencia_id?: tns.TypeOf<"uuid">;
          transferencia_observacao?: tns.TypeOf<"varchar">;
          transferencia_colaborador_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          transferencia_estado: tns.TypeOf<"int2">;
          transferencia_quantidade: tns.TypeOf<"float8">;
          transferencia_documento: tns.TypeOf<"varchar">;
          transferencia_dataregistro: tns.TypeOf<"timestamptz">;
          transferencia_id: tns.TypeOf<"uuid">;
          transferencia_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends {
            [K in "tweeks.transferencia.transferencia_metadata"]?: T[K];
          },
        > {
          transferencia_espaco_origem?: tns.TypeOf<"uuid">;
          transferencia_validade?: tns.TypeOf<"date">;
          transferencia_estado: tns.TypeOf<"int2">;
          transferencia_espaco_destino?: tns.TypeOf<"uuid">;
          transferencia_quantidade: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          transferencia_documento: tns.TypeOf<"varchar">;
          transferencia_metadata?: T["tweeks.transferencia.transferencia_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.transferencia.transferencia_metadata"];
          transferencia_descricao?: tns.TypeOf<"varchar">;
          transferencia_lote?: tns.TypeOf<"varchar">;
          transferencia_dataatualizacao?: tns.TypeOf<"timestamptz">;
          transferencia_espaco_auth?: tns.TypeOf<"uuid">;
          transferencia_dataregistro: tns.TypeOf<"timestamptz">;
          transferencia_artigo_id?: tns.TypeOf<"uuid">;
          transferencia_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          transferencia_data?: tns.TypeOf<"date">;
          transferencia_id: tns.TypeOf<"uuid">;
          transferencia_observacao?: tns.TypeOf<"varchar">;
          transferencia_colaborador_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace fluxo {
        export interface PropsTyped<
          T extends { [K in "tweeks.fluxo.fluxo_referencia"]?: T[K] },
        > {
          fluxo_colaborador_id?: tns.TypeOf<"uuid">;
          fluxo_refuid?: tns.TypeOf<"uuid">;
          fluxo_artigo_in?: tns.TypeOf<"uuid">;
          fluxo_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          fluxo_quantidadein?: tns.TypeOf<"float8">;
          fluxo_artigo_out?: tns.TypeOf<"uuid">;
          fluxo_referencia?: T["tweeks.fluxo.fluxo_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.fluxo.fluxo_referencia"];
          fluxo_espaco_in?: tns.TypeOf<"uuid">;
          fluxo_espaco_auth?: tns.TypeOf<"uuid">;
          fluxo_quantidadeout?: tns.TypeOf<"float8">;
          fluxo_espaco_out?: tns.TypeOf<"uuid">;
          fluxo_toperacao_id?: tns.TypeOf<"int2">;
          fluxo_regclass?: tns.TypeOf<"varchar">;
          fluxo_estado?: tns.TypeOf<"int2">;
          fluxo_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          fluxo_data?: tns.TypeOf<"date">;
          fluxo_id?: tns.TypeOf<"uuid">;
          fluxo_dataatualizacao?: tns.TypeOf<"timestamptz">;
          fluxo_sequencia?: tns.TypeOf<"int8">;
          fluxo_quantidadefinal?: tns.TypeOf<"float8">;
          fluxo_observacao?: tns.TypeOf<"varchar">;
          fluxo_documento?: tns.TypeOf<"varchar">;
          fluxo_checkpoint?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          fluxo_espaco_auth: tns.TypeOf<"uuid">;
          fluxo_toperacao_id: tns.TypeOf<"int2">;
          fluxo_estado: tns.TypeOf<"int2">;
          fluxo_dataregistro: tns.TypeOf<"timestamptz">;
          fluxo_id: tns.TypeOf<"uuid">;
          fluxo_sequencia: tns.TypeOf<"int8">;
          fluxo_checkpoint: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.fluxo.fluxo_referencia"]?: T[K] },
        > {
          fluxo_colaborador_id?: tns.TypeOf<"uuid">;
          fluxo_refuid?: tns.TypeOf<"uuid">;
          fluxo_artigo_in?: tns.TypeOf<"uuid">;
          fluxo_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          fluxo_quantidadein?: tns.TypeOf<"float8">;
          fluxo_artigo_out?: tns.TypeOf<"uuid">;
          fluxo_referencia?: T["tweeks.fluxo.fluxo_referencia"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.fluxo.fluxo_referencia"];
          fluxo_espaco_in?: tns.TypeOf<"uuid">;
          fluxo_espaco_auth: tns.TypeOf<"uuid">;
          fluxo_quantidadeout?: tns.TypeOf<"float8">;
          fluxo_espaco_out?: tns.TypeOf<"uuid">;
          fluxo_toperacao_id: tns.TypeOf<"int2">;
          fluxo_regclass?: tns.TypeOf<"varchar">;
          fluxo_estado: tns.TypeOf<"int2">;
          fluxo_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          fluxo_data?: tns.TypeOf<"date">;
          fluxo_id: tns.TypeOf<"uuid">;
          fluxo_dataatualizacao?: tns.TypeOf<"timestamptz">;
          fluxo_sequencia: tns.TypeOf<"int8">;
          fluxo_quantidadefinal?: tns.TypeOf<"float8">;
          fluxo_observacao?: tns.TypeOf<"varchar">;
          fluxo_documento?: tns.TypeOf<"varchar">;
          fluxo_checkpoint: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace tlink {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          tlink_designacao?: tns.TypeOf<"varchar">;
          tlink_id?: tns.TypeOf<"int2">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          tlink_id: tns.TypeOf<"int2">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          tlink_designacao?: tns.TypeOf<"varchar">;
          tlink_id: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace aloca {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          aloca_espaco_destino?: tns.TypeOf<"uuid">;
          aloca_dataregistro?: tns.TypeOf<"timestamptz">;
          aloca_espaco_auth?: tns.TypeOf<"uuid">;
          aloca_serie_faturarecibo?: tns.TypeOf<"uuid">;
          aloca_estado?: tns.TypeOf<"int2">;
          aloca_dataatualizacao?: tns.TypeOf<"timestamptz">;
          aloca_posto_id?: tns.TypeOf<"uuid">;
          aloca_montante?: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          aloca_serie_fatura?: tns.TypeOf<"uuid">;
          aloca_colaborador_id?: tns.TypeOf<"uuid">;
          aloca_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          aloca_id?: tns.TypeOf<"uuid">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          aloca_espaco_destino: tns.TypeOf<"uuid">;
          aloca_dataregistro: tns.TypeOf<"timestamptz">;
          aloca_espaco_auth: tns.TypeOf<"uuid">;
          aloca_estado: tns.TypeOf<"int2">;
          aloca_posto_id: tns.TypeOf<"uuid">;
          aloca_montante: tns.TypeOf<"float8">;
          aloca_colaborador_id: tns.TypeOf<"uuid">;
          aloca_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          aloca_espaco_destino: tns.TypeOf<"uuid">;
          aloca_dataregistro: tns.TypeOf<"timestamptz">;
          aloca_espaco_auth: tns.TypeOf<"uuid">;
          aloca_serie_faturarecibo?: tns.TypeOf<"uuid">;
          aloca_estado: tns.TypeOf<"int2">;
          aloca_dataatualizacao?: tns.TypeOf<"timestamptz">;
          aloca_posto_id: tns.TypeOf<"uuid">;
          aloca_montante: tns.TypeOf<"float8">;
          _branch_uid?: tns.TypeOf<"uuid">;
          aloca_serie_fatura?: tns.TypeOf<"uuid">;
          aloca_colaborador_id: tns.TypeOf<"uuid">;
          aloca_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          aloca_id: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace entrada {
        export interface PropsTyped<
          T extends { [K in "tweeks.entrada.entrada_metadata"]?: T[K] },
        > {
          entrada_descricao?: tns.TypeOf<"varchar">;
          entrada_custounitario?: tns.TypeOf<"float8">;
          entrada_colaborador_id?: tns.TypeOf<"uuid">;
          entrada_id?: tns.TypeOf<"uuid">;
          entrada_metadata?: T["tweeks.entrada.entrada_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.entrada.entrada_metadata"];
          entrada_artigo_id?: tns.TypeOf<"uuid">;
          entrada_quantidade?: tns.TypeOf<"float8">;
          entrada_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          entrada_quantidadeinicial?: tns.TypeOf<"float8">;
          entrada_dataatualizacao?: tns.TypeOf<"timestamptz">;
          entrada_guia_id?: tns.TypeOf<"uuid">;
          entrada_validade?: tns.TypeOf<"date">;
          entrada_quantidadefinal?: tns.TypeOf<"float8">;
          entrada_espaco_auth?: tns.TypeOf<"uuid">;
          entrada_estado?: tns.TypeOf<"int2">;
          entrada_dataregistro?: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          entrada_espaco_destino?: tns.TypeOf<"uuid">;
          entrada_lote?: tns.TypeOf<"varchar">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          entrada_colaborador_id: tns.TypeOf<"uuid">;
          entrada_id: tns.TypeOf<"uuid">;
          entrada_artigo_id: tns.TypeOf<"uuid">;
          entrada_quantidade: tns.TypeOf<"float8">;
          entrada_quantidadeinicial: tns.TypeOf<"float8">;
          entrada_guia_id: tns.TypeOf<"uuid">;
          entrada_espaco_auth: tns.TypeOf<"uuid">;
          entrada_estado: tns.TypeOf<"int2">;
          entrada_dataregistro: tns.TypeOf<"timestamptz">;
          entrada_espaco_destino: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<
          T extends { [K in "tweeks.entrada.entrada_metadata"]?: T[K] },
        > {
          entrada_descricao?: tns.TypeOf<"varchar">;
          entrada_custounitario?: tns.TypeOf<"float8">;
          entrada_colaborador_id: tns.TypeOf<"uuid">;
          entrada_id: tns.TypeOf<"uuid">;
          entrada_metadata?: T["tweeks.entrada.entrada_metadata"] extends never
            ? tns.TypeOf<"json">
            : T["tweeks.entrada.entrada_metadata"];
          entrada_artigo_id: tns.TypeOf<"uuid">;
          entrada_quantidade: tns.TypeOf<"float8">;
          entrada_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          entrada_quantidadeinicial: tns.TypeOf<"float8">;
          entrada_dataatualizacao?: tns.TypeOf<"timestamptz">;
          entrada_guia_id: tns.TypeOf<"uuid">;
          entrada_validade?: tns.TypeOf<"date">;
          entrada_quantidadefinal?: tns.TypeOf<"float8">;
          entrada_espaco_auth: tns.TypeOf<"uuid">;
          entrada_estado: tns.TypeOf<"int2">;
          entrada_dataregistro: tns.TypeOf<"timestamptz">;
          _branch_uid?: tns.TypeOf<"uuid">;
          entrada_espaco_destino: tns.TypeOf<"uuid">;
          entrada_lote?: tns.TypeOf<"varchar">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }

      export namespace fornecedor {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          fornecedor_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          fornecedor_nome?: tns.TypeOf<"varchar">;
          fornecedor_estado?: tns.TypeOf<"int2">;
          fornecedor_dataregistro?: tns.TypeOf<"timestamptz">;
          fornecedor_email?: tns.TypeOf<"varchar">;
          fornecedor_espaco_auth?: tns.TypeOf<"uuid">;
          fornecedor_code?: tns.TypeOf<"varchar">;
          fornecedor_colaborador_id?: tns.TypeOf<"uuid">;
          fornecedor_nif?: tns.TypeOf<"varchar">;
          fornecedor_contacto?: tns.TypeOf<"varchar">;
          fornecedor_endereco?: tns.TypeOf<"varchar">;
          fornecedor_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          fornecedor_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export interface RefsTyped<T extends { [K in never]?: T[K] }> {}

        export interface NOTNULLTyped<T extends { [K in never]?: T[K] }> {
          fornecedor_id: tns.TypeOf<"uuid">;
          fornecedor_estado: tns.TypeOf<"int2">;
          fornecedor_dataregistro: tns.TypeOf<"timestamptz">;
          fornecedor_espaco_auth: tns.TypeOf<"uuid">;
          fornecedor_colaborador_id: tns.TypeOf<"uuid">;
        }

        export interface EntryTyped<T extends { [K in never]?: T[K] }> {
          fornecedor_id: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
          fornecedor_nome?: tns.TypeOf<"varchar">;
          fornecedor_estado: tns.TypeOf<"int2">;
          fornecedor_dataregistro: tns.TypeOf<"timestamptz">;
          fornecedor_email?: tns.TypeOf<"varchar">;
          fornecedor_espaco_auth: tns.TypeOf<"uuid">;
          fornecedor_code?: tns.TypeOf<"varchar">;
          fornecedor_colaborador_id: tns.TypeOf<"uuid">;
          fornecedor_nif?: tns.TypeOf<"varchar">;
          fornecedor_contacto?: tns.TypeOf<"varchar">;
          fornecedor_endereco?: tns.TypeOf<"varchar">;
          fornecedor_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          fornecedor_dataatualizacao?: tns.TypeOf<"timestamptz">;
        }

        export type Props = PropsTyped<any>;
        export type Refs = RefsTyped<any>;
        export type NOTNULL = NOTNULLTyped<any>;
        export type Entry = EntryTyped<any>;
      }
    }
  }

  export namespace maps {
    export namespace _Cluster {
      export interface TableMaps<T extends { [K in TypeProperties]?: T[K] }> {
        branch: Table._Cluster.branch.PropsTyped<T>;
        resource: Table._Cluster.resource.PropsTyped<T>;
        users: Table._Cluster.users.PropsTyped<T>;
        ignore: Table._Cluster.ignore.PropsTyped<T>;
        pull: Table._Cluster.pull.PropsTyped<T>;
        share: Table._Cluster.share.PropsTyped<T>;
        object: Table._Cluster._object.PropsTyped<T>;
        cluster: Table._Cluster.cluster.PropsTyped<T>;
        filter: Table._Cluster.filter.PropsTyped<T>;
        break: Table._Cluster._break.PropsTyped<T>;
        collector: Table._Cluster.collector.PropsTyped<T>;
        version: Table._Cluster.version.PropsTyped<T>;
        classmap: Table._Cluster.classmap.PropsTyped<T>;
        sequence: Table._Cluster.sequence.PropsTyped<T>;
        tperiod: Table._Cluster.tperiod.PropsTyped<T>;
        auth: Table._Cluster.auth.PropsTyped<T>;
      }

      export interface RelationMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        branch: Table._Cluster.branch.PropsTyped<T>;
        resource: Table._Cluster.resource.PropsTyped<T>;
        users: Table._Cluster.users.PropsTyped<T>;
        ignore: Table._Cluster.ignore.PropsTyped<T>;
        pull: Table._Cluster.pull.PropsTyped<T>;
        share: Table._Cluster.share.PropsTyped<T>;
        object: Table._Cluster._object.PropsTyped<T>;
        cluster: Table._Cluster.cluster.PropsTyped<T>;
        filter: Table._Cluster.filter.PropsTyped<T>;
        break: Table._Cluster._break.PropsTyped<T>;
        collector: Table._Cluster.collector.PropsTyped<T>;
        version: Table._Cluster.version.PropsTyped<T>;
        classmap: Table._Cluster.classmap.PropsTyped<T>;
        sequence: Table._Cluster.sequence.PropsTyped<T>;
        tperiod: Table._Cluster.tperiod.PropsTyped<T>;
        auth: Table._Cluster.auth.PropsTyped<T>;
      }
    }

    export namespace _Auth {
      export interface TableMaps<T extends { [K in TypeProperties]?: T[K] }> {
        session: Table._Auth.session.PropsTyped<T>;
        acesso: Table._Auth.acesso.PropsTyped<T>;
        tsexo: Table._Auth.tsexo.PropsTyped<T>;
        privilegio: Table._Auth.privilegio.PropsTyped<T>;
        menu: Table._Auth.menu.PropsTyped<T>;
        colaborador: Table._Auth.colaborador.PropsTyped<T>;
        perfil: Table._Auth.perfil.PropsTyped<T>;
        autenticacao: Table._Auth.autenticacao.PropsTyped<T>;
      }

      export interface RelationMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        session: Table._Auth.session.PropsTyped<T>;
        acesso: Table._Auth.acesso.PropsTyped<T>;
        tsexo: Table._Auth.tsexo.PropsTyped<T>;
        privilegio: Table._Auth.privilegio.PropsTyped<T>;
        menu: Table._Auth.menu.PropsTyped<T>;
        colaborador: Table._Auth.colaborador.PropsTyped<T>;
        perfil: Table._Auth.perfil.PropsTyped<T>;
        autenticacao: Table._Auth.autenticacao.PropsTyped<T>;
      }
    }

    export namespace _Libdom {
      export interface TableMaps<T extends { [K in TypeProperties]?: T[K] }> {
        domsync: Table._Libdom.domsync.PropsTyped<T>;
        entryset: Table._Libdom.entryset.PropsTyped<T>;
      }

      export interface RelationMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        domsync: Table._Libdom.domsync.PropsTyped<T>;
        entryset: Table._Libdom.entryset.PropsTyped<T>;
      }

      export interface CompositeTypeMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        constant: CompositeType._Libdom.constant.PropsTyped<T>;
        domain: CompositeType._Libdom.domain.PropsTyped<T>;
      }
    }

    export namespace _Lib {
      export interface CompositeTypeMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        res: CompositeType._Lib.res.PropsTyped<T>;
        result: CompositeType._Lib.result.PropsTyped<T>;
      }
    }

    export namespace _Map {
      export interface CompositeTypeMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        constant: CompositeType._Map.constant.PropsTyped<T>;
      }
    }

    export namespace _Tweeks {
      export interface TableMaps<T extends { [K in TypeProperties]?: T[K] }> {
        movimento: Table._Tweeks.movimento.PropsTyped<T>;
        transacao: Table._Tweeks.transacao.PropsTyped<T>;
        caixa: Table._Tweeks.caixa.PropsTyped<T>;
        trabalha: Table._Tweeks.trabalha.PropsTyped<T>;
        tserie: Table._Tweeks.tserie.PropsTyped<T>;
        acerto: Table._Tweeks.acerto.PropsTyped<T>;
        taplicar: Table._Tweeks.taplicar.PropsTyped<T>;
        toperacao: Table._Tweeks.toperacao.PropsTyped<T>;
        tlancamento: Table._Tweeks.tlancamento.PropsTyped<T>;
        tipoimposto: Table._Tweeks.tipoimposto.PropsTyped<T>;
        dispoe: Table._Tweeks.dispoe.PropsTyped<T>;
        tatividade: Table._Tweeks.tatividade.PropsTyped<T>;
        retalho: Table._Tweeks.retalho.PropsTyped<T>;
        cliente: Table._Tweeks.cliente.PropsTyped<T>;
        unit: Table._Tweeks.unit.PropsTyped<T>;
        tgrupo: Table._Tweeks.tgrupo.PropsTyped<T>;
        chave: Table._Tweeks.chave.PropsTyped<T>;
        espaco: Table._Tweeks.espaco.PropsTyped<T>;
        atividade: Table._Tweeks.atividade.PropsTyped<T>;
        deposito: Table._Tweeks.deposito.PropsTyped<T>;
        conta: Table._Tweeks.conta.PropsTyped<T>;
        tmovimento: Table._Tweeks.tmovimento.PropsTyped<T>;
        branchmap: Table._Tweeks.branchmap.PropsTyped<T>;
        _temp_forece_table: Table._Tweeks._temp_forece_table.PropsTyped<T>;
        ean: Table._Tweeks.ean.PropsTyped<T>;
        cambio: Table._Tweeks.cambio.PropsTyped<T>;
        autorizacao: Table._Tweeks.autorizacao.PropsTyped<T>;
        tpaga: Table._Tweeks.tpaga.PropsTyped<T>;
        atividadeoperacao: Table._Tweeks.atividadeoperacao.PropsTyped<T>;
        venda: Table._Tweeks.venda.PropsTyped<T>;
        classe: Table._Tweeks.classe.PropsTyped<T>;
        artigo: Table._Tweeks.artigo.PropsTyped<T>;
        lancamento: Table._Tweeks.lancamento.PropsTyped<T>;
        imposto: Table._Tweeks.imposto.PropsTyped<T>;
        guia: Table._Tweeks.guia.PropsTyped<T>;
        link: Table._Tweeks.link.PropsTyped<T>;
        serie: Table._Tweeks.serie.PropsTyped<T>;
        impostovenda: Table._Tweeks.impostovenda.PropsTyped<T>;
        parametrizacao: Table._Tweeks.parametrizacao.PropsTyped<T>;
        custoguia: Table._Tweeks.custoguia.PropsTyped<T>;
        tdocuemto: Table._Tweeks.tdocuemto.PropsTyped<T>;
        taxa: Table._Tweeks.taxa.PropsTyped<T>;
        codigoimposto: Table._Tweeks.codigoimposto.PropsTyped<T>;
        tbranch: Table._Tweeks.tbranch.PropsTyped<T>;
        tposto: Table._Tweeks.tposto.PropsTyped<T>;
        posto: Table._Tweeks.posto.PropsTyped<T>;
        repcolumn: Table._Tweeks.repcolumn.PropsTyped<T>;
        transferencia: Table._Tweeks.transferencia.PropsTyped<T>;
        fluxo: Table._Tweeks.fluxo.PropsTyped<T>;
        tlink: Table._Tweeks.tlink.PropsTyped<T>;
        aloca: Table._Tweeks.aloca.PropsTyped<T>;
        entrada: Table._Tweeks.entrada.PropsTyped<T>;
        fornecedor: Table._Tweeks.fornecedor.PropsTyped<T>;
      }

      export interface RelationMaps<
        T extends { [K in TypeProperties]?: T[K] },
      > {
        movimento: Table._Tweeks.movimento.PropsTyped<T>;
        _vserie: View._Tweeks._vserie.PropsTyped<T>;
        transacao: Table._Tweeks.transacao.PropsTyped<T>;
        caixa: Table._Tweeks.caixa.PropsTyped<T>;
        stock: View._Tweeks.stock.PropsTyped<T>;
        trabalha: Table._Tweeks.trabalha.PropsTyped<T>;
        tserie: Table._Tweeks.tserie.PropsTyped<T>;
        acerto: Table._Tweeks.acerto.PropsTyped<T>;
        taplicar: Table._Tweeks.taplicar.PropsTyped<T>;
        toperacao: Table._Tweeks.toperacao.PropsTyped<T>;
        tlancamento: Table._Tweeks.tlancamento.PropsTyped<T>;
        tipoimposto: Table._Tweeks.tipoimposto.PropsTyped<T>;
        dispoe: Table._Tweeks.dispoe.PropsTyped<T>;
        tatividade: Table._Tweeks.tatividade.PropsTyped<T>;
        retalho: Table._Tweeks.retalho.PropsTyped<T>;
        cliente: Table._Tweeks.cliente.PropsTyped<T>;
        unit: Table._Tweeks.unit.PropsTyped<T>;
        tgrupo: Table._Tweeks.tgrupo.PropsTyped<T>;
        chave: Table._Tweeks.chave.PropsTyped<T>;
        espaco: Table._Tweeks.espaco.PropsTyped<T>;
        atividade: Table._Tweeks.atividade.PropsTyped<T>;
        deposito: Table._Tweeks.deposito.PropsTyped<T>;
        conta: Table._Tweeks.conta.PropsTyped<T>;
        tmovimento: Table._Tweeks.tmovimento.PropsTyped<T>;
        branchmap: Table._Tweeks.branchmap.PropsTyped<T>;
        _temp_forece_table: Table._Tweeks._temp_forece_table.PropsTyped<T>;
        ean: Table._Tweeks.ean.PropsTyped<T>;
        cambio: Table._Tweeks.cambio.PropsTyped<T>;
        autorizacao: Table._Tweeks.autorizacao.PropsTyped<T>;
        tpaga: Table._Tweeks.tpaga.PropsTyped<T>;
        atividadeoperacao: Table._Tweeks.atividadeoperacao.PropsTyped<T>;
        venda: Table._Tweeks.venda.PropsTyped<T>;
        classe: Table._Tweeks.classe.PropsTyped<T>;
        artigo: Table._Tweeks.artigo.PropsTyped<T>;
        lancamento: Table._Tweeks.lancamento.PropsTyped<T>;
        imposto: Table._Tweeks.imposto.PropsTyped<T>;
        branch: View._Tweeks.branch.PropsTyped<T>;
        guia: Table._Tweeks.guia.PropsTyped<T>;
        link: Table._Tweeks.link.PropsTyped<T>;
        serie: Table._Tweeks.serie.PropsTyped<T>;
        impostovenda: Table._Tweeks.impostovenda.PropsTyped<T>;
        parametrizacao: Table._Tweeks.parametrizacao.PropsTyped<T>;
        custoguia: Table._Tweeks.custoguia.PropsTyped<T>;
        tdocuemto: Table._Tweeks.tdocuemto.PropsTyped<T>;
        taxa: Table._Tweeks.taxa.PropsTyped<T>;
        codigoimposto: Table._Tweeks.codigoimposto.PropsTyped<T>;
        tbranch: Table._Tweeks.tbranch.PropsTyped<T>;
        tposto: Table._Tweeks.tposto.PropsTyped<T>;
        posto: Table._Tweeks.posto.PropsTyped<T>;
        repcolumn: Table._Tweeks.repcolumn.PropsTyped<T>;
        transferencia: Table._Tweeks.transferencia.PropsTyped<T>;
        fluxo: Table._Tweeks.fluxo.PropsTyped<T>;
        tlink: Table._Tweeks.tlink.PropsTyped<T>;
        aloca: Table._Tweeks.aloca.PropsTyped<T>;
        entrada: Table._Tweeks.entrada.PropsTyped<T>;
        fornecedor: Table._Tweeks.fornecedor.PropsTyped<T>;
      }

      export interface ViewMaps<T extends { [K in TypeProperties]?: T[K] }> {
        _vserie: View._Tweeks._vserie.PropsTyped<T>;
        stock: View._Tweeks.stock.PropsTyped<T>;
        branch: View._Tweeks.branch.PropsTyped<T>;
      }
    }
  }

  export namespace Type {
    export namespace _Pg_Catalog {}
  }

  export namespace CompositeType {
    export namespace _Lib {
      export namespace res {
        export interface PropsTyped<
          T extends { [K in "lib.res.error" | "lib.res.data"]?: T[K] },
        > {
          level?: tns.TypeOf<"int4">;
          error?: T["lib.res.error"] extends never
            ? tns.TypeOf<"jsonb">
            : T["lib.res.error"];
          result?: tns.TypeOf<"bool">;
          data?: T["lib.res.data"] extends never
            ? tns.TypeOf<"jsonb">
            : T["lib.res.data"];
          message?: tns.TypeOf<"text">;
        }

        export type Props = PropsTyped<any>;
      }

      export namespace result {
        export interface PropsTyped<
          T extends { [K in "lib.result.message"]?: T[K] },
        > {
          message?: T["lib.result.message"] extends never
            ? tns.TypeOf<"jsonb">
            : T["lib.result.message"];
          result?: tns.TypeOf<"bool">;
        }

        export type Props = PropsTyped<any>;
      }
    }

    export namespace _Libdom {
      export namespace constant {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          report_filter_filter_valuemode_daterelative?: tns.TypeOf<"int2">;
          report_filter_state_fechado?: tns.TypeOf<"int2">;
          report_filter_filter_valuemode_dateprocess?: tns.TypeOf<"int2">;
          report_filter_filter_valuemode_samevalue?: tns.TypeOf<"int2">;
          report_filter_filter_valuemode_ask?: tns.TypeOf<"int2">;
          report_filter_state_active?: tns.TypeOf<"int2">;
          report_filter_filter_valuemode_askallways?: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
      }

      export namespace domain {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          report_filter_filter_valuemode_daterelative?: tns.TypeOf<"text">;
          report_filter_state_active?: tns.TypeOf<"text">;
          report_filter_filter_valuemode_samevalue?: tns.TypeOf<"text">;
          report_filter_filter_valuemode_askallways?: tns.TypeOf<"text">;
          report_filter_filter_valuemode_dateprocess?: tns.TypeOf<"text">;
          report_filter_filter_valuemode_ask?: tns.TypeOf<"text">;
          report_filter_state_fechado?: tns.TypeOf<"text">;
        }

        export type Props = PropsTyped<any>;
      }
    }

    export namespace _Map {
      export namespace constant {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          colaborador_token_limit?: tns.TypeOf<"interval">;
          acerto_estado_anulado?: tns.TypeOf<"int2">;
          maguita_espaco_default?: tns.TypeOf<"int2">;
          maguita_ean_estado_fechado?: tns.TypeOf<"int2">;
          maguita_toperacao_venda?: tns.TypeOf<"int2">;
          cluster_grant_revision_supper_path?: tns.TypeOf<"text">;
          tipoimposto_estado_fechado?: tns.TypeOf<"int2">;
          maguita_tgrupo_cnormal?: tns.TypeOf<"int2">;
          colaborador_estado_ativo?: tns.TypeOf<"int2">;
          toperacao_classe_stock?: tns.TypeOf<"int2">;
          maguita_tatividade_destroy?: tns.TypeOf<"int2">;
          maguita_serie_estado_anulado?: tns.TypeOf<"int2">;
          classe_estado_fechado?: tns.TypeOf<"int2">;
          autenticacao_estado_fechado?: tns.TypeOf<"int2">;
          maguita_ean_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tpaga_contacorrente?: tns.TypeOf<"int2">;
          taxa_estado_fechado?: tns.TypeOf<"int2">;
          espaco_estado_ativo?: tns.TypeOf<"int2">;
          maguita_cambio_estado_ativo?: tns.TypeOf<"int2">;
          cluster_auth_status_active?: tns.TypeOf<"int2">;
          maguita_fluxo_estado_anulado?: tns.TypeOf<"int2">;
          stock_estado_fechado?: tns.TypeOf<"int2">;
          entrada_estado_anulado?: tns.TypeOf<"int2">;
          maguita_cliente_finalnotacredito?: tns.TypeOf<"uuid">;
          maguita_tatividade_reativate?: tns.TypeOf<"int2">;
          maguita_tserie_faturarecibo?: tns.TypeOf<"int2">;
          colaborador_system_support?: tns.TypeOf<"uuid">;
          tipoimposto_estado_ativo?: tns.TypeOf<"int2">;
          cluster_treplication_readonly?: tns.TypeOf<"int2">;
          maguita_tserie_faturaproforma?: tns.TypeOf<"int2">;
          maguita_fluxo_estado_fechado?: tns.TypeOf<"int2">;
          mesa_estado_disponivel?: tns.TypeOf<"int2">;
          maguita_tmovimento_credito?: tns.TypeOf<"int2">;
          colaborador_accesso_ativo?: tns.TypeOf<"int2">;
          menu_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tlancamento_outros?: tns.TypeOf<"int2">;
          colaborador_chavemodo_gerado?: tns.TypeOf<"int2">;
          mesa_estado_ocupado?: tns.TypeOf<"int2">;
          maguita_tatividade_access?: tns.TypeOf<"int2">;
          maguita_tatividade_change?: tns.TypeOf<"int2">;
          colaborador_estado_fechado?: tns.TypeOf<"int2">;
          maguita_tatividade_delete?: tns.TypeOf<"int2">;
          maguita_tserie_guiaentrada?: tns.TypeOf<"int2">;
          maguita_toperacao_pagamento?: tns.TypeOf<"int2">;
          mesa_estado_desativado?: tns.TypeOf<"int2">;
          maguita_fluxo_estado_ativo?: tns.TypeOf<"int2">;
          maguita_conta_estado_anulado?: tns.TypeOf<"int2">;
          maguita_posto_estado_encerado?: tns.TypeOf<"int2">;
          cluster_break_status_rejected?: tns.TypeOf<"int2">;
          maguita_venda_estado_aberto?: tns.TypeOf<"int2">;
          maguita_lancamento_estado_anulado?: tns.TypeOf<"int2">;
          maguita_tserie_notadebito?: tns.TypeOf<"int2">;
          acesso_estado_fechado?: tns.TypeOf<"int2">;
          maguita_guia_estado_ativo?: tns.TypeOf<"int2">;
          classe_itemextra?: tns.TypeOf<"uuid">;
          maguita_tserie_notacredito?: tns.TypeOf<"int2">;
          maguita_posto_estado_aberto?: tns.TypeOf<"int2">;
          maguita_tserie_recibo?: tns.TypeOf<"int2">;
          colaborador_accesso_pendente?: tns.TypeOf<"int2">;
          menu_maxchildren?: tns.TypeOf<"int2">;
          maguita_toperacao_transferencia?: tns.TypeOf<"int2">;
          maguita_tserie_faturasimplificada?: tns.TypeOf<"int2">;
          maguita_tguia_saida?: tns.TypeOf<"int2">;
          autenticacao_chave_length?: tns.TypeOf<"int2">;
          maguita_tserie_guiasaida?: tns.TypeOf<"int2">;
          colaborador_token_length?: tns.TypeOf<"int2">;
          cluster_grant_revision_child?: tns.TypeOf<"varchar">;
          maguita_conta_estado_fechado?: tns.TypeOf<"int2">;
          precario_estado_fechado?: tns.TypeOf<"int2">;
          maguita_caixa_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tlink_classe?: tns.TypeOf<"int2">;
          maguita_posto_caixamodo_espaco?: tns.TypeOf<"int2">;
          perfil_estado_ativo?: tns.TypeOf<"int2">;
          transferencia_estado_ativo?: tns.TypeOf<"int2">;
          cluster_tree_position_branch?: tns.TypeOf<"int2">;
          maguita_aloca_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tserie_fatura?: tns.TypeOf<"int2">;
          acesso_estado_ativo?: tns.TypeOf<"int2">;
          acerto_estado_ativo?: tns.TypeOf<"int2">;
          item_estado_ativo?: tns.TypeOf<"int2">;
          maguita_atividadeoperacao_estado_fechado?: tns.TypeOf<"int2">;
          cluster_tcluster_master?: tns.TypeOf<"int2">;
          tespaco_armazem?: tns.TypeOf<"int2">;
          maguita_link_estado_ativo?: tns.TypeOf<"int2">;
          maguita_link_estado_fechado?: tns.TypeOf<"int2">;
          maguita_atividade_estado_ativo?: tns.TypeOf<"int2">;
          maguita_aloca_estado_fechado?: tns.TypeOf<"int2">;
          maguita_tmovimento_debito?: tns.TypeOf<"int2">;
          privilegio_estado_fechado?: tns.TypeOf<"int2">;
          colaborador_chavemodo_utilizador?: tns.TypeOf<"int2">;
          cluster_tcluster_local?: tns.TypeOf<"int2">;
          maguita_espaco_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tlancamento_conta?: tns.TypeOf<"int2">;
          cluster_tcluster_child?: tns.TypeOf<"int2">;
          colaborador_tipo_system?: tns.TypeOf<"int2">;
          maguita_conta_estado_aberto?: tns.TypeOf<"int2">;
          maguita_tguia_entrada?: tns.TypeOf<"int2">;
          precario_estado_ativo?: tns.TypeOf<"int2">;
          menu_estado_fechado?: tns.TypeOf<"int2">;
          maguita_imposto_estado_fechado?: tns.TypeOf<"int2">;
          maguita_autorizacao_estado_fechado?: tns.TypeOf<"int2">;
          maguita_cliente_estado_desativo?: tns.TypeOf<"int2">;
          maguita_tatividade_create?: tns.TypeOf<"int2">;
          maguita_unit_state_fechado?: tns.TypeOf<"int2">;
          colaborador_tipo_user_master?: tns.TypeOf<"int2">;
          maguita_venda_estado_canselado?: tns.TypeOf<"int2">;
          cluster_treplication_replicate?: tns.TypeOf<"int2">;
          maguita_unit_state_active?: tns.TypeOf<"int2">;
          maguita_venda_estadopreparacao_pendente?: tns.TypeOf<"int2">;
          autenticacao_estado_ativo?: tns.TypeOf<"int2">;
          maguita_posto_caixamodo_pessoal?: tns.TypeOf<"int2">;
          maguita_venda_estado_anulado?: tns.TypeOf<"int2">;
          cluster_grant_revision_sub_path?: tns.TypeOf<"varchar">;
          artigo_estado_ativo?: tns.TypeOf<"int2">;
          maguita_toperacao_entrada?: tns.TypeOf<"int2">;
          maguita_trabalha_estado_fechado?: tns.TypeOf<"int2">;
          colaborador_chavemodo_padrao?: tns.TypeOf<"int2">;
          maguita_tpaga_transferencia?: tns.TypeOf<"int2">;
          maguita_retalho_estado_ativo?: tns.TypeOf<"int2">;
          dispoe_estado_fechado?: tns.TypeOf<"int2">;
          maguita_tpaga_deposito?: tns.TypeOf<"int2">;
          maguita_lancamento_mode_manual?: tns.TypeOf<"int2">;
          movimento_estado_ativo?: tns.TypeOf<"int2">;
          maguita_posto_estado_fechado?: tns.TypeOf<"int2">;
          maguita_fornecedor_estado_ativo?: tns.TypeOf<"int2">;
          movimento_estado_anulado?: tns.TypeOf<"int2">;
          maguita_cliente_estado_ativo?: tns.TypeOf<"int2">;
          maguita_atividadeoperacao_estado_ativo?: tns.TypeOf<"int2">;
          impostovenda_estado_fechado?: tns.TypeOf<"int2">;
          maguita_toperacao_acerto?: tns.TypeOf<"int2">;
          maguita_tlink_associacao?: tns.TypeOf<"int2">;
          colaborador_system_data?: tns.TypeOf<"uuid">;
          colaborador_accesso_fechado?: tns.TypeOf<"int2">;
          privilegio_estado_ativo?: tns.TypeOf<"int2">;
          item_estado_fechado?: tns.TypeOf<"int2">;
          maguita_lancamento_mode_automatic?: tns.TypeOf<"int2">;
          maguita_serie_estado_fechado?: tns.TypeOf<"int2">;
          maguita_venda_estadopreparacao_preparado?: tns.TypeOf<"int2">;
          tposto_venda?: tns.TypeOf<"int2">;
          toperacao_classe_montante?: tns.TypeOf<"int2">;
          cluster_auth_status_close?: tns.TypeOf<"int2">;
          maguita_fornecedor_estado_fechado?: tns.TypeOf<"int2">;
          maguita_taplicar_retirar?: tns.TypeOf<"int2">;
          tposto_tudo?: tns.TypeOf<"int2">;
          stock_estado_ativo?: tns.TypeOf<"int2">;
          classe_estado_ativo?: tns.TypeOf<"int2">;
          maguita_venda_estado_fechado?: tns.TypeOf<"int2">;
          maguita_trabalha_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tpaga_cheque?: tns.TypeOf<"int2">;
          maguita_taplicar_adicionar?: tns.TypeOf<"int2">;
          taxa_estado_ativo?: tns.TypeOf<"int2">;
          maguita_caixa_estado_fechado?: tns.TypeOf<"int2">;
          maguita_tgrupo_ccorrente?: tns.TypeOf<"int2">;
          maguita_serie_estado_ativo?: tns.TypeOf<"int2">;
          colaborador_tipo_user?: tns.TypeOf<"int2">;
          cluster_break_status_pendent?: tns.TypeOf<"int2">;
          impostovenda_estado_ativo?: tns.TypeOf<"int2">;
          maguita_posto_caixamodo_posto?: tns.TypeOf<"int2">;
          cambio_estado_fechado?: tns.TypeOf<"int2">;
          menu_raizcomplete?: tns.TypeOf<"varchar">;
          maguita_imposto_estado_ativo?: tns.TypeOf<"int2">;
          cluster_tree_position_trunc?: tns.TypeOf<"int2">;
          maguita_custoguia_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tlink_preco?: tns.TypeOf<"int2">;
          maguita_lancamento_estado_ativo?: tns.TypeOf<"int2">;
          currency_std?: tns.TypeOf<"int2">;
          entrada_estado_ativo?: tns.TypeOf<"int2">;
          perfil_estado_fechado?: tns.TypeOf<"int2">;
          espaco_default?: tns.TypeOf<"int2">;
          maguita_cambio_estado_fechado?: tns.TypeOf<"int2">;
          maguita_toperacao_retalho?: tns.TypeOf<"int2">;
          maguita_transacao_estado_ativo?: tns.TypeOf<"int2">;
          maguita_tpaga_cash?: tns.TypeOf<"int2">;
          maguita_tatividade_disable?: tns.TypeOf<"int2">;
          movimento_estado_canselado?: tns.TypeOf<"int2">;
          maguita_tlancamento_deposito?: tns.TypeOf<"int2">;
          artigo_estado_fechado?: tns.TypeOf<"int2">;
          cluster_tcluster_remote?: tns.TypeOf<"int2">;
          cambio_estado_anulado?: tns.TypeOf<"int2">;
          maguita_cambio_estado_anulado?: tns.TypeOf<"int2">;
          dispoe_estado_ativo?: tns.TypeOf<"int2">;
          tespaco_venda?: tns.TypeOf<"int2">;
          maguita_custoguia_estado_canselado?: tns.TypeOf<"int2">;
          maguita_parametrizacao_estado_ativo?: tns.TypeOf<"int2">;
          maguita_deposito_estado_ativo?: tns.TypeOf<"int2">;
          cambio_estado_ativo?: tns.TypeOf<"int2">;
          tposto_cobranca?: tns.TypeOf<"int2">;
          maguita_autorizacao_estado_ativo?: tns.TypeOf<"int2">;
          maguita_cliente_final?: tns.TypeOf<"uuid">;
          cluster_break_status_solved?: tns.TypeOf<"int2">;
          transferencia_estado_aanulado?: tns.TypeOf<"int2">;
          espaco_estado_fechado?: tns.TypeOf<"int2">;
          maguita_toperacao_movimento?: tns.TypeOf<"int2">;
          money_round?: tns.TypeOf<"int4">;
          maguita_atividade_estado_fechado?: tns.TypeOf<"int2">;
          maguita_parametrizacao_estado_fechado?: tns.TypeOf<"int2">;
          maguita_espaco_estado_fechado?: tns.TypeOf<"int2">;
        }

        export type Props = PropsTyped<any>;
      }
    }
  }

  export namespace View {
    export namespace _Tweeks {
      export namespace _vserie {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          serie_dataregistro?: tns.TypeOf<"timestamptz">;
          serie_sequencia?: tns.TypeOf<"int4">;
          serie_colaborador_atualizacao?: tns.TypeOf<"uuid">;
          serie_quantidade?: tns.TypeOf<"int4">;
          serie_designacao?: tns.TypeOf<"varchar">;
          serie_estado?: tns.TypeOf<"int2">;
          _serie_estado?: tns.TypeOf<"int2">;
          serie_colaborador_id?: tns.TypeOf<"uuid">;
          serie_id?: tns.TypeOf<"uuid">;
          serie_espaco_auth?: tns.TypeOf<"uuid">;
          serie_espaco_branch?: tns.TypeOf<"uuid">;
          serie_tserie_id?: tns.TypeOf<"int2">;
          serie_numero?: tns.TypeOf<"varchar">;
          serie_dataatualizacao?: tns.TypeOf<"timestamptz">;
          serie_espaco_id?: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
      }

      export namespace stock {
        export interface PropsTyped<T extends { [K in never]?: T[K] }> {
          stock_quantidade?: tns.TypeOf<"float8">;
          espaco_id?: tns.TypeOf<"uuid">;
          artigo_id?: tns.TypeOf<"uuid">;
          _branch_uid?: tns.TypeOf<"uuid">;
        }

        export type Props = PropsTyped<any>;
      }

      export namespace branch {
        export interface PropsTyped<
          T extends {
            [K in
              | "tweeks.branch.branch_grants"
              | "tweeks.branch.branch_workspace"
              | "tweeks.branch.branch_user"
              | "tweeks.branch.branch_licence"]?: T[K];
          },
        > {
          branch_main_workspace?: tns.TypeOf<"uuid">;
          branch_tbranch_id?: tns.TypeOf<"int2">;
          branch_uid?: tns.TypeOf<"uuid">;
          branch_grants?: T["tweeks.branch.branch_grants"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.branch.branch_grants"];
          branch_workspace?: T["tweeks.branch.branch_workspace"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.branch.branch_workspace"];
          branch_user?: T["tweeks.branch.branch_user"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.branch.branch_user"];
          branch_update?: tns.TypeOf<"timestamptz">;
          branch_main_user?: tns.TypeOf<"uuid">;
          branch_path?: tns.TypeOf<"varchar">;
          branch_state?: tns.TypeOf<"int2">;
          branch_date?: tns.TypeOf<"timestamptz">;
          branch_licence?: T["tweeks.branch.branch_licence"] extends never
            ? tns.TypeOf<"jsonb">
            : T["tweeks.branch.branch_licence"];
          branch_name?: tns.TypeOf<"varchar">;
          _branch_uid?: tns.TypeOf<"uuid">;
          branch_clusters?: tns.TypeOf<"varchar">[];
        }

        export type Props = PropsTyped<any>;
      }
    }
  }
}

export default rns;
