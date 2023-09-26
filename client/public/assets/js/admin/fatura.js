var faturaAdmin = {
    proformas: [],
    conta_id: null,
    key: null,
    init(){
        serieOperation.loadSerieOperation([serieOperation.tipo.fatura]);
    },
    loadAccountKey(){
        return new Promise((resolve, reject) =>{
            $.ajax({
                url: "/api/account/key",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({admin: true}),
                success(data) {
                    resolve(data);
                },
                error(error){
                    reject(error);
                }
            });
        });
    },
    loadArticlesAccount(){
        $.ajax({
            url: "/api/pos/account/data",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_conta_id: faturaAdmin.conta_id, admin: true}),
            success(e) {
                $("#xModalListProformas .hideTarget").click();
                e.accountData[0].main.conta_vendas.forEach((art)=>{
                    let total_value = Number(art.venda_quantidade) * Number(art.venda_custounitario);

                    taxasArtigos.loadArticleTax({article_id: [art.artigo_id]}).then(value => {
                        taxasArtigos.addTax(value.tax[0].main, art.artigo_id);
                    });

                    $("[tableDocumentArticles]").append(`<ul article_id="${art.artigo_id}" custoquantidade="${art.venda_custoquantidade}">
                                            <li>${art.artigo_codigo}</li>
                                            <li>${art.artigo_nome}</li>
                                            <li>${art.venda_quantidade}</li>
                                            <li>${art.venda_lote || ""}</li>
                                            <li>${(art.venda_validade === null ? "" : alterFormatDate(art.venda_validade))}</li>
                                            <li>${art.taxa_percentagem || art.taxa_taxa || ""} ${(!art.taxa_taxa && !art.taxa_percentagem) ? "" : (art.taxa_taxa) ? "STN" : "%"}</li>
                                            <li price="${art.venda_custounitario}">${art.venda_custounitario.formatter()+" STN"}</li>
                                            <li>${total_value+" STN"}</li>
                                            <li class="flex v-ct">
<!--                                               <span class="noLabel"></span>-->
                                                    <span class="flex v-ct">            
                                                         <a tooltip="Eliminar" flow="top" title="Remover">
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
                                                 </span>
                                            </li>
                                        </ul>`);
                });
                xTableGenerate();
            }
        });
    },
    loadProformas(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/proformas/load",
            method: "POST",
            contentType: "application/json",
            error(){$("body").removeClass("loading")},
            success(e) {
                $("#listProformAccounts").empty();
                $("body").removeClass("loading");
                faturaAdmin.proformas = [];
                faturaAdmin.proformas = e.proformas;
                let data_emissao;
                if(faturaAdmin.proformas.length === 0){
                    $("#listProformAccounts").addClass("empty");
                    xAlert("Fatura", "Nenhuma proforma encontrada!", "info");
                }
                else{
                    $("#listProformAccounts").removeClass("empty");
                    faturaAdmin.proformas.forEach((prof, idx) =>{
                        prof = prof.data;
                        if(prof?.conta_proformaextras?.data_emissao){
                            data_emissao = alterFormatDate(prof.conta_proformaextras.data_emissao);
                        }
                        else{
                            data_emissao = new Date(prof.conta_dataregistro).getDatePt()+","+new Date(prof.conta_dataregistro).getTime2H();
                        }
                        $("#listProformAccounts").append(`<ul class="flex" conta_id="${prof.conta_id}" cliente_id="${prof.cliente_id}">
                                                    <li>${prof.conta_numero}</li>
                                                    <li>${prof.colaborador_nome}</li>
                                                    <li>${(prof.cliente_titular || "N/D")}</li>
                                                    <li>${"STN "+prof.conta_montante.formatter()}</li>
                                                    <li class="vencimento" date="${(prof.conta_proformavencimento || "")}">${(prof.conta_proformavencimento === null ? "N/D" : alterFormatDate(prof.conta_proformavencimento))}</li>
                                                    <li>${data_emissao}</li>
                                                    <li class="flex v-ct j-stp">
<!--                                                       <span class="noLabel"></span>-->
                                                            <span class="flex v-ct">
                                                                <a class="editar" title="Editar" i="${idx}">
                                                                    <svg viewBox="0 0 512 512"><path d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0"/><path d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0"/></svg>
                                                                </a>
                                                                 <a tooltip="Eliminar" flow="top" title="Remover">
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
                                                           <svg class="svg-icon imprimir" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                   width="475.078px" height="475.077px" viewBox="0 0 475.078 475.077" style="enable-background:new 0 0 475.078 475.077;"
                                                                   xml:space="preserve">
                                                                <g>
                                                                  <path d="M458.959,217.124c-10.759-10.758-23.654-16.134-38.69-16.134h-18.268v-73.089c0-7.611-1.91-15.99-5.719-25.122
                                                                    c-3.806-9.136-8.371-16.368-13.699-21.698L339.18,37.683c-5.328-5.325-12.56-9.895-21.692-13.704
                                                                    c-9.138-3.805-17.508-5.708-25.126-5.708H100.5c-7.614,0-14.087,2.663-19.417,7.993c-5.327,5.327-7.994,11.799-7.994,19.414V200.99
                                                                    H54.818c-15.037,0-27.932,5.379-38.688,16.134C5.376,227.876,0,240.772,0,255.81v118.773c0,2.478,0.905,4.609,2.712,6.426
                                                                    c1.809,1.804,3.951,2.707,6.423,2.707h63.954v45.68c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.803,7.994,19.417,7.994
                                                                    h274.083c7.611,0,14.093-2.669,19.418-7.994c5.328-5.332,7.994-11.8,7.994-19.417v-45.68h63.953c2.471,0,4.613-0.903,6.42-2.707
                                                                    c1.807-1.816,2.71-3.948,2.71-6.426V255.81C475.082,240.772,469.708,227.876,458.959,217.124z M365.449,420.262H109.636v-73.087
                                                                    h255.813V420.262z M365.449,237.537H109.636V54.816h182.726v45.679c0,7.614,2.669,14.083,7.991,19.414
                                                                    c5.328,5.33,11.799,7.993,19.417,7.993h45.679V237.537z M433.116,268.656c-3.614,3.614-7.898,5.428-12.847,5.428
                                                                    c-4.949,0-9.233-1.813-12.848-5.428c-3.613-3.61-5.42-7.898-5.42-12.847s1.807-9.232,5.42-12.847
                                                                    c3.614-3.617,7.898-5.426,12.848-5.426c4.948,0,9.232,1.809,12.847,5.426c3.613,3.614,5.427,7.898,5.427,12.847
                                                                    S436.733,265.046,433.116,268.656z"/>
                                                                </g>
                                                            </svg>                        
                                                         </span>
                                                    </li>
                                                  </ul>`);
                    });
                    showTarget("xModalListProformas");
                }
                xTableGenerate();
            }
        });
    },
    articles_added(){
        let articles_table = [];
        let montanteQuantidade = 0;
        let semImposto = $("[isencaoImposto]").hasClass("active");
        $("[tableDocumentArticles]").find("ul").each(function () {
            montanteQuantidade = Number($(this).find("li").eq(2).text()) * $(this).find("li").eq(6).attr("price").unFormatter();
            let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: $(this).attr("article_id")});
            articles_table.push({
                venda_artigo_id: $(this).attr("article_id"),
                venda_descricao: $(this).find("li").eq(1).text(),
                venda_quantidade: $(this).find("li").eq(2).text(),
                venda_custoquantidade : $(this).attr("custoquantidade"),
                venda_custounitario: $(this).find("li").eq(6).attr("price"),
                venda_lote: ($(this).find("li").eq(3).text() || null),
                venda_validade: ($(this).find("li").eq(4).text() === "" ? null : alterFormatDate($(this).find("li").eq(4).text())),
                venda_editado: false,
                venda_isencao: semImposto,
                venda_montante: montanteQuantidade,
                venda_montanteagregado: 0,
                venda_montantetotal: montanteQuantidade,
                venda_imposto: (semImposto ? 0 : result.total_taxa),
                venda_montantesemimposto: result.subtotal,
                venda_montantecomimposto: (semImposto ? result.subtotal : result.total),
                venda_impostoadicionar: result.valor_imposto_adicionar,
                venda_impostoretirar: result.valor_imposto_retirar,
                arg_itens: [],
                venda_taxas: taxasArtigos.getImpostos($(this).attr("article_id"))
            });
        });

        console.log({articles_table})
        return articles_table;
    },
    add_account: function (){
        let conta = {};
        conta.conta_mesa = {numero: null, descricao: null, lotacao: null};
        conta.conta_extension = {};
        conta.arg_vendas = this.articles_added();
        conta.admin = true;
        conta.conta_chave = faturaAdmin.key;

        $.ajax({
            url: "/api/pos/conta",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(conta),
            error() {$("#finalizar_fatura").prop("disabled", false).removeClass("loading")},
            success(e) {
                if(e.result) faturaAdmin.register_invoice({conta_id: e.data.data.conta_id})
                else{
                    xAlert("Fatura", e.data.message, "error");
                    $("#finalizar_fatura").prop("disabled", false).removeClass("loading");
                }
            }
        });
    },
    register_invoice({conta_id}){
        let FATURA = 1;
        let dados = {};
        dados.conta_id = conta_id;
        dados.conta_extension = {};
        dados.conta_mesa =  { numero: null, descricao:null, lotacao:null };
        dados.conta_desconto = null;
        dados.conta_titular =   $("[cliente_titular]").val().trim();
        dados.conta_titularnif = $("[cliente_nif]").val().trim() || null;
        dados.conta_data = $("#fatura_data_emissao").val() === "" ? null : alterFormatDate($("#fatura_data_emissao").val());
        dados.conta_cliente_id = articlesDocuments.customer_id;
        dados.coin = null;
        dados.documento_referencia = null;
        dados.admin = true;
        dados.guia_documentoperacao = null;
        dados.guia_observacao = null;
        dados.guia_dataopeacao = null;
        dados.guia_metadata = {};
        dados.custos = [];

        let observacao_fatura = $("#observacao_fatura");

        $.ajax({
            url: "/api/pos/pay",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({...dados, arg_tserie_id: FATURA }),
            error() {$("#finalizar_fatura").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("#finalizar_fatura").prop("disabled", false).removeClass("loading");
                if(e.result){
                    $("[isencaoImposto]").removeClass("active");
                    $("#faturaAdmin").find("input").val("");
                    $("[tableDocumentArticles]").empty();
                    $("[tableDocumentArticles]").addClass("empty");
                    xAlert("Fatura", "Fatura emitida com sucesso!");
                    articlesDocuments.customer_id = null;
                    open("/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id: dados.conta_id, date: new Date().getTimeStampPt(), admin: true, observacao_fatura: observacao_fatura.val()}));
                    if($("[imprimirGuiaSaida]").hasClass("active")){
                        open("/api/print/guia_saida/"+JSON.stringify({date: new Date().getTimeStampPt(), guia_uuid: e.data, conta_id: dados.conta_id }));
                    }
                    $("[imprimirGuiaSaida]").removeClass("active");
                    observacao_fatura.val("");
                }
                else xAlert("Fatura", e.data, "error");
            }
        });
    },
    anular_proforma(proforma_finalizada = false){
        $("#confirmarAnularProforma").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/pos/conta/anular",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_conta_id: faturaAdmin.conta_id, arg_conta_observacao: null, place: "admin"}),
            error() {$("#confirmarAnularProforma").prop("disabled", false).removeClass("loading")},
            success(e) {
                $("#confirmarAnularProforma").prop("disabled", false).removeClass("loading");
                if(e.result){
                    if(!proforma_finalizada){
                        faturaAdmin.loadProformas();
                        $("#xModalAnularProforma").find(".hideTarget").click();
                        xAlert("Anular proforma", "Proforma anulada com sucesso!");
                    }
                }
                else xAlert("Anular proforma", e.data, "error");
            }
        });
    }
};
faturaAdmin.init();

$("#ver_proformas").on("click", function () {
    faturaAdmin.loadProformas();
});
$("#finalizar_fatura").on("click", function () {
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(serieOperation.missing.length > 0){
                xAlert("Série de fatura", "Nenhuma série de fatura encontrada para este armazém. Defina-a em definições!","error");
                return;
            }
            if($("#colaborador_logado_armazens").find("li.active").attr("posto_admin") === "null"){
                xAlert("Fatura", "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
                return;
            }
            if(articlesDocuments.customer_id === null){
                xAlert("Fatura ", "Pesquise um cliente!", "info");
                $("[search_customer]").focus();
                return;
            }
            if($("[tableDocumentArticles]").find(`ul`).length === 0){
                xAlert("Fatura", "Adicione artigos na tabela!", "info");
                return;
            }
            $("#finalizar_fatura").attr("disabled", true).addClass("loading");
            faturaAdmin.loadAccountKey().then(value =>{
                faturaAdmin.key = value.accountKey;
                faturaAdmin.add_account();
            }).catch(err =>{
                $("#finalizar_fatura").attr("disabled", false).removeClass("loading");
            });
        }
    });
});
$("#listProformAccounts").on("click", ".editar", function () {
    $("[search_customer]").val($(this).parents("ul").find("li").eq(2).text()).keyup();
    $("[tableDocumentArticles]").empty().removeClass("empty");
    faturaAdmin.conta_id = $(this).parents("ul").attr("conta_id");
    faturaAdmin.loadArticlesAccount();
}).on("click", ".delete", function () {
    faturaAdmin.conta_id = $(this).parents("ul").attr("conta_id");
    showTarget("xModalAnularProforma", "Anular proforma");
}).on("click", ".imprimir", function () {
    open("/api/print/proforma/" + JSON.stringify({
        type: "pdf", conta_id: $(this).parents("ul").attr("conta_id"),
        date: new Date().getTimeStampPt()
    }));
});
$("#confirmarAnularProforma").on("click", function () {
    faturaAdmin.anular_proforma();
});
$("#pesquisar_proformas").on("keyup", function () {
    advSearch($(this).val(), $("#listProformAccounts"), $("#listProformAccounts").find("ul"));
});
