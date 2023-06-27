"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.STATE_ACTIVE = 1;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.STATE_PENDENT = 2;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.STATE_DISABLE = 0;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.STATE_HIDDEN = -1;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
});
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.clinic_item_type_avaliacao = 1;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.clinic_item_type_exame = 2;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.clinic_item_type_receita = 3;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.clinic_item_type_tconsulta = 4;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.clinic_item_type_tpacient = 5;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
    index_1.K.clinic_item_type_tschedule = 6;
    exports(index_1.targets.srvDBK, index_1.targets.webDBK);
});
//# sourceMappingURL=dbk.export.js.map