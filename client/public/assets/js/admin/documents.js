var documents = {
    reprint: {
        [serieOperation.tipo.fatura_recibo] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/fatura/recibo/"+JSON.stringify({conta_id, date, admin: true}),
                name: "Fatura Recibo"
            });
        },
        [serieOperation.tipo.faturaSimplificada] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/fatura/recibo/"+JSON.stringify({conta_id, date, admin: true}),
                name: "Fatura Simplificada"
            });
        },
        [serieOperation.tipo.guiaSaida] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/guia_saida/"+JSON.stringify({date, conta_id: conta_id }),
                name : "Guia de Saida"
            });
        },
        [serieOperation.tipo.recibo] : ({deposito, date, client}) => {
            Documents.open({
                data: "/api/print/recibo/" + JSON.stringify({deposito, client, date, admin: true}),
                name: "Recibo"
            });
        },
        [serieOperation.tipo.faturaProforma] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/proforma/"+JSON.stringify({type: "pdf", conta_id: conta_id, date }),
                name: "ProForma"
            });
        },
        [serieOperation.tipo.notaCredito] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/nota-credito/"+JSON.stringify({type: "pdf", conta_id, date, admin: true }),
                name: "Nota de Credito"
            });
        },
        [serieOperation.tipo.notaDebito] : ({conta_id, date}) => {
            Documents.open({
                data: "/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id, date, admin: true}),
                name: "Nota de Debito"
            });
        },
        [serieOperation.tipo.fatura] : ({conta_id, date, cambio_taxa, currency_code}) => {
            Documents.open({
                data: "/api/print/fatura/"+JSON.stringify({type: "pdf", conta_id, date, admin: true}),
                name: "Fatura"
            });

            if(cambio_taxa !== 1){
                Documents.open({
                    data: "/api/print/fatura/gringa/"+JSON.stringify({type: "pdf", conta_id, date, admin: true}),
                    name: `Fatura em ${currency_code}`
                });
            }
        },
    },
    init : () => {
        xTableGenerate();
        documents.loadPostos();
        documents.loadColaborador();
        documents.loadCliente();
    },
    search_article(){
        documents.article_id = null;
        const article =  $(`#_artigo_id`).val().trim();
        $.ajax({
            url: "/api/articles/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                arg_classe_id: null,
                arg_artigo_estado: 1,
                query:{
                    any: article
                }
            }),
            success(e) {
                documents.artigoLoaded = true;

                documents.sArgigo = e.artcls;
                let existeInquery = (documents?.sArgigo || []).find(({funct_load_artigo: {artigo_nome}}) =>  article === artigo_nome);
                let datalistArtigos = $(`datalist[artigos]`);

                if(!existeInquery) {
                    datalistArtigos.empty();
                    documents.sArgigo.forEach((art) => {
                        datalistArtigos.append(`<option value="${art.funct_load_artigo.artigo_nome}" data-_artigo_id=${art.funct_load_artigo.artigo_id} data-value=${art.funct_load_artigo.artigo_nome.toLowerCase().trim()}>${art.funct_load_artigo.artigo_codigo}</option>`);
                    });
                    return
                }

                if(documents.sArgigo.length === 1 || !!existeInquery){
                    documents.article_id = existeInquery.funct_load_artigo.artigo_id;
                }
            }
        });
    },
    load : () => {
        let {_tserie_id} = $("[list='_tserie_id'] li.active").data() || {};
        let _date_start = ($("#_date_start").val().stringToDate() || "").getDateEn() || null;
        let _date_end = ($("#_date_end").val().stringToDate() || "").getDateEn() || null;
        let {_colaborator_id} = $("[list='_colaborator_id'] li.active").data() || {};
        let {_posto_id} = $("[list='_posto_id'] li.active").data() || {};
        let {_client_id} = $("[list='_client_id'] li.active").data() || {};
        let _artigo_id = documents.article_id || null;
        let _documento = $("#_documento").val() || null;
        let _client_nif = $("#_client_nif").val() || null;

        if(!_tserie_id){
            xAlert("", "Por favor, selecione uma serie de fatura!", "error");
            return
        }

        $.ajax({
            url: "/api/load/documents",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                _tserie_id,
                _date_start,
                _date_end,
                _colaborator_id,
                _posto_id,
                _artigo_id,
                _documento,
                _client_nif,
                _client_id
            }),
            error() {},
            success(lista) {

                $(`[body-report-list-faturas]`).addClass("empty").empty();

                lista.forEach(({currency_code, cambio_taxa, cliente_nif, deposito_id, cliente_id, cliente_titular, colaborador_nome, conta_montante, posto_designacao, conta_titular, conta_titularnif, conta_numerofatura, deposito_documento, conta_data, conta_id, tserie_id, deposito_montantefinal, deposito_data}) => {
                    $(`[body-report-list-faturas]`).append(`<ul data-currency_code="${currency_code}" data-cambio_taxa="${cambio_taxa}" data-conta_id="${conta_id}" data-tserie_id="${tserie_id}" data-date="${conta_data || deposito_data}" data-deposito="${deposito_id}" data-client="${cliente_id}">
                                            <li>${conta_numerofatura || deposito_documento}</li>
                                            <li>${cliente_titular || conta_titular}</li>
                                            <li>${cliente_nif || conta_titularnif || "---------"}</li>
                                            <li>${(conta_montante || deposito_montantefinal).formatter()} STN</li>
                                            <li>${colaborador_nome || "---------"}</li>
                                            <li>${posto_designacao || "---------"}</li>
                                            <li>${(conta_data || deposito_data).stringToDateEn().getDatePt()}</li>
                                            <li class="flex v-ct j-stp">
                                                <span class="flex v-ct">
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
                })

                $(` [body-report-list-faturas] `).removeClass("empty");
                $("#xModalFindDocuments").removeClass("show")
                xTableGenerate();
            }
        });
    },
    loadPostos(){
        $.ajax({
            url: "/api/posto/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                let _posto_id = $("[list='_posto_id']");
                e.postosEspaco.forEach(({funct_load_posto: {posto_id, posto_designacao}}, idx) => {
                    _posto_id.append(`<li data-_posto_id="${posto_id}">${posto_designacao}</li>`);
                });
            }
        });
    },
    loadColaborador(){
        $.ajax({
            url: "/api/report/source/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({source: "auth.colaborador"}),
            success(e) {
                e.filterData.forEach((fildata) =>{
                    $('[list="_colaborator_id"]').append(`<li class="tgl" data-_colaborator_id="${fildata.data.id}">${fildata.data.label}</li>`);
                });
            }
        });
    },
    loadCliente(){
        $.ajax({
            url: "/api/report/source/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({source: "tweeks.cliente"}),
            success(e) {
                e.filterData.forEach((fildata) =>{
                    $('[list="_client_id"]').append(`<li class="tgl" data-_client_id="${fildata.data.id}">${fildata.data.label}</li>`);
                });
            }
        });
    },
}

documents.init();
$('[data-inputmask-alias]').inputmask();

$("#_artigo_id").on("keyup", function (){
    documents.search_article();
})

$("#loadDocuments").on("click", function (){
    documents.load();
})

$(`[body-report-list-faturas]`).on("click", ".imprimir",function (){
    let {conta_id, date, deposito, client, cambio_taxa, currency_code} = $(this).closest("ul").data();
    let {_tserie_id: tserie_id} = $("[list='_tserie_id'] li.active").data() || {};
    documents.reprint[tserie_id]({conta_id, date, deposito, client, cambio_taxa, currency_code})
})
