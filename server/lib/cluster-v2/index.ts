import {Express} from "express";

export type ClusterV2Options = {
    app: Express,
    route:string
}

export class ClusterV2 {
    app:Express;

    constructor( opts:ClusterV2Options) {
        this.app = opts.app;
    }
}