var guiaSaida = {
    tipo_pagamento: 1,
    tipo_grupo: 2,
    stn_currency_id: 141,
    loadAccountKey : () => {
        return new Promise((resolve, reject) =>{
            $.ajax({
                url: "/api/account/key",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({admin: true}),
                success(data) {
                    resolve(data);
                },
                error(error){
                    reject(error);
                }
            });
        });
    },
    get articles_added(){
        let articles_table = [];
        let montanteQuantidade = 0;
        $("[tableDocumentArticles]").find("ul").each(function () {
            montanteQuantidade = Number($(this).find("li").eq(2).text()) * $(this).find("li").eq(5).attr("price").unFormatter();
            let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("article_id")});
            articles_table.push({
                venda_artigo_id: $(this).attr("article_id"),
                venda_descricao: $(this).find("li").eq(1).text(),
                venda_quantidade: $(this).find("li").eq(2).text(),
                venda_custoquantidade : $(this).attr("custoquantidade"),
                venda_custounitario: $(this).find("li").eq(5).attr("price"),
                venda_lote: ($(this).find("li").eq(3).text() || null),
                venda_validade: ($(this).find("li").eq(4).text() === "" ? null : alterFormatDate($(this).find("li").eq(4).text())),
                arg_itens: [],
                venda_editado: false,
                venda_isencao: true,
                venda_montante: montanteQuantidade,
                venda_montanteagregado: 0,
                venda_montantetotal: montanteQuantidade,
                venda_imposto: 0,
                venda_montantesemimposto: result.subtotal,
                venda_montantecomimposto: result.subtotal,
                venda_impostoadicionar: result.valor_imposto_adicionar,
                venda_impostoretirar: result.valor_imposto_retirar,
            });
        });
        return articles_table;
    },
    addAccount(){
        let conta = {};
        conta.conta_mesa = {numero: null, descricao: null, lotacao: null};
        conta.conta_extension = {};
        conta.arg_vendas = this.articles_added;
        conta.conta_chave = guiaSaida.key;
        conta.admin = true;
        $("#finalizar_guia_saida").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error() {$("#finalizar_guia_saida").prop("disabled", false).removeClass("loading")},
            success(e) {
                if(e.result) guiaSaida.registar_saida(e.data.data.conta_montante, e.data.data.conta_id);
                else{
                    xAlert("Guia de Saída", e.data.message, "error");
                    $("#finalizar_guia_saida").prop("disabled", false).removeClass("loading");
                }
            }
        });
    },
    registar_saida(montante, conta_id){
        let GIADEDAIDA = 5;
        let dados = {};
        dados.conta_id = conta_id;
        dados.admin = true;
        dados.conta_extension = {};
        dados.conta_mesa =  { numero: null, descricao:null, lotacao:null };
        dados.conta_desconto = null;
        dados.conta_titular =   $("[cliente_titular]").val().trim();
        dados.conta_titularnif = $("[cliente_nif]").val().trim() || null;
        dados.conta_data = null;
        dados.conta_cliente_id = articlesDocuments.customer_id;
        dados.coin = "STN";
        dados.documento_referencia = null;
        dados.admin = true;
        dados.guia_documentoperacao = null;
        dados.guia_observacao = null;
        dados.guia_dataopeacao = null;
        dados.guia_metadata = {};
        dados.custos = [];
        dados.deposito = {
            deposito_caixa_id: null,
            deposito_tpaga_id: guiaSaida.tipo_pagamento,
            deposito_currency_id: null,
            deposito_montantemoeda: montante,
            deposito_data: null,
            deposito_cliente_id: articlesDocuments.customer_id,
            deposito_montantetroco: 0
        }

        $.ajax({
            url: "/api/pos/pay",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({...dados, arg_tserie_id: GIADEDAIDA}),
            error() {$("#finalizar_guia_saida").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("#finalizar_guia_saida").prop("disabled", false).removeClass("loading");
                if(e.result){
                    $("#GuiaSaida").find("input").val("");
                    $("[tableDocumentArticles]").empty();
                    $("[tableDocumentArticles]").addClass("empty");
                    xAlert("Guia de Saída", "Guia de Saída emitido com sucesso!");
                    articlesDocuments.customer_id = null;
                    open("/api/print/guia_saida/"+JSON.stringify({date: new Date().getTimeStampPt(), guia_uuid: e.data, conta_id: conta_id }));
                }
                else xAlert("Guia de Saída",  e.data, "error");
            }
        });
    },
};
$("#finalizar_guia_saida").on("click", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if($("#colaborador_logado_armazens").find("li.active").attr("posto_admin") === "null"){
                xAlert("Guia de Saída", "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
                return;
            }
            if(articlesDocuments.customer_id === null){
                xAlert("Guia de Saída", "Pesquise um cliente!", "info");
                $("[search_customer]").focus();
                return;
            }
            if($("[tableDocumentArticles]").find(`ul`).length === 0){
                xAlert("Guia de Saída", "Adicione artigos na tabela!", "info");
                return;
            }

            guiaSaida.loadAccountKey().then(value =>{
                guiaSaida.key = value.accountKey;
                guiaSaida.addAccount();
            }).catch(err =>{
                $("#finalizar_fatura").attr("disabled", false).removeClass("loading");
            });
        }
    });
});


