var contacorrente = {
    clientes: [],
    clienteSelecionado: null,
    cambios: null,
    troco: null,
    _tgrupo_id: 2,
    code_operation_conta_corrente: "recibo",
    init(){
        $("#contacorrente_estrutura_troco").css("display", "");
        $("#contacorrente_estrutura_numero_documento").css("display", "none");
        $("#contacorrente_troco").val("").prop("disabled", true);
        $("#contacorrente_tipo_pagamento").find("li").eq(0).mousedown();
        setTimeout(() => {
            $('[data-inputmask-alias]').inputmask();
        })

        articlesDocuments.loadSerieDistribuicao(serieOperation.tipo.recibo);
        contacorrente.loadClients();
        contacorrente.carregarCambios();
        serieOperation.loadSerieOperation([serieOperation.tipo.recibo]);
    },
    carregarCambios(){
        $.ajax({
            url: "/api/cambios",
            method: "GET",
            contentType: "application/json",
            success(e) {
                contacorrente.cambios = null;
                contacorrente.cambios = e.cambio_ativos;
                let contacorrente_moeda = $("#contacorrente_moeda");
                contacorrente_moeda.empty();
                contacorrente.cambios.forEach((cam) =>{
                    cam = cam.data;
                    contacorrente_moeda.append(`<li currency_id="${cam.currency_id}" cambio_taxa="${cam.cambio_taxa}">${cam.currency_code}</li>`);
                });
            }
        });
    },
    carregarTipoLancamentos(){
        $.ajax({
            url: "/api/type/launchs",
            method: "GET",
            contentType: "application/json",
            success(e) {

            }
        });
    },
    loadClients(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/clientes/admin",
            method: "POST",
            contentType: "application/json",
            error(){ $("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                let bodyCustomers = $("#xbodyClientesContaCorrente");
                let estadoSaldoCliente;
                let saldo = 0;
                contacorrente.clientes = [];
                contacorrente.clientes = e.customers;
                $("#contacorrente_clientes_registados").text(contacorrente.clientes.length);
                bodyCustomers.empty();
                if(contacorrente.clientes.length === 0) bodyCustomers.addClass("empty");
                else bodyCustomers.removeClass("empty");

                contacorrente.clientes.forEach((cust, idx) =>{
                    cust = cust.data;
                    saldo = Number(saldo) + Number((cust.balanco_final || 0));
                    if(Number((cust.balanco_corrente || 0)) > 0) estadoSaldoCliente = "credit";
                    else if(Number((cust.balanco_corrente || 0)) < 0) estadoSaldoCliente = "debit";
                    else estadoSaldoCliente = "";

                    bodyCustomers.append(`<ul  i="${idx}" style="cursor: pointer;">
                                            <li>${(cust.cliente_nif || "N/D")}</li>
                                            <li>${cust.cliente_titular}</li>
                                            <li>${(cust.cliente_contactos.length > 0 ? cust.cliente_contactos[0] : "-----")}</li>
                                            <li class="saldoCliente ${estadoSaldoCliente}" balanco="${estadoSaldoCliente}">${(cust.balanco_corrente || 0).dc().formatter()+" STN"}</li>
                                            <li class="flex v-ct">
                                                <span class="flex v-ct j-stp pagar" i="${idx}">
                                                    <svg enable-background="new 0 0 512 512" viewBox="0 0 512 512"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g>
                                                            <path
                                                                d="m256 512c-68.38 0-132.668-26.628-181.02-74.98s-74.98-112.64-74.98-181.02 26.629-132.667 74.98-181.02 112.64-74.98 181.02-74.98 132.668 26.628 181.02 74.98 74.98 112.64 74.98 181.02-26.629 132.667-74.98 181.02-112.64 74.98-181.02 74.98zm0-480c-123.514 0-224 100.486-224 224s100.486 224 224 224 224-100.486 224-224-100.486-224-224-224z" />
                                                            <path
                                                                d="m256 240c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40c0 8.836 7.163 16 16 16s16-7.164 16-16c0-34.201-23.978-62.888-56-70.186v-17.814c0-8.836-7.163-16-16-16s-16 7.164-16 16v17.814c-32.022 7.298-56 35.985-56 70.186 0 39.701 32.299 72 72 72 22.056 0 40 17.944 40 40s-17.944 40-40 40-40-17.944-40-40c0-8.836-7.163-16-16-16s-16 7.164-16 16c0 34.201 23.978 62.888 56 70.186v17.814c0 8.836 7.163 16 16 16s16-7.164 16-16v-17.814c32.022-7.298 56-35.985 56-70.186 0-39.701-32.299-72-72-72z" />
                                                        </g>
                                                    </svg>
                                                    <a>Efetuar pagamento</a>
                                                </span>
                                            </li>
                                        </ul>`);
                });
                $("#contacorrente_saldo").text(saldo.dc().formatter());
                xTableGenerate();
            }
        });
    },
    loadLaunchs(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/launchs/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_cliente_id: contacorrente.clienteSelecionado.cliente_id,
                arg_tgrupo_id: 2}),
            error(){ $("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                let xbodyHistoricoContaCliente = $("#xbodyHistoricoContaCliente");
                let estadoSaldoLancamento;
                let reimprimir;
                xbodyHistoricoContaCliente.empty();
                if(e.launchs.length === 0) xbodyHistoricoContaCliente.addClass("empty");
                else xbodyHistoricoContaCliente.removeClass("empty");

                e.launchs.forEach((launch) =>{
                    launch = launch.data;
                    reimprimir = "";
                    if(Number((launch.lancamento_saldo || 0)) > 0) estadoSaldoLancamento = "credit";
                    else if(Number((launch.lancamento_saldo || 0))  < 0) estadoSaldoLancamento = "debit";
                    else estadoSaldoLancamento = "";

                    if(launch.lancamento_refid !== null){
                       reimprimir = `  <li class="flex v-ct">
                                  <span class="flex v-ct j-stp imprimir"
                                        ref_id="${launch.lancamento_refid}"
                                        ref_class="${launch.lancamento_regclass}">
                                     <svg class="svg-icon" version="1.1" id="Capa_1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                          y="0px"
                                          width="475.078px" height="475.077px"
                                          viewBox="0 0 475.078 475.077"
                                          style="enable-background:new 0 0 475.078 475.077;"
                                          xml:space="preserve">
                                        <g>
                                          <path d="M458.959,217.124c-10.759-10.758-23.654-16.134-38.69-16.134h-18.268v-73.089c0-7.611-1.91-15.99-5.719-25.122
                                            c-3.806-9.136-8.371-16.368-13.699-21.698L339.18,37.683c-5.328-5.325-12.56-9.895-21.692-13.704
                                            c-9.138-3.805-17.508-5.708-25.126-5.708H100.5c-7.614,0-14.087,2.663-19.417,7.993c-5.327,5.327-7.994,11.799-7.994,19.414V200.99
                                            H54.818c-15.037,0-27.932,5.379-38.688,16.134C5.376,227.876,0,240.772,0,255.81v118.773c0,2.478,0.905,4.609,2.712,6.426
                                            c1.809,1.804,3.951,2.707,6.423,2.707h63.954v45.68c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.803,7.994,19.417,7.994
                                            h274.083c7.611,0,14.093-2.669,19.418-7.994c5.328-5.332,7.994-11.8,7.994-19.417v-45.68h63.953c2.471,0,4.613-0.903,6.42-2.707
                                            c1.807-1.816,2.71-3.948,2.71-6.426V255.81C475.082,240.772,469.708,227.876,458.959,217.124z M365.449,420.262H109.636v-73.087
                                            h255.813V420.262z M365.449,237.537H109.636V54.816h182.726v45.679c0,7.614,2.669,14.083,7.991,19.414
                                            c5.328,5.33,11.799,7.993,19.417,7.993h45.679V237.537z M433.116,268.656c-3.614,3.614-7.898,5.428-12.847,5.428
                                            c-4.949,0-9.233-1.813-12.848-5.428c-3.613-3.61-5.42-7.898-5.42-12.847s1.807-9.232,5.42-12.847
                                            c3.614-3.617,7.898-5.426,12.848-5.426c4.948,0,9.232,1.809,12.847,5.426c3.613,3.614,5.427,7.898,5.427,12.847
                                            S436.733,265.046,433.116,268.656z"/>
                                        </g>
                                    </svg>  
                                  </span>
                                </li>`;
                    }


                    xbodyHistoricoContaCliente.append(`<ul>
                                                        <li>${alterFormatDate(launch.lancamento_data)}</li>
                                                        <li>${(launch.lancamento_descricao || "Sem descrição")}</li>
                                                        <li>${(launch.lancamento_debito === 0 ? "------" : (launch.lancamento_debito || 0).dc().formatter()+" STN")}</li>
                                                        <li>${(launch.lancamento_credito === 0 ? "------" : (launch.lancamento_credito || 0).dc().formatter()+" STN")}</li>
                                                        <li class="${estadoSaldoLancamento}">${(launch.lancamento_saldo || 0).dc().formatter()+" STN"}</li>
                                                             ${reimprimir}
                                                    </ul>`);
                });
                xTableGenerate();
                showTarget("AbtAccFrmID");
            }
        });
    },
    resetData() {
        let contacorrente_tipo_pagamento = $("#contacorrente_tipo_pagamento");
        contacorrente_tipo_pagamento.find("li").removeClass("active");
        $("#contacorrente_troco").val("").prop("disabled", true);
        contacorrente_tipo_pagamento.find("li").eq(0).mousedown();
        $("#contacorrente_estrutura_troco").css("display", "");
        $("#contacorrente_estrutura_numero_documento").css("display", "none");
        $("#contacorrente_moeda").find("li").removeClass("active");
        $("#xModalMakePayment").find("input:text, textarea").val("");
    },
    pagar(){
        let contacorrente_tipo_pagamento = $("#contacorrente_tipo_pagamento");
        let pagamentoCash = contacorrente_tipo_pagamento.find("li.active").attr("tipo_desc") === "cash";
        $("[pagar_contacorrente]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/deposito",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                _serie_id: ($(`[listFatura] li.active`).data() || {}).id || null,
                deposito_tpaga_id: contacorrente_tipo_pagamento.find("li.active").attr("tipo_id"),
                deposito_currency_id: $("#contacorrente_moeda").find("li.active").attr("currency_id"),
                deposito_cliente_id: contacorrente.clienteSelecionado.cliente_id, deposito_referencia: {},
                deposito_montantemoeda: $("#contacorrente_montante").val().unFormatter(),
                deposito_data: alterFormatDate($("#contacorrente_datapagamento").val()),
                deposito_observacao: ($("#contacorrente_descricao").val().trim() || null), deposito_docref: (pagamentoCash ? null : $("#contacorrente_codigo_operacao").val().trim()),
                _tgrupo_id: contacorrente._tgrupo_id,
                deposito_montantetroco: (pagamentoCash ? ($("#contacorrente_troco").val() || null) : null)}),
            error(){  $("[pagar_contacorrente]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[pagar_contacorrente]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    spaceConfig.deposito = e.data.main.data.deposito.deposito_id;
                    spaceConfig["recibo"].print();
                    contacorrente.loadClients();
                    $("#xModalMakePayment").find(".hideTarget").click();
                    contacorrente.resetData();
                    xAlert("Efetuar pagamento", "Pagamento efetuado com sucesso");
                    $("#AbtAccFrmID").find(".hideTarget").click();
                }
                else xAlert("Efetuar pagamento",  e.data, "error");
            }
        });
    },
    registar_lancamento(){
        $("[bt_lancamento]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/lancamento",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                lancamento_tlancamento_id: $("#lancamento_tipo").find("li.active").attr("tipo"),
                lancamento_operacao: $("#lancamento_operacao").find("li.active").attr("tipo"),
                lancamento_valor: $("#lancamento_valor").val().unFormatter(),
                lancamento_cliente_id: contacorrente.clienteSelecionado.cliente_id,
                lancamento_data: alterFormatDate($("#lancamento_data").val()),
                deposito_data: alterFormatDate($("#contacorrente_datapagamento").val()),
                lancamento_documento: ($("#lancamento_documento").val().trim() || null),
                lancamento_descricao: ($("#lancamento_descricao").val().trim() || null)}),
                error() {
                    $("[bt_lancamento]").prop("disabled", false).removeClass("loading")
                },
                success(e) {
                    $("[bt_lancamento]").prop("disabled", false).removeClass("loading");
                    if(e.result){
                        contacorrente.loadClients();
                        $("#xModalOutrosLancamentos").find(".hideTarget").click();
                        $("#xModalOutrosLancamentos").find("input, textarea").val("");
                        $("#lancamento_tipo, #lancamento_operacao").find("li").removeClass("active");
                        contacorrente.resetData();
                        xAlert("Lançamento", "Lançamento efetuado efetuado com sucesso.");
                        $("#AbtAccFrmID").find(".hideTarget").click();
                    }
                    else xAlert("Lançamento",  e.data, "error");
                }
            });
        }
};

contacorrente.init();


$("#xbodyClientesContaCorrente").on("click", "ul", function (e) {
    e.preventDefault();
    e.stopPropagation();
    contacorrente.clienteSelecionado = contacorrente.clientes[$(this).attr("i")].data;
    $("#accurentCustomer").text(contacorrente.clienteSelecionado.cliente_titular);
    $("#AbtAccFrmID").find("input:checkbox").prop("checked", (contacorrente.clienteSelecionado.cliente_estado === 1));
    $("#accurentCustomerValue").removeClass("credit debit").text((contacorrente.clienteSelecionado.balanco_corrente || 0).dc().formatter()+" STN").
        addClass($(this).find("li.saldoCliente").attr("balanco"));
    contacorrente.loadLaunchs();
}).on("click", ".pagar", function (e) {
    e.preventDefault();
    e.stopPropagation();
    contacorrente.clienteSelecionado = contacorrente.clientes[$(this).attr("i")].data;
    showTarget("xModalMakePayment");
});
$("[aboutCustomer]").on("click", function () {
    if(!$("#xModalCRUCustomer").hasClass("viewMode")){
        $("#xModalCRUCustomer").addClass("viewMode");
    }
    $("#contacorrente_cliente_nome").val(contacorrente.clienteSelecionado.cliente_titular);
    $("#contacorrente_cliente_nif").val((contacorrente.clienteSelecionado.cliente_nif || "Não definido"));
    $("#contacorrente_cliente_email").val((contacorrente.clienteSelecionado.cliente_mail || "Não definido"));
    $("#contacorrente_cliente_telefone").val(contacorrente.clienteSelecionado.cliente_contactos[0]);
});
$("#searchAAccurent").on("keypress", function (e) {
    if(e.which === 13){
        if($("#AbtAccFrmID").hasClass("show"))
            advSearch($(this).val(),  $("#xbodyHistoricoContaCliente"),  $("#xbodyHistoricoContaCliente").find("ul"));
        else
            advSearch($(this).val(),  $("#xbodyClientesContaCorrente"),  $("#xbodyClientesContaCorrente").find("ul"));
    }
});
$("#contacorrente_tipo_pagamento").on("mousedown", "li", function () {
    if($(this).attr("tipo_desc") === "cash"){
        $("#contacorrente_estrutura_troco").css("display", "");
        $("#contacorrente_estrutura_datapagamento, #contacorrente_estrutura_numero_documento").css("display", "none");
    }
    else{
        $("#contacorrente_estrutura_troco").css("display", "none");
        $("#contacorrente_estrutura_datapagamento, #contacorrente_estrutura_numero_documento").css("display", "");
    }
});
$("#contacorrente_moeda").on("mousedown", "li", function () {
    $("#contacorrente_montante").keyup();
});
$("[pagar_contacorrente]").on("click", function () {
    let contacorrente_tipo_pagamento = $("#contacorrente_tipo_pagamento");
    let listFatura = $("[listFatura]");
    let regExp = /[a-zA-Z]/g;

    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(serieOperation.missing.length > 0){
                xAlert("Série de recibo", "Nenhuma série de recibo encontrada para este armazém. Defina-a em definições.","error");
                return;
            }
            if(contacorrente_tipo_pagamento.find("li.active").length === 0){
                xAlert("Efetuar pagamento", "Escolha o tipo de pagamento!", "error");
                return;
            }
            if(listFatura.find("li.active").length === 0){
                xAlert("Efetuar pagamento", "Escolha uma serie!", "error");
                return;
            }
            if($("#contacorrente_moeda").find("li.active").length === 0){
                xAlert("Efetuar pagamento", "Escolha a moeda!", "error");
                return;
            }
            if(contacorrente_tipo_pagamento.find("li.active").attr("tipo_desc") === "cash"){
                if(!validation1($("#contacorrente_montante, #contacorrente_datapagamento"))) return;
                if (regExp.test($("#contacorrente_datapagamento").val())) {
                    xAlert("Efetuar pagamento", "Digite a data de pagamento!", "info");
                    return;
                }
                if (!compareDates(alterFormatDate($("#contacorrente_datapagamento").val()), new Date().getDateEn(), true)) {
                    xAlert("Efetuar pagamento", "Data de pagamento inválida", "error");
                    $("#contacorrente_datapagamento").focus();
                    return;
                }
                contacorrente.pagar();
            }
            else{
                if(!validation1($("#contacorrente_montante, #contacorrente_datapagamento, #contacorrente_codigo_operacao"))) return;
                if (regExp.test($("#contacorrente_datapagamento").val())) {
                    xAlert("Efetuar pagamento", "Digite a data de pagamento!", "info");
                    return;
                }
                if (!compareDates(alterFormatDate($("#contacorrente_datapagamento").val()), new Date().getDateEn(), true)) {
                    xAlert("Efetuar pagamento", "Data de pagamento inválida", "error");
                    $("#contacorrente_datapagamento").focus();
                    return;
                }
                contacorrente.pagar();
            }
        }
    });
});
$("#contacorrente_montante").on("keyup", function () {
    if($(this).val() !== "" && $("#contacorrente_tipo_pagamento").find("li.active").attr("tipo_desc") === "cash"){
        let valor = $(this).val().unFormatter() * Number($("#contacorrente_moeda").find("li.active").attr("cambio_taxa"));
        contacorrente.troco = Number((contacorrente.clienteSelecionado.balanco_corrente || 0)) + Number(valor);
        if( Number((contacorrente.clienteSelecionado.balanco_corrente || 0)) < 0 && Number(contacorrente.troco) > 0){
            $("#contacorrente_troco").val(contacorrente.troco).prop("disabled", false);
        }
    }
    else{
        $("#contacorrente_troco").val("").prop("disabled", true);
        contacorrente.troco = null;
    }
});
$("#contacorrente_troco").on("keyup", function () {
    if($(this).val() !== ""
        && $("#contacorrente_montante").val() !== ""
        && $("#contacorrente_tipo_pagamento").find("li.active").attr("tipo_desc") === "cash"
        && $("#contacorrente_moeda").find("li.active").length > 0){
        if($(this).val().unFormatter() > Number(contacorrente.troco)){
            $("#contacorrente_troco").val("");
        }
    }
});

$("[printDocument]").on("click", function () {
    spaceConfig.typePrinter = $("#xModalPrintAdminModel").find(".waves-effect.account.active").attr("type");
    $("#xModalPrintAdminModel .hideTarget").click();
    spaceConfig[spaceConfig.operationCode].print();
});
$("#lancamento_tipo").on("mousedown", "li", function () {
    $("#lancamento_operacao li").removeClass("active");
    if($(this).attr("operacao") !== "0"){
        $("#lancamento_operacao").find(`li[tipo=${$(this).attr("operacao")}]`).addClass("active").css("pointer-events", "none");
        $("#lancamento_operacao_descricao").val( $("#lancamento_operacao li.active").text());
    }
    else{
        $("#lancamento_operacao").find(`li`).css("pointer-events", "auto");
        $("#lancamento_operacao_descricao").val( "");
    }
});

$("[bt_lancamento]").on("click", function () {
    let regExp = /[a-zA-Z]/g;
   if($("#lancamento_tipo").find("li.active").length === 0){
       xAlert("Lançamento", "Selecione o tipo de lançamento", "error");
       return;
   }
    if($("#lancamento_operacao").find("li.active").length === 0){
        xAlert("Lançamento", "Selecione o tipo de operação", "error");
        return;
    }
    if(!validation1($("#lancamento_valor, #lancamento_data"))) return;
    if (regExp.test($("#lancamento_data").val())) {
        xAlert("Lançamento", "Digite a data de lançamento!", "info");
        return;
    }
    if($("#lancamento_descricao").val().trim() === ""){
        xAlert("Lançamento", "Digite a descrição!", "info");
        return;
    }
    contacorrente.registar_lancamento();
});
$("#xbodyHistoricoContaCliente").on("click", ".imprimir", function () {
    if($(this).attr("ref_class").includes("conta"))
        Documents.open({
            data: "/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id: $(this).attr("ref_id"), date: new Date().getTimeStampPt(), admin: true }),
            name: "Fatura"
        });
    else{
        spaceConfig.deposito = $(this).attr("ref_id");
        spaceConfig["recibo"].print();
    }
});
