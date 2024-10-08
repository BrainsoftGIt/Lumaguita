var FATURA = 1;
var faturaAdmin = {
    proformas: [],
    conta_id: null,
    key: null,
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
    articles_added: function (){
        let modal = window.xModalGeral || ""
        let articles_table = [];
        let montanteQuantidade = 0;
        let errorCodeImposto = false;
        let result = null;

        $(`${modal} [tableDocumentArticles]`).find("ul").each(function () {
            let price = $(this).find("li").eq(5).attr("price");
            if(!!price) {
                montanteQuantidade = Number($(this).find(" li ").eq(2).text()) * price;
                result = taxasArtigos.calculateValues({
                    montanteQuantidade: montanteQuantidade,
                    artigo_id: $(this).attr("article_id")
                });
            }

            let { venda_id, venda_codigo: venda_codigoimposto} = $(this).data() || {};

            if(!venda_codigoimposto && !$(this).attr("codigoimposto")){
                errorCodeImposto = true;
            }

            articles_table.push({
                venda_id,
                venda_artigo_id: $(this).attr("article_id"),
                venda_descricao: $(this).find("li").eq(1).text(),
                venda_quantidade: $(this).find("li").eq(2).text(),
                venda_custoquantidade: 1,
                venda_custounitario: $(this).find("li").eq(5).attr("price"),
                venda_lote: null,
                venda_validade: null,
                venda_editado: false,
                venda_codigoimposto: venda_codigoimposto ?? $(this).attr("codigoimposto"),
                venda_isencao: false,
                venda_montante: montanteQuantidade ?? undefined,
                venda_montanteagregado: 0,
                venda_montantetotal: montanteQuantidade ?? undefined,
                venda_imposto: result?.total_taxa ?? undefined,
                venda_montantesemimposto: result?.subtotal ?? undefined,
                venda_montantecomimposto: result?.total ?? undefined,
                venda_impostoadicionar: result?.valor_imposto_adicionar ?? undefined,
                venda_impostoretirar: result?.valor_imposto_retirar ?? undefined,
                arg_itens: [],
                venda_taxas: taxasArtigos.getImpostos($(this).attr("article_id"))
            });
        });

        return {articles_table, errorCodeImposto};
    },
    register_invoice: function (){
        let docType = (FATURA === serieOperation.tipo.notaCredito ? "Nota de crédito" : "Nota de debito");
        let modal = window.xModalGeral || ""

        let observacao_fatura = $("#observacao_fatura");
        let conta_posto_id = $("#colaborador_logado_armazens").find("li.active").attr("posto_admin");

        let {conta_id} = faturaAdmin?.fatura || {};

        let {articles_table, errorCodeImposto} = this.articles_added();

        if(errorCodeImposto){
            xAlert(docType, "Define o código de imposto!", "error");
            return;
        }

        let datas = {
            conta_id,
            conta_posto_id,
            conta_extension: {},
            conta_mesa: {numero: null, descricao: null, lotacao: null},
            conta_desconto: null,
            conta_cliente_id: articlesDocuments.customer_id,
            conta_chave: faturaAdmin.key,
            conta_data: $(`${modal} #fatura_data_emissao `).val() === "" ? new Date().getDateEn() : alterFormatDate($(`${modal} #fatura_data_emissao`).val()),
            conta_titular: $(`${modal} [cliente_titular]`).val().trim(),
            conta_titularnif: $(`${modal} [cliente_nif]`).val().trim() || null,
            conta_observacao: observacao_fatura.val() || "",
            conta_docorigin: ($(`${modal} [documento_origem]`).val() || "").trim() || null,
            conta_datedocorigin: (($(`${modal} [documento_origem_data]`).val() || "").trim().stringToDate() || "").getDateEn() || null,
            _serie_id: ($(`${modal} [listFatura] li.active`).data() || {}).id || null,
            _tserie_id: FATURA,
            itens: articles_table,
            coin: null,
            documento_referencia: null,
            guia_documentoperacao: null,
            guia_observacao: null,
            guia_dataopeacao: null,
            guia_metadata: {},
            custos: [],
            conta_props: {
                terms: observacao_fatura.val() || ""
            }
        };

        $(" #finalizar_fatura ").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/reg/credito/nota",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(datas),
            error() {$("#finalizar_fatura").prop("disabled", false).removeClass("loading")},
            success: ({data, result, message}) => {
                $("#finalizar_fatura").prop("disabled", false).removeClass("loading");
                if(result){
                    let {conta: {conta_id}} = data || {conta: {}};
                    $(`${modal} #faturaAdmin`).find("input").val("");
                    $(`${modal} [tableDocumentArticles]`).empty().addClass("empty");

                    let listfatura = $(`${modal} [listfatura]`);
                    if (!!listfatura.length && listfatura.find("li").length === 1) {
                        listfatura.find("li").mousedown();
                    }

                    xAlert(docType, "Fatura emitida com sucesso!");
                    articlesDocuments.customer_id = null;
                    observacao_fatura.val("");
                    if(FATURA === serieOperation.tipo.notaDebito){
                        Documents.open({
                            data: ("/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id, date: new Date().getTimeStampPt(), admin: true})),
                            name: "Nota de Debito"
                        });
                        return
                    }

                    Documents.open({
                        data: "/api/print/nota-credito/"+JSON.stringify({type: "pdf", conta_id, date: new Date().getTimeStampPt(), admin: true }),
                        name: "Nota de Credito"
                    });
                }
                else xAlert(docType, message, "error");
            }
        });
    },
    loadData : () => {
        let modal = window.xModalGeral || "";
        $("body").addClass("loading")
        $.ajax({
            url: "/api/load/doc/to/nota",
            method: "POST",
            contentType: "application/json",
            error() { },
            complete() { },
            data: JSON.stringify({
                conta_fatura: $(`${modal} [documento_origem]`).val(),
                _tserie_id:  FATURA
            }),
            success: ({fatura}) => {
                let docType = (FATURA === serieOperation.tipo.notaCredito ? "Nota de crédito" : "Nota de debito");
                let { conta_titular, conta_vendas, conta_data, conta_cliente_id} = fatura;
                faturaAdmin.fatura = fatura;
                $("body").removeClass("loading")

                $(`${modal} [tableDocumentArticles]`).empty();
                if(!conta_vendas){
                    $(` ${modal} [tableDocumentArticles] `).addClass("empty");
                    $(` ${modal} [documento_origem_data]`).prop("disabled", false);
                    $(`[price_article], [codigo_imposto_article], [amount_article], [description_article], [search_article], [addarticletable]`).val( "").prop("disabled", false);
                    xAlert(docType, "Não foi encontrado numa fatura com esse número!", "error");
                    return
                }

                if(!conta_vendas.length){
                    $(` ${modal} [tableDocumentArticles] `).addClass("empty");
                    $(` ${modal} [documento_origem_data]`).prop("disabled", false);
                    $(`[price_article], [codigo_imposto_article], [amount_article], [description_article], [search_article], [addarticletable]`).val( "").prop("disabled", false);
                    xAlert(docType, `Não há mais itens disponíveis para efetuar a ${docType}`, "error");
                    return
                }

                $(` ${modal} [documento_origem_data] `).val((conta_data || "").stringToDateEn().getDatePt()).prop("disabled", true);
                $(`[price_article], [codigo_imposto_article], [amount_article], [description_article], [search_article], [addarticletable]`).val( "").prop("disabled", true);
                $(` ${modal} [search_customer]`).val(conta_titular).keyup();
                setTimeout(() => {
                    articlesDocuments.customer_id = conta_cliente_id
                }, 10)

                let { imposto } = $(`${modal} [listfatura] li.active`).data() || {};
                conta_vendas.forEach(({ venda_quantidade, artigo_nome, venda_custounitario, venda_montantecomimposto, artigo_codigo, venda_quantidaderemanescente, taxa_percentagem, taxa_taxa, venda_id, artigo_codigoimposto}) => {
                    let new_venda_montantecomimposto = (venda_montantecomimposto / venda_quantidade) * venda_quantidaderemanescente;
                    console.log({new_venda_montantecomimposto, venda_montantecomimposto, venda_quantidade, venda_quantidaderemanescente})

                    $(`${modal} [tableDocumentArticles]`).append(`
                    <ul data-venda_id="${venda_id}" data-venda_codigo="${artigo_codigoimposto?.[imposto]}">
                        <li>${artigo_codigo}</li>
                        <li>${artigo_nome}</li>
                        <li venda_quantidade="${venda_quantidade}" venda_quantidaderemanescente="${venda_quantidaderemanescente}" contenteditable="true">${Math.abs(venda_quantidaderemanescente)}</li>
                        <li>${(!taxa_percentagem) ? taxa_taxa ?? "" : `${taxa_percentagem}%` }</li>
                        <li placeholder="add código" contenteditable="true">${artigo_codigoimposto?.[imposto] || ""}</li>
                        <li>${venda_custounitario.dc().formatter()+" STN"}</li>
                        <li venda_montantecomimposto="${venda_montantecomimposto}">${Math.abs(new_venda_montantecomimposto).dc().formatter()+" STN"}</li>
                        <li class="flex v-ct">
                                <span del class="flex v-ct">
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
                    </ul>`).find("[placeholder]").last().blur();
                })
                xTableGenerate()

                $(` ${modal} [tableDocumentArticles]` ).removeClass("empty")
            }
        });
    },
};

$("#finalizar_fatura").on("click", function () {
    xModalConfirm.funcs = () => {
        $("#xModalConfirm").removeClass("show");
        let docType = (FATURA === serieOperation.tipo.notaCredito ? "Nota de crédito" : "Nota de debito");
        let modal = window.xModalGeral || ""
        spaceConfig.loadConfig().then(value => {
            if(spaceConfig.isConfigured({object: value.config[0]})){
                if(serieOperation.missing.includes(FATURA)){
                    xAlert(docType, "Nenhuma série de fatura encontrada para este armazém. Defina-a em definições!","error");
                    return;
                }
                if($("#colaborador_logado_armazens").find("li.active").attr("posto_admin") === "null"){
                    xAlert(docType, "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
                    return;
                }
                if(articlesDocuments.customer_id === null){
                    xAlert(docType, "Pesquise um cliente!", "info");
                    $(`${modal} [search_customer]`).focus();
                    return;
                }
                if($(`${modal} [tableDocumentArticles]`).find(`ul`).length === 0){
                    xAlert(docType, "Adicione artigos na tabela!", "info");
                    return;
                }

                let listfatura = $(`${modal} [listfatura]`);
                if(!!listfatura.length && !listfatura.find("li.active").length){
                    xAlert(docType, "Por favor, selecione uma serie de fatura!", "error");
                    return
                }

                let observacao_fatura = $("#observacao_fatura")
                if(!observacao_fatura.val()){
                    xAlert(docType, "Por favor, adicione uma observação!", "error");
                    observacao_fatura.focus()
                    return;
                }

                faturaAdmin.loadAccountKey().then(value =>{
                    faturaAdmin.key = value.accountKey;
                    faturaAdmin.register_invoice();
                }).catch(err =>{
                    console.error(err)
                    $("#finalizar_fatura").attr("disabled", false).removeClass("loading");
                });
            }
        });
    }
});

$("[documento_origem]").on("keyup", function ({keyCode}){
    let docType = (FATURA === serieOperation.tipo.notaCredito ? "Nota de crédito" : "Nota de debito");
    let { loadData } = faturaAdmin;
    if(keyCode === 13 && $(this).val()){
        loadData();
        return
    }

    if(keyCode === 13 && !$(this).val()) {
        xAlert(docType, "Priencha o campo fatura!", "error");
        $(`[price_article], [codigo_imposto_article], [amount_article], [description_article], [search_article], [addarticletable], [documento_origem_data]`).val( "").prop("disabled", false);
    }
})

// Add event listeners for focus and blur
$(`[tableDocumentArticles]`).on('focus', "[placeholder]", function (e) {
    let placeholder = $(this).attr("placeholder");
    if ($(this).text() === placeholder) {
        $(this).text("");
        $(this).removeClass("placeholder");
    }
    e.stopPropagation()
}).on('blur', "[placeholder]", function (e) {
    let placeholder = $(this).attr("placeholder");
    if ($(this).text() === "") {
        $(this).text(placeholder);
        $(this).addClass("placeholder");
    }
    e.stopPropagation()
}).on("keyup", '[placeholder][contenteditable="true"]',function (){
    $(this).parents("ul").data("venda_codigo", $(this).text() || null);
}).on("keyup", '[venda_quantidade]',function (){
    if((!!$(this).text() && +$(this).attr("venda_quantidaderemanescente") < +$(this).text()) || (+$(this).text() <= 0 && !!$(this).text())){
        let docType = (FATURA === serieOperation.tipo.notaCredito ? "Nota de crédito" : "Nota de debito");
        xAlert(docType, "Quantidade inválida!", "error");
        $(this).text($(this).attr("venda_quantidaderemanescente"))
    }

    let quantidade = $(this).text();
    let venda_quantidade = $(this).attr("venda_quantidade");
    let venda_montantecomimposto = $(this).closest("ul").find("[venda_montantecomimposto]").attr("venda_montantecomimposto");
    let newVenda_montantecomimposto = (venda_montantecomimposto/venda_quantidade) * quantidade;
    $(this).closest("ul").find("[venda_montantecomimposto]").text(`${newVenda_montantecomimposto.formatter()} STN`)

}).on("keypress", '[placeholder][contenteditable="true"]', function (e) {
    if (e.which === 46) {
        e.which = 44;
    }
    if ((e.which !== 44 || $(this).val().indexOf('/') !== -1) &&
        ((e.which < 48 || e.which > 57) &&
            (e.which !== 0 && e.which !== 8))) {
        e.preventDefault();
    }
});

articlesDocuments.loadSerieDistribuicao(serieOperation.tipo.fatura)
