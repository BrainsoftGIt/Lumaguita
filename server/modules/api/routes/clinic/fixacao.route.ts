import {app, storage} from '../../../../service/storage.service';
import {functLoadItens} from "../../db/clinic/call-function-fixacao";

app.post("/api/clinica/fixacao/set", async (req, res) =>{
    const {functSetItens} = require("../../db/clinic/call-function-fixacao");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functSetItens(req.body);
    res.json(response);
});

app.post("/api/clinica/fixacao/load", async (req, res) =>{
    const {functLoadItens} = require("../../db/clinic/call-function-fixacao");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functLoadItens(req.body);
    res.json({
        data: (response?.rows || []).map(({data}) => {
            return data;
        })
    });
});

app.post("/api/clinica/fixacao/loads", async (req, res) =>{
    const {functLoadItens} = require("../../db/clinic/call-function-fixacao");
    let datas =  {};
    for (const load of req.body.lods) {
        load.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
        load.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
        load.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

        let response = await functLoadItens(load);
        datas[load.parmName] = (response?.rows || []).map(({data}) => {
            return data;
        });
    }

    res.json(datas);
});
