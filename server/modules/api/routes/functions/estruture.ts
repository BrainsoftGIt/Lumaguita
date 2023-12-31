import fs from "fs";
import path from "path";

export let structure = (user, num_autorization, num_certification, imageCabecalho = "", textcolor, baseColor, rotape = {}, addNote = false) => {
    let footerSystem;

    if (num_autorization === null && num_certification === null) {
        footerSystem = "";
    } else {
        if (num_autorization !== null && num_certification !== null)
            footerSystem = "Documento emitido por sistema informático com o nº de autorização " + num_autorization + " e de certificado " + num_certification;
        else if (num_autorization === null && num_certification !== null)
            footerSystem = "Documento emitido por sistema informático com o nº de certificado " + num_certification;
        else
            footerSystem = "Documento emitido por sistema informático com o nº de autorização " + num_autorization;
    }

    if(addNote){
        footerSystem = "Nota: Este documento não é uma fatura final. Apenas uma prévia sujeita a ajustes antes da fatura definitiva.";
    }

    return {
        pageMargins: [35, (imageCabecalho ? 125 : 50), 35, 110],
        background: function (page) {
            return [];
        },
        header: function (currentPage, pageCount, pageSize) {
            let file = path.resolve(__dirname, imageCabecalho)
            return [
                imageCabecalho ? {
                    alignment: 'center',
                    image: 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'),
                    width: 594,
                } : {}
            ];
        },
        footer: function (currentPage, pageCount) {
            let certificacao = {
                alignment: "center",
                lineHeight: 1.3,
                fontSize: 6.5,
                margin: [35, 10, 35, 5],
                stack: [
                    {
                        text: `${user} | Processado pelo software Luma`
                    },
                    {
                        text: `${footerSystem}`,
                    },
                    {
                        text: `${currentPage}/${pageCount}`,
                    }
                ]
            }

            // @ts-ignore
            if(!!rotape?.table?.body?.[0]?.[0]?.rowSpan){
                certificacao.margin = [35, 30, 35, 5]
                // @ts-ignore
                rotape.table.body[0][0].stack = [
                    certificacao
                ]
            }

            return [
                (currentPage === pageCount) ? rotape : {},
                // @ts-ignore
                !rotape?.table?.body?.[0]?.[0]?.rowSpan ? certificacao : {}
            ]
        },
    }
}

export let getImage = (pathFile, width: string | number = 10) => {
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
            italics: 'timesbi.ttf',
            bolditalics: 'timesi.ttf'
        }
    }
}
