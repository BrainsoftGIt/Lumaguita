import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {clusterServer} from "../../../../service/cluster.service";
import {folders} from "../../../../global/project";
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
    let valor_restante = deposito[0].data.deposito_montantefinal;
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let depositoPagamento = [];
    let deposito_distribuicao = 0;
    let preview = 0;
    let pendente = 0;
    let faturas_deposito = deposito.filter(dep => dep.data.lancamento_doc !== undefined);
    const moeda = deposito[0].data.currency_code;

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
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: dep.lancamento_doc
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: "Pagamento de fatura " + dep.lancamento_doc,
                alignment: "center"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: moment(dep.lancamento_data).format("DD-MM-YYYY"),
                alignment: "center"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(dep.debito + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 3, 0, 3],
                fontSize: 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(deposito_distribuicao + "") + " STN",
                alignment: "right"
            },
        ]);
    });

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
                                        text: `Cliente`,
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
                                ]
                            },
                            {
                                fontSize: 8,
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        bold: true,
                                        text: "Nº do Recibo"
                                    },
                                    {
                                        text: deposito[0].data.deposito_documento
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
                                                text: getTypePayment(deposito[0].data.tpaga_id)
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
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Documento",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Data",
                                color: "#ffffff",
                                alignment: "center"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor Doc.",
                                color: "#ffffff",
                                alignment: "center"
                            },
                            {
                                margin: [0, 3, 0, 3],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor Recebido",
                                color: "#ffffff",
                                alignment: "center"
                            }
                        ],
                        ...depositoPagamento
                    ]
                }
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Recibo_" + (new Date().getTime() + Math.random()) + ".pdf";
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
