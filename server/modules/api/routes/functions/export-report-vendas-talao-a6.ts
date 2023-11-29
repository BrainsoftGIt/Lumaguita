import path from "path";
import fs from "fs";
import {getFonts, structure} from "./estruture-talao-a6";
import {folders} from "../../../../global/project";
import * as print from "./printer";
import moment from "moment";

import {clusterServer} from "../../../../service/cluster.service";
import {sys} from "../../../../global/sys";
import {args} from "../../../../global/args";

export let create = async (instituition, accounts, res, user, printer_name, arg_date_start, arg_date_end, onlyOpen, versionPrinter="printV2") => {
    moment.locale('pt-br')

    console.log(instituition)
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();

    let total = 0;
    let footerSystem = "Documento emitido por sistema informático com o nº de certificado "+instituition.espaco_configuracao.certification;
    let preco_artigo = 0;

    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let docDefinition= {
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
                style : "bold",
                margin: [0, 10, 0, 0],
                stack: [
                    {text: "Descrição"},
                    {
                        columns: [
                            {
                                text: "Qtd. x Preço"
                            },
                            {
                                text: "Total",
                                alignment: "right",
                            }
                        ]
                    },
                    {
                        alignment: "center",
                        canvas: [ { type: 'rect', x: 0, y: 0, w: 245, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return (accounts || []).map(({data}) =>{

                    total = total + Number(data.venda_montantecomimposto);
                    preco_artigo = data.venda_montantecomimposto/data.venda_quantidade;

                    return {
                        lineHeight: 1,
                        style : "normal",
                        stack: [
                            {text: data.artigo_nome},
                            {
                                columns: [
                                    {
                                        text : `${data.venda_quantidade.toFixed(2)} x ${formattedString(preco_artigo.toFixed(2))+" STN"} `
                                    },
                                    {
                                        text: formattedString(data.venda_montantesemimposto.toFixed(2)+"")+" STN",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                alignment: "center",
                                canvas: [ { type: 'rect', x: 0, y: 0, w: 245, h: 0, dash: { length: 9 }, lineWidth: 0.5} ],
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
                        style : "bold",
                        columns : [
                            {
                                text : "Total",
                            },
                            {
                                text : formattedString(total.toFixed(2)+"")+" STN",
                                alignment : "right"
                            }
                        ]
                    }
                ]
            },
            {
                margin:  [0, 10, 0, 0],
                style: "normal",
                stack: [
                    {
                        width: "100%",
                        style : "bold",
                        columns : [
                            {
                                text : `${moment(arg_date_start).format('LL')} - ${moment(arg_date_end).format('LL')}`,
                                alignment : "center"
                            }
                        ]
                    }
                ]
            }
        ],
        ...structure({user, footerSystem, instituition, logoTipo})
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FaturaTalao_"+(new Date().getTime()+Math.random())+".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            let paper = "A6";
            if(!onlyOpen) {
                print[versionPrinter](printer_name, path.resolve(path.join(folders.temp, 'multer/' + filename)), paper);
            }
            res.json("done");
        });

        if(onlyOpen) {
            sys.openUrl(`http://127.0.0.1:${args.appPort}/fr/${filename}`)
        }
    });
}
