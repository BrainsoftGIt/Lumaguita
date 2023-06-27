import path from "path";
import fs from "fs";
import {getFonts, structure, photoResize, getImage} from "./estruture";
import {folders} from "../../../../global/project";
import {clusterServer} from "../../../../service/cluster.service";
import {formattedString} from "./formatValue";
import moment from "moment";

let getValueInList = (list, value, {nameLists, keyId, keyValue}) => {
    let rt;
    for (let i = 0; i < nameLists.length; i++) {
        let nameList = nameLists[i];
        rt = (list[nameList].find((data) => { return (data[keyId] + "") === (value + ""); })?.[keyValue]) || rt
        if (rt){
            break;
        }
    }
    return rt;
}

export let create = async (instituition, account_content, res, user, num_autorization, guia) => {
    const pdfMake = require("../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../libs/js/pdfmake/vfs_fonts');
    const {formattedString} = require("./formatValue");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));


    let artigosConta = [];
    (account_content.main.conta_vendas || []).forEach((cont) =>{
        console.log(cont);
        artigosConta.push([
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont?.artigo_codigo || "---"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont.artigo_nome
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont.venda_quantidade
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : cont.venda_lote || "---",
                alignment : "right"
            },
            {
                margin : [0, 7, 0, 5],
                fontSize : 9.5,
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                text : (cont.venda_validade === null ? "---" : moment(cont.venda_validade).format("DD-MM-YYYY")),
                alignment : "right"
            }
        ]);
    });
    let docDefinition = {
        compress: true,
        info: {
            title: 'Guia de Saída',
            author: 'Luma',
            subject: 'Impressão de guia de saída',
            keywords: 'luma, brainsoft',
        },
        content: [
            (!hasPersonalizadoHarder) ? {
                lineHeight: 1.3,
                columns: [
                    (logoTipo ? {
                        image:  'data:image/png;base64,' + fs.readFileSync(logoTipo).toString('base64'),
                        width: 120,
                    } : {}),
                    {
                        fontSize : 12,
                        alignment : "right",
                        stack: [
                            {
                                text: `${instituition?.espaco_configuracao?.empresa_nome}`,
                                bold: true,
                                fontSize : 16,
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_nif} `
                                    },
                                    getImage("nif.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_endereco}`
                                    },
                                    getImage("point.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_telef}`
                                    },
                                    getImage("phone.png", 12)
                                ]
                            },
                            {
                                columns: [
                                    {
                                        margin : [0, 0, 10, 0],
                                        text: `${instituition?.espaco_configuracao?.empresa_email}`
                                    },
                                    getImage("mail.png", 12)
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
                        return  0.8;
                    },
                    vLineWidth: function (i, node) {
                        return  0.8;
                    },
                },
                table : {
                    widths: ["50%", "50%"],
                    body: [
                        [
                            {
                                border: [false, false, true, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        color: '#3C0097',
                                        text: `GUIA DE SAÍDA`,
                                        bold: true,
                                        fontSize: 20,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Cliente: `
                                            },
                                            account_content.main.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `NIF: `
                                            },
                                            (account_content.main.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#3C0097',
                                                text: `Morada: `
                                            },
                                            (/*account_content.main.cliente_nif ||*/ "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                border: [true, false, false, false],
                                borderColor: ['#3C0097', '#3C0097', '#3C0097', '#3C0097'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 14,
                                        color : '#3C0097',
                                        text : "Nº de guia de saída"
                                    },
                                    {
                                        margin: [0, 0, 0, 15],
                                        text : guia.guia_numero,
                                    },
                                    {
                                        color : '#3C0097',
                                        text: "Data de emissâo"
                                    },
                                    {
                                        width: "100%",
                                        text: moment(guia.guia_date).format("DD-MM-YYYY")
                                    }
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                text : "",
                margin: [0, 20, 0, 5],
            },
            {
                fontSize : 11,
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
                    widths: ["10%", "44%", "8%", "17%", "21%"],
                    body : [
                        [
                            {
                                margin: [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Código",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text : "Descrição",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Qtd",
                                color: "#ffffff"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Lote",
                                color: "#ffffff",
                                alignment : "right"
                            },
                            {
                                margin : [0, 7, 0, 5],
                                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                                fillColor: '#3C0097',
                                text: "Data de validade",
                                color: "#ffffff",
                                alignment : "right"
                            }
                        ],
                        ...artigosConta
                        // [
                        //     {
                        //         border: [false, false, false, false],
                        //         text : "", colSpan: 3, fillColor : "#ffffff"
                        //     },
                        //     {text : ""},
                        //     {text : ""},
                        //     {
                        //         fontSize : 9.5,
                        //         border: [false, false, false, false],
                        //         fillColor: "#3C0097",
                        //         color: "#ffffff",
                        //         margin : [0, 7, 0, 5],
                        //         bold: true,
                        //         text: "Total",
                        //     },
                        //     {
                        //         fontSize : 9.5,
                        //         border: [false, false, false, false],
                        //         fillColor: "#3C0097",
                        //         color: "#ffffff",
                        //         margin : [0, 7, 0, 5],
                        //         bold: true,
                        //         text: formattedString(account_content?.main?.conta_montante+"")+" STN",
                        //         alignment: "right"
                        //     }
                        // ]
                    ]
                }
            },
            {
                margin: [0, 50, 0, 0],
                stack: [
                    {
                        fontSize: 13,
                        bold: false,
                        text : "Recebi"
                    },
                    {
                        margin: [0, 20, 0, 0],
                        bold: false,
                        text : "____________________________________"
                    }
                ]
            },
            {
                margin: [0, 50, 0, 0],
                stack: [
                    {
                        fontSize: 13,
                        bold: false,
                        text : "Entreguei"
                    },
                    {
                        margin: [0, 20, 0, 0],
                        bold: false,
                        text : "____________________________________"
                    }
                ]
            }
        ],
        ...structure(user, num_autorization, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Guia_Saída_"+(new Date().getTime()+Math.random())+".pdf";
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
