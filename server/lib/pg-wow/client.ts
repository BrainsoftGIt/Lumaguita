import {PgWowStringTemplateBuilder} from "./builder/str-template";

import {Pool} from "pg";

export type PoolFactory = ()=>Pool;


export class PGWow {

    factory:PoolFactory;
    private lastPool:Pool;

    constructor( factory:PoolFactory ) {
        this.factory = factory;
    }

    public pool(){
        if( !this.lastPool ) this.lastPool = this.factory();
        if( this.lastPool["ended"] ) this.lastPool = this.factory();
        return this.lastPool;
    }

    sql( str:TemplateStringsArray, ...values:any ){
        PgWowStringTemplateBuilder( str, ...values );
    }

}

