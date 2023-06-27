const { Pool, Client } = require('pg')
const connectionString = 'postgresql://maguita_dev:1234@127.0.0.2:5432/maguita_dev'
const pool = new Pool({
    connectionString,
})
pool.query('SELECT NOW()');


const client = new Client({
    connectionString
})
client.connect();

const query = client.query(new Query('SELECT NOW()'));


client.query(`
  -- set "viewargs.colaborador_id" to '00000000-0000-0000-0000-000000000004';
  select * from get_colaborador;
`);