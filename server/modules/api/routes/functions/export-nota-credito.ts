import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";
import moment from "moment";

export let create = async (instituition, account_content, res, user, date, num_autorization) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigosConta = [];
    let sumImpost = {};
    let subtotal = 0;
    let preco_artigo = 0;

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    (account_content.main.conta_vendas || []).forEach((cont) =>{
        preco_artigo = cont.venda_montantesemimposto/cont.venda_quantidade;
        artigosConta.push([
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont?.artigo_codigo || "---"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : (cont.venda_descricao === null ? cont.artigo_nome : cont.venda_descricao)
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont.venda_quantidade
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : `${formattedString(cont.venda_imposto.toFixed(2))} STN`,
                alignment : "right"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : formattedString(preco_artigo.toFixed(2)+"")+" STN",
                alignment : "right"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : formattedString(cont.venda_montantesemimposto.toFixed(2)+"")+" STN",
                alignment : "right"
            }
        ]);

        if(!!cont.tipoimposto_id) {
            if (!sumImpost[cont.tipoimposto_id]) {
                sumImpost[cont.tipoimposto_id] = {
                    sum: 0,
                    name: cont.tipoimposto_nome
                }
            }

            sumImpost[cont.tipoimposto_id].sum += cont.venda_imposto;
        }

        subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
    });

    let docDefinition = {
        compress: true,
        info: {
            title: 'Fatura',
            author: 'Luma',
            subject: 'Impressão de fatura',
            keywords: 'luma, fatura, brainsoft',
        },
        content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                        width: 120,
                    } : {}),
                    {
                        fontSize : 12,
                        alignment : "right",
                        stack: [
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`,
                                bold: true,
                                fontSize : 16,
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
                lineHeight: 1.3,
                margin: [0, (!hasPersonalizadoHarder) ? 40 : 10, 0, 0],
                layout: {
                    hLineWidth: function (i, node) {
                        return  0.8;
                    },
                    vLineWidth: function (i, node) {
                        return  0.8;
                    },
                },
                table : {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `FATURA`,
                                        bold: true,
                                        fontSize: 20,
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
                                                text: `Email: `
                                            },
                                            (account_content.main.cliente_mail || "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 14,
                                        color : '#000000',
                                        text : "Nº de Nota de Credito"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text : account_content.main.conta_serie.document,
                                    },
                                    {
                                        color : '#000000',
                                        text: "Data de emissâo"
                                    },
                                    {
                                        width: "100%",
                                        text: moment(account_content.main.conta_data).format("DD-MM-YYYY"),
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                text : "",
                margin: [0, 20, 0, 5],
            },
            {
                fontSize : 11,
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
                    widths: ["10%", "39%", "8%", "11%", "14%", "18%"],
                    body : [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Código",
                                color: "#ffffff"
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
                                text: "Qtd",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Taxa",
                                color: "#ffffff",
                                alignment : "right"
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
                                text: "Subtotal",
                                color: "#ffffff",
                                alignment : "right"
                            }
                        ],
                        ...artigosConta,
                        [
                            {
                                border: [false, false, false, false],
                                text : "", colSpan: 4, fillColor : "#ffffff"
                            },
                            {text : ""},
                            {text : ""},
                            {text : ""},
                            {
                                fontSize : 9.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: "Subtotal"
                            },
                            {
                                fontSize : 9.5,
                                border: [false, false, false, false],
                                margin : [0, 7, 0, 5],
                                text: formattedString(subtotal.toFixed(2)+"")+" STN",
                                alignment: "right"
                            },
                        ],
                        ...Object.keys(sumImpost).map((key) => {
                            return [
                                {
                                    border: [false, false, false, false],
                                    text : "", colSpan: 4, fillColor : "#ffffff"
                                },
                                {text : ""},
                                {text : ""},
                                {text : ""},
                                {
                                    fontSize : 9.5,
                                    border: [false, false, false, false],
                                    margin : [0, 7, 0, 5],
                                    text: `${sumImpost[key].name}`,
                                },
                                {
                                    fontSize : 9.5,
                                    border: [false, false, false, false],
                                    margin : [0, 7, 0, 5],
                                    text: formattedString(sumImpost[key].sum.toFixed(2)+"")+" STN",
                                    alignment: "right"
                                }
                            ]
                        }),
                        [
                            {
                                border: [false, false, false, false],
                                text : "", colSpan: 4, fillColor : "#ffffff"
                            },
                            {text : ""},
                            {text : ""},
                            {text : ""},
                            {
                                fontSize : 9.5,
                                border: [false, false, false, false],
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin : [0, 7, 0, 5],
                                bold: true,
                                text: "Total",
                            },
                            {
                                fontSize : 9.5,
                                border: [false, false, false, false],
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin : [0, 7, 0, 5],
                                bold: true,
                                text: formattedString(account_content?.main?.conta_montante.toFixed(2)+"")+" STN",
                                alignment: "right"
                            }
                        ]
                    ]
                }
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "NotaCredito_"+(new Date().getTime()+Math.random())+".pdf";
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
