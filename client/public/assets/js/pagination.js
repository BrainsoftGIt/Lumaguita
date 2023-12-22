var pagination = {
    page : 1,
    limit : 100,
    page_total : [],
    page_selected : [],
    get_amount_item_page: [],
    get_quantidade_item_por_pagina_by_id: {},
    create_pagination: async function (key, pageNumber, limite = 100) {
        let totaldata = await pagination.get_amount_item_page[key].load(limite, pageNumber);
        totaldata = totaldata || 1;

        let total_no_arendodado = Math.trunc(totaldata / limite);
        let total_arendodado = totaldata / limite;
        let totalPage = ((total_arendodado !== total_no_arendodado) ? (total_no_arendodado + 1) : total_no_arendodado);

        this.page_total[key] = totalPage;
        this.page_selected[key] = pageNumber;

        let div_pagination = $("[ref='" + key + "'].pagination_master");
        div_pagination.find(".page-k").remove();

        $(`[ref='${key}'] .totalpagina`).text(totalPage);
        $(`[ref='${key}'] .atualpagina`).text(pageNumber);

        for (let i = 0; i < totalPage; i++) {
            let noEndNoBegin = (i > 0 && i + 1 < totalPage)
            let page = `<li noEndNoBegin="${noEndNoBegin}" pageNumber="$i" class="page-item ${((i+1 === pageNumber) ? "active" : "")}  page-k">$i</li>`;
            page = page.replace("$i", (i + 1).toString());
            page = page.replace("$i", (i + 1).toString());
            div_pagination.find(".pagination-add").before(page);
        }

        this.alter_pages_vist(pageNumber, key)
        this.test_pagination_status(key)
    },
    alter_pages_vist : function (number, key) {
        let pages = $("[ref='"+key+"'].pagination_master");
        let totalpage = this.page_total[key];
        let value_por_lado = pagination.get_amount_item_page[key].value_por_lado;
        let mais5Value = value_por_lado + number;
        let menos5Value = number - value_por_lado;
        let inicial_view_page = ((menos5Value < 1) ? 1 : menos5Value);
        let final_view_page = mais5Value;
        final_view_page += inicial_view_page - number + value_por_lado;

        if(final_view_page > totalpage){
            inicial_view_page -= (final_view_page-totalpage);
            final_view_page = totalpage;
        }

        pages.find("li[noEndNoBegin='true']").hide();
        for( let i = inicial_view_page ; i <= final_view_page; i++){
            pages.find("li[noEndNoBegin='true'][pageNumber='"+i+"']").show();
        }
    },
    test_pagination_status : function (key) {
        let pagination = $("[ref='"+key+"'].pagination_master");
        if (this.page_selected[key] === 1 && this.page_total[key] === 1) {
            pagination.find(".forward, .backward, .page-k").addClass("disabled");
            pagination.hide();
        } else if (this.page_selected[key] === this.page_total[key]) {
            pagination.find(".forward").addClass("disabled",);
            pagination.find(".backward").removeClass("disabled");
            pagination.show();
        } else if (this.page_selected[key] === 1) {
            pagination.find(".backward").addClass("disabled");
            pagination.find(".forward").removeClass("disabled");
            pagination.show();
        } else {
            pagination.find(".forward, .backward").removeClass("disabled");
            pagination.show();
        }
    }
}


$("*").on("click", ".pagination_master .page-k", async function (e) {
    $(this).addClass("active").siblings().removeClass("active");
    e.stopPropagation()
    let key = $(this).parents(".pagination_master").attr("ref");
    pagination.page_selected[key] = Number($(this).text());
    let pageNumber = pagination.page_selected[key]

    await pagination.create_pagination(key, pageNumber, pagination.limit);
}).on("click", ".pagination_master .forward", function (e) {
    if(!$(this).hasClass("disabled")) {
        let key = $(this).parents(".pagination_master").attr("ref");
        let next = pagination.page_selected[key] + 1;
        if(next > pagination.page_total[key]){
            return
        }
        $(this).parents(".pagination_master").find("li.page-k[pageNumber='" + next + "']").click();
    }
    e.stopPropagation();
}).on("click", ".pagination_master .backward", function (e) {
    if(!$(this).hasClass("disabled")) {
        let key = $(this).parents(".pagination_master").attr("ref");
        let previous = pagination.page_selected[key] - 1;
        if(previous < 1){
            return
        }
        $(this).parents(".pagination_master").find("li.page-k[pageNumber='" + previous + "']").click();
    }
    e.stopPropagation();
});
