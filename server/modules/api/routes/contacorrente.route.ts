import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import {
    functLoadCambio,
    // functLoadTipoLancamento,
    functRegistarDeposito,
    functRegistarLancamento
} from "../db/call-function-contacorrrente";

app.post("/api/cliente/admin", async (req, res) =>{
    const {functRegCliente} = require("../db/call-function-pos");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = await functRegCliente(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: response.row.main.message, ...response.row.main});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "CREATE:CLIENT",
            extras: null,
            message: "Novo cliente registado."
        });
    }
});
app.post("/api/clientes/admin", async (req, res) =>{
    const {functLoadClients} = require("../db/call-function-contacorrrente");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = await functLoadClients(req.body);
    res.json({customers: response.rows});
});
app.get("/api/cambios", async (req, res) =>{
    const {functLoadCambio} = require("../db/call-function-contacorrrente");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functLoadCambio(req.body);
    res.json({cambio_ativos: response.rows});
});
app.post("/api/launchs/load", async (req, res) =>{
    const {functLoadLaunchs} = require("../db/call-function-contacorrrente");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functLoadLaunchs(req.body);
    res.json({launchs: response.rows});
});

app.post("/api/deposito", async (req, res) =>{
    const {functRegistarDeposito} = require("../db/call-function-contacorrrente");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functRegistarDeposito(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: (response.row.main.result ? response.row : response.row.main.message)});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "PAYMENT:DEBIT",
            extras: null,
            message: "Pagamento de fatura na conta corrente."
        });
    }
});
app.post("/api/lancamento", async (req, res) =>{
    const {functRegistarLancamento} = require("../db/call-function-contacorrrente");
    let before =  await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = await functRegistarLancamento(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.main.result, data: (response.row.main.result ? response.row : response.row.main.message)});
    if(response.row.main.result && before.cluster_version < after.cluster_version){
        clusterServer.notifyLocalChange({
            event: "LAUNCH",
            extras: null,
            message: "Launch done."
        });
    }
});



//registo de colaborador branch= colaborador_colaborador_id, nome, email, acessos

//registo de espaco branch = vender obrigatorio em baixo de pano, colaborador_id, espaco default, nome, codigo
