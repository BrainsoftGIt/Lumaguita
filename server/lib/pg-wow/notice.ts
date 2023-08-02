//
//
// export class Result {
//     readonly result;
//     readonly message;
//     readonly data;
//     readonly err;
//
//     constructor ( _res:any, err:any|null|undefined = null ) {
//         const object = typeof _res === "object" && !!_res;
//         this.result = _res && object && _res.result;
//         this.message = _res && object ? _res.message : null;
//         this.data = _res && object? _res.data : null;
//         if( err ){
//             this.result = false;
//             this.err = err;
//             this.message = err.message;
//         }
//     }
// }
//
//
// export class NoticeWow implements NoticeMessage{
//     severity_local;
//     severity;
//     code;
//     where;
//     file;
//     line;
//     routine;
//     message;
//     length;
//     name;
//     private _json = null;
//     private _libResult: Result|null|undefined = null;
//
//     constructor( props ) {
//         Object.keys( props ).forEach( key => {
//             if( !props[ key ] ) return;
//             this[ key ]= props[ key ];
//         })
//     }
//
//     get json(){
//         if( !this._json ) this._json = JSON.parse(this.message);
//         return this._json;
//     }
//
//     get asJson(){
//         try{
//             return this.json;
//         }catch (e) {
//             return this._json;
//         }
//     }
//
//     /** @return { Result }*/
//     get asResult(){
//         if( this._libResult ) return this._libResult;
//         const json = this.asJson;
//         if( !json ) return null;
//         this._libResult = new Result( json );
//         return this._libResult;
//     }
// }
