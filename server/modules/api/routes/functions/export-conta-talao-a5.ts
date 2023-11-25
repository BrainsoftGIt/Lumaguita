import path from "path";
import fs from "fs";
import {getFonts, structure} from "./estruture-talao-a5";
import {folders} from "../../../../global/project";
import * as print from "./printer";
import {clusterServer} from "../../../../service/cluster.service";
import {sys} from "../../../../global/sys";

export let create = async (instituition, account_content, res, user, date, printer_name, onlyOpen, versionPrinter="printV2") => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let subtotal = 0;
    let preco_artigo = 0;
    const footerSystem =  instituition.espaco_configuracao.certification !== null ? "Documento emitido por sistema informático com o nº de certificado "+instituition.espaco_configuracao.certification
      : "";

    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let sumImpost = {};

    let docDefinition = {
        compress: true,
        info: {
            title: 'Conta',
            author: 'luma',
            subject: 'Conta',
            keywords: 'luma, conta, brainsoft',
        },
        content: [
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
                                        text : "CONTA"
                                    },
                                    {
                                        width: "50%",
                                        text : account_content.main.conta_numerofatura,
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
                        canvas: [ { type: 'rect', x: 0, y: 0, w: 345, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return (account_content?.main?.conta_vendas || []).map((cont) =>{

                    preco_artigo = cont.venda_montantesemimposto/cont.venda_quantidade;
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

                    return {
                        lineHeight: 1,
                        style : "normal",
                        stack: [
                            {text: cont.artigo_nome},
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
                                canvas: [ { type: 'rect', x: 0, y: 0, w: 345, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
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
                        ],
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
                                text : formattedString(account_content?.main?.conta_montante.toFixed(2)+"")+" STN",
                                alignment : "right"
                            }
                        ],
                    }
                ]
            }
        ],
         ...structure({user, footerSystem, instituition, logoTipo})
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Conta"+(new Date().getTime()+Math.random())+".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            let paper = "A5";
            if(!onlyOpen) {
                print[versionPrinter](printer_name, path.resolve(path.join(folders.temp, 'multer/' + filename)), paper);
            }
            res.json("done");
        });

        if(onlyOpen) {
            sys.openUrl(`http://127.0.0.1:3210/fr/${filename}`)
        }
    });
}
