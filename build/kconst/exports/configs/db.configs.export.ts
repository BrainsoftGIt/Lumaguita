import {K, kconst, targets} from "../../index";

//Configuração do banco de dados padrão
kconst.declares( (exports, override, SELF_NAME, props) => {
    K.dbConfig = {
        database: "maguita_uuid", // database name,
        user: "maguita", //user name database connection
        userClone: "maguita_clone", //user name database connection
        password: "1234", // password database connection15
        host: "localhost", //host database connection
        port: 5432, // port database connection
        portDatabaseApp: 54433, // port database connection
        superuser:"postgres",
        passwordClone:"1234",
        passwordSuperUser:"1234",
        dbServiceName: "lumaguita-database-service"
    }; exports( targets.dbConnection );
});


//Configuracoes do zootakuxy
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.dbConfig = {
            // // database: "maguita_dps_cafepark", // database name,
            // database: "maguita_dev", // database name,
            // user: "maguita_dev", //user name database connection
            // userClone: "maguita_dev_clone", //user name database connection
            // password: "1234", // password database connection
            // // host: "192.168.88.112", //host database connection
            // host: "localhost", //host database connection
            // port: 5432, // port database connection
            // portDatabaseApp: 54433, // port database connection
            // superuser:"postgres",
            // passwordClone:"1234",
            // passwordSuperUser:"1234",
            //
            // databaseClinic: "clinic", // database name,
            // userClinic: "clinic", // database name,
            // passwordClinic: "1234@cli", // database name,
            // hostClinic: "216.137.179.55", // database name,



            database: `maguita_dev`, // database name,
            user: `maguita_dev`, //user name database connection
            userClone: `postgres`, //user name database connection
            password: "1234", // password database connection
            host: "127.0.0.1", //host database connection
            port: 5432, // port database connection
            portDatabaseApp: 5432, // port database connection
            superuser:"postgres",
            passwordClone:"1234",
            passwordSuperUser:"1234",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { user: [ "Daniel Costa", "zootakuxy" ] } );

//Configuracoes do zootakuxy
kconst.declares( (exports, override, SELF_NAME, props) => {
    override(()=> {
        K.dbConfig = {
            database: "maguita_baiadabo", // database name,
            user: "maguita_baiadabo", //user name database connection
            userClone: "maguita_local_test_clone", //user name database connection
            password: "1234", // password database connection

            // host: "192.168.88.112", //host database connection
            host: "localhost", //host database connection
            port: 5432, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"postgres",
            passwordClone:"1234",
            passwordSuperUser:"1234",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { user: [ "Daniel Costa", "zootakuxy" ], mode: "local-test" } );

//Configuracoes do Helcio1414
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.dbConfig = {
            database: "maguita_uuid", // database name,
            user: "maguita", //user name database connection
            userClone: "maguita_clone", //user name database connection
            password: "1234", // password database connection
          // host: "192.168.88.112", //host database connection
            host: "localhost", //host database connection
            port: 5432, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"postgres",
            passwordClone:"1234",
            passwordSuperUser:"1234",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { user: "helcioguadalupe" } );

//Configuracoes do Helcio
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.dbConfig = {
            dbMode: "system",
            database: "maguita_dev", // database name,
            user: "maguita_dev", //user name database connection
            userClone: "maguita_dev_clone", //user name database connection
            password: "1234", // password database connection
           // host: "192.168.43.90", //host database connection
            host: "localhost", //host database connection
            port: 5432, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"postgres",
            passwordClone:"1234",
            passwordSuperUser:"1234",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"
        }; exports( targets.dbConnection );
    })
}, { user: ["ahmedjorge", "ahmed"] } );


//Configuração de banco de dados em modo produção
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.dbConfig = {
            database: "maguita_test", // database name,
            user: "maguita_test", //user name database connection
            userClone: "maguita_test_clone", //user name database connection
            password: "1234", // password database connection
            host: "localhost", //host database connection
            port: 5434, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"postgres",
            passwordClone:"1234",
            passwordSuperUser: "1234",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { mode: "test" })

//Configuração de banco de dados em modo produção
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        K.dbConfig = {
            database: "maguita_central", // database name,
            user: "maguita_central", //user name database connection
            userClone: "maguita_central_clone", //user name database connection
            password: "ab7799513", // password database connection
            host: "localhost", //host database connection
            port: 5432, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"postgres",
            passwordClone:"ab7799513#cL0",
            passwordSuperUser: "1234",

            databaseClinic: "proclinic", // database name,
            userClinic: "proclinic", // database name,
            passwordClinic: "1234@cli-pro", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { mode: "prod" })

//Configuração de banco de dados em modo produção
kconst.declares( (exports, override, SELF_NAME, props) => {
    override( () => {
        //[dps] distributed point share || ponto de compartilhamento distribuído
        let _cluster = 'dps'
        K.dbConfig = {
            database: `maguita_dps`, // database name,
            user: `maguita_dps`, //user name database connection
            userClone: `maguita_dps_clone`, //user name database connection
            password: "z159p753", // password database connection
            host: "127.0.0.1", //host database connection
            port: 54433, // port database connection
            portDatabaseApp: 54433, // port database connection
            superuser:"brainsoftstp",
            passwordClone:"$kl9jsL30.",
            passwordSuperUser:"73&ssk-Xhd8",

            databaseClinic: "clinic", // database name,
            userClinic: "clinic", // database name,
            passwordClinic: "1234@cli", // database name,
            hostClinic: "216.137.179.55", // database name,
            dbServiceName: "lumaguita-database-service"

        }; exports( targets.dbConnection );
    })
}, { mode: [ "public", "exe" ] })
//Configuração de banco de dados em modo produção

