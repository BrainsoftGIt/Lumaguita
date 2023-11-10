
var acesso = {
    menusFaturasGuias: [],
    showConfig: false,
    init(){
        this.loadMenus();
        window.history.forward();
    },
    menuConfig(){

    },
  loadMenus(){
      $.ajax({
          url: "/api/user/logged/menus",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ type: "login" }),
          success(e) {
            let menuAcessos = $("[menuAcessos]");
            let colaborador_logado_armazens = $("#colaborador_logado_armazens");
            let menus = e.showConfigMenu ? e.dados.auth.acesso : e.grants;
            acesso.showConfig = e.showConfigMenu;
            menuAcessos.html(`<li data-position="-100" class="tgl flex v-ct active" link="../includes/home.html" title="Home" code="main">
                                            <svg enable-background="new 0 0 511.414 511.414" viewBox="0 0 511.414 511.414"><path d="m497.695 108.838c0-6.488-3.919-12.334-9.92-14.8l-225.988-92.838c-3.896-1.6-8.264-1.6-12.16 0l-225.988 92.838c-6.001 2.465-9.92 8.312-9.92 14.8v293.738c0 6.488 3.918 12.334 9.92 14.8l225.988 92.838c3.854 1.583 8.186 1.617 12.14-.001.193-.064-8.363 3.445 226.008-92.837 6.002-2.465 9.92-8.312 9.92-14.8zm-241.988 76.886-83.268-34.207 179.951-78.501 88.837 36.495zm-209.988-51.67 71.841 29.513v83.264c0 8.836 7.164 16 16 16s16-7.164 16-16v-70.118l90.147 37.033v257.797l-193.988-79.692zm209.988-100.757 55.466 22.786-179.951 78.501-61.035-25.074zm16 180.449 193.988-79.692v257.797l-193.988 79.692z"></path></svg>
                                        <span>Home</span>
                                    </li>`);
            colaborador_logado_armazens.empty();
              $("[colaborador_logado]").text(e.dados.auth.colaborador_nome+" "+(e.dados.auth.colaborador_apelido === null ? "" : e.dados.auth.colaborador_apelido.split(" ").pop()));
              $("[colaborador_logado_email]").text(e.dados.auth.colaborador_email);
              $(`[target=xModalSessionCtrl]`).attr("tTitle", e.dados.auth.colaborador_nome+" "+(e.dados.auth.colaborador_apelido || ""));
              if(e.dados.auth.colaborador_foto !== null){
                  if (e.dados.auth.colaborador_foto.split(";").length === 1) $("[colaborador_logado_foto]").css('background-image', 'url(/storage/'+e.dados.auth.colaborador_foto+')');
                  else  $("[colaborador_logado_foto]").css('background-image', 'url(/storage/'+e.dados.auth.colaborador_foto.split(";")[1]+')');
              }
              else{
                     $("[colaborador_logado_foto]").css('background-image', 'url(../assets/img/users_avatar/user.svg)');
              }
              let menusSemFaturasGuias = menus.filter(function (value) {
                    value = acesso.showConfig ? value : value.data;
                    return value.menu_codigo !== "maguita.proforma"
                          &&  value.menu_codigo !== "maguita.fatura"
                          && value.menu_codigo !== "maguita.entrada.artigos"
                          && value.menu_codigo !== "maguita.saida.artigos"
                          && value.menu_codigo !== "maguita.documentos"
                          && value.menu_codigo !== "maguita.notacredito"
                          && value.menu_menu_id === null
                          && !value.menu_codigo.includes("pos");
              });
              acesso.menusFaturasGuias = menus.filter(function (value) {
                  value = acesso.showConfig ? value : value.data;
                  return value.menu_codigo  === "maguita.proforma"
                      || value.menu_codigo === "maguita.fatura"
                      || value.menu_codigo === "maguita.entrada.artigos"
                      || value.menu_codigo === "maguita.documentos"
                      || value.menu_codigo === "maguita.notacredito"
                      || value.menu_codigo === "maguita.saida.artigos";
              });
              menusSemFaturasGuias.forEach((meSFQ) => {
                  meSFQ = acesso.showConfig ? meSFQ : meSFQ.data;
                  menuAcessos.append(`<li data-position="${meSFQ.menu_position}" class="tgl flex v-ct" link="${meSFQ.menu_link}" title="${meSFQ.menu_nome}" code="${meSFQ.menu_codigo}">
                                            ${meSFQ.menu_icon}
                                        <span>${meSFQ.menu_nome}</span>
                                    </li>`);
              });
                acesso.menusFaturasGuias.forEach((meFQ) =>{
                    meFQ = acesso.showConfig ? meFQ : meFQ.data;
                    if((meFQ.menu_codigo === "maguita.fatura" || meFQ.menu_codigo === "maguita.proforma" || meFQ.menu_codigo === "maguita.notacredito" || meFQ.menu_codigo === "maguita.documentos")){
                        menuAcessos.append(`<li data-position="${meFQ.menu_position}" class="tgl flex v-ct" link="${meFQ.menu_link}" title="Faturas" tipo="fatura" code="${meFQ.menu_codigo}">
                                          <?xml version="1.0" encoding="iso-8859-1"?>
                                            <!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                 viewBox="0 0 100.25 100.25" style="enable-background:new 0 0 100.25 100.25;" xml:space="preserve">
                                            <path d="M79.567,29.924l-18.26-18.479C61.025,11.16,60.641,11,60.24,11H20.5c-0.828,0-1.5,0.672-1.5,1.5v75
                                                c0,0.828,0.672,1.5,1.5,1.5h58c0.828,0,1.5-0.672,1.5-1.5V30.979C80,30.585,79.845,30.206,79.567,29.924z M62,16.415L74.929,29.5H62
                                                V16.415z M22,86V14h37v17c0,0.828,0.672,1.5,1.5,1.5H77V86H22z"/>
                                            </svg>
                                        <span>${meFQ.menu_nome}</span>
                                    </li>`);
                    }
                    else{
                        if(menuAcessos.find("li[tipo=guia]").length === 0 && (meFQ.menu_codigo === "maguita.entrada.artigos" || meFQ.menu_codigo === "maguita.saida.artigos")){
                            menuAcessos.append(`<li data-position="${meFQ.menu_position}" class="tgl flex v-ct" link="${meFQ.menu_link}" title="Guias" tipo="guia" code="${meFQ.menu_codigo}">
                                            ${meFQ.menu_icon}
                                        <span>Guias</span>
                                    </li>`);
                        }
                    }
                });

            if(acesso.showConfig){
                menuAcessos.append(`<li data-position="1000" class="tgl flex v-ct" link="../includes/systemConfig.html" title="Configurações do sistema" code="sys">  
                                <svg enable-background="new 0 0 512 512" viewBox="0 0 512 512">
                                    <path
                                         d="m272.066 512h-32.133c-25.989 0-47.134-21.144-47.134-47.133v-10.871c-11.049-3.53-21.784-7.986-32.097-13.323l-7.704 7.704c-18.659 18.682-48.548 18.134-66.665-.007l-22.711-22.71c-18.149-18.129-18.671-48.008.006-66.665l7.698-7.698c-5.337-10.313-9.792-21.046-13.323-32.097h-10.87c-25.988 0-47.133-21.144-47.133-47.133v-32.134c0-25.989 21.145-47.133 47.134-47.133h10.87c3.531-11.05 7.986-21.784 13.323-32.097l-7.704-7.703c-18.666-18.646-18.151-48.528.006-66.665l22.713-22.712c18.159-18.184 48.041-18.638 66.664.006l7.697 7.697c10.313-5.336 21.048-9.792 32.097-13.323v-10.87c0-25.989 21.144-47.133 47.134-47.133h32.133c25.989 0 47.133 21.144 47.133 47.133v10.871c11.049 3.53 21.784 7.986 32.097 13.323l7.704-7.704c18.659-18.682 48.548-18.134 66.665.007l22.711 22.71c18.149 18.129 18.671 48.008-.006 66.665l-7.698 7.698c5.337 10.313 9.792 21.046 13.323 32.097h10.87c25.989 0 47.134 21.144 47.134 47.133v32.134c0 25.989-21.145 47.133-47.134 47.133h-10.87c-3.531 11.05-7.986 21.784-13.323 32.097l7.704 7.704c18.666 18.646 18.151 48.528-.006 66.665l-22.713 22.712c-18.159 18.184-48.041 18.638-66.664-.006l-7.697-7.697c-10.313 5.336-21.048 9.792-32.097 13.323v10.871c0 25.987-21.144 47.131-47.134 47.131zm-106.349-102.83c14.327 8.473 29.747 14.874 45.831 19.025 6.624 1.709 11.252 7.683 11.252 14.524v22.148c0 9.447 7.687 17.133 17.134 17.133h32.133c9.447 0 17.134-7.686 17.134-17.133v-22.148c0-6.841 4.628-12.815 11.252-14.524 16.084-4.151 31.504-10.552 45.831-19.025 5.895-3.486 13.4-2.538 18.243 2.305l15.688 15.689c6.764 6.772 17.626 6.615 24.224.007l22.727-22.726c6.582-6.574 6.802-17.438.006-24.225l-15.695-15.695c-4.842-4.842-5.79-12.348-2.305-18.242 8.473-14.326 14.873-29.746 19.024-45.831 1.71-6.624 7.684-11.251 14.524-11.251h22.147c9.447 0 17.134-7.686 17.134-17.133v-32.134c0-9.447-7.687-17.133-17.134-17.133h-22.147c-6.841 0-12.814-4.628-14.524-11.251-4.151-16.085-10.552-31.505-19.024-45.831-3.485-5.894-2.537-13.4 2.305-18.242l15.689-15.689c6.782-6.774 6.605-17.634.006-24.225l-22.725-22.725c-6.587-6.596-17.451-6.789-24.225-.006l-15.694 15.695c-4.842 4.843-12.35 5.791-18.243 2.305-14.327-8.473-29.747-14.874-45.831-19.025-6.624-1.709-11.252-7.683-11.252-14.524v-22.15c0-9.447-7.687-17.133-17.134-17.133h-32.133c-9.447 0-17.134 7.686-17.134 17.133v22.148c0 6.841-4.628 12.815-11.252 14.524-16.084 4.151-31.504 10.552-45.831 19.025-5.896 3.485-13.401 2.537-18.243-2.305l-15.688-15.689c-6.764-6.772-17.627-6.615-24.224-.007l-22.727 22.726c-6.582 6.574-6.802 17.437-.006 24.225l15.695 15.695c4.842 4.842 5.79 12.348 2.305 18.242-8.473 14.326-14.873 29.746-19.024 45.831-1.71 6.624-7.684 11.251-14.524 11.251h-22.148c-9.447.001-17.134 7.687-17.134 17.134v32.134c0 9.447 7.687 17.133 17.134 17.133h22.147c6.841 0 12.814 4.628 14.524 11.251 4.151 16.085 10.552 31.505 19.024 45.831 3.485 5.894 2.537 13.4-2.305 18.242l-15.689 15.689c-6.782 6.774-6.605 17.634-.006 24.225l22.725 22.725c6.587 6.596 17.451 6.789 24.225.006l15.694-15.695c3.568-3.567 10.991-6.594 18.244-2.304z" />
                                    <path
                                        d="m256 367.4c-61.427 0-111.4-49.974-111.4-111.4s49.973-111.4 111.4-111.4 111.4 49.974 111.4 111.4-49.973 111.4-111.4 111.4zm0-192.8c-44.885 0-81.4 36.516-81.4 81.4s36.516 81.4 81.4 81.4 81.4-36.516 81.4-81.4-36.515-81.4-81.4-81.4z" />
                                </svg>                                    
                                    <span>Configurações do sistema</span>
                                </li>`);
            }

              // Get all list items and convert them to a jQuery object
              let listItems = menuAcessos.find('li');

              // Sort the list items based on data-position
              listItems.sort(function(a, b) {
                  let posA = $(a).data('position');
                  let posB = $(b).data('position');
                  return posA - posB;
              });

              // Append the sorted list items back to the ul

              menuAcessos.html(listItems);
              let hash = location.hash.split("#")[1];
              let lastMenuClick;
              if( hash ) lastMenuClick = menuAcessos.find( `li[code="${ hash }"]`);
              if( hash && lastMenuClick && lastMenuClick.length ) lastMenuClick.click();
              else menuAcessos.find("li").eq(0).click();

              e.dados.espaco_trabalha.forEach((espT, idx) =>{
                  if(colaborador_logado_armazens.find(`li[armazem_id=${espT.espaco_id}]`).length === 0) {
                      if(espT.espaco_id === e.dados.auth.armazem_atual){
                          $("[currentUserSpace]").text(espT.espaco_nome);
                          colaborador_logado_armazens.append(`<li class="active" armazem_id="${espT.espaco_id}" posto_admin="${espT.espaco_posto_admin}">${espT.espaco_nome}</li>`);
                      }
                      else{
                          colaborador_logado_armazens.append(`<li armazem_id="${espT.espaco_id}" posto_admin="${espT.espaco_posto_admin}">${espT.espaco_nome}</li>`);
                      }
                  }
             });
          }
      });
  },
   changeCurrentSpace(){
        let colaborador_logado_armazens = $("#colaborador_logado_armazens");
       $.ajax({
           url: "/api/current/space/change",
           method: "POST",
           contentType: "application/json",
           data: JSON.stringify({ space_id: colaborador_logado_armazens.find("li.active").attr("armazem_id"),
                posto_admin: (colaborador_logado_armazens.find("li.active").attr("posto_admin") === "null" ? null
                    : colaborador_logado_armazens.find("li.active").attr("posto_admin") )}),
           success(e) {
                if(e.result){
                    $("[currentuserspace]").text($("#colaborador_logado_armazens").find("li.active").text());
                    $("[menuAcessos]").find("li.active").click();
                    $("#xModalSessionCtrl").find(".hideTarget").click();
                }
           }
       });
   },
   exit(){
       $.ajax({
           url: "/api/exit",
           method: "POST",
           contentType: "application/json",
           success(e) {
               if(e.result){
                   location.href = "index.html";
               }
           }
       });
   },
    changePassword(){
        $("[alterarSenha]").attr("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/colaborador/senha",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({arg_colaborador_senhaold : clearText($("#colaborador_palavra_passe").val()), arg_colaborador_senhanew : clearText($("#colaborador_nova_palavra_passe").val())}),
            error(){
                $("[alterarSenha]").attr("disabled", false).removeClass("loading")
            },
            success(e) {
                $("[alterarSenha]").attr("disabled", false).removeClass("loading");
                if(e.result){
                    $("#xModalSessionCtrl").find(".hideTarget").click();
                    $("#chgUHK").find("[target=amzUHK]").click();
                    xAlert("Alterar palavra-passe", "Palavra-passe alterada com sucesso!");
                    $("#colaborador_palavra_passe, #colaborador_nova_palavra_passe, #colaborador_confirmar_palavra_passe").val("");
                }
                else xAlert("Alterar palavra-passe", e.message, "error");
            }
        });
    }
};
acesso.init();
$("[menuAcessos]").on("click", "li", function () {
    checkSession();
    const typeMenu = $(this).attr("tipo");
    const codeMenu = $(this).attr("code");
    location = `#${codeMenu}`;
    $(".div-include-pages").empty().load($(this).attr("link"), function () {
        if(typeMenu === "fatura" || typeMenu === "guia")
              addInterMenus(typeMenu, codeMenu);
    });
});

$("#colaborador_logado_armazens").on("mousedown", "li", function () {
    $(this).addClass('active').siblings().removeClass('active');
    acesso.changeCurrentSpace();
});
$("[terminarSessao]").on("click",  function () {
    acesso.exit();
});
$("[alterarSenha]").on("click", function () {
    if(!validation1($("#colaborador_palavra_passe, #colaborador_nova_palavra_passe, #colaborador_confirmar_palavra_passe"))) return;
    if(clearText($("#colaborador_nova_palavra_passe").val()) !== clearText($("#colaborador_confirmar_palavra_passe").val())){
        xAlert("Alterar palavra-passe", "Palavra-passes não se coincidem!", "error");
        $("#colaborador_nova_palavra_passe").focus();
        return;
    }
    acesso.changePassword();
});
