// import {clinicCore} from "./server/service/database.service/clinica.factory";
// import {catchAll, catchLast, sql} from "kitres";
// import {args} from "./server/global/args";
// import {resolveClinicAllIfNoDatabase} from "./server/modules/api/db/clinic/CallNoErro";
// //
// // catchLast( clinicCore.query( sql`select * from clinic.funct_load_patient('{
// //     "arg_espaco_auth": "65c4033b-aebb-4e5d-9fb0-957359b0984a",
// //     "arg_colaborador_id": "210cf511-1456-4246-865f-017b23ecf294",
// //     "arg_branch_uid": "2227ef41-aaf9-44d2-a601-5cee0fb516b2",
// //     "branch": "d0ffdb72-6159-454e-b989-a9470448c1d5"
// //   }'::jsonb);`)).then( value => {
// //       console.log( "value.row", value.row )
// // });
// //
//
// export function functLoadItens(argument:any) {
//       console.log({dbUserClinic : args.dbUserClinic})
//       if(!args.dbUserClinic){
//             return resolveClinicAllIfNoDatabase();
//       }
//       clinicCore.query( sql `select * from clinic.funct_load_item( ${ argument }) data` ).then( value => {
//             console.log( value )
//       })
//       // const {sql} = factoryClinic.create(Templates.PARAMETERIZED);
//       return catchAll(
//           clinicCore.query( sql `select * from clinic.funct_load_item( ${ argument }) data` )
//       );
// }
//
//
// async function  load(){
//       let datas =  {};
//       let body = {"lods":[{"parmName":"tconsulta","query":{"item_type":4}},{"parmName":"avalicacao","query":{"item_type":1}},{"parmName":"exames","query":{"item_type":2}},{"parmName":"medicamento","query":{"item_type":3}}]}
//       for (const load of body.lods ) {
//             load.arg_espaco_auth = "65c4033b-aebb-4e5d-9fb0-957359b0984a";
//             load.arg_colaborador_id = "210cf511-1456-4246-865f-017b23ecf294";
//             load.arg_branch_uid = "2227ef41-aaf9-44d2-a601-5cee0fb516b2";
//
//             let response = await functLoadItens(load);
//             console.log( response )
//             datas[load.parmName] = response.rows.map(({data}) => {
//                   return data;
//             });
//       }
// }
//
// load();