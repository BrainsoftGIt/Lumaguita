import fs from "fs";
import path from "path";

import sharp from 'sharp';
export let photoResize = async (pathPhoto, resize = 90) => {
    pathPhoto = path.resolve(__dirname, pathPhoto)
    if (fs.existsSync(pathPhoto)) {
        try {
            return (await sharp(pathPhoto)
                .rotate()
                .resize(resize)
                .png()
                .toBuffer()).toString('base64');
        }catch (e) {
            console.log(e)
        }
    }
    return null
}

export let structure = (user) => {
    return {
        styles: {
            pequena: {
                fontSize: 6.8,
                alignment : "center",
                lineHeight: 1.2
            },
            normal: {
                fontSize: 8
            },
            grande: {
                fontSize: 8.5,
                bold: true,
            },
            bold: {
                fontSize: 8,
                bold: true,
            },
        },
        pageMargins: [ 20, 0, 20, 0 ],
        pageSize: {
            width : 226.772,
            height: 595 * 2
        },
        background: function (page) {
            return []
        },
        header: function(currentPage, pageCount, pageSize) {
            return []
        },
        footer: function(currentPage, pageCount) {
            return []
        },
    }
}

export let getFonts = () => {
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
            italics:  'timesbi.ttf',
            bolditalics: 'timesi.ttf'
        }
    }
}
