import {ClusterContext, SocketType} from "./server";
import {Request, Response} from "express/index";
import {NextFunction} from "express";
import * as path from "path";
import * as fs from "fs";
import {ClusterEvent} from "./enuns";
import {Jump, RouterNav} from "./listeners/route.listener";
import {Cluster, ClusterSource} from "./types";


export type ResourceArgs = {
    resource_name:string
    resource_subpath:string
    resource_extension?:string
    resource_metadata:any
}

export type ResourceObject = {
    object_uid:string
    collector_transuid:string
    object_ref:any
}

export type ResourceSets = ResourceArgs & {
    resource_identifier:string
    resource_cluster:string
    resource_reference:string
    resource_url:string
    resource_version:number
    resource_date:Date
    resource_update:Date,
}

export type ResourceReq = ResourceObject &{
    code:number
    resource:ResourceSets,
    chunks:string[]
}

type ResourceChunk = {
    chunk: any,
    part: number
}
type ResourceHead = {
    total: number,
}

export type ResourceResolve = ResourceSets & {
    resolve:string,
    exists:boolean
    mode:"temp"|"final"
    api?:string
}


const CHUNK_HEAD = "chunk.head";
const PART_EXTENSION = "part";
const CHUNK_NAME = "chunk";
const chunkName= ( i ) => `${ CHUNK_NAME }-${i}`;
const chunkPart = ( i ) => `${CHUNK_NAME}-${i}.${PART_EXTENSION}`;

export class Resource {
    private readonly _context:ClusterContext;


    constructor( context:ClusterContext ) {
        this._context = context;
        this._context.connector.onConnectionListener( (socket, cluster, type ) => this.share( socket, cluster, type  ))
        this._context.navigator.onDiscoverListener( (jump, type, accept) => {
            if( accept && type === "server" ) this.onDiscoverServer( jump, type, accept );
        })
    }

    onDiscoverServer( jump:Jump, type:"server"|"client", accept ){
        let source = this._context.navigator.route.toSource( jump );
        this._context.service.loadResourcePendent( source ).then( ( resources )=>{
            resources.forEach(( value, index) => {
                setTimeout(()=>{
                    this.download( source, value, value );
                }, 1500*index );
            });
        });
    }

    resolveSets( sets:ResourceSets, opts?:{ base?:string, temp?:number } ):ResourceResolve{

        let resolve:string;
        let mode:"temp"|"final"
        if ( opts?.temp ){
            resolve = path.join( this._context.configs.resourceMountPoint, sets.resource_reference );
            const parts = resolve.split( path.sep );
            resolve = parts.join( path.sep );
            fs.mkdirSync( resolve, { recursive: true } );
            mode = "temp";
        } else {
            resolve = path.join( this._context.configs.resource, sets.resource_reference );
            let dir = resolve.split( path.sep );
            dir.pop();
            fs.mkdirSync( dir.join("/"), { recursive: true } );
            mode = "final";
        }

        const reRes:ResourceResolve = {
            ...sets,
            resolve,
            mode,
            exists: fs.existsSync( resolve )
        };

        if( opts?.base ) {
            reRes.api = `${ opts?.base }/${ reRes.resource_url }`
        }

        return reRes;
    }

    async create( args:ResourceArgs, base?:string ):Promise<ResourceResolve>{
        return this._context.service.createResource( args ).then( value => {
            if( !value || value.length < 1 ) return Promise.reject( new Error( "Resource not create" ) );
            return Promise.resolve( this.resolveSets( value[0], {base} ) );
        });
    }

    download( server:ClusterSource, object:ResourceObject, res:ResourceSets ){
        let min = 100000000;
        let max = 999999999;
        let code = Math.trunc( (Math.random()* (max-min)) + min );

        if( fs.existsSync( this.resolveSets( res ).resolve ) ) return;
        let mntResolve = this.resolveSets( res, { temp: code } );

        let chunks:string[] = fs.readdirSync( mntResolve.resolve ).filter( value => {
            let parts = value.split( "-" );
            if( parts.length !== 2 ) return false;
            let part1 = parts[ 1 ].split( "." );
            return parts.length === 2
                && part1.length === 2
                && parts[ 0 ] === "chunk"
                && part1[ 1 ] === "part"
            ;
        })

        let req:ResourceReq = {
            resource: res,
            chunks: chunks,
            code: code,
            object_ref: object.object_ref,
            collector_transuid: object.collector_transuid,
            object_uid: object.object_uid
        };
        this._context.navigator.start( ClusterEvent.RESOURCE_REQ, server, req )
    }

    upload( client:ClusterSource, req:ResourceReq ):boolean{
        let resolve = this.resolveSets( req.resource );
        if( !resolve.exists ){
            this._context.navigator.start( ClusterEvent.RESOURCE_404, client, req );
            return false;
        }
        const stream = fs.createReadStream( resolve.resolve );
        let i = 1;
        stream.on(  "data", ( chunk)=>{
            let index = i-1;
            let res: ResourceChunk = {
                chunk: chunk,
                part: i++
            }
            let chunkName = chunkPart( i )
            if( req.chunks.includes( chunkName ) ) return;
            setTimeout( ()=> this._context.navigator.start( ClusterEvent.RESOURCE_CHUNK, client, res, req ),
                (1000 * 1.1 * index )+1500 );
        });

        stream.on( "end",()=>{
            const res:ResourceHead = {
                total:  i-1
            }
            this._context.navigator.start( ClusterEvent.RESOURCE_HEAD, client, res, req );
        });

        return true;
    }

    complete( req:ResourceReq, resolve:ResourceResolve ){
        if( fs.existsSync( this.resolveSets( resolve ).resolve ) ) return;

        if( !resolve ) return;
        if( resolve.mode !== "temp" ) return;
        if( !fs.existsSync( path.join( resolve.resolve, CHUNK_HEAD) ) ) return;
        let parts = Number( fs.readFileSync( path.join( resolve.resolve, CHUNK_HEAD ) ) );
        for (let i = 1; i <= parts; i++) {
            let chunk = path.join( resolve.resolve, chunkPart( i ) );
            let exists = fs.existsSync( chunk );
            if( !exists ) return;
        }

        let final = this.resolveSets( resolve );
        const write = fs.createWriteStream( final.resolve );
        for (let i = 1; i <= parts; i++) {
            let chunk = path.join( resolve.resolve, chunkPart( i ) );
            let callback = ( error )=>{};

            if( i === parts ) callback = (error )=>{
                if( error ) return;
                write.end();
                this._context.service.setsResourceDownloaded({
                    collector_transuid: req.collector_transuid,
                    object_ref: req.object_ref,
                    object_uid: req.object_uid
                }).then( value => {
                    fs.rmSync( resolve.resolve, { recursive: true, force: true })
                })
            }
            write.write( fs.readFileSync(chunk), callback );
        }
    }

    head( head:ResourceHead, req:ResourceReq ){
        if( fs.existsSync( this.resolveSets( req.resource ).resolve ) ) return;

        let resolve = this.resolveSets( req.resource, { temp: req.code } );
        if( fs.existsSync( path.join( resolve.resolve, CHUNK_HEAD ) ) ) return;

        fs.writeFileSync( path.join( resolve.resolve, CHUNK_HEAD ), `${ head.total }`);
        this.complete( req, resolve );

    } chunk( res:ResourceChunk, req:ResourceReq ){
        if( fs.existsSync( this.resolveSets( req.resource ).resolve ) ) return;

        let resolve = this.resolveSets( req.resource, { temp: req.code });
        let chunk = path.join( resolve.resolve, chunkName( res.part ) );
        let stream = fs.createWriteStream( chunk );
        stream.write( res.chunk, error =>{
            fs.rename(chunk, path.resolve(resolve.resolve, chunkPart( res.part ) ), err => { console.error( err ) });
            stream.end();
            this.complete( req, resolve );
        });
    }

    share(socket:any, cluster:Cluster, type:SocketType ){

        socket.on( ClusterEvent.RESOURCE_REQ, ( route:RouterNav, req:ResourceReq )=>{
            console.log( "ClusterEvent.RESOURCE_REQ" )
            this.upload( route.origin, req );
        });

        socket.on( ClusterEvent.RESOURCE_404, ( route:RouterNav, req:ResourceReq )=>{
            console.log( "ClusterEvent.RESOURCE_404", req.resource.resource_url )
        });
        socket.on( ClusterEvent.RESOURCE_CHUNK, (route:RouterNav, res:ResourceChunk, req:ResourceReq )=>{
            console.log( "ClusterEvent.RESOURCE_CHUNK" );
            this.chunk( res, req );
        });

        socket.on( ClusterEvent.RESOURCE_HEAD, (route:RouterNav, head:ResourceHead, req:ResourceReq )=>{
            console.log( "ClusterEvent.RESOURCE_HEAD" );
            this.head( head, req)
        });

        socket.on( ClusterEvent.RESOURCE_AVAILABLE, (route:RouterNav, resource:ResourceSets )=>{
            console.log( "ClusterEvent.RESOURCE_AVAILABLE" );
            this._context.navigator.start( ClusterEvent.RESOURCE_REQ, route.origin, resource )
        });
    }

    listen(){
        return ( req:Request, res:Response, next:NextFunction )=>{
            let filePath = this.resolve( req.url );
            if( !filePath ){
                res.status( 500 );
                return res.sendFile( this._context.configs.resource_404 );
            }

            if( !fs.existsSync( filePath ) ){
                res.status( 404 );
                res.sendFile( this._context.configs.resource_404 );
                return;
            }

            res.sendFile( filePath );

        }
    }

    resolve( url:string ){
        if( url === null || url === undefined ) return  null;
        url = url.split( "/" ) .filter( value => !!value && value.length > 0 ).join( "/" );
        let parts = url.split( "/" );
        let fileName = parts.pop();
        let fileId = parts.pop();
        let fileRef = `${fileId}-${fileName}`;
        parts.push( fileRef );
        const resolve =  parts.join( "/" );
        let base = this._context.configs.resource;
        return  path.join( base, resolve);
    }
}