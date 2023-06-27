import { PGClusterStatus } from "../pg-ctl";
import { spawn } from "child_process";
import fs from "fs";
import { processListen } from "../../utils/process/listen";
import { pgctlStatus } from "./pgctl-status";

export function pgctlStop ( dataDir:string ):Promise<PGClusterStatus>{
    return new Promise< PGClusterStatus >(async (resolve, reject) => {
        const exists = fs.existsSync(dataDir );

        if( !exists ){
            return resolve( PGClusterStatus.DIR_NOT_EXISTS );
        }

        const process = spawn( "pg_ctl", [
            "-D", dataDir,
            "stop"
        ]);

        // code: 4,  message: '', err: 'pg_ctl: directory "C:/var/pgdata" is not a database cluster directory\r\n'
        // code: 4, message: '', err: 'pg_ctl: directory "C:/var/pgdata/Data 993" does not exist\r\n'
        // code: 3, message: 'pg_ctl: no server running\r\n', err: ''
        // code: 0, err: ''
        // message: 'pg_ctl: server is running (PID: 9600)\r\n' +
        //   'C:/Program Files/PostgreSQL/13/bin/postgres.exe "-D" "Data 002"\r\n',

        processListen( process ).then( value => {
            return pgctlStatus( dataDir )
        }).catch( reason => {
            console.error( reason );
        })
    })
}