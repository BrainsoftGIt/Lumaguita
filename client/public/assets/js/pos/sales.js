var sales = {
    list: [],
    sales_date: null,
    CODE_OPERATION_FATURA_RECIBO_SECOND: "fatura_recibo_2_via",
    load(date = new Date().getDateEn()){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/post/sales",
            method: "POST",
            contentType: "application/json",
            error(){$("body").removeClass("loading")},
            data: JSON.stringify({arg_conta_data: date}),
            success(e) {
                $("#vendasPosto").empty();
                $("body").removeClass("loading");
                sales.list = [];
                sales.list = e.vendas;
                if(sales.list.length === 0){
                    $("#vendasPosto").addClass("empty");
                }
                else{
                    $("#vendasPosto").removeClass("empty");
                    sales.list.forEach((sale) =>{
                        sale = sale.data;
                        $("#vendasPosto").append(`<ul class="flex" conta_id="${sale.conta_id}" data-data_fatura="${sale.conta_dataregistro}">
                                                    <li>${sale.conta_numerofatura}</li>
                                                    <li>${sale.colaborador_nome}</li>
                                                    <li>${(sale.conta_titular || "N/D")}</li>                      
                                                    <li>${sale.conta_montante.dc().formatter()+" STN"}</li>
                                                    <li>${sale.deposito_montantemoeda.dc().formatter()+" "+sale.currency_code}</li>
                                                    <li>${sale.deposito_montantetroco.dc().formatter()+" STN"}</li>
                                                    <li>${new Date(sale.conta_dataregistro).getDatePt()+", "+new Date(sale.conta_dataregistro).getTime2H()}</li>
                                                    <li class="flex v-ct j-stp reimprimir" title="Reimprimir" style="cursor: pointer;">
                                                        <span class="flex v-ct">
                                                            <i class="material-icons">print</i>
                                                            <span>Reimprimir</span>
                                                        </span>
                                                    </li>
                                                  </ul>`);
                    });
                }
                xTableGenerate();
            }
        });
    }
};

$('[data-inputmask-alias]').inputmask();

$("[sales]").on("click", function () {
    if(account.hasValidPost()){
        account.resetModalAuthentication();
        account.operation = "showSales";
        $(".fkinputs .table").css("display", "none");
        account.loadUsers(["maguita.pos.vendas"]);
    }
});

$("[report]").on("click", function () {
    if(account.hasValidPost()){
        account.resetModalAuthentication();
        account.operation = "showReports";
        $(".fkinputs .table").css("display", "none");
        account.loadUsers(["maguita.pos.report"]);
    }
});

$("#pos_menus").on("click", "li", function (){
    $("#fkPGReport").removeClass("show")
})

$("#filtro_data_vendas").on("click", "li", function () {
    $(this).addClass('active').siblings().removeClass('active');
    $("#filtro_data_vendas_atual").text($(this).text());
    sales.load( getDateParameter($(this).attr("date")) );
});
$("#vendasPosto").on("click", ".reimprimir", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(spaceConfig.hasPrinter({operation: sales.CODE_OPERATION_FATURA_RECIBO_SECOND})){
                spaceConfig.data_fatura = $(this).parents("ul").data().data_fatura;
                spaceConfig.account_id = $(this).parents("ul").attr("conta_id");
                spaceConfig.operationCode = sales.CODE_OPERATION_FATURA_RECIBO_SECOND;
                spaceConfig.getPrinter({operation: sales.CODE_OPERATION_FATURA_RECIBO_SECOND});
            }
        }
    });
});

$("#printReportVenda").on("click", function (){
    spaceConfig.report_venda.print();
})
