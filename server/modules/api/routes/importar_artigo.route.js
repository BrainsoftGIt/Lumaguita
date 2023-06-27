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
const storage_service_1 = require("../../../service/storage.service");
const cluster_service_1 = require("../../../service/cluster.service");
const fs_1 = __importDefault(require("fs"));
function generateCode(length = 8) {
    let random_string = "";
    let random_ascii;
    for (let i = 0; i < length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii);
    }
    return new Date().getDate() + new Date().getHours() + new Date().getMinutes() + random_string;
}
function addCategory({ classe_nome, colaborador_id, armazem_atual, spaces }) {
    return __awaiter(this, void 0, void 0, function* () {
        let armazens_categoria = [];
        spaces.forEach((sp) => { armazens_categoria.push({ espaco_id: sp }); });
        const { functRegCategory } = require("../db/call-function-article");
        return functRegCategory({ classe_nome: classe_nome, classe_classe_id: null, classe_foto: null,
            arg_espacos: armazens_categoria, arg_espaco_auth: armazem_atual, arg_colaborador_id: colaborador_id });
    });
}
function clearText(text) {
    let replace = text.replace('  ', ' ').trim();
    if (replace !== text)
        return clearText(replace);
    else
        return replace;
}
function getSpacePrices(req, row, headers, spaces, errors, rowNumber) {
    let precosArmazens = [];
    let pricePosition = 9;
    let isValid = true;
    for (let i = 0; i < headers.length; i++) {
        if (row.values[pricePosition] !== undefined) {
            if (typeof row.values[pricePosition] !== "number") {
                errors.push("Valor inválido para " + headers[i] + " na linha " + rowNumber);
                isValid = false;
            }
            else {
                precosArmazens.push({ espaco_id: spaces[i], precario_custo: row.values[pricePosition], precario_quantidade: 1, stock_minimo: null });
            }
        }
        pricePosition = pricePosition + 1;
    }
    return [isValid, precosArmazens, errors];
}
storage_service_1.app.post("/api/importar_artigos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const excel = require("exceljs");
    let workbook = new excel.Workbook();
    let errors = [];
    let listCorrectData = [];
    let validRow = true;
    let categorias = JSON.parse(req.body.categorias);
    let impostos = JSON.parse(req.body.impostos);
    let aplicacao_imposto = JSON.parse(req.body.aplic_imposto);
    let listaImpostoSelecionado = [];
    let headers = [];
    let spaces;
    let worksheetSpace;
    let result;
    let stockNegativo;
    let categoriasInexistentes = [];
    if (req.file) {
        yield workbook.xlsx.readFile(req.file.path);
        worksheetSpace = workbook.getWorksheet("Armazéns");
        spaces = worksheetSpace.getRow(1).values;
        spaces.shift();
        workbook.getWorksheet("Modelo de artigos").eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber > 1) {
                listaImpostoSelecionado = [];
                if (row.values[3] === undefined || typeof row.values[3] !== "string") {
                    errors.push("Nome do artigo não foi encontrado na coluna C linha " + rowNumber + ".");
                    validRow = false;
                }
                if (row.values[5] !== undefined) {
                    if (impostos.find(imp => imp.data.tipoimposto_nome === row.values[5])) {
                        if (aplicacao_imposto.find(aplic => aplic.taplicar_descricao === (row.values[6] || "NA"))) {
                            listaImpostoSelecionado.push({
                                arg_tipoimposto_id: impostos.find(imp => imp.data.tipoimposto_nome === row.values[5]).data.tipoimposto_id,
                                arg_taplicar_id: aplicacao_imposto.find(aplic => aplic.taplicar_descricao === row.values[6]).taplicar_id,
                                arg_imposto_valor: null,
                                arg_imposto_percentagem: null
                            });
                        }
                        else {
                            errors.push("Selecione a forma de aplicar o imposto na coluna F linha " + rowNumber + ".");
                            validRow = false;
                        }
                    }
                    else {
                        errors.push("O imposto deve ser selecionado e não digitado na coluna E linha " + rowNumber + ".");
                        validRow = false;
                    }
                }
                if (row.values[8] !== undefined) {
                    if (typeof row.values[8] !== "number") {
                        errors.push("Valor de quantidade de artigo no stock incorreto na coluna H linha " + rowNumber + ".");
                        validRow = false;
                    }
                }
                if (row.values[7] === undefined || typeof row.values[7] !== "string")
                    stockNegativo = false;
                else
                    stockNegativo = row.values[7].toLowerCase().includes("sim") || row.values[7].toLowerCase().includes("s");
                result = getSpacePrices(req, row, headers, spaces, errors, rowNumber);
                if (validRow) {
                    listCorrectData.push({ artigo_artigo_id: null, artigo_compostoquantidade: null, artigo_classe_id: null,
                        classe_nome: (row.values[4] || "Sem categoria"), artigo_id: null, artigo_codigo: (row.values[2] || generateCode()),
                        artigo_nome: clearText(row.values[3]), artigo_preparacao: false,
                        artigo_stocknegativo: stockNegativo, artigo_foto: null, artigo_descricao: null, arg_items: [], arg_imposto: listaImpostoSelecionado,
                        arg_links: result[1], arg_ean_codes: (row.values[1] === undefined ? [] : [{ ean_code: row.values[1], ean_dateout: null, ean_datein: null }]),
                        arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
                        acerto_quantidade: (row.values[8] || 0)
                    });
                    if (categorias.findIndex(cat => cat.classe_nome === clearText((row.values[4] || "Sem categoria"))) === -1) {
                        categoriasInexistentes.push({ classe_nome: (row.values[4] || "Sem categoria"), classe_id: null });
                    }
                }
            }
            else {
                headers = row.values.filter(function (value, index, arr) {
                    return index > 8;
                });
            }
        });
        fs_1.default.unlinkSync(req.file.path);
        if (errors.length === 0) {
            const { functRegArticle, functChangeAmountInStock } = require("../db/call-function-article");
            let response;
            for (let i = 0; i < categoriasInexistentes.length; i++) {
                yield cluster_service_1.clusterServer.service.loadLocalCluster();
                response = yield addCategory({ classe_nome: categoriasInexistentes[i].classe_nome,
                    colaborador_id: req.session.auth_data.auth.colaborador_id,
                    spaces: spaces, armazem_atual: req.session.auth_data.auth.armazem_atual
                });
                yield cluster_service_1.clusterServer.service.loadLocalCluster();
                if (response.row.result) {
                    categoriasInexistentes[i].classe_id = response.row.message.classe.classe_id;
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD:CATEGORY", extras: null, message: "Registo de categoria" });
                }
            }
            for (let i = 0; i < listCorrectData.length; i++) {
                yield cluster_service_1.clusterServer.service.loadLocalCluster();
                if (categorias.findIndex(cat => cat.classe_nome === listCorrectData[i].classe_nome) === -1)
                    listCorrectData[i].artigo_classe_id = categoriasInexistentes.find(cat => cat.classe_nome === listCorrectData[i].classe_nome).classe_id;
                else
                    listCorrectData[i].artigo_classe_id = categorias.find(cat => cat.classe_nome === listCorrectData[i].classe_nome).classe_id;
                functRegArticle(listCorrectData[i]).then((value) => __awaiter(void 0, void 0, void 0, function* () {
                    yield cluster_service_1.clusterServer.service.loadLocalCluster();
                    if (!value.row.result)
                        errors.push(value.row.message.text + " :" + listCorrectData[i].artigo_nome);
                    else {
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "ADD:ARTICLE", extras: null, message: "Registo de artigo" });
                        if (Number(listCorrectData[i].acerto_quantidade) !== 0) {
                            yield cluster_service_1.clusterServer.service.loadLocalCluster();
                            yield functChangeAmountInStock({ arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
                                arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
                                acerto_observacao: null, arg_espaco_id: req.session.auth_data.auth.armazem_atual,
                                arg_acerto: [{ artigo_id: value.row.message.artigo.artigo_id, acerto_quantidade: listCorrectData[i].acerto_quantidade }]
                            });
                            yield cluster_service_1.clusterServer.service.loadLocalCluster();
                            cluster_service_1.clusterServer.notifyLocalChange({ event: "ACERTO", extras: null, message: "Acerto de stock" });
                        }
                    }
                })).catch(error => {
                    errors.push(error);
                });
            }
            res.json({ result: (errors.length === 0), erros: errors });
        }
        else
            res.json({ result: false, erros: errors });
    }
    else
        res.json({ result: false, message: "Ocorreu um erro a carregar ficheiro." });
}));
//# sourceMappingURL=importar_artigo.route.js.map