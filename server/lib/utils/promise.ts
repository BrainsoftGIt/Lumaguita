
export type PromiseResolver<T> = {error?:any,success?:T};

export function promiseResolve<T>( promise:Promise<T> | T ):Promise<PromiseResolver<T>>{
    return new Promise( resolve => {
        if( promise instanceof Promise) promise.then( success => {
            resolve({ success })
        }).catch( error => {
            console.error( error )
            resolve({ error })
        }); else resolve( { success: promise } );
    });
}

export function promiseResolveAny( ...promises:Promise<any>[] ):Promise<(PromiseResolver<any>)[]&PromiseResolver<any>>{
    return new Promise( resolve => {
        let _results:({error?:any,success?:any})&{error?:any,success?:any}[] = [];
        let total = promises.length;

        let __next = ( result: {error?:any,success?:any} )=>{
            _results.push( result );
            if( promises.length === 0 && total === 1 ) {
                _results.error = _results[0].error;
                _results.success = _results[0].success;
            }
            if( promises.length === 0 ) return resolve( _results );
            __iterate();
        }

        let __iterate = () =>{
            let next = promises.shift();
            next.then( success => __next( { success }))
                .catch( error => __next( { error }))
        }
        __iterate();
    });
}

export function promiseResolveAnyParallel( ...promises:Promise<any>[] ):Promise<({error?:any,success?:any})[]&{error?:any,success?:any}>{
    return new Promise( resolve => {
        let _results:({error?:any,success?:any})&{error?:any,success?:any}[] = [];
        let total = promises.length;
        let __next = ( result:{error?:any,success?:any }, index ) =>{
            _results[ index ] = result;
            if( total === _results.length && total === 1 ){
                _results.error = _results[0].error;
                _results.success = _results[0].success;
            }
            if( total === _results.length ) resolve( _results )
        }

        promises.forEach( (value, index) => {
            value.then( success =>__next({ success }, index))
                .catch( error => __next({error}, index ))
        });
    });
}
