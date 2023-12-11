var transference = {
    list: [],
    load_spaces(){
        $.ajax({
            url: "/api/article/warehouses",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let armazens_transferencia = $("[armazens_transferencia]");
                armazens_transferencia.empty();
                transference.list = [];
                transference.list = e.armazens;
                e.armazens.forEach((arm) =>{
                    arm = arm.funct_load_espaco_simple;
                    armazens_transferencia.append(`<li class="tgl" armazem_id="${arm.espaco_id}" codigo="${arm.espaco_codigo}">${arm.espaco_nome}</li>`);
                });
            }
        });
    },
    get selectedArticlesTransfer(){
        let articlesTransfer = [];
        let modal = window.xModalGeral || ""
        $(`${modal} [tableDocumentArticles]`).find("ul").each(function () {
            articlesTransfer.push({
                artigo_id: $(this).attr("article_id"),
                transferencia_quantidade: $(this).find("li").eq(2).text(),
                artigo_codigo: $(this).find("li").eq(0).text(),
                artigo_nome: $(this).find("li").eq(1).text()
            });
        });
        return articlesTransfer;
    },
    transferir(){
        let modal = window.xModalGeral || ""
        $("#finalizar_transferencia").attr("disabled", true).addClass("loading");
        let armazem_saida = $(`${modal} #armazem_saida`);
        let armazem_entrada = $(`${modal} #armazem_entrada`);
        let transferencia_data = $(`${modal} #transferencia_data`).val().trim() || null;
        $.ajax({
            url: "/api/artigos/transferir",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                arg_espaco_origem: armazem_saida.find("li.active").attr("armazem_id"),
                arg_espaco_origem_nome: armazem_saida.find("li.active").text(),
                arg_espaco_destino: armazem_entrada.find("li.active").attr("armazem_id"),
                arg_espaco_destino_nome: armazem_entrada.find("li.active").text(),
                arg_espaco_origem_codigo: armazem_saida.find("li.active").attr("codigo"),
                arg_espaco_destino_codigo: armazem_entrada.find("li.active").attr("codigo"),
                arg_transferencia_data: (transferencia_data === null ? null : alterFormatDate(transferencia_data)),
                arg_transferencia_documento: ($(`${modal} #transferencia_documento`).val().trim() || null),
                arg_transferencia_observacao: ($(`${modal} #transferencia_obs`).val().trim() || null), arg_transferencias: this.selectedArticlesTransfer}),
            error() { $("#finalizar_transferencia").attr("disabled", false).removeClass("loading") },
            complete() { $("#finalizar_transferencia").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("#finalizar_transferencia").attr("disabled", false).removeClass("loading");
                if(e.result){
                    Documents.open({
                        data: "/api/print/transference/"+JSON.stringify({date: (transferencia_data === null ? new Date().getDatePt() : transferencia_data), file: e.file}),
                        name: "Transferencia"
                    });
                    $(`${modal} [tableDocumentArticles]`).empty().addClass("empty");
                    $(`${modal} #transferArticlesBody`).find("input, textarea").val("");
                    xAlert("Transferir artigos", "Artigos transferidos com sucesso!");
                }
                else xAlert("Transferir artigos", e.message, "error",  10);
            }
        });
    }
};

transference.load_spaces();

$("[codigo_armazens]").on("keyup", function (e) {
    let codigo = $(this).val().trim();
    let element_id = $(this).attr("id");
    let modal = window.xModalGeral || ""
     setTimeout(function(){
        if(codigo !== ""){
            let armazem = transference.list.filter(arm => arm.funct_load_espaco_simple.espaco_codigo === codigo);
            if(armazem.length > 0){
                if(element_id === "codigo_armazem_saida"){
                    $(`${modal} #armazem_saida li`).removeClass("active");
                    $(`${modal} #armazem_saida`).parents(".xselect").find("input").val(armazem[0].funct_load_espaco_simple.espaco_nome);
                    $(`${modal} #armazem_saida li[armazem_id=${armazem[0].funct_load_espaco_simple.espaco_id}]`).addClass("active");
                }
                else{
                    $(`${modal} #armazem_entrada li`).removeClass("active");
                    $(`${modal} #armazem_entrada`).parents(".xselect").find("input").val(armazem[0].funct_load_espaco_simple.espaco_nome);
                    $(`${modal} #armazem_entrada li[armazem_id=${armazem[0].funct_load_espaco_simple.espaco_id}]`).addClass("active");
                }
            }
        }
    }, 800);
});

$("#finalizar_transferencia").on("click", function () {
    let modal = window.xModalGeral || ""
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if($(` ${modal} #armazem_saida `).find("li.active").length === 0){
                xAlert("Transferir artigos", "Selecione o armazém de saída", "info");
                return;
            }
            if($(`${modal} #armazem_entrada`).find("li.active").length === 0){
                xAlert("Transferir artigos", "Selecione o armazém de entrada", "info");
                return;
            }
            if($(`${modal} #armazem_saida`).find("li.active").attr("armazem_id") === $(`${modal} #armazem_entrada `).find("li.active").attr("armazem_id")) {
                xAlert("Transferir artigos", "Armazém de origem e destino devem ser diferentes", "error");
                return;
            }
            let regExp = /[a-zA-Z]/g;
            let dataTransferencia = $(` ${modal} #transferencia_data `).val();
            if(dataTransferencia === "") dataTransferencia = null;
            else{
                if(regExp.test(dataTransferencia)){
                    xAlert("Transferir artigos", "Digite a data de transferência!", "info");
                    $(`${modal} #transferencia_data`).focus();
                    return;
                }
            }
            if($(`${modal} [tableDocumentArticles]`).find(`ul`).length === 0){
                xAlert("Transferir artigos", "Adicione artigos na tabela!", "info");
                return;
            }
            transference.transferir();
        }
    });
});
