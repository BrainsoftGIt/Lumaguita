import {K, kconst, targets} from "../index";



kconst.declares( (exports, override, SELF_NAME, props) => {
    K.STATE_ACTIVE = 1; exports( targets.srvDBK, targets.webDBK );
    K.STATE_PENDENT = 2; exports( targets.srvDBK, targets.webDBK );
    K.STATE_DISABLE = 0; exports( targets.srvDBK, targets.webDBK );
    K.STATE_HIDDEN = -1; exports( targets.srvDBK, targets.webDBK );
})



kconst.declares( (exports, override, SELF_NAME, props) => {
    K.clinic_item_type_avaliacao = 1; exports( targets.srvDBK, targets.webDBK );
    K.clinic_item_type_exame = 2; exports( targets.srvDBK, targets.webDBK );
    K.clinic_item_type_receita = 3; exports( targets.srvDBK, targets.webDBK );
    K.clinic_item_type_tconsulta = 4; exports( targets.srvDBK, targets.webDBK );
    K.clinic_item_type_tpacient = 5; exports( targets.srvDBK, targets.webDBK );
    K.clinic_item_type_tschedule = 6; exports( targets.srvDBK, targets.webDBK );
})
