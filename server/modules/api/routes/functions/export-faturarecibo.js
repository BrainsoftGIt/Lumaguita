"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const estruture_1 = require("./estruture");
const project_1 = require("../../../../global/project");
const cluster_service_1 = require("../../../../service/cluster.service");
let getValueInList = (list, value, { nameLists, keyId, keyValue }) => {
    var _a;
    let rt;
    for (let i = 0; i < nameLists.length; i++) {
        let nameList = nameLists[i];
        rt = ((_a = list[nameList].find((data) => { return (data[keyId] + "") === (value + ""); })) === null || _a === void 0 ? void 0 : _a[keyValue]) || rt;
        if (rt) {
            break;
        }
    }
    return rt;
};
function getTypePayment(tipo_id) {
    if (tipo_id === 1)
        return "Cash";
    else if (tipo_id === 4)
        return "Cheque";
    else if (tipo_id === 2)
        return "Depósito";
    else
        return "Transferência";
}
let create = (instituition, account_content, res, user, date, num_autorization) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_1.getFonts)();
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let artigosConta = [];
    let valorTotalImpostos = 0;
    let subtotal = 0;
    let preco_artigo = 0;
    let hasPersonalizadoHarder = (((_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.cabecalho_referencia));
    (((_e = (_d = account_content[0]) === null || _d === void 0 ? void 0 : _d.main) === null || _e === void 0 ? void 0 : _e.conta_vendas) || []).forEach((cont) => {
        preco_artigo = cont.venda_montantesemimposto / cont.venda_quantidade;
        artigosConta.push([
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.artigo_codigo
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.artigo_nome
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: cont.venda_quantidade
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(preco_artigo.toFixed(2) + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString((Number(cont === null || cont === void 0 ? void 0 : cont.venda_quantidade) * Number(preco_artigo.toFixed(2))) + "") + " STN",
                alignment: "right"
            }
        ]);
        valorTotalImpostos = Number(valorTotalImpostos) + Number(cont.venda_imposto);
        subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
    });
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Fatura/Recibo',
            author: 'maguita',
            subject: 'Fatura/Recibo',
            keywords: 'maguita, fatura, recibo, brainsoft',
        }, content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image: 'data:image/png;base64,' + fs_1.default.readFileSync(logoTipo).toString('base64'),
                        width: 120,
                    } : {}),
                    {
                        fontSize: 12,
                        alignment: "right",
                        stack: [
                            {
                                text: `${(_f = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _f === void 0 ? void 0 : _f.empresa_nome}`,
                                bold: true,
                                fontSize: 16,
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_g = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _g === void 0 ? void 0 : _g.empresa_nif} `
                                    },
                                    (0, estruture_1.getImage)("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_h = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _h === void 0 ? void 0 : _h.empresa_endereco}`
                                    },
                                    (0, estruture_1.getImage)("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_j = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _j === void 0 ? void 0 : _j.empresa_telef}`
                                    },
                                    (0, estruture_1.getImage)("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_k = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _k === void 0 ? void 0 : _k.empresa_email}`
                                    },
                                    (0, estruture_1.getImage)("mail.png", 12)
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
                                border: [false, false, true, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        color: '#3C0097',
                                        text: `FATURA/RECIBO`,
                                        bold: true,
                                        fontSize: 20,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Cliente: `
                                            },
                                            account_content[0].main.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `NIF: `
                                            },
                                            (account_content[0].main.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Morada: `
                                            },
                                            ( /*account_content[0].main.cliente_nif ||*/"---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                border: [true, false, false, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 14,
                                        color: '#3C0097',
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
                                                color: '#3C0097',
                                                text: "M. Pagamento"
                                            },
                                            {
                                                bold: true,
                                                width: "50%",
                                                color: '#3C0097',
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
                fontSize: 11,
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
                    widths: ["10%", "44%", "8%", "17%", "21%"],
                    body: [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Código",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Qtd",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Valor Unit.",
                                color: "#ffffff",
                                alignment: "right"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Valor",
                                color: "#ffffff",
                                alignment: "right"
                            }
                        ],
                        ...artigosConta,
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 3, fillColor: "#ffffff"
                            },
                            { text: "" },
                            { text: "" },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: "Valor Pago"
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: formattedString(((_m = (_l = account_content[1]) === null || _l === void 0 ? void 0 : _l.main) === null || _m === void 0 ? void 0 : _m.deposito_montantemoeda.toFixed(2)) + "") + " " + ((_o = account_content[1]) === null || _o === void 0 ? void 0 : _o.main.currency_code),
                                alignment: "right"
                            },
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 3, fillColor: "#ffffff"
                            },
                            { text: "" },
                            { text: "" },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: "Troco",
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: formattedString(account_content[1].main.deposito_montantetroco.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 3, fillColor: "#ffffff"
                            },
                            { text: "" },
                            { text: "" },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: "Subtotal"
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: formattedString(subtotal.toFixed(2) + "") + " STN",
                                alignment: "right"
                            },
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 3, fillColor: "#ffffff"
                            },
                            { text: "" },
                            { text: "" },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: "Imposto"
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: formattedString(valorTotalImpostos.toFixed(2) + "") + " STN",
                                alignment: "right"
                            },
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 3, fillColor: "#ffffff"
                            },
                            { text: "" },
                            { text: "" },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                fillColor: "#3C0097",
                                color: "#ffffff",
                                margin: [0, 7, 0, 5],
                                bold: true,
                                text: "Total",
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                fillColor: "#3C0097",
                                color: "#ffffff",
                                margin: [0, 7, 0, 5],
                                bold: true,
                                text: formattedString(((_q = (_p = account_content[0]) === null || _p === void 0 ? void 0 : _p.main) === null || _q === void 0 ? void 0 : _q.conta_montante.toFixed(2)) + "") + " STN",
                                alignment: "right"
                            }
                        ]
                    ]
                }
            }
        ] }, (0, estruture_1.structure)(user, num_autorization, instituition.espaco_configuracao.certification, (((_r = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _r === void 0 ? void 0 : _r.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_s = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _s === void 0 ? void 0 : _s.cabecalho_referencia))));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FaturaRecibo_" + (new Date().getTime() + Math.random()) + ".pdf";
        fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
        fs_1.default.writeFile(path_1.default.join(project_1.folders.temp, 'multer/' + filename), buffer, function (err) {
            if (err)
                return console.log(err);
            if (res) {
                res.download(path_1.default.join(project_1.folders.temp, 'multer') + "/" + filename, filename, function () {
                    fs_1.default.unlinkSync(path_1.default.join(project_1.folders.temp, 'multer') + "/" + filename);
                });
            }
        });
    });
});
exports.create = create;
//# sourceMappingURL=export-faturarecibo.js.map