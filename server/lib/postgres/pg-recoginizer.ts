import {CLIDetection, PGCli, postgresToolVersion} from "./tools/version";

require( 'source-map-support' ).install();


import * as path from "path";
import * as os from "os";
import {spawnSync, SpawnSyncOptions} from "child_process";

const CLI:PGCli[] = [
    'postgres',
    'psql',
    'initdb',
    'pg_ctl',
    'pg_dump',
    'clusterdb',
    'createdb',
    'createuser',
];

export type DetectPathResult = {
    readonly isValid: boolean,
    readonly isSupported:boolean,
    readonly isSame:boolean
    readonly code:number,
    readonly bestCode:number,
    readonly inPath?:boolean,
    readonly base?:string
    readonly detections:{
        postgres?:CLIDetection
        psql?:CLIDetection
        initdb?:CLIDetection
        pg_ctl?:CLIDetection
        pg_dump?:CLIDetection
        clusterdb?:CLIDetection
        createdb?:CLIDetection
        createuser?:CLIDetection

    }
}


export const pgServer = new class PGDetector {

    recognizePath(VERSION:number, verup:boolean = true ):Promise<{before:DetectPathResult, after:DetectPathResult}>{
        return pgServer.detect( VERSION, verup ).then(_detect => {
            if( _detect && _detect.isSupported && !_detect.inPath ){
                return ({
                    win32(){
                        let _path = process.env[ "Path" ].split( path.delimiter  );
                        _path = _path.filter( value => value.length && value !== _detect.base );
                        _path.unshift( path.normalize( _detect.base ) );
                        process.env[ "Path" ] = _path.join( path.delimiter );
                        const apply = pgServer.recognize( VERSION, verup );
                        return Promise.resolve( {
                            before: _detect,
                            after: apply
                        } )
                    }
                })[ os.platform() ]?.();
            }
            return Promise.resolve( {
                before: _detect,
                after: _detect
            } )
        })
    }

    isRecognized( VERSION:number, canUp:boolean = true ){
        const _detect = this.recognize( VERSION, canUp );
        return this.isSupported( _detect );
    }

    isSupported( _detect:DetectPathResult ){
        return _detect
            && _detect.isValid
            && _detect.isSupported
    }

    detectAll( VERSION:number, up:boolean = true, cli?:PGCli[], stopOnDetectSupported? ):Promise<DetectPathResult[]>{
        let _detections:DetectPathResult[] = [];
        let _detect:DetectPathResult = this.recognize( VERSION, up, cli );
        if ( _detect ) _detections.push( _detect );
        if( _detect && _detect.isSupported && stopOnDetectSupported ) return Promise.resolve( _detections );
        let _os = ({
            win32:this.__win32
        })?.[ os.platform() ];
        if( _os ){
            return _os(this, VERSION, up, _detections, stopOnDetectSupported);
        } else{
            return Promise.resolve( _detections )
        }
    }

    private __win32(self:PGDetector, VERSION:number, up:boolean,_detections:DetectPathResult[], stopOnDetectSupported?, cli?: PGCli[]){
        return require('./pg-register').scanPostgresRegisters( ).then(registers => {

            if( !registers.length ) return Promise.resolve( _detections );
            return new Promise( resolve => {
                registers = registers.filter( value => value.type === "Installations" );
                for (let i = 0; i < registers.length; i++) {

                    let __path = path.join( registers[i].base, "bin" );
                    const _detect = self.recognize( VERSION, up, cli,  __path );

                    if( _detect ) {
                        _detections.push(_detect);
                    }
                    if( _detect && _detect.isSupported && stopOnDetectSupported )
                        return resolve( _detections  );
                }
                return resolve( _detections );
            });
        })
    }

    detect( VERSION:number, up:boolean = true, cli?:PGCli[] ):Promise<DetectPathResult>{
        return this.detectAll( VERSION, up, cli, true ).then( value => {
            return Promise.resolve( value.find(detected => detected && detected.isValid && detected.isSupported ))
        })
    }



    recognize( VERSION:number, up:boolean = true, cli?:PGCli[], envPath?:string ):DetectPathResult{
        if( !cli || !cli.length ) cli = CLI;
        let exe = "";
        let _where = "whereis";

        if( os.platform() === "win32" ){
            exe = ".exe";
            _where = "where";
        }
        const detected:{ [ p:string ]:CLIDetection } = {};
        if( !VERSION ) VERSION = 0;
        VERSION = Math.trunc( VERSION );

        let useCli = CLI.filter( value => cli.includes( value ) );
        const opts:SpawnSyncOptions = {};
        if( envPath && os.platform() === "win32" ){
            const _path = process.env[ "Path" ].split( path.delimiter );
            _path.unshift( envPath );
            opts.env = Object.assign({
                "Path": _path.join( path.delimiter )
            })
        }

        let firstCommand;
        let lastCommand;

        useCli.forEach( request => {
            lastCommand = request;
            if( !firstCommand ) firstCommand = request;
            detected[ request ] = postgresToolVersion( request, envPath );
        });


        let isValid = true;
        let _break = ()=>{
            isValid = false;
            return true;
        }
        let preview:CLIDetection;
        useCli.some( req => {
            let next = detected[ req ];
            if( !next ) return _break();
            if( !next.isValid ) return _break();
            if( preview && preview.name !== next.name ) return _break();
            if( preview && preview.version !== next.version ) return _break();
            if( preview && preview.versionNumber !== next.versionNumber ) return _break();
            if( preview && preview.majorVersion !== next.majorVersion ) return _break();
            if( preview && preview.minorVersion !== next.minorVersion ) return _break();
            preview = next;
        });

        if( !isValid )return null;
        const result = spawnSync( _where, [ firstCommand+exe ], opts );
        const base = path.dirname( path.join( result.stdout.toString("utf-8").trim() ) );


        const MAJOR_VERSION = detected[ firstCommand ].majorVersion;
        let camSupport = isValid
            && ( MAJOR_VERSION === VERSION || (MAJOR_VERSION > VERSION && up) );

        const isSame = isValid && VERSION === MAJOR_VERSION;

        let code = 0;
        if( isValid ) code++;
        if( camSupport ) code++;
        if( isSame ) code++;
        const bestCode = 3;

        return {
            get isValid(){ return isValid },
            get isSupported(){ return camSupport },
            get isSame(){ return isSame},
            get code(){ return code },
            get bestCode(){ return bestCode },
            get inPath() { return !envPath},
            get base(){ return base},
            get detections(){ return { ...detected }},
        };
    }
}

