import {Pool} from "pg";

let pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "maguita_dev",
    database: "maguita_dev",
    password: "1234",
});

pool.connect( ( err, client, done ) => {
    client.on("error", notice => {
        console.log( "error", notice );
    });
    client.on("notice", notice => {
        console.log( "notice", notice );
    });
    client.on("notification", notice => {
        console.log( "notification", notice );
    });


    client.query(`
        do $$
        declare 
          Child_rec_exception EXCEPTION;
        begin
          raise  exception $doc$
          $doc$ using ERRCODE ='custom_error';
        end;
        $$
    `, (err1, result) => {
            console.log( { err1, result })
        })
})
