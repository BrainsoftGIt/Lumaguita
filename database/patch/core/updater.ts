import {factory} from "../../../server/service/database.service";
import {catchAll, catchLast, Templates} from "zoo.pg";
import {promiseResolve} from "../../../server/lib/utils/promise";
import escape from "pg-escape";
import {escapedParameter} from "./escaped";
import chalk from "chalk";
import * as Path from "path";
import {folders} from "../../../server/global/project";
import moment from "moment";

type Life = {
    start?:string|Date
    end?:string|Date
}

export type Updater = {
    identifier:string,
    flags?:( "@unique" | "@force" )[],
    exclude?:(()=>(Promise<boolean>|boolean))|boolean
    ignoreError?:boolean
    life?:Life
    before?:SQLBlock,
    after?:SQLBlock,
    template?:TemplateOpts
}

type Identifier = { class:"block"|"file", ref?:string, name:string, before?:string|string[], after?:string|string[ ] }
export type SQLBlock = Identifier & {
    class:"block",
    ref?:string
    file:string,
    identifier:string,
    template:TemplateStringsArray,
    values:any[]
    raw:string,
    parameters:any[],
    opts:Updater
}

export type FileIdentifier = Identifier & {
    class:"file"
    path:string,
    filename:string,
    dirname:string
}

export type PatchConfigs = {
    schema:string,
    onBlockSuccess?( block:SQLBlock, success:any ):Promise<void>

    /**
     * Resolve true if continue with ignore error
     * @param block
     * @param success
     */
    onBlockFailed?( block:SQLBlock, success:any ):Promise<void|true>
}

export const status:{  blocks:SQLBlock[], configs?:PatchConfigs, debugRaw?:boolean } = {
    blocks:[]
}
export let BK:object = {};

function templateOrder ( str:TemplateStringsArray, values:any[]):({type:"t"|"v", raw:string|any })[]{
    let result = [];
    str.forEach( ( next, index )=>{
        result.push( { type:"t", raw: next } );
        if( index < values.length ) result.push( { type: "v", raw: values[ index ] } );
    })
    return result;
}

function templateFormat( any:any ):string{
    if( typeof any === "string" ) return any;
    return any;
}

export type TemplateOpts = {
    parameterized?:boolean
}
function templateMount(  str:TemplateStringsArray, values:any[], opts?:TemplateOpts ):{ text:string, parameters?:any[]}{
    if( !opts ) opts = {};

    let result = templateOrder( str, values );
    let text=  result.map( (value, index) => {
        if( value.type === "t" ) return value.raw;
        else return templateFormat( value.raw );
    }).join( "" );

    return { text };
}

function checkExclusion( block:SQLBlock ):Promise<boolean>{
    if( typeof block?.opts?.exclude !== "function" ) return Promise.resolve( false );
    return promiseResolve( block.opts.exclude() ).then( value => {
        return Promise.resolve( value.success );
    });
}

function collect( block:SQLBlock ):SQLBlock{
    block.ref = `ref:${ block.file }//${block.identifier}`;
    status.blocks.push( block );
    return block;
}

function order():SQLBlock[]{
    let result:SQLBlock[] = [];
    let blocks = status.blocks.map( value => value.ref );
    let next = ( ref?:string)=>{
        if( !ref ) ref = blocks.shift();
        else {
            let index = blocks.findIndex( value => value === ref );
            if( index !== -1 ) blocks.splice( index, 1 );
        }

        let block = status.blocks.find( value => value.ref === ref  );

        status.blocks.filter( value => value.opts?.before?.ref === ref && blocks.includes( value.ref ) )
        .forEach( before => {
            next( before.ref );
        });

        if( block.opts.after && blocks.includes( block.opts.after.ref ) ){
            next( block.opts.after.ref );
        }
        result.push( block );
    }

    while ( blocks.length ){
        next()
    }

    return result;
}

function template( _module:NodeModule, opts:Updater|string ): ((str:TemplateStringsArray, ...values:any[] )=>SQLBlock){
    let _opts:Updater;
    if( typeof opts === "string" ) _opts = { identifier: opts };
    else _opts = opts;

    return ( str, ...values:any[] )=>{
        let mnt = templateMount( str, values, _opts.template )
        return collect( {
            class: "block",
            name: _module.exports?.name,
            after: _module.exports?.after,
            before: _module.exports?.before,
            file: Path.relative( folders.snapshot, _module.filename ),
            identifier: _opts.identifier,
            template: str,
            values: values,
            raw: mnt.text,
            parameters: mnt.parameters,
            opts: _opts
        } );

    }
}

function sqlFiles( _module:NodeModule, opts:Updater|string ){

}

export function block( _module: NodeModule, opts:Updater|string ){
    return {
        sql:template( _module, opts ),
        sqlFiles: sqlFiles( _module, opts )
    }
}


function connection(){
    return { sql:factory.create(Templates.PARAMETERIZED).sql }
}


export function applyPatches( configs:PatchConfigs ){
    status.configs = configs;
    return new Promise( ( resolve, reject ) => {
        let revisions = order();
        status.blocks.length = 0;
        require( './install' ).installCore( connection() ).finally( () => {
            promiseResolve( apply( revisions  ) ).then( value => {
                resolve( value );
            });
        })
    });
}

function apply( sqlBlocks:SQLBlock[]  ){
    let schema = escape.ident( status.configs.schema );
    let _blockSuccess = status.configs.onBlockSuccess;
    let _blockFailed = status.configs.onBlockFailed;

    return new Promise( (resolve, reject ) => {
        let next = ( )=>{
            const  _next = sqlBlocks.shift();
            if( !_next ) return resolve( true );

            checkExclusion( _next ).then( value => {
                if( value ) {
                    console.log( "[MAGUITA] Database patch>", _next.ref, chalk.yellowBright( 'SKIPPED' ) );
                    return next();
                }
                let _now = moment().toDate();
                let _start = moment( _next?.opts?.life?.start || _now ).toDate();
                let _end = moment( _next?.opts?.life?.end || _now ).toDate();

                if( _start.getTime() > _now.getTime() || _end.getTime() < _now.getTime() ) {
                    console.log( "[MAGUITA] Database patch>", _next.ref, chalk.yellowBright( 'EXPIRED' ) );
                    return next();
                }

                let args = {
                    file: _next.file,
                    identifier: _next.identifier,
                    raw: _next.raw,
                    flags: _next.opts.flags,
                };

                let apply = ()=>{
                    promiseResolve( catchLast(
                        connection().sql `select p.*  from ${ escapedParameter( schema ) }.revision( ${ args } ) p`
                    )).then( value => {
                        if( value.success ){
                            if( typeof _blockSuccess === "function" ) promiseResolve( _blockSuccess( _next,  value.success ) )
                                .then( ()=>{ next() } )
                            else next()
                        } else if( _next.opts.ignoreError  ) next();
                        else if( typeof _blockFailed === "function"  ){
                            let result = _blockFailed( _next, value.error );
                            promiseResolve( result ).then( value1 => {
                                if( !result || !value1.success ) reject( value.error );
                                else next();
                            })
                        }
                        else reject( value.error )
                    })
                }
                let raw = [ _next.raw ];
                let s:TemplateStringsArray = Object.assign( raw,{ raw: raw });
                apply();
            });
        }
        next();
    })
}
