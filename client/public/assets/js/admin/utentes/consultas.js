var consulta = {
    getTyps : {
        medicamento : DBK.clinic_item_type_receita,
        avalicacao : DBK.clinic_item_type_avaliacao,
        exames : DBK.clinic_item_type_exame,
    },
    elments : {
        medicamento : {
            html: (item, value) => {
                return `<div kelement="${item.item_uid}" class="xinput w100">
                        <input value="${value || ""}" _noObrigatory="true" type="text" placeholder="_">
                        <label>${item.item_desc}</label>
                   </div>`
            }
        },
        avalicacao : {
            html: (item, value) => {
                return `<div kelement="${item.item_uid}" class="xinput w100">
                        <input value="${value || ""}" _noObrigatory="true" type="text" placeholder="_">
                        <label>${item.item_desc}</label>
                   </div>`
            }
        },
        exames : {
            html:(item, value) => {
                return `<div kelement="${item.item_uid}" class="xinput w100">
                        <input value="${value || ""}" _noObrigatory="true" type="text" placeholder="_">
                        <label>${item.item_desc}</label>
                   </div>`
            }
        }
    },
    loadsIinit : () => {
        $.ajax({
            url: "/api/clinica/fixacao/loads",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                lods: [
                    {
                        parmName: "tconsulta",
                        query: {item_type: DBK.clinic_item_type_tconsulta},
                    },
                    {
                        parmName: "avalicacao",
                        query: {item_type: DBK.clinic_item_type_avaliacao},
                    },
                    {
                        parmName: "exames",
                        query: {item_type: DBK.clinic_item_type_exame},
                    },
                    {
                        parmName: "medicamento",
                        query: {item_type: DBK.clinic_item_type_receita},
                    }
                ]
            }),
            success: ({tconsulta, ...outher}) => {
                let tconsultaHtml = $('[list="utente_consulta_tipoConsulta"]').empty();
                tconsulta.forEach((type) => {
                    tconsultaHtml.append(`<li value="${type.item_uid}">${type.item_desc}</li>`)
                });

                consulta.listInit = outher;
                 Object.keys(outher).forEach((key) => {
                    let itens = outher[key];
                    let itemHtml = $(`[ktype="${key}"]`);
                    itemHtml.find("[koption]").remove()
                    itens.forEach((type, index) => {
                        itemHtml.append(`<li kindex="${index}" koption="add" class="flex h-sb v-ct">
                                            <span>${type.item_desc}</span>
                                            <span class="add"></span>
                                     </li>`)
                    });
                })
            }
        });
    },
    set : () => {
        let notes = (() => {
            return $("[kelement]").map(function (){
                let klist = $(this).parents("[klist]").attr("klist");
                console.log(klist);
                return {
                    note_item_uid: $(this).attr("kelement"),
                    note_metadata: {
                        text: $(this).find("input").val()
                    },
                    note_type: consulta.getTyps[klist]
                }
            }).get();
        })()

        let _consulta = {
            consulta_uid : consulta.selected?.consulta_uid || null,
            consulta_item_tconsulta : $('[list="utente_consulta_tipoConsulta"] li.active').attr("value"),
            consulta_client_uid: paciente.selected.patient_client_id,
            consulta_patient_uid : paciente.selected.patient_uid,
            consulta_metadata : {
                sintomas : $("[utente_consulta_sintomas]").val(),
                observacao : $("[utente_consulta_observacao]").val(),
                tratamento : $("[utente_consulta_tratamento]").val(),
            },
            notes : notes
        };

        if (!_consulta?.consulta_uid){
            delete _consulta.consulta_uid;
        }

        let utente_consulta_pacient_bt = $("[utente_consulta_pacient_bt]").addClass("loading");
        $.ajax({
            url: "/api/clinica/consulta/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(_consulta),
            success: ({ response : {row: {result, message, data}}}) => {
                if(result){
                    consulta.load();
                    $('[id="xModalCRUDsulta"]').removeClass("show");
                    if(!consulta.selected?.consulta_uid){
                        $("[id='xModalWhatFatura']").addClass("show");
                    }
                }
                utente_consulta_pacient_bt.removeClass("loading");
            }
        });
    },
    delete : () => {
        $("[deleteSeletedConsulta]").addClass("loading");
        $.ajax({
            url: "/api/clinica/consulta/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                consulta_uid : consulta.selected?.consulta_uid,
                consulta_state : 0,
            }),
            success: ({ response : {row: {result, message, data}}}) => {
                $("[deleteSeletedConsulta]").removeClass("loading");
                if(result){
                    consulta.load();
                    $('[id="xModalDeleteConsulta"]').removeClass("show");
                }
            }
        });
    },
    load : () => {
        $("body").addClass("loading");
        $.ajax({
            url: "/api/clinica/consulta/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                query: {
                    patient_uid: paciente.selected.patient_uid,
                    client_uid: paciente.selected.patient_client_id,
                }
            }),
            success: ({ data }) => {
                $("body").removeClass("loading");
                consulta.list = data;
                let listConsultas = $("[listConsultas]").empty();
                data.forEach((data, index) => {
                    let dataConsulta = data.consulta_date.stringToDateEn();
                    let format = `${dataConsulta.getDate().add0ToTimer()} de ${arrayMes[dataConsulta.getMonth()]}, ${dataConsulta.getFullYear()}`
                    let li = `<li index="${index}" class="flex wrap closed">
                                    <h4>${format} - (${data.item_desc})</h4>
                                    <ul consultadatas>
                                       
                                    </ul>
                                </li>`;
                    listConsultas.append(li);
                })
            }
        });
    },
    loadData : () => {
        $("body").addClass("loading");
        $.ajax({
            url: "/api/clinica/consulta/load/data",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                consulta_uid: consulta.selected.consulta_uid,
            }),
            success: ({ data}) => {
                $("body").removeClass("loading");
                let index = consulta.list.indexOf(consulta.selected);

                consulta.selected.datas = data;
                let  {consulta_metadata : {sintomas, observacao, tratamento}} = data.find((dt) => {
                    return dt["clinic.consulta"];
                })
                $(`[listConsultas] li[index='${index}'] [consultadatas]`).html(`<li>
                        <b>Anamnese</b>
                        <p>${sintomas || ""}</p>
                    </li>
                    <li>
                        <b>Avaliação Física e Psicológica</b>
                        ${(() => {
                            return data.filter((dt) => {
                                return dt.note_type === DBK.clinic_item_type_avaliacao
                            }).map(({item_desc, note_metadata : {text}}) => {
                                return `<p>${item_desc}: ${text}</p>`
                            }).join("")
                        })()}
                    </li>
                    <li>
                        <b>Exames Laboratoriais</b>
                        ${(() => {
                            return data.filter((dt) => {
                                return dt.note_type === DBK.clinic_item_type_exame
                            }).map(({item_desc, note_metadata : {text}}) => {
                                return `<p>${item_desc}: ${text}</p>`
                            }).join("")
                        })()}
                    </li>
                    <li ${ !tratamento ? 'style="display: none"' : ""}>
                        <b>Tratamento</b>
                        <p>${(tratamento || "").split("\n").join("<br>")}</p>
                        <p printTratament title="Gerar Receita">
                            <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16"> <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/> <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/> </svg>
                        </p>
                    </li>
                    <li>
                        <b>Observações</b>
                        <p>${observacao || ""}</p>
                    </li>
                    <div>
                        <span consultaFatu title="Gerar Fatura">
                            <svg width="31" height="31" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0391 6C19.5226 6 15.4068 7.49171 12.9723 8.71108C12.7529 8.82095 12.5472 8.92862 12.3561 9.03278C11.9779 9.2389 11.6568 9.43131 11.4001 9.6L14.1701 13.6776L15.4738 14.1967C20.5701 16.768 27.4044 16.768 32.5007 14.1967L33.9811 13.4286L36.6001 9.6C36.2163 9.34413 35.6856 9.03371 35.0324 8.70362C34.9926 8.68351 34.9524 8.66331 34.9117 8.64306C32.4877 7.43697 28.4719 6 24.0391 6ZM17.5968 10.6162C16.6 10.4322 15.6205 10.1786 14.6959 9.88754C16.9772 8.87454 20.377 7.8 24.0391 7.8C26.5764 7.8 28.9755 8.31593 30.9598 8.96919C28.6344 9.29746 26.1529 9.85159 23.789 10.5354C21.9289 11.0735 19.7548 11.0143 17.5968 10.6162ZM33.5567 15.68L33.3116 15.8037C27.7053 18.6324 20.2693 18.6324 14.6629 15.8037L14.4299 15.6861C6.00829 24.9274 -0.421944 41.9971 24.0391 41.9971C48.5001 41.9971 41.9131 24.6085 33.5567 15.68ZM23.0001 24C21.8956 24 21.0001 24.8954 21.0001 26C21.0001 27.1046 21.8956 28 23.0001 28V24ZM25.0001 22V21H23.0001V22C20.791 22 19.0001 23.7909 19.0001 26C19.0001 28.2091 20.791 30 23.0001 30V34C22.1309 34 21.3887 33.4449 21.1137 32.6668C20.9296 32.146 20.3583 31.8731 19.8376 32.0572C19.3169 32.2412 19.0439 32.8125 19.228 33.3332C19.7766 34.8855 21.2569 36 23.0001 36V37H25.0001V36C27.2093 36 29.0001 34.2091 29.0001 32C29.0001 29.7909 27.2093 28 25.0001 28V24C25.8694 24 26.6115 24.5551 26.8866 25.3332C27.0706 25.854 27.6419 26.1269 28.1627 25.9428C28.6834 25.7588 28.9563 25.1875 28.7723 24.6668C28.2236 23.1145 26.7433 22 25.0001 22ZM25.0001 30V34C26.1047 34 27.0001 33.1046 27.0001 32C27.0001 30.8954 26.1047 30 25.0001 30Z" fill="blue"></path> </svg>
                        </span>
                        <span consultaEdit title="Editar Consulta">
                            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"/> </g> </svg>
                        </span>
                        <span consultaDele title="Eliminar Consulta">
                            <svg width="30" height="30" style="color: red" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="red"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="red"></path> </svg>
                        </span>
                    </div>
                    `)
            }
        });
    },
    loadFatutaPage : (consultaType) => {
        $("[loadFatutaPage]").load(`/includes/fatura?v=${VERSION.TAG}`, () => {
            let untente = paciente.selected;
            let {cliente_titular} = client.list.find(({cliente_id}) => {
                return cliente_id === untente.patient_client_id;
            });
            $("[search_article]").val("consulta").keyup();
            let inter = setInterval(() => {
                if(articlesDocuments.customers.length && articlesDocuments.artigoLoaded){
                    clearInterval(inter);
                    $("[search_customer]").val(cliente_titular).keyup();
                   setTimeout(() => {
                       $("[description_article]").val(consultaType);
                   })
                }
            }, 500);

            $('[id="ver_proformas"]').hide();
            $('[id="finalizar_fatura"]').css({
                marginTop: "50px",
                marginRight: "20px"
            })

            $('[hideModal]').show()
                .on("click", () => {
                setTimeout(() => {
                    $("[loadFatutaPage]").empty();
                }, 10)
            });
        });
    },
    printRecibo : () => {
        let untente = paciente.selected;
        let clien_t = client.list.find(({cliente_id}) => {
            return cliente_id === untente.patient_client_id;
        });

        let tratamento = consulta.selected.consulta_metadata.tratamento;

        let data = JSON.stringify({
            client: clien_t,
            utente: untente,
            tratamento: tratamento.split("\n")
        });

        let type = $("#xModalPrintModel [type].active").attr("type");
        $.ajax({
            url: `/api/clinica/consulta/export/receita/data`,
            method: "POST",
            contentType: "application/json",
            data,
            success: (file) => {
                Documents.open({
                    data: `/api/clinica/consulta/export/receita/${type}/`+JSON.stringify({ file }),
                    name: `Receita ${type.toUpperCase()}`
                });
            }
        })
    },
    startEdit : () => {
        let {consulta_metadata : { observacao, sintomas, tratamento }, consulta_item_tconsulta, item_desc, datas} = consulta.selected;
        consulta.clear();

        $(`[utente_consulta_tipoConsulta]`).val(item_desc);
        $(`[list="utente_consulta_tipoConsulta"] li[value="${consulta_item_tconsulta}"]`).addClass("active").siblings().removeClass('active');
        $("[utente_consulta_sintomas]").val(sintomas);
        $("[utente_consulta_observacao]").val(observacao);
        $("[utente_consulta_tratamento]").val(tratamento);
        datas.forEach((dt) => {
            if (dt.note_type === DBK.clinic_item_type_exame || dt.note_type === DBK.clinic_item_type_avaliacao) {
                Object.keys(consulta.listInit).forEach((key) => {
                    let itens = consulta.listInit[key];
                    let itemHtml = $(`[ktype="${key}"]`);
                    itens.forEach((type, index) => {
                        let item = consulta.listInit[key][index];
                        console.log(dt.item_uid, item.item_uid);
                        if(dt.item_uid === item.item_uid) {
                            $(`[klist='${key}']`).append(consulta.elments[key].html(item, dt.note_metadata.text));
                            itemHtml.find(`li[kindex='${index}']`).attr("koption", "rem").find("span:last").remove("add").addClass("remove");
                        }
                    });
                })
            }
        });

        $("#xModalCRUDsulta").addClass("show")
    },
    clear : () => {
        $('[id="xModalCRUDsulta"] input, [id="xModalCRUDsulta"] textarea').val("");

        Object.keys(consulta.listInit).forEach((key) => {
            let itens = consulta.listInit[key];
            let itemHtml = $(`[ktype="${key}"]`);
            itemHtml.find("[koption]").remove()
            itens.forEach((type, index) => {
                itemHtml.append(`<li kindex="${index}" koption="add" class="flex h-sb v-ct">
                                            <span>${type.item_desc}</span>
                                            <span class="add"></span>
                                     </li>`)
                let item = consulta.listInit[key][index];
                $(`[klist='${key}'] [kelement='${item.item_uid}']:last`).remove()
            });
        })
    }
};


$("[listConsultas]").on("click", "li", function (){
    if($(this).hasClass("closed")) {
        let index = $(this).attr("index");
        consulta.selected = consulta.list[index];
        consulta.loadData();
    }else {
        $(this).find("[consultadatas]").empty();
    }
})


consulta.loadsIinit();
$('[ktype] [ksearch]').on("click", (e) =>{
    e.stopImmediatePropagation();
})

$("[ksearch]").on("keyup", (e)=> {
    let ktype = $(e.target).parents("[ktype]");
    let ksearch = $(e.target).val()
    if( !ksearch ){
        ktype.find("[koption]").show();
        return;
    }
    $("[ktype] [koption]").each((index, li) => {
        if (ktype.find(li).find("span:first").text().$$(ksearch)) {
            ktype.find(li).show();
            return;
        }
        ktype.find(li).hide();
    })
})

$("[ktype]").on("click", "[koption='add']",function (){
    let kindex = $(this).attr("kindex");
    let ktype = $(this).parents("[ktype]").attr("ktype");
    let item = consulta.listInit[ktype][kindex];
    $(`[klist='${ktype}']`).append(consulta.elments[ktype].html(item));
    $(this).attr("koption", "rem").find("span:last").toggleClass("remove add");
}).on("click", "[koption='rem']",function (){
    let kindex = $(this).attr("kindex");
    let ktype = $(this).parents("[ktype]").attr("ktype");
    let item = consulta.listInit[ktype][kindex];
    $(this).attr("koption", "add").find("span:last").toggleClass("remove add");
    $(`[klist='${ktype}'] [kelement='${item.item_uid}']:last`).remove()
})

$("[utente_consulta_pacient_bt]").on("click", () => {
    consulta.set();
})

$("[createFatura]").on("click", function (){
    let consultaType = $('[list="utente_consulta_tipoConsulta"] li.active').text();
    consulta.loadFatutaPage(consultaType);
    $("#xModalOpenFatura").addClass("show")
});


$("*").on("click", "[consultadatas] li, [consultadatas] div", function (e){
    e.stopPropagation()
})
    .on("click", "[consultadatas] li [printTratament]", function (e){
        let index = $(this).parents("li[index]").attr("index");
        consulta.selected = consulta.list[index];
        $("#xModalPrintModel").addClass("show");
        e.stopPropagation()
})
    .on("click", "[consultadatas] [consultaEdit]", function (e){
        let index = $(this).parents("li[index]").attr("index");
        consulta.selected = consulta.list[index];
        consulta.startEdit();
        e.stopPropagation()
    })
    .on("click", "[consultadatas] [consultadele]", function (e){
        let index = $(this).parents("li[index]").attr("index");
        consulta.selected = consulta.list[index];
        $("#xModalDeleteConsulta").addClass("show");
        e.stopPropagation()
    })
    .on("click", "[consultadatas] div [consultaFatu]", function (e){
        let index = $(this).parents("li[index]").attr("index");
        let {item_desc} = consulta.list[index];
        consulta.loadFatutaPage(item_desc);
        $("#xModalOpenFatura").addClass("show")
        e.stopPropagation()
    })

$("[target='xModalCRUDsulta'].showTarget").on("click", () => {
    consulta.clear();
})

$("#xModalPrintModel [printtratament]").on("click", function (){
    if(!$("#xModalPrintModel [type].active").length){
        xAlert( "Selecione o formato a imprimir!", "error");
    }
    consulta.printRecibo();
})

$("[deleteSeletedConsulta]").on("click", function (){
    consulta.delete();
})
