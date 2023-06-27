(() => {
    const colaborador = {
        menus: [],
        list: [],
        main_workspace: null,
        init() {
            this.loadAllMenusBranch();
            this.loadMainWorkspace();
            this.carregarArmazensAlocar();
            this.load();
        },
        loadMainWorkspace() {
            $.ajax({
                url: "/api/user/main/workspace/load",
                method: "POST",
                contentType: "application/json",
                success(e) {
                   colaborador.main_workspace = e.mainWorkspace;
                }
            });
        },
        carregarArmazensAlocar() {
            $.ajax({
                url: "/api/armazens/colaborador/load",
                method: "POST",
                contentType: "application/json",
                success(e) {
                    let colaborador_armazens = $("[colaborador_armazens]");
                    colaborador_armazens.empty();
                    e.armazens.forEach((arm) => {
                        arm = arm.funct_load_espaco_simple;
                        colaborador_armazens.append(`<li class="stgl" id="${arm.espaco_id}" uuid="${arm.espaco_id.replaceAll("-", "")}">${arm.espaco_nome}</li>`);
                    });
                }
            });
        },
        load() {
            $("body").addClass("loading");
            $.ajax({
                url: "/api/users/load",
                method: "POST",
                contentType: "application/json",
                error(){ $("body").removeClass("loading")},
                success(e) {
                    $("body").removeClass("loading");
                    colaborador.list = [];
                    colaborador.list = e.users;
                    let estruturaColaboradores = $(".list-colaborators");
                    let colaborador_foto;
                    let estruturaFoto;
                    let descricaoAcesso;
                    let redefinirAcessoEstrutura;
                    let alterarEstadoEstrutura;
                    estruturaColaboradores.empty();
                    if(colaborador.list.length === 0) estruturaColaboradores.addClass("empty");
                    else estruturaColaboradores.removeClass("empty");

                    colaborador.list.forEach((col, idx) => {
                        col = col.data;
                        redefinirAcessoEstrutura = "";
                        alterarEstadoEstrutura = "";
                        if(col.colaborador_accesso === 1) descricaoAcesso = "Ativado";
                        else if(col.colaborador_accesso === 2) descricaoAcesso = "Pré-ativado";
                        else descricaoAcesso = "Desativado";

                        if (col.colaborador_foto !== null) {
                            colaborador_foto = "/storage/" + (col.colaborador_foto.split(";").length === 1 ? col.colaborador_foto : col.colaborador_foto.split(";")[0]);
                            estruturaFoto = `<div class="img-container userPhoto round" style="background-image: url(${colaborador_foto})"></div>`;
                        }
                        else {
                            estruturaFoto = `<div class="img-container userPhoto round" style="background-image: url('../assets/img/users_avatar/user.svg')"></div>`;
                        }
                        if(parseInt(col.colaborador_tipo) !== 2){
                            redefinirAcessoEstrutura = `   <span  i="${idx}" tooltip="Redefinir acessos" flow="up" class="edit flex v-ct h-ct resetAccess">
                                                                    <svg x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"
                                                                        xml:space="preserve">
                                                                        <g>
                                                                            <circle cx="277.937" cy="346" r="20" />
                                                                            <path
                                                                                d="M344.937,471.999h-249c-22.056,0-40-17.944-40-40v-164c0-22.056,17.944-40,40-40h288c4.554,0,8.167,0.402,11.047,1.227
                                                                                        c10.618,3.042,21.692-3.1,24.735-13.718c3.042-10.618-3.1-21.692-13.718-24.735c-6.513-1.866-13.73-2.773-22.064-2.773H359.9
                                                                                        v-70.534C359.9,52.695,306.068,0,239.9,0s-120,52.695-120,117.466V188H95.937c-44.112,0-80,35.888-80,80v164
                                                                                        c0,44.112,35.888,80,80,80h249c11.046,0,20-8.954,20-20C364.937,480.954,355.983,472,344.937,471.999z M159.9,117.466
                                                                                        c0-42.715,35.888-77.466,80-77.466s80,34.751,80,77.466V188h-160V117.466z" />
                                                                            <circle cx="202.937" cy="346" r="20" />
                                                                            <path
                                                                                d="M496.046,331.21c-0.438-38.789-32.13-70.21-71.021-70.21C385.863,261,354,292.862,354,332.025c0,11.046,8.954,20,20,20
                                                                                        c11.046,0,20-8.954,20-20C394,314.918,407.918,301,425.026,301c17.108,0,31.025,13.918,31.025,31.025
                                                                                        c0,0.182,0.002,0.363,0.007,0.543c-0.206,12.247-7.563,23.211-18.864,28.035c-19.541,8.345-32.168,27.618-32.168,49.101V427
                                                                                        c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20v-17.296c0-5.438,3.092-10.271,7.875-12.313
                                                                                        c26.227-11.196,43.169-36.855,43.162-65.37C496.063,331.749,496.057,331.479,496.046,331.21z" />
                                                                            <circle cx="424.937" cy="492" r="20" />
                                                                            <circle cx="127.937" cy="346" r="20" />
                                                                        </g>
                                                                    </svg>
                                                                </span>`;
                            alterarEstadoEstrutura = `<span class="switch" tooltip="${descricaoAcesso}" flow="up">
                                                                    <label class="xSwitch" i="${idx}">
                                                                        <input type="checkbox" ${(col.colaborador_accesso === 1 || col.colaborador_accesso === 2 ? "checked" : "")}>
                                                                        <span class="slider round"></span>
                                                                    </label>
                                                                </span>`;
                        }
                        estruturaColaboradores.append(` <section>
                                                        <div class="flex">
                                                            ${estruturaFoto}
                                                            <div class="grow">
                                                                <b>${col.colaborador_nome + " " + (col.colaborador_apelido || "")}</b>
                                                                <p>${col.colaborador_email}</p>                           
                                                            </div>
                                                        </div>
                                                        <div class="sep j-stp flex v-ct h-sb">
                                                            <small>Em: ${alterFormatDate(col.colaborador_dataregisto.substring(0, 10)) + ", " + col.colaborador_dataregisto.substring(11, 13) + "h" + col.colaborador_dataregisto.substring(14, 16)}</small>
                                                            <div class="flex v-ct">
                                                                    ${redefinirAcessoEstrutura}
                                                                <span tooltip="Editar" flow="up" class="editar flex v-ct h-ct" i="${idx}">
                                                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 348.882 348.882"
                                                                        style="enable-background:new 0 0 348.882 348.882;" xml:space="preserve">
                                                                        <g>
                                                                            <path
                                                                                d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231
                                                                                c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685
                                                                                c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176
                                                                                C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99
                                                                                L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386
                                                                                c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z" />
                                                                            <path
                                                                                d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904
                                                                                c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15
                                                                                s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798
                                                                                c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z" />
                                                                        </g>
                                                                    </svg>
                                                                </span>
                                                                ${alterarEstadoEstrutura}
                                                            </div>
                                                        </div>
                                                    </section>`);
                    });
                }
            });
        },
        loadAllMenusBranch() {
            $.ajax({
                url: "/api/menus/load",
                method: "POST",
                contentType: "application/json",
                success(e) {
                    colaborador.menus = [];
                    colaborador.menus = e.menus;
                    let allMenus = $("[allMenus]");
                    let funcionalidades = [];
                    allMenus.find(".xcheck.multiple").remove();
                    colaborador.menus.forEach((me) => {
                        me = me.data;
                        if (me.menu_menu_id === null){
                            allMenus.append(`<div class="xcheck multiple mainMenu" menu_id="${me.menu_id}">
                                                <div class="tit flex">
                                                    <span class="j-stp fkcheck"></span>
                                                    <span>${me.menu_nome}</span>
                                                </div>
                                            </div>`);
                            funcionalidades = colaborador.menus.filter((func => func.data.menu_menu_id === me.menu_id));
                            if(funcionalidades.length > 0){
                                allMenus.find(`.xcheck.multiple[menu_id=${me.menu_id}] .tit.flex`).after(`<ul></ul>`);
                                funcionalidades.forEach((fu) =>{
                                    fu = fu.data;
                                    allMenus.find(`.xcheck.multiple[menu_id=${me.menu_id}] ul`).append(`<li menu_id="${fu.menu_id}" menu_menu_id="${fu.menu_menu_id}">${fu.menu_nome}</li>`);
                                });
                            }
                        }
                    });
                    $('[data-inputmask-alias]').inputmask();
                }
            });
        },
        clearUserData() {
            $("[allMenus]").find("li, .xcheck.multiple").css("pointer-events", "auto");
            $("#xModalCreateColab").find("input").val("");
            $("[colaborador_sexo], [colaborador_armazens]").find("li").removeClass("active").css("pointer-events", "auto");
            $("[allMenus]").find(".xcheck.multiple .fkcheck").removeClass("parcial full");
            $("[allMenus]").find("li").removeClass("active");
            $("label[lab=FOTO]").text(".jpg, .png, .jpeg");
        },
        get selectedMenus() {
            let menusSelecionados = [];
            $("[allMenus]").find(".xcheck.multiple").each(function () {
                if($(this).find(".fkcheck").hasClass("parcial") || $(this).find(".fkcheck").hasClass("full")){
                    menusSelecionados.push($(this).attr("menu_id"));
                    $(this).find("li.active").each(function () {
                        menusSelecionados.push($(this).attr("menu_id"));
                    });
                }
            });
            return menusSelecionados;
        },
        get armazensSelecionadosAlocados() {
            let armazensAlocados = [];
            $("[colaborador_armazens]").find("li.active").each(function () {
                armazensAlocados.push({ arg_espaco_id: $(this).attr("id") });
            });
            return armazensAlocados;
        },
        adicionar() {
            $("[bt_colaborador]").attr("disabled", true).addClass("loading");
            let user = {};
            user.arg_colaborador_email = $("[colaborador_email]").val().trim();
            user.arg_colaborador_nome = $("[colaborador_nome]").val().trim();
            user.arg_colaborador_apelido = $("[colaborador_apelido]").val().trim();
            user.arg_colaborador_nif = $("[colaborador_nif]").val() || null;
            user.arg_colaborador_datanascimento = alterFormatDate($("[colaborador_datanascimento]").val());
            user.arg_colaborador_ficha = null;
            user.arg_colaborador_foto = null;
            user.arg_tsexo_id = $("[colaborador_sexo]").find("li.active").attr("id");
            user.arg_menu_list = this.selectedMenus;
            user.arg_espaco = this.armazensSelecionadosAlocados;
            user.arg_colaborador_pin = 1234;
            user.arg_colaborador_senha = 1234;
            user.arg_colaborador_tipo = 1;

            let formData = new FormData();
            formData.append("data", JSON.stringify(user));
            formData.append("file", $("#colaborador_foto")[0].files[0]);
            $.ajax({
                url: "/api/user",
                method: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                dataType: "json",
                data: formData,
                error() { $("[bt_colaborador]").attr("disabled", false).removeClass("loading") },
                complete() { $("[bt_colaborador]").attr("disabled", false).removeClass("loading") },
                success(e) {
                    $("[bt_colaborador]").attr("disabled", false).removeClass("loading");
                    if (e.result) {
                        colaborador.load();
                        colaborador.clearUserData();
                        xAlert("Adicionar colaborador", "Colaborador registado com sucesso!");
                        $("#xModalCreateColab").find(".hideTarget").click();
                    }
                    else
                        xAlert("Adicionar colaborador", e.message, "error");
                }
            });
        },
        editar() {
            $("[bt_colaborador]").attr("disabled", true).addClass("loading");
            let user = {};
            user.arg_colaborador_email = $("[colaborador_email]").val().trim();
            user.arg_colaborador_editar = this.selected.colaborador_id;
            user.arg_colaborador_nome = $("[colaborador_nome]").val().trim();
            user.arg_colaborador_apelido = $("[colaborador_apelido]").val().trim();
            user.arg_colaborador_nif = $("[colaborador_nif]").val() || null;
            user.arg_colaborador_datanascimento = alterFormatDate($("[colaborador_datanascimento]").val());
            user.arg_colaborador_ficha = null;
            user.arg_colaborador_foto = this.selected.colaborador_foto;
            user.arg_tsexo_id = $("[colaborador_sexo]").find("li.active").attr("id");
            user.arg_menu_list = this.selectedMenus;
            user.arg_espaco = this.armazensSelecionadosAlocados;

            let formData = new FormData();
            formData.append("data", JSON.stringify(user));
            formData.append("file",  $("#colaborador_foto")[0].files[0]);
            $.ajax({
                url: "/api/user/change",
                method: "POST",
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                dataType: "json",
                data: formData,
                error() { $("[bt_colaborador]").attr("disabled", false).removeClass("loading") },
                complete() { $("[bt_colaborador]").attr("disabled", false).removeClass("loading") },
                success(e) {
                    $("[bt_colaborador]").attr("disabled", false).removeClass("loading");
                    if (e.result) {
                        colaborador.load();
                        colaborador.clearUserData();
                        xAlert("Editar colaborador", "Colaborador editado com sucesso!");
                        $("#xModalCreateColab").find(".hideTarget").click();
                    }
                    else
                        xAlert("Editar colaborador", e.message, "error");
                }
            });
        },
        desativar() {
            $.ajax({
                url: "/api/user/disable",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ arg_colaborador_disable: this.selected.colaborador_id }),
                success(e) {
                    if (e.result) {
                        colaborador.load();
                        xAlert("Desativar colaborador", "Operação efetuada com sucesso!");
                        $("#xModalChangeColStatus").find(".hideTarget").click();
                    }
                    else xAlert("Desativar colaborador", e.message, "error");
                }
            });
        },
        ativar({ title }) {
            $.ajax({
                url: "/api/user/enable",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ arg_colaborador_reative: this.selected.colaborador_id, arg_colaborador_senha: 1234, arg_colaborador_pin: 1234, arg_start: false }),
                success(e) {
                    if (e.result) {
                        colaborador.load();
                        xAlert(title, "Operação efetuada com sucesso!");
                        $("#xModalChangeColStatus, #xModalResetColabPass").find(".hideTarget").click();
                    }
                    else
                        xAlert(title, e.message, "error");
                }
            });
        },
        carregarAcessos() {
            $.ajax({
                url: "/api/menus/load",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ arg_colaborador_id: this.selected.colaborador_id }),
                success(e) {
                    let allMenus = $("[allMenus]");
                    allMenus.find(".xcheck.multiple .fkcheck").removeClass("parcial full");
                    allMenus.find("li").removeClass("active");
                    allMenus.find("li, .xcheck.multiple").css("pointer-events", "auto");
                    e.menus.forEach((m) =>{
                        m = m.data;
                        if(allMenus.find(`li[menu_id=${m.menu_id}]`).length === 0){
                            if(allMenus.find(`li[menu_menu_id=${m.menu_id}]`).length === 0){
                                $(`[allMenus] .mainMenu[menu_id=${m.menu_id}]`).find(`span.fkcheck`).click();
                            }
                        }
                        else $("[allMenus]").find(`li[menu_id=${m.menu_id}]`).click();
                    });
                     if(parseInt(colaborador.selected.colaborador_tipo) === 2)
                         $("[allMenus]").find("li, .xcheck.multiple").css("pointer-events", "none");
                }
            });
        }
    };
    colaborador.init();
    $("[novoColaborador]").on("click", function () {
      if (!$("#xModalCreateColab").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")){
          colaborador.clearUserData();
      }
      showTarget("xModalCreateColab", "Adicionar Colaborador");
    });
    $("#colaborador_foto").on("change", function () {
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
        if (this.files.length === 0) return;

        let file = this.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            $("label[lab=FOTO]").text(file.name);
        };
        reader.readAsDataURL(file);
    });
    $("[bt_colaborador]").on("click", function () {
        let regExp = /[a-zA-Z]/g;
        if (!validation1($("[colaborador_nome], [colaborador_apelido], [colaborador_datanascimento], [colaborador_email]"))) return;
        if (regExp.test($("[colaborador_datanascimento]").val())) {
            xAlert("Colaborador", "Digite a data de nascimento!", "info");
            $("[colaborador_datanascimento]").focus();
            return;
        }
        if (!compareDates(alterFormatDate($("[colaborador_datanascimento]").val()), new Date().getDateEn(), false)) {
            xAlert("Colaborador", "Data de nascimento inválida!", "error");
            $("[colaborador_datanascimento]").focus();
            return;
        }
        if ($("[colaborador_sexo]").find("li.active").length === 0) {
            xAlert("Colaborador", "Selecione o sexo!", "info");
            return;
        }
        if (!isMailValid($("[colaborador_email]"))) {
            xAlert("Colaborador", "Email inválido!", "error");
            $("[colaborador_email]").focus();
            return;
        }
        if ($("[allMenus]").find(".fkcheck.parcial").length === 0 && $("[allMenus]").find(".fkcheck.full").length === 0) {
            xAlert("Colaborador", "Selecione os acessos que o colaborador terá!", "info");
            return;
        }
        if ($("[colaborador_armazens]").find("li.active").length === 0) {
            xAlert("Colaborador", "Selecione o(s) armazém(s) que o colaborador estará alocado!", "info");
            return;
        }
        if ($("#xModalCreateColab").find("h3[targetTitle]").text().toLowerCase().includes("adicionar")) colaborador.adicionar();
        else colaborador.editar();
    });
    $(".list-colaborators").on("click", ".xSwitch", function (e) {
        e.preventDefault();
        colaborador.selected = colaborador.list[$(this).attr("i")].data;
        if(colaborador.selected.colaborador_accesso === 1 || colaborador.selected.colaborador_accesso === 2) showTarget("xModalChangeColStatus", "Desativar colaborador");
        else  showTarget("xModalChangeColStatus", "Pré-ativar colaborador");
    }).on("click", ".editar", function () {
        colaborador.selected = colaborador.list[$(this).attr("i")].data;
        colaborador.carregarAcessos();
        $("#colaborador_foto").val("");
        $("[colaborador_nome]").val(colaborador.selected.colaborador_nome);
        $("[colaborador_apelido]").val((colaborador.selected.colaborador_apelido || ""));
        $("[colaborador_nif]").val((colaborador.selected.colaborador_nif || ""));
        $("[colaborador_datanascimento]").val((colaborador.selected.colaborador_datanascimento === null ? "" : alterFormatDate(colaborador.selected.colaborador_datanascimento)));
        $("[colaborador_sexo]").find(`li`).removeClass("active");
        if (colaborador.selected.tsexo_id) {
            $("[colaborador_sexo]").find(`li[id=${colaborador.selected.tsexo_id}]`).addClass("active");
            $("#sexoDesc").val(colaborador.selected.tsexo_nome);
        }
        $("[colaborador_email]").val(colaborador.selected.colaborador_email);
        $("[colaborador_armazens]").find("li").removeClass("active").css("pointer-events", "auto");
        colaborador.selected.colaborador_espacotrabalha.forEach((tr) => {
            if(parseInt(colaborador.selected.colaborador_tipo) === 2 && tr.espaco_id === colaborador.main_workspace)
                $("[colaborador_armazens]").find(`li[uuid=${tr.espaco_id.replaceAll("-", "")}]`).addClass("active").css("pointer-events", "none");
            else
                $("[colaborador_armazens]").find(`li[uuid=${tr.espaco_id.replaceAll("-", "")}]`).addClass("active");
        });
        if (colaborador.selected.colaborador_foto === null) $("label[lab=FOTO]").text(".jpg, .png, .jpeg");
        else {
            if (colaborador.selected.colaborador_foto.split(";").length === 1) $("label[lab=FOTO]").text(colaborador.selected.colaborador_foto);
            else $("label[lab=FOTO]").text(colaborador.selected.colaborador_foto.split(";")[1]);
        }
        showTarget("xModalCreateColab", "Editar colaborador");
    }).on("click", ".resetAccess", function () {
        colaborador.selected = colaborador.list[$(this).attr("i")].data;
        showTarget("xModalResetColabPass");
    });
    $("[changeStatusCol]").on("click", function () {
        if (colaborador.selected.colaborador_accesso === 1 || colaborador.selected.colaborador_accesso === 2) colaborador.desativar();
        else colaborador.ativar({ title: "Pré-ativar"});
    });
    $("[redefinir_senha]").on("click", function () {
        colaborador.ativar({ title: "Redefinir palavra-passe e PIN" });
    });
})();

// ANTUNES
$('.colabs').on('click', '.control-access .tit', function () {
    $(this).parent().toggleClass('opened');
}).on('click', '.control-access .xcheck li', function () {
    $(this).toggleClass("active");
    let mainSelect = $(this).closest('.xcheck').find('.fkcheck');
    let li = $(this).parent().children().length;
    let activeLI = $(this).parent().children('li.active').length;
    if(activeLI === 0){
        mainSelect.removeClass('parcial full');
    } else if(activeLI !== li){
        mainSelect.removeClass('full').addClass('parcial');
    } else{
        mainSelect.removeClass('parcial').addClass('full');

    }
}).on('click', '.control-access .fkcheck', function () {
    if($(this).hasClass('full')){
        $(this)
        .removeClass('full')
        .closest('.xcheck').find('li').removeClass('active');
    } else{
        $(this)
        .addClass('full')
        .removeClass('parcial')
        .closest('.xcheck').find('li').addClass('active');
    }
});