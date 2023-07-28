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
const moment_1 = __importDefault(require("moment"));
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
let create = (instituition, fornecedor, guia, artigos, res, user, custo_guia) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_1.getFonts)();
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let artigosEntrada = [];
    let subtotal = 0;
    let total = 0;
    let hasPersonalizadoHarder = (((_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.cabecalho_referencia));
    artigos.forEach((art) => {
        art = art.data.data;
        artigosEntrada.push([
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: art.artigo_codigo || "----"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: art.entrada_descricao
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: art.entrada_lote || "----"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: art.entrada_quantidade
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(art.entrada_custounitario + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString((Number(art.entrada_quantidade) * Number(art.entrada_custounitario)) + "") + " STN",
                alignment: "right"
            }
        ]);
        subtotal = Number(subtotal) + (Number(art.entrada_quantidade) * Number(art.entrada_custounitario));
    });
    if (custo_guia.length === 0)
        total = subtotal;
    else {
        total = Number(custo_guia[0].data.data.custoguia_montante) + Number(subtotal);
    }
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Guia de Entrada',
            author: 'luma',
            subject: 'Guia',
            keywords: 'luma, entrada, brainsoft',
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
                                text: `${(_d = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _d === void 0 ? void 0 : _d.empresa_nome}`,
                                bold: true,
                                fontSize: 16,
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.empresa_nif} `
                                    },
                                    (0, estruture_1.getImage)("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_f = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _f === void 0 ? void 0 : _f.empresa_endereco}`
                                    },
                                    (0, estruture_1.getImage)("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_g = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _g === void 0 ? void 0 : _g.empresa_telef}`
                                    },
                                    (0, estruture_1.getImage)("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_h = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _h === void 0 ? void 0 : _h.empresa_email}`
                                    },
                                    (0, estruture_1.getImage)("mail.png", 12)
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
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `Fornecedor`,
                                        bold: true,
                                        fontSize: 15,
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
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 20,
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
                                                width: "33.333333333%",
                                                color: '#000000',
                                                text: "Data de Guia"
                                            },
                                            {
                                                bold: true,
                                                width: "33.333333333%",
                                                color: '#000000',
                                                text: "Nº de Documento",
                                            },
                                            {
                                                bold: true,
                                                width: "33.333333333%",
                                                color: '#000000',
                                                text: "Data de Doc. Fornecedor",
                                            }
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                width: "33.333333333%",
                                                text: `${((0, moment_1.default)(guia.guia_date).format("DD-MM-YYYY"))}`
                                            },
                                            {
                                                width: "33.333333333%",
                                                text: `${(guia.guia_documentoperacao || "---------")}`
                                            },
                                            {
                                                width: "33.333333333%",
                                                text: `${(0, moment_1.default)(guia.guia_dataoperacao).format("DD-MM-YYYY")}`,
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
                    widths: ["10%", "33%", "11%", "8%", "17%", "21%"],
                    body: [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                color: "#ffffff",
                                fillColor: '#000000',
                                text: "Código"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Lote",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Qtd",
                                color: "#ffffff"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor Unit.",
                                color: "#ffffff",
                                alignment: "right"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Valor",
                                color: "#ffffff",
                                alignment: "right"
                            }
                        ],
                        ...artigosEntrada,
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
                                text: "Seguro e tarifas de transporte",
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                margin: [0, 7, 0, 5],
                                text: (custo_guia.length === 0 ? "" : formattedString(custo_guia[0].data.data.custoguia_montante.toFixed(2) + "") + " STN"),
                                alignment: "right"
                            }
                        ],
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
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin: [0, 7, 0, 5],
                                bold: true,
                                text: "Total",
                            },
                            {
                                fontSize: 9.5,
                                border: [false, false, false, false],
                                fillColor: "#000000",
                                color: "#ffffff",
                                margin: [0, 7, 0, 5],
                                bold: true,
                                text: formattedString(total.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ]
                    ]
                }
            }
        ] }, (0, estruture_1.structure)(user, null, instituition.espaco_configuracao.certification, (((_j = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _j === void 0 ? void 0 : _j.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_k = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _k === void 0 ? void 0 : _k.cabecalho_referencia))));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Guia de Entrada -" + (new Date().getTime() + Math.random()) + ".pdf";
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
//# sourceMappingURL=export-guia.js.map