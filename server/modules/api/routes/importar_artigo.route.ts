import {app, storage} from '../../../service/storage.service';
import {clusterServer} from "../../../service/cluster.service";
import fs from "fs";

function generateCode(length = 8){
    let random_string = "";
    let random_ascii;
    for(let i = 0; i < length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return new Date().getDate()+new Date().getHours()+new Date().getMinutes()+random_string;
}

async function addCategory({classe_nome, colaborador_id, armazem_atual, spaces}){
    let armazens_categoria = [];
    spaces.forEach((sp)=>{armazens_categoria.push({espaco_id: sp});});
    const {functRegCategory} = require("../db/call-function-article");
    return  functRegCategory({classe_nome: classe_nome, classe_classe_id: null,  classe_foto: null,
        arg_espacos: armazens_categoria, arg_espaco_auth: armazem_atual, arg_colaborador_id: colaborador_id});
}

function clearText( text ) {
    let replace = text.replace( '  ', ' ' ).trim();
    if( replace !== text ) return clearText( replace );
    else return replace;
}
function getSpacePrices(req, row, headers, spaces, errors, rowNumber) {
    let precosArmazens = [];
    let pricePosition = 11;
    let isValid = true;
    for (let i = 0; i < headers.length; i++) {
        if(row.values[pricePosition] !== undefined){
            if (typeof row.values[pricePosition] !== "number") {
                errors.push("Valor inválido para " +  headers[i]+" na linha "+rowNumber);
                isValid = false;
            }
            else{
                precosArmazens.push({espaco_id: spaces[i], precario_custo: row.values[pricePosition], precario_quantidade: 1, stock_minimo: null});
            }
        }
        pricePosition = pricePosition + 1;
    }
    return [isValid, precosArmazens, errors];
}
app.post("/api/importar_artigos", async (req, res) =>{
    const excel = require("exceljs");
    let workbook = new excel.Workbook();
    let errors = [];
    let listCorrectData = [];
    let validRow = true;
    let categorias = JSON.parse(req.body.categorias);
    let impostos = JSON.parse(req.body.impostos);
    let aplicacao_imposto = JSON.parse(req.body.aplic_imposto);
    let unidades = JSON.parse(req.body.unidades);
    let listaImpostoSelecionado = [];
    let headers = [];
    let spaces;
    let worksheetSpace;
    let result;
    let artigo_unit_id;
    let stockNegativo;
    let categoriasInexistentes = [];
    if(req.file) {
        await workbook.xlsx.readFile(req.file.path);
        worksheetSpace = workbook.getWorksheet("Armazéns");
        spaces = worksheetSpace.getRow(1).values;
        spaces.shift();

        workbook.getWorksheet("Modelo de artigos").eachRow({includeEmpty: false},  function (row, rowNumber) {
            if(!row.values[4]){
                return
            }

            if (rowNumber > 1) {
                listaImpostoSelecionado = [];
                if (row.values[4] === undefined || typeof row.values[4] !== "string") {
                    errors.push("Nome do artigo não foi encontrado na coluna C linha " + rowNumber + ".");
                    validRow = false;
                }
                if(row.values[6] !== undefined){
                    if (impostos.find(imp => imp.data.tipoimposto_nome === row.values[6])) {
                        if(aplicacao_imposto.find(aplic => aplic.taplicar_descricao === (row.values[7] || "NA"))){
                            listaImpostoSelecionado.push({
                                arg_tipoimposto_id: impostos.find(imp => imp.data.tipoimposto_nome === row.values[6]).data.tipoimposto_id,
                                arg_taplicar_id: aplicacao_imposto.find(aplic => aplic.taplicar_descricao === row.values[7]).taplicar_id,
                                arg_imposto_valor: null,
                                arg_imposto_percentagem: null
                            });
                        }
                        else{
                            errors.push("Selecione a forma de aplicar o imposto na coluna G linha " + rowNumber+".");
                            validRow = false;
                        }
                    }
                    else{
                        errors.push("O imposto deve ser selecionado e não digitado na coluna F linha " + rowNumber+".");
                        validRow = false;
                    }
                }
                if(row.values[10] !== undefined){
                    if (typeof row.values[10] !== "number") {
                        errors.push("Valor de quantidade de artigo no stock incorreto na coluna J linha " + rowNumber+".");
                        validRow = false;
                    }
                }
                if(row.values[9] === undefined || typeof row.values[9] !== "string") stockNegativo = false;
                else stockNegativo = row.values[9].toLowerCase().includes("sim") || row.values[9].toLowerCase().includes("s");

                let { main : { unit_id : artigo_unit_id } } = unidades.find(({main: {unit_code}}) => unit_code === row.values[3]) || {};

                result = getSpacePrices(req, row, headers, spaces, errors, rowNumber);
                if(validRow){
                    listCorrectData.push({
                        artigo_artigo_id: null,
                        artigo_compostoquantidade: null,
                        artigo_classe_id: null,
                        classe_nome: (row.values[5] || "Sem categoria"),
                        artigo_id: null,
                        artigo_codigo: (row.values[2] || generateCode().toUpperCase()),
                        artigo_unit_id,
                        artigo_nome: clearText(row.values[4]),
                        artigo_codigoimposto: row.values[8] || null,
                        artigo_preparacao: false,
                        artigo_stocknegativo: stockNegativo,
                        artigo_foto: null,
                        artigo_descricao: null,
                        arg_items: [],
                        arg_imposto: listaImpostoSelecionado,
                        arg_links: result[1],
                        arg_ean_codes: (row.values[1] === undefined ? [] : [{
                            ean_code: row.values[1],
                            ean_dateout: null,
                            ean_datein: null
                        }]),
                        arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
                        arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
                        acerto_quantidade: (row.values[10] || 0)
                    });
                    if(categorias.findIndex(cat => cat.classe_nome === clearText((row.values[5] || "Sem categoria"))) === -1){
                        categoriasInexistentes.push({classe_nome: (row.values[5] || "Sem categoria"), classe_id: null});
                    }

                    console.log(listCorrectData)
                }
            } else{
                headers = row.values.filter(function(value, index, arr){
                    return index > 10;
                });
            }
        });
        if( fs.existsSync( req.file.path )) fs.unlinkSync(req.file.path);

        if(errors.length === 0){
            const {functRegArticle, functChangeAmountInStock} = require("../db/call-function-article");
            let response;
            for (let i = 0;i<categoriasInexistentes.length;i++) {
                await clusterServer.service.loadLocalCluster();
                response = await addCategory({classe_nome: categoriasInexistentes[i].classe_nome,
                    colaborador_id: req.session.auth_data.auth.colaborador_id,
                    spaces: spaces, armazem_atual: req.session.auth_data.auth.armazem_atual
                });
                await clusterServer.service.loadLocalCluster();
                if(response.row.result){
                    categoriasInexistentes[i].classe_id = response.row.message.classe.classe_id;
                    clusterServer.notifyLocalChange({event: "ADD:CATEGORY", extras: null, message: "Registo de categoria"});
                }
            }

            for(let i=0;i<listCorrectData.length;i++){
                await clusterServer.service.loadLocalCluster();
                if(categorias.findIndex(cat => cat.classe_nome === listCorrectData[i].classe_nome) === -1)
                    listCorrectData[i].artigo_classe_id = categoriasInexistentes.find(cat => cat.classe_nome === listCorrectData[i].classe_nome).classe_id;
                else
                    listCorrectData[i].artigo_classe_id = categorias.find(cat => cat.classe_nome === listCorrectData[i].classe_nome).classe_id;

                functRegArticle(listCorrectData[i]).then(async value => {
                    await clusterServer.service.loadLocalCluster();
                    if(!value.row.result) errors.push(value.row.message.text+" :"+listCorrectData[i].artigo_nome);
                    else{
                        clusterServer.notifyLocalChange({event: "ADD:ARTICLE", extras: null, message: "Registo de artigo"});
                        if(Number(listCorrectData[i].acerto_quantidade) !== 0){
                            await clusterServer.service.loadLocalCluster();
                            await functChangeAmountInStock({arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
                                arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
                                acerto_observacao: null, arg_espaco_id: req.session.auth_data.auth.armazem_atual,
                                arg_acerto: [{artigo_id: value.row.message.artigo.artigo_id, acerto_quantidade: listCorrectData[i].acerto_quantidade}]
                            });
                            await clusterServer.service.loadLocalCluster();
                            clusterServer.notifyLocalChange({event: "ACERTO", extras: null, message: "Acerto de stock"});
                        }
                    }
                }).catch(error =>{
                    errors.push(error);
                });
            }
            res.json({result: (errors.length === 0), erros: errors});
        }
        else res.json({result: false, erros: errors});
    }
    else res.json({result: false, message: "Ocorreu um erro a carregar ficheiro."})
});

