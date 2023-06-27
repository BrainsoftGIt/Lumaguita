import {args} from "../../global/args";


export type IoLineCommandCallback = ( command:string, line:string, ...args:any[] )=> void;
export type IoLineCommand = {
    name:string
    describe:string
};


const commands:IoLineCommand[][] = new Proxy( [], {
    get(target: any[], p: PropertyKey, receiver: any): any {
        if( !target[ p ] ) target[ p ] = [];
        return target[ p ];
    }
});

const commandsName:IoLineCommand[] = [];
if( !args.appNoCli ){
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line:string){
        let find = false;
        let parts = line.split( " " ).filter( value => value.length > 0 );
        let command = parts.shift();
        if( !command ) command = "";

        commands[ command ].forEach( callback=>{
            // @ts-ignore
            callback( command, line, ...parts );
            find = true;
        });

        let number = Number( command );
        let int = Number.isSafeInteger( number );
        if( int && number >= 0 && number <commandsName.length && line.length > 0 ){
            let name = commandsName[ number ].name;
            commands[ name ].forEach( callback=>{
                callback( command, line, ...parts );
                find = true;
            });
        }
    })
}


export function registerLine( ioName:string|string[]|IoLineCommand|IoLineCommand[], ioLine:IoLineCommandCallback ){
    if( !Array.isArray( ioName ) ){
        // @ts-ignore
        ioName = [ ioName ];
    }

    // @ts-ignore
    ioName.forEach( (value, index) =>{
        if( !value ) value = "";

        if( typeof value === "string" ){
            commands[ value ].push( ioLine );
            commandsName.push( { name: value, describe: "" } )
        }
        else if( value && typeof value === "object" ){
            if( !value.name ) value.name = "";
            // @ts-ignore
            commands[ value.name ].push( ioLine );
            commandsName.push( value );
        }
    });
}

registerLine( ["cls", "clear", "clean"], ( )=>{
    console.clear();
})
registerLine( ["/?", "?", "help", "/help" ], ( )=>{
    console.table( commandsName );
})