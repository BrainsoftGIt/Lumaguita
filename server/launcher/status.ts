export const launcherStatus:{
    launcherName?:string,
    launcher?:string|"index.ts"|"nw.ts"|"exe.ts"|"root.ts"
} = {}

export function requireLauncher(){
    return require( launcherStatus.launcherName );
}