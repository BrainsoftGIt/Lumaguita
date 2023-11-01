import {app} from '../../../../service/web.service';

app.post("/api/clinica/paciente/set", async (req, res) =>{
    const {functSetPatient} = require("../../db/clinic/call-function-patient");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functSetPatient(req.body);
    res.json({response});
});
app.post("/api/clinica/paciente/load", async (req, res) =>{
    const {functLoadPatient} = require("../../db/clinic/call-function-patient");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;
    req.body.branch = req?.session?.auth_data?.auth?.branch_uuid || null;

    let response = await functLoadPatient(req.body);
    res.json({
        data: response.rows.map(({data}) => {
            return data
        })
    });
});
