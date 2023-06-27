import {ClusterEvent} from "../enuns";
import {ClusterPropagation, ClusterSource, identifierOf} from "../types";
import {colors} from "../colors";
import {NavigatorAgent} from "../agents/NavigatorAgent";
import chalk from "chalk";

export type RouterNav ={
    event:ClusterEvent,
    origin:ClusterSource,
    destine:ClusterSource,
    preview:ClusterSource,
    route:string[ ]
}

type SourceType = "CLIENT"|"SERVER"|"CONNECTED:AS-SERVER"|"CONNECTED:AS-CLIENT"|"REJECT:AS-SERVER"|"REJECT:AS-CLIENT";
export type Jump = {
    id:string,
    linkId:string,
    linkType:"DIRECT"|"REMOTE"
    name: string,
    path: string,
    type: "child"|"master"|"remote",
    connection:"ON"|"OFF"|"REMOTE",
    source?:SourceType[]
}

export type MapJumpConnection = Jump & {
    link:any
}

export class RouteListener {
    
    private _jumps:Jump[] = [];
    private readonly _navigator:NavigatorAgent;


    constructor( navigator:NavigatorAgent ) {
        this._navigator = navigator
        this._navigator.context.connector.onConnectionListener(socket => {
            this.register( socket );
        })
    }

    get jumps ( ) { return this._jumps; }

    toSource( jump:Jump ):ClusterSource{
        return  {
            cluster_identifier: jump.id,
            cluster_name: jump.name,
            cluster_path: jump.path
        }
    }

    describe(){
        console.log( `TABLE ROUTE ON ${ colors.identifier( this._navigator.context.id ) }` );
        console.table( this._jumps );
    }

    servers(){
        return this._jumps.filter( value => value.source && value.source.includes( "SERVER" ) );
    } clients(){
        return this._jumps.filter( value => value.source && value.source.includes( "CLIENT" ) );
    }

    registerJump( map: Jump ){
        if( !map.id || !map.linkId )throw new Error( "Jump Map Mall Formated" );
        this._jumps.push( map );

    } rememberJumpForm( source:ClusterSource, propagation:ClusterPropagation ){
        let actualOrigin = this._jumps.filter( value => value.linkId === source.cluster_identifier );

        let news = propagation.jumps.filter( newValue => !actualOrigin.find( find => find.id === newValue.id ) );
        let oldKeeps = propagation.jumps.filter( newValue => actualOrigin.find( find => find.id === newValue.id ));
        let final = this._jumps.filter( value => value.linkId !== source.cluster_identifier );

        news.forEach( value => { value.source = null; });
        oldKeeps.push( ...news );

        oldKeeps.forEach( nextJump => {
            nextJump.linkId = source.cluster_identifier;
            nextJump.type =  "remote";
            nextJump.linkType = "REMOTE";
            nextJump.connection = "REMOTE";
        });

        this._jumps.splice( 0, this._jumps.length );
        this._jumps.push( ...final, ...oldKeeps );

    } unregisterJump( source:ClusterSource ){
        this._jumps.splice( this._jumps.findIndex( value => value.id === source.cluster_identifier ), 1);

    } start(event:ClusterEvent, destine:ClusterSource, ...data ){
        const route:RouterNav = {
            event: event,
            route: [ ],
            destine: destine,
            preview: null,
            origin: this._navigator.context.origin()
        }
        return this.nextJump( route, ...data );
    } register( socket ){
        const self = this;
        socket.on( ClusterEvent.JUMP, ( route:RouterNav, ...data ) => {
            self.nextJump( route, ...data );
        })
    } nextJump( route:RouterNav, ...data ){
        const direction = this._jumps.find( value => {
            return value.id === route.destine.cluster_identifier;
        });

        if( !direction ){
            console.log( `${chalk.redBright.underline( "UNDETERMINED DIRECTION:" ) } ON ${ this._navigator.context.id } FROM ${ colors.identifier( route.origin.cluster_identifier) } TO ${colors.identifier( route.destine.cluster_identifier )}`);
            this._navigator.notifyOnUndeterminedDirection( route, ...data );
            return;
        }


        let nextJump, event;
        if( direction?.linkType === "REMOTE" ){
            nextJump = direction.linkId;
            event = ClusterEvent.JUMP;
        } else {
            nextJump = direction.id;
            event = route.event;
        }

        let connection = this._navigator.context.connector.of( nextJump ); //this._connections.find( node =>  node.id === nextJump );
        if( connection ){
            route.route.push( this._navigator.context.id );
            route.preview = this._navigator.context.origin();
            connection.emit( event, route, ...data );
            let jumpMode = event === route.event? "FOUND":"CONTINUE";
            console.log( `${colors.event( ClusterEvent.JUMP )}:${colors.name( jumpMode )}\\${ colors.event( route.event  ) } ON ${ identifierOf( this._navigator.context.localCluster )} FROM ${ identifierOf( route.origin ) } TO ${ identifierOf( route.destine ) } USING ${ colors.action( direction.linkType === "DIRECT", direction.linkType, direction.linkType )} JUMP ${ identifierOf( nextJump )}` )
        } else console.error( new Error( `Route not found TO ${ colors.identifier( route.destine.cluster_identifier ) } USING ${ this._jumps.join( ", " ) }` ) )
        return connection;
    }
}