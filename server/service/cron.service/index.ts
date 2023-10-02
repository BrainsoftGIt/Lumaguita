import moment from "moment";
import {FilenameOpts} from "../log.service";
import cron from "node-cron";
import {string} from "pg-escape";

export const interval = [ "week", "week-day", "day", "month", "hour" ] as const;
export const formats:{ [p in typeof interval[ number ]]:{ format:string, field:keyof moment.Moment }} = {
    "week": { format: "e", field: "week" },
    "week-day":{ format: "ddd", field: "weekday" },
    "day":{ format: "D", field: "day"},
    "month": { format: "MMM", field: "month" },
    "hour":{ format: "HH", field: "hour" }
}

export function intervalNames( mmt:moment.Moment, opts?:FilenameOpts  ): ({ format:string, field: keyof moment.Moment, value:any, intervalName:typeof interval[ number ] })[]{
    let prefix = "", suffix = "";
    if( opts.prefix ) prefix = `[${ opts.prefix }]`;
    if( opts.suffix ) suffix = `[${ opts.suffix }]`;

    return interval.map( next => {
        let format =  `${prefix}[${ next }-]${formats[ next].format}${suffix}`;
        let field:keyof moment.Moment =  formats[ next ].field
        let value;
        // @ts-ignore
        if( typeof mmt[ field ] === "function" ) value = mmt[ field ]();
        return { value, field, format, intervalName: next };
    });
}

export type SimpleCron = string|number|number[]|{ start:number, end: number };

export type CronExpressionOpts = SimpleCron|{
    in:SimpleCron,
    repeat?:number
}

function simple( simple:SimpleCron ):string{
    if( simple === undefined || simple === null ) return "*";
    else if( typeof simple === "number" ) return String( simple );
    else if( typeof simple === "string" && simple.length ) return simple;
    else if ( typeof simple === "string" && !simple.length ) return "*"
    else if( typeof simple === "object" && Array.isArray( simple ) ){
        return simple.map( (value, index) => {
            return cronFormat( value )
        }).join( "," )
    } else if( typeof simple === "object" ){
        if( !simple ) return "*";
        else return `${ cronFormat( simple.start )}-${ cronFormat( simple.end )}`
    }
}
export function cronFormat( exp:CronExpressionOpts ):string{
    if( !exp ) return "*";
    if( typeof exp === "object" && ( exp["in"] || exp[ "repeat" ] ) ){
        return `${simple( exp["in"] )}/${ exp[ "repeat" ] }`
    } else {
        // @ts-ignore
        return simple( exp );
    }
}

export type CronOpts = {
    minute?: CronExpressionOpts,
    hour?: CronExpressionOpts,
    day?: CronExpressionOpts,
    month?: CronExpressionOpts,
    week?: CronExpressionOpts,
};

const intervals: ( keyof CronOpts )[] = [ "minute", "hour", "day", "month", "week" ];
export function createExpression ( opts:CronOpts ):string{
    if( !opts ) opts = {};
    intervals.forEach( (key, index) => {
        opts[ key ] = cronFormat( opts[ key ] );
    });
    return  intervals.map( key => opts[ key ] ) .join( " " );
}

export type CronService = {
    name: string
    callback( mmt:moment.Moment )
    expression:string
    opts:CronOpts|string
    task: cron.ScheduledTask
}

const services: { [p:string]: CronService } = {};

export const cronManager = {
    register( name:string, opts:(( instant:moment.Moment )=>void)|CronOpts|string, callback?:(( instant:moment.Moment )=>void ) ){
        let _opts:CronOpts|string;

        if( typeof opts === "function" ){
            callback = opts;
            _opts = {};
        } else {
            _opts = opts;
        }

        if( typeof callback !== "function" ) throw new Error( "Invalid cron callback!" );
        if( services[ name ] ){
            services[ name ].task.stop();
        }
        let expression:string;
        if( typeof _opts === "string" ) expression = _opts;
        else expression = createExpression( _opts );

        console.log( `[maguita] Cron> service ${name} ->> ${ expression }...` );
        const _service: CronService = {
            callback,
            task: cron.schedule( expression, ()=>{
                if( typeof _service.callback !== "function" ) return;
                _service.callback( moment( new Date() ))
            }),
            expression,
            name,
            opts: _opts
        };
        services[ name ] = _service;
        console.log( `[maguita] Cron> service ${name} ->> ${ expression }... CREATED REGISTERED STARTED!` );
        return services[ name ];
    }, getService( name ){
        return services[ name ];
    }, start( name ){
        const _service =  services[ name ];
        if( !_service ) return;
        console.log( `[maguita] Cron> service ${name} ->> ${ _service.expression }... START!` );
        return _service.task.start();

    }, restart( name ){
        const _service =  services[ name ];
        if( !_service ) return;
        console.log( `[maguita] Cron> service ${name} ->> ${ _service.expression }... RESTART!` );
        _service.task.stop();
        _service.task.start();

    }, play( name ){
        const _service =  services[ name ];
        if( !_service ) return;
        console.log( `[maguita] Cron> service ${name} ->> ${ _service.expression }... PLAY-NOW!` );
        return _service.callback( moment( new Date() ))

    }, stopService( name ){
        const _service =  services[ name ];
        if( !_service ) return;
        console.log( `[maguita] Cron> service ${name} ->> ${ _service.expression }... STOPPED!` );
        return _service.task.stop();
    }, stopAllService(){
        return Object.keys( services ).map( key => services[ key ].task )
            .map( value => value.stop() )
    }, startAll(){
        return Object.keys( services ).map( key => services[ key ].task )
            .map( value => value.start() )
    }, unRegister( serviceName:string ){
        let _service = services[ serviceName ];
        if( !_service ) return;
        console.log( `[maguita] Cron> service ${serviceName} ->> ${ _service.expression }... UNREGISTERED!` );
        _service.task.stop();
        delete services[ serviceName ];
    }, existsService (serviceName){
        return !!services[ serviceName ];
    }
};


