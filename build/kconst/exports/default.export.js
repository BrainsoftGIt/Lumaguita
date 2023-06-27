"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.CLUSTER_DEFAULT = "app.maguita.brainsoft.st";
    exports(index_1.targets.KNode);
    //Socket auth methods
    index_1.K.SOCKET_AUTH_CLUSTER = SELF_NAME;
    exports(index_1.targets.KNode);
    index_1.K.SOCKET_AUTH_CLIENT = SELF_NAME;
    exports(index_1.targets.KNode);
    index_1.K.RUN_LOCATION_LOCAL = "local";
    exports(index_1.targets.KNode);
    index_1.K.RUN_LOCATION_SERVER = "server";
    exports(index_1.targets.KNode);
});
//# sourceMappingURL=default.export.js.map