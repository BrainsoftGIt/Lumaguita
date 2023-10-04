var box = {
    id: null,
    montante_inicial: 0,
    CODE_OPERATION: "caixa",
    structureDataAfterLoginCloseBox(defaultSpace) {
        let armazens_pos = $("#armazens_pos");
        armazens_pos.find("div.account").removeClass("active");
        if(account.user_spaces.length > 1){
            if(defaultSpace === null){
                $("#armazem_selecionado_pos").css("display", "");
                $("#iptArmazene").val("ARMAZÉM");
                account.functionAfterSetSpace = function () {
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                    box.loadBox(false);
                };
                M.toast({html: "Escolha o armazém!", classes: 'rounded'});
                showTarget("xModalChooseArmazene");
            }
            else{
                armazens_pos.find("div.account[armazem_id="+defaultSpace+"]").addClass("active");
                $("#MST-PIN").find(".hideTarget").click();
                box.loadBox(false);
            }
        }
        else{
            $("#MST-PIN").find(".hideTarget").click();
            box.loadBox(false);
        }
    },
    loadBox(efetuarPagamento = true){
        $.ajax({
            url: "/api/posto/caixa/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                vermontatefaturado: account.post.posto_vermontatefaturado
            }),
            success({ caixas : { 0 : xCaixa }}) {
                let { data : caixa } = xCaixa || {};

                if(efetuarPagamento){
                    if(!caixa){
                        showTarget("xModalOpenBox");
                    }
                    else{
                        box.id = caixa.caixa_id;
                        payment.mostrarDadosModalPagamento();
                    }
                }
                else{
                    if(!caixa){
                        xAlert("Fecho de caixa", "Não há caixa aberta!", "error");
                        $("#MST-PIN").find(".hideTarget").click();
                    }
                    else{
                        box.id = caixa.caixa_id;
                        box.montante_inicial = caixa.caixa_montanteinicial;
                        $("#valorTotalCaixaFaturado").val((caixa.caixa_montanteinicial + caixa.deposito_montantefinal).dc().formatter() || "");
                        if(account.post.posto_vermontatefaturado) {
                            $("[for='valorTotalCaixaFaturado']").addClass("active");
                        }
                        $("#totalChequesCaixaFaturado, #caixa_fechar_obs").val("");
                        $("#caixa_montanteinicial").text("STN "+caixa.caixa_montanteinicial.dc().formatter());
                        $("#MST-PIN").find(".hideTarget").click();
                        showTarget("xModalCloseBox");
                    }
                }
            }
        });
    },
    openBox(){
        $("[openBox]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/post/box/open",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({caixa_montanteinicial: $("#caixa_valor_transferido").val().unFormatter()}),
            error(){$("[openBox]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[openBox]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    box.loadBox();
                    $("#caixa_valor_transferido").val("");
                    $("#xModalOpenBox").find(".hideTarget").click();
                    M.toast({html: "Caixa foi aberta com sucesso!", classes: 'rounded'});
                }
                else{
                    M.toast({html: e.data, classes: 'rounded'});
                }
            }
        });
    },
    close(){
        $("[fecharCaixa]").prop("disabled", true).addClass("loading");
        spaceConfig.dados_caixa = {
            valor_abertura: box.montante_inicial,
            valorFecho: $("#valorTotalCaixaFaturado").val().unFormatter(),
            quantidadeCheques: ($("#totalChequesCaixaFaturado").val().trim() || 0),
            obs: ($("#caixa_fechar_obs").val().trim() || null),
            posto:  $("[posto]").text(),
            date: new Date().getTimeStampPt()
        };
        $.ajax({
            url: "/api/post/box/close",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_caixa_id: box.id, arg_caixa_montantefecho: spaceConfig.dados_caixa.valorFecho,
                arg_caixa_quantidadecheque: spaceConfig.dados_caixa.quantidadeCheques,
                arg_caixa_observacao: spaceConfig.dados_caixa.obs}),
            error(){$("[fecharCaixa]").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("[fecharCaixa]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    spaceConfig.operationCode = box.CODE_OPERATION;
                    xAlert("Fecho de caixa", "Operação efetuada com sucesso!");
                    $("#valorTotalCaixaFaturado, #totalChequesCaixaFaturado, #caixa_fechar_obs").val("");
                    $("#xModalCloseBox").find(".hideTarget").click();
                    spaceConfig.getPrinter({operation: spaceConfig.operationCode});
                }
                else{
                    xAlert("Fecho de caixa", e.data, "error");
                }
            }
        });
    }
};

$("[openBox]").on("click", function () {
    if(validation1($("#caixa_valor_transferido"))){
        box.openBox();
    }
});
$("#caixa_valor_transferido").keypress(function (e) {
    if(e.which === 13)
        $("[openBox]").click();
});
$("[fecharCaixa]").on("click", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(spaceConfig.hasPrinter({operation: box.CODE_OPERATION})){
                if(validation1($("#valorTotalCaixaFaturado"))){
                    box.close();
                }
            }
        }
    });
});
$("[closeBox]").on("click", function () {
    if(account.hasValidPost()){
        account.resetModalAuthentication();
        account.operation = "fecharCaixa";
        $(".fkinputs .table").css("display", "none");
        account.loadUsers(["maguita.pos"]);
    }
});
