import NodePdfPrinter from 'node-pdf-printer'
import path from "path";
import fs from "fs";
import {getFonts, structure, photoResize} from "./estruture-talao";
import {formattedString} from "./formatValue";
import {folders} from "../../../../global/project";
import {print} from "./printer";
import {clusterServer} from "../../../../service/cluster.service";

let getValueInList = (list, value, {nameLists, keyId, keyValue}) => {
    let rt;
    for (let i = 0; i < nameLists.length; i++) {
        let nameList = nameLists[i];
        rt = (list[nameList].find((data) => { return (data[keyId] + "") === (value + ""); })?.[keyValue]) || rt
        if (rt){
            break;
        }
    }
    return rt;
}

export let create = async (instituition, account_content, res, user, date, printer_name, num_autorization) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();

    let valorTotalImpostos = 0;
    let subtotal = 0;
    let footerSystem;
    let preco_artigo = 0;
    if(num_autorization !== null && instituition.espaco_configuracao.certification !== null)
        footerSystem = "Documento emitido por sistema informático com o nº de autorização "+num_autorization+" e de certificado "+num_autorization;
    else if(num_autorization === null && instituition.espaco_configuracao.certification !== null)
        footerSystem = "Documento emitido por sistema informático com o nº de certificado "+instituition.espaco_configuracao.certification;
    else
        footerSystem = "Documento emitido por sistema informático com o nº de autorização "+num_autorization;

    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let docDefinition = {
        compress: true,
        info: {
            title: 'Fatura',
            author: 'maguita',
            subject: 'Fatura',
            keywords: 'luma, fatura, recibo, brainsoft',
        },
        content: [
            {
                lineHeight: 1,
                columns: [
                    {
                        style : "grande",
                        alignment: "center",
                        stack: [
                            (logoTipo && instituition?.espaco_configuracao.logo_talao ? {
                                margin: [0, 10, 0, 5],
                                image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                                width: 50,
                            } : {}),
                            {
                                style : "bold",
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`
                            },
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                            },
                            {
                                text: `Cont: ${instituition?.espaco_configuracao?.empresa_telef}`
                            },
                            {
                                text: `NIF: ${instituition?.espaco_configuracao?.empresa_nif} `
                            },
                            {
                                text: `Email: ${instituition?.espaco_configuracao?.empresa_email}`
                            },
                        ]
                    }
                ]
            },
            {
                lineHeight: 1,
                style : "normal",
                margin: [0, 8, 0, 0],
                columns: [
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        width: "50%",
                                        bold: false,
                                        text : "FATURA"
                                    },
                                    {
                                        width: "50%",
                                        text : account_content.main.conta_serie.document,
                                        alignment : "right"
                                    }
                                ],
                            },
                            {
                                columns: [
                                    {
                                        width: "50%",
                                        bold: false,
                                        text : "Data de Emissâo"
                                    },
                                    {
                                        width: "50%",
                                        text : date,
                                        alignment : "right"
                                    }
                                ],
                            },
                        ]
                    },
                ]
            },
            {
                lineHeight: 1,
                style : "normal",
                margin: [0, 8, 0, 0],
                columns: [
                    {
                        stack: [
                            {
                                text: `NIF: ${(account_content?.main?.cliente_nif || "---------------")}`
                            },
                            {
                                text: `Nome: ${account_content?.main?.cliente_titular}`
                            },
                        ]
                    },
                ]
            },
            {
                lineHeight: 1,
                style : "bold",
                margin: [0, 10, 0, 0],
                stack: [
                    {text: "Descrição"},
                    {
                        columns: [
                            {text: "Qtd. x Preço"},
                            {
                                text: "Total",
                                alignment: "right",
                            },
                        ]
                    },
                    {
                        canvas: [ { type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return (account_content?.main?.conta_vendas || []).map((cont) =>{
                    valorTotalImpostos = Number(valorTotalImpostos) + Number(cont.venda_imposto);
                    subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
                    preco_artigo = cont.venda_montantesemimposto/cont.venda_quantidade;
                    return {
                        lineHeight: 1,
                        style : "normal",
                        stack: [
                            {text: (cont.venda_descricao === null ? cont.artigo_nome : cont.venda_descricao )},
                            {
                                columns: [
                                    {text : `${cont.venda_quantidade} x ${formattedString(preco_artigo.toFixed(2)+"")+" STN"}`},
                                    {
                                        text: formattedString((Number(cont?.venda_quantidade) * Number(preco_artigo)).toFixed(2)+"")+" STN",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                canvas: [ { type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                                margin: [0, 2, 0, 2],
                            }
                        ]
                    };
                });
            })(),
            {
                margin:  [0, 6, 0, 0],
                style: "normal",
                stack: [
                    {
                        columns : [
                            {
                                text : "Subtotal",
                            },
                            {
                                text : formattedString(subtotal.toFixed(2)+"")+" STN",
                                alignment : "right"
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                text : "Imposto",
                            },
                            {
                                text : formattedString(valorTotalImpostos.toFixed(2)+"")+" STN",
                                alignment : "right"
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                text : "Total",
                            },
                            {
                                text : formattedString(account_content.main.conta_montante.toFixed(2)+"")+" STN",
                                alignment : "right"
                            }
                        ]
                    }
                ]
            },
            {
                margin:  [0, 6, 0, 0],
                style: "pequena",
                stack: [
                    {
                        text: "Processado pelo software Luma",
                    },
                    {
                        text: `Operador(a): ${user}`,
                    },
                    {
                        text: "Obrigado pela preferência",
                    },
                    {
                        text: footerSystem
                    }
                ]
            }
        ],
        ...structure(user)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FaturaTalao_"+(new Date().getTime()+Math.random())+".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            if (err) return console.log(err);
            else{
                print(printer_name, path.resolve(path.join(folders.temp, 'multer/'+filename)));
                res.json("done");
            }
        });
    });
}
