import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {clusterServer} from "../../../../service/cluster.service";
import moment from "moment";

export let create = async (instituition, account_content, res, user, num_autorization, guia) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";
    let removerLinhaDoCabecalho = !instituition?.espaco_configuracao.removerLinhaDoCabecalho;

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));
    let imageCabecalho = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let artigosConta = [];
    (account_content.main.conta_vendas || []).forEach((cont) => {
        artigosConta.push([
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont.venda_quantidade
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont.unit_code || "---"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont?.artigo_codigo || "---"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont.artigo_nome
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: (cont.venda_validade === null ? "---" : moment(cont.venda_validade).format("DD-MM-YYYY")),
                alignment: "right"
            }
        ]);
    });
    let docDefinition = {
        compress: true,
        info: {
            title: 'Guia de Saída',
            author: 'Luma',
            subject: 'Impressão de guia de saída',
            keywords: 'luma, brainsoft',
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
                                    getImage("nif.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 9)
                                ]
                            }
                        ]
                    }
                ]
            } : {},
            {
                lineHeight: 1.3,
                margin: [0, (!!hasPersonalizadoHarder) ? 25 : 10, 0, 0],
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
                                fontSize: 8,
                                border: [false, false, removerLinhaDoCabecalho, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        margin: [0, 0, 0, 10],
                                        color: '#000000',
                                        text: `GUIA DE SAÍDA`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Cliente: `
                                            },
                                            account_content.main.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
                                            },
                                            (account_content.main.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Endereço: `
                                            },
                                            (account_content?.main?.cliente_metadata?.morada || "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                alignment: "right",
                                border: [removerLinhaDoCabecalho, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        color: '#000000',
                                        text: "Nº de guia de saída"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text: guia.guia_numero,
                                    },
                                    {
                                        color: '#000000',
                                        text: "Data de emissâo"
                                    },
                                    {
                                        width: "100%",
                                        text: moment(guia.guia_date).format("DD-MM-YYYY")
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                text: "",
                margin: [0, 20, 0, 5],
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
                    widths: ["8%", "10%", "44%", "17%", "21%"],
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
                                fillColor: baseColor,
                                text: "Código",
                                color: textcolor
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
                                text: "Data de validade",
                                color: textcolor,
                                alignment: "right"
                            }
                        ],
                        ...artigosConta
                    ]
                }
            },
            {
                margin: [0, 50, 0, 0],
                stack: [
                    {
                        fontSize: 8,
                        bold: false,
                        text: "Recebi"
                    },
                    {
                        margin: [0, 20, 0, 0],
                        bold: false,
                        text: "____________________________________"
                    }
                ]
            },
            {
                margin: [0, 50, 0, 0],
                stack: [
                    {
                        fontSize: 8,
                        bold: false,
                        text: "Entreguei"
                    },
                    {
                        margin: [0, 20, 0, 0],
                        bold: false,
                        text: "____________________________________"
                    }
                ]
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification, imageCabecalho, textcolor, baseColor),
        pageMargins: [35, (imageCabecalho ? 90 : 50), 35, 50],
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
