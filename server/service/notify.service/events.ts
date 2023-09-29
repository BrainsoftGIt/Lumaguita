import {RevisionRegistry} from "kitres";

export interface LumaguitaEvents {
    localDataChange( changeCode:string, ... args:any[] ),
    revision(blocks:RevisionRegistry[])
    startService(),
    stopService()
}