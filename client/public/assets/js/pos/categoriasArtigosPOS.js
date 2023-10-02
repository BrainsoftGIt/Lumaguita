var categoriasArtigosPOS = {
    list: [],
    artigos: [],
    filteredData: [],
    init(){
        this.artigos = [];
        taxasArtigos.taxs = [];
        if($("#contasProformas").hasClass("show")){
            $("#contasProformas").removeClass("show");
        }
        if($("#fkPGSalesOfDay").hasClass("show")){
            $("#fkPGSalesOfDay").removeClass("show");
        }
        $("#total_articles_cart").text("0");
        $("#histBackCategories").empty().append("<span>Todas</span>");
        $("#artigos_carrinho").empty();
        this.load();
        serieOperation.loadSerieOperation([serieOperation.tipo.fatura_recibo, serieOperation.tipo.fatura], "pos");
    },
    load(){
        $(".fk-body").addClass("loading");
        $.ajax({
            url: "/api/pos/categorias",
            method: "POST",
            contentType: "application/json",
            success(e) {
                $(".fk-body").removeClass("loading");
                $("#user_pos").text(e.user);
                categoriasArtigosPOS.list = [];
                categoriasArtigosPOS.list = e.classes;
                pos.acessos = [];
                pos.acessos = e.acessos;
                if(categoriasArtigosPOS.list.length === 0) $("[categoriasArtigos]").addClass("empty");
                else $("[categoriasArtigos]").removeClass("empty");

                categoriasArtigosPOS.showCategories();
            }
        });
    },
    loadArticles({categoria_id}){
        if(categoriasArtigosPOS.artigos.filter(art => art.data.artigo_classe_id === categoria_id).length === 0){
            $(".fk-body").addClass("loading");
            $.ajax({
                url: "/api/artigos/categoria",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({arg_classe_id: categoria_id}),
                error(){   $("body").removeClass("loading")},
                success(e) {
                    $(".fk-body").removeClass("loading");
                    Array.prototype.push.apply(categoriasArtigosPOS.artigos, e.artigos);
                    categoriasArtigosPOS.showArticles(categoria_id);
                }
            });
        }
        else{
            categoriasArtigosPOS.showArticles(categoria_id);
        }
    },
    showCategories( categoria_id= null){
        let categoriasArtigos = $("[categoriasArtigos]");
        categoriasArtigos.empty();
        if(categoria_id) this.filteredData = categoriasArtigosPOS.list.filter((cat => cat.data.classe_classe_id === categoria_id));
        else this.filteredData = categoriasArtigosPOS.list.filter((cat => cat.data.classe_classe_id === null));

        this.filteredData.forEach((cat) =>{
            cat = cat.data;
            categoriasArtigos.append(`<section class="waves-effect isCategoria" categ_id="${cat.classe_id}">
                                        <div class="img-container ${cat.classe_foto ? "artigo" : "empty-artigo"}" style="background-image: url(${(cat.classe_foto ? "/storage/"+cat.classe_foto.split(";")[0] : "")})">
                                            <span class="top">Categoria</span>
                                            <span class="instock" title="Total de artigos">${cat.classe_artigos}</span>
                                        </div>
                                         <h4>${cat.classe_nome}</h4>
                                       </section>`);
        });
    },
    showArticles(categoria_id){
        $("[categoriasArtigos]").removeClass("empty");
        let esgotando;
        this.artigos.forEach((art, idx) =>{
            art = art.data;
            esgotando = "";
            if(categoria_id === art.artigo_classe_id){
                if(!art.artigo_stocknegativo){
                    if(art.link_metadata.stock_minimo === null){
                        if(Number((art.stock_quantidade || 0)) <= 0){
                            esgotando = "off";
                        }
                    }
                    else{
                        if(Number((art.stock_quantidade || 0)) <= Number(art.link_metadata.stock_minimo))
                            esgotando = "off";
                    }
                }

                let stock_quantidade = (art.artigo_stocknegativo) ? "&#x221E;" : (art.stock_quantidade || 0).dc();
                $("[categoriasArtigos]").append(`<section class="waves-effect have-extra isArtigo ${esgotando}" i="${idx}">
                                                <div class="img-container ${(art.artigo_foto ? "artigo" : "empty-artigo")}" style="background-image: url(${(art.artigo_foto ? "/storage/"+art.artigo_foto.split(";")[0] : "")})">
                                                    <span class="top is-money-text" coin="STN">${art.link_metadata.precario_custo.dc().formatter()}</span>
                                                    <span class="instock" title="Quantidade disponível">${stock_quantidade}</span>
                                                </div>
                                                <h4>${art.artigo_nome}</h4>
                                            </section>`);
            }
        });
    },
    searchArticles(){
        $(".fk-body").addClass("loading");
        $.ajax({
            url: "/api/search/articles",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({search_text: $("#pesquisarArtigoPos").val().trim()}),
            error(){  $(".fk-body").removeClass("loading")},
            success(e) {
                $(".fk-body").removeClass("loading");
                $("[categoriasArtigos]").empty();
                categoriasArtigosPOS.artigos = [];
                categoriasArtigosPOS.artigos = e.artigos;
                if(categoriasArtigosPOS.artigos.length === 0) $("[categoriasArtigos]").addClass("empty");
                else $("[categoriasArtigos]").removeClass("empty");

                let stockMinimo;
                categoriasArtigosPOS.artigos.forEach((art, idx) =>{
                    art = art.data;
                    stockMinimo = "";
                    if(!art.artigo_stocknegativo){
                        if(Number((art.link_metadata.stock_quantidade || 0)) < Number((art.link_metadata.stock_minimo || 0)))
                            stockMinimo = "off";
                    }
                    let stock_quantidade = (art.artigo_stocknegativo) ? "&#x221E;" : (art.stock_quantidade || 0).dc();
                    $("[categoriasArtigos]").append(`<section class="waves-effect have-extra isArtigo ${stockMinimo}" i="${idx}">
                                                <div class="img-container ${(art.artigo_foto ? "artigo" : "empty-artigo")}" style="background-image: url(${(art.artigo_foto ? "/storage/"+art.artigo_foto.split(";")[0] : "")})">
                                                    <span class="top is-money-text" coin="STN">${art.link_metadata.precario_custo.formatter()}</span>
                                                    <span class="instock" title="Quantidade disponível">${stock_quantidade}</span>
                                                </div>
                                                <h4>${art.artigo_nome}</h4>
                                            </section>`);
                });

            }
        });
    }
};

$("[categoriasArtigos]").on("click", "section", function () {
    if($(this).hasClass("isCategoria")){
        categoriasArtigosPOS.showCategories( $(this).attr("categ_id"));
        categoriasArtigosPOS.loadArticles({categoria_id: $(this).attr("categ_id")});
        $("#histBackCategories").append(`<i class="material-icons">chevron_right</i><span categ_id="${$(this).attr("categ_id")}">${$(this).find("h4").text()}</span>`);
    }
    else{
        pos.selectedArticle = categoriasArtigosPOS.artigos[$(this).attr("i")].data;
        $("#itensExtraArtigo").empty();
        if(pos.selectedArticle.artigos_extras > 0){
            pos.loadArticleItems();
        }
        else{
            if(pos.hasArticleInCart({artigo_id: pos.selectedArticle.artigo_id})){
                pos.increaseQuantity();
            }
            else{
                if(pos.haveAccessGranted("maguita.pos.adicionar", $("#artigos_carrinho").find("li.sended").length > 0)) pos.addToCart();
                else M.toast({html: 'Sem privilégio para adicionar artigo depois de confirmado.', classes: 'rounded'});
            }
        }
    }
});
$("#histBackCategories").on("click", "span", function () {
    if($(this).next().length > 0){
        $(this).nextAll("i, span").remove();
        categoriasArtigosPOS.showCategories( ($(this).attr("categ_id") || null));
        if($(this).attr("categ_id") !== undefined){
            categoriasArtigosPOS.loadArticles({categoria_id: $(this).attr("categ_id")});
        }
    }
});
$("#voltarCategorias").on("click", function () {
    let histBackCategories = $("#histBackCategories");
     if(histBackCategories.find("span").length > 1){
         histBackCategories.find("i:last, span:last").remove();
         categoriasArtigosPOS.showCategories( (histBackCategories.find("span:last").attr("categ_id") || null));
         if(histBackCategories.find("span:last").attr("categ_id") !== undefined){
             categoriasArtigosPOS.loadArticles({categoria_id: histBackCategories.find("span:last").attr("categ_id")});
         }
     }
});
$("#pesquisarArtigoPos").keypress(function (e) {
   if(e.which === 13 && $(this).val().trim() !== ""){
        categoriasArtigosPOS.searchArticles();
   }
}).on("keyup", function () {
    let category_uuid = $("#histBackCategories").find("span:last").attr("categ_id") || null;
    if($(this).val() === ""){
        $("[categoriasArtigos]").removeClass("empty");
        categoriasArtigosPOS.showCategories( category_uuid);
        if(category_uuid !== null){
            categoriasArtigosPOS.loadArticles({categoria_id: category_uuid});
        }
    }
});
$("#fkpg--make-a-sale").on("click", ".keyboard li", function () {
    let campoPesquisa = $("#pesquisarArtigoPos");
    if($(this).text() === "LIMPAR"){
        campoPesquisa.val("");
        campoPesquisa.keyup();
    }
    else if($(this).hasClass("search-btn")){
        if(campoPesquisa.val().trim() !== "")
             categoriasArtigosPOS.searchArticles();
    }
    else{
        if($("#pesquisarArtigoPos").val().trim() !== "") campoPesquisa.val(campoPesquisa.val()+$(this).text());
        else campoPesquisa.val($(this).text());
    }
});
