"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.SERVER = {
        PORT: 49278,
        SESSION: {
            COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
            SECRETE: "1234",
            tableName: "session",
            schemaName: "auth"
        },
    };
    exports(index_1.targets.srvConfig);
});
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.SERVER = {
            PORT: 39278,
            SESSION: {
                COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
                SECRETE: "1234",
                tableName: "session",
                schemaName: "auth"
            },
        };
        exports(index_1.targets.srvConfig);
    });
}, { mode: "prod" });
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.SERVER = {
            PORT: 3210,
            SESSION: {
                COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
                SECRETE: "1234",
                tableName: "session",
                schemaName: "auth"
            },
        };
        exports(index_1.targets.srvConfig);
    });
}, { mode: ["public", "exe"] });
//# sourceMappingURL=srv.configs.export.js.map