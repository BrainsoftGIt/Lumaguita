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
exports.getFonts = exports.getImage = exports.structure = exports.photoResize = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
let photoResize = (pathPhoto, resize = 90) => __awaiter(void 0, void 0, void 0, function* () {
    pathPhoto = path_1.default.resolve(__dirname, pathPhoto);
    if (fs_1.default.existsSync(pathPhoto)) {
        try {
            return (yield (0, sharp_1.default)(pathPhoto)
                .rotate()
                .resize(resize)
                .png()
                .toBuffer()).toString('base64');
        }
        catch (e) {
            console.log(e);
        }
    }
    return null;
});
exports.photoResize = photoResize;
let structure = (user, num_certification, imageCabecalho = "") => {
    let footerSystem = "";
    return {
        pageSize: "A5",
        pageMargins: [35, (imageCabecalho ? 90 : 50), 35, 45],
        background: function (page) {
            return [];
        },
        header: function (currentPage, pageCount, pageSize) {
            let file = path_1.default.resolve(__dirname, imageCabecalho);
            return [
                imageCabecalho ? {
                    alignment: 'center',
                    image: 'data:image/png;base64,' + fs_1.default.readFileSync(file).toString('base64'),
                    width: 594,
                } : {}
            ];
        },
        footer: function (currentPage, pageCount) {
            return [
                {
                    lineHeight: 1.3,
                    fontSize: 9,
                    margin: [30, 0, 35, 0],
                    stack: [
                        {
                            color: "#3C0097",
                            columns: [
                                {
                                    width: "60%",
                                    text: `${user} | Processado pelo software Luma`
                                },
                                {
                                    width: "40%",
                                    text: `${currentPage}/${pageCount}`,
                                    alignment: "right"
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    fontSize: 8,
                                    width: "100%",
                                    text: `${footerSystem}`
                                }
                            ],
                        }
                    ],
                    relativePosition: {
                        x: 0,
                        y: 5,
                    }
                },
                {
                    canvas: [
                        { type: 'rect', x: 30, y: 0, w: 360, h: 1.2, color: '#0a0a0a', lineColor: '#ffffff', r: 5 },
                    ],
                },
            ];
        },
    };
};
exports.structure = structure;
let getImage = (pathFile, width = 10) => {
    let file = path_1.default.resolve(__dirname, `../../../../../resources/pdfs/${pathFile}`);
    return {
        image: 'data:image/png;base64,' + fs_1.default.readFileSync(file).toString('base64'),
        width: width,
    };
};
exports.getImage = getImage;
let getFonts = () => {
    return {
        BellMT: {
            normal: 'BellMT.ttf',
            bold: 'BellMTBold.ttf',
            italics: 'BellMTItalic.ttf',
            bolditalics: 'BellMTFett.ttf'
        },
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        },
        Comic: {
            normal: 'comic.ttf',
            bold: 'comicbd.ttf',
            italics: 'comici.ttf',
            bolditalics: 'comicz.ttf'
        },
        NimbusRomanno9l: {
            normal: 'NimbusRomNo9L-Reg.otf',
            bold: 'NimbusRomNo9L-Med.otf',
            italics: 'NimbusRomNo9L-RegIta.otf',
            bolditalics: 'NimbusRomNo9L-MedIta.otf'
        },
        Times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesbi.ttf',
            bolditalics: 'timesi.ttf'
        }
    };
};
exports.getFonts = getFonts;
//# sourceMappingURL=estruture-A5.js.map