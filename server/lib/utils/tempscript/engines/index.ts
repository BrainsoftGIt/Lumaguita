
export interface Define {
    define:string,

}

export abstract class DefineCommand implements Define{
    command:string;
    args:string[]
    protected constructor(command:string, ...args:string[]) {
        this.command = command;
        this.args = args;
    }
    abstract define;
}

export abstract class DefineEnv implements Define {
    key:string
    value:string
    protected constructor(key:string, value:string ) {
        this.key = key;
        this.value = value;
    }
    abstract define
}

export type DefinePathMode="after"|"before"
export abstract class DefinePath implements Define {
    path:string;
    mode:DefinePathMode;
    protected constructor(path: string, mode:DefinePathMode) {
        this.path = path;
        this.mode = mode;
    }

    abstract define;
}


type Engine<R> = {instance?:(...args)=>R, class?:FunctionConstructor};

export type TempScriptEngine<C extends DefineCommand, E extends DefineEnv, P extends DefinePath> = {
    command:Engine<C>
    env:Engine<E>
    path:Engine<P>
    extension:string,
    unlinkFile( path:string):string
};