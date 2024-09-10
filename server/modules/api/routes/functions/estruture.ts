import fs from "fs";
import path from "path";

export let SVG = {
    "mail.png": ({fill}) => {
        return `<svg fill="${fill}" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" fill-rule="evenodd"></path> </g></svg>`
    },
    "point.png": ({fill}) => {
        console.log({fill})
        return `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="${fill}"></path> </g></svg>`
    },
    "phone.png": ({fill}) => {
        return `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 5V1H7V5L4.5 7.5L8.5 11.5L11 9H15V15H11C5.47715 15 1 10.5228 1 5Z" fill="${fill}"></path> </g></svg>`
    },
    "nif.png": ({fill}) => {
        return `<svg fill="${fill}" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,394c0,23.5,19.1,42.7,42.7,42.7h426.7c23.5,0,42.7-19.1,42.7-42.7v-42.7H0V394z M469.3,95.3H42.7 C19.1,95.3,0,114.5,0,138v170.7h512V138C512,114.5,492.9,95.3,469.3,95.3z"></path> </g></svg>`
    }
}
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

export let getImage = (svg_name, width: string | number = 10, fill = "black") => {
    return {
        svg: SVG[svg_name]({fill}),
        width: width
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
