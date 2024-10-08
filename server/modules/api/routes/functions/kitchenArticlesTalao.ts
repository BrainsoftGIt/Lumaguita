import path from "path";
import fs from "fs";
import {getFonts, structure} from "./estruture-talao";
import {folders} from "../../../../global/project";
import * as print from "./printer";
import {sys} from "../../../../global/sys";
import {args} from "../../../../global/args";
export let create = async (instituition, articles, res, date, table, obs, margin, onlyOpen, versionPrinter="printV2") => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();

    let percentagemDiminuir = instituition?.espaco_configuracao?.pos_percentagemDiminuir;

    let docDefinition = {
        compress: true,
        info: {
            title: '',
            author: 'luma',
            subject: 'Impressão na cozinha',
            keywords: 'luma, cozinha, brainsoft',
        },
        content: [
            {
                lineHeight: 1,
                columns: [
                    {
                        style : "grande",
                        alignment: "center",
                        stack: [
                            {
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
                                        text : "CONTA/MESA"
                                    },
                                    {
                                        width: "50%",
                                        text : table,
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
                    {
                        columns: [
                            {text: "Artigos", bold: true},
                            {
                                text: "Quantidade",
                                alignment: "right",
                                bold: true
                            },
                        ]
                    },
                    {
                        canvas: [ { type: 'rect', x: 0, y: 0, w: 170, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return articles.map((art) =>{
                    return {
                        lineHeight: 1,
                        style : "normal",
                        stack: [
                            {
                                columns: [
                                    {
                                        margin: [0, 5, 0, 5],
                                        text: art.artigo_nome
                                    },
                                    {
                                        margin: [0, 5, 0, 5],
                                        text: art.venda_quantidade+" unt.",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                canvas: [ { type: 'rect', x: 0, y: 0, w: 820, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                                margin: [0, 2, 0, 2],
                            }
                        ]
                    };
                });
            })(),
            (obs !== null ? {
                margin: [0, 20, 0, 0],
                stack: [
                    {
                        style : "normal",
                        fontSize: 8,
                        bold: true,
                        text : "Observação"
                    },
                    {
                        style : "normal",
                        bold: false,
                        text : obs
                    }
                ]
            } : {})
        ],
        ...structure({margin, percentagemDiminuir})
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Kitchen"+(new Date().getTime()+Math.random())+".pdf";
        const printerName = instituition.espaco_configuracao.impressoras_cozinha.nome;
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            if(!onlyOpen) {
                print[versionPrinter](printerName, path.resolve(path.join(folders.temp, 'multer/' + filename)));
            }
            res.json("done");
        });

        if(onlyOpen) {
            sys.openUrl(`http://127.0.0.1:${args.appPort}/fr/${filename}`)
        }
    });
}
