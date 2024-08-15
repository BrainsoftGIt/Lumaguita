var fatura = {
    CODE_OPERATION_PROFROM: "fatura_proforma",
    CODE_OPERATION_ACCOUNT: "conta"
};

$("#pos_fatura").on("click", async function () {
    let dataCarrinho = pos.updateLastConfirmation(false);
    if (dataCarrinho !== pos.lastConfirmation) {
        M.toast({html: 'Confirme artigos no carrinho!', classes: 'rounded'});
        return
    }

    spaceConfig.loadConfig().then(value => {
        if (spaceConfig.isConfigured({object: value.config[0]})) {
            if ($("#artigos_carrinho").find("li.sended").length > 0) {
                if (pos.haveAccessGranted("maguita.pos.imprimir.conta", true)) {
                    if (spaceConfig.hasPrinter({operation: fatura.CODE_OPERATION_ACCOUNT})) {
                        spaceConfig.operationCode = fatura.CODE_OPERATION_ACCOUNT;
                        spaceConfig.account_id = pos.conta_id;
                        spaceConfig.getPrinter({operation: fatura.CODE_OPERATION_ACCOUNT});
                    }
                } else M.toast({html: 'Sem privilégio para imprimir conta.', classes: 'rounded'});
            } else M.toast({html: 'Adicione e confirme artigos no carrinho!', classes: 'rounded'});
        }
    });
});

$("#xModalPrintTypeAccount").on("click", ".tipoFaturaContas", function () {
     if($(this).attr("tipo") === "conta"){
         $("[printAccount]").text("Imprimir");
        $(".more-info-proforma").css("display", "none");
     }
     else{
         $("[printAccount]").text("Avançar");
         $(".more-info-proforma").css("display", "");
     }
});
// $("#clienteSelecionadoProforma").on("click", function () {
//    if($("#xModalAllRegisteredClients ul").find("li.active").length === 0){
//        xAlert("Fatura Proforma", "Escolha o cliente para o qual vai estar associado a fatura proforma!", "info");
//    }
// });
