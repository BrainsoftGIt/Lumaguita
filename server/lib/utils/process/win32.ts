import * as child_process from "child_process";
import {ChildProcess, spawn, SpawnOptions} from "child_process";
import tmp from "tmp";
import fs from "fs";
import * as path from "path";
import {escapeSpaceQuotes} from "../escapes";

export const DEFAULT_SHELL = "powershell.exe";



type DeclareScriptOpts = { file:string, dirname:string, script:string };
export function declareScript( declare:DeclareScriptOpts, args:string[], opts:SpawnOptions ){
    args = args || [ ];
    args.forEach( (value, index) => {
        args[ index ] = escapeSpaceQuotes( value );
    });
    let argv0 = args.join( " " );

    return `
        @echo off
        rm -r -f ${ declare.dirname };
        rem elevate mode rum ${ declare.file }
        ${ /*setEnvs( opts )*/ ""}
        cd /D ${ escapeSpaceQuotes( opts.cwd || process.cwd() ) }
        call ${ escapeSpaceQuotes( declare.file ) } ${ argv0 }
    `.replace( / {8}/g, "" )
}

function setEnvs ( opts:SpawnOptions ):string{
    if( !opts ) return "";
    const envs:{[p:string]:string } = opts["env"];
    if( !envs ) return "";
    if( typeof envs !== "object" ) throw new Error( "Envs is not object" );
    let envsLines:string[] = [];
    Object.keys( envs ).forEach( key => {
        envsLines.push( `set ${key}=${ escapeSpaceQuotes( envs[key] )}` )
    });

    delete opts["env"];
    return envsLines.join( "\n" );
}

function setVars ( opts:ExtendedSpawnOptions ):string{
    if( !opts ) return "";
    const vars:{[p:string]:string } = opts.vars;
    if( !vars ) return "";
    if( typeof vars !== "object" ) throw new Error( "Envs is not object" );
    let envsLines:string[] = [];
    Object.keys( vars ).forEach( key => {
        envsLines.push( `\$\{${ key }\}=${ escapeSpaceQuotes( vars[ key ] )}` )
    });

    delete opts.vars;
    return envsLines.join( "\n" );
}

type Mode = {
    shell:string,
    mode:RumMode[]
}
export function asMode( mode:ExecuteMode ):Mode{
    let _mode:Mode = {
        mode: [],
        shell: DEFAULT_SHELL
    };

    if( typeof mode === "string" ) _mode.mode.push( mode );
    else if( mode && Array.isArray( mode )) _mode.mode.push( ...mode );
    else if( mode && !Array.isArray( mode ) ) Object.assign( _mode, mode );
    return _mode;
}

type TempScript = { dirname: string, script: string, logfile: string, clean() };
export function createTempScript( file:string, args:string[], mode:ExecuteMode, opts:SpawnOptions):TempScript{
    opts = opts || {};
    const _mode = asMode( mode );
    let dir = tmp.dirSync({ prefix: "rum-mode", postfix: `${ _mode.mode.join( "_" ) }` });
    let script = path.join( dir.name, `mode-${ _mode.mode.join( "_" )}.bat`);
    let logfile = path.join( dir.name, `mode-${ _mode.mode.join( "_" )}.bat.log`);
    const dirname = dir.name;

    //language=file-reference
    fs.writeFileSync( script, declareScript( Object.assign({ file, dirname, script } ), args, opts ));
    return {
        dirname,
        script,
        logfile,
        clean: ()=>{
            fs.rmSync( dir.name, {  recursive: true })
        }
    }
}

export function declareBlock( opts:SpawnOptions, ...block:(string|string[] )[]  ){
    let lines:string[] = [];
    const _asLine = (strs:string[])=>{
        if( !strs ) return null;
        if( strs.find( value => !value ) ) return null;
        if( strs.find( value => ![ "number", "string", "boolean" ].includes( typeof value ) ) ) return null;
        return strs.map( (value, index) => index===0? value: escapeSpaceQuotes( value ) ).join( " " );
    }

    block.forEach( (value, index) => {
        let _line:string = null;
        if( [ "number", "string", "boolean" ].includes( typeof value ) ) _line = value.toString();
        else if( Array.isArray( value ) ) _line = _asLine( value );
        if( _line === null ) throw new Error( `Invalid args in block detected at index: ${ index } line: ${ index+1 }`);
        if( _line.length >0 ) lines.push( _line );
    });

    let _line = lines.join( "\n" ).trim();
    if( !_line.length ) lines.push( DEFAULT_SHELL );
    lines.unshift(
        "@echo off",
        setEnvs( opts )
    )
    _line = lines.join( "\n" ).trim();
    return _line;
}

export function createBlock( mode:RumMode|RumMode[], opts:SpawnOptions, ...block:(string|string[] )[] ):TempScript{
    const temp = tmp.dirSync({ prefix: "maguita", postfix: `${ mode }` });
    let script = path.join( temp.name, `mode-${mode}.bat`);
    let logfile = path.join( temp.name, `mode-${mode}.bat.log`);
    const dirname =  temp.name;

    //language=file-reference
    fs.writeFileSync( script, declareBlock( opts, ...block ) );
    return {
        dirname,
        script,
        logfile,
        clean: ()=>{
            fs.rmSync( dirname, {  recursive: true })
        }
    }
}

export type RumMode = "elevate"|"background"|"default"|"noWait";

function startProcess( script, opts: child_process.SpawnOptions, mode:ExecuteMode, tempScript:TempScript ):ChildProcess {
    const _mode = asMode( mode );
    opts = opts || {};
    const args = [];
    args.push('Start-Process');
    args.push('-FilePath');
    args.push( escapeSpaceQuotes( script ) );

    if ( !_mode.mode.includes( "noWait" ) ) args.push('-Wait');
    if ( _mode.mode.includes( "elevate" ) ) args.push('-Verb runAs');
    if ( _mode.mode.includes( "background" ) ) args.push('-WindowStyle hidden');

    let shell = _mode.shell||DEFAULT_SHELL;
    console.log( shell, args.join( " ") );
    console.log( fs.readFileSync( script ).toString("utf-8" ) );
    if( opts.detached && !opts.shell ) opts.shell = true;
    const child = spawn( shell, args, opts );


    let stdout = "";
    let stderr = "";
    let error;

    child.on( "error", err => {
        error = err;
    });

    child.stdout.on( "data", chunk => stdout += chunk );
    child.stderr.on( "data", chunk => stderr += chunk );
    child.on( "close", (code, signal) => {
        // tempScript.clean();
    });
    return child ;
}

export function execFileElevate(file:string, args:string[], opts?: child_process.SpawnOptionsWithoutStdio):ChildProcess{
    const temp =  createTempScript( file, args, "elevate", opts );
    return startProcess( temp.script, opts,  "elevate", temp );
}


export type ExecuteMode = RumMode|RumMode[]| {
    shell?:string,
    mode?:RumMode|RumMode[]
}
export function execFilePain(file:string, args:string[], opts?: child_process.SpawnOptions, modes?:ExecuteMode){
    const temp =  createTempScript( file, args, modes, opts );
    return startProcess( temp.script, opts, modes, temp );
}

export function execFileBackground(file:string, args:string[], opts?: child_process.SpawnOptions ){
    const temp =  createTempScript( file, args, "background", opts );
    return  startProcess( temp.script, opts, "background", temp );
}

export type ScriptBlocks = string|string[];

export type ExtendedSpawnOptions = SpawnOptions & {
    vars?:{ [p:string]:string }
}
export function execBlock( mode:RumMode|RumMode[], opts: ExtendedSpawnOptions, ...block:ScriptBlocks[]){
    const temp = createBlock( mode, opts, ...block )
    return startProcess( temp.script, opts, mode, temp);
}

