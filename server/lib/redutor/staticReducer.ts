export type ReducerHeader = ( string|{name:string,map:ReducerHeader[] } );
export type ReducerSource = ( number|string|any )[];
export type SourceIndex = number|string|(SourceIndex[]);
export type ReducerRow =SourceIndex[]
export type ReducerValue = any;
export type ReducerTransform = ( string | ReducerTransform )[];
export type ReducerList = ReducerValue[];
export type ReducerResult = {
    statics: number,
    transform:ReducerTransform,
    header: ReducerHeader[],
    source: ReducerSource,
    rows:ReducerRow[],
    length:number
};


function _transform ( transform:ReducerTransform, _transformed?:ReducerTransform ){
    if( !_transformed ) _transformed = [];
    transform.forEach( (value, index) => {
        if( typeof value === "string" ) _transformed.push( [ value ].join("/") );
        else if( Array.isArray( value ) ){
            _transformed.push( value.join( "/" ) )
        }
    })
    return _transformed;
}


function _header( object:any, stopOn:number, transform:ReducerTransform, currentLevel?:number, basePath?:ReducerTransform ){
    if( !currentLevel ) currentLevel = 0;

    let result = [];
    let value;
    let _map:ReducerHeader;
    if( !basePath ) basePath = [];
    Object.keys( object ).forEach( ( key  => {
        value = object[ key ];
        let path = [ ...basePath, key ];

        if( typeof value === "string" && transform.includes( path.join("/") ) )
            value = JSON.parse( value );


        _map = key;

        if( value && typeof value === "object" && currentLevel < stopOn) {
            _map = {
                name: key,
                map: _header( value, stopOn, transform, currentLevel+1, path )
            }
        }
        result.push( _map );
    }));
    return result;
}

function _map(object:ReducerValue, map:ReducerHeader[], source:ReducerSource, transform, rNumber, row?:ReducerRow, level?:number, basePath?:ReducerTransform ):ReducerRow{
    if( !row ) row = [];
    if( !level ) level = 0;
    let value;
    let sourceIndex;
    let last;
    let name;
    let path:ReducerTransform;
    if( !basePath ) basePath = [];

    map.forEach( ( key )=>{
        name = ( typeof key === "object" )? key.name: key;
        path = [ ...basePath, name ];

        value = object[ name ];
        if( typeof value === "string" && transform.includes( path.join( "/" ) ) )
            value = JSON.parse( value );

        if( typeof key === 'string' ){
            value = object[ key ];
            sourceIndex = source.indexOf( value );
            if( sourceIndex === -1 ){
                source.push( value );
                sourceIndex = source.length-1;
            }
            if( row.length > 0 ) last = row[ row.length -1 ];
            else last = null;
            if( last !== null && last === sourceIndex ) row[ row.length -1 ] = [ last, 2 ];
            else if( Array.isArray( last ) && last[ 0 ] === sourceIndex ) last[ 1 ]++;
            else row.push( sourceIndex );
        } else if( value ) _map( value, key.map,  source, transform,rNumber, row, level+1, path );

    })
    return row;
}


export type ReducerReverse = {
    increment:number,
    object:any
}

function __reverse( header:ReducerHeader[], row:ReducerRow, source:ReducerSource, start?:number ):(ReducerReverse){
    let object = {};
    if( !start ) start = 0;
    let increment = 0;
    let _complex:ReducerReverse;
    let value;
    header.forEach( ( keyName, index) => {
        let sourceIndex:any = row[ start ];
        if( typeof keyName === "string" ){
            value = source[ sourceIndex ];
            object[ keyName ] = value;
            increment++;
            start++;
        }
        else if( typeof keyName === "object" ){
            _complex = __reverse( keyName.map, row, source, start );
            object[ keyName.name ] = _complex.object;
            start += _complex.increment;
            increment += _complex.increment;
        }
    });

    return{
        increment,
        object
    }
}

function __simplify( row:ReducerRow ):ReducerRow{
    let _row:ReducerRow = [];
    row.forEach( (sourceIndex, index) => {
        if( Array.isArray( sourceIndex ) ) for (let i = 0; i < sourceIndex[1]; i++) {
            _row.push( sourceIndex[ 0 ])
        }
        if( typeof sourceIndex === "number" ) _row.push( sourceIndex );
    })
    return _row;
}

export type ReducerOpts = {
    transform?:ReducerTransform,
    staticsLevel?:0|number,
    commonValues?:boolean
};

export function staticReducer(objectList:ReducerList, opts?:ReducerOpts ):ReducerResult{
    let { staticsLevel , transform, commonValues } = opts||{ commonValues: true, staticsLevel: 0 };
    staticsLevel = staticsLevel || 0;
    transform = transform || [ ];

    let result:ReducerResult  = {
        statics: staticsLevel,
        transform:transform,
        header: [],
        source: [],
        rows: [],
        get length() {
            return this.rows.length
        }

    };
    if( commonValues ){
        result.source.push( undefined, null, false, true, "" );
        for (let i = 0; i < 10; i++) result.source.push( i );
        for (let i = -9; i < 0; i++) result.source.push( i );
        for (let i = 10; i <= 101; i++) result.source.push( i );
    }

    result.header = _header( objectList[ 0 ], staticsLevel, _transform( transform ) );

    let row:ReducerRow;
    objectList.forEach( ( rvaluer, index )=>{
        row = _map( rvaluer, result.header, result.source, _transform( transform ), index );
        result.rows.push( row );
    });
    return  result;
}

export function staticExpander(reducerResult:ReducerResult|any ):ReducerList|any {
    return reducerResult.rows.map((row, index) => {
        let _simple = __simplify( row );
        return __reverse( reducerResult.header, _simple, reducerResult.source ).object;
    });
}
