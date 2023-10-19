var notacredito = {
    loadData : () => {
        $.ajax({
            url: "/api/load/fatura/to/credito/nota",
            method: "POST",
            contentType: "application/json",
            error() { $("#finalizarNotaCredito").attr("disabled", false).removeClass("loading") },
            complete() { $("#finalizarNotaCredito").attr("disabled", false).removeClass("loading") },
            data: JSON.stringify({
                conta_fatura: $("[pesquisarFatura]").val()
            }),
            success: ({fatura}) => {
                let modal = window.xModalGeral || ""

                let { conta_titularnif, conta_titular, conta_vendas } = fatura;
                notacredito.fatura = fatura;
                $(` ${modal} [cliente_titular]`).val(conta_titular || "");
                $(` ${modal} [cliente_nif]`).val(conta_titularnif || "");

                $(`${modal} [tableDocumentArticles]`).empty();
                if(!conta_vendas){
                    $(` ${modal} [tableDocumentArticles] `).addClass("empty");
                    xAlert("Nota de credito", "Não foi encontrado numa fatura com esse número!", "error");
                    return
                }

                conta_vendas.forEach(({ artigo_nome, venda_custounitario, venda_montantecomimposto, artigo_codigo, venda_quantidade, taxa_percentagem, taxa_taxa, venda_id }) => {
                    $(`${modal} [tableDocumentArticles]`).append(`
                    <ul data-venda_id="${venda_id}">
                        <li>${artigo_codigo}</li>
                        <li>${artigo_nome}</li>
                        <li>${venda_quantidade}</li>
                        <li>${ (!taxa_percentagem) ? taxa_taxa || "" : `${taxa_percentagem}%` }</li>
                        <li>${venda_custounitario.dc().formatter()+" STN"}</li>
                        <li>${venda_montantecomimposto.dc().formatter()+" STN"}</li>
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
                    </ul>`);
                })
                xTableGenerate()

                $(` ${modal} [tableDocumentArticles]` ).removeClass("empty")
            }
        });
    },
    reg : () => {
        let modal = window.xModalGeral || ""
        let { fatura : { conta_id }, key: conta_chave } = notacredito;
        let conta_posto_id = $("#colaborador_logado_armazens").find("li.active").attr("posto_admin");
        let conta_observacao = $("[notacredito_observacao]").val();
        let itens = $(`${modal} [tableDocumentArticles] ul`).map(function (){
            let { venda_id } = $(this).data();
            return {
                venda_id
            }
        }).get();

        if( !conta_id ){
            xAlert("Nota de credito", "Selecione uma conta!", "error");
            return;
        }

        if( conta_posto_id === "null" ){
            xAlert("Proforma", "Selecione o posto para estar associado ao armazém "+ $("[currentUserSpace]").text()+", em definições!", "error");
            return;
        }

        if( !itens.length ){
            xAlert("Nota de credito", "Sem item para efetuar a nota de credito!", "error");
            return
        }

        if(!conta_observacao){
            xAlert("Nota de credito", "Digite uma observação!", "error");
            return
        }

        $.ajax({
            url: "/api/reg/credito/nota",
            method: "POST",
            contentType: "application/json",
            error() { $("#finalizarNotaCredito").attr("disabled", false).removeClass("loading") },
            complete() { $("#finalizarNotaCredito").attr("disabled", false).removeClass("loading") },
            data: JSON.stringify({
                conta_id,
                conta_observacao,
                conta_posto_id,
                conta_chave,
                itens
            }),
            success: ({data, result, message}) => {
                let {conta : { conta_id } } = data || {};
                if(result){
                    xAlert("Nota de credito", "Operação efetuada com sucesso!");
                    $(`${modal} [tableDocumentArticles]`).empty().addClass("empty");
                    $(`${modal} [cliente_titular]`).val("");
                    $(`${modal} [cliente_nif]`).val("");
                    $(`${modal} [pesquisarFatura]`).val("");
                    open("/api/print/nota-credito/"+JSON.stringify({type: "pdf", conta_id, date: new Date().getTimeStampPt(), admin: true }));
                    delete notacredito.fatura;
                    return
                }

                xAlert("Nota de credito", message, "error");
            }
        });
    },
    loadAccountKey : () => {
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
    }
}

serieOperation.loadSerieOperation([serieOperation.tipo.notaCredito]);

$("[pesquisarFatura]").on("keyup", function ({keyCode}){
    let { loadData } = notacredito;
    if(keyCode === 13 && $(this).val()){
        loadData();
        return
    }

    if(keyCode === 13 && !$(this).val()) {
        xAlert("Nota de credito", "Priencha o campo fatura!", "error");
    }
})

$("#finalizarNotaCredito").on("click", function (){
    let { reg, loadAccountKey } = notacredito;
    loadAccountKey().then(({ accountKey }) => {
        notacredito.key = accountKey; reg();
    })
})

$("[tableDocumentArticles]").on("click", "[del]", function (){
    let modal = window.xModalGeral || ""
    $(this).parents("ul").remove()
    if(!$(`${modal} [tableDocumentArticles] ul`).length){
        $(`${modal} [tableDocumentArticles]`).addClass("empty")
    }
})

xTableGenerate()
