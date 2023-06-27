var keyboard = {
    pin: "",
    user_list_mouve : {
        38 : function () {
            let li_s = $(".list-users li");
            let li_active = $(".list-users li.active");
            if(li_active.length === 0 || li_active.index() === 0) {
                li_s.last().click();
            }
            else {
                li_active.prev().click();
            }
        },
        40 : function () {
            let li_s = $(".list-users li");
            let li_active = $(".list-users li.active");
            if(li_active.length === 0 || li_active.index() === li_s.length -1) {
                li_s.first().click();
            }
            else {
                li_active.next().click();
            }
        }
    },
};

$('.credentialPIN').on("click",'.pinkey li', function(event) {
    let parse = Number.parseInt($(this).text());
    if(account.post.posto_authmode === 2
        && account.operation !== "changePin"
        && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
        return;
    }
    if (Number.isInteger(parse)) {
        if (keyboard.pin.length < 4) {
            keyboard.pin += parse;
            $(".credentialPIN .pinput").append("<span></span>");
        }
    } else if ($(this).attr("op")=== "clearLast") {
        keyboard.pin = keyboard.pin.substring(0, keyboard.pin.length - 1);
        $(".credentialPIN .pinput").find("span:last").remove();
    } else if ($(this).attr("op") === "clearAll") {
        keyboard.pin = "";
        $(".credentialPIN .pinput").find("span").remove();
    }
});
$(document).keypress(function(evt){
    if($('.credentialPIN').hasClass("show") && !$("#iptTable").is(':focus')){
        let key = String.fromCharCode(evt.keyCode).toUpperCase();
        $(`.credentialPIN .pinkey li:contains(${key})`).click();
    }
});
$(document).keyup(function(evt){
    if(account.post.posto_authmode === 2
        && account.operation !== "changePin"
        && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
        return;
    }
    if($('.credentialPIN').hasClass("show") && !$("#iptTable").is(':focus')){
        if((evt.keyCode === 8 || evt.keyCode === 27)){
            let key = (evt.keyCode === 8) ? "clearLast" : "close";
            $(`.credentialPIN li[op=${key}]`).click();
        }
        if((evt.keyCode === 38 || evt.keyCode === 40)){
            keyboard.user_list_mouve[evt.keyCode]();
        }
    }
});
$(".goForward").on("click", function () {
    if(account.post.posto_authmode === 2
        && $(".credentialPIN").find(".list-users li.active").attr("colab_id") === account.pos_user_session_uuid){
        account.functionGoForward();
        setTimeout(() => {
            $("#numeroMesa").text(($("#iptTable").val().trim() || "N/D"));
        }, 300);
    }
    else{
        if(keyboard.pin.length === 4 && $(".list-users").find("li.active").length > 0){
            account.functionGoForward();
        }
    }
});

