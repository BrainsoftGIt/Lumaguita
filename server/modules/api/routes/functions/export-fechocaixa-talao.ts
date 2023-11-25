import path from "path";
import fs from "fs";
import {getFonts, structure} from "./estruture-talao";
import {folders} from "../../../../global/project";
import * as print from "./printer";
import {clusterServer} from "../../../../service/cluster.service";
import {sys} from "../../../../global/sys";
export let create = async (instituition, caixa, res, user, printer_name, margin, onlyOpen, versionPrinter="printV2") => {
    caixa = caixa.box_data;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();

    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let docDefinition = {
        compress: true,
        info: {
            title: 'Fecho/Caixa',
            author: 'luma',
            subject: 'Fecho/Caixa',
            keywords: 'luma, caixa, brainsoft',
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
                                width: 100,
                            } : {}),
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
                                        text : "Data de impressão"
                                    },
                                    {
                                        width: "50%",
                                        text : `${caixa.date}`,
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
                                text: `Posto: ${caixa.posto}`
                            },
                            {
                                text: `Valor de abertura: ${formattedString(caixa.valor_abertura+"")} STN`
                            },
                            {
                                text: `Quantidade de cheques: ${caixa.quantidadeCheques}`
                            },
                            {
                                text: `Valor total da venda: ${formattedString(caixa.valorFecho+"")} STN`
                            },
                            {
                                text: `OBS: ${(caixa.obs || "----------")}`
                            },
                        ]
                    },
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
                    }
                ]
            }
        ],
        ...structure({margin})
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FechoCaixa"+(new Date().getTime()+Math.random())+".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            if(!onlyOpen) {
                print[versionPrinter](printer_name, path.resolve(path.join(folders.temp, 'multer/' + filename)));
            }
            res.json("done");
        });

        if(onlyOpen) {
            sys.openUrl(`http://127.0.0.1:3210/fr/${filename}`)
        }
    });
}
