import {lineArgs, Args} from "../global/args";
function logPlay (receiver: {command: string | null, options: Args, argv: any, params: string[]}){
    const { logView, snapshotView } = require("../service/log.service/logview" );
    console.log("[RUM IN LOGS MODE]")

    if( receiver.options.logSnapshot ) {
        return snapshotView();
    }
    logView();
}

lineArgs.defineCommand( { name: ["log"],  callback: logPlay });
lineArgs.defineCommand( { name: ["logs"],  callback: logPlay});