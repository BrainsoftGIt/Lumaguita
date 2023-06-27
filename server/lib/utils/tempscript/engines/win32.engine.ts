import {DefineCommand, DefineEnv, DefinePath, DefinePathMode, TempScriptEngine} from "./index";
import {escapeSpaceQuotes} from "../../escapes";
import * as Path from "path";

export class Win32DefineCommand extends DefineCommand{

    constructor(command: string, ...args: string[]) { super(command, ...args); }

    get define():string {
        let define = "";
        define += `${this.command}`;
        if( this.args.length ) define += ` ${ this.args.map( value => escapeSpaceQuotes( value )).join( " " ) }`;
        return  define;
    }
}

export class Win32DefineEnv extends DefineEnv {

    constructor(key: string, value: string) { super(key, value); }
    get define(){
        return `set ${this.key}=${escapeSpaceQuotes( this.value )}`;
    }
}

export class Win32DefinePath extends DefinePath {

    constructor(path: string, mode: DefinePathMode) {super(path, mode); }

    get define(){
        let define = "";
        if( this.mode === "before" ) define+= `set PATH=${escapeSpaceQuotes( this.path)}${Path.delimiter}%PATH%`;
        else define+= `set PATH="%PATH%${Path.delimiter}${escapeSpaceQuotes( this.path)}"`;
        return define;
    }
}

// const envEngine: = { class: Win32DefineEnv, instance:(key, value) => new Win32DefineEnv( key, value ) };
export const win32TempScriptEngine:TempScriptEngine<Win32DefineCommand, Win32DefineEnv, Win32DefinePath> = {
    command:{ instance(command:string, ...args:string[]){ return new Win32DefineCommand( command, ...args)}},
    env:{ instance(key:string, value:string){ return new Win32DefineEnv( key, value)}},
    path:{ instance(key:string, value:DefinePathMode){ return new Win32DefinePath( key, value)}},
    extension:".cmd",
    unlinkFile(path: string): string {
        return  `rm ${ path }`;
    }
}