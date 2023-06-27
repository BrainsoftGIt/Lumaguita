var tax = {
    list: [],
    selected: null,
    load(){
        $.ajax({
            url: "/api/impostos",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let lista_tipos_impostos = $("#lista_tipos_impostos");
                lista_tipos_impostos.empty();
                tax.list = [];
                tax.list = e.impostos;
                if(tax.list.length === 0) lista_tipos_impostos.addClass("empty");
                else lista_tipos_impostos.removeClass("empty");

                tax.list.forEach((imp, idx) =>{
                    imp = imp.data;
                    lista_tipos_impostos.append(`<ul class="flex">
                                                <li class="flex column">
                                                    <span>Código</span>
                                                    <span>${imp.tipoimposto_codigo}</span>
                                                </li>                                     
                                                  <li class="flex column">
                                                    <span>Nome</span>
                                                    <span>${imp.tipoimposto_nome}</span>
                                                </li>
                                                 <li class="flex column">
                                                    <span>Tipo de acréscimo</span>
                                                    <span>${(imp.taxa_taxa === null ? "Percentagem" : "Valor")}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Acréscimo</span>
                                                    <span>${(imp.taxa_taxa === null ? imp.taxa_percentagem+"%" : imp.taxa_taxa+" STN")}</span>
                                                </li>     
                                                <li class="flex column">
                                                    <span class="noLabel"></span>
                                                    <span class="flex v-ct">
                                                        <a>
                                                        <svg class="edit editarImposto" viewBox="0 0 512 512"  i="${idx}"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                        </a>
                                                    </span>
                                                </li>
                                            </ul>`);

                });
            }
        });
    },
    hasValidTaxFields:function () {
        if(!validation1($("#imposto_codigo, #imposto_nome"))) return false;
        if($("#imposto_tipo_acrescimo").find("li.active").length === 0){
            xAlert("Imposto", "Selecione o tipo de acréscimo!", "info");
            return false;
        }
        if(!validation1($("#imposto_acrescimo"))) return false;
        return true;
    },
    get selected_spaces(){
        let spaces = [];
        $("#imposto_espacos").find("li.active").each(function () {
            spaces.push({arg_espaco_destino :  $(this).attr("id")});
        });
        return spaces;
    },
    add:function () {
        $("[bt_imposto]").attr("disabled", true).addClass("loading");
        let tipo_acrescimo = $("#imposto_tipo_acrescimo");
        $.ajax({
            url : "/api/tax",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                tipoimposto_nome: clearText($("#imposto_nome").val()),
                tipoimposto_codigo: clearText($("#imposto_codigo").val()),
                taxa_taxa: (tipo_acrescimo.find("li.active").attr("tipo") === "value" ?  $("#imposto_acrescimo").val().unFormatter() : null),
                taxa_percentagem: (tipo_acrescimo.find("li.active").attr("tipo") === "percentage" ?  $("#imposto_acrescimo").val().unFormatter() : null),
                arg_links: tax.selected_spaces
            }),
            error(){
                $("[bt_imposto]").attr("disabled", false).removeClass("loading")
            },
            success:function (e) {
                $("[bt_imposto]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    tax.load();
                    $("#xModalImposto").find("input").val("");
                    $("#imposto_acrescimo").attr("disabled", true);
                    tipo_acrescimo.find("li").removeClass("active");
                    $("#imposto_espacos").find("li").removeClass("active");
                    $("#xModalImposto").find(".hideTarget").click();
                    xAlert("Adicionar imposto", "Operação efetuada com sucesso!");
                }
                else{
                    xAlert("Adicionar imposto", e.data, "error");
                }
            }
        });
    },
    edit(){
        $("[bt_imposto]").attr("disabled", true).addClass("loading");
        let tipo_acrescimo = $("#imposto_tipo_acrescimo");
        $.ajax({
            url : "/api/tax",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                tipoimposto_nome: clearText($("#imposto_nome").val()),
                tipoimposto_id: tax.selected.tipoimposto_id,
                tipoimposto_codigo: clearText($("#imposto_codigo").val()),
                taxa_taxa: (tipo_acrescimo.find("li.active").attr("tipo") === "value" ?  $("#imposto_acrescimo").val().unFormatter() : null),
                taxa_percentagem: (tipo_acrescimo.find("li.active").attr("tipo") === "percentage" ?  $("#imposto_acrescimo").val().unFormatter() : null),
                arg_links: tax.selected_spaces
            }),
            error(){
                $("[bt_imposto]").attr("disabled", false).removeClass("loading")
            },
            success:function (e) {
                $("[bt_imposto]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    tax.load();
                    $("#xModalImposto").find("input").val("");
                    $("#imposto_acrescimo").attr("disabled", true);
                    tipo_acrescimo.find("li").removeClass("active");
                    $("#imposto_espacos").find("li").removeClass("active");
                    $("#xModalImposto").find(".hideTarget").click();
                    xAlert("Editar imposto", "Operação efetuada com sucesso!");
                }
                else{
                    xAlert("Editar imposto", e.data, "error");
                }
            }
        });
    }
};


tax.load();
$("[novoImposto]").on("click", function () {
    if(!$("#xModalImposto").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
        $("#xModalImposto").find("input").val("");
        $("#imposto_espacos").find("li").removeClass("active");
    }
    showTarget("xModalImposto", "Adicionar imposto");
});
$("[bt_imposto]").on("click", function () {
    if(tax.hasValidTaxFields()){
        if($("#xModalImposto").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) tax.add();
        else tax.edit();
    }
});

$("#xModalImposto").on("keyup", "input:text",function () {
    if($(this).attr("id") === "imposto_valor"){
        if($(this).val() !== "") $("#imposto_percentagem").val("").attr("disabled", true);
        else $("#imposto_percentagem").attr("disabled", false);
    }
    else if($(this).attr("id") === "imposto_percentagem"){
        if($(this).val() !== "") $("#imposto_valor").val("").attr("disabled", true);
        else $("#imposto_valor").attr("disabled", false);
    }
});

$("#imposto_acrescimo").on("keyup", function () {
    if($(this).val()!== ""){
        let valor = Number($(this).val().unFormatter());
        if($("#imposto_tipo_acrescimo").find("li.active").attr("tipo") === "percentage" && valor > 100){
            $(this).val("");
        }
    }
})
$("#imposto_tipo_acrescimo").on("mousedown", "li", function () {
    $("#imposto_acrescimo").val("").attr("disabled", false);
    if($(this).attr("tipo") === undefined)
        $("#imposto_acrescimo").parents(".xinput.w100").find("label").text("Acréscimo");
    else if($(this).attr("tipo") === "value")
        $("#imposto_acrescimo").parents(".xinput.w100").find("label").text("Valor de acréscimo");
    else
        $("#imposto_acrescimo").parents(".xinput.w100").find("label").text("Percentagem de acréscimo");
});
$("#lista_tipos_impostos").on("click", ".editarImposto", function () {
     tax.selected = tax.list[$(this).attr("i")].data;
    $("#imposto_nome").val(tax.selected.tipoimposto_nome);
    $("#imposto_codigo").val(tax.selected.tipoimposto_codigo);
    $("#imposto_acrescimo").val((tax.selected.taxa_percentagem || tax.selected.taxa_taxa)).attr("disabled", false);
    if(tax.selected.taxa_percentagem){
        $("#imposto_tipo_acrescimo").find("li[tipo=percentage]").addClass("active");
        $("#imposto_tipo_acrescimo_desc").val("Por percentagem");
    }
    else{
        $("#imposto_tipo_acrescimo").find("li[tipo=value]").addClass("active");
        $("#imposto_tipo_acrescimo_desc").val("Por valor");
    }
    $("#imposto_espacos li").removeClass("active");
    tax.selected.link.forEach((lin) =>{
        $("#imposto_espacos").find(`li[id=${lin.espaco_id}]`).addClass("active");
    });
    showTarget("xModalImposto", "Editar imposto");
});