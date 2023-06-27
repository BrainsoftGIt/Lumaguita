"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.SOCKET = {
        AUTH_METHOD: "method",
        EVENT_AUTHENTICATION: "authentication",
        SERVERAPP: {
            PROTOCOL: "http",
            HOST: "localhost",
            PORT: 49278
        },
        SOCKET_TYPE: {
            CLIENT_SOCKET: {
                AUTHMETHOD: "CLIENT_AUTHMETHOD",
                CHANNEL: "CLIENT_CHANNEL"
            }
        },
        SOCKET_EVENT_REGISTER: "SOCKET_EVENT_REGISTER",
        SOCKET_EVENT_PACKAGE: "SOCKET_EVENT_PACKAGE",
        SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE: "SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE",
        SOCKET_EVENT_UNREGISTER: "SOCKET_EVENT_UNREGISTER",
        SOCKET_CHANEL: "SOCKET_CHANEL",
    };
    exports(index_1.targets.srvConfig, index_1.targets.web);
});
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.SOCKET = {
            AUTH_METHOD: "method",
            EVENT_AUTHENTICATION: "authentication",
            SERVERAPP: {
                PROTOCOL: "http",
                HOST: "localhost",
                PORT: 39278
            },
            SOCKET_TYPE: {
                CLIENT_SOCKET: {
                    AUTHMETHOD: "CLIENT_AUTHMETHOD",
                    CHANNEL: "CLIENT_CHANNEL"
                }
            },
            SOCKET_EVENT_REGISTER: "SOCKET_EVENT_REGISTER",
            SOCKET_EVENT_PACKAGE: "SOCKET_EVENT_PACKAGE",
            SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE: "SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE",
            SOCKET_EVENT_UNREGISTER: "SOCKET_EVENT_UNREGISTER",
            SOCKET_CHANEL: "SOCKET_CHANEL",
        };
        exports(index_1.targets.srvConfig, index_1.targets.web);
    });
}, { mode: "prod" });
//# sourceMappingURL=sokect.config.export.js.map