import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {clusterServer} from "../../../../service/cluster.service";

// structure.footer()
export let create = async (instituition, artigos_transferencia:any, armazens, res, user:string, date) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigos = [];
    artigos_transferencia.forEach((art) =>{
        artigos.push([
            {
                margin: [0, 3, 0, 3],
                fontSize : 6.5,
                border: [false, false, false, false],
                text : art.artigo_codigo
            },
            {
                margin: [0, 3, 0, 3],
                fontSize : 6.5,
                border: [false, false, false, false],
                text : art.artigo_nome
            },
            {
                margin: [0, 3, 0, 3],
                fontSize : 6.5,
                border: [false, false, false, false],
                text : art.transferencia_quantidade
            }
        ]);
    });

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";
    let removerLinhaDoCabecalho = !instituition?.espaco_configuracao.removerLinhaDoCabecalho;

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let docDefinition = {
        compress: true,
        info: {
            title: 'Transferêcia de artigos',
            author: 'Luma',
            subject: 'Impressão de transferêcia de artigos',
            keywords: 'Luma, artigos, transferência',
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
                                    getImage("nif.png", 9, baseColor)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 9, baseColor)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 9, baseColor)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 9, baseColor)
                                ]
                            }
                        ]
                    }
                ]
            } : {},
            {
                lineHeight: 1.3,
                margin: [0, (!hasPersonalizadoHarder) ? 25 : 10, 0, 0],
                layout: {
                    hLineWidth: function (i, node) {
                        return 0.8;
                    },
                    vLineWidth: function (i, node) {
                        return 0.8;
                    },
                },
                table: {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                fontSize : 8,
                                border: [false, false, removerLinhaDoCabecalho, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `TRANSFERÊNCIA DE ARTIGOS`,
                                        bold: true,
                                    }
                                ]
                            },
                            {
                                fontSize : 8,
                                border: [removerLinhaDoCabecalho, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        alignment: "right",
                                        color: '#000000',
                                        text: "Data de transferência"
                                    },
                                    {
                                        alignment: "right",
                                        width: "100%",
                                        text: date,
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                // font: "NimbusRomanno9l",
                lineHeight: 1.3,
                columns: [
                    {
                        width: "45%",
                        table : {
                            widths: ["100%"],
                            body: [
                                [
                                    {
                                        fontSize : 8,
                                        border: [false, false, false, false],
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Armazém de Saída: "
                                            },
                                            `${armazens.armazem_origem}`
                                        ]
                                    }
                                ],
                                [
                                    {
                                        fontSize : 8,
                                        border: [false, false, false, false],
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Cód. Armazém de Saída: "
                                            },
                                            `${armazens.armazem_origem_codigo}`
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        width: "10%",
                        text : " "
                    },
                    {
                        width: "45%",
                        table : {
                            widths: ["100%"],
                            body: [
                                [
                                    {
                                        fontSize : 8,
                                        border: [false, false, false, false],
                                        text: [
                                            {
                                                alignment: "right",
                                                bold: true,
                                                color : '#000000',
                                                text : "Armazém de Entrada: "
                                            },
                                            `${armazens.armazem_destino}`
                                        ]
                                    }
                                ],
                                [
                                    {
                                        fontSize : 8,
                                        border: [false, false, false, false],
                                        text: [
                                            {
                                                alignment: "right",
                                                bold: true,
                                                color : '#000000',
                                                text : "Cód. Armazém de Entrada: "
                                            },
                                            `${armazens.armazem_destino_codigo}`
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                ]
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
                    widths: ["20%", "60%", "20%"],
                    body : [
                        [
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Código",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text : "Descrição",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Quantidade",
                                color: textcolor
                            }
                        ],
                        ...artigos
                    ]
                }
            }
        ],
        ...structure(user, null, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)), textcolor, baseColor)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        const pdfBuffer = Buffer.from(buffer);
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Tranferencia.pdf`);
        // Send the PDF file in the response
        res.send(pdfBuffer);
    });
}
