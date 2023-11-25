var printer = {
    index: null,
    init(){
        if(currentSystem.type === "loja"){
            $("#cookPrinterConfiguration").remove();
        }
    },
    addPrinterConfiguration(){
        let printOperations = $("#printOperations");
        let typePrinter = $("#typePrinter");
        let impressora_designacao = $("#impressora_designacao");
        let impressora_ip = $("#impressora_ip");
        let tipoImpressao = typePrinter.find("li.active").length === 1 ? typePrinter.find("li.active").text()
            : typePrinter.find("li.active").eq(0).text()+" e "+typePrinter.find("li.active").eq(1).text();

        $("#printersConfigured").prepend(`<li operation="${printOperations.find("li.active").attr("operation")}">
                                                <span class="flex h-sb">
                                                    <b>${printOperations.find("li.active").text()}</b>
                                                    <small talao="${(typePrinter.find("li.active[tipo=talao]").length === 0 ? "" : "Talão")}" 
                                                          pdf="${(typePrinter.find("li.active[tipo=pdf]").length === 0 ? "" : "Pdf")}" class="tipo_impressao">${tipoImpressao}</small>
                                                </span>
                                                ${(impressora_designacao.val().trim() !== "" ? '<span class="flex h-sb"><small>Nome da impressora</small><small class="nome_impressora">'+impressora_designacao.val().trim()+'</small></span>' : "")}
                                                ${(impressora_ip.val().trim() !== "" ? '<span class="flex h-sb"><small>IP da impressora</small><small class="ip_impressora">'+impressora_ip.val().trim()+'</small></span>' : "")}                                       
                                                <span class="ctrl">
                                                    <svg class="edit" viewBox="0 0 512 512">
                                                        <path
                                                            d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                                        <path
                                                            d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                                        <path
                                                            d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                                    </svg>
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
                                                </span>
                                            </li>`);
        impressora_designacao.val("");
        impressora_ip.val("");
        typePrinter.find("li").removeClass("active");
        printOperations.find("li.active").remove();
        printOperations.parents(".xselect").find("input").val("");
    },
    configurar(title){
        $("[bt_impressora]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/empresa/impressora",
            method: "POST",
            contentType: "application/json",
            error(){$("[bt_impressora]").prop("disabled", false).removeClass("loading")},
            data: JSON.stringify({configPrinter: settings.empresa}),
            success(e) {
                $("[bt_impressora]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    $("#hasKuchen").removeClass("active");
                    $("#xModalPrintSett").find(".hideTarget").click();
                    settings.carregarDadosEmpresa();
                    $("#printersConfigured").empty();
                    $("#impressora_designacao, #impressora_ip, #nome_impressora_cozinha, #ip_impressora_cozinha").val("");
                    $("#typePrinter, #printOperations").find("li").removeClass("active");
                    xAlert(title, "Operação efetuada com sucesso!");
                }
                else{
                    xAlert(title, e.message, "error");
                }
            }
        });
    },
    setAvailableTypePrint(operation){
        let typePrinter = $("#typePrinter");
        typePrinter.empty();
        console.log(operation);
        if(operation === "fatura_recibo" ||
            operation === "conta" ||
            operation === "fatura_recibo_2_via" ||
            operation === "fatura" ||
            operation === "recibo"){
            typePrinter.append(`<li class="stgl" tipo="talao">Talão</li>
                                <li class="stgl" tipo="pdf">A4 (PDF)</li>`);
        }
        else if(operation === "fatura_proforma"){
            typePrinter.append(`<li class="stgl" tipo="pdf">A4 (PDF)</li>`);
        }
        else{
            typePrinter.append(`<li class="stgl" tipo="talao">Talão</li>`);
        }
        if(typePrinter.find("li").length === 1) typePrinter.find("li").click();
    }
};
printer.init();
$("#printOperations").on("mousedown", "li",function () {
    printer.setAvailableTypePrint($(this).attr("operation"));
});
$("#printersConfigured").on("click", ".edit", function () {
    let typePrinter = $("#typePrinter");
    $("#printOperations").prepend(`<li operation="${$(this).parents("li").attr("operation")}">${$(this).parents("li").find("b").text()}</li>`);
    $("#printOperations li").eq(0).mousedown();
    $("#typePrinter li").removeClass("active");
    if($(this).parents("li").find(".tipo_impressao").attr("talao") !== ""){
        typePrinter.find("li[tipo=talao]").addClass("active");
    }
    if($(this).parents("li").find(".tipo_impressao").attr("pdf") !== ""){
        typePrinter.find("li[tipo=pdf]").addClass("active");
    }
    $("#impressora_designacao").val(($(this).parents("li").find(".nome_impressora").text() || ""));
    $("#impressora_ip").val(($(this).parents("li").find(".ip_impressora").text() || ""));
    $(this).parents("li").remove();
}).on("click", ".delete", function () {
    $("#printOperations").prepend(`<li operation="${$(this).parents("li").attr("operation")}">${$(this).parents("li").find("b").text()}</li>`);
    $(this).parents("li").remove();
});
$("[btAddPrinter]").on("click", function () {
    let typePrinter = $("#typePrinter");
    if($("#printOperations").find("li.active").length === 0){
        xAlert("Definições de impressão", "Escolha a operação!", "info")
        return;
    }
    if(typePrinter.find("li.active").length === 0){
        xAlert("Definições de impressão", "Escolha o(s) tipo(s) de impressão!", "info");
        return;
    }
    if(typePrinter.find("li.active[tipo=talao]").length !== 0){
        if($("#impressora_designacao").val().trim() === "" && $("#impressora_ip").val().trim() === ""){
            xAlert("Definições de impressão", "Digite o nome da impressora ou o IP da impressora!", "info");
            return;
        }
    }
    printer.addPrinterConfiguration();
});

$("[bt_impressora]").on("click", function () {
    let printersConfigured = $("#printersConfigured");
    if( printersConfigured.find("li").length === 0){
        xAlert("Definições de impressão", "Adicione configurações de impressão", "info");
        return;
    }
    if($("#hasKuchen").hasClass("active") && $("#nome_impressora_cozinha").val().trim() === "" && $("#ip_impressora_cozinha").val().trim() === ""){
        xAlert("Definições de impressão", "Digite o nome da impressora de cozinha ou o ip da impressora de cozinha!", "info");
        return;
    }

    let configuracao = {};
    let indice_configuracao_existente = 0;
    settings.empresa.impressoras_cozinha.nome = $("#hasKuchen").hasClass("active") ? ($("#nome_impressora_cozinha").val().trim() || null) : null;
    settings.empresa.impressoras_cozinha.ip = $("#hasKuchen").hasClass("active") ? ($("#ip_impressora_cozinha").val().trim() || null) : null
    settings.empresa.printTalaoA5 = $("#printTalaoA5").hasClass("active");
    settings.empresa.printTalaoA6 = $("#printTalaoA6").hasClass("active");
    settings.empresa.versionPrinter = $("[version].active").attr("version") || "";
    settings.empresa.impressorasTalao = {};

    settings.empresa.impressorasTalao.marginLeft =  $("#margin-left").val();
    settings.empresa.impressorasTalao.marginRight = $("#margin-right").val();
    settings.empresa.impressorasTalao.onlyOpen = $("#onlyOpen").hasClass("active");

    settings.empresa.impressoras_cozinha.marginLeft =  $("#cosinha-margin-left").val();
    settings.empresa.impressoras_cozinha.marginRight = $("#cosinha-margin-right").val();
    settings.empresa.impressoras_cozinha.onlyOpen = $("#onlyOpen").hasClass("active");


    printersConfigured.find("li").each(function () {
        indice_configuracao_existente = settings.empresa.configuracao_impressoras.findIndex(imp => imp.operacao.codigo === $(this).attr("operation"));
        if(indice_configuracao_existente !== -1){
            settings.empresa.configuracao_impressoras.splice(indice_configuracao_existente, 1);
        }
        configuracao = {};
        configuracao.operacao = {
            nome: $(this).find("b").text(),
            codigo: $(this).attr("operation")
        }
        configuracao.tipos_impressao = {
            talao : $(this).find(".tipo_impressao").attr("talao") || null,
            pdf : $(this).find(".tipo_impressao").attr("pdf") || null
        }
        configuracao.impressoras = {
            nome : $(this).find(".nome_impressora").text() || null,
            ip : $(this).find(".ip_impressora").text() || null
        }
        settings.empresa.configuracao_impressoras.push(configuracao);
    });
    printer.configurar("Configurar impressões");

});
$(".list-prints").on("click", ".delete", function () {
    printer.index = $(this).attr("i");
    showTarget("xModalDeletePrinter", "Remover configuração");
}).on("click", ".edit", function () {
    printer.index = $(this).attr("i");
    let typePrinter = $("#typePrinter");
    $("#printOperations").empty().prepend(`<li operation="${settings.empresa.configuracao_impressoras[printer.index].operacao.codigo}">${settings.empresa.configuracao_impressoras[printer.index].operacao.nome}</li>`);
    $("#printOperations li").eq(0).mousedown();
    $("#typePrinter li").removeClass("active");
    if(settings.empresa.configuracao_impressoras[printer.index].tipos_impressao.talao !== null){
        typePrinter.find("li[tipo=talao]").addClass("active");
    }
    if(settings.empresa.configuracao_impressoras[printer.index].tipos_impressao.pdf !== null){
        typePrinter.find("li[tipo=pdf]").addClass("active");
    }
    $("#impressora_designacao").val((settings.empresa.configuracao_impressoras[printer.index].impressoras.nome || ""));
    $("#impressora_ip").val((settings.empresa.configuracao_impressoras[printer.index].impressoras.ip || ""));
    showTarget("xModalPrintSett", "Editar impressora");
});
$("[remove_printer]").on("click", function () {
    $("#printOperations").prepend(`<li operation="${settings.empresa.configuracao_impressoras[printer.index].operacao.codigo}">${settings.empresa.configuracao_impressoras[printer.index].operacao.nome}</li>`);
    settings.empresa.configuracao_impressoras.splice(printer.index, 1);
    printer.configurar("Remover configuração");
});
$("#hasKuchen").on("mousedown" ,function () {
    $(this).toggleClass("active");
    setTimeout(() => {
        if ($(this).hasClass("active")) {
            $("#xModalPrintSett").addClass("haveKuchen");
            return
        }
        $(" #xModalPrintSett ").removeClass("haveKuchen");
    }, 10)
});
