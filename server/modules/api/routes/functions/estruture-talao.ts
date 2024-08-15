export let structure = ({margin, percentagemDiminuir = 0}) => {
    percentagemDiminuir = percentagemDiminuir ?? 0;
    let {marginLeft: left, marginRight: right} = margin || {};
    return {
        styles: {
            pequena: {
                fontSize: 8.8 - (8.8 * percentagemDiminuir / 100),
                alignment: "center",
                lineHeight: 1.2
            },
            media: {
                fontSize: 9 - (9 * percentagemDiminuir / 100)
            },
            normal: {
                fontSize: 10 - (10 * percentagemDiminuir / 100)
            },
            grande: {
                fontSize: 10.5 - (10.5 * percentagemDiminuir / 100),
                bold: true,
            },
            bold: {
                fontSize: 10 - (10 * percentagemDiminuir / 100),
                bold: true,
            },
        },
        pageMargins: [(+left || 5), 0, (+right || 5), 0],
        pageSize: {
            width: 204.0944881889764,
            height: 841.8897637795277
        },
        background: function (page) {
            return []
        },
        header: function (currentPage, pageCount, pageSize) {
            return []
        },
        footer: function (currentPage, pageCount) {
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
            italics: 'timesbi.ttf',
            bolditalics: 'timesi.ttf'
        }
    }
}
