
var report = {
    config: null,
    list: [],
    totalColumnsWeight: 0,
    listFormats: [],
    column: null,
    listTotalValues: [],
    listDateRepresentation: [],
    selectedReport: null,
    groups: [],
    limit: 100,
    offset: 1,
    firstColumnWeight: 1.4,
    function_key: ["sum"],
    init(){
       report.loadConfigs();
       report.loadDataRepresentation();
    },
    loadDataRepresentation(){
        $.ajax({
            url: "/api/date/representation",
            method: "GET",
            contentType: "application/json",
            success(e) {
                let date_repres = $("#date_repres");
                report.listDateRepresentation = [];
                report.listDateRepresentation = e.repres;
                date_repres.empty();
                report.listDateRepresentation.forEach((rep) =>{
                    date_repres.append(`<li class="tgl" mask="${rep.mask}">${rep.description}</li>`);
                });
            }
        });
    },
    loadConfigs(){
        $.ajax({
            url: "/api/report/type/data",
            method: "GET",
            contentType: "application/json",
            success(e) {
                report.config = e.configs;
                let tipo_relatorios = $("#tipo_relatorios");
                tipo_relatorios.empty();
                report.config.forEach((conf) =>{
                    tipo_relatorios.append(`<li class="tgl" source="${conf.report_source}">${conf.report_name}</li>`);
                });
                tipo_relatorios.find("li").eq(0).click();
                if($("#colunas_relatorio").find("li.active").length >= 2) {
                    $("#filterReport").click();
                }
            }
        });
    },
    loadFilterSelectData(element, source){
        $.ajax({
            url: "/api/report/source/filter",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({source: source}),
            success(e) {
                e.filterData.forEach((fildata) =>{
                   $("#filtro_"+element).append(`<li class="tgl" value_uuid="${fildata.data.id}">${fildata.data.label}</li>`);
                });
            }
        });
    },
    showSelectedFilter(filter){
        let listFiterData = $("[listFiterData]");
        let saveList = $("[list='filter']");
        if(filter.attr("format") === "select"){
            listFiterData.append(` <div class="xselect w100" dataType="${filter.attr("datatype")}" name="${filter.text().replaceAll(" ", "")}" 
                column="${filter.attr("column")}" opr="${filter.attr("opr")}" key="${filter.attr("key")}"  mode="${filter.attr("mode")}">
                <input type="text" readOnly>
                    <label>${filter.text()}</label>
                    <ul id="filtro_${filter.text().replaceAll(" ", "")}">      
                    </ul>
            </div>`);
            if(filter.attr("src") === "db"){
                report.loadFilterSelectData(filter.text().replaceAll(" ", ""), filter.attr("source"));
            }
        }
        else if( ["date", "timestamp", "timestamptz" ]. includes( filter.attr( "format" ) )){
            listFiterData.append(`<div class="xinput w100" dataType="${filter.attr("datatype")}" name="${filter.text().replaceAll(" ", "")}" column="${filter.attr("column")}" 
                opr="${filter.attr("opr")}" key="${filter.attr("key")}"  mode="${filter.attr("mode")}">
                            <input data-inputmask-alias="dd-mm-yyyy" data-val="true" type="text"
                                placeholder="${filter.text()}">
                            <label>${filter.text()}</label>
                        </div>`);
            $('[data-inputmask-alias]').inputmask();
        }
        else{
            listFiterData.append(`<div class="xinput w100 grow-1" dataType="${filter.attr("datatype")}" name="${filter.text().replaceAll(" ", "")}" column="${filter.attr("column")}" 
            opr="${filter.attr("opr")} "key="${filter.attr("key")}"  mode="${filter.attr("mode")}">
                            <input  type="text" placeholder="${filter.text()}">
                            <label>${filter.text()}</label>
                        </div>`);
        }

        let atrs = {
            name : filter.text().replaceAll(" ", ""),
            column: filter.attr("column"),
            opr : filter.attr("opr"),
            key: filter.attr("key"),
            mode: filter.attr("mode") || undefined,
            datatype: filter.attr("datatype"),
            format: filter.attr("format") || undefined,
            src: filter.attr("src") || undefined,
            rename: filter.attr("rename") || undefined,
            mask: filter.attr("mask") || undefined,
            source: filter.attr("source") || undefined,
        }

        let listOption = [
            {
                "value": "1",
                "label": "Valor Atual"
            },
            {
                "value": "2",
                "label": "Data do processamento"
            },
            {
                "value": "3",
                "label": "Relativo a data atual"
            },
            {
                "value": "4",
                "label": "Pedir"
            },
            {
                "value": "5",
                "label": "Pedir sempre"
            }
        ];

        saveList.append(`
            <div class="xselect flutuate w100" ${ Object.keys(atrs).map(( key ) => { return `data-${key}='${atrs[key]}'` }).join(" ") } >
                <input type="text" readonly  placeholder="_">
                <label>${filter.text()}</label>
                <ul id="${atrs.key}-key">
                    ${ listOption.map(({value, label}) => { return ![ "date", "timestamp", "timestamptz" ].includes( filter.attr( "format" )) && (value === "3" || value === "2")  ? "" : `<li data-id="${value}">${label}</li>` }).join(" ") } 
                </ul>
            </div>`)
    },
    getInputFilterValue(element){
        if(element.find("input:text").attr("data-val")) return alterFormatDate(element.find("input:text").val());
        else return element.find("input:text").val().trim();
    },
    get selectedFilter(){
        report.totalColumnsWeight = 0;
        report.listFormats = [];
        let headers = [];
        let object = {
            windows_function_key: report.function_key,
            source: $("#tipo_relatorios").find("li.active").attr("source"),
            columns: [],
            filters: [],
            groups: [],
            orders: []
        };
        $("#colunas_relatorio").find("li.active").each(function () {
            if( report.groups.findIndex(value => value.main_column === $(this).attr("column")) === -1){
                report.totalColumnsWeight = Number(report.totalColumnsWeight) + Number($(this).attr("weight"));
                report.listFormats.push({format: $(this).attr("format"), name: $(this).attr("name")});
                headers.push({name: $(this).attr("name"), format: $(this).attr("format"), rename: $(this).attr("name")});
                if($(this).attr("mask")){
                    object.columns.push({
                        column: $(this).attr("column"),
                        key: $(this).attr("key"),
                        init: $(this).attr("init"),
                        name: $(this).attr("name"),
                        type: "column",
                        mask: $(this).attr("mask")
                    });
                }
                else{
                    object.columns.push({
                        column: $(this).attr("column"),
                        key: $(this).attr("key"),
                        init: $(this).attr("init"),
                        name: $(this).attr("name"),
                        type: "column"
                    });
                }
                object.orders.push({
                    column: $(this).attr("column"),
                    orientation: $(this).attr("ordem"),
                    priority: $(this).attr("priority")
                });
            }
            else $(this).removeClass("active");
        });
        report.groups.forEach((group) =>{
            report.totalColumnsWeight = Number(report.totalColumnsWeight) + Number(group.weight);
            report.listFormats.push({format: group.format, name: group.rename});
            headers.push({name: group.name, format: group.format, rename: group.rename});
            object.groups.push({
                column: group.column,
                key: group.key,
                func: group.func,
                rename: group.rename
            });
        });
        $("#grupos_colunas_relatorio").find("li.active").each(function () {
            report.totalColumnsWeight = Number(report.totalColumnsWeight) + Number($(this).attr("weight"));
            report.listFormats.push({format: $(this).attr("format"), name: $(this).attr("rename")});
            headers.push({name:  $(this).attr("name"), format: $(this).attr("format"), rename: $(this).attr("rename")});
            object.groups.push({
                column: $(this).attr("column"),
                key: $(this).attr("key"),
                func: $(this).attr("func"),
                rename: $(this).attr("rename")});
        });
        $("[listFiterData]").find(".xselect, .xinput").each(function () {
            if($(this).attr("mode") !== "-1"){
                object.filters.push({
                    column: $(this).attr("column"),
                    opr: $(this).attr("opr"),
                    mode: $(this).attr("mode"),
                    key: $(this).attr("key"),
                    value: ($(this).hasClass("xselect") ? $(this).find("li.active").attr("value_uuid") : report.getInputFilterValue($(this)))
                });
            }
            else{
                object.filters.push({
                    column: $(this).attr("column"),
                    opr: $(this).attr("opr"),
                    key: $(this).attr("key"),
                    value: ($(this).hasClass("xselect") ? $(this).find("li.active").attr("value_uuid") : report.getInputFilterValue($(this)))
                });
            }
        });
        return {obj: object, headers: headers};
    },
    setColumnsTable(){
        let headerTable = $("[ header-report-list]");
        headerTable.empty();
        let growValue;
        let alignmentFormats = ["money", "date", "int", "timestamp", "code:right", "double", "numeric"]
        $("#colunas_relatorio").find("li.active").each(function () {
            growValue = (Number($(this).attr("weight")) * 10) / report.totalColumnsWeight;
            if(alignmentFormats.includes($(this).attr("format")))
                headerTable.append(`<li grow="${growValue}" title="${$(this).text()}" name="${$(this).text().trim()}" format="${$(this).attr("format")}" column="${$(this).attr("column")}" style="text-align: right;cursor: pointer;" alinhamento="right">${$(this).text()}</li>`);
            else
                headerTable.append(`<li grow="${growValue}" title="${$(this).text()}" name="${$(this).text().trim()}" format="${$(this).attr("format")}" column="${$(this).attr("column")}">${$(this).text()}</li>`);
        });
        $("#grupos_colunas_relatorio").find("li.active").each(function () {
            growValue = (Number($(this).attr("weight")) * 10) / report.totalColumnsWeight;
            if(alignmentFormats.includes($(this).attr("format")))
                headerTable.append(`<li grow="${growValue}" title="${$(this).text()}" name="${$(this).attr("rename")}" format="${$(this).attr("format")}" style="text-align: right;" alinhamento="right">${$(this).attr("name")}</li>`);
            else       headerTable.append(`<li grow="${growValue}" title="${$(this).text()}" name="${$(this).attr("rename")}" format="${$(this).attr("format")}">${$(this).attr("name")}</li>`);
        });
        report.groups.forEach((group) =>{
            growValue = (Number(group.weight) * 10) / report.totalColumnsWeight;
             if(alignmentFormats.includes(group.format))
                headerTable.append(`<li grow="${growValue}" title="${group.name}" name="${group.rename}" format="${group.format}" style="text-align: right" alinhamento="right">${group.name}</li>`);
             else
                 headerTable.append(`<li grow="${growValue}" title="${group.name}" name="${group.rename}" format="${group.format}">${group.name}</li>`);
        });
    },
    setWeightColumns(columnFormat){
        if(columnFormat === "code") return 2.5;
        if(columnFormat === "code:long") return 2.8;
        else if(columnFormat === "name") return 6.2;
        else if(columnFormat === "name:mid") return 5;
        else if(columnFormat === "name:short") return 3.5;
        else if(columnFormat === "money") return 3.8;
        else if(columnFormat === "double") return 4;
        else if(columnFormat === "name:tiny") return 2;
        else if(columnFormat === "numeric") return 4;
        else if(columnFormat === "date") return 3;
        else if(columnFormat === "datetime") return 3;
        else if(columnFormat === "timestamp") return 3;
        else if(columnFormat === "code:right") return 2.5;
        else return 2.3;
    },
    formatValue({value, format}){
        if(value === null) return null;
        let column = report.listFormats.find(value => value.format === format);
        if(column) {
            if (column.format === "money") return value.dc().formatter();
            else if (column.format === "int") return value.dc();
            else return value;
        }
        else return null;
    },
    filtrar(limit, pageNumber){
        return new Promise(resolve => {

            let { objectView: object } =  paramentizadoReports;
            if (!paramentizadoReports.report){
                paramentizadoReports.ready = true;
                object = report.selectedFilter.obj;
                paramentizadoReports.object = object;
            }

            object.limit = limit;
            object.offset = (pageNumber -1) * limit;
            $("body").addClass("loading");
            $.ajax({
                url: "/api/report/filter",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(object),
                success(e) {
                    let total = e?.reportData[0]?.data?.["*_$"]?.["*:count"] || 0;
                    resolve(e?.reportData[0]?.data?.["*_$"]?.["*:count"] || 0);
                    $("body").removeClass("loading");
                    report.setColumnsTable();
                    report.list = [];
                    report.list = e.reportData;
                    const totalColumns = $("[ header-report-list]").find("li").length;
                    if(total < 1) $("#totalEntriesReport").attr("found", "Nada encontrado");
                    else if(total === 1) $("#totalEntriesReport").attr("found", "1 resultado");
                    else $("#totalEntriesReport").attr("found", total+" resultados");

                    let reportBody = $("[body-report-list]");
                    reportBody.empty();
                    $("#xModalMasterFilter .hideTarget").click();
                    let columnIndex;
                    let grow;
                    let headerTable = $("[ header-report-list]");
                    report.list.forEach((rep, i) =>{
                        reportBody.append(`<ul></ul>`);
                        columnIndex = 0;
                        Object.entries(rep.data).forEach(([key, value]) => {
                            grow = headerTable.find("li").eq(columnIndex).attr("grow");
                            if(rep.data.hasOwnProperty(headerTable.find("li").eq(columnIndex).attr("name"))){
                                let headerValue = report.formatValue({value: rep.data[headerTable.find("li").eq(columnIndex).attr("name")],
                                        format: headerTable.find("li").eq(columnIndex).attr("format")});
                                if(headerTable.find("li").eq(columnIndex).attr("alinhamento")){
                                    reportBody.find("ul:last").append(`<li grow="${grow}" title="${(headerValue || "")}" style="text-align: ${headerTable.find("li").eq(columnIndex).attr("alinhamento")}">${(headerValue || "")}</li>`);
                                }
                                else{
                                    reportBody.find("ul:last").append(`<li grow="${grow}" title="${(headerValue || "")}" >${(headerValue || "")}</li>`);
                                }

                            }
                            columnIndex = columnIndex + 1;
                        });
                    });
                    columnIndex = 0;
                    reportBody.append(`<ul></ul>`);
                    for (let i = 0;i<totalColumns;i++){
                        grow = headerTable.find("li").eq(columnIndex).attr("grow");
                        let footerValue = report.list[0].data["*_$"][headerTable.find("li").eq(columnIndex).attr("name").trim()+":"+report.function_key[0]];
                        if(headerTable.find("li").eq(columnIndex).attr("format") === "code"){
                            footerValue = null;
                        }
                        if(headerTable.find("li").eq(columnIndex).attr("alinhamento") )
                             reportBody.find("ul:last").append(`<li grow="${grow}" style="font-weight: bold;text-align: right" class="report_footer" filled="${(footerValue ? "y" : "n")}">${(footerValue ? footerValue.dc().formatter() : "")}</li>`);
                        else
                            reportBody.find("ul:last").append(`<li grow="${grow}" style="font-weight: bold;" class="report_footer" filled="${(footerValue ? "y" : "n")}">${(footerValue ? footerValue.dc().formatter() : "")}</li>`);

                        columnIndex = columnIndex + 1;
                    }
                    if(reportBody.find("li[filled='y']").length > 0){
                        reportBody.find("ul:last").attr("title", $("#footer_values_type").find("li.active").text()+" dos valores das colunas");
                    }
                    xTableGenerate();
                }
            });
        });

    },
    showTotalColumnsSelected(){
        let totalColumns =  $("#colunas_relatorio li.active").length + $("#grupos_colunas_relatorio li.active").length;
        if(totalColumns === 0) $("#colunas_relatorio").parents(".options").find("b").eq(0).text("Colunas");
        else if(totalColumns === 1) {
            $("#colunas_relatorio").parents(".options").find("b").eq(0).text("Visão - 1 coluna selecionada");
            $("#desselecionarColunas").removeClass("active");
        }
        else{
            $("#colunas_relatorio").parents(".options").find("b").eq(0).text("Visão - "+totalColumns+" colunas selecionadas");
            $("#desselecionarColunas").removeClass("active");
        }
    },
    export(){

        let { objectView: object, headers} =  paramentizadoReports;
        if (!paramentizadoReports.report) {
            object = report.selectedFilter.obj;
            headers = report.selectedFilter.headers;
        }

        $("body").addClass("loading");
        $.ajax({
            url: "/api/report/export",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({obj: object, headers: headers,
                report_name: $("#tipo_relatorios li.active").text()}),
            success(e) {
                $("body").removeClass("loading");
                open("/api/report/download/"+e.file);
            }
        });
    },
    iExport: () => {
        if(!validation1($("#xModalExportFileFinanca input"))){
            xAlert("Exporta relatório imposto", "Por favor preencha corretamente as datas!", "error");
            return
        }

        $("body").addClass("loading");
        $.ajax({
            url: "/api/report/export/imposto",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                arg_datainicio: $("#financa_report_start").val().stringToDate().getDateEn(),
                arg_datafim: $("#financa_report_end").val().stringToDate().getDateEn(),
            }),
            success(ordenList) {
                $("body").removeClass("loading");
                report.iOrdenList = ordenList;
                let sumatorio = 0;
                $("[listIReport]").empty();
                Object.keys(ordenList).forEach((key) => {
                    ordenList[key].forEach(({desc_itens, total_valor_itens, taxa_aplicavel_itens, quant_itens, numero_documento_origem}) => {
                        $("[listIReport]").append(`<ul>
                                <li>${ordenList[key][0].documento_numero ?? "N/A"}</li>
                                <li>${ordenList[key][0].documento_data ?? "N/A"}</li>
                                <li>${ordenList[key][0].nif_consumidor ?? "N/A"}</li>
                                <li>${ordenList[key][0].tserie_code || "N/A"}${ordenList[key][0].documento_serie ?? ""}</li>
                                <li>${quant_itens ?? "N/A"}</li>
                                <li>${desc_itens ?? "N/A"}</li>
                                <li>${total_valor_itens ?? "N/A"}</li>
                                <li>${taxa_aplicavel_itens ?? "N/A"}</li>
                                <li>${numero_documento_origem ?? "N/A"}</li>
                            </ul>`);
                        sumatorio += total_valor_itens;
                    })
                })

                $("[listIReport]").append(`<ul>
                                <li>${"Total"}</li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li>${sumatorio}</li>
                                <li></li>
                                <li></li>
                            </ul>`);
                xTableGenerate();
            }
        });
    },
    doIExport : () => {
        let {iOrdenList: ordenList} = report;
        if(!ordenList){
            return;
        }

        const json = Object.keys(ordenList).map((key) => {
            return {
                "numDocumento": ordenList[key][0].documento_numero ?? "",
                "dtEmissaoDocumento": ordenList[key][0].documento_data ?? "",
                "nifConsumidor": ordenList[key][0].nif_consumidor ?? "",
                "numSerieDocumento": `${ordenList[key][0].tserie_code ?? ""}${ordenList[key][0].documento_serie ?? ""}`,
                "tbItensDocumentoGerados": ordenList[key].map(({tipo_documento_origem, data_documento_origem, codigo_isento, desc_itens, total_valor_itens, taxa_aplicavel_itens, quant_itens, numero_documento_origem}) =>  {
                    return {
                        "codigoIsencao": codigo_isento ?? "",
                        "quantItens": quant_itens ?? "",
                        "descItens": desc_itens ?? "",
                        "valorItens": total_valor_itens ?? "",
                        "valorTaxaAplicavel": taxa_aplicavel_itens ?? "",
                        "tbDocumentoOrigems": (!!numero_documento_origem) ? [
                            {
                                "dtDocumentoOrigem": data_documento_origem ?? "",
                                "numDocumentoOrigem": numero_documento_origem ?? "",
                                "siglaTipoDocumentoEmissao": tipo_documento_origem
                            }
                        ] : []
                    }
                })
            }
        })

        let data = JSON.stringify(json, null, 2);
        const blob = new Blob([data], { type: 'application/javascript' });
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('target', "_blank")
        a.setAttribute('download', 'upload_documentos_v1.5.json');
        a.click()
    }
};

report.init();
$("#tipo_relatorios").on("click", "li", function () {
    let filtros_relatorio = $("#filtros_relatorio");
    let colunas_relatorio = $("#colunas_relatorio");
    let grupos_colunas_relatorio = $("#grupos_colunas_relatorio");
    filtros_relatorio.empty();
    grupos_colunas_relatorio.empty();
    colunas_relatorio.empty();
    $("[listFiterData]").empty();
    $("#totalEntriesReport").text($(this).text());
    report.limit = 100;
    report.offset = 1;
    report.groups = [];
    report.selectedReport = report.config.filter(conf => conf.report_source === $(this).attr("source"));
    report.selectedReport[0].configs.forEach((filt) =>{
         if(filt.type === "filter")
            filtros_relatorio.append(`<li datatype="${filt.dataType}" column="${filt.column}" format="${filt.format}" name="${filt.name}" source="${filt.source}" 
                    key="${filt.key}" src="${filt.src}" opr="${filt.opr}" mode="${(filt.mode || "-1")}">${filt.name}</li>`);
         else if(filt.type === "column"){
             let dateRepresentation = report.listDateRepresentation.find(value => value.type.includes(filt.format));
             if(dateRepresentation){
                 colunas_relatorio.append(`<li datatype="${filt.dataType}" name="${filt.name}" class="${(filt.init ? "active" : "")}" column="${filt.column}" date_description="${dateRepresentation.description}"
                mask="${dateRepresentation.mask}" init="${filt.init}" title="Faça duplo para alterar as configurações da coluna" priority="100" ordem="asc"
                format="${filt.format}" key="${filt.key}" weight="${report.setWeightColumns(filt.format)}" subformat="">${filt.name}
                 </li>`);
             }
             else{
                 colunas_relatorio.append(`<li datatype="${filt.dataType}" name="${filt.name}" class="${(filt.init ? "active" : "")}" column="${filt.column}" priority="100" ordem="asc"
                    title="Faça duplo para alterar as configurações da coluna"
                     init="${filt.init}" format="${filt.format}" key="${filt.key}" weight="${report.setWeightColumns(filt.format)}" subformat="">${filt.name}
                 </li>`);
             }
         }
         else{
             if(!report.selectedReport[0].configs.find(value => value.type === "column" && value.column === filt.column)){
                 grupos_colunas_relatorio.append(`<li datatype="${filt.dataType}" name="${filt.name}" column="${filt.column}" class="${(filt.init ? "active" : "")}" func="${filt.func}" 
                   rename="${filt.rename}" key="${filt.key}" weight="${report.setWeightColumns(filt.format)}" format="${filt.format}">${filt.name}</li>`);
             }
         }
     });
    grupos_colunas_relatorio.parents(".options").find("b").eq(1).text((grupos_colunas_relatorio.find("li").length === 0 ? "" : "Agregações independentes"));
    report.showTotalColumnsSelected();
    colunas_relatorio.sortable();
    grupos_colunas_relatorio.sortable();
    filtros_relatorio.sortable();
});
$("#filtros_relatorio").on("click", "li", function () {
    $(this).toggleClass("active");
    if($(this).hasClass("active") && $("[listFiterData]").find(`div[name=${$(this).text().replaceAll(" ", "")}]`).length === 0)
        report.showSelectedFilter($(this));
    else {
        $("[listFiterData]").find(`div[name=${$(this).text().replaceAll(" ", "")}]`).remove();
        $('[list="filter"]').find(`[data-name=${$(this).text().replaceAll(" ", "")}]`).remove();
    }
});
$("#colunas_relatorio").on("click", "li", function () {
    $(this).toggleClass("active");
    report.column = $(this).attr("column");
    $("#grupos_colunas_relatorio").find("li").each(function () {
        if($(this).attr("column") === report.column){
            $(this).removeClass("active");
        }
    });
   report.showTotalColumnsSelected();
}).on("dblclick", "li", function () {
    report.column = $(this).attr("column");
    const agregations = report.selectedReport[0].configs.filter(value => value.type === "group" && value.column === report.column);
    let coluna_agregados = $("#coluna_agregados");
    let coluna_ordem = $("#coluna_ordem");
    coluna_agregados.empty();
    $("#columnStatus").removeClass("active");
    $("#coluna_agregados").parents(".xcheck").find("p").text("");
    coluna_ordem.find(`li`).removeClass("active");
    coluna_ordem.find(`li[ordem="${$(this).attr("ordem")}"]`).addClass("active");
    coluna_ordem.parents(".xselect").find("input:text").val(  coluna_ordem.find(`li.active`).text());
    agregations.forEach(function (value) {
         if(report.groups.find(group => group.key === value.key && group.main_column === report.column)){
             coluna_agregados.append(`<li class="stgl active" name="${value.name}" column="${value.column}" func="${value.func}"
            rename="${value.rename}" key="${value.key}" weight="${report.setWeightColumns(value.format)}" format="${value.format}">${value.label}</li>`);
         }
         else{
             coluna_agregados.append(`<li class="stgl" name="${value.name}" column="${value.column}" func="${value.func}"
            rename="${value.rename}" key="${value.key}" weight="${report.setWeightColumns(value.format)}" format="${value.format}">${value.label}</li>`);
         }
    });
    $("#coluna_prioridade").val($(this).attr("priority"));
    if(agregations.length > 0){
        $("#coluna_agregados").parents(".xcheck").find("p").text("Selecione os agregados.");
    }
    if($(this).attr("mask")){
        $("#date_repres").parents(".xselect").css("display", "");
        $("#date_repres li").removeClass("active")
        $("#xModalColumnConfig input:text").eq(2).val($(this).attr("date_description"));
        $("#date_repres").find(`li[mask="${$(this).attr("mask")}"]`).addClass("active");
    }
    else{
        $("#date_repres").parents(".xselect").css("display", "none");
    }
    if($(this).hasClass("active"))
         $("#columnStatus").addClass("active");

    showTarget("xModalColumnConfig", "Configurações da coluna "+report.column);
});
$("#grupos_colunas_relatorio").on("click", "li", function () {
    $(this).toggleClass("active");
    report.column = $(this).attr("column");
    $("#colunas_relatorio").find("li").each(function () {
        if($(this).attr("column") === report.column){
            $(this).removeClass("active");
        }
    });
    report.showTotalColumnsSelected();
});
$("#filterReport").on("click", async function () {
    let isvalid = true;
    if($("#colunas_relatorio").find("li.active").length === 0){
        xAlert($("#tipo_relatorios").find("li.active").text(), "Selecione colunas para o relatório!", "info");
        return;
    }
    $("[listFiterData]").find(".xselect, .xinput").each(function () {
        if($(this).hasClass("xselect")){
            if($(this).find("li.active").length === 0){
                xAlert($("#tipo_relatorios").find("li.active").text(), "Forneça as informações dos filtros selecionados", "error");
                isvalid =  false;
                return;
            }
        }
        else{
            if($(this).find("input:text").val() === ""){
                $(this).find("input:text").focus();
                xAlert($("#tipo_relatorios").find("li.active").text(), "Forneça as informações dos filtros selecionados", "error");
                isvalid = false;
                return;
            }
        }
    });
    if(isvalid){
        paramentizadoReports.report = false;
        pagination.get_amount_item_page["body-report-list"] = {
            value_por_lado: 4,
            load: report.filtrar
        }
        await pagination.create_pagination("body-report-list", report.offset, report.limit);
    }
});
$("[bt_config]").on("click", function () {
    let selectedColumn = $("#colunas_relatorio").find(`li[name="${report.column}"]`);
    selectedColumn.attr("mask", $("#date_repres").find(`li.active`).attr("mask"));
    selectedColumn.attr("date_description", $("#date_repres").find(`li.active`).text());
    selectedColumn.attr("priority",  $("#coluna_prioridade").val());
    selectedColumn.attr("ordem",  $("#coluna_ordem").find(`li.active`).attr("ordem"));
    let index;
    $("#coluna_agregados li").each(function () {
        index = report.groups.findIndex(value => value.main_column === $(this).attr("column") && value.key === $(this).attr("key"));
        if (index !== -1)
            report.groups.splice(index, 1);
    });
    $("#coluna_agregados li.active").each(function () {
        if(!report.groups.find(value => value.key === $(this).attr("key") && value.main_column === report.column)){
            report.groups.push({
                weight: $(this).attr("weight"),
                column: $(this).attr("column"),
                key: $(this).attr("key"),
                func: $(this).attr("func"),
                rename: $(this).attr("rename"),
                main_column: report.column,
                format: $(this).attr("format"),
                name: $(this).attr("name")
            });
            selectedColumn.removeClass("active");
        }
    });
    $("#xModalColumnConfig .hideTarget").click();
    if($("#columnStatus").hasClass("active")){
        if(!selectedColumn.hasClass("active"))
            selectedColumn.addClass("active");
    }
    else{
        selectedColumn.removeClass("active");
    }
    if(!$("#xModalMasterFilter").hasClass("show")){
        $("[bt_footer_table]").click();
    }
});
$("[export-report-normal]").on("click", function () {
    report.export();
});
$("[export-report-imposto]").on("click", function () {
    report.doIExport();
});
$("[load-report-imposto]").on("click", function () {
    report.iExport();
});
$("[body-report-list]").on("click", ".report_footer", function () {
    let footer_values_type = $("#footer_values_type");
    footer_values_type.find("li").removeClass("active");
    footer_values_type.find(`li[func="${report.function_key[0]}"]`).addClass("active");
    showTarget("xModalFooterValue", "Dados estatísticos no rodapé");
});
$("[bt_footer_table]").on("click", async function () {
     report.function_key[0] = $("#footer_values_type").find("li.active").attr("func");
     $("#xModalFooterValue .hideTarget").click();
     if(!$(".pagination_master").is(":visible")){
         paramentizadoReports.report = false;
         pagination.get_amount_item_page["body-report-list"] = {
             value_por_lado: 4,
             load: report.filtrar
         }
         await pagination.create_pagination("body-report-list", report.offset, report.limit);
     }
     else{
        $(".pagination_master").find(".page-k.active").click();
     }
});
$("[ header-report-list]").on("click", "li", function () {
    if($(this).attr("column")){
        $("#colunas_relatorio").find(`li[column="${$(this).attr("column")}"]`).dblclick();
    }
});
$("#desselecionarColunas").on("click", function () {
    $(this).toggleClass("active");
   if($(this).hasClass("active"))
       $("#colunas_relatorio").find("li").removeClass("active");

   report.showTotalColumnsSelected();
});
$("#footer_values_type").on("click", "li", function () {
    $(this).addClass('active').siblings().removeClass('active');
});

$('[data-inputmask-alias]').inputmask();
