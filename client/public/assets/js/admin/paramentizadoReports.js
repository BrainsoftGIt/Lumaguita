var paramentizadoReports = {
    types: {
        ValorAtual: "1",
        DatadoProcessamento: "2",
        RelativoaDataAtual: "3",
        Pedir: "4",
        PedirSempre: "5",
},
    loadPosto : () => {
        $.ajax({
            url: "/api/posto/load",
            method: "POST",
            contentType: "application/json",
            success({postosEspaco}) {
                let postos_espaco = $('[list="posto"]');
                postosEspaco.forEach(({ funct_load_posto : { posto_designacao, posto_id} }, idx) =>{
                    postos_espaco.append(`<li data-id="${posto_id}" class="stgl" id="posto-${posto_id}">${posto_designacao}</li>`);
                });
            }
        });
    },
    loadArmazem : () => {
        $.ajax({
            url: "/api/armazem/load",
            method: "POST",
            contentType: "application/json",
            success({armazens}) {
                let espacoList = $('[list="armazens"]');
                armazens.forEach(({ funct_load_espaco : { espaco_nome, espaco_id} }, idx) =>{
                    espacoList.append(`<li data-id="${espaco_id}" class="stgl" id="posto-${espaco_id}">${espaco_nome}</li>`);
                });
            }
        });
    },
    save : () => {
        let { parametrized_uid } = paramentizadoReports?.seleted | {};
        let parametrized_name = $("#reportName").val();
        let { groups: parametrized_groups, columns: parametrized_columns, filters: _filters, orders, windows_function_key, headers, source: parametrized_source } = paramentizadoReports.object;

        let grants = $('[list="armazens"], [list="posto"]').find("li.active").map(function (){
            let {id} = $(this).data();
            return id
        }).get()

        if(!parametrized_name){
            return;
        }

        if(!parametrized_columns){
            return;
        }

        if(!grants.length){
            return;
        }

        let { totalColumnsWeight, listFormats} = report;

        let filters = _filters.map(({ column: filter_column, key, opr: filter_opr, value: filter_basevalue } ) => {
            let element = $(`div[list="filter"] [data-column='${filter_column}']`);
            let { name : filter_name, datatype: filter_type, mask, init, src, rename, mode: filter_mode, format, source, func} = element.data() || {};
            let {id: filter_valuemode} = element.find(`ul li.active`).data();

            return {
                filter_name,
                filter_props: {
                    key,
                    rename,
                    mask,
                    init,
                    src,
                    format,
                    source,
                    func
                },
                filter_grants: grants,
                filter_column,
                filter_type,
                filter_opr,
                filter_mode,
                filter_basevalue,
                filter_valuemode
            }
        })

        $.ajax({
            url: "/api/report/parametrized/sets",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                filters,
                parametrized_grants: grants,
                parametrized_props: {
                    orders,
                    listFormats,
                    windows_function_key,
                    totalColumnsWeight,
                    headers,
                },
                parametrized_uid,
                parametrized_name,
                parametrized_source,
                parametrized_columns,
                parametrized_groups
            }),
            success({result, message}) {
                if(!result){
                    xAlert("Relatório", message, "error");
                    return
                }

                paramentizadoReports.ready = false;
                xAlert("Relatório", "Operação efetuada sucesso!");
                let { load } = paramentizadoReports; load();
                $("#xModalSaveReport").removeClass("show")
            }
        })
    },
    load : () => {
        $.ajax({
            url: "/api/report/parametrized/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                _grants: "" || undefined
            }),
            success({data: list}) {
                paramentizadoReports.list = list;
                let listElement = $(`[list="report-paramentidado"]`).empty()
                list.forEach(({parametrized_name, parametrized_uid}, index) => {
                    listElement.append(`<li data-id="${parametrized_uid}" data-index="${index}" class="tgl" >${parametrized_name || "No name"}</li>`)
                })
            }
        })
    },
    loadFilterReport : (id) => {
        $.ajax({
            url: "/api/report/parametrized/load/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                _parametrized_uid: id
            }),
            success({data: list}) {
                let { loadFilterSelectData, types: { DatadoProcessamento, RelativoaDataAtual, ValorAtual, PedirSempre}} = paramentizadoReports;
                let listFiterData = $('[list-load="filter"]').empty();
                list.forEach(({ filter_valuemode, filter_value, filter_column, filter_name, filter_opr, filter_props: { key, format, src, source }, filter_type, filter_mode }) => {
                    let disabled = (DatadoProcessamento === filter_valuemode || ValorAtual === filter_valuemode || RelativoaDataAtual === filter_valuemode);
                    if (format === "select") {
                        listFiterData.append(` <div valuemode="${filter_valuemode}" class="xselect w100" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}"
                       column="${filter_column}" opr="${filter_opr}" key="${key}"  mode="${filter_mode}">
                       <input ${PedirSempre !== filter_valuemode.toString() ? " _noObrigatory='true' class='_noObrigatory' " : ""} disabled="${disabled}" type="text" readOnly>
                           <label>${filter_name}</label>
                           <ul id="v2filtro_${filter_name.replaceAll(" ", "")}"></ul>
                      </div>`);
                        if (src === "db") {
                            loadFilterSelectData($(`[id="v2filtro_${filter_name.replaceAll(" ", "")}"]`), source, filter_value);
                        }
                    } else if (["date", "timestamp", "timestamptz"].includes(format)) {
                        listFiterData.append(`<div valuemode="${filter_valuemode}" class="xinput w100" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}" column="${filter_column}"
                       opr="${filter_opr}" key="${key}" mode="${filter_mode}">
                                   <input ${PedirSempre !== filter_valuemode.toString() ? " _noObrigatory='true' class='_noObrigatory' " : ""} disabled="${disabled}" value="${(filter_value || "").stringToDateEn().getDatePt()}" data-inputmask-alias="dd-mm-yyyy" data-val="true" type="text"
                                       placeholder="${filter_name}">
                                   <label>${filter_name}</label>
                               </div>`);
                        $('[data-inputmask-alias]').inputmask();
                    } else {
                        listFiterData.append(`<div valuemode="${filter_valuemode}" class="xinput w100 grow-1" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}" column="${filter_column}"
                       opr="${filter_opr} "key="${key}" mode="${filter_mode}">
                                       <input ${PedirSempre !== filter_valuemode.toString() ? " _noObrigatory='true' class='_noObrigatory' " : ""} disabled="${disabled}" value="${filter_value || ""}" type="text" placeholder="${filter_name}">
                                       <label>${filter_name}</label>
                                   </div>`);
                    }

                })
            }
        })
    },
    loadFilterSelectData: (element, source, value) => {
        $.ajax({
            url: "/api/report/source/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({source: source}),
            success(e) {
                e.filterData.forEach(({ data : { id, label }}) =>{
                    let active = (value?.toString?.() === id.toString()) ? "active" : "";
                    if(!!active){
                        element.parents(".xselect").find("input").val(label);
                    }
                    element.append(`<li class="tgl ${active}" value_uuid="${id}">${label}</li>`);
                });
            }
        });
    }
}


$("#SaveReport").on("click", function (){
    let {save} = paramentizadoReports; save();
})

$("[xModalSaveReport]").on("click", function (){
    let {ready} = paramentizadoReports;
    let {length} = $('div[list="filter"] [data-name]');
    if(!length || !ready){
        xAlert("Relatório", "Configure um relatório primeiramente!", "warning");
        return
    }

    let tipo_relatorios = $("#tipo_relatorios").find("li.active").text();
    $(`[id="reportName"]`).val(tipo_relatorios)
    $("#xModalSaveReport").addClass("show");
})

$('[list="report-paramentidado"]').on("mousedown", "li", function (){
    let {id, index} = $(this).data();
    let {loadFilterReport} = paramentizadoReports; loadFilterReport(id);
    paramentizadoReports.seleted = paramentizadoReports.list[index];
})

$("#loadReport").on("click", function (){

    let {types : { PedirSempre} ,seleted : { parametrized_name, parametrized_groups: groups, parametrized_source: source, parametrized_columns: columns, parametrized_props : { windows_function_key, orders, listFormats, totalColumnsWeight, headers }}} = paramentizadoReports;
    paramentizadoReports.report = true;
    $("#totalEntriesReport").html(parametrized_name);
    let errorPrienchimento = false;

    let filters = $('[list-load="filter"]').find(".xselect, .xinput").map(function () {
        let rt = {};
        if($(this).attr("mode") !== "-1"){
            rt = {
                valuemode: $(this).attr("valuemode"),
                column: $(this).attr("column"),
                opr: $(this).attr("opr"),
                mode: $(this).attr("mode"),
                key: $(this).attr("key"),
                value: ($(this).hasClass("xselect") ? $(this).find("li.active").attr("value_uuid") : report.getInputFilterValue($(this)))
            };
        } else {
            rt = {
                valuemode: $(this).attr("valuemode"),
                column: $(this).attr("column"),
                opr: $(this).attr("opr"),
                key: $(this).attr("key"),
                value: ($(this).hasClass("xselect") ? $(this).find("li.active").attr("value_uuid") : report.getInputFilterValue($(this)))
            }
        }

        if(rt.valuemode === PedirSempre && !rt.value){
            $(this).find("input").focus();
            errorPrienchimento = true;
        }

        return rt;
    }).get();

    if(errorPrienchimento){
        xAlert("Relatório", "Por favor, preencha campos obrigátorios!", "warning");
        return
    }

    report.listFormats = listFormats;
    report.totalColumnsWeight = totalColumnsWeight;
    paramentizadoReports.objectView = {
        windows_function_key,
        source,
        columns,
        filters,
        groups,
        orders
    }
    paramentizadoReports.headers = headers;
    $(`#tipo_relatorios li[source='${source}']`).click();
    $("#grupos_colunas_relatorio li").removeClass("active");
    $("#colunas_relatorio li").removeClass("active").attr("newOrder", 99999);
    columns.forEach(({key}, index) => {
        let li = $(`#colunas_relatorio li[key='${key}']`);
        if(li) {
            li.addClass("active").attr("newOrder", index);
        }
    });

    groups.forEach(({key}, index) => {
        let li = $(`#grupos_colunas_relatorio li[key='${key}']`);
        if(li) {
            li.addClass("active").attr("newOrder", index);
        }
    });

    let shortData = ({li, listas}) => {

        // Converte a coleção jQuery em um array para que possamos classificá-lo
        const listaArray = li.get();

        // Classifique os elementos com base no valor do atributo "newOrder"
        listaArray.sort((a, b) => {
            const valorA = parseInt($(a).attr("newOrder"));
            const valorB = parseInt($(b).attr("newOrder"));
            return valorA - valorB;
        });

        // Adiciona os elementos ordenados de volta à lista
        listas.append(listaArray);
    }

    shortData({
        li: $("#colunas_relatorio li[newOrder]"),
        listas: $("#colunas_relatorio")
    });

    shortData({
        li: $("#grupos_colunas_relatorio li[newOrder]"),
        listas: $("#grupos_colunas_relatorio")
    });

    setTimeout(() => {
        report.listFormats = listFormats;
        report.totalColumnsWeight = totalColumnsWeight;
        paramentizadoReports.objectView = {
            windows_function_key,
            source,
            columns,
            filters,
            groups,
            orders
        }
        paramentizadoReports.headers = headers;

    pagination.get_amount_item_page["body-report-list"] = {
        value_por_lado: 4,
        load: report.filtrar
    }

    pagination.create_pagination("body-report-list", report.offset, report.limit).then(() => {
        $("#xModalLoadReport").removeClass("show");
    })
        .catch();
        pagination.get_amount_item_page["body-report-list"] = {
            value_por_lado: 4,
            load: report.filtrar
        }
        pagination.create_pagination("body-report-list", report.offset, report.limit).then().catch();
    })
})

var {loadPosto, loadArmazem, load} = paramentizadoReports;

loadPosto();
loadArmazem();
load()
