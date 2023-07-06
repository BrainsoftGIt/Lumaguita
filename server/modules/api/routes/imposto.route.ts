import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import {functGetArticleTax, functLoadImpostos} from "../db/call-function-settings";
import fs from "fs";
import path from "path";

app.post("/api/tax", async (req, res) =>{
    const {functRegistarImposto} = require("../db/call-function-settings");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = await functRegistarImposto(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "TAX",
            extras: null,
            message: null
        });
    }
});
app.get("/api/impostos", async (req, res) => {
    const {functLoadImpostos} = require("../db/call-function-settings");
    const response = await functLoadImpostos({arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id });
    const fs = require("fs");
    //language=file-reference
    let taplicar = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../lib/json/taplicar.json")));
    res.json({impostos: response.rows, taplicar_data: taplicar});
});

app.get("/api/impostos/codes", async (req, res) => {
    const {functLoadTaxCodes} = require("../db/call-function-settings");
    const {rows: taxCodes} = await functLoadTaxCodes();
    res.json({ taxCodes });
});

app.post("/api/imposto/artigo", async (req, res) => {
    const {functGetArticleTax} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req.body.is_admin ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.body.is_admin ? req.session.auth_data.auth.colaborador_id : req.session.user_pos.auth.colaborador_id;
    const response = await functGetArticleTax(req.body);
    res.json({tax: response.rows});
});