var artigosImportacao = {
    lista_categorias_exportar: [],
    get armazensSelecionadosExportar(){
        let armazens = [];
        let element = $("[armazens_importar_artigos]").find("li").length === 1 ? $("[armazens_importar_artigos]").find("li")
            :  $("[armazens_importar_artigos]").find("li.active");
        element.each(function () {
            armazens.push({espaco_id: $(this).attr("armazem_id"), espaco_nome: $(this).text()});
        });
        return armazens;
    },
     exportarModelo(){
         $.ajax({
             url: "/api/importacao/artigo/data",
             method: "POST",
             contentType: "application/json",
             data: JSON.stringify({
                 units: article.units,
                 taxs: article.impostos,
                 taxCodes: article.taxCodes,
                 aplicImposto: article.imposto_lista_tipo_aplicacao,
                 categs: artigosImportacao.lista_categorias_exportar,
                 spaces: artigosImportacao.armazensSelecionadosExportar
             }),
             success: (file) => {
                 open("/api/exportar/modelo/artigos/" + JSON.stringify({file}));
             }
         })
         $("#xModalArmazensImportarArtigos .hideTarget, #xModalExImportArt .hideTarget").click();
         $("[armazens_importar_artigos]").find("li").removeClass("active");
     },
    exportarArtigos(){
        $.ajax({
            url: "/api/importacao/artigo/data",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                units: article.units,
                taxs: article.impostos,
                taxCodes: article.taxCodes,
                aplicImposto: article.imposto_lista_tipo_aplicacao,
                categs: artigosImportacao.lista_categorias_exportar,
                spaces: artigosImportacao.armazensSelecionadosExportar
            }),
            success: (file) => {
                open("/api/exportar/artigos/" + JSON.stringify({file}));
            }
        })
        $("#xModalArmazensImportarArtigos .hideTarget, #xModalExImportArt .hideTarget").click();
        $("[armazens_importar_artigos]").find("li").removeClass("active");
    },
    importar(){
        $("body").addClass("loading");
        let formData = new FormData();
        formData.append("categorias", JSON.stringify(artigosImportacao.lista_categorias_exportar));
        formData.append("impostos", JSON.stringify(article.impostos));
        formData.append("aplic_imposto", JSON.stringify(article.imposto_lista_tipo_aplicacao));
        formData.append("unidades", JSON.stringify(article.units));
        formData.append("file",  $("#artigoImportIpt")[0].files[0]);
        $("#xModalExImportArt").find(".hideTarget").click();
        $("#artigoImportIpt").val("");
        $.ajax({
            url: "/api/importar_artigos",
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            dataType: "json",
            data: formData,
            error() {$("body").removeClass("loading") },
            success(e) {
                $("body").removeClass("loading");
                if(e.result){
                    xAlert("Importar artigos", "Artigos importados com sucesso.");
                    article.categoria_id = null;
                    category.load();
                    setTimeout(() =>{
                        article.load();
                    }, 800);

                }
                else{
                    let erros_importar_artigos = $("#erros_importar_artigos");
                    erros_importar_artigos.empty();
                    e.erros.forEach((err) =>{
                        erros_importar_artigos.append(`<li class="flex h-sb v-ct" style="padding-bottom: 0.5rem;">${err}</li>`);
                    });
                    showTarget("xModalImportArtErrors", "Erros encontrados")
                }
            }
        });
    }
};


$("#baixarModeloArtigos").on("click", function () {
    if ($("[armazens_importar_artigos]").find("li").length === 1) {
        artigosImportacao.exportarModelo();
        $("#xModalExImportArt .hideTarget").click();
    } else {
        artigosImportacao.lastExport = artigosImportacao.exportarModelo;
        showTarget("xModalArmazensImportarArtigos");
    }
});
$("#artigoImportIpt").on("change", function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    if (this.files.length === 0) return;

    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        artigosImportacao.importar();
    };
    reader.readAsDataURL(file);
});

$("[btExportarModelo]").on("click", function () {
    if($("[armazens_importar_artigos]").find("li.active").length === 0){
        xAlert("Baixar modelo", "Selecione o(s) armazém(s)!", "info");
        return;
    }

    if(artigosImportacao.lastExport) {
        artigosImportacao.lastExport();
    }
});

$("[btArtigoExportar]").on("click", function () {
    if ($("[armazens_importar_artigos]").find("li").length === 1) {
        artigosImportacao.exportarArtigos();
        $("#xModalExImportArt .hideTarget").click();
    } else {
        artigosImportacao.lastExport = artigosImportacao.exportarArtigos;
        showTarget("xModalArmazensImportarArtigos");
    }
});
