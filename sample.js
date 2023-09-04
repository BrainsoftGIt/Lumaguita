// const { Pool, Client } = require('pg')
// const connectionString = 'postgresql://maguita_dev:1234@127.0.0.2:5432/maguita_dev'
// const pool = new Pool({
//     connectionString,
// })
// pool.query('SELECT NOW()');
//
//
// const client = new Client({
//     connectionString
// })
// client.connect();
//
// const query = client.query(new Query('SELECT NOW()'));
//
// client.query(`
//   -- set "viewargs.colaborador_id" to '00000000-0000-0000-0000-000000000004';
//   select * from get_colaborador;
// `);



const BASE_REMOTE = "luma.brainsoftstp.com";
const RESOLVE_REGEXP = new RegExp(`(^[a-zA-Z0-9]+\\.${BASE_REMOTE})$|^v[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.${BASE_REMOTE}$`);


console.log(RESOLVE_REGEXP.test("luma.brainsoftstp.com"));
console.log(RESOLVE_REGEXP.test("example.luma.brainsoftstp.com")); // true
console.log(RESOLVE_REGEXP.test("v1.example.luma.brainsoftstp.com")); // true
console.log(RESOLVE_REGEXP.test("939.v1.example.luma.brainsoftstp.com")); // true


// console.log( RESOLVE_REGEXP.test( 'luma.brainsoftstp.com' ));
// console.log( RESOLVE_REGEXP.test( 'vd939393.luma.brainsoftstp.com' ));
// console.log( RESOLVE_REGEXP.test( '73lsjs.luma.brainsoftstp.com' ));
// console.log( RESOLVE_REGEXP.test( '--sds.luma.brainsoftstp.com' ));