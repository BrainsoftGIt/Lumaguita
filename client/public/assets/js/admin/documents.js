var documents = {
    init : () => {
        documents.loadPostos();
        documents.loadColaborador();
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
        let _date_start = $("#_date_start").val() || null;
        let _date_end = $("#_date_end").val() || null;
        let {_colaborator_id} = $("[list='_colaborator_id'] li.active").data() || {};
        let {_posto_id} = $("[list='_posto_id'] li.active").data() || {};
        let _artigo_id = documents.article_id || null;
        let _documento = $("#_documento").val() || null;

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
                _documento
            }),
            error() {},
            success(e) {
                console.log(e)
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
}

documents.init();
$('[data-inputmask-alias]').inputmask();

$("#_artigo_id").on("keyup", function (){
    documents.search_article();
})


$("#loadDocuments").on("click", function (){
    documents.load();
})
