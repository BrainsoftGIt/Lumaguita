
import _manifest from "../../package.json";
import { Args } from "./args";
import cluster from "cluster";

export const manifest = _manifest;

export class Context {
    env:Args;
    manifest: typeof manifest

    mode:  "dev" | "public" | "prod" | "test" | "exe"
    constructor() {
        this.env = {} as any;
        this.manifest = manifest;
        this.mode = "dev"
    }

    define( env:Args ){
        this.env = Object.assign( this.env, env );
        this.mode  = env.appMode || "dev";
    }

    get tag(){
        if( cluster.isWorker ) return `[${ manifest.name }@${cluster.worker.id}]`;
        return `[${ manifest.name }]`;
    }

}


export const context = new Context();
