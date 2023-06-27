import {K, kconst} from "../../index";

kconst.declares( (exports, override, SELF_NAME, props) => {
    K.MAIL = {
        name: "", // nome,
        email: "example@brainsoft.st", // email remetente
        pwd: '', // password email
        host: '', // servidor email
        port: 465, // porta servidor
        secure: true, //autenticação https
    }
});