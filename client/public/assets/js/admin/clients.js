var clients = {
    list: [],
    load(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/clientes/admin",
            method: "POST",
            contentType: "application/json",
            error(){ $("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                let listClients = $("#listClients");
                clients.list = [];
                clients.list = e.customers;
                listClients.empty();
                if(clients.list.length === 0) listClients.addClass("empty");
                else listClients.removeClass("empty");

                clients.list.forEach((cust, idx) =>{
                    cust = cust.data;
                    listClients.append(`<ul  i="${idx}" style="cursor: pointer;">
                                            <li>${alterFormatDate(cust.cliente_dataregistro.substring(0, 10)) + ", " + cust.cliente_dataregistro.substring(11, 13) + "h" + cust.cliente_dataregistro.substring(14, 16)}</li>
                                            <li>${cust.cliente_code}</li>
                                            <li>${(cust.cliente_nif || "N/D")}</li>
                                            <li>${cust.cliente_titular}</li>
                                            <li>${(cust.cliente_contactos.length > 0 ? cust.cliente_contactos[0] : "N/D")}</li>
                                            <li>${(cust.cliente_mail ||  "N/D")}</li>                              
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
                                                        <span class="flex v-ct">
                                                           <span tooltip="Editar" flow="up" class="editar flex v-ct h-ct" i="${idx}">
                                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 348.882 348.882"
                                                                    style="enable-background:new 0 0 348.882 348.882;" xml:space="preserve">
                                                                    <g>
                                                                        <path
                                                                            d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231
                                                                            c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685
                                                                            c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176
                                                                            C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99
                                                                            L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386
                                                                            c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z" />
                                                                        <path
                                                                            d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904
                                                                            c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15
                                                                            s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798
                                                                            c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z" />
                                                                    </g>
                                                                </svg>
                                                            </span>
                                                     </span>
                                            </li>
                                        </ul>`);
                });
                xTableGenerate();
            }
        });
    },
    registarCliente(){
        $("[bt_cliente]").prop("disabled", true).addClass("loading");
        let xModalCRUCustomer = $("#xModalCRUCustomer");
        $.ajax({
            url: "/api/cliente/admin",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cliente_titular: $("#cliente_nome").val().trim(), cliente_nif: ($("#cliente_nif").val() || null),
                cliente_code: $("#cliente_codigo").val().trim() || generateCodeClient(),
                cliente_contactos: [$("#cliente_telefone").val()],
                cliente_mail: ($("#cliente_email").val().trim() || null)}),
            error(){  $("[bt_cliente]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[bt_cliente]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    clients.load();
                    xAlert("Registar Cliente", "Cliente registado com sucesso!");
                    xModalCRUCustomer.find(".hideTarget").click();
                    xModalCRUCustomer.find("input").val("");
                }
                else xAlert("Registar Cliente",  e.data, "error");
            }
        });
    },
    editarCliente(){
        $("[bt_cliente]").prop("disabled", true).addClass("loading");
        let xModalCRUCustomer = $("#xModalCRUCustomer");
        $.ajax({
            url: "/api/cliente/admin",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cliente_titular: $("#cliente_nome").val().trim(), cliente_nif: ($("#cliente_nif").val() || null),
                cliente_code: $("#cliente_codigo").val().trim() || generateCodeClient(),
                cliente_contactos: [$("#cliente_telefone").val()], cliente_id: clients.selected.cliente_id,
                cliente_mail: ($("#cliente_email").val().trim() || null)}),
            error(){  $("[bt_cliente]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[bt_cliente]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    clients.load();
                    xAlert("Editar Cliente", "Cliente editado com sucesso!");
                    xModalCRUCustomer.find(".hideTarget").click();
                    xModalCRUCustomer.find("input").val("");
                }
                else xAlert("Editar Cliente",  e.data, "error");
            }
        });
    },
    alterEstadoCliente(){
        $("[changeStatusCustomer]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/cliente/admin",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cliente_id: this.clienteSelecionado.cliente_id, cliente_estado: (this.clienteSelecionado.cliente_estado === 1 ? 0 : 1)}),
            error(){  $("[changeStatusCustomer]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[changeStatusCustomer]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    clients.load();
                    $("#xModalChangeCustomerStatus").find(".hideTarget").click();
                    xAlert("Alterar estado cliente", "Operação efetuada com sucesso!");
                }
                else xAlert("Alterar estado cliente",  e.data, "error");
            }
        });
    }
}
clients.load();

$("[novoCliente]").on("click", function () {
    if(!$("#xModalCRUCustomer").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
        $("#xModalCRUCustomer").find("input").val("");
    }
    showTarget("xModalCRUCustomer", "Adicionar Cliente");
});
$("[bt_cliente]").on("click", function () {
    let xModalCRUCustomer = $("#xModalCRUCustomer");
    if(!validation1($("#cliente_nome"))) return;
    if($("#cliente_email").val().trim() !== ""){
        if(!isMailValid($("#cliente_email"))){
            xAlert("Registar cliente", "Email inválido.", "error");
            $("#cliente_email").focus();
            return;
        }
    }
    if (xModalCRUCustomer.find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) clients.registarCliente();
    else clients.editarCliente();
});
$("#listClients").on("click", ".editar", function () {
    clients.selected = clients.list[$(this).attr("i")].data;
    $("#cliente_codigo").val((clients.selected.cliente_code || ""));
    $("#cliente_nome").val(clients.selected.cliente_titular);
    $("#cliente_nif").val((clients.selected.cliente_nif || ""));
    $("#cliente_email").val((clients.selected.cliente_mail || ""));
    $("#cliente_telefone").val((clients.selected.cliente_contactos.length > 0 ? clients.selected.cliente_contactos[0] : ""));
    showTarget("xModalCRUCustomer", "Editar cliente");
});
$("#pesquisarCliente").on("keypress", function (e) {
    if(e.which === 13)
       advSearch($(this).val(), $("#listClients"), $("#listClients").find("ul"));
});