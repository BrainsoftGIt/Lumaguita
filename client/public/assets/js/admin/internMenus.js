const addInterMenus = function (typeMenu, code) {
    let menus_internos = $("[menus_internos]");
    menus_internos.empty();
    acesso.menusFaturasGuias.forEach((value) =>{
        value = acesso.showConfig ? value : value.data;
        if(typeMenu === "fatura"){
            if(value.menu_codigo === "maguita.fatura" || value.menu_codigo === "maguita.proforma" || value.menu_codigo === "maguita.notacredito")
                menus_internos.append(`<li link="${value.menu_link}" code="${value.menu_codigo}" tipo="fatura">${value.menu_nome}</li>`);
        }
        else{
            if(value.menu_codigo === "maguita.entrada.artigos" || value.menu_codigo === "maguita.saida.artigos")
                menus_internos.append(`<li link="${value.menu_link}" code="${value.menu_codigo}" tipo="guia">${value.menu_nome}</li>`);
        }
    });
    if(menus_internos.find("li").length > 0){
        menus_internos.find(`li[code="${code}"]`).addClass("active");
    }
}
$("body").on("click", "[menus_internos] li", function () {
    $(this).addClass('active').siblings().removeClass('active');
    const type = $(this).attr("tipo");
    const code = $(this).attr("code");
    $(".div-include-pages").empty().load($(this).attr("link"), function () {
        addInterMenus(type, code);
    });
});