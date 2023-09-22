import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import moment from "moment";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";
export let create = async (instituition, fornecedor, guia, artigos, res, user, custo_guia) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigosEntrada = [];
    let subtotal = 0;
    let total = 0;

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));
    artigos.forEach((art) =>{
        art = art.data.data;
        artigosEntrada.push([
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.artigo_codigo || "----"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.entrada_descricao
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.entrada_lote || "----"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.entrada_quantidade
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : formattedString(art.entrada_custounitario+"")+" STN",
                alignment : "right"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : formattedString((Number(art.entrada_quantidade) * Number(art.entrada_custounitario))+"")+" STN",
                alignment : "right"
            }
        ]);
        subtotal = Number(subtotal) + (Number(art.entrada_quantidade) * Number(art.entrada_custounitario));
    });
    if(custo_guia.length === 0) total = subtotal;
    else{
        total = Number(custo_guia[0].data.data.custoguia_montante) + Number(subtotal);
    }
    let docDefinition = {
        compress: true,
        info: {
            title: 'Guia de Entrada',
            author: 'luma',
            subject: 'Guia',
            keywords: 'luma, entrada, brainsoft',
        },
        content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                        width: 80,
                    } : {}),
                    {
                        fontSize : 9,
                        alignment : "right",
                        stack: [
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`,
                                bold: true,
                                fontSize : 9,
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_nif} `
                                    },
                                    getImage("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 12)
                                ]
                            }
                        ]
                    }
                ]
            } : {},
            {
                // font: "NimbusRomanno9l",
                lineHeight: 1.3,
                margin: [0, (!hasPersonalizadoHarder) ? 40 : 10, 0, 0],
                table: {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                fontSize : 8,
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color : '#000000',
                                        text: `Fornecedor`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : `Código: `
                                            },
                                            fornecedor.fornecedor_code
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : `Nome: `
                                            },
                                            fornecedor.fornecedor_nome
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : `NIF: `
                                            },
                                            (fornecedor.fornecedor_nif || "---------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Endereço: `
                                            },
                                            (fornecedor.fornecedor_email || "---------")
                                        ]
                                    },
                                ]
                            },
                           {
                               fontSize : 8,
                               border: [true, false, false, false],
                               borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        color : '#000000',
                                        text : "Guia de Entrada"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text : guia.guia_numero,
                                    },
                                    {
                                        columns: [
                                            {
                                                bold: true,
                                                width: "33.333333333%",
                                                color : '#000000',
                                                text : "Data de Guia"
                                            },
                                            {
                                                bold: true,
                                                width: "33.333333333%",
                                                color : '#000000',
                                                text : "Nº de Documento",
                                            },
                                            {
                                                bold: true,
                                                width: "33.333333333%",
                                                color : '#000000',
                                                text : "Data de Doc. Fornecedor",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "33.333333333%",
                                                text : `${(moment(guia.guia_date).format("DD-MM-YYYY"))}`
                                            },
                                            {
                                                width: "33.333333333%",
                                                text : `${(guia.guia_documentoperacao ||  "---------")}`
                                            },
                                            {
                                                width: "33.333333333%",
                                                text : `${ moment(guia.guia_dataoperacao).format("DD-MM-YYYY")}`,
                                            }
                                        ],
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                // font: "NimbusRomanno9l",
                margin: [0, 20, 0, 5],
                text : ""
            },
            {
                fontSize : 7,
                lineHeight: 1.3,
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#F5F6F6' : null;
                    },
                    hLineWidth: function (i, node) {
                        return  0.8;
                    },
                    vLineWidth: function (i, node) {
                        return  0.8;
                    },
                },
                table : {
                    headerRows: 1,
                    widths: ["10%", "33%", "11%", "8%", "17%", "21%"],
                    body : [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                color: "#ffffff",
                                fillColor: '#000000',
                                text: "Código"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text : "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Lote",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Qtd",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor Unit.",
                                color: "#ffffff",
                                alignment : "right"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor",
                                color: "#ffffff",
                                alignment : "right"
                            }
                        ],
                        ...artigosEntrada,
                        [
                            {
                                border: [false, false, false, false],
                                text : "", colSpan: 4, fillColor : "#ffffff"
                            },
                            {text : ""},
                            {text : ""},
                            {text : ""},
                            {
                                fontSize : 6.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: "Subtotal"
                            },
                            {
                                fontSize : 6.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: formattedString(subtotal.toFixed(2)+"")+" STN",
                                alignment: "right"
                            },
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text : "", colSpan: 4, fillColor : "#ffffff"
                            },
                            {text : ""},
                            {text : ""},
                            {text : ""},
                            {
                                fontSize : 6.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: "Seguro e tarifas de transporte",
                            },
                            {
                                fontSize : 6.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: (custo_guia.length === 0 ? "" : formattedString(custo_guia[0].data.data.custoguia_montante.toFixed(2)+"")+" STN"),
                                alignment: "right"
                            }
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text : "", colSpan: 4, fillColor : "#ffffff"
                            },
                            {text : ""},
                            {text : ""},
                            {text : ""},
                            {
                                fontSize : 7.5,
                                border: [false, false, false, false],
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin : [0, 7, 0, 5],
                                bold: true,
                                text: "Total",
                            },
                            {
                                fontSize : 7.5,
                                border: [false, false, false, false],
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin : [0, 7, 0, 5],
                                bold: true,
                                text: formattedString(total.toFixed(2)+"")+" STN",
                                alignment: "right"
                            }
                        ]
                    ]
                }
            }
        ],
        ...structure(user, null, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Guia de Entrada -"+(new Date().getTime()+Math.random())+".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            if (err) return console.log(err);
            if(res) {
                res.download(path.join(folders.temp, 'multer')+"/"+filename, filename, function () {
                   fs.unlinkSync(path.join(folders.temp, 'multer')+"/"+filename);
                });
            }
        });
    });
}
