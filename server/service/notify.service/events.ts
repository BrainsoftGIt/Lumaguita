import {RevisionRegistry} from "kitres";

export interface LumaguitaEvents {
    dataChange( changeCode:string, ... args:any[] ),
    revision(blocks:RevisionRegistry[])
}