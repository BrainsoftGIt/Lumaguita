import {patch, patchSQL, sql} from "kitres";

export const mySampleRevision = sql`
select 'myRevision1';
`;

export const myUniqueRevision = patch( { unique: true}, sql`
  select 'myUniqueRevision'
`);


export const myUniqueRevision2 = patchSQL({unique: true}).sql`
  select 'myUniqueRevision2';
`;


let myCondition = true;
export const myConditionalRevision1 = patch( { when:myCondition}, sql`
  select 'myConditionalRevision1';
`);


export const myConditionalRevision3 = patchSQL({
    when: () => {
        let myCondition = true;
        return myCondition;
    }
}).sql`
select 'myConditionalRevision  snss3';
`;

export const myUniqueSQL = patchSQL({
    unique: true
}).sql`
select 'myUniqueSQL 44456556';
`;

// export const myAsyncConditionalRevision3 = patchSQL({
//     when: () => {
//         return new Promise( resolve => {
//             setTimeout( ()=>{
//                 resolve( true )
//             }, 5000 );
//         });
//     }
// }).sql`
// select 'myAsyncConditionalRevision';
// `;
// export const myAsyncConditionalRevision4 = patchSQL({
//     when: () => {
//         return new Promise( resolve => {
//             setTimeout( ()=>{
//                 resolve( true )
//             }, 10000 );
//         });
//     }
// }).sql`
// select 'myAsyncConditionalRevision';
// `;
//
// export const myAsyncConditionalRevision = patchSQL({
//     when: () => {
//         return new Promise( resolve => {
//             setTimeout( ()=>{
//                 resolve( true )
//             }, 20000 );
//         });
//     }
// }).sql`
// select 'myAsyncConditionalRevision';
// `;
//
// export const myAsyncConditionalRevision2 = patchSQL({
//     when: () => {
//         return new Promise( resolve => {
//             setTimeout( ()=>{
//                 resolve( true )
//             }, 15000 );
//         });
//     }
// }).sql`
// select 'myAsyncConditionalRevision';
// `;
