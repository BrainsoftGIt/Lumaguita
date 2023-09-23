M.AutoInit();
var pos = {
    selectedArticle: null,
    selectedCartElement: null,
    contas: [],
    acessos: [],
    conta_id: null,
    conta_numero: null,
    kitchenArticles: [],
    loadAccountData(){
        $(".fk-body").addClass("loading");
        $.ajax({
            url: "/api/pos/account/data",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_conta_id: pos.conta_id}),
            error(){   $(".fk-body").removeClass("loading")},
            success(e) {
                $(".fk-body").removeClass("loading");
                pos.contas = [];
                pos.contas = e.accountData[0].main.conta_vendas;
                pos.conta_numero = e.accountData[0].main?.conta_numero;
                pos.showAccount();
            }
        });
    },
     showAccount:  function (){
        let artigos_carrinho = $("#artigos_carrinho");
        let artigosRacharConta = $("#artigosRacharConta");
        artigos_carrinho.empty();
        artigosRacharConta.empty();
        let itemNome;
         pos.contas.forEach((con) =>{
            artigosRacharConta.append(`<li class="active" artigo_id="${con.artigo_id}" custoquantidade="${con.venda_custoquantidade}" venda_id="${con.venda_id}">
                                        <b amount="${con.venda_quantidade}" name="${con.artigo_nome}">${con.venda_quantidade+" - "+con.artigo_nome}</b>
                                        <p><span class="is-money-text" coin="STN" price="${con.venda_custounitario}">${con.venda_custounitario.formatter()}</span></p>
                                     </li>`);
            artigos_carrinho.append(`<li class="flex h-sb sended" artigo_id="${con.artigo_id}" custoquantidade="${con.venda_custoquantidade}" venda_id="${con.venda_id}" negativo="">
                                            <div class="articleCart">
                                                <b>${con.artigo_nome}</b>
                                                <p class="is-money-text stn"  ${(pos.hasAccessChangePrice("maguita.pos.alterar_preco") ? " contenteditable=true" : "")}
                                                 currentprice="${con.venda_custounitario}">${con.venda_custounitario.formatter()}</p>
                                            </div>
                                            <div class="counter flex v-ct h-ct">
                                               ${(pos.haveAccessGranted("maguita.pos.remover", true) ? '<i class="material-icons waves-effect delete-me" title="Remover">delete</i>' : "")} 
                                               ${(pos.haveAccessGranted("maguita.pos.diminuirQuantidade", true) ? '<i class="material-icons waves-effect reduceAmount" title="Diminuir">remove</i>' : "")} 
                                                <span contenteditable="${(pos.haveAccessGranted("maguita.pos.diminuirQuantidade", true) ? "true" : "false")}" class="amount integer" >${con.venda_quantidade}</span>
                                                <i class="material-icons waves-effect addAmount" title="Aumentar">add</i>
                                            </div>
                                        </li>`);
            con.venda_itens.forEach((item) =>{
                itemNome = Number(item.venda_custounitario) === 0 ? item.artigo_nome : item.artigo_nome+" - "+item.venda_custounitario.formatter();
                artigos_carrinho.find(`li:last .articleCart`).append(`<p venda_id="${item.venda_id}" artigo_id="${item.artigo_id}" price="${item.venda_custounitario}" class="extra" custoquantidade="${item.venda_custoquantidade}">${itemNome}</p>`);
                artigosRacharConta.find("li:last").append(`<p venda_id="${item.venda_id}" artigo_id="${item.artigo_id}" price="${item.venda_custounitario}" custoquantidade="${item.venda_custoquantidade}" class="extra">${itemNome}</p>`);
            });
        });
          pos.determinateTotalValues();
    },
    get articlesForKitchen(){
      return pos.contas.filter(con => con.venda_estadopreparacao === 1);
    },
    loadArticleItems(){
        $.ajax({
            url: "/api/items/artigo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_artigo_id: pos.selectedArticle.artigo_id}),
            success(e) {
                let itensExtraArtigo = $("#itensExtraArtigo");
                itensExtraArtigo.empty();
                $("[artigoExtraNome]").text(pos.selectedArticle.artigo_nome);
                e.items.forEach((item) =>{
                    item = item.data;
                    itensExtraArtigo.append(`<li class="flex v-ct h-sb stgl pointer" artigo_id="${item.artigo_id}" price="${item.link_metadata.precario_custo}" custoquantidade="${item.link_metadata.precario_quantidade}">
                                                <div class="flex v-ct">
                                                    <i class="material-icons">done</i>
                                                    <span class="nome">${item.artigo_nome}</span>
                                                </div>
                                                <span class="${(Number(item.link_metadata.precario_custo) === 0 ? "" : "is-money-text")}" coin="STN">
                                                    ${(Number(item.link_metadata.precario_custo) === 0 ? "" : item.link_metadata.precario_custo.formatter())}
                                                </span>
                                            </li>`);
                });
                $('.give-me-extras').addClass('show');
            }
        });
    },
    increaseQuantity(){
        let quantidadeCarrinho = Number(this.selectedCartElement.find("span.amount").text());
        quantidadeCarrinho = quantidadeCarrinho + 1;
        this.selectedCartElement.find("span.amount").text(quantidadeCarrinho);
        pos.determinateTotalValues();
    },
    removeInCart(){
        this.selectedCartElement.remove();
        pos.determinateTotalValues();
    },
    reduceQuantity(){
        let quantidadeCarrinho = Number(this.selectedCartElement.find("span.amount").text());
        if((quantidadeCarrinho -1) !== 0) {
            this.selectedCartElement.find("span.amount").text((Number(quantidadeCarrinho) -1));
        }
        this.determinateTotalValues();
    },
    addToCart(){
        let artigos_carrinho = $("#artigos_carrinho");
        let item;
        artigos_carrinho.prepend(`<li class="flex h-sb" artigo_id="${this.selectedArticle.artigo_id}"  custoquantidade="${this.selectedArticle.link_metadata.precario_quantidade}">
                                            <div class="articleCart">
                                                <b>${this.selectedArticle.artigo_nome}</b>
                                                <p class="is-money-text stn"  ${(pos.hasAccessChangePrice("maguita.pos.alterar_preco") ? " contenteditable=true" : "")} currentprice="${this.selectedArticle.link_metadata.precario_custo}">${this.selectedArticle.link_metadata.precario_custo.formatter()}</p>
                                            </div>
                                            <div class="counter flex v-ct h-ct">
                                                <i class="material-icons waves-effect delete-me" title="Remover">delete</i>
                                                <i class="material-icons waves-effect reduceAmount" title="Diminuir">remove</i>
                                                <span contenteditable="true" class="amount integer" >1</span>
                                                <i class="material-icons waves-effect addAmount" title="Aumentar">add</i>
                                            </div>
                                        </li>`);
        $("#itensExtraArtigo").find("li.active").each(function () {
            item = Number($(this).attr("price")) === 0 ? $(this).find("span.nome").text() : $(this).find("span.nome").text()+" - "+$(this).attr("price").formatter();
            artigos_carrinho.find(`li:first .articleCart`).append(`<p artigo_id="${$(this).attr("artigo_id")}" price="${$(this).attr("price")}" class="extra" custoquantidade="${$(this).attr("custoquantidade")}">${item}</p>`);
        });
        this.determinateTotalValues();
    },
    hasArticleInCart({artigo_id}){
        let itemsSelecionados = [];
        let itemsCarrinho = [];
        let itensExtraArtigo = $("#itensExtraArtigo");
        let artigoCarrinho = $("#artigos_carrinho");
        let foundArticle = false;

        if(itensExtraArtigo.find("li.active").length === 0){
            artigoCarrinho.find("li").each(function () {
                if(artigo_id === $(this).attr("artigo_id")
                    && $(this).find("p.extra").length === 0
                    && !$(this).hasClass("sended")){
                    foundArticle = true;
                    pos.selectedCartElement = $(this);
                }
            });
            return foundArticle;
        }
        else{
            itensExtraArtigo.find("li.active").each(function () {
                itemsSelecionados.push($(this).attr("artigo_id"));
            });
            artigoCarrinho.find("li").each(function () {
                if(artigo_id === $(this).attr("artigo_id") && !$(this).hasClass("sended")){
                    itemsCarrinho = [];
                    $(this).find("p.extra").each(function () {
                        itemsCarrinho.push($(this).attr("artigo_id"));
                    });
                    itemsCarrinho.sort(function(a, b){
                        return parseInt(a) < parseInt(b) ? -1 : 1;
                    });
                    itemsSelecionados.sort(function(a, b){
                        return parseInt(a) < parseInt(b) ? -1 : 1;
                    });
                    if(JSON.stringify(itemsCarrinho) === JSON.stringify(itemsSelecionados)) {
                        foundArticle = true;
                        pos.selectedCartElement = $(this);
                    }
                }
            });
            return foundArticle;
        }
    },
     determinateTotalValues(){
        let valorPorArtigo = 0;
        let quantidade = 0;
        let artigos_carrinho = $("#artigos_carrinho");
        let subtotal = 0;
        let total = 0;
        let result;
        let articles = [];

        artigos_carrinho.find("li").each(function () {
            quantidade = Number(unformatted(replaceComma( $(this).find("span.amount").text())));
            valorPorArtigo = unformatted($(this).find("p.is-money-text").attr("currentprice")) * Number(quantidade);
            $(this).find("p.extra").each(function () {
                valorPorArtigo = Number(valorPorArtigo) + (Number(unformatted(replaceComma($(this).attr("price")))) * Number(quantidade));
            });
            if(taxasArtigos.taxs.find(value => value.artigo_id === $(this).attr("artigo_id"))){
                result = taxasArtigos.calculateValues({montanteQuantidade: valorPorArtigo, artigo_id: $(this).attr("artigo_id"), article_name: $(this).find("b").text()});
                subtotal = Number(subtotal) + Number(result.subtotal);
                total = Number(total) + Number(result.total);

                $("#pos_valorSubtotal").text(subtotal.dc().formatter());
                $("#pos_valorTotal").text(total.dc().formatter());
            }
            else{
                articles.push({artigo_id: $(this).attr("artigo_id"), montanteQuantidade: valorPorArtigo});
            }
        });
         if(articles.length > 0){
             let articles_id = $.map(articles, function(value, index) {
                 return value.artigo_id;
             });
             taxasArtigos.loadArticleTax({article_id: articles_id}).then(values => {
                 values.tax.forEach((imp) =>{
                     taxasArtigos.addTax(imp.main, imp.main.artigo_id);
                 });
                 articles.forEach((art) =>{
                     result = taxasArtigos.calculateValues({montanteQuantidade: art.montanteQuantidade, artigo_id: art.artigo_id, article_name: null});
                     subtotal = Number(subtotal) + Number(result.subtotal);
                     total = Number(total) + Number(result.total);

                     $("#pos_valorSubtotal").text(subtotal.dc().formatter());
                     $("#pos_valorTotal").text(total.dc().formatter());
                 });
             }).catch(error =>{
                 console.log(error);
             });
         }

        if(artigos_carrinho.find("li").length === 0){
            $("#total_articles_cart").text("");
            $("#pos_valorSubtotal, #pos_valorTotal").text("0,00");
        }
        else $("#total_articles_cart").text((artigos_carrinho.find("li").length === 1 ? "1 artigo" : $("#artigos_carrinho").find("li").length + " artigos"));
    },
    getArticlesAccount(addAccount = true){
        let items = [];
        let artigos = [];
        let quantidade;
        let montanteQuantidade = 0;
        let montanteItemAgregado = 0;
        $("#artigos_carrinho").find("li").each(function () {
            items = [];
            quantidade = Number(unformatted(replaceComma( $(this).find("span.amount").text())));
            montanteQuantidade = Number(quantidade) * $(this).find("p.is-money-text").text().unFormatter();

            if(addAccount){
                $(this).find("p.extra").each(function () {
                    items.push({
                        venda_artigo_id: $(this).attr("artigo_id"),
                        venda_quantidade:  quantidade,
                        venda_custounitario: $(this).attr("price").unFormatter(),
                        venda_custoquantidade: $(this).attr("custoquantidade"),
                        venda_montante : (Number(quantidade) * $(this).attr("price").unFormatter()),
                        venda_montantetotal: (Number(quantidade) * $(this).attr("price").unFormatter()),
                        venda_isencao: false
                    });
                    montanteQuantidade = Number(montanteQuantidade) + (Number(unformatted(replaceComma($(this).attr("price")))) * quantidade);
                    montanteItemAgregado = Number(montanteItemAgregado) + (Number(unformatted(replaceComma($(this).attr("price")))) * quantidade);
                });
                let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("artigo_id")});
                artigos.push({
                    venda_artigo_id: $(this).attr("artigo_id"),
                    venda_quantidade: quantidade,
                    venda_custoquantidade : $(this).attr("custoquantidade"),
                    venda_custounitario: $(this).find("p.is-money-text").text().unFormatter(),
                    venda_editado: false,
                    venda_montante: montanteQuantidade,
                    venda_montanteagregado: montanteItemAgregado,
                    venda_montantetotal: (Number(montanteQuantidade) + Number(montanteItemAgregado)),
                    venda_imposto: result.total_taxa,
                    venda_montantesemimposto: result.subtotal,
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
            else{
                $(this).find("p.extra").each(function () {
                    items.push({
                        venda_id: $(this).attr("venda_id"),
                        venda_artigo_id: $(this).attr("artigo_id"),
                        venda_quantidade:  quantidade,
                        venda_custounitario: $(this).attr("price").unFormatter(),
                        venda_custoquantidade: $(this).attr("custoquantidade"),
                        venda_montante : (Number(quantidade) * $(this).attr("price").unFormatter()),
                        venda_montantetotal: (Number(quantidade) * $(this).attr("price").unFormatter()),
                        venda_isencao: false
                    });
                    montanteQuantidade = Number(montanteQuantidade) + (Number(unformatted(replaceComma($(this).attr("price")))) * Number(quantidade));
                    montanteItemAgregado = Number(montanteItemAgregado) + (Number(unformatted(replaceComma($(this).attr("price")))) * Number(quantidade));
                });
                let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("artigo_id")});
                artigos.push({
                    venda_id: $(this).attr("venda_id"),
                    venda_artigo_id: $(this).attr("artigo_id"),
                    venda_quantidade: quantidade,
                    venda_custoquantidade : $(this).attr("custoquantidade"),
                    venda_custounitario: $(this).find("p.is-money-text").text().unFormatter(),
                    venda_editado: false,
                    venda_montante: montanteQuantidade,
                    venda_montanteagregado: montanteItemAgregado,
                    venda_montantetotal: (Number(montanteQuantidade) + Number(montanteItemAgregado)),
                    venda_imposto: result.total_taxa,
                    venda_montantesemimposto: result.subtotal,
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

        });
        return artigos;
    },
    registerAccount(){
        let currentFunction = this.registerAccount;
        this.registerAccount = function () {}
        let conta = {};
        conta.conta_mesa = {numero: ($("#numeroMesa").text().trim() === "" || $("#numeroMesa").text().trim() === "N/D" ? null : $("#numeroMesa").text().trim() ),
            descricao: null, lotacao: null};
        conta.conta_extension = {};
        conta.arg_vendas = this.getArticlesAccount();
        conta.conta_chave = account.key;
        $("body").addClass("loading");
        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error() {
                $("body").removeClass("loading");
            },
            complete(){
                pos.registerAccount = currentFunction;
            },
            success(e) {
                $("body").removeClass("loading");
                if(e.result){
                    pos.contas = [];
                    pos.contas = e.data.data.conta_vendas;
                    pos.conta_numero = e.data.data.conta_numero;
                    pos.conta_id = e.data.data.conta_id;
                    M.toast({html: 'Conta criada com sucesso.', classes: 'rounded'});
                    pos.showAccount();
                    pos.kitchenArticles = pos.articlesForKitchen;
                    if(pos.kitchenArticles.length > 0){
                        $("#kitchen_obs").val("");
                        showTarget("xModalKuchenObservation", "");
                    }
                }
                else M.toast({html: e.data.message, classes: 'rounded'});
            }
        });
    },
    updateAccount(){
        let currentFunction = this.updateAccount;
        this.updateAccount = function () {}
        let conta = {};
        conta.conta_mesa = {numero: ($("#numeroMesa").text().trim() === "" || $("#numeroMesa").text().trim() === "N/D" ? null : $("#numeroMesa").text().trim() ),
            descricao: null, lotacao: null};
        conta.conta_extension = {};
        conta.arg_vendas = this.getArticlesAccount(false);
        conta.conta_id = this.conta_id;
        conta.conta_chave = account.key;

        $("body").addClass("loading");
        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error() {
                $("body").removeClass("loading")
            },
            complete(){
                pos.updateAccount = currentFunction;
            },
            success(e) {
                $("body").removeClass("loading");
                if(e.result){
                    pos.contas = [];
                    pos.contas = e.data.data.conta_vendas;
                    pos.conta_numero = e.data.data.conta_numero;
                    M.toast({html: 'Conta atualizada com sucesso.', classes: 'rounded'});
                    pos.showAccount();
                    pos.kitchenArticles = pos.articlesForKitchen;
                    if(pos.kitchenArticles.length > 0){
                        $("#kitchen_obs").val("");
                        showTarget("xModalKuchenObservation", "");
                    }
                }
                else M.toast({html: e.message, classes: 'rounded'});
            }
        });
    },
    hasAccessChangePrice(accessCode){
        return pos.acessos.find(ac => ac.menu_codigo === accessCode) !== undefined;
    },
    haveAccessGranted(accessCode, sended){
        if(sended) return pos.acessos.find(ac => ac.menu_codigo === accessCode) !== undefined;
        else return true;
    },
    anularConta(){
        $("#confirmarAnularConta").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/pos/conta/anular",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_conta_id: pos.conta_id, arg_conta_observacao: $("#anular_conta_obs").val().trim()}),
            error() {
                $("#confirmarAnularConta").prop("disabled", false).removeClass("loading")
            },
            success(e) {
                $("#confirmarAnularConta").prop("disabled", false).removeClass("loading");
                if(e.result){
                    $("#anular_conta_obs").val("");
                    $("#xModalAnularConta").find                     (".hideTarget").click();
                     xAlert("Anular conta", "Conta anulada com sucesso!");
                    $("#getBackPos").click();
                }
                else xAlert("Anular conta", e.data, "error");
            }
        });
    },
    printKitchen(){
        $.ajax({
            url: "/api/print/kitchen",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({articles: pos.kitchenArticles, table: $("#numeroMesa").text().trim(),
                date: new Date().getTimeStampPt(), obs: ($("#kitchen_obs").val().trim() || null)}),
            success(e) {
                pos.changeSaleStatus();
            }
        });
    },
    changeSaleStatus(){
        let vendas = pos.articlesForKitchen.map(value => {return value.venda_id;});
        $.ajax({
            url: "/api/change/sale/status",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_vendas: vendas, arg_conta_id: pos.conta_id}),
            success(e) {}
        });
    }
};

$("#artigos_carrinho").on("click", ".reduceAmount",function () {
    pos.selectedCartElement = $(this).parents("li");
    if(pos.haveAccessGranted("maguita.pos.diminuirQuantidade", pos.selectedCartElement.hasClass("sended"))) pos.reduceQuantity();
    else M.toast({html: 'Sem privilégio para reduzir quantidade de artigo depois de confirmado.', classes: 'rounded'});
}).on("click", ".addAmount", function () {
    pos.selectedCartElement = $(this).parents("li");
    pos.increaseQuantity();
}).on("click", ".delete-me", function () {
    pos.selectedCartElement = $(this).parents("li");
    if(pos.haveAccessGranted("maguita.pos.remover", pos.selectedCartElement.hasClass("sended"))) pos.removeInCart();
    else M.toast({html: 'Sem privilégio para remover artigo depois de confirmado.', classes: 'rounded'});
}).on("input", "[contenteditable]", function () {
    pos.determinateTotalValues();
}).on("blur", "[contenteditable]", function () {
    setTimeout(() =>{
        if(!$.isNumeric( $(this).text())){
            $(this).text($(this).attr("currentprice"));
            pos.determinateTotalValues();
        }
    }, 100);
});
$("#btAdicionarExtra").on("click", function () {
    if(pos.hasArticleInCart({artigo_id: pos.selectedArticle.artigo_id})){
        pos.increaseQuantity();
    }
    else{
        if(pos.haveAccessGranted("maguita.pos.adicionar", $("#artigos_carrinho").find("li.sended").length > 0))
            pos.addToCart();
        else M.toast({html: 'Sem privilégio para adicionar artigo depois de confirmado.', classes: 'rounded'});
    }
});
$("#registarAtualizarConta").on("click", function () {
    if($("#artigos_carrinho").find("li").length !== 0){
        if(pos.contas.length === 0) pos.registerAccount();
        else pos.updateAccount();
    }
    else M.toast({html: "Adicione artigos no carrinho!", classes: 'rounded'});
});
$("#anularConta").on("click", function () {
    if($("#artigos_carrinho").find("li.sended").length > 0){
        if(pos.haveAccessGranted("maquita.pos.anularconta", true)){
            showTarget("xModalAnularConta", "Anular conta");
            $("#anular_conta_obs").focus();
        }
        else M.toast({html: 'Sem privilégio para anular conta.', classes: 'rounded'});
    }
});
$("#getBackPos").on("click", function () {
    $("#theIDOfSlctAccWoutLgn").find(".hideTarget").click();
    account.loadPost();
    $("#asideCarrinho").removeClass("isProforma");
    payment.clients = [];
    location.hash = "";
});

$("#confirmarAnularConta").on("click", function () {
    if(pos.haveAccessGranted("maquita.pos.anularconta", true)){
        if($("#anular_conta_obs").val().trim() === "")
            M.toast({html: 'Digite o motivo para anular a conta', classes: 'rounded'});
        else
            pos.anularConta();
    }
    else M.toast({html: 'Sem privilégio para anular conta.', classes: 'rounded'});
});
$("[btPrintKitchen]").on("click", function () {
    pos.printKitchen();
    $("#xModalKuchenObservation .hideTarget").click();
});
