import path from "path";
import fs from "fs";
import {getFonts, structure} from "./estruture-talao-a5";
import {folders} from "../../../../global/project";
import {print} from "./printer";
import {clusterServer} from "../../../../service/cluster.service";

export let create = async (instituition, account_content, res, user, date, printer_name, num_autorization) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();

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

    let sumImpost = {};

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
                                margin: [0, 0, 0, 5],
                                image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                                width: 60,
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
                            {
                                width: "35%",
                                text: "Qtd. x Preço"
                            },
                            {
                                width: "32.5%",
                                text: "Taxa",
                                alignment: "center"
                            },
                            {
                                width: "32.5%",
                                text: "Subtotal",
                                alignment: "right",
                            },
                        ]
                    },
                    {
                        alignment: "center",
                        canvas: [ { type: 'rect', x: -3, y: 0, w: 245, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return (account_content?.main?.conta_vendas || []).map((cont) =>{

                    if(!!cont.tipoimposto_id) {
                        if (!sumImpost[cont.tipoimposto_id]) {
                            sumImpost[cont.tipoimposto_id] = {
                                sum: 0,
                                name: cont.tipoimposto_nome
                            }
                        }

                        sumImpost[cont.tipoimposto_id].sum += cont.venda_imposto;
                    }

                    subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
                    preco_artigo = cont.venda_montantesemimposto/cont.venda_quantidade;
                    return {
                        lineHeight: 1,
                        style : "normal",
                        stack: [
                            {text: (cont.venda_descricao === null ? cont.artigo_nome : cont.venda_descricao )},
                            {
                                columns: [
                                    {
                                        width: "35%",
                                        text : `${cont.venda_quantidade} x ${formattedString(preco_artigo.toFixed(2))+" STN"} `
                                    },
                                    {
                                        alignment: "center",
                                        width: "32.5%",
                                        text : `${formattedString(cont.venda_imposto.toFixed(2))} STN`
                                    },
                                    {
                                        width: "32.5%",
                                        text: formattedString(cont.venda_montantesemimposto.toFixed(2)+"")+" STN",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                alignment: "center",
                                canvas: [ { type: 'rect', x: -3, y: 0, w: 245, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
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
                    ...Object.keys(sumImpost).map((key) => {
                        return {
                            columns : [
                                {
                                    text :  `${sumImpost[key].name}`
                                },
                                {
                                    text : formattedString(sumImpost[key].sum.toFixed(2)+"")+" STN",
                                    alignment : "right"
                                }
                            ],
                        }
                    }),
                    {
                        style : "bold",
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
                let paper = instituition.espaco_configuracao.printTalaoA5 ? "A5" : "POS";
                print(printer_name, path.resolve(path.join(folders.temp, 'multer/'+filename)), paper);
                res.json("done");
            }
        });
    });
}