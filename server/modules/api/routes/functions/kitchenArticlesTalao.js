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
let create = (instituition, articles, res, date, table, obs) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_talao_1.getFonts)();
    let docDefinition = Object.assign({ compress: true, info: {
            title: '',
            author: 'luma',
            subject: 'Impressão na cozinha',
            keywords: 'luma, cozinha, brainsoft',
        }, content: [
            {
                lineHeight: 1,
                columns: [
                    {
                        style: "grande",
                        alignment: "center",
                        stack: [
                            {
                                text: `${(_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.empresa_nome}`
                            },
                            {
                                text: `${(_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.empresa_endereco}`
                            },
                            {
                                text: `Cont: ${(_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.empresa_telef}`
                            },
                            {
                                text: `NIF: ${(_d = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _d === void 0 ? void 0 : _d.empresa_nif} `
                            },
                            {
                                text: `Email: ${(_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.empresa_email}`
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
                                        text: "CONTA/MESA"
                                    },
                                    {
                                        width: "50%",
                                        text: table,
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
                columns: []
            },
            {
                lineHeight: 1,
                style: "bold",
                margin: [0, 10, 0, 0],
                stack: [
                    {
                        columns: [
                            { text: "Artigos", bold: true },
                            {
                                text: "Quantidade",
                                alignment: "right",
                                bold: true
                            },
                        ]
                    },
                    {
                        canvas: [{ type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5 }],
                        margin: [0, 3, 0, 2],
                    }
                ]
            },
            ...(() => {
                return articles.map((art) => {
                    return {
                        lineHeight: 1,
                        style: "normal",
                        stack: [
                            {
                                columns: [
                                    {
                                        margin: [0, 5, 0, 5],
                                        text: art.artigo_nome
                                    },
                                    {
                                        margin: [0, 5, 0, 5],
                                        text: art.venda_quantidade + " unt.",
                                        alignment: "right"
                                    }
                                ]
                            },
                            {
                                canvas: [{ type: 'rect', x: -3, y: 0, w: 195, h: 0, dash: { length: 9 }, lineWidth: 0.5 }],
                                margin: [0, 2, 0, 2],
                            }
                        ]
                    };
                });
            })(),
            (obs !== null ? {
                margin: [0, 20, 0, 0],
                stack: [
                    {
                        style: "normal",
                        fontSize: 8,
                        bold: true,
                        text: "Observação"
                    },
                    {
                        style: "normal",
                        bold: false,
                        text: obs
                    }
                ]
            } : {})
        ] }, (0, estruture_talao_1.structure)(null));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Kitchen" + (new Date().getTime() + Math.random()) + ".pdf";
        const printerName = instituition.espaco_configuracao.impressoras_cozinha.nome;
        fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
        fs_1.default.writeFile(path_1.default.join(project_1.folders.temp, 'multer/' + filename), buffer, function (err) {
            if (err)
                return console.log(err);
            else {
                (0, printer_1.print)(printerName, path_1.default.resolve(path_1.default.join(project_1.folders.temp, 'multer/' + filename)));
                res.json("done");
            }
        });
    });
});
exports.create = create;
//# sourceMappingURL=kitchenArticlesTalao.js.map