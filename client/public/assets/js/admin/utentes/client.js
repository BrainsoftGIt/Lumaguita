var client = {
    reg : () => {
        if(client.regAjax){
            client.regAjax.abort();
        }

        if(!validation1($('[id="xModalCRUCustomer"] input'))){
            xAlert("", "Por favor preencha os campos obrigatórios", "error");
            return
        }

        if(!isMailValid($(" [utente_reg_cliente_email] "))){
            xAlert("", "Por favor preencha um email válido!", "error");
            $("[utente_reg_cliente_email] ").focus()
            return;
        }

        $("[utente_reg_cliente_bt]").addClass("loading");
        client.regAjax = $.ajax({
            url: "/api/cliente/admin",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                cliente_id: client?.seleted?.cliente_id,
                cliente_titular: $("[utente_reg_cliente_nome]").val(),
                cliente_contactos: [$("[utente_reg_cliente_telefone]").val()],
                cliente_mail: $("[utente_reg_cliente_email]").val() || null,
                cliente_code: $("[utente_reg_cliente_codigo]").val(),
                cliente_nif: $("[utente_reg_cliente_nif]").val() || null,
                cliente_metadata: {
                    bi: $("[utente_reg_cliente_bi]").val() || null,
                    whatsapp: $("[utente_reg_cliente_whatsapp]").val(),
                    observacao: $("[utente_reg_cliente_obs]").val(),
                    morada: $("[utente_reg_cliente_morada]").val(),
                    notify: $('[utente_paciente_client_deseja_ser_notificaoo] li.active').attr("value")
                }
            }),
            error : () => {
                $("[utente_reg_cliente_bt]").removeClass("loading");
            },
            success : (e) => {
                $("[utente_reg_cliente_bt]").removeClass("loading");
                if(e.result){
                    let {
                        data: {
                            cliente: {
                                cliente_code,
                                cliente_contactos,
                                cliente_dataregistro,
                                cliente_estado,
                                cliente_id,
                                cliente_mail,
                                cliente_nif,
                                cliente_metadata: {bi, observacao, whatsapp, notify, morada},
                                cliente_titular
                            }
                        }
                    } = e;

                    client.seleted = {
                        cliente_code,
                        cliente_contactos,
                        cliente_dataregistro,
                        cliente_estado,
                        cliente_id,
                        cliente_mail,
                        cliente_bi : bi,
                        cliente_observacao : observacao,
                        cliente_whatsapp : whatsapp,
                        cliente_nif,
                        cliente_titular,
                        cliente_notify: notify,
                        cliente_morada: morada
                    }

                    $("[utente_paciente_cliente_contactos]").val(cliente_contactos?.[0] || "")
                    $("[utente_paciente_cliente_nome]").val(cliente_titular)
                    $("[utente_paciente_cliente_is_responsavel] li.active").click();
                    $('[id="xModalCRUCustomer"]').removeClass("show");
                    client.load();
                }
                else xAlert("Registar Cliente",  e.message, "error");
            }
        });
    },
    load : () => {
        if(client.loadAjax){
            client.loadAjax.abort();
        }
        client.loadAjax = $.ajax({
            url: "/api/clientes/admin",
            method: "POST",
            contentType: "application/json",
            success : (e) => {
                client.list = e.customers.map(({
                                                   data: {
                                                       cliente_code,
                                                       cliente_contactos,
                                                       cliente_dataregistro,
                                                       cliente_estado,
                                                       cliente_id,
                                                       cliente_mail,
                                                       cliente_nif,
                                                       cliente_metadata: {bi, observacao, whatsapp, notify, morada},
                                                       cliente_titular
                                                   }
                                               }) => {
                    $('[id="utente_paciente_cliente_contactos"]').append(`<option>${cliente_contactos?.[0] || ""}</option>`);
                    $('[id="utente_paciente_cliente_nome"]').append(`<option>${cliente_titular}</option>`);
                    return {
                        cliente_code,
                        cliente_contactos,
                        cliente_dataregistro,
                        cliente_estado,
                        cliente_id,
                        cliente_mail,
                        cliente_bi : bi,
                        cliente_observacao : observacao,
                        cliente_whatsapp : whatsapp,
                        cliente_nif,
                        cliente_titular,
                        cliente_notify: notify,
                        cliente_morada: morada,

                    }
                })
            }
        });
    },
    setResponsavel : () => {
        $("[utente_paciente_responsavel_nome]").val(client.seleted.cliente_titular);
        $("[utente_paciente_responsavel_telefone]").val(client.seleted.cliente_contactos?.[0] || "");
        $("[utente_paciente_responsavel_whatsapp]").val(client.seleted.cliente_whatsapp);
        if(!client.seleted.cliente_whatsapp){
            $(" [utente_paciente_responsavel_whatsapp] ").prop("readonly", false);
        }
        $("[utente_paciente_responsavel_mail]").val(client.seleted.cliente_mail);
        if(!client.seleted.cliente_mail){
            $(" [utente_paciente_responsavel_mail] ").prop("readonly", false);
        }
        $(`[utente_paciente_responsavel_deseja_ser_notificaoo] li[value='${client.seleted.cliente_notify}']`).click();
    },
    clean : () => {
        let r = (Math.random() + 1).toString(36).substring(7);
        let data = new Date();

        $("[utente_reg_cliente_nome]").val("")
        $("[utente_reg_cliente_telefone]").val("")
        $("[utente_reg_cliente_email]").val("")
        $("[utente_reg_cliente_codigo]").val(`cli-${r}${data.getSeconds().add0ToTimer()}`.toUpperCase())
        $("[utente_reg_cliente_nif]").val("")
        $("[utente_reg_cliente_bi]").val("")
        $("[utente_reg_cliente_whatsapp]").val("")
        $("[utente_reg_cliente_obs]").val("")
        $("[utente_reg_cliente_morada]").val("")
        $('[utente_paciente_client_deseja_ser_notificaoo] li').removeClass("active")
    },
    edit : () => {
        let r = (Math.random() + 1).toString(36).substring(7);

        let {cliente_bi, cliente_code, cliente_contactos, cliente_mail, cliente_whatsapp, cliente_nif, cliente_titular, cliente_observacao, cliente_morada, cliente_notify} = client.seleted;
        $("[utente_reg_cliente_nome]").val(cliente_titular || "")
        $("[utente_reg_cliente_telefone]").val(cliente_contactos?.[0] || "")
        $("[utente_reg_cliente_email]").val(cliente_mail || "")
        $("[utente_reg_cliente_codigo]").val(cliente_code || `cli-${r}${data.getSeconds().add0ToTimer()}`.toUpperCase())
        $("[utente_reg_cliente_nif]").val(cliente_nif || "")
        $("[utente_reg_cliente_bi]").val(cliente_bi || "")
        $("[utente_reg_cliente_whatsapp]").val(cliente_whatsapp || "")
        $("[utente_reg_cliente_obs]").val(cliente_observacao || "")
        $("[utente_reg_cliente_morada]").val(cliente_morada || "")
        $(`[utente_paciente_client_deseja_ser_notificaoo] li[value="${cliente_notify === "true"}"]`).click()
    }
}

client.load();

$("[utente_reg_cliente_bt]").on("click", () => {
    client.reg();
})

$("[utente_paciente_cliente_nome]").on("change", function (){
    client.seleted = client.list.find(({ cliente_titular }) => {
        console.log(cliente_titular);
        return cliente_titular === $(this).val();
    })
    if(client.seleted){
        $("[utente_paciente_cliente_contactos]").val(client.seleted.cliente_contactos?.[0] || "");
        $("[utente_paciente_cliente_is_responsavel] li.active").click();
        $("[bt-control-client]").attr("bt-control-client", "edit").attr("tTitle", "Editar Cliente").html("Editar")
    }else {
        $("[utente_paciente_cliente_contactos]").val("");
        $("[bt-control-client]").attr("bt-control-client", "reg").attr("tTitle", "Adicionar Cliente").html("Adicionar")
    }
})

$("[utente_paciente_cliente_contactos]").on("change", function (){
    client.seleted = client.list.find(({ cliente_contactos }) => {
        return cliente_contactos?.[0] === $(this).val();
    })
    if(client.seleted){
        $("[utente_paciente_cliente_nome]").val(client.seleted.cliente_titular);
        $("[utente_paciente_cliente_is_responsavel] li.active").click();
        $("[bt-control-client]").attr("bt-control-client", "edit").attr("tTitle", "Editar Cliente").html("Editar")
    }else {
        $("[utente_paciente_cliente_contactos]").val("");
        $("[bt-control-client]").attr("bt-control-client", "reg").attr("tTitle", "Adicionar Cliente").html("Adicionar")
    }
})

$('[target="xModalCRUCustomer"].showTarget').on("click", function (){
    if($(this).attr("bt-control-client") === "edit"){
        client.edit()
        return
    }
    client.clean()
})
