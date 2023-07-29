[COMPILE:FIRST]
tsc
node build/kconst --mode [dev|test|prod|public]
node build/db/cli -NLYy

[INFO]
node build/db/cli -I
./status

[COMPILE:PATCHES]
tsc
node build/kconst --mode [dev|test|prod|public]

[RUN:DEV]
node server/launcher --appMode dev

[RUN:SERVER-TEST]
node server/launcher/root --appMode test --app <<APP-NAME>>
agg: node server/launcher/root --appMode test --app MAGUITA

[RUM:SERVER-PROD]
node server/launcher/root --appMode prod --app <<APP-NAME>>
agg: node server/launcher/root --appMode test --app LUMA

[RUM:CLIENT]
node server/launcher/exe play
or maguita.exe play

[RUn:CLIENT-SILENT-MODE]
node server/launcher/exe
or maguita.exe


[LAUNCHER-ARGS:WEBS]
--webDomain <<um nomde de dominio especifico>>
--webProtocol [http|https]
--webSession [pg-session|file-session]
--webWithCache <<boolean>>
--webMaxCookieAge <<number>>


[LAUNCHER-ARGS:DATABASE]
--dbMode: [app|system]
                    # --dbMode=app significa que o aplicativo sera inicializado com seu proprio cluster de banco de dados
                    # --dbMode=system siginifica que sera usado o banco de dados remote

--dbHost: database host name
--dbPort: database port number
--dbPortDatabaseApp default is 54433, correponde a porta que o aplicativo ira iniciar o seu proprio cluster
                    # Aplicavél quendo for expecificado --dbMode=app
                    # Aplicavél quando executar com launcher exe
--dbName name of database
--dbUser name of default user
--dbUserClone nome do utilizador responsavél pela clonagem dos dados remotos
--dbSupperUser nome do supper usuario que opera no cluster do banco de dados
--dbPassword corresponde a senha do ulilizador especificado no --dbUser
--dbPasswordClone corresponde a senha do ulilizador especificado no --dbUserClone
--dbPasswordSupperUser corresponde a senha do ulilizador especificado no --dbSupeUser

[LAUNCHER-ARGS:APP]
--app correponde ao nickname do aplicativo
--appLabel corresponde ao nome do aplicativo apresentavel
--appPort Correponde a porta em que o aplicativo estara ocupando
--appUser Corresponde ao nome do ulizador do aplicativo
                # Default is current os session user name
--appDebug appresentar os resultados na consola



[INSTALLER-BUILD]
npm run compile:nexe #create a nexe file
npn run compile:build #buid dist of project
npn run compile:win32:release #create installer of dist project
