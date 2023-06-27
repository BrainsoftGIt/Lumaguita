var retalho = {
    list: [],
    init(){
        $("#retalho_quantidade").val("");
        $("#retalho_artigo_base").empty();
        $("#artigo_nova_composicao").empty();
        retalho.carregarArtigosCompostos();
    },
    carregarArtigosCompostos(){
        $.ajax({
            url: "/api/pos/artigo/composto/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                retalho.list = [];
                retalho.list = e.artigos;
                let retalho_artigo_composto = $("#retalho_artigo_composto");
                retalho_artigo_composto.empty().append('<option value="" disabled selected>Escolha uma opção</option>');
                retalho.list.forEach((art) =>{
                    art = art.data;
                    retalho_artigo_composto.append(`<option value="${art.artigo_id}">${art.artigo_nome}</option>`);
                });
                updateMaterializeFields();
            }
        });
    },
    retalhar(){
        $("[bt_retalhar]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/pos/artigo/retalho",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({retalho_artigo_composto: $("#retalho_artigo_composto").val(), retalho_artigo_base: $("#retalho_artigo_base").val(),
                retalho_composicao: $("#retalho_artigo_base").find("option:selected").attr("compostoquantidade"),
                retalho_quantidade: $("#retalho_quantidade").val()}),
            error(){
                $("[bt_retalhar]").prop("disabled", false).removeClass("loading")
            },
            success(e) {
                $("[bt_retalhar]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    $("#artigo_nova_composicao").empty();
                    xAlert("Retalho de artigo", "Operação efetuada com sucesso!");
                    $("#xModalRetalharArtigo").find(".hideTarget").click();
                }
                else xAlert("Retalho de artigo", e.data, "error");
            }
        });
    },
    structureDataAfterLoginShred(defaultSpace) {
        let armazens_pos = $("#armazens_pos");
        armazens_pos.find("div.account").removeClass("active");
        if(account.user_spaces.length > 1){
            if(defaultSpace === null){
                $("#armazem_selecionado_pos").css("display", "");
                $("#iptArmazene").val("ARMAZÉM");
                account.functionAfterSetSpace = function () {
                    $("#MST-PIN").find(".hideTarget").click();
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                    showTarget("xModalRetalharArtigo");
                    retalho.init();
                };
                M.toast({html: "Escolha o armazém!", classes: 'rounded'});
                showTarget("xModalChooseArmazene");
            }
            else{
                armazens_pos.find("div.account[armazem_id="+defaultSpace+"]").addClass("active");
                $("#MST-PIN").find(".hideTarget").click();
                showTarget("xModalRetalharArtigo");
                retalho.init();
            }
        }
        else{
            $("#MST-PIN").find(".hideTarget").click();
            showTarget("xModalRetalharArtigo");
            retalho.init();
        }
    },
    calcularComposicao(){
        let composicao_quantidade = $("#retalho_artigo_base").find("option:selected").attr("compostoquantidade");
        let artigoObter = Number(composicao_quantidade) * Number($("#retalho_quantidade").val());
        $("#artigo_nova_composicao").append(`<p>Artigo a retalhar: ${$("#retalho_quantidade").val()+" "+$("#retalho_artigo_composto").find("option:selected").text()}</p>
                                              <p>Artigo a obter: ${artigoObter+" "+$("#retalho_artigo_base").find("option:selected").text()}</p>  `);
    }
};


$("[retalharArtigo]").on("click", function () {
    if(account.hasValidPost()){
        account.resetModalAuthentication();
        $(".fkinputs .table").css("display", "none");
        account.operation = "retalhar";
        account.loadUsers(["maguita.pos.retalho"]);
    }
});
$("[bt_retalhar]").on("click", function () {
    if(validation1($("#retalho_artigo_composto, #retalho_artigo_base, #retalho_quantidade"))){
        retalho.retalhar();
    }
});
$("#retalho_artigo_composto").on("change", function () {
    $("#artigo_nova_composicao").empty();
    if($(this).val() !== ""){
        let artigo_composto_id = $(this).val();
        let artigo_bases = retalho.list.filter(art => art.data.artigo_id === artigo_composto_id);
        let retalho_artigo_base = $("#retalho_artigo_base");
        retalho_artigo_base.empty().append('<option value="">(Selecione)</option>');
        if(artigo_bases[0].data.artigo_bases.length > 0){
            artigo_bases[0].data.artigo_bases.forEach((artBase) =>{
                retalho_artigo_base.append(`<option value="${artBase.artigo_base}" compostoquantidade="${artBase.artigo_compostoquantidade}">${artBase.artigo_parent}</option>`);
            });
        }
        else{
            xAlert("Retalho de artigos", "Não há artigos base para o artigo composto selecionado.", "error");
        }
    }
    updateMaterializeFields();
});
$("#retalho_artigo_base").on("change", function () {
    let composicao_quantidade = $(this).find("option:selected").attr("compostoquantidade");
    let artigo_nova_composicao = $("#artigo_nova_composicao");
    artigo_nova_composicao.empty();
    if($(this).val() !== ""){
        let composicao = 1 +" "+$("#retalho_artigo_composto").find("option:selected").text()+" -> Valendo "+composicao_quantidade+" "+$(this).find("option:selected").text();
        artigo_nova_composicao.append(`<p>${composicao}</p>`);
        if($("#retalho_quantidade").val() !== "")
            retalho.calcularComposicao();
    }
});
$("#retalho_quantidade").on("keyup", function () {
    if($("#retalho_artigo_base").val() !== "" && $(this).val() !== ""){
        retalho.calcularComposicao();
    }
    else{
        $("#artigo_nova_composicao").find("p:last").prev().remove();
        $("#artigo_nova_composicao").find("p:last").remove();
    }
});