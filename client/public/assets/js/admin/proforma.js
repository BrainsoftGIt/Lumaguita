var proformaAdmin = {
    key: null,
    loadAccountKey(){
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
        let semImposto = $("[isencaoImposto]").hasClass("active");
        $("[tableDocumentArticles]").find("ul").each(function () {
            montanteQuantidade = Number($(this).find("li").eq(2).text()) * $(this).find("li").eq(6).attr("price").unFormatter();
            let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("article_id")});
            articles_table.push({
                venda_artigo_id: $(this).attr("article_id"),
                venda_descricao: $(this).find("li").eq(1).text(),
                venda_quantidade: $(this).find("li").eq(2).text(),
                venda_custoquantidade : $(this).attr("custoquantidade"),
                venda_custounitario: $(this).find("li").eq(6).attr("price"),
                venda_lote: ($(this).find("li").eq(3).text() || null),
                venda_validade: ($(this).find("li").eq(4).text() === "" ? null : alterFormatDate($(this).find("li").eq(4).text())),
                venda_editado: false,
                venda_isencao: semImposto,
                venda_montante: montanteQuantidade,
                venda_montanteagregado: 0,
                venda_montantetotal: montanteQuantidade,
                venda_imposto: (semImposto ? 0 : result.total_taxa),
                venda_montantesemimposto: result.subtotal,
                venda_montantecomimposto: (semImposto ? result.subtotal : result.total),
                venda_impostoadicionar: result.valor_imposto_adicionar,
                venda_impostoretirar: result.valor_imposto_retirar,
                arg_itens: [],
                venda_taxas: taxasArtigos.getImpostos($(this).attr("article_id"))
            });
        });
        return articles_table;
    },
    add_account(){
        let PROFORMA = 6;
        let conta = {};
        conta.conta_mesa = {numero: null, descricao: null, lotacao: null};
        conta.conta_extension = {};
        conta.arg_vendas = this.articles_added;
        conta.admin = true;
        conta.conta_tserie_id = PROFORMA;
        conta.conta_chave = proformaAdmin.key;
        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error() {$("#finalizar_proforma").prop("disabled", false).removeClass("loading")},
            success(e) {
                if(e.result) proformaAdmin.registar_proforma({conta_id: e.data.data.conta_id})
                else{
                    xAlert("Fatura", e.data.message, "error");
                    $("#finalizar_proforma").prop("disabled", false).removeClass("loading");
                }
            }
        });
    },
    registar_proforma({conta_id}){
        let conta_data = ($("#proforma_admin_data_emissao").val() !== "" ? alterFormatDate($("#proforma_admin_data_emissao").val()) : null);
        $.ajax({
            url: "/api/pos/conta/proforma",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                conta_data,
                conta_id: conta_id,
                conta_cliente_id: articlesDocuments.customer_id, admin: true,
                conta_proformavencimento: ($("#proforma_admin_data_vencimento").val() !== "" ? alterFormatDate($("#proforma_admin_data_vencimento").val()) : null),
                conta_proformaextras: {
                    termos: ($("#proforma_admin_termos").val().trim() || null),
                    data_emissao: conta_data
                }
            }),
            error(){$("#finalizar_proforma").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("#finalizar_proforma").prop("disabled", false).removeClass("loading");
                if(e.result){
                    xAlert("Fatura Proforma", "Proforma emitida com sucesso!");
                    $("[isencaoImposto]").removeClass("active");
                    $("#proformaAdminBody").find("input, textarea").val("");
                    $("[tableDocumentArticles]").empty();
                    $("[tableDocumentArticles]").addClass("empty");
                    articlesDocuments.customer_id = null;
                    open("/api/print/proforma/"+JSON.stringify({type: "pdf", conta_id: conta_id, date: new Date().getTimeStampPt() }));
                }
                else xAlert("Fatura Proforma", e.data, "error");
            }
        });
    }
};

$("#finalizar_proforma").on("click", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if($("#colaborador_logado_armazens").find("li.active").attr("posto_admin") === "null"){
                xAlert("Proforma", "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
                return;
            }
            if(articlesDocuments.customer_id === null){
                xAlert("Fatura proforma", "Pesquise um cliente!", "info");
                $("[search_customer]").focus();
                return;
            }
            if($("[tableDocumentArticles]").find(`ul`).length === 0){
                xAlert("Fatura proforma", "Adicione artigos na tabela!", "info");
                return;
            }
            $("#finalizar_proforma").attr("disabled", true).addClass("loading");
            proformaAdmin.loadAccountKey().then(value1 => {
                proformaAdmin.key = value1.accountKey;
                proformaAdmin.add_account();
            }).catch(err =>{
                $("#finalizar_proforma").attr("disabled", false).removeClass("loading");
            });
        }
    });
});
