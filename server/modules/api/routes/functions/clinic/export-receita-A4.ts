import path from "path";
import fs from "fs";
import {getFonts, structure, photoResize, getImage} from "./estruture-A4";
import {folders} from "../../../../../global/project";
import {clusterServer} from "../../../../../service/cluster.service";

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

export let create = async (instituition, res, user, client, utente, tratamento) => {
    const pdfMake = require("../../../../../../libs/js/pdfmake/pdfmake");
    const pdfFonts = require('../../../../../../libs/js/pdfmake/vfs_fonts');
    console.log(utente)

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = getFonts();
    let logoTipo = clusterServer.res.resolve(instituition?.espaco_configuracao?.logo_referencia);

    let hasPersonalizadoHarder = (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia));

    let docDefinition = {
        compress: true,
        info: {
            title: 'Receita',
            author: 'Luma',
            subject: 'Impressão de fatura',
            keywords: 'luma, fatura, brainsoft',
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
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        color: '#000000',
                                        text: `Receita`,
                                        bold: true,
                                        fontSize: 20,
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Cliente: `
                                            },
                                            client.cliente_titular
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `NIF: `
                                            },
                                            (client.cliente_nif || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Email: `
                                            },
                                            (client.cliente_mail || "---------------")
                                        ]
                                    }
                                ]
                            },
                            {
                                alignment: "right",
                                border: [true, false, false, false],
                                borderColor: ['#000000', '#000000', '#000000', '#000000'],
                                stack: [
                                    {
                                        bold: true,
                                        fontSize: 20,
                                        color : '#000000',
                                        text : "Utente"
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Nome: `
                                            },
                                            (utente.patient_name || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Codígo: `
                                            },
                                            (utente.patient_metadata?.code || "---------------")
                                        ]
                                    },
                                    {
                                        text: [
                                            {
                                                bold: true,
                                                color: '#000000',
                                                text: `Raça: `
                                            },
                                            (utente.patient_metadata.raca || "---------------")
                                        ]
                                    },
                                ]
                            }
                        ]
                    ]
                }
            },
            {
                text : "",
                margin: [0, 25, 0, 5],
            },
            {
                color: '#000000',
                fontSize: 25,
                alignment : "center",
                text : "Receituário",
                margin: [0, 25, 0, 20],
            },
            {
                type: 'square',
                ul: (() => {
                    let conteudo = [];
                    tratamento.forEach((_tratamento) => {
                        conteudo.push({ text: _tratamento })
                    });
                    return conteudo;
                })()
            }
        ],
        ...structure(user, instituition.espaco_configuracao.certification,
            (instituition?.espaco_configuracao?.cabecalho_referencia === null ? "" : clusterServer.res.resolve(instituition?.espaco_configuracao?.cabecalho_referencia)))
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
        let filename = "Receita_"+(new Date().getTime()+Math.random())+".pdf";
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
