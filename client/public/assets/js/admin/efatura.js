var efatura = {
    list: [],
    current_type_serie: null,
    authorization : {
        series: [],
        sets : () => {
            if(!validation1($('[inp="armazem_efaturav2"]'))){
                return
            }

            let { authorization : { series, load} } = efatura;
            if(!series.length){
                return
            }

            let armazem_efatura = $("#armazem_efaturav2").find("li.active").attr("armazem_id")

            let {autorizacao_uid} = efatura;
            $.ajax({
                url: "/api/efatura/authorization/reg",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    autorizacao_uid,
                    autorizacao_espaco_uid: armazem_efatura,
                    autorizacao_designacao: "",
                    autorizacao_numero: new Date().getTime().toString(),
                    series: series.map(({serie_espaco_id, ...serie}) => {
                        return { ...serie, serie_espaco_id: armazem_efatura };
                    })
                }),
                error: () => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading")
                },
                success: (e)  => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading");
                    if(e.result){
                        load();
                        efatura.authorization.selected = null;
                        xAlert("Série", "Configuração de série atualizada com sucesso!");
                        $("#tipo_serie_efatura, #armazem_efatura").find("li").removeClass("active");
                        $("#xModalEfatura input").val("");
                        $("#numero_serie_efatura").attr("disabled", true);
                        $("#xModalEfatura .hideTarget").click();
                        $("#xModalEfaturaV2").removeClass("show")
                    }
                    else{
                        xAlert("Série", e.data, "error");
                    }
                }
            });
        },
        closeyear : ({ autorizacao_uid }) => {
            let { authorization : { load } } = efatura;

            $.ajax({
                url: "/api/efatura/authorization/closeyear",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    autorizacao_uid
                }),
                error: () => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading")
                },
                success: (e)  => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading");
                    if(e.result){
                        load();
                        efatura.authorization.selected = null;
                        $("#xModalSerieStatus").removeClass("show")
                        xAlert("Série", "Configuração de série atualizada com sucesso!");
                    }
                    else{
                        xAlert("Série", e.data, "error");
                    }
                }
            });
        },
        reload : ({ autorizacao_uid }) => {
            let { authorization : { load } } = efatura;

            $.ajax({
                url: "/api/efatura/authorization/continue",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    autorizacao_uid
                }),
                error: () => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading")
                },
                success: (e)  => {
                    $("[bt_efatura]").prop("disabled", false).removeClass("loading");
                    if(e.result){
                        load();
                        efatura.authorization.selected = null;
                        $("#xModalSerieStatus").removeClass("show")
                        xAlert("Série", "Configuração de série atualizada com sucesso!");
                    }
                    else{
                        xAlert("Série", e.data, "error");
                    }
                }
            });
        },
        addSeries : () => {
            let { authorization: { series, loadAllSerieaAdded } } = efatura;
            let tipo_serie_efaturav2 = $("#tipo_serie_efaturav2");
            let numero_serie_efaturav2 = $("#numero_serie_efaturav2");
            let quantidade_serie_efaturav2 = $("#quantidade_serie_efaturav2")
            let numero_autorizacao_seriev2 = $("#numero_autorizacao_seriev2")

            if(!validation1($("#xModalEfaturaV2 .inn input"))){
                return
            }

            let { serie_id, serie_espaco_id } = efatura?.authorization?.serie?.selected || {};
            series.push({
                serie_id: serie_id || null,
                serie_tserie_id: tipo_serie_efaturav2.find("li.active").attr("tipo_id"),
                serie_espaco_id: serie_espaco_id || null,
                serie_designacao:  tipo_serie_efaturav2.find("li.active").text(),
                serie_numerotext:  numero_serie_efaturav2.val(),
                serie_numero: numero_serie_efaturav2.val().split("-")[1],
                serie_quantidade: quantidade_serie_efaturav2.val(),
                serie_numcertificacao: null,
                serie_numatorizacao: numero_autorizacao_seriev2.val(),
            })

            $('[inp="tipo_serie_efaturav2"]').val("")
            tipo_serie_efaturav2.find('li[noremove="false"].active').removeClass("active").hide();
            numero_serie_efaturav2.val("");
            quantidade_serie_efaturav2.val("");
            numero_autorizacao_seriev2.val("");

            loadAllSerieaAdded();
        },
        loadAllSerieaAdded : () => {
            let { authorization: { series } } = efatura;
            $("#ConfiguredSerie").empty();
            return series.forEach(({ serie_designacao, serie_numerotext, serie_quantidade, serie_numatorizacao }) =>  {
                 $("#ConfiguredSerie").append(`
                        <li>
                            <span class="flex h-sb"><small>Tipo</small><small class="nome_impressora">${serie_designacao}</small></span>
                            <span class="flex h-sb"><small>Qta.</small><small class="nome_impressora">${serie_quantidade}</small></span>
                            <span class="flex h-sb"><small>Número</small><small class="nome_impressora">${serie_numerotext}</small></span>
                            <span class="flex h-sb"><small>Nº Certificação</small><small class="nome_impressora">${serie_numatorizacao}</small></span>
                            <span class="ctrl">
                                <svg class="edit" viewBox="0 0 512 512">
                                    <path
                                        d="m368 511.957031h-309.332031c-32.363281 0-58.667969-26.304687-58.667969-58.667969v-309.332031c0-32.363281 26.304688-58.667969 58.667969-58.667969h181.332031c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16h-181.332031c-14.699219 0-26.667969 11.96875-26.667969 26.667969v309.332031c0 14.699219 11.96875 26.667969 26.667969 26.667969h309.332031c14.699219 0 26.667969-11.96875 26.667969-26.667969v-181.332031c0-8.832031 7.167969-16 16-16s16 7.148438 16 16v181.332031c0 32.363282-26.304688 58.667969-58.667969 58.667969zm0 0" />
                                    <path
                                        d="m187.136719 340.820312c-4.203125 0-8.300781-1.664062-11.308594-4.691406-3.796875-3.777344-5.417969-9.21875-4.371094-14.445312l15.082031-75.433594c.617188-3.113281 2.152344-5.953125 4.371094-8.171875l220.953125-220.925781c22.867188-22.871094 60.074219-22.871094 82.964844 0 11.070313 11.070312 17.171875 25.792968 17.171875 41.472656s-6.101562 30.398438-17.195312 41.472656l-220.925782 220.949219c-2.21875 2.238281-5.078125 3.753906-8.171875 4.371094l-75.414062 15.082031c-1.046875.214844-2.113281.320312-3.15625.320312zm75.433593-31.082031h.214844zm-45.609374-52.457031-9.410157 47.144531 47.125-9.429687 217.515625-217.511719c5.035156-5.058594 7.808594-11.734375 7.808594-18.859375s-2.773438-13.804688-7.808594-18.859375c-10.367187-10.390625-27.285156-10.390625-37.714844 0zm0 0" />
                                    <path
                                        d="m453.332031 134.976562c-4.09375 0-8.191406-1.558593-11.304687-4.695312l-60.332032-60.351562c-6.25-6.25-6.25-16.382813 0-22.632813s16.382813-6.25 22.636719 0l60.328125 60.351563c6.25 6.25 6.25 16.382812 0 22.632812-3.136718 3.117188-7.230468 4.695312-11.328125 4.695312zm0 0" />
                                </svg>
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
                            </span>
                        </li>
                `);
            })
        },
        load : () => {
            $("body").addClass("loading");
            $.ajax({
                url: "/api/efatura/authorization/load",
                method: "POST",
                contentType: "application/json",
                error: () => {
                    $("body").removeClass("loading");
                },
                success: ({datas})  => {
                    $("body").removeClass("loading");
                    let series_efatura = $("#series_efatura").empty();
                    efatura.authorization.list = datas;
                    let { authorization: { list }} = efatura;

                    if(list.length === 0) series_efatura.addClass("empty");
                    else series_efatura.removeClass("empty");

                    list.forEach(({ autorizacao_dataregistro, autorizacao_ano, espaco_nome, autorizacao_estado, autorizacao_continue}) =>{
                        let icon = "";
                        if( autorizacao_estado === 1 ){
                            icon += `<a  class="edit" title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M16.757 3l-7.466 7.466.008 4.247 4.238-.007L21 7.243V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"/> </g> </svg>
                                    </a>`;
                            icon += `<a  class="delete" title="Fechar Ano">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" ></path> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path> </svg>
                                    </a>`;
                        }

                        if( autorizacao_continue ){
                            icon += `<a class="view" title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/> </svg>
                                    </a>`;
                            icon += `<a class="reload" title="Continuar">
                                        <svg height="20" viewBox="0 0 21 21" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path d="m12.5 1.5c2.4138473 1.37729434 4 4.02194088 4 7 0 4.418278-3.581722 8-8 8s-8-3.581722-8-8 3.581722-8 8-8"/><path d="m12.5 5.5v-4h4"/></g></svg>
                                     </a>`;
                        }

                        series_efatura.append(`<ul class="flex">
                                                  <li class="flex column">
                                                    <span>Ano</span>
                                                    <span>${autorizacao_ano}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Armazém</span>
                                                    <span>${espaco_nome}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Número de série</span>
                                                    <span>${ autorizacao_estado? "Ativo" : "Fechado" }</span>
                                                </li>
                                                <li class="flex column">
                                                    <span>Registo</span>
                                                    <span>${autorizacao_dataregistro.stringToDateEn().getDatePt()}</span>
                                                </li>
                                                <li class="flex column">
                                                    <span class="noLabel"></span>
                                                    <span class="flex v-ct">
                                                        ${icon}
                                                    </span>
                                                </li>
                                            </ul>`);
                    });
                }
            });
        },
        serie : {
           load: ({arg_autorizacao_id}) => {
                $("body").addClass("loading");
               let {authorization : { loadAllSerieaAdded }} = efatura;

               $('[inp="tipo_serie_efaturav2"]').val("")
               $("#tipo_serie_efaturav2").find('li[noremove="false"].active').removeClass("active").hide();
               $("#numero_serie_efaturav2").val("");
               $("#quantidade_serie_efaturav2").val("");
               $("#numero_autorizacao_seriev2").val("");

               $.ajax({
                    url: "/api/efatura/load",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        place: "admin",
                        arg_autorizacao_id
                    }),
                    success: ({ series }) => {
                        $("body").removeClass("loading");
                        $(`#tipo_serie_efaturav2 li`).show();
                        efatura.authorization.series = series.map(({ data : { serie_numero, serie_tserie_id, ...serie } }) => {
                            let sigla = $(`#tipo_serie_efaturav2 [tipo_id='${serie_tserie_id}'][noremove="false"]`).hide().attr("tipo_sigla")
                            return {
                                ...serie,
                                serie_numerotext: sigla+serie_numero
                            }
                        });
                        loadAllSerieaAdded();
                        showTarget("xModalEfaturaV2", "Definições de Autorização / Serie");
                    },
                    error: () => {
                        $("body").removeClass("loading");
                    },
                });
            },
        }
    }
};

efatura.authorization.load();

$("[novaSerieEfatura]").on("click", function () {
    delete efatura.authorization.selected;
    efatura.authorization.series = [];
    $("#tipo_serie_efaturav2, #armazem_efaturav2").find("li").removeClass("active");
    $("#xModalEfaturaV2 input").val("");
    showTarget("xModalEfaturaV2", "Definições de Autorização / Serie");
    $(`#tipo_serie_efaturav2 li`).show();
    efatura.authorization.loadAllSerieaAdded();
});

$("#tipo_serie_efatura, #tipo_serie_efaturav2").on("mousedown", "li", function () {
    efatura.current_type_serie = $(this).attr("tipo_sigla");
    $("#numero_serie_efatura, #numero_serie_efaturav2").val($(this).attr("tipo_sigla")).attr("disabled", false);
});

$('#numero_serie_efatura, #numero_serie_efaturav2').keyup(function() {
    if($(this).val().includes(efatura.current_type_serie)) $(this).val($(this).val());
    else $(this).val( efatura.current_type_serie);
});


$("[addMoreSerie]").on("click", function (){
    let {authorization : {addSeries}} = efatura;
    addSeries();
});

$("#ConfiguredSerie")
    .on("click", ".edit", function (){
        let index = $(this).closest("li").index();
        let { authorization: { series, loadAllSerieaAdded } } = efatura;
        efatura.authorization.serie.selected = series.splice(index, 1)[0];
        let { serie_tserie_id, serie_numerotext, serie_designacao, serie_quantidade, serie_numatorizacao } = efatura.authorization.serie.selected;
        $(`#tipo_serie_efaturav2 [tipo_id='${serie_tserie_id}']`).show().addClass("active").siblings().removeClass("active");
        $('[inp="tipo_serie_efaturav2"]').val(serie_designacao);
        $('#quantidade_serie_efaturav2').val(serie_quantidade);
        $('#numero_autorizacao_seriev2').val(serie_numatorizacao);
        $('#numero_serie_efaturav2').val(serie_numerotext);
        loadAllSerieaAdded()
    })
    .on("click", ".delete", function (){
        let index = $(this).closest("li").index();
        let { authorization: { series, loadAllSerieaAdded } } = efatura;
        let { 0: { serie_tserie_id } } = series.splice(index, 1);
        $(`#tipo_serie_efaturav2 [tipo_id='${serie_tserie_id}']`).show().removeClass("active");
        loadAllSerieaAdded()
    })

$("#series_efatura")
    .on("click", ".edit, .view", function (e){
        let { authorization: { serie : { load }, list } } = efatura;
        let index = $(this).closest("ul").index();
        let { autorizacao_uid, espaco_nome, espaco_id } = list[index];
        efatura.autorizacao_uid = autorizacao_uid;
        $(`#armazem_efaturav2 [armazem_id='${espaco_id}']`).show().addClass("active").siblings().removeClass("active");
        $('[inp="armazem_efaturav2"]').val(espaco_nome);
        load({  arg_autorizacao_id : autorizacao_uid } )
        e.stopPropagation();
    })
    .on("click", ".delete, .reload", function (e){
        let { authorization: { list } } = efatura;
        let index = $(this).closest("ul").index();
        let { autorizacao_uid } = list[index];
        let status = $(this).attr("class");
        let action = {
            delete: {
                title: "Fechar o Ano",
                btattr: "closeyear"
            },
            reload: {
                title: "Continuar com a mesma",
                btattr: "reload"
            }
        }

        showTarget("xModalSerieStatus", action[status].title);
        $("[btSerieStatus]")
            .attr("btSerieStatus", action[status].btattr)
            .attr("autorizacao_uid", autorizacao_uid)
        e.stopPropagation();
    })

$("#xModalSerieStatus")
    .on("click", "[btSerieStatus]", function (){
        let { authorization : { list, closeyear, reload } } = efatura;
        let action = { closeyear, reload };
        let status = $(this).attr("btSerieStatus");
        let autorizacao_uid = $(this).attr("autorizacao_uid");
        action[status]({ autorizacao_uid })
    })

$("[btSetAturizacao]")
    .on("click", function (){
        let { authorization : { sets } } = efatura;
        sets();
    })
