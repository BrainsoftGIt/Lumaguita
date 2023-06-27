"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// if ( [ "test", "prod" ].includes( args.appMode ) && !!args.webDomain ) {
//     const { DEFAULTS } = require( "../../../global/defaults" );
//     const { proxyAgent } = require("./vhp")
//     const proxy = proxyAgent( {
//         auth:{
//             applicationId: `${require('../../../../package.json' ).name}:${ args.appMode }`
//         }
//     });
//     proxy.connection.on( "connect", () => {
//         proxy.linkPort( args.appPort, {
//             hosts: [ `${ args.webDomain }`, `*.${ args.webDomain }` ],
//             address: "127.0.0.1",
//             name: `${ DEFAULTS.APP }:${ args.app }`,
//         }, "replace" ).then( result => {
//             console.log( "linkPort:result", result )
//         })
//     })
// }
//# sourceMappingURL=vhost.js.map