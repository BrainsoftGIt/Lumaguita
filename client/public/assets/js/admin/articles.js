
var article = {
    extras: [],
    categoria_id: null,
    artigo_id: null,
    extra_id: null,
    list: [],
    imposto_lista_tipo_aplicacao: [],
    impostos: [],
    init(){
        this.load();
        this.loadExtraItems();
        this.loadWarehouses();
        this.loadSimpleTaxs();
        this.loadTaxCode();
        if(currentSystem.type === "loja"){
            let xModalAllAboutArtigo = $("#xModalAllAboutArtigo");
            $("#artigo_confecionado, #hasExtraItem").remove();
            xModalAllAboutArtigo.find(".yesNOpts li:last").prev().remove();
            xModalAllAboutArtigo.find(".yesNOpts li:last").remove();
            xModalAllAboutArtigo.find(".extras").remove();
        }
    },
    loadExtraItems(){
        $.ajax({
            url: "/api/extraItems/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                article.extras = [];
                article.extras = e.items;
                let extraItemsArticle = $("#extraItemsArticle");
                extraItemsArticle.empty();
                article.extras.forEach((extra) =>{
                    extra = extra.funct_load_artigo;
                    extraItemsArticle.append(`<li class="flex h-sb v-ct stgl" extra_id="${extra.artigo_id}">
                                                <p>${extra.artigo_nome.toUpperCase()}</p>
                                                <div class="flex v-ct">
                                                    <b class="is-money-text">${(extra.precario_custo || 0).formatter()}</b>
                                                    <a tooltip="Editar" flow="top" class="showTarget" target="addEditExtraItem" tTitle="Editar item extra" title="Editar">
                                                        <svg class="edit showTarget" viewBox="0 0 512 512">
                                                            <path
                                                                d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                                            <path
                                                                d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                                            <path
                                                                d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                                        </svg>
                                                    </a>
                                                    <a tooltip="Eliminar" flow="top">
                                                        <svg class="delete" viewBox="-40 0 427 427.00131">
                                                            <path
                                                                d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                            <path
                                                                d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                            <path
                                                                d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                                            <path
                                                                d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </li>`);
                });
            }
        });
    },
    loadSimpleTaxs(){
        $.ajax({
            url: "/api/impostos",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let artigo_impostos = $("#artigo_impostos");
                let artigo_aplicacao_imposto = $("#artigo_aplicacao_imposto");
                artigo_impostos.empty();
                artigo_aplicacao_imposto.append(`<li class="tgl">(Sem imposto)</li>`);
                article.imposto_lista_tipo_aplicacao = [];
                article.imposto_lista_tipo_aplicacao = e.taplicar_data;
                article.impostos = [];
                article.impostos = e.impostos;
                artigo_impostos.append(`<li class="tgl">(Sem imposto)</li>`);
                let acrescimo_imposto;
                article.impostos.forEach((imp) =>{
                    imp = imp.data;
                    acrescimo_imposto = imp.tipoimposto_nome+" - "+(imp.taxa_taxa === null ? imp.taxa_percentagem+"%" : imp.taxa_taxa+" STN");
                    artigo_impostos.append(`<li class="tgl" imposto_id="${imp.tipoimposto_id}">${acrescimo_imposto}</li>`);
                });
                article.imposto_lista_tipo_aplicacao.forEach(value => {
                    artigo_aplicacao_imposto.append(`<li class="tgl" taplicar_id="${value.taplicar_id}">${value.taplicar_descricao}</li>`);
                });
            }
        });
    },
    loadTaxCode(){
        $.ajax({
            url: "/api/impostos/codes",
            method: "GET",
            contentType: "application/json",
            success({taxCodes}) {
                let TaxCodes = $("#artigo_codigoimpostolist")
                    .html(`<li class="tgl">(Sem imposto)</li>`);
                article.taxCodes = taxCodes;
                taxCodes.forEach(({codigoimposto_id, codigoimposto_descricao}) =>{
                    TaxCodes.append(`<li class="tgl" codigoimposto_id="${codigoimposto_id}">${codigoimposto_descricao}</li>`);
                });
            }
        });
    },
    loadWarehouses(){
        $.ajax({
            url: "/api/article/warehouses",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let armazens_artigos = $("#armazens_artigos");
                let armazens_entrada = $("#armazens_entrada");
                let armazens_transferencia_origem = $("#armazens_transferencia_origem");
                let armazens_transferencia_destino = $("#armazens_transferencia_destino");
                let armazens_acertoStock = $("#armazens_acertoStock");
                let categoria_armazens = $("#categoria_armazens");
                let armazens_importar_artigos = $("[armazens_importar_artigos]");
                armazens_artigos.empty();
                armazens_entrada.empty();
                categoria_armazens.empty();
                armazens_transferencia_origem.empty();
                armazens_transferencia_destino.empty();
                armazens_importar_artigos.empty();
                armazens_acertoStock.empty();
                e.armazens.forEach((arm) =>{
                    arm = arm.funct_load_espaco_simple;
                    armazens_entrada.append(`<li class="tgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    armazens_transferencia_origem.append(`<li class="tgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    armazens_transferencia_destino.append(`<li class="tgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    armazens_importar_artigos.append(`<li class="stgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    armazens_acertoStock.append(`<li class="tgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    categoria_armazens.append(`<li class="stgl" armazem_id="${arm.espaco_id}">${arm.espaco_nome}</li>`);
                    armazens_artigos.append(`<div class="flex h-sb" armazem_id="${arm.espaco_id}">
                                                <li class="stgl">${arm.espaco_nome}</li>
                                                <span class="flex v-ct">
                                                    <b>STN</b>
                                                    <input type="text" placeholder="Preço" class="double formatNumber">
                                                    <input type="text" title="Stock mínimo" class="integer" placeholder="Stock mín.">
                                                </span>
                                            </div>`);
                });
            }
        });
    },
    load(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/articles/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_classe_id: article.categoria_id, arg_artigo_estado: null}),
            error(){ $("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                let artigos = $(".list-articles");
                let fotoArtigo;
                let minimoAtingido;
                let articlesActions;
                let proprietarioEditar;
                artigos.empty();
                article.list = [];
                article.list = e.artcls;
                $("#totalArticles").attr("total", article.list.length);
                $(".requireSelection").removeClass("show");
                if(article.list.length === 0) artigos.addClass("empty");
                else artigos.removeClass("empty");

                article.list.forEach((art, idx) =>{
                    art = art.funct_load_artigo;
                    minimoAtingido = "";
                    articlesActions = "";

                    if(art.artigo_foto){
                        fotoArtigo = `<div class="img-container artigo" style="background-image: url(${"/storage/"+art.artigo_foto.split(";")[0]})">
                                        <span class="instock" title="Quantidade no stock">${art.stock_quantidade}</span>
                                    </div>`;
                    }
                    else{
                        fotoArtigo = `<div class="img-container empty-artigo">
                                        <span class="instock" title="Quantidade no stock">${art.stock_quantidade}</span>
                                    </div>`;
                    }
                    if(!art.artigo_stocknegativo){
                        if(art.stock_minimo === null){
                            if(Number((art.stock_quantidade || 0)) <= 0){
                                minimoAtingido = "off";
                            }
                        }
                        else{
                            if(Number((art.stock_quantidade || 0)) <= Number(art.stock_minimo))
                                minimoAtingido = "off";
                        }
                    }

                    if(art.artigo_owner){
                        proprietarioEditar = `<a tooltip="Editar" flow="top">
                                            <svg class="edit showTarget" viewBox="0 0 512 512" i="${idx}">
                                                <path
                                                    d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                                <path
                                                    d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                                <path
                                                    d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                            </svg>
                                        </a>`;
                    }
                    if(art.artigo_owner){
                        articlesActions = `<a tooltip="Editar" flow="top">
                                            <svg class="edit showTarget" viewBox="0 0 512 512" i="${idx}">
                                                <path
                                                    d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                                <path
                                                    d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                                <path
                                                    d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                            </svg>
                                        </a>
                                        <label class="xSwitch">
                                            <input type="checkbox" ${(art.artigo_estado === 1 ? "checked" : "")}>
                                            <span class="slider round"></span>
                                        </label>`;
                    }

                    artigos.append(`<section class="waves-effect have-extra isArtigo ${minimoAtingido}" i="${idx}">
                                            ${fotoArtigo}
                                        <h4>${art.artigo_nome}</h4>
                                        <div class="inb flex h-sb">
                                            <p class="top ${(art.precario_custo ? "is-money-text" : "")}" coin="STN">${(art.precario_custo ? art.precario_custo.formatter() : "Sem preço definido")}</p>
                                            <span class="j-stp ${(article.categoria_id === category.ITEM_EXTRA_CATEGORIA_ID ? "" : "select")}" artigo_id="${art.artigo_id}" artigo_nome="${art.artigo_nome}" title="Clique para selecionar"></span>
                                        </div>
                                        ${(article.categoria_id === category.ITEM_EXTRA_CATEGORIA_ID ?  "" : articlesActions)}  
                               </section>`);
                });
            }
        });
    },
    addExtraItem(){
        $("#btExtra").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/article/extra",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ artigo_nome: $("#extraName").val().trim(), precario_custo: ($("#extraPrice").val() === "" ? 0 : $("#extraPrice").val().unFormatter()),
                precario_quantidade: 1, artigo_descricao: null, artigo_id: null}),
            error() { $("#btExtra").attr("disabled", false).removeClass("loading") },
            complete() { $("#btExtra").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("#btExtra").attr("disabled", false).addClass("loading");
                if (e.result) {
                    article.loadExtraItems();
                    $("#addEditExtraItem").find(".hideTarget").click();
                    xAlert("Adicionar item extra/acompanhamento", "Operação efetuada com sucesso.");
                    $("#extraName, #extraPrice").val("");
                }
                else xAlert("Adicionar item extra/acompanhamento", e.message, "error");
            }
        });
    },
    editExtraItem(){
        $("#btExtra").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/article/extra",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ artigo_nome: $("#extraName").val().trim(), precario_custo: ($("#extraPrice").val() === "" ? 0 : $("#extraPrice").val().unFormatter()),
                precario_quantidade: 1, artigo_descricao: null, artigo_id: article.extra_id}),
            error() { $("#btExtra").attr("disabled", false).removeClass("loading") },
            complete() { $("#btExtra").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("#btExtra").attr("disabled", false).addClass("loading");
                if (e.result) {
                    article.loadExtraItems();
                    $("#addEditExtraItem").find(".hideTarget").click();
                    xAlert("Editar item extra/acompanhamento", "Operação efetuada com sucesso.");
                    $("#extraName, #extraPrice").val("");
                }
                else xAlert("Editar item extra/acompanhamento", e.message, "error");
            }
        });
    },
    get selectedExtraItems(){
        let extras = [];
        if( $("#hasExtraItem").hasClass("active")){
            $("#extraItemsArticle").find("li.active").each(function () {
                extras.push($(this).attr("extra_id"));
            });
        }
        return extras;
    },
    get selectedWarehouses(){
        let warehouses = [];
      $("#armazens_artigos").find("div").each(function () {
          if($(this).find("li").hasClass("active")){
              warehouses.push({espaco_id: $(this).attr("armazem_id"), precario_custo: $(this).find("input:text").val().unFormatter(), precario_quantidade: 1,
                  stock_minimo: ($(this).find("input.integer").val() || null)});
          }
      });
      return warehouses;
    },
    get addedEAN(){
        let eans = [];
        $(".theArtg .xchip").find("li").each(function () {
            eans.push({ean_code: $(this).find("span").eq(0).text(), ean_dateout: null, ean_datein: null});
        });
        return eans;
    },
    hasNewTarget(currentTarget){
        let bt_artigo = $("[bt_artigo]");
        if(currentTarget === "article01"){
            if( $("#artigo_composto").hasClass("active")){
                $("#article01").removeClass("show");
                $("#article02").addClass("show");
                if(bt_artigo.text().includes("(2/2)")) bt_artigo.text("concluir");
                else bt_artigo.text("próximo (3/3)");

                return true;
            }
            else if($("#hasExtraItem").hasClass("active")){
                bt_artigo.text("concluir");
                $("#article01").removeClass("show");
                $("#article03").addClass("show");
                return true;
            }
        }
        else if(currentTarget === "article02"){
            if($("#hasExtraItem").hasClass("active")) {
                bt_artigo.text("concluir");
                $("#article02").removeClass("show");
                $("#article03").addClass("show");
                return true;
            }
        }
        else{
            return false;
        }
        return false;
    },
    resetData(){
        $("#artigo_codigo").val("").prop("disabled", false);
        $(".theArtg .xchip").find("ul").empty();
        $("label.artigo[lab=FOTO]").text(".jpg, .png, .jpeg");
        $("#artigo_impostos_desc, #aplicacao_impostos_desc").val("");
        $("#artigo_impostos, #artigo_aplicacao_imposto").find("li").removeClass("active");
        $("#artigo_foto, #artigo_nome, #artigo_observacao, #artigo_quantidade_composto").val("");
        $("#armazens_artigos, #artigos_base").find("li").removeClass("active");
        $("#armazens_artigos").find("input").val("");
        $(".listCats").find("div").removeClass("active");
        $("#artigo_stock_negativo, #artigo_confecionado, #artigo_composto, #hasExtraItem").removeClass("active");
        $("[selectedCategory]").remove();
        $(".extrasItems").removeClass("show");
        $("#extraItemsArticle").find("li").removeClass("active");
        $("#article02, #article03").removeClass("show");
        $("#article01").addClass("show");
        $("[bt_artigo]").text("concluir");
        $("#categoria_artigo").text("");
        $(".theArtg .xchip").find("ul").empty();
    },
    get impostos_selecionados(){
        let impostos = [];
        $("#artigo_impostos").find("li.active").each(function () {
            if($(this).attr("imposto_id") !== undefined){
                impostos.push({
                    arg_tipoimposto_id: $(this).attr("imposto_id"),
                    arg_taplicar_id: $("#artigo_aplicacao_imposto").find("li.active").attr("taplicar_id"),
                    arg_imposto_valor: null,
                    arg_imposto_percentagem: null
                });
            }
        });
        return impostos;
    },
    add(){
        $("[bt_artigo]").attr("disabled", true).addClass("loading");
        let artigo_composto = $("#artigo_composto");
        let formData = new FormData();
        let nomeArtigo = $("#artigo_nome").val().trim();

        formData.append("data", JSON.stringify({ artigo_artigo_id: (artigo_composto.hasClass("active") ? $("#artigos_base").find("li.active").attr("artigo_id") : null),
            artigo_compostoquantidade: (artigo_composto.hasClass("active") ? $("#artigo_quantidade_composto").val().unFormatter() : null),
            artigo_classe_id:  $(".listCats").find("div.active").attr("cat_id"), artigo_id: null,
            artigo_codigo: ($("#artigo_codigo").val().trim() || generateCode()),
            artigo_nome: nomeArtigo, artigo_preparacao: $("#artigo_confecionado").hasClass("active"),
            artigo_stocknegativo: $("#artigo_stock_negativo").hasClass("active"), artigo_foto: null, artigo_descricao: ($("#artigo_observacao").val().trim() || null),
            arg_items: this.selectedExtraItems, arg_imposto: article.impostos_selecionados, arg_links: this.selectedWarehouses, arg_ean_codes: this.addedEAN,
            artigo_codigoimposto: $("#artigo_codigoimposto").find("li.active").attr("codigoimposto_id") || null
        }));
        formData.append("file",  $("#artigo_foto")[0].files[0]);

        $.ajax({
            url: "/api/artigo",
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            dataType: "json",
            data: formData,
            error() { $("[bt_artigo]").attr("disabled", false).removeClass("loading") },
            complete() { $("[bt_artigo]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_artigo]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    article.load();
                    article.resetData();
                    xAlert("Adicionar artigo", nomeArtigo+" adicionado com sucesso.");
                    $("#xModalCtrlArtigo").find(".hideTarget").click();
                }
                else xAlert("Adicionar artigo", e.message, "error");
            }
        });
    },
    edit(){
        $("[bt_artigo]").attr("disabled", true).addClass("loading");
        let artigo_composto = $("#artigo_composto");
        let formData = new FormData();
        formData.append("data", JSON.stringify({ artigo_artigo_id: (artigo_composto.hasClass("active") ? $("#artigos_base").find("li.active").attr("artigo_id") : null),
            artigo_compostoquantidade: (artigo_composto.hasClass("active") ? $("#artigo_quantidade_composto").val().unFormatter() : null),
            artigo_classe_id:  $(".listCats").find("div.active").attr("cat_id"), artigo_id: this.selected.artigo_id,
            artigo_codigo: article.selected.artigo_codigo, artigo_nome: $("#artigo_nome").val().trim(), artigo_preparacao: $("#artigo_confecionado").hasClass("active"),
            artigo_stocknegativo: $("#artigo_stock_negativo").hasClass("active"), artigo_foto: article.selected.artigo_foto, artigo_descricao: ($("#artigo_observacao").val().trim() || null),
            arg_items: this.selectedExtraItems, arg_imposto: article.impostos_selecionados, arg_links: this.selectedWarehouses, arg_ean_codes: this.addedEAN,
            artigo_codigoimposto: $("#artigo_codigoimposto").find("li.active").attr("codigoimposto_id")
        }));
        formData.append("file",  $("#artigo_foto")[0].files[0]);

        $.ajax({
            url: "/api/artigo",
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            dataType: "json",
            data: formData,
            error() { $("[bt_artigo]").attr("disabled", false).removeClass("loading") },
            complete() { $("[bt_artigo]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_artigo]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    article.load();
                    article.resetData();
                    xAlert("Editar artigo", "Artigo editado com sucesso.");
                    $("#xModalCtrlArtigo").find(".hideTarget").click();
                    $("label.artigo[lab=FOTO]").text(".jpg, .png, .jpeg");
                }
                else xAlert("Editar artigo", e.message, "error");
            }
        });
    },
    alterStatus(){
        $("[articleStatus]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/artigo/estado",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ arg_artigo_id: this.artigo_id}),
            error() { $("[articleStatus]").attr("disabled", false).removeClass("loading") },
            complete() { $("[articleStatus]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[articleStatus]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    article.load();
                    $("#xModalArticleStatus").find(".hideTarget").click();
                    xAlert("Alterar estado", "Operação efetudada com sucesso.");
                }
                else xAlert("Alterar estado", e.message, "error");
            }
        });
    },
    removeExtra(){
        $("[removeExtra]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/extra/remove",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ arg_artigo_id: this.extra_id}),
            error() { $("[removeExtra]").attr("disabled", false).removeClass("loading") },
            complete() { $("[removeExtra]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[removeExtra]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    article.loadExtraItems();
                    $("#xModalRemoveExtra").find(".hideTarget").click();
                    xAlert("Remover item extra/acompanhamento", "Operação efetuada com sucesso.");
                }
                else xAlert("Remover item extra/acompanhamento", e.message, "error");
            }
        });
    },
    showDataUpdate(){
         this.loadBaseArticles();
        $("#artigo_foto").val("");
        $("#artigo_codigo").val(article.selected.artigo_codigo).prop("disabled", true);
        if(article.selected.artigo_foto === null) $("label.artigo[lab=FOTO]").text(".jpg, .png, .jpeg");
        else $("label.artigo[lab=FOTO]").text(article.selected.artigo_foto.split(";")[1]);
        $("#artigo_observacao").val(article.selected.artigo_descricao);
        $("#artigo_nome").val(article.selected.artigo_nome);
        $(".listCats").find(`div.inList[cat_id=${article.selected.artigo_classe_id}]`).click();
        if(article.selected.artigo_stocknegativo){
            $("#artigo_stock_negativo").addClass("active");
        }
        if(article.selected.artigo_preparacao){
            $("#artigo_confecionado").addClass("active");
        }
        if(article.selected.extras){
            $("#hasExtraItem").addClass("active");
            article.selected.extras.forEach((extra) =>{
                $("#extraItemsArticle").find(`li[extra_id=${extra.dispoe_artigo_item}]`).addClass("active");
            });
        }
        (article.selected?.links || []).forEach((arm) =>{
            let armazem = $("#armazens_artigos").find(`div[armazem_id=${arm.link_espaco_destino}]`);
            armazem.find("li").addClass("active");
            if(arm?.link_metadata){
                armazem.find("input.double").val(arm?.link_metadata?.precario_custo);
                armazem.find("input.integer").val(arm?.link_metadata?.stock_minimo);
            }
        });
        (article.selected?.eans || []).forEach((ean) =>{
            $(".theArtg .xchip").find("ul").append(`<li class="flex">
                                                                            <span>${ean.ean_code}</span>
                                                                            <span class="rm"></span>
                                                                        </li>`);
        });
        let artigo_impostos = $("#artigo_impostos");
        let artigo_aplicacao_imposto = $("#artigo_aplicacao_imposto");
        if((article.selected?.impostos || []).length > 0){
            artigo_impostos.find(`li[imposto_id=${article.selected?.impostos[0].imposto_tipoimposto_id}]`).addClass("active");
            artigo_aplicacao_imposto.find(`li[taplicar_id=${article.selected?.impostos[0].imposto_taplicar_id}]`).addClass("active");
            artigo_impostos.parents(".xselect").find("input").val(artigo_impostos.find(`li.active`).text());
            artigo_aplicacao_imposto.parents(".xselect").find("input").val(artigo_aplicacao_imposto.find(`li.active`).text());
        }
        showTarget("xModalCtrlArtigo", "Editar artigo");
    },
    loadData(showDetails = false){
        $.ajax({
            url: "/api/artigo/data",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ artigos: [this.selected.artigo_id]}),
            success(e) {
                if(e.data.length > 0){
                    article.selected = e.data[0].funct_load_artigo_data;
                    let espacosPrecos = article.selected?.links || [];
                    let extras = article.selected.extras || [];
                    let codigosEan = "";
                    if(showDetails){
                        let xModalAllAboutArtigo = $("#xModalAllAboutArtigo");
                        xModalAllAboutArtigo.find(".img-container").removeClass("empty-artigo");
                        xModalAllAboutArtigo.find(".prices ul, .extras ul, .composal ul").empty();
                        xModalAllAboutArtigo.find("h3").text(article.selected.artigo_nome);
                        xModalAllAboutArtigo.find("[detalhes_codigo_artigo]").text(article.selected.artigo_codigo);
                        xModalAllAboutArtigo.find("[detalhes_nome_artigo]").text(article.selected.artigo_nome);
                        xModalAllAboutArtigo.find("[detalhes_categoria_artigo]").text(article.selected.classe_nome);
                        xModalAllAboutArtigo.find("[detalhes_obs_artigo]").text((article.selected.artigo_descricao || "Sem observação"));

                        xModalAllAboutArtigo.find("[detalhes_imposto_artigo]").text("");
                        xModalAllAboutArtigo.find("[detalhes_aplicacao_imposto_artigo]").text("");
                        if((article.selected?.impostos || []).length > 0){
                            xModalAllAboutArtigo.find("[detalhes_imposto_artigo]").text($("#artigo_impostos").find(`li[imposto_id=${article.selected?.impostos[0].imposto_tipoimposto_id}]`).text());
                            xModalAllAboutArtigo.find("[detalhes_aplicacao_imposto_artigo]").text($("#artigo_aplicacao_imposto").find(`li[taplicar_id=${article.selected?.impostos[0].imposto_taplicar_id}]`).text());
                        }

                        (article.selected?.eans || []).forEach((ean, i) =>{
                            if(codigosEan === "") codigosEan = ean.ean_code;
                            else codigosEan = (article.selected.eans.length === (i + 1)) && codigosEan !== "" ? codigosEan+" e "+ean.ean_code : codigosEan+", "+ean.ean_code;
                        });
                        xModalAllAboutArtigo.find("[detalhes_ean_artigo]").text((codigosEan || "-----"));
                        espacosPrecos.forEach((arm) =>{
                            xModalAllAboutArtigo.find(".prices ul").append(`<li class="flex h-sb">
                                                                                         <span>${arm.link_nome}</span>
                                                                                        <span class="is-money-text">${(arm?.link_metadata?.precario_custo ? arm?.link_metadata?.precario_custo.formatter() : "Sem preço definido")}</span>
                                                                                    </li>`);
                        });
                        if(espacosPrecos.length === 0){
                            xModalAllAboutArtigo.find(".prices ul").append(`<li class="flex h-sb">
                                                                                        Sem preço definido
                                                                                    </li>`);
                        }
                        if(article.selected.artigo_artigo_id){
                            xModalAllAboutArtigo.find(".composal ul").append(`<li class="flex h-sb">
                                                                                        <span>Artigo base</span>
                                                                                        <span>${article.selected?.artigo_base?.artigo_nome}</span>
                                                                                    </li>`);
                            xModalAllAboutArtigo.find(".composal ul").append(`<li class="flex h-sb">
                                                                                        <span>Valor do composto</span>
                                                                                        <span class="is-money-text">${article.selected.artigo_compostoquantidade.formatter()}</span>
                                                                                     </li>`);
                        }
                        else{
                            xModalAllAboutArtigo.find(".composal ul").append(`<li class="flex h-sb">
                                                                                        Não é um artigo composto
                                                                                    </li>`);
                        }
                        xModalAllAboutArtigo.find("[detalhes_artigo_stock_negativo]").text((article.selected.artigo_stocknegativo ? "Sim" : "Não"));
                        xModalAllAboutArtigo.find("[detalhes_artigo_composto]").text((article.selected.artigo_artigo_id ? "Sim" : "Não"));
                        xModalAllAboutArtigo.find("[detalhes_artigo_tem_extra]").text((article.selected.extras ? "Sim" : "Não"));
                        xModalAllAboutArtigo.find("[detalhes_artigo_confecionado]").text((article.selected.artigo_preparacao ? "Sim" : "Não"));
                        extras.forEach((extra) =>{
                            xModalAllAboutArtigo.find(".extras ul").append(`<li class="flex h-sb">
                                                                                        <span>${extra.artigo_nome}</span>
<!--                                                                                            <span class="is-money-text">15</span>-->
                                                                                    </li>`);
                        });
                        if(extras.length === 0){
                            xModalAllAboutArtigo.find(".extras ul").append(`<li class="flex h-sb">
                                                                                        Sem itens extra /acompanhamentos
                                                                                    </li>`);
                        }

                        if(article.selected.artigo_foto){
                            xModalAllAboutArtigo.find(".img-container").css('background-image', 'url(/storage/'+article.selected.artigo_foto.split(";")[0]+')');
                        }
                        else{
                            xModalAllAboutArtigo.find(".img-container").addClass("empty-artigo");
                        }

                        xModalAllAboutArtigo.find(".xSwitch input:checkbox").prop("checked", (article.selected.artigo_estado === 1));
                        showTarget("xModalAllAboutArtigo");
                    }
                    else{
                        article.showDataUpdate();
                    }
                }

            }
        });
    },
    loadBaseArticles(){
        $.ajax({
            url: "/api/base/articles",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ arg_artigo_composto: this?.selected?.artigo_id || null}),
            success(e) {
                let artigos_base = $("#artigos_base");
                artigos_base.empty();
                e.articles.forEach(value => {
                    artigos_base.append(`<li artigo_id="${value.data.artigo_id}">${value.data.artigo_nome}</li>`);
                });
                if(article.selected?.artigo_artigo_id){
                    $("#artigo_composto").addClass("active");
                    if(!artigos_base.find((`li[artigo_id=${article.selected.artigo_artigo_id}]`)).length){
                        artigos_base.append(`<li artigo_id="${article.selected.artigo_artigo_id}">${article.selected?.artigo_base?.artigo_nome}</li>`);
                    }
                    artigos_base.find(`li[artigo_id=${article.selected.artigo_artigo_id}]`).addClass("active");
                    $("#artigoBaseDescricao").val(article.selected?.artigo_base?.artigo_nome);
                    $("#artigo_quantidade_composto").val(article.selected?.artigo_compostoquantidade);
                }
                else $("#artigo_composto").removeClass("active");
            }
        });
    }
};
article.init();

$("#artigo_foto").on("change", function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    if (this.files.length === 0) return;

    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        $("label.artigo[lab=FOTO]").text(file.name);
    };
    reader.readAsDataURL(file);
});
$("#hasExtraItem").on("click", function () {
    $(this).toggleClass("active");
    if($(this).hasClass("active")){
        if($("#artigo_composto").hasClass("active")) $("[bt_artigo]").text("próximo (2/3)");
        else $("[bt_artigo]").text("próximo (2/2)");
    }
    else{
        if($("#artigo_composto").hasClass("active")) $("[bt_artigo]").text("próximo (2/2)");
        else $("[bt_artigo]").text("concluir");
    }
});
$("#artigo_composto").on("click", function () {
    $(this).toggleClass("active");
    if($(this).hasClass("active")){
        if($("#hasExtraItem").hasClass("active")) $("[bt_artigo]").text("próximo (2/3)");
        else $("[bt_artigo]").text("próximo (2/2)");
    }
    else{
        if($("#hasExtraItem").hasClass("active")) $("[bt_artigo]").text("próximo (2/2)");
        else $("[bt_artigo]").text("concluir");
    }
});
$("#searchExtraItems").on("keyup", function () {
    advSearch($(this).val(), $("#extraItemsArticle"), $("#extraItemsArticle").find("li"));
});
$("#btExtra").on("click", function () {
    if(!validation1($("#extraName"))) return;
    if($("#addEditExtraItem").find("b[targetTitle]").text().toLowerCase().includes("adicionar")) article.addExtraItem();
    else article.editExtraItem();
});
$("#extraItemsArticle").on("click", ".edit", function () {
    article.extra_id = $(this).parents("li").attr("extra_id");
    $("#extraName").val($(this).parents("li").find("p").text());
    $("#extraPrice").val($(this).parents("li").find("b").text().unFormatter());
}).on("click", ".delete", function () {
    article.extra_id = $(this).parents("li").attr("extra_id");
    showTarget("xModalRemoveExtra", "Remover item extra/acompanhamento");
});
$("[removeExtra]").on("click", function () {
        article.removeExtra();
});
$("[bt_artigo]").on("click", function () {
    let armazens_artigos = $("#armazens_artigos");
    let dadosArmazensFornecidos = true;
    let target = $("#xModalCtrlArtigo").find(".block.show").attr("target");

    if(target === "article01"){
        if(!validation1($("#artigo_nome"))) return;
        if($(".listCats").find("div.active").length === 0){
            xAlert("Artigo", "Escolha a categoria do artigo", "info");
            showTarget("allCategoriesView");
            return;
        }
        if($("#artigo_impostos").find("li.active").attr("imposto_id") !== undefined ){
            if($("#artigo_aplicacao_imposto").find("li.active").attr("taplicar_id") === undefined){
                xAlert("Artigo", "Escolha o modo de utilização do tipo de imposto!", "info");
                return;
            }
        }
        if($("#artigo_aplicacao_imposto").find("li.active").attr("taplicar_id") !== undefined ){
            if($("#artigo_impostos").find("li.active").attr("imposto_id") === undefined){
                xAlert("Artigo", "Escolha o imposto!", "info");
                return;
            }
        }
        armazens_artigos.find("div").each(function () {
            if($(this).find("li").hasClass("active")){
                if(!validation1($(this).find("input.double"))){
                    xAlert("Artigo", "Digite o preço do artigo no armazém "+$(this).find("li").text(), "info");
                    dadosArmazensFornecidos = false;
                    return false;
                }
            }
        });
        if(!dadosArmazensFornecidos) return;
        if(!article.hasNewTarget(target)){
            if($("#xModalCtrlArtigo").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) article.add();
            else article.edit();
        }
    }
    else if(target === "article02"){
        if($("#artigos_base").find("li.active").length === 0){
            xAlert("Artigo", "Selecione o artigo base!", "info");
            return;
        }
        if(!validation1($("#artigo_quantidade_composto"))){
            xAlert("Artigo", "Digite o valor do artigo composto!", "info");
            return;
        }
        if(!article.hasNewTarget(target)){
            if($("#xModalCtrlArtigo").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) article.add();
            else article.edit();
        }
    }
    else{
        if(article.selectedExtraItems.length === 0){
            xAlert("Artigo", "Selecione os items extras/acompanhamentos que fazem parte do artigo!", "info");
            return;
        }
        if($("#xModalCtrlArtigo").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) article.add();
        else article.edit();
    }
});
$("#artigo_impostos").on("mousedown", "li", function () {
    if($(this).attr("imposto_id") === undefined){
        $("#artigo_aplicacao_imposto").find("li").eq(0).mousedown();
    }
});
$("#filtro_categorias").on("click", "li", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('active').siblings().removeClass('active');
    $("span[target=_idFltCat]").text($(this).find("a").text());
    article.categoria_id = $(this).attr("cat_id") || null;
    article.load();
});
$(".list-articles").on("click", ".select", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).toggleClass("active");
    if( $(".list-articles").find(".select.active").length === 0) $(".requireSelection").removeClass("show");
    else $(".requireSelection").addClass("show");
}).on("click", ".xSwitch", function (e) {
    e.preventDefault();
    e.stopPropagation();
    article.artigo_id = $(this).parents("section").find(".select").attr("artigo_id");
    showTarget("xModalArticleStatus", ($(this).is(":checked") ? "Ativar artigo" : "Desativar artigo"));
}).on("click", ".edit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    article.resetData();
    article.selected = article.list[$(this).attr("i")].funct_load_artigo;
    $("#artigo_foto").val("");
    $("#artigo_nome").val(article.selected.artigo_nome);
    $(".listCats").find(`div.inList[cat_id=${article.selected.artigo_classe_id}]`).click();
    if(article.selected.artigo_foto === null) $("label.artigo[lab=FOTO]").text(".jpg, .png, .jpeg");
    else $("label.artigo[lab=FOTO]").text(article.selected.artigo_foto.split(";")[1]);

    article.loadData();
}).on("click", "section", function (e) {
    e.preventDefault();
    e.stopPropagation();
    article.selected = article.list[$(this).attr("i")].funct_load_artigo;
    article.loadData(true);
});
$("[articleStatus]").on("click", function () {
   article.alterStatus();
});
$("#searchArticles").on("keypress", function (e) {
    if(e.which === 13)
       advSearch($(this).val(),  $(".list-articles"),  $(".list-articles").find("section"));
});
$("[novoArtigo]").on("click", function () {
    if(!$("#xModalCtrlArtigo").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
        article.resetData();
    }

    delete article.selected;
    article.loadBaseArticles();
    showTarget("xModalCtrlArtigo", "Adicionar artigo");
});
$("[voltarItemExtra]").on("click", function () {
    if($("#artigo_composto").hasClass("active")) showTarget("article02", "", "true");
    else showTarget("article01", "", "true");
});
$("#xModalAllAboutArtigo").on("click", ".edit", function () {
    article.loadData();
    $("#xModalAllAboutArtigo .hideTarget").click();
}).on("click", ".xSwitch", function () {
    $("#xModalAllAboutArtigo .hideTarget").click();
    article.artigo_id = article.selected.artigo_id;
    showTarget("xModalArticleStatus", ($(this).is(":checked") ? "Ativar artigo" : "Desativar artigo"));
});
