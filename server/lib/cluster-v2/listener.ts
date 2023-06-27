import {Express} from "express";
import * as Path from "path";
import {ClusterV2} from "./index";

export type RequestPath = {
    event:string,
    full:string,
    relative:string,
    base:string
}

export class Listener {
    app:Express;
    base:string;
    context:ClusterV2;

    constructor( context:ClusterV2, app:Express, base:string ) {
        this.context = context;
        this.app = app;
        this.base = Path.join(base||"/", "revision-v2" );

        this.startListen();
    }

    private startListen(){
        this.app.use( `${this.base}/:event/*`, ( req, res, next ) => {
            let event = req.params.event;
            let fullPath = req.baseUrl + req.path;
            let eventPath = Path.join( this.base, event );
            let relative = Path.relative( eventPath, fullPath );
            let path:RequestPath = {
                base: this.base,
                full: fullPath,
                relative: relative,
                event: eventPath
            }
        });
    }
}