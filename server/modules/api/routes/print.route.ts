import {app} from '../../../service/web.service';
import {functLoadContaData} from "../db/call-function-pos";
import {functReportVendaPOS} from "../db/call-function-report";

export async function load_space_configuration(req, admin) {
    const {functLoadDadosEmpresa} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = admin ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
    return  (await functLoadDadosEmpresa(req.body)).rows;
}

function get_printer_name(printers, operation_code){
    let printer_operation = printers.find(pri => pri.operacao.codigo === operation_code);
    return printer_operation ? (printer_operation.impressoras.nome || printer_operation.impressoras.ip) : null;
}
app.post("/api/space/config/load", async (req, res) =>{
    res.json({config: await load_space_configuration(req, req.body.admin)});
});

app.get("/api/print/proforma/:dados", async (req, res) =>{
    const {functLoadProformas} = require("../db/call-function-conta");
    const file = require("./functions/export-proforma");
    req.body.arg_posto_id = req.session.posto_admin;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;

    let dados = JSON.parse(req.params.dados);
    let proformas = await functLoadProformas(req.body);
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    const dadosConta = await functLoadContaData({arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id});
    let proformaCliente = proformas.rows.filter(prof => prof.data.conta_id === dados.conta_id);
    let instituition = await load_space_configuration(req, true);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    if(proformaCliente.length > 0){
        proformaCliente[0].data.cliente_email = dadosConta.rows[0].main.cliente_mail;
        proformaCliente[0].data.cliente_contacto = dadosConta.rows[0].main.cliente_contactos[0];
        await file.create(instituition, proformaCliente[0].data, dadosConta.rows[0], res, user, dados.date, null);
    }
});

app.get("/api/print/fatura/recibo/:dados", async (req, res) =>{
    let dados = JSON.parse(req.params.dados);
    const dadosConta = await functLoadContaData({arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
    const file = require("./functions/export-faturarecibo");
    let instituition = await load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    await file.create(instituition, dadosConta.rows, res, user, dados.date, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
});
app.post("/api/print/fatura/recibo/talao", async (req, res) =>{
    const dadosConta = await functLoadContaData({arg_conta_id: req.body.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
    const fatura_recibo_talao = require("./functions/export-faturarecibo-talao");
    const fatura_recibo_talaoA5 = require("./functions/export-faturarecibo-talao-a5");
    const fatura_recibo_talaoA6 = require("./functions/export-faturarecibo-talao-a6");
    let instituition = await load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura_recibo");

    if(instituition.espaco_configuracao.printTalaoA5) {
        await fatura_recibo_talaoA5.create(instituition, dadosConta.rows, res, user, req.body.date, printer_name,  dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
        return
    }

    if(instituition.espaco_configuracao.printTalaoA6) {
        await fatura_recibo_talaoA6.create(instituition, dadosConta.rows, res, user, req.body.date, printer_name,  dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
        return
    }
    await fatura_recibo_talao.create(instituition, dadosConta.rows, res, user, req.body.date, printer_name,  dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
});
app.get("/api/print/transference/:dados", async (req, res) =>{
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-trasferencia");
    let instituition = await load_space_configuration(req, true);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());

    await file.create(instituition, req.session.transference_data.arg_transferencias, {
        armazem_origem: req.session.transference_data.arg_espaco_origem_nome,
        armazem_destino: req.session.transference_data.arg_espaco_destino_nome,
        armazem_origem_codigo: req.session.transference_data.arg_espaco_origem_codigo,
        armazem_destino_codigo: req.session.transference_data.arg_espaco_destino_codigo
    }, res, user, dados.date,);
});
app.get("/api/print/guia_entrada/:dados", async (req, res) =>{
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-guia");
    const {funct_load_guia_data} = require("../db/call-function-article");
    let instituition = await load_space_configuration(req, true);
    const response = await funct_load_guia_data({arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_espaco_id: req.session.auth_data.auth.armazem_atual, guia_uid: dados.guia_uuid });
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const custoguia =  response.rows.filter(ent => ent.data.data?.custoguia_uid !== undefined);
    const fornecedor =  response.rows.filter(ent => ent.data.data?.fornecedor_id !== undefined);
    const artigos = response.rows.filter(ent => ent.data.data?.entrada_id !== undefined)
    const guia = response.rows[0].data.data
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    await file.create(instituition, fornecedor[0].data.data, guia, artigos, res, user, custoguia);
});
app.get("/api/print/guia_saida/:dados", async (req, res) =>{
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-guia-saida");
    const {funct_load_guia_data} = require("../db/call-function-article");
    let instituition = await load_space_configuration(req, true);
    const response = await funct_load_guia_data({arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_espaco_auth: req.session.auth_data.auth.armazem_atual, guia_uid: dados.guia_uuid, arg_conta_id: dados.conta_id });
    const dadosConta = await functLoadContaData({arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id});

    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const guia = response.rows[0].data.data
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    await file.create(instituition, dadosConta.rows[0], res, user,  dadosConta.rows[0].main.conta_serie.serie_numatorizacao, guia);
});
app.get("/api/print/fatura/:dados", async (req, res) =>{
    let {...conta} = JSON.parse(req.params.dados);
    const file = require("./functions/export-fatura");
    const fatura_talao = require("./functions/export-fatura-talao");
    const fatura_talaoA5 = require("./functions/export-fatura-talao-a5");
    const fatura_talaoA6 = require("./functions/export-fatura-talao-a6");
    let instituition = await load_space_configuration(req, conta.admin);
    let dadosConta;
    let user;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    if(conta.admin){
        dadosConta = await functLoadContaData({arg_conta_id: conta.conta_id,
            with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id});
        user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    }
    else{
        dadosConta = await functLoadContaData({arg_conta_id: conta.conta_id,
            with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual, arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
        user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    }
    if(conta.type === "pdf")
        await file.create(instituition, dadosConta.rows[0], res, user, conta.date, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
    else {
        const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura");

        if(instituition.espaco_configuracao.printTalaoA5) {
            await fatura_talaoA5.create(instituition, dadosConta.rows[0], res, user, conta.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
            return
        }

        if(instituition.espaco_configuracao.printTalaoA6) {
            await fatura_talaoA6.create(instituition, dadosConta.rows[0], res, user, conta.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
            return
        }

        await fatura_talao.create(instituition, dadosConta.rows[0], res, user, conta.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
    }
});
app.get("/api/print/nota-credito/:dados", async (req, res) =>{
    let conta = JSON.parse(req.params.dados);
    const file = require("./functions/export-nota-credito");
    let instituition = await load_space_configuration(req, conta.admin);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;

    let dadosConta = await functLoadContaData({arg_conta_id: conta.conta_id, with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id});
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());

    await file.create(instituition, dadosConta.rows[0], res, user, conta.date, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
});
app.post("/api/print/fatura/talao", async (req, res) =>{
    const fatura_talao = require("./functions/export-fatura-talao");
    const fatura_talaoA5 = require("./functions/export-fatura-talao-a5");
    let instituition = await load_space_configuration(req, false);
    let dadosConta;
    let user;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    dadosConta = await functLoadContaData({arg_conta_id: req.body.conta_id,
        with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual, arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
    user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura");

    if(instituition.espaco_configuracao.printTalaoA5) {
        await fatura_talaoA5.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
        return
    }
    await fatura_talao.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
});
app.get("/api/print/recibo/:dados", async (req, res) =>{
    const file = require("./functions/export-recibo");
    const {functLoadDepositoData} = require("../db/call-function-contacorrrente");
    const {functLoadSeries} = require("../db/call-function-efatura");
    let dados = JSON.parse(req.params.dados);
    let response = await functLoadDepositoData({deposito_id: dados.deposito});
    let instituition = await load_space_configuration(req, dados.admin);
    let serie = await functLoadSeries({arg_espaco_auth: req.session.auth_data.auth.armazem_atual});
    const tipo_fatura_recibo = 3;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.auth_data.auth.colaborador_nome+" "+(req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    serie = serie.rows.find(value => value.data.serie_tserie_id ===  tipo_fatura_recibo);
    await file.create(instituition, response.rows, dados.client, res, user, dados.date,  (serie?.data?.serie_numatorizacao || null), (serie?.data?.serie_numero || null));
});
app.get("/api/print/conta/:dados", async (req, res) =>{
    let dados = JSON.parse(req.params.dados);
    const conta_pdf = require("./functions/export-conta");
    req.body.arg_posto_id = req.session.posto.posto_id;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const dadosConta = await functLoadContaData({arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    let instituition = await load_space_configuration(req, dados.admin);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    await conta_pdf.create(instituition, dadosConta.rows[0], res, user, dados.date, null);
});
app.post("/api/print/conta/talao", async (req, res) =>{
    const file = require("./functions/export-conta-talao");
    const fileA5 = require("./functions/export-conta-talao-a5");
    const fileA6 = require("./functions/export-conta-talao-a6");
    req.body.arg_posto_id = req.session.posto.posto_id;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const dadosConta = await functLoadContaData({arg_conta_id: req.body.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id});
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    let instituition = await load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "conta");
    if(instituition.espaco_configuracao.printTalaoA5) {
        await fileA5.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name);
        return
    }

    if(instituition.espaco_configuracao.printTalaoA6) {
        await fileA6.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name);
        return
    }

    await file.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name);
});

app.post("/api/print/fecho/caixa/", async (req, res) =>{
    const file = require("./functions/export-fechocaixa-talao");
    const fileA5 = require("./functions/export-fechocaixa-talao-a5");
    const fileA6 = require("./functions/export-fechocaixa-talao-a6");
    let instituition = await load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "caixa");
    if(instituition.espaco_configuracao.printTalaoA5) {
        await fileA5.create(instituition, req.body, res, user, printer_name);
        return
    }

    if(instituition.espaco_configuracao.printTalaoA6) {
        await fileA6.create(instituition, req.body, res, user, printer_name);
        return
    }

    await file.create(instituition, req.body, res, user, printer_name);
});

app.post("/api/print/report/venda", async (req, res) =>{
    const file = require("./functions/export-report-vendas-talao");
    const fileA5 = require("./functions/export-report-vendas-talao-a5");
    const fileA6 = require("./functions/export-report-vendas-talao-a6");

    let instituition = await load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "report_venda");

    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_posto_id = req.session.posto.posto_id;
    let { rows} = await functReportVendaPOS(req.body);
    let { arg_date_end, arg_date_start } = req.body;

    if(instituition.espaco_configuracao.printTalaoA5) {
        await fileA5.create(instituition, rows, res, user, printer_name, arg_date_start, arg_date_end);
        return
    }

    if(instituition.espaco_configuracao.printTalaoA6) {
        await fileA6.create(instituition, rows, res, user, printer_name, arg_date_start, arg_date_end);
        return
    }

    await file.create(instituition, rows, res, user, printer_name, arg_date_start, arg_date_end);
});

app.post("/api/print/kitchen", async (req, res) =>{
    const {printNetwork} = require("./functions/kitchenArticlesNetwork");
    const {create} = require("./functions/kitchenArticlesTalao");
    const {create: createA5} = require("./functions/kitchenArticlesTalao-a5");
    const {create: createA6} = require("./functions/kitchenArticlesTalao-a6");

    setTimeout(() => {
        res.json("done");
    }, 30 * 1000 )

    try {
        let instituition = await load_space_configuration(req, false);
        instituition = instituition[0].funct_load_espaco_configuracao.espaco;

        let user = req.session.user_pos.auth.colaborador_nome+" "+(req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());


        if(!instituition?.espaco_configuracao?.impressoras_cozinha?.ip){
            if(instituition.espaco_configuracao.printTalaoA5) {
                await createA5(instituition, req.body.articles, res, req.body.date, req.body.table, req.body.obs, user);
                return
            }

            if(instituition.espaco_configuracao.printTalaoA6) {
                await createA6(instituition, req.body.articles, res, req.body.date, req.body.table, req.body.obs, user);
                return
            }
            await create(instituition, req.body.articles, res, req.body.date, req.body.table, req.body.obs);
        }
        else if(instituition?.espaco_configuracao?.impressoras_cozinha?.ip){
            await printNetwork({articles: req.body.articles, table: req.body.table,
                idPrinter: instituition.espaco_configuracao.impressoras_cozinha.ip});
        }
    }catch (e) {
        res.json("done");
    }
});

