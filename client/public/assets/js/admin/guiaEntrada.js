var guiaEntrada = {
    fornecedor_id: null,
    fornecedores: [],
    loadProviders(){
        $.ajax({
            url: "/api/fornecedores",
            method: "GET",
            contentType: "application/json",
            success(e) {
                guiaEntrada.fornecedores = [];
                guiaEntrada.fornecedores = e.provds;
                let guiaEntradaFornecedores = $("#guiaEntradaFornecedores");
                guiaEntradaFornecedores.empty();
                guiaEntrada.fornecedores.forEach((forn)=>{
                    guiaEntradaFornecedores.append(`<option  data-id=${forn.funct_load_fornecedor.fornecedor_id} data-value="${forn.funct_load_fornecedor.fornecedor_nome}">${forn.funct_load_fornecedor.fornecedor_nome}</option>`);
                });
            }
        });
    },
    load_spaces(){
        $.ajax({
            url: "/api/article/warehouses",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let armazens_entrada = $("#armazens_entrada");
                armazens_entrada.empty();
                e.armazens.forEach((arm) =>{
                    arm = arm.funct_load_espaco_simple;
                    armazens_entrada.append(`<li class="tgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                });
            }
        });
    },
    clearAllData(){
        guiaEntrada.fornecedor_id = null;
        $("#guiaEntradaBody").find("input, textarea").val("");
        $("[tableDocumentArticles]").empty();
        $("[tableDocumentArticles]").addClass("empty");
        $("#entrada_codigofatura").val("");
        $("#armazens_entrada").find("li").removeClass("active");
    },
    registar_entrada(){
        const artigos_entrada = this.artigosEntradasSelecionados;
        $.ajax({
            url: "/api/artigos/entrada",
            method: "POST",
            contentType: "application/json",
            error() { $("#finalizar_guia_entrada").attr("disabled", false).removeClass("loading") },
            complete() { $("#finalizar_guia_entrada").attr("disabled", false).removeClass("loading") },
            data: JSON.stringify({ arg_espaco_destino: $("#armazens_entrada").find("li.active").attr("armazem_id"),
                arg_entradas: artigos_entrada, guia_refuid: this.fornecedor_id, guia_documentoperacao: null,
                arg_entrada_codigofatura: ($("#entrada_codigofatura").val().trim() || null),
                custos: ($("#entraSeguroTarifas").val() === "" ? [] : [{custoguia_montante: $("#entraSeguroTarifas").val().unFormatter(),
                    custoguia_descricao: "Seguro e tarifas de transporte", custoguia_tcusto_id: 1}]),
                guia_metadata: {},
                guia_dataopeacao: alterFormatDate($("#entrada_data_compra").val()), guia_observacao: ($("#entrada_obs").val().trim() || null)}),
            success(e) {
                $("#finalizar_guia_entrada").attr("disabled", false).removeClass("loading");
                if(e.result){
                    guiaEntrada.clearAllData();
                    xAlert("Guia de Entrada", "Entrada registada com sucesso!");
                    open("/api/print/guia_entrada/"+JSON.stringify({guia_uuid: e.guia_uuid}));
                }
                else xAlert("Guia de Entrada", e.message, "error");
            }
        });
    },
    get artigosEntradasSelecionados(){
        let artigos = [];
        $("[tableDocumentArticles]").find("ul").each(function () {
            artigos.push({artigo_id: $(this).attr("article_id"),
                entrada_quantidade: $(this).find("li").eq(1).text(),
                entrada_lote: ($(this).find("li").eq(3).text() || null),
                entrada_validade_ddmmyy: ($(this).find("li").eq(4).text() || null),
                entrada_validade: ($(this).find("li").eq(4).text() === "" ? null : alterFormatDate($(this).find("li").eq(4).text())),
                entrada_descricao: $(this).find("li").eq(0).text(),
                entrada_custounitario: $(this).find("li").eq(2).attr("price"), entrada_metadata: {}});
        });
        return artigos;
    },
};

guiaEntrada.load_spaces();
guiaEntrada.loadProviders();

$("#entrada_fornecedor").on("keyup", function(){
    let fornecedor_uuid;
    if($(this).val().trim() === "") return;
    fornecedor_uuid = $("#guiaEntradaFornecedores").find(`option[data-value="${$(this).val()}"]`).attr("data-id") || null;
    let fornecedor  = guiaEntrada.fornecedores.filter(fon => fon.funct_load_fornecedor.fornecedor_id === fornecedor_uuid)
    if(fornecedor.length > 0){
        guiaEntrada.fornecedor_id = fornecedor[0].funct_load_fornecedor.fornecedor_id;
        $("#guiaEntradaNomeFornecedor").val(fornecedor[0].funct_load_fornecedor.fornecedor_nome);
        $("#guiaEntradaNifFornecedor").val((fornecedor[0].funct_load_fornecedor.fornecedor_nif || ""));
        $("#guiaEntradaTelefoneFornecedor").val((fornecedor[0].funct_load_fornecedor.fornecedor_contacto || ""));
        $("#guiaEntradaEnderecoFornecedor").val((fornecedor[0].funct_load_fornecedor.fornecedor_endereco || ""));
    }
    else {
        guiaEntrada.fornecedor_id = null;
        $("#guiaEntradaNomeFornecedor, #guiaEntradaNifFornecedor, #guiaEntradaTelefoneFornecedor, #guiaEntradaEnderecoFornecedor").val("");
    }
});
$("#finalizar_guia_entrada").on("click",function (e) {
    if($("#entrada_fornecedor").val().trim() === ""){
        guiaEntrada.fornecedor_id = null;
    }
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(guiaEntrada.fornecedor_id === null){
                xAlert("Guia de Entrada", "Pesquise um fornecedor!", "info");
                $("#codigo_fornecedor").focus();
                return;
            }
            if($("#armazens_entrada").find("li.active").length === 0){
                xAlert("Guia de Entrada", "Selecione o armazém de destino", "info");
                return;
            }
            if(!validation1($("#entrada_data_compra"))) return;
            let regExp = /[a-zA-Z]/g;
            if (regExp.test($("#entrada_data_compra").val())) {
                xAlert("Guia de Entrada", "Digite a data de compra!", "info");
                $("[entrada_data_compra]").focus();
                return;
            }
            if($("[tableDocumentArticles]").find(`ul`).length === 0){
                xAlert("Guia de Entrada", "Adicione artigos na tabela!", "info");
                return;
            }
            guiaEntrada.registar_entrada();
        }
    });
});