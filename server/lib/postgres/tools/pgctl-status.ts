import {PGClusterStatus, PostgresCluster} from "../pg-ctl";
import {spawn} from "child_process";
import fs from "fs";
import {processListen} from "../../utils/process/listen";

export function pgctlStatus ( dataDir:string ):Promise< PGClusterStatus >{
    return new Promise< PGClusterStatus >(async (resolve, reject) => {
        const exists = fs.existsSync(dataDir );

        if( !exists ){
            return resolve( PGClusterStatus.DIR_NOT_EXISTS );
        }

        const pgCtl = spawn( "pg_ctl", [
            "status",
            "-D", dataDir
        ]);

        // code: 4,  message: '', err: 'pg_ctl: directory "C:/var/pgdata" is not a database cluster directory\r\n'
        // code: 4, message: '', err: 'pg_ctl: directory "C:/var/pgdata/Data 993" does not exist\r\n'
        // code: 3, message: 'pg_ctl: no server running\r\n', err: ''
        // code: 0, err: ''
        // message: 'pg_ctl: server is running (PID: 9600)\r\n' +
        //   'C:/Program Files/PostgreSQL/13/bin/postgres.exe "-D" "Data 002"\r\n',

        processListen( pgCtl ).then( value => {
            let code = value.code;
            let message = value.stdout;
            if( code === 0 ) return resolve( PGClusterStatus.CLUSTER_RUNNING );
            else if( code === 3 ) return resolve ( PGClusterStatus.CLUSTER_STOPPED );
            else if( code === 4 ){
                if( message.includes( "is not a database cluster directory") )
                    return resolve( PGClusterStatus.DIR_NOT_DATABASE_CLUSTER );
                if( message.includes( "does not exist") ) return resolve( PGClusterStatus.DIR_NOT_EXISTS );
            }
        }).catch( reason => {
            console.error( reason );
        })
    })
}
