"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "no-block", flags: ["@unique"] }).sql `


  alter table cluster.collector drop constraint fk_collector_to_share;
  alter table cluster.object drop constraint fk_objecto_to_share;
  alter table cluster.version drop constraint fk_version_to_share;

  with __skips as (
    select *
    from unnest( array[
      'cluster.branch',
      'tweeks.branch',
      'tweeks.espaco',
      'auth.colaborador',
      'auth.acesso',
      'auth.privilegio',
      'auth.perfil',
      'tweeks.trabalha'
      ]::text[]) s( classname )
  ) delete from cluster.share s
  where s.share_regclass not in (
    select _s.classname
    from __skips _s
  );
           

-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.movimento', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.taxa', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.transacao', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.artigo', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.caixa', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.classe', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.conta', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.posto', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.venda', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.acerto', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.deposito', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.cambio', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.dispoe', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.entrada', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.fornecedor', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.imposto', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.impostovenda', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.trabalha', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.transferencia', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.taplicar', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.tipoimposto', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.chave', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.aloca', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.ean', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.cliente', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.lancamento', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.retalho', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.fluxo', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.serie', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.link', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('cluster.resource', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.guia', true, true);
-- INSERT INTO cluster.share (share_regclass, share_insert, share_update) VALUES ('tweeks.custoguia', true, true);
`;
//# sourceMappingURL=0002-no-share.sql.js.map