var setStep = {
    callStep: {
        addAccount(){
            if(account.post.posto_authmode === 2
              && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "none");
                account.checkUserDefaultSpace();
                account.functionAfterCheckDefaultSpace = function (space_id) {
                    if(space_id === null) showTarget("xModalChooseArmazene");
                    else{
                        account.loadAccountKey().then(value => {
                            account.key = value.accountKey;
                        });
                    }
                };
                account.functionGoForward = function () {
                    $("#numeroMesa").text(($("#account_description").val().trim() || "N/D"));
                    location.hash = "fkpg--make-a-sale";
                    $("#MST-PIN").find(".hideTarget").click();
                    categoriasArtigosPOS.init();
                };
                account.functionAfterSetSpace = function () {
                    account.loadAccountKey().then(value => {
                        account.key = value.accountKey;
                        $("#xModalChooseArmazene").find(".hideTarget").click();
                    });
                };
            }
            else{
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
                account.functionGoForward = function (){
                    account.logIN();
                };
                account.functionAfterAuth = function (acessoColaborador,  defaultSpace) {
                    if(acessoColaborador === 2) account.definirNovoPIN();
                    else{
                        account.loadAccountKey().then(value => {
                            account.key = value.accountKey;
                            $("#numeroMesa").text(($("#iptTable").val().trim() || "N/D"));
                            account.structureDataAfterLoginAccount(defaultSpace);
                        });
                    }
                };
            }
        },
        showSales(){
            if(account.post.posto_authmode === 2
                && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "none");
                account.functionGoForward = function () {
                    $("#filtro_data_vendas").find("li").eq(0).click();
                    $("#MST-PIN").find(".hideTarget").click();
                    showTarget("fkPGSalesOfDay");
                };
            }
            else{
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
                account.functionGoForward = function () {
                    account.logIN();
                };
                account.functionAfterAuth = function (acessoColaborador,  defaultSpace) {
                    if(acessoColaborador === 2){
                        account.definirNovoPIN();
                    }
                    else{
                        $("#MST-PIN").find(".hideTarget").click();
                        $("#filtro_data_vendas").find("li").eq(0).click();
                        showTarget("fkPGSalesOfDay");
                    }
                };
            }
        },
        fecharCaixa(){
            if(account.post.posto_authmode === 2
                && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "none");
                account.checkUserDefaultSpace();
                account.functionAfterCheckDefaultSpace = function (space_id) {
                    if(space_id === null) showTarget("xModalChooseArmazene");
                };
                account.functionAfterSetSpace = function () {
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                };
                account.functionGoForward = function () {
                    $("#MST-PIN").find(".hideTarget").click();
                    box.loadBox(false);
                };
            }
            else{
                account.functionGoForward = function () {
                    account.logIN();
                };
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
                account.functionAfterAuth = function (acessoColaborador, defaultSpace) {
                    if(acessoColaborador === 2) account.definirNovoPIN();
                    else box.structureDataAfterLoginCloseBox(defaultSpace);

                };
            }
        },
        retalhar(){
            if(account.post.posto_authmode === 2
                && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
                account.checkUserDefaultSpace();
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "none");
                account.functionAfterCheckDefaultSpace = function (space_id) {
                    if(space_id === null) showTarget("xModalChooseArmazene");
                };
                account.functionAfterSetSpace = function () {
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                };
                account.functionGoForward = function () {
                    $("#MST-PIN").find(".hideTarget").click();
                    showTarget("xModalRetalharArtigo");
                    retalho.init();
                };
            }
            else{
                account.functionGoForward = function () {
                   account.logIN();
                };
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
                account.functionAfterAuth = function (acessoColaborador, defaultSpace) {
                    if(acessoColaborador === 2){
                        account.definirNovoPIN();
                    }
                    else{
                        retalho.structureDataAfterLoginShred(defaultSpace);
                    }
                };
            }
        },
        loadAccount(){
            if(account.post.posto_authmode === 2
                && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
                account.checkUserDefaultSpace();
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "none");
                account.functionAfterCheckDefaultSpace = function (space_id) {
                    if(space_id === null) showTarget("xModalChooseArmazene");
                };
                account.functionAfterSetSpace = function () {
                    $("#xModalChooseArmazene").find(".hideTarget").click();
                };
                account.functionGoForward = function () {
                    categoriasArtigosPOS.init();
                    $("#MST-PIN").find(".hideTarget").click();
                    pos.loadAccountData();
                    location.hash = "fkpg--make-a-sale";
                };
            }
            else{
                $('.credentialPIN').find(".pinkey li").css("pointer-events", "auto");
                account.functionGoForward = function () {
                    account.logIN();
                };
                account.functionAfterAuth = function (acessoColaborador, defaultSpace) {
                    if(acessoColaborador === 2){
                        account.definirNovoPIN();
                    }
                    else{
                        if($("#armazens_pos").find("div.account").length > 0)
                            account.structureDataAfterLoginAccount(defaultSpace, false);
                        else xAlert("Nova conta", "O armazém associado a este posto não permite efetuar venda!", "error");
                    }
                };
            }
        }
     }
}

