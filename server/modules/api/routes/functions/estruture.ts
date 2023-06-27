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

export let structure = (user, num_autorization, num_certification,  imageCabecalho = "") => {
    let footerSystem;

    if(num_autorization === null && num_certification === null){
        footerSystem = "";
    }
    else{
        if(num_autorization !== null && num_certification !== null)
            footerSystem = "Documento emitido por sistema informático com o nº de autorização "+num_autorization+" e de certificado "+num_certification;
        else if(num_autorization === null && num_certification !== null)
            footerSystem = "Documento emitido por sistema informático com o nº de certificado "+num_certification;
        else
            footerSystem = "Documento emitido por sistema informático com o nº de autorização "+num_autorization;
    }

    return {
        pageMargins: [35, ( imageCabecalho ? 90 : 50 ), 35, 45],
        background: function (page) {
            return [  ];
        },
        header: function(currentPage, pageCount, pageSize) {
            let file = path.resolve(__dirname, imageCabecalho)
            return [
                imageCabecalho ? {
                    alignment: 'center',
                    image: 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'),
                    width: 594,
                } : {}
            ];
        },
        footer: function(currentPage, pageCount) {
            return [
                {
                    lineHeight: 1.3,
                    fontSize: 11.5,
                    margin: [30, 0, 35, 0],
                    stack :[
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
                                    fontSize: 10,
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
                        { type: 'rect', x: 30, y: 0, w: 530, h: 1.2, color: '#0a0a0a', lineColor: '#ffffff', r: 5},
                    ],
                },
            ]
        },
    }
}

export let getImage = (pathFile, width : string | number = 10) => {
    let file = path.resolve(__dirname, `../../../../resources/pdfs/${pathFile}`)
    return {
        image: 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'),
        width: width,
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
