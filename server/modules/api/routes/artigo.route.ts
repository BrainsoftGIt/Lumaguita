import {app} from '../../../service/web.service';
import fs from "fs";
import path from "path";
import {clusterServer} from "../../../service/cluster.service";
import {folders} from "../../../global/project";
import {functLoadArticlesExport} from "../db/call-function-article";

app.get("/api/categorias", async (req, res) => {
    const {functLoadCategories} = require("../db/call-function-article");
    const response = await functLoadCategories({arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null});
    res.json({categs: response.rows});
});
app.get("/api/article/warehouses", async (req, res) => {
    const {functLoadArmazensColaboradorAlocar} = require("../db/call-function-colaborador");
    const response = await functLoadArmazensColaboradorAlocar({arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null});
    res.json({armazens: response.rows});
});
app.get("/api/fornecedores", async (req, res) => {
    const {functLoadProviders} = require("../db/call-function-article");
    const response = await functLoadProviders({arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null});
    res.json({provds: response.rows});
});
app.post("/api/provider", async (req, res) => {
    const {functSetProvider} = require("../db/call-function-article");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let before = await clusterServer.service.loadLocalCluster();
    const response = await functSetProvider(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "APROVIDER",
            extras: null,
            message: "Registo e atualização de fornecedor"
        });
    }
});
app.post("/api/articles/load", async (req, res) => {
    const {functLoadArticles} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functLoadArticles(req.body);
    res.json({artcls: response.rows});
});
app.post("/api/categoria", async (req, res) => {
    const {functRegCategory} = require("../db/call-function-article");
    let data = JSON.parse(req.body.data);
    let before = await clusterServer.service.loadLocalCluster();

    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    if (req.file) {
        clusterServer.res.create({
            resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null}
        }).then(async value => {
            data.classe_foto = value.resource_url + ";" + req.file.originalname;
            const response = await functRegCategory(data);
            let after = await clusterServer.service.loadLocalCluster();
            res.json({result: response.row.result, message: response.row.message.text});

            if (response.row.result) {
                if (before.cluster_version < after.cluster_version) {
                    clusterServer.notifyLocalChange({
                        event: "ADD_UPDATE:CATEGORY",
                        extras: null,
                        message: "Registao edicção de categoria"
                    });
                }
                fs.rename(req.file.path, value.resolve, function (err) {
                    if (err) console.log(err);
                    else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                });
            }
        });
    } else {
        const response = await functRegCategory(data);
        let after = await clusterServer.service.loadLocalCluster();
        res.json({result: response.row.result, message: response.row.message.text});
        if (response.row.result && before.cluster_version < after.cluster_version) {
            clusterServer.notifyLocalChange({
                event: "ADD_UPDATE:CATEGORY",
                extras: null,
                message: "Registo ou edição de categoria"
            });
        }
    }
});
app.post("/api/artigo", async (req, res) => {
    const {functRegArticle} = require("../db/call-function-article");
    let before = await clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);

    data.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    data.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    if (req.file) {
        clusterServer.res.create({
            resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: {_branch_uid: req?.session?.auth_data?.auth?.branch_uuid || null}
        }).then(async value => {
            data.artigo_foto = value.resource_url + ";" + req.file.originalname;
            const response = await functRegArticle(data);
            let after = await clusterServer.service.loadLocalCluster();

            res.json({result: response.row.result, message: response.row.message.text});
            if (response.row.result) {
                if (before.cluster_version < after.cluster_version)
                    clusterServer.notifyLocalChange({
                        event: "ADD_UPDATE:ARTICLE",
                        extras: null,
                        message: "Registo ou alteração de artigo"
                    });

                fs.rename(req.file.path, value.resolve, function (err) {
                    if (err) console.log(err);
                    else clusterServer.notifyLocalChange({event: "NEW RESOURCE FILES"});
                });
            }
        });
    } else {
        const response = await functRegArticle(data);
        let after = await clusterServer.service.loadLocalCluster();
        res.json({result: response.row.result, message: response.row.message.text});
        if (response.row.result && before.cluster_version < after.cluster_version) {
            clusterServer.notifyLocalChange({
                event: "ADD_UPDATE:ARTICLE",
                extras: null,
                message: "Registo ou alteração de artigo"
            });
        }
    }
});
app.post("/api/extraItems/load", async (req, res) => {
    const {functLoadArticles} = require("../db/call-function-article");
    const response = await functLoadArticles({
        arg_artigo_estado: 1,
        arg_classe_id: "00000000-0000-0000-0000-000000000001",
        arg_espaco_auth: req?.session?.auth_data?.auth?.armazem_atual || null
    });
    res.json({items: response.rows});
});
app.post("/api/article/extra", async (req, res) => {
    const {functRegItem} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    let before = await clusterServer.service.loadLocalCluster();
    const response = await functRegItem(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "ADD_UPDATE:ITEM",
            extras: null,
            message: (req.body.artigo_id === null ? "Item " + req.body.artigo_nome + " foi registado." : "Item " + req.body.artigo_nome + " foi editado.")
        });
    }
});
app.post("/api/category/remove", async (req, res) => {
    const {functDisableCategory} = require("../db/call-function-article");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let before = await clusterServer.service.loadLocalCluster();
    const response = await functDisableCategory(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "REMOVE:CATEGORY",
            extras: null,
            message: "Categoria foi removida."
        });
    }
});
app.post("/api/artigo/estado", async (req, res) => {
    const {functDisableArticle} = require("../db/call-function-article");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let before = await clusterServer.service.loadLocalCluster();
    const response = await functDisableArticle(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "CHANGE_STATUS:ARTICLE",
            extras: null,
            message: "Estado de artigo foi alterado."
        });
    }
});
app.post("/api/provider/remove", async (req, res) => {
    let before = await clusterServer.service.loadLocalCluster();
    const {functRemoveFornecedor} = require("../db/call-function-article");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functRemoveFornecedor(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "REMOVE:PROVIDER",
            extras: null,
            message: "Fornecedor foi removido."
        });
    }
});
app.post("/api/artigos/entrada", async (req, res) => {
    const {functRegEntrada} = require("../db/call-function-article");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functRegEntrada(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({
        result: response.row.result,
        message: response.row.message.text,
        guia_uuid: response.row.message.guia.guia_uid
    });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "ENTRANCE:ARTICLES",
            extras: null,
            message: "Foi registado entrada de artigos num armazém."
        });
    }
});
app.post("/api/artigos/transferir", async (req, res) => {
    const {functRegTransferencia} = require("../db/call-function-article");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functRegTransferencia(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message});

    if (response.row.result) {
        if (before.cluster_version < after.cluster_version) {
            req.session.transference_data = req.body;
            req.session.save();
            clusterServer.notifyLocalChange({
                event: "TRANSFER:ARTICLES",
                extras: null,
                message: "Foi registado transferencia de artigos."
            });
        }
    }
});
app.post("/api/extra/remove", async (req, res) => {
    const {functDisableArticle} = require("../db/call-function-article");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    let before = await clusterServer.service.loadLocalCluster();
    const response = await functDisableArticle(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "REMOVE:ITEM",
            extras: null,
            message: "Item extra / acompanhamento foi removido."
        });
    }
});
app.post("/api/artigo/data", async (req, res) => {
    const {functLoadArticleData} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadArticleData(req.body);
    res.json({data: response.rows});
});
app.post("/api/base/articles", async (req, res) => {
    const {funct_load_base_article} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await funct_load_base_article(req.body);
    res.json({articles: response.rows});
});
app.post("/api/artigos/acertoStock", async (req, res) => {
    const {functChangeAmountInStock} = require("../db/call-function-article");
    let before = await clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functChangeAmountInStock(req.body);
    let after = await clusterServer.service.loadLocalCluster();
    res.json({result: response.row.result, message: response.row.message.text});
    if (response.row.result && before.cluster_version < after.cluster_version) {
        clusterServer.notifyLocalChange({
            event: "ACERT:STOCK",
            extras: null,
            message: "Foi realizado o acerto de stock de um artigo."
        });
    }
});
app.post("/api/artigo/stocks", async (req, res) => {
    const {functLoadArticleStock} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadArticleStock(req.body);
    res.json({stocks: response.rows});
});
app.get("/api/exportar/modelo/artigos/:dados", async (req, res) => {
    let {workBook} = GetModel(req);
    let file_name = "Luma - modelo de importação de artigos.xlsx";
    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    await workBook.xlsx.writeFile(path.join(folders.temp, 'multer/' + file_name)).then(() => {
        res.download(path.join(folders.temp, 'multer') + "/" + file_name, file_name, function () {
            fs.unlinkSync(path.join(folders.temp, 'multer') + "/" + file_name);
        });
    });
});

app.post("/api/importacao/artigo/data", async (req, res) => {
    let random = (Math.random() + 1).toString(36).substring(7);
    let data = new Date();
    let file = `${random}-${data.getSeconds()}.json`
    fs.writeFile(path.join(folders.temp, file), JSON.stringify(req.body), function (err) {
        if (err) return console.log(err);
        res.json(file)
    });
});

app.post("/api/search/provider", async (req, res) => {
    const {functSearchProvider} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functSearchProvider(req.body);
    res.json({data: response.rows});
});
app.post("/api/search/article/code", async (req, res) => {
    const {functSearchArticleByCode} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functSearchArticleByCode(req.body);
    res.json({data: response.rows});
});

app.post("/api/load/futura/article", async (req, res) => {
    const {functLoadSerieDistribuicao} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadSerieDistribuicao(req.body);
    res.json(response);
});
app.post("/api/load/futuras/setting", async (req, res) => {
    const {functLoadSeriesDistribuicao} = require("../db/call-function-article");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    const response = await functLoadSeriesDistribuicao(req.body);
    res.json(response);
});

let GetModel = (req) => {
    let data = JSON.parse(req.params.dados);
    let fileData = fs.readFileSync(path.join(folders.temp, data.file));

    let dados = JSON.parse(fileData.toString());

    const excel = require("exceljs");
    let workBook = new excel.Workbook();
    let workSheet = workBook.addWorksheet("Modelo de artigos");
    let workSheetSpaces = workBook.addWorksheet("Armazens");

    workBook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ];

    workSheet.columns = [
        {header: "EAN", key: "ean", width: 30, alignment: "center"},
        {header: "Código", key: "codigo", width: 30, alignment: "center"},
        {header: "Unidade", key: "unit", width: 30, alignment: "center"},
        {header: "Nome", key: "nome", width: 70, alignment: "center"},
        {header: "Categoria", key: "cat", width: 45},
        {header: "Imposto", key: "imp", width: 45},
        {header: "Aplicação de imposto", key: "aplic_imp", width: 45},
        {header: "Código Imposto Faturação", key: "impcodefaturacao", width: 45},
        {header: "Código Imposto Nota de Credito", key: "impcodenotacredito", width: 45},
        {header: "Código Imposto Nota de Debito", key: "impcodenotadebito", width: 45},
        {header: "Stock negativo (S/N)", key: "stock", width: 25},
        {header: "Quantidade", key: "quant", width: 20},
        ...(() => {
            return dados.spaces.map((sp) => {
                return {header: "Preço no(a) " + sp.espaco_nome, width: 45, key: sp.espaco_nome};
            });
        })()
    ];

    workSheetSpaces.getColumn('A').values = dados.spaces.map((sp) => {
        return sp.espaco_id;
    });

    workSheetSpaces.state = 'hidden';
    workSheet.getRow(1).font = {family: 2, size: 13, bold: true};
    workSheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'};

    workSheetSpaces.getColumn('B').values = dados.categs.map((cat) => {
        return cat.classe_nome;
    });

    workSheetSpaces.getColumn('C').values = dados.taxs.map((imp) => {
        return imp.data.tipoimposto_nome;
    });

    workSheetSpaces.getColumn('D').values = dados.aplicImposto.map((ap) => {
        return ap.taplicar_descricao;
    });

    workSheetSpaces.getColumn('E').values = dados.units.map(({main: {unit_code}}) => {
        return unit_code;
    });

    workSheetSpaces.getColumn('F').values = dados.taxCodes.map((ap) => {
        return ap.codigoimposto_codigo;
    });

    for (let i = 2; i <= 900; i++) {
        workSheet.getCell(`E${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$B$1:$B$${(dados.categs.length || 1)}`],
            tooltip: "Clique para selecionar a categoria"
        };

        workSheet.getCell(`F${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$C$1:$C$${(dados.taxs.length || 1)}`],
            tooltip: "Clique para selecionar o imposto"
        };

        workSheet.getCell(`G${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$D$1:$D$${(dados.aplicImposto.length || 1)}`],
            tooltip: "Clique para selecionar a forma de aplicar o imposto"
        };

        workSheet.getCell(`C${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$E$1:$E$${(dados.units.length || 1)}`],
            tooltip: "Clique para selecionar a unidade"
        };

        workSheet.getCell(`H${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$F$1:$F$${(dados.taxCodes.length || 1)}`],
            tooltip: "Clique para selecionar o código imposto"
        };

        workSheet.getCell(`I${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$F$1:$F$${(dados.taxCodes.length || 1)}`],
            tooltip: "Clique para selecionar o código imposto"
        };

        workSheet.getCell(`J${i}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`Armazens!$F$1:$F$${(dados.taxCodes.length || 1)}`],
            tooltip: "Clique para selecionar o código imposto"
        };
    }

    return {
        workBook,
        workSheet,
        spaces: dados.spaces,
        categs: dados.categs
    };
}

app.get("/api/exportar/artigos/:dados", async (req, res) => {
    let {workBook, workSheet, spaces, categs} = GetModel(req);

    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_uid = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body._espaco_id = spaces.map(({espaco_id}) => espaco_id) || null;

    const response = await functLoadArticlesExport(req.body);
    response.rows.forEach(({funct_load_artigo_exports: { eans, links, armazems, impostos, artigo_classe_id, artigo_nome, artigo_codigo, unit_code, stock_quantidade, artigo_stocknegativo, artigo_codigoimposto, ...all}}, index) => {

        let {ean_code} = eans?.[0] || {};

        let { FATURACAO, NOTACREDITO, NOTADEBITO } = artigo_codigoimposto || {}
        let { tipoimposto_nome,  taplicar_descricao} = impostos?.[0] || {}
        let newIndex = index+2;

        let {classe_nome: categoria} = categs.find(({classe_id}) => artigo_classe_id === classe_id);
        workSheet.getCell(`A${newIndex}`).value = ean_code || "";
        workSheet.getCell(`B${newIndex}`).value = artigo_codigo;
        workSheet.getCell(`C${newIndex}`).value = unit_code;
        workSheet.getCell(`D${newIndex}`).value = artigo_nome;
        workSheet.getCell(`E${newIndex}`).value = categoria;
        workSheet.getCell(`F${newIndex}`).value = tipoimposto_nome || "";
        workSheet.getCell(`G${newIndex}`).value = taplicar_descricao || "";
        workSheet.getCell(`H${newIndex}`).value = FATURACAO || "";
        workSheet.getCell(`I${newIndex}`).value = NOTACREDITO || "";
        workSheet.getCell(`J${newIndex}`).value = NOTADEBITO || "";
        workSheet.getCell(`K${newIndex}`).value = artigo_stocknegativo ? "S" : "N";
        workSheet.getCell(`L${newIndex}`).value = (stock_quantidade > 0) ? stock_quantidade : "";

        armazems.forEach((armazem) => {
            console.log({armazem});
        })

        let letra = "L";
        spaces.map(({espaco_id}) => {
            let { link_metadata } = armazems.find(({link_espaco_destino}) =>  link_espaco_destino === espaco_id) || {};
            let { precario_custo } = link_metadata || {};
            var codigoAscii = letra.charCodeAt(0);
            codigoAscii++;
            var proximaLetra = String.fromCharCode(codigoAscii);
            workSheet.getCell(`${proximaLetra}${newIndex}`).value = precario_custo || "";
            letra = proximaLetra;
        })
    });

    let file_name = "Luma - exportação de artigos.xlsx";
    fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
    await workBook.xlsx.writeFile(path.join(folders.temp, 'multer/' + file_name)).then(() => {
        res.download(path.join(folders.temp, 'multer') + "/" + file_name, file_name, function () {
            fs.unlinkSync(path.join(folders.temp, 'multer') + "/" + file_name);
        });
    });
});

