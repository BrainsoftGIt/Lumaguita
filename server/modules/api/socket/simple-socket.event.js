"use strict";
// (()=>{
//     const { authIO, io } = require( '../../../service/socket.service' );
//     const { Package, Pendentes} = require("./funcs/packages")
//     const {srv} = require("../../../global/autogen/config/srv");
//     /**
//      * @param authData { * }
//      * @param socket { Socket }
//      * @return {*}
//      */
//     const register = function( authData, socket  ){
//         const _chanel = authData[ srv.SOCKET.SOCKET_CHANEL ];
//         let arrayChanel = (Array.isArray(_chanel) ? _chanel : [_chanel]);
//         console.log(authData);
//         arrayChanel.forEach(function (chanel) {
//             socket.join(  chanel );
//
//             io.sockets.to( chanel ).emit( srv.SOCKET.SOCKET_EVENT_REGISTER, { result:true } );
//
//             let datas = Pendentes.getPendentes(chanel);
//             if( datas.length > 0){
//                 datas.forEach(function (data, index) {
//                     if( !Pendentes.intent_isValida(data, index) ){
//                         return false;
//                     }
//                     if(!Pendentes.listUserToIntentePendente[chanel][data.key]){
//                         return true;
//                     }
//                     if( ( Pendentes.listUserToIntentePendente[chanel][data.key] || [] ).includes( ( authData.auth_id || "*" ).toString())
//                         || ( Pendentes.listUserToIntentePendente[chanel][data.key] || [] ).includes("*")) {
//                         let package_data = new Package(data);
//                         io.sockets.to( chanel ).emit(package_data.intent, data);
//                     }
//                 });
//             }
//         });
//         return true;
//     }
//
//     authIO.onAuthenticatedAny( (authMethod, socket, response, auth) => {
//
//     });
//
//     authIO.onAuthenticated( srv.SOCKET.SOCKET_TYPE.CLIENT_SOCKET.AUTHMETHOD, (socket, response, auth) => {
//         register( auth.data, socket);
//
//         socket.on( "*", ( event, data ) =>{
//         });
//
//         socket.on('disconnect', function(chanel) {
//             console.log( "disconnect", socket.id );
//         });
//
//         socket.on( srv.SOCKET.SOCKET_EVENT_REGISTER, function ( registerData ) {
//
//         });
//
//         socket.on( srv.SOCKET.SOCKET_EVENT_PACKAGE, function ( registerData ) {
//             let package_data = new Package(registerData);
//             package_data.key = Math.random() * 100000000;
//             package_data.dateSystem = new Date();
//
//             Pendentes.addPendente(package_data, () => {
//                 let channel = package_data.destine;
//                 io.sockets.to( channel ).emit( package_data.intent, package_data );
//
//                 console.log(registerData);
//             })
//         });
//
//         socket.on( srv.SOCKET.SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE, function ( registerData ) {
//             let package_data = new Package(registerData);
//             Pendentes.removePendentes(package_data.destine, package_data.key, ( registerData.auth_id || "*"));
//         });
//
//         /**
//          * Remover o registro de um canal
//          * @namespace socket.leave
//          */
//         socket.on( srv.SOCKET.SOCKET_EVENT_UNREGISTER, function ( unregisterData ) {
//             var chanel = unregisterData[ srv.SOCKET_CHANEL ];
//             socket.leave( chanel );
//         });
//
//         let umaHora = 3600000;
//         setTimeout(function () {
//             Pendentes.list.forEach(function (datas) {
//                 if(datas && datas.length > 0){
//                     datas.forEach(function (data, index) {
//                         Pendentes.intent_isValida(data, index);
//                     });
//                 }
//             });
//         }, umaHora * 24);
//     });
//
// })();
//# sourceMappingURL=simple-socket.event.js.map