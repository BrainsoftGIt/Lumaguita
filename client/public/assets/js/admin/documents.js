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
                data: "/api/print/guia_saida/"+JSON.stringify({date, conta_id: conta_id, admin: true}),
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
                data: "/api/print/proforma/"+JSON.stringify({type: "pdf", conta_id: conta_id, date, admin: true}),
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

            if(!!cambio_taxa && cambio_taxa !== 1){
                Documents.open({
                    data: "/api/print/fatura/gringa/"+JSON.stringify({type: "pdf", conta_id, date, admin: true}),
                    name: `Fatura em ${currency_code}`
                });
            }
        },
    },
    edit: {
        [serieOperation.tipo.fatura_recibo] : ({conta_serie}) => {
            documents.editFunc("maguita.nota.credito", conta_serie)
        },
        [serieOperation.tipo.faturaSimplificada] : ({conta_serie}) => {
            documents.editFunc("maguita.nota.credito", conta_serie)
        },
        [serieOperation.tipo.notaCredito] : ({conta_serie}) => {
            documents.editFunc("maguita.nota.debito", conta_serie)
        },
        [serieOperation.tipo.notaDebito] : ({conta_serie}) => {
            documents.editFunc("maguita.nota.credito", conta_serie)
        },
        [serieOperation.tipo.fatura] : ({conta_serie}) => {
            documents.editFunc("maguita.nota.credito", conta_serie)
        },
    },
    editFunc: (menuCode, fatura) => {
        let menu = $(`[code='${menuCode}']`);
        if(!menu.length){
            return
        }

        let operaction = menuCode.split(".").pop()
        serieOperation.fatura[operaction] = fatura;
        menu.trigger("click");
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

                let hide = (!!documents.edit[_tserie_id]) ? "" : "hide";
                console.log({hide, _tserie_id})

                lista.forEach(({currency_code, cambio_taxa, cliente_nif, deposito_id, cliente_id, cliente_titular, colaborador_nome, conta_montante, posto_designacao, conta_titular, conta_titularnif, conta_numerofatura, deposito_documento, conta_data, conta_id, tserie_id, deposito_montantefinal, deposito_data}) => {
                    $(`[body-report-list-faturas]`).append(`<ul data-conta_numerofatura="${conta_numerofatura}" data-currency_code="${currency_code}" data-cambio_taxa="${cambio_taxa}" data-conta_id="${conta_id}" data-tserie_id="${tserie_id}" data-date="${conta_data || deposito_data}" data-deposito="${deposito_id}" data-client="${cliente_id}">
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
                                             <span operationEdit class="flex v-ct ${hide}">
                                                   <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M12.6406 8.52979L17.4906 9.75979" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M11.6602 12.3999L14.5602 13.1399" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                       
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
}).on("click", "[operationEdit]", function (){
    let {_tserie_id} = $("[list='_tserie_id'] li.active").data() || {};
    let {conta_numerofatura} = $(this).closest("ul").data();

    documents.edit[_tserie_id]({
        conta_serie: conta_numerofatura
    })
})
