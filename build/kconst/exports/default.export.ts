import {K, kconst, targets} from "../index";

kconst.declares( (exports, override, SELF_NAME:string, props) => {

    K.CLUSTER_DEFAULT = "app.maguita.brainsoft.st"; exports( targets.KNode );



    //Socket auth methods
    K.SOCKET_AUTH_CLUSTER = SELF_NAME; exports( targets.KNode );
    K.SOCKET_AUTH_CLIENT = SELF_NAME; exports( targets.KNode );
    K.RUN_LOCATION_LOCAL = "local"; exports( targets.KNode );
    K.RUN_LOCATION_SERVER = "server"; exports( targets.KNode );

})
