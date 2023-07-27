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
const estruture_talao_1 = require("./estruture-talao");
const project_1 = require("../../../../global/project");
const printer_1 = require("./printer");
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
let create = (instituition, account_content, res, user, date, printer_name, num_autorization) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_talao_1.getFonts)();
    let subtotal = 0;
    let footerSystem;
    let preco_artigo = 0;
    if (num_autorization !== null && instituition.espaco_configuracao.certification !== null)
        footerSystem = "Documento emitido por sistema informático com o nº de autorização " + num_autorization + " e de certificado " + num_autorization;
    else if (num_autorization === null && instituition.espaco_configuracao.certification !== null)
        footerSystem = "Documento emitido por sistema informático com o nº de certificado " + instituition.espaco_configuracao.certification;
    else
        footerSystem = "Documento emitido por sistema informático com o nº de autorização " + num_autorization;
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let sumImpost = {};
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Fatura',
            author: 'maguita',
            subject: 'Fatura',
            keywords: 'luma, fatura, recibo, brainsoft',
        }, content: [
            {
                lineHeight: 1,
                columns: [
                    {
                        style: "grande",
                        alignment: "center",
                        stack: [
                            (logoTipo && (instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao.logo_talao) ? {
                                margin: [0, 10, 0, 5],
                                image: 'data:image/png;base64,' + fs_1.default.readFileSync(logoTipo).toString('base64'),
                                width: 50,
                            } : {}),
                            {
                                style: "bold",
                                text: `${(_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.empresa_nome}`
                            },
                            {
                                text: `${(_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.empresa_endereco}`
                            },
                            {
                                text: `Cont: ${(_d = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _d === void 0 ? void 0 : _d.empresa_telef}`
                            },
                            {
                                text: `NIF: ${(_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.empresa_nif} `
                            },
                            {
                                text: `Email: ${(_f = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _f === void 0 ? void 0 : _f.empresa_email}`
                            },
                        ]
                    }
                ]
            },
            {
                lineHeight: 1,
                style: "normal",
                margin: [0, 8, 0, 0],
                columns: [
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        width: "50%",
                                        bold: false,
                                        text: "FATURA"
                                    },
                                    {
                                        width: "50%",
                                        text: account_content.main.conta_serie.document,
                                        alignment: "right"
                                    }
                                ],
                            },
                            {
                                columns: [
                                    {
                                        width: "50%",
                                        bold: false,
                                        text: "Data de Emissâo"
                                    },
                                    {
                                        width: "50%",
                                        text: date,
                                        alignment: "right"
                                    }
                                ],
                            },
                        ]
                    },
                ]
            },
            {
                lineHeight: 1,
                style: "normal",
                margin: [0, 8, 0, 0],
                columns: [
                    {
                        stack: [
                            {
                                text: `NIF: ${(((_g = account_content === null || account_content === void 0 ? void 0 : account_content.main) === null || _g === void 0 ? void 0 : _g.cliente_nif) || "---------------")}`
                            },
                            {
                                text: `Nome: ${(_h = account_content === null || account_content === void 0 ? void 0 : account_content.main) === null || _h === void 0 ? void 0 : _h.cliente_titular}`
                            },
                        ]
                    },
                ]
            },
            {
                lineHeight: 1,
                style: "bold",
                margin: [0, 10, 0, 0],
                stack: [
                    { text: "Descrição" },
                    {
                        columns: [
                            { text: "Qtd. x Preço - Taxa" },
                            {
                                text: "Subtotal",
                                alignment: "right",
                            },
                        ]
                    },
                    {
                        alignment: "center",
                        canvas: [{ type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5 }],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                var _a;
                return (((_a = account_content === null || account_content === void 0 ? void 0 : account_content.main) === null || _a === void 0 ? void 0 : _a.conta_vendas) || []).map((cont) => {
                    if (!!cont.tipoimposto_id) {
                        if (!sumImpost[cont.tipoimposto_id]) {
                            sumImpost[cont.tipoimposto_id] = {
                                sum: 0,
                                name: cont.tipoimposto_nome
                            };
                        }
                        sumImpost[cont.tipoimposto_id].sum += cont.venda_imposto;
                    }
                    subtotal = Number(subtotal) + Number(cont.venda_montantesemimposto);
                    preco_artigo = cont.venda_montantesemimposto / cont.venda_quantidade;
                    return {
                        lineHeight: 1,
                        style: "normal",
                        stack: [
                            { text: (cont.venda_descricao === null ? cont.artigo_nome : cont.venda_descricao) },
                            {
                                columns: [
                                    { text: `${cont.venda_quantidade} x ${formattedString(preco_artigo.toFixed(2)) + " STN"} - ${formattedString(cont.venda_imposto.toFixed(2))}` },
                                    {
                                        text: formattedString(cont.venda_montantesemimposto.toFixed(2) + "") + " STN",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                alignment: "center",
                                canvas: [{ type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5 }],
                                margin: [0, 2, 0, 2],
                            }
                        ]
                    };
                });
            })(),
            {
                margin: [0, 6, 0, 0],
                style: "normal",
                stack: [
                    {
                        columns: [
                            {
                                text: "Subtotal",
                            },
                            {
                                text: formattedString(subtotal.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ]
                    },
                    ...Object.keys(sumImpost).map((key) => {
                        return {
                            columns: [
                                {
                                    text: `${sumImpost[key].name}`
                                },
                                {
                                    text: formattedString(sumImpost[key].sum.toFixed(2) + "") + " STN",
                                    alignment: "right"
                                }
                            ],
                        };
                    }),
                    {
                        columns: [
                            {
                                text: "Total",
                            },
                            {
                                text: formattedString(account_content.main.conta_montante.toFixed(2) + "") + " STN",
                                alignment: "right"
                            }
                        ]
                    }
                ]
            },
            {
                margin: [0, 6, 0, 0],
                style: "pequena",
                stack: [
                    {
                        text: "Processado pelo software Luma",
                    },
                    {
                        text: `Operador(a): ${user}`,
                    },
                    {
                        text: "Obrigado pela preferência",
                    },
                    {
                        text: footerSystem
                    }
                ]
            }
        ] }, (0, estruture_talao_1.structure)(user));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FaturaTalao_" + (new Date().getTime() + Math.random()) + ".pdf";
        fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
        fs_1.default.writeFile(path_1.default.join(project_1.folders.temp, 'multer/' + filename), buffer, function (err) {
            if (err)
                return console.log(err);
            else {
                (0, printer_1.print)(printer_name, path_1.default.resolve(path_1.default.join(project_1.folders.temp, 'multer/' + filename)));
                res.json("done");
            }
        });
    });
});
exports.create = create;
//# sourceMappingURL=export-fatura-talao.js.map