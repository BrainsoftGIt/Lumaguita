var notacredito = {
    loadData : () => {
        $.ajax({
            url: "/api/load/fatura/to/credito/nota",
            method: "POST",
            contentType: "application/json",
            error() { $("#finalizar_guia_entrada").attr("disabled", false).removeClass("loading") },
            complete() { $("#finalizar_guia_entrada").attr("disabled", false).removeClass("loading") },
            data: JSON.stringify({
                conta_fatura: $("[pesquisarFatura]").val()
            }),
            success: ({fatura}) => {
                let { conta_titularnif, conta_titular } = fatura;
                notacredito.fatura = fatura;
                $("[cliente_titular]").val(conta_titular);
                $("[cliente_nif]").val(conta_titularnif);
            }
        });
    }
}

$("[pesquisarFatura]").on("keyup", function ({keyCode}){
    let { loadData } = notacredito;
    if(keyCode === 13 && $(this).val()){
        loadData();
    }
})


xTableGenerate()
