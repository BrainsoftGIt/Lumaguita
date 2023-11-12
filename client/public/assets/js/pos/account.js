var account = {
    post: undefined,
    user_id: undefined,
    functionGoForward: null,
    functionAfterAuth: null,
    functionAfterSetSpace: null,
    functionAfterCheckDefaultSpace: null,
    POSTO_VENDA: 1,
    session: undefined,
    pos_user: null,
    pos_user_session_uuid: null,
    user_spaces: [],
    key: null,
    operation: null,
    pin:{
        atual: null,
        novo: null
    },
    loadOpenAccounts(){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/open/accounts/load",
            method: "POST",
            contentType: "application/json",
            success(e) {
                $("body").removeClass("loading");
                let listAllAccounts = $(".listAllAccounts");
                listAllAccounts.empty();
                if(e.contas.length === 0) listAllAccounts.addClass("empty");
                else listAllAccounts.removeClass("empty");

                e.contas.forEach((co) =>{
                    co = co.data;
                    listAllAccounts.append(`<div class="accnt waves-effect" account_id="${co.conta_id}" key="${co.conta_chave}">
                                            <p class="number">${(co.conta_mesa?.numero || "")}</p>
                                            <div class="smallit">
                                                <p class="artigos">${(co.conta_vendas === 1 ? "1 artigo ": co.conta_vendas+" artigos")}</p>
                                                <p class="who">Criada por <span>${co.colaborador_nome}</span></p>
                                            </div>
                                            <p class="price">${co.conta_montante.dc().formatter()+" STN"}</p>
                                        </div>`);
                });
            }
        });
    },
    resetModalAuthentication(){
        $("#pos_valorSubtotal, #pos_valorTotal").text("0,00");
        $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
        $(".credentialPIN .user-selected").text("");
        $(".fkinputs .table, .changeBox").css("display", "");
        $("#MST-PIN").removeClass("changingPIN actualPINApproved addPIN");
        $("#armazem_selecionado_pos").css("display", "none");
        this.pin.atual = null;
        this.pin.novo = null;
        pos.conta_id = null;
        pos.contas = [];
        keyboard.pin = "";
        $("#iptTable").val("").prop("disabled", false);
        $(".credentialPIN .pinput").find("span").remove();
        $(".list-users").find("li").css("pointer-events", "auto");
        $(".txtChangingPIN").text("Digite o seu PIN atual");
        $(".list-users li").removeClass("active");
    },
    mostrarArmazens(){
        let armazens_pos = $("#armazens_pos");
        armazens_pos.empty();
        this.post.spaces.forEach((arm) =>{
            armazens_pos.append(`<div class="waves-effect account tgl" armazem_id="${arm.data.espaco_id}">
                                                <div class="flex v-ct h-ct">
                                                    <svg enable-background="new 0 0 511.414 511.414" viewBox="0 0 511.414 511.414"><path d="m497.695 108.838c0-6.488-3.919-12.334-9.92-14.8l-225.988-92.838c-3.896-1.6-8.264-1.6-12.16 0l-225.988 92.838c-6.001 2.465-9.92 8.312-9.92 14.8v293.738c0 6.488 3.918 12.334 9.92 14.8l225.988 92.838c3.854 1.583 8.186 1.617 12.14-.001.193-.064-8.363 3.445 226.008-92.837 6.002-2.465 9.92-8.312 9.92-14.8zm-241.988 76.886-83.268-34.207 179.951-78.501 88.837 36.495zm-209.988-51.67 71.841 29.513v83.264c0 8.836 7.164 16 16 16s16-7.164 16-16v-70.118l90.147 37.033v257.797l-193.988-79.692zm209.988-100.757 55.466 22.786-179.951 78.501-61.035-25.074zm16 180.449 193.988-79.692v257.797l-193.988 79.692z"/></svg>
                                                </div>
                                                <p>${arm.data.espaco_nome}</p>
                                            </div>`);

        });
        if(armazens_pos.find("div.account").length === 1)
            armazens_pos.find("div.account").addClass("active");
    },
    logIN(){
        $.ajax({
            url: "/api/post/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({colaborador_id: $(".list-users").find("li.active").attr("colab_id"),
                 pin: keyboard.pin}),
            success(e) {
                if(e.result){
                    if(account.functionAfterAuth){
                        account.user_spaces = [];
                        account.user_spaces = e.armazens;
                        account.pos_user_session_uuid = e.user_uuid;
                        account.functionAfterAuth(e.acesso, e.defaultSpace);
                    }
                }
                else{
                    keyboard.pin = "";
                    $("#armazem_selecionado_pos").css("display", "none");
                    $(".credentialPIN .pinput").find("span").remove();
                    M.toast({html: e.message, classes: 'rounded'});
                }
            }
        });
    },
    loadPost(){
        $(".postatus").removeClass("activated unregistered deactivated");
        $("#armazem_selecionado_pos").css("display", "none");
        $.ajax({
            url: "/api/posto/data",
            method: "POST",
            contentType: "application/json",
            success(e) {
                if(e.modeView){
                    $("body").addClass('dark');
                    $("#iptCheckMode").prop("checked", true);
                }
                else $("body").removeClass('dark');

                if(e.not_registrated !== undefined){
                    $(".postatus").addClass("unregistered");
                }
                else {
                    account.post = e.post;
                    account.session = e.hasSession;
                    account.pos_user = e.pos_user_name;
                    account.pos_user_session_uuid = e.pos_user_session_uuid;

                    if(account.post.chave_definitiva === null) $(".postatus").addClass("unregistered");
                    else{
                        if(account.post.posto_disponivel){
                            $(".postatus").addClass("activated");
                            account.mostrarArmazens();
                            account.loadOpenAccounts();
                            if(account.post.posto_tposto_id === account.POSTO_VENDA){
                                $("[closeBox]").css("display", "none");
                            }else{
                                $("[closeBox]").css("display", "");
                            }
                        }
                        else $(".postatus").addClass("deactivated");
                    }
                }
            }
        });
    },
    hasValidPost(){
        if(account.post.chave_definitiva === null){
            xAlert("Posto", "Posto não está registado.", "error");
            return false;
        }
        if(!account.post.posto_disponivel){
            xAlert("Posto", "Posto "+this.post.posto_designacao+" foi desativado.", "error");
            return false;
        }
        if($("#armazens_pos").find("div.account").length === 0){
            xAlert("Posto", "O armazém ligado a este posto está associado a outra máquina!", "error");
            return false;
        }
        return true;
    },
    loadAccountKey(){
        return new Promise((resolve, reject) =>{
            $.ajax({
                url: "/api/account/key",
                method: "POST",
                contentType: "application/json",
                success(data) {
                    resolve(data);
                },
                error(error){
                    reject(error);
                }
            });
        });
    },
    loadUsers(menus){
        $("body").addClass("loading");
        $.ajax({
            url: "/api/users/post/load",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({menus: menus}),
            error() {$("body").removeClass("loading")},
            success(e) {
                $("body").removeClass("loading");
                let users = $(".credentialPIN .list-users ul");
                users.empty();
                if(e.usrs.length > 0){
                    e.usrs.forEach((user) =>{
                        user = user.data;
                        users.append(`<li class="waves-effect flex v-ct" colab_id="${user.colaborador_id}">
                                        <div class="img-container round" style="background-image: url(${user.colaborador_foto === null ? "../assets/img/users_avatar/user.svg" : "/storage"+user.colaborador_foto.split(";")[0]})">
                                        </div>
                                        <div>
                                            <b>${user.colaborador_nome}</b>
                                            <p>${(user.colaborador_email || "")}</p>
                                        </div>
                                </li>`);
                    });
                    /*if(e.usrs.length === 1){
                        users.find("li").eq(0).addClass("active");
                    }*/
                    showTarget("MST-PIN");
                }
                else xAlert("Colaboradores POS", "Não há colaboradores registados com privilégio para realizar a operação.", "error");
            }
        });
    },
    addPIN(){
        if(this.pin.novo){
            if(this.pin.novo !== keyboard.pin){
                M.toast({html: 'Novo PIN e confirmar PIN não se correspondem.', classes: 'rounded'});
                account.pin.novo = null;
                keyboard.pin = "";
                $(".credentialPIN .pinput").find("span").remove();
                $(".txtChangingPIN").text("Digite o novo PIN");
            }
            else account.changePIN();
        }
        else{
            account.pin.novo = keyboard.pin;
            keyboard.pin = "";
            $(".credentialPIN .pinput").find("span").remove();
            $(".txtChangingPIN").text("Confirme o novo PIN");
        }
    },
    changePIN(){
        $.ajax({
            url: "/api/colaborador/pin",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({colaborador_id: $(".list-users").find("li.active").attr("colab_id"),
                arg_colaborador_senha: account.pin.atual, arg_colaborador_pin: keyboard.pin}),
            success(e) {
                if(e.result){
                    M.toast({html: 'PIN alterado com sucesso!', classes: 'rounded'});
                    keyboard.pin = "";
                    $("#MST-PIN").find(".hideTarget").click();
                    $(".credentialPIN .pinput").find("span").remove();
                }
                else{
                    $("#MST-PIN").find(".hideTarget").click();
                    M.toast({html: e.message, classes: 'rounded'});
                }
            }
        });
    },
    definirNovoPIN(){
        xAlert("Conta", "Verificamos que esta é a sua primeira vez a aceder ao sistema ou a sua conta foi reativada. <br> Por razões de segurança, é obrigatório que altere o seu PIN.", "info", 9);
        account.pin.atual = keyboard.pin;
        $("#MST-PIN").addClass("changingPIN");
        $(".credentialPIN").addClass("addPIN");
        keyboard.pin = "";
        $(".credentialPIN .pinput").find("span").remove();
        $(".txtChangingPIN").text("Digite o novo PIN");
        $(".list-users").find("li").css("pointer-events", "none");
        account.functionGoForward = function () {
            account.addPIN();
        };
    },
    definirArmazem(){
        $("[armazem_venda]").prop("disabled", true).addClass("loading");
        $.ajax({
            url: "/api/user/post/armazem",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({space_id: $("#armazens_pos").find("div.account.active").attr("armazem_id")}),
            error() {
                $("[armazem_venda]").prop("disabled", false).removeClass("loading")
            },
            success(e) {
                $("[armazem_venda]").prop("disabled", false).removeClass("loading");
                if(e.result){
                    account.functionAfterSetSpace();
                }
                else{
                    xAlert("Armazém", "Ocorreu um erro ao escolher o armazém.", "error");
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                }
            }
        });
    },
    changeModeView(){
        $.ajax({
            url: "/api/post/view/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({dark: $("body").hasClass("dark")}),
            success(e) {}
        });
    },
    checkUserDefaultSpace(){
        $.ajax({
            url: "/api/verify/user/space",
            method: "POST",
            contentType: "application/json",
            success(e) {
                if(e.result){
                    account.user_spaces = [];
                    account.user_spaces = e.user_spaces;
                    account.functionAfterCheckDefaultSpace(e.space_id);
                }
                else xAlert("POS", e.message, "error");
            }
        });
    },
    structureDataAfterLoginAccount(defaultSpace, newAccount = true){
        let armazens_pos = $("#armazens_pos");
        armazens_pos.find("div.account").removeClass("active");
        if(account.user_spaces.length > 1){
            if(defaultSpace === null){
                $("#armazem_selecionado_pos").css("display", "");
                $("#iptArmazene").val("ARMAZÉM");
                account.functionAfterSetSpace = function () {
                    account.loadAccountKey().then(value => {
                        account.key = value.accountKey;
                        $("#xModalChooseArmazene").find(".hideTarget").click();
                        location.hash = "fkpg--make-a-sale";
                        categoriasArtigosPOS.init();
                        $("#MST-PIN").find(".hideTarget").click();
                        $("#numeroMesa").text(($("#iptTable").val().trim() || "N/D"));
                        if(pos.conta_id !== null){
                            pos.loadAccountData();
                        }
                    });
                };
                M.toast({html: "Escolha o armazém!", classes: 'rounded'});
                showTarget("xModalChooseArmazene");
            }
            else{
                armazens_pos.find("div.account[armazem_id="+defaultSpace+"]").addClass("active");
                location.hash = "fkpg--make-a-sale";
                categoriasArtigosPOS.init();
                if(!newAccount){
                    pos.loadAccountData();
                }
                $("#MST-PIN").find(".hideTarget").click();
            }
        }
        else{
            // $(".changeBox").css("display", "none");
            location.hash = "fkpg--make-a-sale";
            categoriasArtigosPOS.init();
            if(!newAccount){
                pos.loadAccountData();
            }
            $("#MST-PIN").find(".hideTarget").click();
        }
    }
};

account.loadPost();
$("[admin]").on("click", function () {
    var urlParams = new URLSearchParams(window.location.search);
    let query = "";
    if( urlParams.has( "v" ) && !!urlParams.get( "v" ) ) {
        query = `?v=${urlParams.get( "v" )}`
    }
    location.href = `/admin${ query }`;
});
$(".credentialPIN").on("click", ".list-users li", function () {
    $(this).addClass('active').siblings().removeClass('active');
    $(".credentialPIN .user-selected").text($(this).find("b").text());
    keyboard.pin = "";
    $(".credentialPIN .pinput").find("span").remove();
    if(account.operation !== "changePin")
       setStep.callStep[account.operation]();
});
$("[newAccount]").on("click", function () {
    $("#fkPGReport").removeClass("show");
    if(account.hasValidPost()){
        account.operation = "addAccount";
        account.resetModalAuthentication();
        account.loadUsers(["maguita.pos"]);
    }
});
$("[addAccountModal]").on("click", function () {
    $("#numeroMesa").text(($("#account_description").val().trim() || "N/D"));
    $("#xModalNewAccount .hideTarget").click();
    location.hash = "fkpg--make-a-sale";
    categoriasArtigosPOS.init();
});
$("[changePIN]").on("click", function () {
    if(account.hasValidPost()){
        account.resetModalAuthentication();
        account.operation = "changePin";
        $("#MST-PIN").addClass("changingPIN");
        account.functionGoForward = function () {
            account.logIN();
        };
        account.functionAfterAuth = function (acessoColaborador = null, defaultSpace = null) {
            $(".list-users").find("li").css("pointer-events", "none");
            $(".credentialPIN").addClass("addPIN");
            account.pin.atual = keyboard.pin;
            keyboard.pin = "";
            $(".credentialPIN .pinput").find("span").remove();
            $(".txtChangingPIN").text("Digite o novo PIN");

            account.functionGoForward = function () {
               account.addPIN();
            };
        };
        account.loadUsers(["maguita.pos"]);
    }
});
$("[changeSpacePOS]").on("click", function () {
    account.functionAfterSetSpace = function () {
        $("#histBackCategories").empty().append("<span>Todas</span>");
        categoriasArtigosPOS.load();
        $("#xModalChooseArmazene").find(".hideTarget").click();
    };
});
$("[armazem_venda]").on("click", function () {
    let armazem_selecionado = $("#armazens_pos").find("div.account.active");
    if(armazem_selecionado.length === 0){
        M.toast({html: "Escolha o armazém!", classes: 'rounded'});
        return;
    }
    if(account.user_spaces.find(value => value.data.espaco_id === armazem_selecionado.attr("armazem_id")))
        account.definirArmazem();
    else
        M.toast({html: "Não trabalhas neste armazém!", classes: 'rounded'});
});
$(".listAllAccounts").on("click", "div.accnt", function () {
    account.key = $(this).attr("key");
    if(!location.hash.includes("fkpg")){
        account.resetModalAuthentication();
        account.operation = "loadAccount";
        pos.conta_id = $(this).attr("account_id");
        $("#numeroMesa").text(($(this).find(".number").text() || "N/D"));
        $("#iptTable").val($(this).find(".number").text()).prop("disabled", true);
        account.loadUsers(["maguita.pos"]);
    }
    else{
        pos.conta_id = $(this).attr("account_id");
        if($(this).attr("account_id") === pos.conta_id){
            M.toast({html: "Os artigos atuais no carrinho correspondem a essa conta", classes: 'rounded'});
        }
        else{
            $("#numeroMesa").text(($(this).find(".number").text() || "N/D"));
            pos.loadAccountData();
            $("#theIDOfSlctAccWoutLgn").find(".hideTarget").click();
        }
    }
});
