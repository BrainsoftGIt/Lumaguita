
require( 'source-map-support' ).install();


export const DEFAULTS_MAP = [ "HKLM\\SOFTWARE\\PostgreSQL", "HKCU\\SOFTWARE\\PostgreSQL" ] as const;
export type KnowMaps = typeof DEFAULTS_MAP[number];

export type PGRegister = {
    path:string,
    type:"Installations"|"Services",
    entry:string,

    base?:string,
    version?:string,
    data?:string,
    service?:string,
    user?:string,
    port?:string
    /** postgres-xNN-ver*/
}

type ScanProcess = {
    // pendents:number,
    registers:PGRegister[],
    // regedit:import( "regedit" ),
    complete()
    start()
};

function createProcess( callback:()=>void ):ScanProcess{
    let pendents = 0;
    const regedit = require( "regedit" )
    return {
        start() {
            pendents++
            return regedit;
        },
        complete:()=>{
            pendents--;
            if( pendents === 0 ) callback();
        },
        registers: []
    }
}

function mapEntry ( proc:ScanProcess, location:"Services"|"Installations", path:string, entryKey: string){

    let map = path.split("\\");
    map.push( entryKey );
    proc.start().list( map.join( "\\" ) ).on( "data", ( entry )=>{
        if( !entry.data.exists ) return;

        let map = location==="Installations"? [
            "Base Directory", "base",
            "Version", "version",
            "Data Directory", "data",
            "Service ID", "service",
            "Super User", "user"
        ]: location === "Services" ? [
            "Data Directory", "data",
            "Port", "port",
            "Database Superuser", "user",
            "Product Code", "service"
        ]: [];

        const values = entry.data.values;

        const reg:PGRegister = {
            type: location,
            entry: entryKey,
            path: entry.key,

        };
        for (let i = 0; i < map.length; i+=2 ) {
            let key = map[ i+1 ];
            let code = map[ i ];
            reg[ key ]  = values?.[ code ]?.[ "value" ];
        }
        proc.registers.push( reg );

    }).on( "finish", ()=>{
        proc.complete();
    })

}

function findLocation  ( proc:ScanProcess, path:string, location:"Services"|"Installations" ){
    let map = path.split("\\");
    map.push( location );
    proc.start().list( map.join( "\\" ) ).on( "data", ( entry )=>{
        if( !entry.data.exists ) return;
        [ ...entry.data.keys].forEach( entryName => {
            mapEntry( proc, location, entry.key, entryName  )
        });
    }).on( "finish", ()=>{
        proc.complete();
    })

}

//[ 'HKLM\\SOFTWARE\\PostgreSQL', 'HKCU\\SOFTWARE\\PostgreSQL'

export function scanPostgresRegisters( ...knowsMaps:KnowMaps[ ] ):Promise<PGRegister[]>{
    if( !knowsMaps ) knowsMaps = DEFAULTS_MAP.map( value => value );
    knowsMaps = DEFAULTS_MAP.filter( value => knowsMaps.includes( value ) );
    if( !knowsMaps.length ) knowsMaps = DEFAULTS_MAP.map( value => value );


    return new Promise( (resolve ) => {
        const proc = createProcess( () =>   {
            resolve( proc.registers )
        })
        proc.start().list( [ ...knowsMaps ]  ).on( "data", ( entry )=>{
            if( !entry.data.exists ) return;
            [ ...entry.data.keys ].forEach( location => {
                findLocation( proc, entry.key, location  )
            });
        }).on( "finish", ()=>{
            proc.complete()
        });

    })
}
