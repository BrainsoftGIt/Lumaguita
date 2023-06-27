var category = {
    categoria_id: null,
    picture: null,
    ITEM_EXTRA_CATEGORIA_ID: "00000000-0000-0000-0000-000000000001",
    list: [],
    load() {
        $.ajax({
            url: "/api/categorias",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let listCats = $(".listCats");
                let filtro_categorias = $("#filtro_categorias");
                let fotoCategoria;
                let totalArtigosCategoria;
                category.list = [];
                category.list = e.categs;
                artigosImportacao.lista_categorias_exportar = [];
                listCats.empty();
                filtro_categorias.empty();
                if(category.list.length <= 1) listCats.addClass("empty");
                else{
                    filtro_categorias.append("<li class='flex v-ct h-sb active'><a>Todas</a></li>");
                    listCats.removeClass("empty");
                }

                category.list.forEach((cat, idx) => {
                    cat = cat.data;
                    if (cat.classe_nome && cat.classe_id !== category.ITEM_EXTRA_CATEGORIA_ID) {
                        if (cat.classe_foto !== null)
                            fotoCategoria = "/storage/" + cat.classe_foto.split(";")[0];

                        if(cat.classe_id !== category.ITEM_EXTRA_CATEGORIA_ID){
                            artigosImportacao.lista_categorias_exportar.push({classe_id: cat.classe_id, classe_nome: cat.classe_nome});
                        }
                        if(parseInt(cat.artigos.total) === 0) totalArtigosCategoria = "Sem artigos";
                        else if(parseInt(cat.artigos.total) === 1) totalArtigosCategoria = "1 artigo";
                        else totalArtigosCategoria = cat.artigos.total+" artigos";

                            listCats.append(`<div class="flex inList tgl" cat_id="${cat.classe_id}">
                                        ${(cat.classe_foto === null ? '<div class="img-container empty-artigo"></div>' : '<div class="img-container" style="background-image: url(' + fotoCategoria + ')"></div>')}
                                            <div class="minDet grow-1">
                                                <p>${cat.classe_nome}</p>
                                                <small>${totalArtigosCategoria}</small>
                                                </div>
                                    </div>`);

                        filtro_categorias.append(`<li class="flex v-ct h-sb" cat_id="${cat.classe_id}" pic="${cat.classe_foto}">
                            <a>${ cat.classe_nome.toUpperCase() }</a>
                            ${(cat.classe_id === category.ITEM_EXTRA_CATEGORIA_ID ? "" : `<div class="flex v-ct opts">
                                    <a title="Editar">
                                        <svg class="edit" viewBox="0 0 512 512" i="${idx}">
                                            <path
                                                d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                            <path
                                                d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                            <path
                                                d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                        </svg>
                                    </a>
                                    <a title="Remover">
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
                                </div>`)}
                        </li>`);
                    }
                });
            }
        });
    },
    get selectedSpacesWhareshouses(){
        let spaces = [];
        $("#categoria_armazens").find("li.active").each(function () {
            spaces.push({espaco_id: $(this).attr("armazem_id")});
        });
        return spaces;
    },
    add() {
        $("[bt_categoria]").attr("disabled", true).addClass("loading");
        let formData = new FormData();
         formData.append("data", JSON.stringify({ classe_nome: $("#categoria_nome").val().trim(), classe_classe_id: null,
             classe_foto: null, arg_espacos: this.selectedSpacesWhareshouses }));
        formData.append("file",  $("#categoria_foto")[0].files[0]);

        $.ajax({
            url: "/api/categoria",
            method: "POST",
            processData: false,
            contentType: false,
            enctype: "multipart/form-data",
            data: formData,
            error() { $("[bt_categoria]").attr("disabled", false).removeClass("loading") },
            complete() { $("[bt_categoria]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_categoria]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    category.load();
                    xAlert("Adicionar categoria", "Operação efetuada com sucesso!");
                    $("#categoria_foto, #categoria_nome, #categoria_armazem_desc").val("");
                    $("#categoria_armazens").find("li").removeClass("active");
                    $("#xModalCtrlCategory").find(".hideTarget").click();
                    $("label[lab=FOTO]").text(".jpg, .png, .jpeg");
                }
                else xAlert("Adicionar categoria", e.message, "error");
            }
        });
    },
    edit(){
        $("[bt_categoria]").attr("disabled", true).addClass("loading");
        let formData = new FormData();
         formData.append("data", JSON.stringify({ classe_nome: $("#categoria_nome").val().trim(), classe_classe_id: null, classe_foto: (this.picture === "null" ? null : this.picture),
             arg_espacos: this.selectedSpacesWhareshouses, classe_id: this.categoria_id }));
        formData.append("file",  $("#categoria_foto")[0].files[0]);

        $.ajax({
            url: "/api/categoria",
            method: "POST",
            processData: false,
            contentType: false,
            enctype: "multipart/form-data",
            data: formData,
            error() { $("[bt_categoria]").attr("disabled", false).removeClass("loading") },
            complete() { $("[bt_categoria]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[bt_categoria]").attr("disabled", false).removeClass("loading");
                if (e.result) {
                    category.load();
                    xAlert("Editar categoria", "Operação efetuada com sucesso!");
                    $("#categoria_foto, #categoria_nome").val("");
                    $("#xModalCtrlCategory").find(".hideTarget").click();
                    $("label[lab=FOTO]").text(".jpg, .png, .jpeg");
                }
                else xAlert("Editar categoria", e.message, "error");
            }
        });
    },
    remove(){
        $("[removeCategory]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/category/remove",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_classe_id:  category.categoria_id }),
            error() { $("[removeCategory]").attr("disabled", false).removeClass("loading") },
            success(e) {
                $("[removeCategory]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    category.load();
                    xAlert("Remover categoria", "Operação efetuada com sucesso!");
                    $("#xModalRemoveCategory").find(".hideTarget").click();
                }
                else{
                    xAlert("Remover categoria", e.message, "error");
                }
            }
        });
    }
};

category.load();
$("#categoria_foto").on("change", function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    if (this.files.length === 0) return;

    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        $("label[lab=FOTO]").text(file.name);
    };
    reader.readAsDataURL(file);
});
$("[bt_categoria]").on("click", function () {
    if (!validation1($("#categoria_nome"))) return;
    if ($("#xModalCtrlCategory").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) category.add();
    else category.edit();
});
$("#selectCategoryArticle").on("click", function () {
    if($(".listCats").find("div.active").length === 0){
        xAlert("Artigo", "Selecione a categoria!", "info");
    }
});
$(".listCats").on("click", "div", function () {
     $("#categoria_artigo").text($(this).find("p").text());
     if($("[selectedCategory]").length === 0)
         $(".theArtg").prepend(`<p class="info" selectedCategory>Este artigo será adicionado à categoria <span>${$(this).find("p").text()}</span></p>`);
     else $("[selectedCategory] span").text($(this).find("p").text());
});
$("#filtro_categorias").on("click", ".edit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#categoria_armazens li").removeClass("active");
    category.list[$(this).attr("i")].data.classe_espacos.forEach((sp)=>{
        $("#categoria_armazens").find(`li[armazem_id=${sp.espaco_id}]`).addClass("active");
    });
    category.categoria_id = $(this).parents("li").attr("cat_id");
    category.picture = $(this).parents("li").attr("pic");
    $("#categoria_nome").val($(this).parents("li").find("a").text());
    $("#categoria_foto").val("");
    if(category.picture === "null") $("label[lab=FOTO]").text(".jpg, .png, .jpeg");
    else $("label[lab=FOTO]").text(category.picture.split(";")[1]);

    showTarget("xModalCtrlCategory", "Editar categoria");
}).on("click", ".delete", function (e) {
    e.preventDefault();
    e.stopPropagation();
    category.categoria_id = $(this).parents("li").attr("cat_id");
    showTarget("xModalRemoveCategory", "Remover categoria");
});
$("[removeCategory]").on("click", function () {
    category.remove();
});

