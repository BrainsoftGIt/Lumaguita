import {Flow, FlowResponse, OutFlow, SteepFlow} from "kitres/src/core/util/work-flow";
import {StarSteeps, StartContext, StartResponse} from "../index";
import {System} from "kitres/src/core/system";
import {folders} from "../../global/project";

class S101000SysAppPathFlow extends Flow<StartContext, StartResponse, StarSteeps>{

    readonly identifier = __filename;
    readonly steeps = __filename;

    when(context: StartContext, steep: StarSteeps): boolean {
        return true;
    }

    flow(steep: StarSteeps, context: StartContext, steepFlow: SteepFlow<StartContext, StartResponse, StarSteeps>, preview: Flow<StartContext, any, StarSteeps>): FlowResponse<StartContext, StartResponse, StarSteeps> {
        System.toPath( folders.bin )
        return {
            flow: OutFlow.CONTINUE,
            response: {
                group: "System config",
                message: `Path do sistema aplicado com sucesso!`
            }
        }
    }
}

export const ____S101000SysAppPathFlow = new S101000SysAppPathFlow();