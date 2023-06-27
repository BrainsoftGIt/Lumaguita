import {K, kconst, targets} from "../../index";


kconst.declares( (exports, override, SELF_NAME, props) => {
    K.SERVER = {
        PORT: 49278,
        SESSION: {
            COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
            SECRETE: "1234",
            tableName: "session",
            schemaName: "auth"
        },
    }; exports( targets.srvConfig );
})

kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.SERVER = {
            PORT: 39278,
            SESSION: {
                COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
                SECRETE: "1234",
                tableName: "session",
                schemaName: "auth"
            },
        }; exports( targets.srvConfig );
    })
}, { mode: "prod" })

kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.SERVER = {
            PORT: 3210,
            SESSION: {
                COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
                SECRETE: "1234",
                tableName: "session",
                schemaName: "auth"
            },
        }; exports( targets.srvConfig );
    })
}, { mode: [ "public", "exe" ] })
