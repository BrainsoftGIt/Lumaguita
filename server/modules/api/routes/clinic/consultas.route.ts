import {app, storage} from '../../../../service/storage.service';
import {load_space_configuration} from "../print.route";
import fs from "fs";
import path from "path";
import {Folders} from "../../../../global/project";

app.post("/api/clinica/consulta/set", async (req, res) =>{
    const {functSetConsulta} = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functSetConsulta(req.body);
    res.json({response});
});

app.post("/api/clinica/consulta/load", async (req, res) =>{
    const {functLoadConsulta} = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functLoadConsulta(req.body);
    res.json({
        data: response.rows.map(({data}) => {
            return data
        })
    });
});

app.post("/api/clinica/consulta/load/data", async (req, res) =>{
    const {functLoadConsultaData} = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functLoadConsultaData(req.body);
    res.json({
        data: response.rows.map(({data}) => {
            return data
        })
    });
});

async function createPDFReceita(req, file, res){
    let data = JSON.parse(req.params.data);
    let fileData = fs.readFileSync(path.join(Folders.temp, data.file));
    let {client, tratamento, utente} = JSON.parse(fileData.toString());
    let {0: {funct_load_espaco_configuracao: {espaco}}} = await load_space_configuration(req, true);
    let user = req?.session?.auth_data?.auth.colaborador_nome + " " + (req?.session?.auth_data?.auth.colaborador_apelido === null ? "" : req?.session?.auth_data?.auth.colaborador_apelido.split(" ").pop());
    // fs.unlinkSync(path.join(folders.temp, data.file))
    await file.create(espaco, res, user, client, utente, tratamento);
}

app.post("/api/clinica/consulta/export/receita/data", async (req, res) =>{
    let random = (Math.random() + 1).toString(36).substring(7);
    let data = new Date();
    let file = `${random}-${data.getSeconds()}.json`
    fs.writeFile(path.join(Folders.temp, file), JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        res.json(file)
    });
});

app.get("/api/clinica/consulta/export/receita/a4/:data", async (req, res) =>{
    try {
        const file = require("../functions/clinic/export-receita-A4");
        await createPDFReceita(req, file, res);
    }catch (e) {
        console.log(e)
    }
});

app.get("/api/clinica/consulta/export/receita/a5/:data", async (req, res) =>{
    try {
        const file = require("../functions/clinic/export-receita-A5");
        await createPDFReceita(req, file, res);
    } catch (e) {
        console.log(e)
    }
});
