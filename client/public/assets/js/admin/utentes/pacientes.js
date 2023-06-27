$('[data-inputmask-alias]').inputmask();
var paciente = {
    clean : () => {
        $("[clientform] input, [id='xModalCRUtente'] input").val("");
        $("[responsavel_data]").prop("readonly", true);
        $("[utente_paciente_cliente_is_responsavel] li").removeClass("active");
        $("[utente_paciente_cliente_nome]").change();
        delete paciente.selected;
        delete client.selected;
    },
    set : () => {
        if (!$("[utente_paciente_cliente_is_responsavel] li.active").attr("value")){
            xAlert("", "Por favor defina o responsável", "error");
            return
        }

        if(!validation1($("[clientform] input"))){
            xAlert("", "Por favor preencha os campos obrigatórios", "error");
            return;
        }

        if(paciente.setAjax){ paciente.setAjax.abort(); }

        let reponsavel = paciente.getResposavel();
        let _data = {
            patient_uid: paciente?.selected?.patient_uid,
            patient_client_id : client.seleted.cliente_id,
            patient_item_tpatient : $("[list='utente_paciente_tipoanimal'] li.active").attr("value"),
            patient_name : $('[utente_paciente_nome]').val(),
            patient_datebirth : $('[utente_paciente_datanacimento]').val().stringToDate().getDateEn(),
            patient_address : $('[utente_paciente_morrada]').val(),
            patient_metadata : {
                ...(paciente?.selected?.patient_metadata || {}),
                code : $('[utente_paciente_codigo]').val() || "",
                raca : $('[utente_paciente_raca]').val(),
                cor : $('[utente_paciente_cor]').val(),
                genero : $('[utente_paciente_genero]').val(),
                peso : $('[utente_paciente_peso]').val(),
                alergias : $('[utente_paciente_alergias]').val(),
                doencas : $('[utente_paciente_doencas]').val(),
                observacao : $('[utente_paciente_observacao]').val(),
                reponsaveIsClient : $(" [utente_paciente_cliente_is_responsavel] li.active ").attr("value")
            },
            patient_responsible : reponsavel
        };

        $("[utente_paciente_bt]").addClass("loading");
        paciente.setAjax = $.ajax({
            url: "/api/clinica/paciente/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                ..._data
            }),
            success : ({ response : {row: {result, message, data}}}) => {
                if (result) {
                    $("[utente_paciente_bt]").removeClass("loading");
                    $('[id="xModalCRUtente"]').removeClass("show");
                   if(!_data.patient_uid){
                       $('[id="xModalCRUDsulta"]').addClass("show");
                       paciente.selected = data.patient;
                       xAlert("Parciente",  "Paciente editado com sucesso!");
                   }else {
                       xAlert("Parciente",  "Paciente registado com sucesso!");
                   }
                    paciente.load();
                }
                else xAlert("Paciente",  message, "error");
            },
            error : () => {
                $("[utente_paciente_bt]").removeClass("loading");
            }
        });
    },
    setDadosPermanentes : () => {
        if(paciente.setAjaxP){ paciente.setAjaxP.abort(); }

        let _data = {
            patient_uid: paciente?.selected?.patient_uid,
            patient_client_id : paciente.selected.patient_client_id,
            patient_metadata : {
                ...(paciente?.selected?.patient_metadata || {}),
                vacinas_recebidas : $("[pacient_data_pemanentes_vacinas_recebidas]").val() || null,
                atividades_pratica : $("[pacient_data_pemanentes_atividades_pratica]").val() || null,
                antecedentes_familiares : $("[pacient_data_pemanentes_antecedentes_familiares]").val() || null,
                antecedentes_morbidos : $("[pacient_data_pemanentes_antecedentes_morbidos]").val() || null,
                desparasitacao : $("[pacient_data_pemanentes_desparasitacao]").val() || null,
            },
        };

        $("[pacient_data_pemanentes_bt]").addClass("loading");
        paciente.setAjaxP = $.ajax({
            url: "/api/clinica/paciente/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                ..._data
            }),
            success : ({ response : {row: {result, message, data}}}) => {
                if (result) {
                    $("[pacient_data_pemanentes_bt]").removeClass("loading");
                    $('[id="xModalPermaData"]').removeClass("show");
                    paciente.selected = data.patient;
                    xAlert("Parciente",  "Paciente editado com sucesso!");
                    paciente.load();
                    paciente.getDataPermanent()
                }
                else xAlert("Paciente",  message, "error");
            },
            error : () => {
                $("[pacient_data_pemanentes_bt]").removeClass("loading");
            }
        });
    },
    getResposavel : () => {
        return {
            nome : $("[utente_paciente_responsavel_nome]").val(),
            telefone : $("[utente_paciente_responsavel_telefone]").val(),
            whatsapp : $("[utente_paciente_responsavel_whatsapp]").val(),
            email : $("[utente_paciente_responsavel_mail]").val() || null,
            notify : $("[utente_paciente_responsavel_deseja_ser_notificaoo] li.active").attr("value")
        }
    },
    initLoad : () => {
        paciente.load();

        $.ajax({
            url: "/api/clinica/fixacao/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                query: {item_type: DBK.clinic_item_type_tpacient},
            }),
            success: ({ data }) => {
                data.forEach((type) => {
                    $('[list="utente_paciente_tipoanimal"]').append(`<li value="${type.item_uid}">${type.item_desc}</li>`)
                })
            }
        });
    },
    load : () => {
        $("body").addClass("loading");
        $.ajax({
            url: "/api/clinica/paciente/load",
            method: "POST",
            contentType: "application/json",
            success: ({ data }) => {
                $("body").removeClass("loading");
                let listUtentes = $('[id="listUtentes"]').empty();
                paciente.list = data;
                data.forEach((data, index) => {
                    console.log(data);
                    let resposavel = paciente.getResponsavelIData(data);
                    let ul = `<ul index="${index}" class=" showTarget" target="FRAME-FICHA">
                            <li>${data.patient_date.stringToDateEn().getDatePt()}</li>
                            <li>${data.patient_number}</li>
                            <li>${data.patient_name}</li>
                            <li>${resposavel.nome}</li>
                            <li>${resposavel.telefone || ""}</li>
                            <li class="flex v-ct h-ct j-stp">
                                <a tooltip="Editar" flow="top" title="Editar" style="cursor: pointer;">
                                    <svg class="edit" viewBox="0 0 512 512">
                                        <path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/>
                                        <path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/>
                                        <path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/>
                                    </svg>
                                </a>
                                <label class="xSwitch">
                                    <input ${data.patient_state === 1 ? "checked" : ""} type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </li>
                        </ul>`;
                    listUtentes.append(ul);
                })
                xTableGenerate();
            }
        });
    },
    getResponsavelIData : (data) => {
        if(!data?.patient_responsible?.nome){
            let {cliente_titular, cliente_contactos, cliente_whatsapp, cliente_mail} = client.list.find((client) => {
                return client.cliente_id === data.patient_client_id;
            }) || {};

            return {
                nome : cliente_titular,
                telefone: cliente_contactos?.[0],
                email: cliente_mail,
                whatsapp: cliente_whatsapp,
            }
        }

        return data.patient_responsible;
    },
    initEdition : () => {
        let untente = paciente.selected;
        client.seleted = client.list.find(({cliente_id}) => {
            return cliente_id === untente.patient_client_id;
        });
        $("[list='utente_paciente_tipoanimal'] li").each(function (){
            if ($(this).attr("value") === untente.patient_item_tpatient) {
                $(this).addClass('active').siblings().removeClass('active');
                $("[utente_paciente_tipoanimal]").val($(this).text())
            }
        });
        $('[utente_paciente_codigo]').val(untente.patient_metadata.code || "");
        $('[utente_paciente_nome]').val(untente.patient_name);
        $('[utente_paciente_datanacimento]').val((untente.patient_datebirth || "").stringToDateEn().getDatePt()).trigger("complete");
        $('[utente_paciente_morrada]').val(untente.patient_address);
        $(`[utente_paciente_genero]`).val(untente?.patient_metadata?.genero);
        $('[utente_paciente_raca]').val(untente.patient_metadata?.raca);
        $('[utente_paciente_cor]').val(untente?.patient_metadata?.cor);
        $('[utente_paciente_peso]').val(untente?.patient_metadata?.peso);
        $('[utente_paciente_alergias]').val(untente?.patient_metadata?.alergias);
        $('[utente_paciente_doencas]').val(untente?.patient_metadata?.doencas);
        $('[utente_paciente_observacao]').val(untente?.patient_metadata?.observacao)

        $("[utente_paciente_cliente_contactos]").val(client.seleted.cliente_contactos[0]).change();

        $(`[utente_paciente_cliente_is_responsavel] li[value='${untente?.patient_metadata?.reponsaveIsClient || "true"}']`).click()
        setTimeout(() => {
            let resposavel = paciente.getResponsavelIData(untente);
            $("[utente_paciente_responsavel_nome]").val(resposavel.nome);
            $("[utente_paciente_responsavel_telefone]").val(resposavel.telefone);
            $("[utente_paciente_responsavel_whatsapp]").val(resposavel.whatsapp);
            if(!resposavel.whatsapp){
                $(" [utente_paciente_responsavel_whatsapp] ").prop("readonly", false);
            }
            $("[utente_paciente_responsavel_mail]").val(resposavel.email || "")
            if(!resposavel.email){
                $(" [utente_paciente_responsavel_mail] ").prop("readonly", false);
            }

            $(`[utente_paciente_responsavel_deseja_ser_notificaoo] li[value='${resposavel.notify}']`).click();
        })

        $('[id="xModalCRUtente"]').addClass("show");
    },
    getDataPermanent : () => {
        let year = paciente.selected.patient_datebirth.stringToDateEn().difference();
        let valueSelected = (year.diffYear > 0) ? year.diffYear : (year.diffMonth > 0) ? year.diffMonth : year.diffDay;
        let addS = `${(valueSelected === 1) ? "" : "s"}`
        $("[pacient_selected]").html(`${paciente?.selected?.patient_name}, ${(year.diffYear > 0) ? ` ${year.diffYear} ano${addS}` : (year.diffMonth > 0) ? ` ${year.diffMonth} mese${addS}` : ` ${year.diffDay} dia${addS}`}`)
        $("[pacient_data_pemanentes_vacinas_recebidas]").val(paciente?.selected?.patient_metadata?.vacinas_recebidas || "")
        $("[pacient_view_pemanentes_vacinas_recebidas]").html(paciente?.selected?.patient_metadata?.vacinas_recebidas || "")
        $("[pacient_data_pemanentes_atividades_pratica]").val(paciente?.selected?.patient_metadata?.atividades_pratica || "")
        $("[pacient_view_pemanentes_atividades_pratica]").html(paciente?.selected?.patient_metadata?.atividades_pratica || "")
        $("[pacient_data_pemanentes_antecedentes_familiares]").val(paciente?.selected?.patient_metadata?.antecedentes_familiares || "")
        $("[pacient_view_pemanentes_antecedentes_familiares]").html(paciente?.selected?.patient_metadata?.antecedentes_familiares || "")
        $("[pacient_data_pemanentes_antecedentes_morbidos]").val(paciente?.selected?.patient_metadata?.antecedentes_morbidos || "")
        $("[pacient_view_pemanentes_antecedentes_morbidos]").html(paciente?.selected?.patient_metadata?.antecedentes_morbidos || "")
        $("[pacient_data_pemanentes_desparasitacao]").html(paciente?.selected?.patient_metadata?.desparasitacao || "")
        $("[pacient_view_pemanentes_desparasitacao]").html(paciente?.selected?.patient_metadata?.desparasitacao || "")
    }
}

paciente.initLoad();

$('[target="xModalCRUtente"].showTarget').on("click",() => {
   paciente.clean();
})

$("[utente_paciente_cliente_is_responsavel] li").on("click", function (){
    if($(this).attr("value") === "true"){
        $("[responsavel_data]").prop("readonly", true);
        client.setResponsavel();
    }
    else {
        $("[responsavel_data]").val("").prop("readonly", false);
    }
})

$("[utente_paciente_bt]").on("click", () => {
    paciente.set();
})

$('[id="listUtentes"]').on("click", '[tooltip="Editar"]', function (e) {
    let index = $(this).parents("[index]").attr("index");
    paciente.selected = paciente.list[index];
    paciente.initEdition()
    e.stopPropagation();
}).on("click", 'ul',function () {
    let index = $(this).attr("index");
    paciente.selected = paciente.list[index];
    consulta.load();
    paciente.getDataPermanent()
})

$("[pacient_data_pemanentes_bt]").on("click", function (){
    paciente.setDadosPermanentes();
})

$("[utente_paciente_datanacimento]").on("complete", function (){
    $(this).addClass("complete")
    let year = $(this).val().stringToDate().difference();
    let valueSelected = (year.diffYear > 0) ? year.diffYear : (year.diffMonth > 0) ? year.diffMonth : year.diffDay;
    let addS = `${(valueSelected === 1) ? "" : "s"}`
    $(`.age`).html(`${(year.diffYear > 0) ? `${year.diffYear} ano${addS}` : (year.diffMonth > 0) ? `${year.diffMonth} mese${addS}` : `${year.diffDay} dia${addS}`}`)
}).on("incomplete", function (){
    $(this).removeClass("complete")
    $(`.age`).html(`x anos`)
}).on("focusout", function (){
    if ($(this).hasClass("complete")) {
        let year = $(this).val().stringToDate().difference();
        let valueSelected = (year.diffYear > 0) ? year.diffYear : (year.diffMonth > 0) ? year.diffMonth : year.diffDay;
        let addS = `${(valueSelected === 1) ? "" : "s"}`
        $(`.age`).html(`${(year.diffYear > 0) ? `${year.diffYear} ano${addS}` : (year.diffMonth > 0) ? `${year.diffMonth} mese${addS}` : `${year.diffDay} dia${addS}`}`)
        return
    }
    $(` .age `).html(`x anos`)
});

$("[filter-pacient]").on("keyup", function (){
    let search = $(this).val()
    $('[id="listUtentes"] ul').each(function (){
        if($(this).text().$$(search)){
            $(this).show()
            return
        }
        $(this).hide()
    })
})