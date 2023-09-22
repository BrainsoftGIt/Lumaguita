import path from "path";
import fs from "fs";
import {getFonts, structure, getImage} from "./estruture";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";

// structure.footer()
export let create = async (instituition, artigos_transferencia:any, armazens, res, user:string, date) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);
    let artigos = [];
    artigos_transferencia.forEach((art) =>{
        artigos.push([
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.artigo_codigo
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.artigo_nome
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 6.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : art.transferencia_quantidade
            }
        ]);
    });

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let docDefinition = {
        compress: true,
        info: {
            title: 'Transferêcia de artigos',
            author: 'Luma',
            subject: 'Impressão de transferêcia de artigos',
            keywords: 'Luma, artigos, transferência',
        },
        content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                        width: 80,
                    } : {}),
                    {
                        fontSize : 9,
                        alignment : "right",
                        stack: [
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`,
                                bold: true,
                                fontSize : 9,
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_nif} `
                                    },
                                    getImage("nif.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 9)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 9)
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
                                fontSize : 8,
                                border: [false, false, true, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `TRANSFERÊNCIA DE ARTIGOS`,
                                        bold: true,
                                    }
                                ]
                            },
                            {
                                fontSize : 8,
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: "Data de transferência"
                                    },
                                    {
                                        width: "100%",
                                        text: date,
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                // font: "NimbusRomanno9l",
                lineHeight: 1.3,
                margin: [0, 40, 0, 0],
                columns: [
                    {
                        width: "45%",
                        table : {
                            widths: ["100%"],
                            body: [
                                [
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Armazém de Saída: "
                                            },
                                            `${armazens.armazem_origem}`
                                        ]
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Cód. Armazém de Saída: "
                                            },
                                            `${armazens.armazem_origem_codigo}`
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        width: "10%",
                        text : " "
                    },
                    {
                        width: "45%",
                        table : {
                            widths: ["100%"],
                            body: [
                                [
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Armazém de Entrada: "
                                            },
                                            `${armazens.armazem_destino}`
                                        ]
                                    }
                                ],
                                [
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color : '#000000',
                                                text : "Cód. Armazém de Entrada: "
                                            },
                                            `${armazens.armazem_destino_codigo}`
                                        ]
                                    }
                                ]
                            ]
                        }
                    },
                ]
            },
            {
                // font: "NimbusRomanno9l",
                margin: [0, 20, 0, 5],
                text : ""
            },
            {
                fontSize : 7,
                lineHeight: 1.3,
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#F5F6F6' : null;
                    },
                    hLineWidth: function (i, node) {
                        return  0.8;
                    },
                    vLineWidth: function (i, node) {
                        return  0.8;
                    },
                },
                table : {
                    headerRows: 1,
                    widths: ["20%", "60%", "20%"],
                    body : [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                color: "#ffffff",
                                fillColor: '#000000',
                                text: "Código"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text : "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#000000',
                                text: "Quantidade",
                                color: "#ffffff"
                            }
                        ],
                        ...artigos
                    ]
                }
            }
        ],
        ...structure(user, null, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Transferência de artigos.pdf";
        fs.mkdirSync(path.join(folders.temp, 'multer'), {recursive: true});
        fs.writeFile(path.join(folders.temp, 'multer/'+filename), buffer, function (err) {
            if (err) return console.log(err);
            if(res) {
                res.download(path.join(folders.temp, 'multer')+"/"+filename, filename, function () {
                   fs.unlinkSync(path.join(folders.temp, 'multer')+"/"+filename);
                });
            }
        });
    });
}
