(() =>{
    const entranceTransfer = {
        stocks:[],
        init(){
            setTimeout(() => {
                $('[data-inputmask-alias]').inputmask();
            }, 800);
        },
        selectedArticlesAcerto({type}){
            let artigosAcerto = [];
            let artigo;
            $("#artigosAcertoStock").find("li").each(function () {
                if(type === "before") artigosAcerto.push($(this).attr("acerto_artigo_id"));
                else{
                    artigo = entranceTransfer.stocks.find(stock => stock.data.artigo_id ===  $(this).attr("acerto_artigo_id"));
                    if(artigo.data.artigo_id === $(this).attr("acerto_artigo_id") && Number(artigo.data.stock_quantidade) !== Number($(this).find("input.quant").val())){
                        artigosAcerto.push({artigo_id: $(this).attr("acerto_artigo_id"), acerto_quantidade: $(this).find("input.quant").val()});
                    }
                }
            });
            return artigosAcerto;
        },
        acertarStock(){
            $("[bt_acertostock]").attr("disabled", true).addClass("loading");
            $.ajax({
                url: "/api/artigos/acertoStock",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({acerto_observacao: null, arg_espaco_id: $("#armazens_acertoStock").find("li.active").attr("armazem_id"),
                    arg_acerto: this.selectedArticlesAcerto({type: "after"})}),
                error() { $("[bt_acertostock]").attr("disabled", false).removeClass("loading") },
                complete() { $("[bt_acertostock]").attr("disabled", false).removeClass("loading") },
                success(e) {
                    $("[bt_acertostock]").attr("disabled", false).removeClass("loading");
                    if(e.result){
                        $("#artigosAcertoStock").empty();
                        $("#filtro_categorias").find("li.active").click();
                        xAlert("Acertar stock", "Acerto efetuado com sucesso!");
                        $("#xModalAcertoStockArtigos").find(".hideTarget").click();
                        $("#armazens_acertoStock").find("li").removeClass("active");
                    }
                    else xAlert("Acertar stock", e.message, "error",  10);
                }
            });
        },
        loadArticlesStockSpace(armazem_id){
            $.ajax({
                url: "/api/artigo/stocks",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({espaco_destino: armazem_id, artigos: this.selectedArticlesAcerto({type: "before"})}),
                success(e) {
                    entranceTransfer.stocks = [];
                    entranceTransfer.stocks = e.stocks;
                    entranceTransfer.stocks.forEach((stock) =>{
                        stock = stock.data;
                        $(`#artigosAcertoStock li[acerto_artigo_id=${stock.artigo_id}]`).find("input.quant").val(stock.stock_quantidade);
                    });
                }
            });
        }
    };

    entranceTransfer.init();
    $("#artigosAcertoStock").on("click", ".plus", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let input = $(this).parents(".crtlQtt.flex").find("input.quant");
        let currentValue = input.val() || 0;
        let newQuantity = Number(currentValue) + 1;
        input.val(newQuantity);
    }).on("click", ".min", function () {
        let input = $(this).parents(".crtlQtt.flex").find("input.quant");
        let currentQuantity = input.val() || 0;
        let newQuantity;
        if(Number(currentQuantity) > 1){
            newQuantity = Number(currentQuantity) - 1;
            input.val(newQuantity);
        }
    });
    $("[novoAcertoStock]").on("click", function () {
        if($("#list_articles_categories").find("span.select.active").length === 0){
            xAlert("Acertar stock", "Selecione os artigos para realizar o acerto!", "info");
            return;
        }
        let artigosAcertoStock = $("#artigosAcertoStock");
        artigosAcertoStock.empty();
        $(".list-articles").find("span.select.active").each(function () {
            artigosAcertoStock.append(`<li class="flex h-sb v-ct" acerto_artigo_id="${$(this).attr("artigo_id")}">
                                            <div>
                                               <b>${$(this).attr("artigo_nome")}</b>
                                            </div>
                                            <div class="crtlQtt flex">
                                                <span class="min">-</span>
                                                <input type="text" class="quant integer">
                                                <span class="plus">+</span>
                                            </div>
                                </li>`);
        });
        $("#armazens_acertoStock").find("li").removeClass("active");
        $("#xModalAcertoStockArtigos").find("input").val("");
        showTarget("xModalAcertoStockArtigos");
    });
    $("[bt_acertostock]").on("click", function () {
        if($("#armazens_acertoStock").find("li.active").length === 0){
            xAlert("Acertar stock", "Selecione o armazém!", "info");
            return;
        }
        if(entranceTransfer.stocks.length === 0){
            xAlert("Acertar stock", "Nenhum stock encontrado para os artigos no armazém!", "error");
            return;
        }
        let allQuantityFilled = true;
        let quantityArticle = 0;
        $("#artigosAcertoStock").find("li").each(function () {
            quantityArticle = $(this).find("input").val() || 0;
            if(parseInt(quantityArticle) === 0){
                xAlert("Acertar stock", "Informe a quantidade real de cada artigo selecionado!", "info");
                allQuantityFilled = false;
                return false;
            }
        });
        if(entranceTransfer.selectedArticlesAcerto({type: "after"}).length > 0){
            entranceTransfer.acertarStock();
        }
        else{
            xAlert("Acertar stock", "Não foi feita nenhuma alteração de quantidade", "info");
        }
    });
    $("#armazens_acertoStock").on("mousedown", "li", function () {
        entranceTransfer.loadArticlesStockSpace($(this).attr("armazem_id"));
    });
})();