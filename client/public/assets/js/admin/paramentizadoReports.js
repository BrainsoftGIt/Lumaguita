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
            let { name : filter_name, datatype: filter_type } = element.data() || {};
            let {id: filter_valuemode} = element.find(`ul li.active`).data();
            let filter_mode = "defualt";

            console.log(grants)
            return {
                filter_name,
                filter_props: {
                    key
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
                console.log(list)
            }
        })
    }
}


$("#SaveReport").on("click", function (){
    let {save} = paramentizadoReports; save();
})

$("[xModalSaveReport]").on("click", function (){
    if(!$('div[list="filter"] [data-name]').length || !paramentizadoReports.ready){
        return
    }

    $("#xModalSaveReport").addClass("show");
})

$('[list="report-paramentidado"]').on("mousedown", "li", function (){
    alert("djdhdh")
    let {id} = $(this).data();
    let {loadFilterReport} = paramentizadoReports;
    loadFilterReport(id);
})

var {loadPosto, loadArmazem, load} = paramentizadoReports;

loadPosto();
loadArmazem();
load()
