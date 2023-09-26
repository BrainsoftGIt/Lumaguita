import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import moment from "moment";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";
import {formattedString} from "./formatValue";

export let create = async (instituition, account, account_content, res, user, date, num_autorization) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigosConta = [];
    // let valorTotalImpostos = 0;
    let subtotal = 0;
    let preco_artigo = 0;
    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";

    console.log(account)

    let sumImpost = {};
    console.log({conta_vendas: JSON.stringify(account_content?.main?.conta_vendas)});
    (account_content?.main?.conta_vendas || []).forEach((cont) => {
        if (!!cont.tipoimposto_id) {
            if (!sumImpost[cont.tipoimposto_id]) {
                sumImpost[cont.tipoimposto_id] = {
                    sum: 0,
                    name: cont.tipoimposto_nome
                }
            }

            sumImpost[cont.tipoimposto_id].sum += cont.venda_imposto;
        }

        preco_artigo = cont.venda_montantesemimposto / cont.venda_quantidade;
        artigosConta.push([
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont?.unit_code || "----"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont?.artigo_codigo || "----"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont?.venda_descricao || "----"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: cont?.venda_quantidade || "---"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: `${formattedString(cont.venda_imposto.toFixed(2))} STN`,
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString(preco_artigo.toFixed(2) + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                border: [false, false, false, false],
                text: formattedString(cont.venda_montantesemimposto.toFixed(2) + "") + " STN",
                alignment: "right"
            }
        ]);
        subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
    });

    let rotape = {
        margin: [30, 0, 30, 0],
        table: {
            widths: ["100%"],
            body: [
                [
                    {
                        border: [false, false, false, false],
                        fillColor: baseColor,
                        color: textcolor,
                        columns: [
                            {
                                alignment: "center",
                                fontSize: 6.5,
                                margin: [0, 1, 0, 1],
                                text: "Subtotal",
                                bold: true
                            },
                            ...Object.keys(sumImpost).map((key) => {
                                return {
                                    bold: true,
                                    alignment: "center",
                                    fontSize: 6.5,
                                    margin: [0, 1, 0, 1],
                                    text: `${sumImpost[key].name}`,
                                }
                            }),
                            {
                                alignment: "center",
                                fontSize: 7.5,
                                margin: [0, 1, 0, 1],
                                bold: true,
                                text: "Total",
                            }
                        ]
                    }
                ],
                [
                    {
                        border: [false, false, false, false],
                        fillColor: "#F5F6F6",
                        columns: [
                            {
                                fontSize: 6.5,
                                margin: [0, 1, 0, 1],
                                text: formattedString(subtotal.toFixed(2) + ""),
                                alignment: "center"
                            },
                            ...Object.keys(sumImpost).map((key) => {
                                return {
                                    fontSize: 6.5,
                                    margin: [0, 1, 0, 1],
                                    text: formattedString(sumImpost[key].sum.toFixed(2) + ""),
                                    alignment: "center"
                                }
                            }),
                            {
                                alignment: "center",
                                fontSize: 6.5,
                                margin: [0, 1, 0, 1],
                                text: formattedString(account_content.main.conta_montante.toFixed(2) + ""),
                            }
                        ]
                    }
                ]
            ]
        }
    };

    let docDefinition = {
        compress: true,
        info: {
            title: 'Fatura ProForma',
            author: 'Luma',
            subject: 'Fatura ProForma',
            keywords: 'luma, proforma, brainsoft',
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
                // font: "NimbusRomanno9l",
                lineHeight: 1.3,
                margin: [0, (!hasPersonalizadoHarder) ? 40 : 10, 0, 0],
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
                                        text: `FATURA PROFORMA`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Cliente: `
                                            },
                                            account?.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
                                            },
                                            (account?.cliente_nif || "---------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Contacto: `
                                            },
                                            account?.cliente_contacto
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Email: `
                                            },
                                            (account?.cliente_email || "---------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Morada: `
                                            },
                                            (account?.cliente_metadata?.morada || "---------")
                                        ]
                                    }
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
                                        text: "Nº de Fatura"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text: account_content?.main?.conta_numero,
                                    },
                                    {
                                        columns: [
                                            {
                                                bold: true,
                                                width: "50%",
                                                color: '#000000',
                                                text: "Data de emissão"
                                            },
                                            {
                                                bold: true,
                                                width: "50%",
                                                color: '#000000',
                                                text: "Data de vencimento",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "50%",
                                                text: (account.conta_proformaextras.data_emissao === null ? date : moment(account.conta_proformaextras.data_emissao).format("DD-MM-YYYY"))
                                            },
                                            {
                                                width: "50%",
                                                text: `${(!account?.conta_proformavencimento ? "---------" : moment(account?.conta_proformavencimento).format("DD-MM-YYYY"))}`,
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
                    widths: ["8%", "10%", "35%", "7%", "10%", "13%", "17%"],
                    body: [
                        [
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
                                text: "Qtd",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: [baseColor, baseColor, baseColor, baseColor],
                                fillColor: baseColor,
                                text: "Taxa",
                                color: textcolor,
                                alignment: "right"
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
                                text: "Subtotal STN",
                                color: textcolor,
                                alignment: "right"
                            }
                        ],
                        ...artigosConta
                    ]
                }
            },
            (account?.conta_proformaextras?.termos !== null ? {
                fontSize: 8,
                lineHeight: 1.5,
                margin: [0, 10, 0, 0],
                text: account?.conta_proformaextras.termos
            } : {})
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)), textcolor, baseColor, rotape)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Proforma_" + (new Date().getTime() + Math.random()) + ".pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/' + filename), buffer, function (err) {
            if (err) return console.log(err);
            if (res) {
                res.download(path.join(folders.temp, 'multer') + "/" + filename, filename, function () {
                    fs.unlinkSync(path.join(folders.temp, 'multer') + "/" + filename);
                });
            }
        });
    });
}
