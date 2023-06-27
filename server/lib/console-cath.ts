import mmt, { Moment } from "moment";

export type LogLevel = keyof typeof console| PropertyKey | string;
export type LogCatchAcceptorOpts = {
    level:LogLevel,
    instant:Date,
    moment:Moment,
}

export type LogCatch = (opts:LogCatchAcceptorOpts )=> Console|(Console[]);


const _defaultConsole = console;

export const capture = (new class ConsoleManage{
    private _terminal:boolean = true;
    private _logCatch:LogCatch[]=[]
    private _replay:LogCatch[]=[]

    constructor() {
        const self = this;
        let prints:{ [ p in keyof typeof console]?:( ...args )=>any } = {}

        const _term = new Proxy( console, {
            get(target, p: PropertyKey, receiver: any): any {
                if( self.terminal ) return target[ p ];
                else return ()=>{}
            }
        });

        console = new Proxy( console, {
            get(target: Console, p: PropertyKey, receiver: any): any {
                let level:LogLevel = p;

                if( typeof _term[ level ] !== "function" ) return _term[ level ];
                let skips:LogLevel[] = [ "Console" ];

                if( skips.includes( level ) ) return _term[ level ];

                if( !prints[ level ] ) prints[ level ] = ( ...args )=>{
                    _term[ level ]( ...args );
                    skips = [ "clear" ];
                    if( skips.includes( level ) ) return;
                    self.notifyLogs( level, ...args );
                };
                return prints[ level ];
            }
        })
    }

    get terminal(){ return this._terminal };
    set terminal(value: boolean) { this._terminal = value; }
    get defaults(): Console { return _defaultConsole; }

    public register( logCatch:Console|LogCatch ){
        this.__register( logCatch, this._logCatch );
    }

    public replay( replay:Console|LogCatch ){
        this.__register( replay, this._replay );
    }

    private __register(logCatch:Console|LogCatch, registry:LogCatch[] ){
        let _logCatch:LogCatch;
        if( !logCatch ) throw new Error( "Console log catch node defined!" );

        if( typeof logCatch === "function" ) _logCatch = logCatch;
        else if( typeof logCatch === "object" ) _logCatch = opts => logCatch;
        else throw new Error( `Invalid log catch typeof: ${ typeof logCatch } not function or console.Console instance!` );
        registry.push( _logCatch );
    }

    private notifyLogs( level:LogLevel, ...args ){
        const instant = new Date();
        const moment = mmt( instant );

        let opts:LogCatchAcceptorOpts = {
            level,
            instant,
            moment
        };

        function asConsole( _console:Console|Console[]):Console[]{
            if( !_console ) return [];
            if( !Array.isArray( _console ) ) return [ _console ];
            else return _console;
        }

        //Replay to another console
        this._replay.forEach( ( next )=>{
            asConsole( next( opts ) ).forEach( iConsole => {
                iConsole[ level ]( ...args );
            });
        });

        //Registry logs
        this._logCatch.forEach( ( next )=>{
            asConsole( next( opts ) ).forEach( iConsole => {
                iConsole.log( `[${ String( level ) }:${ moment.toISOString() }]`);
                iConsole[ level ]( ...args );
            });
        })
    }
});





