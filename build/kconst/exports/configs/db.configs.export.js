"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
//Configuração do banco de dados padrão
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    index_1.K.dbConfig = {
        database: "maguita_uuid",
        user: "maguita",
        userClone: "maguita_clone",
        password: "1234",
        host: "localhost",
        port: 5432,
        portDatabaseApp: 54433,
        superuser: "postgres",
        passwordClone: "1234",
        passwordSuperUser: "1234",
    };
    exports(index_1.targets.dbConnection);
});
//Configuracoes do zootakuxy
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
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
            database: `maguita_dev`,
            user: `maguita_dev`,
            userClone: `postgres`,
            password: "1234",
            host: "127.0.0.1",
            port: 5432,
            portDatabaseApp: 5432,
            superuser: "postgres",
            passwordClone: "1234",
            passwordSuperUser: "1234",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { user: ["Daniel Costa", "zootakuxy"] });
//Configuracoes do zootakuxy
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
            database: "maguita_baiadabo",
            user: "maguita_baiadabo",
            userClone: "maguita_local_test_clone",
            password: "1234",
            // host: "192.168.88.112", //host database connection
            host: "localhost",
            port: 5432,
            portDatabaseApp: 54433,
            superuser: "postgres",
            passwordClone: "1234",
            passwordSuperUser: "1234",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { user: ["Daniel Costa", "zootakuxy"], mode: "local-test" });
//Configuracoes do Helcio1414
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
            database: "maguita_uuid",
            user: "maguita",
            userClone: "maguita_clone",
            password: "1234",
            // host: "192.168.88.112", //host database connection
            host: "localhost",
            port: 5432,
            portDatabaseApp: 54433,
            superuser: "postgres",
            passwordClone: "1234",
            passwordSuperUser: "1234",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { user: "helcioguadalupe" });
//Configuracoes do Helcio
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
            database: "maguita_dev",
            user: "maguita_dev",
            userClone: "maguita_dev_clone",
            password: "1234",
            // host: "192.168.43.90", //host database connection
            host: "localhost",
            port: 5432,
            portDatabaseApp: 54433,
            superuser: "postgres",
            passwordClone: "1234",
            passwordSuperUser: "1234",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { user: "ahmedjorge" });
//Configuração de banco de dados em modo produção
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
            database: "maguita_test",
            user: "maguita_test",
            userClone: "maguita_test_clone",
            password: "1234",
            host: "localhost",
            port: 5432,
            portDatabaseApp: 54433,
            superuser: "postgres",
            passwordClone: "1234",
            passwordSuperUser: "1234",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { mode: "test" });
//Configuração de banco de dados em modo produção
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        index_1.K.dbConfig = {
            database: "maguita_central",
            user: "maguita_central",
            userClone: "maguita_central_clone",
            password: "ab7799513",
            host: "localhost",
            port: 5432,
            portDatabaseApp: 54433,
            superuser: "postgres",
            passwordClone: "ab7799513#cL0",
            passwordSuperUser: "1234",
            databaseClinic: "proclinic",
            userClinic: "proclinic",
            passwordClinic: "1234@cli-pro",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { mode: "prod" });
//Configuração de banco de dados em modo produção
index_1.kconst.declares((exports, override, SELF_NAME, props) => {
    override(() => {
        //[dps] distributed point share || ponto de compartilhamento distribuído
        let _cluster = 'dps';
        index_1.K.dbConfig = {
            database: `maguita_dps`,
            user: `maguita_dps`,
            userClone: `maguita_dps_clone`,
            password: "z159p753",
            host: "127.0.0.1",
            port: 54433,
            portDatabaseApp: 54433,
            superuser: "brainsoftstp",
            passwordClone: "$kl9jsL30.",
            passwordSuperUser: "73&ssk-Xhd8",
            databaseClinic: "clinic",
            userClinic: "clinic",
            passwordClinic: "1234@cli",
            hostClinic: "216.137.179.55", // database name,
        };
        exports(index_1.targets.dbConnection);
    });
}, { mode: ["public", "exe"] });
//Configuração de banco de dados em modo produção
//# sourceMappingURL=db.configs.export.js.map