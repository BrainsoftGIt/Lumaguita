
export type Column = {
    /**field path*/
    k: ((string|number)[ ])|string|number,

    /** start index*/
    s: number,

    /** last index*/
    i: number,

    /** indexed values */
    v: (number|(number[] ))[ ]
}

export type DynamicReducer = {
    columns:Column[],
    storage:any[],
    keyIndex:(string|number)[ ]
    type:"array"|"object"
}


function dyReduce( rowIndex, row, columns:Column[], ki:any[], storage:any[], route ){
    if( !row ) return;
    Object.keys( row ).forEach( key => {
        let name:string|number = key;

        if( Array.isArray( row ) ) name = Number( name )
        let _ki = ki.indexOf( name );
        if( _ki === -1 ){
            ki.push( name );
            _ki = ki.length-1;
        }
        let _nextRoute:(string|number)[] = [...route, _ki ];

        let value = row[ name ];
        if( value && typeof value === "object" ){
            dyReduce( rowIndex, value, columns, ki, storage, _nextRoute );
        } else {
            let column = columns.find( (column, index1) => {
                if( !Array.isArray( column.k ) && _nextRoute.length === 1 && _nextRoute[ 0 ] === column.k )
                    return true;
                else if( Array.isArray( column.k ) && _nextRoute.length === column.k.length && column.k.join("/") === _nextRoute.join( "/" ) )
                    return true;
            });
            let valueIndex:number = storage.indexOf( value );
            if( valueIndex === -1 ){
                storage.push( value );
                valueIndex = storage.length-1;
            }

            if( !column ) columns.push( column = {
                k: _nextRoute.length>1? _nextRoute : _ki,
                v: [ ],
                i: rowIndex-1,
                s:rowIndex
            } );

            if( column.i+1 === rowIndex ) column.v.push( valueIndex );
            else column.v.push( [ rowIndex, valueIndex ] );
            column.i = rowIndex;
        }
    });
}

function structure( route:(string|number)[], root?:[]|{} ){
    let next = route.shift();
    if( !root && typeof next === "string" ) root = {};
    else if( !root && typeof next === "number" ) root = [];

    let value = root[ next ];
    let last = root;
    if( route.length > 0 ){
        const resolve =  structure( route, value );
        root[ next ] = resolve.root;
        last = resolve.last
    }
    return { root, last };
}

export function dynamicReducer ( list:any ):DynamicReducer|any{
    if( !list ) return null;
    let type:"array"|"object"|"other" = Array.isArray( list )? "array"
        :( typeof list ) === "object"? "object"
        : "other";
    if( type === "other" ) return null;

    const _dyReduce:DynamicReducer = {
        columns:[],
        storage:[],
        keyIndex:[],
        type: type
    }

    Object.keys( list ).forEach( index => {
        let value = list[ index ];
        dyReduce( index, value, _dyReduce.columns, _dyReduce.keyIndex, _dyReduce.storage, [] );

    });
    return _dyReduce
}


export function dynamicExpander<T>( result:DynamicReducer|any ):T{
    let pack;
    if( result?.type === "object" ) pack = {};
    else if( result?.type === "array" ) pack = [];
    else return null;

    result.columns.forEach( (column, idx) => {
        let value;
        let rowIndex;
        let lastIndex = column.s;
        if( !Array.isArray( column.k ) ) column.k = [ column.k ];
        column.k.forEach( (indexColumn, _ki) => {
            column.k[ _ki ] = result.keyIndex[ indexColumn ]
        });

        for ( let i = 0; i< column.v.length; i++ ){
            let current = column.v[ i ];
            let next = null;
            let preview = null;
            if( i > 0 ) preview = column.v[ i-1 ];
            if( i+1 < column.v.length ) next = column.v[ i +1 ];

            if( !Array.isArray( current ) ){
                rowIndex = lastIndex++;
                value = result.storage[ current ];
            } else if( Array.isArray( current ) && current.length ){
                rowIndex = current[ 0 ];
                value = result.storage[ current[ 1 ] ];
                lastIndex = rowIndex+1;
            }

            let root = pack[ rowIndex ];
            let keys = [...column.k ];

            let name = keys[ keys.length-1 ];
            let resolve = structure( keys, root );
            resolve.last[ name ] = value;
            pack[ rowIndex ] = resolve.root;
        }
    });

    return pack;
}
