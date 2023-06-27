import "../../server/patches/global/child_process_patches";
import { terminal } from "terminal-kit";
import { DBArgs} from "../../server/global/args";
import {compileDatabase, CompileDatabaseOpts } from "./install";
import {SingleColumnMenuOptions} from "terminal-kit/Terminal";
import {connectionsName, connFactory} from "./conn";
import {Arguments} from "zoo.util/lib/arguments";
import os from "os";
import {pgServer} from "../../server/lib/postgres/pg-recoginizer";
import {DEFAULTS} from "../../server/global/defaults";
import {envStatus} from "../status";

const term = terminal;

const steppes:(( next:(()=>void) )=>void)[] = [];
let nav: typeof steppes;


const start =()=>{
    nav = [ ...steppes ];
    const next = ()=>{
        if( steppes.length ) {
            let _next = steppes.shift();
            _next( next );
        } else process.exit();
    };
    next();
}

const compileOpts:CompileDatabaseOpts = {
    force:false,
    create:false,
    clean: false,
    grants: false
}

let args:DBArgs = require("../../server/global/args").args;

function terminate() {
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
}
term.on( 'key' , function( name , matches , data ) {
    // console.log( "'key' event:" , name ) ;
    if ( name === 'CTRL_C' ) { terminate() ; }
} ) ;

let tOpts:SingleColumnMenuOptions = {
    cancelable: true
}

type Cli = {
    cliNew:boolean,
    cliLocal:boolean,
    cliForce:boolean
    cliCreate:boolean
    cliClean:boolean
    cliMenu:boolean
    cliGrants:boolean
    cliConnection: keyof typeof connFactory|string
    cliYes: boolean
    cliConfirm: boolean
    showCommandOnly?:boolean
    info:boolean
}
let cliArgs = new Arguments<Cli>( true );
cliArgs.define({ name: "cliNew", alias: "N", type: Boolean, value: false } );
cliArgs.define({ name: "cliLocal", alias: "L", type: Boolean, value: false } );
cliArgs.define({ name: "cliForce", alias: "f", type: Boolean, value: false } );
cliArgs.define( { name: "cliCreate", alias: "d", type: Boolean, value: false } );
cliArgs.define( { name: "cliClean", alias: "c", type: Boolean, value: false } );
cliArgs.define( { name: "cliMenu", alias: "m", type: Boolean, value: false } );
cliArgs.define( { name: "cliGrants", alias: "g", type: Boolean, value: false } );
cliArgs.define( { name: "cliConnection", type: String } );
cliArgs.define( { name: "cliYes", alias: "y", type: Boolean, value: false } );
cliArgs.define( { name: "cliConfirm", alias: "Y", type: Boolean, value: false } );
cliArgs.define( { name: "info", alias: "I", type: Boolean, value: false } );
cliArgs.define( { name: "showCommandOnly", alias: "C", type: Boolean, value: false } );

let cliValues = cliArgs.values;
compileOpts.showCommandOnly = cliValues.showCommandOnly;

if( cliValues.cliNew ){
    Object.assign( cliValues, {
        cliForce: true,
        cliCreate: true,
        cliClean: true,
        cliGrants: true,
        cliMenu:true
    })
}

if( cliValues.cliLocal && (!cliValues.cliConnection || cliValues.cliConnection === "local" ) ) cliValues.cliConnection = "local";
else if( cliValues.cliLocal && cliValues.cliConnection ) cliValues.cliConnection = null;

steppes.push( ( next ) => {
    compileOpts.force = cliValues.cliForce;
    if( compileOpts.force ){
        return next();
    }

    terminal( "Limpar e reconfigurar a base de dados?" ).singleRowMenu( [ "Não", "Sim"], tOpts, (err, arg) => {
        compileOpts.force = arg.selectedIndex === 1;
        next();
    });
});

steppes.push( ( next ) => {
    compileOpts.create = compileOpts.force||cliValues.cliCreate;
    if( compileOpts.create ){
        return next();
    }

    terminal( "Criar banco de dados e utilizador?" ).singleRowMenu([ "Sim", "Não"], tOpts,  (err, arg) => {
        compileOpts.create = arg.selectedIndex === 0;
        next();
    });
});

steppes.push( ( next ) => {
    compileOpts.clean = cliValues.cliClean || compileOpts.create;
    if( compileOpts.clean ) return next();

    terminal( "Reiniciar o estado dos dados?" ).singleRowMenu([ "Não", "Sim" ], tOpts, (err, arg) => {
        compileOpts.clean = arg.selectedIndex === 1;
        next();
    });
});

steppes.push( ( next ) => {
    compileOpts.menu = cliValues.cliClean || compileOpts.create || cliValues.cliClean;
    if( compileOpts.menu ) return next();

    terminal( "Reconfigurar menus?" ).singleRowMenu([ "Não", "Sim" ], tOpts, (err, arg) => {
        compileOpts.menu = arg.selectedIndex === 1;
        next();
    });
});

steppes.push( ( next ) => {
    compileOpts.grants = cliValues.cliGrants || compileOpts.create;
    if( compileOpts.grants )return next();

    terminal( "Reconfigurar os grants?" ).singleRowMenu([ "Sim", "Não" ], tOpts, (err, arg) => {
        compileOpts.grants = arg.selectedIndex === 0;
        next();
    });
});

steppes.push( ( next ) => {
    let _conn:any = cliValues.cliConnection;
    if( _conn && connectionsName.includes( _conn ) ){
        compileOpts.connection = _conn;
        return next();
    }
    terminal( "Especifica o tipo de conexão?"+ connectionsName.join( " | " ) ).singleRowMenu( connectionsName, tOpts, (err, arg) => {
        compileOpts.connection = arg.selectedText;
        next();
    });
});

steppes.push( ( next ) => {
    envStatus( args, compileOpts );
    if( cliValues.cliYes && cliValues.cliConfirm ) {
        return next();
    }
    terminal( "Continuar com a compilação?" ).singleRowMenu([ "Sim", "Restart", "Cancel" ], tOpts, (err, arg) => {
        if( arg.selectedIndex === 2 ) return process.exit( 0 );
        else if( arg.selectedIndex === 1 ) return start();
        else if( arg.selectedIndex === 0 ) return next();
        else return process.exit( -1 );
    });
});

const compile = ( next ) => {
    compileDatabase( args, compileOpts ).then( value => {
        console.log( value );
        next();
    }).catch( reason => {
        console.error( reason );
        next();
    })
}
steppes.push( ( next )=>{
    //Final steps
    console.log( "====================== Final steeps ====================" );
    if( os.platform() === "win32" ){
        pgServer.recognizePath( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then(value => {
            compile( next );
        })
    } else compile( next );

});

if( cliValues.info ){
    envStatus( args, compileOpts );
} else {
    start();
}




