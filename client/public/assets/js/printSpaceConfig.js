var spaceConfig = {
    data: [],
    operationCode: null,
    typePrinter: null,
    account_id: null,
    deposito: null,
    dados_caixa: null,
    loadConfig(){
        return new Promise((resolve, reject) =>{
            $.ajax({
                url: "/api/space/config/load",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({admin: location.href.includes("admin") }),
                success(data) {
                    resolve(data);
                },
                error(error){
                    reject(error);
                }
            });
        });
    },
    "fatura_proforma":{
        print() {
            setTimeout(function () {
                $("#getBackPos").click();
            }, 1000);
             open("/api/print/proforma/"+JSON.stringify({type: spaceConfig.typePrinter, conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt() }));
        }
    },
    "fatura_recibo":{
        print(){
            if(spaceConfig.typePrinter === "pdf")
                 open("/api/print/fatura/recibo/"+JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt() }));
            else{
                $("body").addClass("loading");
                $.ajax({
                    url: "/api/print/fatura/recibo/talao",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt()}),
                    complete(){$("body").removeClass("loading");},
                    success(e) {}
                });
            }
        }
    },
    "fatura_recibo_2_via":{
        print(){
            if(spaceConfig.typePrinter === "pdf")
                 open("/api/print/fatura/recibo/"+JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt() }));
            else{
                $("body").addClass("loading");
                $.ajax({
                    url: "/api/print/fatura/recibo/talao",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt()}),
                    complete(){$("body").removeClass("loading");},
                    success(e) {}
                });
            }
        }
    },
    "fatura":{
        print(){
            if(spaceConfig.typePrinter === "pdf")
                 open("/api/print/fatura/"+JSON.stringify({type: spaceConfig.typePrinter, conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt(), admin: location.href.includes("admin") }));
            else{
                $("body").addClass("loading");
                $.ajax({
                    url: "/api/print/fatura/talao",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt()}),
                    complete(){$("body").removeClass("loading");},
                    success(e) {}
                });
            }
        }
    },
    "conta":{
        print(){
            if(spaceConfig.typePrinter === "pdf")
                  open("/api/print/conta/"+JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt(), admin: location.href.includes("admin") }));
            else{
                $("body").addClass("loading");
                $.ajax({
                    url: "/api/print/conta/talao",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({conta_id: spaceConfig.account_id, date: new Date().getTimeStampPt()}),
                    complete(){$("body").removeClass("loading");},
                    success(e) {}
                });
            }
        }
    },
    "caixa":{
        print(){
            $("body").addClass("loading");
            $.ajax({
                url: "/api/print/fecho/caixa",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({box_data: spaceConfig.dados_caixa}),
                complete(){$("body").removeClass("loading");},
                success(e) {}
            });
        }
    },
    "recibo":{
        print(){
            open("/api/print/recibo/"+JSON.stringify({deposito: spaceConfig.deposito, client: contacorrente.clienteSelecionado,
               date: new Date().getTimeStampPt(), admin: location.href.includes("admin")}));
        }
    },
    isConfigured({object}){
          if(object.funct_load_espaco_configuracao?.espaco?.espaco_configuracao) {
              spaceConfig.data = object;
              return true;
          }
          else{
              xAlert("Impressão", "Não foram configurados dados da instituição.","error");
              return false;
          }
    },
    hasPrinter({operation}){
        let printers = spaceConfig.data.funct_load_espaco_configuracao.espaco.espaco_configuracao?.configuracao_impressoras.filter(pri => pri.operacao.codigo === operation);
        if(printers.length === 0){
            xAlert("Impressão", "Nenhuma configuração de impressão encontrada para esta operação.","error");
            return false;
        }
        else return true;
    },
    getPrinter({operation}){
        let printers = spaceConfig.data.funct_load_espaco_configuracao.espaco.espaco_configuracao?.configuracao_impressoras.filter(pri => pri.operacao.codigo === operation);
        if(printers[0].tipos_impressao.pdf !== null && printers[0].tipos_impressao.talao !== null){
            showTarget((location.pathname.includes("pos") ? "xModalPrintModel" : "xModalPrintAdminModel"));
        }
        else{
            spaceConfig.typePrinter = printers[0].tipos_impressao.pdf === null ? "talao" : "pdf";
            spaceConfig[spaceConfig.operationCode].print();
        }
    }
};
$("[printDocument]").on("click", function () {
    spaceConfig.typePrinter = $("#xModalPrintModel").find(".waves-effect.account.active").attr("type");
    $("#xModalPrintModel .hideTarget").click();
    spaceConfig[spaceConfig.operationCode].print();
});