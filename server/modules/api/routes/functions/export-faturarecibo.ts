import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";

function getTypePayment(tipo_id) {
    if (tipo_id === 1) return "Cash";
    else if (tipo_id === 4) return "Cheque";
    else if (tipo_id === 2) return "Depósito";
    else return "Transferência";
}

export let create = async (instituition, account_content, res, user, date, num_autorization) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigosConta = [];
    let valorTotalImpostos = 0;
    let subtotal = 0;
    let preco_artigo = 0;
    let sumImpost = {};
    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let baseColor = instituition?.espaco_configuracao?.empresa_basecolor || "#000000";
    let textcolor = instituition?.espaco_configuracao?.empresa_textcolor || "#ffffff";

    (account_content[0]?.main?.conta_vendas || []).forEach((cont) => {

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
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.artigo_codigo
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.artigo_nome
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.venda_quantidade
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: `${formattedString(cont.venda_imposto.toFixed(2))} STN`,
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(preco_artigo.toFixed(2) + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(cont.venda_montantesemimposto.toFixed(2) + "") + " STN",
                alignment: "right"
            }
        ]);
        valorTotalImpostos = Number(valorTotalImpostos) + Number(cont.venda_imposto);
        subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
    });
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
                margin: [0, (!hasPersonalizadoHarder) ? 40 : 10, 0, 0],
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
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `FATURA/RECIBO`,
                                        bold: true,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Cliente: `
                                            },
                                            account_content[0].main.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
                                            },
                                            (account_content[0].main.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Morada: `
                                            },
                                            (/*account_content[0].main.cliente_nif ||*/ "---------------")
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
                                        text: "Nº da Fatura"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text: account_content[0].main.conta_serie.document,
                                    },
                                    {
                                        columns: [
                                            {
                                                bold: true,
                                                width: "50%",
                                                color: '#000000',
                                                text: "M. Pagamento"
                                            },
                                            {
                                                bold: true,
                                                width: "50%",
                                                color: '#000000',
                                                text: "Data de emissão",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "50%",
                                                text: getTypePayment(account_content[0].main.deposito_tpaga_id)
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
                    widths: ["10%", "39%", "8%", "11%", "14%", "18%"],
                    body: [
                        [
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Código",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Descrição",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Qtd",
                                color: textcolor
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Taxa",
                                color: textcolor,
                                alignment: "right"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Valor Unit.",
                                color: textcolor,
                                alignment: "right"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: baseColor,
                                text: "Subtotal",
                                color: textcolor,
                                alignment: "right"
                            }
                        ],
                        ...artigosConta,
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
                                margin: [0, 3, 0, 3],
                                text: "Subtotal"
                            },
                            {
                                fontSize: 6.5,
                                border: [false, false, false, false],
                                margin: [0, 3, 0, 3],
                                text: formattedString(subtotal.toFixed(2) + "") + " STN",
                                alignment: "right"
                            },
                        ],
                        ...Object.keys(sumImpost).map((key) => {
                            return [
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
                                    margin: [0, 3, 0, 3],
                                    text: `${sumImpost[key].name}`,
                                },
                                {
                                    fontSize: 6.5,
                                    border: [false, false, false, false],
                                    margin: [0, 3, 0, 3],
                                    text: formattedString(sumImpost[key].sum.toFixed(2) + "") + " STN",
                                    alignment: "right"
                                }
                            ]
                        }),
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 4, fillColor: "#ffffff"
                            },
                            {text: ""},
                            {text: ""},
                            {text: ""},
                            {
                                fontSize: 7.5,
                                border: [false, false, false, false],
                                fillColor: baseColor,
                                color: textcolor,
                                margin: [0, 3, 0, 3],
                                bold: true,
                                text: "Total",
                            },
                            {
                                fontSize: 7.5,
                                border: [false, false, false, false],
                                fillColor: baseColor,
                                color: textcolor,
                                margin: [0, 3, 0, 3],
                                bold: true,
                                text: formattedString(account_content[0]?.main?.conta_montante.toFixed(2) + "") + " STN",
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
                                margin: [0, 3, 0, 3],
                                text: "Valor Pago"
                            },
                            {
                                fontSize: 6.5,
                                border: [false, false, false, false],
                                margin: [0, 3, 0, 3],
                                text: formattedString(account_content[1]?.main?.deposito_montantemoeda.toFixed(2) + "") + " " + account_content[1]?.main.currency_code,
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
                                margin: [0, 3, 0, 3],
                                text: "Troco",
                            },
                            {
                                fontSize: 6.5,
                                border: [false, false, false, false],
                                margin: [0, 3, 0, 3],
                                text: formattedString(account_content[1].main.deposito_montantetroco.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ],
                    ]
                }
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)), textcolor, baseColor)
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FaturaRecibo_" + (new Date().getTime() + Math.random()) + ".pdf";
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
