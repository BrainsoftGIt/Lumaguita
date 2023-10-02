import {RevisionPatch} from "kitres";

export interface LumaGuitaEvents {
    localDataChange( changeCode:string, ... args:any[] ),
    revision(blocks:RevisionPatch[])
    userLogged( user?:{
        user_id:string,
        user_name:string,
        user_workspace:string,
        branch?:string
    })
    setsProduct( newProduct:any, oldProduct:any )
    startService(),
    stopService()
}