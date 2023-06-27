import { app } from '../../../service/web.service';
import * as path from "path";
import * as child_process from "child_process";
import * as fs from "fs";

app.get("/backup.sql", async (req, res) =>{
    //language=file-reference
    let min = 1000000;
    let max = 9999999;
    let code = Math.trunc( (Math.random() * (max-min))+min );

    let local = path.join( __dirname, `../../../../build/database/compile/prepare/dump-${ code }-downloads.sql` );
    child_process.exec( `pg_dump -U maguita -d maguita_uuid -cOv --if-exists -f ${ local } -h localhost`,{
        env:{  PGPASSWORD: "1234" }
    }).on( "exit", code => {
        res.sendFile( local );
        setTimeout(()=>{
           fs.unlinkSync( local );
        }, 1000 * 60 * 2 );
    }).on( "error", err => console.error( err ) )
});

app.post("/api/login/pin", async (req, res) =>{
    const {functAuthenticate} = require("../db/call-function-login");
    const response = await functAuthenticate({arg_auth_name: "id", arg_auth_value: req.body.colaborador_id,
        arg_auth_method: "pin", arg_auth_key: req.body.pin});
});
app.post("/api/login/admin", async (req, res) =>{
    const {functAuthenticate} = require("../db/call-function-login");
    const response = await functAuthenticate({arg_auth_name: "email", arg_auth_value: req.body.email,
        arg_auth_method: "senha", arg_auth_key: req.body.pwd});
    if(response.rows.length > 0){
       let acessos = response.rows[0].acesso.filter(function (menu) {
           return menu.menu_codigo.includes("maguita.pos");
        });
       if(acessos.length > 0){
           req.session.auth_data = response.rows[ 0 ];
           req.session.save(() =>{
               res.json({result: true, user_name : response.rows[0].colaborador_nome, adminAccess: true, acessos: response.rows[0].acesso});
           });
       }
       else res.json({result: true, adminAccess: false});
    }
    else res.json({result: false});
});
app.get("/api/workspace", async (req, res) =>{
    const {functLoadWorkSpaces} = require("../db/call-function-login");
    console.log( req.session.auth_data.colaborador_id);
    const response = await functLoadWorkSpaces({arg_colaborador_id: req.session.auth_data.colaborador_id});
    if(response.rows.length > 0){
        req.session.auth_space = response.rows[0].funct_load_trabalha;
        req.session.save(() =>{
            res.json({spaceWork: response.rows});
        });
    }
    else  res.json({spaceWork: response.rows});
});

app.get("/api/simplespace", async (req, res) =>{
    const {functLoadSimpleSpace} = require("../db/call-function-login");
    const response = await functLoadSimpleSpace({arg_espaco_auth: req.session.auth_space.espaco_id});
    res.json({space: response.rows});
});
app.post("/api/load/constants", async (req, res) =>{
    const {functLoadConstants} = require("../db/call-function-login");
    const response = await functLoadConstants(req.body);
    res.json({constants: response.rows});
});