import { status } from "./updater";

import * as escape from "pg-escape";
import {SQLTranslator} from "zoo.pg/lib/query-shoot";
import {escapedParameter} from "./escaped";
import {base} from "./base.sql";

export function installCore(connection:{sql:SQLTranslator }){
    let schema  = escapedParameter( escape.ident( status.configs.schema ) );
    let _schema = escapedParameter(  `*/ ${ escape.ident( status.configs.schema ) } . /*` );

    let sql = ( str:TemplateStringsArray, ...values )=>{
        let text = "";
        let counter=0;
        str.forEach( (value, index) => {
            if( index >0 ) {
                let label = `<< EXPRESSION $${ ++counter }>>`;
                if( values[ index-1 ].literal) label = values[ index-1 ].literal;
                text+= label;
            }
            text+= value;
        });
        if( status.debugRaw ) console.log( text );
        return connection.sql( str, ...values );
    }

    return base({ schema, _schema, sql } );
}