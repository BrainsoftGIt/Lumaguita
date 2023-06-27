import {PreparedParameter} from "zoo.pg/lib/types";

export class EscapedParameter  extends PreparedParameter {
    name:string
    constructor( escaped:string, noEscaped?:string ) {
        super({
            type: "",
            value: null,
            literal: escaped,
            pre: "",
            post: "",
            simple: noEscaped||escaped,
            name: escaped
        });
        this.name = escaped;
    }
}

export function escapedParameter( value:string ){
    let mutable = new EscapedParameter( value );
    return (new Proxy(mutable, {
        set(target: PreparedParameter, p: string | symbol, value: any, receiver: any): boolean {
            return true;
        }
    }))
}
