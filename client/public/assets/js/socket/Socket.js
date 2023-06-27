let SOCKET = Config.SOCKET;
let socket = {
    auth_id: $("[posto]").text(),
    initSocket : (user) => {
        console.log( "Chmando....." );
        socket.user = user;
        socket.io = io(`${SOCKET.SERVERAPP.PROTOCOL}://${SOCKET.SERVERAPP.HOST}:${SOCKET.SERVERAPP.PORT}/client`, {
            path: "MGT"
        });
        socket.io.on("connect", function (){
            let data = {
                auth_id : socket.auth_id
            };

            data[SOCKET.SOCKET_CHANEL] = [`${SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL}:${data.auth_id}`, SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL];
            data[SOCKET.AUTH_METHOD] = SOCKET.SOCKET_TYPE.CLIENT_SOCKET.AUTHMETHOD;
            socket.io.emit("authentication", data);

            socket.io.on("CREATE/UPDATE:ACCOUNT", (response) => {
                if(location.pathname.includes("pos")){
                    account.loadOpenAccounts();
                   // M.toast({html: 'Conta atualizada com sucesso!', classes: 'rounded'});
                }
                console.log(response);
                socket.io.emit(SOCKET.SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE, response);
            });
            socket.io.on("postChange", (response) => {
                console.log(response);
                if(!location.href.includes("admin")){
                        account.loadPost();
                }
                socket.io.emit(SOCKET.SOCKET_EVENT_PACKAGE_REMOVE_TO_PENDENTE, response);
            });
        });
    },
    sendNotification : () => {
        let packege = new Package();
        packege.origin = `${SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL}:${socket.auth_id}`;
        packege.destine = `${SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL}`;
        packege.intent = `showNotification`;
        packege.data = {
            title : "hdhhd",
            body : "ffjjfjfjfjf jjfjf",
            data : ["hheheh", "ffhhfhf"]
        };
        socket.io.emit(SOCKET.SOCKET_EVENT_PACKAGE, packege)
    },
    sendPostChange(){
        let socketPackage = new Package();
        socketPackage.origin = `${SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL}:32323232323`;
        socketPackage.destine = `${SOCKET.SOCKET_TYPE.CLIENT_SOCKET.CHANNEL}`;
        socketPackage.intent = `postChange`;
        socketPackage.data = [];
        socket.io.emit(SOCKET.SOCKET_EVENT_PACKAGE, socketPackage);
    }
}
socket.initSocket();