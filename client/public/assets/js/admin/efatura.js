var efatura = {
    list: [],
    current_type_serie: null,
    listar(){
        $.ajax({
            url: "/api/efatura/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({place: "admin"}),
            success(e) {
                let series_efatura = $("#series_efatura");
                series_efatura.empty();
                efatura.list = [];
                efatura.list = e.series;
                if(efatura.list.length === 0) series_efatura.addClass("empty");
                else series_efatura.removeClass("empty");

                efatura.list.forEach((ef, idx) =>{
                    ef = ef.data;
                    series_efatura.append(`<ul class="flex">
                                                <li class="flex column">
                                                    <span>Tipo de série</span>
                                                    <span>${$("#tipo_serie_efatura").find(`li[tipo_id=${ef.serie_tserie_id}]`).text()}</span>
                                                </li>                                     
                                                  <li class="flex column">
                                                    <span>Designação</span>
                                                    <span>${ef.serie_designacao}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Número de série</span>
                                                    <span>${ef.serie_numero}</span>
                                                </li>
                                                 <li class="flex column">
                                                    <span>Armazém</span>
                                                    <span>${ef.espaco_nome}</span>
                                                </li>
                                                 <li class="flex column">
                                                   <span>Número de autorização</span>
                                                    <span>${(ef.serie_numatorizacao || "-----")}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span class="noLabel"></span>
                                                    <span class="flex v-ct">
                                                        <a  class="editar" i="${idx}" title="Editar">
                                                          <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                      </a>       
                                                    </span>
                                                </li>
                                            </ul>`);
                });
            }
        });
    },
    adicionar(){
        $("[bt_efatura]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/efatura",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({serie_id: null, serie_tserie_id: $("#tipo_serie_efatura").find("li.active").attr("tipo_id"),
                serie_espaco_id: $("#armazem_efatura").find("li.active").attr("armazem_id"),
                serie_designacao: $("#designacao_serie_efatura").val().trim(),
                serie_numero: $("#numero_serie_efatura").val().split("-")[1],
                serie_quantidade: $("#quantidade_serie_efatura").val(),
                serie_numatorizacao: $("#numero_autorizacao_serie").val(),
                serie_numcertificacao: null}),
            error(){
                $("[bt_efatura]").prop("disabled", false).removeClass("loading")
            },
            success(e) {
                $("[bt_efatura]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    efatura.listar();
                    xAlert("Série", "Configuração de série para o armazém definida com sucesso!");
                    $("#tipo_serie_efatura, #armazem_efatura").find("li").removeClass("active");
                    $("#xModalEfatura input").val("");
                    $("#numero_serie_efatura").attr("disabled", true);
                    $("#xModalEfatura .hideTarget").click();
                }
                else{
                    xAlert("Série", e.data, "error");
                }
            }
        });
    },
    editar(){
        $("[bt_efatura]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/efatura",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({serie_id: efatura.selected.serie_id, serie_tserie_id: $("#tipo_serie_efatura").find("li.active").attr("tipo_id"),
                serie_espaco_id: $("#armazem_efatura").find("li.active").attr("armazem_id"),
                serie_designacao: $("#designacao_serie_efatura").val().trim(),
                serie_numero: $("#numero_serie_efatura").val().split("-")[1],
                serie_quantidade: $("#quantidade_serie_efatura").val(),
                serie_numatorizacao: $("#numero_autorizacao_serie").val(),
                serie_numcertificacao: null}),
            error(){
                $("[bt_efatura]").prop("disabled", false).removeClass("loading")
            },
            success(e) {
                $("[bt_efatura]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    efatura.listar();
                    efatura.selected = null;
                    xAlert("Série", "Configuração de série atualizada com sucesso!");
                    $("#tipo_serie_efatura, #armazem_efatura").find("li").removeClass("active");
                    $("#xModalEfatura input").val("");
                    $("#numero_serie_efatura").attr("disabled", true);
                    $("#xModalEfatura .hideTarget").click();

                }
                else{
                    xAlert("Série", e.data, "error");
                }
            }
        });
    }
};
efatura.listar();

$("[novaSerieEfatura]").on("click", function () {
    if(efatura.selected !== null){
        $("#tipo_serie_efatura, #armazem_efatura").find("li").removeClass("active");
        $("#xModalEfatura input").val("");
    }
   showTarget("xModalEfatura", "Adicionar série");
});
$("#tipo_serie_efatura").on("mousedown", "li", function () {
    efatura.current_type_serie = $(this).attr("tipo_sigla");
    $("#numero_serie_efatura").val($(this).attr("tipo_sigla")).attr("disabled", false);
});
$('#numero_serie_efatura').keyup(function() {
    if($(this).val().includes(efatura.current_type_serie)) $(this).val($(this).val());
    else $(this).val( efatura.current_type_serie);
});

$("[bt_efatura]").on("click", function () {
    if($("#tipo_serie_efatura").find("li.active").length === 0){
        xAlert("Série", "Selecione o tipo de série!", "info");
        return;
    }
    if($("#armazem_efatura").find("li.active").length === 0){
        xAlert("Série", "Selecione o armazém!", "info");
        return;
    }
    if(!validation1($("#designacao_serie_efatura, #numero_serie_efatura, #quantidade_serie_efatura, #numero_autorizacao_serie, #numero_certificacao_serie"))) return;
    if($("#numero_serie_efatura").val().split("-")[1].length !== 7){
        xAlert("Série", "O número de série deve ter sete (7) dígitos.", "error");
        $("#numero_serie_efatura").focus();
        return;
    }
    if($("#xModalEfatura").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) efatura.adicionar();
    else efatura.editar();
});
$("#series_efatura").on("click", ".editar", function () {
    efatura.selected = efatura.list[$(this).attr("i")].data;
    let tipo_serie_efatura = $("#tipo_serie_efatura");
    tipo_serie_efatura.find("li").removeClass("active");
    tipo_serie_efatura.find(`li[tipo_id=${efatura.selected.serie_tserie_id}]`).addClass("active");
    tipo_serie_efatura.parents(".xselect").find("input").val(   tipo_serie_efatura.find(`li[tipo_id=${efatura.selected.serie_tserie_id}]`).text());
    let armazem_efatura = $("#armazem_efatura");
    armazem_efatura.find("li").removeClass("active");
    armazem_efatura.find(`li[armazem_id=${efatura.selected.serie_espaco_id}]`).addClass("active");
    armazem_efatura.parents(".xselect").find("input").val(armazem_efatura.find(`li[armazem_id=${efatura.selected.serie_espaco_id}]`).text());
    $("#designacao_serie_efatura").val(efatura.selected.serie_designacao);
    $("#numero_serie_efatura").val( tipo_serie_efatura.find(`li[tipo_id=${efatura.selected.serie_tserie_id}]`).attr("tipo_sigla")
        +efatura.selected.serie_numero).attr("disabled", false);
    $("#quantidade_serie_efatura").val(efatura.selected.serie_quantidade);
    $("#numero_autorizacao_serie").val((efatura.selected.serie_numatorizacao || ""));
    $("#numero_certificacao_serie").val((efatura.selected.serie_numcertificacao || ""));
    showTarget("xModalEfatura", "Editar série");

});