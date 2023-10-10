import {RevisionPatch} from "kitres";

export interface LumaGuitaEvents {
    localDataChange( changeCode:string, ... args:any[] ):void,
    revision(blocks:RevisionPatch<any>[]):void
    userLogged( user?:{
        user_id:string,
        user_name:string,
        user_workspace:string,
        branch?:string
    }):void
    setsProduct( newProduct:any, oldProduct:any ):void
    startService():void,
    stopService():void
}