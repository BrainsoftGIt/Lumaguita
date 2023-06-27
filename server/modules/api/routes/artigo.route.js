"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cluster_service_1 = require("../../../service/cluster.service");
const project_1 = require("../../../global/project");
web_service_1.app.get("/api/categorias", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadCategories } = require("../db/call-function-article");
    const response = yield functLoadCategories({ arg_espaco_auth: req.session.auth_data.auth.armazem_atual });
    res.json({ categs: response.rows });
}));
web_service_1.app.get("/api/article/warehouses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArmazensColaboradorAlocar } = require("../db/call-function-colaborador");
    const response = yield functLoadArmazensColaboradorAlocar({ arg_espaco_auth: req.session.auth_data.auth.armazem_atual });
    res.json({ armazens: response.rows });
}));
web_service_1.app.get("/api/fornecedores", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadProviders } = require("../db/call-function-article");
    const response = yield functLoadProviders({ arg_espaco_auth: req.session.auth_data.auth.armazem_atual });
    res.json({ provds: response.rows });
}));
web_service_1.app.post("/api/provider", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetProvider } = require("../db/call-function-article");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functSetProvider(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "APROVIDER",
            extras: null,
            message: "Registo e atualização de fornecedor"
        });
    }
}));
web_service_1.app.post("/api/articles/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArticles } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    console.log(req.body);
    const response = yield functLoadArticles(req.body);
    res.json({ artcls: response.rows });
}));
web_service_1.app.post("/api/categoria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegCategory } = require("../db/call-function-article");
    let data = JSON.parse(req.body.data);
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.classe_foto = value.resource_url + ";" + req.file.originalname;
            const response = yield functRegCategory(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            res.json({ result: response.row.result, message: response.row.message.text });
            if (response.row.result) {
                if (before.cluster_version < after.cluster_version) {
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD_UPDATE:CATEGORY", extras: null, message: "Registao edicção de categoria" });
                }
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.log(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
        }));
    }
    else {
        const response = yield functRegCategory(data);
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        res.json({ result: response.row.result, message: response.row.message.text });
        if (response.row.result && before.cluster_version < after.cluster_version) {
            cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD_UPDATE:CATEGORY", extras: null, message: "Registo ou edição de categoria" });
        }
    }
}));
web_service_1.app.post("/api/artigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegArticle } = require("../db/call-function-article");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.artigo_foto = value.resource_url + ";" + req.file.originalname;
            const response = yield functRegArticle(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            res.json({ result: response.row.result, message: response.row.message.text });
            if (response.row.result) {
                if (before.cluster_version < after.cluster_version)
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD_UPDATE:ARTICLE", extras: null, message: "Registo ou alteração de artigo" });
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.log(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
        }));
    }
    else {
        const response = yield functRegArticle(data);
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        res.json({ result: response.row.result, message: response.row.message.text });
        if (response.row.result && before.cluster_version < after.cluster_version) {
            cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD_UPDATE:ARTICLE", extras: null, message: "Registo ou alteração de artigo" });
        }
    }
}));
web_service_1.app.post("/api/extraItems/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArticles } = require("../db/call-function-article");
    const response = yield functLoadArticles({ arg_artigo_estado: 1, arg_classe_id: "00000000-0000-0000-0000-000000000001", arg_espaco_auth: req.session.auth_data.auth.armazem_atual });
    res.json({ items: response.rows });
}));
web_service_1.app.post("/api/article/extra", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegItem } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functRegItem(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ADD_UPDATE:ITEM",
            extras: null,
            message: (req.body.artigo_id === null ? "Item " + req.body.artigo_nome + " foi registado." : "Item " + req.body.artigo_nome + " foi editado.")
        });
    }
}));
web_service_1.app.post("/api/category/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functDisableCategory } = require("../db/call-function-article");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functDisableCategory(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "REMOVE:CATEGORY",
            extras: null,
            message: "Categoria foi removida."
        });
    }
}));
web_service_1.app.post("/api/artigo/estado", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functDisableArticle } = require("../db/call-function-article");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functDisableArticle(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "CHANGE_STATUS:ARTICLE",
            extras: null,
            message: "Estado de artigo foi alterado."
        });
    }
}));
web_service_1.app.post("/api/provider/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const { functRemoveFornecedor } = require("../db/call-function-article");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functRemoveFornecedor(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "REMOVE:PROVIDER",
            extras: null,
            message: "Fornecedor foi removido."
        });
    }
}));
web_service_1.app.post("/api/artigos/entrada", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegEntrada } = require("../db/call-function-article");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegEntrada(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text, guia_uuid: response.row.message.guia.guia_uid });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ENTRANCE:ARTICLES",
            extras: null,
            message: "Foi registado entrada de artigos num armazém."
        });
    }
}));
web_service_1.app.post("/api/artigos/transferir", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegTransferencia } = require("../db/call-function-article");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegTransferencia(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message });
    if (response.row.result) {
        if (before.cluster_version < after.cluster_version) {
            req.session.transference_data = req.body;
            req.session.save();
            cluster_service_1.clusterServer.notifyLocalChange({
                event: "TRANSFER:ARTICLES",
                extras: null,
                message: "Foi registado transferencia de artigos."
            });
        }
    }
}));
web_service_1.app.post("/api/extra/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functDisableArticle } = require("../db/call-function-article");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functDisableArticle(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "REMOVE:ITEM",
            extras: null,
            message: "Item extra / acompanhamento foi removido."
        });
    }
}));
web_service_1.app.post("/api/artigo/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArticleData } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functLoadArticleData(req.body);
    res.json({ data: response.rows });
}));
web_service_1.app.post("/api/base/articles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { funct_load_base_article } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield funct_load_base_article(req.body);
    res.json({ articles: response.rows });
}));
web_service_1.app.post("/api/artigos/acertoStock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangeAmountInStock } = require("../db/call-function-article");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functChangeAmountInStock(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ACERT:STOCK",
            extras: null,
            message: "Foi realizado o acerto de stock de um artigo."
        });
    }
}));
web_service_1.app.post("/api/artigo/stocks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArticleStock } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functLoadArticleStock(req.body);
    res.json({ stocks: response.rows });
}));
web_service_1.app.get("/api/exportar/modelo/artigos/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const excel = require("exceljs");
    let file_name = "Luma - modelo de importação de artigos.xlsx";
    let data = JSON.parse(req.params.dados);
    let fileData = fs_1.default.readFileSync(path_1.default.join(project_1.folders.temp, data.file));
    let dados = JSON.parse(fileData.toString());
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet("Modelo de artigos");
    let workSheetSpaces = workBook.addWorksheet("Armazéns");
    workBook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ];
    workSheet.columns = [
        { header: "EAN", key: "ean", width: 30, alignment: "center" },
        { header: "Código", key: "codigo", width: 30, alignment: "center" },
        { header: "Nome", key: "nome", width: 70, alignment: "center" },
        { header: "Categoria", key: "cat", width: 45 },
        { header: "Imposto", key: "imp", width: 45 },
        { header: "Aplicação de imposto", key: "aplic_imp", width: 45 },
        { header: "Stock negativo (S/N)", key: "stock", width: 25 },
        { header: "Quantidade", key: "quant", width: 20 },
        ...(() => {
            return dados.spaces.map((sp) => {
                return { header: "Preço no(a) " + sp.espaco_nome, width: 45, key: sp.espaco_nome };
            });
        })()
    ];
    workSheetSpaces.columns = [
        ...(() => {
            return dados.spaces.map((sp) => {
                return { header: sp.espaco_id, width: 45, key: sp.espaco_nome, alignment: "center" };
            });
        })()
    ];
    workSheetSpaces.state = 'hidden';
    workSheet.getRow(1).font = { family: 2, size: 13, bold: true };
    workSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    let categorias = dados.categs.filter((_v, index) => index < 15).map((cat) => {
        return cat.classe_nome;
    }).join(",");
    let impostos = dados.taxs.map((imp) => {
        return imp.data.tipoimposto_nome;
    }).join(",");
    let aplicacaoImposto = dados.aplicImposto.map((ap) => {
        return ap.taplicar_descricao;
    }).join(",");
    for (let i = 2; i <= 900; i++) {
        workSheet.getCell(`D${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"' + categorias + '"'],
            tooltip: "Clique para selecionar a categoria"
        };
        workSheet.getCell(`E${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"' + impostos + '"'],
            tooltip: "Clique para selecionar o imposto"
        };
        workSheet.getCell(`F${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"' + aplicacaoImposto + '"'],
            tooltip: "Clique para selecionar a forma de aplicar o imposto"
        };
    }
    fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
    yield workBook.xlsx.writeFile(path_1.default.join(project_1.folders.temp, 'multer/' + file_name)).then(() => {
        res.download(path_1.default.join(project_1.folders.temp, 'multer') + "/" + file_name, file_name, function () {
            fs_1.default.unlinkSync(path_1.default.join(project_1.folders.temp, 'multer') + "/" + file_name);
        });
    });
}));
web_service_1.app.post("/api/search/provider", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSearchProvider } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functSearchProvider(req.body);
    res.json({ data: response.rows });
}));
web_service_1.app.post("/api/search/article/code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSearchArticleByCode } = require("../db/call-function-article");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functSearchArticleByCode(req.body);
    res.json({ data: response.rows });
}));
//# sourceMappingURL=artigo.route.js.map