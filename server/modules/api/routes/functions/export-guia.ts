import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import moment from "moment";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";
import {formattedString} from "./formatValue";

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

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";

    let imageCabecalho = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));
    artigos.forEach((art) => {
        art = art.data.data;
        artigosEntrada.push([
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: art.entrada_quantidade
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: art.unit_code || "----"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: art.artigo_codigo || "----"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: art.entrada_descricao
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString(art.entrada_custounitario + ""),
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString((Number(art.entrada_quantidade) * Number(art.entrada_custounitario)) + ""),
                alignment: "right"
            }
        ]);
        subtotal = Number(subtotal) + (Number(art.entrada_quantidade) * Number(art.entrada_custounitario));
    });
    if (custo_guia.length === 0) total = subtotal;
    else {
        total = Number(custo_guia[0].data.data.custoguia_montante) + Number(subtotal);
    }

    let rotape = {
        margin: [30, 0, 30, 0],
        table: {
            widths: ["8%", "11%", "10%", "33%", "17%", "21%"],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: "", colSpan: 4, fillColor: "#ffffff"
                    },
                    {text: ""},
                    {text: ""},
                    {text: ""},
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: "Subtotal"
                    },
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: formattedString(subtotal.toFixed(2) + ""),
                        alignment: "right"
                    },
                ],
                [
                    {
                        border: [false, false, false, false],
                        text: "", colSpan: 4, fillColor: "#ffffff"
                    },
                    {text: ""},
                    {text: ""},
                    {text: ""},
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: "Seguro tarifas transporte",
                    },
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: (custo_guia.length === 0 ? "" : formattedString(custo_guia[0].data.data.custoguia_montante.toFixed(2) + "")),
                        alignment: "right"
                    }
                ],
                [
                    {
                        border: [false, false, false, false],
                        text: "", colSpan: 4, fillColor: "#ffffff"
                    },
                    {text: ""},
                    {text: ""},
                    {text: ""},
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        fillColor: baseColor,
                        color: textcolor,
                        margin: [0, 0.5, 0, 0.5],
                        bold: true,
                        text: "Total",
                    },
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        fillColor: baseColor,
                        color: textcolor,
                        margin: [0, 0.5, 0, 0.5],
                        bold: true,
                        text: formattedString(total.toFixed(2) + ""),
                        alignment: "right"
                    }
                ]
            ]
        }
    };

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
                        image: 'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                        width: 80,
                    } : {}),
                    {
                        fontSize: 9,
                        alignment: "right",
                        stack: [
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`,
                                bold: true,
                                fontSize: 9,
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_nif} `
                                    },
                                    getImage("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
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
                margin: [0, (!!hasPersonalizadoHarder) ? 25 : 10, 0, 0],
                table: {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                fontSize: 8,
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `Fornecedor`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Código: `
                                            },
                                            fornecedor.fornecedor_code
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Nome: `
                                            },
                                            fornecedor.fornecedor_nome
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
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
                                fontSize: 8,
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        color: '#000000',
                                        text: "Guia de Entrada"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text: guia.guia_numero,
                                    },
                                    {
                                        columns: [
                                            {
                                                bold: true,
                                                width: "30%",
                                                color: '#000000',
                                                text: "Data de Guia",
                                            },
                                            {
                                                bold: true,
                                                width: "30%",
                                                color: '#000000',
                                                text: "Nº Documento",
                                            },
                                            {
                                                bold: true,
                                                width: "40%",
                                                color: '#000000',
                                                text: "Data Doc. Fornecedor",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "30%",
                                                text: `${(moment(guia.guia_date).format("DD-MM-YYYY"))}`
                                            },
                                            {
                                                width: "30%",
                                                text: `${(guia.guia_documentoperacao || "---------")}`
                                            },
                                            {
                                                width: "40%",
                                                text: `${moment(guia.guia_dataoperacao).format("DD-MM-YYYY")}`,
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
                text: ""
            },
            {
                fontSize: 7,
                lineHeight: 1.3,
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#F5F6F6' : null;
                    },
                    hLineWidth: function (i, node) {
                        return 0.8;
                    },
                    vLineWidth: function (i, node) {
                        return 0.8;
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ["8%", "11%", "10%", "33%", "17%", "21%"],
                    body: [
                        [
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Qtd",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Uni.",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                color: textcolor,
                                fillColor: baseColor,
                                text: "Código"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Descrição",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Valor Unit. STN",
                                color: textcolor,
                                alignment: "right"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Valor STN",
                                color: textcolor,
                                alignment: "right"
                            }
                        ],
                        ...artigosEntrada
                    ]
                }
            }
        ],
        ...structure(user, null, instituition.espaco_configuracao.certification,  imageCabecalho, textcolor, baseColor, rotape)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        const pdfBuffer = Buffer.from(buffer);
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=file.pdf');
        // Send the PDF file in the response
        res.send(pdfBuffer);
    });
}
