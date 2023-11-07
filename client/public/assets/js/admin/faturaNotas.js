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
        console.log({errorCodeImposto, montanteQuantidade})
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
                venda_custoquantidade: +$(this).find("[custoquantidade]").text(),
                venda_custounitario: $(this).find("li").eq(5).attr("price"),
                venda_lote: null,
                venda_validade: null,
                venda_editado: false,
                venda_codigoimposto: venda_codigoimposto || $(this).attr("codigoimposto"),
                venda_isencao: false,
                venda_montante: montanteQuantidade || undefined,
                venda_montanteagregado: 0,
                venda_montantetotal: montanteQuantidade || undefined,
                venda_imposto: result?.total_taxa || undefined,
                venda_montantesemimposto: result?.subtotal || undefined,
                venda_montantecomimposto: result?.total || undefined,
                venda_impostoadicionar: result?.valor_imposto_adicionar || undefined,
                venda_impostoretirar: result?.valor_imposto_retirar || undefined,
                arg_itens: [],
                venda_taxas: taxasArtigos.getImpostos($(this).attr("article_id"))
            });
        });

        console.log({articles_table, errorCodeImposto})
        return {articles_table, errorCodeImposto};
    },
    register_invoice: function (){
        let modal = window.xModalGeral || ""

        let observacao_fatura = $("#observacao_fatura");
        let conta_posto_id = $("#colaborador_logado_armazens").find("li.active").attr("posto_admin");
        console.log({conta_posto_id});
        let {conta_id, conta_chave} = faturaAdmin?.fatura || {};

        let {articles_table, errorCodeImposto} = this.articles_added();

        console.log({articles_table, errorCodeImposto});

        if(errorCodeImposto){
            xAlert("Nota de credito", "Define o código de imposto!", "error");
            return;
        }

        let datas = {
            conta_id: conta_id,
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

                    xAlert("Fatura", "Fatura emitida com sucesso!");
                    articlesDocuments.customer_id = null;
                    observacao_fatura.val("");
                    if(FATURA === serieOperation.tipo.notaCredito){
                        open("/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id, date: new Date().getTimeStampPt(), admin: true}));
                        return
                    }
                    open("/api/print/nota-credito/"+JSON.stringify({type: "pdf", conta_id, date: new Date().getTimeStampPt(), admin: true }));
                }
                else xAlert("Fatura", message, "error");
            }
        });
    },
    loadData : () => {
        let modal = window.xModalGeral || ""
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

                let { conta_titular, conta_vendas, conta_data, conta_cliente_id} = fatura;
                faturaAdmin.fatura = fatura;

                $(`${modal} [tableDocumentArticles]`).empty();
                if(!conta_vendas){
                    $(` ${modal} [tableDocumentArticles] `).addClass("empty");
                    $(` ${modal} [documento_origem_data]`).prop("disabled", false);
                    xAlert("Nota de credito", "Não foi encontrado numa fatura com esse número!", "error");
                    return
                }

                $(` ${modal} [documento_origem_data] `).val((conta_data || "").stringToDateEn().getDatePt()).prop("disabled", true);
                $(` ${modal} [search_customer]`).val(conta_titular).keyup();
                setTimeout(() => {
                    articlesDocuments.customer_id = conta_cliente_id
                }, 10)

                let { imposto } = $(`${modal} [listfatura] li.active`).data() || {};
                conta_vendas.forEach(({ artigo_nome, venda_custounitario, venda_montantecomimposto, artigo_codigo, venda_quantidade, taxa_percentagem, taxa_taxa, venda_id, artigo_codigoimposto}) => {
                    $(`${modal} [tableDocumentArticles]`).append(`
                    <ul data-venda_id="${venda_id}" data-venda_codigo="${artigo_codigoimposto?.[imposto]}">
                        <li>${artigo_codigo}</li>
                        <li>${artigo_nome}</li>
                        <li custoquantidade contenteditable="true">${Math.abs(venda_quantidade)}</li>
                        <li>${(!taxa_percentagem) ? taxa_taxa || "" : `${taxa_percentagem}%` }</li>
                        <li placeholder="add código" contenteditable="true">${artigo_codigoimposto?.[imposto] || ""}</li>
                        <li>${venda_custounitario.dc().formatter()+" STN"}</li>
                        <li>${Math.abs(venda_montantecomimposto).dc().formatter()+" STN"}</li>
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
    let modal = window.xModalGeral || ""
    spaceConfig.loadConfig().then(value => {
        if(spaceConfig.isConfigured({object: value.config[0]})){
            if(serieOperation.missing.includes(FATURA)){
                xAlert("Série de fatura", "Nenhuma série de fatura encontrada para este armazém. Defina-a em definições!","error");
                return;
            }
            if($("#colaborador_logado_armazens").find("li.active").attr("posto_admin") === "null"){
                xAlert("Fatura", "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
                return;
            }
            if(articlesDocuments.customer_id === null){
                xAlert("Fatura ", "Pesquise um cliente!", "info");
                $(`${modal} [search_customer]`).focus();
                return;
            }
            if($(`${modal} [tableDocumentArticles]`).find(`ul`).length === 0){
                xAlert("Fatura", "Adicione artigos na tabela!", "info");
                return;
            }

            let listfatura = $(`${modal} [listfatura]`);
            if(!!listfatura.length && !listfatura.find("li.active").length){
                xAlert("", "Por favor, selecione uma serie de fatura!", "error");
                return
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
});

$("[documento_origem]").on("keyup", function ({keyCode}){
    let { loadData } = faturaAdmin;
    if(keyCode === 13 && $(this).val()){
        loadData();
        return
    }

    if(keyCode === 13 && !$(this).val()) {
        xAlert("Nota de credito", "Priencha o campo fatura!", "error");
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
