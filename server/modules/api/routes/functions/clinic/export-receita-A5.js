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
const estruture_A5_1 = require("./estruture-A5");
const project_1 = require("../../../../../global/project");
const cluster_service_1 = require("../../../../../service/cluster.service");
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
let create = (instituition, res, user, client, utente, tratamento) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const pdfMake = require("../../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../../libs/js/pdfmake/vfs_fonts');
    console.log(utente);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = (0, estruture_A5_1.getFonts)();
    let logoTipo = cluster_service_1.clusterServer.res.resolve((_a = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _a === void 0 ? void 0 : _a.logo_referencia);
    let hasPersonalizadoHarder = (((_b = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _b === void 0 ? void 0 : _b.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.cabecalho_referencia));
    let docDefinition = Object.assign({ compress: true, info: {
            title: 'Receita',
            author: 'Luma',
            subject: 'Impressão de fatura',
            keywords: 'luma, fatura, brainsoft',
        }, content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image: 'data:image/png;base64,' + fs_1.default.readFileSync(logoTipo).toString('base64'),
                        width: 80,
                    } : {}),
                    {
                        fontSize: 9,
                        alignment: "right",
                        stack: [
                            {
                                text: `${(_d = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _d === void 0 ? void 0 : _d.empresa_nome}`,
                                bold: true,
                                fontSize: 11,
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.empresa_nif} `
                                    },
                                    (0, estruture_A5_1.getImage)("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_f = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _f === void 0 ? void 0 : _f.empresa_endereco}`
                                    },
                                    (0, estruture_A5_1.getImage)("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_g = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _g === void 0 ? void 0 : _g.empresa_telef}`
                                    },
                                    (0, estruture_A5_1.getImage)("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin: [0, 0, 10, 0],
                                        text: `${(_h = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _h === void 0 ? void 0 : _h.empresa_email}`
                                    },
                                    (0, estruture_A5_1.getImage)("mail.png", 12)
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
                                fontSize: 9,
                                border: [false, false, true, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        color: '#3C0097',
                                        text: `Receita`,
                                        bold: true,
                                        fontSize: 10,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Cliente: `
                                            },
                                            client.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `NIF: `
                                            },
                                            (client.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Email: `
                                            },
                                            (client.cliente_mail || "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                fontSize: 9,
                                alignment: "right",
                                border: [true, false, false, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 10,
                                        color: '#3C0097',
                                        text: "Utente"
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Nome: `
                                            },
                                            (utente.patient_name || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Codígo: `
                                            },
                                            (((_j = utente.patient_metadata) === null || _j === void 0 ? void 0 : _j.code) || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Raça: `
                                            },
                                            (((_k = utente.patient_metadata) === null || _k === void 0 ? void 0 : _k.raca) || "---------------")
                                        ]
                                    },
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                text: "",
                margin: [0, 25, 0, 5],
            },
            {
                color: '#3C0097',
                fontSize: 10,
                alignment: "center",
                text: "Receituário",
                margin: [0, 25, 0, 20],
            },
            {
                type: 'square',
                ul: (() => {
                    let conteudo = [];
                    tratamento.forEach((_tratamento) => {
                        conteudo.push({ text: _tratamento });
                    });
                    return conteudo;
                })()
            }
        ] }, (0, estruture_A5_1.structure)(user, instituition.espaco_configuracao.certification, (((_l = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _l === void 0 ? void 0 : _l.cabecalho_referencia) === null ? "" : cluster_service_1.clusterServer.res.resolve((_m = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _m === void 0 ? void 0 : _m.cabecalho_referencia))));
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Receita_" + (new Date().getTime() + Math.random()) + ".pdf";
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
//# sourceMappingURL=export-receita-A5.js.map