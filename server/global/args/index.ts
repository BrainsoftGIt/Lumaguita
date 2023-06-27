
import { Arguments } from "zoo.util/lib/arguments";

import { FileUtil } from "zoo.util/lib/file-util";

import {DEFAULTS} from "../defaults";



declare module "./index" {
    export type PrepareArgsCallback = (args:Args )=>any;
    interface HiddenEnvs { }
    interface Envs extends HiddenEnvs{ }
    interface Args extends Envs{ }
}

const preparatory = [];
export function onPrepareArgs (fn:PrepareArgsCallback ){
    preparatory.push( fn );
}
export const lineArgs = new Arguments< Args >(  true );
export const lineHidden = new Arguments< Args >(  true );


export function lineDefiner<T> (configs?:T ){
    type ArgsDef<V> = { alias?:string, val?:V, conf?: keyof typeof configs, def?: keyof (typeof DEFAULTS) }
    const resolve = <V extends keyof Args> ( line:Arguments<any>, name:V, type, args:ArgsDef<Args[V]> )=>{
        if (!args) args = {};
        line.define({name, type, value: process.env[ name ] || configs?.[args?.conf] || DEFAULTS[args?.def] || args?.val, alias: args?.alias });
    }
    let __args:Args

    return {

        define<V extends keyof Args, TT extends Args[V], K extends ({ valueOf():TT })>( name: V, type: new()=>K, args?: ArgsDef<Args[V]>) {
            resolve( lineArgs, name, type, args );
        }, hide<V extends keyof Args, TT extends Args[V], K extends { valueOf():TT }>(name: V, type: new()=>K, args?: ArgsDef<Args[V]> ) {
            if (!args) args = {};
            resolve( lineArgs, name, type, args );
            resolve( lineHidden, name, type, args );
        }
    }
}


export function describeArgs(){
    const __hides = Object.keys( hideArgs );
    let __describe:({name:string, value:any, type:any })[] = [];
    Object.keys( args ).forEach( name => {
        if( __hides.includes( name ) ) return;
        __describe.push({
            name: name,
            value: args[ name ],
            type: typeof args[ name ]
        })
    });
    console.table( __describe );
}



FileUtil.loadAllFiles(__dirname, /.*args.js$/, deps => {
    console.log( "[MAGUITA] Definer>", deps.path );
    require( deps.path );
},{ recursive: true });



export const args:Args = lineArgs.values;
export const hideArgs:Args = lineHidden.values;


preparatory.forEach( prepare => {
    prepare( args );
})

