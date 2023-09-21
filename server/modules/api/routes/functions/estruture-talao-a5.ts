import fs from "fs";

export let structure = ({user, logoTipo, instituition, footerSystem}) => {

    let hasTalaoOhoto = logoTipo && instituition?.espaco_configuracao.logo_talao;
    return {
        styles: {
            pequena: {
                fontSize: 6.8,
                alignment : "center",
                lineHeight: 1.2
            },
            media: {
                fontSize: 7
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
        pageMargins: [ 25, hasTalaoOhoto ? 110: 60, 25, 60 ],
        pageSize: "A5",
        background: function (page) {
            return []
        },
        header: function(currentPage, pageCount, pageSize) {
            return [
                {
                    lineHeight: 1,
                    columns: [
                        {
                            style : "grande",
                            alignment: "center",
                            stack: [
                                ( hasTalaoOhoto ? {
                                    margin: [0, 5, 0, 5],
                                    image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                                    width: 40
                                } : {}),
                                {
                                    text: `${instituition?.espaco_configuracao?.empresa_nome}`
                                },
                                {
                                    text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                },
                                {
                                    text: `Cont: ${instituition?.espaco_configuracao?.empresa_telef}`
                                },
                                {
                                    text: `NIF: ${instituition?.espaco_configuracao?.empresa_nif} `
                                },
                                {
                                    text: `Email: ${instituition?.espaco_configuracao?.empresa_email}`
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        footer: function(currentPage, pageCount) {
            return [
                {
                    margin:  [0, 6, 0, 0],
                    style: "pequena",
                    stack: [
                        {
                            text: "Processado pelo software Luma",
                        },
                        {
                            text: `Operador(a): ${user}`,
                        },
                        {
                            text: "Obrigado pela preferência",
                        },
                        {
                            text: footerSystem
                        }
                    ]
                }
            ]
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
