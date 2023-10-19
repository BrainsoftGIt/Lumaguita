var articlesDocuments = {
    article_id: null,
    article_code: null,
    precario_quantidade: null,
    customers: [],
    customer_id: null,
    init(){
        $('[data-inputmask-alias]').inputmask();
        $("[tableDocumentArticles]").addClass("empty");
        xTableGenerate();
        articlesDocuments.loadCustomersDataList();
    },
    loadCustomersDataList(){
        $.ajax({
            url: "/api/clientes/admin",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let datalist_customers = $("#guiaSaidaClientes, datalist[fatura]");
                articlesDocuments.customers = [];
                articlesDocuments.customers = e.customers;
                datalist_customers.empty();
                articlesDocuments.customers.forEach((cust, idx) =>{
                    cust = cust.data;
                    datalist_customers.append(`<option  data-id=${cust.cliente_id} data-value="${cust.cliente_titular}">${cust.cliente_titular}</option>`);
                });
            }
        });
    },
    loadSerieDistribuicao(tserie_id){
        $.ajax({
            url: "/api/load/futura/article",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                tserie_id
            }),
            success({data}) {
                let datalist_customers = $(`[listFatura]#f${tserie_id}`);
                datalist_customers.empty();
                (data || []).forEach((cust, idx) =>{
                    datalist_customers.append(`<li data-id=${cust.serie_id} data-imposto="${cust.tserie_financa}">${cust.serie_designacao}</li>`);
                });
            }
        });
    },
    search_article(){
        articlesDocuments.article_id = null;
        let modal = window.xModalGeral || ""
        console.log({modal})
        const article =  $(` ${modal} [search_article]`).val().trim();
        $.ajax({
            url: "/api/articles/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_classe_id: null, arg_artigo_estado: 1,
                query:{
                    any: article
                }
            }),
            success(e) {
                articlesDocuments.artigoLoaded = true;

                let existeInquery = (articlesDocuments?.sArgigo || []).find(({funct_load_artigo: {artigo_nome}}) =>  article.$$(artigo_nome));
                let datalistArtigos = $(`${modal} datalist[artigos]`);
                datalistArtigos.empty();
                if(e.artcls.length > 1 && !existeInquery) {
                    e.artcls.forEach((art) => {
                        datalistArtigos.append(`<option value="${art.funct_load_artigo.artigo_nome}" data-id=${art.funct_load_artigo.artigo_id} data-value=${art.funct_load_artigo.artigo_nome.toLowerCase().trim()}>${art.funct_load_artigo.artigo_codigo}</option>`);
                    });
                }
                else if(e.artcls.length === 1 || !!existeInquery){
                    delete articlesDocuments.sArgigo;
                    existeInquery = e?.artcls[0];
                    articlesDocuments.article_id = existeInquery.funct_load_artigo.artigo_id;
                    if(taxasArtigos.taxs.find(value => value.artigo_id ===  articlesDocuments.article_id)){
                        let imposto = taxasArtigos.showTax(articlesDocuments.article_id);
                        if(imposto.valor !== null && $(`${modal} [imposto] `).length > 0 ){
                            if(imposto.tipo === "remove") $(`${modal} [imposto]`).val(imposto.valor).css("color", "rgb(255, 0, 0)");
                            else $(`${modal} [imposto]`).val(imposto.valor).css("color", "rgb(17, 17, 17)");
                        }
                    }
                    else{
                        taxasArtigos.loadArticleTax({article_id: [articlesDocuments.article_id]}).then(value => {
                            taxasArtigos.addTax(value.tax[0].main, articlesDocuments.article_id);
                            let imposto = taxasArtigos.showTax(articlesDocuments.article_id);
                            if(imposto.valor !== null  && $(`${modal}  [imposto]`).length > 0){
                                if(imposto.tipo === "remove") $(`${modal} [imposto] `).val(imposto.valor).css("color", "rgb(255, 0, 0)");
                                else $(`${modal} [imposto]`).val(imposto.valor).css("color", "rgb(17, 17, 17)");
                            }
                        });
                    }

                    articlesDocuments.article_code = existeInquery.funct_load_artigo.artigo_codigo;
                    articlesDocuments.precario_quantidade = existeInquery.funct_load_artigo.precario_quantidade || 0;
                    $(`${modal} [description_article]`).val(existeInquery.funct_load_artigo.artigo_nome);
                    $(`${modal} [price_article]`).val(existeInquery.funct_load_artigo.precario_custo);
                    $(`${modal} [amount_packaging]`).val((existeInquery.funct_load_artigo.artigo_compostoquantidade || "0"));
                }
                else articlesDocuments.resetFieldsArticle();
                articlesDocuments.sArgigo = e.artcls;
            }
        });
    },
    resetFieldsArticle(){
        let modal = window.xModalGeral || ""
        $(`${modal} [description_article], [amount_article], [price_article], [lote_article], [date_expiration_article], [amount_packaging], [imposto]`).val("");
    },
    add_articles_purchase(){
        let modal = window.xModalGeral || ""
        let total_value = $(`${modal} [amount_article]`).val().unFormatter() * $(`${modal} [price_article]`).val().unFormatter();
        $(`${modal} [tableDocumentArticles]`).append(`<ul article_id="${articlesDocuments.article_id}">
                                            <li>${ $(`${modal} [description_article]`).val()}</li>
                                            <li>${$(`${modal} [amount_article] `).val()}</li>
                                            <li price="${$(`${modal} [price_article] `).val().unFormatter()}">${$(` ${modal} [price_article]`).val()+" STN"}</li>
                                            <li>${($(`${modal} [lote_article]`).val().trim() || "")}</li>
                                            <li>${($(`${modal} [date_expiration_article] `).val() || "")}</li>
                                            <li>${$(`${modal} [amount_packaging]`).val()}</li>                                                         
                                            <li>${total_value+" STN"}</li>                              
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
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
    },
    add_articles_transference(){
        let modal = window.xModalGeral || ""
        $(`${modal} [tableDocumentArticles]`).append(`<ul article_id="${articlesDocuments.article_id}">
                                            <li>${articlesDocuments.article_code}</li>
                                            <li>${ $(`${modal} [description_article]`).val()}</li>
                                            <li>${$(`${modal} [amount_article]`).val()}</li>                            
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
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
    },
    add_articles_exit_guide(){
        let modal = window.xModalGeral || ""
        $(`${modal} [tableDocumentArticles]`).append(`<ul article_id="${articlesDocuments.article_id}" custoquantidade="${(articlesDocuments.precario_quantidade)}">
                                            <li>${articlesDocuments.article_code}</li>
                                            <li>${$(`${modal} [description_article]`).val()}</li>
                                            <li>${$(`${modal} [amount_article]`).val()}</li>
                                            <li>${($(`${modal} [lote_article]`).val().trim() || "")}</li>
                                            <li>${($(`${modal} [date_expiration_article]`).val() || "")}</li>
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
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
    },
    add_articles_invoice(){
        let modal = window.xModalGeral || "";
        let montanteQuantidade = $(`${modal} [amount_article]`).val().unFormatter() * $(`${modal} [price_article]`).val().unFormatter();
        let result = taxasArtigos.calculateValues({montanteQuantidade: montanteQuantidade, artigo_id: articlesDocuments.article_id});
        $(`${modal} [tableDocumentArticles]`).append(`<ul article_id="${articlesDocuments.article_id}" custoquantidade="${articlesDocuments.precario_quantidade}">
                                            <li>${articlesDocuments.article_code}</li>
                                            <li>${ $(`${modal} [description_article]`).val()}</li>
                                            <li>${$(` ${modal} [amount_article]`).val()}</li>
                                            <li>${($(`${modal} [lote_article]`).val().trim() || "")}</li>
                                            <li>${($(`${modal} [date_expiration_article]`).val() || "")}</li>
                                            <li>${$(`${modal} [imposto]`).val()}</li>
                                            <li price="${$(`${modal} [price_article] `).val().unFormatter()}">${$(` ${modal} [price_article] `).val()+" STN"}</li>
                                            <li>${result.total.dc().formatter()+" STN"}</li>
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
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

    },
    adicionarArtigosGuiaSaida(){
        let modal = window.xModalGeral || "";
        let total_value = $(`${modal} [amount_article]`).val().unFormatter() * $(`${modal} [price_article]`).val().unFormatter();
        $(`${modal} [tableDocumentArticles]`).append(`<ul article_id="${articlesDocuments.article_id}" custoquantidade="${articlesDocuments.precario_quantidade}">
                                            <li>${articlesDocuments.article_code}</li>
                                            <li>${$(`${modal} [description_article]`).val()}</li>
                                            <li>${$(` ${modal} [amount_article] `).val()}</li>
                                            <li>${($(`${modal} [lote_article]`).val().trim() || "")}</li>
                                            <li>${($(`${modal} [date_expiration_article]`).val() || "")}</li>
                                            <li price="${$(` ${modal} [price_article]`).val().unFormatter()}">${$(` ${modal} [price_article] `).val()+" STN"}</li>
                                            <li>${total_value+" STN"}</li>
                                            <li class="flex v-ct">
                                               <span class="noLabel"></span>
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
    },
    addArticleTable(){
        let modal = window.xModalGeral || ""
        if(articlesDocuments.article_id === null){
            xAlert("Artigo", "Pesquise um artigo pelo código para ser adicionado!", "info");
            return;
        }
        if(!validation1($(`${modal} [description_article], ${modal} [amount_article], ${modal} [price_article]`))){
            xAlert("Artigo", "Preencha todos os campos obrigatórios!", "error");
            return;
        }
        if($(`${modal} [fatura]`).length !== 0) this.add_articles_invoice();
        if($(`${modal} #artigos_entrada`).length !== 0) this.add_articles_purchase();
        if($(`${modal} #transfArtigos`).length !== 0) this.add_articles_transference();
        if($(`${modal} #guiaSaidaArtigos`).length !== 0) this.adicionarArtigosGuiaSaida();

        $(`${modal} [tableDocumentArticles]`).removeClass("empty");
        articlesDocuments.resetFieldsArticle();
        $(`${modal} [search_article]`).val("");
        xTableGenerate();
    }
};
articlesDocuments.init();
$("[search_article]").keyup(function (e) {
    let artigo = $(this).val().trim();
    setTimeout(function(){
        if(artigo !== ""){
            articlesDocuments.search_article();
        }
        else{
            articlesDocuments.article_id = null;
            articlesDocuments.resetFieldsArticle();
        }
    }, 1000);
});
$("[search_customer]").on("keyup", function(){
    let modal = window.xModalGeral || ""
    let cliente_uuid = null;
    let datalist_customers = $(`${modal} datalist[fatura], ${modal} #guiaSaidaClientes`);
    if($(this).val().trim() === "") return;
    cliente_uuid = datalist_customers.find(`option[data-value="${$(this).val()}"]`).attr("data-id") || null;
    let cliente  = articlesDocuments.customers.filter(cust => cust.data.cliente_id === cliente_uuid)
    if(cliente.length > 0){
        articlesDocuments.customer_id = cliente[0].data.cliente_id;
        $(` ${modal} [cliente_titular]`).val(cliente[0].data.cliente_titular);
        $(` ${modal} [cliente_nif]`).val((cliente[0].data.cliente_nif || ""));
        $(` ${modal} [cliente_contacto]`).val((cliente[0].data.cliente_contactos.length > 0 ? cliente[0].data.cliente_contactos[0] : ""));
    }
    else {
        articlesDocuments.customer_id = null;
        $(` ${modal} [cliente_titular], ${modal} [cliente_nif], ${modal} [cliente_contacto]`).val("");
    }
});
$("[addArticleTable]").on("click",function (e) {
    articlesDocuments.addArticleTable();
});
$("[tableDocumentArticles]").on("click", ".delete", function () {
    let modal = window.xModalGeral || ""
    $(this).closest("ul").remove();
    if($(` ${modal} [tableDocumentArticles]`).find(`ul`).length === 0) $(`${modal} [tableDocumentArticles]`).addClass("empty");
    else $(`${modal} [tableDocumentArticles] `).removeClass("empty");
});
