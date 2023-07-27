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
// structure.footer()
let create = (instituition, account_content, res, user, date, num_autorization) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_1.getFonts)();
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let artigosConta = [];
    let subtotal = 0;
    let preco_artigo = 0;
    let sumImpost = {};
    (((_b = account_content === null || account_content === void 0 ? void 0 : account_content.main) === null || _b === void 0 ? void 0 : _b.conta_vendas) || []).forEach((cont) => {
        if (!!cont.tipoimposto_id) {
            if (!sumImpost[cont.tipoimposto_id]) {
                sumImpost[cont.tipoimposto_id] = {
                    sum: 0,
                    name: cont.tipoimposto_nome
                };
            }
            sumImpost[cont.tipoimposto_id].sum += cont.venda_imposto;
        }
        preco_artigo = cont.venda_montantesemimposto / cont.venda_quantidade;
        artigosConta.push([
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: (cont === null || cont === void 0 ? void 0 : cont.artigo_codigo) || "---"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: (cont === null || cont === void 0 ? void 0 : cont.artigo_nome) || "---"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: (cont === null || cont === void 0 ? void 0 : cont.venda_quantidade) || "----"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: `${formattedString(cont.venda_imposto.toFixed(2))} STN`,
                alignment: "right"
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
                text: formattedString(cont.venda_montantesemimposto.toFixed(2) + "") + " STN",
                alignment: "right"
            }
        ]);
        subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
    });
    let hasPersonalizadoHarder = (((_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_d = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _d === void 0 ? void 0 : _d.cabecalho_referencia));
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Conta',
            author: 'Luma',
            subject: 'Impressão de conta',
            keywords: 'luma, conta, brainsoft',
        }, content: [
            (!hasPersonalizadoHarder) ? {
                // font: "NimbusRomanno9l",
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
                                text: `${(_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.empresa_nome}`,
                                bold: true,
                                fontSize: 16,
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_f = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _f === void 0 ? void 0 : _f.empresa_nif} `
                                    },
                                    (0, estruture_1.getImage)("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_g = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _g === void 0 ? void 0 : _g.empresa_endereco}`
                                    },
                                    (0, estruture_1.getImage)("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_h = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _h === void 0 ? void 0 : _h.empresa_telef}`
                                    },
                                    (0, estruture_1.getImage)("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_j = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _j === void 0 ? void 0 : _j.empresa_email}`
                                    },
                                    (0, estruture_1.getImage)("mail.png", 12)
                                ]
                            },
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
                                        bold: true,
                                        fontSize: 16,
                                        text: "CONTA",
                                        color: "#3C0097"
                                    },
                                    {
                                        columns: [
                                            {
                                                bold: true,
                                                text: "Data de emissão"
                                            },
                                            {
                                                text: date,
                                                alignment: "right"
                                            }
                                        ],
                                    }
                                ]
                            }
                        ],
                    ]
                }
            },
            {
                // font: "NimbusRomanno9l",
                margin: [0, 30, 0, 5],
                text: ""
            },
            {
                // Código | Descrição | Lote | Qtd. | Valor Unit. | Valor
                // font: "NimbusRomanno9l", 2021CódigoDescriçãoLoteQtd
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
                    widths: ["10%", "39%", "8%", "11%", "14%", "18%"],
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
                                text: "Taxa",
                                color: "#ffffff",
                                alignment: "right"
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
                                text: "Subtotal",
                                color: "#ffffff",
                                alignment: "right"
                            }
                        ],
                        ...artigosConta,
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 4, fillColor: "#ffffff"
                            },
                            { text: "" },
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
                        ...Object.keys(sumImpost).map((key) => {
                            return [
                                {
                                    border: [false, false, false, false],
                                    text: "", colSpan: 4, fillColor: "#ffffff"
                                },
                                { text: "" },
                                { text: "" },
                                { text: "" },
                                {
                                    fontSize: 9.5,
                                    border: [false, false, false, false],
                                    margin: [0, 7, 0, 5],
                                    text: `${sumImpost[key].name}`,
                                },
                                {
                                    fontSize: 9.5,
                                    border: [false, false, false, false],
                                    margin: [0, 7, 0, 5],
                                    text: formattedString(sumImpost[key].sum.toFixed(2) + "") + " STN",
                                    alignment: "right"
                                }
                            ];
                        }),
                        [
                            {
                                border: [false, false, false, false],
                                text: "", colSpan: 4, fillColor: "#ffffff"
                            },
                            { text: "" },
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
                                text: formattedString(account_content.main.conta_montante.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ]
                    ]
                }
            }
        ] }, (0, estruture_1.structure)(user, num_autorization, instituition.espaco_configuracao.certification, (((_k = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _k === void 0 ? void 0 : _k.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_l = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _l === void 0 ? void 0 : _l.cabecalho_referencia))));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Conta" + new Date().getTime() + ".pdf";
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
//# sourceMappingURL=export-conta.js.map