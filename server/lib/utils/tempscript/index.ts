import fs from "fs";
import tmp from "tmp";
import {Define, DefineCommand, DefineEnv, DefinePath, DefinePathMode, TempScriptEngine} from "./engines";
import * as Path from "path";


export class TempScript<C extends DefineCommand, E extends DefineEnv,P extends DefinePath> {
    definitions:Define[] = [];
    engine:TempScriptEngine<C,E,P>;
    autoUnlink:boolean = true

    constructor(engine: TempScriptEngine<C,E,P>) {
        this.engine = engine;
    }

    command( command:string, ...args:string[] ) :TempScript<C, E, P> {
        this.definitions.push( this.engine.command.instance( command, ...args ) );
        return this;
    }

    env( key:string, value:string ):TempScript<C, E, P>{
        this.definitions.push( this.engine.env.instance( key, value ) );
        return this;
    }

    path( path:string, mode?:DefinePathMode ):TempScript<C, E, P>{
        this.definitions.push( this.engine.path.instance( path, mode ))
        return this;
    }

    get script(){
        let filename = "";

        const tempFile = tmp.fileSync({
            prefix: "temp-script",
            postfix: `script${this.engine.extension}`
        });
        filename = tempFile.name;
        let lines:string[] = this.definitions.map( value => value.define );
        if( this.autoUnlink ) {
            lines.push( this.engine.unlinkFile( filename ) )
        }
        const raw = lines.join( "\r\n");
        fs.mkdirSync( Path.dirname( filename ), { recursive: true} );
        fs.writeFileSync( filename,  raw );

        const remove = ()=>{
            fs.unlinkSync( filename );
        }
        return {
            filename,
            raw,
            remove
        }
    }
}