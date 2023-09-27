var FATURARECIBO = 2;
var payment = {
    valorTroco: 0,
    cambio_taxa: 1,
    clients: [],
    caixa_id: null,
    CODE_OPERATION_FATURA_RECIBO: "fatura_recibo",
    CODE_OPERATION_FATURA: "fatura",
    loadCustomers(){
        $.ajax({
            url: "/api/cliente/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let listCustomers = $(".listCustomers ul");
                listCustomers.empty();
                payment.clients = [];
                payment.clients = e.clients;
                if(payment.clients.length === 0) listCustomers.addClass("empty");
                else listCustomers.removeClass("empty");

                payment.clients.forEach((cli) =>{
                    cli = cli.data;
                    listCustomers.append(`<li class="flex h-sb v-ct" cliente_id="${cli.cliente_id}" nif_titular="${cli.cliente_nif}">
                                            <p>${cli.cliente_titular}</p>                                          
                                        </li>`);
                });
                if($("#asideCarrinho").hasClass("isProforma")){
                    let cliente_proforma = $("#xModalAllRegisteredClients ul");
                    cliente_proforma.find(`li[cliente_id=${proforma.cliente_id}]`).addClass("active");
                }
            }
        });
    },
    clearData(){
        $("#nif_titular_compra").val("").prop("disabled", false);
        $("#payAndPrint").text("pagar & imprimir");
        $("#moeda_pagamento").attr("coin", "STN");
        $("#titular_compra").val("Cliente Final");
        let tiposPagamento = $("#tiposPagamento");
        $("#numeroOperacaoPagamento").remove();
        let customers = $(".listCustomers ul");
        if($(".break-account").hasClass("active")){
            $(".break-account").click();
        }
        tiposPagamento.find("li").removeClass("active");
        tiposPagamento.find("li").eq(0).addClass("active");
        tiposPagamento.find("li.active").click();
        customers.find("li").removeClass("active");
        $("#montante_entregue, #nif_titular_compra").val("");
        $("#valorTotalTroco").text("0,00");
    },
    calcularTroco:function () {
        let valorPagamento = $("#valorTotalPagamento").text().unFormatter();
        let montanteEntregue = $("#montante_entregue").val().unFormatter() * Number(payment.cambio_taxa);
        if(montanteEntregue >= valorPagamento) {
            this.valorTroco = montanteEntregue - valorPagamento;
            this.valorTroco =  this.valorTroco > 0 ? this.valorTroco.toFixed(2) : 0;
            $("#valorTotalTroco").text(this.valorTroco.formatter());
        }
        else{
            this.valorTroco = 0;
            $("#valorTotalTroco").text("0,00");
        }
    },
    verificarCambio(coin, element){
        $.ajax({
            url: "/api/user/post/current/space",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let espaco = account.post.spaces.find(sp => sp.data.espaco_id === e.space_id);
                espaco = espaco.data.espaco_cambios.find(esp => esp.currency_code === coin);
                if(espaco){
                    payment.cambio_taxa = espaco.cambio_taxa;
                    element.attr("coin", coin);
                    if($("#montante_entregue").val() !== "") {
                        payment.calcularTroco();
                    }
                }
            }
        });
    },
    hasValidData:function(){
        let valorCambio;
        let montanteEntregue;
        if($("#artigosRacharConta").find("li.active").length === 0){
            xAlert("Rachar conta", "Tem que selecionar, pelo menos, um artigo!", "error");
            if(!$(".break-account").hasClass("active")){
                $(".break-account").click();
            }
            return false;
        }
        if($("#tiposPagamento").find("li.active").attr("corrente") !== undefined){
            payment.valorTroco = 0;
            $("#valorTotalTroco").text("0,00");
            if($(".listCustomers ul").find("li.active").length === 0){
                $("#titular_compra").click();
                xAlert("Efetuar pagamento", "Registe um novo cliente ou selecione um cliente existente!", "info");
                return false;
            }
        }
        else{
            if(!validation1($("#montante_entregue"))) return false;
            montanteEntregue = $("#montante_entregue").val().unFormatter();
            valorCambio = Number(montanteEntregue) * Number(payment.cambio_taxa);
            if(Number(valorCambio) < $("#valorTotalPagamento").text().unFormatter()){
                xAlert("Efetuar pagamento", "Montante entregue não cobre a despesa.", "error");
                $("#montante_entregue").focus();
                return false;
            }
        }
        return true;
    },
    mostrarDadosModalPagamento:function(){
        let tiposPagamento = $("#tiposPagamento");
        if(!tiposPagamento.find("li").hasClass("active")) {
            tiposPagamento.find("li:eq(0)").addClass("active");
        }
        $("#valorSubtotalPagamento").text($("#pos_valorSubtotal").text());
        $("#valorTotalPagamento").text($("#pos_valorTotal").text());
        if(account.post.posto_definirmontanteautomaticamente){
            $("#montante_entregue").val($(" #pos_valorTotal ").text()).keyup()
        }
        if(pos.haveAccessGranted("maguita.pos.contacorrente", true)){
            if(tiposPagamento.find("li[corrente]").length === 0){
                tiposPagamento.append(`<li class="flex v-ct waves-effect tgl" tipo_id="5" corrente>
                                      <img src="../assets/img/paymode/finance.svg" alt="">
                                       <span>Conta corrente</span>
                                   </li>`);
            }

        }
        else tiposPagamento.find("li[corrente]").remove();

        showTarget("xModalMakePayment");
    },
    addCustomer(){
        $("[btCliente]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/cliente",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({cliente_titular: $("#cliente_nome_contacorrente").val().trim(),
                cliente_code: $("#cliente_codigo_contacorrente").val().trim() || generateCodeClient(),
                cliente_nif: ($("#cliente_nif_contacorrente").val() || null),
                cliente_contactos: [$("#cliente_telefone_contacorrente").val()],
                cliente_mail: ($("#cliente_email_contacorrente").val().trim() || null)}),
            error(){  $("[btCliente]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[btCliente]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    payment.loadCustomers();
                    xAlert("Registar Cliente", "Cliente registado com sucesso.");
                    $(".ctnRegisterClient").find("input").val("");
                    $(".cancelRegClient").click();
                }
                else xAlert("Registar Cliente",  e.data, "error");
            }
        });
    },
    getArticles(addAccount = true){
        let items = [];
        let artigos = [];
        let quantidade;
        let montanteQuantidade = 0;
        let montanteAgregado = 0;
        $("#artigosRacharConta").find("li").each(function () {
            items = [];
            quantidade = $(this).find("b").attr("amount");
            montanteQuantidade = Number($(this).find(".is-money-text").attr("price")) * quantidade;
            let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("artigo_id")});
            if(addAccount){
                if(!$(this).hasClass("active")){
                    $(this).find("p.extra").each(function () {
                        items.push({
                            venda_artigo_id: $(this).attr("artigo_id"),
                            venda_quantidade:  quantidade,
                            venda_custounitario: $(this).attr("price").unFormatter(),
                            venda_custoquantidade: $(this).attr("custoquantidade")
                        });
                    });
                    artigos.push({
                        venda_artigo_id: $(this).attr("artigo_id"),
                        venda_quantidade: quantidade,
                        venda_custoquantidade : $(this).attr("custoquantidade"),
                        venda_custounitario: $(this).find(".is-money-text").text().unFormatter(),
                        venda_editado: false,
                        venda_montante: montanteQuantidade,
                        venda_montanteagregado: montanteAgregado,
                        venda_montantetotal: (Number(montanteQuantidade) + Number(montanteAgregado)),
                        venda_imposto: result.total_taxa,   venda_montantesemimposto: result.subtotal,
                        venda_montantecomimposto: result.total,
                        venda_impostoadicionar: result.valor_imposto_adicionar,
                        venda_impostoretirar: result.valor_imposto_retirar,
                        venda_descricao: null,
                        venda_lote: null,
                        venda_validade: null,
                        venda_metadata: null,
                        venda_taxas: taxasArtigos.getImpostos($(this).attr("artigo_id")),
                        venda_isencao: false,
                        arg_itens: items
                    });
                }
            }
            else {
                if ($(this).hasClass("active")) {
                    $(this).find("p.extra").each(function () {
                        items.push({
                            venda_id: $(this).attr("venda_id"),
                            venda_artigo_id: $(this).attr("artigo_id"),
                            venda_quantidade: quantidade,
                            venda_custounitario: $(this).attr("price").unFormatter(),
                            venda_custoquantidade: $(this).attr("custoquantidade")
                        });
                    });
                    artigos.push({
                        venda_id: $(this).attr("venda_id"),
                        venda_quantidade: quantidade,
                        venda_custoquantidade: $(this).attr("custoquantidade"),
                        venda_custounitario: $(this).find(".is-money-text").text().unFormatter(),
                        venda_editado: false,
                        venda_montante: montanteQuantidade,
                        venda_montanteagregado: montanteAgregado,
                        venda_montantetotal: (Number(montanteQuantidade) + Number(montanteAgregado)),
                        venda_imposto: result.total_taxa,   venda_montantesemimposto: result.subtotal,
                        venda_montantecomimposto: result.total,
                        venda_impostoadicionar: result.valor_imposto_adicionar,
                        venda_impostoretirar: result.valor_imposto_retirar,
                        venda_descricao: null,
                        venda_lote: null,
                        venda_validade: null,
                        venda_metadata: null,
                        venda_taxas: taxasArtigos.getImpostos($(this).attr("artigo_id")),
                        venda_isencao: false,
                        arg_itens: items
                    });
                }
            }
        });
        return artigos;
    },
    addAccount(){
        let currentFunction = this.addAccount;
        this.addAccount = function () {}
        let conta = {};
        conta.conta_mesa = {
            numero: ($("#numeroMesa").text().trim() === "" || $("#numeroMesa").text().trim() === "N/D" ? null : $("#numeroMesa").text().trim()),
            descricao: null, lotacao: null
        };
        conta.conta_tserie_id = FATURARECIBO;
        conta.conta_extension = {};
        conta.arg_vendas = this.getArticles();
        conta.conta_chave = account.key;

        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error(){$("#posPay").prop("disabled", false)},
            complete(){
                payment.addAccount = currentFunction;
            },
            success(e) {
                $(".fk-body").removeClass("loading");
                $("#posPay").prop("disabled", false);
                if(e.result){
                   if($("#tiposPagamento").find("li.active").attr("corrente") === undefined){
                       xAlert("Conta", "Conta rachada e pagamento efetuado com sucesso.");
                       spaceConfig.operationCode = payment.CODE_OPERATION_FATURA_RECIBO;
                       spaceConfig.account_id = pos.conta_id;
                       spaceConfig.getPrinter({operation: spaceConfig.operationCode});
                   }
                   else{
                       xAlert("Efetuar pagamento", "Fatura enviada para conta corrente.");
                       spaceConfig.operationCode = payment.CODE_OPERATION_FATURA;
                       spaceConfig.account_id = pos.conta_id;
                       spaceConfig.getPrinter({operation: spaceConfig.operationCode});
                   }
                    $("#xModalMakePayment").find(".hideTarget").click();
                    payment.clearData();
                    setTimeout(function () {
                        $("#getBackPos").click();
                    }, 1000);
                }
                else xAlert("Rachar conta",  e.data.message, "error");
            }
        });
    },
    editAccount(){
        let currentFunction = this.editAccount;
        this.editAccount = function () {}
        let conta = {};
        conta.conta_mesa = {
            numero: ($("#numeroMesa").text().trim() === "" || $("#numeroMesa").text().trim() === "N/D" ? null : $("#numeroMesa").text().trim()),
            descricao: null, lotacao: null
        };
        conta.conta_extension = {};
        conta.arg_vendas = this.getArticles(false);
        conta.conta_id = pos.conta_id;
        conta.conta_tserie_id = FATURARECIBO;
        conta.conta_chave = account.key;

        $(".fk-body").addClass("loading");
        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error(){$("#posPay").prop("disabled", false)},
            complete(){
                payment.editAccount = currentFunction;
            },
            success(e) {
                if(e.result){
                    payment.pay();
                }
                else{
                    $(".fk-body").removeClass("loading");
                    $("#posPay").prop("disabled", false);
                    xAlert("Rachar conta",  e.data.message, "error");
                }
            }
        });
    },
    pay(){
        let currentFunction = this.pay;
        this.pay = function () {}
        let dados = {};
        let cliente_nome = $(".listCustomers ul").find("li.active").length !== 0 ? $(".listCustomers ul").find("li.active").text() : null;
        let cliente_id =$(".listCustomers ul").find("li.active").length !== 0 ? $(".listCustomers ul").find("li.active").attr("cliente_id") : null;
        let artigosRacharConta = $("#artigosRacharConta");
        let numeroMesa = $("#numeroMesa");
        let tiposPagamento = $("#tiposPagamento");
        let documento_referencia_pagamento = $("#documento_referencia_pagamento");

        let arg_tserie_id = tiposPagamento.find("li.active").attr("arg_tserie_id");

        if(tiposPagamento.find("li.active").attr("corrente") === undefined){
            dados.deposito = {
                deposito_caixa_id: box.id,
                deposito_tpaga_id: tiposPagamento.find("li.active").attr("tipo_id"),
                deposito_currency_id: null,
                deposito_montantemoeda: tiposPagamento.find("li.active").attr("corrente") !== undefined ? 0 : $("#montante_entregue").val().unFormatter(),
                deposito_data: null,
                deposito_cliente_id: cliente_id,
                deposito_montantetroco: $("#valorTotalTroco").text().unFormatter()
            }
        }
        dados.conta_numero = pos.conta_numero;
        dados.conta_id = pos.conta_id;
        dados.conta_extension = {};
        dados.conta_mesa = {
            numero: (numeroMesa.text().trim() === "" || numeroMesa.text().trim() === "N/D" ? null : numeroMesa.text().trim()),
            descricao: null, lotacao: null
        };
        dados.conta_desconto = null;
        dados.conta_titular = $("#titular_compra").val().trim();
        dados.conta_titularnif = $("#nif_titular_compra").val() || null;
        dados.conta_data = null;
        dados.conta_cliente_id = cliente_id;
        dados.coin = $("#moeda_pagamento").attr("coin") || null;
        dados.guia_documentoperacao = documento_referencia_pagamento.length === 0 ? null : (documento_referencia_pagamento.val().trim() || null);
        dados.guia_observacao = null;
        dados.guia_dataopeacao = null;
        dados.guia_metadata = {};
        dados.custos = [];
        if(!$(".fk-body").hasClass("loading"))
            $(".fk-body").addClass("loading");

        $.ajax({
            url: "/api/pos/pay",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({...dados, arg_tserie_id}),
            error(){$("#posPay").prop("disabled", false)},
            complete(){
                payment.pay = currentFunction;
            },
            success(e) {
                if(e.result){
                    if(artigosRacharConta.find("li").length !== artigosRacharConta.find("li.active").length){
                        account.loadAccountKey().then(value => {
                            account.key = value.accountKey;
                            payment.addAccount();
                        });
                    }
                    else{
                        $(".fk-body").removeClass("loading");
                         spaceConfig.operationCode = tiposPagamento.find("li.active").attr("corrente") === undefined ? payment.CODE_OPERATION_FATURA_RECIBO
                            : payment.CODE_OPERATION_FATURA;
                         spaceConfig.account_id = pos.conta_id;
                         spaceConfig.getPrinter({operation: spaceConfig.operationCode});
                        $("#posPay").prop("disabled", false);
                        if(tiposPagamento.find("li.active").attr("corrente") === undefined){
                            xAlert("Efetuar pagamento", "Pagamento efetuado com sucesso.");
                        }
                        else{
                            xAlert("Efetuar pagamento", "Fatura enviada para conta corrente de "+cliente_nome);
                        }
                        $("#xModalMakePayment").find(".hideTarget").click();
                        payment.clearData();
                        setTimeout(function () {
                            $("#getBackPos").click();
                        }, 1000);
                    }
                }
                else{
                    $(".fk-body").removeClass("loading");
                    xAlert("Efetuar pagamento", e.data, "error");
                }
            }
        });
    },
    determinateTotalValuesSplitAccount() {
        let total = 0;
        let subtotal = 0;
        let result;
        let montanteQuantidade = 0;
        $("#artigosRacharConta").find("li.active").each(function () {
            montanteQuantidade =  Number($(this).find(".is-money-text").attr("price")) * Number($(this).find("b").attr("amount"));
            result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade,
                                            artigo_id: $(this).attr("artigo_id"), article_name: $(this).find("b").attr("name")});
            subtotal = Number(subtotal) + Number(result.subtotal);
            total = Number(total) + Number(result.total);
            $("#valorSubtotalPagamento").text(subtotal.dc().formatter());
            $("#valorTotalPagamento").text(total.dc().formatter());
            if(account.post.posto_definirmontanteautomaticamente){
                $("#montante_entregue").val(total.dc().formatter()).keyup()
            }
        });
    }
};


$("body").on("click", "#moeda_pagamento #changeCoin", function (e) {
    if($(this).closest("div").attr('coin') === "STN"){
        payment.verificarCambio("EUR", $(this).closest("div"));
    }
    else if($(this).closest("div").attr('coin') === "EUR"){
        payment.verificarCambio("USD", $(this).closest("div"));
    }
    else if($(this).closest("div").attr('coin') === "USD") {
        payment.verificarCambio("XAF", $(this).closest("div"));
    }
    else{
        payment.cambio_taxa = 1;
        $(this).closest("div").attr('coin', 'STN');
    }
});
$(".searchCustomers").on("keyup", function () {
    advSearch($(this).val(), $(".listCustomers ul"), $(".listCustomers ul").find("li"));
});

$(".listCustomers ul").on("click", "li", function () {
    if($(this).hasClass("active")){
        $(this).toggleClass("active");
    }
    else{
        $(".listCustomers ul").find("li").removeClass("active");
        $(this).toggleClass("active");
    }
});
$("[selectedCustomer]").on("click", function () {
    let customer = $(".listCustomers ul");
    if(customer.find("li.active").length === 0){
        $("#titular_compra").val("Cliente Final");
        $("#nif_titular_compra").val("").prop("disabled", false);
    }
    else{
        $("#titular_compra").val(customer.find("li.active p").text());
        $("#nif_titular_compra").val((customer.find("li.active").attr("nif_titular") === "null" ? "" :
            customer.find("li.active").attr("nif_titular"))).prop("disabled", true);
    }
    updateMaterializeFields();
    $(".cancelSlctClient").click();
});
$("#efetuar_pagamento").on("click", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(account.post.posto_tposto_id === account.POSTO_VENDA){
                xAlert("Pagamento POS", "Não é permitido efetuar pagamento num posto de pedido.", "error");
                return;
            }
            if(pos.contas.length !== 0) {
                box.loadBox();
                if(payment.clients.length === 0){
                    payment.loadCustomers();
                }
            }
            else{
                M.toast({html: "Adicione e confirme artigos no carrinho!", classes: 'rounded'});
            }
        }
    });
});
$("#tiposPagamento").on("click", "li", function () {
    let tipo_desc = $(this).attr("tipo_desc");
    if(tipo_desc === "cheque" || tipo_desc === "deposito" || tipo_desc === "transferencia" || tipo_desc === "cash" || tipo_desc === "pos" ){
        $("#payAndPrint").text("pagar & imprimir");
        if($("#moeda_pagamento").length === 0){
            $(".payment-inputs").append(`<div class="input-field is-money-field" coin="STN" id="moeda_pagamento">
                                            <input type="text" id="montante_entregue" class="double formatNumber">
                                            <label for="montante_entregue">Montante entregue</label>
                                            <span id="changeCoin"></span>
                                        </div>`);
        }
        if (tipo_desc !== "cash" && tipo_desc !== "pos") {
            if ($("#numeroOperacaoPagamento").length === 0) {
                $(".payment-inputs").append(`<div class="input-field" id="numeroOperacaoPagamento">
                                            <input type="text" id="documento_referencia_pagamento">
                                            <label for="documento_referencia_pagamento">${"Número de " + $(this).attr("tipo_text")}</label>
                                            <span></span>
                                        </div>`);
            } else {
                $("#numeroOperacaoPagamento label").text("Número de " + $(this).attr("tipo_text"));
            }
        }
        else $("#numeroOperacaoPagamento").remove();
    }
    else{
        $("#payAndPrint").text("enviar p/ conta corrente");
        $("#moeda_pagamento, #numeroOperacaoPagamento").remove();
        payment.valorTroco = 0;
        $("#valorTotalTroco").text("0,00");
    }

});
$("[btCliente]").on("click", function () {
    if(!validation1($("#cliente_nome_contacorrente"))) return;
    if($("#cliente_email_contacorrente").val().trim() !== ""){
        if(!isMailValid($("#cliente_email_contacorrente"))){
            xAlert("Registar cliente", "Email inválido.", "error");
            $("#cliente_email_contacorrente").focus();
            return;
        }
    }
    payment.addCustomer();
});
$("#posPay").on("click", function () {
    if($("#tiposPagamento").find("li.active").attr("corrente") === undefined){
        if(serieOperation.missing.includes(serieOperation.tipo.fatura_recibo))
            xAlert("Série de fatura recibo", "Nenhuma série de fatura recibo encontrada.","error");
        else{
            if(spaceConfig.hasPrinter({operation: payment.CODE_OPERATION_FATURA_RECIBO})){
                if(!payment.hasValidData()) return;
                $("#posPay").prop("disabled", true);
                if($("#artigosRacharConta").find("li").length !== $("#artigosRacharConta").find("li.active").length) payment.editAccount();
                else payment.pay();
            }
        }
    }
    else{
        if(serieOperation.missing.includes(serieOperation.tipo.fatura)){
            xAlert("Série de fatura", "Nenhuma série de fatura encontrada.","error");
        }
        else{
            if(spaceConfig.hasPrinter({operation: payment.CODE_OPERATION_FATURA})){
                if(!payment.hasValidData()) return;
                $("#posPay").prop("disabled", true);
                if($("#artigosRacharConta").find("li").length !== $("#artigosRacharConta").find("li.active").length) payment.editAccount();
                else payment.pay();
            }
        }
    }
});
$("body").on("keyup", "#montante_entregue",function () {
    if($(this).val() !== "") payment.calcularTroco();
    else {
        payment.valorTroco = 0;
        $("#valorTotalTroco").text("0,00");
    }
});
$("#artigosRacharConta").on("click", "li", function () {
    $(this).toggleClass("active");
    payment.determinateTotalValuesSplitAccount();
});

