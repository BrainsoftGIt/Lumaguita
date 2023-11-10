(() =>{
    const login = {
        colaborador_id: null,
        auth({email, senha}){
            $("#login_submit").attr("disabled", true).addClass("loading");
            $.ajax({
                url: "/api/login/admin",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ arg_auth_name: "email", arg_auth_value: email,
                    arg_auth_method: "senha", arg_auth_key: senha}),
                error(){$("#login_submit").attr("disabled", false).removeClass("loading")},
                success(e) {
                    $("#login_submit").attr("disabled", false).removeClass("loading");
                    if (e.result){
                        if(e.colaborador_id){
                            login.colaborador_id = e.colaborador_id;
                            showTarget("xModalActivate", "Olá, "+e.colaborador_nome);
                        }
                       else location.href = "/admin/dashboard";
                    }
                    else xAlert("Login", e.message, "error");
                }
            });
        },
        activateAccount(){
            $("[bt_activate_account]").attr("disabled", true).addClass("loading");
            $.ajax({
                url: "/api/account/activate",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ arg_colaborador_reative: this.colaborador_id, arg_colaborador_id: this.colaborador_id,
                    arg_colaborador_senha: $("#activateAccountPassword").val().trim(), arg_colaborador_pin: $("#activateAccountPIN").val(),
                    arg_start: true }),
                error(){$("[bt_activate_account]").attr("disabled", false).removeClass("loading")},
                success(e) {
                    $("[bt_activate_account]").attr("disabled", false).removeClass("loading");
                    if (e.result) {
                        login.auth({email: $("#login_email").val().trim(), senha: $("#activateAccountPassword").val().trim()});
                    }
                    else xAlert("Ativar conta", e.message, "error");
                }
            });
        }
    };
    window.history.forward();
    $("#login_submit").on("click", function () {
        if(validation1($("#login_email, #login_password"))){
            login.auth({email: $("#login_email").val().trim(), senha: $("#login_password").val().trim()});
        }
    });
    $("#login_password, #login_email").keypress(function (e) {
        if(e.which === 13)
            $("#login_submit").click();
    });
    $("[bt_activate_account]").on("click", function () {
        if(validation1($("#activateAccountPassword, #activateAccountConfirmPassword, #activateAccountPIN, #activateAccountConfirmPIN"))){
            if($("#activateAccountPassword").val().trim() !== $("#activateAccountConfirmPassword").val().trim()){
                xAlert("Ativar conta", "Palavra-passe e confirmar palavra-passse não se correspondem.", "error");
                $("#activateAccountConfirmPassword").focus();
                return;
            }
            if($("#activateAccountPIN").val() !== $("#activateAccountConfirmPIN").val()){
                xAlert("Ativar conta", "PIN e confirmar PIN não se correspondem.", "error");
                $("#activateAccountConfirmPIN").focus();
                return;
            }
            login.activateAccount();
        }
    });
    $("#activateAccountPassword, #activateAccountConfirmPassword, #activateAccountPIN, #activateAccountConfirmPIN").keypress(function (e) {
        if(e.which === 13)
            $("[bt_activate_account]").click();
    });
})();