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
let create = (instituition, caixa, res, user, printer_name) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    caixa = caixa.box_data;
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const { formattedString } = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_talao_1.getFonts)();
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Fecho/Caixa',
            author: 'luma',
            subject: 'Fecho/Caixa',
            keywords: 'luma, caixa, brainsoft',
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
                                        text: "Data de impressão"
                                    },
                                    {
                                        width: "50%",
                                        text: `${caixa.date}`,
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
                                text: `Posto: ${caixa.posto}`
                            },
                            {
                                text: `Valor de abertura: ${formattedString(caixa.valor_abertura + "")} STN`
                            },
                            {
                                text: `Quantidade de cheques: ${caixa.quantidadeCheques}`
                            },
                            {
                                text: `Valor total da venda: ${formattedString(caixa.valorFecho + "")} STN`
                            },
                            {
                                text: `OBS: ${(caixa.obs || "----------")}`
                            },
                        ]
                    },
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
                    }
                ]
            }
        ] }, (0, estruture_talao_1.structure)(user));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "FechoCaixa" + (new Date().getTime() + Math.random()) + ".pdf";
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
//# sourceMappingURL=export-fechocaixa-talao.js.map