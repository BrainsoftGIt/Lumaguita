var paramentizadoReports = {
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
                    espacoList.append(`<li data-id="${espaco_id}" class="tgl" id="posto-${espaco_id}">${espaco_nome}</li>`);
                });
            }
        });
    },
    save : () => {
        let { parametrized_uid } = paramentizadoReports?.seleted | {};
        let parametrized_name = $("#reportName").val();
        let parametrized_source = $("#tipo_relatorios").find("li.active").attr("source");
        let { groups: parametrized_groups, columns: parametrized_columns, filters: _filters} = paramentizadoReports.object;

        let grants = $('[list="armazens"], [list="posto"]').find("li.active").map(function (){
            let {id} = $(this).data();
            return id
        }).get()

        let filters = _filters.map(({ column: filter_column, key, opr: filter_opr, value: filter_basevalue } ) => {
            let element = $(`div[list="filter"] [data-column='${filter_column}']`);
            let { name : filter_name, datatype: filter_type, mask, init, src, rename, mode: filter_mode, format, source} = element.data() || {};
            let {id: filter_valuemode} = element.find(`ul li.active`).data();

            console.log(grants)
            return {
                filter_name,
                filter_props: {
                    key,
                    rename,
                    mask,
                    init,
                    src,
                    format,
                    source
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
                parametrized_uid,
                parametrized_name,
                parametrized_source,
                parametrized_columns,
                parametrized_groups
            }),
            success({...all}) {
                console.log(all)
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
                let listElement = $(`[list="report-paramentidado"]`)
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
                console.log(list);
                let { loadFilterSelectData } = paramentizadoReports;
                let listFiterData = $('[list-load="filter"]').empty();
                list.forEach(({
                                  filter_basevalue,
                                  filter_column,
                                  filter_date,
                                  filter_espaco_auth,
                                  filter_increment,
                                  filter_name,
                                  filter_opr,
                                  filter_props: { key, format, src, source },
                                  filter_require,
                                  filter_state,
                                  filter_type,
                                  filter_user_id,
                                  filter_mode
                              }) => {

                    console.log({format, src, source, key})
                    if (format === "select") {
                        listFiterData.append(` <div class="xselect w100" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}"
                       column="${filter_column}" opr="${filter_opr}" key="${key}"  mode="${filter_mode}">
                       <input type="text" readOnly>
                           <label>${filter_name}</label>
                           <ul id="v2filtro_${filter_name.replaceAll(" ", "")}"></ul>
                      </div>`);
                        if (src === "db") {
                            loadFilterSelectData($(`[id="v2filtro_${filter_name.replaceAll(" ", "")}"]`), source);
                        }
                    } else if (["date", "timestamp", "timestamptz"].includes(format)) {
                        listFiterData.append(`<div class="xinput w100" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}" column="${filter_column}"
                       opr="${filter_opr}" key="${key}" mode="${filter_mode}">
                                   <input data-inputmask-alias="dd-mm-yyyy" data-val="true" type="text"
                                       placeholder="${filter_name}">
                                   <label>${filter_name}</label>
                               </div>`);
                        $('[data-inputmask-alias]').inputmask();
                    } else {
                        listFiterData.append(`<div class="xinput w100 grow-1" dataType="${filter_type}" name="${filter_name.replaceAll(" ", "")}" column="${filter_column}"
                       opr="${filter_opr} "key="${key}"  mode="${filter_mode}">
                                       <input  type="text" placeholder="${filter_name}">
                                       <label>${filter_name}</label>
                                   </div>`);
                    }
                })
            }
        })
    },
    loadFilterSelectData: (element, source) => {
        $.ajax({
            url: "/api/report/source/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({source: source}),
            success(e) {
                e.filterData.forEach((fildata) =>{
                    element.append(`<li class="tgl" value_uuid="${fildata.data.id}">${fildata.data.label}</li>`);
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
        return
    }

    let tipo_relatorios = $("#tipo_relatorios").find("li.active").text();
    $(`[id="reportName"]`).val(tipo_relatorios)
    $("#xModalSaveReport").addClass("show");
})

$('[list="report-paramentidado"]').on("mousedown", "li", function (){
    let {id} = $(this).data();
    let {loadFilterReport} = paramentizadoReports;
    loadFilterReport(id);
})

var {loadPosto, loadArmazem, load} = paramentizadoReports;

loadPosto();
loadArmazem();
load()
