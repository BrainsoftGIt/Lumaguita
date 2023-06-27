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
const cluster_service_1 = require("../../../../service/cluster.service");
const project_1 = require("../../../../global/project");
const moment_1 = __importDefault(require("moment"));
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
let create = (instituition, deposito, cliente, res, user, date, num_autorization, serie_numero) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_1.getFonts)();
    let valor_depositado = 0;
    let valor_restante = deposito[0].data.deposito_montantefinal;
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
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
            }
            else {
                deposito_distribuicao = valor_restante;
                valor_restante = 0;
            }
        }
        else {
            if (Number(valor_restante) > Number(dep.debito)) {
                valor_restante = Number(valor_restante) - Number(dep.debito);
                deposito_distribuicao = dep.debito;
            }
            else {
                deposito_distribuicao = valor_restante;
                valor_restante = 0;
            }
        }
        depositoPagamento.push([
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: dep.lancamento_doc
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: "Pagamento de fatura " + dep.lancamento_doc,
                alignment: "center"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: (0, moment_1.default)(dep.lancamento_data).format("DD-MM-YYYY"),
                alignment: "center"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(dep.debito + "") + " STN",
                alignment: "right"
            },
            {
                margin: [0, 7, 0, 5],
                fontSize: 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text: formattedString(deposito_distribuicao + "") + " STN",
                alignment: "right"
            },
        ]);
    });
    let hasPersonalizadoHarder = (((_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.cabecalho_referencia));
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
                                        text: `Cliente`,
                                        bold: true,
                                        fontSize: 14,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Cliente: `
                                            },
                                            `${cliente === null || cliente === void 0 ? void 0 : cliente.cliente_titular}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `NIF: `
                                            },
                                            `${((cliente === null || cliente === void 0 ? void 0 : cliente.cliente_nif) || "---------")}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Contacto: `
                                            },
                                            `${(_j = cliente === null || cliente === void 0 ? void 0 : cliente.cliente_contactos) === null || _j === void 0 ? void 0 : _j[0]}`
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Email: `
                                            },
                                            `${(cliente === null || cliente === void 0 ? void 0 : cliente.cliente_mail) || "------"}`
                                        ]
                                    },
                                ]
                            },
                            {
                                border: [true, false, false, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        color: '#3C0097',
                                        bold: true,
                                        fontSize: 14,
                                        text: "Nº do Recibo"
                                    },
                                    {
                                        text: deposito[0].data.deposito_documento
                                    },
                                    {
                                        columns: [
                                            {
                                                color: '#3C0097',
                                                width: "50%",
                                                bold: true,
                                                text: "Forma de Pagamento"
                                            },
                                            {
                                                color: '#3C0097',
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
                    widths: ["20%", "30%", "10%", "20%", "20%"],
                    body: [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Documento",
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
                                text: "Data",
                                color: "#ffffff",
                                alignment: "center"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Valor Doc.",
                                color: "#ffffff",
                                alignment: "center"
                            },
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Valor Recebido",
                                color: "#ffffff",
                                alignment: "center"
                            }
                        ],
                        ...depositoPagamento
                    ]
                }
            }
        ] }, (0, estruture_1.structure)(user, num_autorization, instituition.espaco_configuracao.certification, (((_k = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _k === void 0 ? void 0 : _k.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_l = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _l === void 0 ? void 0 : _l.cabecalho_referencia))));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Recibo_" + (new Date().getTime() + Math.random()) + ".pdf";
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
//# sourceMappingURL=export-recibo.js.map