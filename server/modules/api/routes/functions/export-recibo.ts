import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {clusterServer} from "../../../../service/cluster.service";
import moment from "moment";

function getTypePayment(tipo_id) {
    if (tipo_id === 1) return "Cash";
    else if (tipo_id === 4) return "Cheque";
    else if (tipo_id === 2) return "Depósito";
    else return "Transferência";
}


export let create = async (instituition, deposito, cliente, res, user, date, num_autorization, serie_numero) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let valor_depositado = 0;
    let valor_restante = deposito[0]?.data?.deposito_montantefinal;
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let depositoPagamento = [];
    let deposito_distribuicao = 0;
    let preview = 0;
    let pendente = 0;
    let faturas_deposito = deposito.filter(dep => dep.data.lancamento_doc !== undefined);
    const moeda = deposito[0]?.data?.currency_code;

    faturas_deposito.forEach((dep, index) => {
        dep = dep.data;
        if (index === 0) {
            preview = Number(dep.regula_acumulacao) - Number(valor_restante);
            pendente = Number(dep.acomulacao) - Number(preview);
            if (Number(valor_restante) > Number(pendente)) {
                valor_restante = Number(valor_restante) - Number(pendente);
                deposito_distribuicao = pendente;
            } else {
                deposito_distribuicao = valor_restante;
                valor_restante = 0;
            }
        } else {
            if (Number(valor_restante) > Number(dep.debito)) {
                valor_restante = Number(valor_restante) - Number(dep.debito);
                deposito_distribuicao = dep.debito;
            } else {
                deposito_distribuicao = valor_restante;
                valor_restante = 0;
            }
        }
        depositoPagamento.push([
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: dep.lancamento_doc
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: "Pagamento de fatura " + dep.lancamento_doc,
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: moment(dep.lancamento_data).format("DD-MM-YYYY"),
                alignment: "center"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString(dep.debito + ""),
                alignment: "center"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString(deposito_distribuicao + ""),
                alignment: "center"
            },
        ]);
    });

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";
    let removerLinhaDoCabecalho = !instituition?.espaco_configuracao.removerLinhaDoCabecalho;

    let rotape = {
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
        margin: [40, 0, 40, 0],
        table: {
            widths: ["5%", "6%", "14%", "35%", "10%", "13%", "17%"],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        text: "", colSpan: 5, fillColor: "#ffffff"
                    },
                    {text: ""},
                    {text: ""},
                    {text: ""},
                    {text: ""},
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: "Código de operação"
                    },
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        margin: [0, 0.5, 0, 0.5],
                        text: deposito[0]?.data?.deposito_docref || "---------",
                        alignment: "right"
                    },
                ],
                [
                    {
                        border: [false, false, false, false],
                        text: "", colSpan: 5, fillColor: "#ffffff",
                    },
                    {text: ""},
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
                        text: "Montante Pago",
                    },
                    {
                        fontSize: 6.5,
                        border: [false, false, false, false],
                        fillColor: baseColor,
                        color: textcolor,
                        margin: [0, 0.5, 0, 0.5],
                        bold: true,
                        text: formattedString((deposito[0]?.data?.deposito_montante || 0)?.toFixed?.(2) + ""),
                        alignment: "right"
                    }
                ]
            ]
        }
    };

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let docDefinition = {
        compress: true,
        info: {
            title: 'Fatura/Recibo',
            author: 'maguita',
            subject: 'Fatura/Recibo',
            keywords: 'maguita, fatura, recibo, brainsoft',
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
                                color: baseColor,
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
                                    getImage("nif.png", 9, baseColor)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 9, baseColor)
                                ]
                            },
                            (!!instituition?.espaco_configuracao?.empresa_nib) ? {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_nib}`
                                    },
                                    getImage("nib.png", 9, baseColor)
                                ]
                            } : {},
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 9, baseColor)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 9, baseColor)
                                ]
                            },
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
                                        color: baseColor,
                                        text: `RECIBO`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Cliente: `
                                            },
                                            `${cliente?.cliente_titular}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
                                            },
                                            `${(cliente?.cliente_nif || "---------")}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Contacto: `
                                            },
                                            `${cliente?.cliente_contactos?.[0]}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Email: `
                                            },
                                            `${cliente?.cliente_mail || "------"}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Morada: `
                                            },
                                            (cliente?.cliente_metadata?.morada || "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                fontSize: 8,
                                border: [removerLinhaDoCabecalho, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        bold: true,
                                        text: "Nº do Recibo"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text: deposito[0]?.data?.deposito_documento
                                    },
                                    {
                                        columns: [
                                            {
                                                color: '#000000',
                                                width: "50%",
                                                bold: true,
                                                text: "Forma de Pagamento"
                                            },
                                            {
                                                color: '#000000',
                                                bold: true,
                                                width: "50%",
                                                text: "Data de Emissão",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "50%",
                                                text: getTypePayment(deposito[0]?.data?.tpaga_id)
                                            },
                                            {
                                                width: "50%",
                                                text: date,
                                            }
                                        ],
                                    },
                                ]
                            },
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
                    widths: ["20%", "30%", "10%", "20%", "20%"],
                    body: [
                        [
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Documento",
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
                                text: "Data",
                                color: textcolor,
                                alignment: "center"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Valor Doc. STN",
                                color: textcolor,
                                alignment: "center"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Valor Recebido STN",
                                color: textcolor,
                                alignment: "center"
                            }
                        ],
                        ...depositoPagamento
                    ]
                }
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)), textcolor, baseColor, rotape)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        const pdfBuffer = Buffer.from(buffer);
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Recibo-${deposito[0]?.data?.deposito_documento || ""}.pdf`);
        // Send the PDF file in the response
        res.send(pdfBuffer);
    });
}
