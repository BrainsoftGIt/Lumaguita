export let structure = ({margin}) => {
    let { marginLeft: left, marginRight : right } = margin || {};
    return {
        styles: {
            pequena: {
                fontSize: 8.8,
                alignment : "center",
                lineHeight: 1.2
            },
            media: {
                fontSize: 9
            },
            normal: {
                fontSize: 10
            },
            grande: {
                fontSize: 10.5,
                bold: true,
            },
            bold: {
                fontSize: 10,
                bold: true,
            },
        },
        pageMargins: [ (+left || 5), 0, (+right || 5), 0 ],
        pageSize: {
            width : 302,
            height: "auto"
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
