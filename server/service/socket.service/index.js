"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const args_1 = require("../../global/args");
const { server } = require('../web.service');
const { K } = require('../../global/autogen/K');
const socket_io_1 = require("socket.io");
exports.io = new socket_io_1.Server(server, {
    path: "/MGT",
});
({
    [K.RUN_LOCATION_LOCAL]: () => {
        console.log("K.RUN_LOCATION_LOCAL");
        // io.set( 'origins', '*:*' );
    },
    [K.RUN_LOCATION_SERVER]: () => {
        console.log("K.RUN_LOCATION_SERVER");
    }
})[args_1.args.appLocation]();
({
    http: () => {
        console.log("SOCKET http");
    },
    https: () => {
        console.log("SOCKET https");
    }
})[args_1.args.webProtocol]();
//# sourceMappingURL=index.js.map